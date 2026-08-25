import type { Metadata } from "next";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Shipping & Returns | EAMORA",
  description:
    "Shipping, delivery and returns information for EAMORA artworks and prints.",
};

export default function ShippingReturnsPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f4f1eb] pb-28 pt-40 text-[#171717] md:pb-40 md:pt-52">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-black/45">
              Customer information
            </p>

            <h1 className="mt-6 font-serif text-5xl font-light md:text-7xl">
              Shipping & Returns
            </h1>

            <div className="mt-14 space-y-10 text-base leading-8 text-black/65">
              <section>
                <h2 className="font-serif text-2xl text-black">
                  Original artworks
                </h2>

                <p className="mt-4">
                  Original artworks are carefully packaged for
                  transport. Shipping arrangements, cost, estimated
                  delivery time and insurance will be confirmed
                  before the order is accepted.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-black">
                  Prints
                </h2>

                <p className="mt-4">
                  Available print sizes, production times, packaging
                  and delivery estimates will be shown before
                  checkout when print ordering is enabled.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-black">
                  International delivery
                </h2>

                <p className="mt-4">
                  International customers may be responsible for
                  import duties, taxes or customs charges imposed by
                  the destination country.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-black">
                  Damaged deliveries
                </h2>

                <p className="mt-4">
                  Any visible damage should be photographed
                  immediately, including the artwork and packaging,
                  and reported as soon as possible after delivery.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-black">
                  Returns
                </h2>

                <p className="mt-4">
                  Return eligibility and costs depend on the product,
                  destination and applicable consumer law.
                  Custom-made or commissioned works may not be
                  returnable unless damaged or defective.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-black">
                  Important notice
                </h2>

                <p className="mt-4">
                  This page contains temporary launch information.
                  Final shipping and return terms must be confirmed
                  before online payments are enabled.
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