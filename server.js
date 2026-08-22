// ============================================
// SERVER (BACKEND) - Express
// Ini "otak" aplikasi: nyalain server, sambungkan
// ke database, dan hidangkan file frontend di public/
// ============================================
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comments');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3000;

// Baca body JSON & form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session login (disimpan di cookie browser + memori server)
app.use(session({
  secret: process.env.SESSION_SECRET || 'shapa-rahasia-ukk',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 hari
    httpOnly: true
  }
}));

// Hidangkan file frontend (HTML/CSS/JS statis) dari folder public/
app.use(express.static(path.join(__dirname, 'public')));

// Semua endpoint backend (API)
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/contact', contactRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server Shapa jalan di http://localhost:${PORT}`);
});
