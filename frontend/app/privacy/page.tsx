import { createPageMetadata } from "@/lib/metadata";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Read the EAMORA privacy policy explaining how personal information is collected, used, stored and protected.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f4f1eb] pb-28 pt-40 text-[#171717] md:pb-40 md:pt-52">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-black/45">
              Legal
            </p>

            <h1 className="mt-6 font-serif text-5xl font-light md:text-7xl">
              Privacy Policy
            </h1>

            <div className="mt-14 space-y-7 text-justify text-[17px] leading-[1.55] text-black/65">
              <section>
                <h2 className="font-serif text-2xl text-black">
                  Information we collect
                </h2>

                <p className="mt-2">
                  EAMORA may collect information that you voluntarily provide,
                  such as your name, email address, telephone number, delivery
                  address and enquiry details.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-black">
                  How information is used
                </h2>

                <p className="mt-2">
                  Personal information may be used to respond to enquiries,
                  process purchases, arrange delivery, provide customer support
                  and meet legal obligations.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-black">Payments</h2>

                <p className="mt-2">
                  When online payments are enabled, payment information will be
                  processed securely by the selected payment provider. EAMORA
                  will not store complete card details.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-black">Data sharing</h2>

                <p className="mt-2">
                  Information may be shared only with service providers required
                  to process payments, deliver orders, operate the website or
                  comply with legal requirements.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-black">
                  Data retention and rights
                </h2>

                <p className="mt-2">
                  Information will be retained only for as long as reasonably
                  necessary. Depending on your location, you may have rights to
                  access, correct or request deletion of your personal
                  information.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-black">Contact</h2>

                <p className="mt-2">
                  Privacy-related questions can be submitted through the Contact
                  page.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-black">
                  Important notice
                </h2>

                <p className="mt-2">
                  This is temporary launch copy and must be reviewed for the
                  artist’s legal jurisdiction before customer data is collected
                  or online payments are enabled.
                </p>
              </section>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
