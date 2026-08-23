package com.isasigns.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.isasigns.backend.config.AuthProperties;
import com.isasigns.backend.exception.ExternalServiceException;
import com.isasigns.backend.model.AuthChallengePurpose;

@Service
public class AuthEmailService {
    private final EmailDeliveryClient emailDeliveryClient;
    private final AuthProperties properties;

    public AuthEmailService(EmailDeliveryClient emailDeliveryClient, AuthProperties properties) {
        this.emailDeliveryClient = emailDeliveryClient;
        this.properties = properties;
    }

    public void sendCode(String recipient, String code, AuthChallengePurpose purpose) {
        ensureEnabled();

        String action = purpose == AuthChallengePurpose.SIGNUP
                ? "finish creating your account"
                : "sign in to your account";
        String subject = code + " is your Thread & Butter verification code";
        String body = "Hello,\n\n"
                + "Use this verification code to " + action + ":\n\n"
                + code + "\n\n"
                + "This code expires in " + properties.getOtpMinutes() + " minutes and can be used once. "
                + "If you did not request it, you can safely ignore this message.\n\n"
                + "Thread & Butter";
        try {
            emailDeliveryClient.send(recipient, subject, body, List.of());
        } catch (EmailDeliveryException exception) {
            throw new ExternalServiceException("We could not send the verification email. Please try again.", exception);
        }
    }

    public void ensureEnabled() {
        if (!properties.isEmailEnabled()) {
            throw new IllegalStateException("Authentication email is disabled.");
        }
    }
}
