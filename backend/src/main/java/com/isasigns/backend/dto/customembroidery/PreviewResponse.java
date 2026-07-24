package com.isasigns.backend.dto.customembroidery;

import java.time.OffsetDateTime;

public record PreviewResponse(
        String imageBase64,
        String mediaType,
        String previewToken,
        OffsetDateTime expiresAt) {
}
