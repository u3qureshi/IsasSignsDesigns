export type PolicySection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type BusinessPolicy = {
  slug: string;
  eyebrow: string;
  title: string;
  introduction: string;
  sections: PolicySection[];
};

export const BUSINESS_POLICIES: Record<string, BusinessPolicy> = {
  shipping: {
    slug: "shipping-pickup",
    eyebrow: "Delivery information",
    title: "Shipping & Pickup Policy",
    introduction: "How Thread & Butter prepares, ships, and coordinates pickup for ready-to-order and custom pieces.",
    sections: [
      {
        heading: "Order preparation",
        paragraphs: [
          "Every order is prepared with care in Canada. Preparation time depends on garment availability, order size, customization, artwork approval, and current studio workload. Any estimate we provide is an estimate rather than a guaranteed delivery date unless we confirm otherwise in writing.",
          "If you need an item for a particular event, tell us before ordering or include the date in your custom request so we can confirm whether the timeline is realistic.",
        ],
      },
      {
        heading: "Shipping",
        bullets: [
          "Available shipping options and charges are shown during checkout.",
          "Standard shipping is free when the merchandise subtotal reaches $100 CAD before tax; otherwise the checkout currently applies a $15 CAD standard-shipping charge.",
          "A shipping estimate begins after production or order preparation is complete, not on the date the order is placed.",
          "Customers are responsible for entering a complete and accurate delivery address.",
        ],
      },
      {
        heading: "Local pickup",
        paragraphs: [
          "Pickup may be available by prior arrangement. We will provide the pickup location and a ready-for-pickup confirmation directly to the customer. Please do not travel to collect an order until that confirmation has been sent.",
        ],
      },
      {
        heading: "Delays, damage, or missing parcels",
        paragraphs: [
          "Carrier delays are outside our direct control, but we will help review tracking and delivery concerns. Contact us promptly with your order number and photographs if an item or its packaging arrives damaged.",
        ],
      },
    ],
  },
  returns: {
    slug: "returns-refunds",
    eyebrow: "Order support",
    title: "Returns, Refunds & Cancellations",
    introduction: "We want every order to arrive as approved and described. These guidelines explain how we handle changes and concerns.",
    sections: [
      {
        heading: "Custom and personalized products",
        paragraphs: [
          "Because custom and personalized items are made specifically for one customer, they are final sale once artwork or production has been approved and work has begun. This does not limit support for an item that arrives damaged, defective, or materially different from the approved order.",
        ],
      },
      {
        heading: "Ready-to-order and blank apparel",
        paragraphs: [
          "Unused, unworn, and unwashed non-personalized items in their original condition may be eligible for return when you contact us within 14 days of delivery. Contact us before sending anything back so eligibility and return instructions can be confirmed. Original and return shipping charges are not refundable unless the item was incorrect or defective.",
        ],
      },
      {
        heading: "Cancellations and changes",
        bullets: [
          "Contact us as soon as possible if you need to change or cancel an order.",
          "A cancellation may be available before materials are ordered or production begins.",
          "Once custom production starts, cancellation or design changes may not be possible.",
          "Approved refunds are returned to the original payment method; processing time depends on the payment provider and financial institution.",
        ],
      },
      {
        heading: "Problems with an order",
        paragraphs: [
          "Email chrastinovakajaa@outlook.com with the order number, a description of the concern, and clear photographs where relevant. We will review the details and propose an appropriate repair, replacement, or refund when applicable.",
        ],
      },
    ],
  },
  custom: {
    slug: "custom-order-policy",
    eyebrow: "Made for you",
    title: "Custom-Order Policy",
    introduction: "Clear approvals help us turn an idea into embroidery or print work that feels intentional and accurate.",
    sections: [
      {
        heading: "Quotes and approvals",
        bullets: [
          "A website preview or request submission is not a final production guarantee or final quote.",
          "Pricing can depend on garment choice, quantity, artwork preparation, decoration size, stitch or print complexity, and placement.",
          "Production begins only after the required details, price, and artwork direction have been confirmed.",
          "The customer is responsible for checking names, spelling, dates, sizes, colours, and placement before approval.",
        ],
      },
      {
        heading: "Artwork and intellectual property",
        paragraphs: [
          "By submitting artwork, logos, text, or reference material, the customer confirms that they own it or have permission to use it for the requested purpose. We may decline content that appears unlawful, hateful, misleading, unsafe, or likely to infringe another party's rights.",
        ],
      },
      {
        heading: "Colour and production variation",
        paragraphs: [
          "Screens, garment dye lots, fabric texture, thread, ink, lighting, and production methods can create modest differences from a digital preview. Placement and measurements may also vary slightly because garments are flexible physical products.",
        ],
      },
      {
        heading: "Customer-supplied garments",
        paragraphs: [
          "We will confirm whether a customer-supplied item is suitable before accepting it. Decoration always carries some production risk; any special responsibility or replacement arrangement for supplied garments must be agreed to in writing before work begins.",
        ],
      },
    ],
  },
  privacy: {
    slug: "privacy",
    eyebrow: "Your information",
    title: "Privacy Policy",
    introduction: "This policy describes the information Thread & Butter uses to operate the storefront, respond to customers, and complete orders.",
    sections: [
      {
        heading: "Information we collect",
        bullets: [
          "Contact and account information such as name, email address, phone number, and communication preferences.",
          "Order, delivery, product-selection, and custom-request information.",
          "Artwork, images, messages, and instructions that you choose to submit.",
          "Technical and security information required to maintain sessions, prevent misuse, and diagnose service problems.",
        ],
      },
      {
        heading: "How information is used",
        paragraphs: [
          "We use information to authenticate accounts, answer messages, provide estimates, prepare orders, process checkout, send service communications, prevent fraud, keep business records, and improve the website. We do not sell customer personal information.",
        ],
      },
      {
        heading: "Service providers",
        paragraphs: [
          "We share only the information needed for services that support the business, including payment processing through Stripe, media storage and delivery through Cloudinary, email delivery, hosting, and shipping. Payment-card details are entered through Stripe and are not stored by Thread & Butter.",
        ],
      },
      {
        heading: "Cookies and retention",
        paragraphs: [
          "The site uses essential cookies for secure authentication and storefront operation. We retain order and request records for legitimate business, customer-service, accounting, security, and legal purposes, and remove or anonymize information when it is no longer reasonably needed.",
        ],
      },
      {
        heading: "Your choices",
        paragraphs: [
          "You may ask to review or correct your account information or contact us with a privacy concern. Some information may need to be retained where required for completed transactions, fraud prevention, or legal obligations.",
        ],
      },
    ],
  },
  terms: {
    slug: "terms",
    eyebrow: "Store conditions",
    title: "Terms of Service",
    introduction: "These terms apply when you browse Thread & Butter, submit a request, create an account, or place an order.",
    sections: [
      {
        heading: "Store use and accounts",
        paragraphs: [
          "Provide accurate information and use the site only for lawful purposes. You are responsible for access to your email account and for activity completed through your authenticated session. We may restrict use that threatens the service, other customers, or the business.",
        ],
      },
      {
        heading: "Products, prices, and availability",
        paragraphs: [
          "Prices are displayed in Canadian dollars unless stated otherwise. Product availability, colours, sizes, and descriptions may change. If an item becomes unavailable or a material listing error affects an order, we will contact the customer and may cancel and refund the affected portion.",
        ],
      },
      {
        heading: "Orders and payment",
        paragraphs: [
          "Submitting checkout authorizes the displayed charges but does not require us to accept an unlawful, fraudulent, impossible, or materially mispriced order. Payment is processed by Stripe. Applicable shipping and taxes are shown during checkout where configured.",
        ],
      },
      {
        heading: "Custom work",
        paragraphs: [
          "Custom requests are also governed by the Custom-Order Policy. Digital previews are planning aids and do not replace final production review, price confirmation, or artwork approval.",
        ],
      },
      {
        heading: "Liability and governing law",
        paragraphs: [
          "To the extent permitted by law, Thread & Butter is not responsible for indirect loss or delays outside its reasonable control. Nothing in these terms removes rights that cannot legally be excluded. These terms are governed by the laws of Ontario and the applicable laws of Canada.",
        ],
      },
    ],
  },
  contact: {
    slug: "contact",
    eyebrow: "Business information",
    title: "Contact Thread & Butter",
    introduction: "Questions about an order, a product, a custom idea, or these policies are always welcome.",
    sections: [
      {
        heading: "Contact details",
        bullets: [
          "Email: chrastinovakajaa@outlook.com",
          "Phone: +1 (647) 700-5182",
          "WhatsApp: +1 (647) 700-5182",
          "Business: Thread & Butter, Canada",
        ],
      },
      {
        heading: "What to include",
        paragraphs: [
          "For order support, include the order or request number and the email address used. For custom work, describe the item, quantity, preferred decoration method, deadline, and any artwork you already have.",
        ],
      },
    ],
  },
};
