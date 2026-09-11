package com.isasigns.backend.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class PublicSubmissionRateLimitFilterTest {
    private final PublicSubmissionRateLimitFilter filter = new PublicSubmissionRateLimitFilter(
            2, 900, 1, 3600, 1, 3600,
            Clock.fixed(Instant.parse("2026-08-28T12:00:00Z"), ZoneOffset.UTC));

    @Test
    void rejectsRequestsBeyondTheEndpointLimitAndReturnsRetryAfter() throws Exception {
        assertThat(invoke("POST", "/api/contact-messages", "203.0.113.10").getStatus()).isEqualTo(200);
        assertThat(invoke("POST", "/api/contact-messages", "203.0.113.10").getStatus()).isEqualTo(200);

        MockHttpServletResponse rejected = invoke("POST", "/api/contact-messages", "203.0.113.10");

        assertThat(rejected.getStatus()).isEqualTo(429);
        assertThat(rejected.getHeader("Retry-After")).isEqualTo("900");
        assertThat(rejected.getContentAsString()).contains("Too many requests");
    }

    @Test
    void keepsClientsAndEndpointGroupsIndependent() throws Exception {
        assertThat(invoke("POST", "/api/quick-requests", "203.0.113.20").getStatus()).isEqualTo(200);
        assertThat(invoke("POST", "/api/quick-requests", "203.0.113.20").getStatus()).isEqualTo(429);
        assertThat(invoke("POST", "/api/quick-requests", "203.0.113.21").getStatus()).isEqualTo(200);
        assertThat(invoke("POST", "/api/custom-embroidery/previews", "203.0.113.20").getStatus()).isEqualTo(200);
        assertThat(invoke("GET", "/api/quick-requests", "203.0.113.20").getStatus()).isEqualTo(200);
    }

    private MockHttpServletResponse invoke(String method, String path, String address) throws Exception {
        var request = new MockHttpServletRequest(method, path);
        request.setRemoteAddr(address);
        var response = new MockHttpServletResponse();
        filter.doFilter(request, response, new MockFilterChain());
        return response;
    }
}
