import { Link } from 'react-router';
import { allSpeakers } from '../content/index.js';
import { formatPublication, recentSummaries } from '../lib/programme.js';
import { summitPath } from '../routing/paths.js';

export default function RecentSummaries({ sessions }) {
  const recent = recentSummaries(sessions);
  if (!recent.length) return <section className="summit-recent-summaries summit-notes-coming-soon" id="summit-recent-summaries" data-summary-state="coming-soon" aria-labelledby="summit-recent-title">
    <h2 id="summit-recent-title">Session notes coming soon</h2>
    <p className="summit-notes-coming-soon-copy">As presentations finish, AI-assisted summaries will appear here. Check back to explore what was discussed.</p>
  </section>;
  return <section className="summit-recent-summaries" data-summary-state="published" aria-labelledby="summit-recent-title" id="summit-recent-summaries">
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
