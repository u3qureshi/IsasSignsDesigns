package com.isasigns.backend.dto.checkout;

public record CreateCheckoutSessionResponse(
        String sessionId,
        String checkoutUrl,
        String orderNumber) {
}
