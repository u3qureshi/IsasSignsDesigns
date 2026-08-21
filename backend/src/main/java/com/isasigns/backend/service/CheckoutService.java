package com.isasigns.backend.service;

import java.time.Year;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.isasigns.backend.dto.checkout.CheckoutLineItemRequest;
import com.isasigns.backend.dto.checkout.CreateCheckoutSessionRequest;
import com.isasigns.backend.dto.checkout.CreateCheckoutSessionResponse;
import com.isasigns.backend.dto.checkout.OrderConfirmationResponse;
import com.isasigns.backend.dto.checkout.OrderItemResponse;
import com.isasigns.backend.exception.RequestValidationException;
import com.isasigns.backend.model.CustomerOrder;
import com.isasigns.backend.model.OrderItem;
import com.isasigns.backend.model.Product;
import com.isasigns.backend.repository.CustomerOrderRepository;
import com.isasigns.backend.repository.ProductRepository;

@Service
public class CheckoutService {
    private static final Logger LOGGER = LoggerFactory.getLogger(CheckoutService.class);
    private static final int MAX_LINES = 50;
    private static final int MAX_QUANTITY_PER_LINE = 99;
    private static final int MAX_TOTAL_QUANTITY = 200;

    private final ProductRepository productRepository;
    private final CustomerOrderRepository orderRepository;
    private final CheckoutPaymentClient paymentClient;
    private final ObjectMapper objectMapper;
    private final OrderPaymentService orderPaymentService;
    private final long freeShippingThresholdCents;
    private final long standardShippingCents;

