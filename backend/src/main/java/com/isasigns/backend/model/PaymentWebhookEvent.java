package com.isasigns.backend.model;

import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "payment_webhook_events")
public class PaymentWebhookEvent {
    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;
    @Column(nullable = false)
    private String provider;
    @Column(name = "event_id", nullable = false)
    private String eventId;
    @Column(name = "event_type", nullable = false)
    private String eventType;
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
    @Column(name = "processed_at", nullable = false)
    private OffsetDateTime processedAt;

    protected PaymentWebhookEvent() {
    }

    public PaymentWebhookEvent(String provider, String eventId, String eventType) {
        this.id = UUID.randomUUID();
        this.provider = provider;
        this.eventId = eventId;
        this.eventType = eventType;
        this.createdAt = OffsetDateTime.now();
        this.processedAt = this.createdAt;
    }
}
