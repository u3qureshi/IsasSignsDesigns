package com.isasigns.backend.dto.checkout;

import java.time.OffsetDateTime;
import java.util.List;

public record OrderConfirmationResponse(
        String orderNumber,
        String status,
        String currency,
        long subtotalCents,
        long shippingCents,
        long taxCents,
        long totalCents,
        String customerEmail,
        OffsetDateTime createdAt,
        OffsetDateTime paidAt,
        List<OrderItemResponse> items) {
}
