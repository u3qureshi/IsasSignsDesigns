ALTER TABLE custom_embroidery_requests
    ADD COLUMN service_type varchar(20) NOT NULL DEFAULT 'embroidery';

ALTER TABLE custom_embroidery_requests
    ADD CONSTRAINT custom_design_service_type_check
        CHECK (service_type IN ('embroidery', 'printing'));

CREATE INDEX idx_custom_design_requests_service_created
    ON custom_embroidery_requests (service_type, created_at DESC);
