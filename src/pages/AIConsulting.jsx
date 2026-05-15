import { motion } from "motion/react";
import { ArrowUpRight, Bot, FileSearch, Workflow } from "lucide-react";
import AnimatedPage from "../components/ui/AnimatedPage.jsx";
import LinkButton from "../components/ui/LinkButton.jsx";
import Pill from "../components/ui/Pill.jsx";
import { fadeUp, staggerContainer } from "../lib/motion.js";

const serviceIndex = [
  {
    id: "workflow-mapping",
    number: "01",
    title: "Workflow Mapping",
    focus: "Discovery",
    shape: "1-2 weeks",
  },
  {
    id: "retrieval-prototypes",
    number: "02",
    title: "Retrieval Prototypes",
    focus: "RAG systems",
    shape: "Prototype",
  },
  {
    id: "ai-interface-design",
    number: "03",
    title: "AI Interface Design",
    focus: "Product UX",
    shape: "Feature design",
  },
  {
    id: "build-readiness",
    number: "04",
    title: "Build Readiness",
    focus: "Next steps",
    shape: "Roadmap",
  },
];

const workflowSignals = [
  "Repeated content work",
  "Manual review queues",
  "Knowledge scattered across tools",
  "Slow internal handoffs",
];

const retrievalStack = [
  "Document intake",
  "Chunking rules",
  "Embedding path",
  "Source-aware answers",
  "Evaluation checks",
];

const interfaceStates = [
  {
    title: "Ask",
    copy: "What can the user safely ask, and what context does the system need before it answers?",
  },
  {
    title: "Review",
    copy: "Where should the interface show sources, uncertainty, missing context, or next actions?",
  },
  {
    title: "Recover",
    copy: "What happens when retrieval is weak, the model is unsure, or the request is outside scope?",
  },
];

const engagementFlow = [
  {
    title: "Map",
    copy: "Document the workflow, content sources, handoffs, edge cases, and decisions that need support.",
  },
  {
    title: "Prototype",
    copy: "Build a narrow artifact that proves whether the idea is useful before expanding scope.",
  },
  {
    title: "Evaluate",
    copy: "Test the workflow with realistic inputs, identify weak spots, and decide what deserves more investment.",
  },
  {
    title: "Hand off",
    copy: "Leave behind a clearer system model, build notes, and an implementation path the team can act on.",
  },
];

const outcomes = [
  "A sharper workflow model",
  "A working prototype or implementation brief",
  "Clear risks, constraints, and data needs",
  "A practical roadmap for the next build cycle",
];

function PlaceholderImage({ src, alt, className = "" }) {
  return (
    <div className={`overflow-hidden rounded-lg border border-line/80 bg-paper-soft ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover mix-blend-multiply saturate-[0.82]"
      />
    </div>
  );
}

function SectionLabel({ children, tone = "neutral" }) {
  const color = tone === "clay" ? "text-clay" : "text-ink-soft";

  return (
    <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${color}`}>
      {children}
    </p>
  );
}

