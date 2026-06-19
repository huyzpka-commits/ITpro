/* =============================================
   JUNTRINH PORTFOLIO — SCRIPTS
   ============================================= */

// ===== PARTICLES =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.6 ? '#00f5ff' : Math.random() > 0.5 ? '#7b2fff' : '#ffffff';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 4;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Init 150 particles
for (let i = 0; i < 150; i++) {
  particles.push(new Particle());
}

// Draw lines between close particles
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.12;
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== TYPED TEXT =====
const phrases = [
  'DevOps Engineer & CI/CD Expert',
  'Full-Stack Developer',
  'QA Tester & Bug Hunter',
  'Windows & PC Troubleshooter',
  'Search Engine Specialist',
  'IT Infrastructure Master',
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const el = document.getElementById('typed');
  if (!el) return;

  const current = phrases[phraseIndex];
  if (isDeleting) {
    el.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    el.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === current.length) {
    setTimeout(() => { isDeleting = true; }, 2000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  const speed = isDeleting ? 40 : 80;
  setTimeout(typeEffect, speed);
}
setTimeout(typeEffect, 800);

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 25);
}

// ===== INTERSECTION OBSERVER =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Counter
      const counters = entry.target.querySelectorAll('.stat-number[data-count]');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const suffix = counter.closest('.stat').querySelector('.stat-label').textContent.includes('%') ? '%' : '+';
        animateCounter(counter, target, suffix);
      });

      // Fade in cards
      if (entry.target.classList.contains('skill-card') ||
          entry.target.classList.contains('project-card') ||
          entry.target.classList.contains('tl-card')) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }

      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

// Observe hero stats section
document.querySelectorAll('.hero-stats').forEach(el => observer.observe(el));

// Observe cards with initial state
document.querySelectorAll('.skill-card, .project-card, .tl-card').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
  observer.observe(el);
});

// ===== SMOOTH SCROLL + NAV ACTIVE =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(2, 11, 24, 0.97)';
  } else {
    navbar.style.background = 'rgba(2, 11, 24, 0.85)';
  }
});

// ===== MOUSE PARALLAX on HERO =====
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 15;
  const y = (e.clientY / window.innerHeight - 0.5) * 15;
  const grid = document.querySelector('.hero-grid');
  if (grid) {
    grid.style.transform = `translate(${x}px, ${y}px)`;
  }
});

// ===== FORM SUBMIT =====
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button');
    btn.textContent = '✅ Đã gửi thành công!';
    btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
    setTimeout(() => {
      btn.innerHTML = '<span>🚀</span> Gửi tin nhắn';
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

// ===== SKILL BAR OBSERVER =====
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.fill').forEach(fill => {
        fill.style.animationPlayState = 'running';
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => {
  card.querySelectorAll('.fill').forEach(fill => {
    fill.style.animationPlayState = 'paused';
  });
  barObserver.observe(card);
});

// ===== CURSOR GLOW EFFECT =====
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position: fixed; pointer-events: none; z-index: 9999;
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: left 0.1s ease, top 0.1s ease;
`;
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

console.log('%c JUNTRINH — IT ENGINEER ', 'background: #00f5ff; color: #000; font-size: 14px; font-weight: bold; padding: 4px 10px;');
console.log('%c Built with ❤️ & code', 'color: #7b2fff; font-size: 12px;');
