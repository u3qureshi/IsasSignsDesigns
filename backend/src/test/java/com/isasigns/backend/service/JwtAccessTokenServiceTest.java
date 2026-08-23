package com.isasigns.backend.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.isasigns.backend.config.AuthProperties;
import com.isasigns.backend.model.AppUser;

class JwtAccessTokenServiceTest {
    @Test
    void signsAndValidatesShortLivedAccessToken() {
        var properties = new AuthProperties();
        properties.setJwtSecret("test-only-jwt-secret-that-is-never-used-in-production");
        properties.setIssuer("https://auth.thread-and-butter.invalid");
        properties.setAudience("thread-and-butter-web-test");
        properties.setAccessTokenMinutes(15);
        var service = new JwtAccessTokenService(properties);
        var user = new AppUser("Avery", "Customer", "avery@example.com",
                "avery@example.com", null, null, false);
        user.activate();

        var created = service.create(user);
        var decoded = service.decode(created.value());

        assertThat(decoded.getSubject()).isEqualTo(user.getId().toString());
        assertThat(decoded.getIssuer().toString()).isEqualTo("https://auth.thread-and-butter.invalid");
        assertThat(decoded.getAudience()).containsExactly("thread-and-butter-web-test");
        assertThat(decoded.getId()).isNotBlank();
        assertThat(decoded.getClaimAsStringList("roles")).containsExactly("CUSTOMER");
        assertThat(created.expiresAt()).isAfter(decoded.getIssuedAt());
    }
}
