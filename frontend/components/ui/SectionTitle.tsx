type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function SectionTitle({
  eyebrow,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <p className="mb-5 text-xs uppercase tracking-[0.35em] text-black/50">
          {eyebrow}
        </p>
      )}

      <h2 className="text-4xl font-light leading-tight tracking-tight md:text-6xl">
        {title}
      </h2>

      {description && (
        <p className="mt-6 max-w-2xl text-base leading-8 text-black/60 md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}