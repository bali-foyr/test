# Window Measurement Capture — v1 Dev Plan

Scope: functionality-first v1. No auth. No file storage (photo capture UI exists but disabled — no S3 configured yet).

## Stack
- Backend: Node + Express
- DB: SQLite (`better-sqlite3`) — file-based, no external service
- Validation: `zod`
- Logging: `pino` + `pino-http` (+ `pino-pretty` in dev)
- Frontend: React + Vite
- Dev: `nodemon`, Vite dev server proxying `/api` to Express

## Data model
- `visits` (id, label, created_at)
- `rooms` (id, visit_id, name)
- `windows` (id, room_id, label, width, height, mount_type, fabric_id, notes)
- `fabrics` (id, name, rate) — seeded with 5 sample rows
- `photos` table exists in schema but is unused in v1 (no upload endpoint wired)

## Backend routes
- `POST /api/visits` — start visit
- `GET /api/visits/:id` — fetch visit + rooms + windows
- `POST /api/visits/:id/rooms` — add room(s)
- `POST /api/rooms/:id/windows` — add window (label) to a room
- `PATCH /api/windows/:id` — save width/height/mount_type/fabric_id/notes
- `GET /api/fabrics` — list fabrics + rates
- `GET /api/visits/:id/summary` — all windows with computed price per window + running total

## Pricing logic
Single function, server-side, one file (`server/pricing.js`):
`billableSize(width, height, mountType)` → placeholder offset per mount type → `× fabric.rate` = price per window. Isolated so the real formula can replace it later without touching routes.

## Frontend flow (matches capture-flow spec)
1. `StartVisit` — create visit
2. `RoomSetup` — how many rooms, name them
3. `WindowAssignment` — how many windows per room, label + assign
4. `WindowForm` (per window) — width, height, mount toggle, fabric dropdown, notes, **photo upload UI present but disabled/greyed out** (tooltip: "requires storage config")
5. Repeat step 4 across all windows
6. `ReviewSummary` — table of all windows with price, running total

## Explicitly out of scope for v1
- Auth
- Photo upload/storage (UI stub only, disabled)
- Tally/WhatsApp/any external integration
- Deployment
