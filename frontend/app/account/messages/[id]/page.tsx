import type { Metadata } from "next";
import Link from "next/link";

import ConversationThread from "@/components/account/ConversationThread";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Conversation | EAMORA",
  description: "Continue your private conversation with EAMORA.",
};

export default async function ConversationPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f4f1eb] pb-28 pt-36 text-[#171717] md:pb-40 md:pt-44">
        <Container>
          <Link
            href="/account/messages"
            className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-black/45 transition hover:text-[#9b1c1c]"
          >
            <span aria-hidden="true">←</span>
            Back to messages
          </Link>

          <div className="mt-12">
            <ConversationThread conversationId={id} />
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
