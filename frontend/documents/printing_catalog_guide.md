# Printing Catalog Population Guide

The Printing dropdown contains one tag-backed product collection plus the Custom Printing Studio:

| Page | Route | Exact collection tag |
|---|---|---|
| Popular designs | `/printing/popular-designs` | `printing-popular-designs` |
| Custom | `/printing/custom` | Opens the studio; it is not a product collection |

Use **Popular designs** for ready-to-order printed products and **Custom** for products where the customer supplies or personalizes wording, artwork, photos, branding, or another approved design.

Gallery products remain in category `gallery`. Add `printed` and `printing-popular-designs` to
their `tags` array so the same record appears in Gallery and Popular designs.

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
  'gallery',
  3500,
  'CAD',
  '["printing/example-design-front"]',
  'cotton',
  true,
  false,
  null,
  false,
  ARRAY['gallery', 'printed', 'printing-popular-designs'],
  null
);
```

For a customizable product, use:

```sql
UPDATE products
SET is_customizable = true,
    updated_at = now()
WHERE slug = '<product-slug>';
```

Image values must be Cloudinary public IDs, not local `/assets/...` paths. Do not use copyrighted characters, logos, photographs, or artwork unless the business owns the work or has permission/licensing to sell it.

Verify both Printing collections:

```sql
SELECT slug, name, category, price_cents, is_customizable, is_active
FROM products
WHERE 'printing-popular-designs' = ANY(tags)
ORDER BY name;
```

Flyway V20 assigns every active Gallery product tagged `printed` to Popular designs. Add future
approved products through a reviewed migration or catalog-management workflow so fresh databases
receive the same collection membership.
