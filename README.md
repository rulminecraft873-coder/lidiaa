# Shapa — Website Portfolio Fullstack (UKK TKJ)

Website portfolio pribadi dengan backend dan database **beneran jalan** (bukan simulasi) — dibuat buat kebutuhan Uji Kompetensi Keahlian (UKK) jurusan TKJ.

---

## 1. Arsitektur — "Fullstack-nya Dimana?"

Ini bagian paling penting buat dijelasin ke penguji. Aplikasi ini dibagi 3 lapisan:

```
┌─────────────────────┐        ┌──────────────────────┐        ┌────────────────────┐
│      FRONTEND        │        │       BACKEND         │        │      DATABASE        │
│   (folder /public)   │  HTTP  │      (server.js +      │  SQL   │     (SQLite —        │
│  HTML, CSS, JS murni  │ ─────▶ │      /routes/*.js)     │ ─────▶ │   file shapa.db)     │
│  Tampilan yg dilihat  │ ◀───── │  Express.js: nerima     │ ◀───── │  Nyimpen data        │
│  & dijalankan browser │  JSON  │  request, proses logic  │  data  │  users, comments,    │
└─────────────────────┘        └──────────────────────┘        │  messages            │
                                                                  └────────────────────┘
```

| Lapisan | Lokasi file | Tugasnya |
|---|---|---|
| **Frontend** | `public/index.html`, `public/login.html`, `public/register.html`, `public/gallery.html`, `public/css/style.css`, `public/js/*.js` | Tampilan yang dilihat pengunjung. Semua tombol & form di sini cuma manggil API lewat `fetch()`, tidak pernah nyimpen data sendiri. |
| **Backend** | `server.js`, `routes/auth.js`, `routes/comments.js`, `routes/contact.js`, `middleware/requireAuth.js` | Otak aplikasi. Nerima request dari frontend, cek validasi & login, lalu baca/tulis ke database. |
| **Database** | `database/db.js` + file `database/shapa.db` (otomatis dibuat) | Nyimpen data secara permanen pakai SQLite: tabel `users`, `comments`, `messages`. |

**Alur contoh (paling gampang dijelasin pas ujian):** saat pengunjung ngisi form "Hubungi Saya" dan klik kirim →
1. **Frontend** (`main.js`) kirim data lewat `fetch('/api/contact', ...)`
2. **Backend** (`routes/contact.js`) nerima, validasi field kosong atau enggak
3. **Database** (`db.js`) nyimpen baris baru ke tabel `messages`
4. Backend balas `{ success: true }` → **Frontend** nampilin notifikasi "Pesan terkirim"

Alur yang sama berlaku untuk **login** (cek password ter-hash di tabel `users`) dan **komentar** (cuma bisa dikirim kalau session login aktif, hasilnya kesimpan di tabel `comments`).

---

## 2. Struktur folder

```
shapa/
├── server.js              ← entry point, nyalain server Express
├── package.json           ← daftar dependency
├── .env.example           ← contoh konfigurasi (salin jadi .env)
├── database/
│   └── db.js               ← koneksi + skema tabel SQLite
├── middleware/
│   └── requireAuth.js      ← penjaga: nolak request kalau belum login
├── routes/
│   ├── auth.js              ← /api/auth/register, /login, /logout, /me
│   ├── comments.js          ← /api/comments (GET & POST)
│   └── contact.js           ← /api/contact (POST)
└── public/                 ← FRONTEND (disajikan otomatis oleh Express)
    ├── index.html
    ├── login.html
    ├── register.html
    ├── gallery.html
    ├── css/style.css
    └── js/
        ├── photos.js         ← tempat paste link foto
        ├── auth.js           ← logic login/register di sisi browser
        └── main.js           ← logic tab, form, komentar, galeri
```

---

## 3. Cara menjalankan di komputer sendiri

Butuh **Node.js** (versi 18 ke atas) sudah terpasang.

```bash
# 1. Masuk ke folder project
cd shapa

# 2. Install semua dependency (express, better-sqlite3, dll)
npm install

# 3. (opsional) salin file environment
cp .env.example .env

# 4. Jalankan server
npm start
```

Buka browser ke **http://localhost:3000** — database `shapa.db` akan otomatis dibuat sendiri saat server pertama kali jalan.

---

## 4. Daftar endpoint API (buat dijelasin ke penguji)

| Method | Endpoint | Fungsi | Perlu login? |
|---|---|---|---|
| POST | `/api/auth/register` | Daftar akun baru (password di-hash bcrypt) | Tidak |
| POST | `/api/auth/login` | Login, bikin session | Tidak |
| POST | `/api/auth/logout` | Logout, hapus session | Ya |
| GET | `/api/auth/me` | Cek status login saat ini | Tidak |
| GET | `/api/comments` | Ambil semua komentar dari database | Tidak |
| POST | `/api/comments` | Kirim komentar baru | **Ya** |
| POST | `/api/contact` | Simpan pesan dari form kontak | Tidak |

---

## 5. Skema database

```sql
users     (id, name, email UNIQUE, password [hash], created_at)
comments  (id, user_id → users.id, name, message, created_at)
messages  (id, name, email, message, created_at)
```

Password **tidak pernah** disimpan dalam bentuk asli — selalu di-hash pakai `bcryptjs` sebelum masuk database.

---

## 6. Foto profil & galeri

Buka `public/js/photos.js`, isi link foto di sana:
```js
const avatarPhoto = "https://link-foto-profil.jpg";
const galleryPhotos = ["https://link-foto-1.jpg", "https://link-foto-2.jpg"];
```
Tidak perlu upload file — cukup paste link, otomatis muncul di halaman utama dan `gallery.html`.

---

## 7. Deploy online (opsional, misal ke Railway)

1. Push folder ini ke repo GitHub
2. Buat project baru di Railway, hubungkan ke repo tersebut
3. Railway otomatis mendeteksi `package.json` dan menjalankan `npm start`
4. Tambahkan environment variable `SESSION_SECRET` di pengaturan Railway (isi bebas, teks rahasia)

---

## 8. Poin yang bisa disebut pas presentasi UKK

- **Frontend**: HTML/CSS/JS murni, tanpa framework — gampang dijelasin per elemen
- **Backend**: Node.js + Express.js — menangani routing, validasi, dan autentikasi
- **Database**: SQLite (`better-sqlite3`) — database relasional asli dengan SQL, bukan file JSON biasa
- **Keamanan**: password di-hash (bcrypt), session login (`express-session`), route komentar dilindungi middleware `requireAuth`
- Ini artinya website ini **fullstack** karena ketiga lapisan (tampilan, logika server, penyimpanan data) benar-benar terpisah dan saling berkomunikasi lewat API — bukan cuma HTML statis.
