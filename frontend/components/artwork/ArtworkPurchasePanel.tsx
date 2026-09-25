"use client";

import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/cart/CartProvider";
import type { CartProductType } from "@/types/cart";

type ArtworkPurchasePanelProps = {
  artworkId: number;
  slug: string;
  title: string;
  image: string | null;

  currency: string;

  originalAvailable: boolean;
  originalPrice: string | null;

  printAvailable: boolean;
  printPrice: string | null;
  printStock: number;
};

function formatPrice(value: string, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(Number(value));
}

export default function ArtworkPurchasePanel({
  artworkId,
  slug,
  title,
  image,
  currency,
  originalAvailable,
  originalPrice,
  printAvailable,
  printPrice,
  printStock,
}: ArtworkPurchasePanelProps) {
  const { addItem } = useCart();

  const defaultProductType: CartProductType | null = originalAvailable
    ? "original"
    : printAvailable
      ? "print"
      : null;

  const [productType, setProductType] = useState<CartProductType | null>(
    defaultProductType,
  );

  const [quantity, setQuantity] = useState(1);

  const [wasAdded, setWasAdded] = useState(false);

  if (!productType) {
    return (
      <div className="mt-10 border-t border-black/15 pt-7">
        <p className="text-sm text-black/50">
          This artwork is currently unavailable for online purchase.
        </p>

        <Link
          href={`/contact?artwork=${encodeURIComponent(title)}`}
          className="mt-6 inline-flex border-b border-black pb-2 text-xs uppercase tracking-[0.2em]"
        >
          Contact the artist
        </Link>
      </div>
    );
  }

  const selectedPrice = productType === "original" ? originalPrice : printPrice;

  function handleAddToCart() {
    if (!productType || !selectedPrice) {
      return;
    }

    addItem({
      artworkId,
      slug,
      title,
      image,
      productType,
      quantity: productType === "original" ? 1 : quantity,
      unitPrice: selectedPrice,
      currency,
      maxQuantity: productType === "original" ? 1 : printStock,
    });

    setWasAdded(true);
  }

  return (
    <div className="mt-10 border-t border-black/15 pt-7">
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#9b1c1c]">
        Purchase
      </p>

      <div className="mt-5 grid gap-3">
        {originalAvailable && originalPrice && (
          <label className="flex cursor-pointer items-center justify-between gap-5 border border-black/15 px-4 py-4">
            <span className="flex items-center gap-3">
              <input
                type="radio"
                name={`product-${artworkId}`}
                value="original"
                checked={productType === "original"}
                onChange={() => {
                  setProductType("original");
                  setQuantity(1);
                  setWasAdded(false);
                }}
                className="accent-[#9b1c1c]"
              />

              <span className="text-sm">Original</span>
            </span>

            <span className="font-serif text-lg">
              {formatPrice(originalPrice, currency)}
            </span>
          </label>
        )}

        {printAvailable && printPrice && (
          <label className="flex cursor-pointer items-center justify-between gap-5 border border-black/15 px-4 py-4">
            <span className="flex items-center gap-3">
              <input
                type="radio"
                name={`product-${artworkId}`}
                value="print"
                checked={productType === "print"}
                onChange={() => {
                  setProductType("print");
                  setWasAdded(false);
                }}
                className="accent-[#9b1c1c]"
              />

              <span className="text-sm">Print</span>
            </span>

            <span className="font-serif text-lg">
              {formatPrice(printPrice, currency)}
            </span>
          </label>
        )}
      </div>

      {productType === "print" && (
        <label className="mt-5 block">
          <span className="text-[10px] uppercase tracking-[0.2em] text-black/45">
            Quantity
          </span>

          <input
            type="number"
            min={1}
            max={printStock}
            value={quantity}
            onChange={(event) => {
              const nextQuantity = Number(event.target.value);

              setQuantity(Math.min(Math.max(nextQuantity || 1, 1), printStock));

              setWasAdded(false);
            }}
            className="mt-2 w-24 border border-black/15 bg-transparent px-4 py-3 outline-none"
          />
        </label>
      )}

      <button
        type="button"
        onClick={handleAddToCart}
        className="mt-6 w-full border border-[#171717] bg-[#171717] px-6 py-4 text-xs uppercase tracking-[0.22em] text-[#faf9f6] transition hover:bg-[#9b1c1c]"
      >
        Add to basket
      </button>

      {wasAdded && (
        <div className="mt-5 flex items-center justify-between gap-4 text-sm">
          <span className="text-green-800">Added to basket.</span>

          <Link
            href="/cart"
            className="border-b border-black/30 pb-1 text-xs uppercase tracking-[0.18em]"
          >
            View basket
          </Link>
        </div>
      )}
    </div>
  );
}
