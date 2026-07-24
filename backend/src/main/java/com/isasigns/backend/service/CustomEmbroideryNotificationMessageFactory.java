package com.isasigns.backend.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Component;

import com.isasigns.backend.model.CustomEmbroideryRequest;
import com.isasigns.backend.model.CustomEmbroideryRequestImage;

@Component
public class CustomEmbroideryNotificationMessageFactory {
    public CustomEmbroideryNotificationMessages create(
            CustomEmbroideryRequest request,
            List<CustomEmbroideryRequestImage> images) {
        String item = displayValue(
                "Other".equals(request.getItemType())
                        ? request.getCustomItemDescription()
                        : request.getItemType());
        String placement = displayValue(
                "Other".equals(request.getPlacement())
                        ? request.getCustomPlacementDescription()
                        : request.getPlacement());
        String size = displaySize(request);
        String requestNumber = request.getRequestNumber();

        String customerSubject = "Thread & Butter request received — " + requestNumber;
        String customerBody = """
                Hi %s,

                Thank you for submitting your custom embroidery request to Thread & Butter.

                Request number: %s
                Idea: %s
                Exact text: %s
                Artwork choice: %s
                Image-use choice: %s
                Item provider: %s
                Item: %s
                Garment colour: %s
                Placement: %s
                Requested size: %s
                Quantity: %d
                AI preview generated: %s
                AI preview failed: %s

                This is a request for review and an estimate, not a confirmed order. We will review the artwork,
                embroidery suitability, item availability, stitch count, thread colours, pricing, tax, delivery,
                and shipping before production.

                Thread & Butter
                """.formatted(
                request.getCustomerName(),
                requestNumber,
                displayValue(request.getIdeaDescription()),
                displayValue(request.getExactText()),
                displayValue(request.getAiMode()),
                displayValue(request.getCustomerImageIntent()),
                displayValue(request.getItemProvider()),
                item,
                displayValue(request.getGarmentColor()),
                placement,
                size,
                request.getQuantity(),
                yesNo(request.isAiUsed()),
                yesNo(request.isAiPreviewFailed()));
        String customerSms = "Thread & Butter received request %s for %d %s item(s). "
                .formatted(requestNumber, request.getQuantity(), item)
                + "We will review it and contact you with next steps.";

        String adminSubject = "New Thread & Butter embroidery request — " + requestNumber;
        String adminBody = """
                A new custom embroidery request was submitted.

                REQUEST
                Request number: %s
                Status: %s
                Submitted at: %s

                CUSTOMER
                Full name: %s
                Preferred contact method: %s
                Email: %s
                Phone: %s

                DESIGN
                Idea description: %s
                Exact requested text: %s
                Artwork choice: %s
                Customer image intent: %s
                AI image generated: %s
                AI preview failed: %s
                AI provider: %s
                AI model: %s
                Generated prompt: %s

                ITEM
                Item provider: %s
                Item type: %s
                Custom item description: %s
                Garment colour: %s
                Placement: %s
                Custom placement description: %s
                Size mode: %s
                Requested width: %s
                Requested height: %s
                Quantity: %d

                ACKNOWLEDGEMENTS
                Preliminary-estimate acknowledgement: %s
                Content-rights confirmation: %s

                SAVED IMAGES
                %s
                """.formatted(
                requestNumber,
                request.getStatus(),
                request.getCreatedAt(),
                request.getCustomerName(),
                request.getPreferredContactMethod(),
                displayValue(request.getCustomerEmail()),
                displayValue(request.getCustomerPhone()),
                displayValue(request.getIdeaDescription()),
                displayValue(request.getExactText()),
                displayValue(request.getAiMode()),
                displayValue(request.getCustomerImageIntent()),
                yesNo(request.isAiUsed()),
                yesNo(request.isAiPreviewFailed()),
                displayValue(request.getAiProvider()),
                displayValue(request.getAiModel()),
                displayValue(request.getGeneratedPrompt()),
                displayValue(request.getItemProvider()),
                displayValue(request.getItemType()),
                displayValue(request.getCustomItemDescription()),
                displayValue(request.getGarmentColor()),
                displayValue(request.getPlacement()),
                displayValue(request.getCustomPlacementDescription()),
                displayValue(request.getSizeMode()),
                displayMeasurement(request.getRequestedWidthInches()),
                displayMeasurement(request.getRequestedHeightInches()),
                request.getQuantity(),
                yesNo(request.isCustomerAcknowledgedEstimate()),
                yesNo(request.isCustomerConfirmedContentRights()),
                displayImages(images));
        String adminSms = "New Thread & Butter request %s: %s, %d × %s, %s. Preferred contact: %s."
                .formatted(
                        requestNumber,
                        request.getCustomerName(),
                        request.getQuantity(),
                        item,
                        placement,
                        request.getPreferredContactMethod());

        return new CustomEmbroideryNotificationMessages(
                customerSubject,
                customerBody,
                customerSms,
                adminSubject,
                adminBody,
                adminSms);
    }

    private String displayImages(List<CustomEmbroideryRequestImage> images) {
        if (images.isEmpty()) {
            return "No image was saved.";
        }
        var result = new StringBuilder();
        for (int index = 0; index < images.size(); index += 1) {
            CustomEmbroideryRequestImage image = images.get(index);
            if (index > 0) {
                result.append(System.lineSeparator());
            }
            result.append(index + 1)
                    .append(". Type: ").append(displayValue(image.getImageType()))
                    .append("; filename: ").append(displayValue(image.getOriginalFilename()))
                    .append("; intent: ").append(displayValue(image.getCustomerImageIntent()))
                    .append("; format: ").append(displayValue(image.getFormat()))
                    .append("; dimensions: ").append(displayDimension(image))
                    .append("; bytes: ").append(image.getBytes() == null ? "Not available" : image.getBytes())
                    .append("; Cloudinary public ID: ").append(displayValue(image.getCloudinaryPublicId()));
        }
        return result.toString();
    }

    private String displayDimension(CustomEmbroideryRequestImage image) {
        if (image.getWidth() == null || image.getHeight() == null) {
            return "Not available";
        }
        return image.getWidth() + " × " + image.getHeight();
    }

    private String displaySize(CustomEmbroideryRequest request) {
        if (!"known".equals(request.getSizeMode())) {
            return "Thread & Butter to recommend";
        }
        return displayMeasurement(request.getRequestedWidthInches())
                + " wide × "
                + displayMeasurement(request.getRequestedHeightInches())
                + " high";
    }

    private String displayMeasurement(BigDecimal value) {
        return value == null ? "Not provided" : value.stripTrailingZeros().toPlainString() + " in";
    }

    private String displayValue(String value) {
        return value == null || value.isBlank() ? "Not provided" : value;
    }

    private String yesNo(boolean value) {
        return value ? "Yes" : "No";
    }
}
