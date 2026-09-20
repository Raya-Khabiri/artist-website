import type {
  StudioArtwork,
  StudioArtworkImage,
  StudioArtworkImageListResponse,
  StudioArtworkListResponse,
} from "@/types/studio";

import type { SiteSettings } from "@/lib/api";

async function getErrorMessage(
  response: Response,
): Promise<string> {
  try {
    const data = await response.json();

    if (
      typeof data === "object" &&
      data !== null &&
      "detail" in data &&
      typeof data.detail === "string"
    ) {
      return data.detail;
    }
  } catch {
    // The response did not contain valid JSON.
  }

  return "Something went wrong.";
}

export async function getStudioArtworks(): Promise<
  StudioArtwork[]
> {
  const response = await fetch(
    "/api/studio/artworks",
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  const data: StudioArtworkListResponse =
    await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  return data.results ?? [];
}

export async function createStudioArtwork(
  formData: FormData,
): Promise<StudioArtwork> {
  const response = await fetch(
    "/api/studio/artworks",
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  return response.json();
}

export async function getStudioArtwork(
  id: number,
): Promise<StudioArtwork> {
  const response = await fetch(
    `/api/studio/artworks/${id}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  return response.json();
}

export async function updateStudioArtwork(
  id: number,
  formData: FormData,
): Promise<StudioArtwork> {
  const response = await fetch(
    `/api/studio/artworks/${id}`,
    {
      method: "PATCH",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  return response.json();
}

export async function deleteStudioArtwork(
  id: number,
): Promise<void> {
  const response = await fetch(
    `/api/studio/artworks/${id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }
}

export async function getStudioArtworkImages(
  artworkId: number,
): Promise<StudioArtworkImage[]> {
  const response = await fetch(
    `/api/studio/artwork-images?artwork=${artworkId}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  const data: StudioArtworkImageListResponse =
    await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  return data.results ?? [];
}

export async function createStudioArtworkImage(
  formData: FormData,
): Promise<StudioArtworkImage> {
  const response = await fetch(
    "/api/studio/artwork-images",
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  return response.json();
}

export async function updateStudioArtworkImage(
  id: number,
  formData: FormData,
): Promise<StudioArtworkImage> {
  const response = await fetch(
    `/api/studio/artwork-images/${id}`,
    {
      method: "PATCH",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  return response.json();
}

export async function deleteStudioArtworkImage(
  id: number,
): Promise<void> {
  const response = await fetch(
    `/api/studio/artwork-images/${id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }
}

export async function getStudioSiteContent(): Promise<SiteSettings> {
  const response = await fetch(
    "/api/studio/site-content",
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  return response.json();
}

export async function updateStudioSiteContent(
  formData: FormData,
): Promise<SiteSettings> {
  const response = await fetch(
    "/api/studio/site-content",
    {
      method: "PATCH",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  return response.json();
}