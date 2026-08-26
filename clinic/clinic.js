/* =============================================
   LUKIYA MEDICINES — clinic.js
   Plain JavaScript | No dependencies
============================================= */

'use strict';

// ── DOM refs ─────────────────────────────────
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
const backTop   = document.getElementById('back-top');
const form      = document.getElementById('contact-form');

// ── Navbar: scroll effect ─────────────────────
function onScroll() {
  const y = window.scrollY;

  // scrolled style
  navbar.classList.toggle('scrolled', y > 40);

  // back-to-top visibility
  backTop.classList.toggle('show', y > 420);

  // active nav link
  highlightNavLink();
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

// ── Navbar: mobile hamburger ──────────────────
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

// close mobile menu when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// close menu when clicking outside
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// ── Active nav link on scroll ─────────────────
function highlightNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 100;

  sections.forEach(section => {
    const id   = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;

    const top    = section.offsetTop;
    const height = section.offsetHeight;
    link.classList.toggle('active', scrollY >= top && scrollY < top + height);
  });
}

// ── Smooth scroll for all anchor links ───────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── Back to top ───────────────────────────────
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Scroll reveal (IntersectionObserver) ─────
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Animated counters (hero stats) ───────────
function animateCounter(el, target, duration) {
  let start     = 0;
  const step    = target / (duration / 16);
  const isPlus  = el.dataset.suffix === '+';
  const isPct   = el.dataset.suffix === '%';

  const tick = () => {
    start += step;
    if (start >= target) {
      el.textContent = target + (isPlus ? '+' : isPct ? '%' : '');
      return;
    }
    el.textContent = Math.floor(start) + (isPlus ? '+' : isPct ? '%' : '');
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// mark up stat elements for the counter
const statEls = document.querySelectorAll('.hstat strong, .ds strong');
statEls.forEach(el => {
  const raw = el.textContent.trim();
  const num = parseInt(raw.replace(/\D/g, ''), 10);
  if (isNaN(num)) return;

  el.dataset.target = num;
  el.dataset.suffix = raw.includes('+') ? '+' : raw.includes('%') ? '%' : '';
  el.dataset.animated = 'false';
});

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.animated === 'false') {
          el.dataset.animated = 'true';
          animateCounter(el, parseInt(el.dataset.target, 10), 1400);
          counterObserver.unobserve(el);
        }
      }
    });
  },
  { threshold: 0.5 }
);

statEls.forEach(el => {
  if (el.dataset.target) counterObserver.observe(el);
});

// ── Service cards: subtle hover tilt ─────────
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left - rect.width  / 2;
    const y      = e.clientY - rect.top  - rect.height / 2;
    const rotX   = -(y / rect.height) * 6;
    const rotY   =  (x / rect.width)  * 6;
    card.style.transform = `translateY(-5px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Contact form validation & submission ──────
if (form) {
  const nameInput  = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const nameErr    = document.getElementById('name-err');
  const phoneErr   = document.getElementById('phone-err');
  const successMsg = document.getElementById('form-success');

  function setErr(input, errEl, msg) {
    input.classList.add('invalid');
    errEl.textContent = msg;
  }

  function clearErr(input, errEl) {
    input.classList.remove('invalid');
    errEl.textContent = '';
  }

  // live validation
  nameInput.addEventListener('input',  () => {
    if (nameInput.value.trim().length >= 2) clearErr(nameInput, nameErr);
  });
  phoneInput.addEventListener('input', () => {
    if (phoneInput.value.trim().length >= 7) clearErr(phoneInput, phoneErr);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    // name
    if (nameInput.value.trim().length < 2) {
      setErr(nameInput, nameErr, 'Please enter your full name.');
      valid = false;
    } else {
      clearErr(nameInput, nameErr);
    }

    // phone
    const phoneVal = phoneInput.value.trim().replace(/\s/g, '');
    if (phoneVal.length < 7) {
      setErr(phoneInput, phoneErr, 'Please enter a valid phone number.');
      valid = false;
    } else {
      clearErr(phoneInput, phoneErr);
    }

    if (!valid) return;

    // simulate submission (replace with real backend/email API)
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;

    setTimeout(() => {
      form.reset();
      successMsg.textContent =
        '✅ Appointment request sent! Dr. Nassali Aisha will contact you shortly.';
      submitBtn.textContent = 'Send Appointment Request';
      submitBtn.disabled    = false;

      // clear success message after 6 seconds
      setTimeout(() => { successMsg.textContent = ''; }, 6000);
    }, 1600);
  });
}

// ── Footer year ───────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Sticky info bar fade-in ───────────────────
const infoBar = document.querySelector('.info-bar');
if (infoBar) {
  infoBar.style.opacity = '0';
  infoBar.style.transition = 'opacity .6s ease';
  setTimeout(() => { infoBar.style.opacity = '1'; }, 300);
}

// ── Navbar hide/show on scroll direction ─────
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;

  // only hide after scrolled past hero
  if (current > 200) {
    if (current > lastScrollY + 8) {
      // scrolling down — hide nav (but keep scrolled style)
      navbar.style.transform = 'translateY(-100%)';
    } else if (lastScrollY > current + 4) {
      // scrolling up — show nav
      navbar.style.transform = 'translateY(0)';
    }
  } else {
    navbar.style.transform = 'translateY(0)';
  }

  lastScrollY = current;
}, { passive: true });

// ── Why cards: staggered entrance ────────────
const whyCards = document.querySelectorAll('.why-card');
const whyObserver = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 120);
        whyObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
whyCards.forEach(c => {
  c.classList.add('reveal');
  whyObserver.observe(c);
});

// ── Service cards: staggered entrance ────────
const serviceCards = document.querySelectorAll('.service-card');
const serviceObserver = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 90);
        serviceObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
serviceCards.forEach(c => {
  c.classList.add('reveal');
  serviceObserver.observe(c);
});

// ── Inject fade-in keyframe ───────────────────
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .navbar { transition: transform .35s ease, background .28s ease, box-shadow .28s ease; }
`;
document.head.appendChild(style);
