/*
 * The Last Passenger — MysteryFate story.
 *
 * SOLUTION (for authors): Augustin Vale's bank collapses on Monday. To vanish, he hired a down-and-out
 * actor, Otto Lenz, to travel as "Vale" in compartment 7, while Vale himself boarded as the silent
 * "Sister Agnès" in compartment 6. He paid Luca Marchetti (drowning in debt to Croft) in Banque Vale
 * notes — half up front — to kill the double at 1 AM in the Arlberg tunnel. Luca put on a gramophone
 * record of himself playing Paganini's Caprice No. 24 as an alibi, slipped through the (unbolted)
 * connecting door 8 -> 7, stabbed Lenz, went back to 8, then looped a steel violin E string over the
 * bolt knob on 7's side through the gap above the door and pulled it shut. The avalanche jolt made the
 * record skip — a live player could never repeat half a bar perfectly. Rosin from the string stayed on
 * the bolt. At 3 AM Luca cut the fuse and tried to garrotte the detective with an E string.
 *
 * Luca clues: c_rosin c_string c_skip c_record c_debt c_envelope c_attack c_lie c_trap
 * Twist clues: c_double (corpse isn't Vale), c_mouse (nickname), c_man (the nun is a man), c_hand (paper trail)
 * Secret ending: c_double + c_mouse + (c_man or c_hand), then accuse "Augustin Vale" via "Someone else".
 */
