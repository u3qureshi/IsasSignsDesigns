# Isa's Signs & Designs — Complete Project Handover

> Living technical, product, design, operational, and historical record.
>
> Created: 2026-07-19  
> Repository audited at: `/Users/u3quresh/Desktop/isa-signs-designs`  
> Branch audited: `main`  
> Intended audience: the owner/developer and any future human or AI development agent

---

## 1. Purpose of this document

This is the canonical handover for the Isa's Signs & Designs ecommerce project. It consolidates:

- the supplied Copilot project handoff and previous-chat summary;
- the original project status/execution plan;
- the backend overview;
- the products-table data dictionary;
- Git history;
- the actual frontend and backend source currently present in the repository;
- the current uncommitted working tree;
- setup, run, test, database, API, media, and operating procedures;
- past design decisions, including approaches that were tried and deliberately abandoned;
- known gaps, inconsistencies, risks, and the recommended next sequence of work;
- an append-only template for daily or per-agent updates.

The repository is the source of truth when older notes conflict with current code. Historical statements are retained as history, but they are not silently treated as current facts.

### How to maintain this handover

1. Update the **Executive summary** and **current capability matrix** when a major capability changes.
2. Append a dated entry to **Development Journal / Daily Handoffs** after every meaningful work session.
3. Record schema changes in the database section and in `backend/init.sql` or, once introduced, a migration.
4. Record API changes in the contract section and regenerate OpenAPI exports.
5. Mark planned items complete; do not delete their history.
6. Distinguish clearly between implemented, partially implemented, planned, and verified behavior.
7. Never paste credentials, tokens, webhook secrets, or private keys into this file.

---

## 2. Executive summary

Isa's Signs & Designs is a Canada-based, small-business storefront for handmade laser-cut, engraved, personalized, Islamic, children's, event, and business products. The intended system is a fast, premium-feeling, Canada-first ecommerce site whose product catalog is controlled by data rather than hardcoded frontend content.

The project is currently an early catalog MVP, not a functioning ecommerce store.

### What is implemented now

- React/TypeScript/Vite/Tailwind frontend shell.
- Global two-level header, promotional bar, navigation, branding, and global footer.
- React Router routes for the primary catalog navigation.
- A completed FAQ content page with 17 questions across five sections.
- Shared API-driven category pages for Kids, Wall Art, Business/Events, legacy Home Decor, all Embroidery submenus, and all Printing submenus, with loading, error, and empty states.
- An API-driven Best Sellers page using the cross-category `is_featured` flag.
- Product cards with Cloudinary URL generation, fallback images, per-card image dots, hover zoom, regular/sale price rendering, and detail-page navigation.
- An in-progress product detail page with image gallery, thumbnails, price/sale rendering, tags, customization messaging, detail/specification accordions, and a UI-only question form.
- Java 21/Spring Boot/PostgreSQL backend scaffold.
- Active-product listing, case-insensitive category filtering, and active-product lookup by slug.
- JPA entity-to-DTO separation.
- HTTP 404 handling for a missing/inactive slug.
- OpenAPI/Swagger generation.
- Docker Compose PostgreSQL environment and an idempotent initial seed script.
- A 15-product seed catalog: 11 Kids products and one product in each of four other categories.
- Product data fields for descriptions, feature flags, inventory, customization, tags, and JSONB sale configuration.

### What is not implemented

- A real homepage.
- Complete merchandising content for every category; the page infrastructure exists, but empty categories still require matching database products and verified images.
- Search behavior despite two visible search controls.
- Mobile navigation.
- Cart state, cart page, cart persistence, or working cart button.
- Checkout, Stripe integration, orders, webhooks, inventory reservation, fulfillment, or order tracking.
- Login/accounts or authentication.
- Product customization controls.
- Admin catalog management.
- A backend for the Ask a Question form; the current success message is simulated.
- Routes targeted by most footer links.
- Production deployment, CI/CD, monitoring, backups, or production secrets management.
- Automated backend tests or frontend tests.

### Current phase

The project has moved from a UI/header prototype into a partially data-driven catalog. The correct immediate focus is to stabilize and refactor the catalog foundation before adding cart and payments.

---

## 3. Status legend and current capability matrix

| Status | Meaning |
|---|---|
| Implemented | Source code exists and the capability is substantially present. |
| Partial | Some UI/data plumbing exists, but important behavior is missing. |
| Skeleton | Route or visual placeholder exists only. |
| Planned | Described in project history but no implementation exists. |
| Needs verification | Code exists, but the complete runtime path was not verified in this audit. |

| Area | Status | Current reality |
|---|---|---|
| Brand system | Implemented | Logos, Maple Leaf, Handmade graphic, custom fonts, and theme tokens are present. |
| Header | Implemented, responsive limitations | Desktop-oriented sticky navigation and promotional bar are present. No mobile menu. |
| Footer | Implemented, links incomplete | Global footer renders; most internal destinations and real social URLs are not implemented. |
| Homepage | Skeleton | Contains placeholder heading and 30 filler rows used to exercise sticky-header scrolling. |
| FAQ | Implemented | 17 local-state accordion questions; no CMS/backend. |
| Kids listing | Implemented, needs live verification | Fetches backend data through Vite proxy and renders product cards. |
| Product detail | Partial/uncommitted | Source exists and type-checks, but is currently an untracked file. |
| Product category pages | Implemented, content varies | All product menu/submenu routes reuse `CategoryPage` and `ProductCard`; their content depends on matching database rows. |
| Product API | Implemented | Read-only list/category/featured/slug API. |
| Database | Implemented locally | PostgreSQL 15 Compose service and initial schema/seed script exist. |
| Swagger/OpenAPI runtime | Implemented | Runtime endpoints exist; checked-in exports are stale. |
| Cloudinary delivery | Partial | URL helper exists; seed image values are not valid Cloudinary public IDs. |
| Sales | Partial | DB/API/UI shapes exist, but seed script contains no non-null sales and validation is absent. |
| Best Sellers | Implemented, needs data | Uses `GET /api/products?featured=true`; products appear when `is_featured = true`. |
| Search | Visual only | Inputs/icons do not execute searches. |
| Cart | Visual only | Cart icon has hover animation but no handler/state/page. |
| Ask a Question | Visual only | Form validates locally, then always shows success without sending data. |
| Checkout/orders | Planned | No schema, backend, frontend, or Stripe code. |
| Tests | Missing | Gradle reports `NO-SOURCE`; no frontend test framework is configured. |
| Production operations | Planned | No deployment or CI configuration. |

---

## 4. Business and product vision

### Business

Isa's Signs & Designs designs and produces products in Canada. The project history describes a catalog covering:

- Islamic wall art and Arabic calligraphy-inspired decor;
- prayer-corner and Islam-inspired home pieces;
- Islamic children's products;
- Montessori wooden toys, puzzles, learning boards, memory games, calendars, and busy boards;
- personalized nursery decor and lamps;
- Ramadan and Eid decor and gifts;
- nikkah and wedding signs, table numbers, place cards, and event pieces;
- business signs, plaques, QR signs, branded displays, and cards;
- custom laser-cut and engraved work for personal and commercial use.

### Product principles established in the history

- Premium but approachable storefront design.
- Fast and clear customer experience.
- Canadian identity and handmade production should be visible.
- Affordable pricing should not imply low quality.
- Guest checkout should be the default; accounts can be optional later.
- Products, prices, visibility, images, and merchandising should be data-driven.
- A product update should not require editing a React component.
- Soft-deactivate products instead of deleting them.
- Store monetary amounts as integer cents, never formatted strings or floating-point dollars.
- Keep the system maintainable by one developer.
- Use hosted image delivery and hosted checkout where practical.

### MVP definition of done

A real MVP is not complete until a customer can:

1. browse database-backed categories and featured products;
2. open a complete product detail page;
3. choose any required options/customization;
4. add an item to a persistent cart;
5. complete Stripe Checkout;
6. receive reliable payment/order confirmation.

The system must also persist orders and order items, confirm payment by verified webhook, and support a basic fulfillment lifecycle.

---

## 5. Development history

### 2026-02-20 — Initial frontend and design system

Git commit `698a330` created the React/Vite/Tailwind project, initial header, theme, logo assets, Aoki and Quicksand fonts, utilities, and original planning document. The project initially centered on brand presentation and header behavior.

Git commit `9fa513e` added backend and infrastructure placeholders.

Git commit `62854ea` added the Made in Canada visual to the header.

Git commit `ba249df` substantially refined the header:

- route-based navigation and route skeletons were introduced;
- the Made in Canada asset evolved into the Maple Leaf presentation;
- Handmade branding assets were added;
- logo and search sizing became fluid with `clamp()`;
- navigation responsiveness was improved;
- React Router was wired at the application entry point;
- chevrons/dropdowns were removed in favor of direct routes.

The historical UI work also experimented with collapsing headers, animated maximum heights, fixed/sticky switching, scroll locks, hysteresis, and timed state locks. Those approaches caused flicker and scroll-position problems and were deliberately abandoned.

The accepted design rule became: let the top brand row scroll away naturally, keep the navigation row sticky, and reveal only a compact sticky identity/search treatment after a simple scroll threshold.

### 2026-02-21 — Backend scaffold and transition to data-driven catalog

Git commit `3f0e0f0` added:

- PostgreSQL Docker Compose configuration;
- `init.sql` schema and initial sample products;
- Spring Boot application entry point;
- JPA Product entity;
- Spring Data Product repository;
- initial product controller;
- Java/Gradle build configuration;
- local runtime configuration.

