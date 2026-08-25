INSERT INTO products (
  id, slug, name, description, long_description, category, price_cents, currency,
  images, material, is_active, is_featured, is_customizable, tags
) VALUES
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/one-piece-devil-fruit-embroidered-hoodie'),
  'one-piece-devil-fruit-embroidered-hoodie',
  'One Piece Devil Fruit Embroidered Hoodie',
  'A colourful embroidered hoodie featuring three swirling Devil Fruit designs and bold lettering.',
  'One Piece Devil Fruit Embroidered Hoodie brings together three vividly stitched fruit motifs in pink, purple, and red. Green leaves, a curled stem, and crisp contrasting lettering give the compact front composition a bright finish against the dark garment.',
  'gallery', 6000, 'CAD',
  '["thread-and-butter/gallery/one-piece-devil-fruit-embroidered-hoodie/image-1"]',
  'Hooded sweatshirt with embroidered decoration', true, false, false,
  ARRAY['gallery', 'embroidered', 'anime-inspired', 'anime', 'one-piece', 'devil-fruit', 'hoodie', 'hoodies-sweatshirts', 'embroidery-anime']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/one-piece-luffy-wanted-poster-embroidered-hoodie'),
  'one-piece-luffy-wanted-poster-embroidered-hoodie',
  'One Piece Luffy Wanted Poster Embroidered Hoodie',
  'A detailed embroidered hoodie recreating a bold Luffy wanted-poster composition.',
  'One Piece Luffy Wanted Poster Embroidered Hoodie frames an expressive character portrait with layered wanted lettering, reward details, and a strong stitched border. Two close views highlight alternate thread palettes and the dense embroidery that gives the poster-style artwork its texture.',
  'gallery', 7000, 'CAD',
  '["thread-and-butter/gallery/one-piece-luffy-wanted-poster-embroidered-hoodie/image-1","thread-and-butter/gallery/one-piece-luffy-wanted-poster-embroidered-hoodie/image-2"]',
  'Hooded sweatshirt with embroidered decoration', true, false, false,
  ARRAY['gallery', 'embroidered', 'anime-inspired', 'anime', 'one-piece', 'luffy', 'wanted-poster', 'hoodie', 'hoodies-sweatshirts', 'embroidery-anime']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/one-piece-zoro-panel-embroidered-hoodie'),
  'one-piece-zoro-panel-embroidered-hoodie',
  'One Piece Zoro Panel Embroidered Hoodie',
  'A sharp embroidered hoodie featuring an intense Zoro eye panel with red and green accents.',
  'One Piece Zoro Panel Embroidered Hoodie uses a narrow manga-style frame to focus on the swordsman expression and signature scar. Dense neutral stitching is edged in red and punctuated with green hair details, producing a clean focal design on a black hoodie.',
  'gallery', 7000, 'CAD',
  '["thread-and-butter/gallery/one-piece-zoro-panel-embroidered-hoodie/image-1"]',
  'Hooded sweatshirt with embroidered decoration', true, false, false,
  ARRAY['gallery', 'embroidered', 'anime-inspired', 'anime', 'one-piece', 'zoro', 'manga-panel', 'hoodie', 'hoodies-sweatshirts', 'embroidery-anime']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/attack-on-titan-eren-embroidered-hoodie'),
  'attack-on-titan-eren-embroidered-hoodie',
  'Attack on Titan Eren Embroidered Hoodie',
  'A dramatic embroidered hoodie capturing Eren with vivid eyes and layered transformation markings.',
  'Attack on Titan Eren Embroidered Hoodie presents an intense close-cropped scene inside a graphic rectangular frame. Layered brown hair, striking blue eyes, red facial markings, and careful shading make the artwork stand out across the light garment shown in both detail and full-placement views.',
  'gallery', 7000, 'CAD',
  '["thread-and-butter/gallery/attack-on-titan-eren-embroidered-hoodie/image-1","thread-and-butter/gallery/attack-on-titan-eren-embroidered-hoodie/image-2"]',
  'Hooded sweatshirt with embroidered decoration', true, false, false,
  ARRAY['gallery', 'embroidered', 'anime-inspired', 'anime', 'attack-on-titan', 'eren', 'manga-panel', 'hoodie', 'hoodies-sweatshirts', 'embroidery-anime']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/demon-slayer-zenitsu-eyes-embroidered-hoodie'),
  'demon-slayer-zenitsu-eyes-embroidered-hoodie',
  'Demon Slayer Zenitsu Eyes Embroidered Hoodie',
  'A vivid embroidered hoodie centred on Zenitsu and his unmistakable golden-eyed stare.',
  'Demon Slayer Zenitsu Eyes Embroidered Hoodie turns a close manga-style crop into a high-impact stitched panel. Bright yellow hair and eyes contrast with warm skin tones and the black garment, while a clean dark border keeps the detailed artwork crisp and wearable.',
  'gallery', 7000, 'CAD',
  '["thread-and-butter/gallery/demon-slayer-zenitsu-eyes-embroidered-hoodie/image-1"]',
  'Hooded sweatshirt with embroidered decoration', true, false, false,
  ARRAY['gallery', 'embroidered', 'anime-inspired', 'anime', 'demon-slayer', 'zenitsu', 'eyes', 'manga-panel', 'hoodie', 'hoodies-sweatshirts', 'embroidery-anime']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/hunter-x-hunter-kurapika-chain-embroidered-hoodie'),
  'hunter-x-hunter-kurapika-chain-embroidered-hoodie',
  'Hunter x Hunter Kurapika Chain Embroidered Hoodie',
  'A detailed Kurapika embroidered hoodie framed by scarlet eyes, chains, and a dagger motif.',
  'Hunter x Hunter Kurapika Chain Embroidered Hoodie builds a dramatic rectangular portrait around scarlet eyes and chain-wrapped hands. Embroidered chains extend beyond the red panel and finish with a small dagger detail, creating depth and movement across the front placement shown in two garment colours.',
  'gallery', 7000, 'CAD',
  '["thread-and-butter/gallery/hunter-x-hunter-kurapika-chain-embroidered-hoodie/image-1","thread-and-butter/gallery/hunter-x-hunter-kurapika-chain-embroidered-hoodie/image-2"]',
  'Hooded sweatshirt with embroidered decoration', true, false, false,
  ARRAY['gallery', 'embroidered', 'anime-inspired', 'anime', 'hunter-x-hunter', 'kurapika', 'chains', 'hoodie', 'hoodies-sweatshirts', 'embroidery-anime']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/vinland-saga-no-enemies-embroidered-hoodie'),
  'vinland-saga-no-enemies-embroidered-hoodie',
  'Vinland Saga No Enemies Embroidered Hoodie',
  'An embroidered Vinland Saga hoodie pairing a focused warrior scene with the No Enemies message.',
  'Vinland Saga No Enemies Embroidered Hoodie combines a restrained neutral character palette with a bold black statement beneath the artwork. The centred sword composition feels graphic and balanced against the light hoodie, making the familiar message the finishing point of the design.',
  'gallery', 7000, 'CAD',
  '["thread-and-butter/gallery/vinland-saga-no-enemies-embroidered-hoodie/image-1"]',
  'Hooded sweatshirt with embroidered decoration', true, false, false,
  ARRAY['gallery', 'embroidered', 'anime-inspired', 'anime', 'vinland-saga', 'no-enemies', 'hoodie', 'hoodies-sweatshirts', 'embroidery-anime']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/one-piece-to-be-continued-embroidered-hoodie'),
  'one-piece-to-be-continued-embroidered-hoodie',
  'One Piece To Be Continued Embroidered Hoodie',
  'A minimalist black hoodie featuring the familiar red To Be Continued message in embroidery.',
  'One Piece To Be Continued Embroidered Hoodie keeps the reference direct with distressed-style red lettering and a contrasting gold initial detail. The centred composition is compact enough for everyday wear while remaining instantly recognizable to fans.',
  'gallery', 7000, 'CAD',
  '["thread-and-butter/gallery/one-piece-to-be-continued-embroidered-hoodie/image-1"]',
  'Hooded sweatshirt with embroidered decoration', true, false, false,
  ARRAY['gallery', 'embroidered', 'anime-inspired', 'anime', 'one-piece', 'to-be-continued', 'hoodie', 'hoodies-sweatshirts', 'embroidery-anime']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/haikyuu-hinata-checkmark-embroidered-hoodie'),
  'haikyuu-hinata-checkmark-embroidered-hoodie',
  'Haikyuu Hinata Checkmark Embroidered Hoodie',
  'A dynamic embroidered hoodie featuring Hinata in motion over a sweeping checkmark backdrop.',
  'Haikyuu Hinata Checkmark Embroidered Hoodie captures the energy of a mid-air volleyball play through a compact full-colour figure. The navy and orange uniform, red shoes, and oversized dark checkmark create a strong sense of movement across the light hoodie.',
  'gallery', 7000, 'CAD',
  '["thread-and-butter/gallery/haikyuu-hinata-checkmark-embroidered-hoodie/image-1"]',
  'Hooded sweatshirt with embroidered decoration', true, false, false,
  ARRAY['gallery', 'embroidered', 'anime-inspired', 'anime', 'haikyuu', 'hinata', 'volleyball', 'hoodie', 'hoodies-sweatshirts', 'embroidery-anime']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/naruto-itachi-eye-panel-embroidered-hoodie'),
  'naruto-itachi-eye-panel-embroidered-hoodie',
  'Naruto Itachi Eye Panel Embroidered Hoodie',
  'A manga-panel embroidered hoodie featuring Itachi and a vivid red eye detail.',
  'Naruto Itachi Eye Panel Embroidered Hoodie uses a narrow framed composition to spotlight an intense character expression and signature red eye. Neutral shading, dark outlines, small Japanese lettering, and the single red accent create a focused design with strong contrast.',
  'gallery', 7000, 'CAD',
  '["thread-and-butter/gallery/naruto-itachi-eye-panel-embroidered-hoodie/image-1"]',
  'Hooded sweatshirt with embroidered decoration', true, false, false,
  ARRAY['gallery', 'embroidered', 'anime-inspired', 'anime', 'naruto', 'itachi', 'manga-panel', 'hoodie', 'hoodies-sweatshirts', 'embroidery-anime']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/fullmetal-alchemist-edward-eyes-embroidered-hoodie'),
  'fullmetal-alchemist-edward-eyes-embroidered-hoodie',
  'Fullmetal Alchemist Edward Eyes Embroidered Hoodie',
  'A clean embroidered hoodie featuring Edward in a narrow golden-eyed portrait panel.',
  'Fullmetal Alchemist Edward Eyes Embroidered Hoodie focuses on a sharp, determined stare inside a slim bordered frame. Golden hair and eyes stand out against layered neutral skin tones and a black garment, with two gallery views highlighting both the thread work and finished placement.',
  'gallery', 7000, 'CAD',
  '["thread-and-butter/gallery/fullmetal-alchemist-edward-eyes-embroidered-hoodie/image-1","thread-and-butter/gallery/fullmetal-alchemist-edward-eyes-embroidered-hoodie/image-2"]',
  'Hooded sweatshirt with embroidered decoration', true, false, false,
  ARRAY['gallery', 'embroidered', 'anime-inspired', 'anime', 'fullmetal-alchemist', 'edward-elric', 'eyes', 'manga-panel', 'hoodie', 'hoodies-sweatshirts', 'embroidery-anime']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/fullmetal-alchemist-transmutation-circle-embroidered-crewneck'),
  'fullmetal-alchemist-transmutation-circle-embroidered-crewneck',
  'Fullmetal Alchemist Transmutation Circle Embroidered Crewneck',
  'A black crewneck with a compact red transmutation-circle emblem embroidered at the chest.',
  'Fullmetal Alchemist Transmutation Circle Embroidered Crewneck uses a single red thread palette to give the detailed emblem a clean, understated finish. The small left-chest placement makes this a subtle anime-inspired option, while the close-up image reveals the intersecting line work.',
  'gallery', 6500, 'CAD',
  '["thread-and-butter/gallery/fullmetal-alchemist-transmutation-circle-embroidered-crewneck/image-1","thread-and-butter/gallery/fullmetal-alchemist-transmutation-circle-embroidered-crewneck/image-2"]',
  'Crewneck sweatshirt with embroidered decoration', true, false, false,
  ARRAY['gallery', 'embroidered', 'anime-inspired', 'anime', 'fullmetal-alchemist', 'transmutation-circle', 'crewneck-sweatshirt', 'hoodies-sweatshirts', 'embroidery-anime']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/fullmetal-alchemist-flamel-symbol-embroidered-hat'),
  'fullmetal-alchemist-flamel-symbol-embroidered-hat',
  'Fullmetal Alchemist Flamel Symbol Embroidered Hat',
  'A classic curved-brim hat with a crisp embroidered Flamel symbol at the centre front.',
  'Fullmetal Alchemist Flamel Symbol Embroidered Hat keeps the reference compact and versatile with a clean white emblem centred above the brim. The three gallery images present the same design across black, red, and deep green colour options.',
  'gallery', 5000, 'CAD',
  '["thread-and-butter/gallery/fullmetal-alchemist-flamel-symbol-embroidered-hat/image-1","thread-and-butter/gallery/fullmetal-alchemist-flamel-symbol-embroidered-hat/image-2","thread-and-butter/gallery/fullmetal-alchemist-flamel-symbol-embroidered-hat/image-3"]',
  'Curved-brim hat with embroidered decoration', true, false, false,
  ARRAY['gallery', 'embroidered', 'anime-inspired', 'anime', 'fullmetal-alchemist', 'flamel-symbol', 'hat', 'headwear', 'embroidery-anime']::text[]
),
(
  uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/gallery/fullmetal-alchemist-flamel-symbol-embroidered-hoodie'),
  'fullmetal-alchemist-flamel-symbol-embroidered-hoodie',
  'Fullmetal Alchemist Flamel Symbol Embroidered Hoodie',
  'A red hoodie featuring a bold black Flamel symbol embroidered across the back.',
  'Fullmetal Alchemist Flamel Symbol Embroidered Hoodie sets the familiar emblem in deep black thread against a vivid red garment. The generous back placement gives the winged crown and entwined symbol room to read clearly, while the detail image highlights the raised stitch texture.',
  'gallery', 7000, 'CAD',
  '["thread-and-butter/gallery/fullmetal-alchemist-flamel-symbol-embroidered-hoodie/image-1","thread-and-butter/gallery/fullmetal-alchemist-flamel-symbol-embroidered-hoodie/image-2"]',
  'Hooded sweatshirt with embroidered decoration', true, false, false,
  ARRAY['gallery', 'embroidered', 'anime-inspired', 'anime', 'fullmetal-alchemist', 'flamel-symbol', 'hoodie', 'hoodies-sweatshirts', 'embroidery-anime']::text[]
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
