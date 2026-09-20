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

export async function GET() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return unauthorizedResponse();
  }

  try {
    const djangoResponse = await fetch(
      `${API_URL}/api/site/manage/`,
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
      "Unable to load site content:",
      error,
    );

    return NextResponse.json(
      {
        detail: "Unable to load site content.",
      },
      {
        status: 503,
      },
    );
  }
}

export async function PATCH(request: Request) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return unauthorizedResponse();
  }

  try {
    const formData = await request.formData();

    const djangoResponse = await fetch(
      `${API_URL}/api/site/manage/`,
      {
        method: "PATCH",
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
      "Unable to update site content:",
      error,
    );

    return NextResponse.json(
      {
        detail: "Unable to update site content.",
      },
      {
        status: 503,
      },
    );
  }
}