The early `IsaSignsAndDesignsDoc.txt` status correctly recorded that the Gradle wrapper/build was initially blocked and that the frontend was not connected to the backend at that point.

### 2026-02-23 to 2026-02-25 — Backend hardening and catalog UI

The later work, largely captured in commit `5c6d43b`, completed or added:

- working Gradle 9.3.1 wrapper;
- Java 21 toolchain declaration;
- Springdoc OpenAPI/Swagger;
- Product DTO separate from the JPA entity;
- missing-product HTTP 404 behavior;
- case-insensitive category lookup;
- `long_description`, `is_featured`, `stock_qty`, `is_customizable`, and `tags` fields;
- 10 richer Kids seed products in addition to the original Kids Name Sign;
- FAQ page;
- Kids API-driven page;
- Cloudinary URL helper and public cloud-name environment configuration;
- global footer and copied footer logo asset;
- additional theme/font work;
- checked-in API/database documentation and a database export.

The current code also contains an `on_sale jsonb` column and corresponding entity, DTO, controller parsing, and frontend sale UI. This field is newer than the backend overview and data dictionary, which do not fully document it.

Commits `5c6d43b` and `e67aa84` refined footer social-label spacing.

### Work after the last commit / current uncommitted work

At the 2026-07-19 audit, the following feature work is not committed:

- `frontend/src/App.tsx` imports and routes the product detail page;
- `frontend/src/components/pages/KidsPage.tsx` wraps cards in detail-page links and prevents image-dot clicks from triggering navigation;
- `frontend/src/components/pages/ProductDetailPage.tsx` exists as an untracked 387-line file.

There are also many modified/deleted generated Gradle/cache/build files because these artifacts were committed previously. These changes are noise, but they must be cleaned deliberately rather than accidentally included in a feature commit.

---

## 6. Repository identity, structure, and Git state

### Local repository

```text
/Users/u3quresh/Desktop/isa-signs-designs
├── frontend/                       React storefront
├── backend/                        Spring Boot API + PostgreSQL local setup
├── infra/                          placeholder only
├── IsaSignsAndDesignsDoc.txt       early status/execution plan
├── IsasSignsDesigns_Copilot_Chat_Project_Handoff.txt
├── IsaSignsHandoverDoc.md          this living handover
└── assorted generated/local files
```

### Remote identity

The prior handoff called the repository `u3qureshi/IsasSignsDesigns`. The current configured remote points to a differently spelled/hyphenated repository path. Confirm the intended canonical GitHub repository before publishing new work.

### Critical credential warning

The Git remote currently embeds a GitHub personal access token in its URL. The actual token is intentionally not reproduced here.

Treat the token as compromised:

1. revoke/rotate it in GitHub immediately;
2. remove credentials from the remote URL;
3. verify no token remains in shell history, documentation, credential helpers, screenshots, or chat exports;
4. use a credential manager or SSH key for future authentication.

Safe inspection and remediation pattern:

```bash
git remote -v
git remote set-url origin https://github.com/<owner>/<repository>.git
git remote -v
```

Do not paste the old URL into another chat or document.

### Dirty working-tree warning

Before any new agent edits code, run:

```bash
git status --short
git diff -- frontend/src/App.tsx frontend/src/components/pages/KidsPage.tsx
git diff --no-index /dev/null frontend/src/components/pages/ProductDetailPage.tsx
```

Preserve the product-detail work. Do not run destructive reset/checkout commands. Commit feature changes separately from generated-file cleanup.

### Repository hygiene problem

Generated/local artifacts are tracked, including:

- `.DS_Store`;
- `backend/.gradle/**` caches and locks;
- `backend/build/**` compiled classes and reports;
- `backend/boot.log` and `backend/boot.pid`.

The root/backend has no effective ignore policy for these paths. A future cleanup should add a root `.gitignore`, untrack generated artifacts, and keep the Gradle wrapper files (`gradlew`, `gradlew.bat`, `gradle/wrapper/*`). Do not delete the wrapper itself.

---

## 7. Technology stack and audited versions

### Frontend

- React `^19.2.0`
- React DOM `^19.2.0`
- TypeScript `~5.9.3`
- Vite `^7.3.1`
- React Router DOM `^7.13.0`
- Tailwind CSS `^3.4.17`
- PostCSS and Autoprefixer
- Lucide React `^0.575.0`
- shadcn/ui foundations via `components.json`, `class-variance-authority`, `clsx`, `tailwind-merge`, and `tailwindcss-animate`; the current pages mainly use custom components rather than generated shadcn components
- ESLint 9 with TypeScript, hooks, and Vite refresh rules
- Cloudinary delivery URLs generated client-side
- Quicksand and Aoki local WOFF2 font assets

### Backend

- Java toolchain target: 21
- Spring Boot 3.3.5
- Spring Web MVC / embedded Tomcat
- Spring Data JPA
- Hibernate ORM
- HikariCP connection pool through Spring Boot defaults
- PostgreSQL JDBC driver
- PostgreSQL 15 container
- Gradle wrapper 9.3.1
- Springdoc OpenAPI 2.6.0
- Jackson JSON mapping

### Planned commerce/operations

- Stripe hosted Checkout
- Stripe webhook verification
- guest checkout
- orders/order items in PostgreSQL
- Cloudinary for production image delivery
- production hosting, monitoring, backups, CI/CD, and secrets management

### Environment observed during the 2026-07-19 audit

- Node: 24.1.0
- npm: 11.3.0
- installed JVM/Gradle launcher: Java 24.0.1
- backend toolchain target: Java 21
- Gradle wrapper: 9.3.1
- Docker: 29.2.1
- Docker Compose: 5.0.2

Java 21 remains the supported project requirement even if Gradle happens to launch under a newer installed JVM.

---

## 8. Local setup from a fresh clone

### Prerequisites

- Git
- Node.js and npm
- Java 21 JDK
- Docker Desktop with Docker Compose
- optional: DBeaver or another PostgreSQL client
- optional: `curl`, `jq`, and a browser for API verification

Verify installations:

```bash
git --version
node --version
npm --version
java -version
docker --version
docker compose version
```

Use the repository's Gradle wrapper; a system `gradle` installation is not required:

```bash
cd backend
./gradlew --version
```

### 8.1 Frontend environment

Create the frontend environment file if it does not exist:

```bash
cd frontend
cp .env.example .env
```

Set:

```dotenv
VITE_CLOUDINARY_CLOUD_NAME=<public-cloud-name>
```

Only the Cloudinary cloud name is appropriate in frontend code. Never place API secrets, upload secrets, Stripe secrets, GitHub tokens, database passwords, or private credentials in a `VITE_` variable because Vite exposes these values to the browser bundle.

Install frontend dependencies:

```bash
npm install
```

### 8.2 Start PostgreSQL

Start Docker Desktop first, then:

```bash
cd backend
docker compose up -d
docker compose ps
```

Current local connection defaults:

| Setting | Value |
|---|---|
| Host | `localhost` |
| Port | `5432` |
| Database | `isa_sd` |
| User | `isa_user` |
| Password | local development value in Compose/application config |
| Schema | `public` |
| Container | `isasigns_db` |

The checked-in `backend/README.md` incorrectly says the database is `isa_products`; the actual Compose and application configuration use `isa_sd`.

Connect using the container:

```bash
docker exec -it isasigns_db psql -U isa_user -d isa_sd
```

Useful interactive commands:

```sql
\dt
\d products
SELECT COUNT(*) FROM products;
SELECT slug, name, category, price_cents, is_active FROM products ORDER BY category, name;
SELECT slug, is_customizable, tags, on_sale FROM products WHERE category = 'kids';
\q
```

### 8.3 Start backend

In a dedicated terminal:

```bash
cd backend
./gradlew bootRun
```

Expected base URL:

```text
http://localhost:8081
```

Because `spring.jpa.hibernate.ddl-auto` is `validate`, backend startup requires an existing schema matching the JPA entity. Hibernate will not create or update missing columns.

### 8.4 Start frontend

In another terminal:

```bash
cd frontend
npm run dev
```

Expected default URL:

```text
http://localhost:5173
```

The Vite development server proxies browser requests beginning with `/api` to `http://localhost:8081`. This is why the frontend uses relative fetches such as `/api/products?category=kids`.

Restart Vite after changing `.env`, `vite.config.ts`, or Tailwind configuration.

### 8.5 Smoke-test the system

```bash
curl -i http://localhost:8081/api/products
curl -i "http://localhost:8081/api/products?category=kids"
curl -i http://localhost:8081/api/products/kids-montessori-puzzle-fish-matching
curl -i http://localhost:8081/api/products/does-not-exist
```

Then open:

```text
http://localhost:5173/kids
http://localhost:5173/products/kids-montessori-puzzle-fish-matching
http://localhost:5173/faq
http://localhost:8081/swagger-ui/index.html
```

### 8.6 Reset/reseed the local database

`init.sql` is executed by the official PostgreSQL container only when it initializes a new empty data directory. Editing `init.sql` does not update an existing volume.

To destroy the local database volume and recreate the seeded database:

```bash
cd backend
docker compose down -v
docker compose up -d
```

This permanently deletes all data in the local Docker volume. Export any manual product work first.

---

## 9. Frontend architecture

### Source layout

