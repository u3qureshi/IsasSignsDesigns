package com.isasigns.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.isasigns.backend.config.AuthProperties;
import com.isasigns.backend.dto.auth.LoginRequest;
import com.isasigns.backend.dto.auth.SignupRequest;
import com.isasigns.backend.dto.auth.VerifyCodeRequest;
import com.isasigns.backend.exception.AuthRequestException;
import com.isasigns.backend.model.AppUser;
import com.isasigns.backend.model.AuthChallengePurpose;
import com.isasigns.backend.model.AuthEmailChallenge;
import com.isasigns.backend.repository.AppUserRepository;
import com.isasigns.backend.repository.AuthEmailChallengeRepository;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock AppUserRepository userRepository;
    @Mock AuthEmailChallengeRepository challengeRepository;
    @Mock AuthEmailService emailService;
    @Mock AuthSessionService sessionService;

    private AuthService service;

    @BeforeEach
    void setUp() {
        var properties = properties();
        var crypto = new AuthCryptoService(properties);
        service = new AuthService(userRepository, challengeRepository, crypto,
                emailService, sessionService, properties);
        lenient().when(challengeRepository.countByNormalizedEmailAndCreatedAtAfter(anyString(), any())).thenReturn(0L);
        lenient().when(challengeRepository.countByRequestIpDigestAndCreatedAtAfter(anyString(), any())).thenReturn(0L);
        lenient().when(userRepository.save(any(AppUser.class))).thenAnswer(invocation -> invocation.getArgument(0));
        lenient().when(challengeRepository.save(any(AuthEmailChallenge.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void signupRequiresMatchingEmailsAndVerifiesTheEmailedCode() {
        when(userRepository.findByNormalizedEmail("avery@example.com")).thenReturn(Optional.empty());
        when(userRepository.existsByNormalizedPhoneAndIdNot(anyString(), any())).thenReturn(false);
        var code = ArgumentCaptor.forClass(String.class);
        var storedChallenge = ArgumentCaptor.forClass(AuthEmailChallenge.class);

        var started = service.startSignup(new SignupRequest(
                "Avery", "Customer", "Avery@Example.com", "avery@example.com",
                "4165550123", false), "127.0.0.1");
        verify(emailService).sendCode(
                org.mockito.ArgumentMatchers.eq("avery@example.com"),
                code.capture(), org.mockito.ArgumentMatchers.eq(AuthChallengePurpose.SIGNUP));
        verify(challengeRepository).save(storedChallenge.capture());
        AuthEmailChallenge challenge = storedChallenge.getValue();
        when(challengeRepository.findById(started.challengeId())).thenReturn(Optional.of(challenge));
        when(challengeRepository.findTopByNormalizedEmailAndPurposeOrderByCreatedAtDesc(
                "avery@example.com", AuthChallengePurpose.SIGNUP)).thenReturn(Optional.of(challenge));
        when(sessionService.issue(any(AppUser.class), any())).thenAnswer(invocation -> {
            AppUser user = invocation.getArgument(0);
            return new IssuedAuthSession(user, "jwt", Instant.now().plusSeconds(900),
                    "refresh", OffsetDateTime.now().plusDays(30));
        });

        var session = service.verify(new VerifyCodeRequest(started.challengeId(), code.getValue()), "test-agent");

        assertThat(session.user().isActive()).isTrue();
        assertThat(session.user().getEmailVerifiedAt()).isNotNull();
        assertThat(challenge.getConsumedAt()).isNotNull();
    }

    @Test
    void signupRejectsMismatchedConfirmationBeforeCreatingAUser() {
        assertThatThrownBy(() -> service.startSignup(new SignupRequest(
                "Avery", "", "avery@example.com", "someone@example.com", "", false), "127.0.0.1"))
                .isInstanceOf(AuthRequestException.class)
                .hasMessageContaining("do not match");
        verify(userRepository, never()).save(any());
    }

    @Test
    void unknownLoginReturnsGenericChallengeWithoutSendingEmail() {
        when(userRepository.findByNormalizedEmail("missing@example.com")).thenReturn(Optional.empty());

        var response = service.startLogin(new LoginRequest("missing@example.com"), "127.0.0.1");

        assertThat(response.challengeId()).isNotNull();
        assertThat(response.message()).doesNotContain("account");
        verify(emailService, never()).sendCode(anyString(), anyString(), any());
    }

    private AuthProperties properties() {
        var properties = new AuthProperties();
        properties.setOtpPepper("test-only-pepper-with-enough-random-looking-characters");
        properties.setOtpMinutes(10);
        properties.setOtpMaxAttempts(5);
        properties.setRequestCooldownSeconds(60);
        properties.setEmailLimitPer15Minutes(5);
        properties.setIpLimitPerHour(30);
        return properties;
    }
}
