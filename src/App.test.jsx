import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App.jsx';
import { BOOKINGS } from './contract.js';

function run({ start, duration, blocked } = {}) {
  if (start !== undefined) fireEvent.change(screen.getByLabelText('Start time'), { target: { value: start } });
  if (duration !== undefined) fireEvent.change(screen.getByLabelText('Duration (minutes)'), { target: { value: duration } });
  if (blocked) fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: /check availability/i }));
  return screen.getByRole('status');
}

describe('Practice 12 — code-based UI', () => {
  it('UI1 shows Available with the reason code for a free interval (T1)', () => {
    render(<App />);
    const status = run();
    expect(status).toHaveTextContent('Available');
    expect(status).toHaveTextContent('Reason code: AVAILABLE');
  });
  it('UI2 shows Unavailable for an overlap (T2)', () => {
    render(<App />);
    expect(run({ start: '10:30' })).toHaveTextContent('This time overlaps the existing 10:00–11:00 booking.');
  });
  it('UI3 shows understandable validation feedback for duration 0 (T4, AC6)', () => {
    render(<App />);
    const status = run({ duration: '0' });
    expect(status).toHaveTextContent('Check your input');
    expect(status).toHaveTextContent('Duration must be a whole number from 1 to 120 minutes');
  });
  it('UI4 clears the old result when an input changes', () => {
    render(<App />);
    run();
    fireEvent.change(screen.getByLabelText('Duration (minutes)'), { target: { value: '90' } });
    expect(screen.getByRole('status')).toHaveTextContent('Ready when you are');
  });
  it('UI5 schedule still shows the single fictional booking after many checks (T8, AC5)', () => {
    render(<App />);
    for (const start of ['11:00', '10:30', '08:00']) run({ start });
    expect(screen.getAllByText('Study session · Existing booking')).toHaveLength(1);
    expect(BOOKINGS).toEqual([{ label: 'Study session', start: 600, end: 660 }]);
  });
});