```text
frontend/
├── .env                           current public Cloudinary cloud name
├── .env.example                   environment template
├── components.json                shadcn-style aliases/config
├── package.json
├── tailwind.config.js
├── vite.config.ts                 `@` alias and `/api` proxy
├── src/
│   ├── main.tsx                   React root + BrowserRouter
│   ├── App.tsx                    global layout and all routes
│   ├── App.css                    effectively empty
│   ├── index.css                  fonts, reset, theme tokens
│   ├── components/
│   │   ├── Brand.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── pages/
│   │       ├── KidsPage.tsx
│   │       ├── ProductDetailPage.tsx
│   │       └── FaqPage.tsx
│   ├── lib/
│   │   ├── cloudinary.ts
│   │   └── utils.ts
│   └── assets/
│       ├── brand/
│       └── fonts/
└── documents/
    └── products_table_data_dictionary.md
```

### Application boot and global layout

`src/main.tsx` creates the React root inside `StrictMode` and wraps `App` in `BrowserRouter`.

`App.tsx` renders:

```text
full-height flex column
├── Header
├── flex-growing route outlet (`Routes`)
└── Footer
```

The footer is outside `Routes`, so it appears on every route, including error-like states inside pages.

There is no catch-all `*` route or dedicated 404 page. Unknown routes render the shared header/footer with an empty route body.

### Route table

| Route | Component | Status |
|---|---|---|
| `/` | `HomePage` in `App.tsx` | Placeholder/filler page |
| `/best-sellers` | `CategoryPage` | API-driven; requests active products where `is_featured = true` |
| `/embroidery` | `Navigate` | Redirects to Anime for direct URL visits; the nav trigger itself does not navigate |
| `/embroidery/anime` | `CategoryPage` | API-driven; category `embroidery-anime` |
| `/embroidery/baby-clothing` | `CategoryPage` | API-driven; category `embroidery-baby-clothing` |
| `/embroidery/fathers-day` | `CategoryPage` | API-driven; category `embroidery-fathers-day` |
| `/embroidery/mothers-day` | `CategoryPage` | API-driven; category `embroidery-mothers-day` |
| `/embroidery/seasonal-holidays` | `CategoryPage` | API-driven; category `embroidery-seasonal-holidays` |
| `/embroidery/custom-designs` | `CustomEmbroideryPage` | Frontend-only eight-step request UI prototype; no backend submission or AI generation yet |
| `/ramadan-decor` | `Navigate` | Legacy URL redirects to Embroidery Seasonal & Holidays |
| `/printing` | `Navigate` | Redirects to Popular designs for direct URL visits; the nav trigger itself does not navigate |
| `/printing/popular-designs` | `CategoryPage` | API-driven; category `printing-popular-designs` |
| `/printing/custom` | `CategoryPage` | API-driven; category `printing-custom` |
| `/wall-art` | `CategoryPage` | API-driven; category `wall-art` |
| `/home-decor` | `CategoryPage` | API-driven; category `home-decor`; direct route retained but removed from header navigation |
| `/kids` | `KidsPage` → `CategoryPage` | API-driven; category `kids` |
| `/business-events` | `CategoryPage` | API-driven; category `business-events` |
| `/faq` | `FaqPage` | Implemented content page |
| `/products/:slug` | `ProductDetailPage` | Partial; current route/file uncommitted |

Footer links point at `/about`, `/contact`, `/reviews`, `/login`, and `/track`, none of which are defined. WhatsApp and social URLs are placeholders rather than business-specific destinations.

---

## 10. Frontend design system and assets

### Fonts

Quicksand is the default UI font. Local WOFF2 files define weights 300, 400, 500, 600, and 700.

Aoki is registered at weights 300 and 400 and is available through Tailwind's `font-aoki`. It is intentionally limited to selected display text such as page/product headings because using it globally made ordinary labels appear visually uppercase.

The font files were validated as real WOFF2 assets during this audit.

### Brand assets

`src/assets/brand` contains:

- main logo in PNG and SVG;
- title logo in PNG and SVG;
- `IsaSignsAndDesignsLOGO_copy.svg`, a copied variant created so footer modifications would not alter the original asset;
- Maple Leaf SVG;
- Handmade PNG and SVG;
- palette reference PNG.

`Brand.tsx` supports:

- `stacked`: responsive mark/title pairing used in the top header row;
- `compact`: fixed larger horizontal mark/title pairing, currently not used by the main layout;
- `icon`: logo mark used in the sticky navigation area.

### Theme tokens

`index.css` defines HSL component variables for:

- brand/ISA greens;
- sage shades;
- brown shades including the footer brown;
- sand;
- a warm near-white Kids/FAQ background;
- standard shadcn-like semantic tokens (`background`, `foreground`, `primary`, `card`, `border`, etc.);
- an unused/mostly dormant `.dark` theme.

The current `--theme-kids-bg` value is `33 100% 99%`, a warm near-white. Older handoff text that calls it `#effff4` is not accurate for the audited source.

When consuming component values, use `hsl(var(--token))`. Opacity forms should be tested carefully across Tailwind/inline styles.

---

## 11. Header behavior and design decisions

`Header.tsx` is the most heavily iterated UI component.

### Promotional bar

- Appears above the main header by default.
- Displays “FREE SHIPPING ON ORDERS $100 +”.
- “SHOP NOW” and a Lucide Truck icon link to `/best-sellers`.
- A right-aligned close button removes the bar for the current component lifetime only.
- Dismissal is not stored in local storage or cookies, so refreshing restores it.

### Top brand row

- Displays centered logo/title branding linking to `/`.
- Has a left search input that is visual only.
- Has Maple Leaf / “Made in Canada” and Handmade decorative blocks absolutely positioned on the left.
- Decorative blocks appear only when not scrolled and only at widths of at least 770 px.
- Search and side columns use `clamp()` and collapse at smaller widths to reduce overlap.
- The top row scrolls away naturally.

### Sticky navigation row

- `position: sticky; top: 0` with a high z-index.
- Contains a reserved left column, central navigation, and reserved right cart area.
- Determines `isScrolled` using a threshold derived from the measured top-row height.
- At large widths above the `max-[1366px]` cutoff, the left area can reveal the compact icon and expandable sticky search after scrolling.
- Sticky search underline animates for 300 ms; its placeholder is deliberately delayed by 300 ms.
- Returning above the threshold closes and resets sticky search.
- Navigation labels are bold brown with an animated brown underline.
- Embroidery and Printing are button-only navigation triggers implemented with the shared `NavDropdown` component. Hovering, clicking, or keyboard-activating a trigger opens its collection dropdown; only a collection link navigates.
- Cart uses a Lucide cart and an SVG circle whose dash offset animates on hover.

### Deliberate constraint

Do not reintroduce complex height-collapse/sticky-switch animation without a clear isolated redesign and cross-device testing. The earlier scroll-state mechanisms caused visible flicker and scroll jumps.

### Header gaps

- Neither search input searches.
- The cart button does nothing.
- There is no mobile menu or hamburger; the top-level nav can overflow on narrow screens.
- The sticky compact logo/search is hidden at 1366 px and below, so the intended scrolled identity/search treatment is primarily large-desktop behavior.
- There is no active-route styling.
- Promo dismissal is not persistent.

---

## 12. Shared database-backed catalog pages

Kids was the first database-backed product page. Its behavior has now been extracted into reusable pieces so every product-oriented menu and submenu page renders products in exactly the same way.

### Reusable React pieces

- `CategoryPage.tsx` receives a visible page title and either a database category ID or the `featured` flag.
- `ProductCard.tsx` displays the image gallery, name, regular/sale price, and product-detail link behavior.
- `types/product.ts` defines the shared TypeScript product response shape.
- `KidsPage.tsx` is now a very small wrapper that renders `CategoryPage` with category `kids`.
- `App.tsx` maps each route to `CategoryPage` with its canonical category ID.
- Embroidery and Printing configuration files keep submenu labels, routes, and category IDs together.

### How this works in simple words

React does not contain a hardcoded list of products for each page. A route supplies the category identifier. The shared page asks the backend for active products in that category. When the JSON response arrives, React loops over the array and creates the same `ProductCard` for every product.

In simple pseudocode:

```text
WHEN customer opens a product category URL:
    React Router chooses the matching route
    route gives CategoryPage a title and category ID

    CategoryPage shows "Loading"
    CategoryPage requests:
        GET /api/products?category=<category-id>

    backend queries PostgreSQL:
        category matches <category-id>
        AND is_active is true

    backend returns a JSON array of products
    React stores that array in products state

    IF request failed:
        show error message
    ELSE IF products array is empty:
        show "No products found yet"
    ELSE:
        FOR EACH product:
            render the shared ProductCard
            card links to /products/<product-slug>
```

Best Sellers uses the same page/card rendering with a different query:

```text
GET /api/products?featured=true
```

The backend returns active rows with `is_featured = true`. This lets one product remain in `kids`, `wall-art`, `embroidery-anime`, or another real category while also appearing under Best Sellers.

### Exact React pattern

Conceptually, routes look like:

```tsx
<Route
  path="/embroidery/anime"
  element={<CategoryPage title="Anime" category="embroidery-anime" />}
/>

<Route
  path="/best-sellers"
  element={<CategoryPage title="Best Sellers" featured />}
/>
```

Inside the shared page, the important idea is:

```tsx
fetch(`/api/products?category=${category}`)
  .then(response => response.json())
  .then(databaseProducts => setProducts(databaseProducts))

return products.map(product => <ProductCard product={product} />)
```

