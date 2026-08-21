INSERT INTO products (
    id, slug, name, description, long_description, category, price_cents, currency,
    images, material, is_active, is_featured, is_customizable, tags, variants
) VALUES (
    uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/clothing/gildan-18200-heavy-blend-fleece-sweatpants'),
    'gildan-18200-heavy-blend-fleece-sweatpants',
    'Gildan 18200 Heavy Blend Fleece Sweatpants',
    'Comfortable classic-fit fleece sweatpants with a soft brushed interior, secure waistband, and gathered cuffs.',
    'The Gildan 18200 Heavy Blend Fleece Sweatpants offer a relaxed everyday shape suited to lounging, teams, warm-ups, and coordinated apparel sets. Soft brushed fleece adds comfortable warmth without complicating the familiar silhouette. A covered elastic waistband with an adjustable drawcord helps secure the fit, while elasticized cuffs finish the legs neatly. Seamless sides provide an uninterrupted surface for printing, embroidery, heat transfer, patches, and DTG decoration.',
    'clothing',
    3500,
    'CAD',
    '["thread-and-butter/clothing/gildan-18200/black"]',
    '8.0 oz, 50% U.S. cotton and 50% polyester Heavy Blend fleece',
    true,
    false,
    false,
    ARRAY['clothing', 'blanks', 'sweatpants', 'joggers', 'gildan', 'heavy-blend', 'fleece', 'classic-fit']::text[],
    '[{"id":"20","name":"Black","slug":"black","hex":"#262629","image":"thread-and-butter/clothing/gildan-18200/black","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"106","name":"Sport Grey","slug":"sport-grey","hex":"#a8a8a5","image":"thread-and-butter/clothing/gildan-18200/sport-grey","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"343","name":"Navy Blue","slug":"navy-blue","hex":"#27334a","image":"thread-and-butter/clothing/gildan-18200/navy-blue","sizes":["S","L","XL","2XL","3XL"]},{"id":"264","name":"Ash","slug":"ash","hex":"#d6d6d1","image":"thread-and-butter/clothing/gildan-18200/ash","sizes":["S","M","L","XL","2XL","3XL"]}]'::jsonb
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
    variants = EXCLUDED.variants,
    updated_at = now();
