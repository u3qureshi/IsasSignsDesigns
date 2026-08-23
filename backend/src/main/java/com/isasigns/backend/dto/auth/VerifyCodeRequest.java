package com.isasigns.backend.dto.auth;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record VerifyCodeRequest(
        @NotNull(message = "The sign-in request is missing.") UUID challengeId,
        @NotBlank(message = "Enter the email code.")
        @Pattern(regexp = "\\d{4}", message = "Enter the complete four-digit code.")
        String code) {}
