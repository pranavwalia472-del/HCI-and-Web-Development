// --- Data Mockups ---
const doctorData = [
    { id: 1, name: "Dr. Anita Shrestha", specialty: "General", experience: 10, rating: 4.8, fee: "Rs. 500", online: true },
    { id: 2, name: "Dr. Rajesh Thapa", specialty: "Cardiology", experience: 15, rating: 4.9, fee: "Rs. 1200", online: true },
    { id: 3, name: "Dr. Priya Gurung", specialty: "Dermatology", experience: 8, rating: 4.7, fee: "Rs. 900", online: false },
    { id: 4, name: "Dr. Suman Karki", specialty: "Pediatrics", experience: 12, rating: 4.8, fee: "Rs. 800", online: true },
    { id: 5, name: "Dr. Maya Rai", specialty: "General", experience: 6, rating: 4.6, fee: "Rs. 500", online: true },
    { id: 6, name: "Dr. Bikash Adhikari", specialty: "Cardiology", experience: 20, rating: 4.9, fee: "Rs. 1500", online: false },
];

const doctorReplies = [
    "Thank you. How long have you had these symptoms?",
    "I see. Are you taking any medicines at the moment?",
    "Okay. Please drink plenty of fluids and get rest.",
    "I will send you a digital prescription after this consultation.",
];

let appointments = loadAppointments();

// --- Core Functionality ---
document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initDoctors();
    initAccordion();
    initBookingWizard();
    renderAppointments();
    initConsultationRoom();
    initContactForm();
});

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const links = navLinks.querySelectorAll('a');

    hamburger.addEventListener('click', () => {
        const open = navLinks.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', open);
    });

    // Close menu after choosing a link and highlight the active one
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', false);
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// Render Doctors with filter + search
function initDoctors() {
    const container = document.getElementById('doctor-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchBox = document.getElementById('doctor-search');
    let currentFilter = 'all';

    function displayDoctors() {
        const term = searchBox.value.toLowerCase().trim();
        const list = doctorData.filter(d =>
            (currentFilter === 'all' || d.specialty === currentFilter) &&
            d.name.toLowerCase().includes(term)
        );

        if (list.length === 0) {
            container.innerHTML = `<p class="empty-msg">No doctors found. Try another name or specialty.</p>`;
            return;
        }

        container.innerHTML = list.map(doc => `
            <div class="doctor-card">
                <div class="avatar" aria-hidden="true">${getInitials(doc.name)}</div>
                <h3>${doc.name}</h3>
                <p class="specialty">${doc.specialty}</p>
                <p class="doctor-meta">
                    <i class="fas fa-star" aria-hidden="true"></i> ${doc.rating} &nbsp;|&nbsp;
                    ${doc.experience} yrs exp &nbsp;|&nbsp; ${doc.fee}
                </p>
                <span class="badge ${doc.online ? 'online' : 'offline'}">${doc.online ? 'Available Now' : 'Busy - Book Later'}</span><br>
                <button class="btn btn-primary btn-sm" onclick="bookDoctor(${doc.id})">Book Consultation</button>
            </div>
        `).join('');
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            currentFilter = btn.dataset.filter;
            displayDoctors();
        });
    });

    searchBox.addEventListener('input', displayDoctors);
    displayDoctors();
}

function getInitials(name) {
    return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('');
}

// "Book Consultation" on a doctor card -> preselect doctor and jump to the form
function bookDoctor(id) {
    document.getElementById('doctor-select').value = id;
    document.getElementById('book').scrollIntoView();
    document.getElementById('name').focus({ preventScroll: true });
    showToast('Doctor selected. Please fill in your details.');
}

