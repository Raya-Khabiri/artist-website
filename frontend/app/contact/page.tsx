import { createPageMetadata } from "@/lib/metadata";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import { getSiteSettings } from "@/lib/api";
import ContactMessageForm from "@/components/contact/ContactMessageForm";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact EAMORA to enquire about original artworks, availability, prints, shipping and purchasing information.",
  path: "/contact",
});

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
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                    settings.contact_email,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
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
                  href={
                    settings.instagram_url.startsWith("http")
                      ? settings.instagram_url
                      : `https://${settings.instagram_url}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="block border-b border-black/15 py-5 text-lg transition hover:text-[#9b1c1c]"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
          <div className="mt-24 grid gap-12 border-t border-black/10 pt-16 lg:mt-36 lg:grid-cols-12 lg:pt-24">
            <div className="lg:col-span-5">
              <p className="text-xs uppercase tracking-[0.35em] text-[#9b1c1c]">
                Private conversation
              </p>

              <h2 className="mt-6 font-serif text-4xl font-light md:text-5xl">
                Write to the artist
              </h2>

              <p className="mt-7 max-w-md leading-8 text-black/60">
                Your enquiry will be saved privately in your EAMORA account, so
                you can return and continue the conversation at any time.
              </p>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <ContactMessageForm />
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
