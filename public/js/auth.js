// ============================================
// AUTH.JS — komunikasi frontend ke backend (/api/auth/*)
// Dipakai di semua halaman buat cek status login,
// dan di login.html/register.html buat proses masuk/daftar
// ============================================

// Cek status login, lalu update tampilan navbar
async function checkAuthStatus(){
  try{
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    const navUser = document.getElementById('navUser');
    if(!navUser) return data;

    if(data.loggedIn){
      navUser.innerHTML = `<span class="nav-user">Hai, ${data.user.name}</span> <a href="#" onclick="handleLogout(event)" style="color:#f0a8d8;font-size:0.82rem;font-weight:700;text-decoration:none;">Keluar</a>`;
    } else {
      navUser.innerHTML = `<a href="login.html" style="color:#f0a8d8;font-size:0.82rem;font-weight:700;text-decoration:none;">Masuk</a>`;
    }
    return data;
  }catch(err){
    console.error('Gagal cek status login', err);
    return { loggedIn:false };
  }
}

async function handleLogout(e){
  if(e) e.preventDefault();
  await fetch('/api/auth/logout', { method:'POST' });
  window.location.href = 'index.html';
}

async function handleLogin(e){
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorBox = document.getElementById('authError');

  try{
    const res = await fetch('/api/auth/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if(!res.ok){
      errorBox.textContent = data.error || 'Gagal login';
      errorBox.classList.add('show');
      return;
    }
    window.location.href = 'index.html';
  }catch(err){
    errorBox.textContent = 'Tidak bisa menghubungi server';
    errorBox.classList.add('show');
  }
}

async function handleRegister(e){
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const errorBox = document.getElementById('authError');

  try{
    const res = await fetch('/api/auth/register', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if(!res.ok){
      errorBox.textContent = data.error || 'Gagal mendaftar';
      errorBox.classList.add('show');
      return;
    }
    window.location.href = 'index.html';
  }catch(err){
    errorBox.textContent = 'Tidak bisa menghubungi server';
    errorBox.classList.add('show');
  }
}

document.addEventListener('DOMContentLoaded', checkAuthStatus);
