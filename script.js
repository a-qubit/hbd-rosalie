/* =========================================================
   ROSALIE BIRTHDAY WEBSITE — script.js
   ========================================================= */

/* ── STATE ── */
const state = {
  heartsClicked: 0,
  balloonsPopped: 0,
  tasksCompleted: 0,
  typewriterDone: false,
};

/* ────────────────────────────────────────────────────────────
   UTILITY HELPERS
   ──────────────────────────────────────────────────────────── */
function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

function showToast(msg) {
  const toast = document.getElementById('success-toast');
  document.getElementById('toast-text').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function revealSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('hidden');
  requestAnimationFrame(() => {
    el.classList.add('visible');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function flashUnlock(section) {
  const flash = section.querySelector('.unlock-flash');
  if (!flash) return;
  flash.classList.add('active');
  setTimeout(() => flash.classList.remove('active'), 1000);
}

/* ────────────────────────────────────────────────────────────
   BACKGROUND BALLOONS
   ──────────────────────────────────────────────────────────── */
function initBackgroundBalloons() {
  const container = document.getElementById('bg-balloons');
  const emojis = ['🎈', '🎈', '🎀', '✨', '🌸'];
  for (let i = 0; i < 18; i++) {
    const b = document.createElement('span');
    b.className = 'bg-balloon';
    b.textContent = emojis[randInt(0, emojis.length - 1)];
    b.style.cssText = `
      left: ${rand(0, 100)}vw;
      font-size: ${rand(1.2, 2.8)}rem;
      animation-duration: ${rand(10, 22)}s;
      animation-delay: ${rand(0, 14)}s;
    `;
    container.appendChild(b);
  }
}

/* ────────────────────────────────────────────────────────────
   SPARKLE LAYER
   ──────────────────────────────────────────────────────────── */
function initSparkles() {
  const layer = document.getElementById('sparkle-layer');
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.cssText = `
      left: ${rand(0, 100)}%;
      top: ${rand(0, 100)}%;
      animation-delay: ${rand(0, 3)}s;
      animation-duration: ${rand(1.5, 3.5)}s;
      width: ${rand(4, 9)}px; height: ${rand(4, 9)}px;
      background: hsl(${randInt(40, 55)}, 100%, 70%);
    `;
    layer.appendChild(s);
  }
}

/* ────────────────────────────────────────────────────────────
   TYPEWRITER
   ──────────────────────────────────────────────────────────── */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  const text = 'A special surprise made with friendship, memories, and gratitude.';
  let i = 0;
  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, 48);
    } else {
      state.typewriterDone = true;
    }
  }
  setTimeout(type, 800);
}

/* ────────────────────────────────────────────────────────────
   HERO FIREWORKS (canvas)
   ──────────────────────────────────────────────────────────── */
function initHeroFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor(x, y, hue) {
      this.x = x; this.y = y;
      this.vx = rand(-4, 4); this.vy = rand(-6, 2);
      this.alpha = 1; this.size = rand(2, 5);
      this.hue = hue; this.gravity = 0.12;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.vy += this.gravity; this.alpha -= 0.018;
      this.size *= 0.97;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = `hsl(${this.hue},90%,65%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function burst(x, y) {
    const hue = randInt(0, 360);
    for (let i = 0; i < 60; i++) particles.push(new Particle(x, y, hue));
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.alpha > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();

  /* Auto-bursts on load */
  const auto = [
    [0.2, 0.3], [0.5, 0.2], [0.8, 0.35],
    [0.35, 0.5], [0.65, 0.25],
  ];
  auto.forEach(([rx, ry], i) => {
    setTimeout(() => burst(rx * canvas.width, ry * canvas.height), 600 + i * 500);
  });
}

/* ────────────────────────────────────────────────────────────
   MUSIC
   ──────────────────────────────────────────────────────────── */
function initMusic() {
  const btn = document.getElementById('music-btn');
  const audio = document.getElementById('bg-music');
  let playing = false;
  btn.addEventListener('click', () => {
    if (playing) { audio.pause(); btn.classList.remove('playing'); }
    else { audio.play().catch(() => {}); btn.classList.add('playing'); }
    playing = !playing;
  });
}

/* ────────────────────────────────────────────────────────────
   TASK 1 — CLICK HEARTS
   ──────────────────────────────────────────────────────────── */
function initTask1() {
  const arena = document.getElementById('hearts-arena');
  const counterSpan = document.querySelector('#heart-counter span');
  const section = document.getElementById('task1');
  const emojis = ['❤️','💕','💖','💗','💓','💝'];

  function spawnHeart() {
    if (!arena) return;
    const h = document.createElement('span');
    h.className = 'heart-target';
    h.textContent = emojis[randInt(0, emojis.length - 1)];
    h.style.left = `${rand(2, 85)}%`;
    h.style.bottom = `${rand(5, 30)}px`;
    h.style.animationDuration = `${rand(2.5, 5)}s`;
    h.style.animationDelay = `${rand(0, 1.5)}s`;
    h.style.fontSize = `${rand(1.5, 2.6)}rem`;
    h.addEventListener('click', () => {
      if (h.classList.contains('popped') || state.heartsClicked >= 10) return;
      h.classList.add('popped');
      state.heartsClicked++;
      counterSpan.textContent = state.heartsClicked;
      if (state.heartsClicked >= 10) completeTask(1, section, 'msg-section', '💕 All 10 hearts clicked! Unlocking your message…');
    });
    arena.appendChild(h);
    setTimeout(() => h.remove(), 5200);
  }

  // spawn hearts continuously
  setInterval(spawnHeart, 420);
}

/* ────────────────────────────────────────────────────────────
   TASK 2 — PUZZLE
   ──────────────────────────────────────────────────────────── */
function initTask2() {
  const section = document.getElementById('task2');
  const input = document.getElementById('puzzle-input');
  const btn = document.getElementById('puzzle-submit');
  const msg = document.getElementById('puzzle-msg');

  btn.addEventListener('click', check);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });

  function check() {
    const val = parseInt(input.value, 10);
    if (val === 12) {
      msg.textContent = '🎉 Correct! You are brilliant!';
      msg.className = 'puzzle-msg success';
      btn.disabled = true; input.disabled = true;
      setTimeout(() => completeTask(2, section, 'rose-section', '🌹 Puzzle solved! The rose garden opens…'), 900);
    } else {
      msg.textContent = '❌ Not quite — try again!';
      msg.className = 'puzzle-msg error';
      input.value = '';
      input.focus();
    }
  }
}

/* ────────────────────────────────────────────────────────────
   ROSE / ROSALIE SECTION — petals & hearts
   ──────────────────────────────────────────────────────────── */
function initRoseSection() {
  const petalContainer = document.getElementById('petal-container');
  const heartContainer = document.getElementById('heart-particles');
  const petalEmojis = ['🌸', '🌺', '🌹', '💮'];

  for (let i = 0; i < 28; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = petalEmojis[randInt(0, petalEmojis.length - 1)];
    p.style.cssText = `
      left: ${rand(0, 100)}%;
      font-size: ${rand(1, 2)}rem;
      animation-duration: ${rand(6, 14)}s;
      animation-delay: ${rand(0, 8)}s;
    `;
    petalContainer.appendChild(p);
  }

  for (let i = 0; i < 20; i++) {
    const h = document.createElement('span');
    h.className = 'heart-p';
    h.textContent = ['❤️', '💕', '💖'][randInt(0, 2)];
    h.style.cssText = `
      left: ${rand(5, 95)}%;
      bottom: ${rand(0, 40)}%;
      font-size: ${rand(1, 1.8)}rem;
      animation-duration: ${rand(3, 7)}s;
      animation-delay: ${rand(0, 5)}s;
    `;
    heartContainer.appendChild(h);
  }
}

/* ────────────────────────────────────────────────────────────
   TASK 3 — DRAG & DROP GIFT
   ──────────────────────────────────────────────────────────── */
function initTask3() {
  const gift = document.getElementById('gift-item');
  const box = document.getElementById('gift-box');
  const section = document.getElementById('task3');

  /* ── Desktop drag events ── */
  gift.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', 'gift');
    setTimeout(() => gift.style.opacity = '0.4', 0);
  });
  gift.addEventListener('dragend', () => { gift.style.opacity = '1'; });

  box.addEventListener('dragover', e => {
    e.preventDefault();
    box.classList.add('drag-over');
  });
  box.addEventListener('dragleave', () => box.classList.remove('drag-over'));
  box.addEventListener('drop', e => {
    e.preventDefault();
    box.classList.remove('drag-over');
    if (e.dataTransfer.getData('text/plain') === 'gift') onGiftDropped();
  });

  /* ── Mobile touch events ── */
  let startX, startY, clone;
  gift.addEventListener('touchstart', e => {
    const t = e.touches[0];
    startX = t.clientX; startY = t.clientY;
    clone = gift.cloneNode(true);
    clone.style.cssText = `position:fixed;pointer-events:none;opacity:0.85;z-index:999;font-size:3.5rem;left:${startX - 28}px;top:${startY - 28}px;`;
    document.body.appendChild(clone);
    gift.style.opacity = '0.3';
  }, { passive: true });

  gift.addEventListener('touchmove', e => {
    e.preventDefault();
    const t = e.touches[0];
    if (clone) { clone.style.left = `${t.clientX - 28}px`; clone.style.top = `${t.clientY - 28}px`; }
    const boxRect = box.getBoundingClientRect();
    if (t.clientX > boxRect.left && t.clientX < boxRect.right &&
        t.clientY > boxRect.top  && t.clientY < boxRect.bottom) {
      box.classList.add('drag-over');
    } else { box.classList.remove('drag-over'); }
  }, { passive: false });

  gift.addEventListener('touchend', e => {
    if (clone) { clone.remove(); clone = null; }
    gift.style.opacity = '1';
    const t = e.changedTouches[0];
    const boxRect = box.getBoundingClientRect();
    if (t.clientX > boxRect.left && t.clientX < boxRect.right &&
        t.clientY > boxRect.top  && t.clientY < boxRect.bottom) {
      box.classList.remove('drag-over');
      onGiftDropped();
    }
  });

  function onGiftDropped() {
    box.textContent = '🎁📦';
    gift.style.display = 'none';
    setTimeout(() => completeTask(3, section, 'gallery-section', '🎁 Gift delivered! The gallery is open!'), 700);
  }
}

/* ────────────────────────────────────────────────────────────
   TASK 4 — HIDDEN ROSE
   ──────────────────────────────────────────────────────────── */
function initTask4() {
  const garden = document.getElementById('rose-garden');
  const section = document.getElementById('task4');
  const leaves = ['🍃','🌿','🍀','🍂','🌱','🍁'];
  const count = 40;
  const rosePos = randInt(5, count - 5);

  for (let i = 0; i <= count; i++) {
    const span = document.createElement('span');
    span.className = 'garden-item';
    if (i === rosePos) {
      span.textContent = '🌹';
      span.classList.add('hidden-rose');
      span.title = 'Found it!';
      span.setAttribute('role', 'button');
      span.setAttribute('tabindex', '0');
      span.addEventListener('click', () => {
        span.style.fontSize = '3rem';
        setTimeout(() => completeTask(4, section, 'timeline-section', '🌹 You found the hidden rose!'), 500);
      });
      span.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') span.click(); });
    } else {
      span.textContent = leaves[randInt(0, leaves.length - 1)];
    }
    garden.appendChild(span);
  }
}

/* ────────────────────────────────────────────────────────────
   TIMELINE ANIMATION (Intersection Observer)
   ──────────────────────────────────────────────────────────── */
function initTimeline() {
  const items = document.querySelectorAll('.tl-item');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = Array.from(items).indexOf(e.target) * 180;
        setTimeout(() => e.target.classList.add('visible'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  items.forEach(item => obs.observe(item));
}

/* ────────────────────────────────────────────────────────────
   TASK 5 — POP BALLOONS
   ──────────────────────────────────────────────────────────── */
function initTask5() {
  const arena = document.getElementById('balloon-arena');
  const counterSpan = document.querySelector('#balloon-counter span');
  const section = document.getElementById('task5');
  const balloonEmojis = ['🎈','🎈','🎀','🎊','🎈'];

  for (let i = 0; i < 5; i++) {
    const b = document.createElement('span');
    b.className = 'balloon';
    b.textContent = balloonEmojis[i];
    b.style.animationDelay = `${i * 0.45}s`;
    b.addEventListener('click', () => {
      if (b.classList.contains('popped')) return;
      b.classList.add('popped');
      state.balloonsPopped++;
      counterSpan.textContent = state.balloonsPopped;
      if (state.balloonsPopped >= 5) {
        setTimeout(() => {
          completeTask(5, section, 'finale', '🎊 All balloons popped! Welcome to the Grand Finale!');
          launchConfetti();
          launchGrandFireworks();
        }, 500);
      }
    });
    arena.appendChild(b);
  }
}

/* ────────────────────────────────────────────────────────────
   COMPLETE TASK — shared unlock logic
   ──────────────────────────────────────────────────────────── */
function completeTask(num, section, nextId, toastMsg) {
  state.tasksCompleted++;
  flashUnlock(section);
  showToast(toastMsg);

  // update lock icon to checkmark
  const lock = section.querySelector('.lock-icon');
  if (lock) { lock.textContent = '✅'; lock.style.filter = 'drop-shadow(0 0 10px #a8f0a0)'; }

  setTimeout(() => revealSection(nextId), 700);
}

/* ────────────────────────────────────────────────────────────
   CONFETTI (canvas)
   ──────────────────────────────────────────────────────────── */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#c0392b','#e8516a','#f8c8d0','#f4c542','#ffffff','#6b0f1a'];

  for (let i = 0; i < 180; i++) {
    pieces.push({
      x: rand(0, canvas.width),
      y: rand(-canvas.height, 0),
      size: rand(6, 14),
      color: colors[randInt(0, colors.length - 1)],
      vx: rand(-2, 2), vy: rand(2, 6),
      angle: rand(0, 360), spin: rand(-4, 4),
      shape: randInt(0, 1), // 0=rect 1=circle
    });
  }

  let frameCount = 0;
  function draw() {
    if (frameCount > 260) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.angle += p.spin;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if (p.shape === 0) ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
      else { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    });
    frameCount++;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ────────────────────────────────────────────────────────────
   GRAND FIREWORKS (reuse hero canvas approach, full screen)
   ──────────────────────────────────────────────────────────── */
function launchGrandFireworks() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  class FW {
    constructor(x, y) {
      this.x = x; this.y = y;
      const hue = randInt(0, 360);
      this.hue = hue;
      this.vx = rand(-5, 5); this.vy = rand(-7, 1);
      this.alpha = 1; this.size = rand(2, 6);
      this.gravity = 0.14;
    }
    update() { this.x += this.vx; this.y += this.vy; this.vy += this.gravity; this.alpha -= 0.015; }
    draw() {
      ctx.save(); ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = `hsl(${this.hue},90%,65%)`;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  function burst(x, y) { for (let i = 0; i < 80; i++) particles.push(new FW(x, y)); }

  let tick = 0;
  function loop() {
    tick++;
    ctx.fillStyle = 'rgba(26,0,16,0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.alpha > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    if (tick % 28 === 0) {
      burst(rand(0.15, 0.85) * canvas.width, rand(0.1, 0.55) * canvas.height);
    }
    if (tick < 360) requestAnimationFrame(loop);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  loop();
}

/* ────────────────────────────────────────────────────────────
   REPLAY ALL ANIMATIONS
   ──────────────────────────────────────────────────────────── */
function initReplay() {
  document.getElementById('replay-btn').addEventListener('click', () => {
    launchConfetti();
    setTimeout(launchGrandFireworks, 400);
    // re-animate finale message
    const msg = document.getElementById('finale-msg');
    msg.style.animation = 'none';
    requestAnimationFrame(() => { msg.style.animation = ''; });
  });
}

/* ────────────────────────────────────────────────────────────
   LOCK INITIAL TASKS — only task1 visible on load
   ──────────────────────────────────────────────────────────── */
function initTaskVisibility() {
  // Reveal task1 as the first interactive step (hero CTA scrolls there)
  // Tasks 2-5 will reveal themselves after prior ones complete — they
  // start locked but are still in the DOM so scrolling there works.
  // Content sections (msg, rose, gallery, timeline, finale) start hidden.
  // Already handled in HTML with class="hidden" + JS revealSection().
}

/* ────────────────────────────────────────────────────────────
   BOOT
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initBackgroundBalloons();
  initSparkles();
  initTypewriter();
  initHeroFireworks();
  initMusic();
  initTask1();
  initTask2();
  initRoseSection();
  initTask3();
  initTask4();
  initTimeline();
  initTask5();
  initTaskVisibility();
  initReplay();

  /* Smooth scroll polyfill for browsers not supporting CSS scroll-behavior */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
});
