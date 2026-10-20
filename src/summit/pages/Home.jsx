import { ArrowDown, ArrowUp, Linkedin } from 'lucide-react';
import { conferenceSessions as sessions } from '../content/index.js';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import RecentSummaries from '../components/RecentSummaries.jsx';
import { filterAgenda } from '../lib/programme.js';
import SessionSlot from '../components/SessionSlot.jsx';
import AgendaBrowser from '../components/AgendaBrowser.jsx';
import { groupSessions } from '../lib/agenda.js';
import { preferAttendedSessions } from '../lib/attendance.js';
import { formatDay } from '../components/SessionList.jsx';

export default function SummitHome() {
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
  const days = [...new Set(visible.map(session => session.date))];
  return <div className="summit-agenda-layout">
    <header className="summit-agenda-intro" id="summit-welcome">
      <h1 className="summit-intro-brand" aria-label="techNL Summit 2026"><span className="summit-brand-line" aria-hidden="true"><span data-brand-part="tech">techNL</span></span><span className="summit-brand-line summit-accent-type" aria-hidden="true"><span data-brand-part="summit">Summit</span> <span data-brand-part="year">2026</span></span></h1>
      <div className="summit-intro-event">
        <p className="summit-event-details"><span className="summit-event-date"><time dateTime="2026-10-19">October 19</time>–<time dateTime="2026-10-20">20, 2026</time></span><span className="summit-event-location">St. John’s Convention Centre</span></p>
      </div>
      <div className="summit-intro-content">
        <div className="summit-personal-note">
          <p>I built this little companion to help us revisit the ideas from techNL Summit 2026.</p>
          <p className="summit-note-directions">Explore the sessions, discover speaker perspectives<br />and catch up on AI-assisted notes.</p>
          {sessions.length > 0 && <button className="summit-explore-agenda" onClick={() => {
            const target = document.getElementById('summit-insights');
            target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
            target?.focus({ preventScroll: true });
          }}><span>Explore insights</span><ArrowDown size={22} aria-hidden="true" /></button>}
          <div className="summit-note-signature"><Link to="/">— Alex Russell</Link><a href="https://www.linkedin.com/in/alex-russell-info" target="_blank" rel="noreferrer" aria-label="Alex Russell on LinkedIn (opens in a new tab)"><Linkedin size={19} aria-hidden="true" /></a></div>
          <p className="summit-note-small">An independent project, not affiliated with techNL.<br />And, fittingly, built with AI.</p>
        </div>
      </div>
    </header>
    <div className="summit-agenda-feed">
      <RecentSummaries sessions={sessions} />
      <div className="summit-agenda-heading"><h2>Complete session archive</h2><p>All times Newfoundland</p></div>
      <div id="summit-agenda-start" tabIndex={-1} className="summit-agenda-filters" role="group" aria-label="Filter agenda">{[['all', 'All sessions'], ['notes', 'Notes available']].map(([value, label]) => <button type="button" key={value} data-agenda-filter={value} aria-pressed={(hiddenAnchor ? 'all' : filter) === value} onClick={() => setParams(previous => { const next = new URLSearchParams(previous); value === 'notes' ? next.set('view', value) : next.delete('view'); return next; }, { replace: true })}>{label}</button>)}</div>
      <p className={`summit-filter-status${filter === 'notes' && !hiddenAnchor ? '' : ' summit-sr-only'}`} role="status">{filter === 'notes' && !hiddenAnchor ? `${visible.length} conference summaries available.` : ''}</p>
      <AgendaBrowser sessions={groupSessions(visible).flatMap(slot => preferAttendedSessions(slot))} />
      {!visible.length && sessions.length > 0 && <p className="summit-empty">No conference notes published yet. Choose All sessions to explore the schedule.</p>}
      {!sessions.length && <p className="summit-empty">No sessions available.</p>}
      {days.map(day => <section className="summit-agenda-day" key={day} aria-label={formatDay(day)}>
        <h2 className="summit-date-heading"><span>{formatDay(day)}</span></h2>
        <ol className="summit-timeline">
          {groupSessions(visible.filter(session => session.date === day)).map(slot => <SessionSlot key={slot[0].id} sessions={preferAttendedSessions(slot)} slotId={slot[0].id} />)}
        </ol>
      </section>)}
      {sessions.length > 0 && <div className="summit-agenda-end"><p>More to come.</p><span>Notes appear as they’re published.</span><button onClick={() => document.getElementById('summit-welcome')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })}><ArrowUp size={15} aria-hidden="true" /> Back to the welcome</button></div>}
    </div>
  </div>;
}
