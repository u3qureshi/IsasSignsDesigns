# Backend Overview (Current State)

Last updated: 2026-02-23

This file documents what is actually implemented in the backend right now, what is partially complete, and what should be done next.

## 1) What has been built

- Postgres local environment via Docker Compose (DB: `isa_sd`)
- SQL bootstrap for schema + sample seed data (15 products total)
- Spring Boot backend scaffold with JPA and Postgres driver (Java 21, Gradle 9.3.1)
- Product read APIs:
  - `GET /api/products`
  - `GET /api/products?category=<category>` (case-insensitive)
  - `GET /api/products/{slug}`
- OpenAPI/Swagger documentation via springdoc-openapi
- `ProductResponse` DTO fully decoupled from JPA entity
- Proper HTTP 404 for missing slugs
- 10 Kids category products seeded with `long_description`, `tags`, `is_customizable` data

## 2) Current backend flow

1. Frontend calls product endpoint
2. Controller uses JPA repository
3. Repository reads active products from `products` table
4. JSON response is returned to frontend

## 3) Endpoints currently available

Base URL (local): `http://localhost:8081`

- `GET /api/products`
  - Returns all active products (`is_active = true`)

- `GET /api/products?category=Kids`
  - Returns active products for the given category — **case-insensitive** (`kids`, `Kids`, and `KIDS` all return the same results)

- `GET /api/products/{slug}`
  - Returns one active product by slug
  - Returns HTTP 404 if no active product exists with that slug

## 4) Product schema currently used

Table: `products` (DB: `isa_sd`, schema: `public`)

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NOT NULL | `uuid_generate_v4()` | Primary key |
| `slug` | `varchar(255)` | NOT NULL | — | Unique; used in frontend routes |
| `name` | `varchar(255)` | NOT NULL | — | Display name |
| `description` | `text` | NULL | — | Short description for cards/previews |
| `long_description` | `text` | NULL | — | Full description for product detail pages |
| `category` | `varchar(100)` | NULL | — | Filter label (e.g. `Kids`, `Home Decor`) |
| `price_cents` | `bigint` | NOT NULL | `0` | Price in minor units — `$34.99` → `3499` |
| `currency` | `varchar(10)` | NOT NULL | `'CAD'` | Currency code |
| `images` | `text` | NULL | — | JSON string: `["/img/1.jpg"]` |
| `material` | `varchar(100)` | NULL | — | e.g. `wood`, `acrylic`, `metal` |
| `is_active` | `bool` | NOT NULL | `true` | Soft hide flag |
| `is_featured` | `bool` | NOT NULL | `false` | Drives Best Sellers / homepage highlights |
| `stock_qty` | `integer` | NULL | — | `null` = untracked; set to enable inventory |
| `is_customizable` | `bool` | NOT NULL | `false` | Whether product accepts personalization |
| `tags` | `text[]` | NOT NULL | `ARRAY[]` | Used for filtering and search |
| `created_at` | `timestamptz` | NULL | `now()` | Record creation time |
| `updated_at` | `timestamptz` | NULL | `now()` | Last modified time |

## 5) Categories in navigation vs products

Navigation categories:
- Best Sellers
- Ramadan Decor
- Wall Art
- Home Decor
- Kids
- Business/Events
- FAQ

Seeded product categories currently include:
- Ramadan Decor
- Wall Art
- Home Decor
- Kids (11 products)
- Business/Events

Notes:
- `FAQ` is content — should not be in `products`
- `Best Sellers` is driven by `is_featured = true` on any product across any category; not a stored category value

## 6) Class-by-class responsibilities and what each line is doing

---

### `IsasignsBackendApplication.java`

```
package com.isasigns.backend;
```
Package declaration — organises this file inside the `com.isasigns.backend` namespace.

