"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useCart } from "@/components/cart/CartProvider";
import type { StudioOrder } from "@/types/order";

type PaymentConfirmationProps = {
  sessionId: string | null;
};

type ConfirmationResponse = {
  order: StudioOrder;
  payment_status: string;
};

type ConfirmationState = "verifying" | "paid" | "pending" | "error";

export default function PaymentConfirmation({
  sessionId,
}: PaymentConfirmationProps) {
  const { clearCart } = useCart();

  const [state, setState] = useState<ConfirmationState>("verifying");

  const [reference, setReference] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function verifyPayment() {
      if (!sessionId) {
        if (isActive) {
          setError("The checkout session is missing.");
          setState("error");
        }

        return;
      }

      try {
        const response = await fetch(
          `/api/checkout/confirm?session_id=${encodeURIComponent(sessionId)}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const data = (await response.json()) as
          | ConfirmationResponse
          | {
              detail?: string;
            };

        if (!response.ok) {
          throw new Error(
            "detail" in data && typeof data.detail === "string"
              ? data.detail
              : "Unable to verify payment.",
          );
        }

        const confirmation = data as ConfirmationResponse;

        if (!isActive) {
          return;
        }

        setReference(confirmation.order.reference);

        if (confirmation.payment_status === "paid") {
          clearCart();
          setState("paid");
        } else {
          setState("pending");
        }
      } catch (verificationError) {
        if (!isActive) {
          return;
        }

        setError(
          verificationError instanceof Error
            ? verificationError.message
            : "Unable to verify payment.",
        );

        setState("error");
      }
    }

    void verifyPayment();

    return () => {
      isActive = false;
    };
  }, [sessionId, clearCart]);

  if (state === "verifying") {
    return (
      <div className="border-y border-black/10 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-black/45">
          Verifying payment...
        </p>
      </div>
    );
  }

  const isPaid = state === "paid";

  return (
    <div className="border-y border-black/10 py-16 text-center">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b1c1c]">
        {isPaid
          ? "Payment confirmed"
          : state === "pending"
            ? "Payment processing"
            : "Payment verification"}
      </p>

      <h1 className="mt-5 font-serif text-4xl font-light sm:text-6xl">
        {isPaid
          ? "Thank you"
          : state === "pending"
            ? "Almost complete"
            : "We could not confirm payment"}
      </h1>

      <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-black/55">
        {isPaid
          ? "Your payment was successful and your order has been confirmed."
          : state === "pending"
            ? "Your payment is still processing. Please do not submit another order."
            : error}
      </p>

      {reference && (
        <p className="mt-7 font-mono text-xs text-black/40">
          Reference: {reference}
        </p>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/gallery"
          className="border border-[#171717] bg-[#171717] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#faf9f6]"
        >
          Return to gallery
        </Link>

        <Link
          href="/account/messages"
          className="border border-black/20 px-6 py-3 text-xs uppercase tracking-[0.2em]"
        >
          Contact the artist
        </Link>
      </div>
    </div>
  );
}