The real implementation also URL-encodes the category, aborts stale requests when navigating, and shows loading/error/empty states.

### Shared render behavior

- one column by default;
- two columns from the small breakpoint;
- four columns from the large breakpoint;
- square `object-cover` images;
- rounded image area and image hover zoom;
- image-selection dots when multiple images exist;
- Aoki product name;
- Canadian currency formatting through `Intl.NumberFormat`;
- regular or sale price;
- each card links to `/products/{slug}`.

When a card has multiple images, dot clicks call `preventDefault()` and `stopPropagation()` so changing the card image does not open the product page.

### Current technical debt

- Data fetching still uses chained promises rather than a shared API-client module or query library.
- There is no runtime validation of the returned JSON shape.
- There is no caching, retry policy, or pagination.
- Sale percent is not range-validated.
- There are no loading skeleton cards.
- The placeholder is an external `placehold.co` URL.

### Custom Embroidery request UI

- Route: `/embroidery/custom-designs`
- Component: `frontend/src/components/pages/CustomEmbroideryPage.tsx`
- Planning source: `frontend/documents/thread-n-butter-custom-embroidery-flow.md`

The Custom Designs submenu is intentionally different from ordinary product-category pages. Instead of rendering database product cards, it opens a frontend-only request wizard for exploring the future custom embroidery experience.

Current card order:

1. **Customer** — full name, preferred contact method, and the matching email or phone field.
2. **Idea** — concept description and optional exact wording.
3. **Artwork** — one required artwork-handling choice and a conditional local image upload.
4. **Item** — required customer-supplied or Thread & Butter-supplied choice, item details, and required item type.
5. **Placement** — item-aware placement selection plus known/recommended size.
6. **Quantity** — quantity control and bulk-review notice.
7. **Preview** — uploaded-image preview and current request summary.
8. **Submit** — final summary, required notices, and prototype submission action.

Navigation/UI behavior:

- labels across the top show every card and highlight the current one;
- the current and previously completed labels can be selected, but future labels are disabled so a customer cannot skip required cards;
- successful Back and Next navigation scrolls to just above the progress tabs after React renders the new card; a sticky-header offset keeps the tabs fully visible;
- the compact page introduction contains only **Custom Embroidery Studio** and **Tell us what you would like embroidered!**;
- repeated descriptive text has been removed from card headers; the quantity instruction remains directly above the quantity control where it is needed;
- reduced page, progress-tab, card-header, field, choice-card, upload, preview, and footer spacing keeps more of the active form visible without scrolling;
- the footer step count is a larger, fully opaque dark brown and remains visible on small screens as `1/8`, `2/8`, and so on;
- React component state preserves entered values while moving between cards;
- conditional inputs appear based on contact method, AI choice, item provider, selected item, placement, and size mode;
- clicking Next validates the current card and shows specific inline feedback if it is incomplete;
- the final submit action revalidates the entire request and shows specific feedback rather than failing silently;
- successful prototype submission clearly says that no request was actually sent.

Current validation rules:

- full name is required;
- the selected contact method is required;
- email uses both an HTML email input and an explicit email-format check;
- phone input strips every non-digit character, allows at most 15 digits, and requires 10–15 digits;
- the embroidery idea description is required;
- exactly one artwork-handling option must be selected;
- an upload is optional only for **Create one AI concept from my description** and **No generated image — review my request manually**;
- an upload is required for **Use my uploaded artwork without AI changes** and **Use my upload as inspiration for one AI concept**;
- the customer must choose who supplies the item;
- both provider choices use the same required item-type selector;
- choosing `Other` with either provider reveals the same required **What item will be embroidered?** field;
- quantity must be at least one;
- both final acknowledgements are required.

Item and placement behavior:

- available item types are Hoodie, Crewneck, Pants, Sweatpants, Jeans, Tote bag, Towel, T-shirt, Beanie, Hat, and Other;
- choosing an item type is mandatory regardless of who supplies it;
- placement buttons are generated from the chosen item type, not from one global list;
- hoodies, crewnecks, and T-shirts use garment locations such as chest, front, back, and sleeves;
- pants, sweatpants, and jeans use thigh, pant-leg, and back-pocket locations;
- tote bags and towels use locations appropriate to those items;
- beanies use front and side locations;
- hats use front, side, and back locations, so invalid garment placements such as `Left chest` never appear for a hat;
- changing to an item type that does not support the previous placement clears that placement;
- `Other` placement requires a written description;
- choosing **I know the approximate size** makes both width and height mandatory positive values.

Artwork limits for this first UI:

- maximum one uploaded image;
- accepted preview types: PNG, JPG/JPEG, WEBP, and SVG;
- client-side maximum size: 10 MB;
- the UI communicates a limit of one future AI-generated concept image per user account daily;
- the empty upload control is a compact clickable box rather than a large drop zone;
- no AI image editing;
- no regeneration, variations, “make simpler,” recolouring, style changes, or other AI editing controls;
- exact uploaded artwork can be marked as exact artwork, inspiration, or a placement reference.

The browser currently creates a temporary object URL only to preview the chosen local file. It does not upload the image. The object URL is revoked when the image changes or the component unmounts.

UI-only boundaries:

- no `POST` request;
- no database table or persistence;
- no permanent upload to Cloudinary/object storage;
- no Cloudflare/OpenAI image-generation call;
- no AI credentials in React;
- no concept generation, image editing, placement composition, stitch estimate, thread-colour estimate, or price estimate;
- no company/customer notification;
- no real request number.

Simple state-flow pseudocode:

```text
currentStep starts at Customer
formState stores every field for all eight cards

WHEN customer changes a field:
    update that field in formState

WHEN customer clicks Next:
    validate fields belonging to currentStep
    IF any required value is missing or invalid:
        remain on currentStep
        show specific errors below that card
    ELSE:
        change currentStep to the next card
    scroll to the top edge of the newly displayed form card
    keep the same formState

WHEN customer clicks Back or a completed label:
    move to that earlier card
    keep the same formState and scroll position

WHEN customer tries to select a future label:
    do nothing because future labels are disabled

WHEN customer selects one local image:
    validate image type and size
    create temporary browser preview
    do not upload it

WHEN customer selects an item type:
    load only that item's valid placement choices
    clear an earlier placement if it is invalid for the new item

WHEN customer reaches Preview:
    read formState
    show the current request summary
    show placeholders for future estimates

WHEN customer clicks Submit:
    revalidate all cards and both agreements
    IF validation succeeds:
        show a UI-only confirmation
        do not call a backend
```

Future backend work must follow the architecture in the rough-flow document: React calls Spring Boot; Spring validates and stores the request; image/AI credentials stay server-side; AI generation is asynchronous; storage uses public IDs/URLs rather than image bytes in PostgreSQL; and the business confirms final artwork and price manually.

---

## 13. Product detail page

`ProductDetailPage.tsx` is currently untracked and must be preserved/committed.

### Route/data flow

1. `useParams` reads `slug` from `/products/:slug`.
2. The component resets loading and the active image.
3. It fetches `GET /api/products/{slug}`.
4. A non-2xx response becomes an `HTTP <status>` error string.
5. The response renders a two-column layout from the medium breakpoint.

### Gallery

- Main Cloudinary request asks for a 900×900 fill transformation.
- Thumbnail requests ask for 120×120 fill transformations.
- Clicking a thumbnail changes `activeIndex`.
- A ref array scrolls the active thumbnail into view.
- Failed main/thumbnail images fall back to external placeholders.
- There are no next/previous buttons, zoom/lightbox, swipe support, or keyboard arrow handling.

### Product information

- Aoki name.
- Short description.
- regular or sale price.
- tag pills.
- customization notice if `isCustomizable` is true.
- Product Details accordion, open by default, using `longDescription` with short-description fallback.
- Size & Specification accordion showing material and customization text; no actual dimensions are stored.
- Ask a Question accordion containing name, email, and message fields.

### Important form warning

The question form does not send anything. `handleSubmit` only prevents default and sets `submitted = true`, after which the interface claims the question was sent. This must be relabeled as a demo or connected to a real backend/email workflow before launch to avoid misleading customers.

### Product detail gaps/risks

- `stockQty` is fetched but not displayed or enforced.
- There is no quantity, variant, customization, add-to-cart, shipping, lead-time, safety, dimension, or availability UI.
- The Back link uses a type cast to pass `-1` to a `Link`; `useNavigate()(-1)` would be clearer and type-safe.
- Error state does not distinguish 404 from backend/network failure.
- `error` is not explicitly cleared at the start of a new slug request.
- No document title, meta description, structured data, canonical URL, or social metadata.

---

## 14. FAQ page

`FaqPage.tsx` contains all content directly in source code. It has 17 questions across:

- General (7);
- Kids & Montessori (2);
- Weddings & Nikkahs (2);
- Business & Signage (2);
- Ordering, Shipping & Care (3).

Each accordion item owns a boolean `open` state and toggles a plus sign by rotating it 45 degrees. Multiple items can remain open at once.

The page communicates important business positioning: Canadian in-house production, no dropshipping, customization, guest checkout, materials, installation, gifting, children's safety, event lead time, business logo support, care, and damage support.

Before launch, every policy-like statement must match actual operations. In particular, checkout/account, production timelines, installation inclusions, safety/age information, shipping, damage handling, and customization availability cannot be promises unless the matching systems/processes exist.

