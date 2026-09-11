package com.isasigns.backend.config;

import java.io.IOException;
import java.time.Clock;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Basic single-instance abuse protection for expensive or message-producing public endpoints.
 * The application is deployed behind one trusted reverse proxy, so the framework's forwarded
 * header support supplies the original address through getRemoteAddr().
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 50)
public class PublicSubmissionRateLimitFilter extends OncePerRequestFilter {
    private final Cache<String, WindowCounter> counters = Caffeine.newBuilder()
            .maximumSize(20_000)
            .expireAfterAccess(2, TimeUnit.HOURS)
            .build();
    private final Map<EndpointGroup, Limit> limits;
    private final Clock clock;

    @Autowired
    public PublicSubmissionRateLimitFilter(
            @Value("${app.public-submission-limits.contact-limit}") int contactLimit,
            @Value("${app.public-submission-limits.contact-window-seconds}") long contactWindowSeconds,
            @Value("${app.public-submission-limits.request-limit}") int requestLimit,
            @Value("${app.public-submission-limits.request-window-seconds}") long requestWindowSeconds,
            @Value("${app.public-submission-limits.preview-limit}") int previewLimit,
            @Value("${app.public-submission-limits.preview-window-seconds}") long previewWindowSeconds) {
        this(contactLimit, contactWindowSeconds, requestLimit, requestWindowSeconds,
                previewLimit, previewWindowSeconds, Clock.systemUTC());
    }

    PublicSubmissionRateLimitFilter(
            int contactLimit,
            long contactWindowSeconds,
            int requestLimit,
            long requestWindowSeconds,
            int previewLimit,
            long previewWindowSeconds,
            Clock clock) {
        this.clock = clock;
        this.limits = Map.of(
                EndpointGroup.CONTACT, new Limit(contactLimit, contactWindowSeconds),
                EndpointGroup.REQUEST, new Limit(requestLimit, requestWindowSeconds),
                EndpointGroup.PREVIEW, new Limit(previewLimit, previewWindowSeconds));
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        EndpointGroup group = endpointGroup(request);
        if (group == null) {
            filterChain.doFilter(request, response);
            return;
        }

        Limit limit = limits.get(group);
        String clientAddress = request.getRemoteAddr() == null ? "unknown" : request.getRemoteAddr();
        String key = group.name() + ':' + clientAddress;
        long now = clock.instant().getEpochSecond();
        WindowCounter counter = counters.asMap().compute(key, (ignored, existing) -> {
            if (existing == null || now >= existing.startedAt + limit.windowSeconds) {
                return new WindowCounter(now, 1);
            }
            existing.count += 1;
            return existing;
        });

        if (counter.count > limit.maxRequests) {
            long retryAfter = Math.max(1, counter.startedAt + limit.windowSeconds - now);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setHeader(HttpHeaders.RETRY_AFTER, Long.toString(retryAfter));
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"status\":429,\"message\":\"Too many requests. Please wait and try again.\",\"details\":[]}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private EndpointGroup endpointGroup(HttpServletRequest request) {
        if (!"POST".equalsIgnoreCase(request.getMethod())) return null;
        String path = request.getRequestURI();
        if ("/api/contact-messages".equals(path)) return EndpointGroup.CONTACT;
        if ("/api/quick-requests".equals(path)
                || "/api/custom-embroidery/requests".equals(path)
                || "/api/custom-printing/requests".equals(path)) return EndpointGroup.REQUEST;
        if ("/api/custom-embroidery/previews".equals(path)
                || "/api/custom-printing/previews".equals(path)) return EndpointGroup.PREVIEW;
        return null;
    }

    private enum EndpointGroup { CONTACT, REQUEST, PREVIEW }

    private record Limit(int maxRequests, long windowSeconds) {
        private Limit {
            if (maxRequests < 1 || windowSeconds < 1) {
                throw new IllegalArgumentException("Public submission limits must be positive.");
            }
        }
    }

    private static final class WindowCounter {
        private final long startedAt;
        private int count;

        private WindowCounter(long startedAt, int count) {
            this.startedAt = startedAt;
            this.count = count;
        }
    }
}
