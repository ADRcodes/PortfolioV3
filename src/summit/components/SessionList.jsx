import { Link } from 'react-router';
import { allSpeakers } from '../content/index.js';
import { summitPath } from '../routing/paths.js';
import ContentLinks from './ContentLinks.jsx';

export const formatDay = date => new Intl.DateTimeFormat('en-CA', { dateStyle: 'full', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
export function SessionMeta({ session }) {
  return <p className="summit-meta"><time dateTime={session.date}>{formatDay(session.date)}</time> · <time>{session.startTime}</time>–<time>{session.endTime}</time> · {session.location} · Conference local time (America/St_Johns)</p>;
}
export default function SessionList({ sessions, empty = 'No sessions available yet.' }) {
  if (!sessions.length) return <p>{empty}</p>;
  return <ul className="summit-session-list">{sessions.map(session => (
    <li key={session.id}>
      <span className="summit-status">{session.status === 'published' ? 'Summary published' : 'Upcoming · Summary not available yet'}</span>
      <h3><Link to={summitPath(`sessions/${session.slug}`)}>{session.title}</Link></h3>
      <SessionMeta session={session} />
      <ContentLinks items={allSpeakers.filter(speaker => session.speakerIds.includes(speaker.id))} directory="speakers" empty="Speakers to be announced." />
    </li>
  ))}</ul>;
}
