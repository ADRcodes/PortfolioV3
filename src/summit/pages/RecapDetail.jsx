import { Fragment } from 'react';
import { Link, useParams } from 'react-router';
import { allSpeakers, conferenceSessions, recaps } from '../content/index.js';
import { DetailedSections, HighlightedInsight } from '../components/SessionSummary.jsx';
import SessionShare from '../components/SessionShare.jsx';
import ContentLinks from '../components/ContentLinks.jsx';
import { formatPublication } from '../lib/programme.js';
import { SITE_ORIGIN } from '../lib/social.js';
import { summitPath } from '../routing/paths.js';
import NotFound from './NotFound.jsx';
import '../styles/recaps.css';

export default function RecapDetail() {
  const { slug } = useParams();
  const recap = recaps.find(item => item.slug === slug);
  if (!recap) return <NotFound />;
  const related = conferenceSessions.filter(session => recap.relatedSessionSlugs.includes(session.slug));
  return <article className="summit-detail summit-recap" data-recap={recap.slug}>
    <div className="summit-detail-topbar"><Link to={`${summitPath()}#summit-insights`}>Back to Summit insights</Link><span>Cross-session recap</span></div>
    <header className="summit-detail-header">
      <h1>{recap.title}</h1>
      <p className="summit-intro">{recap.description}</p>
      <p className="summit-recap-dates">Published <time dateTime={recap.publishedAt}>{formatPublication(recap.publishedAt)}</time>{recap.updatedAt !== recap.publishedAt && <> · Updated <time dateTime={recap.updatedAt}>{formatPublication(recap.updatedAt)}</time></>} · Newfoundland time</p>
      <SessionShare key={recap.id} session={recap} kind="recap" url={`${SITE_ORIGIN}${summitPath(`recaps/${recap.slug}`)}`} />
    </header>
    <div className="summit-recap-body">
      <p className="summit-meta">Independent, AI-assisted editorial analysis across Summit sessions. Interpretations are the author’s; check the linked session notes for context.</p>
      <HighlightedInsight insight={recap.highlightedInsight} />
      {recap.sections.map((section, index) => <Fragment key={index}>
        <DetailedSections sections={[section]} level={2} />
        {!!section.sessionSlugs?.length && <nav className="summit-recap-section-links" aria-label={`Session notes supporting ${section.heading}`}><ul>{section.sessionSlugs.map(slug => <li key={slug}><Link to={summitPath(`sessions/${slug}`)}>{related.find(session => session.slug === slug).title}</Link></li>)}</ul></nav>}
      </Fragment>)}
      <nav className="summit-recap-related" aria-labelledby="recap-related-title"><h2 id="recap-related-title">Explore the supporting sessions</h2><ul>{related.map(session => <li key={session.id}><Link to={summitPath(`sessions/${session.slug}`)}>{session.title}</Link></li>)}</ul></nav>
      {!!recap.speakerIds.length && <section className="summit-recap-related"><h2>Related speakers</h2><ContentLinks items={allSpeakers.filter(speaker => recap.speakerIds.includes(speaker.id))} directory="speakers" /></section>}
      <Link className="summit-recap-return" to={`${summitPath()}#summit-insights`}>Return to Summit insights</Link>
    </div>
  </article>;
}
