CREATE INDEX idx_custom_requests_user_created
    ON custom_embroidery_requests (user_id, created_at DESC);

UPDATE customer_orders orders
SET user_id = users.id
FROM app_users users
WHERE orders.user_id IS NULL
  AND orders.customer_email IS NOT NULL
  AND lower(trim(orders.customer_email)) = users.normalized_email;

UPDATE custom_embroidery_requests requests
SET user_id = users.id
FROM app_users users
WHERE requests.user_id IS NULL
  AND requests.customer_email IS NOT NULL
  AND lower(trim(requests.customer_email)) = users.normalized_email;
