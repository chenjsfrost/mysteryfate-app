/*
 * MysteryFate read-aloud: narrates scenes with the browser's built-in speech voices (Web Speech API).
 * Each story's `voices` block gives the narrator and every speaker a gender / pitch / rate / accent,
 * so characters sound like themselves. Works offline with system voices; nicer with "Natural" voices (Edge).
 */
(function () {
  'use strict';

  const synth = window.speechSynthesis;
  const supported = !!(synth && window.SpeechSynthesisUtterance);

  const FEMALE = /\b(female|woman|zira|susan|hazel|aria|jenny|samantha|karen|moira|tessa|fiona|victoria|serena|libby|sonia|natasha|catherine|heera|veena|kate|emma|amy|joanna|salli|kimberly|ivy|olivia|ava|allison|michelle|clara|neerja|katja|hedda|anna|marlene|linda|heather|elsa|amala|maisie|abbi|bella|hollie|sara|ashley|cora|elizabeth|jane|nancy|monica|xiaoxiao)\b|google us english/i;
  const MALE = /\b(male|man|david|mark|george|guy|daniel|alex|fred|ryan|thomas|oliver|rishi|ravi|james|brian|matthew|justin|joey|eric|christopher|roger|steffan|conrad|stefan|hans|prabhat|william|liam|noah|elliot|alfie|ethan|andrew|brandon|davis|jason|tony|aaron|kai|luke|connor|mitchell|duncan)\b/i;
  const genderOf = (v) => (FEMALE.test(v.name) ? 'female' : MALE.test(v.name) ? 'male' : 'neutral');

  // Only clear, native-English voices: no foreign-language voices reading English, no novelty voices.
  const CLEAR_ENGLISH = /^en[-_](US|GB|AU|CA|IE|NZ)\b/i;
  const NOVELTY = /espeak|albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|junior|ralph|kathy|princess|deranged|hysterical|\bfred\b|grandma|grandpa|eddy|flo\b|reed|rocko|sandy|shelley/i;
  // Higher = clearer: neural/natural (Edge, Apple premium) > Google > standard system voices.
  const quality = (v) => (/natural|neural|premium|enhanced/i.test(v.name) ? 3 : /google/i.test(v.name) ? 2 : 1);
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  // Keep speech natural: story pitch/rate only nudge the voice a little, so it never sounds garbled.
  const softPitch = (p) => clamp(1 + ((p ?? 1) - 1) * 0.35, 0.88, 1.12);
  const softRate = (r) => clamp(1 + ((r ?? 1) - 1) * 0.4, 0.9, 1.1);
  const hash = (s) => { let x = 2166136261; for (const ch of s) x = Math.imul(x ^ ch.charCodeAt(0), 16777619); return x >>> 0; };

  let voices = [];
  let story = null;
  let cast = {};            // speaker -> { voice, pitch, rate, volume, lang }
  let mode = 'cast';        // off | narrator | cast
  let muted = false;
  let gen = 0;              // bumps on stop() so pending promises resolve
  let narratorURI = null;   // characters avoid sounding like the narrator
  const waiters = new Set();

  function loadVoices() {
    if (!supported) return;
    let all = synth.getVoices().filter((v) => !NOVELTY.test(v.name));
    // Offline, online-only voices (e.g. Chrome's "Google ..." voices) fail silently: keep to on-device voices.
    if (navigator.onLine === false) { const local = all.filter((v) => v.localService); if (local.length) all = local; }
    voices = all.filter((v) => CLEAR_ENGLISH.test(v.lang));
    if (!voices.length) voices = all.filter((v) => /^en/i.test(v.lang)); // any English as a last resort
    if (story) buildCast();
  }
  if (supported) {
    loadVoices();
    synth.addEventListener ? synth.addEventListener('voiceschanged', loadVoices) : (synth.onvoiceschanged = loadVoices);
    addEventListener('online', loadVoices); addEventListener('offline', loadVoices);
  }

  /**
   * Picks the clearest English voice for a character: quality first, then matching gender,
   * then an unused voice (so characters sound different), then the requested English accent.
   * Non-English accents in story data (e.g. de-DE) are ignored — everyone speaks clear English.
   */
  function pickVoice(name, spec, used) {
    if (!voices.length) return null;
    const accent = (spec.accent || '').toLowerCase().replace('_', '-');
    const gender = spec.gender || 'neutral';
    const score = (v) => {
      const lang = v.lang.toLowerCase().replace('_', '-');
      return quality(v) * 40 +
        (gender !== 'neutral' && genderOf(v) === gender ? 20 : 0) +
        (gender !== 'neutral' && genderOf(v) !== gender && genderOf(v) !== 'neutral' ? -60 : 0) +
        (used.has(v.voiceURI) ? 0 : 25) +
        (name !== 'narrator' && narratorURI === v.voiceURI ? -25 : 0) +
        (accent && lang === accent ? 5 : 0);
    };
    const top = Math.max(...voices.map(score));
    const best = voices.filter((v) => score(v) === top);
    const v = best[hash(name) % best.length];
    used.add(v.voiceURI);
    if (name === 'narrator') narratorURI = v.voiceURI;
    return v;
  }

  function buildCast() {
    cast = {};
    if (!story) return;
    const specs = Object.assign({ narrator: { gender: 'neutral', pitch: 1, rate: 1 } }, story.voices || {});
    const used = new Set();
    const make = (name, spec) => {
      const voice = pickVoice(name, spec, used);
      return { voice, pitch: softPitch(spec.pitch), rate: softRate(spec.rate), volume: Math.max(0.7, spec.volume ?? 1), lang: voice ? voice.lang : 'en-US' };
    };
    cast.narrator = make('narrator', specs.narrator);
    for (const [name, spec] of Object.entries(specs)) if (name !== 'narrator') cast[name] = make(name, spec);
  }

  function voiceFor(speaker) {
    if (!speaker || mode === 'narrator') return cast.narrator;
    if (cast[speaker]) return cast[speaker];
    // Unlisted speaker: derive a stable, distinct voice from their name.
    const h = hash(speaker);
    const base = cast.narrator || {};
    cast[speaker] = { ...base, pitch: softPitch(0.75 + (h % 60) / 100), rate: softRate(0.9 + ((h >> 8) % 25) / 100) };
    return cast[speaker];
  }

  const clean = (t) => String(t)
    .replace(/\*\*?([^*]+)\*\*?/g, '$1')
    .replace(/\p{Extended_Pictographic}|️|‍/gu, '')
    .replace(/[—–]/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();

  // Chrome cuts off long utterances, so speak sentence-sized chunks.
  function chunks(text) {
    const parts = text.match(/[^.!?…]+[.!?…]+["'”’)]*|[^.!?…]+$/g) || [text];
    const out = [];
    for (const p of parts) {
      const s = p.trim();
      if (!s) continue;
      if (out.length && (out[out.length - 1] + ' ' + s).length < 180) out[out.length - 1] += ' ' + s;
      else out.push(s);
    }
    return out;
  }

  function sayOne(text, v, myGen) {
    return new Promise((resolve) => {
      if (myGen !== gen) return resolve();
      const u = new SpeechSynthesisUtterance(text);
      if (v.voice) u.voice = v.voice;
      u.lang = v.lang;
      u.pitch = Math.max(0, Math.min(2, v.pitch));
      u.rate = Math.max(0.5, Math.min(2, v.rate));
      u.volume = Math.max(0, Math.min(1, v.volume));
      let done = false;
      const finish = () => { if (done) return; done = true; clearTimeout(guard); waiters.delete(finish); resolve(); };
      // Safety net: some engines never fire `end`.
      const words = text.split(/\s+/).length;
      const guard = setTimeout(finish, (words / (2.4 * u.rate)) * 1000 + 3000);
      waiters.add(finish);
      u.onend = finish;
      u.onerror = finish;
      synth.speak(u);
    });
  }

  /** Speaks one render block ({type:'p'|'say', text, speaker}). Resolves when finished or stopped. */
  async function speakBlock(block) {
    if (!active()) return;
    const v = voiceFor(block.type === 'say' ? block.speaker : null);
    if (!v) return;
    const text = clean(block.text);
    if (!text) return;
    const myGen = gen;
    for (const part of chunks(text)) {
      if (myGen !== gen) return;
      await sayOne(part, v, myGen);
    }
  }

  function stop() {
    gen++;
    if (supported) synth.cancel();
    [...waiters].forEach((f) => f());
  }

  const active = () => supported && mode !== 'off' && !muted && voices.length > 0;

  window.MFVoice = {
    supported,
    setStory(s) { story = s; buildCast(); },
    setMode(m) { mode = m; if (m === 'off') stop(); },
    setMuted(m) { muted = m; if (m) stop(); },
    active,
    speakBlock,
    stop,
    /** For the settings screen: which system voice each character got. */
    castList() { return Object.entries(cast).map(([name, v]) => ({ name, voice: v.voice ? v.voice.name : '(default)' })); },
  };
})();
