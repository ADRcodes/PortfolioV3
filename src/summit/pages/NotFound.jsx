import { Link } from 'react-router';
import { summitPath } from '../routing/paths.js';
export default function NotFound() {
  return <><h1>Page not found</h1><p>This conference page is unavailable or has not been published.</p><Link to={summitPath()}>Return to the conference homepage</Link></>;
}
