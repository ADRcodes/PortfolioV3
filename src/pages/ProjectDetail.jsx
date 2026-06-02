import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Link, useParams } from "react-router";
import AnimatedPage from "../components/ui/AnimatedPage.jsx";
import Pill from "../components/ui/Pill.jsx";
import {
  getProjectNote,
  getProjectPreviewImage,
} from "../data/projectPresentation.js";
import { projects } from "../data/projects.js";
import { fadeUp, staggerContainer } from "../lib/motion.js";

const hiragFacts = [
  { label: "Role", value: "Product engineering, architecture, frontend" },
  { label: "Stack", value: "React, AWS CDK, Bedrock, DynamoDB" },
  { label: "Status", value: "Working MVP" },
];

const hiragApproach = [
  {
    title: "Build for trust",
    body: "The system is designed around grounded answers, source citations, and visible evidence instead of opaque generation.",
  },
  {
    title: "Make handoffs inspectable",
    body: "Each stage of the workflow can be checked: upload, ingestion, retrieval, model response, and the final cited answer.",
  },
  {
    title: "Adapt the architecture",
    body: "The build moved through real Bedrock constraints, quota issues, and cross-region changes without treating the first plan as fixed.",
  },
];

const hiragPhases = [
  { label: "Upload", body: "Documents enter the system through a lightweight app flow." },
  { label: "Process", body: "Ingestion prepares long-form content for retrieval." },
  { label: "Retrieve", body: "Relevant passages are pulled from the knowledge base." },
  { label: "Answer", body: "The model responds with context-backed citations." },
];

const hiragRoadmap = [
  {
    title: "Retrieval quality",
    items: ["Tune chunking and ranking", "Add retrieval evaluation sets", "Compare answer confidence across prompts"],
  },
  {
    title: "Product UX",
    items: ["Improve citation review", "Add clearer document states", "Design richer answer history"],
  },
  {
    title: "Workflow expansion",
    items: ["Support more document types", "Add team-facing admin controls", "Create repeatable deployment profiles"],
  },
];

