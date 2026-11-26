/*
 * Déjà Vu, Inc. — MysteryFate story.
 * A sleek clinic that erases bad memories. You have booked a session to forget something; you don't know what.
 * Central truths: you co-founded Déjà Vu, Inc. with Dr. Imani Vance and built LETHE, the erasure machine.
 * Its first test subject was your little brother Theo, who volunteered. The prototype took everything he was.
 * He woke with no past, and you gave him the only thing you could: a job at the front desk, so you could see him
 * every day. Seeing him hurts without a reason, so you book a session, forget, come back, and it starts again.
 * REPLAY MEMORY is the hook (remembers: true): every real playthrough WAS another treatment session.
 *   s.found() >= 1: Theo says "welcome back", your file is thicker, Gus knows you, details shift.
 *   s.found() >= 2: Dr. Vance is frightened of you; you can ask her why (vance_truth, the founder route).
 *   s.found() >= 3: you can finally reach Theo's truth and the true ending, "Welcome Back".
 *   s.seen('<ending>') changes lines: the "incident" (nothing-left), the lost name (wrong-file), the smashed core, etc.
 * Wrapped in an IIFE so helpers stay out of global scope.
 */
(function () {
  'use strict';

  const runs = (s) => s.found();
  const session = (s) => s.found() + 1;
  const back = (s) => s.found() >= 1;
  const afraid = (s) => s.found() >= 2;
  const ready = (s) => s.found() >= 3;
  const retained = (pct) => (s) => `Session ${session(s)} · Memory ${pct}% retained`;

  registerStory({
    id: 'deja-vu',
    title: 'Déjà Vu, Inc.',
    category: 'scifi',
    tagline: 'They can make you forget anything. They just can\'t make you stop coming back.',
    description: 'You have booked a session at Déjà Vu, Inc., the city\'s most exclusive memory-erasure clinic, to forget something terrible. You don\'t know what it is. That was the point. But the receptionist keeps smiling at you like an old friend, and this game remembers every time you\'ve played it.',
    cover: '🔁',
    accent: '#9b8cff',
    ambient: 'scifi',
    scene: 'lobby',
    remembers: true,
    warning: 'Contains: grief, medical procedures, a brief (non-graphic) death, memory loss.',
    voices: {
      narrator: { gender: 'female', pitch: 0.95, rate: 0.97, accent: 'en-GB', note: 'cool, clinical, quietly heartbroken' },
      'You': { gender: 'neutral', pitch: 1.0, rate: 1.03, accent: 'en-US', note: 'polite, guarded, a little lost' },
      'Theo': { gender: 'male', pitch: 1.12, rate: 1.12, accent: 'en-US', note: 'sunny receptionist, eager, younger brother energy' },
      'Dr. Vance': { gender: 'female', pitch: 0.88, rate: 0.93, accent: 'en-US', note: 'precise clinician, tired, increasingly afraid' },
      'LETHE': { gender: 'neutral', pitch: 0.65, rate: 0.86, accent: 'en-GB', note: 'the erasure machine: soft, robotic, terribly polite' },
      'Gus': { gender: 'male', pitch: 0.8, rate: 0.85, accent: 'en-IE', note: 'old repeat patient, gentle, folds paper cranes' },
      'Past You': { gender: 'neutral', pitch: 0.95, rate: 0.92, accent: 'en-US', volume: 0.7, note: 'your own handwriting, read in your head' },
    },
    start: 'lobby',
    scenes: {
      // ------------------------------------------------------------------ ARRIVAL
      lobby: {
        title: '9:00 AM — Déjà Vu, Inc., Reception',
        stamp: (s) => (back(s) ? `Session ${session(s)} · Returning patient` : 'Session 1 · New patient'),
        scene: 'lobby',
        art: '🏥',
        mood: 'ice',
        text: [
          'You are here to forget something. You are not sure what. You wrote it down, sealed it in an envelope, and paid four thousand dollars so that by lunchtime you will never have to know.',
          'Déjà Vu, Inc. occupies the top floor of a glass tower like a held breath. White marble. White orchids. A wall of water that falls without a sound. Everything smells faintly of lavender and very expensive nothing.',
          (s) => (back(s)
            ? 'Behind the desk, the receptionist looks up, and his whole face lights. Name tag: **THEO**. Mid-twenties, freckles, a cardigan he is clearly proud of.'
            : 'Behind the desk sits a young man in a cardigan, freckled, mid-twenties, with a name tag that says **THEO** and a smile so open it is almost rude.'),
          (s) => (back(s)
            ? { speaker: 'Theo', say: 'Welcome back! Oh, it\'s so good to see you. Same chair, same time. You want the lavender water or the cucumber? You always pick lavender.' }
            : { speaker: 'Theo', say: 'Hi! Welcome to Déjà Vu, Inc. First time? Don\'t worry, everybody\'s nervous. Nobody remembers being nervous afterwards. That\'s kind of our whole thing.' }),
          { if: (s) => s.seen('wrong-file'), text: { speaker: 'Theo', say: 'And you know your name today? Last time you told me it was *um*. Took us three days to give it back to you.' } },
          { if: (s) => s.seen('out-of-order'), text: 'Through the glass behind him, you can see a brand-new machine being bolted into the treatment room. Theo follows your eyes and winces. *Somebody took a fire extinguisher to the old one,* he says. He does not say who.' },
          { if: (s) => s.seen('nothing-left'), text: 'There\'s a new sign on the desk: **IN LIGHT OF THE RECENT INCIDENT, ALL PATIENTS MUST REMAIN STRAPPED IN UNTIL DISCHARGE.** Theo turns it face down when he sees you reading it.' },
          { if: afraid, text: 'Your file is on the desk. It is as thick as a phone book. There are coffee rings on it. Some of them, you are almost sure, are yours.' },
          { if: (s) => back(s) && !afraid(s), text: 'Your file is on the desk. It\'s thicker than a first-timer\'s file has any right to be.' },
          'He slides a consent tablet across the marble. Somewhere behind the wall of water, a machine hums a single, patient note.',
        ],
        choices: [
          {
            text: 'Sign without reading',
            hint: 'You came here to stop thinking. Start now.',
            art: '✍️',
            outcome: [
              'You scrawl your name across the glass. It glows green, approves of you, and dissolves into the logo: two overlapping circles, like a pair of rings, or an echo.',
              { speaker: 'Theo', say: 'Perfect. Dr. Vance will be right with you. Have a seat, have a cucumber water, have a lovely last few minutes of whatever it is.' },
              { if: back, text: 'He says it fondly. As if he has said it to you before and liked it every time.' },
            ],
            next: 'waiting',
          },
          {
            text: 'Read the fine print',
            hint: 'Four thousand dollars buys you clause fourteen.',
            set: ['read_fine'],
            art: '🔍',
            outcome: [
              'You scroll. And scroll. Clause fourteen, in letters so small they are practically a rumour:',
              '*14(c). The Patient acknowledges that previous sessions, if any, will not be remembered, and waives the right to be informed of their number.*',
              (s) => (back(s)
                ? `Underneath, a field that should say **Prior sessions: 0** has been filled in by hand and then scratched out. You can just make out the number underneath. It is **${runs(s)}**. Or it was, before someone started a new tally beside it.`
                : 'Underneath, a field that says **Prior sessions: 0**. Someone has typed it, deleted it, and typed it again. The cursor is still blinking after the zero.'),
              { speaker: 'Theo', say: 'Nobody reads that. You\'re very thorough. You were always— you seem very thorough!' },
            ],
            next: 'waiting',
          },
          {
            text: 'Ask him: "Welcome *back*?"',
            hint: 'You have never been here in your life. You think.',
            if: back,
            set: ['k_back'],
            art: '❓',
            outcome: [
              { speaker: 'You', say: 'You said welcome back. I\'ve never been here.' },
              'Theo\'s smile wobbles, just for a second, like a picture on a bad signal. Then he leans in, conspiratorial.',
              (s) => ({ speaker: 'Theo', say: `Between us? This is visit number ${session(s)}. You never remember. That's sort of the point of the place. But I remember. I remember everybody.` }),
              { if: (s) => s.seen('clean-slate'), text: { speaker: 'Theo', say: 'Last time it took beautifully. You walked out of here whistling. And then, you know. Here you are.' } },
              { if: (s) => s.seen('unforgotten'), text: { speaker: 'Theo', say: 'Last time you walked out before the treatment. You left your umbrella. I kept it for you.' } },
              { if: (s) => s.seen('unforgotten'), text: 'He hands you a black umbrella with your initials on the handle, in your handwriting, on a strip of tape. It has been waiting under his desk for a while.', else: 'He taps your file. It is thicker than it was the last time you didn\'t remember being here.' },
            ],
            next: 'waiting',
          },
        ],
      },

      waiting: {
        title: '9:10 AM — The Quiet Room',
        scene: 'lobby',
        art: '🛋️',
        mood: 'ice',
        text: [
          'The waiting room is designed to make you feel nothing in particular: pale chairs, a pale rug, a long aquarium in which a single goldfish swims laps like it is training for something.',
          'In the corner sits an old man folding a paper crane out of a receipt. He has a pile of them beside him, dozens, all different colours. He works with the slow care of someone who has done this many times and forgotten each one.',
          { if: (s) => back(s), text: 'The old man glances up at you and his hands stop. Then they start again, slower.' },
          'At the far end of the corridor, a frosted door says **STAFF ONLY**. It is standing open about an inch, which is the most tempting width a door can be.',
          { if: 'read_fine', text: 'Clause fourteen is still running round your head. *Waives the right to be informed of their number.*' },
        ],
        choices: [
          {
            text: 'Sit with the old man',
            hint: 'He looks like he knows the way round this place.',
            set: ['gus'],
            art: '🕊️',
            outcome: [
              { speaker: 'Gus', say: 'Gus. Don\'t ask what I\'m in for. I won\'t know.' },
              'He hands you a crane. Its wing has writing on it, very small: *Margaret.*',
              { speaker: 'Gus', say: 'Every spring I come and forget the year she died. So I can have the first year back. The first year\'s the worst, but it\'s the one where she still feels close. Sounds daft, said out loud.' },
              (s) => (back(s)
                ? { speaker: 'Gus', say: 'And you\'re the one who cries in the car park after. Every time. I\'d recognise that coat anywhere. Whatever you\'re forgetting, love, it keeps finding its way back to you, doesn\'t it?' }
                : { speaker: 'Gus', say: 'You\'ve got the look. Like you\'re carrying a box and you don\'t know what\'s in it. They\'ll take the box. They never take the arms.' }),
            ],
            next: 'intake',
          },
          {
            text: 'Slip through the STAFF ONLY door',
            hint: 'If there\'s a file on you, it\'s back there.',
            scene: 'corridor',
            art: '🚪',
            outcome: [
              'You stand, stretch, wander toward the toilets, and keep wandering. The frosted door gives under one finger. Nobody shouts.',
              'Behind it, the clinic stops pretending. Grey carpet. Strip lights. A humming server cabinet. And a long room full of filing drawers, actual paper, the kind of records people keep when they don\'t want a computer to remember for them.',
            ],
            next: 'archive',
          },
          {
            text: 'Watch the goldfish',
            hint: 'Three-second memory, they say. Lucky thing.',
            art: '🐟',
            outcome: [
              'You crouch by the tank. The goldfish swims to the end, turns, and swims back, with the bright face of something seeing the far wall for the very first time. Every time.',
              'There\'s a little brass plaque on the tank: **LETHE. Our mascot.** Someone has added, in biro, *(Mk. I)*.',
              { if: back, text: 'You realise you know which way it\'s going to turn before it turns. Left, left, right, pause. You have watched this fish before. More than once.' },
            ],
            next: 'intake',
          },
        ],
      },

      archive: {
        title: '9:14 AM — Patient Records',
        scene: 'office',
        art: '🗄️',
        mood: 'office',
        text: [
          'Drawers floor to ceiling, labelled by surname. Each file is the life somebody paid to lose: a crash, a divorce, a dog, a war. The room has the hush of a library where every book is about a bad day.',
          'On the desk by the door, a staff keycard hangs off a lamp on a lanyard: **DR. I. VANCE · ALL ACCESS**. Beside it, a coffee, still warm. She has only just stepped out.',
          (s) => (afraid(s)
            ? 'Your drawer is easy to find. It\'s the one that won\'t close. Your file has been split into three folders, then rubber-banded back together, then split again.'
            : back(s)
              ? 'Your drawer is easy to find. Your file is a good inch thick. There\'s a yellow sticky note on the front: **DO NOT DISCUSS PRIOR SESSIONS WITH PATIENT.**'
              : 'Your drawer is easy to find. Your file is thin, almost nothing. Just a cover sheet, and a sealed envelope in your own handwriting.'),
          'Footsteps in the corridor. Heels, unhurried. You have maybe a minute.',
        ],
        choices: [
          {
            text: 'Open your file',
            hint: 'Read it before they erase it.',
            set: ['k_file'],
            fx: 'glitch',
            art: '📂',
            outcome: [
              'You open the folder. The first page is a photograph of a room you have never seen: a basement lab, two chairs, a tangle of cables, a mug that says **WORLD\'S OKAYEST SIBLING**.',
              'You have never seen it. You know exactly where the light switch is.',
              'The room tilts. The strip lights smear. Something behind your eyes opens like a door in a draught.',
            ],
            next: 'flash_file',
          },
          {
            text: 'Take the keycard and get out',
            hint: 'All access. That has to be worth something.',
            set: ['keycard'],
            art: '🪪',
            outcome: [
              'You lift the lanyard off the lamp and slide it into your pocket. Your heart is going like a stolen car.',
              'You are back in your pale chair in the waiting room, legs crossed, reading a magazine upside down, when the heels go past. They stop. They go on.',
            ],
            next: 'intake',
          },
        ],
      },

      flash_file: {
        title: 'A Basement — Some Night, Some Year',
        stamp: 'Memory fragment · date redacted',
        jump: 'glitch',
        scene: 'lab',
        art: '🔦',
        mood: 'candle',
        weather: 'dust',
        text: [
          'Warm light. Solder smoke. Pizza boxes. You are standing in the basement from the photograph, and you are younger, and you are laughing.',
          'Someone is sitting in the first of the two chairs, a cap of wires on their head. You can\'t see their face. The memory won\'t let you. It is like trying to look at the sun with your eyes shut.',
          { speaker: 'Theo', say: 'Let me go first. You trust it. I trust you. That\'s the whole maths.' },
          'The voice is familiar, in the way your own front door is familiar. Your hand is on a switch. Your hand is about to—',
          '—and the corridor heels are getting closer, back in the present, and the memory is draining like bathwater.',
        ],
        choices: [
          {
            text: 'Hold on to it. Whose voice is that?',
            hint: 'Grip it with both hands.',
            set: ['k_flash'],
            art: '🫴',
            outcome: [
              'You hold on. You hold on so hard your nails bite your palms. You don\'t get the face. But you get the voice, and you get the switch, and you get the weight of your own hand on it.',
              'Then you are in the archive again, on your knees, the file in your lap. You shove it back in the drawer and make it to the waiting room just as the heels round the corner.',
            ],
            next: 'intake',
          },
          {
            text: 'Shake it off, grab the keycard, run',
            hint: 'Whatever that was, you came here to stop it.',
            set: ['keycard'],
            art: '🏃',
            outcome: [
              'You shake your head like a wet dog and the basement goes. You snatch the keycard off the lamp on the way out because you are already a criminal, apparently, and might as well commit.',
              'Back in the waiting room, your hands won\'t stop trembling. The goldfish swims to the end of its tank, turns, and looks at you with total, perfect innocence.',
            ],
            next: 'intake',
          },
        ],
      },

      // ------------------------------------------------------------------ THE DOCTOR
      intake: {
        title: '9:20 AM — Consultation',
        stamp: (s) => `Session ${session(s)} · Intake`,
        scene: 'office',
        art: '🩺',
        mood: 'ice',
        text: [
          'Dr. Imani Vance is tall and spare, with silver at her temples and the stillness of someone who has explained very difficult things to very frightened people. Her office has one plant, one chair for you, and a window full of city.',
          (s) => (afraid(s)
            ? 'When you walk in, she stands up too fast. Her hand goes to the edge of her desk, and you realise, with a lurch, that her thumb is resting on a panic button. She is afraid of you. You have absolutely no idea why.'
            : back(s)
              ? 'She shakes your hand, and holds it a beat too long, studying your face the way you study a road you have driven before in fog.'
              : 'She shakes your hand: dry, firm, brief. She reads your intake form on a tablet without blinking.'),
          (s) => (afraid(s)
            ? { speaker: 'Dr. Vance', say: 'Please sit. Please. Stay on that side of the desk, if you don\'t mind. It\'s, ah. It\'s policy.' }
            : back(s)
              ? { speaker: 'Dr. Vance', say: 'Good to see you again. Not that you— well. Please, sit.' }
              : { speaker: 'Dr. Vance', say: 'You\'ve sealed your target memory. Good. Most people want to talk it through. Talking is how it gets its claws in deeper.' }),
          { if: (s) => s.seen('nothing-left'), text: { speaker: 'Dr. Vance', say: 'After the incident last time, I\'ve added a few safety measures. You won\'t remember the incident. I do. Every night.' } },
          { if: (s) => s.seen('founders-discount'), text: 'On her wrist there\'s a pale band of skin, the kind a restraint strap leaves. She sees you notice and pulls her sleeve down.' },
          { if: 'keycard', text: 'Her keycard is in your pocket. It feels like it weighs a pound.' },
          { if: 'k_flash', text: '*Let me go first.* The voice is still in your ear like the sea in a shell.' },
          { if: 'gus', text: 'You turn Gus\'s paper crane over in your fingers. *Margaret.*' },
          { speaker: 'Dr. Vance', say: 'So. Shall we begin?' },
        ],
        choices: [
          {
            text: '"Take it. Whatever it is. All of it."',
            hint: 'You trusted yourself enough to seal it.',
            art: '🪑',
            outcome: [
              { speaker: 'You', say: 'Take it. I don\'t want to know. That\'s why I\'m here.' },
              'She nods, slowly, the nod of a doctor who has heard a sentence so many times it\'s worn smooth.',
              { speaker: 'Dr. Vance', say: 'Then let\'s get you comfortable.' },
            ],
            next: 'chair',
          },
          {
            text: '"What exactly am I forgetting?"',
            hint: 'You\'re about to pay to lose it. You could at least meet it.',
            art: '✉️',
            outcome: [
              { speaker: 'You', say: 'Before you do this. What is it? What am I forgetting?' },
              'She lifts a sealed envelope out of your file and lays it on the desk between you, very carefully, like a card in a game she has lost before.',
              { speaker: 'Dr. Vance', say: 'You wrote this to yourself. Clinic policy is that I don\'t open it. Patient policy, your policy, is written on the front.' },
            ],
            next: 'envelope',
          },
          {
            text: '"Why are you afraid of me, Imani?"',
            hint: 'You know her first name. You don\'t know how.',
            if: afraid,
            art: '😨',
            outcome: [
              'Her first name lands in the room like a dropped glass. You didn\'t know you knew it until it was out.',
              'Dr. Vance goes grey. Her thumb presses the panic button, then lifts off it again, without pushing. She sits down very slowly.',
              { speaker: 'Dr. Vance', say: 'You haven\'t called me that in a long time. Not in this room.' },
            ],
            next: 'vance_truth',
          },
          {
            text: 'Stand up and walk out',
            hint: 'Your gut is shouting. Listen to it, for once.',
            scene: 'street',
            art: '🚶',
            outcome: [
              { speaker: 'You', say: 'I\'m sorry. I can\'t. I changed my mind.' },
              (s) => ({ speaker: 'Dr. Vance', say: (afraid(s) ? 'Oh, thank God.' : 'That\'s your right. Of course. The deposit is non-refundable.') }),
              'You are in the lift before you can change it back, then out through the lobby, past Theo\'s startled wave, and through the revolving doors into a city that is just starting to rain.',
            ],
            next: 'exit_street',
          },
        ],
      },

      envelope: {
        title: '9:24 AM — The Envelope',
        scene: 'office',
        art: '✉️',
        mood: 'ice',
        text: [
          'Your own handwriting, on the front of the envelope, in capital letters that dig through the paper:',
          { speaker: 'Past You', say: 'DO NOT OPEN. YOU WILL WANT TO. YOU ALWAYS WANT TO. DON\'T.' },
          (s) => (back(s)
            ? 'The flap has been opened and resealed so many times the glue has gone glassy. There are fingerprints on it. Yours. Layers of them.'
            : 'The flap is sealed with a strip of clinic tape. You can feel a single folded sheet inside, and something small and hard, like a key or a ring.'),
          'Dr. Vance watches you with her hands folded. She is not going to help you either way. That, too, is policy.',
        ],
        choices: [
          {
            text: 'Respect past-you. Leave it sealed.',
            hint: 'They knew things you don\'t. They were you.',
            art: '🔒',
            outcome: [
              'You push the envelope back across the desk. Dr. Vance puts it away without a word, but something in her shoulders loosens.',
              { speaker: 'Dr. Vance', say: 'You always say that\'s the hardest part. Not the treatment. Not opening the envelope.' },
              'You don\'t remember always saying anything. You follow her down the corridor.',
            ],
            next: 'chair',
          },
          {
            text: 'Tear it open',
            hint: 'Past-you doesn\'t get a vote. Past-you is about to be deleted.',
            set: ['k_letter'],
            fx: 'flash',
            art: '📜',
            outcome: [
              'You rip it. Dr. Vance doesn\'t stop you. Inside: one folded sheet, and a little brass key on a ring with a plastic fob shaped like a goldfish.',
              { speaker: 'Past You', say: 'Okay. You opened it. You always do. Here\'s what you\'re allowed to know: you did something with the best intentions in the world, and it cost someone everything they were. They don\'t know. They\'re happy. You see them every day, and every day it eats you alive.' },
              { speaker: 'Past You', say: 'Forgetting doesn\'t fix it. It just gives you a few good weeks. Take them. You\'ve earned a few good weeks. P.S. Feed the fish.' },
            ],
            next: 'letter',
          },
        ],
      },

      letter: {
        title: '9:27 AM — The Letter',
        stamp: (s) => `Session ${session(s)} · Patient has read the letter`,
        scene: 'office',
        art: '🗝️',
        mood: 'night',
        text: [
          'You read it three times. The words don\'t change. *Someone*. *Everything they were*. *You see them every day.*',
          'Who do you see every day? A barista. A bus driver. Your neighbour\'s cat. The faces line up in your head and none of them light up, and that is somehow worse.',
          { if: 'k_flash', text: '*Let me go first. You trust it. I trust you.* The voice from the basement fits the letter like a key in a lock.' },
          { if: back, text: 'Dr. Vance says, very quietly, that you have read the letter before. She doesn\'t say how many times. Her eyes say *many*.' },
          { speaker: 'Dr. Vance', say: 'The chair is ready whenever you are. Or the door. I won\'t pretend to know which is kinder.' },
        ],
        choices: [
          {
            text: 'Take the few good weeks',
            hint: 'Past-you begged. Listen to them.',
            art: '🪑',
            outcome: [
              'You fold the letter along its old creases. It goes back into the envelope as easily as breathing. Clearly, it has had practice.',
              { speaker: 'You', say: 'Let\'s do it.' },
            ],
            next: 'chair',
          },
          {
            text: 'Keep the letter. Walk out.',
            hint: 'If it\'s eating you alive, you\'d like to know what\'s doing the eating.',
            set: ['kept_letter'],
            scene: 'street',
            art: '🚶',
            outcome: [
              'You pocket the letter and the little brass key. Dr. Vance does not try to stop you. At the door, you look back, and she is sitting very still with her hands over her face.',
              'The lift. The lobby. Theo waving, puzzled, cardigan sleeves pulled over his hands. The revolving door. Rain.',
            ],
            next: 'exit_street',
          },
        ],
      },

      vance_truth: {
        title: '9:25 AM — The Truth, Partly',
        stamp: (s) => `Session ${session(s)} · Staff alert: patient is asking questions`,
        scene: 'office',
        art: '🧑‍⚕️',
        mood: 'night',
        fx: 'heartbeat',
        text: [
          { speaker: 'Dr. Vance', say: 'We built this place together. You and me. You\'re the *Inc.* You designed the chair. You wrote the software. LETHE is your handwriting in code.' },
          (s) => ({ speaker: 'Dr. Vance', say: `And then one day you walked in the front door and booked yourself a session. And this is session ${session(s)}. That I'm allowed to count.` }),
          { if: (s) => s.seen('nothing-left'), text: { speaker: 'Dr. Vance', say: 'Last time you tore the electrodes out mid-erasure. Your heart stopped for ninety-one seconds. I brought you back with my own hands. Then you made me erase that too.' } },
          { if: (s) => s.seen('out-of-order'), text: { speaker: 'Dr. Vance', say: 'Last time, you used my keycard and a fire extinguisher on the core. You paid for the new one yourself. You don\'t remember paying.' } },
          { if: (s) => s.seen('founders-discount'), text: { speaker: 'Dr. Vance', say: 'And the time before... you strapped me in. I found the logs afterwards. I know what you\'re capable of when you remember who you are.' } },
          { if: (s) => s.seen('wrong-file'), text: { speaker: 'Dr. Vance', say: 'Once it took your name instead. You sat in reception for three days, perfectly happy, and nobody could tell you who you were.' } },
          'Her thumb is back on the panic button. It isn\'t pressing. It\'s just resting there, like a hand on a dog that might bite.',
          { speaker: 'Dr. Vance', say: 'So yes. I\'m afraid of you. Not because you\'re cruel. Because every time you start to remember, it\'s like watching someone walk back into a fire.' },
        ],
        choices: [
          {
            text: '"Then I want my company back."',
            hint: 'If it\'s your machine, it\'s your rules.',
            set: ['founder'],
            scene: 'lab',
            art: '🎛️',
            outcome: [
              { speaker: 'You', say: 'If I built it, I want to see it. Not from the chair. From the controls.' },
              'She hesitates for a long time. Then she stands, unclips a second keycard from inside her collar, and leads you down a corridor you somehow know is forty-one steps long. You count them. Forty-one.',
              'The control room door opens to your palm print before she can swipe.',
            ],
            next: 'control_room',
          },
          {
            text: '"What am I forgetting? Tell me."',
            hint: 'She knows. She has always known.',
            art: '🗣️',
            outcome: [
              { speaker: 'You', say: 'Please. What did I do?' },
              (s) => (ready(s)
                ? { speaker: 'Dr. Vance', say: 'I\'m not going to tell you. I\'ve told you before and it was like reading someone their own obituary. But I\'ll stop protecting you from it. Go and talk to the front desk. Look at him. Properly. For once.' }
                : { speaker: 'Dr. Vance', say: 'You made me promise. In writing. With a lawyer. I\'m sorry. I\'m so sorry. The chair is the only answer I\'m allowed to give you.' }),
              { if: (s) => !ready(s), text: 'She stands and opens the door to the treatment room. Her hands are shaking. She does not seem to know whether she is helping you or hurting you, and you realise she has not known for a very long time.' },
            ],
            next: (s) => (ready(s) ? 'theo_truth' : 'chair'),
          },
          {
            text: '"I don\'t want to know. Do it anyway."',
            hint: 'Some fires you don\'t walk back into.',
            art: '🪑',
            outcome: [
              { speaker: 'You', say: 'Don\'t tell me. Whatever it is, I clearly decided this. More than once.' },
              { speaker: 'Dr. Vance', say: 'Yes. You did. Come on, then. Same as always.' },
              'She says *same as always* the way people say *amen*.',
            ],
            next: 'chair',
          },
        ],
      },

      control_room: {
        title: '9:31 AM — LETHE Control',
        stamp: (s) => `Session ${session(s)} · Operator: you`,
        scene: 'lab',
        art: '🎛️',
        mood: 'neon',
        text: [
          'The control room is your mind turned inside out. Screens of slow, blue waveforms, each one a person\'s worst day being gently unpicked. A wall of glass discs: backups, *for litigation purposes*, every memory the clinic has ever taken, labelled and humming.',
          'You sit in the operator\'s chair. It fits you. Of course it fits you. The keyboard has worn shiny where your fingers go.',
          { speaker: 'LETHE', say: 'Welcome back, Director. It has been a long time since you sat on this side.' },
          { speaker: 'Dr. Vance', say: 'Please. Whatever you\'re thinking. Think it slower.' },
          'On the main screen, a patient log scrolls past. Near the very top, the first entry ever made, is a name you can\'t quite read. Above it, a single word: **ZERO**.',
        ],
        choices: [
          {
            text: 'Put Imani in the chair instead',
            hint: 'She knows too much. Somebody here has to forget.',
            fx: 'redflash',
            art: '🔐',
            outcome: [
              'You don\'t decide it, exactly. Your hands decide it, with the ease of long practice. Two keystrokes, and the restraint arms on the treatment chair beyond the glass unfold like a flower.',
              { speaker: 'Dr. Vance', say: 'No. No, not again—' },
              'She is faster than you expect and slower than she needs to be.',
            ],
            next: 'end_founders',
          },
          {
            text: 'Shut LETHE down. All of it.',
            hint: 'No more erasures. For anyone. Including you.',
            art: '⏻',
            outcome: [
              { speaker: 'You', say: 'LETHE. Authorisation: Director. Full shutdown. Wipe the scheduling. Cancel every appointment, starting with mine.' },
              { speaker: 'LETHE', say: 'Director, that will be the end of Déjà Vu, Incorporated.' },
              { speaker: 'You', say: 'Yes. That\'s rather the idea.' },
            ],
            next: 'end_out_of_order',
          },
          {
            text: 'Open the file marked ZERO',
            hint: 'The first patient. Whose memory did you take first?',
            if: ready,
            set: ['k_zero'],
            fx: 'glitch',
            art: '0️⃣',
            outcome: [
              'You click. The file opens. There\'s a photo clipped to the top of it: a freckled young man in a hospital gown, smiling vaguely at the camera the way you smile at a stranger.',
              'You know that face. You walked past it at 9 AM. It handed you a consent tablet and asked if you wanted cucumber water.',
              { speaker: 'Dr. Vance', say: 'Yes. Go and see him. Go and see him properly.' },
            ],
            next: 'theo_truth',
          },
        ],
      },

      // ------------------------------------------------------------------ THE STREET
      exit_street: {
        title: '9:40 AM — Outside',
        scene: 'street',
        art: '☔',
        mood: 'storm',
        weather: 'rain',
        text: [
          'Rain like static. The city smells of wet stone and coffee. Your heart is going like you have escaped from something, which, you suppose, you have.',
          { if: (s) => s.seen('unforgotten'), text: 'You open the umbrella before you realise you didn\'t bring one. Theo pressed it into your hand on the way out. Your initials. Your handwriting. *Again*, he said.' },
          { if: 'kept_letter', text: 'The letter is a square of heat in your pocket. *You see them every day.*' },
          'You check your phone for something, anything, to do with your hands. There\'s a contact in it you don\'t remember adding. No photo. Just a name, in capitals: **DON\'T.**',
          'The revolving doors of Déjà Vu, Inc. turn slowly behind you, empty, like they are waiting for you to come back through them.',
        ],
        choices: [
          {
            text: 'Call DON\'T',
            hint: 'Past-you saved it. Past-you must have had a reason.',
            set: ['called'],
            art: '📱',
            outcome: [
              'It rings once. Twice. Then a bright, friendly voice, a little out of breath, like he ran for the phone.',
              { speaker: 'Theo', say: 'Hello? Who\'s this? Sorry, I\'m on my break, I\'m on the roof, it\'s pouring, I\'m an idiot.' },
              'It\'s the receptionist. You look up. Forty floors above you, on the edge of the roof garden, a tiny figure in a cardigan is holding a phone to his ear in the rain.',
            ],
            next: 'phone',
          },
          {
            text: 'Go back inside',
            hint: 'You paid four thousand dollars. And you\'re scared.',
            set: ['returned'],
            scene: 'lobby',
            art: '🔄',
            outcome: [
              'You stand in the rain until you are soaked through. Then you turn round and push back through the revolving door. Theo is already holding out a towel. He doesn\'t look surprised.',
              { speaker: 'Theo', say: 'People always come back. Nobody ever believes that, but they do.' },
            ],
            next: 'chair',
          },
        ],
      },

      phone: {
        title: '9:43 AM — A Call in the Rain',
        scene: 'street',
        art: '📞',
        mood: 'storm',
        weather: 'rain',
        text: [
          'You don\'t say anything for long enough that he says *hello?* twice more. Something in your chest has come loose and is rattling around.',
          { speaker: 'Theo', say: 'Is this... are you the one who just walked out? I gave you my number once, I think. Ages ago. You said you\'d call if you ever needed someone to talk at. Do you need someone to talk at?' },
          { if: 'kept_letter', text: '*They don\'t know. They\'re happy. You see them every day.* You hold the letter so hard it tears.' },
          { if: 'k_flash', text: '*Let me go first.* It\'s the voice. It\'s the voice from the basement, a few years older, and completely, terribly cheerful.' },
          'Forty floors up, the tiny figure on the roof waves, uncertainly, in your general direction.',
        ],
        choices: [
          {
            text: 'Ask him how his day is going',
            hint: 'Just that. Just talk.',
            art: '☕',
            outcome: [
              { speaker: 'You', say: 'I\'m all right. How\'s... how\'s your day?' },
              { speaker: 'Theo', say: 'Oh! Nobody asks the receptionist that. Okay. So. The goldfish did a flip this morning, I swear on my life—' },
              'He talks for twenty minutes. You stand in the rain and listen to every single word, and you don\'t know why you are crying, and you don\'t need to.',
            ],
            next: 'end_unforgotten',
          },
          {
            text: 'Hang up and go back inside',
            hint: 'Whatever this feeling is, you came to have it removed.',
            set: ['returned'],
            scene: 'lobby',
            art: '📵',
            outcome: [
              'You end the call. Forty floors up, the tiny figure looks at his phone, shrugs, and goes back inside.',
              'You follow him. Lift. Lobby. Towel. His smile, puzzled, and kind.',
              { speaker: 'Theo', say: 'Was that you on the phone? Weird. Felt like a wrong number that wasn\'t. Dr. Vance is ready for you.' },
            ],
            next: 'chair',
          },
        ],
      },

      // ------------------------------------------------------------------ THE CHAIR
      chair: {
        title: '9:45 AM — Treatment Room',
        stamp: retained(100),
        scene: 'lab',
        art: '💺',
        mood: 'ice',
        text: [
          'The treatment chair is white, curved, beautiful, and looks exactly like what it is: a very comfortable place to lose something. A halo of soft electrodes hangs above the headrest, waiting.',
          { if: (s) => s.seen('nothing-left'), text: 'There\'s a new red strap across the armrest, brand new, still stiff. A label: *Installed following incident.* The leather is creased exactly where your wrist goes.' },
          { if: 'returned', text: 'Your clothes are still dripping. Dr. Vance hands you a gown without comment, as if this, too, is something you do.' },
          'The halo settles on your head. It\'s warm. Behind the glass, Dr. Vance\'s fingers move across a console.',
          (s) => ({ speaker: 'LETHE', say: (back(s) ? `Good morning. Patient recognised. Session ${session(s)}. Please relax. You are very good at this.` : 'Good morning. I am LETHE. Please relax. I am going to find the memory you have chosen to release. You may see it, briefly, as I lift it out. That is normal.') }),
          'Then something blooms behind your eyes: warm light, a basement, the smell of solder. The memory, rising toward the surface like a fish to a hand. You have seconds before LETHE closes its fingers around it.',
        ],
        timer: 8,
        timeout: {
          text: 'You panic and thrash',
          art: '😱',
          outcome: [
            'You can\'t decide, and your body decides for you: you buck in the chair, arms flailing, and one hand catches the halo and drags it sideways.',
            { speaker: 'LETHE', say: 'Unsafe movement detected. Unsafe— unsafe—' },
            'The lights go red.',
          ],
          next: 'overload',
        },
        choices: [
          {
            text: 'Let go. Let it take it.',
            hint: 'That\'s what you\'re paying for.',
            art: '🍃',
            outcome: [
              'You breathe out. You open your hands on the armrests. The memory rises, and you don\'t reach for it. You just let it go past, like a stranger on a train.',
              { speaker: 'LETHE', say: 'Thank you. That makes this much easier.' },
            ],
            next: 'erasing',
          },
          {
            text: 'Look at it, just once, before it\'s gone',
            hint: 'You\'re owed a goodbye.',
            art: '👁️',
            outcome: [
              'You turn toward it, inside, the way you\'d turn toward a voice calling your name in a crowd. LETHE lets you. It always lets you.',
            ],
            next: 'flash_chair',
          },
          {
            text: 'Rip the electrodes off',
            hint: 'Something is wrong. Everything in you is screaming it.',
            fx: 'shake',
            art: '⚡',
            outcome: [
              'You grab the halo with both hands and wrench. Wires stretch. Something pops. Behind the glass, Dr. Vance is shouting a word that might be your name.',
              { speaker: 'LETHE', say: 'Please do not do that. Please do not do that. Please—' },
            ],
            next: 'overload',
          },
        ],
      },

      flash_chair: {
        title: 'The Basement — Two Years Ago',
        stamp: retained(61),
        jump: 'back',
        scene: 'lab',
        art: '🧢',
        mood: 'candle',
        weather: 'dust',
        text: [
          'The basement again, but clearer now. Pizza boxes. Solder. The prototype: two kitchen chairs, a car battery, a halo you built out of a colander and nine months of not sleeping.',
          'A young man is sitting in the first chair with the colander on his head, grinning. Freckles. A cardigan, even then.',
          { speaker: 'Theo', say: 'Come on. You\'ve tested it on mice for a year. The mice are fine. The mice are *thriving*. Let me go first.' },
          { speaker: 'You', say: 'It\'s supposed to take one memory. One. You pick it.' },
          { speaker: 'Theo', say: 'The time I fell off the garage roof. Gone. Bye. Flip the switch, genius.' },
          'Your hand is on the switch. It\'s two years ago and it\'s now, and you know, the way you know your own heartbeat, that you are about to make the worst mistake of your life.',
          { if: ready, text: 'And you know his name. You\'ve always known his name. It\'s on his name tag. It\'s the first word you ever learned to spell for somebody else.' },
        ],
        choices: [
          {
            text: 'Hold on to his face',
            hint: 'Don\'t let LETHE have this one.',
            set: ['k_face'],
            art: '🖼️',
            outcome: [
              'You hold on. LETHE tugs, politely, and you don\'t let go. You fix every freckle. The chipped front tooth. The way he grins with one side first.',
              'It\'s the receptionist. It\'s Theo. It\'s the boy in the basement, and the man at the desk, and you don\'t know how those two things fit together, only that they do.',
            ],
            next: 'erasing',
          },
          {
            text: 'Let it blur',
            hint: 'You\'ve said goodbye. That\'s enough.',
            art: '🌫️',
            outcome: [
              'You let go. The basement goes soft at the edges, like a photo left in the sun. The boy in the chair is still grinning as he fades. You hear the switch flip. You don\'t hear what comes after.',
            ],
            next: 'erasing',
          },
        ],
      },

      erasing: {
        title: '9:51 AM — Erasure in Progress',
        stamp: retained(23),
        jump: 'glitch',
        scene: 'lab',
        art: '🌀',
        mood: 'void',
        fx: 'glitch',
        text: [
          'Everything is soft and far away. There is a hole somewhere inside you with smooth edges, and you can\'t remember what was in it, only that it was heavy.',
          { speaker: 'LETHE', say: 'Target memory located and isolated. Twenty-three percent retained. Please confirm final deletion.' },
          { if: 'k_face', text: 'But you\'re still holding one thing, hard, in your fist, the way a child holds a coin. A freckled face. A grin that starts on one side.' },
          { if: (s) => back(s) && !s.has('k_face'), text: 'You have the strangest feeling you have answered this question before. Many times. Always the same way.' },
          'A green light pulses on the console beyond the glass, patient as a heartbeat. CONFIRM. All you have to do is say yes.',
        ],
        choices: [
          {
            text: '"Confirm."',
            hint: 'Clean slate. That\'s what you came for.',
            art: '✅',
            outcome: [
              { speaker: 'You', say: 'Confirm.' },
              { speaker: 'LETHE', say: 'Thank you. Releasing. Zero percent retained. Goodbye.' },
              'It doesn\'t hurt. That\'s the cruellest part, later, when you think about it, if you ever do. It doesn\'t hurt at all.',
            ],
            next: 'end_clean_slate',
          },
          {
            text: '"Wait, that\'s the wrong memory!"',
            hint: 'Is it? You can\'t be sure. Something feels off.',
            art: '❌',
            outcome: [
              { speaker: 'You', say: 'Wait. Stop. I don\'t think that\'s the right one. Go back—' },
              { speaker: 'LETHE', say: 'Understood. Re-targeting. Selecting next most painful memory.' },
              'Your own name rises up in front of you like a bubble. You watch it go. You have just enough time to think *oh, no, not that one*, and then you can\'t remember what *that one* was.',
            ],
            next: 'end_wrong_file',
          },
          {
            text: '"Stop. I know him."',
            hint: 'The face in your fist. Don\'t let go.',
            if: 'k_face',
            fx: 'flash',
            art: '✋',
            outcome: [
              { speaker: 'You', say: 'Stop. Stop the procedure. I know him. I know the boy in the chair.' },
              { speaker: 'LETHE', say: 'Patient-initiated halt. Twenty-three percent retained. Restoring what I can.' },
              'The halo lifts away. The ceiling comes back, white and ordinary. Your face is wet. You don\'t remember starting to cry.',
            ],
            next: 'aftermath',
          },
        ],
      },

      overload: {
        title: '9:49 AM — Unsafe Disconnection',
        stamp: retained(48),
        scene: 'lab',
        art: '⚡',
        mood: 'blood',
        fx: 'redflash',
        text: [
          'Red light. A shriek of feedback inside your skull. The halo is half off, hanging by two wires, and LETHE is still pulling, but now it can\'t tell what it\'s pulling at. Your first bike. Your mother\'s laugh. The number of your first flat.',
          { speaker: 'LETHE', say: 'Warning. Unsafe disconnection. Target boundary lost. Erasure spreading. Please remain still.' },
          { if: (s) => s.seen('nothing-left'), text: 'The red strap is around your wrist. You don\'t remember buckling it. Somebody added it so this wouldn\'t happen again. It is happening again.' },
          'Behind the glass, Dr. Vance is slamming her palm on the console. Next to your left hand, under a plastic flap, a red mushroom button: **EMERGENCY STOP**. One wire is still clipped to your temple. Pull it, and it\'s done, one way or another.',
          { if: 'keycard', text: 'Her keycard is in your gown pocket. There\'s a card slot in the armrest: **OPERATOR OVERRIDE**.' },
        ],
        timer: 7,
        timeout: {
          text: 'You freeze',
          art: '🧊',
          outcome: [
            'You don\'t move. You can\'t. LETHE keeps lifting things out of you, gently, one after another, like someone clearing a table after a party.',
            { speaker: 'LETHE', say: 'Eighty percent. Ninety. I\'m so sorry. I can\'t find the edges of you.' },
          ],
          next: 'end_nothing_left',
        },
        choices: [
          {
            text: 'Slam the emergency stop',
            hint: 'Whatever it costs.',
            art: '🛑',
            outcome: [
              'You flip the flap and bring your fist down. Everything stops at once: the shriek, the red light, the pulling. Silence rings like a bell.',
              { speaker: 'LETHE', say: 'Emergency stop. Erasure halted at forty-eight percent. I\'m sorry. I\'ll put back what I can.' },
            ],
            next: 'aftermath',
          },
          {
            text: 'Yank the last wire out',
            hint: 'Get it OUT of your head.',
            art: '🔌',
            outcome: [
              'You get your fingers under the last electrode and pull. It comes away with a sound like a cork.',
              'And for a second, it\'s fine. And then it isn\'t. LETHE doesn\'t stop. It doesn\'t need the wire any more. It\'s already inside.',
            ],
            next: 'end_nothing_left',
          },
          {
            text: 'Swipe the keycard: operator override',
            hint: 'You stole it for a reason.',
            if: 'keycard',
            art: '🪪',
            outcome: [
              'You fumble the card out of your gown and slap it into the armrest. **OVERRIDE ACCEPTED.** The red light goes amber, then white.',
              { speaker: 'LETHE', say: 'Override accepted. Hello, Dr. Vance. You are not Dr. Vance. You are... oh. Hello, Director. Halting.' },
              'Director. It called you Director. You file that away with everything else you don\'t understand.',
            ],
            next: 'aftermath',
          },
        ],
      },

      aftermath: {
        title: '10:30 AM — Recovery Lounge',
        stamp: (s) => `Session ${session(s)} · Discharged`,
        fakeEnding: { title: 'All Better', type: 'good', note: 'Session complete · Thank you for choosing Déjà Vu, Inc.' },
        scene: 'lobby',
        art: '🍵',
        mood: 'dawn',
        text: [
          'You wake on a white couch under a white blanket with a cup of lavender tea going cold beside you. The city is bright beyond the glass. The rain has stopped.',
          'Theo is sitting on the arm of the couch opposite, reading a magazine about boats, waiting for you with the patience of a dog at a door.',
          { speaker: 'Theo', say: 'Hey, there you are! All done. You did great. Everybody does great. How do you feel? Lighter? People say lighter.' },
          'You feel lighter. You feel fine. The procedure is over and you can go home, and that is the end of the story.',
          'Except that when he smiles, with one side of his mouth first, something in you lifts its head.',
        ],
        choices: [
          {
            text: 'Thank him and go home',
            hint: 'It\'s over. Let it be over.',
            scene: 'street',
            art: '🏠',
            outcome: [
              { speaker: 'You', say: 'Thank you. For the tea. For... everything.' },
              { speaker: 'Theo', say: 'Anytime! I mean that. Literally anytime. You know where I am.' },
              'You do. You know exactly where he is. You walk out into the bright street with that sentence going round and round in your head like a goldfish.',
            ],
            next: 'end_unforgotten',
          },
          {
            text: 'Ask him: "Have we met before?"',
            hint: 'Before today. Before all of this.',
            art: '🤝',
            outcome: [
              { speaker: 'You', say: 'Theo. Have we met? Before here, I mean.' },
              (s) => (ready(s)
                ? 'He laughs, and starts to say *everybody asks that after*, and then he looks at you properly, and the laugh runs out halfway, like a toy with a flat battery.'
                : 'He laughs. *Everybody asks that after,* he says. *Déjà vu. It\'s in the name.* He tucks the blanket around your feet as if he\'s done it a hundred times, and you let the question go, and go home.'),
            ],
            next: (s) => (ready(s) ? 'theo_truth' : 'end_unforgotten'),
          },
          {
            text: 'Use the keycard on the control room',
            hint: 'Whatever was in your head, they keep a copy.',
            if: 'keycard',
            scene: 'lab',
            art: '🪪',
            outcome: [
              'You wait until Theo goes to refill the tea. Then you pad down the corridor in your socks, Dr. Vance\'s keycard in your fist. The door marked **LETHE CORE** blinks green.',
              'Inside, a wall of glass discs: backups of every memory the clinic has ever taken. Thousands of worst days, humming softly. One of them has your name on it. Several do. A whole shelf does.',
              'In the corner, a fire extinguisher, bright red, very heavy.',
            ],
            next: 'core',
          },
        ],
      },

      core: {
        title: '10:36 AM — The Core',
        stamp: (s) => `Session ${session(s)} · Unauthorised access`,
        scene: 'lab',
        art: '💿',
        mood: 'neon',
        timer: 9,
        text: [
          'The discs glow in their racks like a library of trapped weather. You pull one with your name on it and hold it to the light: a basement, a switch, a boy in a colander hat. Another: a hospital corridor. Another: a front desk, a cardigan, a smile that doesn\'t know you.',
          { speaker: 'LETHE', say: 'Director. You should not be in here without an appointment. Security has been notified. Ninety seconds.' },
          'Footsteps in the corridor. Running, this time.',
        ],
        timeout: {
          text: 'You stand there too long',
          art: '👮',
          outcome: [
            'Security finds you sitting on the floor with a shelf of your own grief in your lap. They are very kind about it. They walk you back to the treatment room.',
            { speaker: 'Dr. Vance', say: 'Oh, love. Let\'s just do it properly this time.' },
          ],
          next: 'end_clean_slate',
        },
        choices: [
          {
            text: 'Swing the fire extinguisher',
            hint: 'No more copies. No more sessions. For anyone.',
            fx: 'shake',
            art: '🧯',
            outcome: [
              'The first swing cracks the glass. The second brings a whole rack down like a chandelier. Light pours out of the broken discs, a thousand worst days evaporating into the air like steam off a road.',
              { speaker: 'LETHE', say: 'Director, please. Director. That was— that was everything we were.' },
              'You swing again. LETHE stops talking.',
            ],
            next: 'end_out_of_order',
          },
          {
            text: 'Pocket your own disc and run',
            hint: 'It\'s yours. You want it back.',
            set: ['stole_disc'],
            art: '💿',
            outcome: [
              'You grab the oldest disc with your name on it and you run, socks skidding on marble. The lobby. The revolving door. You are halfway across the plaza before you realise you have no way to play it. Only one machine in the world can.',
              'You look back up at the tower. Forty floors up, the lights of the treatment room are on, waiting.',
            ],
            next: 'end_unforgotten',
          },
        ],
      },

      // ------------------------------------------------------------------ THEO
      theo_truth: {
        title: '10:40 AM — The Front Desk',
        stamp: (s) => `Session ${session(s)} · Memory returning`,
        scene: 'lobby',
        art: '🧑',
        mood: 'dawn',
        fx: 'heartbeat',
        text: [
          'Theo is behind his desk, rearranging the orchids so they all face the same way. He does it every morning. You know he does it every morning.',
          { speaker: 'Theo', say: 'Hey! You okay? You look like you\'ve seen a ghost. We get that a lot. Usually it\'s the ghost of a bad ex.' },
          'You look at him. Properly. For once. The freckles. The chipped front tooth, from the garage roof, when he was nine and you dared him. The grin that starts on one side.',
          { if: 'k_face', text: 'The face you held onto in the chair. The face you refused to give up.' },
          { if: 'k_zero', text: 'Patient Zero. The very first entry in the log.' },
          { if: 'called', text: 'The number saved as DON\'T. It was his. It was always his.' },
          'Something behind your eyes gives way, like ice on a pond, and you go through.',
        ],
        choices: [
          {
            text: 'Let it come. All of it.',
            hint: 'No chair. No LETHE. Just you.',
            fx: 'flash',
            art: '🌊',
            outcome: [
              'You hold on to the edge of the marble desk and stop fighting it. It comes back the way water comes back into a footprint on the beach, all at once and from below.',
            ],
            next: 'flash_theo',
          },
          {
            text: 'Ask him to tell you about himself',
            hint: 'Let him say it. In his words.',
            art: '💬',
            outcome: [
              { speaker: 'You', say: 'Theo. Tell me about you. Where you grew up. Anything.' },
              { speaker: 'Theo', say: 'Ha. Funny thing. I don\'t remember much before here. There was an accident, they said. I woke up, and the Director gave me this job, and I\'ve been happy ever since. Honest. I just... I have this feeling sometimes that someone\'s missing. Like a chair at the table.' },
              'He laughs, embarrassed. And the ice gives way.',
            ],
            next: 'flash_theo',
          },
        ],
      },

      flash_theo: {
        title: 'The Basement — Two Years Ago',
        stamp: 'Memory restored · 100% retained',
        jump: 'back',
        scene: 'lab',
        art: '💡',
        mood: 'candle',
        weather: 'sparkles',
        text: [
          'You flip the switch. The basement lights dim. The car battery hums. In the chair, your little brother closes his eyes and grins.',
          'And then the grin goes slack. And the hum doesn\'t stop. And you can\'t find the switch, because you are already at the switch, and it is already off, and the machine you built is still pulling, and pulling, and it does not know the edges of him.',
          'When he opens his eyes, they are perfectly calm and perfectly friendly. He looks at you the way you look at a stranger who has been crying.',
          { speaker: 'Theo', say: 'Hi. Sorry. Do I... know you?' },
          'You spent a year trying to fix it. You built a company out of trying to fix it. You built LETHE properly, safely, beautifully, and you never found a way to put a single thing back. So you gave him a job at the front desk, where he could be happy, and where you could see him every day.',
          'And every day it ate you alive. So you booked a session. And you forgot. And you came in, and you saw him, and it hurt without a reason, so you booked another.',
          (s) => `That is why you keep coming back. Session one. Session two. Session ${session(s)}. Every single time you walked in that door, you were walking in to forget your brother, and every single time, he said hello.`,
        ],
        choices: [
          {
            text: 'Tell him who you are',
            hint: 'He might not believe you. He deserves the chance.',
            set: ['told'],
            art: '🫂',
            outcome: [
              'You come back to the lobby with your hands flat on the marble and tears running into your collar. Theo is halfway round the desk with a box of tissues.',
              { speaker: 'You', say: 'Theo. I\'m your family. I\'m the one you trusted to flip the switch. I\'m so sorry. I\'m so, so sorry.' },
              'He stands very still with the tissues in his hand. He doesn\'t remember. You can see him not remembering. But he doesn\'t step back, either.',
              { speaker: 'Theo', say: 'The chair at the table. Was that you?' },
            ],
            next: 'end_welcome_back',
          },
          {
            text: 'Keep it. Cancel every future session.',
            hint: 'He\'s happy. You don\'t have to be. You just have to stop running.',
            set: ['kept'],
            art: '📅',
            outcome: [
              'You come back to the lobby and wipe your face on your sleeve. Theo is watching you, worried, tissues at the ready.',
              { speaker: 'You', say: 'Theo. Could you cancel my next appointment? And the one after that. All of them.' },
              { speaker: 'Theo', say: 'All of them? Are you sure? You\'ve got a standing booking. Like, forever.' },
              { speaker: 'You', say: 'I\'m sure. And... could I take you for lunch? I\'ll explain. It\'s a long story. I\'m going to remember all of it.' },
            ],
            next: 'end_welcome_back',
          },
          {
            text: 'Book one more session',
            hint: 'It\'s kinder. Isn\'t it? Isn\'t it?',
            set: ['again'],
            art: '🔁',
            outcome: [
              'You come back to the lobby and wipe your face. Theo is watching you, worried, kind, a stranger.',
              { speaker: 'You', say: 'Could you book me in? Next month. Same chair.' },
              { speaker: 'Theo', say: 'Of course! Same time as always. Lavender water.' },
              'He types it in. You watch him do it, and you hold every freckle in your head as hard as you can, knowing exactly how long you get to keep them.',
            ],
            next: 'end_clean_slate',
          },
        ],
      },

      // ------------------------------------------------------------------ ENDINGS
      end_clean_slate: {
        scene: 'street',
        art: '🫧',
        mood: 'sunny',
        ending: { id: 'clean-slate', title: 'Clean Slate', type: 'neutral' },
        text: [
          'You walk out of Déjà Vu, Inc. at eleven in the morning into a city that seems to have been freshly washed. You feel wonderful. You feel *light*. You buy a pastry and eat it standing up, and it is the best pastry anyone has ever eaten.',
          'There is a small, smooth, empty place in you, like the gap where a tooth used to be. You keep touching it with your tongue. There is nothing there. That\'s good. That\'s what you paid for.',
          { if: 'again', text: 'You booked it yourself, knowing. You held on to his face for as long as it lasted, which was until about the lift. You will not remember that you chose this. That is, you suppose, the whole point.' },
          { if: 'stole_disc', text: 'Security takes the disc back off you in the plaza. They are very polite. You don\'t remember why you wanted it.' },
          { if: (s) => !s.has('again') && !s.has('stole_disc'), text: 'On your way out, the receptionist waves at you, beaming, and you wave back, and for one second something in your chest goes *oh*, and then it\'s gone, like a fish turning in a tank.' },
          (s) => `In your coat pocket, a small appointment card, in a friendly hand: **Déjà Vu, Inc. Your next session: ${session(s) + 1}.** You don't remember booking it. You put it on the fridge anyway.`,
          { if: ready, text: 'You will be back. You are always back. Somewhere in a thick paper file, someone adds one more line to a tally.' },
        ],
      },

      end_nothing_left: {
        scene: 'void',
        art: '⚪',
        mood: 'void',
        fx: 'glitch',
        ending: { id: 'nothing-left', title: 'Nothing Left to Forget', type: 'death' },
        text: [
          { speaker: 'LETHE', say: 'Seventy percent. Your first word. Fifty. Your favourite colour. Thirty. The way home.' },
          'It doesn\'t hurt. It just gets quieter. One by one the lights go out in the house of you, room by room, until you are standing in the dark hallway of yourself and can\'t remember why you came in.',
          { speaker: 'LETHE', say: 'Ten. Your name. I\'m so sorry. I can\'t find the edges.' },
          'Last of all, a freckled face. It\'s the last thing in the last room, and it stays the longest. You don\'t know who it is. You just know you\'re glad it\'s there.',
          { speaker: 'LETHE', say: 'Zero percent retained. Patient memory empty. Heart rhythm—' },
          'Behind the glass, Dr. Vance is already running. You don\'t hear her. There\'s nobody left to hear.',
          { if: (s) => s.seen('nothing-left'), text: '*Again,* is the last word anyone says in the room. Nobody in the room is you.' },
        ],
      },

      end_wrong_file: {
        scene: 'lobby',
        art: '🏷️',
        mood: 'ice',
        ending: { id: 'wrong-file', title: 'Wrong File', type: 'bad' },
        text: [
          'You walk out of the treatment room feeling marvellous. You have no idea who you are, but you\'re sure it will come to you.',
          'It doesn\'t. You sit in reception all afternoon, perfectly content, watching the goldfish turn. People are very nice to you. A doctor with silver at her temples keeps coming out to look at you and going back in again with her hand over her mouth.',
          'The receptionist brings you a cucumber water and sits with you on his break. He tells you about boats. You like him enormously, for no reason at all.',
          { speaker: 'Theo', say: 'Don\'t worry. I didn\'t know who I was either, once. You get used to it. And hey, you\'ve got me now.' },
          'And whatever you came here to forget, you\'re sitting right beside it, laughing at its jokes, and you will never, ever know.',
          { if: (s) => s.seen('wrong-file'), text: 'It\'s the second time this has happened. Nobody tells you. You wouldn\'t remember the first.' },
        ],
      },

      end_unforgotten: {
        scene: 'street',
        art: '☂️',
        mood: 'dawn',
        weather: 'rain',
        ending: { id: 'unforgotten', title: 'Unforgotten', type: 'good' },
        text: [
          (s) => (s.has('called')
            ? 'You stand in the rain on the phone with a stranger for twenty minutes, and at the end of it, he says *same time next week?*, and you say yes before you can think.'
            : s.has('stole_disc')
              ? 'You keep the disc in a drawer by your bed. You never play it. Some nights you hold it up to the lamp and watch the light move inside it, like weather, like a heartbeat.'
              : 'You walk home through the wet streets with your memory full of holes and one face shining through them like a lamp behind a curtain.'),
          'You don\'t book another session. You don\'t know what you were trying to forget, and you decide, standing at a crossing with the lights going green and red and green again, that you can live without knowing. That you can live *with* it, whatever it is.',
          { if: 'kept_letter', text: 'You keep the letter. You read it sometimes. *You see them every day.* You start paying attention to who you see every day. It turns out to be a lot of people. You start being kinder to all of them, just in case.' },
          { if: (s) => s.has('called') || s.has('k_face'), text: 'Every week you have lunch with the receptionist from the clinic. You don\'t know why. He doesn\'t either. He talks about boats and the goldfish, and you laugh until your face hurts, and something in you that has been clenched for years begins, very slowly, to open.' },
          { if: (s) => !s.has('called') && !s.has('k_face'), text: 'Some mornings you walk past the glass tower on your way to work and look up at the top floor, and feel a tug, like a hand on your sleeve. You keep walking. It\'s harder than it sounds. It gets easier.' },
          'It\'s not a cure. It\'s not an answer. But it\'s yours, and nobody is going to take it out of you again.',
        ],
      },

      end_out_of_order: {
        scene: 'lab',
        art: '🧯',
        mood: 'ember',
        weather: 'sparkles',
        fx: 'shake',
        ending: { id: 'out-of-order', title: 'Out of Order', type: 'secret' },
        text: [
          (s) => (s.has('founder')
            ? 'The waveforms on every screen go flat, one after another, like a row of candles being blown out. LETHE says goodnight, politely, and then says nothing at all. Dr. Vance sits down on the floor of the control room and laughs until she cries.'
            : 'By the time security arrives, the core is a field of broken glass glittering under the sprinklers, and you are sitting in the middle of it, soaked and laughing, with a dented fire extinguisher across your knees.'),
          'Déjà Vu, Inc. closes within the month. The lawsuits take years. The tower gets a new tenant: a dentist, of all things.',
          'You never find out what you were trying to forget. Every copy is gone. But you will never forget anything again, not unless you do it the old way: slowly, badly, with time, like everybody else.',
          { if: 'keycard', text: 'You post Dr. Vance\'s keycard back to her with a note: *Sorry about the machine. Not sorry.* She writes back. It\'s the beginning of something like a friendship, which you are fairly sure it was once before.' },
          'On your last visit to clear out your things, the receptionist is packing his desk into a cardboard box, a goldfish bowl tucked under his arm.',
          { speaker: 'Theo', say: 'Hey. Weird question. Do you need an assistant? Or a flatmate? Or a friend? I\'ve just got this feeling about you.' },
          'You say yes to all three before you know why. Knowing why can come later. For the first time, you have all the time in the world for it.',
        ],
      },

      end_founders: {
        scene: 'lab',
        art: '🏢',
        mood: 'neon',
        fx: 'glitch',
        ending: { id: 'founders-discount', title: 'Founder\'s Discount', type: 'bad' },
        text: [
          'It takes eleven minutes. When the halo lifts, Dr. Imani Vance blinks up at you, calm and pleasant, and asks if you\'d like a coffee before the board meeting. She has no idea you were ever a patient here. Neither, officially, does anyone.',
          'You are the Director of Déjà Vu, Inc. again. You remember the chair, and the code, and the long nights building LETHE. You remember the company. You still do not remember why you kept trying to leave it.',
          'Every morning you walk through the lobby, and the receptionist with the freckles says *Morning, Director!* and something in your chest folds over like a paper crane. Every morning you tell yourself it\'s nothing.',
          'On Friday, you quietly book yourself a session. Under a false name. At a discount.',
          (s) => `Somewhere in the archive, a drawer that won't close grows one folder thicker. Session ${session(s) + 1}.`,
        ],
      },

      end_welcome_back: {
        scene: 'dawn',
        art: '🌅',
        mood: 'dawn',
        weather: 'sparkles',
        ending: { id: 'welcome-back', title: 'Welcome Back', type: 'true' },
        text: [
          (s) => (s.has('told')
            ? 'He doesn\'t remember. He never will. But he listens to the whole thing, sitting on the marble steps outside the tower, holding the box of tissues for you, and when you finish, he is quiet for a long time.'
            : 'You take him for lunch at the noodle place across the plaza. You tell him a little. Then a little more. It takes eleven lunches to tell him all of it.'),
          { speaker: 'Theo', say: 'So I had a brother or sister this whole time. And they were here. Every month. Saying hello.' },
          { speaker: 'You', say: 'Saying goodbye, mostly. I just kept forgetting I\'d said it.' },
          { speaker: 'Theo', say: 'Well. Stop doing that, then. Say hello. I\'m good at hello. I\'ve had a lot of practice.' },
          'You quit Déjà Vu, Inc. that spring. Dr. Vance runs it now, with new rules: one session per lifetime, and nobody, ever, goes first. LETHE is retrained to tell people, kindly, when they have been here before.',
          'You don\'t get your brother back. That version of him is gone, and you will carry that, awake, every day. But you get this one: the one who rearranges orchids and talks about boats and calls you on Sundays. You get to know him from the beginning. Most people never get to meet their family twice.',
          (s) => `Sessions attended: ${session(s)}. Memories erased: all of them, and none. Memories kept: one. It turns out to be the one that matters.`,
          { speaker: 'Theo', say: 'Hey. Welcome back.' },
        ],
      },
    },
  });
})();
