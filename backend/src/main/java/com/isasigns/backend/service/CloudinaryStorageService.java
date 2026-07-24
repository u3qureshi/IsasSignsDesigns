package com.isasigns.backend.service;

import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.isasigns.backend.exception.ExternalServiceException;
import com.isasigns.backend.service.ImageValidationService.ValidatedImage;

@Service
public class CloudinaryStorageService {
    private final Cloudinary cloudinary;
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
