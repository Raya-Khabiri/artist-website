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

function invalidIdResponse() {
  return NextResponse.json(
    {
      detail: "Invalid artwork ID.",
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
    return NextResponse.json(
      {
        detail: "Authentication required.",
      },
      {
        status: 401,
      },
    );
  }

  if (!/^\d+$/.test(id)) {
    return invalidIdResponse();
  }

  try {
    const djangoResponse = await fetch(
      `${API_URL}/api/artworks/manage/artworks/${id}/`,
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
      "Unable to load studio artwork:",
      error,
    );

    return NextResponse.json(
      {
        detail: "Unable to load this artwork.",
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
    return NextResponse.json(
      {
        detail: "Authentication required.",
      },
      {
        status: 401,
      },
    );
  }

  if (!/^\d+$/.test(id)) {
    return invalidIdResponse();
  }

  try {
    const formData = await request.formData();

    const djangoResponse = await fetch(
      `${API_URL}/api/artworks/manage/artworks/${id}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
        cache: "no-store",
      },
    );

    const data = await djangoResponse.json();

    return NextResponse.json(data, {
      status: djangoResponse.status,
    });
  } catch (error) {
    console.error(
      "Unable to update studio artwork:",
      error,
    );

    return NextResponse.json(
      {
        detail: "Unable to update this artwork.",
      },
      {
        status: 503,
      },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  const accessToken = await getAccessToken();
  const { id } = await context.params;

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

  if (!/^\d+$/.test(id)) {
    return invalidIdResponse();
  }

  try {
    const djangoResponse = await fetch(
      `${API_URL}/api/artworks/manage/artworks/${id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );

    if (djangoResponse.status === 204) {
      return new NextResponse(null, {
        status: 204,
      });
    }

    const data = await djangoResponse.json();

    return NextResponse.json(data, {
      status: djangoResponse.status,
    });
  } catch (error) {
    console.error(
      "Unable to delete studio artwork:",
      error,
    );

    return NextResponse.json(
      {
        detail: "Unable to delete this artwork.",
      },
      {
        status: 503,
      },
    );
  }
}