Accessibility improvements needed:

- add `aria-expanded` and `aria-controls` to accordion buttons;
- give controlled panels IDs/regions;
- consider a reusable accessible accordion primitive;
- test keyboard focus and screen-reader announcements.

---

## 15. Footer

`Footer.tsx` appears globally and has:

1. a centered brand statement and long business description;
2. a divider;
3. a responsive logo / link grid / social block layout;
4. dynamic current-year copyright.

The social icons include Lucide Instagram/Facebook and custom Pinterest/TikTok SVGs. Hover colors match each platform. The “Check us out:” label visually overlaps the social border and was the subject of the two latest commits.

The current social links are generic platform homepages, not verified business profiles. WhatsApp is `https://wa.me/` without a number. Internal footer routes mostly do not exist. Replace these before launch.

The implementation imports the original main SVG, although history notes that a copied SVG with an Islamic border was created. Confirm which logo variant the footer should actually use.

---

## 16. Cloudinary and image model

### Client helper

`frontend/src/lib/cloudinary.ts` reads `VITE_CLOUDINARY_CLOUD_NAME` and builds URLs in this form:

```text
https://res.cloudinary.com/<cloud>/image/upload/<transformations>/<public-id>
```

Supported options:

- width;
- height;
- crop: `fill`, `fit`, `scale`, `thumb`, or `crop`;
- quality: number or `auto`;
- format: `auto`, `webp`, `jpg`, or `png`.

Defaults are fill crop, automatic quality, and automatic format. A helper also returns the first image or a placeholder.

### Intended database convention

Store Cloudinary public IDs, for example:

```json
["montessori-wooden-puzzle-fish"]
```

Do not store an API secret or a complete signed upload credential in the database/frontend.

### Current mismatch

The checked-in `init.sql` stores values like:

```json
["/assets/kids-puzzle-fish.jpg"]
```

Those files are not present in the frontend public assets, and the frontend passes each string to the Cloudinary public-ID helper. A fresh database therefore produces Cloudinary URLs whose public ID contains `/assets/...`, which will usually fail unless matching Cloudinary assets happen to use those exact IDs.

The prior handoff states that the live database was updated to clean Cloudinary public IDs, but that state is not represented in `init.sql` or the dated database export. Because Docker was unavailable during this audit, the current live local database could not be inspected.

Required resolution: choose clean Cloudinary public IDs, upload/verify the assets, update the seed/migrations, add useful image alt metadata eventually, and smoke-test every product image from a fresh database.

### Additional cleanup

`getCloudinaryUrl` currently logs every generated image URL. Remove or gate this debug logging before production.

---

## 17. Backend architecture

### Source layout

```text
backend/
├── build.gradle
├── settings.gradle
├── gradlew / gradlew.bat
├── gradle/wrapper/
├── docker-compose.yml
├── init.sql
├── README.md
├── docs/
│   ├── BACKEND_OVERVIEW.md
│   ├── openapi.json
│   ├── openapi.yaml
│   └── products_202602231455.json
└── src/main/
    ├── java/com/isasigns/backend/
    │   ├── IsasignsBackendApplication.java
    │   ├── config/OpenApiConfig.java
    │   ├── controller/ProductController.java
    │   ├── dto/ProductResponse.java
    │   ├── model/Product.java
    │   └── repository/ProductRepository.java
    └── resources/application.yml
```

There is no service layer. The controller talks directly to the repository and performs entity-to-DTO and JSON transformations.

### Runtime request flow

```text
browser/frontend/curl
  -> HTTP request on port 8081
  -> embedded Tomcat
  -> Spring MVC DispatcherServlet
  -> ProductController route/parameter binding
  -> ProductRepository generated query
  -> Hibernate/JPA
  -> HikariCP connection
  -> PostgreSQL products table
  -> Product entities
  -> controller ProductResponse mapping
  -> Jackson JSON serialization
  -> HTTP JSON response
```

### Class responsibilities

#### `IsasignsBackendApplication`

The `@SpringBootApplication` entry point enables configuration, auto-configuration, and component scanning below `com.isasigns.backend`. `SpringApplication.run` creates the Spring context, configures the web/JPA infrastructure, and starts embedded Tomcat.

#### `Product`

The JPA entity maps the database representation. It contains no storefront/business logic. Images and `on_sale` are stored in Java as raw strings; tags are a Java `String[]` mapped to PostgreSQL `text[]`.

Lifecycle hooks assign UUID/timestamps for entities created through JPA. Most current catalog changes happen through SQL, so database defaults also matter.

The entity exposes getters only and has a no-argument constructor. It is not returned directly from controllers.

#### `ProductRepository`

Extends `JpaRepository<Product, UUID>`, gaining standard CRUD methods even though only reads are exposed over HTTP.

Custom derived queries:

- `findByCategoryIgnoreCaseAndIsActiveTrue(category)`;
- `findByIsActiveTrue()`;
- `findBySlugAndIsActiveTrue(slug)`.

These enforce storefront soft visibility at query time. There is no sorting, pagination, featured filter, tag search, text search, inventory filter, or locking.

#### `ProductResponse`

A Java record defining the public product contract. Separating it from the entity prevents accidental exposure of future internal columns and provides frontend-friendly types:

- raw image JSON text becomes `List<String>`;
- PostgreSQL tag array becomes `List<String>`;
- raw sale JSON becomes a Jackson `JsonNode`;
- database snake_case fields serialize as record component camelCase.

#### `ProductController`

Routes requests under `/api/products`, queries the repository, maps entities to DTOs, parses JSON strings, and returns 404 for missing/inactive slugs.

`parseImages` returns an empty list for blank data, parses valid JSON arrays, and falls back to a single-item list containing the raw string if parsing fails.

`parseJson` returns a `JsonNode` for valid `on_sale`, but silently returns null for blank or malformed JSON. There is no sale schema/range validation.

The controller manually constructs `new ObjectMapper()` instead of injecting Spring's configured mapper. It works for the current simple parsing, but injected configuration would be more consistent/testable.

#### `OpenApiConfig`

Adds title, version, description, contact, license, and local server URL metadata to generated API documentation. It does not change runtime business behavior.

---

## 18. Backend configuration

### Build

`build.gradle` declares:

- Spring Boot 3.3.5;
- dependency-management plugin 1.1.6;
- Java plugin and Java 21 toolchain;
- Maven Central;
- web, JPA, Springdoc, PostgreSQL, and Spring Boot test dependencies;
- JUnit Platform for tests.

No validation starter, Actuator, security, Flyway/Liquibase, Stripe SDK, or explicit Jackson PostgreSQL type library is present.

### Runtime

`application.yml` currently hardcodes local datasource settings and port 8081. Hibernate uses `ddl-auto: validate`; Jackson date serialization uses ISO-8601 rather than timestamps.

Missing/desired settings:

- environment-variable overrides for datasource credentials/URL;
- explicit `spring.jpa.open-in-view: false`;
- environment profiles;
- production configuration;
- structured logging;
- health endpoint;
- CORS policy if frontend/backend are served from different origins.

### CORS nuance

There is no backend CORS configuration. Local browser calls through the Vite `/api` proxy do not require CORS because they appear same-origin to the browser. Direct calls from `localhost:5173` to `localhost:8081`, or a production frontend on another origin, require an explicit, restricted CORS policy or a same-origin reverse proxy.

---

## 19. Product API contract

### List active products

```http
GET /api/products
```

Returns every active product. There is no guaranteed sort order or pagination.

### Filter active products by category

```http
GET /api/products?category=kids
```

Category matching is case-insensitive, but canonical values are always lowercase and hyphenated. A missing or blank category returns all active products.

### List active featured products / Best Sellers

```http
GET /api/products?featured=true
```

Returns active products where `is_featured = true`. When `featured=true` is supplied, the featured filter takes precedence over a category query.

### Get active product by slug

```http
GET /api/products/{slug}
```

Returns one active product. A nonexistent or inactive slug returns HTTP 404 with Spring's default error representation.

### Current response fields

| JSON field | Type | Source | Notes |
|---|---|---|---|
| `id` | UUID string | `id` | Internal identifier |
| `slug` | string | `slug` | Public URL identifier |
| `name` | string | `name` | Product display name |
| `description` | string/null | `description` | Short/card description |
| `longDescription` | string/null | `long_description` | Detail-page description |
| `category` | string/null | `category` | Catalog category label |
| `priceCents` | integer | `price_cents` | Base price in minor units |
| `currency` | string | `currency` | Usually `CAD` |
| `images` | array of strings | parsed `images` text | Intended Cloudinary public IDs |
| `material` | string/null | `material` | Primary material |
| `isActive` | boolean | `is_active` | Always true for current public queries |
| `isFeatured` | boolean | `is_featured` | Future merchandising input |
| `stockQty` | integer/null | `stock_qty` | Null currently means untracked |
| `isCustomizable` | boolean | `is_customizable` | Customization capability flag |
| `tags` | array of strings | `tags` text array | Search/filter metadata |
| `onSale` | object/null | parsed `on_sale` JSONB | Expected `{enabled, percent}` shape |
| `createdAt` | ISO date-time/null | `created_at` | Creation time |
| `updatedAt` | ISO date-time/null | `updated_at` | Update time |

Representative shape:

