/*
 * MysteryFate scene backdrops: small flat-silhouette SVG illustrations, one per `scene:` key
 * (see SCENE_KEYS in js/core.js). Colours come from the scene's mood palette via CSS variables,
 * so the same place looks different at night, at dawn, in blood-red or in candlelight.
 *
 * Classes used by shapes (styled in css/style.css):
 *   f = far layer   m = mid layer   n = near layer   l = light   a = accent
 *   g = soft glow (blurred light)   ln = thin light line   fl = flickering   dr = slow drift
 */
(function () {
  'use strict';

  const W = 800, H = 300;

  // mood -> [skyTop, skyBottom, far, mid, near, light]
  const PALETTES = {
    default: ['#1d1a2b', '#0b0a12', '#2a2638', '#1a1724', '#0d0c13', '#ffd98a'],
    night:   ['#1b2440', '#0a0d18', '#222d48', '#141b2e', '#080b14', '#ffe2a0'],
    fog:     ['#5a606a', '#2a2e35', '#4a4f57', '#33373e', '#1c1f24', '#f0f0e6'],
    blood:   ['#4a0a10', '#1d0306', '#3a0c12', '#26070b', '#120305', '#ff6a5a'],
    forest:  ['#2a5236', '#0b1a10', '#1d3a26', '#11261a', '#07120b', '#e0f5a8'],
    ember:   ['#7a3008', '#1a0a04', '#4a1c08', '#2e1106', '#140703', '#ffb347'],
    space:   ['#1a1f4a', '#03051a', '#262c5c', '#161a3a', '#0a0c20', '#9fd3ff'],
    neon:    ['#3a0a5a', '#0b0b2a', '#2a1050', '#1a0c3a', '#0a0620', '#ff6fe0'],
    gold:    ['#5a4312', '#1a1205', '#4a3812', '#30240b', '#160f04', '#ffd76a'],
    ice:     ['#3a6a8a', '#0f1f2c', '#3a5870', '#22384a', '#0e1a24', '#d8f3ff'],
    dawn:    ['#2b3a67', '#e8a87c', '#7a5578', '#4a3352', '#1f1629', '#ffe6b0'],
    office:  ['#3a4446', '#1e2526', '#3d4749', '#2a3233', '#151a1b', '#e6f2ff'],
    void:    ['#0c0c10', '#000000', '#17171c', '#0e0e12', '#060608', '#c8c8d0'],
    storm:   ['#3a4150', '#0f1218', '#2f3542', '#1e222b', '#0c0e12', '#d4e4ff'],
    castle:  ['#4a3b5c', '#120e1a', '#3b2f4a', '#261e30', '#100c16', '#ffd27a'],
    sea:     ['#1a4d85', '#04101f', '#103160', '#0b223f', '#05121f', '#c8ecff'],
    toxic:   ['#3e5a18', '#0b1204', '#2e4a12', '#1c2e0a', '#0a1204', '#d0ff70'],
    candle:  ['#5a3510', '#120a03', '#45290d', '#2a1808', '#120a03', '#ffc46b'],
    sunny:   ['#4ea8de', '#ffe8a3', '#86b9cc', '#4f7f8f', '#2a4a55', '#fffbe0'],
  };

  // ---- tiny SVG helpers -------------------------------------------------------
  // `o` = extra attributes; if it carries its own class="..." that one replaces `cl`.
  const at = (cl, o) => (o && /class="/.test(o) ? ' ' + o : ` class="${cl}"` + (o ? ' ' + o : ''));
  const r = (x, y, w, h, cl, o) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"${at(cl, o)}/>`;
  const p = (pts, cl, o) => `<polygon points="${pts}"${at(cl, o)}/>`;
  const c = (x, y, rad, cl, o) => `<circle cx="${x}" cy="${y}" r="${rad}"${at(cl, o)}/>`;
  const e = (x, y, rx, ry, cl, o) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"${at(cl, o)}/>`;
  const d = (path, cl, o) => `<path d="${path}"${at(cl, o)}/>`;
  const ln = (x1, y1, x2, y2, cl = 'ln', o) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${at(cl, o)}/>`;
  const range = (n) => Array.from({ length: n }, (_, i) => i);

  // deterministic pseudo-random so each backdrop always looks the same
  function rng(seed) {
    let s = seed >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  const stars = (n, seed, maxY = 180) => {
    const R = rng(seed);
    return range(n).map(() => c((R() * W) | 0, (R() * maxY) | 0, (R() * 1.3 + 0.4).toFixed(1), 'l', `opacity="${(R() * 0.6 + 0.2).toFixed(2)}"`)).join('');
  };
  const moon = (x = 640, y = 70, rad = 26) => c(x, y, rad * 2.2, 'g', 'opacity=".35"') + c(x, y, rad, 'l', 'opacity=".9"');
  const glow = (x, y, rad, op = 0.5, extra = '') => c(x, y, rad, `g${extra}`, `opacity="${op}"`);
  const windows = (x, y, w, h, cols, rows, seed, cl = 'l') => {
    const R = rng(seed), out = [];
    const cw = w / cols, rh = h / rows;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      if (R() < 0.45) out.push(r((x + i * cw + cw * 0.25).toFixed(1), (y + j * rh + rh * 0.25).toFixed(1), (cw * 0.5).toFixed(1), (rh * 0.45).toFixed(1), cl, `opacity="${(R() * 0.5 + 0.35).toFixed(2)}"`));
    }
    return out.join('');
  };
  const floor = (y = 240, cl = 'n') => r(0, y, W, H - y, cl);
  const wall = (cl = 'm') => r(0, 0, W, H, cl);
  const triTree = (x, base, h, w, cl) => p(`${x},${base - h} ${x - w / 2},${base} ${x + w / 2},${base}`, cl);
  const treeLine = (n, base, minH, maxH, cl, seed) => {
    const R = rng(seed);
    return range(n).map((i) => triTree(((i + R() * 0.6) * (W / (n - 1))) | 0, base, minH + R() * (maxH - minH), 34 + R() * 30, cl)).join('');
  };
  const ridge = (pts, cl) => p(`0,${H} ${pts} ${W},${H}`, cl);
  const perspectiveRoom = (vx, vy, vw, vh, top = 0, bottom = H) => [
    p(`0,${top} ${W},${top} ${vx + vw},${vy} ${vx},${vy}`, 'm', 'opacity=".9"'),
    p(`0,${bottom} ${W},${bottom} ${vx + vw},${vy + vh} ${vx},${vy + vh}`, 'n'),
    p(`0,${top} ${vx},${vy} ${vx},${vy + vh} 0,${bottom}`, 'f'),
    p(`${W},${top} ${vx + vw},${vy} ${vx + vw},${vy + vh} ${W},${bottom}`, 'f'),
    r(vx, vy, vw, vh, 'm'),
  ].join('');
  const house = (x, base, w, h, seed) => r(x, base - h, w, h, 'm') + p(`${x - 8},${base - h} ${x + w / 2},${base - h - w * 0.45} ${x + w + 8},${base - h}`, 'n') +
    windows(x + 6, base - h + 8, w - 12, h * 0.55, 2, 1, seed) + r(x + w / 2 - 7, base - 26, 14, 26, 'n');
  const waves = (y, cl = 'ln', n = 3) => range(n).map((i) => d(`M0 ${y + i * 16} Q 100 ${y - 8 + i * 16} 200 ${y + i * 16} T 400 ${y + i * 16} T 600 ${y + i * 16} T 800 ${y + i * 16}`, `${cl} dr`, `fill="none" opacity="${0.5 - i * 0.12}"`)).join('');

  // ---- backdrops ---------------------------------------------------------------
  const S = {
    'city-night': () => stars(40, 1, 120) + moon() +
      [[0, 120, 90], [80, 160, 70], [140, 90, 80], [215, 140, 60], [270, 60, 90], [355, 130, 70], [420, 100, 100], [515, 150, 60], [570, 80, 85], [650, 125, 70], [715, 95, 85]]
        .map(([x, y, w], i) => r(x, y, w, H - y, 'f') + windows(x + 4, y + 8, w - 8, 200 - y + 40, 4, 6, i + 3)).join('') +
      ridge('0,250 120,246 260,252 420,244 560,250 800,246', 'n'),

    street: () => stars(25, 2, 90) + moon(120, 60, 20) + ridge('0,190 200,170 420,186 620,165 800,180', 'f') +
      house(40, 240, 120, 80, 4) + house(220, 240, 100, 95, 5) + house(470, 240, 130, 85, 6) + house(660, 240, 110, 70, 7) +
      [370, 630].map((x) => r(x, 150, 5, 90, 'n') + r(x - 8, 146, 21, 7, 'n') + glow(x + 2, 160, 34, 0.55, ' fl')).join('') +
      floor(240) + r(0, 262, W, 4, 'l', 'opacity=".15"'),

    lobby: () => wall() + r(0, 0, W, 40, 'f') + [60, 200, 600, 740].map((x) => r(x - 18, 40, 36, 210, 'f') + r(x - 24, 40, 48, 12, 'n')).join('') +
      r(330, 90, 140, 160, 'n') + r(336, 96, 62, 154, 'f') + r(402, 96, 62, 154, 'f') + glow(400, 76, 40, 0.5, ' fl') + r(380, 70, 40, 10, 'l', 'opacity=".7"') +
      floor(250) + r(480, 205, 120, 45, 'n') + r(470, 200, 140, 8, 'f') + glow(530, 190, 22, 0.4),

    elevator: () => wall('f') + r(160, 30, 480, 240, 'm') + r(170, 40, 225, 230, 'n') + r(405, 40, 225, 230, 'n') + ln(400, 40, 400, 270, 'ln', 'opacity=".6"') +
      r(660, 80, 70, 150, 'n') + range(6).map((i) => c(682 + (i % 2) * 26, 100 + ((i / 2) | 0) * 40, 8, i === 5 ? 'a' : 'l', `opacity="${i === 5 ? 1 : 0.35}"`)).join('') +
      r(250, 10, 300, 10, 'l', 'opacity=".8"') + glow(400, 18, 120, 0.25, ' fl') + floor(270, 'n'),

    corridor: () => perspectiveRoom(350, 110, 100, 80) +
      range(4).map((i) => { const t = i / 4, x = 30 + t * 300, h2 = 220 - t * 150, y = 60 + t * 55; return p(`${x},${y} ${x + 44 - t * 30},${y + 10 * (1 - t)} ${x + 44 - t * 30},${y + h2 - 10 * (1 - t)} ${x},${y + h2}`, 'n', 'opacity=".75"'); }).join('') +
      range(4).map((i) => { const t = i / 4, x = W - 30 - t * 300; return p(`${x},${60 + t * 55} ${x - 44 + t * 30},${70 + t * 45} ${x - 44 + t * 30},${270 - t * 90} ${x},${280 - t * 95}`, 'n', 'opacity=".75"'); }).join('') +
      range(4).map((i) => { const t = i / 4; return r(400 - (90 - t * 70), 12 + t * 85, (90 - t * 70) * 2, 6 - t * 3, 'l', `opacity="${0.8 - t * 0.4}" class="l fl"`); }).join('') +
      glow(400, 150, 50, 0.3),

    stairwell: () => wall() + range(5).map((i) => p(`${120 + i * 60},${270 - i * 45} ${180 + i * 60},${270 - i * 45} ${180 + i * 60},${285 - i * 45} ${120 + i * 60},${285 - i * 45}`, 'n')).join('') +
      p('120,285 420,90 440,90 140,300', 'f') + ln(120, 245, 420, 50, 'ln', 'opacity=".6"') + range(6).map((i) => ln(130 + i * 58, 240 - i * 38, 130 + i * 58, 270 - i * 40, 'ln', 'opacity=".4"')).join('') +
      p('500,40 760,40 760,300 500,300', 'f', 'opacity=".6"') + r(580, 60, 40, 30, 'n') + glow(600, 55, 50, 0.45, ' fl') + c(600, 52, 6, 'l') + floor(280),

    apartment: () => wall() + r(90, 50, 220, 150, 'f') + r(98, 58, 204, 134, 'n', 'opacity=".6"') + stars(10, 9, 40).replace(/cx="(\d+)"/g, (m, x) => `cx="${100 + (x % 190)}"`) + c(250, 95, 14, 'l', 'opacity=".8"') +
      ln(200, 58, 200, 192, 'ln') + ln(98, 125, 302, 125, 'ln') +
      r(400, 170, 260, 60, 'n') + r(390, 150, 30, 80, 'n') + r(640, 150, 30, 80, 'n') + r(420, 150, 220, 30, 'f') +
      r(720, 90, 4, 150, 'n') + p('700,90 744,90 734,65 710,65', 'l', 'opacity=".8"') + glow(722, 95, 70, 0.4) + floor(240),

    house: () => wall() + r(70, 40, 260, 160, 'f') + r(78, 48, 244, 144, 'l', 'opacity=".12"') + ln(200, 48, 200, 192, 'ln') + ln(78, 120, 322, 120, 'ln') +
      r(430, 70, 200, 110, 'n') + r(438, 78, 184, 94, 'a', 'opacity=".55" class="a fl"') + glow(530, 125, 120, 0.25) + r(520, 180, 20, 30, 'n') +
      r(380, 200, 300, 40, 'f') + r(400, 180, 260, 30, 'n') +
      r(700, 165, 26, 40, 'n') + e(713, 165, 13, 4, 'a', 'class="a fl"') + glow(713, 165, 26, 0.45) + floor(240),

    kitchen: () => wall() + r(40, 40, 480, 70, 'f') + range(4).map((i) => r(50 + i * 118, 48, 108, 54, 'n', 'opacity=".5"')).join('') +
      r(40, 170, 480, 70, 'f') + r(30, 160, 500, 12, 'n') + r(600, 40, 140, 200, 'f') + ln(600, 120, 740, 120, 'ln') + r(720, 60, 6, 40, 'l', 'opacity=".5"') +
      ln(300, 0, 300, 90, 'ln') + p('270,90 330,90 318,110 282,110', 'n') + glow(300, 118, 55, 0.45, ' fl') + floor(240),

    basement: () => wall('f') + range(3).map((i) => r(0, 30 + i * 22, W, 8, 'm')).join('') + r(560, 30, 8, 120, 'm') +
      ln(400, 0, 400, 80, 'ln') + c(400, 88, 8, 'l', 'class="l fl"') + glow(400, 92, 80, 0.35, ' fl') +
      r(80, 180, 90, 60, 'n') + r(150, 150, 70, 90, 'n') + r(600, 190, 120, 50, 'n') + r(640, 160, 60, 30, 'n') + floor(240, 'm') + r(0, 240, W, 60, 'n', 'opacity=".7"'),

    office: () => wall() + r(0, 30, W, 90, 'f') + windows(0, 30, W, 90, 10, 2, 11) + range(5).map((i) => r(40 + i * 160, 12, 110, 5, 'l', 'class="l fl" opacity=".8"')).join('') +
      range(4).map((i) => { const x = 30 + i * 200; return r(x, 190, 160, 12, 'n') + r(x + 10, 202, 8, 40, 'n') + r(x + 142, 202, 8, 40, 'n') + r(x + 50, 145, 60, 42, 'n') + r(x + 55, 150, 50, 32, 'l', 'opacity=".35"') + r(x + 76, 187, 8, 4, 'n'); }).join('') +
      floor(242),

    boardroom: () => wall() + r(240, 30, 320, 130, 'n') + r(250, 40, 300, 110, 'a', 'class="a fl" opacity=".35"') + glow(400, 95, 160, 0.2) +
      p('330,190 470,190 640,290 160,290', 'n') + range(4).map((i) => r(150 + i * 25 - 40, 205 + i * 22, 30, 30, 'f') + r(625 - i * 25 + 10, 205 + i * 22, 30, 30, 'f')).join('') + floor(285, 'f'),

    lair: () => wall('f') + r(180, 20, 440, 180, 'n') + r(190, 30, 420, 160, 'a', 'class="a fl" opacity=".3"') + c(400, 110, 55, 'a', 'opacity=".75"') + c(400, 110, 35, 'n') + p('400,80 425,130 375,130', 'a') +
      glow(400, 110, 200, 0.2) + r(0, 210, W, 8, 'm') + range(16).map((i) => ln(i * 52, 210, i * 52, 240, 'ln', 'opacity=".4"')).join('') + ln(0, 200, W, 200, 'ln') +
      r(60, 60, 40, 180, 'm') + r(700, 60, 40, 180, 'm') + floor(250),

    lab: () => wall() + r(60, 40, 180, 110, 'n') + r(70, 50, 160, 90, 'l', 'opacity=".25" class="l fl"') + r(560, 40, 180, 110, 'n') + r(570, 50, 160, 90, 'a', 'opacity=".25"') +
      r(80, 200, 640, 14, 'n') + r(100, 214, 12, 30, 'n') + r(690, 214, 12, 30, 'n') +
      [[200, 'a'], [300, 'l'], [420, 'a'], [520, 'l']].map(([x, cl]) => p(`${x},150 ${x + 12},150 ${x + 12},170 ${x + 30},200 ${x - 18},200 ${x},170`, 'f') + p(`${x - 10},188 ${x + 22},188 ${x + 30},200 ${x - 18},200`, cl, 'opacity=".8"') + glow(x + 6, 192, 26, 0.4)).join('') + floor(244),

    wedding: () => stars(15, 13, 90) + ridge('0,200 260,185 540,195 800,182', 'f') +
      d('M300 250 L300 110 Q400 20 500 110 L500 250', 'n', 'style="fill:none;stroke:var(--near);stroke-width:16"') +
      range(14).map((i) => { const t = i / 13, a = Math.PI * (1 - t); return c((400 + Math.cos(a) * 100) | 0, (110 - Math.sin(a) * 80) | 0, 9, i % 3 ? 'a' : 'l', 'opacity=".85"'); }).join('') +
      p('370,250 430,250 520,300 280,300', 'l', 'opacity=".2"') + range(3).map((i) => r(120 - i * 30, 230 + i * 20, 150, 8, 'n') + r(530 + i * 30, 230 + i * 20, 150, 8, 'n')).join('') + glow(400, 120, 90, 0.25) + floor(250, 'm'),

    church: () => wall() + d('M330 230 L330 90 Q400 10 470 90 L470 230 Z', 'n') + d('M342 222 L342 95 Q400 28 458 95 L458 222 Z', 'a', 'opacity=".45"') +
      ln(400, 30, 400, 222, 'ln') + ln(342, 130, 458, 130, 'ln') + ln(342, 175, 458, 175, 'ln') + glow(400, 130, 140, 0.3) +
      range(4).map((i) => r(40 + i * 15, 200 + i * 20, 230 - i * 10, 12, 'n') + r(530 - i * 5, 200 + i * 20, 230 - i * 10, 12, 'n')).join('') + p('370,240 430,240 470,300 330,300', 'a', 'opacity=".25"') + floor(240, 'f'),

    'radio-studio': () => wall() + range(8).map((i) => r(i * 100 + 6, 20, 88, 60, 'f')).join('') + r(560, 100, 110, 34, 'n') + r(568, 106, 94, 22, 'a', 'class="a fl"') + glow(615, 117, 70, 0.4) +
      r(120, 200, 560, 40, 'n') + range(18).map((i) => c(150 + i * 28, 214, 4, i % 4 ? 'l' : 'a', `opacity="${i % 3 ? 0.5 : 0.9}"`)).join('') +
      ln(320, 200, 320, 130, 'ln') + e(320, 118, 16, 24, 'n') + d('M440 160 Q470 120 500 160', 'n', 'style="fill:none;stroke:var(--near);stroke-width:7"') + r(434, 158, 14, 22, 'n') + r(492, 158, 14, 22, 'n') + floor(240),

    'train-car': () => wall() + range(4).map((i) => r(40 + i * 190, 50, 150, 100, 'f') + r(48 + i * 190, 58, 134, 84, 'l', 'opacity=".12"') + p(`${48 + i * 190},${142} ${100 + i * 190},${110} ${150 + i * 190},${125} ${182 + i * 190},${105} ${182 + i * 190},142`, 'm')).join('') +
      range(4).map((i) => r(70 + i * 190, 165, 90, 10, 'n') + r(110 + i * 190, 175, 10, 50, 'n') + r(95 + i * 190, 140, 6, 25, 'n') + glow(98 + i * 190, 138, 26, 0.45, ' fl')).join('') +
      r(0, 230, W, 70, 'n') + r(0, 225, W, 6, 'a', 'opacity=".5"'),

    'train-exterior': () => stars(30, 17, 100) + moon(140, 60, 18) + ridge('0,200 100,110 180,170 280,80 380,160 470,95 560,165 660,70 800,150', 'f') +
      p('100,110 115,125 85,125', 'l', 'opacity=".5"') + p('280,80 300,100 262,100', 'l', 'opacity=".5"') + p('660,70 682,92 640,92', 'l', 'opacity=".5"') +
      r(0, 236, W, 64, 'm') + r(0, 232, W, 4, 'n') + range(5).map((i) => r(60 + i * 140, 190, 130, 42, 'n') + windows(66 + i * 140, 196, 118, 20, 5, 1, 20 + i)).join('') +
      p('760,190 800,190 800,232 740,232', 'n') + glow(790, 210, 60, 0.4),

    tunnel: () => wall('n') + range(5).map((i) => e(400, 300, 380 - i * 70, 280 - i * 55, i % 2 ? 'm' : 'f')).join('') + e(400, 300, 30, 40, 'l', 'opacity=".7"') + glow(400, 280, 80, 0.5) +
      p('390,300 410,300 560,300 240,300', 'n') + ln(380, 262, 200, 300, 'ln', 'opacity=".5"') + ln(420, 262, 600, 300, 'ln', 'opacity=".5"'),

    checkpoint: () => stars(20, 19, 90) + r(0, 150, W, 90, 'f') + range(20).map((i) => r(i * 40, 146, 38, 6, 'm')).join('') +
      r(600, 40, 50, 200, 'm') + r(585, 30, 80, 40, 'n') + windows(590, 36, 70, 26, 3, 1, 21) + p('610,60 330,240 470,240', 'l', 'opacity=".12" class="l fl"') + glow(610, 55, 30, 0.6) +
      r(140, 170, 12, 70, 'n') + range(6).map((i) => r(152 + i * 45, 186, 45, 10, i % 2 ? 'a' : 'l', 'opacity=".85"')).join('') + floor(240),

    station: () => wall('f') + range(4).map((i) => r(110 + i * 200, 20, 26, 200, 'm')).join('') + r(0, 10, W, 14, 'm') + c(400, 70, 30, 'n') + c(400, 70, 24, 'l', 'opacity=".75"') + ln(400, 70, 400, 52, 'ln', 'style="stroke:var(--near)"') + ln(400, 70, 414, 76, 'ln', 'style="stroke:var(--near)"') +
      r(0, 220, W, 20, 'm') + r(0, 216, W, 4, 'a', 'opacity=".7"') + r(0, 240, W, 60, 'n') + ln(0, 262, W, 262) + ln(0, 285, W, 285) + glow(40, 250, 60, 0.35, ' fl'),

    forest: () => stars(30, 23, 110) + moon(600, 60, 22) + treeLine(14, 230, 100, 150, 'f', 24) + treeLine(10, 260, 140, 200, 'm', 25) + floor(255) + treeLine(5, 300, 180, 260, 'n', 26),

    cottage: () => stars(25, 27, 100) + moon(140, 55, 18) + ridge('0,210 200,180 400,200 600,170 800,195', 'f') + treeLine(8, 230, 80, 120, 'm', 28) +
      r(330, 160, 160, 80, 'm') + p('315,160 410,95 505,160', 'n') + r(450, 100, 18, 40, 'n') + r(350, 180, 34, 26, 'l', 'opacity=".75" class="l fl"') + r(436, 180, 34, 26, 'l', 'opacity=".6"') + r(395, 195, 26, 45, 'n') +
      range(3).map((i) => c(462 + i * 10, 88 - i * 18, 8 + i * 4, 'f', `opacity="${0.6 - i * 0.15}" class="f dr"`)).join('') + glow(370, 192, 60, 0.3) + floor(240),

    village: () => stars(20, 29, 90) + moon(660, 55, 18) + r(370, 60, 50, 170, 'f') + p('360,60 395,10 430,60', 'f') + c(395, 90, 12, 'l', 'opacity=".6"') +
      [[20, 90, 70], [120, 70, 90], [230, 100, 60], [460, 80, 80], [560, 100, 70], [660, 75, 100]].map(([x, w, h], i) => r(x, 240 - h, w, h, 'm') + p(`${x - 6},${240 - h} ${x + w / 2},${200 - h} ${x + w + 6},${240 - h}`, 'n') + windows(x + 6, 250 - h, w - 12, h - 20, 2, 2, 30 + i)).join('') + floor(240),

    castle: () => stars(35, 31, 120) + moon(150, 60, 22) + ridge('0,250 150,220 300,180 400,170 500,180 650,220 800,240', 'f') +
      r(300, 100, 200, 90, 'm') + [290, 375, 470].map((x, i) => r(x, i === 1 ? 50 : 80, i === 1 ? 50 : 40, i === 1 ? 140 : 110, 'm') + range(i === 1 ? 4 : 3).map((k) => r(x + k * 14, (i === 1 ? 40 : 70), 9, 10, 'm')).join('')).join('') +
      windows(310, 110, 180, 60, 6, 2, 32) + r(385, 150, 30, 40, 'n') + floor(255),

    throne: () => wall('f') + range(4).map((i) => r(40 + i * 70, 20, 30, 260, 'm') + r(700 - i * 70, 20, 30, 260, 'm')).join('') +
      p('380,190 420,190 560,300 240,300', 'a', 'opacity=".45"') + r(320, 175, 160, 20, 'n') + r(350, 80, 100, 100, 'n') + p('350,80 400,40 450,80', 'n') + r(370, 110, 60, 50, 'a', 'opacity=".35"') +
      glow(400, 100, 150, 0.2) + range(2).map((i) => p(`${230 + i * 310},30 ${270 + i * 310},30 ${270 + i * 310},120 ${250 + i * 310},105 ${230 + i * 310},120`, 'a', 'opacity=".55"')).join('') + floor(280, 'n'),

    bridge: () => stars(20, 33, 90) + moon(620, 60, 20) + p('0,140 220,150 250,300 0,300', 'm') + p('560,150 800,135 800,300 540,300', 'm') +
      d('M200 150 L600 150 L600 175 Q400 200 200 175 Z', 'n') + range(9).map((i) => r(205 + i * 48, 132, 6, 20, 'n')).join('') + d('M260 175 Q400 330 540 175', 'n', 'style="fill:none;stroke:var(--near);stroke-width:12"') +
      e(400, 285, 300, 30, 'l', 'opacity=".12" class="l dr"'),

    cave: () => wall('n') + e(400, 200, 300, 150, 'f') + e(400, 210, 220, 110, 'm') + glow(400, 230, 120, 0.35) +
      range(10).map((i) => p(`${i * 85},0 ${i * 85 + 30},0 ${i * 85 + 15},${50 + ((i * 37) % 70)}`, 'n')).join('') +
      range(7).map((i) => p(`${60 + i * 115},300 ${100 + i * 115},300 ${80 + i * 115},${250 - ((i * 23) % 50)}`, 'n')).join('') + floor(280),

    crater: () => stars(30, 35, 120) + ridge('0,190 200,175 420,185 620,170 800,185', 'f') + floor(200, 'm') +
      e(400, 235, 260, 45, 'n') + e(400, 232, 210, 32, 'a', 'opacity=".5" class="a fl"') + glow(400, 225, 140, 0.3) + glow(400, 215, 60, 0.4, ' fl') +
      range(6).map((i) => p(`${100 + i * 120},${270 + (i % 2) * 10} ${120 + i * 120},${245 + (i % 3) * 8} ${145 + i * 120},${272}`, 'n')).join(''),

    mountains: () => stars(25, 37, 100) + moon(160, 60, 18) + ridge('0,180 120,90 220,150 340,60 460,150 560,80 680,160 800,100', 'f') +
      p('340,60 368,90 312,90', 'l', 'opacity=".55"') + p('560,80 584,104 536,104', 'l', 'opacity=".55"') + p('120,90 140,110 100,110', 'l', 'opacity=".55"') +
      ridge('0,230 160,170 300,215 460,160 620,220 800,175', 'm') + ridge('0,270 200,240 400,262 600,236 800,258', 'n'),

    library: () => wall('f') + range(3).map((s) => { const x = 20 + s * 270; return r(x, 20, 220, 220, 'm') + range(4).map((row) => {
      const R = rng(s * 10 + row); let bx = x + 8, out = '';
      while (bx < x + 205) { const bw = 8 + R() * 10, bh = 32 + R() * 14; out += r(bx | 0, (70 + row * 52 - bh) | 0, bw | 0, bh | 0, R() < 0.2 ? 'a' : R() < 0.5 ? 'n' : 'f', 'opacity=".9"'); bx += bw + 2; }
      return out + r(x, 70 + row * 52, 220, 5, 'n');
    }).join(''); }).join('') + r(240, 220, 320, 20, 'n') + r(300, 200, 120, 22, 'l', 'opacity=".35"') + r(480, 196, 8, 24, 'l') + glow(484, 190, 60, 0.5, ' fl') + floor(240, 'n'),

    sea: () => stars(30, 39, 120) + moon(560, 70, 24) + r(0, 160, W, 140, 'm') + e(560, 200, 40, 90, 'l', 'opacity=".1"') + waves(185, 'ln', 6),

    lighthouse: () => stars(25, 41, 120) + r(0, 190, W, 110, 'm') + waves(205, 'ln', 4) +
      p('430,300 470,190 640,200 720,300', 'n') + p('520,200 580,200 570,70 530,70', 'f') + range(3).map((i) => p(`${523 - i * 0},${180 - i * 40} ${577},${180 - i * 40} ${576},${165 - i * 40} ${524},${165 - i * 40}`, 'a', 'opacity=".7"')).join('') +
      r(520, 45, 60, 25, 'm') + p('515,45 550,22 585,45', 'n') + r(530, 48, 40, 18, 'l', 'class="l fl"') +
      `<g class="beam">${p('550,57 120,0 120,120', 'l', 'opacity=".12"')}</g>` + glow(550, 57, 70, 0.6, ' fl'),

    'lamp-room': () => stars(30, 43, 200) + r(0, 210, W, 90, 'm') + waves(225, 'ln', 3) + range(5).map((i) => r(i * 170 - 10, 0, 18, 300, 'n')).join('') + r(0, 0, W, 22, 'n') + r(0, 250, W, 50, 'n') +
      glow(400, 150, 120, 0.3, ' fl') + range(5).map((i) => c(400, 150, 90 - i * 16, 'l', `opacity="${0.15 + i * 0.08}" style="fill:none;stroke:var(--light);stroke-width:2"`)).join('') + c(400, 150, 16, 'l'),

    'ship-corridor': () => wall('f') + range(5).map((i) => {
      const s = 1 - i * 0.18, w = 700 * s, h = 270 * s, x = 400 - w / 2, y = 150 - h / 2, cut = 40 * s;
      return p(`${x + cut},${y} ${x + w - cut},${y} ${x + w},${y + cut} ${x + w},${y + h - cut} ${x + w - cut},${y + h} ${x + cut},${y + h} ${x},${y + h - cut} ${x},${y + cut}`, i % 2 ? 'm' : 'n', 'opacity=".9"');
    }).join('') + r(330, 130, 140, 50, 'f') + range(4).map((i) => r(400 - (220 - i * 45), 236 - i * 22, (220 - i * 45) * 2, 3, 'a', `opacity="${0.8 - i * 0.15}" class="a fl"`)).join('') + glow(400, 155, 70, 0.3),

    cryo: () => wall() + r(0, 0, W, 30, 'f') + range(5).map((i) => { const x = 50 + i * 150; return r(x, 60, 100, 190, 'n', 'rx="40"') + r(x + 12, 75, 76, 160, 'l', 'rx="32" opacity=".22"') + c(x + 50, 110, 14, 'f', 'opacity=".55"') + r(x + 30, 255, 40, 6, i === 2 ? 'a' : 'l', `class="${i === 2 ? 'a' : 'l'} fl"`); }).join('') +
      glow(400, 150, 180, 0.1) + floor(262, 'n'),

    'ship-bridge': () => wall('n') + d('M60 30 L740 30 L680 180 L120 180 Z', 'f') + stars(40, 47, 180).replace(/<circle/g, '<circle clip-path="url(#vp)"') +
      `<clipPath id="vp"><path d="M60 30 L740 30 L680 180 L120 180 Z"/></clipPath>` + c(560, 110, 44, 'a', 'opacity=".55" clip-path="url(#vp)"') +
      r(80, 200, 220, 50, 'm') + r(500, 200, 220, 50, 'm') + range(14).map((i) => r(95 + (i % 7) * 28 + (i >= 7 ? 420 : 0), 212, 16, 6, i % 3 ? 'l' : 'a', 'opacity=".75"')).join('') +
      r(360, 210, 80, 60, 'f') + r(370, 170, 60, 45, 'f') + floor(270, 'f'),

    planet: () => stars(60, 49, 170) + c(170, 70, 40, 'a', 'opacity=".55"') + c(620, 50, 18, 'l', 'opacity=".7"') +
      ridge('0,210 120,190 180,120 210,190 380,200 520,140 560,190 800,180', 'm') + p('180,120 192,150 168,150', 'f') + ridge('0,260 200,240 420,256 640,236 800,252', 'n'),

    space: () => stars(90, 51, 300) + c(560, 190, 110, 'a', 'opacity=".55"') + c(540, 175, 110, 'f', 'opacity=".55"') + e(560, 190, 190, 22, 'l', 'style="fill:none;stroke:var(--light);stroke-width:3" opacity=".5"') +
      p('150,90 210,100 150,110 160,100', 'l', 'opacity=".9"') + glow(148, 100, 18, 0.6, ' fl'),

    ballroom: () => wall() + range(5).map((i) => d(`M${i * 170 - 20} 250 L${i * 170 - 20} 90 Q${i * 170 + 50} 20 ${i * 170 + 120} 90 L${i * 170 + 120} 250 Z`, 'f')).join('') +
      ln(400, 0, 400, 40) + range(9).map((i) => c(330 + i * 17.5, 60 + Math.abs(i - 4) * -4 + 16, 5, 'l')).join('') + e(400, 70, 75, 14, 'l', 'opacity=".25"') + glow(400, 70, 95, 0.35, ' fl') +
      floor(250, 'n') + e(400, 275, 260, 20, 'l', 'opacity=".12"'),

    terrace: () => stars(25, 53, 90) + moon(150, 55, 20) + [[200, 120, 60], [270, 90, 50], [330, 130, 70], [410, 80, 50], [470, 110, 80], [560, 140, 50], [620, 100, 70]].map(([x, y, w], i) => r(x, y, w, 180 - y + 20, 'f') + windows(x + 3, y + 6, w - 6, 160 - y, 3, 4, 54 + i)).join('') +
      r(0, 200, W, 14, 'n') + range(24).map((i) => r(10 + i * 33, 214, 14, 36, 'n') + e(17 + i * 33, 232, 10, 10, 'n')).join('') + r(0, 248, W, 52, 'm'),

    vault: () => wall() + c(400, 150, 120, 'n') + c(400, 150, 100, 'f') + c(400, 150, 26, 'n') + range(6).map((i) => { const a = (i * Math.PI) / 3; return ln(400, 150, 400 + Math.cos(a) * 80, 150 + Math.sin(a) * 80, 'ln', 'style="stroke:var(--near);stroke-width:8"'); }).join('') +
      range(6).map((i) => ln(0, 40 + i * 45, W, 80 + i * 30, 'a', 'style="stroke:var(--accent);stroke-width:2" opacity=".7" class="a fl"')).join('') + floor(270),

    rooftop: () => stars(40, 57, 140) + moon(620, 60, 24) + p('0,300 0,190 120,150 240,190 240,300', 'm') + p('220,300 220,210 380,170 520,210 520,300', 'f') + p('500,300 500,200 650,160 800,200 800,300', 'm') +
      r(80, 140, 22, 40, 'n') + r(420, 150, 22, 50, 'n') + r(700, 140, 22, 40, 'n') + ln(360, 172, 360, 110, 'ln') + ln(345, 120, 375, 120, 'ln') + glow(360, 108, 10, 0.8, ' fl'),

    // ---- survival / adventure
    glacier: () => stars(20, 61, 80) + ridge('0,150 140,90 260,140 380,70 520,130 660,85 800,140', 'f') +
      ridge('0,215 180,195 360,210 560,190 800,205', 'm') + r(0, 225, W, 75, 'l', 'opacity=".14"') +
      p('330,300 385,222 425,222 480,300', 'n') + p('370,300 392,232 418,232 440,300', 'f', 'opacity=".6"') +
      range(6).map((i) => ln(60 + i * 130, 250 + (i % 2) * 18, 110 + i * 130, 246 + (i % 2) * 18, 'ln', 'opacity=".35"')).join(''),

    wreckage: () => stars(15, 63, 90) + ridge('0,170 200,130 400,160 600,120 800,160', 'f') + ridge('0,220 300,205 600,215 800,205', 'm') +
      r(0, 230, W, 70, 'l', 'opacity=".14"') + glow(560, 170, 70, 0.35, ' fl') +
      d('M180 238 L520 202 Q562 196 568 214 L572 234 L190 264 Z', 'n') +
      range(6).map((i) => r(230 + i * 50, 224 - i * 5, 16, 10, 'l', 'class="l fl" opacity=".45"')).join('') +
      p('380,216 470,150 502,156 432,224', 'f') + p('566,216 650,242 606,256', 'n') + p('170,240 120,250 150,272 196,262', 'f'),

    'ship-deck': () => stars(30, 65, 120) + moon(620, 60, 20) + r(0, 165, W, 135, 'm') + waves(176, 'ln', 2) +
      p('0,300 0,215 800,195 800,300', 'n') + range(14).map((i) => ln(i * 60, 215 - i * 1.4, i * 60, 190 - i * 1.4, 'ln', 'opacity=".45"')).join('') +
      ln(0, 190, 800, 170, 'ln', 'opacity=".45"') + r(380, 0, 14, 210, 'f') + ln(387, 30, 470, 0, 'ln', 'opacity=".4"') +
      d('M394 28 Q478 70 394 122 Z', 'l', 'opacity=".22"') + d('M394 132 Q500 160 394 192 Z', 'l', 'opacity=".18"') +
      c(200, 232, 26, 'f', 'style="fill:none;stroke:var(--far);stroke-width:5"') +
      range(4).map((i) => { const a = (i * Math.PI) / 4; return ln(200 - Math.cos(a) * 36, 232 - Math.sin(a) * 36, 200 + Math.cos(a) * 36, 232 + Math.sin(a) * 36, 'ln', 'style="stroke:var(--far);stroke-width:4"'); }).join('') +
      ln(650, 160, 650, 188, 'ln') + r(642, 188, 16, 22, 'l', 'class="l fl" opacity=".85"') + glow(650, 199, 55, 0.45, ' fl'),

    'ship-hold': () => wall('f') + range(5).map((i) => r(0, 40 + i * 48, W, 4, 'm', 'opacity=".6"')).join('') +
      range(7).map((i) => d(`M${i * 130 - 10} 300 Q${i * 130 - 44} 150 ${i * 130 + 20} 0`, 'n', 'style="fill:none;stroke:var(--near);stroke-width:14"')).join('') +
      floor(250, 'n') + [[110, 205], [180, 212], [580, 205], [650, 210]].map(([x, y]) => e(x, y, 30, 40, 'm') +
        ln(x - 29, y - 14, x + 29, y - 14, 'ln', 'opacity=".35"') + ln(x - 29, y + 14, x + 29, y + 14, 'ln', 'opacity=".35"')).join('') +
      ln(400, 0, 400, 70, 'ln') + r(388, 70, 24, 32, 'n') + r(392, 76, 16, 20, 'l', 'class="l fl"') + glow(400, 88, 100, 0.45, ' fl'),

    island: () => stars(20, 67, 100) + moon(150, 60, 20) + r(0, 175, W, 125, 'm') + waves(186, 'ln', 3) +
      e(520, 258, 340, 62, 'l', 'opacity=".22"') + e(520, 270, 330, 52, 'f') +
      d('M560 258 Q568 170 610 92', 'n', 'style="fill:none;stroke:var(--near);stroke-width:10"') +
      range(6).map((i) => { const a = -0.4 + i * 0.7; return d(`M610 92 Q${(610 + Math.cos(a) * 55).toFixed(0)} ${(62 + Math.sin(a) * 18).toFixed(0)} ${(610 + Math.cos(a) * 105).toFixed(0)} ${(112 + Math.sin(a) * 50).toFixed(0)}`, 'n', 'style="fill:none;stroke:var(--near);stroke-width:8"'); }).join('') +
      r(300, 246, 46, 26, 'n') + r(300, 246, 46, 8, 'a', 'opacity=".7"'),

    // ---- everyday
    'gas-station': () => stars(25, 69, 110) + floor(235, 'n') + range(8).map((i) => r(i * 110, 270, 60, 4, 'l', 'opacity=".25"')).join('') +
      r(470, 110, 300, 125, 'm') + r(490, 130, 160, 80, 'l', 'opacity=".55"') + r(670, 140, 60, 95, 'n') + r(470, 95, 300, 18, 'a', 'opacity=".8"') +
      glow(250, 130, 170, 0.25) + r(80, 80, 340, 22, 'f') + range(4).map((i) => r(110 + i * 90, 100, 40, 4, 'l', 'class="l fl"')).join('') +
      [150, 330].map((x) => r(x - 6, 102, 12, 133, 'f') + r(x - 22, 165, 44, 70, 'm') + r(x - 14, 175, 28, 18, 'l', 'opacity=".6"')).join('') +
      r(30, 60, 22, 175, 'f') + r(10, 28, 62, 40, 'a', 'opacity=".85"'),

    shop: () => wall('f') + r(0, 0, W, 24, 'n') + range(5).map((i) => r(80 + i * 140, 8, 90, 6, 'l', 'class="l fl" opacity=".8"')).join('') +
      r(40, 46, 720, 134, 'm') + range(6).map((i) => r(50 + i * 118, 54, 108, 118, 'l', 'opacity=".16"') +
        r(50 + i * 118, 96, 108, 3, 'l', 'opacity=".3"') + r(50 + i * 118, 136, 108, 3, 'l', 'opacity=".3"')).join('') +
      floor(220, 'n') + [[60, 330], [470, 740]].map(([a, b]) => r(a, 150, b - a, 90, 'f') +
        range(3).map((j) => r(a + 6, 162 + j * 24, b - a - 12, 3, 'l', 'opacity=".22"')).join('')).join('') +
      r(728, 32, 26, 14, 'n') + c(734, 39, 3, 'a', 'class="a fl"'),

    'hotel-room': () => wall() + r(60, 40, 200, 140, 'f') + r(70, 50, 180, 120, 'n', 'opacity=".7"') + windows(70, 80, 180, 90, 8, 3, 71) +
      r(40, 30, 40, 190, 'n') + r(240, 30, 40, 190, 'n') + floor(230, 'n') +
      r(345, 100, 290, 60, 'f') + r(330, 150, 320, 82, 'm') + r(330, 150, 320, 14, 'l', 'opacity=".2"') +
      r(360, 132, 70, 22, 'l', 'opacity=".3"') + r(550, 132, 70, 22, 'l', 'opacity=".3"') +
      r(684, 170, 60, 60, 'n') + ln(714, 170, 714, 116, 'ln') + p('694,116 734,116 744,84 684,84', 'l', 'opacity=".8"') + glow(714, 100, 75, 0.45),

    gym: () => wall() + r(0, 0, W, 28, 'f') + floor(225, 'n') + range(9).map((i) => ln(i * 100, 225, i * 100 - 70, 300, 'ln', 'opacity=".18"')).join('') +
      range(4).map((i) => r(0, 110 + i * 30, 80 + i * 60, 30, i % 2 ? 'f' : 'm')).join('') +
      range(4).map((i) => r(W - 80 - i * 60, 110 + i * 30, 80 + i * 60, 30, i % 2 ? 'f' : 'm')).join('') +
      r(360, 50, 80, 55, 'm') + r(372, 62, 56, 32, 'l', 'opacity=".18"') + r(382, 105, 36, 4, 'a') +
      r(230, 128, 340, 28, 'a', 'opacity=".55"') + glow(220, 250, 90, 0.2) + glow(580, 250, 90, 0.2) +
      range(16).map((i) => c(25 + i * 50, 18 + (i % 2) * 14, 4, i % 3 ? 'l' : 'a', `class="${i % 3 ? 'l' : 'a'} fl"`)).join(''),

    attic: () => wall('n') + p('0,300 400,10 800,300', 'm') + range(5).map((i) => ln(400, 10, i * 200, 300, 'ln', 'opacity=".22"')).join('') +
      range(3).map((i) => ln(400 - (i + 1) * 99, 10 + (i + 1) * 72, 400 + (i + 1) * 99, 10 + (i + 1) * 72, 'ln', 'opacity=".28"')).join('') +
      glow(400, 130, 110, 0.25) + c(400, 120, 34, 'f') + c(400, 120, 28, 'l', 'opacity=".35"') + ln(372, 120, 428, 120, 'ln') + ln(400, 92, 400, 148, 'ln') +
      floor(250, 'n') + r(120, 200, 90, 55, 'f') + r(150, 170, 70, 32, 'm') + r(520, 196, 100, 56, 'f') +
      d('M670 252 L682 165 Q712 122 742 165 L756 252 Z', 'l', 'opacity=".2"'),

    bedroom: () => wall() + r(80, 40, 160, 120, 'f') + r(88, 48, 144, 104, 'n', 'opacity=".65"') +
      stars(10, 73, 90).replace(/cx="(\d+)"/g, (m, x) => `cx="${92 + (x % 136)}"`).replace(/cy="(\d+)"/g, (m, y) => `cy="${52 + Number(y)}"`) +
      ln(160, 48, 160, 152, 'ln') + floor(235, 'n') + r(560, 40, 140, 195, 'f') + r(568, 48, 58, 187, 'm') + r(634, 48, 58, 187, 'm') +
      r(626, 48, 8, 187, 'n') + c(628, 118, 2.5, 'a', 'class="a fl"') + c(633, 118, 2.5, 'a', 'class="a fl"') +
      r(250, 170, 260, 50, 'f') + r(250, 145, 20, 90, 'n') + r(490, 160, 20, 75, 'n') + r(272, 158, 60, 18, 'l', 'opacity=".3"') +
      c(200, 226, 12, 'a', 'opacity=".7"') + c(530, 228, 6, 'l') + glow(530, 228, 45, 0.5, ' fl'),

    // ---- western
    'desert-town': () => c(640, 60, 30, 'l', 'opacity=".9"') + glow(640, 60, 90, 0.35) +
      ridge('0,190 80,190 90,140 200,140 210,190 520,190 530,120 660,120 672,190 800,190', 'f') + floor(225, 'm') +
      [[30, 110, 130], [170, 90, 110], [290, 120, 90], [500, 100, 120], [630, 80, 150]].map(([x, top, w], i) => r(x, top, w, 225 - top, i % 2 ? 'n' : 'f') +
        r(x + w * 0.2, top + 30, w * 0.22, 26, 'l', 'opacity=".25"') + r(x + w * 0.58, top + 30, w * 0.22, 26, 'l', 'opacity=".25"') +
        r(x + w / 2 - 12, 225 - 44, 24, 44, 'n')).join('') +
      r(408, 70, 54, 46, 'n') + range(4).map((i) => ln(412 + i * 15, 116, 404 + i * 22, 225, 'ln', 'style="stroke:var(--near);stroke-width:4"')).join('') +
      range(5).map((i) => e(120 + i * 150, 262 + (i % 2) * 14, 40, 3, 'l', 'class="l dr" opacity=".25"')).join(''),

    saloon: () => wall() + r(0, 0, W, 26, 'f') + r(60, 50, 380, 110, 'f') + range(3).map((j) => r(70, 70 + j * 30, 360, 4, 'n')).join('') +
      range(18).map((i) => r(78 + i * 19, (i % 3) * 30 + 52, 8, 18, i % 4 ? 'l' : 'a', 'opacity=".55"')).join('') +
      r(40, 170, 440, 70, 'n') + r(40, 166, 440, 8, 'l', 'opacity=".2"') + floor(240, 'n') +
      r(560, 80, 160, 160, 'f') + r(572, 130, 66, 80, 'm') + r(642, 130, 66, 80, 'm') + r(560, 74, 160, 8, 'n') +
      [[220, 30], [600, 30]].map(([x, y]) => ln(x, 0, x, y, 'ln') + c(x, y + 10, 9, 'l', 'class="l fl"') + glow(x, y + 10, 70, 0.45, ' fl')).join('') +
      r(500, 200, 50, 40, 'm') + r(498, 196, 54, 6, 'l', 'opacity=".3"'),

    // ---- industrial / underwater
    rig: () => stars(25, 75, 110) + moon(130, 55, 18) + r(0, 205, W, 95, 'm') + waves(214, 'ln', 3) +
      range(4).map((i) => r(260 + i * 90, 150, 14, 90, 'f')).join('') + r(230, 120, 340, 34, 'n') + r(240, 90, 140, 32, 'f') +
      range(5).map((i) => r(250 + i * 25, 98, 12, 8, 'l', 'opacity=".7"')).join('') +
      p('470,120 500,20 530,120', 'f', 'style="fill:none;stroke:var(--far);stroke-width:4"') + ln(485, 70, 515, 70, 'ln', 'style="stroke:var(--far);stroke-width:3"') +
      ln(560, 120, 650, 60, 'ln', 'style="stroke:var(--near);stroke-width:5"') + ln(650, 60, 650, 110, 'ln', 'opacity=".5"') +
      c(500, 18, 4, 'a', 'class="a fl"') + glow(400, 140, 160, 0.25) + e(400, 232, 120, 6, 'l', 'opacity=".15"'),

    pipes: () => wall('f') + range(4).map((i) => r(0, 30 + i * 26, W, 12, i % 2 ? 'm' : 'n')).join('') +
      range(5).map((i) => r(80 + i * 160, 0, 18, 240, 'n') + c(89 + i * 160, 150 + (i % 2) * 40, 16, 'm') + ln(77 + i * 160, 150 + (i % 2) * 40, 101 + i * 160, 150 + (i % 2) * 40, 'ln', 'opacity=".5"')).join('') +
      [[250, 190], [560, 180]].map(([x, y]) => c(x, y, 22, 'n') + c(x, y, 17, 'l', 'opacity=".25"') + ln(x, y, x + 10, y - 12, 'ln', 'style="stroke:var(--accent,#f33)"')).join('') +
      floor(240, 'n') + range(20).map((i) => ln(i * 40, 240, i * 40, 300, 'ln', 'opacity=".15"')).join('') +
      c(700, 20, 10, 'a', 'class="a fl"') + glow(700, 30, 120, 0.4, ' fl'),

    // ---- misc
    dungeon: () => wall('m') + range(6).map((row) => range(9).map((i) => r(i * 100 - (row % 2) * 50, row * 42, 96, 38, 'f', 'opacity=".55"')).join('')).join('') +
      r(420, 60, 300, 180, 'n') + r(430, 70, 280, 170, 'f', 'opacity=".8"') + range(9).map((i) => r(440 + i * 32, 60, 7, 180, 'm')).join('') +
      r(420, 120, 300, 7, 'm') + d('M180 40 Q200 120 160 170', 'n', 'style="fill:none;stroke:var(--near);stroke-width:5;stroke-dasharray:8 4"') +
      r(320, 90, 14, 40, 'n') + c(327, 82, 9, 'l', 'class="l fl"') + glow(327, 90, 110, 0.5, ' fl') + floor(240, 'n'),

    cafe: () => wall() + r(40, 40, 300, 160, 'f') + r(48, 48, 284, 144, 'l', 'opacity=".12"') + ln(190, 48, 190, 192, 'ln') +
      windows(48, 120, 284, 70, 10, 2, 77) + r(80, 200, 120, 8, 'n') + r(136, 208, 8, 32, 'n') +
      r(420, 150, 360, 90, 'n') + r(420, 146, 360, 8, 'l', 'opacity=".2"') + r(460, 100, 70, 50, 'f') + r(470, 112, 50, 6, 'l', 'opacity=".5"') +
      r(560, 40, 200, 60, 'f') + range(3).map((i) => r(570 + i * 64, 50, 54, 40, 'l', 'opacity=".2"')).join('') +
      [480, 600, 720].map((x) => ln(x, 0, x, 20, 'ln') + p(`${x - 16},34 ${x + 16},34 ${x + 8},20 ${x - 8},20`, 'l', 'opacity=".85"') + glow(x, 34, 50, 0.4)).join('') +
      floor(240, 'n'),

    void: () => stars(15, 59, 300) + r(0, 200, W, 2, 'l', 'opacity=".25"') + glow(400, 200, 120, 0.1) + e(400, 200, 300, 6, 'l', 'opacity=".15"'),

    dawn: () => c(400, 230, 70, 'l', 'opacity=".9"') + glow(400, 225, 140, 0.4) + range(4).map((i) => r(0, 120 + i * 22, W, 3, 'l', `opacity="${0.12 - i * 0.02}"`)).join('') +
      ridge('0,230 150,210 300,225 500,205 650,222 800,212', 'f') + ridge('0,260 200,245 420,262 640,240 800,255', 'n'),
  };

  // Guess a backdrop for scenes that do not specify one.
  const MOOD_FALLBACK = { space: 'space', sea: 'sea', forest: 'forest', dawn: 'dawn', ember: 'crater', castle: 'castle', office: 'office', neon: 'city-night', candle: 'cottage', ice: 'mountains', sunny: 'dawn' };
  const resolveKey = (key, mood) => (key && S[key] ? key : MOOD_FALLBACK[mood] || 'void');

  let uid = 0;
  function render(key, mood) {
    key = resolveKey(key, mood);
    const pal = PALETTES[mood] || PALETTES.default;
    const id = 'sv' + ++uid;
    const vars = `--sky1:${pal[0]};--sky2:${pal[1]};--far:${pal[2]};--mid:${pal[3]};--near:${pal[4]};--light:${pal[5]}`;
    return `<svg class="sv" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${key}" style="${vars}">` +
      `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sky1)"/><stop offset="1" style="stop-color:var(--sky2)"/></linearGradient>` +
      `<filter id="${id}b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter></defs>` +
      `<rect width="${W}" height="${H}" fill="url(#${id})"/>` +
      S[key]()
        .replace(/class="g( fl)?"/g, (m, fl) => `class="g${fl || ''}" filter="url(#${id}b)"`)
        // flicker animates opacity on a wrapper group so each shape keeps its own base opacity
        .replace(/<(\w+)([^>]*?)class="([^"]*?)\s*\bfl\b([^"]*)"([^>]*)\/>/g, (m, tag, a, c1, c2, b) => `<g class="fl"><${tag}${a}class="${(c1 + c2).trim()}"${b}/></g>`)
        .replace(/url\(#vp\)/g, `url(#${id}vp)`).replace(/id="vp"/g, `id="${id}vp"`) +
      `</svg>`;
  }

  window.MFScenes = { render, keys: Object.keys(S), PALETTES };
})();
