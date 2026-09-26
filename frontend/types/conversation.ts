import type { AuthUser } from "@/types/auth";

export type ConversationCustomer = {
  id: number;
  full_name: string;
  is_staff: boolean;

  first_name?: string;
  last_name?: string;
  email?: string;
};

export type ConversationMessage = {
  id: number;
  sender: {
    id: number;
    full_name: string;
    is_staff: boolean;
  };
  body: string;
  read_at: string | null;
  created_at: string;
};

export type Conversation = {
  id: number;
  subject: string;
  status: "open" | "closed";
  customer: ConversationCustomer;
  assigned_artist: AuthUser | null;
  messages: ConversationMessage[];
  created_at: string;
  updated_at: string;
  unread_count: number;
};

export type CreateConversationData = {
  subject: string;
  message: string;
};