package com.isasigns.backend.model;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.domain.Persistable;

@Entity
@Table(name = "customer_orders")
public class CustomerOrder implements Persistable<UUID> {
    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "order_number", nullable = false, unique = true)
    private String orderNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(name = "subtotal_cents", nullable = false)
    private long subtotalCents;

    @Column(name = "shipping_cents", nullable = false)
    private long shippingCents;

    @Column(name = "tax_cents", nullable = false)
    private long taxCents;

    @Column(name = "total_cents", nullable = false)
    private long totalCents;

    @Column(name = "stripe_checkout_session_id", unique = true)
    private String stripeCheckoutSessionId;

    @Column(name = "stripe_payment_intent_id")
    private String stripePaymentIntentId;

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_phone")
    private String customerPhone;

    @Column(name = "shipping_address", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String shippingAddress;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @Column(name = "paid_at")
    private OffsetDateTime paidAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderItem> items = new ArrayList<>();

    protected CustomerOrder() {
    }

    public CustomerOrder(String orderNumber, String currency, long subtotalCents, long shippingCents) {
        this.id = UUID.randomUUID();
        this.orderNumber = orderNumber;
        this.status = OrderStatus.PENDING_PAYMENT;
        this.currency = currency;
        this.subtotalCents = subtotalCents;
        this.shippingCents = shippingCents;
        this.taxCents = 0;
        this.totalCents = subtotalCents + shippingCents;
    }

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID();
        OffsetDateTime now = OffsetDateTime.now();
        if (createdAt == null) createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    public void addItem(OrderItem item) {
        items.add(item);
        item.attachTo(this);
    }

    public void attachCheckoutSession(String sessionId) {
        this.stripeCheckoutSessionId = sessionId;
    }

    public void markCheckoutFailed() {
        if (status == OrderStatus.PENDING_PAYMENT) status = OrderStatus.CHECKOUT_FAILED;
    }

    public boolean markPaymentProcessing() {
        if (status != OrderStatus.PAID) status = OrderStatus.PAYMENT_PROCESSING;
        return status == OrderStatus.PAYMENT_PROCESSING;
    }

    public boolean markPaid(long stripeTotalCents, long stripeTaxCents, String paymentIntentId,
            String email, String name, String phone, String shippingAddress) {
        if (status == OrderStatus.PAID) return false;
        status = OrderStatus.PAID;
        totalCents = stripeTotalCents;
        taxCents = stripeTaxCents;
        stripePaymentIntentId = paymentIntentId;
        customerEmail = email;
        customerName = name;
        customerPhone = phone;
        this.shippingAddress = shippingAddress;
        paidAt = OffsetDateTime.now();
        return true;
    }

    public void markPaymentFailed() {
        if (status != OrderStatus.PAID) status = OrderStatus.PAYMENT_FAILED;
    }

    public void markExpired() {
        if (status != OrderStatus.PAID) status = OrderStatus.EXPIRED;
    }

    @Override
    public UUID getId() { return id; }

    @Override
    @Transient
    public boolean isNew() { return createdAt == null; }
    public String getOrderNumber() { return orderNumber; }
    public OrderStatus getStatus() { return status; }
    public String getCurrency() { return currency; }
    public long getSubtotalCents() { return subtotalCents; }
    public long getShippingCents() { return shippingCents; }
    public long getTaxCents() { return taxCents; }
    public long getTotalCents() { return totalCents; }
    public String getStripeCheckoutSessionId() { return stripeCheckoutSessionId; }
    public String getCustomerEmail() { return customerEmail; }
    public String getCustomerName() { return customerName; }
    public String getCustomerPhone() { return customerPhone; }
    public String getShippingAddress() { return shippingAddress; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getPaidAt() { return paidAt; }
    public List<OrderItem> getItems() { return items; }
}
