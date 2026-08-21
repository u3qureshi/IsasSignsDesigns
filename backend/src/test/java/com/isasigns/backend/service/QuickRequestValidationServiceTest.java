package com.isasigns.backend.service;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.isasigns.backend.dto.quickrequest.QuickRequestPayload;
import com.isasigns.backend.dto.quickrequest.QuickRequestProductPayload;
import com.isasigns.backend.exception.RequestValidationException;

class QuickRequestValidationServiceTest {
    private final QuickRequestValidationService service = new QuickRequestValidationService();

    @Test
    void acceptsACompleteQuickRequestWithMultipleProducts() {
        var payload = new QuickRequestPayload(
                "embroidery",
                List.of(
                        new QuickRequestProductPayload("Hat", "", 12),
                        new QuickRequestProductPayload("Other", "Apron", 6)),
                "Use forest green thread.",
                "Taylor",
                "Customer",
                "taylor@example.com",
                "(416) 555-1234",
                "Taylor Events");

        assertThatCode(() -> service.validate(payload)).doesNotThrowAnyException();
    }

    @Test
    void rejectsMissingContactAndInvalidProductDetails() {
        var payload = new QuickRequestPayload(
                "invalid",
                List.of(new QuickRequestProductPayload("Other", "", 0)),
                "",
                "",
                "",
                "not-an-email",
                "123",
                "");

        assertThatThrownBy(() -> service.validate(payload))
                .isInstanceOf(RequestValidationException.class)
                .extracting(exception -> ((RequestValidationException) exception).getDetails())
                .asString()
                .contains(
                        "Printing or embroidery",
                        "custom item description",
                        "quantity",
                        "First name",
                        "Last name",
                        "valid email",
                        "Phone number");
    }
}
