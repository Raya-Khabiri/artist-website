"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStudioArtworks } from "@/lib/studio-api";
import type { StudioArtwork } from "@/types/studio";

function formatPrice(price: string | null, currency: string) {
  if (!price) {
    return "—";
  }

  const value = Number(price);

  if (Number.isNaN(value)) {
    return `${price} ${currency}`;
  }

  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${price} ${currency}`;
  }
}

function formatStatus(status: StudioArtwork["sale_status"]) {
  return status.replaceAll("_", " ");
}

export default function ArtworkManager() {
  const [artworks, setArtworks] = useState<StudioArtwork[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadArtworks() {
      try {
        const result = await getStudioArtworks();

        if (isMounted) {
          setArtworks(result);
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load artworks.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadArtworks();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div
        className="
          border
          border-black/10
          px-6
          py-16
          text-center
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-black/40
          "
        >
          Loading artworks…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="
          border
          border-[#9b1c1c]/25
          bg-[#9b1c1c]/[0.03]
          px-6
          py-10
        "
      >
        <p className="text-sm text-[#9b1c1c]">{error}</p>
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div
        className="
          border
          border-black/10
          px-6
          py-16
          text-center
        "
      >
        <p className="font-serif text-2xl font-light">No artworks yet</p>

        <p className="mt-3 text-sm text-black/50">
          Your artworks will appear here.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        overflow-hidden
        border
        border-black/10
      "
    >
      {/* Desktop heading */}
      <div
        className="
          hidden
          grid-cols-[minmax(0,2fr)_0.7fr_0.9fr_0.8fr_0.8fr]
          gap-5
          border-b
          border-black/10
          bg-black/[0.025]
          px-6
          py-4
          text-[9px]
          uppercase
          tracking-[0.22em]
          text-black/40

          md:grid
        "
      >
        <span>Artwork</span>
        <span>Year</span>
        <span>Price</span>
        <span>Status</span>
        <span>Visibility</span>
      </div>

      <div>
        {artworks.map((artwork) => (
          <article
            key={artwork.id}
            className="
              grid
              gap-5
              border-b
              border-black/10
              px-6
              py-6
              last:border-b-0

              md:grid-cols-[minmax(0,2fr)_0.7fr_0.9fr_0.8fr_0.8fr]
              md:items-center
            "
          >
            <div>
              <p
                className="
                  font-serif
                  text-xl
                  font-light
                "
              >
                {artwork.title}
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  text-black/35
                "
              >
                ID {artwork.id} · {artwork.slug}
              </p>
              <Link
                href={`/studio/artworks/${artwork.id}/edit`}
                className="
                mt-4
                inline-block
                border-b
                border-black/20
                pb-1
                text-[9px]
                uppercase
                tracking-[0.2em]
                text-black/50
                transition

                hover:border-[#9b1c1c]
                hover:text-[#9b1c1c]
              "
              >
                Edit artwork
              </Link>
            </div>

            <div>
              <p
                className="
                  mb-1
                  text-[9px]
                  uppercase
                  tracking-[0.2em]
                  text-black/35

                  md:hidden
                "
              >
                Year
              </p>

              <p className="text-sm text-black/65">{artwork.year ?? "—"}</p>
            </div>

            <div>
              <p
                className="
                  mb-1
                  text-[9px]
                  uppercase
                  tracking-[0.2em]
                  text-black/35

                  md:hidden
                "
              >
                Price
              </p>

              <p className="text-sm text-black/65">
                {formatPrice(artwork.original_price, artwork.currency)}
              </p>
            </div>

            <div>
              <p
                className="
                  mb-1
                  text-[9px]
                  uppercase
                  tracking-[0.2em]
                  text-black/35

                  md:hidden
                "
              >
                Status
              </p>

              <p
                className="
                  text-xs
                  capitalize
                  text-black/60
                "
              >
                {formatStatus(artwork.sale_status)}
              </p>
            </div>

            <div>
              <p
                className="
                  mb-1
                  text-[9px]
                  uppercase
                  tracking-[0.2em]
                  text-black/35

                  md:hidden
                "
              >
                Visibility
              </p>

              <span
                className={`
                  inline-flex
                  rounded-full
                  px-3
                  py-1
                  text-[9px]
                  uppercase
                  tracking-[0.16em]

                  ${
                    artwork.is_published
                      ? "bg-black/[0.06] text-black/60"
                      : "bg-[#9b1c1c]/10 text-[#9b1c1c]"
                  }
                `}
              >
                {artwork.is_published ? "Published" : "Draft"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
