package com.isasigns.backend.config;

import java.io.IOException;
import java.util.Collection;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.isasigns.backend.service.JwtAccessTokenService;

@Component
public class JwtCookieAuthenticationFilter extends OncePerRequestFilter {
    private final JwtAccessTokenService jwtService;
    private final AuthProperties properties;

    public JwtCookieAuthenticationFilter(JwtAccessTokenService jwtService, AuthProperties properties) {
        this.jwtService = jwtService;
        this.properties = properties;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            String token = cookie(request, properties.getAccessCookieName());
            if (token != null) authenticate(token);
        }
        filterChain.doFilter(request, response);
    }

    private void authenticate(String token) {
        try {
            var jwt = jwtService.decode(token);
            Collection<SimpleGrantedAuthority> authorities = roles(jwt.getClaimAsStringList("roles"));
            var authentication = new UsernamePasswordAuthenticationToken(jwt.getSubject(), null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (JwtException | IllegalArgumentException ignored) {
            // An expired or invalid access cookie is treated as unauthenticated. The SPA can
            // use the independently rotated refresh cookie to obtain a new access token.
        }
    }

    private Collection<SimpleGrantedAuthority> roles(List<String> roles) {
        if (roles == null) return List.of();
        return roles.stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role)).toList();
    }

    public static String cookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie cookie : cookies) {
            if (name.equals(cookie.getName())) return cookie.getValue();
        }
        return null;
    }
}
