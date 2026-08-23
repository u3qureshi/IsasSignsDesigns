package com.isasigns.backend.config;

import jakarta.annotation.PostConstruct;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.auth")
public class AuthProperties {
    private boolean emailEnabled;
    private String otpPepper;
    private String jwtSecret;
    private String issuer = "https://auth.thread-and-butter.invalid";
    private String audience = "thread-and-butter-web";
    private int accessTokenMinutes = 15;
    private int refreshTokenDays = 30;
    private int otpMinutes = 10;
    private int otpMaxAttempts = 5;
    private int requestCooldownSeconds = 60;
    private int emailLimitPer15Minutes = 5;
    private int ipLimitPerHour = 30;
    private boolean secureCookies;
    private String accessCookieName = "tnb_access";
    private String refreshCookieName = "tnb_refresh";

    public boolean isEmailEnabled() { return emailEnabled; }
    public void setEmailEnabled(boolean emailEnabled) { this.emailEnabled = emailEnabled; }
    public String getOtpPepper() { return otpPepper; }
    public void setOtpPepper(String otpPepper) { this.otpPepper = otpPepper; }
    public String getJwtSecret() { return jwtSecret; }
    public void setJwtSecret(String jwtSecret) { this.jwtSecret = jwtSecret; }
    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }
    public String getAudience() { return audience; }
    public void setAudience(String audience) { this.audience = audience; }
    public int getAccessTokenMinutes() { return accessTokenMinutes; }
    public void setAccessTokenMinutes(int accessTokenMinutes) { this.accessTokenMinutes = accessTokenMinutes; }
    public int getRefreshTokenDays() { return refreshTokenDays; }
    public void setRefreshTokenDays(int refreshTokenDays) { this.refreshTokenDays = refreshTokenDays; }
    public int getOtpMinutes() { return otpMinutes; }
    public void setOtpMinutes(int otpMinutes) { this.otpMinutes = otpMinutes; }
    public int getOtpMaxAttempts() { return otpMaxAttempts; }
    public void setOtpMaxAttempts(int otpMaxAttempts) { this.otpMaxAttempts = otpMaxAttempts; }
    public int getRequestCooldownSeconds() { return requestCooldownSeconds; }
    public void setRequestCooldownSeconds(int requestCooldownSeconds) { this.requestCooldownSeconds = requestCooldownSeconds; }
    public int getEmailLimitPer15Minutes() { return emailLimitPer15Minutes; }
    public void setEmailLimitPer15Minutes(int emailLimitPer15Minutes) { this.emailLimitPer15Minutes = emailLimitPer15Minutes; }
    public int getIpLimitPerHour() { return ipLimitPerHour; }
    public void setIpLimitPerHour(int ipLimitPerHour) { this.ipLimitPerHour = ipLimitPerHour; }
    public boolean isSecureCookies() { return secureCookies; }
    public void setSecureCookies(boolean secureCookies) { this.secureCookies = secureCookies; }
    public String getAccessCookieName() { return accessCookieName; }
    public void setAccessCookieName(String accessCookieName) { this.accessCookieName = accessCookieName; }
    public String getRefreshCookieName() { return refreshCookieName; }
    public void setRefreshCookieName(String refreshCookieName) { this.refreshCookieName = refreshCookieName; }

    @PostConstruct
    void validate() {
        requireSecret(otpPepper, "AUTH_OTP_PEPPER");
        requireSecret(jwtSecret, "AUTH_JWT_SECRET");
        if (accessTokenMinutes <= 0 || refreshTokenDays <= 0 || otpMinutes <= 0
                || otpMaxAttempts <= 0 || requestCooldownSeconds < 0
                || emailLimitPer15Minutes <= 0 || ipLimitPerHour <= 0) {
            throw new IllegalStateException("Authentication lifetimes and limits must be positive.");
        }
        if (secureCookies && (otpPepper.startsWith("local-development-")
                || jwtSecret.startsWith("local-development-"))) {
            throw new IllegalStateException(
                    "Production cookies cannot use the local development authentication secrets.");
        }
    }

    private void requireSecret(String value, String name) {
        if (value == null || value.length() < 32) {
            throw new IllegalStateException(name + " must contain at least 32 characters.");
        }
    }
}
