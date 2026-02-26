-- init.sql: create products table and insert seed data
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar(255) UNIQUE NOT NULL,
  name varchar(255) NOT NULL,
  description text,
  long_description text,
  category varchar(100),
  price_cents bigint NOT NULL DEFAULT 0,
  currency varchar(10) NOT NULL DEFAULT 'CAD',
  images text,
  material varchar(100),
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  stock_qty integer,
  is_customizable boolean NOT NULL DEFAULT false,
  tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  on_sale jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category    ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_is_active   ON products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products (is_featured);
CREATE INDEX IF NOT EXISTS idx_products_tags_gin    ON products USING gin (tags);

-- ── Existing sample products ──────────────────────────────────────────────────
INSERT INTO products (id, slug, name, description, category, price_cents, currency, images, material)
VALUES
('23e9318b-272c-424e-99d0-671c90b8bcf6','personal-maple-coaster','Maple Coaster','Handmade maple coaster','Home Decor',1999,'CAD','["/assets/coaster1.jpg"]','wood'),
('e5f9c885-acda-4028-8a57-cf4e0ee6142c','kids-name-sign','Kids Name Sign','Personalized name sign for kids','Kids',2599,'CAD','["/assets/kids1.jpg"]','acrylic'),
('04837f02-0325-47d5-a4f1-4d9fdce7fc13','ramadan-lantern','Ramadan Lantern','Decorative lantern for Ramadan','Ramadan Decor',3499,'CAD','["/assets/ramadan1.jpg"]','metal'),
('ce07d7df-45fc-44fc-9995-590320f4d13e','wall-print-forest','Forest Wall Print','Large wall art print of a forest','Wall Art',4999,'CAD','["/assets/wall1.jpg"]','paper'),
('6a076e3c-4318-42a7-a7d5-dc194deed172','business-sign-small','Business Plaque Small','Small business signage','Business/Events',8999,'CAD','["/assets/business1.jpg"]','metal')
ON CONFLICT (slug) DO NOTHING;

-- ── Kids category products ────────────────────────────────────────────────────
INSERT INTO products (id, slug, name, description, long_description, category, price_cents, currency, images, material, is_customizable, is_featured, tags)
VALUES

('43ccd2e6-65c4-48a5-8dcd-2ad062f486fd','kids-montessori-puzzle-fish-matching',
 'Montessori Wooden Puzzle - Fish Matching',
 'Wooden fish pattern matching puzzle that pairs beautifully illustrated fish halves. Helps toddlers develop colour recognition, visual discrimination, and fine motor skills through ocean-themed play.',
 'This Montessori-inspired wooden fish matching puzzle invites toddlers to pair each fish top and bottom half by matching unique patterns, colours, and skin textures. Made from sustainably sourced wood with child-safe paints, each piece is sized perfectly for small hands. Ideal for independent play or guided learning, this ocean-themed activity builds concentration, visual discrimination, and fine motor grip strength. Suitable for ages 2 and up. Makes a beautiful and educational gift for toddlers and preschoolers.',
 'Kids', 5000, 'CAD', '["/assets/kids-puzzle-fish.jpg"]', 'wood', false, false,
 ARRAY['montessori','puzzle','fish','matching','toddler','educational','ocean','wooden']),

('52b5a4ab-106c-4126-aa4e-4749e2541e7c','kids-montessori-puzzle-dinosaur-matching',
 'Montessori Wooden Puzzle - Dinosaur Matching',
 'Wooden Montessori dinosaur puzzle with matching card pairs. A fun homeschool activity for preschoolers and kindergarteners that builds visual memory and matching skills through dino-themed play.',
 'This Montessori wooden dinosaur matching puzzle brings prehistoric learning to life for curious little minds. Each pair of dinosaur cards must be matched by species, colour, and pattern, encouraging focus, concentration, and problem-solving skills. Crafted from natural wood with non-toxic, child-safe finishes, this hands-on activity is perfect for home learning, kindergarten classrooms, and preschool environments. Suitable for ages 2 and up. A great gift for any dinosaur-loving child.',
 'Kids', 5000, 'CAD', '["/assets/kids-puzzle-dinosaur.jpg"]', 'wood', false, false,
 ARRAY['montessori','puzzle','dinosaur','matching','toddler','educational','wooden','homeschool']),

