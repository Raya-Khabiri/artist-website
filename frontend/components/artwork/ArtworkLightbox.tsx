"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type LightboxImage = {
  src: string;
  alt: string;
};

type ArtworkLightboxProps = {
  images: LightboxImage[];
};

export default function ArtworkLightbox({ images }: ArtworkLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowRight" && activeIndex !== null) {
        setActiveIndex((activeIndex + 1) % images.length);
      }

      if (event.key === "ArrowLeft" && activeIndex !== null) {
        setActiveIndex((activeIndex - 1 + images.length) % images.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, images.length, isOpen]);

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setActiveIndex(0)}
          className="
            group
            relative
            block
            h-[55svh]
            min-h-[360px]
            max-h-[560px]
            w-full
            cursor-zoom-in
            overflow-hidden
            bg-black/5

            sm:h-[60svh]

            lg:h-[calc(100svh-16rem)]
            lg:min-h-[420px]
            lg:max-h-[620px]
          "
          aria-label="Open artwork in full screen"
        >
          <Image
            src={images[0].src}
            alt={images[0].alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="
              object-contain
              transition-transform
              duration-700
              group-hover:scale-[1.015]
            "
          />

          <span className="absolute bottom-5 right-5 bg-[#f4f1eb]/90 px-4 py-3 text-[9px] uppercase tracking-[0.2em] text-black/65 backdrop-blur">
            View full screen
          </span>
        </button>

        {images.length > 1 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {images.slice(1).map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index + 1)}
                className="relative aspect-square cursor-zoom-in overflow-hidden bg-black/5"
                aria-label={`Open image ${index + 2} in full screen`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-contain transition-transform duration-500 hover:scale-[1.025]"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen artwork viewer"
          className="fixed inset-0 z-[10000] bg-[#0d0d0c] text-white"
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute right-5 top-5 z-20 border border-white/20 bg-black/30 px-5 py-3 text-[10px] uppercase tracking-[0.22em] backdrop-blur transition hover:border-white/60"
          >
            Close
          </button>

          <div className="relative h-full w-full p-6 md:p-12">
            <Image
              src={images[activeIndex].src}
              alt={images[activeIndex].alt}
              fill
              sizes="100vw"
              className="object-contain p-6 md:p-12"
              priority
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setActiveIndex(
                    (activeIndex - 1 + images.length) % images.length,
                  )
                }
                className="absolute left-5 top-1/2 z-20 -translate-y-1/2 border border-white/20 bg-black/30 px-4 py-5 text-xl backdrop-blur transition hover:border-white/60"
                aria-label="Previous image"
              >
                ←
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveIndex((activeIndex + 1) % images.length)
                }
                className="absolute right-5 top-1/2 z-20 -translate-y-1/2 border border-white/20 bg-black/30 px-4 py-5 text-xl backdrop-blur transition hover:border-white/60"
                aria-label="Next image"
              >
                →
              </button>

              <p className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 text-[10px] tracking-[0.22em] text-white/60">
                {activeIndex + 1} / {images.length}
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
