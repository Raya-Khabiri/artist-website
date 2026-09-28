import type { Metadata } from "next";

import CheckoutForm from "@/components/checkout/CheckoutForm";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete the delivery details for your EAMORA order.",
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f4f1eb] pb-28 pt-36 text-[#171717] md:pb-36 md:pt-44">
        <Container>
          <CheckoutForm />
        </Container>
      </main>

      <Footer />
    </>
  );
}
