import type {
  Conversation,
  ConversationMessage,
  CreateConversationData,
} from "@/types/conversation";

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();

    if (typeof data.detail === "string") {
      return data.detail;
    }

    const firstError = Object.values(data).flat()[0];

    if (typeof firstError === "string") {
      return firstError;
    }
  } catch {
    // The response did not contain valid JSON.
  }

  return "Something went wrong. Please try again.";
}

export async function createConversation(
  conversationData: CreateConversationData,
): Promise<Conversation> {
  const response = await fetch("/api/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(conversationData),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch("/api/conversations", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  return data.results ?? [];
}

export async function getConversation(
  id: number | string,
): Promise<Conversation> {
  const response = await fetch(`/api/conversations/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function sendMessage(
  conversationId: number | string,
  body: string,
): Promise<ConversationMessage> {
  const response = await fetch(
    `/api/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

type UnreadMessageCountResponse = {
  unread_count: number;
};

export async function getUnreadMessageCount(): Promise<number> {
  const response = await fetch(
    "/api/messages/unread-count",
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  const data: UnreadMessageCountResponse =
    await response.json();

  return Number.isFinite(data.unread_count)
    ? data.unread_count
    : 0;
}