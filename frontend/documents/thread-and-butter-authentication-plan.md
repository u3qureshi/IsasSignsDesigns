# Thread & Butter Passwordless Authentication and Authorization Plan

> Status: frontend UI prototype implemented; backend authentication is **not implemented yet**  
> Created: 2026-07-25  
> Intended stack: React, Spring Boot, Spring Security, PostgreSQL, email one-time codes,
> short-lived JWT access tokens, rotating refresh sessions, HttpOnly cookies, and CSRF protection

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

The repository already has some useful foundations:

- Spring Boot `3.3.5`, Java 21, Gradle, Spring MVC, JPA, Flyway, PostgreSQL, and Spring Mail;
- a working SMTP email sender used by custom embroidery notifications;
- an `app_users` table created by `V2__custom_embroidery_requests.sql`;
- a nullable `custom_embroidery_requests.user_id` foreign key;
- React Router and the global `Header` component;
- no Spring Security dependency or security filter chain yet;
- no sign-up, sign-in, refresh, logout, account, session, or administrative endpoints;
- no JWT signing or verification implementation;
- no CSRF integration between React and Spring;
- no authentication or authorization rate limiting.

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
- ten-minute lifetime;
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

An initial practical limit can be:

- five code emails per normalized email per hour;
- twenty code requests per IP per hour;
- five guesses per issued challenge;
- exponential cooldown after repeated failures.

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

Recommended lifetime: ten minutes.

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
hash in `auth_sessions`. Rotate the value on every refresh. If an already-rotated token is reused,
revoke the entire token family because reuse may indicate theft.

Logout revokes the current refresh session and clears both cookies. **Sign out everywhere** revokes
all refresh sessions for that user. A ten-minute access JWT may remain usable until expiration
unless a deny-list or session-version check is introduced; sensitive operations should therefore
require recent email-code verification.

## 8. Cookie policy

Production authentication cookies:

```text
HttpOnly
Secure
SameSite=Lax
Path=/
no Domain attribute
```

Recommended production names:

```text
__Host-tnb_access
__Host-tnb_refresh
```

The `__Host-` prefix requires `Secure`, `Path=/`, and no `Domain`. Local development should use
environment-specific non-prefixed names if necessary.

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
- require CSRF for `POST`, `PUT`, `PATCH`, and `DELETE`;
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
created_at timestamptz
primary key (user_id, role)
```

Initially allow `CUSTOMER` and `ADMIN`.

### Add `auth_email_codes`

```text
id uuid primary key
normalized_email varchar(320) not null
user_id uuid null references app_users(id)
purpose varchar(30) not null
code_hmac char(64) not null
attempt_count integer not null default 0
max_attempts integer not null
expires_at timestamptz not null
consumed_at timestamptz null
invalidated_at timestamptz null
requested_ip_hmac char(64) null
user_agent varchar(500) null
created_at timestamptz not null
```

Purposes can initially include:

- `SIGNUP`
- `LOGIN`
- `CHANGE_EMAIL`
- `DELETE_ACCOUNT`

### Add `auth_sessions`

```text
id uuid primary key
user_id uuid not null references app_users(id)
token_family_id uuid not null
refresh_token_hash char(64) unique not null
user_agent varchar(500) null
ip_address_hmac char(64) null
created_at timestamptz not null
last_used_at timestamptz null
expires_at timestamptz not null
rotated_at timestamptz null
revoked_at timestamptz null
revoke_reason varchar(100) null
replacement_session_id uuid null
```

### Add `auth_audit_events`

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
POST /api/auth/signup/code
POST /api/auth/signup/verify
POST /api/auth/login/code
POST /api/auth/login/verify
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/csrf
GET  /api/auth/me
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

Proposed configuration:

```dotenv
AUTH_ENABLED=false
AUTH_CODE_HMAC_SECRET=
AUTH_CODE_LENGTH=8
AUTH_CODE_TTL_SECONDS=600
AUTH_CODE_MAX_ATTEMPTS=5
AUTH_CODE_RESEND_SECONDS=60

AUTH_JWT_ISSUER=https://api.your-production-domain.example
AUTH_JWT_AUDIENCE=thread-and-butter-web
AUTH_JWT_PRIVATE_KEY=
AUTH_JWT_PUBLIC_KEY=
AUTH_ACCESS_TOKEN_SECONDS=600
AUTH_REFRESH_TOKEN_SECONDS=2592000

AUTH_COOKIE_SECURE=false
AUTH_COOKIE_SAME_SITE=Lax
AUTH_ALLOWED_ORIGIN=http://localhost:5173
AUTH_IP_HMAC_SECRET=
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
10. **Production email provider?** Choose before customer launch; Gmail remains local-only.
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

## 26. Frontend UI prototype implemented on 2026-07-25

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
- The login prototype collects a valid email address and then shows an eight-digit email-code
  screen.
- The sign-up prototype collects required first name and email plus optional last name, numeric
  phone, and independent SMS consent, then shows the same code screen.
- Entering any eight digits intentionally activates a memory-only signed-in preview. No email,
  user record, JWT, refresh session, or cookie is created yet.
- The preview account menu contains **Account settings**, **My embroidery requests**, **My
  orders**, and **Sign out**. The request/order links are visibly marked **Soon** until their
  authenticated pages exist.
- Account settings can be previewed and edited in React state for the current page session only.
- The larger **Passwordless account** label sits beside the email/key icon to reduce vertical
  space in the login and sign-up cards.
- Reduced-motion browser preferences are respected by collapsing the transition duration.

The next implementation step remains the real backend phases: schema migrations, Spring Security,
email challenge issuance/verification, JWT access cookies, rotating refresh sessions, CSRF, and an
`AuthProvider` that replaces this temporary in-memory preview state.
