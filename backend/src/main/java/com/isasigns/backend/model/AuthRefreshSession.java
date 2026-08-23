package com.isasigns.backend.model;

import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "auth_refresh_sessions")
public class AuthRefreshSession {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(name = "family_id", nullable = false)
    private UUID familyId;

    @Column(name = "token_digest", nullable = false, unique = true, length = 64)
    private String tokenDigest;

    @Column(name = "user_agent_digest", length = 64)
    private String userAgentDigest;

    @Column(name = "expires_at", nullable = false)
    private OffsetDateTime expiresAt;

    @Column(name = "last_used_at")
    private OffsetDateTime lastUsedAt;

    @Column(name = "revoked_at")
    private OffsetDateTime revokedAt;

    @Column(name = "replaced_by_session_id")
    private UUID replacedBySessionId;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    protected AuthRefreshSession() {}

    public AuthRefreshSession(AppUser user, UUID familyId, String tokenDigest,
            String userAgentDigest, OffsetDateTime expiresAt) {
        this.id = UUID.randomUUID();
        this.user = user;
        this.familyId = familyId;
        this.tokenDigest = tokenDigest;
        this.userAgentDigest = userAgentDigest;
        this.expiresAt = expiresAt;
        this.createdAt = OffsetDateTime.now();
    }

    public boolean isActiveAt(OffsetDateTime now) {
        return revokedAt == null && expiresAt.isAfter(now);
    }

    public void rotateTo(UUID replacementId) {
        this.lastUsedAt = OffsetDateTime.now();
        this.revokedAt = lastUsedAt;
        this.replacedBySessionId = replacementId;
    }

    public void revoke() {
        if (revokedAt == null) revokedAt = OffsetDateTime.now();
    }

    public UUID getId() { return id; }
    public AppUser getUser() { return user; }
    public UUID getFamilyId() { return familyId; }
    public String getTokenDigest() { return tokenDigest; }
    public OffsetDateTime getExpiresAt() { return expiresAt; }
    public OffsetDateTime getRevokedAt() { return revokedAt; }
    public UUID getReplacedBySessionId() { return replacedBySessionId; }
}
