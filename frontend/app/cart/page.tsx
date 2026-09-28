import { createPageMetadata } from "@/lib/metadata";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CartView from "@/components/cart/CartView";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";

export const metadata = createPageMetadata({
  title: "Basket",
  description: "Review the artworks selected for purchase from EAMORA.",
  path: "/cart",
  noIndex: true,
});

export default async function CartPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    redirect("/login?next=/cart");
  }

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
