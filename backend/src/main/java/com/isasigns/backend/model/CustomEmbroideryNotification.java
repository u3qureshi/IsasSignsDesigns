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
@Table(name = "custom_embroidery_notifications")
public class CustomEmbroideryNotification {
    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "request_id", nullable = false)
    private UUID requestId;

    @Column(nullable = false)
    private String audience;

    @Column(nullable = false)
    private String channel;

    private String recipient;
    private String subject;

    @Column(name = "message_body", nullable = false, columnDefinition = "text")
    private String messageBody;

    @Column(nullable = false)
    private String status;

    private String provider;

    @Column(name = "provider_message_id")
    private String providerMessageId;

    @Column(name = "error_message", columnDefinition = "text")
    private String errorMessage;

    @Column(name = "attempted_at")
    private OffsetDateTime attemptedAt;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected CustomEmbroideryNotification() {
    }

    public CustomEmbroideryNotification(
            UUID requestId,
            String audience,
            String channel,
            String recipient,
            String subject,
            String messageBody,
            String provider) {
        this.requestId = requestId;
        this.audience = audience;
        this.channel = channel;
        this.recipient = recipient;
        this.subject = subject;
        this.messageBody = messageBody;
        this.provider = provider;
        this.status = "PENDING";
    }

    public void markSent(String providerMessageId) {
        status = "SENT";
        this.providerMessageId = providerMessageId;
        errorMessage = null;
        attemptedAt = OffsetDateTime.now();
    }

    public void markFailed(String errorMessage) {
        status = "FAILED";
        this.errorMessage = truncate(errorMessage);
        attemptedAt = OffsetDateTime.now();
    }

    public void markSkipped(String reason) {
        status = "SKIPPED";
        errorMessage = truncate(reason);
        attemptedAt = OffsetDateTime.now();
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

    @PreUpdate
    void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    private String truncate(String value) {
        if (value == null || value.length() <= 2000) {
            return value;
        }
        return value.substring(0, 2000);
    }
}
