import type { SiteSettings } from "@/lib/api";

import type {
  OrderStatus,
  StudioOrder,
  StudioOrderListResponse,
} from "@/types/order";

import type {
  StudioArtwork,
  StudioArtworkImage,
  StudioArtworkImageListResponse,
  StudioArtworkListResponse,
} from "@/types/studio";
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

export async function getStudioOrders(
  status?: OrderStatus,
): Promise<StudioOrder[]> {
  const query = status
    ? `?status=${encodeURIComponent(status)}`
    : "";

  const response = await fetch(
    `/api/studio/orders${query}`,
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

  const data: StudioOrderListResponse =
    await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  return data.results ?? [];
}

export async function getStudioOrder(
  id: number,
): Promise<StudioOrder> {
  const response = await fetch(
    `/api/studio/orders/${id}`,
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

export async function updateStudioOrderStatus(
  id: number,
  status: OrderStatus,
): Promise<StudioOrder> {
  const response = await fetch(
    `/api/studio/orders/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  return response.json();
}