UPDATE products
SET slug = 'duck-daisy-embroidered-crewneck',
    name = 'Duck & Daisy Embroidered Crewneck',
    description = 'An embroidered crewneck sweatshirt featuring a playful duck-and-daisy design with a clean, wearable finish.',
    long_description = 'Duck & Daisy Embroidered Crewneck pairs a cheerful nature-inspired design with an easy-to-style crewneck sweatshirt. The artwork is scaled and positioned to suit the garment, then completed using embroidery for a polished presentation. Available colours and sizes may vary; review the final selection and care guidance before placing an order.',
    price_cents = 6000,
    currency = 'CAD',
    images = '["thread-and-butter/gallery/duck-daisy-embroidered-crewneck/image-1","thread-and-butter/gallery/duck-daisy-embroidered-crewneck/image-2","thread-and-butter/gallery/duck-daisy-embroidered-crewneck/image-3"]',
    material = 'Apparel garment with embroidered decoration',
    is_active = true,
    is_featured = false,
    is_customizable = false,
    tags = ARRAY['gallery', 'crewneck-sweatshirt', 'hoodies-sweatshirts', 'embroidered']::text[],
    updated_at = now()
WHERE slug = 'drink-more-water-goose-t-shirt';
