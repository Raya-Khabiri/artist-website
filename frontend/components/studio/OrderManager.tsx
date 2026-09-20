"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getStudioOrders } from "@/lib/studio-api";
import type { OrderStatus, StudioOrder } from "@/types/order";

const statusOptions: Array<{
  value: "" | OrderStatus;
  label: string;
}> = [
  {
    value: "",
    label: "All orders",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "paid",
    label: "Paid",
  },
  {
    value: "processing",
    label: "Processing",
  },
  {
    value: "shipped",
    label: "Shipped",
  },
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
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function OrderManager() {
  const [orders, setOrders] = useState<StudioOrder[]>([]);

  const [selectedStatus, setSelectedStatus] = useState<"" | OrderStatus>("");

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      setIsLoading(true);
      setError("");

      try {
        const result = await getStudioOrders(selectedStatus || undefined);

        if (isMounted) {
          setOrders(result);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load orders.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [selectedStatus]);

  return (
    <section>
      <div className="flex flex-col gap-5 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
            Order records
          </p>

          <p className="mt-3 text-sm text-black/55">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </p>
        </div>

        <label className="block">
          <span className="block text-[9px] uppercase tracking-[0.22em] text-black/40">
            Filter by status
          </span>

          <select
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value as "" | OrderStatus)
            }
            className="mt-2 min-w-48 border border-black/15 bg-[#faf9f6] px-4 py-3 text-sm outline-none"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="mt-8 text-sm text-[#9b1c1c]">{error}</p>}

      {isLoading ? (
        <p className="mt-10 text-sm text-black/45">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="mt-10 border border-black/10 bg-white/25 p-10">
          <p className="font-serif text-2xl font-light">No orders found</p>

          <p className="mt-3 text-sm leading-6 text-black/50">
            Orders will appear here after customers complete the purchase flow.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-black/10">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/studio/orders/${order.id}`}
              className="grid gap-5 py-7 transition hover:bg-black/[0.025] sm:grid-cols-[1.2fr_1fr_auto]"
            >
              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-[#9b1c1c]">
                  {order.status_display}
                </p>

                <h2 className="mt-3 font-serif text-2xl font-light">
                  {order.customer_name}
                </h2>

                <p className="mt-2 text-sm text-black/45">
                  {order.customer_email}
                </p>
              </div>

              <div className="text-sm text-black/55">
                <p>
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </p>

                <p className="mt-2">{formatDate(order.created_at)}</p>
              </div>

              <div className="sm:text-right">
                <p className="font-serif text-xl">
                  {formatPrice(order.total_price, order.currency)}
                </p>

                <p className="mt-2 font-mono text-[10px] text-black/35">
                  {order.reference.slice(0, 8)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