('a8c886f3-5f39-4b21-97ad-3d83ca774622','kids-montessori-puzzle-safari-animals',
 'Montessori Wooden Puzzle - Safari Animals Matching',
 'Wooden Montessori mother and baby safari animals matching puzzle. Pairs adult and baby animals to build vocabulary, nurturing instincts, and visual recognition skills.',
 'This wooden Montessori matching puzzle features beautifully illustrated safari and North American woodland animal mother-and-baby pairs. Children match each mother to her baby, reinforcing animal recognition, language development, and empathy. Each piece is crafted from natural wood with vibrant child-safe illustrations. Ideal for homeschool, parent-child play, or independent toddler exploration. Suitable for ages 18 months and up.',
 'Kids', 5000, 'CAD', '["/assets/kids-puzzle-safari.jpg"]', 'wood', false, false,
 ARRAY['montessori','puzzle','safari','animals','matching','toddler','educational','wooden','homeschool']),

('57da37c1-6a0e-4887-80af-6842c8a46446','kids-montessori-puzzle-farm-animals',
 'Montessori Wooden Puzzle - Farm Animals Matching',
 'Wooden Montessori mother and baby farm animals matching puzzle. Pairs farm animal families to build animal vocabulary, nurturing instincts, and visual matching skills.',
 'This Montessori wooden Mother-and-Baby matching puzzle brings the farm to life with sweet, hand-illustrated animal pairs. Kids match each mama animal to her baby across familiar farm, safari, and woodland friends, building language skills, concentration, and a love of nature. Made from natural wood with child-safe non-toxic coatings. Suitable for ages 18 months and up.',
 'Kids', 5000, 'CAD', '["/assets/kids-puzzle-farm.jpg"]', 'wood', false, false,
 ARRAY['montessori','puzzle','farm','animals','matching','toddler','educational','wooden','homeschool']),

('a642336b-34d9-4fd1-8d52-c740f04738d9','kids-montessori-memory-game-ramadan',
 'Montessori Memory Game - Ramadan',
 'Islamic Ramadan memory and matching game for kids. A fun educational activity for Eid and Ramadan with beautifully illustrated cards perfect for family game nights.',
 'Celebrate the spirit of Ramadan with this beautifully crafted Montessori-inspired Islamic memory matching game. Featuring iconic Ramadan and Islamic imagery, children flip and match illustrated card pairs, building memory retention, concentration, and cultural connection. A meaningful Eid gift and Ramadan learning activity that makes family game nights truly special. Designed with gentle, vibrant illustrations that resonate with Muslim families. Suitable for ages 3 and up.',
 'Kids', 5000, 'CAD', '["/assets/kids-memory-ramadan.jpg"]', 'wood', false, false,
 ARRAY['montessori','memory-game','ramadan','islamic','educational','eid','matching','gift']),

('d40231e8-895c-4d44-bedc-0eb3d4941240','kids-nursery-cloud-lamp',
 'Nursery Cloud Lamp Decor',
 'Handcrafted wooden cloud wall lamp for nurseries and baby rooms. A soft, warm night light that doubles as charming nursery wall decor and makes a thoughtful newborn gift.',
 'Bring a dreamy, soothing glow to your baby''s nursery with this handcrafted wooden cloud wall lamp. Designed to emit a soft warm light that creates a calming atmosphere for bedtime routines, this lamp doubles as a beautiful piece of nursery wall decor. Made from natural wood with a smooth finish. Wired for safe home installation. Available in natural wood tone.',
 'Kids', 3000, 'CAD', '["/assets/kids-nursery-cloud-lamp.jpg"]', 'wood', true, false,
 ARRAY['nursery','lamp','cloud','decor','night-light','wooden','baby-gift','newborn','custom']),

