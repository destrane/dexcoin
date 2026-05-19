// ── Nav scroll ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ── Mobile burger ──
const burger = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');
burger.addEventListener('click', () => navMobile.classList.toggle('open'));
navMobile.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navMobile.classList.remove('open'))
);

// ── Copy CA (hero) ──
const copyBtn = document.getElementById('copyBtn');
const caText  = document.getElementById('caText');
function doCopy(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add('copied');
    const span = btn.querySelector('span') || btn;
    const orig = span.textContent;
    span.textContent = 'Copied!';
    setTimeout(() => {
      btn.classList.remove('copied');
      span.textContent = orig;
    }, 2000);
  });
}
copyBtn.addEventListener('click', () => doCopy(copyBtn, caText.textContent.trim()));

// ── Copy CA (CTA section) ──
const ctaCopyBtn = document.getElementById('ctaCopyBtn');
if (ctaCopyBtn) {
  ctaCopyBtn.addEventListener('click', () =>
    doCopy(ctaCopyBtn, 'Hvjtx1UqKbmgc131hVSs6PrHvKh1tNY6CKX2RN3Spump')
  );
}

// ── Scroll reveal ──
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = e.target.style.getPropertyValue('--delay') || `${i * 0.06}s`;
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

// ── Bar animation ──
const bars = document.querySelectorAll('.alloc-fill');
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.pct + '%';
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
bars.forEach(b => barObs.observe(b));

// ── Smooth anchor scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Particle canvas ──
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}

class Particle {
  constructor(init) {
    this.x = Math.random() * (W || 1200);
    this.y = init ? Math.random() * (H || 900) : (H || 900) + 10;
    this.r = Math.random() * 1.4 + 0.3;
    this.vy = -(Math.random() * 0.35 + 0.08);
    this.vx = (Math.random() - 0.5) * 0.12;
    this.o  = Math.random() * 0.45 + 0.08;
    this.c  = Math.random() > 0.55 ? '249,115,22' : '96,165,250';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < -10) {
      this.x = Math.random() * W;
      this.y = H + 10;
      this.vy = -(Math.random() * 0.35 + 0.08);
      this.vx = (Math.random() - 0.5) * 0.12;
      this.o  = Math.random() * 0.45 + 0.08;
      this.c  = Math.random() > 0.55 ? '249,115,22' : '96,165,250';
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.c},${this.o})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = Array.from({ length: 90 }, (_, i) => new Particle(i < 90));
}

let raf;
function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  raf = requestAnimationFrame(animate);
}

resize();
initParticles();
animate();

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    cancelAnimationFrame(raf);
    resize();
    initParticles();
    animate();
  }, 150);
}, { passive: true });
