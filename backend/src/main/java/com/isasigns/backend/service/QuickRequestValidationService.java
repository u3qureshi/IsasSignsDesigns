package com.isasigns.backend.service;

import java.util.ArrayList;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.isasigns.backend.dto.quickrequest.QuickRequestPayload;
import com.isasigns.backend.exception.RequestValidationException;

@Service
public class QuickRequestValidationService {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Set<String> SERVICE_TYPES = Set.of("printing", "embroidery");
    private static final int MAX_PRODUCTS = 5;

    public void validate(QuickRequestPayload payload) {
        var errors = new ArrayList<String>();
        if (payload == null) {
            throw new RequestValidationException(java.util.List.of("Request details are required."));
        }

        if (!SERVICE_TYPES.contains(payload.service())) {
            errors.add("Printing or embroidery must be selected.");
        }
        if (payload.products() == null || payload.products().isEmpty()) {
            errors.add("At least one product is required.");
        } else if (payload.products().size() > MAX_PRODUCTS) {
            errors.add("A quick request can contain no more than five products.");
        } else {
            for (int index = 0; index < payload.products().size(); index += 1) {
                var product = payload.products().get(index);
                String label = "Product " + (index + 1);
                if (product == null || isBlank(product.itemType())) {
                    errors.add(label + " requires an item type.");
                    continue;
                }
                if (product.itemType().trim().length() > 100) {
                    errors.add(label + " item type must be 100 characters or fewer.");
                }
                if ("Other".equals(product.itemType()) && isBlank(product.customItem())) {
                    errors.add(label + " requires a custom item description.");
                }
                if (!isBlank(product.customItem()) && product.customItem().trim().length() > 200) {
                    errors.add(label + " custom item description must be 200 characters or fewer.");
                }
                if (product.quantity() == null || product.quantity() < 1 || product.quantity() > 10_000) {
                    errors.add(label + " quantity must be between 1 and 10,000.");
                }
            }
        }

        validateRequiredText(errors, payload.firstName(), "First name", 100);
        validateRequiredText(errors, payload.lastName(), "Last name", 100);
        if (isBlank(payload.email()) || !EMAIL_PATTERN.matcher(payload.email().trim()).matches()) {
            errors.add("A valid email address is required.");
        } else if (payload.email().trim().length() > 255) {
            errors.add("Email address must be 255 characters or fewer.");
        }
        String phone = CustomEmbroideryValidationService.digits(payload.phone());
        if (phone.length() < 10 || phone.length() > 15) {
            errors.add("Phone number must contain 10 to 15 digits.");
        }
        if (!isBlank(payload.company()) && payload.company().trim().length() > 200) {
            errors.add("Company name must be 200 characters or fewer.");
        }
        if (!isBlank(payload.notes()) && payload.notes().trim().length() > 5_000) {
            errors.add("Notes must be 5,000 characters or fewer.");
        }

        if (!errors.isEmpty()) {
            throw new RequestValidationException(errors);
        }
    }

    private void validateRequiredText(
            ArrayList<String> errors,
            String value,
            String fieldName,
            int maxLength) {
        if (isBlank(value)) {
            errors.add(fieldName + " is required.");
        } else if (value.trim().length() > maxLength) {
            errors.add(fieldName + " must be " + maxLength + " characters or fewer.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
