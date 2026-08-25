import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import embroideryVideo from "../../assets/gifs/embroidery_edit.web.mp4";
import embroideryPoster from "../../assets/gifs/embroidery_edit.poster.webp";
import printingVideo from "../../assets/gifs/printing_edit.web.mp4";
import printingPoster from "../../assets/gifs/printing_edit.poster.webp";
import embroideryHoodie from "../../assets/brand/goosebumps_embroidered_hoodie.webp";
import attackOnTitanShirt from "../../assets/brand/aot_tshirt_print.png";
import itachiHoodie from "../../assets/brand/itachi_hoodie_print.webp";
import precisionIcon from "../../assets/brand/precision-icon.png";
import promoteIcon from "../../assets/brand/promote-icon.png";
import stitchedWithStyleIcon from "../../assets/brand/stitched-with-style-icon.png";
import threadAndButterOutline from "../../assets/brand/threadnbutterLogoOutlineIMG.svg";

const SERVICE_HIGHLIGHTS = [
  {
    title: "Printed With Precision",
    description:
      "Bring bold artwork to tees and apparel with clean colour, balanced placement, and a finish designed for pieces you will want to keep wearing.",
    icon: precisionIcon,
  },
  {
    title: "Stitched With Style",
    description:
      "Give names, logos, and original artwork a timeless, textured finish across shirts, jackets, hats, babywear, and more.",
    icon: stitchedWithStyleIcon,
  },
  {
    title: "Products That Promote",
    description:
      "Create custom pieces for businesses, teams, events, gifts, and everyday style—made to help your message get noticed and remembered.",
    icon: promoteIcon,
  },
] as const;

function useScrollReveal() {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -24% 0px",
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { elementRef, isVisible };
}

function HeroVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePlayback = (visible: boolean) => {
      if (reducedMotion.matches || !visible) {
        video.pause();
        return;
      }
      void video.play().catch(() => {
        // The poster remains visible when a browser blocks autoplay.
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => updatePlayback(entry.isIntersecting),
      { threshold: 0.15 },
    );
    const handleMotionChange = () => updatePlayback(true);

    observer.observe(video);
    reducedMotion.addEventListener("change", handleMotionChange);
    updatePlayback(true);

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      aria-hidden="true"
    />
  );
}

