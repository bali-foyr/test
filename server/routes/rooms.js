const express = require('express');
const { z } = require('zod');
const db = require('../db');

const router = express.Router();

const createRoomSchema = z.object({
  name: z.string().min(1).max(100),
});

router.post('/visits/:visitId/rooms', (req, res) => {
  const visit = db.prepare('SELECT * FROM visits WHERE id = ?').get(req.params.visitId);
  if (!visit) return res.status(404).json({ error: 'visit not found' });

  const parsed = createRoomSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const info = db
    .prepare('INSERT INTO rooms (visit_id, name) VALUES (?, ?)')
    .run(visit.id, parsed.data.name);
  const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(info.lastInsertRowid);
  req.log.info({ roomId: room.id, visitId: visit.id }, 'room created');
  res.status(201).json(room);
});

module.exports = router;
