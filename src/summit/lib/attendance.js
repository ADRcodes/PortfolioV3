import { attendingSessionIds } from '../content/attendance.js';
import { expectsSummary } from './programme.js';

export function needsRecordingRequest(session, sessions, attendingIds = attendingSessionIds) {
  if (session.programme !== 'conference' || session.status !== 'upcoming' || !expectsSummary(session) || attendingIds.includes(session.id)) return false;
  return sessions.some(attending => attendingIds.includes(attending.id)
    && attending.programme === 'conference' && attending.status !== 'draft'
    && attending.date === session.date
    && attending.startTime < session.endTime && session.startTime < attending.endTime);
}

// Reorder only within an existing parallel slot; unknown choices retain source order.
export function preferAttendedSessions(slot, attendingIds = attendingSessionIds) {
  return [...slot].sort((a, b) => Number(attendingIds.includes(b.id)) - Number(attendingIds.includes(a.id)));
}
