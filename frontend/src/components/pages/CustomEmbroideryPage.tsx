import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  Hash,
  ImagePlus,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  Shirt,
  Sparkles,
  Upload,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

type ContactMethod = "email" | "phone";
type AiMode = "generate" | "exact-upload" | "inspiration" | "manual-review";
type ImageIntent = "exact" | "inspiration" | "placement";
type ItemProvider = "customer" | "thread-n-butter";
type SizeMode = "known" | "recommend";

interface CustomEmbroideryForm {
  fullName: string;
  preferredContact: ContactMethod;
  email: string;
  phone: string;
  ideaDescription: string;
  exactText: string;
  aiMode: AiMode | "";
  imageIntent: ImageIntent;
  uploadedImage: File | null;
  itemProvider: ItemProvider | "";
  suppliedItem: string;
  otherItem: string;
  garmentColor: string;
  placement: string;
  otherPlacement: string;
  sizeMode: SizeMode;
  width: string;
  height: string;
  quantity: number;
  estimateAccepted: boolean;
  contentRightsConfirmed: boolean;
}

interface StepDefinition {
  shortLabel: string;
  title: string;
  eyebrow: string;
  description: string;
  Icon: LucideIcon;
}

const STEPS: StepDefinition[] = [
  {
    shortLabel: "Customer",
    title: "Let's start with you",
    eyebrow: "Customer information",
    description: "Tell us who you are and how Thread & Butter should follow up about your request.",
    Icon: UserRound,
  },
  {
    shortLabel: "Idea",
    title: "Tell us your embroidery idea",
    eyebrow: "Your concept",
    description: "Describe the design, wording, colours, style, and any details that matter to you.",
    Icon: Lightbulb,
  },
  {
    shortLabel: "Artwork",
    title: "Add your artwork",
    eyebrow: "Upload or AI concept",
    description: "Upload one reference image or choose one future AI-generated concept. AI editing is not included.",
    Icon: ImagePlus,
  },
  {
    shortLabel: "Item",
    title: "Choose the item",
    eyebrow: "What are we embroidering?",
    description: "Tell us whether you are supplying the item or would like Thread & Butter to source it.",
    Icon: Shirt,
  },
  {
    shortLabel: "Placement",
    title: "Choose placement and size",
    eyebrow: "Design position",
    description: "Select where the embroidery should sit and give us an approximate size if you know it.",
    Icon: MapPin,
  },
  {
    shortLabel: "Quantity",
    title: "How many do you need?",
    eyebrow: "Request quantity",
    description: "Enter an approximate quantity. Bulk pricing will always be confirmed after review.",
    Icon: Hash,
  },
  {
    shortLabel: "Preview",
    title: "Preview your request",
    eyebrow: "Preliminary concept",
    description: "Review the information that will later be used to create a concept and estimate.",
    Icon: Sparkles,
  },
  {
    shortLabel: "Submit",
    title: "Review and submit",
    eyebrow: "Final request summary",
    description: "Confirm the details and required notices before sending your request.",
    Icon: ClipboardCheck,
  },
];

const AI_OPTIONS: Array<{ value: AiMode; title: string; description: string }> = [
  {
    value: "generate",
    title: "Create one AI concept from my description",
    description: "One preliminary image will be generated later. No AI editing or regeneration in this first version.",
  },
  {
    value: "exact-upload",
    title: "Use my uploaded artwork without AI changes",
    description: "Keep the uploaded design or logo intact and review it for embroidery suitability.",
  },
  {
    value: "inspiration",
    title: "Use my upload as inspiration for one AI concept",
    description: "Create one new concept inspired by the reference after the backend is connected.",
  },
  {
    value: "manual-review",
    title: "No generated image — review my request manually",
    description: "Submit the idea and optional upload directly to Thread & Butter for follow-up.",
  },
];

const SUPPLIED_ITEMS = [
  "Hoodie",
  "Crewneck",
  "Pants",
  "Sweatpants",
  "Jeans",
  "Tote bag",
  "Towel",
  "T-shirt",
  "Beanie",
  "Hat",
  "Other",
];

