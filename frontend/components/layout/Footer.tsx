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
      <Container className="pb-6 pt-12 md:pb-8 md:pt-14">
        {/* Main content */}
        <div
          className="
            grid
            gap-10
            border-b
            border-black/10
            pb-12

            md:grid-cols-2
            md:gap-12
            md:pb-14

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
                mt-3
                max-w-xl
                font-serif
                text-3xl
                font-light
                leading-[1.1]

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
              className="mt-4 flex flex-col items-start gap-1.5"
            >
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="
                    border-b
                    border-transparent
                    pb-0.5
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

            <div className="mt-4 flex flex-col items-start gap-1.5">
              {settings?.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="
                    break-all
                    border-b
                    border-transparent
                    pb-0.5
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
                    pb-0.5
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
            gap-3
            border-t
            border-black/10
            pt-5
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

          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
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
