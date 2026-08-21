package com.isasigns.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.isasigns.backend.exception.RequestValidationException;
import com.isasigns.backend.model.PaymentWebhookEvent;
import com.isasigns.backend.repository.CustomerOrderRepository;
import com.isasigns.backend.repository.PaymentWebhookEventRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;

@Service
public class StripeWebhookService {
    private static final String PROVIDER = "STRIPE";

    private final String webhookSecret;
    private final ObjectMapper objectMapper;
    private final CustomerOrderRepository orderRepository;
    private final PaymentWebhookEventRepository eventRepository;
    private final OrderPaymentService orderPaymentService;

    public StripeWebhookService(
            @Value("${app.stripe.webhook-secret:}") String webhookSecret,
            ObjectMapper objectMapper,
            CustomerOrderRepository orderRepository,
            PaymentWebhookEventRepository eventRepository,
            OrderPaymentService orderPaymentService) {
        this.webhookSecret = webhookSecret;
        this.objectMapper = objectMapper;
        this.orderRepository = orderRepository;
        this.eventRepository = eventRepository;
        this.orderPaymentService = orderPaymentService;
    }

    @Transactional
    public void handle(String payload, String signature) {
        if (!StringUtils.hasText(webhookSecret)) {
            throw new IllegalStateException("Stripe webhooks are not configured.");
        }
        Event event;
        try {
            event = Webhook.constructEvent(payload, signature, webhookSecret);
        } catch (SignatureVerificationException exception) {
            throw new RequestValidationException(List.of("The Stripe webhook signature is invalid."));
        }

        if (eventRepository.existsByProviderAndEventId(PROVIDER, event.getId())) return;

        JsonNode object;
        try {
            object = objectMapper.readTree(payload).path("data").path("object");
        } catch (JsonProcessingException exception) {
            throw new RequestValidationException(List.of("The Stripe webhook payload is invalid."));
        }

        switch (event.getType()) {
            case "checkout.session.completed" -> handleCompleted(object);
            case "checkout.session.async_payment_succeeded" -> markPaid(object);
            case "checkout.session.async_payment_failed" -> findOrder(object).ifPresent(order -> order.markPaymentFailed());
            case "checkout.session.expired" -> findOrder(object).ifPresent(order -> order.markExpired());
            default -> { }
        }
        eventRepository.saveAndFlush(new PaymentWebhookEvent(PROVIDER, event.getId(), event.getType()));
    }

    private void handleCompleted(JsonNode session) {
        if ("paid".equals(session.path("payment_status").asText())) {
            markPaid(session);
        } else {
            findOrder(session).ifPresent(order -> order.markPaymentProcessing());
        }
    }

    private void markPaid(JsonNode session) {
        findOrder(session).ifPresent(order -> {
            JsonNode customer = session.path("customer_details");
            JsonNode shipping = shippingDetails(session);
            JsonNode address = shipping.path("address");
            if (address.isMissingNode() || address.isNull()) address = customer.path("address");
            String addressJson = address.isMissingNode() || address.isNull() ? null : address.toString();
            String name = textOrNull(shipping, "name");
            if (name == null) name = textOrNull(customer, "name");

            orderPaymentService.markPaid(order, new CheckoutPaymentClient.VerifiedCheckoutSession(
                    textOrNull(session, "id"),
                    true,
                    session.path("amount_total").asLong(-1),
                    session.path("total_details").path("amount_tax").asLong(0),
                    session.path("currency").asText(""),
                    textOrNull(session, "payment_intent"),
                    textOrNull(customer, "email"),
                    name,
                    textOrNull(customer, "phone"),
                    addressJson));
        });
    }

    private java.util.Optional<com.isasigns.backend.model.CustomerOrder> findOrder(JsonNode session) {
        String sessionId = textOrNull(session, "id");
        if (!StringUtils.hasText(sessionId)) return java.util.Optional.empty();
        return orderRepository.findByStripeCheckoutSessionId(sessionId);
    }

    private JsonNode shippingDetails(JsonNode session) {
        JsonNode collected = session.path("collected_information").path("shipping_details");
        return collected.isMissingNode() ? session.path("shipping_details") : collected;
    }

    private String textOrNull(JsonNode node, String field) {
        String value = node.path(field).asText(null);
        return StringUtils.hasText(value) ? value : null;
    }
}
