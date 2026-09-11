-- The original development database created this table before the gallery
-- catalogue migrations existed. Keep the schema in Flyway so a clean
-- production database can be built without manual SQL.
CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY,
    slug varchar(255) NOT NULL UNIQUE,
    name varchar(255) NOT NULL,
    description text,
    long_description text,
    category varchar(255),
    price_cents bigint NOT NULL CHECK (price_cents >= 0),
    currency varchar(3) NOT NULL DEFAULT 'CAD',
    images text,
    material varchar(255),
    is_active boolean NOT NULL DEFAULT true,
    is_featured boolean NOT NULL DEFAULT false,
    stock_qty integer,
    is_customizable boolean NOT NULL DEFAULT false,
    tags text[] NOT NULL DEFAULT ARRAY[]::text[],
    on_sale jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
