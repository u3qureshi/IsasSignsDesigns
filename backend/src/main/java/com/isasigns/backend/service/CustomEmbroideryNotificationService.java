package com.isasigns.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.util.StringUtils;

import com.isasigns.backend.model.CustomEmbroideryNotification;
import com.isasigns.backend.repository.CustomEmbroideryNotificationRepository;
import com.isasigns.backend.repository.CustomEmbroideryRequestImageRepository;
import com.isasigns.backend.repository.CustomEmbroideryRequestRepository;

@Service
public class CustomEmbroideryNotificationService {
    private static final Logger LOGGER = LoggerFactory.getLogger(CustomEmbroideryNotificationService.class);
    private final CustomEmbroideryRequestRepository requestRepository;
    private final CustomEmbroideryRequestImageRepository imageRepository;
    private final CustomEmbroideryNotificationRepository notificationRepository;
    private final CustomEmbroideryNotificationMessageFactory messageFactory;
    private final EmailDeliveryClient emailClient;
    private final SmsDeliveryClient smsClient;
    private final boolean emailEnabled;
    private final boolean smsEnabled;
    private final String emailFromAddress;
    private final String adminEmail;
    private final String smsFromNumber;
    private final String adminPhone;
    private final String twilioAccountSid;
    private final String twilioAuthToken;

    public CustomEmbroideryNotificationService(
            CustomEmbroideryRequestRepository requestRepository,
            CustomEmbroideryRequestImageRepository imageRepository,
            CustomEmbroideryNotificationRepository notificationRepository,
            CustomEmbroideryNotificationMessageFactory messageFactory,
            EmailDeliveryClient emailClient,
            SmsDeliveryClient smsClient,
            @Value("${app.notifications.email.enabled:false}") boolean emailEnabled,
            @Value("${app.notifications.sms.enabled:false}") boolean smsEnabled,
            @Value("${app.notifications.email.from-address:}") String emailFromAddress,
            @Value("${app.notifications.admin-email:}") String adminEmail,
            @Value("${app.notifications.sms.from-number:}") String smsFromNumber,
            @Value("${app.notifications.admin-phone:}") String adminPhone,
            @Value("${app.notifications.sms.twilio-account-sid:}") String twilioAccountSid,
            @Value("${app.notifications.sms.twilio-auth-token:}") String twilioAuthToken) {
        this.requestRepository = requestRepository;
        this.imageRepository = imageRepository;
        this.notificationRepository = notificationRepository;
        this.messageFactory = messageFactory;
        this.emailClient = emailClient;
        this.smsClient = smsClient;
        this.emailEnabled = emailEnabled;
        this.smsEnabled = smsEnabled;
        this.emailFromAddress = emailFromAddress;
        this.adminEmail = adminEmail;
        this.smsFromNumber = smsFromNumber;
        this.adminPhone = adminPhone;
        this.twilioAccountSid = twilioAccountSid;
        this.twilioAuthToken = twilioAuthToken;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onSubmitted(CustomEmbroiderySubmittedEvent event) {
        try {
            var request = requestRepository.findById(event.requestId()).orElse(null);
            if (request == null) {
                LOGGER.error("Cannot send embroidery notifications: request {} was not found.", event.requestId());
                return;
            }
            var images = imageRepository.findAllByRequestIdOrderByDisplayOrderAsc(event.requestId());
            var messages = messageFactory.create(request, images);

            if ("email".equals(request.getPreferredContactMethod())) {
                sendEmail(
                        request.getId(),
                        "CUSTOMER",
                        request.getCustomerEmail(),
                        messages.customerEmailSubject(),
                        messages.customerEmailBody());
            } else {
                sendSms(
                        request.getId(),
                        "CUSTOMER",
                        request.getCustomerPhone(),
                        messages.customerSmsBody());
            }

            sendEmail(
                    request.getId(),
                    "ADMIN",
                    adminEmail,
                    messages.adminEmailSubject(),
                    messages.adminEmailBody());
            sendSms(
                    request.getId(),
                    "ADMIN",
                    adminPhone,
                    messages.adminSmsBody());
        } catch (RuntimeException exception) {
            LOGGER.error("Unexpected embroidery notification failure for request {}.", event.requestId(), exception);
        }
    }

    private void sendEmail(
            java.util.UUID requestId,
            String audience,
            String recipient,
            String subject,
            String body) {
        var notification = notificationRepository.save(new CustomEmbroideryNotification(
                requestId, audience, "EMAIL", blankToNull(recipient), subject, body, "SMTP"));

        String configurationError = emailConfigurationError(recipient);
        if (configurationError != null) {
            notification.markSkipped(configurationError);
            notificationRepository.save(notification);
            return;
        }

        try {
            emailClient.send(recipient, subject, body);
            notification.markSent(null);
        } catch (RuntimeException exception) {
            notification.markFailed(safeMessage(exception));
        }
        notificationRepository.save(notification);
    }

    private void sendSms(
            java.util.UUID requestId,
            String audience,
            String recipient,
            String body) {
        String normalizedRecipient = normalizePhone(recipient);
        var notification = notificationRepository.save(new CustomEmbroideryNotification(
                requestId, audience, "SMS", normalizedRecipient, null, body, "Twilio"));

        String configurationError = smsConfigurationError(recipient);
        if (configurationError != null) {
            notification.markSkipped(configurationError);
            notificationRepository.save(notification);
            return;
        }

        try {
            String providerMessageId = smsClient.send(normalizedRecipient, body);
            notification.markSent(providerMessageId);
        } catch (RuntimeException exception) {
            notification.markFailed(safeMessage(exception));
        }
        notificationRepository.save(notification);
    }

    private String emailConfigurationError(String recipient) {
        if (!emailEnabled) return "Email notifications are disabled.";
        if (!StringUtils.hasText(recipient)) return "Email recipient is missing.";
        if (!StringUtils.hasText(emailFromAddress)) return "Email sender address is missing.";
        return null;
    }

    private String smsConfigurationError(String recipient) {
        if (!smsEnabled) return "SMS notifications are disabled.";
        if (!StringUtils.hasText(recipient)) return "SMS recipient is missing.";
        if (!StringUtils.hasText(smsFromNumber)) return "Twilio sender phone number is missing.";
        if (!StringUtils.hasText(twilioAccountSid)) return "Twilio Account SID is missing.";
        if (!StringUtils.hasText(twilioAuthToken)) return "Twilio Auth Token is missing.";
        return null;
    }

    static String normalizePhone(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        String digits = CustomEmbroideryValidationService.digits(value);
        if (digits.length() == 10) {
            return "+1" + digits;
        }
        return "+" + digits;
    }

    private String safeMessage(RuntimeException exception) {
        String message = exception.getMessage();
        return StringUtils.hasText(message)
                ? message
                : exception.getClass().getSimpleName();
    }

    private String blankToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
