/* MysteryFate story: The Midnight Gala (thriller) */
(function () {
  'use strict';

  // ---- helpers (meters clamped 0..5 to keep simulation compact) ----
  const clamp = (v) => Math.max(0, Math.min(5, v));
  const bump = (heat, trust) => (s) => {
    if (heat) s.setVar('heat', clamp(s.get('heat') + heat));
    if (trust) s.setVar('trust', clamp(s.get('trust') + trust));
  };
  const hot = (n) => (s) => s.get('heat') >= n;
  const trusted = (s) => s.get('trust') >= 3;
  const evidenceOnly = (s) => s.has('took_evidence') && !s.has('took_diamond');
  const longCon = (s) => s.has('swapped') && s.has('spared_tomasz');

  // ---- shared escape choices (used by both 11:57 scenes) ----
  const escapeChoices = (alarm) => [
    {
      text: 'Sprint for the boathouse',
      hint: 'Vega says she is holding the boat.',
      set: ['route_boat'],
      art: '🚤',
      outcome: alarm
        ? [
          `You take the servants' stairs three at a time, gown bunched in one fist, red light strobing off the walls. A guard rounds the landing below; you vault the banister and drop the last six feet onto wet stone.`,
          `The night air hits you like cold champagne. The boathouse is a hundred yards down the cliff path, and every one of them is lit by searchlights.`,
        ]
        : [
          `You walk, because running is what guilty people do. Down the servants' stairs, through a pantry, past two waiters sharing a cigarette who nod at you like an old friend.`,
          `Then the cliff path, the lanterns, the sea breathing below. The boathouse light is on. Someone is waiting. You hope.`,
        ],
      next: 'dock',
    },
    {
      text: 'Climb to the helipad',
      hint: `Thorne's helicopter is fuelled.`,
      set: ['route_heli'],
      scene: 'rooftop',
      art: '🚁',
      outcome: alarm
        ? [
          `Up, not down. Nobody expects up. You take the fire stairs to the roof, lungs burning, heels long gone, clutch clamped under one arm.`,
          `Below you, the whole house is moving toward the boathouse. Good. Let them.`,
        ]
        : [
          `Up, not down. You climb the narrow fire stairs to the roof with the party throbbing through the walls, your own breathing loud in your ears.`,
          `At the top, a steel door, a crash bar, and the sound of rotor blades beginning to turn.`,
        ],
      next: 'helipad',
    },
    {
      text: 'Dive back into the ballroom crowd',
      hint: 'At midnight, everyone unmasks.',
      set: ['route_crowd'],
      scene: 'ballroom',
      art: '🎭',
      outcome: alarm
        ? [
          `You turn the opposite way from every instinct you have and push back through the service door into the ballroom. Heat, noise, perfume, four hundred bodies. The perfect place to drown a siren.`,
          `The band has cranked the volume so the guests won't notice the alarm. Rich people are excellent at not noticing things.`,
        ]
        : [
          `You smooth your gown, retie your mask, pluck a fresh flute from a tray, and stroll back into the ballroom as though you'd only been powdering your nose.`,
          `Nobody looks at you. Everyone is looking at the great clock above the stairs.`,
        ],
      next: 'midnight',
    },
  ];

  registerStory({
    id: 'midnight-gala',
    title: 'The Midnight Gala',
    category: 'thriller',
    tagline: 'One diamond. One masked ball. Fifty-eight minutes to midnight.',
    description: `You're the inside woman on a crew stealing the Widow's Tear from a billionaire's private island during a masked charity gala. A guest knows your face, the vault has been upgraded, someone on the crew is talking to Interpol — and the host is hiding something far worse than a diamond.`,
    cover: '💎',
    accent: '#d4af37',
    ambient: 'thriller',
    scene: 'ballroom',
    voices: {
      narrator: { gender: 'male', pitch: 0.85, rate: 0.98, accent: 'en-US', note: 'smooth late-night heist narrator, low and controlled' },
      'Lux': { gender: 'female', pitch: 1.3, rate: 1.22, accent: 'en-US', note: 'wisecracking hacker in your ear, quick and bright' },
      'Lux (text)': { gender: 'female', pitch: 1.35, rate: 1.3, accent: 'en-US', note: 'Lux texting: clipped, fast, lowercase' },
      'Vega': { gender: 'female', pitch: 0.78, rate: 0.88, accent: 'en-GB', note: 'cool, surgical planner; never raises her voice' },
      'Tomasz': { gender: 'male', pitch: 1.12, rate: 1.18, accent: 'en-IE', note: 'frightened Polish safecracker, shaky and pleading' },
      'Marguerite': { gender: 'female', pitch: 1.08, rate: 1.05, accent: 'en-GB', note: 'grand society widow, theatrical, frightened underneath' },
      'Peacock Mask': { gender: 'female', pitch: 1.12, rate: 1.0, accent: 'en-GB', note: 'Marguerite masked: arch, purring, dangerous' },
      'Thorne': { gender: 'male', pitch: 0.7, rate: 0.85, accent: 'en-US', note: 'honey over a knife: slow, warm, menacing' },
      'Brandt': { gender: 'male', pitch: 0.5, rate: 0.8, accent: 'de-DE', note: 'huge security chief, few words, gravel' },
      'Pell': { gender: 'male', pitch: 1.25, rate: 1.12, accent: 'en-US', note: 'bored 23-year-old guard, nervous when pushed' },
    },
    warning: 'Contains: gunfire, implied murder, criminal betrayal.',
    vars: { heat: 1, trust: 2 },
    flags: [],
    hud: [
      { var: 'heat', label: 'Suspicion', icon: '🚨', max: 5 },
      { var: 'trust', label: 'Crew Trust', icon: '🤝', max: 5 },
    ],
    start: 'intro',
    scenes: {
      // =====================================================================
      intro: {
        title: '11:02 PM — The Launch',
        art: '🛥️💎',
        scene: 'sea',
        mood: 'night',
        weather: 'stars',
        text: [
          `Fifty-eight minutes to midnight, and the speedboat cuts its engine a hundred yards off Thorne Cay. The island glitters like an open jewelry box: lanterns strung down the cliffs, a string quartet bleeding Vivaldi across black water.`,
          `Your mask is gold filigree. Your gown is borrowed. Your name tonight is Isabel Crane, and Isabel has never stolen anything in her life.`,
          { speaker: 'Lux', say: `Comms check. Say something charming. Or just breathe heavy, I'm not picky.` },
          `Vega sits across from you in a tuxedo that fits like a verdict. Silver at the temples, calm as a surgeon. She planned Geneva. She planned Lisbon. Nobody who worked Lisbon has heard from her since.`,
          { speaker: 'Vega', say: `Thorne's guards rotate at 11:50. Tomasz is already inside with the caterers. You get us to the vault, he opens it, and at midnight four hundred guests take off their masks and we walk out wearing new faces.` },
          `She presses a tiny silver pillbox into your palm. One white tab inside.`,
          { speaker: 'Vega', say: `For emergencies. One tab, one glass, one sleeping problem.` },
          `Then her eyes drop to your clutch. Inside, under a false bottom, sits a forty-one-carat pear of flawless paste: a replica of the Widow's Tear you had cut in Antwerp, weight-matched to the gram. Nobody on this crew knows it exists.`,
          { speaker: 'Vega', say: `Anything in that bag I should know about?` },
        ],
        choices: [
          {
            text: 'Show her the paste',
            hint: 'Honesty. A strange new flavor.',
            effect: bump(0, 1),
            art: '💎',
            outcome: [
              `You flip the false bottom. The fake diamond catches the moonlight and throws a little blue ghost across Vega's cheek.`,
              `For a second something like respect crosses her face. Then she plucks it from your fingers and tucks it inside her jacket.`,
              { speaker: 'Vega', say: `Clever. I'll hold onto this. Wouldn't want you getting ideas.` },
              { speaker: 'Lux', say: `Ooh, she complimented you. You're basically in the will now.` },
            ],
            next: 'ballroom',
          },
          {
            text: 'Lie: "Lipstick and nerves."',
            hint: 'Keep your insurance.',
            set: ['paste'],
            art: '💄',
            outcome: [
              `You snap the clutch shut and give her the smile that once got you into the Monaco Yacht Club on a library card.`,
              `"Lipstick and nerves," you say. Vega holds your gaze one beat too long, then looks away toward the island.`,
              `The paste sits against your hip like a second heartbeat. Your insurance. Your secret. Your choice, later.`,
            ],
            next: 'ballroom',
          },
          {
            text: `Say nothing — and open a private line to Lux`,
            hint: 'Two can keep secrets.',
            set: ['paste', 'lux_private'],
            effect: bump(0, -1),
            art: '🎧',
            outcome: [
              `You shrug, let the silence answer for you, and press the hidden stud behind your earring twice: the private channel only you and Lux know about.`,
              { speaker: 'Lux', say: `...Private line. Spicy. Okay, partner. Whatever you're running, I'm listening, and Vega isn't.` },
              `Vega notices the silence. Vega notices everything. She files it away behind those flat grey eyes, and the boat growls toward the dock.`,
            ],
            next: 'ballroom',
          },
        ],
      },

      // =====================================================================
      ballroom: {
        title: '11:14 PM — The Ballroom',
        art: '🎭🥂',
        scene: 'ballroom',
        mood: 'gold',
        weather: 'sparkles',
        text: [
          `The ballroom is a cathedral of champagne. Chandeliers drip crystal, waiters glide with silver trays, and four hundred masked faces turn like sunflowers toward the man on the staircase.`,
          `Cassius Thorne: silver hair, a voice like warm honey poured over a knife. He raises a glass "to my beloved Elena, who taught me that beautiful things must be protected." The Widow's Tear was her diamond. She went over the rail of his yacht five years ago. The applause is a little too loud.`,
          `You lift a flute from a passing tray. Then a hand closes on your elbow — rings, perfume, a mask of peacock feathers.`,
          { speaker: 'Peacock Mask', say: `I know that laugh. *Celeste.* Monaco, three summers ago. You owe me four hundred thousand euros and a very good night's sleep.` },
          `Marguerite Vale. You took her for everything she was willing to lose. She is looking straight through your mask. Across the room, Thorne's security chief — a slab of a man named Brandt — turns his head.`,
          { speaker: 'Lux', say: `Uh. Is someone saying a name that isn't yours? Do something. Do it *now*.` },
        ],
        timer: 8,
        timeout: {
          text: 'You froze.',
          effect: bump(2, 0),
          art: '😱',
          outcome: [
            `You open your mouth. Nothing comes out.`,
            { speaker: 'Marguerite', say: `CELESTE MOREAU! Everyone, this woman is a *thief*!` },
            `Heads turn. Crystal stops clinking. Brandt starts moving, unhurried, the way sharks are unhurried. You drop your glass, gasp something about the powder room, and bolt for the nearest door. It's the kitchen.`,
          ],
          next: 'kitchen',
        },
        choices: [
          {
            text: 'Bluff: "You must have me confused."',
            hint: 'Hold her stare.',
            art: '🙂',
            outcome: [
              `"I'm so sorry," you say, all Connecticut vowels. "I've never been to Monaco. The light gives me migraines."`,
              `Marguerite's smile goes thin and delighted, like a cat that has been handed a second mouse. She threads her arm through yours.`,
              { speaker: 'Marguerite', say: `Of course, darling. Then you won't mind a little air.` },
              `Before you can object, she is steering you through the French doors and into the night.`,
            ],
            next: 'terrace',
          },
          {
            text: 'Distract: sweep the host into a waltz',
            hint: 'Hide in the brightest spotlight.',
            effect: bump(1, 0),
            art: '💃',
            outcome: [
              `You slip Marguerite's grip and step directly into the path of Cassius Thorne as he reaches the bottom of the stairs.`,
              `"Mr. Thorne. They're playing a waltz, and I refuse to waste it." The quartet, as if bribed, swells. Four hundred masks watch the host smile and take your hand.`,
              `Marguerite is left holding two champagne flutes and an expression like a struck match.`,
            ],
            next: 'dance',
          },
          {
            text: 'Sneak: vanish through the service door',
            hint: 'Waiters are invisible. Be invisible.',
            art: '🚪',
            outcome: [
              `You laugh lightly, as if she has told a joke, and turn so that a passing tray of oysters slides between you. Two steps. Three. The service door swings on a silent hinge.`,
              `When Marguerite looks again, there's only an empty champagne flute on a tray where you used to be.`,
            ],
            next: 'kitchen',
          },
        ],
      },

      // =====================================================================
      terrace: {
        title: '11:21 PM — The Terrace',
        art: '🌙🚬',
        scene: 'terrace',
        mood: 'sea',
        text: [
          `Wind off the ocean. Lanterns swaying. Below, the surf chews the rocks in a place where nobody would ever find a body.`,
          `Marguerite lights a cigarette with hands that are not quite steady. Up close, under the peacock feathers, she doesn't look angry. She looks frightened.`,
          { speaker: 'Marguerite', say: `Keep your four hundred thousand. I don't care. I know what you are, which means I know why you're here.` },
          { speaker: 'Marguerite', say: `Elena Thorne was my best friend. She called me the night she died. She said she'd recorded something on her phone — Cassius, his partners, the money, the girls on his boats. Two hours later she "fell". The phone was never found.` },
          `She glances up at the house, at the dark windows of the east wing where the vault sleeps.`,
          { speaker: 'Marguerite', say: `He keeps it with the diamond. Trophies, side by side. Bring me that phone and I never met Celeste Moreau. Refuse, and I start remembering out loud.` },
          { speaker: 'Lux', say: `Okay, that is way above my pay grade. Also, she's standing in front of the only stairs.` },
        ],
        choices: [
          {
            text: 'Shake on it: her silence for the phone',
            hint: 'A promise you may not keep.',
            set: ['marg_deal', 'knows_elena'],
            art: '🤝',
            outcome: [
              `You take the cigarette from her fingers, draw on it once, and hand it back.`,
              `"If it's there, you'll have it." Her grip on your hand is fierce. "And if anyone asks, we were discussing hats."`,
              { speaker: 'Marguerite', say: `Midnight, darling. When the masks come off, find me.` },
              `She sweeps back inside, laughing at nothing, loud and bright. Your best alibi just became your biggest liability.`,
            ],
            next: 'upgrade',
          },
          {
            text: `Drop Vega's tab into her champagne`,
            hint: 'One tab, one glass, one sleeping problem.',
            set: ['used_tab', 'marg_out'],
            effect: bump(0, 1),
            art: '💊',
            outcome: [
              `"Let me get you a fresh one," you say, and swap your flute for hers. The white tab hits the bubbles and dissolves with a hiss you feel more than hear.`,
              `She drinks to Elena. She drinks to justice. Four minutes later she is curled on a wicker chaise, mask askew, snoring like a duchess.`,
              { speaker: 'Vega', say: `Saw that on the balcony cam. Tidy. Very tidy.` },
              `You tuck a blanket over her shoulders. You tell yourself it's kindness.`,
            ],
            next: 'upgrade',
          },
          {
            text: 'Walk away and call her bluff',
            hint: `She won't talk. Probably.`,
            effect: bump(1, 0),
            art: '🚶‍♀️',
            outcome: [
              `"Remember whatever you like," you say. "Memory makes a terrible witness."`,
              `You leave her on the terrace with the wind and her dead friend. Behind you, her heels click back toward the ballroom. Toward Brandt, maybe. Or maybe just toward the bar.`,
              { speaker: 'Lux', say: `Cold. Like, Antarctic. Respect, but cold.` },
            ],
            next: 'upgrade',
          },
        ],
      },

      // =====================================================================
      dance: {
        title: '11:21 PM — The Waltz',
        art: '💃🕺',
        scene: 'ballroom',
        mood: 'gold',
        weather: 'sparkles',
        text: [
          `Thorne dances like a man who has never once been told no. One hand at your waist, the other cool and dry around your fingers. Up close he smells of cedar and money.`,
          { speaker: 'Thorne', say: `I don't know you. I know everyone.` },
          `"Isabel Crane," you say. "I came with the Harrows." There are no Harrows. He nods as though he has met them.`,
          `Inside his breast pocket, pressing against your forearm with every turn, you feel the edge of his keycard: black, embossed, the kind that opens private lifts and private problems.`,
          { speaker: 'Thorne', say: `My wife loved this waltz. Elena. She drowned, you know. Champagne and railings — a tragic combination.` },
          `He says it the way other men talk about the weather. His thumb presses, very slightly, into your spine.`,
          { speaker: 'Lux', say: `His heart rate just *dropped* while talking about his dead wife. That's not grief. That's a hobby.` },
        ],
        choices: [
          {
            text: 'Lift his keycard on the turn',
            hint: 'Two seconds. One spin.',
            set: ['keycard'],
            effect: bump(1, 0),
            art: '💳',
            outcome: [
              `The quartet climbs toward the crescendo. You let him spin you out, spin you back, and on the return your fingers slide into his pocket like they are coming home.`,
              `The card is inside your glove before the final note. Thorne bows. You curtsey. Overhead, a camera dome swivels just slightly too late — or just in time.`,
              { speaker: 'Lux', say: `Did you just pickpocket a billionaire during a *waltz*? I need to lie down.` },
            ],
            next: 'upgrade',
          },
          {
            text: 'Ask him what really happened to Elena',
            hint: 'Watch his eyes.',
            set: ['knows_elena'],
            art: '👁️',
            outcome: [
              `"Did she fall?" you ask softly. "Or was she helped?"`,
              `The music keeps going. Thorne doesn't miss a step. But his eyes go flat, like a shark rolling over.`,
              { speaker: 'Thorne', say: `Elena kept a diary of every unkind thing she ever imagined about me. I keep it in my vault, beside her diamond. Sentimental of me. Enjoy the party, Miss Crane.` },
              `He releases you mid-spin. Brandt is watching you from the stairs now. But you know where the secrets sleep.`,
            ],
            next: 'upgrade',
          },
        ],
      },

      // =====================================================================
      kitchen: {
        title: '11:21 PM — The Kitchen',
        art: '🔪🧊',
        scene: 'kitchen',
        mood: 'ember',
        text: [
          `Steam. Shouting in four languages. A chef flambés something and the ceiling briefly turns orange. Nobody looks twice at a woman in gold walking fast; they assume you're lost or rich, which here is the same thing.`,
          `At the back, the walk-in freezer door is open an inch. Through the gap: Tomasz, in a caterer's white jacket, hunched over a burner phone, breath fogging.`,
          { speaker: 'Tomasz', say: `Rourke, please. She's here. The inside woman. Vega comes at midnight, exactly like I told you.` },
          { speaker: 'Tomasz', say: `...No. No, you promised. Zosia's transfer to the clinic in Zurich. In writing, or I walk out right now.` },
          `He hangs up and presses the phone to his forehead. Your safecracker — the man with the shaking hands and the little girl with the failing kidneys — is an informant. And Interpol is coming to the party.`,
          { speaker: 'Lux', say: `Rourke. Agent Daniel Rourke, Interpol, financial crimes. Oh, this is bad. This is bad with sprinkles.` },
        ],
        choices: [
          {
            text: 'Step inside and shut the freezer door',
            hint: 'Make him talk.',
            set: ['knows_informant'],
            effect: bump(1, 0),
            art: '🥶',
            outcome: [
              `The freezer door thunks shut behind you. Tomasz spins, and the phone clatters across the frost-slick floor.`,
              { speaker: 'Tomasz', say: `It's not what — please. They have my file. Ten years if I don't help them. Zosia has six months if I can't pay for Zurich.` },
              `Outside, a sous-chef bangs on the door, yelling about the sorbet. Every second you stay in here, somebody notices one more thing.`,
              { speaker: 'Tomasz', say: `I never gave them your name. I swear it on her.` },
            ],
            next: 'upgrade',
          },
          {
            text: 'Say nothing. Record him on your phone.',
            hint: 'Leverage keeps.',
            set: ['knows_informant', 'recorded'],
            art: '📱',
            outcome: [
              `You raise your phone to the gap and catch the last ten seconds: his face, his voice, the name *Rourke*.`,
              `Then you back away, take a tray of champagne from a startled waiter, and walk out into the corridor as if you were born holding it.`,
              `Tomasz never sees you. That's the point. Whatever happens at the vault door, you'll be holding the only card nobody knows is in the deck.`,
            ],
            next: 'upgrade',
          },
        ],
      },

      // =====================================================================
      upgrade: {
        title: '11:33 PM — The East Gallery',
        art: '🖼️🔴',
        scene: 'corridor',
        mood: 'neon',
        text: [
          `The east gallery is all marble and Old Masters, and at the far end, behind a velvet rope, sits a steel door the color of a banker's heart. The vault.`,
          { speaker: 'Lux', say: `Okay. Bad news buffet. Thorne upgraded security last week. Thermal laser grid down this corridor, pressure pedestal inside, biometric pad on the door. Our blueprints are wallpaper.` },
          {
            if: 'lux_private',
            text: { speaker: 'Lux', say: `Private line — and it gets worse. Vega pulled the new specs *nine days ago*. Her login, her timestamp. She knew. She didn't tell you. Ask yourself why.` },
            else: `Vega doesn't sound surprised. Not even a little. You realize, with a cold slide in your stomach, that she knew about the upgrade before you ever got on the boat — and decided you didn't need to know.`,
          },
          { speaker: 'Vega', say: `Change of plan. The grid has a gap pattern — one opening every eleven seconds. You go through it, Tomasz follows. It's the only way in.` },
          { if: 'keycard', text: `Thorne's black keycard is warm inside your glove. Beside you, a mirrored panel hides the host's private lift.` },
          { if: hot(3), text: `Somewhere below, a radio crackles: *Chief wants eyes on every guest who left the ballroom.* That includes you.` },
          `Thirty seconds until a guard strolls around this corner. Choose.`,
        ],
        choices: [
          {
            text: `Follow Vega's plan: run the laser grid`,
            hint: 'She picked you for a reason.',
            effect: bump(0, 1),
            unset: ['keycard'],
            art: '🔴',
            outcome: [
              `"Fine," you say. "Talk me through it."`,
              { speaker: 'Vega', say: `Good. See? This is why I chose you.` },
              `You step out of your heels, hitch your gown to your knees, and duck under the velvet rope. Ahead, the air shimmers red.`,
            ],
            next: 'grid',
          },
          {
            text: 'Improvise: hit the security office instead',
            hint: 'She lied once. Why trust her twice?',
            effect: bump(0, -1),
            unset: ['keycard'],
            art: '🖥️',
            outcome: [
              `"No," you say. "If we're going in blind, I want their eyes, not your gap pattern."`,
              `A long silence on the line. You can hear Vega deciding exactly how much you're worth.`,
              { speaker: 'Vega', say: `Your funeral, Isabel. Security's down the west stairs.` },
              { speaker: 'Lux', say: `For the record, I love this. Also for the record, I'm terrified.` },
            ],
            next: 'security_office',
          },
          {
            if: 'keycard',
            text: `Use Thorne's keycard on his private lift`,
            hint: 'Ride straight down to the vault level.',
            unset: ['keycard'],
            art: '🛗',
            outcome: [
              `You press the black card to the mirrored panel. A soft chime, like a butler clearing his throat. The mirror slides aside to reveal a lift lined in walnut and brass.`,
              { speaker: 'Vega', say: `Where did you — never mind. Go.` },
              `The doors begin to close. And a hand the size of a dinner plate catches them.`,
            ],
            next: 'elevator',
          },
        ],
      },

      // =====================================================================
      grid: {
        title: '11:41 PM — The Laser Grid',
        art: '🔴🔴🔴',
        scene: 'vault',
        mood: 'neon',
        fx: 'heartbeat',
        text: [
          `Forty feet of marble floor. Forty feet of red light, beams crisscrossing at ankle, waist and throat, shifting in slow geometric waves. Each one reads body heat. Touch one and the house wakes up.`,
          `Through the haze, the vault door. Your bare feet are cold. Your pulse is not.`,
          { speaker: 'Vega', say: `Gap opens in three. Low beam lifts, middle drops. You'll have one breath. Don't think.` },
          { if: 'lux_private', text: { speaker: 'Lux', say: `Private line: I can freeze the grid for six seconds. Just for you. Vega will never know it was me.` } },
          { speaker: 'Lux', say: `Or I can kill the whole east wing's power. Very dramatic. Very noticeable.` },
        ],
        timer: 7,
        timeout: {
          text: 'You hesitated.',
          effect: bump(2, 0),
          art: '🚨',
          outcome: [
            `You hesitate one heartbeat too long. The gap closes. You throw yourself forward anyway.`,
            `A beam kisses your heel like a cigarette burn. Somewhere deep in the house, a silent alarm blinks from green to amber.`,
            { speaker: 'Lux', say: `Amber alert. Not the kid kind. The *we have about eight minutes before this goes red* kind.` },
          ],
          next: 'vault_door',
        },
        choices: [
          {
            text: 'Dive through the gap',
            hint: 'One breath.',
            fx: 'flash',
            art: '🤸‍♀️',
            outcome: [
              `Low beam lifts. Middle drops. You go.`,
              `A shoulder roll beneath a beam at chest height, one palm flat to the marble, one leg sliding under a line of red that warms your calf like sunburn. You come up on the far side with your heart trying to leave through your mouth.`,
              { speaker: 'Vega', say: `Beautiful. Textbook.` },
              `Behind you the grid keeps dancing, as if nobody was ever here.`,
            ],
            next: 'vault_door',
          },
          {
            text: 'Lux, kill the power',
            hint: 'Darkness is a disguise. So is panic.',
            effect: bump(1, 1),
            art: '🌑',
            outcome: [
              `"Do it," you say.`,
              `The gallery goes black. Far away in the ballroom, four hundred people gasp at once and the quartet hits a sour note. You walk through the dead grid in total darkness, one hand on the wall.`,
              { speaker: 'Lux', say: `Generator kicks in in ninety seconds. Also everyone in the house now knows something happened, so. Fun.` },
              `Below, a guard's radio crackles with Brandt's voice: *Check the east wing.*`,
            ],
            next: 'vault_door',
          },
          {
            if: 'lux_private',
            text: `Take Lux's private freeze`,
            hint: 'Six seconds. Nobody else knows.',
            art: '🧊',
            outcome: [
              `"Freeze it," you whisper.`,
              `The beams stop mid-sweep — a still photograph of red light — and you walk straight through them like a ghost through a wall. Six seconds. Five. The last beam unfreezes an inch behind your heel.`,
              { speaker: 'Lux', say: `Our little secret. You owe me a pony.` },
            ],
            next: 'vault_door',
          },
        ],
      },

      // =====================================================================
      security_office: {
        title: '11:41 PM — Security Office',
        art: '🖥️🍜',
        scene: 'office',
        mood: 'office',
        text: [
          `A windowless room at the bottom of the west stairs: forty monitors, one tired guard, a carton of cold noodles. His name tag says PELL. He looks about twenty-three and terminally bored.`,
          `Screen 14: the east gallery, red beams sweeping. Screen 22: the vault door. Screen 3: the ballroom, where Thorne is laughing on the staircase.`,
          { if: 'marg_out', text: `Screen 9: the terrace, where Marguerite snores on a wicker chaise with a blanket tucked to her chin.` },
          { speaker: 'Pell', say: `Ma'am? Guests aren't allowed down here.` },
          `His hand drifts, not quite casually, toward the radio on his belt.`,
          { speaker: 'Lux', say: `I'm knocking on their network, but I need something plugged into that keyboard. Get him away from it.` },
        ],
        choices: [
          {
            if: '!used_tab',
            text: 'Offer him your champagne',
            hint: `Vega's tab, finally earning its keep.`,
            set: ['used_tab'],
            art: '🥂',
            outcome: [
              `"I'm hiding from my husband," you sigh, sinking into the spare chair. "You look like you need this more than I do." The white tab drops into the flute on the way to his hand.`,
              `Pell glances at the door, then drinks. Three minutes of small talk later he is asleep with his cheek in his noodles.`,
              `You slide a USB stick into the console. Lux loops every camera in the east wing to an empty five-minute replay. On screen 22, the vault door sits alone forever.`,
            ],
            next: 'vault_door',
          },
          {
            text: `Bluff: "Mr. Thorne wants the gallery feed off."`,
            hint: 'Rich men have private reasons.',
            effect: (s) => bump(s.has('knows_elena') ? 0 : 1, 0)(s),
            art: '🎭',
            outcome: [
              `"Mr. Thorne is entertaining a guest in the east gallery," you say, letting the implication hang like perfume. "He'd prefer it not be recorded."`,
              {
                if: 'knows_elena',
                text: `"The way nothing was recorded the night Elena fell," you add. Pell goes white. Whatever the staff whisper about that night, he has heard it. He kills the feed and doesn't touch his radio.`,
                else: `Pell squints at you for a long second. Then he shrugs — rich people — and kills the feed. But as you turn to go, he lifts his radio: "Chief, flagging a guest request about the east gallery..."`,
              },
              `You plug a USB stick into the console on your way past. Lux is in.`,
            ],
            next: 'vault_door',
          },
          {
            text: 'Faint dramatically onto his keyboard',
            hint: 'Make him leave the desk.',
            effect: bump(1, 0),
            art: '😵',
            outcome: [
              `You sway, gasp something about the heat, and collapse face-first across the keyboard. The USB stick in your glove slides into a port on the way down.`,
              `Pell panics, radios for a medic, and runs for water. By the time he's back you're upright, blinking and apologizing, and Lux owns every camera on the island.`,
              { speaker: 'Lux', say: `Oscar-worthy. Small detail: he called it in, so the medic log now has your face in it.` },
            ],
            next: 'vault_door',
          },
        ],
      },

      // =====================================================================
      elevator: {
        title: '11:41 PM — The Private Lift',
        art: '🛗😶',
        scene: 'elevator',
        mood: 'castle',
        text: [
          `Brandt. Six-foot-five of grey suit, earpiece and old scar tissue, stepping into the lift beside you as the doors seal. The walnut walls suddenly feel like a coffin with very nice joinery.`,
          `He looks at you. He looks at the black card in your hand. He looks at you again.`,
          { speaker: 'Brandt', say: `That's Mr. Thorne's card.` },
          `The lift begins to descend. Three floors to the vault level. About forty seconds of your life to talk your way out of this.`,
          { speaker: 'Lux', say: `I can stop the lift between floors. I cannot make him less large.` },
        ],
        choices: [
          {
            text: `Play the tipsy guest who got "lost"`,
            hint: 'Giggle. Sway. Commit.',
            effect: bump(1, 0),
            art: '🍾',
            outcome: [
              `You giggle, sway into him, and pat the card against his chest. "Cassius said the wine cellar was down here. Are *you* the wine?"`,
              `Brandt's jaw works. He has been paid for twenty years not to embarrass rich men's guests. The doors open on the vault level and he steps out to steer you back — and Lux slams the doors shut between you.`,
              { speaker: 'Lux', say: `Lift's locked for two minutes. He's taking the stairs, and he's going to be *upset*.` },
            ],
            next: 'vault_door',
          },
          {
            if: 'knows_elena',
            text: `Tell him Thorne sent you for Elena's diary`,
            hint: 'Find the crack in his loyalty.',
            art: '📔',
            outcome: [
              `"He wants Elena's things moved tonight," you say quietly. "Before anyone comes asking again. You remember the questions, don't you, Mr. Brandt? You were on the boat."`,
              `It's a guess. It lands like a bullet. Something old and guilty moves behind his eyes.`,
              { speaker: 'Brandt', say: `I didn't see her go over. I didn't see anything.` },
              `When the doors open, he stays inside and rides back up alone, staring at his own reflection. He won't be reporting you tonight.`,
            ],
            next: 'vault_door',
          },
          {
            text: 'Hit the emergency stop and climb out the hatch',
            hint: 'Up and out. Gown be damned.',
            effect: bump(1, 0),
            fx: 'shake',
            art: '🧗‍♀️',
            outcome: [
              `You slam the red button. The lift lurches. Brandt grabs for you; you're already on the handrail, palm flat against the ceiling hatch, gown tearing to the hip.`,
              `You haul yourself into the shaft, kick the hatch shut on his fingers, and climb down the service ladder one floor in the dark, grease on your gloves and blood roaring in your ears.`,
              { speaker: 'Lux', say: `He's radioing. I'm scrambling. You're... wow, okay, you're really good at ladders.` },
            ],
            next: 'vault_door',
          },
        ],
      },

      // =====================================================================
      vault_door: {
        title: '11:49 PM — The Vault Door',
        art: '🔒🩺',
        scene: 'vault',
        mood: 'ice',
        text: [
          `The vault door is a foot of German steel with a three-wheel dial and a biometric pad that wasn't in any blueprint. Tomasz kneels before it in his caterer's jacket, stethoscope pressed to the steel, sweat running into his collar.`,
          { if: hot(3), text: `Somewhere above, boots are moving. Doors are opening. The house is waking up.`, else: `Above you, the party roars on, oblivious. For now.` },
          {
            if: 'knows_informant',
            text: `He glances up as you arrive, and you see the outline of the burner phone in his jacket pocket. You know who he called. You know who's coming.`,
            else: [
              `Your phone buzzes. A text from Lux, off the group channel:`,
              { speaker: 'Lux (text)', say: `tomasz's burner just pinged a nassau tower. interpol relay. someone on this crew is talking and it's the guy holding the stethoscope.` },
              `You look at Tomasz. Tomasz sees your face and goes grey. He knows that you know.`,
            ],
          },
          { speaker: 'Tomasz', say: `Two minutes and it's open. Two minutes. Please.` },
          { speaker: 'Vega', say: `Report, Isabel.` },
          `You could tell her. You could hear him out. Or you could stop trusting anybody on this island.`,
        ],
        choices: [
          {
            text: 'Hear Tomasz out',
            hint: 'A frightened father, or a rat?',
            set: ['spared_tomasz'],
            effect: bump(-1, 1),
            art: '🫂',
            outcome: [
              `You kneel beside him. "Talk. Fast."`,
              { speaker: 'Tomasz', say: `Rourke has my file. Ten years. And Zosia needs a clinic I can't afford. They promised papers, money, everything — if I deliver Vega. Not you. Never you.` },
              { if: 'recorded', text: `You show him the video on your phone. He watches himself, small and frozen in the freezer light, and closes his eyes. "Then you already know I'm telling the truth."` },
              `He texts Rourke with trembling thumbs — *Delay. Wait for 12:10* — then turns back to the dial and opens the vault like a man playing his last concerto.`,
            ],
            next: 'vault_inside',
          },
          {
            text: 'Tell Vega everything',
            hint: 'Loyalty to the planner.',
            set: ['sold_tomasz'],
            effect: bump(1, 1),
            art: '🗣️',
            outcome: [
              `"Tomasz is Interpol's," you say into the channel. "He's been feeding an agent called Rourke since before we landed."`,
              `Silence. Then Vega, perfectly calm: "Thank you. Let him finish the door."`,
              `Tomasz keeps turning the dial with tears running freely now. The door clunks open — and a man in a waiter's jacket, one of Vega's people you never knew existed, steps out of the shadows and walks him away in zip-ties. Rourke will notice his informant has gone quiet. Rourke will come early.`,
              { speaker: 'Vega', say: `Loyalty, Isabel. I remember it.` },
            ],
            next: 'vault_inside',
          },
          {
            text: 'Lock him out and crack it yourself',
            hint: 'Trust is a luxury.',
            set: ['locked_out'],
            effect: bump(0, -1),
            art: '🔐',
            outcome: [
              `You pull the stethoscope from around his neck. "Go back to the kitchen. Call whoever you want. You're done."`,
              `Tomasz stares at you, then at the dial, then turns and stumbles up the stairs without a word.`,
              { speaker: 'Vega', say: `What are you doing? Isabel. *Isabel.*` },
              `You mute her. It's just you, Lux, and a foot of German steel.`,
            ],
            next: 'dial',
          },
        ],
      },

      // =====================================================================
      dial: {
        title: '11:51 PM — The Dial',
        art: '🎚️👂',
        scene: 'vault',
        mood: 'ice',
        text: [
          `The dial is cold enough to bite. You press the stethoscope to the steel and hear the vault breathing: tumblers, springs, the faint electric hum of the new biometric pad.`,
          { speaker: 'Lux', say: `Three wheels plus the pad. I can fake the pad with Thorne's thumbprint off a champagne glass he held on camera. The wheels are on you. Guard rotation in about ninety seconds.` },
          `Your hands, for once in your life, are not steady.`,
        ],
        choices: [
          {
            text: 'Listen for the tumblers',
            hint: 'Old school. Slow. Silent.',
            art: '🩺',
            outcome: [
              `You close your eyes. Left until the first click — a soft *tock*, like a tongue against teeth. Right, past it twice, and there: the second. The third takes forever, then arrives all at once.`,
              `Lux fakes the print. The pad blinks green. The door sighs open on hydraulic hinges, and cold air spills out around your ankles like fog.`,
              { speaker: 'Lux', say: `You just did Tomasz's job in seventy seconds. He's going to be so hurt.` },
            ],
            next: 'vault_inside',
          },
          {
            text: `Drill the wheels and let Lux flood the pad`,
            hint: 'Fast. Loud.',
            effect: bump(1, 0),
            fx: 'shake',
            art: '🔩',
            outcome: [
              `You grab the compact drill from the catering cart Tomasz left behind. The whine is horrendous. Lux floods the pad with garbage data until it gives up and chimes.`,
              `The last wheel shears with a bang you feel in your fillings. The door swings. Somewhere upstairs, somebody definitely heard that.`,
              { speaker: 'Lux', say: `Subtle as a brass band. But we're in.` },
            ],
            next: 'vault_inside',
          },
        ],
      },

      // =====================================================================
      vault_inside: {
        title: `11:54 PM — The Widow's Tear`,
        art: '💎📁',
        scene: 'vault',
        mood: 'ice',
        weather: 'sparkles',
        enter: { unset: ['knows_informant', 'recorded'] },
        text: [
          `Inside, the vault is small and white and silent as a held breath. In the center, on a slim steel pedestal beneath a glass bell: the Widow's Tear.`,
          `Forty-one carats of pale blue fire, cut like a falling drop. It drinks the light and gives it back colder. For a moment you forget to breathe.`,
          `Beside the pedestal, on a plain shelf, sits a battered leather case. Inside: a cracked pink phone in a plastic bag, a diary in a woman's looping handwriting, and a thumb drive labelled in Thorne's neat script — *E. — insurance.*`,
          `You thumb the phone awake. Nine percent battery. One voice memo, pinned. You hear the first two seconds — a woman, terrified, whispering, *"If anything happens to me, it was Cassius—"* — and you stop it.`,
          { if: 'knows_elena', text: `Elena. The woman Thorne waltzes to. The friend nobody was allowed to mourn properly.` },
          { speaker: 'Lux', say: `Pedestal's weight-sensitive. Lift that stone and I can spoof the sensor for maybe ninety seconds before it screams.` },
          {
            if: 'locked_out',
            text: [`Vega's voice cuts back in — she has overridden your mute.`, { speaker: 'Vega', say: `Diamond only. Leave everything else. I am not asking.` }],
            else: { speaker: 'Vega', say: `Diamond only. Leave everything else. Whatever else is in there is not our business.` },
          },
          { if: 'paste', text: `Your clutch feels heavy against your hip. Forty-one carats of paste. Weight-matched to the gram.` },
          `Two hands. Six minutes to midnight.`,
        ],
        choices: [
          {
            text: 'Take the diamond. Stick to the job.',
            hint: 'What you came for.',
            set: ['took_diamond'],
            effect: bump(1, 1),
            art: '💎',
            outcome: [
              `You lift the glass bell. Lift the stone. It's heavier than it looks, and warm, as if it has been waiting for someone.`,
              `Behind you, Elena's phone lies in its plastic bag with nine percent battery and a dead woman's last words. You close the case. You leave it.`,
              { speaker: 'Vega', say: `Good. Now get out.` },
              `The pedestal begins a soft, patient countdown only Lux can hear.`,
            ],
            next: 'escape_router',
          },
          {
            text: 'Take the evidence. Leave the diamond.',
            hint: 'A murderer goes free if you walk away.',
            set: ['took_evidence'],
            effect: bump(0, -2),
            art: '📱',
            outcome: [
              `You slide the phone, the diary and the drive into your clutch, and leave the Widow's Tear exactly where it is, glittering under glass like the world's most expensive insult.`,
              { speaker: 'Vega', say: `What are you doing. What are you *doing*? Isabel, if you walk out of there without my stone—` },
              { speaker: 'Lux', say: `She's mad. Like, *deeply* mad. Also you're kind of my hero right now.` },
              `No alarm. No countdown. Just the quiet weight of a murder in your purse.`,
            ],
            next: 'escape_router',
          },
          {
            text: 'Grab both and run',
            hint: `Greed is fast. The pedestal is faster.`,
            set: ['took_diamond', 'took_evidence'],
            effect: bump(2, 0),
            fx: 'redflash',
            art: '🚨',
            outcome: [
              `You sweep the case under your arm and snatch the stone in the same motion. The pedestal rises a quarter inch, freed of its weight.`,
              `Lux's spoof can't cover a grab that clumsy. The lights shift from white to red. A siren starts low and climbs like a scream up a stairwell.`,
              { speaker: 'Lux', say: `Ninety seconds just became zero! Run! RUN!` },
            ],
            next: 'escape_router',
          },
          {
            if: 'paste',
            text: 'Swap in your paste — take the stone AND the evidence',
            hint: 'The insurance you never told anyone about.',
            set: ['took_diamond', 'took_evidence', 'swapped'],
            fx: 'flash',
            art: '🃏',
            outcome: [
              `You open the false bottom of your clutch. For one impossible second, two Widow's Tears sit side by side: one born in the earth, one born in Antwerp.`,
              `You set the paste on the pedestal at the exact instant you lift the real stone. The sensor doesn't blink. The countdown never starts. Then Elena's phone, diary and drive slide in beside the real diamond, and the clutch snaps shut.`,
              {
                if: 'lux_private',
                text: { speaker: 'Lux', say: `Private line: I did not see that. I am a blind, deaf, adorable little hacker. Also — *wow*.` },
                else: { speaker: 'Vega', say: `Status?` },
              },
              `"Got it," you tell Vega. Which is true. It just isn't the whole truth.`,
            ],
            next: 'escape_router',
          },
        ],
      },

      // =====================================================================
      escape_router: {
        redirect: (s) => (s.get('heat') >= 3 ? 'stairs_alarm' : 'stairs_quiet'),
      },

      stairs_alarm: {
        title: '11:57 PM — Red Light',
        art: '🚨🏃‍♀️',
        scene: 'stairwell',
        mood: 'blood',
        fx: 'redflash',
        text: [
          `The house is screaming. Red lights strobe down the servants' stairs; doors slam somewhere above; Brandt's voice bellows orders through every radio on the island. Three minutes to midnight, and everybody knows someone is in the walls.`,
          { if: 'sold_tomasz', text: `And out on the water: blue lights. Rourke didn't wait for midnight. Interpol launches are cutting toward the dock.` },
          { if: 'lux_private', text: { speaker: 'Lux', say: `Private line. Listen. Vega just told her driver to start the engine. She's not waiting for anybody, and "anybody" means you.` } },
          { speaker: 'Vega', say: `Boathouse. Now. I'm holding the boat.` },
          { speaker: 'Lux', say: `Or the roof — Thorne's helicopter is fuelled. Or the ballroom: at midnight everyone unmasks and it's chaos. Pick! Pick! PICK!` },
        ],
        timer: 6,
        timeout: {
          text: 'You hesitated.',
          set: ['route_crowd'],
          effect: bump(1, 0),
          art: '🧱',
          outcome: [
            `You hesitate on the landing, and a steel security shutter slams down across the stairwell below you with a boom like a cannon.`,
            `The only way left is through the service door — into the ballroom, into four hundred masks, into the countdown.`,
          ],
          next: 'midnight',
        },
        choices: escapeChoices(true),
      },

      stairs_quiet: {
        title: '11:57 PM — The Service Stairs',
        art: '🕰️🌒',
        scene: 'stairwell',
        mood: 'night',
        text: [
          `No sirens. Not yet. The party thunders on above you; the quartet has given way to a full band, and the bass comes through the walls like a second pulse. Three minutes to midnight.`,
          { if: 'sold_tomasz', text: { speaker: 'Lux', say: `Boats on the radar. No lights, moving fast. Interpol's early — somebody noticed their informant went quiet.` } },
          { if: 'lux_private', text: { speaker: 'Lux', say: `Private line. Vega just told her driver to have the engine running. Could be prudence. Could be she's leaving without you. I genuinely can't tell.` } },
          { speaker: 'Vega', say: `Boathouse. I'll wait.` },
          { speaker: 'Lux', say: `Options: boat, Thorne's helicopter on the roof, or blend into the ballroom when everyone unmasks. Clock's ticking, gorgeous.` },
        ],
        timer: 9,
        timeout: {
          text: 'You lingered.',
          set: ['route_crowd'],
          effect: bump(1, 0),
          art: '⏰',
          outcome: [
            `You linger a second too long, listening to the house, and above you the band stops dead. A roar goes up: the countdown has begun.`,
            `A pair of guards appear at the bottom of the stairs. You turn and walk the only way left — up, through the service door, into the ballroom.`,
          ],
          next: 'midnight',
        },
        choices: escapeChoices(false),
      },

      // =====================================================================
      dock: {
        title: '11:59 PM — The Boathouse',
        art: '🚤🌊',
        scene: 'sea',
        mood: 'sea',
        text: [
          `The boathouse smells of diesel and salt. The speedboat idles at the end of the slip, engine growling, and Vega stands at the wheel with one hand on the throttle.`,
          { if: trusted, text: `She sees you and something in her shoulders loosens. She waited. She actually waited.`, else: `She sees you and doesn't smile. The bow line is already off the cleat. Her driver has the engine in gear.` },
          { if: hot(4), text: `Behind you, flashlights spill down the cliff path. Out past the breakwater, a patrol boat swings its spotlight like a scythe.` },
          {
            if: evidenceOnly,
            text: { speaker: 'Vega', say: `Tell me you came to your senses. Tell me my diamond is in that bag.` },
            else: { speaker: 'Vega', say: `The stone. Show me the stone.` },
          },
          `Thirty feet of wet planks between you and the boat. Sixty seconds to midnight.`,
        ],
        choices: [
          {
            text: 'Toss Vega the bag',
            hint: 'Trust her with everything.',
            art: '👜',
            outcome: [
              `You throw. The clutch arcs over the black water and lands in her hands.`,
              {
                if: (s) => trusted(s) && s.has('took_diamond'),
                text: `Vega opens it, sees blue fire, and laughs — a real laugh, the first you've ever heard from her. She reaches out a hand to haul you aboard.`,
                else: `Vega opens it, looks inside, and closes it again. Then she looks at you with something almost like pity, and pushes the throttle forward.`,
              },
            ],
            next: (s) => (trusted(s) && s.has('took_diamond') ? 'end_clean' : 'end_left'),
          },
          {
            text: 'Keep the bag and jump aboard',
            hint: 'Possession is nine-tenths of the law.',
            art: '🦘',
            outcome: [
              `You run the length of the slip and leap.`,
              {
                if: hot(4),
                text: `The patrol boat's spotlight catches you in mid-air like a moth.`,
                else: {
                  if: trusted,
                  text: `You land hard on the deck, and Vega grabs your wrist to steady you. "Fine," she says. "Keep it. We'll argue later."`,
                  else: `You land on the deck. Vega's pistol is already out. "Bag stays. You go." Her driver tears the clutch from your hands and shoves you over the side into the cold black water.`,
                },
              },
            ],
            next: (s) => (hot(4)(s) ? 'end_shot' : trusted(s) ? (evidenceOnly(s) ? 'end_whistle' : 'end_clean') : 'end_left'),
          },
          {
            text: 'Shove Vega overboard and take the boat',
            hint: 'She was always going to leave you. Leave her first.',
            set: ['stole_boat'],
            scene: 'sea',
            fx: 'shake',
            art: '🌊',
            outcome: [
              `You hit Vega at full speed, shoulder to ribs. She goes over the gunwale into the black water with a sound like a dropped chandelier. Her driver takes one look at your face and jumps in after her.`,
              `You shove the throttle to the stops. The boat stands up on its tail and screams toward open sea.`,
              { if: hot(4), text: `Straight into the patrol boat's spotlight.` },
            ],
            next: (s) => (hot(4)(s) ? 'end_shot' : evidenceOnly(s) ? 'end_whistle' : 'end_solo'),
          },
        ],
      },

      // =====================================================================
      helipad: {
        title: '11:59 PM — The Helipad',
        art: '🚁💨',
        scene: 'rooftop',
        mood: 'storm',
        weather: 'rain',
        text: [
          `The roof is all wind. Thorne's helicopter crouches on the pad, rotors beginning to turn, a young pilot running pre-flight checks with his headset half on. Beyond the parapet: black ocean, the lights of the mainland, freedom twenty minutes away.`,
          { if: hot(3), text: `The roof door bangs open behind you. Brandt, out of breath, one hand inside his jacket.`, else: `Nobody has followed you. Yet. The pilot hasn't even looked up.` },
          `On the wall by the stairwell hangs a red emergency box. Behind the glass: a flare gun. Old, orange, very loud.`,
          { speaker: 'Lux', say: `I've got the flight plan. He's waiting for Thorne. Whatever you say, say it like you mean it.` },
        ],
        choices: [
          {
            text: `Bluff the pilot: "Mr. Thorne sent me ahead."`,
            hint: 'Confidence is a boarding pass.',
            art: '🗝️',
            outcome: [
              `You stride across the pad like you own it, mask in hand, hair whipping. "Cassius wants me on the mainland before the press arrives. Now, please."`,
              {
                if: hot(3),
                text: `The pilot blinks, hand on the collective. Then he looks past you — at Brandt — and very slowly takes his hand away.`,
                else: `The pilot is twenty-six and paid not to ask questions. He nods, waves you in, and the skids lift off the roof.`,
              },
            ],
            next: (s) => (hot(3)(s) ? 'end_shot' : evidenceOnly(s) ? 'end_whistle' : trusted(s) ? 'end_clean' : 'end_solo'),
          },
          {
            text: 'Grab the flare gun and take the chopper',
            hint: `You've flown twice. In a simulator.`,
            fx: 'flash',
            art: '🔫',
            outcome: [
              `You smash the glass, grab the flare gun and level it at the pilot through the open door. "Out." He goes. You've flown exactly twice, in a simulator, in Lisbon. It will have to do.`,
              {
                if: hot(4),
                text: `You haul on the collective and the helicopter lurches upward — just as Brandt reaches the edge of the pad with his pistol already raised.`,
                else: `The helicopter lurches, tilts, steadies. The island drops away beneath your feet like a jewelry box snapping shut.`,
              },
            ],
            next: (s) => (hot(4)(s) ? 'end_shot' : evidenceOnly(s) ? 'end_whistle' : 'end_solo'),
          },
        ],
      },

      // =====================================================================
      midnight: {
        title: '12:00 AM — The Unmasking',
        art: '🎭🎆',
        scene: 'ballroom',
        mood: 'gold',
        weather: 'sparkles',
        fx: 'heartbeat',
        text: [
          `You hit the ballroom just as the band stops. Four hundred guests turn toward the great clock above the staircase, glasses raised, masks still on, voices beginning the countdown.`,
          `*Ten. Nine. Eight.*`,
          `When it hits zero, every mask comes off. Every face becomes a face. Brandt's men are posted at every door, scanning.`,
          {
            if: 'marg_deal',
            text: `Across the room, Marguerite catches your eye. She lifts her peacock mask an inch: an offer.`,
            else: {
              if: 'marg_out',
              text: `Marguerite is still asleep on the terrace. In this room, nobody has ever heard of Celeste Moreau.`,
              else: `Somewhere in this crowd, Marguerite Vale is waiting to see your face.`,
            },
          },
          { if: 'took_evidence', text: `The clutch at your hip holds a dead woman's voice. On the staircase, Thorne is smiling, about to lead the toast.` },
          { speaker: 'Lux', say: `Guest launch leaves the main dock at 12:05. Whatever you're doing, do it on zero.` },
          `*Three. Two. One.*`,
        ],
        choices: [
          {
            text: 'Unmask with everyone — hide in plain sight',
            hint: 'Be one more beautiful nobody.',
            art: '🙂',
            outcome: [
              `You untie the ribbon and let the gold mask fall. A stranger kisses the air beside your cheeks, laughing. You laugh too. You are just one more face under the chandeliers, under a storm of gold confetti.`,
              { if: (s) => hot(3)(s) && !longCon(s), text: `Then a guard at the north door stops scanning, stares directly at you, and lifts his radio.` },
            ],
            next: (s) => (longCon(s) ? 'end_longcon' : hot(4)(s) ? 'end_unmasked' : evidenceOnly(s) ? 'end_whistle' : hot(3)(s) ? 'end_unmasked' : trusted(s) ? 'end_clean' : 'end_solo'),
          },
          {
            if: 'marg_deal',
            text: 'Trade masks with Marguerite',
            hint: 'She promised. Will she keep it?',
            set: ['traded_masks'],
            art: '🦚',
            outcome: [
              `You cross the floor in five strides as the room explodes with confetti. Marguerite presses her peacock mask into your hands and takes your gold one, and suddenly *she* is the mysterious woman Brandt's men are hunting — laughing in their faces, a famous widow's famous friend who knows exactly who she is and dares them to touch her.`,
              { if: 'took_evidence', text: `"Did you get it?" she breathes as you pass. You touch your clutch. Her eyes fill.`, else: `"No phone?" she whispers. You shake your head. Something in her face closes, but she keeps her word anyway.` },
            ],
            next: (s) => (longCon(s) ? 'end_longcon' : evidenceOnly(s) ? 'end_whistle' : trusted(s) ? 'end_clean' : 'end_solo'),
          },
          {
            text: 'Keep your mask on and head for the guest launch',
            hint: 'Slip out while they look at each other.',
            art: '🚶‍♀️',
            outcome: [
              `While four hundred people tear off their masks, you keep yours, gliding along the wall toward the garden doors. One gold mask in a sea of naked faces.`,
              { if: hot(3), text: `Which is exactly what Brandt's men are looking for.`, else: `The guard at the garden doors is watching the fireworks. He never once looks down.` },
            ],
            next: (s) => (hot(3)(s) ? 'end_unmasked' : evidenceOnly(s) ? 'end_whistle' : trusted(s) ? 'end_clean' : 'end_left'),
          },
        ],
      },

      // =====================================================================
      // ENDINGS
      // =====================================================================
      end_clean: {
        art: '🥂🌅',
        scene: 'dawn',
        mood: 'dawn',
        ending: { id: 'clean-getaway', title: 'Champagne Wishes', type: 'good' },
        text: [
          `Sunrise finds you on a different island, in a different dress, on a balcony over water so blue it looks fake.`,
          { if: 'route_boat', text: `The speedboat outran Thorne Cay's lights in eleven minutes flat. Vega didn't say a word the whole way. She just kept one hand on your shoulder, as if she was afraid you'd blow away.` },
          { if: 'route_heli', text: `Thorne's own helicopter set you down on a private strip at 12:40. Lux had a car waiting at the edge of the tarmac. Vega was in the back seat, holding two glasses.` },
          { if: 'route_crowd', text: `You left on the guest launch with a hundred tipsy billionaires singing Sinatra off-key. Vega was waiting at the marina with two coffees and a smile you'd never seen before.` },
          `Your share of the Widow's Tear, recut in Antwerp into four anonymous stones, comes to more money than you ever let yourself imagine.`,
          { if: 'swapped', text: `And Thorne doesn't even know he's been robbed. A paste diamond still sits under his glass bell, weight-matched to the gram. It will be months before anyone looks closely.` },
          { if: 'took_evidence', text: `Elena's phone sits on the table beside your coffee. Nine percent battery. You haven't decided what to do with it yet. You will.` },
          { if: 'spared_tomasz', text: `A postcard arrives a month later from Zurich. No signature. Just a child's crayon drawing of a blue diamond, and five words: *She's going to be okay.*` },
          { if: 'sold_tomasz', text: `You don't ask what happened to Tomasz. Vega doesn't tell you. Some nights you dream of a freezer door closing.` },
          { speaker: 'Lux', say: `Clean. Like, *operating-theatre* clean. Same time next year?` },
          `You raise your glass to the morning. Champagne for breakfast. You earned it.`,
        ],
      },

      end_left: {
        art: '⛓️🌊',
        scene: 'sea',
        mood: 'storm',
        fx: 'shake',
        ending: { id: 'left-behind', title: 'The Fall Girl', type: 'bad' },
        text: [
          { if: 'route_crowd', text: `The guest launch hums across the dark water toward the mainland. At the marina, Vega hugs you — a long, warm hug — and when she lets go, your clutch is on her arm and two Interpol jackets are walking down the jetty toward you.`, else: `The engine note fades into the dark until there's nothing left but the sea slapping at the pilings, and you, dripping, alone.` },
          `You understand it all at once, the way you understand a magic trick after the curtain falls. Vega never needed an inside woman. She needed someone to be standing in the light when it came on. Someone with a gold mask, a fake name, and a record in Monaco.`,
          { if: 'took_evidence', text: `Somewhere in all of it, Elena's phone disappears again. Into the sea, maybe. Or into Vega's pocket, to sell back to Thorne for a price.` },
          `Brandt reaches you first. Then the Interpol jackets. Then the flashbulbs.`,
          { if: 'sold_tomasz', text: `In the interrogation room, Agent Rourke slides a photograph across the table: Tomasz, zip-tied in a pantry. "Your friend Vega gave you up to save herself. Just like you gave him up. Funny how that goes."` },
          { if: 'spared_tomasz', text: `In the interrogation room, it's Tomasz who speaks up for you. It isn't enough. But Agent Rourke writes something down, and that's more than you expected.` },
          { speaker: 'Lux', say: `...I'm so sorry. I tried. I'm wiping everything. Don't say my name.` },
          `The papers will call you the Midnight Thief. They'll spell Vega's name wrong, if they mention her at all.`,
        ],
      },

      end_shot: {
        art: '🎆🩸',
        scene: 'void',
        mood: 'blood',
        fx: 'redflash',
        ending: { id: 'shot', title: 'Last Dance at Midnight', type: 'death' },
        text: [
          `The fireworks begin at midnight exactly, just as planned. Gold chrysanthemums bloom over Thorne Cay, and four hundred guests turn their faces up to the sky.`,
          { if: 'route_boat', text: `Nobody hears the shots from the water. The patrol boat's spotlight holds you like a lover. The first round takes the windscreen. The second takes you.` },
          { if: 'route_heli', text: `Nobody hears the shots on the roof. Brandt fires twice, calm as a man swatting a fly, and the night tilts sideways under the spinning blades.` },
          `You go down on your back, and for a strange slow moment the whole sky is falling light, and you think: *it's beautiful, actually. Elena would have liked this.*`,
          { if: 'took_diamond', text: `The Widow's Tear rolls out of your fingers and comes to rest a foot away, still glittering. It doesn't care who holds it. It never has.` },
          { if: 'took_evidence', text: `In your clutch, Elena's phone buzzes once with a low-battery warning, then goes dark forever. Her voice goes with it.` },
          { if: 'stole_boat', text: `Somewhere behind you in the black water, Vega is swimming for shore. She'll make it. Her kind always do.` },
          `The last thing you hear is Lux, very far away, saying your real name. The one nobody on this island ever knew.`,
        ],
      },

      end_unmasked: {
        art: '🎭🚔',
        scene: 'library',
        mood: 'gold',
        ending: { id: 'unmasked', title: 'Midnight Unmasking', type: 'bad' },
        text: [
          `Two guards reach you before the confetti hits the floor. Very polite. Very firm. A hand on each elbow, guiding you through the crowd while the band plays on and nobody looks.`,
          { if: (s) => !s.has('marg_deal') && !s.has('marg_out'), text: `Marguerite Vale watches you go, champagne in hand. She mouths a single word — *Celeste* — and raises her glass.` },
          { if: 'marg_deal', text: `Marguerite tries to push through the crowd toward you. A guard blocks her with one arm. Her face, over his shoulder, is a promise she can no longer keep.` },
          `Cassius Thorne is waiting for you in the library. He pours you a drink himself.`,
          {
            if: 'took_evidence',
            text: `He holds out his hand for your clutch. "Elena's things, I believe." He drops her phone into the fireplace and watches the pink case curl and blacken. "You see? Some secrets are simply better kept."`,
            else: `He takes the Widow's Tear from your clutch and holds it up to the lamp. "She always wore it better than you would have."`,
          },
          { if: 'swapped', text: `He never thinks to check the stone downstairs on the pedestal. That paste will sit in his vault for years — a joke only you know the punchline to.` },
          `Interpol arrives at 12:20. Agent Rourke looks at you, then at Thorne, then at his notes, like a man who expected a very different arrest.`,
          { speaker: 'Lux', say: `I'm going dark. Burn the earpiece. I'll find you a lawyer. A shark. The biggest shark.` },
        ],
      },

      end_whistle: {
        art: '📱⚖️',
        scene: 'dawn',
        mood: 'dawn',
        ending: { id: 'whistleblower', title: `The Widow's Justice`, type: 'true' },
        text: [
          `Three days later, Elena Thorne's voice plays on every news channel on Earth.`,
          `*"If anything happens to me, it was Cassius."*`,
          { if: 'route_boat', text: `You made the mainland at dawn, soaked and shaking, Elena's phone wrapped in a plastic bag against your ribs.` },
          { if: 'route_heli', text: `You set Thorne's own helicopter down in a car park outside Nassau and walked into a newsroom with the rotors still turning behind you.` },
          {
            if: (s) => s.has('route_crowd') && s.has('marg_deal'),
            text: `On the guest launch, you put the phone in Marguerite's hands. She held it to her chest and wept the whole way to the mainland. Then she called every editor she'd ever had lunch with.`,
            else: { if: 'route_crowd', text: `On the guest launch, you found a sleepy journalist from the society pages and changed her career forever with one thumb drive.` },
          },
          `The diary did the rest. The drive did more: accounts, shell companies, the names of the men who sat at Thorne's table, and of the girls who worked his boats.`,
          `They arrest Cassius Thorne on his own staircase, under his own chandeliers, in front of the press he invited for the anniversary of his wife's death.`,
          { if: 'spared_tomasz', text: `Agent Rourke gets his case — a far bigger one than Vega — and Tomasz gets his papers. Zosia goes to Zurich in the spring.` },
          { if: 'sold_tomasz', text: `You make one anonymous call to Rourke about a safecracker zip-tied in a pantry. It doesn't undo anything. It's a start.` },
          `The Widow's Tear goes into an evidence locker. You never touched it. Some nights you think about the weight of it. Mostly you don't.`,
          { speaker: 'Lux', say: `So: no diamond, no money, and Vega has put a price on your head. Best heist ever. I mean that.` },
        ],
      },

      end_solo: {
        art: '💎🌑',
        scene: 'sea',
        mood: 'night',
        ending: { id: 'solo-act', title: 'Party of One', type: 'neutral' },
        text: [
          `You don't look back until the island is a smudge of light on the horizon, and then nothing at all.`,
          { if: 'stole_boat', text: `Vega is somewhere behind you in the black water, swearing in three languages, swimming for shore. She will make it. She will remember.` },
          { if: 'route_heli', text: `You ditch Thorne's helicopter on a sandbar off Andros and wade ashore in a ruined gown, carrying your shoes in one hand and a fortune in the other.` },
          { if: 'route_crowd', text: `You step off the guest launch at the marina and just keep walking. Vega isn't there. Nobody is. That's the point.` },
          { if: (s) => s.has('route_boat') && !s.has('stole_boat'), text: `You took the boat. You took the stone. You took the long way home.` },
          `The Widow's Tear sits in your palm. All of it. Not a quarter. Not a share. Forty-one carats of pale blue fire.`,
          `And every fence from Antwerp to Macau has already heard that Vega wants it back. That Thorne wants it back. That Interpol would like a word.`,
          { if: 'took_evidence', text: `You have Elena's phone, too. Maybe it's leverage. Maybe it's a conscience. You haven't decided which is heavier.` },
          { if: 'swapped', text: `At least the paste is still sitting on Thorne's pedestal. It'll be weeks before he notices. You're going to need every one of them.` },
          { speaker: 'Lux', say: `I'm still here, if that counts. You're not totally alone. Just... mostly.` },
          `Rich. Hunted. Alone. A diamond is forever. So, it turns out, is looking over your shoulder.`,
        ],
      },

      end_longcon: {
        art: '💎🃏',
        scene: 'dawn',
        mood: 'gold',
        weather: 'sparkles',
        ending: { id: 'long-con', title: 'The Real Tear', type: 'secret' },
        text: [
          `Here is what really happened at the Midnight Gala — though only three people will ever know it.`,
          `At 11:02 PM, you lied to Vega about a bag full of lipstick. At 11:49, you heard a frightened father out instead of handing him over. At 11:54, you set Antwerp's finest paste on a pressure pedestal and walked away with the real Widow's Tear and a dead woman's voice in the same little gold clutch.`,
          { if: 'traded_masks', text: `And at midnight you traded masks with Marguerite Vale, who laughed in Brandt's face while you walked out the garden doors wearing peacock feathers.`, else: `And at midnight you took off your mask with four hundred other people, and not one of them saw a thing.` },
          `On the guest launch, you put Elena's phone, the diary and the drive into Tomasz's shaking hands. At the marina he hands them to Agent Rourke: the biggest case of Rourke's career, delivered by his favorite informant. Zosia's papers clear by Friday.`,
          `Vega gets nothing. Vega gets *exactly* what she planned for you: an empty boat, a missing partner, and Interpol asking polite questions about Lisbon.`,
          `Cassius Thorne is arrested nine days later. In the inventory of his vault, the police list one item of note: *pear-cut blue stone, approx. 41ct, believed to be the Widow's Tear.* The appraiser's report, filed a week after that, contains a single puzzled word.`,
          `*Paste.*`,
          `By then you're in a café in Lisbon where nobody knows your name, turning pale blue fire over and over between your fingers.`,
          {
            if: 'lux_private',
            text: [{ speaker: 'Lux', say: `Private line, forever. Half of everything, right? ...Right?` }, `You smile. Half of everything is still everything.`],
            else: { speaker: 'Lux', say: `Wait. WAIT. The vault inventory says... oh, you magnificent liar.` },
          },
          `You were never Vega's inside woman. You were running your own game from the moment you stepped on that boat. And the Widow's Tear finally belongs to someone who earned it.`,
        ],
      },
    },
  });
})();
