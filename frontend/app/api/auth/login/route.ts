import { NextResponse } from "next/server";

const API_URL =
  process.env.DJANGO_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function POST(request: Request) {
  try {
    const credentials = await request.json();

    const djangoResponse = await fetch(
      `${API_URL}/api/accounts/login/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        cache: "no-store",
      },
    );

    const responseText = await djangoResponse.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("Django returned non-JSON:", responseText);

      return NextResponse.json(
        {
          detail: "The authentication server returned an invalid response.",
        },
        { status: 502 },
      );
    }

    if (!djangoResponse.ok) {
      return NextResponse.json(data, {
        status: djangoResponse.status,
      });
    }

    const response = NextResponse.json({
      user: data.user,
    });

    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("access_token", data.access, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    response.cookies.set("refresh_token", data.refresh, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Login route failed:", error);

    return NextResponse.json(
      {
        detail: "Unable to connect to the authentication server.",
      },
      { status: 503 },
    );
  }
}