```json
{
  "id": "43ccd2e6-65c4-48a5-8dcd-2ad062f486fd",
  "slug": "kids-montessori-puzzle-fish-matching",
  "name": "Montessori Wooden Puzzle - Fish Matching",
  "description": "Short card description",
  "longDescription": "Full detail-page description",
  "category": "kids",
  "priceCents": 5000,
  "currency": "CAD",
  "images": ["montessori-wooden-puzzle-fish"],
  "material": "wood",
  "isActive": true,
  "isFeatured": false,
  "stockQty": null,
  "isCustomizable": false,
  "tags": ["montessori", "puzzle", "fish"],
  "onSale": null,
  "createdAt": "2026-02-23T19:29:05.986Z",
  "updatedAt": "2026-02-23T19:29:05.986Z"
}
```

---

## 20. Database schema and catalog semantics

Database: `isa_sd`  
Schema: `public`  
Table: `products`

| Column | PostgreSQL type | Null/default | Purpose |
|---|---|---|---|
| `id` | `uuid` | PK, default `uuid_generate_v4()` | Internal identity |
| `slug` | `varchar(255)` | unique, not null | Stable public route key |
| `name` | `varchar(255)` | not null | Display name |
| `description` | `text` | nullable | Short description |
| `long_description` | `text` | nullable | Detail copy |
| `category` | `varchar(100)` | nullable | Category label |
| `price_cents` | `bigint` | not null, default 0 | Base price in cents |
| `currency` | `varchar(10)` | not null, default `CAD` | ISO-like currency code |
| `images` | `text` | nullable | Serialized JSON array of image IDs |
| `material` | `varchar(100)` | nullable | Primary material |
| `is_active` | `boolean` | not null, default true | Storefront soft visibility |
| `is_featured` | `boolean` | not null, default false | Featured/best-seller merchandising flag |
| `stock_qty` | `integer` | nullable | Inventory quantity; null means untracked by convention |
| `is_customizable` | `boolean` | not null, default false | Product supports customization |
| `tags` | `text[]` | not null, empty-array default | Search/filter metadata |
| `on_sale` | `jsonb` | nullable | Sale settings object |
| `created_at` | `timestamptz` | default now | Creation audit time |
| `updated_at` | `timestamptz` | default now | Update audit time |

Indexes created by `init.sql`:

- unique index/constraint on `slug`;
- B-tree category index;
- B-tree active flag index;
- B-tree featured flag index;
- GIN index on tags.

There is no database trigger to update `updated_at` for direct SQL changes. The JPA lifecycle hook updates it only for JPA updates. SQL/admin processes must set it explicitly, or a trigger should be added in a future migration.

### Data rules

#### Canonical category nomenclature

The `products.category` column is the machine-readable identifier for the menu page where a product belongs. It is not the customer-facing title.

Rules:

- lowercase letters only;
- separate words with a hyphen;
- no spaces;
- no ampersands, apostrophes, slashes, or display punctuation;
- submenu categories begin with their parent menu identifier;
- React's category value must exactly match the database value;
- visible labels remain friendly text such as “Father's Day” or “Popular designs.”

Canonical mapping:

| Menu/page | Visible label | `products.category` |
|---|---|---|
| Former direct page | Home Decor | `home-decor` |
| Main menu | Kids | `kids` |
| Former direct page | Ramadan Decor | `ramadan-decor` |
| Main menu | Wall Art | `wall-art` |
| Main menu | Business/Events | `business-events` |
| Embroidery submenu | Anime | `embroidery-anime` |
| Embroidery submenu | Baby clothing | `embroidery-baby-clothing` |
| Embroidery submenu | Father's Day | `embroidery-fathers-day` |
| Embroidery submenu | Mother's Day | `embroidery-mothers-day` |
| Embroidery submenu | Seasonal & Holidays | `embroidery-seasonal-holidays` |
| Embroidery submenu | Custom Designs | `embroidery-custom-designs` |
| Printing submenu | Popular designs | `printing-popular-designs` |
| Printing submenu | Custom | `printing-custom` |

Best Sellers is deliberately not a category. Set `is_featured = true` on any product to show it there while preserving its real category.

Examples:

```text
visible menu: Embroidery > Anime
React filter: embroidery-anime
database row: category = 'embroidery-anime'

visible menu: Printing > Custom
React filter: printing-custom
database row: category = 'printing-custom'
```

The normalization helper is `backend/docs/category_nomenclature_migration.sql`. Back up and review a shared database before running it. Changing `backend/init.sql` affects only newly initialized Docker volumes; it does not rewrite an existing volume.

#### Slug

- lowercase;
- hyphen-separated;
- unique;
- stable after publishing;
- if changed later, add redirects to preserve links/SEO.

#### Price

- store cents as integer (`$50.00 CAD` = `5000`);
- never store `$50.00` as a string;
- backend/Stripe must own final price calculation;
- define tax/shipping/discount rules before checkout.

#### Active state

- use `is_active = false` to hide a product;
- avoid deleting products that may be referenced by orders, analytics, or external URLs.

#### Featured state

- `Best Sellers` is not a category value;
- it is a cross-category merchandising view driven by `is_featured`;
- `GET /api/products?featured=true` and the Best Sellers React route implement it.

#### Inventory

- current convention: null means untracked;
- no code enforces stock or prevents overselling;
- define behavior for zero, made-to-order, custom, and limited-stock products before checkout.

#### Sale

Intended JSONB shape:

```json
{"enabled": true, "percent": 15}
```

Current code does not validate required keys, types, or the percent range. The seed script does not configure any sales. Consider a typed relational model (`sale_percent`, start/end timestamps) if sale rules become more complex.

---

## 21. Seed catalog

`init.sql` inserts 15 products using deterministic UUIDs and `ON CONFLICT (slug) DO NOTHING`:

| Category | Count | Products |
|---|---:|---|
| Kids | 11 | Original Kids Name Sign plus 10 detailed products |
| Home Decor | 1 | Maple Coaster |
| Ramadan Decor | 1 | Ramadan Lantern |
| Wall Art | 1 | Forest Wall Print |
| Business/Events | 1 | Business Plaque Small |

The 10 detailed Kids products are:

1. Montessori Wooden Puzzle - Fish Matching — 5000 cents;
2. Montessori Wooden Puzzle - Dinosaur Matching — 5000 cents;
3. Montessori Wooden Puzzle - Safari Animals Matching — 5000 cents;
4. Montessori Wooden Puzzle - Farm Animals Matching — 5000 cents;
5. Montessori Memory Game - Ramadan — 5000 cents;
6. Nursery Cloud Lamp Decor — 3000 cents, customizable;
7. Nursery Custom Animal Lamps Decor — 10000 cents, customizable;
8. Montessori Learning Daily Routine — 10000 cents;
9. Montessori Custom Name Puzzle Board — 5000 cents, customizable;
10. Montessori Busy Board: Natural Wood Activity Toy for Toddlers — 7000 cents.

The detailed Kids rows contain marketing descriptions, long descriptions, material, customization flags, and search tags. Review all age/safety and product-performance claims before launch.

### Important idempotency behavior

`ON CONFLICT DO NOTHING` prevents duplicates, but it also means modifying a seeded row in `init.sql` does not update an existing row with the same slug. A new database volume gets the new value; an old volume retains its current value. This is one reason proper migrations are needed.

---

## 22. Product operations before an admin interface

Until an admin UI exists, use DBeaver/psql carefully.

### Add a product

Insert all required fields and use a clean, stable slug. Also add it to the seed/migration history so a fresh environment reproduces it.

### Hide a product

```sql
UPDATE products
SET is_active = false, updated_at = now()
WHERE slug = '<slug>';
```

### Feature a product

```sql
UPDATE products
SET is_featured = true, updated_at = now()
WHERE slug = '<slug>';
```

This flag has no visible effect until the featured API/page is implemented.

### Configure a sale

```sql
UPDATE products
SET on_sale = '{"enabled": true, "percent": 15}'::jsonb,
    updated_at = now()
WHERE slug = '<slug>';
```

Validate the UI manually. This is display metadata only; checkout price protection does not exist.

### Export before reset

Use `pg_dump`, DBeaver export, or a reviewed JSON/CSV export. Never rely on the running Docker volume as the only copy of product work.

---

## 23. OpenAPI/Swagger and documentation drift

Runtime documentation endpoints:

- Swagger UI: `http://localhost:8081/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8081/v3/api-docs`
- OpenAPI YAML: `http://localhost:8081/v3/api-docs.yaml`

Export from the `backend` directory:

```bash
curl -s http://localhost:8081/v3/api-docs | python3 -m json.tool > docs/openapi.json
curl -s http://localhost:8081/v3/api-docs.yaml > docs/openapi.yaml
```

### Known stale artifacts

- `backend/docs/openapi.json` and `.yaml` do not reflect the full current DTO, especially newer fields such as sale configuration.
- `frontend/documents/products_table_data_dictionary.md` documents the older 12-column schema and lists expanded fields only as future suggestions.
- `backend/docs/BACKEND_OVERVIEW.md` documents the expanded schema up to tags but does not fully cover `on_sale` or the later frontend detail work.
- `backend/README.md` names the wrong database (`isa_products` instead of `isa_sd`) and still describes local `/assets` image placeholders.
- `backend/docs/products_202602231455.json` is a useful dated snapshot with 15 products, but it predates/does not include `on_sale` and contains `/assets/...` image values.

This handover records the audited current model, but the source-specific docs should still be repaired rather than permanently relying on this document to explain their inconsistencies.

---

## 24. Build, test, and verification record

### Commands

Frontend:

