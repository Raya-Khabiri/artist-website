export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export type OrderItem = {
  id: number;
  artwork: number;
  artwork_title: string;
  artwork_slug: string;
  artwork_image: string | null;
  product_type: "original" | "print";
  product_type_display: string;
  quantity: number;
  unit_price: string;
};

export type StudioOrder = {
  id: number;
  reference: string;
  customer: number | null;

  customer_name: string;
  customer_email: string;
  customer_phone: string;

  address: string;
  note: string;

  status: OrderStatus;
  status_display: string;

  total_price: string;
  currency: string;

  items: OrderItem[];

  created_at: string;
  updated_at: string;
};

export type StudioOrderListResponse =
  | StudioOrder[]
  | {
      count: number;
      next: string | null;
      previous: string | null;
      results: StudioOrder[];
    };