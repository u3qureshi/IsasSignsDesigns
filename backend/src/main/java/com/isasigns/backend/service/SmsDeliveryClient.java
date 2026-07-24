package com.isasigns.backend.service;

public interface SmsDeliveryClient {
    String send(String recipient, String body);
}
