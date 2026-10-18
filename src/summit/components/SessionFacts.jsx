import { Clock3, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import { allSpeakers, allCompanies } from '../content/index.js';
import { formatTime } from '../lib/agenda.js';
import { summitPath } from '../routing/paths.js';
import SpeakerIdentity from './SpeakerIdentity.jsx';

function ProfileNames({ items, type, empty }) {
  if (!items.length) return <span>{empty}</span>;
  return <span className="summit-fact-names">{items.map(item => <Link key={item.id} className="summit-profile-link" data-profile={`${type}/${item.slug}`} to={summitPath(`${type}/${item.slug}`)}>{item.name}</Link>)}</span>;
}

export default function SessionFacts({ session, compact = false, showTime = true }) {
  const presenters = allSpeakers.filter(speaker => session.speakerIds.includes(speaker.id));
  const companies = allCompanies.filter(company => session.companyIds.includes(company.id));
  const additionalCompanies = companies.filter(company => !presenters.some(speaker => speaker.companyIds.includes(company.id)));
  return <div className={`summit-session-facts${compact ? ' is-compact' : ''}`}>
    {showTime && <div data-shared="time"><Clock3 size={17} aria-hidden="true" /><span className="summit-sr-only">Time · Newfoundland: </span><span>{formatTime(session.startTime)} – {formatTime(session.endTime)}</span></div>}
    <div data-shared="place"><MapPin size={17} aria-hidden="true" /><span className="summit-sr-only">Location: </span><span>{session.location}</span></div>
    <div className="summit-presenters" data-shared="presenter"><span className={compact ? 'summit-sr-only' : 'summit-fact-label'}>{presenters.length === 1 ? 'Presenter' : 'Presenters'}</span>
      {presenters.length ? <ul className="summit-presenter-list">{presenters.map(speaker => <li key={speaker.id}><SpeakerIdentity speaker={speaker} compact={compact} /></li>)}</ul> : !compact && <span>To be announced</span>}
      {!!additionalCompanies.length && <div className={`summit-additional-companies${!presenters.length ? ' is-only-company' : ''}`}><span className="summit-fact-label">Organizations</span><ProfileNames items={additionalCompanies} type="companies" /></div>}
    </div>
  </div>;
}
