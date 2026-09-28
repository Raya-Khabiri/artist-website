import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArtworkLightbox from "@/components/artwork/ArtworkLightbox";
import { getArtworkBySlug, getArtworks, getMediaUrl } from "@/lib/api";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import ArtworkCard from "@/components/artwork/ArtworkCard";
import ArtworkPurchasePanel from "@/components/artwork/ArtworkPurchasePanel";

type ArtworkPageProps = {
  params: Promise<{
    slug: string;
  }>;
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

export async function generateMetadata({
  params,
}: ArtworkPageProps): Promise<Metadata> {
  const { slug } = await params;

  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    return createPageMetadata({
      title: "Artwork Not Found",
      description: "The requested EAMORA artwork could not be found.",
      path: `/gallery/${slug}`,
      noIndex: true,
    });
  }

  const image = getMediaUrl(artwork.main_image);

  const rawDescription =
    artwork.short_description ||
    artwork.description ||
    `View ${artwork.title}, an original artwork by EAMORA.`;

  const description = rawDescription.replace(/\s+/g, " ").trim().slice(0, 160);

  return createPageMetadata({
    title: artwork.title,
    description,
    path: `/gallery/${artwork.slug}`,
    image,
    imageAlt: artwork.main_image_alt || artwork.title,
  });
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    notFound();
  }

  const allArtworks = await getArtworks().catch(() => []);

  const currentIndex = allArtworks.findIndex(
    (item) => item.slug === artwork.slug,
  );

  const previousArtwork =
    currentIndex > 0 ? allArtworks[currentIndex - 1] : null;

  const nextArtwork =
    currentIndex >= 0 && currentIndex < allArtworks.length - 1
      ? allArtworks[currentIndex + 1]
      : null;

  const relatedArtworks = allArtworks
    .filter(
      (item) =>
        item.slug !== artwork.slug &&
        artwork.category !== null &&
        item.category?.slug === artwork.category.slug,
    )
    .slice(0, 3);

  const mainImage = getMediaUrl(artwork.main_image);

  const lightboxImages = mainImage
    ? [
        {
          src: mainImage,
          alt: artwork.main_image_alt || artwork.title,
        },
      ]
    : [];

  const originalAvailable =
    artwork.original_available &&
    artwork.sale_status === "available" &&
    artwork.stock > 0;

  const printAvailable =
    artwork.print_available &&
    artwork.print_price !== null &&
    artwork.stock > 0;

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const artworkUrl = `${siteUrl}/gallery/${artwork.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VisualArtwork",
        "@id": `${artworkUrl}#artwork`,
        name: artwork.title,
        description:
          artwork.short_description || artwork.description || undefined,
        image: lightboxImages.map((image) => image.src),
        url: artworkUrl,
        artMedium: artwork.technique?.name || artwork.medium || undefined,
        dateCreated: artwork.year?.toString() || undefined,
        width: artwork.size || undefined,
        artform: "Painting",
        creator: {
          "@type": "Person",
          "@id": `${siteUrl}/#artist`,
          name: "EAMORA",
          url: `${siteUrl}/about`,
        },
        offers:
          artwork.show_price && artwork.original_price
            ? {
                "@type": "Offer",
                price: artwork.original_price,
                priceCurrency: artwork.currency,
                availability: originalAvailable
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
                url: artworkUrl,
                seller: {
                  "@id": `${siteUrl}/#artist`,
                },
              }
            : undefined,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${artworkUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Gallery",
            item: `${siteUrl}/gallery`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: artwork.title,
            item: artworkUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />

      <main className="min-h-screen bg-[#f4f1eb] text-[#171717]">
        <section className="pb-24 pt-32 md:pb-36 md:pt-40">
          <Container>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-black/55 transition-colors hover:text-black"
            >
              <span aria-hidden="true">←</span>
              Back to gallery
            </Link>

            <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              <div
                className="
                  mx-auto
                  w-full
                  max-w-[720px]
                  lg:col-span-7
                "
              >
                {lightboxImages.length > 0 ? (
                  <ArtworkLightbox images={lightboxImages} />
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center bg-black/5 text-sm text-black/45 md:aspect-[5/6]">
                    Image unavailable
                  </div>
                )}
              </div>

              <aside className="lg:col-span-5 lg:pt-8">
                {/* 1. Artwork title */}
                <h1
                  className="
                    font-serif
                    text-4xl
                    font-light
                    leading-tight
                    tracking-tight
                    md:text-5xl
                  "
                >
                  {artwork.title}
                </h1>

                <dl
                  className="
                    mt-10
                    divide-y
                    divide-black/15
                    border-y
                    border-black/15
                  "
                >
                  {/* 2. Dimensions */}
                  <div className="flex justify-between gap-6 py-5">
                    <dt className="text-sm text-black/45">Dimensions</dt>

                    <dd className="text-right text-sm text-black/75">
                      {artwork.size ||
                        (artwork.width_mm && artwork.height_mm
                          ? `${artwork.width_mm} × ${artwork.height_mm} mm`
                          : "Not specified")}
                    </dd>
                  </div>

                  {/* 3. Technique */}
                  <div className="flex justify-between gap-6 py-5">
                    <dt className="text-sm text-black/45">Technique</dt>

                    <dd className="text-right text-sm text-black/75">
                      {artwork.technique?.name || "Not specified"}
                    </dd>
                  </div>

                  {/* 4. Price */}
                  <div className="flex justify-between gap-6 py-5">
                    <dt className="text-sm text-black/45">Price</dt>

                    <dd
                      className="
                        text-right
                        font-serif
                        text-xl
                        font-light
                        text-black/80
                      "
                    >
                      {artwork.show_price && artwork.original_price
                        ? formatPrice(artwork.original_price, artwork.currency)
                        : "Price on request"}
                    </dd>
                  </div>
                </dl>

                {/* 5. Short description */}
                {artwork.short_description && (
                  <p
                    className="
                      mt-8
                      whitespace-pre-line
                      text-justify
                      text-base
                      leading-7
                      text-black/65
                    "
                  >
                    {artwork.short_description}
                  </p>
                )}

                <ArtworkPurchasePanel
                  artworkId={artwork.id}
                  slug={artwork.slug}
                  title={artwork.title}
                  image={mainImage}
                  currency={artwork.currency}
                  originalAvailable={originalAvailable}
                  originalPrice={artwork.original_price}
                  printAvailable={printAvailable}
                  printPrice={artwork.print_price}
                  printStock={artwork.stock}
                />
              </aside>
            </div>
            {(previousArtwork || nextArtwork) && (
              <nav
                aria-label="Previous and next artworks"
                className="mt-24 grid border-y border-black/15 sm:grid-cols-2"
              >
                <div className="border-b border-black/15 py-8 sm:border-b-0 sm:border-r sm:pr-8">
                  {previousArtwork && (
                    <Link
                      href={`/gallery/${previousArtwork.slug}`}
                      className="group block"
                    >
                      <span className="text-[9px] uppercase tracking-[0.25em] text-black/40">
                        ← Previous artwork
                      </span>

                      <span className="mt-3 block font-serif text-2xl font-light transition-colors group-hover:text-[#9b1c1c]">
                        {previousArtwork.title}
                      </span>
                    </Link>
                  )}
                </div>

                <div className="py-8 sm:pl-8 sm:text-right">
                  {nextArtwork && (
                    <Link
                      href={`/gallery/${nextArtwork.slug}`}
                      className="group block"
                    >
                      <span className="text-[9px] uppercase tracking-[0.25em] text-black/40">
                        Next artwork →
                      </span>

                      <span className="mt-3 block font-serif text-2xl font-light transition-colors group-hover:text-[#9b1c1c]">
                        {nextArtwork.title}
                      </span>
                    </Link>
                  )}
                </div>
              </nav>
            )}

            {relatedArtworks.length > 0 && (
              <section className="mt-24">
                <div className="flex items-end justify-between gap-8">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.28em] text-[#9b1c1c]">
                      Continue exploring
                    </p>

                    <h2 className="mt-4 font-serif text-4xl font-light">
                      Related works
                    </h2>
                  </div>

                  <Link
                    href={
                      artwork.category
                        ? `/gallery?category=${encodeURIComponent(
                            artwork.category.slug,
                          )}`
                        : "/gallery"
                    }
                    className="hidden border-b border-black pb-2 text-[9px] uppercase tracking-[0.22em] sm:inline-flex"
                  >
                    View collection
                  </Link>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedArtworks.map((item) => (
                    <ArtworkCard key={item.id} artwork={item} />
                  ))}
                </div>
              </section>
            )}
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