```bash
cd frontend
npm run dev
npm run build
npm run lint
npm run preview
```

Backend:

```bash
cd backend
./gradlew test
./gradlew bootRun
```

### 2026-07-19 audit results

- `npx tsc -b`: passed.
- `./gradlew test`: build passed, but Gradle reported `compileTestJava NO-SOURCE` and `test NO-SOURCE`; this proves compilation, not behavior.
- Gradle warned about deprecated features that will be incompatible with Gradle 10.
- Docker Desktop was not running, so PostgreSQL, backend startup against the database, live endpoints, and frontend-to-backend integration could not be reverified.
- Docker Compose reported that the top-level `version: '3.8'` key is obsolete.
- `npm run build` reached `vite ... building client environment for production` but did not finish within repeated observation windows and was interrupted. TypeScript itself passed. Diagnose the Vite build hang before claiming a clean production build.
- `npm run lint` also produced no completion/output within the observation period and was interrupted. Diagnose rather than assuming lint success/failure.

The early checked-in `backend/boot.log` shows a historical successful database connection and JPA initialization followed by web-server startup failure/process termination. It is stale and not a current health signal.

### Minimum regression checklist after catalog changes

1. Fresh database initializes without SQL errors.
2. Backend starts with schema validation.
3. all-products endpoint returns only active products.
4. `kids`, `Kids`, and `KIDS` return equivalent results.
5. nonexistent slug returns 404.
6. images field is always a JSON array in the API.
7. tags field is always a JSON array.
8. valid/invalid/null sale values behave predictably.
9. Kids page renders loading, error, empty, and success states.
10. every card opens the correct detail route.
11. image-dot clicks do not navigate.
12. broken images fall back without loops.
13. product detail works with zero, one, and multiple images.
14. responsive header/nav/grid/footer are checked on phone, tablet, and desktop.
15. production build and lint complete.

---

## 25. Known issues and risks, prioritized

### Critical / security

1. Git remote contains a personal access token. Revoke/rotate and remove it immediately.
2. No checkout/order implementation exists; do not treat the site as capable of accepting orders.
3. The Ask a Question form claims success without transmitting anything.
4. Browser sale calculations cannot be used as payable-price authority.

### High priority / blocks reliable catalog progress

1. Product detail work is uncommitted/untracked.
2. Fresh seed image identifiers conflict with the Cloudinary helper.
3. Production frontend build and lint currently hang in the audited environment.
4. No automated tests.
5. No database migrations; schema evolution depends on destructive reseeding/manual SQL.
6. OpenAPI/data docs are stale relative to current code.
7. Tracked build/cache/log artifacts create noisy, risky commits.
8. No mobile navigation.

### Functional incompleteness

- Other category pages missing.
- Search missing.
- Cart missing.
- product options/customization missing.
- inventory not enforced.
- inquiry/contact backend missing.
- footer destination pages missing.
- social/WhatsApp destinations are placeholders.
- no legal, shipping, return, privacy, or terms pages.
- no order tracking/login/reviews implementation.

### Backend hardening

- no request validation dependency/DTOs for future writes;
- no typed/validated sale model;
- no consistent error DTO/global exception handler;
- no pagination/sorting;
- no service layer;
- direct controller-created `ObjectMapper`;
- no explicit open-in-view setting;
- local credentials hardcoded;
- no profiles/environment config;
- no Actuator/health monitoring;
- no rate limiting/security headers/authentication;
- no production CORS/reverse-proxy decision.

### Frontend quality/accessibility/SEO

- duplicated product types and price logic;
- no shared API layer;
- no runtime response validation;
- no error boundary or route-level 404;
- basic text loading states only;
- accordion ARIA missing;
- no test suite;
- no metadata/structured product data;
- no analytics/consent plan;
- several buttons/links are inert or lead nowhere;
- product safety/marketing statements need business review.

---

## 26. Recommended next development order

### Phase 0 — Secure and preserve the repository

1. Revoke/rotate the exposed GitHub token and sanitize the remote URL.
2. Preserve and commit the current product-detail route/page and Kids navigation changes in a focused commit.
3. Add root/backend ignore rules and remove tracked generated artifacts in a separate cleanup commit.
4. Confirm the intended GitHub repository name/owner.

Definition of done: no credential in the remote, no feature work at risk, and `git status` is understandable.

### Phase 1 — Stabilize the catalog foundation

1. Diagnose Vite production-build and ESLint hangs.
2. Start Docker and verify a clean DB reset, backend boot, API calls, and frontend integration.
3. Resolve Cloudinary public IDs in `init.sql` and verify every image.
4. Extract shared `Product`, `OnSale`, price formatting, `ProductCard`, and API functions.
5. Add frontend tests for pricing/cards and backend controller/repository/mapping tests.
6. Add Flyway migrations and stop treating `init.sql` as the sole evolving schema mechanism.
7. Refresh OpenAPI exports and source-specific documentation.

Definition of done: fresh clone/setup works reproducibly; build/lint/tests pass; catalog images and routes work.

### Phase 2 — Complete browsing

Completed foundation:

- reusable category page and shared product grid/card;
- database-backed Kids, Wall Art, Business/Events, legacy Home Decor, Embroidery submenu, and Printing submenu routes;
- `featured=true` backend query and database-backed Best Sellers page;
- lowercase hyphenated category nomenclature.

Remaining:

1. Populate/verify all catalog categories with real products and Cloudinary images.
2. Replace placeholder homepage with real featured/category content.
3. Implement mobile navigation.
4. Implement real search or remove inactive search controls until ready.
5. Add route 404, loading skeletons, better error states, accessibility, and SEO metadata.

### Phase 3 — Product configuration and cart

1. Decide product specification, option, and customization data model.
2. Add dimensions, age/safety, mounting, included parts, lead time, and other category-relevant fields.
3. Complete product detail selection UI.
4. Create cart state/store and local-storage persistence.
5. Add cart page, quantity updates, removal, validation, and backend price refresh.

### Phase 4 — Orders and Stripe

1. Design `orders` and `order_items` with immutable product/price snapshots.
2. Add server-side Checkout Session creation.
3. Add authenticated Stripe webhook signature verification and idempotency.
4. Define statuses such as pending payment, paid, in production, fulfilled, cancelled, and refunded.
5. Define tax, shipping, discount, inventory, and customization rules.
6. Add customer confirmation and owner fulfillment notifications.
7. Never mark an order paid from a browser redirect alone.

### Phase 5 — Launch readiness

1. Legal/policy/contact pages and accurate footer destinations.
2. Production frontend/backend/database/Cloudinary/Stripe configuration.
3. HTTPS/domain/reverse proxy and CORS decision.
4. Backups, monitoring, logs, alerts, and health checks.
5. CI for build, lint, tests, and migrations.
6. Staging end-to-end checkout tests.
7. Accessibility, device, performance, and SEO audit.
8. Operational launch/rollback checklist.

---

## 27. Architecture decisions to preserve

Keep these decisions unless a future change explicitly supersedes them:

- PostgreSQL/catalog data is the product source of truth.
- React should render product data rather than hardcode products.
- DTOs stay separate from persistence entities.
- Public catalog queries filter `is_active = true`.
- Categories are case-insensitive at the API boundary.
- Best Sellers is a featured/merchandising concept, not a category row value.
- Prices are stored in cents and verified server-side.
- Cloudinary public IDs are stored instead of hardcoded transformed URLs.
- Products are deactivated rather than deleted.
- guest checkout is the initial commerce model.
- top header row scrolls naturally and the second row remains sticky.
- avoid complex scroll-collapse animation that caused flicker.
- Quicksand is the primary interface font; Aoki is selective display typography.
- reusable theme tokens are preferred to scattered color values.
- API documentation should be generated and versioned.

Avoid:

- returning JPA entities directly;
- exposing secrets through Vite variables;
- trusting frontend prices/discounts;
- manually changing an existing DB without a matching seed/migration change;
- storing formatted prices;
- hardcoding product lists into category pages;
- deleting products referenced by business history;
- assuming a successful browser redirect means payment succeeded;
- committing generated build/cache/log files;
- destructive Git cleanup while uncommitted product detail work exists.

---

## 28. Instructions for the next development agent

Before editing:

1. Read this document.
2. Run `git status --short` and inspect uncommitted frontend changes.
3. Do not delete/reset `ProductDetailPage.tsx`.
4. Do not expose or repeat the Git remote credential.
5. Check Docker state before diagnosing backend connection failures.
6. Treat `init.sql`, current Java model/DTO/controller, and current frontend types together when changing product fields.
7. State whether a conclusion is from current code, checked-in historical docs, or live runtime verification.

After editing:

1. run the smallest relevant checks and then the full available build/lint/test set;
2. verify affected routes/API endpoints;
3. update OpenAPI and schema docs when contracts change;
4. append a dated entry below;
5. report any checks that could not run and why;
6. keep feature commits separate from repository-hygiene changes.

---

## 29. Development Journal / Daily Handoffs

Append new entries at the top of this section, directly below this instruction. Keep older entries.

### 2026-07-23 — Custom Embroidery validation and item-aware placement

**Decisions**

- Standardized the customer-facing business name as **Thread & Butter** in the custom-flow UI, planning document, and this handover.
- Customers must complete each card before advancing; future progress labels can no longer bypass validation.
- Artwork upload requirements now depend on the selected artwork-handling option.
- Item selection is mandatory and controls which embroidery placements are available.

