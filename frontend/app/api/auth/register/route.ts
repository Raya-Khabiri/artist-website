import { NextResponse } from "next/server";

const API_URL =
  process.env.DJANGO_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function POST(request: Request) {
  try {
    const userData = await request.json();

    const djangoResponse = await fetch(
      `${API_URL}/api/accounts/register/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        cache: "no-store",
      },
    );

    const responseText = await djangoResponse.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        {
          detail: "The registration server returned an invalid response.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(data, {
      status: djangoResponse.status,
    });
  } catch (error) {
    console.error("Registration route failed:", error);

    return NextResponse.json(
      {
        detail: "Unable to connect to the registration server.",
      },
      { status: 503 },
    );
  }
}