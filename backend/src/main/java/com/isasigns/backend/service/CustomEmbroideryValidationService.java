package com.isasigns.backend.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.isasigns.backend.dto.customembroidery.CustomEmbroideryPayload;
import com.isasigns.backend.exception.RequestValidationException;

@Service
public class CustomEmbroideryValidationService {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Set<String> AI_MODES = Set.of("generate", "exact-upload", "inspiration", "manual-review");
    private static final Set<String> IMAGE_INTENTS = Set.of("exact", "inspiration", "placement");
    private static final Set<String> ITEM_PROVIDERS = Set.of("customer", "thread-n-butter");
    private static final Set<String> ITEM_TYPES = Set.of(
            "Hoodie", "Crewneck", "Pants", "Sweatpants", "Jeans", "Tote bag", "Towel", "T-shirt",
            "Beanie", "Hat", "Other");
    private static final Map<String, Set<String>> PLACEMENTS = Map.ofEntries(
            Map.entry("Hoodie", Set.of("Left chest", "Right chest", "Centre chest", "Full front", "Upper back",
                    "Full back", "Left sleeve", "Right sleeve", "Pocket", "Other")),
            Map.entry("Crewneck", Set.of("Left chest", "Right chest", "Centre chest", "Full front", "Upper back",
                    "Full back", "Left sleeve", "Right sleeve", "Other")),
            Map.entry("T-shirt", Set.of("Left chest", "Right chest", "Centre chest", "Full front", "Upper back",
                    "Full back", "Left sleeve", "Right sleeve", "Other")),
            Map.entry("Pants", Set.of("Left thigh", "Right thigh", "Left pant leg", "Right pant leg", "Back pocket",
                    "Other")),
            Map.entry("Sweatpants", Set.of("Left thigh", "Right thigh", "Left pant leg", "Right pant leg",
                    "Back pocket", "Other")),
            Map.entry("Jeans", Set.of("Left thigh", "Right thigh", "Left pant leg", "Right pant leg", "Back pocket",
                    "Other")),
            Map.entry("Tote bag", Set.of("Centre front", "Upper front", "Lower left corner", "Lower right corner",
                    "Other")),
            Map.entry("Towel", Set.of("Corner", "Centre", "Border", "Other")),
            Map.entry("Beanie", Set.of("Front", "Left side", "Right side", "Other")),
            Map.entry("Hat", Set.of("Front", "Left side", "Right side", "Back", "Other")),
            Map.entry("Other", Set.of("Front", "Back", "Left side", "Right side", "Other")));

    public void validateForPreview(CustomEmbroideryPayload payload, MultipartFile customerImage) {
        var errors = validateCommon(payload);
        if (payload == null || !isAiPreviewMode(payload.aiMode())) {
            errors.add("AI preview is available only for generate or inspiration artwork modes.");
        }
        if (payload != null && "inspiration".equals(payload.aiMode()) && isEmpty(customerImage)) {
            errors.add("An inspiration image is required.");
        }
        if (payload != null && "inspiration".equals(payload.aiMode())
                && !Boolean.TRUE.equals(payload.contentRightsConfirmed())) {
            errors.add("Content rights must be confirmed before an uploaded image can be sent to AI.");
        }
        throwIfErrors(errors);
    }

    public void validateForSubmit(
            CustomEmbroideryPayload payload,
            MultipartFile customerImage,
            MultipartFile generatedImage,
            String previewToken) {
        var errors = validateCommon(payload);
        if (payload == null) {
            throwIfErrors(errors);
            return;
        }

        if (requiresCustomerImage(payload.aiMode()) && isEmpty(customerImage)) {
            errors.add("The selected artwork mode requires a customer image.");
        }
        if (isAiPreviewMode(payload.aiMode()) && !Boolean.TRUE.equals(payload.aiPreviewFailed())) {
            if (isEmpty(generatedImage)) {
                errors.add("The selected artwork mode requires a generated preview image.");
            }
            if (isBlank(previewToken)) {
                errors.add("The generated preview token is required.");
            }
        }
        if (!Boolean.TRUE.equals(payload.estimateAccepted())) {
            errors.add("The estimate acknowledgement is required.");
        }
        if (!Boolean.TRUE.equals(payload.contentRightsConfirmed())) {
            errors.add("The content-rights confirmation is required.");
        }
        throwIfErrors(errors);
    }

