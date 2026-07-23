# Thread & Butter — Custom Embroidery Request Flow

## 1. Purpose

The Custom Embroidery page will let a customer describe an embroidery idea, optionally upload images, choose an item and placement, enter an approximate size and quantity, and receive a preliminary concept and estimate.

This is an **initial request and quote tool**, not a final checkout or production approval system.

The customer must understand that:

- generated artwork is a preliminary concept;
- size, stitch count, thread colours, and price are estimates;
- Thread & Butter will confirm the final design and price;
- follow-up will happen by the customer's preferred contact method;
- tax, delivery, shipping, and rush fees are not included yet.

### Current UI prototype decisions (2026-07-23)

The implemented React prototype intentionally narrows and reorders parts of the original rough plan below:

- customer information is the first card;
- every card validates before Next can advance, and future progress labels are disabled;
- successful Next and Back navigation scrolls to just above the progress tabs for the newly displayed card;
- email format is validated and the phone field accepts digits only;
- the artwork-handling choice is required;
- the prototype accepts no more than one uploaded image;
- the upload is optional only when generating one concept from the description or requesting manual review;
- exact-upload and upload-as-inspiration choices require an uploaded image;
- the UI communicates a limit of one future AI concept image per user account daily and has no AI image editing;
- the upload control is a compact clickable file-selection box;
- the Preview card advances with **Generate AI preview** for generate/inspiration modes or **Review details** for exact-upload/manual-review modes;
- item provider and item type are required, and both providers share the same item-type selector;
- selecting Other for either provider reveals the same required item-description field;
- current item types include Hoodie, Crewneck, Pants, Sweatpants, Jeans, Tote bag, Towel, T-shirt, Beanie, Hat, and Other;
- placement choices depend on the item type, preventing choices such as a chest placement on a hat;
- known size requires both width and height;
- final submission remains UI-only and does not save or send anything.

Where the older exploratory notes below conflict with this section or the implementation, this section describes the current decision.

---

## 2. Main Customer Flow

```text
Open Custom Embroidery page
        ↓
Describe the idea
        ↓
Choose whether to use AI
        ↓
Upload an image when required by the artwork choice
        ↓
Choose who supplies the item
        ↓
Choose item and placement
        ↓
Enter approximate size and quantity
        ↓
Generate concept or placement preview
        ↓
Review size, stitch, colour, and price estimates
        ↓
Accept estimate and artwork permissions notices
        ↓
Submit request
        ↓
Save request and images
        ↓
Notify Thread & Butter
        ↓
Follow up manually to finalize design and price
```

Recommended page sections:

1. Tell Us Your Idea
2. Add Images
3. Choose the Item
4. Choose Placement and Size
5. Enter Quantity
6. Generate Preview
7. Review Estimate
8. Add Contact Information
9. Submit Request

---

## 3. Tell Us Your Idea

### Main idea field

**Label:**

> Describe what you would like embroidered

**Placeholder:**

> Example: A simple outline of a fisherman holding a bass with “Best Dad” underneath. I want it on the left chest of a black hoodie.

The customer can describe:

- subject;
- style;
- exact wording;
- preferred colours;
- desired level of detail;
- placement;
- special instructions.

### Exact text field

Use a separate optional field to reduce spelling errors.

**Label:**

> Exact text to include, if any

The application should render exact text separately whenever possible rather than relying on the image model to spell it correctly.

---

## 4. AI and Uploaded Images

### AI selection

```text
○ Generate an AI concept from my description
○ Use my uploaded design without AI changes
○ Use my uploaded image as inspiration for an AI concept
○ I do not need a generated image; submit my request for review
```

Cloudflare Workers AI will be used for:

- text-to-image concept generation;
- image editing;
- simplifying a reference image;
- creating an embroidery-style visual concept.

AI must remain optional.

### Image uploads

Allow multiple uploads.

Recommended formats:

- PNG
- JPG
- JPEG
- WEBP
- SVG
- PDF later, when supported

Recommended initial limits:

- up to 5 files;
- maximum 10 MB per file.

For each image, allow:

```text
○ Use this exact image or logo
○ Use this only as inspiration
○ Use this as a placement reference
```

When **Use this exact image or logo** is selected:

- do not ask generative AI to redraw it;
- preserve the original artwork;
- remove the background only when needed;
- scale and place it on the mockup;
- explain that embroidery may require simplification after review.

---

## 5. Who Provides the Item?

Use required radio buttons:

```text
○ I will provide the item
○ Thread & Butter will provide the item
```

