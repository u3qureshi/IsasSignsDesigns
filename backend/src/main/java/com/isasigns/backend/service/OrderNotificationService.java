package com.isasigns.backend.service;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.isasigns.backend.model.CustomerOrder;
import com.isasigns.backend.repository.CustomerOrderRepository;

@Service
public class OrderNotificationService {
    private static final Logger LOGGER = LoggerFactory.getLogger(OrderNotificationService.class);

    private final CustomerOrderRepository orderRepository;
    private final EmailDeliveryClient emailClient;
    private final ObjectMapper objectMapper;
    private final boolean emailEnabled;
    private final String emailFromAddress;
    private final String adminEmail;

    public OrderNotificationService(
            CustomerOrderRepository orderRepository,
            EmailDeliveryClient emailClient,
            ObjectMapper objectMapper,
            @Value("${app.notifications.email.enabled:false}") boolean emailEnabled,
            @Value("${app.notifications.email.from-address:}") String emailFromAddress,
            @Value("${app.notifications.admin-email:}") String adminEmail) {
        this.orderRepository = orderRepository;
        this.emailClient = emailClient;
        this.objectMapper = objectMapper;
        this.emailEnabled = emailEnabled;
        this.emailFromAddress = emailFromAddress;
        this.adminEmail = adminEmail;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
    public void onPaid(OrderPaidEvent event) {
        CustomerOrder order = orderRepository.findByStripeCheckoutSessionId(event.checkoutSessionId()).orElse(null);
        if (order == null) {
            LOGGER.error("Cannot send order notifications: checkout session {} was not found.", event.checkoutSessionId());
            return;
        }
        if (!emailEnabled || !StringUtils.hasText(emailFromAddress)) {
            LOGGER.info("Order {} is paid; email notifications are disabled or missing a sender.", order.getOrderNumber());
            return;
        }

        String summary = orderSummary(order);
        send(order.getCustomerEmail(),
                "We received your Thread & Butter order " + order.getOrderNumber(),
                "Hi " + firstName(order.getCustomerName()) + ",\n\n"
                        + "Thanks for your order. Your payment is confirmed and we’ll follow up when it is ready to ship.\n\n"
                        + summary + "\n\nThread & Butter");
        send(adminEmail,
                "New paid order " + order.getOrderNumber(),
                "A guest checkout has been paid.\n\n"
                        + summary + "\n\nCustomer\n"
                        + display(order.getCustomerName()) + "\n"
                        + display(order.getCustomerEmail()) + "\n"
                        + display(order.getCustomerPhone()) + "\n\nShipping address\n"
                        + formatAddress(order.getShippingAddress()));
    }

    private String orderSummary(CustomerOrder order) {
        var body = new StringBuilder("Order ").append(order.getOrderNumber()).append("\n\n");
        for (var item : order.getItems()) {
            body.append(item.getQuantity()).append(" × ").append(item.getProductName());
            String options = String.join(" / ", java.util.stream.Stream.of(item.getVariantName(), item.getSize())
                    .filter(StringUtils::hasText).toList());
            if (StringUtils.hasText(options)) body.append(" (").append(options).append(")");
            body.append(" — ").append(money(item.getLineTotalCents(), order.getCurrency())).append("\n");
        }
        body.append("\nSubtotal: ").append(money(order.getSubtotalCents(), order.getCurrency()))
                .append("\nShipping: ").append(money(order.getShippingCents(), order.getCurrency()))
                .append("\nTax: ").append(money(order.getTaxCents(), order.getCurrency()))
                .append("\nTotal paid: ").append(money(order.getTotalCents(), order.getCurrency()));
        return body.toString();
    }

    private void send(String recipient, String subject, String body) {
        if (!StringUtils.hasText(recipient)) {
            LOGGER.warn("Skipping '{}' because the recipient is missing.", subject);
            return;
        }
        try {
            emailClient.send(recipient, subject, body, List.of());
        } catch (RuntimeException exception) {
            LOGGER.error("Could not send order email '{}' to {}.", subject, recipient, exception);
        }
    }

    private String formatAddress(String raw) {
        if (!StringUtils.hasText(raw)) return "Not provided";
        try {
            JsonNode address = objectMapper.readTree(raw);
            return java.util.stream.Stream.of(
                    address.path("line1").asText(null),
                    address.path("line2").asText(null),
                    String.join(", ", java.util.stream.Stream.of(
                            address.path("city").asText(null),
                            address.path("state").asText(null),
                            address.path("postal_code").asText(null))
                            .filter(StringUtils::hasText).toList()),
                    address.path("country").asText(null))
                    .filter(StringUtils::hasText)
                    .reduce((left, right) -> left + "\n" + right)
                    .orElse("Not provided");
        } catch (com.fasterxml.jackson.core.JsonProcessingException exception) {
            return "Not provided";
        }
    }

    private String money(long cents, String currency) {
        NumberFormat format = NumberFormat.getCurrencyInstance(Locale.CANADA);
        format.setCurrency(java.util.Currency.getInstance(currency));
        return format.format(cents / 100.0);
    }

    private String firstName(String name) {
        return StringUtils.hasText(name) ? name.trim().split("\\s+")[0] : "there";
    }

    private String display(String value) { return StringUtils.hasText(value) ? value : "Not provided"; }
}
