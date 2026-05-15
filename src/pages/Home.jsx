import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router";

const introLines = [
  [
    { text: "Hi, I'm " },
    {
      text: "Alex Russell",
      to: "/about",
      destination: "About",
      color: "#7f95bd",
      colorDelay: 0.04,
    },
    { text: "." },
  ],
  [
    { text: "I build practical " },
    {
      text: "AI-powered web tools",
      to: "/projects",
      destination: "Projects",
      color: "#c08b7d",
      colorDelay: 0.16,
    },
    { text: " for messy workflows and " },
    {
      text: "ideas that inspire me",
      to: "/playground",
      destination: "Playground",
      color: "#7fa587",
      colorDelay: 0.28,
      confettiWord: "inspire",
    },
    { text: "." },
  ],
];

const firstLineLength = introLines[0].reduce((total, token) => total + token.text.length, 0);
const totalIntroLength = introLines.flat().reduce((total, token) => total + token.text.length, 0);
const introSentence = `${introLines[0].map((token) => token.text).join("")} ${introLines[1]
  .map((token) => token.text)
  .join("")}`;
const initialVisibleLength = 2;

const motionConfettiPieces = [
  { x: -112, y: -96, endX: -190, fall: 330, rotate: -390, color: "bg-cobalt" },
  { x: -54, y: -130, endX: -92, fall: 355, rotate: 360, color: "bg-clay" },
  { x: 18, y: -124, endX: 46, fall: 340, rotate: -330, color: "bg-sky" },
  { x: 102, y: -82, endX: 178, fall: 370, rotate: 420, color: "bg-peach" },
  { x: -136, y: -20, endX: -230, fall: 390, rotate: 310, color: "bg-lilac" },
  { x: 144, y: -12, endX: 246, fall: 405, rotate: -370, color: "bg-moss" },
  { x: -28, y: -84, endX: -66, fall: 425, rotate: 440, color: "bg-cobalt" },
  { x: 62, y: -66, endX: 126, fall: 415, rotate: -430, color: "bg-clay" },
];

const hoverSides = ["left", "right", "top", "bottom"];

const hoverLabelStyles = {
  left: {
    hidden: { opacity: 0, x: -42, y: "-50%" },
    visible: { opacity: 1, x: 0, y: "-50%" },
  },
  right: {
    hidden: { opacity: 0, x: 42, y: "-50%" },
    visible: { opacity: 1, x: 0, y: "-50%" },
  },
  top: {
    hidden: { opacity: 0, x: "-50%", y: -42 },
    visible: { opacity: 1, x: "-50%", y: 0 },
  },
  bottom: {
    hidden: { opacity: 0, x: "-50%", y: 42 },
    visible: { opacity: 1, x: "-50%", y: 0 },
  },
};

function getRandomHoverPlacement() {
  const side = hoverSides[Math.floor(Math.random() * hoverSides.length)];
  const offset = 14 + Math.random() * 72;

  return { side, offset };
}

function getHoverLabelPosition({ side, offset }) {
  if (side === "left") {
    return { left: "1.5rem", top: `${offset}%` };
  }

  if (side === "right") {
    return { right: "1.5rem", top: `${offset}%` };
  }

  if (side === "top") {
    return { left: `${offset}%`, top: "1.5rem" };
  }

  return { bottom: "1.5rem", left: `${offset}%` };
}

function getAccessibleTypedText(typedLength) {
  const firstLineText = introLines[0].map((token) => token.text).join("");
  const secondLineText = introLines[1].map((token) => token.text).join("");

  if (typedLength <= firstLineLength) {
    return firstLineText.slice(0, typedLength);
  }

  return `${firstLineText} ${secondLineText.slice(0, typedLength - firstLineLength)}`;
}