    public CheckoutService(
            ProductRepository productRepository,
            CustomerOrderRepository orderRepository,
            CheckoutPaymentClient paymentClient,
            ObjectMapper objectMapper,
            OrderPaymentService orderPaymentService,
            @Value("${app.checkout.free-shipping-threshold-cents:10000}") long freeShippingThresholdCents,
            @Value("${app.checkout.standard-shipping-cents:1500}") long standardShippingCents) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.paymentClient = paymentClient;
        this.objectMapper = objectMapper;
        this.orderPaymentService = orderPaymentService;
        this.freeShippingThresholdCents = freeShippingThresholdCents;
        this.standardShippingCents = standardShippingCents;
    }

    @Transactional
    public CreateCheckoutSessionResponse createSession(CreateCheckoutSessionRequest request) {
        List<String> errors = validateShape(request);
        if (!errors.isEmpty()) throw new RequestValidationException(errors);

        Map<UUID, Product> products = new HashMap<>();
        productRepository.findAllById(request.items().stream().map(CheckoutLineItemRequest::productId).distinct().toList())
                .forEach(product -> products.put(product.getId(), product));

        var resolved = new ArrayList<ResolvedLine>();
        String currency = null;
        int totalQuantity = 0;
        Map<UUID, Integer> quantityByProduct = new HashMap<>();
        for (int index = 0; index < request.items().size(); index++) {
            CheckoutLineItemRequest line = request.items().get(index);
            Product product = products.get(line.productId());
            String prefix = "Item " + (index + 1) + ": ";
            if (product == null || !Boolean.TRUE.equals(product.getIsActive())) {
                errors.add(prefix + "product is unavailable.");
                continue;
            }
            if (currency == null) currency = product.getCurrency();
            if (!currency.equalsIgnoreCase(product.getCurrency())) {
                errors.add(prefix + "currency does not match the rest of the cart.");
                continue;
            }
            totalQuantity += line.quantity();
            quantityByProduct.merge(product.getId(), line.quantity(), Integer::sum);
            ResolvedVariant variant = resolveVariant(product, line, prefix, errors);
            if (variant == null) continue;
            resolved.add(new ResolvedLine(product, variant, currentPrice(product), line.quantity()));
        }

        if (totalQuantity > MAX_TOTAL_QUANTITY) errors.add("A checkout can contain at most 200 items.");
        for (var entry : quantityByProduct.entrySet()) {
            Product product = products.get(entry.getKey());
            if (product != null && product.getStockQty() != null && entry.getValue() > product.getStockQty()) {
                errors.add(product.getName() + " does not have enough stock for that quantity.");
            }
        }
        if (!errors.isEmpty()) throw new RequestValidationException(errors);

        long subtotal = resolved.stream()
                .mapToLong(line -> Math.multiplyExact(line.unitPriceCents(), line.quantity()))
                .sum();
        long shipping = subtotal >= freeShippingThresholdCents ? 0 : standardShippingCents;
        var order = new CustomerOrder(createOrderNumber(), currency.toUpperCase(Locale.ROOT), subtotal, shipping);
        for (ResolvedLine line : resolved) {
            order.addItem(new OrderItem(
                    line.product().getId(),
                    line.product().getSlug(),
                    line.product().getName(),
                    line.variant().id(),
                    line.variant().name(),
                    line.variant().size(),
                    line.variant().imagePublicId(),
                    line.unitPriceCents(),
                    line.quantity()));
        }
        orderRepository.saveAndFlush(order);
        var session = paymentClient.create(order);
        order.attachCheckoutSession(session.id());
        orderRepository.save(order);
        return new CreateCheckoutSessionResponse(session.id(), session.url(), order.getOrderNumber());
    }

    @Transactional
    public OrderConfirmationResponse getBySessionId(String sessionId) {
        if (!StringUtils.hasText(sessionId) || sessionId.length() > 255) {
            throw new RequestValidationException(List.of("A valid checkout session is required."));
        }
        CustomerOrder order = orderRepository.findByStripeCheckoutSessionId(sessionId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Order not found"));
        if (order.getStatus() == com.isasigns.backend.model.OrderStatus.PENDING_PAYMENT
                || order.getStatus() == com.isasigns.backend.model.OrderStatus.PAYMENT_PROCESSING) {
            try {
                var payment = paymentClient.retrieve(sessionId);
                if (payment.paid()) orderPaymentService.markPaid(order, payment);
            } catch (com.isasigns.backend.exception.ExternalServiceException exception) {
                LOGGER.warn("Could not reconcile pending order {} with Stripe yet.", order.getOrderNumber());
            }
        }
        return toResponse(order);
    }

    private List<String> validateShape(CreateCheckoutSessionRequest request) {
        var errors = new ArrayList<String>();
        if (request == null || request.items() == null || request.items().isEmpty()) {
            errors.add("Your cart is empty.");
            return errors;
        }
        if (request.items().size() > MAX_LINES) errors.add("A checkout can contain at most 50 selections.");
        for (int index = 0; index < request.items().size(); index++) {
            var line = request.items().get(index);
            String prefix = "Item " + (index + 1) + ": ";
            if (line == null || line.productId() == null) errors.add(prefix + "product is required.");
            if (line == null || line.quantity() == null || line.quantity() < 1 || line.quantity() > MAX_QUANTITY_PER_LINE) {
                errors.add(prefix + "quantity must be between 1 and 99.");
            }
        }
        return errors;
    }

    private ResolvedVariant resolveVariant(Product product, CheckoutLineItemRequest line, String prefix, List<String> errors) {
        try {
            JsonNode variants = objectMapper.readTree(product.getVariants() == null ? "[]" : product.getVariants());
            if (!variants.isArray() || variants.isEmpty()) {
                if (StringUtils.hasText(line.variantId()) || StringUtils.hasText(line.size())) {
                    errors.add(prefix + "this product does not use colour or size options.");
                    return null;
                }
                return new ResolvedVariant(null, null, null, firstImage(product));
            }
            if (!StringUtils.hasText(line.variantId())) {
                errors.add(prefix + "choose a colour.");
                return null;
            }
            JsonNode selected = null;
            for (JsonNode variant : variants) {
                if (line.variantId().equals(variant.path("id").asText())) {
                    selected = variant;
                    break;
                }
            }
            if (selected == null) {
                errors.add(prefix + "the selected colour is unavailable.");
                return null;
            }
            if (!StringUtils.hasText(line.size())) {
                errors.add(prefix + "choose a size.");
                return null;
            }
            boolean sizeAllowed = false;
            for (JsonNode size : selected.path("sizes")) {
                if (line.size().equals(size.asText())) sizeAllowed = true;
            }
            if (!sizeAllowed) {
                errors.add(prefix + "the selected size is unavailable for this colour.");
                return null;
            }
            return new ResolvedVariant(
                    selected.path("id").asText(),
                    selected.path("name").asText(),
                    line.size(),
                    selected.path("image").asText(null));
        } catch (com.fasterxml.jackson.core.JsonProcessingException exception) {
            throw new IllegalStateException("Product options are misconfigured.", exception);
        }
    }

    private long currentPrice(Product product) {
        if (!StringUtils.hasText(product.getOnSale())) return product.getPriceCents();
        try {
            JsonNode sale = objectMapper.readTree(product.getOnSale());
            if (!sale.path("enabled").asBoolean(false)) return product.getPriceCents();
            double percent = sale.path("percent").asDouble(0);
            if (percent <= 0 || percent >= 100) return product.getPriceCents();
            return Math.round(product.getPriceCents() * (1 - percent / 100));
        } catch (com.fasterxml.jackson.core.JsonProcessingException exception) {
            throw new IllegalStateException("Product pricing is misconfigured.", exception);
        }
    }

    private String firstImage(Product product) {
        if (!StringUtils.hasText(product.getImages())) return null;
        try {
            JsonNode images = objectMapper.readTree(product.getImages());
            return images.isArray() && !images.isEmpty() ? images.get(0).asText(null) : null;
        } catch (com.fasterxml.jackson.core.JsonProcessingException exception) {
            return null;
        }
    }

    private String createOrderNumber() {
        String value;
        do {
            value = "TNB-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
        } while (orderRepository.findByOrderNumber(value).isPresent());
        return value;
    }

    private OrderConfirmationResponse toResponse(CustomerOrder order) {
        return new OrderConfirmationResponse(
                order.getOrderNumber(), order.getStatus().name(), order.getCurrency(),
                order.getSubtotalCents(), order.getShippingCents(), order.getTaxCents(), order.getTotalCents(),
                order.getCustomerEmail(), order.getCreatedAt(), order.getPaidAt(),
                order.getItems().stream().map(item -> new OrderItemResponse(
                        item.getProductSlug(), item.getProductName(), item.getVariantName(), item.getSize(),
                        item.getImagePublicId(), item.getUnitPriceCents(), item.getQuantity(), item.getLineTotalCents()))
                        .toList());
    }

    private record ResolvedVariant(String id, String name, String size, String imagePublicId) { }
    private record ResolvedLine(Product product, ResolvedVariant variant, long unitPriceCents, int quantity) { }
}
