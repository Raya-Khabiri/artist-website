import type { Metadata } from "next";

import CartView from "@/components/cart/CartView";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Basket | EAMORA",
  description: "Review the artworks selected for purchase.",
};

export default function CartPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f4f1eb] pb-28 pt-36 text-[#171717] md:pb-36 md:pt-44">
        <Container>
          <CartView />
        </Container>
      </main>

      <Footer />
    </>
  );
}
