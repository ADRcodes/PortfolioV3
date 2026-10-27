import RecapFeatures from './RecapFeatures.jsx';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { allSpeakers } from '../content/index.js';
import { getSpeakerPerspectives } from '../content/perspectives.js';
import { recentSummaries } from '../lib/programme.js';
import { summitPath } from '../routing/paths.js';

export default function RecentSummaries({ sessions }) {
  const recent = recentSummaries(sessions);
  const official = sessions.filter(session => session.programme === 'conference');
  const speakers = allSpeakers.filter(speaker => !speaker.demo).map(speaker => ({ speaker, perspective: getSpeakerPerspectives(speaker, official)[0] })).filter(item => item.perspective);
  return <section className="summit-recent-summaries summit-insights" data-summary-state={recent.length ? 'published' : 'coming-soon'} aria-labelledby="summit-recent-title" id="summit-insights" tabIndex={-1}>
    <span id="summit-recent-summaries" aria-hidden="true" />
    <div className="summit-insights-intro">
      <h2 id="summit-recent-title">Explore the insights</h2>
      <p>Cross-session analysis connecting the Summit’s ideas, tensions and practical lessons.</p>
    </div>
    <RecapFeatures />
    {!!speakers.length && <div className="summit-insight-perspectives">
      <div className="summit-insight-perspectives-intro">
        <h3>Speaker perspectives</h3><p>Session ideas, with context and attribution.</p>
        <Link className="summit-insights-all-speakers" to={summitPath('speakers')}>Explore all speakers <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </div>
      <ul>{speakers.slice(0, 3).map(({ speaker, perspective }) => <li key={speaker.id}><Link to={summitPath(`speakers/${speaker.slug}`)}><span><span className="summit-insight-speaker-name">{speaker.name}</span>{perspective.heading && <span className="summit-insight-preview">{perspective.heading}</span>}</span><ArrowUpRight size={18} aria-hidden="true" /></Link></li>)}</ul>
    </div>}
  </section>;
}