export default function HomePage() {
  const conceptReveal = useScrollReveal();
  const embroideryReveal = useScrollReveal();
  const printingReveal = useScrollReveal();

  return (
    <main className="bg-[hsl(var(--theme-kids-bg))]">
      <section
        aria-label="Thread & Butter embroidery and printing showcase"
        className="grid h-[30vw] max-h-[37.5rem] w-full grid-cols-[auto_minmax(0,1fr)_auto] items-stretch overflow-hidden bg-[hsl(var(--theme-brown-footer))]"
      >
        <div className="relative w-[20vw] max-w-[28.125rem] shrink-0 bg-black">
          <HeroVideo
            src={embroideryVideo}
            poster={embroideryPoster}
            className="absolute left-0 top-1/2 block aspect-[9/16] h-auto w-full -translate-y-1/2 object-contain object-center"
          />
        </div>

        <div className="relative z-10 flex min-w-0 items-center justify-center bg-[hsl(var(--theme-brown-footer))] px-3 py-3 text-center sm:px-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-[calc(100%_-_2px)] w-[clamp(1rem,3vw,2.75rem)]"
            style={{
              background:
                "linear-gradient(to left, hsl(var(--theme-brown-footer)) 0%, hsl(var(--theme-brown-footer) / 0.94) 12%, hsl(var(--theme-brown-footer) / 0.52) 42%, hsl(var(--theme-brown-footer) / 0.14) 76%, transparent 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-[calc(100%_-_2px)] w-[clamp(1rem,3vw,2.75rem)]"
            style={{
              background:
                "linear-gradient(to right, hsl(var(--theme-brown-footer)) 0%, hsl(var(--theme-brown-footer) / 0.94) 12%, hsl(var(--theme-brown-footer) / 0.52) 42%, hsl(var(--theme-brown-footer) / 0.14) 76%, transparent 100%)",
            }}
          />

          <div className="relative z-10 flex min-w-0 flex-col items-center justify-center">
            <h1 className="font-aoki text-[clamp(1.8rem,6.35vw,7.25rem)] leading-[0.94] tracking-[-0.04em] text-[hsl(var(--theme-kids-bg))]">
              <span className="block">Thread</span>
              <span className="block">&amp;</span>
              <span className="block">Butter</span>
            </h1>
            <p className="mt-6 text-[clamp(0.135rem,1.75vw,1.75rem)] font-semibold tracking-[0.06em] text-[hsl(var(--theme-kids-bg)/0.9)] sm:mt-9">
              Your Style Is Our Bread &amp; Butter.
            </p>
            <Link
              to="/about#contact-form"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--theme-kids-bg))] px-[clamp(0.75rem,1.5vw,1.5rem)] py-[clamp(0.4rem,0.7vw,0.7rem)] text-[clamp(0.55rem,0.9vw,0.95rem)] font-bold text-[hsl(var(--theme-brown-footer))] transition-transform hover:-translate-y-0.5 sm:mt-5"
            >
              Connect with an Embroidery Pro
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="relative w-[20vw] max-w-[28.125rem] shrink-0 bg-black">
          <HeroVideo
            src={printingVideo}
            poster={printingPoster}
            className="absolute left-0 top-1/2 block aspect-[9/16] h-auto w-full -translate-y-1/2 object-contain object-center"
          />
        </div>
      </section>

      <section
        ref={conceptReveal.elementRef}
        aria-labelledby="home-concept-title"
        className="bg-[hsl(var(--theme-kids-bg))] px-6 py-16 sm:px-10 sm:py-20"
      >
        <div className="mx-auto max-w-[82rem]">
          <h2
            id="home-concept-title"
            className="mx-auto max-w-5xl text-center font-aoki text-[clamp(2rem,4.2vw,4.25rem)] leading-[1.05] tracking-[-0.025em] text-[hsl(var(--theme-brown-900))]"
          >
            From <strong className="font-bold">Concept to Creation:</strong>{" "}
            <span className="font-light">Stand Out with Custom Solutions.</span>
          </h2>

          <div className="mx-auto mt-8 flex max-w-3xl items-center gap-4 sm:mt-10 sm:gap-6">
            <span className="h-px flex-1 bg-[hsl(var(--theme-brown-700)/0.45)]" />
            <img
              src={threadAndButterOutline}
              alt=""
              className="h-12 w-12 shrink-0 object-contain sm:h-16 sm:w-16"
            />
            <span className="h-px flex-1 bg-[hsl(var(--theme-brown-700)/0.45)]" />
          </div>

          <div className="mt-16 grid gap-14 md:grid-cols-3 md:gap-8">
            {SERVICE_HIGHLIGHTS.map((highlight, index) => (
              <article
                key={highlight.title}
                className={[
                  "relative flex min-h-[18rem] flex-col items-center rounded-3xl bg-white px-7 pb-9 pt-20 text-center shadow-[0_18px_48px_rgba(50,31,21,0.08)] transition-[transform,opacity] duration-1000 ease-out",
                  conceptReveal.isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-24 opacity-0",
                ].join(" ")}
                style={{
                  transitionDelay: conceptReveal.isVisible ? `${index * 140}ms` : "0ms",
                }}
              >
                <div className="absolute -top-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-[hsl(var(--theme-brown-footer))] p-3 shadow-lg sm:h-24 sm:w-24">
                  <img
                    src={highlight.icon}
                    alt=""
                    className="h-full w-full object-contain brightness-0 invert"
                  />
                </div>
                <h3 className="font-aoki text-2xl font-bold leading-tight text-[hsl(var(--theme-brown-900))] sm:text-3xl">
                  {highlight.title}
                </h3>
                <p className="mt-5 max-w-sm text-base font-medium leading-7 text-[hsl(var(--theme-brown-700))]">
                  {highlight.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={embroideryReveal.elementRef}
        aria-labelledby="home-embroidery-title"
        className="grid min-h-[42rem] overflow-hidden bg-[hsl(var(--theme-sand-300)/0.34)] md:grid-cols-2"
      >
        <div className="relative flex min-h-[30rem] items-center justify-center overflow-hidden px-6 py-10 md:min-h-[42rem] md:px-10 md:py-12">
          <div
            className={[
              "flex h-full w-full items-center justify-center transition-[transform,opacity] duration-1000 ease-out",
              embroideryReveal.isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-32 opacity-0",
            ].join(" ")}
          >
            <img
              src={embroideryHoodie}
              alt="Black Goosebumps hoodie with a detailed embroidered chest design"
              className="max-h-[44rem] w-[112%] max-w-[44rem] object-contain object-center drop-shadow-[0_28px_34px_rgba(49,27,18,0.2)]"
            />
          </div>
        </div>

        <div className="flex items-center px-8 py-16 sm:px-14 md:px-[clamp(3rem,7vw,8rem)] md:py-24">
          <div className="max-w-xl">
            <p className="mb-4 text-base font-bold uppercase tracking-[0.18em] text-[hsl(var(--theme-brown-600))] sm:text-lg">
              Custom embroidery
            </p>
            <h2
              id="home-embroidery-title"
              className="font-aoki text-[clamp(3rem,6vw,6.5rem)] leading-[0.92] tracking-[-0.035em] text-[hsl(var(--theme-brown-900))]"
            >
              Your idea, told in thread.
            </h2>
            <p className="mt-7 max-w-lg text-base font-medium leading-8 text-[hsl(var(--theme-brown-700))] sm:text-lg">
              From a name that matters to a logo that needs to last, we turn your artwork into
              dimensional threadwork with texture, character, and a polished finish. Choose a
              ready-made design or bring your own—we’ll help shape the artwork, placement, size,
              and garment so every stitch feels intentional.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/embroidery/anime"
                className="rounded-full bg-[hsl(var(--theme-brown-700))] px-6 py-3 text-sm font-bold text-white transition hover:bg-[hsl(var(--theme-brown-900))]"
              >
                Explore embroidery
              </Link>
              <Link
                to="/embroidery/custom-designs"
                className="rounded-full border-2 border-[hsl(var(--theme-brown-700))] px-6 py-3 text-sm font-bold text-[hsl(var(--theme-brown-700))] transition hover:bg-[hsl(var(--theme-brown-700))] hover:text-white"
              >
                Start a custom design
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={printingReveal.elementRef}
        aria-labelledby="home-printing-title"
        className="grid min-h-[44rem] overflow-hidden bg-[hsl(var(--theme-sage-100)/0.3)] md:grid-cols-2"
      >
        <div className="relative z-20 flex items-center px-8 py-16 sm:px-14 md:px-[clamp(3rem,7vw,8rem)] md:py-24">
          <div className="max-w-xl">
            <p className="mb-4 text-base font-bold uppercase tracking-[0.18em] text-[hsl(var(--theme-green-700))] sm:text-lg">
              Custom printing
            </p>
            <h2
              id="home-printing-title"
              className="font-aoki text-[clamp(3rem,6vw,6.5rem)] leading-[0.92] tracking-[-0.035em] text-[hsl(var(--theme-green-900))]"
            >
              Big ideas. Bold prints.
            </h2>
            <p className="mt-7 max-w-lg text-base font-medium leading-8 text-[hsl(var(--theme-green-900)/0.82)] sm:text-lg">
              From statement graphics and full-colour artwork to team pieces, event apparel, and
              one-of-one ideas, we print with placement and proportion in mind. Start with a
              popular design or upload your own, choose your garment and quantity, and we’ll review
              every detail before sending a clear estimate.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/printing/popular-designs"
                className="rounded-full bg-[hsl(var(--theme-green-900))] px-6 py-3 text-sm font-bold text-white transition hover:bg-[hsl(var(--theme-green-700))]"
              >
                Explore printing
              </Link>
              <Link
                to="/printing/custom"
                className="rounded-full border-2 border-[hsl(var(--theme-green-900))] px-6 py-3 text-sm font-bold text-[hsl(var(--theme-green-900))] transition hover:bg-[hsl(var(--theme-green-900))] hover:text-white"
              >
                Start a custom design
              </Link>
            </div>
          </div>
        </div>

        <div className="relative min-h-[32rem] overflow-visible px-4 py-10 md:-ml-16 md:min-h-[44rem] md:w-[calc(100%+4rem)] md:px-8">
          <img
            src={attackOnTitanShirt}
            alt="Green Attack on Titan printed T-shirt"
            className={[
              "absolute bottom-[8%] left-[-5%] z-10 w-[61%] max-w-[34rem] object-contain drop-shadow-[0_28px_34px_rgba(28,63,42,0.2)] transition-[transform,opacity] duration-1000 ease-out",
              printingReveal.isVisible
                ? "translate-y-0 -rotate-12 opacity-100"
                : "translate-y-40 -rotate-12 opacity-0",
            ].join(" ")}
            style={{ transitionDelay: printingReveal.isVisible ? "90ms" : "0ms" }}
          />
          <img
            src={itachiHoodie}
            alt="White Itachi hoodie with a large printed back design"
            className={[
              "absolute bottom-[-8%] right-[-27%] z-20 w-[124%] max-w-[66rem] object-contain drop-shadow-[0_30px_38px_rgba(28,63,42,0.24)] transition-[transform,opacity] duration-1000 ease-out",
              printingReveal.isVisible
                ? "translate-y-0 rotate-12 opacity-100"
                : "translate-y-48 rotate-12 opacity-0",
            ].join(" ")}
            style={{ transitionDelay: printingReveal.isVisible ? "290ms" : "0ms" }}
          />
        </div>
      </section>
    </main>
  );
}
