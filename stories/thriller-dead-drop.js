/* MysteryFate story: Dead Drop, Berlin 1983 (thriller) */
(function () {
  'use strict';

  // ---- helpers (meters clamped 0..5 to keep simulation compact) ----
  const clamp = (v) => Math.max(0, Math.min(5, v));
  const adj = (cover, heat) => (s) => {
    if (cover) s.setVar('cover', clamp(s.get('cover') + cover));
    if (heat) s.setVar('heat', clamp(s.get('heat') + heat));
  };
  const hot = (n) => (s) => s.get('heat') >= n;
  const covered = (n) => (s) => s.get('cover') >= n;
  const knowsGardener = (s) => s.has('peeked') || s.has('proof');
  const backup = (s) => s.has('cavalry') || s.has('called_voss');
  const masterPlan = (s) => s.has('peeked') && s.has('decoy') && s.has('called_voss');

  registerStory({
    id: 'dead-drop',
    title: 'Dead Drop, Berlin 1983',
    category: 'thriller',
    tagline: 'One microfilm. One divided city. Midnight, and you are not allowed to look.',
    description: `November 1983. You are a courier with a day visa, a matchbox you must never open, and fifty-seven minutes to get it out of East Berlin. A man in a green loden coat is following you, your safe house is burning, and the handler waiting on the other side of the Wall may be the most dangerous person in the city.`,
    cover: '🎞️',
    accent: '#d7263d',
    ambient: 'thriller',
    warning: 'Contains: gunfire, state violence, betrayal, implied execution.',
    scene: 'street',
    voices: {
      narrator: { gender: 'male', pitch: 0.82, rate: 0.95, accent: 'en-GB', note: 'weary Cold War storyteller, low and dry, le Carre in a raincoat' },
      'Mila': { gender: 'female', pitch: 1.15, rate: 1.12, accent: 'de-DE', volume: 0.7, note: 'terrified archive clerk, whispering fast' },
      'Voss': { gender: 'male', pitch: 0.6, rate: 0.84, accent: 'de-DE', note: 'Stasi officer, quiet, heavy, exhausted, every word weighed' },
      'Frau Kranz': { gender: 'female', pitch: 0.72, rate: 0.85, accent: 'de-DE', note: 'old sleeper agent, gravelly smoker, unflappable gallows humour' },
      'Numbers Station': { gender: 'female', pitch: 0.5, rate: 0.7, accent: 'de-DE', note: 'flat robotic shortwave voice reading digits' },
      'Hollis': { gender: 'male', pitch: 1.0, rate: 1.05, accent: 'en-GB', note: 'charming public-school handler, plummy, too friendly, a smile with no eyes' },
      'Jonas': { gender: 'male', pitch: 1.35, rate: 1.3, accent: 'de-DE', note: 'seventeen-year-old Kreuzberg punk, cocky, fast, scared underneath' },
      'Sokolov': { gender: 'male', pitch: 0.45, rate: 0.78, accent: 'ru-RU', note: 'KGB man with a gold tooth, slow, amused, menacing' },
      'Border Guard': { gender: 'male', pitch: 0.9, rate: 1.0, accent: 'de-DE', note: 'young East German passport officer, clipped, by the book' },
      'Tour Guide': { gender: 'female', pitch: 1.3, rate: 1.25, accent: 'en-US', note: 'chirpy American tour guide, oblivious' },
      'Driver': { gender: 'male', pitch: 1.1, rate: 1.2, accent: 'de-DE', note: 'West Berlin train driver, gruff, swearing, kind' },
      'Transport Police': { gender: 'male', pitch: 0.75, rate: 0.95, accent: 'de-DE', note: 'bored tunnel sentry, suspicious bark' },
      'Voice on the Line': { gender: 'male', pitch: 0.9, rate: 1.0, accent: 'en-US', note: 'calm American intelligence officer on a phone line' },
    },
    vars: { cover: 3, heat: 1 },
    flags: [],
    hud: [
      { var: 'cover', label: 'Cover', icon: '🕶️', max: 5 },
      { var: 'heat', label: 'Heat', icon: '🔥', max: 5 },
    ],
    start: 'intro',
    scenes: {
      // =====================================================================
      intro: {
        title: '11:03 PM — Café Nord, East Berlin',
        art: '☕🎞️',
        scene: 'street',
        mood: 'night',
        weather: 'snow',
        text: [
          `The microfilm is smaller than your thumbnail, and in the next fifty-seven minutes it is going to try very hard to get you killed.`,
          `Café Nord, Prenzlauer Berg. Brown-coal smoke, Vita Cola, a portrait of Comrade Honecker gone yellow above the bar. Outside the steamed window, snow is falling on a street the colour of old newspaper.`,
          `The woman across the table has a red scarf, chewed fingernails and a matchbox. She slides the matchbox over to you with one finger, the way you would push away a plate you couldn't finish.`,
          `Hollis briefed you three days ago in a Charlottenburg flat full of rose catalogues and gin. Three rules, delivered with a smile: *Don't look at it. Don't lose it. Don't be late.* Your West German day visa expires at midnight. A Westerner still in the East at 12:01 is a paperwork problem, and paperwork problems here end in rooms without windows.`,
          { speaker: 'Mila', say: `There is a man across the street. Green coat. He has been everywhere I go since Tuesday. Please. Just go.` },
          `In the black glass of the window you find him: a man in a green loden coat under a dead streetlamp, holding a newspaper he is not reading. Snow collects on his hat. He doesn't brush it off.`,
        ],
        choices: [
          {
            text: 'Ask her what is on the film',
            hint: 'Hollis said never ask.',
            set: ['asked_mila'],
            effect: adj(0, 1),
            art: '❓',
            outcome: [
              `"What am I carrying?" you ask. "I'd like to know what I'm dying for."`,
              `She looks at the matchbox, then at you, with the face of someone who has stopped sleeping.`,
              { speaker: 'Mila', say: `Names. Many names. Probably yours. My name is Mila — if you die, somebody should know it. My brother wears the Ministry's uniform. If he ever learns what I did, he will have to choose between me and his oath.` },
              `She stands too fast, knocks her chair, and walks out into the snow without her gloves. The man in the green coat lowers his paper and watches her go. Then he watches you.`,
            ],
            next: 'tram',
          },
          {
            text: 'Leave by the front door, unhurried',
            hint: `Innocent people don't use back doors.`,
            effect: adj(1, 0),
            art: '🚶',
            outcome: [
              `You finish your coffee, which is mostly chicory and regret. You pay with East marks, leave a tip that is exactly the right size, and wrap your scarf twice around your throat.`,
              `Then you step out into the snow and walk straight past the man in the green coat, close enough to smell his wet wool. He doesn't look up. That is how you know he is good.`,
              `The tram stop is thirty metres away. You do not run. Running is a confession with legs.`,
            ],
            next: 'tram',
          },
          {
            text: 'Slip out through the kitchen',
            hint: 'Lose him before he settles in.',
            effect: adj(-1, -1),
            art: '🍳',
            outcome: [
              `You murmur something about the toilet and go through the swinging door instead. A cook in a vest looks up from a pot of Soljanka; you put a finger to your lips and a ten-mark note on his chopping board.`,
              `Out the back, across a courtyard of frozen bins, through an archway onto Schönhauser Allee. A tram is just pulling in. You catch it by the handrail.`,
              `Clever. Except the cook will remember the Westerner who paid him to forget, and in this city, people get paid twice.`,
            ],
            next: 'tram',
          },
        ],
      },

      // =====================================================================
      tram: {
        title: '11:12 PM — Tram 46, Schönhauser Allee',
        art: '🚋❄️',
        scene: 'train-car',
        mood: 'night',
        weather: 'snow',
        text: [
          `At the second stop, the doors fold open and a green loden coat climbs aboard. He sits three rows behind you, takes out the same unread newspaper, and settles in like a man who has all night.`,
          `The matchbox in your coat pocket feels like a live coal. Frau Kranz's safe house is two stops away. Two stops in which he can do anything at all.`,
        ],
        choices: [
          {
            text: 'Move the film into the hollow heel of your shoe',
            hint: 'The Office cobbler earned his money.',
            set: ['heel'],
            art: '👞',
            outcome: [
              `You bend down as if to retie a frozen lace. A quarter-twist, the way the cobbler in Hamburg showed you, and the heel of your left shoe swings open on a tiny brass pivot.`,
              `The film slides into the cavity. The heel clicks home. You sit up, flushed from the cold, and blow on your hands.`,
              `In the black window, the man in the green coat's eyes flick down to your shoes — and back up to his newspaper.`,
            ],
            next: 'kranz',
          },
          {
            text: `Study him in the window's reflection`,
            hint: 'Know the face that is hunting you.',
            set: ['clocked_voss'],
            art: '🪞',
            outcome: [
              `You let your head rest against the cold glass like a tired commuter, and you study him in the reflection: mid-forties, close-cropped grey hair, a face like a closed door. No radio. No partner. He is working alone, which is either very good or very bad.`,
              `Something about him nags at you. The set of the mouth. The grey of the eyes. You have seen that face recently — younger, frightened, across a café table.`,
              `He turns a page he hasn't read. The tram lurches toward your stop.`,
            ],
            next: 'kranz',
          },
          {
            text: 'Jump off between stops',
            hint: 'Loud. Fast. Hard to follow.',
            effect: adj(1, 1),
            fx: 'shake',
            art: '🏃',
            outcome: [
              `The tram slows for a red light. You hit the emergency door release, shove the doors apart with both hands, and drop into the slush before the driver can shout.`,
              `Through a courtyard, under washing frozen stiff on the lines, over a low wall, through another courtyard. Behind you, the tram bell clangs in outrage.`,
              `When you finally stop at Frau Kranz's door, lungs burning, the street is empty. You lost him. Probably. Half the windows on the block saw you do it.`,
            ],
            next: 'kranz',
          },
        ],
      },

      // =====================================================================
      kranz: {
        title: '11:20 PM — The Safe House',
        art: '📻🫖',
        scene: 'apartment',
        mood: 'candle',
        text: [
          `Fourth floor, no lift, a door with three locks. Frau Anneliese Kranz is seventy-four, has been the Office's eyes in Prenzlauer Berg since the week they built the Wall, and greets you in a cardigan with a pistol in the pocket.`,
          `Her flat smells of cabbage and Ernte 23 cigarettes. On the sideboard, a big Grundig radio hisses shortwave static, and out of the static comes a woman's voice reading numbers.`,
          { speaker: 'Numbers Station', say: `Vier. Sieben. Null. Null. Drei. Eins. Vier. Sieben. Null. Null...` },
          `Kranz copies the digits, works them against a one-time pad and reads the result through her smoke.`,
          { speaker: 'Frau Kranz', say: `From your Englishman. Cross at Friedrichstraße. Meet at Kottbusser Tor platform, half past twelve. A boy named Jonas will find you.` },
          { speaker: 'Frau Kranz', say: `Friedrichstraße. Hollis sent a boy that way in March. Peter. Nice manners. They pulled him out of the Spree in April. The Englishman sent flowers — roses, from his own garden. Always the garden with that man.` },
          `She sets a jeweller's loupe and a desk lamp on the oilcloth. Beside them, a battered tin of her own film: *Ostsee 1971*.`,
          { speaker: 'Frau Kranz', say: `If you want to know what you are dying for, I have a lamp. If you want to give somebody a surprise, I have a whole holiday on the Baltic. Film is film, in the dark. Also: if Friedrichstraße smells wrong, there is a grate in the coal yard on Brunnenstraße. It goes down to the old U-Bahn tunnel. West trains still run through it.` },
        ],
        choices: [
          {
            text: 'Look at the film',
            hint: 'Break rule number one.',
            set: ['peeked'],
            art: '🔎',
            outcome: [
              { if: 'heel', text: `You twist your heel open and tip the film onto the oilcloth.`, else: `You tip the film out of the matchbox onto the oilcloth.` },
              `Under the loupe, the tiny frames bloom into typed pages. Lists. Names, codenames, addresses, all in neat Cyrillic and German. *KRANZ, Anneliese — "MOTH."* Frau Kranz reads her own name over your shoulder and doesn't blink. Further down: a codename you know better than your passport name. *WREN.* You.`,
              `It's a list of every Western agent in East Berlin, sent to the Stasi by Moscow. The cover sheet names the source who sold it: *Quelle GÄRTNER — London.* Source Gardener.`,
              { speaker: 'Frau Kranz', say: `Gärtner. The gardener.` },
              `You think of a Charlottenburg flat full of rose catalogues, and the coffee in your stomach turns to ice.`,
            ],
            next: 'stairs',
          },
          {
            text: 'Make a decoy from her holiday film',
            hint: 'A second matchbox, for whoever asks first.',
            set: ['decoy'],
            art: '✂️',
            outcome: [
              `Kranz's kitchen scissors, her steady hands, your unsteady ones. You cut a strip of *Ostsee 1971* to the exact length of the real thing and seal it in a second matchbox: same brand, same tired label.`,
              { if: 'heel', text: `The real film stays in your heel. The fake goes in your coat pocket, where a searching hand would expect to find it.`, else: `The real film goes in your inside pocket. The fake goes in your outer one, where a searching hand would expect to find it.` },
              { speaker: 'Frau Kranz', say: `Some fat Russian will spend all week squinting at me in a swimsuit. Good. I had excellent legs in 1971.` },
            ],
            next: 'stairs',
          },
          {
            text: 'Do both: look, then cut a decoy',
            hint: 'Knowledge and insurance. Time you may not have.',
            set: ['peeked', 'decoy'],
            effect: adj(0, 1),
            art: '🔎',
            outcome: [
              `You do it fast. The loupe first: frames of typed lists, names and codenames and addresses. *KRANZ, Anneliese — "MOTH."* And lower down, your own codename: *WREN.* A list of every Western agent in East Berlin, and on the cover sheet, the traitor who sold it to Moscow: *Quelle GÄRTNER — London.*`,
              { speaker: 'Frau Kranz', say: `Gärtner. The gardener. Scissors are in the drawer. Hurry.` },
              `You cut a strip of *Ostsee 1971* to the same length and seal it in a second matchbox. Real film in one hiding place, holiday snaps in another. It takes eight minutes. Down in the street, a car door closes softly.`,
            ],
            next: 'stairs',
          },
          {
            text: `Neither. Hollis's rules.`,
            hint: `The less you know, the less they can take from you.`,
            effect: adj(1, 0),
            art: '🙅',
            outcome: [
              `You push the loupe back across the table. "I'm a courier, Frau Kranz. Couriers carry. That's the whole job."`,
              `She studies you through her cigarette smoke for a long moment.`,
              { speaker: 'Frau Kranz', say: `Obedient. Peter was obedient too. Lovely boy. Go, then. Go with God, or with Hollis, whichever of them is listening.` },
            ],
            next: 'stairs',
          },
        ],
      },

      // =====================================================================
      stairs: {
        title: '11:31 PM — The Stairwell',
        art: '🪜💡',
        scene: 'stairwell',
        mood: 'night',
        fx: 'heartbeat',
        text: [
          `Berlin stairwells run on timer lights: press the switch, get sixty seconds of yellow bulb, then darkness. You are on the third-floor landing when yours clicks off.`,
          `Below you, the street door bangs. Footsteps on the stone stairs. Slow, deliberate, coming up. Through the gap in the banister you see the shoulder of a green loden coat rising out of the dark.`,
          { if: 'clocked_voss', text: `Alone. No radio. Just as on the tram.` },
          `Up: one more floor and an iron ladder to the roof. Behind you: Frau Kranz's door, and the coal chute she showed you on the way in. Or you could simply stand here, in the dark, and let him come.`,
        ],
        timer: 8,
        timeout: {
          text: 'You froze.',
          set: ['kranz_taken'],
          effect: adj(-1, 2),
          art: '💡',
          outcome: [
            `You hesitate, and somebody on the floor below presses the light switch. The bulb flares. The man in the green coat is looking straight up the stairwell into your face.`,
            `You run back up. Frau Kranz has her door open before you reach it, as if she has done this before, and shoves you toward a hatch in her kitchen floor.`,
            { speaker: 'Frau Kranz', say: `Coal chute. Don't sneeze. Don't come back for me.` },
          ],
          next: 'raid',
        },
        choices: [
          {
            text: 'Up, to the roof',
            hint: 'Nobody expects up.',
            scene: 'rooftop',
            art: '🧗',
            outcome: [
              `You go up on your toes, silent, one hand on the cold rail. The roof hatch is stiff with frost; you put your shoulder into it and it gives with a crack that sounds, to you, like a gunshot.`,
              `Then you're out on the roof, in the snow, under a sky lit orange from below by the searchlights on the Wall.`,
            ],
            next: 'roofs',
          },
          {
            text: 'Wait on the landing and face him',
            hint: 'If he wanted you dead, you would know.',
            art: '🧍',
            outcome: [
              `You don't move. You let him climb. Step. Step. Step. In the dark you hear him stop, three stairs below you, breathing hard from four flights.`,
              `Then his hand finds the light switch, and the bulb buzzes on, and you are face to face with the man in the green coat.`,
            ],
            next: 'voss_talk',
          },
          {
            text: `Back to Kranz's coal chute`,
            hint: 'She has done this before. Hasn\'t she?',
            set: ['kranz_taken'],
            effect: adj(0, 1),
            art: '🚪',
            outcome: [
              `You turn and take the stairs back up two at a time. Kranz opens before you knock; she has heard the street door too.`,
              `She pulls back a rag rug, lifts a hatch, and points into a black chute that smells of soot and a hundred winters.`,
              { speaker: 'Frau Kranz', say: `Down. I'll make him tea. I make terrible tea. It takes a long time to drink.` },
            ],
            next: 'raid',
          },
        ],
      },

      // =====================================================================
      roofs: {
        title: '11:34 PM — The Rooftops',
        art: '🏚️🔦',
        scene: 'rooftop',
        mood: 'night',
        weather: 'snow',
        text: [
          `Chimneys, slate, snow. TV aerials everywhere, every one of them twisted to point west, toward forbidden television. To the south, past a mile of dark roofs, the Wall's searchlights rake the sky in slow white arcs.`,
          `Below, the street door opens. The man in the green coat steps out onto the pavement, looks left, looks right — and then, very slowly, looks up.`,
          `You have the dark, the snow and a drainpipe. He has whatever he has.`,
        ],
        choices: [
          {
            text: 'Lie flat behind a chimney and watch him',
            hint: 'Let the snow cover you.',
            set: ['clocked_voss'],
            effect: adj(1, 0),
            art: '👀',
            outcome: [
              `You press yourself into the snow behind a chimney stack, cheek against frozen brick, and watch him over the gutter.`,
              `He stares up for a long time. Then he lights a cigarette with a match from a little Riesa matchbox — the same brand Mila used. Same chewed corner, even. He doesn't call anyone. He doesn't signal anyone. He just smokes, and looks, and finally walks away toward the tram, shoulders hunched like a man carrying something heavy.`,
              `Whoever he is, he isn't hunting you for the Ministry. He's hunting you for himself.`,
            ],
            next: 'crossroads',
          },
          {
            text: 'Go down the drainpipe into the next courtyard',
            hint: 'Iron pipes. Frozen hands.',
            effect: adj(0, 1),
            fx: 'shake',
            art: '🧗',
            outcome: [
              `You swing over the gutter and grab the drainpipe. It holds for two floors. On the third, a bracket tears out of the old brick and you ride the pipe down the last few metres like a falling tree.`,
              `You land in a heap of frozen bins. A dog explodes into barking. A light snaps on in a window above you, and an old man in a vest leans out to see who's robbing the courtyard.`,
            ],
            next: 'crossroads',
          },
        ],
      },

      // =====================================================================
      voss_talk: {
        title: '11:33 PM — The Landing',
        art: '🧥💡',
        scene: 'stairwell',
        mood: 'fog',
        text: [
          `Up close he is older than he looked on the street. Grey stubble, a nick from a careless razor, eyes red from too many nights in parked cars. He doesn't reach for a gun. He holds up both hands, palms out, the way you'd approach a dog.`,
          { speaker: 'Voss', say: `Oberleutnant Voss. Ministry for State Security. You are carrying something that will get a young woman killed.` },
          { if: 'clocked_voss', text: `In the yellow light you finally place the face. The mouth. The grey eyes. Half an hour ago, across a café table, wearing a red scarf.` },
          { speaker: 'Voss', say: `Give it to me, and I walk you to Checkpoint Charlie myself. You will be in your bed in the West by one o'clock. My word, for what you think it is worth.` },
          `The timer light ticks. Forty seconds before it goes dark again.`,
        ],
        choices: [
          {
            if: 'asked_mila',
            text: `Say her name: "Mila sends her love."`,
            hint: 'A brother has to choose between his sister and his oath.',
            set: ['voss_ally'],
            effect: adj(0, -1),
            art: '🧣',
            outcome: [
              `His face breaks. Just for a second, like ice on a puddle. Then he puts it back together.`,
              { speaker: 'Voss', say: `She told you her name. Of course she did. She never could keep a secret, my sister — except this one.` },
              { speaker: 'Voss', say: `Listen to me. I am not following you to arrest you. I am following you because I want to know who she is giving her life to. The man you work for is the one who sold that list to Moscow. My people know his face. At Friedrichstraße, booth three, they have your photograph on the desk. He gave it to them.` },
              `He presses a cardboard matchbook into your hand. A West Berlin phone number, written in pencil.`,
              { speaker: 'Voss', say: `When you are across, call this. Not him. Never him again.` },
            ],
            next: 'crossroads',
          },
          {
            text: 'Offer him two hundred West marks',
            hint: 'Everyone in this city has a price.',
            effect: adj(-1, 1),
            art: '💵',
            outcome: [
              `You hold out the notes. Blue-grey Deutschmarks, two hundred of them, enough to buy a colour television in an Intershop.`,
              `He looks at the money for a long time. Then he takes it, folds it once, and puts it in his breast pocket with an expression of deep, private sadness.`,
              { speaker: 'Voss', say: `Everyone in the West thinks we are for sale. Go.` },
              `He steps aside. As you reach the street door, you hear him lift the receiver of the communal phone in the hallway, and dial.`,
            ],
            next: 'crossroads',
          },
          {
            text: 'Shove him down the stairs',
            hint: 'Gravity takes no bribes.',
            effect: adj(0, 2),
            fx: 'shake',
            art: '💥',
            outcome: [
              `You hit him with both hands, hard, in the chest. He goes backwards down the stone steps, arms windmilling, and lands on the half-landing with a crack and a grunt.`,
              `You jump past him. His hand closes on your ankle. For one awful second you are both on the floor, and his face is inches from yours.`,
              { speaker: 'Voss', say: `You stupid — you don't even know who you are working for.` },
              `You kick free and run. Behind you, the timer light clicks off, and a hoarse voice in the dark starts shouting for someone to call the Volkspolizei.`,
            ],
            next: 'crossroads',
          },
        ],
      },

      // =====================================================================
      raid: {
        title: '11:35 PM — The Coal Cellar',
        art: '⚫🕯️',
        scene: 'basement',
        mood: 'ember',
        text: [
          `You come out of the chute into a cellar full of brown-coal briquettes, black and cold and absolute. Coal dust in your mouth, your eyes, your collar.`,
          `Above you, through the chute, voices carry down like a radio play. A knock. The scrape of three locks. A man's low voice. Frau Kranz's, loud and clear and much too calm.`,
          { speaker: 'Voss', say: `Frau Kranz. You will put on your coat and come with me.` },
          { speaker: 'Frau Kranz', say: `Of course, Herr Oberleutnant. Only — someone should tell the gardener that his roses have died. *Someone should tell the gardener.*` },
          `She is not speaking to him. She is speaking to the chute. Footsteps on the stairs. A car door. An engine. Then the long silence of a building where everybody has decided not to have heard anything.`,
        ],
        choices: [
          {
            if: '!peeked',
            text: 'Strike a match and look at the film',
            hint: 'Find out what she just paid for.',
            set: ['peeked'],
            art: '🔥',
            outcome: [
              `Your hands shake so badly it takes three matches. In the little orange flare you hold the film up to the flame, squinting through the frames.`,
              `Lists. Names. *KRANZ, Anneliese — "MOTH."* Further down, your own codename: *WREN.* A list of every Western agent in East Berlin, and on the cover sheet, typed in Russian and German, the source who sold it: *Quelle GÄRTNER — London.*`,
              `Gärtner. Gardener. *Someone should tell the gardener.* The match burns down to your fingers, and you don't feel it at all.`,
            ],
            next: 'crossroads',
          },
          {
            text: 'Wait until the car is long gone',
            hint: `Don't waste what she just bought you.`,
            effect: adj(1, 0),
            art: '⏳',
            outcome: [
              `You sit in the coal in the dark and count to six hundred, slowly, the way they taught you. It is the longest ten minutes of your life. You think about Peter in the Spree. You think about the terrible tea she never got to make.`,
              `When you finally climb out through the coal hatch into the courtyard, the street is empty, the snow has filled in the tyre tracks, and her window on the fourth floor is dark.`,
            ],
            next: 'crossroads',
          },
          {
            text: 'Out through the coal hatch, right now',
            hint: 'Before they come back for the flat.',
            effect: adj(-1, -1),
            art: '🏃',
            outcome: [
              `You don't wait. You shoulder the iron coal hatch up into the courtyard and come out black from head to toe, like a chimney sweep in a bad dream.`,
              `You're three streets away before the second car arrives to search the flat. But you look like exactly what you are: someone who just crawled out of a hole.`,
            ],
            next: 'crossroads',
          },
        ],
      },

      // =====================================================================
      crossroads: {
        title: '11:40 PM — Kastanienallee',
        art: '🕰️🛣️',
        scene: 'street',
        mood: 'night',
        weather: 'snow',
        text: [
          `Twenty minutes to midnight. Twenty minutes left on your visa, and three ways back across the Wall.`,
          { if: 'kranz_taken', text: `A grey Wartburg cruises past with its lights off. Somewhere in the back of a car like that, Frau Kranz is lighting a cigarette and telling them nothing.` },
          { if: 'voss_ally', text: `Voss's matchbook is in your glove. *Booth three. They have your photograph on the desk.*` },
          { if: 'peeked', text: `You know now what you're carrying: a list of everyone like you, and the name of the person who sold it. And the person who sold it is the one waiting to receive it.` },
          { if: hot(3), text: `Sirens, two streets over. Blue lights sliding across the snow. The city has woken up, and it is looking for someone your size.` },
          `Hollis said Friedrichstraße. Checkpoint Charlie is the obvious alternative — tourists, Americans, cameras. And Frau Kranz's grate on Brunnenstraße leads down into the dark, to the ghost stations under the Wall.`,
        ],
        choices: [
          {
            text: 'Friedrichstraße, as Hollis ordered',
            hint: 'The plan exists for a reason.',
            set: ['r_fried'],
            effect: (s) => adj(0, s.has('voss_ally') ? 1 : 0)(s),
            scene: 'station',
            art: '🚉',
            outcome: [
              `You flag down a sputtering Trabant taxi and pay the driver triple to get you to Friedrichstraße before the last-minute crush.`,
              { if: 'voss_ally', text: `You know what's waiting in booth three. You go anyway, because Hollis's plan is the only one with a ticket at the end of it. You tell yourself you'll choose a different queue.` },
            ],
            next: 'friedrich',
          },
          {
            text: 'Checkpoint Charlie, on foot',
            hint: 'Americans with cameras on the other side.',
            set: ['r_charlie'],
            scene: 'checkpoint',
            art: '🛂',
            outcome: [
              `You walk south fast, cutting through the dead streets of Mitte, past bullet-pocked facades nobody has bothered to repair since 1945.`,
              `Then Friedrichstraße opens out ahead of you, and there it is: floodlights, zigzag concrete, a watchtower, and a hundred metres away, a little white hut and a sign that says YOU ARE ENTERING THE AMERICAN SECTOR.`,
            ],
            next: 'charlie',
          },
          {
            text: `Kranz's grate, down to the ghost tunnel`,
            hint: `No passport control underground. Just guards with rifles.`,
            set: ['r_ghost'],
            scene: 'tunnel',
            art: '🕳️',
            outcome: [
              `The coal yard on Brunnenstraße is padlocked and abandoned. You climb the fence. Behind a heap of rotten pallets, just where she said, a rusted grate sits over a black square of nothing.`,
              `It takes everything you have to lift it. Warm, stale air breathes up at you, smelling of iron and electricity. An iron ladder goes down into the dark.`,
            ],
            next: 'ghost_shaft',
          },
        ],
      },

      // =====================================================================
      friedrich: {
        title: '11:47 PM — The Palace of Tears',
        art: '🚉😢',
        scene: 'station',
        mood: 'ice',
        text: [
          `The departure hall is glass and cold fluorescent light. Families cling to each other at the barrier, grandmothers and grandsons who will see each other again next year, or never. That's why they call it the Palace of Tears.`,
          `A queue of Westerners shuffles toward a row of narrow control booths. Somewhere behind a mirrored window, someone is watching every face.`,
          { if: 'voss_ally', text: `Booth three has the shortest queue. Of course it does.` },
          { if: hot(3), text: `By the stairs, a man in a leather coat that is too good for a guard watches the queue with a photograph cupped in his palm.` },
          `Thirteen minutes left on your visa. To one side, a dozen British football supporters in scarves are singing, very badly, about a team that lost to Dynamo Berlin this afternoon.`,
        ],
        choices: [
          {
            text: 'Join the shortest queue',
            hint: 'Booth three. In and out.',
            effect: (s) => adj(0, s.has('voss_ally') ? 2 : 0)(s),
            art: '🚶',
            outcome: [
              `You join the shortest queue, because that's what a tired tourist does, and you keep your eyes on the floor.`,
              { if: 'voss_ally', text: `Booth three. As you reach the front, you see it: a photograph of you, taken in Charlottenburg three days ago, lying face up on the officer's desk. The only person who knew you'd be in Charlottenburg was Hollis.`, else: `The queue moves steadily. Too steadily. Like something swallowing.` },
            ],
            next: 'booth',
          },
          {
            text: 'Attach yourself to the British football fans',
            hint: 'Twelve loud idiots and one quiet one.',
            effect: adj(1, 0),
            art: '⚽',
            outcome: [
              `You fall in among the scarves, borrow a chant, and accept a swig from a hip flask that is ninety percent paint stripper. Somebody calls you "mate" and drapes an arm around your shoulders.`,
              `The guards wince at the singing and wave the whole lot of you toward the end booth just to get rid of the noise. Twelve red faces and yours, which is turning red to match.`,
            ],
            next: 'booth',
          },
          {
            text: 'Abort: walk to Checkpoint Charlie',
            hint: `It's a kilometre. You have thirteen minutes.`,
            set: ['r_charlie'],
            unset: ['r_fried'],
            effect: adj(0, 1),
            scene: 'checkpoint',
            art: '🏃',
            outcome: [
              `Something about the man by the stairs. Something about the queue. You turn on your heel and walk back out into the snow, and you keep walking, faster and faster, down Friedrichstraße toward the floodlights.`,
              `Behind you, someone steps out of the station doors to watch you go.`,
            ],
            next: 'charlie',
          },
        ],
      },

      // =====================================================================
      booth: {
        title: '11:53 PM — Passport Control',
        art: '🛂🪞',
        scene: 'corridor',
        mood: 'office',
        fx: 'heartbeat',
        text: [
          `The booth is the size of a wardrobe. A buzzer door in front of you, a buzzer door behind you, and an angled mirror above your head so the officer can see your feet without standing up.`,
          `He is maybe twenty-two, with a moustache he is trying hard to grow. He looks at your passport photo. At you. At the photo. At you.`,
          { speaker: 'Border Guard', say: `Your visa expires in seven minutes. Why so late? What were you doing in the capital of the German Democratic Republic until midnight?` },
          `His eyes go to your coat. His hand moves toward the ledge between you, palm up, waiting.`,
          { speaker: 'Border Guard', say: `Empty your pockets, please.` },
        ],
        timer: 8,
        timeout: {
          text: 'You stammered.',
          effect: adj(-2, 1),
          art: '😰',
          outcome: [
            `You open your mouth and what comes out is the wrong language, then the wrong answer, then a cough.`,
            `The guard's pen stops moving. He picks up a telephone without taking his eyes off you and says something too quiet to hear.`,
            {
              if: covered(2),
              text: `A long minute. Then the phone buzzes back, and whatever the voice says, it bores him. He stamps your passport hard enough to hurt and buzzes the door. "Next time, Fräulein, Herr — whoever you are — leave earlier."`,
              else: `The door behind you buzzes. Not the one in front.`,
            },
          ],
          next: (s) => (covered(2)(s) ? 'west' : 'end_caught'),
        },
        choices: [
          {
            text: `Smile: "The Brecht ran long."`,
            hint: 'Every tourist sees the Brecht.',
            art: '🎭',
            outcome: [
              `"The Berliner Ensemble," you say, with a tourist's helpless shrug. "Three hours of Brecht. Nobody warned me there'd be singing."`,
              {
                if: (s) => covered(2)(s) && !hot(4)(s),
                text: `For the first time, his moustache twitches. "Nobody ever warns anybody." He stamps your passport, slides it back, and buzzes the door. Cold air hits your face from the West side of the hall.`,
                else: `He doesn't smile. He reaches under the ledge and presses a button you can't see. "Which play? Who directed? What colour was the curtain?" You don't know. You never knew. The door behind you buzzes open.`,
              },
            ],
            next: (s) => (covered(2)(s) && !hot(4)(s) ? 'west' : 'end_caught'),
          },
          {
            if: 'heel',
            text: 'Empty your pockets for him, cheerfully',
            hint: 'The real film is in your heel.',
            effect: (s) => { if (s.has('decoy')) { s.unset('decoy'); s.set('lost_decoy'); } },
            art: '🧾',
            outcome: [
              `Wallet, keys, a tram ticket, a packet of HB cigarettes, and a matchbox. You set them on the ledge one by one, like a magician with nothing up his sleeve.`,
              {
                if: 'lost_decoy',
                text: `He opens the matchbox, tips out the matches, and finds Frau Kranz's holiday strip underneath. He holds it up to the light and squints: a woman with excellent legs on a Baltic beach. He snorts, drops it into his drawer as "contraband material", and waves you on. There goes your decoy. But he never once looks at your shoes.`,
                else: `He opens the matchbox and tips out the matches. Only matches. He shakes the box, sniffs it, sighs, and slides it back. He never once looks at your shoes.`,
              },
              `The door buzzes. Your left heel clicks on the tiles all the way across the hall, like a clock.`,
            ],
            next: 'west',
          },
          {
            text: 'Demand to see the British consul',
            hint: 'Outrage is a kind of cover.',
            effect: adj(0, 2),
            art: '😤',
            outcome: [
              `"This is outrageous," you say, loud enough for the next three booths to hear. "I am a guest in your country and I want the British consul. Now."`,
              {
                if: covered(3),
                text: `He blinks. Twenty-two years old, and nobody has ever shouted at him in English. He decides, visibly, that you are somebody else's problem, stamps your passport, and buzzes you through just to make you stop.`,
                else: `He doesn't blink. He picks up the phone. "The consul," he says pleasantly, "will be informed." Then the door behind you opens, and two men in leather coats step into the booth.`,
              },
            ],
            next: (s) => (covered(3)(s) ? 'west' : 'end_caught'),
          },
        ],
      },

      // =====================================================================
      charlie: {
        title: '11:52 PM — Checkpoint Charlie',
        art: '🛂🔦',
        scene: 'checkpoint',
        mood: 'ice',
        weather: 'snow',
        text: [
          `Floodlights turn the snow into a stage. Concrete chicanes, a striped barrier, a watchtower with a man in it, and beyond all of it, a hundred metres away, the little white American hut with its sandbags and its sign.`,
          `A gaggle of American tourists in matching ski jackets is shuffling through East German control, led by a woman holding a furled umbrella above her head like a torch.`,
          { if: hot(3), text: `Behind you, a grey Wartburg pulls up at the kerb with its engine running. Nobody gets out. Nobody has to.` },
          `Eight minutes. The guard at the barrier is checking passports one by one, slowly, with a torch.`,
        ],
        choices: [
          {
            text: 'Present your papers and look bored',
            hint: 'The most boring person at the border.',
            art: '🥱',
            outcome: [
              `You join the line, hold out your passport, and yawn. Not a fake yawn: the real kind, because your body has decided it would rather sleep than die.`,
              {
                if: covered(2),
                text: `The guard shines his torch in your face, then on your visa, then on his watch. "Seven minutes. Lucky." He lifts the barrier. You walk the hundred metres to the white line without running, which is the hardest thing you have ever done.`,
                else: `The guard shines his torch in your face, then on a clipboard, then back at your face. He says something to the watchtower. The barrier stays down. Hands take your elbows from both sides, very politely.`,
              },
            ],
            next: (s) => (covered(2)(s) ? 'west' : 'end_caught'),
          },
          {
            text: 'Fall in with the American tour group',
            hint: 'Hide in a crowd of matching ski jackets.',
            effect: adj(1, 0),
            art: '📸',
            outcome: [
              `You fall in at the back of the group, pull your hat down, and become the twenty-second person in a ski jacket.`,
              { speaker: 'Tour Guide', say: `Okay, folks, stay together! Passports open to the photo page! And remember, no pictures of the guards, they get *super* touchy about that!` },
              {
                if: hot(4),
                text: `A guard counts heads. Counts again. Twenty-two. The guide's clipboard says twenty-one. He looks straight at you, and his hand goes to his holster.`,
                else: `A guard counts heads, gets bored around fourteen, and waves the whole flock through. You walk across the white line in a cloud of Ohio accents.`,
              },
            ],
            next: (s) => (hot(4)(s) ? 'end_caught' : 'west'),
          },
          {
            text: 'Sprint for the white line',
            hint: 'A hundred metres. Searchlights. Rifles.',
            effect: adj(-1, 2),
            fx: 'redflash',
            art: '🏃',
            outcome: [
              `You break from the line and run. Somebody shouts *Halt!*, and then everybody shouts it. The floodlights swing. Your shoes skid on the ice.`,
              {
                if: hot(5),
                text: `You get forty metres. Then a guard comes over the barrier like a rugby player and hits you at the knees, and the snow comes up and fills your mouth.`,
                else: `Two shots crack into the air above your head — warning shots, you will tell yourself later. You hit the white line on your hands and knees, and an American MP with a moustache hauls you up by the collar. "Jesus, buddy. You know there's a door, right?"`,
              },
            ],
            next: (s) => (hot(5)(s) ? 'end_caught' : 'west'),
          },
        ],
      },

      // =====================================================================
      ghost_shaft: {
        title: '11:45 PM — Under Brunnenstraße',
        art: '🕳️🐀',
        scene: 'tunnel',
        mood: 'void',
        text: [
          `The ladder ends in a maintenance passage, and the passage ends in the tunnel: a long, black throat of brick and rail, lit every fifty metres by a caged bulb. Somewhere ahead is Rosenthaler Platz — a ghost station, sealed in 1961, where West Berlin trains still roll through without stopping, under East Berlin streets.`,
          `Ahead, where the tunnel widens toward the dead platform, a torch beam is moving. Transport Police. One man, a rifle, a long and boring night.`,
        ],
        choices: [
          {
            text: 'Crawl through the cable conduit',
            hint: 'Slow, filthy, invisible.',
            effect: adj(1, 0),
            art: '🐀',
            outcome: [
              `You wriggle into the cable conduit that runs alongside the track bed, a concrete trough barely wider than your shoulders. The rats aren't happy to share it. Neither are you.`,
              `Thirty metres on your elbows in the dark, the torch beam passing a hand's width above your back. You stop breathing twice. You come out at the end of the platform, unseen, shaking, grey with dust.`,
            ],
            next: 'ghost_platform',
          },
          {
            text: 'Walk the track bed like you belong',
            hint: `Night shift. Cable inspection. Bored.`,
            effect: adj(-1, 0),
            art: '🦺',
            outcome: [
              `You stand up straight and walk down the middle of the track, whistling. The torch swings into your face.`,
              { speaker: 'Transport Police', say: `Halt! Who's there? Nobody is scheduled tonight.` },
              `"Cable inspection," you call, in your best bored Saxon. "Somebody in Pankow blew a fuse and the whole section's dead. You think I want to be down here?"`,
              `He grumbles, lowers the torch, and goes back to his booth. But he writes something down. In this country, somebody always writes something down.`,
            ],
            next: 'ghost_platform',
          },
        ],
      },

      // =====================================================================
      ghost_platform: {
        title: '11:54 PM — Rosenthaler Platz (Sealed)',
        art: '🚇👻',
        scene: 'station',
        mood: 'fog',
        fx: 'heartbeat',
        text: [
          `The ghost station. Posters from 1961 still peel off the tiled walls: an advert for a film nobody remembers, a smiling woman selling soap to a city that no longer exists. The clock over the platform stopped at 4:07 on some morning twenty-two years ago.`,
          `The rails begin to sing. Headlights bloom in the tunnel: a yellow West Berlin train, slowing to a crawl as the rules require. Through its windows, you can see people reading *Bild*, eating sausages, going home. Twenty metres away, and a whole world away.`,
          `In the sentry booth, the guard's head is turning toward the train. Toward the platform. Toward you.`,
        ],
        timer: 7,
        timeout: {
          text: 'You hesitated.',
          effect: adj(-1, 2),
          art: '🔦',
          outcome: [
            `You hesitate a heartbeat too long. The torch finds you.`,
            { speaker: 'Transport Police', say: `HALT! Stehenbleiben!` },
            {
              if: hot(4),
              text: `You run for the last car anyway. A shot sparks off the tiles beside your head. Your fingers close on the coupling, slip, close again — and then a second guard you never saw steps out of the shadows at the end of the platform with his rifle level, and the train rolls on without you.`,
              else: `You sprint for the last car. A shot sparks off the tiles a metre behind you. Your fingers close on the rear coupling and you swing your legs up as the train picks up speed, and the ghost station and its stopped clock slide away into the dark.`,
            },
          ],
          next: (s) => (hot(4)(s) ? 'end_caught' : 'west'),
        },
        choices: [
          {
            text: `Leap for the last car's coupling`,
            hint: 'Twenty metres. Walking pace. Ice-cold steel.',
            effect: adj(0, 1),
            fx: 'shake',
            art: '🤸',
            outcome: [
              `You let the train slide past, car after car, faces at the windows, and as the last one draws level you run, jump and grab.`,
              `The coupling is ice-cold and greasy. Your feet find the bumper. Behind you the guard shouts, too late, and the train gathers speed into the dark. You ride the last car under the Wall like a stowaway on the end of the world, until the next station has lights, and adverts for Coca-Cola.`,
            ],
            next: 'west',
          },
          {
            text: 'Step into the headlights and wave',
            hint: `West Berlin drivers aren't supposed to stop. Some do.`,
            effect: adj(-1, 1),
            art: '👋',
            outcome: [
              `You step off the platform edge into the headlights with both arms raised. The brakes shriek. The train shudders to a crawl, and the cab door flies open.`,
              { speaker: 'Driver', say: `Bist du wahnsinnig? Are you mad? Get in, get in, get *in*!` },
              `He hauls you into the cab by your coat. Behind you, the guard is shouting into a telephone. The driver swears at you all the way to Moritzplatz, then gives you his thermos and tells you he never saw you.`,
            ],
            next: 'west',
          },
          {
            text: 'Let this one go; wait for the next',
            hint: 'Patience is camouflage. Six minutes to midnight.',
            effect: adj(0, 1),
            art: '⏱️',
            outcome: [
              `You press yourself into a dark doorway behind a peeling poster and let the train go by. The guard's torch sweeps the platform. Stops. Moves on.`,
              {
                if: covered(3),
                text: `Four minutes later the next train comes through, slower still, and you step aboard the rear platform as calmly as getting on a bus. Nobody saw. Nobody ever sees the patient ones.`,
                else: `Four minutes later the torch comes back, slower this time, and the guard is not alone. They find you in the doorway, with coal dust on your collar and a story nobody believes.`,
              },
            ],
            next: (s) => (covered(3)(s) ? 'west' : 'end_caught'),
          },
        ],
      },

      // =====================================================================
      west: {
        title: '12:14 AM — Kreuzberg, West Berlin',
        art: '🌃🧱',
        scene: 'city-night',
        mood: 'neon',
        weather: 'rain',
        text: [
          `West Berlin hits you like a slap of colour. Neon in Turkish and German, a kebab shop still open, punks drinking on the steps of a squat, the elevated U1 line clanking overhead. The snow has turned to sleet. Behind you, the Wall: grey, scribbled with graffiti on this side, blank and lethal on the other.`,
          { if: 'r_fried', text: `You walked out of the Palace of Tears into the S-Bahn and out of the S-Bahn into the world, and your legs have only just stopped shaking.` },
          { if: 'r_charlie', text: `The American MPs at the white hut gave you a cup of coffee and a hard look, and asked no questions you had to answer.` },
          { if: 'r_ghost', text: `You climbed out of the U-Bahn at Moritzplatz grey with tunnel dust, and nobody on the platform looked twice. In Kreuzberg, everyone looks like that.` },
          { if: 'heel', text: `You check your heel. Still there. Still yours. For now.` },
          { if: hot(3), text: `Across the street, a black Mercedes with diplomatic plates idles at the kerb. Soviet plates. Its wipers beat slowly, like a pulse.` },
          `You're out. You're alive. And the meeting is at half past twelve at Kottbusser Tor, with a man who may or may not be the Gardener.`,
          `There is a yellow phone booth on the corner.`,
        ],
        choices: [
          {
            text: 'Phone Hollis from the booth',
            hint: 'Hear his voice. Listen to what he says.',
            art: '☎️',
            outcome: [
              `You feed the slot with ten-pfennig coins and dial the Charlottenburg number from memory. It rings once. Twice.`,
              `He picks up on the third ring, as if he was sitting with his hand on the receiver.`,
            ],
            next: 'hollis_call',
          },
          {
            text: 'Go straight to Kottbusser Tor',
            hint: 'Stick to the schedule. Trust the plan.',
            art: '🚶',
            outcome: [
              `You turn up your collar and walk, keeping to the shadows of the elevated railway, checking every shop window for a reflection that is following you.`,
            ],
            next: 'kotti',
          },
          {
            if: 'voss_ally',
            text: `Call the number on Voss's matchbook`,
            hint: 'Not him. Never him again.',
            set: ['called_voss'],
            art: '📞',
            outcome: [
              `You dial the pencilled number. It's answered before the first ring finishes.`,
              { speaker: 'Voice on the Line', say: `Lark's brother said you'd call. Don't say your name. Where's the meeting, and who's going to be there?` },
              `An American voice. Calm, clipped, awake at midnight. You tell him everything: Kottbusser Tor, Hollis, the Gardener. There is a short silence.`,
              { speaker: 'Voice on the Line', say: `Understood. Go to your meeting. Act normal. We'll be closer than you think. And — Lark is safe, for now. Her brother is seeing to it. He wanted you to know.` },
            ],
            next: 'kotti',
          },
        ],
      },

      // =====================================================================
      hollis_call: {
        title: '12:18 AM — A Phone Booth on Oranienstraße',
        art: '☎️🌹',
        scene: 'street',
        mood: 'night',
        weather: 'rain',
        text: [
          { speaker: 'Hollis', say: `Wren! Thank God. Frightful night for it. I've been sitting up pruning, can you believe it — hothouse roses, they don't know it's winter. Bless them.` },
          `His voice is warm, amused, plummy as a Christmas pudding. The voice of the man who taught you to tie a dead-letter knot and to never, ever look.`,
          { speaker: 'Hollis', say: `Slight change of venue. Not Kotti — too many eyes. The old Anhalter Bahnhof ruin, one o'clock. Jonas will walk you over. Everything all right? No trouble on the other side?` },
          { if: 'peeked', text: `You picture him in his flat with the rose catalogues, the receiver tucked under his chin, secateurs in his hand. *Quelle GÄRTNER.* Your mouth has gone completely dry.` },
        ],
        choices: [
          {
            text: 'Report in, by the book',
            hint: 'Give him nothing. Give him everything he expects.',
            effect: adj(1, 0),
            art: '📋',
            outcome: [
              `"No trouble," you say. "Clean crossing. Package intact. Anhalter at one."`,
              { speaker: 'Hollis', say: `Splendid. And you didn't look, did you? Of course you didn't. Good egg. See you at one.` },
              `The line goes dead. You stand in the booth a moment longer, listening to the hum, wondering why the question felt like a hand on the back of your neck.`,
            ],
            next: 'kotti',
          },
          {
            text: `Test him: "I lost it. The film's gone."`,
            hint: 'Watch what breaks.',
            set: ['proof'],
            effect: adj(0, 1),
            art: '🧪',
            outcome: [
              `"I lost it," you say. "They searched me at the border. It's gone, Hollis. I'm sorry."`,
              `Silence. Three seconds. Four. When he speaks again, the pudding has gone out of his voice.`,
              { speaker: 'Hollis', say: `That's not possible. You came through clean, Sokolov's people saw you come thr—` },
              `He stops. You hear him breathe. You hear him decide.`,
              { speaker: 'Hollis', say: `...Come in anyway. Anhalter, one o'clock. We'll sort it out. Nothing to worry about.` },
              `*Who's Sokolov?* you don't ask. The line clicks dead in your ear. You just found out who the Gardener is, and he just found out that you know.`,
            ],
            next: 'kotti',
          },
        ],
      },

      // =====================================================================
      kotti: {
        title: '12:31 AM — Kottbusser Tor',
        art: '🚇🧷',
        scene: 'station',
        mood: 'neon',
        text: [
          `The boy is leaning against a pillar under the platform clock, seventeen at most, with a green mohawk wilting in the sleet and a leather jacket held together by safety pins and attitude.`,
          { speaker: 'Jonas', say: `You're Wren? You look like shit. Respect.` },
          { speaker: 'Jonas', say: `Message from your Englishman: not here, the Anhalter ruin, one o'clock. And — okay, don't freak — a Russian bought me a beer tonight. Gold tooth, nice coat, smells like a department store. He wanted to know when you'd show. I took the beer. I didn't tell him nothing. Mostly nothing.` },
          { if: knowsGardener, text: `A Russian with a gold tooth, waiting for the courier, at a meeting the Gardener arranged. The shape of tonight finally comes into focus, and it is shaped like a grave.` },
          { if: 'called_voss', text: `Somewhere in this city, an American who sounded very awake is moving toward the Anhalter ruin. You hope.` },
          `A train screeches in under the iron roof. Jonas bounces on his heels, waiting for you to decide what kind of night this is going to be.`,
        ],
        choices: [
          {
            text: 'Send Jonas to the Americans at Clayallee',
            hint: 'A note, a running boy, and luck.',
            set: ['cavalry'],
            art: '✉️',
            outcome: [
              `You tear a page from your diary and write fast, block capitals, against the pillar.`,
              { if: knowsGardener, text: `*GARDENER IS HOLLIS. ANHALTER RUIN 0100. KGB PRESENT. COURIER WREN.*`, else: `*COURIER WREN IN DANGER. ANHALTER RUIN 0100. HANDLER COMPROMISED?*` },
              `"US Mission headquarters, Clayallee. Give it to the Marine at the gate and don't take no for an answer."`,
              { speaker: 'Jonas', say: `To the *Amis*? Me? Ha! They'll shoot me on sight. ...Okay. Okay. For you.` },
              `He's gone down the stairs three at a time, safety pins jingling. Twenty-five minutes across the city at this hour. You do the arithmetic and don't like it.`,
            ],
            next: 'meet',
          },
          {
            text: 'Bring Jonas as your lookout',
            hint: 'Two pairs of eyes in the ruins.',
            set: ['lookout'],
            effect: adj(0, -1),
            art: '👁️',
            outcome: [
              `"Come with me," you say. "Stay out of sight. If you see anyone who isn't the Englishman, whistle twice."`,
              { speaker: 'Jonas', say: `Like a spy? Like James Bond? Cool. Cool cool cool. Do I get a gun?` },
              `"No."`,
              { speaker: 'Jonas', say: `Not cool.` },
            ],
            next: 'meet',
          },
          {
            text: 'Skip the meeting. Go to ground.',
            hint: 'No handler, no Russian, no list. Just you.',
            art: '🕳️',
            outcome: [
              `"Forget the Englishman," you tell Jonas. "Is there somewhere a person could disappear for a few weeks?"`,
              { speaker: 'Jonas', say: `In Kreuzberg? Mate. That's the whole *point* of Kreuzberg.` },
              `He takes you down into the street, through a doorway covered in posters, up five flights of stairs into a squat full of candles, mattresses and people who have never once asked anyone's real name.`,
            ],
            next: 'end_ground',
          },
        ],
      },

      // =====================================================================
      meet: {
        title: '1:00 AM — The Anhalter Ruin',
        art: '🏛️🌹',
        scene: 'city-night',
        mood: 'fog',
        weather: 'snow',
        fx: 'heartbeat',
        text: [
          `All that's left of the Anhalter Bahnhof, once the greatest railway station in Europe, is a single brick arch standing alone in a wasteland of rubble and snow. A façade with nothing behind it. Like most things in this city.`,
          `Hollis is waiting under the arch in a camel-hair coat, a hothouse rose in his buttonhole, breath smoking. He spreads his arms like a favourite uncle.`,
          { speaker: 'Hollis', say: `Wren, old thing. You made it. I knew you would. Now — the film, there's a good chap, and you'll be on the morning flight to Northolt with a bonus and a very long holiday.` },
          `Behind him, in the shadows of the arch, something glints. A gold tooth, catching the light from a cigarette.`,
          { if: 'lookout', text: `From the rubble to your left: two short whistles. Two men. Jonas has seen them both.` },
          { if: 'proof', text: `He's smiling. But he knows that you know. He knew it the moment you said the film was gone.` },
          { if: 'peeked', text: `*WREN*, typed neatly on a list he sold. *KRANZ, Anneliese.* And the rose in his buttonhole, red as a stamp.` },
          { speaker: 'Sokolov', say: `Mister Hollis. It is cold. Please — conclude.` },
          `Hollis's hand stays out, palm up. The other one is in his coat pocket. It has been in his coat pocket the whole time.`,
        ],
        timer: 7,
        timeout: {
          text: 'You froze.',
          art: '🥶',
          outcome: [
            `You can't move. Hollis sighs, almost fondly, and steps in close, as if to embrace you.`,
            { speaker: 'Hollis', say: `Oh, Wren. I trained you, remember? I know exactly where you keep things.` },
            { if: 'heel', text: `He kneels in the snow, twists your left heel with two fingers, and the real film drops into his palm.`, else: `His fingers go straight to your inside pocket and come out with the real film.` },
            { if: 'peeked', text: `Then he looks up into your face, and his smile goes sad. "And you looked. Damn it. You looked."` },
          ],
          next: (s) => (s.has('peeked') ? 'end_dead' : 'end_courier'),
        },
        choices: [
          {
            text: 'Hand Hollis the film',
            hint: 'Do your job. Go home.',
            art: '🎞️',
            outcome: [
              { if: 'heel', text: `You kneel, twist your heel and take out the real film. You put it in his gloved palm.`, else: `You take the real film from your inside pocket and put it in his gloved palm.` },
              {
                if: 'peeked',
                text: `You try to keep your face still. You can't. Hollis looks at the film, then at you, and something in his eyes closes like a shutter. "You looked," he says softly. "You were always so bad at lying to me, Wren."`,
                else: `Hollis closes his hand around it and his whole body relaxes, as though he has put down something very heavy. "Good egg," he says. "Good, good egg."`,
              },
            ],
            next: (s) => (s.has('peeked') ? 'end_dead' : 'end_courier'),
          },
          {
            if: 'decoy',
            text: `Hand him Frau Kranz's holiday snaps`,
            hint: 'Pray he does not check it here.',
            art: '🏖️',
            outcome: [
              `You give him the second matchbox: same brand, same tired label, *Ostsee 1971* curled up inside. He weighs it in his palm.`,
              {
                if: masterPlan,
                text: [
                  `Then you turn to the gold tooth in the dark and speak past Hollis, loud and clear.`,
                  `"Comrade Sokolov. Before you pay him, ask your Mister Hollis why the Stasi have known his face since Tuesday. Ask him why Oberleutnant Voss has his name. Ask him what's really on that film. Then hold it up to your lighter."`,
                  `Sokolov steps out, takes the matchbox from Hollis's frozen fingers, and squints at *Ostsee 1971* in the flame. A woman with excellent legs, on a Baltic beach. Behind you, headlights crest the rubble — American ones — and Sokolov's gold tooth glints as he slowly, thoughtfully, begins to laugh.`,
                  { speaker: 'Sokolov', say: `Mister Hollis. I think you and I are going for a long drive.` },
                ],
                else: {
                  if: hot(4),
                  text: `Then Sokolov steps out from the arch with a jeweller's loupe already in his eye, takes the film from Hollis's fingers, and holds it up to his cigarette lighter. A long silence. "A woman," he says, "on a beach." He looks at you. He isn't smiling any more.`,
                  else: `"Splendid," Hollis says, and passes it backward into the dark without looking, to a gloved hand that takes it and vanishes. Nobody checks. Nobody ever checks, at one in the morning, in the snow.`,
                },
              },
            ],
            next: (s) => (masterPlan(s) ? 'end_bridge' : hot(4)(s) ? 'end_dead' : 'end_snaps'),
          },
          {
            if: knowsGardener,
            text: `Accuse him: "Hello, Gardener."`,
            hint: 'Say it out loud, where the dark can hear.',
            fx: 'flash',
            art: '🌹',
            outcome: [
              `"Hello, Gardener," you say. "How are the roses?"`,
              `Hollis's smile stays exactly where it is. Only his eyes change. The hand in his coat pocket begins to come out, slowly, with something heavy and black in it.`,
              {
                if: (s) => backup(s) && !hot(5)(s),
                text: `And then the wasteland lights up. Headlights, four sets, slewing over the rubble; car doors; American voices shouting *Freeze!* and *Hands where we can see them!*; a megaphone; Jonas whooping from somewhere in the dark. Sokolov raises his hands with a sigh, like a man whose bus has been cancelled.`,
                else: `You wait for help. For headlights. For anyone. The wasteland stays dark and silent, and the snow keeps falling, and Hollis says, quite kindly, "Oh, Wren. Who on earth did you think was coming?"`,
              },
            ],
            next: (s) => (backup(s) && !hot(5)(s) ? 'end_home' : 'end_dead'),
          },
          {
            text: 'Bolt into the ruins',
            hint: 'Rubble, snow, darkness. You know how to run.',
            fx: 'shake',
            art: '🏃',
            outcome: [
              `You turn and run, straight into the rubble field, over broken brick and twisted rail, into the dark.`,
              `Behind you, a shout in Russian. A shot that sounds like a book slammed shut.`,
              {
                if: (s) => hot(3)(s) && !s.has('lookout'),
                text: `Then a second figure rises out of the rubble directly ahead of you, exactly where you were running. They planned for this. Of course they did.`,
                else: { if: 'lookout', text: `A shape in a leather jacket grabs your sleeve and drags you down a hole in the ground you never would have seen. "This way, Bond," Jonas hisses. "I know every rat-hole in this city."`, else: `The shot goes wide into the snow. You keep running, and running, until the arch is only a dark shape behind you, and then nothing at all.` },
              },
            ],
            next: (s) => (hot(3)(s) && !s.has('lookout') ? 'end_dead' : 'end_ground'),
          },
        ],
      },

      // =====================================================================
      // ENDINGS
      // =====================================================================
      end_home: {
        art: '🌅🎞️',
        scene: 'dawn',
        mood: 'dawn',
        ending: { id: 'return-to-sender', title: 'Return to Sender', type: 'good' },
        text: [
          `Dawn comes up grey and pink over the Tempelhof runways as an American transport plane warms its engines. You are sitting on a crate in the hangar with a blanket over your shoulders and a mug of coffee that actually tastes of coffee.`,
          { if: 'heel', text: `The film is still in your heel. The cobbler in Hamburg is getting a Christmas card this year.`, else: `The film is in a lead-lined pouch on the lap of a very tired American, who has not let go of it once in four hours.` },
          `They took Hollis away in handcuffs at 1:09 AM, rose still in his buttonhole. He said nothing at all, except once, to you, as they put him in the car: "It was never personal, Wren. It was only ever the garden." Sokolov was released to his embassy by breakfast. Everyone pretends that is a victory.`,
          { if: 'cavalry', text: `Jonas made it to Clayallee in nineteen minutes on a stolen bicycle and argued with a Marine sergeant at the gate until the sergeant gave up and called his captain. They are giving him a medal nobody will ever be allowed to see. He has asked if it can be pinned on his jacket.` },
          { if: 'called_voss', text: `The calm American from the phone line turns out to be a balding man with a desk in Dahlem and a cardigan. He tells you that Lark crossed last night in the boot of a diplomatic car. Her brother drove her to the checkpoint himself.` },
          { if: 'kranz_taken', text: `Frau Kranz is still in Hohenschönhausen. The list on your film has her name on it, and now London knows it. They will buy her out. They are good at that, at least. You make them promise twice.`, else: `Frau Kranz is on the evening plane to London. She asked if there will be cabbage. There will not. She is disappointed.` },
          `Every name on that list will be pulled out of the East, or warned, or protected. Including the one that says *WREN*.`,
          `You did the one thing a courier is never supposed to do: you thought about what you were carrying. And it turns out that was the job all along.`,
        ],
      },

      end_courier: {
        art: '🌹🥀',
        scene: 'dawn',
        mood: 'storm',
        ending: { id: 'gardeners-courier', title: `The Gardener's Courier`, type: 'bad' },
        text: [
          `Hollis keeps his word. That's the cruel part. You're on the 7:40 to Northolt with an envelope of cash and a pat on the back and a reference letter that calls you "utterly reliable".`,
          `Three weeks later, in a London that smells of chestnuts and wet buses, you open a newspaper. Page nine. A short paragraph about a wave of "espionage arrests" in East Berlin. Thirty-one people. No names.`,
          `You don't need names. You carried them.`,
          { if: 'kranz_taken', text: `Frau Kranz was the first. You already knew that. You tell yourself it wasn't your fault. You're very good at telling yourself things now.`, else: `Frau Kranz was one of them. Seventy-four years old, taken from a flat that smelled of cabbage, while the Grundig was still warm.` },
          { if: 'asked_mila', text: `You think about a young woman named Mila, who told you her name so that someone would know it. Someone does. That someone handed her list to the man who sold it.` },
          `Hollis is promoted in the spring. Head of Berlin Station. In his new office, they say, he keeps a vase of red roses on the desk, all year round. Hothouse roses. They don't know it's winter.`,
          `You were the perfect courier. You never looked. You never asked. You never once wondered who you were delivering to, and that is exactly why he chose you.`,
        ],
      },

      end_dead: {
        art: '❄️🩸',
        scene: 'city-night',
        mood: 'blood',
        fx: 'redflash',
        ending: { id: 'snow-on-the-tracks', title: 'Snow on the Tracks', type: 'death' },
        text: [
          `The shot is very quiet. Hollis uses a silencer, of course. He would think anything else was vulgar.`,
          `You don't fall so much as sit down in the snow, suddenly, under the old brick arch where the trains used to come in from Dresden and Vienna and Rome. It is surprisingly warm. Everything is surprisingly warm.`,
          { if: 'peeked', text: `"You looked," Hollis says, kneeling beside you, genuinely sorry. "I told you, didn't I? Three rules. You only had to follow three."` },
          { if: 'decoy', text: `Somewhere above you, Sokolov is laughing at a woman in a swimsuit on a Baltic beach. You hope Frau Kranz would have found that funny. You think she would.` },
          { if: 'cavalry', text: `The American jeeps arrive four minutes later, headlights slewing over the rubble, Jonas standing in the back of the first one shouting your codename. Four minutes. Four minutes is a very long time in the snow.` },
          { if: 'lookout', text: `From the rubble, a boy with a green mohawk watches it all, his hand pressed over his own mouth. He will tell this story for the rest of his life, to anyone who will listen. Most of them won't believe him.` },
          { if: 'called_voss', text: `Your last thought, absurdly, is of a man in a green loden coat, and the phone number he wrote in pencil. You hope someone, somewhere, is still answering it.` },
          `They will find you in the morning, under the arch, with your face to the sky and a dusting of fresh snow on your eyelashes. The newspapers will say a tourist was robbed. Nobody will mention the roses.`,
        ],
      },

      end_caught: {
        art: '🚪🔒',
        scene: 'basement',
        mood: 'office',
        ending: { id: 'room-without-windows', title: 'Room Without Windows', type: 'bad' },
        text: [
          `Hohenschönhausen. The prisoners call the old cellars *the U-Boot*: the submarine. No windows. A light that never goes off. A stool, a bucket, and every night at three o'clock, a man with a soft voice who wants to talk about your childhood.`,
          { if: 'heel', text: `They found the film in your heel in about forty seconds. "Hamburg cobbler," the soft-voiced man says, almost admiringly. "We have his address too."` },
          { if: 'decoy', text: `They found Frau Kranz's holiday snaps as well. Somebody in the Ministry spent a whole day enlarging a woman in a swimsuit, frame by frame, looking for a code. That part almost makes you laugh. Almost.` },
          { if: 'kranz_taken', text: `Through the heating pipes, at night, someone taps out messages in a code you learned in training. The tapping is slow and steady and stubborn. *M-O-T-H. C-H-I-N U-P.*` },
          { if: 'voss_ally', text: `Once, only once, the door opens and Oberleutnant Voss looks in at you for a long moment. He says nothing. But the next morning there is a blanket on your stool that wasn't there before.` },
          `Eighteen months later, the West buys your freedom: forty thousand Deutschmarks, paid quietly through a church in Stuttgart, as part of a routine "prisoner release". The paperwork is signed in London by a man with a rose in his buttonhole. He meets your bus at the border, all smiles, and you realise as he takes your bag that he's the one who told them where to look.`,
        ],
      },

      end_snaps: {
        art: '🏖️🎞️',
        scene: 'void',
        mood: 'fog',
        ending: { id: 'holiday-snaps', title: 'Holiday Snaps', type: 'neutral' },
        text: [
          `Hollis shakes your hand, gives you a ticket for the morning flight, and walks off into the snow with a Russian at his elbow and a matchbox full of the Baltic coast in 1971.`,
          `Two days later, the West Berlin police pull a body out of the Landwehr Canal. Camel-hair coat. A rose in the buttonhole, frozen solid. The papers say he slipped on the ice. Moscow, it seems, does not appreciate holiday snaps.`,
          { if: 'heel', text: `The real film rides to London in your heel, through Tegel airport, past a customs man who compliments your shoes.`, else: `The real film rides to London sewn into the lining of your coat, past a customs man who never even looks up.` },
          { if: 'peeked', text: `You deliver it to a building on the river along with a single word: *Gardener*. They know what it means. They go very quiet, and then very busy.` , else: `You deliver it to a building on the river. Someone develops it, reads the cover sheet, and goes white. Nobody tells you why. Nobody needs to.` },
          { if: 'kranz_taken', text: `Frau Kranz comes home in a prisoner exchange in March. She sends you a postcard of a Baltic beach. On the back: *I hear I was in the newspapers. Excellent legs.*`, else: `Frau Kranz is extracted the following week. She sends you a postcard of a Baltic beach. On the back: *I hear I was a great success in Moscow.*` },
          `But somewhere in Moscow, a man with a gold tooth is looking at a photograph of your face, and wondering who, exactly, sold him a beach. The Office gives you a new name, a new passport and a flat in Leeds. You don't go back to Berlin. You can't. You never will.`,
        ],
      },

      end_ground: {
        art: '🕯️🧷',
        scene: 'apartment',
        mood: 'candle',
        ending: { id: 'gone-to-ground', title: 'Gone to Ground', type: 'neutral' },
        text: [
          `You stay in the squat on Mariannenstraße for six weeks. You dye your hair, learn to roll cigarettes, and play cards with people called Hexe and Bolle and Doktor Klaus, who is not a doctor.`,
          { if: (s) => s.has('lookout') || s.has('cavalry'), text: `Jonas brings you soup and newspapers and, once, a Walkman. He never asks what's on the film. You've started to love him a little for that.`, else: `Jonas brings you soup and newspapers and never asks what's on the film. You've started to love him a little for that.` },
          { if: 'peeked', text: `The film stays in your heel. One night you take it out and burn it in a candle flame, frame by frame — every name, *KRANZ*, *WREN*, *GÄRTNER* — because you can't give it to London without giving it to Hollis, and you can't give it to Hollis without giving him everyone.`, else: `One night you finally hold the film up to a candle flame. Names. Lists. *WREN.* And on the cover sheet, *GÄRTNER* — the gardener. You think of the rose catalogues, and you burn it, frame by frame, because you no longer know who in London you could possibly give it to.` },
          `Hollis goes on growing roses. The Office goes on believing in him. Somewhere in East Berlin, the people on the list go on living, for now, unaware that a list of them ever existed, or that it was burned in a Kreuzberg squat by someone who didn't know what else to do.`,
          `In spring you take a bus to Hamburg with a new name. Nobody follows you. That's what you tell yourself, every time a man in a green coat gets on.`,
        ],
      },

      end_bridge: {
        art: '🌉🌅',
        scene: 'bridge',
        mood: 'dawn',
        weather: 'snow',
        ending: { id: 'bridge-at-dawn', title: 'The Bridge at Dawn', type: 'secret' },
        text: [
          `Glienicke Bridge, nineteen days later. Steel girders painted green, a white line across the middle, and fog lifting off the Havel in the first light. Two groups of men in overcoats stand at either end, not quite looking at each other.`,
          `Here is what really happened in Berlin on the night of the twenty-first. A frightened clerk told you her name. A brother heard it. You looked at the thing you were told never to look at, cut a decoy out of an old woman's holiday, and called a number written in pencil instead of the man who trained you.`,
          `And then, under the Anhalter arch, you sold the Gardener to his own customer with a matchbox of Baltic sunshine.`,
          `The Russians didn't want Hollis after that. A spy who sells fake film is worth nothing to Moscow, and a British traitor is worth a great deal to London. So there was a phone call, and another one, and now there is a bridge.`,
          {
            if: 'kranz_taken',
            text: `The whistle blows. From the east end, three figures start walking: Hollis, grey-faced in a borrowed coat, with no rose; Frau Kranz, on a stick, smoking defiantly; and a young woman in a red scarf, walking very fast, as though the bridge might change its mind.`,
            else: `The whistle blows. From the east end, two figures start walking: Hollis, grey-faced in a borrowed coat, with no rose; and a young woman in a red scarf, walking very fast, as though the bridge might change its mind. Beside you, Frau Kranz, flown out the week before, lights a cigarette to watch.`,
          },
          { speaker: 'Mila', say: `You remembered my name.` },
          `Behind them, at the East end, a man in a green loden coat stands by a Wartburg and doesn't wave. He doesn't need to. He touches the brim of his hat once, the way you'd thank someone for holding a door, and gets back in his car.`,
          { if: 'heel', text: `The real film went to London in your heel nineteen days ago. Every name on it has been warned. Every name but one is still free. That one is walking toward you, in handcuffs, across a bridge.` , else: `The real film went to London nineteen days ago in a diplomatic bag. Every name on it has been warned. Every name but one is still free. That one is walking toward you, in handcuffs, across a bridge.` },
          { speaker: 'Frau Kranz', say: `Well. Somebody finally told the gardener.` },
          `You were never just the courier. You were the one who looked.`,
        ],
      },
    },
  });
})();
