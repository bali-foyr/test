import { useState } from 'react';

export default function StartVisit({ onStart }) {
  const [label, setLabel] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!label.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await onStart(label.trim());
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h2>Step 1 — Start Site Visit</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Visit label (customer / address)
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Sharma Residence, Andheri"
            autoFocus
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={busy || !label.trim()}>
          {busy ? 'Starting…' : 'Start Visit'}
        </button>
      </form>
    </div>
  );
}
