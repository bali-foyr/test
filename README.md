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

## Deploy (Render, free tier)

The app runs as a single Node service in production: Express serves the
built React app plus the `/api` routes (see `render.yaml`).

1. Push this repo to GitHub (already done if you're reading this on the branch).
2. On [render.com](https://render.com): **New → Blueprint**, connect this repo.
   Render reads `render.yaml` and provisions the web service on the free plan.
3. Deploy — no other config needed, no separate database to provision.

**Free-tier tradeoff**: no persistent disk, so the SQLite file resets on
every restart/redeploy — including the spin-down that happens after 15 min
idle. Data does not survive that. Fine for demoing the flow, not for real
customer data. Upgrading to a paid plan + re-adding a disk (see git history
on `render.yaml`) fixes this whenever it's needed.

### Keeping it warm

`.github/workflows/keepalive.yml` pings `/api/health` every 10 minutes via
GitHub Actions to reduce cold-starts. It defaults to
`https://window-measure.onrender.com` — if your actual Render URL differs
(name collision), set a repo variable `RENDER_APP_URL` (Settings → Secrets
and variables → Actions → Variables) to override it.

Note: this reduces spin-downs, it doesn't guarantee them away — GitHub
Actions cron timing isn't exact, and a ping arriving after the 15-min mark
still means a cold start. It also doesn't fix data loss above; a ping keeps
the process alive, but any *redeploy* still wipes the ephemeral SQLite file
regardless.
