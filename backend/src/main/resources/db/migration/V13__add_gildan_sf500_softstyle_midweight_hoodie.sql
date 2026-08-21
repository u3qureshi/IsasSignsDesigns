INSERT INTO products (
    id, slug, name, description, long_description, category, price_cents, currency,
    images, material, is_active, is_featured, is_customizable, tags, variants
) VALUES (
    uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/clothing/gildan-sf500-softstyle-midweight-fleece-hoodie'),
    'gildan-sf500-softstyle-midweight-fleece-hoodie',
    'Gildan SF500 Softstyle Midweight Fleece Hoodie',
    'A comfortably soft midweight pullover hoodie with a classic fit, brushed interior, and smooth decoration-ready surface.',
    'The Gildan SF500 Softstyle Midweight Fleece Hoodie balances everyday warmth with a soft, easy-wearing feel. Its brushed interior, dropped shoulders, and classic tubular fit provide comfortable room for layering, while the lined hood, flat drawcords, pouch pocket, and stretch-recovery ribbing add practical finishing details. A smooth ring-spun cotton face makes it a dependable blank for printing, embroidery, heat transfer, patches, and DTG decoration.',
    'clothing',
    4500,
    'CAD',
    '["thread-and-butter/clothing/gildan-sf500/black"]',
    '8.4 oz midweight fleece, 80% ring-spun cotton and 20% polyester',
    true,
    false,
    false,
    ARRAY['clothing', 'blanks', 'hoodies', 'gildan', 'softstyle', 'midweight', 'fleece', 'pullover']::text[],
    '[{"id":"20","name":"Black","slug":"black","hex":"#28282b","image":"thread-and-butter/clothing/gildan-sf500/black","sizes":["S","M","L","XL","2XL","3XL","4XL","5XL"]},{"id":"23","name":"White","slug":"white","hex":"#f6f5f1","image":"thread-and-butter/clothing/gildan-sf500/white","sizes":["S","M","L","XL","2XL","3XL","4XL","5XL"]},{"id":"343","name":"Navy Blue","slug":"navy-blue","hex":"#26344b","image":"thread-and-butter/clothing/gildan-sf500/navy-blue","sizes":["S","M","L","XL","2XL","3XL","4XL","5XL"]},{"id":"101","name":"Charcoal","slug":"charcoal","hex":"#515356","image":"thread-and-butter/clothing/gildan-sf500/charcoal","sizes":["S","M","L","XL","2XL","3XL","4XL"]},{"id":"1445","name":"Ash Grey","slug":"ash-grey","hex":"#d7d7d2","image":"thread-and-butter/clothing/gildan-sf500/ash-grey","sizes":["S","M","L","XL","2XL","3XL","4XL","5XL"]},{"id":"cool-grey","name":"Cool Grey","slug":"cool-grey","hex":"#dededb","image":"thread-and-butter/clothing/gildan-sf500/cool-grey","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"forest-green","name":"Forest Green","slug":"forest-green","hex":"#294f3c","image":"thread-and-butter/clothing/gildan-sf500/forest-green","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"154","name":"Military Green","slug":"military-green","hex":"#596044","image":"thread-and-butter/clothing/gildan-sf500/military-green","sizes":["S","M","L","XL","2XL","3XL","4XL"]},{"id":"4753","name":"Brown Savana","slug":"brown-savana","hex":"#72594a","image":"thread-and-butter/clothing/gildan-sf500/brown-savana","sizes":["S","M","L","XL","2XL","3XL","4XL"]},{"id":"178","name":"Sand","slug":"sand","hex":"#c9b89b","image":"thread-and-butter/clothing/gildan-sf500/sand","sizes":["S","M","L","XL","2XL","3XL","4XL"]},{"id":"7199","name":"Off White","slug":"off-white","hex":"#eee7da","image":"thread-and-butter/clothing/gildan-sf500/off-white","sizes":["S","M","L","XL","2XL","3XL","4XL","5XL"]},{"id":"160","name":"Light Pink","slug":"light-pink","hex":"#efbdc8","image":"thread-and-butter/clothing/gildan-sf500/light-pink","sizes":["S","M","L","XL","2XL","3XL","4XL"]},{"id":"59","name":"Red","slug":"red","hex":"#c62e39","image":"thread-and-butter/clothing/gildan-sf500/red","sizes":["S","M","L","XL","2XL","3XL","4XL","5XL"]},{"id":"2803","name":"Royal Blue","slug":"royal-blue","hex":"#2e57a5","image":"thread-and-butter/clothing/gildan-sf500/royal-blue","sizes":["S","M","L","XL","2XL","3XL","4XL"]}]'::jsonb
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
