import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { fadeUp } from "../../lib/motion.js";
import Pill from "../ui/Pill.jsx";

export default function ProjectCard({ project, index = 0 }) {
  const isLarge = index === 0;

  return (
    <motion.article
      className={`surface grain group relative flex h-full flex-col overflow-hidden rounded-[2rem] p-6 transition duration-300 hover:-translate-y-1 hover:border-moss/40 ${
        isLarge ? "lg:col-span-2 lg:min-h-[28rem]" : "min-h-[24rem]"
      }`}
      variants={fadeUp}
    >
      <div
        className={`absolute right-5 top-5 h-24 w-24 rounded-[42%_58%_48%_52%] opacity-70 blur-2xl ${
          index % 3 === 0
            ? "bg-sky/35"
            : index % 3 === 1
              ? "bg-clay/25"
              : "bg-lilac/30"
        }`}
      />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Pill tone={index % 2 === 0 ? "moss" : "clay"}>{project.category}</Pill>
          <Pill>{project.status}</Pill>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line/80 bg-white/45 text-ink-soft transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink">
          <ArrowUpRight aria-hidden="true" size={18} />
        </span>
      </div>

      <div className="relative z-10 mt-10">
        <h2 className="text-balance text-2xl font-semibold leading-tight text-ink sm:text-3xl">
          {project.title}
        </h2>
        <p className="mt-3 text-base leading-7 text-ink-soft">{project.subtitle}</p>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-ink-soft">{project.summary}</p>
      </div>

      <div className="relative z-10 mt-8 grid gap-3">
        {project.highlights.map((highlight) => (
          <div key={highlight} className="flex gap-3 text-sm leading-6 text-ink-soft">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
            <span>{highlight}</span>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-auto flex flex-wrap gap-2 pt-8">
        {project.tech.map((item) => (
          <Pill key={item} tone="sky">
            {item}
          </Pill>
        ))}
      </div>
    </motion.article>
  );
}
