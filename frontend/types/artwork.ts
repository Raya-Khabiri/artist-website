export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type Technique = {
  id: number;
  name: string;
  slug: string;
};

export type ArtworkImage = {
  id: number;
  image: string;
  alt_text: string;
};

export type SaleStatus =
  | "available"
  | "sold"
  | "reserved"
  | "not_for_sale";

export type Artwork = {
  id: number;
  title: string;
  slug: string;

  category: Category | null;
  technique: Technique | null;

  short_description: string;
  description: string;

  main_image: string;
  main_image_alt: string;

  original_price: string | null;
  print_price: string | null;
  currency: string;
  show_price: boolean;

  sale_status: SaleStatus;
  original_available: boolean;
  print_available: boolean;
  stock: number;

  size: string;
  width_mm: string | null;
  height_mm: string | null;

  medium: string;
  year: number | null;

  is_featured: boolean;
  is_published: boolean;
  display_order: number;

  images: ArtworkImage[];

  created_at: string;
  updated_at: string;
};