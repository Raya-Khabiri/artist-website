"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  {
    label: "Gallery",
    href: "/gallery",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Statement",
    href: "/#statement",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <div
        className={`
          flex
          h-20
          w-full
          items-center
          justify-between
          border-b
          border-black/15
          bg-[#faf9f6]/95
          px-6
          backdrop-blur-xl
          transition-shadow
          duration-500

          md:px-10
          lg:px-16

          ${
            isScrolled
              ? "shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
              : ""
          }
        `}
      >
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className="
            text-xl
            font-medium
            tracking-[0.3em]
            text-black
            transition-colors
            duration-300
            hover:text-[#9b1c1c]
          "
        >
          EAMORA
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-9 md:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="
                text-sm
                tracking-[0.12em]
                text-black/60
                transition-colors
                duration-300
                hover:text-black
              "
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label={
            isMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => {
            setIsMenuOpen((current) => !current);
          }}
          className="
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            text-black
            md:hidden
          "
        >
          <span
            className={`
              absolute
              h-px
              w-6
              bg-black
              transition-transform
              duration-300

              ${
                isMenuOpen
                  ? "translate-y-0 rotate-45"
                  : "-translate-y-1.5"
              }
            `}
          />

          <span
            className={`
              absolute
              h-px
              w-6
              bg-black
              transition-opacity
              duration-300

              ${
                isMenuOpen
                  ? "opacity-0"
                  : "opacity-100"
              }
            `}
          />

          <span
            className={`
              absolute
              h-px
              w-6
              bg-black
              transition-transform
              duration-300

              ${
                isMenuOpen
                  ? "translate-y-0 -rotate-45"
                  : "translate-y-1.5"
              }
            `}
          />
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`
          w-full
          overflow-hidden
          border-black/15
          bg-[#faf9f6]/95
          backdrop-blur-xl
          transition-all
          duration-500
          md:hidden

          ${
            isMenuOpen
              ? "max-h-96 border-b"
              : "max-h-0"
          }
        `}
      >
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col px-6 py-6"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="
                border-b
                border-black/10
                py-4
                text-sm
                tracking-[0.14em]
                text-black/70
                transition-colors
                hover:text-black
              "
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}