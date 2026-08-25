"use client";

import { useState } from "react";

type ProcessVideoProps = {
  title: string;
  videoUrl: string;
  posterUrl?: string;
};

export default function ProcessVideo({
  title,
  videoUrl,
  posterUrl,
}: ProcessVideoProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section
        className="
          overflow-hidden
          bg-[#faf9f6]
          px-6
          pt-20
          pb-8

          sm:px-10
          sm:pt-20
          sm:pb-10

          md:px-14

          lg:px-0
          lg:pt-24
          lg:pb-12
        "
      >
        <div className="w-full">
          <p
            className="
            mb-4
            text-[10px]
            font-medium
            uppercase
            tracking-[0.28em]
            text-[#9b1c1c]

            lg:ml-[4vw]
            xl:ml-[4.5vw]
            2xl:ml-[5vw]
          "
          >
            Behind the canvas
          </p>
          <h2
            className="
              mb-8
              font-serif
              text-[32px]
              font-light
              leading-none
              text-[#171717]

              sm:text-[38px]

              lg:ml-[4vw]
              lg:text-[44px]

              xl:ml-[4.5vw]

              2xl:ml-[5vw]
            "
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label={`Play ${title} with sound`}
            className="
              group
              relative
              mx-auto
              block
              w-full
              max-w-[1000px]
              overflow-hidden
            "
          >
            <video
              src={videoUrl}
              poster={posterUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="
                aspect-video
                w-full
                object-cover
              "
            />

            <span
              className="
                absolute
                inset-0
                grid
                place-items-center
                bg-black/10
                transition
                group-hover:bg-black/20
              "
            >
              <span
                className="
                  grid
                  size-16
                  place-items-center
                  rounded-full
                  bg-white/85
                  text-xl
                  text-black
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
                aria-hidden="true"
              >
                ▶
              </span>
            </span>
          </button>
        </div>
      </section>

      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            grid
            place-items-center
            bg-black/90
            p-4
          "
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="
              absolute
              right-6
              top-6
              z-10
              text-3xl
              text-white
            "
            aria-label="Close video"
          >
            ×
          </button>

          <video
            src={videoUrl}
            poster={posterUrl}
            autoPlay
            controls
            className="
              max-h-[85vh]
              w-full
              max-w-6xl
            "
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