// Accordion (FAQ)
function initAccordion() {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isOpen = header.getAttribute('aria-expanded') === 'true';

            headers.forEach(h => {
                h.setAttribute('aria-expanded', 'false');
                h.nextElementSibling.style.maxHeight = null;
            });

            if (!isOpen) {
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

// Booking Wizard
function initBookingWizard() {
    const form = document.getElementById('booking-form');
    const steps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    const indicatorSteps = document.querySelectorAll('.step');
    const stepLabel = document.getElementById('step-label');
    const stepNames = ['Patient Details', 'Consultation Details', 'Confirm Appointment'];
    const doctorSelect = document.getElementById('doctor-select');
    const dateInput = document.getElementById('appt-date');
    let currentStep = 0;

    // Fill doctor dropdown
    doctorSelect.innerHTML = doctorData.map(d =>
        `<option value="${d.id}">${d.name} (${d.specialty}) - ${d.fee}</option>`
    ).join('');

    // Don't allow past dates
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    dateInput.min = today;
    dateInput.value = today;

    function goTo(step) {
        steps[currentStep].classList.remove('active');
        currentStep = step;
        steps[currentStep].classList.add('active');
        indicatorSteps.forEach((s, idx) => s.classList.toggle('active', idx <= currentStep));
        stepLabel.textContent = `Step ${currentStep + 1} of 3: ${stepNames[currentStep]}`;
        if (currentStep === 2) updateSummary();
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) goTo(currentStep + 1);
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => goTo(currentStep - 1));
    });

    function validateStep(step) {
        const fields = steps[step].querySelectorAll('[required]');
        const errorBox = document.getElementById(`error-${step + 1}`);
        let message = '';

        fields.forEach(f => {
            let ok = f.value.trim() !== '';
            if (ok && f.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value);
            if (ok && f.type === 'tel') ok = /^[0-9+\-\s]{7,15}$/.test(f.value);
            if (ok && f.type === 'date') ok = f.value >= today;

            f.classList.toggle('invalid', !ok);
            f.setAttribute('aria-invalid', !ok);
            if (!ok && !message) {
                message = `Please check the "${f.labels[0].textContent}" field.`;
                f.focus();
            }
        });

        if (errorBox) errorBox.textContent = message;
        return message === '';
    }

    function updateSummary() {
        const data = getFormData();
        document.getElementById('summary').innerHTML = `
            <p><strong>Patient:</strong> ${escapeHTML(data.name)}</p>
            <p><strong>Doctor:</strong> ${data.doctor.name} (${data.doctor.specialty})</p>
            <p><strong>Date &amp; Time:</strong> ${formatDate(data.date)} at ${data.time}</p>
            <p><strong>Type:</strong> ${data.mode} consultation</p>
            <p><strong>Fee:</strong> ${data.doctor.fee}</p>
            <p><strong>Symptoms:</strong> ${escapeHTML(data.symptoms)}</p>
        `;
    }

    function getFormData() {
        return {
            name: document.getElementById('name').value.trim(),
            symptoms: document.getElementById('symptoms').value.trim(),
            doctor: doctorData.find(d => d.id == doctorSelect.value),
            date: dateInput.value,
            time: document.getElementById('appt-time').value,
            mode: document.querySelector('input[name="mode"]:checked').value,
        };
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = getFormData();
        appointments.push({
            id: Date.now(),
            patient: data.name,
            doctorName: data.doctor.name,
            specialty: data.doctor.specialty,
            date: data.date,
            time: data.time,
            mode: data.mode,
        });
        saveAppointments();
        renderAppointments();
        showToast('Appointment booked! See it in My Appointments.');

        form.reset();
        dateInput.value = today;
        goTo(0);
        document.getElementById('appointments').scrollIntoView();
    });
}

// My Appointments
function renderAppointments() {
    const list = document.getElementById('appointment-list');

    if (appointments.length === 0) {
        list.innerHTML = `<p class="text-center muted">You have no appointments yet. <a href="#book">Book one now</a>.</p>`;
        return;
    }

    list.innerHTML = appointments.map(a => `
        <div class="appointment-card">
            <div>
                <h3>${a.doctorName} <small>(${a.specialty})</small></h3>
                <p><i class="fas fa-calendar" aria-hidden="true"></i> ${formatDate(a.date)} at ${a.time}
                   &nbsp;|&nbsp; ${a.mode} consultation</p>
                <p>Patient: ${escapeHTML(a.patient)}</p>
            </div>
            <div class="appointment-actions">
                <button class="btn btn-primary btn-sm" onclick="openConsultation(${a.id})">Join</button>
                <button class="btn btn-outline btn-sm" onclick="cancelAppointment(${a.id})">Cancel</button>
            </div>
        </div>
    `).join('');
}

