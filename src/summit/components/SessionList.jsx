import { Clock3, MapPin } from 'lucide-react';
import SessionCard from './SessionCard.jsx';
import { formatTime } from '../lib/agenda.js';

export const formatDay = date => new Intl.DateTimeFormat('en-CA', { dateStyle: 'full', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
export function SessionMeta({ session }) {
  return <div className="summit-session-meta"><time dateTime={session.date}>{formatDay(session.date)}</time>{session.startTime && session.endTime && <span><Clock3 size={16} aria-hidden="true" />{formatTime(session.startTime)} – {formatTime(session.endTime)}<small>Newfoundland time</small></span>}{session.location && <span><MapPin size={16} aria-hidden="true" />{session.location}</span>}</div>;
}
export default function SessionList({ sessions, empty = 'No sessions available yet.' }) {
  if (!sessions.length) return <p className="summit-empty">{empty}</p>;
  return <ul className="summit-session-list">{sessions.map(session => <li key={session.id}><SessionCard session={session} /></li>)}</ul>;
}
