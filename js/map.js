/*
 * MysteryFate story map: a branching chart of a story's scenes that lights up as you explore.
 * Structure comes from the story file (choice/redirect targets; targets inside functions are found
 * by scanning for quoted scene ids). Only what the player has seen is revealed: unexplored scenes
 * are dark dots, unfound endings are "?".
 */
(function () {
  'use strict';

  const ENDING_COLORS = { good: '#5ad17a', true: '#f4d35e', secret: '#d291ff', neutral: '#a9b4c2', bad: '#ff8c42', death: '#ff3b4a' };

  /** A throwaway game state with pseudo-random flags/values, for probing routing functions. */
  function probeState(seed) {
    let x = seed * 2654435761 >>> 0;
    const rnd = () => ((x = (x * 1664525 + 1013904223) >>> 0) / 4294967296);
    const flags = {}, vars = {};
    const flag = (f) => (f in flags ? flags[f] : (flags[f] = rnd() < 0.5));
    return {
      has: flag,
      get: (k) => (k in vars ? vars[k] : (vars[k] = Math.floor(rnd() * 8) - 1)),
      count: (...fs) => fs.flat().filter(flag).length,
      seen: () => rnd() < 0.5, found: () => Math.floor(rnd() * 6),
      set() {}, unset() {}, add() {}, setVar() {},
    };
  }

  /** Scene ids a `next`/`redirect` target can lead to. */
  function targets(t, scenes) {
    if (t == null) return [];
    if (typeof t === 'string') return scenes[t] ? [t] : [];
    if (typeof t === 'function') {
      const ids = new Set();
      // 1) scene ids written in the function's source
      for (const m of String(t).matchAll(/['"`]([A-Za-z0-9_\-]+)['"`]/g)) if (scenes[m[1]]) ids.add(m[1]);
      // 2) run it against varied fake states to catch ids hidden in closures (e.g. gate('wood'))
      for (let seed = 1; seed <= 60; seed++) {
        try { const r = t(probeState(seed)); if (typeof r === 'string' && scenes[r]) ids.add(r); } catch (e) { /* ignore */ }
      }
      return [...ids];
    }
    return [];
  }

  /** Builds the scene graph with redirect scenes collapsed into direct edges. */
  function buildGraph(story) {
    const scenes = story.scenes;
    const raw = {};
    for (const [id, sc] of Object.entries(scenes)) {
      const out = new Set();
      if (sc.redirect) targets(sc.redirect, scenes).forEach((x) => out.add(x));
      for (const c of sc.choices || []) targets(c.next, scenes).forEach((x) => out.add(x));
      if (sc.timeout && typeof sc.timeout === 'object') targets(sc.timeout.next, scenes).forEach((x) => out.add(x));
      raw[id] = [...out];
    }
    const resolve = (id, guard = 0) => (scenes[id] && scenes[id].redirect && guard < 20
      ? raw[id].flatMap((x) => resolve(x, guard + 1)) : [id]);
    const start = resolve(story.start)[0];
    const edges = {};
    for (const id of Object.keys(scenes)) {
      if (scenes[id].redirect) continue;
      edges[id] = [...new Set(raw[id].flatMap((x) => resolve(x)))];
    }
    // Layers by shortest distance from the start.
    const layer = { [start]: 0 };
    const order = [start];
    for (let i = 0; i < order.length; i++) {
      for (const n of edges[order[i]] || []) if (layer[n] == null) { layer[n] = layer[order[i]] + 1; order.push(n); }
    }
    return { start, edges, layer, nodes: order };
  }

  /** Orders nodes inside each layer to reduce crossings (a few barycenter sweeps). */
  function layout(g) {
    const rows = [];
    for (const n of g.nodes) (rows[g.layer[n]] = rows[g.layer[n]] || []).push(n);
    const parents = {};
    for (const [a, outs] of Object.entries(g.edges)) for (const b of outs) (parents[b] = parents[b] || []).push(a);
    const pos = {};
    const place = () => rows.forEach((row) => row.forEach((n, i) => { pos[n] = (i + 0.5) / row.length; }));
    place();
    for (let sweep = 0; sweep < 6; sweep++) {
      for (let r = 1; r < rows.length; r++) {
        const bary = (n) => { const ps = (parents[n] || []).filter((p) => g.layer[p] < r); return ps.length ? ps.reduce((s, p) => s + pos[p], 0) / ps.length : pos[n]; };
        rows[r].sort((a, b) => bary(a) - bary(b));
        place();
      }
    }
    return rows;
  }

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const firstEmoji = (s) => { const m = String(s || '').match(/\p{Extended_Pictographic}(️|‍\p{Extended_Pictographic})*/u); return m ? m[0] : ''; };

  /**
   * Renders the map. `seen` = { s: Set(sceneIds), e: Set('a>b') }, `found` = Set(endingIds),
   * `here` = scene id of a saved in-progress run (or null).
   */
  function render(story, seen, found, here) {
    const g = buildGraph(story);
    const rows = layout(g);
    const maxRow = Math.max(...rows.map((r) => r.length));
    const COL = 86, ROW = 92, PAD = 46;
    const W = Math.max(320, maxRow * COL + PAD * 2), H = rows.length * ROW + PAD;
    const xy = {};
    rows.forEach((row, r) => row.forEach((n, i) => { xy[n] = [PAD + ((i + 0.5) / row.length) * (W - PAD * 2), PAD + r * ROW]; }));

    const isSeen = (n) => seen.s.has(n) || (story.scenes[n].ending && found.has(story.scenes[n].ending.id));
    let svgEdges = '', svgNodes = '';
    for (const [a, outs] of Object.entries(g.edges)) {
      if (!xy[a]) continue;
      for (const b of outs) {
        if (!xy[b]) continue;
        const [x1, y1] = xy[a], [x2, y2] = xy[b];
        const walked = seen.e.has(`${a}>${b}`);
        const back = y2 <= y1;
        const d = back
          ? `M${x1} ${y1} C ${x1 + 60} ${y1 + 40}, ${x2 + 60} ${y2 - 40}, ${x2} ${y2}`
          : `M${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`;
        svgEdges += `<path d="${d}" class="mp-edge${walked ? ' walked' : ''}"/>`;
      }
    }
    let scenesSeen = 0, scenesTotal = 0, endingsSeen = 0, endingsTotal = 0;
    for (const n of g.nodes) {
      const sc = story.scenes[n];
      const [x, y] = xy[n];
      const s = isSeen(n);
      const label = esc(s ? (sc.ending ? sc.ending.title : sc.title || 'Scene') : sc.ending ? 'Undiscovered ending' : 'Unexplored scene');
      if (sc.ending) {
        endingsTotal++; if (s) endingsSeen++;
        const col = s ? ENDING_COLORS[sc.ending.type] || ENDING_COLORS.neutral : null;
        svgNodes += `<g class="mp-node mp-end${s ? ' seen' : ''}" data-label="${label}" data-type="${s ? esc(sc.ending.type) : ''}" tabindex="0">` +
          `<rect x="${x - 17}" y="${y - 17}" width="34" height="34" rx="8" transform="rotate(45 ${x} ${y})" ${col ? `style="fill:${col}33;stroke:${col}"` : ''}/>` +
          `<text x="${x}" y="${y + 6}" text-anchor="middle">${s ? '★' : '?'}</text></g>`;
      } else {
        scenesTotal++; if (s) scenesSeen++;
        const emo = s ? firstEmoji(sc.art) : '';
        svgNodes += `<g class="mp-node${s ? ' seen' : ''}${n === g.start ? ' start' : ''}" data-label="${label}" tabindex="0">` +
          `<circle cx="${x}" cy="${y}" r="${s ? 18 : 9}"/>` +
          (emo ? `<text x="${x}" y="${y + 6}" text-anchor="middle" class="mp-emo">${emo}</text>` : '') + `</g>`;
      }
      if (n === here) svgNodes += `<circle cx="${x}" cy="${y}" r="25" class="mp-here"/><text x="${x}" y="${y - 30}" text-anchor="middle" class="mp-here-label">YOU ARE HERE</text>`;
    }
    if (xy[g.start] && here !== g.start) svgNodes += `<text x="${xy[g.start][0]}" y="${xy[g.start][1] - 26}" text-anchor="middle" class="mp-start-label">START</text>`;
    const svg = `<svg class="story-map" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Story map">${svgEdges}${svgNodes}</svg>`;
    const focus = xy[here] || xy[g.start];
    return { svg, scenesSeen, scenesTotal, endingsSeen, endingsTotal, focusX: focus ? focus[0] : W / 2, focusY: focus ? focus[1] : 0 };
  }

  window.MFMap = { render, buildGraph };
})();
