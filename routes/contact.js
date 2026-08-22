// ============================================
// ROUTE: CONTACT
// POST /api/contact -> simpan pesan dari form "Hubungi Saya"
// ============================================
const express = require('express');
const db = require('../database/db');

const router = express.Router();

router.post('/', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Nama, email, dan pesan wajib diisi' });
  }

  db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)').run(name, email, message);
  res.json({ success: true });
});

module.exports = router;