(function () {
  'use strict';

  const say = (speaker, text, cond) => (cond === undefined ? { speaker, say: text } : { speaker, say: text, if: cond });

  const LUCA = ['c_rosin', 'c_string', 'c_skip', 'c_record', 'c_debt', 'c_envelope', 'c_attack', 'c_lie', 'c_trap'];
  const EVIDENCE = {
    c_rosin: 'the rosin smear and the fresh scratch on the connecting-door bolt',
    c_string: 'the missing steel E string',
    c_skip: 'the music that skipped back half a bar when the train lurched',
    c_record: 'the scratched gramophone record of Marchetti playing Caprice No. 24',
    c_debt: 'Marchetti\'s eighty thousand francs of gambling markers',
    c_envelope: 'the crisp Banque Vale notes in Marchetti\'s hands',
    c_attack: 'the stink of rosin on the man who tried to strangle you',
    c_lie: 'his lie about playing through the avalanche',
    c_trap: 'catching him red-handed at dawn',
  };
  const TWIST = {
    c_double: 'the dead man\'s workman\'s hands, his cheap darned socks and a signet ring that never belonged to him',
    c_mouse: 'a father who forgot his daughter\'s pet name',
    c_man: 'a nun who shaves, coughs like a man and walks in size-eleven brogues',
    c_hand: 'a nun\'s paper trail written in Augustin Vale\'s vain Greek epsilons',
  };
  const proof = (s) => s.count(LUCA);
  const methodClue = (s) => s.has('c_rosin') || s.has('c_string');
  const twistReady = (s) => s.has('c_double') && s.has('c_mouse') && (s.has('c_man') || s.has('c_hand'));
  const twistCount = (s) => s.count(Object.keys(TWIST));

  const joinList = (items) => {
    if (items.length === 1) return items[0];
    return items.slice(0, -1).join('; ') + '; and ' + items[items.length - 1];
  };
  const lucaList = (s) => joinList(LUCA.filter((f) => s.has(f)).map((f) => EVIDENCE[f]));
  const twistList = (s) => joinList(Object.keys(TWIST).filter((f) => s.has(f)).map((f) => TWIST[f]));

  // A short notebook summary used in the dawn and accusation scenes.
  const notebook = (s) => {
    const n = proof(s);
    const out = [];
    if (n === 0) out.push('Your notebook is thin. A dead banker, a locked door, and a carriage full of people who hated him. Nothing points anywhere for certain.');
    else out.push(`Your notebook holds: ${lucaList(s)}.`);
    if (twistCount(s) >= 1) out.push(`And in the margin, underlined twice, the things that don't fit at all: ${twistList(s)}.`);
    return out;
  };

  registerStory({
    id: 'last-passenger',
    title: 'The Last Passenger',
    category: 'mystery',
    tagline: 'An avalanche. A locked compartment. Five suspects and one retired detective who should have stayed home.',
    description: 'The overnight sleeper through the Alps is buried in a tunnel, and the richest man aboard is dead behind a bolted door. You have until the snowplough breaks through at dawn to find out who killed Augustin Vale — and whether the man on the bunk is who everyone thinks he is.',
    cover: '🚂',
    accent: '#c9a227',
    ambient: 'mystery',
    warning: 'Contains: murder, a strangling attempt, blood.',
    scene: 'train-car',
    voices: {
      narrator: { gender: 'male', pitch: 0.85, rate: 0.92, accent: 'en-GB', note: 'weary retired detective, dry, unhurried' },
      'Augustin Vale': { gender: 'male', pitch: 0.7, rate: 0.85, accent: 'en-GB', note: 'pompous old banker, cultured, imperious' },
      'Clémence Vale': { gender: 'female', pitch: 0.95, rate: 1.05, accent: 'en-GB', note: 'sharp, dry-eyed journalist daughter' },
      'Luca Marchetti': { gender: 'male', pitch: 1.15, rate: 1.12, accent: 'en-US', note: 'charming, theatrical violinist, too relaxed' },
      'Harlan Croft': { gender: 'male', pitch: 0.75, rate: 1.0, accent: 'en-US', note: 'big Chicago cardsharp, gravelly' },
      'Emil': { gender: 'male', pitch: 1.35, rate: 1.25, accent: 'en-IE', note: 'terrified nineteen-year-old conductor' },
      'Sister Agnès': { gender: 'male', pitch: 0.65, rate: 0.8, accent: 'en-GB', volume: 0.6, note: 'the disguised banker, low cultured murmur' },
      'Inspector Haas': { gender: 'male', pitch: 0.9, rate: 0.95, accent: 'en-AU', note: 'gruff, impatient country policeman' },
    },
    start: 'intro',
    scenes: {
      // ------------------------------------------------------------------ ACT ONE
      intro: {
        scene: 'train-car',
        title: '11:40 PM — The Dining Car',
        art: '🕯️🚂',
        mood: 'candle',
        weather: 'snow',
        text: [
          'Snow hammers the dining-car windows like thrown gravel. Inside, candles shiver in brass holders, and the whole car smells of cognac, wet wool and money.',
          'You retired from the Sûreté eleven years ago. You still count the exits when you sit down. Old habits. Old ghosts.',
          'Tonight there are five people worth counting. **Augustin Vale**, the banker, silver-bearded, holding court over a bottle of 1911 Armagnac. His estranged daughter **Clémence**, ink on her fingers, who has not touched her soup. A Venetian violinist, **Luca Marchetti**, all cheekbones and cufflinks. An American, **Harlan Croft**, dealing cards with a gold tooth and a smile that never reaches his eyes. And in the corner, veiled and silent, **Sister Agnès**, writing in a small black book.',
          'Plus **Emil**, the conductor: nineteen, sweating through his collar, glancing at the banker as though he might explode.',
          say('Augustin Vale', 'Another bottle, boy. We\'ll all be snowed in together soon enough. We may as well be drunk.'),
          'The train grinds upward toward the Arlberg tunnel. This is the last quiet hour any of you will have.',
        ],
        choices: [
          {
            text: 'Watch Vale and his daughter',
            hint: 'They\'re about to fight. You can feel it.',
            art: '👀',
            set: ['c_double'],
            outcome: [
              'You order a coffee you won\'t drink and turn your chair toward the Vales.',
              'It starts low and turns ugly fast. Clémence leans in and whispers something urgent. You catch *Monday*, and *the auditors*. Vale waves her off with a heavy, square hand.',
              say('Augustin Vale', 'Go to bed, Clémence. We\'ll talk in Vienna.'),
              'She flinches as though he slapped her. And as he gestures you notice something small and wrong: the gold signet ring on his finger keeps sliding loose and spinning, and he keeps shoving it back with his thumb. A man doesn\'t wear a ring for forty years and have it fit like a borrowed one.',
            ],
            next: 'avalanche',
          },
          {
            text: 'Sit in on Croft\'s card game',
            hint: 'The violinist is losing. Badly.',
            art: '🃏',
            set: ['c_debt'],
            outcome: [
              'Croft deals you in with a wink. Inside ten minutes you\'ve spotted the shiner, a polished cigarette case he parks beside the deck, and the bottom deal. You fold every hand. Luca doesn\'t.',
              say('Harlan Croft', 'Another marker, maestro? Your signature\'s getting shaky.'),
              say('Luca Marchetti', 'My signature is a work of art, Signor Croft. Like my playing. Like my losing.'),
              'He signs another IOU with a flourish. You glimpse the running total in Croft\'s little notebook and actually whistle. Luca Marchetti owes more than his violin, his flat in Venice and possibly his soul are worth.',
            ],
            next: 'avalanche',
          },
          {
            text: 'Retire early to compartment 5',
            hint: 'Your neighbour is the nun.',
            art: '🛏️',
            set: ['c_man'],
            outcome: [
              'You leave them to it. The sleeping-car corridor is all brass rails and walnut panels, the wheels rattling underfoot like teeth.',
              'Twenty minutes later, dozing over a Simenon, you hear the nun come back to compartment 6 on the other side of the paper-thin wall.',
              'Water splashing. Then a sound you have heard every morning of your adult life: the slow, scraping rasp of a straight razor across a stubbled jaw. And a cough, deep and chesty, unmistakably a man\'s.',
              'Then silence, as if whoever is in there has just remembered how thin the walls are.',
            ],
            next: 'avalanche',
          },
        ],
      },

      avalanche: {
        scene: 'train-exterior',
        title: '1:00 AM — The Arlberg Tunnel',
        art: '🏔️💥',
        mood: 'storm',
        weather: 'snow',
        fx: 'shake',
        timer: 8,
        text: [
          'You wake to a sound like the mountain clearing its throat.',
          'Then the roar. The whole carriage bucks. Your suitcase leaps off the rack, the lamp swings wild, and somewhere ahead the locomotive screams on its brakes as a white wall of snow buries the tunnel mouth behind you.',
          'And under it all, from somewhere down the corridor, a violin. Someone is playing Paganini, the twenty-fourth Caprice, as though the world isn\'t ending.',
          'The train shrieks. Lurches. Something is about to give. **Move.**',
        ],
        timeout: {
          text: 'You froze.',
          outcome: [
            'You hesitate a heartbeat too long. The carriage lurches and throws you against the washstand. Your temple meets brass, and the world goes white, then black, then very loud.',
            'When your eyes focus again the train has stopped and the violin has stopped, and all you have learned is how hard an Austrian washbasin is.',
          ],
          next: 'discovery',
        },
        choices: [
          {
            text: 'Brace yourself and listen',
            scene: 'train-car',
            hint: 'Something about that music...',
            art: '🎻',
            set: ['c_skip'],
            outcome: [
              'You wedge yourself into the corner of the bunk and shut your eyes. It\'s an old detective\'s trick: when the world goes mad, pick one thread and follow it.',
              'You follow the violin. Fast, brilliant runs, and then the carriage slams sideways and the music *jumps*. It stutters back half a bar and plays the same phrase again, note for note, identical down to the breath.',
              'Then it carries on as if nothing happened. A man playing live would have stumbled, stopped, sworn. He would not have repeated himself perfectly.',
            ],
            next: 'discovery',
          },
          {
            text: 'Throw open your door and look',
            scene: 'corridor',
            hint: 'See who\'s out there.',
            art: '🚪',
            set: ['c_man'],
            outcome: [
              'You haul your door open as the lights stutter. The corridor strobes: brass, black, brass, black.',
              'Emil is sprinting toward the front of the carriage, his cap gone. And at the far end, slipping back into compartment 6, is Sister Agnès, her habit hitched up in one fist, taking the corridor in long, heavy strides.',
              'Beneath the black hem, for one flash of light, you see shoes. Men\'s brogues. Size eleven if they\'re an inch. Her door clicks shut as the train shudders to a halt.',
            ],
            next: 'discovery',
          },
          {
            text: 'Run for the dining car to help',
            scene: 'train-car',
            hint: 'There\'s glass and boiling coffee up there.',
            art: '🏃',
            set: ['c_key'],
            outcome: [
              'You stagger along the corridor toward the front of the train. In the swaying vestibule you collide with Harlan Croft in a silk dressing gown.',
              'Something brass flies from his hand and rings on the floor plate: a key on a conductor\'s chain. He snatches it up before you can, gold tooth flashing.',
              say('Harlan Croft', 'Cufflink. Clumsy of me.'),
              'In the dining car the steward is picking glass out of his palm. Nobody else is hurt. But you keep thinking about the key.',
            ],
            next: 'discovery',
          },
        ],
      },

      discovery: {
        scene: 'train-car',
        title: '2:04 AM — Compartment 7',
        art: '🚪🩸',
        mood: 'night',
        fx: 'heartbeat',
        text: [
          'An hour later, the knocking starts.',
          'Emil stands outside compartment 7 with a brandy tray rattling in his hands. Mr. Vale ordered it for two o\'clock, he stammers. Mr. Vale is not answering.',
          'The door is bolted from the inside. Emil\'s master key turns the lock, but the bolt won\'t budge. So you put your shoulder to it, once, twice, and the walnut splinters.',
          'Cold hits you first. The window is furred with ice and frozen solid in its frame; you couldn\'t lever it open with a crowbar. Then the smell: copper and Armagnac.',
          'Augustin Vale lies across the bunk in silk pyjamas, a narrow wound under his heart, his silver beard stiff with blood. There\'s no weapon. The only other way in is the connecting door to compartment 8, and that\'s bolted on this side too.',
          'A locked room. On a stopped train. In a tunnel sealed with snow.',
          { if: 'c_key', text: 'Croft is at the back of the crowd with one hand buried in his dressing-gown pocket. You remember the brass key in the vestibule.' },
          { if: 'c_skip', text: 'Somewhere at the back of your skull, a violin is still skipping.' },
          'The corridor is filling behind you: Croft, Clémence white as paper, Luca with his collar open, Sister Agnès with her rosary. In a minute they\'ll all be in here touching things. You have time to examine **one** thing properly.',
        ],
        choices: [
          {
            text: 'The dead man\'s hands',
            hint: 'Dead men can\'t lie.',
            art: '🖐️',
            set: ['c_double'],
            outcome: [
              'You kneel and lift the right hand. It\'s wrong, and it takes you a second to say how.',
              'The palm is a workman\'s palm, with thick yellow calluses at the base of each finger and an old burn across the knuckles. The nails are clean only because someone scrubbed them hard, and recently. Bankers have soft hands. These have hauled rope.',
              'Then the signet ring. You ease it along the finger and it slides off with no resistance at all. The skin beneath is the same weathered brown as the rest. No pale band. This ring hasn\'t lived on this finger for forty years. It moved in this week.',
            ],
            next: 'phaseA',
          },
          {
            text: 'The connecting-door bolt',
            hint: 'How do you lock a room you\'ve already left?',
            art: '🔩',
            set: ['c_rosin'],
            outcome: [
              'Not the body. The *room*. A corpse tells you how; a room tells you who.',
              'You crouch at the connecting door. The brass bolt on this side is shot home. You angle your candle along it: on the knob, a faint pale powder, slightly tacky, and a fine fresh scratch circling its neck, as though something thin and hard had been looped round it and pulled tight.',
              'You touch the powder to your tongue. Bitter. Piney. *Rosin*, the stuff violinists rub on their bows. You fold a scraping into an envelope. Above the door, between the frame and the ceiling panel, there\'s a gap. Narrow. Just wide enough for a wire.',
            ],
            next: 'phaseA',
          },
          {
            text: 'Vale\'s briefcase',
            hint: 'Follow the money.',
            art: '💼',
            set: ['c_will'],
            outcome: [
              'The calfskin briefcase is unlocked, which already tells you something. Inside: train tickets, a bottle of digitalis, and a document dated *yesterday*.',
              'It\'s a new will. Clémence Vale is cut off without a centime; everything goes to "charitable causes to be named by my executor." The signature is a vain, looping thing, and every *e* in it is a Greek epsilon, *ε*, a schoolboy affectation the old man never outgrew.',
              'You tuck the will inside your jacket. When you look up, Clémence is in the doorway, watching you do it.',
            ],
            next: 'phaseA',
          },
        ],
      },

      phaseA: {
        scene: 'train-car',
        title: '2:30 AM — The Dining Car',
        art: '🕯️🔍',
        mood: 'candle',
        weather: 'snow',
        text: [
          'You herd them all into the dining car and lock compartment 7 behind you. Outside the windows the tunnel is solid black. The radio is dead. The engineer says the plough from Langen won\'t reach you before six.',
          'Six people, one corpse, three and a half hours.',
          'They sit as far apart as the candlelit car allows. Croft shuffles and reshuffles. Luca hums under his breath. Clémence stares at her own reflection in the black glass. Sister Agnès writes in her little book. Emil polishes the same brass rail over and over.',
          { if: 'c_rosin', text: 'The envelope of rosin sits in your breast pocket like a second heartbeat.' },
          { if: 'c_will', text: 'The will crackles inside your jacket every time you breathe. Clémence hasn\'t taken her eyes off it.' },
          { if: 'c_double', text: 'You can\'t stop thinking about those hands. Rope-hauler\'s hands, on a man worth forty million francs.' },
          'You can take one of them aside, properly, before they get their stories straight. Who?',
        ],
        choices: [
          {
            text: 'Emil, the conductor',
            hint: 'He found the body. He has the keys. He\'s terrified.',
            art: '🧑‍✈️',
            outcome: [
              'You crook a finger at Emil. He drops his polishing rag, picks it up, drops it again, and follows you into the narrow galley like a man walking to the gallows.',
            ],
            next: 'q_emil',
          },
          {
            text: 'Clémence, the daughter',
            hint: 'Disinherited, maybe. Grieving, definitely not.',
            art: '🖋️',
            outcome: [
              'You hold the vestibule door for Clémence. She takes her cigarettes and her time, and walks past you as though she\'s the one conducting the interview.',
            ],
            next: 'q_clemence',
          },
          {
            text: 'Luca, the violinist',
            hint: 'Compartment 8. The other side of that connecting door.',
            art: '🎻',
            outcome: [
              'You ask Luca for a word. He springs up as though you\'ve asked him to dance, and insists you talk in his compartment, "where the chairs are kinder."',
            ],
            next: 'q_luca',
          },
          {
            text: 'Croft, the card player',
            hint: 'He\'s been watching you as closely as you\'ve watched him.',
            art: '🃏',
            outcome: [
              'You sit down across from Croft. He pushes a glass of whisky toward you without being asked and fans the deck face-up in one smooth arc. Every card is where it should be. That\'s the point.',
            ],
            next: 'q_croft',
          },
        ],
      },

      // ------------------------------------------------------------------ INTERROGATIONS
      q_emil: {
        scene: 'kitchen',
        title: '2:40 AM — The Galley',
        art: '🧑‍✈️💦',
        mood: 'office',
        text: [
          'The galley is all copper pans and the stale smell of boiled coffee. Emil presses himself against the icebox.',
          'He\'s from Feldkirch. He sends his wages home to his mother, who coughs. He has worked the night sleeper for four months and nobody has ever died on it before, he says, as if that might be held against him.',
          say('Emil', 'I didn\'t do anything, Inspector. I swear on my mother. I only brought the brandy.'),
          'He\'s hiding something. Nineteen-year-olds always are. The question is whether it\'s the thing that matters.',
        ],
        choices: [
          {
            text: 'Press him about the master key',
            hint: 'Where has it been tonight?',
            art: '🗝️',
            set: ['c_key'],
            outcome: [
              'You hold out your hand, palm up, and say nothing. It takes eleven seconds. Then Emil crumples.',
              say('Emil', 'Mr. Croft. He gave me fifty francs to borrow it, from half past twelve. He gave it back just after the avalanche. For my mother\'s medicine, Inspector, I swear it.'),
              'He grabs your sleeve.',
              say('Emil', 'But the master key only turns the lock. It can\'t touch the bolts. Nobody can move those bolts from outside. Nobody.'),
              'You believe him. Which makes that locked door worse, not better.',
            ],
            next: 'blackout',
          },
          {
            text: 'Ask what he heard at one o\'clock',
            hint: 'He was in the corridor when it hit.',
            art: '👂',
            set: ['c_skip', 'c_record'],
            outcome: [
              'He was halfway down the sleeping car when the avalanche came. He heard Mr. Marchetti\'s violin through the door of number 8.',
              say('Emil', 'Beautiful. Then the train jumped, and the music jumped too. It went back and played the same bit again. Like my mother\'s gramophone when the cat walks past it.'),
              'He blinks, struck by his own memory.',
              say('Emil', 'He has one, you know. A gramophone. I carried the box for him at Zürich. Heavy as a coffin. He tipped me nothing.'),
            ],
            next: 'blackout',
          },
          {
            text: 'Ask about Sister Agnès',
            hint: 'He keeps not looking at her.',
            art: '📿',
            set: ['c_man'],
            outcome: [
              'His ears go scarlet. At midnight he knocked on compartment 6 with the extra blanket she had asked for. The door was ajar. She was at the basin with her wimple off.',
              say('Emil', 'Her head was shaved, Inspector. Like a soldier\'s. And she had soap, here.'),
              'He touches his own jaw, then crosses himself.',
              say('Emil', 'I thought perhaps it\'s a rule in her order. I am going to hell for looking.'),
            ],
            next: 'blackout',
          },
        ],
      },

      q_clemence: {
        scene: 'corridor',
        title: '2:40 AM — The Vestibule',
        art: '🖋️🥀',
        mood: 'ice',
        weather: 'snow',
        text: [
          'Between the carriages it\'s cold enough to see your breath. Clémence lights a cigarette and lets the flame show you her face: thirty-four, sharp, dry-eyed.',
          say('Clémence Vale', 'Ask your questions, Inspector. I didn\'t love him. That isn\'t a crime yet.'),
          { if: 'c_will', text: 'Her eyes drop to the bulge of the will inside your jacket, then lift again. She knows exactly what it says.' },
          'There are two stories in her. You only have time to pull on one.',
        ],
        choices: [
          {
            text: 'Ask about the argument at dinner',
            hint: 'What did she whisper about Monday?',
            art: '🗯️',
            set: ['c_mouse'],
            outcome: [
              'She laughs without humour. Banque Vale collapses on Monday, she says. The auditors know. She knows because she\'s the one who told them; for two years she\'s been writing about her father\'s books under the name *Cassandre*.',
              say('Clémence Vale', 'I came to warn him. I expected him to scream. Instead he called me *Clémence*. Do you understand? Not once in my life did he call me Clémence. I was *Souris*. Mouse. Since I was four. Every letter: "My dear Mouse," every *e* a little Greek ladder, because he writes like a pompous schoolboy.'),
              'She grinds the cigarette out against the frosted window.',
              say('Clémence Vale', 'Tonight he looked at me like a stranger.'),
            ],
            next: 'blackout',
          },
          {
            text: 'Ask where she was at one o\'clock',
            hint: 'Compartment 4. Right across from the violinist.',
            art: '🕐',
            set: ['c_skip'],
            outcome: [
              'In her compartment, writing. When the avalanche hit she knocked her ink over the bunk.',
              say('Clémence Vale', 'The violin across the corridor never missed a beat. Well, once. It went back on itself, like a needle jumping. I remember thinking: how absurd, he\'s practising the same bar over again, even now.'),
              'She studies you through the smoke.',
              say('Clémence Vale', 'Is that useful? You look as though it\'s useful.'),
            ],
            next: 'blackout',
          },
        ],
      },

      q_luca: {
        scene: 'train-car',
        title: '2:40 AM — Compartment 8',
        art: '🎻🌹',
        mood: 'candle',
        enter: { set: ['alerted'] },
        text: [
          'Compartment 8 smells of lavender cologne and pine resin. Sheet music is drifted across every surface like snow. Luca folds himself onto the bunk with his violin case across his knees and smiles like a cat that has been told about cream.',
          say('Luca Marchetti', 'Inspector! At last, someone interesting to talk to. Ask me anything. I am an open score.'),
          'Behind him, the connecting door to compartment 7 stands shut. On this side, its bolt is drawn *back*.',
          'He is charming. He is relaxed. He is watching your hands the whole time.',
        ],
        choices: [
          {
            text: 'Ask about his music at one o\'clock',
            hint: 'Pin down his alibi.',
            art: '🎼',
            effect: (s) => { if (s.has('c_skip')) s.set('c_lie'); },
            outcome: [
              say('Luca Marchetti', 'The twenty-fourth Caprice, from midnight until half past one. The mountain fell on us and I did not drop a single note. Ask anyone. The whole carriage heard me.'),
              {
                if: 'c_skip',
                text: [
                  'You lean in. "You didn\'t drop a note. You *repeated* half a bar. Perfectly. Like a needle jumping in a groove."',
                  'For one heartbeat his smile freezes, a hairline crack in porcelain. Then he laughs. "Artistic licence." He\'s lying, and now you both know it.',
                ],
                else: 'You write it down. Something about that boast snags in your mind, but you can\'t yet say what.',
              },
            ],
            next: 'blackout',
          },
          {
            text: 'Ask about his debts',
            hint: 'You know what he owes Croft.',
            art: '💸',
            set: ['c_debt', 'c_envelope'],
            outcome: [
              say('Luca Marchetti', 'Croft? A trifle. A gentleman\'s game. I paid him something on account tonight, in fact.'),
              'He flips open a silver cigarette case to offer you one. Tucked behind the cigarettes is a fold of brand-new banknotes, still wrapped in a paper band printed *BANQUE VALE · ZÜRICH*.',
              'He snaps the case shut a fraction too fast. "Inheritance," he says, and laughs at his own joke.',
            ],
            next: 'blackout',
          },
          {
            text: 'Admire the violin and ask to see it',
            hint: 'Flattery opens cases.',
            art: '🎻',
            set: ['c_string'],
            outcome: [
              'He can\'t resist. He opens the case like a reliquary: a Guarneri copy, honey-gold. While he talks about varnish you look at the lid, where a paper packet of spare strings is tucked into the pocket. G, D, A. The E sleeve is empty.',
              '"You\'re missing an E," you say. "I broke one," he says. "It happens."',
              'But the E string on the violin is old, grey with dried rosin. Nobody has restrung it tonight. He closes the case very gently, the way you close a door on a sleeping child, or a body.',
            ],
            next: 'blackout',
          },
        ],
      },

      q_croft: {
        scene: 'train-car',
        title: '2:40 AM — The Bar',
        art: '🃏💰',
        mood: 'gold',
        text: [
          'Croft is a big Chicago man in a big Chicago suit, and he deals solitaire like he\'s punishing the cards.',
          say('Harlan Croft', 'Sit down, pal. You\'ve got the face of a man who wants to know where I was at one o\'clock. Ask the right question and maybe I\'ll tell you something worth knowing.'),
          { if: 'c_key', text: 'His right hand rests on his jacket pocket, the same pocket the master key vanished into.' },
          'There is a bulge under his left arm that isn\'t a wallet.',
        ],
        choices: [
          {
            text: 'Ask about the card game',
            hint: 'Follow the markers.',
            art: '📒',
            set: ['c_debt', 'c_envelope'],
            outcome: [
              'He\'s proud of it. He opens the little notebook: Marchetti markers totalling eighty thousand francs.',
              say('Harlan Croft', 'Now here\'s the funny part. At midnight the kid knocks on my door and pays twenty grand on account. Cash.'),
              'He fans the notes across the table: crisp, sequential, still in the paper band of *Banque Vale, Zürich*.',
              say('Harlan Croft', 'So where does a busted fiddler get the old man\'s money, on the night the old man dies? You\'re the detective.'),
            ],
            next: 'blackout',
          },
          {
            text: 'Ask where he really was tonight',
            hint: 'He was holding something brass in the vestibule.',
            art: '🔫',
            set: ['c_key', 'c_double'],
            outcome: [
              'He grins. Then he sees you aren\'t grinning, and sighs. He borrowed the kid\'s key at half past twelve and let himself into number 7 at twenty to one. Vale had been holding paper on him since \'29, and he wanted it back.',
              say('Harlan Croft', 'Old man was out cold, snoring like a longshoreman. I didn\'t find my paper. But I\'ll tell you what was screwy. Guy\'s worth forty million, right? Shoes by the bunk: cracked leather, resoled twice. Socks with darns in them. You ever see a millionaire darn his socks?'),
              'He opens his jacket to show you a snub-nosed revolver. "Before you ask: not fired. And the old man got stabbed anyway." Then, almost as an afterthought: "Connecting door to number 8 was unbolted on Vale\'s side. Open a crack. I remember thinking, somebody\'s expected."',
            ],
            next: 'blackout',
          },
        ],
      },

      // ------------------------------------------------------------------ THE BLACKOUT
      blackout: {
        scene: 'train-car',
        title: '3:12 AM — Compartment 5',
        art: '🕯️🖐️',
        mood: 'void',
        fx: 'glitch',
        timer: 7,
        text: [
          'You go back to your compartment to write it all down while it\'s fresh. One candle. The walnut walls ticking in the cold.',
          { if: 'alerted', text: 'Marchetti\'s smile followed you all the way down the corridor. He knows exactly what you were looking for.' },
          'You\'ve filled two pages when every light in the carriage dies at once.',
          'Not a flicker. A *cut*. Someone has pulled a fuse.',
          'Your candle gutters in a draught that shouldn\'t be there. Your door is sliding open behind you. You smell pine. Then something cold and thin as a hair drops over your head and **bites** into your throat.',
          'Wire. Pulling.',
        ],
        timeout: {
          text: 'You froze.',
          fx: 'redflash',
          set: ['wounded'],
          unset: ['c_rosin'],
          outcome: [
            'You claw at the wire, which is exactly wrong. It cuts your fingers and keeps tightening. Sparks swim across the dark. The candle seems to move very far away.',
            'You wake on the floor with the lights back on and your throat a ring of fire. Your jacket has been rifled.',
            'Your notes are scattered, and the envelope of rosin scrapings, if you had one, is gone. Your voice, when you try it, is a broken croak.',
          ],
          next: 'phaseB',
        },
        choices: [
          {
            text: 'Drive your elbow back',
            hint: 'Fight.',
            art: '💥',
            fx: 'redflash',
            set: ['c_string', 'c_attack'],
            outcome: [
              'You learned this in a Marseille alley in 1912 and your body hasn\'t forgotten. Elbow into soft ribs. Heel down on an instep. Twist *into* the wire instead of away from it.',
              'The attacker grunts and lets go. A shape crashes out into the black corridor. You\'re on your knees, coughing, and your fingers come away from your throat sticky with fine, piney powder.',
              'On the floor, coiled like a dead snake, lies a length of bright steel wire with a tiny brass ball at one end and a slipknot at the other. A violin\'s E string.',
            ],
            next: 'phaseB',
          },
          {
            text: 'Go limp and play dead',
            hint: 'Let him think he\'s won.',
            art: '💀',
            set: ['c_attack'],
            unset: ['c_will'],
            outcome: [
              'You let your knees fold and your head loll. The wire slackens. Hands go through your jacket, quick and practised. Paper tears.',
              'The figure leans close to check your breathing, and you smell it: pine resin, and under it lavender cologne. Then the door slides and they\'re gone.',
              'You lie there a full minute before you dare to move. Your notes are shredded, and the inside of your jacket is empty. Whatever you were carrying there is gone. But you\'re alive, and you know what your killer smells like.',
            ],
            next: 'phaseB',
          },
        ],
      },

      phaseB: {
        scene: 'corridor',
        title: '3:40 AM — The Corridor',
        art: '🔦🚃',
        mood: 'night',
        weather: 'snow',
        text: [
          'The lights come back at twenty to four, with Emil swearing over the fuse box in the vestibule. Somebody pulled the main fuse clean out and dropped it in the snowmelt on the floor.',
          { if: 'wounded', text: 'You can barely swallow. The mirror shows a thin purple line circling your throat like a necklace.' },
          { if: 'c_string', text: 'The steel E string lies coiled in your handkerchief. Somebody aboard is short a weapon, and a note.' },
          { if: '!c_string', text: { if: 'c_attack', text: 'You can still smell that pine resin. You will be smelling it in your sleep for years.' } },
          'Everyone claims they were asleep. Everyone is lying about something.',
          'Two hours until the plough. They\'re all herded in the dining car again, which means the compartments are empty. You have time for **one** more thing before dawn.',
        ],
        choices: [
          {
            text: 'Search Marchetti\'s compartment (8)',
            hint: 'Sheet music, a violin case, and a box under the bunk.',
            art: '🎻',
            outcome: ['You slip into number 8 and slide the door shut behind you. The lavender smell hits you like a hand over the mouth.'],
            next: 's_luca',
          },
          {
            text: 'Search Sister Agnès\'s compartment (6)',
            hint: 'What does a silent nun keep?',
            art: '📿',
            outcome: ['You let yourself into number 6. It is very tidy. Too tidy. Like a room that expects to be searched.'],
            next: 's_nun',
          },
          {
            text: 'Question Sister Agnès',
            hint: 'She hasn\'t spoken a word all night.',
            art: '✝️',
            outcome: ['You carry two cups of tea to the nun\'s corner of the dining car and set one down in front of her. She does not touch it.'],
            next: 'q_agnes',
          },
          {
            text: 'Go back over compartment 7',
            hint: 'The room always has more to say.',
            art: '🚪',
            outcome: ['You borrow Emil\'s key and let yourself back in with the dead. It is colder now. Frost has started to creep across the inside of the window.'],
            next: 's_vale',
          },
        ],
      },

      // ------------------------------------------------------------------ SEARCHES
      s_luca: {
        scene: 'train-car',
        title: '3:50 AM — Compartment 8',
        art: '🎼🔦',
        mood: 'candle',
        text: [
          'Pine rosin and lavender. Sheet music everywhere, Paganini mostly, annotated in violent red pencil. The violin case lies on the bunk. Under the bunk, a heavy square box with brass corners.',
          'Then voices in the corridor: Croft, complaining loudly, heading this way. You have time to open **one** of them.',
        ],
        choices: [
          {
            text: 'Open the violin case',
            hint: 'You know there\'s a string missing.',
            art: '🎻',
            set: ['c_string', 'c_envelope'],
            outcome: [
              'The spare-string packet in the lid: G, D, A. The E sleeve is empty.',
              'And the lining of the lid bulges. You slit the stitching with a thumbnail and banknotes slide out, twenty thousand francs in a *Banque Vale* paper band, with a card tucked among them in an old man\'s ornate hand: *Half now. The rest when it is done.*',
              'Every *e* on the card is a Greek epsilon. You stuff it all back and slip out a breath before Croft rounds the corner.',
            ],
            next: 'dawn',
          },
          {
            text: 'Open the box under the bunk',
            hint: 'Heavy as a coffin.',
            art: '📦',
            set: ['c_record'],
            outcome: [
              'A portable HMV gramophone, records in paper sleeves. On the turntable is a test pressing with a hand-lettered label: *L. Marchetti, Paganini, Caprice No. 24*.',
              'You tilt it under the lamp. A fresh white scratch arcs across the grooves about two-thirds of the way through. You crank the handle and drop the needle just before it.',
              'The violin soars, hits the scratch, *jumps* back half a bar, and plays the same phrase again, identical down to the breath. The perfect alibi, until a mountain falls on it.',
            ],
            next: 'dawn',
          },
        ],
      },

      s_nun: {
        scene: 'train-car',
        title: '3:50 AM — Compartment 6',
        art: '📿🪒',
        mood: 'fog',
        text: [
          'Carbolic soap, and something underneath it that doesn\'t belong in a convent: bay rum. A gentleman\'s aftershave.',
          'A breviary lies squarely on the pillow. A washbag sits by the basin. The bunk hasn\'t been slept in.',
          'Footsteps in the corridor. You only have time for one.',
        ],
        choices: [
          {
            text: 'Check the washbag',
            hint: 'You smell bay rum.',
            art: '🪒',
            set: ['c_man'],
            outcome: [
              'A straight razor, its edge freshly stropped. A badger-hair shaving brush, still damp. And in the drain of the basin, a crust of tiny silver bristles.',
              'Nuns, in your experience, do not shave twice a day.',
              { if: 'c_double', text: 'Silver. The exact silver of Augustin Vale\'s famous beard. You think of the dead man\'s rope-hauler hands, and something cold settles in your stomach.' },
            ],
            next: 'dawn',
          },
          {
            text: 'Open the breviary',
            hint: 'Too squarely placed.',
            art: '📖',
            set: ['c_hand'],
            outcome: [
              'The pages have been hollowed out with a razor. Inside are a steamship ticket, Genoa to Buenos Aires, first class, single, in the name of *A. Valéry*, and a sheaf of paper covered in one phrase written over and over: *I have taken a vow of silence. I have taken a vow of silence.*',
              'Someone has been practising a new handwriting. But on every line the old one creeps back: each *e* curling into a Greek *ε*.',
              { if: ['c_will'], text: 'You have seen that epsilon tonight already, looping through the signature on Augustin Vale\'s new will.', else: { if: 'c_mouse', text: 'You hear Clémence\'s voice: *every e a little Greek ladder, because he writes like a pompous schoolboy.*' } },
            ],
            next: 'dawn',
          },
        ],
      },

      q_agnes: {
        scene: 'train-car',
        title: '3:50 AM — The Dining Car',
        art: '✝️🕯️',
        mood: 'candle',
        text: [
          'Sister Agnès sits very straight. She is tall for a woman, broad across the shoulders, her face lost in the shadow of the veil. Grey woollen gloves. A black rosary looped through big fingers.',
          'She taps a small card pinned to her habit: *VOW OF SILENCE*. Then she opens her notebook and waits, pencil poised.',
          'Across the car, Luca has stopped humming. He\'s watching the two of you.',
        ],
        choices: [
          {
            text: 'Ask her to write down what she saw',
            hint: 'A nun wouldn\'t lie. Would she?',
            art: '✍️',
            effect: (s) => { if (s.has('c_will') || s.has('c_mouse')) s.set('c_hand'); },
            outcome: [
              'She writes quickly, without hesitation, and turns the notebook round: *At one o\'clock I saw the violinist in the corridor outside number 7. God forgive him.*',
              'Across the car, Luca goes very still. She has handed you the violinist on a plate, a little too eagerly for a bride of Christ.',
              {
                if: 'c_hand',
                text: 'Then you look at the handwriting and the hair rises on your arms. *one*, *the*, *forgive*: every *e* is a Greek epsilon. Augustin Vale\'s vanity, in a nun\'s pencil.',
                else: 'Her handwriting is oddly ornate, every *e* curled like a little Greek *ε*. You note it without knowing why.',
              },
            ],
            next: 'dawn',
          },
          {
            text: 'Take her hands and ask her to pray with you',
            hint: 'Hard to refuse. Harder to fake.',
            art: '🙏',
            set: ['c_man'],
            outcome: [
              '"Pray with me, Sister. For the dead man." You reach across and take her hands, and before she can stop you, one glove slides off in yours.',
              'The hand is enormous: soft, manicured, a banker\'s hand. Around the ring finger runs a band of pale, untanned skin, the ghost of a ring worn for forty years and taken off this week.',
              'She snatches it back. For one instant, behind the veil, you see eyes: pale grey, and absolutely furious.',
            ],
            next: 'dawn',
          },
        ],
      },

      s_vale: {
        scene: 'train-car',
        title: '3:50 AM — Compartment 7',
        art: '🛏️❄️',
        mood: 'ice',
        text: [
          'The dead man lies under a sheet. Frost feathers the inside of the window. Your breath hangs in the air as if it\'s afraid to leave.',
          'The connecting door. The body. The briefcase. You can do one of them justice before somebody comes looking for you.',
        ],
        choices: [
          {
            text: 'The connecting-door bolt',
            hint: 'Locked rooms are puzzles, not miracles.',
            art: '🔩',
            set: ['c_rosin'],
            outcome: [
              { if: 'wounded', text: 'The envelope you had was stolen in the dark, so you take a fresh scraping.' },
              'Rosin on the brass knob, pale and piney, and a fine bright scratch circling its neck. Above the door, a gap between the frame and the ceiling panel, just wide enough for a wire.',
              'You can see it now. Loop a wire over the knob, feed both ends through the gap, close the door, go back to your own side and *pull*. The bolt slides home. Then let go of one end and draw the wire through. A locked room, built from the wrong side.',
            ],
            next: 'dawn',
          },
          {
            text: 'The body',
            hint: 'Look at him. Really look.',
            art: '🖐️',
            set: ['c_double'],
            outcome: [
              'You pull back the sheet. The hands first: calluses, an old burn, scrubbed nails. The signet ring slides off with no pale band beneath it.',
              'Then the feet. Ingrown nails. Old frostbite on two toes. Under the bed, the shoes Croft would call cheap: cracked leather, resoled twice.',
              'Augustin Vale has been chauffeured since 1905. This man has walked a long way, for a long time, in bad boots.',
            ],
            next: 'dawn',
          },
          {
            text: 'The briefcase',
            hint: 'Money, papers, motive.',
            art: '💼',
            set: ['c_will'],
            outcome: [
              { if: 'c_will', text: 'The new will is still in your jacket, but the briefcase has more to give.', else: 'Inside the briefcase: a new will, dated yesterday, cutting Clémence off without a centime, signed in a vain looping hand where every *e* is a Greek *ε*. You take it.' },
              'At the bottom is a theatrical agency\'s receipt from Graz, folded small: *one week\'s engagement, private, paid in advance.* No name, just a stamp of two laughing masks.',
              'Why would a banker hire an actor for a week?',
            ],
            next: 'dawn',
          },
        ],
      },

      // ------------------------------------------------------------------ DAWN
      dawn: {
        scene: 'train-car',
        title: '5:20 AM — The Dining Car',
        art: '🌨️⏳',
        mood: 'ice',
        weather: 'snow',
        text: [
          'Somewhere beyond the rock, faint and growing, you hear it: the grinding roar of the rotary plough. Forty minutes. Maybe less.',
          'The candles have burned down to stubs. The suspects look grey and hollow-eyed in the brass light. Croft has stopped shuffling. Luca has stopped humming. Only Sister Agnès is as composed as when the night began.',
          notebook,
          { if: 'wounded', text: 'Your throat throbs with every heartbeat, a purple reminder that somebody in this car wants you dead before the plough arrives.' },
          'When the gendarmes come through that tunnel, you\'ll have five minutes to give them a name. How do you play the last forty?',
        ],
        choices: [
          {
            text: 'Gather everyone and lay it out',
            hint: 'The classic way. Every suspect in one room.',
            art: '🕯️',
            outcome: [
              'You ask Emil to wake the steward and brew the strongest coffee on the train. Then you take the head of the longest table, lay your notebook in front of you, and wait for the plough with your back to the wall.',
              'Nobody leaves. Nobody dares.',
            ],
            next: 'accuse',
          },
          {
            text: 'Set a trap',
            hint: 'Announce a luggage search. Then wait in the dark and see who moves.',
            art: '🪤',
            outcome: [
              'You stand and announce, loudly, that the Austrian police will search every bag and every compartment the moment the line is clear. Then you yawn, excuse yourself, and walk out.',
              'You don\'t go to bed. You put out the lamp in the rear vestibule and fold yourself into the freezing dark behind the gangway bellows.',
            ],
            next: 'trap',
          },
          {
            text: 'Knock on Marchetti\'s door, alone',
            hint: 'If you\'re right, he\'s dangerous.',
            art: '🚪',
            outcome: [
              'You don\'t want an audience. You want to see his face when you say it.',
              'You walk the length of the sleeping car alone, past the splintered door of number 7, and knock three times on number 8.',
            ],
            next: 'confront',
          },
        ],
      },

      trap: {
        scene: 'tunnel',
        title: '5:40 AM — The Rear Vestibule',
        art: '🌑🎻',
        mood: 'void',
        fx: 'heartbeat',
        timer: 8,
        text: [
          'Ten minutes. Fifteen. Your knees lock in the cold. Then footsteps.',
          'Luca Marchetti, an overcoat thrown over his pyjamas, a flat square parcel clutched to his chest, about the size of a gramophone record.',
          'He hauls on the outer door. Snow and black tunnel air pour in. He lifts the parcel to throw it.',
          'And behind him, framed in the corridor door, a second silhouette: tall, broad-shouldered, *veiled*.',
        ],
        timeout: {
          text: 'You hesitated.',
          unset: ['c_record'],
          outcome: [
            'You wait one breath too long. The parcel spins out into the dark and vanishes under six feet of snow.',
            'Luca slams the door and walks straight past your hiding place without seeing you, rubbing his hands. When you turn, the veiled figure is gone as well, as though it was never there.',
            'Whatever was on that record belongs to the mountain now.',
          ],
          next: 'accuse',
        },
        choices: [
          {
            text: 'Seize him now',
            hint: 'Before the evidence hits the snow.',
            art: '🤜',
            set: ['c_trap', 'c_record'],
            outcome: [
              'You come out of the dark like a train out of a tunnel. You catch his wrist as he swings, and the parcel drops onto the floor plate, not into the snow.',
              'The paper tears. A test pressing: *L. Marchetti, Paganini, Caprice No. 24*, with a fresh white scratch two-thirds of the way through.',
              say('Luca Marchetti', 'It\'s only music, Inspector!'),
              '"Then why throw it into a tunnel at dawn?" Behind you, the veiled silhouette has melted away.',
            ],
            next: 'accuse',
          },
          {
            text: 'Wait. Watch.',
            hint: 'Who is the second figure?',
            art: '👁️',
            set: ['c_trap', 'c_man'],
            outcome: [
              'You hold your breath. The veiled figure steps into the vestibule and presses an envelope into Luca\'s hand, and then the nun who has not spoken all night *speaks*, in a man\'s voice, low, cultured and impatient.',
              say('Sister Agnès', 'The rest of it. Throw the thing and go back to bed.'),
              say('Luca Marchetti', 'You told me nobody would ever—'),
              s => (s.has('wounded')
                ? 'You step out to stop them. You try to shout, and your ruined throat gives only a croak. Luca turns. He sees you. He sees how slowly you move. The nun is already gone.'
                : 'You step out of the shadows and say, quite pleasantly, "Good morning." The nun is gone before you finish the word. Luca drops the envelope and the record together, and puts up his hands.'),
            ],
            next: (s) => (s.has('wounded') ? 'end_death' : 'accuse'),
          },
        ],
      },

      confront: {
        scene: 'train-car',
        title: '5:35 AM — Compartment 8',
        art: '🔪🎻',
        mood: 'blood',
        fx: 'heartbeat',
        timer: 6,
        text: [
          'He opens the door with the violin already under his chin and plays you three bars of something sweet before he lets you in.',
          'You lay it out for him quietly: the door, the money, the music. He listens like a man hearing a review of his own concert. Then he lays the violin on the bunk, very gently.',
          say('Luca Marchetti', 'You are a very clever man, Inspector. Clever men should go home to bed.'),
          'His hand comes up from under the sheet music holding a stiletto: thin, triangular, exactly the shape of the wound beneath the dead man\'s heart. He\'s between you and the door.',
        ],
        timeout: {
          text: 'You froze.',
          set: ['died_confront'],
          outcome: [
            'You open your mouth to talk him down, and that is all the time he needs.',
          ],
          next: 'end_death',
        },
        choices: [
          {
            text: 'Grab his wrist',
            hint: 'Close the distance before he does.',
            art: '✊',
            set: ['c_trap'],
            effect: (s) => { if (s.has('wounded')) s.set('died_confront'); },
            outcome: [
              s => (s.has('wounded')
                ? 'You lunge for the knife hand. Your grip is half of what it was four hours ago; the wire took the rest. He twists free as easily as pulling a bow across a string.'
                : 'You lunge, catch the knife wrist and slam it against the window frame. The stiletto clatters to the floor. You have him face-down on the bunk with his arm up his back before he finishes his gasp.'),
              s => (s.has('wounded') ? null : 'He laughs into the blankets, breathless. "He paid me, you know. Half before, half after." "Who paid you?" He laughs harder. "The dead man."'),
            ],
            next: (s) => (s.has('wounded') ? 'end_death' : 'accuse'),
          },
          {
            text: 'Snatch up his violin',
            hint: 'He\'d kill a man. Would he risk the Guarneri?',
            art: '🎻',
            set: ['c_trap'],
            outcome: [
              'You grab the violin off the bunk by its neck and hold it up between you like a shield, ready to put your boot through it.',
              'He freezes. The knife trembles. He will put a blade into a man\'s heart without blinking, but not a scratch on that varnish.',
              say('Luca Marchetti', 'Please. Please, it is a Guarneri copy, it is the only thing I own.'),
              'He drops the stiletto. You kick it under the bunk and bellow for Emil.',
            ],
            next: 'accuse',
          },
          {
            text: 'Back into the corridor and shout',
            scene: 'corridor',
            hint: 'Witnesses are a kind of armour.',
            art: '📢',
            outcome: [
              'You throw yourself backwards through the door and roar for Emil, for Croft, for anyone. Doors bang open all down the carriage.',
              'When Croft arrives, revolver in hand, Luca is sitting on his bunk tuning his violin as though nothing has happened. The knife is nowhere to be seen. He smiles at the crowd in the doorway.',
              say('Luca Marchetti', 'The Inspector had a bad dream. It\'s been a long night for all of us.'),
            ],
            next: 'accuse',
          },
        ],
      },

      // ------------------------------------------------------------------ ACCUSATION
      accuse: {
        scene: 'train-car',
        title: '6:10 AM — The Dining Car',
        art: '⚖️🕯️',
        mood: 'dawn',
        weather: 'snow',
        text: [
          'The plough breaks through in a white explosion of snow and lamplight. Ten minutes later, Inspector Haas of the Langen gendarmerie climbs aboard with frost in his moustache and two constables behind him.',
          'He hears who you are, sighs, and gives you five minutes.',
          'They\'re all here. Clémence, smoking. Croft, arms folded. Emil, cap in his hands. Sister Agnès, silent as stone. Luca, tuning a string that doesn\'t need tuning.',
          notebook,
          { if: 'c_trap', text: 'Luca sits between two constables. Whatever happens next, he isn\'t going anywhere for the moment.' },
          say('Inspector Haas', 'Well? You have a name for me or not?'),
        ],
        choices: [
          {
            text: 'Luca Marchetti',
            hint: 'The violinist in compartment 8.',
            art: '🎻',
            outcome: [
              'You turn to the violinist. The car goes so quiet you can hear snow sliding off the roof.',
              say('Luca Marchetti', 'Me? Inspector. I am a musician. I was *playing*, the whole carriage heard me.'),
              say('Inspector Haas', 'And the door was bolted from the inside. So tell me how, or let us all have breakfast.'),
            ],
            next: 'method',
          },
          {
            text: 'Clémence Vale',
            hint: 'Disinherited, furious, and right across the corridor.',
            art: '🖋️',
            set: ['acc_clem'],
            outcome: [
              'You turn to the daughter. She doesn\'t flinch. She simply lights another cigarette with perfectly steady hands and says, "Of course."',
              'Haas nods slowly. A disinherited daughter: it\'s the kind of story a jury already knows the ending to.',
            ],
            next: 'end_wrong',
          },
          {
            text: 'Harlan Croft',
            hint: 'The cardsharp with the revolver and the borrowed key.',
            art: '🃏',
            set: ['acc_croft'],
            outcome: [
              'You turn to the American. His gold tooth disappears. "You\'re making a mistake, pal," he says softly. "A big one."',
              'The constables find the revolver in a heartbeat, and the master key\'s story takes thirty seconds more. To Haas, it looks like a gift.',
            ],
            next: 'end_wrong',
          },
          {
            text: 'Someone else...',
            hint: 'The one nobody is watching.',
            art: '❓',
            outcome: [
              'You let your eyes travel slowly past the obvious faces, to the edges of the room.',
            ],
            next: 'accuse_other',
          },
        ],
      },

      accuse_other: {
        scene: 'train-car',
        title: '6:14 AM — The Dining Car',
        art: '🕯️👁️',
        mood: 'dawn',
        text: [
          'The conductor, who held the keys. The nun, who hasn\'t said a word all night.',
          s => (twistReady(s) ? 'And a third possibility, one you can barely believe yourself, sitting in your notebook like a lit fuse.' : 'Haas taps his watch.'),
        ],
        choices: [
          {
            text: 'Emil, the conductor',
            hint: 'He had the master key.',
            art: '🧑‍✈️',
            set: ['acc_emil'],
            outcome: [
              'You turn to the boy. Emil\'s cap falls out of his hands. "Inspector, no. *No.* I brought the brandy, I only brought the brandy."',
              'Haas is already reaching for the handcuffs. A nervous conductor with a master key and a debt at home: the simplest story in the world.',
            ],
            next: 'end_wrong',
          },
          {
            text: 'Sister Agnès',
            hint: 'Silence can hide anything.',
            art: '✝️',
            set: ['acc_agnes'],
            outcome: [
              'You point at the nun. A murmur of genuine shock runs round the car. Even Croft takes his cigar out of his mouth.',
              'She doesn\'t write a word. She only bows her head, folds her big gloved hands, and lets the room decide you\'re a monster.',
            ],
            next: 'end_wrong',
          },
          {
            text: 'Augustin Vale. He isn\'t dead.',
            hint: 'Say it out loud.',
            art: '🎭',
            if: twistReady,
            fx: 'flash',
            outcome: [
              'You take a breath. "The man in compartment 7 is not Augustin Vale."',
              'Haas laughs. Then he stops laughing, because you\'ve crossed the car and are standing in front of Sister Agnès, and Sister Agnès has gone absolutely rigid.',
              '"Augustin Vale," you say, "is sitting right here."',
            ],
            next: 'end_secret',
          },
        ],
      },

      method: {
        scene: 'train-car',
        title: '6:16 AM — The Dining Car',
        art: '🔩🎻',
        mood: 'candle',
        text: [
          'Haas folds his arms. "A bolted door. A window frozen into its frame. If your violinist killed him, how did he get out?"',
          'Every eye in the car turns to you. Luca raises an eyebrow, perfectly relaxed: you\'d swear he thinks he\'s already won.',
          { if: 'c_string', text: 'The steel E string is coiled in your pocket.' },
          { if: 'c_rosin', text: 'You think of the pale powder on the brass knob, and the scratch circling it.' },
        ],
        choices: [
          {
            text: 'A violin string, looped over the bolt',
            hint: 'Pulled shut through the gap above the connecting door.',
            art: '🎻',
            set: ['method_ok'],
            outcome: [
              'You walk them through it: the connecting door, left unbolted on the dead man\'s side; the stiletto; the steel E string looped round the bolt knob and fed through the gap above the frame; the pull from compartment 8 that slid the bolt home; one end released, the string drawn back through.',
              s => (methodClue(s)
                ? 'Then you show them the proof: ' + joinList([s.has('c_rosin') ? 'the rosin and the scratch on the bolt' : null, s.has('c_string') ? 'the E string itself' : null].filter(Boolean)) + '. Luca\'s smile finally slips.'
                : 'It\'s elegant. It\'s right; you can feel it. But you have nothing physical to show them, and Luca knows it.'),
            ],
            next: 'finale',
          },
          {
            text: 'Croft\'s borrowed master key',
            hint: 'The key was out of the conductor\'s hands all night.',
            art: '🗝️',
            outcome: [
              'You explain that the master key was missing from half past twelve until after the avalanche, and that Luca could have taken it from Croft.',
              'Emil, scarlet, speaks up before Haas can: "But the key can\'t move the bolts, Inspector. You know it can\'t." Haas looks at you a long moment. Luca examines his fingernails.',
            ],
            next: 'finale',
          },
          {
            text: 'Through the window, before it froze',
            hint: 'Out along the outside of the carriage.',
            art: '🪟',
            outcome: [
              'You suggest he climbed out of the window before the frost sealed it and edged along the outside of the carriage to his own.',
              'Haas actually goes to look. He comes back brushing snow from his sleeves. "Ice an inch thick, inside and out, and a two-hundred-metre drop into the gorge. Your violinist is a mountain goat?" Luca laughs out loud.',
            ],
            next: 'finale',
          },
        ],
      },

      finale: {
        redirect: (s) => {
          if (s.has('method_ok') && methodClue(s) && proof(s) >= 5) return 'end_true';
          if (s.has('method_ok') && methodClue(s) && proof(s) >= 3) return 'end_good';
          return 'end_walk';
        },
      },

      // ------------------------------------------------------------------ ENDINGS
      end_true: {
        scene: 'station',
        art: '🎻⚖️',
        mood: 'dawn',
        weather: 'snow',
        ending: { id: 'caprice', title: 'Caprice No. 24', type: 'true' },
        text: [
          'You don\'t accuse him. You *play him back to himself*, one note at a time.',
          s => `You lay it all on the table, item by item: ${lucaList(s)}.`,
          'By the time you finish, Luca Marchetti is no longer smiling. He looks at the evidence for a long time. Then he holds out his wrists to Haas like a man offering a bow for inspection.',
          say('Luca Marchetti', 'It was a beautiful alibi. It only needed the mountain to stay still for five seconds.'),
          'The constables lead him out into the white glare of the plough lamps. He hums the Caprice all the way down the steps.',
          { if: 'c_double', text: 'But as the train finally shudders forward toward Innsbruck, you look at the empty seat where Sister Agnès sat, and you think about a dead man\'s rope-hauler hands, and a ring that didn\'t fit.' },
          'At Innsbruck the nun is gone, swallowed by the crowd on the platform. Months later a postcard reaches you from Buenos Aires. No message. Just a signature: a single, looping Greek *ε*.',
          'You caught the hand that held the knife. Somewhere, someone is still laughing about whose hand paid for it.',
        ],
      },

      end_good: {
        scene: 'station',
        art: '⚖️❄️',
        mood: 'dawn',
        weather: 'snow',
        ending: { id: 'circumstantial', title: 'Enough for a Jury', type: 'good' },
        text: [
          'It isn\'t a perfect case. You know where the holes are. But it\'s enough.',
          s => `You lay out what you have: ${lucaList(s)}. And you show Haas exactly how the bolt was thrown from the wrong side of the door.`,
          'Luca protests elegantly, then less elegantly, then not at all. Haas cuffs him on the station platform at Langen while the plough crew stand around stamping their boots and watching.',
          say('Inspector Haas', 'A good lawyer will chew at it. But he\'ll stand trial. Well done, old man.'),
          'He\'ll get twenty years instead of the rope. The money from Banque Vale is never explained, and nobody ever asks who paid a broke violinist to kill a banker on the night his bank was about to fall.',
          { if: 'c_man', text: 'At Innsbruck you look for Sister Agnès to ask her one more question. Her compartment is empty except for a faint smell of bay rum.' },
          'Justice, like a train, mostly gets where it\'s going. Just not always to the right station.',
        ],
      },

      end_walk: {
        scene: 'station',
        art: '🎻🚉',
        mood: 'fog',
        weather: 'snow',
        ending: { id: 'doubt', title: 'Reasonable Doubt', type: 'neutral' },
        text: [
          'You have the right man. You can see it in his eyes, in the quick flick of his tongue across his lips. But eyes aren\'t evidence.',
          s => (proof(s) > 0 ? `You give Haas everything: ${lucaList(s)}. Laid out on the white tablecloth, it looks thinner than it did in your head.` : 'You give Haas your certainty. You have nothing else to give him.'),
          s => (s.has('method_ok') ? 'Your account of the bolt is elegant, but you can\'t prove a word of it.' : 'And your account of the locked door falls apart in front of everyone.'),
          say('Inspector Haas', 'This is a story, not a case. I can\'t hang a man for a story.'),
          'At Innsbruck, Luca Marchetti steps down onto the platform with his violin case, turns, and gives you a small, perfect bow. Then he plays the opening bars of the twenty-fourth Caprice for the crowd, and they throw coins.',
          'You never get another chance. Three months later the papers report that a Venetian violinist has bought a villa on Lake Como, cash.',
        ],
      },

      end_wrong: {
        scene: 'station',
        art: '⛓️❄️',
        mood: 'storm',
        weather: 'snow',
        fx: 'shake',
        ending: { id: 'wrong-compartment', title: 'The Wrong Compartment', type: 'bad' },
        text: [
          { if: 'acc_clem', text: [
            'Clémence Vale goes quietly. At the door she turns and says, "You were so close, Inspector. You were looking right at it." You don\'t know what she means. Not for years.',
            { if: 'c_will', text: 'The new will you found becomes Exhibit A. Motive, the prosecutor calls it, and the jury nods along.' },
          ] },
          { if: 'acc_croft', text: 'Harlan Croft is extradited, tried, and convicted on your word and a revolver that was never fired. He spends the trial staring at you across the courtroom, shuffling an invisible deck.' },
          { if: 'acc_emil', text: 'Emil Brandt weeps all the way to Innsbruck. His mother dies that winter, alone, while he waits for trial. He never says another word in his own defence. He just keeps repeating: *the key can\'t move the bolts*.' },
          { if: 'acc_agnes', text: 'Sister Agnès is taken to Innsbruck for questioning, and there, somehow, between the station and the cells, she simply vanishes. A habit is found folded neatly in a lavatory, beside a razor.' },
          'And on the platform at Innsbruck, Luca Marchetti steps off the train with his violin case and a pocket full of Banque Vale banknotes. He tips his hat to you.',
          s => (proof(s) >= 3 ? 'You had him. It was all there in your notebook, and you looked straight past it.' : 'The truth was there in the music the whole time, if you had only listened to it.'),
          'Months later a postcard reaches you from Buenos Aires, with no message, only a signature: a single looping Greek *ε*.',
        ],
      },

      end_death: {
        scene: 'tunnel',
        art: '🔪🌑',
        mood: 'blood',
        fx: 'redflash',
        ending: { id: 'lights-out', title: 'Lights Out in the Tunnel', type: 'death' },
        text: [
          { if: 'died_confront', text: 'The stiletto is very thin. You barely feel it go in, just a cold coin pressed under your heart, in exactly the same place as the dead man\'s.', else: 'Luca hits you like a falling stage curtain. The two of you crash against the outer door, and then there is only cold, and wind, and the black throat of the tunnel rushing up to meet you.' },
          'The last thing you hear is a violin. Someone has put on a record. Caprice No. 24, bright and brilliant, the alibi playing one more time.',
          s => (proof(s) > 0 ? `They find your notebook later, soaked and half frozen. It holds ${lucaList(s)}. It was nearly enough.` : 'They find your notebook later, soaked and half frozen and almost empty.'),
          'The official report calls it a fall: an elderly passenger, disoriented after a long night, wandering where he shouldn\'t have been.',
          'The night sleeper reaches Vienna eleven hours late. One passenger fewer than it should have. Two, if you count properly.',
        ],
      },

      end_secret: {
        scene: 'train-car',
        art: '🎭✝️',
        mood: 'gold',
        weather: 'snow',
        fx: 'flash',
        ending: { id: 'resurrection', title: 'Resurrection', type: 'secret' },
        text: [
          'You lay it out like a hand of cards, face up.',
          s => `First, the dead man: ${TWIST.c_double}. Then the daughter: ${TWIST.c_mouse}.` + (s.has('c_man') ? ` Then the nun: ${TWIST.c_man}.` : '') + (s.has('c_hand') ? ` And ${TWIST.c_hand}.` : ''),
          'Banque Vale falls on Monday. A man about to be ruined, and maybe hanged for fraud, needs to be dead by Sunday. So he hires an out-of-work actor from Graz to wear his beard and his ring for one week. He buys a habit, shaves his head, and takes a vow of silence, so nobody can ever hear his voice.',
          'Then he pays a desperate violinist, in his own bank\'s money, to kill the man playing him.',
          'Clémence has risen from her seat. She takes one step toward the nun, then another. Her voice comes out very small.',
          say('Clémence Vale', 'Papa?'),
          'The nun sits perfectly still for a long, long moment. Then the shoulders drop, and a man\'s voice, dry, cultured and almost amused, comes from behind the veil.',
          say('Augustin Vale', 'Hello, Mouse.'),
          'Haas pulls the wimple away himself. Beneath it: a shaved head, a jaw raw from the razor, pale grey eyes. Augustin Vale, very much alive, looking at you with real professional respect.',
          say('Augustin Vale', 'You can\'t prove I killed anyone, Inspector. I never touched him.'),
          '"No," you say. "But I can prove you\'re alive. And a living man can\'t hide inside a dead man\'s bankruptcy."',
          s => (proof(s) >= 3
            ? `The constables take the violinist too. The hand that held the knife and the hand that paid for it leave the train in the same pair of carriages, and your evidence follows them: ${lucaList(s)}.`
            : 'Luca Marchetti watches it all from the corner with a face like a man who has just realised he was paid in counterfeit. He will talk before Innsbruck. They always talk.'),
          'The dead man is buried in Graz under his real name, Otto Lenz, actor, forty-four. His landlady comes to the funeral. So do you.',
          'The train pulls into Innsbruck under a hard blue sky. For the first time in eleven years, you sleep through the night.',
        ],
      },
    },
  });
})();
