package com.isasigns.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.isasigns.backend.dto.account.AccountCustomRequestResponse;
import com.isasigns.backend.dto.checkout.OrderConfirmationResponse;
import com.isasigns.backend.service.AccountHistoryService;

@RestController
@RequestMapping("/api/account")
public class AccountController {
    private final AccountHistoryService accountHistoryService;

    public AccountController(AccountHistoryService accountHistoryService) {
        this.accountHistoryService = accountHistoryService;
    }

    @GetMapping("/orders")
    public List<OrderConfirmationResponse> orders() {
        return accountHistoryService.orders();
    }

    @GetMapping("/custom-requests")
    public List<AccountCustomRequestResponse> requests() {
        return accountHistoryService.requests();
    }
}
