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
@RequestMapping("/api/custom-printing")
@Tag(name = "Custom Printing", description = "AI preview and submitted custom printing request endpoints")
public class CustomPrintingController {
    private static final String SERVICE_TYPE = "printing";

    private final CustomEmbroideryPreviewService previewService;
    private final CustomEmbroiderySubmissionService submissionService;

    public CustomPrintingController(
            CustomEmbroideryPreviewService previewService,
            CustomEmbroiderySubmissionService submissionService) {
        this.previewService = previewService;
        this.submissionService = submissionService;
    }

    @Operation(summary = "Generate one AI printing preview")
    @PostMapping(value = "/previews", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public PreviewResponse preview(
            @RequestPart("request") CustomEmbroideryPayload request,
            @RequestPart(value = "customerImage", required = false) MultipartFile customerImage) {
        return previewService.generate(request, customerImage, SERVICE_TYPE);
    }

    @Operation(summary = "Persist a submitted custom printing request")
    @PostMapping(value = "/requests", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public SubmitResponse submit(
            @RequestPart("request") CustomEmbroideryPayload request,
            @RequestPart(value = "customerImage", required = false) MultipartFile customerImage,
            @RequestPart(value = "generatedImage", required = false) MultipartFile generatedImage,
            @RequestPart(value = "previewToken", required = false) String previewToken) {
        return submissionService.submit(
                request, customerImage, generatedImage, previewToken, SERVICE_TYPE);
    }
}
