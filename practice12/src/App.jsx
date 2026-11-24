import React, { useState } from 'react';
import { checkAvailability } from './availability.js';
import { BOOKINGS } from './contract.js';
import './styles.css';

const hhmm = minutes => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
const ICON = { available: '✓', unavailable: '!', invalid: '?' };
const TITLE = { available: 'Available', unavailable: 'Unavailable', invalid: 'Check your input' };

export default function App() {
  const [start, setStart] = useState('11:00');
  const [duration, setDuration] = useState('60');
  const [blocked, setBlocked] = useState(false);
  const [result, setResult] = useState(null);
  function change(setter, value) { setter(value); setResult(null); }
  function check(event) {
    event.preventDefault();
    setResult(checkAvailability({ startTime: start, duration, blocked }));
  }
  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#main"><span className="brand-mark">SC</span>Smart Campus</a><span className="demo-label"><span/>Student demo</span></header>
    <main id="main">
      <div className="eyebrow">SPACES FOR YOUR NEXT IDEA</div>
      <h1>A little room<br/>for possibility.</h1>
      <p className="intro">Find a free moment in A-101. Pick your times and check the room before you plan.</p>
      <div className="workspace">
        <section className="room-panel" aria-labelledby="room-heading">
          <div className="room-top"><span className="label">YOUR SPACE</span><span className="room-type">Study room</span></div>
          <div className="room-art" aria-hidden="true"><div className="window"><i/><i/></div><div className="table"><span/><span/><span/></div><div className="plant">✳</div></div>
          <div className="room-info"><h2 id="room-heading">Room A-101</h2><p>North building · Ground floor</p><div className="amenities"><span>8 seats</span><span>Whiteboard</span><span>Wi-Fi</span></div></div>
          <div className="schedule"><div className="section-line"><h3>Today’s schedule</h3><span>Fictional day</span></div>{BOOKINGS.map(b => <div className="booking" key={b.start}><span className="booking-line"/><div><strong>{hhmm(b.start)}–{hhmm(b.end)}</strong><p>{b.label} · Existing booking</p></div><span className="reserved">Reserved</span></div>)}</div>
        </section>
        <section className="check-panel" aria-labelledby="check-heading">
          <div className="section-line"><span className="label">PLAN YOUR VISIT</span><span className="clock">Now 09:00 · Fixed</span></div>
          <h2 id="check-heading">Check availability</h2><p className="form-intro">One room. Your time. Up to two hours.</p>
          <form onSubmit={check} noValidate>
            <div className="time-grid"><label htmlFor="start">Start time<input id="start" type="time" required value={start} onChange={e => change(setStart, e.target.value)} aria-describedby="time-hint"/></label><label htmlFor="duration">Duration (minutes)<input id="duration" type="number" inputMode="numeric" min="1" max="120" step="1" required value={duration} onChange={e => change(setDuration, e.target.value)} aria-describedby="time-hint"/></label></div>
            <p id="time-hint" className="hint">After 09:00 · 1–120 minutes · Must end by 24:00</p>
            <label className="block-toggle"><input type="checkbox" checked={blocked} onChange={e => change(setBlocked, e.target.checked)}/><span><strong>Room blocked</strong><small>Try the room’s unavailable state</small></span></label>
            <button type="submit">Check availability <span aria-hidden="true">↗</span></button>
          </form>
          <div role="status" aria-live="polite" className={`result ${result ? result.status : 'idle'}`}>
            <span className="result-icon" aria-hidden="true">{result ? ICON[result.status] : '◷'}</span><div><h3>{result ? TITLE[result.status] : 'Ready when you are'}</h3><p>{result ? result.message : 'Check a time to see whether the room is free.'}</p>{result && <small className="reason-code">Reason code: {result.reasonCode}</small>}</div>
          </div>
          <div className="rule-note"><strong>A smooth handover.</strong><p>A session can start exactly when another ends. Your check leaves today’s schedule unchanged.</p></div>
        </section>
      </div>
      <footer><span>SMART CAMPUS / PRACTICE 12 · CODE-BASED</span><span>Availability only · No reservation is saved</span></footer>
    </main>
  </div>;
}
