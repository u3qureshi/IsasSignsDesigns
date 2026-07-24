# Custom embroidery notifications

After a custom embroidery request commits successfully, the backend now:

1. Sends the customer one confirmation through the contact method selected in the form:
   - `email` sends a detailed confirmation email.
   - `phone` sends a concise SMS confirmation.
2. Sends the Thread & Butter administrator:
   - one detailed email containing all saved request fields and saved-image metadata;
   - one concise SMS announcing the request.
3. Saves every planned delivery and its outcome in
   `custom_embroidery_notifications`.

Notification delivery does not undo a successfully saved customer request. A delivery is recorded
as `SENT`, `FAILED`, or `SKIPPED`, including a provider ID or failure/skip explanation where
available.

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

## SMS setup

SMS uses Twilio's Messages API. Create a Twilio account, obtain an SMS-capable Twilio number, and
add these values to `backend/.env`:

```dotenv
THREAD_AND_BUTTER_ADMIN_PHONE=+14165551234
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_FROM_NUMBER=+14165551234
SMS_NOTIFICATIONS_ENABLED=true
```

Phone values should use E.164 format (`+1` followed by the ten-digit Canadian/US number). During a
Twilio trial, destination numbers generally need to be verified in Twilio before they can receive
messages.

## Safe activation order

1. Fill the email variables while `EMAIL_NOTIFICATIONS_ENABLED=false`.
2. Fill the Twilio variables while `SMS_NOTIFICATIONS_ENABLED=false`.
3. Restart Spring Boot and confirm it starts normally.
4. Turn on one channel at a time and submit a test request.
5. Inspect the latest notification records:

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
