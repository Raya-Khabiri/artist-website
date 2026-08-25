import Image from "next/image";
import Link from "next/link";

import { getMediaUrl } from "@/lib/api";
import type { Artwork } from "@/types/artwork";

type ArtworkCardProps = {
  artwork: Artwork;
};

function formatPrice(value: string, currency: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return `${value} ${currency}`;
  }

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(amount);
}

export default function ArtworkCard({
  artwork,
}: ArtworkCardProps) {
  const imageUrl = getMediaUrl(artwork.main_image);

  const visiblePrice = artwork.show_price
    ? artwork.original_available &&
      artwork.original_price
    ? artwork.original_price
    : artwork.print_available
      ? artwork.print_price
      : null
  : null;

  const pricePrefix =
    artwork.original_available &&
    artwork.original_price
      ? ""
      : artwork.print_available &&
        artwork.print_price
      ? "Prints from "
      : "";

  const statusLabel = {
    available: null,
    sold: "Sold",
    reserved: "Reserved",
    not_for_sale: "Not for sale",
  }[artwork.sale_status];

  return (
    <article className="group">
      <Link
        href={`/gallery/${artwork.slug}`}
        className="block"
      >
        <div
          className="
            relative
            aspect-[4/5]
            w-full
            overflow-hidden
            border
            border-black/10
            bg-[#f1eee8]
            p-4

            sm:p-5
            lg:p-6
          "
        >
          {imageUrl ? (
            <div className="relative h-full w-full">
              <Image
                src={imageUrl}
                alt={artwork.main_image_alt || artwork.title}
                fill
                sizes="
                  (max-width: 640px) 100vw,
                  (max-width: 1024px) 50vw,
                  33vw
                "
                className="
                  object-contain
                  transition-transform
                  duration-700
                  ease-out
                  group-hover:scale-[1.025]
                "
              />
            </div>
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                bg-[#ebe7df]
              "
            >
              <span
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.24em]
                  text-black/35
                "
              >
                Image unavailable
              </span>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-start justify-between gap-5">
          <div className="min-w-0">
            <h3
              className="
                truncate
                font-serif
                text-xl
                font-light
                leading-tight
                text-[#171717]
                transition-colors
                duration-300
                group-hover:text-[#9b1c1c]

                sm:text-[22px]
              "
            >
              {artwork.title}
            </h3>

            {artwork.category?.name && (
              <p
                className="
                  mt-2
                  text-[9px]
                  uppercase
                  tracking-[0.22em]
                  text-black/45
                "
              >
                {artwork.category.name}
              </p>
            )}
          </div>

          <div className="shrink-0 text-right">
            {visiblePrice && (
              <p className="text-sm font-light text-black/65">
                {pricePrefix}
                {formatPrice(
                  visiblePrice,
                  artwork.currency,
                )}
              </p>
            )}
            {statusLabel && (
              <p
                className="mt-2 text-[9px] uppercase tracking-[0.18em] text-[#9b1c1c]"
              >
                {statusLabel}
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}