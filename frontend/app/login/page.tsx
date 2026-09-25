import type { Metadata } from "next";

import LoginForm from "@/components/auth/LoginForm";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Sign In | EAMORA",
  description:
    "Sign in to your EAMORA account to manage enquiries and future orders.",
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  const redirectTo =
    typeof next === "string" && next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/";
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f4f1eb] pb-28 pt-40 text-[#171717] md:pb-40 md:pt-52">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="text-xs uppercase tracking-[0.35em] text-black/45">
                Your account
              </p>

              <h1 className="mt-6 font-serif text-5xl font-light md:text-7xl">
                Welcome back
              </h1>

              <p className="mt-10 max-w-xl text-lg leading-9 text-black/65">
                Sign in to continue your conversations with the artist and
                access your account.
              </p>
            </div>

            <div className="lg:col-span-5">
              <LoginForm redirectTo={redirectTo} />
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