function cancelAppointment(id) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    appointments = appointments.filter(a => a.id !== id);
    saveAppointments();
    renderAppointments();
    showToast('Appointment cancelled.');
}

// Consultation Room (simulated)
let replyIndex = 0;
let callTimer = null;
let lastFocused = null;

function initConsultationRoom() {
    const modal = document.getElementById('consult-modal');

    document.getElementById('close-modal').addEventListener('click', closeConsultation);
    document.getElementById('end-call').addEventListener('click', () => {
        closeConsultation();
        showToast('Consultation ended. Prescription sent to your email.');
    });

    // Close with Escape key or by clicking the dark background
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !modal.hidden) closeConsultation();
    });
    modal.addEventListener('click', e => {
        if (e.target === modal) closeConsultation();
    });

    document.getElementById('chat-form').addEventListener('submit', e => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;
        addMessage(text, 'patient');
        input.value = '';

        setTimeout(() => {
            addMessage(doctorReplies[replyIndex % doctorReplies.length], 'doctor');
            replyIndex++;
        }, 1000);
    });
}

function openConsultation(id) {
    const appt = appointments.find(a => a.id === id);
    const modal = document.getElementById('consult-modal');
    const status = document.getElementById('call-status');
    const icon = document.querySelector('#video-area i');

    lastFocused = document.activeElement;
    replyIndex = 0;
    document.getElementById('consult-title').textContent = `${appt.mode} Consultation - ${appt.doctorName}`;
    document.getElementById('chat-box').innerHTML = '';
    icon.className = appt.mode === 'Chat' ? 'fas fa-comments' : appt.mode === 'Audio' ? 'fas fa-phone-volume' : 'fas fa-user-doctor';
    status.textContent = 'Connecting to doctor...';

    modal.hidden = false;
    document.getElementById('chat-input').focus();

    clearTimeout(callTimer);
    callTimer = setTimeout(() => {
        status.textContent = `Connected with ${appt.doctorName}`;
        addMessage(`Hello ${appt.patient}, I am ${appt.doctorName}. How can I help you today?`, 'doctor');
    }, 1500);
}

function closeConsultation() {
    clearTimeout(callTimer);
    document.getElementById('consult-modal').hidden = true;
    if (lastFocused) lastFocused.focus();
}

function addMessage(text, sender) {
    const box = document.getElementById('chat-box');
    const msg = document.createElement('div');
    msg.className = `msg ${sender}`;
    msg.textContent = text;
    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        let valid = true;
        form.querySelectorAll('[required]').forEach(f => {
            const ok = f.value.trim() !== '';
            f.classList.toggle('invalid', !ok);
            if (!ok) valid = false;
        });
        if (!valid) {
            showToast('Please fill in all fields.', true);
            return;
        }
        form.reset();
        showToast('Message sent! We will reply within 24 hours.');
    });
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

