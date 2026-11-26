/* MysteryFate story: Letters to 2046 (drama) - a life told in decade jumps, one letter at a time */
(function () {
  'use strict';

  // ---- helpers ----
  const clamp = (n) => Math.max(0, Math.min(5, n));
  // Adjust the two HUD meters (closeness to Wren, regret), clamped to 0..5.
  const bump = (close, regret) => (s) => {
    s.setVar('closeness', clamp(s.get('closeness') + close));
    s.setVar('regret', clamp(s.get('regret') + regret));
  };
  const CL = (s) => s.get('closeness');
  const RG = (s) => s.get('regret');

  // Which of your letters came back early, and when (Wren decides; you don't know that yet).
  const ARRIVE16 = (s) => s.has('confess06') || s.has('promise06');
  const ARRIVE26 = (s) => s.has('torn16') || s.has('warn06');
  const TOGETHER = (s) => s.has('together16');
  const LIES = (s) => s.count('lie96', 'lie06', 'lie16');

  // The secret: the truth at ten, the truth you tore up at thirty, and an answer in her own code at forty.
  const SECRET = (s) => s.has('confess96') && s.has('torn16') && s.has('stamp26');

  // 2046: the letter is open. Where does your life land?
  const FINALE = (s) => {
    if (s.has('go46') && SECRET(s)) return 'end_stamps';
    if (LIES(s) >= 2 && !s.has('go46')) return 'end_unknown';
    if (CL(s) <= 1) return 'end_return';
    if (s.has('go46') && CL(s) >= 4 && RG(s) <= 2) return 'end_true';
    if (!s.has('keep46') && CL(s) >= 3) return 'end_first';
    return 'end_postage';
  };

  // Your ten-year-old letter, quoted back to you.
  const LETTER96 = (s) =>
    s.has('confess96') ? `*Dear Me in 2046. I am going to mary Wren Adeyemi. This is a FACT. If you are reading this and you didn't, what happened??? DO NOT READ THIS WREN.*`
      : s.has('promise96') ? `*Dear Me in 2046. I promise I will still be best friends with Wren when I am 60. Pinky promise. That is the strongest promise there is. You can't break it, I checked.*`
        : s.has('lie96') ? `*Dear Me in 2046. Hello from the past! By now you are an astronaut and you are very rich and you have a dog called Laser. Say hi to the moon for me.*`
          : `*Dear Me in 2046.* And then nothing. Your name, a date, and a page of white where a ten-year-old didn't know who they were going to be.`;

  registerStory({
    id: 'letters-2046',
    title: 'Letters to 2046',
    category: 'drama',
    tagline: 'Every ten years you write to your future self. The last letter isn\'t from you.',
    description:
      'In 1996, Mrs. Pell\'s class buries a time capsule of letters to be opened in 2046. You keep the habit: one letter every ten years, to the person you\'ll be at sixty. Promises, warnings, confessions, lies. Some letters arrive early. Some arrive at exactly the wrong moment. One you never sent arrives anyway.',
    cover: '✉️',
    accent: '#4caf7d',
    ambient: 'drama',
    scene: 'house',
    warning: 'Contains: a parent\'s stroke and later death (off-page), hospital scenes, lost time, and a great deal of green ink.',
    vars: { closeness: 2, regret: 1 },
    flags: [],
    hud: [
      { var: 'closeness', label: 'Closeness', icon: '💚', max: 5 },
      { var: 'regret', label: 'Regret', icon: '🕰️', max: 5 },
    ],
    voices: {
      narrator: { gender: 'female', pitch: 0.95, rate: 0.95, accent: 'en-GB', note: 'warm, wry, a friend reading old letters aloud at a kitchen table' },
      'Young Wren': { gender: 'female', pitch: 1.35, rate: 1.2, accent: 'en-GB', note: 'ten years old, bossy, fearless, green gel pen behind one ear' },
      'Wren': { gender: 'female', pitch: 1.05, rate: 1.05, accent: 'en-IE', note: 'grown-up Wren: quick, dry, kind, a teacher who has heard every excuse' },
      'Mum': { gender: 'female', pitch: 0.85, rate: 0.9, accent: 'en-GB', note: 'postwoman, unhurried, says more with a kettle than most people say with words' },
      'Mrs. Pell': { gender: 'female', pitch: 0.8, rate: 0.85, accent: 'en-AU', note: 'Year 6 teacher, theatrical, fond of Victorian trivia' },
      'You': { gender: 'neutral', pitch: 1.0, rate: 1.0, note: 'the player' },
    },
    start: 'y96_class',
    scenes: {
      /* ================================================================== 1996 */
      y96_class: {
        title: 'Millbrook Primary, Year 6',
        stamp: '1996 · Age 10',
        scene: 'library',
        art: '✏️📮',
        mood: 'sunny',
        weather: 'dust',
        text: [
          `It's the last week of June and the classroom roof is leaking again, so Year 6 has been moved into the school library, between the encyclopaedias and a poster of a cat that says HANG IN THERE.`,
          { speaker: 'Mrs. Pell', say: `Letters to 2046! Fifty years from now, the school will dig up the capsule under the new oak tree and post every letter back to the person who wrote it. You will be sixty. Some of you will be bald. Write something worth reading.` },
          { speaker: 'Mrs. Pell', say: `And a fun fact, since you're all licking stamps. In Victorian times, a stamp stuck on *upside down* was a secret code. It meant *I love you*.` },
          `The class says EWWW as one organism. Beside you, Wren Adeyemi licks a stamp with great seriousness and presses it to the middle of your forehead. Upside down. The class goes feral.`,
          `Wren is your best friend. She has a green gel pen she stole from the bank and writes everything in it, including her maths. She calls you *slowcoach* because you write slower than anyone alive. She looks at you now, very straight, the way she looks at a hard sum.`,
          { speaker: 'Young Wren', say: `Mine's not to me, by the way. My letter. It's to somebody. Not telling. Will we still be friends when we're sixty?` },
        ],
        choices: [
          {
            text: '“Pinky promise. Sixty and beyond.”',
            hint: 'The strongest contract known to Year 6.',
            set: ['pinky'],
            effect: bump(1, 0),
            art: '🤙',
            outcome: [
              `You hook your little finger round hers and squeeze, hard, like you're signing something in blood. Wren nods, satisfied, as though a lawyer has stamped it.`,
              { speaker: 'Young Wren', say: `Sixty and beyond. Witnessed by Mrs. Pell.` },
              { speaker: 'Mrs. Pell', say: `I witnessed nothing. Write your letters.` },
            ],
            next: 'y96_letter',
          },
          {
            text: '“Sixty’s ancient. We’ll be dead.”',
            hint: 'Ten-year-old logic is flawless.',
            set: ['joke96'],
            art: '💀',
            outcome: [
              `“Sixty is basically dead,” you inform her. “My nan's sixty-three and she has a chair that stands you up.”`,
              { speaker: 'Young Wren', say: `I'm going to be alive at sixty out of spite. You'll see. I'll come round your house and be alive at you.` },
              `She says it like a threat. It is, you'll realise much later, the nicest threat anyone has ever made you.`,
            ],
            next: 'y96_letter',
          },
          {
            text: 'Peel the stamp off. Stick it on her. Upside down.',
            hint: 'Two can play the Victorian game.',
            set: ['stamp96'],
            effect: bump(1, 0),
            art: '📮',
            outcome: [
              `You peel the stamp off your forehead, still damp, and press it onto hers. Upside down. Exactly as Mrs. Pell described. You don't think about what it means. You are ten. It means *I win*.`,
              `Wren goes a deep and astonishing red, from her collar to her hairline. Then she peels it off very carefully, so it doesn't tear, and puts it inside her pencil case. She does not explain why.`,
            ],
            next: 'y96_letter',
          },
        ],
      },

      y96_letter: {
        title: 'Millbrook Primary, Before the Bell',
        stamp: '1996 · Age 10 · The first letter',
        scene: 'library',
        art: '✉️',
        mood: 'sunny',
        text: [
          `A sheet of lined paper. An envelope with your name on it in Mrs. Pell's beautiful teacher handwriting. Twenty minutes till the bell.`,
          `*Dear Me in 2046*, you write, slowly, slowcoach-ly. Then you stop. Sixty-year-old you is a stranger. They might have a car. They might live on the moon. They might not like Wren any more, which is impossible, but so is being sixty.`,
          `Mrs. Pell asks for a letter monitor to carry the box out to the oak tree. Wren's hand is up before she's finished the sentence.`,
          `Across the room, the clock does its loud tick. What do you tell the person you're going to be?`,
        ],
        choices: [
          {
            text: 'A promise: you’ll still be best friends with Wren',
            hint: 'Put it in writing. Writing is forever.',
            set: ['promise96'],
            effect: bump(1, 0),
            art: '🤞',
            outcome: [
              `*I promise I will still be best friends with Wren when I am 60.* You underline *promise* three times, then a fourth for luck. It's the most legally binding document you've ever produced.`,
              `You lick the envelope. It tastes of glue and the future.`,
            ],
            next: 'y06_bonfire',
          },
          {
            text: 'A confession: you’re going to marry Wren',
            hint: 'Spelling optional. Courage required.',
            set: ['confess96'],
            art: '💍',
            outcome: [
              `*I am going to mary Wren Adeyemi.* You look at it. It looks wrong. You can't work out why. You decide it's because it's the truth, and the truth always looks a bit wrong written down.`,
              `*DO NOT READ THIS WREN*, you add, in capitals, as a security measure. Then you seal it before you can die of it.`,
            ],
            next: 'y06_bonfire',
          },
          {
            text: 'A lie: you’re a rich astronaut now',
            hint: 'Give sixty-year-old you something to live up to.',
            set: ['lie96'],
            art: '🚀',
            outcome: [
              `*By now you are an astronaut and you are very rich and you have a dog called Laser.* You draw the dog. You draw the rocket. You draw yourself waving from the moon.`,
              `It isn't true. You know it isn't true; you get sick on the swings. But it feels good to tell somebody, even if the somebody is you.`,
            ],
            next: 'y06_bonfire',
          },
          {
            text: 'Nothing. Just your name.',
            hint: 'You don’t know who they’ll be. How can you write to them?',
            set: ['blank96'],
            art: '📄',
            outcome: [
              `You write *Dear Me in 2046*, and your name, and the date. Then you sit with the pen over the page until the bell goes and the page is still white.`,
              `It isn't that you have nothing to say. It's that everything you could say feels too small, or too big, for a stranger who'll be sixty. You fold the blank page in three and seal it anyway.`,
            ],
            next: 'y06_bonfire',
          },
        ],
      },

      /* ================================================================== 2006 */
      y06_bonfire: {
        title: 'Bonfire Night, Millbrook Hill',
        stamp: '2006 · Age 20 · Ten years later',
        jump: 'forward',
        scene: 'village',
        art: '🎆',
        mood: 'night',
        weather: 'embers',
        fx: 'heartbeat',
        text: [
          `You don't remember much about burying the capsule. You remember Wren walking out to it with the box held in both arms like a birthday cake, slowly, much too slowly, at the very back of the line.`,
          `Ten years later, it's Bonfire Night on Millbrook Hill, and the whole village is below you in sparks and woodsmoke. Tomorrow you get the 9:14 to the city and a job that pays actual money. Wren is staying. She's training to be a teacher. At Millbrook Primary, obviously. She says someone has to keep an eye on the oak.`,
          { if: 'pinky', text: `She's wearing a ring made from a bent hairgrip on her little finger. She made it in 1996. *Sixty and beyond.*` },
          { if: 'stamp96', text: `She shows you the inside of her phone case, laughing. There's a stamp in there, faded, stuck in upside down. You don't ask. You don't need to.` },
          { if: 'joke96', text: `She's still alive, she points out. Out of spite. Ten years down, fifty to go.` },
          `The big rockets are going up now, the finale, the ones the council saves for last. Wren turns round to face you. She's not watching the fireworks at all.`,
          { speaker: 'Wren', say: `Right. You're leaving tomorrow and I'm not doing another ten years of wondering. Kiss me or don't, slowcoach. You've got till the last rocket.` },
        ],
        timer: 8,
        timeout: {
          text: 'You wait one second too long.',
          set: ['froze'],
          effect: bump(-1, 1),
          art: '🌫️',
          outcome: [
            `The last rocket climbs, hangs, bursts gold over the whole village. In the light of it you see Wren's face waiting, and then, as it fades, you see her stop waiting.`,
            { speaker: 'Wren', say: `Okay. That's an answer. That's fine. Good luck in the city.` },
            `She says it nicely. That's the worst part. You walk down the hill together talking about trains.`,
          ],
          next: 'y06_letter',
        },
        choices: [
          {
            text: 'Kiss her',
            hint: 'Ten years of waiting, ten seconds of courage.',
            set: ['kissed'],
            effect: bump(1, 0),
            art: '💋',
            fx: 'flash',
            outcome: [
              `You kiss her. Badly, at first: there's a scarf involved, and a nose. Then not badly at all. Somewhere above you the last rocket bursts and you miss it entirely.`,
              { speaker: 'Wren', say: `Well. That's inconvenient. You're leaving in eleven hours.` },
              `She's laughing. You're both laughing. Neither of you says anything about what happens at 9:14 tomorrow, which is, in its own way, a plan.`,
            ],
            next: 'y06_letter',
          },
          {
            text: '“You’re my best friend. I can’t risk that.”',
            hint: 'True. Also the safest sentence in the language.',
            set: ['friends'],
            effect: bump(0, 1),
            art: '🫂',
            outcome: [
              `“You're my best friend,” you say. “If we get it wrong, I lose you. I can't lose you. You're the only person who knows where I buried my hamster.”`,
              `Wren looks at you for a long moment while the sky goes green and gold. Then she nods and hugs you, hard, with her chin on your shoulder so you can't see her face.`,
              { speaker: 'Wren', say: `Hamster's under the swing. I know. I'll always know.` },
            ],
            next: 'y06_letter',
          },
          {
            text: '“Pact: if we’re both single at thirty…”',
            hint: 'Not a yes. Not a no. A rain check with paperwork.',
            set: ['pact'],
            art: '🤝',
            outcome: [
              `“Okay,” you say, very fast, “a pact. If we're both single at thirty, we... revisit this. Officially.”`,
              { speaker: 'Wren', say: `A pact. You're offering me a *pact*. Like a man in a sitcom.` },
              `But she spits on her palm and holds it out, the way you did everything important when you were nine. You shake on it. The last rocket goes off and you both pretend that was the plan all along.`,
            ],
            next: 'y06_letter',
          },
        ],
      },

      y06_letter: {
        title: 'Your Old Bedroom, 14 Orchard Row',
        stamp: '2006 · Age 20 · 1:12 AM',
        scene: 'bedroom',
        art: '🛏️✍️',
        mood: 'night',
        weather: 'stars',
        enter: { unset: ['pinky', 'joke96'] },
        text: [
          `Your suitcase is open on the floor. Your childhood bedroom still has glow-in-the-dark stars on the ceiling and a poster of a band you now pretend you never liked.`,
          `Downstairs, Mum is ironing your work shirts at one in the morning because she says she can't sleep, which is a lie, because she sleeps like a dropped bag of flour. She's doing it because you're leaving.`,
          `Mrs. Pell said it ten years ago, on the way out to the oak: *Anyone who wants to add to the capsule later, post it to the school, marked for 2046. I'll keep a box.*`,
          `So you've decided to keep the habit. One letter a decade, to the person who'll be opening them at sixty. Mum delivers the post round Millbrook; she'll laugh if she ever sees one go through the sorting office. You pull out a sheet of paper.`,
          { if: 'kissed', text: `Your mouth still tastes of bonfire toffee and Wren. Tomorrow is a train. Tonight is this.` },
          { if: 'froze', text: `You keep seeing the last rocket. The gold light. Her face, deciding.` },
        ],
        choices: [
          {
            text: 'A promise: ring Mum every Sunday',
            hint: 'She’s still ironing. You can hear the steam.',
            set: ['promise06'],
            effect: bump(0, -1),
            art: '☎️',
            outcome: [
              `*Dear Me. Promise you'll ring Mum every Sunday. Every single one. She'll pretend she doesn't mind if you don't. She minds.*`,
              `You seal it, write *Millbrook Primary, Capsule Box, for 2046* on the front, and creep downstairs. Mum is ironing your shirt with tremendous concentration. You hug her from behind. She says *mind the iron*, and leans back into you anyway.`,
            ],
            next: 'y16_party',
          },
          {
            text: 'A warning: don’t let the city eat you',
            hint: 'You’ve seen what it does to people.',
            set: ['warn06'],
            art: '🏙️',
            outcome: [
              `*Dear Me. Don't let the city eat you. Come home more. Mum won't say it, so I'm saying it. If you're reading this at sixty and you only came home for funerals, I'm very disappointed in you, and I'm twenty, so that's saying something.*`,
              `You post it in the red box at the end of Orchard Row on your way to the station in the morning. The box makes a satisfying *clunk*, like a door shutting on something.`,
            ],
            next: 'y16_party',
          },
          {
            text: 'A confession: the truth about tonight',
            hint: 'Write what you didn’t say on the hill.',
            set: ['confess06'],
            effect: bump(1, 0),
            art: '💌',
            outcome: [
              (s) => (s.has('kissed')
                ? `*Dear Me. I kissed Wren Adeyemi on Millbrook Hill tonight and I am TERRIFIED. If you're reading this and you're not with her, find out why, and fix it.*`
                : s.has('pact')
                  ? `*Dear Me. Wren asked me to kiss her and I offered her a PACT. Single at thirty. Like a coward. If you're reading this and you never told her, you're an idiot. Sincerely, an idiot.*`
                  : `*Dear Me. Wren asked me to kiss her tonight and I stood there like a lamppost. If you're reading this at sixty and you never told her, you're an idiot. Sincerely, an idiot.*`),
              `It's the truest thing you've ever written. You seal it fast, before you can read it back, and post it to the school in the morning. For 2046. Safely forty years away.`,
            ],
            next: 'y16_party',
          },
          {
            text: 'A lie: everything turned out great',
            hint: 'Tell them what they want to hear. Tell yourself, too.',
            set: ['lie06'],
            effect: bump(0, 1),
            art: '😁',
            outcome: [
              `*Dear Me. Everything turned out great. Obviously. You're successful and happy and you never think about Millbrook Hill. Well done us.*`,
              `You read it back. It sounds like a cereal advert. You post it anyway, because it's easier to send a lie forty years into the future than to look at the truth for one night.`,
            ],
            next: 'y16_party',
          },
        ],
      },

      /* ================================================================== 2016 */
      y16_party: {
        title: 'Mum’s 60th, 14 Orchard Row',
        stamp: '2016 · Age 30 · Ten years later',
        jump: 'forward',
        scene: 'house',
        art: '🎂',
        mood: 'gold',
        weather: 'sparkles',
        enter: { effect: (s) => { if (ARRIVE16(s)) s.set('saw_stamp'); } },
        text: [
          `Mum's sixtieth. The living room is full of postal workers, neighbours and a banner that says HAPPY 60TH LINDA in letters from the pound shop. The city has been eating you for ten years, politely, one long week at a time.`,
          (s) => (s.has('kissed')
            ? `You and Wren tried. Three years of trains and phone calls and weekends that were always forty minutes too short. It ended in 2009, gently, on a bad phone line, and you've been very grown-up about it ever since. You hate being grown-up about it.`
            : s.has('pact')
              ? `The pact. You both remember the pact. You're thirty. You're both single. Neither of you has mentioned it all evening, so loudly that the whole room can hear it.`
              : `Wren dated a man called Gareth for four years. He was very nice and owned a lot of fleeces. They broke up in the spring. She told you on the phone and you said *oh no* in a voice that didn't sound like *oh no*.`),
          `Wren is here, of course. She's been Year 6 teacher at Millbrook Primary since 2012. She has Mrs. Pell's old classroom, Mrs. Pell's old mug, and, she tells you, Mrs. Pell's old capsule box. *Somebody has to.*`,
          (s) => (ARRIVE16(s)
            ? `Then Mum, opening a stack of birthday cards, gets to an envelope addressed to you, care of this house, in green ink. The stamp is on upside down. *My eyes, love, I thought it was for me*, she says, and before you can reach her she's reading it out, in her best card-reading voice, to the whole room:`
            : `No letter has ever come back from the box. You're almost disappointed. Forty years is a long time to wait for an answer from yourself.`),
          (s) => (s.has('confess06')
            ? (s.has('kissed')
              ? `*"Dear Me. I kissed Wren Adeyemi on Millbrook Hill tonight and I am TERRIFIED. If you're reading this and you're not with her, find out why, and fix it."*`
              : `*"Dear Me. Wren asked me to kiss her and I... "* Mum's voice slows down. Speeds up. She reads it to the end anyway, because she is a professional. *"...Sincerely, an idiot."*`)
            : s.has('promise06')
              ? `*"Dear Me. Promise you'll ring Mum every Sunday. Every single one. She'll pretend she doesn't mind if you don't. She minds."* Mum stops. Looks at you. You rang her twice last month. You rang her once the month before.`
              : null),
          (s) => (s.has('confess06') ? `The room is silent. Somebody's uncle coughs into a sausage roll. Wren, by the door, has gone exactly the colour she went in 1996.` : null),
          (s) => (s.has('promise06') ? { speaker: 'Mum', say: `Well. Sundays are still free, love. I'll put the kettle on.` } : null),
          `Later, in the garden, under the washing line, Wren finds you. The candles are being lit inside; you can hear Mum's friends arguing about how many.`,
          { speaker: 'Wren', say: `Edinburgh offered me deputy head. Start in January. Tell me to stay or tell me to go, but tell me something before your mum blows those candles out, because I'm not asking twice.` },
          { if: 'pact', text: { speaker: 'Wren', say: `And yes. We're thirty. I remember the pact. I'm not holding you to it. I'm just mentioning it. Loudly.` } },
        ],
        timer: 9,
        timeout: {
          text: 'You hesitate.',
          set: ['wren_go'],
          effect: bump(-1, 1),
          art: '🕯️',
          outcome: [
            `Through the window, sixty candles go out in one enormous, wheezing breath. Everyone sings. The singing comes out into the garden and fills the silence where your answer should be.`,
            { speaker: 'Wren', say: `Right. Okay. Edinburgh it is.` },
            `She squeezes your arm on the way back in, the way you'd squeeze a stranger's at a funeral. In January she goes. She takes Mrs. Pell's box with her. *Somebody has to*, she says.`,
          ],
          next: 'y16_letter',
        },
        choices: [
          {
            text: '“Stay.”',
            hint: 'One word. Thirty years late. Still counts.',
            set: ['together16'],
            effect: bump(2, -1),
            art: '🏡',
            outcome: [
              `“Stay,” you say. And then, because one word has never been enough for you: “Stay, and I'll come home. Properly. I'll come back to Millbrook. I'm so tired of the city, Wren, and I'm so tired of being forty minutes away from you.”`,
              `Wren looks at you like a sum that's finally come out right.`,
              { speaker: 'Wren', say: `You're going to be insufferable about this.` },
              `Inside, sixty candles go out. Everyone cheers. You both pretend they're cheering for Mum, and they mostly are.`,
            ],
            next: 'y16_letter',
          },
          {
            text: '“Go. You’ll be brilliant.”',
            hint: 'Generous. Honest. It costs you something.',
            set: ['wren_go'],
            effect: bump(1, 1),
            art: '🚆',
            outcome: [
              `“Go,” you say. “You'll be brilliant. You'll terrify an entire city of children into reading. I'll visit. I'll actually visit.”`,
              `She smiles, properly, and hugs you, and you can feel that she's a little bit disappointed and a lot grateful, both at once, the way only someone who's known you for twenty-five years can be.`,
              { speaker: 'Wren', say: `You'd better visit. I'm taking Mrs. Pell's box with me. Somebody has to keep an eye on your post.` },
            ],
            next: 'y16_letter',
          },
          {
            text: '“Ask me again when we’re forty.”',
            hint: 'A joke. A door, closing politely.',
            set: ['wren_go'],
            effect: bump(-1, 1),
            art: '🙃',
            outcome: [
              `“Ask me again when we're forty,” you say, grinning, and the grin is a wall, and you both watch it go up.`,
              { speaker: 'Wren', say: `I won't, though. That's the thing. I don't do *again*.` },
              `She goes back inside in time for the candles. In January she moves to Edinburgh. She takes Mrs. Pell's box with her. *Somebody has to.*`,
            ],
            next: 'y16_letter',
          },
        ],
      },

      y16_letter: {
        title: 'Mum’s Kitchen, After the Party',
        stamp: '2016 · Age 30 · Midnight',
        scene: 'kitchen',
        art: '🫖✉️',
        mood: 'candle',
        text: [
          `The guests have gone. Mum washes, you dry, the way you always have. There's cake on every surface and a balloon slowly losing the will to live on top of the fridge.`,
          (s) => (s.has('confess06')
            ? { speaker: 'Mum', say: `So. That letter. I didn't know, love. Well. I knew. Everyone knew. But I didn't know you'd written it down.` }
            : s.has('promise06')
              ? { speaker: 'Mum', say: `That letter. Don't feel bad. I mean, do feel a bit bad. Ring on Sundays. That'll do.` }
              : { speaker: 'Mum', say: `You still doing your letters? For Pell's box? You always did love writing to someone who can't answer back.` }),
          (s) => (ARRIVE16(s)
            ? `You ask her who sent it. Mum holds up both soapy hands. *Not me, love. I deliver the post, I don't write it.* The stamp was upside down. You assume that's a Royal Mail thing. Mum doesn't correct you.`
            : null),
          (s) => (TOGETHER(s)
            ? `Through the window you can see Wren, walking home up Orchard Row, doing a small, ridiculous dance under the streetlight when she thinks nobody's watching.`
            : `Through the window, the streetlight on Orchard Row buzzes. Somewhere up the road, Wren is packing for Edinburgh.`),
          { speaker: 'Mum', say: `Write your letter, then. Put the kettle on and decide after. That's what I always say.` },
          `It's what she always says. You put the kettle on. You get a sheet of her good writing paper, the blue kind she saves for complaints to the council. *Dear Me at 60.*`,
        ],
        choices: [
          {
            text: 'A confession: what tonight really meant',
            hint: 'All of it. Sixty-year-old you deserves the truth.',
            set: ['confess16'],
            effect: bump(0, -1),
            art: '🖋️',
            outcome: [
              (s) => (TOGETHER(s)
                ? `*Dear Me at 60. I asked her to stay. She stayed. I've loved her since a stamp on my forehead in 1996. If you're still together, kiss her for me. If you're not, I want a full written explanation.*`
                : `*Dear Me at 60. She asked me for one word in the garden and I didn't give her the right one. I think I've loved her since 1996. I'm writing it down so somebody knows.*`),
              `You read it to Mum. You don't mean to; it just comes out. She dries a plate for a very long time.`,
              { speaker: 'Mum', say: `Good. Now post it before you lose your nerve. Pell's box. Or wherever it lives these days.` },
            ],
            next: 'y26_call',
          },
          {
            text: 'A warning: Mum’s sixty. Don’t miss it.',
            hint: 'She’s standing right there with the tea towel.',
            set: ['warn16'],
            effect: bump(0, -1),
            art: '⏳',
            outcome: [
              `*Dear Me at 60. Mum's sixty. She has a dodgy knee and she gets out of breath on the hill and she won't tell you about either. Come home more. Don't miss the next ten years. You'll want them back.*`,
              `You fold it before she can see. She sees anyway; she's a postwoman, she can read an envelope through a wall.`,
              { speaker: 'Mum', say: `I'm not dying, you know. I'm sixty. I'm just getting started. ...You'll come at Christmas, though?` },
              `You come at Christmas. You come most months after that. You write it in your diary like a meeting, and then it stops needing to be in the diary.`,
            ],
            next: 'y26_call',
          },
          {
            text: 'A lie: you’re happy. Underline it.',
            hint: 'It worked in 2006. Sort of.',
            set: ['lie16'],
            effect: bump(0, 1),
            art: '🙂',
            outcome: [
              `*Dear Me at 60. You're happy. Really. Great job, great flat, no regrets.* You underline *happy* twice. It looks less true each time.`,
              `Mum glances over your shoulder at the underlining and says nothing at all, which from Mum is a full speech.`,
            ],
            next: 'y26_call',
          },
          {
            text: 'Write the truest thing. Then tear it up.',
            hint: 'If you post it, it’s true.',
            set: ['torn16'],
            art: '🗑️',
            outcome: [
              (s) => (TOGETHER(s)
                ? `*Dear Me at 60. I asked her to stay and she stayed and I'm so scared of wrecking it that I'm writing this instead of sleeping.* You read it back. It's too true to send.`
                : `*Dear Me at 60. She asked me for one word in the garden and I didn't give it to her. I think I've loved her since a stamp on my forehead in 1996.* You read it back. It's too true to send.`),
              `You tear it in half, and in half again, eight pieces, and drop them in Mum's pedal bin under the cake boxes. The lid clanks shut.`,
              `Mum, at the sink, watches the bin for a second longer than she needs to. Then she goes back to the washing up.`,
            ],
            next: 'y26_call',
          },
        ],
      },

      /* ================================================================== 2026 */
      y26_call: {
        title: 'Forty-First Floor, Meeting Room 3',
        stamp: '2026 · Age 40 · Ten years later',
        jump: 'forward',
        scene: 'boardroom',
        art: '📱',
        mood: 'office',
        fx: 'shake',
        text: [
          (s) => (TOGETHER(s)
            ? `You moved back to Millbrook in 2017. You and Wren got married at the registry office in 2019; Mrs. Pell, seventy-something, read a poem and cried into her scarf. But work still drags you down to the city two days a week, and today is one of them.`
            : `Ten years in the city. Wren's been in Edinburgh since 2017; you text, you visit some years, you send each other bad photos of good dogs. Today you are on the forty-first floor, giving the most important pitch of your career.`),
          `You are eleven slides in. The client is leaning forward. Then your phone, face down on the table, starts to buzz. And buzz. You flip it over with one finger: **MILLBROOK GENERAL HOSPITAL**. Third call.`,
          { if: 'warn16', text: `You knew this call would come one day. You've been coming home every month since 2016, half-waiting for it. Knowing doesn't help. Nothing helps.` },
          `You answer it under the table. A nurse, kind and quick: your mum's had a stroke. She's stable. She's asking for you. *Come now if you can.*`,
          `Eight people in suits are looking at you. The phone is still warm in your hand.`,
        ],
        timer: 8,
        timeout: {
          text: 'You freeze, and the call drops.',
          set: ['missed'],
          effect: bump(0, 2),
          art: '📵',
          outcome: [
            `You say *sorry, one second* to the room and nothing to the phone, and somehow, in the second it takes to choose, the call drops. You stare at the screen. You finish the slide you were on. You don't know why. Your mouth just keeps going.`,
            `You get to Millbrook at one in the morning. You missed the worst of it. You missed the part where she asked for you, twice, and a nurse held her hand instead.`,
          ],
          next: 'y26_ward',
        },
        choices: [
          {
            text: 'Walk out mid-sentence',
            hint: 'Leave the laptop. Leave the slide. Run.',
            set: ['mum_there'],
            effect: bump(0, -1),
            art: '🏃',
            outcome: [
              `“My mum's in hospital,” you say to eight strangers, and you leave mid-slide, laptop open, the client's mouth still slightly open too. Nobody stops you. One of them says *go* very gently as the door closes.`,
              `The train takes ninety minutes. You stand the whole way. You're at her bedside by four o'clock, and she's awake, and she knows you.`,
            ],
            next: 'y26_ward',
          },
          {
            text: 'Call Wren: “Can you get to her?”',
            hint: 'Someone who loves her, there in time.',
            set: ['wren_mum'],
            effect: bump(1, 0),
            art: '📞',
            outcome: [
              (s) => (TOGETHER(s)
                ? `“Mum's had a stroke,” you say into the phone, outside the meeting room, “I'm ninety minutes away—” and Wren says *I'm already putting my coat on* before you've finished. She leaves a class of thirty with the deputy head and runs the whole way down Orchard Row.`
                : `“Mum's had a stroke,” you say, “and I'm hours away, and I don't know why I'm calling you, you're in Edinburgh—” and Wren says *I'm in the car*. It's a four-hour drive. She does it in three and a half.`),
              `By the time you get there, Wren is sitting by Mum's bed doing the crossword out loud, and Mum is pretending to be annoyed by it, which means she's going to be all right.`,
            ],
            next: 'y26_ward',
          },
          {
            text: 'Finish the pitch. Twelve more minutes.',
            hint: 'She’s stable. The nurse said stable.',
            set: ['late'],
            effect: bump(0, 1),
            art: '📊',
            outcome: [
              `You text *on my way soon* and put the phone face down. You finish the pitch. You're brilliant. You win the account. You'll never remember a single word of it.`,
              `The trains are delayed. You get to Millbrook at nine at night. Mum is asleep. A nurse tells you she asked for you, and that she said, *Don't fuss, they'll be busy*, which is the most Mum sentence ever spoken.`,
            ],
            next: 'y26_ward',
          },
        ],
      },

      y26_ward: {
        title: 'Millbrook General, Ward 6',
        stamp: '2026 · Age 40 · That night',
        scene: 'corridor',
        art: '🏥✉️',
        mood: 'night',
        enter: { effect: (s) => { if (ARRIVE26(s)) s.set('saw_stamp'); } },
        text: [
          `Ward 6 hums. Machines beep in a steady, reassuring way, like a bored metronome. Mum is propped up on three pillows, one side of her mouth not quite doing what she tells it to. Her words come slowly. But they come.`,
          { speaker: 'Mum', say: `Don't look at me like that. I'm not a parcel. I'm not lost.` },
          (s) => (ARRIVE26(s)
            ? `Then the ward clerk comes round with a trolley and stops at your chair. *Post for you. Somebody left it at the front desk.* Your name. Green ink. The stamp upside down.`
            : `At some point a ward clerk comes round with the post trolley. Nothing for you. Of course nothing for you; nobody knows you're here.`),
          (s) => (s.has('torn16')
            ? (TOGETHER(s)
              ? `Inside: a letter in eight pieces, taped back together with neat, careful strips of Sellotape, like someone repaired it at a kitchen table. *Dear Me at 60. I asked her to stay and she stayed and I'm so scared of wrecking it...* The letter you tore up in Mum's kitchen. The letter you never sent.`
              : `Inside: a letter in eight pieces, taped back together with neat, careful strips of Sellotape. *Dear Me at 60. She asked me for one word in the garden and I didn't give it to her. I think I've loved her since a stamp on my forehead in 1996.* The letter you tore up in Mum's kitchen. The letter you never sent.`)
            : s.has('warn06')
              ? `Inside, in your twenty-year-old handwriting: *Dear Me. Don't let the city eat you. Come home more. Mum won't say it, so I'm saying it.* It arrives twenty years too late and exactly on time, which is somehow worse.`
              : null),
          (s) => (ARRIVE26(s) ? `The postmark says ` + (TOGETHER(s) ? 'Millbrook.' : 'Edinburgh.') + ` You hold it up to Mum. *Was this you?*` : null),
          (s) => (ARRIVE26(s) ? { speaker: 'Mum', say: `I didn't post anything, love. Hand on heart.` } : null),
          (s) => (ARRIVE26(s) ? `She says it slowly and very carefully, the way she's saying everything today. She's telling the truth. It's just possible she's telling a very precise amount of it.` : null),
          { if: 'wren_mum', text: `Wren has gone to find decent coffee, which in Millbrook General means a forty-minute round trip. Mum watches her go with an expression you can't read.` },
          { if: 'missed', text: { speaker: 'Mum', say: `You came. That's what counts. Stop doing that face. Stop it.` } },
          `Mum falls asleep around midnight with her hand in yours. There's a pad of hospital notepaper on the table. It's ten years, more or less. *Dear Me at 60.*`,
        ],
        choices: [
          {
            text: 'A promise: spend what’s left on people',
            hint: 'Not pitches. Not trains. People.',
            set: ['promise26'],
            effect: bump(0, -1),
            art: '🤲',
            outcome: [
              `*Dear Me at 60. I promise: whatever's left, spend it on people. Not slides. Not the forty-first floor. People. Her. Whoever's still here.*`,
              `You post it in the hospital postbox in the morning, addressed to the capsule box, wherever it lives now. It's the first promise you've made to yourself in thirty years that you intend to keep.`,
            ],
            next: 'y46_morning',
          },
          {
            text: 'A confession: everything you never told her',
            hint: 'Then read it to her when she wakes.',
            set: ['confess26'],
            effect: bump(1, -1),
            art: '💬',
            outcome: [
              `You write everything you never said to Mum. That you're sorry about the Sundays. That you've always known about the ironing. That she was the bravest person you ever met, and that you've never once told her so.`,
              `When she wakes at six, you read it to her. She listens with her eyes shut. At the end she says, slowly, *I know, love. I always knew. But it's nice to get it in writing.*`,
              `You post it to the box anyway. Some things should be on file.`,
            ],
            next: 'y46_morning',
          },
          {
            text: 'An empty envelope. One stamp, upside down.',
            hint: 'Answer in the only language that’s been writing to you.',
            if: 'saw_stamp',
            set: ['stamp26'],
            effect: bump(1, 0),
            art: '📮',
            outcome: [
              `You don't write anything. You take an envelope from the ward clerk, address it to the capsule box, and put nothing inside it at all.`,
              `Then you lick a stamp, and stick it on. Upside down. Exactly as Mrs. Pell described, in a library, in 1996, between the encyclopaedias.`,
              `Whoever's been sending your letters back will know what it means. You're almost sure you know who that is. You've been almost sure for a long time.`,
            ],
            next: 'y46_morning',
          },
          {
            text: 'Don’t write one. Just sit with her.',
            hint: 'The future has had enough of your post.',
            set: ['none26'],
            art: '🌙',
            outcome: [
              `You put the pen down. The future has had thirty years of letters from you. Tonight it can wait.`,
              `You sit with her hand in yours until the window goes grey. She snores, magnificently, like a ship's engine. You don't let go once.`,
            ],
            next: 'y46_morning',
          },
        ],
      },

      /* ================================================================== 2046 */
      y46_morning: {
        title: 'The Morning of the Opening',
        stamp: '2046 · Age 60 · Twenty years later',
        jump: 'forward',
        scene: 'kitchen',
        art: '✉️💚',
        mood: 'dawn',
        weather: 'dust',
        text: [
          `The envelope comes at 7:10, while the kettle is still thinking about it. Millbrook Primary promised in 1996 that every capsule letter would be posted to its writer on the morning of the opening, and Millbrook, against all odds, has kept its word.`,
          `Mum died in 2033, in her garden chair, with the radio on and the crossword nearly finished. You live in her house now. You still say *put the kettle on and decide after*. You still put the kettle on.`,
          (s) => (TOGETHER(s)
            ? `Upstairs, Wren is asleep, or pretending to be. She retired as head of Millbrook Primary two years ago and is running today's opening anyway, because nobody has ever successfully stopped Wren Adeyemi from being in charge of something.`
            : CL(s) >= 3
              ? `Wren came back from Edinburgh in 2031 to be head of Millbrook Primary, and she's running today's opening at noon. She texted at six: *Don't be late, slowcoach.* Twenty-odd years of Sunday phone calls and she still hasn't found a new word for you.`
              : CL(s) === 2
                ? `Wren came back from Edinburgh in 2031 to be head of Millbrook Primary. She's running today's opening. You see each other at the post office, mostly. Christmas cards. A wave across the road. Neither of you has ever said why it went quiet.`
                : `Wren came back from Edinburgh years ago to run Millbrook Primary. You know because you read it in the local paper. You haven't spoken properly in almost twenty years. She's running today's opening. You weren't sure you'd go.`),
          `Your name is on the front. Not in your handwriting. In **green ink**. And the stamp is on upside down.`,
          { if: 'saw_stamp', text: `Your hands know before your head does. You've seen that stamp before.` },
          `Inside, two sheets of paper. The first is yours: lined paper, a ten-year-old's handwriting, fifty years old.`,
          LETTER96,
          `The second is in green ink, and it isn't from you at all.`,
          `*Dear Slowcoach. Surprise. It isn't you. It was never going to be you. I was letter monitor, remember? I carried the box to the oak tree, slowly, at the back of the line, and on the way I did the worst thing I have ever done. I read yours.*`,
          (s) => (s.has('confess96')
            ? `*You wrote that you were going to marry me. You spelled it with one R. I couldn't let anyone else dig that up, so I took it out and put my own letter in, under your name. Mine said the same thing. I spelled it with two.*`
            : s.has('promise96')
              ? `*You promised you'd still be my friend at sixty. I took it out and put my own in, under your name, because I wanted to be the one who got to check.*`
              : s.has('lie96')
                ? `*You wrote that you'd be an astronaut. I took it out, because I didn't want sixty-year-old you to be sad about the moon, and I put mine in instead, under your name.*`
                : `*You'd written your name and nothing else. I took it out and put mine in, under your name, because I thought somebody should write you something.*`),
          `*Mrs. Pell gave me her box in 2012. Every letter you ever posted to it, I kept. Some I sent back early, when I thought you needed them. Royal Mail and I did our best with the timing. Our best was not always good.*`,
          { if: ARRIVE16, text: `*The 2006 one was meant to arrive the week before your mum's sixtieth. It arrived during the cake. I have never been so sorry about a cake.*` },
          { if: 'torn16', text: `*The torn one, from 2016: your mum fished it out of her pedal bin, ironed it flat (IRONED it) and handed it to me at the school gate. She said, "This one's yours, really." I taped it. I posted it to the hospital. She was right about most things.*` },
          { if: (s) => s.has('warn06') && !s.has('torn16'), text: `*I sent your old warning to the hospital in 2026, because it was the only thing in the box that sounded like her.*` },
          { if: (s) => s.has('lie06') || s.has('lie16'), text: `*I never sent back the ones that said everything was fine. They were the only ones that weren't true. They're in the tin. You can have them, but you won't want them.*` },
          { if: 'stamp26', text: `*And in 2026 you posted me an empty envelope with the stamp upside down. Nothing inside. It's been on my fridge for twenty years. You knew. Of course you knew. It took you thirty years, slowcoach, but you knew.*` },
          (s) => (TOGETHER(s)
            ? `*I'm writing this at our kitchen table while you're asleep, which is ridiculous, because I could just tell you. But I promised a ten-year-old I'd write.*`
            : CL(s) >= 3
              ? `*I'll be at the oak at noon. I'll be the one with the clipboard, pretending not to look for you.*`
              : `*I don't know if you'll come today. I'd understand if you didn't. I just couldn't let the box close without telling you it was me.*`),
          `*Onwards, slowcoach.*`,
          `No name. There doesn't need to be one. Green ink, a stamp upside down, and *slowcoach*. There has only ever been one person on earth who calls you that.`,
        ],
        choices: [
          {
            text: 'Go to her. Now.',
            hint: 'You’ve been slow for fifty years. Not today.',
            set: ['go46'],
            art: '🏃',
            outcome: [
              (s) => (TOGETHER(s)
                ? `You take the stairs two at a time, which at sixty is a statement. The bedroom is empty; the bed is still warm. On the pillow, a sticky note in green ink: *Gone to the oak. Don't be late.*`
                : `You don't even put your coat on properly. You walk up Orchard Row in your slippers, letter in hand, past the red postbox at the end of the road that has swallowed four decades of your mail.`),
              `Millbrook Primary is decked out in bunting. Under the oak, which is enormous now, a crowd of sixty-year-olds and their grandchildren stand around a hole in the ground. And there's Wren, with a clipboard, looking up.`,
            ],
            next: FINALE,
          },
          {
            text: 'Write back. In green, if you can find green.',
            hint: 'She’s been writing to you for fifty years. Your turn.',
            set: ['write46'],
            art: '🖊️',
            outcome: [
              `You turn out every drawer in Mum's kitchen. Biros, a pencil, a crayon. And at the back of the cutlery drawer, a green gel pen, the stolen-from-the-bank kind. Mum kept one. Of course Mum kept one.`,
              `You write back. It takes you a long time. You're still a slowcoach. You lick the stamp and stick it on.`,
            ],
            next: FINALE,
          },
          {
            text: 'Fold it up. Some letters are for keeping.',
            hint: 'Put it in Mum’s biscuit tin with everything else.',
            set: ['keep46'],
            art: '🗃️',
            outcome: [
              `You fold both letters along their old creases and put them in Mum's biscuit tin, on top of her Christmas cards and the stub of a 9:14 train ticket from 2006.`,
              `Then you sit at the kitchen table with your tea going cold, and you let the morning happen without you.`,
            ],
            next: FINALE,
          },
        ],
      },

      /* ================================================================ ENDINGS */
      end_stamps: {
        title: 'Under the Oak',
        stamp: '2046 · Noon',
        scene: 'village',
        art: '📮💚',
        mood: 'sunny',
        weather: 'sparkles',
        ending: { id: 'language-of-stamps', title: 'The Language of Stamps', type: 'secret' },
        text: [
          `You don't say anything. You walk up to Wren, through the crowd, past the hole in the ground and the bunting and a tiny ancient woman in a wheelchair who is unmistakably Mrs. Pell.`,
          `You peel the upside-down stamp off Wren's envelope, still a little tacky after all these years of glue, and press it to the middle of her forehead. Upside down.`,
          `Sixty years old, retired head teacher, in front of the whole of Millbrook, Wren Adeyemi goes the exact colour she went in 1996.`,
          { speaker: 'Mrs. Pell', say: `Victorian code. I did tell you. Nobody ever listens to the fun facts.` },
          `Then you hand Wren your ten-year-old letter. She doesn't need to read it; she's had it for fifty years. She reads it anyway, out loud, under the oak. *I am going to mary Wren Adeyemi.*`,
          { speaker: 'Wren', say: `One R. You absolute slowcoach. One R.` },
          (s) => (TOGETHER(s)
            ? `You've been married twenty-seven years. You've never once talked about the capsule. She kept your letters and you tore one up and your mother ironed it, and all three of you were saying the same thing in different handwriting the entire time.`
            : `Fifty years, two cities, one pedal bin and a lot of Royal Mail. You were both saying the same thing in different handwriting the entire time. You've just never been in the same room when you said it.`),
          `That afternoon, the new Year 6 write their letters to 2096. Wren hands you a sheet of paper and the green pen, and you write one together, the first one either of you has ever addressed to someone who'll actually be there.`,
          `You stick the stamp on. You both know which way up.`,
        ],
      },

      end_true: {
        title: 'Under the Oak',
        stamp: '2046 · Noon',
        scene: 'village',
        art: '🌳💚',
        mood: 'sunny',
        weather: 'sparkles',
        ending: { id: 'upside-down', title: 'Upside Down', type: 'true' },
        text: [
          `Wren sees the letter in your hand from forty feet away and her clipboard drops about two inches. She knows exactly what you've read.`,
          { speaker: 'Wren', say: `Before you say anything. I know it's a crime. Interfering with the Royal Mail. I was ten.` },
          { speaker: 'You', say: `You were twenty-six when you took over the box. And thirty when you posted the first one back. And forty when—` },
          { speaker: 'Wren', say: `Yes, all right, I've had a long criminal career.` },
          { if: 'mum_there', text: `You tell her about that afternoon in Ward 6. About walking out mid-slide, and getting there in time, and Mum saying *I'm not a parcel*. Wren laughs so hard she has to sit down on the edge of the capsule hole.` },
          { if: 'wren_mum', text: `You tell her you know she drove to Mum before you did, and did the crossword out loud, and you've never properly thanked her. She says Mum got seven across and she didn't, and that's thanks enough.` },
          (s) => (TOGETHER(s)
            ? `You've been married twenty-seven years. She never told you about the box. You never asked who was sending the letters back. It turns out a marriage can hold one good secret, if it's the right kind.`
            : `You stand under the oak and talk until the crowd's gone and the caretaker is hovering with a spade. Not about the past, mostly. About the next bit. The bit you've still got.`),
          `Mrs. Pell, ninety-five and in a wheelchair at the front, catches your eye and taps her own forehead, twice, where a stamp would go. She knew. Teachers always know.`,
          `You were slow. You were so slow. But you came, and you're here, and the letter in your hand is the only one in the whole capsule that got delivered to exactly the right person.`,
        ],
      },

      end_first: {
        title: 'Return Post',
        stamp: '2046 · The next morning',
        scene: 'house',
        art: '💌',
        mood: 'dawn',
        ending: { id: 'first-class', title: 'First Class', type: 'good' },
        text: [
          (s) => (s.has('write46')
            ? `You post your reply in the red box at the end of Orchard Row, first class, stamp upside down. It's the first letter you've sent in fifty years to someone who can answer.`
            : `You get to the oak. You and Wren stand side by side through the speeches, shoulders touching, and you don't say much. You don't need to. You both know what the other one has read.`),
          (s) => (s.has('write46')
            ? (TOGETHER(s)
              ? `Wren gets it the next morning. She reads it at the kitchen table, across from you, in silence, and then she gets up and puts it on the fridge, next to twenty years of shopping lists in green ink.`
              : `The next morning, the doorbell goes at 7:12. It's Wren, sixty years old, in her coat over her pyjamas, holding your letter like a ticket.`)
            : `Afterwards, she walks you home. At the gate of 14 Orchard Row, she stops and looks at Mum's house and says, *She was in on it, you know. Right to the end.* You know. Of course you know.`),
          { speaker: 'Wren', say: `Took you long enough, slowcoach.` },
          (s) => (RG(s) >= 3
            ? `There are things you can't get back. The Sundays you didn't ring. The years you let the city have. You don't pretend otherwise; neither does she. But there's a lot of time left, and you've stopped wasting it on post.`
            : `It isn't the life the ten-year-old wrote about. There's no moon and no dog called Laser. There's a kitchen, and a kettle, and the person who's been reading your mail for fifty years.`),
          `You put the kettle on. You decide after.`,
        ],
      },

      end_postage: {
        title: 'At the Back of the Crowd',
        stamp: '2046 · Noon',
        scene: 'village',
        art: '🏷️',
        mood: 'fog',
        ending: { id: 'postage-due', title: 'Postage Due', type: 'neutral' },
        text: [
          (s) => (s.has('keep46')
            ? `In the end you do go, at five to twelve, and stand at the back of the crowd under the oak with the tin's lid still printed on your fingers.`
            : `You get there. You stand at the back. It turns out the hardest part of going to someone is the last forty feet.`),
          `Wren reads the names out from her clipboard. When she gets to yours, she looks up and finds you instantly, the way you find a word you've been writing your whole life.`,
          (s) => (TOGETHER(s)
            ? `At home that night you tell her you got her letter. She says *good*. You say *thank you*. You don't say the rest. It sits on the table between you like a parcel neither of you will sign for.`
            : `Afterwards, by the bunting, you talk. It's warm. It's kind. It's about the weather and the school roof, which is leaking again. Neither of you mentions the box.`),
          { if: 'late', text: `You think about a pitch you won in 2026, and the nine o'clock train, and a nurse telling you *they'll be busy*. Some postage is paid late, with interest.` },
          `You don't lose her. You just never quite catch up with her either. Fifty years of letters, and the most important ones are still sitting at the sorting office, waiting for someone to pay the difference.`,
          `On the way home you pass the red postbox. You have a stamp in your wallet. You stand there for a long time.`,
        ],
      },

      end_return: {
        title: 'Not the Right Address',
        stamp: '2046 · Evening',
        scene: 'street',
        art: '📭',
        mood: 'night',
        ending: { id: 'return-to-sender', title: 'Return to Sender', type: 'bad' },
        text: [
          `The letter is kind. That's the worst thing about it. Fifty years of looking after your post, and not a single word of blame.`,
          (s) => (s.has('go46')
            ? `You do go to the oak. Wren is surrounded by people who've known her for the last twenty years: teachers, parents, children who grew up with her. You watch from the gate. She doesn't see you. Or she does, and lets you choose. You choose the gate.`
            : s.has('write46')
              ? `You write back. You get as far as *Dear Wren*, in your mum's green pen, and then you can't find a single sentence that's earned the stamp.`
              : `You put it in the tin. You don't go. At noon you hear the school's brass band drift down Orchard Row, and you turn the radio up.`),
          { if: 'froze', text: `You think about a rocket going up gold over Millbrook Hill, and the second you didn't move.` },
          { if: 'missed', text: `You think about a phone buzzing on a boardroom table, and a call you let drop.` },
          `That evening, you walk to the red postbox at the end of Orchard Row with your 1996 letter in your hand and nowhere to send it. The ten-year-old who wrote it doesn't live here any more. You're not sure who does.`,
          `Somewhere up the hill, a light is on in the head teacher's old office. You could knock. You've had fifty years to knock. You go home and put the kettle on, and don't decide anything at all.`,
        ],
      },

      end_unknown: {
        title: 'Everything’s Fine',
        stamp: '2046 · A week later',
        scene: 'kitchen',
        art: '📬',
        mood: 'fog',
        ending: { id: 'not-known', title: 'Not Known at This Address', type: 'bad' },
        text: [
          `*I never sent back the ones that said everything was fine,* she wrote. *They were the only ones that weren't true.*`,
          (s) => (s.has('write46')
            ? `So you write back, in Mum's green pen, and you tell her it's fine. All of it. You're fine, it was lovely, what a story, thanks so much. You've had a lot of practice. You underline *fine*.`
            : `So you put it in the tin, and when you see her at the post office you say *lovely letter*, and *what a story*, and *everything's fine, honestly*. You've had a lot of practice.`),
          (s) => (TOGETHER(s)
            ? `A week later there's an envelope on your pillow, in green ink, with the stamp the right way up. Inside, just your own words, *everything's fine*, and underneath, in her handwriting: **NOT KNOWN AT THIS ADDRESS. Try again when they're home.**`
            : `A week later it comes back through your door. Your own envelope, your own *everything's fine*, and across it in green ink, in capitals: **NOT KNOWN AT THIS ADDRESS. Try again when they're home.**`),
          (s) => (s.has('lie96') ? `In the tin, on top, the ten-year-old's drawing of you waving from the moon. You never got to the moon. You got very good at saying you had.` : `In the tin, the letters that said you were happy are lying on top. They look like letters from someone you'd quite like to meet.`),
          `You were never cruel. You were never a villain. You just told the future what it wanted to hear for so long that you stopped being at the address.`,
          `Somebody who knows you is waiting for you to come home. You're sixty. It isn't too late. But you'll have to write the next one in your own words.`,
        ],
      },
    },
  });
})();
