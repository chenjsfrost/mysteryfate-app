/*
 * Room 9, Hotel Calloway — MysteryFate story.
 *
 * SOLUTION (for authors): You are a private investigator. Leonard Ashby, a property developer drowning in
 * debts to people who don't send letters, hired you a month ago to "follow his wife". It was a test: he
 * wanted to know how good you were, because he and his wife Celeste were planning to vanish with a
 * four-million insurance payout and needed a witness who would swear Leonard was dead. Last night, in
 * Room 9, you showed him what you had actually found: the second life policy, signed three weeks ago.
 * Leonard panicked and came at you with a brass letter opener. You caught his wrist (it cut your forearm)
 * and shoved him; his head struck the radiator and he went down. That part is real.
 * Celeste was waiting in Room 11 behind the connecting door. She saw her chance: Leonard was breathing.
 * She handed you a glass of whisky laced with a sedative (coral lipstick on the rim; the empty vial is in
 * Room 11's bin), and while you slept, she and the night manager Felix Moreau (who owes a bookie and took
 * her cash) staged the scene: a dab of stage blood at the temple, Leonard's own ring pushed onto your finger,
 * and a dose of a heart-slowing drug for Leonard so his pulse all but vanished. Then Celeste rang the police
 * from the lobby payphone. The plan: the body "disappears" through the connecting door, Leonard walks away
 * on a passport in another name, Celeste collects on a husband murdered by an obsessed PI.
 *
 * Celeste clues (proof): c_glass (her lipstick on your glass), c_vial (sedative vial in Room 11),
 *   c_ledger (Room 11 booked by "Mrs C. Vane", her maiden name), c_felix (Felix is in her pay)
 * Self-defence clue: c_wound (you remember the fight / the cut on your arm)
 * Leonard-alive clues: c_dry (no blood under the "body", his skin warm), c_key2 (second room key: Room 11),
 *   c_alive (the passport / "Leonard Ashby has no more debts" / "he's breathing")
 * Secret ending: Memory >= 4, c_dry, and c_key2 or c_alive, and you never ran out through the kitchen.
 */
