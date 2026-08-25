import Link from "next/link";

import ArtworkCard from "@/components/artwork/ArtworkCard";
import { getArtworks } from "@/lib/api";

export default async function FeaturedWorks() {
  const artworks = await getArtworks("featured=true").catch(() => []);

  // فقط آثار Featured نمایش داده شوند.
  // اگر API از قبل featured=true را فیلتر می‌کند،
  // این فیلتر اضافی مشکلی ایجاد نمی‌کند.
  const featuredArtworks = Array.isArray(artworks)
    ? artworks
        .filter((artwork) => artwork.is_featured !== false)
        .slice(0, 6)
    : [];

  return (
    <section
      id="featured-works"
      className="
        bg-[#faf9f6]
        px-6
        py-20

        sm:px-10
        sm:py-24

        md:px-14

        lg:px-[5vw]
        lg:py-32
      "
    >
      <div className="mx-auto max-w-[1600px]">
        {/* Section heading */}
        <div
          className="
            mb-14
            flex
            flex-col
            gap-8

            sm:mb-16

            md:flex-row
            md:items-end
            md:justify-between

            lg:mb-20
          "
        >
          <div>
            <p
              className="
                mb-4
                text-[10px]
                font-medium
                uppercase
                tracking-[0.28em]
                text-[#9b1c1c]
              "
            >
              Selected collection
            </p>

            <h2
              className="
                font-serif
                text-[42px]
                font-light
                leading-none
                text-[#171717]

                sm:text-[52px]
                md:text-[62px]
                lg:text-[72px]
              "
            >
              Featured Works
            </h2>
          </div>

          <Link
            href="/gallery"
            className="
              group
              inline-flex
              w-fit
              items-center
              gap-6
              border-b
              border-black/60
              pb-2
              text-[10px]
              font-medium
              uppercase
              tracking-[0.24em]
              text-black
              transition-colors
              duration-300

              hover:border-[#9b1c1c]
              hover:text-[#9b1c1c]
            "
          >
            <span>View All Works</span>

            <span
              aria-hidden="true"
              className="
                text-base
                transition-transform
                duration-300
                group-hover:translate-x-2
              "
            >
              →
            </span>
          </Link>
        </div>

        {/* Artwork grid */}
        {featuredArtworks.length > 0 ? (
          <div
            className="
              grid
              grid-cols-1
              gap-x-7
              gap-y-14

              sm:grid-cols-2
              sm:gap-y-16

              lg:grid-cols-3
              lg:gap-x-8
              lg:gap-y-20

              xl:gap-x-10
            "
          >
            {featuredArtworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
              />
            ))}
          </div>
        ) : (
          <div
            className="
              flex
              min-h-[320px]
              items-center
              justify-center
              border
              border-black/10
              bg-[#f4f1eb]
              px-6
              text-center
            "
          >
            <div>
              <p
                className="
                  font-serif
                  text-2xl
                  font-light
                  text-black/70
                "
              >
                No featured artworks are available yet.
              </p>

              <p
                className="
                  mt-3
                  text-[10px]
                  uppercase
                  tracking-[0.2em]
                  text-black/40
                "
              >
                Add featured works through the Django admin panel
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}