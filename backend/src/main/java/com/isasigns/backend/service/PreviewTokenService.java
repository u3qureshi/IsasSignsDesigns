package com.isasigns.backend.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.HexFormat;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.isasigns.backend.exception.RequestValidationException;

@Service
public class PreviewTokenService {
    private static final long PREVIEW_LIFETIME_SECONDS = 60 * 60;
    private final String secret;

    public PreviewTokenService(@Value("${app.custom-embroidery.hmac-secret}") String secret) {
        this.secret = secret;
    }

    public IssuedPreviewToken issue(byte[] generatedImage, String model) {
        requireSecret();
        long expiresAt = Instant.now().plusSeconds(PREVIEW_LIFETIME_SECONDS).getEpochSecond();
        String payload = sha256(generatedImage) + "|" + expiresAt + "|" + model;
        String encodedPayload = encode(payload.getBytes(StandardCharsets.UTF_8));
        String signature = encode(hmac(encodedPayload.getBytes(StandardCharsets.UTF_8)));
        return new IssuedPreviewToken(
                encodedPayload + "." + signature,
                OffsetDateTime.ofInstant(Instant.ofEpochSecond(expiresAt), ZoneOffset.UTC));
    }

    public void verify(String token, byte[] generatedImage) {
        requireSecret();
        try {
            String[] parts = token.split("\\.", 2);
            if (parts.length != 2) {
                throw invalidToken();
            }
            byte[] expectedSignature = hmac(parts[0].getBytes(StandardCharsets.UTF_8));
            byte[] suppliedSignature = Base64.getUrlDecoder().decode(parts[1]);
            if (!MessageDigest.isEqual(expectedSignature, suppliedSignature)) {
                throw invalidToken();
            }
            String payload = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
            String[] values = payload.split("\\|", 3);
            if (values.length != 3
                    || !MessageDigest.isEqual(
                            values[0].getBytes(StandardCharsets.UTF_8),
                            sha256(generatedImage).getBytes(StandardCharsets.UTF_8))
                    || Instant.now().getEpochSecond() > Long.parseLong(values[1])) {
                throw invalidToken();
            }
        } catch (IllegalArgumentException exception) {
            throw invalidToken();
        }
    }

    public String hmacContact(String normalizedContact) {
        requireSecret();
        return HexFormat.of().formatHex(hmac(normalizedContact.getBytes(StandardCharsets.UTF_8)));
    }

    private byte[] hmac(byte[] value) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return mac.doFinal(value);
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to initialize secure HMAC signing", exception);
        }
    }

    private String sha256(byte[] value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value));
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to hash generated image", exception);
        }
    }

    private String encode(byte[] value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value);
    }

    private void requireSecret() {
        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException("CUSTOM_EMBROIDERY_HMAC_SECRET must contain at least 32 characters");
        }
    }

    private RequestValidationException invalidToken() {
        return new RequestValidationException(java.util.List.of(
                "The generated preview is invalid or expired. Generate a new preview and try again."));
    }

    public record IssuedPreviewToken(String token, OffsetDateTime expiresAt) {
    }
}
