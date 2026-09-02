# Window Measurement Capture — v1

See [PLAN.md](./PLAN.md) for scope and architecture.

## Run locally

Backend (port 4000):
```
cd server && npm install && npm run dev
```

Frontend (port 5173, proxies /api to backend):
```
cd client && npm install && npm run dev
```

Open http://localhost:5173

## Deploy (Render)

The app runs as a single Node service in production: Express serves the
built React app plus the `/api` routes, backed by a SQLite file on a
persistent disk (see `render.yaml`).

1. Push this repo to GitHub (already done if you're reading this on the branch).
2. On [render.com](https://render.com): **New → Blueprint**, connect this repo.
   Render reads `render.yaml` and provisions the web service + a 1GB disk.
3. Requires a paid plan (Starter or above) — Render's free tier can't attach
   a persistent disk, and this app needs one for the SQLite file to survive
   restarts/deploys.
4. Deploy. `DB_PATH` and `NODE_ENV` are already set via the blueprint.

No other config needed — no separate database to provision, no manual env vars.
