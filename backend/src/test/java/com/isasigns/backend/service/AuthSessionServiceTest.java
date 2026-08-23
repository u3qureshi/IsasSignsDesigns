package com.isasigns.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.isasigns.backend.config.AuthProperties;
import com.isasigns.backend.exception.AuthRequestException;
import com.isasigns.backend.model.AppUser;
import com.isasigns.backend.model.AuthRefreshSession;
import com.isasigns.backend.repository.AuthRefreshSessionRepository;

@ExtendWith(MockitoExtension.class)
class AuthSessionServiceTest {
    @Mock AuthRefreshSessionRepository repository;
    @Mock JwtAccessTokenService jwtService;

    private final Map<String, AuthRefreshSession> sessions = new LinkedHashMap<>();
    private AuthCryptoService crypto;
    private AuthSessionService service;

    @BeforeEach
    void setUp() {
        var properties = new AuthProperties();
        properties.setOtpPepper("test-only-pepper-with-enough-random-looking-characters");
        properties.setRefreshTokenDays(30);
        crypto = new AuthCryptoService(properties);
        service = new AuthSessionService(repository, crypto, jwtService, properties);

        when(repository.save(any(AuthRefreshSession.class))).thenAnswer(invocation -> {
            AuthRefreshSession session = invocation.getArgument(0);
            sessions.put(session.getTokenDigest(), session);
            return session;
        });
        when(repository.findByTokenDigest(any())).thenAnswer(invocation ->
                Optional.ofNullable(sessions.get(invocation.getArgument(0))));
        when(jwtService.create(any(AppUser.class)))
                .thenReturn(new JwtAccessTokenService.CreatedAccessToken(
                                "access-one", Instant.now().plusSeconds(900)),
                        new JwtAccessTokenService.CreatedAccessToken(
                                "access-two", Instant.now().plusSeconds(900)));
    }

    @Test
    void refreshRotatesOpaqueTokenAndReuseRevokesFamily() {
        var user = new AppUser("Avery", "Customer", "avery@example.com",
                "avery@example.com", null, null, false);
        user.activate();

        IssuedAuthSession first = service.issue(user, "test-agent");
        AuthRefreshSession firstStored = sessions.get(crypto.tokenDigest(first.refreshToken()));
        IssuedAuthSession second = service.refresh(first.refreshToken(), "test-agent");

        assertThat(second.refreshToken()).isNotEqualTo(first.refreshToken());
        assertThat(firstStored.getRevokedAt()).isNotNull();
        assertThat(firstStored.getReplacedBySessionId()).isNotNull();
        assertThat(sessions.get(crypto.tokenDigest(second.refreshToken())).getFamilyId())
                .isEqualTo(firstStored.getFamilyId());

        assertThatThrownBy(() -> service.refresh(first.refreshToken(), "test-agent"))
                .isInstanceOf(AuthRequestException.class)
                .hasMessageContaining("no longer valid");
        verify(repository).revokeFamily(eq(firstStored.getFamilyId()), any());
    }
}
