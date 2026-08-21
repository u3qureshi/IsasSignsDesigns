package com.isasigns.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.isasigns.backend.dto.checkout.CreateCheckoutSessionRequest;
import com.isasigns.backend.dto.checkout.CreateCheckoutSessionResponse;
import com.isasigns.backend.dto.checkout.OrderConfirmationResponse;
import com.isasigns.backend.service.CheckoutService;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {
    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/sessions")
    @ResponseStatus(HttpStatus.CREATED)
    public CreateCheckoutSessionResponse createSession(@RequestBody CreateCheckoutSessionRequest request) {
        return checkoutService.createSession(request);
    }

    @GetMapping("/orders")
    public OrderConfirmationResponse getOrder(@RequestParam String sessionId) {
        return checkoutService.getBySessionId(sessionId);
    }
}
