// --- Shared across all pages ---
// Data Mockups
const doctorData = [
    { id: 1, name: "Dr. Emma Clarke", specialty: "General", experience: 10, rating: 4.8, fee: "£30", online: true },
    { id: 2, name: "Dr. James Patel", specialty: "Cardiology", experience: 15, rating: 4.9, fee: "£75", online: true },
    { id: 3, name: "Dr. Olivia Hughes", specialty: "Dermatology", experience: 8, rating: 4.7, fee: "£55", online: false },
    { id: 4, name: "Dr. Oliver Bennett", specialty: "Paediatrics", experience: 12, rating: 4.8, fee: "£50", online: true },
    { id: 5, name: "Dr. Sophie Walker", specialty: "General", experience: 6, rating: 4.6, fee: "£30", online: true },
    { id: 6, name: "Dr. Harry Thompson", specialty: "Cardiology", experience: 20, rating: 4.9, fee: "£90", online: false },
];

let appointments = loadAppointments();

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    showPendingToast();
});

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        const open = navLinks.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', open);
    });
}

function getInitials(name) {
    return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('');
}

// --- Helpers ---
function loadAppointments() {
    try {
        return JSON.parse(localStorage.getItem('appointments')) || [];
    } catch {
        return [];
    }
}

function saveAppointments() {
    try {
        localStorage.setItem('appointments', JSON.stringify(appointments));
    } catch {
        // Storage not available - appointments stay for this visit only
    }
}

function formatDate(dateStr) {
    return new Date(dateStr + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Toast Notification
function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.toggle('error', isError);
    toast.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// Show a toast on the next page (used after redirects)
function toastNextPage(msg) {
    try { sessionStorage.setItem('pendingToast', msg); } catch { /* ignore */ }
}

function showPendingToast() {
    try {
        const msg = sessionStorage.getItem('pendingToast');
        if (msg) {
            sessionStorage.removeItem('pendingToast');
            showToast(msg);
        }
    } catch { /* ignore */ }
}