// --- Hero water surface effect ---
// The cursor acts like a stick tip touching water: moving it cuts a wake,
// holding still sends out gentle rings, clicking makes a splash.
// Uses a small 2D wave simulation drawn as light/shadow on a canvas.
(function heroWater() {
    const hero = document.querySelector('.hero');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Tuned to stay subtle so it never competes with the page content
    const CELL = 5;            // px per simulation cell (higher = softer, less detail)
    const DAMPING = 0.96;      // how quickly waves die out (closer to 1 = longer)
    const WAKE = 0.22;         // strength of the wake while moving
    const TIP = 0.25;          // strength of the rings when the cursor rests
    const TIP_EVERY = 50;      // frames between resting rings
    const SPLASH = 1.4;        // strength of a click splash
    const SHADE = 0.3;         // slope -> opacity
    const MAX_ALPHA = 0.2;     // strongest highlight/shadow opacity

    const canvas = document.createElement('canvas');
    canvas.className = 'hero-water';
    canvas.setAttribute('aria-hidden', 'true');
    hero.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let w, h, cur, prev, img, pix;
    let pointer = null;        // current pointer in grid coords, null when outside
    let last = null;           // previous pointer position
    let movedThisFrame = false;
    let frame = 0, idleFrames = 0, running = false;

    function resize() {
        w = Math.max(3, Math.ceil(hero.clientWidth / CELL));
        h = Math.max(3, Math.ceil(hero.clientHeight / CELL));
        canvas.width = w;
        canvas.height = h;
        cur = new Float32Array(w * h);
        prev = new Float32Array(w * h);
        img = ctx.createImageData(w, h);
        pix = new Uint32Array(img.data.buffer);
    }

    // Push the water surface down around (cx, cy) with a smooth falloff
    function disturb(cx, cy, r, strength) {
        const x0 = Math.round(cx), y0 = Math.round(cy);
        for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
                const x = x0 + dx, y = y0 + dy;
                if (x < 1 || y < 1 || x >= w - 1 || y >= h - 1) continue;
                const d = Math.hypot(dx, dy);
                if (d > r) continue;
                cur[y * w + x] -= strength * (0.5 + 0.5 * Math.cos(Math.PI * d / r));
            }
        }
    }

    function step() {
        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                const i = y * w + x;
                const v = (cur[i - 1] + cur[i + 1] + cur[i - w] + cur[i + w]) * 0.5 - prev[i];
                prev[i] = v * DAMPING;
            }
        }
        const t = cur; cur = prev; prev = t;
    }

    function render() {
        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                const i = y * w + x;
                // Slope toward a light source at the top-left
                const s = (cur[i - 1] - cur[i + 1]) + (cur[i - w] - cur[i + w]);
                const a = Math.min(Math.abs(s) * SHADE, MAX_ALPHA) * 255 | 0;
                // Pixel format is ABGR: white highlights, deep navy shadows
                pix[i] = s > 0 ? (a << 24) | 0xffffff : (a << 24) | 0x231408;
            }
        }
        ctx.putImageData(img, 0, 0);
    }

    function loop() {
        frame++;
        if (pointer && !movedThisFrame && frame % TIP_EVERY === 0) {
            disturb(pointer.x, pointer.y, 2, TIP);  // resting stick tip
        }
        movedThisFrame = false;

        step();
        render();

        idleFrames = pointer ? 0 : idleFrames + 1;
        if (idleFrames > 180) {               // waves have settled, so stop and save CPU
            running = false;
            ctx.clearRect(0, 0, w, h);
            cur.fill(0); prev.fill(0);
            return;
        }
        requestAnimationFrame(loop);
    }

    function start() {
        if (!running) { running = true; requestAnimationFrame(loop); }
    }

    function toGrid(e) {
        const rect = hero.getBoundingClientRect();
        return { x: (e.clientX - rect.left) / CELL, y: (e.clientY - rect.top) / CELL };
    }

    hero.addEventListener('pointermove', (e) => {
        const p = toGrid(e);
        if (last) {
            // Cut a continuous line through the water from the last point to this one
            const dist = Math.hypot(p.x - last.x, p.y - last.y);
            const steps = Math.min(Math.ceil(dist), 60);
            for (let s = 1; s <= steps; s++) {
                disturb(last.x + (p.x - last.x) * s / steps, last.y + (p.y - last.y) * s / steps, 2, WAKE);
            }
        }
        last = p;
        pointer = p;
        movedThisFrame = true;
        start();
    });

    hero.addEventListener('pointerleave', () => { pointer = null; last = null; });

    hero.addEventListener('pointerdown', (e) => {
        const p = toGrid(e);
        disturb(p.x, p.y, 5, SPLASH);
        start();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    });

    resize();
})();
