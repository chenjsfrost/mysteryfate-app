/* MysteryFate visual FX: crossfading mood backgrounds, particle weather, one-shot screen effects. */
(function () {
  'use strict';

  const bg = document.getElementById('bg');
  const canvas = document.getElementById('particles');
  const flashEl = document.getElementById('flash');
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let currentMood = null;
  let weather = null;
  let parts = [];
  let W = 0, H = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = Math.floor(innerWidth * dpr);
    H = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }
  addEventListener('resize', resize);
  resize();

  function mood(name) {
    name = name || 'default';
    if (name === currentMood) return;
    currentMood = name;
    const layer = document.createElement('div');
    layer.className = 'layer mood-' + name;
    bg.appendChild(layer);
    requestAnimationFrame(() => requestAnimationFrame(() => layer.classList.add('on')));
    const old = [...bg.children].slice(0, -1);
    setTimeout(() => old.forEach((o) => o.remove()), 1600);
    document.body.dataset.mood = name;
  }

  const R = (a, b) => a + Math.random() * (b - a);
  const KINDS = {
    rain:     { n: 140, make: () => ({ x: R(0, W), y: R(-H, H), vx: -1.5, vy: R(14, 22), len: R(10, 22), a: R(0.15, 0.4) }) },
    snow:     { n: 110, make: () => ({ x: R(0, W), y: R(-H, H), vx: R(-0.6, 0.6), vy: R(0.6, 1.8), r: R(1, 3.2), a: R(0.4, 0.9), ph: R(0, 6) }) },
    embers:   { n: 70,  make: () => ({ x: R(0, W), y: R(H * 0.3, H * 1.4), vx: R(-0.5, 0.5), vy: -R(0.6, 2), r: R(1, 2.8), a: R(0.4, 1), ph: R(0, 6) }) },
    ash:      { n: 80,  make: () => ({ x: R(0, W), y: R(-H, H), vx: R(-0.8, 0.3), vy: R(0.3, 1), r: R(1, 2.5), a: R(0.2, 0.5), ph: R(0, 6) }) },
    dust:     { n: 60,  make: () => ({ x: R(0, W), y: R(0, H), vx: R(-0.2, 0.2), vy: R(-0.15, 0.15), r: R(0.8, 2), a: R(0.1, 0.35), ph: R(0, 6) }) },
    stars:    { n: 160, make: () => ({ x: R(0, W), y: R(0, H), vx: 0, vy: 0.05, r: R(0.5, 1.8), a: R(0.3, 1), ph: R(0, 6) }) },
    sparkles: { n: 60,  make: () => ({ x: R(0, W), y: R(0, H), vx: R(-0.3, 0.3), vy: -R(0.1, 0.6), r: R(1, 2.6), a: R(0.3, 1), ph: R(0, 6) }) },
    bubbles:  { n: 45,  make: () => ({ x: R(0, W), y: R(H * 0.2, H * 1.3), vx: R(-0.3, 0.3), vy: -R(0.4, 1.4), r: R(2, 7), a: R(0.15, 0.4), ph: R(0, 6) }) },
  };

  function setWeather(kind) {
    if (reduced) kind = null;
    if (kind === weather) return;
    weather = kind;
    parts = kind && KINDS[kind] ? Array.from({ length: KINDS[kind].n }, KINDS[kind].make) : [];
  }

  let t = 0;
  function frame() {
    t += 0.016;
    ctx.clearRect(0, 0, W, H);
    const k = weather && KINDS[weather];
    if (k) {
      for (const p of parts) {
        p.x += p.vx + (p.ph != null && weather !== 'stars' ? Math.sin(t + p.ph) * 0.3 : 0);
        p.y += p.vy;
        if (p.y > H + 30 || p.y < -H - 30 || p.x < -30 || p.x > W + 30) {
          Object.assign(p, k.make());
          p.y = p.vy > 0 ? -20 : H + 20;
        }
        switch (weather) {
          case 'rain':
            ctx.strokeStyle = `rgba(170,190,220,${p.a})`; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.vx * 1.5, p.y + p.len); ctx.stroke();
            break;
          case 'embers':
            ctx.fillStyle = `rgba(255,${120 + Math.sin(t * 3 + p.ph) * 60 | 0},40,${p.a * (0.6 + 0.4 * Math.sin(t * 4 + p.ph))})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
            break;
          case 'stars':
          case 'sparkles':
            ctx.fillStyle = weather === 'stars' ? `rgba(255,255,255,${p.a * (0.5 + 0.5 * Math.sin(t * 1.5 + p.ph))})` : `rgba(255,230,150,${p.a * (0.5 + 0.5 * Math.sin(t * 3 + p.ph))})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
            break;
          case 'bubbles':
            ctx.strokeStyle = `rgba(180,230,255,${p.a})`; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.stroke();
            break;
          case 'ash':
            ctx.fillStyle = `rgba(160,150,140,${p.a})`;
            ctx.fillRect(p.x, p.y, p.r * 1.6, p.r);
            break;
          default:
            ctx.fillStyle = `rgba(255,255,255,${p.a})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
        }
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function oneShot(name) {
    if (!name || reduced) return;
    const body = document.body;
    if (name === 'flash' || name === 'redflash') {
      flashEl.style.background = name === 'redflash' ? '#b00010' : '#fff';
      flashEl.animate([{ opacity: name === 'redflash' ? 0.6 : 0.85 }, { opacity: 0 }], { duration: 700, easing: 'ease-out' });
      if (name === 'redflash') window.MFAudio && MFAudio.heartbeat();
      return;
    }
    const cls = 'fx-' + name;
    body.classList.remove(cls);
    void body.offsetWidth; // restart animation
    body.classList.add(cls);
    if (name === 'heartbeat' && window.MFAudio) { MFAudio.heartbeat(); setTimeout(() => MFAudio.heartbeat(), 1000); }
    if (name === 'shake' && window.MFAudio) MFAudio.whoosh();
    setTimeout(() => body.classList.remove(cls), 3100);
  }

  window.MFFX = { mood, weather: setWeather, oneShot };
})();
