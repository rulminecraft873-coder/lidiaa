// ============================================
// ROUTE: COMMENTS
// GET  /api/comments  -> siapa saja boleh lihat
// POST /api/comments  -> wajib login (pakai requireAuth)
// ============================================
const express = require('express');
const db = require('../database/db');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.get('/', (req, res) => {
  const comments = db.prepare(
    'SELECT id, name, message, created_at FROM comments ORDER BY created_at DESC'
  ).all();
  res.json(comments);
});

router.post('/', requireAuth, (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
  }

  const { id, name } = req.session.user;
  db.prepare('INSERT INTO comments (user_id, name, message) VALUES (?, ?, ?)').run(id, name, message);
  res.json({ success: true });
});

module.exports = router;
