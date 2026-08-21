INSERT INTO products (
    id, slug, name, description, long_description, category, price_cents, currency,
    images, material, is_active, is_featured, is_customizable, tags, variants
) VALUES (
    uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/clothing/gildan-18500-heavy-blend-fleece-hoodie'),
    'gildan-18500-heavy-blend-fleece-hoodie',
    'Gildan 18500 Heavy Blend Fleece Hoodie',
    'A reliable fleece pullover with a relaxed classic fit, cozy brushed interior, and durable everyday construction.',
    'The Gildan 18500 Heavy Blend Fleece Hoodie is a versatile blank made for everyday comfort, team apparel, workwear, and custom decoration. Its brushed interior feels soft and warm, while durable double-needle seams reinforce high-wear areas. A double-lined hood, colour-matched drawcord, roomy pouch pocket, and stretch-recovery ribbing complete the classic pullover design. Its smooth, low-pill surface supports printing, embroidery, heat transfer, patches, and DTG decoration.',
    'clothing',
    4000,
    'CAD',
    '["thread-and-butter/clothing/gildan-18500/black"]',
    '8.0 oz cotton-polyester Heavy Blend fleece; fibre ratio varies for heather colours',
    true,
    false,
    false,
    ARRAY['clothing', 'blanks', 'hoodies', 'gildan', 'heavy-blend', 'fleece', 'pullover', 'classic-fit']::text[],
    '[{"id":"20","name":"Black","slug":"black","hex":"#262629","image":"thread-and-butter/clothing/gildan-18500/black","sizes":["XS","S","M","L","XL","2XL","3XL","4XL","5XL"]},{"id":"23","name":"White","slug":"white","hex":"#f6f5f2","image":"thread-and-butter/clothing/gildan-18500/white","sizes":["XS","S","M","L","XL","2XL","3XL","4XL","5XL"]},{"id":"343","name":"Navy Blue","slug":"navy-blue","hex":"#27334a","image":"thread-and-butter/clothing/gildan-18500/navy-blue","sizes":["S","M","L","XL","2XL","3XL","4XL","5XL"]},{"id":"106","name":"Sport Grey","slug":"sport-grey","hex":"#a8a8a5","image":"thread-and-butter/clothing/gildan-18500/sport-grey","sizes":["S","M","L","XL","2XL","3XL","4XL","5XL"]},{"id":"101","name":"Charcoal","slug":"charcoal","hex":"#505255","image":"thread-and-butter/clothing/gildan-18500/charcoal","sizes":["S","M","L","XL","2XL","3XL","4XL","5XL"]},{"id":"162","name":"Forest Green","slug":"forest-green","hex":"#294f3c","image":"thread-and-butter/clothing/gildan-18500/forest-green","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"154","name":"Military Green","slug":"military-green","hex":"#596044","image":"thread-and-butter/clothing/gildan-18500/military-green","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"176","name":"Maroon","slug":"maroon","hex":"#5e2938","image":"thread-and-butter/clothing/gildan-18500/maroon","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"155","name":"Dark Chocolate","slug":"dark-chocolate","hex":"#4a352d","image":"thread-and-butter/clothing/gildan-18500/dark-chocolate","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"178","name":"Sand","slug":"sand","hex":"#c7b79c","image":"thread-and-butter/clothing/gildan-18500/sand","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"160","name":"Light Pink","slug":"light-pink","hex":"#efb8c6","image":"thread-and-butter/clothing/gildan-18500/light-pink","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"41","name":"Red","slug":"red","hex":"#c72d37","image":"thread-and-butter/clothing/gildan-18500/red","sizes":["S","M","L","XL","2XL","3XL","4XL","5XL"]},{"id":"345","name":"Royal Blue","slug":"royal-blue","hex":"#2d57a7","image":"thread-and-butter/clothing/gildan-18500/royal-blue","sizes":["S","M","L","XL","2XL","3XL","4XL","5XL"]},{"id":"42","name":"Purple","slug":"purple","hex":"#533b70","image":"thread-and-butter/clothing/gildan-18500/purple","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"38","name":"Orange","slug":"orange","hex":"#ed7b2d","image":"thread-and-butter/clothing/gildan-18500/orange","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"35136","name":"Safety Orange","slug":"safety-orange","hex":"#f36c30","image":"thread-and-butter/clothing/gildan-18500/safety-orange","sizes":["S","M","L","XL","2XL","3XL","4XL","5XL"]}]'::jsonb
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
