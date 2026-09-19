"use client";

import { useEffect, useState, type FormEvent } from "react";

import {
  createStudioArtworkImage,
  deleteStudioArtworkImage,
  getStudioArtworkImages,
} from "@/lib/studio-api";
import type { StudioArtworkImage } from "@/types/studio";

type ArtworkImageManagerProps = {
  artworkId: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function getImageUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function ArtworkImageManager({
  artworkId,
}: ArtworkImageManagerProps) {
  const [images, setImages] = useState<StudioArtworkImage[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isUploading, setIsUploading] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadImages() {
      try {
        const loadedImages = await getStudioArtworkImages(artworkId);

        if (isMounted) {
          setImages(loadedImages);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load gallery images.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [artworkId]);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const image = formData.get("image");

    if (!(image instanceof File) || image.size === 0) {
      setError("Please choose an image.");
      return;
    }

    if (image.size > 10 * 1024 * 1024) {
      setError("Image size must not exceed 10 MB.");
      return;
    }

    formData.set("artwork", String(artworkId));

    setIsUploading(true);

    try {
      const newImage = await createStudioArtworkImage(formData);

      setImages((currentImages) =>
        [...currentImages, newImage].sort(
          (first, second) =>
            first.display_order - second.display_order || first.id - second.id,
        ),
      );

      form.reset();

      setSuccessMessage("Gallery image added successfully.");
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload the image.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(imageId: number) {
    const confirmed = window.confirm("Delete this gallery image permanently?");

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccessMessage("");
    setDeletingId(imageId);

    try {
      await deleteStudioArtworkImage(imageId);

      setImages((currentImages) =>
        currentImages.filter((image) => image.id !== imageId),
      );

      setSuccessMessage("Gallery image deleted.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete the image.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="mt-16 border-t border-black/10 pt-12">
      <div className="max-w-2xl">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b1c1c]">
          Artwork gallery
        </p>

        <h2 className="mt-3 font-serif text-3xl font-light">
          Additional images
        </h2>

        <p className="mt-4 text-sm leading-6 text-black/55">
          Add detail views or alternate photographs of this artwork. JPEG, PNG
          and WebP files up to 10 MB are accepted.
        </p>
      </div>

      <form
        onSubmit={handleUpload}
        className="mt-8 grid gap-5 border border-black/10 bg-white/30 p-6 md:grid-cols-2"
      >
        <label className="block md:col-span-2">
          <span className="text-xs uppercase tracking-[0.2em] text-black/50">
            Image
          </span>

          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className="mt-3 block w-full border border-black/15 bg-white/50 px-4 py-3 text-sm"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-[0.2em] text-black/50">
            Alternative text
          </span>

          <input
            name="alt_text"
            type="text"
            maxLength={200}
            placeholder="Close-up of painted texture"
            className="mt-3 w-full border border-black/15 bg-white/50 px-4 py-3 outline-none transition focus:border-[#9b1c1c]"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-[0.2em] text-black/50">
            Display order
          </span>

          <input
            name="display_order"
            type="number"
            min={0}
            defaultValue={0}
            className="mt-3 w-full border border-black/15 bg-white/50 px-4 py-3 outline-none transition focus:border-[#9b1c1c]"
          />
        </label>

        <button
          type="submit"
          disabled={isUploading}
          className="border border-[#171717] bg-[#171717] px-6 py-3 text-xs uppercase tracking-[0.22em] text-[#faf9f6] transition hover:bg-[#9b1c1c] disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2 md:justify-self-start"
        >
          {isUploading ? "Uploading..." : "Add gallery image"}
        </button>
      </form>

      {error && <p className="mt-5 text-sm text-[#9b1c1c]">{error}</p>}

      {successMessage && (
        <p className="mt-5 text-sm text-green-800">{successMessage}</p>
      )}

      {isLoading ? (
        <p className="mt-10 text-sm text-black/45">Loading gallery images...</p>
      ) : images.length === 0 ? (
        <p className="mt-10 border-t border-black/10 pt-6 text-sm text-black/45">
          No additional images have been added.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <article
              key={image.id}
              className="border border-black/10 bg-white/30 p-3"
            >
              <div className="aspect-square overflow-hidden bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(image.image)}
                  alt={image.alt_text || "Additional artwork view"}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="px-1 pb-1 pt-4">
                <p className="min-h-10 text-sm leading-5 text-black/60">
                  {image.alt_text || "No alternative text"}
                </p>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                    Order {image.display_order}
                  </span>

                  <button
                    type="button"
                    disabled={deletingId === image.id}
                    onClick={() => handleDelete(image.id)}
                    className="text-xs uppercase tracking-[0.18em] text-[#9b1c1c] transition hover:opacity-60 disabled:opacity-40"
                  >
                    {deletingId === image.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
