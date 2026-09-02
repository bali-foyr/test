const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const logger = require('./logger');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'measure.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS fabrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    rate REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visit_id INTEGER NOT NULL REFERENCES visits(id),
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS windows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL REFERENCES rooms(id),
    label TEXT NOT NULL,
    width REAL,
    height REAL,
    mount_type TEXT CHECK (mount_type IN ('inside', 'outside')),
    fabric_id INTEGER REFERENCES fabrics(id),
    notes TEXT
  );

  -- Unused in v1: no upload endpoint wired yet (no storage configured).
  CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    window_id INTEGER NOT NULL REFERENCES windows(id),
    file_path TEXT NOT NULL
  );
`);

const fabricCount = db.prepare('SELECT COUNT(*) AS n FROM fabrics').get().n;
if (fabricCount === 0) {
  const insert = db.prepare('INSERT INTO fabrics (name, rate) VALUES (?, ?)');
  const seed = db.transaction((rows) => rows.forEach((r) => insert.run(r.name, r.rate)));
  seed([
    { name: 'Cotton Blend', rate: 450 },
    { name: 'Linen', rate: 620 },
    { name: 'Blackout Polyester', rate: 380 },
    { name: 'Sheer Voile', rate: 290 },
    { name: 'Premium Velvet', rate: 950 },
  ]);
  logger.info('Seeded fabrics table with 5 sample rows');
}

module.exports = db;
