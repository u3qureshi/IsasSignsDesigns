package com.isasigns.backend.dto.quickrequest;

public record QuickRequestProductPayload(
        String itemType,
        String customItem,
        Integer quantity) {
}