```java
@SpringBootApplication
```
This single annotation is doing three things in one:
1. `@Configuration` — marks this class as a source of Spring `@Bean` definitions
2. `@EnableAutoConfiguration` — tells Spring Boot to scan the classpath and wire up Postgres, JPA, Jackson, web MVC, etc. automatically without any XML config
3. `@ComponentScan` — tells Spring to scan every class under `com.isasigns.backend` and register anything annotated with `@Component`, `@Service`, `@Repository`, `@Controller`, `@RestController` as a managed bean

```java
SpringApplication.run(IsasignsBackendApplication.class, args);
```
Starts the embedded Tomcat web server, connects to Postgres, runs Hibernate schema validation, then begins accepting HTTP requests.

---

### `model/Product.java` — JPA Entity

Responsibility: Be the in-memory Java representation of one row in the `products` table. It is a direct 1-to-1 mirror of the DB schema. Its only job is to hold data; it has no business logic.

```java
@Entity
@Table(name = "products")
```
`@Entity` tells Hibernate "this class maps to a DB table". `@Table(name = "products")` tells it which table. Without `@Table`, Hibernate would default to looking for a table called `product` (lowercase class name).

```java
@Id
@Column(columnDefinition = "uuid")
private UUID id;
```
`@Id` = this field is the primary key. `columnDefinition = "uuid"` tells Hibernate to use Postgres's native `uuid` type instead of `varchar`. `UUID` in Java maps to `uuid` in Postgres.

```java
@Column(unique = true, nullable = false)
private String slug;
```
Hibernate enforces at the Java layer that slug must exist. The DB schema independently also enforces this, so you get two layers of protection.

```java
@Column(columnDefinition = "text")
private String images; // JSON array stored as text
```
This is the key awkward field. The DB stores image URLs as a raw JSON string, e.g. `["/img/1.jpg","/img/2.jpg"]`. Postgres does not automatically deserialize this into a Java `List`. So it arrives in Java as a plain `String`. The transformation to a real `List<String>` happens later in the controller.

```java
@Column(name = "long_description", columnDefinition = "text")
private String longDescription;

@Column(name = "is_featured", nullable = false)
private Boolean isFeatured = false;

@Column(name = "stock_qty")
private Integer stockQty;

@Column(name = "is_customizable", nullable = false)
private Boolean isCustomizable = false;

@Column(columnDefinition = "text[]")
private String[] tags = new String[0];
```
Five additional fields added to match the full DB schema. `tags` maps to Postgres `text[]` and is stored as a `String[]` in Java — the controller converts it to `List<String>` when building the DTO so the API response always exposes a clean JSON array.

```java
@PrePersist
public void prePersist() { ... }

@PreUpdate
public void preUpdate() { ... }
```
JPA lifecycle hooks. `@PrePersist` runs automatically just before a new entity is saved to the DB (INSERT). `@PreUpdate` runs before an UPDATE. They auto-assign `createdAt` and `updatedAt` timestamps so you never have to remember to set them manually.

What `Product.java` is NOT responsible for:
- It does not know about HTTP
- It does not know about what the API response shape looks like
- It does not transform `images` from a string into a list

---

### `repository/ProductRepository.java` — Spring Data JPA Repository

Responsibility: Be the only place in the codebase that talks to the DB. It translates method calls into SQL queries.

```java
public interface ProductRepository extends JpaRepository<Product, UUID>
```
This is an interface, not a class. Spring generates a real implementation at runtime. `JpaRepository<Product, UUID>` means: work with `Product` entities, where the primary key type is `UUID`. By extending this, you get many free methods: `findById()`, `findAll()`, `save()`, `delete()`, etc.

```java
List<Product> findByCategoryIgnoreCaseAndIsActiveTrue(String category);
```
Spring reads the method name and generates this SQL automatically:
```sql
SELECT * FROM products WHERE LOWER(category) = LOWER(?) AND is_active = true
```
The `IgnoreCase` token tells Spring to apply a case-insensitive comparison, so `kids`, `Kids`, and `KIDS` all match rows where `category = 'Kids'`.

```java
List<Product> findByIsActiveTrue();
```
Generates: `SELECT * FROM products WHERE is_active = true`

