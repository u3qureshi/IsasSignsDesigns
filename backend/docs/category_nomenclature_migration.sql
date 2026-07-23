-- Normalize legacy display-style categories to lowercase hyphenated identifiers.
-- Review and back up the current database before applying in a shared environment.

UPDATE products SET category = 'home-decor', updated_at = now()
WHERE lower(category) IN ('home decor', 'home-decor');

UPDATE products SET category = 'kids', updated_at = now()
WHERE lower(category) = 'kids';

UPDATE products SET category = 'ramadan-decor', updated_at = now()
WHERE lower(category) IN ('ramadan decor', 'ramadan-decor');

UPDATE products SET category = 'wall-art', updated_at = now()
WHERE lower(category) IN ('wall art', 'wall-art');

UPDATE products SET category = 'business-events', updated_at = now()
WHERE lower(category) IN ('business/events', 'business events', 'business-events');

UPDATE products SET category = 'embroidery-anime', updated_at = now()
WHERE lower(category) IN ('embroidery - anime', 'embroidery-anime');

UPDATE products SET category = 'embroidery-baby-clothing', updated_at = now()
WHERE lower(category) IN ('embroidery - baby clothing', 'embroidery-baby-clothing');

UPDATE products SET category = 'embroidery-fathers-day', updated_at = now()
WHERE lower(category) IN ('embroidery - father''s day', 'embroidery-fathers-day');

UPDATE products SET category = 'embroidery-mothers-day', updated_at = now()
WHERE lower(category) IN ('embroidery - mother''s day', 'embroidery-mothers-day');

UPDATE products SET category = 'embroidery-seasonal-holidays', updated_at = now()
WHERE lower(category) IN ('embroidery - seasonal & holidays', 'embroidery-seasonal-holidays');

UPDATE products SET category = 'embroidery-custom-designs', updated_at = now()
WHERE lower(category) IN ('embroidery - custom designs', 'embroidery-custom-designs');

UPDATE products SET category = 'printing-popular-designs', updated_at = now()
WHERE lower(category) IN ('printing - popular designs', 'printing-popular-designs');

UPDATE products SET category = 'printing-custom', updated_at = now()
WHERE lower(category) IN ('printing - custom', 'printing-custom');

SELECT category, count(*)
FROM products
GROUP BY category
ORDER BY category;
