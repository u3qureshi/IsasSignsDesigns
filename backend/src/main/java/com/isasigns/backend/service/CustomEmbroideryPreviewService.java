package com.isasigns.backend.service;

import java.util.Base64;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.isasigns.backend.dto.customembroidery.CustomEmbroideryPayload;
import com.isasigns.backend.dto.customembroidery.PreviewResponse;

@Service
public class CustomEmbroideryPreviewService {
    private final CustomEmbroideryValidationService validationService;
    private final ImageValidationService imageValidationService;
    private final EmbroideryPromptService promptService;
    private final CloudflareImageService cloudflareImageService;
    private final PreviewTokenService previewTokenService;

    public CustomEmbroideryPreviewService(
            CustomEmbroideryValidationService validationService,
            ImageValidationService imageValidationService,
            EmbroideryPromptService promptService,
            CloudflareImageService cloudflareImageService,
            PreviewTokenService previewTokenService) {
        this.validationService = validationService;
        this.imageValidationService = imageValidationService;
        this.promptService = promptService;
        this.cloudflareImageService = cloudflareImageService;
        this.previewTokenService = previewTokenService;
    }

    public PreviewResponse generate(CustomEmbroideryPayload payload, MultipartFile customerImage) {
        validationService.validateForPreview(payload, customerImage);
        var validatedUpload = imageValidationService.validate(customerImage, "Customer image");
        var reference = "inspiration".equals(payload.aiMode())
                ? imageValidationService.prepareCloudflareReference(validatedUpload)
                : null;
        String prompt = promptService.build(payload);
        var generated = cloudflareImageService.generate(prompt, reference);
        var validatedGenerated = imageValidationService.validateGenerated(
                generated.bytes(), generated.mediaType());
        var issuedToken = previewTokenService.issue(validatedGenerated.bytes(), generated.model());
        return new PreviewResponse(
                Base64.getEncoder().encodeToString(validatedGenerated.bytes()),
                validatedGenerated.mediaType(),
                issuedToken.token(),
                issuedToken.expiresAt());
    }
}
