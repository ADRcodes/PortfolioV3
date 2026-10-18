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

function nameShared(slug, profile, mobilePhase) {
  clearNames();
  const assign = (element, name) => {
    if (!element) return;
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
    surface?.querySelectorAll('[data-shared]').forEach(element => {
      const name = element.dataset.shared;
      // Phone titles share geometry while their captured line breaks stay fixed.
      // Metadata snapshots also keep their measured geometry and fade in sequence.
      if (!mobilePhase || name === 'surface') assign(element, name);
      else if (name === 'title') assign(element, 'title');
      else if (name === 'summary') assign(element, 'summary');
      else assign(element, `${name}-${mobilePhase}`);
    });
    if (mobilePhase) assign(surface?.querySelector('.summit-card-top, .summit-detail-topbar'), `labels-${mobilePhase}`);
    const railTime = surface?.closest('.summit-timeline > li')?.querySelector('.summit-time-marker [data-shared="time"]');
    if (railTime && !mobilePhase) assign(railTime, 'time');
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
      delete document.documentElement.dataset.summitMobileSession;
      setDisplayed(location);
      return;
    }
    const opening = detailSlug(location.pathname);
    const closing = detailSlug(previous.pathname);
    const slug = opening || closing;
    const clickedCard = opening && document.querySelector(`[data-session="${CSS.escape(opening)}"][data-session-origin]`);
    const phone = window.matchMedia('(max-width: 40rem)').matches;
    if (clickedCard) cardJourneys.current.set(location.key, { key: previous.key, path: previous.pathname, y: window.scrollY });
    const returnJourney = closing && cardJourneys.current.get(previous.key);
    const returningToCard = returnJourney && (returnJourney.key === location.key || (phone && returnJourney.path === location.pathname && !location.hash));
    const forwardingFromCard = opening && cardJourneys.current.get(location.key)?.key === previous.key;
    const profile = clickedCard || returningToCard || forwardingFromCard ? undefined : profilePath(location.pathname) || profilePath(previous.pathname);
    const root = document.documentElement;
    const mobileSession = !profile && Boolean(clickedCard || returningToCard || forwardingFromCard) && phone;
    if (mobileSession) root.dataset.summitMobileSession = 'true';
    else delete root.dataset.summitMobileSession;
    root.dataset.summitTransition = profile ? 'profile' : opening ? 'open' : closing ? 'close' : 'page';
    nameShared(slug, profile, mobileSession ? 'out' : undefined);
    const transition = document.startViewTransition(() => {
      if (token !== generation.current) return;
      flushSync(() => setDisplayed(location));
      if (mobileSession) {
        // The Agenda link creates a fresh entry, unlike Back. Return that entry
        // to the originating card too, without changing desktop navigation.
        if (returningToCard && returnJourney.key !== location.key) window.scrollTo({ top: returnJourney.y, behavior: 'instant' });
        // Layout scroll restoration has completed. Resolve scroll-driven chrome
        // before the new snapshot, rather than one animation frame after it.
        flushSync(() => window.dispatchEvent(new Event('summit:transition-capture')));
      }
      nameShared(slug, profile, mobileSession ? 'in' : undefined);
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
      delete root.dataset.summitMobileSession;
      active.current = null;
    });
  }, [location]);

  useLayoutEffect(() => () => {
    generation.current += 1;
    active.current?.skipTransition();
    clearNames();
    clearOrigins();
    delete document.documentElement.dataset.summitTransition;
    delete document.documentElement.dataset.summitMobileSession;
  }, []);
  return displayed;
}
