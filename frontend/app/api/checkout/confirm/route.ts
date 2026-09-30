import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL =
  process.env.DJANGO_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function GET(request: Request) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        detail: "Please sign in to verify your payment.",
      },
      {
        status: 401,
      },
    );
  }

  const requestUrl = new URL(request.url);

  const sessionId = requestUrl.searchParams.get("session_id");

  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json(
      {
        detail: "Invalid checkout session.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const djangoResponse = await fetch(
      `${API_URL}/api/orders/checkout/confirm/?session_id=${encodeURIComponent(
        sessionId,
      )}`,
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
    console.error("Unable to verify Stripe payment:", error);

    return NextResponse.json(
      {
        detail: "Unable to verify your payment.",
      },
      {
        status: 503,
      },
    );
  }
}
