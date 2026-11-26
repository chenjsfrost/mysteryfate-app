/* MysteryFate engine: screens, scene playback, choices, timers, endings, progress. */
(function () {
  'use strict';

  const { resolveText, availableChoices, applyEffects, resolveNext, getTimeoutChoice, listEndings, initialState, State } = MF.core;
  const Audio = window.MFAudio;
  const FX = window.MFFX;
  const Voice = window.MFVoice;
  const Scenes = window.MFScenes;

  // ---------------------------------------------------------------- data
  const CATEGORIES = [
    { id: 'horror',   name: 'Horror',   icon: '🩸', blurb: "Don't look behind you.",        color: '#e63946' },
    { id: 'mystery',  name: 'Mystery',  icon: '🕵️', blurb: 'Every clue matters. So does every lie.', color: '#d4a373' },
    { id: 'comedy',   name: 'Comedy',   icon: '🤡', blurb: 'Terrible choices. Great stories.', color: '#ffb703' },
    { id: 'fantasy',  name: 'Fantasy',  icon: '🐉', blurb: 'Magic always has a price.',      color: '#b388ff' },
    { id: 'scifi',    name: 'Sci-Fi',   icon: '🚀', blurb: 'Alone among the stars. Or are you?', color: '#4cc9f0' },
    { id: 'thriller', name: 'Thriller', icon: '💎', blurb: 'Trust no one. Especially yourself.', color: '#2ec4b6' },
    { id: 'adventure', name: 'Adventure', icon: '🧭', blurb: 'Far from home. Every step is a gamble.', color: '#f4a259' },
    { id: 'drama',    name: 'Drama',    icon: '💌', blurb: 'No monsters. Just the people who matter.', color: '#ff7aa2' },
  ];
  const ENDING_TYPES = {
    true:    { label: 'True Ending',    color: '#ffd166' },
    good:    { label: 'Good Ending',    color: '#5ad17a' },
    secret:  { label: 'Secret Ending',  color: '#d291ff' },
    neutral: { label: 'Neutral Ending', color: '#a9b4c2' },
    bad:     { label: 'Bad Ending',     color: '#ff8c42' },
    death:   { label: 'You Died',       color: '#ff3b4a' },
  };
  const SPEEDS = { normal: 38, fast: 14, instant: 0 };
  // Story `timer` values are a base; the player's pace setting scales them.
  const PACES = { relaxed: { mult: 4, min: 25 }, normal: { mult: 3, min: 20 }, tense: { mult: 1.5, min: 10 } };
  const timerSecs = (base) => {
    const p = PACES[settings.pace] || PACES.normal;
    return Math.max(p.min, Math.round(base * p.mult));
  };
  const DEFAULT_ACCENT = '#c9a227';
  const INVERTED_METER = /suspicion|hunger|heat|chaos|corruption|danger|fear|alert|panic|wanted/i;

  const stories = MF.stories;
  const catOf = (id) => CATEGORIES.find((c) => c.id === id) || { name: id, icon: '📖', color: DEFAULT_ACCENT };

  // ---------------------------------------------------------------- storage
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
    },
  };
  const settings = Object.assign({ sound: true, timers: true, pace: 'normal', speed: 'normal', voice: 'cast', autoscroll: false, skipSeen: true, textSize: 'm', font: 'serif' }, store.get('mf.settings', {}));
  let found = store.get('mf.endings', {});

  // ---------------------------------------------------------------- seen content (per story)
  // s = scenes read, c = choices picked ("sceneId#index" / "sceneId#t" for timeouts), e = paths walked ("a>b").
  let seenRaw = store.get('mf.seen', {});
  const seenCache = {};
  function seenOf(storyId) {
    if (!seenCache[storyId]) {
      const r = seenRaw[storyId] || {};
      seenCache[storyId] = { s: new Set(r.s || []), c: new Set(r.c || []), e: new Set(r.e || []) };
    }
    return seenCache[storyId];
  }
  function markSeen(kind, key) {
    const id = G.story.id, set = seenOf(id)[kind];
    if (set.has(key)) return;
    set.add(key);
    const x = seenOf(id);
    seenRaw[id] = { s: [...x.s], c: [...x.c], e: [...x.e] };
    store.set('mf.seen', seenRaw);
  }

  // ---------------------------------------------------------------- saved runs in progress (one slot per story)
  const loadSaves = () => store.get('mf.saves', {});
  const saveFor = (storyId) => loadSaves()[storyId] || null;
  function writeSave(extra) {
    const saves = loadSaves();
    saves[G.story.id] = {
      story: G.story.id, date: new Date().toISOString(),
      state: G.state.toJSON(), history: G.history, path: G.path, choiceCount: G.choiceCount, prev: G.prevScene,
      ...extra,
    };
    store.set('mf.saves', saves);
  }
  function clearSave(storyId) {
    const saves = loadSaves();
    if (saves[storyId]) { delete saves[storyId]; store.set('mf.saves', saves); }
  }
  /** Most recently saved run (for the home screen "Continue" button). */
  function latestSave() {
    const all = Object.values(loadSaves()).filter((s) => stories.some((x) => x.id === s.story));
    return all.sort((a, b) => (a.date < b.date ? 1 : -1))[0] || null;
  }

  // ---------------------------------------------------------------- journal (completed runs)
  const MAX_RUNS = 40;
  const loadRuns = () => store.get('mf.runs', []);
  function saveRun(run) {
    let runs = [run, ...loadRuns()].slice(0, MAX_RUNS);
    // Transcripts are text-heavy: if storage is full, drop the oldest runs until it fits.
    while (runs.length) {
      try { localStorage.setItem('mf.runs', JSON.stringify(runs)); return; } catch (e) { if (runs.length === 1) return; runs = runs.slice(0, Math.ceil(runs.length / 2)); }
    }
  }
  const runsFor = (story) => loadRuns().filter((r) => r.story === story.id);
  const saveSettings = () => store.set('mf.settings', settings);
  const foundFor = (story) => new Set(found[story.id] || []);
  /** Replay memory for a new run: the endings found in earlier runs of this story (see State.seen). */
  const memoryFor = (story) => ({ endings: [...foundFor(story)] });
  function markFound(story, endingId) {
    const set = foundFor(story);
    const isNew = !set.has(endingId);
    set.add(endingId);
    found[story.id] = [...set];
    store.set('mf.endings', found);
    return isNew;
  }

  // ---------------------------------------------------------------- dom helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k.startsWith('--')) el.style.setProperty(k, v);
      else el.setAttribute(k, v);
    }
    for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid);
    return el;
  }
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ---------------------------------------------------------------- game state
  const G = {
    story: null, state: null, sceneId: null,
    history: [], path: [], choiceCount: 0,
    token: 0, skip: false, busy: false,
    timer: null, meterPrev: {},
    log: [],              // transcript of this run, saved to the journal at an ending
    bg: null, mood: null, // current backdrop key + mood
  };

  // ---------------------------------------------------------------- scrolling
  // By default the page never scrolls on its own while you read; a "More below" button
  // appears instead. With the Auto-scroll setting on, it follows new text like before.
  function follow(el, block = 'nearest') {
    if (settings.autoscroll) el.scrollIntoView({ block, behavior: 'smooth' });
    updateMore();
  }
  function updateMore() {
    const btn = $('#more-below');
    if (!btn) return;
    const stage = $('#stage');
    const show = inGame() && stage.getBoundingClientRect().bottom > window.innerHeight + 24;
    const choicesReady = !!$('#choices .choice, #choices .gate, .ending-panel:not(.broken)');
    const label = choicesReady ? ($('.ending-panel:not(.broken)') ? '▾ Ending below' : '▾ Choices below') : '▾ More below';
    if (btn.textContent !== label) btn.textContent = label;
    btn.classList.toggle('show', show);
  }
  function scrollMore() {
    window.scrollBy({ top: Math.round(window.innerHeight * 0.75), behavior: 'smooth' });
  }

  /** Skip the typewriter and stop read-aloud for the rest of this screen. */
  function skipNow() { G.skip = true; Voice.stop(); }

  // ---------------------------------------------------------------- screens
  function show(name) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === 'screen-' + name));
    document.body.classList.toggle('on-title', name === 'title');
    window.scrollTo({ top: 0 });
    if (name !== 'game') {
      stopTimer();
      Voice.stop();
      G.token++;
      setAccent(DEFAULT_ACCENT);
      FX.mood('default');
      FX.weather(name === 'title' ? 'dust' : null);
      Audio.ambient('menu');
    }
  }
  function setAccent(color) { document.documentElement.style.setProperty('--accent', color); }
  const inGame = () => $('#screen-game').classList.contains('active');

  // ---------------------------------------------------------------- title
  function renderTitleProgress() {
    const total = stories.reduce((n, s) => n + listEndings(s).length, 0);
    const got = stories.reduce((n, s) => n + listEndings(s).filter((e) => foundFor(s).has(e.id)).length, 0);
    $('#title-progress').textContent = `${stories.length} stories · ${got} / ${total} endings discovered`;
    const save = latestSave();
    const btn = $('#btn-continue');
    btn.classList.toggle('hidden', !save);
    $('#btn-begin').classList.toggle('btn-primary', !save);
    $('#btn-begin').classList.toggle('btn-ghost', !!save);
    if (save) {
      const s = stories.find((x) => x.id === save.story);
      btn.textContent = `▶ Continue: ${s.cover || ''} ${s.title} · choice ${save.choiceCount + 1}`;
      btn.onclick = () => { Audio.init(); Audio.click(); resumeStory(s); };
    }
  }

  // ---------------------------------------------------------------- categories
  function renderCategories() {
    const grid = $('#category-grid');
    grid.innerHTML = '';
    for (const c of CATEGORIES) {
      const list = stories.filter((s) => s.category === c.id);
      grid.append(h('button', {
        class: 'cat-card', '--c': c.color, disabled: list.length ? null : 'disabled',
        onclick: () => { Audio.click(); openCategory(c.id); }, onmouseenter: () => Audio.hover(),
      },
      h('div', { class: 'cat-icon' }, c.icon),
      h('div', { class: 'cat-name' }, c.name),
      h('div', { class: 'cat-blurb' }, c.blurb),
      h('div', { class: 'cat-count' }, list.length ? `${list.length} ${list.length === 1 ? 'story' : 'stories'}` : 'coming soon')));
    }
    grid.append(h('button', {
      class: 'cat-card', '--c': DEFAULT_ACCENT,
      onclick: () => { Audio.click(); openCategory('all'); }, onmouseenter: () => Audio.hover(),
    },
    h('div', { class: 'cat-icon' }, '📚'),
    h('div', { class: 'cat-name' }, 'All Stories'),
    h('div', { class: 'cat-blurb' }, 'Can\'t decide? Browse everything.'),
    h('div', { class: 'cat-count' }, `${stories.length} stories`)));
  }

  function openCategory(catId) {
    const list = catId === 'all' ? stories : stories.filter((s) => s.category === catId);
    const c = catId === 'all' ? { name: 'All Stories', blurb: 'Every fate, one place.', icon: '📚' } : catOf(catId);
    $('#stories-heading').textContent = `${c.icon} ${c.name}`;
    $('#stories-sub').textContent = c.blurb;
    const grid = $('#story-grid');
    grid.innerHTML = '';
    const runs = loadRuns();
    for (const s of list) {
      const endings = listEndings(s);
      const got = foundFor(s);
      const played = runs.filter((r) => r.story === s.id).length;
      const color = s.accent || catOf(s.category).color;
      grid.append(h('button', {
        class: 'story-card', '--c': color,
        onclick: () => { Audio.click(); openDetail(s); }, onmouseenter: () => Audio.hover(),
      },
      h('div', { class: 'story-cover' }, h('span', null, s.cover || '📖')),
      h('div', { class: 'story-info' },
        h('div', { class: 'story-cat' }, catOf(s.category).name),
        h('div', { class: 'story-name' }, s.title),
        h('div', { class: 'story-tag' }, s.tagline),
        h('div', { class: 'story-meta' },
          played ? h('span', { class: 'played-badge' }, `✓ Played ${played}×`) : h('span', { class: 'new-story' }, 'Not played yet'),
          h('span', null, `${got.size}/${endings.length} endings`),
          h('span', { class: 'progress-dots' }, endings.map((e) => h('i', { class: got.has(e.id) ? 'on' : '' })))))));
    }
    show('stories');
  }

  // ---------------------------------------------------------------- modal
  function openModal(content) {
    const body = $('#modal-body');
    body.innerHTML = '';
    body.append(content);
    $('#modal').classList.remove('hidden');
  }
  function closeModal() { $('#modal').classList.add('hidden'); }

  function gallery(story) {
    const got = foundFor(story);
    const endings = listEndings(story);
    return h('div', null,
      h('div', { class: 'gallery-title' }, h('span', null, 'Endings'), h('span', null, `${got.size} / ${endings.length}`)),
      h('div', { class: 'gallery' }, endings.map((e) => {
        const t = ENDING_TYPES[e.type] || ENDING_TYPES.neutral;
        return got.has(e.id)
          ? h('div', { class: 'gallery-item', style: { borderColor: t.color } }, h('b', null, e.title), h('small', { style: { color: t.color } }, t.label))
          : h('div', { class: 'gallery-item locked' }, h('b', null, '? ? ?'), h('small', null, 'Undiscovered'));
      })));
  }

  function openDetail(story) {
    const color = story.accent || catOf(story.category).color;
    const save = saveFor(story.id);
    const scenes = Object.keys(story.scenes).length;
    const content = h('div', { '--c': color },
      h('div', { class: 'detail-cover' }, story.cover || '📖'),
      h('h3', { class: 'detail-title' }, story.title),
      h('p', { class: 'detail-tag' }, story.tagline),
      h('p', { class: 'detail-desc' }, story.description),
      story.warning ? h('div', { class: 'detail-warning' }, story.warning) : null,
      story.remembers ? h('p', { class: 'detail-remembers' }, '🔁 This story remembers your earlier runs. Play it more than once.') : null,
      h('p', { class: 'story-meta' },
        h('span', null, `${catOf(story.category).icon} ${catOf(story.category).name}`),
        h('span', null, `${scenes} scenes · ~${Math.max(8, Math.round(scenes / 3))} min per run`)),
      gallery(story),
      runList(runsFor(story), { compact: true }),
      h('div', { class: 'detail-actions' },
        save
          ? [h('button', { class: 'btn btn-primary', style: { background: color }, onclick: () => { closeModal(); resumeStory(story); } }, `▶ Continue · choice ${save.choiceCount + 1}`),
            h('button', { class: 'btn btn-ghost', onclick: () => { closeModal(); startStory(story, { fresh: true }); } }, '↻ Start over')]
          : h('button', { class: 'btn btn-primary', style: { background: color }, onclick: () => { closeModal(); startStory(story); } }, 'Play'),
        h('button', { class: 'btn btn-ghost', onclick: () => { closeModal(); openMap(story); } }, '🗺 Story map')));
    openModal(content);
  }

  // ---------------------------------------------------------------- journal UI
  const fmtDate = (iso) => { try { return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }); } catch (e) { return iso; } };
  const storyById = (id) => stories.find((s) => s.id === id);

  function runList(runs, { compact } = {}) {
    if (!runs.length) return compact ? null : h('p', { class: 'screen-sub' }, 'No finished stories yet. Reach any ending and it will be saved here to re-read.');
    return h('div', { class: 'runs' },
      compact ? h('div', { class: 'gallery-title' }, h('span', null, 'Your past runs'), h('span', null, String(runs.length))) : null,
      runs.map((r) => {
        const t = ENDING_TYPES[r.ending.type] || ENDING_TYPES.neutral;
        return h('button', { class: 'run-item', '--ec': t.color, onclick: () => { Audio.click(); closeModal(); openRun(r); }, onmouseenter: () => Audio.hover() },
          h('span', { class: 'run-cover' }, r.cover || '📖'),
          h('span', { class: 'run-info' },
            compact ? null : h('b', null, r.title),
            h('span', { class: 'run-ending' }, h('i', null, t.label), ' · ', r.ending.title),
            h('small', null, `${fmtDate(r.date)} · ${r.choices} choices`)),
          h('span', { class: 'run-go' }, 'Read ▸'));
      }));
  }

  function openJournal(filter) {
    const runs = loadRuns();
    const ids = [...new Set(runs.map((r) => r.story))];
    const wrap = $('#journal-body');
    wrap.innerHTML = '';
    $('#journal-sub').textContent = runs.length
      ? `${runs.length} finished run${runs.length === 1 ? '' : 's'} across ${ids.length} stor${ids.length === 1 ? 'y' : 'ies'}. Tap one to re-read it.`
      : 'Every story you finish is saved here so you can re-read the path you took.';
    if (ids.length > 1) {
      wrap.append(h('div', { class: 'seg journal-filter' },
        h('button', { class: !filter ? 'on' : '', onclick: () => openJournal() }, 'All'),
        ids.map((id) => { const s = storyById(id); const r = runs.find((x) => x.story === id); return h('button', { class: filter === id ? 'on' : '', onclick: () => openJournal(id) }, `${r.cover || ''} ${s ? s.title : r.title}`); })));
    }
    wrap.append(runList(filter ? runs.filter((r) => r.story === filter) : runs));
    show('journal');
  }

  // ---------------------------------------------------------------- story map
  function openMap(story) {
    const save = saveFor(story.id);
    const m = window.MFMap.render(story, seenOf(story.id), foundFor(story), save ? save.scene || null : null);
    const color = story.accent || catOf(story.category).color;
    const body = $('#map-body');
    body.innerHTML = '';
    const caption = h('div', { class: 'map-caption' }, 'Tap a lit scene to see where you were. Dark dots are places you haven’t been yet.');
    const pct = Math.round(((m.scenesSeen + m.endingsSeen) / Math.max(1, m.scenesTotal + m.endingsTotal)) * 100);
    const wrap = h('div', { class: 'map-wrap', html: m.svg });
    wrap.addEventListener('click', (e) => {
      const node = e.target.closest('.mp-node');
      if (!node) return;
      wrap.querySelectorAll('.mp-node.sel').forEach((n) => n.classList.remove('sel'));
      node.classList.add('sel');
      caption.textContent = node.dataset.label;
    });
    body.append(
      h('div', { class: 'reader-head' },
        h('div', { class: 'detail-cover' }, story.cover || '📖'),
        h('h2', { class: 'screen-title' }, story.title),
        h('p', { class: 'screen-sub' }, `${pct}% explored · ${m.scenesSeen}/${m.scenesTotal} scenes · ${m.endingsSeen}/${m.endingsTotal} endings`),
        h('div', { class: 'map-progress' }, h('i', { style: { width: pct + '%' } }))),
      h('div', { class: 'map-legend' },
        h('span', null, h('i', { class: 'lg seen' }), 'Explored'), h('span', null, h('i', { class: 'lg' }), 'Unexplored'),
        h('span', null, h('i', { class: 'lg end' }), 'Ending'), h('span', null, h('i', { class: 'lg walked' }), 'Path you took')),
      caption, wrap,
      h('div', { class: 'ending-actions' },
        save ? h('button', { class: 'btn btn-primary btn-small', style: { background: color }, onclick: () => resumeStory(story) }, `▶ Continue · choice ${save.choiceCount + 1}`)
          : h('button', { class: 'btn btn-primary btn-small', style: { background: color }, onclick: () => startStory(story) }, '▶ Play'),
        h('button', { class: 'btn btn-ghost btn-small', onclick: () => openDetail(story) }, '🏆 Endings')));
    G.mapStory = story;
    show('map');
    setAccent(color);
    // Centre the view on where you are (or the start).
    requestAnimationFrame(() => { wrap.scrollLeft = Math.max(0, m.focusX - wrap.clientWidth / 2); wrap.scrollTop = Math.max(0, m.focusY - 120); });
  }

  /** Re-read a finished run as a transcript. */
  function openRun(run) {
    const s = storyById(run.story);
    const t = ENDING_TYPES[run.ending.type] || ENDING_TYPES.neutral;
    setAccent((s && s.accent) || DEFAULT_ACCENT);
    const blocks = (list) => (list || []).map((b) => b.type === 'say'
      ? h('div', { class: 'say' }, h('span', { class: 'speaker' }, b.speaker), h('p', { html: fmt(b.text) }))
      : h('p', { html: fmt(b.text) }));
    const body = $('#reader-body');
    body.innerHTML = '';
    body.append(
      h('div', { class: 'reader-head' },
        h('div', { class: 'detail-cover' }, run.cover || '📖'),
        h('h2', { class: 'screen-title' }, run.title),
        h('p', { class: 'screen-sub' }, `${fmtDate(run.date)} · ${run.choices} choices · `, h('span', { style: { color: t.color } }, `${t.label}: ${run.ending.title}`))),
      ...run.log.map((e) => {
        if (e.k === 'scene') {
          return h('section', { class: 'reader-scene' },
            h('div', { class: 'reader-thumb', html: Scenes.render(e.bg, e.mood) }, h('span', { class: 'reader-art' }, e.art || '')),
            e.stamp ? h('div', { class: 'scene-stamp' }, h('span', null, e.stamp)) : null,
            e.title ? h('div', { class: 'scene-title' }, e.title) : null,
            h('div', { class: 'narrative' }, blocks(e.blocks)));
        }
        if (e.k === 'choice') {
          return h('div', { class: 'narrative reader-choice' },
            h('div', { class: `you-chose${e.timeout ? ' timeout' : ''}` }, e.timeout ? '⏳ Too slow —' : '▸ You chose:', h('b', { html: fmt(e.text) })),
            blocks(e.blocks));
        }
        return null;
      }),
      h('div', { class: 'ending-panel', '--ec': t.color },
        h('div', { class: 'ending-badge' }, h('span', { class: 'type' }, t.label)),
        h('div', { class: 'ending-name' }, run.ending.title),
        h('div', { class: 'ending-actions' },
          s ? h('button', { class: 'btn btn-primary btn-small', style: { background: t.color }, onclick: () => startStory(s) }, '↻ Play this story again') : null,
          h('button', { class: 'btn btn-ghost btn-small', onclick: () => openJournal() }, '📜 Back to journal'))));
    show('reader');
    setAccent((s && s.accent) || DEFAULT_ACCENT);
  }

  // ---- install as an app (see js/app.js)
  const App = window.MFApp;
  const installState = () => (App ? App.installState() : 'unavailable');
  function applyInstallBtn() {
    const s = installState();
    $('#btn-install').classList.toggle('hidden', !(s === 'available' || s === 'ios'));
  }
  function doInstall() {
    const s = installState();
    if (s === 'available') { App.install(); return; }
    if (s === 'ios') {
      openModal(h('div', null,
        h('h3', { class: 'detail-title' }, '📲 Install on iPhone / iPad'),
        h('ol', { class: 'install-steps' },
          h('li', null, 'Open this page in ', h('strong', null, 'Safari'), '.'),
          h('li', null, 'Tap the ', h('strong', null, 'Share'), ' button (the square with an arrow ⬆️).'),
          h('li', null, 'Choose ', h('strong', null, 'Add to Home Screen'), ', then ', h('strong', null, 'Add'), '.')),
        h('p', { class: 'detail-desc' }, 'MysteryFate then opens full-screen from your home screen and works offline. Note: on iPhone the installed app keeps its own progress, separate from Safari.')));
    }
  }
  function installRow() {
    const s = installState();
    const text = {
      installed: 'Installed. MysteryFate runs as an app and works offline.',
      available: 'Add MysteryFate to your home screen or desktop. Opens full-screen and works offline.',
      ios: 'Add to your Home Screen to play full-screen, even offline.',
      unavailable: 'Works offline after your first visit. To install, use your browser menu: “Install app” or “Add to Home screen”.',
    }[s];
    return h('div', { class: 'settings-row' }, h('label', null, 'App', h('small', null, text)),
      s === 'available' || s === 'ios'
        ? h('button', { class: 'btn btn-ghost btn-small', onclick: () => { closeModal(); doInstall(); } }, 'Install')
        : null);
  }

  function openSettings() {
    const seg = (key, options, onChange) => h('div', { class: 'seg' }, options.map(([val, label]) => h('button', {
      class: settings[key] === val ? 'on' : '',
      onclick: (e) => {
        settings[key] = val; saveSettings();
        [...e.currentTarget.parentNode.children].forEach((b) => b.classList.toggle('on', b === e.currentTarget));
        onChange && onChange(val);
      },
    }, label)));
    openModal(h('div', null,
      h('h3', { class: 'detail-title' }, 'Settings'),
      h('div', { class: 'settings-row' }, h('label', null, 'Sound', h('small', null, 'Ambient drones and effects')), seg('sound', [[true, 'On'], [false, 'Off']], applySound)),
      h('div', { class: 'settings-row' }, h('label', null, 'Timed choices', h('small', null, 'Some choices have a countdown. Turn off to take your time.')), seg('timers', [[true, 'On'], [false, 'Off']], (v) => { if (!v) stopTimer(); })),
      h('div', { class: 'settings-row' }, h('label', null, 'Timer pace', h('small', null, 'How long you get once you reveal a timed choice.')), seg('pace', [['relaxed', 'Relaxed'], ['normal', 'Normal'], ['tense', 'Tense']])),
      h('div', { class: 'settings-row' }, h('label', null, 'Auto-scroll', h('small', null, 'Follow new text and jump to the choices automatically. Off = you scroll at your own pace.')), seg('autoscroll', [[false, 'Off'], [true, 'On']], () => updateMore())),
      h('div', { class: 'settings-row' }, h('label', null, 'Already-read text', h('small', null, 'On replays, scenes you’ve read before appear instantly.')), seg('skipSeen', [[true, 'Instant'], [false, 'Type out']])),
      h('div', { class: 'settings-row' }, h('label', null, 'Text size'), seg('textSize', [['s', 'S'], ['m', 'M'], ['l', 'L'], ['xl', 'XL']], applyText)),
      h('div', { class: 'settings-row' }, h('label', null, 'Reading font', h('small', null, 'Serif is book-like; Sans is extra-legible.')), seg('font', [['serif', 'Serif'], ['sans', 'Sans']], applyText)),
      h('div', { class: 'settings-row' }, h('label', null, 'Text speed'), seg('speed', [['normal', 'Normal'], ['fast', 'Fast'], ['instant', 'Instant']])),
      Voice.supported
        ? h('div', { class: 'settings-row' }, h('label', null, 'Read aloud', h('small', null, 'Narrator and characters speak in their own voices (uses your device’s voices).')),
          seg('voice', [['off', 'Off'], ['narrator', 'Narrator'], ['cast', 'Full cast']], (v) => { Voice.setMode(v); applyVoiceBtn(); }))
        : h('div', { class: 'settings-row' }, h('label', null, 'Read aloud', h('small', null, 'Not supported in this browser.'))),
      installRow(),
      h('div', { class: 'settings-row' }, h('label', null, 'Journal', h('small', null, 'Forget the saved transcripts of finished stories.')),
        h('button', { class: 'btn btn-ghost btn-small', onclick: () => {
          if (confirm('Erase your journal of finished stories?')) { store.set('mf.runs', []); closeModal(); }
        } }, 'Clear')),
      h('div', { class: 'settings-row' }, h('label', null, 'Progress', h('small', null, 'Forget discovered endings, story maps and saved runs.')),
        h('button', { class: 'btn btn-ghost btn-small', onclick: () => {
          if (confirm('Erase all discovered endings, story maps, "chosen before" marks and saved runs?')) {
            found = {}; store.set('mf.endings', found);
            seenRaw = {}; Object.keys(seenCache).forEach((k) => delete seenCache[k]); store.set('mf.seen', seenRaw);
            store.set('mf.saves', {});
            renderTitleProgress(); closeModal();
          }
        } }, 'Reset'))));
  }

  function applyText() {
    document.documentElement.dataset.textSize = settings.textSize || 'm';
    document.documentElement.dataset.font = settings.font || 'serif';
  }
  function applySound() {
    Audio.setMuted(!settings.sound);
    Voice.setMuted(!settings.sound);
    $('#btn-sound').textContent = settings.sound ? '🔊' : '🔇';
  }
  function applyVoiceBtn() {
    const b = $('#btn-voice');
    if (!Voice.supported) { b.classList.add('hidden'); return; }
    const on = settings.voice !== 'off';
    b.textContent = on ? '🗣️' : '🤐';
    b.title = on ? 'Read aloud: on (V)' : 'Read aloud: off (V)';
    b.classList.toggle('off', !on);
  }
  function toggleVoice() {
    settings.voice = settings.voice === 'off' ? 'cast' : 'off';
    saveSettings();
    Voice.setMode(settings.voice);
    applyVoiceBtn();
  }

  // ---------------------------------------------------------------- backdrop
  function setBackdrop(key, mood) {
    key = key || G.story.scene;
    if (key === G.bg && mood === G.mood) return;
    G.bg = key; G.mood = mood;
    const wrap = $('#scene-bg');
    const layer = h('div', { class: 'sv-layer', html: Scenes.render(key, mood) });
    wrap.append(layer);
    requestAnimationFrame(() => requestAnimationFrame(() => layer.classList.add('on')));
    const old = [...wrap.children].slice(0, -1);
    setTimeout(() => old.forEach((o) => o.remove()), 1200);
  }

  // ---------------------------------------------------------------- playback
  /** Starts a new run. If this story has a saved run, asks first (unless `fresh`). */
  function startStory(story, { fresh } = {}) {
    const save = saveFor(story.id);
    if (save && !fresh) {
      if (!confirm(`You have a saved run in "${story.title}" (choice ${save.choiceCount + 1}).

OK = start over, Cancel = continue where you left off.`)) return resumeStory(story);
    }
    clearSave(story.id);
    setupRun(story, { state: initialState(story, memoryFor(story)), history: [], path: [], choiceCount: 0, log: [], prev: null });
    goto(story.start);
  }

  /** Continues a saved run exactly where it was left. */
  function resumeStory(story) {
    const save = saveFor(story.id);
    if (!save) return startStory(story);
    setupRun(story, { state: new State(save.state, memoryFor(story)), history: save.history || [], path: save.path || [], choiceCount: save.choiceCount || 0, log: save.log || [], prev: save.prev || null });
    if (save.scene && story.scenes[save.scene]) renderScene(save.scene, story.scenes[save.scene]);
    else if (save.next) goto(save.next);
    else goto(story.start);
  }

  function setupRun(story, run) {
    Audio.init();
    G.story = story;
    G.state = run.state;
    G.history = run.history;
    G.path = run.path;
    G.choiceCount = run.choiceCount;
    G.log = run.log;
    G.prevScene = run.prev;
    G.meterPrev = {};
    G.bg = G.mood = null;
    $('#scene-bg').innerHTML = '';
    Voice.setStory(story);
    Voice.setMode(settings.voice);
    setAccent(story.accent || catOf(story.category).color);
    show('game');
    Audio.ambient(story.ambient || story.category);
    $('#hud-title').textContent = `${story.cover || ''} ${story.title}`;
  }

  function goto(id) {
    let sc = G.story.scenes[id];
    for (let guard = 0; sc && guard < 20; guard++) {
      applyEffects(sc.enter, G.state);
      if (!sc.redirect) break;
      id = resolveNext(sc.redirect, G.state);
      sc = G.story.scenes[id];
    }
    if (!sc) { console.error('Missing scene', id); return; }
    renderScene(id, sc);
  }

  function setArt(art) {
    const el = $('#scene-art');
    el.textContent = art || '';
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  }

  function updateHud() {
    $('#hud-stage').textContent = `Choice ${G.choiceCount + 1}`;
    const wrap = $('#hud-meters');
    wrap.innerHTML = '';
    for (const m of G.story.hud || []) {
      const max = m.max || 5;
      const v = Math.max(0, Math.min(max, G.state.get(m.var)));
      const inverted = m.invert ?? INVERTED_METER.test(m.label || m.var);
      const danger = inverted ? v >= max - 1 : v <= 1;
      const changed = G.meterPrev[m.var] != null && G.meterPrev[m.var] !== v;
      G.meterPrev[m.var] = v;
      wrap.append(h('span', { class: `meter${danger ? ' low' : ''}${changed ? ' bump' : ''}`, title: `${m.label}: ${v}/${max}` },
        h('span', null, m.icon || ''), h('span', null, m.label),
        h('span', { class: 'meter-pips' }, Array.from({ length: max }, (_, i) => h('i', { class: i < v ? 'on' : '' })))));
    }
  }

  function wrapWords(el) {
    const words = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const n of nodes) {
      const frag = document.createDocumentFragment();
      for (const part of n.textContent.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) frag.append(part);
        else { const s = h('span', { class: 'w' }, part); frag.append(s); words.push(s); }
      }
      n.replaceWith(frag);
    }
    return words;
  }

  async function typeBlocks(container, blocks, token, fast = false) {
    const stage = $('#stage');
    const delay = fast ? 0 : SPEEDS[settings.speed] ?? SPEEDS.normal;
    stage.classList.add('typing');
    for (const b of blocks) {
      if (token !== G.token) return false;
      let el, target;
      if (b.type === 'say') {
        target = h('p', { html: fmt(b.text) });
        el = h('div', { class: 'say' }, h('span', { class: 'speaker' }, b.speaker), target);
      } else {
        el = target = h('p', { html: fmt(b.text) });
      }
      container.append(el);
      // Read aloud alongside the typewriter; the next paragraph waits for the voice to finish.
      const speaking = G.skip || fast ? null : Voice.speakBlock(b);
      if (delay && !G.skip) {
        const words = wrapWords(target);
        for (const w of words) {
          if (G.skip || token !== G.token) break;
          w.classList.add('on');
          await sleep(delay);
        }
        words.forEach((w) => w.classList.add('on'));
        if (!G.skip && token === G.token) {
          follow(el);
          await sleep(220);
        }
      }
      if (speaking && !G.skip && token === G.token) {
        el.classList.add('speaking');
        await speaking;
        el.classList.remove('speaking');
      }
    }
    stage.classList.remove('typing');
    return token === G.token;
  }

  async function renderScene(id, sc) {
    const token = ++G.token;
    stopTimer();
    Voice.stop();
    G.sceneId = id;
    G.skip = false;
    G.busy = false;
    const mood = sc.mood || G.story.mood || 'default';
    FX.mood(mood);
    FX.weather(sc.weather || G.story.weather || null);
    if (sc.fx) FX.oneShot(sc.fx);
    setBackdrop(sc.scene, mood);
    setArt(sc.art);
    $('#scene-title').textContent = sc.title || '';
    const stamp = typeof sc.stamp === 'function' ? sc.stamp(G.state) : sc.stamp || '';
    setStamp(stamp, sc.jump);
    updateHud();
    const narrative = $('#narrative');
    const choices = $('#choices');
    narrative.innerHTML = '';
    choices.innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const blocks = resolveText(sc.text, G.state);
    if (G.prevScene && G.prevScene !== id) markSeen('e', `${G.prevScene}>${id}`);
    G.prevScene = id;
    const readBefore = settings.skipSeen && seenOf(G.story.id).s.has(id);
    $('#scene-title').classList.toggle('read-before', readBefore);
    G.sceneLogIdx = G.log.length;
    if (!sc.ending) writeSave({ scene: id, log: G.log.slice() }); // resume re-renders this scene
    G.log.push({ k: 'scene', title: sc.title || '', stamp, art: sc.art || '', bg: G.bg, mood, blocks });

    if (sc.ending) return renderEnding(sc, token, blocks);

    const ok = await typeBlocks(narrative, blocks, token, readBefore);
    if (!ok) return;
    markSeen('s', id);
    if (sc.fakeEnding && !(await fakeEnding(sc, token, readBefore))) return;
    showChoices(sc, token);
  }

  /** Page / time stamp above the scene title, with an optional jump transition (page | back | forward | glitch). */
  function setStamp(text, jump) {
    const el = $('#scene-stamp');
    el.textContent = '';
    if (text) el.append(h('span', null, text));
    const stage = $('#stage');
    stage.classList.remove('jump-page', 'jump-back', 'jump-forward', 'jump-glitch');
    if (!jump) return;
    void stage.offsetWidth; // restart the animation
    stage.classList.add('jump-' + jump);
    if (jump === 'glitch') FX.oneShot('glitch');
    else Audio.whoosh();
  }

  /**
   * A fake ending: the ending card appears as if the story were over, then cracks and the story goes on.
   * Clicking any of its buttons breaks it early. Returns false if the scene was left meanwhile.
   */
  async function fakeEnding(sc, token, quick) {
    const e = sc.fakeEnding;
    const t = ENDING_TYPES[e.type] || ENDING_TYPES.neutral;
    const total = listEndings(G.story).length;
    let broken = false;
    const crack = () => { broken = true; };
    $('#hud-stage').textContent = 'The End';
    Audio.sting(e.type);
    if (e.type === 'death') FX.oneShot('redflash');
    const fakeBtn = (label) => h('button', { class: 'btn btn-ghost btn-small', onclick: crack }, label);
    const panel = h('div', { class: 'ending-panel fake', '--ec': t.color },
      h('div', { class: 'ending-badge' }, h('span', { class: 'type' }, t.label)),
      h('div', { class: 'ending-name' }, e.title),
      h('div', { class: 'ending-count' }, e.note || `Ending ? of ${total} · thank you for playing`),
      h('div', { class: 'ending-actions' },
        h('button', { class: 'btn btn-primary btn-small', style: { background: t.color }, onclick: crack }, '↻ Play again'),
        fakeBtn('🗺 Map'), fakeBtn('☰ Other stories')));
    $('#narrative').append(panel);
    setTimeout(() => follow(panel, 'center'), 200);
    const hold = quick ? 1200 : e.hold || 3200;
    for (let waited = 0; waited < hold && !broken; waited += 100) {
      await sleep(100);
      if (token !== G.token) return false;
    }
    FX.oneShot('glitch');
    Audio.whoosh();
    panel.classList.add('broken');
    await sleep(900);
    if (token !== G.token) return false;
    updateHud();
    return true;
  }

  const isTimed = (sc) => !!(sc.timer && settings.timers && sc.timeout != null);

  function showChoices(sc, token) {
    const wrap = $('#choices');
    wrap.innerHTML = '';
    const list = availableChoices(sc, G.state);
    // Timed scenes: let the player finish reading before the choices (and the clock) appear.
    if (isTimed(sc)) {
      const n = list.length;
      const gate = h('button', {
        class: 'gate',
        onclick: () => { Audio.click(); revealChoices(sc, token, list); },
        onmouseenter: () => Audio.hover(),
      },
      h('span', { class: 'gate-top' }, `⏳ Timed decision · ${n} choice${n === 1 ? '' : 's'} · ${timerSecs(sc.timer)}s`),
      h('span', { class: 'gate-cta' }, 'I’m ready ▸'),
      h('span', { class: 'gate-sub' }, 'Take your time reading. The clock starts when you reveal the choices.'));
      wrap.append(gate);
      gate.focus({ preventScroll: true });
      setTimeout(() => { if (token === G.token) follow(wrap); }, 120);
      return;
    }
    renderChoiceButtons(sc, token, list);
  }

  function revealChoices(sc, token, list) {
    if (token !== G.token) return;
    renderChoiceButtons(sc, token, list);
    if (!isTimed(sc)) return; // timers switched off while the gate was up
    // Start the clock once the choices have finished fading in.
    const fadeIn = 450 + Math.max(0, list.length - 1) * 90 + 100;
    setTimeout(() => {
      if (token !== G.token || G.busy) return;
      startTimer(timerSecs(sc.timer), token, () => pick(getTimeoutChoice(sc), null, sc));
    }, fadeIn);
  }

  function renderChoiceButtons(sc, token, list) {
    const wrap = $('#choices');
    wrap.innerHTML = '';
    list.forEach((c, i) => {
      const btn = h('button', {
        class: 'choice', style: { animationDelay: `${i * 0.09}s` },
        onclick: () => pick(c, btn, sc), onmouseenter: () => Audio.hover(),
      },
      h('span', { class: 'key' }, String(i + 1)),
      h('span', { class: 'ctext' }, h('span', { html: fmt(c.text) }), c.hint ? h('span', { class: 'chint', html: fmt(c.hint) }) : null),
      seenOf(G.story.id).c.has(`${G.sceneId}#${sc.choices.indexOf(c)}`) ? h('span', { class: 'chosen-before', title: 'You picked this in an earlier run' }, '✓ chosen before') : null);
      wrap.append(btn);
    });
    setTimeout(() => { if (token === G.token) follow(wrap); }, 120);
  }

  async function pick(choice, btn, sc) {
    if (G.busy) return;
    G.busy = true;
    stopTimer();
    Voice.stop();
    Audio.click();
    const buttons = [...document.querySelectorAll('#choices .choice')];
    buttons.forEach((b) => b.classList.add(b === btn ? 'picked' : 'faded'));
    if (choice.isTimeout) FX.oneShot('redflash');
    await sleep(btn ? 380 : 650);

    G.history.push({ sceneId: G.sceneId, state: G.state.toJSON(), choiceCount: G.choiceCount, pathLen: G.path.length, logLen: G.sceneLogIdx });
    G.path.push({ text: choice.text, timeout: !!choice.isTimeout, title: sc.title });
    G.choiceCount++;
    applyEffects(choice, G.state);
    const next = resolveNext(choice.next, G.state);
    const outcome = choice.outcome == null ? [] : resolveText(choice.outcome, G.state);
    G.log.push({ k: 'choice', text: choice.text, timeout: !!choice.isTimeout, blocks: outcome });
    const choiceKey = `${G.sceneId}#${choice.isTimeout ? 't' : sc.choices.indexOf(choice)}`;
    const outcomeReadBefore = settings.skipSeen && seenOf(G.story.id).c.has(choiceKey);
    markSeen('c', choiceKey);
    writeSave({ next, log: G.log.slice() }); // resume continues at the next scene

    if (choice.outcome == null) { goto(next); return; }

    const token = ++G.token;
    G.skip = false;
    if (choice.fx) FX.oneShot(choice.fx);
    if (choice.scene) setBackdrop(choice.scene, G.mood);
    if (choice.art) setArt(choice.art);
    updateHud();
    const narrative = $('#narrative');
    const choices = $('#choices');
    narrative.innerHTML = '';
    choices.innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    narrative.append(h('div', { class: `you-chose${choice.isTimeout ? ' timeout' : ''}` },
      choice.isTimeout ? '⏳ Too slow —' : '▸ You chose:', h('b', { html: fmt(choice.text) })));
    G.busy = false;
    const ok = await typeBlocks(narrative, outcome, token, outcomeReadBefore);
    if (!ok) return;
    const cont = h('button', { class: 'choice continue', onclick: () => { Audio.click(); goto(next); } }, 'Continue ▸');
    choices.append(cont);
    cont.focus({ preventScroll: true });
    setTimeout(() => { if (token === G.token) follow(choices); }, 120);
  }

  // ---------------------------------------------------------------- timer
  // Pauses while the tab is hidden or a modal (settings, etc.) is open.
  const timerPaused = () => document.hidden || !$('#modal').classList.contains('hidden');

  function startTimer(secs, token, onEnd) {
    stopTimer();
    const el = $('#timer'), bar = $('#timer-bar'), label = $('#timer-secs');
    el.classList.remove('hidden', 'urgent', 'paused');
    bar.style.transition = 'transform .1s linear';
    bar.style.transform = 'scaleX(1)';
    const total = secs * 1000;
    let left = total;
    let lastWhole = secs;
    let last = performance.now();
    label.textContent = `${secs}s`;
    Audio.tick();
    G.timer = setInterval(() => {
      if (token !== G.token) return stopTimer();
      const now = performance.now();
      const dt = now - last;
      last = now;
      if (timerPaused()) { el.classList.add('paused'); label.textContent = `${Math.ceil(left / 1000)}s · paused`; return; }
      el.classList.remove('paused');
      left -= dt;
      bar.style.transform = `scaleX(${Math.max(0, left / total)})`;
      const whole = Math.max(0, Math.ceil(left / 1000));
      label.textContent = `${whole}s`;
      if (whole < lastWhole) {
        lastWhole = whole;
        if (whole <= 3) { el.classList.add('urgent'); if (whole > 0) Audio.heartbeat(); } else Audio.tick(whole <= 5);
      }
      if (left <= 0) { stopTimer(); onEnd(); }
    }, 100);
  }
  function stopTimer() {
    clearInterval(G.timer);
    G.timer = null;
    $('#timer').classList.add('hidden');
  }

  // ---------------------------------------------------------------- endings
  async function renderEnding(sc, token, blocks) {
    const e = sc.ending;
    const t = ENDING_TYPES[e.type] || ENDING_TYPES.neutral;
    const narrative = $('#narrative');
    $('#hud-stage').textContent = 'The End';
    const isNew = markFound(G.story, e.id);
    if (e.type === 'death') FX.oneShot('redflash');
    clearSave(G.story.id);
    markSeen('s', G.sceneId);
    saveRun({
      id: Date.now(), story: G.story.id, title: G.story.title, cover: G.story.cover || '',
      ending: { id: e.id, title: e.title, type: e.type }, date: new Date().toISOString(),
      choices: G.path.length, log: G.log.slice(),
    });

    const ok = await typeBlocks(narrative, blocks, token);
    if (!ok) return;
    await sleep(500);
    if (token !== G.token) return;

    Audio.sting(e.type);
    const endings = listEndings(G.story);
    const got = foundFor(G.story);
    const idx = endings.findIndex((x) => x.id === e.id) + 1;
    const block = h('div', { class: 'ending-panel', '--ec': t.color },
      h('div', { class: 'ending-badge' }, h('span', { class: 'type' }, t.label)),
      h('div', { class: 'ending-name' }, e.title, isNew ? h('span', { class: 'new-badge' }, 'NEW') : null),
      h('div', { class: 'ending-count' }, `Ending ${idx} of ${endings.length} · ${got.size}/${endings.length} discovered in this story`),
      h('details', { class: 'recap' },
        h('summary', null, `Your path · ${G.path.length} choices`),
        h('ol', null, G.path.map((p) => h('li', { class: p.timeout ? 't' : '', html: (p.timeout ? '⏳ ' : '') + fmt(p.text) })))),
      h('div', { class: 'ending-actions' },
        G.history.length ? h('button', { class: 'btn btn-ghost btn-small', onclick: rewind }, '⟲ Rewind last choice') : null,
        h('button', { class: 'btn btn-primary btn-small', style: { background: t.color }, onclick: () => startStory(G.story) }, '↻ Play again'),
        h('button', { class: 'btn btn-ghost btn-small', onclick: () => openDetail(G.story) }, '🏆 Endings'),
        h('button', { class: 'btn btn-ghost btn-small', onclick: () => openJournal(G.story.id) }, '📜 Journal'),
        h('button', { class: 'btn btn-ghost btn-small', onclick: () => openMap(G.story) }, '🗺 Map'),
        h('button', { class: 'btn btn-ghost btn-small', onclick: () => { renderCategories(); show('categories'); } }, '☰ Other stories')));
    narrative.append(block);
    setTimeout(() => follow(block, 'center'), 200);
  }

  function rewind() {
    const last = G.history.pop();
    if (!last) return;
    Audio.whoosh();
    FX.oneShot('glitch');
    G.state = new State(last.state, G.state.memory);
    G.choiceCount = last.choiceCount;
    G.path.length = last.pathLen;
    G.log.length = last.logLen;
    G.prevScene = null;
    renderScene(last.sceneId, G.story.scenes[last.sceneId]);
  }

  // ---------------------------------------------------------------- input
  function onKey(e) {
    if (!$('#modal').classList.contains('hidden')) { if (e.key === 'Escape') closeModal(); return; }
    if (e.key === 'm' || e.key === 'M') { settings.sound = !settings.sound; saveSettings(); applySound(); return; }
    if ((e.key === 'v' || e.key === 'V') && Voice.supported) { toggleVoice(); return; }
    if (!inGame()) return;
    if ($('#stage').classList.contains('typing') && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); skipNow(); return; }
    const n = parseInt(e.key, 10);
    const buttons = [...document.querySelectorAll('#choices .choice:not(.continue)')];
    if (n >= 1 && n <= buttons.length) { buttons[n - 1].click(); return; }
    const cont = $('#choices .continue') || $('#choices .gate');
    if (cont && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); cont.click(); }
  }

  function init() {
    $('#narrative').addEventListener('click', () => { if ($('#stage').classList.contains('typing')) skipNow(); });
    $('#more-below').addEventListener('click', () => { Audio.click(); scrollMore(); });
    window.addEventListener('scroll', updateMore, { passive: true });
    window.addEventListener('resize', updateMore);
    new MutationObserver(() => requestAnimationFrame(updateMore)).observe($('#stage'), { childList: true, subtree: true });
    $('#btn-voice').addEventListener('click', () => { Audio.init(); toggleVoice(); });
    $('#btn-journal').addEventListener('click', () => { Audio.init(); Audio.click(); openJournal(); });
    $('#btn-install').addEventListener('click', () => { Audio.init(); Audio.click(); doInstall(); });
    if (App) App.onChange(applyInstallBtn);
    applyInstallBtn();
    $('#btn-begin').addEventListener('click', () => { Audio.init(); Audio.ambient('menu'); Audio.click(); renderCategories(); show('categories'); });
    $('#btn-surprise').addEventListener('click', () => {
      if (!stories.length) return;
      startStory(stories[Math.floor(Math.random() * stories.length)]);
    });
    $('#btn-home').addEventListener('click', () => {

      renderTitleProgress();
      show('title');
    });
    $('#btn-sound').addEventListener('click', () => { Audio.init(); settings.sound = !settings.sound; saveSettings(); applySound(); });
    $('#btn-settings').addEventListener('click', openSettings);
    document.querySelectorAll('[data-goto]').forEach((b) => b.addEventListener('click', () => {
      const to = b.dataset.goto;
      if (to === 'journal') return openJournal();
      if (to === 'stories' && G.mapStory) return openCategory(G.mapStory.category);
      if (to === 'title') renderTitleProgress();
      renderCategories();
      show(to);
    }));
    document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closeModal));
    document.addEventListener('keydown', onKey);
    applySound();
    applyText();
    applyVoiceBtn();
    Voice.setMode(settings.voice);
    renderTitleProgress();
    FX.mood('default');
    FX.weather('dust');
  }

  init();
})();
