package com.isasigns.backend.service;

public record EmailAttachment(
        String filename,
        String contentType,
        byte[] content) {
}
