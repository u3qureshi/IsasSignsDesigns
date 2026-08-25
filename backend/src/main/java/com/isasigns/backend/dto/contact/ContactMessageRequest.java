package com.isasigns.backend.dto.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactMessageRequest(
        @NotBlank(message = "Enter your name.")
        @Size(max = 120, message = "Name must be 120 characters or fewer.")
        String name,
        @NotBlank(message = "Enter your email address.")
        @Email(message = "Enter a valid email address.")
        @Size(max = 255, message = "Email address is too long.")
        String email,
        @Size(max = 160, message = "Subject must be 160 characters or fewer.")
        String subject,
        @NotBlank(message = "Enter your message.")
        @Size(max = 5000, message = "Message must be 5,000 characters or fewer.")
        String message) {}
