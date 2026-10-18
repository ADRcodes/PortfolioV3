import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { centerSession, formatTime, shortDay } from '../lib/agenda.js';

// An inline, sticky index: native scrolling and the range input stay in sync.
// Scrubbing never moves focus away from the control or queues smooth journeys.
export default function AgendaBrowser({ sessions }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const bar = useRef(null);
  const days = [...new Set(sessions.map(session => session.date))];
  useEffect(() => {
    const elements = sessions.map(session => document.getElementById(`agenda-${session.id}`));
    let frame;
    const update = () => {
      frame = undefined;
      const header = document.querySelector('.summit-header')?.getBoundingClientRect().height ?? 0;
      const first = elements[0]?.closest('[data-agenda-slot]');
      const firstTop = first?.getBoundingClientRect().top ?? Infinity;
      const focused = bar.current?.contains(document.activeElement);
      setVisible(firstTop < header + 8 || Boolean(focused && firstTop < window.innerHeight * .65));
      const top = header + (bar.current?.offsetHeight ?? 0) + 16;
      const nav = document.querySelector('.summit-primary-nav');
      const bottom = nav && getComputedStyle(nav).position === 'fixed' ? nav.offsetHeight : 0;
      const center = top + Math.max(0, window.innerHeight - bottom - top - 16) / 2;
      let nearest = 0;
      let distance = Infinity;
      elements.forEach((element, position) => {
        if (!element) return;
        const rect = (element.closest('[data-agenda-slot]') || element).getBoundingClientRect();
        const gap = Math.max(rect.top - center, center - rect.bottom, 0);
        if (gap < distance) { nearest = position; distance = gap; }
      });
      const slot = elements[nearest]?.closest('[data-agenda-slot]');
      const track = slot?.querySelector('.summit-slot-cards');
      if (track && track.scrollWidth > track.clientWidth + 1) {
        const left = track.getBoundingClientRect().left;
        const siblings = elements.map((element, position) => ({ element, position })).filter(item => item.element?.closest('[data-agenda-slot]') === slot);
        nearest = siblings.reduce((a, b) => Math.abs(a.element.getBoundingClientRect().left - left) <= Math.abs(b.element.getBoundingClientRect().left - left) ? a : b).position;
        setIndex(nearest);
      } else {
        setIndex(previous => slot && elements[previous]?.closest('[data-agenda-slot]') === slot ? previous : nearest);
      }
    };
    const schedule = () => { if (frame === undefined) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true, capture: true });
    window.addEventListener('focusin', schedule);
    window.addEventListener('focusout', schedule);
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('focusin', schedule);
      window.removeEventListener('focusout', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [sessions]);
  if (sessions.length < 2) return null;
  const current = sessions[index] ?? sessions[0];
  const move = (position, behavior = 'smooth') => {
    const next = Math.max(0, Math.min(sessions.length - 1, position));
    setIndex(next);
    centerSession(document.getElementById(`agenda-${sessions[next].id}`), behavior);
  };
  return <nav ref={bar} className={`summit-agenda-browser${visible ? ' is-visible' : ''}`} aria-label="Quick agenda navigation" aria-hidden={!visible} inert={!visible}>
    <div className="summit-browser-days" aria-label="Conference days">
      {days.map(day => <button key={day} aria-pressed={day === current.date} onClick={() => move(sessions.findIndex(session => session.date === day))}>{shortDay(day)}</button>)}
    </div>
    <div className="summit-browser-scrubber">
      <label className="summit-sr-only" htmlFor="summit-session-range">Quick scroll through sessions</label>
      <div className="summit-browser-track">
        <button aria-label="Previous session" disabled={index === 0} onClick={() => move(index - 1)}><ChevronLeft size={18} aria-hidden="true" /></button>
        <input id="summit-session-range" type="range" min="0" max={sessions.length - 1} step="1" value={index} aria-valuetext={`${shortDay(current.date)}, ${formatTime(current.startTime)}. ${current.title}. Session ${index + 1} of ${sessions.length}`} onChange={event => move(Number(event.target.value), 'instant')} />
        <output className="summit-browser-count" aria-hidden="true">{index + 1}/{sessions.length}</output>
        <button aria-label="Next session" disabled={index === sessions.length - 1} onClick={() => move(index + 1)}><ChevronRight size={18} aria-hidden="true" /></button>
      </div>
    </div>
  </nav>;
}
