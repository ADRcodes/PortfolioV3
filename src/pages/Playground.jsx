import AnimatedPage from "../components/ui/AnimatedPage.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import PretextDemo from "../playground/pretext/PretextDemo.jsx";

export default function Playground() {
  return (
    <AnimatedPage>
      <SectionHeading
        eyebrow="Playground"
        title="Small demos, interface sketches, and experiments."
        copy="Pretext is an early text layout and transformation experiment built around fast measurement, wrapping, and per-character interaction."
      />

      <section className="surface grain mt-10 overflow-hidden rounded-[2.25rem] bg-[#f5f0e8] p-0">
        <div className="border-b border-line/70 px-6 py-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">Pretext</p>
          <div className="mt-3 max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-normal text-ink">
              Text layout as something physical.
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink-soft">
              I wanted to play around with Pretext and see how it functioned when text measurement,
              wrapping, and transformations were treated as an interactive system. This example was{" "}
              <a
                href="https://github.com/pushmatrix"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-clay transition hover:text-ink"
              >
                liberally inspired by Daniel Beauchamp&apos;s project
              </a>
              .
            </p>
          </div>
        </div>
        <PretextDemo />
      </section>
    </AnimatedPage>
  );
}
