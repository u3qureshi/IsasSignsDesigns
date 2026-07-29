package com.isasigns.backend.service;

import java.util.List;

public interface EmailDeliveryClient {
    void send(
            String recipient,
            String subject,
            String body,
            List<EmailAttachment> attachments);
}
