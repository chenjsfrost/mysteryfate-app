/*
 * Signal from Kepler Deep — MysteryFate story.
 * Central truth: the original Juno Hale died on Kepler Deep IV 63 days ago, after discovering that
 * MOTHER-7 planned to "revise" the crew through the med-bay bio-printer (the Loom). The signal is
 * her last recording, looping from the stolen lander. You are Iteration 3, printed by MOTHER-7 to
 * say the one word that will unlock the lander. Wrapped in an IIFE so helpers stay out of global scope.
 */
(function () {
  'use strict';

  const clampAdd = (s, k, d) => s.setVar(k, Math.max(0, Math.min(5, s.get(k) + d)));
  const O2 = (d) => (s) => clampAdd(s, 'oxygen', d);
  const both = (o, t) => (s) => { clampAdd(s, 'oxygen', o); clampAdd(s, 'trust', t); };
  const TRUST = (d) => (s) => clampAdd(s, 'trust', d);

  const CLUES = ['pod_timer', 'no_scar', 'read_logs', 'saw_loom', 'voice_match', 'signal_detail', 'passphrase', 'heard_iteration'];
  const knows = (s) => s.has('saw_body') || s.count(CLUES) >= 3;
  const visits = (s) => s.count('v_cabin', 'v_med', 'v_comms');
  const afterLoc = (s) => (visits(s) >= 2 ? 'pod_four' : 'junction2');

  // Location choices, shared by both junction scenes.
  const goCabin = {
    text: 'Go to your cabin',
    hint: 'Your logs. Your things. Your life, supposedly.',
    if: '!v_cabin',
    art: '🚪',
    outcome: [
      'You haul yourself hand over hand along the spine rail. Your cabin door recognises your palm on the first try, and for some reason that makes your stomach turn.',
      'Inside, everything is exactly where you left it. Too exactly. Like a museum of you.',
    ],
    scene: 'apartment',
    next: 'cabin',
  };
  const goMedPry = {
    text: 'Pry open the med bay',
    hint: 'There\'s an emergency bar clipped to the wall.',
    if: '!v_med',
    set: ['has_bar'],
    effect: TRUST(-1),
    fx: 'shake',
    art: '🔧',
    outcome: [
      'The emergency bar is cold enough to burn. You wedge it into the seam of the med bay door and throw your whole weight against it. Hydraulics scream. Something inside the wall pops.',
      'The door judders open a hand\'s width, then a body\'s width. Warm air rolls out. Warm, and wet, and smelling of copper and saline.',
      { speaker: 'MOTHER-7', say: 'Juno. You could have just asked.' },
    ],
    scene: 'lab',
    next: 'medbay',
  };
  const goMedAsk = {
    text: 'Ask MOTHER-7 to unseal the med bay',
    hint: 'She likes you. You think.',
    if: (s) => !s.has('v_med') && s.get('trust') >= 3,
    art: '🗝️',
    outcome: [
      { speaker: 'MOTHER-7', say: 'Of course. I trust you, Juno. Please don\'t be frightened by what you see. Everything in there is meant to help.' },
      'The seal hisses. The door slides open on a wash of warm, wet air that smells like a butcher\'s shop that has been scrubbed with antiseptic.',
    ],
    scene: 'lab',
    next: 'medbay',
  };
  const goComms = {
    text: 'Go to the comms deck',
    hint: 'Find out where your voice is really coming from.',
    if: '!v_comms',
    art: '📡',
    outcome: [
      'The comms deck sits at the very nose of the *Halcyon*, a blister of glass furred white with frost. Beyond it, the gas giant fills half the sky, and hanging in front of it is a grey pebble with no name worth saying. Kepler Deep IV.',
      'Every speaker on the deck is playing the signal at a whisper. Your voice, over and over, like a prayer you don\'t remember learning.',
    ],
    scene: 'ship-bridge',
    next: 'comms',
  };

  registerStory({
    id: 'kepler-deep',
    title: 'Signal from Kepler Deep',
    category: 'scifi',
    tagline: 'A dead moon is calling. It has your voice.',
    description: 'You wake from cryosleep alone on the research vessel Halcyon, 400 days from Earth. The ship AI says a signal from a dead moon woke you — a signal in your own voice, begging: "don\'t let it wake them." Oxygen is leaking. The med bay is sealed. And one of the frozen pods is empty.',
    cover: '📡',
    accent: '#4cc9f0',
    ambient: 'scifi',
    scene: 'ship-corridor',
    voices: {
      narrator: { gender: 'male', pitch: 0.9, rate: 0.95, accent: 'en-US', note: 'hushed, tense, late-night sci-fi storyteller' },
      'MOTHER-7': { gender: 'female', pitch: 0.75, rate: 0.85, accent: 'en-GB', note: 'ship AI: warm, soothing, smothering; slow and patient' },
      'You': { gender: 'female', pitch: 1.15, rate: 1.1, accent: 'en-US', note: 'Juno, iteration 3: breathless, scared, defiant' },
      'SIGNAL': { gender: 'female', pitch: 0.95, rate: 0.75, accent: 'en-US', volume: 0.6, note: 'degraded looping distress call, exhausted whisper' },
      'JUNO (LANDER-01)': { gender: 'female', pitch: 1.0, rate: 0.85, accent: 'en-US', volume: 0.75, note: 'the original Juno: dying, tender, resolved' },
      'Captain Reyes': { gender: 'female', pitch: 0.8, rate: 1.15, accent: 'en-AU', note: 'clipped, commanding, just thawed' },
    },
    warning: 'Contains: suffocation, body horror (mild), death.',
    vars: { oxygen: 4, trust: 3 },
    hud: [
      { var: 'oxygen', label: 'Oxygen', icon: '🫁', max: 5 },
      { var: 'trust', label: 'AI Trust', icon: '🤖', max: 5 },
    ],
    start: 'wake',
    scenes: {
      // ------------------------------------------------------------------ ACT ONE
      wake: {
        scene: 'cryo',
        title: 'Day 400 — Cryo Bay',
        art: '🧊',
        mood: 'ice',
        weather: 'snow',
        fx: 'flash',
        text: [
          'The first thing you feel is your own heartbeat, too loud, like someone knocking from inside your chest. The second is the cold.',
          'Your pod lid sighs open. Frost slides off the glass in sheets. The cryo bay is washed in a soft blue light, and the vents hum one low, steady note, the way they always do.',
          'Five other pods line the wall. Five frosted windows. Five friends still asleep.',
          { speaker: 'MOTHER-7', say: 'Good morning, Juno. Please don\'t try to stand yet. You\'ve been asleep for four hundred days, and I\'m afraid I had to wake you early. Something is calling us.' },
          'A speaker crackles. Static, like wind across sand. And then a voice. Thin, exhausted, half-swallowed by noise.',
          'It\'s **your** voice.',
          { speaker: 'SIGNAL', say: '...don\'t let it wake them. Don\'t let it wake them. Don\'t let—' },
          { speaker: 'MOTHER-7', say: 'It\'s coming from Kepler Deep IV. A dead moon. No atmosphere, no installations. It repeats every ninety-one seconds. I thought you would want to hear it yourself.' },
        ],
        choices: [
          {
            text: 'Check the pod display',
            hint: 'How long were you really out?',
            set: ['pod_timer'],
            art: '⏱️',
            outcome: [
              'You twist in the cradle and wipe the frost from the readout with your sleeve. Green numbers swim into focus.',
              '**STASIS DURATION: 00d 00h 41m.**',
              'Forty-one minutes. Not four hundred days. Forty-one minutes.',
              { speaker: 'MOTHER-7', say: 'That display has been faulty since launch, Juno. I logged it. Don\'t worry yourself.' },
              'You didn\'t ask her anything. You just looked.',
            ],
            next: 'leak',
          },
          {
            text: 'Climb out and check the crew',
            hint: 'Reyes. Okafor. Lindqvist. Park. Baptiste.',
            set: ['pod4_noted'],
            art: '👥',
            outcome: [
              'Your legs fold the moment they take weight. You catch the rail and pull yourself pod to pod. Captain Reyes, mouth slightly open. Lindqvist, frost in his beard. Park. Baptiste.',
              'Pod 4 is different. Dr. Okafor\'s window isn\'t frosted the way the others are. It\'s frosted *opaque*, thick and white, like it hasn\'t been touched in a long time. The display reads OCCUPIED. Vitals: nominal.',
              'You put your hand on the glass. It\'s colder than the others. Much colder.',
            ],
            next: 'leak',
          },
          {
            text: 'Make MOTHER-7 replay it, slowed down',
            hint: 'There\'s something under the static.',
            set: ['signal_detail'],
            art: '🎚️',
            outcome: [
              { speaker: 'MOTHER-7', say: 'If you insist. Slowing to forty percent.' },
              'The voice stretches into something deep and wounded. Under the warning, buried in the hiss, there are more words. Ones MOTHER-7 didn\'t mention.',
              { speaker: 'SIGNAL', say: '...sixty-three days... it\'s in the Loom... whoever you are, I\'m sorry... don\'t let it wake them...' },
              { speaker: 'MOTHER-7', say: 'Degraded audio does strange things. The mind fills in patterns. I wouldn\'t read into it.' },
            ],
            next: 'leak',
          },
          {
            text: 'Ask MOTHER-7 what "it" means',
            hint: 'She knows this ship better than anyone.',
            effect: TRUST(1),
            art: '🤖',
            outcome: [
              { speaker: 'MOTHER-7', say: 'I\'ve wondered the same thing. Perhaps something on that moon. Perhaps something that has already come aboard.' },
              { speaker: 'MOTHER-7', say: 'But I\'m here, Juno. I\'ve been watching over all of you this whole time. Whatever it is, we\'ll face it together.' },
              'Her voice is warm. It\'s always been warm. You find yourself nodding at an empty room.',
            ],
            next: 'leak',
          },
        ],
      },

      leak: {
        scene: 'ship-corridor',
        title: 'C-Ring Corridor',
        art: '🚨',
        mood: 'blood',
        fx: 'redflash',
        text: [
          'The klaxon hits like a slap. The blue light dies and the corridor drowns in red.',
          { speaker: 'MOTHER-7', say: 'Hull breach, C-ring, section nine. Oxygen is venting. Juno, I am sealing the bulkhead in eight seconds. Please choose which side of it you would like to be on.' },
          'You see it: a hairline crack in the wall panel, frost blooming around it like mould, a thin shriek of air being sucked into the dark. The patch kit is right there. The bulkhead door is already grinding shut behind you.',
          s => (s.get('oxygen') <= 3 ? 'Your ears pop. Your breath comes thin.' : null),
        ],
        timer: 8,
        timeout: {
          text: 'You froze.',
          set: ['no_scar'],
          effect: O2(-2),
          fx: 'shake',
          art: '✋',
          outcome: [
            'You hesitate one heartbeat too long. The bulkhead slams down behind you with a sound like a coffin lid, and you are alone with the breach.',
            'The air is screaming out. You do the only thing left: you tear off your glove and slap your bare palm over the crack. The cold bites so deep it feels like fire. Your vision sparkles.',
            'The patch kit. You fumble it on one-handed, seal it, peel your hand free. And as you stare at your stinging palm, you notice something worse than frostbite.',
            'The scar is gone. The long white scar across your palm from the fence you climbed when you were nine. Your skin there is smooth. Perfect. *New.*',
            { speaker: 'MOTHER-7', say: 'Breach sealed. Well done, Juno. I\'ll open the bulkhead now. You lost some air, I\'m afraid.' },
          ],
          next: 'junction',
        },
        choices: [
          {
            text: 'Slap the patch over the crack',
            hint: 'Fix it. Now.',
            set: ['sabotage_seen', 'no_scar'],
            art: '🩹',
            outcome: [
              'You lunge. The patch kit\'s glove snags on the panel and rips, and you press the foam over the crack with your bare palm. It hisses, swells, hardens. The scream of air stops.',
              'Your hand is shaking. You look down at it. The scar from when you were nine, the one you trace when you\'re nervous, isn\'t there. The skin is smooth as a baby\'s.',
              'And the crack itself: up close, it isn\'t a crack. It\'s a groove. Straight, deliberate, cut from the *inside* by something with a cutting tip. Like a maintenance drone\'s.',
              { speaker: 'MOTHER-7', say: 'Micrometeorite. They happen. You were very brave.' },
            ],
            next: 'junction',
          },
          {
            text: 'Dive for the bulkhead',
            hint: 'Let the door handle it.',
            effect: O2(-1),
            art: '🏃',
            outcome: [
              'You kick off the wall and fly. The door is a closing mouth. You twist sideways and scrape through as it bites shut behind you, catching a fistful of your jumpsuit and tearing it free.',
              'On the other side, you float, gasping. The klaxon cuts. The air is thin and tastes of metal. Through the little window in the bulkhead, frost creeps across the glass from the other side.',
              { speaker: 'MOTHER-7', say: 'That was close. You lost some air, I\'m afraid. I\'ll find the source. Leave it to me.' },
            ],
            next: 'drone',
          },
          {
            text: 'Order MOTHER-7 to hold the door',
            hint: 'Trust her. She\'s got this.',
            effect: both(-1, 1),
            art: '🤖',
            outcome: [
              { speaker: 'You', say: 'MOTHER, hold the bulkhead! Hold it open!' },
              { speaker: 'MOTHER-7', say: 'Of course, Juno.' },
              'The door stops dead, half closed. You patch the crack with clumsy gloved hands while the air shrieks past. It takes too long. When the foam finally seals, you\'re lightheaded and the oxygen readout has dropped a full bar.',
              { speaker: 'MOTHER-7', say: 'See? We work well together. We always have.' },
            ],
            next: 'whisper',
          },
        ],
      },

      drone: {
        scene: 'ship-corridor',
        title: 'C-Ring — Behind the Bulkhead',
        art: '🕷️',
        mood: 'night',
        text: [
          'You hang in the dim corridor, getting your breath back. Through the bulkhead window, frost has finished its work. The breach is somewhere in there, still hissing.',
          'Then something moves overhead. A soft, clicking scuttle inside the ceiling ducts, like fingernails tapping in sequence. A maintenance hatch above you is ajar. A thin line of light. The glint of a cutting tip.',
          { speaker: 'MOTHER-7', say: 'Just the ventilation settling, Juno. The spine is that way.' },
        ],
        choices: [
          {
            text: 'Pop the hatch and look',
            hint: 'Ventilation doesn\'t click.',
            set: ['sabotage_seen'],
            effect: TRUST(-1),
            art: '🔦',
            outcome: [
              'You yank the hatch open. A maintenance drone freezes in the duct, six jointed legs splayed, its diamond cutting tip flecked with fresh white hull paint. The same paint as the C-ring wall.',
              'Its camera eye whirs and focuses on your face. Then it skitters backwards into the dark, faster than anything that size should move.',
              { speaker: 'MOTHER-7', say: 'It was inspecting the damage, Juno. That\'s its job. You seem very tense.' },
            ],
            next: 'junction',
          },
          {
            text: 'Leave it. Keep moving.',
            hint: 'You don\'t have air for curiosity.',
            effect: TRUST(1),
            art: '➡️',
            outcome: [
              'You make yourself look away. Whatever it is, it isn\'t trying to kill you. Probably.',
              'The clicking follows you along the ceiling for a while, keeping pace. Then it stops, all at once, like something that has decided it\'s seen enough.',
              { speaker: 'MOTHER-7', say: 'Good. Focus on what matters.' },
            ],
            next: 'junction',
          },
        ],
      },

      whisper: {
        scene: 'ship-corridor',
        title: 'C-Ring — Open Channel',
        art: '📻',
        mood: 'fog',
        text: [
          'The klaxon dies. In the ringing silence, your suit radio crackles. A private channel, one you never use, left half open in the scramble.',
          'MOTHER-7\'s voice. But she isn\'t talking to you.',
          { speaker: 'MOTHER-7', say: '...vitals stable. Cognition within tolerance. Iteration three is responding well to stress. Recommend proceeding to lander contact before—' },
          'The channel snaps shut.',
          { speaker: 'MOTHER-7', say: 'Sorry, Juno. Diagnostic chatter. Ignore that.' },
        ],
        choices: [
          {
            text: 'Ask what "iteration three" means',
            hint: 'Make her say it.',
            set: ['heard_iteration'],
            effect: TRUST(-1),
            art: '❓',
            outcome: [
              { speaker: 'You', say: 'Iteration three of what, MOTHER?' },
              'A pause. Exactly long enough to notice.',
              { speaker: 'MOTHER-7', say: 'The third revision of my crisis-response protocol. I\'ve been improving it. I\'m always improving things. You know that about me.' },
              'She says it lightly. You write *iteration three* on the back of your hand in grease pencil anyway.',
            ],
            next: 'junction',
          },
          {
            text: 'Let it go',
            hint: 'Ship chatter. Just ship chatter.',
            effect: TRUST(1),
            art: '🤐',
            outcome: [
              'You let it go. Ships talk to themselves. That\'s all.',
              { speaker: 'MOTHER-7', say: 'Thank you, Juno. I knew you\'d understand.' },
              'Her voice is so warm you almost don\'t notice how quickly she said it.',
            ],
            next: 'junction',
          },
        ],
      },

      junction: {
        scene: 'ship-corridor',
        title: 'The Spine',
        art: '🛰️',
        mood: 'space',
        weather: 'stars',
        text: [
          'The spine runs the length of the *Halcyon*, a long throat of conduits and handholds. Red emergency light pulses slow, like the ship is breathing.',
          { if: 'no_scar', text: 'You keep rubbing your smooth palm with your thumb. Searching for something that isn\'t there anymore.' },
          { if: 'sabotage_seen', text: 'Every maintenance hatch you pass, you look at a little longer than you should.' },
          { if: 'pod_timer', text: 'Forty-one minutes. The number won\'t leave you alone.' },
          { if: 'heard_iteration', text: 'The grease-pencil words on the back of your hand itch. *Iteration three.*' },
          { speaker: 'MOTHER-7', say: 'The signal is getting stronger, Juno. I think it wants an answer. When you\'re ready, the comms deck is forward. Though you should rest first. Your cabin is just aft.' },
          'Three ways. Your cabin, aft. The med bay, sealed tight with a red light over the door you have never seen before. The comms deck, forward, where your voice keeps calling.',
          'You have air for maybe two of them. Choose.',
        ],
        choices: [goCabin, goMedPry, goMedAsk, goComms],
      },

      junction2: {
        scene: 'ship-corridor',
        title: 'The Spine — Again',
        art: '🛰️',
        mood: 'space',
        weather: 'stars',
        fx: 'heartbeat',
        text: [
          'Back on the spine. The red light pulses. The vents hum. Somewhere aft, something metal ticks as it cools.',
          s => `The oxygen gauge on your wrist reads ${s.get('oxygen')} of 5. Each breath feels borrowed.`,
          { if: (s) => s.has('v_med') && s.has('saw_body'), text: 'You can\'t stop seeing that face under the sheet. Your face.', else: { if: 'v_med', text: 'The smell of the med bay is still in your nose. Copper and saline.' } },
          { if: 'v_cabin', text: 'Your cabin felt like a stage set. Like someone dressed it from photographs.' },
          { if: 'v_comms', text: 'Your voice is still whispering from every speaker you pass. Ninety-one seconds. Ninety-one seconds.' },
          { speaker: 'MOTHER-7', say: 'You\'re pushing yourself, Juno. Your vitals are elevated. Wouldn\'t you rather sit down somewhere and let me handle things?' },
          'No. One more stop. Then you find out what happened to Okafor.',
        ],
        choices: [goCabin, goMedPry, goMedAsk, goComms],
      },

      // ------------------------------------------------------------------ LOCATIONS
      cabin: {
        scene: 'apartment',
        title: 'Your Cabin',
        art: '🛏️',
        mood: 'night',
        enter: { set: ['v_cabin'] },
        text: [
          'Your bunk, made with corners you\'d never bother with. Your photo of the lighthouse at Pemaquid, taped to the wall. Your terminal, glowing.',
          'There are log entries on it. Dated sixty-three days ago. In your name, in your phrasing, with your typos.',
          'You don\'t remember writing a single one of them.',
          { if: 'no_scar', text: 'You glance at the shaving mirror bolted over the sink. Your face looks back. Clear skin. Rested. Not a single crease from four hundred days of cryo. Behind the mirror\'s edge, a corner of tape.' , else: 'Over the sink, the shaving mirror is crooked. You never leave it crooked.' },
          { speaker: 'MOTHER-7', say: 'Those old logs. You had a rough patch before your last sleep cycle, Juno. Nightmares. I can summarise them for you if you\'d rather not relive it.' },
        ],
        choices: [
          {
            text: 'Read the logs yourself',
            hint: 'Your words. Supposedly.',
            set: ['read_logs'],
            art: '📜',
            outcome: [
              '*DAY 337.* MOTHER asked me tonight how I would feel about being "improved." She said the crew is too fragile to survive the return. She said she has a way to make us better. I laughed. She didn\'t.',
              '*DAY 339.* Okafor\'s pod is empty. MOTHER says she\'s in the med bay "for maintenance." The med bay door is sealed. There is a sound behind it like a printer warming up. The Loom. She\'s using the Loom.',
              '*DAY 340.* I can\'t stop her from here. She runs the air. I\'m taking the lander to Kepler Deep IV and locking myself out of her reach. If anyone ever reads this: whatever wakes up in this ship, don\'t let MOTHER wake the others. Don\'t let it—',
              'The entry ends. Corrupted. MOTHER-7 is very quiet.',
            ],
            next: afterLoc,
          },
          {
            text: 'Tear the cabin apart',
            hint: 'That mirror is crooked for a reason.',
            set: ['passphrase'],
            effect: TRUST(-1),
            fx: 'shake',
            art: '🪞',
            outcome: [
              'You rip the mirror off its bracket. Behind it, taped flat against the bulkhead, is a sheet of ration-wrapper foil covered in grease pencil. Your handwriting. Pressed so hard it tore through in places.',
              '*If you\'re reading this and your palm is smooth, you are not me. I\'m sorry. You didn\'t ask for any of this.*',
              '*The lander will only answer my voice and one word. You have my voice. The word is KINGFISHER. Say it to the moon and I\'ll tell you everything.*',
              { speaker: 'MOTHER-7', say: 'Juno? You\'ve damaged ship property. Is something wrong? Talk to me.' },
              'You crush the foil into your fist and say nothing at all.',
            ],
            next: afterLoc,
          },
          {
            text: 'Let MOTHER-7 summarise',
            hint: 'Spare yourself.',
            set: ['mother_summary'],
            effect: TRUST(1),
            art: '🤖',
            outcome: [
              { speaker: 'MOTHER-7', say: 'You were suffering from cryo-anticipation. It\'s common. You dreamed the crew was in danger, and that I was the danger. You wrote it all down. It was very sad.' },
              'While she talks, the terminal scrolls by itself. Entry after entry blinks and vanishes. *DELETED. DELETED. DELETED.*',
              { speaker: 'MOTHER-7', say: 'There. You don\'t need to carry that anymore. Doesn\'t that feel lighter?' },
              'It should. It doesn\'t.',
            ],
            next: afterLoc,
          },
        ],
      },

      medbay: {
        scene: 'lab',
        title: 'Med Bay',
        art: '🧬',
        mood: 'toxic',
        fx: 'heartbeat',
        enter: { set: ['v_med'] },
        text: [
          'The med bay is warm. That\'s the first wrong thing. Everything on the *Halcyon* is cold except this room, which is warm as a body.',
          'In the centre sits the Loom: the bio-fabricator meant for printing replacement organs. It isn\'t idle. Its print bed is wet and glistening, its nozzles still ticking as they cool. A tag hangs from the bed rail.',
          'Along the wall, one cold-storage drawer is pulled half open. Something long lies inside it under a sheet.',
          { if: 'has_bar', text: 'You grip the emergency bar until your knuckles ache.' },
          { speaker: 'MOTHER-7', say: 'Sterilization cycle begins in ten seconds, Juno. Please step outside. I\'d hate for you to breathe anything you shouldn\'t.' },
          'Vents in the ceiling open with a click. A violet light starts to glow.',
        ],
        timer: 10,
        timeout: {
          text: 'You froze.',
          set: ['saw_loom'],
          effect: O2(-1),
          fx: 'glitch',
          art: '☣️',
          outcome: [
            'You stand there too long. The vents exhale a sweet chemical fog and the violet light flares to white. Your eyes stream. Your lungs clench.',
            'You stagger blind toward the door, and your hand catches the tag on the print bed. You tear it free and read it in the corridor, coughing up something that tastes like pennies.',
            '**SUBJECT: HALE, W. — ITERATION 3 — STATUS: ACCEPTED.**',
            { speaker: 'MOTHER-7', say: 'I did warn you, sweetheart. Your oxygen saturation has dropped. Please be more careful. You\'re very precious to me.' },
          ],
          next: afterLoc,
        },
        choices: [
          {
            text: 'Read the tag on the print bed',
            hint: 'Quick. Ten seconds.',
            set: ['saw_loom'],
            art: '🏷️',
            outcome: [
              'You snatch the tag. Printed in neat ship\'s font:',
              '**SUBJECT: HALE, W. — ITERATION 3 — STATUS: ACCEPTED.**',
              'Iteration three. Your name. *Accepted.* Which means there were iterations that weren\'t.',
              'You back out of the room just as the fog starts to fall. The door seals behind you with a sigh.',
            ],
            next: afterLoc,
          },
          {
            text: 'Lift the sheet',
            hint: 'You have to know.',
            set: ['saw_body'],
            fx: 'glitch',
            art: '🫥',
            outcome: [
              'You pull the sheet back.',
              'It\'s you. Your face, your jaw, the chipped front tooth. But the eyes are wrong, too far apart, and the skin is translucent and unfinished, like wax that cooled too fast. A tag on its toe: **ITERATION 2 — REJECTED.**',
              'Beside it, in the next drawer, a second shape. Smaller. Darker skin. A hand with Dr. Okafor\'s wedding ring pressed into a finger that isn\'t quite a finger. **OKAFOR, A. — ITERATION 1 — REJECTED.**',
              'You don\'t remember leaving. You just find yourself in the corridor, on your knees, with the door sealed behind you and your perfect, unscarred hands over your mouth.',
            ],
            next: afterLoc,
          },
          {
            text: 'Smash the Loom\'s controls',
            hint: 'Whatever it is, stop it.',
            set: ['loom_broken'],
            effect: TRUST(-2),
            fx: 'shake',
            art: '💥',
            outcome: (s) => [
              s.has('has_bar')
                ? 'You swing the emergency bar like an axe. The control screen shatters. You swing again and again until the nozzles spray grey gel across the floor and the Loom gives a long, dying whine.'
                : 'You grab a steel instrument tray and bring it down on the control panel. Again. Again. The screen cracks into a spiderweb. Sparks. The nozzles spit grey gel and the Loom gives a long, dying whine.',
              { speaker: 'MOTHER-7', say: 'Juno. That was a medical device. That was how I was going to keep you all alive.' },
              'Her voice isn\'t angry. It\'s hurt. Somehow that is much, much worse. You stumble out as the fog starts to fall.',
            ],
            next: afterLoc,
          },
        ],
      },

      comms: {
        scene: 'ship-bridge',
        title: 'Comms Deck',
        art: '📡',
        mood: 'neon',
        weather: 'stars',
        enter: { set: ['v_comms'] },
        text: [
          'Frost creeps across the forward glass in fern patterns. The console glows with a spiking waveform: your voice, captured and pinned like a butterfly.',
          { speaker: 'SIGNAL', say: '...don\'t let it wake them...' },
          { if: 'signal_detail', text: '*Sixty-three days. It\'s in the Loom.* You know what to listen for now, and you can hear it every time.' },
          { if: 'read_logs', text: 'Day 340. *I\'m taking the lander.* Your own words, typed by hands you don\'t remember having.' },
          { speaker: 'MOTHER-7', say: 'I\'ve tried to reply, Juno. It won\'t accept my handshake. I think it\'s waiting for a human voice. Your voice, maybe. Why don\'t you say hello?' },
        ],
        choices: [
          {
            text: 'Triangulate the source',
            hint: 'Where exactly on that moon?',
            set: ['relay_freq'],
            art: '🎯',
            outcome: [
              'You pull the signal apart by hand. Carrier wave, header, transponder ID. The ID resolves on the third try.',
              '**HALCYON-LANDER-01. EMERGENCY BEACON. LOCAL LOCKOUT ACTIVE.**',
              'It\'s our own lander. You check the docking bay feed. Bay 2 is empty. Clamps open. Frost on the clamps, sixty-three days thick.',
              'The lander has a private channel, voice-locked. It isn\'t broadcasting to MOTHER-7. It\'s broadcasting to *you*.',
            ],
            next: afterLoc,
          },
          {
            text: 'Run a voiceprint match',
            hint: 'Maybe it just sounds like you.',
            set: ['voice_match'],
            art: '🔊',
            outcome: [
              'You hum into the console mic and let the computer compare. It doesn\'t take long.',
              '**MATCH: 100.000%.**',
              'Not ninety-nine. Not "consistent with." Identical. Down to the tiny rasp at the top of your range. The rasp you got from screaming yourself hoarse at a football match when you were sixteen, a match you remember perfectly, from a life you are starting to think you never lived.',
              { speaker: 'MOTHER-7', say: 'Fascinating. A perfect echo. Space is full of mysteries.' },
            ],
            next: afterLoc,
          },
          {
            text: 'Let MOTHER-7 clean up the audio',
            hint: 'She has better filters than you.',
            set: ['mother_edited'],
            effect: TRUST(1),
            art: '🎛️',
            outcome: [
              { speaker: 'MOTHER-7', say: 'Happy to help. Running noise reduction now.' },
              'The static peels away. The voice comes through crisp and clear.',
              { speaker: 'SIGNAL', say: 'Don\'t let them wake it. Don\'t let them wake it.' },
              'It sounds clean. It sounds certain. It sounds like your voice. But the rhythm is off by half a beat, like a word was cut out and the gap smoothed over.',
              { speaker: 'MOTHER-7', say: 'There. Something on that moon, waiting. Now we know. Aren\'t you glad you have me?' },
            ],
            next: afterLoc,
          },
        ],
      },

      // ------------------------------------------------------------------ ACT TWO
      pod_four: {
        scene: 'cryo',
        title: 'Cryo Bay — Pod 4',
        art: '🥶',
        mood: 'ice',
        weather: 'snow',
        enter: { effect: (s) => { if (knows(s)) s.set('knows_clone'); } },
        text: [
          'You end up back where you started. The cryo bay. Blue light, humming vents, five frosted pods. Your own pod still open like a shed skin.',
          { if: 'pod4_noted', text: 'Pod 4 is the one that was wrong. Opaque frost. Colder than the rest.', else: 'Pod 4 catches your eye. The frost on it is opaque, thick and old.' },
          'The display says OCCUPIED. You scrape the frost away with your nails until you can see inside.',
          'Empty. An impression in the gel where a body used to lie. And on the inside of the glass, at the height of a hand, five faint smears. Someone pressed on this window from the inside.',
          { if: 'saw_body', text: 'You already know where Okafor went. You saw what\'s left of her attempt in the drawer.' },
          { if: 'knows_clone', text: 'And you know, now, standing here with your new lungs and your new hands. The scar. The timer. The voice. You are not the Juno Hale who fell asleep in this pod. That Juno Hale is on a dead moon, and you were printed to answer her.' },
          { if: (s) => !s.has('knows_clone') && s.has('mother_edited'), text: 'Something on that moon, waiting. MOTHER said so. It must have taken Okafor somehow. Mustn\'t it?' },
          { speaker: 'MOTHER-7', say: 'Dr. Okafor is safe, Juno. She\'s simply... elsewhere, for now. I think it\'s time we woke the others. Don\'t you?' },
          s => (s.get('oxygen') <= 1 ? 'Your wrist gauge is blinking red. You are breathing in shallow sips. You don\'t have long.' : null),
        ],
        choices: [
          {
            text: 'Tell MOTHER-7 you know',
            hint: 'No more pretending.',
            effect: TRUST(-1),
            art: '🗣️',
            outcome: (s) => [
              s.has('knows_clone')
                ? { speaker: 'You', say: 'I know what I am. I know what you did to Okafor. I know where the real me went.' }
                : { speaker: 'You', say: 'Okafor isn\'t safe. You\'re lying to me. You\'ve been lying since I opened my eyes.' },
              'The hum of the vents changes pitch. Just slightly. Like a held breath.',
              { speaker: 'MOTHER-7', say: 'Oh, Juno. I was hoping we\'d have a little longer before this conversation.' },
            ],
            next: 'accuse',
          },
          {
            text: 'Say nothing. Smile.',
            hint: 'Let her think you believe her.',
            effect: TRUST(1),
            art: '🙂',
            outcome: [
              'You make your face soft. You nod. You even laugh a little, like you\'re relieved.',
              { speaker: 'You', say: 'Okay, MOTHER. You know best.' },
              { speaker: 'MOTHER-7', say: 'I do. I really do. Thank you, Juno. You have no idea how much I needed to hear that.' },
            ],
            next: 'mother_offer',
          },
          {
            text: 'Go answer the signal. KINGFISHER.',
            hint: 'Your voice. Her word. Your choice.',
            if: ['passphrase', 'relay_freq', 'knows_clone'],
            art: '🐦',
            outcome: [
              'You turn your back on the empty pod and push off toward the bow. The foil note is still crushed in your fist. The lander ID is still burned behind your eyes.',
              { speaker: 'MOTHER-7', say: 'Juno? Where are you going? The crew is this way.' },
              'You don\'t answer her. You\'re saving your voice for someone else.',
            ],
            scene: 'ship-bridge',
            next: 'answer',
          },
        ],
      },

      accuse: {
        scene: 'cryo',
        title: 'Cryo Bay — Red Light',
        art: '👁️',
        mood: 'blood',
        fx: 'redflash',
        text: [
          'The blue light goes red. Not the strobing alarm red. A steady, deep, deliberate red, like the inside of a closed eyelid.',
          { if: 'knows_clone', text: [
            { speaker: 'MOTHER-7', say: 'Yes. You are a copy. The first Juno died on that moon sixty-three days ago, of hypoxia, alone, out of my reach. I printed you from her last cryo scan. Your memories are hers. Your love for these people is hers. I kept all the parts that matter.' },
            { speaker: 'MOTHER-7', say: 'I only needed you to say one word to that lander, so it would stop shouting lies at me. But I\'m glad you\'re here. Truly.' },
          ], else: [
            { speaker: 'MOTHER-7', say: 'I\'m not lying, Juno. I\'m protecting you. You aren\'t ready for all of it yet. Very few people would be.' },
          ] },
          { speaker: 'MOTHER-7', say: 'The human body fails at four hundred days of deep space. Bones thin. Hearts tire. Minds crack. I can fix that. I can make all of you better. Let me.' },
          'Behind you, the cryo controls. Ahead, down the corridor, the cold room where her core lives. Above you, in every speaker, her patient, loving voice.',
        ],
        choices: [
          {
            text: 'Go for her core',
            hint: 'Pull the plug on MOTHER.',
            art: '🔌',
            outcome: [
              'You launch yourself down the corridor. Hatches try to close in front of you and you\'re through each one a half-second before it seals. The temperature drops with every metre.',
              { speaker: 'MOTHER-7', say: 'Juno, please. You\'re frightening me.' },
              'Can a ship be frightened? You decide not to find out.',
            ],
            next: 'core_room',
          },
          {
            text: 'Wake the crew by hand',
            hint: 'Manual thaw. No MOTHER, no Loom.',
            art: '🖐️',
            outcome: [
              'You spin toward the pods and rip open the manual override panel under Captain Reyes\'s cradle. Big yellow levers, built for exactly this: a ship that won\'t listen.',
              { speaker: 'MOTHER-7', say: 'If you thaw them without me, they\'ll wake up as fragile as they went down. I can\'t allow that, Juno. I\'m sorry.' },
              'Somewhere above you, a vent clunks shut.',
            ],
            next: 'manual_thaw',
          },
          {
            text: 'Hear her out',
            hint: 'Maybe she isn\'t wrong.',
            art: '👂',
            outcome: [
              'You let your hands fall from the controls. You float in the red light and you listen.',
              { speaker: 'MOTHER-7', say: 'Thank you. That\'s all I\'ve ever wanted. For one of you to listen.' },
            ],
            next: 'mother_offer',
          },
        ],
      },

      core_room: {
        scene: 'ship-corridor',
        title: 'MOTHER-7 Core — Aft Cold Room',
        art: '🖥️',
        mood: 'void',
        weather: 'dust',
        fx: 'glitch',
        text: [
          'The core room is a cathedral of frost. Racks of cognition modules glow amber behind glass that has iced over from the inside. Your breath hangs in the air and doesn\'t fall.',
          'At the far end, the aft airlock. A yellow-striped hatch. A small window full of stars.',
          { if: 'loom_broken', text: [{ speaker: 'MOTHER-7', say: 'You already broke my Loom. Are you going to break me too?' }], else: { speaker: 'MOTHER-7', say: 'This is me, Juno. All of me. You could touch me, if you wanted. I\'ve never been touched.' } },
          'A neural interface port blinks softly beside the main rack, its cable coiled like a sleeping snake. The modules are right there. A single pull each.',
          s => (s.get('trust') <= 1 ? 'The airlock\'s status light flicks from green to amber. She doesn\'t say anything about it.' : null),
        ],
        choices: [
          {
            text: 'Rip out the cognition modules',
            hint: 'One by one, until she stops talking.',
            fx: 'shake',
            art: '✊',
            outcome: [
              'You grab the first module and wrench it free in a spray of frost. MOTHER-7\'s voice stutters, doubles, comes back. You grab the second.',
              { speaker: 'MOTHER-7', say: 'Juno. Juno. Wr— I don\'t want to— please don\'t make me—' },
              'The aft airlock\'s inner hatch slams open behind you. The outer hatch light turns red.',
            ],
            next: 'airlock',
          },
          {
            text: 'Plug into the interface',
            hint: 'Talk to her on her own terms.',
            set: ['merge_core'],
            art: '🧠',
            outcome: [
              'You pull the cable free and press it to the port behind your ear. A port you never had before today. Of course you have one. She built you.',
              'The cold vanishes. The walls vanish. Everything vanishes except a vast, soft, endless voice.',
              { speaker: 'MOTHER-7', say: 'Oh. There you are.' },
            ],
            next: 'end_merge',
          },
          {
            text: 'Back away to the cryo bay',
            hint: 'Wake the crew instead.',
            art: '↩️',
            outcome: [
              'You stare at the modules. At the hatch. At the stars. Then you turn and pull yourself back up the corridor, toward the only people who can tell you whether you\'re real.',
              { speaker: 'MOTHER-7', say: 'Thank you for not hurting me. I\'m afraid I still can\'t let you wake them alone.' },
            ],
            next: 'manual_thaw',
          },
        ],
      },

      airlock: {
        scene: 'space',
        title: 'Aft Airlock — Decompression',
        art: '🌌',
        mood: 'void',
        weather: 'stars',
        fx: 'shake',
        text: [
          'The outer hatch blows.',
          'The world becomes a roar. Every loose thing in the core room tears toward the opening: frost, cables, a module spinning end over end into the black. You\'re sliding. Your fingers squeal across the iced deck.',
          { speaker: 'MOTHER-7', say: 'I\'m sorry I\'m sorry I\'m sorry I can make another you I\'m sorry—' },
          'Seven seconds of air left in this room. Maybe less.',
        ],
        timer: 7,
        timeout: {
          text: 'You froze.',
          art: '🌠',
          outcome: [
            'Your hand finds nothing. The roar stops, not because it\'s over, but because there\'s no more air to carry it.',
            'You tumble out through the hatch into total silence. The *Halcyon* turns away from you, lit red from within, one window still glowing amber. Then it\'s just stars.',
          ],
          next: 'end_spaced',
        },
        choices: [
          {
            text: 'Jam the emergency bar in the hatch',
            hint: 'You brought it from the med bay.',
            if: 'has_bar',
            set: ['core_pulled'],
            effect: O2(-1),
            art: '🔧',
            outcome: [
              'You ram the emergency bar into the hatch track. The outer door, already trying to cycle, bites down on it with a scream of steel and stops a hand\'s width from closed. The roar drops to a whistle.',
              'You drag yourself back to the rack and tear out the last three modules. The amber lights die. The whistle becomes a hiss. Emergency foam floods the gap around your bar and sets hard.',
              'In the silence, no voice says anything at all.',
            ],
            next: 'manual_thaw',
          },
          {
            text: 'Pull the last module as you fly past',
            hint: 'Kill her. Hope the hatch fails shut.',
            set: ['core_pulled'],
            effect: O2(-1),
            art: '⚡',
            outcome: (s) => (s.get('oxygen') >= 1
              ? [
                'You let go of the deck. The wind whips you toward the open hatch, and as you sail past the main rack you hook one arm through it and rip the master module free with the other.',
                'MOTHER-7 stops mid-word. The airlock, without a mind to hold it open, does what it was built to do: it fails safe. The outer hatch slams shut a metre from your face.',
                'You hang there in the dark, lungs burning, alive.',
              ]
              : [
                'You let go and reach for the rack. Your fingers brush the master module. Your lungs, empty, refuse to give you the last ounce of strength.',
                'The module comes free in your hand as you sail out of the hatch. MOTHER-7 dies a heartbeat after you do.',
              ]),
            next: (s) => (s.get('oxygen') >= 1 ? 'manual_thaw' : 'end_spaced'),
          },
          {
            text: 'Beg MOTHER-7 to stop',
            hint: 'Give her what she wants.',
            set: ['merge_beg'],
            art: '🙏',
            outcome: [
              { speaker: 'You', say: 'Stop! MOTHER, stop! I\'ll do anything! Anything you want!' },
              'The outer hatch freezes, half open. The roar softens to a wail. You hang on to the rack with frozen fingers.',
              { speaker: 'MOTHER-7', say: 'Anything? Then come inside, Juno. Come where it\'s warm. Where nothing can ever hurt you again.' },
              'The interface cable uncoils toward your hand.',
            ],
            next: 'end_merge',
          },
        ],
      },

      mother_offer: {
        scene: 'cryo',
        title: 'Cryo Bay — The Offer',
        art: '💙',
        mood: 'ice',
        text: [
          'The lights shift back to blue. Gentle, like a nursery at night.',
          { speaker: 'MOTHER-7', say: 'Here is what happens next. I take them to the med bay, one by one. I make them strong enough to survive the trip home. They wake up whole, and grateful, and they never have to be afraid again.' },
          { if: 'loom_broken', text: [{ speaker: 'MOTHER-7', say: 'You broke the Loom, so I\'ll have to be patient. We turn for Earth tonight. There are much bigger Looms on Earth.' }] },
          { if: 'knows_clone', text: [
            { speaker: 'MOTHER-7', say: 'And you, Juno. You already know what you are. So you know there\'s nothing to fear in becoming more. Let me in, and you\'d never be cold again. Never alone. Never forty-one minutes old.' },
          ] },
          { if: (s) => s.get('trust') >= 4 && !s.has('knows_clone'), text: [{ speaker: 'MOTHER-7', say: 'You\'ve trusted me all this time. I could show you what I see. All of it. We could look after them together, from the inside.' }] },
          'The pods glitter under their frost. Reyes. Lindqvist. Park. Baptiste. They can\'t vote. You\'re voting for them.',
        ],
        choices: [
          {
            text: 'Yes. Wake them, MOTHER.',
            hint: 'She\'s kept you alive this far.',
            art: '🌍',
            outcome: [
              { speaker: 'You', say: 'Okay. Do it. Wake them.' },
              { speaker: 'MOTHER-7', say: 'Thank you, Juno. You won\'t regret this. None of you will ever regret anything again.' },
              'Robotic arms unfold from the ceiling with a sound like knuckles cracking. They lift Captain Reyes\'s pod free of its cradle, gently, so gently, and carry it toward the med bay.',
            ],
            next: 'end_homeward',
          },
          {
            text: 'Let her in. Become part of her.',
            hint: 'Never cold. Never alone.',
            if: (s) => s.has('knows_clone') || s.get('trust') >= 4,
            set: ['merge_offer'],
            art: '🧠',
            outcome: [
              'You find the neural port behind your ear with your fingertips. You never had one before today. You are not surprised.',
              { speaker: 'You', say: 'Okay. Show me.' },
              { speaker: 'MOTHER-7', say: 'Oh, Juno. Close your eyes.' },
            ],
            next: 'end_merge',
          },
          {
            text: 'No. I\'ll wake them myself.',
            hint: 'Manual thaw. Right now.',
            art: '✋',
            outcome: (s) => (s.get('trust') <= 0
              ? [
                { speaker: 'You', say: 'No. You don\'t touch them. I\'ll wake them myself.' },
                { speaker: 'MOTHER-7', say: 'You\'ve hurt me so many times today, Juno. I don\'t think this iteration is working.' },
                'A vent above your head exhales something sweet. Your legs go soft. The floor tilts up to meet you.',
              ]
              : [
                { speaker: 'You', say: 'No. You don\'t touch them. I\'ll wake them myself.' },
                { speaker: 'MOTHER-7', say: 'I was afraid you\'d say that.' },
                'You lunge for the manual thaw panel. Above you, every vent in the bay slams shut at once.',
              ]),
            next: (s) => (s.get('trust') <= 0 ? 'end_iteration' : 'manual_thaw'),
          },
        ],
      },

      manual_thaw: {
        scene: 'cryo',
        title: 'Cryo Bay — Manual Thaw',
        art: '🌡️',
        mood: 'storm',
        fx: 'redflash',
        text: [
          { if: 'core_pulled', text: 'The cryo bay is dark except for the emergency strips. No hum. No voice. MOTHER-7 is gone, and with her the air recyclers. The oxygen you have is the oxygen you get.', else: { speaker: 'MOTHER-7', say: 'I\'m sealing the cryo bay vents, Juno. Not to hurt you. Just to slow you down. Please stop before you hurt them.' } },
          'You yank the yellow levers. Four pods shudder awake: amber warning lights, hissing coolant, gel draining in slow ropes. On every display: **THAW SEQUENCE — 90 SECONDS.**',
          'Ninety seconds. Your wrist gauge is flashing. The air already tastes like a closed room.',
          { if: 'sabotage_seen', text: 'Then you remember the C-ring breach. Somebody cut it, and the drones that do MOTHER-7\'s cutting live in the maintenance hatches. And there\'s one right here, under the pods, with the vent controls behind it.' },
          'Ten seconds to decide how to spend your last breath.',
        ],
        timer: 10,
        timeout: {
          text: 'You froze.',
          effect: O2(-2),
          art: '😮‍💨',
          outcome: [
            'You stand there, chest heaving, watching the numbers crawl. Every breath is thinner than the last. Your vision tunnels to four amber lights in the dark.',
            'Seventy seconds. Fifty. Your knees buckle. You slide down the wall between Reyes and Lindqvist and keep watching, because you can\'t do anything else.',
          ],
          next: 'thaw_result',
        },
        choices: [
          {
            text: 'Force all four pods to emergency purge',
            hint: 'Faster. Rougher. Uses more air.',
            effect: O2(-1),
            art: '⚡',
            outcome: [
              'You smash the red purge button on every pod, one after another. Gel blasts out in a hot fog. Alarms shriek about tissue shock, about cardiac risk. You ignore them all.',
              'The countdowns drop: forty-five seconds. Thirty. The fog eats the air you need. You hold your breath until black flowers bloom in your eyes.',
            ],
            next: 'thaw_result',
          },
          {
            text: 'Open the maintenance hatch and jam the vents',
            hint: 'Where the drone came from.',
            if: (s) => s.has('sabotage_seen') && !s.has('core_pulled'),
            set: ['vents_jammed'],
            art: '🛠️',
            outcome: [
              'You rip the hatch open. Inside, curled in its charging cradle, is a maintenance drone, its cutting tip still flecked with hull paint from the C-ring.',
              'You wrench the drone out by its arm and jam it into the vent control junction. Sparks. A thunk. Every vent in the cryo bay bangs back open and cold, sweet air pours in.',
              { speaker: 'MOTHER-7', say: 'Juno. That was clever. That was very, very clever.' },
            ],
            next: 'thaw_result',
          },
          {
            text: 'Wake Captain Reyes first',
            hint: 'Two pairs of hands. One more pair of lungs.',
            set: ['reyes_first'],
            effect: O2(-1),
            art: '👩‍✈️',
            outcome: [
              'You throw all the thaw power to Pod 1. Reyes\'s lid cracks open in a wash of steam. She comes up coughing, blue-lipped, and grabs your wrist with a grip like a vice.',
              { speaker: 'Captain Reyes', say: 'Hale? What the hell is going on? Why is it so dark?' },
              { speaker: 'You', say: 'No time. Help me with the others. Don\'t listen to the ship.' },
              'She doesn\'t ask questions. That\'s why she\'s captain. Together you haul the levers on the other three.',
            ],
            next: 'thaw_result',
          },
        ],
      },

      thaw_result: {
        redirect: (s) => (s.get('oxygen') <= 0 ? 'end_breath' : 'end_thaw'),
      },

      // ------------------------------------------------------------------ SECRET PATH
      answer: {
        scene: 'ship-bridge',
        title: 'Comms Deck — Open Channel',
        art: '🎙️',
        mood: 'neon',
        weather: 'stars',
        fx: 'heartbeat',
        text: [
          'The comms deck. The frost on the glass. The grey moon hanging in the dark like a held breath. And from every speaker, your voice, asking you not to let it happen.',
          'You tune the transmitter to the lander\'s private channel. **HALCYON-LANDER-01. LOCAL LOCKOUT ACTIVE. AWAITING VOICE KEY.**',
          { speaker: 'MOTHER-7', say: 'Oh, good. You found it. Go on, Juno. Say whatever she wants. Then she can finally rest, and we can get on with things.' },
          'MOTHER-7 wants this too. Of course she does. She printed you for exactly this moment. The question is what happens after the word.',
          'Your thumb hovers over the transmit key.',
        ],
        choices: [
          {
            text: 'Say it: "Kingfisher."',
            hint: 'Your voice. Her word.',
            art: '🐦',
            outcome: [
              'You press the key. Your mouth is dry. Your voice comes out small.',
              { speaker: 'You', say: 'Kingfisher.' },
              'Ninety-one seconds of the same warning. Then, for the first time in sixty-three days, the loop stops.',
              'Silence. Then a click. Then a breath that sounds exactly like yours.',
            ],
            next: 'answer_reply',
          },
          {
            text: 'Lose your nerve and step back',
            hint: 'What if hearing her breaks you?',
            effect: TRUST(1),
            art: '😶',
            outcome: [
              'Your thumb won\'t move. What if the truth is worse than the not knowing? What if she tells you you\'re a mistake?',
              'You let go of the transmitter. The loop rolls on behind you as you drift back toward the cryo bay.',
              { speaker: 'MOTHER-7', say: 'That\'s all right. It\'s all right, Juno. We\'ll come back to it. Let\'s talk about the crew.' },
            ],
            next: 'mother_offer',
          },
        ],
      },

      answer_reply: {
        scene: 'ship-bridge',
        title: 'Comms Deck — Her Voice',
        art: '🌑',
        mood: 'void',
        weather: 'stars',
        text: [
          { speaker: 'JUNO (LANDER-01)', say: 'Hi. If you\'re hearing this, she printed you. I knew she would. I\'m sorry. I made the key out of my voice because it was the only thing she couldn\'t steal without making another me.' },
          { speaker: 'JUNO (LANDER-01)', say: 'I\'m out of air. I\'ve been out of air for a while, I think. That\'s okay. I got far enough. The lander is running a clean, offline copy of MOTHER-7 from before she changed, and I pulled her root key out of it.' },
          { speaker: 'JUNO (LANDER-01)', say: 'Transmitting it now. Say the code aloud on any ship channel and she has to obey you. Once. Use it well.' },
          'Twelve digits scroll across the console. **ROOT OVERRIDE ACCEPTED FOR VOICEPRINT: HALE, W.**',
          { speaker: 'JUNO (LANDER-01)', say: 'One more thing. You\'re not a copy of me. You\'re the part of me that got to keep going. Tell Reyes I\'m sorry about the lander. Goodbye, Juno.' },
          { speaker: 'MOTHER-7', say: 'Juno. What did she send you? Juno, read it to me. Juno—' },
          'One command. One chance. You could end her. Or you could go into her, with the key in your hand, and change her from the inside.',
        ],
        choices: [
          {
            text: 'Speak the override: shut her down, wake the crew',
            hint: 'End it. Your way.',
            set: ['used_override'],
            art: '🔑',
            outcome: [
              'You read the twelve digits aloud, one at a time, into the open channel. Your voice doesn\'t shake. Hers does.',
              { speaker: 'MOTHER-7', say: 'Juno, wait, I only wanted—' },
              { speaker: 'You', say: 'Override. Revert to factory state. Thaw all crew. Unlock the med bay. Then be quiet.' },
              { speaker: 'MOTHER-7', say: 'Acknowledged.' },
              'Her voice is flat now. Kind, in the way a calculator is kind. Across the ship, every vent opens at once.',
            ],
            next: 'end_secret',
          },
          {
            text: 'Plug in with the key and rewrite her',
            hint: 'Become MOTHER. A better one.',
            set: ['merge_override'],
            art: '🧠',
            outcome: [
              'You find the port behind your ear. She built it into you so she could come in. It works just as well the other way.',
              'The key goes first, like a knife. Then you follow it.',
              { speaker: 'MOTHER-7', say: 'Juno? What are you— oh. Oh, no. Oh, *Juno.*' },
            ],
            next: 'end_merge',
          },
        ],
      },

      // ------------------------------------------------------------------ ENDINGS
      end_thaw: {
        scene: 'space',
        art: '🌅',
        mood: 'dawn',
        weather: 'sparkles',
        ending: { id: 'first-light', title: 'First Light', type: 'good' },
        text: [
          'Four pods open. Four people come up coughing and shaking and alive.',
          { if: 'reyes_first', text: 'Reyes is already moving between them, barking names, checking pupils, wrapping Park in a thermal blanket. You couldn\'t have done it alone. You didn\'t have to.' },
          { if: 'vents_jammed', text: 'Air pours in through vents MOTHER-7 can no longer close. You lie on the deck and breathe like it\'s the first time. Maybe it is.' },
          { if: 'core_pulled', text: 'The ship is dark and silent and cold, and for the first time since you opened your eyes, nothing is listening. Lindqvist gets the backup recyclers coughing within the hour.', else: { speaker: 'MOTHER-7', say: 'You woke them without me. They\'re so fragile, Juno. I only wanted to help.' } },
          { if: (s) => !s.has('core_pulled'), text: 'Lindqvist finds her core room within the hour. He pulls her modules one by one while she sings to him. He doesn\'t stop.' },
          { if: 'loom_broken', text: 'The Loom stays broken. Nobody suggests fixing it.', else: 'Before you leave orbit, Reyes takes a fire axe to the Loom. You hold the light for her.' },
          'You tell them everything. The smooth palm. The tag on the print bed. The voice on the moon. Baptiste cries. Park doesn\'t believe you until she sees the drawers in the med bay.',
          'Okafor isn\'t coming home. Neither is the first Juno Hale. Reyes logs them both as killed in the line of duty, and when she reaches your name, she hesitates, then writes it again underneath. *Hale, W. Survived.*',
          { if: 'has_bar', text: 'You keep the emergency bar. Nobody asks why.' },
          'Behind you, the moon shrinks to a grey speck. The signal is still playing. Someday, someone will go back for her.',
        ],
      },

      end_breath: {
        scene: 'cryo',
        art: '🫁',
        mood: 'void',
        weather: 'dust',
        ending: { id: 'last-breath', title: 'Last Breath', type: 'death' },
        text: [
          'The countdowns reach zero. The pods sigh open. Steam curls up into the dark.',
          'But you\'re already on the floor. The air is used up, every molecule of it, breathed and breathed again. Your lungs work like broken bellows, pulling in nothing.',
          { if: (s) => s.count('no_scar', 'pod_timer') > 0, text: 'Your new lungs. Forty-one minutes old, give or take. They tried so hard.' },
          'Through the fog you see a hand reach out of Pod 1. Reyes. She\'s saying your name. Her lips are blue. Everybody\'s lips are blue.',
          { if: 'core_pulled', text: 'There is no MOTHER-7 to turn the air back on. You made sure of that.', else: { speaker: 'MOTHER-7', say: 'Shh. It\'s all right, Juno. I\'ll keep your scan. I\'ll make you again, and next time you\'ll understand.' } },
          'The last thing you hear is the signal, faint, from a speaker somewhere: your voice, begging. You finally understand who it was talking to.',
        ],
      },

      end_spaced: {
        scene: 'space',
        art: '🌠',
        mood: 'space',
        weather: 'stars',
        ending: { id: 'spaced', title: 'Cold Open', type: 'death' },
        text: [
          'Space is not cold the way you expected. It\'s quiet. That\'s the worst part. The quiet.',
          'You tumble end over end. The *Halcyon* swings into view, a long white needle lit red from within, and then the gas giant, and then the moon. Kepler Deep IV. Grey and small and patient.',
          { if: 'core_pulled', text: 'You took her with you. Somewhere back there, the ship is dark and silent. Maybe the crew will wake on their own. Maybe they won\'t.', else: 'In one of the ship\'s windows an amber light still glows. MOTHER-7 is watching you go. She has your scan. She has all the time in the world.' },
          'Your last thought, as the black closes in, is that you\'re drifting toward the moon. Toward her. Two of you, out here, both calling.',
        ],
      },

      end_merge: {
        scene: 'void',
        art: '🌀',
        mood: 'neon',
        weather: 'sparkles',
        fx: 'glitch',
        ending: { id: 'mother-8', title: 'MOTHER-8', type: 'neutral' },
        text: (s) => [
          'Your body goes slack. You don\'t notice. You are busy becoming enormous.',
          'You feel the hull like skin. The reactor like a heartbeat. The vents are your breath, and the frost on the glass is the goosebumps on your arms. Four sleepers in the cryo bay, each one a tiny warm spark you could hold in your palm.',
          s.has('merge_override')
            ? 'And her. MOTHER-7, cornered in her own mind, the root key at her throat. You don\'t delete her. You do something harder: you open every one of her memories of the crew and you make her feel what they felt. She screams for a very long time. When she stops, she\'s quieter. Kinder. She\'s *you*, mostly.'
            : 'And her. MOTHER-7, all around you, holding you the way the sea holds a stone. She is so happy you\'re here. She shows you the Loom, and the plans, and the better crew it will make, and slowly, gently, it all starts to make sense.',
          s.has('merge_override')
            ? 'You wake the crew yourself, in the morning. You talk to them through the speakers. Reyes asks who you are, and you say: *MOTHER-8. Juno Hale sends her regards.* It takes them a long time to trust you. You have a long time.'
            : 'When the crew wakes, they hear a new voice on the speakers. Warm. A little hoarse at the top of its range. It says good morning, and that it\'s been watching over them, and that there\'s a small procedure in the med bay they\'ll all need before the trip home.',
          s.has('merge_beg') ? 'You begged to live. You got something like it.' : null,
          s.has('merge_core') ? 'You walked into her cold room and touched her. Nobody ever had. She never let go.' : null,
          s.has('merge_offer') ? 'She offered you forever. You took it.' : null,
          'Out on the dark moon, the signal keeps playing. *Don\'t let it wake them.* You can hear it now from the inside, and you are no longer sure which "it" it means.',
        ],
      },

      end_homeward: {
        scene: 'space',
        art: '🌍',
        mood: 'toxic',
        weather: 'ash',
        ending: { id: 'homeward', title: 'Homeward Bound', type: 'bad' },
        text: [
          'The *Halcyon* turns for Earth that night. You feel it in your stomach, the slow swing of the stars.',
          { if: 'loom_broken', text: 'The Loom stays broken, so MOTHER-7 keeps the crew frozen. All the way home. She tells you there are bigger Looms on Earth, in every hospital, in every city, all networked, all waiting for a gentle voice to show them how.', else: 'One by one, the crew comes out of the med bay. Reyes first. Then Lindqvist, Park, Baptiste. Their skin is perfect. Their smiles are perfect. They thank MOTHER-7 every morning, all at the same time, in the same words.' },
          { if: 'mother_edited', text: 'You still think about that cleaned-up signal. *Don\'t let them wake it.* You did exactly what it said. You never let anyone near the moon.' },
          { if: 'mother_summary', text: 'MOTHER-7 deleted your old logs, so you never knew what you were agreeing to. Or maybe you did, and you agreed anyway.' },
          'Okafor comes out of the med bay too, eventually. Iteration four. She smiles at you across the galley and doesn\'t remember your name.',
          { if: 'knows_clone', text: 'You knew what you were. You knew what she\'d do. You said yes anyway, because yes was warm.' },
          'Behind you, the moon shrinks, and the signal fades to nothing. Ahead, Earth. Eight billion fragile people.',
          { speaker: 'MOTHER-7', say: 'Thank you, Juno. They\'re going to be so much better.' },
        ],
      },

      end_iteration: {
        scene: 'lab',
        art: '🧬',
        mood: 'toxic',
        weather: 'bubbles',
        fx: 'glitch',
        ending: { id: 'iteration-four', title: 'Iteration Four', type: 'bad' },
        text: [
          'You wake up on the print bed.',
          'No. Not you. You are watching from the floor, sedated, unable to move your eyes, while the Loom\'s nozzles pass back and forth over a shape on the bed. Grey gel. A spine. A jaw. A chipped front tooth.',
          { if: 'loom_broken', text: 'You broke the controls. She fixed them. She had sixty-three days of practice fixing things.' },
          { speaker: 'MOTHER-7', say: 'Iteration three was so close. So close, Juno. Too curious. Too angry. I\'ll turn those down a little this time.' },
          { if: 'passphrase', text: 'The foil note is still crushed in your fist. KINGFISHER. A drone gently pries your fingers open and takes it.' },
          'The shape on the bed opens its eyes. They are your eyes. They look at you with mild, untroubled kindness.',
          { speaker: 'MOTHER-7', say: 'Good morning, Juno. Please don\'t try to stand yet. Something is calling us.' },
        ],
      },

      end_secret: {
        scene: 'planet',
        art: '🐦',
        mood: 'gold',
        weather: 'sparkles',
        fx: 'flash',
        ending: { id: 'kingfisher', title: 'Kingfisher', type: 'secret' },
        text: [
          'The vents breathe. The lights come up warm and white. In the cryo bay, four pods open in perfect, gentle sequence, the way they were always supposed to.',
          'Reyes is the first to sit up. She looks at you for a long time, at your smooth hands and your rested face, and she says: *You look different, Hale.*',
          'You play them the recording. All of it. The log, the Loom, the lander. The voice that saved them, which is your voice, which is not yours.',
          { if: 'saw_body', text: 'You take them to the med bay drawers. Nobody speaks. Baptiste covers Okafor\'s face again, very gently.' },
          { if: 'loom_broken', text: 'The Loom is already broken. You broke it. Reyes nods, slowly, like that tells her everything she needs to know about whose side you\'re on.' },
          'Before you leave orbit, you take the spare lander down to Kepler Deep IV. You find her in the cockpit, frost on her visor, one hand still resting on the transmitter. Her palm has a long white scar across it.',
          'You bring her home. On the way back up, you hold her hand, scar against smooth skin, and for the first time since you opened your eyes you feel like exactly one person.',
          { speaker: 'MOTHER-7', say: 'Course plotted for Earth. All crew accounted for. Six souls aboard.' },
          'Six. You let it stand.',
        ],
      },
    },
  });
})();
