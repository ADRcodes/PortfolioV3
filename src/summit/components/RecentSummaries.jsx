import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { allSpeakers } from '../content/index.js';
import { formatPublication, recentSummaries } from '../lib/programme.js';
import { descriptionPreview } from '../lib/preview.js';
import { summitPath } from '../routing/paths.js';

export default function RecentSummaries({ sessions }) {
  const recent = recentSummaries(sessions);
  const speakers = allSpeakers.filter(speaker => !speaker.demo && speaker.summitPerspectives?.some(perspective => sessions.some(session => session.programme === 'conference' && session.status === 'published' && session.slug === perspective.sessionSlug)));
  return <section className="summit-recent-summaries summit-insights" data-summary-state={recent.length ? 'published' : 'coming-soon'} aria-labelledby="summit-recent-title" id="summit-insights" tabIndex={-1}>
    <span id="summit-recent-summaries" aria-hidden="true" />
    <div className="summit-section-heading"><h2 id="summit-recent-title">Explore the insights</h2><Link to={`${summitPath()}?view=notes#summit-agenda-start`}>Read published session notes <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
    <p>Revisit the discussions and the ideas worth carrying forward. I’m continuing to add AI-assisted summaries as I work through the sessions.</p>
    {!!speakers.length && <div className="summit-insight-perspectives"><h3>Speaker perspectives</h3><p>Ideas in the speakers’ own words, alongside attributed insights from their sessions.</p><ul>{speakers.slice(0, 3).map(speaker => <li key={speaker.id}><Link to={summitPath(`speakers/${speaker.slug}`)}>{speaker.name}<ArrowUpRight size={17} aria-hidden="true" /></Link></li>)}</ul><Link to={summitPath('speakers')}>Explore all speakers</Link></div>}
    <Link className="summit-insights-archive" to={`${summitPath()}#summit-agenda-start`}>Browse the complete session archive <ArrowUpRight size={17} aria-hidden="true" /></Link>
    {!recent.length && <p>Session notes are still being prepared. Explore the archive in the meantime.</p>}
    {!!recent.length && <details className="summit-insights-recent"><summary>Recently published notes</summary>
    <ol className="summit-recent-list">{recent.map(session => <li className="summit-recent-item" key={session.id}>
      <h3><Link to={summitPath(`sessions/${session.slug}`)}>{session.title}</Link></h3>
      {!!session.speakerIds.length && <p className="summit-recent-speakers">{allSpeakers.filter(speaker => session.speakerIds.includes(speaker.id)).map(speaker => speaker.name).join(', ')}</p>}
      <p className="summit-recent-date">Updated <time dateTime={session.updatedAt}>{formatPublication(session.updatedAt)}</time></p>
      <p className="summit-recent-excerpt">{descriptionPreview(session.summary.overview, 210)}</p>
      <Link className="summit-recent-link" to={summitPath(`sessions/${session.slug}`)}>Read notes<span className="summit-sr-only">: {session.title}</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
    </li>)}</ol></details>}
  </section>;
}
