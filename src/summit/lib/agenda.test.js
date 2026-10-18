import test from 'node:test';
import assert from 'node:assert/strict';
import { agendaFocus, conferenceClock, formatTime, groupSessions, sameSlot, sessionTiming } from './agenda.js';
const session = (id, startTime, endTime, date = '2026-10-20') => ({ id, date, startTime, endTime });
const morning = session('morning', '09:00', '10:30');
const next = session('next', '11:00', '11:45');
const parallel = session('parallel', '11:00', '12:00');
const later = session('later', '14:00', '15:00');
const schedule = [later, morning, next, parallel];
const clock = time => ({ date: '2026-10-20', time });
test('10:45 focuses the 11:00 session, including parallel sessions', () => {
  assert.equal(agendaFocus(schedule, clock('10:45')).id, 'next');
  assert.ok(sameSlot(next, parallel));
  assert.ok(!sameSlot(next, later));
});
test('next start takes priority over an ongoing session without consulting publication state', () => {
  assert.equal(agendaFocus(schedule, clock('09:30')).id, 'next');
  assert.equal(agendaFocus([{ ...next, status: 'published' }], clock('10:45')).id, 'next');
});
test('start and end boundaries are handled consistently', () => {
  assert.equal(agendaFocus(schedule, clock('11:00')).id, 'next');
  assert.equal(sessionTiming(next, clock('11:00')), 'live');
  assert.equal(sessionTiming(next, clock('11:45')), 'past');
  assert.equal(sessionTiming(next, clock('10:59')), 'future');
});
test('before, during final session, after conference, and empty schedule', () => {
  assert.equal(agendaFocus(schedule, { date: '2026-10-19', time: '23:59' }).id, 'morning');
  assert.equal(agendaFocus(schedule, clock('14:30')).id, 'later');
  assert.equal(agendaFocus(schedule, { date: '2026-10-21', time: '09:00' }).id, 'later');
  assert.equal(agendaFocus([], clock('10:45')), null);
});
test('conference clock uses Newfoundland time across DST and date boundaries', () => {
  assert.deepEqual(conferenceClock(new Date('2026-10-20T13:15:00Z')), clock('10:45'));
  assert.deepEqual(conferenceClock(new Date('2026-12-01T14:15:00Z')), { date: '2026-12-01', time: '10:45' });
  assert.deepEqual(conferenceClock(new Date('2026-10-20T01:00:00Z')), { date: '2026-10-19', time: '22:30' });
});
test('human-readable time handles midnight and noon', () => {
  assert.equal(formatTime('00:05'), '12:05 AM');
  assert.equal(formatTime('12:00'), '12:00 PM');
  assert.equal(formatTime('15:30'), '3:30 PM');
});

test('parallel choices share a start-time slot, with stable order and separate days', () => {
  const tomorrow = session('tomorrow', '11:00', '12:30', '2026-10-21');
  const input = [later, next, morning, parallel, tomorrow];
  const slots = groupSessions(input);
  assert.deepEqual(slots.map(slot => slot.map(item => item.id)), [['morning'], ['next', 'parallel'], ['later'], ['tomorrow']]);
  assert.deepEqual(input.map(item => item.id), ['later', 'next', 'morning', 'parallel', 'tomorrow']);
  assert.deepEqual(groupSessions([]), []);
});
