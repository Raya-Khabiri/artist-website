import Link from "next/link";

import Container from "@/components/ui/Container";
import { getSiteSettings } from "@/lib/api";

const navigationLinks = [
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  {
    label: "Shipping",
    href: "/shipping-returns",
  },
];

export default async function Footer() {
  const settings = await getSiteSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="
        border-t
        border-black/10
        bg-[#f4f1eb]
        text-[#171717]
      "
    >
      <Container className="pb-8 pt-16 md:pb-10 md:pt-20">
        {/* Main content */}
        <div
          className="
            grid
            gap-14
            border-b
            border-black/10
            pb-16

            md:grid-cols-2
            md:gap-16
            md:pb-20

            lg:grid-cols-12
          "
        >
          {/* Brand statement */}
          <div className="lg:col-span-6">
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.35em]
                text-[#9b1c1c]
              "
            >
              EAMORA
            </p>

            <h2
              className="
                mt-5
                max-w-xl
                font-serif
                text-3xl
                font-light
                leading-[1.25]

                sm:text-4xl
                md:text-[42px]
              "
            >
              Art exists where memory refuses to disappear.
            </h2>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2 lg:col-start-8">
            <p
              className="
                text-[9px]
                uppercase
                tracking-[0.3em]
                text-black/40
              "
            >
              Explore
            </p>

            <nav
              aria-label="Footer navigation"
              className="mt-6 flex flex-col items-start gap-3"
            >
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="
                    border-b
                    border-transparent
                    pb-1
                    text-sm
                    text-black/65
                    transition
                    duration-300

                    hover:border-black/40
                    hover:text-black
                  "
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <p
              className="
                text-[9px]
                uppercase
                tracking-[0.3em]
                text-black/40
              "
            >
              Contact & Social
            </p>

            <div className="mt-6 flex flex-col items-start gap-3">
              {settings?.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="
                    break-all
                    border-b
                    border-transparent
                    pb-1
                    text-sm
                    text-black/65
                    transition
                    duration-300

                    hover:border-[#9b1c1c]
                    hover:text-[#9b1c1c]
                  "
                >
                  {settings.contact_email}
                </a>
              )}

              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    border-b
                    border-transparent
                    pb-1
                    text-sm
                    text-black/65
                    transition
                    duration-300

                    hover:border-[#9b1c1c]
                    hover:text-[#9b1c1c]
                  "
                >
                  Instagram ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="
            flex
            flex-col
            gap-5
            border-t
            border-black/10
            pt-7
            text-[11px]
            text-black/45

            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <p>
            © {currentYear}{" "}
            {settings?.copyright_text || "EAMORA. All rights reserved."}
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-3">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="
                  transition
                  duration-300
                  hover:text-[#9b1c1c]
                "
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
