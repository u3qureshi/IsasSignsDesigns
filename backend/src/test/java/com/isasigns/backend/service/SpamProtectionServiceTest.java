package com.isasigns.backend.service;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

import com.isasigns.backend.exception.RequestValidationException;

class SpamProtectionServiceTest {
    private final SpamProtectionService service = new SpamProtectionService();

    @Test
    void acceptsAnEmptyHoneypot() {
        assertThatCode(() -> service.rejectFilledHoneypot(" ")).doesNotThrowAnyException();
    }

    @Test
    void rejectsAFilledHoneypot() {
        assertThatThrownBy(() -> service.rejectFilledHoneypot("https://spam.example"))
                .isInstanceOf(RequestValidationException.class);
    }
}
