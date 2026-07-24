package com.isasigns.backend.service;

import java.time.ZoneId;
import java.time.Year;
import java.util.ArrayList;
import java.util.Locale;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;

import com.isasigns.backend.dto.customembroidery.CustomEmbroideryPayload;
import com.isasigns.backend.dto.customembroidery.SubmitResponse;
import com.isasigns.backend.model.CustomEmbroideryRequest;
import com.isasigns.backend.model.CustomEmbroideryRequestImage;
import com.isasigns.backend.repository.CustomEmbroideryRequestImageRepository;
import com.isasigns.backend.repository.CustomEmbroideryRequestRepository;
import com.isasigns.backend.service.CloudinaryStorageService.UploadedAsset;
import com.isasigns.backend.service.ImageValidationService.ValidatedImage;

@Service
public class CustomEmbroiderySubmissionService {
    private final CustomEmbroideryValidationService validationService;
    private final ImageValidationService imageValidationService;
    private final PreviewTokenService previewTokenService;
    private final EmbroideryPromptService promptService;
    private final CloudflareImageService cloudflareImageService;
    private final CloudinaryStorageService storageService;
    private final CustomEmbroideryRequestRepository requestRepository;
    private final CustomEmbroideryRequestImageRepository imageRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final ZoneId businessTimeZone;

    public CustomEmbroiderySubmissionService(
            CustomEmbroideryValidationService validationService,
            ImageValidationService imageValidationService,
            PreviewTokenService previewTokenService,
            EmbroideryPromptService promptService,
            CloudflareImageService cloudflareImageService,
            CloudinaryStorageService storageService,
            CustomEmbroideryRequestRepository requestRepository,
            CustomEmbroideryRequestImageRepository imageRepository,
            ApplicationEventPublisher eventPublisher,
            @Value("${app.time-zone}") String businessTimeZone) {
        this.validationService = validationService;
        this.imageValidationService = imageValidationService;
        this.previewTokenService = previewTokenService;
        this.promptService = promptService;
        this.cloudflareImageService = cloudflareImageService;
        this.storageService = storageService;
        this.requestRepository = requestRepository;
        this.imageRepository = imageRepository;
        this.eventPublisher = eventPublisher;
        this.businessTimeZone = ZoneId.of(businessTimeZone);
    }

    @Transactional
    public SubmitResponse submit(
            CustomEmbroideryPayload payload,
            MultipartFile customerImage,
            MultipartFile generatedImage,
            String previewToken) {
        validationService.validateForSubmit(payload, customerImage, generatedImage, previewToken);
        ValidatedImage validatedCustomer = imageValidationService.validate(customerImage, "Customer image");
        ValidatedImage validatedGenerated = imageValidationService.validate(generatedImage, "Generated image");
        boolean aiUsed = isAiMode(payload.aiMode()) && validatedGenerated != null;
        if (aiUsed) {
            previewTokenService.verify(previewToken, validatedGenerated.bytes());
        }

        String requestNumber = createRequestNumber();
        String normalizedContact = "email".equals(payload.preferredContact())
                ? payload.email().trim().toLowerCase(Locale.ROOT)
                : CustomEmbroideryValidationService.digits(payload.phone());
        String prompt = aiUsed ? promptService.build(payload) : null;

        var uploadedAssets = new ArrayList<UploadedAsset>();
        try {
            UploadedAsset customerAsset = null;
            UploadedAsset generatedAsset = null;
            if (validatedCustomer != null) {
                customerAsset = storageService.upload(validatedCustomer, requestNumber, "CUSTOMER_UPLOAD");
                uploadedAssets.add(customerAsset);
            }
            if (validatedGenerated != null) {
                generatedAsset = storageService.upload(validatedGenerated, requestNumber, "AI_GENERATED_CONCEPT");
                uploadedAssets.add(generatedAsset);
            }

            CustomEmbroideryRequest request = new CustomEmbroideryRequest(
                    requestNumber,
                    payload.fullName().trim(),
                    payload.preferredContact(),
                    blankToNull(payload.email()),
                    blankToNull(payload.phone()) == null
                            ? null
                            : CustomEmbroideryValidationService.digits(payload.phone()),
                    previewTokenService.hmacContact(normalizedContact),
                    payload.ideaDescription().trim(),
                    blankToNull(payload.exactText()),
                    payload.aiMode(),
                    aiUsed,
                    payload.imageIntent(),
                    Boolean.TRUE.equals(payload.aiPreviewFailed()),
                    payload.itemProvider(),
                    payload.itemType(),
                    "Other".equals(payload.itemType()) ? blankToNull(payload.otherItem()) : null,
                    blankToNull(payload.garmentColor()),
                    payload.placement(),
                    "Other".equals(payload.placement()) ? blankToNull(payload.otherPlacement()) : null,
                    payload.sizeMode(),
                    "known".equals(payload.sizeMode()) ? payload.width() : null,
                    "known".equals(payload.sizeMode()) ? payload.height() : null,
                    payload.quantity(),
                    Boolean.TRUE.equals(payload.estimateAccepted()),
                    Boolean.TRUE.equals(payload.contentRightsConfirmed()),
                    aiUsed ? "Cloudflare Workers AI" : null,
                    aiUsed ? cloudflareImageService.getModel() : null,
                    prompt);
            requestRepository.saveAndFlush(request);

            int displayOrder = 0;
            if (customerAsset != null) {
                imageRepository.save(toImageEntity(
                        request.getId(),
                        "exact-upload".equals(payload.aiMode())
                                ? "UPLOADED_EXACT_ARTWORK"
                                : "UPLOADED_REFERENCE",
                        validatedCustomer,
                        customerAsset,
                        payload.imageIntent(),
                        displayOrder++));
            }
            if (generatedAsset != null) {
                imageRepository.save(toImageEntity(
                        request.getId(),
                        "AI_GENERATED_CONCEPT",
                        validatedGenerated,
                        generatedAsset,
                        null,
                        displayOrder));
            }
            imageRepository.flush();
            eventPublisher.publishEvent(new CustomEmbroiderySubmittedEvent(request.getId()));
            return new SubmitResponse(
                    request.getId(), request.getRequestNumber(), request.getStatus(), request.getCreatedAt());
        } catch (RuntimeException exception) {
            uploadedAssets.forEach(storageService::deleteQuietly);
            throw exception;
        }
    }

    private CustomEmbroideryRequestImage toImageEntity(
            UUID requestId,
            String imageType,
            ValidatedImage image,
            UploadedAsset asset,
            String imageIntent,
            int displayOrder) {
        return new CustomEmbroideryRequestImage(
                requestId,
                imageType,
                image.originalFilename(),
                asset.assetId(),
                asset.publicId(),
                asset.version(),
                asset.resourceType(),
                asset.deliveryType(),
                asset.format(),
                asset.width(),
                asset.height(),
                asset.bytes(),
                imageIntent,
                displayOrder);
    }

    private String createRequestNumber() {
        String requestNumber;
        do {
            requestNumber = "TNB-EMB-" + Year.now(businessTimeZone).getValue() + "-"
                    + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
        } while (requestRepository.existsByRequestNumber(requestNumber));
        return requestNumber;
    }

    private boolean isAiMode(String aiMode) {
        return "generate".equals(aiMode) || "inspiration".equals(aiMode);
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
