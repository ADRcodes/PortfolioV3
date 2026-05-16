import AnimatedPage from "../components/ui/AnimatedPage.jsx";

export default function About() {
  return (
    <AnimatedPage className="flex min-h-[calc(100svh-5rem)] flex-col justify-center">
      <section className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">About</p>
        <h1 className="mt-6 text-[clamp(2.2rem,5vw,4.4rem)] font-semibold leading-[1.08] tracking-normal text-ink">
          I'm Alex Russell, and I like building things that help people and things
          that feel fun to explore.
        </h1>

        <div className="mt-10 grid gap-6 text-xl font-medium leading-9 text-ink-soft sm:text-2xl sm:leading-10">
          <p>
            I grew up in St. John's, Newfoundland and Labrador, and studied
            mechanical engineering at UBC Okanagan. That background still shapes how
            I approach software: start with the problem, understand the constraints,
            and build something that can be tested in the real world.
          </p>
          <p>
            During university I also spent time volunteering with groups like
            Engineers Without Borders and Enactus. Those experiences pushed me
            toward practical, people-aware work and taught me to care about whether
            an idea is useful, not just whether it is interesting.
          </p>
          <p>
            I enjoy building web tools, experimenting with AI, and exploring new
            ideas until they become clear enough to use. Most of my work sits in
            that space between curiosity and implementation.
          </p>
        </div>
      </section>
    </AnimatedPage>
  );
}
