# Thread & Butter Passwordless Authentication and Authorization Plan

> Status: passwordless email-code backend and frontend integration implemented locally
> Created: 2026-07-25  
> Architecture updates: 2026-08-22
> Current stack: React, Spring Boot, Spring Security, PostgreSQL, SMTP email OTPs, short-lived JWT
> access tokens, rotating opaque refresh sessions, HttpOnly cookies, and CSRF protection

> **Current decision:** Thread & Butter owns passwordless email-code authentication inside the
> monolith. Signup and every login prove control of the email address with a four-digit code.
> Section 28 is authoritative; Section 27 remains only as a rejected Cognito alternative.

## 1. Purpose

Thread & Butter needs customer accounts without passwords. A customer will prove control of an
email address by entering a one-time code delivered by email. After verification, the backend will
create an authenticated browser session using secure cookies.

This feature has two separate responsibilities:

- **Authentication** establishes who the current user is.
- **Authorization** determines which endpoints and records that user may access.

A signed-in customer must only see or modify their own account and requests. An administrator may
receive separate administrative permissions. Authentication alone must never be treated as
permission to access another customer's data.

## 2. Current project state

The repository now contains the first complete authentication foundation:

- Spring Boot `3.3.5`, Java 21, Gradle, Spring MVC, JPA, Flyway, PostgreSQL, and Spring Mail;
- a working SMTP email sender used by custom embroidery notifications;
- an `app_users` table created by `V2__custom_embroidery_requests.sql`;
- a nullable `custom_embroidery_requests.user_id` foreign key;
- React Router and the global `Header` component;
- Spring Security, JOSE/JWT support, a stateless security filter chain, and cookie authentication;
- signup, login, code verification, refresh, logout, CSRF, current-user, and profile endpoints;
- HMAC-protected four-digit challenges with expiry, guess limits, cooldowns, and persisted
  email/source throttles;
- 15-minute signed JWT access cookies and rotating 30-day opaque refresh cookies;
- React `AuthProvider` session restoration, single-flight refresh, real account state, and profile
  persistence.

The existing `app_users` table is a future-account placeholder. It stores `full_name`, optional
email, optional phone, normalized contact values, verification timestamps, status, and timestamps.
It must be migrated before it becomes the production account authority.

## 3. Recommended product decisions

Use these defaults unless a later business requirement changes them:

- email is the only login identifier;
- first name is required;
- last name is optional;
- phone is optional and is contact information, not a login identifier;
- text-message consent is optional and independent of account creation;
- marketing-email consent is separate from service/transactional email;
- guest browsing remains available;
- guest embroidery submission remains available to avoid blocking customers;
- when a user is signed in, a submitted embroidery request is linked to their `app_users.id`;
- access to saved requests requires authentication and ownership;
- an `ADMIN` role is assigned only through a controlled database/admin process, never through the
  public sign-up payload.

Do not collect birth date, address, security questions, government identifiers, or other personal
information until a real feature requires it.

## 4. Customer fields

### Required customer-provided values

- `email`
- `first_name`
- acceptance of the current Terms and Privacy Policy once those documents exist

### Optional customer-provided values

- `last_name`
- `phone`
- `sms_consent`
- separate marketing consent if marketing is added later

### Server-managed values

- UUID primary key
- normalized email
- email verification timestamp
- phone verification timestamp, if phone verification is introduced
- SMS-consent timestamp
- SMS-consent wording/version
- account status
- roles
- creation/update timestamps
- last successful login timestamp
- deactivation/deletion timestamp
- session and authentication audit history

## 5. Recommended sign-up and sign-in experience

### Sign in

1. Customer opens the user menu and selects **Sign in**.
2. Customer enters an email address.
3. React sends a code request.
4. The API always returns the same generic success response, regardless of whether the email
   exists.
5. The backend creates and emails a one-time code when permitted by rate limits.
6. Customer enters the code.
7. The backend verifies and consumes it atomically.
8. If the account exists and is active, the backend creates the cookies and returns the safe user
   profile.
9. React refreshes `/api/auth/me` and updates the header.

### Create account

Recommended flow:

1. Customer selects **Create account**.
2. Customer enters email, first name, optional last name, optional phone, and optional SMS consent.
3. React requests an email code with purpose `SIGNUP`.
4. Backend stores a pending registration/challenge and sends the code.
5. Customer enters the code.
6. Backend verifies the code and creates or activates the user in one transaction.
7. `email_verified_at` is set.
8. Access and refresh cookies are issued.
9. React opens the signed-in account state.

Do not issue authentication cookies to an unverified `PENDING` account.

### Account recovery

