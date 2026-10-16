import { Link } from 'react-router';
import { sessions } from '../content/index.js';
import { navigation, summitPath } from '../routing/paths.js';
import SessionList from '../components/SessionList.jsx';

export default function SummitHome() {
  const published = sessions.filter(session => session.status === 'published').sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0, 3);
  return <>
    <h1>techNL Summit 2026</h1>
    <p className="summit-intro">Explore the conference schedule, speakers and companies, with AI-generated session notes added after publication.</p>
    <ul className="summit-links">{navigation.filter(item => item.path).map(item => <li key={item.path}><Link to={summitPath(item.path)}>Browse {item.label.toLowerCase()}</Link></li>)}</ul>
    <section><h2>Schedule preview</h2><SessionList sessions={sessions.slice(0, 3)} /><Link to={summitPath('sessions')}>View all sessions</Link></section>
    <section><h2>Recently published summaries</h2><SessionList sessions={published} empty="No summaries have been published yet." /></section>
  </>;
}
