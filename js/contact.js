document.addEventListener('DOMContentLoaded', initContactForm);

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
