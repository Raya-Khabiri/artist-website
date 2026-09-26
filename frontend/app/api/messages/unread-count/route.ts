import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL =
  process.env.DJANGO_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        detail: "Authentication required.",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const djangoResponse = await fetch(
      `${API_URL}/api/accounts/messages/unread-count/`,
      {
        method: "GET",
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
      "Unable to load unread message count:",
      error,
    );

    return NextResponse.json(
      {
        detail: "Unable to load message notifications.",
      },
      {
        status: 503,
      },
    );
  }
}