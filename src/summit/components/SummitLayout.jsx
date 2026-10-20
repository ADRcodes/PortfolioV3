import { useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowDownRight, ArrowUpRight, Building2, CalendarDays, Users } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation, useNavigationType } from 'react-router';
import { navigation, summitPath } from '../routing/paths.js';
import { agendaNavigation, centerSession, sameSlot } from '../lib/agenda.js';
import { conferenceSessions as sessions } from '../content/index.js';
import useConferenceClock from '../lib/useConferenceClock.js';
import SummitIdentity from './SummitIdentity.jsx';
import BackButton from './BackButton.jsx';
import SummitQrShare from './SummitQrShare.jsx';
import '../styles/summit.css';
import '../styles/hierarchy.css';

const icons = [CalendarDays, Users, Building2];
export default function SummitLayout() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map());
  const previousPath = useRef(location.pathname);
  const previousLocation = useRef(location);
  const isAgenda = location.pathname.replace(/\/$/, '') === summitPath();
  const clock = useConferenceClock();
  const navigationState = agendaNavigation(sessions, clock);
  const options = navigationState.sessions;
  const multipleSlots = options.some(session => !sameSlot(session, options[0]));
  const targetId = multipleSlots ? 'agenda-current' : options.length > 1 ? `agenda-slot-${options[0].id}` : options[0] ? `agenda-${options[0].id}` : 'summit-recent-summaries';
  const hasNotes = sessions.some(session => session.status === 'published');
  const nextLabel = navigationState.state === 'current' ? 'Happening now' : navigationState.state === 'next' ? 'Up next' : 'Session notes';
  const goToNext = event => {
    if (!isAgenda || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(targetId);
    // Normal router navigation clears a filter that hides the real schedule target.
    if (!target || (new URLSearchParams(location.search).get('view') === 'notes' && options.some(session => session.status !== 'published'))) return;
    event.preventDefault();
    centerSession(target);
    (options.length === 1 ? target.querySelector('.summit-session-link') : target)?.focus({ preventScroll: true });
  };
  useLayoutEffect(() => {
    const nav = document.querySelector('.summit-primary-nav');
    const app = nav.closest('.summit-app');
    const measure = () => app.style.setProperty('--summit-nav-height', `${getComputedStyle(nav).position === 'fixed' ? nav.offsetHeight : 0}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    window.addEventListener('resize', measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, []);
  useEffect(() => {
    const previous = document.title;
    document.title = 'techNL Summit 2026 | Independent companion';
    return () => { document.title = previous; };
  }, []);
  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = previous; };
  }, []);
  useLayoutEffect(() => {
    const previous = previousLocation.current;
    previousLocation.current = location;
    const queryOnly = previous.pathname === location.pathname && previous.search !== location.search && (previous.hash === location.hash || !location.hash);
    const saved = navigationType === 'POP' && positions.current.get(location.key);
    let hash = location.hash.slice(1);
    try { hash = decodeURIComponent(hash); } catch { /* Invalid fragments simply fall back to the page. */ }
    const anchor = hash && document.getElementById(hash);
    if (queryOnly) { /* Searching and filtering retain the current reading position. */ }
    else if (saved !== false && saved !== undefined) window.scrollTo({ top: saved, behavior: 'instant' });
    else if (anchor && anchor.id.startsWith('agenda-')) centerSession(anchor, 'instant');
    else if (anchor) anchor.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
    if (previousPath.current !== location.pathname) {
      document.getElementById('summit-main')?.focus({ preventScroll: true });
      previousPath.current = location.pathname;
    }
    const remember = () => positions.current.set(location.key, window.scrollY);
    remember();
    window.addEventListener('scroll', remember, { passive: true });
    return () => window.removeEventListener('scroll', remember);
  }, [location.key, location.hash, isAgenda, navigationType]);
  return <div className={`summit-app${isAgenda ? ' summit-agenda-page' : ''}`} onClickCapture={event => {
    document.querySelectorAll('[data-profile-origin], [data-session-origin]').forEach(element => {
      element.removeAttribute('data-profile-origin');
      element.removeAttribute('data-session-origin');
    });
    const profile = event.target.closest('a[data-profile]');
    if (profile) profile.dataset.profileOrigin = 'true';
    const session = event.target.closest('.summit-session-link')?.closest('[data-session]');
    if (session) session.dataset.sessionOrigin = 'true';
  }}>
    <a className="summit-skip" href="#summit-main">Skip to content</a>
    <header className="summit-header">
      <div className="summit-container summit-header-inner">
        <div className="summit-header-identity">
          {!isAgenda && <BackButton fallback={summitPath()} />}
          <Link className="summit-brand" aria-label="techNL Summit 2026" to={summitPath()}><span data-brand-part="tech">techNL</span><span data-brand-part="summit">Summit</span><span data-brand-part="year" className="summit-brand-year">2026</span></Link>
        </div>
        <nav className="summit-primary-nav" aria-label="Conference navigation">
          {navigation.map((item, index) => { const Icon = icons[index]; return <NavLink key={item.path} to={summitPath(item.path)} end={item.path === ''}><Icon size={18} aria-hidden="true" /><span>{item.path === '' ? 'Agenda' : item.label}</span></NavLink>; })}
          {(options.length > 0 || hasNotes) && <Link className="summit-next-nav" data-agenda-navigation={navigationState.state} to={`${summitPath()}#${targetId}`} onClick={goToNext}><span>{nextLabel}</span><ArrowDownRight size={18} aria-hidden="true" /></Link>}
        </nav>
        <SummitQrShare />
      </div>
    </header>
    <SummitIdentity agenda={isAgenda} routeKey={location.key} />
    <main id="summit-main" className={`summit-container summit-main${isAgenda ? '' : ' summit-content-page'}`} tabIndex={-1}><div className="summit-route" key={location.pathname}><Outlet /></div></main>
    <footer className="summit-footer"><div className="summit-container summit-footer-inner">
      <div className="summit-footer-credit"><Link to="/">Alex Russell <ArrowUpRight size={20} aria-hidden="true" /></Link><p>Made with curiosity & AI.<br />An independent project, not affiliated with techNL.</p><a className="summit-official-event-link" href="https://technl.ca/technlsummit26/" target="_blank" rel="noreferrer">Visit the actual event website <ArrowUpRight size={16} aria-hidden="true" /><span className="summit-sr-only"> (opens in a new tab)</span></a></div>
      <div className="summit-footer-contact"><p>Something incorrect, or prefer to have your information removed? Send me a note.</p><a href="mailto:alexrussellria@gmail.com">alexrussellria@gmail.com <ArrowUpRight size={18} aria-hidden="true" /></a></div>
    </div></footer>
  </div>;
}
