package com.isasigns.backend.service;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.isasigns.backend.model.CustomerOrder;
import com.isasigns.backend.service.CheckoutPaymentClient.VerifiedCheckoutSession;

@Service
public class OrderPaymentService {
    private final ApplicationEventPublisher eventPublisher;

    public OrderPaymentService(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    public boolean markPaid(CustomerOrder order, VerifiedCheckoutSession payment) {
        long expectedTotal = Math.addExact(
                Math.addExact(order.getSubtotalCents(), order.getShippingCents()),
                payment.amountTax());
        if (!order.getStripeCheckoutSessionId().equals(payment.id())
                || payment.amountTotal() != expectedTotal
                || !order.getCurrency().equalsIgnoreCase(payment.currency())) {
            throw new IllegalStateException("Stripe checkout totals do not match the saved order.");
        }
        boolean newlyPaid = order.markPaid(
                payment.amountTotal(),
                payment.amountTax(),
                payment.paymentIntentId(),
                payment.customerEmail(),
                payment.customerName(),
                payment.customerPhone(),
                payment.shippingAddressJson());
        if (newlyPaid) eventPublisher.publishEvent(new OrderPaidEvent(order.getStripeCheckoutSessionId()));
        return newlyPaid;
    }
}
