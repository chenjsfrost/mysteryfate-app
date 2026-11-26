/* MysteryFate story: Floor 13 (horror) */
(function () {
  'use strict';

  // Sanity helper: adds n and clamps to 0..5.
  const S = (n) => (s) => s.setVar('sanity', Math.max(0, Math.min(5, s.get('sanity') + n)));
  const secretReady = (s) => s.has('has_key') && s.has('has_lease') && !s.has('broke_rule');

  registerStory({
    id: 'floor-13',
    title: 'Floor 13',
    category: 'horror',
    tagline: "The elevator stopped at a floor that doesn’t exist.",
    description:
      "It’s 3:33 AM and the Halvorsen’s elevator just skipped your floor. Floor 13 is warm, polite, and very glad you’re home. Learn its rules, decide what the little girl in the yellow dress really is, and find out how many times you have to ask to leave.",
    cover: '🛗',
    accent: '#c9a227',
    ambient: 'horror',
    warning: 'Contains: psychological horror, grief, implied death, a child in peril.',
    vars: { sanity: 4 },
    flags: [],
    hud: [{ var: 'sanity', label: 'Sanity', icon: '🧠', max: 5 }],
    scene: 'corridor',
    voices: {
      narrator: { gender: 'female', pitch: 0.88, rate: 0.93, accent: 'en-US', note: 'low, hushed late-night storyteller' },
      'Girl': { gender: 'female', pitch: 1.7, rate: 1.1, note: 'bright little girl, a touch too cheerful (Wren before she names herself)' },
      'Wren': { gender: 'female', pitch: 1.7, rate: 1.05, volume: 0.8, note: 'seven-year-old ghost, sweet, sometimes very old' },
      'The Concierge': { gender: 'male', pitch: 0.65, rate: 0.82, accent: 'en-GB', note: 'unctuous, menacing, smiling doorman, low and slow' },
      'Mom': { gender: 'female', pitch: 0.95, rate: 0.85, volume: 0.65, note: 'tired, loving, whispering from the dark' },
      '???': { gender: 'neutral', pitch: 0.75, rate: 0.8, volume: 0.6, note: 'the thing that wears your mother’s voice, whisper' },
    },
    start: 'intro',
    scenes: {
      // ------------------------------------------------------------------ ACT I
      intro: {
        scene: 'lobby',
        title: '3:33 AM — The Halvorsen Lobby',
        art: '🌧️🏢',
        mood: 'night',
        weather: 'rain',
        text: [
          'Your shift ran long. It always runs long.',
          "The Halvorsen’s lobby smells like wet carpet and old radiator heat. The clock above the bricked-up fireplace says **3:33**. The second hand isn’t moving.",
          "You’ve lived here eleven days. Twelfth floor, apartment 1207. You still haven’t seen a single neighbor’s face. The building is that kind of quiet — the kind that feels arranged.",
          "The elevator is already waiting for you, doors open, lit a soft and honeyed gold. You didn’t call it.",
          'Somewhere far above you, very faintly, a music box is playing.',
        ],
        choices: [
          {
            text: 'Take the elevator.',
            hint: "It’s right there. It’s warm. You’re so tired.",
            art: '🛗',
            scene: 'elevator',
            outcome: [
              'You step inside. The carpet is thick and red and gives under your shoes like moss.',
              "The doors slide shut behind you without a sound. No hum, no grinding cables. Just the quiet of a held breath — the building’s, or yours.",
            ],
            next: 'elevator',
          },
          {
            text: 'Take the stairs.',
            hint: 'Twelve flights. Your legs hate you. The elevator feels wrong.',
            art: '🪜',
            scene: 'stairwell',
            outcome: [
              "You walk past the open elevator. As you pass, you could swear the doors lean toward you — a fraction, a hair — the way a person leans in when you’ve walked by without saying hello.",
              'The stairwell door groans. The green EXIT light buzzes. You start climbing.',
            ],
            next: 'stairwell',
          },
          {
            text: 'Check your mailbox first.',
            hint: "You haven’t opened it since you moved in.",
            set: ['welcome_note'],
            art: '✉️',
            outcome: [
              'Box 1207 holds one cream envelope, heavy as cloth, sealed with a blob of maroon wax. Inside, a card in beautiful copperplate: *Welcome home, new tenant. Your floor is ready. — The Concierge.*',
              "The Halvorsen doesn’t have a concierge. The Halvorsen has a landlord who is a voicemail box.",
              "Then you notice the last mailbox in the row. **1313**. There is no thirteenth floor. Its little glass window is fogged from the inside — clearing, fogging, clearing — like someone very small is breathing on it. You back away into the waiting elevator before you can decide not to.",
            ],
            next: 'elevator',
          },
        ],
      },

      elevator: {
        scene: 'elevator',
        title: 'The Car',
        art: '🛗',
        mood: 'candle',
        text: [
          'You press **12**. The button lights, then quietly goes dark again, as if it changed its mind.',
          "The car rises. *10. 11. 12.* It doesn’t slow down. Your stomach drops the way it does on a plane.",
          'On the panel, below the alarm bell, is a button that was not there a second ago. It is glowing. It says **13**.',
          { if: 'welcome_note', text: 'The envelope crinkles in your jacket. *Your floor is ready.*' },
          'Screwed to the wall beside the panel is a yellowed laminated notice. Below it, a little brass door marked EMERGENCY, with an old handset inside.',
          'You have maybe ten seconds before whatever happens next happens.',
        ],
        choices: [
          {
            text: 'Read the laminated notice.',
            hint: 'Rules. Places like this always have rules.',
            set: ['read_notice'],
            art: '📋',
            outcome: [
              "The laminate is cloudy with age and someone’s thumbprints. You squint.",
              '**RESIDENT COURTESIES — FLOOR 13.** *1. Do not answer when it calls your name. 2. Do not look into the mirror at the end of the hall. 3. Do not sign anything. You are already expected. 4. The car returns only for those who know how many times to ask.*',
              'Below the printed rules, scratched into the plastic with a key: **SHE IS NOT WHAT SHE SAYS.** And under that, in a different, shakier hand: **YES SHE IS.**',
            ],
            next: 'hall_arrival',
          },
          {
            text: 'Pick up the emergency phone.',
            hint: 'Someone, anyone, has to be on the other end.',
            set: ['knows_three'],
            effect: S(-1),
            art: '☎️',
            outcome: [
              "There’s no dial tone. There’s breathing. Small, wet, patient breathing.",
              'Then a little girl starts to sing, sweet and slightly off-key: *“Once for the living, twice for the dead — three for the sleepers who go home to bed.”*',
              "A pause. Then, in a normal, bright voice: *“Are you the new tenant?”* The line goes dead. The handset is warm, like it’s been held for hours.",
            ],
            next: 'hall_arrival',
          },
          {
            text: 'Hammer the 12 button.',
            hint: 'Make it listen.',
            effect: S(-1),
            fx: 'shake',
            art: '👊',
            outcome: [
              'You jab it. Again. Again. Twelve, twelve, twelve, *TWELVE.*',
              'On the ninth press the button goes soft under your thumb. Warm. Yielding. It feels exactly like pressing on a fingertip — and the fingertip presses back.',
              'You snatch your hand away. A pleasant recorded voice says, *“Thirteen.”* It is not a recording. You can hear it smile.',
            ],
            next: 'hall_arrival',
          },
        ],
      },

      stairwell: {
        scene: 'stairwell',
        title: 'Stairwell B',
        art: '🪜',
        mood: 'night',
        weather: 'dust',
        text: [
          'Concrete steps. Iron rail cold enough to sting. Floor numbers stenciled on every landing: *9. 10. 11.*',
          "At the twelfth landing, the door that should say **12** says **13**. The paint is wet. You can see the old 12 underneath, like a bruise under makeup.",
          'The lullaby is louder here, coming through the door. Beside the frame, someone has gouged words into the cinderblock — deep, desperate scratches.',
          'And below you, footsteps begin to climb. Slow. Heavy. They match your rhythm exactly. When you stopped to stare at the door, *they stopped too.*',
        ],
        choices: [
          {
            text: 'Push through the door marked 13.',
            hint: 'Anything is better than whatever is on the stairs.',
            art: '🚪',
            outcome: [
              'You shove the bar. The wet paint comes away on your palm, red-brown and warm.',
              'You stumble through into heat and gold light. Behind you the footsteps break into a run — and the door swings shut on them with a soft, satisfied click.',
            ],
            next: 'hall_arrival',
          },
          {
            text: 'Read the scratches first.',
            hint: 'Someone wanted the next person to know something.',
            set: ['heard_rhyme'],
            art: '✍️',
            outcome: [
              '**ONCE FOR THE LIVING. TWICE FOR THE DEAD. THREE FOR THE —**',
              "The rest is gone, clawed over and over until the block is powder. There’s a fingernail lodged in the last groove. A whole one.",
              'The footsteps are one flight below you now. You can hear them breathing. You go through the door.',
            ],
            next: 'hall_arrival',
          },
          {
            text: 'Keep climbing past it.',
            hint: 'Fourteen is up there somewhere. It has to be.',
            effect: S(-1),
            fx: 'glitch',
            art: '🔁',
            outcome: [
              'You take the stairs two at a time. Next landing: **13**, wet paint. Next: **13**. Next: **13**, and the footsteps are no longer below you.',
              'They are *above* you. Coming down.',
              'You throw yourself through the nearest door marked 13. It is, you are fairly sure, the same door. It has always been the same door.',
            ],
            next: 'hall_arrival',
          },
        ],
      },

      // ----------------------------------------------------------------- THE FLOOR
      hall_arrival: {
        scene: 'corridor',
        title: 'Floor 13',
        art: '🚪🕯️🚪',
        mood: 'candle',
        fx: 'heartbeat',
        text: [
          'A hallway. Too long — far longer than the building is wide. Brass sconces with fringed shades pour honey light onto carpet the color of a tongue.',
          'The wallpaper is faded roses. And it is **moving**. Slowly. In, and out. In, and out. The whole hallway is breathing, and the air is warm and damp, like the inside of a mouth.',
          'Halfway down, a little girl sits cross-legged on the carpet. Yellow dress. White socks. Patent leather shoes. A music box in her lap. She looks up at you and her face lights up.',
          { speaker: 'Girl', say: "Hi! I’m Wren. I’ve been waiting for the new tenant. You’re late — Mama always said tenants are late." },
          'She hops up and skips down the hall to the last door, **1313**, and slips inside. The lullaby swells behind it.',
          'You turn around. The door you came through is gone. Just roses. Breathing.',
          { if: 'read_notice', text: 'Four rules. You mouth them to yourself like a prayer: *don’t answer, don’t look, don’t sign, know how many times.*' },
          'Somewhere down the hall, a bell rings once — the polite little *ting* of a hotel front desk. Someone is ready to see you.',
        ],
        choices: [
          {
            text: 'Follow Wren to 1313.',
            hint: "She’s a kid. She’s alone in here.",
            art: '🎀',
            outcome: [
              'You walk toward the lullaby. The carpet is soft. Too soft. Each step sinks a little deeper than the last, and when you lift your foot there is a faint wet sound, like a kiss.',
              'The brass numbers on 1313 are tarnished green. The music stops the moment you raise your hand to knock.',
            ],
            next: 'wren_door',
          },
          {
            text: 'Follow the sound of the bell.',
            hint: 'Whoever rang it runs this place.',
            art: '🛎️',
            outcome: [
              'You follow the ting. The sconces turn to watch you go — you’re sure of it; the fringed shades swivel, very slightly, as you pass.',
              'Around a corner that should not exist, a warm green light is waiting.',
            ],
            next: 'concierge_desk',
          },
          {
            text: 'Walk to the end of the hall, away from all of it.',
            hint: 'Away from the girl, away from the bell. There has to be another way out.',
            art: '🚶',
            outcome: [
              'You turn your back on 1313 and walk the other way. The lullaby follows you, a little quieter with every step, like a child sulking.',
              "You count the doors as you go. You stop counting when the numbers stop making sense.",
            ],
            next: 'hall_end',
          },
          {
            text: 'Feel along the wallpaper for the elevator.',
            hint: 'It was right here. It has to still be right here.',
            effect: S(-1),
            art: '🖐️',
            outcome: [
              "You press both palms where the doors were. The wallpaper is warm. Under your hands, it **pulses** — slow, steady, a heartbeat.",
              'A bump rises under the paper like a blister, round and hard. A button. You press it. Nothing happens, except that something behind the wall sighs.',
              'Then, from right behind your left ear, a pleasant voice: *“Leaving so soon?”*',
            ],
            next: 'concierge_escort',
          },
        ],
      },

      concierge_escort: {
        scene: 'corridor',
        title: 'The Concierge',
        art: '🎩',
        mood: 'ember',
        fx: 'flash',
        text: [
          'You spin around. A man in a maroon doorman’s livery stands close enough to touch. Brass buttons. White gloves. A pillbox cap. He’s tall — slightly too tall; he stoops a little beneath the sconces.',
          'His face is pleasant. Middle-aged. Forgettable. Then he smiles, and the smile **keeps going** — past where smiles stop, the corners creeping almost to his ears. Rows of small, even teeth. Too many. Like a child’s, but more.',
          { speaker: 'The Concierge', say: "Welcome to the thirteenth, tenant. We’ve had your floor ready for ever so long. The car isn’t running just now, I’m afraid. Shall I see you to the desk? Only a small matter of a signature." },
          { if: 'welcome_note', text: 'You realize you are still holding his envelope. He notices too. His smile widens another tooth.' },
          'His gloved hand settles on your shoulder. It weighs nothing at all. As if there is no hand inside the glove.',
        ],
        choices: [
          {
            text: 'Let him walk you to his desk.',
            hint: 'Play along. Learn the rules from the man who made them.',
            art: '🤝',
            outcome: [
              'He steers you down the hall with that weightless glove. He hums as he walks. He doesn’t breathe between phrases.',
              '*“You’ll find the thirteenth very restful,”* he says. *“Nobody here has worked a night shift in sixty years.”*',
            ],
            next: 'concierge_desk',
          },
          {
            text: 'Duck under his arm and run for 1313.',
            hint: 'The girl. The girl might know a way out.',
            effect: S(-1),
            fx: 'shake',
            art: '🏃',
            outcome: [
              'You duck and sprint. The hallway stretches under your feet like taffy — the door to 1313 getting farther before it gets closer.',
              "Behind you he doesn’t chase. He just laughs, warm and indulgent, the way you laugh at a dog that’s gotten out of the yard. *“She’ll like you,”* he calls. *“They always like the new ones.”*",
            ],
            next: 'wren_door',
          },
          {
            text: 'Ask him, flat out: “What is this place?”',
            hint: "He’s polite. Maybe he has to answer.",
            set: ['eyes_clue'],
            art: '❓',
            outcome: [
              '*“Why, it’s home,”* he says, sounding genuinely hurt. *“Where everyone ends up who is tired enough.”*',
              'He leans in. His breath smells like old paper and pennies. *“A courtesy of the house, tenant: when the lights go, close your eyes. Some of our residents are shy.”*',
              'He gestures down the hall with one long glove. *“The end of the hall has a lovely view.”* When you look back, he is gone, and the sconces nearest you are swaying as if someone tall just walked under them.',
            ],
            next: 'hall_end',
          },
        ],
      },

      // ------------------------------------------------------------- THREAD A: 1313
      wren_door: {
        scene: 'apartment',
        title: 'Apartment 1313',
        art: '🎀🧸',
        mood: 'candle',
        enter: { set: ['visited_wren'] },
        text: [
          'The door swings open on its own before you knock.',
          "A child’s bedroom from another century. Pink candlewick bedspread. A rocking horse. A calendar on the wall: **OCTOBER 1961**. Every day is crossed off in red crayon — and then the X’s keep going, off the calendar, across the wallpaper, up the walls, over the ceiling. Thousands of them. Tens of thousands.",
          'A record player turns in the corner. There is no record on it. The lullaby plays anyway.',
          'Wren sits on the bed swinging her feet, music box in her lap. On its lid a tiny ballerina stands frozen mid-twirl. The ballerina has no face.',
          { speaker: 'Wren', say: "You came in! Most tenants don’t come in. Mama went to get help. That was a long time ago. Do you know what year it is?" },
          'Behind you, the door eases shut by itself. *Click.*',
        ],
        choices: [
          {
            text: 'Kneel down and tell her the year, gently.',
            hint: "She’s a lost kid. Treat her like one.",
            set: ['wren_trust'],
            art: '🫂',
            outcome: [
              'You tell her. She starts counting on her fingers. She runs out of fingers and keeps counting, and her fingers keep bending, past the knuckles, past where fingers go, until you put your hand over hers to make her stop.',
              '*“That’s a lot,”* she whispers. *“That’s so many.”* She cries without a sound. Her tears are dry and gray and fall like dust.',
              'Her hand is cold as the inside of a freezer. But it holds yours back.',
            ],
            next: 'wren_room',
          },
          {
            text: 'Ask her what she really is.',
            hint: 'Children are not supposed to live on floors that do not exist.',
            effect: S(-1),
            fx: 'glitch',
            art: '👁️',
            outcome: [
              'She stops swinging her feet. *“I’m Wren.”*',
              '*“No. What are you?”*',
              'For one frame — like a skipped splice in old film — her face is not a face. It is the hallway: roses and sconces and doors, going back and back forever. Then she is a little girl again, lower lip trembling. *“That’s rude. **He** asks me that. Are you like him?”*',
            ],
            next: 'wren_room',
          },
          {
            text: "Stay in the doorway. Don’t cross the threshold.",
            hint: 'Old rule. Never go in unless you’re sure you can come out.',
            art: '🚪',
            outcome: [
              'You catch the door with your foot and keep your toes behind the line of the frame.',
              'Wren tilts her head. *“Smart,”* she says — and the way she says it is very, very old. *“The last tenant didn’t know about doors.”*',
              'She pats the bed beside her. You do not move. The door, after all, does not close. It waits with you.',
            ],
            next: 'wren_room',
          },
        ],
      },

      wren_room: {
        scene: 'apartment',
        title: 'The Music Box',
        art: '🎶📦',
        mood: 'candle',
        text: [
          'Wren holds up her music box. On its side is a tiny empty keyhole, shaped like a butterfly.',
          { speaker: 'Wren', say: "It’s broken. He took my key. He keeps all the keys. If you wind it, it plays the *real* song. Not the floor’s song." },
          'The floor’s song. The one on the record player. You realize now it has been the same eight notes over and over since you arrived — and every time it repeats, it is very slightly slower. Like something winding down. Or something falling asleep.',
          { if: 'wren_trust', text: 'She leans against your arm. Her head is light as a bird’s.' },
          'Under the bed, the corner of a manila folder sticks out, stamped with the Halvorsen letterhead. Above the bed, her crayon drawings are pinned in a row: a tall man with a smile drawn to his ears. An elevator. A mirror with a face in it, scribbled out so hard the paper tore.',
          'The record skips. Far down the hall, a bell rings. Wren’s head snaps toward the sound — too fast, all the way around. *“He knows you’re here. Quick.”*',
        ],
        choices: [
          {
            text: 'Promise her you’ll find the key.',
            hint: 'Whatever she is, she wants out as badly as you do.',
            set: ['wren_trust'],
            art: '🤞',
            outcome: [
              '*“Promise promise?”* She draws a cross over your heart with one cold finger. It leaves a line of frost on your shirt that does not melt.',
              '*“If you find it, come back and wind me.”*',
              'Wind *me*. Not *it*. You let that go. You have to.',
            ],
            next: 'after_thread',
          },
          {
            text: 'Grab the folder from under the bed.',
            hint: 'Paperwork. Places like this run on paperwork.',
            set: ['has_lease'],
            effect: (s) => { if (!s.has('wren_trust')) S(-1)(s); },
            art: '📁',
            outcome: [
              '**LEASE AGREEMENT — THE HALVORSEN.** *Unit 1313. Leaseholder: Mrs. June Aldous. Occupant: Wren Aldous, age 7. Term: IN PERPETUITY.*',
              "June’s signature trails off the bottom of the page in one long scratch, as if she was pulled away mid-name. Wren’s name is printed underneath in careful purple crayon. The line for the building is signed *The Concierge* — except the signature is just a drawing of a smile.",
              {
                if: 'wren_trust',
                text: 'Wren watches you fold it into your jacket. *“That’s Mama’s,”* she says softly. *“Keep it safe.”*',
                else: 'When you look up, Wren is standing right beside you. You never heard her move. *“That’s not yours,”* she says, flat as a coin. Then she smiles. *“But okay.”*',
              },
            ],
            next: 'after_thread',
          },
          {
            text: 'Study her drawings.',
            hint: 'Kids draw what they know.',
            set: ['knows_three', 'eyes_clue'],
            art: '🖍️',
            outcome: [
              'The elevator drawing: a fat crayon finger on a button. Three big dots. Then a huge yellow sun with a smile. Underneath, in wobbly capitals: **ONE TWO THREE GO HOME.**',
              'The next: a hallway scribbled solid black, and a stick figure with its eyes drawn as two careful lines. **SHUT EYES WHEN DARK. HE CANT SEE SHUT EYES.**',
              'The last one is the mirror. Up close you can see what she scribbled out: a woman’s face, mouth open. Beside it, very small: *mama*.',
            ],
            next: 'after_thread',
          },
        ],
      },

      // ------------------------------------------------------------ THREAD B: DESK
      concierge_desk: {
        scene: 'lobby',
        title: 'The Front Desk',
        art: '🛎️📖',
        mood: 'ember',
        enter: { set: ['visited_desk'] },
        text: [
          'An alcove you did not pass on your way in. A mahogany desk. A green banker’s lamp. A brass bell. Behind it, a wall of pigeonholes holding hundreds of keys, each on a numbered brass tag, all of them very gently swaying.',
          {
            if: (s) => s.has('eyes_clue') || s.has('wren_trust') || s.has('has_key') || s.has('has_lease') || s.has('knows_three'),
            text: 'The Concierge is already behind the desk, cap tilted, smile stretched ear to ear. As if he never left. As if he has been standing here since 1961.',
            else: 'Behind the desk stands a man in maroon livery — brass buttons, white gloves, a pillbox cap — slightly too tall for the alcove. His face is pleasant and forgettable until he smiles, and the smile **keeps going**, corner to ear, small even teeth in rows. Too many.',
          },
          { speaker: 'The Concierge', say: 'Ah. Tenant. Everything is prepared.' },
          'He turns the register toward you — a ledger thick as a family Bible. Your full name is already typed on the newest line. Tonight’s date. A blank for your signature. A fountain pen rests in the gutter of the page.',
          { speaker: 'The Concierge', say: 'One small signature and you’ll have your key. A warm bed. No more night shifts. No more alarms. No more being so very, very tired.' },
          { if: 'read_notice', text: '*Do not sign anything. You are already expected.*' },
          'And God, you are tired. The pen is in your hand. You don’t remember picking it up.',
        ],
        choices: [
          {
            text: 'Sign. Just sign, and sleep.',
            hint: 'It would feel so good to stop.',
            set: ['signed', 'broke_rule'],
            effect: S(2),
            fx: 'redflash',
            art: '✒️',
            outcome: [
              'The ink is warm and red-brown and smells like a cut lip. Your signature comes out in the handwriting you had when you were seven.',
              'Relief floods you like a hot bath. Your hands stop shaking for the first time all night. He presses a key into your palm, its brass tag stamped **1312**.',
              '*“Welcome home,”* he says, and his smile widens until you hear something in his jaw creak. *“We’ll see about your uniform.”* Uniform. You almost ask. You are too comfortable to ask.',
            ],
            next: 'after_thread',
          },
          {
            text: 'Put the pen down. Ask how to leave.',
            hint: 'Polite. Firm. Like returning a sweater.',
            art: '🖊️',
            outcome: [
              'You set the pen down. His smile doesn’t falter. It never falters.',
              '*“Everyone asks,”* he sighs, fondly. *“The car returns for those who know how to ask. How many times does one knock to be let in, tenant? How many times to be let out?”*',
              'He hums a phrase of the lullaby — and stops short, just before the end, like a man snapping a book shut on the last page. *“Excuse me a moment.”* He turns to his pigeonholes.',
            ],
            next: 'desk_ledger',
          },
          {
            text: 'Ring the bell yourself.',
            hint: 'Two can play hotel.',
            effect: S(-1),
            fx: 'shake',
            art: '🛎️',
            outcome: [
              '*Ting.*',
              'Every door in the hallway opens one inch at once. In every gap, at exactly the height of your eyes, there is an eye. They all blink together. The doors close.',
              'The Concierge’s smile does not move, but his voice drops an octave. *“That,”* he says, *“is* **my** *bell.”* He turns to his pigeonholes to compose himself, gloves trembling over the keys.',
            ],
            next: 'desk_ledger',
          },
        ],
      },

      desk_ledger: {
        scene: 'lobby',
        title: 'The Register',
        art: '📖🔑',
        mood: 'ember',
        text: [
          'His back is to you. White gloves move over the pigeonholes, touching tags, humming. The ledger lies open under the green lamp.',
          'The wallpaper breathes, and the pages turn in its breath — back, back, back. *1998. 1974. 1961.* Every line a name. Every name signed. Some signatures get shakier down the page, until they are just lines.',
          'The pages stop on **Unit 1313**. *June Aldous. Wren Aldous. IN PERPETUITY.* Above it, in the pigeonholes, the hook for 1313 is empty.',
          'On the facing page, a single entry with a faded photograph glued beside it: *E. Bell — Tenant, 1958. Promoted to Staff, 1961.*',
          'The humming stops. Without turning around, he says: *“Almost done, tenant.”*',
        ],
        choices: [
          {
            text: 'Tear out the 1313 page.',
            hint: 'If it’s on paper, it can be taken.',
            set: ['has_lease'],
            fx: 'redflash',
            art: '📄',
            outcome: [
              'You rip it out. The sound is enormous — not paper tearing but something *screaming*, and all down the hall the wallpaper flinches, roses curling shut.',
              'You fold the page into your jacket with numb fingers. The Concierge has stopped moving. Entirely. Like a photograph of a man.',
            ],
            next: 'desk_caught',
          },
          {
            text: 'Read the page about E. Bell.',
            hint: 'Staff. Promoted. From what?',
            set: ['knows_concierge'],
            effect: S(-1),
            art: '🖼️',
            outcome: [
              'The photograph shows a young man in a cheap suit, hair slicked, a normal smile with a normal number of teeth. *Tenant, 1958.* He looks tired. He looks like you.',
              'You look up at the Concierge — and he has turned around, and beneath the stretched mask of his smile you can see it: that young face, pressed flat underneath, like a face under ice.',
              '*“I was handsome, wasn’t I,”* he says softly. *“Everyone is, before the uniform.”* Then he rings his own bell, and the alcove folds away behind you like a closing book.',
            ],
            next: 'after_thread',
          },
          {
            text: 'Ask him about the little girl.',
            hint: 'Keep him talking. Keep him turned around.',
            set: ['eyes_clue'],
            art: '🎀',
            outcome: [
              '*“Miss Wren.”* He sounds delighted. *“Our longest resident. Her mother stepped out for just a moment — tried to, anyway. Isn’t that sad? Wren will never leave now. Isn’t that lovely?”*',
              'He finally turns, holding nothing. *“Oh, and tenant? When the lights go, close your eyes. A courtesy of the house. Some of our residents are... shy.”*',
              'He rings the bell. You blink, and the alcove is gone, and you are standing alone in the hall with your heart going like a fist on a door.',
            ],
            next: 'after_thread',
          },
        ],
      },

      desk_caught: {
        scene: 'lobby',
        title: 'Is Something Wrong?',
        art: '😁',
        mood: 'blood',
        fx: 'glitch',
        text: [
          'He turns. Slowly. The body first — and then the head, a moment later, as if it has to catch up.',
          { speaker: 'The Concierge', say: 'Is something wrong, tenant?' },
          'His eyes go to the ledger. To the ragged edge where a page used to be. To your jacket.',
          'The lamp flickers. Behind him, every key on every hook begins to clink against its neighbor — hundreds of them, like wind chimes in a wind that isn’t blowing.',
        ],
        choices: [
          {
            text: 'Smile back. Wider.',
            hint: 'Speak his language.',
            effect: S(-1),
            art: '😬',
            outcome: [
              'You smile. You keep smiling, past the point where it hurts, teeth bared, cheeks aching, eyes wide and wet.',
              'He studies you for a long time. Then he laughs, delighted, and claps his weightless gloves together. *“Oh, you’ll fit right in.”*',
              'He lets you go. The page stays in your jacket. It takes a long, long time before your face agrees to stop smiling.',
            ],
            next: 'after_thread',
          },
          {
            text: 'Distract him — ask about the little girl.',
            hint: 'Everyone likes talking about their favorite.',
            set: ['eyes_clue'],
            art: '🎀',
            outcome: [
              '*“The girl,”* you blurt. *“Wren. Who is she?”*',
              'His eyes leave your jacket and go soft and faraway. *“Our longest resident. Her mother tried to leave without her. The mirror kept the mother; the floor kept the girl. Everybody stays somewhere.”* He blinks. *“When the lights go, close your eyes, tenant. A courtesy of the house.”*',
              'By the time he remembers the ledger, you are already walking away, very fast, page pressed flat against your ribs.',
            ],
            next: 'after_thread',
          },
          {
            text: 'Give the page back.',
            hint: 'Not worth dying for. Probably.',
            unset: ['has_lease'],
            effect: S(1),
            art: '🙇',
            outcome: [
              'You hand it over. He smooths it back into the binding with one gloved thumb, and the paper *heals* into the book with a sound like a sigh.',
              '*“Honesty. How refreshing,”* he purrs. *“Most tenants aren’t so... trainable.”*',
              'You feel calmer. You hate how much calmer you feel.',
            ],
            next: 'after_thread',
          },
        ],
      },

      // -------------------------------------------------------- THREAD C: HALL END
      hall_end: {
        scene: 'corridor',
        title: 'The End of the Hall',
        art: '🪞',
        mood: 'fog',
        enter: { set: ['visited_hallend'] },
        text: [
          'You walk. The door numbers climb: *1314. 1315. 1340. 1388. 1402.* Numbers that cannot exist.',
          'The sconces drift farther apart. The dark between them gets longer. The roses on the wallpaper are closed now, tight, like eyes squeezed shut.',
          'At last: a wall. On it, a tall mirror in a gilded frame, draped in a white sheet. The sheet is slipping. One corner has slid down, and a triangle of glass is showing.',
          { if: 'read_notice', text: '*Do not look into the mirror at the end of the hall.*' },
          'To your left, a door hangs ajar: **LAUNDRY**. Inside, a dryer is running. *Thunk. Thunk. Thunk.* Something small and metal rattles around with every turn.',
          'In the uncovered triangle of glass, something moves. **Before you do.**',
        ],
        choices: [
          {
            text: 'Slip into the laundry room.',
            hint: 'Something in that dryer wants to be found.',
            art: '🌀',
            scene: 'basement',
            outcome: [
              'You keep your eyes on the carpet, sidle left, and push through the laundry door.',
              'Behind you, very faintly, you hear the sheet on the mirror slide another inch. Like someone shifting under covers.',
            ],
            next: 'laundry',
          },
          {
            text: 'Pull the sheet off the mirror.',
            hint: 'You need to know what moved.',
            set: ['broke_rule', 'looked_mirror'],
            art: '🪞',
            outcome: [
              'You take a fistful of sheet and pull. It slides down with a whisper, pooling on the carpet like something shed.',
              'And there you are.',
            ],
            next: 'mirror',
          },
          {
            text: 'Turn around and walk back.',
            hint: 'Nothing good is at the end of a hallway like this.',
            effect: S(-1),
            art: '↩️',
            outcome: [
              'You turn your back on the mirror. It takes much longer to walk back than it took to walk here. The door numbers count down wrong — *1388, 1313, 1340, 1313* — and you pass the door to 1313 four separate times.',
              'The fourth time, Wren is standing in it, watching you go by. She waves. You don’t wave back.',
            ],
            next: 'after_thread',
          },
        ],
      },

      laundry: {
        scene: 'basement',
        title: 'Laundry Room 13',
        art: '🌀🧦',
        mood: 'toxic',
        text: [
          'One fluorescent tube, buzzing like a trapped wasp. Cracked linoleum. A lost-and-found bin. A hand-painted sign: *PLEASE DO NOT LEAVE CHILDREN UNATTENDED.*',
          'One dryer, old and round-windowed. Its power cord lies coiled on the floor, **cut clean through**. The drum turns anyway.',
          'Through the fogged porthole, clothes tumble: a yellow dress. Small white socks. And with every turn — a glint of brass.',
          'Then the dryer stops. Mid-turn. Total silence.',
          'The porthole fogs from the inside. And slowly, a small handprint presses into the fog.',
        ],
        choices: [
          {
            text: 'Open the dryer.',
            hint: 'The brass. You saw brass.',
            set: ['has_key'],
            effect: S(-1),
            fx: 'heartbeat',
            art: '🗝️',
            outcome: [
              'You yank the door. Heat rolls out, smelling of hot pennies and baby powder. You plunge your arm in. The clothes are damp and warm, *body* warm, like they were only just taken off.',
              'Your fingers close on something small and hard — and tiny fingers close around your wrist. They squeeze. Once. Like a thank-you. Like a warning. Then they let go.',
              'You pull your arm out. Nothing in the drum but clothes. In your palm: a little brass key with a butterfly-shaped bow, warm as a held breath.',
            ],
            next: 'after_thread',
          },
          {
            text: 'Dig through the lost-and-found bin.',
            hint: 'Other tenants lost things here. Maybe things that help.',
            set: ['eyes_clue'],
            effect: S(-1),
            art: '📦',
            outcome: [
              'Single gloves. A 1970s pager. One small patent leather shoe. A wedding ring on a shoelace. And — your work ID badge. Your face. Your name. The lanyard is still warm.',
              'You grab at your chest. Your badge is clipped right where it always is. Both of them are yours.',
              'On the back of the one from the bin, in your own handwriting, in what looks like eyeliner: **EYES SHUT WHEN THE LIGHTS GO. DON’T RUN. YOU ALWAYS RUN.**',
            ],
            next: 'after_thread',
          },
          {
            text: 'Back out slowly.',
            hint: 'Do not open the door with the hand behind it.',
            art: '🚪',
            outcome: [
              'You don’t take your eyes off the handprint. You step back. Another step.',
              'A second handprint appears beside the first. Then a third — bigger. A grown woman’s hand. Then a fourth, with fingers far too long.',
              'You pull the laundry door shut. Behind it, the dryer starts again. *Thunk. Thunk.* And something inside begins, very softly, to knock along with it.',
            ],
            next: 'after_thread',
          },
        ],
      },

      mirror: {
        scene: 'corridor',
        title: 'Do Not Look',
        art: '🪞👁️',
        mood: 'void',
        fx: 'glitch',
        text: [
          'You. Gilt frame. Work jacket, tired eyes, rain still in your hair.',
          'But your reflection is half a second late. When you blink, it blinks *after*. When you breathe, its chest stays perfectly still.',
          'Behind your reflection the mirrored hallway is dark, and in the mirrored doorway of 1313 stands Wren — except in the glass she is tall, grown, her head bent sideways against the ceiling, watching.',
          'Then your reflection smiles. **You are not smiling.**',
          'It raises one hand and lays its palm flat against the glass. Waiting for yours.',
        ],
        choices: [
          {
            text: 'Smash it.',
            hint: 'Seven years bad luck beats forever.',
            effect: S(-1),
            fx: 'shake',
            art: '💥',
            outcome: [
              'You drive your elbow into the glass. It cracks in a starburst and every shard holds a different you — and in every one of them, you are wearing a maroon jacket with brass buttons.',
              'The shards rain down. Behind the frame there is only wallpaper, breathing faster now, panicked. Your elbow bleeds onto the carpet. The carpet drinks it.',
            ],
            next: 'after_thread',
          },
          {
            text: 'Press your palm to its palm.',
            hint: "It looks so lonely. It looks like you.",
            fx: 'redflash',
            art: '🖐️',
            outcome: [
              'The glass is warm. Its hand fits yours exactly, line for line, scar for scar. It holds on the way someone holds on at an airport — like they missed you. Like they have been waiting so long.',
              'Then it pulls.',
            ],
            next: 'death_mirror',
          },
          {
            text: 'Tear your eyes away.',
            hint: 'Look anywhere else. Anywhere.',
            effect: S(-1),
            art: '🙈',
            outcome: [
              'It is the hardest thing you have ever done. Like pulling a fishhook back out the way it went in. You wrench your head aside and drag the sheet back up over the glass.',
              'Under the sheet, from the glass side: three polite knocks. *Knock. Knock. Knock.* Then your own voice, muffled, asking to be let out.',
            ],
            next: 'after_thread',
          },
        ],
      },

      after_thread: {
        redirect: (s) => (s.count('visited_wren', 'visited_desk', 'visited_hallend') >= 2 ? 'lights_out' : 'the_call'),
      },

      // ---------------------------------------------------------------- THE CALL
      the_call: {
        scene: 'corridor',
        title: 'It Knows Your Name',
        art: '🗣️',
        mood: 'night',
        fx: 'heartbeat',
        timer: 8,
        text: [
          'The floor has put you back in the main hall. The lullaby has stopped. The wallpaper holds its breath.',
          'Then, from right behind you, close enough to stir the hair on your neck — your name.',
          "Not called. *Said.* The way your mother said it when you were small and feverish and she sat on the edge of your bed with a cold washcloth. That exact voice. That exact tired love. She has been dead for four years.",
          { speaker: '???', say: "Sweetheart? It’s so dark in here. Come and get me." },
          { if: 'read_notice', text: '*Do not answer when it calls your name.*' },
          'It says your name again. Closer. It is waiting for you to say something. **Anything.**',
        ],
        timeout: {
          effect: S(-1),
          art: '🥶',
          outcome: [
            'You freeze. You can’t breathe, can’t turn, can’t make a sound. Cold air slides along the shell of your ear.',
            'It whispers every name you have ever been called. Pet names. Nicknames. The one your ex used. The one the kids at school used. Then, almost tender: *“You’ll answer eventually. Everyone does.”*',
            'And it is gone. Silence never sounded so loud.',
          ],
          next: 'hall_return',
        },
        choices: [
          {
            text: '“Mom?”',
            hint: "It’s her. It’s really her.",
            set: ['answered', 'broke_rule'],
            effect: S(-2),
            fx: 'redflash',
            art: '💔',
            outcome: [
              'The word falls out of you before you can stop it.',
              'Silence. Then, pressed right against the back of your neck, you feel a mouth stretch into a smile.',
              '*“There you are,”* it says. And the voice isn’t your mother’s anymore. It’s **yours**.',
            ],
            next: 'call_answered',
          },
          {
            text: 'Clamp your hands over your ears and hum.',
            hint: 'Drown it out. Any song. Any song at all.',
            effect: S(-1),
            art: '🎵',
            outcome: [
              {
                if: (s) => s.has('knows_three') || s.has('heard_rhyme'),
                text: 'You hum the only song in your head — the lullaby — *once for the living, twice for the dead* — over and over, louder, until your skull buzzes.',
                else: 'You hum the only song in your head — the floor’s eight sad notes — louder and louder until your skull buzzes.',
              },
              'Through your palms you hear her voice rising: *“Why won’t you look at me? Why won’t you* **answer me?**” The wallpaper ripples like a struck drumskin.',
              'Then — nothing. When you finally lower your hands, your palms are wet. Your ears are bleeding, just a little.',
            ],
            next: 'hall_return',
          },
          {
            text: 'Turn around — but keep your mouth shut.',
            hint: 'The rule says don’t answer. It doesn’t say don’t look.',
            effect: S(-1),
            art: '🤐',
            outcome: [
              'You turn. Nobody. An empty hall, honey-lit, breathing.',
              'But the voice is in front of you now. Then behind. Then inside the wall, then under the carpet. It says your name in your father’s voice. Your best friend’s. Your own voice at six years old, crying.',
              'You bite your tongue until you taste copper. At last it gives up, sulky as a child: *“Rude.”*',
            ],
            next: 'hall_return',
          },
        ],
      },

      call_answered: {
        scene: 'apartment',
        title: 'Answered',
        art: '🚪👄',
        mood: 'blood',
        fx: 'redflash',
        text: [
          'Door **1309** is open now. It wasn’t before.',
          'Beyond it is your childhood bedroom. Exactly. The glow-in-the-dark stars. The moon-shaped nightlight. The dent in the wall from when you threw a shoe.',
          'Under the covers, someone is lying on their side, facing away. The shape of her shoulder. The gray in her hair.',
          { speaker: 'Mom', say: "Come sit with me, sweetheart. Just for a minute. I’m so cold." },
          'Your feet take a step. You didn’t tell them to. Two more steps and you’re across the threshold.',
        ],
        choices: [
          {
            text: 'Slam the door.',
            hint: 'She is gone. She is GONE.',
            effect: S(-1),
            fx: 'shake',
            art: '🚪',
            outcome: [
              'You throw your whole weight against the door. It fights you. Long fingers — too many joints — curl around the edge from inside.',
              'You slam it on them. Again. They withdraw, unhurt, unhurried. Through the wood you hear crying in your mother’s voice and laughing in your own.',
            ],
            next: 'hall_return',
          },
          {
            text: 'Go in. Just for a minute.',
            hint: "You never got to say goodbye.",
            effect: S(-2),
            art: '🛏️',
            outcome: [
              'You sit on the edge of the bed. She is warm. The pillow smells like her shampoo. It is the best minute you have had in four years and you cry so hard you can’t see.',
              'When you can see again, the covers are flat. There was never anyone under them — only a long, rose-patterned shape, rising and falling, rising and falling.',
              'You walk out into the hall. You can’t remember your middle name. You try for a long time.',
            ],
            next: 'hall_return',
          },
          {
            text: 'Bite down hard on your own hand.',
            hint: 'Pain is real. Pain is yours.',
            art: '🩸',
            outcome: [
              'You bite the meat of your thumb until it breaks. The pain is clean and white and *yours*, and it yanks you back into your own body like a leash.',
              '*“You’re not her,”* you say. Your voice shakes. *“You don’t even do her right.”*',
              'The figure under the covers goes very still. The door to 1309 closes, softly, politely, the way you close the door on a sleeping child.',
            ],
            next: 'hall_return',
          },
        ],
      },

      hall_return: {
        scene: 'corridor',
        title: 'The Hall Rearranges',
        art: '🌹🕯️',
        mood: 'candle',
        text: [
          'The hallway has changed while you weren’t looking. Doors where there were no doors. One sconce in three is dead. The wallpaper is breathing faster now — short, shallow, excited.',
          {
            if: (s) => s.get('sanity') <= 1,
            text: 'You catch yourself giggling and can’t remember starting. The roses are watching you. That’s fine. That’s fine. Roses can watch.',
            else: 'You press your back to the wall, then remember what the wall is, and step away fast.',
          },
          { if: '!visited_wren', text: 'From 1313, the lullaby again — slower than before. Winding down.' },
          { if: '!visited_desk', text: 'Somewhere around a corner, the bell rings. Patient. Inviting.' },
          { if: '!visited_hallend', text: 'Far away at the end of the hall, something is going *thunk... thunk... thunk.*' },
          { if: 'answered', text: 'Behind door 1309, someone is still saying your name, very quietly, to itself.' },
          'At the far end of the hall, the first sconce goes out. *Pop.*',
          'You have time for one more thing. Maybe.',
        ],
        choices: [
          {
            text: 'Go to apartment 1313.',
            hint: 'The girl. The music box.',
            if: '!visited_wren',
            art: '🎀',
            outcome: [
              'You run for 1313. The lullaby dips and wobbles, like a record under a slipping needle.',
              'The door is already opening as you reach it.',
            ],
            next: 'wren_door',
          },
          {
            text: 'Find the front desk.',
            hint: 'The man with the keys knows how this ends.',
            if: '!visited_desk',
            art: '🛎️',
            outcome: [
              'You follow the bell. Around a corner. Around another. The green lamp glows ahead like a lure in deep water.',
            ],
            next: 'concierge_desk',
          },
          {
            text: 'Walk to the end of the hall.',
            hint: 'Whatever is thumping down there.',
            if: '!visited_hallend',
            art: '🪞',
            outcome: [
              'You walk away from the dying lights, deeper in. The numbers on the doors stop being numbers. You keep your eyes on the carpet.',
            ],
            next: 'hall_end',
          },
          {
            text: 'Find your way back to the elevator.',
            hint: 'Enough. Get out while you still can.',
            art: '🛗',
            outcome: [
              'You trail your fingers along the breathing wall, counting doors, counting heartbeats, searching for the place where the elevator was.',
              'Behind you, the sconces go out faster. *Pop. Pop. Pop.*',
            ],
            next: 'lights_out',
          },
        ],
      },

      // -------------------------------------------------------------- LIGHTS OUT
      lights_out: {
        scene: 'corridor',
        title: 'Lights Out',
        art: '💡⬛',
        mood: 'void',
        fx: 'flash',
        timer: 7,
        text: [
          '*Pop. Pop. Pop.* The sconces are dying one by one, from the far end toward you — a wave of dark walking up the hall.',
          'In the dark, something drags. A heavy, wet, patient sound. It isn’t on the floor. **It’s on the ceiling.**',
          'The wallpaper stops breathing. Everything on Floor 13 is holding its breath except you.',
          {
            if: 'wren_trust',
            text: 'A cold little hand finds yours. Wren, right beside you, whispering: *“Close your eyes. He can’t see shut eyes.”*',
            else: { if: 'eyes_clue', text: 'A courtesy of the house, someone told you. *When the lights go, close your eyes.*', else: 'Nobody told you what to do when the lights go. Nobody told you anything.' },
          },
          'Brass elevator doors have appeared in the wall — twenty steps away. The door to 1313 is three.',
          'The sconce above your head flickers.',
        ],
        timeout: {
          effect: S(-2),
          art: '👁️',
          outcome: [
            'You freeze with your eyes wide open, and so you **see it**.',
            'Long. Folded wrong, like a coat hanger bent into a man. It hangs from the ceiling by its fingertips and its face lowers until it is an inch from yours. It has no eyes. It doesn’t need them; you are looking at it, and that is enough.',
            {
              if: (s) => s.get('sanity') <= 0,
              text: 'It opens its mouth.',
              else: 'It looks at you for a long, long time. Then the lights stutter back on — and it is gone, and you are on your knees, and you are screaming without any sound coming out.',
            },
          ],
          next: (s) => (s.get('sanity') <= 0 ? 'death_dark' : 'finale'),
        },
        choices: [
          {
            text: 'Run for the elevator.',
            hint: 'Twenty steps. You can do twenty steps.',
            effect: S(-1),
            fx: 'shake',
            art: '🏃',
            outcome: [
              'You run. The dark runs faster. Something brushes the top of your head — fingers, long and dry as old leaves.',
              {
                if: (s) => s.get('sanity') <= 0,
                text: 'Your legs go out from under you. You are so tired. You have been so tired for so long. The carpet is soft and warm and it would be so easy to just... lie... here.',
                else: 'You slam into the brass doors with your shoulder and spin, back pressed to the metal, as the last light dies — and then, one by one, they all come back on.',
              },
            ],
            next: (s) => (s.get('sanity') <= 0 ? 'death_dark' : 'finale'),
          },
          {
            text: 'Squeeze your eyes shut and don’t move.',
            hint: 'Every instinct says run.',
            effect: (s) => { if (!s.has('eyes_clue') && !s.has('wren_trust')) S(-1)(s); },
            art: '😣',
            outcome: [
              'You squeeze your eyes shut so hard you see colors. The dark arrives. You feel it arrive — a pressure change, like a plane descending.',
              'Something lowers itself in front of your face. You feel its breath: cold, and smelling of old paper. It sniffs. It waits for you to look. You don’t.',
              'It drags itself on, down the ceiling, away. When you open your eyes the lights are back, and the carpet in front of you has four long scratches in it, ending an inch from your shoes.',
            ],
            next: 'finale',
          },
          {
            text: 'Dive into apartment 1313.',
            hint: 'Three steps. A door that locks.',
            set: ['dove'],
            art: '🚪',
            scene: 'apartment',
            outcome: [
              'You throw yourself at 1313. The knob turns. You fall through and kick the door shut behind you as the hallway goes black.',
              {
                if: 'wren_trust',
                text: 'In the dark, a cold little hand grabs your sleeve and pulls. *“Under here. Quick, quick.”*',
                else: 'It’s dark in here, too. Totally dark. And it’s very quiet. And you realize you can’t hear the lullaby anymore. You can hear something breathing, though. Near the ceiling.',
              },
            ],
            next: (s) => (s.has('wren_trust') ? 'wren_hide' : 'death_dark'),
          },
        ],
      },

      wren_hide: {
        scene: 'apartment',
        title: 'Under the Bed',
        art: '🛏️🌑',
        mood: 'night',
        text: [
          'Under the bed, it smells of dust and old crayons. Wren lies nose to nose with you. Her eyes shine with light that is not there.',
          'Outside, something heavy pauses at the door. Scratches. Once, lazily. Moves on.',
          { speaker: 'Wren', say: "He was a tenant once. He signed. Everybody who signs gets a uniform, eventually. Mama didn’t sign. Mama tried to run with me, and he — " },
          'She stops. Swallows.',
          { speaker: 'Wren', say: "Mama’s in the mirror now. I’m in here. Will you take me with you? When you go?" },
          'The lights come back on — you can see the glow under the door. And out in the hall, clear and bright, the elevator goes **ding**.',
        ],
        choices: [
          {
            text: '“I’ll take you with me.”',
            hint: 'Whatever it costs.',
            set: ['vowed'],
            art: '🤝',
            outcome: [
              'She looks at you for a long moment, the way kids look at adults who have lied to them before.',
              'Then she smiles. A real smile. A gap in her front teeth. For one second she is exactly, completely, a seven-year-old girl.',
              '*“Okay,”* she says, and doesn’t let go of your hand.',
            ],
            next: 'finale',
          },
          {
            text: '“I can’t promise that.”',
            hint: 'Don’t lie to a child. Even this one.',
            art: '😔',
            outcome: [
              'Her face does not crumple. That’s the worst part. It just goes quiet, like a house with the lights going off room by room.',
              '*“Nobody ever can,”* she says. *“That’s okay. You can still go.”* She crawls out ahead of you and holds the door.',
            ],
            next: 'finale',
          },
          {
            text: '“Are you lying to me?”',
            hint: 'The scratches in the elevator. SHE IS NOT WHAT SHE SAYS.',
            effect: S(-1),
            fx: 'glitch',
            art: '❔',
            outcome: [
              '*“Yes,”* she says. Then: *“No.”* Then, frowning: *“I don’t remember which. I’ve been here so long I don’t remember which parts are me.”*',
              'Her face goes *hallway* for a moment — roses and sconces going back forever — and then she is a girl again, crying her dry gray tears. You pull her out from under the bed anyway.',
            ],
            next: 'finale',
          },
        ],
      },

      // ------------------------------------------------------------------ FINALE
      finale: {
        scene: 'corridor',
        title: '3:33 AM — The Car',
        art: '🛗🔘',
        mood: 'blood',
        fx: 'heartbeat',
        timer: 10,
        text: [
          'Every light on the floor blazes back on at once, too bright, bleaching the roses white. In the wall: brass elevator doors. Real. Solid. A single round call button.',
          'Down the hall, the Concierge is coming. Walking. Never hurrying. But every time you blink, he is two doors closer, and his smile reaches all the way to his ears.',
          { speaker: 'The Concierge', say: "Tenant! There’s no need to rush off. Your room is ready. It’s been ready for ever so long." },
          { if: 'signed', text: 'In your pocket, the key tagged 1312 is hot as a coal.' },
          {
            if: 'wren_trust',
            text: 'Wren is pressed against your side, both hands knotted in your sleeve.',
            else: 'Wren stands in the doorway of 1313, watching you. Her face gives away nothing at all.',
          },
          {
            if: 'knows_three',
            text: '*Once for the living. Twice for the dead. Three for the sleepers who go home to bed.*',
            else: {
              if: 'heard_rhyme',
              text: '*Once for the living. Twice for the dead. Three for the —* The scratches in the stairwell stopped at three.',
              else: '*The car returns for those who know how many times to ask.* You don’t know. Nobody told you. You’ll have to guess.',
            },
          },
          {
            if: secretReady,
            text: 'In one pocket: a little brass butterfly key, still warm. In the other: a lease with a girl’s name on it in purple crayon. Wren is staring at the key like it’s the sun coming up.',
          },
          'Ten doors. Eight. **Five.** Your finger is on the button.',
        ],
        timeout: {
          art: '🧤',
          outcome: [
            'You hesitate. One heartbeat too long.',
            'A white glove settles on your shoulder. It weighs nothing at all.',
            '*“There now,”* the Concierge murmurs, right in your ear. *“Wasn’t that easy?”*',
          ],
          next: 'end_tenant',
        },
        choices: [
          {
            text: 'Press it once.',
            hint: 'Once for the living.',
            art: '1️⃣',
            outcome: [
              'You press the button once. It lights a gentle gold.',
              'The Concierge stops walking. He doesn’t need to walk anymore. He tips his cap to you, the way you’d tip it to an old friend you’ll see again tomorrow. And the next day. And the next.',
              'The doors open.',
            ],
            next: 'end_loop',
          },
          {
            text: 'Press it twice.',
            hint: 'Twice. Two is a safe number. Isn’t it?',
            art: '2️⃣',
            outcome: [
              '*Click. Click.* The button turns a deep, wet red.',
              'From far below, from much farther down than the Halvorsen goes, you hear a hundred voices begin to sing.',
              'The doors open.',
            ],
            next: 'death_shaft',
          },
          {
            text: 'Press it three times.',
            hint: 'Three for the sleepers who go home.',
            art: '3️⃣',
            outcome: [
              '*Click. Click. Click.* The button glows white — clean, ordinary, fluorescent white, the color of every boring office you have ever hated and suddenly love.',
              { if: 'vowed', text: 'Wren’s hand tightens in yours. Then, very gently, it lets go.' },
              'The Concierge’s smile flickers. For the first time all night, he hurries.',
            ],
            next: (s) => (s.has('signed') || s.get('sanity') <= 0 ? 'end_tenant' : 'end_dawn'),
          },
          {
            text: 'Kneel. Give Wren the key.',
            hint: 'The lease. The key. You kept every rule. Now break his.',
            if: secretReady,
            fx: 'flash',
            art: '🗝️',
            outcome: [
              'You turn your back on the doors. On the man coming down the hall. You kneel on the breathing carpet so you are eye to eye with her, and you hold out the little brass key.',
              'Wren stares at it. Then at you. *“You found it,”* she whispers. *“Nobody ever finds it.”*',
            ],
            next: 'secret_rite',
          },
        ],
      },

      secret_rite: {
        scene: 'corridor',
        title: 'The Real Song',
        art: '🎶🗝️',
        mood: 'gold',
        weather: 'sparkles',
        fx: 'shake',
        text: [
          'The key slides into the butterfly keyhole like it has been waiting sixty years for exactly this. *Click. Click. Click.*',
          'The ballerina rises on her spindle — and now she has a face. A woman’s face. Kind, tired, so like Wren’s.',
          'The song that pours out is not the floor’s song. It’s a different lullaby. Warm. A little off-key. The kind a real mother hums at 3 AM over a crib.',
          'The wallpaper **screams**. Roses blacken and curl. The Concierge stops dead in the middle of the hall, and his enormous smile cracks at the corners like old paint.',
          { speaker: 'The Concierge', say: 'Put. That. DOWN, tenant.' },
          'For the first time all night, he is not polite.',
          'You pull the lease from your jacket. *Term: IN PERPETUITY.* Wren looks at the paper, then at you.',
          { speaker: 'Wren', say: 'Mama said a lease is just paper. And paper tears.' },
          'The Concierge lunges.',
        ],
        choices: [
          {
            text: 'Tear the lease in half.',
            hint: 'In perpetuity ends now.',
            fx: 'flash',
            art: '📜',
            outcome: [
              'You rip it straight down the middle, right through the drawing of a smile.',
              'It doesn’t sound like paper. It sounds like a building taking its first breath in sixty years — and letting it out.',
            ],
            next: 'end_free',
          },
          {
            text: 'Lose your nerve. Stab the button three times.',
            hint: 'You could still just... go.',
            set: ['abandoned'],
            art: '🏃',
            scene: 'elevator',
            outcome: [
              'Your hands won’t do it. The lease flutters to the carpet. You spin and jab the button — *one, two, three* — and the doors open on white light.',
              'You fall inside. The last thing you see as the doors close is Wren, kneeling on the carpet, holding a music box that is still playing her mother’s song, watching a gloved hand settle on her shoulder.',
            ],
            next: 'end_dawn',
          },
        ],
      },

      // ----------------------------------------------------------------- ENDINGS
      end_dawn: {
        scene: 'apartment',
        art: '🌅',
        mood: 'dawn',
        ending: { id: 'dawn', title: 'Morning Shift', type: 'good' },
        text: [
          'The doors close on the Concierge’s smile. For a moment the smile hangs in the gap after the rest of his face is gone, and then the doors meet, and there is only brushed steel and your own exhausted reflection — on time, blinking when you blink.',
          'The panel reads **12**. *Ding.* Your hallway. Your door, 1207, its brass 7 slightly crooked. Inside, gray light. Real light. Your microwave clock says 6:12 AM.',
          { if: 'abandoned', text: 'You sleep for fourteen hours. When you wake, you can hear it through the ceiling — faintly — a music box that someone keeps trying to wind. It plays three notes and stops. Plays three notes. Stops. You moved out in a week. You can still hear it. You will always be able to hear it.' },
          { if: (s) => !s.has('abandoned') && s.has('vowed'), text: 'You told her you’d take her with you. Her hand let go of yours at the very last second, gentle, like she always knew. You tell yourself you’ll go back for her. You never press an elevator button after dark again.' },
          { if: (s) => !s.has('abandoned') && !s.has('vowed') && s.has('wren_trust'), text: 'You think about Wren’s cold hand in yours. About the tens of thousands of red crayon X’s. She’s making a new one right now. You know she is.' },
          { if: (s) => !s.has('wren_trust') && !s.has('abandoned'), text: 'You never decided what Wren was. A lost girl. A lure. A floor wearing a yellow dress. Some nights you’re glad you never found out. Most nights you aren’t.' },
          { if: 'answered', text: 'Sometimes your phone rings at 3:33 and the screen says MOM. You let it ring. It always rings exactly as long as it takes you to almost pick up.' },
          { if: 'looked_mirror', text: 'You turned every mirror in your apartment to face the wall. Sometimes, when you walk past them, you hear knocking. Three polite knocks.' },
          { if: (s) => s.has('has_key') && !s.has('abandoned'), text: 'The butterfly key is still in your pocket. You keep it in a drawer. Some nights it is warm.' },
          'A week later, there’s a cream envelope in your mailbox, sealed in maroon wax. You don’t open it. You don’t need to.',
          '*We’ll keep your floor ready.*',
        ],
      },

      end_loop: {
        scene: 'lobby',
        art: '🕒🔁',
        mood: 'night',
        weather: 'rain',
        fx: 'glitch',
        ending: { id: 'loop', title: '3:33, Again', type: 'neutral' },
        text: [
          'The doors open on the lobby.',
          'Rain on the glass. Wet carpet and radiator heat. The clock above the bricked-up fireplace says **3:33**. The second hand isn’t moving.',
          'Your shift ran long. It always runs long.',
          'You stand there dripping and you *remember* — the roses, the bell, the girl, the smile. You think you remember. It’s fading already, the way dreams fade, the way the last fourteen times faded.',
          '*Fourteen?* Where did that number come from?',
          { if: 'welcome_note', text: 'Box 1207 has a cream envelope in it again. You don’t have to open it. You know it says *Welcome back, tenant.*' },
          { if: 'has_key', text: 'Your hand is in your pocket, closed around something small and warm and butterfly-shaped. It came back with you. Things come back with you. Maybe next time, that will matter.' },
          { if: 'has_lease', text: 'There’s a folded page in your jacket. A lease for 1313. You don’t remember there being three names on it. The third one is yours.' },
          { if: 'signed', text: 'There’s a key tagged 1312 in your other pocket. It’s a little warmer every time.' },
          'Behind you, the elevator is waiting. Doors open. Lit a soft and honeyed gold. You didn’t call it.',
          'Somewhere far above you, very faintly, a music box is playing.',
          'You step inside. You always do.',
        ],
      },

      death_shaft: {
        scene: 'void',
        art: '🕳️',
        mood: 'void',
        fx: 'redflash',
        ending: { id: 'shaft', title: 'Twice for the Dead', type: 'death' },
        text: [
          'There is no car behind the doors. There is only the shaft: black, square, endless. Cold air rises out of it smelling of rain and iron and something sweet gone bad.',
          'From far, far below, a hundred voices are singing. *Twice for the dead. Twice for the dead. Twice for the dead.*',
          'You step back. But the hallway floor tilts under you, gently, like a tongue easing something toward a throat. Your heels slide.',
          'A weightless glove settles between your shoulder blades. *“Mind the gap, tenant.”* A soft push.',
          'You fall a long time. Long enough for the song to finish. Long enough to learn the words.',
          {
            if: 'wren_trust',
            text: 'The last thing you see, framed in the little square of gold light high above you, is Wren, leaning over the edge to watch you go. She isn’t crying. Her lips are moving. She is counting.',
            else: 'The last thing you see, framed in the little square of gold light high above you, is the Concierge’s smile, hanging there like a crescent moon.',
          },
          'Some nights, if you ride the Halvorsen elevator at 3:33 and put your ear to the floor of the car, you can hear the choir. There is a new voice in it now. It’s yours.',
        ],
      },

      death_mirror: {
        scene: 'void',
        art: '🪞🖐️',
        mood: 'void',
        fx: 'glitch',
        ending: { id: 'mirror', title: 'Reflection Pending', type: 'death' },
        text: [
          'It pulls, and your hand goes into the glass like into warm bathwater. Your wrist. Your elbow. Your shoulder. You open your mouth to scream, and on the other side of the glass, your mouth is smiling.',
          'Then you’re through.',
          'The hallway on this side is the same, but reversed, and silent, and gray. No color. No breath in the wallpaper. Just glass on every side, and out there, in the warm gold light, **you**.',
          'Your reflection — the one who used to be late — straightens your work jacket. Fixes your hair. Picks up the sheet and drapes it neatly back over the mirror. Over you.',
          'Through the cloth, you hear it walk away down the hall, humming the lullaby. You hear the elevator. You hear it press the button. *Once. Twice. Three times.* It knew. It always knew.',
          'A cold hand settles on your shoulder from behind. A woman, gray as ash, her palms worn flat from sixty years against the glass. *June*, says the name tag on her coat.',
          '*“It never comes back for us,”* she whispers. *“But sometimes they look.”*',
          'So you wait for someone to look.',
        ],
      },

      death_dark: {
        scene: 'void',
        art: '🌑',
        mood: 'void',
        fx: 'redflash',
        ending: { id: 'dark', title: 'Lights Out', type: 'death' },
        text: [
          {
            if: 'dove',
            text: 'The room behind 1313 isn’t Wren’s room. Not tonight. Tonight it’s just the dark, and the dark had been standing behind the door with the knob in its hand, waiting for you to turn it.',
            else: 'It finds you. Of course it finds you. You were the only thing on the floor with its eyes open.',
          },
          'You feel a hand that is mostly fingers close around your ankle. Another on your shoulder. Another, impossibly, on your face, gently thumbing your eyelids open wider. It wants you to see. It *needs* you to see.',
          'You see.',
          'Later, a laminated notice goes up in the Halvorsen lobby: *HAVE YOU SEEN THIS PERSON?* Your work ID photo. The building manager tells the police there has never been a tenant in 1207. The unit’s been vacant for years.',
          'Some tenants say that at 3:33, if the lights in the hall flicker, you can hear someone very close by, breathing hard, trying very hard to keep their eyes shut. Trying, and failing.',
        ],
      },

      end_tenant: {
        scene: 'lobby',
        art: '🎩😁',
        mood: 'ember',
        fx: 'heartbeat',
        ending: { id: 'tenant', title: 'The New Concierge', type: 'bad' },
        text: [
          {
            if: 'signed',
            text: 'The elevator doors open on nothing — wallpaper, roses, breathing. Of course they do. You signed. *Tenants don’t leave, tenant.* The Concierge’s weightless glove settles on your shoulder like a falling leaf.',
            else: {
              if: (s) => s.get('sanity') <= 0,
              text: 'You stand at the doors and you can’t remember why you wanted to leave. Leaving is so tiring. Everything outside was so tiring. The Concierge’s weightless glove settles on your shoulder, and you lean into it.',
              else: 'You were so close. But he is so patient, and you were one heartbeat too slow, and the floor has all the time in the world.',
            },
          },
          'He helps you into the jacket. Maroon, pressed, brass buttons, still warm from the body that wore it last. It fits perfectly. It was always going to.',
          'Then the smile comes. You feel it start at the corners of your mouth and keep going. Past where smiles stop. Your jaw creaks. Your teeth — there are so many more of them than you remember.',
          {
            if: 'knows_concierge',
            text: 'The old Concierge takes off his cap and, for a moment, he is just Edgar Bell, tenant, 1958: a tired young man in a cheap suit. He walks into 1312, lies down on the bed, and closes his eyes for the first time in sixty years.',
            else: 'The old Concierge takes off his cap, and his smile shrinks to an ordinary, exhausted mouth. He walks into 1312 and lies down, and you never see him again.',
          },
          {
            if: 'wren_trust',
            text: 'Wren sits on the corner of your desk now, swinging her patent leather shoes, humming the floor’s song. She calls you *Mister Concierge*. She seems happy you stayed. You try very hard not to wonder whether she was happy all along.',
            else: 'Wren sits on the corner of your desk now, swinging her patent leather shoes. She smiles at you. You notice, for the first time, that her smile is exactly as wide as yours.',
          },
          'And at 3:33 AM, the elevator dings. The doors open. A tired someone in a damp work jacket steps out, blinking at the breathing wallpaper.',
          'You ring your bell. *Ting.* You feel your smile go on and on.',
          '*“Welcome to the thirteenth, tenant. We’ve had your floor ready for ever so long.”*',
        ],
      },

      end_free: {
        scene: 'dawn',
        art: '🌄🎀',
        mood: 'dawn',
        weather: 'sparkles',
        fx: 'flash',
        ending: { id: 'free', title: 'Wren Goes Home', type: 'secret' },
        text: [
          'The lease tears — and the hallway tears with it, along the same jagged line, floor to ceiling.',
          'Behind the wallpaper there is **sunlight**. Real dawn, pink and gold, pouring through windows the thirteenth floor never had. The roses fall off the walls like dead petals. The sconces go dark, and nobody misses them.',
          'The Concierge stops in the middle of the hall. His smile shrinks — corner by corner, tooth by tooth — until it is just a mouth.',
          {
            if: 'knows_concierge',
            text: 'Edgar Bell, tenant, 1958, stands there in a cheap suit, looking at his own bare hands. *“Oh,”* he says. *“Oh, it’s morning.”* He crumbles gently into dust that smells of old paper, and the dust drifts toward the light.',
            else: 'He is a young man in a cheap suit, looking at his own bare hands like he’s never seen them. *“Oh,”* he says. *“Oh, it’s morning.”* He crumbles gently into dust that smells of old paper, and the dust drifts toward the light.',
          },
          'At the end of the hall, the mirror’s sheet slides to the floor. A woman steps out of the glass. Gray at first, then less gray, then not gray at all. *June.*',
          'Wren runs. Her patent leather shoes slap the bare floorboards and she hits her mother so hard they both almost fall over, and June is laughing and crying and saying her name, her name, *her name*, over and over.',
          'At the edge of the light, Wren looks back at you. A gap-toothed grin. Completely, entirely, a seven-year-old girl.',
          { speaker: 'Wren', say: 'Thank you, new tenant. You did it right. You did everything right.' },
          'Then they walk into the sunrise, and the sunrise closes behind them like a door.',
          '· · ·',
          'You wake up in the elevator. The doors are open on **12**. It’s 6:40 AM, and an old woman from down the hall is waiting with her terrier. *“Rough night, hon?”*',
          'On the panel, where the 13 button was, there is only a smooth, blank square of brass.',
          {
            if: 'welcome_note',
            text: 'In the lobby, the mailbox marked 1313 is gone. In yours, where a cream envelope used to be, there’s a sheet of paper folded in quarters.',
            else: 'That evening, there’s a sheet of paper folded in quarters in your mailbox.',
          },
          'A crayon drawing. A tall person in a work jacket. A woman. A little girl in a yellow dress. And a huge yellow sun with a smile — an ordinary smile, an ordinary size. Underneath, in wobbly purple capitals: **ONE TWO THREE GO HOME.**',
          'You never answered. You never looked. You never signed. One night, four rules, and you kept every one of them — and then you broke the only one that mattered.',
          '*In perpetuity* turned out to be exactly as long as it took someone to care.',
        ],
      },
    },
  });
})();
