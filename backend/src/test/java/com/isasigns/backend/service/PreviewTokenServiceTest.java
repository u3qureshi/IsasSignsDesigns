package com.isasigns.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

import com.isasigns.backend.exception.RequestValidationException;

class PreviewTokenServiceTest {
    private final PreviewTokenService service =
            new PreviewTokenService("a-local-test-secret-that-is-longer-than-thirty-two-characters");

    @Test
    void verifiesTheImageUsedToIssueToken() {
        byte[] image = "generated-image".getBytes();
        var issued = service.issue(image, "@cf/test/model");

        assertThat(issued.token()).contains(".");
        assertThatCode(() -> service.verify(issued.token(), image)).doesNotThrowAnyException();
    }

    @Test
    void rejectsDifferentGeneratedImage() {
        var issued = service.issue("original".getBytes(), "@cf/test/model");

        assertThatThrownBy(() -> service.verify(issued.token(), "changed".getBytes()))
                .isInstanceOf(RequestValidationException.class)
                .extracting(exception -> ((RequestValidationException) exception).getDetails())
                .asString()
                .contains("invalid or expired");
    }

    @Test
    void createsStableContactHmacWithoutReturningContact() {
        String first = service.hmacContact("person@example.com");
        String second = service.hmacContact("person@example.com");

        assertThat(first).isEqualTo(second).hasSize(64);
        assertThat(first).doesNotContain("person");
    }
}
