package com.isasigns.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Optional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationEventPublisher;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.isasigns.backend.exception.RequestValidationException;
import com.isasigns.backend.model.CustomerOrder;
import com.isasigns.backend.model.OrderStatus;
import com.isasigns.backend.repository.CustomerOrderRepository;
import com.isasigns.backend.repository.PaymentWebhookEventRepository;

class StripeWebhookServiceTest {
    private static final String SECRET = "whsec_test_secret";
    private final CustomerOrderRepository orderRepository = mock(CustomerOrderRepository.class);
    private final PaymentWebhookEventRepository eventRepository = mock(PaymentWebhookEventRepository.class);
    private final ApplicationEventPublisher eventPublisher = mock(ApplicationEventPublisher.class);
    private final OrderPaymentService orderPaymentService = new OrderPaymentService(eventPublisher);
    private final StripeWebhookService service = new StripeWebhookService(
            SECRET, new ObjectMapper(), orderRepository, eventRepository, orderPaymentService);

    @Test
    void aSignedPaidCheckoutMarksTheOrderPaidAndPublishesOneEvent() throws Exception {
        var order = new CustomerOrder("TNB-2026-TEST", "CAD", 4_000, 1_500);
        order.attachCheckoutSession("cs_test_123");
        when(orderRepository.findByStripeCheckoutSessionId("cs_test_123")).thenReturn(Optional.of(order));
        when(eventRepository.existsByProviderAndEventId("STRIPE", "evt_test_123")).thenReturn(false);
        String payload = paidPayload();

        service.handle(payload, signature(payload));

        assertThat(order.getStatus()).isEqualTo(OrderStatus.PAID);
        assertThat(order.getTotalCents()).isEqualTo(5_500);
        assertThat(order.getCustomerEmail()).isEqualTo("buyer@example.com");
        verify(eventRepository).saveAndFlush(any());
        verify(eventPublisher).publishEvent(new OrderPaidEvent("cs_test_123"));
    }

    @Test
    void rejectsAnInvalidSignatureBeforeChangingAnything() {
        assertThatThrownBy(() -> service.handle(paidPayload(), "t=1,v1=invalid"))
                .isInstanceOf(RequestValidationException.class);
    }

    private String paidPayload() {
        return """
                {"id":"evt_test_123","object":"event","created":%d,"data":{"object":{"id":"cs_test_123","object":"checkout.session","payment_status":"paid","amount_total":5500,"currency":"cad","total_details":{"amount_tax":0},"payment_intent":"pi_test_123","customer_details":{"email":"buyer@example.com","name":"Taylor Buyer","phone":"+14165551234","address":{"line1":"1 Test Street","city":"Toronto","state":"ON","postal_code":"M5V 1A1","country":"CA"}}}},"livemode":false,"pending_webhooks":1,"type":"checkout.session.completed"}
                """.formatted(Instant.now().getEpochSecond()).trim();
    }

    private String signature(String payload) throws Exception {
        long timestamp = Instant.now().getEpochSecond();
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] digest = mac.doFinal((timestamp + "." + payload).getBytes(StandardCharsets.UTF_8));
        return "t=" + timestamp + ",v1=" + java.util.HexFormat.of().formatHex(digest);
    }
}