There is no password to reset. Control of the verified email address is the normal recovery
mechanism. If a customer loses access to that mailbox, do not use security questions. A separate,
careful manual recovery policy would be required later.

## 6. Email-code security rules

Recommended defaults:

- eight numeric digits;
- generated by a cryptographically secure random generator;
- 15-minute access-token lifetime;
- single use;
- five verification attempts maximum;
- 60-second resend cooldown;
- newest code invalidates every older code for the same email and purpose;
- request limits by normalized email and by IP address;
- verification limits by challenge, email, and IP address;
- HMAC the code with a dedicated server secret before database storage;
- compare HMAC values in constant time;
- never log the code;
- never return the code in an API response;
- record successful and failed events without recording authentication secrets.

The implemented initial limit is:

- five code requests per normalized email per 15 minutes;
- thirty code requests per source per hour;
- five guesses per issued challenge;
- a 60-second resend cooldown.

These values should be configurable and tuned from production observations. If abuse occurs,
Cloudflare Turnstile can be added after rate-limit thresholds rather than challenging every normal
customer.

Every request-code response should use neutral wording such as:

> If this email can be used, we sent a sign-in code.

This reduces account-enumeration leakage.

## 7. Token and session design

Use a hybrid model:

- a short-lived signed JWT as the access credential;
- a high-entropy opaque refresh token as the long-lived credential;
- both delivered only through cookies;
- refresh-token hashes stored in PostgreSQL;
- refresh tokens rotated on every successful refresh.

This meets the JWT requirement without making the long-lived refresh credential a difficult-to-
revoke JWT.

### Access JWT

Implemented lifetime: 15 minutes.

Allowed claims:

- `sub`: user UUID
- `iss`: stable Thread & Butter API issuer
- `aud`: Thread & Butter web application
- `iat`: issuance time
- `exp`: expiration time
- `jti`: unique JWT ID
- `roles`: trusted server-assigned roles

Do not put email, phone, name, consent, addresses, or other customer profile data in the JWT.

JWT verification must:

- allow only the configured signing algorithm;
- reject `none` and unexpected algorithms;
- verify signature, issuer, audience, expiration, and required claims;
- use managed signing keys from environment/secret storage;
- support planned key rotation.

### Refresh session

Recommended lifetime: 30 days when “keep me signed in” is enabled. A shorter session-only cookie
can be used when it is not enabled.

The refresh value should be at least 256 bits of secure random data. Store only a SHA-256 or HMAC
hash in `auth_refresh_sessions`. Rotate the value on every refresh. If an already-rotated token is reused,
revoke the entire token family because reuse may indicate theft.

Logout revokes the current refresh session and clears both cookies. **Sign out everywhere** revokes
all refresh sessions for that user. A 15-minute access JWT may remain usable until expiration
unless a deny-list or session-version check is introduced; sensitive operations should therefore
require recent email-code verification.

## 8. Cookie policy

Production authentication cookies use:

```text
HttpOnly
Secure
SameSite=Lax
no Domain attribute
```

Implemented names and paths:

```text
tnb_access  Path=/
tnb_refresh Path=/api/auth
```

The narrower refresh path prevents the browser from sending the long-lived credential to unrelated
application endpoints. Production enables `Secure`; local HTTP development cannot.

Never put access JWTs, refresh tokens, email codes, or session identifiers in:

- `localStorage`;
- `sessionStorage`;
- readable JavaScript state persisted to disk;
- URL query strings;
- analytics events;
- application logs.

React must call protected endpoints with:

```ts
fetch(url, {
  credentials: "include",
});
```

## 9. CSRF protection

Cookie authentication makes CSRF protection mandatory because browsers attach cookies
automatically.

Recommended approach:

- keep Spring Security CSRF protection enabled;
- expose a safe endpoint that initializes/returns the CSRF token;
- allow React to read only the CSRF token, not authentication cookies;
- send the token in an `X-XSRF-TOKEN` or configured request header for every state-changing
  request;
- require CSRF for cookie-authorized state changes (`refresh`, `logout`, and profile updates);
- use `SameSite=Lax` as an additional defence, not as the sole defence;
- allow only the real production frontend origin through CORS;
- keep the frontend and API same-site when possible.

## 10. Database migration design

### Update `app_users`

Target structure:

```text
id uuid primary key
email varchar(320) not null
normalized_email varchar(320) unique not null
first_name varchar(100) not null
last_name varchar(100) null
phone varchar(30) null
normalized_phone varchar(30) null
sms_consent boolean not null default false
sms_consent_at timestamptz null
sms_consent_version varchar(40) null
email_verified_at timestamptz not null after activation
phone_verified_at timestamptz null
status varchar(30) not null
last_login_at timestamptz null
created_at timestamptz not null
updated_at timestamptz not null
deactivated_at timestamptz null
```

