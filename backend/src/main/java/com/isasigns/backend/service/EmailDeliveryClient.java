package com.isasigns.backend.service;

public interface EmailDeliveryClient {
    void send(String recipient, String subject, String body);
}
