"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import ArtworkEditForm from "@/components/studio/ArtworkEditForm";
import ArtworkImageManager from "@/components/studio/ArtworkImageManager";
import { getStudioArtwork } from "@/lib/studio-api";
import type { StudioArtwork } from "@/types/studio";

export default function EditArtworkPage() {
  const params = useParams<{
    id: string;
  }>();

  const [artwork, setArtwork] = useState<StudioArtwork | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadArtwork() {
      const artworkId = Number(params.id);

      if (!Number.isInteger(artworkId) || artworkId <= 0) {
        if (isMounted) {
          setError("Invalid artwork ID.");
          setIsLoading(false);
        }

        return;
      }

      try {
        const result = await getStudioArtwork(artworkId);

        if (isMounted) {
          setArtwork(result);
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load this artwork.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadArtwork();

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f1eb]">
        <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
          Loading artwork...
        </p>
      </main>
    );
  }

  if (error || !artwork) {
    return (
      <main className="min-h-screen bg-[#f4f1eb] px-6 py-20 text-[#171717]">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-[#9b1c1c]">
            {error || "Artwork not found."}
          </p>

          <Link
            href="/studio/artworks"
            className="mt-6 inline-block border-b border-black/20 pb-1 text-sm"
          >
            Return to artworks
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className="
        min-h-screen
        bg-[#f4f1eb]
        px-6
        py-10
        text-[#171717]

        sm:px-10
        lg:px-16
        lg:py-14
      "
    >
      <div className="mx-auto max-w-4xl">
        <header className="border-b border-black/10 pb-10">
          <Link
            href="/studio/artworks"
            className="
              text-[9px]
              uppercase
              tracking-[0.28em]
              text-black/40
              transition
              hover:text-[#9b1c1c]
            "
          >
            Back to artworks
          </Link>

          <p className="mt-10 text-[10px] uppercase tracking-[0.3em] text-[#9b1c1c]">
            Studio management
          </p>

          <h1 className="mt-4 font-serif text-4xl font-light sm:text-5xl">
            Edit artwork
          </h1>

          <p className="mt-4 text-sm text-black/50">{artwork.title}</p>
        </header>

        <div className="mt-10">
          <ArtworkEditForm artwork={artwork} />

          <ArtworkImageManager artworkId={artwork.id} />
        </div>
      </div>
    </main>
  );
}
