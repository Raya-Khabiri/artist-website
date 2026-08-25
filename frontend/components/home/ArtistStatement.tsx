import { getSiteSettings } from "@/lib/api";

const fallbackStatement =
  "EAMORA explores memory, emotion and the quiet traces that moments leave behind. Each work preserves something fleeting and gives it a lasting visual form.";

export default async function ArtistStatement() {
  const settings = await getSiteSettings();

  const title =
    settings?.artist_statement_title ||
    "Artist Statement";

  const statement =
    settings?.artist_statement ||
    fallbackStatement;

  return (
    <section
      id="statement"
      className="bg-[#f7f4ef] py-32 text-[#1d1d1d]"
    >
      <div className="mx-auto max-w-4xl px-8">
        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gray-500">
          {title}
        </p>

        <h2 className="mb-16 font-serif text-5xl font-light leading-tight">
          Art preserves emotions
          <br />
          that words cannot.
        </h2>

        <p className="whitespace-pre-line text-lg leading-9 text-gray-700">
          {statement}
        </p>
      </div>
    </section>
  );
}