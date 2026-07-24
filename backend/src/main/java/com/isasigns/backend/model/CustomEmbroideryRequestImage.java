package com.isasigns.backend.model;

import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "custom_embroidery_request_images")
public class CustomEmbroideryRequestImage {
    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "request_id", nullable = false)
    private UUID requestId;

    @Column(name = "image_type", nullable = false)
    private String imageType;

    @Column(name = "original_filename")
    private String originalFilename;

    @Column(name = "cloudinary_asset_id", nullable = false)
    private String cloudinaryAssetId;

    @Column(name = "cloudinary_public_id", nullable = false)
    private String cloudinaryPublicId;

    @Column(name = "cloudinary_version")
    private Long cloudinaryVersion;

    @Column(name = "resource_type", nullable = false)
    private String resourceType;

    @Column(name = "delivery_type", nullable = false)
    private String deliveryType;

    @Column(nullable = false)
    private String format;

    private Integer width;
    private Integer height;
    private Long bytes;

    @Column(name = "customer_image_intent")
    private String customerImageIntent;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    protected CustomEmbroideryRequestImage() {
    }

    public CustomEmbroideryRequestImage(
            UUID requestId,
            String imageType,
            String originalFilename,
            String cloudinaryAssetId,
            String cloudinaryPublicId,
            Long cloudinaryVersion,
            String resourceType,
            String deliveryType,
            String format,
            Integer width,
            Integer height,
            Long bytes,
            String customerImageIntent,
            int displayOrder) {
        this.requestId = requestId;
        this.imageType = imageType;
        this.originalFilename = originalFilename;
        this.cloudinaryAssetId = cloudinaryAssetId;
        this.cloudinaryPublicId = cloudinaryPublicId;
        this.cloudinaryVersion = cloudinaryVersion;
        this.resourceType = resourceType;
        this.deliveryType = deliveryType;
        this.format = format;
        this.width = width;
        this.height = height;
        this.bytes = bytes;
        this.customerImageIntent = customerImageIntent;
        this.displayOrder = displayOrder;
    }

    @PrePersist
    void prePersist() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
    }

    public String getImageType() {
        return imageType;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public String getCloudinaryPublicId() {
        return cloudinaryPublicId;
    }

    public String getFormat() {
        return format;
    }

    public Integer getWidth() {
        return width;
    }

    public Integer getHeight() {
        return height;
    }

    public Long getBytes() {
        return bytes;
    }

    public String getCustomerImageIntent() {
        return customerImageIntent;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }
}
