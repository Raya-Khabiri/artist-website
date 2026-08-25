import Link from "next/link";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";

export default function NotFoundPage() {
  return (
    <>
      <Navbar />

      <main className="flex min-h-screen items-center bg-[#f4f1eb] py-32 text-[#171717]">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-[#9b1c1c]">
              Error 404
            </p>

            <h1 className="mt-7 font-serif text-5xl font-light leading-tight md:text-7xl">
              This page cannot be found.
            </h1>

            <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-black/60">
              The page may have moved, or the artwork may no longer
              be publicly available.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-8">
              <Link
                href="/gallery"
                className="border-b border-black pb-2 text-xs uppercase tracking-[0.22em] transition hover:text-[#9b1c1c]"
              >
                Explore Gallery
              </Link>

              <Link
                href="/"
                className="border-b border-black pb-2 text-xs uppercase tracking-[0.22em] transition hover:text-[#9b1c1c]"
              >
                Return Home
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}