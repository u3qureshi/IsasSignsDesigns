package com.isasigns.backend.service;

public record CustomEmbroideryNotificationMessages(
        String customerEmailSubject,
        String customerEmailBody,
        String customerSmsBody,
        String adminEmailSubject,
        String adminEmailBody,
        String adminSmsBody) {
}
