"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import SiteContentForm from "@/components/studio/SiteContentForm";
import type { SiteSettings } from "@/lib/api";
import { getStudioSiteContent } from "@/lib/studio-api";

export default function StudioSiteContentPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSiteContent() {
      try {
        const result = await getStudioSiteContent();

        if (isMounted) {
          setSettings(result);
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load site content.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSiteContent();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f1eb]">
        <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
          Loading site content...
        </p>
      </main>
    );
  }

  if (error || !settings) {
    return (
      <main className="min-h-screen bg-[#f4f1eb] px-6 py-20 text-[#171717]">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-[#9b1c1c]">
            {error || "Site content could not be loaded."}
          </p>

          <Link
            href="/studio"
            className="mt-6 inline-block border-b border-black/20 pb-1 text-sm"
          >
            Return to studio
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
            href="/studio"
            className="
              text-[9px]
              uppercase
              tracking-[0.28em]
              text-black/40
              transition
              hover:text-[#9b1c1c]
            "
          >
            Back to studio
          </Link>

          <p className="mt-10 text-[10px] uppercase tracking-[0.3em] text-[#9b1c1c]">
            Website management
          </p>

          <h1 className="mt-4 font-serif text-4xl font-light sm:text-5xl">
            Site content
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-black/55">
            Update the public text, images, video, artist profile and contact
            details shown across the EAMORA website.
          </p>
        </header>

        <div className="mt-12">
          <SiteContentForm settings={settings} />
        </div>
      </div>
    </main>
  );
}
