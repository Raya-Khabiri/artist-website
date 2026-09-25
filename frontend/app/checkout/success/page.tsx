import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Order received | EAMORA",
};

type CheckoutSuccessPageProps = {
  searchParams: Promise<{
    reference?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { reference } = await searchParams;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f4f1eb] pb-28 pt-40 text-[#171717] md:pb-36 md:pt-52">
        <Container>
          <div className="mx-auto max-w-3xl border-y border-black/10 py-16 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b1c1c]">
              Order received
            </p>

            <h1 className="mt-5 font-serif text-4xl font-light sm:text-6xl">
              Thank you
            </h1>

            <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-black/55">
              Your order has been created and is awaiting payment confirmation.
            </p>

            {reference && (
              <p className="mt-7 font-mono text-xs text-black/40">
                Reference: {reference}
              </p>
            )}

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/gallery"
                className="border border-[#171717] bg-[#171717] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#faf9f6]"
              >
                Return to gallery
              </Link>

              <Link
                href="/account/messages"
                className="border border-black/20 px-6 py-3 text-xs uppercase tracking-[0.2em]"
              >
                Contact the artist
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
