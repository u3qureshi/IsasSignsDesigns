# Isa’s Signs & Designs — Data Dictionary

This document defines the current catalog table used by the storefront API.

---

## Overview
- **DB Name:** `isa_sd`
- **DB Schema:** `public`
- **Table:** `products`
- **Purpose:** Stores product catalog data for storefront listing and product detail pages.
- **Primary Key:** `id`
- **Unique Key:** `slug` (`products_slug_key`)

---

## Current Table Definition (DDL)

```sql
CREATE TABLE public.products (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  slug varchar(255) NOT NULL,
  "name" varchar(255) NOT NULL,
  description text NULL,
  category varchar(100) NULL,
  price_cents int8 DEFAULT 0 NOT NULL,
  currency varchar(10) DEFAULT 'CAD'::character varying NOT NULL,
  images text NULL,
  material varchar(100) NULL,
  is_active bool DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NULL,
  updated_at timestamptz DEFAULT now() NULL,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_slug_key UNIQUE (slug)
);
```

---

## Data Dictionary (Column-by-column)

### 1) `id`
- **Type:** `uuid`
- **Nullability:** NOT NULL
- **Default:** `uuid_generate_v4()`
- **Constraint:** Primary key (`products_pkey`)
- **Description:** Internal unique identifier for each product record.

---

### 2) `slug`
- **Type:** `varchar(255)`
- **Nullability:** NOT NULL
- **Constraint:** Unique (`products_slug_key`)
- **Description:** URL-friendly unique identifier used in storefront routes.
  - Example: `ramadan-lantern` → `/product/ramadan-lantern`

**Recommended rules**
- Lowercase
- Hyphen-separated
- Stable over time (avoid changing after launch unless you implement redirects)

---

### 3) `"name"`
- **Type:** `varchar(255)`
- **Nullability:** NOT NULL
- **Description:** Display name shown on product cards and product detail pages.

> Note: Stored as `"name"` (quoted identifier).

---

### 4) `description`
- **Type:** `text`
- **Nullability:** NULL
- **Description:** Short description/summary used for product cards and quick previews.

---

### 5) `category`
- **Type:** `varchar(100)`
- **Nullability:** NULL
- **Description:** Category label used for navigation and filtering.
  - Examples: `Kids`, `Home Decor`, `Business/Events`, `Wall Art`, `Ramadan Decor`

---

### 6) `price_cents`
- **Type:** `int8` (BIGINT)
- **Nullability:** NOT NULL
- **Default:** `0`
- **Description:** Price stored in minor units (cents).
  - Example: `$19.99 CAD` → `1999`

---

### 7) `currency`
- **Type:** `varchar(10)`
- **Nullability:** NOT NULL
- **Default:** `'CAD'`
- **Description:** Currency code for price display and checkout.
  - Example: `CAD`

---

### 8) `images`
- **Type:** `text`
- **Nullability:** NULL
- **Description:** Serialized image list stored as text (commonly a JSON string).
  - Example stored value: `["/assets/kids1.jpg"]`

**Notes**
- This is fine for MVP.
- Common future upgrades (optional):
  - `images jsonb` (recommended), or
  - `images text[]`, or
  - A separate `product_images` table (ordered images + alt text)

---

### 9) `material`
- **Type:** `varchar(100)`
- **Nullability:** NULL
- **Description:** Material label used for filtering/display.
  - Examples: `wood`, `acrylic`, `metal`, `paper`

---

### 10) `is_active`
- **Type:** `bool`
- **Nullability:** NOT NULL
- **Default:** `true`
- **Description:** Soft visibility flag.
  - `true` → product is returned to storefront queries and available for viewing
  - `false` → product is hidden (kept for history/admin/SEO decisions)

---

### 11) `created_at`
- **Type:** `timestamptz`
- **Nullability:** NULL
- **Default:** `now()`
- **Description:** Record creation timestamp (server time). Useful for “Newest” sorting.

---

### 12) `updated_at`
- **Type:** `timestamptz`
- **Nullability:** NULL
- **Default:** `now()`
- **Description:** Last updated timestamp. Useful for cache invalidation and admin edits.

---

## Constraints

- **Primary Key:** `products_pkey` on (`id`)
- **Unique:** `products_slug_key` on (`slug`)

---

## Example Product Record (shape)

```json
{
  "id": "e5f9c885-acda-4028-8a57-cf4e0ee6142c",
  "slug": "kids-name-sign",
  "name": "Kids Name Sign",
  "description": "Personalized name sign for kids",
  "category": "Kids",
  "priceCents": 2599,
  "currency": "CAD",
  "images": ["/assets/kids1.jpg"],
  "material": "acrylic",
  "isActive": true,
  "createdAt": "2026-02-21T07:31:47.474497Z",
  "updatedAt": "2026-02-21T07:31:47.474497Z"
}
```

---

## API Usage Notes

- **List products:** `GET /api/products?category=Kids`
- **Product detail:** `GET /api/products/{slug}`
- The API typically returns only `is_active = true` products.

---

## Future-friendly additions (optional)

If you later want homepage “bestsellers”, inventory tracking, product customization flags, and tags/search, these are commonly added:
- `is_featured boolean`
- `stock_qty integer`
- `is_customizable boolean`
- `tags text[]`
- `long_description text`

(Only add when you’re ready; your current schema is a solid MVP.)
