package com.isasigns.backend.service;

import java.nio.charset.StandardCharsets;
import java.util.List;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class SmtpEmailDeliveryClient implements EmailDeliveryClient {
    private final JavaMailSender mailSender;
    private final String fromAddress;
    private final String replyToAddress;

    public SmtpEmailDeliveryClient(
            JavaMailSender mailSender,
            @Value("${app.notifications.email.from-address:}") String fromAddress,
            @Value("${app.notifications.email.reply-to-address:}") String replyToAddress) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
        this.replyToAddress = replyToAddress;
    }

    @Override
    public void send(
            String recipient,
            String subject,
            String body,
            List<EmailAttachment> attachments) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            var helper = new MimeMessageHelper(
                    message,
                    !attachments.isEmpty(),
                    StandardCharsets.UTF_8.name());
            helper.setFrom(fromAddress, "Thread & Butter");
            helper.setTo(recipient);
            if (replyToAddress != null && !replyToAddress.isBlank()) {
                helper.setReplyTo(replyToAddress);
            }
            helper.setSubject(subject);
            helper.setText(body, false);

            message.setHeader("Auto-Submitted", "auto-generated");
            message.setHeader("X-Auto-Response-Suppress", "All");

            for (EmailAttachment attachment : attachments) {
                helper.addAttachment(
                        attachment.filename(),
                        new ByteArrayResource(attachment.content()),
                        attachment.contentType());
            }
            mailSender.send(message);
        } catch (MessagingException | java.io.UnsupportedEncodingException | MailException exception) {
            throw new EmailDeliveryException("The email could not be sent.", exception);
        }
    }
}
