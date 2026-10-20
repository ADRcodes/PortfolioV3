import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { allSpeakers } from '../content/index.js';
import { formatPublication, recentSummaries } from '../lib/programme.js';
import { descriptionPreview } from '../lib/preview.js';
import { summitPath } from '../routing/paths.js';

export default function RecentSummaries({ sessions }) {
  const recent = recentSummaries(sessions);
  if (!recent.length) return <section className="summit-recent-summaries summit-notes-coming-soon" id="summit-recent-summaries" tabIndex={-1} data-summary-state="coming-soon" aria-labelledby="summit-recent-title">
    <h2 id="summit-recent-title">Session notes coming soon</h2>
    <p className="summit-notes-coming-soon-copy">As presentations finish, AI-assisted summaries will appear here. Check back to explore what was discussed.</p>
  </section>;
  return <section className="summit-recent-summaries" data-summary-state="published" aria-labelledby="summit-recent-title" id="summit-recent-summaries" tabIndex={-1}>
    <div className="summit-section-heading"><h2 id="summit-recent-title">Latest conference notes</h2><Link to={`${summitPath()}?view=notes#summit-agenda-start`}>All published notes <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
    <ol className="summit-recent-list">{recent.map((session, index) => <li className="summit-recent-item" key={session.id}>
      {index === 0 && <p className="summit-feature-label">Latest dispatch</p>}
      <h3><Link to={summitPath(`sessions/${session.slug}`)}>{session.title}</Link></h3>
      {!!session.speakerIds.length && <p className="summit-recent-speakers">{allSpeakers.filter(speaker => session.speakerIds.includes(speaker.id)).map(speaker => speaker.name).join(', ')}</p>}
      <p className="summit-recent-date">Updated <time dateTime={session.updatedAt}>{formatPublication(session.updatedAt)}</time></p>
      <p className="summit-recent-excerpt">{descriptionPreview(session.summary.overview, 210)}</p>
      <Link className="summit-recent-link" to={summitPath(`sessions/${session.slug}`)}>Read notes<span className="summit-sr-only">: {session.title}</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
    </li>)}</ol>
  </section>;
}
