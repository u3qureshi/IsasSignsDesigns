-- uuid_generate_v4() is used by the original schema migrations.
-- Declaring the extension here makes a brand-new PostgreSQL database reproducible.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
