package com.isasigns.backend.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.isasigns.backend.dto.contact.ContactMessageRequest;
import com.isasigns.backend.exception.ExternalServiceException;

@Service
public class ContactMessageService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ContactMessageService.class);
    private static final String DEFAULT_SUBJECT = "New website contact request";

    private final EmailDeliveryClient emailClient;
    private final boolean emailEnabled;
    private final String fromAddress;
    private final String adminEmail;

    public ContactMessageService(
            EmailDeliveryClient emailClient,
            @Value("${app.notifications.email.enabled:false}") boolean emailEnabled,
            @Value("${app.notifications.email.from-address:}") String fromAddress,
            @Value("${app.notifications.admin-email:}") String adminEmail) {
        this.emailClient = emailClient;
        this.emailEnabled = emailEnabled;
        this.fromAddress = fromAddress;
        this.adminEmail = adminEmail;
    }

    public void send(ContactMessageRequest request) {
        ensureConfigured();

        String name = request.name().trim();
        String email = request.email().trim();
        String subject = StringUtils.hasText(request.subject())
                ? request.subject().trim()
                : DEFAULT_SUBJECT;
        String message = request.message().trim();

        String adminBody = "A new message was submitted through the Thread & Butter website.\n\n"
                + "Name: " + name + "\n"
                + "Email: " + email + "\n"
                + "Subject: " + subject + "\n\n"
                + "Message\n"
                + message;

        try {
            emailClient.send(adminEmail, "Website contact: " + subject, adminBody, List.of());
        } catch (EmailDeliveryException exception) {
            throw new ExternalServiceException(
                    "We could not send your message. Please try again.", exception);
        }

        String customerBody = "Hi " + firstName(name) + ",\n\n"
                + "Thanks for contacting Thread & Butter. We received your message and will get back to you as soon as possible.\n\n"
                + "Subject: " + subject + "\n\n"
                + "Thread & Butter";
        try {
            emailClient.send(email, "We received your Thread & Butter message", customerBody, List.of());
        } catch (RuntimeException exception) {
            LOGGER.error("Contact message reached the business, but its confirmation could not be sent to {}.",
                    email, exception);
        }
    }

    private void ensureConfigured() {
        if (!emailEnabled || !StringUtils.hasText(fromAddress) || !StringUtils.hasText(adminEmail)) {
            throw new IllegalStateException("Contact email is not fully configured.");
        }
    }

    private String firstName(String name) {
        int separator = name.indexOf(' ');
        return separator > 0 ? name.substring(0, separator) : name;
    }
}
