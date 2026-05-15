export default function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
  className = "",
}) {
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`max-w-3xl ${alignment} ${className}`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-clay">
          {eyebrow}
        </p>
      )}
      <h1 className="text-balance text-4xl font-semibold leading-[1.02] text-ink sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      {copy && <p className="mt-5 text-lg leading-8 text-ink-soft">{copy}</p>}
    </div>
  );
}
