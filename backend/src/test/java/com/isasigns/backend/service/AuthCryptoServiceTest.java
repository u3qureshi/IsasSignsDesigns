package com.isasigns.backend.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.UUID;

import org.junit.jupiter.api.Test;

import com.isasigns.backend.config.AuthProperties;
import com.isasigns.backend.model.AuthChallengePurpose;

class AuthCryptoServiceTest {
    private final AuthCryptoService crypto = crypto();

    @Test
    void generatesFourDigitCodesAndChallengeBoundDigests() {
        String code = crypto.newFourDigitCode();
        UUID challengeId = UUID.randomUUID();
        String digest = crypto.otpDigest(challengeId, AuthChallengePurpose.LOGIN, code);

        assertThat(code).matches("\\d{4}");
        assertThat(digest).hasSize(64).doesNotContain(code);
        assertThat(crypto.otpMatches(digest, challengeId, AuthChallengePurpose.LOGIN, code)).isTrue();
        assertThat(crypto.otpMatches(digest, UUID.randomUUID(), AuthChallengePurpose.LOGIN, code)).isFalse();
        assertThat(crypto.otpMatches(digest, challengeId, AuthChallengePurpose.SIGNUP, code)).isFalse();
    }

    @Test
    void generatesHighEntropyOpaqueRefreshTokens() {
        String first = crypto.newRefreshToken();
        String second = crypto.newRefreshToken();

        assertThat(first).hasSizeGreaterThanOrEqualTo(40).isNotEqualTo(second);
        assertThat(crypto.tokenDigest(first)).hasSize(64).doesNotContain(first);
    }

    private AuthCryptoService crypto() {
        var properties = new AuthProperties();
        properties.setOtpPepper("test-only-pepper-with-enough-random-looking-characters");
        return new AuthCryptoService(properties);
    }
}
