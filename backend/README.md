# IsaSigns Backend (minimal)

This folder contains a minimal Spring Boot backend scaffold and a Postgres Docker Compose file to store products as data.

Quick start (requires Docker and Java 21 for running the Spring Boot app):

1. Start Postgres locally with Docker Compose:

```bash
cd backend
docker compose up -d
```

This will create a database `isa_products` and run `init.sql` to seed some sample products.

2. Run the Spring Boot app (from project root `backend`):

```bash
./gradlew bootRun
```

The API will be available at `http://localhost:8081/api/products`.

OpenAPI / Swagger docs:
- Swagger UI: `http://localhost:8081/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8081/v3/api-docs`
- OpenAPI YAML: `http://localhost:8081/v3/api-docs.yaml`

Generated specs are also exported to:
- `docs/openapi.json`
- `docs/openapi.yaml`

Notes:
- `init.sql` contains example products. Add rows to the `products` table to manage what's displayed without changing frontend code.
- Images in the sample `images` JSON are placeholders and assume assets will be served from the frontend `public` folder.

## Guest checkout with Stripe

Checkout uses Stripe-hosted Checkout. Card details never pass through this application. The backend recalculates every product price from PostgreSQL, creates a pending order, and only marks it paid after a signed Stripe webhook arrives.

1. Create or open a Stripe account and switch the Dashboard to **Test mode**.
2. Copy the test secret key (`sk_test_...`) into `backend/.env` as `STRIPE_SECRET_KEY`.
3. Install and sign in to the Stripe CLI, then forward test webhooks:

```bash
stripe login
stripe listen --forward-to localhost:8081/api/checkout/webhooks/stripe
```

4. Copy the command's `whsec_...` signing secret into `backend/.env` as `STRIPE_WEBHOOK_SECRET` and restart the backend.
5. Add a product to the cart and choose **Secure checkout**. On Stripe's test page use:

```text
Card: 4242 4242 4242 4242
Expiry: any future date, such as 12/34
CVC: any three digits
Postal code: any valid-looking Canadian postal code
```

No card is charged in test mode. Stripe also provides test cards for declines, authentication, and other outcomes. Keep `CHECKOUT_AUTOMATIC_TAX_ENABLED=false` until Stripe Tax is configured and the business's GST/HST registration requirements are confirmed.

Before production, replace both Stripe values with live-mode secrets, register the production webhook URL in Stripe, set `STOREFRONT_URL` to the public HTTPS site, and perform a final low-value live transaction and refund.
