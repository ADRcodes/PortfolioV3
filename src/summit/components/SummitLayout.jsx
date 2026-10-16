import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { navigation, summitPath } from '../routing/paths.js';
import '../styles/summit.css';

export default function SummitLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    const previous = document.title;
    document.title = 'techNL Summit 2026 | Conference notes';
    return () => { document.title = previous; };
  }, []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return (
    <div className="summit-app">
      <a className="summit-skip" href="#summit-main">Skip to content</a>
      <header className="summit-header">
        <div className="summit-container summit-header-inner">
          <Link className="summit-brand" to={summitPath()}>techNL Summit 2026</Link>
          <nav aria-label="Conference navigation">
            {navigation.map(item => <NavLink key={item.path} to={summitPath(item.path)} end={item.path === ''}>{item.label}</NavLink>)}
          </nav>
        </div>
      </header>
      <main id="summit-main" className="summit-container summit-main" tabIndex={-1}>
        <p className="summit-notice"><strong>Demonstration content.</strong> All sessions, dates, people, companies and summaries are samples to replace before launch. This is an independent conference notes site.</p>
        <Outlet />
      </main>
      <footer className="summit-footer">
        <div className="summit-container">Independent conference notes by <Link to="/">Alex Russell · alexrussell.info</Link>. Not an official techNL website.</div>
      </footer>
    </div>
  );
}
