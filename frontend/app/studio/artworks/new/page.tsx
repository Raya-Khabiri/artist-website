import Link from "next/link";

import ArtworkCreateForm from "@/components/studio/ArtworkCreateForm";

export default function NewArtworkPage() {
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
      <div className="mx-auto max-w-3xl">
        <header
          className="
            border-b
            border-black/10
            pb-10
          "
        >
          <Link
            href="/studio/artworks"
            className="
              text-[9px]
              uppercase
              tracking-[0.28em]
              text-black/40
              transition

              hover:text-[#9b1c1c]
            "
          >
            ← Artworks
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
            Add artwork
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
            Add the artwork information and save it as a private draft before
            publishing.
          </p>
        </header>

        <section className="mt-10">
          <ArtworkCreateForm />
        </section>
      </div>
    </main>
  );
}
