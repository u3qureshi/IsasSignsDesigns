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
                null, null, null, null, null, null, null, null, null, null,
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
    void rejectsPlacementThatDoesNotBelongToSelectedItem() {
        CustomEmbroideryPayload payload = new CustomEmbroideryPayload(
                "Taylor Customer", "email", "taylor@example.com", "", "Small flower", "",
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
                payload.ideaDescription(), payload.exactText(), payload.aiMode(), payload.imageIntent(),
                payload.itemProvider(), payload.itemType(), payload.otherItem(), payload.garmentColor(),
                payload.placement(), payload.otherPlacement(), payload.sizeMode(), payload.width(),
                payload.height(), payload.quantity(), payload.estimateAccepted(),
                payload.contentRightsConfirmed(), true);

        CustomEmbroideryPayload failedPayload = payload;
        assertThatCode(() -> service.validateForSubmit(failedPayload, null, null, null))
                .doesNotThrowAnyException();
    }

    private CustomEmbroideryPayload validPayload(String aiMode) {
        return new CustomEmbroideryPayload(
                "Taylor Customer",
                "email",
                "taylor@example.com",
                "",
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
