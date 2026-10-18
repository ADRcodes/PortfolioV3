import { useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { revealSession } from './agenda.js';

const detailSlug = path => path.match(/\/sessions\/([^/]+)\/?$/)?.[1];
const profilePath = path => path.match(/\/(speakers|companies)\/([^/]+)\/?$/)?.slice(1).join('/');

function clearNames() {
  document.querySelectorAll('[data-summit-shared]').forEach(element => {
    element.style.removeProperty('view-transition-name');
    element.removeAttribute('data-summit-shared');
  });
}

function clearOrigins() {
  document.querySelectorAll('[data-profile-origin], [data-session-origin]').forEach(element => {
    element.removeAttribute('data-profile-origin');
    element.removeAttribute('data-session-origin');
  });
}

function nameShared(slug, profile) {
  clearNames();
  const assign = (element, name) => {
    element.style.viewTransitionName = `session-${name}`;
    element.dataset.summitShared = name;
  };
  if (profile) {
    const matches = [...document.querySelectorAll(`[data-profile="${CSS.escape(profile)}"]`)];
    const visible = matches.filter(element => { const r = element.getBoundingClientRect(); return r.bottom > 80 && r.top < window.innerHeight; });
    const target = matches.find(element => element.matches('[data-profile-origin], h1')) || visible.sort((a, b) => Math.abs(a.getBoundingClientRect().top - window.innerHeight / 2) - Math.abs(b.getBoundingClientRect().top - window.innerHeight / 2))[0] || matches[0];
    if (target) assign(target, 'profile-title');
  } else if (slug) {
    const surface = document.querySelector(`[data-session="${CSS.escape(slug)}"]`);
    if (surface) revealSession(surface);
    surface?.querySelectorAll('[data-shared]').forEach(element => assign(element, element.dataset.shared));
    const railTime = surface?.closest('.summit-timeline > li')?.querySelector('.summit-time-marker [data-shared="time"]');
    if (railTime) assign(railTime, 'time');
  }
}

// Hold the old route until the browser has photographed it. This also covers
// Back/Forward without replacing the portfolio's router or normal link behavior.
export default function useSummitTransition(location) {
  const [displayed, setDisplayed] = useState(location);
  const current = useRef(location);
  const active = useRef(null);
  const generation = useRef(0);
  const cardJourneys = useRef(new Map());

  useLayoutEffect(() => {
    if (current.current === location) return;
    const previous = current.current;
    current.current = location;
    const token = ++generation.current;
    active.current?.skipTransition();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduced || previous.pathname === location.pathname) {
      clearNames();
      clearOrigins();
      delete document.documentElement.dataset.summitTransition;
      setDisplayed(location);
      return;
    }
    const opening = detailSlug(location.pathname);
    const closing = detailSlug(previous.pathname);
    const slug = opening || closing;
    const clickedCard = opening && document.querySelector(`[data-session="${CSS.escape(opening)}"][data-session-origin]`);
    if (clickedCard) cardJourneys.current.set(location.key, previous.key);
    const returningToCard = closing && cardJourneys.current.get(previous.key) === location.key;
    const forwardingFromCard = opening && cardJourneys.current.get(location.key) === previous.key;
    const profile = clickedCard || returningToCard || forwardingFromCard ? undefined : profilePath(location.pathname) || profilePath(previous.pathname);
    const root = document.documentElement;
    root.dataset.summitTransition = profile ? 'profile' : opening ? 'open' : closing ? 'close' : 'page';
    nameShared(slug, profile);
    const transition = document.startViewTransition(() => {
      if (token !== generation.current) return;
      flushSync(() => setDisplayed(location));
      nameShared(slug, profile);
      const returnedCard = !profile && closing && !opening && document.querySelector(`[data-session="${CSS.escape(closing)}"] .summit-session-link`);
      const returnedName = profile && document.querySelector('a[data-summit-shared="profile-title"]');
      (returnedName || returnedCard || document.getElementById('summit-main'))?.focus({ preventScroll: true });
    });
    active.current = transition;
    // Unsupported/duplicate snapshots must never interrupt navigation.
    transition.ready.catch(() => {});
    transition.finished.catch(() => {}).finally(() => {
      if (token !== generation.current) return;
      clearNames();
      clearOrigins();
      delete root.dataset.summitTransition;
      active.current = null;
    });
  }, [location]);

  useLayoutEffect(() => () => {
    generation.current += 1;
    active.current?.skipTransition();
    clearNames();
    clearOrigins();
    delete document.documentElement.dataset.summitTransition;
  }, []);
  return displayed;
}
