package com.isasigns.backend.dto.auth;

import java.util.UUID;

public record AuthChallengeResponse(
        UUID challengeId,
        String message,
        long expiresInSeconds,
        int resendAvailableInSeconds) {}
