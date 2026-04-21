console.log('%c👋 Ey, tú.', 'font-size:2rem; font-weight:bold; color:#8b5cf6;');
console.log('%cSí, tú. El que abre DevTools en portfolios ajenos. 😄', 'font-size:1rem; color:#a78bfa;');
console.log('%cEso significa que sabes lo que buscas — y eso ya dice mucho.', 'font-size:0.9rem; color:#94a3b8;');
console.log('%c¿Trabajamos juntos? Hay un formulario de contacto por aquí...', 'font-size:0.95rem; font-weight:600; color:#38bdf8;');
console.log('%c— Luis Alan Castañeda', 'font-size:0.85rem; color:#5c5a78; font-style:italic;');

const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

setTheme(localStorage.getItem('theme') || 'dark');

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

const cursorGlow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
}, { passive: true });

const phrases = [
  'Software Engineer · 10+ yrs',
  'Full Stack Senior Developer',
  'AI Integration Engineer',
  'Cloud Architect · AWS',
  'Node.js & React Expert',
  'React Native · Flutter',
  'DevOps & CI/CD',
  'OpenAI · LLM · Chatbots',
];

const typedEl = document.getElementById('typedText');
let phraseIdx = 0, charIdx = 0, deleting = false;

function type() {
  const phrase = phrases[phraseIdx];
  typedEl.textContent = deleting
    ? phrase.slice(0, charIdx--)
    : phrase.slice(0, charIdx++);

  let delay = deleting ? 40 : 70;

  if (!deleting && charIdx > phrase.length) {
    delay = 1800;
    deleting = true;
  } else if (deleting && charIdx < 0) {
    deleting = false;
    charIdx = 0;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(type, delay);
}

type();

function animateCounter(el, target, duration = 1400) {
  const start = performance.now();
  const update = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target);
    if (p < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${i * 0.07}s`;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

const counters = document.querySelectorAll('.counter');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target, parseInt(entry.target.dataset.target));
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObs.observe(c));

(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles, mouse = { x: null, y: null };
  const COUNT = 80;
  const MAX_DIST = 140;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function getAccent() {
    return root.getAttribute('data-theme') === 'dark' ? [139, 92, 246] : [124, 58, 237];
  }

  function getAccent2() {
    return root.getAttribute('data-theme') === 'dark' ? [6, 182, 212] : [2, 132, 199];
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.3;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
      if (mouse.x !== null) {
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x += dx / dist * 1.5;
          this.y += dy / dist * 1.5;
        }
      }
    }
    draw() {
      const [r, g, b] = getAccent();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function drawLines() {
    const [r1, g1, b1] = getAccent();
    const [r2, g2, b2] = getAccent2();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          const t = dist / MAX_DIST;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)},${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 100);
  });
  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  init();
  loop();
})();

const tabs = document.querySelectorAll('.demo__tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const id = tab.dataset.demo;
    document.querySelectorAll('.demo__pane').forEach(p => p.classList.remove('active'));
    document.getElementById(`demo-${id}`).classList.add('active');
    if (id === 'neural') initNeuralCanvas();
    if (id === 'sort') initSortCanvas();
  });
});

let neuralRaf = null;

function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  const ctx = canvas.getContext('2d');
  if (neuralRaf) cancelAnimationFrame(neuralRaf);

  function resize() {
    canvas.width = canvas.offsetWidth || canvas.clientWidth;
    canvas.height = canvas.offsetHeight || canvas.clientHeight;
    if (canvas.height < 10) canvas.height = 280;
  }
  resize();

  const LAYERS = [4, 6, 6, 3];
  let signals = [];

  const nodes = LAYERS.flatMap((count, layerIdx) => {
    const x = (canvas.width / (LAYERS.length + 1)) * (layerIdx + 1);
    return Array.from({ length: count }, (_, nodeIdx) => ({
      x,
      y: (canvas.height / (count + 1)) * (nodeIdx + 1),
      layer: layerIdx,
      idx: nodeIdx,
      pulse: Math.random() * Math.PI * 2,
    }));
  });

  function getThemeColors() {
    const dark = root.getAttribute('data-theme') === 'dark';
    return {
      node: dark ? 'rgba(139,92,246,' : 'rgba(124,58,237,',
      line: dark ? 'rgba(139,92,246,0.08)' : 'rgba(124,58,237,0.08)',
      signal: dark ? ['#a78bfa', '#38bdf8'] : ['#7c3aed', '#0284c7'],
    };
  }

  function getNodesByLayer(l) { return nodes.filter(n => n.layer === l); }

  function spawnSignal() {
    const fromLayer = Math.floor(Math.random() * (LAYERS.length - 1));
    const from = getNodesByLayer(fromLayer)[Math.floor(Math.random() * LAYERS[fromLayer])];
    const toLayer = fromLayer + 1;
    const to = getNodesByLayer(toLayer)[Math.floor(Math.random() * LAYERS[toLayer])];
    signals.push({ from, to, t: 0, speed: 0.008 + Math.random() * 0.006 });
  }

  let frame = 0;
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const C = getThemeColors();
    const now = Date.now() * 0.001;

    for (let l = 0; l < LAYERS.length - 1; l++) {
      getNodesByLayer(l).forEach(a => {
        getNodesByLayer(l + 1).forEach(b => {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = C.line;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        });
      });
    }

    signals = signals.filter(s => s.t <= 1);
    signals.forEach(s => {
      s.t += s.speed;
      const x = s.from.x + (s.to.x - s.from.x) * s.t;
      const y = s.from.y + (s.to.y - s.from.y) * s.t;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, 6);
      grad.addColorStop(0, C.signal[0]);
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    nodes.forEach(n => {
      const pulse = Math.sin(now * 1.5 + n.pulse) * 0.5 + 0.5;
      const r = 6 + pulse * 2;
      const alpha = 0.5 + pulse * 0.5;
      const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3);
      glow.addColorStop(0, `${C.node}${(alpha * 0.4).toFixed(2)})`);
      glow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `${C.node}${alpha.toFixed(2)})`;
      ctx.fill();
    });

    if (frame % 18 === 0) spawnSignal();
    frame++;
    neuralRaf = requestAnimationFrame(loop);
  }

  for (let i = 0; i < 8; i++) spawnSignal();
  loop();
}

window.addEventListener('load', () => {
  setTimeout(initNeuralCanvas, 200);
});

let sortRaf = null, sorting = false;

function initSortCanvas() {
  const canvas = document.getElementById('sortCanvas');
  const ctx = canvas.getContext('2d');
  if (sortRaf) cancelAnimationFrame(sortRaf);

  function resize() {
    canvas.width = canvas.offsetWidth || canvas.clientWidth;
    canvas.height = canvas.offsetHeight || canvas.clientHeight;
    if (canvas.height < 10) canvas.height = 220;
  }
  resize();

  const N = 60;
  let arr = [], highlights = {};

  function shuffle() {
    arr = Array.from({ length: N }, (_, i) => i + 1);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    highlights = {};
  }

  shuffle();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;
    const barW = W / N;
    const dark = root.getAttribute('data-theme') === 'dark';

    arr.forEach((val, i) => {
      const h = (val / N) * (H - 10);
      const x = i * barW;
      const y = H - h;
      let color;
      if (highlights[i] === 'compare') color = '#f59e0b';
      else if (highlights[i] === 'swap') color = '#ef4444';
      else if (highlights[i] === 'done') color = '#22c55e';
      else {
        const t = val / N;
        const r = Math.round(dark ? 139 + (6 - 139) * t : 124 + (2 - 124) * t);
        const g = Math.round(dark ? 92 + (182 - 92) * t : 58 + (132 - 58) * t);
        const b = Math.round(dark ? 246 + (212 - 246) * t : 237 + (199 - 237) * t);
        color = `rgb(${r},${g},${b})`;
      }
      ctx.fillStyle = color;
      ctx.fillRect(x + 1, y, barW - 2, h);
    });

    sortRaf = requestAnimationFrame(draw);
  }

  draw();

  const sleep = ms => new Promise(res => setTimeout(res, ms));
  const getDelay = () => Math.round(160 / (document.getElementById('sortSpeed')?.value || 5));

  async function bubbleSort() {
    sorting = true;
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (!sorting) return;
        highlights = { [j]: 'compare', [j + 1]: 'compare' };
        await sleep(getDelay());
        if (arr[j] > arr[j + 1]) {
          highlights = { [j]: 'swap', [j + 1]: 'swap' };
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          await sleep(getDelay());
        }
      }
      highlights[arr.length - 1 - i] = 'done';
    }
    arr.forEach((_, i) => { highlights[i] = 'done'; });
    sorting = false;
  }

  async function quickSort(lo = 0, hi = arr.length - 1) {
    if (lo >= hi || !sorting) return;
    const pivot = arr[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      if (!sorting) return;
      highlights = { [j]: 'compare', [hi]: 'compare' };
      await sleep(getDelay());
      if (arr[j] <= pivot) {
        i++;
        highlights = { [i]: 'swap', [j]: 'swap' };
        [arr[i], arr[j]] = [arr[j], arr[i]];
        await sleep(getDelay());
      }
    }
    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
    highlights[i + 1] = 'done';
    const p = i + 1;
    await quickSort(lo, p - 1);
    await quickSort(p + 1, hi);
    if (lo === 0 && hi === arr.length - 1) {
      arr.forEach((_, idx) => { highlights[idx] = 'done'; });
      sorting = false;
    }
  }

  document.getElementById('sortBubble').addEventListener('click', () => { if (!sorting) bubbleSort(); });
  document.getElementById('sortQuick').addEventListener('click', () => { if (!sorting) { sorting = true; quickSort(); } });
  document.getElementById('sortReset').addEventListener('click', () => { sorting = false; setTimeout(shuffle, 50); });
}

document.getElementById('apiFetch').addEventListener('click', async () => {
  const btn = document.getElementById('apiFetch');
  const statusEl = document.getElementById('apiStatus');
  const bodyEl = document.getElementById('apiBody');
  const arrow = document.getElementById('apiArrow');

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching...';
  statusEl.textContent = '';
  bodyEl.innerHTML = '<span class="api__placeholder">Enviando request...</span>';
  arrow.style.color = 'var(--accent)';

  try {
    const start = performance.now();
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const elapsed = Math.round(performance.now() - start);
    const data = await res.json();

    statusEl.textContent = `✓ ${res.status} ${res.statusText} · ${elapsed}ms`;
    statusEl.className = 'api__status ok';

    const mini = data.slice(0, 4).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      company: u.company.name,
    }));

    bodyEl.textContent = JSON.stringify(mini, null, 2);
  } catch (err) {
    statusEl.textContent = `✗ Error: ${err.message}`;
    statusEl.className = 'api__status error';
    bodyEl.textContent = err.toString();
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-paper-plane"></i> Ejecutar';
});

(function initTerminal() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  const logs = [
    { level: 'info',    msg: 'Server started on <em>port 3000</em>' },
    { level: 'info',    msg: 'Connected to <em>PostgreSQL</em> · pool size: 10' },
    { level: 'info',    msg: 'Redis cache <em>ready</em>' },
    { level: 'success', msg: 'GET  <em>/api/health</em>  200  · 3ms' },
    { level: 'success', msg: 'POST <em>/api/auth/login</em>  200  · 47ms' },
    { level: 'info',    msg: 'JWT issued · expires in <em>8h</em>' },
    { level: 'success', msg: 'GET  <em>/api/users/42</em>  200  · 12ms' },
    { level: 'warn',    msg: 'Rate limit: <em>80%</em> threshold reached for ip ::1' },
    { level: 'success', msg: 'POST <em>/api/messages</em>  201  · 23ms' },
    { level: 'info',    msg: 'OpenAI response received · tokens: <em>318</em>' },
    { level: 'success', msg: 'WebSocket connected · clients: <em>7</em>' },
    { level: 'success', msg: 'GET  <em>/api/reports</em>  200  · 89ms' },
    { level: 'info',    msg: 'Cron job <em>cleanup:sessions</em> executed' },
    { level: 'error',   msg: 'GET  <em>/api/secret</em>  401  · Unauthorized' },
    { level: 'success', msg: 'DELETE <em>/api/cache</em>  204  · 5ms' },
    { level: 'info',    msg: 'S3 upload complete · <em>reports/2026-04.pdf</em>' },
    { level: 'success', msg: 'POST <em>/api/notify</em>  200  · WhatsApp sent' },
    { level: 'warn',    msg: 'DB query slow: <em>342ms</em> — consider indexing' },
    { level: 'success', msg: 'GET  <em>/api/users</em>  200  · 18ms' },
    { level: 'info',    msg: 'Deploy complete · v<em>2.4.1</em> is live 🚀' },
  ];

  function getTime() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
  }

  const levelLabel = { info: '[INFO]', success: '[OK] ', warn: '[WARN]', error: '[ERR] ' };
  const MAX_LINES = 10;
  let idx = 0;

  function appendLine() {
    const log = logs[idx % logs.length];
    const line = document.createElement('div');
    line.className = 'terminal__line';
    line.innerHTML = `
      <span class="terminal__time">${getTime()}</span>
      <span class="terminal__level--${log.level}">${levelLabel[log.level]}</span>
      <span class="terminal__msg">${log.msg}</span>`;
    body.appendChild(line);
    if (body.children.length > MAX_LINES) body.removeChild(body.firstChild);
    idx++;
  }

  const termObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      for (let i = 0; i < 6; i++) setTimeout(appendLine, i * 300);
      setInterval(appendLine, 2200);
      termObs.disconnect();
    }
  }, { threshold: 0.3 });

  termObs.observe(body);
})();

const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active-nav', a.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

const style = document.createElement('style');
style.textContent = `.nav__link.active-nav { color: var(--accent) !important; }`;
document.head.appendChild(style);
