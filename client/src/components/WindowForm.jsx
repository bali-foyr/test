import { useState } from 'react';

export default function WindowForm({ window: win, room, fabrics, index, total, onSave }) {
  const [width, setWidth] = useState(win.width ?? '');
  const [height, setHeight] = useState(win.height ?? '');
  const [mountType, setMountType] = useState(win.mount_type ?? 'inside');
  const [fabricId, setFabricId] = useState(win.fabric_id ?? (fabrics[0]?.id ?? ''));
  const [notes, setNotes] = useState(win.notes ?? '');
  const [busy, setBusy] = useState(false);

  const valid = Number(width) > 0 && Number(height) > 0 && fabricId;

  async function handleSave() {
    if (!valid) return;
    setBusy(true);
    try {
      await onSave(win.id, {
        width: Number(width),
        height: Number(height),
        mount_type: mountType,
        fabric_id: Number(fabricId),
        notes: notes || undefined,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h2>
        Step 3 — {room.name} / {win.label}{' '}
        <span className="hint">
          (window {index + 1} of {total})
        </span>
      </h2>

      <div className="grid-2">
        <label>
          Width (in)
          <input type="number" min="1" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} autoFocus />
        </label>
        <label>
          Height (in)
          <input type="number" min="1" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} />
        </label>
      </div>

      <fieldset className="toggle">
        <legend>Mount</legend>
        <label>
          <input
            type="radio"
            name="mount"
            checked={mountType === 'inside'}
            onChange={() => setMountType('inside')}
          />
          Inside
        </label>
        <label>
          <input
            type="radio"
            name="mount"
            checked={mountType === 'outside'}
            onChange={() => setMountType('outside')}
          />
          Outside
        </label>
      </fieldset>

      <label>
        Fabric
        <select value={fabricId} onChange={(e) => setFabricId(e.target.value)}>
          {fabrics.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name} (₹{f.rate}/sq ft)
            </option>
          ))}
        </select>
      </label>

      <label>
        Additional notes
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Custom requirements…" rows={2} />
      </label>

      <div className="photo-upload disabled" title="Requires storage config (e.g. S3) — not set up yet">
        <span>📷 Photos (up to 3)</span>
        <button type="button" disabled>
          Add Photo
        </button>
        <span className="hint">Disabled — no storage configured yet</span>
      </div>

      <button type="button" onClick={handleSave} disabled={!valid || busy}>
        {busy ? 'Saving…' : index + 1 === total ? 'Save & Review →' : 'Save & Next →'}
      </button>
    </div>
  );
}
