INSERT INTO products (
  id, slug, name, description, long_description, category, price_cents, currency,
  images, material, is_active, is_featured, is_customizable, tags
) VALUES (
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/always-cold-embroidered-hoodie'),
  'always-cold-embroidered-hoodie',
  'Always Cold Embroidered Hoodie',
  'A cozy embroidered hoodie with bold chest lettering and a playful matching message along the sleeve.',
  'Always Cold Embroidered Hoodie pairs clean white chest embroidery with a witty cold-weather detail stitched along the sleeve. The relaxed pullover silhouette and simple two-placement design make it an easy everyday layer for chilly days. Both gallery images show the embroidery placement and garment details from complementary angles.',
  'gallery', 6000, 'CAD',
  '["thread-and-butter/gallery/always-cold-embroidered-hoodie/image-1","thread-and-butter/gallery/always-cold-embroidered-hoodie/image-2"]',
  'Apparel garment with embroidered decoration', true, false, false,
  ARRAY['gallery', 'hoodie', 'hoodies-sweatshirts', 'embroidered', 'seasonal', 'autumn', 'winter', 'funny', 'embroidery-seasonal-holidays']::text[]
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  category = EXCLUDED.category,
  price_cents = EXCLUDED.price_cents,
  currency = EXCLUDED.currency,
  images = EXCLUDED.images,
  material = EXCLUDED.material,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  is_customizable = EXCLUDED.is_customizable,
  tags = EXCLUDED.tags,
  updated_at = now();
