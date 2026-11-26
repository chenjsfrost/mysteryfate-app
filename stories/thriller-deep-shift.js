/* MysteryFate story: Deep Shift (thriller) */
(function () {
  'use strict';

  // ---- helpers (Danger clamped 0..5 to keep simulation compact) ----
  const clamp = (v) => Math.max(0, Math.min(5, v));
  const danger = (n) => (s) => s.setVar('danger', clamp(s.get('danger') + n));
  const hot = (n) => (s) => s.get('danger') >= n;
  // fair-play evidence against the saboteur
  const proof = (s) => s.count('shears', 'tape', 'slip', 'report', 'glove');
  const allies = (s) => s.count('trust_kenji', 'trust_grace', 'trust_lou');
  // secret: the incident report + Kenji and Grace on your side + nobody ever locked up
  const onAir = (s) => s.has('report') && s.has('trust_kenji') && s.has('trust_grace') && !s.has('locked');

  registerStory({
    id: 'thriller-deep-shift',
    title: 'Deep Shift',
    category: 'thriller',
    tagline: 'The roster says seven crew. You count eight at dinner.',
    description: `You are the night technician on Halcyon-9, an offshore drilling rig two hundred kilometres out in a North Sea storm. The radio just died. The roster says seven crew, but there are eight people at dinner, and nobody can agree on which one of them doesn't belong.`,
    cover: '🛢️',
    accent: '#ff7a1a',
    ambient: 'thriller',
    warning: 'Contains: industrial danger, toxic gas, near-drowning, a death in the past, peril.',
    scene: 'rig',
    voices: {
      narrator: { gender: 'male', pitch: 0.85, rate: 0.95, accent: 'en-GB', note: 'low, steady, salt-roughened; a man telling this story in a pub years later' },
      'Grace': { gender: 'female', pitch: 0.95, rate: 1.0, accent: 'en-GB', note: 'rig supervisor, clipped, by-the-book, holding something back' },
      'Tomás': { gender: 'male', pitch: 1.15, rate: 1.12, accent: 'en-US', note: 'medic, warm and kind, jumpy, talks a little too fast' },
      'Kenji': { gender: 'male', pitch: 0.75, rate: 0.88, accent: 'en-US', note: 'saturation diver, very calm, very few words' },
      'Lou': { gender: 'male', pitch: 0.8, rate: 1.1, accent: 'en-IE', note: 'Big Lou Delaney, roughneck, loud, suspicious of everyone' },
      'Sully': { gender: 'male', pitch: 1.05, rate: 1.05, accent: 'en-AU', note: 'the new hire, easy charm, an answer for everything' },
      'Vos': { gender: 'male', pitch: 0.9, rate: 0.85, accent: 'en-GB', volume: 0.6, note: 'injured crane operator, barely conscious' },
      'Tannoy': { gender: 'neutral', pitch: 0.6, rate: 0.9, accent: 'en-GB', note: 'flat automated rig alarm announcement' },
      'Pilot': { gender: 'female', pitch: 1.05, rate: 1.1, accent: 'en-US', note: 'helicopter pilot, brisk, shouting over rotors' },
    },
    vars: { danger: 1 },
    flags: [],
    hud: [{ var: 'danger', label: 'Danger', icon: '⚠️', max: 5 }],
    start: 'intro',
    scenes: {
      // =====================================================================
      intro: {
        title: '19:40 — The Mess, Halcyon-9',
        art: '🍲🧍',
        scene: 'kitchen',
        mood: 'storm',
        weather: 'rain',
        text: [
          `The roster on the mess-room wall says seven. You have counted the people eating Pike's stew three times now, and the answer is still eight.`,
          `Halcyon-9 sits on four steel legs two hundred kilometres out in the North Sea, and tonight the North Sea is trying to pull them out. Every wave that hits the rig comes up through the floor as a shudder. The cutlery hums. Nobody has mentioned that the radio went dead at seven-fifteen.`,
          `Grace Achterberg, supervisor, eats with her back to the wall. Tomás Ferreira, the medic, keeps glancing at the door. Kenji Mori, the diver, has not said a word. Vos, the crane operator. Pike, the cook. You. And Big Lou Delaney, who has also counted to eight and is now pointing his spoon across the table like a gun.`,
          { speaker: 'Lou', say: `Him. Sully. I've done eleven years on this rig and I've never seen that face. Who hired you, sunshine?` },
          { speaker: 'Sully', say: `Agency, mate. Crew change on Monday, same chopper as you. You were asleep with your mouth open. Lovely snoring, very rhythmic.` },
          { speaker: 'Grace', say: `The roster is correct. Finish your dinner, all of you.` },
          `Correct for whom? The roster lists seven names. Sully's is not one of them. But Lou swears Vos came out on a different contractor, Tomás thinks Pike was on leave, and Kenji is staring at Sully as if he has seen a ghost.`,
        ],
        choices: [
          {
            text: 'Ask Grace to show you the full manifest',
            hint: 'The supervisor has the real list.',
            art: '📋',
            outcome: [
              `"Grace. The helicopter manifest, not the wall roster. Let's settle it."`,
              `She looks at you for a long beat. Her hand moves, very slightly, to the breast pocket of her coveralls, where the corner of a folded yellow telex sheet is showing.`,
              { speaker: 'Grace', say: `The manifest is company property, and it's locked in my office, and we have bigger problems than Lou's memory. Radio room. Now. Everybody.` },
              `She has not answered the question. Everyone at the table notices that she has not answered the question.`,
            ],
            next: 'radio_room',
          },
          {
            text: 'Ask Sully straight out who he is',
            hint: 'Charm only goes so far.',
            art: '🙂',
            outcome: [
              `"Sully. Full name, home town, who signed your ticket."`,
              { speaker: 'Sully', say: `Daniel Sullivan. Fremantle, originally. Signed by some bloke in Aberdeen with a moustache and a cold. I'm a roustabout, I do what I'm told and I'm very good at mops. Anything else? Blood type? It's O-positive. Universal donor. You're welcome.` },
              `It is a good answer. It is a *perfect* answer, every piece in place, delivered with a grin. Across the table, Kenji sets down his spoon very carefully, as if it might break.`,
              { speaker: 'Kenji', say: `Fremantle.` },
              `That is all he says. Then Grace is on her feet, telling everyone to come to the radio room.`,
            ],
            next: 'radio_room',
          },
          {
            text: `Back Lou: search the new guy's bunk`,
            hint: 'If he has nothing to hide...',
            set: ['photo'],
            effect: danger(1),
            fx: 'shake',
            art: '🛏️',
            outcome: [
              `You and Lou are out of the mess before Grace can stop you. Sully's bunk is in the B-block cabin he supposedly shares with Vos. His holdall is almost empty: work gloves, a paperback, a waterproof pouch.`,
              `Lou tears the pouch open. Inside is a single photograph, laminated: a young man in a dive suit on this deck, on *this* rig, grinning at the camera with a helmet under his arm. On the back, in marker: *M.R. — Halcyon-9 — June 2019.*`,
              { speaker: 'Lou', say: `What's he carrying a picture of a dead diver for? Everyone knows what happened down the moonpool in '19. Nobody talks about it.` },
              `Sully is in the doorway, smiling. It doesn't reach his eyes. "That's mine," he says, very quietly, and holds out his hand. Behind him, Grace is shouting for everyone to get to the radio room.`,
            ],
            next: 'radio_room',
          },
        ],
      },

      // =====================================================================
      radio_room: {
        title: '19:58 — The Radio Room',
        art: '📻✂️',
        scene: 'lab',
        mood: 'night',
        text: [
          `The radio room is a cupboard of humming grey racks behind the control room. The main set is dark. Somebody has pulled the rear panel off and cut every cable behind it: power, antenna feed, the satellite modem. The copper ends fan out like dead flowers.`,
          `The spare handheld is gone from its charger. The satellite phone is gone from its case.`,
          { speaker: 'Lou', say: `That's not a fault. That's a man with a pair of cutters. One of *us*.` },
          `Tomás arrives last, hair wet, breathing hard. "Sorry, sorry, I was in the infirmary. What happened? Is everyone all right?"`,
          { speaker: 'Grace', say: `Vos went out to check the pipe-deck lashings twenty minutes ago and hasn't come back. Nobody goes anywhere alone. Lou, pipe deck. Kenji, check the dive spread and the standby generator. I'm going to my office to try the beacon. Pick a partner.` },
        ],
        choices: [
          {
            text: 'Look closely at the cut ends first',
            hint: 'Every minute Vos lies in the rain counts.',
            set: ['shears'],
            effect: danger(1),
            art: '🔍',
            outcome: [
              `You crouch with a torch while Lou swears at you from the door. The cuts are clean. Not crushed, not twisted: every cable sheared on a neat diagonal, the way a sharp angled blade bites.`,
              `Lou's bolt cutters would have mashed them flat. Pike's kitchen scissors couldn't get through the armoured feed. This was done with something made for cutting through tough material in one stroke, by a hand that has done it many times. Something like trauma shears.`,
              `"Done?" Lou snarls. "Because Vos might be bleeding out." You follow him out into the storm.`,
            ],
            next: 'pipe_deck',
          },
          {
            text: 'Go with Lou to find Vos on the pipe deck',
            hint: 'Out into the storm.',
            art: '🌊',
            outcome: [
              `Lou hands you a lifejacket and a torch without a word, which from Lou is practically a hug.`,
              `The door to the pipe deck takes both of you to open. The wind rips it out of your hands and slams it against the wall, and then you are outside, in the screaming dark, with the rain coming sideways.`,
            ],
            next: 'pipe_deck',
          },
          {
            text: 'Go with Kenji down to the dive spread',
            hint: 'The quiet one. The one who stared.',
            art: '🤿',
            outcome: [
              `Kenji just nods and starts walking. You follow him down three flights of steel stairs, the rig groaning around you like a ship, into the warm machine-smell of the lower decks.`,
              `He doesn't speak until the door to the dive locker shuts behind you. Then he says, without turning round: "You were looking at Sully. So was I."`,
            ],
            next: 'dive_locker',
          },
          {
            text: 'Stay with Grace and her beacon',
            hint: 'The woman with the yellow telex.',
            art: '📟',
            outcome: [
              `Grace doesn't look thrilled, but she doesn't refuse. You walk with her down the accommodation corridor to the supervisor's office, a steel box with a porthole full of black water and a desk covered in permits.`,
              `She unlocks the office with a key from around her neck, and you notice she unlocks the grey filing cabinet in the corner too, before anything else. Just to check something is still there.`,
            ],
            next: 'grace_office',
          },
        ],
      },

      // =====================================================================
      pipe_deck: {
        title: '20:06 — The Pipe Deck',
        art: '🌧️🔦',
        scene: 'pipes',
        mood: 'storm',
        weather: 'rain',
        fx: 'shake',
        text: [
          `The pipe deck is a steel field of stacked drill pipe lashed down with chains, open on three sides to a sea you can hear but not see. Waves burst white against the legs below, and the spray comes over the rail forty metres up.`,
          `You find Vos by the gas manifold, face down in a puddle of rainwater and hydraulic oil. There is blood in his hair. He is breathing, just. His torch is still on, pointed at a valve wheel.`,
          `At the far end of the deck, behind the pipe racks, a second torch beam moves. Somebody is out here with you. The beam goes still, and then goes out.`,
          { speaker: 'Lou', say: `Did you see that? DID YOU SEE THAT?` },
        ],
        choices: [
          {
            text: 'Help Lou carry Vos inside',
            hint: 'A man first. Mysteries later.',
            set: ['trust_lou'],
            art: '🤝',
            outcome: [
              `You get Vos's arm over your shoulder and Lou takes the rest of him, all ninety kilos, as if he were a sack of flour. Together you stagger him back through the door while the wind tries to pull all three of you over the rail.`,
              { speaker: 'Lou', say: `You didn't go running off after shadows. Good. You're all right, you. I'll remember that.` },
              `In the corridor light, the blood on Vos's head is bright and fresh. Something hard hit him from behind.`,
            ],
            next: 'infirmary',
          },
          {
            text: 'Check the valve his torch is pointing at',
            hint: 'He was looking at something when he fell.',
            set: ['tape'],
            art: '🔧',
            outcome: [
              `Lou hauls Vos away on his own, cursing your name. You crouch at the manifold. The torch is pointed at the bypass valve on the gas line, the one that should be locked closed with a red tag.`,
              `The tag is gone. The valve has been cracked a quarter-turn open, and the wheel is fixed in place with neat white strips of tape. Not duct tape. Cloth tape, the thin perforated kind that tears straight. Medical tape.`,
              `You can't close it alone in this wind; the wheel is seized. You take a photo on your phone with shaking hands and follow Lou inside.`,
            ],
            next: 'infirmary',
          },
          {
            text: 'Chase the second torch',
            hint: 'Whoever it is, they hit Vos.',
            effect: danger(1),
            set: ['caught_sully'],
            fx: 'shake',
            art: '🏃',
            outcome: [
              `You sprint between the pipe racks, skidding on wet steel, a chain whipping past your face. You come round the last stack and slam your torch beam into a face.`,
              `Sully. Soaked to the bone, a small waterproof camera in his hand, pointed at the blowout-preventer control lines running down the leg.`,
              { speaker: 'Sully', say: `Whoa, whoa! Checking the lashings, like the boss said! I heard Vos yelling and I... is he all right?` },
              `He is lying. You know he is lying, because he is holding a camera, not a spanner. But there's no blood on his hands, and Vos was hit from behind. Lou bellows for you, and by the time you look back, Sully is already walking toward the door, helpful as anything.`,
            ],
            next: 'infirmary',
          },
        ],
      },

      // =====================================================================
      dive_locker: {
        title: '20:06 — The Dive Locker',
        art: '🤿🫧',
        scene: 'basement',
        mood: 'sea',
        text: [
          `The dive locker smells of neoprene and old seawater. Helmets hang on hooks like severed heads. Beyond the glass is the moonpool: a square hole through the middle of the rig, straight down to the sea, black water heaving up and down its steel walls with every wave.`,
          `Kenji checks the dive compressor, the gauges, the hatch on the decompression chamber. He moves slowly and precisely, like he's underwater even here.`,
          { speaker: 'Kenji', say: `In 2019 my bell partner died in that water. Mick Rourke. The report said diver error. Alcohol in his blood. Mick did not drink.` },
          `He turns and looks at you, and for the first time tonight you see what is under the calm. It is not calm at all.`,
          { speaker: 'Kenji', say: `Sully has Mick's eyes.` },
        ],
        choices: [
          {
            text: 'Tell Kenji everything you have seen tonight',
            hint: 'Someone has to trust someone.',
            set: ['trust_kenji'],
            art: '🤝',
            outcome: [
              `You tell him about the eight at dinner, Grace's telex, the cut cables. He listens without interrupting. When you finish he nods once.`,
              { speaker: 'Kenji', say: `Okay. I watch your back. You watch mine. Nobody else.` },
              `He takes a dive knife from the rack and slides it into his boot. It is the most reassuring and the most frightening thing anyone has done all night.`,
            ],
            next: 'infirmary',
          },
          {
            text: 'Ask what really happened to Mick',
            hint: 'Sully has Mick\'s eyes.',
            set: ['sully_truth'],
            art: '🕯️',
            outcome: [
              `"What really happened, Kenji?"`,
              { speaker: 'Kenji', say: `Bell umbilical valve. Known fault. Company was told six times. They didn't fix it. Mick's gas went bad at sixty metres. I brought him up. Too late.` },
              { speaker: 'Kenji', say: `Then the medic did the blood test. The supervisor wrote the report. I signed what they put in front of me. I had a daughter, a mortgage. Mick had a little brother in Australia who wrote me letters for a year. I never answered.` },
              `The real report, he says, is in this rig somewhere. The company told them to shred it. He doesn't think anyone did.`,
            ],
            next: 'infirmary',
          },
          {
            text: 'Inspect the dive compressor cabling',
            hint: 'If they cut the radio, what else?',
            set: ['shears'],
            art: '🔌',
            outcome: [
              `Behind the compressor, the control cable for the chamber's emergency vent has been cut and then twisted back together with electrical tape, so it looks fine from the front.`,
              `You peel back the tape. The copper is sheared on a clean diagonal, every strand, the same as you'd get from heavy-duty angled shears. Not pliers. Not a knife.`,
              { speaker: 'Kenji', say: `Trauma shears. We use them to cut off wetsuits.` },
              `He looks at the cut for a long time. Then he fixes it properly, without being asked, and the two of you head up toward the infirmary, where somebody is shouting.`,
            ],
            next: 'infirmary',
          },
        ],
      },

      // =====================================================================
      grace_office: {
        title: `20:06 — The Supervisor's Office`,
        art: '📁📟',
        scene: 'office',
        mood: 'office',
        text: [
          `Grace pulls the emergency beacon out of its bracket, twists the cap and presses a button. A small red light starts to blink. Somewhere, a satellite is listening.`,
          { speaker: 'Grace', say: `The beacon sends our position. Not a message, just a position. Coastguard can't fly in this. If the storm breaks at dawn, someone might come.` },
          `On her desk is the yellow telex she was hiding at dinner. It is upside down, but you can read upside down. *MERIDIAN OFFSHORE — CONFIDENTIAL. Regulator inspection 14th inst. File HN9-19-07 to be destroyed in full before arrival. Acknowledge.*`,
          `In the corner, the grey filing cabinet is still unlocked. Grace sees you looking at it.`,
        ],
        choices: [
          {
            text: 'Ask her straight what the company wants',
            hint: 'Honesty, in a room full of secrets.',
            set: ['trust_grace'],
            art: '🗣️',
            outcome: [
              `"Grace. What's in file 19-07?"`,
              `For a moment you think she'll order you out. Then her shoulders drop an inch, which on Grace is a collapse.`,
              { speaker: 'Grace', say: `The death of Mick Rourke. The real version: the valve they wouldn't pay to fix, and a blood test that was changed afterwards. I was a junior then. They told me to shred it, and I've been "about to" for five years. If that cabinet burns, I'm the woman who did as she was told. If it doesn't, I'm unemployed. Tonight I'm not sure which I'd prefer.` },
              { speaker: 'Grace', say: `I triggered the beacon before the company could tell me not to. That's my rebellion for the night. Don't tell anyone I'm human.` },
            ],
            next: 'infirmary',
          },
          {
            text: 'Take the file while she works the beacon',
            hint: 'Evidence first. Apologise later.',
            set: ['report'],
            effect: danger(1),
            art: '🗂️',
            outcome: [
              `Grace turns to the porthole to angle the beacon toward the sky. You slide the cabinet drawer open, find *HN9-19-07*, and fold the thin file into the front of your coveralls.`,
              `Inside, you glimpse a dive log, a valve inspection report flagged *URGENT — NOT ACTIONED* six times, and a lab sheet for Mick Rourke's blood test, signed by the rig medic: *T. Ferreira.*`,
              `When Grace turns back, the drawer is shut. But she looks at the cabinet, then at you, and something in her face closes like a hatch.`,
            ],
            next: 'infirmary',
          },
          {
            text: 'Accuse her of covering something up',
            hint: 'Push until she breaks.',
            effect: danger(1),
            art: '☝️',
            outcome: [
              `"You knew something was wrong before the radio died. You're hiding orders. Maybe you cut the radio yourself."`,
              { speaker: 'Grace', say: `I have been on rigs for twenty-two years and I have never cut a cable I didn't have a permit for. If you want to know who has secrets about 2019, ask the man who took the blood sample.` },
              `She marches you out of her office and locks it behind you. On the way down the corridor, you realise you don't know who took the blood sample. But someone on this rig does.`,
            ],
            next: 'infirmary',
          },
        ],
      },

      // =====================================================================
      infirmary: {
        title: '20:31 — The Infirmary',
        art: '🩹💉',
        scene: 'lab',
        mood: 'office',
        text: [
          `Vos lies on the treatment bed with a dressing on his scalp and an oxygen mask over his face. Tomás works fast, gloved in blue nitrile, talking to himself in Portuguese under his breath.`,
          { if: 'trust_lou', text: `Lou stands guard at the door with his arms folded, nodding to you as you come in.`, else: `Lou is pacing the corridor outside, muttering about the new guy.` },
          `Tomás has a fresh bandage on his own left hand. "Ration tin," he says, when he sees you looking. "Stupid." The trauma kit is open on the counter, its instruments in a row of elastic loops. One loop, the long one at the end, is empty.`,
          { speaker: 'Tomás', say: `His sats are low. Did he breathe much of it out there? How long was he lying in it?` },
          `In it. Nobody has said anything yet about anything to breathe.`,
        ],
        choices: [
          {
            text: 'Confide in Tomás: you think it is Sully',
            hint: 'He is the kindest person here.',
            set: ['told_tomas'],
            art: '🤫',
            outcome: [
              `You lower your voice. "Tomás, I think it's Sully. He's not on the roster. He was out there tonight. If anything else happens, I'll be the one watching him."`,
              `Tomás grips your arm, warm and grateful. "Thank God. I thought I was the only one. Be careful, okay? Tell me where you are, always. I don't want to be patching *you* up next."`,
              `He smiles. You feel better. For about four minutes.`,
            ],
            next: 'gas_alarm',
          },
          {
            text: '"Breathe much of *what*, Tomás?"',
            hint: 'Nobody said anything about gas.',
            set: ['slip'],
            effect: danger(1),
            art: '❓',
            outcome: [
              `"Breathe much of what?"`,
              `The room goes very still. Tomás's hands stop on Vos's dressing for less than a second, then carry on.`,
              { speaker: 'Tomás', say: `Rain. Spray. Seawater. He was lying in a puddle, no? Aspiration. You know... medical things.` },
              `He laughs, and it is a perfectly normal laugh, and he does not look at you again. You have the feeling you have just stepped on something in the dark that moved.`,
            ],
            next: 'gas_alarm',
          },
          {
            text: 'Sit with Vos while Tomás works',
            hint: 'He was there. He saw something.',
            set: ['tape'],
            art: '🛏️',
            outcome: [
              `You pull up a stool and hold Vos's hand. Tomás goes to the cupboard for more saline. Vos's eyes flutter open, unfocused, and his fingers dig into yours.`,
              { speaker: 'Vos', say: `Bypass... someone taped it open. White tape. Like... like a bandage. I turned round to... and then...` },
              `Tomás is back. "Shh. Don't excite him." He presses something into Vos's IV line, and Vos's eyes slide shut again. "Sedative. He needs to rest."`,
            ],
            next: 'gas_alarm',
          },
        ],
      },

      // =====================================================================
      gas_alarm: {
        title: '20:44 — Gas Alarm',
        art: '🚨☠️',
        scene: 'pipes',
        mood: 'toxic',
        fx: 'redflash',
        text: [
          `Every light on the rig turns red at once. A siren starts, a rising and falling whoop that you feel in your teeth.`,
          { speaker: 'Tannoy', say: `Gas. Gas. Gas. Hydrogen sulphide detected, pipe deck, manifold area. All personnel to muster. Gas. Gas. Gas.` },
          `Hydrogen sulphide. Rotten eggs at low doses. At high doses, it kills your sense of smell first, so you stop noticing it, and then it kills you. The bypass valve on the pipe deck is open, and the wind is blowing the gas straight toward the accommodation block.`,
          { if: 'tape', text: `You think of white medical tape, wrapped round a valve wheel.` },
          `The emergency breathing sets are in the corridor. The manifold is forty metres away through the storm. The siren keeps rising.`,
        ],
        timer: 8,
        timeout: {
          text: 'You froze in the red light.',
          set: ['lou_down'],
          effect: danger(2),
          art: '😵',
          outcome: [
            `You stand in the corridor with your heart slamming, and you don't move, and Lou does. He pulls on a breathing set, kicks the pipe-deck door open, and disappears into the storm.`,
            `It takes him three minutes to close the valve. He collapses on the way back. Kenji and Grace drag him in by his harness. He is breathing, barely, when Tomás gets the oxygen on him.`,
            `The siren stops. The red lights don't.`,
          ],
          next: 'aftermath',
        },
        choices: [
          {
            text: 'Grab a breathing set and run for the manifold',
            hint: 'Close it yourself.',
            fx: 'shake',
            art: '🏃',
            outcome: [
              `You rip a breathing set off the wall, jam the mask on, crack the cylinder, and hit the pipe-deck door with your shoulder.`,
              `The storm swallows you. Through the fogging mask, the world is red light and rain and the hiss of your own breath. Forty metres. Thirty. The manifold rises out of the dark.`,
            ],
            next: 'manifold',
          },
          {
            text: 'Get everyone to the muster point, masks on',
            hint: 'Headcount. Who is missing?',
            effect: danger(1),
            art: '📢',
            outcome: [
              `You bang on every door, shouting, and herd them into the muster station: Grace, Lou, Pike, Kenji carrying Vos. You hand out masks. You count. Seven, with Vos. Then eight, as Sully jogs in with his mask already on.`,
              `Kenji goes out with a breathing set and closes the valve in four minutes flat, calm as a man changing a light bulb.`,
              `Tomás arrives last. Not from the infirmary. From the *pipe-deck* stairwell, breathing hard, a breathing set over his shoulder that is wet with rain. "I went to help Kenji," he says. Kenji, behind him, says nothing at all.`,
            ],
            next: 'aftermath',
          },
          {
            text: 'Get Vos out of the infirmary first',
            hint: 'He cannot walk.',
            effect: danger(1),
            art: '🛏️',
            outcome: [
              `You run back to the infirmary. Tomás is in the doorway with his coat on. "Leave him," he says. "The gas won't reach this side. Moving him will do more harm." But the gas detector on the infirmary wall is already ticking yellow.`,
              `You ignore him, unhook Vos's drip, and drag the bed into the corridor and down toward the muster point. Tomás doesn't help. When you look back, he's gone.`,
              `Lou and Kenji get the valve closed between them. Vos stays asleep through all of it, which is probably a mercy.`,
            ],
            next: 'aftermath',
          },
        ],
      },

      // =====================================================================
      manifold: {
        title: '20:47 — The Manifold',
        art: '🔧☠️',
        scene: 'pipes',
        mood: 'toxic',
        weather: 'rain',
        fx: 'heartbeat',
        text: [
          `The bypass valve shrieks as gas tears through it. The wheel is seized solid, and when your torch hits it you see why: it has been bound in place with white tape, layer on layer, soaked and tight.`,
          `Next to it is the flare line valve. Open that, and the gas diverts out along the flare boom over the sea, where the pilot flame will burn it off. Unless the pressure is too high and the flame flashes back down the line.`,
          { if: hot(3), text: `The pressure needle is deep in the red. Your mask's low-air whistle starts to chirp.`, else: `The pressure needle is climbing, but it is still on the right side of the red.` },
        ],
        choices: [
          {
            text: 'Tear off the tape and close the valve by hand',
            hint: 'Slow. Brutal. Certain.',
            set: ['tape'],
            art: '💪',
            outcome: [
              `You claw at the tape with your gloves, then your teeth, then your knife. It comes away in long white strips that the wind snatches out of your hand. Medical tape. You'd know it anywhere: it's on every finger-cut on this rig.`,
              `Then you get both hands on the wheel and pull until something in your back pops. It turns. A quarter. A half. The shriek drops to a hiss, and then to nothing.`,
              `You get back inside with one strip of tape still stuck to your glove. You put it in your pocket.`,
            ],
            next: 'aftermath',
          },
          {
            text: 'Open the flare line and burn it off',
            hint: 'Fast. If the pressure holds.',
            set: ['vented'],
            fx: 'flash',
            art: '🔥',
            outcome: [
              `You wrench the flare valve open. The gas roars away down the boom toward the pilot flame at the end of it, a hundred metres out over the black water.`,
              { if: hot(3), text: `The pressure is too high. You see the flare at the end of the boom bloom into a ball of orange, and then you see the orange coming back, down the line, toward you, faster than anything should move.`, else: `For one long second nothing happens. Then the flare at the end of the boom roars up into a twenty-metre column of orange fire, lighting the storm from underneath, and the needle on the gauge falls and falls.` },
            ],
            next: (s) => (hot(3)(s) ? 'end_blowout' : 'aftermath'),
          },
          {
            text: 'Back off and seal the deck door',
            hint: 'Contain it. Live.',
            set: ['lou_down'],
            effect: danger(2),
            art: '🚪',
            outcome: [
              `Your air whistle shrieks. You back away, stumbling, and get inside, and slam the door, and dog the latches down.`,
              `Lou goes out after you with a fresh set, cursing you in a voice muffled by his mask. He gets the valve shut, eventually. He doesn't get back on his own. Kenji and Grace drag him in by his harness, grey-faced, breathing in shallow sips.`,
            ],
            next: 'aftermath',
          },
        ],
      },

      // =====================================================================
      aftermath: {
        title: '21:30 — The Mess, Again',
        art: '🔒🧍',
        scene: 'kitchen',
        mood: 'blood',
        weather: 'rain',
        text: [
          `The siren is off. Eight people and one unconscious man sit in the mess under the red emergency lights, and nobody is eating now. A coffee cup slides an inch along the table every time a wave hits.`,
          { if: 'lou_down', text: `Lou lies on two pushed-together benches with an oxygen mask on, grey and wheezing. Grace has taken over his anger for him.`, else: `Lou has a length of chain in one hand and a padlock in the other. There's a paint locker in the corridor with a steel door.` },
          { speaker: 'Grace', say: `That valve was opened deliberately. Someone on this rig is trying to kill us. Until the storm breaks, I want them where they can't do it again.` },
          {
            if: 'lou_down',
            text: { speaker: 'Tomás', say: `It's him. It's obviously him. He was out on the deck. He's not on the roster. I'm sorry, Sully, but... it's obvious.` },
            else: { speaker: 'Lou', say: `The new guy goes in the locker. Tonight. Nobody's arguing.` },
          },
          `Sully sits very still with his hands flat on the table. For the first time all night, he doesn't have a joke.`,
          { speaker: 'Sully', say: `Lock me up if you want. But the person who opened that valve is going to be very happy you did.` },
        ],
        choices: [
          {
            text: 'Help them lock Sully in the paint locker',
            hint: 'Safe is better than sorry.',
            set: ['locked', 'locked_sully', 'trust_lou'],
            art: '🔒',
            outcome: [
              `You take one of Sully's arms. He doesn't fight. He walks into the paint locker, sits down on a drum of anti-fouling, and looks up at you.`,
              { speaker: 'Sully', say: `When you work it out, I'm in here. Don't take too long.` },
              `The padlock clicks. Everyone breathes out. Tomás pats your back. "You did the right thing," he says. You feel worse than you did before.`,
            ],
            next: 'moonpool',
          },
          {
            text: 'Stand in front of Sully: nobody gets locked up',
            hint: 'Paranoia is how this ends badly.',
            effect: danger(1),
            art: '✋',
            outcome: [
              `You step between Sully and the chain. "No. We lock someone in a box on a rig that might sink, we'd better be sure. We're not sure."`,
              { if: 'lou_down', text: `Grace stares at you for a long time. Then she sits down. "Fine. Then you can watch him."`, else: `Lou squares up to you, a head taller and a lot wider. For a second the whole room holds its breath. Then he spits on the deck and throws the chain down. "Your funeral."` },
              `Behind you, Sully says, very quietly: "Thank you." Across the room, Tomás is watching you with an expression you can't read.`,
            ],
            next: 'moonpool',
          },
          {
            text: 'Propose buddy pairs instead: nobody ever alone',
            hint: 'A rule, not a cage.',
            set: ['trust_grace'],
            art: '👥',
            outcome: [
              `"Locking him up only works if we're right. If we're wrong, the real one is free and we've stopped looking. Pairs. Nobody alone, not for a second, not to piss. Everyone watches everyone."`,
              `Grace looks at you, and for the first time tonight something like respect crosses her face.`,
              { speaker: 'Grace', say: `That's the first sensible thing anyone's said since dinner. Pairs. I'll draw them.` },
            ],
            next: 'moonpool',
          },
          {
            text: 'Lock Lou up before he hurts someone',
            hint: 'The loudest man in the room.',
            if: '!lou_down',
            set: ['locked'],
            effect: danger(1),
            fx: 'shake',
            art: '⛓️',
            outcome: [
              `"Lou's the one with the chain. Lou's the one who's been out on the pipe deck all night. Lou found Vos." It comes out of your mouth before you've really thought it.`,
              `It takes four of you. Lou roars, and swings, and catches Pike in the ribs, and then he's in the paint locker, hammering on the door hard enough to dent it. "YOU'RE WRONG! YOU'RE ALL WRONG!"`,
              `The hammering goes on for a long time. When it stops, the quiet is worse.`,
            ],
            next: 'moonpool',
          },
        ],
      },

      // =====================================================================
      moonpool: {
        title: '03:50 — The Moonpool',
        art: '🌊🕳️',
        scene: 'basement',
        mood: 'sea',
        weather: 'bubbles',
        text: [
          `At ten to four, the dive compressor starts up on its own. You feel it through your bunk: a deep mechanical throb from the bottom of the rig, where nobody should be.`,
          {
            if: 'locked_sully',
            text: `You go down alone. On the way you pass the paint locker. It's silent. You don't know if that's good.`,
            else: `Sully is already in the corridor, fully dressed, as if he'd been waiting. "You hear that? Come on. You'll want to see this."`,
          },
          `The moonpool room is a steel well of noise. The black square of water heaves up the walls and drops away again, slapping and sucking. There is no safety rail on the near side; there never is. Someone has switched on the decompression chamber's console, and its screen glows green in the dark.`,
          { if: 'told_tomas', text: `You told Tomás where you'd be. You remember that now, for no reason at all.` },
        ],
        choices: [
          {
            text: 'Make Sully tell you who he really is',
            hint: 'No jokes this time.',
            if: '!locked_sully',
            set: ['sully_truth'],
            art: '📷',
            outcome: [
              `"No more Fremantle. Who are you?"`,
              `He takes the laminated photo out of his chest pocket and holds it up in the green light. The grinning diver.`,
              { speaker: 'Sully', say: `Daniel Rourke. Mick was my brother. He died right there, in that water, and the company sent my mum a letter saying he'd been drunk. He was twenty-six and he didn't drink. I forged a badge, got on a crew-change chopper, and nobody looked twice. You know why? Because nobody on this rig ever looks twice. That's how Mick died.` },
              { speaker: 'Sully', say: `I'm here to prove it. Photos of every corroded line. And the real report, if anyone kept it. I didn't cut your radio. I'd have *used* your radio.` },
            ],
            next: 'plunge',
          },
          {
            text: 'Read the 2019 entries in the dive log',
            hint: 'The console is already open to them.',
            if: 'locked_sully',
            set: ['sully_truth'],
            art: '📖',
            outcome: [
              `Somebody has left the chamber console open on the archive. June 2019. *Diver: M. Rourke. Bellman: K. Mori.* The entries stop mid-dive. The last line is in capitals: *UMBILICAL VALVE FAILURE — DIVER UNRESPONSIVE.*`,
              `Below it, a scanned page. A letter from a Mrs Rourke in Western Australia, asking for her son's dive logs. Under it, a company stamp: *NO RESPONSE.* Clipped to the corner of the scan is a photograph: Mick, and beside him, a skinny teenage boy with a very familiar grin.`,
              `Sully. Mick Rourke's little brother. And you locked him in a paint locker.`,
            ],
            next: 'plunge',
          },
          {
            text: 'Check the chamber vent valve',
            hint: 'Why is the compressor running?',
            set: ['tape'],
            art: '🔩',
            outcome: [
              `You find the reason the compressor is running: someone has opened the chamber's gas feed and wrapped the vent valve shut, so the pressure is building in a sealed steel tube. If anybody had been in there, they'd be dead. If nobody is, it is a bomb.`,
              `The vent is wrapped in white perforated tape. The same tape. You tear it off and open the vent, and the chamber sighs like something waking up.`,
            ],
            next: 'plunge',
          },
          {
            text: 'Shout up the stairwell for Kenji',
            hint: 'He said he would watch your back.',
            set: ['trust_kenji'],
            art: '📣',
            outcome: [
              `"KENJI!" Your voice rings up the stairwell. A door bangs three decks up, and then the sound of feet coming down, fast but not panicked.`,
              { speaker: 'Kenji', say: `I'm here. I've got you.` },
              `But he is still two flights up when the lights go out.`,
            ],
            next: 'plunge',
          },
        ],
      },

      // =====================================================================
      plunge: {
        title: '03:58 — In the Water',
        art: '🌊🫧',
        scene: 'sea',
        mood: 'sea',
        weather: 'bubbles',
        fx: 'shake',
        text: [
          `Darkness. Then two hands, flat on your back, and a hard shove.`,
          `You hit the water of the moonpool and it is so cold it stops your heart for a beat. It closes over your head. A wave surges up the shaft and slams you against the steel wall, and then drags you down with it as it falls, down toward the open sea under the rig.`,
          `As you went over, in the instant of falling, you saw a hand in the green glow of the console. Gloved. Blue.`,
          `Your lungs are already burning. Above you: the rungs of the ladder, somewhere. Beside you, the dive bell's guideline, a taut cable leading down to the bell hanging under the rig with its pocket of air. Or you can try to scream.`,
        ],
        timer: 7,
        timeout: {
          text: 'You panicked.',
          art: '🫧',
          outcome: [
            `You thrash. You don't choose. The next wave falls away and takes you with it, down past the bottom edge of the moonpool, out under the hull, where there is no up any more.`,
            `The last thing you see is the green glow of the console, far above, wavering, getting smaller.`,
          ],
          next: 'end_drowned',
        },
        choices: [
          {
            text: 'Kick for the ladder',
            hint: 'Straight up. The obvious way out.',
            art: '🪜',
            outcome: [
              `You kick upward, find a rung with your fingertips, and haul your face into the air, gasping.`,
              {
                if: 'told_tomas',
                text: `Someone is crouched at the top of the ladder. They knew exactly where you'd come up. A boot comes down on your fingers, and then the long steel boat hook pushes against your chest, gently, patiently, until you let go.`,
                else: `Nobody is waiting for you. Whoever shoved you is gone, sure the sea would do the rest. You crawl out onto the grating, coughing up the North Sea.`,
              },
            ],
            next: (s) => (s.has('told_tomas') ? 'end_drowned' : (s.has('report') ? 'helideck' : 'archive')),
          },
          {
            text: 'Follow the guideline down to the dive bell',
            hint: 'Air, if you can reach it.',
            effect: danger(1),
            art: '🔔',
            outcome: [
              `It is insane. You do it anyway. Hand over hand down the cable, ears screaming, three metres, five, eight, into the black, until your head bursts up into the bell's trapped bubble of air and a dim emergency light.`,
              `You hang in the bell for what feels like an hour, breathing stale air, until the surges calm. Then you go back up the line, slowly, and climb out of the moonpool alone, blue with cold. Whoever shoved you thinks you are dead. That might be useful.`,
            ],
            next: (s) => (s.has('report') ? 'helideck' : 'archive'),
          },
          {
            text: 'Surface and scream for help',
            hint: 'Someone might be close.',
            art: '🆘',
            outcome: [
              `You claw for the surface and scream as you break it, one ragged word, swallowing seawater.`,
              {
                if: (s) => !s.has('locked_sully') || s.has('trust_kenji'),
                text: {
                  if: (s) => !s.has('locked_sully'),
                  text: `A hand grabs your collar. Sully is flat on the grating, half over the edge, hauling you up with both arms while the next wave tries to take you both. "Got you. Got you. Not again. Not in this water, not again."`,
                  else: `Kenji's hand. He is face down on the grating, arm in the water to the shoulder, and he does not let go when the wave hits. He pulls you out as if you weigh nothing. "Not again," he says. "Not in this water."`,
                },
                else: `Nobody answers. The only person who heard you is the one who pushed you, and they are already climbing the stairs. The wave falls away, and takes you with it.`,
              },
            ],
            next: (s) => (!s.has('locked_sully') || s.has('trust_kenji') ? (s.has('report') ? 'helideck' : 'archive') : 'end_drowned'),
          },
        ],
      },

      // =====================================================================
      archive: {
        title: '05:10 — The Sack Store',
        art: '🔥📁',
        scene: 'basement',
        mood: 'night',
        enter: { set: ['glove'] },
        text: [
          `Wrapped in a blanket, still shaking, you go looking for the only thing that explains any of this: file 19-07. Grace's office is open and the grey cabinet is empty.`,
          `You find her two decks down in the sack store, among pallets of drilling mud, crouched over a steel bin. She has the file in one hand and a lighter in the other. Her thumb is on the wheel.`,
          { speaker: 'Grace', say: `Somebody nearly killed you tonight because of this. Maybe if it's gone, it stops. Maybe that's what it wants.` },
          `You think of a blue nitrile glove in the green light.`,
        ],
        choices: [
          {
            text: 'Talk her down',
            hint: 'She has wanted to say no for five years.',
            set: ['report', 'trust_grace'],
            art: '🗣️',
            outcome: [
              `"Grace. If that burns, Mick Rourke was drunk forever. And whoever pushed me into the moonpool gets everything they wanted. You didn't shred it for five years. Don't do it tonight."`,
              `Her thumb stays on the lighter. The flame doesn't come. Then she holds the file out to you, and her hand is shaking worse than yours.`,
              { speaker: 'Grace', say: `Lab sheet's on page four. Look at the signature. I've been looking at it for five years.` },
              `Page four. Mick Rourke's toxicology, blood alcohol 0.11. Signed: *T. Ferreira, Medic.*`,
            ],
            next: 'helideck',
          },
          {
            text: 'Snatch the file out of her hands',
            hint: 'No more talking.',
            set: ['report'],
            effect: danger(1),
            fx: 'shake',
            art: '🤜',
            outcome: [
              `You lunge. The lighter skitters across the deck; the file is in your hands. Grace doesn't fight you for it. She just sits back on a sack of barite and puts her face in her hands.`,
              `You flick through it by torchlight. Page four: Mick Rourke's toxicology, blood alcohol 0.11, a number that would have made a diver legless. Signed: *T. Ferreira, Medic.*`,
              `When you look up, Grace is gone, and you have no idea where.`,
            ],
            next: 'helideck',
          },
          {
            text: 'Let her burn it',
            hint: 'Maybe she is right. Maybe it stops.',
            art: '🔥',
            outcome: [
              `You say nothing. Grace takes your silence for permission. The lighter clicks. The file curls and blackens in the bin, valve reports and dive logs and a lab sheet you never get to read.`,
              `She watches it burn with the face of a woman at a funeral. "Thank you," she says, and you don't know if she means it.`,
            ],
            next: 'helideck',
          },
        ],
      },

      // =====================================================================
      helideck: {
        title: '06:40 — The Helideck',
        art: '🚁🌅',
        scene: 'rooftop',
        mood: 'dawn',
        weather: 'rain',
        fx: 'shake',
        enter: { set: ['glove'] },
        text: [
          `Dawn comes up the colour of a bruise. The storm has eased to a hard grey wind, and out of it, low over the waves, comes the thudding of rotors. Grace's beacon worked.`,
          `The helicopter drops onto the deck in a hurricane of spray. The pilot leans out and holds up ten fingers: ten minutes before the next band of weather closes the window. One trip. Everyone or no one.`,
          { if: 'lou_down', text: `Kenji and Pike carry Lou up the stairs on a stretcher.` },
          `The crew stumble up onto the helideck in survival suits. Tomás is first in line, carrying his medical bag, and he stops dead when he sees you. You were supposed to be at the bottom of the moonpool. For half a second his face is an open window, and then it shuts.`,
          { if: hot(4), text: `Under your feet, the whole rig groans. Somewhere below, a gas detector is ticking again.` },
        ],
        timer: 8,
        timeout: {
          text: 'You hesitated.',
          effect: danger(1),
          art: '🚁',
          outcome: [
            `You hesitate, and Tomás doesn't. He ducks under the rotor wash and swings himself and his bag into the cabin, first aboard, a medic helping with the stretcher. Perfectly natural.`,
            { if: hot(5), text: `Below you, deep in the rig, the bypass valve you thought was closed lets go with a sound like a giant clearing its throat.`, else: `He sits by the door with the bag on his knees, and smiles at you, and waits.` },
          ],
          next: (s) => (hot(5)(s) ? 'end_blowout' : 'confrontation'),
        },
        choices: [
          {
            text: 'Block the door: nobody boards yet',
            hint: 'Ten minutes. Use them.',
            art: '🚫',
            outcome: [
              `You plant yourself in the helicopter's doorway with your arms out. The pilot yells something the rotors eat. Eight faces in survival suits turn toward you.`,
              `"Nobody gets on this aircraft until we decide who the eighth person is. And who opened that valve."`,
            ],
            next: 'confrontation',
          },
          {
            text: `Grab Tomás's medical bag`,
            hint: 'What is so important he carries it himself?',
            set: ['shears'],
            fx: 'flash',
            art: '💼',
            outcome: [
              `You yank the bag off his shoulder before he can react and tip it out onto the wet deck. Bandages. Saline. A roll of white perforated tape. A pair of heavy angled trauma shears, the jaws flecked with tiny bright curls of copper.`,
              `And a cheap kitchen timer, wired to a solenoid valve actuator. The kind you'd fit to a gas line if you wanted it to open itself after everyone was safely in the air.`,
              `Tomás looks at the timer, then at you. He doesn't run. There's nowhere to run.`,
            ],
            next: 'confrontation',
          },
          {
            text: 'Get Vos and the injured aboard first',
            hint: 'Whatever happens next, they go.',
            effect: danger(-1),
            art: '🛏️',
            outcome: [
              `You grab a corner of Vos's stretcher and run it under the rotors, bent double, and the pilot hauls it in. Then Lou's, or Pike's arm, whoever needs a shoulder. The injured are in. Whatever happens next on this deck, they're out of it.`,
              `When you turn back, the rest of the crew are standing on the helideck in a loose circle. Waiting for someone to say it.`,
            ],
            next: 'confrontation',
          },
        ],
      },

      // =====================================================================
      confrontation: {
        title: '06:46 — Eight',
        art: '🧍❓',
        scene: 'rooftop',
        mood: 'storm',
        weather: 'rain',
        text: [
          `Rotor wash flattens the rain. Eight people on a square of wet steel above a grey sea, and every one of them is looking at you.`,
          { if: 'locked_sully', text: `Sully stands apart, rubbing wrists bruised from the paint locker, saying nothing.`, else: `Sully stands beside you. He hasn't left your side since the moonpool.` },
          `You know things now. You lay them out in your head, one by one, the way the fog lifts off the water.`,
          { if: 'shears', text: `Cables sheared on a neat diagonal. Trauma shears.` },
          { if: 'tape', text: `White medical tape on the valves.` },
          { if: 'slip', text: `A medic asking how much a man breathed before anyone knew there was anything to breathe.` },
          { if: 'report', text: `A blood test in 2019, signed T. Ferreira.` },
          `A blue nitrile glove, in the green light, flat against your back.`,
          { if: (s) => proof(s) < 2, text: `It isn't much. It might not be enough. It is all you have.` },
          { speaker: 'Tomás', say: `Please. We're wasting the window. We all know who doesn't belong here. Let's just go home.` },
          { if: onAir, text: `Sully touches your arm and nods toward the helicopter's cockpit, where the radio headset hangs. The coastguard channel. Every vessel in the North Sea listening. In your coveralls, file 19-07 is a warm, damp weight.` },
        ],
        choices: [
          {
            text: 'Accuse Tomás',
            hint: 'The kind one. The medic.',
            art: '☝️',
            outcome: [
              `"It's Tomás."`,
              {
                if: (s) => proof(s) >= 2,
                text: `You say it, and you give them the reasons, one after another, and with each one you watch the faces around you change. Tomás tries to laugh. It doesn't come out right.`,
                else: `You say it, and the faces around you stay blank. A bandaged hand. A glove. Everyone on this rig has hands; everyone wears gloves. Tomás spreads his arms, wounded and kind, and you can see the crew deciding he's the one they believe.`,
              },
            ],
            next: (s) => (proof(s) < 2 ? 'end_company' : (allies(s) >= 1 && s.get('danger') <= 3 ? 'end_true' : 'end_seven')),
          },
          {
            text: 'Accuse Sully',
            hint: 'The man who was never on the roster.',
            art: '👉',
            outcome: [
              `"It's Sully. He's not on the roster. He lied about his name. He was out on the pipe deck. It's him."`,
              `Sully closes his eyes. When he opens them, he looks, for one moment, exactly like the diver in the photograph. "Yeah," he says. "I thought it might go like this."`,
              `Lou, or Grace, or Pike, someone takes his arms. Tomás lets out a long breath that only you seem to notice.`,
            ],
            next: 'end_wrong',
          },
          {
            text: 'Say nothing. Get everyone aboard.',
            hint: 'Live first. Let the inquiry sort it out.',
            art: '🚁',
            outcome: [
              `You step aside. "Everyone on. Now."`,
              `They file in, one by one, under the rotors. Tomás is last. He sets his medical bag down by the door, very gently, and smiles at you as the skids lift.`,
            ],
            next: 'end_company',
          },
          {
            text: 'Hand Sully the radio. Put it all on the air.',
            hint: 'Every ship in the North Sea is listening.',
            if: onAir,
            art: '📡',
            outcome: [
              `You pull the file out of your coveralls and press it into Sully's hands. Grace shouts at the pilot, in her best supervisor voice, to patch the headset to the open coastguard channel. The pilot looks at her, then at the file, then does it.`,
              `Sully puts on the headset. His hands are shaking. Kenji steps up beside him.`,
              { speaker: 'Sully', say: `Mayday relay, Mayday relay, Halcyon-9. My name is Daniel Rourke. My brother was Mick Rourke. I'm going to read you a report that Meridian Offshore ordered destroyed.` },
            ],
            next: 'end_secret',
          },
        ],
      },

      // =====================================================================
      // ENDINGS
      // =====================================================================
      end_true: {
        art: '🚁🌅',
        scene: 'dawn',
        mood: 'dawn',
        ending: { id: 'headcount-eight', title: 'Headcount: Eight', type: 'true' },
        text: [
          `Tomás runs. Of course he runs: for the stairs, for the bypass valve, for the one last thing that could still make the rig burn and the evidence with it.`,
          { if: 'trust_lou', text: `He gets three steps. Big Lou Delaney, gas-sick and furious, hits him like a falling pipe and pins him to the deck. "Told you," Lou wheezes. "Told you it was one of us."` },
          { if: 'trust_kenji', text: `Kenji is at the top of the stairs before he is, dive knife out, perfectly calm. "No," Kenji says. Just that. Tomás stops.` },
          { if: 'trust_grace', text: `Grace takes the medical bag and the timer out of his reach and reads him his rights, more or less, in the voice of a woman reading out a safety bulletin.` },
          `In the helicopter, wrapped in foil blankets, he tells you the rest. The company had quietly paid him for five years to keep the 2019 blood test as it was. The inspection would reopen everything. A storm, a gas release, an evacuation, a rig that burned with all its records: an "act of God" for the insurers, and nobody to blame but a stowaway with a fake badge. He wasn't even a cruel man. Just one who had said yes once, and could never stop.`,
          `Eight people lift off Halcyon-9. All eight. The roster was wrong, and you're glad it was.`,
          { if: 'report', text: `The file goes to the regulator, page four on top. Three months later, the 2019 death of Mick Rourke is reclassified: equipment failure, not diver error.` },
          `Sully sits across from you, looking out at the shrinking rig. "Mick would've liked you," he says. "He liked anyone who counted twice."`,
        ],
      },

      end_secret: {
        art: '📡🌅',
        scene: 'dawn',
        mood: 'dawn',
        ending: { id: 'on-the-record', title: 'On the Record', type: 'secret' },
        text: [
          `Sully reads for six minutes. The valve flagged six times. The blood test. The signature. The telex ordering it all destroyed, read out by Grace herself, in full, with the company's reference number.`,
          `Kenji takes the headset last. He gives his name and his diver's number and says, in four flat sentences, what he saw at sixty metres in June 2019, and that he signed a lie, and that he is sorry. It is the most words anyone has heard him say.`,
          `On the open channel, a supply ship answers. Then a fishing trawler. Then a Norwegian platform, and another, and the coastguard, all logging it, all recording it. Nobody can shred a broadcast.`,
          `Tomás doesn't run. There's nowhere to run from a story that's already been told. He sits on the helideck in the rain until the police meet the helicopter in Aberdeen.`,
          `Nobody was locked in a box tonight. That's what Sully says to you in the helicopter, quietly, under the rotors. "You never put anyone in a cage. Not even me. That's the only reason I trusted you with Mick."`,
          `Six weeks later, Meridian Offshore's chief executive resigns. A letter arrives at a house in Western Australia, apologising to Mrs Rourke. Halcyon-9 is shut down for a full safety refit. The North Sea goes on heaving, the way it always has, but the moonpool gets a rail.`,
        ],
      },

      end_seven: {
        art: '🚁🕯️',
        scene: 'rig',
        mood: 'storm',
        ending: { id: 'seven-left', title: 'Seven Go Home', type: 'neutral' },
        text: [
          `You're right. That's the terrible part. You're right, and you say it, and the proof is there, and Tomás knows it's there.`,
          `But nobody steps up beside you. When he bolts for the stairs, there is a long, fatal second where everyone looks at everyone else, still not sure, and by the time you are after him he's at the bypass valve with the shears.`,
          { if: 'lou_down', text: `It's Vos who stops him. Half-sedated Vos, who staggered off the stretcher and down the stairs because he recognised the tape. They go over the rail together into the grey water. Tomás is pulled out by the coastguard. Vos is not.`, else: `It's Lou who stops him. Lou, who never trusted anybody, tackles him at the valve as the gas starts to hiss, and gets the wheel closed with Tomás clawing at his face. Lou breathes too much of it. He's dead before the helicopter reaches Aberdeen.` },
          `Tomás is convicted. The company settles, quietly, without admitting anything. Seven people come home from Halcyon-9.`,
          `You count them sometimes, at night, the way you counted at dinner. You always get to seven, and stop, and wait for the eighth.`,
        ],
      },

      end_wrong: {
        art: '🚔👤',
        scene: 'dawn',
        mood: 'office',
        ending: { id: 'the-wrong-man', title: 'The Wrong Man', type: 'bad' },
        text: [
          `Police meet the helicopter in Aberdeen. Daniel Rourke is charged with fraud, trespass on an offshore installation and endangering life. The forged badge is the first thing they find. The camera full of corroded pipework is the second; the prosecution calls it "reconnaissance".`,
          `Tomás gives evidence. He is a very good witness: kind, shaken, precise. He describes treating Vos, and the terrible moment of the gas alarm, and how the new man was always somewhere he shouldn't be.`,
          { if: 'report', text: `File 19-07 goes to the company's lawyers "for safekeeping." You never see it again.`, else: `Nobody mentions 2019. There is no file to mention.` },
          `Halcyon-9 is back in production in six weeks. On your first night back, you count the crew at dinner. Seven.`,
          `You find out, much later, from a two-line item in an Australian newspaper, who Daniel Rourke's brother was. You read it standing up in the mess, and you don't sit down for a long time.`,
        ],
      },

      end_company: {
        art: '🔥🛢️',
        scene: 'sea',
        mood: 'blood',
        ending: { id: 'company-man', title: 'Company Man', type: 'bad' },
        text: [
          `Forty minutes after the helicopter lifts, a kitchen timer in a medical bag on the helideck reaches zero. A solenoid clicks. The bypass valve opens.`,
          `You watch it from the air: a flower of orange fire blooming out of the grey morning, and then black smoke, and then Halcyon-9 burning from the inside, every deck, every office, every grey cabinet.`,
          { if: 'report', text: `You still have file 19-07. The company's lawyers ask for it on the tarmac, politely, with a confidentiality agreement and a cheque. Without the rig, without a witness, it's just paper. You don't remember signing. You remember the pen.`, else: `File 19-07 burns with everything else. Mick Rourke stays drunk forever.` },
          `The inquiry finds "an act of sabotage by an unauthorised individual," a stowaway with a forged badge called Daniel Rourke. The insurers pay out in full.`,
          `Tomás sends you a card at Christmas. It says *Thinking of you. Stay safe out there.* He signs it with a little hand-drawn heart, in very neat handwriting, the handwriting of a man who has signed a great many official forms.`,
        ],
      },

      end_blowout: {
        art: '💥🔥',
        scene: 'rig',
        mood: 'blood',
        fx: 'redflash',
        ending: { id: 'blowout', title: 'Blowout', type: 'death' },
        text: [
          { if: 'vented', text: `The flashback comes down the flare line at the speed of sound. You don't hear it. You see the manifold turn white.`, else: `The bypass valve, opened by a timer you never found, pours gas into the heart of the rig. The first spark is a light switch somewhere below. You see the helideck turn white.` },
          `Halcyon-9 burns for nine days. The pictures go round the world: a steel tower in a grey sea, wrapped in fire, the derrick folding like a paper straw.`,
          `The inquiry blames the storm, poor maintenance, and "the actions of individuals who cannot now be questioned". File 19-07, the regulator is told, was lost in the fire. That part, at least, is true.`,
          `The roster, when they finally publish it, lists seven names. They never do work out who the eighth was.`,
        ],
      },

      end_drowned: {
        art: '🌊🫧',
        scene: 'void',
        mood: 'sea',
        weather: 'bubbles',
        ending: { id: 'the-moonpool', title: 'The Moonpool', type: 'death' },
        text: [
          `It is very quiet, under the rig. Very dark. The cold stops hurting after a while.`,
          { if: 'told_tomas', text: `You told the kind man where you'd be. He was waiting. He's the one who tells them, in the morning, how you must have slipped. There's no rail on that side of the moonpool. There never was.`, else: `In the morning they find your boots on the grating and nothing else. There's no rail on that side of the moonpool. There never was.` },
          `The company report into your death runs to two pages. It mentions the storm, the lack of a rail, and "a tendency to work alone." It does not mention a blue glove.`,
          `Somewhere in a file that will soon be shredded, there is now a second name under Mick Rourke's. Two divers' worth of water in one square hole.`,
        ],
      },
    },
  });
})();