const PLACEMENTS_BY_ITEM: Record<string, string[]> = {
  Hoodie: ["Left chest", "Right chest", "Centre chest", "Full front", "Upper back", "Full back", "Left sleeve", "Right sleeve", "Pocket", "Other"],
  Crewneck: ["Left chest", "Right chest", "Centre chest", "Full front", "Upper back", "Full back", "Left sleeve", "Right sleeve", "Other"],
  "T-shirt": ["Left chest", "Right chest", "Centre chest", "Full front", "Upper back", "Full back", "Left sleeve", "Right sleeve", "Other"],
  Pants: ["Left thigh", "Right thigh", "Left pant leg", "Right pant leg", "Back pocket", "Other"],
  Sweatpants: ["Left thigh", "Right thigh", "Left pant leg", "Right pant leg", "Back pocket", "Other"],
  Jeans: ["Left thigh", "Right thigh", "Left pant leg", "Right pant leg", "Back pocket", "Other"],
  "Tote bag": ["Centre front", "Upper front", "Lower left corner", "Lower right corner", "Other"],
  Towel: ["Corner", "Centre", "Border", "Other"],
  Beanie: ["Front", "Left side", "Right side", "Other"],
  Hat: ["Front", "Left side", "Right side", "Back", "Other"],
  Other: ["Front", "Back", "Left side", "Right side", "Other"],
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_FORM: CustomEmbroideryForm = {
  fullName: "",
  preferredContact: "email",
  email: "",
  phone: "",
  ideaDescription: "",
  exactText: "",
  aiMode: "",
  imageIntent: "exact",
  uploadedImage: null,
  itemProvider: "",
  suppliedItem: "",
  otherItem: "",
  garmentColor: "",
  placement: "",
  otherPlacement: "",
  sizeMode: "recommend",
  width: "",
  height: "",
  quantity: 1,
  estimateAccepted: false,
  contentRightsConfirmed: false,
};

function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  title,
  description,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  description?: string;
}) {
  return (
    <label
      className={`flex cursor-pointer gap-2 rounded-2xl border p-3 transition ${
        checked
          ? "border-[hsl(var(--theme-brown-700))] bg-[hsl(var(--theme-sand-300)/0.2)] shadow-sm"
          : "border-stone-200 bg-white hover:border-[hsl(var(--theme-sand-300))]"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 accent-[hsl(var(--theme-brown-700))]"
      />
      <span>
        <span className="block text-sm font-bold text-[hsl(var(--theme-brown-900))]">{title}</span>
        {description && <span className="mt-1 block text-sm leading-relaxed text-stone-500">{description}</span>}
      </span>
    </label>
  );
}

function FieldLabel({ children, optional = false }: { children: ReactNode; optional?: boolean }) {
  return (
    <span className="mb-2 block text-sm font-bold text-[hsl(var(--theme-brown-900))]">
      {children}
      {optional && (
        <span className="ml-1 font-semibold text-[hsl(var(--theme-brown-700))]">(optional)</span>
      )}
    </span>
  );
}

function SummaryRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-stone-100 py-2 last:border-0 sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="text-xs font-bold uppercase tracking-[0.12em] text-stone-400">{label}</dt>
      <dd className="text-sm leading-relaxed text-[hsl(var(--theme-brown-900))]">{value || "Not provided"}</dd>
    </div>
  );
}

export default function CustomEmbroideryPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<CustomEmbroideryForm>(INITIAL_FORM);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [stepErrors, setStepErrors] = useState<string[]>([]);
  const [prototypeSubmitted, setPrototypeSubmitted] = useState(false);
  const tabsRef = useRef<HTMLElement>(null);
  const scrollAfterStepChangeRef = useRef(false);

  const step = STEPS[currentStep];
  const StepIcon = step.Icon;

  useEffect(() => {
    if (!form.uploadedImage) {
      setImagePreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(form.uploadedImage);
    setImagePreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [form.uploadedImage]);

  useEffect(() => {
    if (!scrollAfterStepChangeRef.current) return;

    scrollAfterStepChangeRef.current = false;
    const frame = window.requestAnimationFrame(() => {
      tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [currentStep]);

  function updateField<K extends keyof CustomEmbroideryForm>(
    field: K,
    value: CustomEmbroideryForm[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setStepErrors([]);
  }

  function goToStep(index: number) {
    scrollAfterStepChangeRef.current = true;
    setCurrentStep(Math.min(Math.max(index, 0), STEPS.length - 1));
    setStepErrors([]);
  }

  function handleImage(file: File | null) {
    setUploadError("");

    if (!file) {
      updateField("uploadedImage", null);
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please choose a PNG, JPG, WEBP, or SVG image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("The image must be 10 MB or smaller.");
      return;
    }

    updateField("uploadedImage", file);
  }

  const contactValue = form.preferredContact === "email" ? form.email : form.phone;
  const selectedItem = form.suppliedItem === "Other" ? form.otherItem : form.suppliedItem;
  const selectedPlacement = form.placement === "Other" ? form.otherPlacement : form.placement;
  const requestedSize =
    form.sizeMode === "recommend"
      ? "Recommend a suitable size"
      : `${form.width || "—"} in wide × ${form.height || "—"} in high`;
  const selectedAiLabel = AI_OPTIONS.find((option) => option.value === form.aiMode)?.title;
  const availablePlacements = PLACEMENTS_BY_ITEM[form.suppliedItem] ?? [];
  const uploadIsOptional = form.aiMode === "generate" || form.aiMode === "manual-review";

  function getStepErrors(stepIndex: number) {
    const errors: string[] = [];

    if (stepIndex === 0) {
      if (!form.fullName.trim()) errors.push("Enter your full name.");
      if (form.preferredContact === "email") {
        if (!form.email.trim()) errors.push("Enter your email address.");
        else if (!EMAIL_PATTERN.test(form.email.trim())) errors.push("Enter a valid email address.");
      } else {
        if (!form.phone) errors.push("Enter your phone number.");
        else if (form.phone.length < 10 || form.phone.length > 15) {
          errors.push("Enter a phone number containing 10 to 15 digits.");
        }
      }
    }

    if (stepIndex === 1 && !form.ideaDescription.trim()) {
      errors.push("Describe what you would like embroidered.");
    }

    if (stepIndex === 2) {
      if (!form.aiMode) errors.push("Choose how Thread & Butter should handle the artwork.");
      if (
        (form.aiMode === "exact-upload" || form.aiMode === "inspiration") &&
        !form.uploadedImage
      ) {
        errors.push("Upload an image for the artwork option you selected.");
      }
    }

    if (stepIndex === 3) {
      if (!form.itemProvider) errors.push("Choose who will provide the item.");
      if (form.itemProvider && !form.suppliedItem) errors.push("Select the item type.");
      if (form.suppliedItem === "Other" && !form.otherItem.trim()) {
        errors.push("Describe the item that will be embroidered.");
      }
    }

    if (stepIndex === 4) {
      if (!form.placement) errors.push("Choose an embroidery placement.");
      if (form.placement === "Other" && !form.otherPlacement.trim()) {
        errors.push("Describe the embroidery placement.");
      }
      if (form.sizeMode === "known") {
        if (!form.width || Number(form.width) <= 0) errors.push("Enter the embroidery width.");
        if (!form.height || Number(form.height) <= 0) errors.push("Enter the embroidery height.");
      }
    }

    if (stepIndex === 5 && form.quantity < 1) errors.push("Enter a quantity of at least one.");

    if (stepIndex === 7) {
      if (!form.estimateAccepted) errors.push("Accept the estimate acknowledgement.");
      if (!form.contentRightsConfirmed) errors.push("Confirm that you have rights to the submitted content.");
    }

    return errors;
  }

  const missingItems = STEPS.flatMap((_, index) => getStepErrors(index));

  function goNext() {
    const errors = getStepErrors(currentStep);
    if (errors.length > 0) {
      setStepErrors(errors);
      return;
    }
    goToStep(currentStep + 1);
  }

  function selectItemType(item: string) {
    const nextPlacements = PLACEMENTS_BY_ITEM[item] ?? [];
    setForm((current) => ({
      ...current,
      suppliedItem: item,
      otherItem: item === "Other" ? current.otherItem : "",
      placement: nextPlacements.includes(current.placement) ? current.placement : "",
      otherPlacement: nextPlacements.includes(current.placement) ? current.otherPlacement : "",
    }));
    setStepErrors([]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (currentStep < STEPS.length - 1) {
      goNext();
      return;
    }
    if (missingItems.length > 0) {
      setStepErrors(missingItems);
      return;
    }
    setPrototypeSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderStepContent() {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <label className="block">
              <FieldLabel>Full name</FieldLabel>
              <input
                type="text"
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
              />
            </label>

            <fieldset>
              <FieldLabel>How should we contact you?</FieldLabel>
              <div className="grid gap-2 sm:grid-cols-2">
                <ChoiceCard
                  name="preferred-contact"
                  value="email"
                  checked={form.preferredContact === "email"}
                  onChange={() => updateField("preferredContact", "email")}
                  title="Email"
                  description="We will reply to the email address below."
                />
                <ChoiceCard
                  name="preferred-contact"
                  value="phone"
                  checked={form.preferredContact === "phone"}
                  onChange={() => updateField("preferredContact", "phone")}
                  title="Phone"
                  description="We will call or text the number below."
                />
              </div>
            </fieldset>

            {form.preferredContact === "email" ? (
              <label className="block">
                <FieldLabel>Email address</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    inputMode="email"
                    className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
                  />
                </div>
              </label>
            ) : (
              <label className="block">
                <FieldLabel>Phone number</FieldLabel>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, "").slice(0, 15))}
                    placeholder="14165550123"
                    autoComplete="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10,15}"
                    maxLength={15}
                    className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
                  />
                </div>
              </label>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <label className="block">
              <FieldLabel>Describe what you would like embroidered</FieldLabel>
              <textarea
                rows={5}
                value={form.ideaDescription}
                onChange={(event) => updateField("ideaDescription", event.target.value)}
                placeholder="Example: A simple outline of a fisherman holding a bass with “Best Dad” underneath. I want it on the left chest of a black hoodie."
                className="w-full resize-y rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
              />
              <span className="mt-2 block text-xs text-stone-400">
                Include the subject, style, wording, colours, detail level, and special instructions.
              </span>
            </label>

            <label className="block">
              <FieldLabel optional>Exact text to include</FieldLabel>
              <input
                type="text"
                value={form.exactText}
                onChange={(event) => updateField("exactText", event.target.value)}
                placeholder="Example: Best Dad"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
              />
              <span className="mt-2 block text-xs text-stone-400">
                Exact wording will be handled separately to reduce spelling mistakes in generated concepts.
              </span>
            </label>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div className="rounded-2xl border border-[hsl(var(--theme-sand-300))] bg-[hsl(var(--theme-sand-300)/0.15)] p-3 text-sm leading-relaxed text-[hsl(var(--theme-brown-700))]">
              AI is optional. This first version allows a maximum of <strong>one AI concept image</strong> per
              user account daily.
            </div>

            <fieldset>
              <FieldLabel>How would you like us to handle the artwork?</FieldLabel>
              <div className="grid gap-2">
                {AI_OPTIONS.map((option) => (
                  <ChoiceCard
                    key={option.value}
                    name="ai-mode"
                    value={option.value}
                    checked={form.aiMode === option.value}
                    onChange={() => updateField("aiMode", option.value)}
                    title={option.title}
                    description={option.description}
                  />
                ))}
              </div>
            </fieldset>

            <div>
              <FieldLabel optional={uploadIsOptional}>Upload one image</FieldLabel>
              {form.aiMode && !uploadIsOptional && (
                <p className="mb-3 text-sm text-[hsl(var(--theme-brown-700))]">
                  An image is required for this artwork option.
                </p>
              )}
              {form.uploadedImage && imagePreviewUrl ? (
                <div className="grid gap-3 rounded-xl border border-stone-200 bg-white p-3 sm:grid-cols-[4rem_1fr_auto] sm:items-center">
                  <img
                    src={imagePreviewUrl}
                    alt="Uploaded embroidery reference preview"
                    className="h-14 w-14 rounded-lg bg-stone-100 object-contain"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[hsl(var(--theme-brown-900))]">
                      {form.uploadedImage.name}
                    </p>
                    <p className="mt-1 text-xs text-stone-400">
                      {(form.uploadedImage.size / 1024 / 1024).toFixed(2)} MB · one upload maximum
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleImage(null)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-600 transition hover:border-red-200 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-stone-200 bg-white px-4 py-3 transition hover:border-[hsl(var(--theme-brown-500))] hover:bg-[hsl(var(--theme-sand-300)/0.08)]">
                  <Upload className="h-5 w-5 shrink-0 text-[hsl(var(--theme-brown-500))]" />
                  <span>
                    <span className="block text-sm font-bold text-[hsl(var(--theme-brown-900))]">
                      Choose an image
                    </span>
                    <span className="block text-xs text-stone-400">
                      PNG, JPG, WEBP, or SVG · maximum 10 MB
                    </span>
                  </span>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(event) => handleImage(event.target.files?.[0] ?? null)}
                    className="sr-only"
                  />
                </label>
              )}
              {uploadError && <p className="mt-2 text-sm font-semibold text-red-600">{uploadError}</p>}
            </div>

            {form.uploadedImage && (
              <fieldset>
                <FieldLabel>How should this image be used?</FieldLabel>
                <div className="grid gap-2 sm:grid-cols-3">
                  <ChoiceCard
                    name="image-intent"
                    value="exact"
                    checked={form.imageIntent === "exact"}
                    onChange={() => updateField("imageIntent", "exact")}
                    title="Exact artwork"
                  />
                  <ChoiceCard
                    name="image-intent"
                    value="inspiration"
                    checked={form.imageIntent === "inspiration"}
                    onChange={() => updateField("imageIntent", "inspiration")}
                    title="Inspiration"
                  />
                  <ChoiceCard
                    name="image-intent"
                    value="placement"
                    checked={form.imageIntent === "placement"}
                    onChange={() => updateField("imageIntent", "placement")}
                    title="Placement reference"
                  />
                </div>
              </fieldset>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <fieldset>
              <FieldLabel>Who will provide the item?</FieldLabel>
              <div className="grid gap-2 sm:grid-cols-2">
                <ChoiceCard
                  name="item-provider"
                  value="customer"
                  checked={form.itemProvider === "customer"}
                  onChange={() => updateField("itemProvider", "customer")}
                  title="I will provide the item"
                  description="The estimate will cover embroidery only."
                />
                <ChoiceCard
                  name="item-provider"
                  value="thread-n-butter"
                  checked={form.itemProvider === "thread-n-butter"}
                  onChange={() => updateField("itemProvider", "thread-n-butter")}
                  title="Thread & Butter will provide it"
                  description="Item availability and final item cost will be confirmed."
                />
              </div>
            </fieldset>

            {form.itemProvider && (
              <fieldset>
                <FieldLabel>Select an item</FieldLabel>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {SUPPLIED_ITEMS.map((item) => (
                    <ChoiceCard
                      key={item}
                      name="supplied-item"
                      value={item}
                      checked={form.suppliedItem === item}
                      onChange={() => selectItemType(item)}
                      title={item}
                    />
                  ))}
                </div>
              </fieldset>
            )}

            {form.itemProvider && form.suppliedItem === "Other" && (
              <label className="block">
                <FieldLabel>What item will be embroidered?</FieldLabel>
                <input
                  type="text"
                  value={form.otherItem}
                  onChange={(event) => updateField("otherItem", event.target.value)}
                  placeholder="Example: denim jacket, baby blanket, work apron"
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
                />
                {form.itemProvider === "customer" && (
                  <span className="mt-2 block text-xs leading-relaxed text-stone-400">
                    Final approval depends on the material, thickness, seams, construction, and whether it can safely be embroidered.
                  </span>
                )}
              </label>
            )}

            <label className="block">
              <FieldLabel optional>Item colour</FieldLabel>
              <input
                type="text"
                value={form.garmentColor}
                onChange={(event) => updateField("garmentColor", event.target.value)}
                placeholder="Example: black, cream, forest green"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
              />
            </label>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <fieldset>
              <FieldLabel>Where should the embroidery go?</FieldLabel>
              <p className="mb-4 text-sm text-[hsl(var(--theme-brown-700))]">
                Showing suitable placements for: <strong>{form.suppliedItem || "no item selected"}</strong>
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {availablePlacements.map((placement) => (
                  <ChoiceCard
                    key={placement}
                    name="placement"
                    value={placement}
                    checked={form.placement === placement}
                    onChange={() => updateField("placement", placement)}
                    title={placement}
                  />
                ))}
              </div>
            </fieldset>

            {form.placement === "Other" && (
              <label className="block">
                <FieldLabel>Describe the placement</FieldLabel>
                <input
                  type="text"
                  value={form.otherPlacement}
                  onChange={(event) => updateField("otherPlacement", event.target.value)}
                  placeholder="Describe where you would like the design"
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
                />
              </label>
            )}

            <fieldset>
              <FieldLabel>Approximate size</FieldLabel>
              <div className="grid gap-2 sm:grid-cols-2">
                <ChoiceCard
                  name="size-mode"
                  value="recommend"
                  checked={form.sizeMode === "recommend"}
                  onChange={() => updateField("sizeMode", "recommend")}
                  title="Recommend a suitable size"
                  description="Thread & Butter will recommend proportions after reviewing the design and item."
                />
                <ChoiceCard
                  name="size-mode"
                  value="known"
                  checked={form.sizeMode === "known"}
                  onChange={() => updateField("sizeMode", "known")}
                  title="I know the approximate size"
                  description="Both width and height are required in inches."
                />
              </div>
            </fieldset>

            {form.sizeMode === "known" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <FieldLabel>Width in inches</FieldLabel>
                  <input
                    type="number"
                    min="0.5"
                    step="0.1"
                    value={form.width}
                    onChange={(event) => updateField("width", event.target.value)}
                    placeholder="4.0"
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
                  />
                </label>
                <label>
                  <FieldLabel>Height in inches</FieldLabel>
                  <input
                    type="number"
                    min="0.5"
                    step="0.1"
                    value={form.height}
                    onChange={(event) => updateField("height", event.target.value)}
                    placeholder="3.2"
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
                  />
                </label>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-[hsl(var(--theme-brown-700))]">
              Enter an approximate quantity. Bulk pricing will always be confirmed after review.
            </p>
            <label className="block">
              <FieldLabel>Quantity</FieldLabel>
              <div className="flex max-w-sm items-center gap-3">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => updateField("quantity", Math.max(1, form.quantity - 1))}
                  className="h-12 w-12 rounded-xl border border-stone-200 bg-white text-xl font-bold text-[hsl(var(--theme-brown-900))] transition hover:border-[hsl(var(--theme-brown-500))]"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(event) => updateField("quantity", Math.max(1, Number(event.target.value) || 1))}
                  className="h-12 min-w-0 flex-1 rounded-xl border border-stone-200 bg-white px-4 text-center text-lg font-bold outline-none transition focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
                />
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => updateField("quantity", form.quantity + 1)}
                  className="h-12 w-12 rounded-xl border border-stone-200 bg-white text-xl font-bold text-[hsl(var(--theme-brown-900))] transition hover:border-[hsl(var(--theme-brown-500))]"
                >
                  +
                </button>
              </div>
            </label>

            {form.quantity >= 20 && (
              <p className="rounded-xl bg-[hsl(var(--theme-sand-300)/0.18)] p-4 text-sm text-[hsl(var(--theme-brown-700))]">
                Bulk pricing and production timing will be confirmed after Thread & Butter reviews the request.
              </p>
            )}
          </div>
        );

      case 6:
        return (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 p-4">
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Uploaded artwork preview"
                  className="max-h-72 w-full object-contain"
                />
              ) : (
                <div className="max-w-xs text-center">
                  <Sparkles className="mx-auto h-10 w-10 text-[hsl(var(--theme-brown-500))]" />
                  <p className="mt-4 font-bold text-[hsl(var(--theme-brown-900))]">Concept preview area</p>
                  <p className="mt-2 text-sm leading-relaxed text-stone-400">
                    {form.aiMode === "generate" || form.aiMode === "inspiration"
                      ? "Your single AI concept will appear here after the generation backend is connected."
                      : "Upload an image to preview it here, or continue with a manual-review request."}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-aoki text-xl text-[hsl(var(--theme-brown-900))]">Current request details</h3>
              <dl className="mt-3">
                <SummaryRow label="Customer" value={form.fullName} />
                <SummaryRow label="Idea" value={form.ideaDescription} />
                <SummaryRow label="Artwork choice" value={selectedAiLabel} />
                <SummaryRow label="Item" value={selectedItem} />
                <SummaryRow label="Placement" value={selectedPlacement} />
                <SummaryRow label="Size" value={requestedSize} />
                <SummaryRow label="Quantity" value={form.quantity} />
              </dl>
              <div className="mt-4 rounded-xl border border-dashed border-[hsl(var(--theme-sand-300))] p-3 text-sm leading-relaxed text-stone-500">
                Recommended size, estimated stitches, thread colours, complexity, and price will be calculated
                only after the backend estimator is implemented.
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-5">
            <dl className="rounded-2xl border border-stone-200 bg-stone-50 px-5">
              <SummaryRow label="Customer" value={form.fullName} />
              <SummaryRow
                label="Contact"
                value={`${form.preferredContact === "email" ? "Email" : "Phone"}: ${contactValue || "Not provided"}`}
              />
              <SummaryRow label="Idea" value={form.ideaDescription} />
              <SummaryRow label="Exact text" value={form.exactText} />
              <SummaryRow label="Artwork choice" value={selectedAiLabel} />
              <SummaryRow label="Uploaded image" value={form.uploadedImage?.name} />
              <SummaryRow label="Item provider" value={form.itemProvider || "Not selected"} />
              <SummaryRow label="Item" value={selectedItem} />
              <SummaryRow label="Colour" value={form.garmentColor} />
              <SummaryRow label="Placement" value={selectedPlacement} />
              <SummaryRow label="Size" value={requestedSize} />
              <SummaryRow label="Quantity" value={form.quantity} />
            </dl>

            <div className="space-y-3">
              <label className="flex cursor-pointer gap-2 rounded-xl border border-stone-200 bg-white p-3">
                <input
                  type="checkbox"
                  checked={form.estimateAccepted}
                  onChange={(event) => updateField("estimateAccepted", event.target.checked)}
                  className="mt-1 h-4 w-4 rounded accent-[hsl(var(--theme-brown-700))]"
                />
                <span className="text-sm leading-relaxed text-stone-600">
                  I understand that generated artwork, recommended size, stitch count, thread colours, and
                  pricing will be preliminary estimates. Thread & Butter will confirm the final design, item
                  details, and final price before production.
                </span>
              </label>
              <label className="flex cursor-pointer gap-2 rounded-xl border border-stone-200 bg-white p-3">
                <input
                  type="checkbox"
                  checked={form.contentRightsConfirmed}
                  onChange={(event) => updateField("contentRightsConfirmed", event.target.checked)}
                  className="mt-1 h-4 w-4 rounded accent-[hsl(var(--theme-brown-700))]"
                />
                <span className="text-sm leading-relaxed text-stone-600">
                  I confirm that I own or have permission to use all uploaded images, names, logos, artwork,
                  and other content in this request.
                </span>
              </label>
            </div>

            {missingItems.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <p className="font-bold">Complete these items before testing submit:</p>
                <p className="mt-1">{missingItems.join(", ")}.</p>
              </div>
            )}

            <div className="rounded-xl bg-stone-100 p-4 text-center text-xs leading-relaxed text-stone-500">
              UI prototype only: clicking submit does not save data, send email, upload files, or call an AI service.
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  if (prototypeSubmitted) {
    return (
      <main className="min-h-screen bg-[hsl(var(--theme-kids-bg))] px-5 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[hsl(var(--theme-sand-300))] bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--theme-sage-100)/0.5)]">
            <Check className="h-8 w-8 text-[hsl(var(--theme-green-700))]" />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-500))]">
            UI prototype complete
          </p>
          <h1 className="mt-3 font-aoki text-3xl text-[hsl(var(--theme-brown-900))] sm:text-4xl">
            Your request was not sent yet
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-stone-500">
            This confirms the frontend flow is working. Database storage, image upload, AI generation,
            estimates, notifications, and real submission will be connected in a later backend phase.
          </p>
          <button
            type="button"
            onClick={() => {
              setPrototypeSubmitted(false);
              goToStep(0);
            }}
            className="mt-8 rounded-xl bg-[hsl(var(--theme-brown-700))] px-6 py-3 text-sm font-bold text-white transition hover:bg-[hsl(var(--theme-brown-900))]"
          >
            Return to the form
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[hsl(var(--theme-kids-bg))] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-aoki text-4xl text-[hsl(var(--theme-brown-900))] sm:text-5xl">
            Custom Embroidery Studio
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold text-[hsl(var(--theme-brown-700))] sm:text-base">
            Tell us what you would like embroidered!
          </p>
        </div>

        <nav
          ref={tabsRef}
          aria-label="Custom embroidery form progress"
          className="mt-5 scroll-mt-16 overflow-x-auto"
        >
          <ol className="mx-auto flex min-w-max justify-center gap-2 px-1">
            {STEPS.map((item, index) => {
              const isCurrent = index === currentStep;
              const isComplete = index < currentStep;
              return (
                <li key={item.shortLabel}>
                  <button
                    type="button"
                    onClick={() => goToStep(index)}
                    disabled={index > currentStep}
                    aria-current={isCurrent ? "step" : undefined}
                    className={`flex min-w-24 items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition ${
                      isCurrent
                        ? "border-[hsl(var(--theme-brown-700))] bg-[hsl(var(--theme-brown-700))] text-white"
                        : isComplete
                          ? "border-[hsl(var(--theme-sage-200))] bg-[hsl(var(--theme-sage-100)/0.35)] text-[hsl(var(--theme-green-700))]"
                          : "cursor-not-allowed border-stone-200 bg-white text-stone-400 opacity-70"
                    }`}
                  >
                    {isComplete ? <Check className="h-3.5 w-3.5" /> : <span>{index + 1}</span>}
                    {item.shortLabel}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <form onSubmit={handleSubmit} className="mt-1">
          <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_18px_55px_rgba(76,54,42,0.08)]">
            <header className="border-b border-stone-100 bg-gradient-to-r from-[hsl(var(--theme-sand-300)/0.18)] to-white px-5 py-4 sm:px-7">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--theme-brown-700))] text-white">
                  <StepIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--theme-brown-500))]">
                    Step {currentStep + 1} of {STEPS.length} · {step.eyebrow}
                  </p>
                  <h2 className="mt-1 font-aoki text-2xl text-[hsl(var(--theme-brown-900))] sm:text-3xl">
                    {step.title}
                  </h2>
                </div>
              </div>
            </header>

            <div className="px-5 py-5 sm:px-7 sm:py-6">
              {renderStepContent()}
              {stepErrors.length > 0 && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
                >
                  <p className="font-bold">Please complete this card before continuing:</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {stepErrors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <footer className="flex items-center justify-between gap-3 border-t border-stone-100 bg-stone-50 px-5 py-3 sm:px-7">
              <button
                type="button"
                onClick={() => goToStep(currentStep - 1)}
                disabled={currentStep === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-600 transition hover:border-[hsl(var(--theme-brown-500))] hover:text-[hsl(var(--theme-brown-900))] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <span className="text-sm font-semibold text-[hsl(var(--theme-brown-700))]">
                <span className="hidden sm:inline">{step.shortLabel} · </span>
                {currentStep + 1}/{STEPS.length}
              </span>

              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--theme-brown-700))] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[hsl(var(--theme-brown-900))]"
                >
                  {currentStep === 6
                    ? form.aiMode === "generate" || form.aiMode === "inspiration"
                      ? "Generate AI preview"
                      : "Review details"
                    : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--theme-green-700))] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[hsl(var(--theme-green-900))]"
                >
                  Submit My Embroidery Request
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </footer>
          </section>
        </form>

        <p className="mx-auto mt-4 max-w-3xl text-center text-xs leading-relaxed text-stone-400">
          This is a request and quote tool, not checkout. Final artwork, embroidery suitability, item
          availability, stitch count, thread colours, price, tax, delivery, and shipping will be confirmed
          before production.
        </p>
      </div>
    </main>
  );
}
