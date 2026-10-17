import { allSpeakers } from '../content/index.js';
import ContentLinks from './ContentLinks.jsx';

function TextList({ items }) {
  return <ul className="summit-bullets">{items.map((item, index) => <li key={index}>{item}</li>)}</ul>;
}

function HighlightedInsight({ insight }) {
  if (!insight) return null;
  return <aside className="summit-highlighted-insight" aria-label="Highlighted insight">
    <p className="summit-insight-label">Highlighted insight</p>
    {insight.heading && <p className="summit-insight-heading">{insight.heading}</p>}
    <p>{insight.explanation}</p>
  </aside>;
}

function DetailedSections({ sections, level = 3 }) {
  const Heading = `h${level}`;
  return sections.map((section, index) => <section key={index} className="summit-article-section">
    <Heading>{section.heading}</Heading>
    {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    {!!section.bullets?.length && <TextList items={section.bullets} />}
  </section>);
}

export default function SessionSummary({ summary, idPrefix = 'session' }) {
  const presentations = summary.presentations ?? [];
  const presentationId = index => `${idPrefix}-presentation-${index + 1}`;
  return (
    <div className="summit-article-body">
      <section>
        <h2>Quick overview</h2>
        <p className="summit-meta">Independent, AI-assisted summary. Notes may contain errors; check the source when available.</p>
        <p>{summary.overview}</p>
      </section>
      {presentations.length > 1 && <nav className="summit-presentation-overview" aria-label="Presentations in this session">
        <h2>In this session</h2>
        <ol>{presentations.map((presentation, index) => <li key={index}><a href={`#${presentationId(index)}`}>{presentation.title}</a></li>)}</ol>
      </nav>}
      {!!summary.keyTakeaways.length && (
        <section>
          <h2>Key takeaways</h2>
          <ol className="summit-takeaways">
            {summary.keyTakeaways.map((item, index) => (
              <li key={index}>
                {typeof item === 'string' ? <p>{item}</p> : <>
                  {item.heading && <h3>{item.heading}</h3>}
                  <p>{item.explanation}</p>
                </>}
              </li>
            ))}
          </ol>
        </section>
      )}
      <HighlightedInsight insight={summary.highlightedInsight} />
      {presentations.map((presentation, index) => <section key={index} id={presentationId(index)} className="summit-presentation">
        <h2><span className="summit-presentation-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span>{presentation.title}</span></h2>
        {!!presentation.speakerIds?.length && <ContentLinks items={allSpeakers.filter(speaker => presentation.speakerIds.includes(speaker.id))} directory="speakers" />}
        <p className="summit-presentation-explanation">{presentation.explanation}</p>
        <HighlightedInsight insight={presentation.highlightedInsight} />
        {!!presentation.sections?.length && <DetailedSections sections={presentation.sections} />}
      </section>)}
      {!!summary.detailedSummary?.length && (
        <section>
          <h2>Detailed summary</h2>
          <DetailedSections sections={summary.detailedSummary} />
        </section>
      )}
      {[
        ['notableIdeas', 'Notable insights'],
        ['practicalApplications', 'Practical applications'],
      ].map(([field, heading]) => !!summary[field]?.length && (
        <section key={field}>
          <h2>{heading}</h2>
          <TextList items={summary[field]} />
        </section>
      ))}
    </div>
  );
}
