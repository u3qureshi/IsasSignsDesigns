package com.isasigns.backend.dto.checkout;

import java.util.List;

public record CreateCheckoutSessionRequest(List<CheckoutLineItemRequest> items) {
}
