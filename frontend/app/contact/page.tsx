import type { Metadata } from "next";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import { getSiteSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "Contact | EAMORA",
  description: "Contact EAMORA about artworks, prints and enquiries.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f4f1eb] pb-28 pt-40 text-[#171717] md:pb-40 md:pt-52">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="text-xs uppercase tracking-[0.35em] text-black/45">
                Enquiries
              </p>

              <h1 className="mt-6 font-serif text-5xl font-light md:text-7xl">
                Contact
              </h1>

              <p className="mt-10 max-w-xl text-lg leading-9 text-black/65">
                For artwork availability, print enquiries or further
                information, please contact the artist directly.
              </p>
            </div>

            <div className="border-t border-black/15 pt-8 lg:col-span-5">
              {settings?.contact_email ? (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="block border-b border-black/15 py-5 text-lg transition hover:text-[#9b1c1c]"
                >
                  {settings.contact_email}
                </a>
              ) : (
                <p className="py-5 text-black/55">
                  Contact details will be available soon.
                </p>
              )}

              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block border-b border-black/15 py-5 text-lg transition hover:text-[#9b1c1c]"
                >
                  Instagram
                </a>
              )}

              {settings?.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block border-b border-black/15 py-5 text-lg transition hover:text-[#9b1c1c]"
                >
                  Facebook
                </a>
              )}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
