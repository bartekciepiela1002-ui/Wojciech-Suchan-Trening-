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

// ════ PAKIET ANIMACJI ════

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── 1. Scroll Reveal ───
// Automatycznie oznacz elementy do animacji (bez edycji HTML)

const revealTargets = [
  // pojedyncze elementy
  '.section-label',
  '.about-mini__title', '.about-mini__text', '.about-mini__badge',
  '.about-mini__photo-wrap',
  '.transforms-mini__header',
  '.page-hero__title', '.page-hero__lead',
  '.story__title', '.story__body',
  '.quals__title', '.process__title', '.pricing__title', '.faq__title',
  '.page-cta__title', '.page-cta__text', '.page-cta__buttons',
  '.paths__label',
  '.contact-form', '.contact__info'
];

revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('reveal');
  });
});

// grupy ze staggerem — każdy kolejny element dostaje opóźnienie
const staggerGroups = [
  '.paths__grid > *',
  '.stats__grid > *',
  '.transforms-mini__grid > *',
  '.transforms__grid > *',
  '.pricing__grid > *',
  '.quals__grid > *',
  '.process__steps > *',
  '.faq__list > *'
];

staggerGroups.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    el.setAttribute('data-delay', Math.min(i + 1, 5));
  });
});

// Observer odpalający animacje
if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
}

// ─── 2. Licznik liczb w statystykach ───

function animateCounter(el, target, suffix, duration = 1400) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statNumbers = document.querySelectorAll('.stat__number');

if (statNumbers.length && !prefersReducedMotion) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent.trim();
      // animuj tylko jeśli tekst zaczyna się od liczby (np. "7+", "200+")
      const match = text.match(/^(\d+)(.*)$/);
      if (match) {
        const target = parseInt(match[1], 10);
        const suffix = match[2] || '';
        el.textContent = '0' + suffix;
        animateCounter(el, target, suffix);
      }
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));
}

// ─── 3. Strzałka hero: znika przy scrollu ───

const heroScroll = document.querySelector('.hero__scroll');

if (heroScroll) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      heroScroll.classList.add('is-hidden');
    } else {
      heroScroll.classList.remove('is-hidden');
    }
  }, { passive: true });
}