### Customer provides the item

Show the same required item-type choices used for a Thread & Butter-provided item.
Do not show a general-purpose text field before an item type is selected.

When the customer selects **Other**, show the shared required text box:

**Label:**

> What item will be embroidered?

**Placeholder:**

> Example: denim jacket, baby blanket, work apron

Customer-facing notice:

> This estimate is for embroidery only. The customer is supplying the item.

Also show:

> Final approval depends on the material, thickness, seams, construction, and whether the item can safely be embroidered.

### Thread & Butter provides the item

Show:

```text
○ Hoodie
○ Crewneck
○ Pants
○ Sweatpants
○ Jeans
○ Tote bag
○ Towel
○ T-shirt
○ Beanie
○ Hat
○ Other
```

When **Other** is selected for either provider, show the same shared field:

**Label:**

> What item will be embroidered?

For unknown or custom items, show:

> The current estimate is for embroidery only. The item price will be confirmed separately.

---

## 6. Internal Item Pricing

These values are internal defaults used for preliminary estimates:

```yaml
hoodie: 50.00
crewneck: 45.00
jeans: 50.00
sweatpants: 40.00
```

The following can be configured later:

```text
Pants
Tote bag
Towel
T-shirt
Other
```

Do not show the internal base-cost breakdown unless Thread & Butter later decides to.

Customer-facing display:

```text
Estimated embroidery price: $XX–$YY CAD
Estimated total with item: $XX–$YY CAD
```

For a customer-supplied item:

```text
Estimated embroidery price: $XX–$YY CAD
Item supplied by customer
```

For an unknown Thread & Butter item:

```text
Estimated embroidery price: $XX–$YY CAD
Item price to be confirmed
```

---

## 7. Placement Options

Use visual cards or radio buttons. The React UI selects from an item-specific list:

```text
Hoodie/Crewneck/T-shirt:
    chest, front, back, sleeve, and applicable pocket choices

Pants/Sweatpants/Jeans:
    left/right thigh, left/right pant leg, back pocket

Tote bag:
    centre front, upper front, or lower corners

Towel:
    corner, centre, or border

Beanie:
    front, left side, or right side

Hat:
    front, left side, right side, or back

Other item:
    front, back, left side, or right side

Every item-specific list also includes Other.
```

When **Other** is selected, show:

> Describe the placement

Placement options change immediately based on the selected item. If an item change makes the
existing placement invalid, React clears it and requires a new selection.

---

## 8. Approximate Size

Options:

```text
○ I know the approximate size
○ Recommend a suitable size
```

When the customer knows the size:

```text
Width:  [     ] inches
Height: [     ] inches
```

Both dimensions are required when the customer selects **I know the approximate size**.

When recommendation is selected, the system considers:

- item;
- placement;
- design shape;
- amount of text;
- detail level;
- artwork proportions;
- readability.

Example:

```text
Recommended embroidery size:
4.0 × 3.2 inches
```

---

## 9. Quantity

Use a required number field.

```text
Minimum: 1
```

For very large quantities, show:

> Bulk pricing will be confirmed after review.

The MVP does not need a complicated volume-discount system.

---

## 10. Generate Concept or Preview

Buttons can change based on the selected mode:

```text
Generate My Embroidery Concept
Create My Placement Preview
Continue to Request Summary
```

The result should show:

1. generated or uploaded design;
2. product placement preview;
3. recommended embroidery size;
4. estimated stitch-count range;
5. estimated thread-colour range;
6. complexity;
7. estimated embroidery price;
8. estimated total when a known item is supplied by Thread & Butter;
9. warnings or review notes.

Example:

```text
Recommended size
4.0 × 3.2 inches

Estimated stitch count
8,000–11,000 stitches

Estimated thread colours
3–4 colours

Complexity
Medium

Estimated embroidery price
$30–$38 CAD

Estimated total with hoodie
$80–$88 CAD
```

Use **estimated stitch count**, not thread count.

Use **estimated thread colours** for the number of different thread colours.

---

## 11. AI Prompt Construction

The customer's raw text should not be passed directly to the model without structure.

Example backend prompt:

```text
Create a clean embroidery design concept.

Customer idea:
A fisherman holding a largemouth bass.

Exact text:
Do not generate text. Leave a clear area below the illustration.

Item:
Black hoodie.

Placement:
Left chest.

Approximate size:
4 inches wide.

Style requirements:
- simple embroidery-friendly design;
- bold clean outlines;
- flat solid shapes;
- limited colour palette;
- no gradients;
- no drop shadows;
- no photographic background;
- no tiny details;
- clear silhouette;
- suitable for a small left-chest design.

Return one centred design concept on a transparent or plain background.
```

