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
            <p
              className="
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

          <Link
            href="/studio/artworks/new"
            className="
                w-fit
                bg-[#171717]
                px-5
                py-3
                text-[10px]
                uppercase
                tracking-[0.23em]
                text-white
                transition

                hover:bg-[#9b1c1c]
            "
          >
            Add artwork
          </Link>
        </header>

        <section className="mt-10">
          <ArtworkManager />
        </section>
      </div>
    </main>
  );
}
