/**
 * HRIS GLOBAL - ULTIMATE CORE SCRIPT
 * Mendukung: Absensi GPS, Daily Task, Payroll PPh21, Cuti, Aset, KPI & Rekrutmen.
 */

// 1. KONFIGURASI
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz_c6lMPZJhZIJpiKEeJuUJKN4SQb9Gz--XUPaqjzzINuY2VczYJ3sTb_uIrlVtXENd/exec";
let currentUser = JSON.parse(localStorage.getItem('hris_user')) || null;

// 2. SISTEM PELUNCUR
window.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        renderMainShell();
        showDashboard(); // Halaman default setelah login
    } else {
        renderLogin();
    }
});

// 3. UI SHELL (Sidebar & Header)
function renderMainShell() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
    <div class="flex h-screen bg-slate-50 font-jakarta">
        <aside class="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
            <div class="p-6 border-b border-slate-100">
                <h1 class="text-xl font-bold text-indigo-600 flex items-center gap-2">
                    <i data-lucide="shield-check"></i> HRIS GLOBAL
                </h1>
            </div>
            <nav class="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                ${renderNavButton('Dashboard', 'layout-dashboard', 'showDashboard()', true)}
                ${renderNavButton('Presensi GPS', 'map-pin', 'showAbsensi()')}
                ${renderNavButton('Daily Task', 'clipboard-list', 'showDailyTask()')}
                ${renderNavButton('Payroll & PPh21', 'banknote', 'showPayroll()')}
                ${renderNavButton('Pengajuan Cuti', 'calendar-days', 'showCuti()')}
                ${renderNavButton('Aset Kantor', 'package', 'showAset()')}
                ${renderNavButton('Evaluasi KPI', 'bar-chart-3', 'showKPI()')}
                ${renderNavButton('Rekrutmen', 'user-plus', 'showRecruitment()')}
            </nav>
            <div class="p-4 border-t border-slate-100">
                <div class="flex items-center gap-3 px-4 py-3 mb-2 bg-slate-50 rounded-xl">
                    <div class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs">
                        ${currentUser.username.substring(0,2).toUpperCase()}
                    </div>
                    <div class="overflow-hidden">
                        <p class="text-xs font-bold text-slate-800 truncate">${currentUser.full_name || currentUser.username}</p>
                        <p class="text-[10px] text-slate-500 capitalize">${currentUser.role || 'Staff'}</p>
                    </div>
                </div>
                <button onclick="handleLogout()" class="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium">
                    <i data-lucide="power" class="w-4 h-4"></i> Keluar Sistem
                </button>
            </div>
        </aside>

        <main id="content-area" class="flex-1 overflow-y-auto p-8 bg-slate-50">
            </main>
    </div>`;
    lucide.createIcons();
    
    // Set dashboard as active on first load
    const firstBtn = document.querySelector('.nav-link');
    if(firstBtn) setActiveNav(firstBtn);
}

function renderNavButton(label, icon, func) {
    return `
    <button onclick="${func}; setActiveNav(this)" class="nav-link flex items-center gap-3 w-full px-4 py-3 rounded-xl transition text-sm font-medium text-slate-600 hover:bg-slate-100">
        <i data-lucide="${icon}" class="w-5 h-5"></i> ${label}
    </button>`;
}

function setActiveNav(el) {
    // Reset semua tombol ke state normal
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white', 'shadow-md');
        btn.classList.add('text-slate-600', 'hover:bg-slate-100');
    });
    // Aktifkan tombol yang diklik
    el.classList.add('bg-indigo-600', 'text-white', 'shadow-md');
    el.classList.remove('text-slate-600', 'hover:bg-slate-100');
}

// --- 4. MODUL-MODUL FITUR ---

// A. DASHBOARD
function showDashboard() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
    <div class="space-y-8 animate-in fade-in duration-500">
        <header>
            <h2 class="text-2xl font-bold text-slate-800">Selamat Datang, ${currentUser.full_name || currentUser.username}!</h2>
            <p class="text-slate-500">Berikut adalah ringkasan aktivitas HR Anda hari ini.</p>
        </header>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p class="text-slate-400 text-xs font-bold uppercase tracking-wider">Status Absensi</p>
                <h3 class="text-2xl font-bold text-green-600 mt-1">Sudah Masuk</h3>
            </div>
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p class="text-slate-400 text-xs font-bold uppercase tracking-wider">Tugas Hari Ini</p>
                <h3 class="text-2xl font-bold text-indigo-600 mt-1">4 Selesai</h3>
            </div>
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p class="text-slate-400 text-xs font-bold uppercase tracking-wider">Sisa Cuti</p>
                <h3 class="text-2xl font-bold text-orange-500 mt-1">12 Hari</h3>
            </div>
        </div>
    </div>`;
}

