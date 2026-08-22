// ============================================
// ROUTE: AUTHENTICATION
// /api/auth/register  -> daftar akun baru
// /api/auth/login     -> masuk, bikin session
// /api/auth/logout    -> keluar, hapus session
// ============================================
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database/db');

const router = express.Router();

// REGISTER
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nama, email, dan password wajib diisi' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password minimal 6 karakter' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(400).json({ error: 'Email sudah terdaftar, coba login' });
  }

  // Password di-hash pakai bcrypt, TIDAK PERNAH disimpan dalam bentuk asli
  const hashed = bcrypt.hashSync(password, 10);
  const info = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashed);

  req.session.user = { id: info.lastInsertRowid, name };
  res.json({ success: true, user: { id: info.lastInsertRowid, name } });
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Email atau password salah' });
  }

  req.session.user = { id: user.id, name: user.name };
  res.json({ success: true, user: { id: user.id, name: user.name } });
});

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

// CEK SESI (dipanggil di setiap halaman buat tau status login)
router.get('/me', (req, res) => {
  if (req.session.user) {
    return res.json({ loggedIn: true, user: req.session.user });
  }
  res.json({ loggedIn: false });
});

module.exports = router;
