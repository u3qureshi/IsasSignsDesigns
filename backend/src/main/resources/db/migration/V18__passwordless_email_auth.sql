ALTER TABLE app_users
    ADD COLUMN first_name varchar(80),
    ADD COLUMN last_name varchar(80),
    ADD COLUMN sms_consent boolean NOT NULL DEFAULT false,
    ADD COLUMN last_login_at timestamptz;

UPDATE app_users
SET first_name = left(coalesce(nullif(trim(full_name), ''), 'Customer'), 80)
WHERE first_name IS NULL;

ALTER TABLE app_users
    ALTER COLUMN first_name SET NOT NULL;

CREATE TABLE user_roles (
    user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    role varchar(40) NOT NULL,
    PRIMARY KEY (user_id, role)
);

INSERT INTO user_roles (user_id, role)
SELECT id, 'CUSTOMER'
FROM app_users
ON CONFLICT DO NOTHING;

CREATE TABLE auth_email_challenges (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES app_users(id) ON DELETE CASCADE,
    normalized_email varchar(320) NOT NULL,
    purpose varchar(20) NOT NULL,
    code_digest char(64) NOT NULL,
    request_ip_digest char(64) NOT NULL,
    expires_at timestamptz NOT NULL,
    attempts integer NOT NULL DEFAULT 0,
    max_attempts integer NOT NULL,
    consumed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT auth_email_challenge_purpose_check
        CHECK (purpose IN ('SIGNUP', 'LOGIN')),
    CONSTRAINT auth_email_challenge_attempts_check
        CHECK (attempts >= 0 AND max_attempts > 0)
);

CREATE INDEX idx_auth_email_challenges_email_created
    ON auth_email_challenges (normalized_email, created_at DESC);
CREATE INDEX idx_auth_email_challenges_ip_created
    ON auth_email_challenges (request_ip_digest, created_at DESC);
CREATE INDEX idx_auth_email_challenges_user
    ON auth_email_challenges (user_id);

CREATE TABLE auth_refresh_sessions (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    family_id uuid NOT NULL,
    token_digest char(64) NOT NULL UNIQUE,
    user_agent_digest char(64),
    expires_at timestamptz NOT NULL,
    last_used_at timestamptz,
    revoked_at timestamptz,
    replaced_by_session_id uuid REFERENCES auth_refresh_sessions(id),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_auth_refresh_sessions_user
    ON auth_refresh_sessions (user_id, created_at DESC);
CREATE INDEX idx_auth_refresh_sessions_family
    ON auth_refresh_sessions (family_id);

ALTER TABLE customer_orders
    ADD COLUMN user_id uuid REFERENCES app_users(id);

CREATE INDEX idx_customer_orders_user_created
    ON customer_orders (user_id, created_at DESC);
