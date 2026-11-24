import { describe, expect, it } from 'vitest';
import { checkAvailability } from './availability.js';
import { BOOKINGS, TEST_CASES } from './contract.js';

describe('Practice 12 — shared test cases T1–T7 (code-based)', () => {
  it.each(TEST_CASES.filter(t => t.input))('$id $name', ({ input, expected }) => {
    const result = checkAvailability(input);
    expect(result.status).toBe(expected.status);
    expect(result.reasonCode).toBe(expected.reasonCode);
    expect(result.available).toBe(expected.status === 'available');
    expect(result.message.length).toBeGreaterThan(10);
  });
  it('T8 booking data unchanged after running all checks', () => {
    const before = structuredClone(BOOKINGS);
    for (const t of TEST_CASES.filter(c => c.input)) checkAvailability(t.input);
    expect(BOOKINGS).toEqual(before);
    expect(BOOKINGS).toEqual(TEST_CASES.find(t => t.id === 'T8').expected.bookings);
  });
});

describe('Practice 12 — extra validation and security cases', () => {
  it.each([
    ['X1 empty start', { startTime: '', duration: '60' }, 'INVALID_START'],
    ['X2 empty duration', { startTime: '11:00', duration: '' }, 'INVALID_DURATION'],
    ['X3 decimal duration', { startTime: '11:00', duration: '30.5' }, 'INVALID_DURATION'],
    ['X4 ends after midnight', { startTime: '23:30', duration: '60' }, 'INVALID_DURATION'],
    ['X5 script text in start time', { startTime: '<img src=x onerror=alert(1)>', duration: '60' }, 'INVALID_START'],
    ['X6 exactly 120 minutes', { startTime: '12:00', duration: '120' }, 'AVAILABLE'],
    ['X7 touching start of booking', { startTime: '09:30', duration: '30' }, 'AVAILABLE'],
  ])('%s', (_id, form, reasonCode) => {
    expect(checkAvailability({ blocked: false, ...form }).reasonCode).toBe(reasonCode);
  });
  it('X8 the visible message never echoes rejected input', () => {
    const result = checkAvailability({ startTime: '<script>x</script>', duration: '60', blocked: false });
    expect(result.message).not.toContain('<');
  });
});
