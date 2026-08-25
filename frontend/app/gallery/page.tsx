import type { Metadata } from "next";

import ArtworkCard from "@/components/artwork/ArtworkCard";
import GallerySort from "@/components/artwork/GallerySort";
import TechniqueFilter from "@/components/artwork/TechniqueFilter";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { getArtworks, getTechniques } from "@/lib/api";
import type { Artwork, Technique } from "@/types/artwork";

export const metadata: Metadata = {
  title: "Gallery | EAMORA",
  description:
    "Explore original artworks and selected works from the EAMORA collection.",
};

type GalleryPageProps = {
  searchParams: Promise<{
    technique?: string;
    available?: string;
    ordering?: string;
  }>;
};

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const { technique, available, ordering } = await searchParams;

  const availableOnly = available === "true";

  let artworks: Artwork[] = [];
  let techniques: Technique[] = [];
  let failedToLoad = false;

  try {
    const query = new URLSearchParams();

    if (technique) {
      query.set("technique", technique);
    }

    if (availableOnly) {
      query.set("available", "true");
    }

    if (ordering) {
      query.set("ordering", ordering);
    }

    const artworkQuery = query.toString() || undefined;

    const results = await Promise.all([
      getArtworks(artworkQuery),
      getTechniques(),
    ]);

    artworks = results[0];
    techniques = results[1];
  } catch (error) {
    console.error("Failed to load gallery:", error);

    failedToLoad = true;
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f4f1eb] text-[#171717]">
        <section className="pb-28 pt-40 md:pb-40 md:pt-52">
          <Container>
            <SectionTitle
              eyebrow="The collection"
              title="Gallery"
              description="A collection of works exploring emotion, memory and the quiet traces left by time."
            />

            <TechniqueFilter
              techniques={techniques}
              activeTechnique={technique}
              activeOrdering={ordering}
              availableOnly={availableOnly}
            />

            <div className="mt-8 flex justify-end">
              <GallerySort
                activeOrdering={ordering}
                activeTechnique={technique}
                availableOnly={availableOnly}
              />
            </div>

            {failedToLoad ? (
              <div className="mt-20 border border-black/10 px-6 py-20 text-center">
                <h2 className="font-serif text-2xl font-light">
                  The gallery is temporarily unavailable.
                </h2>

                <p className="mt-3 text-sm text-black/55">
                  Please try again shortly.
                </p>
              </div>
            ) : artworks.length > 0 ? (
              <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-24">
                {artworks.map((artwork) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
            ) : (
              <div className="mt-20 border border-black/10 px-6 py-20 text-center">
                <h2 className="font-serif text-2xl font-light">
                  No artworks match the selected filters.
                </h2>
              </div>
            )}
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
