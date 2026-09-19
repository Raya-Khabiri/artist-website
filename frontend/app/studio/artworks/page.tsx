import Link from "next/link";

import ArtworkManager from "@/components/studio/ArtworkManager";

export default function StudioArtworksPage() {
  return (
    <main
      className="
        min-h-screen
        bg-[#f4f1eb]
        px-6
        py-10
        text-[#171717]

        sm:px-10
        lg:px-16
        lg:py-14
      "
    >
      <div className="mx-auto max-w-[1400px]">
        <header
          className="
            flex
            flex-col
            gap-8
            border-b
            border-black/10
            pb-10

            md:flex-row
            md:items-end
            md:justify-between
          "
        >
          <div>
            <Link
              href="/studio"
              className="
                text-[9px]
                uppercase
                tracking-[0.28em]
                text-black/40
                transition

                hover:text-[#9b1c1c]
              "
            >
              ← Artist dashboard
            </Link>

            <p
              className="
                mt-8
                text-[10px]
                uppercase
                tracking-[0.35em]
                text-[#9b1c1c]
              "
            >
              Collection management
            </p>

            <h1
              className="
                mt-4
                font-serif
                text-4xl
                font-light

                sm:text-5xl
              "
            >
              Artworks
            </h1>

            <p
              className="
                mt-5
                max-w-xl
                text-sm
                leading-6
                text-black/55
              "
            >
              Review published artworks and private drafts from the studio
              collection.
            </p>
          </div>

          <button
            type="button"
            disabled
            title="Artwork creation will be added next."
            className="
              w-fit
              cursor-not-allowed
              border
              border-black/15
              px-5
              py-3
              text-[10px]
              uppercase
              tracking-[0.23em]
              text-black/30
            "
          >
            Add artwork
          </button>
        </header>

        <section className="mt-10">
          <ArtworkManager />
        </section>
      </div>
    </main>
  );
}
