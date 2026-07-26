package com.isasigns.backend.service;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import com.isasigns.backend.dto.customembroidery.CustomEmbroideryPayload;
import com.isasigns.backend.exception.RequestValidationException;

class CustomEmbroideryValidationServiceTest {
    private final CustomEmbroideryValidationService service = new CustomEmbroideryValidationService();

    @Test
    void acceptsCompleteGeneratedPreviewRequest() {
        assertThatCode(() -> service.validateForPreview(validPayload("generate"), null))
                .doesNotThrowAnyException();
    }

    @Test
    void reportsMissingFieldsForEmptyPayloadWithoutThrowingNullPointerException() {
        CustomEmbroideryPayload empty = new CustomEmbroideryPayload(
                null, null, null, null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null, null, null, null);

        assertThatThrownBy(() -> service.validateForPreview(empty, null))
                .isInstanceOf(RequestValidationException.class)
                .extracting(exception -> ((RequestValidationException) exception).getDetails())
                .asString()
                .contains("Full name", "artwork mode", "item type", "placement");
    }

    @Test
    void requiresReferenceImageForInspirationPreview() {
        assertThatThrownBy(() -> service.validateForPreview(validPayload("inspiration"), null))
                .isInstanceOf(RequestValidationException.class)
                .extracting(exception -> ((RequestValidationException) exception).getDetails())
                .asString()
                .contains("inspiration image");
    }

    @Test
    void acceptsInspirationPreviewWithoutContentRightsField() {
        MockMultipartFile customer = new MockMultipartFile(
                "customerImage", "reference.png", "image/png", new byte[] { 1 });
        CustomEmbroideryPayload original = validPayload("inspiration");
        CustomEmbroideryPayload withoutContentRights = new CustomEmbroideryPayload(
                original.fullName(), original.preferredContact(), original.email(), original.phone(),
                original.smsConsent(), original.ideaDescription(), original.exactText(), original.aiMode(),
                original.imageIntent(), original.itemProvider(), original.itemType(), original.otherItem(),
                original.garmentColor(), original.placement(), original.otherPlacement(), original.sizeMode(),
                original.width(), original.height(), original.quantity(), original.estimateAccepted(), null,
                original.aiPreviewFailed());

        assertThatCode(() -> service.validateForPreview(withoutContentRights, customer))
                .doesNotThrowAnyException();
    }

    @Test
    void rejectsPlacementThatDoesNotBelongToSelectedItem() {
        CustomEmbroideryPayload payload = new CustomEmbroideryPayload(
                "Taylor Customer", "email", "taylor@example.com", "", false, "Small flower", "",
                "manual-review", "exact", "customer", "Hat", "", "black", "Left chest", "",
                "recommend", null, null, 1, true, true, false);

        assertThatThrownBy(() -> service.validateForSubmit(payload, null, null, null))
                .isInstanceOf(RequestValidationException.class)
                .extracting(exception -> ((RequestValidationException) exception).getDetails())
                .asString()
                .contains("placement");
    }

    @Test
    void acceptsCompleteInspirationSubmissionParts() {
        MockMultipartFile customer = new MockMultipartFile(
                "customerImage", "reference.png", "image/png", new byte[] { 1 });
        MockMultipartFile generated = new MockMultipartFile(
                "generatedImage", "concept.png", "image/png", new byte[] { 2 });

        assertThatCode(() -> service.validateForSubmit(
                validPayload("inspiration"), customer, generated, "signed-token"))
                .doesNotThrowAnyException();
    }

    @Test
    void acceptsAiRequestWithoutGeneratedImageAfterPreviewFailure() {
        CustomEmbroideryPayload payload = validPayload("generate");
        payload = new CustomEmbroideryPayload(
                payload.fullName(), payload.preferredContact(), payload.email(), payload.phone(),
                payload.smsConsent(),
                payload.ideaDescription(), payload.exactText(), payload.aiMode(), payload.imageIntent(),
                payload.itemProvider(), payload.itemType(), payload.otherItem(), payload.garmentColor(),
                payload.placement(), payload.otherPlacement(), payload.sizeMode(), payload.width(),
                payload.height(), payload.quantity(), payload.estimateAccepted(),
                payload.contentRightsConfirmed(), true);

        CustomEmbroideryPayload failedPayload = payload;
        assertThatCode(() -> service.validateForSubmit(failedPayload, null, null, null))
                .doesNotThrowAnyException();
    }

