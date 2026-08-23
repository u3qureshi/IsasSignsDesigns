package com.isasigns.backend.model;

import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "app_users")
public class AppUser {
    @Id
    private UUID id;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "first_name", nullable = false, length = 80)
    private String firstName;

    @Column(name = "last_name", length = 80)
    private String lastName;

    @Column(length = 255)
    private String email;

    @Column(name = "normalized_email", unique = true, length = 255)
    private String normalizedEmail;

    @Column(length = 30)
    private String phone;

    @Column(name = "normalized_phone", unique = true, length = 30)
    private String normalizedPhone;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "sms_consent", nullable = false)
    private boolean smsConsent;

    @Column(name = "email_verified_at")
    private OffsetDateTime emailVerifiedAt;

    @Column(name = "phone_verified_at")
    private OffsetDateTime phoneVerifiedAt;

    @Column(name = "last_login_at")
    private OffsetDateTime lastLoginAt;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role", nullable = false, length = 40)
    private Set<String> roles = new LinkedHashSet<>();

    protected AppUser() {}

    public AppUser(String firstName, String lastName, String email, String normalizedEmail,
            String phone, String normalizedPhone, boolean smsConsent) {
        this.id = UUID.randomUUID();
        updateProfile(firstName, lastName, phone, normalizedPhone, smsConsent);
        this.email = email;
        this.normalizedEmail = normalizedEmail;
        this.status = "PENDING";
        this.roles.add("CUSTOMER");
    }

    public void updatePendingSignup(String firstName, String lastName, String email,
            String phone, String normalizedPhone, boolean smsConsent) {
        if (!"PENDING".equals(status)) return;
        this.email = email;
        updateProfile(firstName, lastName, phone, normalizedPhone, smsConsent);
    }

    public void updateProfile(String firstName, String lastName, String phone,
            String normalizedPhone, boolean smsConsent) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = (firstName + " " + (lastName == null ? "" : lastName)).trim();
        this.phone = phone;
        this.normalizedPhone = normalizedPhone;
        this.smsConsent = smsConsent;
    }

    public void activate() {
        status = "ACTIVE";
        emailVerifiedAt = OffsetDateTime.now();
        lastLoginAt = emailVerifiedAt;
    }

    public void recordLogin() { lastLoginAt = OffsetDateTime.now(); }
    public boolean isActive() { return "ACTIVE".equals(status); }

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID();
        var now = OffsetDateTime.now();
        if (createdAt == null) createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() { updatedAt = OffsetDateTime.now(); }

    public UUID getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getNormalizedEmail() { return normalizedEmail; }
    public String getPhone() { return phone; }
    public boolean isSmsConsent() { return smsConsent; }
    public String getStatus() { return status; }
    public OffsetDateTime getEmailVerifiedAt() { return emailVerifiedAt; }
    public OffsetDateTime getLastLoginAt() { return lastLoginAt; }
    public Set<String> getRoles() { return Set.copyOf(roles); }
}
