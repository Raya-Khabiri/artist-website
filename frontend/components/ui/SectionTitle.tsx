type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  headingLevel?: 1 | 2;
};

export default function SectionTitle({
  eyebrow,
  title,
  description,
  headingLevel = 2,
}: SectionTitleProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <p className="mb-5 text-xs uppercase tracking-[0.35em] text-black/50">
          {eyebrow}
        </p>
      )}

      <Heading className="text-4xl font-light leading-tight tracking-tight md:text-6xl">
        {title}
      </Heading>

      {description && (
        <p className="mt-6 max-w-2xl text-base leading-8 text-black/60 md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
