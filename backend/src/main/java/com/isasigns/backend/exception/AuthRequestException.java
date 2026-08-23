package com.isasigns.backend.exception;

import org.springframework.http.HttpStatus;

public class AuthRequestException extends RuntimeException {
    private final HttpStatus status;
    private final Long retryAfterSeconds;

    public AuthRequestException(HttpStatus status, String message) {
        this(status, message, null);
    }

    public AuthRequestException(HttpStatus status, String message, Long retryAfterSeconds) {
        super(message);
        this.status = status;
        this.retryAfterSeconds = retryAfterSeconds;
    }

    public HttpStatus getStatus() { return status; }
    public Long getRetryAfterSeconds() { return retryAfterSeconds; }
}
