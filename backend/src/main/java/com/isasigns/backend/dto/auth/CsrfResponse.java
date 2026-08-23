package com.isasigns.backend.dto.auth;

public record CsrfResponse(String headerName, String token) {}