Because phone is not a login identifier, reconsider the existing unique constraint on
`normalized_phone`. Shared household/business phone numbers may be legitimate.

### Add `user_roles`

```text
user_id uuid references app_users(id)
role varchar(30)
primary key (user_id, role)
```

Initially allow `CUSTOMER` and `ADMIN`.

### Add `auth_email_challenges`

```text
id uuid primary key
normalized_email varchar(320) not null
user_id uuid null references app_users(id)
purpose varchar(30) not null
code_digest varchar(64) not null
request_ip_digest varchar(64) not null
attempts integer not null default 0
max_attempts integer not null
expires_at timestamptz not null
consumed_at timestamptz null
created_at timestamptz not null
```

Purposes can initially include:

- `SIGNUP`
- `LOGIN`

### Add `auth_refresh_sessions`

```text
id uuid primary key
user_id uuid not null references app_users(id)
family_id uuid not null
token_digest varchar(64) unique not null
user_agent_digest varchar(64) null
created_at timestamptz not null
last_used_at timestamptz null
expires_at timestamptz not null
revoked_at timestamptz null
replaced_by_session_id uuid null
```

### Future: add `auth_audit_events`

```text
id uuid primary key
user_id uuid null references app_users(id)
normalized_email_hmac char(64) null
event_type varchar(60) not null
success boolean not null
ip_address_hmac char(64) null
user_agent varchar(500) null
details_json jsonb null
created_at timestamptz not null
```

Never store an OTP, raw refresh token, full JWT, SMTP credential, or JWT private key in the audit
table.

## 11. API design

### Public authentication endpoints

```text
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/verify
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/csrf
GET  /api/auth/me
PATCH /api/auth/me
```

`/api/auth/me` returns `401` when signed out and a minimal safe profile when signed in.

### Authenticated account endpoints

```text
GET    /api/account
PATCH  /api/account/profile
POST   /api/account/email/code
POST   /api/account/email/verify
GET    /api/account/sessions
DELETE /api/account/sessions/{sessionId}
POST   /api/account/sessions/revoke-all
POST   /api/account/delete/code
DELETE /api/account
GET    /api/account/embroidery-requests
```

The backend must derive the current user ID from the authenticated principal. It must never trust a
`userId` supplied by React for ownership decisions.

## 12. Authorization matrix

| Resource | Public | Customer | Admin |
|---|---:|---:|---:|
| Product/category browsing | Yes | Yes | Yes |
| Request/verify email code | Yes, rate-limited | Yes, rate-limited | Yes, rate-limited |
| Read own account | No | Own only | Own account |
| Update own account | No | Own only | Own account |
| Read own embroidery requests | No | Own only | All through admin endpoint |
| Submit embroidery request | Yes initially | Yes, linked to user | Yes |
| Generate AI preview | Decide before launch | Prefer authenticated/rate-limited | Yes |
| User administration | No | No | Yes |
| Product administration | No | No | Yes |

Use both request-level rules and ownership checks. A `CUSTOMER` role must not mean a customer may
read every customer record.

## 13. Spring Security structure

Before authentication implementation:

1. upgrade Spring Boot `3.3.5` through a supported 3.x release and run the full regression suite;
2. add `spring-boot-starter-security`;
3. use Spring Security's JWT/resource-server support or Nimbus libraries managed by Spring rather
   than writing cryptography manually;
4. define a `SecurityFilterChain`;
5. define public, authenticated, and administrator endpoint rules;
6. enable method-level security for sensitive service operations;
7. keep CSRF enabled;
8. add structured `401` and `403` JSON responses;
9. add authentication integration tests before protecting existing endpoints.

Spring Security added one-time-token login support in Security 6.4. The project can evaluate this
support after upgrading, but a custom numeric-code delivery and React JSON flow may still require a
custom token service and success handlers.

## 14. React architecture

Create:

```text
frontend/src/auth/AuthProvider.tsx
frontend/src/auth/authApi.ts
frontend/src/auth/useAuth.ts
frontend/src/components/auth/AuthDialog.tsx
frontend/src/components/auth/EmailCodeForm.tsx
frontend/src/components/auth/UserMenu.tsx
frontend/src/components/pages/AccountSettingsPage.tsx
frontend/src/components/pages/MyEmbroideryRequestsPage.tsx
```

`AuthProvider` responsibilities:

