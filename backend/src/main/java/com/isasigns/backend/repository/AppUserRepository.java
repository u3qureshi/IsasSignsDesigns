package com.isasigns.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.isasigns.backend.model.AppUser;

public interface AppUserRepository extends JpaRepository<AppUser, UUID> {
    Optional<AppUser> findByNormalizedEmail(String normalizedEmail);
    boolean existsByNormalizedPhone(String normalizedPhone);
    boolean existsByNormalizedPhoneAndIdNot(String normalizedPhone, UUID id);
}
