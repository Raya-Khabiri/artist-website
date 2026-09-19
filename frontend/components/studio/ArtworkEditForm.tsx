"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { deleteStudioArtwork, updateStudioArtwork } from "@/lib/studio-api";
import type { StudioArtwork } from "@/types/studio";

type ArtworkEditFormProps = {
  artwork: StudioArtwork;
};

export default function ArtworkEditForm({ artwork }: ArtworkEditFormProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const mainImage = formData.get("main_image");

    if (mainImage instanceof File && mainImage.size === 0) {
      formData.delete("main_image");
    }

    const booleanFields = [
      "show_price",
      "original_available",
      "print_available",
      "is_featured",
      "is_published",
    ] as const;

    booleanFields.forEach((fieldName) => {
      const input = form.elements.namedItem(fieldName);

      if (input instanceof HTMLInputElement) {
        formData.set(fieldName, input.checked ? "true" : "false");
      }
    });

    formData.set("currency", "GBP");

    setIsSubmitting(true);
    setError(null);

    try {
      await updateStudioArtwork(artwork.id, formData);

      router.push("/studio/artworks");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create artwork.",
      );

      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete “${artwork.title}”? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteStudioArtwork(artwork.id);

      router.push("/studio/artworks");
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete artwork.",
      );

      setIsDeleting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        border
        border-black/10
        bg-[#f4f1eb]
        p-6

        sm:p-8
      "
    >
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="
            block
            text-[10px]
            uppercase
            tracking-[0.25em]
            text-black/45
          "
        >
          Artwork title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          defaultValue={artwork.title}
          className="
            mt-3
            w-full
            border
            border-black/15
            bg-transparent
            px-4
            py-3
            text-base
            outline-none
            transition

            focus:border-[#9b1c1c]
          "
        />
      </div>

      {/* Single description */}
      <div className="mt-7">
        <label
          htmlFor="short_description"
          className="
            block
            text-[10px]
            uppercase
            tracking-[0.25em]
            text-black/45
          "
        >
          Description
        </label>

        <textarea
          id="short_description"
          name="short_description"
          rows={4}
          maxLength={300}
          defaultValue={artwork.short_description}
          placeholder="Write a short description of the artwork"
          className="
            mt-3
            w-full
            resize-y
            border
            border-black/15
            bg-transparent
            px-4
            py-3
            text-base
            leading-7
            outline-none
            transition

            focus:border-[#9b1c1c]
          "
        />
      </div>

      {/* Technique and year */}
      <div
        className="
          mt-7
          grid
          gap-6

          sm:grid-cols-2
        "
      >
        <div>
          <label
            htmlFor="technique_name"
            className="
              block
              text-[10px]
              uppercase
              tracking-[0.25em]
              text-black/45
            "
          >
            Technique
          </label>

          <input
            id="technique_name"
            name="technique_name"
            type="text"
            maxLength={100}
            placeholder="For example: Acrylic on canvas"
            className="
              mt-3
              w-full
              border
              border-black/15
              bg-transparent
              px-4
              py-3
              text-base
              outline-none
              transition

              focus:border-[#9b1c1c]
            "
          />
        </div>

        <div>
          <label
            htmlFor="year"
            className="
              block
              text-[10px]
              uppercase
              tracking-[0.25em]
              text-black/45
            "
          >
            Year
          </label>

          <input
            id="year"
            name="year"
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            defaultValue={artwork.year ?? ""}
            placeholder={String(new Date().getFullYear())}
            className="
              mt-3
              w-full
              border
              border-black/15
              bg-transparent
              px-4
              py-3
              text-base
              outline-none
              transition

              focus:border-[#9b1c1c]
            "
          />
        </div>
      </div>

      <div
        className="
            mt-7
            grid
            gap-6

            sm:grid-cols-2
        "
      >
        <div>
          <label
            htmlFor="width_mm"
            className="
                block
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-black/45
            "
          >
            Width (mm)
          </label>

          <input
            id="width_mm"
            name="width_mm"
            type="number"
            min="0"
            step="0.01"
            placeholder="For example: 600"
            defaultValue={artwork.width_mm ?? ""}
            className="
                mt-3
                w-full
                border
                border-black/15
                bg-transparent
                px-4
                py-3
                text-base
                outline-none
                transition

                focus:border-[#9b1c1c]
            "
          />
        </div>

        <div>
          <label
            htmlFor="height_mm"
            className="
                block
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-black/45
            "
          >
            Height (mm)
          </label>

          <input
            id="height_mm"
            name="height_mm"
            type="number"
            min="0"
            step="0.01"
            placeholder="For example: 800"
            defaultValue={artwork.height_mm ?? ""}
            className="
                mt-3
                w-full
                border
                border-black/15
                bg-transparent
                px-4
                py-3
                text-base
                outline-none
                transition

                focus:border-[#9b1c1c]
            "
          />
        </div>
      </div>

      <div
        className="
            mt-7
            grid
            gap-6

            sm:grid-cols-2
        "
      >
        <div>
          <label
            htmlFor="original_price"
            className="
                block
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-black/45
            "
          >
            Original price (GBP)
          </label>

          <input
            id="original_price"
            name="original_price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={artwork.original_price ?? ""}
            placeholder="For example: 1200"
            className="
                mt-3
                w-full
                border
                border-black/15
                bg-transparent
                px-4
                py-3
                text-base
                outline-none
                transition

                focus:border-[#9b1c1c]
            "
          />
        </div>

        <div>
          <label
            htmlFor="print_price"
            className="
                block
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-black/45
            "
          >
            Print price (GBP)
          </label>

          <input
            id="print_price"
            name="print_price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={artwork.print_price ?? ""}
            placeholder="Leave empty when unavailable"
            className="
                mt-3
                w-full
                border
                border-black/15
                bg-transparent
                px-4
                py-3
                text-base
                outline-none
                transition

                focus:border-[#9b1c1c]
            "
          />
        </div>
      </div>

      <div
        className="
            mt-7
            grid
            gap-6

            sm:grid-cols-2
        "
      >
        <div>
          <label
            htmlFor="sale_status"
            className="
                block
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-black/45
            "
          >
            Sale status
          </label>

          <select
            id="sale_status"
            name="sale_status"
            defaultValue={artwork.sale_status}
            className="
                mt-3
                w-full
                border
                border-black/15
                bg-transparent
                px-4
                py-3
                text-base
                outline-none
                transition

                focus:border-[#9b1c1c]
            "
          >
            <option value="available">Available</option>

            <option value="reserved">Reserved</option>

            <option value="sold">Sold</option>

            <option value="not_for_sale">Not for sale</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="stock"
            className="
                block
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-black/45
            "
          >
            Print stock
          </label>

          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            defaultValue={artwork.stock}
            className="
                mt-3
                w-full
                border
                border-black/15
                bg-transparent
                px-4
                py-3
                text-base
                outline-none
                transition

                focus:border-[#9b1c1c]
            "
          />
        </div>
      </div>

      {/* Main image */}
      <div className="mt-7">
        <label
          htmlFor="main_image"
          className="
            block
            text-[10px]
            uppercase
            tracking-[0.25em]
            text-black/45
          "
        >
          Main image
        </label>

        {artwork.main_image && (
          <p className="mb-2 text-sm text-black/50">
            A main image is already uploaded. Choose a new image only if you
            want to replace it.
          </p>
        )}

        <input
          id="main_image"
          name="main_image"
          type="file"
          accept="image/*"
          className="
            mt-3
            block
            w-full
            border
            border-black/15
            bg-white/40
            px-4
            py-3
            text-sm
            file:mr-4
            file:border-0
            file:bg-transparent
            file:text-xs
            file:uppercase
            file:tracking-[0.2em]
          "
        />

        <p className="mt-2 text-xs leading-5 text-black/40">
          JPG, PNG or WebP. Use a clear, high-quality photograph of the artwork.
        </p>
      </div>

      {/* Image alternative text */}
      <div className="mt-7">
        <label
          htmlFor="main_image_alt"
          className="
            block
            text-[10px]
            uppercase
            tracking-[0.25em]
            text-black/45
          "
        >
          Image description
        </label>

        <input
          id="main_image_alt"
          name="main_image_alt"
          type="text"
          maxLength={200}
          placeholder="Describe the artwork for accessibility"
          className="
            mt-3
            w-full
            border
            border-black/15
            bg-transparent
            px-4
            py-3
            text-base
            outline-none
            transition

            focus:border-[#9b1c1c]
          "
        />
      </div>

      <div
        className="
            mt-8
            grid
            gap-4
            border-y
            border-black/10
            py-7

            sm:grid-cols-2
        "
      >
        <label
          className="
            flex
            cursor-pointer
            items-center
            gap-3
            text-sm
            text-black/65
            "
        >
          <input
            name="original_available"
            type="checkbox"
            defaultChecked={artwork.original_available}
            className="accent-[#9b1c1c]"
          />
          Original available
        </label>

        <label
          className="
            flex
            cursor-pointer
            items-center
            gap-3
            text-sm
            text-black/65
            "
        >
          <input
            name="print_available"
            type="checkbox"
            defaultChecked={artwork.print_available}
            className="accent-[#9b1c1c]"
          />
          Prints available
        </label>

        <label
          className="
            flex
            cursor-pointer
            items-center
            gap-3
            text-sm
            text-black/65
            "
        >
          <input
            name="show_price"
            type="checkbox"
            defaultChecked={artwork.show_price}
            className="accent-[#9b1c1c]"
          />
          Show price publicly
        </label>

        <label
          className="
            flex
            cursor-pointer
            items-center
            gap-3
            text-sm
            text-black/65
            "
        >
          <input
            name="is_featured"
            type="checkbox"
            defaultChecked={artwork.is_featured}
            className="accent-[#9b1c1c]"
          />
          Feature on homepage
        </label>

        <label
          className="
            flex
            cursor-pointer
            items-center
            gap-3
            text-sm
            text-black/65
            "
        >
          <input
            name="is_published"
            type="checkbox"
            defaultChecked={artwork.is_published}
            className="accent-[#9b1c1c]"
          />
          Publish immediately
        </label>
      </div>

      {error && (
        <p
          role="alert"
          className="
            mt-6
            border-l-2
            border-[#9b1c1c]
            pl-4
            text-sm
            text-[#9b1c1c]
          "
        >
          {error}
        </p>
      )}

      <div
        className="
          mt-9
          flex
          items-center
          justify-between
          gap-5
          border-t
          border-black/10
          pt-7
        "
      >
        <p className="text-xs text-black/40">
          Review the changes before updating the artwork.
        </p>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isSubmitting || isDeleting}
          className="
          border
          border-[#9b1c1c]/35
          px-5
          py-3
          text-[10px]
          uppercase
          tracking-[0.2em]
          text-[#9b1c1c]
          transition

          hover:bg-[#9b1c1c]
          hover:text-white
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>

        <button
          type="submit"
          disabled={isSubmitting || isDeleting}
          className="
            bg-[#171717]
            px-6
            py-3
            text-[10px]
            uppercase
            tracking-[0.23em]
            text-white
            transition

            hover:bg-[#9b1c1c]
            disabled:cursor-wait
            disabled:opacity-50
          "
        >
          {isSubmitting ? "Updating..." : "Update artwork"}
        </button>
      </div>
    </form>
  );
}