Exact text should be added separately by the application when possible.

---

## 12. Placement Preview

Use deterministic image composition for product mockups.

The application should:

1. select the correct item mockup;
2. load stored placement coordinates;
3. scale the design while preserving aspect ratio;
4. place it on the mockup;
5. apply a simple mask or texture effect;
6. save the preview.

This preserves exact logos and exact text better than asking AI to generate the entire garment.

Example configuration:

```json
{
  "productType": "HOODIE",
  "placement": "LEFT_CHEST",
  "canvasWidth": 1600,
  "canvasHeight": 1800,
  "placementArea": {
    "x": 340,
    "y": 420,
    "width": 280,
    "height": 280
  }
}
```

---

## 13. Stitch-Count Estimate

The exact stitch count is known after digitization, so the page must show a range.

The estimator can use:

- physical width and height;
- filled-area percentage;
- outline length;
- number of colours;
- number of separated shapes;
- text length;
- small-detail score;
- expected underlay;
- item/fabric type;
- placement.

Example:

```json
{
  "estimatedStitchesMin": 8000,
  "estimatedStitchesMax": 11000,
  "estimatedThreadColors": 4,
  "complexity": "MEDIUM"
}
```

---

## 14. Preliminary Pricing Model

Keep the model simple.

Do not include yet:

- tax;
- delivery;
- shipping;
- rush fees.

Basic estimate:

```text
Estimated embroidery price
=
base embroidery amount
+ stitch-range amount
+ complexity amount
+ placement amount when applicable
```

When Thread & Butter supplies a known item:

```text
Estimated total
=
estimated embroidery price
+ internal item base price
```

When the customer supplies the item:

```text
Estimated total
=
estimated embroidery price only
```

When the item is unknown or Other:

```text
Estimated embroidery price only
Item price to be confirmed
```

Customer-facing notice:

> This is a preliminary estimate. Tax, delivery, shipping, item availability, digitizing adjustments, and final design changes are not included. Thread & Butter will confirm the final design and price before production.

---

## 15. Edit and Regenerate Options

When AI is enabled, offer simple actions:

```text
Regenerate
Make it simpler
Use fewer colours
Make the outline thicker
Make it more detailed
Change the style
Change the placement
Change the size
```

Recommended MVP limit:

```text
2–3 AI generations per request
```

---

## 16. Contact Information

The customer chooses one preferred method:

```text
How should we contact you?

○ Email
○ Phone
```

### Email selected

Show:

```text
Email address: [                         ]
```

Rules:

- valid email required;
- phone hidden or optional;
- confirmation email sent.

### Phone selected

Show:

```text
Phone number: [                         ]
```

Rules:

- valid phone number required;
- email hidden or optional;
- allow Canadian and international formats.

The customer does **not** need to provide both.

Also require:

```text
Full name: [                         ]
```

---

## 17. Agreements

Require:

```text
☐ I understand that the generated image, recommended size,
  stitch count, thread colours, and price are preliminary estimates.
  Thread & Butter will contact me to confirm the final design,
  item details, and final price before production.
```

Also require:

```text
☐ I confirm that I own or have permission to use the uploaded
  images, names, logos, artwork, and other content in this request.
```

Any marketing consent must be separate and unchecked by default.

---

## 18. Final Request Summary

Example:

```text
CUSTOM EMBROIDERY REQUEST

Idea:
Simple fisherman holding a bass with “Best Dad” underneath

AI:
AI concept requested

Item provider:
Thread & Butter

Item:
Hoodie

Placement:
Left chest

Requested size:
Recommend a suitable size

Recommended size:
4.0 × 3.2 inches

Quantity:
2

Estimated stitch count:
8,000–11,000

Estimated thread colours:
3–4

Estimated embroidery price:
$30–$38 CAD per item

Estimated total with item:
$80–$88 CAD per item

Preferred contact:
Email

Final price:
To be confirmed by Thread & Butter
```

Recommended submit button:

> Submit My Embroidery Request

Do not use:

- Buy Now
- Place Order
- Confirm Purchase

---

## 19. Submission Confirmation

After submission:

```text
Thank you — your request has been submitted.

Request number:
TNB-EMB-2026-0048

Thread & Butter will review the design and contact you using
your preferred contact method to confirm the final details and price.
```

---

## 20. Database Model

