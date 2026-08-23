package com.isasigns.backend.service;

import java.time.Duration;
import java.time.Instant;
import java.time.OffsetDateTime;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import com.isasigns.backend.config.AuthProperties;

@Service
public class AuthCookieService {
    private final AuthProperties properties;

    public AuthCookieService(AuthProperties properties) {
        this.properties = properties;
    }

    public void write(HttpServletResponse response, IssuedAuthSession session) {
        response.addHeader(HttpHeaders.SET_COOKIE, cookie(
                properties.getAccessCookieName(), session.accessToken(), "/",
                remaining(session.accessExpiresAt())).toString());
        response.addHeader(HttpHeaders.SET_COOKIE, cookie(
                properties.getRefreshCookieName(), session.refreshToken(), "/api/auth",
                remaining(session.refreshExpiresAt().toInstant())).toString());
    }

    public void clear(HttpServletResponse response) {
        response.addHeader(HttpHeaders.SET_COOKIE,
                cookie(properties.getAccessCookieName(), "", "/", Duration.ZERO).toString());
        response.addHeader(HttpHeaders.SET_COOKIE,
                cookie(properties.getRefreshCookieName(), "", "/api/auth", Duration.ZERO).toString());
    }

    private ResponseCookie cookie(String name, String value, String path, Duration maxAge) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(properties.isSecureCookies())
                .sameSite("Lax")
                .path(path)
                .maxAge(maxAge)
                .build();
    }

    private Duration remaining(Instant expiry) {
        Duration duration = Duration.between(Instant.now(), expiry);
        return duration.isNegative() ? Duration.ZERO : duration;
    }
}