```java
Optional<Product> findBySlugAndIsActiveTrue(String slug);
```
Generates: `SELECT * FROM products WHERE slug = ? AND is_active = true`
Returns `Optional<Product>` — a container that either holds a `Product` or is empty. This forces the caller (controller) to explicitly handle the case where nothing was found, preventing null pointer exceptions.

What `ProductRepository.java` is NOT responsible for:
- It does not transform data
- It does not know about HTTP status codes
- It does not know about DTOs or API response shapes

---

### `dto/ProductResponse.java` — Data Transfer Object

Responsibility: Define exactly what fields are exposed in the HTTP response JSON. It is the public API contract, deliberately separate from the DB entity.

```java
public record ProductResponse(...) {}
```
A Java `record` (added in Java 16) is an immutable data class. It auto-generates: constructor, `getters`, `equals()`, `hashCode()`, `toString()`. You cannot accidentally mutate a `ProductResponse` after it is created.

Why separate from `Product.java`?
- If you add a sensitive internal column to the DB (e.g. `vendor_cost_cents`), it will NOT automatically leak into the API because `ProductResponse` only has the fields you explicitly include
- You can rename DB columns without changing the API response field names
- You can add computed fields (e.g. `priceFormatted: "$34.99"`) without touching the DB schema

Current fields exposed in the API response:
`id`, `slug`, `name`, `description`, `longDescription`, `category`, `priceCents`, `currency`, `images` (as `List<String>`), `material`, `isActive`, `isFeatured`, `stockQty`, `isCustomizable`, `tags` (as `List<String>`), `createdAt`, `updatedAt`

```java
List<String> images
```
Unlike `Product.java` which stores `String images` (raw JSON), `ProductResponse` stores a proper `List<String>`. The conversion from raw string → real list happens in the controller before this record is constructed.

```java
List<String> tags
```
`Product.java` stores `String[] tags` (Postgres `text[]` arrives as a Java array). `ProductResponse` exposes it as `List<String>` via `Arrays.asList(product.getTags())` in the controller.

```java
@Schema(description = "Price in minor units (cents)", example = "3499")
Long priceCents
```
`@Schema` is an OpenAPI annotation. It has zero effect at runtime — it is purely metadata that springdoc reads to generate the API documentation. Same for every other `@Schema` annotation in this file.

---

### `controller/ProductController.java` — REST Controller

Responsibility: Receive HTTP requests, orchestrate the work (call repository, transform data), and return the HTTP response. It is the only class that knows about HTTP verbs, URL paths, status codes, and request/response formats.

```java
@RestController
```
Combines `@Controller` + `@ResponseBody`. The `@ResponseBody` part tells Spring: do not render an HTML template, instead serialize the return value of every method directly to JSON and put it in the HTTP response body. Jackson is what actually does the JSON serialization.

```java
@RequestMapping("/api/products")
```
All routes in this controller are prefixed with `/api/products`.

```java
private final ProductRepository repo;
private final ObjectMapper objectMapper = new ObjectMapper();

public ProductController(ProductRepository repo) {
    this.repo = repo;
}
```
The repository is injected via constructor injection. Spring sees the constructor parameter, finds the `ProductRepository` bean it already created, and passes it in. `ObjectMapper` is Jackson's main class for converting between Java objects and JSON strings.

```java
@GetMapping
public List<ProductResponse> list(@RequestParam(required = false) String category)
```
`@GetMapping` maps `GET /api/products` to this method. `@RequestParam` reads `?category=` from the URL query string. `required = false` means the parameter is optional — if omitted, `category` is `null`.

```java
if (category != null && !category.isBlank()) {
    return repo.findByCategoryIgnoreCaseAndIsActiveTrue(category).stream().map(this::toResponse).toList();
}
return repo.findByIsActiveTrue().stream().map(this::toResponse).toList();
```
Branch logic: if category was provided use the filtered query, otherwise return everything. The `IgnoreCase` query means `?category=kids` and `?category=Kids` return the same results. `.stream().map(this::toResponse).toList()` converts every `Product` entity into a `ProductResponse` DTO using the private `toResponse()` method.

