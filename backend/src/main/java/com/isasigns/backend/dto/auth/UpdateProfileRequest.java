package com.isasigns.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank(message = "Enter your first name.")
        @Size(max = 80, message = "First name must be 80 characters or fewer.")
        String firstName,
        @Size(max = 80, message = "Last name must be 80 characters or fewer.")
        String lastName,
        @Size(max = 30, message = "Phone number is too long.")
        String phone,
        boolean smsConsent) {}
