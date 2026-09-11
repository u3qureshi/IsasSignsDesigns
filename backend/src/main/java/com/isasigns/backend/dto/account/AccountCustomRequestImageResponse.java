package com.isasigns.backend.dto.account;

public record AccountCustomRequestImageResponse(
        String imageType,
        String publicId,
        String format) {}
