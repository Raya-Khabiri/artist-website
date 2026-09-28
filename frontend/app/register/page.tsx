import { createPageMetadata } from "@/lib/metadata";

import RegisterForm from "@/components/auth/RegisterForm";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";

export const metadata = createPageMetadata({
  title: "Create Account",
  description:
    "Create an EAMORA account to contact the artist, manage conversations and purchase artworks.",
  path: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f4f1eb] pb-28 pt-40 text-[#171717] md:pb-40 md:pt-52">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="text-xs uppercase tracking-[0.35em] text-black/45">
                Join EAMORA
              </p>

              <h1 className="mt-6 font-serif text-5xl font-light md:text-7xl">
                Create account
              </h1>

              <p className="mt-10 max-w-xl text-lg leading-9 text-black/65">
                Create an account to contact the artist, continue private
                conversations and manage future artwork orders.
              </p>
            </div>

            <div className="lg:col-span-6">
              <RegisterForm />
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
