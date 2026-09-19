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
      detail: "Invalid image ID.",
    },
    {
      status: 400,
    },
  );
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
    const formData = await request.formData();

    const djangoResponse = await fetch(
      `${API_URL}/api/artworks/manage/images/${id}/`,
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
      "Unable to update artwork image:",
      error,
    );

    return NextResponse.json(
      {
        detail: "Unable to update the image.",
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
    return unauthorizedResponse();
  }

  if (!/^\d+$/.test(id)) {
    return invalidIdResponse();
  }

  try {
    const djangoResponse = await fetch(
      `${API_URL}/api/artworks/manage/images/${id}/`,
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
      "Unable to delete artwork image:",
      error,
    );

    return NextResponse.json(
      {
        detail: "Unable to delete the image.",
      },
      {
        status: 503,
      },
    );
  }
}