function MotionConfettiBurst({ isVisible }) {
  if (!isVisible) {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1"
    >
      {motionConfettiPieces.map((piece, index) => (
        <motion.span
          key={`${piece.color}-${index}`}
          className={`absolute h-2.5 w-4 rounded-[0.25rem] shadow-[0_8px_18px_rgb(31_42_36_/_0.1)] ${piece.color}`}
          initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.45 }}
          animate={{
            opacity: [0, 1, 0],
            x: [0, piece.x, piece.endX],
            y: [0, piece.y, piece.fall],
            rotate: [0, piece.rotate * 0.35, piece.rotate],
            scale: [0.65, 1.15, 0.85],
          }}
          transition={{
            duration: 2.2,
            delay: index * 0.045,
            times: [0, 0.28, 1],
            ease: ["easeOut", "easeIn"],
          }}
        />
      ))}
    </span>
  );
}

function RevealChars({ text, startIndex, typedLength, hasStarted, isComplete }) {
  return Array.from(text).map((char, index) => {
    const absoluteIndex = startIndex + index;
    const isTyped = absoluteIndex < typedLength;
    const shouldShowCursor =
      hasStarted && !isComplete && absoluteIndex === Math.max(0, typedLength - 1);

    return (
      <span key={`${startIndex}-${index}`} className="relative">
        <span className={isTyped ? "visible" : "invisible"}>{char}</span>
        {shouldShowCursor && (
          <motion.span
            aria-hidden="true"
            className="absolute -right-[0.12em] top-[0.12em] inline-block h-[0.85em] w-[0.08em] rounded-full bg-clay"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.75, repeat: Infinity }}
          />
        )}
      </span>
    );
  });
}

