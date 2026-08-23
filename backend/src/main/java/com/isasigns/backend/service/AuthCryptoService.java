package com.isasigns.backend.service;

import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Service;

import com.isasigns.backend.config.AuthProperties;
import com.isasigns.backend.model.AuthChallengePurpose;

@Service
public class AuthCryptoService {
    private final SecureRandom secureRandom = new SecureRandom();
    private final byte[] otpPepper;

    public AuthCryptoService(AuthProperties properties) {
        this.otpPepper = required(properties.getOtpPepper(), "AUTH_OTP_PEPPER")
                .getBytes(StandardCharsets.UTF_8);
    }

    public String newFourDigitCode() {
        return "%04d".formatted(secureRandom.nextInt(10_000));
    }

    public String newRefreshToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public String otpDigest(java.util.UUID challengeId, AuthChallengePurpose purpose, String code) {
        return hmacHex(challengeId + ":" + purpose + ":" + code);
    }

    public boolean otpMatches(String expectedDigest, java.util.UUID challengeId,
            AuthChallengePurpose purpose, String code) {
        byte[] expected = HexFormat.of().parseHex(expectedDigest);
        byte[] actual = HexFormat.of().parseHex(otpDigest(challengeId, purpose, code));
        return MessageDigest.isEqual(expected, actual);
    }

    public String tokenDigest(String token) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException("SHA-256 is unavailable.", exception);
        }
    }

    public String privacyDigest(String value) {
        return hmacHex(value == null ? "unknown" : value);
    }

    private String hmacHex(String value) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(otpPepper, "HmacSHA256"));
            return HexFormat.of().formatHex(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException("HMAC-SHA256 is unavailable.", exception);
        }
    }

    private static String required(String value, String name) {
        if (value == null || value.isBlank()) throw new IllegalStateException(name + " is required.");
        return value;
    }
}