```java
@GetMapping("/{slug}")
public ProductResponse bySlug(@PathVariable String slug)
```
`@GetMapping("/{slug}")` maps `GET /api/products/ramadan-lantern` to this method. `@PathVariable` extracts `ramadan-lantern` from the URL path and passes it as the `slug` argument.

```java
Product product = repo.findBySlugAndIsActiveTrue(slug)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
```
`orElseThrow` unwraps the `Optional`. If the Optional is empty (no product with that slug), it throws `ResponseStatusException` with `404 NOT_FOUND`. Spring catches this exception and converts it into an HTTP 404 response automatically.

```java
private ProductResponse toResponse(Product product) {
    return new ProductResponse(
        product.getId(),
        ...
        parseImages(product.getImages()),
        ...
        java.util.Arrays.asList(product.getTags()),
        ...);
}
```
This is the mapping step — converts a `Product` JPA entity into a `ProductResponse` DTO. Two key transformations:
1. `parseImages(product.getImages())` — converts the raw JSON string into a `List<String>`
2. `Arrays.asList(product.getTags())` — converts the `String[]` Postgres array into a `List<String>`

```java
private List<String> parseImages(String imagesJson) {
    if (imagesJson == null || imagesJson.isBlank()) {
        return Collections.emptyList();
    }
    try {
        return objectMapper.readValue(imagesJson, new TypeReference<List<String>>() {});
    } catch (IOException e) {
        return List.of(imagesJson);
    }
}
```
`objectMapper.readValue(imagesJson, new TypeReference<List<String>>(){})` takes the raw string `"[\"/img/1.jpg\",\"/img/2.jpg\"]"` and deserializes it into a real `List<String>`. The `TypeReference` is needed because Java's generics are erased at runtime — without it, Jackson wouldn't know what type to put inside the list. The `catch` block is a safety net: if the DB somehow has malformed data, return the raw string as a single-item list instead of crashing.

---

### `config/OpenApiConfig.java` — OpenAPI Metadata

Responsibility: Provide global metadata for the generated API spec. This file has zero effect on runtime behaviour — it only controls what appears at the top of the Swagger UI page and in the exported JSON/YAML spec.

```java
@Configuration
```
Tells Spring this class is a source of configuration. Spring will pick it up during boot scan.

```java
@OpenAPIDefinition(info = @Info(title = "Isa's Signs & Designs API", ...), servers = {...})
```
springdoc reads this annotation when it generates the spec. The `servers` array tells Swagger UI what the base URL is, so the "Try it out" button knows where to send requests.

---

## 7) Full data transformation flow

This is the complete journey of data from a browser request all the way to the JSON response, with what transforms at each step.

```
Browser / Frontend
      |
      |  HTTP GET /api/products?category=Home%20Decor
      |
      v
[Embedded Tomcat HTTP Server]
      |
      |  Parses raw HTTP bytes into a Java HttpServletRequest object
      |
      v
[Spring MVC DispatcherServlet]
      |
      |  Looks at the URL path + HTTP method, finds @GetMapping on ProductController.list()
      |  Reads ?category= query param, creates String category = "Home Decor"
      |
      v
[ProductController.list(category)]
      |
      |  Calls repo.findByCategoryIgnoreCaseAndIsActiveTrue("Home Decor")
      |
      v
[ProductRepository — Spring-generated SQL]
      |
      |  Generates and runs:
      |  SELECT * FROM products WHERE LOWER(category) = LOWER('Home Decor') AND is_active = true
      |
      v
[Postgres DB — products table]
      |
      |  Returns raw DB rows:
      |  id: uuid, slug: text, name: text, images: '["img1.jpg"]'  <-- images is a plain string
      |
      v
[Hibernate / JPA]
      |
      |  Maps each row into a Product Java object
      |  Product.images = "[\"/img/1.jpg\"]"  <-- still a raw String, not a List yet
      |  Product.tags   = String[]{"wood","kids"} <-- Postgres text[] mapped to Java String[]
      |
      v
[Back in ProductController.list()]
      |
      |  .stream().map(this::toResponse).toList()
      |  For each Product, calls toResponse() which calls parseImages()
      |
      v
[parseImages(String imagesJson)]
      |
      |  TRANSFORMATION: "[\"/img/1.jpg\"]"  -->  List.of("/img/1.jpg")
      |  objectMapper.readValue() deserializes the JSON string into a real Java List
      |
      v
[new ProductResponse(id, slug, name, ..., images as List<String>, ..., tags as List<String>, ...)]
      |
      |  images field is now a proper list, not a string
      |  tags field is now a List<String>, not a String[]
      |  Product entity is no longer referenced — only the DTO exists from here
      |
      v
[Jackson ObjectMapper — auto-invoked by @RestController]
      |
      |  Serializes List<ProductResponse> to JSON string:
      |  [{"id":"...","slug":"...","images":["/img/1.jpg"],...}]
      |  Note: dates formatted as ISO-8601 strings (not timestamps) because of
      |  write-dates-as-timestamps: false in application.yml
      |
      v
[HTTP Response — 200 OK]
      |
      |  Content-Type: application/json
      |  Body: JSON array
      |
      v
Browser / Frontend
```

