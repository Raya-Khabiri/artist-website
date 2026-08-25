import type { Metadata } from "next";
import Image from "next/image";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import { getMediaUrl, getSiteSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "About | EAMORA",
  description:
    "Learn about the artist and the ideas behind EAMORA.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const artistImage = getMediaUrl(
    settings?.artist_image,
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f4f1eb] pb-28 pt-40 text-[#171717] md:pb-40 md:pt-52">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <p className="text-xs uppercase tracking-[0.35em] text-black/45">
                The artist
              </p>

              <h1 className="mt-6 font-serif text-5xl font-light md:text-7xl">
                About EAMORA
              </h1>
            </div>

            <div className="lg:col-span-7">
              {artistImage && (
                <div className="relative mb-12 aspect-[4/5] overflow-hidden bg-black/5">
                  <Image
                    src={artistImage}
                    alt="EAMORA artist"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="whitespace-pre-line text-lg leading-9 text-black/65">
                {settings?.artist_statement ||
                  "The artist biography and full story of EAMORA will be added here through the website administration panel."}
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}