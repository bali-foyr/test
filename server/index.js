const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const logger = require('./logger');
require('./db'); // ensures schema + seed run on boot

const fabricsRouter = require('./routes/fabrics');
const visitsRouter = require('./routes/visits');
const roomsRouter = require('./routes/rooms');
const windowsRouter = require('./routes/windows');

const app = express();
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/fabrics', fabricsRouter);
app.use('/api/visits', visitsRouter);
app.use('/api', roomsRouter);
app.use('/api', windowsRouter);

// Serve the built frontend as one deployable service, when present
// (local dev uses the separate Vite dev server + proxy instead).
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.use((err, req, res, next) => {
  req.log.error({ err }, 'unhandled error');
  res.status(500).json({ error: 'internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => logger.info(`server listening on :${PORT}`));
