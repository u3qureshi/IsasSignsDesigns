import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, ShoppingCart } from "lucide-react";
import Brand from "./Brand";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [stickySearchOpen, setStickySearchOpen] = useState(false);
  const [showStickySearchPlaceholder, setShowStickySearchPlaceholder] = useState(false);
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
      <header>
        <div ref={topRowRef} className="bg-white">
          <div className="mx-auto flex max-w-6xl items-start px-3 pt-[5px] pb-0">
            <div className="w-72 shrink-0 pt-10">
              <div className="-ml-24 w-56">
              <div className="flex items-center gap-2 border-b border-[hsl(var(--theme-sage-200))] pb-1">
                <Search className="h-5 w-5 text-[hsl(var(--theme-green-700))]" />
                <input
                  className="w-full bg-transparent text-sm text-[hsl(var(--theme-sage-300))] placeholder:text-[hsl(var(--theme-sage-300))] outline-none"
                  type="text"
                  placeholder="Search"
                  aria-label="Search"
                />
              </div>
              </div>
            </div>

            <div className="flex flex-1 justify-center">
              <Brand variant="stacked" />
            </div>

            <div className="w-72 shrink-0" />
          </div>
        </div>
      </header>

      {/* Row 2: Sticky nav */}
      <div className="sticky top-0 z-50 border-b border-[hsl(var(--theme-sand-300))] bg-white">
        <div className="flex items-center px-3 py-1">
          <div className="w-80 shrink-0">
            <div className="flex items-center gap-3 pl-10">
              <div
                className={[
                  isScrolled ? "visible" : "invisible pointer-events-none",
                ].join(" ")}
              >
                <Brand variant="icon" />
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

                <div className="relative w-48 overflow-hidden">
                  <input
                    className={[
                      "w-48 bg-transparent pb-1 text-sm text-[hsl(var(--theme-sage-300))] placeholder:text-[hsl(var(--theme-sage-300))] outline-none transition-opacity duration-200",
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

          <nav className="mx-auto flex flex-1 items-center justify-center gap-11 text-lg font-bold text-[hsl(var(--theme-brown-900))]">
            <a
              className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 hover:after:scale-x-100"
              href="#sellers"
            >
              Best Sellers
            </a>

            <div className="group relative">
              <button
                className="relative inline-flex items-center gap-1.5 pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 group-hover:after:scale-x-100"
                type="button"
              >
                Ramadan Decor
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 mt-2 min-w-[12rem] rounded-md border border-neutral-200 bg-white p-2 opacity-0 shadow-sm transition group-hover:visible group-hover:opacity-100">
                <a className="block rounded px-3 py-2 text-base hover:bg-neutral-100" href="#ramadan-lanterns">Lanterns</a>
                <a className="block rounded px-3 py-2 text-base hover:bg-neutral-100" href="#ramadan-banners">Banners</a>
                <a className="block rounded px-3 py-2 text-base hover:bg-neutral-100" href="#ramadan-table">Table Decor</a>
              </div>
            </div>

            <div className="group relative">
              <button
                className="relative inline-flex items-center gap-1.5 pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 group-hover:after:scale-x-100"
                type="button"
              >
                Wall Art
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 mt-2 min-w-[12rem] rounded-md border border-neutral-200 bg-white p-2 opacity-0 shadow-sm transition group-hover:visible group-hover:opacity-100">
                <a className="block rounded px-3 py-2 text-base hover:bg-neutral-100" href="#wall-calligraphy">Calligraphy</a>
                <a className="block rounded px-3 py-2 text-base hover:bg-neutral-100" href="#wall-frames">Framed Pieces</a>
                <a className="block rounded px-3 py-2 text-base hover:bg-neutral-100" href="#wall-custom">Custom Orders</a>
              </div>
            </div>

            <div className="group relative">
              <button
                className="relative inline-flex items-center gap-1.5 pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 group-hover:after:scale-x-100"
                type="button"
              >
                Home Decor
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 mt-2 min-w-[12rem] rounded-md border border-neutral-200 bg-white p-2 opacity-0 shadow-sm transition group-hover:visible group-hover:opacity-100">
                <a className="block rounded px-3 py-2 text-base hover:bg-neutral-100" href="#home-shelves">Shelves</a>
                <a className="block rounded px-3 py-2 text-base hover:bg-neutral-100" href="#home-signs">Signs</a>
                <a className="block rounded px-3 py-2 text-base hover:bg-neutral-100" href="#home-gifts">Gifts</a>
              </div>
            </div>

            <div className="group relative">
              <button
                className="relative inline-flex items-center gap-1.5 pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 group-hover:after:scale-x-100"
                type="button"
              >
                Kids
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 mt-2 min-w-[12rem] rounded-md border border-neutral-200 bg-white p-2 opacity-0 shadow-sm transition group-hover:visible group-hover:opacity-100">
                <a className="block rounded px-3 py-2 text-base hover:bg-neutral-100" href="#kids-nameplates">Name Plates</a>
                <a className="block rounded px-3 py-2 text-base hover:bg-neutral-100" href="#kids-room">Room Decor</a>
                <a className="block rounded px-3 py-2 text-base hover:bg-neutral-100" href="#kids-learning">Learning Boards</a>
              </div>
            </div>

            <div className="group relative">
              <button
                className="relative inline-flex items-center gap-1.5 pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 group-hover:after:scale-x-100"
                type="button"
              >
                Business/Events
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 mt-2 min-w-[13rem] rounded-md border border-neutral-200 bg-white p-2 opacity-0 shadow-sm transition group-hover:visible group-hover:opacity-100">
                <a className="block rounded px-3 py-2 text-base hover:bg-neutral-100" href="#events-signage">Event Signage</a>
                <a className="block rounded px-3 py-2 text-base hover:bg-neutral-100" href="#events-backdrops">Backdrops</a>
                <a className="block rounded px-3 py-2 text-base hover:bg-neutral-100" href="#events-branding">Business Branding</a>
              </div>
            </div>

            <a
              className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#4e3b31] after:transition-transform after:duration-300 hover:after:scale-x-100"
              href="#faq"
            >
              FAQ
            </a>
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
