package com.isasigns.backend.dto.checkout;

import java.util.UUID;

public record CheckoutLineItemRequest(
        UUID productId,
        String variantId,
        String size,
        Integer quantity) {
}
