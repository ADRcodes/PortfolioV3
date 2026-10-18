import { Link } from 'react-router';
import { summitPath } from '../routing/paths.js';

export default function ContentLinks({ items, directory, empty = 'None listed.' }) {
  if (!items.length) return <p>{empty}</p>;
  return <ul className="summit-links">{items.map(item => <li key={item.id}><Link data-profile={`${directory}/${item.slug}`} to={summitPath(`${directory}/${item.slug}`)}>{item.name ?? item.title}</Link></li>)}</ul>;
}
