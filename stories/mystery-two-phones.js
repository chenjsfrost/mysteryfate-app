/*
 * Two Phones — MysteryFate story.
 *
 * SOLUTION (for authors): The window table at the Kettle & Crumb is a seam. Whatever is left on it before
 * closing turns up there at 4:12 PM the day before (the café clock stopped at 4:12 seven years ago, the
 * afternoon Marcus Hale's loop began). The "second phone" is simply YOUR phone, one day older: tomorrow
 * night, after Calder Junction, you will put it down on that table, and it will fall back to Thursday.
 * The proof is the scratch: the found phone's long scratch forks into a Y at the bottom. Yours doesn't —
 * yet. It forks on Friday at 9:14 PM, when the phone skids across the kerb at the junction.
 * Nobody is lying to you. Tomorrow-you only sent one line and one voice note, because that is all you
 * received. Marcus sent his past self forty-one messages, saved his brother Danny from a crash, and never
 * put his phone back; the loop had no beginning, so reality closed the hole by unwriting Danny entirely.
 *
 * Paradox (0..5) rises every time you meddle or reveal. 5 = you are unwritten. 4 = you pay a price.
 * Secret ending: c_scratch (compare the scratches) + c_marcus (hear Danny's story and the table's rule)
 * + echo (send yourself exactly what you received, nothing more) + Paradox <= 2 + Theo saved,
 * then go back to the café before closing and leave the phone exactly as you found it.
 */
