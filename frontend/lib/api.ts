import type { Artwork, Category, Technique } from "@/types/artwork";
import { unstable_noStore as noStore } from "next/cache";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type SiteSettings = {
  id: number;

  hero_title: string;
  hero_acronym: string;
  hero_statement: string;
  hero_image: string | null;
  hero_image_alt: string;
  hero_button_text: string;
  hero_button_link: string;

  process_video: string | null;
  process_video_poster: string | null;
  process_video_title: string;

  artist_statement_title: string;
  artist_statement: string;
  artist_image: string | null;
  artist_name: string;
  artist_origin: string;
  artist_location: string;
  artist_profession: string;
  artist_biography: string;

  contact_email: string;
  phone: string;
  instagram_url: string;
  facebook_url: string;
  copyright_text: string;

  updated_at: string;
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  noStore();

  try {
    const response = await fetch(
      `${API_URL}/api/site/`,
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error(
      "Failed to load site settings:",
      error,
    );

    return null;
  }
}

export async function getArtworks(
  query?: string,
): Promise<Artwork[]> {
  const endpoint = query
    ? `${API_URL}/api/artworks/artworks/?${query}`
    : `${API_URL}/api/artworks/artworks/`;

  const response = await fetch(endpoint, {
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load artworks.");
  }

  const data: Artwork[] | PaginatedResponse<Artwork> =
    await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  return data.results ?? [];
}

export async function getArtworkBySlug(
  slug: string,
): Promise<Artwork | null> {
  try {
    const response = await fetch(
      `${API_URL}/api/artworks/artworks/${slug}/`,
      {
        next: {
          revalidate: 60,
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to load artwork:", error);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(
    `${API_URL}/api/artworks/categories/`,
    {
      next: {
        revalidate: 60,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to load categories.");
  }

  const data: Category[] | PaginatedResponse<Category> =
    await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  return data.results ?? [];
}

export async function getTechniques(): Promise<Technique[]> {
  const response = await fetch(
    `${API_URL}/api/artworks/techniques/`,
    {
      next: {
        revalidate: 60,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load techniques.",
    );
  }

  const data:
    | Technique[]
    | PaginatedResponse<Technique> =
    await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  return data.results ?? [];
}

export function getMediaUrl(
  path: string | null | undefined,
): string | null {
  if (!path) {
    return null;
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}