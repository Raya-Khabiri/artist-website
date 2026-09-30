import type { Metadata } from "next";

import PaymentConfirmation from "@/components/checkout/PaymentConfirmation";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Payment confirmation | EAMORA",
  description: "Confirmation of your EAMORA artwork payment.",
};

type CheckoutSuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { session_id: sessionId } = await searchParams;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f4f1eb] pb-28 pt-40 text-[#171717] md:pb-36 md:pt-52">
        <Container>
          <div className="mx-auto max-w-3xl">
            <PaymentConfirmation sessionId={sessionId || null} />
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
