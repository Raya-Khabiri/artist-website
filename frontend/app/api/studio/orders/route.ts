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

export async function GET(request: Request) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json(
      {
        detail: "Please sign in as the artist.",
      },
      {
        status: 401,
      },
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const query = status
    ? `?status=${encodeURIComponent(status)}`
    : "";

  try {
    const djangoResponse = await fetch(
      `${API_URL}/api/orders/manage/orders/${query}`,
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
      "Unable to load orders:",
      error,
    );

    return NextResponse.json(
      {
        detail: "Unable to load orders.",
      },
      {
        status: 503,
      },
    );
  }
}