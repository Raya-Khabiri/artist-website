import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL =
  process.env.DJANGO_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getAccessToken() {
  const cookieStore = await cookies();

  return cookieStore.get("access_token")?.value;
}

function unauthorizedResponse() {
  return NextResponse.json(
    {
      detail: "Please sign in as the artist.",
    },
    {
      status: 401,
    },
  );
}

function invalidIdResponse() {
  return NextResponse.json(
    {
      detail: "Invalid order ID.",
    },
    {
      status: 400,
    },
  );
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const accessToken = await getAccessToken();
  const { id } = await context.params;

  if (!accessToken) {
    return unauthorizedResponse();
  }

  if (!/^\d+$/.test(id)) {
    return invalidIdResponse();
  }

  try {
    const djangoResponse = await fetch(
      `${API_URL}/api/orders/manage/orders/${id}/`,
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
      "Unable to load order:",
      error,
    );

    return NextResponse.json(
      {
        detail: "Unable to load this order.",
      },
      {
        status: 503,
      },
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  const accessToken = await getAccessToken();
  const { id } = await context.params;

  if (!accessToken) {
    return unauthorizedResponse();
  }

  if (!/^\d+$/.test(id)) {
    return invalidIdResponse();
  }

  try {
    const body = await request.json();

    const djangoResponse = await fetch(
      `${API_URL}/api/orders/manage/orders/${id}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: body.status,
        }),
        cache: "no-store",
      },
    );

    const data = await djangoResponse.json();

    return NextResponse.json(data, {
      status: djangoResponse.status,
    });
  } catch (error) {
    console.error(
      "Unable to update order:",
      error,
    );

    return NextResponse.json(
      {
        detail: "Unable to update the order.",
      },
      {
        status: 503,
      },
    );
  }
}