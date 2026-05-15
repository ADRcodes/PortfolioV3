import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import AnimatedPage from "../components/ui/AnimatedPage.jsx";
import Pill from "../components/ui/Pill.jsx";
import {
  getProjectNote,
  getProjectPath,
  getProjectPreviewImage,
} from "../data/projectPresentation.js";
import { projects } from "../data/projects.js";
import { fadeUp, staggerContainer } from "../lib/motion.js";

const projectSequence = projects;

function ScrollProjectStage() {
  const stageRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [viewportSize, setViewportSize] = useState({ width: 1440, height: 900 });
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: document.documentElement.clientWidth || window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);
    return () => window.removeEventListener("resize", updateViewportSize);
  }, []);

  const finalImageLeft = 80;

  const introScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.54]);
  const introY = useTransform(scrollYProgress, [0, 0.1], [0, -190]);
  const introOpacity = useTransform(scrollYProgress, (value) => {
    if (value >= 0.075) return 0;
    if (value <= 0.03) return 1;
    return 1 - (value - 0.03) / 0.045;
  });
  const imageY = useTransform(scrollYProgress, [0, 0.16], ["74vh", "4vh"]);
  const imageLeft = useTransform(scrollYProgress, [0, 0.18, 0.32], [
    viewportSize.width / 2,
    viewportSize.width / 2,
    finalImageLeft,
  ]);
  const imageX = useTransform(scrollYProgress, [0, 0.18, 0.32], ["-50%", "-50%", "0%"]);
  const imageWidth = useTransform(scrollYProgress, [0, 0.18, 0.32], [
    viewportSize.width * 0.34,
    viewportSize.width * 0.38,
    viewportSize.width * 0.46,
  ]);
  const imageHeight = useTransform(scrollYProgress, [0, 0.18, 0.32], [
    viewportSize.height * 0.46,
    viewportSize.height * 0.58,
    viewportSize.height * 0.74,
  ]);
  const imageRadius = useTransform(scrollYProgress, [0, 0.32], ["2.25rem", "1.5rem"]);
  const imageScale = useTransform(scrollYProgress, [0.18, 0.32], [0.9, 1]);
  const detailsOpacity = useTransform(scrollYProgress, (value) => {
    if (value <= 0.25) return 0;
    if (value >= 0.33) return 1;
    return (value - 0.25) / 0.08;
  });
  const detailsX = useTransform(scrollYProgress, (value) => {
    if (value <= 0.25) return 28;
    if (value >= 0.33) return 0;
    return 28 * (1 - (value - 0.25) / 0.08);
  });
  const dotsOpacity = useTransform(scrollYProgress, (value) => {
    if (value <= 0.34) return 0;
    if (value >= 0.39) return 1;
    return (value - 0.34) / 0.05;
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setShowIntro((current) => {
      if (value > 0.075 && current) {
        return false;
      }
      if (value < 0.075 && !current) {
        return true;
      }
      return current;
    });

    const start = 0.42;
    const end = 0.96;
    const range = end - start;
    const normalized = Math.min(Math.max((value - start) / range, 0), 0.999);
    const nextIndex = Math.min(
      projectSequence.length - 1,
      Math.floor(normalized * projectSequence.length),
    );

    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  const activeProject = projectSequence[activeIndex];
  const activeImage = getProjectPreviewImage(activeProject);

  return (
    <section
      ref={stageRef}
      className="relative hidden md:block"
      style={{ height: `${240 + projectSequence.length * 85}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden pt-20">
        {showIntro && (
          <motion.div
            className="pointer-events-none absolute left-1/2 top-[34vh] z-0 w-full max-w-6xl -translate-x-1/2 text-center"
            style={{ scale: introScale, y: introY, opacity: introOpacity }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Selected work
            </p>
            <h1 className="mt-4 text-[clamp(5rem,12vw,10rem)] font-semibold leading-none tracking-normal text-ink">
              Projects
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-ink-soft">
              Product, engineering, and systems work shaped around practical problems.
            </p>
          </motion.div>
        )}

        <motion.div
          className="absolute top-20 z-20 overflow-hidden border border-line/80 bg-paper-soft shadow-soft"
          style={{
            left: imageLeft,
            width: imageWidth,
            height: imageHeight,
            x: imageX,
            y: imageY,
            scale: imageScale,
            borderRadius: imageRadius,
          }}
        >
          <div className="relative h-full w-full overflow-hidden">
            <AnimatePresence mode="wait">
              {activeImage ? (
                <motion.img
                  key={activeProject.id}
                  src={activeImage}
                  alt={`${activeProject.title} project preview`}
                  className="absolute inset-0 h-full w-full object-cover mix-blend-multiply saturate-[0.9]"
                  initial={{ opacity: 0, y: 52, scale: 1.04 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : (
                <motion.div
                  key={activeProject.id}
                  className="absolute inset-0 grid place-items-center bg-paper-soft px-12 text-center"
                  initial={{ opacity: 0, y: 52, scale: 1.04 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink-soft">
                      {activeProject.category}
                    </p>
                    <p className="mt-5 text-5xl font-semibold leading-tight text-ink">
                      {activeProject.title}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              className="absolute bottom-7 left-7 z-20 grid gap-2"
              style={{ opacity: dotsOpacity }}
            >
              {projectSequence.map((project, index) => (
                <span
                  key={project.id}
                  className={`h-2 w-2 rounded-full transition ${
                    index === activeIndex ? "bg-moss-dark" : "bg-line"
                  }`}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="absolute left-[57vw] right-[clamp(2rem,6vw,7rem)] top-[18vh] z-30 flex h-[64vh] min-w-0 flex-col overflow-visible"
          style={{ opacity: detailsOpacity, x: detailsX }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeProject.id}
              className="absolute inset-0 flex min-w-0 flex-col"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <p className="text-5xl font-semibold leading-none text-moss-dark">
                  {String(activeIndex + 1).padStart(2, "0")}
                  <span className="ml-2 align-top text-sm text-ink-soft">
                    / {String(projectSequence.length).padStart(2, "0")}
                  </span>
                </p>
                <h2 className="mt-20 max-w-[min(35rem,100%)] break-words text-[clamp(2.4rem,3.1vw,4rem)] font-semibold leading-tight tracking-normal text-ink">
                  {activeProject.title}
                </h2>
                <div className="mt-8 flex flex-wrap gap-2">
                  <Pill tone="moss">{activeProject.category}</Pill>
                  <Pill>{activeProject.status}</Pill>
                </div>
                <Link
                  to={getProjectPath(activeProject)}
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-moss-dark/50 px-5 py-3 text-sm font-semibold text-moss-dark transition hover:bg-moss-dark hover:text-paper"
                >
                  View project
                  <ArrowUpRight aria-hidden="true" size={15} />
                </Link>
                {activeProject.links.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                    {activeProject.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition hover:text-moss-dark"
                      >
                        {link.label === "Code" ? "GitHub" : link.label}
                        <ArrowUpRight aria-hidden="true" size={13} />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-1 items-center">
                <p className="max-w-[min(29rem,100%)] text-lg leading-8 text-ink/75">
                  {getProjectNote(activeProject)}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}

function MobileProjectList() {
  return (
    <motion.section
      className="md:hidden"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="border-b border-line/80 pb-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft">
          Selected work
        </p>
        <h1 className="mt-5 text-6xl font-semibold leading-none tracking-normal text-ink">
          Projects
        </h1>
        <p className="mt-7 text-xl leading-9 text-ink-soft">
          Product, engineering, and systems work shaped around practical problems.
        </p>
      </div>

      <div className="grid">
        {projectSequence.map((project, index) => {
          const image = getProjectPreviewImage(project);

          return (
            <motion.div key={project.id} variants={fadeUp}>
              <article className="grid gap-5 border-b border-line/80 py-10 text-ink">
                <Link
                  to={getProjectPath(project)}
                  className="grid gap-5 transition hover:text-moss-dark"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-ink-soft">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight aria-hidden="true" className="text-ink-soft" size={18} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-semibold leading-tight">{project.title}</h2>
                    <p className="mt-4 text-lg leading-8 text-ink-soft">{project.subtitle}</p>
                    <p className="mt-4 text-base leading-7 text-ink-soft">{project.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Pill tone="moss">{project.category}</Pill>
                    <Pill>{project.status}</Pill>
                  </div>
                  <div className="grid gap-2">
                    {project.highlights.map((highlight) => (
                      <p key={highlight} className="text-sm leading-6 text-ink-soft">
                        {highlight}
                      </p>
                    ))}
                  </div>
                  {image && (
                    <div className="overflow-hidden rounded-lg border border-line/80 bg-paper-soft">
                      <img
                        src={image}
                        alt={`${project.title} project preview`}
                        loading="lazy"
                        className="aspect-[16/10] w-full object-cover mix-blend-multiply saturate-[0.9]"
                      />
                    </div>
                  )}
                </Link>
                {project.links.length > 0 && (
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition hover:text-moss-dark"
                      >
                        {link.label === "Code" ? "GitHub" : link.label}
                        <ArrowUpRight aria-hidden="true" size={13} />
                      </a>
                    ))}
                  </div>
                )}
              </article>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

export default function Projects() {
  return (
    <AnimatedPage className="!max-w-none !px-0 !pt-0 sm:!px-0 lg:!px-0 lg:!pt-0">
      <div className="mx-auto block w-full max-w-7xl px-4 pt-24 sm:px-6 md:hidden lg:px-8 lg:pt-28">
        <MobileProjectList />
      </div>
      <ScrollProjectStage />
    </AnimatedPage>
  );
}
