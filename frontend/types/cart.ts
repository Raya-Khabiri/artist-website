export type CartProductType =
  | "original"
  | "print";

export type CartItem = {
  artworkId: number;
  slug: string;
  title: string;
  image: string | null;

  productType: CartProductType;
  quantity: number;

  unitPrice: string;
  currency: string;

  maxQuantity: number;
};

export type AddCartItemData = CartItem;