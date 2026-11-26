/* MysteryFate story: Second Chances (drama) */
(function () {
  'use strict';

  const clamp = (n) => Math.max(0, Math.min(5, n));
  // Adjust the two HUD meters, clamped to 0..5.
  const bump = (courage, honesty) => (s) => {
    s.setVar('courage', clamp(s.get('courage') + courage));
    s.setVar('honesty', clamp(s.get('honesty') + honesty));
  };
  const C = (s) => s.get('courage');
  const H = (s) => s.get('honesty');

  // The secret: you have the letter, you never lied for applause, and you've been honest all night.
  const CAPSULE_OPEN = (s) => s.has('letter') && !s.has('lied') && H(s) >= 4;

  // When you finally say it, out loud, in the car park.
  const VERDICT = (s) => {
    if (s.has('blamed') && H(s) <= 2) return 'end_worse';
    if (H(s) >= 4 && C(s) >= 3) return 'end_reconciled';
    return 'end_strangers';
  };
  // When you offer to stay and help with the store.
  const STORE_VERDICT = (s) => (s.has('apologized') && H(s) >= 3 ? 'end_newstart' : 'end_strangers');
  // When you let them drive away.
  const LET_GO = (s) => (s.has('blamed') ? 'end_worse' : s.has('apologized') ? 'end_strangers' : 'end_gone');

  registerStory({
    id: 'drama-second-chances',
    title: 'Second Chances',
    category: 'drama',
    tagline: 'Ten years ago you said something unforgivable. Tonight they are standing by the punch bowl.',
    description:
      "It's your ten-year high-school reunion, in the same gym, under the same banner. On graduation night you and your best friend Jordan were supposed to leave town together. You left alone, and on the bus platform you said something cruel you have regretted every day since. Jordan is here. You have one evening.",
    cover: '💌',
    accent: '#ff7aa2',
    ambient: 'drama',
    scene: 'gym',
    warning: 'Contains: grief, an old family illness, a parent who has died, and a reunion DJ who only owns one CD.',
    vars: { courage: 2, honesty: 2 },
    flags: [],
    hud: [
      { var: 'courage', label: 'Courage', icon: '💪', max: 5 },
      { var: 'honesty', label: 'Honesty', icon: '💬', max: 5 },
    ],
    voices: {
      narrator: { gender: 'female', pitch: 0.95, rate: 0.95, accent: 'en-US', note: 'warm, quiet, a friend telling you the truth gently' },
      'Jordan': { gender: 'neutral', pitch: 0.9, rate: 0.92, accent: 'en-US', note: 'guarded, dry, warm underneath; runs the family hardware store' },
      'Priya': { gender: 'female', pitch: 1.15, rate: 1.4, accent: 'en-GB', note: 'reunion organiser, unstoppable chatter, means extremely well' },
      'Mr. Hollis': { gender: 'male', pitch: 0.75, rate: 0.8, accent: 'en-GB', note: 'retired English teacher, gentle, quotes poems' },
      'Sam': { gender: 'male', pitch: 1.0, rate: 0.98, accent: 'en-AU', note: "Jordan's partner: easy, kind, sees everything" },
      'You': { gender: 'neutral', pitch: 1.0, rate: 1.0, note: 'the player' },
    },
    start: 'intro',
    scenes: {
      /* ------------------------------------------------------------------ ACT 1 */
      intro: {
        title: '7:42 PM: Westbrook High Gym',
        scene: 'gym',
        art: '🪩',
        mood: 'neon',
        weather: 'sparkles',
        text: [
          "The banner says WELCOME BACK, CLASS OF 2016! in letters someone cut out by hand. The gym still smells of floor polish and old rubber, with a new layer of supermarket sushi on top.",
          "Ten years ago, on graduation night, you and your best friend Jordan Reyes had two tickets for the 11:40 bus out of town. You had a plan, a shared playlist and a list called THINGS WE WILL DO IN THE CITY. Number one was *everything*.",
          "Jordan didn't get on the bus. On the platform you said something cruel, the cruellest thing you have ever said to anyone, and then the doors folded shut. You have replayed it every day since, usually at 3 AM.",
          "And now, across the gym, past the balloon arch and the punch bowl, there they are. Jordan. Same slouch, same hands in pockets. They're laughing at something a tall man beside them said. Then they look up.",
          "Your eyes meet across forty feet of basketball court. Neither of you looks away. Somebody has to move first.",
        ],
        timer: 8,
        timeout: {
          text: 'You just stare.',
          set: ['stared'],
          effect: bump(-1, 0),
          art: '👀',
          outcome: [
            "You stand there holding a paper cup of punch like it's evidence. Five seconds. Six. Your face does something you can't control, maybe a smile, maybe a wince.",
            "Jordan looks away first. They turn their back, say something to the tall man, and walk towards the bleachers. The moment closes like a door in a draught.",
            "Behind you, a voice you'd know anywhere screams your name like you've come back from war.",
          ],
          next: 'priya',
        },
        choices: [
          {
            text: 'Walk straight over',
            hint: 'Forty feet. You can do forty feet.',
            effect: bump(1, 0),
            art: '🚶',
            outcome: [
              "You put the punch down and walk. Your shoes squeak on the court the way they did in every PE lesson you ever failed. The DJ picks this moment to play the song you and Jordan used to scream along to in the car. Of course he does.",
              "Halfway across, you realise you have no idea what you're going to say. You keep walking anyway. That's new. Eighteen-year-old you would have been proud. Or horrified.",
            ],
            next: 'jordan_hello',
          },
          {
            text: 'Raise your cup. A small wave.',
            hint: 'Not a step forward. Not a step back.',
            set: ['waved'],
            art: '🥤',
            outcome: [
              "You lift your paper cup a couple of inches, a toast from across the room. It's the smallest gesture available to a human being.",
              "Jordan's face does nothing for a long second. Then they lift their own cup, exactly as far as yours. Not an inch higher. The tall man glances between you, puts something together, and nudges Jordan gently forward.",
              "Jordan walks over. Slowly. Like someone checking the ice on a pond.",
            ],
            next: 'jordan_hello',
          },
          {
            text: 'Look away. Find the snack table.',
            hint: 'There is hummus. Hummus never judged anyone.',
            effect: bump(-1, 0),
            art: '🥕',
            outcome: [
              "You turn with great purpose to the snack table and study a carrot stick like it holds the secrets of the universe. Your heart is going like a drum solo.",
              "When you dare to look back, Jordan has turned away too. You've done this before, the not-looking. You're very good at it. You've had ten years of practice.",
              "A hand lands on your shoulder. A voice you'd know anywhere screams your name like you've come back from war.",
            ],
            next: 'priya',
          },
        ],
      },

      jordan_hello: {
        title: '7:46 PM: Under the Balloon Arch',
        scene: 'gym',
        art: '🧍',
        mood: 'neon',
        text: [
          "Up close, Jordan looks older in the way you can only see in someone you used to know. A few lines at the eyes. A healed scar across one knuckle. A Reyes Hardware fleece zipped up to the chin, even though everyone else has dressed up.",
          { if: 'waved', text: "They stop exactly one arm's length away. You can tell it's deliberate. Jordan always measured things." },
          { speaker: 'Jordan', say: "Hey." },
          "That's it. Hey. Ten years, and the word is *hey*. You say it back. It comes out like a question.",
          "The tall man beside them holds out a hand. Freckles, kind eyes, an easy, crumpled sort of face.",
          { speaker: 'Sam', say: "Sam. I'm the partner. I've heard about you. Don't worry, only some of it was bad. Roughly sixty percent." },
          { speaker: 'Jordan', say: "Sam." },
          { speaker: 'Sam', say: "Fifty-five." },
          "Jordan almost smiles. Almost. Then they look at you and wait. They're good at waiting. They waited for a bus once.",
        ],
        choices: [
          {
            text: '“I’m sorry. For the platform. For all of it.”',
            hint: 'Right here, in front of Sam, under a balloon arch.',
            set: ['early_sorry'],
            effect: bump(1, 1),
            art: '🙇',
            outcome: [
              "It falls out of you before you can stop it. “I'm sorry. For the platform. For what I said. I've been sorry for ten years.”",
              "Jordan goes very still. Sam looks at the floor, giving you both the only privacy available in a crowded gym.",
              { speaker: 'Jordan', say: "Not here. You don't get to do this in thirty seconds by the cheese cubes. Not tonight. Maybe not at all." },
              "But they don't walk away. You notice that. You hold onto it.",
            ],
            next: 'mic',
          },
          {
            text: '“You look exactly the same!”',
            hint: 'Small talk. The safe, warm, useless kind.',
            effect: bump(0, -1),
            art: '😬',
            outcome: [
              "“You look exactly the same!” you say, with the brightness of a game-show host. Jordan glances down at the fleece, then back up at you.",
              { speaker: 'Jordan', say: "I don't, though. Neither do you. But okay. You look great too. Is that how we're doing this?" },
              "Sam winces on your behalf. You want to take the sentence back and fold it into a very small square. Instead you say something about the weather. The weather is fine. Jordan agrees the weather is fine. It's the worst conversation you've ever had.",
            ],
            next: 'mic',
          },
          {
            text: 'Ask about the store',
            hint: 'The fleece says Reyes Hardware. Ask a real question.',
            set: ['store_talk'],
            art: '🔧',
            outcome: [
              "“You're running the store?” you ask, nodding at the fleece. “Your dad's store?”",
              { speaker: 'Jordan', say: "My store. Has been for seven years. We're fine. Well. There's a Home Depot going in out on Route 9 next spring, so ask me again in a year." },
              "There's a little crack in their voice when they say *my store*. Sam puts a hand on Jordan's back, just for a second, like he's keeping a wobbly shelf steady.",
              { speaker: 'Sam', say: "Best keys cut in the county. I'm biased. I also can't cut keys." },
            ],
            next: 'mic',
          },
        ],
      },

      priya: {
        title: '7:47 PM: The Punch Bowl',
        scene: 'gym',
        art: '📋',
        mood: 'gold',
        weather: 'sparkles',
        text: [
          "**Priya Nair**: class president, yearbook editor, founder of four clubs and destroyer of none, and the reason this reunion is happening at all. She's holding a clipboard and three lanyards and she is hugging you with the whole of her body.",
          { speaker: 'Priya', say: "You CAME! I said you'd come! Daniel said you wouldn't come because you're *in the city* now and you're *busy* and I said, Daniel, everyone is busy, I have twins and a gluten-free caterer and I still found time to laminate. Have you seen the slideshow? You're in the slideshow. Are you hungry? Don't eat the sushi." },
          "She takes a breath, like a pearl diver.",
          { speaker: 'Priya', say: "Also, and I'm saying this with love, Jordan Reyes is here, and you two used to be joined at the hip, and then you weren't, and nobody knows why, and I've been DYING. Not that it's my business. It's a little bit my business. I'm the organiser." },
          "Over her shoulder, the gym doors stand open on the dark car park. Your car is out there. Your car has never once asked you how you feel.",
        ],
        choices: [
          {
            text: 'Ask Priya what happened to Jordan',
            hint: 'She knows everything. She has a spreadsheet.',
            set: ['store_talk'],
            art: '🗂️',
            outcome: [
              "You ask, carefully, how Jordan's been. Priya lowers her voice to a level she believes is a whisper.",
              { speaker: 'Priya', say: "Well, you know about Mr. Reyes. The stroke, the week of graduation, and then the second one three years later. Jordan took over the store at twenty-one. Twenty-one! I couldn't run a bath at twenty-one. And now there's a Home Depot coming out on Route 9 and everyone's very brave about it. Sam's lovely. Sam's a nurse. Sam brought a quiche." },
              "The week of graduation. You knew about the stroke, technically. You knew it on the platform. You just didn't let it matter.",
            ],
            next: 'mic',
          },
          {
            text: 'Help Priya fix the slideshow',
            hint: 'It keeps freezing on a photo of you and Jordan.',
            set: ['slideshow'],
            effect: bump(0, 1),
            art: '🖼️',
            outcome: [
              "The laptop has frozen on one slide and nobody can unfreeze it. You crouch by the projector and look up, and there you both are, ten feet tall on the gym wall: seventeen years old, on the old school roof, sharing one pair of sunglasses, one lens each.",
              "You remember that day. You remember exactly how warm the tar was. You remember thinking, *this is the best friend I will ever have*, and being right.",
              { speaker: 'Priya', say: "Oh, that's a GOOD one. Leave it up, actually. Leave it up. People love a throwback." },
              "Across the gym, you see Jordan look up at the wall, then look for you.",
            ],
            next: 'mic',
          },
          {
            text: 'Slip out to the car park',
            hint: 'Just for some air. Just for a minute. Probably.',
            effect: bump(-1, 0),
            art: '🚪',
            outcome: [
              "“Back in two minutes,” you say, which is a lie you both pretend not to notice. Priya is already hugging someone else.",
              "The doors swing shut behind you on the music. The car park is wet and quiet and orange under the streetlights. It feels like breathing out after holding your breath for an hour.",
            ],
            next: 'car_alone',
          },
        ],
      },

      /* ---------------------------------------------------------- THE RUNAWAY ROUTE */
      car_alone: {
        title: '7:55 PM: The Car Park',
        scene: 'street',
        art: '🚗',
        mood: 'night',
        weather: 'rain',
        text: [
          "You sit in your car with the engine off and rain ticking on the roof. Through the gym windows you can see coloured lights going round and round, and silhouettes dancing badly to a song from 2015.",
          "Your phone has Jordan's old number in it. You never deleted it. You never called it either. You've typed a hundred messages to it and sent none of them.",
          "The keys are in your hand. The motorway is eleven minutes away. You could be home before midnight and tell yourself you *went*, technically. Technically you went.",
        ],
        choices: [
          {
            text: 'Go back inside',
            hint: 'Your hands are shaking. Go anyway.',
            effect: bump(1, 0),
            art: '🔙',
            outcome: [
              "You get out of the car before you can change your mind. Rain gets down the back of your collar. You walk back to the doors with your shoulders up round your ears like a cat in a bath.",
              "You've barely made it through the door when Priya appears out of nowhere, like a very well-organised ghost.",
              { speaker: 'Priya', say: "THERE you are. Perfect timing. Don't run. Why would you run? You're up next." },
            ],
            next: 'mic',
          },
          {
            text: 'Text Jordan’s old number',
            hint: '“I’m outside. I’m sorry.” Send it before you think.',
            set: ['texted'],
            effect: bump(0, 1),
            art: '📱',
            outcome: [
              "*I'm outside. I'm sorry. For the platform. I don't know if this is still your number.* You press send before your thumb can stop you. *Delivered.*",
              "No reply. No dots. Nothing. Of course nothing. You put the phone face down on the passenger seat like a hot coal.",
              "Someone taps on the window and you nearly die. It's Priya, holding an umbrella with the school crest on it.",
              { speaker: 'Priya', say: "Are you crying in your car? Everyone cries in their car at these things. Come inside, you're up next for speeches." },
            ],
            next: 'mic',
          },
          {
            text: 'Start the engine',
            hint: 'Eleven minutes to the motorway.',
            effect: bump(-1, 0),
            art: '🔑',
            outcome: [
              "The engine turns over. The headlights wash across the gym wall and, for a second, light up the painted panther mascot, mid-roar, looking about as disappointed in you as a cartoon cat can.",
              "You pull out of the car park. In the rear-view mirror, the gym gets smaller, then turns a corner and is gone.",
            ],
            next: 'gas_station',
          },
        ],
      },

      gas_station: {
        title: '8:06 PM: Route 9 Gas & Go',
        scene: 'gas-station',
        art: '⛽',
        mood: 'night',
        weather: 'rain',
        text: [
          "You stop for petrol you don't need, because your hands won't stop shaking on the wheel. The Gas & Go hasn't changed. It's the same flickering sign, the same ice freezer, the same faded poster for a lottery that ended in 2019.",
          "Across the road, behind a chain-link fence, there's a huge cleared lot with a billboard: **COMING SPRING 2027: YOUR NEW HOME DEPOT!** A cartoon man in an orange apron gives you a thumbs-up.",
          "Somewhere back in town, there's a little hardware store with REYES painted over the door. You and Jordan used to sit on its back step eating ice lollies, sorting screws into jars for a dollar an hour.",
          "The motorway sign glows green ahead. The road back to town is dark behind you.",
        ],
        choices: [
          {
            text: 'Turn around',
            hint: 'Not to fix anything. Just to not run.',
            set: ['late'],
            effect: bump(1, 0),
            art: '↩️',
            outcome: [
              "You pull out of the Gas & Go and do a U-turn that would fail any driving test. The cartoon man on the billboard watches you go.",
              "The drive back takes four minutes. It feels like a year. When you swing into the school car park, the music is still going, but people are spilling out of the doors, and one of them is Jordan, keys in hand, walking fast to a dented blue pickup.",
            ],
            next: 'parking_lot',
          },
          {
            text: 'Keep driving',
            hint: 'You know where this road goes.',
            effect: bump(-1, 0),
            art: '🛣️',
            outcome: [
              "You keep driving. But instead of turning onto the motorway, your hands take you the other way, down Station Road, as if the car knows where it's going.",
              "It pulls up, all by itself, at the old bus station.",
            ],
            next: 'platform',
          },
        ],
      },

      platform: {
        title: '8:14 PM: Westbrook Bus Station, Bay 3',
        scene: 'station',
        art: '🚌',
        mood: 'night',
        weather: 'rain',
        text: [
          "Bay 3. The same plastic bench. The same timetable with the 11:40 still on it, as if it's been waiting for you to come back and do it again.",
          "This is where it happened. Jordan ran the whole way here from the hospital. They were still in their graduation gown, the hem soaked. They grabbed your sleeve and said, *My dad. I can't. Wait one week. Please. One week and I'll come.*",
          "And you said: *Go on, then. Stay. Sell nails in your dad's shop until you turn into him. I'm not dying in this town for you.*",
          "Three years later, Mr. Reyes died. You found out from a Facebook post. You didn't go to the funeral. You told yourself it would be weird. It would have been weird. It would also have been right.",
          "The rain drips off the shelter roof. There's no bus due. There's only you, and the decision you've been making over and over for ten years.",
        ],
        choices: [
          {
            text: 'Go back. Now.',
            hint: 'You are not doing this twice.',
            set: ['late'],
            effect: bump(1, 1),
            art: '🏃',
            outcome: [
              "You're back in the car before you've finished deciding. You drive back through town too fast, past the closed-up bakery, past the dark windows of REYES HARDWARE with its little hand-painted *Open 7-6, closed Sundays*.",
              "You swing into the school car park just as the gym doors bang open. Jordan comes out, keys in hand, walking fast towards a dented blue pickup.",
            ],
            next: 'parking_lot',
          },
          {
            text: 'Call the store and leave a voicemail',
            hint: 'Say it to a machine. Machines can’t look at you.',
            set: ['voicemail'],
            effect: bump(0, 1),
            art: '☎️',
            outcome: [
              "The store number is still on the sign in your memory. It rings four times. *You've reached Reyes Hardware. We're closed. Leave a message and we'll get back to you, probably.* Jordan's voice, grown-up and dry.",
              "You talk for a long time. You say what you said on the platform, word for word, and then you say you're sorry, and then you say it again, and then the machine beeps and cuts you off mid-sentence.",
              "You sit on the bench afterwards. It's a start. It's the kind of start you can make without anybody seeing your face.",
            ],
            next: 'end_gone',
          },
          {
            text: 'Get on the road',
            hint: 'You were always good at leaving.',
            effect: bump(-1, -1),
            art: '🌫️',
            outcome: [
              "You get back in the car and drive to the motorway, and then onto it, and the town shrinks to a smudge of orange light in your mirror.",
              "You tell yourself there'll be another reunion in ten years. You'll go to that one. You'll definitely go to that one.",
            ],
            next: 'end_gone',
          },
        ],
      },

      /* --------------------------------------------------------------- THE SPEECH */
      mic: {
        title: '8:10 PM: Speeches',
        scene: 'gym',
        art: '🎤',
        mood: 'gold',
        fx: 'heartbeat',
        text: [
          "Priya is on the little stage they've built out of cafeteria tables and the hand-me-down velvet curtain from the drama department. She's been doing the speeches. She's *loving* the speeches.",
          { speaker: 'Priya', say: "And now, a surprise! Someone who came all the way from the big city! Someone who once set the chemistry lab on fire with a Bunsen burner and a Pop-Tart! Get up here!" },
          "She pushes the microphone into your hand. Ninety faces turn towards you. The DJ, helpfully, plays a drumroll.",
          { if: 'early_sorry', text: "Near the bleachers, Jordan has their arms folded. They're watching you very carefully." },
          { if: 'slideshow', text: "Behind you, on the gym wall, the frozen slideshow still shows the two of you on the roof, ten feet tall." },
          { if: 'texted', text: "You glance at your phone. Still no reply. But Jordan is near the front, and their phone is in their hand." },
          "Your mouth is completely dry. Somebody coughs. Say something. Say *anything*.",
        ],
        timer: 10,
        timeout: {
          text: 'You freeze.',
          set: ['froze'],
          effect: bump(-1, 0),
          art: '🥶',
          outcome: [
            "Seconds pass. Many seconds. A small child at the back asks loudly whether you are broken.",
            "Then you lean into the mic and say, with tremendous feeling: “Go... Panthers?” There is scattered, merciful applause. Someone at the back does a single, sarcastic *woo*.",
            "You hand the mic back to Priya like it's on fire. She pats your arm. She means it kindly, which somehow makes it worse.",
          ],
          next: 'hollis',
        },
        choices: [
          {
            text: 'Tell the truth about the bus',
            hint: 'In front of everyone. No names, but everyone knows.',
            set: ['truth_speech'],
            effect: bump(1, 2),
            art: '🕯️',
            outcome: [
              "“Ten years ago,” you say, “I got on a bus and left this town. And I left behind the best friend I've ever had, and I said something to them on the platform that I've been ashamed of every single day since.”",
              "The gym goes quiet. Even the DJ turns the bass down. Priya's mouth makes a perfect, delighted, horrified O.",
              "“So I don't have a funny story,” you say. “I just have that. I'm sorry. That's the speech.” You hand the mic back. Your knees are shaking. Nobody claps for a second, and then Mr. Hollis, at the front, starts, slowly, and the rest of the gym follows.",
              "You don't look at Jordan. You can't. But you can feel exactly where they're standing, like heat from a stove.",
            ],
            next: 'hollis',
          },
          {
            text: '“Jordan and I? Still best friends!”',
            hint: 'The crowd wants a happy ending. Give them one.',
            set: ['lied'],
            effect: bump(1, -2),
            art: '🎭',
            outcome: [
              "“You know what's great about this town?” you say. “Some things never change. Like me and Jordan Reyes! Still best friends. Talk every week. Isn't that right, Jordan?”",
              "Ninety heads turn. Jordan, by the bleachers, is holding a paper plate with one mini quiche on it. They look at you. They look at ninety people looking at them.",
              { speaker: 'Jordan', say: "...Sure." },
              "The gym cheers. Priya clutches her clipboard to her heart. It's the biggest round of applause of the night. You've never felt worse holding a microphone, and you once did karaoke at a funeral wake.",
            ],
            next: 'hollis',
          },
          {
            text: 'Do ten minutes on Mr. Hollis’s cardigan',
            hint: 'Comedy. The ancient art of hiding in plain sight.',
            set: ['joked'],
            art: '😂',
            outcome: [
              "“I just want to say,” you begin, “that Mr. Hollis is here tonight, and so is *the cardigan*.” The room erupts. Mr. Hollis, at the front, holds out the brown cardigan's lapels with tremendous dignity. It still has the elbow patches.",
              "You do the Panthers' 0-11 football season. You do the cafeteria's Mystery Friday. You do the time the fire alarm went off during the SATs and Priya kept taking the test outside on the grass. Priya laughs hardest at that one, and then writes something on her clipboard.",
              "It goes well. It goes *really* well. You walk off to applause, and you have said nothing true at all.",
            ],
            next: 'hollis',
          },
        ],
      },

      /* ------------------------------------------------------------ THE LETTER */
      hollis: {
        title: '8:25 PM: The Bleachers',
        scene: 'gym',
        art: '✉️',
        mood: 'candle',
        text: [
          "You find a seat at the end of the bleachers, where the light from the disco ball doesn't quite reach. A shadow sits down beside you, slowly, one hand on its knee.",
          "Mr. Hollis taught you English for three years. He's seventy-four now, retired, his beard gone fully white. He's wearing the cardigan. He's always wearing the cardigan.",
          { if: 'truth_speech', text: { speaker: 'Mr. Hollis', say: "That was the bravest speech I've heard in this gym, and I've heard a principal apologise for the swimming pool." } },
          { if: 'lied', text: { speaker: 'Mr. Hollis', say: "That got a lovely round of applause. You always did know how to land a line. Whether it was true is, I suppose, between you and the person you said it to." } },
          { if: 'joked', text: { speaker: 'Mr. Hollis', say: "The cardigan thanks you for its continued fame. I noticed you spoke for ten minutes and didn't say a single thing about yourself. You used to do that in your essays too." } },
          { if: 'froze', text: { speaker: 'Mr. Hollis', say: "‘Go Panthers.’ Brief. Heartfelt. A little unclear in its argument. I'd give it a B minus." } },
          "He reaches into the cardigan and pulls out an envelope, yellowed, sealed, your name in your own handwriting from when you were seventeen. Every year he had his seniors write a letter to their twenty-eight-year-old self. He kept them all. He promised to hand them back.",
          { speaker: 'Mr. Hollis', say: "“Tell me, what is it you plan to do with your one wild and precious life?” Mary Oliver. I put that on the board the day you wrote this. I've been carrying it around all night. I thought you might be the one who needed it most." },
        ],
        choices: [
          {
            text: 'Open it now and read it',
            hint: 'Right here, with him watching.',
            set: ['letter'],
            effect: bump(0, 1),
            art: '📖',
            outcome: [
              "You tear it open. Your handwriting at seventeen was terrible and enthusiastic, full of underlines.",
              "*Dear Me at 28. Hello! Are you famous? Do you have a dog? If you are NOT still best friends with Jordan, something has gone very wrong, and it was probably your fault, because it usually is. Fix it. You can always fix it. P.S. THE CAN. Behind the bleachers. Don't you dare forget the can.*",
              "The can. The coffee can. The two of you buried it under the loose board behind these exact bleachers in the last week of senior year, with a note each inside, *not to be opened until we are old, like 28*.",
              "You're twenty-eight. Mr. Hollis looks away politely while you wipe your face on your sleeve.",
            ],
            next: 'sam_moment',
          },
          {
            text: 'Take it, but keep it sealed',
            hint: 'Not here. Not yet. Maybe never.',
            set: ['letter'],
            art: '🗃️',
            outcome: [
              "You take the envelope. It's lighter than it should be for something that heavy. You slide it into your inside pocket without opening it, and you feel it there against your ribs like a second heartbeat.",
              { speaker: 'Mr. Hollis', say: "Fair enough. Some letters you read, and some letters read you. Either way, it's yours now. I've done my bit." },
              "He pats your knee twice and gets up, joints cracking, to go and be adored by the class of 2016.",
            ],
            next: 'sam_moment',
          },
          {
            text: '“Keep it. I’m not that kid anymore.”',
            hint: 'That kid was an idiot. That kid had hope.',
            effect: bump(0, -1),
            art: '🚫',
            outcome: [
              "You push the envelope gently back towards him. “Keep it. Honestly. I'm not that kid any more. Whatever they wanted, it didn't happen.”",
              "Mr. Hollis looks at the envelope, then at you, for a long time, the way he used to look at an essay that had a good idea buried somewhere in paragraph four.",
              { speaker: 'Mr. Hollis', say: "“Do I contradict myself? Very well, then I contradict myself. I am large, I contain multitudes.” You're still that kid. You're just also a lot of other things now. I'll hang onto it. Letters keep." },
            ],
            next: 'sam_moment',
          },
        ],
      },

      /* --------------------------------------------------------------- SAM */
      sam_moment: {
        title: '8:40 PM: By the Fire Exit',
        scene: 'gym',
        art: '🙋',
        mood: 'neon',
        text: [
          "The DJ moves on to the slow songs. Couples sway under the string lights. Someone's husband is crying at *I Don't Want to Miss a Thing* for reasons he will not explain.",
          "Sam appears beside you with two plastic cups of punch and hands you one, like he's been sent with supplies.",
          { speaker: 'Sam', say: "So. Jordan went up the back stairs about ten minutes ago. The roof. They do that, when there are too many people. They told me you two used to go up there." },
          { if: 'lied', text: { speaker: 'Sam', say: "For what it's worth, the 'best friends' thing in your speech went down like a lead balloon with exactly one person. You can probably guess which one." } },
          { if: 'truth_speech', text: { speaker: 'Sam', say: "That speech. They went up the stairs about four seconds after it. I don't think that's a bad sign. I don't think it's a good one either. I think it's a *sign*." } },
          { speaker: 'Sam', say: "I'm not here to tell you what to do. I'm a nurse, not a referee. I just think if you don't go up, you'll both be wondering for another ten years, and I've heard enough wondering to last me." },
          "The fire door at the end of the gym is propped open with a fire extinguisher. Behind it, the back stairs go up into the dark.",
        ],
        choices: [
          {
            text: 'Go up to the roof',
            hint: 'Fourth floor, through the art room window, like always.',
            art: '🪜',
            outcome: [
              "You thank Sam with a nod you hope says everything, and you go through the fire door. The back stairwell is dark and smells of paint and floor wax, exactly like 2015.",
              "Fourth floor. The art room. The window with the broken latch that nobody fixed in ten years. You climb out onto the flat roof the way you used to, and your body remembers every handhold before you do.",
            ],
            next: 'rooftop',
          },
          {
            text: 'Talk to Sam first',
            hint: 'He knows Jordan now. You only knew them then.',
            set: ['met_sam'],
            art: '🗣️',
            outcome: [
              "“Can I ask you something first?” you say. Sam looks a little surprised, then nods towards the back doors, out onto the old courtyard terrace where the smokers used to hide.",
              "Outside, the rain has stopped. The whole town spreads out below the hill, the water tower, the church, the strip of lights along Main Street. Sam leans on the railing.",
            ],
            next: 'sam_talk',
          },
          {
            text: '“Tell them I’m sorry. I can’t go up.”',
            hint: 'Send someone else up the stairs. Again.',
            set: ['proxy'],
            effect: bump(-1, 0),
            art: '📨',
            outcome: [
              "“Can you tell them something for me?” you ask. “Tell them I'm sorry. I mean it. I just... I can't go up there.”",
              "Sam looks at you for a long moment. There's no anger in it, just a kind of tired disappointment, like a nurse whose patient has pulled out their own IV.",
              { speaker: 'Sam', say: "I'll tell them. But mate, I've been with Jordan five years. I've heard about you maybe twice. Both times it was three in the morning. Messages don't go up stairs very well." },
              "He goes. You stand there with two cups of punch. About twenty minutes later, the fire door bangs, and you see Jordan heading straight through the gym and out towards the car park.",
            ],
            next: 'parking_lot',
          },
        ],
      },

      sam_talk: {
        title: '8:44 PM: The Back Terrace',
        scene: 'terrace',
        art: '🌃',
        mood: 'night',
        weather: 'stars',
        text: [
          "Sam is quiet for a bit. He has the kind of quiet that makes other people talk.",
          { speaker: 'Sam', say: "Here's what I know. Jordan kept a bus ticket in their wallet for about six years. Same ticket. 11:40, one way. I found it when we were doing our taxes. They said it was a receipt. It was not a receipt." },
          { speaker: 'Sam', say: "And they still do the voice. When they're tired. Some phrase. 'Sell nails till you turn into him.' They say it to themselves at the till when the place is empty. I didn't know where it came from. I'm guessing now I do." },
          "Your stomach drops all the way to the car park.",
          { speaker: 'Sam', say: "I'm not telling you that to make you feel bad. Well. Not mostly. I'm telling you because you're about to go up there, and I'd rather you went up knowing what weighs what." },
        ],
        choices: [
          {
            text: '“Do you want me to go up?”',
            hint: 'He has every right to say no.',
            effect: bump(0, 1),
            art: '🤝',
            outcome: [
              "“Do you actually want me to go up there?” you ask. “Honestly. You get a vote. You're the one who's been there.”",
              "Sam laughs, surprised, and something in his shoulders unclenches.",
              { speaker: 'Sam', say: "Honestly? I want them to stop doing the voice. If that takes you going up there and getting yelled at, I'll hold your coat. Go on. And say the real thing. They can smell the other kind." },
            ],
            next: 'rooftop',
          },
          {
            text: 'Ask about the store',
            hint: 'What’s really going on with Reyes Hardware?',
            set: ['store_talk'],
            art: '🏪',
            outcome: [
              "“What's going on with the store?” you ask. “Really.”",
              { speaker: 'Sam', say: "Really? It's sinking, slowly, with great dignity. The Home Depot opens in spring. Jordan's doing everything themselves, the books, the stock, the deliveries. Won't take help from me because I 'already do enough.' Won't take help from anyone. Stubborn as a stripped screw." },
              { speaker: 'Sam', say: "They used to talk about a website. Some kind of plan to sell restored old tools online. Said they'd had the idea years ago with a friend. Never said which friend." },
              "You know which friend. You came up with the name together, on the back step, with ice lollies. *Second Hand, First Rate.* You'd forgotten. They hadn't.",
            ],
            next: 'rooftop',
          },
          {
            text: '“Are you warning me off?”',
            hint: 'Get defensive. It feels safer than this.',
            effect: bump(0, -1),
            art: '🛡️',
            outcome: [
              "“Is this a warning?” you ask, a bit sharper than you mean to. “Like, stay away from my partner?”",
              { speaker: 'Sam', say: "No. If I wanted you to stay away I'd have let you eat the sushi." },
              "He says it lightly, but he steps back from the railing and gives you a look that is pure ward-nurse: *I have seen people do this exact thing at four in the morning and I'm not impressed.* Then he nods at the door.",
              { speaker: 'Sam', say: "Roof's that way. Try not to do that up there." },
            ],
            next: 'rooftop',
          },
        ],
      },

      /* --------------------------------------------------------------- THE ROOF */
      rooftop: {
        title: '8:55 PM: The Roof',
        scene: 'rooftop',
        art: '🌙',
        mood: 'night',
        weather: 'stars',
        text: [
          "The roof is exactly as you left it: gravel, a dead satellite dish, the big humming air-conditioning box you used to lean against, and the whole town laid out below like a model railway.",
          "Jordan is sitting on the edge of the air-con unit, where they always sat. They don't turn round when you climb out.",
          { speaker: 'Jordan', say: "You still come through the window like a bag of groceries falling down the stairs." },
          { if: 'truth_speech', text: { speaker: 'Jordan', say: "That speech. You didn't say my name. You didn't have to. My Aunt Lourdes is down there telling everyone it was about her." } },
          { if: 'lied', text: { speaker: 'Jordan', say: "'Still best friends.' In front of everyone. You made me say *sure* into a room full of people I sell grout to. Do you know how that felt?" } },
          { if: 'early_sorry', text: { speaker: 'Jordan', say: "You tried to say sorry by the cheese cubes. I'm not doing that. I'm doing it here, if I'm doing it." } },
          "You sit down next to them, a careful foot apart. Below, the gym windows pulse pink and blue. A distant, muffled saxophone solo floats up through the roof.",
          { speaker: 'Jordan', say: "So. You came back. For a reunion. Ten years, and you came back for Priya's laminated name tags. What do you want?" },
        ],
        choices: [
          {
            text: 'Say what you said. Own it. No excuses.',
            hint: 'Every word. Then the apology. Nothing after the apology.',
            set: ['apologized'],
            effect: bump(1, 2),
            art: '💔',
            outcome: [
              "“On the platform,” you say, “you told me your dad was in the hospital. And I said, ‘Go on, then. Stay. Sell nails until you turn into him. I'm not dying in this town for you.’”",
              "Saying it out loud is like pulling something out of your chest that's grown roots. Jordan's hands go tight on the edge of the unit.",
              "“It was cruel and it was on purpose. I wanted you to hurt so I didn't have to feel like I was leaving you. And then he died and I didn't come. I'm sorry. I'm not going to explain it. It doesn't need explaining. It needs to be said. I'm sorry.”",
              "For a long time, Jordan doesn't say anything. Then they let out a breath they've apparently been holding for about a decade.",
              { speaker: 'Jordan', say: "...You remembered it word for word." },
              "“Every day,” you say. And that's true too.",
            ],
            next: 'parking_lot',
          },
          {
            text: 'Explain: you were eighteen and terrified',
            hint: 'It is true. It is also an excuse.',
            set: ['explained'],
            art: '😔',
            outcome: [
              "“I was eighteen,” you say. “I was so scared. If I didn't get on that bus, I knew I'd never leave, and I'd become my mum, and I'd... I panicked. I said something awful because I panicked.”",
              "All of that is true. You can hear, even as you say it, how much of it is about you.",
              { speaker: 'Jordan', say: "I was eighteen too. My dad couldn't say my name. I was scared too. I didn't say anything awful to you." },
              "They're not shouting. That's worse. They say it like they've rehearsed it in an empty shop a thousand times.",
            ],
            next: 'parking_lot',
          },
          {
            text: '“You were supposed to come too.”',
            hint: 'It has been sitting in you for ten years. It is not fair. It is not nothing.',
            set: ['blamed'],
            effect: bump(1, -1),
            art: '🔥',
            fx: 'shake',
            outcome: [
              "“You were supposed to come too,” you say, and the anger in your own voice surprises you. “We had a plan. I sat on that bus for six hours next to an empty seat. You know what that's like?”",
              "Jordan turns and looks at you for the first time since you climbed out of the window.",
              { speaker: 'Jordan', say: "My father was in intensive care. I ran from the hospital in my gown. I begged you for a week. *One week.* And you're telling me about the seat?" },
              "Down below, the saxophone solo ends. In the silence you can hear how it sounded, out loud. Some true things should stay true and quiet.",
            ],
            next: 'parking_lot',
          },
          {
            text: 'Read them the letter you wrote at seventeen',
            hint: 'Let the kid you were speak first.',
            if: 'letter',
            set: ['read_letter'],
            effect: bump(1, 1),
            art: '💌',
            outcome: [
              "You take out Mr. Hollis's envelope. If it's still sealed, you open it now, with your thumb, and the paper smells like the old English room.",
              "You read it out loud, in the dark, with the town below. *Dear Me at 28... If you are NOT still best friends with Jordan, something has gone very wrong, and it was probably your fault, because it usually is. Fix it. You can always fix it. P.S. THE CAN.*",
              "Jordan makes a noise that is half a laugh and half something with sharp edges.",
              { speaker: 'Jordan', say: "You always did write in capitals when you got excited. 'The can.' I forgot about the can. No. I didn't forget about the can." },
            ],
            next: 'rooftop_letter',
          },
        ],
      },

      rooftop_letter: {
        title: '9:02 PM: The Roof',
        scene: 'rooftop',
        art: '✉️',
        mood: 'night',
        weather: 'stars',
        text: [
          "Jordan is holding the letter now. They've taken it out of your hands without asking, the way they used to steal your fries. They read it again, under their breath.",
          { speaker: 'Jordan', say: "Seventeen-year-old you was very sure everything could be fixed." },
          "They fold it carefully along its old creases and hand it back. Then they wait. The letter has said what the kid could say. The rest has to come from the adult.",
        ],
        choices: [
          {
            text: 'Now say the rest. The real apology.',
            hint: 'The kid opened the door. Walk through it.',
            set: ['apologized'],
            effect: bump(1, 1),
            art: '💔',
            outcome: [
              "“The kid was right,” you say. “It was my fault. On the platform I said, ‘Sell nails till you turn into him.’ I said it because I wanted it to hurt. And then he died, and I didn't come. I'm sorry. I don't have a *but*. I'm just sorry.”",
              "Jordan nods, slowly, many times, the way you nod when someone's finally told you the answer to a question you stopped asking out loud.",
              { speaker: 'Jordan', say: "Okay. Okay. I heard that. I'm not saying it's fine. I'm saying I heard it." },
            ],
            next: 'parking_lot',
          },
          {
            text: 'Let the letter speak for you',
            hint: 'Surely it said enough.',
            set: ['explained'],
            art: '🤐',
            outcome: [
              "You don't say anything else. You let the letter sit there between you, doing the work. It's a good letter. The kid was braver than you.",
              "After a while, Jordan stands up and brushes the gravel off their jeans.",
              { speaker: 'Jordan', say: "That's a nice letter. Somebody should write it back to me one day. Somebody who's not seventeen." },
            ],
            next: 'parking_lot',
          },
        ],
      },

      /* --------------------------------------------------------- THE CAR PARK */
      parking_lot: {
        title: '9:15 PM: The Car Park',
        scene: 'street',
        art: '🛻',
        mood: 'night',
        weather: 'rain',
        fx: 'heartbeat',
        text: [
          s => (s.has('late')
            ? "You've barely parked, crooked, across two spaces, when you see them. Jordan is crossing the car park in the rain, head down, keys out, towards a dented blue pickup with REYES HARDWARE on the door."
            : "It's started raining again. The gym doors bang open and Jordan comes out fast, head down, keys out, crossing towards a dented blue pickup with REYES HARDWARE on the door. Sam follows, a few steps behind, carrying a foil-covered quiche dish like it's the Olympic torch."),
          { if: 'apologized', text: { speaker: 'Jordan', say: "I need to go home. I need to think. You don't get to follow me with that face." } },
          { if: 'blamed', text: "Jordan doesn't look back. They are walking the way people walk away from a fight they don't want to win." },
          { if: 'proxy', text: "Sam passed on your message. You can tell from the set of Jordan's shoulders exactly how well it went down." },
          { if: 'explained', text: "They're not angry. They're just leaving. You think that might be worse." },
          "The pickup's headlights flash as it unlocks. Ten years ago, you were the one leaving. You know exactly how this part goes. Doors close. Engines start. You spend a decade saying what you should have said.",
          "They're thirty feet away. Twenty-five. The rain is getting heavier.",
        ],
        timer: 8,
        timeout: {
          text: 'You hesitate.',
          set: ['hesitated'],
          effect: bump(-1, 0),
          art: '🚦',
          outcome: [
            "You open your mouth. Nothing comes out. Your feet stay exactly where they are, as if they've been glued to the tarmac.",
            "The pickup door slams. The engine coughs and catches. Red taillights slide across the wet car park, pause at the exit, indicate left with perfect, small-town politeness, and go.",
          ],
          next: LET_GO,
        },
        choices: [
          {
            text: 'Run. Shout their name.',
            hint: 'Ten years ago nobody ran after anybody.',
            effect: bump(1, 0),
            art: '🏃',
            fx: 'flash',
            outcome: [
              "You run. You are not dressed for running. Your shoes slap through a puddle that goes straight over the top. “JORDAN!” you shout, loud enough that a smoker by the door drops his cigarette.",
              "Jordan stops with one hand on the truck door. They don't turn round. But they stop. Sam, behind them, quietly gets into the passenger seat and closes the door, leaving the two of you alone under a streetlight.",
            ],
            next: 'last_chance',
          },
          {
            text: 'Tuck a note under the wiper',
            hint: 'Your number, and the word sorry. Words are easier on paper.',
            set: ['note'],
            art: '📝',
            outcome: [
              "You rip a page out of the back of Priya's reunion programme and write on it with an eyeliner pencil, because it's all you have. *Sorry. For all of it. Here's my number. You don't have to use it.*",
              "You tuck it under the wiper of the pickup while Jordan is busy with Sam and the quiche, and walk away before they see you. Behind you, the engine starts. Through the rain you see the wipers come on, and the note flutter, and hold.",
            ],
            next: LET_GO,
          },
          {
            text: 'Let them go',
            hint: 'Maybe it’s kinder. Maybe that’s what you tell yourself.',
            effect: bump(-1, 0),
            art: '🌧️',
            outcome: [
              "You stand in the rain under the gym's little porch roof and watch them go. It feels respectful. It feels like giving them space.",
              "It also feels exactly like the platform, from the other side of the glass.",
            ],
            next: LET_GO,
          },
        ],
      },

      last_chance: {
        title: '9:18 PM: Under the Streetlight',
        scene: 'street',
        art: '💡',
        mood: 'night',
        weather: 'rain',
        text: [
          "Jordan turns round. Rain is running off their fringe and into their eyes. They don't wipe it away.",
          s => (s.has('apologized')
            ? "They already heard the apology. Now they're waiting to see whether you're the kind of person who says it and leaves, or says it and stays."
            : s.has('blamed')
              ? "The fight from the roof is still in the air between you, like ozone after lightning."
              : "Whatever you came here to say, you still haven't said it. Both of you know that."),
          { if: 'lied', text: { speaker: 'Jordan', say: "You stood up in that gym and lied for applause. So be careful what you say next. I'm going to know." } },
          { speaker: 'Jordan', say: "You've got until Sam finishes his quiche. Which is, knowing Sam, about two minutes. What do you want?" },
          s => (s.has('letter') && !s.has('lied') && H(s) >= 4
            ? "Your hand is on the letter in your pocket. *P.S. THE CAN.* The bleachers are fifty feet behind you. The loose board is probably still loose. Nothing in this school ever gets fixed."
            : null),
        ],
        choices: [
          {
            text: '“The can. Behind the bleachers. Tonight.”',
            hint: 'We are old now. Like 28.',
            if: CAPSULE_OPEN,
            art: '🥫',
            outcome: [
              "“The can,” you say. “We said twenty-eight. We're twenty-eight. It's fifty feet away.”",
              "Jordan stares at you. Then, for the first time all night, properly, out loud, they laugh. It's a short, cracked, astonished laugh, like a door that's been painted shut finally giving.",
              { speaker: 'Jordan', say: "Sam. SAM. I'm going to be twenty minutes. I need to go and dig up a coffee can with my... with this idiot." },
              { speaker: 'Sam', say: "Take the torch from the glovebox. And take your time." },
            ],
            next: 'capsule',
          },
          {
            text: 'Say what you should have said',
            hint: 'All of it. Out here. In the rain.',
            set: ['apologized'],
            effect: bump(0, 1),
            art: '🗣️',
            outcome: [
              s => (s.has('read_letter') || H(s) >= 4
                ? "“I don't want anything,” you say. “I want you to know I know. What I said, what I didn't do after. And I want to be in your life, if there's room. Even a small amount. Even a shelf.”"
                : "“I'm sorry,” you say. “For the platform. For the funeral. For tonight, probably. I don't know how to fix it. I just didn't want you to drive off without hearing it again.”"),
              "Jordan listens. The rain gets into everything. Behind them, through the windscreen, Sam is very deliberately not watching, eating quiche with a plastic fork.",
            ],
            next: VERDICT,
          },
          {
            text: '“Let me help with the store.”',
            hint: 'You know websites. They know tools. Second Hand, First Rate.',
            art: '🔨',
            outcome: [
              s => (s.has('store_talk')
                ? "“The Home Depot,” you say. “The website. *Second Hand, First Rate.* We came up with it on the back step. I build websites for a living now, Jordan. Bad ones for big companies. Let me build one good one for you. I could stay a while. A few weeks. However long it takes.”"
                : "“The store,” you say. “I heard it's struggling. I do websites, marketing, that kind of stuff. I could help. I could stay a while.”"),
              "Jordan's face goes through about six things at once.",
              s => (s.has('apologized') && H(s) >= 3
                ? { speaker: 'Jordan', say: "You'd... stay. Here. In the town you'd rather die than live in." }
                : { speaker: 'Jordan', say: "So that's it? You can't say sorry, so you'll offer me a website instead? I don't need saving. I needed a friend ten years ago." }),
            ],
            next: STORE_VERDICT,
          },
          {
            text: 'Swap numbers. “It was good to see you.”',
            hint: 'Safe. Grown-up. Ordinary.',
            art: '📇',
            outcome: [
              "“I just... it was good to see you,” you say. “Can I get your number? Your new one. We could... get a coffee. Sometime.”",
              "Jordan looks at you for a long moment, then takes your phone and types something into it. When they hand it back, the contact says *Jordan (Reyes Hardware)*, like you might need a hinge.",
              { speaker: 'Jordan', say: "Sure. Sometime. It was good to see you too." },
            ],
            next: 'end_strangers',
          },
        ],
      },

      /* ------------------------------------------------------- THE TIME CAPSULE */
      capsule: {
        title: '9:30 PM: Behind the Bleachers',
        scene: 'gym',
        art: '🔦',
        mood: 'candle',
        weather: 'dust',
        text: [
          "Behind the bleachers it's dark and narrow and full of things nobody has looked at since 2016: a broken hurdle, a deflated volleyball, someone's single shoe. Beyond the bleacher slats, the reunion goes on without you, legs and lights and *Mr. Brightside*.",
          "Jordan holds the torch. You kneel and find the board, fourth from the wall, the one with the knot like an eye. It's still loose. Of course it's still loose.",
          "Under it, in the dust and the dark, there's a Folgers coffee can, sealed with an absolutely unnecessary amount of duct tape. Across the lid, in silver marker, in both your handwriting: **DO NOT OPEN TILL WE ARE OLD (28)**.",
          { speaker: 'Jordan', say: "We used the whole roll. Why did we use the whole roll." },
          { speaker: 'You', say: "You said it had to be 'airtight against the future.'" },
          { speaker: 'Jordan', say: "I was very dramatic." },
          "Inside, there are two folded notes, a dried-out highlighter, half a packet of gum, and the one pair of sunglasses you used to share, one lens each.",
        ],
        choices: [
          {
            text: 'Read them out loud. Together.',
            hint: 'Yours first, then theirs. No skipping the embarrassing bits.',
            set: ['read_both'],
            art: '📜',
            outcome: [
              "You go first. Your note is mostly a list. *At 28 we will: live in the city. Have a dog called Steve. Be on TV for some reason. Still be best friends, OBVIOUSLY, this is not even a goal it's a FACT.*",
              "Jordan unfolds theirs. They read it silently first, and their face does something complicated. Then they read it aloud, slowly, under the torchlight.",
              { speaker: 'Jordan', say: "'Dear Old Us. If we ever have a fight, a big one, I want you to know I already forgive you. I'm writing it now so it counts. Even if it's really bad. Even if it's your fault. It's probably your fault. Love, J.'" },
              "Neither of you says anything for a while. On the other side of the slats, a hundred people start singing along to *Don't Stop Believin'*, extremely badly.",
            ],
            next: 'end_capsule',
          },
          {
            text: 'Leave the notes sealed. Put the can back.',
            hint: 'You found it together. Maybe that’s enough.',
            art: '🤲',
            outcome: [
              "You look at the notes, and then at Jordan, and something in you decides that what's in the can belongs to two other people, two kids who don't exist any more.",
              "“Let's leave them,” you say. “Let's put it back. We'll open it at thirty-eight. We'll write new ones first.”",
              { speaker: 'Jordan', say: "You're telling me we have to come back to another one of Priya's reunions." },
              "But they're smiling as they say it. You put the sunglasses in your pocket. You tape the can up with a whole roll of tape from Sam's truck, because some traditions matter.",
            ],
            next: 'end_reconciled',
          },
        ],
      },

      /* --------------------------------------------------------------- ENDINGS */
      end_capsule: {
        title: 'Old, Like 28',
        scene: 'gym',
        art: '🕶️',
        mood: 'candle',
        weather: 'sparkles',
        ending: { id: 'old-like-28', title: 'Old, Like 28', type: 'secret' },
        text: [
          "You come out from behind the bleachers at a quarter to ten, dusty to the knees, both wearing one half of the same broken pair of sunglasses. Priya sees you and drops her clipboard.",
          { speaker: 'Priya', say: "Oh my GOD. Are you two... is this... I'm putting it in the newsletter. I'm not even asking. It's going in the newsletter." },
          "You dance, badly, to the last three songs. Sam joins in. Sam is a terrible dancer, in the most committed way. Mr. Hollis, by the door, raises his punch cup to you, and you hear him say, to nobody, *“The world is too much with us; late and soon.”* Then, a little louder: *“But not tonight.”*",
          { if: 'truth_speech', text: "On the way out, at least six people from the class of 2016 stop you to say the speech made them call someone. Three of them already have." },
          { if: 'store_talk', text: "In the car park, Jordan writes on the back of your hand, in Priya's eyeliner pencil: *Second Hand, First Rate. Monday. 9 AM. Bring coffee.*" },
          "Jordan's note goes in your wallet, in the slot where you used to keep a bus ticket. Yours goes in theirs. You agree to read them again at thirty-eight, and forty-eight, and as many times as it takes.",
          "*I already forgive you,* the eighteen-year-old wrote. *I'm writing it now so it counts.* It counted. It took ten years and a coffee can and a whole roll of tape, but it counted.",
        ],
      },

      end_reconciled: {
        title: 'Sunrise, Main Street',
        scene: 'dawn',
        art: '🌅',
        mood: 'dawn',
        weather: 'sparkles',
        ending: { id: 'reconciled', title: 'The Long Way Round', type: 'true' },
        text: [
          "You don't go home that night. You end up at the twenty-four-hour diner on Main Street, the one with the cracked red booths, Jordan and Sam on one side, you on the other, sharing a stack of pancakes the size of a hubcap.",
          "You talk until the sky goes grey. About Mr. Reyes, properly, for the first time. About the funeral you didn't come to. About the city, which turned out to be lonely in a way the brochure didn't mention. About Sam, who once delivered a baby in a car wash.",
          { if: 'truth_speech', text: { speaker: 'Jordan', say: "That speech. I was so angry. I was angry because it was the first time in ten years you'd said it where it could cost you something." } },
          { if: 'read_letter', text: { speaker: 'Jordan', say: "'You can always fix it.' Seventeen-year-old you was annoying. Seventeen-year-old you was right." } },
          { if: 'met_sam', text: "Sam pays the bill when you're both in the toilets. When you protest, he says he's investing in Jordan not doing the voice any more. Jordan asks *what voice*. Sam says *never mind*." },
          "In the car park, at dawn, Jordan hugs you. It's awkward. Your chins collide. Neither of you lets go for a long time.",
          { speaker: 'Jordan', say: "Call me. Actually call me. Not a text. Not a voicemail. I want to hear you being annoying in real time." },
          "You drive home with the sun coming up behind you. It's the first time in ten years you've left this town without feeling like you were running away from it.",
        ],
      },

      end_newstart: {
        title: 'Three Months Later',
        scene: 'shop',
        art: '🛠️',
        mood: 'sunny',
        weather: 'dust',
        ending: { id: 'second-hand-first-rate', title: 'Second Hand, First Rate', type: 'good' },
        text: [
          "You stayed a week. Then a month. Then you let your city flat go and moved into the room above the Gas & Go, which smells permanently of hot dogs but is cheap.",
          "Reyes Hardware now has a website. It's called **Second Hand, First Rate**, and it sells restored old tools to people in cities who've never sanded anything in their lives and want to start. Jordan restores. You photograph, write and post. The first order came from Norway. You both screamed.",
          { if: 'store_talk', text: "It was your idea on a back step, aged fifteen, with ice lollies. It was Jordan's idea too. You argue about this most days. It's the best argument you have." },
          "The Home Depot opened on Route 9 in the spring. On its first weekend, a man came into Reyes Hardware to ask for something the Home Depot didn't have: a person who knew what he meant when he said *the thingy for the other thingy*. Jordan knew.",
          { if: 'met_sam', text: "Sam brings lunch on Thursdays. He calls you *the intern* and you let him." },
          "Sometimes, at closing, Jordan stands at the till and looks round the shop, at the jars of screws you sort for a dollar an hour (they still pay you a dollar an hour, as a joke, in cash), and says nothing. But they don't do the voice any more. Sam checked.",
          "It isn't the city. It isn't *everything*, like the list said. It's a back step, and an old friend, and a thousand jars of screws. It turns out that was number one on the list all along.",
        ],
      },

      end_strangers: {
        title: 'Some Months Later',
        scene: 'apartment',
        art: '☕',
        mood: 'night',
        ending: { id: 'polite-strangers', title: 'Polite Strangers', type: 'neutral' },
        text: [
          "You and Jordan do get that coffee, eventually. In March. Somewhere halfway between your city and their town, a chain café at a motorway services, which feels about right.",
          "It's fine. It's nice, even. You talk about the store, and your job, and how Priya has started a WhatsApp group that sends forty messages a day. You both laugh at the same things. You both avoid the same things.",
          { if: 'apologized', text: "You said sorry. You know they heard it. But hearing an apology and building something new on top of it are two different jobs, and nobody can do the second one in one night." },
          { if: 'lied', text: "Neither of you mentions the speech. You both think about it." },
          { if: 'note', text: "They never texted the number on the eyeliner note. When you ask, they say the rain smudged it. You both know that's only half true." },
          "At the end, you hug, the careful hug of people who used to know each other's whole lives. *We should do this again,* you both say. You both mean it, in the way people mean it.",
          "Back in your flat that night, you look at their name in your phone for a long time. *Jordan (Reyes Hardware).* It's more than you had. It's a lot less than you wanted. It's what you made, with what you were brave enough to say.",
        ],
      },

      end_worse: {
        title: 'Taillights',
        scene: 'street',
        art: '💢',
        mood: 'night',
        weather: 'rain',
        ending: { id: 'made-it-worse', title: 'Salt in the Wound', type: 'bad' },
        text: [
          "The pickup pulls out of the car park with its wipers going hard. It doesn't pause at the exit this time.",
          { if: 'blamed', text: "You keep hearing your own voice saying *the seat*. Out of everything, ten years later, you chose to talk about the seat." },
          { if: 'lied', text: "'Still best friends,' you said, into a microphone, to ninety people. Now ninety people will ask Jordan about you at the till for the next year, and Jordan will have to keep saying *sure*." },
          "Two days later, Priya posts the reunion photos. In one of them, you're in the background, mid-sentence, finger pointing, Jordan's face turned away. Someone in the comments writes *woah what was going on here lol*. Priya deletes it, but not before you've seen it eleven times.",
          "Sam sends you one message, a week later, from a number you don't recognise: *I'm not angry. I just want you to know that they started doing the voice again. Please don't come to the next one.*",
          "You came back to fix one thing you broke. You broke it again, harder, in the exact same place. Some things can be mended. But not by the same hands doing the same thing.",
        ],
      },

      end_gone: {
        title: 'The Motorway',
        scene: 'void',
        art: '🚗',
        mood: 'night',
        ending: { id: 'left-without-trying', title: 'The Last Bus Out', type: 'bad' },
        text: [
          "The town shrinks behind you to a little orange smudge on the dark, then nothing. The motorway hums. It is very, very easy to leave somewhere. You've always been good at it.",
          { if: 'voicemail', text: "On Monday morning, somewhere in town, a light on an answering machine at Reyes Hardware will be blinking. You'll never know if Jordan listens to it, or listens to all of it, or saves it, or deletes it. That's the thing about saying it to a machine. The machine never answers back." },
          { if: 'note', text: "The note is still under the wiper when the truck turns the corner. You'll never know if it made it home, or blew off into a ditch on Route 9, eyeliner running in the rain." },
          { if: 'hesitated', text: "You think about the second you didn't move. Just one second. Ten years ago it was a bus door. Tonight it was your own feet." },
          "Priya posts the reunion photos two days later. You're in none of them. Jordan is in one, near the end of the night, alone by the bleachers, looking at the doors.",
          "There'll be another reunion in ten years. You tell yourself you'll go to that one. You tell yourself a lot of things on motorways at night.",
        ],
      },
    },
  });
})();
