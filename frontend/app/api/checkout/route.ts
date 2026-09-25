import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL =
  process.env.DJANGO_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function POST(request: Request) {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        detail:
          "Please sign in before continuing to checkout.",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const checkoutData =
      await request.json();

    const djangoResponse = await fetch(
      `${API_URL}/api/orders/checkout/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
        cache: "no-store",
      },
    );

    const data = await djangoResponse.json();

    return NextResponse.json(data, {
      status: djangoResponse.status,
    });
  } catch (error) {
    console.error(
      "Unable to create checkout order:",
      error,
    );

    return NextResponse.json(
      {
        detail:
          "Unable to create your order.",
      },
      {
        status: 503,
      },
    );
  }
}