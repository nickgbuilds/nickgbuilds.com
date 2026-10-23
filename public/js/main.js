// Theme toggle (dark/light)
// The saved theme is applied by the small script in each page's <head>,
// so the page doesn't flash the wrong colors while loading.
const themeToggle = document.getElementById('theme-toggle');

function getCurrentTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    return saved;
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

themeToggle.addEventListener('click', function () {
  const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});


// Mobile menu
const navToggle = document.getElementById('nav-toggle');
const navMobile = document.getElementById('nav-mobile');

navToggle.addEventListener('click', function () {
  const isOpen = navMobile.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});

document.querySelectorAll('.nav-mobile .nav-link').forEach(function (link) {
  link.addEventListener('click', function () {
    navMobile.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});


// Footer year
document.getElementById('year').textContent = new Date().getFullYear();


// Contact form (only on the contact page)
// TODO: put the Cloudflare Worker URL here once it's set up
const CONTACT_ENDPOINT = '';

const contactForm = document.getElementById('contact-form');

if (contactForm) {
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!CONTACT_ENDPOINT) {
      formStatus.textContent = 'Contact form endpoint not configured.';
      formStatus.className = 'form-status error';
      return;
    }

    const data = Object.fromEntries(new FormData(contactForm).entries());

    formStatus.textContent = 'Sending...';
    formStatus.className = 'form-status';

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        formStatus.textContent = "Message sent. I'll get back to you soon.";
        formStatus.className = 'form-status success';
        contactForm.reset();
      } else {
        formStatus.textContent = 'Something went wrong. Please try again.';
        formStatus.className = 'form-status error';
      }
    } catch (err) {
      formStatus.textContent = 'Network error. Please try again.';
      formStatus.className = 'form-status error';
    }
  });
}
