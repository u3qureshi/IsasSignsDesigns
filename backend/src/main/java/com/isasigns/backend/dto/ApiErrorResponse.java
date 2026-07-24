package com.isasigns.backend.dto;

import java.time.OffsetDateTime;
import java.util.List;

public record ApiErrorResponse(
        int status,
        String message,
        List<String> details,
        OffsetDateTime timestamp) {
}
