/** Validation layer: turns raw form text into minutes, or returns a validation reason code. */
import { MAX_DURATION } from './contract.js';

export function toMinutes(value) {
  if (typeof value !== 'string' || !/^\d{2}:\d{2}$/.test(value)) return NaN;
  const [hours, minutes] = value.split(':').map(Number);
  return hours < 24 && minutes < 60 ? hours * 60 + minutes : NaN;
}

export function validateRequest({ startTime, duration, blocked }, { now }) {
  const start = toMinutes(startTime);
  if (!Number.isFinite(start)) return { ok: false, reasonCode: 'INVALID_START' };

  const text = typeof duration === 'number' ? String(duration) : String(duration ?? '').trim();
  const minutes = Number(text);
  if (text === '' || !Number.isInteger(minutes) || minutes <= 0 || minutes > MAX_DURATION || start + minutes > 1440) {
    return { ok: false, reasonCode: 'INVALID_DURATION' };
  }
  if (start <= now) return { ok: false, reasonCode: 'PAST_START' };
  return { ok: true, value: { start, end: start + minutes, minutes, blocked: blocked === true } };
}
