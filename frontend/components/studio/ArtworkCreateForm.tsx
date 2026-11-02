"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { createStudioArtwork } from "@/lib/studio-api";

export default function ArtworkCreateForm() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const shouldPublish = submitter?.value === "publish";

    const form = event.currentTarget;
    const formData = new FormData(form);

    // New artworks begin as private drafts.
    const booleanFields = [
      "show_price",
      "original_available",
      "print_available",
      "is_featured",
    ] as const;

    booleanFields.forEach((fieldName) => {
      const input = form.elements.namedItem(fieldName);

      if (input instanceof HTMLInputElement) {
        formData.set(fieldName, input.checked ? "true" : "false");
      }
    });

    formData.set("is_published", shouldPublish ? "true" : "false");

    formData.set("currency", "GBP");

    setIsSubmitting(true);
    setError(null);

    try {
      const createdArtwork = await createStudioArtwork(formData);

      if (shouldPublish) {
        router.push(`/gallery/${encodeURIComponent(createdArtwork.slug)}`);
      } else {
        router.push(`/studio/artworks/${createdArtwork.id}/edit`);
      }

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

      {/* Artwork descriptions */}
      <div className="mt-7 grid gap-7">
        <div>
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
            Short gallery description (optional)
          </label>

          <p className="mt-2 text-xs leading-5 text-black/40">
            A brief text shown beneath the artwork in the gallery.
          </p>

          <textarea
            id="short_description"
            name="short_description"
            rows={3}
            maxLength={300}
            placeholder="A brief introduction to the artwork"
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

        <div>
          <label
            htmlFor="description"
            className="
                block
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-black/45
              "
          >
            Full artwork description (optional)
          </label>

          <p className="mt-2 text-xs leading-5 text-black/40">
            The complete text shown on the individual artwork page.
          </p>

          <textarea
            id="description"
            name="description"
            rows={7}
            placeholder="Write the full story, concept or context of the artwork"
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
            defaultValue="available"
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
            defaultValue="1"
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

        <input
          id="main_image"
          name="main_image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="
            mt-3
            block
            w-full
            border
            border-black/15
            bg-transparent
            px-4
            py-3
            text-sm
            text-black/60

            file:mr-4
            file:border-0
            file:bg-[#171717]
            file:px-4
            file:py-2
            file:text-[10px]
            file:uppercase
            file:tracking-[0.2em]
            file:text-white
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
            defaultChecked
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
            defaultChecked
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
            className="accent-[#9b1c1c]"
          />
          Feature on homepage
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
        <p className="max-w-sm text-xs leading-5 text-black/40">
          Save privately to continue editing, or publish and view the artwork on
          the website.
        </p>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="submit"
            name="intent"
            value="draft"
            disabled={isSubmitting}
            className="
              border
              border-black/20
              px-6
              py-3
              text-[10px]
              uppercase
              tracking-[0.23em]
              text-black/65
              transition

              hover:border-black
              hover:text-black
              disabled:cursor-wait
              disabled:opacity-50
            "
          >
            {isSubmitting ? "Saving..." : "Save draft"}
          </button>

          <button
            type="submit"
            name="intent"
            value="publish"
            disabled={isSubmitting}
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
            {isSubmitting ? "Publishing..." : "Publish & Preview"}
          </button>
        </div>
      </div>
    </form>
  );
}
