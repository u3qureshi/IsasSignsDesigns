package com.isasigns.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @NotBlank(message = "Enter your first name.")
        @Size(max = 80, message = "First name must be 80 characters or fewer.")
        String firstName,
        @Size(max = 80, message = "Last name must be 80 characters or fewer.")
        String lastName,
        @NotBlank(message = "Enter your email address.")
        @Email(message = "Enter a valid email address.")
        @Size(max = 255, message = "Email address is too long.")
        String email,
        @NotBlank(message = "Enter your email address again.")
        @Email(message = "Enter a valid confirmation email address.")
        @Size(max = 255, message = "Confirmation email address is too long.")
        String emailConfirmation,
        @Size(max = 30, message = "Phone number is too long.")
        String phone,
        boolean smsConsent) {}
