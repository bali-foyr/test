const express = require('express');
const { z } = require('zod');
const db = require('../db');
const { priceWindow } = require('../pricing');

const router = express.Router();

const createVisitSchema = z.object({
  label: z.string().min(1).max(200),
});

router.post('/', (req, res) => {
  const parsed = createVisitSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { label } = parsed.data;
  const info = db.prepare('INSERT INTO visits (label) VALUES (?)').run(label);
  const visit = db.prepare('SELECT * FROM visits WHERE id = ?').get(info.lastInsertRowid);
  req.log.info({ visitId: visit.id }, 'visit created');
  res.status(201).json(visit);
});

function loadVisitTree(visitId) {
  const visit = db.prepare('SELECT * FROM visits WHERE id = ?').get(visitId);
  if (!visit) return null;
  const rooms = db.prepare('SELECT * FROM rooms WHERE visit_id = ? ORDER BY id').all(visitId);
  const windowStmt = db.prepare('SELECT * FROM windows WHERE room_id = ? ORDER BY id');
  const roomsWithWindows = rooms.map((room) => ({
    ...room,
    windows: windowStmt.all(room.id),
  }));
  return { ...visit, rooms: roomsWithWindows };
}

router.get('/:id', (req, res) => {
  const tree = loadVisitTree(req.params.id);
  if (!tree) return res.status(404).json({ error: 'visit not found' });
  res.json(tree);
});

router.get('/:id/summary', (req, res) => {
  const tree = loadVisitTree(req.params.id);
  if (!tree) return res.status(404).json({ error: 'visit not found' });

  const fabricsById = new Map(db.prepare('SELECT * FROM fabrics').all().map((f) => [f.id, f]));
  let runningTotal = 0;

  const rooms = tree.rooms.map((room) => ({
    ...room,
    windows: room.windows.map((w) => {
      const fabric = fabricsById.get(w.fabric_id);
      const price = priceWindow(w, fabric);
      runningTotal += price;
      return { ...w, fabric_name: fabric?.name ?? null, price };
    }),
  }));

  res.json({ ...tree, rooms, runningTotal: Math.round(runningTotal * 100) / 100 });
});

module.exports = router;
