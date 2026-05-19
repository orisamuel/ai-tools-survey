/**
 * utils.js — shared utilities loaded by every page
 */

// ── Theme ──────────────────────────────────────────────────

function initTheme() {
    const saved = localStorage.getItem('app-theme') ||
                  (typeof CONFIG !== 'undefined' ? CONFIG.DEFAULT_THEME : 'dark');
    document.documentElement.dataset.theme = saved;
    updateThemeToggleIcon(saved);
}

function toggleTheme() {
    const current = document.documentElement.dataset.theme || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('app-theme', next);
    updateThemeToggleIcon(next);
}

function updateThemeToggleIcon(theme) {
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ── Loading screen ─────────────────────────────────────────

function updateLoadingProgress(text) {
    const el = document.getElementById('loadingProgress');
    if (el) el.textContent = text;
}

function hideLoadingScreen(delay = 300) {
    setTimeout(() => {
        const screen  = document.getElementById('loadingScreen');
        const content = document.getElementById('mainContent');
        if (screen)  screen.classList.add('hidden');
        if (content) content.classList.add('visible');
    }, delay);
}

// ── API ────────────────────────────────────────────────────

function warmupServer() {
    if (typeof CONFIG === 'undefined' || !CONFIG.SCRIPT_URL) return;
    fetch(CONFIG.SCRIPT_URL + '?action=ping').catch(() => {});
}

async function apiCall(action, params = {}) {
    if (typeof CONFIG === 'undefined') throw new Error('CONFIG not loaded');
    if (!CONFIG.SCRIPT_URL || CONFIG.SCRIPT_URL.includes('PASTE_')) {
        throw new Error('SCRIPT_URL לא הוגדר ב-config.js');
    }
    const url = CONFIG.SCRIPT_URL + '?' + new URLSearchParams({ action, ...params });
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error('Server error: ' + res.status);
    const text = await res.text();
    try { return JSON.parse(text); }
    catch { return { success: true, raw: text }; }
}

// ── Toast notifications ────────────────────────────────────

(function initToastContainer() {
    if (typeof document === 'undefined') return;
    document.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById('toastContainer')) {
            const el = document.createElement('div');
            el.id = 'toastContainer';
            el.className = 'toast-container';
            document.body.appendChild(el);
        }
    });
})();

function showToast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ'}</span><span class="toast-msg">${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast-show'));
    setTimeout(() => {
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 350);
    }, duration);
}

// ── Auth (sessionStorage, 12h TTL) — admin only ────────────

const AUTH_KEY    = 'app_auth';
const AUTH_TTL_MS = 12 * 60 * 60 * 1000;

function getAuthSession() {
    try {
        const raw = sessionStorage.getItem(AUTH_KEY);
        if (!raw) return null;
        const s = JSON.parse(raw);
        if (!s.loggedIn || Date.now() > s.exp) {
            sessionStorage.removeItem(AUTH_KEY);
            return null;
        }
        return s;
    } catch (_) { return null; }
}

function setAuthSession(username) {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify({
        loggedIn: true,
        user: username,
        exp: Date.now() + AUTH_TTL_MS
    }));
}

function clearAuthSession() {
    sessionStorage.removeItem(AUTH_KEY);
}

function logout() {
    clearAuthSession();
    window.location.href = 'login.html';
}

function requireAuth() {
    if (!getAuthSession()) {
        sessionStorage.setItem('app_redirect', window.location.href);
        window.location.href = 'login.html';
    }
}

// ── HTML escape ────────────────────────────────────────────

function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
