async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ? JSON.stringify(body.error) : `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  createVisit: (label) => request('/visits', { method: 'POST', body: JSON.stringify({ label }) }),
  createRoom: (visitId, name) =>
    request(`/visits/${visitId}/rooms`, { method: 'POST', body: JSON.stringify({ name }) }),
  createWindow: (roomId, label) =>
    request(`/rooms/${roomId}/windows`, { method: 'POST', body: JSON.stringify({ label }) }),
  updateWindow: (windowId, data) =>
    request(`/windows/${windowId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getFabrics: () => request('/fabrics'),
  getSummary: (visitId) => request(`/visits/${visitId}/summary`),
};
