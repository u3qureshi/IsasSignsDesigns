package com.isasigns.backend.model;

import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(unique = true, nullable = false)
    private String slug;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "text")
    private String description;

    private String category;

    @Column(name = "price_cents", nullable = false)
    private long priceCents;

    @Column(nullable = false)
    private String currency = "CAD";

    @Column(columnDefinition = "text")
    private String images; // JSON array stored as text

    private String material;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "long_description", columnDefinition = "text")
    private String longDescription;

    @Column(name = "is_featured", nullable = false)
    private Boolean isFeatured = false;

    @Column(name = "stock_qty")
    private Integer stockQty;

    @Column(name = "is_customizable", nullable = false)
    private Boolean isCustomizable = false;

    @Column(columnDefinition = "text[]")
    private String[] tags = new String[0];

    @Column(name = "on_sale", columnDefinition = "jsonb")
    private String onSale;

    public Product() {
    }

    @PrePersist
    public void prePersist() {
        if (id == null)
            id = UUID.randomUUID();
        if (createdAt == null)
            createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    // getters and setters omitted for brevity; use IDE to generate as needed
    // minimal getters for serialization

    public UUID getId() {
        return id;
    }

    public String getSlug() {
        return slug;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public long getPriceCents() {
        return priceCents;
    }

    public String getCurrency() {
        return currency;
    }

    public String getImages() {
        return images;
    }

    public String getMaterial() {
        return material;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public String getLongDescription() {
        return longDescription;
    }

    public Boolean getIsFeatured() {
        return isFeatured;
    }

    public Integer getStockQty() {
        return stockQty;
    }

    public Boolean getIsCustomizable() {
        return isCustomizable;
    }

    public String[] getTags() {
        return tags != null ? tags : new String[0];
    }

    public String getOnSale() {
        return onSale;
    }
}
