package com.isasigns.backend.dto.customembroidery;

import java.math.BigDecimal;

public record CustomEmbroideryPayload(
        String fullName,
        String preferredContact,
        String email,
        String phone,
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
}
