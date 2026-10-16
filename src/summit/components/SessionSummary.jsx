function TextList({ items }) {
  return <ul className="summit-bullets">{items.map((item, index) => <li key={index}>{item}</li>)}</ul>;
}

export default function SessionSummary({ summary }) {
  return (
    <div className="summit-article-body">
      <section>
        <h2>Quick overview</h2>
        <p className="summit-meta">Independent, AI-assisted summary. Notes may contain errors; check the source when available.</p>
        <p>{summary.overview}</p>
      </section>
      {!!summary.keyTakeaways.length && (
        <section>
          <h2>Key takeaways</h2>
          <ul className="summit-takeaways">
            {summary.keyTakeaways.map((item, index) => (
              <li key={index}>
                {typeof item === 'string' ? <p>{item}</p> : <>
                  {item.heading && <h3>{item.heading}</h3>}
                  <p>{item.explanation}</p>
                </>}
              </li>
            ))}
          </ul>
        </section>
      )}
      {!!summary.detailedSummary?.length && (
        <section>
          <h2>Detailed summary</h2>
          {summary.detailedSummary.map((section, index) => (
            <section key={index} className="summit-article-section">
              <h3>{section.heading}</h3>
              {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              {!!section.bullets?.length && <TextList items={section.bullets} />}
            </section>
          ))}
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
