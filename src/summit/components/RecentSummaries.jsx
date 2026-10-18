import { Link } from 'react-router';
import { allSpeakers } from '../content/index.js';
import { formatPublication, recentSummaries } from '../lib/programme.js';
import { summitPath } from '../routing/paths.js';

export default function RecentSummaries({ sessions }) {
  const recent = recentSummaries(sessions);
  if (!recent.length) return null;
  return <section className="summit-recent-summaries" aria-labelledby="summit-recent-title" id="summit-recent-summaries">
    <h2 id="summit-recent-title">Latest conference notes</h2>
    <ol className="summit-recent-list">{recent.map(session => <li className="summit-recent-item" key={session.id}>
      <h3><Link to={summitPath(`sessions/${session.slug}`)}>{session.title}</Link></h3>
      {!!session.speakerIds.length && <p className="summit-recent-speakers">{allSpeakers.filter(speaker => session.speakerIds.includes(speaker.id)).map(speaker => speaker.name).join(', ')}</p>}
      <p className="summit-recent-date">Updated <time dateTime={session.updatedAt}>{formatPublication(session.updatedAt)}</time> · Newfoundland time</p>
      <p className="summit-recent-excerpt">{session.summary.overview}</p>
      <Link className="summit-recent-link" to={summitPath(`sessions/${session.slug}`)}>Read complete notes<span className="summit-sr-only">: {session.title}</span></Link>
    </li>)}</ol>
  </section>;
}
