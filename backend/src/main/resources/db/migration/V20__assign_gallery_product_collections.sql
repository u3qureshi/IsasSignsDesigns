-- A product keeps its primary Gallery category while collection tags allow the same
-- product card to appear in one or more Printing/Embroidery submenu pages.

UPDATE products
SET tags = array_append(coalesce(tags, ARRAY[]::text[]), 'printing-popular-designs'),
    updated_at = now()
WHERE category = 'gallery'
  AND 'printed' = ANY(coalesce(tags, ARRAY[]::text[]))
  AND NOT ('printing-popular-designs' = ANY(coalesce(tags, ARRAY[]::text[])));

UPDATE products
SET tags = array_append(coalesce(tags, ARRAY[]::text[]), 'embroidery-anime'),
    updated_at = now()
WHERE category = 'gallery'
  AND 'embroidered' = ANY(coalesce(tags, ARRAY[]::text[]))
  AND 'anime-inspired' = ANY(coalesce(tags, ARRAY[]::text[]))
  AND NOT ('embroidery-anime' = ANY(coalesce(tags, ARRAY[]::text[])));

UPDATE products
SET tags = array_append(coalesce(tags, ARRAY[]::text[]), 'embroidery-fathers-day'),
    updated_at = now()
WHERE slug IN (
    'personalized-daddy-est-embroidered-hoodie',
    'personalized-dad-or-grandpa-embroidered-sweatshirt',
    'personalized-papa-est-embroidered-sweatshirt',
    'dad-forest-embroidered-hoodie',
    'dad-names-on-sleeve-embroidered-sweatshirt',
    'personalized-mama-dad-matching-sweatshirt-set'
)
  AND 'embroidered' = ANY(coalesce(tags, ARRAY[]::text[]))
  AND NOT ('embroidery-fathers-day' = ANY(coalesce(tags, ARRAY[]::text[])));

UPDATE products
SET tags = array_append(coalesce(tags, ARRAY[]::text[]), 'embroidery-mothers-day'),
    updated_at = now()
WHERE slug IN (
    'cursive-mama-names-on-sleeve-sweatshirt',
    'floral-grandma-embroidered-quarter-zip',
    'floral-mama-personalized-crewneck',
    'mama-kids-names-embroidered-crewneck',
    'personalized-mama-dad-matching-sweatshirt-set'
)
  AND 'embroidered' = ANY(coalesce(tags, ARRAY[]::text[]))
  AND NOT ('embroidery-mothers-day' = ANY(coalesce(tags, ARRAY[]::text[])));

UPDATE products
SET tags = array_append(coalesce(tags, ARRAY[]::text[]), 'embroidery-seasonal-holidays'),
    updated_at = now()
WHERE slug IN (
    'pinky-promise-anniversary-hoodie-set',
    'mr-mrs-embroidered-couples-set',
    'personalized-roman-numeral-hoodie',
    'wifey-hubby-personalized-sweatshirt-set',
    'yapper-listener-matching-hoodie-set'
)
  AND 'embroidered' = ANY(coalesce(tags, ARRAY[]::text[]))
  AND NOT ('embroidery-seasonal-holidays' = ANY(coalesce(tags, ARRAY[]::text[])));
