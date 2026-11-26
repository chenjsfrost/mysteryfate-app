/* MysteryFate story: The Keeper’s Log (horror) */
(function () {
  'use strict';

  // Meter helpers: add n and clamp to 0..5.
  const clamp = (k, n) => (s) => s.setVar(k, Math.max(0, Math.min(5, s.get(k) + n)));
  const S = (n) => clamp('sanity', n);
  const O = (n) => clamp('oil', n);
  const both = (...fns) => (s) => fns.forEach((f) => f(s));
  // Secret: the clapper from the cave + believed Tobias on the stairs + wrote him home in the log.
  const secretReady = (s) => s.has('clapper') && s.has('trusted_tobias') && s.has('wrote_home');

  registerStory({
    id: 'keepers-log',
    title: 'The Keeper’s Log',
    category: 'horror',
    tagline: 'The last keeper vanished. His logbook didn’t stop writing.',
    description:
      'You are the relief keeper on Hollin Skerry, a lighthouse eleven miles from anywhere. The last keeper walked into the fog on his third night — and his logbook is still writing, in fresh ink, about what you are going to do next. Three nights. One lamp. The fog comes closer every dark.',
    cover: '🌫️',
    accent: '#4fb3bf',
    ambient: 'horror',
    warning: 'Contains: drowning, the drowned dead, isolation, psychological horror.',
    vars: { oil: 3, sanity: 4 },
    flags: [],
    hud: [
      { var: 'oil', label: 'Lamp Oil', icon: '🛢️', max: 5 },
      { var: 'sanity', label: 'Sanity', icon: '🧠', max: 5 },
    ],
    scene: 'lighthouse',
    voices: {
      narrator: { gender: 'male', pitch: 0.8, rate: 0.9, accent: 'en-GB', note: 'low, weathered sea-story teller by a peat fire' },
      'Harrow': { gender: 'male', pitch: 0.5, rate: 0.8, accent: 'en-GB', note: 'old boatman, gruff, voice like a hull on shingle' },
      'The Log': { gender: 'neutral', pitch: 0.45, rate: 0.72, volume: 0.6, note: 'dry papery whisper of ink, no emotion' },
      'Radio': { gender: 'male', pitch: 1.3, rate: 1.4, accent: 'en-IE', note: 'young panicked skipper shouting over wind and static' },
      'Coastguard': { gender: 'female', pitch: 1.1, rate: 1.2, accent: 'en-GB', note: 'brisk, distant, professional radio operator' },
      'Tobias': { gender: 'male', pitch: 1.05, rate: 0.85, accent: 'en-IE', volume: 0.65, note: 'drowned keeper, gentle, tired, kind' },
      'The Choir': { gender: 'neutral', pitch: 0.35, rate: 0.6, volume: 0.6, note: 'the drowned, many voices in one, coaxing and sad' },
    },
    start: 'intro',
    scenes: {
      // ------------------------------------------------------------------ DAY ONE
      intro: {
        title: 'Day One — 4:00 PM, The Landing',
        art: '⛵🌊',
        mood: 'sea',
        scene: 'sea',
        text: [
          'The engine coughs once and dies, and in the sudden quiet you can hear the rock breathing.',
          'Hollin Skerry. Forty yards of black stone, eleven miles from anything, and on top of it a white tower with a red cap, standing like a candle somebody forgot to blow out.',
          'Your contract says four weeks. The last keeper, Tobias Venn, managed three nights of his. Nobody has found him. The Board sent you a train ticket and a letter that used the word *unfortunate* twice.',
          'Harrow, the boatman, holds the hull against the landing with one boot. His hands are wet. They have been wet the whole crossing, though not one drop of spray came over the bow.',
          { speaker: 'Harrow', say: 'Off you get, then. I don’t tie up at the Skerry. Not ever.' },
          'On the stern, under a coat of new paint, you can still make out the ghost of an older name: **M—GAR— ANN.** The new paint says *PATIENCE*.',
          'Out on the western horizon, low and white and perfectly still, lies a bank of fog. It wasn’t there when you left the harbour.',
        ],
        choices: [
          {
            text: 'Ask him what happened to Tobias.',
            hint: 'He brought him out here. He must know something.',
            set: ['harrow_rule'],
            art: '🧓',
            outcome: [
              'Harrow looks up at the tower for a long time before he answers, the way you look at a dog that has bitten somebody.',
              { speaker: 'Harrow', say: 'Tobias kept the light two nights proper. Third night he let it go dark. That’s all anyone knows.' },
              { speaker: 'Harrow', say: 'So here’s the rules, and they’re free. Keep the light lit, every minute of dark. Don’t open the door at the bottom after sundown, whatever knocks. And that book of his — don’t you go believing it.' },
              'You ask him what book. He is already pushing off.',
            ],
            next: 'cottage',
          },
          {
            text: 'Haul the spare oil drum up yourself.',
            hint: 'The manifest says three drums. There are four in the boat.',
            effect: O(1),
            art: '🛢️',
            outcome: [
              'The fourth drum isn’t on your manifest. It’s older than the others, the stencil half rusted away, and when you heave it onto the landing it sloshes heavy and full.',
              'Harrow watches you roll it up the slipway and says nothing. Only when you reach the top does he call after you: *“Burn that one first. Old oil goes bad if it sits.”*',
            ],
            next: 'cottage',
          },
          {
            text: 'Take the flare pistol from his locker.',
            hint: 'The locker’s hanging open. Nobody should be out here without one.',
            set: ['flare'],
            art: '🔫',
            outcome: [
              'The orange pistol lies in the open locker beside three cartridges wrapped in wax paper. You take it before you can talk yourself out of it.',
              'Harrow sees. You wait for the shout. Instead he nods slowly, as if you’ve answered a question he never asked out loud.',
              { speaker: 'Harrow', say: 'Take it. Tobias didn’t.' },
            ],
            next: 'cottage',
          },
        ],
      },

      cottage: {
        title: 'Day One — The Keeper’s Cottage',
        art: '🏚️📓',
        mood: 'fog',
        scene: 'cottage',
        text: [
          'The keeper’s cottage squats at the foot of the tower, joined to it by a short stone passage. One room. A stove gone cold. A bunk with the blankets thrown back.',
          'Tobias’s tea is still on the table. There’s a skin of mould on it shaped like a coastline.',
          'Beside the mug lies the logbook: green cloth, swollen with damp, a pencil tucked into its spine. You open it to the last page with writing on it.',
          { speaker: 'The Log', say: '*Night three. Fog at the rail. They are singing in my mother’s voice. I am going to keep the light. I am going to keep the*' },
          'It stops there. Mid-word. And below it, in fresh ink — so fresh it shines — somebody has written a new entry. Today’s date.',
          { if: 'harrow_rule', speaker: 'The Log', say: '*Relief keeper landed four o’clock. Asked after me. That was kind. He will read this and he will not believe it.*' },
          { if: '!harrow_rule', speaker: 'The Log', say: '*Relief keeper landed four o’clock. Did not ask after me. He will read this and he will not believe it.*' },
          'You touch the ink. It comes away on your fingertip, wet and black. There is nobody else on the rock.',
        ],
        choices: [
          {
            text: 'Read the log from the very beginning.',
            hint: 'Learn the place. Learn the man.',
            set: ['read_log'],
            art: '📖',
            outcome: [
              'Tobias wrote small and neat at first. A careful, lonely man talking to the only listener he had.',
              'Then, his first night, a line in capitals: **FOG BANK ONE MILE WEST. DOES NOT MOVE WITH THE WIND.** Second night: *Half a mile. A ship’s bell in it. There is no ship.* Pasted inside the back cover is a yellowed clipping: **TRAWLER LOST ON HOLLIN SKERRY — SEVEN MEN — 1952. LIGHTHOUSE FOG BELL FOUND SILENT.**',
              'In the margin, Tobias has underlined *silent* three times.',
            ],
            next: 'lamp_night1',
          },
          {
            text: 'Search the unmade bunk.',
            hint: 'A man leaves more of himself in his bed than in his book.',
            set: ['harrow_clue'],
            art: '🛏️',
            outcome: [
              'Under the pillow: a tobacco tin, a rosary with half its beads, and a photograph in a cardboard frame. Seven men in oilskins grinning on a harbour wall, and behind them a trawler. Her name is plain on the bow: **MARGARET ANN.**',
              'The man in the middle, the skipper, has his arms around the others like they’re his sons. Thick shoulders. A face like weathered oak. You know that face. You spent two hours on a boat with it this afternoon.',
              'On the back, in pencil: *Crew of the Margaret Ann, spring 1952.* And under it, in Tobias’s neat hand: **HE HASN’T AGED A DAY.**',
            ],
            next: 'lamp_night1',
          },
          {
            text: 'Shove the log into the stove and burn it.',
            hint: 'You didn’t come out here to be haunted by stationery.',
            set: ['burned_log'],
            effect: S(-1),
            fx: 'flash',
            art: '🔥',
            outcome: [
              'You stuff the log into the stove with a fistful of kindling and strike a match. The green cloth catches.',
              'You watch until there’s nothing but ash. You feel better. You feel much better.',
              'An hour later, at the top of the tower, you find the logbook lying open on the lamp-room desk. Dry. Whole. With a new line at the bottom of the page: *He burned me. Tobias did too.*',
            ],
            next: 'lamp_night1',
          },
        ],
      },

      // ---------------------------------------------------------------- NIGHT ONE
      lamp_night1: {
        title: 'Night One — 9:00 PM, The Lamp Room',
        art: '💡🌫️',
        mood: 'night',
        scene: 'lamp-room',
        text: [
          'Ninety-one steps up the spiral to the lamp room. At the top: a brass-bound lens taller than you, a squat paraffin burner at its heart, and windows on every side looking out on nothing but sea and dark.',
          'Except to the west. To the west, a mile out, the fog sits on the water like a wall of wet chalk. The wind is blowing straight at it. It hasn’t moved.',
          {
            if: (s) => s.get('oil') >= 4,
            text: 'Four drums of oil in the store, counting the old one. You have a feeling you will need every drop.',
            else: 'Three drums of oil in the store. The manifest called that *ample*. The manifest was written on the mainland.',
          },
          'The logbook lies on the desk beside the burner. You didn’t carry it up. Somebody has turned it to a fresh page.',
          { speaker: 'The Log', say: '*Night one. He lit the lamp at nine. The fog watched him do it.*' },
          'The clock on the wall says 8:59.',
        ],
        choices: [
          {
            text: 'Light it by the book: full wick, all night.',
            hint: 'Do the job. The job is the only thing out here that’s real.',
            effect: O(-1),
            art: '🔥',
            outcome: [
              'You prime the burner, light the mantle and wind the clockwork. The great lens begins to turn, slow as a planet, and the beam swings out over the water — white, clean, enormous.',
              'Every time it sweeps the fog bank, the fog *flinches*. You see it. A ripple runs through the white wall, like a horse shivering off a fly.',
            ],
            next: 'radio_call',
          },
          {
            text: 'Trim the wick low. Make the oil last.',
            hint: 'Three nights. Do the arithmetic.',
            effect: S(-1),
            art: '🕯️',
            outcome: [
              'You turn the wick down to a sullen orange glow. The lens turns, but the beam that leaves the tower is thin and yellow, a candle in a cathedral.',
              'Between sweeps, the dark comes right up to the glass. And out on the water you hear a sound you can’t place — then can. Oars. A lot of oars, dipping in time.',
              'When the beam swings round again, there is nothing on the sea. You save half a drum of oil. You lose something harder to measure.',
            ],
            next: 'radio_call',
          },
          {
            text: 'Light it, then take the telescope out onto the gallery.',
            hint: 'You want to see what you’re up against.',
            effect: both(O(-1), S(-1)),
            art: '🔭',
            outcome: [
              'You light the lamp full and step out onto the iron gallery that rings the top of the tower. You brace the telescope on the rail and point it west.',
              'At the foot of the fog bank, where it meets the sea, people are standing on the water. Seven of them. Oilskins, sou’westers, faces turned up toward the tower. Every time the beam passes over them they lift their arms, like men cheering a ship home.',
              'Every time the beam passes, they are a little closer.',
            ],
            next: 'radio_call',
          },
        ],
      },

      radio_call: {
        title: 'Night One — 11:40 PM',
        art: '📻',
        mood: 'night',
        scene: 'lamp-room',
        text: [
          'The radio on the shelf has been dead all evening. At twenty to midnight, it clears its throat.',
          'A hiss like surf. Then a man’s voice, young and ragged, shouting over a wind you can’t feel:',
          { speaker: 'Radio', say: 'Hollin Skerry, Hollin Skerry, this is the Margaret Ann! We’ve lost our bearings, we’re in thick fog — we can’t see your light! Is anybody keeping the light? Over!' },
          'You look at the lamp. It is burning. The beam is sweeping straight through the fog, right where that voice must be.',
          { if: (s) => s.has('harrow_clue') || s.has('read_log'), text: '*Margaret Ann.* You have already met that name tonight. You know how her story ends.' },
          'On the desk, the pencil has rolled to the edge of the logbook. There is a new line on the page that wasn’t there a breath ago.',
          { speaker: 'The Log', say: '*He answered.*' },
          { speaker: 'Radio', say: 'Please. Anybody. Over.' },
        ],
        choices: [
          {
            text: 'Pick up the handset and answer.',
            hint: 'Men are drowning. Maybe. You can’t not answer.',
            set: ['answered_radio'],
            art: '🎙️',
            outcome: [
              'You key the handset. Your voice sounds very small. *“Margaret Ann, this is Hollin Skerry. The light is lit. I can’t see you. Where are you?”*',
              'A silence full of hiss. Then the young man laughs with enormous relief. *“Oh, thank God. Thank God. Who’s that, then? You’re not Tobias.”*',
              'You tell him your name before you think about it. On the desk, the pencil twitches — as if it’s writing it down.',
            ],
            next: 'radio_talk',
          },
          {
            text: 'Switch the set off.',
            hint: 'Whatever that is, it isn’t a ship.',
            effect: S(-1),
            art: '🔇',
            outcome: [
              'You twist the knob hard. The voice stops in the middle of *please*.',
              'Silence. Then the radio clicks back on by itself, just long enough for the young voice to say, quite calmly: *“That’s all right. We’ll come to the door.”*',
            ],
            next: 'base_door',
          },
          {
            text: 'Write in the log: *He did not answer.*',
            hint: 'If it can write what you do… can you write it back?',
            art: '✏️',
            outcome: [
              'You snatch up the pencil, cross out *He answered*, and write beneath it in hard block capitals: **HE DID NOT ANSWER.**',
              'The radio cuts out mid-word. Not switched off — *cut*, like a rope. The silence that follows is total.',
              'Then, from ninety-one steps below you, from the iron door at the foot of the tower, comes a sound that carries all the way up the stairwell. *Knock. Knock. Knock.*',
              'The log has written one more line, in a hand that is not quite yours: *Then we will knock.*',
            ],
            next: 'base_door',
          },
        ],
      },

      radio_talk: {
        title: 'Night One — The Voice on the Water',
        art: '📻🌊',
        mood: 'fog',
        scene: 'lamp-room',
        text: [
          'He talks fast, the way frightened men talk. His name is Jonah, he says. Skipper. Twenty-six. He has six lads aboard and the youngest is fifteen and seasick.',
          { speaker: 'Radio', say: 'We see your light now, we do! It’s grand, it’s beautiful. Only — the lads are cold, keeper. They’re so cold. Will you come down and open the door for us? Just for a warm?' },
          'Through the west windows, the fog has moved. Not drifted — *moved*, all at once, the way a crowd surges when a gate opens. A quarter of a mile closer in a single breath.',
          { if: 'harrow_clue', text: 'Jonah. Skipper. Thick shoulders, a face like weathered oak. The voice on the radio is young, but you know its vowels. You spent two hours on a boat listening to them.' },
        ],
        choices: [
          {
            text: 'Talk them away: “Steer south, Jonah. Away from the rock.”',
            hint: 'If they’re real, it saves them. If they’re not, it costs nothing.',
            effect: S(1),
            art: '🧭',
            outcome: [
              'You give him a heading, as calm as you can — south by south-west, away from the reef, out toward open water.',
              'A long pause. Then, gently, like explaining something to a child: *“There’s no south, keeper. There’s only your light. We’ve been steering for it a long, long time.”*',
              'But the voice fades, and the fog stops where it is, and for the rest of the night the shapes on the water keep their distance. You did something. You’re not sure what.',
            ],
            next: 'day2',
          },
          {
            text: 'Ask him: “Jonah who?”',
            hint: 'You need to hear him say it.',
            set: ['harrow_clue'],
            art: '❓',
            outcome: [
              '*“Harrow,”* he says, puzzled. *“Jonah Harrow, skipper of the Margaret Ann, out of Kilbride. Why?”*',
              'The man who brought you here this afternoon. Old, wet-handed, refusing to tie up. You hear yourself ask him what year it is, out there.',
              'The radio goes very quiet. When the voice comes back it is older — decades older — rough as tarred rope. *“You weren’t meant to ask that, keeper. Keep your light. I’ll see you on the third night.”* Then nothing but hiss until dawn.',
            ],
            next: 'day2',
          },
          {
            text: 'Tell him the truth: “Jonah, you sank in 1952.”',
            hint: 'Somebody has to.',
            if: (s) => s.has('read_log') || s.has('harrow_clue'),
            effect: S(-1),
            fx: 'glitch',
            art: '💀',
            outcome: [
              'You say it as gently as you can. *“Jonah. The Margaret Ann went down on this rock in 1952. Seven men. I’m so sorry.”*',
              'The hiss stops. In the dead silence the voice says, perfectly level: *“Then why does the light still call us?”*',
              'All along the west windows, the glass mists over from the outside — seven patches of breath, at the height of seven faces. They fade slowly. You don’t sleep.',
            ],
            next: 'day2',
          },
          {
            text: 'Kill the set mid-sentence.',
            hint: 'You can’t listen to one more word of this.',
            effect: S(-1),
            art: '🔇',
            outcome: [
              'You wrench the knob. His voice snaps off in the middle of *cold*.',
            ],
            next: 'base_door',
          },
        ],
      },

      base_door: {
        title: 'Night One — The Door at the Bottom',
        art: '🚪💧',
        mood: 'night',
        scene: 'stairwell',
        fx: 'heartbeat',
        timer: 8,
        text: [
          '*Knock. Knock. Knock.* Iron on iron, slow and patient, from the foot of the tower.',
          'You go down with the hurricane lamp because you can’t stand not to. Ninety-one steps. At the bottom, the door: iron, studded, with a bolt as thick as your wrist. The bolt is *drawn back*. You didn’t leave it that way.',
          'Seawater is pooling under the door, spreading across the flagstones toward your boots.',
          { if: 'harrow_rule', text: '*Don’t open the door at the bottom after sundown, whatever knocks.*' },
          {
            if: 'answered_radio',
            text: 'Then a voice through the iron, young and cold, says your name. You told it your name.',
            else: 'Then a voice through the iron, young and cold, says: *“Toby? Toby, is that you? Let us in, Toby.”*',
          },
          'The handle begins, very slowly, to turn.',
        ],
        timeout: {
          effect: S(-2),
          art: '😱',
          outcome: [
            'You can’t move. You watch the handle turn all the way round, and the door swings open one inch — and stops against the toe of your boot, which you don’t remember putting there.',
            'Through the gap comes air so cold it burns, the smell of deep water, and a whisper: *“Not yet, then.”* The door eases shut. Your boot is soaked through, and the water inside it is moving.',
            'You shoot the bolt with numb fingers and sit on the bottom step until the sky goes grey.',
          ],
          next: 'day2',
        },
        choices: [
          {
            text: 'Slam the bolt home and throw your weight on the door.',
            hint: 'Iron and muscle. Keep it simple.',
            effect: S(-1),
            fx: 'shake',
            art: '🔩',
            outcome: [
              'You hit the door with your shoulder and drive the bolt across. On the other side, something leans back — a weight like the whole sea pressing.',
              'The hinges groan. The bolt bends, very slightly. Then the pressure eases, and you hear wet footsteps going away across the rock.',
            ],
            next: 'day2',
          },
          {
            text: 'Shout through the door: “Who’s there?”',
            hint: 'Make it say what it is.',
            set: ['answered_radio'],
            effect: S(-1),
            art: '🗣️',
            outcome: [
              'You shout it. The knocking stops at once.',
              '*“Who’s there?”* says a voice on the other side — your voice, your exact words, your exact fear. Then it says your name back to you, carefully.',
              { if: 'harrow_rule', text: 'Harrow said *whatever knocks*. He never said *don’t talk to it*. You realise now he didn’t think he had to.' },
              'Footsteps go away across the rock. You shoot the bolt home. Your name echoes up the stairwell for a long, long time.',
            ],
            next: 'day2',
          },
          {
            text: 'Leave it. Climb back up and tend the light.',
            hint: 'The rule says don’t open it. It doesn’t say stand here and listen.',
            effect: (s) => { if (!s.has('harrow_rule')) S(-1)(s); },
            art: '⬆️',
            outcome: [
              'You turn your back on the door. It is the hardest thing you have ever done. Behind you the handle turns all the way round, and stops, and turns again.',
              'Ninety-one steps. You count them out loud. The knocking follows you up the stairwell, always exactly one step below you.',
            ],
            next: 'day2',
          },
        ],
      },

      // ------------------------------------------------------------------ DAY TWO
      day2: {
        title: 'Day Two — The Footprints',
        art: '👣🌫️',
        mood: 'fog',
        scene: 'lighthouse',
        text: [
          'Dawn comes grey and grudging. The fog has not gone back. It sits half a mile off now, along the outer reef, a white wall from the sea to the sky.',
          'There are footprints on the stairs. Bare, wet, crusted with salt, too many toes on some of them. They start at the door at the bottom and climb all ninety-one steps — and stop, neatly, at the lamp-room hatch. As if whoever made them stood there all night, listening to you breathe.',
          {
            if: (s) => s.get('oil') <= 2,
            text: 'You check the store. Less oil than you’d like. A lot less.',
            else: 'You check the store. Enough oil, if nothing goes wrong. Something always goes wrong.',
          },
          'The log is open on the desk. Last night has been written up in a tidy hand — the lamp, the radio, the knocking, all of it. And below that, today:',
          { speaker: 'The Log', say: '*Day two. He will go looking for me.*' },
          'Low tide is at ten. There are three things a person can do with a grey day on a rock.',
        ],
        choices: [
          {
            text: 'Climb down to the sea cave at low tide.',
            hint: 'Below the tower there’s a gully that only opens when the tide goes out.',
            art: '🕳️',
            scene: 'cave',
            outcome: [
              'The iron rungs down the seaward face are slick with weed. At the bottom, a cleft in the rock gapes like a mouth with the tide pulled out of it.',
            ],
            next: 'cave',
          },
          {
            text: 'Search the store room for the old logbooks.',
            hint: 'If this has happened before, somebody wrote it down.',
            art: '📚',
            scene: 'library',
            outcome: [
              'The store room under the stairs holds paraffin, rope, tinned peaches — and, on three shelves at the back, logbooks. Dozens of them.',
            ],
            next: 'archive',
          },
          {
            text: 'Call the mainland and demand a boat.',
            hint: 'Contract or no contract. You want off.',
            art: '📻',
            scene: 'lamp-room',
            outcome: [
              'In daylight the radio behaves itself. You spin the dial to the coastguard frequency and key the handset with a hand that won’t stay still.',
              'The hiss parts. A woman’s voice, brisk, very far away.',
            ],
            next: 'radio_harrow',
          },
        ],
      },

      cave: {
        title: 'Day Two — The Gully',
        art: '🕳️🔔',
        mood: 'sea',
        scene: 'cave',
        text: [
          'The cleft narrows to a tunnel, then opens into a chamber the size of a chapel. The hurricane lamp throws your shadow huge across the walls.',
          'The walls are scratched with tallies. Groups of three, always three. Hundreds of them, from the waterline up to the height of a man’s reach.',
          'Wedged between two boulders lies half a wooden boat — a trawler’s tender, planks furred green, a name stencilled on the transom: **M. ANN — KILBRIDE.** Beside it sits a dented can of paraffin, still sealed.',
          'And on a ledge, laid out as neatly as on an altar: a heavy iron clapper as long as your forearm, the kind that hangs inside a bell. Somebody has wrapped it in an oilskin. Stencilled on the oilskin: **T. VENN.**',
          { if: 'read_log', text: '*Lighthouse fog bell found silent.* The clapper of the tower’s own bell. The bell they never heard.' },
          'Behind you, the sea draws a long breath in. The tide has turned. You have time to carry one thing back up the rungs.',
        ],
        choices: [
          {
            text: 'Take the bell clapper.',
            hint: 'Tobias wrapped it like it mattered.',
            set: ['clapper'],
            art: '🔔',
            outcome: [
              'It is as heavy as a child. You sling it over your shoulder in Tobias’s oilskin and start back.',
              'As you leave the chamber, the cave rings. In the water behind you, something rises to listen.',
            ],
            next: 'night2',
          },
          {
            text: 'Take the sealed can of paraffin.',
            hint: 'Oil is light. Light is life out here.',
            effect: O(1),
            art: '🛢️',
            outcome: [
              'You heave the can onto your shoulder. It’s full — you can hear it slosh — and the seal is stamped with a date. *1952.*',
              'As you wade out, the water around your shins turns suddenly warm, like a bath, like a hand. It does not grip. It only lets you feel that it could have.',
            ],
            next: 'night2',
          },
          {
            text: 'Follow the tallies deeper into the dark.',
            hint: 'Whoever scratched those was counting something.',
            set: ['harrow_clue'],
            effect: S(-1),
            art: '🕯️',
            outcome: [
              'The tallies lead you along a ledge into a narrower chamber, where the sea has left a pool, perfectly still, perfectly black.',
              'Nailed to the rock above it is a ship’s crew board, the paint mostly gone. Seven names. The first: **J. HARROW — SKIPPER.** Beneath it, somebody has scratched a newer line into the stone: *HE FERRIES THE KEEPERS. ASK HIM WHY. — T.V.*',
              'In the black pool your reflection holds up the lamp. Behind it, in the water, seven faces wait. You run. The tide is at your knees by the time you reach the rungs.',
            ],
            next: 'night2',
          },
        ],
      },

      archive: {
        title: 'Day Two — The Store Room',
        art: '📚🕯️',
        mood: 'candle',
        scene: 'library',
        text: [
          'Hollin Skerry Light has been kept since 1871, and every keeper left a log. You lay them out on the floor in order, like cards in a fortune.',
          'They are all the same. Not the weather, not the oil — the *shape*. Then one autumn, fog that doesn’t move with the wind. Three nights. And then the handwriting stops.',
          'Every time. 1889. 1911. 1934. 1952. 1977. And now Tobias.',
          'And every time, in the very same book, the next keeper’s story has already begun — tidy little entries about things he hasn’t done yet, written days before he landed.',
        ],
        choices: [
          {
            text: 'Compare the prophecies to the next keeper’s real handwriting.',
            hint: 'Who has been writing ahead?',
            set: ['knows_hand'],
            effect: S(-1),
            art: '✍️',
            outcome: [
              'You lay the 1934 log beside the 1952 log. The prophecies in the old keeper’s book — the neat lines written before anything happened — are in the *new* keeper’s hand. Exactly.',
              'Every time. The voice that wrote ahead was always the next keeper’s.',
              'You run up to the lamp room and hold Tobias’s log beside the shopping list in your coat pocket. The slant of the *t*s. The little bar across your 7s. You made those marks. You don’t remember making any of them.',
            ],
            next: 'night2',
          },
          {
            text: 'Read the very first log, from 1871.',
            hint: 'Whoever started this knew why.',
            set: ['read_log'],
            art: '📜',
            outcome: [
              'The first keeper, a man named Ezra Pell, wrote in brown ink and long sentences. He knew the fog. He called it *the Company*.',
              '*The Company are not wicked,* he wrote. *They are the drowned of this rock, and they want only to come home, and cannot find the way. The Light keeps them off. The Light does not send them home. Only the Bell may do that — rung by a keeper who has written their names home in this book.*',
              'The last line of his last entry: *I have not the courage. God forgive me, I shall only keep the Light.*',
            ],
            next: 'night2',
          },
          {
            text: 'Find the register of keepers.',
            hint: 'Who came. Who left. Who brought them.',
            set: ['harrow_clue'],
            art: '🗂️',
            outcome: [
              'A ledger on the bottom shelf, bound in oilcloth. Keepers arriving, keepers leaving. Mostly arriving. Hardly anybody leaving.',
              'Beside every arrival since 1953, in the same column, the same three words: *Ferried by J. Harrow.* Seventy years. The same signature every time. Never shakier. Never older.',
              'The last line is yours. Your name, today’s date, and in the ferryman’s column: *J. Harrow.* The ink is brown and cracked, as if it dried a lifetime ago.',
            ],
            next: 'night2',
          },
        ],
      },

      radio_harrow: {
        title: 'Day Two — Channel 16',
        art: '📻⚓',
        mood: 'fog',
        scene: 'lamp-room',
        text: [
          { speaker: 'Coastguard', say: 'Kilbride Coastguard, go ahead, Hollin Skerry.' },
          'You tell her you want relief. Today. Now. She tells you the whole coast is socked in with fog. Nothing is putting out of Kilbride. Not the lifeboat. Not anybody.',
          { speaker: 'Coastguard', say: 'Hold on, Skerry. There’s someone down on the harbour wants a word with you.' },
          'A click. Then a voice like a hull dragged over shingle.',
          { speaker: 'Harrow', say: 'Told you not to believe the book, didn’t I?' },
          'Out of the window, the fog along the reef takes one slow breath, in and out. It is listening too.',
        ],
        choices: [
          {
            text: 'Beg him to come and get you.',
            hint: 'Pride is for people on the mainland.',
            set: ['harrow_coming'],
            art: '🙏',
            outcome: [
              'You hear yourself pleading. You don’t care.',
              'A long silence on the line. Then: *“Third night. When it’s thickest. I’ll come to the landing and show a lantern. You come down to me, and I’ll take you off.”*',
              'You thank him. You keep thanking him. He doesn’t say *you’re welcome*. He says: *“Keep the light till then. I need it to find you.”*',
            ],
            next: 'night2',
          },
          {
            text: 'Ask him straight out: “Who were the Margaret Ann?”',
            hint: 'You think you already know.',
            set: ['harrow_clue', 'harrow_coming'],
            art: '⚓',
            outcome: [
              'The line goes so quiet you think he has gone.',
              '*“Good lads,”* he says at last. *“Best I ever had. The keeper let the bell go silent and I put her on the rock with all of them aboard.”* A breath, wet and slow. *“I bring them keepers, see. I keep thinking one of them will be the one who brings us home.”*',
              '*“Third night. I’ll show a lantern at the landing. Come down to me, if you’ve a mind to.”* Click. The coastguard comes back on, puzzled. She says nobody has been on the harbour wall all day.',
            ],
            next: 'night2',
          },
          {
            text: 'Hang up. You’ll see this through alone.',
            hint: 'Something about his voice. Something wet.',
            effect: S(1),
            art: '✋',
            outcome: [
              'You put the handset down in the middle of his breath.',
              'On the desk, the log writes a single word — then scratches it out so hard the paper tears. You think the word was *good*.',
            ],
            next: 'night2',
          },
        ],
      },

      // ---------------------------------------------------------------- NIGHT TWO
      night2: {
        title: 'Night Two — 9:00 PM',
        art: '💡🌊',
        mood: 'fog',
        scene: 'lamp-room',
        text: [
          'The fog comes in at sunset like a tide. By nine o’clock it is at the outer rocks, close enough that you can hear it — a soft, endless hiss, like breath let out through teeth.',
          'Inside it, lights. Masthead lights, red and green, drifting in a ship’s formation where there is no ship. A bell clanging, slow and drowned.',
          { if: 'clapper', text: 'Downstairs, in Tobias’s oilskin, the iron clapper is humming along with it. You can feel it through the soles of your boots.' },
          { if: 'burned_log', text: 'The log you burned lies open on the desk, smug as a cat.' },
          { speaker: 'The Log', say: '*Night two. At midnight he will go down the stairs to meet me.*' },
          'The clock says 8:59. Out in the fog the bell stops, as if everything out there has turned to see what you’ll do.',
        ],
        choices: [
          {
            text: 'Light it full and bright.',
            hint: 'Burn it. Burn the fog back.',
            effect: O(-1),
            art: '🔥',
            outcome: [
              'The lamp roars up white. The beam swings out and *cuts* — you see it slice the fog like a knife through wet bread, and the edges of the cut curl back, smoking.',
              'The masthead lights go out one by one. The clock creeps toward midnight.',
            ],
            next: 'night2_stairs',
          },
          {
            text: 'Trim it low again.',
            hint: 'Tomorrow is the night that matters.',
            effect: S(-1),
            art: '🕯️',
            outcome: [
              'You turn the wick down. The beam goes thin and sickly, and the fog leans into the gaps.',
              'Between sweeps, things touch the glass. Something drags a fingernail all the way round the lamp room, one full circle, slow as a minute hand.',
              'You keep your eyes on the burner. You save the oil. The clock creeps toward midnight.',
            ],
            next: 'night2_stairs',
          },
          {
            text: 'Leave it dark. Let the dark show you what’s out there.',
            hint: 'You’re sick of being afraid of something you can’t see.',
            effect: S(-2),
            fx: 'flash',
            art: '🌑',
            outcome: [
              'You don’t light it. You stand in the black lamp room with your hands on the cold rail and you *look*.',
              'Without the beam, the fog is not white. It is full. Faces packed in it like fish in a net, hundreds of them, mouths open, all turned up toward you. Seven at the front in oilskins. A woman in a shawl. A boy.',
              'They don’t come closer. They are waiting for permission. You light the lamp with shaking hands, at the lowest wick you can bear, and they sigh — all of them, one long sigh — and draw back. The clock creeps toward midnight.',
            ],
            next: 'night2_stairs',
          },
        ],
      },

      night2_stairs: {
        title: 'Night Two — Midnight',
        art: '🌀👣',
        mood: 'night',
        scene: 'stairwell',
        fx: 'heartbeat',
        timer: 7,
        text: [
          'At midnight, the footsteps start.',
          'Not at the door. *Inside.* Far down the spiral, wet bare feet slapping on stone, climbing. Slowly.',
          'The hatch to the lamp room is open at your feet. You can see straight down the well of the stairs — round and round, into the dark — and on the curve far below, a pale hand slides up the rail.',
          { if: 'harrow_rule', text: 'The door at the bottom is bolted. Harrow’s rules say nothing about what to do when the knocking is already inside.' },
          'The log said you would go down to meet it. Forty steps below you, the footsteps stop. They wait.',
        ],
        timeout: {
          effect: both(O(-1), S(-1)),
          art: '🌊',
          outcome: [
            'You stand frozen at the hatch, and the thing on the stairs gets tired of waiting.',
            'A surge of black water comes up the stairwell and bursts through the hatch, knocking you flat, slopping across the floor and into the oil cans. The burner hisses and nearly dies.',
            'When it drains away you are alone and soaked, and a can of good oil is swimming with seawater. On the top step, somebody has left a wet handprint, fingers spread, like a wave goodbye.',
          ],
          next: 'day3',
        },
        choices: [
          {
            text: 'Take the hurricane lamp and go down to meet it.',
            hint: 'The log said you would. Maybe the log was right.',
            set: ['met_tobias'],
            art: '🏮',
            outcome: [
              'You go down. One step. Ten. Your lamp throws your shadow up the curved wall behind you, and the shadow is slower than you are.',
              'At the fiftieth step, a man is sitting with his back against the wall and his knees drawn up. He wears a keeper’s jacket, and the jacket is streaming water, and so is he.',
              'He looks up. His face is pale and puffy and very, very kind.',
            ],
            next: 'tobias',
          },
          {
            text: 'Slam the hatch and sit on it.',
            hint: 'Whatever it is, it isn’t getting past you.',
            effect: S(-1),
            fx: 'shake',
            art: '🪨',
            outcome: [
              'You drop the hatch and sit on it with all your weight, your back against the lens housing.',
              'The footsteps come up. They stop directly beneath you. Then, through two inches of oak, someone knocks — gently — three times. A tired voice says: *“I only wanted to talk.”*',
            ],
            next: 'day3',
          },
          {
            text: 'Fire the flare pistol straight down the stairwell.',
            hint: 'Light, heat, noise. Everything it hates.',
            if: 'flare',
            unset: ['flare'],
            fx: 'flash',
            art: '🎆',
            outcome: [
              'The flare goes down the well of the stairs like a falling star, spitting red, ricocheting off the walls, and the whole tower lights up scarlet.',
              'Something below *howls* — not in anger. In hurt. A man’s voice, ragged: *“Not at me, you fool — not at ME —”*',
              'Then smoke, and silence, and the stink of burnt magnesium. In the morning there’s a scorched streak down the stairs, and halfway down, a keeper’s cap, still wet.',
            ],
            next: 'day3',
          },
        ],
      },

      tobias: {
        title: 'Night Two — Step Fifty',
        art: '🧥💧',
        mood: 'candle',
        scene: 'stairwell',
        text: [
          { speaker: 'Tobias', say: 'You’re the relief. Good. Sit down a minute, would you? I’ve been climbing these stairs for nine days. They don’t get any shorter.' },
          'Tobias Venn. Your predecessor. Water runs out of his sleeves and trickles down the steps, and none of it ever stops.',
          { speaker: 'Tobias', say: 'Let me tell you what I worked out too late. The light doesn’t warn ships, not any more. It holds *them* back. The Company. Harrow’s lads, and everyone else this rock has ever drowned.' },
          { speaker: 'Tobias', say: 'And the book — the book is how they talk to us. It writes what they hope you’ll do. But it writes what *you* write, too, if you write it true. I found that out on my third night, and by then I was already walking.' },
          { if: 'knows_hand', text: 'You ask him about the handwriting. He smiles, sadly. *“Yours now, is it? It was mine, for the man before me. The book borrows the next keeper’s hand. It’s been getting ready for you.”*' },
          'Far below, out in the fog, the drowned bell begins to clang again. Tobias flinches at every stroke.',
        ],
        choices: [
          {
            text: 'Believe him. Ask how to send them home.',
            hint: 'He’s dead. He’s also the only one who’s told you the truth.',
            set: ['trusted_tobias'],
            effect: S(1),
            art: '🤝',
            outcome: [
              'You sit down beside him on the wet stone.',
              '*“Their bell,”* he says quietly. *“The tower’s fog bell. It went dumb the night the Margaret Ann struck — the clapper fell into the sea. They never heard it. They’re still waiting to.”*',
              '*“Find the clapper. Ring the bell on the third night, at the worst of it. But first, write them home in the book. Write my name, if you like. The book believes what’s written true.”*',
              { if: 'clapper', text: 'You think of the iron clapper in his oilskin, humming in the store below. You don’t tell him. You want to see his face when he hears it ring.' },
            ],
            next: 'day3',
          },
          {
            text: 'Back away up the stairs.',
            hint: 'Drowned men don’t give honest advice.',
            effect: S(-1),
            art: '⬆️',
            outcome: [
              'You back up a step. Two. He doesn’t follow.',
              '*“Fair enough,”* he says, and he sounds so tired. *“I wouldn’t have, either.”*',
            ],
            next: 'day3',
          },
          {
            text: 'Ask him what happened on his third night.',
            hint: 'If you know how he died, maybe you won’t.',
            art: '❔',
            outcome: [
              '*“They sang,”* he says. *“My mother’s voice. My wife’s. They sang my name, and I thought one minute out on the gallery couldn’t hurt.”* He looks at his hands. *“The light went out at ten past three. I was gone by quarter past.”*',
              '*“Ten past three. Remember it. Don’t open the gallery door, whatever they sing. And if you’ve a mind to, look at whose hand that book is writing in.”*',
              'He stands. The water runs off him and down the steps, and when you lift your lamp again, the step where he sat is bone dry.',
            ],
            next: 'day3',
          },
        ],
      },

      // ---------------------------------------------------------------- DAY THREE
      day3: {
        title: 'Day Three — The Grey',
        art: '🌫️🏝️',
        mood: 'fog',
        scene: 'lighthouse',
        text: [
          'There is no dawn. The dark just thins into a grey that lies on the rock like a wet sheet. The fog is at the landing now. You can stand at the cottage door and put your hand into it.',
          (s) => (s.get('oil') <= 0
            ? 'The store is empty. The lamp reservoir holds a finger of oil, no more. It will not last the night.'
            : s.get('oil') === 1
              ? 'You check the store. One drum, and it’s light. Enough for one more night, if you don’t waste a single drop.'
              : 'You check the store. Enough oil for tonight, and some over. It is the only thing on the rock that feels like luck.'),
          'The log has written up the night. And today:',
          { speaker: 'The Log', say: '*Day three. Today he will try to leave.*' },
          'Down at the slipway, the station dinghy lies upside down on its trestles, oars lashed beneath. The mainland is eleven miles east. The fog is everywhere.',
        ],
        choices: [
          {
            text: 'Flip the dinghy and row for the mainland.',
            hint: 'Eleven miles. People have rowed further.',
            art: '🚣',
            scene: 'sea',
            outcome: [
              'You drag the dinghy down the slipway, its keel shrieking on the stone, and shove off into the white.',
              'The rock vanishes after six strokes. After twelve, you can’t hear the surf. There is nothing in the world but grey water, grey air, and the creak of your own oars.',
            ],
            next: 'dinghy',
          },
          {
            text: 'Sit down with the log and write in it yourself.',
            hint: 'It writes what you write — if you write it true.',
            art: '✒️',
            scene: 'cottage',
            outcome: [
              'You carry the log down to the cottage table, light the stove, and sit with the pencil in your fist like a knife.',
              'The page in front of you is blank. For the first time since you landed, the book is waiting for *you*.',
            ],
            next: 'write_log',
          },
          {
            text: 'Sleep until dark. You’ll need your nerve tonight.',
            hint: 'You haven’t slept properly since the boat.',
            effect: S(1),
            art: '😴',
            scene: 'cottage',
            outcome: [
              'You lie down on Tobias’s bunk with your boots on and a hammer in your fist, and sleep takes you like a wave.',
              'You dream of a bell ringing under the sea, and seven men walking up a beach in the sun.',
              'When you wake, it is dark, and somebody has pulled the blanket up to your chin. The blanket is wet.',
            ],
            next: 'night3',
          },
        ],
      },

      dinghy: {
        title: 'Day Three — Open Water',
        art: '🚣🌫️',
        mood: 'fog',
        scene: 'sea',
        fx: 'heartbeat',
        timer: 6,
        text: [
          'Something bumps the hull.',
          'Then something grips the gunwale — a hand, white and wrinkled as a washerwoman’s, weed under the nails. Another on the other side. The dinghy dips left, then right, as if somebody is climbing in from both sides at once.',
          'Ahead in the fog, a bell is clanging. Behind you — or is it behind? — you hear surf on rock.',
          { if: 'harrow_coming', text: 'And somewhere close, the slow knock of an engine idling. A boat. A lantern swinging.' },
          'The hands pull. Water slops over the side and swirls round your ankles. It is warm.',
        ],
        timeout: {
          art: '🌊',
          outcome: [
            'You hesitate, and the hands decide for you.',
            'The dinghy rolls over gently — almost politely — and the sea closes over your head like a door shutting on a warm room.',
          ],
          next: 'death_tide',
        },
        choices: [
          {
            text: 'Row hard toward the bell.',
            hint: 'A bell means a buoy. A buoy means a channel. Doesn’t it?',
            effect: S(-1),
            art: '🔔',
            outcome: [
              'You haul on the oars until your shoulders scream. The hands let go — they *let go*, almost happily — and the bell grows louder. Closer. You’re nearly there.',
              'Then the fog parts, and you see what is ringing it. Seven men standing waist-deep in the sea around an iron bell that hangs from nothing at all. They turn to you. They smile. They have been ringing it for you.',
            ],
            next: 'death_tide',
          },
          {
            text: 'Fire the flare into the fog.',
            hint: 'Light. Anything with light in it.',
            if: 'flare',
            unset: ['flare'],
            effect: S(-1),
            fx: 'flash',
            art: '🎆',
            outcome: [
              'You drop an oar, snatch the pistol from your coat and fire straight up. The flare bursts red, and the whole fog lights from inside like a lantern full of blood.',
              'The hands vanish. In the red glow you see the tower, a dark finger off your stern — you’ve been rowing in a circle. You turn and row for it like a madman while the flare drifts down, hissing.',
              'You drag the dinghy up the slipway as the light fails. The fog closes in behind you, patient. You will not get off this rock by daylight.',
            ],
            next: 'night3',
          },
          {
            text: 'Shout for the boat with the lantern.',
            hint: 'Harrow said he’d come. He came early.',
            if: 'harrow_coming',
            art: '🏮',
            outcome: [
              '*“Harrow! HARROW!”* The engine note changes. The lantern swings toward you, and the hands on your gunwales let go — respectfully, like men stepping back for an officer.',
              'A bow slides out of the fog. *PATIENCE*, it says, and underneath, through paint worn thin as skin: **MARGARET ANN.** Harrow leans down and offers you his wet hand.',
              '*“Came early,”* he says. *“Couldn’t bear to wait. Up you come.”*',
            ],
            next: 'end_ferry',
          },
          {
            text: 'Turn and row toward the sound of surf.',
            hint: 'The rock is behind you. It has to be.',
            effect: S(-2),
            art: '↩️',
            outcome: [
              'You swing the dinghy round by feel and pull for the sound of waves on stone. The hands don’t let go. They ride with you, nails dragging on the planks, and something in the water whispers in time with every stroke.',
              'The rock looms out of the white so suddenly you nearly smash on it. You crawl up the slipway on your hands and knees. Behind you, the empty dinghy drifts back into the fog with seven sets of handprints on its sides.',
            ],
            next: 'night3',
          },
        ],
      },

      write_log: {
        title: 'Day Three — In Your Own Hand',
        art: '✒️📓',
        mood: 'candle',
        scene: 'cottage',
        text: [
          'The stove ticks. The fog presses its face against the cottage window.',
          'You turn back through the log. Every entry about you is there — the landing, the radio, the door, the stairs. Tidy, accurate, unhurried. And at the bottom, waiting, one line for tonight:',
          { speaker: 'The Log', say: '*Night three. 3:10. The keeper let the light go out.*' },
          { if: 'trusted_tobias', text: '*It writes what you write, too, if you write it true.*' },
          { if: 'read_log', text: '*Only the Bell may do that — rung by a keeper who has written their names home in this book.*' },
          'The pencil is touching the paper. A thin grey line wavers out of it. You have room for one sentence before your nerve goes.',
        ],
        choices: [
          {
            text: 'Write: *Tobias Venn came home.*',
            hint: 'Write him back where he belongs.',
            set: ['wrote_home'],
            art: '🏠',
            outcome: [
              'You write it slowly, pressing hard, every letter as true as you can make it: **TOBIAS VENN CAME HOME.**',
              'For a moment, nothing. Then the pencil marks darken, as if ink were soaking through from the other side of the page, and the cottage fills with the smell of rain on hot stone — summer rain, mainland rain.',
              {
                if: 'trusted_tobias',
                text: 'Somewhere far beneath the rock, a man laughs, just once, like someone who has heard a door unlock.',
                else: 'Somewhere beneath the rock, something goes very quiet, the way a crowd goes quiet when somebody speaks a name it knows.',
              },
            ],
            next: 'night3',
          },
          {
            text: 'Write: *The light burned till morning.*',
            hint: 'Not a wish. An order.',
            effect: both(O(1), S(-1)),
            art: '🔥',
            outcome: [
              'You write it in capitals and underline it twice: **THE LIGHT BURNED TILL MORNING.**',
              'The book fights you. The pencil drags as if through wet sand, and your hand cramps so hard you cry out. The line *3:10* fades — not gone, only faint, like a word said under the breath.',
              'When you go to the store, the empty drum in the corner sloshes. It’s a quarter full. You didn’t fill it. Nobody did.',
            ],
            next: 'night3',
          },
          {
            text: 'Write nothing. Hold your own handwriting up to the book’s.',
            hint: 'You need to know who has been writing.',
            set: ['knows_hand'],
            effect: S(-1),
            art: '🔍',
            outcome: [
              'You write your name in the margin and set it beside the log’s line about tonight.',
              'Same hand. Same slant. Same little bar through the 7. The book has been writing in *your* handwriting since before you landed — since before you ever applied for the post.',
              'You turn back a page. Tobias’s last real entry trails off in his own small script — and the line above it, the prophecy of his last night, is in yours. It has been practising you. It is nearly ready.',
            ],
            next: 'night3',
          },
        ],
      },

      // -------------------------------------------------------------- NIGHT THREE
      night3: {
        title: 'Night Three — The Rail',
        art: '🌫️👁️',
        mood: 'fog',
        scene: 'lamp-room',
        fx: 'heartbeat',
        text: [
          'The fog comes over the rock at sunset and climbs the tower like ivy. By ten it is at the gallery rail. By eleven it is at the glass.',
          'They are in it. You can see them now without even trying: pressed to the windows all the way round, faces flattened white against the panes. Seven in oilskins. A woman in a shawl. Keepers in old jackets — a century of them.',
          { if: 'met_tobias', text: 'Tobias is among them, close by the gallery door. He nods to you. Water runs from his eyes, and you can’t tell whether it’s the sea.' },
          'And they are singing. Low, wordless, a hymn you half know.',
          {
            if: 'answered_radio',
            text: 'Your name is in the hymn. Every verse. You gave it to them.',
            else: 'They don’t know your name. They sing *keeper, keeper, keeper* instead, sweet and coaxing, like someone calling a cat in out of the rain.',
          },
          (s) => (s.get('oil') <= 0
            ? 'The reservoir is almost dry. You have scraped every drum. The flame is already beginning to shrink.'
            : 'The burner roars. There is oil enough — if nothing goes wrong.'),
          { if: 'harrow_coming', text: 'Down at the landing, a lantern is swinging. Slowly, side to side, the way you’d signal a friend.' },
          { speaker: 'The Log', say: '*3:10. The keeper let the light go out.*' },
          'It is ten to three.',
        ],
        choices: [
          {
            text: 'Stand by the lamp and trim the wick.',
            hint: 'Twenty minutes to the hour he died. Then three hours to dawn.',
            art: '🕯️',
            outcome: [
              'You plant yourself beside the burner with the trimming scissors in one hand and the oil can in the other. You are not going anywhere.',
              'The singing swells, as if they heard you decide.',
            ],
            next: 'finale',
          },
          {
            text: 'Tear tonight’s page out of the log.',
            hint: 'Let it try to write tonight with no paper.',
            effect: S(1),
            fx: 'redflash',
            art: '📄',
            outcome: [
              'You rip the page out, crumple it, and feed it to the burner. It goes up blue.',
              'The singing stops dead. Outside, every face at the glass turns toward the log at once, and in the silence the pencil on the desk begins, very slowly, to roll toward a fresh page.',
            ],
            next: 'finale',
          },
          {
            text: 'Go down to Harrow’s lantern at the landing.',
            hint: 'He said he’d take you off. He said keep the light till then.',
            if: 'harrow_coming',
            art: '🏮',
            scene: 'lighthouse',
            outcome: [
              'You leave the lamp burning and take the stairs two at a time, ninety-one steps, down into fog so thick it’s like wading.',
              'You draw the bolt. You open the door. The faces don’t touch you; they part for you, like a crowd for a bride.',
              'At the landing, the boat waits, engine knocking. Harrow holds up his lantern. *“Good lad,”* he says. *“Good lad. Mind the step.”*',
            ],
            next: 'end_ferry',
          },
          {
            text: 'Fire the flare out into the fog.',
            hint: 'One shot. Make it count.',
            if: 'flare',
            unset: ['flare'],
            effect: S(1),
            fx: 'flash',
            art: '🎆',
            outcome: [
              'You step out onto the gallery for one second — one — and fire the flare straight into the faces.',
              'It bursts in red fire and they *scatter*, a shoal of white shapes fleeing the light, and for a whole minute there is clear air around the tower and you can see the stars.',
              'Then the flare dies, and they come back. But not so close. And they are not singing any more. They sound, for the first time, afraid of you.',
            ],
            next: 'finale',
          },
        ],
      },

      finale: {
        title: 'Night Three — 3:10 AM',
        art: '💡⏰',
        mood: 'storm',
        scene: 'lamp-room',
        fx: 'heartbeat',
        timer: 9,
        text: [
          'Ten past three.',
          'The flame in the burner drops. Not out — *down*, all at once, shrinking to a blue bead, as if something has cupped a hand around it.',
          'Every window frosts over. On the frost, from the outside, fingers write: *LET US IN. LET US IN. LET US HOME.*',
          'The gallery door rattles on its latch.',
          { speaker: 'The Choir', say: 'Keeper. Keeper. Open the door. It’s so cold, keeper. Let it go out. Let it go out, and come and see.' },
          { if: secretReady, text: 'Above the gallery door, on its bracket outside the glass, hangs the tower’s fog bell — dumb since 1952. The iron clapper is in your hands; you don’t remember carrying it up. The log lies open beside you at a page that says, in your writing: *Tobias Venn came home.*' },
          { if: 'knows_hand', text: 'On the desk, the pencil stands upright on its point, waiting. The book is waiting for a hand. You know whose hand it is.' },
          (s) => (s.get('oil') <= 0 ? 'You shake the oil can. Empty. There is nothing left to give the flame.' : null),
          'The blue bead flickers. You have seconds.',
        ],
        timeout: {
          art: '❄️',
          outcome: [
            'You stand there too long, and the bead of flame goes out with a tiny sound, like a kiss.',
            'In the dark, the latch of the gallery door lifts by itself.',
          ],
          next: (s) => (s.get('sanity') <= 1 ? 'end_last' : 'death_fog'),
        },
        choices: [
          {
            text: 'Feed the flame and hold the line.',
            hint: 'Oil, wick, steady hands. Dawn is three hours off.',
            art: '🔥',
            outcome: [
              (s) => (s.get('oil') >= 1
                ? 'You slop oil into the reservoir with hands that won’t stop shaking, trim the wick, and breathe on the blue bead like a man nursing a campfire in the snow.'
                : 'You tip the oil can over the burner. Three drops fall out. Three.'),
              {
                if: (s) => s.get('oil') >= 1 && s.get('sanity') >= 1,
                text: 'It catches. It *roars*. The beam slams back out into the fog, and the frost on the glass runs down like tears.',
                else: {
                  if: (s) => s.get('oil') <= 0,
                  text: 'The bead of flame bows toward the windows, politely, and goes out.',
                  else: 'It catches. And you look at it, and you can’t remember what it’s for. Why you’re standing here. Whose rock this is. Your hand drifts toward the pencil.',
                },
              },
            ],
            next: (s) => (s.get('oil') <= 0 ? 'death_fog' : s.get('sanity') <= 0 ? 'end_last' : 'end_dawn'),
          },
          {
            text: 'Open the gallery door and go to them.',
            hint: 'They’re so cold. And they sound like everyone you ever lost.',
            fx: 'redflash',
            art: '🚪',
            outcome: [
              'You lift the latch. You don’t decide to. Your hand does.',
              'The fog pours in around you, cold and sweet and full of hands, and the singing stops being sad.',
            ],
            next: 'death_fog',
          },
          {
            text: 'Ring the bell.',
            hint: 'The bell they never heard. Tobias, written home.',
            if: secretReady,
            fx: 'flash',
            art: '🔔',
            outcome: [
              'You kick the gallery door open — not to let them in, but to reach — and lean out into the fog with the clapper in both hands. You hook it into the bell’s crown with fingers you can no longer feel.',
              'The faces fall silent. A hundred drowned eyes watch you swing.',
              'Iron meets iron. **BONG.**',
            ],
            next: 'end_bell',
          },
          {
            text: 'Pick up the pencil. Write the last entry yourself.',
            hint: 'It’s your hand anyway. It always was.',
            if: 'knows_hand',
            art: '✍️',
            outcome: [
              'You sit down at the desk in the dark. The pencil fits your fingers like it was turned on a lathe for them.',
              'Outside, the singing stops. A hundred faces press to the glass to watch you write.',
            ],
            next: 'end_hand',
          },
        ],
      },

      // ------------------------------------------------------------------ ENDINGS
      end_dawn: {
        art: '🌅💡',
        mood: 'dawn',
        scene: 'lighthouse',
        ending: { id: 'light-held', title: 'The Light Held', type: 'good' },
        text: [
          'You feed the lamp until your hands blister. You trim the wick every ten minutes.',
          'At ten to six, the fog goes grey. At six, it goes gold.',
          'And then it simply lets go — falls away from the tower in long white sheets, slides off the rock, and rolls back over the sea toward the horizon like a tide going out. The sun comes up behind it, enormous and ordinary.',
          { if: 'trusted_tobias', text: 'At the very edge of the fog, a man in a keeper’s jacket turns and lifts a hand to you. Then he walks back into the white with the others. You kept the light. You didn’t send him home. You both know the difference.' },
          { if: (s) => s.has('clapper') && s.has('trusted_tobias'), text: 'The iron clapper lies in the store in Tobias’s oilskin, humming faintly. You never found the nerve to ring it. Someone will have to, one day.' },
          { if: 'burned_log', text: 'The log you burned lies open on the desk. Under last night’s entry, in nobody’s handwriting at all, it says: *He kept it.* Then blank pages, all the way to the end.', else: 'The log lies open on the desk. Its last line, in a tidy hand, reads: *The keeper kept the light.* Then blank pages, all the way to the end.' },
          {
            if: 'harrow_coming',
            text: 'At noon a boat comes out from Kilbride — the real lifeboat, orange and loud, crewed by sunburnt volunteers who have never heard of anybody called Harrow. They ask where your relief boat got to. You say you never saw it.',
            else: 'At noon the Kilbride lifeboat comes out to check on the Skerry, orange and loud and wonderful.',
          },
          { if: 'answered_radio', text: 'Sometimes, on foggy nights on the mainland, your radio clears its throat and a young voice asks for you by name. You switch it off. You always will.' },
          'You keep the light for the rest of your four weeks. The fog never comes back while you’re there. On the day you leave, you write one line in the log for the next keeper, in your own hand, and you make very sure it is true:',
          '*Keep the light. Don’t open the door. And if you find the courage I didn’t — ring the bell.*',
        ],
      },

      end_bell: {
        art: '🔔🌄',
        mood: 'dawn',
        weather: 'sparkles',
        fx: 'flash',
        scene: 'lighthouse',
        ending: { id: 'rung-home', title: 'Rung Home', type: 'secret' },
        text: [
          'The note goes out over the sea like a wave travelling the wrong way — out, out, through the fog, over the reef, to the horizon and beyond — and the whole tower hums with it under your feet.',
          'You ring it again. And again. Three strokes, then three, then three: the old fog signal of Hollin Skerry, seventy years late. Groups of three, like the tallies in the cave. They were counting the bell they never heard.',
          'The faces at the glass turn away from the light. Toward the sound.',
          'And the fog moves. Not toward you — *away*, rolling off the rock in a long, slow procession, and in it you can see them walking. Seven men in oilskins first, arms over one another’s shoulders. Keepers in a century of jackets.',
          'Last of all comes Tobias Venn, dry for the first time in nine days, his cap in his hand.',
          { speaker: 'Tobias', say: 'Written home, and rung home. You did it right, keeper. You did it all right.' },
          'He walks after the others, across the water, toward the line where the dark meets the first grey of morning, and the fog goes with them like a coat they have shrugged off.',
          'When the sun comes up, there is no fog anywhere, on the sea or on the coast. The Kilbride lifeboat comes out at noon. Its crew tell you an old boat that had sat at the end of the harbour for as long as anyone can remember sank at her moorings in the night. At ten past three. Nobody aboard. Name of *Patience*.',
          'The log is open on the desk. Every prophecy is gone — every tidy line about what you were going to do. The pages are blank, except for one, written in a small, neat hand that is not yours:',
          { speaker: 'The Log', say: '*Thank you.*' },
          'You keep the light for the rest of your four weeks. On calm nights you ring the bell anyway. Three, and three, and three. Just so they know the way.',
        ],
      },

      end_hand: {
        art: '✍️📓',
        mood: 'candle',
        scene: 'lamp-room',
        ending: { id: 'your-hand', title: 'Written in Your Hand', type: 'true' },
        text: [
          'You write the first line that comes to you: *Relief keeper landed four o’clock.*',
          'And the page drinks it. You watch the words slide backwards through the book, page after page, all the way to the day you landed, and settle there in fresh, shining ink.',
          'All at once you understand. The book was never the fog’s voice. It was the keepers’. Every keeper, writing ahead for the next one as best they could, in a hand that wasn’t theirs yet. Tobias wrote you. You were reading yourself all along.',
          'Outside, the faces have stopped singing. They are reading over your shoulder. In the burner, the blue bead swells, steadies — *burns*. The light comes back on its own, white and fierce, because the book says that it does.',
          'So you keep writing. You write the door and the stairs and the bell. You write warnings into the margins in capitals: *DON’T OPEN THE GALLERY DOOR. LOOK AT WHOSE HAND IT IS.*',
          '· · ·',
          'Four weeks later, a boat noses up to the landing with a new relief keeper aboard — young, nervous, a train ticket in their pocket and a letter that used the word *unfortunate* twice.',
          'The tower is lit. The cottage is empty. On the table there is a mug of tea gone cold, and beside it a green logbook, swollen with damp, open to an entry so new the ink still shines:',
          { speaker: 'The Log', say: '*Relief keeper landed four o’clock. They will read this, and they will not believe it.*' },
          { if: 'harrow_clue', text: 'Down at the landing, Harrow looks up at the tower for a long time before he pushes off. Then he touches his cap to it. It is the first time in seventy years he has done that.' },
          'In the lamp room, there is nobody at all. But the pencil is warm. And for the next three nights, very quietly, it does its very best to keep them alive.',
        ],
      },

      end_ferry: {
        art: '🏮⛵',
        mood: 'fog',
        scene: 'sea',
        fx: 'glitch',
        ending: { id: 'ferryman', title: 'The Ferryman', type: 'bad' },
        text: [
          'Harrow’s hand is cold and wet and very strong. He pulls you aboard like landing a fish, and the deck under your boots is soft with weed.',
          'The engine knocks. The boat turns. You look back for the tower and see its light dwindle to a star, to a spark, to nothing.',
          'Then you look at the crew. You hadn’t noticed them. Six young men in oilskins sitting along the gunwales, water running from their hair, and a boy of fifteen being quietly sick over the side.',
          {
            if: 'harrow_clue',
            text: 'You knew. The photograph, the crew board, the register, the young voice on the radio — you knew who he was before you ever called his name. You came anyway. Maybe some part of you wanted to be ferried.',
            else: 'You look at the name on the wheelhouse: *Margaret Ann*. You look at Harrow’s face in the lantern light, and it is young — twenty-six, raw-boned, frightened — and you understand at last whose voice was on the radio.',
          },
          { speaker: 'Harrow', say: 'I bring them keepers. Always have. I thought this time — thought maybe this one would know how to bring us home. But you came down to me instead. They all come down to me, in the end.' },
          'The fog closes over the boat. You are not cold. That is the worst of it. You will never be cold again.',
          'On the mainland, a newspaper runs four lines about the second keeper to vanish from Hollin Skerry in a month. A week later, a man on the Kilbride harbour wall — old, thick-shouldered, wet-handed — offers to run the next relief out to the rock.',
          {
            if: 'answered_radio',
            text: 'There is a new hand in his crew. It waves at the new keeper from the stern. It already knows their name.',
            else: 'There is a new hand in his crew. It waves at the new keeper from the stern, and tries, very hard, to remember its own name.',
          },
        ],
      },

      death_tide: {
        art: '🌊🫧',
        mood: 'sea',
        weather: 'bubbles',
        scene: 'sea',
        fx: 'redflash',
        ending: { id: 'cold-water', title: 'Cold Water', type: 'death' },
        text: [
          'Under the water it is not dark. It is green, and gentle, and full of light from somewhere far below.',
          'Hands take yours. Not roughly. They hold you the way you hold someone at a funeral. Seven men in oilskins drift around you, hair moving like weed, smiling with such relief.',
          'You try to breathe, and the sea comes in. It just fills you up, cold and then not cold, until there is no room left for you.',
          { if: 'flare', text: 'The flare pistol slides out of your coat and sinks past you, turning slowly, cartridges still in the box. You never fired it. You wonder, distantly, whether it would have helped.' },
          'The dinghy washes up on the Kilbride shingle four days later, empty, oars shipped neatly. There are handprints all over the hull — small and large, too many to count.',
          'That autumn, Hollin Skerry Light goes dark for three nights running. When the next relief keeper lands, they find the log on the cottage table. The newest entry is in your handwriting:',
          { speaker: 'The Log', say: '*Day three. Today he tried to leave.*' },
        ],
      },

      death_fog: {
        art: '🌫️🖐️',
        mood: 'void',
        scene: 'lamp-room',
        fx: 'redflash',
        ending: { id: 'into-the-white', title: 'Into the White', type: 'death' },
        text: [
          (s) => (s.get('oil') <= 0
            ? 'The light goes out at ten past three. You knew it would. You counted every drop, and there weren’t enough.'
            : 'The light goes out at ten past three, exactly as written.'),
          'The gallery door swings in. The fog comes into the lamp room the way the sea comes into a sinking hull.',
          'It is full of hands. They are gentle. They take your wrists, your elbows, your face. They are so cold, and so glad, and they lead you out onto the gallery and up onto the rail, and you go — because the voices are singing your name in your mother’s voice, and it has been so long since anyone sang to you.',
          { if: 'met_tobias', text: 'Tobias is there at the rail. He takes your hand last. *“I’m sorry,”* he says. *“I’m so sorry. Mind the step.”*' },
          'You step.',
          'Ships pass Hollin Skerry for three nights with no light to warn them. On the fourth, a relief keeper lands. They find the cottage empty, the stove cold, a mug of tea on the table, and a green logbook with a fresh entry, the ink still wet:',
          { speaker: 'The Log', say: '*Night three. 3:10. The keeper let the light go out.*' },
          'And below it, in the new keeper’s handwriting, the next line is already beginning to form.',
        ],
      },

      end_last: {
        art: '📓🌀',
        mood: 'candle',
        scene: 'lamp-room',
        fx: 'glitch',
        ending: { id: 'last-entry', title: 'The Last Entry', type: 'neutral' },
        text: [
          'You sit down at the desk. You pick up the pencil. You don’t remember why — only that it is very important to get it all down.',
          'You write the lamp. The fog. The faces. You write the knocking and the stairs and the bell. You write your name, over and over, in case you forget it — and then you forget it, and you keep writing it anyway, because your hand remembers.',
          'The light burns on by itself. Nobody has to tend it. The book says it burns, so it burns.',
          'The lifeboat finds you at noon, still writing. In the hospital on the mainland, you fill the margins of the bedside Bible with tidy little lines about what the nurses are going to do next — and you are never, ever wrong.',
          { if: 'burned_log', text: 'They say you keep asking for matches. They say you keep whispering *he burned me, he burned me*, as if you were somebody else.' },
          'On Hollin Skerry, the next keeper finds the log full to the last page. Every line in your handwriting. The final entry says only:',
          { speaker: 'The Log', say: '*Relief keeper landed four o’clock.*' },
          'It is dated four weeks before they arrived.',
        ],
      },
    },
  });
})();
