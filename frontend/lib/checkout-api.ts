import type { CartProductType } from "@/types/cart";
import type { StudioOrder } from "@/types/order";

export type CheckoutData = {
  items: Array<{
    artwork_id: number;
    product_type: CartProductType;
    quantity: number;
  }>;

  customer_phone: string;

  address_line_1: string;
  address_line_2: string;
  city: string;
  postcode: string;
  country_code: string;

  note: string;
};

async function getCheckoutError(
  response: Response,
): Promise<string> {
  try {
    const data: unknown =
      await response.json();

    if (
      typeof data === "object" &&
      data !== null
    ) {
      const errorObject = data as Record<
        string,
        unknown
      >;

      if (
        typeof errorObject.detail ===
        "string"
      ) {
        return errorObject.detail;
      }

      for (const value of Object.values(
        errorObject,
      )) {
        if (
          Array.isArray(value) &&
          typeof value[0] === "string"
        ) {
          return value[0];
        }

        if (typeof value === "string") {
          return value;
        }
      }
    }
  } catch {
    // Response did not contain valid JSON.
  }

  return "Unable to create your order.";
}

export async function createCheckoutOrder(
  checkoutData: CheckoutData,
): Promise<StudioOrder> {
  const response = await fetch(
    "/api/checkout",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkoutData),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getCheckoutError(response),
    );
  }

  return response.json();
}