package com.isasigns.backend.service;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Set;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.isasigns.backend.exception.RequestValidationException;

@Service
public class ImageValidationService {
    private final long maxUploadBytes;
    private final Set<String> allowedTypes;

    public ImageValidationService(
            @Value("${app.custom-embroidery.max-upload-bytes}") long maxUploadBytes,
            @Value("${app.custom-embroidery.allowed-image-types}") String allowedTypes) {
        this.maxUploadBytes = maxUploadBytes;
        this.allowedTypes = Set.copyOf(Arrays.asList(allowedTypes.split(",")));
        ImageIO.scanForPlugins();
    }

    public ValidatedImage validate(MultipartFile file, String fieldName) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        if (file.getSize() > maxUploadBytes) {
            throw invalid(fieldName + " must be 10 MB or smaller.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType.toLowerCase())) {
            throw invalid(fieldName + " must be a PNG, JPEG, or WEBP image.");
        }
        try {
            byte[] bytes = file.getBytes();
            BufferedImage decoded = ImageIO.read(new ByteArrayInputStream(bytes));
            if (decoded == null || decoded.getWidth() < 1 || decoded.getHeight() < 1) {
                throw invalid(fieldName + " is not a readable image.");
            }
            return new ValidatedImage(
                    bytes,
                    contentType.toLowerCase(),
                    safeFilename(file.getOriginalFilename()),
                    decoded.getWidth(),
                    decoded.getHeight());
        } catch (IOException exception) {
            throw invalid(fieldName + " could not be read.");
        }
    }

    public ValidatedImage prepareCloudflareReference(ValidatedImage source) {
        if (source == null) {
            return null;
        }
        try {
            BufferedImage original = ImageIO.read(new ByteArrayInputStream(source.bytes()));
            double scale = Math.min(1.0, 512.0 / Math.max(original.getWidth(), original.getHeight()));
            int width = Math.max(1, (int) Math.floor(original.getWidth() * scale));
            int height = Math.max(1, (int) Math.floor(original.getHeight() * scale));

            BufferedImage output = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
            Graphics2D graphics = output.createGraphics();
            graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
            graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
            graphics.drawImage(original, 0, 0, width, height, null);
            graphics.dispose();

            var buffer = new ByteArrayOutputStream();
            if (!ImageIO.write(output, "png", buffer)) {
                throw invalid("The inspiration image could not be converted for AI generation.");
            }
            return new ValidatedImage(buffer.toByteArray(), "image/png", "inspiration.png", width, height);
        } catch (IOException exception) {
            throw invalid("The inspiration image could not be prepared for AI generation.");
        }
    }

    public ValidatedImage validateGenerated(byte[] bytes, String mediaType) {
        if (bytes == null || bytes.length == 0 || bytes.length > maxUploadBytes) {
            throw invalid("The generated preview image is invalid.");
        }
        try {
            BufferedImage decoded = ImageIO.read(new ByteArrayInputStream(bytes));
            if (decoded == null) {
                throw invalid("The generated preview image is unreadable.");
            }
            String filename = "image/png".equals(mediaType) ? "ai-concept.png" : "ai-concept.jpg";
            return new ValidatedImage(bytes, mediaType, filename, decoded.getWidth(), decoded.getHeight());
        } catch (IOException exception) {
            throw invalid("The generated preview image is unreadable.");
        }
    }

    private String safeFilename(String filename) {
        if (filename == null || filename.isBlank()) {
            return "upload";
        }
        String normalized = filename.replace("\\", "/");
        normalized = normalized.substring(normalized.lastIndexOf('/') + 1);
        return normalized.length() > 255 ? normalized.substring(normalized.length() - 255) : normalized;
    }

    private RequestValidationException invalid(String message) {
        return new RequestValidationException(java.util.List.of(message));
    }

    public record ValidatedImage(
            byte[] bytes,
            String mediaType,
            String originalFilename,
            int width,
            int height) {
    }
}
