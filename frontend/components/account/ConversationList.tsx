"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { getConversations } from "@/lib/conversation-api";
import type { Conversation } from "@/types/conversation";

export default function ConversationList() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!user) {
      return;
    }

    let isMounted = true;

    async function loadConversations() {
      try {
        const data = await getConversations();

        if (isMounted) {
          setConversations(data);
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load conversations.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadConversations();

    return () => {
      isMounted = false;
    };
  }, [user, isAuthLoading]);

  if (isAuthLoading) {
    return (
      <p className="border-t border-black/15 pt-8 text-sm text-black/45">
        Loading conversations...
      </p>
    );
  }

  if (!user) {
    return (
      <div className="border-t border-black/15 pt-8">
        <p className="text-black/60">
          Sign in to view your private conversations.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-block border border-[#171717] px-6 py-3 text-xs uppercase tracking-[0.25em] transition hover:bg-[#171717] hover:text-[#f4f1eb]"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <p role="alert" className="border-t border-black/15 pt-8 text-[#9b1c1c]">
        {error}
      </p>
    );
  }

  if (isLoading) {
    return (
      <p className="border-t border-black/15 pt-8 text-sm text-black/45">
        Loading conversations...
      </p>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="border-t border-black/15 pt-8">
        <p className="text-black/60">You do not have any conversations yet.</p>

        <Link
          href="/contact"
          className="mt-6 inline-block text-sm underline underline-offset-4 hover:text-[#9b1c1c]"
        >
          Send an enquiry
        </Link>
      </div>
    );
  }

  return (
    <div className="border-t border-black/15">
      {conversations.map((conversation) => {
        const lastMessage =
          conversation.messages[conversation.messages.length - 1];

        return (
          <Link
            key={conversation.id}
            href={`/account/messages/${conversation.id}`}
            className={`
              grid
              gap-4
              border-b
              py-8
              transition
              hover:pl-2
              md:grid-cols-[1fr_auto]
              ${
                conversation.unread_count > 0
                  ? "border-[#9b1c1c]/30 bg-[#9b1c1c]/[0.035] px-3"
                  : "border-black/15"
              }
              `}
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2
                  className={`
                    font-serif
                    text-2xl

                    ${
                      conversation.unread_count > 0
                        ? "font-semibold text-black"
                        : "font-light text-black/80"
                    }
                  `}
                >
                  {conversation.subject}
                </h2>

                <span className="text-[10px] uppercase tracking-[0.2em] text-[#9b1c1c]">
                  {conversation.unread_count > 0 && (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-[#9b1c1c]
                        px-3
                        py-1
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-white
                        shadow-[0_3px_12px_rgba(155,28,28,0.18)]
                      "
                    >
                      <span
                        aria-hidden="true"
                        className="
                          h-1.5
                          w-1.5
                          rounded-full
                          bg-white
                        "
                      />

                      {conversation.unread_count > 99
                        ? "99+ new"
                        : `${conversation.unread_count} new`}
                    </span>
                  )}
                </span>
              </div>

              {lastMessage && (
                <p className="mt-3 line-clamp-1 text-sm text-black/55">
                  {lastMessage.body}
                </p>
              )}
            </div>

            <time className="text-xs uppercase tracking-[0.15em] text-black/40">
              {new Date(conversation.updated_at).toLocaleDateString("en-GB")}
            </time>
          </Link>
        );
      })}
    </div>
  );
}
