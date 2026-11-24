/**
 * Shared contract for Practice 12. The low-code (Appsmith) version uses the same
 * fixture, reason codes, messages and test inputs.
 */
export const ROOM_LABEL = 'A-101';
export const NOW = 540; // fixed current time, 09:00
export const BOOKINGS = Object.freeze([Object.freeze({ label: 'Study session', start: 600, end: 660 })]); // 10:00–11:00, fictional
export const MAX_DURATION = 120;

export const STATUS = Object.freeze({ AVAILABLE: 'available', UNAVAILABLE: 'unavailable', INVALID: 'invalid' });

export const MESSAGES = Object.freeze({
  INVALID_START: 'Enter the start time as HH:MM, for example 11:00.',
  INVALID_DURATION: 'Duration must be a whole number from 1 to 120 minutes and end by 24:00.',
  PAST_START: 'Start time must be after the fixed current time, 09:00.',
  BLOCKED: 'Room A-101 is blocked. Turn off the demo block to check it.',
  OVERLAP: 'This time overlaps the existing 10:00–11:00 booking.',
});

/** The eight shared test inputs (Task 05), prepared before implementation. */
export const TEST_CASES = Object.freeze([
  { id: 'T1', name: 'valid free interval', input: { startTime: '11:00', duration: '60', blocked: false }, expected: { status: 'available', reasonCode: 'AVAILABLE' } },
  { id: 'T2', name: 'overlap with an existing booking', input: { startTime: '10:30', duration: '60', blocked: false }, expected: { status: 'unavailable', reasonCode: 'OVERLAP' } },
  { id: 'T3', name: 'blocked room', input: { startTime: '11:00', duration: '60', blocked: true }, expected: { status: 'unavailable', reasonCode: 'BLOCKED' } },
  { id: 'T4', name: 'duration = 0', input: { startTime: '11:00', duration: '0', blocked: false }, expected: { status: 'invalid', reasonCode: 'INVALID_DURATION' } },
  { id: 'T5', name: 'duration = 121 minutes', input: { startTime: '11:00', duration: '121', blocked: false }, expected: { status: 'invalid', reasonCode: 'INVALID_DURATION' } },
  { id: 'T6', name: 'past start time', input: { startTime: '08:00', duration: '30', blocked: false }, expected: { status: 'invalid', reasonCode: 'PAST_START' } },
  { id: 'T7', name: 'adjacent non-overlapping interval', input: { startTime: '11:00', duration: '30', blocked: false }, expected: { status: 'available', reasonCode: 'AVAILABLE' } },
  { id: 'T8', name: 'booking data unchanged after checks', input: null, expected: { bookings: [{ label: 'Study session', start: 600, end: 660 }] } },
]);
