import { Link } from "react-router-dom";
import { Instagram, Facebook, Info, Mail, Star, HelpCircle, LogIn, Package, MessageCircle } from "lucide-react";
import logo from "../assets/brand/IsaSignsAndDesignsLOGO.svg";

/* ── Pinterest icon (not in lucide) ─────────────────────────────────────── */
function PinterestIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.03-2.83.19-.77 1.26-5.33 1.26-5.33s-.32-.64-.32-1.59c0-1.49.86-2.6 1.93-2.6.91 0 1.35.68 1.35 1.5 0 .91-.58 2.28-.88 3.55-.25 1.06.53 1.92 1.57 1.92 1.88 0 3.14-2.4 3.14-5.24 0-2.16-1.46-3.77-4.1-3.77-2.99 0-4.84 2.23-4.84 4.72 0 .86.25 1.46.64 1.93.18.21.21.3.14.54-.05.17-.15.59-.2.75-.06.24-.25.33-.46.24-1.31-.54-1.92-1.99-1.92-3.62 0-2.69 2.26-5.9 6.74-5.9 3.6 0 5.98 2.6 5.98 5.4 0 3.7-2.06 6.47-5.1 6.47-1.02 0-1.97-.55-2.3-1.18l-.63 2.45c-.22.84-.65 1.68-1.04 2.33.78.24 1.6.37 2.46.37 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  );
}

/* ── TikTok icon (not in lucide) ─────────────────────────────────────────── */
function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "Instagram",  href: "https://instagram.com",  Icon: () => <Instagram size={28} /> },
  { label: "Facebook",   href: "https://facebook.com",   Icon: () => <Facebook size={28} /> },
  { label: "Pinterest",  href: "https://pinterest.com",  Icon: () => <PinterestIcon size={28} /> },
  { label: "TikTok",     href: "https://tiktok.com",     Icon: () => <TikTokIcon size={28} /> },
];

function socialHoverClass(label: string): string {
  switch (label) {
    case "Instagram":
      return "hover:text-[#E1306C]";
    case "Facebook":
      return "hover:text-[#1877F2]";
    case "Pinterest":
      return "hover:text-[#E60023]";
    case "TikTok":
      return "hover:text-black";
    default:
      return "hover:text-white";
  }
}

const NAV_LINKS = [
  { label: "About Us",         icon: <Info size={15} />,         to: "/about" },
  { label: "Contact Us",       icon: <Mail size={15} />,         to: "/contact" },
  { label: "Reviews",          icon: <Star size={15} />,         to: "/reviews" },
  { label: "FAQ",              icon: <HelpCircle size={15} />,   to: "/faq" },
  { label: "Login",            icon: <LogIn size={15} />,        to: "/login" },
  { label: "Track Your Order", icon: <Package size={15} />,      to: "/track" },
  { label: "WhatsApp",         icon: <MessageCircle size={15} />, href: "https://wa.me/" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "hsl(var(--theme-brown-footer))" }}>
      {/* ── Top: tagline + blurb ─────────────────────────────────────────── */}
      <div className="px-8 py-12 text-center">
        <div className="max-w-screen-xl mx-auto">
          <p className="font-aoki text-xl mb-4 tracking-wide text-white">
            Meaningful Islamic Decor, Crafted in Canada
          </p>
          <p className="text-md leading-relaxed max-w-5xl mx-auto text-white">
            Bring warmth, remembrance, and beauty into your home with modern
            Islamic wall art and thoughtful Islam-inspired pieces—made to be
            affordable without compromising quality. From Arabic calligraphy
            designs to prayer-corner essentials, Islamic kids products, and
            personalized gifts, each item is designed with care and handcrafted
            in our Canadian studio. Whether you're decorating your space, gifting
            for Ramadan/Eid, or creating something special for a nikkah or
            wedding, our pieces are made to feel timeless—built to last and meant
            to be lived with.
          </p>
        </div>
      </div>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div className="border-t mx-8" style={{ borderColor: "hsl(var(--theme-sand-300))" }} />

      {/* ── Bottom: 3 divs (logo | links | socials) ────────────────────── */}
      <div className="px-6 md:px-12 py-10 max-w-none mx-auto">
        <div className="flex flex-col items-center gap-8 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-x-10">
          <div className="md:justify-self-start">
            <img
              src={logo}
              alt="Isa's Signs & Designs"
              className="w-56 h-56 object-contain"
              style={{ filter: "brightness(0) invert(1) drop-shadow(0 6px 24px rgba(255,255,255,0.25))" }}
            />
          </div>

          <div className="md:justify-self-center md:text-center">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 place-items-start">
              {NAV_LINKS.map(({ label, icon, to, href }) =>
                to ? (
                  <Link
                    key={label}
                    to={to}
                    className="flex items-center gap-2 text-xl font-semibold text-white transition-opacity hover:opacity-60"
                  >
                    <span className="opacity-80">{icon}</span>
                    {label}
                  </Link>
                ) : (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xl font-semibold text-white transition-opacity hover:opacity-60"
                  >
                    <span className="opacity-80">{icon}</span>
                    {label}
                  </a>
                )
              )}
            </div>
          </div>

          <div className="md:justify-self-end md:mr-8">
            <div className="relative border border-white/50 rounded-xl px-4 pb-4 pt-6">
              <span
                className="absolute top-0 -left-24 -translate-y-1/2 px-2 pb-2 text-base font-semibold leading-none whitespace-nowrap text-white"
                style={{ backgroundColor: "hsl(var(--theme-brown-footer))" }}
              >
                Check us out:
              </span>

              <div className="flex flex-col items-center md:items-start gap-3 pt-3">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`text-white transition-colors duration-200 ${socialHoverClass(label)}`}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Copyright ────────────────────────────────────────────────────── */}
      <div
        className="text-center text-xs pb-6"
        style={{ color: "hsl(var(--theme-sand-300) / 0.5)" }}
      >
        © {new Date().getFullYear()} Isa's Signs & Designs. All rights reserved.
      </div>
    </footer>
  );
}
