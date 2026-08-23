package com.isasigns.backend.service;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.isasigns.backend.config.AuthProperties;
import com.isasigns.backend.dto.auth.AuthChallengeResponse;
import com.isasigns.backend.dto.auth.AuthUserResponse;
import com.isasigns.backend.dto.auth.LoginRequest;
import com.isasigns.backend.dto.auth.SignupRequest;
import com.isasigns.backend.dto.auth.UpdateProfileRequest;
import com.isasigns.backend.dto.auth.VerifyCodeRequest;
import com.isasigns.backend.exception.AuthRequestException;
import com.isasigns.backend.model.AppUser;
import com.isasigns.backend.model.AuthChallengePurpose;
import com.isasigns.backend.model.AuthEmailChallenge;
import com.isasigns.backend.repository.AppUserRepository;
import com.isasigns.backend.repository.AuthEmailChallengeRepository;

@Service
public class AuthService {
    private static final String CHALLENGE_MESSAGE =
            "If the email can be used for this request, a four-digit code has been sent.";

    private final AppUserRepository userRepository;
    private final AuthEmailChallengeRepository challengeRepository;
    private final AuthCryptoService cryptoService;
    private final AuthEmailService emailService;
    private final AuthSessionService sessionService;
    private final AuthProperties properties;

    public AuthService(AppUserRepository userRepository,
            AuthEmailChallengeRepository challengeRepository,
            AuthCryptoService cryptoService, AuthEmailService emailService,
            AuthSessionService sessionService, AuthProperties properties) {
        this.userRepository = userRepository;
        this.challengeRepository = challengeRepository;
        this.cryptoService = cryptoService;
        this.emailService = emailService;
        this.sessionService = sessionService;
        this.properties = properties;
    }

    @Transactional
    public AuthChallengeResponse startSignup(SignupRequest request, String remoteAddress) {
        emailService.ensureEnabled();
        String email = normalizeEmail(request.email());
        if (!email.equals(normalizeEmail(request.emailConfirmation()))) {
            throw badRequest("The two email addresses do not match.");
        }

        String firstName = requiredName(request.firstName(), "first name");
        String lastName = optionalText(request.lastName(), 80);
        Phone phone = phone(request.phone(), request.smsConsent());
        String requestIpDigest = cryptoService.privacyDigest(remoteAddress);
        enforceRateLimits(email, AuthChallengePurpose.SIGNUP, requestIpDigest);

        AppUser user = userRepository.findByNormalizedEmail(email).orElse(null);
        if (user != null && user.isActive()) {
            // Keep signup neutral: an existing account receives the same kind of code and is
            // signed in after proof of mailbox control, without overwriting its saved profile.
            return createAndSendChallenge(user, email, AuthChallengePurpose.SIGNUP, requestIpDigest);
        }
        if (user == null) {
            user = new AppUser(firstName, lastName, email, email,
                    phone.display(), phone.normalized(), request.smsConsent());
        } else {
            user.updatePendingSignup(firstName, lastName, email,
                    phone.display(), phone.normalized(), request.smsConsent());
        }
        ensurePhoneAvailable(phone.normalized(), user.getId());
        userRepository.save(user);
        return createAndSendChallenge(user, email, AuthChallengePurpose.SIGNUP, requestIpDigest);
    }

    @Transactional
    public AuthChallengeResponse startLogin(LoginRequest request, String remoteAddress) {
        emailService.ensureEnabled();
        String email = normalizeEmail(request.email());
        String requestIpDigest = cryptoService.privacyDigest(remoteAddress);
        enforceRateLimits(email, AuthChallengePurpose.LOGIN, requestIpDigest);

        AppUser user = userRepository.findByNormalizedEmail(email)
                .filter(AppUser::isActive)
                .orElse(null);
        return createAndSendChallenge(user, email, AuthChallengePurpose.LOGIN, requestIpDigest);
    }

    @Transactional(noRollbackFor = AuthRequestException.class)
    public IssuedAuthSession verify(VerifyCodeRequest request, String userAgent) {
        var challenge = challengeRepository.findById(request.challengeId())
                .orElseThrow(this::invalidCode);
        var latest = challengeRepository
                .findTopByNormalizedEmailAndPurposeOrderByCreatedAtDesc(
                        challenge.getNormalizedEmail(), challenge.getPurpose())
                .orElse(null);
        var now = OffsetDateTime.now();

        if (latest == null || !latest.getId().equals(challenge.getId()) || !challenge.isUsableAt(now)) {
            throw invalidCode();
        }
        if (!cryptoService.otpMatches(challenge.getCodeDigest(), challenge.getId(),
                challenge.getPurpose(), request.code())) {
            challenge.recordFailedAttempt();
            challengeRepository.save(challenge);
            throw invalidCode();
        }

        AppUser user = challenge.getUser();
        if (user == null) throw invalidCode();
        if (challenge.getPurpose() == AuthChallengePurpose.SIGNUP) {
            if (user.isActive()) user.recordLogin();
            else user.activate();
        } else {
            if (!user.isActive()) throw invalidCode();
            user.recordLogin();
        }
        challenge.consume();
        userRepository.save(user);
        challengeRepository.save(challenge);
        return sessionService.issue(user, userAgent);
    }

