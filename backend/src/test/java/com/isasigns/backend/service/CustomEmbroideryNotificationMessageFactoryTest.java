package com.isasigns.backend.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;

import com.isasigns.backend.model.CustomEmbroideryRequest;
import com.isasigns.backend.model.CustomEmbroideryRequestImage;

class CustomEmbroideryNotificationMessageFactoryTest {
    private final CustomEmbroideryNotificationMessageFactory factory =
            new CustomEmbroideryNotificationMessageFactory();

    @Test
    void includesEveryCustomerRequestFieldAndImageMetadataInAdminEmail() {
        CustomEmbroideryRequest request = new CustomEmbroideryRequest(
                "TNB-EMB-2026-TEST1234",
                "Taylor Customer",
                "email",
                "taylor@example.com",
                "4165551234",
                "contact-hmac",
                "A clean wildflower outline",
                "GROW",
                "inspiration",
                true,
                "exact",
                false,
                "customer",
                "Other",
                "work apron",
                "navy",
                "Other",
                "upper bib",
                "known",
                new BigDecimal("5.5"),
                new BigDecimal("3.25"),
                3,
                true,
                true,
                "Cloudflare Workers AI",
                "@cf/example/model",
                "Generated prompt text");
        CustomEmbroideryRequestImage image = new CustomEmbroideryRequestImage(
                UUID.randomUUID(),
                "UPLOADED_REFERENCE",
                "logo.png",
                "asset-id",
                "thread-and-butter/request/logo",
                1L,
                "image",
                "authenticated",
                "png",
                800,
                600,
                12345L,
                "exact",
                0);

        CustomEmbroideryNotificationMessages messages = factory.create(request, List.of(image));

        assertThat(messages.adminEmailBody())
                .contains("Taylor Customer")
                .contains("taylor@example.com")
                .contains("4165551234")
                .contains("A clean wildflower outline")
                .contains("GROW")
                .contains("inspiration")
                .contains("exact")
                .contains("work apron")
                .contains("upper bib")
                .contains("5.5 in")
                .contains("3.25 in")
                .contains("Cloudflare Workers AI")
                .contains("@cf/example/model")
                .contains("Generated prompt text")
                .contains("logo.png")
                .contains("800 × 600")
                .contains("thread-and-butter/request/logo");
        assertThat(messages.customerEmailBody())
                .contains("TNB-EMB-2026-TEST1234")
                .contains("A clean wildflower outline")
                .contains("work apron")
                .contains("upper bib");
        assertThat(messages.adminSmsBody()).contains("Taylor Customer", "3 × work apron");
    }

    @Test
    void normalizesCanadianPhoneNumbersForTwilio() {
        assertThat(CustomEmbroideryNotificationService.normalizePhone("(416) 555-1234"))
                .isEqualTo("+14165551234");
        assertThat(CustomEmbroideryNotificationService.normalizePhone("+1 647 555 6789"))
                .isEqualTo("+16475556789");
    }
}
