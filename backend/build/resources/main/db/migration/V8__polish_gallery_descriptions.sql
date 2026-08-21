UPDATE products
SET long_description = replace(
    long_description,
    'then completed with a embroidered finish for a clear presentation',
    'then completed using embroidery for a clear presentation'
),
updated_at = now()
WHERE category = 'gallery'
  AND long_description LIKE '%then completed with a embroidered finish for a clear presentation%';

UPDATE products
SET long_description = replace(
    long_description,
    'then completed with a printed finish for a clear presentation',
    'then completed using print for a clear presentation'
),
updated_at = now()
WHERE category = 'gallery'
  AND long_description LIKE '%then completed with a printed finish for a clear presentation%';
