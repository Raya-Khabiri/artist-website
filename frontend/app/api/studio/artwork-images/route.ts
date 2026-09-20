import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL =
  process.env.DJANGO_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

async function getAccessToken() {
  const cookieStore = await cookies();

  return cookieStore.get("access_token")?.value;
}

function unauthorizedResponse() {
  return NextResponse.json(
    {
      detail: "Please sign in as the artist.",
    },
    {
      status: 401,
    },
  );
}

export async function GET(request: Request) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return unauthorizedResponse();
  }

  const { searchParams } = new URL(request.url);
  const artworkId = searchParams.get("artwork");

  if (!artworkId || !/^\d+$/.test(artworkId)) {
    return NextResponse.json(
      {
        detail: "A valid artwork ID is required.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const djangoResponse = await fetch(
      `${API_URL}/api/artworks/manage/images/?artwork=${artworkId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );

    const data = await djangoResponse.json();

    return NextResponse.json(data, {
      status: djangoResponse.status,
    });
  } catch (error) {
    console.error(
      "Unable to load artwork images:",
      error,
    );

    return NextResponse.json(
      {
        detail: "Unable to load artwork images.",
      },
      {
        status: 503,
      },
    );
  }
}

export async function POST(request: Request) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return unauthorizedResponse();
  }

  try {
    const formData = await request.formData();

    const djangoResponse = await fetch(
      `${API_URL}/api/artworks/manage/images/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
        cache: "no-store",
      },
    );

    const data = await djangoResponse.json();

    return NextResponse.json(data, {
      status: djangoResponse.status,
    });
  } catch (error) {
    console.error(
      "Unable to upload artwork image:",
      error,
    );

    return NextResponse.json(
      {
        detail: "Unable to upload the image.",
      },
      {
        status: 503,
      },
    );
  }
}