- call `/api/auth/me` once when the application starts;
- expose `user`, `isLoading`, `isAuthenticated`, `refreshUser`, and `signOut`;
- never store or decode the access JWT in React;
- treat the backend `/me` response as the account authority;
- use `credentials: "include"`;
- include the CSRF header for state-changing requests;
- handle one automatic refresh attempt after an expired access token;
- avoid refresh loops.

## 15. Header user menu

Place a user icon immediately left of the shopping cart.

Signed-out menu:

- **Sign in**
- **Create account**

Signed-in menu:

- customer initials or user icon;
- first name and email;
- **Account settings**;
- **My embroidery requests**;
- **My orders** when ordering exists;
- **Sign out**.

Administrator-only addition:

- **Admin dashboard**.

Accessibility requirements:

- actual button for the trigger;
- `aria-expanded`, `aria-haspopup`, and menu labelling;
- keyboard navigation;
- Escape closes and returns focus;
- click/focus outside closes;
- visible focus styles;
- mobile-compatible layout;
- loading state while `/api/auth/me` is pending.

## 16. Account Settings

First release:

- update first name;
- update optional last name;
- update optional phone;
- update SMS consent with timestamp/version;
- change email through a fresh verification code;
- list active browser sessions;
- revoke another session;
- sign out everywhere;
- request account deletion/deactivation;
- link to the customer's embroidery requests.

Changing email, deleting the account, and other sensitive actions should require a new email code
even when an access JWT is still valid.

## 17. Embroidery integration

When a user submits while authenticated:

- set `custom_embroidery_requests.user_id` from the authenticated principal;
- do not accept `user_id` in the form payload;
- keep a copy of the submitted name/email/phone on the request as historical order/request data;
- allow later profile changes without rewriting historical submissions;
- show the request under **My embroidery requests**;
- authorize access with `request.user_id == currentUser.id`, unless the caller has `ADMIN`.

For guest submissions:

- continue storing `user_id = NULL`;
- optionally offer “Create an account to track this request” after successful submission;
- linking an old guest request later must require proof of the request email and must not rely only
  on knowing the request number.

## 18. Email delivery

The existing Gmail SMTP setup is acceptable for local development. Before customer launch:

- use a transactional-email provider;
- send from a business-owned domain;
- configure SPF, DKIM, and DMARC;
- use separate templates for sign-up, login, email change, and sensitive-action verification;
- state the code lifetime;
- tell recipients to ignore unexpected codes;
- do not include private account details;
- prevent authentication emails from being blocked by an embroidery-notification failure;
- monitor bounce, rejection, and delivery rates.

## 19. Environment variables

Implemented configuration:

```dotenv
AUTH_EMAIL_ENABLED=true
AUTH_OTP_PEPPER=
AUTH_JWT_SECRET=
AUTH_JWT_ISSUER=https://auth.thread-and-butter.invalid
AUTH_JWT_AUDIENCE=thread-and-butter-web
AUTH_ACCESS_TOKEN_MINUTES=15
AUTH_REFRESH_TOKEN_DAYS=30
AUTH_OTP_MINUTES=10
AUTH_OTP_MAX_ATTEMPTS=5
AUTH_REQUEST_COOLDOWN_SECONDS=60
AUTH_EMAIL_LIMIT_PER_15_MINUTES=5
AUTH_IP_LIMIT_PER_HOUR=30
AUTH_SECURE_COOKIES=false
```

Production overrides must set secure cookies and the real HTTPS origin. Use a secret manager in
production rather than a committed `.env`.

## 20. Error and privacy behavior

- Do not distinguish “account does not exist” from “account exists” at code-request time.
- Return `401` for missing/invalid authentication.
- Return `403` for authenticated users lacking permission.
- Return `429` for rate limits and include a safe retry delay.
- Do not reveal whether an email is an administrator.
- Avoid recording full IP addresses indefinitely; use a documented retention policy or HMAC where
  appropriate.
- Do not expose stack traces or provider errors to the browser.
- Use `Cache-Control: no-store` on authentication responses.
- Clear cookies with the exact same name/path/security attributes used when setting them.
- Consider `Clear-Site-Data` on full logout/account deletion after testing browser behavior.

## 21. Testing requirements

### Unit tests

- normalization;
- cryptographically generated code shape;
- code HMAC creation/comparison;
- expiration;
- attempt limits;
- single-use consumption;
- resend invalidation;
- JWT claim creation and validation;
- cookie creation and clearing;
- refresh rotation and reuse detection;
- ownership rules.

### Integration tests

