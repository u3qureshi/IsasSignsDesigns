package com.isasigns.backend.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

import com.isasigns.backend.dto.customembroidery.CustomEmbroideryPayload;

class EmbroideryPromptServiceTest {
    private final EmbroideryPromptService service = new EmbroideryPromptService();

    @Test
    void includesExactWordsItemPlacementDimensionsAndInspirationInstruction() {
        CustomEmbroideryPayload payload = new CustomEmbroideryPayload(
                "Taylor Customer", "email", "taylor@example.com", "",
                "A bold fishing design", "BEST DAD", "inspiration", "inspiration",
                "customer", "Other", "work apron", "navy", "Other", "upper bib",
                "known", new BigDecimal("5.5"), new BigDecimal("3.25"), 3, true, true, false);

        String prompt = service.build(payload);

        assertThat(prompt)
                .contains("Customer idea: A bold fishing design")
                .contains("Exact requested wording: BEST DAD")
                .contains("Item: work apron")
                .contains("Placement: upper bib")
                .contains("5.5 inches wide by 3.25 inches high")
                .contains("Use input image 0 as visual inspiration for a new concept")
                .contains("Show the entire item with comfortable space around it")
                .contains("photorealistic thread-count simulation")
                .contains("do not add any other words");
    }

    @Test
    void tellsModelToPreserveExactCustomerArtworkOnTheGarment() {
        CustomEmbroideryPayload payload = new CustomEmbroideryPayload(
                "Taylor Customer", "email", "taylor@example.com", "",
                "Place my supplied logo on the hoodie", "", "inspiration", "exact",
                "customer", "Hoodie", "", "black", "Right chest", "",
                "recommend", null, null, 1, true, true, false);

        String prompt = service.build(payload);

        assertThat(prompt)
                .contains("Input image 0 is exact customer-supplied artwork")
                .contains("do not redesign, reinterpret, simplify, restyle")
                .contains("Place that same artwork")
                .contains("selected item at the requested location")
                .contains("Placement: Right chest")
                .contains("Keep the full item visible");
    }
}
