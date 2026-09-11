package com.isasigns.backend.dto.quickrequest;

import java.util.List;

public record QuickRequestPayload(
        String service,
        List<QuickRequestProductPayload> products,
        String notes,
        String firstName,
        String lastName,
        String email,
        String phone,
        String company,
        String website) {
    public QuickRequestPayload(
            String service,
            List<QuickRequestProductPayload> products,
            String notes,
            String firstName,
            String lastName,
            String email,
            String phone,
            String company) {
        this(service, products, notes, firstName, lastName, email, phone, company, "");
    }
}
