import { Check, Linkedin } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import AnimatedPage from "../components/ui/AnimatedPage.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";

const notes = [
  "Full-stack developer with a preference for readable systems and useful interfaces.",
  "Currently moving toward practical AI consulting, especially retrieval, workflow support, and prototype strategy.",
  "Interested in building calmly: less hype, more working software that gives people leverage.",
];

const workingPrinciples = [
  "I start with the messy workflow before choosing the tool.",
  "I care about the interface, the implementation, and the handoff.",
  "I build small enough to learn quickly, then sturdy enough to keep.",
  "I explain tradeoffs in plain language so the next step is obvious.",
];

const linkedInBadgeScriptSrc = "https://platform.linkedin.com/badges/js/profile.js";
const linkedInProfileHref = "https://ca.linkedin.com/in/alex-russell-info?trk=profile-badge";

function LinkedInProfileBadge() {
  return (
    <div className="mt-8 max-w-md rounded-[1.4rem] border border-line/70 bg-white/42 p-4">
      <a
        className="flex items-center gap-4 rounded-[1.15rem] bg-[#0a66c2] p-4 text-white shadow-[0_18px_40px_rgb(10_102_194_/_0.18)] transition hover:-translate-y-0.5 hover:bg-[#084f96]"
        href={linkedInProfileHref}
        target="_blank"
        rel="noreferrer"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/16">
          <Linkedin aria-hidden="true" size={24} />
        </span>
        <span>
          <span className="block text-lg font-semibold leading-tight">Alex Russell</span>
          <span className="mt-1 block text-sm font-medium text-white/82">
            View LinkedIn profile
          </span>
        </span>
      </a>
      <div
        className="badge-base LI-profile-badge mt-4"
        data-locale="en_US"
        data-size="medium"
        data-theme="light"
        data-type="HORIZONTAL"
        data-vanity="alex-russell-info"
        data-version="v1"
      >
        <a
          className="badge-base__link LI-simple-link text-sm font-semibold text-ink-soft underline decoration-line underline-offset-4 transition hover:text-ink"
          href={linkedInProfileHref}
          target="_blank"
          rel="noreferrer"
        >
          Alex Russell
        </a>
      </div>
    </div>
  );
}

export default function About() {
  useEffect(() => {
    const existingScript = document.querySelector(`script[src="${linkedInBadgeScriptSrc}"]`);

    if (existingScript) {
      window.LI?.ProfileBadge?.init?.();
      return;
    }

    const script = document.createElement("script");
    script.src = linkedInBadgeScriptSrc;
    script.async = true;
    script.defer = true;
    script.type = "text/javascript";
    script.onload = () => window.LI?.ProfileBadge?.init?.();
    document.body.appendChild(script);
  }, []);

  return (
    <AnimatedPage>
      <section className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeading
            eyebrow="About"
            title="A developer profile with room for the person behind the systems."
            copy="This copy is temporary, but the page structure is ready for a more specific story about Alex's background, work preferences, and consulting direction."
          />
          <LinkedInProfileBadge />
        </div>
        <div className="surface rounded-[2.25rem] p-6 sm:p-8">
          <div className="aspect-[4/3] rounded-[2rem] border border-line/70 bg-[linear-gradient(135deg,rgb(96_116_102_/_0.16),rgb(138_182_200_/_0.18),rgb(189_111_76_/_0.12))]" />
          <div className="mt-8 grid gap-4">
            {notes.map((note) => (
              <p key={note} className="rounded-[1.4rem] border border-line/70 bg-white/34 p-4 text-sm leading-7 text-ink-soft">
                {note}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 rounded-[2.5rem] bg-ink p-6 text-paper sm:p-10">
        <p className="text-sm font-semibold text-peach">Working principles</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-paper/86 sm:text-5xl">
          Good systems take patience, and the right process saves it.
        </h2>
        <div className="mt-10 grid gap-0 border-y border-paper/16">
          {workingPrinciples.map((principle) => (
            <motion.div
              key={principle}
              className="grid grid-cols-[2rem_1fr] gap-5 border-b border-paper/12 py-6 last:border-b-0"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45 }}
            >
              <Check aria-hidden="true" className="mt-1 text-peach" size={18} />
              <p className="text-lg font-semibold leading-snug text-paper sm:text-xl">{principle}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </AnimatedPage>
  );
}
