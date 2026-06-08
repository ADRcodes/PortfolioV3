import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router";

const introLines = [
  [
    { text: "Hi, I'm " },
    {
      text: "Alex Russell",
      to: "/about",
      destination: "About",
      color: "#7188b2",
      colorDelay: 0.04,
      hoverEffect: "lift",
      underlinePath:
        "M3 7.4 C16 4.6 31 7.8 45 6.2 C61 4.5 75 8.1 91 6.5 C103 5.2 111 5.8 117 4.8",
      underlineAccentPath:
        "M6 8.3 C24 6.6 37 8.4 54 7.1 C72 5.8 85 7.7 101 6.7 C110 6.1 115 6.5 118 5.9",
      underlineDelay: 0.46,
    },
    { text: "." },
  ],
  [
    { text: "I build practical " },
    {
      text: "AI-powered web tools",
      to: "/projects",
      destination: "Projects",
      color: "#b47d6f",
      colorDelay: 0.16,
      hoverEffect: "spread",
      underlinePath:
        "M2 6.5 C18 7.7 28 4.9 43 6.1 C59 7.3 72 5.0 88 6.0 C101 6.8 109 4.8 118 5.7",
      underlineAccentPath:
        "M4 7.8 C19 6.9 35 7.9 50 7.0 C67 6.0 78 7.3 94 6.5 C106 5.9 113 6.3 118 5.6",
      underlineDelay: 0.64,
    },
    { text: " for messy workflows and " },
    {
      text: "ideas that inspire me",
      to: "/playground",
      destination: "Playground",
      color: "#71987a",
      colorDelay: 0.28,
      underlineDelay: 0.82,
      confettiWord: "inspire",
      hoverEffect: "glow",
      underlinePath:
        "M2 7.0 C14 5.7 27 6.8 39 5.5 C55 3.9 69 7.5 84 6.2 C98 5.1 108 7.0 118 5.2",
      underlineAccentPath:
        "M5 8.5 C20 7.2 32 8.1 48 7.0 C62 6.1 78 8.4 93 7.0 C106 5.8 113 6.8 118 6.1",
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

function useIsMobileViewport() {
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const updateViewportState = () => setIsMobileViewport(media.matches);

    updateViewportState();
    media.addEventListener("change", updateViewportState);

    return () => media.removeEventListener("change", updateViewportState);
  }, []);

  return isMobileViewport;
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

function AnimatedLinkText({
  children,
  color,
  colorDelay,
  hoverEffect = "lift",
  isEmphasized,
  isInteractive,
  mobileCompact = false,
  restingColor,
  underlineAccentPath,
  underlineDelay,
  underlinePath,
}) {
  const shouldReduceMotion = useReducedMotion();
  const isMobileViewport = useIsMobileViewport();
  const [hasDrawnUnderline, setHasDrawnUnderline] = useState(false);
  const encodedColor = color.replace("#", "%23");
  const mainPath =
    underlinePath ||
    "M3 7.4 C17 3.9 30 7.9 45 6.4 C61 4.7 73 8.4 88 6.6 C101 5.1 110 5.8 117 4.6";
  const accentPath =
    underlineAccentPath ||
    "M5 8.2 C23 6.6 36 8.7 52 7.4 C69 6.1 82 7.8 98 6.8 C108 6.2 114 6.6 118 5.9";
  const underlineImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 12' preserveAspectRatio='none'%3E%3Cpath d='${mainPath}' fill='none' stroke='${encodedColor}' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round' opacity='0.92'/%3E%3Cpath d='${accentPath}' fill='none' stroke='${encodedColor}' stroke-width='1.35' stroke-linecap='round' opacity='0.45'/%3E%3C/svg%3E")`;
  const hoverStyles = {
    lift: {
      filter: "brightness(0.96) saturate(1.08)",
      underlinePosition: "0 104%",
      underlineSize: "102% 0.235em",
    },
    spread: {
      filter: "brightness(0.97) saturate(1.12)",
      underlinePosition: "50% 104%",
      underlineSize: "102% 0.245em",
    },
    glow: {
      filter: "brightness(0.94) saturate(1.18)",
      underlinePosition: "0 105%",
      underlineSize: "101% 0.25em",
    },
    settle: {
      filter: "brightness(0.96) saturate(1.08)",
      underlinePosition: "0 103%",
      underlineSize: "101% 0.22em",
    },
  };
  const activeHoverStyle = hoverStyles[hoverEffect] ?? hoverStyles.lift;
  const shouldUseCompactUnderline = mobileCompact && isMobileViewport;
  const restingUnderlineSize = shouldUseCompactUnderline ? "100% 0.15em" : "100% 0.175em";
  const underlineSize = isEmphasized ? activeHoverStyle.underlineSize : restingUnderlineSize;
  const underlinePosition = isEmphasized ? activeHoverStyle.underlinePosition : "0 101%";
  const isIntroducingUnderline = isInteractive && !hasDrawnUnderline;

  useEffect(() => {
    if (!isInteractive) {
      setHasDrawnUnderline(false);
      return undefined;
    }

    if (shouldReduceMotion) {
      setHasDrawnUnderline(true);
      return undefined;
    }

    const timer = window.setTimeout(
      () => setHasDrawnUnderline(true),
      underlineDelay * 1000 + 250,
    );

    return () => window.clearTimeout(timer);
  }, [isInteractive, shouldReduceMotion, underlineDelay]);

  useEffect(() => {
    if (isInteractive && isEmphasized) {
      setHasDrawnUnderline(true);
    }
  }, [isEmphasized, isInteractive]);

  return (
    <motion.span
      initial={false}
      animate={{
        color: isInteractive ? color : restingColor,
        backgroundSize: isInteractive ? underlineSize : "0% 0.06em",
        backgroundPosition: underlinePosition,
        filter: isInteractive && isEmphasized ? activeHoverStyle.filter : "brightness(1) saturate(1)",
      }}
      transition={{
        color: {
          duration: shouldReduceMotion ? 0 : 0.34,
          delay: shouldReduceMotion || !isInteractive ? 0 : colorDelay,
          ease: [0.22, 1, 0.36, 1],
        },
        backgroundSize: {
          duration: shouldReduceMotion ? 0 : isEmphasized ? 0.16 : 0.22,
          delay: shouldReduceMotion || !isIntroducingUnderline ? 0 : underlineDelay,
          ease: [0.22, 1, 0.36, 1],
        },
        backgroundPosition: {
          duration: shouldReduceMotion ? 0 : 0.2,
          ease: [0.22, 1, 0.36, 1],
        },
        filter: {
          duration: shouldReduceMotion ? 0 : 0.2,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      style={{
        backgroundImage: underlineImage,
        backgroundRepeat: "no-repeat",
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      }}
    >
      {children}
    </motion.span>
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
  const [isEmphasized, setIsEmphasized] = useState(false);

  const showHoverTarget = () => {
    if (!isInteractive) {
      return;
    }

    setIsEmphasized(true);
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
      onMouseLeave={() => {
        setIsEmphasized(false);
        onHoverChange(null);
      }}
      onFocus={showHoverTarget}
      onBlur={() => {
        setIsEmphasized(false);
        onHoverChange(null);
      }}
    >
      <AnimatedLinkText
        color={token.color}
        colorDelay={token.colorDelay}
        hoverEffect={token.hoverEffect}
        isEmphasized={isEmphasized}
        isInteractive={isInteractive}
        mobileCompact
        restingColor="#1f2a24"
        underlineAccentPath={token.underlineAccentPath}
        underlineDelay={token.underlineDelay}
        underlinePath={token.underlinePath}
      >
        <LinkedRevealText
          token={token}
          startIndex={startIndex}
          typedLength={typedLength}
          hasStarted={hasStarted}
          isComplete={isComplete}
        />
      </AnimatedLinkText>
    </NavLink>
  );
}

function IntroText({ typedLength, hasStarted, isComplete, isInteractive, onHoverChange }) {
  let consumed = 0;

  return (
    <motion.h1
      className="relative w-full text-[clamp(1.72rem,8.9vw,2.85rem)] font-semibold leading-[1.1] tracking-normal text-ink sm:text-[clamp(2.1rem,4.8vw,4.35rem)] sm:leading-[1.04]"
      initial={{ opacity: 0, y: 12 }}
      animate={hasStarted ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      aria-label={isInteractive ? introSentence : getAccessibleTypedText(typedLength)}
      aria-live="polite"
    >
      {introLines.map((line, lineIndex) => (
        <span key={lineIndex} className={lineIndex === 0 ? "block sm:whitespace-nowrap" : "block"}>
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

function InlineNavLink({
  to,
  destination,
  color,
  colorDelay,
  hoverEffect,
  underlineAccentPath,
  underlineDelay,
  underlinePath,
  isInteractive,
  mobileCompact = false,
  onHoverChange,
  children,
}) {
  const [isEmphasized, setIsEmphasized] = useState(false);

  const showHoverTarget = () => {
    if (!isInteractive) {
      return;
    }

    setIsEmphasized(true);
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
      onMouseLeave={() => {
        setIsEmphasized(false);
        onHoverChange(null);
      }}
      onFocus={showHoverTarget}
      onBlur={() => {
        setIsEmphasized(false);
        onHoverChange(null);
      }}
    >
      <AnimatedLinkText
        color={color}
        colorDelay={colorDelay}
        hoverEffect={hoverEffect}
        isEmphasized={isEmphasized}
        isInteractive={isInteractive}
        mobileCompact={mobileCompact}
        restingColor="#526059"
        underlineAccentPath={underlineAccentPath}
        underlineDelay={underlineDelay}
        underlinePath={underlinePath}
      >
        {children}
      </AnimatedLinkText>
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
      const secondLineCharacterDelay = 30;
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

        const currentCharacterDelay = index >= firstLineLength ? secondLineCharacterDelay : characterDelay;

        if (now - lastStepAt < currentCharacterDelay) {
          frameRef.current = window.requestAnimationFrame(step);
          return;
        }

        const previousIndex = index;
        const stepsToCatchUp = Math.max(1, Math.floor((now - lastStepAt) / currentCharacterDelay));
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

      <div className="relative z-10 mx-auto flex h-svh w-full max-w-5xl flex-col items-center justify-center gap-8 px-5 py-20 text-center sm:gap-10 sm:px-10 sm:py-24 md:px-16 lg:px-12">
        <IntroText
          typedText={typedText}
          typedLength={typedLength}
          hasStarted={hasStarted}
          isComplete={isComplete}
          isInteractive={isNavVisible}
          onHoverChange={setHoverTarget}
        />
        <motion.p
          className="mx-auto -mt-4 max-w-[18rem] text-sm font-semibold leading-6 text-ink-soft/85 sm:hidden"
          aria-hidden={!isNavVisible}
          initial={false}
          animate={isNavVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{
            duration: 0.45,
            delay: 4,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Tap an underlined phrase to explore.
        </motion.p>
        <div className="min-h-[8.5rem] sm:min-h-[9rem] lg:min-h-[10rem]">
          <motion.p
            className="max-w-3xl text-balance text-xl font-semibold leading-8 text-ink-soft sm:text-3xl sm:leading-10 lg:text-4xl lg:leading-[1.15]"
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
              color="#957bb4"
              colorDelay={0.4}
              hoverEffect="settle"
              underlinePath="M3 6.9 C16 7.6 26 5.9 39 6.7 C52 7.6 63 5.8 77 6.4 C91 7.1 104 5.7 117 6.2"
              underlineAccentPath="M6 8.1 C20 7.4 34 8.0 49 7.2 C64 6.4 80 7.7 96 6.9 C106 6.4 113 6.7 118 6.2"
              underlineDelay={1.18}
              isInteractive={isNavVisible}
              mobileCompact
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
