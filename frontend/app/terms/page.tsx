import { createPageMetadata } from "@/lib/metadata";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";

export const metadata = createPageMetadata({
  title: "Terms & Conditions",
  description:
    "Read the terms and conditions governing use of the EAMORA website and the purchase of original artworks and prints.",
  path: "/terms",
});

export default function TermsPage() {
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
              Terms & Conditions
            </h1>

            <div className="mt-14 space-y-7 text-justify text-[17px] leading-[1.55] text-black/65">
              <section>
                <h2 className="font-serif text-2xl text-black">Website use</h2>

                <p className="mt-2">
                  This website presents artworks and information relating to
                  EAMORA. Content may not be copied, reproduced or used
                  commercially without written permission.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-black">
                  Artwork information
                </h2>

                <p className="mt-2">
                  Every effort is made to present artwork details, dimensions,
                  colours and availability accurately. Colours may vary between
                  screens and devices.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-black">Purchases</h2>

                <p className="mt-2">
                  Final prices, payment terms, shipping costs and delivery
                  arrangements will be confirmed before an order is accepted.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-black">Copyright</h2>

                <p className="mt-2">
                  Purchasing an original artwork or print does not transfer
                  copyright or reproduction rights unless agreed separately in
                  writing.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-black">
                  Important notice
                </h2>

                <p className="mt-2">
                  These terms are temporary launch copy and must be reviewed for
                  the artist’s legal jurisdiction before online payments are
                  enabled.
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
