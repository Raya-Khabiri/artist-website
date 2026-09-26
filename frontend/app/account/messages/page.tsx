import type { Metadata } from "next";

import ConversationList from "@/components/account/ConversationList";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Container from "@/components/ui/Container";
import ContactMessageForm from "@/components/contact/ContactMessageForm";

export const metadata: Metadata = {
  title: "Messages | EAMORA",
  description: "View your private conversations with EAMORA.",
};

export default function MessagesPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f4f1eb] pb-28 pt-40 text-[#171717] md:pb-40 md:pt-52">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-xs uppercase tracking-[0.35em] text-black/45">
                Your account
              </p>

              <h1 className="mt-6 font-serif text-5xl font-light md:text-7xl">
                Messages
              </h1>

              <p className="mt-8 max-w-sm leading-8 text-black/60">
                Your private enquiries and replies from the artist are saved
                here.
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <ConversationList />
            </div>
          </div>
          <div className="mt-20 border-t border-black/10 pt-16">
            <div className="mr-auto max-w-2xl">
              <ContactMessageForm
                redirectAfterSubmit
                title="Start a new conversation"
              />
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
