import {
  ArrowLeft,
  Check,
  KeyRound,
  Mail,
  Phone,
  UserRound,
  X,
} from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import { useAuth } from "./AuthContext";

export type AuthDialogView = "login" | "signup" | "account";

interface AuthDialogProps {
  initialView: AuthDialogView;
  origin: { x: number; y: number };
  onClose: () => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function FieldError({ children }: { children: string }) {
  return (
    <p role="alert" className="mt-1.5 text-xs font-semibold text-red-700">
      {children}
    </p>
  );
}

export default function AuthDialog({
  initialView,
  origin,
  onClose,
}: AuthDialogProps) {
  const { user, startSignup, startLogin, verifyCode, updateProfile } = useAuth();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const closeRequestedRef = useRef(false);
  const [view, setView] = useState<AuthDialogView>(initialView);
  const [stage, setStage] = useState<"details" | "code">("details");
  const [closing, setClosing] = useState(false);
  const [email, setEmail] = useState(user?.email ?? "");
  const [emailConfirmation, setEmailConfirmation] = useState("");
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [smsConsent, setSmsConsent] = useState(user?.smsConsent ?? false);
  const [code, setCode] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    panel.style.setProperty("--auth-origin-x", `${origin.x - rect.left}px`);
    panel.style.setProperty("--auth-origin-y", `${origin.y - rect.top}px`);
    panel.classList.add("auth-dialog-panel--ready");
  }, [origin]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      const currentPaddingRight =
        Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => firstInputRef.current?.focus(), 180);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = window.setTimeout(() => {
      setResendSeconds((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [resendSeconds]);

  function requestClose() {
    if (closeRequestedRef.current) return;
    closeRequestedRef.current = true;
    setClosing(true);
    closeTimerRef.current = window.setTimeout(onClose, 220);
  }

  function switchView(nextView: "login" | "signup") {
    setView(nextView);
    setStage("details");
    setCode("");
    setChallengeId("");
    setResendSeconds(0);
    setError("");
    setSaved(false);
    if (!user) {
      setFirstName("");
      setLastName("");
      setEmailConfirmation("");
      setPhone("");
      setSmsConsent(false);
    }
    window.setTimeout(() => firstInputRef.current?.focus(), 0);
  }

  function validateDetails() {
    const normalizedEmail = email.trim();
    if (!EMAIL_PATTERN.test(normalizedEmail)) return "Enter a valid email address.";
    if (view === "signup") {
      if (!firstName.trim()) return "Enter your first name.";
      if (!EMAIL_PATTERN.test(emailConfirmation.trim())) return "Enter your email address again.";
      if (normalizedEmail.toLowerCase() !== emailConfirmation.trim().toLowerCase()) {
        return "The two email addresses do not match.";
      }
    }
    if (phone && (phone.length < 10 || phone.length > 15)) {
      return "Phone number must contain 10 to 15 digits.";
    }
    if (smsConsent && !phone) return "Enter a phone number before consenting to text messages.";
    return "";
  }

  async function handleDetailsSubmit(event: FormEvent) {
    event.preventDefault();
    setSaved(false);
    const nextError = validateDetails();
    if (nextError) {
      setError(nextError);
      return;
    }
    setError("");
    setBusy(true);
    try {
      const challenge = view === "signup"
        ? await startSignup({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            emailConfirmation: emailConfirmation.trim(),
            phone,
            smsConsent,
          })
        : await startLogin(email.trim());
      setChallengeId(challenge.challengeId);
      setResendSeconds(challenge.resendAvailableInSeconds);
      setStage("code");
      setCode("");
      window.setTimeout(() => firstInputRef.current?.focus(), 0);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  async function handleCodeSubmit(event: FormEvent) {
    event.preventDefault();
    if (code.length !== 4) {
      setError("Enter the complete four-digit code.");
      return;
    }

    if (!challengeId) {
      setError("Request a new code and try again.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await verifyCode(challengeId, code);
      requestClose();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  async function handleAccountSubmit(event: FormEvent) {
    event.preventDefault();
    if (!firstName.trim()) {
      setError("Enter your first name.");
      return;
    }
    if (phone && (phone.length < 10 || phone.length > 15)) {
      setError("Phone number must contain 10 to 15 digits.");
      return;
    }
    if (smsConsent && !phone) {
      setError("Enter a phone number before consenting to text messages.");
      return;
    }

    setError("");
    setBusy(true);
    try {
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone,
        smsConsent,
      });
      setSaved(true);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  async function resendCode() {
    setCode("");
    setError("");
    setBusy(true);
    try {
      const challenge = view === "signup"
        ? await startSignup({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            emailConfirmation: emailConfirmation.trim(),
            phone,
            smsConsent,
          })
        : await startLogin(email.trim());
      setChallengeId(challenge.challengeId);
      setResendSeconds(challenge.resendAvailableInSeconds);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  const isAccount = view === "account";
  const isSignup = view === "signup";
  const title = isAccount
    ? "Account settings"
    : stage === "code"
      ? "Check your email"
      : isSignup
        ? "Create your account"
        : "Welcome back";
  const description = isAccount
    ? "Keep your contact information up to date."
    : stage === "code"
      ? `Enter the four-digit code sent to ${email.trim() || "your email"}.`
      : isSignup
        ? "A few details, one email code, and you are in—no password required."
        : "Enter your email and we will send a one-time sign-in code.";

  return createPortal(
    <div
      className={[
        "auth-dialog-backdrop fixed inset-0 z-[120] flex items-center justify-center bg-[hsl(var(--theme-brown-900)/0.46)] px-4 py-6 backdrop-blur-[2px]",
        closing ? "auth-dialog-backdrop--closing" : "",
      ].join(" ")}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
        className={[
          "auth-dialog-panel relative max-h-[calc(100vh-3rem)] w-full max-w-[31rem] overflow-y-auto rounded-[1.75rem] border border-[hsl(var(--theme-sand-300))] bg-[hsl(var(--theme-kids-bg))] p-6 shadow-[0_28px_80px_hsl(var(--theme-brown-900)/0.3)] sm:p-8",
          closing ? "auth-dialog-panel--closing" : "",
        ].join(" ")}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={requestClose}
          aria-label="Close account dialog"
          className="absolute right-4 top-4 rounded-full p-2 text-[hsl(var(--theme-brown-700))] transition hover:bg-[hsl(var(--theme-sand-300)/0.32)] hover:text-[hsl(var(--theme-brown-900))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--theme-brown-500))]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="pr-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--theme-sand-300)/0.38)] text-[#711f3d]">
              {isAccount ? (
                <UserRound className="h-6 w-6" strokeWidth={2.3} />
              ) : stage === "code" ? (
                <KeyRound className="h-6 w-6" strokeWidth={2.3} />
              ) : (
                <Mail className="h-6 w-6" strokeWidth={2.3} />
              )}
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[hsl(var(--theme-brown-700))] sm:text-base">
              {isAccount ? "Your profile" : "Passwordless account"}
            </p>
          </div>
          <h2
            id="auth-dialog-title"
            className="mt-3 font-aoki text-3xl text-[hsl(var(--theme-brown-900))] sm:text-4xl"
          >
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-500">{description}</p>
        </div>

        {!isAccount && stage === "details" && (
          <div className="mt-6 grid grid-cols-2 rounded-xl bg-[hsl(var(--theme-sand-300)/0.22)] p-1">
            <button
              type="button"
              onClick={() => switchView("login")}
              className={[
                "rounded-lg px-4 py-2.5 text-sm font-bold transition",
                view === "login"
                  ? "bg-white text-[#711f3d] shadow-sm"
                  : "text-stone-500 hover:text-[hsl(var(--theme-brown-900))]",
              ].join(" ")}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => switchView("signup")}
              className={[
                "rounded-lg px-4 py-2.5 text-sm font-bold transition",
                view === "signup"
                  ? "bg-white text-[#711f3d] shadow-sm"
                  : "text-stone-500 hover:text-[hsl(var(--theme-brown-900))]",
              ].join(" ")}
            >
              Sign up
            </button>
          </div>
        )}

        {!isAccount && stage === "details" && (
          <form onSubmit={handleDetailsSubmit} className="mt-6 space-y-4" noValidate>
            {isSignup && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-[hsl(var(--theme-brown-900))]">
                    First name
                  </span>
                  <input
                    ref={firstInputRef}
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    autoComplete="given-name"
                    placeholder="First name"
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-[hsl(var(--theme-brown-900))]">
                    Last name <span className="font-bold text-[hsl(var(--theme-brown-700))]">(optional)</span>
                  </span>
                  <input
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    autoComplete="family-name"
                    placeholder="Last name"
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
                  />
                </label>
              </div>
            )}

            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-[hsl(var(--theme-brown-900))]">
                Email address
              </span>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  ref={isSignup ? undefined : firstInputRef}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
                />
              </div>
            </label>

            {isSignup && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-[hsl(var(--theme-brown-900))]">
                  Confirm email address
                </span>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    value={emailConfirmation}
                    onChange={(event) => setEmailConfirmation(event.target.value)}
                    autoComplete="off"
                    inputMode="email"
                    placeholder="Enter your email again"
                    className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
                  />
                </div>
              </label>
            )}

            {isSignup && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-[hsl(var(--theme-brown-900))]">
                    Phone number <span className="font-bold text-[hsl(var(--theme-brown-700))]">(optional)</span>
                  </span>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value.replace(/\D/g, "").slice(0, 15))
                      }
                      autoComplete="tel"
                      inputMode="numeric"
                      placeholder="4165550123"
                      className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
                    />
                  </div>
                </label>
                <div>
                  <label className="flex cursor-pointer gap-3 rounded-xl border border-stone-200 bg-white p-3">
                    <input
                      type="checkbox"
                      checked={smsConsent}
                      onChange={(event) => setSmsConsent(event.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded accent-[#711f3d]"
                    />
                    <span className="text-xs leading-relaxed text-[hsl(var(--theme-brown-700))]">
                      I consent to receiving text messages from Thread & Butter about my account and
                      requests. Message and data rates may apply.
                    </span>
                  </label>
                  <p className="mt-px text-xs font-bold leading-tight text-red-600">
                    (Consent is optional)
                  </p>
                </div>
              </>
            )}

            {error && <FieldError>{error}</FieldError>}

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#711f3d] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[hsl(var(--theme-brown-700))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#711f3d] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
            >
              <Mail className="h-4 w-4" />
              {busy
                ? "Sending code…"
                : isSignup
                  ? "Create account & email code"
                  : "Email me a sign-in code"}
            </button>

            <p className="text-center text-xs font-bold leading-relaxed text-[hsl(var(--theme-brown-900))]">
              No password required. Your one-time code will expire after ten minutes.
            </p>
          </form>
        )}

        {!isAccount && stage === "code" && (
          <form onSubmit={handleCodeSubmit} className="mt-7 space-y-5" noValidate>
            <label className="block">
              <span className="mb-2 block text-center text-sm font-bold text-[hsl(var(--theme-brown-900))]">
                Four-digit code
              </span>
              <input
                ref={firstInputRef}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="0000"
                aria-label="Four-digit email code"
                className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-center font-mono text-2xl font-bold tracking-[0.38em] text-[#711f3d] outline-none transition placeholder:text-stone-200 focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
              />
            </label>

            {error && <FieldError>{error}</FieldError>}

            <button
              type="submit"
              disabled={code.length !== 4 || busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#711f3d] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[hsl(var(--theme-brown-700))] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Check className="h-4 w-4" />
              {busy ? "Verifying…" : isSignup ? "Verify & create account" : "Verify & sign in"}
            </button>

            <div className="flex items-center justify-between text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setStage("details");
                  setError("");
                }}
                className="inline-flex items-center gap-1 text-[hsl(var(--theme-brown-700))] hover:text-[#711f3d]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change details
              </button>
              <button
                type="button"
                disabled={busy || resendSeconds > 0}
                onClick={() => void resendCode()}
                className="text-[hsl(var(--theme-brown-700))] hover:text-[#711f3d] disabled:cursor-not-allowed disabled:text-stone-400"
              >
                {busy
                  ? "Sending…"
                  : resendSeconds > 0
                    ? `Resend in ${resendSeconds}s`
                    : "Resend code"}
              </button>
            </div>

            <p className="rounded-xl bg-[hsl(var(--theme-sand-300)/0.2)] px-4 py-3 text-center text-xs leading-relaxed text-stone-500">
              The code expires after ten minutes and can only be used once. If it lands in junk,
              mark it as not spam so future codes are easier to find.
            </p>
          </form>
        )}

        {isAccount && (
          <form onSubmit={handleAccountSubmit} className="mt-7 space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-[hsl(var(--theme-brown-900))]">
                  First name
                </span>
                <input
                  ref={firstInputRef}
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-[hsl(var(--theme-brown-900))]">
                  Last name <span className="font-bold text-[hsl(var(--theme-brown-700))]">(optional)</span>
                </span>
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-[hsl(var(--theme-brown-900))]">
                Verified email
              </span>
              <input
                value={email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-stone-200 bg-stone-100 px-4 py-3 text-sm text-stone-500"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-[hsl(var(--theme-brown-900))]">
                Phone number <span className="font-bold text-[hsl(var(--theme-brown-700))]">(optional)</span>
              </span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 15))}
                inputMode="numeric"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[hsl(var(--theme-brown-500))] focus:ring-2 focus:ring-[hsl(var(--theme-sand-300)/0.35)]"
              />
            </label>
            <label className="flex cursor-pointer gap-3 rounded-xl border border-stone-200 bg-white p-3">
              <input
                type="checkbox"
                checked={smsConsent}
                onChange={(event) => setSmsConsent(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-[#711f3d]"
              />
              <span className="text-xs leading-relaxed text-[hsl(var(--theme-brown-700))]">
                I consent to receiving text messages from Thread & Butter. Message and data rates
                may apply.
              </span>
            </label>

            {error && <FieldError>{error}</FieldError>}
            {saved && (
              <p className="flex items-center gap-2 rounded-xl bg-[hsl(var(--theme-sage-100)/0.28)] px-4 py-3 text-xs font-bold text-[hsl(var(--theme-green-700))]">
                <Check className="h-4 w-4" />
                Your account details have been saved.
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-[#711f3d] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[hsl(var(--theme-brown-700))] disabled:cursor-wait disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save changes"}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
