/* MysteryFate story: Babysitting the Haunted (comedy) */
(function () {
  'use strict';

  const clamp = (n, max) => Math.max(0, Math.min(max, n));
  const dig = (n) => (s) => s.setVar('dignity', clamp(s.get('dignity') + n, 5));
  const ger = (n) => (s) => s.setVar('gerald', clamp(s.get('gerald') + n, 3));
  // Kids Accounted For = 3 minus whoever has wandered off (Bean, mostly. Sometimes Oscar.)
  const sync = (s) => s.setVar('kids', 3 - s.count('bean_gone', 'oscar_gone'));
  const loseBean = (s) => { s.set('bean_gone'); sync(s); };
  const findBean = (s) => { s.unset('bean_gone'); sync(s); };
  const loseOscar = (s) => { s.set('oscar_gone'); sync(s); };
  const all = (...fns) => (s) => fns.forEach((f) => f(s));

  const FRIEND = (s) => s.get('gerald') >= 2;
  const DEAL_READY = (s) => FRIEND(s) && s.has('wallpaper_fixed') && s.get('kids') === 3;
  const MOVEON_READY = (s) => FRIEND(s) && s.has('letters');

  // The secret offer, available at the very end if Gerald likes you, the wallpaper is sorted and every child is present.
  const dealChoice = (lead) => ({
    text: 'Make Gerald a business proposition',
    hint: 'He likes you. The wallpaper is fixed. All three kids are right here. This is leverage.',
    if: DEAL_READY,
    art: '🤝',
    outcome: [
      lead,
      "You turn to the faint, mutton-chopped shape hovering by the coat rack and lower your voice to the tone of someone about to discuss a merger.",
      { speaker: 'You', say: "Gerald. You're here every night anyway. You love these kids. You haven't slept since 1889. What if you did the babysitting... and I did the paperwork?" },
      { speaker: 'Gerald', say: "Are you proposing that I enter into *trade*? Like a common *haberdasher*?" },
      "There is a long, quivering pause. Then his top hat tilts, very slightly, in the manner of a man who has been waiting a century and a half for somebody to give him a job title.",
      { speaker: 'Gerald', say: "...I shall require a lanyard." },
    ],
    next: 'end_deal',
  });

  registerStory({
    id: 'comedy-babysitting',
    title: 'Babysitting the Haunted',
    category: 'comedy',
    tagline: "$15 an hour. Three kids. One note on the fridge: “Don't feed Gerald after midnight.”",
    description:
      "It's the easiest gig in town: three kids, one evening, a big old house and a very generous hourly rate. The parents leave suspiciously fast. The fridge note says not to go in the attic, not to feed Gerald after midnight, and bedtime is 8:30. Nobody tells you who Gerald is.",
    cover: '👻',
    accent: '#8e7cf0',
    ambient: 'comedy',
    scene: 'house',
    warning: 'Contains: cartoon spookiness, a possessed vacuum cleaner, strong opinions about interior design.',
    voices: {
      narrator: { gender: 'female', pitch: 1, rate: 1.05, accent: 'en-US', note: 'warm, wry sitcom narrator who has seen some things' },
      'You': { gender: 'neutral', pitch: 1, rate: 1.05, accent: 'en-US', note: 'the babysitter, increasingly frazzled' },
      'Tilly': { gender: 'female', pitch: 1.6, rate: 0.85, accent: 'en-GB', note: 'seven years old, completely deadpan, unbothered by anything' },
      'Oscar': { gender: 'male', pitch: 1.4, rate: 1.4, accent: 'en-US', note: 'ten, hyper, permanently mid-livestream' },
      'Baby Bean': { gender: 'neutral', pitch: 2, rate: 1.1, accent: 'en-US', note: 'baby, babbles only' },
      'Gerald': { gender: 'male', pitch: 0.65, rate: 0.85, accent: 'en-GB', note: 'Victorian ghost, impeccably polite, operatically dramatic' },
      'Mrs. Pemberton': { gender: 'female', pitch: 1.15, rate: 1.3, accent: 'en-GB', note: 'breezy, rushed, entirely oblivious mum on the phone' },
    },
    vars: { kids: 3, dignity: 3, gerald: 0 },
    flags: [],
    hud: [
      { var: 'kids', label: 'Kids Accounted For', icon: '👶', max: 3 },
      { var: 'dignity', label: 'Dignity', icon: '🎩', max: 5 },
    ],
    start: 'intro',
    scenes: {
      /* ------------------------------------------------------------------ ACT 1 */
      intro: {
        scene: 'street',
        title: '6:58 PM: The Pemberton House',
        art: '🏚️',
        mood: 'sunny',
        text: [
          "The ad said *Babysitter wanted, one evening, $15/hr, easy kids, big house.* It did not say *very* big house. It did not say the house would have a turret, a weathervane shaped like a screaming crow, or a front door knocker in the shape of a face that looks disappointed in you.",
          "You haven't even knocked when the door flies open. Mrs. Pemberton bursts out in an evening gown and one earring, already halfway to the car. Mr. Pemberton is in the driver's seat with the engine running, staring straight ahead like a getaway driver.",
          { speaker: 'Mrs. Pemberton', say: "You must be the sitter! Marvellous! Kids are inside, numbers are on the fridge, everything's on the note, we'll be back by ten, byeee!" },
          "The car door is already open. You have maybe one sentence before she's gone.",
        ],
        choices: [
          {
            text: 'Shout “Who is Gerald?”',
            hint: 'You saw the name on the note through the window. You have questions.',
            set: ['asked_gerald'],
            art: '❓',
            outcome: [
              "You don't even know why you say it. You haven't read the note yet. But the name is sort of hanging in the air around the house, like the smell of old lavender.",
              { speaker: 'Mrs. Pemberton', say: "Oh, Gerald's practically *family!* Been here longer than we have! Don't let him near the snacks, he gets silly. Love you, mean it, BYE!" },
            ],
            next: 'fridge',
          },
          {
            text: 'Negotiate: “Let\'s call it twenty an hour.”',
            hint: 'Big house, big money. Shoot your shot.',
            set: ['raise'],
            effect: dig(1),
            art: '💵',
            outcome: [
              { speaker: 'Mrs. Pemberton', say: "Twenty-five! Thirty! Whatever you like, darling! Just *please* stay until we're back!" },
              "She agrees so fast it's like she's been waiting for someone to ask. That's the scariest thing anyone has said to you all week. Mr. Pemberton reverses down the drive before you can ask any follow-up questions, such as *why*.",
            ],
            next: 'fridge',
          },
          {
            text: 'Offer a firm, professional handshake',
            hint: 'First impressions matter.',
            effect: dig(-1),
            art: '🤝',
            outcome: [
              "You stick out your hand like a young executive. Mrs. Pemberton, in one smooth motion, places a baby in it.",
              "The baby is small, round, and wearing a onesie that says LIL BEAN. It looks at you. It looks at the car. It blows a single, enormous spit bubble, which pops on your chin.",
              { speaker: 'Mrs. Pemberton', say: "That's Bean! Bean likes to wander! Don't let Bean wander! TOODLES!" },
              "The car is gone before your arm finishes sagging under the weight. You walk inside holding Bean like a bag of very damp groceries.",
            ],
            next: 'fridge',
          },
        ],
      },

      fridge: {
        scene: 'kitchen',
        title: '7:04 PM: The Kitchen',
        art: '📝',
        mood: 'sunny',
        text: [
          "The kitchen is enormous and smells faintly of candle wax, even though there are no candles anywhere. The fridge is covered in drawings: a dog, a rainbow, and a very detailed portrait of a man in a top hat labelled MY BEST FRIEND.",
          "In the middle of it all, held up by a magnet shaped like a pineapple, is the note:",
          "**1. Don't go in the attic.**  **2. Don't feed Gerald after midnight.**  **3. Bedtime 8:30!!** *(Bean's bottle in fridge. Oscar NO SCREENS.)*",
          "At the kitchen table sits a girl of about seven, eating dry cereal one piece at a time with tweezers. A boy of about ten is holding a phone at arm's length and talking to it at a volume best described as *stadium.* Bean is in a high chair, gumming a spoon.",
          { speaker: 'Oscar', say: "What's UP, Oscar Nation! Day forty-one of my channel! New babysitter just dropped! Smash that like button if you think they last till eight!" },
          { speaker: 'Tilly', say: "I'm Tilly. Gerald says hello. Gerald says your shoes are vulgar." },
          { speaker: 'Baby Bean', say: "Bwa." },
        ],
        choices: [
          {
            text: 'Crouch down and ask Tilly who Gerald is',
            hint: 'Take the creepy child seriously. It\'s usually the right move.',
            effect: ger(1),
            art: '🧒',
            outcome: [
              "You kneel down at eye level. Tilly puts down her tweezers and studies you with the cold, professional assessment of a seven-year-old who has met a lot of babysitters and filed reports on all of them.",
              { speaker: 'Tilly', say: "Gerald lives here. He's very old. He's very polite. He's very sad because Mummy put up new wallpaper. He says it looks like a hospital waiting room had a baby with a spreadsheet." },
              { speaker: 'You', say: "And is Gerald... in the room with us right now?" },
              { speaker: 'Tilly', say: "He's behind you. He says thank you for asking. Nobody ever asks." },
              "The back of your neck goes cold. Something very faint, very courteous, and smelling of pipe tobacco gives a small bow behind you. You do not turn around. Turning around feels like a commitment.",
            ],
            next: 'bean_stairs',
          },
          {
            text: 'Lean into Oscar\'s camera and say hi to the chat',
            hint: 'Be the cool babysitter.',
            set: ['streaming'],
            effect: dig(-1),
            art: '📱',
            outcome: [
              "You lean in, flash two finger-guns, and say “What's up, Oscar Nation.” You immediately hear how it sounds. Oscar swings the phone around so you can see the comments roll past.",
              "*who is this* / *bro said what's up like a dad* / *babysitter energy: 2/10* / *why is there a guy in a top hat behind them??*",
              { speaker: 'Oscar', say: "Twelve viewers! That's a record! You're a natural. A natural what, I don't know. But a natural." },
              "Mrs. Pemberton's note says NO SCREENS. You decide that rule is for later. The phone stays on. The phone, you suspect, is going to stay on all night.",
            ],
            next: 'bean_stairs',
          },
          {
            text: 'Confiscate Oscar\'s phone. Rules are rules.',
            hint: 'The note was very clear. Capital letters.',
            set: ['phone_taken'],
            effect: dig(1),
            art: '🚫',
            outcome: [
              "You hold out your hand and give Oscar the look. You learned the look from your own mum. It is passed down through generations like a family sword.",
              "Oscar stares at your hand. He stares at the phone. He signs off to his twelve viewers with the solemnity of a soldier going off to war. “Remember me, Oscar Nation.” He hands it over.",
              { speaker: 'Oscar', say: "Fine. FINE. I have a backup tablet, but fine." },
              "You put the phone in the cutlery drawer. Behind you, faintly, somebody claps. A slow, polite, white-gloved clap. Tilly nods approvingly at the empty air beside the toaster.",
            ],
            next: 'bean_stairs',
          },
          {
            text: 'Make everyone dino nuggets. Leave a plate for Gerald.',
            hint: 'It\'s not midnight yet. Technically allowed.',
            effect: ger(1),
            art: '🍗',
            outcome: [
              "You find a bag of dinosaur-shaped nuggets in the freezer and you make them golden and perfect. You put four plates on the table: one for Tilly, one for Oscar, a mashed-up one for Bean, and, after a moment's thought, one in front of the empty chair at the head of the table.",
              "Tilly stares at you. Then she stares at the empty chair. Then, for the first time, she smiles.",
              { speaker: 'Tilly', say: "He says he's never had a dinosaur before. He says it's *simply ghastly* and he'd like another." },
            ],
            next: 'bean_stairs',
          },
        ],
      },

      bean_stairs: {
        scene: 'stairwell',
        title: '7:31 PM: The Landing',
        art: '👶',
        mood: 'night',
        fx: 'heartbeat',
        text: [
          "You turn around to put the plates in the sink. You turn back. The high chair is empty.",
          "There's a little trail of cereal leading out of the kitchen, across the hall, and up the grand staircase. Bean is at the very top. Bean is crawling with great purpose and surprising speed toward the *other* staircase, the steep wooden one that goes down to the basement and has no gate.",
          { speaker: 'Baby Bean', say: "Bwa! Bwa bwa! Gah!" },
          "The hallway light flickers. A wall sconce swivels toward Bean on its own, like a spotlight. Somewhere in the walls, something gasps, the way an elderly gentleman gasps when he sees a toddler near a precipice.",
          "Bean is two crawls from the top step. Then one and a half.",
        ],
        timer: 8,
        timeout: {
          text: 'You froze.',
          effect: loseBean,
          art: '💨',
          outcome: [
            "You stand there making a noise like a kettle. Bean reaches the edge of the top step, looks back at you, blows a raspberry, and crawls straight off it.",
            "There's no thump. There's a small, sparkly *pff*, like someone opening a packet of glitter, and Bean is just... not there. A single tiny sock drifts down the basement stairs and lands on the bottom step, neatly folded.",
            { speaker: 'Tilly', say: "Bean does that. Bean'll turn up. Bean always turns up. Usually." },
            "**Kids accounted for: two.** You've been in charge for thirty-three minutes.",
          ],
          next: 'hallway',
        },
        choices: [
          {
            text: 'DIVE.',
            hint: 'Full-length, carpet-burn, action-movie dive.',
            effect: dig(-1),
            fx: 'shake',
            art: '🤸',
            outcome: [
              "You launch yourself up the stairs three at a time and throw your body across the landing in a full, horizontal, slow-motion dive. You hear yourself shouting “NOOOO” in a deep voice you didn't know you had.",
              "You land flat on your stomach with your arms around Bean, who has stopped exactly one inch from the top step. Your face is in the carpet. Your shirt has come untucked. One of your shoes is somewhere downstairs.",
              { speaker: 'Baby Bean', say: "Bwa!" },
              { if: 'streaming', text: "From the bottom of the stairs, Oscar's phone is pointing straight at you. “That's going in the highlight reel,” he says. “Slow-mo. With music.”" },
            ],
            next: 'hallway',
          },
          {
            text: 'Shake a box of crackers like a maraca',
            hint: 'Babies are simple creatures. Probably.',
            art: '🍘',
            outcome: [
              "You grab a box of crackers off the hall table and rattle it like a game-show host. Bean freezes. Bean turns around. Bean's eyes go enormous with the pure, uncomplicated greed of the very young.",
              "Bean crawls back down the hall toward you at twice the speed, which you did not know was possible, and you scoop them up just as the wall sconce swivels back to face the wall, apparently satisfied.",
              { speaker: 'Baby Bean', say: "Gah. Nom. Gah." },
            ],
            next: 'hallway',
          },
          {
            text: 'Yell “GERALD, A LITTLE HELP?”',
            hint: 'You don\'t know who Gerald is. You\'re desperate.',
            effect: ger(1),
            art: '👻',
            outcome: [
              "You don't know why you say it. It just comes out. “GERALD! BABY! STAIRS! PLEASE!”",
              "The air at the top of the stairs goes cold and shimmers. Bean stops mid-crawl, lifts gently off the carpet, and floats back down the hallway toward you at a stately, unhurried pace, like a very small hot-air balloon. Bean is giggling. Bean has clearly done this before.",
              "Bean lands softly in your arms. The air beside you smells faintly of pipe tobacco and a voice, very old and very proper, murmurs in your ear:",
              { speaker: 'Gerald', say: "You said *please.* How *extraordinarily* civil. Nobody has said please to me since the Crimean War." },
            ],
            next: 'hallway',
          },
        ],
      },

      hallway: {
        scene: 'corridor',
        title: '7:48 PM: The Upstairs Hall',
        art: '🪞',
        mood: 'night',
        fx: 'flash',
        text: [
          "The upstairs hallway is long, gloomy and recently decorated. The wallpaper is brand new: a grey-on-grey chevron pattern so aggressively modern it looks like it should come with a password. A sample book is still lying on a side table. The pattern is called *Millennial Whisper.*",
          "As you walk past the big hall mirror, it fogs up. Letters appear on it, written by an invisible finger in elegant copperplate handwriting: ***HIDEOUS.***",
          "Then, underneath, smaller: ***I do apologise. Not you. The wallpaper.***",
          { speaker: 'Tilly', say: "Gerald hates it. Mummy put it up last week. He's been crying in the walls every night. It's quite loud." },
          { if: 'bean_gone', text: "You still only count two children. Bean's little sock is in your pocket. Every few seconds you hear a distant, delighted *bwa* from somewhere inside the house. It does not seem to come from the same place twice." },
          "At the end of the hall, a narrow door you hadn't noticed creaks open all by itself, revealing a ladder going up into darkness. A sign on the door says ATTIC, and under it, in Mrs. Pemberton's handwriting: *NO!!!* At the same moment, from deep in the basement, comes a low electronic *whirrrrrr*.",
          { if: 'streaming', text: { speaker: 'Oscar', say: "Chat says go in the attic. Chat is unanimous. Chat says it's *content.*" } },
        ],
        choices: [
          {
            text: 'Climb into the attic',
            hint: 'Rule number one. You are breaking rule number one.',
            art: '🪜',
            outcome: [
              "The note says don't go in the attic. But the note also says bedtime is 8:30, and you know already that that's not going to happen either, so really, what's one more rule?",
              "You climb the ladder. Tilly follows you without being asked. Oscar follows Tilly. The ladder creaks with every step, in a rhythm that sounds a little like someone humming a waltz.",
              { if: 'bean_gone', text: "Halfway up, you hear it clearly from above: *bwa.*" },
              "You push open the hatch. It's dark, dusty and smells like 1889.",
            ],
            next: 'attic',
          },
          {
            text: 'Follow the whirring into the basement',
            hint: 'Basements are scarier than attics. Statistically.',
            art: '🔦',
            outcome: [
              "The basement door opens with a groan. The stairs are steep and dark. The whirring gets louder as you go down, the shanty getting louder with it, so that it sounds like you're being stalked by a cheerful, extremely tiny navy.",
              { speaker: 'Oscar', say: "If I die down here, I want my channel to go to Tilly." },
              { speaker: 'Tilly', say: "I'll delete it." },
            ],
            next: 'basement',
          },
          {
            text: 'Lock everyone in the kitchen and call Mrs. Pemberton',
            hint: 'Escalate to management.',
            effect: dig(1),
            art: '📞',
            outcome: [
              "You herd everyone back down to the kitchen, shut the door, wedge a chair under the handle like they do in films, and dial the number on the fridge with slightly shaking fingers.",
              "It rings four times. Somewhere in the house, as if in answer, a grandfather clock you haven't seen bongs four times as well. You decide that's a coincidence. You decide that very firmly.",
            ],
            next: 'phone_call',
          },
        ],
      },

      /* ------------------------------------------------------------------ ACT 2A: THE ATTIC */
      attic: {
        scene: 'attic',
        title: '7:55 PM: The Attic',
        art: '🎩',
        mood: 'candle',
        weather: 'dust',
        enter: { effect: findBean },
        text: [
          "The attic is full of old furniture under white sheets, hatboxes, a dressmaker's dummy and one round window letting in a slice of moonlight. In the middle of the floor, a ring of candles lights itself, one at a time, *fwip fwip fwip*.",
          "Sitting in the middle of the ring is Bean, happily chewing the brim of a top hat. And holding the top hat, at least partly, is a man.",
          "He's tall, faintly see-through, and dressed for a very formal funeral in 1889: tailcoat, waistcoat, magnificent mutton-chop sideburns, a monocle on a ribbon. He rises from the floor, sweeps the hat off Bean and onto his head, and bows so low his sideburns brush the floorboards.",
          { speaker: 'Gerald', say: "Good evening. I am Sir Gerald Fortescue-Pimm, late of this parish. *Very* late. I would offer you tea, but I find I am unable to boil water, on account of being deceased." },
          { speaker: 'Gerald', say: "Forgive my appearance. I am in mourning. Not for myself, you understand. For the *wallpaper.*" },
          { speaker: 'Baby Bean', say: "Bwa!" },
          "**Kids accounted for: three.** Bean, it turns out, has been coming up here for tea parties for months.",
        ],
        choices: [
          {
            text: 'Agree that the wallpaper is a crime against humanity',
            hint: 'You did see the sample book. It was called Millennial Whisper.',
            effect: ger(1),
            art: '😤',
            outcome: [
              "You throw up your hands. “It's grey! It's grey on grey! It's called *Millennial Whisper!* Who wants their wallpaper to whisper?”",
              "Gerald freezes. His monocle drops out of his eye. A single translucent tear runs down his cheek and evaporates with a little *hiss*.",
              { speaker: 'Gerald', say: "You *see* it. Dear heavens, you *see* it. A hundred and thirty-five years I have haunted this house, and in all that time only one other soul has ever understood me, and she's seven." },
              { speaker: 'Tilly', say: "Seven and a quarter." },
            ],
            next: 'wallpaper_talk',
          },
          {
            text: 'Bow back and introduce yourself properly',
            hint: 'Match his energy. Full Victorian.',
            effect: all(ger(1), dig(1)),
            art: '🙇',
            outcome: [
              "You remove an imaginary hat, place a hand on your heart and bow from the waist. “Charmed, Sir Gerald. I am the babysitter, at your service, and may I say what a *splendid* set of whiskers.”",
              "Gerald gasps. He clutches his chest, which his hand passes slightly through. The candles flare up an inch in delight.",
              { speaker: 'Gerald', say: "*Manners!* In this century! I had heard they were extinct, like the dodo and the decent hat. Do sit. Mind the dummy, she bites." },
            ],
            next: 'wallpaper_talk',
          },
          {
            text: 'Tell him to clear out. This is a family home.',
            hint: 'You are the adult. Technically.',
            effect: all(ger(-1), dig(1)),
            art: '☝️',
            outcome: [
              "You put your hands on your hips. “Look, Gerald. Sir. Whatever. There are children here. You can't just be hanging around attics being dead at people.”",
              "The candles go out. All of them. At once. In the sudden darkness, Gerald's outline begins to glow a pale, furious green, and his voice rises to the pitch of a Shakespearean actor who has just been told his lines were cut.",
              { speaker: 'Gerald', say: "CLEAR... OUT? I *built* this house! I *papered* this hall! With my own two hands and a brush made from the finest badger!" },
            ],
            next: 'gerald_tantrum',
          },
        ],
      },

      gerald_tantrum: {
        scene: 'attic',
        title: '7:58 PM: The Attic, Briefly Airborne',
        art: '🌪️',
        mood: 'toxic',
        weather: 'dust',
        fx: 'shake',
        text: [
          "The attic erupts. Sheets fly off the furniture and flap around the rafters like enormous, startled pigeons. Hatboxes spin. The dressmaker's dummy rises into the air and turns slowly to look at you. A rocking chair begins to rock with real hostility.",
          { speaker: 'Gerald', say: "A hundred and thirty-five YEARS! And now a person in *trainers* tells me to CLEAR OUT? I have never been so insulted, and I was once called a *Whig!*" },
          { speaker: 'Oscar', say: "This is the best night of my life." },
          { speaker: 'Tilly', say: "He gets like this. You have to wait till he runs out of furniture." },
        ],
        choices: [
          {
            text: 'Apologise. Sincerely. With feeling.',
            hint: 'Swallow your pride. It\'s been a long night already.',
            effect: all(ger(2), dig(-1)),
            art: '🥺',
            outcome: [
              "You raise both hands. “Gerald, I'm sorry. That was rude. You were here first. You were here first by about a hundred years. I'm the guest. I'm the guest in your house.”",
              "The furniture stops in midair. Slowly, everything lowers back to the floor. The dummy settles last, with a little bump, and looks faintly embarrassed about the whole thing.",
              { speaker: 'Gerald', say: "...An apology. A *real* one. Not a *sorry-you-feel-that-way.* How unexpectedly gracious." },
              "He dabs his eyes with a handkerchief that is also a ghost. Then, after a moment, he offers you his hand. It's like shaking hands with a fridge, but a fridge that means it.",
            ],
            next: 'wallpaper_talk',
          },
          {
            text: 'Stand firm. Fold your arms. Wait it out.',
            hint: 'Tilly said he\'ll run out of furniture.',
            effect: dig(1),
            art: '🗿',
            outcome: [
              "You fold your arms. You plant your feet. A hatbox bounces off your head. You do not flinch. A lampshade lands on you like a crown. You do not flinch. The dummy floats right up to your face and stares. You flinch a little, but you style it out.",
              "Eventually Gerald runs out of furniture. He hovers, panting (he doesn't need to breathe; it's for effect), surrounded by a slowly settling snowfall of dust.",
              { speaker: 'Gerald', say: "Well. You're a stubborn one. I shall be in the walls. Sulking. Do not follow me." },
              "He sinks through the floor. From somewhere below, almost immediately, you hear a dramatic sob and then a loud, mechanical *WHIRRR* that sounds a lot like a vacuum cleaner waking up with a grudge.",
            ],
            next: 'roomba',
          },
          {
            text: 'Laugh. You can\'t help it. He said Whig.',
            hint: 'It\'s funny. It\'s genuinely funny.',
            set: ['laughed'],
            effect: ger(-1),
            art: '😂',
            outcome: [
              "It's the word *Whig.* It gets you. You try to hold it in, but a snort escapes, and then another, and then you're laughing so hard you have to sit down on a floating ottoman.",
              "Gerald goes very, very still. The green glow drains out of him, replaced by something colder and much more polite, which is much worse.",
              { speaker: 'Gerald', say: "You find death *amusing?* Then perhaps you would care to see it from the *other side.*" },
            ],
            next: 'limbo',
          },
        ],
      },

      wallpaper_talk: {
        scene: 'attic',
        title: '8:10 PM: Negotiations',
        art: '📜',
        mood: 'candle',
        weather: 'dust',
        text: [
          { speaker: 'Gerald', say: "Allow me to explain my position. In 1889, I hung the wallpaper in that hallway with my own hands. Crimson damask. Gold thread. Peacocks. Forty-one peacocks, each with a *slightly different expression.*" },
          { speaker: 'Gerald', say: "And last Tuesday, your employer covered my peacocks with something called *Millennial Whisper.* I have not stopped weeping since. I have been weeping through the *pipes.* Did you not wonder why the shower is always cold?" },
          "He gestures dramatically at a big old steamer trunk in the corner. Tilly opens it. Inside are rolls and rolls of original crimson-and-gold wallpaper, absolutely covered in peacocks. One of the peacocks appears to be winking.",
          { speaker: 'Tilly', say: "Mummy put the old rolls up here. She said they were *a bit much.*" },
          { speaker: 'Gerald', say: "*A BIT MUCH.* That is what my late wife said, in 1889. Word for word. I have been waiting a hundred and thirty-five years for somebody to say it is *lovely.*" },
          "He looks at you expectantly. The peacock winks again.",
        ],
        choices: [
          {
            text: 'Roll up your sleeves. We\'re putting the peacocks back.',
            hint: 'Tonight. You, a ghost and a seven-year-old with a paste brush.',
            set: ['wallpaper_fixed', 'letters'],
            effect: all(ger(1), dig(-1)),
            art: '🦚',
            outcome: [
              "You make wallpaper paste out of flour and water in a mixing bowl. Gerald supervises with enormous, quivering intensity. Tilly does the brushing. Oscar holds the ladder. Bean eats some of the paste, which is fine, it's flour.",
              "It takes forty minutes. It's not perfect: one peacock is upside down and you get paste in your hair, your eyebrows and, somehow, your sock. But when you step back, the whole upstairs hallway is glowing crimson and gold, and forty-one peacocks are looking at you with forty-one slightly different expressions.",
              { speaker: 'Gerald', say: "Oh. *Oh.* It's... it's just as I left it. Before I fell off the ladder. Did I mention I fell off the ladder? Hanging the last strip? Nobody was holding it. *Nobody* holds ladders in this family." },
            ],
            next: 'roomba',
          },
          {
            text: 'Propose a compromise: one peacock feature wall',
            hint: 'Modern design meets Victorian grief.',
            set: ['wallpaper_fixed'],
            effect: ger(1),
            art: '🖼️',
            outcome: [
              "You explain the concept of a *feature wall*. One wall of peacocks. The rest stay grey. It's very fashionable. It's in all the magazines. You make the magazines up.",
              "Gerald listens with his head tilted, like a dog hearing a word it almost knows. Then a slow, translucent smile spreads under his whiskers.",
              { speaker: 'Gerald', say: "A *feature* wall. One wall, glorious. The others, mute and humble, so as to *frame* the glory. Why, it's practically Wagnerian." },
            ],
            next: 'roomba',
          },
          {
            text: 'Point out you\'re a babysitter, not an interior decorator',
            hint: 'Boundaries. Healthy ones.',
            effect: all(ger(-1), dig(1)),
            art: '🙅',
            outcome: [
              "You set your imaginary teacup down. “Gerald, I hear you. I really do. But I'm being paid fifteen dollars an hour to make sure three children are alive at ten o'clock. Wallpaper is above my pay grade.”",
              { if: 'raise', text: "“Twenty,” Tilly corrects. “You got her up to twenty. I was listening at the window.”" },
              "Gerald's whiskers droop. His teapot falls apart into mist. He sinks slowly down into the floor until only his top hat is visible, sitting on the floorboards like a sad chimney.",
              { speaker: 'Gerald', say: "Of course. Of course. Business. *Trade.* Don't mind me. I'll just be down here. In the floor. Unwallpapered." },
            ],
            next: 'roomba',
          },
          {
            text: 'Let Oscar\'s livestream vote on it',
            hint: 'Democracy! What could go wrong?',
            set: ['streaming', 'viral'],
            effect: dig(-1),
            art: '🗳️',
            outcome: [
              "Oscar is already holding up a phone, or a tablet, or possibly both. He launches a poll: *PEACOCKS or GREY?* Gerald peers at the screen over Oscar's shoulder, deeply suspicious of the twenty-first century.",
              "The poll gets four thousand votes in ninety seconds. The winning option is neither. It's a write-in: *MAKE THE GHOST AND THE BABYSITTER DO A DANCE.*",
              { speaker: 'Oscar', say: "Chat has spoken. Chat wants a waltz. I don't make the rules, I just monetise them." },
              "Gerald, it turns out, is a magnificent waltzer. You are not. The video of you being whirled around an attic by a see-through man in a top hat, screaming slightly, is clipped, captioned and shared before the song is even over.",
            ],
            next: 'roomba',
          },
        ],
      },

      /* ------------------------------------------------------------------ ACT 2B: THE BASEMENT */
      basement: {
        scene: 'basement',
        title: '7:55 PM: The Basement',
        art: '🧺',
        mood: 'night',
        weather: 'dust',
        text: [
          "The basement is a damp maze of boxes, pipes and old furniture. A single bare bulb swings gently, even though there's no draught. The lighthouse flashlight plays *What Shall We Do with the Drunken Sailor* at an inappropriate volume.",
          "In one corner sits the Roomba's charging dock, empty. Little tracks in the dust lead away from it in loops, spirals and what looks very much like a pentagram. Beside the dock, facing the wall, is a huge old oil painting in a gold frame.",
          { if: 'bean_gone', text: "And in a laundry basket under the stairs, wrapped in a towel and fast asleep, is Bean, holding a tiny ghostly teacup. **Kids accounted for: three** again. You have never been so happy to see a damp baby." },
          { if: '!bean_gone', text: "Bean, in your arms, points at the painting and says something very urgent in Bean language." },
          { speaker: 'Baby Bean', say: "Gerra! Gerra bwa!" },
          "A cardboard box beside the painting is labelled in old, faded ink: *G. F-P. Private. Do Not Read.* The lid is slightly open. A corner of a yellowed letter is poking out, like a tongue.",
          "Somewhere upstairs, the whirring has become a *revving.*",
        ],
        enter: { effect: findBean },
        choices: [
          {
            text: 'Turn the portrait around',
            hint: 'Every haunted house has one. Might as well meet them.',
            effect: ger(1),
            art: '🖼️',
            outcome: [
              "You heave the frame around. It's a portrait of a tall, mutton-chopped man in a top hat, posing heroically next to a stepladder and a roll of crimson wallpaper. The little brass plaque says *Sir Gerald Fortescue-Pimm, 1841–1889. Decorator.*",
              "The painted eyes swivel to look at you. Then the painted mouth moves.",
              { speaker: 'Gerald', say: "Oh, thank *heavens.* She turned me to face the wall when she put up that *grey business.* I've been staring at plaster since Tuesday. Do you know what plaster is like? It is *beige,* my dear. It is *beige.*" },
              "A faint, see-through version of the man steps right out of the canvas, adjusts his cuffs and gives you a deep, grateful bow. Then the revving upstairs turns into a roar, and his face falls.",
              { speaker: 'Gerald', say: "Ah. You'll have woken Mr. Pickles." },
            ],
            next: 'roomba',
          },
          {
            text: 'Read the private letters',
            hint: 'It literally says Do Not Read. That\'s basically an invitation.',
            set: ['letters'],
            art: '✉️',
            outcome: [
              "You open the box. It's full of letters on thick cream paper, tied with ribbon. The top one is dated 1889 and written in elegant, loopy handwriting.",
              "*My dearest Gerald, the hall paper is very fine, but I must confess it is a bit much. Forty-one peacocks, my love? Do come down off the ladder for supper. — Your Agatha.*",
              "Underneath, in a different, shakier hand, as if someone wrote it much later: *She was right, it was a bit much. But I did so want someone to say it was lovely. Just once. Then I think I could rest.*",
              { speaker: 'Tilly', say: "That's Gerald's. He's going to be cross you read it. He's also going to be quite relieved, I think." },
            ],
            next: 'roomba',
          },
          {
            text: 'Grab everyone and get back upstairs. Now.',
            hint: 'You did not sign up for basements.',
            effect: dig(1),
            art: '🏃',
            outcome: [
              "You do the sensible thing. You grab Bean, you grab Tilly's hand, you yell for Oscar, and you march everyone back up the basement stairs at a brisk, professional pace that is definitely not running.",
              "Behind you, a low voice drifts up the stairs, sounding terribly hurt.",
              { speaker: 'Gerald', say: "I *say.* You might at least have turned my portrait round. It's been *beige* down here for a *week.*" },
              "You slam the door. You lean on it. And from the living room, with a sound like a very small jet engine, something round and glowing comes speeding toward you across the floor.",
            ],
            next: 'roomba',
          },
        ],
      },

      /* ------------------------------------------------------------------ ACT 2C: THE PHONE CALL */
      phone_call: {
        scene: 'kitchen',
        title: '7:52 PM: Calling Management',
        art: '☎️',
        mood: 'night',
        text: [
          "The line clicks. In the background you can hear violins, clinking glasses, and someone shouting *bid twelve thousand on the ice sculpture!*",
          { speaker: 'Mrs. Pemberton', say: "Hellooo, darling! Everything all right? Is it the boiler? It's never the boiler. Unless it's the boiler. Is it?" },
          "Behind you, the cutlery drawer slides open on its own. A single teaspoon rises out of it and stirs an empty mug, very slowly, with great dignity. Tilly watches it like it's the weather.",
          { if: 'bean_gone', text: "You also have one fewer baby than you had when she left, but you decide to work up to that." },
          { speaker: 'Mrs. Pemberton', say: "Only I'm at the charity gala and we're about to do the raffle and I've got a really good feeling about the hamper!" },
        ],
        choices: [
          {
            text: 'Ask her straight: “Is Gerald a ghost?”',
            hint: 'No more euphemisms.',
            set: ['asked_gerald'],
            art: '👻',
            outcome: [
              { speaker: 'You', say: "Mrs. Pemberton. Is Gerald a ghost?" },
              { speaker: 'Mrs. Pemberton', say: "Well, *obviously,* darling, what did you think he was, a lodger? He came with the house! Lovely man. Bit of a drama queen. He's sulking about the wallpaper, apparently, which is rich coming from someone who doesn't pay rent!" },
              { speaker: 'Mrs. Pemberton', say: "Old rolls are in the attic if he wants them, I'm not fussed. OH! They're drawing the hamper! Byeee!" },
              "She hangs up. The teaspoon stops stirring. It does a little celebratory twirl, and from the walls comes a long, astonished sigh, as if someone has just been told they're allowed back into their own home.",
            ],
            effect: ger(1),
            next: 'roomba',
          },
          {
            text: 'Pretend everything is completely fine',
            hint: 'Lie like a professional.',
            effect: dig(1),
            art: '😁',
            outcome: [
              { speaker: 'You', say: "Everything's great! Totally normal! Kids are angels! Nothing is floating!" },
              "On *floating,* the teaspoon drops into the mug with a loud *clink.* You cover the phone. Tilly gives you a slow, disappointed look.",
              { speaker: 'Mrs. Pemberton', say: "*Marvellous!* I knew you were a natural! Oh, and if the Roomba starts acting funny, just don't make eye contact. Love you, bye!" },
              "She hangs up before you can ask how a Roomba makes eye contact. From the living room, as if on cue, there is a loud electronic *chime*, and a calm voice says: *Cleaning cycle. Started.* Then, in a much lower voice: *Forever.*",
            ],
            next: 'roomba',
          },
          {
            text: 'Hand the phone to Tilly',
            hint: 'Let the expert handle it.',
            effect: ger(1),
            art: '🧒',
            outcome: [
              "You hand the phone to Tilly. She takes it with the bored professionalism of a hostage negotiator.",
              { speaker: 'Tilly', say: "Mummy. Gerald says the new wallpaper is a war crime. He says he'll stop crying through the pipes if he gets his peacocks back." },
              { speaker: 'Mrs. Pemberton', say: "Tell Gerald it was on *sale,* Tilly. Tell him the peacocks are in the attic and he can have them for all I care. Kisses! Don't let the sitter in the attic!" },
              "Tilly hangs up and looks at you. “She said you can go in the attic,” she lies smoothly. Somewhere in the walls, Gerald gives a long, heartfelt *bravo.*",
            ],
            next: 'roomba',
          },
        ],
      },

      /* ------------------------------------------------------------------ BOTTLENECK: THE ROOMBA */
      roomba: {
        scene: 'house',
        title: '8:22 PM: The Living Room',
        art: '🤖',
        mood: 'toxic',
        fx: 'glitch',
        text: [
          "The Roomba comes round the corner on two wheels. It is glowing an eerie, swampy green. Its little brush arms are spinning so fast they hum. Its cheerful *beep-boop* has dropped about three octaves and now sounds like it's coming from a cathedral.",
          { speaker: 'Tilly', say: "That's Mr. Pickles. He was Gerald's cat. He got into the Roomba at Christmas. He doesn't like it in there." },
          s => (s.has('bean_gone')
            ? "And riding on top of it, sitting cross-legged like a tiny charioteer, is **Bean**. Bean is having the absolute time of their life. The Roomba is heading straight for the open back door and the dark, muddy, ornamental pond beyond it."
            : "It's heading straight for you. Specifically, for your shoelaces. It has the focused, hungry look of a creature that has been vacuuming crumbs for a year and now wants something with *texture.*"),
          { if: 'streaming', text: { speaker: 'Oscar', say: "CHAT. CHAT. Are you SEEING this. Clip it! Somebody clip it!" } },
        ],
        timer: 8,
        timeout: {
          text: 'You froze.',
          effect: dig(-2),
          art: '🌀',
          outcome: [
            "You hesitate one second too long. The Roomba latches onto your shoelace with a vile slurping sound and takes off across the living room, towing you behind it in a series of tight, humiliating circles while it plays a dramatic organ chord out of its tiny speaker.",
            s => (s.has('bean_gone')
              ? "Bean leaps off at the last second, giggling, and disappears behind the sofa in a puff of glitter. When you look behind the sofa, there's nobody there. Just a raisin and a ghostly *bwa.*"
              : "Somewhere around lap nine, it gets bored, spits your shoe out and reverses off into the kitchen to sulk under the dishwasher."),
            "You're lying on the rug with one sock on and carpet fluff in your mouth. Your dignity is somewhere under the coffee table. Tilly looks down at you, unimpressed.",
            { speaker: 'Tilly', say: "You're supposed to throw a sock. Everybody knows that." },
          ],
          next: 'livestream',
        },
        choices: [
          {
            text: 'Jump on it and smack the OFF button',
            hint: 'Rodeo time.',
            effect: all(dig(-1), findBean),
            fx: 'shake',
            art: '🤠',
            outcome: [
              "You leap. You land, somehow, on top of the Roomba, one foot on the bumper, one arm in the air, like a surfer on a very small and furious wave. It bucks. It spins. It takes you twice round the dining table at a speed no household appliance should achieve.",
              "You find the OFF button with your big toe and *press.* The Roomba gives a long, deflating mechanical yowl, the green glow flickers out, and it coasts to a stop under the coffee table with a little, sulky *mrrp.*",
              { if: 'streaming', text: "Oscar's phone is two inches from your face. “Bro just rode a haunted Roomba. Bro is a LEGEND. Bro has *no* dignity, but bro is a LEGEND.”" },
              "You climb off, panting. If Bean was missing, they're on your hip now, because you grabbed them on the way past without even thinking. **Kids accounted for: three.**",
            ],
            next: 'livestream',
          },
          {
            text: 'Take off a sock and throw it like a frisbee',
            hint: 'It\'s a cat. A cat in a vacuum. Use the cat.',
            effect: findBean,
            art: '🧦',
            outcome: [
              "You yank off a sock, roll it into a ball, and fling it across the room. The Roomba stops dead. Its little lights blink. Then it spins and pounces on the sock with an unmistakably cat-like *wiggle* of its back end.",
              { if: 'bean_gone', text: "In all the excitement, Bean simply slides off the top of it onto the rug, crawls over to you and grabs your leg. **Kids accounted for: three.**" },
              { speaker: 'Tilly', say: "See? He's just a cat. He just wants to play. Same as everyone." },
            ],
            next: 'livestream',
          },
          {
            text: 'Shout for Gerald to control his cat',
            hint: 'If he likes you, he might actually help.',
            effect: (s) => { if (FRIEND(s)) findBean(s); else s.setVar('dignity', clamp(s.get('dignity') - 1, 5)); },
            art: '🎩',
            outcome: [
              { speaker: 'You', say: "GERALD! YOUR CAT IS IN THE ROOMBA!" },
              s => (FRIEND(s)
                ? [
                    "Gerald sweeps through the wall in a swirl of cold air, coat-tails flying, and points at the Roomba with one white-gloved finger.",
                    { speaker: 'Gerald', say: "Mr. Pickles. *Sit.*" },
                    "The Roomba stops dead. Its light flickers to a calm, obedient blue. It rolls slowly over to Gerald's feet and rubs against his ankle, which it passes partly through. Gerald pats it awkwardly on the bumper. If Bean was riding it, Bean is now sitting safely on the rug, clapping. **Kids accounted for: three.**",
                    { speaker: 'Gerald', say: "He's never been the same since the vacuum business. Neither have I, frankly." },
                  ]
                : [
                    "A voice drifts out of the walls, wounded and frosty.",
                    { speaker: 'Gerald', say: "Oh, *now* you want Gerald. *Now* Gerald is useful. I'm afraid Gerald is *indisposed.*" },
                    "The Roomba hits you square in the ankle, spins you around, bumps you again for good measure and zooms off into the kitchen, cackling electronically. You hop around the living room holding your foot while Oscar does a slow zoom on your face.",
                  ]),
            ],
            next: 'livestream',
          },
        ],
      },

      /* ------------------------------------------------------------------ ACT 3: THE STREAM */
      livestream: {
        scene: 'house',
        title: '8:41 PM: Going Viral',
        art: '📈',
        mood: 'night',
        text: [
          "Bedtime was eleven minutes ago. Nobody is in bed. Nobody is even in pyjamas. Oscar is standing on the coffee table holding up his backup tablet like a trophy.",
          s => (s.has('phone_taken')
            ? { speaker: 'Oscar', say: "So, funny story. The backup tablet has a backup tablet. Also I went live while you weren't looking. Also we have forty thousand viewers." }
            : { speaker: 'Oscar', say: "FORTY THOUSAND VIEWERS! Forty! Thousand! #HauntedBabysitter is TRENDING! I'm getting *brand deals!* A brand of ghost-proof socks wants to sponsor us!" }),
          "He turns the screen toward you. The comments are scrolling past too fast to read, but you catch a few. *the babysitter is SO done* / *the kid with the tweezers is my queen* / *SÉANCE SÉANCE SÉANCE* / *is the top hat guy single*",
          "On the floor, Tilly has laid out a Scrabble board. She has arranged the tiles into a full alphabet in a big arc, with YES and NO at either end. She's using a coaster as a planchette. She looks up at you.",
          { speaker: 'Tilly', say: "The internet wants a séance. Gerald also wants a séance. Gerald loves a séance. He says it's like a phone call, but *spooky.*" },
        ],
        choices: [
          {
            text: 'Shut the stream down. This is a family home.',
            hint: 'Forty thousand strangers do not need to see this.',
            unset: ['streaming'],
            effect: dig(1),
            art: '📴',
            outcome: [
              "You take the tablet out of Oscar's hands, say “Goodnight, internet,” into the camera, and press END STREAM. Oscar falls backward onto the sofa as if he's been shot.",
              { speaker: 'Oscar', say: "You can't just *end* a stream. You have to *outro* it. There's an *outro!*" },
            ],
            next: 'seance',
          },
          {
            text: 'Lean in. Do a dramatic intro for the fans.',
            hint: 'If you\'re going to go viral, go viral properly.',
            set: ['streaming', 'viral'],
            effect: dig(-2),
            art: '🎬',
            outcome: [
              "You grab a candle, hold it under your chin, and lower your voice to a spooky whisper. “Greetings, mortals. Tonight... we commune... with the *beyond.*”",
              "It's bad. It's *so* bad. The chat explodes. Somebody turns your face into a reaction GIF before you've even finished the sentence. Somebody else remixes it into a song. By the time you sit down, the remix has two hundred thousand views and a dance.",
              { speaker: 'Oscar', say: "You're the main character now. I'm so proud. I'm also a little jealous. Mainly proud." },
            ],
            next: 'seance',
          },
          {
            text: 'Ask the internet for wallpaper advice',
            hint: 'Forty thousand people. Surely one of them is a decorator.',
            set: ['streaming', 'wallpaper_fixed'],
            effect: all(ger(1), dig(-1)),
            art: '💡',
            outcome: [
              "You grab the tablet. “Okay, chat. Real question. There is a ghost. He's upset about the wallpaper. Grey chevron, very modern. He wants Victorian peacocks. What do we do?”",
              "There is a brief pause in the chat. Then a user called *xx_Margaret_Decorates_1954_xx* takes over, typing faster than anyone has ever typed. Peel-and-stick. Peacock print. There's a roll in the hall cupboard; she can see it on the stream behind you.",
              "Ten minutes later, under Margaret's direction and forty thousand people's supervision, one whole wall of the hall is covered in self-adhesive peacocks. It's crooked. It's glorious. Gerald floats in front of it with his hand on his heart.",
              { speaker: 'Gerald', say: "The internet. I had heard it was a sewer. I see now it is merely a *very large parish.*" },
            ],
            next: 'seance',
          },
        ],
      },

      seance: {
        scene: 'bedroom',
        title: '9:20 PM: The Séance',
        art: '🔤',
        mood: 'candle',
        weather: 'sparkles',
        text: [
          "You move the séance into Tilly's bedroom, on the theory that if you're going to talk to the dead you may as well do it somewhere the kids can fall asleep afterwards. It's a reasonable theory. It's the only reasonable thing you've done all night.",
          { speaker: 'Tilly', say: "Gerald? Are you there? Knock once for yes, twice for no, and three times if it's about the wallpaper." },
          "*Knock. Knock. Knock.*",
          s => (FRIEND(s)
            ? "The coaster glides gracefully across the board, spelling out **G-O-O-D E-V-E-N-I-N-G D-E-A-R F-R-I-E-N-D-S.** Then, after a pause, it adds a little peacock made of tiles."
            : "The coaster jerks sharply across the board and spells out **V-U-L-G-A-R.** Then, after a pause, **S-H-O-E-S.**"),
          { if: 'bean_gone', text: "Halfway through, you notice the circle has a gap in it. A Bean-shaped gap. **Kids accounted for: two.**" },
          "The candle flickers. The coaster is twitching under your fingers, waiting. You get one question before the candle burns down.",
        ],
        choices: [
          {
            text: 'Ask: “Gerald, what do you really want?”',
            hint: 'Ghosts always want something. That\'s how ghosts work.',
            set: ['letters'],
            effect: ger(1),
            art: '💭',
            outcome: [
              "The coaster sits still for a long time. Then it begins to move, slowly, letter by letter, while everyone reads along in a whisper.",
              "**I W-A-N-T-E-D S-O-M-E-O-N-E T-O S-A-Y I-T W-A-S L-O-V-E-L-Y.**",
              { speaker: 'Tilly', say: "The wallpaper. In 1889. His wife said it was *a bit much.* Then he fell off the ladder. He's been waiting ever since." },
              "Nobody says anything for a moment. Even Oscar lowers his phone. Somewhere in the walls, very quietly, an old man blows his nose.",
            ],
            next: 'midnight',
          },
          {
            text: 'Ask: “Where is Bean?”',
            hint: 'Count the children. Count them again.',
            effect: findBean,
            art: '🔍',
            outcome: [
              s => (s.get('kids') === 3 && !s.has('oscar_gone')
                ? "The coaster zips to **B-E-H-I-N-D Y-O-U**. You whip around. Bean is sitting in the toy box, wearing a lampshade, eating a crayon. The coaster adds: **O-B-V-I-O-U-S-L-Y.**"
                : "The coaster zips around the board."),
              "You fish Bean out, confiscate the crayon and do a careful headcount: one Tilly, one Oscar, one Bean. **Kids accounted for: three.** You write the number on your hand in marker so you don't forget what it's supposed to be.",
              { speaker: 'Baby Bean', say: "Bwa. Bwa bwa. *Gerra.*" },
              { speaker: 'Tilly', say: "Bean says Gerald's been babysitting them all night. Bean says he's better at it than you. No offence." },
            ],
            next: 'midnight',
          },
          {
            text: 'Ask the spirits to let YOU cross over, just for a peek',
            hint: 'For the content. For science. For the content.',
            set: ['viral'],
            effect: dig(-1),
            art: '🌀',
            outcome: [
              "You don't know what possesses you. Possibly something did. You lean over the board and say, in your spookiest voice, “O spirits! Let me see the other side! Just a quick look! I'll be right back!”",
              { if: 'streaming', text: "Oscar's chat goes completely silent for the first time all night. Then forty thousand people type *bro no.*" },
              "The coaster spells, very fast: **N-O N-O N-O D-O-N-T.** But it's too late. The candle flame turns blue and stretches up toward the ceiling, and the bedroom floor goes soft and grey underneath you like wet sand.",
              { speaker: 'Gerald', say: "Oh, you *absolute* goose." },
            ],
            next: 'limbo',
          },
          {
            text: 'Blow out the candle. It\'s past bedtime. Everyone to bed.',
            hint: 'Responsible adult mode: activated. Late, but activated.',
            effect: dig(1),
            art: '🛏️',
            outcome: [
              "You blow out the candle. The coaster stops. You stand up and announce in your best responsible-adult voice that the séance is over and it's bedtime, actually, and has been since 8:30, and nobody's going to talk to any more dead people until they've brushed their teeth.",
              "Astonishingly, it works. Tilly gets into bed. Oscar gets into bed, still holding the tablet under the covers like a flashlight. Bean falls asleep instantly in the cot, like a phone that's been unplugged.",
              { speaker: 'Gerald', say: "Hm. *Firm.* Just like my old nanny. She had a moustache and a cane. You are like her, but with fewer of both." },
              "You tiptoe downstairs. It's quiet. It's actually, genuinely quiet. Then the clock on the cooker clicks over to 11:58.",
            ],
            next: 'midnight',
          },
        ],
      },

      /* ------------------------------------------------------------------ THE OTHER SIDE */
      limbo: {
        scene: 'void',
        title: '??:?? The Other Side',
        art: '🌫️',
        mood: 'fog',
        weather: 'sparkles',
        fx: 'flash',
        text: [
          "You're standing in a grey, misty space that looks like a waiting room designed by clouds. There's a water cooler. There's a ticket dispenser. There's a sign that says NOW SERVING: 1889 and, under it, a long line of transparent people in very old clothes, all looking extremely bored.",
          "Far off, at the end of a misty corridor, there's a soft, warm, golden light. It's very inviting. It smells like fresh bread and clean laundry. It's got a little sign hanging next to it: *THIS WAY. NO RUSH. (BUT ALSO, NO RETURNS.)*",
          "And behind you, very faint, like a voice through a wall, you can hear a seven-year-old.",
          { speaker: 'Tilly', say: "Babysitter. You're not allowed to be dead. Mummy hasn't paid you yet." },
          { if: (s) => FRIEND(s), text: { speaker: 'Gerald', say: "Hold on, dear fellow! Don't go toward the light! It's a *dreadful* queue and the biscuits are *stale!*" } },
        ],
        choices: [
          {
            text: 'Walk toward the light. It smells like bread.',
            hint: 'It does smell very, very nice.',
            art: '✨',
            outcome: [
              "You take one step toward the light. Then another. The bread smell gets stronger. There's butter now. Maybe jam. Your feet stop touching the floor entirely.",
              "A tired-looking ghost in a clipboard hands you a ticket. It says number 4,388,201. The sign says NOW SERVING: 12. She looks at you without much sympathy.",
              "“Good news,” she says. “There's a job opening. Haunting. Big old house. Previous occupant is applying for a transfer. Pays nothing, hours are eternal, dental is irrelevant.” She slides a form across the desk. At the top it says **NOW HIRING.**",
            ],
            next: 'end_ghost',
          },
          {
            text: 'Grab Tilly\'s voice and pull yourself back',
            hint: 'Follow the sound of the deadpan child.',
            effect: dig(-1),
            art: '🫴',
            outcome: [
              "You turn your back on the beautiful bread-smelling light, which takes a lot of willpower, and follow Tilly's voice through the fog. *Babysitter. Babysitter. You owe me a juice box.*",
              "You reach out and something small and firm grabs your hand and *yanks.* You come out of the fog flat on your back on the floor of the house, gasping, slightly see-through around the edges. Tilly is sitting on your chest.",
              { speaker: 'Tilly', say: "You were gone for *ages.* I made a cheese toastie while I was waiting. I didn't make you one." },
            ],
            next: 'midnight',
          },
          {
            text: 'Ask the bored ghosts in the queue for directions',
            hint: 'They\'ve been here a while. They know the place.',
            set: ['letters'],
            effect: ger(1),
            art: '🗺️',
            outcome: [
              "You tap the shoulder of a ghostly woman in a bonnet near the back of the queue. She turns. She has a tired face and kind eyes, and she's holding a little cream-coloured letter.",
              "“Oh, you're from the Pemberton house,” she says. “I'm Agatha. Gerald's wife. Will you tell him something for me? Tell him the wallpaper was lovely. It was always lovely. I only said *a bit much* because I was cross he missed supper.” She sighs. “He'll never come through until somebody tells him. Stubborn man.”",
              "She gives you a gentle shove in the right direction. You fall back through the fog, through the ceiling, and land on the kitchen floor with a *whump.* The clock on the cooker says 11:58 PM. Your edges are still a little transparent. You have a message to deliver.",
            ],
            next: 'midnight',
          },
        ],
      },

      /* ------------------------------------------------------------------ ACT 4: MIDNIGHT */
      midnight: {
        scene: 'kitchen',
        title: '11:59 PM: The Kitchen',
        art: '🕛',
        mood: 'night',
        fx: 'heartbeat',
        text: [
          "Your phone buzzes. It's a text from Mrs. Pemberton: *Running LATE!! Won the hamper!! Back by 12:30 xx Don't forget rule 2!!!* There are eleven champagne emojis.",
          "Rule two. You look at the note on the fridge. **Don't feed Gerald after midnight.** You look at the clock on the cooker. 11:59. You look up.",
          "Gerald is sitting at the kitchen table, fully visible now, top hat on the table beside him, hands folded, looking at the biscuit tin on the counter the way a Labrador looks at a sausage.",
          { speaker: 'Gerald', say: "I wonder, dear friend, if I might trouble you for a biscuit? Only a small one. A digestive. A *custard cream,* if you're feeling wicked. It has been such a very long evening." },
          s => (MOVEON_READY(s)
            ? "You look at him: an old man in an old house, waiting for a word he's waited a hundred and thirty-five years to hear. You know what it is now. You know exactly what he needs. And it isn't a biscuit."
            : "The clock ticks. The biscuit tin is right there. Gerald smiles, very politely, in a way that shows slightly too many teeth for a man of his era."),
          "*Tick.* The clock turns to 12:00.",
        ],
        choices: [
          {
            text: 'Give him a biscuit. What\'s the worst that could happen?',
            hint: 'You\'ve seen this film. You choose not to remember how it ends.',
            set: ['fed'],
            effect: all(ger(1), loseBean, dig(-1)),
            fx: 'glitch',
            art: '🍪',
            outcome: [
              "You hand him a custard cream. He takes a delicate bite. He chews. He closes his eyes in rapture. Then he hiccups.",
              "With a sound like a cork popping, there are *two* Geralds. Then the second Gerald hiccups and there are four. Then eight. Each one has a biscuit. Each one says *how kind* at exactly the same time.",
              "Within thirty seconds the kitchen is packed with forty polite, extremely excitable Victorian ghosts, and in the confusion, Bean vanishes from the high chair with a delighted *bwa*. **Kids accounted for: down one.**",
              { speaker: 'Gerald', say: "Oh dear. Oh *dear,* oh *dear.* I'm afraid this is why there's a *rule.*" },
            ],
            next: 'gerald_swarm',
          },
          {
            text: 'Offer him a nice cup of tea instead',
            hint: 'Tea is not food. Tea is a loophole.',
            effect: all(ger(1), dig(1)),
            art: '🫖',
            outcome: [
              "You put the kettle on. You find the good teapot, the one with the roses on it. You warm the pot first, because something about Gerald makes you feel you ought to. You pour two cups and set one in front of him.",
              "Gerald stares at the cup. He can't drink it. But he leans over and breathes in the steam, and his whole see-through face goes soft.",
              { speaker: 'Gerald', say: "Warmed the pot. You *warmed the pot.* I had quite given up on this century." },
              "You sit with him in the quiet kitchen for a while, both of you not drinking tea. It's surprisingly nice. Then, through the front window, headlights sweep across the ceiling.",
            ],
            next: 'car',
          },
          {
            text: 'Refuse. Rules are rules, Gerald.',
            hint: 'The note said no. The note had capital letters.',
            effect: all(ger(-1), dig(1)),
            art: '🙅',
            outcome: [
              "You move the biscuit tin to the top of the fridge, which you realise too late is not a problem for a man who can fly. “Sorry, Gerald. Rule two. Not my rule. Management's rule.”",
              "Gerald swells up like an affronted pigeon. Then he deflates. Then he floats over to the window seat, lies across it with the back of his hand pressed to his forehead, and sighs so heavily that every curtain in the house billows.",
              { speaker: 'Gerald', say: "Very well. I shall simply *perish.* Again. Don't mind me. It's what I'm *good* at." },
              "He's still sighing when headlights sweep across the ceiling. A car is pulling into the drive.",
            ],
            next: 'car',
          },
          {
            text: 'Tell him the wallpaper is lovely. And mean it.',
            hint: 'You know what he\'s really been waiting for.',
            if: MOVEON_READY,
            art: '🦚',
            outcome: [
              "You don't reach for the biscuit tin. You pull out the chair next to him and sit down.",
              { speaker: 'You', say: "Gerald. The peacocks. All forty-one of them. They're lovely. They were always lovely. Agatha only said that because you missed supper." },
              "Gerald goes completely still. His monocle drops. His hands start to tremble. A soft, warm, gold light begins to glow at the top of the stairs, the kind of light that smells of fresh bread and clean laundry.",
              { speaker: 'Gerald', say: "...*Lovely.* You think they're *lovely.* Oh. Oh, my dear. Do you know, I think... I think I can hear her calling me in for supper." },
            ],
            next: 'moveon',
          },
        ],
      },

      gerald_swarm: {
        scene: 'house',
        title: '12:04 AM: Forty Geralds',
        art: '👻',
        mood: 'toxic',
        weather: 'sparkles',
        fx: 'shake',
        text: [
          "The house is *full* of Geralds. There are Geralds on the stairs. Geralds hanging off the chandelier. A small group of Geralds has formed a barbershop quartet in the downstairs loo. One Gerald is trying to teach the Roomba to waltz. Every one of them is unfailingly courteous.",
          "*Terribly sorry.* *Do excuse me.* *Mind your back, old thing.* *Has anyone seen my hat? Oh, I'm wearing it. And so are you.*",
          { if: 'streaming', text: { speaker: 'Oscar', say: "We just hit a MILLION viewers. A MILLION. The Pope is watching. Okay, that's probably a fake account. But it's got a blue tick!" } },
          "A conga line of Geralds is snaking through the living room, singing a music-hall song about a lady called Daisy. It goes through the wall, through the kitchen and back through the other wall. It's catchy. It's *very* catchy. Your feet have started tapping on their own.",
        ],
        choices: [
          {
            text: 'Shout “BEDTIME!” in your loudest mum voice',
            hint: 'Every one of them had a nanny. It\'s worth a shot.',
            effect: dig(1),
            art: '📣',
            outcome: [
              "You climb onto a chair, fill your lungs and bellow it, in the exact voice of every Victorian nanny who ever lived. “BEDTIME! ALL OF YOU! NOW! AND NO TALKING!”",
              "Forty Geralds freeze. Forty top hats come off at once. Then, in a perfectly orderly line, mumbling *yes Nanny* and *sorry Nanny*, they all file up the attic ladder and vanish through the hatch, pop, pop, pop, until there's only one left. He looks at you, sheepish.",
              { speaker: 'Gerald', say: "Thank you. They'll merge back by morning. It's rather like a hangover, but with more of me." },
            ],
            next: 'car',
          },
          {
            text: 'Herd them into the attic with a tray of biscuits',
            hint: 'Like leading ducks with bread. Very posh ducks.',
            effect: dig(-1),
            art: '🍪',
            outcome: [
              "You grab the biscuit tin and run up the stairs holding it above your head like the Olympic torch. Forty Geralds follow you in a polite stampede. *After you.* *No, after you.* *I insist.*",
              "You throw the whole tin into the attic and slam the hatch. There is a muffled cheer, then the sound of forty men saying *I say, these are rather good* at once.",
            ],
            next: 'car',
          },
          {
            text: 'Let Oscar livestream the Gerald party',
            hint: 'A million viewers. It\'s already out there. Might as well.',
            set: ['streaming', 'viral'],
            effect: all(loseOscar, dig(-1)),
            art: '🎥',
            outcome: [
              "You shrug. It's out there anyway. Oscar whoops and charges after the conga line with his tablet held high, narrating at the top of his voice. *Oscar Nation, we are LIVE with the GHOST PARTY!*",
              "The conga line turns a corner and goes through the wall. Oscar, for content, follows it. He doesn't go *through* the wall. He goes *into* the wall. There's a small, surprised *bonk* and then his voice, muffled: *Guys, I'm in the wall. This is SO good for engagement.*",
              "**Kids accounted for: down one.** You put your ear to the plaster. He's still streaming. He's got great signal in there.",
            ],
            next: 'car',
          },
          {
            text: 'Join the conga line. Just for a bit.',
            hint: 'You\'ve earned it. Your feet are already going.',
            art: '💃',
            outcome: [
              "Oh, why not. You grab the coat-tails of the last Gerald in line and join the conga. *Daisy, Daisy, give me your answer do...* It's wonderful. It's the most fun you've had all year. Your feet are light. Your feet are very light.",
              "Your feet are, in fact, about four inches off the ground. You look down. You can see the rug through your trainers. You can see the rug through your *legs.*",
              { speaker: 'Gerald', say: "Ah. Hm. I ought to have mentioned: one shouldn't conga with the departed. It's catching. Like a yawn. A yawn that lasts forever." },
              "The conga line goes through the wall. So do you.",
            ],
            next: 'end_ghost',
          },
        ],
      },

      moveon: {
        scene: 'stairwell',
        title: '12:01 AM: The Top of the Stairs',
        art: '🌟',
        mood: 'candle',
        weather: 'sparkles',
        text: [
          "The golden light at the top of the stairs grows brighter. Through it you can just make out a figure in a bonnet, holding a little cream-coloured envelope and tapping her foot in a very familiar way.",
          "Gerald stands at the bottom of the stairs, smoothing his waistcoat, straightening his top hat, adjusting it, straightening it again. Tilly comes and stands beside him. She takes his hand. Her hand goes a little way through his, but she holds on anyway.",
          { speaker: 'Tilly', say: "You can go, Gerald. We'll look after the peacocks." },
          { speaker: 'Gerald', say: "I... I'm not sure I know how. A hundred and thirty-five years is a very long time to stay somewhere. One gets attached to the *skirting boards.*" },
          { speaker: 'Baby Bean', say: "Gerra. Bwa-bwa." },
          "He looks at you. Everybody looks at you. Headlights are already turning into the drive outside.",
        ],
        choices: [
          {
            text: 'Tell him it\'s time. Agatha\'s waiting. Supper\'s getting cold.',
            hint: 'Let him go.',
            art: '🕊️',
            outcome: [
              { speaker: 'You', say: "Go on, Gerald. She's kept supper warm for a hundred and thirty-five years. That's love. Don't make her wait any longer." },
              "Gerald nods, very slowly. He takes off his top hat and places it, with great ceremony, on Tilly's head. It falls over her eyes. Then he turns and climbs the stairs, one step at a time, like a man going up to bed after a very long day.",
              "At the top, he turns around. He bows. A real, deep, Victorian bow, from the waist, to all of you. Then he takes Agatha's arm, and the light folds up around them like a letter going back into its envelope.",
            ],
            next: 'end_moveon',
          },
          {
            text: 'Give him a group hug on the way out',
            hint: 'It\'ll be cold. Do it anyway.',
            effect: dig(-1),
            art: '🫂',
            outcome: [
              "You open your arms. Tilly piles in. Oscar puts down his phone for the first time all night and piles in too. You hold Bean up to the middle. All four of you wrap your arms around a man who isn't quite there.",
              "It's like hugging an open freezer. It's also, somehow, the warmest thing that's happened to you in years. Gerald makes a small noise that sounds a lot like a sob trying very hard to be a cough.",
              { speaker: 'Gerald', say: "Dreadfully unseemly. *Dreadfully.* Do it again." },
              "You do it again. Then he lets go, walks up the stairs into the light, and is gone, leaving behind nothing but a faint smell of pipe tobacco and one very slightly winking peacock.",
            ],
            next: 'end_moveon',
          },
          dealChoice("Wait. Before he goes, an idea hits you like a dropped hatbox."),
        ],
      },

      /* ------------------------------------------------------------------ FINALE: THE CAR */
      car: {
        scene: 'house',
        title: '12:29 AM: Headlights',
        art: '🚗',
        mood: 'night',
        fx: 'flash',
        text: [
          "Headlights sweep across the living-room ceiling. Tyres crunch on the gravel. Car doors slam. You hear Mrs. Pemberton laughing too loudly at something Mr. Pemberton said, and the rustle of a very large cellophane hamper.",
          "You look around the living room. It is, to put it gently, *not* how they left it.",
          s => [
            s.has('fed') ? "There are biscuit crumbs on every surface, including the ceiling. One stray Gerald is asleep on top of the bookcase, snoring politely." : null,
            s.has('wallpaper_fixed') ? "Upstairs, peacocks glow crimson and gold in the hallway where the grey used to be." : "Upstairs, the grey wallpaper is still whispering its sad grey whisper.",
            s.get('kids') === 3 ? "You count heads. Tilly. Oscar. Bean. **Three.** You count again just to be sure. Still three." : `You count heads. You get ${s.get('kids')}. You count again. It's still ${s.get('kids')}. That's fewer than three. Three was the target.`,
            s.has('streaming') ? "Oscar's tablet is still glowing on the coffee table. The view counter is a number you've only ever seen on government debt." : null,
          ],
          "The key is turning in the lock. You have about ten seconds.",
        ],
        timer: 10,
        timeout: {
          text: 'You froze.',
          set: ['messy'],
          effect: dig(-1),
          art: '😱',
          outcome: [
            "You stand perfectly still in the middle of the living room, as if that will make you invisible, like a T. rex in a film. It does not. The door swings open.",
            "Mr. and Mrs. Pemberton stand in the doorway holding a giant hamper and take in the scene: the crumbs, the floating Scrabble tiles, the Roomba asleep under the coffee table, purring, and you, in the middle of it, with paste in your hair and one sock.",
            { speaker: 'Mrs. Pemberton', say: "...Goodness. Somebody's had a *night.*" },
          ],
          next: 'finale',
        },
        choices: [
          {
            text: 'Speed-clean. Everything. Right now.',
            hint: 'Ten seconds. You can do it. You can maybe do it.',
            set: ['tidy'],
            effect: dig(-1),
            fx: 'shake',
            art: '🧹',
            outcome: [
              "You move faster than you have ever moved in your life. Crumbs into hand. Hand into pocket. Scrabble tiles into box. Cushions plumped. Roomba turned over and tucked under the sofa like a sleeping tortoise. You kick a pile of dramatic Victorian bedsheets into the coat cupboard and lean against the door.",
              "The front door opens just as you sit down on the sofa, cross your legs and pick up a magazine. It's upside down. It's a gardening magazine. You read it with great interest.",
              { speaker: 'Mrs. Pemberton', say: "Ooh, look at this! It's *spotless!* I've never seen it this tidy! Did Gerald help?" },
            ],
            next: 'finale',
          },
          {
            text: 'Arrange the kids on the sofa in a perfect family tableau',
            hint: 'Presentation is everything.',
            effect: dig(1),
            art: '🛋️',
            outcome: [
              "You grab whichever children are available and arrange them on the sofa like a Victorian family portrait. Tilly, sitting very straight. Oscar, tablet hidden behind a cushion. Bean in your lap, if Bean is present, with a book upside down.",
              "You all freeze in place just as the door opens. You've got your best calm-babysitter smile on. It's slightly manic around the edges. Behind you, on the wall, the picture of the dog has been replaced by a picture of Gerald winking.",
              { speaker: 'Mrs. Pemberton', say: "Aww! Look at you all! Waiting up! How sweet! Why is everyone so... still?" },
            ],
            next: 'finale',
          },
          {
            text: 'Throw open the door and confess everything',
            hint: 'Honesty is the best policy. Probably.',
            set: ['confessed'],
            effect: dig(2),
            art: '🗣️',
            outcome: [
              "You fling open the front door before they reach it and say it all in one breath. “I went in the attic, there's a ghost, his name's Gerald, the Roomba is a cat, I may have died briefly, Oscar streamed most of it, I'm so sorry.”",
              "Mr. and Mrs. Pemberton blink at you. Mrs. Pemberton puts down the hamper.",
              { speaker: 'Mrs. Pemberton', say: "Oh, darling, that's just *Tuesday.* You should have seen our last sitter. She's a *weathervane* now." },
            ],
            next: 'finale',
          },
          dealChoice("The key is turning. You have one idea, and it's a big one."),
        ],
      },

      finale: {
        redirect: (s) => {
          if (s.get('kids') <= 1) return 'end_fired';
          if (s.has('messy') && s.get('dignity') <= 1) return 'end_fired';
          if (s.has('viral') && s.get('dignity') <= 2) return 'end_viral';
          return 'end_tidy';
        },
      },

      /* ------------------------------------------------------------------ ENDINGS */
      end_tidy: {
        scene: 'house',
        art: '🏡',
        mood: 'dawn',
        weather: 'sparkles',
        ending: { id: 'fine-ish', title: 'Fine. Ish.', type: 'good' },
        text: [
          "Mrs. Pemberton walks through the house, peering into each room with a small, puzzled frown, like a woman who expected to find a crater and has found a bit of a mess. Everyone is alive. Nothing is on fire. Mr. Pemberton opens the hamper and eats a whole wheel of brie standing up.",
          { if: 'wallpaper_fixed', text: "She stops in the upstairs hallway in front of the peacocks. For a long moment she says nothing. Then: “Oh. You know, I'd forgotten how... *lovely* that was.” The walls give a small, happy creak." },
          { if: 'confessed', text: "She takes your confession entirely in her stride. Apparently the last four babysitters had confessed too. One of them had to be retrieved from inside a painting. You're the first one who's got through the night *and* stayed opaque." },
          { if: 'tidy', text: "She runs a finger along the mantelpiece and looks at it. It's spotless. She looks at you with new respect. You have a crumb in your eyebrow. She decides not to mention it." },
          { if: 'streaming', text: "Oscar's channel gained eleven thousand followers tonight. He thanks you in a pinned comment: *shoutout to the babysitter, mid at tidying, elite at ghosts.*" },
          { if: 'raise', text: "She pays you twenty an hour, as agreed, in cash. She doesn't even blink. She looks like she'd have paid fifty.", else: "She pays you in cash, adds a little extra, and throws in a jar of fancy chutney from the hamper. You're not sure what the chutney is for. You take it." },
          "As you walk down the drive in the early-morning grey, you glance back at the house. In the upstairs window, three small faces are pressed to the glass, plus one tall, faint one wearing a top hat. Tilly holds up a piece of paper: *SAME TIME NEXT WEEK?*",
          "You wave. It was the most chaotic night of your life. You're absolutely coming back.",
        ],
      },

      end_fired: {
        scene: 'street',
        art: '📦',
        mood: 'night',
        ending: { id: 'fired', title: 'Your Services Are No Longer Required', type: 'bad' },
        text: [
          "Mrs. Pemberton walks slowly through her own house like a detective at a crime scene. She looks at the crumbs. She looks at the Scrabble tiles stuck to the ceiling. She looks at the Roomba, which is purring. She counts her children.",
          s => (s.get('kids') < 3
            ? `She counts to ${s.get('kids')}. She counts again. It's still ${s.get('kids')}. She looks at you with an expression you will remember for the rest of your life.`
            : "She counts to three, which is good. Then she looks at the state of the living room and at the state of *you*, and the expression on her face makes three sound like a technicality."),
          { if: 'bean_gone', text: "Bean turns up four minutes later, asleep in the bread bin, wearing a tiny ghostly top hat. That does not help your case as much as you'd hoped." },
          { if: 'oscar_gone', text: "Oscar is eventually extracted from inside the dining-room wall with a crowbar and a stern talking-to. He's gained thirty thousand followers. He's thrilled. His mother is not." },
          { if: 'fed', text: "In the attic, forty Geralds are singing *Daisy, Daisy* in forty-part harmony. She looks at the note on the fridge. She looks at the empty biscuit tin. She looks at you. She taps rule two with one long, slow finger." },
          { speaker: 'Mrs. Pemberton', say: "Darling, you've been *wonderful,* really, *marvellous* energy. But I think we're going to go in a different direction. Possibly a *nun.*" },
          "She pays you, to be fair. In full. In coins. Mostly ten-pences. They're in a little bag with a note on it that says *Thank you for your service*, in elegant, old-fashioned copperplate handwriting that is definitely not hers.",
        ],
      },

      end_ghost: {
        scene: 'void',
        art: '👻',
        mood: 'fog',
        weather: 'sparkles',
        fx: 'flash',
        ending: { id: 'now-hiring', title: 'Now Hiring', type: 'death' },
        text: [
          "When the Pembertons get home at 12:30, the house is perfectly tidy. The children are tucked up. The dishes are done. A note on the fridge, in a new handwriting, slightly transparent, says: *All fine! Bean ate peas. Oscar brushed teeth (eventually). Tilly's a delight. — The Babysitter.*",
          "They never quite see you leave. That's because you didn't.",
          "You're a ghost now. It's mostly fine. The hours are long (all of them). The commute is through the wall. You can't eat, but you can *smell* toast, which is almost as good, and you have a reserved spot on the attic beams where you can see the whole street.",
          { if: 'laughed', text: "Gerald still hasn't quite forgiven you for laughing at *Whig.* But he lets you use the good rocking chair. He says it's because you need it more. He's lying. He's lonely." },
          { if: 'fed', text: "Thirty-nine extra Geralds merged back into one Gerald by breakfast, except for a little one who stayed on as a sort of ghostly intern. He follows you around taking notes." },
          { if: 'viral', text: "The clip of you vanishing went *wildly* viral. The comments are all *RIP babysitter* and *gone but not forgotten* and *wait is that them in the window??* It is. You wave sometimes. It gets millions of views." },
          "The Pembertons were very understanding about it. They put an ad in the paper the following week: *Babysitter wanted. $15/hr. Big house. Easy kids. Experience with the afterlife preferred.*",
          "You're the one who reads the applications now. You float over every candidate's shoulder and whisper your notes. Most of them leave. The ones who stay, you train personally. The first rule you teach them: **Don't. Conga. With. The. Dead.**",
        ],
      },

      end_moveon: {
        scene: 'dawn',
        art: '🦚',
        mood: 'dawn',
        weather: 'sparkles',
        ending: { id: 'lovely', title: 'It Was Always Lovely', type: 'true' },
        text: [
          "The light folds up and the stairs are just stairs again. The house feels different: warmer, somehow, and a few degrees less like a fridge. The shower, for the first time in a week, runs hot.",
          "When the Pembertons come in, Tilly is sitting on the bottom step wearing a top hat that comes down to her nose. She doesn't cry. Tilly isn't a crier. But she holds your hand for a really long time, which, for Tilly, is basically the same thing.",
          { if: 'wallpaper_fixed', text: "Upstairs, the peacocks are still up. Mrs. Pemberton stops in front of them, says “Oh, how... *lovely*,” and doesn't know why her eyes are wet. She never puts the grey back up." },
          { if: 'letters', text: "In the attic, on top of the trunk, you find one last cream-coloured letter that wasn't there before. It just says: *Thank you, dear fellow. Supper was excellent. Agatha sends her love. Do mind the Roomba. — G. F-P.*" },
          { if: 'streaming', text: "Oscar posts one last video that night. It's not loud. It's just a slow pan up the empty staircase to the peacocks, with the caption *goodnight gerald.* It gets more views than everything else he's ever posted put together. He doesn't check the numbers." },
          "Mrs. Pemberton pays you double, without being asked, and can't explain why. “The house just feels... *happier*,” she says. “Did you do something?”",
          "“I just said something nice about the wallpaper,” you tell her. And you go home in the sunrise, smelling faintly of pipe tobacco and fresh bread.",
        ],
      },

      end_viral: {
        scene: 'house',
        art: '📱',
        mood: 'sunny',
        weather: 'sparkles',
        ending: { id: 'viral', title: 'Smash That Like Button', type: 'neutral' },
        text: [
          "By breakfast, you are the most famous babysitter in the world. Unfortunately, you are famous for *all the wrong reasons.*",
          "The clips are everywhere. The candle-under-the-chin intro has been remixed into a dance with nine million videos. The slow-motion stair dive is on a sports channel's *Top Ten Saves of the Year.* Someone made a T-shirt of your face mid-scream. It's sold out.",
          { if: 'oscar_gone', text: "Oscar's final stream, *LIVE FROM INSIDE THE WALL,* breaks a platform record. When they get him out with a crowbar, he just whispers, “Was it worth it? Yes.”" },
          { if: 'wallpaper_fixed', text: "A home-décor magazine wants to do a feature on the peacock hallway. They want to interview the ghost. The ghost has agreed, on the condition that they use his good side. Both sides are see-through." },
          "Your inbox has three talk-show invitations, a sponsorship offer from a brand of ghost-proof socks, and four hundred messages from strangers that just say *mid at babysitting.* Your mum has changed her surname.",
          { speaker: 'Oscar', say: "Okay, so, I'm giving you ten percent. Of the *merch.* Not the ad revenue. I'm not insane." },
          "The Pembertons don't fire you, exactly. They just ask if you'd consider changing your name to something more *anonymous* before you come back. Mrs. Pemberton signs you up for her publicist.",
          "That night, a new comment appears on the original stream, written in elegant copperplate, from an account called *SirGerald1889*: *A most diverting evening. Do subscribe.* It gets more likes than anything you've ever done.",
        ],
      },

      end_deal: {
        scene: 'bedroom',
        art: '💼',
        mood: 'candle',
        weather: 'sparkles',
        ending: { id: 'double-time', title: 'Double Time', type: 'secret' },
        text: [
          "The negotiation takes four minutes. Gerald insists on a contract. You write it on the back of the fridge note. It's the most binding document ever signed by a living person and a dead one, witnessed by a seven-year-old and sealed with a Bean-shaped spit bubble.",
          "**The terms:** Gerald does the babysitting. He is excellent at it. He's been doing it unofficially for a hundred and thirty-five years. You handle *client relations*: answering the door, collecting the money, and being visible in photographs.",
          "When the Pembertons come in, the house is immaculate. The children are in bed. The peacocks gleam. Mrs. Pemberton is so impressed that she offers you double. You don't even have to anchor high.",
          { if: 'raise', text: "Double of twenty, that is. Forty an hour. To sit on a sofa while a ghost reads bedtime stories in eleven different voices." },
          "You call the company **Spirited Away Childcare**. Your business cards are printed on cream-coloured paper in elegant copperplate. Gerald chose the font. Gerald also chose the logo: a peacock in a top hat.",
          { speaker: 'Gerald', say: "Shall I take the Pemberton children on Tuesday, partner? Bean has expressed a wish to learn the waltz. And Oscar wishes to *collab.* I'm told that's a compliment." },
          { speaker: 'Tilly', say: "I'm going to be his manager when I grow up. I've already started taking ten percent." },
          "Every Friday, Gerald gets his half of the money in an envelope. He can't spend it. He doesn't care. He just likes having a *wage packet,* like a respectable tradesman. He keeps them all in the attic trunk, on top of the peacocks.",
          "You still have the original note in a frame above your desk. Rule two, it turns out, was never really about biscuits. It was about making sure somebody always asked Gerald what he wanted. Somebody finally did.",
        ],
      },
    },
  });
})();
