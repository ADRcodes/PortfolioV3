import { sessions } from '../content/index.js';
import SessionList, { formatDay } from '../components/SessionList.jsx';

export default function Sessions() {
  const days = [...new Set(sessions.map(session => session.date))];
  return <><h1>Sessions</h1><p>Times are shown in conference local time (America/St_Johns). Summaries appear after publication.</p>
    {!days.length && <p>The schedule has not been added yet.</p>}
    {days.map(day => <section key={day}><h2>{formatDay(day)}</h2><SessionList sessions={sessions.filter(session => session.date === day)} /></section>)}
  </>;
}
