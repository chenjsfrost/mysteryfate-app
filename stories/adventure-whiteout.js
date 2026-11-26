/* MysteryFate story: Whiteout (adventure) */
(function () {
  'use strict';

  // Meter helpers: add n and clamp to 0..5.
  const clamp = (k, n) => (s) => s.setVar(k, Math.max(0, Math.min(5, s.get(k) + n)));
  const W = (n) => clamp('warmth', n);
  const F = (n) => clamp('food', n);
  const both = (...fns) => (s) => fns.forEach((f) => f(s));
  // A new day: you burn a ration, and an empty stomach makes the cold bite twice as hard.
  const dayDrain = (s) => { F(-1)(s); W(s.get('food') <= 0 ? -2 : -1)(s); };
  // Any route out of a cold scene: zero Warmth means the glacier wins.
  const gate = (id) => (s) => (s.get('warmth') <= 0 ? 'death_freeze' : id);
  // Secret: Milo's map in hand, Dana still with you, Victor's stash out in the open.
  // The radio works only with the tail battery, and someone who knows how to run it.
  const radioOk = (s) => s.has('battery') && (!s.has('left_dana') || s.has('radio_know'));
  const secretReady = (s) => s.has('map') && !s.has('left_dana') && s.has('stash_shared');

  registerStory({
    id: 'adventure-whiteout',
    title: 'Whiteout',
    category: 'adventure',
    tagline: 'Four survivors. Three days of food. One flare.',
    description:
      'Your charter plane has gone down on a glacier at the edge of the map. Four of you walked away from the wreck: an injured pilot, a frightened boy, a retired nurse, and a businessman with very full pockets. Three days of food. One flare. And somewhere out there, a search plane that has to see you first.',
    cover: '🏔️',
    accent: '#f4a259',
    ambient: 'adventure',
    warning: 'Contains: plane crash, injury, hypothermia, death by exposure, moral dilemmas over food.',
    vars: { warmth: 4, food: 4 },
    flags: [],
    hud: [
      { var: 'warmth', label: 'Warmth', icon: '🔥', max: 5 },
      { var: 'food', label: 'Food', icon: '🥫', max: 5 },
    ],
    scene: 'glacier',
    voices: {
      narrator: { gender: 'male', pitch: 0.85, rate: 0.95, accent: 'en-GB', note: 'low, wind-scoured expedition storyteller' },
      'Dana': { gender: 'female', pitch: 0.9, rate: 0.95, accent: 'en-US', note: 'bush pilot, steady, dry, never raises her voice' },
      'Milo': { gender: 'male', pitch: 1.35, rate: 1.15, accent: 'en-CA', note: 'sixteen, scared, talks fast when nervous' },
      'Ruth': { gender: 'female', pitch: 0.8, rate: 0.88, accent: 'en-IE', note: 'retired nurse, gravel and dry humour' },
      'Victor': { gender: 'male', pitch: 0.75, rate: 0.95, accent: 'en-US', note: 'smooth businessman, warm charm over cold steel' },
      'Radio': { gender: 'male', pitch: 1.05, rate: 1.1, accent: 'en-AU', note: 'rescue helicopter pilot through static, brisk' },
    },
    start: 'crash',
    scenes: {
      // ------------------------------------------------------------------ DAY ONE
      crash: {
        title: 'Day One — 2:10 PM, The Wreck',
        art: '✈️💥',
        mood: 'ice',
        scene: 'wreckage',
        weather: 'snow',
        fx: 'shake',
        text: [
          'The silence is the worst part. One second the world is screaming metal and the next it is perfectly, ringingly quiet, and you are hanging sideways in your seatbelt with snow drifting in through a hole where the cabin wall used to be.',
          'The plane is a nine-seat charter, or it was. Now it is a fuselage nose-down in a glacier, its right wing folded back like a broken arm, and the tail — the whole tail — is simply gone.',
          'You unbuckle and drop into the aisle. Somebody is coughing. A teenage boy in a red parka is staring at his own hands. A grey-haired woman is already up, checking him for blood with brisk, practised fingers. A man in a camel coat is crawling toward the cargo net.',
          'Up front, the pilot is pinned. Her leg is caught under the buckled console, and there is a smell in the cockpit now — sweet, sharp. Fuel.',
          { speaker: 'Dana', say: 'Hey. Passenger. You’re the one on your feet. I need you to make a decision, and I need you to make it fast.' },
        ],
        choices: [
          {
            text: 'Get the pilot out first.',
            hint: 'She knows where you are. Nobody else does.',
            set: ['dana_trust'],
            effect: W(-1),
            art: '🧑‍✈️',
            outcome: [
              'You wedge your shoulder under the console and heave. Something in your back goes hot and bright. The console lifts an inch, two, and the pilot drags her leg free with a sound you will hear in your sleep.',
              'You haul her out through the cabin and into the snow, both of you soaked to the waist by the time you’re clear. Your gloves are back in the plane. Your fingers are already turning white at the tips.',
              { speaker: 'Dana', say: 'Dana Okafor. I owe you one. Remind me when we’re not dying.' },
            ],
            next: 'inventory',
          },
          {
            text: 'Grab the emergency bag before the fuel catches.',
            hint: 'Food, first-aid, the flare gun. Everything depends on that bag.',
            effect: F(1),
            art: '🎒',
            outcome: [
              'You dive for the orange bag strapped behind the cockpit bulkhead and rip it loose. Behind you, the man in the camel coat has gone to the pilot instead. He works the console with a crowbar from somewhere, quick and calm, and she slides free.',
              'Outside in the snow, he lets everyone see him set her down gently. He is handsome in a polished, expensive way, and he smiles at you as if you are both on the same board of directors.',
              { speaker: 'Victor', say: 'Victor Hale. Good instinct, the bag. I’ll remember who had their head on straight.' },
            ],
            next: 'inventory',
          },
          {
            text: 'Tear down the cabin blankets and seat covers.',
            hint: 'Cold kills faster than hunger. Everyone knows that.',
            effect: W(1),
            art: '🧣',
            outcome: [
              'You rip the thin grey blankets out of the overhead bins, then go after the seat covers with your bare hands — wool, thick and scratchy and beautiful. You come out with an armful.',
              'By the time you look up, the man in the camel coat has freed the pilot with a crowbar and is carrying her out like a groom over a threshold. The grey-haired nurse grabs the orange emergency bag on her way past you and gives you a nod that says *fine, you take the soft stuff*.',
              { speaker: 'Victor', say: 'Victor Hale. Don’t worry. I had it handled.' },
            ],
            next: 'inventory',
          },
        ],
      },

      inventory: {
        title: 'Day One — 4:00 PM, Counting',
        art: '🥫🔫',
        mood: 'ice',
        scene: 'wreckage',
        text: [
          'The fuel never caught. You wait an hour to be sure, and by then the sun is low and orange over a sea of white ridges, and the cold is starting to mean it.',
          'You lay everything out on a seat cushion in the snow. Twelve ration bars. Six tins of stew. A first-aid kit. Two thermal blankets. A water bottle that has already frozen solid. And the flare gun — a squat orange pistol with exactly **one** cartridge in the breech.',
          { speaker: 'Dana', say: 'That’s three days for four people, if nobody gets greedy. The radio’s dead — the battery pack was in the tail, and the tail’s somewhere over that ridge. They’ll be looking for us. They don’t know where to look.' },
          'Ruth Brandt — the grey-haired nurse — splints Dana’s leg with two seat rails and a roll of tape, whistling under her breath. The boy, Milo, hasn’t said a word. He keeps one hand inside his parka, holding something against his chest.',
          'Victor picks up a ration bar, weighs it like a gold ingot, and puts it in his coat pocket.',
          { speaker: 'Victor', say: 'Somebody should be in charge of the supplies. Somebody calm. I’ve run companies through worse winters than this. I’ll hold it all, hand it out fair. Agreed?' },
        ],
        choices: [
          {
            text: 'Divide it into four piles. Right now. In front of everyone.',
            hint: 'Nobody holds anything that isn’t theirs.',
            set: ['shared_out'],
            art: '⚖️',
            outcome: [
              'You count it out on the cushion: bar, bar, bar, bar. Tin, tin, tin, tin. Two left over, which you put in the middle with the first-aid kit. Ruth watches you do it with an approving eyebrow.',
              'Victor smiles the whole time. When you reach for the bar in his pocket, he hands it over without a word. His eyes say he is keeping score.',
              { speaker: 'Ruth', say: 'Look at that. A democracy. On a glacier. My late husband would have wept.' },
            ],
            next: 'night1_fire',
          },
          {
            text: 'Let Victor hold the supplies.',
            hint: 'He’s confident. Someone has to be.',
            set: ['victor_holds'],
            art: '💼',
            outcome: [
              'You shrug. Victor sweeps the bars and tins into his leather holdall and zips it with a satisfied little tug, like closing a deal.',
              { speaker: 'Victor', say: 'Smart. Committees die on mountains. Leaders don’t.' },
              'Ruth says nothing. But you notice her moving the first-aid kit to her own side of the cushion, very casually, while he isn’t looking.',
            ],
            next: 'night1_fire',
          },
          {
            text: 'Take charge of the food yourself.',
            hint: 'You trust yourself. That’s about all you trust.',
            effect: F(1),
            art: '✋',
            outcome: [
              'You pull the cushion toward you before anyone else can. Four faces turn to you in the dusk. Victor’s smile tightens one notch.',
              'You eat a ration bar on the spot, because you’re shaking and because you can. It is chalky and sweet and the best thing you have ever tasted. Nobody says anything. Nobody has to.',
              { speaker: 'Victor', say: 'Well. Now we know who the CEO is.' },
            ],
            next: 'night1_fire',
          },
        ],
      },

      // ---------------------------------------------------------------- NIGHT ONE
      night1_fire: {
        title: 'Night One — 8:00 PM, The Fire',
        art: '🔥',
        mood: 'ember',
        scene: 'wreckage',
        weather: 'embers',
        enter: { effect: W(-1) },
        text: [
          'You build a fire from cargo pallets and a seat frame in the lee of the fuselage. It burns blue and green at first from the paint, then settles into honest orange. Five faces in its light, if you count the one in the plane’s dark window — your own reflection.',
          'Ruth hands round tins of stew warmed on the coals. Milo holds his and doesn’t eat. His lips are blue. He has been shivering for an hour in a parka built for city sidewalks.',
          { speaker: 'Ruth', say: 'Eat, love. Shivering burns calories. You’re a furnace with no coal in it.' },
          { speaker: 'Milo', say: 'I’m fine. I’m not hungry. I’m fine.' },
          { if: 'victor_holds', text: 'Victor has handed round exactly one half-tin each. His own tin, you notice, is full. And his holdall, zipped tight under his knees, clinks when he shifts.' },
          { if: '!victor_holds', text: 'Victor eats with a soldier’s neatness, scraping every last smear from the tin. When he thinks nobody’s looking, his hand drifts to the lining of his coat and pats something there.' },
          'The wind changes. Smoke blows straight into Milo’s face, and he doesn’t even flinch. That scares you more than anything else so far.',
        ],
        choices: [
          {
            text: 'Give Milo your stew and your scarf.',
            hint: 'He’s sixteen. You’re not.',
            set: ['milo_trust'],
            effect: both(F(-1), W(-1)),
            art: '🧣',
            outcome: [
              'You wrap your scarf twice around his neck and push your tin into his hands. He tries to give it back. You fold his fingers around it.',
              'He eats in tiny bird bites at first and then all at once, like someone who has just remembered what food is. Colour comes back into his face. Your own stomach growls at the empty tin.',
              { speaker: 'Milo', say: 'Thanks. Seriously. I — thanks.' },
              'Across the fire, Ruth raises her tin to you in a silent toast.',
            ],
            next: 'night1_milo',
          },
          {
            text: 'Eat your full share. You need your strength.',
            hint: 'Tomorrow somebody has to do something hard. It’ll be you.',
            effect: both(F(1), W(1)),
            art: '🥫',
            outcome: [
              'You eat every bite, slow, letting the heat spread through your chest into your arms. It is not selfish. It is arithmetic. A strong body is a tool the group needs.',
              'You tell yourself that twice. The second time it sounds less true.',
              'Milo watches the fire with his untouched tin going cold in his lap. Eventually Ruth takes it, warms it again, and feeds him like a toddler, spoon by spoon, muttering about *grown men* and *useless*.',
            ],
            next: 'night1_milo',
          },
          {
            text: 'Tell Victor to share whatever’s in his coat.',
            hint: 'You saw the pocket. Everyone saw the pocket.',
            effect: W(-1),
            art: '🧥',
            outcome: [
              'You say it loudly, so the fire hears it. Victor laughs, and pulls from his coat a flat silver flask and two chocolate bars, and tosses one to Milo with a flourish.',
              { speaker: 'Victor', say: 'You make me sound like a smuggler. Here. Brandy for the brave, chocolate for the young. Happy?' },
              'Everybody relaxes. Everybody except you. Because he produced those two things far too quickly, the way a magician produces the card you were *supposed* to pick. He took them from the outside pocket. The inside pocket hasn’t moved.',
              'He doesn’t look at you for the rest of the night, and you lose your place nearest the fire.',
            ],
            next: 'night1_milo',
          },
        ],
      },

      night1_milo: {
        title: 'Night One — 1:30 AM, The Fuselage',
        art: '🧭',
        mood: 'night',
        scene: 'wreckage',
        weather: 'snow',
        text: [
          'Sleeping in the fuselage is like sleeping inside a drum somebody keeps hitting. The wind finds every crack. Dana snores in short, pained bursts. Ruth sleeps sitting up, like a sentry.',
          'You wake because a light is moving. Milo is hunched in the last row with a penlight in his teeth, studying something in his lap — a sheet of paper, folded and refolded until it is soft as cloth, and an old brass compass on a leather thong.',
          'He sees you looking. He snaps the light off. In the dark you hear him breathing fast.',
          { if: 'milo_trust', speaker: 'Milo', say: 'Okay. Okay. You gave me your scarf, so. I’ll tell you. But you can’t tell him. Victor. Promise.' },
          { if: '!milo_trust', speaker: 'Milo', say: 'It’s nothing. It’s just — it was my grandad’s. It’s nothing.' },
        ],
        choices: [
          {
            text: 'Sit with him and ask, quietly.',
            hint: 'No pressure. Just company.',
            set: ['map', 'milo_trust'],
            art: '🗺️',
            outcome: [
              'You slide into the seat beside him and say nothing for a while. Eventually he clicks the penlight on again and turns the paper toward you.',
              'It’s a hand-drawn map. Contour lines, a glacier tongue, a ridge shaped like a broken tooth. And a small square, carefully inked, labelled **STN 9 — ICE CORE / 1979**.',
              { speaker: 'Milo', say: 'My grandad worked there. A research station. He said they buried it when they left — just walked away, left it under the ice with everything in it. Fuel. Food. Beds. He died in March. I was bringing his ashes up to scatter over it. That’s why I was on this stupid plane.' },
              { speaker: 'Milo', say: 'I think we’re close. That ridge out there? It’s the tooth. I think it’s the tooth.' },
            ],
            next: 'day2_morning',
          },
          {
            text: 'Take it from him. Everyone’s lives might depend on it.',
            hint: 'Secrets are a luxury. You can apologise later.',
            set: ['map'],
            unset: ['milo_trust'],
            effect: W(-1),
            fx: 'flash',
            art: '✊',
            outcome: [
              'You lunge across the aisle and grab his wrist. He fights harder than you expect — all elbows and knees — and the penlight goes skittering under the seats. When it’s over you have the paper and he has a bloody lip, and Ruth is awake and glaring.',
              'You unfold it by the penlight. A hand-drawn map: glacier tongue, a ridge like a broken tooth, and a small inked square marked **STN 9 — ICE CORE / 1979**.',
              { speaker: 'Milo', say: 'It was my grandad’s. He’s *dead*. That was all I had left of him and you just — you just took it.' },
              'He turns his face to the wall. He doesn’t speak to you again that night. The cold creeps in through the place in your chest where you used to keep your decency.',
            ],
            next: 'day2_morning',
          },
          {
            text: 'Let him keep his secret. Roll over.',
            hint: 'Everybody’s entitled to one thing that’s theirs.',
            art: '😶',
            outcome: [
              'You roll over and pull the thermal blanket up to your ears. Behind you the penlight clicks back on, and you hear the soft rustle of old paper being folded, unfolded, folded again.',
              'Just before you fall asleep you hear him whisper — not to you, to someone who isn’t here.',
              { speaker: 'Milo', say: 'I’ll find it, Grandad. I promise I’ll find it.' },
            ],
            next: 'day2_morning',
          },
        ],
      },

      // ------------------------------------------------------------------ DAY TWO
      day2_morning: {
        title: 'Day Two — 7:30 AM, Clear Sky',
        art: '🏔️☀️',
        mood: 'dawn',
        scene: 'glacier',
        enter: { effect: dayDrain },
        text: [
          'Morning comes up hard and blue and blinding. The glacier spreads out in every direction, frozen waves of white with shadows the colour of a bruise. It is the most beautiful place you have ever seen, and it wants you dead.',
          'From the top of the fuselage you can see the tail. It sheared off on impact and skated four hundred yards, coming to rest on the far side of a crevasse — a long dark crack in the ice, maybe fifteen feet wide, spanned in one place by a sagging bridge of snow.',
          { speaker: 'Dana', say: 'The radio battery pack is in the tail. So is the cargo: sleeping bags, the survival crate. Get the battery back here and I can talk to anybody within a hundred miles. Get the bags and we don’t freeze tonight.' },
          { speaker: 'Ruth', say: 'And if the snow bridge goes, we’ll have one less mouth to feed. I’m only saying what everybody’s thinking.' },
          { if: 'map', text: 'In your pocket, Milo’s map. The ridge to the north really does look like a broken tooth.' },
          { if: (s) => s.get('food') <= 1, text: 'Your stomach is a clenched fist. Your hands shake when you lift them. You are already running on fumes.' },
        ],
        choices: [
          {
            text: 'Cross the snow bridge to the tail.',
            hint: 'Battery, bags, food. Everything you need is on the other side.',
            art: '🌉',
            outcome: [
              'You tie a cargo strap around your waist — it reaches about thirty feet, which is less than you’d like — and set off across the ice toward the crack.',
              'Up close, the crevasse breathes. Cold air rises out of it in a slow, steady exhale, and the walls go down blue, then darker blue, then black.',
            ],
            next: gate('snow_bridge'),
          },
          {
            text: 'Stay at camp and help Dana.',
            hint: 'She’s the only one who can fly a radio. Keep her alive.',
            set: ['nursed_dana'],
            art: '🩹',
            outcome: [
              'You decide the tail can wait. Dana’s leg has swollen tight against Ruth’s splint overnight, and the skin above the break has gone a colour you don’t like.',
              'You and Ruth rebuild the splint, pack snow around the swelling, and drag the seat cushions into a bed in the sun. Dana grits her teeth through all of it and never once makes a sound.',
            ],
            next: gate('camp_day2'),
          },
          {
            text: 'Scout the broken-tooth ridge with Milo.',
            hint: 'If the station is real, it changes everything.',
            if: 'map',
            set: ['saw_vent'],
            effect: W(-1),
            art: '🧭',
            outcome: [
              { if: 'milo_trust', text: 'Milo lights up when you ask him. He leads the way with his grandad’s compass held out in front of him like a dowsing rod.' },
              { if: '!milo_trust', text: 'Milo comes, because you have his map and he won’t let it out of his sight. He walks three steps behind you and says nothing the whole way.' },
              'An hour of slogging through knee-deep crust. Your thighs burn. Then, in the shadow of the ridge, exactly where the inked square says it should be — a pipe. A rusted steel ventilation pipe, sticking two feet out of the snow, capped with a hood like a little iron hat.',
            ],
            next: gate('station_scout'),
          },
        ],
      },

      snow_bridge: {
        title: 'Day Two — 9:00 AM, The Crevasse',
        art: '🌉🕳️',
        mood: 'ice',
        scene: 'glacier',
        timer: 8,
        text: [
          'The snow bridge is about four feet wide and fifteen long, and it sags in the middle like an old mattress. You can’t see how thick it is. That’s the thing about snow bridges, Dana told you. *You never can.*',
          'You test it with one boot. It holds. You take three steps. It holds.',
          'At the halfway point, there is a sound under your feet like someone biting into an apple. A thin dark line zips across the snow just ahead of you. Then another one, behind.',
          'The strap round your waist runs back to the near side. Nobody is holding the other end. You tied it to a ski pole jammed in the snow.',
        ],
        timeout: {
          art: '🕳️',
          fx: 'shake',
          outcome: [
            'You freeze, because every part of you is screaming *don’t move*, and the bridge decides for you.',
            'It doesn’t crack so much as sigh. The whole middle section drops away beneath you, all at once, and the strap snaps taut — and then the ski pole pops out of the snow like a cork.',
          ],
          next: 'death_crevasse',
        },
        choices: [
          {
            text: 'Drop flat and crawl. Spread your weight.',
            hint: 'Slow. Belly-down. Like ice on a pond.',
            effect: W(-1),
            art: '🐛',
            outcome: [
              'You go down onto your belly so slowly it feels like a prayer. Snow fills your collar, your cuffs, your mouth. You crawl, an inch, an inch, the cracks spidering around your elbows.',
              'Your gloved hand touches solid blue ice on the far side. You haul yourself onto it and lie there gasping, soaked through, as behind you the middle of the bridge slumps quietly into the dark.',
              'You won’t be coming back that way. You’ll have to find another route — Dana said the crack narrows half a mile west.',
            ],
            next: gate('tail_section'),
          },
          {
            text: 'Run for it.',
            hint: 'Momentum. Get across before it can give.',
            fx: 'shake',
            art: '🏃',
            outcome: (s) => (s.get('food') <= 1
              ? [
                'You sprint. Or you try to. Your legs, starved and shaking, don’t answer fast enough. Three steps, four — and on the fifth your boot goes straight through the snow as if it were paper.',
                'You throw your arms out for the far lip. Your fingertips brush ice. Then there is nothing under them at all.',
              ]
              : [
                'You sprint, high knees, every step a gamble, and the bridge collapses behind you in sections like a line of dominoes chasing your heels.',
                'You launch the last four feet and land on your chest on the far side, the wind knocked clean out of you. When you look back, there is no bridge. Just a wider dark, and a ski pole dangling at the end of your strap over nothing.',
              ]),
            next: (s) => (s.get('food') <= 1 ? 'death_crevasse' : 'tail_section'),
          },
          {
            text: 'Back up. Retreat the way you came.',
            hint: 'No battery is worth this.',
            effect: W(-1),
            art: '↩️',
            outcome: [
              'You shuffle backwards, one step, two, testing each one, and the cracks follow you like they’re curious. Four steps. Five. Solid ice.',
              'You sit down hard in the snow and watch the middle of the bridge fold softly into the crevasse with a sound like a long exhale. The tail sits on the far side, unreachable, its cargo door hanging open.',
              'You walk back to camp with nothing. Nobody says anything. Victor, very slightly, smiles.',
            ],
            next: gate('camp_day2'),
          },
        ],
      },

      tail_section: {
        title: 'Day Two — 10:15 AM, The Tail',
        art: '📦🔋',
        mood: 'ice',
        scene: 'wreckage',
        text: [
          'The tail section lies on its side like a beached whale, cargo door sprung open. Inside it’s dim and blue and strangely peaceful, with snow drifted into the corners like sugar.',
          'You find all three things Dana promised. The radio battery pack — a heavy yellow brick with a carrying handle. A roll of four sleeping bags in a compression sack. And the survival crate: more ration bars, a camp stove, a tin of fuel tablets.',
          'You try to lift all three. You can’t. The detour west along the crevasse is half a mile of broken ice, and with the bridge gone you’ll be carrying it all the long way round. You can manage one load. Maybe one and a half, if you want to collapse on the way.',
          { if: (s) => s.get('warmth') <= 2, text: 'You are wet to the skin. Your fingers have stopped hurting, which Ruth warned you is worse than when they hurt.' },
        ],
        choices: [
          {
            text: 'Take the radio battery.',
            hint: 'One call and this is over.',
            set: ['battery'],
            art: '🔋',
            outcome: [
              'You hug the battery against your chest and start west. It weighs more every hundred yards. By the time you round the crack and stagger into camp, your arms have stopped belonging to you.',
              'Dana takes one look at the yellow brick and actually laughs — a big, startled, beautiful laugh. She has the radio panel open before you’ve sat down.',
              { speaker: 'Dana', say: 'The antenna mast’s cracked. It’ll take me a while. But I can make this talk. Give me a day and I’ll make this sing.' },
            ],
            next: gate('victor_stash'),
          },
          {
            text: 'Take the sleeping bags.',
            hint: 'Four bags. Four people. Tonight is going to be brutal.',
            effect: W(2),
            set: ['bags'],
            art: '🛌',
            outcome: [
              'The compression sack goes over your shoulders like a giant backpack. It isn’t heavy, just enormous, and the wind keeps trying to sail you sideways off the ice.',
              'You crawl into one bag the moment you’re back in camp, just for ten minutes, and the warmth is so total and so sudden you nearly cry. Ruth tucks the second bag around Dana’s splinted leg like a mother.',
              'Four bags. Five people, if you count Victor’s ego. You’ll figure it out.',
            ],
            next: gate('victor_stash'),
          },
          {
            text: 'Take the survival crate.',
            hint: 'Food and a stove. A hot meal is warmth, too.',
            effect: both(F(2), W(1)),
            art: '📦',
            outcome: [
              'You drag the crate across the ice on its strap like a sled. Twice it nearly slides into the crack. Twice you haul it back.',
              'That afternoon Ruth fires up the little stove and melts snow and makes hot sweet tea for everybody, and for ten whole minutes nobody is afraid. Milo even laughs at something. It turns out he has a terrible, honking laugh.',
            ],
            next: gate('victor_stash'),
          },
        ],
      },

      camp_day2: {
        title: 'Day Two — 11:00 AM, Camp',
        art: '🏕️',
        mood: 'ice',
        scene: 'wreckage',
        text: [
          'Camp is a ring of seat cushions, a fire pit, and a fuselage with an SOS stamped out in the snow beside it in letters twenty feet high. Ruth’s idea. She says it’s mostly for morale.',
          { if: 'nursed_dana', text: 'Dana rests on her cushion bed, colour slowly coming back into her face. She thanks you, then asks you to stop fussing.' },
          'Dana has the radio panel open on her lap anyway, poking at its innards with a pocketknife. Without the battery it’s just a box of wires, but she says having something to do with her hands keeps the pain on the other side of the room.',
          'Victor is restless. Three times this morning he has wandered off toward the nose of the plane, out of sight, and come back wiping his mouth. Ruth has noticed too. She raises an eyebrow at you across the fire.',
          { speaker: 'Ruth', say: 'Either that man has a weak bladder or a secret pantry. My money’s on the pantry.' },
        ],
        choices: [
          {
            text: 'Dig a snow wall around the fire.',
            hint: 'Block the wind. Warmth is warmth.',
            effect: W(1),
            art: '🧱',
            outcome: [
              'You dig with a piece of cowling for two hours, carving blocks and stacking them into a curved windbreak, and when you’re done the fire stops bending sideways and starts standing up straight.',
              'It’s the first thing on this glacier that you have made instead of lost. The warmth that builds inside the wall feels earned.',
            ],
            next: gate('victor_stash'),
          },
          {
            text: 'Help Dana with the radio.',
            hint: 'Even if it’s dead, learn how it works.',
            set: ['radio_know'],
            effect: W(-1),
            art: '📻',
            outcome: [
              'You kneel beside her in the snow and hold the torch while she talks you through it: frequency dial, squelch, the emergency channel, how to key the mic and when to let go.',
              { speaker: 'Dana', say: 'If I pass out, if this leg goes bad — you’re the radio operator. One-two-one-point-five. Say *Mayday* three times, then where we are. Which is “on a glacier.” Very helpful.' },
              'Your knees are soaked through by the time she’s done. But you could do it. You could call for help with your eyes shut.',
            ],
            next: gate('victor_stash'),
          },
          {
            text: 'Follow Victor the next time he wanders.',
            hint: 'Find out what’s behind the nose of that plane.',
            set: ['spied_victor'],
            art: '👀',
            outcome: [
              'You give him a head start, then follow his bootprints around the crumpled nose. In a hollow under the wing, he’s kneeling beside a black canvas holdall, eating a protein bar in quick, guilty bites.',
              'The holdall is open. You see more bars. A box of chemical hand-warmers. A second flask. A satellite messenger with a cracked screen.',
              'He looks up and sees you. For one second his face is something naked and frightened. Then the smile comes back on like a porch light.',
            ],
            next: gate('victor_stash'),
          },
        ],
      },

      station_scout: {
        title: 'Day Two — 10:00 AM, The Broken Tooth',
        art: '🧭🕳️',
        mood: 'ice',
        scene: 'glacier',
        text: [
          'The pipe is real. You knock on it with your glove and it rings, hollow and deep, a sound that goes down and down under your feet.',
          'Milo kneels and puts his ear to the hood. His face goes very still.',
          { speaker: 'Milo', say: 'There’s air moving. Down there. It’s like it’s breathing. It’s *there*. He wasn’t making it up. He wasn’t just a sad old man making it up.' },
          'Around the pipe the snow is wind-packed hard as concrete. Somewhere beneath it is a building with fuel and beds, built by people who knew how to live here. Thirty feet down. Maybe forty.',
          'Back toward camp, over the white, a thin line of smoke rises from the fire Ruth is keeping. It looks very far away.',
        ],
        choices: [
          {
            text: 'Mark the spot and hurry back to tell everyone.',
            hint: 'A shelter like this could save all four of them.',
            art: '🚩',
            outcome: [
              'You jam a ski pole beside the pipe and tie Milo’s red hat to the top. A flag. Then you half-run, half-stumble back toward camp, your lungs full of knives.',
              { if: 'milo_trust', speaker: 'Milo', say: 'You’re going to tell Victor too, aren’t you? Okay. Okay. I guess — if it saves everybody, Grandad would’ve wanted that.' },
              { if: '!milo_trust', speaker: 'Milo', say: 'Of course you’re telling everyone. It’s not like it’s mine. Nothing’s mine anymore.' },
            ],
            next: gate('victor_stash'),
          },
          {
            text: 'Keep it between you and Milo for now.',
            hint: 'If Victor knows there’s a stocked station out here, what does he do?',
            set: ['milo_trust'],
            art: '🤫',
            outcome: [
              'You look at the pipe, and at the smoke from camp, and at Milo. You shake your head.',
              'He understands at once. Something passes between you — the first real thing since the crash. You mark the spot with a cairn of ice chunks that only someone looking for it would notice, and walk back slowly, like two people who went for some air.',
              { speaker: 'Milo', say: 'Our secret. Okay. That’s — yeah. Okay.' },
            ],
            next: gate('victor_stash'),
          },
          {
            text: 'Try to dig down to it now.',
            hint: 'Shelter tonight is worth any blisters.',
            effect: both(W(-1), F(-1)),
            art: '⛏️',
            outcome: [
              'You dig with your hands and a strip of aluminium you brought from the wreck. You dig until your arms quiver and your sweat freezes in your eyebrows.',
              'After an hour you have a hole three feet deep and a pipe that keeps going down into ice so hard it sparks against the metal. You’d need a team. You’d need a day. You don’t have either.',
              'You trudge back to camp with nothing to show but raw palms and an emptiness in your stomach that has teeth.',
            ],
            next: gate('victor_stash'),
          },
        ],
      },

      victor_stash: {
        title: 'Day Two — 1:00 PM, The Holdall',
        art: '💼🍫',
        mood: 'ice',
        scene: 'wreckage',
        text: [
          { if: 'spied_victor', text: 'Victor gets to you before you can tell anyone. He walks you a little way out onto the ice, an arm around your shoulders like an old friend.' },
          { if: '!spied_victor', text: 'It’s Ruth who finds it. She comes round the nose of the plane with a black canvas holdall dangling from one hand, and Victor half a step behind her, smiling much too hard.' },
          'The holdall is full. Protein bars — two dozen at least. Chemical hand-warmers. A flask. A satellite messenger with a cracked screen that shows a single blinking error. Victor must have pulled it all from the cargo hold in the first five minutes, while everyone else was pulling out people.',
          { if: 'victor_holds', text: 'And at the bottom, the group’s own ration bars. The ones you let him hold. He’s been handing out half-portions from a bag with twice as much inside.' },
          { speaker: 'Victor', say: 'Let’s be adults. Four people, one bag, three days. Spread thin, it keeps nobody alive. Concentrated, it keeps *two* people very alive. The kid and the pilot are dead weight. I think you know that. I think you knew it before I said it.' },
          { speaker: 'Victor', say: 'You and me. We split it. Nobody needs to know.' },
        ],
        choices: [
          {
            text: 'Confront him in front of everyone. It all gets shared.',
            hint: 'Out loud, by the fire, where he can’t smile his way out.',
            set: ['stash_shared'],
            effect: F(1),
            art: '⚖️',
            outcome: [
              'You grab the holdall and walk straight back to the fire and turn it upside down onto the cushion. Bars, hand-warmers, the flask, the dead messenger — all of it, in the light, where everyone can see.',
              'Dana looks at the pile and then at Victor, and doesn’t say anything at all, which is worse than anything she could have said. Milo looks at the bars like they’re a miracle. Ruth starts counting them into four piles.',
              { speaker: 'Victor', say: 'You’ve just killed all four of us, you know. Slowly. Fairly. Congratulations.' },
              'He takes his quarter and goes and sits alone in the fuselage. You eat one bar and hand a hand-warmer to each person, and for the first time since the crash, everyone at the fire is equally hungry. It feels better than being full.',
            ],
            next: gate('plane_overhead'),
          },
          {
            text: 'Take his deal. Quietly.',
            hint: 'He’s not wrong about the arithmetic. That’s the horrible part.',
            set: ['victor_ally'],
            effect: both(F(2), W(1)),
            art: '🤝',
            outcome: [
              'You shake his hand. His grip is warm and dry. He presses six protein bars and a handful of hand-warmers into your coat, and you feel them there against your ribs, heavy as stolen money.',
              { speaker: 'Victor', say: 'Smart. I knew you were smart. Stick with me and you walk off this ice.' },
              'At the fire that evening you eat your half-portion of stew with everyone else. Nobody knows. Milo offers you a sip of his tea, and you take it, and it tastes like rust.',
            ],
            next: gate('plane_overhead'),
          },
          {
            text: 'Say nothing. Walk away from both of them.',
            hint: 'Not your fight. Your fight is with the cold.',
            art: '🚶',
            outcome: [
              'You turn your back on him and the holdall and walk away across the ice until the fire is a tiny orange dot. You stand there until you can’t feel your nose.',
              'When you come back, the holdall is gone and Victor is laughing at something Milo said, and Ruth is looking at you with an expression you can’t read and don’t want to.',
              'It isn’t your fight. You keep telling yourself that. The cold keeps telling you something else.',
            ],
            effect: W(-1),
            next: gate('plane_overhead'),
          },
        ],
      },

      plane_overhead: {
        title: 'Day Two — 3:40 PM, The Engine',
        art: '🛩️🔫',
        mood: 'storm',
        scene: 'glacier',
        weather: 'snow',
        timer: 7,
        text: [
          'Milo hears it first. He stands bolt upright with his head cocked like a dog. Then you hear it too — a drone, faint, rising and falling under the wind. An engine.',
          'A small plane, high and to the south, a dark stitch against a sky that is going grey from the west. A cloud bank is rolling in behind it, fast. In two minutes it’ll be in the murk. In five, so will you.',
          { speaker: 'Dana', say: 'That’s a search grid. They fly lines. If they’re on this line today they’ll be on the next one tomorrow. Maybe.' },
          { speaker: 'Victor', say: 'Maybe? *Maybe?* Give me the gun. Fire it. FIRE IT!' },
          'The flare gun is in your hand. One cartridge. The plane is turning — toward you, or away? You can’t tell. You can’t tell.',
        ],
        timeout: {
          set: ['flare_used'],
          fx: 'flash',
          art: '🎆',
          outcome: [
            'You hesitate one second too long, and Victor rips the flare gun out of your hand.',
            'He fires it straight up. The flare climbs in a beautiful red arc and bursts into a fizzing star — directly into the underside of the cloud bank, which swallows it whole like a mouth.',
            'The drone of the engine doesn’t change. It fades south, and is gone. Victor stands there holding the empty gun, breathing hard, and then throws it into the snow at your feet.',
            { speaker: 'Victor', say: 'You froze. Remember that. You froze.' },
          ],
          next: gate('night2_blizzard'),
        },
        choices: [
          {
            text: 'Fire it now.',
            hint: 'A bird in the hand.',
            set: ['flare_used'],
            fx: 'flash',
            art: '🎆',
            outcome: [
              'You lift the pistol and squeeze. The kick jars your wrist. The flare goes up red and bright and arcing, a little burning star — and climbs straight into the leading edge of the cloud.',
              'For a moment the cloud glows pink from the inside, like a lampshade. The engine drone hangs there in the air, unchanged. Then it fades south.',
              'Did they see? Maybe. Maybe a pilot is logging coordinates right now. Maybe not. The gun in your hand is empty. You’ll never know which, until you do.',
            ],
            next: gate('night2_blizzard'),
          },
          {
            text: 'Wait. It’s too far. Hold the flare.',
            hint: 'One shot. Make it count when they’re close.',
            effect: W(-1),
            art: '✋',
            outcome: [
              'You lower the gun. Victor lunges for it and Ruth, astonishingly, sticks out a boot and trips him flat on his face in the snow.',
              'The plane drones south and slides into the cloud and is gone. The silence it leaves behind is enormous. Everyone is staring at you.',
              { speaker: 'Dana', say: 'Right call. I think. They’ll come back along the next line. I *think*. God, I hope you’re lucky.' },
            ],
            next: gate('night2_blizzard'),
          },
          {
            text: 'Flash the sun off a piece of cowling instead.',
            hint: 'Keep the flare. Try a mirror.',
            art: '🪞',
            outcome: [
              'You snatch up a sheet of polished aluminium from the wreck and tilt it toward the last patch of sun, sweeping a bright spot across the sky the way your father taught you on a beach a hundred years ago.',
              'For one second the plane seems to waggle its wings. Or a gust caught it. Then the cloud takes it.',
              'The flare is still in the gun. Victor stares at it, and then at you, with a cold, careful attention you don’t like at all.',
            ],
            next: gate('night2_blizzard'),
          },
        ],
      },

      // ---------------------------------------------------------------- NIGHT TWO
      night2_blizzard: {
        title: 'Night Two — 6:00 PM, The Blizzard',
        art: '🌨️💨',
        mood: 'storm',
        scene: 'glacier',
        weather: 'snow',
        fx: 'shake',
        timer: 8,
        enter: { effect: W(-1) },
        text: [
          'The cloud that swallowed the plane comes for you next. The temperature falls like a dropped stone. The wind goes from a moan to a howl to something that doesn’t have a name, and the snow stops falling and starts travelling sideways at fifty miles an hour.',
          'The fuselage groans. Something on the broken wing tears loose and cartwheels away into the white. The fire goes out in a single gust.',
          { speaker: 'Ruth', say: 'We can’t stay in that tin can! It’ll be a freezer by midnight!' },
          'Two hundred yards east, under the lip of a serac, there is an ice cave you spotted this morning — blue-walled, out of the wind. Snow and ice are good insulators. Metal isn’t. But Dana can’t walk, and two hundred yards in this is a mile.',
          { if: 'bags', text: 'The sleeping bags are in the fuselage. Inside them, you might live through a metal freezer.' },
          { speaker: 'Dana', say: 'Don’t you dare argue about me. Decide. *Now*.' },
        ],
        timeout: {
          effect: W(-2),
          art: '🥶',
          outcome: [
            'You stand in the wind shouting at each other, and the wind wins the argument.',
            'In the end Ruth just shoves everyone bodily into the fuselage and drags the door shut on its bent hinge. By then your hands are wooden and your face has stopped hurting. You lie in the dark with ice in your eyelashes and hear yourself breathing, too slow.',
          ],
          next: gate('night2_fuselage'),
        },
        choices: [
          {
            text: 'Everyone into the fuselage. Stay together.',
            hint: 'Metal is cold. Moving Dana could kill her.',
            effect: (s) => W(s.has('bags') ? 1 : -1)(s),
            art: '✈️',
            outcome: [
              'You haul the cargo door shut and stuff every gap with seat foam. Five bodies — four, counting properly — pressed together in the aisle, under every blanket and coat in the plane.',
              { if: 'bags', text: 'The sleeping bags save you. Inside them, it’s almost warm, the storm a distant train you can listen to instead of fight.' },
              { if: '!bags', text: 'The cold comes through the metal skin like water through cloth. By ten o’clock the inside walls are furred with frost from your own breath.' },
            ],
            next: gate('night2_fuselage'),
          },
          {
            text: 'Carry Dana to the ice cave between you.',
            hint: 'Two hundred yards. Everyone takes a corner.',
            set: ['in_cave'],
            effect: both(W(1), F(-1)),
            art: '🧊',
            outcome: [
              'You lash Dana onto a cargo door with straps and four of you drag her through the white like a sled, heads down, each of you holding the shoulder of the person in front. Victor curses the whole way. He also never lets go.',
              'Two hundred yards takes forty minutes. Then the wind simply stops, as if someone has closed a door — and you are inside the cave, in blue silence, with the storm roaring past the entrance like traffic.',
              'It’s maybe ten degrees warmer in here. It feels like summer.',
            ],
            next: gate('night2_cave'),
          },
          {
            text: 'Take whoever can walk to the cave. Leave Dana with blankets.',
            hint: 'She told you not to argue about her. Maybe she meant it.',
            set: ['in_cave', 'left_dana'],
            effect: W(1),
            art: '💔',
            outcome: [
              'You pile every blanket left in the fuselage on top of Dana. She doesn’t argue. She just looks at you, steady, and nods once, the way a pilot nods at a checklist.',
              { speaker: 'Dana', say: 'Go. Go on. I’ll keep the lights on.' },
              'Ruth refuses to leave her, and you have to physically drag her out of the plane. Milo won’t look at you. The walk to the cave takes twelve minutes without a stretcher. You count every one of them.',
            ],
            next: gate('night2_cave'),
          },
        ],
      },

      night2_fuselage: {
        title: 'Night Two — 11:00 PM, The Freezer',
        art: '✈️❄️',
        mood: 'night',
        scene: 'wreckage',
        weather: 'snow',
        text: [
          'The storm rocks the fuselage like a cradle somebody is trying to tip over. Under the blankets you can hear four other people breathing, and the tiny tick-tick-tick of ice forming on the walls.',
          'Dana is feverish. Ruth checks her pulse every half hour by penlight, then lies back down, and doesn’t say anything, which is how you know it’s bad.',
          { speaker: 'Ruth', say: 'She needs a hospital in two days or a miracle in one. Don’t look at me like that. I’m a nurse, not a liar.' },
          'Milo is curled against your side. Very quietly he says:',
          { if: 'map', speaker: 'Milo', say: 'Grandad said Station Nine had a generator. And a stove. And bunks. He said it like it was a story. What if it’s not a story?' },
          { if: '!map', speaker: 'Milo', say: 'I have to tell you something. My grandad worked out here, in the seventies. There was a station. A real one. I’ve got his map. I’m sorry I didn’t say. I didn’t know who to trust.' },
        ],
        choices: [
          {
            text: 'Hold Milo’s map up to the penlight and study it.',
            hint: 'Plan tomorrow. Tonight is just enduring.',
            set: ['map'],
            art: '🗺️',
            outcome: [
              { if: (s) => !s.has('milo_trust'), text: 'He hesitates for a long time before he hands it to you. When he does, he keeps one finger on the corner.' },
              'You study it until your eyes ache. Contour lines, a glacier tongue, a ridge like a broken tooth, and a small inked square: **STN 9**. The scale bar says the station is less than two miles from the crash site.',
              'Two miles. In clear weather, an hour’s walk. In this, an eternity. But the storm can’t last forever.',
            ],
            next: gate('night2_victor'),
          },
          {
            text: 'Give Dana your share of the body heat. Lie beside her.',
            hint: 'Fever and frost. She’s burning and freezing at once.',
            effect: W(-1),
            art: '🫂',
            outcome: [
              'You crawl over and lie against Dana’s good side and wrap your arms around her. She’s shaking so hard her teeth sound like dice.',
              { speaker: 'Dana', say: 'This is extremely unprofessional. Don’t stop.' },
              'Some time after midnight her shaking eases, and yours starts. You hold on anyway. Some things are worth a few degrees.',
            ],
            next: gate('night2_victor'),
          },
          {
            text: 'Burn the seat foam for heat inside the plane.',
            hint: 'The smoke will be awful. The cold is worse.',
            effect: both(W(2), F(-1)),
            art: '🔥',
            outcome: [
              'You build a tiny fire in a hubcap in the aisle, feeding it seat foam a strip at a time. The smoke is black and chemical and makes everybody cough until they retch, and you have to crack the door every few minutes to let it out.',
              'But the walls stop furring. Your fingers come back, painfully, one at a time. Coughing burns more out of you than you can afford — you feel your strength sliding — but you are warm.',
            ],
            next: gate('night2_victor'),
          },
        ],
      },

      night2_cave: {
        title: 'Night Two — 11:00 PM, The Ice Cave',
        art: '🧊🕯️',
        mood: 'ice',
        scene: 'cave',
        text: [
          'The cave is a cathedral of blue. Your penlight turns the walls into stained glass, frozen bubbles like constellations, the whole thing humming faintly as the storm passes over the top.',
          { if: 'left_dana', text: 'There are four of you. You keep counting, and it keeps being four. Ruth sits at the entrance, staring out into the white toward a fuselage none of you can see, and nobody can make her come in.' },
          { if: '!left_dana', text: 'Dana lies on the cargo door in the warmest corner, eyes shut, breathing fast and shallow. Ruth sits beside her, one hand resting on her forehead like a lid.' },
          'At the back of the cave, Milo shouts. You find him with his penlight raised at the ceiling, where the ice has melted back from something straight and red-brown and man-made — a steel I-beam, running away into the wall.',
          { speaker: 'Milo', say: 'That’s a building. That’s part of a *building*.' },
        ],
        choices: [
          {
            text: 'Lay the map against the beam and work out where you are.',
            hint: 'If this is Station Nine, the door can’t be far.',
            set: ['map'],
            art: '🗺️',
            outcome: [
              { if: (s) => !s.has('milo_trust'), text: 'Milo hesitates, then hands you the map. He keeps one finger on the corner.' },
              'You line up the compass, the beam, the angle of the cave mouth, and the inked square on the map. It fits. Not perfectly. Close enough.',
              'The cave is the edge of the station’s old access tunnel, collapsed decades ago. The main hall should be north of here, under the broken-tooth ridge, maybe four hundred yards. The tunnel is blocked. The surface isn’t.',
              { speaker: 'Milo', say: 'We could walk there. In the morning. If the storm stops. We could just *walk* there.' },
            ],
            next: gate('night2_victor'),
          },
          {
            text: 'Dig at the ice around the beam.',
            hint: 'Maybe there’s a door right here.',
            effect: both(W(-1), F(-1)),
            art: '⛏️',
            outcome: [
              'You chip at the ice with a piece of metal until your shoulders scream. After an hour you’ve uncovered six feet of beam and a rusted bolt plate stencilled **STN 9 — SECTION C**.',
              'Beyond that there’s nothing but solid ice and the faint sound of wind moving somewhere very far inside it. Not tonight.',
              'You sit back against the wall, soaked in your own sweat, which is already turning to frost.',
            ],
            next: gate('night2_victor'),
          },
          {
            text: 'Huddle everyone together and sleep.',
            hint: 'You can explore when you’re alive tomorrow.',
            effect: W(1),
            art: '😴',
            outcome: [
              'You make everyone lie down in a row like sardines, the weakest in the middle, coats piled on top. It’s the least dignified thing you’ve ever done. It works.',
              'Between Milo’s bony knees and Ruth’s sharp elbow, you sleep — properly sleep — for the first time since the crash.',
            ],
            next: gate('night2_victor'),
          },
        ],
      },

      night2_victor: {
        title: 'Night Two — 3:00 AM, The Door',
        art: '🎒🌌',
        mood: 'night',
        scene: 'glacier',
        weather: 'snow',
        text: [
          'You wake because the cold has changed. A draught. Somebody has opened the way out.',
          { if: 'in_cave', text: 'You crawl to the mouth of the cave and out into the starlight.', else: 'You squeeze out through the bent cargo door into the starlight.' },
          'The storm has dropped to a low, steady moan. In the grey light outside you find Victor, fully dressed, pack on his back, gloves on, crouched in the snow and lacing his boots very, very quietly.',
          { if: 'stash_shared', text: 'He has packed the last of the group’s ration bars. All of them. Even the ones Ruth was saving for Dana.' },
          { if: '!stash_shared', text: 'His black holdall is on his back, bulging with every bar and hand-warmer he never shared.' },
          { if: (s) => !s.has('flare_used'), text: 'And tucked into his belt, orange and unmistakable: the flare gun. The one cartridge.' },
          { if: 'victor_ally', speaker: 'Victor', say: 'You’re awake. Good. There’s a ridge to the south with a clear line of sight. We walk there, we get seen, we get picked up. Just us. You and me, partner, like we agreed. Come on.' },
          { if: '!victor_ally', speaker: 'Victor', say: 'Go back to sleep. I’m going for help. Somebody has to, and you people are too busy holding hands.' },
        ],
        choices: [
          {
            text: 'Block the exit. He’s not taking it.',
            hint: 'Everything in that bag belongs to everyone.',
            set: ['stash_shared', 'stopped_victor'],
            effect: W(-1),
            fx: 'shake',
            art: '🥊',
            outcome: [
              'You step into the doorway. He tries to go past you, then through you. You fight the way people fight in snow — clumsy, slipping, mostly grabbing — until Ruth is suddenly there with a seat rail in her hands and the absolute calm of a woman who once worked the A&E on a Saturday night.',
              { speaker: 'Ruth', say: 'Sit down, Victor. Or I set your leg to match Dana’s. I’m very good at splints.' },
              'He sits. You take the pack off him and empty it beside the sleepers so they’ll see it when they wake. Victor puts his face in his hands. Somewhere under the anger, you think he might be crying.',
            ],
            next: 'day3_dawn',
          },
          {
            text: 'Let him go.',
            hint: 'One less mouth. One less knife at your back.',
            set: ['victor_gone', 'flare_used'],
            unset: ['stash_shared'],
            art: '🚪',
            outcome: [
              'You lie still and watch him go. He doesn’t look back. The shape of him fades into the grey, and then there is only his trail of bootprints filling slowly with blown snow.',
              'In the morning, you tell the others. Ruth goes very quiet. Milo asks if Victor took the flare. You don’t answer, which is an answer.',
            ],
            next: 'day3_dawn',
          },
          {
            text: 'Go with him.',
            hint: 'You made a deal. And he might be right.',
            if: 'victor_ally',
            set: ['went_with_victor'],
            art: '🤝',
            outcome: [
              'You pull on your boots without a sound. Milo stirs and mumbles something in his sleep. You step over him.',
              'Outside, the storm has thinned to a hissing ground-blizzard, knee-high, the stars sharp and enormous above it. Victor grins at you and claps you on the back.',
              { speaker: 'Victor', say: 'Knew it. Survivors recognise survivors.' },
            ],
            next: gate('victor_walk'),
          },
        ],
      },

      victor_walk: {
        title: 'Day Three — 5:00 AM, The Ridge Path',
        art: '🌌🥾',
        mood: 'night',
        scene: 'glacier',
        weather: 'snow',
        enter: { effect: W(-1) },
        text: [
          'You walk for an hour in starlight. Victor sets a brutal pace. He doesn’t talk. Once he stops, takes a protein bar from the pack, eats it, and doesn’t offer you one.',
          'Then the crevasse. The same one, or a cousin of it — a black scar across the ice, too wide to jump. Victor walks along its lip until he finds a narrow snow bridge, thinner than the one that nearly killed you.',
          { speaker: 'Victor', say: 'You first. You’re lighter. If it holds you, it holds me. If it doesn’t — well, I’ll have learned something.' },
          'He says it with a smile. He is standing between you and the way back. The flare gun is in his belt. The pack with all the food is on his shoulders.',
        ],
        choices: [
          {
            text: 'Go first across the bridge.',
            hint: 'You came this far on his word.',
            art: '🌉',
            outcome: [
              'You cross on hands and knees. The bridge creaks and holds. You reach the other side and turn to wave him over.',
              'Victor is already walking away — not across, but along the near side, south, toward his ridge. He lifts one hand without turning round.',
              { speaker: 'Victor', say: 'Thanks for checking it for me. Nothing personal. The other side’s a dead end, by the way. Always was.' },
              'You start back across. On the second step the bridge gives a groan like a sinking ship, and you scramble back to the far lip with your heart in your teeth. You are on the wrong side of the crack, with nothing, and the sky is getting light.',
            ],
            next: 'end_betrayal',
          },
          {
            text: 'Grab for the pack and the flare gun.',
            hint: 'He was always going to leave you. Get the food first.',
            fx: 'shake',
            art: '🥊',
            outcome: (s) => (s.get('food') >= 2
              ? [
                'You lunge. You are hungry, but not as hungry as he thinks — you ate his bars, after all. You catch the pack strap and twist, and Victor’s boots slip on the lip, and for one second he is windmilling over the dark with only your grip on his pack holding him up.',
                'You haul him back. You didn’t have to. He knows you didn’t have to. He lets you take the pack, and the flare gun, and follows you back toward the cave like a dog that has bitten someone and is waiting to be told what it is now.',
              ]
              : [
                'You lunge — and your weak, starved legs betray you. Victor sidesteps without effort, and your momentum carries you right past him to the lip.',
                'He reaches for you. Maybe to catch you. Maybe not. You will never know which, because your boot goes over the edge and the snow goes with it.',
              ]),
            effect: (s) => { if (s.get('food') >= 2) s.set('stash_shared', 'stopped_victor'); s.unset('went_with_victor'); },
            next: (s) => (s.get('food') >= 2 ? 'day3_dawn' : 'death_crevasse'),
          },
          {
            text: 'Turn around and walk back to the others.',
            hint: 'You don’t owe him anything. You owe them everything.',
            set: ['victor_gone', 'flare_used'],
            unset: ['stash_shared', 'went_with_victor'],
            effect: W(-1),
            art: '↩️',
            outcome: [
              'You turn your back on him. He calls your name once, half-angry, half-pleading. Then he doesn’t call again.',
              'The walk back is an hour of following your own fading bootprints. By the time the cave mouth swims up out of the grey, you can’t feel your feet, and the sun is rising, and Milo is standing at the entrance waving both arms like a semaphore.',
            ],
            next: 'day3_dawn',
          },
        ],
      },

      // ---------------------------------------------------------------- DAY THREE
      day3_dawn: {
        redirect: (s) => {
          dayDrain(s);
          return s.get('warmth') <= 0 ? 'death_freeze' : 'day3_signal';
        },
      },

      day3_signal: {
        title: 'Day Three — 8:00 AM, The Last Clear Morning',
        art: '🌅🚁',
        mood: 'dawn',
        scene: 'glacier',
        text: [
          'The storm has blown itself out. The world is new and blinding and absolutely silent, a white page with you written small in the middle of it.',
          'Then, from the south — *whup, whup, whup*. A helicopter. Far, far away, low over the ridgeline, crawling along a line in the sky.',
          { if: 'left_dana', text: 'You don’t go back to the fuselage. You don’t want to know. Ruth goes. She comes back alone, and sits down in the snow, and doesn’t say anything for a long time.' },
          { if: (s) => !s.has('left_dana'), text: 'Dana is grey and sweating but awake. She hears it too. She grabs your sleeve.' },
          { if: (s) => !s.has('left_dana') && s.has('battery'), speaker: 'Dana', say: 'The radio. I finished the radio last night. It’s rigged to the battery. One-two-one-point-five. Go. GO.' },
          { if: 'victor_gone', text: 'Victor’s bootprints lead south toward the ridge — toward the helicopter. He will be standing up there waving. He will tell them whatever he wants.' },
          { if: (s) => !s.has('flare_used'), text: 'The flare gun is heavy in your coat. One cartridge.' },
          { if: (s) => s.get('food') <= 1, text: 'Your legs are trembling and your vision keeps sparkling at the edges. Whatever you do, you can only do one thing.' },
        ],
        choices: [
          {
            text: 'Signal them. Flare, radio, anything that works.',
            hint: 'This is what you saved it all for.',
            if: (s) => !s.has('flare_used') || radioOk(s),
            effect: (s) => (radioOk(s) ? s.set('radioed') : s.set('flare_used')),
            fx: 'flash',
            art: '🎆',
            outcome: [
              { if: 'radioed', text: 'You key the mic with numb fingers. *Mayday, mayday, mayday.* Your voice comes out a croak. You say it again. You say the aircraft registration, which Dana has written on your glove in marker. Static. Static. Then:' },
              { if: 'radioed', speaker: 'Radio', say: 'Mayday station, this is Rescue Two-Four, I read you loud and clear. Say your position, mate. And how many souls?' },
              { if: '!radioed', text: 'You raise the pistol into a sky with not one single cloud in it and pull the trigger. The flare climbs, red, burning, perfect, and bursts high over the glacier like a second sun.' },
              { if: '!radioed', text: 'You watch the helicopter. It flies on. It flies on. And then — slowly, gracefully, like a dancer turning to a partner — it banks toward you. Milo screams. Ruth sits down in the snow and laughs.' },
            ],
            next: 'rescue_check',
          },
          {
            text: 'Burn the fuselage seats for a smoke signal.',
            hint: 'Black smoke on white snow. It costs every bit of warmth you have left.',
            effect: W(-1),
            art: '💨',
            outcome: [
              'You drag seat cushions into a pile, douse them with the last of the fuel tablets and lighter fluid, and set it all ablaze. Thick black smoke climbs into the still air in a column so straight it looks like a drawing.',
              'It burns everything that was keeping you warm. You stand beside it, shaking, and watch the helicopter, and pray.',
            ],
            next: (s) => (s.get('warmth') <= 0 ? 'death_freeze' : 'rescue_check'),
          },
          {
            text: 'Walk south toward the helicopter. Whoever can’t walk stays.',
            hint: 'The fastest way to be seen is to go where they’re looking.',
            set: ['walked_south'],
            effect: W(-1),
            art: '🥾',
            outcome: [
              'You set off south with Milo and Ruth, toward the rotor sound, following the ridge line.',
              { if: '!left_dana', text: 'Dana can’t walk. You tell her you’ll send them back for her. She says *“Of course you will,”* in the voice pilots use for passengers who are frightened of turbulence.', else: 'You pass the fuselage on the way. You don’t look inside. Ruth does, and then walks faster.' },
              'Every step south takes you closer to the sound and further from the wreck. You don’t look back. You are afraid that if you look back, you will stop.',
            ],
            next: (s) => (s.get('warmth') <= 0 ? 'death_freeze' : 'rescue_check'),
          },
          {
            text: 'Follow Milo’s map to Station Nine.',
            hint: 'Don’t wait to be found. Go to the place that was built to keep people alive.',
            if: 'map',
            art: '🧭',
            outcome: [
              'You turn your back on the helicopter. It’s the hardest thing you have ever done.',
              { speaker: 'Milo', say: 'Are we — are we really doing this?' },
              'You hold up the map. Under the broken-tooth ridge, the little inked square waits. Behind you, the rotor sound fades south.',
            ],
            next: gate('station_trek'),
          },
        ],
      },

      rescue_check: {
        redirect: (s) => {
          if (s.has('victor_gone') && !s.has('radioed')) return 'end_betrayal';
          if (s.has('left_dana') || s.has('walked_south')) return 'end_left_behind';
          return 'end_rescued';
        },
      },

      station_trek: {
        title: 'Day Three — 10:00 AM, The Broken Tooth',
        art: '🧭🏔️',
        mood: 'ice',
        scene: 'mountains',
        text: [
          'The walk to the broken-tooth ridge takes two hours. You follow the compass bearing Milo’s grandfather drew forty years ago in a shaky, careful hand.',
          { if: (s) => !s.has('left_dana'), text: 'You drag Dana on the cargo door between you, two at a time, swapping every hundred steps. She drifts in and out. Once she wakes and says, very clearly, *“Mind the wing,”* and then falls asleep again.' },
          { if: 'saw_vent', text: 'And there — the pipe. The rusted vent you found yesterday, its little iron hat crusted with new snow.' },
          { if: '!saw_vent', text: 'And there, at the foot of the ridge, sticking out of the snow like a periscope: a rusted steel pipe with a little iron hood. Milo touches it like it’s a gravestone.' },
          'But the hatch, the door, the way in — there is nothing. Just snow, wind-packed and hard, in every direction. Somewhere under your feet is a building. You just have to find which part of it lets you in.',
        ],
        choices: [
          {
            text: 'Pace out the map’s measurements from the vent.',
            hint: 'The old man drew it for a reason. Trust the paper.',
            art: '📏',
            outcome: [
              'The map has a tiny dotted line from the vent to a mark labelled *HATCH — 30 PACES N*. You walk it, counting aloud, Milo counting with you.',
              'Twenty-eight. Twenty-nine. Thirty. You kneel and dig, and two feet down your fingers hit something flat and hollow-sounding and painted a faded international orange.',
            ],
            next: 'station_door',
          },
          {
            text: 'Climb the ridge for a better view of the ground.',
            hint: 'From above, you might see the shape of the building in the snow.',
            effect: W(-1),
            art: '🧗',
            outcome: [
              'You scramble up the broken tooth on all fours. From the top, the snowfield below looks smooth and blank — until the low sun catches it, and you see faint lines in the drifts. A rectangle. A long, straight-edged rectangle, the ghost of a roof.',
              'And, a mile south, a tiny dark figure on the ridgeline, waving its arms at a helicopter that isn’t turning toward it.',
              'You slide back down and dig at the rectangle’s north end. Eventually, an orange-painted hatch.',
            ],
            next: (s) => (s.get('warmth') <= 0 ? 'death_freeze' : 'station_door'),
          },
          {
            text: 'Give up on it. Head back toward the helicopter.',
            hint: 'Maybe the station is just a dead man’s story after all.',
            effect: W(-1),
            art: '↩️',
            outcome: [
              'You stand by the vent pipe for a long time. Then you shake your head. Milo doesn’t argue. He just puts the map back inside his parka, very carefully, like folding a flag.',
              'You turn back south toward the sound of rotors and start walking, and you light a fire on the ice with the last of your matches when you can’t walk any further.',
            ],
            next: (s) => (s.get('warmth') <= 0 ? 'death_freeze' : 'rescue_check'),
          },
        ],
      },

      station_door: {
        redirect: (s) => {
          if (secretReady(s)) return 'end_station';
          if (s.get('warmth') <= 1) return 'death_freeze';
          return 'rescue_check';
        },
      },

      // ------------------------------------------------------------------ ENDINGS
      end_rescued: {
        art: '🚁🌅',
        mood: 'dawn',
        scene: 'dawn',
        ending: { id: 'all-home', title: 'All Souls Accounted For', type: 'true' },
        text: [
          'The helicopter comes in low, kicking up a storm of its own, and settles on the ice fifty yards away. Men in orange jumpsuits run toward you, bent double under the rotors.',
          'You count them onto the aircraft. You can’t stop counting. Dana, strapped to a proper stretcher, giving a crewman instructions about her own splint. Ruth, refusing help up the step. Milo, clutching his grandfather’s compass.',
          { if: 'victor_gone', text: 'They pick Victor up from the southern ridge twenty minutes later, half-frozen, still clutching the empty holdall. He tells the crew he led you all to safety. Nobody contradicts him out loud. Nobody needs to. Ruth just looks at him, all the way home.' },
          { if: 'stopped_victor', text: 'Victor climbs aboard last. He sits apart from everyone and doesn’t speak. Halfway home, he reaches across the cabin and hands Milo a protein bar, and Milo takes it, and that’s all.' },
          { if: (s) => !s.has('victor_gone') && !s.has('stopped_victor'), text: 'Victor climbs aboard with a handshake for the pilot and a smile for the cameras that aren’t there yet. He’ll be fine. People like Victor always are.' },
          { if: 'victor_ally', text: 'In your coat there are still two of his protein bars. You leave them on the seat when you get off. You never tell anyone. You never forget.' },
          { if: 'shared_out', text: 'At the hospital, Ruth tells a reporter that the first thing you did on that glacier was divide the food into four equal piles. She says that’s why everyone came home. You’re not sure she’s right. You’re not sure she’s wrong.' },
          'Four people walked away from that wreck. Four people come home. Somewhere under the glacier, a buried station keeps its secrets for another winter.',
        ],
      },

      end_left_behind: {
        art: '✈️🕯️',
        mood: 'ice',
        scene: 'wreckage',
        ending: { id: 'empty-seat', title: 'The Empty Seat', type: 'neutral' },
        text: [
          'The helicopter lands. Men in orange run toward you. You walk up the step on your own two legs, and that is the worst part.',
          { if: 'left_dana', text: 'Dana Okafor is still in the fuselage. You made the call in the blizzard, and it was a reasonable call, and she even told you to make it. You will tell yourself that for the rest of your life, and every time it will sound a little thinner.' },
          { if: '!left_dana', text: 'Dana Okafor is still back at the wreck. You tell the crew. They nod, and radio it in, and a second helicopter is sent — and then a front comes in over the glacier and grounds everything for nine days. You made the call to walk, and it was a reasonable call. You will tell yourself that for the rest of your life, and every time it will sound a little thinner.' },
          { if: 'dana_trust', text: 'You were the one who pulled her out of the cockpit. *I owe you one*, she said. *Remind me when we’re not dying.* You never got to.' },
          'The recovery team goes back for her in the spring. They find her in the pilot’s seat, the radio panel open in her lap, headset on, as if she were still trying to raise somebody. As if she were keeping the lights on.',
          { if: 'map', text: 'Milo stops answering your messages after the funeral. A year later, a parcel arrives with no note in it: a photocopy of his grandfather’s map, with one small square circled in red.' },
          'You fly again eventually. You always ask for the seat over the wing.',
        ],
      },

      end_betrayal: {
        art: '🚁🏔️',
        mood: 'ice',
        scene: 'glacier',
        weather: 'snow',
        ending: { id: 'hales-bargain', title: 'Hale’s Bargain', type: 'bad' },
        text: [
          { if: 'went_with_victor', text: 'From the wrong side of the crevasse you watch it happen like a film. The helicopter swings in toward the southern ridge. A tiny figure in a camel coat waves both arms on the skyline, and the aircraft settles beside him.' },
          { if: '!went_with_victor', text: 'From the glacier you watch it happen like a film. The helicopter swings in toward the southern ridge where a tiny figure in a camel coat is waving the orange flare gun over his head. It lands. It takes him in.' },
          'You wait for it to turn toward you. You build the smoke as high as you can. It doesn’t turn. It lifts, and swings south, and grows small, and is gone.',
          'Weeks later, you will read it in a newspaper someone leaves on your hospital bed — if you are lucky enough to have a hospital bed. *SOLE SURVIVOR WALKED THREE DAYS ACROSS GLACIER.* Victor Hale told them the others died in the crash. He told them there was no point searching. He told them it was the hardest thing he ever had to say.',
          { if: 'victor_ally', text: 'You shook his hand. You ate his bars. You were never his partner. You were his test bridge.' },
          'The search is called off at sunset. The glacier keeps what it is given.',
        ],
      },

      end_station: {
        art: '🏠🔦',
        mood: 'ember',
        scene: 'cave',
        weather: 'embers',
        ending: { id: 'station-nine', title: 'Station Nine', type: 'secret' },
        text: [
          'The hatch opens with a shriek of frozen hinges onto a ladder going down into the dark. The air that comes up is cold, still, and smells of old diesel and wool and coffee — forty-year-old coffee.',
          'Station Nine is exactly as the old man left it. Bunks with folded blankets. A galley with tins stacked to the ceiling. A generator that coughs, coughs, and *catches* on the third pull, and the lights come up yellow and flickering all the way down a long corridor like a held breath let go.',
          'You carry Dana down the ladder between you and lay her in a real bed. Ruth finds a medical locker and says a word that would get her struck off. Morphine. Antibiotics. Sealed, cold, still good.',
          { if: 'stopped_victor', text: 'Victor comes down last. He stands in the galley looking at the tins, and then, without being asked, he starts opening them and handing them round. Maybe it’s guilt. Maybe it’s being somewhere where there finally is enough.' },
          { if: (s) => !s.has('stopped_victor') && !s.has('victor_gone'), text: 'Victor walks the corridor with his hands in his pockets, counting bunks. *Eight beds. Four of us.* For the first time since the crash, there’s nothing to hoard.' },
          { if: 'victor_gone', text: 'Victor is out there somewhere on the southern ridge. You leave the hatch flag up for him. It’s more than he left you.' },
          'In the station office, Milo finds a radio set on a shelf, and a logbook, and on the wall a photograph of six men in seventies beards grinning outside a hatch painted international orange. He touches the face of the youngest one with one finger.',
          { speaker: 'Milo', say: 'Hi, Grandad. I found it. I told you I’d find it.' },
          'The station radio still works. Dana, propped up on pillows with an IV in her arm, talks Rescue Two-Four onto the broken-tooth ridge the next morning in a voice that never once wavers. When the helicopter lands, all four of you are waiting at the hatch, fed and warm, like people stepping out of their own front door.',
          'Before you leave, Milo scatters a small tin of ashes over the ridge. The wind takes them north, over the ice, toward the place where his grandfather spent the best winter of his life.',
        ],
      },

      death_freeze: {
        art: '🥶❄️',
        mood: 'ice',
        scene: 'void',
        weather: 'snow',
        ending: { id: 'still-life', title: 'Still Life in Blue', type: 'death' },
        text: [
          'It doesn’t hurt. That’s the trick of it. After the shivering stops, it doesn’t hurt at all.',
          'You sit down in the snow for just a moment. Just to rest. You feel warm — wonderfully, suddenly warm — and you think about taking your coat off, and you are fumbling at the zip when the world goes soft at the edges, like a photograph left in the sun.',
          { if: 'milo_trust', text: 'Somebody is shouting your name. It sounds like Milo. He gave you back your scarf at some point, didn’t he? You wish you could tell him it’s fine. It really is fine.' },
          { if: (s) => s.get('food') <= 0, text: 'There was nothing left in you to burn. The body is a furnace, Ruth said. You ran out of coal.' },
          { if: 'victor_ally', text: 'In your pocket, two of Victor’s protein bars, unopened. You were saving them. For what, you can’t remember.' },
          'They find you in the spring, sitting upright, facing the sunrise, with an expression of mild surprise. The glacier has made you very beautiful. That is the last thing it gives anyone.',
        ],
      },

      death_crevasse: {
        art: '🕳️💙',
        mood: 'ice',
        scene: 'glacier',
        ending: { id: 'blue-below', title: 'The Blue Below', type: 'death' },
        text: [
          'You fall for a long time. Long enough to notice the colours — white, then blue, then a blue so deep and pure it looks lit from inside, like the heart of a gas flame.',
          'Then you stop. Wedged, sixty feet down, between two walls of ancient ice, with your arms pinned at your sides and a slice of sky far above you no wider than a ribbon.',
          { if: 'went_with_victor', text: 'For a while, a shadow crosses the ribbon of sky. Victor, looking down. Then the shadow goes away, and does not come back.' },
          { if: '!went_with_victor', text: 'You hear your name, very faint, very far above. Ruth’s voice, or Milo’s. You shout back until your voice is gone. The ice swallows it whole.' },
          'It is very quiet down here. The ice has been quiet for ten thousand years, and it is in no hurry. The ribbon of sky goes from blue to gold to grey to black, and then the stars come out, one by one, in a thin bright line, as if somebody up there were keeping count.',
        ],
      },
    },
  });
})();
