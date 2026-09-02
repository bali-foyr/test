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
