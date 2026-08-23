package com.isasigns.backend.repository;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.isasigns.backend.model.AuthRefreshSession;

public interface AuthRefreshSessionRepository extends JpaRepository<AuthRefreshSession, UUID> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<AuthRefreshSession> findByTokenDigest(String tokenDigest);

    @Modifying
    @Query("update AuthRefreshSession session set session.revokedAt = :now "
            + "where session.familyId = :familyId and session.revokedAt is null")
    int revokeFamily(@Param("familyId") UUID familyId, @Param("now") OffsetDateTime now);
}
