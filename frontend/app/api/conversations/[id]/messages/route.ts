import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL =
  process.env.DJANGO_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function POST(
  request: Request,
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
    const messageData = await request.json();

    const djangoResponse = await fetch(
      `${API_URL}/api/accounts/conversations/${id}/messages/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
        cache: "no-store",
      },
    );

    const data = await djangoResponse.json();

    return NextResponse.json(data, {
      status: djangoResponse.status,
    });
  } catch (error) {
    console.error("Unable to send reply:", error);

    return NextResponse.json(
      { detail: "Unable to send your reply." },
      { status: 503 },
    );
  }
}