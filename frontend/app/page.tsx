import FeaturedWorks from "@/components/home/FeaturedWorks";
import Hero from "@/components/home/Hero";
import ProcessVideo from "@/components/home/ProcessVideo";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { getMediaUrl, getSiteSettings } from "@/lib/api";

export default async function HomePage() {
  const settings = await getSiteSettings();

  const processVideoUrl = getMediaUrl(settings?.process_video);

  const processVideoPosterUrl = getMediaUrl(settings?.process_video_poster);

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const artistImageUrl = getMediaUrl(settings?.artist_image);

  const artistName = settings?.artist_name?.trim() || "EAMORA";

  const sameAs = [settings?.instagram_url, settings?.facebook_url].filter(
    (url): url is string => Boolean(url),
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "EAMORA",
        description:
          "Original contemporary artworks, selected collections and prints by EAMORA.",
        inLanguage: "en-GB",
        publisher: {
          "@id": `${siteUrl}/#artist`,
        },
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#artist`,
        name: artistName,
        alternateName: "EAMORA",
        url: `${siteUrl}/about`,
        image: artistImageUrl || `${siteUrl}/images/eamora-hero.jpg`,
        sameAs,
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

      <main className="bg-[#faf9f6] text-[#171717]">
        <Hero />

        {processVideoUrl && (
          <ProcessVideo
            title={settings?.process_video_title || "Inside the Studio"}
            videoUrl={processVideoUrl}
            posterUrl={processVideoPosterUrl || undefined}
          />
        )}

        <FeaturedWorks />
      </main>

      <Footer />
    </>
  );
}