    @Test
    void requiresEmailWhileNotificationsAreEmailOnly() {
        CustomEmbroideryPayload payload = validPayload("manual-review");
        payload = new CustomEmbroideryPayload(
                payload.fullName(), "phone", "", "4165551234", false,
                payload.ideaDescription(), payload.exactText(), payload.aiMode(), payload.imageIntent(),
                payload.itemProvider(), payload.itemType(), payload.otherItem(), payload.garmentColor(),
                payload.placement(), payload.otherPlacement(), payload.sizeMode(), payload.width(),
                payload.height(), payload.quantity(), payload.estimateAccepted(),
                payload.contentRightsConfirmed(), payload.aiPreviewFailed());

        CustomEmbroideryPayload phonePayload = payload;
        assertThatThrownBy(() -> service.validateForSubmit(phonePayload, null, null, null))
                .isInstanceOf(RequestValidationException.class)
                .extracting(exception -> ((RequestValidationException) exception).getDetails())
                .asString()
                .contains("Email is the only supported contact method", "valid email address");
    }

    @Test
    void rejectsSmsConsentWithoutPhoneNumber() {
        CustomEmbroideryPayload payload = validPayload("manual-review");
        payload = new CustomEmbroideryPayload(
                payload.fullName(), payload.preferredContact(), payload.email(), "", true,
                payload.ideaDescription(), payload.exactText(), payload.aiMode(), payload.imageIntent(),
                payload.itemProvider(), payload.itemType(), payload.otherItem(), payload.garmentColor(),
                payload.placement(), payload.otherPlacement(), payload.sizeMode(), payload.width(),
                payload.height(), payload.quantity(), payload.estimateAccepted(),
                payload.contentRightsConfirmed(), payload.aiPreviewFailed());

        CustomEmbroideryPayload consentWithoutPhone = payload;
        assertThatThrownBy(() -> service.validateForSubmit(consentWithoutPhone, null, null, null))
                .isInstanceOf(RequestValidationException.class)
                .extracting(exception -> ((RequestValidationException) exception).getDetails())
                .asString()
                .contains("phone number is required when text-message consent is selected");
    }

    @Test
    void acceptsOptionalPhoneWithSmsConsent() {
        CustomEmbroideryPayload payload = validPayload("manual-review");
        payload = new CustomEmbroideryPayload(
                payload.fullName(), payload.preferredContact(), payload.email(), "4165551234", true,
                payload.ideaDescription(), payload.exactText(), payload.aiMode(), payload.imageIntent(),
                payload.itemProvider(), payload.itemType(), payload.otherItem(), payload.garmentColor(),
                payload.placement(), payload.otherPlacement(), payload.sizeMode(), payload.width(),
                payload.height(), payload.quantity(), payload.estimateAccepted(),
                payload.contentRightsConfirmed(), payload.aiPreviewFailed());

        CustomEmbroideryPayload phoneAndConsent = payload;
        assertThatCode(() -> service.validateForSubmit(phoneAndConsent, null, null, null))
                .doesNotThrowAnyException();
    }

    private CustomEmbroideryPayload validPayload(String aiMode) {
        return new CustomEmbroideryPayload(
                "Taylor Customer",
                "email",
                "taylor@example.com",
                "",
                false,
                "A clean wildflower outline in cream and green",
                "",
                aiMode,
                "inspiration",
                "customer",
                "Hoodie",
                "",
                "black",
                "Left chest",
                "",
                "known",
                new BigDecimal("4.0"),
                new BigDecimal("3.0"),
                2,
                true,
                true,
                false);
    }
}
