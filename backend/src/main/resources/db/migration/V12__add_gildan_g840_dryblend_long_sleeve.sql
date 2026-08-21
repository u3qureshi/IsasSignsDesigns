INSERT INTO products (
    id, slug, name, description, long_description, category, price_cents, currency,
    images, material, is_active, is_featured, is_customizable, tags, variants
) VALUES (
    uuid_generate_v5(uuid_ns_url(), 'thread-and-butter/clothing/gildan-g840-dryblend-long-sleeve-t-shirt'),
    'gildan-g840-dryblend-long-sleeve-t-shirt',
    'Gildan G840 DryBlend Long-Sleeve T-Shirt',
    'A moisture-wicking long-sleeve blank with a comfortable classic fit, soft cotton feel, and dependable everyday coverage.',
    'The Gildan G840 DryBlend Long-Sleeve T-Shirt combines the familiar feel of cotton with moisture-wicking polyester for comfortable everyday, active, and work wear. Its classic fit leaves room for easy movement, while taped shoulders, a ribbed collar, and stretch-recovery cuffs support lasting shape. The smooth 50/50 surface also works well for printing and other decoration methods.',
    'clothing',
    2800,
    'CAD',
    '["thread-and-butter/clothing/gildan-g840/black"]',
    '5.5 oz, 50% U.S. cotton and 50% polyester DryBlend fabric',
    true,
    false,
    false,
    ARRAY['clothing', 'blanks', 'long-sleeve', 't-shirts', 'gildan', 'dryblend', 'moisture-wicking']::text[],
    '[{"id":"20","name":"Black","slug":"black","hex":"#242424","image":"thread-and-butter/clothing/gildan-g840/black","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"23","name":"White","slug":"white","hex":"#f4f4f2","image":"thread-and-butter/clothing/gildan-g840/white","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"343","name":"Navy Blue","slug":"navy-blue","hex":"#28344a","image":"thread-and-butter/clothing/gildan-g840/navy-blue","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"106","name":"Sport Grey","slug":"sport-grey","hex":"#a6a6a6","image":"thread-and-butter/clothing/gildan-g840/sport-grey","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"188","name":"Dark Heather","slug":"dark-heather","hex":"#474b4e","image":"thread-and-butter/clothing/gildan-g840/dark-heather","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"16365","name":"Graphite Heather","slug":"graphite-heather","hex":"#626264","image":"thread-and-butter/clothing/gildan-g840/graphite-heather","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"1445","name":"Ash Grey","slug":"ash-grey","hex":"#d6d6d1","image":"thread-and-butter/clothing/gildan-g840/ash-grey","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"162","name":"Forest Green","slug":"forest-green","hex":"#294f3c","image":"thread-and-butter/clothing/gildan-g840/forest-green","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"maroon","name":"Maroon","slug":"maroon","hex":"#5d2837","image":"thread-and-butter/clothing/gildan-g840/maroon","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"41","name":"Red","slug":"red","hex":"#c62d35","image":"thread-and-butter/clothing/gildan-g840/red","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"345","name":"Royal Blue","slug":"royal-blue","hex":"#2855a5","image":"thread-and-butter/clothing/gildan-g840/royal-blue","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"carolina-blue","name":"Carolina Blue","slug":"carolina-blue","hex":"#6898c3","image":"thread-and-butter/clothing/gildan-g840/carolina-blue","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"38","name":"Orange","slug":"orange","hex":"#ed7b2c","image":"thread-and-butter/clothing/gildan-g840/orange","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"348","name":"Safety Green","slug":"safety-green","hex":"#c2d82e","image":"thread-and-butter/clothing/gildan-g840/safety-green","sizes":["S","M","L","XL","2XL","3XL"]},{"id":"202","name":"Safety Orange","slug":"safety-orange","hex":"#f36b2f","image":"thread-and-butter/clothing/gildan-g840/safety-orange","sizes":["S","M","L","XL","2XL","3XL"]}]'::jsonb
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
