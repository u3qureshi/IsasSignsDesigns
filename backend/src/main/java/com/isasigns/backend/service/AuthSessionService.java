package com.isasigns.backend.service;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.isasigns.backend.config.AuthProperties;
import com.isasigns.backend.exception.AuthRequestException;
import com.isasigns.backend.model.AppUser;
import com.isasigns.backend.model.AuthRefreshSession;
import com.isasigns.backend.repository.AuthRefreshSessionRepository;

@Service
public class AuthSessionService {
    private final AuthRefreshSessionRepository sessionRepository;
    private final AuthCryptoService cryptoService;
    private final JwtAccessTokenService jwtService;
    private final AuthProperties properties;

    public AuthSessionService(AuthRefreshSessionRepository sessionRepository,
            AuthCryptoService cryptoService, JwtAccessTokenService jwtService,
            AuthProperties properties) {
        this.sessionRepository = sessionRepository;
        this.cryptoService = cryptoService;
        this.jwtService = jwtService;
        this.properties = properties;
    }

    @Transactional
    public IssuedAuthSession issue(AppUser user, String userAgent) {
        return create(user, UUID.randomUUID(), userAgent);
    }

    @Transactional(noRollbackFor = AuthRequestException.class)
    public IssuedAuthSession refresh(String rawRefreshToken, String userAgent) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) throw unauthorized();

        var current = sessionRepository.findByTokenDigest(cryptoService.tokenDigest(rawRefreshToken))
                .orElseThrow(this::unauthorized);
        var now = OffsetDateTime.now();

        if (current.getRevokedAt() != null) {
            sessionRepository.revokeFamily(current.getFamilyId(), now);
            throw new AuthRequestException(HttpStatus.UNAUTHORIZED,
                    "This session is no longer valid. Please sign in again.");
        }
        if (!current.isActiveAt(now) || !current.getUser().isActive()) {
            current.revoke();
            throw unauthorized();
        }

        IssuedAuthSession replacement = create(current.getUser(), current.getFamilyId(), userAgent);
        UUID replacementId = sessionRepository.findByTokenDigest(
                cryptoService.tokenDigest(replacement.refreshToken()))
                .orElseThrow().getId();
        current.rotateTo(replacementId);
        return replacement;
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) return;
        sessionRepository.findByTokenDigest(cryptoService.tokenDigest(rawRefreshToken))
                .ifPresent(AuthRefreshSession::revoke);
    }

    private IssuedAuthSession create(AppUser user, UUID familyId, String userAgent) {
        String refreshToken = cryptoService.newRefreshToken();
        OffsetDateTime refreshExpiresAt = OffsetDateTime.now().plusDays(properties.getRefreshTokenDays());
        var session = new AuthRefreshSession(
                user,
                familyId,
                cryptoService.tokenDigest(refreshToken),
                userAgent == null || userAgent.isBlank() ? null : cryptoService.privacyDigest(userAgent),
                refreshExpiresAt);
        sessionRepository.save(session);

        var access = jwtService.create(user);
        return new IssuedAuthSession(user, access.value(), access.expiresAt(), refreshToken, refreshExpiresAt);
    }

    private AuthRequestException unauthorized() {
        return new AuthRequestException(HttpStatus.UNAUTHORIZED,
                "Your session has expired. Please sign in again.");
    }
}
