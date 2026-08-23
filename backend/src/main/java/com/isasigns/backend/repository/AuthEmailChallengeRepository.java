package com.isasigns.backend.repository;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import com.isasigns.backend.model.AuthChallengePurpose;
import com.isasigns.backend.model.AuthEmailChallenge;

public interface AuthEmailChallengeRepository extends JpaRepository<AuthEmailChallenge, UUID> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<AuthEmailChallenge> findById(UUID id);

    Optional<AuthEmailChallenge> findTopByNormalizedEmailAndPurposeOrderByCreatedAtDesc(
            String normalizedEmail, AuthChallengePurpose purpose);

    long countByNormalizedEmailAndCreatedAtAfter(String normalizedEmail, OffsetDateTime createdAfter);
    long countByRequestIpDigestAndCreatedAtAfter(String requestIpDigest, OffsetDateTime createdAfter);
}
