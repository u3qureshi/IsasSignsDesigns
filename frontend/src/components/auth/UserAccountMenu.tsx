import {
  ChevronRight,
  ClipboardList,
  LogIn,
  LogOut,
  PackageOpen,
  Settings,
  UserPlus,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AuthDialog, {
  type AuthDialogView,
  type AuthPreviewUser,
} from "./AuthDialog";

export default function UserAccountMenu() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogView, setDialogView] = useState<AuthDialogView | null>(null);
  const [dialogOrigin, setDialogOrigin] = useState({ x: 0, y: 0 });
  const [previewUser, setPreviewUser] = useState<AuthPreviewUser | null>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  function openDialog(view: AuthDialogView) {
    const rect = triggerRef.current?.getBoundingClientRect();
    setDialogOrigin({
      x: rect ? rect.left + rect.width / 2 : window.innerWidth - 64,
      y: rect ? rect.top + rect.height / 2 : 48,
    });
    setMenuOpen(false);
    setDialogView(view);
  }

  function closeDialog() {
    setDialogView(null);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  return (
    <>
      <div ref={wrapperRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          aria-label={previewUser ? "Open account menu" : "Open login and account menu"}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
          className="group relative rounded-full border-2 border-[#711f3d] bg-transparent p-2 text-[#711f3d] transition-colors duration-200 hover:text-[hsl(var(--theme-sand-300))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--theme-sand-300))] focus-visible:ring-offset-2"
        >
          <UserRound className="relative h-6 w-6" strokeWidth={2.7} />
          {previewUser && (
            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[hsl(var(--theme-green-brand))]" />
          )}
        </button>

        {menuOpen && (
          <div
            role="menu"
            aria-label="Account menu"
            className="absolute right-0 top-full z-[90] mt-2 w-64 overflow-hidden rounded-2xl border border-[hsl(var(--theme-sand-300))] bg-white py-2 shadow-[0_18px_50px_hsl(var(--theme-brown-900)/0.2)]"
          >
            {previewUser ? (
              <>
                <div className="border-b border-stone-100 px-4 py-3">
                  <p className="truncate text-sm font-bold text-[hsl(var(--theme-brown-900))]">
                    {previewUser.firstName} {previewUser.lastName}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-stone-400">{previewUser.email}</p>
                  <p className="mt-2 text-[0.65rem] font-bold uppercase tracking-wider text-[hsl(var(--theme-green-700))]">
                    UI preview
                  </p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => openDialog("account")}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-[hsl(var(--theme-brown-900))] transition hover:bg-[hsl(var(--theme-sand-300)/0.25)]"
                >
                  <Settings className="h-4 w-4 text-[#711f3d]" />
                  Account settings
                  <ChevronRight className="ml-auto h-4 w-4 text-stone-300" />
                </button>
                <button
                  type="button"
                  role="menuitem"
                  disabled
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-stone-400"
                >
                  <ClipboardList className="h-4 w-4" />
                  My embroidery requests
                  <span className="ml-auto text-[0.6rem] font-bold uppercase tracking-wide">Soon</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  disabled
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-stone-400"
                >
                  <PackageOpen className="h-4 w-4" />
                  My orders
                  <span className="ml-auto text-[0.6rem] font-bold uppercase tracking-wide">Soon</span>
                </button>
                <div className="mx-4 border-t border-stone-100" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setPreviewUser(null);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold text-red-700 transition hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <div className="px-4 pb-2 pt-3">
                  <p className="text-sm font-bold text-[hsl(var(--theme-brown-900))]">Your account</p>
                  <p className="mt-1 text-xs leading-relaxed text-stone-400">
                    Sign in securely with a one-time email code.
                  </p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => openDialog("login")}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold text-[#711f3d] transition hover:bg-[hsl(var(--theme-sand-300)/0.25)]"
                >
                  <LogIn className="h-4 w-4 text-[#711f3d]" />
                  Log in
                  <ChevronRight className="ml-auto h-4 w-4 text-stone-300" />
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => openDialog("signup")}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold text-[#711f3d] transition hover:bg-[hsl(var(--theme-sand-300)/0.25)]"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign up
                  <ChevronRight className="ml-auto h-4 w-4 text-stone-300" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {dialogView && (
        <AuthDialog
          initialView={dialogView}
          origin={dialogOrigin}
          previewUser={previewUser}
          onClose={closeDialog}
          onPreviewUserChange={setPreviewUser}
        />
      )}
    </>
  );
}