- sign up successfully;
- duplicate sign-up behavior does not enumerate accounts;
- login successfully;
- invalid/expired/consumed code;
- newest code invalidates an older code;
- suspended account cannot sign in;
- valid access cookie authenticates;
- expired access plus valid refresh rotates successfully;
- revoked refresh fails;
- reused rotated refresh revokes its family;
- logout clears cookies;
- CSRF-less writes fail;
- customer cannot access another customer's request;
- administrator can access only explicit admin endpoints;
- profile/email/deletion changes require reauthentication;
- rate-limit responses are correct.

### Browser tests

- header state survives refresh through cookies;
- authentication tokens are absent from local/session storage;
- sign-in dialog keyboard behavior;
- user dropdown keyboard and click-outside behavior;
- mobile menu;
- expired session recovery;
- logout in multiple tabs;
- account settings;
- request linking.

## 22. Production checklist

- supported Spring Boot/Spring Security release;
- HTTPS and HTTP-to-HTTPS redirect;
- secure cookie attributes verified in browser developer tools;
- strict production CORS allow-list;
- CSRF verified;
- signing keys generated and stored securely;
- signing-key rotation procedure documented;
- rate limits work across all application instances;
- PostgreSQL backups and restore test;
- transactional-email authentication records configured;
- privacy policy and terms published;
- consent wording/version and retention decided;
- audit-event retention decided;
- dependency and container vulnerability scanning;
- security headers enabled;
- no secrets in repository/history/logs;
- alerts for code abuse, refresh reuse, repeated failures, and email-delivery problems;
- independent security review before protecting payment or administrator functions.

## 23. Implementation phases

### Phase A — platform upgrade and schema

1. Upgrade Spring Boot safely and verify existing product, embroidery, Cloudinary, Cloudflare, and
   email flows.
2. Add Spring Security with an initially conservative endpoint configuration.
3. Add Flyway migrations for users, roles, codes, sessions, and audit events.
4. Add JPA entities/repositories and migration tests.

### Phase B — email-code authentication

1. Add code request service.
2. Add rate limiting.
3. Add authentication email templates.
4. Add atomic verification/consumption.
5. Add sign-up activation and login.

### Phase C — cookies, JWT, refresh, and CSRF

1. Add signing keys and JWT validation.
2. Add secure access-cookie issuance.
3. Add opaque refresh sessions and rotation.
4. Add logout/revoke-all.
5. Add CSRF integration.
6. Add security integration tests.

### Phase D — React authentication UI

1. Add `AuthProvider`.
2. Add Sign in/Create account dialog.
3. Add email-code input.
4. Add header user icon/dropdown.
5. Add account loading/error states.

### Phase E — authorization and account settings

1. Add Account Settings.
2. Add active-session management.
3. Add sensitive-action reauthentication.
4. Link authenticated embroidery submissions.
5. Add My Embroidery Requests with ownership enforcement.
6. Add controlled `ADMIN` role and later admin UI.

### Phase F — production hardening

1. Move from Gmail to transactional email.
2. Configure production domain authentication.
3. Add distributed rate limiting or a proven single-instance policy.
4. Add monitoring/alerts.
5. Complete security and privacy review.

## 24. Decisions required before coding

Recommended answers are shown:

1. **Allow guest embroidery submissions?** Yes.
2. **Use email only as the login identifier?** Yes.
3. **Require first name?** Yes.
4. **Require last name?** No.
5. **Require phone?** No.
6. **Use SMS consent for account creation?** Optional and never bundled with sign-up.
7. **Remember signed-in users?** Yes, rotating 30-day refresh session.
8. **Use JWT access plus opaque refresh?** Yes.
9. **Initial roles?** `CUSTOMER` and manually assigned `ADMIN`.
10. **Initial email provider?** Existing Gmail SMTP now; authenticate a custom domain later.
11. **Frontend/API deployment?** Prefer the same site.
12. **Account deletion behavior?** Initially deactivate and revoke sessions; define legal retention
    before permanent erasure.

## 25. Primary security references

- Spring Security authentication architecture:
  <https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html>
- Spring Security authorization:
  <https://docs.spring.io/spring-security/reference/servlet/authorization/>
- Spring Security CSRF:
  <https://docs.spring.io/spring-security/reference/features/exploits/csrf.html>
- Spring Security one-time-token login:
  <https://docs.spring.io/spring-security/reference/7.0/api/java/org/springframework/security/config/annotation/web/configurers/ott/OneTimeTokenLoginConfigurer.html>
- Spring Boot upgrade guidance:
  <https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Release-Notes>
- OWASP Authentication Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html>
- OWASP Session Management Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html>
- OWASP MFA/OTP guidance:
  <https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html>
- IETF JWT Best Current Practices:
  <https://datatracker.ietf.org/doc/rfc8725/>
- MDN secure cookie configuration:
  <https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Cookies>

## 26. Historical frontend prototype implemented on 2026-07-25

