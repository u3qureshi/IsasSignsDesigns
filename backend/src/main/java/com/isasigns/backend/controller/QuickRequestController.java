package com.isasigns.backend.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.isasigns.backend.dto.customembroidery.SubmitResponse;
import com.isasigns.backend.dto.quickrequest.QuickRequestPayload;
import com.isasigns.backend.service.QuickRequestSubmissionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/quick-requests")
@Tag(name = "Quick Requests", description = "AI-free printing and embroidery requests")
public class QuickRequestController {
    private final QuickRequestSubmissionService submissionService;

    public QuickRequestController(QuickRequestSubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @Operation(summary = "Submit an AI-free printing or embroidery request")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public SubmitResponse submit(
            @RequestPart("request") QuickRequestPayload request,
            @RequestPart(value = "designFile", required = false) MultipartFile designFile) {
        return submissionService.submit(request, designFile);
    }
}