    private ArrayList<String> validateCommon(CustomEmbroideryPayload payload) {
        var errors = new ArrayList<String>();
        if (payload == null) {
            errors.add("Request details are required.");
            return errors;
        }
        if (isBlank(payload.fullName())) {
            errors.add("Full name is required.");
        } else if (payload.fullName().trim().length() > 150) {
            errors.add("Full name must be 150 characters or fewer.");
        }

        if ("email".equals(payload.preferredContact())) {
            if (isBlank(payload.email()) || !EMAIL_PATTERN.matcher(payload.email().trim()).matches()) {
                errors.add("A valid email address is required.");
            }
        } else if ("phone".equals(payload.preferredContact())) {
            String phone = digits(payload.phone());
            if (phone.length() < 10 || phone.length() > 15) {
                errors.add("A phone number containing 10 to 15 digits is required.");
            }
        } else {
            errors.add("Preferred contact must be email or phone.");
        }

        if (isBlank(payload.ideaDescription())) {
            errors.add("Idea description is required.");
        } else if (payload.ideaDescription().trim().length() > 5000) {
            errors.add("Idea description must be 5,000 characters or fewer.");
        }
        if (payload.aiMode() == null || !AI_MODES.contains(payload.aiMode())) {
            errors.add("A valid artwork mode is required.");
        }
        if (payload.imageIntent() == null || !IMAGE_INTENTS.contains(payload.imageIntent())) {
            errors.add("A valid image-use choice is required.");
        }
        if (payload.itemProvider() == null || !ITEM_PROVIDERS.contains(payload.itemProvider())) {
            errors.add("A valid item provider is required.");
        }
        if (payload.itemType() == null || !ITEM_TYPES.contains(payload.itemType())) {
            errors.add("A valid item type is required.");
        }
        if ("Other".equals(payload.itemType()) && isBlank(payload.otherItem())) {
            errors.add("The custom item description is required.");
        }

        Set<String> validPlacements =
                payload.itemType() == null ? null : PLACEMENTS.get(payload.itemType());
        if (validPlacements == null
                || payload.placement() == null
                || !validPlacements.contains(payload.placement())) {
            errors.add("The selected placement is not valid for the selected item.");
        }
        if ("Other".equals(payload.placement()) && isBlank(payload.otherPlacement())) {
            errors.add("The custom placement description is required.");
        }

        if (!"known".equals(payload.sizeMode()) && !"recommend".equals(payload.sizeMode())) {
            errors.add("A valid size mode is required.");
        }
        if ("known".equals(payload.sizeMode())) {
            if (!isPositive(payload.width())) {
                errors.add("Width must be greater than zero.");
            }
            if (!isPositive(payload.height())) {
                errors.add("Height must be greater than zero.");
            }
        }
        if (payload.quantity() == null || payload.quantity() < 1 || payload.quantity() > 10_000) {
            errors.add("Quantity must be between 1 and 10,000.");
        }
        return errors;
    }

    public static String digits(String value) {
        return value == null ? "" : value.replaceAll("\\D", "");
    }

    private boolean isPositive(BigDecimal value) {
        return value != null && value.compareTo(BigDecimal.ZERO) > 0;
    }

    private boolean isAiPreviewMode(String aiMode) {
        return "generate".equals(aiMode) || "inspiration".equals(aiMode);
    }

    private boolean requiresCustomerImage(String aiMode) {
        return "exact-upload".equals(aiMode) || "inspiration".equals(aiMode);
    }

    private boolean isEmpty(MultipartFile file) {
        return file == null || file.isEmpty();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private void throwIfErrors(ArrayList<String> errors) {
        if (!errors.isEmpty()) {
            throw new RequestValidationException(errors);
        }
    }
}
