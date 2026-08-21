package com.isasigns.backend.model;

public enum OrderStatus {
    PENDING_PAYMENT,
    PAYMENT_PROCESSING,
    PAID,
    CHECKOUT_FAILED,
    PAYMENT_FAILED,
    EXPIRED
}
