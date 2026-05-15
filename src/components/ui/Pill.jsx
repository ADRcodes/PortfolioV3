export default function Pill({ children, tone = "neutral" }) {
  const tones = {
    neutral: "border-line/80 bg-paper/70 text-ink-soft",
    moss: "border-moss/20 bg-moss/10 text-moss-dark",
    clay: "border-clay/20 bg-clay/10 text-clay",
    sky: "border-sky/25 bg-sky/12 text-moss-dark",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
