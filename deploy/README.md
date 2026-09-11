# Production deployment stack

This folder runs the recruiter-facing Thread & Butter deployment as three containers on one EC2
instance.

```text
Internet -> Caddy (80/443) -> static React files
                         \-> /api/* -> Spring Boot (private)
                                           \-> PostgreSQL (private)
```

## What each file does

- `compose.yml` defines the container network, volumes, health checks, memory limits, and restart
  behavior.
- `Caddyfile` serves the Vite build, adds security headers, obtains HTTPS certificates when
  `SITE_ADDRESS` is a real domain, and proxies `/api/*` to Spring Boot.
- `production.env.example` documents every deployment setting without containing real secrets.
- `scripts/bootstrap-ubuntu.sh` installs Docker and adds swap to a new 1 GB Ubuntu EC2 host.
- `scripts/configure-production-host.sh` reads encrypted runtime integrations from Parameter Store,
  creates independent application secrets, writes the private EC2 environment file, and performs
  the first deployment.
- `scripts/deploy.sh` pulls immutable images, starts them, and waits for all three Docker health
  checks.
- `scripts/rollback.sh` restores the image references that were running before the latest deploy.
- `scripts/local-smoke-test.sh` builds and exercises the production stack locally, then stops it.

## Local production smoke test

1. Copy `local.env.example` to `local.env`.
2. Use long local-only values for the database, JWT, OTP, and HMAC secrets.
3. Keep `SITE_ADDRESS=:80`, `HTTP_PORT=8080`, and `AUTH_SECURE_COOKIES=false`.
4. Set the public `VITE_CLOUDINARY_CLOUD_NAME` value.
5. Run:

   ```bash
   ./scripts/local-smoke-test.sh
   ```

The script verifies Caddy, the React fallback, the Spring API, PostgreSQL readiness, and that
Swagger is unavailable in the `prod` Spring profile.

The first clean-database test also verifies that Flyway can build the complete schema without a
manually prepared PostgreSQL instance. This caught and fixed the previously implicit UUID extension
and product-table setup.

## EC2 production differences

- Use the real domain for `SITE_ADDRESS` and `STOREFRONT_URL`.
- Set `AUTH_SECURE_COOKIES=true` and use independent randomly generated secrets.
- Use immutable ECR image references such as `repository@sha256:...`.
- Set `HTTP_PORT=80` and `HTTPS_PORT=443`; Caddy needs both publicly reachable to obtain and renew
  the domain certificate.
- Never expose ports 8081 or 5432 in the EC2 security group.
- Permit public inbound traffic only on ports 80 and 443. Administration will be configured
  separately rather than exposing database or Docker ports.
- Preserve the `postgres_data` and `caddy_data` volumes during ordinary deployments.

The first AWS deployment uses `/threadandbutter/prod/*` SecureString parameters. The instance role
can read only that application path; secret values are never stored in Git or baked into images.

## Why swap and limits are both used

Container memory limits stop one process from consuming the whole host. Swap is a last-resort
safety buffer for short startup peaks; it is not a replacement for RAM. If the application uses
swap continuously or restarts because of memory pressure, resize EC2 to a 2 GB instance.
