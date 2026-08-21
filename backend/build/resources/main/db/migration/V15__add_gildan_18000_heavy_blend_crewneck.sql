INSERT INTO products (
    id, slug, name, description, long_description, category, price_cents, currency,
    images, material, is_active, is_featured, is_customizable, tags, variants
) VALUES (
    uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/clothing/gildan-18000-heavy-blend-fleece-crewneck'),
    'gildan-18000-heavy-blend-fleece-crewneck',
    'Gildan 18000 Heavy Blend Fleece Crewneck',
    'A dependable fleece crewneck with a relaxed classic fit, soft brushed interior, and smooth decoration-ready surface.',
    'The Gildan 18000 Heavy Blend Fleece Crewneck is an easy everyday layer for casual wear, teams, uniforms, and custom merchandise. Its brushed interior delivers comfortable warmth, while reinforced double-needle seams support regular use. Stretch-recovery ribbing at the collar, cuffs, and waistband helps preserve the familiar crewneck shape. The smooth, low-pill surface works well with printing, embroidery, heat transfer, patches, and DTG decoration.',
    'clothing',
    3500,
    'CAD',
    '["thread-and-butter/clothing/gildan-18000/black"]',
    '8.0 oz cotton-polyester Heavy Blend fleece; fibre ratio varies for heather colours',
    true,
    false,
    false,
    ARRAY['clothing', 'blanks', 'crewnecks', 'sweatshirts', 'gildan', 'heavy-blend', 'fleece', 'classic-fit']::text[],
    '[{"id":"20","name":"Black","slug":"black","hex":"#262629","image":"thread-and-butter/clothing/gildan-18000/black","sizes":["S","M","L","XL","2XL"]},{"id":"23","name":"White","slug":"white","hex":"#f6f5f2","image":"thread-and-butter/clothing/gildan-18000/white","sizes":["S","M","L","XL","2XL"]},{"id":"343","name":"Navy Blue","slug":"navy-blue","hex":"#27334a","image":"thread-and-butter/clothing/gildan-18000/navy-blue","sizes":["S","M","L","XL","2XL"]},{"id":"106","name":"Sport Grey","slug":"sport-grey","hex":"#a8a8a5","image":"thread-and-butter/clothing/gildan-18000/sport-grey","sizes":["S","M","L","XL","2XL"]},{"id":"101","name":"Charcoal","slug":"charcoal","hex":"#505255","image":"thread-and-butter/clothing/gildan-18000/charcoal","sizes":["S","M","L","XL","2XL"]},{"id":"152","name":"Irish Green","slug":"irish-green","hex":"#28824b","image":"thread-and-butter/clothing/gildan-18000/irish-green","sizes":["S","M","L","XL","2XL"]},{"id":"36","name":"Light Blue","slug":"light-blue","hex":"#8db8d3","image":"thread-and-butter/clothing/gildan-18000/light-blue","sizes":["S","M","L","XL","2XL"]},{"id":"160","name":"Light Pink","slug":"light-pink","hex":"#efb8c6","image":"thread-and-butter/clothing/gildan-18000/light-pink","sizes":["S","M","L","XL","2XL"]},{"id":"176","name":"Maroon","slug":"maroon","hex":"#5e2938","image":"thread-and-butter/clothing/gildan-18000/maroon","sizes":["S","M","L","XL","2XL"]},{"id":"178","name":"Sand","slug":"sand","hex":"#c7b79c","image":"thread-and-butter/clothing/gildan-18000/sand","sizes":["S","M","L","XL","2XL"]},{"id":"228","name":"Gold","slug":"gold","hex":"#dba62b","image":"thread-and-butter/clothing/gildan-18000/gold","sizes":["S","M","L","XL","2XL"]},{"id":"59","name":"Red","slug":"red","hex":"#c72d37","image":"thread-and-butter/clothing/gildan-18000/red","sizes":["S","M","L","XL","2XL"]},{"id":"133","name":"Purple","slug":"purple","hex":"#533b70","image":"thread-and-butter/clothing/gildan-18000/purple","sizes":["S","M","L","XL","2XL"]},{"id":"99","name":"Orange","slug":"orange","hex":"#ed7b2d","image":"thread-and-butter/clothing/gildan-18000/orange","sizes":["S","M","L","XL","2XL"]}]'::jsonb
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
