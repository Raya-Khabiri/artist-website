import type { MetadataRoute } from "next";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

const isPublicProductionSite =
  process.env.NODE_ENV === "production" &&
  !SITE_URL.includes("localhost") &&
  !SITE_URL.includes("127.0.0.1");

export default function robots(): MetadataRoute.Robots {
  if (!isPublicProductionSite) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/account/",
        "/cart",
        "/checkout",
        "/login",
        "/register",
        "/studio/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}