"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { getConversation, sendMessage } from "@/lib/conversation-api";
import type { Conversation } from "@/types/conversation";

export default function ConversationThread({
  conversationId,
}: {
  conversationId: string;
}) {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [conversation, setConversation] = useState<Conversation | null>(null);

  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!user) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadConversation() {
      try {
        const data = await getConversation(conversationId);

        if (isMounted) {
          setConversation(data);
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load this conversation.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadConversation();

    return () => {
      isMounted = false;
    };
  }, [conversationId, user, isAuthLoading]);

  async function handleReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedReply = reply.trim();

    if (!trimmedReply || !conversation) {
      return;
    }

    setError("");
    setIsSending(true);

    try {
      const newMessage = await sendMessage(conversation.id, trimmedReply);

      setConversation({
        ...conversation,
        messages: [...conversation.messages, newMessage],
      });

      setReply("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to send your reply.",
      );
    } finally {
      setIsSending(false);
    }
  }

  if (isAuthLoading || isLoading) {
    return <p className="text-sm text-black/45">Loading conversation...</p>;
  }

  if (!user) {
    return (
      <div>
        <p className="text-black/60">
          Please sign in to view this conversation.
        </p>

        <Link
          href="/login"
          className="
            mt-6
            inline-block
            border
            border-[#171717]
            px-6
            py-3
            text-xs
            uppercase
            tracking-[0.25em]
          "
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (error && !conversation) {
    return <p className="text-[#9b1c1c]">{error}</p>;
  }

  if (!conversation) {
    return null;
  }

  return (
    <div>
      <div
        className="
          flex
          flex-wrap
          items-start
          justify-between
          gap-6
          border-b
          border-black/15
          pb-8
        "
      >
        <div>
          <p
            className="
              text-xs
              uppercase
              tracking-[0.25em]
              text-black/40
            "
          >
            Conversation #{conversation.id}
          </p>

          <h1
            className="
              mt-4
              font-serif
              text-4xl
              font-light
              md:text-5xl
            "
          >
            {conversation.subject}
          </h1>

          {user.is_staff && conversation.customer.email && (
            <div
              className="
                  mt-6
                  border-l-2
                  border-[#9b1c1c]
                  pl-4
                "
            >
              <p
                className="
                    text-[10px]
                    uppercase
                    tracking-[0.25em]
                    text-black/40
                  "
              >
                Customer
              </p>

              <p
                className="
                    mt-2
                    font-serif
                    text-xl
                    font-light
                    text-black/75
                  "
              >
                {conversation.customer.full_name ||
                  `${conversation.customer.first_name ?? ""} ${
                    conversation.customer.last_name ?? ""
                  }`.trim() ||
                  "Customer"}
              </p>

              <a
                href={`mailto:${conversation.customer.email}`}
                className="
                    mt-1
                    inline-block
                    text-sm
                    text-black/55
                    underline
                    underline-offset-4
                    transition
                    hover:text-[#9b1c1c]
                  "
              >
                {conversation.customer.email}
              </a>
            </div>
          )}
        </div>

        <span
          className="
            text-xs
            uppercase
            tracking-[0.25em]
            text-[#9b1c1c]
          "
        >
          {conversation.status}
        </span>
      </div>

      <div className="space-y-6 py-10">
        {conversation.messages.map((message) => {
          const isOwnMessage = message.sender.id === user.id;

          return (
            <article
              key={message.id}
              className={`
                  max-w-2xl
                  border
                  px-6
                  py-5
                  ${
                    isOwnMessage
                      ? "ml-auto border-black/15 bg-white/35"
                      : "mr-auto border-[#9b1c1c]/25 bg-[#9b1c1c]/[0.04]"
                  }
                `}
            >
              <div
                className="
                    flex
                    flex-wrap
                    justify-between
                    gap-4
                    text-[10px]
                    uppercase
                    tracking-[0.2em]
                    text-black/40
                  "
              >
                <span>
                  {isOwnMessage
                    ? "You"
                    : message.sender.is_staff
                      ? "Artist"
                      : message.sender.full_name || "Customer"}
                </span>

                <time>
                  {new Date(message.created_at).toLocaleString("en-GB")}
                </time>
              </div>

              <p
                className="
                    mt-4
                    whitespace-pre-wrap
                    leading-8
                    text-black/75
                  "
              >
                {message.body}
              </p>
            </article>
          );
        })}
      </div>

      {conversation.status === "open" ? (
        <form
          onSubmit={handleReply}
          className="
            border-t
            border-black/15
            pt-8
          "
        >
          <label
            htmlFor="reply"
            className="
              text-xs
              uppercase
              tracking-[0.25em]
              text-black/50
            "
          >
            Your reply
          </label>

          <textarea
            id="reply"
            required
            rows={5}
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            className="
              mt-4
              w-full
              resize-y
              border
              border-black/15
              bg-transparent
              p-5
              leading-7
              outline-none
              transition
              focus:border-[#9b1c1c]
            "
          />

          {error && (
            <p
              role="alert"
              className="
                mt-4
                text-sm
                text-[#9b1c1c]
              "
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSending}
            className="
              mt-6
              border
              border-[#171717]
              px-7
              py-4
              text-xs
              uppercase
              tracking-[0.25em]
              transition
              hover:bg-[#171717]
              hover:text-[#f4f1eb]
              disabled:opacity-50
            "
          >
            {isSending ? "Sending..." : "Send reply"}
          </button>
        </form>
      ) : (
        <p
          className="
            border-t
            border-black/15
            pt-8
            text-sm
            text-black/50
          "
        >
          This conversation is closed.
        </p>
      )}
    </div>
  );
}
