"use client";
import { useRouter } from "next/navigation";

import { useState, type FormEvent } from "react";

import { updateStudioSiteContent } from "@/lib/studio-api";
import type { SiteSettings } from "@/lib/api";

type SiteContentFormProps = {
  settings: SiteSettings;
};

const inputClassName = `
  mt-3
  w-full
  border
  border-black/15
  bg-white/50
  px-4
  py-3
  outline-none
  transition
  focus:border-[#9b1c1c]
`;

const labelClassName = `
  text-xs
  uppercase
  tracking-[0.2em]
  text-black/50
`;

const fileFields = [
  "hero_image",
  "process_video",
  "process_video_poster",
  "artist_image",
];

export default function SiteContentForm({ settings }: SiteContentFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);

    for (const fieldName of fileFields) {
      const file = formData.get(fieldName);

      if (file instanceof File && file.size === 0) {
        formData.delete(fieldName);
      }
    }

    try {
      await updateStudioSiteContent(formData);

      setSuccessMessage("Site content updated successfully.");

      window.setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 800);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update site content.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-16">
      <section>
        <div className="border-b border-black/10 pb-5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b1c1c]">
            Homepage
          </p>

          <h2 className="mt-3 font-serif text-3xl font-light">Hero section</h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className={labelClassName}>Hero title</span>

            <input
              name="hero_title"
              type="text"
              required
              defaultValue={settings.hero_title}
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className={labelClassName}>Acronym</span>

            <input
              name="hero_acronym"
              type="text"
              defaultValue={settings.hero_acronym}
              className={inputClassName}
            />
          </label>

          <label className="block md:col-span-2">
            <span className={labelClassName}>Hero statement</span>

            <textarea
              name="hero_statement"
              rows={4}
              defaultValue={settings.hero_statement}
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className={labelClassName}>Button text</span>

            <input
              name="hero_button_text"
              type="text"
              defaultValue={settings.hero_button_text}
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className={labelClassName}>Button link</span>

            <input
              name="hero_button_link"
              type="text"
              defaultValue={settings.hero_button_link}
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className={labelClassName}>Image alternative text</span>

            <input
              name="hero_image_alt"
              type="text"
              defaultValue={settings.hero_image_alt}
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className={labelClassName}>Replace hero image</span>

            <input
              name="hero_image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={inputClassName}
            />

            {settings.hero_image && (
              <span className="mt-2 block text-xs text-black/40">
                A hero image is currently uploaded.
              </span>
            )}
          </label>
        </div>
      </section>

      <section>
        <div className="border-b border-black/10 pb-5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b1c1c]">
            Homepage
          </p>

          <h2 className="mt-3 font-serif text-3xl font-light">Studio video</h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className={labelClassName}>Section title</span>

            <input
              name="process_video_title"
              type="text"
              defaultValue={settings.process_video_title}
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className={labelClassName}>Replace video</span>

            <input
              name="process_video"
              type="file"
              accept="video/mp4,video/webm"
              className={inputClassName}
            />

            {settings.process_video && (
              <span className="mt-2 block text-xs text-black/40">
                A process video is currently uploaded.
              </span>
            )}
          </label>

          <label className="block">
            <span className={labelClassName}>Replace video poster</span>

            <input
              name="process_video_poster"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={inputClassName}
            />

            {settings.process_video_poster && (
              <span className="mt-2 block text-xs text-black/40">
                A video poster is currently uploaded.
              </span>
            )}
          </label>
        </div>
      </section>

      <section>
        <div className="border-b border-black/10 pb-5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b1c1c]">
            About page
          </p>

          <h2 className="mt-3 font-serif text-3xl font-light">
            Artist profile
          </h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className={labelClassName}>Artist name</span>

            <input
              name="artist_name"
              type="text"
              defaultValue={settings.artist_name}
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className={labelClassName}>Origin</span>

            <input
              name="artist_origin"
              type="text"
              defaultValue={settings.artist_origin}
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className={labelClassName}>Location</span>

            <input
              name="artist_location"
              type="text"
              defaultValue={settings.artist_location}
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className={labelClassName}>Profession</span>

            <input
              name="artist_profession"
              type="text"
              defaultValue={settings.artist_profession}
              className={inputClassName}
            />
          </label>

          <label className="block md:col-span-2">
            <span className={labelClassName}>Biography</span>

            <textarea
              name="artist_biography"
              rows={12}
              defaultValue={settings.artist_biography}
              className={inputClassName}
            />
          </label>

          <label className="block md:col-span-2">
            <span className={labelClassName}>Replace artist image</span>

            <input
              name="artist_image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={inputClassName}
            />

            {settings.artist_image && (
              <span className="mt-2 block text-xs text-black/40">
                An artist image is currently uploaded.
              </span>
            )}
          </label>
        </div>
      </section>

      <section>
        <div className="border-b border-black/10 pb-5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b1c1c]">
            Contact and footer
          </p>

          <h2 className="mt-3 font-serif text-3xl font-light">
            Public details
          </h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className={labelClassName}>Contact email</span>

            <input
              name="contact_email"
              type="email"
              defaultValue={settings.contact_email}
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className={labelClassName}>Instagram URL</span>

            <input
              name="instagram_url"
              type="url"
              defaultValue={settings.instagram_url}
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className={labelClassName}>Copyright text</span>

            <input
              name="copyright_text"
              type="text"
              defaultValue={settings.copyright_text}
              className={inputClassName}
            />
          </label>
        </div>
      </section>

      {error && <p className="text-sm text-[#9b1c1c]">{error}</p>}

      {successMessage && (
        <p className="text-sm text-green-800">{successMessage}</p>
      )}

      <div className="border-t border-black/10 pt-8">
        <button
          type="submit"
          disabled={isSaving}
          className="
            border
            border-[#171717]
            bg-[#171717]
            px-8
            py-4
            text-xs
            uppercase
            tracking-[0.22em]
            text-[#faf9f6]
            transition
            hover:bg-[#9b1c1c]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {isSaving ? "Saving..." : "Save site content"}
        </button>
      </div>
    </form>
  );
}
