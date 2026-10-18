export const CONFERENCE_TIME_ZONE = 'America/St_Johns';
const clockFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: CONFERENCE_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});
export function conferenceClock(now = new Date()) {
  const parts = Object.fromEntries(clockFormatter.formatToParts(now).map(part => [part.type, part.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}
export function formatTime(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
}
export const shortDay = date => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'UTC', month: 'short', day: 'numeric',
}).format(new Date(`${date}T12:00:00Z`));
export function sessionTiming(session, clock) {
  const now = `${clock.date} ${clock.time}`;
  if (`${session.date} ${session.endTime}` <= now) return 'past';
  if (`${session.date} ${session.startTime}` <= now) return 'live';
  return 'future';
}
export function agendaFocus(sessions, clock) {
  // Schedule and publication state are independent. Keep simultaneous sessions together.
  const sorted = [...sessions].sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
  const next = sorted.find(session => `${session.date} ${session.startTime}` >= `${clock.date} ${clock.time}`);
  return next ?? sorted.find(session => sessionTiming(session, clock) === 'live') ?? sorted.at(-1) ?? null;
}
export const sameSlot = (a, b) => Boolean(a && b && a.date === b.date && a.startTime === b.startTime);
// Group by start, not end: concurrent sessions remain one schedule choice.
export function groupSessions(sessions) {
  const slots = new Map();
  [...sessions].sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)).forEach(session => {
    const key = `${session.date} ${session.startTime}`;
    if (!slots.has(key)) slots.set(key, []);
    slots.get(key).push(session);
  });
  return [...slots.values()];
}
export function revealSession(element, behavior = 'instant') {
  const track = element?.closest('.summit-slot-cards');
  if (track && track.scrollWidth > track.clientWidth + 1) {
    track.scrollTo({ left: track.scrollLeft + element.getBoundingClientRect().left - track.getBoundingClientRect().left, behavior });
  }
}
export function centerSession(element, behavior = 'smooth') {
  if (!element) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.summit-header')?.getBoundingClientRect().height ?? 0;
  const browser = document.querySelector('.summit-agenda-browser')?.getBoundingClientRect().height ?? 0;
  const nav = document.querySelector('.summit-primary-nav');
  const bottom = nav && getComputedStyle(nav).position === 'fixed' ? nav.getBoundingClientRect().height : 0;
  const top = header + browser + 16;
  const available = Math.max(0, window.innerHeight - top - bottom - 16);
  revealSession(element, reduced ? 'instant' : behavior);
  const track = element.closest('.summit-slot-cards');
  const carousel = track && track.scrollWidth > track.clientWidth + 1;
  const rect = (carousel ? element.closest('[data-agenda-slot]') : element).getBoundingClientRect();
  window.scrollTo({ top: window.scrollY + rect.top - top - Math.max(0, (available - rect.height) / 2), behavior: reduced ? 'instant' : behavior });
}
