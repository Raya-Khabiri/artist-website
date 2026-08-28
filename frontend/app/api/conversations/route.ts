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

async function createUnauthorizedResponse() {
  return NextResponse.json(
    { detail: "Please sign in to continue." },
    { status: 401 },
  );
}

export async function GET() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return createUnauthorizedResponse();
  }

  try {
    const djangoResponse = await fetch(
      `${API_URL}/api/accounts/conversations/`,
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
    console.error("Unable to load conversations:", error);

    return NextResponse.json(
      { detail: "Unable to load conversations." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return createUnauthorizedResponse();
  }

  try {
    const conversationData = await request.json();

    const djangoResponse = await fetch(
      `${API_URL}/api/accounts/conversations/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(conversationData),
        cache: "no-store",
      },
    );

    const data = await djangoResponse.json();

    return NextResponse.json(data, {
      status: djangoResponse.status,
    });
  } catch (error) {
    console.error("Unable to create conversation:", error);

    return NextResponse.json(
      { detail: "Unable to send your message." },
      { status: 503 },
    );
  }
}