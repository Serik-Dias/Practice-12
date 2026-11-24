/**
 * Availability layer. Validation runs first; the unchanged rule engine (booking.js) then
 * decides blocked / overlap. Returns { available, status, reasonCode, message }.
 */
import { bookingIssue } from './booking.js';
import { BOOKINGS, MESSAGES, NOW, STATUS } from './contract.js';
import { validateRequest } from './validation.js';

const ISSUE_TO_REASON = { blocked: 'BLOCKED', overlap: 'OVERLAP', past: 'PAST_START', duration: 'INVALID_DURATION', interval: 'INVALID_DURATION', invalidTime: 'INVALID_START' };

const decision = (status, reasonCode, message) => ({ available: status === STATUS.AVAILABLE, status, reasonCode, message });

export function checkAvailability(form, { now = NOW, bookings = BOOKINGS } = {}) {
  const checked = validateRequest(form, { now });
  if (!checked.ok) return decision(STATUS.INVALID, checked.reasonCode, MESSAGES[checked.reasonCode]);

  const { start, end, minutes, blocked } = checked.value;
  const issue = bookingIssue({ start, end, now, blocked, bookings });
  if (issue === null) {
    return decision(STATUS.AVAILABLE, 'AVAILABLE', `${form.startTime} for ${minutes} min is free. This check does not create a booking.`);
  }
  const reasonCode = ISSUE_TO_REASON[issue];
  const status = reasonCode === 'BLOCKED' || reasonCode === 'OVERLAP' ? STATUS.UNAVAILABLE : STATUS.INVALID;
  return decision(status, reasonCode, MESSAGES[reasonCode]);
}
