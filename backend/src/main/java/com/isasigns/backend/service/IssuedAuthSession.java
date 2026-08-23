package com.isasigns.backend.service;

import java.time.Instant;
import java.time.OffsetDateTime;

import com.isasigns.backend.model.AppUser;

public record IssuedAuthSession(
        AppUser user,
        String accessToken,
        Instant accessExpiresAt,
        String refreshToken,
        OffsetDateTime refreshExpiresAt) {}
