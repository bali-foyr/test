export default function ReviewSummary({ summary, onRestart }) {
  if (!summary) return <div className="card">Loading summary…</div>;

  return (
    <div className="card">
      <h2>Step 4 — Review &amp; Summary</h2>
      <p className="hint">{summary.label}</p>
      <table>
        <thead>
          <tr>
            <th>Room</th>
            <th>Window</th>
            <th>Size (in)</th>
            <th>Mount</th>
            <th>Fabric</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {summary.rooms.flatMap((room) =>
            room.windows.map((w) => (
              <tr key={w.id}>
                <td>{room.name}</td>
                <td>{w.label}</td>
                <td>
                  {w.width} × {w.height}
                </td>
                <td>{w.mount_type}</td>
                <td>{w.fabric_name}</td>
                <td>₹{w.price.toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5}>
              <strong>Running Total</strong>
            </td>
            <td>
              <strong>₹{summary.runningTotal.toFixed(2)}</strong>
            </td>
          </tr>
        </tfoot>
      </table>
      <button type="button" onClick={onRestart}>
        Start New Visit
      </button>
    </div>
  );
}
