"use client";

import { useRouter } from "next/navigation";

type GallerySortProps = {
  activeOrdering?: string;
  activeCategory?: string;
  activeTechnique?: string;
  availableOnly?: boolean;
};

export default function GallerySort({
  activeOrdering,
  activeCategory,
  activeTechnique,
  availableOnly = false,
}: GallerySortProps) {
  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams();

    if (activeCategory) {
      params.set("category", activeCategory);
    }

    if (activeTechnique) {
      params.set("technique", activeTechnique);
    }

    if (availableOnly) {
      params.set("available", "true");
    }

    if (event.target.value) {
      params.set("ordering", event.target.value);
    }

    const query = params.toString();

    router.push(query ? `/gallery?${query}` : "/gallery");
  }

  return (
    <label className="flex items-center gap-4">
      <span className="text-[10px] uppercase tracking-[0.22em] text-black/40">
        Sort
      </span>

      <select
        value={activeOrdering || ""}
        onChange={handleChange}
        aria-label="Sort artworks"
        className="
          cursor-pointer
          border-0
          border-b
          border-black/20
          bg-transparent
          pb-1
          text-[10px]
          uppercase
          tracking-[0.16em]
          text-black/65
          outline-none
          transition
          focus:border-[#9b1c1c]
        "
      >
        <option value="">Curated order</option>

        <option value="price_asc">Price: low to high</option>

        <option value="price_desc">Price: high to low</option>

        <option value="size_asc">Size: small to large</option>

        <option value="size_desc">Size: large to small</option>
      </select>
    </label>
  );
}
