package com.isasigns.backend.service;

import org.springframework.stereotype.Service;

import com.isasigns.backend.dto.customembroidery.CustomEmbroideryPayload;

@Service
public class EmbroideryPromptService {

    public String build(CustomEmbroideryPayload payload) {
        StringBuilder prompt = new StringBuilder("""
                Create one clean placement preview for a custom embroidery request.
                Show the selected clothing or item as a simple, polished studio product mockup on a plain neutral
                background. Show the entire item with comfortable space around it; zoom out enough that the customer
                can clearly understand the requested placement. Do not crop tightly around the artwork.
                Keep the rendering clean and moderately simplified. The customer needs a placement concept, not a
                photorealistic thread-count simulation. Do not add visible individual stitches, extreme fabric
                texture, tiny embroidery detail, needles, hoops, watermarks, frames, props, people, hands, scenery,
                or decorative text that was not explicitly requested.
                """);

        append(prompt, "Customer idea", payload.ideaDescription());
        append(prompt, "Exact requested wording", payload.exactText());
        append(prompt, "Item", displayItem(payload));
        append(prompt, "Item colour", payload.garmentColor());
        append(prompt, "Placement", displayPlacement(payload));
        if ("known".equals(payload.sizeMode()) && payload.width() != null && payload.height() != null) {
            append(prompt, "Approximate embroidery size",
                    payload.width().toPlainString() + " inches wide by "
                            + payload.height().toPlainString() + " inches high");
        } else {
            append(prompt, "Size", "Choose proportions suitable for the selected item and placement");
        }
        if ("inspiration".equals(payload.aiMode())) {
            appendReferenceInstructions(prompt, payload.imageIntent());
        }
        if (payload.exactText() != null && !payload.exactText().isBlank()) {
            prompt.append("\nRender the exact requested wording carefully and do not add any other words.");
        }
        prompt.append("""

                Make the placement and scale easy to judge at a glance. Keep the full item visible and ensure the
                artwork appears only at the requested location.
                """);
        return prompt.toString().trim();
    }

    private void appendReferenceInstructions(StringBuilder prompt, String imageIntent) {
        if ("exact".equals(imageIntent)) {
            prompt.append("""

                    Input image 0 is exact customer-supplied artwork, not inspiration. Preserve it as faithfully as
                    possible: do not redesign, reinterpret, simplify, restyle, mirror, rotate, recolour, replace, or
                    alter its logo shapes, proportions, layout, symbols, or wording. Place that same artwork on the
                    selected item at the requested location, like a flat artwork overlay on a product mockup.
                    """);
            return;
        }
        if ("placement".equals(imageIntent)) {
            prompt.append("""

                    Input image 0 is a placement reference. Use it to understand approximate position and scale, while
                    following the written customer idea for the artwork itself.
                    """);
            return;
        }
        prompt.append("""

                Use input image 0 as visual inspiration for a new concept. Follow the written customer idea and make
                the resulting artwork suitable for the selected item and requested placement.
                """);
    }

    private String displayItem(CustomEmbroideryPayload payload) {
        return "Other".equals(payload.itemType()) ? payload.otherItem() : payload.itemType();
    }

    private String displayPlacement(CustomEmbroideryPayload payload) {
        return "Other".equals(payload.placement()) ? payload.otherPlacement() : payload.placement();
    }

    private void append(StringBuilder prompt, String label, String value) {
        if (value != null && !value.isBlank()) {
            prompt.append("\n").append(label).append(": ").append(value.trim());
        }
    }
}
