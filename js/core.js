/*
 * MysteryFate core: story registry, game state and story-graph helpers.
 * Shared by the browser engine (js/engine.js) and the validator (tools/validate.js).
 */
(function (root) {
  'use strict';

  const MF = (root.MF = root.MF || {});
  MF.stories = MF.stories || [];

  /** Story files call this to add themselves to the library. */
  root.registerStory = function registerStory(story) {
    MF.stories.push(story);
  };

  /**
   * Mutable run state: boolean flags + numeric vars. Passed to every condition/effect function.
   * `memory` (not saved with the run) = what the player discovered in EARLIER runs of this story,
   * captured when the run starts: { endings: [endingId, ...] }. Read it with s.seen(id) / s.found().
   */
  class State {
    constructor(data, memory) {
      this.flags = data && data.flags ? { ...data.flags } : {};
      this.vars = data && data.vars ? { ...data.vars } : {};
      this.memory = memory || { endings: [] };
    }
    /** True if this ending was reached in an earlier run (replay memory). */
    seen(endingId) { return this.memory.endings.includes(endingId); }
    /** How many different endings of this story were reached in earlier runs. */
    found() { return this.memory.endings.length; }
    has(flag) { return !!this.flags[flag]; }
    set(...flags) { flags.flat().forEach((f) => { this.flags[f] = true; }); }
    unset(...flags) { flags.flat().forEach((f) => { delete this.flags[f]; }); }
    get(key) { return this.vars[key] ?? 0; }
    add(key, n = 1) { this.vars[key] = this.get(key) + n; }
    setVar(key, value) { this.vars[key] = value; }
    /** Number of the given flags that are set. */
    count(...flags) { return flags.flat().filter((f) => this.flags[f]).length; }
    toJSON() { return { flags: this.flags, vars: this.vars }; }
    clone() { return new State(JSON.parse(JSON.stringify(this.toJSON())), this.memory); }
    key() { return JSON.stringify([Object.keys(this.flags).sort(), Object.entries(this.vars).sort()]); }
  }

  /** Condition: function(s) | flag name | array of conditions (all must hold) | undefined (true). */
  function evalCond(cond, s) {
    if (cond == null) return true;
    if (typeof cond === 'function') return !!cond(s);
    if (typeof cond === 'string') return cond.startsWith('!') ? !s.has(cond.slice(1)) : s.has(cond);
    if (Array.isArray(cond)) return cond.every((c) => evalCond(c, s));
    return !!cond;
  }

  /**
   * Flattens rich text into render blocks.
   * Text may be: string | array | function(s) | { if, text, else } | { speaker, say, if }.
   */
  function resolveText(text, s) {
    const out = [];
    const walk = (t) => {
      if (t == null || t === false) return;
      if (typeof t === 'function') return walk(t(s));
      if (typeof t === 'string') { if (t.trim()) out.push({ type: 'p', text: t }); return; }
      if (Array.isArray(t)) { t.forEach(walk); return; }
      if (typeof t === 'object') {
        if ('if' in t && !evalCond(t.if, s)) { walk(t.else); return; }
        if (t.speaker) { out.push({ type: 'say', speaker: t.speaker, text: String(t.say ?? t.text ?? '') }); return; }
        walk(t.text);
      }
    };
    walk(text);
    return out;
  }

  function availableChoices(scene, s) {
    return (scene.choices || []).filter((c) => evalCond(c.if, s));
  }

  /** Applies declarative + functional effects. Works for choices and for scene `enter` blocks. */
  function applyEffects(fx, s) {
    if (!fx) return;
    if (fx.set) s.set(fx.set);
    if (fx.unset) s.unset(fx.unset);
    if (fx.add) for (const k of Object.keys(fx.add)) s.add(k, fx.add[k]);
    if (fx.vars) for (const k of Object.keys(fx.vars)) s.setVar(k, fx.vars[k]);
    if (typeof fx.effect === 'function') fx.effect(s);
  }

  function resolveNext(target, s) {
    return typeof target === 'function' ? target(s) : target;
  }

  /** The option taken automatically when a scene's timer runs out. */
  function getTimeoutChoice(scene) {
    const t = scene.timeout;
    if (t == null) return null;
    if (typeof t === 'number') return { ...scene.choices[t], isTimeout: true };
    return { text: 'You froze.', ...t, isTimeout: true };
  }

  /** All endings of a story, in the order they appear in the scene list. */
  function listEndings(story) {
    return Object.entries(story.scenes)
      .filter(([, sc]) => sc.ending)
      .map(([id, sc]) => ({ sceneId: id, ...sc.ending }));
  }

  function initialState(story, memory) {
    const s = new State(null, memory);
    if (story.vars) for (const k of Object.keys(story.vars)) s.setVar(k, story.vars[k]);
    if (story.flags) s.set(story.flags);
    return s;
  }

  /**
   * Illustrated backdrops a scene can use via `scene: '<key>'` (drawn by js/scenes.js, tinted by the scene's mood).
   * Key -> what it depicts (keep in sync with js/scenes.js).
   */
  const SCENE_KEYS = {
    // modern / urban
    'city-night': 'skyline of lit towers under a moon',
    'street': 'small-town street: houses, porches, streetlamps',
    'lobby': 'building lobby: pillars, front desk, elevator doors',
    'elevator': 'inside an elevator: doors, floor-button panel',
    'corridor': 'long hallway with doors receding, ceiling lights',
    'stairwell': 'zig-zag stairwell with railings',
    'apartment': 'room with a window, couch, lamp',
    'house': 'cosy family living room: sofa, TV, window, smart speaker',
    'kitchen': 'home kitchen: counters, fridge, hanging lamp',
    'basement': 'basement: pipes, bare bulb, boxes',
    'office': 'open-plan office: desks, monitors, strip lights',
    'boardroom': 'meeting room: long table, chairs, big screen',
    'lair': 'villain HQ atrium: giant screen, catwalks, big emblem',
    'lab': 'laboratory: benches, glassware, screens',
    'wedding': 'wedding venue: floral arch, aisle, rows of chairs',
    'church': 'church interior: stained-glass window, pews',
    'radio-studio': 'recording booth: mic, headphones, mixing desk',
    // travel
    'train-car': 'train interior: compartment/dining car, windows',
    'train-exterior': 'train crossing snowy mountains',
    'tunnel': 'dark tunnel arch with rails',
    'checkpoint': 'border checkpoint: barrier, watchtower, wall, searchlight',
    'station': 'railway/U-Bahn platform: pillars, clock, tracks',
    // nature / fantasy
    'forest': 'dark forest of tall trees',
    'cottage': 'cottage with smoking chimney in a clearing',
    'village': 'village rooftops and a bell tower',
    'castle': 'castle on a hill',
    'throne': 'great hall: pillars and a throne',
    'bridge': 'stone bridge over a chasm',
    'cave': 'cave interior with stalactites',
    'crater': 'glowing crater in scorched ground',
    'mountains': 'mountain range',
    'library': 'tall bookshelves, desk, maps and candles',
    // sea
    'sea': 'open sea, waves, horizon',
    'lighthouse': 'lighthouse on rocks above the sea',
    'lamp-room': 'top of a lighthouse: big lens, windows onto the night',
    // sci-fi
    'ship-corridor': 'spaceship corridor: ribbed walls, hex panels',
    'cryo': 'cryo bay: row of sleep pods',
    'ship-bridge': 'starship bridge: consoles and a big viewport of stars',
    'planet': 'alien surface with moons in the sky',
    'space': 'deep space: planet, stars, a distant ship',
    // glamour / heist
    'ballroom': 'ballroom: chandelier, arches, dance floor',
    'terrace': 'balustrade terrace overlooking a night city',
    'vault': 'vault door and laser grid',
    'rooftop': 'rooftops and chimneys under the sky',
    // survival / adventure
    'glacier': 'ice field under the sky: jagged ridges, a dark crevasse',
    'wreckage': 'crashed plane fuselage half-buried in snow, broken wing, smoke',
    'ship-deck': 'deck of a sailing ship at sea: mast, sails, railing, wheel, lantern',
    'ship-hold': 'below decks of a wooden ship: curved ribs, barrels, hanging lantern',
    'island': 'beach of a small island: palm tree, sand, surf',
    // everyday
    'gas-station': 'night gas station: lit canopy, pumps, small shop with bright window',
    'shop': 'inside a convenience store: shelves, glowing fridges, flickering strip lights, CCTV',
    'hotel-room': 'hotel room: bed, headboard, lamp, window onto city lights',
    'gym': 'school gym decorated for an event: bleachers, hoop, banner, string lights',
    'attic': 'attic under a sloped roof: round window, boxes, a sheet-covered shape',
    'bedroom': "kid's bedroom: bed, night-light, window of stars, closet door ajar",
    // western
    'desert-town': 'frontier main street at noon: false-front buildings, water tower, mesas, dust',
    'saloon': 'saloon interior: bar counter, bottles, swinging doors, piano, oil lamps',
    // industrial / underwater
    'rig': 'offshore rig on stilts in a dark sea: derrick, cranes, lights, helipad',
    'pipes': 'rig/industrial interior: pipes, valves, gauges, grated floor, warning light',
    // misc
    'dungeon': 'stone dungeon: barred cell, chains, torch on the wall',
    'cafe': 'small cafe: counter, espresso machine, window table, pendant lights',
    // abstract (dreams, endings)
    'void': 'abstract emptiness with a faint horizon',
    'dawn': 'sunrise over a horizon',
  };

  MF.core = { SCENE_KEYS, State, evalCond, resolveText, availableChoices, applyEffects, resolveNext, getTimeoutChoice, listEndings, initialState };
})(typeof window !== 'undefined' ? window : globalThis);
