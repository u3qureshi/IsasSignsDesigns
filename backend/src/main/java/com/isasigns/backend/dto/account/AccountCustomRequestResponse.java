package com.isasigns.backend.dto.account;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public record AccountCustomRequestResponse(
        String requestNumber,
        String serviceType,
        String status,
        OffsetDateTime createdAt,
        String itemType,
        String customItemDescription,
        String garmentColor,
        String placement,
        String customPlacementDescription,
        String sizeMode,
        BigDecimal requestedWidthInches,
        BigDecimal requestedHeightInches,
        int quantity,
        String ideaDescription,
        String exactText,
        boolean aiUsed,
        List<AccountCustomRequestImageResponse> images) {}
