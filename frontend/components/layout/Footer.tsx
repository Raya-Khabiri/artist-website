import Link from "next/link";

import Container from "@/components/ui/Container";
import { getSiteSettings } from "@/lib/api";

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="border-t border-black/10 bg-[#f4f1eb] text-[#171717]">
      <Container className="py-20">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-black/45">
              EAMORA
            </p>

            <h2 className="mt-6 max-w-md font-serif text-3xl font-light leading-relaxed">
              Art exists where memory refuses to disappear.
            </h2>
          </div>

          <div className="flex flex-col items-start gap-5 md:items-end">
            {settings?.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="transition hover:opacity-60"
              >
                Instagram
              </a>
            )}

            {settings?.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="transition hover:opacity-60"
              >
                Facebook
              </a>
            )}

            {settings?.contact_email && (
              <a
                href={`mailto:${settings.contact_email}`}
                className="transition hover:opacity-60"
              >
                Email
              </a>
            )}

            <Link
              href="/contact"
              className="transition hover:opacity-60"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-4 border-t border-black/10 pt-8 text-sm text-black/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()}{" "}
            {settings?.copyright_text ||
              "EAMORA. All rights reserved."}
          </p>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/privacy"
              className="transition hover:text-black"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-black"
            >
              Terms
            </Link>

            <Link
              href="/shipping-returns"
              className="transition hover:text-black"
            >
              Shipping & Returns
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}