The first authentication UI pass is now implemented without changing backend security:

- `src/components/auth/UserAccountMenu.tsx` adds the maroon account icon in the top-right branding
  row, directly above the cart. Both account and cart controls have circular
  `--theme-kids-bg` backgrounds, and their coloured outline circles draw around them on hover
  without changing the icon colours.
- Clicking the icon opens a signed-out menu with **Log in** and **Sign up**.
- `src/components/auth/AuthDialog.tsx` renders the account card through a React portal so it stays
  centered above the whole site.
- The card scales outward from the exact screen position of the account icon. It can be closed by
  clicking the backdrop, pressing Escape, or selecting the top-right X.
- The login prototype collects a valid email address and then shows a four-digit email-code
  screen.
- The sign-up prototype collects required first name and email plus optional last name, numeric
  phone, and independent SMS consent, then shows the same code screen.
- Entering any four digits intentionally activates a memory-only signed-in preview. No email,
  user record, JWT, refresh session, or cookie is created yet.
- The preview account menu contains **Account settings**, **My embroidery requests**, **My
  orders**, and **Sign out**. The request/order links are visibly marked **Soon** until their
  authenticated pages exist.
- Account settings can be previewed and edited in React state for the current page session only.
- The larger **Passwordless account** label sits beside the email/key icon to reduce vertical
  space in the login and sign-up cards.
- Reduced-motion browser preferences are respected by collapsing the transition duration.

This memory-only behaviour was replaced by the real implementation documented in Section 28.

## 27. Rejected alternative: AWS Cognito — 2026-08-22

> Superseded later on 2026-08-22 by Section 28. This section is retained to document the evaluated
> managed-auth alternative and must not be treated as the implementation target.

### Decision

Use an Amazon Cognito **Essentials** user pool as the production identity authority. Enable email as
the sign-in identifier and passwordless `EMAIL_OTP` authentication. Configure Cognito to send these
messages through the verified Thread & Butter Amazon SES domain.

Cognito Essentials is appropriate because it provides native email OTP, managed user lifecycle,
JWT issuance, and refresh-token rotation. Its ongoing free tier covers up to 10,000 directly
authenticated monthly active users per AWS account or organization; SES message charges remain
separate.

The Spring Boot application remains the browser-facing authentication boundary. React must not
call Cognito directly or persist Cognito tokens in browser storage.

### Browser/backend flow

Use a backend-for-frontend flow:

```text
React authentication dialog
        |
same-origin /api/auth requests + CSRF
        |
Spring Boot authentication service
        |
AWS SDK for Java
        |
Amazon Cognito User Pool --email OTP through--> Amazon SES
```

1. React submits sign-up or login details to Spring Boot.
2. Spring Boot calls Cognito with its EC2 IAM role and receives a temporary Cognito authentication
   session.
3. Spring Boot stores that temporary session server-side and returns only a random, short-lived
   challenge identifier to React.
4. The customer submits the email OTP with that challenge identifier.
5. Spring Boot completes the Cognito challenge.
6. Cognito issues tokens only after successful verification.
7. Spring Boot sets the authentication credentials in `Secure`, `HttpOnly`, `SameSite=Lax`,
   `__Host-` cookies; React never reads them.
8. Spring Security validates Cognito access-token signature, issuer, audience/client, token use, and
   expiration for authenticated requests.
9. Refresh uses Cognito refresh-token rotation. Logout revokes the local session where applicable
   and clears cookies with exactly matching attributes.

Do not expose Cognito temporary sessions, refresh tokens, access tokens, or ID tokens through URLs,
JSON response bodies, application logs, analytics, `localStorage`, or `sessionStorage`.

### Cognito resources

Provision with Terraform:

- one Cognito Essentials user pool in the production AWS region;
- email as the only sign-in alias for the first release;
- passwordless `EMAIL_OTP` as the allowed first factor;
- one public web app client with `ALLOW_USER_AUTH` and refresh-token rotation;
- no client secret embedded in React;
- self-service sign-up enabled;
- a conservative token lifetime configuration;
- deletion protection in production;
- Amazon SES email delivery from an authenticated domain;
- `CUSTOMER` and `ADMIN` Cognito groups if group claims are used;
- CloudWatch logging/alarms for delivery or authentication failures where supported.

Do not create a Cognito identity pool. Customers do not need direct temporary AWS credentials;
Spring Boot continues to mediate Cloudinary, S3, database, Stripe, and other service access.

### Local application data

Cognito owns identity and authentication factors. PostgreSQL still owns application-specific
customer data and relationships.

Migrate `app_users` to include:

