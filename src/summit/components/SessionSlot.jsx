import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock3 } from 'lucide-react';
import { formatTime, sameSlot } from '../lib/agenda.js';
import SessionCard from './SessionCard.jsx';

export default function SessionSlot({ sessions, clock, focus }) {
  const track = useRef(null);
  const [index, setIndex] = useState(0);
  const first = sessions[0];
  const parallel = sessions.length > 1;
  const current = sessions[index];
  const endTime = sessions.reduce((end, session) => session.endTime > end ? session.endTime : end, first.endTime);
  const select = position => {
    const element = track.current.children[position];
    track.current.scrollTo({ left: track.current.scrollLeft + element.getBoundingClientRect().left - track.current.getBoundingClientRect().left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  const sync = () => {
    const left = track.current.getBoundingClientRect().left;
    const distances = [...track.current.children].map(element => Math.abs(element.getBoundingClientRect().left - left));
    setIndex(distances.indexOf(Math.min(...distances)));
  };
  useEffect(() => {
    const observer = new ResizeObserver(sync);
    observer.observe(track.current);
    return () => observer.disconnect();
  }, [sessions]);
  return <li className="summit-agenda-slot" data-agenda-slot>
    <div className={`summit-time-marker${sameSlot(first, focus) ? ' is-next' : ''}`}><div data-shared="time"><Clock3 size={16} aria-hidden="true" /><span className="summit-sr-only">Newfoundland time, </span><time dateTime={`${first.date}T${first.startTime}`}>{formatTime(first.startTime)}</time><span className="summit-time-end"><span className="summit-sr-only">Expected end: </span><span aria-hidden="true">– </span><time dateTime={`${first.date}T${parallel ? current.endTime : endTime}`}>{formatTime(parallel ? current.endTime : endTime)}</time></span></div><span className="summit-timeline-dot" /></div>
    <div className="summit-slot-content">
      <div ref={track} className={`summit-slot-cards${parallel ? ' is-parallel' : ''}`} role={parallel ? 'group' : undefined} aria-label={parallel ? `${sessions.length} simultaneous sessions at ${formatTime(first.startTime)}` : undefined} onScroll={parallel ? sync : undefined}>
        {sessions.map(session => <div className="summit-slot-item" key={session.id} id={`agenda-${session.id}`} data-agenda-focus={session.id === focus?.id ? 'true' : undefined}>
          <SessionCard session={session} clock={clock} highlighted={sameSlot(session, focus)} agenda />
        </div>)}
      </div>
      {parallel && <div className="summit-slot-controls"><span className="summit-sr-only" aria-live="polite">Session {index + 1} of {sessions.length}</span><div><button aria-label="Previous simultaneous session" disabled={index === 0} onClick={() => select(index - 1)}><ChevronLeft size={21} aria-hidden="true" /><span>Previous</span></button><button aria-label="Next simultaneous session" disabled={index === sessions.length - 1} onClick={() => select(index + 1)}><span>Next</span><ChevronRight size={21} aria-hidden="true" /></button></div></div>}
    </div>
  </li>;
}
