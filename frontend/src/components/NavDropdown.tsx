import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavDropdownItem {
  label: string;
  path: string;
  isNew?: boolean;
  disabled?: boolean;
}

interface NavDropdownProps {
  label: string;
  menuId: string;
  items: NavDropdownItem[];
}

export default function NavDropdown({ label, menuId, items }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          event.currentTarget.querySelector<HTMLButtonElement>("button")?.focus();
        }
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-1 pb-1 font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--theme-brown-500))] focus-visible:ring-offset-2"
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-[70] w-64 -translate-x-1/2 pt-2">
          <div
            id={menuId}
            role="menu"
            aria-label={`${label} collections`}
            className="overflow-hidden rounded-xl border border-[hsl(var(--theme-sand-300))] bg-white py-2 shadow-xl"
          >
            {items.map((item) => {
              const content = (
                <span className="flex items-center justify-between gap-4">
                  <span className="relative inline-block">
                    {item.label}
                    {item.isNew && (
                      <span
                        aria-label="New"
                        className="absolute -right-8 -top-2.5 rotate-12 rounded-full bg-red-600 px-1.5 py-0.5 text-[0.5rem] font-black uppercase leading-none tracking-wide text-white shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:rotate-[16deg]"
                      >
                        NEW
                      </span>
                    )}
                  </span>
                  {item.disabled && (
                    <span className="text-[0.58rem] font-bold uppercase tracking-[0.1em] text-[hsl(var(--theme-brown-500))]">
                      Soon
                    </span>
                  )}
                </span>
              );

              const itemClass = [
                "group block border-b border-[hsl(var(--theme-sand-300)/0.45)] px-5 py-2.5 text-sm font-semibold last:border-b-0",
                item.disabled
                  ? "cursor-default bg-stone-50 text-[hsl(var(--theme-brown-700)/0.62)]"
                  : "transition-colors hover:bg-[hsl(var(--theme-sand-300)/0.35)] focus:bg-[hsl(var(--theme-sand-300)/0.35)] focus:outline-none",
                pathname === item.path ? "bg-[hsl(var(--theme-sage-100)/0.65)]" : "",
                item.isNew
                  ? "text-red-600 hover:text-red-700"
                  : "",
              ].join(" ");

              return item.disabled ? (
                <span key={item.path} role="menuitem" aria-disabled="true" className={itemClass}>
                  {content}
                </span>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={`${itemClass} text-[hsl(var(--theme-brown-900))]`}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
