// 1. Inisialisasi Variabel Global di Paling Atas
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxye8gRI0rgICqCm71_Jr8TN6KEnpAetjCiJ_Bpl3OOP9Oo88wF5zO1EZUMWK8El21q/exec";
let currentUser = JSON.parse(localStorage.getItem('hris_user')) || null;
let activeTab = 'dashboard';

// 2. SISTEM PELUNCUR (Mencegah Layar Putih)
// Fungsi ini memastikan halaman digambar SETELAH semua file siap
window.addEventListener('DOMContentLoaded', () => {
    console.log("Sistem Memuat...");
    
    // Inisialisasi Icon Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Cek Sesi Login
    if (currentUser) {
        showDashboard(); // Pastikan fungsi ini ada di file ini atau file lain
    } else {
        renderLogin(); // Pastikan fungsi ini ada
    }
});

// 3. FUNGSI LOGIN AKTIF (Sudah Diperbaiki)
async function handleLogin(e) {
    if(e) e.preventDefault();
    
    const userEl = document.getElementById('login-username');
    const passEl = document.getElementById('login-password');
    
    if(!userEl || !passEl) return;

    const user = userEl.value;
    const pass = passEl.value;

    showToast("Mengecek kredensial...");

    try {
        const res = await fetch(`${WEB_APP_URL}?action=getUsers`);
        const users = await res.json();
        const found = users.find(u => u.username === user && u.password === pass);

        if (found) {
            currentUser = found;
            localStorage.setItem('hris_user', JSON.stringify(found));
            showToast("Login Berhasil! Memuat Dashboard...");
            setTimeout(() => location.reload(), 1000); 
        } else {
            alert("Username atau Password salah!");
        }
    } catch (err) {
        console.error(err);
        showToast("Gagal terhubung ke database.");
    }
}

// 4. FUNGSI GPS PRESENSI (Sudah Diperbaiki & Diperkuat)
async function prosesAbsen(tipe) {
    if (!navigator.geolocation) return alert("GPS tidak didukung!");

    showToast("Mengambil lokasi GPS...");
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const payload = {
            action: 'presensi',
            username: currentUser.username,
            status: tipe,
            lat: pos.coords.latitude,
            long: pos.coords.longitude,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch(WEB_APP_URL, { 
                method: 'POST', 
                body: JSON.stringify(payload) 
            });
            const result = await response.json();
            
            if(result.status === 'success') {
                showToast(`Absen ${tipe} Berhasil!`);
                if(typeof loadInitialData === 'function') loadInitialData(); // Refresh data jika ada fungsinya
            }
        } catch (e) {
            showToast("Gagal kirim data ke server.");
        }
    }, (error) => {
        showToast("Gagal mengambil lokasi. Pastikan izin GPS aktif.");
    });
}

// 5. FUNGSI NOTIFIKASI (TOAST)
function showToast(msg) {
    let container = document.getElementById('toast-container');
    
    // Jika container belum ada di HTML, buat otomatis
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = "fixed bottom-5 right-5 z-[9999] flex flex-col gap-2";
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = "bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl border border-slate-700 animate-bounce transition-all";
    toast.style.minWidth = "200px";
    toast.innerText = msg;
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// 6. FUNGSI LOGOUT
function handleLogout() {
    localStorage.removeItem('hris_user');
    location.reload();
}
