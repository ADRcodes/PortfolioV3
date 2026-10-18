import { useLayoutEffect, useRef } from 'react';

const words = ['techNL', 'Summit', '2026'];
const clamp = value => Math.max(0, Math.min(1, value));
const mix = (a, b, progress) => a + (b - a) * progress;
const ease = value => { const p = clamp(value); return p * p * (3 - 2 * p); };

// Measure the real heading and navigation slots, then move a single visible
// identity between them. Scroll updates touch transforms, never React state.
export default function SummitIdentity({ agenda, routeKey }) {
  const layer = useRef(null);
  useLayoutEffect(() => {
    const overlay = layer.current;
    const app = overlay.closest('.summit-app');
    const header = app.querySelector('.summit-header');
    const intro = app.querySelector('.summit-agenda-intro');
    if (!agenda || !intro) {
      app.style.setProperty('--summit-header-progress', '1');
      app.dataset.headerVisible = 'true';
      header.inert = false;
      return;
    }
    const source = [...intro.querySelectorAll('[data-brand-part]')];
    const target = [...header.querySelectorAll('[data-brand-part]')];
    const floating = [...overlay.children];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let geometry;
    let frame;
    const update = () => {
      frame = undefined;
      if (!geometry) return;
      const progress = clamp(window.scrollY / geometry.distance);
      const eased = ease(progress);
      const reveal = reduced.matches ? Number(window.scrollY > geometry.titleBottom) : clamp((eased - .08) / .72);
      app.style.setProperty('--summit-header-progress', reveal.toFixed(4));
      app.dataset.headerVisible = String(reveal > 0);
      header.inert = reveal < .8;
      app.dataset.identityReady = String(!reduced.matches);
      app.dataset.identityDocked = String(progress === 1);
      overlay.hidden = reduced.matches || progress === 1;
      if (!reduced.matches) {
        const [tech, summit, year] = geometry.parts;
        const shrink = ease(progress / .6);
        const merge = ease((progress - .45) / .55);
        const techScale = mix(1, tech.scale, shrink);
        const summitScale = mix(1, summit.scale, shrink);
        const techX = mix(tech.x, tech.target.x, eased);
        const techY = mix(tech.y, tech.target.y, eased);
        // Clear the first word horizontally before the second line joins it.
        const gap = summit.target.x - tech.target.x - tech.target.width;
        const summitX = mix(summit.x, techX + tech.width * techScale + gap, ease(progress / .45));
        const yearGap = mix(year.x - summit.x - summit.width, year.target.x - summit.target.x - summit.target.width, shrink);
        const positions = [
          { x: techX, y: techY },
          { x: summitX, y: techY + (summit.y - tech.y) * (1 - merge) },
          { x: summitX + summit.width * summitScale + yearGap, y: techY + (year.y - tech.y) * (1 - merge) },
        ];
        geometry.parts.forEach((part, index) => {
          const word = floating[index];
          word.style.transform = `translate3d(${positions[index].x}px, ${positions[index].y}px, 0) scale(${mix(1, part.scale, shrink)})`;
          if (index === 1) word.style.color = `rgb(${mix(239, 240, eased)} ${mix(188, 238, eased)} ${mix(146, 229, eased)})`;
        });
      }
    };
    const measure = () => {
      const parts = source.map((element, index) => {
        const rect = element.getBoundingClientRect();
        const destination = target[index].getBoundingClientRect();
        return { x: rect.left, y: rect.top + window.scrollY, width: rect.width, font: parseFloat(getComputedStyle(element).fontSize), scale: destination.width / rect.width, target: { x: destination.left, y: destination.top, width: destination.width } };
      });
      parts.forEach((part, index) => { floating[index].style.fontSize = `${part.font}px`; });
      geometry = {
        parts,
        distance: Math.max(200, Math.min(intro.offsetHeight * .32, 360)),
        titleBottom: Math.max(...source.map(element => element.getBoundingClientRect().bottom + window.scrollY)),
      };
      update();
    };
    const schedule = () => { if (frame === undefined) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(measure);
    observer.observe(intro);
    observer.observe(header);
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('summit:transition-capture', measure);
    reduced.addEventListener('change', measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      window.removeEventListener('summit:transition-capture', measure);
      reduced.removeEventListener('change', measure);
      delete app.dataset.identityReady;
      delete app.dataset.identityDocked;
      app.dataset.headerVisible = 'true';
      app.style.setProperty('--summit-header-progress', '1');
      header.inert = false;
      overlay.hidden = true;
    };
  }, [agenda, routeKey]);
  return <div ref={layer} className="summit-identity-flight" aria-hidden="true" hidden>{words.map((word, index) => <span key={word} className={`summit-identity-word${index ? ' summit-accent-type' : ''}`}>{word}</span>)}</div>;
}
