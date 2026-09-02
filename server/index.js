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

app.use((err, req, res, next) => {
  req.log.error({ err }, 'unhandled error');
  res.status(500).json({ error: 'internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => logger.info(`server listening on :${PORT}`));
