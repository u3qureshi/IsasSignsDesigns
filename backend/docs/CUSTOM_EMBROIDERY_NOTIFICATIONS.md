# Custom embroidery notifications

After a custom embroidery request commits successfully, the backend now:

1. Sends the customer a confirmation email stating that the submission succeeded and Thread &
   Butter will reach out shortly.
2. Sends the Thread & Butter administrator one detailed email containing all saved request fields
   and saved-image metadata.
3. Saves every planned delivery and its outcome in
   `custom_embroidery_notifications`.

Notification delivery does not undo a successfully saved customer request. A delivery is recorded
as `SENT`, `FAILED`, or `SKIPPED`, including a provider ID or failure/skip explanation where
available.

The form and submission API are intentionally email-only for the current phase. SMS/Twilio code is
retained for possible future use but is not invoked by a custom embroidery submission.

## Email setup

Email uses Spring's SMTP support, so it works with any SMTP provider. Add these values to
`backend/.env`:

```dotenv
THREAD_AND_BUTTER_ADMIN_EMAIL=your-real-email@example.com
EMAIL_FROM_ADDRESS=orders@your-domain.example
SMTP_HOST=your-provider-smtp-host
SMTP_PORT=587
SMTP_USERNAME=your-smtp-username
SMTP_PASSWORD=your-smtp-password-or-app-password
SMTP_AUTH=true
SMTP_STARTTLS_ENABLED=true
EMAIL_NOTIFICATIONS_ENABLED=true
```

If you use Gmail, use a Google App Password rather than your normal account password. Your Google
account must have two-step verification enabled before an App Password can be created.

For Gmail, use:

```dotenv
EMAIL_FROM_ADDRESS=your-email@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-16-character-google-app-password-without-spaces
SMTP_AUTH=true
SMTP_STARTTLS_ENABLED=true
EMAIL_NOTIFICATIONS_ENABLED=true
```

## Safe activation order

1. Fill the email variables while `EMAIL_NOTIFICATIONS_ENABLED=false`.
2. Keep `SMS_NOTIFICATIONS_ENABLED=false`; Twilio credentials are not needed.
3. Restart Spring Boot and confirm it starts normally.
4. Set `EMAIL_NOTIFICATIONS_ENABLED=true`, restart, and submit a request with an email address you
   can inspect.
5. Confirm that the customer and administrator emails arrive.
6. Inspect the latest notification records:

```sql
SELECT
    n.created_at,
    r.request_number,
    n.audience,
    n.channel,
    n.recipient,
    n.status,
    n.provider,
    n.provider_message_id,
    n.error_message
FROM custom_embroidery_notifications n
JOIN custom_embroidery_requests r ON r.id = n.request_id
ORDER BY n.created_at DESC;
```

## Complete request storage

Migration `V4__embroidery_notifications_and_complete_details.sql` adds:

- `customer_image_intent` to `custom_embroidery_requests`;
- `ai_preview_failed` to `custom_embroidery_requests`;
- `custom_embroidery_notifications` for the full delivery audit trail.

Existing request and image tables continue storing customer information, every form choice,
acknowledgements, AI metadata, upload metadata, and Cloudinary asset identifiers.
