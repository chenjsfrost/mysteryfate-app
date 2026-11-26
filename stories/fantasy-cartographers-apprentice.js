/*
 * MysteryFate story: The Cartographer's Apprentice (fantasy)
 * Meters: ink (what you have left to draw with; it is literally you) and consequence (how badly the world is
 *         strained by what you've drawn). Both clamp 0..5. Ink 0 -> end_faded. Consequence 5 -> end_white.
 * Drawn things (flags): flower, drew_door, drew_river, drew_wall, drew_bridge, drew_fog, drew_sea, drew_road,
 *                       kind_bryn, border, double
 * Other flags: clue, needle, saved_boy, limp, thane_deal, rook_freed, blot_palace, bryn, letter, saw_self,
 *              dragon_friend, chained, blue_door, forgave, lesson, thane_fled
 * Secret: needle + double + dragon_friend + consequence <= 2 at the last page.
 */
(function () {
  const clamp = (v) => Math.max(0, Math.min(5, v));
  const mod = (o) => (s) => { for (const k of Object.keys(o)) s.setVar(k, clamp(s.get(k) + o[k])); };
  const gate = (to) => (s) => (s.get('ink') <= 0 ? 'end_faded' : s.get('consequence') >= 5 ? 'end_white' : to);
  const secretReady = (s) =>
    s.has('needle') && s.has('double') && s.has('dragon_friend') && s.get('consequence') <= 2;

  const legacy = (s) => {
    const out = [];
    if (s.has('flower')) out.push('a yellow flower on a tower windowsill that will never wilt');
    if (s.has('drew_door')) out.push('a door where no door was ever built');
    if (s.has('drew_bridge')) out.push('a mossy bridge over the Long Canal');
    if (s.has('drew_fog')) out.push('a fog over Harrowmere that will never lift');
    if (s.has('drew_river')) out.push('a brown river running north through the middle of the city');
    if (s.has('drew_wall')) out.push('a granite wall that splits Harrowmere in two');
    if (s.has('drew_sea')) out.push('a narrow sea between two kingdoms');
    if (s.has('drew_road')) out.push('a road that climbs straight over the city wall');
    if (s.has('kind_bryn')) out.push("an old woman's new kitchen in Lowfen");
    if (s.has('border')) out.push('a black line at the edge of Lowfen that says *here it stays*');
    if (s.has('double')) out.push('a person, somewhere, wearing your face');
    return out;
  };
  const legacyLine = (prefix) => (s) => {
    const l = legacy(s);
    if (!l.length) return null;
    return prefix + (l.length === 1 ? l[0] : l.slice(0, -1).join('; ') + '; and ' + l[l.length - 1]) + '.';
  };

  registerStory({
    id: 'cartographers-apprentice',
    title: "The Cartographer's Apprentice",
    category: 'fantasy',
    tagline: 'Anything you draw on the map becomes real. Nothing can ever be erased.',
    description:
      "Your master has vanished into the white at the top of the world, leaving behind the Mappa Vera: a map where every line you draw becomes real. The Regent wants it. A village is disappearing. And every stroke of the pen costs more than ink.",
    cover: '🗺️',
    accent: '#8f7cff',
    ambient: 'fantasy',
    scene: 'library',
    warning: 'Contains: peril, floods, a vanished city, grief, death.',
    vars: { ink: 5, consequence: 0 },
    flags: [],
    hud: [
      { var: 'ink', label: 'Ink', icon: '🖋️', max: 5 },
      { var: 'consequence', label: 'Consequence', icon: '🌀', max: 5 },
    ],
    voices: {
      narrator: { gender: 'male', pitch: 0.9, rate: 0.95, accent: 'en-GB', note: 'measured, warm old-scholar storyteller' },
      'You': { gender: 'neutral', pitch: 1.05, rate: 1.05, note: 'the apprentice: young, quick, frightened but stubborn' },
      'Needle': { gender: 'neutral', pitch: 1.6, rate: 1.3, accent: 'en-GB', note: 'living compass rose: prim, fussy, talks too fast' },
      'Soldier': { gender: 'male', pitch: 0.85, rate: 1.2, accent: 'en-GB', note: 'shouting sergeant on the stairs' },
      'Casimir Thane': { gender: 'male', pitch: 0.6, rate: 0.82, accent: 'en-GB', note: 'Lord Regent: silky, cold, patient, menacing' },
      'Captain Rook': { gender: 'female', pitch: 0.8, rate: 1.0, accent: 'en-AU', note: 'scarred soldier: dry, gruff, few words' },
      'Bryn': { gender: 'female', pitch: 1.2, rate: 1.15, accent: 'en-IE', note: "miller's daughter: quick, fierce, floury" },
      'Other You': { gender: 'neutral', pitch: 1.15, rate: 1.35, note: 'your freshly-drawn double: breathless, terrified' },
      'Margrave': { gender: 'male', pitch: 0.35, rate: 0.72, accent: 'en-GB', note: 'cathedral-sized sea dragon: deep, slow, wounded dignity' },
      'Master Vell': { gender: 'male', pitch: 0.75, rate: 0.8, accent: 'en-GB', note: 'old cartographer: frail, gentle, full of guilt' },
    },
    start: 'intro',
    scenes: {
      // ───────────────────────────── ACT ONE: THE INKHOUSE ─────────────────────────────
      intro: {
        title: 'Midnight — The Inkhouse, Harrowmere',
        scene: 'library',
        art: '🗺️🕯️',
        mood: 'candle',
        text: [
          "The candle has burned down to a puddle, and Master Vell has not come home.",
          "His chair is pushed back. His spectacles lie abandoned on the blotter. And spread across the great oak table, weighted at the corners with four brass frogs, is the Mappa Vera — the True Map. Forty years of his life in black ink on vellum the size of a bedsheet.",
          "Everyone in Harrowmere knows the rule, though most think it's a nursery story: *whatever is drawn on the Vell map becomes real, and nothing drawn can ever be erased.*",
          "A note is pinned under the inkwell in his cramped, careful hand: *Gone north. Draw nothing. Erase nothing. The ink is dearer than you know. — O.V.*",
          "One line on the map is still wet. It starts at this very tower, runs north out of the city, past Lowfen, past the forest, and stops at the edge of the white — the great blank space at the top of the map where, for as long as you've been alive, nothing has ever been drawn.",
          "Down in the street: horses. A lot of horses. Stopping.",
        ],
        choices: [
          {
            text: 'Test it. Draw one small flower.',
            hint: 'Just to know. Just once.',
            set: ['flower'],
            effect: mod({ ink: -1 }),
            art: '🌼',
            outcome: [
              "You dip the master's pen. Your hand is shaking, so you make it small: a five-petalled flower on the windowsill of the tower, the way he taught you to draw the sign for a garden.",
              "The ink drinks into the vellum — and on the real windowsill, in the real moonlight, a flower unfolds out of nothing. Pale yellow. Smelling of rain. A bee, from somewhere, is already bumping against it.",
              "You feel something go, too: a small cold tug behind your breastbone, like a thread pulled out of a sleeve. You decide not to think about that.",
            ],
            next: 'knock',
          },
          {
            text: "Trace the master's unfinished line",
            hint: 'Where did he go?',
            set: ['clue'],
            art: '✍️',
            outcome: [
              "You follow the wet line with a fingertip, not quite touching. North Gate. Lowfen. The Outline Wood. The sea-dragon in the corner that the master always called *a bad joke by a young man*. And then the white.",
              "But the line doesn't stop at the white. Lean close with the candle and you can see it carries on — a hair of ink, impossibly faint — straight across the blank to the very edge of the vellum. And then it goes *off the edge*, onto the oak of the table, where it ends in a small, neat arrow pointing at nothing.",
              "*Further than the map,* you think. You don't know why that frightens you more than anything else tonight.",
            ],
            next: 'knock',
          },
          {
            text: 'Breathe on the compass rose',
            hint: 'He always said it was "only resting".',
            set: ['needle'],
            art: '🧭',
            outcome: [
              "The compass rose in the map's corner is the loveliest thing on it: thirty-two gilded points and a tiny pointing hand at the top. Every morning the master breathed on it, like a man warming a bird in his palms.",
              "You breathe on it. It sits up.",
              "It peels itself off the vellum with the sound of a page being turned and stands on the table on its north point, spinning gently, shedding gold flakes.",
              { speaker: 'Needle', say: "At LAST. Eight hours I've been shouting. He went north, obviously — I always know where north is, it's my entire personality. Also, there are soldiers on the stairs." },
            ],
            next: 'knock',
          },
        ],
      },

      knock: {
        title: 'The Door Below',
        scene: 'library',
        art: '🚪💥',
        mood: 'night',
        fx: 'shake',
        text: [
          "The street door gives with a crack like a breaking bone. Boots on the stairs — four flights, and they're taking them two at a time.",
          { speaker: 'Soldier', say: "By order of the Lord Regent! The Vell map is property of the Crown! Bring it — and the apprentice!" },
          { if: 'needle', text: "Needle spins in frantic circles on the tabletop. *The window's painted shut, the stairs are full of soldiers, and you're holding the only pen in the world that can fix that. Hint. Hint.*" },
          { if: 'flower', text: "On the windowsill, your yellow flower nods in the draught. It's real. Which means everything else you could draw would be real, too." },
          "The map is right there. The pen is in your hand. Three flights. Two.",
        ],
        timer: 8,
        timeout: {
          text: 'You froze.',
          art: '🫥',
          outcome: [
            "You stand with the pen raised over the map like a knife, and you can't make your hand move. Anything you draw is forever. *Anything.*",
            "The door comes off its hinges. Six soldiers, a sergeant with a tin whistle, a gauntlet clamped on your wrist. They roll the map up very carefully, as if it might bite, and march you down the stairs and through the sleeping city to the palace.",
          ],
          next: 'regent_hall',
        },
        choices: [
          {
            text: "Draw a door in the tower's back wall",
            set: ['drew_door'],
            effect: mod({ ink: -1 }),
            art: '🚪',
            scene: 'rooftop',
            outcome: [
              "You find the tower on the map — a tiny square on Vellum Street — and you draw a door in its north wall: a neat little arch, the way the master draws city gates.",
              "Behind you, the plaster splits. Brick folds aside like a curtain. There's a door there now, oak and iron-banded, that has never existed in the tower's three hundred years, and it opens onto cold air and moonlit roof-tiles.",
              "You roll the map, snatch pen and inkwell, and go through. The cold tug behind your ribs again. Stronger this time.",
            ],
            next: 'rooftops',
          },
          {
            text: 'Draw a river across the street below',
            hint: "Water stops horses. Doesn't it?",
            set: ['drew_river'],
            effect: mod({ ink: -1, consequence: 2 }),
            fx: 'shake',
            art: '🌊',
            scene: 'village',
            outcome: [
              "No time to be neat. You slash a line of blue-black across Vellum Street, between the tower and the horses, and write *river* beside it because you don't know how else to make it mean water.",
              "The cobbles burst. Water roars up through the road — not a puddle, not a flood, a *river*, wide and brown and furious, carving itself a bed northward through the city and carrying horses, barrels and a fruit-cart with it. The soldiers on the stairs turn and run back down to look.",
              "You're already out of the side window and halfway down the ivy. Behind you, you hear something you'll hear again in your dreams: a child, shouting, very close to the water.",
            ],
            next: 'flood_street',
          },
          {
            text: 'Hide the map and bluff',
            art: '🎭',
            outcome: [
              "You roll the Mappa Vera tight and shove it down the back of your shirt, then sit at the master's desk with your hands folded like a very good apprentice.",
              "The door bursts. Six soldiers, a sergeant, a great deal of shouting. You tell them the master took the map with him. You almost believe it yourself.",
              "Then the sergeant claps you on the back — hard — and the vellum crackles.",
            ],
            next: 'regent_hall',
          },
        ],
      },

      rooftops: {
        title: 'The Roofs of Harrowmere',
        scene: 'rooftop',
        art: '🌙🏘️',
        mood: 'night',
        weather: 'stars',
        text: [
          "Harrowmere sleeps beneath you: a thousand slate roofs, a thousand chimneys, the canals shining like spilled mercury. Behind you, the soldiers have found your door. Somebody swears at it, as if it has personally offended him.",
          { if: 'needle', text: "Needle rides on your shoulder, clinging to your collar with three of its points. *North-north-west, then north. Do NOT fall off anything.*" },
          "Your way north ends at the edge of Tanner's Row. Beyond it: the Long Canal, twenty feet of black water and nothing to cross it with.",
          "A crossbow bolt skips off the slates beside your hand and goes spinning into the dark.",
        ],
        choices: [
          {
            text: 'Draw a bridge across the canal',
            set: ['drew_bridge'],
            effect: mod({ ink: -1 }),
            art: '🌉',
            scene: 'bridge',
            outcome: [
              "You kneel on the tiles, flatten a corner of the map against your knee, and draw a footbridge across the Long Canal: two neat parallel lines and the little hatching that means *stone*.",
              "It's there before the ink is dry. A humpbacked stone bridge, mossy, *old*, as if it has stood a hundred years — with a date carved into its keystone that is today's. You run across it. The soldiers don't follow. They stand at its foot, staring, and one of them takes off his helmet.",
              "Tomorrow there'll be fishermen on that bridge. In a year, lovers. You made a place where people will meet. It's a strange thing to know at midnight.",
            ],
            next: 'north_gate',
          },
          {
            text: 'Jump it',
            hint: 'Save the ink. Trust your legs.',
            set: ['limp'],
            art: '🦘',
            outcome: [
              "You don't draw. You run three steps down the slope of the last roof and *throw* yourself into the air.",
              "For one long moment there's nothing under you but black water. Then the far gutter slams into your ribs, and you claw and kick and haul yourself up, and land on your left foot wrong. Something in the ankle goes *pop*.",
              "No ink spent. You'll be limping for days, and your ankle will remind you of that bargain with every step.",
            ],
            next: 'north_gate',
          },
          {
            text: 'Draw fog over the whole city',
            hint: "They can't shoot what they can't see.",
            set: ['drew_fog'],
            effect: mod({ ink: -1, consequence: 1 }),
            art: '🌫️',
            outcome: [
              "Every good map has its weather marks. You draw the master's sign for fog — three wavering lines — right across Harrowmere, big and careless.",
              "It rises off the canals like milk boiling over. In a breath you can't see your own hand. You hear soldiers bumping into chimneys, swearing, losing each other. You feel your way north, roof by roof, and nobody can follow.",
              "It's only later, at the north gate, that you look back and realize the fog isn't lifting. You drew it. On the map, it's forever. Harrowmere will never see a clear sky again.",
            ],
            next: 'north_gate',
          },
        ],
      },

      flood_street: {
        title: 'The River You Drew',
        scene: 'village',
        art: '🌊👦',
        mood: 'storm',
        weather: 'rain',
        fx: 'heartbeat',
        text: [
          "You drop from the ivy into knee-deep water, and the river you drew takes your legs out from under you.",
          "It's everywhere. It has found the cellars and the bakery and the chapel steps. Market stalls spin past like toys. And clinging to a broken shop-sign twenty yards downstream is a boy — six, maybe — his mouth wide open, no sound coming out.",
          "The sign is cracking. The map is in your arms, the pen is in your fist, and the soldiers are wading toward you through your flood.",
        ],
        timer: 7,
        timeout: {
          text: 'You hesitated.',
          art: '😰',
          set: ['saved_boy'],
          effect: mod({ consequence: 1 }),
          outcome: [
            "You hesitate one heartbeat too long, and the sign snaps. The boy goes under.",
            "Then a soldier — one of the ones chasing *you* — throws down his spear and dives in after him, and comes up spluttering with the boy hooked under one arm. Every eye on the street is on them. Nobody is looking at you.",
            "You slip away north while a stranger fixes your mistake. You are grateful. You are ashamed. It turns out you can be both at once.",
          ],
          next: 'north_gate',
        },
        choices: [
          {
            text: 'Draw a boat beneath him',
            set: ['saved_boy'],
            effect: mod({ ink: -1 }),
            art: '🛶',
            outcome: [
              "You flatten the map against a floating door and draw, as fast and small as you can, a rowboat right where the sign is — the little boat-shape the master uses for ferries.",
              "It's there with a slap of water: a red-painted rowboat, oars shipped, bobbing exactly beneath the boy. The sign breaks and he drops into it with a thump and sits up, soaked and astonished.",
              "The current whirls the boat away north up the new river. He stares at you the whole time, the way you'd stare at a god, and shouts the only thing he can think of: *I'm TAM!* Then he's gone around the bend.",
            ],
            next: 'north_gate',
          },
          {
            text: 'Draw a wall to hold the river back',
            set: ['drew_wall', 'saved_boy'],
            effect: mod({ ink: -1, consequence: 1 }),
            art: '🧱',
            outcome: [
              "You draw a thick black line straight across the river's course and hatch it hard: *wall*.",
              "Granite heaves up out of the water with a grinding roar and the flood slams into it and stops. The shop-sign stops shaking. The boy scrambles up onto the top of your new wall, gasping, alive.",
              "Then you see where the wall runs. You drew it long, in a hurry — and it doesn't end at the river. It goes right through the city, east to west, through gardens and alleys and a tannery, cutting Harrowmere neatly in half. Forever. Somewhere on the far side, a dog is barking at a wall that wasn't there a minute ago.",
            ],
            next: 'north_gate',
          },
          {
            text: 'Save the map. Run.',
            hint: "Someone else will reach him. Won't they?",
            effect: mod({ consequence: 1 }),
            art: '🏃',
            outcome: [
              "You hold the map over your head and wade for the north road.",
              "Behind you, there's a crack — the sign giving way — and a splash. You don't look back. You tell yourself someone will reach him. You tell yourself that all the way out of the city, and you do not once believe it.",
            ],
            next: 'north_gate',
          },
        ],
      },

      regent_hall: {
        title: '1 AM — The Regent’s Hall',
        scene: 'throne',
        art: '🦅👑',
        mood: 'castle',
        text: [
          "They say the Lord Regent Casimir Thane never sleeps. Seeing him, you believe it: a long grey man in a long grey coat, sitting not on the throne — that belongs to the boy-king, aged nine — but on the step beneath it, with the Mappa Vera unrolled across his knees.",
          { speaker: 'Casimir Thane', say: "The apprentice. Good. Your master refused me for forty years and has now run off into the snow. I'm told the map only answers whoever holds his pen. That would be you." },
          "He lays a long finger on the eastern border, on a country inked in careful detail. Ostmark.",
          { speaker: 'Casimir Thane', say: "Ostmark burned three of my border towns this year. One stroke of a blade on this vellum, and it simply never was. I'm not asking you to kill anyone. I'm asking you to *tidy*." },
          "Beside him stands a woman in a scarred leather coat with a crossbow on her back: Captain Rook, the Regent's knife. She is not watching the map. She is watching you.",
          "The map is an arm's length away. The master's inkwell sits on the step where the soldiers left it. Nobody thought to search a child's sleeve for a pen.",
        ],
        choices: [
          {
            text: 'Snatch the map, draw a window, jump',
            set: ['drew_door'],
            effect: mod({ ink: -1 }),
            fx: 'flash',
            art: '🪟',
            scene: 'rooftop',
            outcome: [
              "You lunge. The map tears out of Thane's grip, and before anyone moves you've drawn a window in the palace's west wall — one quick rectangle, crossed through the middle.",
              "Glass and moonlight burst into the hall where solid stone was. You dive through it and land rolling on the leads of the palace roof, the map clutched to your chest.",
              { speaker: 'Casimir Thane', say: "Rook. Not the crossbow. I want it *intact*." },
            ],
            next: 'rooftops',
          },
          {
            text: 'Hear his bargain',
            hint: "Learn what he knows. Buy time.",
            art: '🤝',
            outcome: [
              { speaker: 'You', say: "What are you offering?" },
              "Thane smiles as if you have passed a test. He stands, rolls the map with great care, and tucks it under his arm.",
              { speaker: 'Casimir Thane', say: "Walk with me." },
            ],
            next: 'war_room',
          },
          {
            text: 'Tip the inkwell over the palace',
            hint: 'Ink on the map is real. Spilled ink too?',
            set: ['blot_palace'],
            effect: mod({ ink: -1, consequence: 2 }),
            fx: 'shake',
            art: '⚫',
            outcome: [
              "You kick the inkwell. It tumbles off the step and splashes across the map in Thane's lap — right over the little drawing of the palace.",
              "The hall *fills*. Black, cold, glossy ink pours from nowhere, from everywhere, waist-deep in a heartbeat, swallowing the throne steps and the tapestries and the Regent's grey coat. Thane goes under, coughing. Rook is shouting. The soldiers are swimming.",
              "You grab the floating map, wade for a servants' door, and run. Behind you, the palace of Harrowmere now has a permanent black lake in its throne room. You feel strangely thin, as if some of that ink was yours.",
            ],
            next: 'north_gate',
          },
        ],
      },

      war_room: {
        title: 'The Map Room',
        scene: 'castle',
        art: '🗺️📌',
        mood: 'candle',
        text: [
          "Thane leads you down a corridor of portraits — every Regent of Harrowmere for two hundred years, all with the same grey eyes — into a round room papered with maps of Ostmark, every one stuck through with pins.",
          { speaker: 'Casimir Thane', say: "Here is my bargain. Your master has gone north into the white. Fetch him, or fetch what he knows. Come back and remove Ostmark for me, and you'll be Royal Cartographer. A house. A pension. Clean hands." },
          { speaker: 'Casimir Thane', say: "Refuse, and I'll take a razor to Vellum Street myself and see what happens to a tower, and an apprentice, when the map forgets them." },
          { speaker: 'Captain Rook', say: "He means it. He always means it." },
          "He unrolls the map on the table between you, and sets the pen beside it, and waits.",
        ],
        choices: [
          {
            text: 'Accept. Go north with Rook.',
            set: ['thane_deal'],
            art: '📜',
            outcome: [
              { speaker: 'You', say: "I'll bring him back." },
              "Thane signs a writ with a flourish and hands it — and the rolled map — to Captain Rook rather than you.",
              { speaker: 'Casimir Thane', say: "Rook will carry this, and you, and see that everyone comes home. Won't you, Captain?" },
              { speaker: 'Captain Rook', say: "Sir." },
              "Out in the stable yard, she gives the map back to you without a word. You can't tell if that's trust, or a test, or just that she doesn't want to touch it.",
            ],
            next: 'north_gate',
          },
          {
            text: 'Draw a sea between the kingdoms instead',
            hint: "Not erasing Ostmark. Separating it.",
            set: ['drew_sea', 'thane_deal'],
            effect: mod({ ink: -1, consequence: 2 }),
            fx: 'shake',
            art: '🌊',
            outcome: [
              "Before anyone can stop you, you draw a long wavering line all the way down the eastern border — and between it and the border, in the master's careful lettering, you write *the Narrow Sea*.",
              "The floor shudders. Far away, through the walls, you hear something like the world clearing its throat. Pins fall out of every map in the room. Thane goes to the window and stares east, where the horizon is suddenly, impossibly, *glittering*.",
              { speaker: 'Casimir Thane', say: "...Well. That's one way to end a war. You're wasted on cartography, child. Go north. Rook goes with you. Bring me your master." },
            ],
            next: 'north_gate',
          },
          {
            text: 'Refuse to his face',
            set: ['rook_freed'],
            art: '✋',
            outcome: [
              { speaker: 'You', say: "No. Not Ostmark. Not anyone." },
              "Thane sighs like a man disappointed by the weather. *Cells,* he says, and Captain Rook takes your arm — and the map — and marches you down three flights of stairs.",
              "At the bottom, she stops. Looks both ways. Pushes the map back into your hands and the cell key into the lock of a side door that opens onto the street.",
              { speaker: 'Captain Rook', say: "Your master drew a well on my mother's farm in the drought year. Didn't charge her. North gate's that way. I'll be looking for you in an hour, and I'll be very bad at it." },
            ],
            next: 'north_gate',
          },
        ],
      },

      // ───────────────────────────── ACT TWO: THE ROAD NORTH ─────────────────────────────
      north_gate: {
        title: '2 AM — The North Gate',
        scene: 'checkpoint',
        art: '🏰🔦',
        mood: 'night',
        weather: 'snow',
        text: [
          (s) => (s.has('thane_deal')
            ? "Rook rides beside you on a grey mare, the Regent's writ in her glove. The North Gate looms ahead, portcullis down, lanterns blazing on the wall."
            : "The North Gate of Harrowmere is shut, barred and lit up like a stage. Word has outrun you. There are guards on the wall, lanterns on poles, and the portcullis is down."),
          { if: 'drew_fog', text: "Your fog has followed you here, thick and white around every lantern. The guards are squinting into it." },
          { if: 'drew_river', text: "Your river runs beside the north road now, cutting a raw new channel under the city wall and away into the dark. Northward. Toward Lowfen." },
          { if: 'drew_wall', text: "Behind you, across the whole width of the city, your wall stands black against the sky. People are climbing onto their roofs to look at it." },
          { if: 'blot_palace', text: "Over the palace, every bell is ringing for the ink-flood." },
          { if: 'drew_sea', text: "Far to the east, the ground is still trembling where a whole sea is settling into its new bed." },
          { if: 'needle', text: "*North,* says Needle, pointing through the portcullis with great dignity. *Just in case anyone was wondering.*" },
          "The pen is warm in your fingers. Behind you, the city. Ahead, the road, and somewhere at the end of it, your master.",
        ],
        choices: [
          {
            text: "Ride out under the Regent's writ",
            if: 'thane_deal',
            art: '📜',
            outcome: [
              "Rook holds up the writ. The portcullis groans up. The guards salute her and stare at you.",
              { speaker: 'Captain Rook', say: "Don't mistake this for friendship, apprentice. I'm a leash. A polite one." },
              "You ride out under the arch, and the city closes behind you like a book.",
            ],
            next: 'lowfen',
          },
          {
            text: 'Draw a road up and over the wall',
            set: ['drew_road'],
            effect: mod({ ink: -1 }),
            art: '🛤️',
            outcome: [
              "You find the north wall on the map and draw a road that simply climbs it — a ramp of cobbles up one side and down the other, as if walls were hills.",
              "Stone shifts and settles under the snow. A road is there, steep and solid, with a milestone at the top that reads *Lowfen — 9 miles*. You walk over the wall of Harrowmere while the guards on the gate are still looking the wrong way.",
              "Every smuggler in the city is going to love you. So, you realize later, will anyone who wants to follow you.",
            ],
            next: 'lowfen',
          },
          {
            text: 'Hide in a dung-cart heading north',
            hint: 'No ink. A great deal of smell.',
            art: '🐄',
            outcome: [
              "There's a farm cart waiting at the gate for the dawn opening, piled with what the city's stables produce. You burrow in. You do not breathe through your nose.",
              "The portcullis lifts at first light. The guards wave the cart through without looking, because nobody looks closely at a dung-cart. That is, you will reflect later, the entire secret of its success.",
            ],
            next: 'lowfen',
          },
        ],
      },

      lowfen: {
        title: 'Dawn — Lowfen',
        scene: 'village',
        art: '🏘️⬜',
        mood: 'dawn',
        text: [
          "Lowfen is mills and mud and geese, nine miles north of the city. You've run errands here for the master a dozen times. You've never seen it like this.",
          "The north end of the village is *gone*. Not burned. Not flooded. Gone. The lane simply stops in a clean white edge, like the margin of a page, and beyond it is nothing: no colour, no shadow, no sound. The Blank. It's come forty miles south since spring.",
          { if: 'drew_river', text: "And through the middle of the village runs your river, brown and new, its banks still raw. It took the bakery's back wall. It took the miller's footbridge." },
          "Half a cottage sits right on the edge of the white — the front half. The back half isn't ruined. It just *isn't*.",
          "A girl your age stands in its doorway with a broom, as if sweeping might help. Flour on her apron. Fury on her face.",
          { speaker: 'Bryn', say: "You're the Cartographer's apprentice. He came through two nights ago. Said he'd *fix it*. That was my gran's kitchen. She's at ours now, crying into her teapot." },
          (s) => (s.has('saved_boy')
            ? "She looks at your ink-black fingers and something changes in her face. *My little brother Tam was in the city last night,* she says. *He came home at dawn babbling about a kid with a pen who saved his life.*"
            : s.has('drew_river')
              ? "Her voice cracks. *My little brother Tam was selling eggs in the city last night. There was a flood, they're saying. Nobody's seen him.* She looks at the river through her village, and then at your ink-black fingers, and you watch her work it out."
              : null),
        ],
        choices: [
          {
            text: "Draw her gran a new kitchen",
            set: ['kind_bryn'],
            effect: mod({ ink: -1 }),
            art: '🏠',
            outcome: [
              "You can't draw onto the white — the ink just beads and rolls off it, like water off wax. So you turn the cottage round: you draw a kitchen onto its *front*, on good solid Lowfen ground, with a chimney and a window facing the sun.",
              "It's there when you look up. Whitewashed. A kettle already ticking on the hob. The smell of somebody else's breakfast.",
              "Bryn puts down her broom. She doesn't thank you. She just pushes a heel of bread into your hands and says, gruffly, *You look see-through. Eat.*",
            ],
            next: gate('wood'),
          },
          {
            text: 'Draw a border to hold the Blank back',
            hint: 'A line it cannot cross. You hope.',
            set: ['border'],
            effect: mod({ ink: -1, consequence: 1 }),
            art: '〰️',
            outcome: [
              "You draw one hard black line along the edge of the white, the whole width of the village, and beside it you write: *Here ends Lowfen, and here it stays.*",
              "The white stops. Shudders. Presses against the line like water against glass, bulging, testing. It holds.",
              { speaker: 'Bryn', say: "For good?" },
              "You don't answer, and she hears that you don't answer.",
            ],
            next: gate('wood'),
          },
          {
            text: 'Tell her the truth. Ask her help.',
            set: ['bryn'],
            art: '🤝',
            outcome: [
              { speaker: 'You', say: "I can't fix it. I don't even know how. But he does — and he's out there in it. Help me find him." },
              "Bryn looks at you for a long time. Then she looks at the white where her gran's kitchen used to be.",
              { speaker: 'Bryn', say: "Mill first. You're grey as a ghost, and he left something there for you. Told me to give it to his apprentice if they were stupid enough to follow." },
            ],
            next: 'mill',
          },
        ],
      },

      mill: {
        title: 'Morning — The Hollis Mill',
        scene: 'cottage',
        art: '⚙️🍞',
        mood: 'sunny',
        text: [
          "The mill is warm and loud and smells of flour and river. Bryn's mother sits you by the stove without asking a single question, which is the kindest thing anyone has done for you in years.",
          { if: 'saved_boy', text: "A small boy in a too-big jumper peers at you from behind the flour sacks. Tam. When you wave, he hides, then peers again, grinning." },
          "Bryn fetches a letter from behind a loose brick. Sealed in the master's green wax. *For the apprentice. Who should not be reading this.*",
          "You cut your thumb on the bread knife reaching for it. Bryn hands you a cloth — and then goes very still, looking at the cloth, and not at you.",
          "The blood on it isn't red. It's black. Glossy. It smells of oak-gall and iron, exactly like the master's ink.",
        ],
        choices: [
          {
            text: "Open the master's letter",
            set: ['letter'],
            art: '✉️',
            outcome: [
              "*If you are reading this, you drew. I told you not to. I should have told you why.*",
              "*There was a city called Oldmere where the white is now. When I was young, a plague came out of it, and I was frightened, and I scraped Oldmere off the map in a single night to keep the sickness from the south. I did not know my wife and my little girl had gone there to visit her mother.*",
              "*You cannot erase. You can only make holes. That hole has been growing for forty years, and I am going into it to try to fill it. Do not follow. Do not let the Regent have the map. And do not spend yourself on my mistakes — you cannot afford it, and I could not bear it.*",
              "*Spend yourself.* You read that line four times. Then you look at your black thumb.",
            ],
            next: gate('wood'),
          },
          {
            text: 'Eat. Sleep one hour.',
            effect: mod({ ink: 1 }),
            art: '😴',
            outcome: [
              "You mean to read it. You fall asleep instead, face down in a sack of flour, with the letter still sealed in your fist.",
              "When Bryn shakes you awake an hour later you feel *heavier*, more solid, like a drawing that someone has gone over twice.",
              { speaker: 'Bryn', say: "You were see-through when you came in. Round the edges. Now you're not." },
              "She says it like a joke. Neither of you laughs. You put the letter in your coat, unread, and don't take it out again.",
            ],
            next: gate('wood'),
          },
        ],
      },

      wood: {
        title: 'Noon — The Outline Wood',
        scene: 'forest',
        art: '🌲✏️🐕',
        mood: 'forest',
        fx: 'heartbeat',
        text: [
          "North of Lowfen, the master's map gets lazy. The Outline Wood is a forest he drew as a student and never finished: every tree is there, every branch and twig — but only as *lines*. Black outlines on white. No bark, no green, no shadow. Walking through it is like walking through a page of someone's sketchbook.",
          { if: 'needle', text: "*He did this one at sixteen,* Needle sniffs. *Look — he signed that oak.* He has, in a tiny, cocky hand." },
          { if: 'bryn', text: "Bryn walks close behind you, touching nothing. *It's like the trees are holding their breath,* she whispers." },
          "Then: hounds. The Regent's hounds, baying, crashing through the outline-brush behind you, horsemen behind them.",
          (s) => (s.has('thane_deal')
            ? "Rook reins in beside you, her face hard. *Those aren't mine. He sent a second leash. Insurance.* She unslings her crossbow — and doesn't seem sure which way to point it."
            : "The first hound breaks cover forty yards back, all teeth, and it has your scent."),
          "The map is in your hands. *Draw something.*",
        ],
        timer: 8,
        timeout: {
          text: 'You panicked.',
          art: '🌿',
          effect: mod({ ink: -1, consequence: 1 }),
          outcome: [
            "You panic and scribble. You don't even know what — just a frantic black tangle on the map behind you.",
            "When you look back, there's a hedge of black thorn erupting through the Outline Wood: real thorn, dark and glossy and still *growing*, sprawling east and west faster than a horse can run. The hounds yelp and scatter.",
            "It saves you. It will also be growing, a yard a year, long after you're gone.",
          ],
          next: gate('camp'),
        },
        choices: [
          {
            text: 'Draw a ravine between you and them',
            effect: mod({ ink: -1, consequence: 1 }),
            fx: 'shake',
            art: '🏞️',
            outcome: [
              "One deep line behind you, hatched dark on both sides.",
              "The ground tears open with a sound like ripping canvas. A ravine yawns across the path, thirty feet wide, its outline walls dropping into black. The lead hound skids on the lip and scrambles back, howling. The riders pull up, swearing.",
              "You run on. Somewhere a shepherd will lose sheep in that ravine one day, and never know a child put it there in a hurry.",
            ],
            next: gate('camp'),
          },
          {
            text: 'Draw a second you, running the other way',
            hint: 'Give the hounds someone else to chase.',
            set: ['double'],
            effect: mod({ ink: -2 }),
            art: '👥',
            outcome: [
              "You don't know why you think of it. You just draw a little figure on the path — a person with a satchel, running east — the way the master draws travellers on his roads. And without meaning to, you draw it *exactly*.",
              "It's there. On the path. Your hair. Your coat. Your ink-stained fingers. It looks at you with your own eyes, and it's every bit as frightened as you are.",
              { speaker: 'Other You', say: "Wait — what am I — where did —" },
              "Then the hounds bay and it does what you would do. It runs, east, loud and crashing, and the whole hunt goes after it.",
              "It cost more than any line yet. Your hands look grey. And a thought arrives that you can't push away: *a whole person shouldn't cost so little ink. A whole person shouldn't cost* me.",
            ],
            next: gate('camp'),
          },
          {
            text: 'Climb an outline tree and keep still',
            art: '🌳',
            outcome: [
              (s) => (s.has('limp')
                ? "Your bad ankle screams with every branch. You climb anyway, teeth gritted, until you're wedged in a fork twenty feet up."
                : "You go up an outline oak like a squirrel and wedge yourself into a fork twenty feet up."),
              "The hunt pours through beneath you. One hound stops right below your tree, sniffs, and looks up — straight at you.",
              "But an outline tree has no leaves to hide you, and no smell either. Up here, you're just another line in a drawing. The hound sneezes, confused, and lopes away after the others.",
            ],
            next: gate('camp'),
          },
        ],
      },

      camp: {
        title: 'Night — The Foothills',
        scene: 'mountains',
        art: '🔥🌙',
        mood: 'night',
        weather: 'stars',
        text: [
          "You make camp where the Outline Wood ends and real colour begins again, under a crag the master drew with loving care: every ledge, every hawthorn, every sleeping crow.",
          (s) => {
            const who = [];
            if (s.has('needle')) who.push('Needle, spinning slowly on a flat stone like a dozing top');
            if (s.has('bryn')) who.push('Bryn, wrapped in her mother\'s shawl, pretending not to watch you');
            if (s.has('thane_deal')) who.push('Rook, sitting apart with her back to a boulder and her crossbow across her knees');
            return who.length ? 'Around the little fire: ' + who.join('; ') + '.' : 'You are alone. The stars are very far away.';
          },
          { if: 'double', text: "You keep thinking about the face on the path in the Outline Wood. *Your* face. Running east, somewhere out there in the dark, alone." },
          (s) => (s.has('letter')
            ? "*Do not spend yourself on my mistakes,* the master wrote. *You cannot afford it.*"
            : "You can't remember anything from before the Inkhouse. You were eight, the master says, a foundling with a fever. You always thought the fever took the memories."),
          (s) => (s.get('ink') <= 2
            ? "In the firelight your hands are see-through at the edges, like a drawing someone has started to rub out."
            : "Your fingers are stained to the second knuckle, the way they always have been. They have never once washed clean."),
        ],
        choices: [
          {
            text: 'Study the map by firelight',
            set: ['saw_self'],
            art: '🔍',
            outcome: [
              "You unroll the Mappa Vera and hold the master's lens over Harrowmere, over Vellum Street, over the tiny square of the tower.",
              "Inside it, so small you'd never see it without the glass, is a figure at a desk. A child, drawn in the master's hand. And beside it, in letters finer than an eyelash: *Apprentice. Drawn with love, the ninth of Thawmonth. Forgive me.*",
              "The ninth of Thawmonth, eight years ago, is the day you *arrived*. The day you think of as your birthday.",
              "You put the lens down very carefully. You sit by the fire for a long time, looking at your black-stained fingers, and you do not sleep.",
            ],
            next: 'coast',
          },
          {
            text: 'Ask Needle what it knows',
            if: 'needle',
            set: ['saw_self'],
            art: '🧭',
            outcome: [
              { speaker: 'You', say: "Needle. What am I?" },
              "The compass rose stops spinning. For once in its life, it does not point north. It points at you.",
              { speaker: 'Needle', say: "...He drew you. Eight years ago, on a night so cold the inkwell froze. I was there. I held the vellum flat with my west points while he did it. He cried the whole time — not sad crying. The other kind." },
              { speaker: 'Needle', say: "You're ink, dear. Very good ink. The best he ever made. Every line you draw comes out of you. I thought you knew. I thought he'd *told* you." },
            ],
            next: 'coast',
          },
          {
            text: "Don't think about it. Sleep.",
            effect: mod({ ink: 1 }),
            art: '😴',
            outcome: [
              "You lie down with your back to the fire and your black thumb tucked in your fist, and you decide very firmly not to think about anything at all.",
              "You dream of white. White fields, white streets, a white clock tower stopped at ten past four. A little girl at a window, waving at something enormous out at sea.",
              "You wake more solid than you went to sleep. Rest, it seems, puts something back.",
            ],
            next: 'coast',
          },
        ],
      },

      coast: {
        title: 'Day Two — Here Be Dragons',
        scene: 'sea',
        art: '🐉🌊',
        mood: 'sea',
        weather: 'rain',
        text: [
          "The road north runs along the Grey Coast. On the master's map, in the top-right corner, there's a sea-dragon: curled, scaled, grumpy, with a little scroll in its claw that says HERE BE DRAGONS. Every child in Harrowmere who has seen the map laughs at it.",
          "Nobody would laugh at it here. It is the size of a cathedral, and it is lying across the road.",
          { speaker: 'Margrave', say: "Ah. The Vell ink. I would know that smell anywhere. I was drawn in it, you know. By a boy of nineteen. In a *margin*. As a *joke*." },
          { speaker: 'Margrave', say: "Forty years I have lain in this corner being a joke. I watched him scrape away the city to the north of me. I watched the white come. I have had a great deal of time to think, small inky person, and I have decided that I would like someone to *listen*." },
          "The road runs under its chin. Beyond it, at the top of the world, the white glows like a wall of fog that isn't fog.",
          (s) => (s.get('consequence') >= 3 ? "Behind you, far off, you can feel the things you've drawn — tugging at the world's seams like stones in a pocket." : null),
        ],
        choices: [
          {
            text: 'Sit down and listen to it',
            hint: 'The white is creeping while you sit.',
            set: ['dragon_friend'],
            effect: mod({ consequence: 1 }),
            art: '👂',
            outcome: [
              "You sit down on a wet rock, cross-legged, and say: *Go on, then.*",
              "Margrave talks for an hour. About Oldmere — three hundred streets, a clock tower that played a tune at every quarter, a bakery famous for spiral buns, a house with a blue door where a little girl waved at the dragon every single morning. *Nobody else ever waved,* it says. *Not before. Not since.*",
              "It remembers every street. Every chimney. The white creeps a few yards closer while it talks, and you let it.",
              { speaker: 'Margrave', say: "Tell him I remember. Tell him *someone* does. Go on — under my chin. Mind the barnacles." },
            ],
            next: gate('crease'),
          },
          {
            text: 'Draw it a companion',
            set: ['dragon_friend'],
            effect: mod({ ink: -1, consequence: 1 }),
            art: '🐉🐉',
            outcome: [
              "You kneel on the shingle and draw, in the sea beside the old curled dragon, a second one: smaller, sleeker, with a curious tilt to its head.",
              "The water bulges and breaks. A green-gold dragon surfaces, blinking, shaking spray from its frills — and looks at Margrave — and Margrave, for the first time in forty years, has absolutely nothing to say.",
              "Then the two of them are coiling round each other in the surf like otters, and the old one is *laughing*, a sound like a landslide in a cathedral. It lowers its chin to let you pass, and calls after you a blessing in a language no one has spoken since Oldmere.",
              "The fishermen of the Grey Coast are going to have *opinions* about this.",
            ],
            next: gate('crease'),
          },
          {
            text: 'Draw chains across it',
            set: ['chained'],
            effect: mod({ ink: -1, consequence: 2 }),
            fx: 'redflash',
            art: '⛓️',
            outcome: [
              "You draw iron. Heavy links, looped over the curled body on the map and pinned to the sea-floor with the master's sign for an anchor.",
              "Chains erupt out of the surf with a shriek of metal and slam down across the dragon's back. It roars — a sound that flattens the waves for a mile — and strains, and cannot rise.",
              { speaker: 'Margrave', say: "Oh, you are his apprentice. *Truly.* Go on, then. Go and finish what he started." },
              "You walk under its chin. It doesn't try to stop you. That is somehow worse.",
            ],
            next: gate('crease'),
          },
          {
            text: 'Creep past while it talks',
            art: '🤫',
            outcome: [
              "You nod politely, and keep nodding, and edge sideways along the road while the dragon is still mid-sentence.",
              "You're almost past its tail when it stops talking. It doesn't turn its head. It just sighs, a long, gusty sigh that smells of kelp.",
              { speaker: 'Margrave', say: "Yes. Everyone always leaves." },
            ],
            next: gate('crease'),
          },
        ],
      },

      crease: {
        title: 'The Fold',
        scene: 'bridge',
        art: '📜🕳️',
        mood: 'ice',
        weather: 'snow',
        text: [
          "Just short of the white, the world has a crease in it.",
          "You've seen it on the map a thousand times without thinking: the line where the master folds the vellum to put it away. Here, it's a canyon — dead straight, a quarter-mile deep, its walls sheer and smooth as paper, running east and west to both horizons.",
          { if: 'drew_bridge', text: "You've drawn a bridge before. Your fingers already know the shape." },
          { if: 'limp', text: "Your ankle throbs just looking at the climb." },
          "The wind howls along the fold. On the far side: the last real hills. And beyond them, close now, the white.",
        ],
        choices: [
          {
            text: 'Draw a bridge',
            effect: mod({ ink: -1 }),
            art: '🌉',
            outcome: [
              (s) => (s.has('drew_bridge')
                ? "Easier the second time. Two parallel lines, the stone hatching. Your bridge over the Long Canal has a sister now, a long white span across the fold, plain and strong."
                : "Two parallel lines, the little hatching that means stone. It's harder than it looks — your hand shakes on the long span — but it holds. A white bridge arches across the fold."),
              "You walk across it with the wind tugging your coat. Halfway, you look down. The canyon floor is *blank*. Even the bottom of the fold is just vellum.",
            ],
            next: gate('edge'),
          },
          {
            text: 'Unfold the map flat',
            hint: 'Smooth the crease. Close the canyon.',
            effect: mod({ consequence: 2 }),
            fx: 'shake',
            art: '📜',
            outcome: [
              "You unroll the Mappa Vera completely, lay it on the frozen ground, and smooth the crease with the flat of your palm.",
              "The canyon *closes*. The ground lurches; the paper-smooth walls slam together with a roar like the end of the world, and the far hills are suddenly right in front of you. You walk across without a step of climbing.",
              "Far to the east and west, along every mile of that fold, villages wake to an earthquake. Nothing on this map is free. Not even smoothing it.",
            ],
            next: gate('edge'),
          },
          {
            text: 'Climb down and up the paper walls',
            hint: 'No ink. Just hands.',
            art: '🧗',
            outcome: [
              (s) => (s.has('limp')
                ? "It takes the whole afternoon. Your ankle gives out twice. Once you hang by your fingertips over a hundred feet of nothing and think, very clearly, that you are going to die for the sake of not drawing a line."
                : "It takes the whole afternoon. The walls are smooth as a page and you have to find the tiny nicks and wrinkles in them, the places where the vellum was once scratched."),
              "You make it. No ink spent. Your fingers are bleeding black onto the white rock by the end — which, you're beginning to understand, may be exactly the same thing.",
            ],
            next: gate('edge'),
          },
        ],
      },

      // ───────────────────────────── ACT THREE: THE WHITE ─────────────────────────────
      edge: {
        title: 'Dusk — The Edge of the Map',
        scene: 'mountains',
        art: '⬜🐎',
        mood: 'storm',
        weather: 'snow',
        fx: 'heartbeat',
        text: [
          "The last hill ends in a clean white line. Beyond it is the Blank: not snow, not fog, not light. *Nothing*. A silence so complete it presses on your ears.",
          "Far out in it — impossible to say how far — sits one small dark speck. Someone, sitting very still.",
          "Then: hooves behind you.",
          (s) => (s.has('drew_road')
            ? "The Lord Regent comes up the road you drew over the city wall — of course he does. You drew him a road straight to you."
            : "The Lord Regent has followed your trail. Every line you drew between here and Harrowmere was a signpost."),
          { speaker: 'Casimir Thane', say: "The map, apprentice. Look behind you. Everything you've touched, you've broken a little. Let a grown man decide what gets broken." },
          { if: 'blot_palace', text: "His grey coat is still stained black to the shoulder with your ink-flood." },
          "Two dozen riders fan out across the hill. Captain Rook is among them, crossbow raised. Thane dismounts and holds out his hand.",
        ],
        timer: 7,
        timeout: {
          text: 'You hesitated.',
          art: '💔',
          effect: mod({ consequence: 2 }),
          fx: 'glitch',
          outcome: [
            "You hesitate, and Thane's gauntlet closes on the map's corner. You pull. He pulls.",
            "The vellum *tears*: a strip the width of your thumb, along the eastern edge. Far to the east, a seam of white opens across the world like a scream — villages, fields, a river, gone into nothing between one breath and the next.",
            "Thane stares at the scrap in his fist in horror. You run into the white before he can look up.",
          ],
          next: gate('white_walk'),
        },
        choices: [
          {
            text: 'Give him the map',
            hint: "Maybe he's right. Look what you've done.",
            art: '🫴',
            outcome: [
              "You look back down the long road — at everything you drew, everything you broke a little — and you hold the map out.",
              "Thane takes it gently, like a father taking a knife from a child. He smiles. And from inside his grey coat, he takes out a barber's razor.",
              { speaker: 'Casimir Thane', say: "Thank you. Now — Ostmark." },
            ],
            next: 'end_regent',
          },
          {
            text: 'Draw a chasm between you and them',
            effect: mod({ ink: -1, consequence: 1 }),
            fx: 'shake',
            art: '⚡',
            outcome: [
              "One savage line across the hillside behind you.",
              "The earth splits. Horses rear and scream. Thane is thrown into the snow on the far side of a crack that drops straight into the dark — and you are on the near side, alone, at the edge of the white.",
              "You turn your back on them and step off the last hill of the world.",
            ],
            next: gate('white_walk'),
          },
          {
            text: 'Run into the white',
            hint: "Nobody follows you there. Nobody dares.",
            effect: (s) => { if (s.has('thane_deal') || s.has('rook_freed')) s.set('thane_fled'); else mod({ consequence: 1 })(s); },
            art: '🏃',
            scene: 'void',
            outcome: [
              "You don't draw. You run — straight off the edge of the map.",
              { if: 'thane_fled', text: "Behind you, a crossbow cracks — not at you. You glance back and see Captain Rook with her bow levelled at the Lord Regent's grey coat, and Thane's hand frozen in the air. *Forty years he's moved my family about like a pin on a map,* she calls after you. *I'm done being a pin. Go, apprentice!*" },
              "The white takes the sound of your footsteps first. Then the cold. Then your shadow; you look down and it's simply gone. Behind you, the voices on the hill shrink, as if they're shouting from the bottom of a well.",
              "None of them follow. None of them dare.",
            ],
            next: gate('white_walk'),
          },
          {
            text: 'Call Margrave',
            if: 'dragon_friend',
            set: ['thane_fled'],
            art: '🐉',
            outcome: [
              { speaker: 'You', say: "MARGRAVE!" },
              "It comes over the hill like weather: a cathedral of scales, sea-water streaming from its frills. Horses bolt in every direction. Thane's mount throws him into a snowdrift. Rook takes one look and lowers her crossbow with great deliberation.",
              { speaker: 'Margrave', say: "Go on, little inky one. I'll keep the Regent company. I am an *excellent* conversationalist. I've had forty years to practise." },
            ],
            next: 'white_walk',
          },
        ],
      },

      white_walk: {
        title: 'The Blank',
        scene: 'void',
        enter: { unset: ['thane_deal', 'rook_freed', 'blot_palace', 'limp'] },
        art: '⬜👣',
        mood: 'void',
        text: [
          "There's no ground in the Blank. You walk anyway; your feet make their own, one step at a time, a little island of you in all that nothing.",
          "There are ghosts here — not of people. Of *lines*. Faint grey impressions in the white, the way a page remembers what was written on the sheet above it. A street. A fountain. A clock tower, its hands stopped at ten past four.",
          "The scraped bones of Oldmere.",
          { if: 'letter', text: "*There was a city called Oldmere where the white is now.*" },
          { if: 'needle', text: "*North is still north, even here,* says Needle, in a very small voice. *Thank goodness for something.*" },
          "The speck ahead is a chair — a drawn chair, on a little island of ink — and in it, drawing by the light of nothing, sits an old man. He's fading. Half of him is only outline.",
        ],
        choices: [
          {
            text: 'Run to him',
            art: '🏃',
            outcome: [
              "You run. The white tugs at your heels like deep sand, and every step costs a breath you don't seem to have.",
              { speaker: 'You', say: "MASTER!" },
              "The old man's head comes up slowly, as if it's very heavy.",
            ],
            next: 'blank_master',
          },
          {
            text: 'Follow a ghost-street to a blue door',
            hint: 'One door here still has its colour.',
            art: '🚪',
            outcome: [
              "One door in the ghost-city isn't grey. It's blue — faint, faded, but *blue* — and the ghost of the house around it is a narrow one with a window facing the sea.",
              "On the inside of the window, so faint you have to breathe on the white to see it, is the print of a small hand. As if someone pressed their palm to the glass every morning to wave at something out on the water.",
              "You put your own hand over it. It's exactly the same size as yours was, the day you arrived. Then you go to the old man in the chair.",
            ],
            next: 'blank_master',
          },
          {
            text: "Follow the master's line past him, off the page",
            if: 'clue',
            hint: 'Where does the little arrow point?',
            art: '➡️',
            outcome: [
              "You remember the faint line on the map, and the little arrow on the oak of the table. *Further than the map.*",
              "The hair of ink runs right past the old man's chair and on, out across the white, toward the edge of everything. He calls after you. You keep walking.",
            ],
            next: 'end_hand',
          },
        ],
      },

      blank_master: {
        title: 'Master Orrin Vell',
        enter: { unset: ['letter'] },
        scene: 'void',
        art: '👴✒️',
        mood: 'void',
        text: [
          "He looks up, and his face does something terrible: joy, then horror, chasing each other across it.",
          { speaker: 'Master Vell', say: "No. No, no — you came. You *drew* to get here. How much? Show me your hands." },
          (s) => (s.get('ink') <= 2
            ? "You hold them out. They're grey to the wrist. You can see the white through them."
            : "You hold them out. Stained to the knuckle, the way they always are. He lets out a breath he seems to have been holding for two days."),
          { speaker: 'Master Vell', say: "Forty years ago I scraped a city off this map because I was frightened of a plague. My wife and daughter were inside. I didn't know. That's what the white is. You cannot erase. You can only make holes, and holes grow." },
          { if: 'saw_self', speaker: 'Master Vell', say: "And the rest — you've guessed it. I can see it on your face." },
          { if: '!saw_self', speaker: 'Master Vell', say: "And you. I should have told you years ago." },
          { speaker: 'Master Vell', say: "Eight years ago I was so lonely I thought it would kill me. So I drew an apprentice. I swore I would not draw *her* — I drew someone new. You. Every line you've spent since midnight was you. The ink is you." },
          "Around the chair, the little island of ink shrinks by a finger's width.",
        ],
        choices: [
          {
            text: 'Forgive him',
            set: ['forgave'],
            effect: mod({ ink: 1 }),
            art: '🤍',
            outcome: [
              "You put your arms around him. He's so light. He's mostly outline.",
              { speaker: 'You', say: "You made me. That's not a crime. That's the best thing anyone's ever done for me." },
              "He weeps into your shoulder, great silent heaves of it. And as he does, a little colour seeps back into your fingers, warm, like blood into a cold hand. Being loved, it seems, is also a kind of ink.",
            ],
            next: gate('last_page'),
          },
          {
            text: 'Rage at him',
            effect: mod({ consequence: 1 }),
            fx: 'shake',
            art: '💢',
            outcome: [
              { speaker: 'You', say: "You *drew* me? To keep you company? Like a — like a *dog*? And you let me think I was a foundling. You let me spend myself on bridges and *fog*!" },
              "He doesn't defend himself. He just nods, and keeps nodding, and takes every word.",
              { speaker: 'Master Vell', say: "Yes. All of it. I'm sorry." },
              "In the silence afterward, the white surges in around the chair, hungry, as if anger were something it could eat.",
            ],
            next: gate('last_page'),
          },
          {
            text: 'Ask how to fill the white',
            set: ['lesson'],
            art: '📏',
            outcome: [
              { speaker: 'You', say: "Later. You can be sorry later. How do we fix it?" },
              "Something like pride flickers in his tired face. He shows you: the pen can draw on the white, but only if you can *see* what you're drawing — every street, every stone, as clear as memory. Anything vaguer simply slides off.",
              { speaker: 'Master Vell', say: "That's why I'm stuck. I can't picture Oldmere any more. Forty years. I've tried every night. I can't even remember which door was ours." },
            ],
            next: gate('last_page'),
          },
        ],
      },

      last_page: {
        title: 'The Last Page',
        scene: 'void',
        enter: { unset: ['saw_self'] },
        art: '🖋️⬜',
        mood: 'void',
        fx: 'heartbeat',
        text: [
          "The island under the chair is the size of a tabletop now. The white laps at its edges like a tide coming in.",
          { speaker: 'Master Vell', say: "I haven't the ink left to get home. Perhaps neither have you. So: the pen is yours. Whatever you draw is forever. Choose like it." },
          { if: 'thane_fled', text: "Somewhere behind you, at the edge of the world, the Regent is not coming. Someone you trusted made sure of that." },
          (s) => (secretReady(s)
            ? "Then — wingbeats. Margrave lands at the edge of the island, huge and patient, its frills dripping. And walking out of the white behind it, wearing your face, your coat, your ink-stained fingers, comes the you that you drew in the Outline Wood. It ran east. Then it turned round and followed you all this way, because it's you, and you would have."
            : null),
          (s) => (s.get('ink') <= 1 ? "You can barely hold the pen. You can see it through your fingers." : null),
        ],
        choices: [
          {
            text: 'Draw him a road home',
            hint: 'Then close the map forever.',
            effect: mod({ ink: -1 }),
            art: '🛤️',
            outcome: [
              "You draw a road from the island back across the white: thin, careful, every inch of it. Over the fold. Through the Outline Wood. All the way to Lowfen.",
              "Then you draw one more line — not a wall, a *shore* — all the way round the edge of the Blank, with the gentle hatching the master uses for beaches. And beside it, in your best lettering: *Here the world ends, gently.*",
            ],
            next: (s) => (s.get('ink') <= 0 ? 'end_faded' : 'end_fair'),
          },
          {
            text: 'Take the pen and stay',
            hint: 'Draw the north back, one careful hill at a time.',
            art: '⛰️',
            outcome: [
              { speaker: 'You', say: "Go home, Master. I'll stay. I'll do it slowly. The way you taught me." },
              "You take the pen. It fits your hand better than it ever fitted his.",
            ],
            next: (s) => (s.get('ink') >= 2 ? 'end_true' : 'end_faded'),
          },
          {
            text: 'Scrape the white away',
            if: (s) => !secretReady(s),
            hint: 'Erase the erasure. How bad could it be?',
            fx: 'redflash',
            art: '🔪',
            outcome: [
              "The master's silver scraper is in his coat pocket. You take it before he can stop you.",
              { speaker: 'Master Vell', say: "No — child, *no* —" },
              "You lay the blade against the white on the vellum, where Oldmere used to be, and you scrape. Hard.",
            ],
            next: 'end_white',
          },
          {
            text: 'Draw Oldmere back — together',
            if: secretReady,
            hint: 'A dragon to remember. A compass to point. Two apprentices to draw.',
            art: '🏙️',
            outcome: [
              { speaker: 'You', say: "You can't picture it. But *it* can." },
              "Margrave lowers its great head to the island. Needle leaps onto the vellum and spins to true north. Your double kneels on the other side of the map and holds out its hand, and you put the master's spare pen in it.",
              { speaker: 'Margrave', say: "Begin at the harbour. The first street is called Tallow Lane. It curves left, like a smile." },
            ],
            next: 'end_secret',
          },
        ],
      },

      // ───────────────────────────── ENDINGS ─────────────────────────────
      end_faded: {
        scene: 'void',
        art: '🫥🖋️',
        mood: 'void',
        ending: { id: 'spent', title: 'Spent', type: 'death' },
        text: [
          "It doesn't hurt. That's the strangest part.",
          "The pen gets heavy, then far away. Your hand goes grey, then glassy, then it's just a line — a neat black outline of a hand, the way the master draws travellers on his roads — and then not even that.",
          "You were ink. You spent yourself one line at a time, and every line is still out there, real, forever.",
          legacyLine('This is what you leave behind: '),
          (s) => (s.has('saved_boy') ? "In Lowfen, a boy called Tam will grow up telling anyone who'll listen about the kid with the pen. Nobody will believe him. He won't care." : null),
          (s) => (s.has('bryn') || s.has('kind_bryn') ? "Bryn Hollis waits at the north end of Lowfen every evening for a year. Then, one evening, she stops waiting, and starts drawing." : null),
          "Whoever unrolls the Mappa Vera next will find, in the middle of the white, a small black blot shaped like someone kneeling. Scholars will call it a printer's error.",
          "Nothing on the map can ever be erased. Not even you. *Especially* not you.",
        ],
      },

      end_white: {
        scene: 'void',
        art: '⬜🌀',
        mood: 'void',
        fx: 'glitch',
        ending: { id: 'white-page', title: 'The White Page', type: 'bad' },
        text: [
          "It starts as a sound — the sound of a page being torn, but slow, and enormous, and coming from every direction at once.",
          (s) => (s.get('consequence') >= 5
            ? "You drew too much, too fast, too careless. Every line pulled at another, and the seams of the world, stretched past bearing, finally *give*."
            : "You can't erase an erasure. You can only make the hole bigger. The scraper bites through the white, and the white pours through the cut like water through a broken dam."),
          "The Blank comes south. Not an inch a year now — a mile a minute. The fold, the coast, the Outline Wood. Lowfen's mills. The north gate.",
          (s) => (s.has('drew_fog') ? "Your fog is the last thing in Harrowmere to go, which feels almost fair." : null),
          (s) => (s.has('chained') ? "Margrave's chains go white around it. Its roar goes white in the middle of a word." : s.has('dragon_friend') ? "On the Grey Coast, an old sea-dragon wraps itself around something it loves and closes its eyes." : null),
          (s) => (s.has('bryn') || s.has('kind_bryn') ? "Somewhere in Lowfen, Bryn is holding a broom in a doorway again, and this time there isn't even a doorway." : null),
          "Master Vell holds your hand at the end. He is very quiet. He has seen this before, from the other side.",
          (s) => (s.has('flower')
            ? "Later — if there is a later — someone might find the Mappa Vera on a table in an empty tower: an enormous sheet of white vellum with one small yellow flower in the middle of it. Nobody will know what it was a map of."
            : "Later — if there is a later — someone might find the Mappa Vera on a table in an empty tower: an enormous sheet of perfectly white vellum. Nobody will know it was ever a map."),
        ],
      },

      end_regent: {
        scene: 'throne',
        art: '👑🪒',
        mood: 'blood',
        ending: { id: 'regents-hand', title: "The Regent's Hand", type: 'bad' },
        text: [
          "Thane scrapes Ostmark off the map that night, by lantern-light, on a camp table at the edge of the world. It takes him eleven strokes. He hums.",
          "In the morning there are two Blanks: the old one in the north, and a new one in the east, raw and bright and *growing*.",
          (s) => (s.has('drew_sea') ? "The Narrow Sea you drew to save Ostmark still runs down the eastern border. Now it runs along the edge of nothing, and the waves fall off it." : null),
          "He keeps his word. You are made Royal Cartographer, with a house and a pension and a tower room with a very good lock. Your job, every day for the rest of your life, is to draw walls along the edges of both holes, a line at a time, to slow them down.",
          "Every line costs you. You get thinner every year. Thane notices, and orders you better food, as if that's the problem.",
          (s) => (s.has('blot_palace') ? "The ink-lake in the throne room never drains. The boy-king sails paper boats on it. Thane has it roped off and pretends it isn't there, which is how he deals with most things." : null),
          (s) => (s.has('thane_deal') ? "Captain Rook visits once, years later. She doesn't say anything. She just leaves a jar of real ink on your windowsill and goes." : null),
          "Master Vell never comes home from the white. Some nights you draw a tiny chair on the map, at the very edge of the Blank, just in case. It never has anyone in it.",
        ],
      },

      end_fair: {
        scene: 'library',
        art: '🌅📦',
        mood: 'dawn',
        weather: 'sparkles',
        ending: { id: 'fair-copy', title: 'Fair Copy', type: 'good' },
        text: [
          "The road holds. The shore holds. The white laps against your gentle line like a tide against sand, and stops, and stays stopped.",
          "You walk the master home. It takes four days. He leans on you the whole way, and gets a little more solid with every mile, and talks — about Oldmere, about your first wobbly maps, about how proud he is — until you beg him to stop and he doesn't.",
          (s) => (s.has('thane_fled') ? "The Regent is waiting for nobody at the north gate. Whatever happened at the edge of the world, Casimir Thane doesn't talk about it, and he never sends for the map again." : "The Regent sends for the map, of course. The master sends back a polite note saying it's been *retired*, which isn't a word Thane has ever had said to him before."),
          (s) => (s.has('bryn') || s.has('kind_bryn') ? "In Lowfen, Bryn Hollis meets you at the end of your road with bread and a scowl, and asks if the white will come back. *Not past the shore,* you tell her. She makes you promise. You do." : null),
          (s) => (s.has('saved_boy') ? "Tam waves at you from the mill door. He's painted his own little boat red, to match." : s.has('drew_river') ? "Nobody ever finds out what happened to the boy on the shop-sign. You look for him in every crowd for the rest of your life." : null),
          (s) => (s.has('double') ? "Months later, a letter comes from Ostmark, in handwriting exactly like yours. *I'm a baker now,* it says. *I'm all right. Are you?* You write back. You keep writing back." : null),
          "You put the Mappa Vera in a cedar box, and the pen with it, and the master locks it, and gives *you* the key.",
          legacyLine("Everything you drew is still out there: "),
          "You visit them sometimes. You don't regret all of them. That's the thing about drawing in ink: you learn to live with your lines.",
        ],
      },

      end_true: {
        scene: 'mountains',
        art: '⛰️🖋️',
        mood: 'dawn',
        weather: 'snow',
        ending: { id: 'one-hill', title: 'One Hill a Year', type: 'true' },
        text: [
          "You draw the master a road home — a hairline, the cheapest road ever made — and he walks it, looking back every ten steps until you can't see him any more.",
          "Then you sit down at the edge of the world, and you begin.",
          "One hill a year. That's what you allow yourself. You learn to draw with a single hair of ink, to make one stroke do the work of ten. You draw slowly, carefully, *knowing* — that every line is forever, that every line is you.",
          (s) => (s.has('lesson') ? "You can't draw Oldmere; nobody remembers it well enough. So you draw something new in its place: modest valleys, small honest rivers, a town with no name yet. The master taught you that much: draw only what you can truly see." : "You don't try to draw Oldmere back. You draw something new: modest valleys, small honest rivers, a town with no name yet."),
          (s) => (s.has('bryn') || s.has('kind_bryn') ? "Bryn walks up from Lowfen every month with bread and gossip. In the third year she asks to learn. You teach her to draw with charcoal first — charcoal can be rubbed out." : "People start walking north to watch the apprentice at the edge of the world. They bring you bread. They bring you stories. Being remembered, you find, puts a little ink back."),
          (s) => (s.has('dragon_friend') ? "Margrave comes to sit with you on the long evenings. It tells you about the sea. You draw it a cove of its own." : null),
          (s) => (s.has('forgave') ? "The master writes to you every week until he dies. Every letter ends the same way: *Drawn with love.*" : "The master writes to you every week until he dies. You don't open the first few. Then you open them all, in one night, and cry until morning."),
          "It'll take you three hundred years. You're ink. You have time, if you're careful.",
          "You are the Cartographer now.",
        ],
      },

      end_hand: {
        scene: 'void',
        art: '✋🌌',
        mood: 'void',
        weather: 'stars',
        ending: { id: 'hand-above', title: 'The Hand Above the Sky', type: 'neutral' },
        text: [
          "You walk the hairline across the white for what feels like a day. The master's voice fades behind you. Then even the white starts to change: it gets *textured*. Fibrous. Faintly ribbed, like —",
          "Like vellum.",
          "And then there's an edge. A real edge, a cut edge, and you are standing on it, looking down — and below you is a desk. Oak, scarred, the size of a country. A candle on it as big as a sun. An inkwell like a black lake.",
          "And leaning over the desk, so huge their face fills the sky, is someone young, with ink-stained fingers and their tongue between their teeth in concentration, holding a pen over a map.",
          "Over *your* map. Over the map with Harrowmere on it, and Lowfen, and a tiny white blank at the top. They've been drawing all of it. They've been drawing *you* — every bridge, every river, every step.",
          "You thought you were the only one who'd been drawn. You thought the master was the one holding the pen. But this map is being drawn by an apprentice, just like you.",
          "The giant pauses. Looks at the line they've just drawn — the little figure standing on the edge of the page — and frowns, unsure. Their hand trembles. You can see it in their face: *what have I made? What do I do with it now?*",
          "Then, very carefully, they draw you a door.",
          "You don't know where it goes. You don't know who's drawing *them*. You only know that everything is somebody's map, and everyone is somebody's apprentice, and nothing — nothing — is ever erased.",
          "You open the door.",
        ],
      },

      end_secret: {
        scene: 'village',
        art: '🏙️🐉🚪',
        mood: 'dawn',
        weather: 'sparkles',
        fx: 'flash',
        ending: { id: 'here-be-dragons', title: 'Here Be Dragons', type: 'secret' },
        text: [
          "You draw all night. Margrave remembers, and you draw what it remembers: Tallow Lane curving like a smile; the fish market with its green awnings; the clock tower and its tune. Needle spins true north for every street. Your double draws the eastern half while you draw the west, and your hands move the same way at the same time, because they're the same hands.",
          "It costs more ink than the two of you have. So Margrave gives its own. *I am made of forty years of the best ink he ever ground,* it says. *Use me.* By dawn it is no bigger than a cat, and curled on the master's lap, and very pleased with itself.",
          "And Oldmere *rises*. Not the way it was — nothing comes back the way it was — but the way it was *remembered*, by the one creature who watched it every morning and loved it.",
          "The clock tower strikes a quarter past four, forty years late, and plays its tune.",
          "You draw a blue door last, because Margrave insists. *That one,* it says. *That one most of all.* Somehow you already know which window will face the sea, and the size of the hand that will press against it.",
          "It opens. A woman steps out, shading her eyes against the sunrise, and a little girl pushes past her skirts and stares at the tiny dragon on an old man's lap, and *waves*.",
          { speaker: 'Master Vell', say: "Ada. Ottilie. Oh — *oh*." },
          "He can't stand. He doesn't have to. They run to him.",
          (s) => (s.has('forgave') ? "Later, he introduces you both to them. *My apprentices,* he says, and doesn't explain, and doesn't need to." : "Later, he introduces you both to them. *My apprentices.* You're still angry with him. You let him say it anyway."),
          "Nothing can ever be erased. That was always the rule. But it turns out that what was scraped away can be drawn again — by someone who remembers it perfectly, and someone who loves it enough to spend themselves on it.",
          "On the Mappa Vera, the white at the top of the world is gone. In its place is a harbour city, and a blue door, and, curled in the corner of the margin where it always was, a small and extremely smug dragon. The scroll in its claw has been redrawn. It now reads: HERE BE FRIENDS.",
        ],
      },
    },
  });
})();
