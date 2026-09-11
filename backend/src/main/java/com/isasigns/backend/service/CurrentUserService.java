package com.isasigns.backend.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.isasigns.backend.model.AppUser;
import com.isasigns.backend.repository.AppUserRepository;

@Service
public class CurrentUserService {
    private final AppUserRepository userRepository;

    public CurrentUserService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<UUID> currentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return Optional.empty();
        }
        try {
            return Optional.of(UUID.fromString(authentication.getName()));
        } catch (IllegalArgumentException exception) {
            return Optional.empty();
        }
    }

    public AppUser requireCurrentUser() {
        UUID userId = currentUserId().orElseThrow(() -> new IllegalStateException("Authentication is required."));
        return userRepository.findById(userId)
                .filter(AppUser::isActive)
                .orElseThrow(() -> new IllegalStateException("The signed-in account is unavailable."));
    }
}
