import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { summitPath } from '../routing/paths.js';
import { shortDay } from '../lib/agenda.js';
import { publicationLabel } from '../lib/programme.js';
import SessionFacts from './SessionFacts.jsx';

export default function SessionCard({ session, agenda = false }) {
  return <article className="summit-session-card" data-session={session.slug} data-event-type={session.eventType} data-programme={session.programme} data-publication-status={session.status}>
    <span className="summit-session-surface" data-shared="surface" aria-hidden="true" />
    <div className="summit-card-top">
      <span className="summit-timing">{session.programme === 'external' ? 'Editorial article' : 'Conference archive'}</span>
      <span className="summit-card-publication">{publicationLabel(session)}{agenda && <ArrowUpRight size={18} aria-hidden="true" />}</span>
    </div>
    <h3 data-shared="title"><Link className="summit-session-link" to={summitPath(`sessions/${session.slug}`)}>{session.title}</Link></h3>
    {!agenda && <time className="summit-card-date" dateTime={session.date}>{shortDay(session.date)}, {session.date.slice(0, 4)}</time>}
    <SessionFacts session={session} compact showTime={!agenda} />
    {!agenda && <div className="summit-card-bottom" aria-hidden="true">
      <span className="summit-card-action">{session.status === 'published' ? 'Read session' : 'View session'}<ArrowUpRight size={18} aria-hidden="true" /></span>
    </div>}
  </article>;
}
