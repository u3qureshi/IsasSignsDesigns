# Printing Catalog Population Guide

The Printing dropdown contains two database-backed collection pages:

| Page | Route | Exact `products.category` value |
|---|---|---|
| Popular designs | `/printing/popular-designs` | `printing-popular-designs` |
| Custom | `/printing/custom` | `printing-custom` |

Use **Popular designs** for ready-to-order printed products and **Custom** for products where the customer supplies or personalizes wording, artwork, photos, branding, or another approved design.

Add products through PostgreSQL using the same workflow described in `embroidery_catalog_guide.md`. The important difference is the category value.

Example ready-to-order product:

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
  'printed-example-design',
  'Printed Example Design',
  'Replace this with a short customer-facing description.',
  'Replace this with print method, garment or product details, sizes, colours, care instructions, and turnaround time.',
  'printing-popular-designs',
  3500,
  'CAD',
  '["printing/example-design-front"]',
  'cotton',
  true,
  false,
  null,
  false,
  ARRAY['printing', 'popular-design'],
  null
);
```

For a customizable product, use:

```sql
UPDATE products
SET category = 'printing-custom',
    is_customizable = true,
    updated_at = now()
WHERE slug = '<product-slug>';
```

Image values must be Cloudinary public IDs, not local `/assets/...` paths. Do not use copyrighted characters, logos, photographs, or artwork unless the business owns the work or has permission/licensing to sell it.

Verify both Printing collections:

```sql
SELECT slug, name, category, price_cents, is_customizable, is_active
FROM products
WHERE category LIKE 'printing-%'
ORDER BY category, name;
```

No placeholder Printing products are seeded automatically. Until migrations or an admin catalog exists, reflect approved products in `backend/init.sql` or a reviewed import so a database reset does not lose them.