export default function AIConsulting() {
  return (
    <AnimatedPage>
      <h1 className="sr-only">AI Consulting</h1>

      <motion.nav
        aria-label="AI consulting service index"
        className="divide-y divide-line/80 border-y border-line/80"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {serviceIndex.map((service) => (
          <motion.a
            key={service.id}
            href={`#${service.id}`}
            className="group grid gap-3 py-4 text-ink transition hover:text-moss-dark md:grid-cols-[4rem_minmax(0,1fr)_11rem_9rem_1.25rem] md:items-center"
            variants={fadeUp}
          >
            <span className="text-sm font-semibold text-ink-soft">{service.number}</span>
            <span className="text-xl font-semibold">{service.title}</span>
            <span className="text-sm text-ink-soft md:text-right">{service.focus}</span>
            <span className="text-sm text-ink-soft md:text-right">{service.shape}</span>
            <span className="text-ink-soft md:justify-self-end">
              <ArrowUpRight
                aria-hidden="true"
                size={16}
                className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </motion.a>
        ))}
      </motion.nav>

      <motion.section
        className="pt-16"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
      >
        <motion.div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]" variants={fadeUp}>
          <div>
            <div className="flex flex-wrap gap-2">
              <Pill tone="moss">AI consulting</Pill>
              <Pill>Practical prototypes</Pill>
            </div>
            <h2 className="mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-none tracking-normal text-ink">
              AI help for messy workflows.
            </h2>
            <p className="mt-6 max-w-xl text-xl leading-9 text-ink-soft">
              I help teams turn content piles, repetitive decisions, and prototype-shaped questions
              into small AI systems that can be tested honestly.
            </p>
            <div className="mt-8">
              <LinkButton to="/contact">Start a conversation</LinkButton>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <PlaceholderImage
              src="https://picsum.photos/seed/ai-consulting-workflow/1200/820"
              alt="Placeholder workspace visual for AI consulting"
              className="aspect-[16/10] md:col-span-2"
            />
            <PlaceholderImage
              src="https://picsum.photos/seed/ai-consulting-notes/760/920"
              alt="Placeholder notes visual for AI consulting"
              className="aspect-[4/5]"
            />
            <div className="surface rounded-lg p-6">
              <SectionLabel tone="clay">Principle</SectionLabel>
              <p className="mt-5 text-xl font-semibold leading-8 text-ink">
                A useful engagement should leave behind a clearer workflow, a working artifact, and
                better judgment about what is worth building next.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        id="workflow-mapping"
        className="mt-24 scroll-mt-0 border-t border-line/80 pt-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
      >
        <motion.div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]" variants={fadeUp}>
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-moss/12 text-moss-dark">
              <Workflow aria-hidden="true" size={22} />
            </span>
            <h2 className="mt-6 text-5xl font-semibold leading-none tracking-normal text-ink md:text-6xl">
              Workflow mapping
            </h2>
          </div>
          <div className="grid gap-6">
            <p className="max-w-3xl text-xl leading-9 text-ink-soft">
              Before choosing a model or adding a chatbot, the work starts by finding the repeated
              decisions, content sources, review steps, and handoffs that make the workflow slow.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {workflowSignals.map((signal) => (
                <div key={signal} className="border-t border-line/80 pt-3 text-lg font-semibold text-ink">
                  {signal}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        id="retrieval-prototypes"
        className="mt-24 scroll-mt-0 border-t border-line/80 pt-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
      >
        <motion.div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]" variants={fadeUp}>
          <PlaceholderImage
            src="https://picsum.photos/seed/ai-retrieval-prototype/1100/820"
            alt="Placeholder visual for retrieval prototype work"
            className="aspect-[16/10]"
          />
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-sky/20 text-moss-dark">
              <FileSearch aria-hidden="true" size={22} />
            </span>
            <h2 className="mt-6 text-5xl font-semibold leading-none tracking-normal text-ink md:text-6xl">
              Retrieval prototypes
            </h2>
            <p className="mt-6 text-xl leading-9 text-ink-soft">
              Small RAG-style experiments are useful when the team needs to learn whether their
              documents, notes, support content, or internal knowledge can support grounded answers.
            </p>
            <div className="mt-8 grid gap-3">
              {retrievalStack.map((item, index) => (
                <div
                  key={item}
                  className="grid grid-cols-[3rem_1fr] items-center border-t border-line/80 pt-3"
                >
                  <span className="text-sm font-semibold text-ink-soft">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg font-semibold text-ink">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        id="ai-interface-design"
        className="mt-24 scroll-mt-0 border-t border-line/80 pt-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
      >
        <motion.div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]" variants={fadeUp}>
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-clay/12 text-clay">
              <Bot aria-hidden="true" size={22} />
            </span>
            <h2 className="mt-6 text-5xl font-semibold leading-none tracking-normal text-ink md:text-6xl">
              AI interface design
            </h2>
            <p className="mt-6 text-xl leading-9 text-ink-soft">
              The interface has to carry the system boundaries. Good AI product work makes the
              source, confidence, fallback, and review states visible enough for people to use.
            </p>
          </div>
          <div className="grid gap-4">
            {interfaceStates.map((state, index) => (
              <article key={state.title} className="surface rounded-lg p-6">
                <span className="text-sm font-semibold text-ink-soft">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-3xl font-semibold text-ink">{state.title}</h3>
                <p className="mt-4 text-base leading-8 text-ink-soft">{state.copy}</p>
              </article>
            ))}
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        id="build-readiness"
        className="mt-24 scroll-mt-0 border-t border-line/80 pt-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
      >
        <motion.div className="grid gap-8 lg:grid-cols-[1fr_1fr]" variants={fadeUp}>
          <div>
            <SectionLabel>Engagement shape</SectionLabel>
            <h2 className="mt-4 text-5xl font-semibold leading-none tracking-normal text-ink md:text-6xl">
              From vague opportunity to buildable next step.
            </h2>
            <div className="mt-8 grid gap-4">
              {engagementFlow.map((step, index) => (
                <div key={step.title} className="border-t border-line/80 pt-4">
                  <span className="text-sm font-semibold text-ink-soft">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-2xl font-semibold text-ink">{step.title}</h3>
                  <p className="mt-3 text-base leading-8 text-ink-soft">{step.copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 content-start">
            <PlaceholderImage
              src="https://picsum.photos/seed/ai-build-readiness/900/900"
              alt="Placeholder planning visual for AI consulting"
              className="aspect-square"
            />
            <div className="surface rounded-lg p-6">
              <SectionLabel tone="clay">What you leave with</SectionLabel>
              <div className="mt-5 grid gap-3">
                {outcomes.map((outcome) => (
                  <div key={outcome} className="border-t border-line/80 pt-3 text-lg font-semibold text-ink">
                    {outcome}
                  </div>
                ))}
              </div>
              <div className="mt-7">
                <LinkButton to="/contact" variant="secondary">
                  Talk through a workflow
                </LinkButton>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </AnimatedPage>
  );
}
