"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Stage = "start" | "docked" | "leaving" | "hidden";

export default function SitePreloader() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [stage, setStage] = useState<Stage>("start");

  useEffect(() => {
    if (!isHomePage) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Timings (ms)
    const dockAt = 120; // start sliding the logo in
    const leaveAt = 3900; // start fading the preloader background out
    const hideAt = 4700; // fully remove the preloader

    const dockTimer = window.setTimeout(() => setStage("docked"), dockAt);
    const leaveTimer = window.setTimeout(() => setStage("leaving"), leaveAt);
    const hideTimer = window.setTimeout(() => {
      setStage("hidden");
      document.body.style.overflow = previousOverflow;
    }, hideAt);

    return () => {
      window.clearTimeout(dockTimer);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [isHomePage]);

  if (!isHomePage || stage === "hidden") {
    return null;
  }

  const isDocked = stage === "docked" || stage === "leaving";
  const isLeaving = stage === "leaving";

  return (
    <div
      role="status"
      aria-label="Loading EAMORA"
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#faf9f6]"
      style={{
        opacity: isLeaving ? 0 : 1,
        transition: "opacity 800ms ease-in-out",
        // Let clicks through once fully faded, just in case removal is delayed
        pointerEvents: isLeaving ? "none" : "auto",
      }}
    >
      {/* Mirrors the Navbar's header bar exactly, so the logo lands
          in the identical spot before the preloader fades away. */}
      <div className="flex h-20 w-full items-center px-6 md:px-10 lg:px-16">
        <div
          className="relative h-[72px] w-60 sm:w-64"
          style={{
            opacity: isDocked ? 1 : 0,
            transform: isDocked ? "translateX(0)" : "translateX(100vw)",
            transition:
              "transform 3200ms cubic-bezier(0.25,0.1,0.25,1), opacity 500ms ease-out",
          }}
        >
          <Image
            src="/images/logo/eamora-logo-v2.png"
            alt="EAMORA"
            fill
            priority
            sizes="256px"
            className="object-contain object-left"
          />
        </div>
      </div>

      {/* Subtle loading indicator, independent of the logo motion */}
      <div
        className="
          absolute
          bottom-14
          left-1/2
          flex
          -translate-x-1/2
          items-center
          gap-3
          text-[9px]
          uppercase
          tracking-[0.34em]
          text-black/40

          sm:text-[10px]
        "
        style={{
          opacity: isLeaving ? 0 : isDocked ? 1 : 0,
          transition: "opacity 500ms ease",
        }}
      >
        <span>EAMORA</span>
        <span
          aria-hidden="true"
          className="h-1 w-1 rounded-full bg-[#9b1c1c]"
          style={{
            animation: "eamora_loading_pulse 1.1s ease-in-out infinite",
          }}
        />
        <span>Loading</span>
      </div>
    </div>
  );
}
