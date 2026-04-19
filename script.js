/**
 * HRIS GLOBAL - CORE SCRIPT (REWRITTEN)
 * Memperbaiki masalah Login & Sinkronisasi Data
 */

// 1. KONFIGURASI
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzRrxtKbhTk2u0OizhOLZZ_SPrZ-LiykhrrwtKWAWpiqGWLXRqbAlb7aZT75W58kKc/exec";
let currentUser = JSON.parse(localStorage.getItem('hris_user')) || null;

// 2. SISTEM PELUNCUR
window.addEventListener('DOMContentLoaded', () => {
    console.log("Sistem HRIS Memuat...");
    
    if (!document.getElementById('main-content')) {
        const main = document.createElement('div');
        main.id = 'main-content';
        document.body.appendChild(main);
    }

    // Cek apakah sudah login atau belum
    if (currentUser) {
        showDashboard();
    } else {
        renderLogin();
    }
});

// 3. FUNGSI LOGIN (DIPERBAIKI)
async function handleLogin(e) {
    if (e) e.preventDefault();
    
    const userVal = document.getElementById('login-username').value.trim();
    const passVal = document.getElementById('login-password').value.trim();

    showToast("Menghubungkan ke database...");

    try {
        // Menambahkan mode cors dan redirect follow agar tidak error JSON
        const res = await fetch(`${WEB_APP_URL}?action=getUsers`, {
            method: "GET",
            redirect: "follow" 
        });
        
        const users = await res.json();
        
        // Cari user dengan pembersihan karakter spasi
        const found = users.find(u => 
            String(u.username).toLowerCase().trim() === userVal.toLowerCase() && 
            String(u.password).trim() === passVal
        );

        if (found) {
            currentUser = found;
            localStorage.setItem('hris_user', JSON.stringify(found));
            showToast("Login Berhasil!");
            setTimeout(() => location.reload(), 800);
        } else {
            alert("Username atau Password salah! Cek kembali penulisan Anda.");
        }
    } catch (err) {
        console.error("Login Error:", err);
        showToast("Error: Respon server tidak valid (Cek Deployment).");
    }
}

// 4. FUNGSI TAMPILAN DASHBOARD
function showDashboard() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
    <div class="flex h-screen bg-slate-50 font-jakarta">
        <aside class="w-64 bg-white border-r border-slate-200 flex flex-col">
            <div class="p-6 border-b border-slate-100">
                <h1 class="text-xl font-bold text-indigo-600">HRIS GLOBAL</h1>
            </div>
            <nav class="flex-1 p-4 space-y-2">
                <button onclick="location.reload()" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-indigo-600 text-white shadow-lg transition">
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
                    <p class="text-slate-500 text-sm">Selamat bekerja di sistem HRIS.</p>
                </div>
                <div class="bg-indigo-50 px-4 py-2 rounded-full text-indigo-700 text-xs font-bold">
                    ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div class="p-3 bg-green-100 text-green-600 rounded-xl"><i data-lucide="user-check"></i></div>
                    <div>
                        <p class="text-slate-500 text-xs">Status Karyawan</p>
                        <h3 class="text-lg font-bold">Aktif</h3>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div class="p-3 bg-blue-100 text-blue-600 rounded-xl"><i data-lucide="navigation"></i></div>
                    <div>
                        <p class="text-slate-500 text-xs">Lokasi Presensi</p>
                        <h3 class="text-lg font-bold">GPS Aktif</h3>
                    </div>
                </div>
            </div>
        </main>
    </div>`;
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// 5. FUNGSI TAMPILAN LOGIN
function renderLogin() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-slate-100 p-6 font-jakarta">
        <div class="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                    <i data-lucide="lock" class="text-white w-8 h-8"></i>
                </div>
                <h2 class="text-2xl font-bold text-slate-800">HRIS Global</h2>
                <p class="text-slate-500 text-sm">Masukkan kredensial Anda</p>
            </div>
            <form onsubmit="handleLogin(event)" class="space-y-4">
                <input type="text" id="login-username" placeholder="Username" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition" required>
                <input type="password" id="login-password" placeholder="Password" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition" required>
                <button type="submit" class="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition">
                    Masuk
                </button>
            </form>
        </div>
    </div>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// 6. FUNGSI GPS & LOGOUT
async function prosesAbsen(tipe) {
    if (!navigator.geolocation) return alert("GPS tidak didukung!");
    showToast("Mengunci lokasi...");
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const payload = {
            action: 'presensi',
            username: currentUser.username,
            status: tipe,
            lat: pos.coords.latitude,
            long: pos.coords.longitude
        };

        try {
            await fetch(WEB_APP_URL, { 
                method: 'POST', 
                body: JSON.stringify(payload),
                redirect: "follow"
            });
            showToast(`Absen ${tipe} Berhasil!`);
        } catch (e) {
            showToast("Gagal mengirim data presensi.");
        }
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
    toast.className = "bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg animate-pulse";
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function handleLogout() {
    localStorage.removeItem('hris_user');
    location.reload();
}
