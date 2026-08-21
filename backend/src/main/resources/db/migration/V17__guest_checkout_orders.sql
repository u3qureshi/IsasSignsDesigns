CREATE TABLE customer_orders (
    id uuid PRIMARY KEY,
    order_number varchar(40) NOT NULL UNIQUE,
    status varchar(40) NOT NULL,
    currency varchar(3) NOT NULL,
    subtotal_cents bigint NOT NULL CHECK (subtotal_cents >= 0),
    shipping_cents bigint NOT NULL CHECK (shipping_cents >= 0),
    tax_cents bigint NOT NULL DEFAULT 0 CHECK (tax_cents >= 0),
    total_cents bigint NOT NULL CHECK (total_cents >= 0),
    stripe_checkout_session_id varchar(255) UNIQUE,
    stripe_payment_intent_id varchar(255),
    customer_email varchar(320),
    customer_name varchar(255),
    customer_phone varchar(50),
    shipping_address jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    paid_at timestamptz
);

CREATE INDEX idx_customer_orders_status ON customer_orders(status);
CREATE INDEX idx_customer_orders_created_at ON customer_orders(created_at DESC);

CREATE TABLE order_items (
    id uuid PRIMARY KEY,
    order_id uuid NOT NULL REFERENCES customer_orders(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES products(id),
    product_slug varchar(255) NOT NULL,
    product_name varchar(255) NOT NULL,
    variant_id varchar(255),
    variant_name varchar(255),
    size varchar(50),
    image_public_id text,
    unit_price_cents bigint NOT NULL CHECK (unit_price_cents >= 0),
    quantity integer NOT NULL CHECK (quantity > 0),
    line_total_cents bigint NOT NULL CHECK (line_total_cents >= 0)
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

CREATE TABLE payment_webhook_events (
    id uuid PRIMARY KEY,
    provider varchar(30) NOT NULL,
    event_id varchar(255) NOT NULL,
    event_type varchar(255) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    processed_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_payment_webhook_event UNIQUE (provider, event_id)
);
