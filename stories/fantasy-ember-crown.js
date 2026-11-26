/*
 * MysteryFate story: The Ember Crown (fantasy)
 * Meters: light (your own warmth / mercy) vs hunger (the heart's corruption). Both clamp 0..5.
 * Key flags: stone, tear, old_wrong, locket, sword, hurt_wren, quill, quill_friend, quill_burned,
 *            riddle_hint, riddle_true, nameless, lost_memory, scouted, isolde_ally, spared_isolde, killed_isolde
 */
(function () {
  const clamp = (v) => Math.max(0, Math.min(5, v));
  const mod = (o) => (s) => { for (const k of Object.keys(o)) s.setVar(k, clamp(s.get(k) + o[k])); };
  const gate = (to) => (s) => (s.get('hunger') >= 5 ? 'end_consumed' : to);
  const withQuill = (s) => s.has('quill') && !s.has('quill_burned');
  const secretReady = (s) =>
    s.has('isolde_ally') && s.has('locket') && s.has('old_wrong') && s.has('riddle_true') && s.get('hunger') <= 2;

  registerStory({
    id: 'ember-crown',
    title: 'The Ember Crown',
    category: 'fantasy',
    tagline: 'A dying god put its burning heart in your hands. Now the heart wants to be worn.',
    description:
      "A star falls into the pines above your village, and inside the crater a god of fire is dying. Carry its still-burning heart to the Ashen Throne before the third dawn — past the knights who hunt it, the fox who flatters you, and the heart itself, which whispers that it would rather be a crown.",
    cover: '🔥',
    accent: '#ff7b25',
    ambient: 'fantasy',
    scene: 'forest',
    voices: {
      narrator: { gender: 'female', pitch: 0.95, rate: 0.95, accent: 'en-GB', note: 'warm fireside storyteller, hedge-witch cadence' },
      'You': { gender: 'neutral', pitch: 1.05, rate: 1, note: 'the apprentice: young, earnest, scared but stubborn' },
      'Aurel': { gender: 'neutral', pitch: 0.5, rate: 0.8, accent: 'en-GB', note: 'dying fire god: vast, slow, ancient, tender' },
      'Quill': { gender: 'male', pitch: 1.2, rate: 1.2, accent: 'en-GB', note: 'three-tailed fox: quick, sly, theatrical' },
      'Marrow': { gender: 'female', pitch: 0.7, rate: 0.85, accent: 'en-IE', note: 'old river witch: gravelly, cackling, wet' },
      'Isolde Vey': { gender: 'female', pitch: 0.85, rate: 0.92, accent: 'en-GB', note: 'grieving knight-captain: clipped, iron, tired' },
      'Bridgekeeper': { gender: 'female', pitch: 0.4, rate: 0.7, accent: 'en-GB', note: 'forty-foot granite colossus: grinding, solemn' },
      'Toll-Moth': { gender: 'female', pitch: 1.45, rate: 0.9, volume: 0.6, note: 'moth-woman: breathy, whispery, dreamy' },
      'Corin': { gender: 'male', pitch: 1.3, rate: 1.15, accent: 'en-GB', note: 'fifteen-year-old knight: voice cracking, frightened' },
      'Boy-knight': { gender: 'male', pitch: 1.3, rate: 1.2, accent: 'en-GB', note: 'Corin before he gives his name: panicked' },
      'Knight': { gender: 'male', pitch: 0.75, rate: 1.1, accent: 'en-GB', note: 'masked soldier barking orders' },
      'Drowned child': { gender: 'neutral', pitch: 1.7, rate: 0.75, volume: 0.6, note: 'ghost child: thin, cold, pleading' },
    },
    warning: 'Contains: fire, peril, death, a grieving parent.',
    vars: { light: 1, hunger: 0 },
    flags: [],
    hud: [
      { var: 'light', label: 'Light', icon: '🕯️', max: 5 },
      { var: 'hunger', label: 'Hunger', icon: '🔥', max: 5 },
    ],
    start: 'intro',
    scenes: {
      // ───────────────────────────── ACT ONE: THE FALL ─────────────────────────────
      intro: {
        scene: 'cottage',
        title: 'Midnight — Mother Hawthorn’s Cottage',
        art: '🌠',
        mood: 'night',
        weather: 'stars',
        text: [
          "The sky tears open above the pine forest, and a star comes down screaming.",
          "It does not fall like the stars in Mother Hawthorn's stories — gentle, a wish on a thread. It falls like a hammer. The cottage windows flash white, the jars of dried yarrow rattle on their shelves, and somewhere up the mountain the whole forest goes *boom*.",
          "You are alone. Hawthorn left at dusk to birth a baby two valleys over, and she said what she always says: *Touch nothing that hums.*",
          "Through the window, above the black teeth of the pines, a column of gold smoke is rising. And something in it is singing your name.",
          "Hawthorn's satchel hangs by the door. Your boots are by the fire. The singing is getting fainter.",
        ],
        choices: [
          {
            text: "Grab Hawthorn's satchel first",
            scene: 'forest',
            hint: 'A witch never goes into the dark empty-handed.',
            set: ['stone'],
            art: '🎒',
            outcome: [
              "You snatch the satchel off its peg. Salt, a stub of beeswax, a knife with a horn handle — and at the bottom, cool as a creek in your fist, Hawthorn's river stone.",
              "Grey, smooth, with a white ring around its middle like a wedding band. She once told you it was a gift from her sister, who *lives where the water is old*. You never asked what that meant.",
              "You stuff your feet in your boots and run. The stone thumps against your hip with every step, like a second heartbeat.",
            ],
            next: 'crater',
          },
          {
            text: 'Run. Now. Barefoot.',
            scene: 'forest',
            hint: 'Whatever is singing is running out of breath.',
            effect: mod({ light: 1 }),
            art: '🏃',
            outcome: [
              "You don't stop for boots. You don't stop for anything. The door bangs behind you and the frost bites your heels and you are flying up the goat-path between the pines.",
              "Needles slash your arms. You fall once, hard, and get up laughing for no reason at all — because the air is warm here, warm in the middle of a mountain night, warm like a kitchen.",
              "The singing hears you coming. It gets a little louder, as if something up there is glad.",
            ],
            next: 'crater',
          },
        ],
      },

      crater: {
        scene: 'crater',
        title: 'The Crater',
        art: '✨🔥',
        mood: 'ember',
        weather: 'embers',
        fx: 'flash',
        text: [
          "The pines lie flat in a perfect circle, combed outward like hair. At the center, in a bowl of glassy black earth, a figure made of embers is dying.",
          "It is tall — taller than the cottage — and it is mostly cracks now, orange light leaking out of it like water from a broken jar. Where it breathes, the snow becomes rain.",
          { speaker: 'Aurel', say: 'Little witch. Little candle. You came.' },
          "Its chest opens like a stove door. Inside, a heart the size of an apple beats in slow gold pulses, and every pulse throws your shadow a hundred feet behind you.",
          { speaker: 'Aurel', say: "I am Aurel, last flame of the first fire. Carry my heart to the Ashen Throne before the dawn of the third day — or every hearth in the world goes cold, one by one, forever." },
          "Far down the slope, silver bells begin to ring. Aurel's ember eyes flick toward them, and you see something you never expected to see in a god: fear.",
        ],
        choices: [
          {
            text: 'Swear to carry it. No questions.',
            effect: mod({ light: 1 }),
            art: '🤲',
            outcome: [
              "You kneel in the black glass and hold out both hands.",
              { speaker: 'You', say: 'I swear it.' },
              "The heart drops into your palms. It should burn you to the bone. Instead it feels like holding a sleeping bird — warm, quick, impossibly alive. Aurel sighs, and the sigh is a summer wind across the whole mountain.",
              { speaker: 'Aurel', say: 'Brave. Good. Do not let it talk you into anything.' },
              "You are about to ask what *that* means when the god's face crumbles into sparks.",
            ],
            next: 'knights_arrive',
          },
          {
            text: 'Ask what it will cost',
            hint: 'Hawthorn says every gift has a hook in it.',
            set: ['old_wrong'],
            art: '⚖️',
            outcome: [
              { speaker: 'You', say: 'Who are those bells? Why do they want you dead?' },
              "Aurel is quiet for so long you think it has died. Then:",
              { speaker: 'Aurel', say: "Three hundred years ago I was angry, and I was young, and I burned a city called Pellam to the stones. Those who crawled out of the ash swore an oath to cage every fire that thinks. The Pale Order. They are not wrong to fear me." },
              "It pours its heart into your hands — warm, beating, ashamed. You carry the god's confession with it, heavier than the heart.",
            ],
            next: 'knights_arrive',
          },
          {
            text: 'Hold the god while it dies',
            hint: 'Nobody should die alone. Not even a star.',
            set: ['tear'],
            art: '💧',
            outcome: [
              "You climb into the crater and put your arms around as much of Aurel as you can reach. It is like hugging a bonfire that has decided not to hurt you.",
              { speaker: 'Aurel', say: 'Oh. Oh, little candle. No one has held me in a thousand years.' },
              "A single tear rolls down its cheek — and cools, as it falls, into a bead of gold glass that lands in your palm still faintly warm. Then the heart is in your other hand, and the god is mostly sparks.",
              { speaker: 'Aurel', say: 'When the heart is loudest, hold that. Remember someone wept.' },
            ],
            next: 'knights_arrive',
          },
        ],
      },

      knights_arrive: {
        scene: 'crater',
        title: 'The Bells',
        art: '🔔🏮',
        mood: 'forest',
        weather: 'snow',
        fx: 'heartbeat',
        text: [
          "Aurel is gone. Only a shape of ash remains, kneeling, and the heart beating in your hands.",
          "White lanterns pour over the crater's lip. Knights in pale enamel armor, faces hidden behind silver masks with no mouths. Their bells ring with every step, and where the sound touches the snow, the snow *refreezes*.",
          { speaker: 'Knight', say: 'The heart! Someone has the heart! Surround the crater!' },
          "The heart pulses once — hard — and you hear it for the first time. Not with your ears. Somewhere behind your eyes.",
          "*Let me. Let me show them what I am.*",
          "Lanterns on three sides. A root-hollow under a fallen pine to your left. A ravine to your right. Decide.",
        ],
        timer: 8,
        timeout: {
          text: 'You froze.',
          art: '🥶',
          outcome: [
            "Your legs lock. The heart thuds, the bells ring, and you stand there in the open like a deer in lamplight while the knights fan across the crater.",
            "A single lantern swings toward you. Then the knight holding it stumbles, gasps, and drops into the root-hollow beside you — and the two of you are face to face in the dark.",
          ],
          next: 'young_knight',
        },
        choices: [
          {
            text: 'Dive into the root-hollow',
            art: '🌲',
            outcome: [
              "You throw yourself under the fallen pine and press the heart against your belly to hide its glow. Dirt in your mouth. Roots like ribs around you.",
              "Boots crunch past. Bells. Voices. Then one set of boots stops — and slides down into the hollow right on top of you.",
            ],
            next: 'young_knight',
          },
          {
            text: 'Run for the ravine',
            scene: 'mountains',
            art: '🏔️',
            outcome: [
              "You bolt. A crossbow bolt hisses past your ear and buries itself in a pine with a sound like a slammed door.",
              "Then the ground is gone and you're sliding — down scree, down ice, down a dark throat of rock with the heart clutched to your chest like a stolen loaf. You hit the bottom in a drift of snow, bruised and gasping and *free*.",
              "Far above, the bells ring and ring, and slowly, slowly, they ring the wrong way.",
            ],
            next: 'quill_meet',
          },
          {
            text: 'Raise the heart and BURN',
            hint: 'It wants to. You can feel how much it wants to.',
            effect: mod({ hunger: 2 }),
            fx: 'redflash',
            art: '🔥',
            outcome: [
              "You lift the heart over your head and you *let it*.",
              "Fire roars out of you in a ring — not orange, not red, but the white-gold of a forge. It throws the knights flat. It turns their lanterns to slag. It runs up the trunks of a hundred pines and makes them torches, and you feel every single one of them burn like a mouthful of honey.",
              "*Yes,* the heart purrs. *Yes. Again.*",
              "Somewhere in the burning forest, someone young is screaming for help.",
            ],
            next: 'burning_wood',
          },
        ],
      },

      young_knight: {
        scene: 'forest',
        title: 'The Root-Hollow',
        art: '🛡️',
        mood: 'night',
        weather: 'snow',
        text: [
          "The knight's mask has been knocked askew. Under it is a boy — fifteen, maybe — freckled, white-lipped, his sword shaking so hard it rattles against a root.",
          { speaker: 'Boy-knight', say: "D-don't. Please. I'll shout. I swear I'll shout." },
          "He doesn't shout. He's staring at the heart in your hands, and his eyes are full of fire-light and terror.",
          { speaker: 'Boy-knight', say: "My name's Corin. My mother is the captain. She'll — she'll find you. She always finds them." },
          "*He will tell them where you are,* whispers the heart. *Make him small. Make him ash. It is the kindest thing.*",
        ],
        choices: [
          {
            text: 'Lower your hands. Let him go.',
            set: ['locket'],
            effect: mod({ light: 1 }),
            art: '🕊️',
            outcome: [
              "You cup the heart close so its light dims, and you shake your head.",
              { speaker: 'You', say: "Go home, Corin. Tell them I went over the ridge." },
              "He stares at you. Then, with clumsy hands, he pulls a silver locket from inside his breastplate and presses it into yours.",
              { speaker: 'Corin', say: "If she catches you — Captain Isolde Vey — show her this. She gave it to me. She'll know I'm alive because you let me be." },
              "He scrambles out of the hollow and you hear him yell, voice cracking, *Over the ridge! They went over the ridge!* The bells swing away. The locket is warm from his skin.",
            ],
            next: 'quill_meet',
          },
          {
            text: 'Bind him and take his sword',
            hint: 'Mercy, with rope.',
            set: ['sword'],
            art: '🗡️',
            outcome: [
              "You move faster than he does. Hawthorn's twine — or your bootlace — around his wrists, his own scarf in his mouth, his back to a root.",
              "His sword is lighter than you expected: pale steel, chased with silver bells that make no sound at all. You take it.",
              { speaker: 'You', say: "Someone will find you by morning. I'm sorry." },
              "His eyes follow you out of the hollow, furious and wet. You don't look back. You can still feel them on you all the way down the mountain.",
            ],
            next: 'quill_meet',
          },
          {
            text: 'Let the heart answer him',
            effect: mod({ hunger: 2 }),
            set: ['hurt_wren'],
            fx: 'redflash',
            art: '✋🔥',
            outcome: [
              "You don't decide to. Your hand just rises, and the heart's light spills through your fingers and across his face.",
              "Corin screams. It's not a knight's scream; it's a child's. He claws out of the hollow and runs, and in the snow behind him you see a handprint of melted slush — *your* handprint — and on his cheek, for one terrible instant, the same shape glowing red.",
              "*There,* croons the heart. *Wasn't that easy?*",
              "Your hand is shaking. It is not shaking from cold.",
            ],
            next: 'quill_meet',
          },
        ],
      },

      burning_wood: {
        scene: 'forest',
        title: 'The Forest You Lit',
        art: '🌲🔥',
        mood: 'blood',
        weather: 'ash',
        fx: 'shake',
        text: [
          "The forest is a cathedral of fire, and you built it.",
          "Knights stumble through the smoke, beating at their burning cloaks. Pines crack and fall like giants dropping to their knees. And under one of them — pinned, his mask gone, his leg trapped beneath a blazing trunk — is a boy no older than you.",
          { speaker: 'Boy-knight', say: "Help — someone, please — Mother!" },
          "The heart is warm and fat and pleased in your hands. *Leave him,* it says. *The others will come. Run while they mourn.*",
          "Ten steps to the boy. Ten steps the other way to the dark, cool ravine.",
        ],
        choices: [
          {
            text: 'Haul the trunk off him',
            set: ['locket'],
            effect: mod({ light: 1 }),
            art: '💪',
            outcome: [
              "You shove the heart into your shirt and grab the burning trunk with bare hands. It should take your skin off. The heart's warmth runs down your arms like armor — grudging, sulky — and you heave, and the pine rolls.",
              "The boy drags himself free. Up close, he's freckled and shaking.",
              { speaker: 'Corin', say: "You — you lit all this. And you came back." },
              "He presses something into your blistered palm: a silver locket, hot from the fire.",
              { speaker: 'Corin', say: "I'm Corin. Captain Isolde Vey is my mother. If she catches you, show her that. Tell her I lived because you let me." },
            ],
            next: 'quill_meet',
          },
          {
            text: 'Drink the fire back into the heart',
            hint: 'Put it out the only way you can.',
            effect: mod({ hunger: 1, light: 1 }),
            art: '🌀',
            outcome: [
              "You hold the heart high and *pull*. Every flame in the forest bends toward you like wheat in a wind, and pours, roaring, back into the beating gold in your hands.",
              "The fire is gone in a breath. Smoke and silence and blackened trees. The pinned boy, free now as the trunk crumbles to charcoal, stares at you across the steaming snow.",
              "The heart is *heavier* now. Fuller. It hums a little song you don't know the words to. You run before the boy can find his voice.",
            ],
            next: 'quill_meet',
          },
          {
            text: 'Run while they mourn',
            effect: mod({ hunger: 1 }),
            set: ['hurt_wren'],
            art: '🌑',
            outcome: [
              "You turn your back on him. It's the easiest thing you've ever done, and you will spend a long time wondering why.",
              "Behind you, knights reach the boy and haul the trunk away, shouting his name — *Corin! Corin!* — and he screams when they move his leg.",
              "*Good,* the heart says, and for the first time you notice its voice sounds a little like yours.",
            ],
            next: 'quill_meet',
          },
        ],
      },

      // ───────────────────────────── DAY ONE ─────────────────────────────
      quill_meet: {
        scene: 'mountains',
        title: 'Dawn, Day One — The Fox at the Crossroads',
        art: '🦊',
        mood: 'dawn',
        weather: 'snow',
        text: [
          "By grey dawn you reach the crossroads below the mountain, where a fallen shrine wears a hat of snow. Sitting on top of it, licking one paw, is a fox the color of a struck match.",
          "It has three tails. It has your attention.",
          { speaker: 'Quill', say: "Well, well. The little candle with the big heart. I'm Quill. I used to carry Aurel's messages, back when Aurel still had friends." },
          { if: 'hurt_wren', text: "His nose wrinkles. *You smell like a burned boy,* he says, not unkindly. *The heart's been talking, hasn't it?*" },
          { if: 'locket', text: "His eyes go to the silver locket at your throat. *Mercy. How unfashionable. I like you already.*" },
          { speaker: 'Quill', say: "The Ashen Throne is three days' walk by the long road. The river road, where old Marrow takes her tolls. Or — " },
          "He grins, and a hole opens in the snow behind him: a tunnel of roots glowing with faint blue lanterns.",
          { speaker: 'Quill', say: "— there's the fox road. Under the hills. Half the time. Twice the strange." },
          "*Don't trust him,* whispers the heart. *Trust me.*",
        ],
        choices: [
          {
            text: "Follow Quill's fox road",
            scene: 'cave',
            set: ['quill'],
            art: '🕳️',
            outcome: [
              { speaker: 'You', say: "Half the time. Lead on." },
              "Quill bows so low his three tails fan over his head. Then he flicks into the tunnel, and you follow, and the snow-light closes behind you like a door.",
              "Down here it smells of moss and copper and old honey. Quill trots ahead, humming. Every so often he glances back — not at you. At the heart.",
            ],
            next: 'fox_road',
          },
          {
            text: 'Offer Quill a coal for the truth',
            hint: 'Foxes are honest when they are fed.',
            set: ['quill', 'quill_friend'],
            effect: mod({ hunger: 1 }),
            art: '🪙🔥',
            outcome: [
              "You pinch the heart — it *bites* — and a single coal comes away in your fingers. You hold it out.",
              { speaker: 'You', say: "Tell me the truth, and it's yours." },
              "Quill stops grinning. He takes the coal delicately in his teeth and swallows it, and his fur ripples from match-orange to true, deep gold.",
              { speaker: 'Quill', say: "...Truth, then. Aurel cast me out for stealing fire for a cold village. I've hated it for two hundred years. I meant to steal that heart from you in the dark. Now I think I'll just walk beside you. That coal was the warmest thing anyone's given me since." },
              "The heart sulks at the missing coal. You feel it, a small hungry ache behind your ribs.",
            ],
            next: 'fox_road',
          },
          {
            text: 'Take the long river road',
            art: '🌊',
            outcome: [
              { speaker: 'You', say: "No offense, fox. I'll walk." },
              { speaker: 'Quill', say: "Offense taken, kept, and treasured. Say hello to Marrow for me. Don't give her anything you'll miss." },
              "He vanishes into his tunnel, and the hole closes up behind him like a mouth.",
              "You take the road down toward the sound of water. It is long, and cold, and every step of it the heart murmurs about how warm you could be.",
            ],
            next: 'river',
          },
        ],
      },

      fox_road: {
        scene: 'cave',
        title: 'Day One — The Lantern Market',
        art: '🏮🦋',
        mood: 'gold',
        weather: 'sparkles',
        text: [
          "The fox road opens into a cavern as big as a cathedral, and the cavern is full of a market.",
          "Moth-winged merchants sell sunsets in bottles. A badger in spectacles weighs out moonlight by the ounce. Stalls hung with stolen candle-flames, glow-worm silks, the bottled first-light of a thousand mornings — and every single one of those lights turns, as you walk past, to look at the heart.",
          { speaker: 'Quill', say: "Head down, candle. In here, anything that glows is either for sale or for supper." },
          "A toll-gate blocks the far tunnel. Behind it sits a moth-woman with eyes like two full moons.",
          { speaker: 'Toll-Moth', say: "Passage costs a light, little traveler. Any light. A memory is a light. So is a hope." },
          "*Or,* whispers the heart, *we could simply take all of theirs.*",
        ],
        choices: [
          {
            text: "Let the heart drink the market's lights",
            effect: mod({ hunger: 2 }),
            fx: 'redflash',
            art: '🌑',
            outcome: [
              "You open your hands, and the heart *inhales*.",
              "Every bottled sunset cracks. Every stolen candle-flame streams across the cavern into your fists. The moonlight pours off the badger's scales like water. In three heartbeats the Lantern Market is pitch black and full of screaming wings.",
              "You walk through the toll-gate. Nobody stops you. Nobody *can* — you are the only light left in the world, and it is glorious.",
              { speaker: 'Quill', say: "...Remind me never to owe you money." },
            ],
            next: 'fox_dark',
          },
          {
            text: 'Pay the toll with a memory',
            set: ['lost_memory'],
            effect: mod({ light: 1 }),
            art: '🌫️',
            outcome: [
              { speaker: 'You', say: "Take a memory, then." },
              "The Toll-Moth leans close and breathes in, and something leaves you — something small and bright. You reach for it and find only a soft hole where it used to be.",
              "Later you will realize it was your mother's face. You remember her voice, her laugh, the smell of her bread. But the face is gone, like a window frosted over.",
              "The gate swings open. Quill looks at you for a long moment and says nothing at all, which for Quill is a kind of bow.",
            ],
            next: 'fox_dark',
          },
          {
            text: "Trade Hawthorn's river stone",
            if: 'stone',
            unset: ['stone'],
            set: ['riddle_hint'],
            art: '🪨',
            outcome: [
              "You set the river stone on the toll-moth's counter. Her moon-eyes widen.",
              { speaker: 'Toll-Moth', say: "Water that remembers. Oh, that is a light, child. That is a deep one." },
              "She lets you pass — and as you do, she whispers, as if it has been weighing on her for a hundred years:",
              { speaker: 'Toll-Moth', say: "When the Bridgekeeper asks you her riddle, remember: the answer is not *what* it is. It is what you *do* with it." },
            ],
            next: 'fox_dark',
          },
        ],
      },

      fox_dark: {
        scene: 'cave',
        title: 'The Lightless Mile',
        art: '🌑✋',
        mood: 'void',
        fx: 'heartbeat',
        text: [
          "Past the market, the fox road goes black. Not dark — *black*, a hungry nothing that eats even the heart's glow, so that you can barely see your own fingers wrapped around it.",
          { speaker: 'Quill', say: "Keep walking. Don't stop. Don't listen to anything." },
          "Something brushes your hand. Long fingers, cold as well-water, curling around the heart.",
          { if: 'quill_friend', text: "*Give it to me,* says a voice that is almost Quill's. *It's so heavy. Let me hold it, just for a moment.* But the real Quill is snarling somewhere to your left.", else: "*Give it to me,* says Quill's voice, very close, very soft. *It's so heavy, candle. Let me hold it. Just for a moment.*" },
          "The fingers tighten. They *pull*.",
        ],
        timer: 7,
        timeout: {
          text: 'You hesitated.',
          art: '🫳',
          effect: (s) => { if (!s.has('quill_friend')) s.set('heart_lost'); },
          outcome: [
            "You hesitate — one heartbeat, two — and the heart slides out of your grip like a fish.",
            { if: 'quill_friend', text: "Then gold fur flashes past you, and there is a wet, crunching snarl, and something shrieks and is gone. Quill drops the heart back in your hands, his muzzle singed. *Never,* he pants, *ever hesitate down here.*", else: "You hear Quill's laugh — delighted, apologetic, already far away. *Sorry, candle! A fox is a fox!*" },
          ],
          next: (s) => (s.has('quill_friend') ? 'camp' : 'end_fox'),
        },
        choices: [
          {
            text: 'Hold on with everything',
            effect: mod({ light: 1 }),
            art: '✊',
            outcome: [
              "You wrap both arms around the heart and fold yourself over it like a mother over a child, and you *hold*.",
              { if: 'quill_friend', text: "The fingers yank. Then Quill hits them, a gold blur of teeth, and something in the dark shrieks and flees. *Gloam-thief,* Quill spits. *Wearing my voice. The nerve.*", else: "The fingers yank once more — then let go. A moment later Quill's eyes glint out of the blackness, sheepish. *Can't blame a fox for trying,* he mutters. *You've got a grip like a debt collector.*" },
              "You walk the rest of the Lightless Mile with the heart pressed to your breastbone. It beats against you like it's trying to get in.",
            ],
            next: 'camp',
          },
          {
            text: "Let go — trust Quill",
            effect: (s) => { if (!s.has('quill_friend')) s.set('heart_lost'); },
            art: '🫴',
            outcome: [
              "You open your hands.",
              { if: 'quill_friend', text: "There's a snarl, a shriek, a scuffle of claws — and the heart is pushed back into your palms by a hot, gold-furred muzzle. *That was a gloam-thief wearing my voice,* Quill says, *and you trusted me anyway.* He sounds like he might cry. Foxes don't cry. *Come on.*", else: "Warm fur brushes your palm as the heart is lifted away. *Thank you, candle,* says Quill, and he sounds genuinely sorry. *Truly. You'd have made a fine witch.* Then his paws patter off into the dark, faster and faster, and you are alone in the black." },
            ],
            next: (s) => (s.has('quill_friend') ? 'camp' : 'end_fox'),
          },
          {
            text: 'Flare the heart',
            effect: (s) => { mod({ hunger: 2 })(s); s.set('quill_burned'); },
            fx: 'flash',
            art: '💥',
            outcome: [
              "You squeeze the heart and it *erupts*. White light floods the Lightless Mile, and a tall grey thing with too many fingers screams and dissolves like frost on a stove.",
              "Quill screams too. He was right beside you. When the light fades, he is curled on the stone, his beautiful tails singed to black wire.",
              { speaker: 'Quill', say: "...Well. I suppose I deserved some of that." },
              "He limps the rest of the way ahead of you without a word, and at the tunnel's end he slips into the snow and does not come back.",
            ],
            next: gate('camp'),
          },
        ],
      },

      river: {
        scene: 'sea',
        title: 'Day One — The Witch in the Reeds',
        art: '🌊🧙',
        mood: 'fog',
        weather: 'rain',
        text: [
          "The river is wide and black and steaming where the heart's warmth touches it. Fog sits on the water like a sleeping animal.",
          "In the reeds, in a hut built on the back of an enormous, motionless turtle, lives Mother Marrow. She is mostly hair — long green-grey river-weed hair — and two eyes like wet pebbles.",
          { speaker: 'Marrow', say: "Fire on my river. Fire on my *river*. Haven't seen that since Pellam burned." },
          "Her eel-boat bobs at the turtle's tail. Its rowers are drowned men with patient faces.",
          { speaker: 'Marrow', say: "Crossing costs. Always costs. What'll you give old Marrow, little ember-bearer?" },
          "The heart pulses, low and warning. *She wants me. They all want me.*",
        ],
        choices: [
          {
            text: 'Give her a coal of the heart',
            set: ['riddle_hint'],
            effect: mod({ hunger: 1, light: -1 }),
            art: '🪙🔥',
            outcome: [
              "You twist a coal from the heart. It screams — a thin, high, furious sound in your head — and the world dims a shade, as if a cloud has passed over every hearth for a hundred miles.",
              "Marrow snatches the coal and pops it in her mouth like a sweet. Steam pours from her ears. She cackles.",
              { speaker: 'Marrow', say: "Fair, fair. And for a coal, a crumb: when the Bridgekeeper asks you her riddle, little thing, the answer is not what it *is*. It's what you *do* with it. Now get in the boat." },
            ],
            next: 'river_crossing',
          },
          {
            text: 'Give her your name',
            hint: 'What use is a name, if the world goes dark?',
            set: ['nameless'],
            art: '📜',
            outcome: [
              { speaker: 'You', say: "Take my name." },
              "Marrow's pebble eyes gleam. She leans in and *sips* it off your lips like foam off ale.",
              "It's strange. You still know who you are. But when you reach for the word that means *you*, there is only river-sound. Somewhere in your village, Hawthorn will wake and not remember what she called her apprentice.",
              { speaker: 'Marrow', say: "Good name. Sweet. Into the boat, nobody." },
            ],
            next: 'river_crossing',
          },
          {
            text: "Show her Hawthorn's river stone",
            if: 'stone',
            unset: ['stone'],
            set: ['riddle_hint', 'old_wrong'],
            art: '🪨',
            outcome: [
              "You hold up the grey stone with its white ring. Marrow goes completely still.",
              { speaker: 'Marrow', say: "...That's my stone. I gave that to my little sister when she went up the mountain to be a hedge-witch. Hawthorn. Is she well? Does she still burn the porridge?" },
              "For the first time she sounds like a person and not a river. She takes the stone back and holds it to her cheek, and tells you, quiet, everything: how Aurel burned Pellam, how she pulled children out of the ash, how the ones who lived founded the Pale Order. *Don't hate them,* she says. *They were children who saw fire think.*",
              { speaker: 'Marrow', say: "And for my sister's sake, a secret: the Bridgekeeper's riddle — the answer is not what it *is*. It's what you *do* with it. Now go. Free passage." },
            ],
            next: 'river_crossing',
          },
          {
            text: 'Refuse. Cross on your own.',
            art: '🏊',
            outcome: [
              { speaker: 'You', say: "I'll give you nothing. The river's not yours." },
              { speaker: 'Marrow', say: "Everything wet is mine, dearie. But go on. Go on and swim it." },
              "You wade in. The cold is a fist around your heart — your *own* heart. The god's heart, held high over your head, steams and spits. Halfway across, the water begins to move in ways water should not move.",
            ],
            next: 'river_crossing',
          },
        ],
      },

      river_crossing: {
        scene: 'sea',
        title: 'The Drowned of Pellam',
        art: '🌊💀',
        mood: 'sea',
        weather: 'rain',
        fx: 'shake',
        text: [
          "Hands. Grey hands, rising out of the black water all around you — dozens, hundreds — reaching for the heart.",
          "Faces follow them. The drowned of Pellam, three hundred years cold, who ran into the river to escape the fire and never came out. Their mouths open and close. They are not trying to hurt you. They are *cold*.",
          { speaker: 'Drowned child', say: "Warm. Warm. Please, just for a moment, warm." },
          "Their fingers close on your sleeves, your hair, your ankles. They're pulling you down toward the bottom, where it is darkest and coldest of all.",
        ],
        timer: 8,
        timeout: {
          text: 'You went under.',
          art: '🫧',
          effect: mod({ hunger: 1, light: -1 }),
          outcome: [
            "You hesitate, and the river takes you.",
            "Black water. Grey hands. Your lungs scream. And then the heart, all on its own, *flares* — a bubble of white fire that boils the water and sends the drowned reeling back into the deep, wailing.",
            "You surface on the far bank, choking. The heart is smug and hot against your chest. *You see? You need me.*",
          ],
          next: gate('camp'),
        },
        choices: [
          {
            text: 'Let them warm their hands',
            effect: mod({ light: 1, hunger: 1 }),
            art: '🤲',
            outcome: [
              "You stop fighting. You hold the heart out over the water like a lantern, and you let them come.",
              "A hundred grey hands cup around its light. The drowned close their eyes. One by one, their faces soften — pink comes into a cheek, a child laughs — and they let go and sink, slowly, smiling, into a sleep with no cold in it.",
              "The heart grumbles at being shared. But you reach the far bank with the drowned child's laugh in your ears, and it is worth everything.",
            ],
            next: 'camp',
          },
          {
            text: 'Beat them back and push on',
            art: '🚣',
            outcome: [
              "You grab the nearest thing — an oar, a branch, your own fist — and you strike. Hands let go. Faces sink. You hate it.",
              "You claw your way to the far bank and haul yourself onto the stones, gasping, and when you look back, the river is still. The drowned are waiting beneath it. They have been waiting three hundred years. They can wait longer.",
            ],
            next: 'camp',
          },
          {
            text: 'Boil the river',
            effect: mod({ hunger: 2 }),
            fx: 'redflash',
            art: '♨️',
            outcome: [
              "You plunge the heart into the water.",
              "The river *screams* into steam. The drowned dissolve like sugar in tea. For a hundred yards in every direction there is nothing but white fog and the hiss of boiling stone, and you walk across the bare riverbed as if it were a road.",
              "*Magnificent,* the heart sighs. You find you agree with it, and that is the most frightening thing that has happened yet.",
            ],
            next: gate('camp'),
          },
        ],
      },

      camp: {
        scene: 'mountains',
        title: 'Night, Day One — A Fire That Isn’t a Fire',
        art: '🏕️🌙',
        mood: 'night',
        weather: 'snow',
        text: [
          "You make camp in the lee of a boulder on the high moor. No firewood. You don't need firewood. You have a god's heart.",
          (s) => (withQuill(s)
            ? "Quill curls up just out of reach of its glow, three tails over his nose, one eye open. *Wake me if it starts talking,* he says. *It's already talking,* you say. He doesn't answer."
            : s.has('quill_burned')
              ? "You are alone. Somewhere out on the moor a fox is licking his burned tails, and you try not to think about it."
              : "You are alone. The moor is enormous and silent and the stars are very far away."),
          { if: 'lost_memory', text: "You try to remember your mother's face for comfort and find only frost." },
          { if: 'nameless', text: "You try to say your own name out loud, to hear a human voice. Only river-sound comes out." },
          "The heart sits in your lap, beating. It's so cold out here. It would be so easy to hold it closer. *Closer,* it agrees. *Inside your coat. Inside your ribs. We'd never be cold again.*",
          (s) => (s.get('hunger') >= 3 ? "Your fingertips have begun to glow faintly orange, like the edges of burning paper. You don't remember when that started." : null),
        ],
        choices: [
          {
            text: 'Hold it close and sleep warm',
            effect: mod({ hunger: 1 }),
            art: '😴🔥',
            outcome: [
              "You tuck the heart inside your coat, against your skin, and the warmth is the best thing you have ever felt. Better than Hawthorn's quilts. Better than summer.",
              "You dream of a crown of fire. You dream of every knee in the world bending. You dream of never, ever being small again.",
              "You wake rested and strong, and there is a faint, heart-shaped burn on your chest that doesn't hurt at all.",
            ],
            next: gate('bridge'),
          },
          {
            text: 'Sleep cold, and dream',
            set: ['old_wrong'],
            effect: mod({ light: 1 }),
            art: '💭',
            outcome: [
              "You set the heart on a stone an arm's length away and lie shivering in the dark until sleep takes you.",
              (s) => (s.has('old_wrong')
                ? "You dream of Aurel, young and furious, and of Pellam burning — and then of a woman in pale armor kneeling in the ruins of a much smaller village, holding a small burned shoe. You don't know who she is yet. You will."
                : "You dream of Aurel, young and furious, raining fire on a city called Pellam. You dream of children running into a river. You dream of the survivors, white-faced, swearing over the ashes that they will cage every fire that thinks. And you understand, suddenly, why the knights ring their bells."),
              "You wake with frost in your eyelashes and the god's grief in your mouth, and the heart is still beating on its stone, patient, a little hurt that you didn't need it.",
            ],
            next: 'bridge',
          },
          {
            text: 'Keep watch through the night',
            set: ['scouted'],
            art: '👁️',
            outcome: [
              "You don't sleep. You sit with your back to the boulder and the heart under your coat, and you watch.",
              "At the third hour you see them: white lanterns, far off on the slopes of the Ashen Mountain, moving into position on the great stair. An ambush, laid for the morning after next. And you see something else — a crumbling ledge on the stair's east side, where the lantern-bearers carefully don't walk.",
              "You memorize it. Hawthorn always said a witch's best tool is *noticing*.",
            ],
            next: 'bridge',
          },
        ],
      },

      // ───────────────────────────── DAY TWO ─────────────────────────────
      bridge: {
        scene: 'bridge',
        title: 'Day Two — The Riddle Bridge',
        art: '🌉🕯️',
        mood: 'castle',
        weather: 'ash',
        text: [
          "The Cinder Chasm splits the world in two. A mile deep, red at the bottom, breathing up heat that makes the air waver like water.",
          "Across it runs a single bridge of bone-white stone, and in the middle of the bridge sits the Bridgekeeper: a woman carved from granite, forty feet tall, with two candles burning where her eyes should be.",
          { speaker: 'Bridgekeeper', say: "Ember-bearer. Many have carried fire across me. Few have understood it. Answer, or fall." },
          { speaker: 'Bridgekeeper', say: "*I am the only treasure that grows when it is split. A king who hoards me sits in the dark. What am I?*" },
          { if: 'riddle_hint', text: "*The answer is not what it is,* you remember. *It's what you do with it.*" },
          "Below, the chasm breathes. The heart in your hands is almost laughing. *We don't have to answer her at all, you know.*",
        ],
        choices: [
          {
            text: '"Fire."',
            effect: mod({ light: 1 }),
            art: '🔥',
            outcome: [
              { speaker: 'You', say: "Fire. Light one candle from another and you've lost nothing. Hoard it under a lid and it goes out." },
              "The Bridgekeeper's candle-eyes flicker. A long, grinding pause.",
              { speaker: 'Bridgekeeper', say: "Half an answer. Half is enough to cross. Go." },
              "She lifts one enormous granite hand, and the way is open. You walk past her knees with your heart pounding — both of your hearts.",
            ],
            next: 'ashen_road',
          },
          {
            text: '"Fire — given away."',
            if: 'riddle_hint',
            set: ['riddle_true'],
            effect: mod({ light: 1 }),
            art: '🕯️🕯️',
            outcome: [
              { speaker: 'You', say: "Fire. But not fire kept. Fire *given away*. It's only a treasure while you're sharing it." },
              "The Bridgekeeper is silent so long that dust begins to fall from her shoulders. Then she bows — a mountain bowing — and her candle-eyes are wet with wax.",
              { speaker: 'Bridgekeeper', say: "Three hundred years I have waited to hear that. Hear me, then: the Ashen Throne was made for one. It does not have to stay that way. A heart can be broken without being destroyed." },
              "She lays her hand flat across the chasm like a second bridge, and you walk across her palm.",
            ],
            next: 'ashen_road',
          },
          {
            text: '"A crown."',
            scene: 'crater',
            art: '👑',
            outcome: [
              { speaker: 'You', say: "A crown." },
              "The heart purrs. The Bridgekeeper does not.",
              { speaker: 'Bridgekeeper', say: "That is what *it* would say." },
              "The bridge beneath your feet cracks clean through. The stones drop away like teeth, and you drop with them, into the red breath of the chasm.",
            ],
            next: 'bridge_fall',
          },
          {
            text: 'Burn your way across',
            effect: mod({ hunger: 2 }),
            fx: 'redflash',
            art: '💥',
            outcome: [
              "You don't answer. You raise the heart and pour its fire into the Bridgekeeper's face.",
              "Granite doesn't burn. But it *cracks*. Her candle-eyes gutter and go out, and she screams a sound like a quarry collapsing, and topples sideways into the chasm, taking half the bridge's railing with her.",
              "You cross over the rubble with the heart singing in your hands. Behind you there's a very long fall and, at the bottom, a very distant crash.",
            ],
            next: gate('ashen_road'),
          },
        ],
      },

      bridge_fall: {
        scene: 'bridge',
        title: 'The Cinder Chasm',
        art: '🕳️🔥',
        mood: 'ember',
        weather: 'embers',
        fx: 'shake',
        text: [
          "You catch a rusted chain hanging from the bridge's underside and swing out over a mile of red nothing. Your shoulder nearly comes out of its socket.",
          "Hot wind roars up past you. The heart is clutched to your chest with your other arm, and it is *thrilled*.",
          "*Let go of the chain,* it says. *Let me give you wings. I can, you know. You'd look so beautiful on fire.*",
          (s) => (withQuill(s) ? "Somewhere above, you hear claws scrabbling on stone and a voice yelling your name — or what's left of it." : "The chain creaks. A link is bending."),
        ],
        choices: [
          {
            text: 'Climb, hand over hand',
            effect: mod({ light: 1 }),
            art: '⛓️',
            outcome: [
              "You shove the heart down the front of your shirt and climb. One-handed, then two-handed, rust tearing your palms open, the heat cooking the backs of your legs.",
              "It takes forever. It takes your whole life. You haul yourself over the far edge of the broken bridge and lie on the rock sobbing, and the heart against your skin is sulking like a child denied a treat.",
              "You did it yourself. Nobody can take that from you.",
            ],
            next: 'ashen_road',
          },
          {
            text: 'Let go. Take the wings.',
            effect: mod({ hunger: 2 }),
            fx: 'flash',
            art: '🔥🪽',
            outcome: [
              "You let go.",
              "For one second you fall. Then fire erupts from your shoulder blades — two vast wings of gold flame that catch the chasm's updraft and hurl you upward, laughing, screaming, *alive*.",
              "You land on the far side and the wings fold away into sparks. But the place between your shoulders still burns, and when you touch it, the skin there is hot as a stove lid.",
            ],
            next: gate('ashen_road'),
          },
          {
            text: 'Shout for Quill',
            if: withQuill,
            art: '🦊',
            outcome: [
              { speaker: 'You', say: "QUILL!" },
              "A gold streak along the bridge's edge — and then a fox is dangling from the chain above you, three tails wrapped around a link, teeth sunk into your collar.",
              { speaker: 'Quill', say: "Mmmf mmf MMMF." },
              "Which you later learn meant *you are much heavier than you look.* He drags. You climb. Together, impossibly, you make it over the edge, and lie panting side by side on the warm black stone.",
              { speaker: 'Quill', say: "A crown. You said *a crown.* I'm never letting you forget that." },
            ],
            next: 'ashen_road',
          },
        ],
      },

      ashen_road: {
        scene: 'mountains',
        title: 'Night, Day Two — The Heart’s Loudest Hour',
        art: '👑🔥',
        mood: 'ember',
        weather: 'ash',
        fx: 'heartbeat',
        text: [
          "The Ashen Mountain rises ahead like a broken tooth, black against a sky of falling ash. At its summit, the Throne. Tomorrow's dawn is the last.",
          "And tonight the heart stops whispering. It *speaks*.",
          "*Look,* it says, and you see: Hawthorn's cottage, warm forever. Your village, where no child ever freezes. Every enemy kneeling. And you — tall, golden, a circlet of living flame on your brow — never small, never cold, never afraid again.",
          "*Aurel was a fool. It was weak. It begged a child for help. Wear me, and you will never beg anyone for anything.*",
          (s) => (s.get('hunger') >= 3 ? "Your veins are glowing under your skin now. Your reflection in a puddle of snowmelt has eyes like coals." : "Your hands are shaking. It would be so easy."),
        ],
        choices: [
          {
            text: 'Put it on. Just for a moment.',
            effect: mod({ hunger: 2 }),
            fx: 'redflash',
            art: '👑',
            outcome: [
              "You lift the heart to your brow.",
              "It flows. It *flows*, like molten gold, into a ring of fire around your head — and the world becomes small and clear and *yours*. You can feel every candle on the mountain. Every hearth in every valley. Every heart beating, warm, because you allow it.",
              "It takes everything you have to pull it off again. It comes away reluctantly, like a bandage from a wound, and leaves a ring of blisters on your forehead and an emptiness in you the size of the sky.",
            ],
            next: gate('duel'),
          },
          {
            text: "Hold Aurel's ember tear",
            if: 'tear',
            effect: mod({ hunger: -2, light: 1 }),
            art: '💧',
            outcome: [
              "You fumble the gold glass tear out of your pocket and close your fist around it.",
              "*Remember someone wept.*",
              "The vision cracks like ice. Under it, you hear Aurel — not the heart, the *god* — weeping alone in a crater for a thousand years of being feared. The heart's voice falters. For a moment, in the quiet, it sounds less like a king and more like a lonely, frightened thing.",
              "You hold it like you held the god. Gently. Not as a crown. As someone who needs carrying.",
            ],
            next: 'duel',
          },
          {
            text: 'Bury it in snow until it hushes',
            scene: 'mountains',
            effect: mod({ hunger: -1, light: -1 }),
            art: '❄️',
            outcome: [
              "You dig a hole in a drift with your bare hands and shove the heart into it and pack snow over it and *sit on it*.",
              "It hisses. It screams. The snow melts and you pack more. Far away, in every village in the world, hearth-fires gutter and shrink, and people pull their blankets tighter without knowing why.",
              "After an hour it goes quiet. You dig it out, small and sullen and dim, and carry it up the mountain while the world shivers.",
            ],
            next: 'duel',
          },
        ],
      },

      // ───────────────────────────── DAY THREE ─────────────────────────────
      duel: {
        scene: 'castle',
        title: 'Before Dawn, Day Three — The Ashen Stair',
        art: '⚔️🛡️',
        mood: 'storm',
        weather: 'ash',
        text: [
          (s) => (s.has('scouted')
            ? "You come up the stair's east side, by the crumbling ledge you marked from camp, and step out *behind* the ambush. The archers are facing the wrong way. Only one person turns."
            : "Arrows sing out of the dark and shatter on the steps at your feet — warning shots. Silver bells ring from every ledge. And at the top of the stair, alone before the Throne's gate, one person is waiting."),
          "She is tall, grey-haired at the temples, in pale armor scarred black by old burns. Her sword is drawn. Her silver mask hangs at her belt, and her face is the face of someone who has not slept in twelve years.",
          { speaker: 'Isolde Vey', say: "I am Captain Isolde Vey of the Pale Order. Twelve years ago a spark that thought it was a god fell on my village, and I buried my daughter in a box the size of a bread-chest. Give me the heart, and I will lock it where it can never choose again." },
          (s) => (s.has('hurt_wren')
            ? "Her voice drops. *My son came back from that crater with a burned face and nightmares he will have until he dies. Was that you, or was that the heart? Does it matter?*"
            : s.has('locket')
              ? "Her eyes keep flicking to the chain at your throat. *Where is my son?* she says. Her sword-hand trembles, just once."
              : s.has('sword')
                ? "Her eyes find the pale sword at your hip, and something in her face breaks. *That is my son's blade. What did you do to him?*"
                : "She does not ask your name. She does not care what it is."),
          "Behind her, the sky over the eastern peaks is turning from black to the deep blue of a bruise. Dawn is coming.",
        ],
        choices: [
          {
            text: 'Fight her',
            art: '⚔️',
            outcome: [
              "You set your feet on the ash-slick stair and raise your staff — or your stolen blade, or just your fists and the heat of the heart in your chest.",
              { speaker: 'Isolde Vey', say: "So be it." },
              "She comes down the stair like an avalanche.",
            ],
            next: 'duel_fight',
          },
          {
            text: 'Burn her where she stands',
            effect: (s) => { mod({ hunger: 2 })(s); s.set('killed_isolde'); },
            fx: 'redflash',
            art: '🔥',
            outcome: [
              "You don't let her finish. You raise the heart and the world goes white.",
              "When you can see again, there is a shape of pale enamel on the stair, glowing cherry-red, and the bells on every ledge have stopped ringing because the hands that held them have dropped them and fled.",
              "Something small and silver rolls down the steps and stops at your feet: a bell, melted into a tear-shape. The heart is so happy it hums.",
            ],
            next: gate('throne'),
          },
          {
            text: "Show her Corin's locket",
            if: 'locket',
            set: ['isolde_ally'],
            effect: mod({ light: 1 }),
            art: '📿',
            outcome: [
              "You lift the silver locket on its chain and let it swing in the firelight.",
              "Isolde makes a sound you have never heard a grown woman make. She takes it from you — her sword clattering on the stone, forgotten — and opens it with shaking fingers. Inside: a single curl of a little girl's hair, singed at the tip.",
              { speaker: 'You', say: "Corin gave it to me. He said to tell you he lived because I let him." },
              "Isolde Vey, Captain of the Pale Order, sits down on the steps of the Ashen Stair and weeps like a mother. When she stands again, she does not pick up her sword.",
              { speaker: 'Isolde Vey', say: "Then I will see what kind of fire spares a child. Walk. I'll walk with you." },
            ],
            next: 'throne',
          },
          {
            text: 'Tell her the truth of Pellam',
            if: 'old_wrong',
            art: '📖',
            outcome: [
              { speaker: 'You', say: "Aurel told me. About Pellam. It said your Order was right to be afraid. It was *ashamed*." },
              "Isolde's sword lowers an inch.",
              { speaker: 'Isolde Vey', say: "...A god that apologizes. In three hundred years of the Order's books, there is no record of that. Not one." },
              "The bells on the ledges go quiet. Every knight on the stair is listening now.",
            ],
            next: 'duel_talk',
          },
        ],
      },

      duel_fight: {
        scene: 'castle',
        title: 'Steel and Ember',
        art: '⚔️🔥',
        mood: 'storm',
        weather: 'embers',
        fx: 'shake',
        text: [
          "She is better than you. Of course she is. She has spent twelve years learning to kill fire.",
          "Her blade rings off yours, off the stone, off the air an inch from your eye. Every cut drives you higher up the stair, closer to the Throne's gate, with the dawn coming red behind her.",
          (s) => (s.has('sword') ? "Corin's sword is light in your hand, and every time it meets hers, she flinches — as if she's fighting her son's ghost." : "You block with whatever you have. It isn't enough."),
          "Then her heel slips on the ash, and for one heartbeat she's open — her throat, her heart, all of it.",
          "*NOW,* screams the heart.",
        ],
        timer: 8,
        timeout: {
          text: 'You hesitated.',
          art: '🔥',
          effect: (s) => { mod({ hunger: 2 })(s); s.set('killed_isolde'); },
          outcome: [
            "You hesitate — and the heart doesn't.",
            "It *wrenches* your arm up on its own and fire leaps from your palm, and Isolde Vey vanishes in a column of white flame without even time to scream.",
            "You didn't choose that. You're almost sure you didn't choose that. The heart beats, satisfied, and you can't tell any more where its pulse ends and yours begins.",
          ],
          next: gate('throne'),
        },
        choices: [
          {
            text: 'Disarm her — and spare her',
            set: ['spared_isolde'],
            effect: mod({ light: 1 }),
            art: '🕊️',
            outcome: [
              (s) => (withQuill(s)
                ? "A gold streak — Quill darts between her ankles — and she stumbles, and you knock her sword spinning into the dark."
                : "You hook her sword at the hilt and twist the way Hawthorn taught you to twist a stubborn jar-lid, and her blade goes spinning off the stair into the dark."),
              "She falls back against the steps. Your weapon is at her throat. The heart is *howling*.",
              { speaker: 'You', say: "No. I'm not what you're afraid of." },
              "You step back. Isolde stares up at you, breathing hard, and something in her scarred face shifts — not trust, not yet. But a question, where for twelve years there was only an answer.",
            ],
            next: 'throne',
          },
          {
            text: 'Lead her onto the cracked ledge',
            if: 'scouted',
            set: ['spared_isolde'],
            effect: mod({ light: 1 }),
            art: '🪨',
            outcome: [
              "You remember the ledge. You give ground on purpose — one step, two, east — and she follows, and the stone under her boots *groans*.",
              "It gives way. She drops, scrabbling, and you throw yourself flat and grab her wrist before the mountain can have her.",
              "For a long moment, the captain of the Pale Order hangs over the drop by your hand alone. Then you haul her up. Neither of you says anything. Neither of you needs to.",
            ],
            next: 'throne',
          },
          {
            text: 'Strike to kill',
            set: ['killed_isolde'],
            effect: mod({ hunger: 1 }),
            art: '🗡️',
            outcome: [
              "You strike.",
              "It is very quick and very quiet. Isolde Vey sits down on the step as if she's tired, and looks at the dawn, and says a name — *Linnet* — and then nothing.",
              "The heart drinks the moment like wine. You stand over her and wait to feel something, and what you feel is *warm*.",
            ],
            next: gate('throne'),
          },
          {
            text: 'Yield the heart',
            art: '🏳️',
            outcome: [
              "You drop to your knees on the ash and hold the heart out to her in both hands.",
              { speaker: 'You', say: "Take it. I can't — I can't carry it anymore. Take it." },
              "Isolde's sword comes down — not on you, but flat, gently, on your shoulder, like a knighting. She takes the heart in a gauntlet lined with silver and pale stone, and you watch its light go dim through her fingers.",
            ],
            next: 'end_cage',
          },
        ],
      },

      duel_talk: {
        scene: 'castle',
        title: 'The Captain’s Question',
        art: '❓🔥',
        mood: 'castle',
        weather: 'embers',
        text: [
          "Isolde stands between you and the gate with her sword lowered and her whole body still braced to raise it.",
          { speaker: 'Isolde Vey', say: "Words are cheap, witchling. Fire is not. I have heard sparks speak sweetly before. Show me what that thing really is." },
          (s) => (s.get('hunger') >= 3
            ? "The heart is hot and greedy in your hands, its light pulsing red. You're not sure *you* know what it really is anymore."
            : "The heart is quiet in your hands. Its light is the gold of a kitchen fire on a winter night."),
          "Dawn is a red line on the eastern peaks. There is time for one more choice before it breaks.",
        ],
        choices: [
          {
            text: 'Put the heart in her hands',
            hint: 'Let her feel it for herself.',
            effect: (s) => { if (s.get('hunger') <= 2) { s.set('isolde_ally'); mod({ light: 1 })(s); } },
            art: '🤲',
            outcome: [
              "You walk up the last steps, past her sword, and lay the god's heart in her bare palms.",
              (s) => (s.has('isolde_ally')
                ? "She braces for the burn. It doesn't come. The heart beats against her scarred fingers like a small warm bird, and Isolde Vey — who has hated fire for twelve years — feels, for the first time since her daughter died, simply *warm*. Tears cut lines through the ash on her cheeks. *Oh,* she whispers. *Oh, it's — it's only frightened.* She gives it back to you. *Walk. I'll walk with you.*"
                : "She braces for the burn — and it comes. The heart flares red in her grip, hissing *mine, mine, MINE*, and she sees in that instant exactly what you've let it become. Her face goes hard as iron. She snaps a silver gauntlet over it, and its light dies."),
            ],
            next: (s) => (s.has('isolde_ally') ? 'throne' : 'end_cage'),
          },
          {
            text: "Strike while she's listening",
            set: ['killed_isolde'],
            effect: mod({ hunger: 2 }),
            fx: 'redflash',
            art: '🗡️🔥',
            outcome: [
              "While she waits for your answer, you give her one: fire, point-blank, in the space where she had lowered her guard for you.",
              "She doesn't even raise her sword. She just looks at you, as she burns, with an expression you will never stop seeing. *Of course,* it says. *Of course. They always do.*",
              "The bells on the ledges fall silent. The heart is laughing.",
            ],
            next: gate('throne'),
          },
        ],
      },

      throne: {
        scene: 'throne',
        title: 'Dawn of the Third Day — The Ashen Throne',
        art: '🪑🔥🌅',
        mood: 'gold',
        weather: 'embers',
        fx: 'flash',
        text: [
          "The summit is a ring of black pillars around a throne of fused ash, cold and grey as a dead hearth. The sky in the east is blushing. The sun's first edge is a breath away.",
          (s) => (s.has('isolde_ally')
            ? "Isolde Vey stands at your shoulder, her mask hanging forgotten at her belt, her knights gathering in a silent pale ring behind her."
            : s.has('killed_isolde')
              ? "You are alone. Behind you on the stair, something pale is still smoking."
              : s.has('spared_isolde')
                ? "Isolde Vey has followed you up the last steps, unarmed. She stands at the edge of the ring and does not try to stop you. She is waiting to see what you are."
                : "You are alone at the top of the world."),
          (s) => (withQuill(s) ? "Quill sits on a pillar-top, tails wrapped around his paws, for once not saying anything clever." : null),
          "The heart is beating faster now, fast as a bird's. It knows where it is.",
          (s) => (s.get('hunger') >= 4
            ? "*Don't you dare,* it hisses through your bones. *Don't you DARE put me down. You are mine now, and I am yours, and we will burn so beautifully.* Your hands are glowing to the wrist."
            : s.get('hunger') >= 2
              ? "*Wear me,* it pleads. *Please. One last time. I'll make you a god.*"
              : "*Please,* it whispers, and it sounds afraid. *Don't leave me alone up here.*"),
          "The throne is waiting. The sun is rising. Choose.",
        ],
        choices: [
          {
            text: 'Set the heart upon the throne',
            art: '🤲🪑',
            outcome: [
              "You walk to the throne. You hold the heart above the cold grey seat.",
              (s) => (s.get('hunger') >= 4
                ? "And your fingers will not open. You tell them to. You *scream* at them to. They curl tighter, and the heart's light runs up your arms like ivy made of fire, and you understand, too late, that you waited too long to let go."
                : "Your fingers open. It is the hardest thing you have ever done and also the easiest. The heart drops into the throne like a seed into soil."),
            ],
            next: (s) => (s.get('hunger') >= 4 ? 'end_consumed' : 'end_rekindled'),
          },
          {
            text: 'Crown yourself',
            fx: 'redflash',
            art: '👑',
            outcome: [
              "You lift the heart to your brow, and this time, you don't pull it away.",
              "It flows into a crown of living flame. It flows into your blood. The sun breaks over the peaks and bows — the *sun* bows — and every fire in the world turns, in its hearth, to face you.",
            ],
            next: 'end_crown',
          },
          {
            text: 'Step into the fire yourself',
            if: (s) => s.get('light') >= 4,
            hint: 'The heart is too lonely to sit on a throne alone.',
            art: '🔥🧍',
            outcome: [
              "You understand, all at once, what the heart has wanted the whole time. Not to be worn. Not to be delivered. Not to be *alone*.",
              "You sit down on the Ashen Throne, and you hold the god's heart against your own, and you let them become one heart.",
            ],
            next: 'end_become',
          },
          {
            text: 'Break the heart and share it',
            if: secretReady,
            hint: "A heart can be broken without being destroyed.",
            art: '💔✨',
            outcome: [
              "The Bridgekeeper's words ring in your head. *The Throne was made for one. It does not have to stay that way.*",
              "You turn your back on the throne. You hold the heart in both hands, and you look at Isolde, and you *break it* — gently, the way you'd break bread at a table.",
            ],
            next: 'end_shared',
          },
        ],
      },

      // ───────────────────────────── ENDINGS ─────────────────────────────
      end_rekindled: {
        scene: 'dawn',
        art: '🌅🔥',
        mood: 'dawn',
        weather: 'embers',
        ending: { id: 'rekindled', title: 'The World Rekindled', type: 'good' },
        text: [
          "The throne catches. Grey ash turns gold, then white, then a light you have no word for, and a pillar of fire climbs from the summit straight into the dawn.",
          "Far below, in every valley, every hearth that had burned low these three days *roars* back to life. Your village. Hawthorn's cottage. Marrow's turtle-hut steaming in the reeds. Ten thousand kitchens at once.",
          { speaker: 'Aurel', say: "Little candle. You carried me all the way. Thank you." },
          (s) => (s.has('killed_isolde')
            ? "You go down the mountain alone, past the pale shape on the stair. The world is warm again. You are not, quite. Some nights you'll wake and feel the heart's last laugh still curled in your hands."
            : s.has('isolde_ally') || s.has('spared_isolde')
              ? "Isolde Vey watches the fire climb into the sky, and her face does something complicated. Then she nods to you, once, as one soldier to another, and leads her knights down the mountain. Their bells, for the first time in three hundred years, are silent."
              : "You walk down the mountain into a morning that smells of woodsmoke and bread."),
          (s) => (s.has('lost_memory') ? "You still can't remember your mother's face. But when you get home, Hawthorn has porridge on — burned, as always — and that face you'll never forget." : null),
          (s) => (s.has('nameless') ? "The songs they'll sing about this never use your name. You gave it to the river. They call you *the Apprentice*, and somehow it's enough." : null),
          (s) => (withQuill(s) ? "Quill trots beside you all the way home, complaining, and moves into Hawthorn's woodshed, and never, ever leaves." : null),
          "The world's fire burns on. You did that. A hedge-witch's apprentice from a mountain village, who was told to touch nothing that hums.",
        ],
      },

      end_crown: {
        scene: 'throne',
        art: '👑🔥',
        mood: 'blood',
        weather: 'embers',
        fx: 'redflash',
        ending: { id: 'ember-crown', title: 'The Ember Crown', type: 'bad' },
        text: [
          "You are a god now. It is everything the heart promised. That is the problem.",
          "Every fire in the world is yours. Every hearth, every candle, every forge and funeral pyre. They burn when you allow it. They go out when you're displeased. Kings send you tribute. Villages sing your name — " ,
          (s) => (s.has('nameless') ? "— or would, if you had one. They call you *the Crowned Ember* instead, and you burn the first priest who gets it wrong." : "— the name your mother gave you, which you have started to forget."),
          (s) => (s.has('killed_isolde') ? "The Pale Order rings its bells against you for a generation. You melt every one. You keep the first, the tear-shaped one from the stair, on your mantel, and do not remember why." : "The Pale Order rings its bells against you. You melt every one."),
          (s) => (s.has('tear') ? "Somewhere in your old coat, forgotten, is a bead of gold glass. You never find it. If you had, you might have remembered that the last god who wore this crown wept alone in a crater for a thousand years." : null),
          "Three hundred years from now, a star will fall into a pine forest. Inside the crater, something made of embers will beg a frightened child for help.",
          "And it will be you.",
        ],
      },

      end_consumed: {
        scene: 'void',
        art: '🔥💀',
        mood: 'blood',
        weather: 'ash',
        fx: 'redflash',
        ending: { id: 'consumed', title: 'Ash in the Shape of You', type: 'death' },
        text: [
          "It happens quietly, in the end. No explosion. No scream.",
          "The glow in your fingertips reaches your wrists, your elbows, your heart. You feel the god's heart stop beating *in* your hands and start beating *as* your hands. It is not a king, after all. It is only hunger — a hunger so old it forgot it was ever anything else — and you fed it until there was nothing left to feed it but you.",
          (s) => (s.has('hurt_wren') ? "Your last clear thought is of a freckled boy with your handprint on his cheek. You'd say sorry, if you still had a mouth." : null),
          (s) => (s.has('quill') && !s.has('quill_burned') ? "Somewhere far off, a fox howls, which foxes don't do." : null),
          "When the knights find the place, there is a shape of fine white ash kneeling in the snow, exactly where you stood. It holds its cupped hands out, as if offering something.",
          "The hands are empty. The heart is gone — burrowed down into the mountain to sleep, and wait, and whisper, for the next pair of hands.",
          "The world's fires go out one by one that winter. Nobody ever learns your name.",
        ],
      },

      end_become: {
        scene: 'dawn',
        art: '☀️🧍',
        mood: 'dawn',
        weather: 'sparkles',
        ending: { id: 'become-fire', title: 'Become the Dawn', type: 'true' },
        text: [
          "It doesn't hurt. You thought it would hurt.",
          "It feels like coming home. Your heartbeat and the god's fall into step — one, two, one, two — and then there is only one heart, and it is warm, and it is *yours*, and it was never hungry. It was only lonely. It only ever wanted to be *held*.",
          { speaker: 'Aurel', say: "Oh, little candle. You didn't have to. You didn't have to." },
          { speaker: 'You', say: "I know. I wanted to." },
          "The sun rises out of your chest.",
          "That is what they'll say, anyway, in the songs. That on the third dawn a hedge-witch's apprentice sat on the Ashen Throne and *became* the morning, and every fire in the world has had a little of their warmth in it ever since.",
          (s) => (s.has('isolde_ally') || s.has('spared_isolde') ? "Isolde Vey carries the news down the mountain herself. She takes off her silver mask and never puts it back on. Years later, Corin hangs a candle in every window of the Order's halls, and nobody rings a bell at a fire again." : null),
          (s) => (s.has('tear') ? "Hawthorn finds a bead of gold glass on her doorstep that morning, still faintly warm. She keeps it on a string around her neck until she dies." : "Hawthorn sits on her doorstep that morning, watching the sun, and weeps without knowing why."),
          (s) => (withQuill(s) ? "And on cold nights, the fox who carried a god's messages curls up beside any hearth he likes, and the fire always burns a little brighter for him." : null),
          "You're in every candle now. Every kitchen. Every lantern carried through a dark wood. You're never cold. You're never alone.",
          "Neither is anyone else.",
        ],
      },

      end_shared: {
        scene: 'throne',
        art: '🕯️🕯️🕯️',
        mood: 'gold',
        weather: 'sparkles',
        fx: 'flash',
        ending: { id: 'every-hearth', title: 'Every Hearth a Throne', type: 'secret' },
        text: [
          "The heart breaks into a thousand sparks, and none of them goes out.",
          "You give the first to Isolde Vey. She stares at the little flame dancing in her scarred palm, and it doesn't burn her, and it doesn't ask her for anything. It just keeps her warm. She opens Corin's locket and holds the spark up to the singed curl of her daughter's hair, and the curl glows gold, and she laughs — a sound nobody in the Pale Order has heard her make in twelve years.",
          { speaker: 'Isolde Vey', say: "It doesn't want to rule. It just wants to be *shared*." },
          "Then her knights are kneeling, pale enamel on black ash, and you're pressing sparks into their gauntlets one by one. They take off their masks. They are just people. They were always just people, children of children who saw a fire think, and were afraid.",
          { speaker: 'Aurel', say: "Three hundred years I burned alone on that throne, little candle. And you — you broke me into a thousand pieces and I've never been more whole." },
          "The Bridgekeeper was right. The Throne was made for one. It's empty now, forever — because the fire belongs to everyone.",
          (s) => (withQuill(s) ? "Quill gets a spark too. He carries it to a cold village he once stole fire for, two hundred years ago, and this time no one casts him out." : null),
          (s) => (s.has('nameless') ? "Marrow gives you your name back, in the end — swaps it for a spark of her own, the first warm thing on her river in three centuries. She says it tastes better now." : null),
          "The Pale Order rings its bells one last time, to call every village to the mountain. They come down with candles. They carry the fire home.",
          "From that day on, every hearth is a throne, and every hand that tends it is a god's. Nobody hunts fire. Nobody hoards it. It grows, as all true treasures do, by being given away.",
        ],
      },

      end_cage: {
        scene: 'village',
        art: '❄️🔒',
        mood: 'ice',
        weather: 'snow',
        ending: { id: 'long-winter', title: 'The Long Winter', type: 'bad' },
        text: [
          "They carry the heart down the mountain in a box of silver and pale stone, and lock it in the deepest vault of the Pale Order, under a hundred ringing bells.",
          "Isolde Vey is not cruel about it. She lets you walk free. She even sends a knight to see you home.",
          { speaker: 'Isolde Vey', say: "You'll thank me. No more cities burning. No more daughters in bread-boxes. Mortal fire is enough." },
          "For a year, it is. Then hearths start burning lower. Candles gutter. Forges won't get hot enough to work iron. The winters stretch long and grey into the summers, and the Order's scholars write very calm reports about it.",
          (s) => (s.has('locket') ? "You still have Corin's locket. You never got the chance to give it back. Some nights you open it and look at the singed curl inside and wonder if Isolde knew, when she locked the heart away, that she was burying another child." : null),
          (s) => (s.has('lost_memory') ? "You can't remember your mother's face. Soon you can't remember what summer felt like either." : null),
          "Ten years later, the snow doesn't melt at all. On the coldest night of the coldest year, you hear it — far away, deep under the mountain, beneath a hundred bells — a heart, still beating, very faintly, calling your name.",
          "It is too late to answer.",
        ],
      },

      end_fox: {
        scene: 'cottage',
        art: '🦊🔥',
        mood: 'void',
        weather: 'sparkles',
        ending: { id: 'fox-supper', title: 'The Fox’s Supper', type: 'neutral' },
        text: [
          "You find your way out of the fox road three days later, starving, half-blind, on the wrong side of the mountains.",
          "By then it's done. On the dawn of the third day, the world's fires didn't go out. They *flickered* — every hearth, every candle, all at once — and then came back burning a little greener than before. A little quicker. A little sly.",
          "Quill ate the heart. Of course he did.",
          "He is a god now — a small, clever, insufferable god of hearths and chimneys and stolen warmth. Fires behave strangely in his world. A candle might go out just to spite you, or blaze up to warm a beggar the moment a rich man's back is turned. Cooks swear their stove-flames giggle.",
          (s) => (s.has('lost_memory') ? "You gave away your mother's face to get him there. Sometimes you think he knows that, and is ashamed." : null),
          "Some winter nights, when your own fire's burning low, it suddenly roars up warm and gold for no reason at all, and in the crackle you could swear you hear someone say: *Sorry, candle. A fox is a fox. But I never forgot who carried it first.*",
          "It is not the ending Aurel wanted. But the world is warm. Mostly. When it feels like it.",
        ],
      },
    },
  });
})();
