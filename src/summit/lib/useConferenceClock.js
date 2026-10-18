import { useEffect, useState } from 'react';
import { conferenceClock } from './agenda.js';
export default function useConferenceClock() {
  const [clock, setClock] = useState(conferenceClock);
  useEffect(() => {
    const update = () => setClock(conferenceClock());
    const timer = window.setInterval(update, 30_000);
    document.addEventListener('visibilitychange', update);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', update); };
  }, []);
  return clock;
}
