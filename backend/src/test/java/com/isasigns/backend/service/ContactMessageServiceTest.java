package com.isasigns.backend.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.isasigns.backend.dto.contact.ContactMessageRequest;

@ExtendWith(MockitoExtension.class)
class ContactMessageServiceTest {
    @Mock EmailDeliveryClient emailClient;

    @Test
    void sendsTheMessageToTheBusinessAndConfirmationToTheCustomer() {
        var service = new ContactMessageService(
                emailClient, true, "sender@example.com", "business@example.com");
        var request = new ContactMessageRequest(
                "Avery Stone", "avery@example.com", "Partnership", "Can we work together?");

        service.send(request);

        verify(emailClient).send(
                eq("business@example.com"),
                eq("Website contact: Partnership"),
                eq("A new message was submitted through the Thread & Butter website.\n\n"
                        + "Name: Avery Stone\n"
                        + "Email: avery@example.com\n"
                        + "Subject: Partnership\n\n"
                        + "Message\n"
                        + "Can we work together?"),
                eq(List.of()));
        verify(emailClient).send(
                eq("avery@example.com"),
                eq("We received your Thread & Butter message"),
                eq("Hi Avery,\n\n"
                        + "Thanks for contacting Thread & Butter. We received your message and will get back to you as soon as possible.\n\n"
                        + "Subject: Partnership\n\n"
                        + "Thread & Butter"),
                eq(List.of()));
    }

    @Test
    void suppliesTheDefaultSubjectAndRequiresEmailConfiguration() {
        var configured = new ContactMessageService(
                emailClient, true, "sender@example.com", "business@example.com");
        configured.send(new ContactMessageRequest(
                "Avery", "avery@example.com", "  ", "Hello"));

        verify(emailClient).send(
                eq("business@example.com"),
                eq("Website contact: New website contact request"),
                eq("A new message was submitted through the Thread & Butter website.\n\n"
                        + "Name: Avery\n"
                        + "Email: avery@example.com\n"
                        + "Subject: New website contact request\n\n"
                        + "Message\n"
                        + "Hello"),
                eq(List.of()));

        var disabled = new ContactMessageService(
                emailClient, false, "sender@example.com", "business@example.com");
        assertThatThrownBy(() -> disabled.send(new ContactMessageRequest(
                "Avery", "avery@example.com", null, "Hello")))
                .isInstanceOf(IllegalStateException.class);
    }
}
