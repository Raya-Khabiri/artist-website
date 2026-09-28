"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AddCartItemData, CartItem } from "@/types/cart";

const STORAGE_KEY = "eamora_cart";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  total: number;
  currency: string;

  addItem: (item: AddCartItemData) => void;

  updateQuantity: (
    artworkId: number,
    productType: CartItem["productType"],
    quantity: number,
  ) => void;

  removeItem: (artworkId: number, productType: CartItem["productType"]) => void;

  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Partial<CartItem>;

  return (
    typeof item.artworkId === "number" &&
    typeof item.slug === "string" &&
    typeof item.title === "string" &&
    (item.productType === "original" || item.productType === "print") &&
    typeof item.quantity === "number" &&
    typeof item.unitPrice === "string" &&
    typeof item.currency === "string" &&
    typeof item.maxQuantity === "number"
  );
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      try {
        const storedCart = window.localStorage.getItem(STORAGE_KEY);

        if (storedCart) {
          const parsedCart: unknown = JSON.parse(storedCart);

          if (Array.isArray(parsedCart)) {
            setItems(parsedCart.filter(isCartItem));
          }
        }
      } catch (error) {
        console.error("Unable to restore cart:", error);

        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setHasLoaded(true);
      }
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
    };
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hasLoaded, items]);

  function addItem(newItem: AddCartItemData) {
    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (item) =>
          item.artworkId === newItem.artworkId &&
          item.productType === newItem.productType,
      );

      if (existingIndex === -1) {
        return [
          ...currentItems,
          {
            ...newItem,
            quantity:
              newItem.productType === "original"
                ? 1
                : Math.min(Math.max(newItem.quantity, 1), newItem.maxQuantity),
          },
        ];
      }

      return currentItems.map((item, index) => {
        if (index !== existingIndex) {
          return item;
        }

        if (newItem.productType === "original") {
          return {
            ...item,
            ...newItem,
            quantity: 1,
          };
        }

        return {
          ...item,
          ...newItem,
          quantity: Math.min(
            item.quantity + newItem.quantity,
            newItem.maxQuantity,
          ),
        };
      });
    });
  }

  function updateQuantity(
    artworkId: number,
    productType: CartItem["productType"],
    quantity: number,
  ) {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.artworkId !== artworkId || item.productType !== productType) {
          return item;
        }

        return {
          ...item,
          quantity:
            productType === "original"
              ? 1
              : Math.min(Math.max(quantity, 1), item.maxQuantity),
        };
      }),
    );
  }

  function removeItem(artworkId: number, productType: CartItem["productType"]) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(item.artworkId === artworkId && item.productType === productType),
      ),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const total = items.reduce(
    (currentTotal, item) =>
      currentTotal + Number(item.unitPrice) * item.quantity,
    0,
  );

  const currency = items[0]?.currency || "GBP";

  const value = useMemo(
    () => ({
      items,
      itemCount,
      total,
      currency,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, itemCount, total, currency],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}
