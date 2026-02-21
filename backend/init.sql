-- init.sql: create products table and insert seed data
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar(255) UNIQUE NOT NULL,
  name varchar(255) NOT NULL,
  description text,
  category varchar(100),
  price_cents bigint NOT NULL DEFAULT 0,
  currency varchar(10) NOT NULL DEFAULT 'CAD',
  images text,
  material varchar(100),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- seed sample products
INSERT INTO products (slug, name, description, category, price_cents, currency, images, material)
VALUES
('personal-maple-coaster','Maple Coaster','Handmade maple coaster','Home Decor',1999,'CAD','["/assets/coaster1.jpg"]','wood'),
('kids-name-sign','Kids Name Sign','Personalized name sign for kids','Kids',2599,'CAD','["/assets/kids1.jpg"]','acrylic'),
('ramadan-lantern','Ramadan Lantern','Decorative lantern for Ramadan','Ramadan Decor',3499,'CAD','["/assets/ramadan1.jpg"]','metal'),
('wall-print-forest','Forest Wall Print','Large wall art print of a forest','Wall Art',4999,'CAD','["/assets/wall1.jpg"]','paper'),
('business-sign-small','Business Plaque Small','Small business signage','Business/Events',8999,'CAD','["/assets/business1.jpg"]','metal')
ON CONFLICT (slug) DO NOTHING;
