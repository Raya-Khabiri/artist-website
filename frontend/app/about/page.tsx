import type { Metadata } from "next";
import Image from "next/image";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import { getMediaUrl, getSiteSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "About | EAMORA",
  description: "Learn about the artist and the ideas behind EAMORA.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const artistImage = getMediaUrl(settings?.artist_image);

  const biography =
    settings?.artist_biography?.trim() ||
    "The artist biography will be added soon.";

  const biographyParagraphs = biography
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <Navbar />

      <main
        className="
          min-h-screen
          bg-[#f4f1eb]
          pb-28
          pt-36
          text-[#171717]
          md:pb-40
          md:pt-44
        "
      >
        <Container>
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.35em]
              text-[#9b1c1c]
            "
          >
            The artist
          </p>

          <div
            className="
              mt-10
              grid
              gap-12
              lg:grid-cols-12
              lg:items-start
              lg:gap-16
              xl:gap-24
            "
          >
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                {artistImage ? (
                  <div
                    className="
                      relative
                      aspect-square
                      w-full
                      overflow-hidden
                      bg-black/5
                    "
                  >
                    <Image
                      src={artistImage}
                      alt={
                        settings?.artist_name
                          ? `Portrait of ${settings.artist_name}`
                          : "EAMORA artist"
                      }
                      fill
                      priority
                      sizes="
                        (max-width: 1024px) 100vw,
                        42vw
                      "
                      className="
                        object-cover
                        grayscale
                      "
                    />
                  </div>
                ) : (
                  <div
                    className="
                      flex
                      aspect-square
                      items-center
                      justify-center
                      border
                      border-black/10
                      bg-black/[0.025]
                      text-xs
                      uppercase
                      tracking-[0.25em]
                      text-black/35
                    "
                  >
                    Artist portrait
                  </div>
                )}

                <p
                  className="
                    mt-4
                    text-[10px]
                    uppercase
                    tracking-[0.25em]
                    text-black/35
                  "
                >
                  Portrait of the artist
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <header
                className="
                  border-b
                  border-black/15
                  pb-10
                "
              >
                <h1
                  className="
                    font-serif
                    text-5xl
                    font-light
                    leading-none
                    md:text-6xl
                    xl:text-7xl
                  "
                >
                  {settings?.artist_name || "EAMORA"}
                </h1>

                <div
                  className="
                    mt-8
                    space-y-1
                    text-base
                    leading-7
                    text-black/65
                    md:text-lg
                  "
                >
                  {settings?.artist_origin && <p>{settings.artist_origin}</p>}

                  {settings?.artist_location && (
                    <p>{settings.artist_location}</p>
                  )}

                  {settings?.artist_profession && (
                    <p>{settings.artist_profession}</p>
                  )}
                </div>
              </header>

              <div
                className="
                  mt-10
                  space-y-6
                  font-sans
                  text-[17px]
                  font-light
                  leading-[1.55]
                  text-black/70
                  md:text-lg
                "
              >
                {biographyParagraphs.map((paragraph, index) => (
                  <p
                    key={`${index}-${paragraph.slice(0, 20)}`}
                    className="text-justify"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
