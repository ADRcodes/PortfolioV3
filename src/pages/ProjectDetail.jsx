import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router";
import AnimatedPage from "../components/ui/AnimatedPage.jsx";
import Pill from "../components/ui/Pill.jsx";
import {
  getProjectNote,
  getProjectPreviewImage,
} from "../data/projectPresentation.js";
import { projects } from "../data/projects.js";

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