(function () {
  'use strict';

  const say = (speaker, text, cond) => (cond === undefined ? { speaker, say: text } : { speaker, say: text, if: cond });
  const clamp = (n) => Math.max(0, Math.min(5, n));
  const mem = (s) => s.get('memory');
  // Raise the Memory meter (clamped 0..5), then run an optional extra effect.
  const m = (n, extra) => (s) => {
    s.setVar('memory', clamp(mem(s) + n));
    if (extra) extra(s);
  };
  // Narration that changes as memory returns: low (0-1), mid (2-3), high (4-5).
  const byMem = (lo, mid, hi) => (s) => (mem(s) <= 1 ? lo : mem(s) <= 3 ? mid : hi);

  const CELESTE = ['c_glass', 'c_vial', 'c_ledger', 'c_felix'];
  const EVIDENCE = {
    c_glass: 'the coral lipstick on the rim of the glass you drank from',
    c_vial: 'the empty sedative vial in the bin of Room 11',
    c_ledger: 'the ledger entry for Room 11: "Mrs C. Vane", paid in cash',
    c_felix: 'the night manager\'s debts, and the envelope marked "C." under his register',
  };
  const proof = (s) => s.count(...CELESTE);
  const joinList = (items) => (items.length === 1 ? items[0] : items.slice(0, -1).join('; ') + '; and ' + items[items.length - 1]);
  const proofList = (s) => joinList(CELESTE.filter((f) => s.has(f)).map((f) => EVIDENCE[f]));
  const ruizThere = (s) => s.has('ruiz_ally') || s.has('ruiz_up');
  const strongCase = (s) => mem(s) >= 3 && proof(s) >= (s.has('suspect') ? 3 : 2) && ruizThere(s);
  const secretReady = (s) => mem(s) >= 4 && s.has('c_dry') && (s.has('c_key2') || s.has('c_alive')) && !s.has('ran');
  const canConfess = (s) => s.has('c_wound') && mem(s) >= 3;

  registerStory({
    id: 'mystery-room-9',
    title: 'Room 9, Hotel Calloway',
    category: 'mystery',
    tagline: 'You wake beside a dead man. The police are knocking. And you can\'t trust a word you remember.',
    description: 'You come to on the carpet of Room 9 in the faded Hotel Calloway with no memory of last night, a stranger\'s blood-dark temple a yard from your hand, and a detective at the door. Everything you think you know about this room is a little bit wrong. Remember enough, and you might find out whether the killer is the widow, the night manager, or you.',
    cover: '🗝️',
    accent: '#a8324a',
    ambient: 'mystery',
    scene: 'hotel-room',
    warning: 'Contains: a body, drugging, a fight, a fall from a height.',
    vars: { memory: 0 },
    hud: [{ var: 'memory', label: 'Memory', icon: '🧠', max: 5 }],
    voices: {
      narrator: { gender: 'male', pitch: 0.85, rate: 0.92, accent: 'en-US', note: 'low noir narrator, a little too sure of himself' },
      'Detective Ruiz': { gender: 'female', pitch: 0.85, rate: 0.86, accent: 'en-US', note: 'patient, quiet, dangerous; smells lies' },
      'Felix Moreau': { gender: 'male', pitch: 1.25, rate: 1.3, accent: 'en-GB', note: 'night manager, eager to please, talks too fast' },
      'Celeste Ashby': { gender: 'female', pitch: 1.0, rate: 0.82, accent: 'en-GB', note: 'elegant widow, ice in every vowel' },
      'Leonard': { gender: 'male', pitch: 0.65, rate: 0.85, accent: 'en-AU', volume: 0.7, note: 'a voice from memory, warm then cornered' },
    },
    start: 'intro',
    scenes: {
      // ------------------------------------------------------------------ ROOM 9
      intro: {
        title: '3:52 AM — Room 9',
        art: '🛏️🩸',
        mood: 'night',
        weather: 'rain',
        scene: 'hotel-room',
        fx: 'heartbeat',
        timer: 8,
        text: [
          'You wake with your cheek in the carpet and the taste of pennies in your mouth. A radiator ticks. Somewhere below, a tram grinds through the rain. **Hotel Calloway, Room 9.** You know that because **your room key** lies on the nightstand, a brass 9 stamped on its paper sleeve.',
          'You know other things too, with the easy confidence of a dream. That is **your wedding ring**, warm and heavy on your finger. That is **the glass you drank from**, a thumb of whisky left in the bottom. That is your coat over the chair.',
          'And that is a dead man.',
          'He lies between the bed and the window, on his back, one arm flung out as if he were reaching for the curtains. Grey suit, silver hair, a dark wet stain at the temple. You know the face from the papers. **Leonard Ashby.** The name arrives before the reason does.',
          'You remember nothing of last night. Nothing at all. The last thing in your head is rain on a windscreen.',
          'Three hard knocks shake the door in its frame.',
          say('Detective Ruiz', 'Police. Open the door.'),
          'The chain isn\'t on. The bathroom door stands open. You have seconds.',
        ],
        timeout: {
          text: 'You froze.',
          fx: 'redflash',
          set: ['suspect', 'caught'],
          outcome: [
            'You stand there with your hands open and your mouth open and nothing comes out of either. The knocking stops. A key card whispers into the lock.',
            'The door swings in on a woman in a rain-dark trench coat, with the night manager hovering at her shoulder, holding his master key like a crucifix. They look at the body. Then they look at you, standing over it.',
          ],
          next: 'door_caught',
        },
        choices: [
          {
            text: 'Drag him into the bathtub',
            hint: 'Hide it. Think later.',
            art: '🛁',
            scene: 'hotel-room',
            set: ['hid_body', 'c_dry'],
            effect: m(1),
            outcome: [
              'He is heavier than he looks. You hook your hands under his arms and haul, and his head lolls against your wrist. It\'s warm. Warmer than you expected a dead man to be. You get him over the lip of the tub and rip the shower curtain closed.',
              'On your way back you glance at the place where he lay. The carpet is **dry**. Not a drop. *Head wounds bleed*, says a cool, professional voice somewhere in the back of your skull. You have no idea whose voice that is. You don\'t have time to ask.',
              'You smooth your hair, breathe once, and reach for the door handle.',
            ],
            next: 'door_hidden',
          },
          {
            text: 'Open the door',
            hint: 'Innocent people open doors. Are you innocent?',
            art: '🚪',
            set: ['ruiz_ally', 'opened'],
            outcome: [
              'Your hand is on the handle before your fear can vote. You pull the door wide and step back so she can see everything: the room, the man, you.',
              'Whatever happens next, you think, at least you did not lie to her first. It feels like the only clean thing you have.',
            ],
            next: 'door_open',
          },
          {
            text: 'Go through his pockets',
            hint: 'Who is he? Why is he here?',
            art: '👛',
            set: ['c_key2', 'suspect', 'caught'],
            effect: m(1),
            outcome: [
              'You drop to your knees beside him. Wallet: cash, cards, a photo of a woman in pearls. Breast pocket: a key card in a paper sleeve stamped **11**. A second room key. Why would a man staying in Room 9 carry the key to Room 11?',
              'Your fingers brush his wrist and something flutters under them, once, faint as a moth. Your own pulse, surely, hammering in your fingertips. You let go.',
              'Behind you, the lock clicks. A master key. You are still on your knees with his wallet in your hand when the door opens.',
            ],
            next: 'door_caught',
          },
        ],
      },

      door_hidden: {
        title: '3:54 AM — The Doorway',
        art: '🕵️‍♀️🚪',
        mood: 'night',
        scene: 'hotel-room',
        text: [
          'You open the door six inches and fill the gap with as much of yourself as you can.',
          'A woman in a rain-dark trench coat. Fifties, a streak of grey through black hair, and eyes that have heard every excuse twice and enjoyed none of them. She holds up a badge without looking at it.',
          say('Detective Ruiz', 'Detective Inês Ruiz. We had a call. A woman said a man was screaming in Room 9.'),
          'Behind her hovers the night manager, all waistcoat and apology: a thin man with a pencil moustache and fingers that will not stop drumming on his thigh.',
          say('Felix Moreau', 'I told the detective, a mistake, surely, a prank, the Calloway is a quiet house, very quiet, sir, terribly sorry to wake you.'),
          'Ruiz says nothing. Her eyes slide past your shoulder to the open bathroom door, and stay there.',
          byMem(null, 'Over her shoulder, the plastic Do Not Disturb sign swings on its hook. It is on the outside of your door. You don\'t remember putting it there.', 'Over her shoulder, the Do Not Disturb sign swings on its hook. You never hung it. Somebody wanted the cleaners to stay away until morning.'),
        ],
        choices: [
          {
            text: 'Let her look around',
            hint: 'Nothing to hide. Supposedly.',
            art: '🔦',
            outcome: [
              'You step aside with a host\'s little gesture. Ruiz walks straight past the bed, straight into the bathroom, and pulls the shower curtain back in one long rattle.',
              'The tub is **empty**. Not a hair. Not a smear. The curtain rings swing and tick against the rail.',
              'You grab the doorframe. Ruiz watches you do it.',
              say('Detective Ruiz', 'You look like a man who expected something to be in there.'),
              'She hands you a card. *I\'ll be in the lobby. Don\'t leave the building.* When she\'s gone, you notice the bathroom has a second door, painted shut for decades by the look of it. Except the paint around the bolt is freshly cracked.',
            ],
            next: 'corridor',
          },
          {
            text: 'Tell her: there\'s a body in the bath',
            hint: 'Get ahead of it.',
            art: '🗣️',
            set: ['ruiz_ally'],
            outcome: [
              'The words come out of you in a rush. Ruiz\'s hand goes under her coat. She moves past you, low and fast, and tears the shower curtain aside.',
              'The tub is **empty**.',
              say('Detective Ruiz', 'Either somebody is playing a game with you, or you\'re playing one with me. I haven\'t decided which I\'d prefer.'),
              'She tries the old connecting door in the bathroom wall. Locked, from the other side. Felix, in the corridor, says Room 11 has been vacant all week, very vacant, sir. Ruiz writes that down. She writes everything down.',
            ],
            next: 'corridor',
          },
          {
            text: 'Lie: you\'re alone, you were dreaming out loud',
            hint: 'Smile. Yawn. Close the door.',
            art: '😴',
            set: ['suspect'],
            outcome: [
              'You yawn. You apologise for the noise. Nightmares, ever since you were a boy. Ruiz smiles in a way that means the opposite of a smile.',
              say('Detective Ruiz', 'Sweet dreams, then. I\'ll be in the lobby. Do not leave this building.'),
              'You close the door and lean on it until your heart slows. Then you walk to the bathroom. The tub is **empty**.',
              'In the wall beside the sink, an old connecting door you never noticed stands open half an inch. As you watch, it eases shut, and on the far side a bolt slides home.',
            ],
            next: 'corridor',
          },
        ],
      },

      door_open: {
        title: '3:54 AM — Lights Out',
        art: '🕵️‍♀️💡',
        mood: 'night',
        scene: 'hotel-room',
        fx: 'flash',
        text: [
          'The detective takes in the room in one sweep: the bed, the body, you. She is fifties, a grey streak through black hair, a rain-dark trench coat. She does not draw her gun. Somehow that is worse.',
          say('Detective Ruiz', 'Detective Inês Ruiz. Sit on the bed. Hands on your knees. Good.'),
          'She kneels by Ashby and presses two fingers to his throat, waits, frowns, moves them, waits again. *Nothing I can find.* She cuffs your wrist to the bedframe and steps into the corridor to radio it in.',
          'The night manager appears at her elbow, all waistcoat and apology. *Detective, your captain, on the house line, at the end of the hall, terribly urgent.* Their footsteps go away.',
          'Then the lights die. Every one, all at once, with a heavy *clunk* from somewhere below, like a breaker thrown.',
          'In the dark you hear the bathroom\'s old connecting door scrape open. Something heavy dragged across carpet. A soft, wet grunt of effort, and then a second sound that makes the hair on your arms rise: a short, ragged **breath** that did not come from you.',
          'The lights stutter back. The floor between the bed and the window is empty. Ruiz is in the doorway with her torch in one hand and her gun, finally, in the other.',
          say('Detective Ruiz', 'Where is he?'),
        ],
        choices: [
          {
            text: 'Show her the glass: "I think I was drugged"',
            hint: 'The glass you drank from.',
            art: '🥃',
            set: ['c_glass'],
            effect: m(1),
            outcome: [
              'You point with your free hand. Ruiz lifts the whisky glass by its base with a gloved hand and turns it to the light.',
              'There is lipstick on the rim. A soft coral pink, half a kiss. You stare at it. *The glass you drank from.* You aren\'t wearing lipstick. You never have.',
              say('Detective Ruiz', 'Your shade?'),
              'She bags it. Then, slowly, she unlocks your cuff. *No body, no crime. Yet. You don\'t leave the building.*',
            ],
            next: 'corridor',
          },
          {
            text: 'Tell her everything you don\'t remember',
            hint: 'Which is everything.',
            art: '🪪',
            set: ['c_contract'],
            effect: m(1),
            outcome: [
              'You tell her the truth: you don\'t know. You don\'t know how you got here, or why, or who he was to you. Ruiz listens without blinking, then fishes your wallet from your coat on the chair.',
              'A laminated card. Your photo. **LICENSED PRIVATE INVESTIGATOR.** You read it twice. It feels like reading a stranger\'s diary and finding your own handwriting.',
              say('Detective Ruiz', 'A private eye who doesn\'t know what he saw. That\'s new. Stay in the building.'),
              'She unlocks the cuff and pockets the key without taking her eyes off you.',
            ],
            next: 'corridor',
          },
          {
            text: 'Point at the connecting door',
            hint: 'You heard it open.',
            art: '🚪',
            outcome: [
              'You point at the bathroom wall. Ruiz crosses the room and tries the old door. Locked, from the other side.',
              say('Felix Moreau', 'Room 11, Detective? Vacant all week. Very vacant. The heating, you understand, broken, nobody in there at all.'),
              'He says it too fast and too fully, like a child who has practised. Ruiz writes it down. She writes everything down. Then she unlocks your cuff, slowly, and tells you not to leave the building.',
            ],
            next: 'corridor',
          },
        ],
      },

      door_caught: {
        title: '3:54 AM — Caught',
        art: '🚨🔗',
        mood: 'blood',
        scene: 'hotel-room',
        fx: 'shake',
        text: [
          'The detective has her gun out before the door finishes opening. Fifties, a grey streak through black hair, a rain-dark trench coat, a voice that does not need to be raised.',
          say('Detective Ruiz', 'Detective Inês Ruiz. Away from him. On the floor. Now.'),
          'You are cuffed to the iron bedframe in the time it takes to breathe twice. The night manager, a thin man in a waistcoat with a pencil moustache, wrings his hands in the doorway as if he is the one in trouble.',
          say('Felix Moreau', 'Oh, oh dear, sir, oh dear. Detective, your captain is on the house line, end of the hall, he said urgent.'),
          'Ruiz goes. And the lights go out. A heavy *clunk* below, a breaker thrown. In the dark you hear the bathroom\'s old connecting door scrape open, and something dragged across the carpet, and a breath, short and ragged, that is not yours.',
          'When the lights stutter back, the dead man is gone. Ruiz stands in the doorway with a torch and a face like a closed fist.',
          say('Detective Ruiz', 'You have about one minute to start making sense.'),
        ],
        choices: [
          {
            text: 'Swear you never touched him',
            hint: 'She saw you with his wallet.',
            art: '🙅',
            outcome: [
              'You swear on your mother. You swear on everything. Ruiz lets you finish, then holds up Leonard Ashby\'s wallet, which she took from your hand five minutes ago.',
              say('Detective Ruiz', 'Here\'s the thing about lies. They\'re heavy. Eventually people put them down. I\'m very good at waiting.'),
              'She uncuffs you anyway. No body, no crime. Yet. *Don\'t leave the building.*',
            ],
            next: 'corridor',
          },
          {
            text: 'Say it: "He was warm. Too warm."',
            hint: 'And that flutter under your fingers.',
            art: '🌡️',
            set: ['c_dry'],
            effect: m(1),
            outcome: [
              'It sounds insane out loud. You say it anyway. He was warm. There\'s no blood on the carpet. Look. Head wounds bleed, don\'t they? Where is the blood?',
              'Ruiz looks. She crouches and runs a gloved palm over the carpet where he lay. Bone dry. For the first time something other than suspicion crosses her face.',
              say('Detective Ruiz', 'Huh.'),
              'She uncuffs you. *Don\'t leave the building.* But she says it like a question she\'s asking herself.',
            ],
            next: 'corridor',
          },
          {
            text: 'Say nothing at all',
            hint: 'Anything you say...',
            art: '🤐',
            outcome: [
              'You look at the empty carpet and keep your mouth shut. Ruiz pulls a chair round and sits on it backwards, and for a long minute you just watch each other.',
              say('Detective Ruiz', 'Smart. Or guilty. They look the same from here.'),
              'Finally she unlocks the cuff, because there is no body and therefore no crime. Yet. *Don\'t leave the building.*',
            ],
            next: 'corridor',
          },
        ],
      },

      // ------------------------------------------------------------------ THE FIFTH FLOOR
      corridor: {
        title: '4:15 AM — Fifth Floor',
        art: '🚪🕯️',
        mood: 'fog',
        scene: 'corridor',
        text: [
          'The fifth-floor corridor of the Calloway is a long throat of burgundy carpet and brass sconces, half of them dead. Rain ticks on a skylight. Somewhere a pipe knocks like someone asking to be let in.',
          byMem(
            'You walk it like you\'ve walked it a hundred times. Your floor. Your hotel. You twist your wedding ring, an old habit, and it steadies you.',
            'You walk it like you\'ve walked it a hundred times. Except you keep reaching for the wrong door handle. Your wedding ring slides loose on your finger, too big. Has it always been too big?',
            'You walk it like a stranger, because you are one. You have never stayed here. You live across the river in two rooms over a laundrette. The ring on your finger is too big because it was made for another man\'s hand.',
          ),
          'Ashby is gone. Ruiz is downstairs. Next to Room 9, **Room 11** sits behind its dark door with a brass number that needs polishing. At the far end, the old cage lift, and beside it a door marked **SERVICE STAIRS**.',
          { if: 'c_key2', text: 'The key card for Room 11 is a stiff little rectangle in your pocket.' },
          { if: 'suspect', text: 'A uniformed officer sits in a chair by the lift, pretending to read his phone. Ruiz didn\'t leave you entirely alone.' },
        ],
        choices: [
          {
            text: 'Search Room 9 properly',
            hint: 'Before anyone else does.',
            art: '🔍',
            outcome: [
              'You let yourself back in and close the door, and the room seems to hold its breath with you.',
              'This time you don\'t look at the floor first. You look at everything.',
            ],
            next: 'search9',
          },
          {
            text: 'Try the door of Room 11',
            hint: 'The other side of the connecting door.',
            art: '🗝️',
            outcome: [
              { if: 'c_key2', text: 'You slide the key card from Ashby\'s pocket into the lock. Green light. Of course it works.', else: 'You try the handle without much hope. The latch hasn\'t caught. Whoever left last left in a hurry.' },
              'The door swings inward on a darkness that smells of gardenias.',
            ],
            next: 'room11',
          },
          {
            text: 'Take the service stairs. Out.',
            hint: 'Whatever this is, you don\'t have to be here for it.',
            art: '🏃',
            scene: 'stairwell',
            outcome: [
              'You walk, then you don\'t walk. The service door bangs behind you and you are taking the concrete stairs two at a time, past cleaning carts and bags of laundry, your own breath roaring in your ears.',
              'Between the third and second floors, someone is standing on the landing.',
            ],
            next: 'stairwell',
          },
          {
            text: 'Call the lift down to the lobby',
            hint: 'Face Ruiz. On your own terms.',
            art: '🛗',
            scene: 'elevator',
            outcome: [
              'The cage lift arrives with a shudder and a groan, like an old dog getting up. You drag the grille shut and press **L**. The car begins its slow, swaying descent.',
            ],
            next: 'lift',
          },
        ],
      },

      search9: {
        title: '4:20 AM — Room 9, Again',
        art: '🔍🛏️',
        mood: 'night',
        scene: 'hotel-room',
        text: [
          'Without the body in it, Room 9 is almost ordinary. A bed, barely slept on. A window full of wet city lights. An old iron radiator under the sill, ticking as it cools.',
          byMem(
            'Your room. Your key on the nightstand. Your coat on the chair. The glass you drank from. It all fits.',
            'Your room. Your key. Your coat. Your glass. You keep saying *your* as though repeating it will make it true. Something about the glass is bothering you. Something about the ring.',
            'Not your room. The key on the nightstand has a pen mark on the sleeve: *L.A.* Not your glass. Not your ring. Only the coat is yours, and the fear.',
          ),
          { if: 'c_glass', text: 'The glass is gone, bagged by Ruiz, but you remember the coral kiss on the rim.' },
          'The radiator has a dent in its top edge, and in the dent, a few silver hairs.',
        ],
        choices: [
          {
            text: 'Read the inside of your wedding ring',
            hint: 'It\'s been bothering you.',
            art: '💍',
            fx: 'glitch',
            effect: m(1),
            outcome: [
              'You twist it off. It comes too easily. Inside the band, engraved in a looping hand: **L. & C. — 1998.**',
              'Your initials are neither of those. You stand very still while the knowledge arrives, quiet and complete: you are not married. You have never been married. Somebody pushed a dead man\'s ring onto your finger while you slept.',
              'Why would anyone want you wearing his ring? Unless the story they\'re telling is *you took it from him*.',
            ],
            next: 'flash_glass',
          },
          {
            text: 'Search your coat',
            hint: 'At least that is definitely yours.',
            art: '🧥',
            set: ['c_contract', 'c_key2'],
            effect: m(1),
            outcome: [
              'Inner pocket: a slim leather wallet. A laminated card with your photo. **LICENSED PRIVATE INVESTIGATOR.** You read it twice, the way you\'d reread a stranger\'s diary that turned out to be in your handwriting.',
              'Folded behind it, an envelope of cash and a letter on Ashby Developments paper. *Retainer, as agreed. Follow my wife. Tell me everything.* Signed **Leonard Ashby**.',
              'And tucked in the envelope\'s flap, a second key card. **Room 11.** A note in the same hand: *Next door, if you need me. — L.*',
            ],
            next: 'flash_glass',
          },
          {
            text: 'Get down on the floor where he lay',
            hint: 'See what the carpet saw.',
            art: '🧎',
            set: ['c_dry', 'c_wound'],
            effect: m(1),
            outcome: [
              'You kneel where he lay and run your palms over the pile. **Dry.** All of it. A man with a wound at his temple lay here long enough for you to wake up, and he did not bleed on the carpet. Not one drop.',
              'Under the bed, your fingers find something cold: a brass letter opener, the kind good hotels used to put on writing desks. There is blood on the point. Dried, brown, real.',
              'You push up your sleeve without knowing why. A long, shallow cut runs down your forearm, crusted shut. You hadn\'t felt it. You feel it now.',
            ],
            next: 'flash_glass',
          },
        ],
      },

      room11: {
        title: '4:20 AM — Room 11',
        art: '🌸🧳',
        mood: 'fog',
        scene: 'hotel-room',
        text: [
          'Room 11 is the mirror image of Room 9, and nobody has slept in it. The bedspread is taut. The heating, which Felix will swear is broken, purrs warmly under the window.',
          'Gardenias. The smell is everywhere, expensive and cold. On the luggage rack sit two suitcases: one small and crocodile-skinned, one a man\'s battered leather case, packed and strapped.',
          'In the bathroom wall, the connecting door to Room 9 has its bolt drawn back on this side. There are two long scuff marks on the tiles, side by side. Heels, dragged.',
          byMem(
            'None of it means anything to you. It\'s just a room. You\'ve never been in it.',
            'You have a strange feeling you\'ve been in this room before. Recently. Sitting down.',
            'You have been in this room before. Last night. You sat in that armchair while someone told you to relax.',
          ),
        ],
        choices: [
          {
            text: 'Open the man\'s suitcase',
            hint: 'Packed and strapped, ready to go.',
            art: '🧳',
            set: ['c_alive'],
            effect: m(1),
            outcome: [
              'Shirts folded with military care. A shaving kit. And in the lid pocket, a passport. The photo is Leonard Ashby, silver hair cut shorter and dyed darker. The name is **Laurent Ash**.',
              'Under it, a one-way ticket to Lisbon. Departing **today**, 8:15 AM.',
              'Dead men don\'t need passports. Dead men certainly don\'t need them dyed to match.',
            ],
            next: 'flash_glass',
          },
          {
            text: 'Check the bathroom bin',
            hint: 'People throw away the truth.',
            art: '🗑️',
            set: ['c_vial'],
            effect: m(1),
            outcome: [
              'Tissues. A hotel shower cap. And a tiny brown glass vial with the label scratched off, the kind a pharmacist hands over a counter with a warning.',
              'You uncap it and sniff. Bitter, chemical, faintly sweet. The smell goes straight past your nose and into the back of your skull, and the room tilts.',
              'Someone, last night, said: *Drink up. You\'ll sleep like a baby.*',
            ],
            next: 'flash_glass',
          },
          {
            text: 'Sit in the armchair',
            hint: 'Something about it.',
            art: '🪑',
            fx: 'glitch',
            effect: m(1),
            outcome: [
              'You lower yourself into the velvet armchair, and your body knows it. The dip in the cushion. The angle of the lamp. The cold rim of a glass pressed into your hand.',
              'A woman\'s voice, close to your ear, smelling of gardenias: *You\'ve had a terrible shock. Drink this.*',
              'You were here. You were here *after*. After what?',
            ],
            next: 'flash_glass',
          },
        ],
      },

      flash_glass: {
        title: 'Last Night — Fragment',
        art: '🥃🌀',
        mood: 'void',
        scene: 'void',
        fx: 'glitch',
        text: [
          'The world slides sideways. The rain stops mid-air.',
          '*Last night. Room 9. 11:40 PM.* The lamp is on. Leonard Ashby is alive, jacket off, sleeves rolled, pouring with a generous hand. He looks tired and expensive and afraid.',
          say('Leonard', 'Sit down. You look like a man who needs a drink. So, tell me. What did you find out about my wife?'),
          'You have a folder on your knee. You know, suddenly and absolutely, what\'s in it, and that it isn\'t about his wife at all.',
          byMem(
            'A glass is set in front of you by a hand you can\'t quite see.',
            'A glass is set in front of you by a hand with coral nails. Not Leonard\'s hand.',
            'A glass is set in front of you by a hand with coral nails and a diamond the size of a sugar cube. Somebody else is in this memory, and they have been very careful to stay out of the light.',
          ),
        ],
        choices: [
          {
            text: 'Follow the hand up to the face',
            hint: 'Who poured your drink?',
            art: '💄',
            set: ['c_glass'],
            effect: m(1),
            outcome: [
              'You make yourself turn your head inside the memory. The hand becomes a wrist, a black silk sleeve, a pearl necklace, and above it a face like a cameo: high cheekbones, coral lips, eyes the grey of a January sea.',
              '*The woman in the photo in his wallet.* His wife. Celeste.',
              'She smiles and taps the rim of your glass, leaving a soft coral print of her lipstick where she sipped it first, to show you it was safe.',
            ],
            next: 'lift',
          },
          {
            text: 'Look down at your own hands',
            hint: 'What were you doing?',
            art: '✋',
            set: ['c_wound'],
            effect: m(1),
            outcome: [
              'You look down. Your hands are shaking. Not with fear. With adrenaline, the bright tremble that comes *after*.',
              'Your knuckles are split. There is a thin line of blood running down your forearm into your palm. Across the room, the brass letter opener lies on the carpet where somebody dropped it.',
              'Whatever the drink was for, it came after a fight. And you were in it.',
            ],
            next: 'lift',
          },
          {
            text: 'Listen to what Leonard is saying',
            hint: 'His mouth is still moving.',
            art: '👂',
            set: ['c_alive'],
            effect: m(1),
            outcome: [
              'You let the image go and hold on to the sound. Leonard\'s voice, low and urgent, not talking to you. Talking to someone at the connecting door.',
              say('Leonard', 'After tonight, Leonard Ashby has no more debts. Not to the bank, not to Corrigan, not to anyone. A clean slate, darling.'),
              'A dead man talking about a clean slate. You file it away, the way you apparently file things for a living.',
            ],
            next: 'lift',
          },
        ],
      },

      // ------------------------------------------------------------------ THE WAY DOWN
      stairwell: {
        title: '4:21 AM — Service Stairs',
        art: '🚬🪜',
        mood: 'night',
        scene: 'stairwell',
        text: [
          'Felix Moreau, the night manager, is smoking on the landing with his phone pressed to his ear, hunched like a man being shouted at.',
          say('Felix Moreau', 'I said Friday, Sal. Friday. I\'ll have all of it, every penny, I have a, a new arrangement, you\'ll see.'),
          'He sees you and almost drops the phone. Then his face does something remarkable: it rearranges itself into perfect, gleaming helpfulness.',
          say('Felix Moreau', 'Sir! Sir. A terrible night. Listen. Listen to me. I can get you out through the kitchen. Back door, alley, taxi rank. No one sees. You were never here. Yes?'),
          byMem(
            'He\'s offering you a way out. That\'s kind of him. Isn\'t it?',
            'He is very keen for you to be gone. You wonder why the night manager cares where you are.',
            'You know that cologne. Bergamot and cheap tobacco. It was in Room 9 last night, close, very close, while somebody pulled your arms into your coat.',
          ),
        ],
        choices: [
          {
            text: 'Let Felix take you out through the kitchen',
            hint: 'Run now. Think later.',
            art: '🍳',
            set: ['ran'],
            scene: 'city-night',
            outcome: [
              'He leads you down, fast, through a basement kitchen where the ovens are cold and the strip lights buzz, past a dish pit, out through a steel door into the rain.',
              say('Felix Moreau', 'Go. Don\'t come back. Good luck, sir. Truly.'),
              'The door clangs shut. Felix looked, at the very end, enormously relieved.',
            ],
            next: 'kitchen_exit',
          },
          {
            text: 'Ask him who Sal is',
            hint: 'Every man has a Sal.',
            art: '📞',
            set: ['c_felix'],
            outcome: [
              'His smile cracks down the middle. *Sal. My cousin. Family. You know.* You don\'t know, so you wait, and waiting is a weapon Felix Moreau has no defence against.',
              say('Felix Moreau', 'Forty thousand. Cards. It\'s nothing, a misunderstanding, and it\'s being sorted, a lady has very kindly, I mean, a friend has, it\'s sorted.'),
              'A lady. You let him lead you down to the lobby, chattering all the way, and you watch his hands shake as he lights another cigarette from the end of the last one.',
            ],
            next: 'lobby',
          },
          {
            text: 'Grab him by the waistcoat: "Who\'s in Room 11?"',
            hint: 'He knows something. Shake it loose.',
            art: '✊',
            fx: 'shake',
            effect: m(1),
            outcome: [
              'You slam him against the wall harder than you meant to. His cigarette goes tumbling down the stairwell, a red spark falling five floors.',
              say('Felix Moreau', 'Nobody! Vacant! Vacant all week!'),
              'But his eyes flick upward, towards the fifth floor, and the smell of his cologne hits you like a slap: bergamot and cheap tobacco. You were close to that smell last night. He was holding you up.',
              'You let him go. He straightens his waistcoat with trembling fingers, and you take the last flights down to the lobby without him.',
            ],
            next: 'lobby',
          },
        ],
      },

      kitchen_exit: {
        title: '4:30 AM — The Alley',
        art: '🌧️🚕',
        mood: 'neon',
        weather: 'rain',
        scene: 'city-night',
        text: [
          'The alley behind the Calloway runs with rain. At its mouth a single taxi idles under a flickering sign, its light on. Free. Beyond it the city glitters, enormous and indifferent and full of places to disappear.',
          'Somewhere a siren is getting closer. Or further away. You honestly can\'t tell.',
          byMem(
            'You don\'t remember what happened in that room. Maybe you don\'t want to.',
            'You remember a glass, a hand, a ring that isn\'t yours. Fragments. Not enough to clear you. Maybe enough to hang you.',
            'You remember more than you\'d like. Enough to know you didn\'t do this alone, if you did it at all.',
          ),
          'A payphone glows on the corner, the last one in the city, probably. Ruiz\'s card is in your pocket.',
        ],
        choices: [
          {
            text: 'Run for the taxi',
            hint: 'Gone by sunrise.',
            art: '🚕',
            outcome: [
              'You fold yourself into the back seat and give the first address that comes into your head: the coach station. The driver doesn\'t look at you. The Calloway\'s neon sign shrinks in the rear window and then is swallowed by the rain.',
              'You don\'t look back. People who look back get caught.',
            ],
            next: 'end_fugitive',
          },
          {
            text: 'Go back in through the front door',
            hint: 'You need to know.',
            art: '🚪',
            scene: 'lobby',
            outcome: [
              'You walk round the block in the rain, past shuttered cafés and a pharmacy with its shutters down, and push through the Calloway\'s revolving door, dripping on the marble.',
              'Felix, behind the front desk, goes the colour of the marble. He got there before you somehow. Of course he did.',
            ],
            next: 'lobby',
          },
          {
            text: 'Call Ruiz from the payphone',
            hint: 'Tell her you ran. Tell her you\'re coming back.',
            art: '☎️',
            set: ['ruiz_ally'],
            outcome: [
              'She picks up on the first ring, as if she has been waiting.',
              say('Detective Ruiz', 'You ran. And then you called me. That\'s an unusual combination.'),
              'You tell her the night manager walked you out the back. There\'s a short silence on the line, the kind you can hear someone thinking in. *Come to the front door. I\'ll be in the lobby. Walk slowly.*',
            ],
            next: 'lobby',
          },
        ],
      },

      lift: {
        title: '4:25 AM — The Cage Lift',
        art: '🛗🌑',
        mood: 'night',
        scene: 'elevator',
        fx: 'heartbeat',
        timer: 8,
        text: [
          'The old lift sways down its shaft past floor after floor, the cables singing. There is a speckled mirror on the back wall.',
          byMem(
            'In it: you. Tired, unshaven, a wedding ring catching the light. A man who had a rough night. That\'s all.',
            'In it: you. Except the face looks older than you expected, and the ring catches the light on the wrong hand, and you can\'t remember which hand is right.',
            'In it: a private investigator who was drugged, dressed and arranged like a mannequin. Someone buttoned your shirt wrong. Someone put a stranger\'s ring on your finger. You look like evidence.',
          ),
          'Between the third floor and the second, the lift jerks to a stop. The light bulb pops. Total dark.',
          'A crackle from the brass intercom grille.',
          say('Felix Moreau', 'Don\'t panic, sir! Old wiring, old, old wiring. Don\'t touch anything. Don\'t move.'),
          'In the darkness, faint and impossible, you smell gardenias. The car creaks, as if it\'s settling. Or as if something heavy has just stepped onto its roof.',
        ],
        timeout: {
          text: 'You waited in the dark.',
          fx: 'shake',
          outcome: [
            'You do as you\'re told. You don\'t move. The lift drops two feet with a bang that throws you into the grille, and catches, and hangs there, swinging.',
            'Above you, something slides off the roof of the car and is gone. A minute later the bulb flickers on and the lift crawls the rest of the way down, as polite as anything. Felix is waiting at the bottom, apologising.',
          ],
          next: 'lobby',
        },
        choices: [
          {
            text: 'Pry the doors open',
            hint: 'You are not dying in a box.',
            art: '💪',
            outcome: [
              'You jam your fingers into the gap and heave. The outer doors grind apart onto a slab of brick wall and, at chest height, the bottom two feet of the second-floor landing.',
              'You haul yourself up and out, scraping your shins, and roll onto the carpet. Behind you, the empty car drops with a crash that shakes the floor. When you look down the shaft, the roof hatch is open.',
              'You take the main stairs the rest of the way down, keeping to the wall.',
            ],
            next: 'lobby',
          },
          {
            text: 'Press the emergency phone',
            hint: 'Keep Felix talking.',
            art: '📟',
            set: ['c_felix'],
            outcome: [
              'You find the button by touch. The line clicks open on the front desk. Felix doesn\'t realise it\'s connected. He\'s talking to someone else, low and fast.',
              say('Felix Moreau', '...no, madame, he\'s in the lift, I\'ve got him stuck, you said the rest of the money after, you promised, the whole forty, I did everything you...'),
              'Then he notices the light on his console and the line goes dead. Two minutes later the lift jerks back into life as if nothing happened.',
            ],
            next: 'lobby',
          },
          {
            text: 'Close your eyes and let the memory come',
            hint: 'The dark is where it lives.',
            art: '🧠',
            fx: 'glitch',
            set: ['c_contract'],
            effect: m(1),
            outcome: [
              'You stop fighting the dark and sink into it.',
              '*Last night. This lift. 11:15 PM.* You ride it up alone, sober, wide awake, a file under your arm labelled **ASHBY — POLICIES**. You\'re a private investigator. You\'re good at it. Your client is waiting in Room 9, and what you found isn\'t what he paid you to find.',
              'The bulb comes back on. The lift resumes its descent. You open your eyes and, for the first time tonight, you recognise the face in the mirror.',
            ],
            next: 'lobby',
          },
        ],
      },

      // ------------------------------------------------------------------ THE LOBBY
      lobby: {
        title: '4:40 AM — The Lobby',
        art: '🛎️📖',
        mood: 'gold',
        scene: 'lobby',
        text: [
          'The Calloway\'s lobby was grand in 1925 and has been apologising for it ever since. Cracked marble, a chandelier with half its crystals missing, potted palms going brown at the edges.',
          'Felix is behind the front desk, on the telephone, his back half-turned. The **guest ledger** lies open on the counter beside the bell, a real leather book, because the Calloway never trusted computers.',
          'In a wing chair by the dead fireplace, Detective Ruiz sits with a paper cup of coffee, watching you over the rim like she has been watching that door all night.',
          { if: 'ran', text: 'She has seen you come in from the street, wet. She doesn\'t say anything about it. She doesn\'t have to.' },
          byMem(
            'This is your hotel. You\'ve been coming here for years. Haven\'t you?',
            'You don\'t remember ever crossing this lobby before last night.',
            'You crossed this lobby exactly once before, last night at 11:10, and Felix greeted you by name, because Leonard Ashby had told him to expect you.',
          ),
        ],
        choices: [
          {
            text: 'Read the guest ledger while Felix is busy',
            hint: 'Hotels write everything down.',
            art: '📖',
            set: ['c_ledger'],
            effect: m(1),
            outcome: [
              'You turn the book towards you with one finger. Last night\'s page. **Room 9: L. Ashby**, checked in 6 PM. And there, two lines down: **Room 11: Mrs C. Vane**, checked in 9:40 PM. *Paid cash.*',
              'Room 11. Vacant all week, very vacant, sir.',
              'You run your finger down the whole page, then the page before. Your own name isn\'t in the book at all. You never had a room here. *Your room key.* It was never your room.',
            ],
            next: 'interview',
          },
          {
            text: 'Ask Felix for a coffee and watch his hands',
            hint: 'Nervous men leak.',
            art: '☕',
            set: ['c_felix'],
            outcome: [
              'He makes it himself, too fast, slopping it into the saucer. While he fusses with sugar you lean on the counter and look down behind it.',
              'Under the cash drawer, half hidden, a thick cream envelope. Written on it in fountain pen, one letter: **C.** It\'s fat with notes.',
              'Felix sees you looking. He slides a folded newspaper over it with the casual air of a man who has never been casual in his life.',
            ],
            next: 'interview',
          },
          {
            text: 'Go straight to Ruiz',
            hint: 'Before she comes to you.',
            art: '🕵️‍♀️',
            set: ['ruiz_ally'],
            outcome: [
              'You cross the marble and sit down opposite her without being asked. She raises one eyebrow by perhaps a millimetre.',
              say('Detective Ruiz', 'Walking towards the detective. Bold. Guilty men usually make me walk to them.'),
              'She pushes a second paper cup of coffee across the little table. She bought two. She knew you would come.',
            ],
            next: 'interview',
          },
        ],
      },

      interview: {
        title: '4:50 AM — By the Fireplace',
        art: '🕵️‍♀️☕',
        mood: 'gold',
        scene: 'lobby',
        text: [
          'Ruiz opens a notebook and reads from it without looking down.',
          say('Detective Ruiz', 'Leonard Ashby. Sixty-one. Property developer. Owes money to the bank, and more money to a man called Corrigan who doesn\'t use banks. Three weeks ago, he took out a second life policy. Four million. Beneficiary: his wife.'),
          say('Detective Ruiz', 'At 3:41 this morning, a woman rang us from the payphone in this lobby. She said a man was screaming in Room 9. She didn\'t leave a name.'),
          'She closes the notebook.',
          say('Detective Ruiz', 'So. Who are you, and what were you doing in a dead man\'s room?'),
          byMem(
            'It\'s a fair question. You wish you knew the answer.',
            'You know some of the answer now. It doesn\'t make you look any better.',
            'You know the answer. You were doing your job. That\'s what got you here.',
          ),
          { if: 'suspect', text: 'She hasn\'t forgotten the doorway. Every lie you\'ve told tonight is sitting in that notebook, waiting for you.' },
        ],
        choices: [
          {
            text: 'Tell her you\'re a private investigator',
            hint: 'If you can prove it.',
            art: '🪪',
            effect: (s) => { if (s.has('c_contract')) { s.set('ruiz_ally'); s.unset('suspect'); } else s.set('suspect'); },
            outcome: [
              { if: 'c_contract', text: 'You lay your licence on the table, and Ashby\'s letter beside it. *Follow my wife. Tell me everything.* Ruiz reads it twice, the second time slower.', else: 'You tell her you\'re a private investigator. She asks for your licence. You pat your pockets, you haven\'t found it, you don\'t even know if you have one. She smiles politely.' },
              s => (s.has('c_contract')
                ? { speaker: 'Detective Ruiz', say: 'A PI hired to watch the wife, three weeks after the husband insures himself for four million. Now that\'s a coincidence I\'d like to buy a drink.' }
                : { speaker: 'Detective Ruiz', say: 'Everyone\'s a detective at five in the morning. Try again later, with paper.' }),
            ],
            next: 'celeste',
          },
          {
            text: 'Lay out what you\'ve found',
            hint: 'Clue by clue.',
            art: '🗂️',
            effect: (s) => { if (proof(s) >= 1 || s.has('c_dry')) s.set('ruiz_ally'); else s.set('suspect'); },
            outcome: [
              s => (proof(s) >= 1
                ? `You lay it out for her, piece by piece: ${proofList(s)}.`
                : (s.has('c_dry') ? 'You don\'t have much. A man who was warm, and a carpet with no blood on it. You tell her anyway.' : 'You start talking and realise you have nothing. A feeling. A ring that doesn\'t fit. Ruiz lets you run out of words on your own.')),
              { if: 'c_dry', text: 'When you get to the dry carpet, Ruiz stops writing. *Head wounds bleed*, she says, quietly, as if she\'s been thinking the same thing for an hour.' },
              s => ((proof(s) >= 1 || s.has('c_dry'))
                ? { speaker: 'Detective Ruiz', say: 'That\'s not nothing. Keep going. And keep me close.' }
                : { speaker: 'Detective Ruiz', say: 'That\'s a lot of words for nothing.' }),
            ],
            next: 'celeste',
          },
          {
            text: 'Lie: you sell insurance, you met him at the bar',
            hint: 'Something simple. Something boring.',
            art: '🎭',
            set: ['suspect'],
            outcome: [
              'It comes out smooth. Insurance. Business trip. A nightcap with a stranger, too many whiskies, you passed out. These things happen.',
              say('Detective Ruiz', 'You touch your ring when you lie. Did you know that? You\'ve touched it four times since you sat down.'),
              'You look down. Your thumb is on the band, turning it. Turning a ring that isn\'t even yours.',
            ],
            next: 'celeste',
          },
        ],
      },

      celeste: {
        title: '5:05 AM — The Widow',
        art: '🖤💎',
        mood: 'gold',
        scene: 'lobby',
        text: [
          'The revolving door turns, and the temperature of the lobby drops five degrees.',
          'She wears black, already. Black silk, black gloves, a single rope of pearls. Silver-blonde hair pinned up as if for the opera. Her eyes are the grey of a January sea, and they are perfectly dry.',
          say('Celeste Ashby', 'Detective. I was told my husband was... involved in something. In this hotel. I came at once.'),
          'Ruiz rises and tells her, gently, what little anyone knows. Celeste Ashby takes it standing up, like a statue receiving the weather. Then she turns her head and looks directly at you.',
          say('Celeste Ashby', 'That\'s him. That\'s the man Leonard hired. He\'s been following us for weeks. Leonard said he was obsessed. He said if anything ever happened to him, I should look at *that man*.'),
          byMem(
            'You have never seen her before in your life. You\'re almost sure.',
            'You have seen her before. Through a long lens. In a café. Through a hotel window. You were following her. Weren\'t you?',
            'You have seen her before. Last night, in Room 11, bending over you with a glass, her pearls swinging against your cheek.',
          ),
          'She draws off one glove, finger by finger. She says she needs air. Then she walks to the lift and presses the topmost button, **R**.',
        ],
        choices: [
          {
            text: 'Watch her hands as she speaks',
            hint: 'The face lies. The hands forget to.',
            art: '💅',
            set: ['c_glass'],
            effect: m(1),
            outcome: [
              'As she peels off the glove you see her nails: a soft coral pink. And when she turns to the lift, the same shade on her lips, freshly applied.',
              { if: 'opened', text: 'The same shade as the kiss on the rim of the glass Ruiz bagged upstairs. Ruiz has noticed it too. You watch her notice.', else: 'The same shade as the kiss on the rim of the glass you drank from. You see it now, sharp as a photograph: a coral half-moon on cut crystal.' },
              'The lift doors close on her. The needle above them swings, floor by floor, all the way to the top.',
            ],
            next: 'roof_stairs',
          },
          {
            text: 'Say it out loud: "You poured my drink, Mrs Ashby."',
            hint: 'You remember her hand on the glass.',
            art: '🥃',
            if: 'c_glass',
            set: ['ruiz_ally'],
            outcome: [
              'The lobby goes very quiet. Celeste Ashby\'s face doesn\'t move a muscle. But her hand, the bare one, closes on her glove until the knuckles whiten.',
              say('Celeste Ashby', 'I have no idea what this creature is talking about.'),
              'Ruiz saw the hand. You see Ruiz see it. The lift doors close on the widow, and the needle swings all the way to the top.',
              say('Detective Ruiz', 'Go. I\'ll be right behind you.'),
            ],
            next: 'roof_stairs',
          },
          {
            text: 'Close your eyes. Let her voice pull the memory up.',
            hint: 'You\'ve heard that voice before.',
            art: '🧠',
            fx: 'glitch',
            outcome: [
              'You know that voice. You heard it last night, through a door. You grip the back of the wing chair and let the lobby dissolve.',
            ],
            next: 'flash_fight',
          },
        ],
      },

      flash_fight: {
        title: 'Last Night — 1:10 AM',
        art: '🗡️🌀',
        mood: 'void',
        scene: 'void',
        fx: 'glitch',
        text: [
          '*Room 9. Ten past one.* The folder lies open on the bed between you. A life insurance policy. Four million. And under it, the thing you found that he never asked you to find: a one-way ticket in a name that isn\'t quite his.',
          say('Leonard', 'You weren\'t supposed to find that. I hired you to watch *her*. I hired you to be the man who\'d swear in court that she was the cold one.'),
          'His hand moves to the writing desk. To the brass letter opener. His face changes. Panic makes ordinary men into strangers.',
          say('Leonard', 'I\'m sorry. I really am. I can\'t let you walk out of here with that.'),
          byMem(
            'The memory tears at the edges. You have to choose which part of it to hold on to.',
            'The memory is sharper now. Two moments burn brightest. You can only hold one.',
            'You can hold it now, nearly all of it. But two moments matter most, and you need to look at one of them straight.',
          ),
        ],
        choices: [
          {
            text: 'Remember the fight',
            hint: 'What did you do?',
            art: '✊',
            set: ['c_wound'],
            effect: m(1),
            outcome: [
              'He lunges. You catch his wrist; the blade scores a line down your forearm, hot as a match. You shove him with everything you have.',
              'He goes backwards over the corner of the bed, and his head meets the iron radiator with a sound you will hear for the rest of your life. He drops. He doesn\'t move.',
              'You stand over him with blood running into your palm. *You did this.* Whatever else happened in that room, this part was you.',
            ],
            next: 'roof_stairs',
          },
          {
            text: 'Remember what happened after',
            hint: 'You stood there. Then the door opened.',
            art: '🚪',
            set: ['c_alive'],
            effect: m(1),
            outcome: [
              'The connecting door opens. Gardenias. Celeste Ashby kneels beside her husband in her black silk and lays two fingers against his throat, and does not cry out, and does not call anyone.',
              say('Celeste Ashby', 'He\'s breathing, you idiot. Oh, but this is better. This is *perfect*.'),
              'Then she stands and turns to you with a smile like a closing door and a crystal glass in her hand. *You\'ve had a terrible shock. Drink this.*',
            ],
            next: 'roof_stairs',
          },
        ],
      },

      roof_stairs: {
        title: '5:15 AM — To the Roof',
        art: '🪜☔',
        mood: 'night',
        scene: 'stairwell',
        text: [
          'The lift needle reads **R**. The quickest way up is the narrow iron staircase behind the lift shaft, which smells of rust and pigeons.',
          'You are three steps up when Felix Moreau catches your sleeve, breathless, smiling, sweating through his waistcoat.',
          say('Felix Moreau', 'Sir, the roof, it\'s slippery up there, dangerous, the parapet is very low. Let me come with you. I know every inch. I\'ll keep you safe.'),
          byMem(
            'He seems genuinely concerned. It\'s nice that someone is.',
            'He seems very concerned. Concerned the way a man is about a parcel he hasn\'t been paid for yet.',
            'He held your arms last night while she buttoned your shirt. Now he wants to stand behind you on a roof with a low parapet.',
          ),
          'On the landing wall, an old house phone hangs in a brass cradle. Through the stairwell window, the sky over the city is just beginning to go grey.',
        ],
        choices: [
          {
            text: 'Let Felix come up with you',
            hint: 'Two pairs of eyes.',
            art: '🤝',
            set: ['felix_up'],
            outcome: [
              'You nod. Felix beams and follows you up, close behind, so close you can hear him breathing. He doesn\'t offer to go first.',
            ],
            next: 'rooftop',
          },
          {
            text: 'Call Ruiz on the house phone first',
            hint: 'You want a witness who isn\'t on her payroll.',
            art: '☎️',
            set: ['ruiz_up'],
            outcome: [
              'You lift the receiver and dial the front desk. It\'s Ruiz who answers; she\'s been standing over Felix\'s switchboard. *Roof. Now. Come quietly.* She doesn\'t ask why.',
              'Felix\'s smile goes stiff as a mask. He follows you up anyway, a few steps behind.',
            ],
            next: 'rooftop',
          },
          {
            text: 'Shake him off and take the fire escape',
            hint: 'Arrive where nobody is looking.',
            art: '🪟',
            effect: m(1),
            outcome: [
              'You pull your sleeve free and go out through the stairwell window instead, onto the black iron fire escape, rain hammering on the slats. The last ladder brings you up over the parapet behind the water tank.',
              'Crouched there in the dark, you hear Celeste on her phone, low and urgent: *Five minutes. The car is in the lane. Then we\'re nobody, darling.*',
              'Darling. Whoever she\'s talking to, he\'s close enough that she doesn\'t need the phone.',
            ],
            next: 'rooftop',
          },
        ],
      },

      rooftop: {
        title: '5:20 AM — The Roof of the Calloway',
        art: '🌆🖤',
        mood: 'neon',
        weather: 'rain',
        scene: 'rooftop',
        fx: 'heartbeat',
        timer: 8,
        text: [
          'The roof is a forest of chimney pots and dead aerials, shining with rain. The parapet is knee-high. Five storeys below, the street is a black river of headlights.',
          'Celeste Ashby stands near the edge with a small crocodile-skin case, her pearls glowing in the grey light. She doesn\'t look surprised to see you.',
          s => (s.has('felix_up')
            ? 'Felix is right behind you. Close. Closer than he needs to be.'
            : 'The stair door bangs. Felix comes out onto the roof behind you, panting, and stops between you and the way down.'),
          { if: 'ruiz_up', text: 'Below, on the iron stairs, you hear footsteps that are not hurrying, because they belong to someone who doesn\'t need to.' },
          say('Celeste Ashby', 'You poor thing. You really don\'t remember, do you? You killed my husband. You hit him until he stopped. Felix saw you. Didn\'t you, Felix?'),
          say('Felix Moreau', 'I... yes. Yes, madame. I saw.'),
          s => {
            if (secretReady(s)) return 'And there, behind her, by the rusted water tank: a man in a dark raincoat and a hat, very still, the way men stand when they are trying to be furniture. Silver hair under the brim. Dyed darker, but not quite enough. He was warm. There was no blood. You felt his pulse, and you told yourself it was yours.';
            if (s.has('ran') && s.has('c_dry')) return 'By the rusted water tank lies a dark raincoat, dropped in a puddle, and a set of footprints in the wet tar leading to the next roof. Whoever was waiting up here didn\'t wait for you.';
            return byMem(
              'Your head swims. The roof tilts. Everything she says sounds like it might be true.',
              'The pieces are there, in your head, sharp-edged. You just have to say them in the right order.',
              'You remember almost all of it now. The question is which part you\'re brave enough to say.',
            )(s);
          },
        ],
        timeout: {
          text: 'You said nothing.',
          fx: 'redflash',
          outcome: [
            'You open your mouth and nothing comes. Celeste watches you struggle, and then she screams. A beautiful scream, a widow\'s scream, aimed down the stairwell.',
            say('Celeste Ashby', 'Help! He\'s trying to throw me off! Help me!'),
            'By the time the officers come through the door, she is cowering against the parapet and you are standing over her with your hands out, exactly the way you were standing over her husband.',
          ],
          next: 'end_framed',
        },
        choices: [
          {
            text: 'Expose her. Say it all, in order.',
            hint: 'Every clue. Every fragment.',
            art: '🗣️',
            outcome: [
              s => (proof(s) >= 1
                ? `You say it all, out loud, into the rain: ${proofList(s)}.`
                : 'You say what you have. It isn\'t much: a feeling, a smell of gardenias, a ring that doesn\'t fit. You hear how thin it sounds even as you say it.'),
              'Celeste laughs, a small silver sound, and looks past you towards the stair door.',
            ],
            next: 'reckoning',
          },
          {
            text: 'Confess: "He came at me. I pushed him."',
            hint: 'You remember the fight. It was you.',
            art: '🩸',
            if: canConfess,
            outcome: [
              'You hear yourself say it. The letter opener. The cut on your arm. The radiator. The sound. You pull up your sleeve and show them the line of dried blood, in the grey dawn, for anyone to see.',
              'Celeste\'s mouth opens. For once, she has no line ready. You\'ve just told the truth she was planning to tell about you, except in your version, he swung first.',
            ],
            next: 'end_selfdef',
          },
          {
            text: 'Walk past her to the man by the water tank',
            hint: 'The dead man is standing up.',
            art: '🎩',
            if: secretReady,
            fx: 'flash',
            outcome: [
              'You walk straight past Celeste as if she isn\'t there. She grabs for your arm and misses. The man by the water tank turns to run, slips on the wet tar, and goes down on one knee.',
              'His hat rolls away across the roof. Silver hair, dyed darker. A dressing on his temple. Breathing hard, alive, furious.',
              say('Leonard', 'You were supposed to sleep until noon.'),
            ],
            next: 'end_secret',
          },
          {
            text: 'Step back from the edge, towards Felix',
            hint: 'He did say he\'d keep you safe.',
            art: '🫱',
            outcome: [
              'Your heel finds the parapet and your stomach drops. You step away from it, back, towards the only other man on this roof.',
              say('Felix Moreau', 'That\'s it, sir. I\'ve got you. I\'ve got you.'),
              'His hands land on your shoulders, gentle as a tailor\'s. Then they push.',
            ],
            next: 'end_fall',
          },
        ],
      },

      reckoning: {
        redirect: (s) => (strongCase(s) ? 'end_unmask' : 'end_framed'),
      },

      // ------------------------------------------------------------------ ENDINGS
      end_unmask: {
        art: '💄⚖️',
        mood: 'dawn',
        scene: 'rooftop',
        ending: { id: 'coral-kiss', title: 'The Coral Kiss', type: 'good' },
        text: [
          'The stair door opens and Detective Ruiz walks out onto the roof, unhurried, her coat dark with rain. She has heard all of it. You can tell by the way she\'s holding her notebook: closed, finished.',
          say('Detective Ruiz', 'Mrs Ashby. "Mrs C. Vane", Room 11, paid in cash. I\'d like to talk to you about a glass of whisky.'),
          'Celeste looks at Felix. Felix looks at his shoes. And then, beautifully, catastrophically, Felix starts talking, and does not stop until they reach the station.',
          s => `By noon Ruiz has it on paper: ${proofList(s)}. Celeste Ashby is charged with drugging you, perverting the course of justice and conspiracy to defraud an insurer of four million.`,
          'Leonard Ashby\'s body is never found. Celeste says nothing about that. She says nothing about anything, through three lawyers, for eleven months.',
          { if: 'c_wound', text: 'You tell Ruiz about the letter opener and the radiator too. She writes it down, closes the notebook, and says that a man attacking you with a blade is the opposite of a crime. You still dream about the sound.' },
          'The Calloway changes hands in the spring. The new owners keep the cage lift and paint over Room 11\'s connecting door. You take the ring back to Ruiz in an envelope. She keeps it in her desk, she says, for when the dead man comes to collect it.',
        ],
      },

      end_framed: {
        art: '🔗🚔',
        mood: 'blood',
        scene: 'city-night',
        ending: { id: 'perfect-suspect', title: 'The Perfect Suspect', type: 'bad' },
        text: [
          'It\'s Celeste\'s story against your silence, and Celeste tells a lovely story.',
          'The obsessed private eye. The dead man\'s ring on your finger. Your fingerprints on his wallet and the letter opener under the bed. A night manager who saw everything and weeps when he says so. A grieving widow in black pearls who barely holds herself together on the stand.',
          { if: 'suspect', text: 'And Ruiz\'s notebook, full of the lies you told her in the first hour, read aloud to the jury one at a time.' },
          { if: 'ruiz_ally', text: 'Ruiz visits you once, afterwards. She says she believes about half of what you told her, which is more than anyone else. She says half isn\'t enough to stand on.' },
          'No body is ever found. It turns out you don\'t need one. Twelve people decide you did something terrible in Room 9, and the not-remembering, in the end, sounds exactly like a guilty man.',
          'Eighteen months in, a postcard arrives at the prison. A Lisbon tram, sunshine, blue tiles. No message. No signature. Just a faint smell of gardenias, and a coral kiss in the corner.',
        ],
      },

      end_selfdef: {
        art: '🩸🌅',
        mood: 'dawn',
        scene: 'dawn',
        ending: { id: 'it-was-you', title: 'It Was You', type: 'neutral' },
        text: [
          'Ruiz takes your statement in a small grey room as the sun comes up, and you give it all to her: the policy, the ticket, the letter opener, the cut, the shove, the radiator. The terrible ordinary sound.',
          'It\'s the strangest relief of your life. The worst thing in your head is finally outside it, sitting on a table between you, and it is *yours*.',
          say('Detective Ruiz', 'A man came at you with a blade, and you pushed him. That\'s not murder. That\'s Tuesday, in my line of work.'),
          { if: 'c_glass', text: 'The coral lipstick on the glass buys Celeste a long conversation with a prosecutor. She leaves it smiling.' },
          'You\'re charged with nothing. You leave the station into a cold, bright morning with your own name back and a stranger\'s death on your hands, and you don\'t know which of those weighs more.',
          'The body is never found. Some nights you lie awake and wonder why a dead man would need to be carried away so carefully. Some nights you decide it\'s better not to wonder.',
          'A year later, a postcard: a Lisbon tram, blue tiles, sunshine. No message. You put it in a drawer and you don\'t take it out again.',
        ],
      },

      end_fugitive: {
        art: '🚕🌃',
        mood: 'neon',
        weather: 'rain',
        scene: 'city-night',
        ending: { id: 'nobody-now', title: 'Nobody Now', type: 'neutral' },
        text: [
          'The coach leaves at 5:50 AM. You are on it, in the back row, coat collar up, a stranger\'s ring in your pocket because you couldn\'t make yourself throw it away.',
          'By the time the coach crosses the river, your face is on the morning news. *Private investigator sought in connection with the death of developer Leonard Ashby.* Running made the story for them. Celeste Ashby, the news says, is being comforted by friends.',
          'You get very good at being nobody. New name, new town, cash jobs. You never find out what happened in Room 9, and the not-knowing becomes a room you live in.',
          { if: 'c_dry', text: 'Some nights you wake up with the feel of his wrist under your fingers, that one faint flutter, and you wonder whether the dead man is out there being nobody too.' },
          'Once, years later, in a café by the sea, you think you see a silver-haired man at a corner table, laughing with a woman in pearls. By the time you\'ve paid and stood up, the table is empty.',
        ],
      },

      end_fall: {
        art: '🌧️⬇️',
        mood: 'blood',
        scene: 'city-night',
        fx: 'redflash',
        ending: { id: 'low-parapet', title: 'The Low Parapet', type: 'death' },
        text: [
          'The parapet catches the backs of your knees, and then there is nothing behind you but rain.',
          'Five storeys is long enough to remember everything. That\'s the cruel joke. On the way down it all comes back at once: the folder, the fight, the glass, her pearls swinging, Felix\'s cologne as he pulled your arms into your coat.',
          'The papers call it a guilty man\'s last act. *Suspect in Ashby killing leaps from hotel roof.* The night manager, visibly shaken, tells reporters he tried to grab you. He tried so hard.',
          'Felix Moreau pays off his cousin Sal the following Friday, every penny. Celeste Ashby collects four million in the spring.',
          'And somewhere warm, by the sea, a dead man buys a round of drinks.',
        ],
      },

      end_secret: {
        art: '🎩🗝️',
        mood: 'dawn',
        scene: 'rooftop',
        ending: { id: 'no-more-debts', title: 'No More Debts', type: 'secret' },
        text: [
          'For a long moment nobody moves: the widow with her case, the night manager by the door, and the dead man on one knee in a puddle, a fresh dressing taped over the bruise you gave him.',
          { if: 'ruiz_up', text: 'Then Ruiz steps out of the stairwell, already holding her badge up, and says the only thing there is to say.', else: 'Then the stair door bangs open and Ruiz comes through it, gun low, because she followed the widow\'s lift up too. Of course she did. She writes everything down.' },
          say('Detective Ruiz', 'Mr Ashby. You look remarkably well.'),
          'It comes apart like wet paper. A heart-slowing drug from a vet\'s cabinet to make his pulse disappear. Stage blood at the temple. His ring on your finger and a sedative in your glass. A passport for Laurent Ash, a ticket to Lisbon, and four million to collect for a husband killed by an obsessed private eye who couldn\'t remember a thing.',
          s => (s.has('c_key2')
            ? 'Ruiz holds up the Room 11 key card you hand her, and the connecting door does the rest.'
            : 'The passport in the case in Room 11 does the rest.'),
          'Leonard and Celeste Ashby are charged with insurance fraud, drugging, perverting the course of justice and the attempted framing of an innocent man. Felix Moreau, who flipped before they reached the car, is charged with less, and seems almost grateful.',
          { if: 'c_wound', text: 'Your shove, the radiator, the fight: Ruiz writes it all down and calls it what it was. Self-defence, against a man who turned out to be very much alive.' },
          'At dawn you take the ring off for the last time and drop it into Leonard Ashby\'s palm as they walk him past.',
          '*You remembered,* he says, almost admiringly. You did. Every single bit of it.',
        ],
      },
    },
  });
})();
