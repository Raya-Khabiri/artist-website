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

  return (
    <>
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
