package com.isasigns.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.isasigns.backend.dto.checkout.CheckoutLineItemRequest;
import com.isasigns.backend.dto.checkout.CreateCheckoutSessionRequest;
import com.isasigns.backend.exception.RequestValidationException;
import com.isasigns.backend.model.CustomerOrder;
import com.isasigns.backend.model.Product;
import com.isasigns.backend.repository.CustomerOrderRepository;
import com.isasigns.backend.repository.ProductRepository;

class CheckoutServiceTest {
    private final ProductRepository productRepository = mock(ProductRepository.class);
    private final CustomerOrderRepository orderRepository = mock(CustomerOrderRepository.class);
    private final CheckoutPaymentClient paymentClient = mock(CheckoutPaymentClient.class);
    private final OrderPaymentService orderPaymentService = mock(OrderPaymentService.class);
    private CheckoutService service;

    @BeforeEach
    void setUp() {
        service = new CheckoutService(
                productRepository, orderRepository, paymentClient, new ObjectMapper(), orderPaymentService,
                10_000, 1_500);
        when(orderRepository.findByOrderNumber(any())).thenReturn(Optional.empty());
        when(paymentClient.create(any())).thenReturn(
                new CheckoutPaymentClient.CreatedCheckoutSession("cs_test_123", "https://checkout.stripe.test/session"));
    }

    @Test
    void rebuildsTheOrderFromCatalogPricingAndSelectedOptions() {
        UUID productId = UUID.randomUUID();
        Product product = product(productId, 2_000,
                "[{\"id\":\"20\",\"name\":\"Black\",\"image\":\"catalog/black\",\"sizes\":[\"S\",\"M\"]}]");
        when(productRepository.findAllById(any())).thenReturn(List.of(product));

        var response = service.createSession(new CreateCheckoutSessionRequest(List.of(
                new CheckoutLineItemRequest(productId, "20", "M", 2))));

        assertThat(response.checkoutUrl()).isEqualTo("https://checkout.stripe.test/session");
        ArgumentCaptor<CustomerOrder> orderCaptor = ArgumentCaptor.forClass(CustomerOrder.class);
        verify(paymentClient).create(orderCaptor.capture());
        CustomerOrder order = orderCaptor.getValue();
        assertThat(order.getSubtotalCents()).isEqualTo(4_000);
        assertThat(order.getShippingCents()).isEqualTo(1_500);
        assertThat(order.getTotalCents()).isEqualTo(5_500);
        assertThat(order.getItems()).singleElement().satisfies(item -> {
            assertThat(item.getUnitPriceCents()).isEqualTo(2_000);
            assertThat(item.getVariantName()).isEqualTo("Black");
            assertThat(item.getSize()).isEqualTo("M");
            assertThat(item.getQuantity()).isEqualTo(2);
        });
    }

    @Test
    void appliesTheCatalogSaleAndFreeShippingAtTheThreshold() {
        UUID productId = UUID.randomUUID();
        Product product = product(productId, 12_500, "[]");
        when(product.getOnSale()).thenReturn("{\"enabled\":true,\"percent\":20}");
        when(productRepository.findAllById(any())).thenReturn(List.of(product));

        service.createSession(new CreateCheckoutSessionRequest(List.of(
                new CheckoutLineItemRequest(productId, null, null, 1))));

        ArgumentCaptor<CustomerOrder> orderCaptor = ArgumentCaptor.forClass(CustomerOrder.class);
        verify(paymentClient).create(orderCaptor.capture());
        assertThat(orderCaptor.getValue().getSubtotalCents()).isEqualTo(10_000);
        assertThat(orderCaptor.getValue().getShippingCents()).isZero();
    }

    @Test
    void rejectsAColourOrSizeThatIsNotInTheCatalog() {
        UUID productId = UUID.randomUUID();
        Product product = product(productId, 2_000,
                "[{\"id\":\"20\",\"name\":\"Black\",\"sizes\":[\"S\",\"M\"]}]");
        when(productRepository.findAllById(any())).thenReturn(List.of(product));

        assertThatThrownBy(() -> service.createSession(new CreateCheckoutSessionRequest(List.of(
                new CheckoutLineItemRequest(productId, "20", "9XL", 1)))))
                .isInstanceOf(RequestValidationException.class)
                .hasMessage("Request validation failed")
                .extracting(exception -> ((RequestValidationException) exception).getDetails())
                .asString()
                .contains("selected size is unavailable");
    }

    @Test
    void reconcilesAPaidStripeSessionWhenTheWebhookHasNotArrived() {
        var order = new CustomerOrder("TNB-2026-TEST", "CAD", 9_500, 1_500);
        order.attachCheckoutSession("cs_test_paid");
        var payment = new CheckoutPaymentClient.VerifiedCheckoutSession(
                "cs_test_paid", true, 11_000, 0, "CAD", "pi_test_paid",
                "customer@example.com", "Test Customer", null, "{}");
        when(orderRepository.findByStripeCheckoutSessionId("cs_test_paid")).thenReturn(Optional.of(order));
        when(paymentClient.retrieve("cs_test_paid")).thenReturn(payment);
        when(orderPaymentService.markPaid(order, payment)).thenAnswer(invocation -> order.markPaid(
                payment.amountTotal(), payment.amountTax(), payment.paymentIntentId(), payment.customerEmail(),
                payment.customerName(), payment.customerPhone(), payment.shippingAddressJson()));

        var response = service.getBySessionId("cs_test_paid");

        assertThat(response.status()).isEqualTo("PAID");
        assertThat(response.totalCents()).isEqualTo(11_000);
        assertThat(response.customerEmail()).isEqualTo("customer@example.com");
        verify(paymentClient).retrieve("cs_test_paid");
        verify(orderPaymentService).markPaid(order, payment);
    }

    private Product product(UUID id, long priceCents, String variants) {
        Product product = mock(Product.class);
        when(product.getId()).thenReturn(id);
        when(product.getSlug()).thenReturn("test-shirt");
        when(product.getName()).thenReturn("Test Shirt");
        when(product.getPriceCents()).thenReturn(priceCents);
        when(product.getCurrency()).thenReturn("CAD");
        when(product.getIsActive()).thenReturn(true);
        when(product.getStockQty()).thenReturn(null);
        when(product.getVariants()).thenReturn(variants);
        when(product.getImages()).thenReturn("[\"catalog/default\"]");
        return product;
    }
}