// B. DAILY TASK
function showDailyTask() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
    <div class="max-w-2xl animate-in slide-in-from-bottom-4 duration-500">
        <div class="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200">
            <h2 class="text-xl font-bold mb-6 text-slate-800">Laporan Daily Task</h2>
            <form onsubmit="handleSaveTask(event)" class="space-y-5">
                <div>
                    <label class="text-xs font-bold text-slate-500 mb-2 block">NAMA TUGAS</label>
                    <input type="text" id="task-name" class="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Misal: Input data stok barang" required>
                </div>
                <div>
                    <label class="text-xs font-bold text-slate-500 mb-2 block">DETAIL PEKERJAAN</label>
                    <textarea id="task-detail" rows="4" class="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Jelaskan progres Anda..." required></textarea>
                </div>
                <button type="submit" id="btn-task" class="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                    Kirim Laporan Harian
                </button>
            </form>
        </div>
    </div>`;
}

async function handleSaveTask(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-task');
    const payload = {
        action: 'saveTask',
        username: currentUser.username,
        task_name: document.getElementById('task-name').value,
        detail: document.getElementById('task-detail').value
    };

    btn.disabled = true;
    btn.innerText = "Mengirim...";

    try {
        await fetch(WEB_APP_URL, { method: 'POST', body: JSON.stringify(payload), redirect: 'follow' });
        showToast("Tugas berhasil disimpan!");
        showDailyTask();
    } catch (e) {
        showToast("Gagal menyimpan tugas.");
        btn.disabled = false;
        btn.innerText = "Kirim Laporan Harian";
    }
}

// C. ABSENSI GPS
function showAbsensi() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
    <div class="max-w-md mx-auto text-center space-y-6 animate-in zoom-in duration-500">
        <div class="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200">
            <div class="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <i data-lucide="map-pin" class="w-10 h-10"></i>
            </div>
            <h2 class="text-2xl font-bold text-slate-800">Presensi Kehadiran</h2>
            <p class="text-slate-500 text-sm mb-8">Pastikan GPS Anda aktif untuk mencatat lokasi secara akurat.</p>
            <div class="grid grid-cols-1 gap-4">
                <button onclick="prosesAbsen('Masuk')" class="flex items-center justify-center gap-3 p-5 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100">
                    <i data-lucide="check-circle"></i> Absen Masuk
                </button>
                <button onclick="prosesAbsen('Pulang')" class="flex items-center justify-center gap-3 p-5 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition shadow-lg shadow-slate-200">
                    <i data-lucide="log-out"></i> Absen Pulang
                </button>
            </div>
        </div>
    </div>`;
    lucide.createIcons();
}

async function prosesAbsen(tipe) {
    if (!navigator.geolocation) return alert("GPS mati!");
    showToast(`Mengunci lokasi untuk absen ${tipe}...`);
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const payload = {
            action: 'presensi',
            username: currentUser.username,
            status: tipe,
            lat: pos.coords.latitude,
            long: pos.coords.longitude
        };

        try {
            await fetch(WEB_APP_URL, { method: 'POST', body: JSON.stringify(payload), redirect: "follow" });
            showToast(`Berhasil! Absen ${tipe} tercatat.`);
        } catch (e) {
            showToast("Error mengirim data.");
        }
    }, (err) => {
        alert("Gagal mendapatkan lokasi. Pastikan izin GPS diberikan.");
    });
}

// D. PAYROLL & PPh21
async function showPayroll() {
    const area = document.getElementById('content-area');
    area.innerHTML = `<div class="flex items-center justify-center h-64"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>`;
    
    try {
        const res = await fetch(`${WEB_APP_URL}?action=getPayroll`, { redirect: 'follow' });
        const data = await res.json();
        const myPayroll = data.filter(p => p.username === currentUser.username);

        let rows = myPayroll.map(p => `
            <tr class="border-b border-slate-50 hover:bg-slate-50 transition">
                <td class="p-4 text-sm font-medium">${p.bulan}</td>
                <td class="p-4 text-sm">Rp ${Number(p.gaji_pokok).toLocaleString()}</td>
                <td class="p-4 text-sm text-red-500">- Rp ${Number(p.pph21).toLocaleString()}</td>
                <td class="p-4 text-sm font-bold text-indigo-600">Rp ${Number(p.gaji_bersih).toLocaleString()}</td>
            </tr>
        `).join('');

        area.innerHTML = `
        <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 class="text-xl font-bold text-slate-800">Slip Gaji Digital</h2>
                <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">Aktif</span>
            </div>
            <table class="w-full text-left">
                <thead class="bg-slate-50">
                    <tr>
                        <th class="p-4 text-xs font-bold text-slate-400">PERIODE</th>
                        <th class="p-4 text-xs font-bold text-slate-400">GAJI POKOK</th>
                        <th class="p-4 text-xs font-bold text-slate-400">PPH21 (POT)</th>
                        <th class="p-4 text-xs font-bold text-slate-400">TOTAL BERSIH</th>
                    </tr>
                </thead>
                <tbody>${rows || '<tr><td colspan="4" class="text-center p-8 text-slate-400">Belum ada data slip gaji.</td></tr>'}</tbody>
            </table>
        </div>`;
    } catch (e) {
        area.innerHTML = `<p class="text-red-500">Gagal memuat data payroll.</p>`;
    }
}

