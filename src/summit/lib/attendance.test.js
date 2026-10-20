import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { attendingSessionIds } from '../content/attendance.js';
import { needsRecordingRequest, preferAttendedSessions } from './attendance.js';

const directory = new URL('../content/sessions/', import.meta.url);
const sessions = await Promise.all((await readdir(directory)).filter(file => file.endsWith('.json')).map(async file => JSON.parse(await readFile(new URL(file, directory), 'utf8'))));
const expectedSlugs = [
  'ai-and-edi-in-hiring', 'linkedin-that-works', 'who-owns-the-innovation',
  'customer-success-in-the-age-of-ai', 'legal-without-the-handbrake', 'scrappy-marketing-for-startup-growth',
  'keeping-pace-with-change', 'power-of-brand-in-the-age-of-ai', 'sred-for-tech-companies',
];

test('Monday attendance identifies nine overlapping presentations and excludes those whose notes are published', () => {
  const unpublishedSchedule = sessions.map(session => ({ ...session, status: 'upcoming' }));
  assert.deepEqual(unpublishedSchedule.filter(session => needsRecordingRequest(session, unpublishedSchedule)).map(session => session.slug).sort(), [...expectedSlugs].sort());
  const eligible = expectedSlugs.filter(slug => sessions.find(session => session.slug === slug).status === 'upcoming');
  assert.deepEqual(sessions.filter(session => needsRecordingRequest(session, sessions)).map(session => session.slug).sort(), eligible.sort());
  assert.equal(attendingSessionIds.length, 3);
  for (const id of attendingSessionIds) {
    const attending = sessions.find(session => session.id === id);
    assert.ok(attending, `Attendance ID must resolve: ${id}`);
    assert.equal(attending.date, '2026-10-19');
    assert.equal(needsRecordingRequest(attending, sessions), false);
  }
});

test('publication, event classification and programme exclude ineligible requests', () => {
  const base = sessions.find(session => session.slug === expectedSlugs[0]);
  for (const status of ['published', 'draft']) assert.equal(needsRecordingRequest({ ...base, status }, sessions), false);
  for (const eventType of ['registration', 'break', 'networking', 'activity']) assert.equal(needsRecordingRequest({ ...base, eventType }, sessions), false);
  assert.equal(needsRecordingRequest({ ...base, programme: 'external' }, sessions), false);
  assert.equal(needsRecordingRequest({ ...base, date: '2026-10-20' }, sessions), false);
  assert.equal(needsRecordingRequest(base, sessions, []), false);
});

test('overlaps use agenda dates/times, exclude touching boundaries and follow changed attendance IDs', () => {
  const base = { ...sessions.find(session => session.slug === expectedSlugs[0]), status: 'upcoming' };
  for (const [startTime, endTime, expected] of [
    ['12:30', '13:00', false], ['13:40', '13:50', false],
    ['12:50', '13:10', true], ['13:20', '13:50', true], ['12:00', '15:30', true],
  ]) assert.equal(needsRecordingRequest({ ...base, startTime, endTime }, sessions), expected, `${startTime}–${endTime}`);
  const changedIds = [base.id];
  const originallyAttending = { ...sessions.find(session => session.id === attendingSessionIds[0]), status: 'upcoming' };
  assert.equal(needsRecordingRequest(base, sessions, changedIds), false);
  assert.equal(needsRecordingRequest(originallyAttending, sessions, changedIds), true);
  assert.equal(needsRecordingRequest(base, sessions, ['unknown-id']), false);
  assert.equal(needsRecordingRequest(base, sessions.map(session => ({ ...session, status: 'draft' }))), false);
});


test('attendance preferences reorder only known parallel choices without mutating the schedule', () => {
  for (const id of attendingSessionIds) {
    const selected = sessions.find(session => session.id === id);
    const slot = sessions.filter(session => session.date === selected.date && session.startTime === selected.startTime);
    const original = slot.map(session => session.id);
    const ordered = preferAttendedSessions(slot);
    assert.equal(ordered[0].id, id);
    assert.deepEqual(ordered.filter(session => session.id !== id).map(session => session.id), original.filter(other => other !== id));
    assert.deepEqual(slot.map(session => session.id), original);
    assert.deepEqual(preferAttendedSessions(slot, []), slot);
  }
});
