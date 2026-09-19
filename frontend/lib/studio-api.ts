import type {
  StudioArtwork,
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