    @Transactional(readOnly = true)
    public AuthUserResponse getUser(UUID userId) {
        return AuthUserResponse.from(activeUser(userId));
    }

    @Transactional
    public AuthUserResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        AppUser user = activeUser(userId);
        String firstName = requiredName(request.firstName(), "first name");
        String lastName = optionalText(request.lastName(), 80);
        Phone phone = phone(request.phone(), request.smsConsent());
        ensurePhoneAvailable(phone.normalized(), user.getId());
        user.updateProfile(firstName, lastName, phone.display(), phone.normalized(), request.smsConsent());
        return AuthUserResponse.from(userRepository.save(user));
    }

    private AuthChallengeResponse createAndSendChallenge(AppUser user, String email,
            AuthChallengePurpose purpose, String requestIpDigest) {
        UUID id = UUID.randomUUID();
        String code = cryptoService.newFourDigitCode();
        OffsetDateTime expiresAt = OffsetDateTime.now().plusMinutes(properties.getOtpMinutes());
        var challenge = new AuthEmailChallenge(id, user, email, purpose,
                cryptoService.otpDigest(id, purpose, code), requestIpDigest,
                expiresAt, properties.getOtpMaxAttempts());
        challengeRepository.save(challenge);

        // Unknown login emails get the same HTTP response and a real-looking stored challenge,
        // but no message is sent and verification can never create a session.
        if (user != null) emailService.sendCode(user.getEmail(), code, purpose);
        return new AuthChallengeResponse(id, CHALLENGE_MESSAGE,
                Duration.between(OffsetDateTime.now(), expiresAt).toSeconds(),
                properties.getRequestCooldownSeconds());
    }

    private void enforceRateLimits(String email, AuthChallengePurpose purpose, String ipDigest) {
        OffsetDateTime now = OffsetDateTime.now();
        challengeRepository.findTopByNormalizedEmailAndPurposeOrderByCreatedAtDesc(email, purpose)
                .filter(challenge -> challenge.getCreatedAt().isAfter(
                        now.minusSeconds(properties.getRequestCooldownSeconds())))
                .ifPresent(challenge -> {
                    long remaining = Math.max(1, properties.getRequestCooldownSeconds()
                            - Duration.between(challenge.getCreatedAt(), now).toSeconds());
                    throw new AuthRequestException(HttpStatus.TOO_MANY_REQUESTS,
                            "Please wait before requesting another code.", remaining);
                });
        if (challengeRepository.countByNormalizedEmailAndCreatedAtAfter(email, now.minusMinutes(15))
                >= properties.getEmailLimitPer15Minutes()) {
            throw new AuthRequestException(HttpStatus.TOO_MANY_REQUESTS,
                    "Too many codes were requested. Please try again later.", 900L);
        }
        if (challengeRepository.countByRequestIpDigestAndCreatedAtAfter(ipDigest, now.minusHours(1))
                >= properties.getIpLimitPerHour()) {
            throw new AuthRequestException(HttpStatus.TOO_MANY_REQUESTS,
                    "Too many sign-in attempts were made. Please try again later.", 3600L);
        }
    }

    private AppUser activeUser(UUID id) {
        return userRepository.findById(id).filter(AppUser::isActive)
                .orElseThrow(() -> new AuthRequestException(HttpStatus.UNAUTHORIZED,
                        "Please sign in to continue."));
    }

    private void ensurePhoneAvailable(String normalizedPhone, UUID userId) {
        if (normalizedPhone != null
                && userRepository.existsByNormalizedPhoneAndIdNot(normalizedPhone, userId)) {
            throw badRequest("That phone number is already connected to another account.");
        }
    }

    private Phone phone(String raw, boolean smsConsent) {
        if (!StringUtils.hasText(raw)) {
            if (smsConsent) throw badRequest("Enter a phone number before consenting to text messages.");
            return new Phone(null, null);
        }
        String digits = raw.replaceAll("\\D", "");
        if (digits.length() < 10 || digits.length() > 15) {
            throw badRequest("Phone number must contain 10 to 15 digits.");
        }
        return new Phone(digits, "+" + (digits.length() == 10 ? "1" : "") + digits);
    }

    private String normalizeEmail(String raw) {
        if (!StringUtils.hasText(raw)) throw badRequest("Enter a valid email address.");
        String email = raw.trim().toLowerCase(Locale.ROOT);
        if (email.length() > 255 || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw badRequest("Enter a valid email address.");
        }
        return email;
    }

    private String requiredName(String value, String label) {
        String text = optionalText(value, 80);
        if (text == null) throw badRequest("Enter your " + label + ".");
        return text;
    }

    private String optionalText(String value, int max) {
        if (!StringUtils.hasText(value)) return null;
        String text = value.trim();
        if (text.length() > max) throw badRequest("One of the entered values is too long.");
        return text;
    }

    private AuthRequestException badRequest(String message) {
        return new AuthRequestException(HttpStatus.BAD_REQUEST, message);
    }

    private AuthRequestException invalidCode() {
        return new AuthRequestException(HttpStatus.UNAUTHORIZED,
                "That code is invalid, expired, or has already been used.");
    }

    private record Phone(String display, String normalized) {}
}
