package com.isasigns.backend.service;

import java.net.URI;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.isasigns.backend.exception.AiProviderLimitException;
import com.isasigns.backend.exception.ExternalServiceException;
import com.isasigns.backend.service.ImageValidationService.ValidatedImage;

@Service
public class CloudflareImageService {
    private final RestClient restClient;
    private final String accountId;
    private final String apiToken;
    private final String model;
    private final ObjectMapper objectMapper;

    public CloudflareImageService(
            RestClient.Builder restClientBuilder,
            ObjectMapper objectMapper,
            @Value("${app.cloudflare.account-id}") String accountId,
            @Value("${app.cloudflare.api-token}") String apiToken,
            @Value("${app.cloudflare.ai-model}") String model) {
        this.restClient = restClientBuilder.build();
        this.objectMapper = objectMapper;
        this.accountId = accountId;
        this.apiToken = apiToken;
        this.model = model;
    }

    public GeneratedImage generate(String prompt, ValidatedImage referenceImage) {
        requireConfiguration();

        MultipartBodyBuilder body = new MultipartBodyBuilder();
        body.part("prompt", prompt);
        body.part("width", "1024");
        body.part("height", "1024");
        if (!isKleinModel()) {
            body.part("steps", "25");
        }
        if (referenceImage != null) {
            body.part("input_image_0",
                    new NamedByteArrayResource(referenceImage.bytes(), referenceImage.originalFilename()))
                    .contentType(MediaType.parseMediaType(referenceImage.mediaType()));
        }

        try {
            JsonNode response = restClient.post()
                    .uri(URI.create("https://api.cloudflare.com/client/v4/accounts/"
                            + accountId + "/ai/run/" + model))
                    .headers(headers -> headers.setBearerAuth(apiToken))
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(body.build())
                    .retrieve()
                    .body(JsonNode.class);

            if (response == null || !response.path("success").asBoolean(false)) {
                throw new ExternalServiceException("Cloudflare could not generate the AI preview.");
            }
            String base64 = response.path("result").path("image").asText("");
            if (base64.isBlank()) {
                throw new ExternalServiceException("Cloudflare returned no preview image.");
            }
            int comma = base64.indexOf(',');
            if (base64.startsWith("data:") && comma >= 0) {
                base64 = base64.substring(comma + 1);
            }
            byte[] bytes = Base64.getDecoder().decode(base64);
            return new GeneratedImage(bytes, detectMediaType(bytes), model);
        } catch (RestClientResponseException exception) {
            if (exception.getStatusCode().value() == 429) {
                throw classifyRateLimit(exception);
            }
            throw new ExternalServiceException(
                    "Cloudflare rejected the AI preview request (HTTP " + exception.getStatusCode().value() + ").");
        } catch (IllegalArgumentException exception) {
            throw new ExternalServiceException("Cloudflare returned an invalid preview image.", exception);
        }
    }

    public String getModel() {
        return model;
    }

    private void requireConfiguration() {
        if (accountId.isBlank() || apiToken.isBlank() || model.isBlank()) {
            throw new ExternalServiceException("Cloudflare AI is not configured on the backend.");
        }
    }

    private AiProviderLimitException classifyRateLimit(RestClientResponseException exception) {
        int providerCode = 0;
        String providerMessage = "";
        try {
            JsonNode response = objectMapper.readTree(exception.getResponseBodyAsString());
            JsonNode firstError = response.path("errors").path(0);
            providerCode = firstError.path("code").asInt(0);
            providerMessage = firstError.path("message").asText("").toLowerCase(Locale.ROOT);
        } catch (Exception ignored) {
            // The HTTP status is still sufficient for a safe generic rate-limit response.
        }

        if (providerCode == 3036
                || providerCode == 4006
                || providerMessage.contains("daily free allocation")
                || providerMessage.contains("used up your daily")) {
            return new AiProviderLimitException(
                    "Today's AI preview allowance has been used. Try again after Cloudflare resets "
                            + "the allowance at 00:00 UTC, or enable the Workers Paid plan.",
                    secondsUntilNextUtcDay());
        }
        if (providerCode == 3040 || providerMessage.contains("out of capacity")) {
            return new AiProviderLimitException(
                    "AI preview generation is temporarily busy. Please wait a minute and try again.",
                    60);
        }
        return new AiProviderLimitException(
                "AI preview generation is temporarily rate-limited. Please wait a minute and try again.",
                60);
    }

    private long secondsUntilNextUtcDay() {
        Instant now = Instant.now();
        Instant nextReset = now.truncatedTo(ChronoUnit.DAYS).plus(1, ChronoUnit.DAYS);
        return Math.max(1, Duration.between(now, nextReset).getSeconds());
    }

    private boolean isKleinModel() {
        return model.contains("flux-2-klein");
    }

    private String detectMediaType(byte[] bytes) {
        if (bytes.length >= 8
                && bytes[0] == (byte) 0x89
                && bytes[1] == 0x50
                && bytes[2] == 0x4e
                && bytes[3] == 0x47) {
            return "image/png";
        }
        return "image/jpeg";
    }

    public record GeneratedImage(byte[] bytes, String mediaType, String model) {
    }

    private static final class NamedByteArrayResource extends ByteArrayResource {
        private final String filename;

        private NamedByteArrayResource(byte[] byteArray, String filename) {
            super(byteArray);
            this.filename = filename;
        }

        @Override
        public String getFilename() {
            return filename;
        }
    }
}
