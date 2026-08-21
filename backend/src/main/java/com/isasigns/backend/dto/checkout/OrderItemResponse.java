package com.isasigns.backend.dto.checkout;

public record OrderItemResponse(
        String productSlug,
        String productName,
        String variantName,
        String size,
        String imagePublicId,
        long unitPriceCents,
        int quantity,
        long lineTotalCents) {
}
