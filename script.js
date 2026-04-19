/**
 * HRIS GLOBAL - CORE SCRIPT
 * Gabungan Logika Operasional & UI
 */

// 1. KONFIGURASI & VARIABEL GLOBAL
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzRrxtKbhTk2u0OizhOLZZ_SPrZ-LiykhrrwtKWAWpiqGWLXRqbAlb7aZT75W58kKc/exec";
let currentUser = JSON.parse(localStorage.getItem('hris_user')) || null;
let activeTab = 'dashboard';

// 2. SISTEM PELUNCUR (Mencegah Layar Putih)
window.addEventListener('DOMContentLoaded', () => {
    console.log("Sistem Memuat...");
    
    // Pastikan wadah utama ada
    if (!document.getElementById('main-content')) {
        const main = document.createElement('div');
        main.id = 'main-content';
        document.body.appendChild(main);
    }

    if (currentUser) {
        showDashboard();
    } else {
        renderLogin();
    }
});

// 3. FUNGSI TAMPILAN (UI) - Mengambil kembali desain Anda
function showDashboard() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
    <div class="flex h-screen bg-slate-50">
        <aside class="w-64 bg-white border-r border-slate-200 flex flex-col">
            <div class="p-6 border-b border-slate-100">
                <h1 class="text-xl font-bold text-indigo-600">HRIS GLOBAL</h1>
            </div>
            <nav class="flex-1 p-4 space-y-2">
                <button onclick="location.reload()" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 transition">
                    <i data-lucide="layout-dashboard" class="w-5 h-5"></i> Dashboard
                </button>
                <button onclick="prosesAbsen('Masuk')" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-100 transition text-slate-600">
                    <i data-lucide="map-pin" class="w-5 h-5"></i> Absen Masuk
                </button>
                <button onclick="prosesAbsen('Pulang')" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-100 transition text-slate-600">
                    <i data-lucide="log-out" class="w-5 h-5"></i> Absen Pulang
                </button>
            </nav>
            <div class="p-4 border-t border-slate-100">
                <button onclick="handleLogout()" class="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition">
                    <i data-lucide="power" class="w-5 h-5"></i> Keluar
                </button>
            </div>
        </aside>

        <main class="flex-1 overflow-y-auto p-8">
            <header class="mb-8 flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-slate-800">Halo, ${currentUser.full_name || currentUser.username}!</h2>
                    <p class="text-slate-500 text-sm">Selamat bekerja dan jangan lupa jaga kesehatan.</p>
                </div>
                <div class="bg-indigo-50 px-4 py-2 rounded-full text-indigo-700 text-sm font-semibold">
                    ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div class="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                        <i data-lucide="check-circle" class="w-6 h-6"></i>
                    </div>
                    <p class="text-slate-500 text-sm font-medium">Status Kepegawaian</p>
                    <h3 class="text-xl font-bold text-slate-800">Aktif</h3>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                        <i data-lucide="map" class="w-6 h-6"></i>
                    </div>
                    <p class="text-slate-500 text-sm font-medium">Sistem Presensi</p>
                    <h3 class="text-xl font-bold text-slate-800">GPS Terintegrasi</h3>
                </div>
            </div>
        </main>
    </div>`;
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderLogin() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div class="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200">
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                    <i data-lucide="shield-check" class="text-white w-10 h-10"></i>
                </div>
                <h2 class="text-2xl font-bold text-slate-800">Login HRIS</h2>
                <p class="text-slate-500">Silakan masuk ke akun Anda</p>
            </div>
            <form onsubmit="handleLogin(event)" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Username</label>
                    <input type="text" id="login-username" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input type="password" id="login-password" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" required>
                </div>
                <button type="submit" class="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition duration-200">
                    Masuk Sekarang
                </button>
            </form>
        </div>
    </div>`;
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// 4. FUNGSI OPERASIONAL (Login, Absen, Toast)
async function handleLogin(e) {
    if(e) e.preventDefault();
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
            showToast("Login Berhasil!");
            setTimeout(() => location.reload(), 800);
        } else {
            alert("Username atau Password salah!");
        }
    } catch (err) {
        showToast("Gagal terhubung ke database.");
    }
}

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
            await fetch(WEB_APP_URL, { method: 'POST', body: JSON.stringify(payload) });
            showToast(`Absen ${tipe} Berhasil!`);
        } catch (e) {
            showToast("Gagal kirim data.");
        }
    }, () => {
        showToast("Gagal mengambil lokasi. Izinkan akses GPS.");
    });
}

function showToast(msg) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = "fixed bottom-5 right-5 z-[9999] flex flex-col gap-2";
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = "bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce transition-all";
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function handleLogout() {
    localStorage.removeItem('hris_user');
    location.reload();
}
