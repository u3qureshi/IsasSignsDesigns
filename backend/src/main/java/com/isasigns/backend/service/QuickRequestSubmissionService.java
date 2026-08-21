package com.isasigns.backend.service;

import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.isasigns.backend.dto.customembroidery.CustomEmbroideryPayload;
import com.isasigns.backend.dto.customembroidery.SubmitResponse;
import com.isasigns.backend.dto.quickrequest.QuickRequestPayload;
import com.isasigns.backend.dto.quickrequest.QuickRequestProductPayload;

@Service
public class QuickRequestSubmissionService {
    private static final Set<String> STUDIO_ITEMS = Set.of(
            "Hoodie", "Crewneck", "Pants", "Sweatpants", "Jeans", "Tote bag", "Towel",
            "T-shirt", "Beanie", "Hat");

    private final QuickRequestValidationService validationService;
    private final CustomEmbroiderySubmissionService submissionService;

    public QuickRequestSubmissionService(
            QuickRequestValidationService validationService,
            CustomEmbroiderySubmissionService submissionService) {
        this.validationService = validationService;
        this.submissionService = submissionService;
    }

    public SubmitResponse submit(QuickRequestPayload request, MultipartFile designFile) {
        validationService.validate(request);
        QuickRequestProductPayload firstProduct = request.products().getFirst();
        boolean oneProduct = request.products().size() == 1;
        String firstItem = displayItem(firstProduct);
        String itemType = oneProduct && STUDIO_ITEMS.contains(firstItem) ? firstItem : "Other";
        String otherItem = "Other".equals(itemType)
                ? (oneProduct ? firstItem : "Multiple products — see quick request details")
                : null;
        int totalQuantity = request.products().stream()
                .mapToInt(QuickRequestProductPayload::quantity)
                .sum();

        var payload = new CustomEmbroideryPayload(
                request.firstName().trim() + " " + request.lastName().trim(),
                "email",
                request.email().trim(),
                CustomEmbroideryValidationService.digits(request.phone()),
                false,
                buildRequestDetails(request),
                null,
                "quick-request",
                "exact",
                "not-specified",
                itemType,
                otherItem,
                null,
                "Other",
                "To be confirmed",
                "recommend",
                null,
                null,
                totalQuantity,
                false,
                false,
                false);

        return submissionService.submitQuick(payload, designFile, request.service());
    }

    private String buildRequestDetails(QuickRequestPayload request) {
        var details = new StringBuilder("Company / organization: ")
                .append(displayValue(request.company()))
                .append(System.lineSeparator())
                .append(System.lineSeparator())
                .append("Products:");
        for (int index = 0; index < request.products().size(); index += 1) {
            var product = request.products().get(index);
            details.append(System.lineSeparator())
                    .append(index + 1)
                    .append(". ")
                    .append(displayItem(product))
                    .append(" — quantity ")
                    .append(product.quantity());
        }
        details.append(System.lineSeparator())
                .append(System.lineSeparator())
                .append("Special instructions / notes: ")
                .append(displayValue(request.notes()));
        return details.toString();
    }

    private String displayItem(QuickRequestProductPayload product) {
        return "Other".equals(product.itemType())
                ? product.customItem().trim()
                : product.itemType().trim();
    }

    private String displayValue(String value) {
        return value == null || value.isBlank() ? "Not provided" : value.trim();
    }
}
