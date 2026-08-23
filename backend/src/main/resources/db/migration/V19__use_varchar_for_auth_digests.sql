ALTER TABLE auth_email_challenges
    ALTER COLUMN code_digest TYPE varchar(64),
    ALTER COLUMN request_ip_digest TYPE varchar(64);

ALTER TABLE auth_refresh_sessions
    ALTER COLUMN token_digest TYPE varchar(64),
    ALTER COLUMN user_agent_digest TYPE varchar(64);
