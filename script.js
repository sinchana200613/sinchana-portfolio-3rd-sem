/* ====================================================
   SINCHANA N — PORTFOLIO SCRIPT
   ==================================================== */

// ===== LOADER =====
(function () {
  document.body.classList.add('is-loading');
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('hide');
      document.body.classList.remove('is-loading');
      initReveal();
      initTyping();
    }, 1800);
  });
})();

// ===== THEME TOGGLE =====
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');

// Apply saved theme
const savedTheme = localStorage.getItem('sn-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeBtn?.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('sn-theme', next);
  // Tiny bounce
  themeBtn.style.transform = 'scale(0.88)';
  setTimeout(() => { themeBtn.style.transform = ''; }, 160);
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('is-open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

// Close on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on outside click
document.addEventListener('click', e => {
  if (navLinks && hamburger &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    closeMenu();
  }
});

function closeMenu() {
  navLinks?.classList.remove('open');
  hamburger?.classList.remove('is-open');
  hamburger?.setAttribute('aria-expanded', 'false');
  hamburger?.setAttribute('aria-label', 'Open menu');
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 60);
  highlightActiveNav();
}, { passive: true });

// ===== ACTIVE NAV LINK =====
function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const offset   = window.scrollY + 130;
  let activeId   = null;

  sections.forEach(sec => {
    if (offset >= sec.offsetTop && offset < sec.offsetTop + sec.offsetHeight) {
      activeId = sec.id;
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', href === activeId);
  });
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href   = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.offsetTop - (navbar ? navbar.offsetHeight + 12 : 80);
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===== SCROLL REVEAL =====
function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => observer.observe(el));
}

// ===== TYPING ANIMATION =====
function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Computer Science & Engineering Student',
    'Learning to Code ✨',
    'Building One Project at a Time 🚀',
    'CSE Student @ REVA University',
    'Explorer of Technology 🌱',
    'Learning. Building. Becoming.'
  ];

  let pi = 0, ci = 0, deleting = false, delay = 75;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ci + 1);
      ci++;
      delay = ci === phrase.length ? 2400 : 72;
      if (ci === phrase.length) deleting = true;
    } else {
      el.textContent = phrase.slice(0, ci - 1);
      ci--;
      delay = 38;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        delay = 380;
      }
    }
    setTimeout(tick, delay);
  }
  tick();
}

// ===== PARTICLE CANVAS =====
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const PARTICLE_COUNT = 75;
  const CONNECT_DIST   = 125;
  let   particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  class P {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * canvas.width;
      this.y  = init ? Math.random() * canvas.height : (Math.random() < 0.5 ? -5 : canvas.height + 5);
      this.vx = (Math.random() - 0.5) * 0.28;
      this.vy = (Math.random() - 0.5) * 0.28;
      this.r  = Math.random() * 1.8 + 0.4;
      this.a  = Math.random() * 0.45 + 0.08;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -10) this.x = canvas.width  + 10;
      if (this.x > canvas.width  + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    }
    draw() {
      const light = html.getAttribute('data-theme') === 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = light
        ? `rgba(91,141,238,${this.a * 0.55})`
        : `rgba(91,141,238,${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new P());

  function drawLines() {
    const light = html.getAttribute('data-theme') === 'light';
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const a = (1 - dist / CONNECT_DIST) * (light ? 0.08 : 0.14);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(91,141,238,${a})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

// ===== CONTACT FORM =====
const form       = document.getElementById('contact-form');
const formMsg    = document.getElementById('form-success');
const submitBtn  = document.getElementById('contact-submit');

form?.addEventListener('submit', e => {
  e.preventDefault();

  // Basic client-side validation
  const name  = document.getElementById('contact-name')?.value.trim();
  const email = document.getElementById('contact-email')?.value.trim();
  const msg   = document.getElementById('contact-message')?.value.trim();
  if (!name || !email || !msg) return;

  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending…';

  // Simulate async submission
  setTimeout(() => {
    if (formMsg) formMsg.hidden = false;
    form.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = `Send Message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>`;
    setTimeout(() => { if (formMsg) formMsg.hidden = true; }, 5000);
  }, 1400);
});

// ===== CYCLE STEP HOVER (accessibility: keyboard) =====
document.querySelectorAll('.cycle-step').forEach(step => {
  step.setAttribute('tabindex', '0');
  step.addEventListener('focus', () => { step.style.transform = 'translateY(-7px)'; });
  step.addEventListener('blur',  () => { step.style.transform = ''; });
});

// ===== TIMELINE ICON GLOW ON SCROLL =====
(function tlObserver() {
  const icons = document.querySelectorAll('.tl-icon');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.borderColor = 'var(--blue)';
        e.target.style.boxShadow   = '0 0 22px rgba(91,141,238,0.28)';
      }
    });
  }, { threshold: 0.8 });
  icons.forEach(icon => obs.observe(icon));
})();
