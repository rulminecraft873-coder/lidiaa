// ============================================
// MAIN.JS — logic halaman (frontend)
// Komentar & form kontak di sini manggil endpoint
// backend beneran (server.js), bukan cuma simulasi.
// ============================================

function toggleMenu(){
  document.getElementById('mobileMenu').classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
  const avatarWrap = document.getElementById('avatarWrap');
  if (avatarWrap && typeof avatarPhoto !== 'undefined' && avatarPhoto) {
    avatarWrap.innerHTML = `<img src="${avatarPhoto}" alt="Foto profil">`;
  }

  const grid = document.getElementById('galleryGrid');
  const emptyState = document.getElementById('galleryEmpty');
  if (grid && typeof galleryPhotos !== 'undefined') {
    if (galleryPhotos.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
    } else {
      if (emptyState) emptyState.style.display = 'none';
      galleryPhotos.forEach(url => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `<img src="${url}" alt="Foto galeri" loading="lazy">`;
        item.onclick = () => openLightbox(url);
        grid.appendChild(item);
      });
    }
  }

  if (document.getElementById('commentList')) {
    loadComments();
  }
});

function openLightbox(url){
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  if (!lb || !img) return;
  img.src = url;
  lb.classList.add('open');
}
function closeLightbox(){
  document.getElementById('lightbox')?.classList.remove('open');
}

function switchTab(name){
  ['projects','certs','stack'].forEach(t=>{
    document.getElementById('tab-'+t)?.classList.toggle('active', t===name);
    document.getElementById('panel-'+t)?.classList.toggle('active', t===name);
  });
}

function showToast(msg){
  const t=document.getElementById('toast');
  if(!t) return;
  t.textContent=msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2400);
}

// ---------- form kontak -> POST /api/contact (simpan ke database) ----------
async function sendMessage(e){
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('[name=name]').value.trim();
  const email = form.querySelector('[name=email]').value.trim();
  const message = form.querySelector('[name=message]').value.trim();

  try{
    const res = await fetch('/api/contact', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, message })
    });
    const data = await res.json();
    if(!res.ok){
      showToast(data.error || 'Gagal mengirim pesan');
      return;
    }
    form.reset();
    showToast('Pesan terkirim! Terima kasih ✨');
  }catch(err){
    showToast('Tidak bisa menghubungi server');
  }
}

// ---------- komentar -> GET/POST /api/comments (database asli) ----------
async function loadComments(){
  try{
    const res = await fetch('/api/comments');
    const comments = await res.json();
    renderComments(comments);
  }catch(err){
    console.error('Gagal memuat komentar', err);
  }
}

function renderComments(comments){
  const list = document.getElementById('commentList');
  const emptyState = document.getElementById('emptyState');
  const countEl = document.getElementById('commentCount');
  if (countEl) countEl.textContent = `(${comments.length})`;

  if (comments.length === 0){
    if (emptyState) emptyState.style.display = 'block';
    list.innerHTML = '';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';

  list.innerHTML = comments.map(c => `
    <div class="comment-item">
      <div class="comment-name">${escapeHtml(c.name)}</div>
      <div class="comment-msg">${escapeHtml(c.message)}</div>
      <div class="comment-time">${new Date(c.created_at).toLocaleString('id-ID')}</div>
    </div>
  `).join('');
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function postComment(){
  const msgEl = document.getElementById('cMsg');
  const message = msgEl.value.trim();
  if(!message){ showToast('Tulis komentar dulu ya'); return; }

  const status = await checkAuthStatus();
  if(!status.loggedIn){
    showToast('Login dulu untuk berkomentar');
    setTimeout(() => window.location.href = 'login.html', 900);
    return;
  }

  try{
    const res = await fetch('/api/comments', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    if(!res.ok){
      showToast(data.error || 'Gagal mengirim komentar');
      return;
    }
    msgEl.value='';
    showToast('Komentar ditambahkan');
    loadComments();
  }catch(err){
    showToast('Tidak bisa menghubungi server');
  }
}
