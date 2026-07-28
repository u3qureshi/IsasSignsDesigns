import { useEffect, useRef } from "react";
import embroideryVideo from "../../assets/gifs/embroidery_edit.web.mp4";
import embroideryPoster from "../../assets/gifs/embroidery_edit.poster.webp";
import printingVideo from "../../assets/gifs/printing_edit.web.mp4";
import printingPoster from "../../assets/gifs/printing_edit.poster.webp";

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
  return (
    <main className="bg-[hsl(var(--theme-kids-bg))]">
      <section
        aria-label="Thread & Butter embroidery and printing showcase"
        className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-stretch overflow-hidden bg-[hsl(var(--theme-brown-900))]"
      >
        <div className="aspect-[9/16] w-[24vw] max-w-[33.75rem] shrink-0 bg-black">
          <HeroVideo
            src={embroideryVideo}
            poster={embroideryPoster}
            className="block h-full w-full object-contain object-center"
          />
        </div>

        <div className="relative z-10 flex min-w-0 items-center justify-center bg-[hsl(var(--theme-brown-900))] px-3 py-4 text-center before:pointer-events-none before:absolute before:inset-y-0 before:right-full before:w-[clamp(1.5rem,6vw,7rem)] before:bg-gradient-to-l before:from-[hsl(var(--theme-brown-900))] before:to-transparent after:pointer-events-none after:absolute after:inset-y-0 after:left-full after:w-[clamp(1.5rem,6vw,7rem)] after:bg-gradient-to-r after:from-[hsl(var(--theme-brown-900))] after:to-transparent sm:px-8">
          <div className="flex min-w-0 flex-col items-center justify-center">
            <h1 className="font-aoki text-[clamp(2rem,7vw,8rem)] leading-[0.78] tracking-[-0.04em] text-[hsl(var(--theme-kids-bg))]">
              <span className="block">Thread</span>
              <span className="block">&amp;</span>
              <span className="block">Butter</span>
            </h1>
          </div>
        </div>

        <div className="aspect-[9/16] w-[24vw] max-w-[33.75rem] shrink-0 bg-black">
          <HeroVideo
            src={printingVideo}
            poster={printingPoster}
            className="block h-full w-full object-contain object-center"
          />
        </div>
      </section>
    </main>
  );
}
