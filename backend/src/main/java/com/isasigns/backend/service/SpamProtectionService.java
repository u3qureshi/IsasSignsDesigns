package com.isasigns.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.isasigns.backend.exception.RequestValidationException;

@Service
public class SpamProtectionService {
    public void rejectFilledHoneypot(String website) {
        if (StringUtils.hasText(website)) {
            throw new RequestValidationException(List.of("The submission could not be accepted."));
        }
    }
}
