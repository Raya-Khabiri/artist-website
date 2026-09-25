"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/components/cart/CartProvider";
import Image from "next/image";

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
    label: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { itemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  async function handleLogout() {
    setIsSigningOut(true);

    try {
      await logout();
      setIsMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Unable to sign out:", error);
    } finally {
      setIsSigningOut(false);
    }
  }

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

          ${isScrolled ? "shadow-[0_8px_30px_rgba(0,0,0,0.08)]" : ""}
        `}
      >
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          aria-label="EAMORA home"
          className="
            relative
            block
            h-[72px]
            w-60
            shrink-0
            transition-opacity
            duration-300
            hover:opacity-65

            sm:w-64
          "
        >
          <Image
            src="/images/logo/eamora-logo-v2.png"
            alt="EAMORA"
            fill
            priority
            sizes="256px"
            className="object-contain object-left"
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-7 md:flex"
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
          {!isLoading && user && (
            <Link
              href="/cart"
              aria-label={`Basket with ${itemCount} items`}
              className="
              inline-flex
              items-center
              gap-2
              text-sm
              tracking-[0.12em]
              text-black/60
              transition-colors
              duration-300
              hover:text-black
            "
            >
              <span>Basket</span>

              <span
                className="
                inline-flex
                min-w-5
                items-center
                justify-center
                border
                border-black/20
                px-1.5
                py-0.5
                text-[9px]
                leading-none
                tracking-normal
                text-[#9b1c1c]
              "
              >
                {itemCount}
              </span>
            </Link>
          )}
          {!isLoading &&
            (user ? (
              <>
                <Link
                  href="/account/messages"
                  className="
                    text-sm
                    tracking-[0.12em]
                    text-black/60
                    transition-colors
                    duration-300
                    hover:text-black
                  "
                >
                  Messages
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isSigningOut}
                  className="
                    text-sm
                    tracking-[0.12em]
                    text-[#9b1c1c]
                    transition-opacity
                    hover:opacity-60
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="
                  text-sm
                  tracking-[0.12em]
                  text-[#9b1c1c]
                  transition-opacity
                  hover:opacity-60
                "
              >
                Sign in
              </Link>
            ))}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
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

              ${isMenuOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5"}
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

              ${isMenuOpen ? "opacity-0" : "opacity-100"}
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

              ${isMenuOpen ? "translate-y-0 -rotate-45" : "translate-y-1.5"}
            `}
          />
        </button>
      </div>

      {/* Mobile navigation */}
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

          ${isMenuOpen ? "max-h-[520px] border-b" : "max-h-0"}
        `}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col px-6 py-6">
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
          {!isLoading && user && (
            <Link
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="
              flex
              items-center
              justify-between
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
              <span>Basket</span>

              <span className="text-xs tracking-normal text-[#9b1c1c]">
                {itemCount}
              </span>
            </Link>
          )}

          {!isLoading &&
            (user ? (
              <>
                <Link
                  href="/account/messages"
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
                  Messages
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isSigningOut}
                  className="
                    py-4
                    text-left
                    text-sm
                    tracking-[0.14em]
                    text-[#9b1c1c]
                    transition-opacity
                    hover:opacity-60
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="
                  py-4
                  text-sm
                  tracking-[0.14em]
                  text-[#9b1c1c]
                  transition-opacity
                  hover:opacity-60
                "
              >
                Sign in
              </Link>
            ))}
        </nav>
      </div>
    </header>
  );
}
