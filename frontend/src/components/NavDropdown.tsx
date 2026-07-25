import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

interface NavDropdownItem {
  label: string;
  path: string;
  isNew?: boolean;
}

interface NavDropdownProps {
  label: string;
  menuId: string;
  items: NavDropdownItem[];
}

export default function NavDropdown({ label, menuId, items }: NavDropdownProps) {
  const [open, setOpen] = useState(false);

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
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={[
                  "group block px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[hsl(var(--theme-sand-300)/0.35)] focus:bg-[hsl(var(--theme-sand-300)/0.35)] focus:outline-none",
                  item.isNew
                    ? "text-red-600 hover:text-red-700"
                    : "text-[hsl(var(--theme-brown-900))]",
                ].join(" ")}
              >
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
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
