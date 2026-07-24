package com.isasigns.backend.dto.customembroidery;

import java.time.OffsetDateTime;
import java.util.UUID;

public record SubmitResponse(
        UUID id,
        String requestNumber,
        String status,
        OffsetDateTime submittedAt) {
}
