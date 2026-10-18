import { ArrowDown, ArrowUp, ArrowUpRight, Linkedin } from 'lucide-react';
import { conferenceSessions as sessions } from '../content/index.js';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import RecentSummaries from '../components/RecentSummaries.jsx';
import { filterAgenda } from '../lib/programme.js';
import SessionSlot from '../components/SessionSlot.jsx';
import AgendaBrowser from '../components/AgendaBrowser.jsx';
import { agendaFocus, agendaNavigation, centerSession, groupSessions, sameSlot } from '../lib/agenda.js';
import useConferenceClock from '../lib/useConferenceClock.js';
import { summitPath } from '../routing/paths.js';
import { formatDay } from '../components/SessionList.jsx';

export default function SummitHome() {
  const clock = useConferenceClock();
  const focus = agendaFocus(sessions, clock);
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const filter = params.get('view') === 'notes' ? 'notes' : 'all';
  // An anchored official session always stays reachable, even from a notes-only view.
  const hiddenAnchor = filter === 'notes' && sessions.some(session => location.hash === `#agenda-${session.id}` && session.status !== 'published');
  const visible = filterAgenda(sessions, hiddenAnchor ? 'all' : filter);
  useEffect(() => {
    if (hiddenAnchor) { const next = new URLSearchParams(params); next.delete('view'); navigate({ pathname: location.pathname, search: next.toString(), hash: location.hash }, { replace: true }); }
  }, [hiddenAnchor, navigate, params, location.pathname, location.hash]);
  const navigation = agendaNavigation(sessions, clock);
  const multipleSlots = navigation.state === 'current' && navigation.sessions.some(session => !sameSlot(session, navigation.sessions[0]));
  const days = [...new Set(visible.map(session => session.date))];
  const jumpTo = (id) => {
    const element = document.getElementById(`agenda-${id}`);
    centerSession(element);
    element?.querySelector('.summit-session-link')?.focus({ preventScroll: true });
  };
  return <div className="summit-agenda-layout">
    <header className="summit-agenda-intro" id="summit-welcome">
      <h1 className="summit-intro-brand" aria-label="techNL Summit 2026"><span className="summit-brand-line" aria-hidden="true"><span data-brand-part="tech">techNL</span></span><span className="summit-brand-line summit-accent-type" aria-hidden="true"><span data-brand-part="summit">Summit</span> <span data-brand-part="year">2026</span></span></h1>
      <div className="summit-intro-event">
        <p className="summit-event-details"><span className="summit-event-date"><time dateTime="2026-10-19">October 19</time>–<time dateTime="2026-10-20">20, 2026</time></span><span className="summit-event-location">St. John’s Convention Centre</span></p>
      </div>
      <div className="summit-personal-note">
        <div><p>I built this little companion to help us get more out of the Summit.</p><p className="summit-note-directions"><span>Find your next session.</span><span>Come back for the notes.</span></p><div className="summit-note-signature"><Link to="/">- Alex Russell</Link><a href="https://www.linkedin.com/in/alex-russell-info" target="_blank" rel="noreferrer" aria-label="Alex Russell on LinkedIn (opens in a new tab)"><Linkedin size={21} aria-hidden="true" /></a></div><p className="summit-note-small">An independent project, not affiliated with techNL. And, fittingly, built with AI.</p><a className="summit-official-event-link" href="https://technl.ca/technlsummit26/" target="_blank" rel="noreferrer">Visit the official event website <ArrowUpRight size={18} aria-hidden="true" /><span className="summit-sr-only"> (opens in a new tab)</span></a></div>
      </div>
      <div className="summit-intro-bottom">
        {sessions.length > 0 && <button className="summit-explore-agenda" aria-label="Scroll to see agenda" onClick={() => document.getElementById('summit-agenda-start')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}><span>Scroll to see agenda</span><ArrowDown size={24} aria-hidden="true" /></button>}
      </div>
    </header>
    <div className="summit-agenda-feed">
      <RecentSummaries sessions={sessions} />
      {multipleSlots && <section className="summit-current-options" id="agenda-current" tabIndex={-1} aria-labelledby="summit-current-title"><h2 id="summit-current-title">Happening now</h2><ul>{navigation.sessions.map(session => <li key={session.id}><Link to={`${summitPath()}#agenda-${session.id}`} onClick={event => { if (document.getElementById(`agenda-${session.id}`)) { event.preventDefault(); jumpTo(session.id); } }}>{session.title}</Link></li>)}</ul></section>}
      <div id="summit-agenda-start" className="summit-agenda-filters" role="group" aria-label="Filter agenda">{[['all', 'All sessions'], ['notes', 'Notes available']].map(([value, label]) => <button type="button" key={value} data-agenda-filter={value} aria-pressed={(hiddenAnchor ? 'all' : filter) === value} onClick={() => setParams(previous => { const next = new URLSearchParams(previous); value === 'notes' ? next.set('view', value) : next.delete('view'); return next; }, { replace: true })}>{label}</button>)}</div>
      <p className={`summit-filter-status${filter === 'notes' && !hiddenAnchor ? '' : ' summit-sr-only'}`} role="status">{filter === 'notes' && !hiddenAnchor ? `${visible.length} conference summaries available.` : ''}</p>
      <AgendaBrowser sessions={visible} />
      {!visible.length && sessions.length > 0 && <p className="summit-empty">No conference notes published yet. Choose All sessions to explore the schedule.</p>}
      {!sessions.length && <p className="summit-empty">The schedule is on its way. Check back here for sessions and notes.</p>}
      {days.map(day => <section className="summit-agenda-day" key={day} aria-label={formatDay(day)}>
        <h2 className="summit-date-heading"><span>{formatDay(day)}</span></h2>
        <ol className="summit-timeline">
          {groupSessions(visible.filter(session => session.date === day)).map(slot => <SessionSlot key={slot[0].id} sessions={slot} clock={clock} focus={focus} />)}
        </ol>
      </section>)}
      {sessions.length > 0 && <div className="summit-agenda-end"><p>More to come.</p><span>Notes appear as they’re published.</span><button onClick={() => document.getElementById('summit-welcome')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })}><ArrowUp size={15} aria-hidden="true" /> Back to the welcome</button></div>}
    </div>
  </div>;
}
