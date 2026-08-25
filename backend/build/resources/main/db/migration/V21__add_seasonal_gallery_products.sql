INSERT INTO products (
  id, slug, name, description, long_description, category, price_cents, currency,
  images, material, is_active, is_featured, is_customizable, tags
) VALUES
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/black-cat-broomstick-embroidered-crewneck'),
  'black-cat-broomstick-embroidered-crewneck',
  'Black Cat & Broomstick Embroidered Crewneck',
  'An embroidered crewneck featuring a black cat perched on a broom beneath a celestial night-sky motif.',
  'Black Cat & Broomstick Embroidered Crewneck brings a playful Halloween mood to an easy-to-layer sweatshirt. The detailed cat, broom, moon, stars, and celestial accents are arranged as a balanced front design and finished with embroidery for added texture. Garment colour and sizing are selected before purchase; follow the included care guidance to help protect the decoration.',
  'gallery', 6000, 'CAD',
  '["thread-and-butter/gallery/black-cat-broomstick-embroidered-crewneck/image-1"]',
  'Apparel garment with embroidered decoration', true, false, false,
  ARRAY['gallery', 'crewneck-sweatshirt', 'hoodies-sweatshirts', 'embroidered', 'seasonal', 'autumn', 'halloween', 'black-cat', 'embroidery-seasonal-holidays']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/cozy-season-autumn-embroidered-crewneck'),
  'cozy-season-autumn-embroidered-crewneck',
  'Cozy Season Autumn Embroidered Crewneck',
  'A warm embroidered crewneck celebrating cozy autumn days with books, pumpkins, candles, leaves, and coffee.',
  'Cozy Season Autumn Embroidered Crewneck gathers favourite fall details into a relaxed, easy-to-wear design. A candle, pumpkin, stacked books, maple leaf, and takeaway cup sit above the embroidered cozy-season script for a polished seasonal finish. The two gallery images show the placement and stitch detail from complementary views.',
  'gallery', 6000, 'CAD',
  '["thread-and-butter/gallery/cozy-season-autumn-embroidered-crewneck/image-1","thread-and-butter/gallery/cozy-season-autumn-embroidered-crewneck/image-2"]',
  'Apparel garment with embroidered decoration', true, false, false,
  ARRAY['gallery', 'crewneck-sweatshirt', 'hoodies-sweatshirts', 'embroidered', 'seasonal', 'autumn', 'cozy', 'embroidery-seasonal-holidays']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/spooky-goose-costume-parade-embroidered-crewneck'),
  'spooky-goose-costume-parade-embroidered-crewneck',
  'Spooky Goose Costume Parade Embroidered Crewneck',
  'An embroidered Halloween crewneck featuring a playful parade of geese dressed in spooky costumes.',
  'Spooky Goose Costume Parade Embroidered Crewneck turns a Halloween cast of skeleton, mummy, reaper, and ghost geese into a lively stitched front design. Three product images highlight the artwork across multiple sweatshirt colours and closer viewing angles. It is a cheerful seasonal layer designed for crisp autumn days and Halloween gatherings.',
  'gallery', 6000, 'CAD',
  '["thread-and-butter/gallery/spooky-goose-costume-parade-embroidered-crewneck/image-1","thread-and-butter/gallery/spooky-goose-costume-parade-embroidered-crewneck/image-2","thread-and-butter/gallery/spooky-goose-costume-parade-embroidered-crewneck/image-3"]',
  'Apparel garment with embroidered decoration', true, false, false,
  ARRAY['gallery', 'crewneck-sweatshirt', 'hoodies-sweatshirts', 'embroidered', 'seasonal', 'autumn', 'halloween', 'goose', 'funny', 'embroidery-seasonal-holidays']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/autumn-spooky-goose-embroidered-hoodie'),
  'autumn-spooky-goose-embroidered-hoodie',
  'Autumn Spooky Goose Embroidered Hoodie',
  'An embroidered hoodie featuring costumed geese, pumpkins, flowers, and greenery in an autumn parade.',
  'Autumn Spooky Goose Embroidered Hoodie combines playful Halloween characters with softer botanical details. Ghost, witch, autumn, and pumpkin geese alternate with embroidered greenery and flowers across the chest, creating a seasonal design that feels festive without losing everyday wearability. The artwork is scaled as a clean horizontal composition for the hoodie front.',
  'gallery', 6000, 'CAD',
  '["thread-and-butter/gallery/autumn-spooky-goose-embroidered-hoodie/image-1"]',
  'Apparel garment with embroidered decoration', true, false, false,
  ARRAY['gallery', 'hoodie', 'hoodies-sweatshirts', 'embroidered', 'seasonal', 'autumn', 'halloween', 'goose', 'funny', 'embroidery-seasonal-holidays']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/in-my-cozy-era-embroidered-sweatshirt'),
  'in-my-cozy-era-embroidered-sweatshirt',
  'In My Cozy Era Embroidered Sweatshirt',
  'A cozy embroidered sweatshirt design featuring a knit hat, yarn, needles, warm drink, and playful lettering.',
  'In My Cozy Era Embroidered Sweatshirt celebrates slow afternoons, handmade hobbies, and cold-weather comfort. A knit hat, yarn and needles, warm mug, and colourful yarn frame the stitched phrase across the front. Gallery images show how the same seasonal artwork reads on both hoodie and crewneck silhouettes; available garment choices should be confirmed before production.',
  'gallery', 6000, 'CAD',
  '["thread-and-butter/gallery/in-my-cozy-era-embroidered-sweatshirt/image-1","thread-and-butter/gallery/in-my-cozy-era-embroidered-sweatshirt/image-2"]',
  'Apparel garment with embroidered decoration', true, false, false,
  ARRAY['gallery', 'sweatshirt', 'hoodies-sweatshirts', 'embroidered', 'seasonal', 'autumn', 'winter', 'cozy', 'crafting', 'embroidery-seasonal-holidays']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/winter-cardinal-embroidered-crewneck'),
  'winter-cardinal-embroidered-crewneck',
  'Winter Cardinal Embroidered Crewneck',
  'An embroidered crewneck featuring a vivid red cardinal resting on a snow-dusted berry branch.',
  'Winter Cardinal Embroidered Crewneck places a richly stitched red cardinal against a delicate branch, winter berries, and touches of snow. The compact chest composition stands out cleanly against the sweatshirt while keeping the overall look refined and easy to wear throughout the colder season. A detail image highlights the layered thread work and colour contrast.',
  'gallery', 6000, 'CAD',
  '["thread-and-butter/gallery/winter-cardinal-embroidered-crewneck/image-1","thread-and-butter/gallery/winter-cardinal-embroidered-crewneck/image-2"]',
  'Apparel garment with embroidered decoration', true, false, false,
  ARRAY['gallery', 'crewneck-sweatshirt', 'hoodies-sweatshirts', 'embroidered', 'seasonal', 'winter', 'cardinal', 'nature', 'holiday-gift', 'embroidery-seasonal-holidays']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/winter-hockey-geese-embroidered-crewneck'),
  'winter-hockey-geese-embroidered-crewneck',
  'Winter Hockey Geese Embroidered Crewneck',
  'A playful embroidered crewneck featuring a team of Canadian geese ready for winter hockey.',
  'Winter Hockey Geese Embroidered Crewneck brings together cold-weather humour and a favourite Canadian sport. Four geese arrive in coordinated blue hockey gear with sticks, skates, a puck, and a spirited team flag, all arranged as a crisp embroidered front design. It is an easy seasonal choice for rink days, hockey fans, and winter gifting.',
  'gallery', 6000, 'CAD',
  '["thread-and-butter/gallery/winter-hockey-geese-embroidered-crewneck/image-1"]',
  'Apparel garment with embroidered decoration', true, false, false,
  ARRAY['gallery', 'crewneck-sweatshirt', 'hoodies-sweatshirts', 'embroidered', 'seasonal', 'winter', 'hockey', 'canadian', 'goose', 'funny', 'embroidery-seasonal-holidays']::text[]
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