```text
cognito_subject varchar(100) unique not null
email varchar(320) not null
normalized_email varchar(320) unique not null
first_name varchar(100) not null
last_name varchar(100) null
phone varchar(30) null
sms_consent boolean not null default false
sms_consent_at timestamptz null
status varchar(30) not null
created_at timestamptz not null
updated_at timestamptz not null
```

`cognito_subject` is the immutable ownership key derived from the validated token `sub` claim.
Never authorize ownership by email because email can change.

Keep profile, consent, order, and embroidery-request data in PostgreSQL. Do not overload Cognito
custom attributes with changing business data.

### Required API surface

```text
POST /api/auth/signup/start
POST /api/auth/signup/verify
POST /api/auth/login/start
POST /api/auth/login/verify
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/csrf
GET  /api/auth/me

GET   /api/account
PATCH /api/account/profile
GET   /api/account/orders
GET   /api/account/embroidery-requests
```

Start/verify responses must not reveal whether an arbitrary email already has an account. Apply
IP/email throttles at the application boundary in addition to Cognito protections. Keep guest
checkout and guest custom requests available.

### Spring implementation

1. Upgrade Spring Boot/Spring Security to a supported compatible 3.x release.
2. Add `spring-boot-starter-security`, OAuth2 resource-server/JWT support, and AWS SDK v2 Cognito
   Identity Provider client.
3. Add a production `SecurityFilterChain`, CSRF cookie/header integration, structured `401/403`
   responses, and strict same-origin CORS policy.
4. Implement Cognito configuration properties and validate them at startup when auth is enabled.
5. Implement sign-up/login start and challenge-completion services.
6. Validate access tokens through Cognito's issuer/JWKS and require access-token semantics rather
   than trusting an ID token as API authorization.
7. Add or update the local `app_users` record transactionally after verified sign-up/login.
8. Link authenticated orders and custom requests using the authenticated local user ID.
9. Add ownership checks at service/repository boundaries and explicit administrator endpoints.
10. Add integration tests for authentication, CSRF, token expiry/refresh, logout, and cross-user
    access attempts.

### React implementation

Replace the current `previewUser` state with an `AuthProvider` that:

- loads `/api/auth/me` when the application starts;
- calls the same-origin Spring endpoints with `credentials: "include"`;
- initializes and sends the CSRF header for state-changing requests;
- drives the existing login/sign-up dialog through `details`, `code`, `success`, and error states;
- never receives, decodes, or stores Cognito tokens;
- performs at most one automatic refresh attempt after an expired session;
- makes account/order/request routes render from backend authorization results.

Cognito sends a six-digit email OTP by default. Update the current prototype, which expects eight
digits, to the actual configured Cognito code format during integration.

### Delivery order

1. Terraform Cognito and SES in a non-production environment.
2. Add the local-user migration and repositories.
3. Add Spring Security, Cognito integration, cookies, CSRF, and integration tests.
4. Connect the existing React dialog and replace the preview account state.
5. Link new authenticated orders and custom requests to the local user.
6. Add account, order-history, and request-history pages.
7. Perform abuse, enumeration, cookie, CSRF, logout, and authorization testing.
8. Promote the same Terraform/application configuration to production.

### References

- Cognito passwordless authentication:
  <https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow-methods.html>
- Cognito pricing and feature tiers: <https://aws.amazon.com/cognito/pricing/>
- Cognito email delivery through SES:
  <https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-email.html>
- Spring Security JWT resource server:
  <https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html>
- Spring Security CSRF:
  <https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html>

## 28. Current implementation: application-owned passwordless email OTP

### Implemented customer flow

Signup asks for first name, optional last name and phone, email, and the same email a second time.
The backend rejects mismatched addresses, creates or updates a `PENDING` user, and sends an
four-digit code. Correct verification activates the user and signs them in.

Login asks for the email once and sends another four-digit code. There is no password to remember,
store, leak, or reset. Every login is proof that the customer currently controls the mailbox.

```text
React details form
    -> POST /api/auth/signup or /api/auth/login
Spring creates challenge + Gmail SMTP sends OTP
    -> React receives only challengeId
React submits code
    -> POST /api/auth/verify
Spring consumes code and returns only safe profile JSON
    -> HttpOnly access + refresh cookies are set by the response
```

### OTP security

- Codes are generated with Java `SecureRandom` and formatted as four digits.
- A code lasts ten minutes, permits five guesses, and is single-use.
- Only an HMAC-SHA256 digest is stored. The HMAC includes challenge ID, purpose, and code, so a
  digest cannot be reused for another challenge.