function HoverPageLabel({ hoverTarget }) {
  const style = hoverLabelStyles[hoverTarget?.side] ?? hoverLabelStyles.left;
  const position = hoverTarget ? getHoverLabelPosition(hoverTarget) : {};

  return (
    <AnimatePresence>
      {hoverTarget && (
        <motion.div
          key={hoverTarget.id}
          aria-hidden="true"
          className="pointer-events-none fixed z-40 rounded-full px-5 py-3 text-base font-semibold text-paper shadow-[0_18px_50px_rgb(31_42_36_/_0.18)]"
          style={{ ...position, backgroundColor: hoverTarget.color }}
          initial={style.hidden}
          animate={style.visible}
          exit={style.hidden}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {hoverTarget.destination}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LinkedRevealText({ token, startIndex, typedLength, hasStarted, isComplete }) {
  if (!token.confettiWord) {
    return (
      <RevealChars
        text={token.text}
        startIndex={startIndex}
        typedLength={typedLength}
        hasStarted={hasStarted}
        isComplete={isComplete}
      />
    );
  }

  const wordStart = token.text.indexOf(token.confettiWord);
  const before = token.text.slice(0, wordStart);
  const word = token.text.slice(wordStart, wordStart + token.confettiWord.length);
  const after = token.text.slice(wordStart + token.confettiWord.length);
  const wordAbsoluteStart = startIndex + wordStart;

  return (
    <>
      <RevealChars
        text={before}
        startIndex={startIndex}
        typedLength={typedLength}
        hasStarted={hasStarted}
        isComplete={isComplete}
      />
      <span className="relative inline-block">
        <RevealChars
          text={word}
          startIndex={wordAbsoluteStart}
          typedLength={typedLength}
          hasStarted={hasStarted}
          isComplete={isComplete}
        />
        <MotionConfettiBurst isVisible={typedLength >= wordAbsoluteStart + word.length} />
      </span>
      <RevealChars
        text={after}
        startIndex={wordAbsoluteStart + word.length}
        typedLength={typedLength}
        hasStarted={hasStarted}
        isComplete={isComplete}
      />
    </>
  );
}

function HeroTextLink({
  token,
  startIndex,
  typedLength,
  hasStarted,
  isComplete,
  isInteractive,
  onHoverChange,
}) {
  const showHoverTarget = () => {
    if (!isInteractive) {
      return;
    }

    const placement = getRandomHoverPlacement();

    onHoverChange({
      id: `${token.destination}-${Date.now()}-${Math.random()}`,
      destination: token.destination,
      color: token.color,
      ...placement,
    });
  };

  return (
    <NavLink
      to={token.to}
      title={token.destination}
      aria-label={`Go to ${token.destination}`}
      onClick={(event) => event.stopPropagation()}
      tabIndex={isInteractive ? undefined : -1}
      className="group/link relative inline text-inherit"
      style={{ pointerEvents: isInteractive ? "auto" : "none" }}
      onMouseEnter={showHoverTarget}
      onMouseLeave={() => onHoverChange(null)}
      onFocus={showHoverTarget}
      onBlur={() => onHoverChange(null)}
    >
      <motion.span
        initial={false}
        animate={{ color: isInteractive ? token.color : "#1f2a24" }}
        transition={{
          duration: 0.34,
          delay: isInteractive ? token.colorDelay : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <LinkedRevealText
          token={token}
          startIndex={startIndex}
          typedLength={typedLength}
          hasStarted={hasStarted}
          isComplete={isComplete}
        />
      </motion.span>
    </NavLink>
  );
}

function IntroText({ typedLength, hasStarted, isComplete, isInteractive, onHoverChange }) {
  let consumed = 0;

  return (
    <motion.h1
      className="relative w-full text-[clamp(2.1rem,4.8vw,4.35rem)] font-semibold leading-[1.04] tracking-normal text-ink"
      initial={{ opacity: 0, y: 12 }}
      animate={hasStarted ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      aria-label={isInteractive ? introSentence : getAccessibleTypedText(typedLength)}
      aria-live="polite"
    >
      {introLines.map((line, lineIndex) => (
        <span key={lineIndex} className={lineIndex === 0 ? "block whitespace-nowrap" : "block"}>
          {line.map((token) => {
            const startIndex = consumed;
            consumed += token.text.length;

            if (token.to) {
              return (
                <HeroTextLink
                  key={`${lineIndex}-${startIndex}`}
                  token={token}
                  startIndex={startIndex}
                  typedLength={typedLength}
                  hasStarted={hasStarted}
                  isComplete={isComplete}
                  isInteractive={isInteractive}
                  onHoverChange={onHoverChange}
                />
              );
            }

            return (
              <RevealChars
                key={`${lineIndex}-${startIndex}`}
                text={token.text}
                startIndex={startIndex}
                typedLength={typedLength}
                hasStarted={hasStarted}
                isComplete={isComplete}
              />
            );
          })}
        </span>
      ))}
    </motion.h1>
  );
}

function InlineNavLink({ to, destination, color, colorDelay, isInteractive, onHoverChange, children }) {
  const showHoverTarget = () => {
    if (!isInteractive) {
      return;
    }

    const placement = getRandomHoverPlacement();

    onHoverChange({
      id: `${destination}-${Date.now()}-${Math.random()}`,
      destination,
      color,
      ...placement,
    });
  };

  return (
    <NavLink
      to={to}
      title={destination}
      aria-label={`Go to ${destination}`}
      onClick={(event) => event.stopPropagation()}
      tabIndex={isInteractive ? undefined : -1}
      className="group/link relative inline text-inherit"
      style={{ pointerEvents: isInteractive ? "auto" : "none" }}
      onMouseEnter={showHoverTarget}
      onMouseLeave={() => onHoverChange(null)}
      onFocus={showHoverTarget}
      onBlur={() => onHoverChange(null)}
    >
      <motion.span
        initial={false}
        animate={{ color: isInteractive ? color : "#526059" }}
        transition={{
          duration: 0.34,
          delay: isInteractive ? colorDelay : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.span>
    </NavLink>
  );
}

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [typedLength, setTypedLength] = useState(initialVisibleLength);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [hoverTarget, setHoverTarget] = useState(null);
  const timersRef = useRef([]);
  const frameRef = useRef(null);
  const isComplete = typedLength >= totalIntroLength;
  const typedText = useMemo(() => getAccessibleTypedText(typedLength), [typedLength]);

  const finishIntro = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    setHasStarted(true);
    setTypedLength(totalIntroLength);
    setIsNavVisible(true);
    setHoverTarget(null);
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    window.scrollTo(0, 0);

    if (reduceMotion) {
      setHasStarted(true);
      setTypedLength(totalIntroLength);
      setIsNavVisible(true);
      return undefined;
    }

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const timers = [];
    timersRef.current = timers;
    const schedule = (callback, delay) => {
      const timer = window.setTimeout(callback, delay);
      timers.push(timer);
      return timer;
    };

    schedule(() => setHasStarted(true), 650);

    schedule(() => {
      let index = initialVisibleLength;
      let lastStepAt = performance.now();
      let pauseUntil = 0;
      const characterDelay = 42;
      const namePauseDelay = 850;

      const step = (now) => {
        if (pauseUntil) {
          if (now < pauseUntil) {
            frameRef.current = window.requestAnimationFrame(step);
            return;
          }

          pauseUntil = 0;
          lastStepAt = now;
          frameRef.current = window.requestAnimationFrame(step);
          return;
        }

        if (now - lastStepAt < characterDelay) {
          frameRef.current = window.requestAnimationFrame(step);
          return;
        }

        const previousIndex = index;
        const stepsToCatchUp = Math.max(1, Math.floor((now - lastStepAt) / characterDelay));
        index = Math.min(totalIntroLength, index + stepsToCatchUp);

        if (previousIndex < firstLineLength && index >= firstLineLength) {
          index = firstLineLength;
        }

        lastStepAt = now;
        setTypedLength(index);

        if (index >= totalIntroLength) {
          frameRef.current = null;
          schedule(() => {
            setIsNavVisible(true);
            document.body.style.overflow = originalOverflow;
            document.documentElement.style.overflow = originalHtmlOverflow;
          }, 650);
          return;
        }

        if (index === firstLineLength) {
          pauseUntil = now + namePauseDelay;
        } else {
          pauseUntil = 0;
        }

        frameRef.current = window.requestAnimationFrame(step);
      };

      frameRef.current = window.requestAnimationFrame(step);
    }, 1100);

    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  return (
    <main
      className="relative grid h-svh place-items-center overflow-hidden bg-paper text-ink"
      onClick={() => {
        if (!isComplete || !isNavVisible) {
          finishIntro();
        }
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,rgb(138_182_200_/_0.12),transparent_24rem),radial-gradient(circle_at_74%_66%,rgb(189_111_76_/_0.12),transparent_28rem)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.42] [background-image:linear-gradient(rgb(31_42_36_/_0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(31_42_36_/_0.028)_1px,transparent_1px)] [background-size:44px_44px]" />

      <HoverPageLabel hoverTarget={hoverTarget} />

      <div className="relative z-10 mx-auto flex h-svh w-full max-w-5xl flex-col items-center justify-center gap-10 px-8 py-24 text-center sm:px-10 md:px-16 lg:px-12">
        <IntroText
          typedText={typedText}
          typedLength={typedLength}
          hasStarted={hasStarted}
          isComplete={isComplete}
          isInteractive={isNavVisible}
          onHoverChange={setHoverTarget}
        />
        <div className="min-h-[8.5rem] sm:min-h-[9rem] lg:min-h-[10rem]">
          <motion.p
            className="max-w-3xl text-balance text-2xl font-semibold leading-9 text-ink-soft sm:text-3xl sm:leading-10 lg:text-4xl lg:leading-[1.15]"
            aria-hidden={!isNavVisible}
            initial={false}
            animate={
              isNavVisible
                ? {
                    opacity: [0, 1, 1],
                    y: [20, -6, 0],
                    scale: [0.94, 1.04, 1],
                    rotate: [-1.2, 0.45, 0],
                  }
                : { opacity: 0, y: 16, scale: 0.96, rotate: -1 }
            }
            transition={{
              duration: 0.9,
              delay: 0.4,
              times: [0, 0.62, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ pointerEvents: isNavVisible ? "auto" : "none" }}
          >
            If you'd like to build something together, I'd love to{" "}
            <InlineNavLink
              to="/contact"
              destination="Contact"
              color="#a38ac0"
              colorDelay={0.4}
              isInteractive={isNavVisible}
              onHoverChange={setHoverTarget}
            >
              connect
            </InlineNavLink>
            .
          </motion.p>
        </div>
      </div>
    </main>
  );
}
