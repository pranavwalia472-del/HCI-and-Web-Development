# MediConnect – Telemedicine Platform (Prototype)

A web-based prototype that lets patients consult doctors online without visiting a hospital or clinic.

Built with **HTML5, CSS3 and plain JavaScript**. No installation or server is needed.

## How to view

1. Download or unzip the project folder.
2. Open `html/index.html` in any modern browser (Chrome, Edge, Firefox, Safari).
3. For the full look, stay connected to the internet so the icons, font and hero image load. The site still works offline, but those three things won't show.

To check the mobile layout, resize the browser window or open Developer Tools (F12) and turn on the device toolbar (Ctrl+Shift+M).

## How to navigate and test

| Feature | What to try |
|---|---|
| **Navigation** | Use the top menu links to move between pages. On small screens, tap the ☰ button. |
| **How It Works** | Read the four steps from booking to prescription. |
| **Doctors** | Filter by specialty, or search by name. Click **Book Consultation** on a card to select that doctor in the booking form. |
| **Book** | Go through the 3-step form: patient details → doctor, date, time and type (video/audio/chat) → confirm. Leave a field empty to see the error messages. |
| **My Appointments** | Booked appointments appear here and are still there after a page refresh. Click **Cancel** to remove one. |
| **Consultation Room** | Click **Join** on an appointment. The call connects (simulated), and you can chat with the doctor. Close it with **End Consultation**, ✕ or the Esc key. |
| **FAQ** | Click a question to open the answer. |
| **Contact** | Send a message. Empty fields are highlighted. |

## Files

Each page has its own HTML, CSS and JS. `base.css` and `common.js` are shared by every page.

| Page | HTML | CSS | JS |
|---|---|---|---|
| Home (hero + How It Works) | `html/index.html` | `css/home.css` | `js/home.js` |
| Doctors | `html/doctors.html` | `css/doctors.css` | `js/doctors.js` |
| Book | `html/book.html` | `css/book.css` | `js/book.js` |
| My Appointments + Consultation Room | `html/appointments.html` | `css/appointments.css` | `js/appointments.js` |
| FAQ | `html/faq.html` | `css/faq.css` | `js/faq.js` |
| Contact | `html/contact.html` | `css/contact.css` | `js/contact.js` |
| Shared (nav, buttons, forms, footer, toast) | all pages | `css/base.css` | `js/common.js` |

## Accessibility features

- "Skip to main content" link, and every form field has a label
- The whole site can be used with the keyboard (Tab, Enter and Esc), with visible focus outlines
- ARIA attributes on the menu, FAQ, filters, consultation window and notifications
- Responsive layout for mobile, tablet and desktop

## Notes

This is a prototype. Doctors, the video call and the doctor's chat replies are simulated. Appointments are saved only in your browser (localStorage).




## Design references

- Teal telehealth template with doctor profiles and appointment booking (closest to our teal/navy look): https://dorik.com/template/wellbe-telehealth-website-template
- Original template reference: https://www.canva.com/templates/EAFr2QpTblE-healthcare-website-in-pastel-purple-light-blue-neon-green-simple-vibrant-minimalism-style/
"# hcl_and_web_devlopment" 
