import { useEffect, useRef, useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import Brand from "./Brand";
import mapleLeafLogo from "../assets/brand/Maple_Leaf.svg";
import handmadeLogo from "../assets/brand/handmade.svg";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [stickySearchOpen, setStickySearchOpen] = useState(false);
  const [showStickySearchPlaceholder, setShowStickySearchPlaceholder] = useState(false);
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
    if (!isScrolled) {
      setStickySearchOpen(false);
      setShowStickySearchPlaceholder(false);
    }
  }, [isScrolled]);

  useEffect(() => {
    if (!stickySearchOpen) {
      setShowStickySearchPlaceholder(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowStickySearchPlaceholder(true);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [stickySearchOpen]);

  return (
    <>
      {showPromoBar && (
        <div className="relative border-b border-[hsl(var(--theme-sand-300))] bg-[hsl(var(--theme-sand-300))] px-8 py-1 text-center text-xs font-semibold tracking-wide text-[hsl(var(--theme-brown-900))]">
          <span>FREE SHIPPING ON ORDERS $100 +</span>
          <Link
            to="/best-sellers"
            className="ml-5 underline decoration-2 underline-offset-2 transition-colors hover:text-[hsl(var(--theme-brown-600))]"
          >
            SHOP NOW
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

          <div className="mx-auto flex max-w-6xl items-start px-3 pt-[5px] pb-2">
            <div className="w-[clamp(0rem,18vw,18rem)] shrink-0 overflow-hidden pt-[clamp(0rem,1.8vw,2.5rem)] pl-[clamp(3rem,4.7vw,4.5rem)] max-[770px]:w-0 max-[770px]:overflow-hidden">
              <div className="ml-auto w-[clamp(0rem,calc(15vw-2.4rem),14.25rem)] overflow-hidden">
              <div className="flex items-center gap-[clamp(0.25rem,0.6vw,0.5rem)] border-b border-[hsl(var(--theme-sage-200))] pb-1">
                <Search className="h-[clamp(0.875rem,1.2vw,1.25rem)] w-[clamp(0.875rem,1.2vw,1.25rem)] text-[hsl(var(--theme-green-700))]" />
                <input
                  className="w-full bg-transparent text-[clamp(0.75rem,0.9vw,0.875rem)] text-[hsl(var(--theme-sage-300))] placeholder:text-[hsl(var(--theme-sage-300))] outline-none"
                  type="text"
                  placeholder="Search"
                  aria-label="Search"
                />
              </div>
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
        <div className="flex items-center px-3 py-0.5">
          <div className="w-[clamp(0rem,20vw,20rem)] shrink-0 overflow-hidden">
            <div className="flex items-center gap-3 pl-[clamp(0.5rem,2vw,2.5rem)] max-[1366px]:hidden">
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

                <div className="relative w-[clamp(9rem,12vw,12rem)] overflow-hidden">
                  <input
                    className={[
                      "w-full bg-transparent pb-1 text-[clamp(0.75rem,0.9vw,0.875rem)] text-[hsl(var(--theme-sage-300))] placeholder:text-[hsl(var(--theme-sage-300))] outline-none transition-opacity duration-200",
                      stickySearchOpen ? "opacity-100" : "opacity-0 pointer-events-none",
                    ].join(" ")}
                    type="text"
                    placeholder={showStickySearchPlaceholder ? "Search" : ""}
                    aria-label="Sticky search"
                  />
                  <span
                    className={[
                      "absolute bottom-0 left-0 h-[2px] w-full origin-left bg-[hsl(var(--theme-sage-200))] transition-transform duration-300",
                      stickySearchOpen ? "scale-x-100" : "scale-x-0",
                    ].join(" ")}
                  />
                </div>
              </div>
            </div>
          </div>

          <nav className="mx-auto flex flex-1 items-center justify-center gap-[clamp(0.75rem,1.8vw,2.75rem)] text-[clamp(0.72rem,1.02vw,1.125rem)] font-bold text-[hsl(var(--theme-brown-900))]">
            <Link className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 hover:after:scale-x-100" to="/best-sellers">Best Sellers</Link>
            <Link className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 hover:after:scale-x-100" to="/ramadan-decor">Ramadan Decor</Link>
            <Link className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 hover:after:scale-x-100" to="/wall-art">Wall Art</Link>
            <Link className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 hover:after:scale-x-100" to="/home-decor">Home Decor</Link>
            <Link className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 hover:after:scale-x-100" to="/kids">Kids</Link>
            <Link className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 hover:after:scale-x-100" to="/business-events">Business/Events</Link>
            <Link className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 hover:after:scale-x-100" to="/faq">FAQ</Link>
          </nav>

          <div className="flex w-24 shrink-0 justify-end">
            <button
              className="group relative rounded-full p-2.5 text-[hsl(var(--theme-isa-green))]"
              type="button"
              aria-label="Open cart"
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
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