### What transforms at each step (summary table)

| Step | Input | Output | Who does it |
|---|---|---|---|
| HTTP parsing | Raw bytes | `HttpServletRequest` | Tomcat |
| Route matching + param binding | URL path + query string | Java method arguments | Spring MVC |
| SQL query (category) | `"kids"` (any case) | `WHERE LOWER(category) = LOWER(?)` | Spring Data + Postgres |
| SQL query (all) | method call | `WHERE is_active = true` | Spring Data + Postgres |
| Row → Entity | DB row | `Product` Java object (`images` = String, `tags` = String[]) | Hibernate |
| Entity → DTO | `Product` entity | `ProductResponse` (`images` = List\<String\>, `tags` = List\<String\>) | `ProductController.toResponse()` |
| Image JSON parse | `"[\"/img/1.jpg\"]"` String | `List.of("/img/1.jpg")` | `parseImages()` via Jackson `ObjectMapper` |
| Tags array convert | `String[]` | `List<String>` | `Arrays.asList(product.getTags())` |
| DTO → JSON | `ProductResponse` Java object | JSON string | Jackson (auto) |
| HTTP response | JSON string | HTTP 200 + body | Tomcat |

### What happens on a 404 (slug not found)

```
curl /api/products/does-not-exist
                   |
                   v
  repo.findBySlugAndIsActiveTrue("does-not-exist")
                   |
                   v
  Postgres returns 0 rows → Hibernate returns Optional.empty()
                   |
                   v
  .orElseThrow() fires
  throws ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found")
                   |
                   v
  Spring MVC catches the exception
  Writes HTTP 404 response with {"status":404,"error":"Not Found","message":"Product not found"}
```

---

## 8) Non-Java infrastructure files

- `docker-compose.yml` — Starts Postgres 15 on `localhost:5432`. DB name is `isa_sd`. Mounts `init.sql` as an init script that runs once on first container boot. The `version:` top-level key causes a harmless deprecation warning (Compose v2 style).
- `init.sql` — Creates the full `products` table schema (including all new columns: `long_description`, `is_featured`, `stock_qty`, `is_customizable`, `tags`) with `IF NOT EXISTS`. Seeds 5 original products and 10 Kids category products with `ON CONFLICT DO NOTHING` so re-running never duplicates rows.
- `build.gradle` — Defines Java 21 toolchain, Spring Boot 3.3.5, springdoc-openapi 2.6.0, JPA, and PostgreSQL driver dependencies.
- `application.yml` — Runtime config: JDBC URL pointing at `isa_sd`, DB credentials, server port `8081`, `ddl-auto: validate` (Hibernate checks the schema matches entities but never modifies it), and `write-dates-as-timestamps: false` (forces ISO-8601 date strings in JSON instead of epoch numbers).

