package com.isasigns.backend.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.OctetSequenceKey;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;

import com.isasigns.backend.config.AuthProperties;
import com.isasigns.backend.model.AppUser;

@Service
public class JwtAccessTokenService {
    private final AuthProperties properties;
    private final JwtEncoder encoder;
    private final JwtDecoder decoder;

    public JwtAccessTokenService(AuthProperties properties) {
        this.properties = properties;
        SecretKey key = new SecretKeySpec(sha256(required(properties.getJwtSecret())), "HmacSHA256");
        var jwk = new OctetSequenceKey.Builder(key).algorithm(JWSAlgorithm.HS256).build();
        JWKSource<SecurityContext> jwkSource = (selector, context) -> selector.select(new JWKSet(jwk));
        this.encoder = new NimbusJwtEncoder(jwkSource);
        var jwtDecoder = NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();
        OAuth2TokenValidator<Jwt> audienceValidator = jwt -> jwt.getAudience()
                .contains(properties.getAudience())
                        ? OAuth2TokenValidatorResult.success()
                        : OAuth2TokenValidatorResult.failure(new OAuth2Error(
                                "invalid_token", "The access-token audience is invalid.", null));
        jwtDecoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefaultWithIssuer(properties.getIssuer()), audienceValidator));
        this.decoder = jwtDecoder;
    }

    public CreatedAccessToken create(AppUser user) {
        Instant issuedAt = Instant.now();
        Instant expiresAt = issuedAt.plus(properties.getAccessTokenMinutes(), ChronoUnit.MINUTES);
        var claims = JwtClaimsSet.builder()
                .issuer(properties.getIssuer())
                .issuedAt(issuedAt)
                .expiresAt(expiresAt)
                .subject(user.getId().toString())
                .audience(List.of(properties.getAudience()))
                .id(UUID.randomUUID().toString())
                .claim("roles", List.copyOf(user.getRoles()))
                .build();
        var header = JwsHeader.with(MacAlgorithm.HS256).type("JWT").build();
        String token = encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        return new CreatedAccessToken(token, expiresAt);
    }

    public Jwt decode(String token) { return decoder.decode(token); }

    private static String required(String value) {
        if (value == null || value.isBlank()) throw new IllegalStateException("AUTH_JWT_SECRET is required.");
        return value;
    }

    private static byte[] sha256(String value) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable.", exception);
        }
    }

    public record CreatedAccessToken(String value, Instant expiresAt) {}
}
