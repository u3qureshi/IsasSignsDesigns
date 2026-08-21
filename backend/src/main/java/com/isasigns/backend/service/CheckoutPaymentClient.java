package com.isasigns.backend.service;

import com.isasigns.backend.model.CustomerOrder;

public interface CheckoutPaymentClient {
    CreatedCheckoutSession create(CustomerOrder order);

    VerifiedCheckoutSession retrieve(String sessionId);

    record CreatedCheckoutSession(String id, String url) {
    }

    record VerifiedCheckoutSession(
            String id,
            boolean paid,
            long amountTotal,
            long amountTax,
            String currency,
            String paymentIntentId,
            String customerEmail,
            String customerName,
            String customerPhone,
            String shippingAddressJson) {
    }
}
