import { useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowDownRight, Building2, CalendarDays, Users } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation, useNavigationType } from 'react-router';
import { navigation, summitPath } from '../routing/paths.js';
import { agendaFocus, centerSession, sessionTiming } from '../lib/agenda.js';
import { sessions } from '../content/index.js';
import useConferenceClock from '../lib/useConferenceClock.js';
import SummitIdentity from './SummitIdentity.jsx';
import BackButton from './BackButton.jsx';
import '../styles/summit.css';

const icons = [CalendarDays, Users, Building2];
export default function SummitLayout() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map());
  const previousPath = useRef(location.pathname);
  const isAgenda = location.pathname.replace(/\/$/, '') === summitPath();
  const clock = useConferenceClock();
  const next = agendaFocus(sessions, clock);
  const nextLabel = next && sessionTiming(next, clock) === 'past' ? 'Last session' : next && sessionTiming(next, clock) === 'live' ? 'Now' : 'Up next';
  const goToNext = event => {
    if (!isAgenda || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const target = document.getElementById(`agenda-${next.id}`);
    centerSession(target);
    target?.querySelector('.summit-session-link')?.focus({ preventScroll: true });
  };
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
    const saved = navigationType === 'POP' && positions.current.get(location.key);
    let hash = location.hash.slice(1);
    try { hash = decodeURIComponent(hash); } catch { /* Invalid fragments simply fall back to the page. */ }
    const anchor = hash && document.getElementById(hash);
    if (saved !== false && saved !== undefined) window.scrollTo({ top: saved, behavior: 'instant' });
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
          {next && <Link className="summit-next-nav" to={`${summitPath()}#agenda-${next.id}`} onClick={goToNext}><span>{nextLabel}</span><ArrowDownRight size={18} aria-hidden="true" /></Link>}
        </nav>
      </div>
    </header>
    <SummitIdentity agenda={isAgenda} routeKey={location.key} />
    <main id="summit-main" className={`summit-container summit-main${isAgenda ? '' : ' summit-content-page'}`} tabIndex={-1}><div className="summit-route" key={location.pathname}><Outlet /></div></main>
    <footer className="summit-footer"><div className="summit-container"><span>Made with curiosity & AI.</span><span>By <Link to="/">Alex Russell</Link> · Not affiliated with techNL.</span></div></footer>
  </div>;
}
