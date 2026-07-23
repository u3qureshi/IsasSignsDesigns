# Embroidery Catalog Population Guide

The Embroidery navigation contains six database-backed collection pages. Each page calls the existing product API with one exact category value.

## Page-to-category mapping

| Page | Route | Exact `products.category` value |
|---|---|---|
| Anime | `/embroidery/anime` | `embroidery-anime` |
| Baby clothing | `/embroidery/baby-clothing` | `embroidery-baby-clothing` |
| Father's Day | `/embroidery/fathers-day` | `embroidery-fathers-day` |
| Mother's Day | `/embroidery/mothers-day` | `embroidery-mothers-day` |
| Seasonal & Holidays | `/embroidery/seasonal-holidays` | `embroidery-seasonal-holidays` |
| Custom Designs | `/embroidery/custom-designs` | `embroidery-custom-designs` |

All category identifiers use lowercase words separated by hyphens. Use the exact values above.

## What products belong in each collection

- **Anime:** embroidered anime-inspired shirts, hoodies, hats, bags, patches, or character-style designs that the business has the legal right to sell.
- **Baby clothing:** embroidered bodysuits, sleepers, bibs, sweaters, hats, blankets, and personalized name/birth-detail items.
- **Father's Day:** dad/grandfather apparel, hats, workwear, hobby designs, children's handwriting designs, and personalized gifts.
- **Mother's Day:** mom/grandmother apparel, totes, sweaters, floral designs, children's handwriting designs, and personalized gifts.
- **Seasonal & Holidays:** Ramadan, Eid, winter, autumn, spring, graduation, back-to-school, and other time-limited embroidered products.
- **Custom Designs:** products where the customer supplies wording, names, artwork, a business logo, or another approved design.

Avoid copyrighted characters, logos, or artwork unless Isa's Signs & Designs owns the work or has permission/licensing to sell it.

## Required product data

At minimum, every product needs:

- a unique lowercase hyphenated `slug`;
- a customer-facing `name`;
- a short `description`;
- one of the exact Embroidery category values;
- `price_cents` as an integer (`3500` means `$35.00`);
- `currency`, normally `CAD`;
- `images` as a JSON array of Cloudinary public IDs;
- `material`;
- an `is_customizable` value;
- relevant search `tags`;
- a detailed `long_description` for the product page.

Optional fields include `is_featured`, `stock_qty`, and `on_sale`.

## Add a product to the current local database

Start Docker Desktop and the database:

```bash
cd backend
docker compose up -d
```

Open PostgreSQL:

```bash
docker exec -it isasigns_db psql -U isa_user -d isa_sd
```

Insert a product. Replace every example value with real product information:

```sql
INSERT INTO products (
  slug,
  name,
  description,
  long_description,
  category,
  price_cents,
  currency,
  images,
  material,
  is_active,
  is_featured,
  stock_qty,
  is_customizable,
  tags,
  on_sale
) VALUES (
  'embroidered-baby-name-sweater',
  'Personalized Baby Name Sweater',
  'A soft baby sweater embroidered with a custom name.',
  'Replace this with the complete product description, available sizes, thread colours, care instructions, turnaround time, and customization details.',
  'embroidery-baby-clothing',
  4500,
  'CAD',
  '["embroidery/baby-name-sweater-front", "embroidery/baby-name-sweater-detail"]',
  'cotton blend',
  true,
  false,
  null,
  true,
  ARRAY['embroidery', 'baby', 'sweater', 'personalized', 'name', 'gift'],
  null
);
```

The `images` values must be Cloudinary public IDs, not local `/assets/...` paths and not Cloudinary API secrets. The frontend adds delivery transformations automatically.

Refresh the matching page after inserting. Vite proxies the page's request to, for example:

```http
GET /api/products?category=embroidery-baby-clothing
```

## Verify collection data

```sql
SELECT slug, name, category, price_cents, is_active
FROM products
WHERE category LIKE 'embroidery-%'
ORDER BY category, name;
```

Test one collection directly:

```bash
curl "http://localhost:8081/api/products?category=embroidery-baby-clothing"
```

## Move or correct an existing product

```sql
UPDATE products
SET category = 'embroidery-seasonal-holidays',
    updated_at = now()
WHERE slug = '<existing-product-slug>';
```

Only reclassify a product when it is actually an embroidery product. The existing seeded Ramadan Lantern is decor rather than embroidery, so it should not automatically be moved into the new Seasonal & Holidays collection.

## Hide a product without deleting it

```sql
UPDATE products
SET is_active = false,
    updated_at = now()
WHERE slug = '<product-slug>';
```

Inactive products are excluded by the public API.

## Configure a sale

```sql
UPDATE products
SET on_sale = '{"enabled": true, "percent": 15}'::jsonb,
    updated_at = now()
WHERE slug = '<product-slug>';
```

The product cards will display the calculated sale price. A future checkout backend must independently validate the payable price.

## Keep fresh environments reproducible

Direct SQL changes update only the current database volume. Until Flyway migrations or an admin catalog system exists, also add approved products to `backend/init.sql` or maintain a reviewed catalog import so a database reset does not lose them.

Remember that `init.sql` runs only when PostgreSQL creates an empty Docker volume. To rebuild from it:

```bash
cd backend
docker compose down -v
docker compose up -d
```

This deletes the current local database. Export valuable product data first.
