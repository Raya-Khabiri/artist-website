import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL =
  process.env.DJANGO_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

async function fetchCurrentUser(accessToken: string) {
  return fetch(`${API_URL}/api/accounts/me/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });
}

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (accessToken) {
    const userResponse = await fetchCurrentUser(accessToken);

    if (userResponse.ok) {
      return NextResponse.json(await userResponse.json());
    }

    if (userResponse.status !== 401) {
      return NextResponse.json(
        { detail: "Unable to load the current user." },
        { status: userResponse.status },
      );
    }
  }

  if (!refreshToken) {
    return NextResponse.json(
      { detail: "Authentication required." },
      { status: 401 },
    );
  }

  const refreshResponse = await fetch(
    `${API_URL}/api/accounts/token/refresh/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
      cache: "no-store",
    },
  );

  if (!refreshResponse.ok) {
    const response = NextResponse.json(
      { detail: "Your session has expired." },
      { status: 401 },
    );

    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");

    return response;
  }

  const refreshedTokens = await refreshResponse.json();
  const userResponse = await fetchCurrentUser(refreshedTokens.access);

  if (!userResponse.ok) {
    return NextResponse.json(
      { detail: "Unable to load the current user." },
      { status: userResponse.status },
    );
  }

  const response = NextResponse.json(await userResponse.json());
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set("access_token", refreshedTokens.access, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });

  if (refreshedTokens.refresh) {
    response.cookies.set("refresh_token", refreshedTokens.refresh, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  }

  return response;
}