export default function ProjectDetail() {
  const { projectId } = useParams();
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return (
      <AnimatedPage>
        <section className="mx-auto max-w-3xl py-20">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition hover:text-ink"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Projects
          </Link>
          <h1 className="mt-10 text-5xl font-semibold leading-tight text-ink">
            Project not found.
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink-soft">
            This project page does not exist yet.
          </p>
        </section>
      </AnimatedPage>
    );
  }

  if (project.id === "hirag-personal-ai") {
    return <HiragCaseStudy project={project} />;
  }

  const image = getProjectPreviewImage(project);

  return (
    <AnimatedPage>
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition hover:text-ink"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Projects
      </Link>

      <section className="mt-10 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <div className="flex flex-wrap gap-2">
            <Pill tone="moss">{project.category}</Pill>
            <Pill>{project.status}</Pill>
          </div>
          <h1 className="mt-6 text-[clamp(4rem,9vw,8.5rem)] font-semibold leading-none tracking-normal text-ink">
            {project.title}
          </h1>
          <p className="mt-8 max-w-2xl text-2xl leading-10 text-ink-soft">
            {project.subtitle}
          </p>
        </div>

        <div className="rounded-[2rem] border border-line/80 bg-paper-soft p-4 shadow-soft">
          {image ? (
            <img
              src={image}
              alt={`${project.title} project preview`}
              className="aspect-[16/10] w-full rounded-[1.4rem] object-cover mix-blend-multiply saturate-[0.9]"
            />
          ) : (
            <div className="grid aspect-[16/10] place-items-center rounded-[1.4rem] bg-white/38 px-10 text-center">
              <p className="text-4xl font-semibold leading-tight text-ink">{project.title}</p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-16 grid gap-10 border-t border-line/80 pt-10 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft">
            Overview
          </p>
        </div>
        <div className="grid gap-8">
          <p className="text-2xl leading-10 text-ink">{project.summary}</p>
          <p className="max-w-3xl text-lg leading-8 text-ink-soft">{getProjectNote(project)}</p>
        </div>
      </section>

      <section className="mt-16 grid gap-10 border-t border-line/80 pt-10 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft">
            What stands out
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {project.highlights.map((highlight) => (
            <div
              key={highlight}
              className="rounded-lg border border-line/80 bg-white/32 p-5 text-base leading-7 text-ink-soft"
            >
              {highlight}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-10 border-t border-line/80 pt-10 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft">
            Stack and links
          </p>
        </div>
        <div className="grid gap-8">
          <div className="flex flex-wrap gap-2">
            {project.tech.map((item) => (
              <Pill key={item} tone="sky">
                {item}
              </Pill>
            ))}
          </div>

          {project.links.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-moss-dark/50 px-5 py-3 text-sm font-semibold text-moss-dark transition hover:bg-moss-dark hover:text-paper"
                >
                  {link.label}
                  <ArrowUpRight aria-hidden="true" size={15} />
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </AnimatedPage>
  );
}

function HiragCaseStudy({ project }) {
  return (
    <AnimatedPage className="max-w-6xl">
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition hover:text-ink"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Projects
      </Link>

      <motion.section
        className="mt-12"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-moss-dark">
            Case study
          </p>
          <h1 className="mt-5 text-[clamp(4.5rem,14vw,11rem)] font-semibold leading-[0.9] tracking-normal text-ink">
            {project.title}
          </h1>
          <p className="mt-8 max-w-3xl text-[clamp(1.65rem,3vw,3rem)] font-medium leading-tight text-ink">
            {project.subtitle}
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">
            hiRAG is a working AI system that ingests documents, retrieves relevant context,
            and returns answers backed by source citations.
          </p>
        </motion.div>

        <motion.dl
          variants={fadeUp}
          className="mt-12 grid gap-6 border-y border-line/80 py-7 md:grid-cols-3"
        >
          {hiragFacts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                {fact.label}
              </dt>
              <dd className="mt-2 text-base leading-7 text-ink">{fact.value}</dd>
            </div>
          ))}
        </motion.dl>

        <motion.figure variants={fadeUp} className="mt-12">
          <div className="overflow-hidden rounded-lg border border-line/80 bg-paper-soft/70 p-2 shadow-soft">
            <img
              src="/images/projects/hirag-home.png"
              alt="hiRAG application home screen showing document Q&A"
              className="h-auto w-full rounded-md"
            />
          </div>
        </motion.figure>
      </motion.section>

      <CaseStudySection label="What it does" heading="Grounded Q&A over long-form content.">
        <p>
          hiRAG gives people a way to ask questions across uploaded documents and receive
          concise answers that point back to the source material. The core value is simple:
          make long content easier to use without asking the reader to trust an answer blindly.
        </p>
      </CaseStudySection>

      <CaseStudySection label="Approach" heading="How I approached it">
        <div className="grid gap-8 md:grid-cols-3">
          {hiragApproach.map((item) => (
            <div key={item.title} className="border-t border-line/80 pt-5">
              <h3 className="text-xl font-semibold leading-7 text-ink">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-ink-soft">{item.body}</p>
            </div>
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection label="System design" heading="A real retrieval pipeline, kept legible.">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <figure>
            <div className="overflow-hidden rounded-lg border border-line/80 bg-paper-soft/65 p-2">
              <img
                src="/images/projects/hirag-flow.png"
                alt="hiRAG system flow diagram"
                className="h-auto w-full rounded-md"
              />
            </div>
          </figure>

          <div>
            <p>
              The architecture combines custom ingestion, managed retrieval, and AWS
              infrastructure in code. The goal was not to document every service decision on
              the page, but to show the system as a sequence someone can understand.
            </p>
            <div className="mt-8 grid gap-5">
              {hiragPhases.map((phase, index) => (
                <div key={phase.label} className="grid grid-cols-[2.5rem_1fr] gap-4">
                  <span className="pt-1 text-sm font-semibold tabular-nums text-moss-dark">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="border-t border-line/80 pt-4">
                    <h3 className="text-lg font-semibold text-ink">{phase.label}</h3>
                    <p className="mt-1 text-base leading-7 text-ink-soft">{phase.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CaseStudySection>

      <CaseStudySection label="Build" heading="Engineering process">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <p>
            The project was built through a docs-first workflow with Codex, then hardened
            through infrastructure in code and repeated smoke testing. The most useful work
            happened where plans met platform constraints: Bedrock model access, quota limits,
            and adapting the retrieval stack across AWS regions.
          </p>
          <figure>
            <div className="overflow-hidden rounded-lg border border-line/80 bg-paper-soft/65 p-2">
              <img
                src="/images/projects/hirag-documents.png"
                alt="hiRAG document management screen"
                className="h-auto w-full rounded-md"
              />
            </div>
          </figure>
        </div>
      </CaseStudySection>

      <CaseStudySection label="Roadmap" heading="What I would improve next">
        <div className="grid gap-8 md:grid-cols-3">
          {hiragRoadmap.map((group) => (
            <div key={group.title} className="border-t border-line/80 pt-5">
              <h3 className="text-xl font-semibold leading-7 text-ink">{group.title}</h3>
              <ul className="mt-4 space-y-3 text-base leading-7 text-ink-soft">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CaseStudySection>
    </AnimatedPage>
  );
}

function CaseStudySection({ label, heading, children }) {
  return (
    <motion.section
      className="mt-24 grid gap-10 border-t border-line/80 pt-12 lg:grid-cols-[0.33fr_1fr]"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-soft">{label}</p>
      </div>
      <div>
        <h2 className="max-w-3xl text-[clamp(2rem,4vw,4.5rem)] font-semibold leading-[0.98] tracking-normal text-ink">
          {heading}
        </h2>
        <div className="mt-8 text-lg leading-8 text-ink-soft">{children}</div>
      </div>
    </motion.section>
  );
}
