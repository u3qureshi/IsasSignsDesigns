import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileImage,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QUICK_REQUEST_EVENT } from "../../types/quickRequest";
import type {
  QuickRequestDraft,
  QuickRequestProduct,
  QuickRequestService,
} from "../../types/quickRequest";

const SERVICE_PATHS = new Set([
  "/services/t-shirts",
  "/services/polo-shirts",
  "/services/sweatshirts-fleece",
  "/services/hats",
]);

const ITEM_OPTIONS = [
  "T-shirt",
  "Polo shirt",
  "Hoodie",
  "Crewneck",
  "Sweatshirt",
  "Fleece",
  "Hat",
  "Beanie",
  "Other",
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELD_CLASS =
  "mt-2 h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm font-semibold text-[hsl(var(--theme-brown-900))] outline-none transition placeholder:font-medium placeholder:text-stone-400 focus:border-[hsl(var(--theme-green-700))] focus:ring-2 focus:ring-[hsl(var(--theme-sage-100)/0.65)]";

interface SubmissionResult {
  requestNumber: string;
  status: string;
}

interface ApiErrorBody {
  message?: string;
  details?: string[];
}

async function readApiError(response: Response) {
  try {
    const body = (await response.json()) as ApiErrorBody;
    if (body.details?.length) return body.details.join(" ");
    if (body.message) return body.message;
  } catch {
    // Use the fallback below when the server did not return JSON.
  }
  return "The request could not be submitted. Please try again.";
}

function createProduct(id: number): QuickRequestProduct {
  return { id, itemType: "", customItem: "", quantity: "" };
}

function RequiredMark() {
  return (
    <span aria-label="required" className="ml-1 text-lg font-black leading-none text-red-600">
      *
    </span>
  );
}

function FieldLabel({ children, optional = false }: { children: ReactNode; optional?: boolean }) {
  return (
    <span className="flex items-center text-sm font-bold text-[hsl(var(--theme-brown-900))]">
      {children}
      {optional ? (
        <span className="ml-1 font-semibold text-[hsl(var(--theme-brown-600))]">(optional)</span>
      ) : (
        <RequiredMark />
      )}
    </span>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl bg-[hsl(var(--theme-green-900))] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white">
      {children}
    </div>
  );
}

export default function QuickRequestLauncher() {
  const location = useLocation();
  const navigate = useNavigate();
  const nextProductId = useRef(2);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileError, setFileError] = useState("");
  const [draft, setDraft] = useState<QuickRequestDraft>({
    service: "",
    products: [createProduct(1)],
    designFile: null,
    notes: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
  });

  const isServicePage = SERVICE_PATHS.has(location.pathname);

  useEffect(() => {
    if (!isServicePage) return;

    const openRequest = (event: Event) => {
      const service = (event as CustomEvent<QuickRequestService | undefined>).detail;
      if (service) {
        setDraft((current) => ({ ...current, service }));
      }
      setErrors({});
      setApiError("");
      setSubmissionResult(null);
      setIsComplete(false);
      setIsOpen(true);
    };

    window.addEventListener(QUICK_REQUEST_EVENT, openRequest);
    return () => window.removeEventListener(QUICK_REQUEST_EVENT, openRequest);
  }, [isServicePage]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isServicePage) return null;

  function updateDraft<K extends keyof QuickRequestDraft>(field: K, value: QuickRequestDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setApiError("");
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function updateProduct(id: number, field: keyof QuickRequestProduct, value: string) {
    setDraft((current) => ({
      ...current,
      products: current.products.map((product) =>
        product.id === id ? { ...product, [field]: value } : product,
      ),
    }));
    setErrors({});
    setApiError("");
  }

  function addProduct() {
    const id = nextProductId.current++;
    setDraft((current) => ({ ...current, products: [...current.products, createProduct(id)] }));
  }

  function removeProduct(id: number) {
    setDraft((current) => ({
      ...current,
      products: current.products.filter((product) => product.id !== id),
    }));
    setErrors({});
  }

  function validateFile(file: File | null) {
    setFileError("");
    if (!file) {
      updateDraft("designFile", null);
      return;
    }
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setFileError("Choose a PNG, JPG, or WEBP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError("The image must be 10 MB or smaller.");
      return;
    }
    updateDraft("designFile", file);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    validateFile(event.target.files?.[0] ?? null);
  }

  function handleFileDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    validateFile(event.dataTransfer.files?.[0] ?? null);
  }

  function validateStepOne() {
    const nextErrors: Record<string, string> = {};
    if (!draft.service) nextErrors.service = "Choose printing or embroidery.";
    draft.products.forEach((product) => {
      if (!product.itemType) nextErrors[`item-${product.id}`] = "Choose an item.";
      if (product.itemType === "Other" && !product.customItem.trim()) {
        nextErrors[`custom-${product.id}`] = "Describe the item.";
      }
      const quantity = Number(product.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        nextErrors[`quantity-${product.id}`] = "Enter a quantity of 1 or more.";
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateContact() {
    const nextErrors: Record<string, string> = {};
    if (!draft.firstName.trim()) nextErrors.firstName = "Enter your first name.";
    if (!draft.lastName.trim()) nextErrors.lastName = "Enter your last name.";
    if (!draft.email.trim()) nextErrors.email = "Enter your email address.";
    else if (!EMAIL_PATTERN.test(draft.email.trim())) nextErrors.email = "Enter a valid email address.";
    const phoneDigits = draft.phone.replace(/\D/g, "");
    if (!phoneDigits) nextErrors.phone = "Enter your phone number.";
    else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      nextErrors.phone = "Enter a valid phone number.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goNext() {
    if (!validateStepOne()) return;
    setStep(2);
  }

  async function submitRequest() {
    if (!validateContact()) return;
    setApiError("");
    setIsSubmitting(true);
    try {
      const { designFile, products, ...requestFields } = draft;
      const request = {
        ...requestFields,
        products: products.map(({ itemType, customItem, quantity }) => ({
          itemType,
          customItem,
          quantity: Number(quantity),
        })),
      };
      const data = new FormData();
      data.append(
        "request",
        new Blob([JSON.stringify(request)], { type: "application/json" }),
      );
      if (designFile) data.append("designFile", designFile);

      const response = await fetch("/api/quick-requests", { method: "POST", body: data });
      if (!response.ok) throw new Error(await readApiError(response));
      const result = (await response.json()) as SubmissionResult;
      setSubmissionResult(result);
      setIsComplete(true);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "The request could not be submitted.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function continueToStudio() {
    if (!draft.service) {
      setErrors((current) => ({ ...current, service: "Choose printing or embroidery first." }));
      setStep(1);
      return;
    }
    navigate(draft.service === "printing" ? "/printing/custom" : "/embroidery/custom-designs", {
      state: { quickRequest: draft },
    });
    setIsOpen(false);
  }

  function closeDialog() {
    setIsOpen(false);
    setIsComplete(false);
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[hsl(var(--theme-brown-900)/0.7)] p-3 backdrop-blur-[2px] sm:p-6"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) closeDialog();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-request-title"
            className="max-h-[calc(100vh-1.5rem)] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] bg-[hsl(var(--theme-kids-bg))] shadow-2xl sm:max-h-[calc(100vh-3rem)]"
          >
            <header className="sticky top-0 z-10 border-b border-[hsl(var(--theme-sand-300)/0.55)] bg-[hsl(var(--theme-kids-bg)/0.96)] px-5 py-5 backdrop-blur sm:px-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[hsl(var(--theme-green-700))]">
                    Quick request
                  </p>
                  <h2 id="quick-request-title" className="mt-1 font-aoki text-3xl text-[hsl(var(--theme-brown-900))] sm:text-4xl">
                    {isComplete ? "Your request was sent." : "Share the essentials."}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeDialog}
                  aria-label="Close quick request"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-[hsl(var(--theme-brown-900))] transition hover:border-[hsl(var(--theme-brown-500))]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {!isComplete && (
                <div className="mt-4 flex items-center gap-3" aria-label={`Step ${step} of 2`}>
                  {[1, 2].map((value) => (
                    <span
                      key={value}
                      className={`h-1.5 flex-1 rounded-full ${value <= step ? "bg-[hsl(var(--theme-green-700))]" : "bg-stone-200"}`}
                    />
                  ))}
                  <span className="text-xs font-bold text-[hsl(var(--theme-brown-600))]">{step} / 2</span>
                </div>
              )}
            </header>

            {isComplete ? (
              <div className="px-5 py-10 text-center sm:px-10 sm:py-14">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--theme-sage-100)/0.65)] text-[hsl(var(--theme-green-900))]">
                  <Check className="h-8 w-8" strokeWidth={3} />
                </span>
                <h3 className="mt-5 font-aoki text-3xl text-[hsl(var(--theme-brown-900))]">Everything looks good.</h3>
                <p className="mx-auto mt-3 max-w-lg font-medium leading-7 text-[hsl(var(--theme-brown-600))]">
                  Request <strong className="text-[hsl(var(--theme-brown-900))]">{submissionResult?.requestNumber}</strong> has been submitted. A confirmation email with your details is being sent to {draft.email}.
                </p>
                <div className="mx-auto mt-8 max-w-xs">
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="w-full rounded-full bg-[hsl(var(--theme-green-900))] px-5 py-3 text-sm font-bold text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-7 px-5 py-6 sm:px-8 sm:py-8">
                  {step === 1 ? (
                    <>
                      <fieldset>
                        <legend className="text-sm font-bold text-[hsl(var(--theme-brown-900))]">
                          Decoration type<RequiredMark />
                        </legend>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          {([
                            ["printing", "Printing", "Bold, durable colour on apparel."],
                            ["embroidery", "Embroidery", "A polished, dimensional thread finish."],
                          ] as const).map(([value, title, description]) => (
                            <label
                              key={value}
                              className={`cursor-pointer rounded-2xl border-2 p-4 transition ${
                                draft.service === value
                                  ? "border-[hsl(var(--theme-green-700))] bg-[hsl(var(--theme-sage-100)/0.32)]"
                                  : "border-stone-200 bg-white hover:border-[hsl(var(--theme-sand-300))]"
                              }`}
                            >
                              <input
                                type="radio"
                                name="quick-request-service"
                                value={value}
                                checked={draft.service === value}
                                onChange={() => updateDraft("service", value as QuickRequestService)}
                                className="sr-only"
                              />
                              <span className="block font-aoki text-xl text-[hsl(var(--theme-brown-900))]">{title}</span>
                              <span className="mt-1 block text-xs font-semibold leading-5 text-[hsl(var(--theme-brown-600))]">{description}</span>
                            </label>
                          ))}
                        </div>
                        {errors.service && <p className="mt-2 text-sm font-bold text-red-600">{errors.service}</p>}
                      </fieldset>

                      <div>
                        <SectionTitle>Products</SectionTitle>
                        <div className="mt-4 space-y-4">
                          {draft.products.map((product, index) => (
                            <div key={product.id} className="rounded-2xl border border-stone-200 bg-white p-4">
                              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_9rem_auto] sm:items-end">
                                <label>
                                  <FieldLabel>Item type</FieldLabel>
                                  <select
                                    value={product.itemType}
                                    onChange={(event) => updateProduct(product.id, "itemType", event.target.value)}
                                    className={FIELD_CLASS}
                                  >
                                    <option value="">Select an item</option>
                                    {ITEM_OPTIONS.map((item) => <option key={item}>{item}</option>)}
                                  </select>
                                  {errors[`item-${product.id}`] && <p className="mt-1 text-xs font-bold text-red-600">{errors[`item-${product.id}`]}</p>}
                                </label>
                                <label>
                                  <FieldLabel>Quantity</FieldLabel>
                                  <input
                                    type="number"
                                    min="1"
                                    inputMode="numeric"
                                    value={product.quantity}
                                    onChange={(event) => updateProduct(product.id, "quantity", event.target.value)}
                                    placeholder="e.g. 24"
                                    className={FIELD_CLASS}
                                  />
                                  {errors[`quantity-${product.id}`] && <p className="mt-1 text-xs font-bold text-red-600">{errors[`quantity-${product.id}`]}</p>}
                                </label>
                                <button
                                  type="button"
                                  onClick={() => removeProduct(product.id)}
                                  disabled={draft.products.length === 1}
                                  aria-label={`Remove product ${index + 1}`}
                                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-stone-200 px-4 text-sm font-bold text-[hsl(var(--theme-brown-600))] transition hover:border-red-200 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-35"
                                >
                                  <Minus className="h-4 w-4" />
                                  <span className="sm:hidden">Remove</span>
                                </button>
                              </div>
                              {product.itemType === "Other" && (
                                <label className="mt-4 block">
                                  <FieldLabel>Describe the item</FieldLabel>
                                  <input
                                    value={product.customItem}
                                    onChange={(event) => updateProduct(product.id, "customItem", event.target.value)}
                                    placeholder="What would you like decorated?"
                                    className={FIELD_CLASS}
                                  />
                                  {errors[`custom-${product.id}`] && <p className="mt-1 text-xs font-bold text-red-600">{errors[`custom-${product.id}`]}</p>}
                                </label>
                              )}
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={addProduct}
                          disabled={draft.products.length >= 5}
                          className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-[hsl(var(--theme-green-900))] px-4 py-2 text-sm font-bold text-[hsl(var(--theme-green-900))] transition hover:bg-[hsl(var(--theme-sage-100)/0.3)] disabled:opacity-40"
                        >
                          <Plus className="h-4 w-4" />
                          Add another item
                        </button>
                      </div>

                      <div>
                        <FieldLabel optional>Upload design file</FieldLabel>
                        {draft.designFile ? (
                          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4">
                            <FileImage className="h-6 w-6 shrink-0 text-[hsl(var(--theme-green-700))]" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-bold text-[hsl(var(--theme-brown-900))]">{draft.designFile.name}</p>
                              <p className="text-xs font-semibold text-stone-400">{(draft.designFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button type="button" onClick={() => validateFile(null)} aria-label="Remove design file" className="rounded-full p-2 text-stone-500 hover:bg-red-50 hover:text-red-600">
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={handleFileDrop}
                            className="mt-2 flex min-h-32 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[hsl(var(--theme-sand-300))] bg-white px-5 py-6 text-center transition hover:border-[hsl(var(--theme-green-700))]"
                          >
                            <Upload className="h-6 w-6 text-[hsl(var(--theme-green-700))]" />
                            <span className="mt-2 text-sm font-bold text-[hsl(var(--theme-brown-900))]">Drop an image here or choose a file</span>
                            <span className="mt-1 text-xs font-semibold text-stone-400">PNG, JPG, or WEBP · maximum 10 MB</span>
                          </button>
                        )}
                        <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" onChange={handleFileChange} className="sr-only" />
                        {fileError && <p className="mt-2 text-sm font-bold text-red-600">{fileError}</p>}
                      </div>

                      <label className="block">
                        <FieldLabel optional>Special instructions or notes</FieldLabel>
                        <textarea
                          value={draft.notes}
                          onChange={(event) => updateDraft("notes", event.target.value)}
                          rows={4}
                          placeholder="Tell us about colours, placements, timing, or anything else we should know."
                          className={`${FIELD_CLASS} h-auto min-h-28 resize-y py-3`}
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <SectionTitle>Personal information</SectionTitle>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <label>
                          <FieldLabel>First name</FieldLabel>
                          <input value={draft.firstName} onChange={(event) => updateDraft("firstName", event.target.value)} autoComplete="given-name" className={FIELD_CLASS} />
                          {errors.firstName && <p className="mt-1 text-xs font-bold text-red-600">{errors.firstName}</p>}
                        </label>
                        <label>
                          <FieldLabel>Last name</FieldLabel>
                          <input value={draft.lastName} onChange={(event) => updateDraft("lastName", event.target.value)} autoComplete="family-name" className={FIELD_CLASS} />
                          {errors.lastName && <p className="mt-1 text-xs font-bold text-red-600">{errors.lastName}</p>}
                        </label>
                        <label>
                          <FieldLabel>Email address</FieldLabel>
                          <input type="email" value={draft.email} onChange={(event) => updateDraft("email", event.target.value)} autoComplete="email" className={FIELD_CLASS} />
                          {errors.email && <p className="mt-1 text-xs font-bold text-red-600">{errors.email}</p>}
                        </label>
                        <label>
                          <FieldLabel>Phone number</FieldLabel>
                          <input type="tel" value={draft.phone} onChange={(event) => updateDraft("phone", event.target.value)} autoComplete="tel" className={FIELD_CLASS} />
                          {errors.phone && <p className="mt-1 text-xs font-bold text-red-600">{errors.phone}</p>}
                        </label>
                        <label className="sm:col-span-2">
                          <FieldLabel optional>Company / organization name</FieldLabel>
                          <input value={draft.company} onChange={(event) => updateDraft("company", event.target.value)} autoComplete="organization" className={FIELD_CLASS} />
                        </label>
                      </div>
                      <div className="flex items-start gap-3 rounded-2xl bg-[hsl(var(--theme-sage-100)/0.3)] p-4 text-[hsl(var(--theme-green-900))]">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
                        <p className="text-sm font-semibold leading-6">
                          Your contact details and optional artwork will be submitted to Thread &amp; Butter for review and an emailed follow-up.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <footer className="border-t border-[hsl(var(--theme-sand-300)/0.55)] bg-white px-5 py-5 sm:px-8">
                  {apiError && (
                    <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                      {apiError}
                    </div>
                  )}
                  <div className="flex gap-3">
                    {step === 2 && (
                      <button type="button" onClick={() => { setStep(1); setErrors({}); }} className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[hsl(var(--theme-green-900))] px-5 py-3 text-sm font-bold text-[hsl(var(--theme-green-900))]">
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={step === 1 ? goNext : submitRequest}
                      disabled={isSubmitting}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[hsl(var(--theme-green-900))] px-6 py-3 text-sm font-bold text-white transition hover:bg-[hsl(var(--theme-green-700))] disabled:cursor-wait disabled:opacity-65"
                    >
                      {step === 1 ? "Next" : isSubmitting ? "Submitting…" : "Submit request"}
                      {step === 1 && <ArrowRight className="h-4 w-4" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={continueToStudio}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--theme-sand-300)/0.36)] px-5 py-3 text-sm font-bold text-[hsl(var(--theme-brown-900))] transition hover:bg-[hsl(var(--theme-sand-300)/0.6)]"
                  >
                    <Sparkles className="h-4 w-4 text-[hsl(var(--theme-green-700))]" />
                    Continue these details in the AI Design Studio
                  </button>
                  <p className="mt-3 text-center text-xs font-semibold leading-5 text-[hsl(var(--theme-brown-600))]">
                    Fields marked with a <span className="font-black text-red-600">*</span> are required. Company name and artwork are optional.
                  </p>
                </footer>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
