export type StudioArtwork = {
  id: number;
  title: string;
  slug: string;

  category: number | null;
  technique: number | null;

  short_description: string;
  description: string;

  main_image: string | null;
  main_image_alt: string;

  original_price: string | null;
  print_price: string | null;
  currency: string;
  show_price: boolean;

  sale_status:
    | "available"
    | "sold"
    | "reserved"
    | "not_for_sale";

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

  created_at: string;
  updated_at: string;
};

export type StudioArtworkListResponse =
  | StudioArtwork[]
  | {
      count: number;
      next: string | null;
      previous: string | null;
      results: StudioArtwork[];
    };