// --- FUNGSI PENAMPUNG (UNTUK MENU YANG BELUM DIBUAT) ---
function showCuti() {
    document.getElementById('content-area').innerHTML = `
    <div class="bg-white p-12 rounded-[40px] border border-slate-200 text-center">
        <div class="w-20 h-20 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <i data-lucide="calendar-days" class="w-10 h-10"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-800">Pengajuan Cuti</h2>
        <p class="text-slate-500 mt-2">Modul ini sedang dalam tahap pengembangan.</p>
    </div>`;
    lucide.createIcons();
}

function showAset() {
    document.getElementById('content-area').innerHTML = `
    <div class="bg-white p-12 rounded-[40px] border border-slate-200 text-center">
        <div class="w-20 h-20 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <i data-lucide="package" class="w-10 h-10"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-800">Aset Kantor</h2>
        <p class="text-slate-500 mt-2">Modul inventaris aset akan segera tersedia.</p>
    </div>`;
    lucide.createIcons();
}

function showKPI() {
    document.getElementById('content-area').innerHTML = `
    <div class="bg-white p-12 rounded-[40px] border border-slate-200 text-center">
        <div class="w-20 h-20 bg-purple-50 text-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <i data-lucide="bar-chart-3" class="w-10 h-10"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-800">Evaluasi KPI</h2>
        <p class="text-slate-500 mt-2">Modul penilaian kinerja sedang disiapkan.</p>
    </div>`;
    lucide.createIcons();
}

function showRecruitment() {
    document.getElementById('content-area').innerHTML = `
    <div class="bg-white p-12 rounded-[40px] border border-slate-200 text-center">
        <div class="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <i data-lucide="user-plus" class="w-10 h-10"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-800">Rekrutmen</h2>
        <p class="text-slate-500 mt-2">Sistem manajemen kandidat segera hadir.</p>
    </div>`;
    lucide.createIcons();
}

// --- 5. LOGIKA SISTEM (LOGIN, GPS, TOAST) ---

async function handleLogin(e) {
    if (e) e.preventDefault();
    const userVal = document.getElementById('login-username').value.trim();
    const passVal = document.getElementById('login-password').value.trim();
    const btn = e.target.querySelector('button');

    btn.disabled = true;
    btn.innerHTML = `<span class="flex items-center gap-2 justify-center"><div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Autentikasi...</span>`;

    try {
        const res = await fetch(`${WEB_APP_URL}?action=getUsers`, { method: "GET", redirect: "follow" });
        const users = await res.json();
        const found = users.find(u => String(u.username).toLowerCase() === userVal.toLowerCase() && String(u.password) === passVal);

        if (found) {
            localStorage.setItem('hris_user', JSON.stringify(found));
            location.reload();
        } else {
            alert("Login Gagal! Akun tidak ditemukan.");
            btn.disabled = false;
            btn.innerText = "Masuk Sekarang";
        }
    } catch (err) {
        alert("Gagal terhubung ke database. Cek internet Anda.");
        btn.disabled = false;
        btn.innerText = "Masuk Sekarang";
    }
}

function showToast(msg) {
    let container = document.getElementById('toast-box');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-box';
        container.className = "fixed bottom-5 right-5 z-[999] space-y-2";
        document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.className = "bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl text-sm font-bold animate-bounce";
    t.innerText = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 4000);
}

function renderLogin() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-slate-100 p-6 font-jakarta">
        <div class="bg-white p-10 rounded-[48px] shadow-2xl w-full max-w-md border border-white text-center">
            <div class="text-center mb-10">
                <div class="w-20 h-20 bg-indigo-600 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
                    <i data-lucide="fingerprint" class="text-white w-10 h-10"></i>
                </div>
                <h2 class="text-3xl font-black text-slate-800">HRIS Global</h2>
                <p class="text-slate-400 mt-2 font-medium">Sistem Informasi Karyawan</p>
            </div>
            <form onsubmit="handleLogin(event)" class="space-y-5">
                <input type="text" id="login-username" placeholder="Username" class="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition text-left" required>
                <input type="password" id="login-password" placeholder="Password" class="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition text-left" required>
                <button type="submit" class="w-full bg-indigo-600 text-white py-5 rounded-3xl font-bold text-lg hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-indigo-100">
                    Masuk Sekarang
                </button>
            </form>
        </div>
    </div>`;
    lucide.createIcons();
}

function handleLogout() {
    localStorage.removeItem('hris_user');
    location.reload();
}
