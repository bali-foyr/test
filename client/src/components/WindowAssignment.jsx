import { useState } from 'react';

export default function WindowAssignment({ rooms, onAddWindow, onNext, totalWindows }) {
  const [labels, setLabels] = useState({});
  const [busy, setBusy] = useState(null);

  async function handleAdd(roomId) {
    const label = (labels[roomId] || '').trim();
    if (!label) return;
    setBusy(roomId);
    try {
      await onAddWindow(roomId, label);
      setLabels((prev) => ({ ...prev, [roomId]: '' }));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="card">
      <h2>Step 2a — Assign windows to rooms</h2>
      {rooms.map((room) => (
        <div key={room.id} className="room-block">
          <h3>{room.name}</h3>
          <ul className="list">
            {room.windows.map((w) => (
              <li key={w.id}>{w.label}</li>
            ))}
          </ul>
          <div className="inline-form">
            <input
              value={labels[room.id] || ''}
              onChange={(e) => setLabels((prev) => ({ ...prev, [room.id]: e.target.value }))}
              placeholder="Window label, e.g. W1"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd(room.id)}
            />
            <button
              type="button"
              onClick={() => handleAdd(room.id)}
              disabled={busy === room.id || !(labels[room.id] || '').trim()}
            >
              Add Window
            </button>
          </div>
        </div>
      ))}
      <button type="button" onClick={onNext} disabled={totalWindows === 0}>
        Next: Measure Windows →
      </button>
    </div>
  );
}
