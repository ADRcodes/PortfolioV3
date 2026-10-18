import { ArrowDown, ArrowUp, ArrowUpRight, Linkedin } from 'lucide-react';
import { sessions } from '../content/index.js';
import { Link } from 'react-router';
import SessionSlot from '../components/SessionSlot.jsx';
import AgendaBrowser from '../components/AgendaBrowser.jsx';
import { agendaFocus, centerSession, groupSessions } from '../lib/agenda.js';
import useConferenceClock from '../lib/useConferenceClock.js';
import { formatDay } from '../components/SessionList.jsx';

export default function SummitHome() {
  const clock = useConferenceClock();
  const focus = agendaFocus(sessions, clock);
  const days = [...new Set(sessions.map(session => session.date))];
  const jumpTo = (id) => {
    const element = document.getElementById(`agenda-${id}`);
    centerSession(element);
    element?.querySelector('.summit-session-link')?.focus({ preventScroll: true });
  };
  return <div className="summit-agenda-layout">
    <header className="summit-agenda-intro" id="summit-welcome">
      <h1 className="summit-intro-brand" aria-label="techNL Summit 2026"><span className="summit-brand-line" aria-hidden="true"><span data-brand-part="tech">techNL</span></span><span className="summit-brand-line summit-accent-type" aria-hidden="true"><span data-brand-part="summit">Summit</span> <span data-brand-part="year">2026</span></span></h1>
      <div className="summit-personal-note">
        <div><p>In hopes of helping people get the most out of this event,<br />I made this site.</p><p className="summit-note-directions"><span>Find out what’s next.</span><span>Come back for the notes.</span></p><div className="summit-note-signature"><Link to="/">- Alex Russell</Link><a href="https://www.linkedin.com/in/alex-russell-info" target="_blank" rel="noreferrer" aria-label="Alex Russell on LinkedIn (opens in a new tab)"><Linkedin size={21} aria-hidden="true" /></a></div><p className="summit-note-small">An independent project, not affiliated with techNL. And, fittingly, built with AI.</p></div>
      </div>
      <div className="summit-intro-bottom">
        {sessions.length > 0 && <button className="summit-explore-agenda" aria-label="Explore the agenda" onClick={() => jumpTo(sessions[0].id)}><ArrowDown size={24} aria-hidden="true" /></button>}
        <a href="https://technl.ca/technlsummit26/" target="_blank" rel="noreferrer">Official event <ArrowUpRight size={16} aria-hidden="true" /><span className="summit-sr-only"> (new tab)</span></a>
      </div>
    </header>
    <div className="summit-agenda-feed">
      <AgendaBrowser sessions={sessions} />
      {!sessions.length && <p className="summit-empty">The schedule is on its way. Check back here for sessions and notes.</p>}
      {days.map(day => <section className="summit-agenda-day" key={day} aria-label={formatDay(day)}>
        <h2 className="summit-date-heading"><span>{formatDay(day)}</span></h2>
        <ol className="summit-timeline">
          {groupSessions(sessions.filter(session => session.date === day)).map(slot => <SessionSlot key={slot[0].id} sessions={slot} clock={clock} focus={focus} />)}
        </ol>
      </section>)}
      {sessions.length > 0 && <div className="summit-agenda-end"><p>More to come.</p><span>Notes appear as they’re published.</span><button onClick={() => document.getElementById('summit-welcome')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })}><ArrowUp size={15} aria-hidden="true" /> Back to the welcome</button></div>}
    </div>
  </div>;
}
