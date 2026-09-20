"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type ChangeEvent } from "react";

import { getStudioOrder, updateStudioOrderStatus } from "@/lib/studio-api";
import type { OrderStatus, StudioOrder } from "@/types/order";

const statuses: Array<{
  value: OrderStatus;
  label: string;
}> = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  {
    value: "processing",
    label: "Processing",
  },
  { value: "shipped", label: "Shipped" },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

function formatPrice(value: string, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function StudioOrderDetailPage() {
  const params = useParams<{
    id: string;
  }>();

  const [order, setOrder] = useState<StudioOrder | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isUpdating, setIsUpdating] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      const orderId = Number(params.id);

      if (!Number.isInteger(orderId) || orderId <= 0) {
        if (isMounted) {
          setError("Invalid order ID.");
          setIsLoading(false);
        }

        return;
      }

      try {
        const result = await getStudioOrder(orderId);

        if (isMounted) {
          setOrder(result);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load this order.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  async function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    if (!order) {
      return;
    }

    const nextStatus = event.target.value as OrderStatus;

    setIsUpdating(true);
    setError("");
    setSuccessMessage("");

    try {
      const updatedOrder = await updateStudioOrderStatus(order.id, nextStatus);

      setOrder(updatedOrder);

      setSuccessMessage("Order status updated.");
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update order status.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f1eb]">
        <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
          Loading order...
        </p>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className="min-h-screen bg-[#f4f1eb] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-[#9b1c1c]">{error}</p>

          <Link
            href="/studio/orders"
            className="mt-6 inline-block border-b border-black/20 pb-1 text-sm"
          >
            Return to orders
          </Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f4f1eb] px-6 py-10 text-[#171717] sm:px-10 lg:px-16 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <header className="border-b border-black/10 pb-10">
          <Link
            href="/studio/orders"
            className="text-[9px] uppercase tracking-[0.28em] text-black/40 transition hover:text-[#9b1c1c]"
          >
            Back to orders
          </Link>

          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b1c1c]">
                Order
              </p>

              <h1 className="mt-4 font-serif text-4xl font-light sm:text-5xl">
                {order.customer_name}
              </h1>

              <p className="mt-4 font-mono text-xs text-black/40">
                {order.reference}
              </p>
            </div>

            <label className="block">
              <span className="block text-[9px] uppercase tracking-[0.22em] text-black/40">
                Order status
              </span>

              <select
                value={order.status}
                disabled={isUpdating}
                onChange={handleStatusChange}
                className="mt-2 min-w-52 border border-black/15 bg-[#faf9f6] px-4 py-3 text-sm outline-none disabled:opacity-50"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        {error && <p className="mt-6 text-sm text-[#9b1c1c]">{error}</p>}

        {successMessage && (
          <p className="mt-6 text-sm text-green-800">{successMessage}</p>
        )}

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_0.7fr]">
          <section>
            <h2 className="font-serif text-3xl font-light">Ordered items</h2>

            <div className="mt-6 divide-y divide-black/10 border-y border-black/10">
              {order.items.map((item) => (
                <article
                  key={item.id}
                  className="grid grid-cols-[1fr_auto] gap-6 py-6"
                >
                  <div>
                    <p className="font-serif text-xl">{item.artwork_title}</p>

                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-black/40">
                      {item.product_type_display}
                      {" · "}
                      Quantity {item.quantity}
                    </p>
                  </div>

                  <p className="font-serif text-lg">
                    {formatPrice(item.unit_price, order.currency)}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-black/45">
                Total
              </span>

              <span className="font-serif text-3xl">
                {formatPrice(order.total_price, order.currency)}
              </span>
            </div>
          </section>

          <aside className="border-t border-black/10 pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <h2 className="font-serif text-2xl font-light">Customer details</h2>

            <dl className="mt-6 space-y-6 text-sm">
              <div>
                <dt className="text-[9px] uppercase tracking-[0.2em] text-black/40">
                  Email
                </dt>

                <dd className="mt-2">
                  <a
                    href={`mailto:${order.customer_email}`}
                    className="transition hover:text-[#9b1c1c]"
                  >
                    {order.customer_email}
                  </a>
                </dd>
              </div>

              {order.customer_phone && (
                <div>
                  <dt className="text-[9px] uppercase tracking-[0.2em] text-black/40">
                    Phone
                  </dt>

                  <dd className="mt-2">{order.customer_phone}</dd>
                </div>
              )}

              <div>
                <dt className="text-[9px] uppercase tracking-[0.2em] text-black/40">
                  Shipping address
                </dt>

                <dd className="mt-2 whitespace-pre-line leading-6 text-black/65">
                  {order.address || "No address provided."}
                </dd>
              </div>

              {order.note && (
                <div>
                  <dt className="text-[9px] uppercase tracking-[0.2em] text-black/40">
                    Customer note
                  </dt>

                  <dd className="mt-2 whitespace-pre-line leading-6 text-black/65">
                    {order.note}
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-[9px] uppercase tracking-[0.2em] text-black/40">
                  Created
                </dt>

                <dd className="mt-2">{formatDate(order.created_at)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </main>
  );
}
