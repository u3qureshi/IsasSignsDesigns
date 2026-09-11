import { useEffect, useRef, useState } from "react";
import { Menu, Search, ShoppingCart, Truck, X } from "lucide-react";
import { Link } from "react-router-dom";
import Brand from "./Brand";
import mapleLeafLogo from "../assets/brand/Maple_Leaf.svg";
import handmadeLogo from "../assets/brand/handmade.svg";
import { EMBROIDERY_COLLECTIONS } from "../config/embroideryCollections";
import { PRINTING_COLLECTIONS } from "../config/printingCollections";
import { SERVICE_COLLECTIONS } from "../config/serviceCollections";
import NavDropdown from "./NavDropdown";
import UserAccountMenu from "./auth/UserAccountMenu";
import { useCart } from "./cart/CartContext";
import ProductSearch from "./ProductSearch";

export default function Header() {
  const { openCart, totalQuantity } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [stickySearchOpen, setStickySearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPromoBar, setShowPromoBar] = useState(true);
  const topRowRef = useRef<HTMLDivElement | null>(null);
  const scrollTriggerRef = useRef(80);

  useEffect(() => {
    const updateScrolledState = () => {
      const y = window.scrollY;
      setIsScrolled(y >= scrollTriggerRef.current);
    };

    const updateScrollTrigger = () => {
      const topRowHeight = topRowRef.current?.scrollHeight ?? 0;
      scrollTriggerRef.current = Math.max(1, topRowHeight - 1);
      updateScrolledState();
    };

    updateScrollTrigger();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    window.addEventListener("resize", updateScrollTrigger);
    return () => {
      window.removeEventListener("scroll", updateScrolledState);
      window.removeEventListener("resize", updateScrollTrigger);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {showPromoBar && (
        <div className="relative border-b border-[hsl(var(--theme-sand-300))] bg-[hsl(var(--theme-sand-300))] px-8 py-1 text-center text-xs font-semibold tracking-wide text-[hsl(var(--theme-brown-900))]">
          <span>FREE SHIPPING ON ORDERS $100 +</span>
          <Link
            to="/best-sellers"
            className="ml-5 inline-flex items-center gap-1.5 underline decoration-2 underline-offset-2 transition-colors hover:text-[hsl(var(--theme-brown-600))]"
          >
            SHOP NOW
            <Truck size={15} strokeWidth={2} />
          </Link>
          <button
            type="button"
            aria-label="Close free shipping bar"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm leading-none text-[hsl(var(--theme-brown-900))]"
            onClick={() => setShowPromoBar(false)}
          >
            ×
          </button>
        </div>
      )}

      <div className="relative">
      {!isScrolled && (
      <div className="absolute left-[clamp(0.125rem,0.7vw,0.5rem)] top-[clamp(0.5rem,1vw,1rem)] z-[55] hidden flex-col items-center min-[770px]:flex">
            <Link to="/" aria-label="Go to homepage" className="flex w-[clamp(4.25rem,8.3vw,8rem)] flex-col items-center">
              <img
                src={mapleLeafLogo}
                alt="Maple Leaf"
                className="h-[clamp(1.65rem,2.6vw,2.5rem)] w-[clamp(1.65rem,2.6vw,2.5rem)] object-contain"
              />
              <svg
                className="-mt-[clamp(0.95rem,1.35vw,1.25rem)] h-[clamp(1.1rem,1.8vw,1.75rem)] w-[clamp(4.25rem,8.3vw,8rem)] overflow-visible"
                viewBox="0 0 128 32"
                aria-label="Made in Canada"
              >
                <defs>
                  <path id="madeInCanadaArc" d="M 8 20 A 56 16 0 0 0 120 20" />
                </defs>
                <text
                  fill="hsl(var(--theme-brown-700))"
                  fontFamily="Quicksand, Arial, Helvetica, sans-serif"
                  style={{ fontSize: "clamp(0.5rem,0.8vw,0.75rem)" }}
                  fontWeight="700"
                  letterSpacing="0.4"
                >
                  <textPath href="#madeInCanadaArc" startOffset="50%" textAnchor="middle">
                    Made in Canada
                  </textPath>
                </text>
              </svg>
            </Link>

            <Link to="/" aria-label="Go to homepage" className="mt-[clamp(0.2rem,0.7vw,0.75rem)] flex w-[clamp(4.25rem,8.3vw,8rem)] flex-col items-center">
              <img
                src={handmadeLogo}
                alt="Handmade"
                className="h-[clamp(1.65rem,2.6vw,2.5rem)] w-[clamp(1.65rem,2.6vw,2.5rem)] object-contain"
              />
              <svg
                className="-mt-[clamp(0.7rem,1.1vw,1rem)] h-[clamp(1.1rem,1.8vw,1.75rem)] w-[clamp(4.25rem,8.3vw,8rem)] overflow-visible"
                viewBox="0 0 128 32"
                aria-label="Handmade"
              >
                <defs>
                  <path id="madeInCanadaArc2" d="M 8 20 A 56 16 0 0 0 120 20" />
                </defs>
                <text
                  fill="hsl(var(--theme-brown-700))"
                  fontFamily="Quicksand, Arial, Helvetica, sans-serif"
                  style={{ fontSize: "clamp(0.5rem,0.8vw,0.75rem)" }}
                  fontWeight="700"
                  letterSpacing="0.4"
                >
                  <textPath href="#madeInCanadaArc2" startOffset="50%" textAnchor="middle">
                    Handmade
                  </textPath>
                </text>
              </svg>
            </Link>
          </div>
      )}

      <header>
        <div ref={topRowRef} className="relative bg-white">
          {!isScrolled && (
            <div className="absolute right-3 top-3 z-[60] hidden min-[1350px]:block">
              <UserAccountMenu />
            </div>
          )}

          <div className="mx-auto flex max-w-6xl items-start px-3 pt-[5px] pb-2">
            <div className="w-[clamp(0rem,18vw,18rem)] shrink-0 overflow-visible pt-[clamp(0rem,1.8vw,2.5rem)] pl-[clamp(3rem,4.7vw,4.5rem)] max-[770px]:hidden">
              <div className="ml-auto w-[clamp(0rem,calc(15vw-2.4rem),14.25rem)] overflow-visible">
                <ProductSearch placeholder="Search" />
              </div>
            </div>

            <div className="flex flex-1 justify-center">
              <Link to="/" aria-label="Go to homepage">
                <Brand variant="stacked" />
              </Link>
            </div>

            <div className="w-[clamp(0rem,18vw,18rem)] shrink-0 max-[770px]:w-0" />
          </div>
        </div>
      </header>

      </div>

      {/* Row 2: Sticky nav */}
      <div className="sticky top-0 z-50 border-b border-[hsl(var(--theme-sand-300))] bg-white">
        <div className="relative flex items-center px-3 py-0.5">
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-full p-2.5 text-[hsl(var(--theme-brown-900))] min-[1350px]:hidden"
          >
            <Menu className="h-6 w-6" strokeWidth={2.5} />
          </button>

          <div className="hidden w-[clamp(0rem,20vw,20rem)] shrink-0 overflow-visible min-[1350px]:block">
            <div className="flex items-center gap-3 pl-[clamp(0.5rem,2vw,2.5rem)]">
              <div
                className={[
                  isScrolled ? "visible" : "invisible pointer-events-none",
                ].join(" ")}
              >
                <Link to="/" aria-label="Go to homepage">
                  <Brand variant="icon" />
                </Link>
              </div>

              <div
                className={[
                  "flex items-end",
                  isScrolled ? "visible" : "invisible pointer-events-none",
                ].join(" ")}
              >
                <button
                  className="mr-2 p-1 text-[hsl(var(--theme-green-700))]"
                  type="button"
                  aria-label="Toggle search"
                  onClick={() => setStickySearchOpen((prev) => !prev)}
                >
                  <Search className="h-5 w-5" />
                </button>

                <div className={`relative w-[clamp(9rem,12vw,12rem)] transition-opacity duration-200 ${stickySearchOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                  <ProductSearch placeholder="Search" />
                </div>
              </div>
            </div>
          </div>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-[clamp(0.9rem,2vw,3rem)] whitespace-nowrap text-[clamp(0.72rem,1.02vw,1.125rem)] font-bold text-[hsl(var(--theme-brown-900))] min-[1350px]:flex">
            <Link className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 hover:after:scale-x-100" to="/">Home</Link>
            <Link className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 hover:after:scale-x-100" to="/best-sellers">Best Sellers</Link>
            <NavDropdown label="Embroidery" menuId="embroidery-menu" items={EMBROIDERY_COLLECTIONS} />
            <NavDropdown label="Printing" menuId="printing-menu" items={PRINTING_COLLECTIONS} />
            <NavDropdown label="Services" menuId="services-menu" items={SERVICE_COLLECTIONS} />
            <Link className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 hover:after:scale-x-100" to="/gallery">Gallery</Link>
            <Link className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 hover:after:scale-x-100" to="/clothing">Clothing</Link>
            <Link className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 hover:after:scale-x-100" to="/about">About Us</Link>
            <Link className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 hover:after:scale-x-100" to="/reviews">Reviews</Link>
          </nav>

          <div className="ml-auto flex shrink-0 items-center justify-end gap-3 min-[1350px]:w-32">
            <div className={isScrolled ? "" : "min-[1350px]:invisible min-[1350px]:pointer-events-none"}>
              <UserAccountMenu />
            </div>
            <button
              className="group relative rounded-full bg-[hsl(var(--theme-kids-bg))] p-2.5 text-[hsl(var(--theme-isa-green))]"
              type="button"
              aria-label={`Open cart${
                totalQuantity
                  ? ` with ${totalQuantity} ${totalQuantity === 1 ? "item" : "items"}`
                  : ""
              }`}
              onClick={openCart}
            >
              <svg
                className="pointer-events-none absolute -inset-1 -rotate-90"
                viewBox="0 0 40 40"
                aria-hidden="true"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="17"
                  fill="none"
                  stroke="hsl(var(--theme-isa-green))"
                  strokeWidth="2"
                  className="[stroke-dasharray:106.8] [stroke-dashoffset:106.8] transition-[stroke-dashoffset] duration-300 ease-out group-hover:[stroke-dashoffset:0]"
                />
              </svg>
              <ShoppingCart className="h-6 w-6" strokeWidth={3} />
              {totalQuantity > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#711f3d] px-1 text-[0.65rem] font-bold leading-none text-white ring-2 ring-white">
                  {totalQuantity > 99 ? "99+" : totalQuantity}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[110] min-[1350px]:hidden" role="dialog" aria-modal="true" aria-label="Site navigation">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-black/45"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(90vw,25rem)] flex-col overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Brand variant="icon" />
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full bg-[hsl(var(--theme-kids-bg))] p-2.5 text-[hsl(var(--theme-brown-900))]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <ProductSearch className="mt-6" autoFocus onNavigate={() => setMobileMenuOpen(false)} />

            <nav className="mt-7 space-y-7 text-[hsl(var(--theme-brown-900))]">
              <div className="grid gap-1">
                {[
                  ["Home", "/"],
                  ["Best Sellers", "/best-sellers"],
                  ["Gallery", "/gallery"],
                  ["Clothing", "/clothing"],
                  ["About Us", "/about"],
                  ["Reviews", "/reviews"],
                ].map(([label, path]) => (
                  <Link key={path} to={path} onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-3 py-2.5 text-lg font-bold hover:bg-[hsl(var(--theme-sage-100)/0.4)]">{label}</Link>
                ))}
              </div>

              {[
                ["Embroidery", EMBROIDERY_COLLECTIONS],
                ["Printing", PRINTING_COLLECTIONS],
                ["Services", SERVICE_COLLECTIONS],
              ].map(([heading, items]) => (
                <section key={heading as string}>
                  <h2 className="px-3 text-xs font-black uppercase tracking-[0.18em] text-[hsl(var(--theme-brown-600))]">{heading as string}</h2>
                  <div className="mt-2 grid gap-1 border-l-2 border-[hsl(var(--theme-sage-200))] pl-2">
                    {(items as typeof EMBROIDERY_COLLECTIONS).map((item) => (
                      <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-3 py-2 text-base font-semibold hover:bg-[hsl(var(--theme-sage-100)/0.4)]">{item.label}</Link>
                    ))}
                  </div>
                </section>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
