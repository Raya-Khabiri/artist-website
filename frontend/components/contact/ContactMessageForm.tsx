"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { createConversation } from "@/lib/conversation-api";

export default function ContactMessageForm() {
  const { user, isLoading } = useAuth();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setConversationId(null);
    setIsSubmitting(true);

    try {
      const conversation = await createConversation({
        subject: subject.trim(),
        message: message.trim(),
      });

      setConversationId(conversation.id);
      setSubject("");
      setMessage("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to send your message.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="border-t border-black/15 pt-8">
        <p className="text-sm text-black/45">Loading your account...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="border-t border-black/15 pt-8">
        <p className="font-serif text-2xl font-light">Send a private enquiry</p>

        <p className="mt-5 max-w-md leading-7 text-black/60">
          Sign in or create an account to send a message and continue your
          conversation with the artist.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/login"
            className="border border-[#171717] px-6 py-3 text-xs uppercase tracking-[0.25em] transition hover:bg-[#171717] hover:text-[#f4f1eb]"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="border border-black/20 px-6 py-3 text-xs uppercase tracking-[0.25em] transition hover:border-[#171717]"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  const inputClassName =
    "mt-3 w-full border-b border-black/20 bg-transparent py-3 text-lg outline-none transition focus:border-[#9b1c1c]";

  return (
    <form onSubmit={handleSubmit} className="border-t border-black/15 pt-8">
      <div className="mb-8">
        <p className="font-serif text-2xl font-light">Send a private enquiry</p>

        <p className="mt-3 text-sm text-black/50">
          Signed in as {user.full_name || "EAMORA customer"}
        </p>
      </div>

      <div>
        <label
          htmlFor="message-subject"
          className="text-xs uppercase tracking-[0.25em] text-black/50"
        >
          Subject
        </label>

        <input
          id="message-subject"
          type="text"
          required
          maxLength={200}
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className={inputClassName}
        />
      </div>

      <div className="mt-8">
        <label
          htmlFor="message-body"
          className="text-xs uppercase tracking-[0.25em] text-black/50"
        >
          Message
        </label>

        <textarea
          id="message-body"
          required
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={`${inputClassName} resize-y leading-7`}
        />
      </div>

      {error && (
        <p role="alert" className="mt-6 text-sm text-[#9b1c1c]">
          {error}
        </p>
      )}

      {conversationId && (
        <div
          role="status"
          className="mt-6 border-l-2 border-[#9b1c1c] pl-4 text-sm leading-6 text-black/65"
        >
          Your message was sent successfully. Conversation #{conversationId}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-10 w-full border border-[#171717] px-6 py-4 text-xs uppercase tracking-[0.3em] transition hover:bg-[#171717] hover:text-[#f4f1eb] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