---

## 9) Known issues right now

- `docker-compose.yml` has a deprecated top-level `version:` key — causes a warning on `docker compose up`, harmless, safe to remove
- CORS is not configured — the frontend Vite dev server (different port) will be blocked by the browser when calling `http://localhost:8081`; needs a `WebMvcConfigurer` CORS bean before frontend API integration works
- `docs/openapi.json` and `docs/openapi.yaml` are stale — they were exported before the new columns and Kids products were added; need a fresh export after any API contract change
- `ddl-auto: validate` will throw at boot if the DB schema drifts from the entity classes — no migration tooling (Flyway/Liquibase) yet
- `open-in-view` warning on startup — `spring.jpa.open-in-view` should be explicitly set to `false` in `application.yml` to suppress the warning and avoid unintended lazy-load queries during response rendering

## 10) How to run database

```bash
cd backend
docker compose up -d
docker compose ps
```

Open Postgres shell in container:

```bash
docker exec -it isasigns_db psql -U isa_user -d isa_sd
```

Useful SQL checks:

```sql
\dt
SELECT slug, name, category, price_cents, is_active FROM products;
SELECT slug, category, is_customizable, tags FROM products WHERE category = 'Kids';
```

Reset DB and re-seed (nukes all data, re-runs `init.sql`):

```bash
docker compose down -v
docker compose up -d
```

## 11) How to run backend API

```bash
cd backend
./gradlew bootRun
```

Quick API checks:

```bash
curl "http://localhost:8081/api/products"
curl "http://localhost:8081/api/products?category=Home%20Decor"
curl "http://localhost:8081/api/products/ramadan-lantern"
```

## 12) Immediate next backend tasks

Already complete:
- ✅ Gradle wrapper generated and working
- ✅ `ProductResponse` DTO decoupled from entity
- ✅ HTTP 404 via `ResponseStatusException`
- ✅ Case-insensitive category filter (`findByCategoryIgnoreCaseAndIsActiveTrue`)
- ✅ New schema columns: `long_description`, `is_featured`, `stock_qty`, `is_customizable`, `tags`
- ✅ 10 Kids products seeded with full descriptions, prices, and tags
- ✅ OpenAPI/Swagger UI live

Still needed:
1. **CORS config** — add `WebMvcConfigurer` bean to allow requests from the Vite dev server (unblocks frontend integration entirely)
2. **Wire frontend** — replace skeleton pages with `fetch` calls to the API; render product cards per category
3. **Product detail page** — `/product/:slug` route on the frontend calling `GET /api/products/{slug}`
4. **Best Sellers endpoint** — `GET /api/products?featured=true` using `is_featured = true`
5. **DB migration tooling** — add Flyway or Liquibase so schema changes are versioned and tracked
6. **Re-export OpenAPI spec** — `docs/openapi.json` and `docs/openapi.yaml` are stale and need a fresh export

## 13) API Documentation (OpenAPI)

Springdoc is enabled and currently generating endpoint docs from controller annotations and DTO schemas.

- Swagger UI: `http://localhost:8081/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8081/v3/api-docs`
- OpenAPI YAML: `http://localhost:8081/v3/api-docs.yaml`

Versioned exports in repo (currently stale — need re-export after the new schema columns and Kids products were added):
- `docs/openapi.json`
- `docs/openapi.yaml`

To re-export while the backend is running:
```bash
curl -s http://localhost:8081/v3/api-docs | python3 -m json.tool > backend/docs/openapi.json
curl -s http://localhost:8081/v3/api-docs.yaml > backend/docs/openapi.yaml
```

What is documented now:
- Endpoint summaries/descriptions (`@Operation`)
- Query/path parameter descriptions (`@Parameter`) — category updated to note case-insensitive
- Response status metadata and examples (`@ApiResponses`, `@ExampleObject`)
- All `ProductResponse` fields with `@Schema` annotations including the 5 new fields (`longDescription`, `isFeatured`, `stockQty`, `isCustomizable`, `tags`)