(function () {
  'use strict';

  const say = (speaker, text, cond) => (cond === undefined ? { speaker, say: text } : { speaker, say: text, if: cond });
  const clamp = (n) => Math.max(0, Math.min(5, n));
  // Nudge the Paradox meter (clamped 0..5), then run an optional extra effect.
  const px = (n, extra) => (s) => {
    s.setVar('paradox', clamp(s.get('paradox') + n));
    if (extra) extra(s);
  };
  const frayed = (s) => s.get('paradox') >= 3;
  const secretReady = (s) => s.has('c_scratch') && s.has('c_marcus') && s.has('echo') && s.get('paradox') <= 2;

  // Small reality slips that creep in as the Paradox meter climbs.
  const fray = (s) => {
    const p = s.get('paradox');
    if (p >= 4) return 'Something is badly wrong with the edges of things. The street sign at the corner says CALDER, then CALDOR, then nothing at all. For one second you can\'t remember the colour of your own front door.';
    if (p >= 3) return 'Small things keep changing when you aren\'t looking. A poster you passed was blue and is now green. Your watch is two minutes slow, then right, then two minutes fast.';
    return null;
  };

  registerStory({
    id: 'mystery-two-phones',
    title: 'Two Phones',
    category: 'mystery',
    tagline: 'There\'s a phone on your café table. It\'s yours. It\'s getting texts from tomorrow. From you.',
    description: 'At your usual table you find a phone identical to yours, down to the scratch on the case and the lock code. It\'s receiving messages from tomorrow night, and they\'re from you: "Don\'t let Theo get in the car." Save your best friend without tearing the day apart at the seams.',
    cover: '📱',
    accent: '#7b8cff',
    ambient: 'mystery',
    scene: 'cafe',
    warning: 'Contains: a road accident (off-page), a hospital, grief.',
    vars: { paradox: 0 },
    hud: [{ var: 'paradox', label: 'Paradox', icon: '🌀', max: 5 }],
    voices: {
      narrator: { gender: 'female', pitch: 0.96, rate: 0.94, accent: 'en-US', note: 'close, intimate, late-night storyteller' },
      'Theo Vance': { gender: 'male', pitch: 1.1, rate: 1.12, accent: 'en-AU', note: 'funny, impulsive best friend, always mid-joke' },
      'Nadia Okoro': { gender: 'female', pitch: 0.9, rate: 1.02, accent: 'en-GB', note: 'sceptical A&E nurse, dry, tired, fierce' },
      'Marcus Hale': { gender: 'male', pitch: 0.75, rate: 0.85, accent: 'en-GB', note: 'quiet, haunted, careful with every word' },
      'Lou': { gender: 'female', pitch: 1.15, rate: 1.15, accent: 'en-IE', note: 'chatty barista who notices everything' },
      'Tomorrow': { gender: 'neutral', pitch: 0.85, rate: 0.9, accent: 'en-GB', volume: 0.7, note: 'you, a day older, wrecked, whispering into a voice note' },
    },
    start: 'intro',
    scenes: {
      // ------------------------------------------------------------------ THURSDAY (TODAY)
      intro: {
        title: 'TODAY — THU 4:12 PM — The Kettle & Crumb',
        art: '📱📱',
        mood: 'fog',
        weather: 'rain',
        scene: 'cafe',
        text: [
          'There are two phones on your table, and only one of them came in with you.',
          'The Kettle & Crumb, Thursday afternoon, rain sliding down the big front window. Your usual seat: the window table, the wobbly one, the one Lou the barista calls *your office*. The clock above the counter says 4:12. It always says 4:12. It\'s been broken longer than you\'ve been coming here.',
          'You put your phone down next to your flat white, and there it is. Another phone. Same model. Same matte black case. Same long silver scratch running corner to camera, the one Theo gave it when he dropped it at a festival two summers ago and then tried to blame a goose.',
          'Its screen lights up on its own. A message preview, from a contact saved as **Me**.',
          '*Don\'t let Theo get in the car.*',
          'Under it, the timestamp: **Fri 11:48 PM**. Tomorrow night.',
        ],
        choices: [
          {
            text: 'Type your own lock code into it',
            hint: '0-3-1-1. Theo\'s birthday. He set it as a joke and you never changed it.',
            art: '🔓',
            outcome: [
              'Your thumb does it before your brain agrees to. Zero. Three. One. One.',
              'It unlocks. Of course it unlocks. Your wallpaper: you and Theo on the roof of your building, both squinting into the sun, him pretending to fall off. Your apps, in your stupid order. Your battery at 31 per cent, which is exactly what yours says.',
              'Except this one has one more message thread than yours. Pinned to the top. **Me.**',
            ],
            next: 'texts',
          },
          {
            text: 'Hold it up and ask Lou who left it',
            hint: 'Lou notices everything that happens in this café.',
            art: '☕',
            set: ['c_lou'],
            outcome: [
              say('Lou', 'Nobody left it, pet. I wiped that table at four, swear on my nan. Then I turned round to do the milk and you were sitting at it.'),
              'She frowns, steam wand still hissing in her hand.',
              say('Lou', 'Which is funny, because I could\'ve sworn you\'d already been in. Same green coat. Sat down, put something on the table, walked out. Then two minutes later you walk in again. I thought, I need more sleep or less coffee.'),
              'You look down at your green coat. You only got here a minute ago. You type your lock code into the stranger\'s phone, Theo\'s birthday, and it opens like it knows you.',
            ],
            next: 'texts',
          },
          {
            text: 'Lay the two phones side by side and compare them',
            hint: 'Nothing is ever exactly the same. Find the difference.',
            art: '🔍',
            set: ['c_scratch'],
            outcome: [
              'You line them up edge to edge on the wobbly table like a spot-the-difference puzzle.',
              'Same case. Same chip on the corner. Same scratch: one long silver line from the top corner to the camera. You trace yours with a fingernail, then the stranger\'s.',
              'There. At the bottom of the stranger\'s scratch, the line **splits**. A second, newer groove branches off it, sharp and bright, so the whole thing makes a little **Y**. Yours is a single line. Whatever made that fork hasn\'t happened to your phone. Not yet.',
              'You try your lock code on the stranger. Zero, three, one, one. It opens.',
            ],
            next: 'texts',
          },
        ],
      },

      texts: {
        title: 'TODAY — THU 4:19 PM — The Thread',
        art: '💬🎙️',
        mood: 'fog',
        weather: 'rain',
        scene: 'cafe',
        fx: 'glitch',
        text: [
          'The thread called **Me** holds exactly two things. Both are timestamped tomorrow, Friday, 11:48 PM.',
          'One text: *Don\'t let Theo get in the car.*',
          'And one voice note, thirteen seconds long. You put one earbud in, angle your body away from the room, and press play. Behind the voice: a hospital tannoy, a machine beeping, someone crying who isn\'t the speaker.',
          say('Tomorrow', 'It\'s me. It\'s you. I know how this sounds. Calder Junction, tomorrow night. Theo was coming to get Nadia. Don\'t let him get in the car. And don\'t... the more you tell people, the more it...'),
          'It cuts off. Your own voice, wrecked, a day older.',
          'When you look up, a man at the counter is watching you. Fifties, grey jacket, an untouched black coffee. He\'s been in here every afternoon this week, always facing your table. He isn\'t looking at your face. He\'s looking at the phone.',
        ],
        choices: [
          {
            text: 'Reply to yourself: "Who is this?"',
            hint: 'You have to know if anyone is on the other end.',
            art: '⌨️',
            fx: 'glitch',
            effect: px(1),
            outcome: [
              'You type it. *Who is this?* You hit send. One tick. Two ticks. Read.',
              'The answer is instant, as if someone was holding the phone and waiting.',
              '*You know who. Every word costs. Stop.*',
              'The fluorescent tube over the counter stutters. Lou\'s cup stack sways. The man in the grey jacket flinches as if somebody shouted, drops a coin by his coffee, and walks straight out into the rain.',
            ],
            next: 'marcus_leaves',
          },
          {
            text: 'Walk over to the man in the grey jacket',
            hint: 'He knows something. It\'s all over his face.',
            art: '🧥',
            outcome: [
              'You cross the café holding the phone the way you\'d hold something that might bite. He doesn\'t pretend not to see you coming. He just closes his eyes, briefly, like a man hearing a song he hoped he\'d never hear again.',
              say('Marcus Hale', 'Sit down. And turn that face down on the table. Please.'),
            ],
            next: 'marcus_talk',
          },
          {
            text: 'Call Theo, right now',
            hint: 'Hear his voice. Make sure he\'s real and fine and annoying.',
            art: '📞',
            outcome: [
              'He picks up on the first ring, which he never does.',
              say('Theo Vance', 'Oi oi. Are you at the café? Bring me a cinnamon thing. Bring me two cinnamon things, I\'ve had a day.'),
              'You ask him, as casually as you can manage, what he\'s doing tomorrow night.',
              say('Theo Vance', 'Picking your sister up from St Anne\'s after her shift. Her car\'s in the garage, she\'s paying me in curry. Why, what\'s up? You sound weird. Weirder.'),
              'You tell him nothing. You say *cinnamon things, got it*. When you hang up, the man in the grey jacket is already pushing out through the door.',
            ],
            next: 'marcus_leaves',
          },
        ],
      },

      marcus_talk: {
        title: 'TODAY — THU 4:24 PM — The Man in the Grey Jacket',
        art: '🧥☕',
        mood: 'fog',
        weather: 'rain',
        scene: 'cafe',
        text: [
          'You sit. You turn the phone face down. Up close he looks tired in a way that sleep doesn\'t fix: grey stubble, a wedding ring on a chain round his neck instead of his finger.',
          say('Marcus Hale', 'My name\'s Marcus. Before you ask: no, I didn\'t put it there. I\'ve been sitting here every day for a week because I saw the clock.'),
          'He nods at the clock above the counter. 4:12.',
          say('Marcus Hale', 'It stopped seven years ago. It stopped the day I found mine. When Lou said it had started ticking again last Friday, I knew somebody was about to have the week I had. Is it from tomorrow?'),
          'You don\'t answer. You don\'t have to. He reads it off you.',
        ],
        choices: [
          {
            text: '"Who did you lose?"',
            hint: 'He said "mine". There\'s grief all over him.',
            art: '🕯️',
            set: ['c_marcus'],
            outcome: [
              'He turns his cup round and round on its saucer.',
              say('Marcus Hale', 'My little brother, Danny. Found a phone on this table, seven years ago. Messages from me, a day ahead, telling me Danny was going to die on his motorbike at Calder Junction. So I saved him. Of course I did.'),
              say('Marcus Hale', 'I sent myself forty-one messages that night. Times, places, number plates. I told Danny, I told my mum, I told the police. Everything went strange. Colours. Street names. And I saved him. And then I kept the phone. I never put it back.'),
              'You ask what he means, *put it back*. He looks at the window table.',
              say('Marcus Hale', 'Whatever\'s left on that table at closing turns up there at 4:12 the day before. That\'s where the phone comes from. It comes from you. And if you don\'t close the circle, the world closes it for you. Danny didn\'t die. There just stopped being a Danny. No photos. No records. My mum has one son. I\'m the only one who remembers him.'),
              'He stands, leaves a coin by the cup, and puts a hand on your shoulder on his way past.',
              say('Marcus Hale', 'Say less than you want to. Then put it back.'),
            ],
            next: 'flat',
          },
          {
            text: '"You planted this. Why?"',
            hint: 'A stranger who watches your table all week. Make him explain.',
            art: '😠',
            outcome: [
              'You say it loud enough that Lou looks over. Marcus doesn\'t flinch. He looks almost relieved, like he\'d prefer you angry to scared.',
              say('Marcus Hale', 'I didn\'t leave it. You did.'),
              'He slides a card across the table. Plain white, a phone number, and **M. HALE** in neat capitals.',
              say('Marcus Hale', 'When it starts changing things, the little things, colours and names, you call me. And whatever it tells you to do, do less of it than you want to.'),
              'He goes. Through the rain-streaked window you watch him stop at the corner, look back at your table for a long moment, and walk away towards the tram stop.',
            ],
            next: 'flat',
          },
        ],
      },

      marcus_leaves: {
        title: 'TODAY — THU 4:31 PM — Outside',
        art: '🚋🌧️',
        mood: 'fog',
        weather: 'rain',
        scene: 'street',
        text: [
          'You grab both phones and your coat and push out into the rain. The grey jacket is half a street ahead, walking fast with his head down, the way you walk when you\'re trying not to run.',
          'He reaches the tram stop. The number 9 is pulling in. Its destination board flicks between stops: CITY CENTRE, ST ANNE\'S HOSPITAL, **CALDER JUNCTION**.',
          'In your pocket, the stranger\'s phone is warm. The voice note said *Calder Junction*. The doors hiss open.',
        ],
        choices: [
          {
            text: 'Jump on the tram after him',
            hint: 'Sit at the back. See where he goes.',
            art: '🏃',
            outcome: [
              'You slip on at the rear doors just as they close. He\'s at the front, standing, one hand on the pole, staring out at the rain. He doesn\'t look back. You don\'t think he\'s seen you.',
              'Eleven stops. You count them. At the twelfth, the board says CALDER JUNCTION, and he gets off.',
            ],
            next: 'follow',
          },
          {
            text: 'Let him go, and go home to Theo',
            hint: 'Whatever this is, it\'s about Theo. Be where Theo is.',
            art: '🏠',
            outcome: [
              'The doors close. The tram slides away with the grey jacket on it, and you stand at the stop with rain running down your neck and two identical phones in your pocket.',
              'You buy two cinnamon swirls on the way home, because it\'s Thursday and that\'s what you do, and because doing normal things feels like holding on to something.',
            ],
            next: 'flat',
          },
        ],
      },

      follow: {
        title: 'TODAY — THU 5:08 PM — Calder Junction',
        art: '🚦💐',
        mood: 'fog',
        weather: 'rain',
        scene: 'street',
        text: [
          'Calder Junction is five roads meeting at one set of lights, with St Anne\'s Hospital hunched on the far corner like it\'s waiting for customers. The traffic light here is famous for its long red. People get bored and go.',
          'Marcus crosses to the railing on the island in the middle. There\'s a bunch of supermarket flowers there already, old and brown. He takes them off and ties fresh ones on with a bit of string from his pocket.',
          'You get close enough to read the card before he turns. *D. — I said too much. I\'m sorry. — M.*',
          'The lights change. A van grinds past, close enough to stir your hair.',
        ],
        choices: [
          {
            text: 'Go and stand next to him',
            hint: 'No more sneaking. Ask him straight.',
            art: '🕯️',
            set: ['c_marcus'],
            outcome: [
              'He doesn\'t jump when you appear beside him. He just says *you followed me*, like he\'s commenting on the weather.',
              say('Marcus Hale', 'My brother. Danny. Seven years ago a phone turned up on your table, at your café, with messages from me a day ahead. Danny was going to come off his bike right here. So I stopped it. I sent myself forty-one messages. I told everyone.'),
              say('Marcus Hale', 'He didn\'t die. There just stopped being a Danny. Nobody remembers him but me. Because I kept the phone. I never put it back.'),
              'You ask what *put it back* means. He nods at the junction, then back the way you came, towards the café.',
              say('Marcus Hale', 'Whatever you leave on that table at closing turns up at 4:12 the day before. That\'s where your phone came from. It came from you. Say less than you want to. And close the circle.'),
            ],
            next: 'flat',
          },
          {
            text: 'Stay back and time the lights',
            hint: 'If something happens here tomorrow, learn the junction.',
            art: '⏱️',
            set: ['mapped'],
            outcome: [
              'You lean on a bus shelter and pretend to scroll. You time the lights on your own phone\'s stopwatch. Four cycles. Then five.',
              'The pattern is simple once you see it. The crossing button on the hospital side **resets the whole junction**: press it and every light goes red for nine seconds so the pedestrians can cross. The 9:14 cycle, tomorrow night, will be no different.',
              'When you look up, Marcus is gone. Only the new flowers are left, bright against the grey railing.',
            ],
            next: 'flat',
          },
        ],
      },

      flat: {
        title: 'TODAY — THU 7:40 PM — The Flat',
        art: '🍝🔑',
        mood: 'neon',
        scene: 'apartment',
        text: [
          'Theo is making carbonara with cream in it, which he knows is a crime and does on purpose to see your face. The radio is on. He\'s singing over it, badly, with a wooden spoon for a microphone.',
          say('Theo Vance', 'There they are! The cinnamon provider! Sit, sit. Dinner in five, or fifteen, or never, depending on how this sauce feels about me.'),
          'His car keys hang on the hook by the door, on the rubber-duck keyring you bought him as a joke and he refuses to change. The car is a dented blue hatchback called Gerald. He loves Gerald more than he loves most people.',
          say('Theo Vance', 'Oh, I\'m picking Nads up tomorrow at nine, did I say? After her shift. She\'s paying me in curry. Your sister is a businesswoman.'),
          { if: 'c_marcus', text: 'Marcus\'s voice is in your head. *Say less than you want to.*' },
          'In your pocket, the stranger\'s phone buzzes once against your leg. Nothing new on the screen. It\'s just reminding you it\'s there.',
        ],
        choices: [
          {
            text: 'Tell him everything and show him the phone',
            hint: 'He\'s your best friend. He deserves to know.',
            art: '📱',
            fx: 'glitch',
            set: ['told_theo'],
            effect: px(1),
            outcome: [
              'You turn the radio off. Theo stops singing, spoon still raised, because you never turn the radio off.',
              'You put the two phones side by side on the counter, next to the parmesan. You tell him all of it: the table, the texts, the voice note. You play it for him. Your own voice says his name from inside tomorrow.',
              'The kitchen light flickers once. Just once.',
            ],
            next: 'theo_told',
          },
          {
            text: 'Quietly slip his car keys off the hook',
            hint: 'No car, no crash. He never needs to know.',
            art: '🦆',
            set: ['keys'],
            outcome: [
              'He turns back to the hob to rescue the sauce. You stand up, stretch, wander past the door and lift the rubber duck off its hook in one movement. The keys go into your coat pocket. Your heart is going like you\'ve robbed a bank.',
              say('Theo Vance', 'Can you pass the pepper?'),
              'You pass the pepper. You eat the crime carbonara. You laugh at his jokes a beat too late. Later, he spends five minutes patting the pockets of every jacket he owns, then shrugs and says the duck will turn up. *Ducks always come home.*',
            ],
            next: 'tom_race',
          },
          {
            text: 'Ask him to cancel on Nadia, without saying why',
            hint: 'Keep it simple. Keep it secret.',
            art: '🙏',
            outcome: [
              'You try to make it sound like nothing. *Could Nadia not get a cab tomorrow? Just this once?*',
              say('Theo Vance', 'Get a cab? Your sister? She\'d skin me and wear me as a coat. I promised. Also, curry.'),
              'He squints at you over the pan.',
              say('Theo Vance', 'What\'s going on with you today? You\'ve been holding your pocket like there\'s a bird in it.'),
              'You say *nothing, long day*. He lets it go, because he\'s Theo, and he knows you\'ll tell him eventually. You eat dinner. You don\'t tell him.',
            ],
            next: 'tom_race',
          },
        ],
      },

      theo_told: {
        title: 'TODAY — THU 8:02 PM — The Flat',
        art: '😶🍝',
        mood: 'neon',
        scene: 'apartment',
        text: [
          'Theo listens to the voice note three times. He doesn\'t make a joke. That\'s the worst part. Theo always makes a joke.',
          'Finally he puts the phone down very gently, like it might go off.',
          say('Theo Vance', 'So. Just to recap. I\'m dead tomorrow, and you\'re telling me tonight, and I made us cream carbonara. That\'s my last supper. Cream carbonara.'),
          'There it is. You laugh, and it comes out wet. He laughs too, and then neither of you is laughing.',
          'The stranger\'s phone lights up on the counter. A new message from **Me**, timestamped tomorrow. Just three words. *Stop telling people.*',
          s => (frayed(s) ? 'The fridge magnets on the door are in a different order than they were a minute ago. Neither of you touched them.' : 'The fridge hums. Somewhere a siren goes past. Ordinary sounds, suddenly very loud.'),
        ],
        choices: [
          {
            text: 'Ask him for his car keys',
            hint: 'Make it simple: no Gerald, no junction.',
            art: '🦆',
            set: ['keys'],
            outcome: [
              'He doesn\'t argue. He takes the rubber duck off the hook and drops it into your hand, and closes your fingers round it.',
              say('Theo Vance', 'Look after Gerald. He gets lonely. I\'ll get the bus to Nadia\'s, alright? Buses are very safe. Nobody famous ever died on a bus.'),
              'You\'re fairly sure that isn\'t true. You don\'t say so.',
            ],
            next: 'tom_race',
          },
          {
            text: 'Make him promise: if he sees you waving, he stops',
            hint: 'He keeps the car. But he keeps an eye out for you.',
            art: '🤞',
            outcome: [
              'You make him do the pinky thing, like when you were nineteen and promises were sacred.',
              say('Theo Vance', 'If I see you, at any junction, waving your arms like a lunatic, I stop. I stop the car, I get out, I do a little dance. Deal.'),
              say('Theo Vance', 'But I\'m still getting Nadia. She\'s on her feet twelve hours. I\'m not leaving her at a bus stop at nine at night because a phone told me to.'),
              'He means it. Both halves.',
            ],
            next: 'tom_race',
          },
        ],
      },

      // ------------------------------------------------------------------ FRIDAY (TOMORROW, as it stands)
      tom_race: {
        title: 'TOMORROW — FRI 9:02 PM — Running',
        art: '🏃‍♀️🌃',
        mood: 'night',
        weather: 'rain',
        scene: 'city-night',
        fx: 'glitch',
        timer: 8,
        text: [
          '**TOMORROW.** You are still you, one day on. This is Friday as it stands right now, the version Thursday-you is building. The only line back is the phone in your hand.',
          'You\'re running. Rain in your eyes, coat flapping open, lungs on fire. It\'s 9:02 and Calder Junction is two streets away.',
          s => {
            if (s.has('keys') && s.has('told_theo')) return 'Theo gave you the keys. So he took the bus instead, and the bus drops him on the far side of Calder Junction, and he\'s walking across it to find you, because he knows you\'ll be there. Because you told him.';
            if (s.has('keys')) return 'You took his keys. So Theo got the 9:10 bus instead, which drops him on the far side of Calder Junction, and right now he\'s crossing it on foot, hood up, head down against the rain. No car. It didn\'t matter. The junction doesn\'t care how he arrives.';
            if (s.has('told_theo')) return 'He kept his promise, and he kept the car. He\'s looking out for you at every junction. Which means he\'s looking at the pavements, not the road.';
            return 'Theo doesn\'t know. Why would he? He left at 8:50 with the radio on, to pick Nadia up from St Anne\'s, singing.';
          },
          'The hospital clock tower is ahead, over the rooftops. The minute hand is creeping towards 14.',
        ],
        timeout: {
          text: 'You froze.',
          fx: 'redflash',
          outcome: [
            'Your legs just stop. You stand in the rain on the wrong street, chest heaving, while the hospital clock ticks over to 9:14.',
            'You don\'t see it. You hear it. Two streets away: a long scream of brakes, then a sound like a skip being dropped, then nothing. Then car alarms. Then everything.',
          ],
          next: 'tom_after',
        },
        choices: [
          {
            text: 'Sprint the last two streets',
            hint: 'Get there. Just get there.',
            art: '🏃',
            outcome: [
              'You run like you\'ve never run, across a road without looking, through a gap between two parked vans, round the corner into the lights.',
              'Calder Junction opens up in front of you, wet and red and gold. You see the duck-blue hatchback. You see a white van coming the other way, too fast for the light. You open your mouth to scream his name.',
              'And everything goes white, and then it goes quiet.',
            ],
            next: 'tom_after',
          },
          {
            text: 'Call Theo while you run',
            hint: 'He might pick up. He might pull over.',
            art: '📞',
            outcome: [
              'It rings. And rings. You hear his voice, but it\'s the voicemail. *It\'s Theo, I\'m probably driving or being brilliant, leave a message.*',
              'You scream at him to stop the car. You\'re still screaming it into the phone when you round the corner, and the white van is already there.',
            ],
            next: 'tom_after',
          },
          {
            text: 'Text yesterday: "9:14. CALDER JN. WHITE VAN."',
            hint: 'Give Thursday more to work with. It will cost.',
            art: '⌨️',
            fx: 'glitch',
            set: ['sent_time'],
            effect: px(1),
            outcome: [
              'Your thumbs are shaking so badly it takes three tries. *9:14. CALDER JN. WHITE VAN.* Send.',
              'The street lamps along the road dim and brighten, one after another, like something is running down the line. The puddle you\'re standing in reflects a sky with no rain in it.',
              'Then the hospital clock says 9:14, and somewhere ahead of you the brakes start screaming.',
            ],
            next: 'tom_after',
          },
        ],
      },

      tom_after: {
        title: 'TOMORROW — FRI 11:48 PM — St Anne\'s A&E',
        art: '🏥📱',
        mood: 'office',
        scene: 'corridor',
        fx: 'glitch',
        text: [
          'A hospital corridor at the end of the world. Plastic chairs. A vending machine that\'s been out of crisps for a year.',
          'Nadia is sitting next to you in her scrubs, still wearing her lanyard. She was on shift when they brought him in. She saw his face on the trolley before anyone could stop her.',
          say('Nadia Okoro', 'He was coming to get me. He was coming to get me, and I could have got a cab.'),
          'Theo is in surgery. Nobody will say more than that. Nadia, who always says more than that, doesn\'t either.',
          'And in your hand: the phone. The thread called **Me** is open. It\'s 11:48. You understand, all at once and with a kind of horror, that this is the moment. Somewhere behind you, it\'s Thursday afternoon, and you\'re sitting at a wobbly café table, and a phone is about to light up.',
          { if: 'c_marcus', text: 'You think of Marcus. Forty-one messages. *Say less than you want to.*' },
          'You know exactly what you received. One line. One voice note. Thirteen seconds.',
        ],
        choices: [
          {
            text: 'Send exactly what you got. Not one word more.',
            hint: 'The same line. Record the same thirteen seconds.',
            art: '🔁',
            set: ['echo'],
            outcome: [
              'You type it the way you saw it. *Don\'t let Theo get in the car.* Send.',
              'Then you hold the phone to your mouth and record. You don\'t plan the words. They come out exactly as you heard them, because they were always going to. *It\'s me. It\'s you. I know how this sounds...* Your voice cracks in the same place. You stop at the same place.',
              'Send. Thirteen seconds. Something in the air goes *click*, like a seatbelt fastening.',
            ],
            next: 'thu_night',
          },
          {
            text: 'Send everything. Every detail. Every warning.',
            hint: 'Times. Places. The van. Nadia. Marcus. All of it.',
            art: '📜',
            fx: 'glitch',
            set: ['flood'],
            effect: px(2),
            outcome: [
              'You write and write. The van\'s colour, the lights, the time, the 9:10 bus, Nadia\'s shift, what Theo was wearing. You send it in pieces because it won\'t go in one.',
              'Each message makes the corridor lights buzz. The vending machine\'s display flickers from OUT OF ORDER to a language you don\'t recognise and back. Nadia\'s lanyard says NADIA OKORO, then NADINE OKORO, then NADIA again.',
              'She doesn\'t notice. You do. You keep typing anyway.',
            ],
            next: 'thu_night',
          },
          {
            text: 'Send nothing. Put it face down.',
            hint: 'Maybe the meddling is what caused all this.',
            art: '🤐',
            fx: 'glitch',
            set: ['silent'],
            effect: px(1),
            outcome: [
              'You turn the phone over on your knee and leave it there. Whatever this is, you won\'t feed it.',
              'Nothing happens for a long time. Then the phone starts buzzing against your leg, again and again, with nobody calling. You turn it over. The thread called **Me** is still there, but the words of the first message are sliding, rearranging. *Don\'t let Theo.* *Don\'t let.* *Don\'t.*',
              'It was supposed to come from somewhere. It came from you. And you just said no.',
            ],
            next: 'thu_night',
          },
        ],
      },

      // ------------------------------------------------------------------ THURSDAY NIGHT (TODAY)
      thu_night: {
        title: 'TODAY — THU 11:40 PM — The Roof',
        art: '🌃📱',
        mood: 'night',
        weather: 'stars',
        scene: 'rooftop',
        text: [
          '**TODAY.** Back on Thursday. You\'re on the roof of your building, where you and Theo drag two camping chairs on summer nights. Tonight it\'s just you and the city and two phones.',
          'That tomorrow you just lived through is a draft. You still have the pen.',
          s => {
            if (s.has('flood')) return 'The stranger\'s phone has gone mad. Message after message from **Me**, a wall of them: times, places, the van, a bus number, Nadia\'s shift. Every time a new one lands, the city lights below you flicker in a ripple, block by block.';
            if (s.has('silent')) return 'The stranger\'s phone is wrong. The thread from **Me** is still there, but the first message keeps rearranging itself. *Don\'t let Theo get in the car* becomes *Don\'t let Theo* becomes *Don\'t*. The voice note is still thirteen seconds long, but now it\'s thirteen seconds of hospital noise and nobody speaking.';
            if (s.has('echo')) return 'The stranger\'s phone buzzes once. You check. The thread from **Me** is exactly as it was this afternoon: one line, one voice note, Friday 11:48 PM. Nothing new. Nothing missing. It feels, absurdly, like a door clicking shut behind you.';
            return 'The stranger\'s phone buzzes once.';
          },
          { if: 'sent_time', text: 'And one more, sitting under the rest: *9:14. CALDER JN. WHITE VAN.* You know the time now. You know the vehicle. You also feel the night shift around you, slightly, like a rug being tugged.' },
          s => fray(s),
          'Below, a bus sighs past. In the flat downstairs, Theo is asleep with the telly on. He has no idea.',
        ],
        choices: [
          {
            text: 'Smash the stranger\'s phone on the parapet',
            hint: 'End it. No more voices from tomorrow.',
            art: '💥',
            fx: 'shake',
            outcome: [
              'You don\'t think about it. You bring it down on the brick edge of the roof as hard as you can, again and again, until the screen is a spiderweb and then a crater and then nothing at all.',
              'You throw the pieces as far as you can. You hear them land in the bins in the alley below. The city carries on, entirely unbothered.',
              'You sit down in your camping chair and shake for a long time.',
            ],
            next: 'end_smash',
          },
          {
            text: 'Call Nadia. She\'s on nights. Meet her at the end of her shift.',
            hint: 'She\'s a sceptic. You need someone who doesn\'t scare easily.',
            art: '📞',
            outcome: [
              say('Nadia Okoro', 'It\'s nearly midnight. Is someone bleeding? If nobody\'s bleeding, I\'m hanging up.'),
              'You tell her nobody\'s bleeding. You tell her you need to talk to her about Theo, tomorrow, in person, before her shift. There\'s a pause long enough that you hear a monitor beeping somewhere behind her.',
              say('Nadia Okoro', 'Seven thirty. My place. Bring croissants. If this is about you and Theo finally getting together, I swear to God.'),
            ],
            next: 'nadia',
          },
          {
            text: 'Lay the phones side by side under the roof light',
            hint: 'You haven\'t looked closely yet. Look now.',
            art: '🔍',
            if: '!c_scratch',
            set: ['c_scratch'],
            outcome: [
              'You put them on the arm of the camping chair, under the security light, and look at them properly for the first time.',
              'Same case. Same chip. Same long silver scratch from corner to camera. But at the bottom of the stranger\'s scratch, the line **forks**. A second bright groove, newer than the rest, making a little **Y**. Yours is a single line.',
              'Whatever makes that fork hasn\'t happened to your phone yet. You hold it a little tighter. You go to bed and stare at the ceiling until it gets light.',
            ],
            next: 'cafe2',
          },
          {
            text: 'Go to bed. You\'ll need tomorrow.',
            hint: 'Sleep. Plan. Be ready at the café at 4:12.',
            art: '🛏️',
            outcome: [
              'You go down the fire stairs and stand in Theo\'s doorway for a minute, the way his mum probably used to. He\'s asleep with his mouth open and one sock on. The telly is showing a programme about narrowboats.',
              'You turn it off. You put a blanket on him. You don\'t sleep at all.',
            ],
            next: 'cafe2',
          },
        ],
      },

      // ------------------------------------------------------------------ FRIDAY (TODAY IS TOMORROW)
      nadia: {
        title: 'FRIDAY — 7:35 AM — Nadia\'s Kitchen',
        art: '🥐🩺',
        mood: 'dawn',
        scene: 'kitchen',
        text: [
          '**FRIDAY.** Today is tomorrow now. There\'s only one timeline left, and you\'re standing in it.',
          'Nadia\'s kitchen is spotless in the way of someone who is never home. She\'s still in her scrubs, eating a croissant standing up, eyes red-rimmed from twelve hours of other people\'s worst nights.',
          say('Nadia Okoro', 'Go on, then. What\'s happened. You\'ve got your *I broke something* face on. You\'ve had it since you were six.'),
          'Your big sister. She sets bones and talks drunks down and once diagnosed a heart attack in a queue at Tesco. She believes in blood tests and nothing else.',
          s => fray(s),
        ],
        choices: [
          {
            text: 'Show her the phone and play the voice note',
            hint: 'She trusts evidence. Give her evidence.',
            art: '🎙️',
            fx: 'glitch',
            set: ['nadia_ally'],
            effect: px(1),
            outcome: [
              'She listens with her nurse face on, the one that gives nothing away. Your voice, a day older, says her name. Says *Theo was coming to get Nadia*. In the background, a tannoy calls for a porter to Resus.',
              say('Nadia Okoro', 'That\'s our tannoy. That\'s Gwen. Gwen does nights on Fridays.'),
              'She puts the croissant down. Her hand is shaking, very slightly, which you have never once seen it do.',
              say('Nadia Okoro', 'Right. I don\'t believe in this. But I\'ll be outside the main gate at nine, and if I see Gerald coming, I\'m calling Theo and telling him to pull over. That\'s all I\'m promising.'),
              'The kitchen clock on the wall ticks backwards for one second. You both see it. Neither of you says anything.',
            ],
            next: 'cafe2',
          },
          {
            text: 'Ask her to look up a man called Danny Hale',
            hint: 'Marcus said nobody remembers his brother. Records don\'t lie.',
            art: '🗂️',
            if: 'c_marcus',
            set: ['nadia_ally'],
            outcome: [
              'She gives you a look, but she logs into the hospital system on her phone. *Hale, Daniel.* She frowns.',
              say('Nadia Okoro', 'That\'s weird. There\'s a record. Admitted to us seven years ago, Calder Junction, road traffic collision. But every field is blank. No date of birth. No address. No notes. It\'s like someone made a file for a person and then took the person out.'),
              'You tell her about Marcus. About the table. About the phone. You don\'t play the voice note. You don\'t have to: she\'s staring at the empty record like it\'s a ghost.',
              say('Nadia Okoro', 'I\'ll be at the main gate at nine. If I see Theo, I ring him and I make him pull over. I\'m not saying I believe you. I\'m saying I\'m not risking it.'),
            ],
            next: 'cafe2',
          },
          {
            text: 'Just ask her to get a cab tonight',
            hint: 'Keep the weirdness out of it. One simple favour.',
            art: '🚕',
            outcome: [
              say('Nadia Okoro', 'A cab? From St Anne\'s on a Friday night? Do you know what they charge? Theo offered. Theo is free. Theo is getting paid in curry.'),
              'You push. She narrows her eyes.',
              say('Nadia Okoro', 'If you two have had a fight, sort it out yourselves. I\'m not your excuse. Go home. I\'m going to sleep for nine hours.'),
              'She closes the door gently in your face, the way only a big sister can.',
            ],
            next: 'cafe2',
          },
        ],
      },

      cafe2: {
        title: 'FRIDAY — 4:12 PM — The Window Table',
        art: '☕🕓',
        mood: 'fog',
        weather: 'rain',
        scene: 'cafe',
        text: [
          'Twenty-four hours later, to the minute. You\'re back at the Kettle & Crumb because you don\'t know where else to be.',
          'You spent the day doing small, ordinary things very carefully, the way you carry a too-full cup. You walked the long way round. You checked the road twice at every crossing. You texted Theo a picture of a dog, then another, then a third, until he replied *are you having a stroke* and you could breathe again.',
          'The clock above the counter says 4:12. But now, for the first time you can remember, the second hand is moving.',
          s => (frayed(s)
            ? 'Lou\'s name badge says LEW. The walls are yellow; you\'re almost sure they used to be green. The window table has no wobble, and that, somehow, is the most frightening thing of all.'
            : say('Lou', 'Back again! Usual? You look like death warmed up, pet. No offence. I\'d look like that if I had two phones. One\'s plenty.')),
          'The man in the grey jacket is at the counter. Same coffee. Same seat. He lifts two fingers at you, a tiny salute.',
          'Tonight is the night. Five hours to the junction.',
        ],
        choices: [
          {
            text: 'Sit down across from the man in the grey jacket',
            hint: 'He knows more than he\'s said. Make him say it.',
            art: '🧥',
            if: '!c_marcus',
            set: ['c_marcus'],
            outcome: [
              'He doesn\'t seem surprised. He just pushes the sugar bowl aside so you have room.',
              say('Marcus Hale', 'Marcus. My brother was Danny. Seven years ago I found a phone on that table, messages from me a day ahead. Danny was going to die at Calder Junction. I saved him. I sent forty-one messages and told everyone I knew.'),
              say('Marcus Hale', 'And I kept the phone. I never put it back. Whatever\'s left on that table at closing turns up at 4:12 the day before. That\'s how it starts. If you don\'t close the circle, the world does it for you. It closed mine by taking Danny out of it. Not dead. Gone. Never born. I\'m the only one who remembers.'),
              'He looks at the two phones by your hand.',
              say('Marcus Hale', 'I didn\'t leave it for you. You\'ll leave it for you. Say less than you want to. Then put it back.'),
            ],
            next: 'fri_evening',
          },
          {
            text: 'Ask Marcus what he\'d do differently',
            hint: 'He\'s lived this. Ask for the one thing he\'d change.',
            art: '🧥',
            if: 'c_marcus',
            effect: px(-1),
            outcome: [
              'He thinks about it for so long you wonder if he heard.',
              say('Marcus Hale', 'I\'d stop touching it. Every message, every person you tell, it\'s like pulling a thread in a jumper. Stop pulling and it settles. A little.'),
              'He reaches across, turns the stranger\'s phone face down, and leaves his hand on it for a second, like he\'s calming an animal.',
              say('Marcus Hale', 'And afterwards, if you get an afterwards, you come back here before Lou closes, and you put it back exactly how you found it. Exactly. Not one word added.'),
              'Something in the room loosens. The rain on the window sounds like ordinary rain again.',
            ],
            next: 'fri_evening',
          },
          {
            text: 'Ask Lou exactly what she saw yesterday',
            hint: 'She notices everything. Get her to remember.',
            art: '☕',
            set: ['c_lou'],
            outcome: [
              say('Lou', 'Yesterday? Right, so I wiped the table at four. Then at twelve past, the door didn\'t even go, and you were just there, in your green coat, putting a phone down. Then you weren\'t. Then you walked in the door all damp like you\'d just got off the tram.'),
              say('Lou', 'And here\'s the bit that\'s been bugging me. The one who put it down looked worse than you. Like, *a lot* worse. Like they\'d been up all night in a hospital.'),
              'She hands you your flat white and puts an extra biscuit on the saucer without saying anything, which is how Lou says *I\'m worried about you.*',
            ],
            next: 'fri_evening',
          },
          {
            text: 'Send one last message ahead to tonight',
            hint: 'Maybe Friday-night you knows something new.',
            art: '⌨️',
            fx: 'glitch',
            effect: px(1),
            outcome: [
              'You open the thread. *Is it different this time? Is he okay?* Send.',
              'One tick. Then the tick goes grey. Then the message reads *Delivered* to a time that doesn\'t exist: **Fri 25:61**.',
              'The café lights dim and swell. At the counter, Marcus closes his eyes. Lou drops a saucer and stares at the floor like she\'s never seen it before. Nothing comes back. Nothing ever will. Tonight hasn\'t been written yet, and you just leaned on the page.',
            ],
            next: 'fri_evening',
          },
        ],
      },

      fri_evening: {
        title: 'FRIDAY — 8:41 PM — The Flat',
        art: '🧥🦆',
        mood: 'night',
        weather: 'rain',
        scene: 'apartment',
        text: [
          'Theo is putting his coat on. Of course he is.',
          s => {
            if (s.has('keys') && s.has('told_theo')) return 'He knows. He gave you the keys himself. He\'s going to get the 9:10 bus, which stops on the far side of Calder Junction, and walk across to the hospital gate. He keeps glancing at you like you might vanish.';
            if (s.has('keys')) return 'He\'s been searching for the rubber duck all afternoon. He\'s given up. He\'s getting the 9:10 bus, which stops on the far side of Calder Junction, and walking across to the hospital gate. The duck is in your pocket, warm as a heartbeat.';
            if (s.has('told_theo')) return 'He knows. He\'s scared and pretending not to be, which means he\'s doing more jokes per minute than usual. He has the rubber-duck keys in his hand. He\'s going to drive Gerald to the hospital. He promised he\'d watch for you.';
            return 'He doesn\'t know. He\'s jangling the rubber-duck keys and doing a little dance in the hallway. He\'s going to drive Gerald to St Anne\'s, through Calder Junction, at about a quarter past nine.';
          },
          say('Theo Vance', 'Right. Off to fetch your terrifying sister. Want anything? Curry? A will? Ha. Ha. Ha.'),
          { if: 'nadia_ally', text: 'Your phone buzzes. Nadia: *At the gate from 9. Watching for Gerald.*' },
          s => fray(s),
          'Calder Junction. 9:14. It\'s thirty-three minutes away, and you have to decide where to be standing when it comes.',
        ],
        choices: [
          {
            text: 'Get in the car with him',
            hint: 'If something happens, it happens to both of you. And you can reach the handbrake.',
            art: '🚗',
            if: '!keys',
            set: ['ride'],
            outcome: [
              'You grab your coat and get in the passenger seat before he can argue. Gerald smells of old chips and pine air freshener. The radio comes on mid-song.',
              say('Theo Vance', 'A passenger! I never get passengers! Seatbelt. I\'m very responsible now. I\'m a changed man.'),
              'He pulls out into the rain. The windscreen wipers beat like a metronome. You watch the clock on the dashboard: 9:05. 9:08. 9:11.',
            ],
            next: 'junction_car',
          },
          {
            text: 'Give him the keys back and ride with him',
            hint: 'The bus drops him on foot right in the junction. Better he\'s in the car, with you.',
            art: '🦆',
            if: 'keys',
            set: ['ride'],
            unset: ['keys'],
            outcome: [
              'You take the rubber duck out of your pocket and put it in his hand.',
              say('Theo Vance', 'I KNEW it! I knew it was you! Ducks always come home!'),
              'You tell him you\'re coming too. He doesn\'t argue. Gerald smells of old chips and pine air freshener. The wipers beat like a metronome. You watch the dashboard clock: 9:05. 9:08. 9:11.',
            ],
            next: 'junction_car',
          },
          {
            text: 'Go ahead to the junction alone and wait for him there',
            hint: 'Be on the corner when he arrives. See it coming.',
            art: '🏃',
            outcome: [
              'You hug him in the hallway, too hard and too long. He pats your back, baffled.',
              say('Theo Vance', 'Alright. Alright. I\'m only going to the hospital. I\'ll be back with a curry before you can miss me.'),
              'You leave first. You take the tram, eleven stops, and get off at the twelfth. Calder Junction at night is all wet tarmac and red light. You plant yourself on the island in the middle, by the railing with the flowers on it. It\'s 9:11.',
            ],
            next: 'junction',
          },
        ],
      },

      junction: {
        title: 'FRIDAY — 9:14 PM — Calder Junction',
        art: '🚦🚐',
        mood: 'neon',
        weather: 'rain',
        scene: 'city-night',
        fx: 'heartbeat',
        timer: 8,
        text: [
          'You\'re on the island in the middle of Calder Junction, by the railing with the flowers. The hospital clock tower says 9:13. Rain bounces off the road like static.',
          s => fray(s),
          s => {
            if (s.has('keys')) return 'There. On the far pavement: Theo, hood up, getting off the 9:10 bus. He steps off the kerb to cross towards the hospital, head down against the rain. And from the left, down the hill, a white van, far too fast, not slowing.';
            return 'There. The duck-blue hatchback, coming up to the lights. Gerald. The light turns green for him. And from the left, down the hill, a white van, far too fast, its driver looking down at something in his lap.';
          },
          { if: 'nadia_ally', text: 'On the far corner, at the hospital gate, a figure in scrubs is already lifting a phone to her ear.' },
          '**Now.**',
        ],
        timeout: {
          text: 'You froze.',
          fx: 'redflash',
          outcome: [
            'You see it all, and you can\'t move. It\'s exactly like the voice note. It\'s exactly like the corridor. You were always going to be standing here watching.',
            'The sound is the one you heard two streets away in the draft of this night. This time you\'re close enough to feel it in your chest. Your phone slips out of your hand and skids across the kerb.',
          ],
          next: 'resolve',
        },
        choices: [
          {
            text: 'Scream his name',
            hint: 'Make him look at you, not the road.',
            art: '📣',
            effect: (s) => { if (s.has('told_theo') || s.has('keys') || s.has('nadia_ally')) s.set('saved'); },
            outcome: [
              'You scream his name loud enough to tear something in your throat.',
              s => {
                if (!s.has('saved')) return 'Through the rain and the windscreen, he can\'t hear you. He doesn\'t know to look. Gerald rolls into the junction, and the white van doesn\'t brake. Your phone slips out of your hand and skids across the kerb.';
                if (s.has('keys')) return 'Theo, on foot, hears you over the rain. He stops dead on the kerb and looks up, grinning, about to wave. The white van screams past through the space where he would have been, clips the railing on the island, and spins to a stop against a bollard.';
                if (s.has('told_theo')) return 'Theo is watching for you, the way he promised. He sees you on the island waving like a lunatic, and he stops. Green light, horns behind him, and he just stops. The white van blows through the red in front of him and spins to a stop against a bollard.';
                return 'On the far corner, Nadia has already rung him. Theo\'s phone lights up on the dashboard, *NADS*, and he pulls in to answer it, short of the line. The white van blows through the red where Gerald would have been and spins to a stop against a bollard.';
              },
              s => (s.has('saved') ? 'You realise you\'ve dropped your phone. It skidded across the kerb when you started waving. It\'s lying in the gutter, face down.' : null),
            ],
            next: 'resolve',
          },
          {
            text: 'Run into the road',
            hint: 'Get between him and the van. Whatever it costs.',
            art: '🏃',
            fx: 'shake',
            set: ['hit'],
            outcome: [
              'You don\'t decide. You\'re already moving, off the island and into the road with your arms out, into the headlights.',
              'The van driver sees you. He swerves, hard, away from Theo and towards the railing, and the corner of the van catches you on the way past. It\'s like being hit by a wall. You\'re in the air, and then you\'re on wet tarmac looking at the sky, and your phone is skidding away across the kerb.',
              'The last thing you hear before the dark is Theo, very close, saying your name over and over.',
            ],
            next: 'resolve',
          },
          {
            text: 'Hit the crossing button. It\'s the 9:14 cycle.',
            hint: 'You timed it yesterday. Every light goes red for nine seconds.',
            art: '🔴',
            if: 'mapped',
            set: ['saved'],
            outcome: [
              'You lunge for the button on the island pole and slam it with the flat of your hand. Every light in Calder Junction snaps to red at once, all five roads, a ring of red like a held breath.',
              'Theo stops at the line, because Theo always stops at red, even at three in the morning. The white van doesn\'t. It barrels through the empty junction, clips the railing beside you hard enough to shake the flowers loose, and spins to a stop against a bollard. Your phone jolts out of your hand and skids across the kerb.',
            ],
            next: 'resolve',
          },
        ],
      },

      junction_car: {
        title: 'FRIDAY — 9:14 PM — Calder Junction, in the car',
        art: '🚗🚐',
        mood: 'neon',
        weather: 'rain',
        scene: 'city-night',
        fx: 'heartbeat',
        timer: 8,
        text: [
          'Gerald rolls up to the lights at Calder Junction. Red. The long red. Theo drums on the wheel and sings along with the radio, and the hospital clock tower on the far corner says 9:13.',
          s => fray(s),
          'The light turns green. Theo\'s foot moves to the accelerator. And out of the corner of your eye, from the left, you see headlights: a white van coming down the hill far too fast, not slowing, not even trying to slow.',
          { if: 'nadia_ally', text: 'On the far corner, at the hospital gate, a figure in scrubs is lifting a phone to her ear. Theo\'s phone starts buzzing in the cup holder. He doesn\'t look at it. He\'s driving.' },
          '**Now.**',
        ],
        timeout: {
          text: 'You froze.',
          fx: 'redflash',
          outcome: [
            'You see it all, and you can\'t move. It\'s exactly like the voice note. It\'s exactly like the corridor. You were always going to be sitting here watching.',
            'Gerald rolls forward into the green. The sound is the one you heard two streets away in the draft of this night, only now it\'s inside the car with you. Your phone flies out of your lap and skids across the kerb.',
          ],
          next: 'resolve',
        },
        choices: [
          {
            text: 'Yank the handbrake',
            hint: 'Lock the wheels. Keep Gerald out of the junction.',
            art: '🛑',
            effect: (s) => s.set(s.get('paradox') <= 3 ? 'saved' : 'hit'),
            outcome: [
              s => (s.has('saved')
                ? 'You lunge across and haul the handbrake up with both hands. Gerald shudders and stalls with his nose an inch over the white line. Theo yells something with a lot of vowels.'
                : 'You lunge for the handbrake and your hand closes on nothing. It isn\'t where it was. It\'s on the other side of the gearstick, the way it was in a different car in a different world. You grab it a half-second late, and Gerald slides into the junction.'),
              s => (s.has('saved')
                ? 'The white van screams past in front of you, so close the wing mirror folds flat against the window. It clips the railing on the island, spins, and stops dead against a bollard, nobody hurt, its driver staring at his phone in his lap like it bit him.'
                : 'The white van catches your side of the car. Glass, noise, the world turning over once, slowly. Theo\'s hand finds yours. Your phone flies out of your pocket and skids across the kerb.'),
              s => (s.has('saved') ? 'Your phone has fallen out of your pocket in the jolt. It\'s lying in the gutter by the open door, face down, where it skidded across the kerb.' : null),
            ],
            next: 'resolve',
          },
          {
            text: '"Theo. Wait. Please. Just this once."',
            hint: 'No grabbing. Just ask him. He has to trust you.',
            art: '🤲',
            effect: (s) => { if (s.has('told_theo')) s.set('saved'); },
            outcome: [
              s => (s.has('saved')
                ? 'He looks at you. He knows. He keeps his foot on the brake while the light stays green and the car behind starts honking. Three seconds. Four.'
                : 'He laughs. *Wait for what? It\'s green!* He doesn\'t know what you know. You never told him. His foot comes down, and Gerald rolls forward into the junction.'),
              s => (s.has('saved')
                ? 'The white van blows straight through the red in front of you, clips the railing and spins to a stop against a bollard. Theo is still holding the wheel at ten and two. You open the door to be sick, and your phone slides out of your lap and skids across the kerb.'
                : 'The white van doesn\'t stop. Your phone flies out of your hand and skids across the kerb, and then there is only noise.'),
            ],
            next: 'resolve',
          },
        ],
      },

      resolve: {
        redirect: (s) => {
          if (s.get('paradox') >= 5) return 'end_unwritten';
          if (!s.has('saved') && !s.has('hit')) return 'end_crash';
          if (s.has('hit') || s.get('paradox') >= 4) return 'end_price';
          return 'aftermath';
        },
      },

      aftermath: {
        title: 'FRIDAY — 9:31 PM — After',
        art: '🚨🫂',
        mood: 'night',
        weather: 'rain',
        scene: 'street',
        text: [
          'Blue lights. A small crowd. The van driver sitting on the kerb with his head in his hands, his phone confiscated by a very angry nurse in scrubs who appeared from nowhere.',
          'Theo is alive. He is wet, and furious, and alive. He keeps touching his own face as if to check.',
          say('Theo Vance', 'That was... you... the van... I owe you a curry. I owe you all the curries. I owe you a kidney.'),
          'You pick your phone up out of the gutter. You turn it over.',
          s => (s.has('c_scratch')
            ? 'The long silver scratch from corner to camera. And at the bottom, fresh and bright from the kerb, a **second line**, branching off. A little **Y**. Exactly like the phone you found on the table. Exactly.'
            : 'The scratch on the back has a new branch in it from the kerb. You barely notice.'),
          s => (secretReady(s)
            ? 'And then you understand. Marcus said it: *it came from you.* There was never a stranger\'s phone. There\'s one phone. It\'s been in two places for a day. And it\'s 9:31, and the Kettle & Crumb closes at midnight.'
            : 'The stranger\'s phone in your other pocket is quiet. The thread from **Me** just sits there, finished.'),
        ],
        choices: [
          {
            text: 'Take Theo home',
            hint: 'He\'s alive. That\'s the whole point. Go home.',
            art: '🏠',
            outcome: [
              'You get the bus home, all three of you, because nobody wants to get in a car. Nadia sits on Theo\'s other side and checks his pupils every four minutes whether he likes it or not.',
              'Back at the flat, Theo orders the biggest curry the takeaway has ever made. You eat it on the roof in two camping chairs while Nadia sleeps on the sofa downstairs.',
            ],
            next: 'end_saved',
          },
          {
            text: 'Run back to the café before Lou locks up',
            hint: 'One phone. Two places. Someone has to put it on the table.',
            art: '☕',
            if: (s) => secretReady(s),
            outcome: [
              'You tell Theo you\'ll explain later. You tell Nadia to sit on him. You run for the tram.',
              'Eleven stops. You count them. Both phones are in your hands, one in each, and they feel like the two halves of something.',
              'You think about Thursday-you, about to sit down at that wobbly table, about to look down and see it. You remember how scared you were. You want to tell them it\'s going to be alright. You don\'t. You know exactly how many words you get, and you\'ve already used them.',
            ],
            next: 'loop_cafe',
          },
          {
            text: 'Go back to the café and look for Marcus',
            hint: 'He might know what happens now.',
            art: '🧥',
            if: (s) => !secretReady(s),
            outcome: [
              'The Kettle & Crumb is closing. Lou is putting the chairs up. Marcus is at the counter with a coffee he hasn\'t drunk.',
              s => (s.has('c_marcus')
                ? say('Marcus Hale', 'You saved him. Good. Did it change? The scratch? Did you put it back?')
                : say('Marcus Hale', 'You saved him. Good. Then go home. And don\'t sit at that table again.')),
              s => (s.has('c_marcus') ? 'You don\'t know what he means. He looks at you for a long moment, then sighs, and turns his coffee cup round on its saucer. *Go home*, he says. *Hug him.*' : 'Above the counter, the clock is stuck at 4:12 again.'),
            ],
            next: 'end_saved',
          },
        ],
      },

      loop_cafe: {
        title: 'FRIDAY — 11:52 PM — Closing Time',
        art: '📱☕🕓',
        mood: 'night',
        scene: 'cafe',
        text: [
          'Lou is mopping. The chairs are up on the tables, all except one. Your table. The window table. It\'s been wiped and left clear, like it was waiting.',
          say('Lou', 'We\'re shut, pet. Oh. It\'s you. You look...'),
          'She stops. She looks at your face, then at the table, then at your face again, and you watch her put it together, a whole day early.',
          say('Lou', 'You look like the one who put it down.'),
          'Marcus is in the corner seat, coat on, watching. He doesn\'t say a word. He doesn\'t need to.',
          'Two phones, both with a Y in the scratch. You unlock yours. You open the thread called **Me**. One line. One voice note. Thirteen seconds. Exactly as you found it. Exactly as you sent it.',
          'The clock above the counter: 11:52. The second hand is moving.',
        ],
        choices: [
          {
            text: 'Leave it exactly as you found it',
            hint: 'Face up. Same code. Same thread. Not one word added.',
            art: '🔁',
            outcome: [
              'You put your phone on the window table, face up, by the place where your flat white will be. You don\'t add anything. You don\'t delete anything. Your hand doesn\'t want to let go, and you let go anyway.',
              'You look down at the other phone in your other hand, the one you found. It isn\'t there. Your hand is empty. It was only ever one phone, and now it\'s in the only place it was always going to be.',
              'Above the counter, the second hand stops. 11:52. Then, with a small click, it jumps backward to **4:12**, and stays.',
            ],
            next: 'end_loop',
          },
          {
            text: 'Add one more line first: "Tell Theo sooner."',
            hint: 'Just one. A kindness to yourself. What could it hurt?',
            art: '⌨️',
            fx: 'glitch',
            set: ['loop_fail'],
            outcome: [
              'One line. Barely anything. *Tell Theo sooner.* You type it into the thread under the rest, and put the phone down.',
              'Marcus stands up in the corner. *No*, he says, quietly, too late.',
              'The phone just sits there on the table. Lou mops round it. At midnight she turns off the lights and it is still there, glowing. The thread is different now from the one you found. It isn\'t the same phone anymore, so it can\'t be that phone. The loop doesn\'t take it. You put it in your pocket and walk home with it, heavier than it should be.',
            ],
            next: 'end_saved',
          },
        ],
      },

      // ------------------------------------------------------------------ ENDINGS
      end_saved: {
        title: 'SATURDAY — 2:10 AM — The Roof',
        art: '🍛🌃',
        mood: 'night',
        weather: 'stars',
        scene: 'rooftop',
        ending: { id: 'the-long-red', title: 'The Long Red', type: 'good' },
        text: [
          'Two camping chairs. One enormous curry. Theo alive, with sauce on his chin, talking with his mouth full about the van, the lights, the duck, the fact that he is now basically immortal.',
          s => (s.has('told_theo')
            ? say('Theo Vance', 'You told me. You told me and you didn\'t have to. You could\'ve just nicked my keys and looked mysterious. Thank you for not doing that.')
            : say('Theo Vance', 'You knew. Didn\'t you? You knew something. You\'ve been weird for two days. One day, when I\'m old and boring, you\'re going to tell me.')),
          { if: 'nadia_ally', text: 'Nadia texts at 2:15: *He\'s fine. Pupils equal and reactive. I still don\'t believe you. Thank you.* From Nadia, that\'s practically a poem.' },
          s => (s.has('loop_fail')
            ? 'In your pocket, the stranger\'s phone is warm and won\'t switch off. You\'ll keep it in a drawer for years. Sometimes, late at night, the clock on its screen says 4:12 and the thread from **Me** gets one message longer. You never open it.'
            : 'In your pocket, the stranger\'s phone has gone quiet. The thread from **Me** is still there. Somewhere, somehow, a circle is still open. Tonight you are too happy to care.'),
          'Around three, Theo goes quiet, which he never does. Then he says, to the sky rather than to you: *If you ever get a text from tomorrow saying I\'m an idiot, believe it.* You promise you will. He holds out his little finger. You hook yours round it, like you\'re nineteen again.',
          'The city hums below you. Calder Junction is a tiny red dot in the distance, turning green, turning red, ordinary again.',
        ],
      },

      end_price: {
        title: 'SATURDAY — Somewhere After',
        art: '🩹🌅',
        mood: 'dawn',
        scene: 'dawn',
        ending: { id: 'price-of-9-14', title: 'The Price of 9:14', type: 'neutral' },
        text: [
          s => (s.has('hit')
            ? 'You wake up in St Anne\'s, in a bed in the corridor you sat in during the draft of this night. Your leg is in plaster from hip to ankle. Something in your ribs complains every time you breathe.'
            : 'Theo is alive. The van missed him by a hand\'s width. You know that, because you\'re standing at the junction afterwards with your heart in your mouth, watching him laugh with the paramedics. But something is wrong, and it takes you all weekend to work out what.'),
          s => (s.has('hit')
            ? 'Theo is asleep in the chair beside you, folded up in a way that will hurt tomorrow, still holding your hand. Not a scratch on him. Nadia comes in with a clipboard and shouts at you for a full minute, then cries for a full minute, then checks your chart.'
            : 'The photo on the fridge, the one of you and Theo at nineteen on the pier, is gone. Not taken down. Gone. Theo remembers meeting you at twenty-one, at a party, two years later than you did. The pier never happened. The world took two years of your friendship and patched the hole so neatly he\'ll never notice.'),
          s => (s.get('paradox') >= 4
            ? 'The paradox didn\'t tear the world. But it took its fee. Marcus warned you. Every word costs.'
            : 'You traded yourself for him, on purpose, in the road. You\'d do it again. You\'d do it every time.'),
          'You saved him. The price was yours to pay. On the bad days, you tell yourself that\'s a fair trade. On the good days, you don\'t have to tell yourself anything.',
        ],
      },

      end_crash: {
        title: 'FRIDAY — 11:48 PM — St Anne\'s A&E',
        art: '🏥🕯️',
        mood: 'office',
        scene: 'corridor',
        fx: 'glitch',
        ending: { id: 'nine-fourteen', title: 'Nine Fourteen', type: 'bad' },
        text: [
          'Plastic chairs. A vending machine that\'s been out of crisps for a year. Nadia in her scrubs beside you, her lanyard still on.',
          'You\'ve been here before. You know this corridor. You know the tannoy will call a porter to Resus in a moment, and it does. You know what Nadia is going to say, and she says it.',
          say('Nadia Okoro', 'He was coming to get me.'),
          s => (s.has('ride') ? 'You were in the car. You were right there. You could reach him, and you didn\'t reach him in time, and now there\'s glass in your hair you keep finding.' : 'You were right there on the island. Ten metres. It might as well have been ten miles.'),
          'Your phone is in your hand. It\'s 11:48. The scratch on the back has a fresh new branch from the kerb, a little Y. The thread called **Me** is open, and the cursor is blinking, and somewhere behind you, it\'s Thursday afternoon.',
          'You start to type. You already know the words. It was always going to be this. Maybe next time you\'ll read them differently.',
        ],
      },

      end_unwritten: {
        title: '—:— — Nowhere',
        art: '🌀',
        mood: 'void',
        scene: 'void',
        fx: 'glitch',
        ending: { id: 'unwritten', title: 'Unwritten', type: 'death' },
        text: [
          'It starts at 9:14 exactly. The junction goes quiet: no rain, no engines, no Theo, no van. Just the lights, changing colour on their own, red, green, a colour without a name.',
          'Then your hands. You hold them up and you can see the road through them.',
          'You pulled too many threads. Every message, every person you told, every word you sent across the gap. The day couldn\'t hold two of you and all those words. Something had to give, and the world, like Marcus said, closes its own circles.',
          { if: 'flood', text: 'You think of the wall of messages you sent from the hospital corridor. Forty-one, Marcus sent. You stopped counting.' },
          'Theo will be fine. He\'ll pick Nadia up and they\'ll get curry. Nadia will be an only child. Theo will live alone in a flat with a spare room he always meant to rent out. Neither of them will know why the roof has two camping chairs.',
          'At the Kettle & Crumb, a man in a grey jacket looks up at the stopped clock, and for a moment he remembers somebody in a green coat, and then he doesn\'t.',
        ],
      },

      end_smash: {
        title: 'MONDAY — 8:00 AM — The Kitchen',
        art: '📵☕',
        mood: 'sunny',
        scene: 'kitchen',
        ending: { id: 'face-down', title: 'Face Down', type: 'neutral' },
        text: [
          'You never find out.',
          'Friday comes. You don\'t go to the junction. You don\'t go to the café. You sit in the flat with the curtains closed, and at 9:14 PM you are staring at your own phone, waiting for it to ring with the worst news of your life.',
          'At 9:40 Theo walks in the door with a curry and a story. Gerald has a new dent in his bumper. *Some lunatic in a van nearly took me out at Calder Junction,* he says. *Missed me by a mile. Well. A foot. Well. An inch.*',
          'You laugh so hard you cry, and he doesn\'t understand why, and you never tell him.',
          'Was the phone ever real? Would he have died? Did smashing it save him, or did nothing you did matter at all? Some Mondays you wonder. Most Mondays you just make the coffee, and he steals your toast, and you let him.',
          { if: 'c_marcus', text: 'You never sit at the window table again. Sometimes you see a man in a grey jacket through the café glass, and he lifts two fingers to you, and you lift two back.' },
        ],
      },

      end_loop: {
        title: 'FRIDAY 11:53 PM / THURSDAY 4:12 PM — The Window Table',
        art: '📱🔁☕',
        mood: 'dawn',
        scene: 'cafe',
        ending: { id: 'closing-time', title: 'Closing Time', type: 'secret' },
        text: [
          'Somewhere a day behind you, it\'s Thursday afternoon and raining. Lou is wiping the window table. She turns round to do the milk. When she turns back, someone in a green coat is putting a phone down, very carefully, face up.',
          'Then the door opens, and you walk in, damp from the tram, and sit down, and put your own phone next to your flat white. And there it is.',
          'You\'re home before one. Theo is asleep on the sofa with a curry carton on his chest. Nadia texts: *Did you put it back?* You don\'t remember telling her about putting it back. You text: *Yes.*',
          'In the morning, the stopped clock at the Kettle & Crumb is ticking. Lou swears blind it started on its own. And Marcus, at the counter in his grey jacket, has a photograph on the table in front of him, an old one, slightly creased, that he swears wasn\'t in his wallet yesterday.',
          say('Marcus Hale', 'His name was Danny. Is. Is Danny.'),
          'A circle closed properly gives something back. Nobody tells you that. You find out on a Saturday, at a café table, watching a grown man cry over a photo of a boy on a motorbike.',
          'There was only ever one phone. It just needed a day to get home.',
        ],
      },
    },
  });
})();
