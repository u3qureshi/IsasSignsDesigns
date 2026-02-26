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
