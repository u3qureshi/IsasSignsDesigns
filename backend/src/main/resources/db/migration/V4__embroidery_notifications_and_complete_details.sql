ALTER TABLE custom_embroidery_requests
    ADD COLUMN customer_image_intent varchar(40),
    ADD COLUMN ai_preview_failed boolean NOT NULL DEFAULT false;

CREATE TABLE custom_embroidery_notifications (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id uuid NOT NULL
        REFERENCES custom_embroidery_requests(id) ON DELETE CASCADE,
    audience varchar(20) NOT NULL,
    channel varchar(20) NOT NULL,
    recipient varchar(320),
    subject varchar(300),
    message_body text NOT NULL,
    status varchar(20) NOT NULL DEFAULT 'PENDING',
    provider varchar(80),
    provider_message_id varchar(255),
    error_message text,
    attempted_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT custom_embroidery_notification_audience_check
        CHECK (audience IN ('CUSTOMER', 'ADMIN')),
    CONSTRAINT custom_embroidery_notification_channel_check
        CHECK (channel IN ('EMAIL', 'SMS')),
    CONSTRAINT custom_embroidery_notification_status_check
        CHECK (status IN ('PENDING', 'SENT', 'FAILED', 'SKIPPED'))
);

CREATE INDEX idx_custom_embroidery_notifications_request_id
    ON custom_embroidery_notifications (request_id);
CREATE INDEX idx_custom_embroidery_notifications_status
    ON custom_embroidery_notifications (status, created_at);
