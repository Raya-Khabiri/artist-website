import type { MetadataRoute } from "next";

import { getArtworks } from "@/lib/api";

export const dynamic = "force-dynamic";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const artworks = await getArtworks().catch(
    () => [],
  );

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/gallery`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/shipping-returns`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const artworkPages: MetadataRoute.Sitemap =
    artworks.map((artwork) => ({
      url: `${SITE_URL}/gallery/${artwork.slug}`,
      lastModified: new Date(
        artwork.updated_at,
      ),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  return [
    ...staticPages,
    ...artworkPages,
  ];
}