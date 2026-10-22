import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { recaps } from '../content/index.js';
import { formatPublication } from '../lib/programme.js';
import { summitPath } from '../routing/paths.js';
import '../styles/recaps.css';

export default function RecapFeatures() {
  if (!recaps.length) return null;
  return <section className="summit-recap-features" aria-labelledby="summit-recaps-title">
    <h3 id="summit-recaps-title">Across the sessions</h3>
    <div className="summit-recap-collection">{recaps.map(recap => <article className="summit-recap-feature" key={recap.id}>
      <h4><Link to={summitPath(`recaps/${recap.slug}`)}>{recap.title}</Link></h4>
      <p>{recap.excerpt}</p>
      <p className="summit-recap-feature-date"><time dateTime={recap.publishedAt}>{formatPublication(recap.publishedAt)}</time></p>
      <Link className="summit-recap-read" to={summitPath(`recaps/${recap.slug}`)}>Read the recap<span className="summit-sr-only">: {recap.title}</span><ArrowUpRight size={20} aria-hidden="true" /></Link>
    </article>)}</div>
  </section>;
}
