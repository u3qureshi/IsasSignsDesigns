package com.isasigns.backend.dto.customembroidery;

import java.math.BigDecimal;

public record CustomEmbroideryPayload(
        String fullName,
        String preferredContact,
        String email,
        String phone,
        Boolean smsConsent,
        String ideaDescription,
        String exactText,
        String aiMode,
        String imageIntent,
        String itemProvider,
        String itemType,
        String otherItem,
        String garmentColor,
        String placement,
        String otherPlacement,
        String sizeMode,
        BigDecimal width,
        BigDecimal height,
        Integer quantity,
        Boolean estimateAccepted,
        Boolean contentRightsConfirmed,
        Boolean aiPreviewFailed,
        String website) {
    public CustomEmbroideryPayload(
            String fullName,
            String preferredContact,
            String email,
            String phone,
            Boolean smsConsent,
            String ideaDescription,
            String exactText,
            String aiMode,
            String imageIntent,
            String itemProvider,
            String itemType,
            String otherItem,
            String garmentColor,
            String placement,
            String otherPlacement,
            String sizeMode,
            BigDecimal width,
            BigDecimal height,
            Integer quantity,
            Boolean estimateAccepted,
            Boolean contentRightsConfirmed,
            Boolean aiPreviewFailed) {
        this(fullName, preferredContact, email, phone, smsConsent, ideaDescription, exactText,
                aiMode, imageIntent, itemProvider, itemType, otherItem, garmentColor, placement,
                otherPlacement, sizeMode, width, height, quantity, estimateAccepted,
                contentRightsConfirmed, aiPreviewFailed, "");
    }
}
