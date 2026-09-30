"use client";

import Link from "next/link";

import { useState, type FormEvent } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/components/cart/CartProvider";
import { createCheckoutOrder } from "@/lib/checkout-api";

const inputClassName = `
  mt-3
  w-full
  border
  border-black/15
  bg-white/40
  px-4
  py-3
  outline-none
  transition
  focus:border-[#9b1c1c]
`;

const labelClassName = `
  text-xs
  uppercase
  tracking-[0.18em]
  text-black/45
`;

function formatPrice(value: number, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(value);
}

export default function CheckoutForm() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const { items, total, currency } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  if (isAuthLoading) {
    return <p className="text-sm text-black/45">Loading your account...</p>;
  }

  if (!user) {
    return (
      <div className="border border-black/10 bg-white/30 p-8">
        <p className="font-serif text-3xl font-light">Sign in to checkout</p>

        <p className="mt-4 max-w-lg text-sm leading-7 text-black/55">
          Your EAMORA account keeps your order details and purchase history
          private.
        </p>

        <div className="mt-7 flex flex-wrap gap-4">
          <Link
            href="/login?next=/checkout"
            className="border border-[#171717] bg-[#171717] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#faf9f6]"
          >
            Sign in
          </Link>

          <Link
            href="/register?next=/checkout"
            className="border border-black/20 px-6 py-3 text-xs uppercase tracking-[0.2em]"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="border-y border-black/10 py-14">
        <p className="font-serif text-3xl font-light">Your basket is empty</p>

        <Link
          href="/gallery"
          className="mt-7 inline-flex border-b border-black pb-2 text-xs uppercase tracking-[0.2em]"
        >
          Return to gallery
        </Link>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const checkout = await createCheckoutOrder({
        items: items.map((item) => ({
          artwork_id: item.artworkId,
          product_type: item.productType,
          quantity: item.quantity,
        })),

        customer_phone: String(formData.get("customer_phone") || ""),

        address_line_1: String(formData.get("address_line_1") || ""),

        address_line_2: String(formData.get("address_line_2") || ""),

        city: String(formData.get("city") || ""),

        postcode: String(formData.get("postcode") || ""),

        country_code: String(formData.get("country_code") || "GB"),

        note: String(formData.get("note") || ""),
      });

      const checkoutUrl = new URL(checkout.checkout_url);

      if (
        checkoutUrl.protocol !== "https:" ||
        checkoutUrl.hostname !== "checkout.stripe.com"
      ) {
        throw new Error("The payment provider returned an invalid URL.");
      }

      window.location.assign(checkoutUrl.toString());
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create your order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-14 lg:grid-cols-[1fr_340px]">
      <form onSubmit={handleSubmit} className="space-y-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b1c1c]">
            Shipping details
          </p>

          <h1 className="mt-4 font-serif text-4xl font-light sm:text-5xl">
            Checkout
          </h1>

          <p className="mt-4 text-sm text-black/50">
            Ordering as {user.full_name}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className={labelClassName}>Address line 1</span>

            <input
              name="address_line_1"
              type="text"
              required
              autoComplete="address-line1"
              className={inputClassName}
            />
          </label>

          <label className="block md:col-span-2">
            <span className={labelClassName}>Address line 2</span>

            <input
              name="address_line_2"
              type="text"
              autoComplete="address-line2"
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className={labelClassName}>City</span>

            <input
              name="city"
              type="text"
              required
              autoComplete="address-level2"
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className={labelClassName}>Postcode</span>

            <input
              name="postcode"
              type="text"
              required
              autoComplete="postal-code"
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className={labelClassName}>Country</span>

            <select
              name="country_code"
              defaultValue="GB"
              className={inputClassName}
            >
              <option value="GB">United Kingdom</option>
            </select>
          </label>

          <label className="block">
            <span className={labelClassName}>Phone (optional)</span>

            <input
              name="customer_phone"
              type="tel"
              autoComplete="tel"
              className={inputClassName}
            />
          </label>

          <label className="block md:col-span-2">
            <span className={labelClassName}>Order note (optional)</span>

            <textarea
              name="note"
              rows={4}
              maxLength={1000}
              className={inputClassName}
            />
          </label>
        </div>

        {error && <p className="text-sm text-[#9b1c1c]">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="border border-[#171717] bg-[#171717] px-8 py-4 text-xs uppercase tracking-[0.22em] text-[#faf9f6] transition hover:bg-[#9b1c1c] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Redirecting..." : "Continue to secure payment"}
        </button>
      </form>

      <aside className="h-fit border border-black/10 bg-white/30 p-7">
        <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">
          Order summary
        </p>

        <div className="mt-6 space-y-5">
          {items.map((item) => (
            <div
              key={`${item.artworkId}-${item.productType}`}
              className="flex justify-between gap-5 border-b border-black/10 pb-5"
            >
              <div>
                <p className="font-serif text-lg">{item.title}</p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-black/40">
                  {item.productType}
                  {" · "}
                  {item.quantity}
                </p>
              </div>

              <p className="text-sm">
                {formatPrice(
                  Number(item.unitPrice) * item.quantity,
                  item.currency,
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between gap-5">
          <span className="text-sm text-black/50">Total</span>

          <span className="font-serif text-2xl">
            {formatPrice(total, currency)}
          </span>
        </div>

        <p className="mt-6 text-xs leading-6 text-black/45">
          You will be redirected to Stripe to complete your payment securely.
        </p>
      </aside>
    </div>
  );
}
