package com.isasigns.backend.exception;

public class AiProviderLimitException extends RuntimeException {
    private final long retryAfterSeconds;

    public AiProviderLimitException(String message, long retryAfterSeconds) {
        super(message);
        this.retryAfterSeconds = retryAfterSeconds;
    }

    public long getRetryAfterSeconds() {
        return retryAfterSeconds;
    }
}
