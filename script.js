const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxye8gRI0rgICqCm71_Jr8TN6KEnpAetjCiJ_Bpl3OOP9Oo88wF5zO1EZUMWK8El21q/exec";
let currentUser = JSON.parse(localStorage.getItem('hris_user')) || null;

// --- FUNGSI LOGIN AKTIF ---
async function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('login-username').value;
    const pass = document.getElementById('login-password').value;

    showToast("Mengecek kredensial...");

    try {
        const res = await fetch(`${WEB_APP_URL}?action=getUsers`);
        const users = await res.json();
        const found = users.find(u => u.username === user && u.password === pass);

        if (found) {
            currentUser = found;
            localStorage.setItem('hris_user', JSON.stringify(found));
            location.reload(); // Refresh untuk masuk ke dashboard
        } else {
            alert("Username atau Password salah!");
        }
    } catch (err) {
        showToast("Gagal terhubung ke database.");
    }
}

// --- FUNGSI GPS (PRESENSI) ---
async function prosesAbsen(tipe) {
    if (!navigator.geolocation) return alert("GPS tidak didukung!");

    showToast("Mengambil lokasi...");
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const payload = {
            action: 'presensi',
            username: currentUser.username,
            status: tipe,
            lat: pos.coords.latitude,
            long: pos.coords.longitude
        };

        try {
            await fetch(WEB_APP_URL, { method: 'POST', body: JSON.stringify(payload) });
            showToast(`Absen ${tipe} Berhasil!`);
        } catch (e) {
            showToast("Gagal kirim data.");
        }
    });
}

// --- FUNGSI NOTIFIKASI (TOAST) ---
function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = "bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg mb-2 animate-bounce";
    toast.innerText = msg;
    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}