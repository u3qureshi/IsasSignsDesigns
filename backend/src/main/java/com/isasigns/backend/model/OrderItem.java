package com.isasigns.backend.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private CustomerOrder order;

    @Column(name = "product_id", nullable = false, columnDefinition = "uuid")
    private UUID productId;
    @Column(name = "product_slug", nullable = false)
    private String productSlug;
    @Column(name = "product_name", nullable = false)
    private String productName;
    @Column(name = "variant_id")
    private String variantId;
    @Column(name = "variant_name")
    private String variantName;
    private String size;
    @Column(name = "image_public_id", columnDefinition = "text")
    private String imagePublicId;
    @Column(name = "unit_price_cents", nullable = false)
    private long unitPriceCents;
    @Column(nullable = false)
    private int quantity;
    @Column(name = "line_total_cents", nullable = false)
    private long lineTotalCents;

    protected OrderItem() {
    }

    public OrderItem(UUID productId, String productSlug, String productName, String variantId,
            String variantName, String size, String imagePublicId, long unitPriceCents, int quantity) {
        this.id = UUID.randomUUID();
        this.productId = productId;
        this.productSlug = productSlug;
        this.productName = productName;
        this.variantId = variantId;
        this.variantName = variantName;
        this.size = size;
        this.imagePublicId = imagePublicId;
        this.unitPriceCents = unitPriceCents;
        this.quantity = quantity;
        this.lineTotalCents = Math.multiplyExact(unitPriceCents, quantity);
    }

    void attachTo(CustomerOrder order) { this.order = order; }

    public UUID getId() { return id; }
    public UUID getProductId() { return productId; }
    public String getProductSlug() { return productSlug; }
    public String getProductName() { return productName; }
    public String getVariantId() { return variantId; }
    public String getVariantName() { return variantName; }
    public String getSize() { return size; }
    public String getImagePublicId() { return imagePublicId; }
    public long getUnitPriceCents() { return unitPriceCents; }
    public int getQuantity() { return quantity; }
    public long getLineTotalCents() { return lineTotalCents; }
}