('33ebb6e4-96c1-41fb-b3e0-3c209e39a4fa','kids-nursery-custom-animal-lamps',
 'Nursery Custom Animal Lamps Decor',
 'Set of 4 personalized animal nursery wall lamps. Each lamp can be customized with your baby''s name, creating a unique and magical night light arrangement for any baby room.',
 'Transform your baby''s nursery into a magical space with this custom set of 4 personalized animal wall lamps. Each lamp features an adorable animal silhouette and can be personalized with your baby''s name or a short phrase, making them a truly one-of-a-kind gift. Emitting a soft, warm glow, these wooden lamps create the perfect ambient light for bedtime feeding, diaper changes, and soothing. A perfect baby shower gift, nursery reveal surprise, or first birthday keepsake.',
 'Kids', 10000, 'CAD', '["/assets/kids-nursery-animal-lamps.jpg"]', 'wood', true, false,
 ARRAY['nursery','lamp','animal','custom','personalized','night-light','set','baby-gift','newborn']),

('773fdb50-88fb-42b9-a53a-3875d953b620','kids-montessori-daily-routine-calendar',
 'Montessori Learning Daily Routine',
 'Wooden Montessori perpetual calendar for kids. Teaches months, days of the week, and daily routines in a hands-on, engaging way that supports early learning independence.',
 'This Montessori wooden perpetual calendar gives children ownership of their day. Kids rotate the date, month, and day of the week each morning, building a daily independence ritual that reinforces early literacy and time awareness. Designed with clear, readable typography and gentle natural wood tones. Features dedicated sections for months, days, and daily routine or weather tracking. Suitable for ages 3 and up.',
 'Kids', 10000, 'CAD', '["/assets/kids-daily-routine-calendar.jpg"]', 'wood', false, false,
 ARRAY['montessori','calendar','daily-routine','educational','perpetual','months','days','learning']),

('2c7d3afc-5af4-4f04-bcf0-f8ba5cbd6837','kids-montessori-custom-name-puzzle',
 'Montessori Custom Name Puzzle Board',
 'Personalized Montessori wooden name puzzle board with animals and numbers. A beautiful first birthday gift that children can grow and play with for years.',
 'Give the gift of learning with this personalized Montessori wooden name puzzle board. Each puzzle is custom-cut with the child''s name in large, easy-to-grip letter tiles, accompanied by charming animal and number illustrations. Crafted from premium natural wood with child-safe finishing, this puzzle supports letter recognition, fine motor development, and early spelling. Perfect for first birthdays, baby showers, and holiday gifts.',
 'Kids', 5000, 'CAD', '["/assets/kids-custom-name-puzzle.jpg"]', 'wood', true, false,
 ARRAY['montessori','puzzle','name','personalized','custom','animals','numbers','birthday-gift','keepsake']),

('39dea9da-909b-431e-93bb-3554c36ebcdc','kids-montessori-busy-board',
 'Montessori Busy Board: Natural Wood Activity Toy for Toddlers',
 'Large Montessori wooden busy board packed with sensory activities and fine motor skill builders. Designed to engage curious toddler minds and support key developmental milestones.',
 'This large Montessori busy board is a showcase of hands-on, screen-free activity built for toddlers and young children. Featuring buckles, zippers, buttons, latches, locks, and more, each element is designed to build fine motor skills, hand-eye coordination, and independent problem solving. Made from natural wood with durable, child-safe components. Particularly beneficial for children with autism spectrum traits or sensory processing needs. For ages 1 and up.',
 'Kids', 7000, 'CAD', '["/assets/kids-busy-board.jpg"]', 'wood', false, false,
 ARRAY['montessori','busy-board','sensory','toddler','fine-motor','wooden','learning','autism','fidget'])

ON CONFLICT (slug) DO NOTHING;
