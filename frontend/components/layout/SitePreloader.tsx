"use client";

import { useEffect, useState } from "react";

export default function SitePreloader() {
  const [isVisible, setIsVisible] = useState(true);

  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const leaveTimer = window.setTimeout(() => {
      setIsLeaving(true);
    }, 3000);

    const removeTimer = window.setTimeout(() => {
      setIsVisible(false);

      document.body.style.overflow = previousOverflow;
    }, 3800);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);

      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`
        fixed
        inset-0
        z-[9999]
        flex
        bg-[#10100f]
        text-[#f4f1eb]
        transition-all
        duration-700
        ease-[cubic-bezier(0.76,0,0.24,1)]

        ${
          isLeaving
            ? "-translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        }
      `}
    >
      <div className="flex w-full flex-col justify-center">
        <div className="px-6 md:px-10 lg:px-16">
          <div className="flex items-end justify-between gap-8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">
              Art · Memory · Time
            </p>

            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Loading
            </p>
          </div>

          <div className="mt-8 overflow-hidden">
            <div className="animate-[eamora-title_1.8s_cubic-bezier(0.76,0,0.24,1)_both]">
              <p
                className="
                  flex
                  items-center
                  justify-between
                  font-serif
                  text-[16vw]
                  font-light
                  leading-[0.8]
                  tracking-[0.05em]

                  md:text-[14vw]
                  lg:text-[12vw]
                "
              >
                {"EAMORA".split("").map((letter, index) => (
                  <span
                    key={`${letter}-${index}`}
                    className={
                      index === 0 ? "text-[#a62a27]" : "text-[#f4f1eb]"
                    }
                  >
                    {letter}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-12 h-px w-full overflow-hidden bg-white/15">
          <div
            className="
              absolute
              inset-y-0
              left-0
              w-full
              origin-left
              animate-[eamora-line_2.7s_cubic-bezier(0.65,0,0.35,1)_both]
              bg-[#a62a27]
            "
          />
        </div>

        <div className="mt-5 flex justify-between gap-8 px-6 md:px-10 lg:px-16">
          <p className="text-[9px] uppercase tracking-[0.35em] text-white/35">
            Eternal A Moment
          </p>

          <p className="text-right text-[9px] uppercase tracking-[0.35em] text-white/35">
            Once Remembered Again
          </p>
        </div>
      </div>
    </div>
  );
}
