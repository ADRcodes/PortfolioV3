import { Fragment } from 'react';
import { Link, useParams } from 'react-router';
import { allSpeakers, conferenceSessions, recaps } from '../content/index.js';
import { DetailedSections, HighlightedInsight } from '../components/SessionSummary.jsx';
import SessionShare from '../components/SessionShare.jsx';
import ContentLinks from '../components/ContentLinks.jsx';
import { SITE_ORIGIN } from '../lib/social.js';
import { summitPath } from '../routing/paths.js';
import NotFound from './NotFound.jsx';
import '../styles/recaps.css';

const articleDate = new Intl.DateTimeFormat('en-CA', { dateStyle: 'long', timeZone: 'America/St_Johns' });

// Speaker references are editorially selected, validated content, not automatic name matching.
// Text stays escaped React content; only these explicit first mentions become profile links.
function linkedParagraph(paragraph, links) {
  if (!links?.length) return paragraph;
  const sorted = links.map(link => ({ ...link, start: paragraph.indexOf(link.text) })).sort((a, b) => a.start - b.start);
  const parts = [];
  let cursor = 0;
  for (const link of sorted) {
    parts.push(paragraph.slice(cursor, link.start));
    const speaker = allSpeakers.find(item => item.id === link.speakerId);
    parts.push(<Link key={link.speakerId} className="summit-recap-speaker-link" to={summitPath(`speakers/${speaker.slug}`)}>{link.text}</Link>);
    cursor = link.start + link.text.length;
  }
  parts.push(paragraph.slice(cursor));
  return parts;
}

export default function RecapDetail() {
  const { slug } = useParams();
  const recap = recaps.find(item => item.slug === slug);
  if (!recap) return <NotFound />;
  const related = conferenceSessions.filter(session => recap.relatedSessionSlugs.includes(session.slug));
  return <article className="summit-detail summit-recap" data-recap={recap.slug}>
    <div className="summit-detail-topbar"><Link to={`${summitPath()}#summit-insights`}>Back to Summit insights</Link></div>
    <header className="summit-detail-header">
      <p className="summit-recap-eyebrow">Summit 2026 / Analysis</p>
      <h1>{recap.title}</h1>
      <p className="summit-intro">{recap.description}</p>
      <div className="summit-recap-meta-row">
        <p className="summit-recap-dates">Published <time dateTime={recap.publishedAt}>{articleDate.format(new Date(recap.publishedAt))}</time></p>
        <SessionShare key={recap.id} session={recap} kind="recap" compact url={`${SITE_ORIGIN}${summitPath(`recaps/${recap.slug}`)}`} />
      </div>
    </header>
    <div className="summit-recap-body">
      {recap.sections.map((section, index) => <Fragment key={index}>
        <DetailedSections sections={[section]} level={2} renderParagraph={(paragraph, paragraphIndex) => linkedParagraph(paragraph, section.speakerLinks?.filter(link => link.paragraphIndex === paragraphIndex))} />
        <HighlightedInsight insight={section.highlightedInsight ?? (index === 0 ? recap.highlightedInsight : null)} />
        {!!section.sessionSlugs?.length && <nav className="summit-recap-section-links" aria-label={`Session notes supporting ${section.heading}`}><ul>{section.sessionSlugs.map(slug => <li key={slug}><Link to={summitPath(`sessions/${slug}`)}>{related.find(session => session.slug === slug).title}</Link></li>)}</ul></nav>}
      </Fragment>)}
      <nav className="summit-recap-related" aria-labelledby="recap-related-title"><h2 id="recap-related-title">Explore the supporting sessions</h2><ul>{related.map(session => <li key={session.id}><Link to={summitPath(`sessions/${session.slug}`)}>{session.title}</Link></li>)}</ul></nav>
      {!!recap.speakerIds.length && <section className="summit-recap-related"><h2>Related speakers</h2><ContentLinks items={allSpeakers.filter(speaker => recap.speakerIds.includes(speaker.id))} directory="speakers" /></section>}
      <footer className="summit-recap-editorial" aria-label="About this article">
        <h2>About this article</h2>
        <p>Independent, AI-assisted editorial analysis across techNL Summit 2026 sessions. Interpretations are the author's; consult the linked session notes for context. This is not an official techNL publication.</p>
        {recap.updatedAt !== recap.publishedAt && <p className="summit-recap-updated">Last updated <time dateTime={recap.updatedAt}>{articleDate.format(new Date(recap.updatedAt))}</time>.</p>}
      </footer>
      <Link className="summit-recap-return" to={`${summitPath()}#summit-insights`}>Return to Summit insights</Link>
    </div>
  </article>;
}
