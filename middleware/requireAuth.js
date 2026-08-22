// ============================================
// MIDDLEWARE AUTH
// Menahan request yang belum login sebelum
// masuk ke route yang butuh login (mis. posting komentar)
// ============================================
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ error: 'Kamu harus login dulu untuk melakukan ini' });
}

module.exports = requireAuth;
