const express = require('express');
const { z } = require('zod');
const db = require('../db');

const router = express.Router();

const createWindowSchema = z.object({
  label: z.string().min(1).max(100),
});

router.post('/rooms/:roomId/windows', (req, res) => {
  const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.roomId);
  if (!room) return res.status(404).json({ error: 'room not found' });

  const parsed = createWindowSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const info = db
    .prepare('INSERT INTO windows (room_id, label) VALUES (?, ?)')
    .run(room.id, parsed.data.label);
  const window_ = db.prepare('SELECT * FROM windows WHERE id = ?').get(info.lastInsertRowid);
  req.log.info({ windowId: window_.id, roomId: room.id }, 'window created');
  res.status(201).json(window_);
});

const updateWindowSchema = z.object({
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  mount_type: z.enum(['inside', 'outside']).optional(),
  fabric_id: z.number().int().positive().optional(),
  notes: z.string().max(1000).optional(),
});

router.patch('/windows/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM windows WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'window not found' });

  const parsed = updateWindowSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const merged = { ...existing, ...parsed.data };
  db.prepare(
    `UPDATE windows SET width = ?, height = ?, mount_type = ?, fabric_id = ?, notes = ? WHERE id = ?`
  ).run(merged.width, merged.height, merged.mount_type, merged.fabric_id, merged.notes, existing.id);

  const updated = db.prepare('SELECT * FROM windows WHERE id = ?').get(existing.id);
  req.log.info({ windowId: updated.id }, 'window updated');
  res.json(updated);
});

module.exports = router;
