"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SitePreloader() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [isVisible, setIsVisible] = useState(true);

  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (!isHomePage) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    setIsVisible(true);
    setIsLeaving(false);

    document.body.style.overflow = "hidden";

    const leaveAfter = 3400;
    const removeAfter = 4100;

    const leaveTimer = window.setTimeout(() => {
      setIsLeaving(true);
    }, leaveAfter);

    const removeTimer = window.setTimeout(() => {
      setIsVisible(false);

      document.body.style.overflow = previousOverflow;
    }, removeAfter);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);

      document.body.style.overflow = previousOverflow;
    };
  }, [pathname, isHomePage]);

  if (!isHomePage) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  const logoAnimation = isHomePage
    ? "eamora_mist_logo 2.3s cubic-bezier(0.22,1,0.36,1) 0.15s forwards"
    : "eamora_mist_logo 0.75s ease-out forwards";

  return (
    <div
      role="status"
      aria-label="Loading EAMORA"
      className={`
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        overflow-hidden
        bg-[#faf9f6]
        transition-all
        ease-[cubic-bezier(0.76,0,0.24,1)]

        ${isHomePage ? "duration-700" : "duration-300"}

        ${isLeaving ? "scale-[1.015] opacity-0" : "scale-100 opacity-100"}
      `}
    >
      <div
        className="
          w-full
          px-6
          sm:px-10
          md:px-16
        "
      >
        <div
          className={`
            mx-auto
            w-full
            transition-[max-width]
            duration-500

            ${isHomePage ? "max-w-[1000px]" : "max-w-[360px]"}
          `}
        >
          <div
            className="
              eamora-preloader-motion
              opacity-0
            "
            style={{
              animation: logoAnimation,
            }}
          >
            <div
              className="
                eamora-preloader-motion
                relative
              "
              style={
                isHomePage
                  ? {
                      animation:
                        "eamora_logo_breathe 2.2s ease-in-out 2.35s infinite alternate",
                    }
                  : undefined
              }
            >
              <Image
                src="/images/logo/eamora-preloader.png"
                alt="EAMORA"
                width={2048}
                height={332}
                priority
                sizes={
                  isHomePage
                    ? "(max-width: 640px) 90vw, (max-width: 1024px) 84vw, 1000px"
                    : "(max-width: 640px) 70vw, 360px"
                }
                className="
                  block
                  h-auto
                  w-full
                  select-none
                "
              />
            </div>
          </div>

          {isHomePage && (
            <div
              className="
                eamora-preloader-motion
                mt-8
                flex
                items-center
                justify-center
                gap-3
                opacity-0
                text-[9px]
                uppercase
                tracking-[0.34em]
                text-black/40

                sm:text-[10px]
              "
              style={{
                animation: "eamora_loading_text 1s ease 1.65s forwards",
              }}
            >
              <span>EAMORA</span>

              <span
                aria-hidden="true"
                className="
                  eamora-preloader-motion
                  h-1
                  w-1
                  rounded-full
                  bg-[#9b1c1c]
                "
                style={{
                  animation: "eamora_loading_pulse 1.1s ease-in-out infinite",
                }}
              />

              <span>Loading</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