### Main request table

```sql
CREATE TABLE custom_embroidery_requests (
    id UUID PRIMARY KEY,
    request_number VARCHAR(40) UNIQUE NOT NULL,

    customer_name VARCHAR(150) NOT NULL,
    preferred_contact_method VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),

    idea_description TEXT NOT NULL,
    exact_text TEXT,

    ai_mode VARCHAR(40) NOT NULL,
    ai_used BOOLEAN NOT NULL DEFAULT FALSE,

    item_provider VARCHAR(30) NOT NULL,
    item_type VARCHAR(80),
    custom_item_description TEXT,

    garment_color VARCHAR(80),
    placement VARCHAR(80) NOT NULL,
    custom_placement_description TEXT,

    requested_width_inches NUMERIC(6,2),
    requested_height_inches NUMERIC(6,2),
    size_recommendation_requested BOOLEAN NOT NULL DEFAULT FALSE,

    recommended_width_inches NUMERIC(6,2),
    recommended_height_inches NUMERIC(6,2),

    quantity INTEGER NOT NULL,

    estimated_stitches_min INTEGER,
    estimated_stitches_max INTEGER,
    estimated_thread_colors_min INTEGER,
    estimated_thread_colors_max INTEGER,
    complexity VARCHAR(30),

    estimated_embroidery_price_min_cents BIGINT,
    estimated_embroidery_price_max_cents BIGINT,

    estimated_item_price_cents BIGINT,
    estimated_total_price_min_cents BIGINT,
    estimated_total_price_max_cents BIGINT,

    estimate_excludes_item_cost BOOLEAN NOT NULL DEFAULT FALSE,
    currency VARCHAR(10) NOT NULL DEFAULT 'CAD',

    customer_acknowledged_estimate BOOLEAN NOT NULL DEFAULT FALSE,
    customer_confirmed_content_rights BOOLEAN NOT NULL DEFAULT FALSE,

    status VARCHAR(40) NOT NULL DEFAULT 'SUBMITTED',

    ai_provider VARCHAR(80),
    ai_model VARCHAR(150),
    generation_count INTEGER NOT NULL DEFAULT 0,

    internal_notes TEXT,
    final_price_cents BIGINT,
    final_stitch_count INTEGER,

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);
```

### Request images table

```sql
CREATE TABLE custom_embroidery_request_images (
    id UUID PRIMARY KEY,
    request_id UUID NOT NULL
        REFERENCES custom_embroidery_requests(id),

    image_type VARCHAR(40) NOT NULL,
    original_filename VARCHAR(255),
    storage_public_id VARCHAR(500) NOT NULL,
    storage_url VARCHAR(1000),

    customer_image_intent VARCHAR(40),
    display_order INTEGER NOT NULL DEFAULT 0,
    selected BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL
);
```

Image types:

```text
UPLOADED_REFERENCE
UPLOADED_EXACT_ARTWORK
AI_GENERATED_CONCEPT
COMPOSITED_FINAL_CONCEPT
PRODUCT_PLACEMENT_PREVIEW
```

---

## 21. Request Statuses

Recommended MVP statuses:

```text
DRAFT
GENERATING
GENERATION_FAILED
PREVIEW_READY
SUBMITTED
UNDER_REVIEW
CONTACTED
COMPLETED
```

---

## 22. Backend API Design

### Create generation job

```http
POST /api/custom-embroidery/generations
```

### Check generation status

```http
GET /api/custom-embroidery/generations/{generationId}
```

### Submit request

```http
POST /api/custom-embroidery/requests
```

### Retrieve confirmation

```http
GET /api/custom-embroidery/requests/{requestNumber}
```

---

## 23. Cloudflare Workers AI Integration

Architecture:

```text
React
   ↓
Spring Boot
   ↓
Cloudflare Workers AI
```

Never expose Cloudflare credentials in React.

Backend environment variables:

```env
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_AI_MODEL=...
```

Keep the model configurable.

Provider abstraction:

```java
public interface ImageGenerationProvider {

    GeneratedImage generateConcept(
        ImageGenerationRequest request
    );

    GeneratedImage editConcept(
        ImageEditRequest request
    );
}
```

Possible future implementations:

```text
CloudflareWorkersAiProvider
OpenAiImageProvider
BlackForestLabsProvider
LocalFluxProvider
```

---

## 24. Asynchronous Generation Flow

