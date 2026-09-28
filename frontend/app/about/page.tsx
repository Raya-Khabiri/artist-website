import { createPageMetadata } from "@/lib/metadata";
import Image from "next/image";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import { getMediaUrl, getSiteSettings } from "@/lib/api";

export const metadata = createPageMetadata({
  title: "About the Artist",
  description:
    "Discover the artist behind EAMORA, their background, creative practice and the ideas shaping their contemporary artworks.",
  path: "/about",
});

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
          pb-24
          pt-32
          text-[#171717]

          md:pb-32
          md:pt-40
        "
      >
        <Container>
          {/* Small page label */}
          <div className="border-b border-black/10 pb-7">
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
          </div>

          {/* Artist profile */}
          <div
            className="
              mx-auto
              mt-12
              grid
              max-w-[1050px]
              gap-12

              md:mt-16

              lg:grid-cols-[280px_minmax(0,620px)]
              lg:items-start
              lg:justify-between
              lg:gap-20
            "
          >
            {/* Portrait */}
            <div className="w-full max-w-[280px]">
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
                    sizes="280px"
                    className="object-cover"
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
                    text-[10px]
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
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  text-black/35
                "
              >
                Portrait of the artist
              </p>
            </div>

            {/* Biography */}
            <article>
              <header className="border-b border-black/10 pb-8">
                <h1
                  className="
                    font-serif
                    text-3xl
                    font-light
                    leading-tight

                    sm:text-4xl
                  "
                >
                  {settings?.artist_name || "EAMORA"}
                </h1>

                <div
                  className="
                    mt-6
                    space-y-1
                    text-[15px]
                    leading-6
                    text-black/65

                    sm:text-base
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
                  mt-8
                  space-y-
                  text-base
                  font-light
                  leading-[1.65]
                  text-black/70

                  md:text-[17px]
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
            </article>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
