import { useEffect, useRef, useState } from "react";
import { prepareWithSegments, layoutWithLines } from "./pretext.js";

const FULL_TEXT =
  "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, \"and what is the use of a book,\" thought Alice \"without pictures or conversations?\" So she was considering in her own mind, as well as she could, for the hot day made her feel very sleepy and stupid, whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.";
const SHORT_TEXT =
  "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, \"and what is the use of a book,\" thought Alice \"without pictures or conversations?\" So she was considering in her own mind.";

const FONT = "20px Georgia";
const LINE_HEIGHT = 28;
const MARGIN = 20;
const CONSTRAINT_DIST = 1.2;
const UNLOCK_THRESHOLD = 1;
const ITERATIONS = 12;
const DAMPING = 0.97;
const GRAVITY = 0.15;
const FIXED_DT = 1 / 120;
const MAX_STEPS = 4;

export default function PretextDemo() {
  const containerRef = useRef(null);
  const [hasDragged, setHasDragged] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    container.textContent = "";

    const isNarrow = container.getBoundingClientRect().width < 560;
    const text = isNarrow ? SHORT_TEXT : FULL_TEXT;
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    const measureCtx = document.createElement("canvas").getContext("2d");
    measureCtx.font = FONT;

    const prepared = prepareWithSegments(text, FONT);
    const allGraphemes = [...segmenter.segment(text)].map((segment) => segment.segment);
    const graphemeWidths = allGraphemes.map((grapheme) => measureCtx.measureText(grapheme).width);

    let gravityOn = true;
    let unraveling = false;
    let unravelIdx = -1;
    let frameId = 0;
    let lastTime = -1;
    let accumulator = 0;
    const drags = new Map();
    const els = [];

    function getMaxWidth() {
      return Math.max(220, container.getBoundingClientRect().width - MARGIN * 2);
    }

    function layoutPositions(maxWidth) {
      const rawPositions = [];
      let x = 0;
      let lineY = 0;

      for (let gi = 0; gi < allGraphemes.length; gi += 1) {
        const grapheme = allGraphemes[gi];
        const width = graphemeWidths[gi];

        if (grapheme === " " && x > 0) {
          let wordWidth = 0;
          for (
            let j = gi + 1;
            j < allGraphemes.length && allGraphemes[j] !== " ";
            j += 1
          ) {
            wordWidth += graphemeWidths[j];
          }

          if (x + width + wordWidth > maxWidth) {
            rawPositions.push({ x: x + MARGIN, y: lineY, width });
            x = 0;
            lineY += LINE_HEIGHT;
            continue;
          }
        }

        rawPositions.push({ x: x + MARGIN, y: lineY, width });
        x += width;
      }

      const totalHeight = lineY + LINE_HEIGHT;
      const offsetY = Math.max(28, (container.clientHeight - totalHeight) * 0.32);

      return rawPositions.map((position) => ({
        x: position.x,
        y: position.y + offsetY,
        width: position.width,
      }));
    }

    function buildZigzagMapping(maxWidth) {
      const { lines } = layoutWithLines(prepared, maxWidth, LINE_HEIGHT);
      const lineIndices = [];
      let gi = 0;

      for (let li = 0; li < lines.length; li += 1) {
        const lineGraphemes = [...segmenter.segment(lines[li].text)].map(
          (segment) => segment.segment,
        );
        const indices = [];
        for (let j = 0; j < lineGraphemes.length; j += 1) {
          indices.push(gi);
          gi += 1;
        }
        lineIndices.push(indices);
      }

      const lastLineIdx = lineIndices.length - 1;
      const needFlip = lastLineIdx % 2 === 1;
      const stringOrder = [];

      for (let li = 0; li < lineIndices.length; li += 1) {
        const reversed = needFlip ? li % 2 === 0 : li % 2 === 1;
        stringOrder.push(...(reversed ? [...lineIndices[li]].reverse() : lineIndices[li]));
      }

      return stringOrder;
    }

    let positions = layoutPositions(getMaxWidth());
    const stringOrder = buildZigzagMapping(getMaxWidth());
    const letters = stringOrder.map((readingIdx) => {
      const position = positions[readingIdx];
      return {
        ch: allGraphemes[readingIdx],
        width: position.width,
        x: position.x,
        y: position.y,
        ox: position.x,
        oy: position.y,
        px: position.x,
        py: position.y,
        readingIdx,
        locked: true,
      };
    });

    function computeRestLengths() {
      const rests = [];
      for (let i = 0; i < letters.length - 1; i += 1) {
        const a = letters[i];
        const b = letters[i + 1];
        const dist = Math.hypot(
          b.ox + b.width / 2 - (a.ox + a.width / 2),
          b.oy + LINE_HEIGHT / 2 - (a.oy + LINE_HEIGHT / 2),
        );
        rests.push(dist * CONSTRAINT_DIST);
      }
      return rests;
    }

    let restLengths = computeRestLengths();

    for (const letter of letters) {
      const span = document.createElement("span");
      span.className =
        "absolute left-0 top-0 font-serif text-[20px] leading-none text-ink-soft will-change-transform";
      span.textContent = letter.ch;
      span.style.pointerEvents = "none";
      container.appendChild(span);
      els.push(span);
    }

    const lastIdx = letters.length - 1;
    for (let i = lastIdx; i > Math.max(-1, lastIdx - 6); i -= 1) {
      letters[i].locked = false;
      els[i].style.pointerEvents = "auto";
      els[i].style.cursor = "grab";
      els[i].style.zIndex = "10";
      els[i].style.touchAction = "none";
    }

    const hint = document.createElement("span");
    hint.className =
      "pointer-events-none absolute left-0 top-0 flex items-end gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-clay/70 transition-opacity duration-700";
    hint.style.opacity = "0";

    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    arrow.setAttribute("viewBox", "0 0 42 28");
    arrow.setAttribute("width", "42");
    arrow.setAttribute("height", "28");
    arrow.setAttribute("fill", "none");
    arrow.setAttribute("aria-hidden", "true");

    const arrowDefs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const arrowMarker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    arrowMarker.setAttribute("id", "pretext-drag-arrowhead");
    arrowMarker.setAttribute("viewBox", "0 0 7 7");
    arrowMarker.setAttribute("markerWidth", "5");
    arrowMarker.setAttribute("markerHeight", "5");
    arrowMarker.setAttribute("refX", "6");
    arrowMarker.setAttribute("refY", "3.5");
    arrowMarker.setAttribute("orient", "auto");
    arrowMarker.setAttribute("markerUnits", "strokeWidth");

    const arrowMarkerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrowMarkerPath.setAttribute("d", "M0 0L7 3.5L0 7");
    arrowMarkerPath.setAttribute("stroke", "currentColor");
    arrowMarkerPath.setAttribute("stroke-width", "1.4");
    arrowMarkerPath.setAttribute("stroke-linecap", "round");
    arrowMarkerPath.setAttribute("stroke-linejoin", "round");
    arrowMarkerPath.setAttribute("fill", "none");

    arrowMarker.append(arrowMarkerPath);
    arrowDefs.append(arrowMarker);

    const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrowPath.setAttribute("d", "M4 21C14 5 27 4 36 12");
    arrowPath.setAttribute("stroke", "currentColor");
    arrowPath.setAttribute("stroke-width", "1.4");
    arrowPath.setAttribute("stroke-linecap", "round");
    arrowPath.setAttribute("marker-end", "url(#pretext-drag-arrowhead)");

    const hintText = document.createElement("span");
    hintText.textContent = "drag";

    arrow.append(arrowDefs, arrowPath);
    hint.append(arrow, hintText);
    container.appendChild(hint);

    function positionHint() {
      const last = letters[lastIdx];
      hint.style.transform = `translate(${last.ox - 42}px, ${last.oy + LINE_HEIGHT + 2}px)`;
    }

    function isDragged(idx) {
      for (const drag of drags.values()) {
        if (drag.idx === idx) {
          return true;
        }
      }
      return false;
    }

    function onKeyDown(event) {
      if (event.key !== "f" && event.key !== "F") {
        return;
      }

      gravityOn = !gravityOn;
      if (gravityOn && !unraveling) {
        unraveling = true;
        hint.style.opacity = "0";
        unravelIdx = letters.length - 1;
        while (unravelIdx >= 0 && !letters[unravelIdx].locked) {
          unravelIdx -= 1;
        }
      }
    }

    function onResize() {
      positions = layoutPositions(getMaxWidth());
      for (let i = 0; i < letters.length; i += 1) {
        const position = positions[letters[i].readingIdx];
        if (!position) {
          continue;
        }

        letters[i].ox = position.x;
        letters[i].oy = position.y;
        if (letters[i].locked) {
          letters[i].x = position.x;
          letters[i].y = position.y;
          letters[i].px = position.x;
          letters[i].py = position.y;
        }
      }
      restLengths = computeRestLengths();
      positionHint();
    }

    function onPointerDown(event) {
      const idx = els.indexOf(event.target);
      if (idx === -1 || letters[idx].locked || isDragged(idx)) {
        return;
      }

      const rect = container.getBoundingClientRect();
      drags.set(event.pointerId, {
        idx,
        offsetX: event.clientX - rect.left - letters[idx].x,
        offsetY: event.clientY - rect.top - letters[idx].y,
      });
      setHasDragged(true);
      els[idx].style.cursor = "grabbing";
      event.target.setPointerCapture(event.pointerId);
      event.preventDefault();
    }

    function onPointerMove(event) {
      const drag = drags.get(event.pointerId);
      if (!drag) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const letter = letters[drag.idx];
      letter.x = event.clientX - rect.left - drag.offsetX;
      letter.y = event.clientY - rect.top - drag.offsetY;
      letter.px = letter.x;
      letter.py = letter.y;
      letter.locked = false;
      setHasDragged(true);
      hint.style.opacity = "0";
    }

    function endPointer(event) {
      const drag = drags.get(event.pointerId);
      if (!drag) {
        return;
      }
      els[drag.idx].style.cursor = "grab";
      drags.delete(event.pointerId);
    }

    function simulate() {
      if (unraveling) {
        if (!gravityOn || unravelIdx < 0) {
          unraveling = false;
        } else if (letters[unravelIdx].locked) {
          letters[unravelIdx].locked = false;
          letters[unravelIdx].px = letters[unravelIdx].x;
          letters[unravelIdx].py = letters[unravelIdx].y - 0.5;
          unravelIdx -= 1;
        } else {
          unravelIdx -= 1;
        }
      }

      for (let i = letters.length - 2; i >= 0; i -= 1) {
        if (letters[i].locked && !letters[i + 1].locked) {
          const a = letters[i];
          const b = letters[i + 1];
          const dx = b.x + b.width / 2 - (a.ox + a.width / 2);
          const dy = b.y + LINE_HEIGHT / 2 - (a.oy + LINE_HEIGHT / 2);
          const dist = Math.hypot(dx, dy);
          if (dist > restLengths[i] + UNLOCK_THRESHOLD) {
            a.locked = false;
            a.px = a.x;
            a.py = a.y;
            hint.style.opacity = "0";
          }
        }
      }

      for (let i = 0; i < letters.length; i += 1) {
        const letter = letters[i];
        if (letter.locked || isDragged(i)) {
          continue;
        }
        const vx = (letter.x - letter.px) * DAMPING;
        const vy = (letter.y - letter.py) * DAMPING;
        letter.px = letter.x;
        letter.py = letter.y;
        letter.x += vx;
        letter.y += vy + (gravityOn ? GRAVITY : 0);
      }

      for (let iter = 0; iter < ITERATIONS; iter += 1) {
        for (let i = 0; i < letters.length - 1; i += 1) {
          const a = letters[i];
          const b = letters[i + 1];
          if (a.locked && b.locked) {
            continue;
          }

          const ax = a.x + a.width / 2;
          const ay = a.y + LINE_HEIGHT / 2;
          const bx = b.x + b.width / 2;
          const by = b.y + LINE_HEIGHT / 2;
          const dx = bx - ax;
          const dy = by - ay;
          const dist = Math.hypot(dx, dy) || 0.001;
          const diff = (dist - restLengths[i]) / dist;
          const aFixed = a.locked || isDragged(i);
          const bFixed = b.locked || isDragged(i + 1);

          if (aFixed && !bFixed) {
            b.x -= dx * diff;
            b.y -= dy * diff;
          } else if (!aFixed && bFixed) {
            a.x += dx * diff;
            a.y += dy * diff;
          } else if (!aFixed && !bFixed) {
            a.x += dx * diff * 0.5;
            a.y += dy * diff * 0.5;
            b.x -= dx * diff * 0.5;
            b.y -= dy * diff * 0.5;
          }
        }
      }

      const radius = 7;
      for (let i = 0; i < letters.length; i += 1) {
        if (letters[i].locked) {
          continue;
        }
        const a = letters[i];
        const acx = a.x + a.width / 2;
        const acy = a.y + LINE_HEIGHT / 2;

        for (let j = i + 1; j < letters.length; j += 1) {
          if (letters[j].locked || Math.abs(i - j) === 1) {
            continue;
          }

          const b = letters[j];
          const dx = b.x + b.width / 2 - acx;
          const dy = b.y + LINE_HEIGHT / 2 - acy;
          const dist = Math.hypot(dx, dy) || 0.001;
          const minDist = radius * 2;

          if (dist < minDist) {
            const overlap = ((minDist - dist) / dist) * 0.5;
            const aDragged = isDragged(i);
            const bDragged = isDragged(j);
            if (aDragged) {
              b.x += dx * overlap;
              b.y += dy * overlap;
            } else if (bDragged) {
              a.x -= dx * overlap;
              a.y -= dy * overlap;
            } else {
              a.x -= dx * overlap;
              a.y -= dy * overlap;
              b.x += dx * overlap;
              b.y += dy * overlap;
            }
          }
        }
      }

      const maxX = container.clientWidth;
      const maxY = container.clientHeight;
      const bounce = 0.4;

      for (let i = 0; i < letters.length; i += 1) {
        const letter = letters[i];
        if (letter.locked || isDragged(i)) {
          continue;
        }
        if (letter.x < 0) {
          letter.x = 0;
          letter.px = letter.x + (letter.x - letter.px) * bounce;
        }
        if (letter.x + letter.width > maxX) {
          letter.x = maxX - letter.width;
          letter.px = letter.x + (letter.x - letter.px) * bounce;
        }
        if (letter.y < 0) {
          letter.y = 0;
          letter.py = letter.y + (letter.y - letter.py) * bounce;
        }
        if (letter.y + LINE_HEIGHT > maxY) {
          letter.y = maxY - LINE_HEIGHT;
          letter.py = letter.y + (letter.y - letter.py) * bounce;
        }
      }
    }

    function render(now) {
      if (lastTime < 0) {
        lastTime = now;
        frameId = window.requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, MAX_STEPS * FIXED_DT);
      lastTime = now;
      accumulator += dt;

      while (accumulator >= FIXED_DT) {
        simulate();
        accumulator -= FIXED_DT;
      }

      for (let i = 0; i < letters.length; i += 1) {
        if (!letters[i].locked) {
          els[i].style.pointerEvents = "auto";
          els[i].style.cursor = els[i].style.cursor || "grab";
          els[i].style.zIndex = "10";
        }
        els[i].style.transform = `translate(${letters[i].x}px, ${letters[i].y}px)`;
      }

      frameId = window.requestAnimationFrame(render);
    }

    positionHint();
    const hintTimer = window.setTimeout(() => {
      hint.style.opacity = "1";
    }, 500);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endPointer);
    window.addEventListener("pointercancel", endPointer);
    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(hintTimer);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endPointer);
      window.removeEventListener("pointercancel", endPointer);
      container.textContent = "";
    };
  }, [resetKey]);

  return (
    <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden">
      <div
        ref={containerRef}
        aria-label="Interactive pretext typography demo"
        className="relative h-full w-full overflow-hidden bg-[#f5f0e8]"
      />
      {hasDragged && (
        <button
          type="button"
          onClick={() => {
            setHasDragged(false);
            setResetKey((key) => key + 1);
          }}
          className="absolute right-4 top-4 rounded-full bg-paper/80 px-3 py-1.5 text-xs font-semibold text-ink-soft opacity-100 shadow-[0_10px_30px_rgb(31_42_36_/_0.12)] backdrop-blur transition duration-200 hover:bg-paper hover:text-ink"
        >
          Reset
        </button>
      )}
    </div>
  );
}
