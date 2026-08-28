import type { AuthUser } from "@/types/auth";

export type ConversationMessage = {
  id: number;
  sender: AuthUser;
  body: string;
  read_at: string | null;
  created_at: string;
};

export type Conversation = {
  id: number;
  subject: string;
  status: "open" | "closed";
  customer: AuthUser;
  assigned_artist: AuthUser | null;
  messages: ConversationMessage[];
  created_at: string;
  updated_at: string;
};

export type CreateConversationData = {
  subject: string;
  message: string;
};