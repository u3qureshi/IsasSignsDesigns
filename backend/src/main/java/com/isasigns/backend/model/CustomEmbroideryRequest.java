package com.isasigns.backend.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "custom_embroidery_requests")
public class CustomEmbroideryRequest {
    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "request_number", nullable = false, unique = true)
    private String requestNumber;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "preferred_contact_method", nullable = false)
    private String preferredContactMethod;

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(name = "customer_phone")
    private String customerPhone;

    @Column(name = "contact_identity_hmac", nullable = false, length = 64)
    private String contactIdentityHmac;

    @Column(name = "idea_description", nullable = false, columnDefinition = "text")
    private String ideaDescription;

    @Column(name = "exact_text", columnDefinition = "text")
    private String exactText;

    @Column(name = "ai_mode", nullable = false)
    private String aiMode;

    @Column(name = "ai_used", nullable = false)
    private boolean aiUsed;

    @Column(name = "customer_image_intent")
    private String customerImageIntent;

    @Column(name = "ai_preview_failed", nullable = false)
    private boolean aiPreviewFailed;

    @Column(name = "item_provider", nullable = false)
    private String itemProvider;

    @Column(name = "item_type", nullable = false)
    private String itemType;

    @Column(name = "custom_item_description", columnDefinition = "text")
    private String customItemDescription;

    @Column(name = "garment_color")
    private String garmentColor;

    @Column(nullable = false)
    private String placement;

    @Column(name = "custom_placement_description", columnDefinition = "text")
    private String customPlacementDescription;

    @Column(name = "size_mode", nullable = false)
    private String sizeMode;

    @Column(name = "requested_width_inches")
    private BigDecimal requestedWidthInches;

    @Column(name = "requested_height_inches")
    private BigDecimal requestedHeightInches;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "customer_acknowledged_estimate", nullable = false)
    private boolean customerAcknowledgedEstimate;

    @Column(name = "customer_confirmed_content_rights", nullable = false)
    private boolean customerConfirmedContentRights;

    @Column(nullable = false)
    private String status;

    @Column(name = "ai_provider")
    private String aiProvider;

    @Column(name = "ai_model")
    private String aiModel;

    @Column(name = "generated_prompt", columnDefinition = "text")
    private String generatedPrompt;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected CustomEmbroideryRequest() {
    }

    public CustomEmbroideryRequest(
            String requestNumber,
            String customerName,
            String preferredContactMethod,
            String customerEmail,
            String customerPhone,
            String contactIdentityHmac,
            String ideaDescription,
            String exactText,
            String aiMode,
            boolean aiUsed,
            String customerImageIntent,
            boolean aiPreviewFailed,
            String itemProvider,
            String itemType,
            String customItemDescription,
            String garmentColor,
            String placement,
            String customPlacementDescription,
            String sizeMode,
            BigDecimal requestedWidthInches,
            BigDecimal requestedHeightInches,
            int quantity,
            boolean customerAcknowledgedEstimate,
            boolean customerConfirmedContentRights,
            String aiProvider,
            String aiModel,
            String generatedPrompt) {
        this.requestNumber = requestNumber;
        this.customerName = customerName;
        this.preferredContactMethod = preferredContactMethod;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.contactIdentityHmac = contactIdentityHmac;
        this.ideaDescription = ideaDescription;
        this.exactText = exactText;
        this.aiMode = aiMode;
        this.aiUsed = aiUsed;
        this.customerImageIntent = customerImageIntent;
        this.aiPreviewFailed = aiPreviewFailed;
        this.itemProvider = itemProvider;
        this.itemType = itemType;
        this.customItemDescription = customItemDescription;
        this.garmentColor = garmentColor;
        this.placement = placement;
        this.customPlacementDescription = customPlacementDescription;
        this.sizeMode = sizeMode;
        this.requestedWidthInches = requestedWidthInches;
        this.requestedHeightInches = requestedHeightInches;
        this.quantity = quantity;
        this.customerAcknowledgedEstimate = customerAcknowledgedEstimate;
        this.customerConfirmedContentRights = customerConfirmedContentRights;
        this.status = "SUBMITTED";
        this.aiProvider = aiProvider;
        this.aiModel = aiModel;
        this.generatedPrompt = generatedPrompt;
    }

    @PrePersist
    void prePersist() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        var now = OffsetDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
    }

    public UUID getId() {
        return id;
    }

    public String getRequestNumber() {
        return requestNumber;
    }

    public String getStatus() {
        return status;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getPreferredContactMethod() {
        return preferredContactMethod;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public String getIdeaDescription() {
        return ideaDescription;
    }

    public String getExactText() {
        return exactText;
    }

    public String getAiMode() {
        return aiMode;
    }

    public boolean isAiUsed() {
        return aiUsed;
    }

    public String getCustomerImageIntent() {
        return customerImageIntent;
    }

    public boolean isAiPreviewFailed() {
        return aiPreviewFailed;
    }

    public String getItemProvider() {
        return itemProvider;
    }

    public String getItemType() {
        return itemType;
    }

    public String getCustomItemDescription() {
        return customItemDescription;
    }

    public String getGarmentColor() {
        return garmentColor;
    }

    public String getPlacement() {
        return placement;
    }

    public String getCustomPlacementDescription() {
        return customPlacementDescription;
    }

    public String getSizeMode() {
        return sizeMode;
    }

    public BigDecimal getRequestedWidthInches() {
        return requestedWidthInches;
    }

    public BigDecimal getRequestedHeightInches() {
        return requestedHeightInches;
    }

    public int getQuantity() {
        return quantity;
    }

    public boolean isCustomerAcknowledgedEstimate() {
        return customerAcknowledgedEstimate;
    }

    public boolean isCustomerConfirmedContentRights() {
        return customerConfirmedContentRights;
    }

    public String getAiProvider() {
        return aiProvider;
    }

    public String getAiModel() {
        return aiModel;
    }

    public String getGeneratedPrompt() {
        return generatedPrompt;
    }
}
