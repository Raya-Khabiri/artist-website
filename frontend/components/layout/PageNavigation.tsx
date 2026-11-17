"use client";

import { usePathname, useRouter } from "next/navigation";

export default function PageNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/") {
    return null;
  }

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }

  return (
    <nav
      aria-label="Page navigation"
      className="
        fixed
        bottom-5
        right-5
        z-40

        sm:bottom-7
        sm:right-7
      "
    >
      <button
        type="button"
        onClick={handleBack}
        className="
          inline-flex
          min-h-10
          items-center
          justify-center
          border
          border-black/15
          bg-[#f4f1eb]/95
          px-4
          py-2
          text-[9px]
          uppercase
          tracking-[0.22em]
          text-black/55
          backdrop-blur-md
          transition-colors

          hover:border-black/35
          hover:text-[#9b1c1c]

          focus-visible:outline
          focus-visible:outline-1
          focus-visible:outline-offset-2
          focus-visible:outline-[#9b1c1c]
        "
      >
        Back
      </button>
    </nav>
  );
}
