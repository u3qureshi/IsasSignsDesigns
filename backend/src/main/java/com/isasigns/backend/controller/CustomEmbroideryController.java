package com.isasigns.backend.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.isasigns.backend.dto.customembroidery.CustomEmbroideryPayload;
import com.isasigns.backend.dto.customembroidery.PreviewResponse;
import com.isasigns.backend.dto.customembroidery.SubmitResponse;
import com.isasigns.backend.service.CustomEmbroideryPreviewService;
import com.isasigns.backend.service.CustomEmbroiderySubmissionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/custom-embroidery")
@Tag(name = "Custom Embroidery", description = "AI preview and submitted custom embroidery request endpoints")
public class CustomEmbroideryController {
    private final CustomEmbroideryPreviewService previewService;
    private final CustomEmbroiderySubmissionService submissionService;

    public CustomEmbroideryController(
            CustomEmbroideryPreviewService previewService,
            CustomEmbroiderySubmissionService submissionService) {
        this.previewService = previewService;
        this.submissionService = submissionService;
    }

    @Operation(summary = "Generate one AI embroidery preview")
    @PostMapping(value = "/previews", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public PreviewResponse preview(
            @RequestPart("request") CustomEmbroideryPayload request,
            @RequestPart(value = "customerImage", required = false) MultipartFile customerImage) {
        return previewService.generate(request, customerImage);
    }

    @Operation(summary = "Persist a submitted custom embroidery request")
    @PostMapping(value = "/requests", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public SubmitResponse submit(
            @RequestPart("request") CustomEmbroideryPayload request,
            @RequestPart(value = "customerImage", required = false) MultipartFile customerImage,
            @RequestPart(value = "generatedImage", required = false) MultipartFile generatedImage,
            @RequestPart(value = "previewToken", required = false) String previewToken) {
        return submissionService.submit(request, customerImage, generatedImage, previewToken);
    }
}