- The HMAC key comes from `AUTH_OTP_PEPPER`, outside PostgreSQL.
- Only the newest challenge for an email and purpose is valid.
- Requests have a 60-second cooldown, a five-per-email/15-minute limit, and a 30-per-source/hour
  limit. Source addresses are stored only as HMAC digests.
- Unknown login emails receive the same `202` response and a non-verifiable dummy challenge. No
  message is sent and the response does not reveal account existence.

### Browser session design

Successful verification creates two host-only cookies:

| Cookie | Contents | Lifetime | Purpose |
|---|---|---:|---|
| `tnb_access` | HS256 JWT | 15 minutes | Fast authenticated API checks |
| `tnb_refresh` | 256-bit opaque random value | 30 days | Obtain a new access JWT |

Both are `HttpOnly` and `SameSite=Lax`; production also sets `Secure`. React cannot read either
value. Nothing is stored in `localStorage` or `sessionStorage`.

The access JWT contains the immutable user UUID in `sub`, the configured issuer, trusted roles,
issue time, and expiry. Spring/Nimbus verifies its signature, issuer, and timestamps before adding
the authenticated identity to Spring Security.

The refresh token itself is never stored in PostgreSQL—only its SHA-256 digest is stored. Refresh
rotates it on every use: the old row is revoked and points to its replacement. Reuse of an already
rotated token revokes that entire token family, which protects against a copied refresh cookie.

Logout revokes the current refresh row and expires both cookies. The already-issued access JWT can
remain usable only until its short expiry, which is at most 15 minutes.

### CSRF protection

Cookies are attached automatically by browsers, so authenticated writes require a separate CSRF
token. React first calls `GET /api/auth/csrf`; Spring sets a readable `XSRF-TOKEN` cookie and returns
the matching header name/value. React supplies `X-XSRF-TOKEN` on refresh, logout, and profile
updates. The access and refresh cookies remain unreadable to JavaScript.

### Implemented database tables

Flyway migrations `V18` and `V19` add:

- profile, consent, verification, and last-login fields to `app_users`;
- `user_roles`, initially containing only `CUSTOMER` for public signups;
- `auth_email_challenges` with digests, purpose, expiry, attempts, source digest, and consumption;
- `auth_refresh_sessions` with token families, rotation links, expiry, and revocation;
- nullable `customer_orders.user_id` for later account-order ownership.

`custom_embroidery_requests.user_id` already existed. Linking new checkout and custom-request
submissions to a signed-in user is the next separate ownership feature.

### Implemented API

```text
POST  /api/auth/signup
POST  /api/auth/login
POST  /api/auth/verify
POST  /api/auth/refresh
POST  /api/auth/logout
GET   /api/auth/csrf
GET   /api/auth/me
PATCH /api/auth/me
```

### React integration

`AuthProvider` restores `/api/auth/me` at startup and performs one shared refresh attempt if the
access JWT expired. The shared promise prevents React Strict Mode from rotating the same refresh
cookie twice concurrently. The existing account menu now renders real server state, signup includes
email confirmation, code submission is real, profile edits persist, and logout revokes the session.

### Current email choice and future domain migration

Authentication currently reuses the working Gmail SMTP configuration. Delivery to junk remains a
known limitation, but it does not change the authentication protocol. When a domain is purchased,
replace the SMTP sender/configuration with an authenticated custom-domain provider such as SES and
publish SPF, DKIM, and DMARC. User accounts, challenges, endpoints, cookies, and React code do not
need to change.

### Required configuration

Generate independent secrets with `openssl rand -base64 48`:

```text
AUTH_EMAIL_ENABLED=true
AUTH_OTP_PEPPER=<random secret>
AUTH_JWT_SECRET=<different random secret>
AUTH_SECURE_COOKIES=false  # localhost only; true behind production HTTPS
```

The remaining lifetimes and limits have safe defaults in `application.yml` and are listed in
`.env.example`. Production secrets belong in SSM Parameter Store or Secrets Manager, not Git.

### Remaining work before production

- Set unique production OTP/JWT secrets and `AUTH_SECURE_COOKIES=true`.
- Keep port 8081 private behind Caddy and allow forwarded client headers only from that proxy.
- Add end-to-end browser tests using a controlled test mailbox.
- Add account order/request pages with repository-level ownership checks.
- Link signed-in checkouts and custom requests to the authenticated UUID without accepting a
  `user_id` from React.
- Add administrator endpoints only after explicit role and authorization tests exist.
- Move SMTP to the future authenticated domain to improve deliverability.

### Cost impact

There is no authentication-provider charge. It uses the existing Spring Boot process and
PostgreSQL database. Gmail SMTP is the current sender; later transactional email usage should still
cost only pennies at the expected volume.
