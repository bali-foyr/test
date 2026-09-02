import { useState } from 'react';

export default function RoomSetup({ rooms, onAddRoom, onNext }) {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      await onAddRoom(name.trim());
      setName('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h2>Step 2 — How many windows and rooms?</h2>
      <p className="hint">Add each room. You'll assign windows to them next.</p>
      <form onSubmit={handleAdd} className="inline-form">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Room name, e.g. Living Room"
          autoFocus
        />
        <button type="submit" disabled={busy || !name.trim()}>
          Add Room
        </button>
      </form>
      <ul className="list">
        {rooms.map((r) => (
          <li key={r.id}>{r.name}</li>
        ))}
      </ul>
      <button type="button" onClick={onNext} disabled={rooms.length === 0}>
        Next: Assign Windows →
      </button>
    </div>
  );
}
