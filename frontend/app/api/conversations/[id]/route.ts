import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL =
  process.env.DJANGO_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const { id } = await context.params;

  if (!accessToken) {
    return NextResponse.json(
      { detail: "Please sign in to continue." },
      { status: 401 },
    );
  }

  if (!/^\d+$/.test(id)) {
    return NextResponse.json(
      { detail: "Invalid conversation ID." },
      { status: 400 },
    );
  }

  try {
    const djangoResponse = await fetch(
      `${API_URL}/api/accounts/conversations/${id}/`,
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
    console.error("Unable to load conversation:", error);

    return NextResponse.json(
      { detail: "Unable to load this conversation." },
      { status: 503 },
    );
  }
}