```text
1. Frontend submits generation request.
2. Spring Boot validates the request.
3. Spring Boot creates a QUEUED job.
4. Worker calls Cloudflare Workers AI.
5. Generated image is validated.
6. Exact text is added when needed.
7. Placement preview is created.
8. Image-analysis features are calculated.
9. Stitch-count range is estimated.
10. Price range is calculated.
11. Images are uploaded to permanent storage.
12. Database status becomes PREVIEW_READY.
13. Frontend polls and displays the result.
```

---

## 25. Image Storage

Do not store image bytes directly in PostgreSQL.

Use Cloudinary or another object-storage service.

Store in PostgreSQL:

- public ID;
- secure URL;
- image type;
- dimensions;
- selected status;
- request ID.

Suggested folders:

```text
custom-embroidery/{request-number}/uploads/
custom-embroidery/{request-number}/generated/
custom-embroidery/{request-number}/mockups/
```

---

## 26. Emails

### Company notification

Subject:

```text
New Custom Embroidery Request — TNB-EMB-2026-0048
```

Include:

- customer name;
- preferred contact method;
- email or phone;
- idea description;
- exact text;
- AI selection;
- item provider;
- item;
- placement;
- size;
- quantity;
- stitch estimate;
- thread-colour estimate;
- price estimate;
- uploaded image links;
- generated concept link;
- mockup link;
- admin link.

### Customer confirmation

When email is selected:

```text
Thank you for submitting your custom embroidery request.

Request number:
TNB-EMB-2026-0048

Your design and price are preliminary estimates.
Thread & Butter will review your request and contact you to
confirm the final design, item details, and final price.
```

When phone is selected:

- save the phone number;
- show the request number on screen;
- notify the business;
- contact the customer manually.

---

## 27. Validation Rules

Always require:

- full name;
- idea description or at least one uploaded image;
- AI mode;
- item provider;
- item type or custom item description;
- placement;
- quantity;
- preferred contact method;
- matching email or phone;
- estimate acknowledgement;
- content-rights confirmation.

Conditional rules:

```text
Customer provides item
→ item description required

Thread & Butter provides Other
→ item description required

Placement is Other
→ placement description required

Email selected
→ valid email required

Phone selected
→ valid phone required

Known size selected
→ width or height required

AI inspiration mode selected
→ at least one uploaded image required
```

---

## 28. Abuse and Cost Controls

For the MVP:

- validate MIME type and extension;
- limit upload size;
- limit AI generations per request;
- rate limit by IP;
- rate limit by contact value;
- log generation failures;
- store provider and model name;
- set usage alerts;
- keep AI credentials server-side.

Suggested initial limits:

```text
3 AI generations per request
10 AI generations per IP per day
```

---

## 29. Customer-Facing Estimate Notice

> Your generated design, recommended size, estimated stitch count, estimated thread colours, and estimated price are preliminary. Embroidery may require artwork simplification, digitizing changes, or adjustments based on the selected item and material. Thread & Butter will contact you to confirm the final design and price before production. Tax, delivery, shipping, and rush services are not included in this estimate.

---

## 30. MVP Scope

### Include now

- idea text area;
- exact-text field;
- optional uploads;
- optional AI generation;
- AI image editing; (not now)
- item-provider selection;
- customer-supplied item description;
- Thread & Butter product choices;
- Other item text box;
- placement options;
- approximate size or recommendation;
- quantity;
- generated concept;
- basic placement mockup;
- stitch-count range;
- thread-colour range;
- simple price range;
- email or phone toggle;
- agreement checkboxes;
- database persistence;
- image storage;
- business notification;
- customer confirmation;
- admin review.

### Do not include yet

- checkout;
- payment;
- tax calculation;
- delivery calculation;
- shipping calculation;
- rush fees;
- exact production dates;
- exact stitch counts;
- automatic embroidery-file generation;
- automatic final approval;
- complex discounts;
- customer accounts;
- advanced browser editor;
- 3D garment rendering.

---

## 31. Recommended Page Copy

### Header

# Custom Embroidery Studio

> Tell us what you would like embroidered. Upload your artwork or let AI help create a concept, choose your item and placement, and receive a preliminary size and price estimate.

### AI notice

> AI is optional. You can upload your own design, ask us to create an AI concept, or submit the request without generating an image.

### Submit button

> Submit My Embroidery Request

### Confirmation

> Your request has been received. Thread & Butter will review your design and contact you to confirm the final details and price.

---

## 32. Final Product Principle

> **Describe it, upload it, or let AI help visualize it. We will provide a preliminary embroidery concept and estimate, then personally work with you to finalize the design and price.**
