# Custom embroidery notifications

After a custom embroidery request commits successfully, the backend now:

1. Sends the customer a confirmation email stating that the submission succeeded and Thread &
   Butter will reach out shortly.
2. Sends the Thread & Butter administrator one detailed email containing all saved request fields
   and saved-image metadata.
3. When present, attaches a delivery-sized JPEG copy of the customer's uploaded artwork and the AI
   preview to both emails. The protected Cloudinary originals and database metadata are unchanged.
4. Saves every planned delivery and its outcome in
   `custom_embroidery_notifications`.

Notification delivery does not undo a successfully saved customer request. A delivery is recorded
as `SENT`, `FAILED`, or `SKIPPED`, including a provider ID or failure/skip explanation where
available.

Email remains the required contact and notification channel for the current phase. The form also
collects an optional phone number and an explicit optional text-message consent decision. Those
values are saved and included in the emails, but SMS/Twilio code is not invoked by a custom
embroidery submission.

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
SMTP_STARTTLS_REQUIRED=true
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
SMTP_STARTTLS_REQUIRED=true
EMAIL_NOTIFICATIONS_ENABLED=true
```

`EMAIL_REPLY_TO_ADDRESS` is optional and defaults to `THREAD_AND_BUTTER_ADMIN_EMAIL`. The visible
From address must remain the authenticated SMTP account or an address that the provider has
explicitly authorized; changing only the From header to an unrelated address harms authentication
and deliverability.

## Image attachments

- `UPLOADED_REFERENCE`/`UPLOADED_EXACT_ARTWORK` becomes
  `thread-and-butter-uploaded-artwork.jpg`.
- `AI_GENERATED_CONCEPT` becomes `thread-and-butter-ai-preview.jpg`.
- The backend creates a signed Cloudinary transformation capped at 1600×1600 with email-appropriate
  JPEG compression, then attaches the returned bytes. Signed Cloudinary URLs are never placed in
  the email.
- Each preview is limited to 5 MB. If a protected asset cannot be downloaded, the request remains
  saved and the text email is still delivered; the failure is logged for diagnosis.
- These are convenient email previews only. Cloudinary continues storing the exact protected
  original, including its original format and full resolution.

## Inbox placement

Application code cannot guarantee that an email will avoid spam. The largest improvements come
from authenticating and aligning the sending domain:

1. Keep the SMTP From address aligned with the account/domain that actually sends the message.
2. Require STARTTLS in production (`SMTP_STARTTLS_REQUIRED=true`).
3. For a custom domain, publish SPF for every real sender, enable 2048-bit DKIM with the mail
   provider, and publish DMARC. Begin DMARC at `p=none`, monitor reports, then move to quarantine or
   reject only after SPF and DKIM consistently pass.
4. Send these messages only after the recipient submits the form. Keep confirmations transactional
   and do not mix promotional content into them.
5. Use a stable From address, increase volume gradually, avoid bought lists, and monitor the
   sending domain in Google Postmaster Tools.
6. Inspect a delivered Gmail message with **Show original** and verify `SPF: PASS`, `DKIM: PASS`,
   and `DMARC: PASS`.

The mailer now emits standards-compliant MIME messages, a stable Thread & Butter sender name,
Reply-To support, `Auto-Submitted: auto-generated`, and `X-Auto-Response-Suppress: All`. These
improve message correctness and prevent reply loops, but SPF/DKIM/DMARC and sender reputation remain
the decisive deliverability controls.

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

Migration `V5__custom_embroidery_sms_consent.sql` adds:

- `sms_consent`, a non-null boolean defaulting to `false`, to
  `custom_embroidery_requests`.

`customer_phone` remains nullable. When provided, the backend requires 10 to 15 digits. Consent
cannot be selected without a phone number. No text is sent in this phase, regardless of consent.
