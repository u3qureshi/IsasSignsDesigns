INSERT INTO products (
  id, slug, name, description, long_description, category, price_cents, currency,
  images, material, is_active, is_featured, is_customizable, tags
) VALUES
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/personalized-knit-baby-blanket'),
  'personalized-knit-baby-blanket',
  'Personalized Knit Baby Blanket',
  'A softly textured knit baby blanket finished with an embroidered name for a thoughtful keepsake.',
  'Personalized Knit Baby Blanket turns an everyday nursery layer into a meaningful keepsake. Add the baby name of your choice in a coordinated embroidered script, then select from the available blanket, thread, and lettering combinations. The two gallery images show the knit texture, name placement, and a range of colour and font inspiration.',
  'gallery', 4000, 'CAD',
  '["thread-and-butter/gallery/personalized-knit-baby-blanket/image-1","thread-and-butter/gallery/personalized-knit-baby-blanket/image-2"]',
  'Soft knit baby blanket with embroidered decoration', true, false, true,
  ARRAY['gallery', 'baby', 'baby-clothing', 'baby-blanket', 'embroidered', 'personalized', 'keepsake', 'baby-shower-gift', 'embroidery-baby-clothing']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/little-goose-embroidered-baby-romper'),
  'little-goose-embroidered-baby-romper',
  'Little Goose Embroidered Baby Romper',
  'A long-sleeve baby romper featuring a bow-wearing goose and a personalized establishment year.',
  'Little Goose Embroidered Baby Romper combines sweatshirt-like comfort with convenient snap fastening. A cheerful walking goose, soft bow detail, Little Goose lettering, and the child''s establishment year create a charming personalized front design. The gallery includes both a close view of the stitching and the complete garment presentation.',
  'gallery', 6000, 'CAD',
  '["thread-and-butter/gallery/little-goose-embroidered-baby-romper/image-1","thread-and-butter/gallery/little-goose-embroidered-baby-romper/image-2"]',
  'Baby romper with embroidered decoration', true, false, true,
  ARRAY['gallery', 'baby', 'baby-clothing', 'baby-romper', 'long-sleeve', 'embroidered', 'personalized', 'goose', 'baby-shower-gift', 'embroidery-baby-clothing']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/aunties-favorite-silly-goose-baby-romper'),
  'aunties-favorite-silly-goose-baby-romper',
  'Auntie''s Favorite Silly Goose Baby Romper',
  'A sweet embroidered baby romper featuring a bow-tied goose and playful auntie-inspired lettering.',
  'Auntie''s Favorite Silly Goose Baby Romper makes a lighthearted gift from a proud auntie. The softly coloured goose and flowing stitched lettering form a balanced front design on an easy short-sleeve romper with snap fastening. A close-up image highlights the embroidery while the second shows the finished garment.',
  'gallery', 4000, 'CAD',
  '["thread-and-butter/gallery/aunties-favorite-silly-goose-baby-romper/image-1","thread-and-butter/gallery/aunties-favorite-silly-goose-baby-romper/image-2"]',
  'Baby romper with embroidered decoration', true, false, false,
  ARRAY['gallery', 'baby', 'baby-clothing', 'baby-romper', 'bodysuit', 'embroidered', 'goose', 'auntie-gift', 'baby-shower-gift', 'embroidery-baby-clothing']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/personalized-name-ribbed-baby-footie'),
  'personalized-name-ribbed-baby-footie',
  'Personalized Name Ribbed Baby Footie',
  'A cozy ribbed footie personalized with the baby name of your choice in embroidered script.',
  'Personalized Name Ribbed Baby Footie offers an understated way to make a practical one-piece feel personal. The long sleeves, enclosed feet, and front opening support comfortable everyday wear, while the embroidered name adds a polished keepsake detail. Choose the garment colour and name treatment before the piece is made.',
  'gallery', 3500, 'CAD',
  '["thread-and-butter/gallery/personalized-name-ribbed-baby-footie/image-1"]',
  'Ribbed baby footie with embroidered decoration', true, false, true,
  ARRAY['gallery', 'baby', 'baby-clothing', 'baby-footie', 'jumpsuit', 'embroidered', 'personalized', 'newborn-gift', 'baby-shower-gift', 'embroidery-baby-clothing']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/where-mommy-goes-duck-baby-bodysuit'),
  'where-mommy-goes-duck-baby-bodysuit',
  'Where Mommy Goes Duck Baby Bodysuit',
  'An embroidered baby bodysuit showing a little duck happily following close behind its mom.',
  'Where Mommy Goes Duck Baby Bodysuit pairs a warm parent-and-baby message with a gentle embroidered duck illustration. The walking pair, stitched trail, and small grass details create an expressive front design without overwhelming the garment. Two gallery views show the thread detail and the complete long-sleeve bodysuit.',
  'gallery', 4000, 'CAD',
  '["thread-and-butter/gallery/where-mommy-goes-duck-baby-bodysuit/image-1","thread-and-butter/gallery/where-mommy-goes-duck-baby-bodysuit/image-2"]',
  'Baby bodysuit with embroidered decoration', true, false, false,
  ARRAY['gallery', 'baby', 'baby-clothing', 'baby-romper', 'bodysuit', 'long-sleeve', 'embroidered', 'duck', 'mom-gift', 'baby-shower-gift', 'embroidery-baby-clothing']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/silly-goose-on-the-loose-baby-romper'),
  'silly-goose-on-the-loose-baby-romper',
  'Silly Goose on the Loose Baby Romper',
  'A playful embroidered baby romper with a minimalist goose and cheerful Silly Goose on the Loose lettering.',
  'Silly Goose on the Loose Baby Romper gives a simple baby essential a fun, personality-filled finish. The compact line-art goose and mixed embroidered lettering sit neatly at the centre of the garment. Gallery images show the design on both long- and short-sleeve romper styling for colour and silhouette inspiration.',
  'gallery', 4000, 'CAD',
  '["thread-and-butter/gallery/silly-goose-on-the-loose-baby-romper/image-1","thread-and-butter/gallery/silly-goose-on-the-loose-baby-romper/image-2"]',
  'Baby romper with embroidered decoration', true, false, false,
  ARRAY['gallery', 'baby', 'baby-clothing', 'baby-romper', 'bodysuit', 'embroidered', 'goose', 'funny', 'baby-shower-gift', 'embroidery-baby-clothing']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/hear-me-roar-lion-baby-romper'),
  'hear-me-roar-lion-baby-romper',
  'Hear Me Roar Lion Baby Romper',
  'A softly embroidered baby romper featuring a friendly lion face and confident little message.',
  'Hear Me Roar Lion Baby Romper centres a smiling lion with layered mane stitching above a small, playful phrase. Its warm neutral thread palette keeps the design gentle and versatile, while the short sleeves and snap closure suit everyday dressing. Both images provide a clear look at the finished embroidery and placement.',
  'gallery', 4000, 'CAD',
  '["thread-and-butter/gallery/hear-me-roar-lion-baby-romper/image-1","thread-and-butter/gallery/hear-me-roar-lion-baby-romper/image-2"]',
  'Baby romper with embroidered decoration', true, false, false,
  ARRAY['gallery', 'baby', 'baby-clothing', 'baby-romper', 'bodysuit', 'embroidered', 'lion', 'animal', 'baby-shower-gift', 'embroidery-baby-clothing']::text[]
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
