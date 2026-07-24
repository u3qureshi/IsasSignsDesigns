package com.isasigns.backend.controller;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.isasigns.backend.dto.ApiErrorResponse;
import com.isasigns.backend.exception.AiProviderLimitException;
import com.isasigns.backend.exception.ExternalServiceException;
import com.isasigns.backend.exception.RequestValidationException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(RequestValidationException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(RequestValidationException exception) {
        return response(HttpStatus.BAD_REQUEST, exception.getMessage(), exception.getDetails());
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiErrorResponse> handleMaxUpload(MaxUploadSizeExceededException exception) {
        return response(HttpStatus.PAYLOAD_TOO_LARGE, "Uploaded files are too large",
                List.of("Each image must be 10 MB or smaller."));
    }

    @ExceptionHandler(ExternalServiceException.class)
    public ResponseEntity<ApiErrorResponse> handleExternalService(ExternalServiceException exception) {
        return response(HttpStatus.BAD_GATEWAY, exception.getMessage(), List.of());
    }

    @ExceptionHandler(AiProviderLimitException.class)
    public ResponseEntity<ApiErrorResponse> handleAiProviderLimit(AiProviderLimitException exception) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .header(HttpHeaders.RETRY_AFTER, Long.toString(exception.getRetryAfterSeconds()))
                .body(new ApiErrorResponse(
                        HttpStatus.TOO_MANY_REQUESTS.value(),
                        exception.getMessage(),
                        List.of(),
                        OffsetDateTime.now()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiErrorResponse> handleConfiguration(IllegalStateException exception) {
        return response(HttpStatus.SERVICE_UNAVAILABLE,
                "The custom embroidery service is not fully configured.", List.of());
    }

    private ResponseEntity<ApiErrorResponse> response(HttpStatus status, String message, List<String> details) {
        return ResponseEntity.status(status).body(
                new ApiErrorResponse(status.value(), message, details, OffsetDateTime.now()));
    }
}
