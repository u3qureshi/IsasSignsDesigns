package com.isasigns.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.net.RequestOptions;
import com.stripe.param.checkout.SessionCreateParams;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.isasigns.backend.exception.ExternalServiceException;
import com.isasigns.backend.model.CustomerOrder;

@Service
public class StripeCheckoutPaymentClient implements CheckoutPaymentClient {
    private final String secretKey;
    private final String storefrontUrl;
    private final boolean automaticTaxEnabled;
    private final ObjectMapper objectMapper;

    public StripeCheckoutPaymentClient(
            @Value("${app.stripe.secret-key:}") String secretKey,
            @Value("${app.checkout.storefront-url}") String storefrontUrl,
            @Value("${app.checkout.automatic-tax-enabled:false}") boolean automaticTaxEnabled,
            ObjectMapper objectMapper) {
        this.secretKey = secretKey;
        this.storefrontUrl = storefrontUrl.replaceAll("/+$", "");
        this.automaticTaxEnabled = automaticTaxEnabled;
        this.objectMapper = objectMapper;
    }

    @Override
    public CreatedCheckoutSession create(CustomerOrder order) {
        requireSecretKey();

        var builder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(storefrontUrl + "/checkout/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(storefrontUrl + "/checkout/cancel?order=" + order.getOrderNumber())
                .setClientReferenceId(order.getId().toString())
                .setCustomerCreation(SessionCreateParams.CustomerCreation.ALWAYS)
                .setPhoneNumberCollection(SessionCreateParams.PhoneNumberCollection.builder()
                        .setEnabled(true)
                        .build())
                .setShippingAddressCollection(SessionCreateParams.ShippingAddressCollection.builder()
                        .addAllowedCountry(SessionCreateParams.ShippingAddressCollection.AllowedCountry.CA)
                        .build())
                .setAutomaticTax(SessionCreateParams.AutomaticTax.builder()
                        .setEnabled(automaticTaxEnabled)
                        .build())
                .putMetadata("order_id", order.getId().toString())
                .putMetadata("order_number", order.getOrderNumber())
                .setPaymentIntentData(SessionCreateParams.PaymentIntentData.builder()
                        .putMetadata("order_id", order.getId().toString())
                        .putMetadata("order_number", order.getOrderNumber())
                        .build());

        for (var item : order.getItems()) {
            String details = String.join(" · ", java.util.stream.Stream.of(item.getVariantName(), item.getSize())
                    .filter(StringUtils::hasText)
                    .toList());
            var productData = SessionCreateParams.LineItem.PriceData.ProductData.builder()
                    .setName(item.getProductName());
            if (StringUtils.hasText(details)) productData.setDescription(details);

            builder.addLineItem(SessionCreateParams.LineItem.builder()
                    .setQuantity((long) item.getQuantity())
                    .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency(order.getCurrency().toLowerCase(java.util.Locale.ROOT))
                            .setUnitAmount(item.getUnitPriceCents())
                            .setProductData(productData.build())
                            .build())
                    .build());
        }

        builder.addShippingOption(SessionCreateParams.ShippingOption.builder()
                .setShippingRateData(SessionCreateParams.ShippingOption.ShippingRateData.builder()
                        .setType(SessionCreateParams.ShippingOption.ShippingRateData.Type.FIXED_AMOUNT)
                        .setDisplayName(order.getShippingCents() == 0 ? "Free standard shipping" : "Standard shipping")
                        .setFixedAmount(SessionCreateParams.ShippingOption.ShippingRateData.FixedAmount.builder()
                                .setAmount(order.getShippingCents())
                                .setCurrency(order.getCurrency().toLowerCase(java.util.Locale.ROOT))
                                .build())
                        .build())
                .build());

        try {
            Session session = Session.create(
                    builder.build(),
                    RequestOptions.builder()
                            .setApiKey(secretKey)
                            .setIdempotencyKey("checkout-order-" + order.getId())
                            .build());
            if (!StringUtils.hasText(session.getUrl())) {
                throw new ExternalServiceException("Stripe did not return a checkout URL.");
            }
            return new CreatedCheckoutSession(session.getId(), session.getUrl());
        } catch (StripeException exception) {
            throw new ExternalServiceException("Secure checkout could not be started. Please try again.", exception);
        }
    }

    @Override
    public VerifiedCheckoutSession retrieve(String sessionId) {
        requireSecretKey();
        try {
            Session session = Session.retrieve(
                    sessionId,
                    RequestOptions.builder().setApiKey(secretKey).build());
            JsonNode json = objectMapper.readTree(session.toJson());
            JsonNode customer = json.path("customer_details");
            JsonNode shipping = json.path("collected_information").path("shipping_details");
            JsonNode address = shipping.path("address");
            if (address.isMissingNode() || address.isNull()) address = customer.path("address");
            String name = textOrNull(shipping, "name");
            if (name == null) name = textOrNull(customer, "name");
            return new VerifiedCheckoutSession(
                    session.getId(),
                    "paid".equals(session.getPaymentStatus()),
                    session.getAmountTotal() == null ? -1 : session.getAmountTotal(),
                    json.path("total_details").path("amount_tax").asLong(0),
                    session.getCurrency(),
                    session.getPaymentIntent(),
                    textOrNull(customer, "email"),
                    name,
                    textOrNull(customer, "phone"),
                    address.isMissingNode() || address.isNull() ? null : address.toString());
        } catch (StripeException | JsonProcessingException exception) {
            throw new ExternalServiceException("Stripe payment confirmation could not be checked.", exception);
        }
    }

    private void requireSecretKey() {
        if (!StringUtils.hasText(secretKey)) {
            throw new IllegalStateException("Stripe checkout is not configured.");
        }
    }

    private String textOrNull(JsonNode node, String field) {
        String value = node.path(field).asText(null);
        return StringUtils.hasText(value) ? value : null;
    }
}
