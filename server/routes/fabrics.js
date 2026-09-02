const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const fabrics = db.prepare('SELECT * FROM fabrics ORDER BY id').all();
  res.json(fabrics);
});

module.exports = router;
