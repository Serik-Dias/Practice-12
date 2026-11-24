// Appsmith JS object "Rules" — low-code version (same contract as src/contract.js)
export default {
  NOW: 540, // fixed current time 09:00
  bookings: [{ label: 'Study session', start: 600, end: 660 }], // 10:00–11:00, fictional
  result: { status: 'idle', reasonCode: '', message: 'Choose a start time and a duration.' },
  toMinutes(value) {
    if (!/^\d{2}:\d{2}$/.test(value || '')) return NaN;
    const [h, m] = value.split(':').map(Number);
    return h < 24 && m < 60 ? h * 60 + m : NaN;
  },
  check(startText, durationText, blocked) {
    const start = this.toMinutes(startText);
    const duration = Number(durationText);
    let r;
    if (!Number.isFinite(start)) r = ['invalid', 'INVALID_START', 'Enter the start time as HH:MM, for example 11:00.'];
    else if (String(durationText).trim() === '' || !Number.isInteger(duration) || duration <= 0 || duration > 120 || start + duration > 1440)
      r = ['invalid', 'INVALID_DURATION', 'Duration must be a whole number from 1 to 120 minutes and end by 24:00.'];
    else if (start <= this.NOW) r = ['invalid', 'PAST_START', 'Start time must be after the fixed current time, 09:00.'];
    else if (blocked) r = ['unavailable', 'BLOCKED', 'Room A-101 is blocked. Turn off the demo block to check it.'];
    else if (this.bookings.some(b => start < b.end && start + duration > b.start))
      r = ['unavailable', 'OVERLAP', 'This time overlaps the existing 10:00–11:00 booking.'];
    else r = ['available', 'AVAILABLE', startText + ' for ' + duration + ' min is free. This check does not create a booking.'];
    this.result = { status: r[0], reasonCode: r[1], message: r[2] };
    return this.result;
  }
}
