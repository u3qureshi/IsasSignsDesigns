package com.isasigns.backend.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.isasigns.backend.exception.ExternalServiceException;
import com.isasigns.backend.model.CustomEmbroideryRequestImage;
import com.isasigns.backend.service.ImageValidationService.ValidatedImage;

@Service
public class CloudinaryStorageService {
    private static final Logger LOGGER = LoggerFactory.getLogger(CloudinaryStorageService.class);
    private static final int MAX_EMAIL_ATTACHMENT_BYTES = 5 * 1024 * 1024;
    private final Cloudinary cloudinary;
    private final HttpClient httpClient;
    private final String cloudName;
    private final String apiKey;
    private final String apiSecret;
    private final String deliveryType;

    public CloudinaryStorageService(
            @Value("${app.cloudinary.cloud-name}") String cloudName,
            @Value("${app.cloudinary.api-key}") String apiKey,
            @Value("${app.cloudinary.api-secret}") String apiSecret,
            @Value("${app.cloudinary.delivery-type}") String deliveryType) {
        this.cloudName = cloudName;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.deliveryType = deliveryType;
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true));
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    public UploadedAsset upload(ValidatedImage image, String requestNumber, String role) {
        requireConfiguration();
        String publicId = "custom-embroidery/" + requestNumber + "/"
                + role.toLowerCase().replace('_', '-') + "-" + UUID.randomUUID();
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(
                    image.bytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "resource_type", "image",
                            "type", deliveryType,
                            "overwrite", false,
                            "use_filename", false,
                            "tags", new String[] { "custom-embroidery", requestNumber, role.toLowerCase() }));
            return new UploadedAsset(
                    stringValue(result, "asset_id"),
                    stringValue(result, "public_id"),
                    longValue(result, "version"),
                    stringValue(result, "resource_type"),
                    stringValue(result, "type"),
                    stringValue(result, "format"),
                    intValue(result, "width"),
                    intValue(result, "height"),
                    longValue(result, "bytes"));
        } catch (Exception exception) {
            throw new ExternalServiceException("The image could not be stored securely.", exception);
        }
    }

    public void deleteQuietly(UploadedAsset asset) {
        if (asset == null || asset.publicId() == null) {
            return;
        }
        try {
            cloudinary.uploader().destroy(
                    asset.publicId(),
                    ObjectUtils.asMap("resource_type", "image", "type", asset.deliveryType()));
        } catch (Exception ignored) {
            // Cleanup is best-effort; the original failure remains the actionable error.
        }
    }

    public List<EmailAttachment> createEmailAttachments(
            List<CustomEmbroideryRequestImage> images) {
        var attachments = new ArrayList<EmailAttachment>();
        for (CustomEmbroideryRequestImage image : images) {
            try {
                attachments.add(downloadEmailAttachment(image));
            } catch (RuntimeException exception) {
                LOGGER.warn(
                        "Could not prepare {} as an email attachment; the notification will still be sent.",
                        image.getCloudinaryPublicId(),
                        exception);
            }
        }
        return List.copyOf(attachments);
    }

    private EmailAttachment downloadEmailAttachment(CustomEmbroideryRequestImage image) {
        requireConfiguration();
        String url = cloudinary.url()
                .secure(true)
                .signed(true)
                .resourceType(image.getResourceType())
                .type(image.getDeliveryType())
                .version(image.getCloudinaryVersion())
                .format("jpg")
                .transformation(new Transformation<>()
                        .width(1600)
                        .height(1600)
                        .crop("limit")
                        .quality("auto:good"))
                .generate(image.getCloudinaryPublicId());
        HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                .timeout(Duration.ofSeconds(15))
                .header("Accept", "image/jpeg")
                .GET()
                .build();
        try {
            HttpResponse<byte[]> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofByteArray());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IllegalStateException(
                        "Cloudinary returned HTTP " + response.statusCode() + ".");
            }
            byte[] content = response.body();
            if (content.length == 0 || content.length > MAX_EMAIL_ATTACHMENT_BYTES) {
                throw new IllegalStateException(
                        "The generated email preview has an invalid size of " + content.length + " bytes.");
            }
            return new EmailAttachment(
                    emailFilename(image),
                    "image/jpeg",
                    content);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("The Cloudinary attachment download was interrupted.", exception);
        } catch (java.io.IOException exception) {
            throw new IllegalStateException("The Cloudinary attachment could not be downloaded.", exception);
        }
    }

    private String emailFilename(CustomEmbroideryRequestImage image) {
        if ("AI_GENERATED_CONCEPT".equals(image.getImageType())) {
            return "thread-and-butter-ai-preview.jpg";
        }
        return "thread-and-butter-uploaded-artwork.jpg";
    }

    private void requireConfiguration() {
        if (cloudName.isBlank() || apiKey.isBlank() || apiSecret.isBlank()) {
            throw new ExternalServiceException("Cloudinary storage is not configured on the backend.");
        }
        if (!"authenticated".equals(deliveryType) && !"private".equals(deliveryType)) {
            throw new ExternalServiceException("Cloudinary delivery type must be authenticated or private.");
        }
    }

    private String stringValue(Map<String, Object> result, String key) {
        Object value = result.get(key);
        return value == null ? "" : value.toString();
    }

    private Long longValue(Map<String, Object> result, String key) {
        Object value = result.get(key);
        return value instanceof Number number ? number.longValue() : null;
    }

    private Integer intValue(Map<String, Object> result, String key) {
        Object value = result.get(key);
        return value instanceof Number number ? number.intValue() : null;
    }

    public record UploadedAsset(
            String assetId,
            String publicId,
            Long version,
            String resourceType,
            String deliveryType,
            String format,
            Integer width,
            Integer height,
            Long bytes) {
    }
}