**Work completed**

- Added per-card validation with visible, field-specific error messages.
- Added explicit email-format validation.
- Restricted the phone field to digits and validated a length of 10–15 digits.
- Removed Next/Back/progress navigation scrolling so the browser stays at the customer's current page position.
- Increased the contrast of every `(optional)` marker using the dark-brown theme colour.
- Required an artwork-handling selection; exact-upload and inspiration modes require an image, while generate and manual-review modes keep the image optional.
- Added Beanie and Hat to the item choices.
- Required an item type for both customer-supplied and business-supplied items.
- Added item-specific placement sets and automatic clearing of a placement that becomes invalid after an item change.
- Required both width and height when the customer chooses a known embroidery size.
- Simplified the Item card so both provider choices share one item selector; only `Other` reveals the shared item-description field.
- Updated successful Next/Back navigation to scroll just above the progress tabs because card heights differ.
- Compacted the page introduction and form layout, removed repeated card-header descriptions, and increased the visibility of the footer step count.
- Kept the quantity guidance immediately above the quantity control on card six.
- Updated the artwork notice to state one AI concept image per user account daily and reduced the upload picker to a compact clickable box.
- On the Preview card, the forward button reads **Generate AI preview** for generate/inspiration modes and **Review details** for exact-upload/manual-review modes.
- Kept final submission as a frontend-only prototype and added full-request revalidation.

**Verification**

- Frontend TypeScript compilation passed after the changes.
- No backend, database, upload, AI, or notification behavior was added.

---

### 2026-07-22 — Custom Embroidery multi-step UI prototype

**Scope decision**

- Implemented UI only for `/embroidery/custom-designs`.
- Customer information is the first card and final review/submit is the last.
- Limited the first version to one uploaded image and one future AI concept.
- Explicitly excluded AI image editing, regeneration, variations, backend persistence, estimates, and real submission.

**Work completed**

- Added `CustomEmbroideryPage.tsx` with eight labeled cards: Customer, Idea, Artwork, Item, Placement, Quantity, Preview, and Submit.
- Added clickable progress labels showing the current/completed cards.
- Added Back/Next arrow navigation with persistent React form state.
- Added conditional contact, item, placement, and size inputs.
- Added one-image client-side type/size validation and temporary local preview.
- Added AI/manual artwork-mode choices while clearly marking AI functionality as future work.
- Added request summaries, agreements, completeness feedback, and an honest UI-only confirmation state.
- Routed `/embroidery/custom-designs` to the custom UI instead of the ordinary database category grid.
- Documented current behavior, pseudocode, limits, and backend boundaries in this handover.

**Verification**

- Frontend TypeScript compilation passed.
- `git diff --check` passed.
- No backend/API/schema code was added for this UI prototype.

**Recommended next task**

- Review the page visually and adjust step count, copy, field grouping, colours, spacing, and card layout before defining the request DTO/database/API.

---

### 2026-07-21 — Category nomenclature and shared catalog rendering

**Decision**

- `products.category` is now a lowercase, hyphen-separated machine identifier describing the product's menu/submenu location.
- Example: Embroidery > Anime uses `embroidery-anime`.
- Customer-facing labels remain formatted normally and do not have to match the stored identifier.
- Best Sellers remains the exception and uses `is_featured = true`, not a category value.

**Work completed**

- Updated all Embroidery and Printing React collection filters to canonical identifiers.
- Updated Kids to request `kids`.
- Converted Wall Art, Business/Events, and the retained direct Home Decor route from skeletons to the same shared database product grid.
- Converted Best Sellers to the shared product grid using a new `featured=true` API filter.
- Added the backend repository/controller featured query.
- Normalized all `backend/init.sql` category values for new database volumes.
- Added `backend/docs/category_nomenclature_migration.sql` for reviewing/normalizing existing databases.
- Updated the Embroidery and Printing population guides.
- Added simple React explanations and pseudocode to this handover.

**Canonical submenu values**

- Embroidery: `embroidery-anime`, `embroidery-baby-clothing`, `embroidery-fathers-day`, `embroidery-mothers-day`, `embroidery-seasonal-holidays`, `embroidery-custom-designs`.
- Printing: `printing-popular-designs`, `printing-custom`.

**Verification**

- Frontend TypeScript compilation passed.
- Backend Java compilation passed.
- `git diff --check` passed.

**Existing database warning**

- Updating `init.sql` does not change an existing Docker database volume. Inspect the live categories and apply the reviewed normalization SQL only where needed.

---

### 2026-07-21 — Printing dropdown and collection pages

**Work completed**

- Added a Printing dropdown immediately to the right of Embroidery.
- Added Popular designs and Custom Printing collection routes.
- Removed Home Decor from the visible header navigation while retaining `/home-decor` for direct-link compatibility.
- Extracted both Embroidery and Printing menu behavior into the reusable `NavDropdown` component.
- Added `frontend/documents/printing_catalog_guide.md` with exact database categories and SQL examples.

**Database/API contract**

- No schema or backend API changes.
- At that stage the Printing pages temporarily used display-style category values. These were superseded later the same day by `printing-popular-designs` and `printing-custom`.
- No placeholder products were inserted.

**Verification**

- Frontend TypeScript passed with the non-incremental project check.
- `git diff --check` passed.

**Recommended next task**

- Add real Printing products with verified Cloudinary public IDs, then visually verify both dropdowns and collection pages across viewport sizes.

---

### 2026-07-20 — Embroidery navigation and collection pages

**Work completed**

- Replaced the Ramadan Decor navigation link with an Embroidery button-only dropdown trigger.
- Added Anime, Baby clothing, Father's Day, Mother's Day, Seasonal & Holidays, and Custom Designs menu links.
- Added one API-driven route for each Embroidery collection.
- Added legacy redirects for `/embroidery` and `/ramadan-decor`.
- Extracted the Kids grid/card implementation into reusable `CategoryPage`, `ProductCard`, and shared product types.
- Kept the Kids route on the same reusable catalog implementation.
- Added `frontend/documents/embroidery_catalog_guide.md` with category mappings, SQL examples, product guidance, Cloudinary rules, and reset warnings.

**Database/API contract**

- No schema or API code changed.
- At that stage pages temporarily used display-style category values prefixed by `Embroidery - `. These were superseded on 2026-07-21 by lowercase hyphenated identifiers such as `embroidery-anime`.
- No seed products were invented or reclassified; empty pages show an intentional empty state.

**Verification**

- Changed frontend TypeScript passed with `tsc -p tsconfig.app.json --noEmit --incremental false`.
- `git diff --check` passed.
- ESLint continues to stall without output in the current environment and was interrupted; no lint result is claimed.

**Unrelated work preserved**

- Existing Brand, Footer, index, Gradle-cache, and `threadnbutter` asset changes were not modified as part of this feature.

**Recommended next task**

- Add real Embroidery products with verified Cloudinary public IDs using the new catalog guide, then visually test dropdown positioning and each collection at mobile/tablet/desktop widths.

---

### 2026-07-19 — Comprehensive Codex audit and handover creation

**Work completed**

- Read all supplied project history and documentation.
- Audited current frontend/backend source, Git history, working tree, configuration, schema, seed data, assets, and docs.
- Created this canonical Markdown handover.
- Distinguished historical states from current implementation and identified documentation drift.

**Verification**

- Frontend TypeScript build passed via `npx tsc -b`.
- Backend Gradle build/test task passed with no test sources.
- Docker/live DB/API integration could not be rerun because Docker Desktop was stopped.
- Vite production build and ESLint did not complete in the audit window and were interrupted; both require diagnosis.

**Files changed by this handover task**

- `IsaSignsHandoverDoc.md` added.

**Important discoveries**

- Git remote contains an exposed personal access token.
- Product detail work is uncommitted/untracked.
- generated Gradle/build artifacts are tracked.
- seed image paths do not match the Cloudinary public-ID design.
- source docs/OpenAPI exports are stale.
- most ecommerce behavior remains planned.

**Next action**

- Secure Git credentials and preserve/commit current feature work before further implementation.

---

### Daily entry template

Copy this block for each session:

```markdown
### YYYY-MM-DD — Short session title

**Goal**

- 

**Work completed**

- 

**Files changed**

- 

**Database/migration changes**

- None / details

**API contract changes**

- None / details

**Frontend behavior changes**

- None / details

**Decisions and rationale**

- 

**Commands/checks run**

- `command` — passed/failed/not run

**Known bugs or blockers**

- 

**Uncommitted work**

- 

**Recommended next task**

- 

**Agent notes**

- 
```

---

## 30. Source material used

This handover was built from the following repository sources:

- `IsaSignsAndDesignsDoc.txt` — early status and execution plan, last updated 2026-02-21;
- `IsasSignsDesigns_Copilot_Chat_Project_Handoff.txt` — consolidated prior chat/project handoff;
- `backend/docs/BACKEND_OVERVIEW.md` — detailed backend overview, last updated 2026-02-23;
- `frontend/documents/products_table_data_dictionary.md` — original products-table dictionary;
- `backend/docs/openapi.json` and `backend/docs/openapi.yaml` — stale generated API snapshots;
- `backend/docs/products_202602231455.json` — dated 15-product database export;
- all audited source/configuration files under `frontend` and `backend`;
- Git commit history and current working tree;
- local build/tool/runtime diagnostic commands run on 2026-07-19.

When this document conflicts with a future migration or implementation, update this handover as part of that change.
