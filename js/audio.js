/* MysteryFate procedural audio: ambient drones per genre + UI sound effects. No audio files needed. */
(function () {
  'use strict';

  const PRESETS = {
    horror:   { notes: [41.2, 43.65], type: 'sawtooth', cutoff: 260, lfo: 0.07, depth: 140, gain: 0.07 },
    mystery:  { notes: [65.41, 98.0], type: 'triangle', cutoff: 520, lfo: 0.09, depth: 200, gain: 0.06 },
    comedy:   { notes: [130.81, 164.81, 196.0], type: 'sine', cutoff: 1400, lfo: 0.5, depth: 300, gain: 0.025, wobble: 4 },
    fantasy:  { notes: [87.31, 130.81, 174.61], type: 'sine', cutoff: 900, lfo: 0.12, depth: 350, gain: 0.05 },
    scifi:    { notes: [55.0, 82.41], type: 'square', cutoff: 240, lfo: 0.05, depth: 160, gain: 0.04 },
    thriller: { notes: [49.0, 73.42], type: 'sawtooth', cutoff: 420, lfo: 1.1, depth: 220, gain: 0.05, pulse: true },
    adventure: { notes: [73.42, 110.0, 146.83], type: 'triangle', cutoff: 700, lfo: 0.15, depth: 260, gain: 0.045 },
    drama:    { notes: [130.81, 155.56, 196.0], type: 'sine', cutoff: 1000, lfo: 0.08, depth: 250, gain: 0.035 },
    menu:     { notes: [55.0, 82.41, 110.0], type: 'triangle', cutoff: 380, lfo: 0.06, depth: 180, gain: 0.045 },
  };

  const A = {
    ctx: null, master: null, amb: null, muted: false,

    init() {
      if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.6;
      this.master.connect(this.ctx.destination);
    },

    setMuted(m) {
      this.muted = m;
      if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 0.6, this.ctx.currentTime, 0.1);
    },

    ambient(kind) {
      if (!this.ctx) return;
      if (this.amb && this.amb.kind === kind) return;
      this.stopAmbient();
      const p = PRESETS[kind] || PRESETS.menu;
      const ctx = this.ctx, t = ctx.currentTime;
      const out = ctx.createGain();
      out.gain.setValueAtTime(0, t);
      out.gain.linearRampToValueAtTime(p.gain, t + 3);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = p.cutoff;
      filter.Q.value = 6;
      filter.connect(out);
      out.connect(this.master);

      const nodes = [];
      p.notes.forEach((f, i) => {
        [-6, 6].forEach((det) => {
          const o = ctx.createOscillator();
          o.type = p.type;
          o.frequency.value = f;
          o.detune.value = det + i * 2;
          if (p.wobble) {
            const vib = ctx.createOscillator(), vg = ctx.createGain();
            vib.frequency.value = p.wobble; vg.gain.value = 3;
            vib.connect(vg); vg.connect(o.frequency); vib.start(); nodes.push(vib);
          }
          o.connect(filter); o.start(); nodes.push(o);
        });
      });
      const lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = p.lfo; lg.gain.value = p.depth;
      lfo.connect(lg); lg.connect(filter.frequency); lfo.start(); nodes.push(lfo);
      if (p.pulse) {
        const pl = ctx.createOscillator(), pg = ctx.createGain();
        pl.frequency.value = 1.2; pg.gain.value = p.gain * 0.6;
        pl.connect(pg); pg.connect(out.gain); pl.start(); nodes.push(pl);
      }
      this.amb = { kind, out, nodes };
    },

    stopAmbient() {
      if (!this.amb || !this.ctx) return;
      const { out, nodes } = this.amb, t = this.ctx.currentTime;
      out.gain.cancelScheduledValues(t);
      out.gain.setTargetAtTime(0, t, 0.6);
      setTimeout(() => nodes.forEach((n) => { try { n.stop(); } catch (e) { /* already stopped */ } }), 3000);
      this.amb = null;
    },

    tone(freq, dur = 0.12, type = 'triangle', vol = 0.12, when = 0, slideTo) {
      if (!this.ctx) return;
      const t = this.ctx.currentTime + when;
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(this.master);
      o.start(t); o.stop(t + dur + 0.05);
    },

    hover() { this.tone(880, 0.05, 'sine', 0.03); },
    click() { this.tone(520, 0.09, 'triangle', 0.1); this.tone(780, 0.12, 'triangle', 0.06, 0.04); },
    tick(urgent) { this.tone(urgent ? 1100 : 760, 0.05, 'square', urgent ? 0.06 : 0.035); },
    heartbeat() { this.tone(60, 0.15, 'sine', 0.35); this.tone(52, 0.18, 'sine', 0.28, 0.2); },
    whoosh() { this.tone(300, 0.5, 'sawtooth', 0.04, 0, 60); },
    sting(type) {
      const seqs = {
        death:   [[220, 0], [207.6, 0.25], [196, 0.5], [110, 0.8]],
        bad:     [[293.7, 0], [277.2, 0.3], [233.1, 0.6]],
        neutral: [[261.6, 0], [329.6, 0.25], [293.7, 0.5]],
        good:    [[261.6, 0], [329.6, 0.18], [392, 0.36], [523.3, 0.54]],
        true:    [[261.6, 0], [392, 0.2], [523.3, 0.4], [659.3, 0.6], [784, 0.8]],
        secret:  [[523.3, 0], [622.3, 0.15], [740, 0.3], [932.3, 0.45], [1046.5, 0.7]],
      };
      const wave = type === 'death' || type === 'bad' ? 'sawtooth' : 'triangle';
      (seqs[type] || seqs.neutral).forEach(([f, w]) => this.tone(f, type === 'death' ? 1.2 : 0.7, wave, 0.09, w));
    },
  };

  window.MFAudio = A;
})();
