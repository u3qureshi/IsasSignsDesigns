CREATE TABLE app_users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name varchar(150) NOT NULL,
    email varchar(255),
    normalized_email varchar(255) UNIQUE,
    phone varchar(30),
    normalized_phone varchar(30) UNIQUE,
    status varchar(30) NOT NULL DEFAULT 'PENDING',
    email_verified_at timestamptz,
    phone_verified_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT app_users_contact_check
        CHECK (normalized_email IS NOT NULL OR normalized_phone IS NOT NULL)
);

CREATE TABLE custom_embroidery_requests (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number varchar(40) UNIQUE NOT NULL,
    user_id uuid REFERENCES app_users(id),

    customer_name varchar(150) NOT NULL,
    preferred_contact_method varchar(20) NOT NULL,
    customer_email varchar(255),
    customer_phone varchar(30),
    contact_identity_hmac char(64) NOT NULL,

    idea_description text NOT NULL,
    exact_text text,
    ai_mode varchar(40) NOT NULL,
    ai_used boolean NOT NULL DEFAULT false,

    item_provider varchar(30) NOT NULL,
    item_type varchar(80) NOT NULL,
    custom_item_description text,
    garment_color varchar(80),

    placement varchar(80) NOT NULL,
    custom_placement_description text,
    size_mode varchar(20) NOT NULL,
    requested_width_inches numeric(6,2),
    requested_height_inches numeric(6,2),
    quantity integer NOT NULL,

    customer_acknowledged_estimate boolean NOT NULL,
    customer_confirmed_content_rights boolean NOT NULL,
    status varchar(40) NOT NULL DEFAULT 'SUBMITTED',

    ai_provider varchar(80),
    ai_model varchar(150),
    generated_prompt text,

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT custom_embroidery_contact_method_check
        CHECK (preferred_contact_method IN ('email', 'phone')),
    CONSTRAINT custom_embroidery_contact_value_check
        CHECK (
            (preferred_contact_method = 'email' AND customer_email IS NOT NULL)
            OR
            (preferred_contact_method = 'phone' AND customer_phone IS NOT NULL)
        ),
    CONSTRAINT custom_embroidery_quantity_check CHECK (quantity >= 1),
    CONSTRAINT custom_embroidery_known_size_check
        CHECK (
            size_mode <> 'known'
            OR (requested_width_inches > 0 AND requested_height_inches > 0)
        )
);

CREATE TABLE custom_embroidery_request_images (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id uuid NOT NULL
        REFERENCES custom_embroidery_requests(id) ON DELETE CASCADE,
    image_type varchar(40) NOT NULL,
    original_filename varchar(255),
    cloudinary_asset_id varchar(255) NOT NULL,
    cloudinary_public_id varchar(500) NOT NULL,
    cloudinary_version bigint,
    resource_type varchar(30) NOT NULL DEFAULT 'image',
    delivery_type varchar(30) NOT NULL,
    format varchar(30) NOT NULL,
    width integer,
    height integer,
    bytes bigint,
    customer_image_intent varchar(40),
    display_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_custom_embroidery_requests_created_at
    ON custom_embroidery_requests (created_at DESC);
CREATE INDEX idx_custom_embroidery_requests_contact_hmac
    ON custom_embroidery_requests (contact_identity_hmac);
CREATE INDEX idx_custom_embroidery_request_images_request_id
    ON custom_embroidery_request_images (request_id);
