package com.isasigns.backend.model;

import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.Table;

@Entity
@Table(name = "auth_email_challenges")
public class AuthEmailChallenge {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @Column(name = "normalized_email", nullable = false, length = 320)
    private String normalizedEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AuthChallengePurpose purpose;

    @Column(name = "code_digest", nullable = false, length = 64)
    private String codeDigest;

    @Column(name = "request_ip_digest", nullable = false, length = 64)
    private String requestIpDigest;

    @Column(name = "expires_at", nullable = false)
    private OffsetDateTime expiresAt;

    @Column(nullable = false)
    private int attempts;

    @Column(name = "max_attempts", nullable = false)
    private int maxAttempts;

    @Column(name = "consumed_at")
    private OffsetDateTime consumedAt;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    protected AuthEmailChallenge() {}

    public AuthEmailChallenge(UUID id, AppUser user, String normalizedEmail,
            AuthChallengePurpose purpose, String codeDigest, String requestIpDigest,
            OffsetDateTime expiresAt, int maxAttempts) {
        this.id = id;
        this.user = user;
        this.normalizedEmail = normalizedEmail;
        this.purpose = purpose;
        this.codeDigest = codeDigest;
        this.requestIpDigest = requestIpDigest;
        this.expiresAt = expiresAt;
        this.maxAttempts = maxAttempts;
        this.createdAt = OffsetDateTime.now();
    }

    public boolean isUsableAt(OffsetDateTime now) {
        return consumedAt == null && attempts < maxAttempts && expiresAt.isAfter(now);
    }

    public void recordFailedAttempt() { attempts++; }
    public void consume() { consumedAt = OffsetDateTime.now(); }

    public UUID getId() { return id; }
    public AppUser getUser() { return user; }
    public String getNormalizedEmail() { return normalizedEmail; }
    public AuthChallengePurpose getPurpose() { return purpose; }
    public String getCodeDigest() { return codeDigest; }
    public OffsetDateTime getExpiresAt() { return expiresAt; }
    public int getAttempts() { return attempts; }
    public int getMaxAttempts() { return maxAttempts; }
    public OffsetDateTime getConsumedAt() { return consumedAt; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
