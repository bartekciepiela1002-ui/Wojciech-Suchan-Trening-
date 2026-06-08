/* ─── Navigation ─── */

const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Sticky nav po scrollu
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    nav.classList.add('nav--scrolled');
  } else {
    nav.classList.remove('nav--scrolled');
  }
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('is-open');
  navLinks.classList.toggle('is-open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Zamknij menu po kliknięciu w link
navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('is-open');
    navLinks.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Aktywny link — podświetl link pasujący do aktualnej strony
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
navLinks.querySelectorAll('.nav__link').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('nav__link--active');
  }
});

/* ─── Scroll-reveal ─── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ─── FAQ Accordion ─── */

const faqItems = document.querySelectorAll('.faq-item__question');

faqItems.forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    faqItems.forEach(other => {
      other.setAttribute('aria-expanded', 'false');
      other.nextElementSibling.classList.remove('is-open');
    });

    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('is-open');
    }
  });
});

/* ─── Contact form validation ─── */

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const formSuccess = document.getElementById('formSuccess');

    [name, email, message].forEach(field => {
      field.classList.remove('is-error');
    });
    [nameError, emailError, messageError].forEach(err => {
      err.classList.remove('is-visible');
    });

    if (!name.value.trim()) {
      name.classList.add('is-error');
      nameError.classList.add('is-visible');
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
      email.classList.add('is-error');
      emailError.classList.add('is-visible');
      valid = false;
    }

    if (!message.value.trim()) {
      message.classList.add('is-error');
      messageError.classList.add('is-visible');
      valid = false;
    }

    if (valid) {
      formSuccess.classList.add('is-visible');
      contactForm.reset();
    }
  });
}

/* ─── Accordion ─── */
document.querySelectorAll('[data-accordion-trigger]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) return;

    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

    const group = trigger.closest('[data-accordion-group]');
    if (group) {
      group.querySelectorAll('[data-accordion-trigger]').forEach((t) => {
        t.setAttribute('aria-expanded', 'false');
        const p = document.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = true;
      });
    }

    trigger.setAttribute('aria-expanded', !isExpanded);
    panel.hidden = isExpanded;
  });
});
