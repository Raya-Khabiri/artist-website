"use client";

import Link from "next/link";

import { useCart } from "@/components/cart/CartProvider";

function formatPrice(value: number, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(value);
}

export default function CartView() {
  const { items, itemCount, total, currency, updateQuantity, removeItem } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="border-y border-black/10 py-16">
        <h1 className="font-serif text-4xl font-light sm:text-5xl">
          Your basket is empty
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-7 text-black/55">
          Explore the gallery and choose an original artwork or available print.
        </p>

        <Link
          href="/gallery"
          className="mt-8 inline-flex border-b border-black pb-2 text-xs uppercase tracking-[0.22em]"
        >
          Explore gallery
        </Link>
      </div>
    );
  }

  return (
    <>
      <header className="border-b border-black/10 pb-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b1c1c]">
          Selected artworks
        </p>

        <h1 className="mt-4 font-serif text-4xl font-light sm:text-5xl">
          Your basket
        </h1>

        <p className="mt-4 text-sm text-black/45">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
      </header>

      <div className="mt-10 grid gap-14 lg:grid-cols-[1fr_340px]">
        <section className="divide-y divide-black/10 border-y border-black/10">
          {items.map((item) => (
            <article
              key={`${item.artworkId}-${item.productType}`}
              className="grid gap-6 py-7 sm:grid-cols-[120px_1fr_auto]"
            >
              <Link
                href={`/gallery/${item.slug}`}
                className="block aspect-square overflow-hidden bg-black/5"
              >
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-xs text-black/35">
                    No image
                  </span>
                )}
              </Link>

              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-[#9b1c1c]">
                  {item.productType}
                </p>

                <Link
                  href={`/gallery/${item.slug}`}
                  className="mt-3 block font-serif text-2xl font-light transition hover:text-[#9b1c1c]"
                >
                  {item.title}
                </Link>

                {item.productType === "print" && (
                  <label className="mt-5 block">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-black/40">
                      Quantity
                    </span>

                    <input
                      type="number"
                      min={1}
                      max={item.maxQuantity}
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(
                          item.artworkId,
                          item.productType,
                          Number(event.target.value),
                        )
                      }
                      className="mt-2 w-20 border border-black/15 bg-transparent px-3 py-2"
                    />
                  </label>
                )}

                <button
                  type="button"
                  onClick={() => removeItem(item.artworkId, item.productType)}
                  className="mt-5 text-[10px] uppercase tracking-[0.18em] text-black/40 underline underline-offset-4 transition hover:text-[#9b1c1c]"
                >
                  Remove
                </button>
              </div>

              <p className="font-serif text-xl sm:text-right">
                {formatPrice(
                  Number(item.unitPrice) * item.quantity,
                  item.currency,
                )}
              </p>
            </article>
          ))}
        </section>

        <aside className="h-fit border border-black/10 bg-white/30 p-7">
          <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">
            Order summary
          </p>

          <div className="mt-6 flex items-center justify-between border-b border-black/10 pb-6">
            <span className="text-sm text-black/55">Subtotal</span>

            <span className="font-serif text-2xl">
              {formatPrice(total, currency)}
            </span>
          </div>

          <p className="mt-5 text-xs leading-6 text-black/45">
            Shipping costs and final availability will be confirmed during
            checkout.
          </p>

          <Link
            href="/checkout"
            className="mt-7 flex w-full justify-center border border-[#171717] bg-[#171717] px-6 py-4 text-xs uppercase tracking-[0.22em] text-[#faf9f6] transition hover:bg-[#9b1c1c]"
          >
            Continue to checkout
          </Link>

          <Link
            href="/gallery"
            className="mt-5 flex justify-center text-[10px] uppercase tracking-[0.2em] text-black/45"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </>
  );
}
