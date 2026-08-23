package com.isasigns.backend.dto.auth;

import java.util.Set;
import java.util.UUID;

import com.isasigns.backend.model.AppUser;

public record AuthUserResponse(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String phone,
        boolean smsConsent,
        Set<String> roles) {

    public static AuthUserResponse from(AppUser user) {
        return new AuthUserResponse(user.getId(), user.getFirstName(), user.getLastName(),
                user.getEmail(), user.getPhone(), user.isSmsConsent(), user.getRoles());
    }
}
