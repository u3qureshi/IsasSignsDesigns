package com.isasigns.backend.controller;

import java.util.UUID;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.isasigns.backend.config.AuthProperties;
import com.isasigns.backend.config.JwtCookieAuthenticationFilter;
import com.isasigns.backend.dto.auth.AuthChallengeResponse;
import com.isasigns.backend.dto.auth.AuthUserResponse;
import com.isasigns.backend.dto.auth.CsrfResponse;
import com.isasigns.backend.dto.auth.LoginRequest;
import com.isasigns.backend.dto.auth.SignupRequest;
import com.isasigns.backend.dto.auth.UpdateProfileRequest;
import com.isasigns.backend.dto.auth.VerifyCodeRequest;
import com.isasigns.backend.service.AuthCookieService;
import com.isasigns.backend.service.AuthService;
import com.isasigns.backend.service.AuthSessionService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final AuthSessionService sessionService;
    private final AuthCookieService cookieService;
    private final AuthProperties properties;

    public AuthController(AuthService authService, AuthSessionService sessionService,
            AuthCookieService cookieService, AuthProperties properties) {
        this.authService = authService;
        this.sessionService = sessionService;
        this.cookieService = cookieService;
        this.properties = properties;
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public AuthChallengeResponse signup(@Valid @RequestBody SignupRequest request,
            HttpServletRequest servletRequest) {
        return authService.startSignup(request, servletRequest.getRemoteAddr());
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public AuthChallengeResponse login(@Valid @RequestBody LoginRequest request,
            HttpServletRequest servletRequest) {
        return authService.startLogin(request, servletRequest.getRemoteAddr());
    }

    @PostMapping("/verify")
    public AuthUserResponse verify(@Valid @RequestBody VerifyCodeRequest request,
            HttpServletRequest servletRequest, HttpServletResponse servletResponse) {
        var session = authService.verify(request, servletRequest.getHeader("User-Agent"));
        cookieService.write(servletResponse, session);
        return AuthUserResponse.from(session.user());
    }

    @PostMapping("/refresh")
    public AuthUserResponse refresh(HttpServletRequest servletRequest,
            HttpServletResponse servletResponse) {
        String refreshToken = JwtCookieAuthenticationFilter.cookie(
                servletRequest, properties.getRefreshCookieName());
        var session = sessionService.refresh(refreshToken, servletRequest.getHeader("User-Agent"));
        cookieService.write(servletResponse, session);
        return AuthUserResponse.from(session.user());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletRequest servletRequest, HttpServletResponse servletResponse) {
        sessionService.logout(JwtCookieAuthenticationFilter.cookie(
                servletRequest, properties.getRefreshCookieName()));
        cookieService.clear(servletResponse);
    }

    @GetMapping("/csrf")
    public CsrfResponse csrf(CsrfToken csrfToken) {
        return new CsrfResponse(csrfToken.getHeaderName(), csrfToken.getToken());
    }

    @GetMapping("/me")
    public AuthUserResponse me(Authentication authentication) {
        return authService.getUser(userId(authentication));
    }

    @PatchMapping("/me")
    public AuthUserResponse updateMe(@Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication) {
        return authService.updateProfile(userId(authentication), request);
    }

    private UUID userId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
