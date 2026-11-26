/*
 * Turn to Page 47 — MysteryFate story.
 *
 * SOLUTION (for authors): You're clearing out Flat 4B, Corrin Court, after Arthur Penhale died in his armchair on
 * his 74th birthday (the condemned gas fire; carbon monoxide, though nobody says so until the end). In the chair is
 * PICK YOUR PERIL No. 9: THE MIDNIGHT LODGER (1987), a gamebook Arthur wrote as "A. W. Penn" for his daughter Ellie.
 * As you read, the book stops describing its own haunted house on Larkin Lane and starts describing your night.
 *
 * Page 47 is printed in the book but NO choice ever sends you there: Arthur hid it for Ellie, who always cheated
 * and never found it. Clues (any two unlock "Turn to page 47"):
 *   clue_age    — Arthur was 74 (birthday card on the mantel; the book's parlour; Mrs Dunmore)
 *   clue_mirror — pencil note on the pasted-in page 61: "the page nobody sends you to is my age, back to front"
 *   clue_stuck  — the leaf holding pages 47/48 is stuck shut (riffle the book at page 100, or check the binding at 33)
 * Grip (0..5) rises each time you let the book pull you in. The gas fire (gasfire) is the real danger: dozing at
 * page 66 with it lit is the death ending. Memory: once two endings are found, Arthur answers your pencil in the
 * margin of page 61 and asks to be read to (Bedtime Story).
 */
(function () {
  'use strict';

  const say = (speaker, text, cond) => (cond === undefined ? { speaker, say: text } : { speaker, say: text, if: cond });
  const clamp = (n) => Math.max(0, Math.min(5, n));
  // Nudge the Grip meter (clamped 0..5), then run an optional extra effect.
  const grip = (n, extra) => (s) => {
    s.setVar('grip', clamp(s.get('grip') + n));
    if (extra) extra(s);
  };
  const clues = (s) => s.count('clue_age', 'clue_mirror', 'clue_stuck') >= 2;
  const deep = (s) => s.get('grip') >= 3;

  // The book's prose gets more personal the deeper it has you.
  const creep = (s) => {
    const g = s.get('grip');
    if (g >= 4) return 'You notice you have stopped blinking. You notice the book noticed first.';
    if (g >= 3) return 'The print seems darker than it was an hour ago. Fresher. As if it has only just been set.';
    return null;
  };
  const fumes = (s) => (s.has('gasfire')
    ? 'Behind you the gas fire purrs, three ceramic bars glowing orange and one dead grey one. There is a dull band of ache across your forehead you put down to the hour.'
    : null);

  registerStory({
    id: 'page-47',
    title: 'Turn to Page 47',
    category: 'mystery',
    tagline: 'A dead man\'s gamebook. Every page tells you where to turn. One page, nothing ever sends you to.',
    description: 'You\'re clearing out a dead man\'s flat overnight when you find a battered 1987 choose-your-path gamebook in his armchair. You start to play. Somewhere around page 14, the book stops describing its haunted house and starts describing your room.',
    cover: '📖',
    accent: '#d4a72c',
    ambient: 'mystery',
    scene: 'apartment',
    warning: 'Contains: the death of an elderly man (before the story), carbon monoxide, grief, estrangement.',
    vars: { grip: 0 },
    hud: [{ var: 'grip', label: 'Grip', icon: '🔖', max: 5 }],
    remembers: true,
    voices: {
      narrator: { gender: 'male', pitch: 0.92, rate: 0.94, accent: 'en-GB', note: 'warm, bookish, late-night storyteller' },
      'The Book': { gender: 'female', pitch: 1.08, rate: 1.04, accent: 'en-GB', note: 'brisk, cheerful 1980s gamebook narrator who slowly goes wrong' },
      'Arthur': { gender: 'male', pitch: 0.74, rate: 0.84, accent: 'en-GB', note: 'old, gentle, tired, pencil-soft' },
      'Mrs Dunmore': { gender: 'female', pitch: 1.12, rate: 1.12, accent: 'en-IE', note: 'downstairs neighbour, chatty, kind, nosy' },
      'Ellie': { gender: 'female', pitch: 0.98, rate: 1.0, accent: 'en-US', note: 'Arthur\'s daughter, forties, guarded, brittle, moved abroad years ago' },
      'The Lodger': { gender: 'neutral', pitch: 0.6, rate: 0.8, volume: 0.6, note: 'dry whisper from the top of the stairs' },
    },
    start: 'cover',
    scenes: {
      // ------------------------------------------------------------------ THE FRAME: FLAT 4B
      cover: {
        title: '11:40 PM — Flat 4B, Corrin Court',
        stamp: 'Inside Cover',
        jump: 'page',
        art: '📖🪑',
        mood: 'night',
        weather: 'rain',
        scene: 'apartment',
        text: [
          'The dead man\'s armchair still has the shape of him in it.',
          'Flat 4B, Corrin Court. Arthur Penhale, seventy-something, lived here alone for twenty years and died in that chair three weeks ago. The letting agent wants it empty by eight. His daughter arranged the clearance by email from somewhere far away. *I\'ll collect the keys at 8 AM. I won\'t be coming in.*',
          'So it\'s you, a roll of bin bags, forty flat-pack boxes and a flat that smells of pipe tobacco and cold toast. The radiator ticks like it\'s counting. The heating has been off for weeks.',
          'Wedged down the side of the armchair cushion, you find a paperback. Spine cracked white, corners soft as cloth. **PICK YOUR PERIL No. 9: THE MIDNIGHT LODGER**, by A. W. Penn, 1987. On the cover, a boy with a torch on a dark staircase, and at the top of the stairs, a shape.',
          'On the back: *YOU are the detective. Choose your path. There are 23 ways to die in the house on Larkin Lane, and only one way out.*',
          s => {
            if (s.seen('the-page-nobody-sends-you-to')) return 'Inside the cover, in soft pencil: *To whoever\'s next. Don\'t cheat.* And under it, in the same hand but newer, the graphite still shiny: *Back again? You found it last time. Read it slower. —A.*';
            if (s.found() >= 2) return 'Inside the cover, in soft pencil: *To whoever\'s next. Don\'t cheat.* And under it, newer, the graphite still shiny: *Back again? You keep coming back to my chair. Write to me sometime. —A.*';
            if (s.found() >= 1) return 'Inside the cover, in soft pencil: *To whoever\'s next. Don\'t cheat.* And under it, newer, the graphite still shiny: *Back again? —A.*';
            return 'Inside the cover, in soft pencil: *To whoever\'s next. Don\'t cheat. —A.*';
          },
          'You\'ve got seven hours of boxes ahead of you. You sit down in the dead man\'s chair anyway. Just for a minute.',
        ],
        choices: [
          {
            text: 'Light the gas fire, then start at page 1',
            hint: 'It\'s freezing. The fire is right there. Three working bars out of four.',
            art: '🔥',
            set: ['gasfire'],
            effect: grip(1),
            outcome: [
              'The fire is an old brown thing with a chrome knob. You turn it, press the igniter, and it catches with a soft *whump*. Three bars go orange. The fourth stays grey and cracked.',
              'Warmth hits your shins. The smell of burnt dust. You settle back into Arthur\'s chair, which fits you better than it has any right to, and open the book at page 1.',
            ],
            next: 'p1',
          },
          {
            text: 'Have a look round the flat first',
            hint: 'Get the measure of the job. And of him.',
            art: '🔦',
            set: ['clue_age'],
            outcome: [
              'Kitchen: one mug, one plate, one of everything. Bedroom: a single bed made with hospital corners. Living room: books, a crack in the window like a lightning bolt, a view of the gasworks.',
              'On the mantelpiece above the gas fire stands one birthday card. A cartoon badge on the front: **74 TODAY!** You open it. Printed message, no signature. He bought it himself.',
              'You put it back exactly where it was, which is silly, because in seven hours it will be in a bin bag. Then you sit in his chair and open the book at page 1.',
            ],
            next: 'p1',
          },
          {
            text: 'Flip to the back and see how it ends',
            hint: 'Everyone did it as a kid. Thumb in page 1, peek at page 100.',
            art: '🤫',
            set: ['cheat'],
            outcome: [
              'You let the pages run to the end. The paper is soft and yellow and makes a sound like a held breath let go.',
              'Page 100. The last page. You read it with the guilty little thrill of being nine years old.',
            ],
            next: 'p100',
          },
        ],
      },

      p100: {
        title: 'The Midnight Lodger — The Last Page',
        stamp: 'Page 100',
        jump: 'page',
        art: '📕🚫',
        mood: 'candle',
        scene: 'apartment',
        text: [
          'Page 100 is almost empty. One block of print in the middle, in the book\'s cheerful capitals:',
          say('The Book', 'THERE IS NO ENDING ON THIS PAGE. Real detectives start at the beginning. Turn to page 1, and this time, play fair.'),
          'Underneath, in pencil, a different voice:',
          say('Arthur', 'She always did that too. Peeked at the back. He\'s right, though. Start at the start.'),
          { if: s => s.found() >= 1, text: 'And smaller, squeezed into the gutter of the page: *You know how this ends. You don\'t, actually.*' },
          'The book is warm in your hands. Warmer than paper should be in an unheated flat.',
        ],
        choices: [
          {
            text: 'Turn to page 1, properly this time',
            hint: 'Play fair. Like the book says.',
            art: '📖',
            outcome: [
              'You turn back to the beginning like a told-off kid. Something about the pencil note makes you want to do this right.',
            ],
            next: 'p1',
          },
          {
            text: 'Riffle the middle pages with your thumb first',
            hint: 'Just a quick flick. See what\'s in there.',
            art: '👍',
            set: ['clue_stuck'],
            outcome: [
              'You fan the book from back to front. Page numbers blur past: 88, 81, 66, 62, 61... 49, then a hitch, a thick stiff place where your thumb catches, and then 46, 45, 33.',
              'You go back and find it. The leaf with **pages 47 and 48** is stuck fast to its neighbours, glued along every edge, as if someone deliberately sealed it. You try a fingernail. It won\'t give. A printing fault, probably. A tea spill, decades old.',
              'You let it go, for now, and turn to page 1.',
            ],
            next: 'p1',
          },
        ],
      },

      // ------------------------------------------------------------------ ACT ONE: LARKIN LANE
      p1: {
        title: 'The Midnight Lodger — Larkin Lane',
        stamp: 'Page 1',
        jump: 'page',
        art: '🏚️🌧️',
        mood: 'storm',
        weather: 'rain',
        scene: 'street',
        text: [
          say('The Book', 'It is raining on Larkin Lane. YOU are a young detective, and you have been sent to Number 9, where old Mr Crane lived alone, because nobody has seen a light in his window for three weeks.'),
          say('The Book', 'The front door is open. Inside: a hallway, a smell of pipe smoke, and a staircase going up into the dark. Somewhere above you, a radiator is ticking.'),
          'You glance up. Arthur\'s radiator ticks, right on cue. Coincidence. Old radiators all tick.',
          { if: 'cheat', text: 'You still have the guilty feeling of page 100 on your fingertips.' },
          'Down the margin, somebody has circled numbers in pencil. Not words. Just a **4** here, a **7** there, gone over and over until the paper shines.',
          say('The Book', 'To climb the stairs, turn to page 81. To search the parlour, turn to page 14.'),
        ],
        choices: [
          {
            text: 'Climb the stairs. Turn to page 81.',
            hint: 'Detectives go up. Into the dark.',
            art: '🪜',
            outcome: [
              'You flick forward past forty, past sixty. The book falls open at 81 as if it\'s been opened there a thousand times. Maybe it has.',
            ],
            next: 'p81',
          },
          {
            text: 'Search the parlour. Turn to page 14.',
            hint: 'Start with the room he lived in.',
            art: '🛋️',
            outcome: [
              'Page 14 is only a flick away. There\'s a faint ring on it from the bottom of a mug, and a thumbprint, brown and old, in the corner.',
            ],
            next: 'p14',
          },
        ],
      },

      p14: {
        title: 'The Midnight Lodger — The Parlour',
        stamp: s => (s.has('reread') ? 'Page 14 (again)' : 'Page 14'),
        jump: 'page',
        art: '🛋️🎂',
        mood: 'candle',
        scene: 'house',
        enter: { set: ['v14', 'clue_age'] },
        text: s => (s.has('reread')
          ? [
            'You turn back to page 14 to check you didn\'t imagine it. You didn\'t. But it isn\'t the same page you read an hour ago.',
            say('The Book', 'The parlour is warm now. Someone is sitting in Mr Crane\'s armchair, reading a book. They have been sitting there a long time. They have a crick in their neck and a cold cup of tea they don\'t remember making.'),
            say('The Book', 'They do not look up. They think that if they look up, they will see something standing in the doorway.'),
            s.has('gasfire') ? say('The Book', 'The fire is lit. It is so warm. Why would anyone ever leave?') : say('The Book', 'The fire is not lit. It is so cold. Wouldn\'t it be nicer with the fire lit?'),
            'The ink is darker on this page than any other. You could swear it\'s wet. You don\'t look up at the doorway.',
            creep(s),
          ]
          : [
            say('The Book', 'The parlour of Number 9 is small and brown. There is an armchair with a dent in it, a mug with a tea ring, and a gas fire with one cracked bar. A radiator ticks like it\'s counting.'),
            say('The Book', 'On the mantelpiece is a single birthday card. On the front is a badge that says 74 TODAY. Mr Crane bought it for himself.'),
            'You read that twice.',
            'This book was printed in 1987. You look over the top of it, at Arthur\'s mantelpiece, at the shape of a card you can just make out in the lamplight.',
            fumes(s),
            'In the margin, in pencil, a 4 and a 7 are circled. Next to them, very small: *not yet.*',
          ]),
        choices: [
          {
            text: 'Climb the stairs. Turn to page 81.',
            hint: 'Small print under it: "If you have already been upstairs, turn to page 62 instead."',
            art: '🪜',
            if: '!reread',
            outcome: [
              s => (s.has('v81')
                ? 'But you have already been upstairs. The small print is in a smaller type than the rest, as if it were added later. The rules are the rules. You skip the stairs and turn to 62.'
                : 'You turn the page fast, the way you\'d walk fast past a dark doorway. 81. Stairs. Back in the story where things are made up.'),
            ],
            next: (s) => (s.has('v81') ? 'knock' : 'p81'),
          },
          {
            text: 'Look up from the book at the real mantelpiece',
            hint: 'Check. You have to check.',
            art: '🎂',
            if: s => !s.has('reread'),
            effect: grip(1),
            outcome: [
              'You put a finger in the page and get up. The floorboards creak under you exactly where you expect them to.',
              'The card is there on the mantel. **74 TODAY!** The cartoon badge. You open it again, half hoping the inside will say something different now. It doesn\'t. Printed verse, no name.',
              'When you sit back down, your finger has slipped. The book has fallen open somewhere else, and on the page in front of you, someone has underlined in pencil: *You looked, didn\'t you.*',
            ],
            next: s => (s.has('v81') ? 'knock' : 'p81'),
          },
          {
            text: 'Do what it wants. Turn to page 66.',
            hint: 'The page is tugging you towards the armchair. Towards rest.',
            art: '😴',
            if: 'reread',
            effect: grip(1),
            outcome: [
              'Page 66 is already where your thumb is. You didn\'t move your thumb.',
            ],
            next: 'p66',
          },
          {
            text: 'Close the book. Right now.',
            hint: 'Before it describes what\'s in the doorway.',
            art: '📕',
            if: 'reread',
            outcome: [
              'You slam it shut with both hands, the way you\'d trap a moth. The sound is very loud in the empty flat. In the silence after it, the radiator stops ticking for three whole seconds, then starts again.',
            ],
            next: 'closed',
          },
        ],
      },

      p81: {
        title: 'The Midnight Lodger — The Landing',
        stamp: s => (s.has('v9') ? 'Page 81 (again)' : 'Page 81'),
        jump: 'page',
        art: '🚪🚪🚪',
        mood: 'night',
        scene: 'stairwell',
        enter: { set: ['v81'] },
        text: [
          { if: 'v9', text: 'Back on page 81, your thumb still marking the place. The landing is exactly where you left it. The linen cupboard door is open now, just a crack. In the book, nothing ever closes it again.' },
          say('The Book', 'At the top of the stairs is a landing with three doors. One says STUDY in brass letters. One is a linen cupboard. One has no handle at all.'),
          say('The Book', 'Behind you, far below, the stairs creak. One step. Then another. Someone is coming up, slowly, the way old men climb stairs.'),
          'And outside Arthur\'s front door, out on the real stairwell of Corrin Court, a step creaks. Then another.',
          'You hold your breath. The steps stop. The building is very quiet. It\'s past midnight; there\'s no reason for anyone to be on the fourth floor.',
          { if: 'v14', text: 'At the bottom of the page, in small print you\'re sure wasn\'t there when you started: *If you have already searched the parlour, turn to page 62 instead.*' },
        ],
        choices: [
          {
            text: 'Hide in the linen cupboard. Turn to page 9.',
            hint: 'Let whoever it is go past.',
            art: '🫣',
            if: '!v9',
            outcome: [
              'You flick back to 9. It\'s a short page. The paragraphs get shorter as they go down, like someone running out of breath.',
            ],
            next: 'p9',
          },
          {
            text: 'Open the door marked STUDY. Turn to page 33.',
            hint: 'Detectives look for papers. Studies have papers.',
            art: '🗝️',
            outcome: [
              'You flip back through the forties. Somewhere around 46 the pages bunch under your thumb, thick and stiff, and then you\'re at 33.',
            ],
            next: 'p33',
          },
          {
            text: 'Go back down to the parlour. Turn to page 14.',
            hint: 'Away from whoever\'s on the stairs.',
            art: '🛋️',
            if: '!v14',
            outcome: [
              'You turn back to 14. Going down the stairs in the book, towards whatever is climbing up them. It doesn\'t feel like retreat. It feels like going to meet it.',
            ],
            next: 'p14',
          },
          {
            text: 'Do as the small print says. Turn to page 62.',
            hint: 'You have searched the parlour. The book knows.',
            art: '↪️',
            if: 'v14',
            outcome: [
              'The book knows which pages you\'ve read. Of course it does; that\'s how these books work, you tell yourself. You read the rules and you follow them. 62.',
            ],
            next: 'knock',
          },
        ],
      },

      p9: {
        title: 'The Midnight Lodger — The Linen Cupboard',
        stamp: 'Page 9',
        jump: 'page',
        art: '🫣💀',
        mood: 'blood',
        scene: 'corridor',
        fx: 'heartbeat',
        enter: { set: ['v9'] },
        fakeEnding: { title: 'Your Adventure Ends Here', type: 'death', note: 'Ending 1 of 23' },
        text: [
          say('The Book', 'You squeeze into the linen cupboard and pull the door to. It smells of mothballs and old sheets. The footsteps reach the landing.'),
          say('The Book', 'They stop outside the cupboard door. You hear breathing that is not your own. It is slow, and dry, and patient.'),
          say('The Lodger', 'Found you.'),
          say('The Book', 'The Midnight Lodger has found another detective. You will stay in the house on Larkin Lane for ever, folded on a shelf with the sheets.'),
          '**YOUR ADVENTURE ENDS HERE.**',
          'Under it, a tiny drawing of a skull with crosses for eyes. Every kid who ever owned this book has seen that skull.',
        ],
        choices: [
          {
            text: 'Read the pencil scrawled under the skull',
            hint: 'Someone crossed out YOUR ADVENTURE ENDS HERE.',
            art: '✏️',
            outcome: [
              'Someone has scored through the printed words, hard enough to dent the paper. Beside the skull, in pencil:',
              say('Arthur', 'No it doesn\'t. Not this time. Turn to page 61. I\'ve left you a note.'),
              'You turn to 61. It isn\'t a printed page any more.',
            ],
            next: 'p61h',
          },
          {
            text: 'Cheat. Flip back to 81. Your thumb\'s still in it.',
            hint: 'Every kid who owned this book did exactly this.',
            art: '👍',
            outcome: [
              'You never actually took your thumb out of page 81. Nobody ever did. You flip back, and the death never happened, and you\'re on the landing again with the footsteps on the stairs.',
              'Except the linen cupboard door, in the little illustration at the top of the page, is now standing open a crack.',
            ],
            next: 'p81',
          },
        ],
      },

      p33: {
        title: 'The Midnight Lodger — The Study',
        stamp: 'Page 33',
        jump: 'page',
        art: '🗄️✉️',
        mood: 'candle',
        scene: 'library',
        enter: { set: ['v33'] },
        text: [
          say('The Book', 'The study is cold. There is a desk under a window. The window has a crack in it shaped like a lightning bolt. Through it you can see the gasworks, and a single light in the flat across the road.'),
          'Larkin Lane, in the illustration, is a Victorian terrace. There are no gasworks on Larkin Lane. There is a gasworks outside Arthur\'s window, and the crack in his window is shaped like a lightning bolt.',
          say('The Book', 'On the desk lies an envelope. On the envelope, in handwriting, it says: TO THE READER.'),
          s => fumes(s),
          s => (s.has('gasfire') ? 'Your headache has moved behind your eyes. You blink, and the print swims, then settles.' : null),
          s => creep(s),
        ],
        choices: [
          {
            text: 'Open the envelope. It says "turn to page 61".',
            hint: 'Small print under the envelope picture.',
            art: '✉️',
            outcome: [
              'You turn to 61, and stop. Page 61 has been pasted over. A sheet of lined notepaper, glued at the corners, covered edge to edge in pencil. The same soft slanted hand as the inside cover.',
            ],
            next: 'p61h',
          },
          {
            text: 'Check the binding. Something was wrong in the forties.',
            hint: 'The pages bunched under your thumb on the way here.',
            art: '🔍',
            if: '!clue_stuck',
            set: ['clue_stuck'],
            outcome: [
              'You hold the book up to the lamp and bend the spine. 45, 46, and then a stiff thick leaf: **pages 47 and 48**, sealed to the pages either side along every edge. Not a spill. Neat, careful glue lines, like a kid making a secret.',
              'You get a fingernail under one corner and it starts to lift, with a sound like a plaster coming off, and then',
              'someone knocks on the door of the flat.',
            ],
            next: 'knock',
          },
          {
            text: 'Look up at Arthur\'s real window',
            hint: 'The crack. The gasworks. The light across the road.',
            art: '🪟',
            effect: grip(1),
            outcome: [
              'You get up and cross to it. The lightning-bolt crack runs corner to corner, exactly as drawn. Beyond it the gasworks, black against orange cloud.',
              'And in the flat across the road, one light is on. In the window, a shape. Someone sitting in an armchair, holding something up close to their face, the way you hold a book when your eyes are going.',
              'The light goes off. You go back to the chair, and the book, and the envelope on page 33 that tells you to turn to 61.',
            ],
            next: 'p61h',
          },
        ],
      },

      p61h: {
        title: 'Lined Paper, Pasted In',
        stamp: 'Page 61 (handwritten)',
        jump: 'page',
        art: '✏️📝',
        mood: 'candle',
        scene: 'apartment',
        enter: { set: ['v61', 'clue_mirror'] },
        text: [
          'Whatever was printed on page 61 is gone under a sheet of lined paper. The pencil is soft and shaky. Old hands. The letters lean against each other for support.',
          say('Arthur', 'If you\'re reading this, you\'re in my flat. You\'re in my chair, probably. Everyone sits in the chair. That\'s all right.'),
          s => (s.has('gasfire')
            ? say('Arthur', 'You\'ve lit the fire, haven\'t you. Everybody does. Man from the gas board stuck a sticker on it in March. Turn it off. I mean it.')
            : say('Arthur', 'Don\'t light the fire. Man from the gas board stuck a sticker on it in March. I never listen either.')),
          say('Arthur', 'I wrote this book in 1987 for my girl. I hid her one page in it. The page nobody sends you to. No choice leads there; you have to find it. She never did. She stopped playing, and then she stopped visiting, and then she was in Toronto.'),
          'And at the bottom, squeezed in as an afterthought, a little different, as if written another night:',
          say('Arthur', 'Funny thing. The page nobody sends you to is my age, back to front. I\'ll be that old on my birthday. I always meant to give her the book then. Daft.'),
        ],
        choices: [
          {
            text: 'Write back in the margin: "Who are you?"',
            hint: 'You\'ve been here before. Maybe he\'ll answer this time.',
            art: '✍️',
            if: s => s.found() >= 2,
            outcome: [
              'There\'s a pencil stub in the armchair\'s side pocket, worn down to the length of your thumb. You write in the margin of the lined paper, small, feeling foolish: *Who are you?*',
              'You put the pencil down. You look away, at the window, for a slow count of ten.',
              'When you look back, there\'s a line under yours that wasn\'t there before.',
            ],
            next: 'p61r',
          },
          {
            text: 'Do as he says. Turn the gas fire off.',
            hint: 'There\'s a yellow sticker on the side. You didn\'t look.',
            art: '🧯',
            if: 'gasfire',
            unset: ['gasfire'],
            set: ['fireoff'],
            effect: grip(-1),
            outcome: [
              'You kneel by the fire. There, on the side panel, a yellow sticker: **DANGER: DO NOT USE. CONDEMNED.** You turn the knob hard to off. The orange fades to grey and ticks as it cools.',
              'The ache behind your eyes eases almost at once, like a hand taken off your head. You open the window a crack, and the cold air smells of rain and the gasworks, and you have never been so glad of cold.',
              'As you get up off your knees, someone knocks on the door of the flat.',
            ],
            next: 'knock',
          },
          {
            text: 'Peel off the lined page and pocket it',
            hint: 'It\'s a letter. A real one. It shouldn\'t go in a bin bag.',
            art: '🗂️',
            set: ['torn_note'],
            outcome: [
              'The glue is old and lets go easily. Underneath, the printed page 61 has been scratched out so hard the paper is furred. You fold Arthur\'s note in four and put it in your shirt pocket, against your chest.',
              'It feels like taking someone\'s hand. Then someone knocks on the door of the flat.',
            ],
            next: 'knock',
          },
          {
            text: 'Keep going. Turn to page 62.',
            hint: 'The arrow at the bottom of the lined paper points onward.',
            art: '➡️',
            effect: grip(1),
            outcome: [
              'At the bottom of Arthur\'s note is a little pencil arrow pointing at the corner of the page. You turn it. You\'re halfway to 62 when someone knocks on the door of the flat.',
            ],
            next: 'knock',
          },
        ],
      },

      // ------------------------------------------------------------------ THE KNOCK (NOT A PAGE)
      knock: {
        title: '2:14 AM — The Front Door',
        stamp: 'Not a page',
        jump: 'glitch',
        art: '🚪🫖',
        mood: 'night',
        scene: 'corridor',
        fx: 'shake',
        enter: { set: ['knocked', 'clue_age'] },
        text: [
          'Three knocks. Real ones. On Arthur\'s front door, at fourteen minutes past two in the morning.',
          'You stand in the hall with the book still in your hand, your finger in the page, and you don\'t open the door. Then a voice comes through the letterbox, Irish and indignant.',
          say('Mrs Dunmore', 'I can see your light under the door, you know! It\'s Maureen Dunmore, from 3B. I\'ve brought you a tea. Nobody should clear out a dead man\'s flat without a tea.'),
          'You open it. A small woman in a quilted dressing gown, holding a mug that says WORLD\'S OKAYEST GRAN. She hands it over and peers past you into the flat like she\'s inspecting your work.',
          say('Mrs Dunmore', 'Seventy-four, he was. On the day. His birthday, can you imagine. Sat in that chair. Peaceful, the doctor said.'),
          s => (s.has('gasfire')
            ? 'She stops. Sniffs. Her face changes completely.'
            : 'She looks at the gas fire, cold and grey, and nods at it as if it\'s behaving itself.'),
          s => (s.has('gasfire') ? say('Mrs Dunmore', 'Have you got that fire on? Mother of God. That fire\'s condemned, love. There\'s a sticker on it!') : null),
        ],
        choices: [
          {
            text: 'Ask her about Arthur, and his daughter',
            hint: 'She knew him. Neighbours always know.',
            art: '👵',
            set: ['ellie_known'],
            effect: grip(-1, (s) => { if (s.has('gasfire')) { s.unset('gasfire'); s.set('fireoff'); } }),
            outcome: [
              { if: 'fireoff', text: 'She marches past you and turns the fire off herself, then opens the window, talking the whole time.' },
              say('Mrs Dunmore', 'Ellie. Lovely girl. Clever. Too clever for him, he used to say. They had a falling out when she was nineteen, I never knew what about. Then she went to Canada and that was that. Twenty-odd years.'),
              say('Mrs Dunmore', 'He used to say the door was always open. But he never rang her, did he, and she never rang him. Two stubborn eejits. She\'s coming for the keys at eight. She won\'t come up. She told the agent she can\'t.'),
              'She pats your arm and goes back downstairs. The tea is very sweet. It\'s the nicest thing that\'s happened all night.',
            ],
            next: 'p62',
          },
          {
            text: 'Show her the book',
            hint: 'Ask if she knows what it is.',
            art: '📖',
            set: ['dunmore_book'],
            effect: (s) => { if (s.has('gasfire')) { s.unset('gasfire'); s.set('fireoff'); } },
            outcome: [
              { if: 'fireoff', text: 'First she pushes past you and turns the fire off, muttering, and props the window open with a saucer.' },
              'She sees the cover and goes quiet. She doesn\'t touch it.',
              say('Mrs Dunmore', 'He wrote that. Did you know? For his Ellie, years back. He read it out loud, every night these last few years. The floors are thin. *Turn to page this, turn to page that.* Like a bedtime story. I used to fall asleep to it.'),
              say('Mrs Dunmore', 'And every night, at the end, the same thing. *She never found it.* Then the light would go off.'),
              'She looks at you holding it. She looks at you sitting back down in his chair.',
              say('Mrs Dunmore', 'Don\'t stay up too late with it, love.'),
            ],
            next: 'p62',
          },
          {
            text: 'Thank her, and close the door quickly',
            hint: 'You were in the middle of a page.',
            art: '🚪',
            effect: grip(1),
            outcome: [
              'You take the tea, say thanks, say you\'re fine, say you\'ve got a lot to get through. She opens her mouth to say something else and you close the door on it, gently.',
              s => (s.has('gasfire') ? 'Through the door, you hear her say *the fire, love, the fire*, and then her slippers going away down the stairs. The fire purrs behind you. It\'s so warm in here now.' : 'You hear her slippers go away down the stairs. You\'re already back in the chair, already finding your page.'),
            ],
            next: 'p62',
          },
        ],
      },

      // ------------------------------------------------------------------ ACT TWO: THE BOOK KNOWS
      p62: {
        title: 'The Midnight Lodger — Who Is Reading',
        stamp: 'Page 62',
        jump: 'page',
        art: '📖👁️',
        mood: 'void',
        scene: 'apartment',
        fx: 'glitch',
        text: [
          'There is no Larkin Lane on page 62. No detective. No illustration. Just print, dense and black.',
          say('The Book', 'You are not a detective. You are sitting in a dead man\'s armchair at half past two in the morning, with a cup of someone else\'s tea going cold by your foot.'),
          s => (s.has('knocked') && !s.has('ellie_known') && !s.has('dunmore_book')
            ? say('The Book', 'A kind woman knocked, and you shut the door on her. That was the right thing to do. Nobody else needs to be here.')
            : say('The Book', 'A kind woman came to the door. She talked too much. They always do.')),
          s => (s.has('gasfire') ? say('The Book', 'The fire is lit. You are warm. Your head aches a little. That is only tiredness.') : say('The Book', 'The window is open. It is cold. You should close it, and light the fire.')),
          say('The Book', 'The Midnight Lodger lives in the walls of the house. He comes up the stairs when a reader stays too long. You have stayed too long.'),
          'Out on the real stairwell, the slow steps start again. One. Another. Somewhere around the third floor.',
          s => creep(s),
          { if: clues, text: 'Your eyes keep sliding to the edge of the book, where the stuck leaf makes a thick ridge. Seventy-four. Back to front. Nobody sends you there. You know which page it is.' },
        ],
        choices: [
          {
            text: 'Turn to page 47. The page nobody sends you to.',
            hint: 'No choice leads there. You\'ll have to go by yourself.',
            art: '🗝️',
            if: clues,
            outcome: [
              'No instruction on this page says 47. That\'s the point. You stop doing what you\'re told.',
              'You find the stiff leaf by feel, and you work your fingernail under the corner, and pull.',
            ],
            next: 'p47',
          },
          {
            text: 'Go back to page 14. Read the parlour again.',
            hint: 'It said this room. Check what it says now.',
            art: '🔁',
            if: '!reread',
            set: ['reread'],
            effect: grip(1),
            outcome: [
              'You flip back to 14 to prove to yourself that it\'s just a book, that page 14 is still a made-up parlour on a made-up street.',
            ],
            next: 'p14',
          },
          {
            text: 'To meet the footsteps, turn to page 88.',
            hint: 'Small print under it: "If you have already visited page 33, turn to page 90 instead."',
            art: '👣',
            effect: grip(1),
            outcome: [
              s => (s.has('v33')
                ? 'But you have been in the study. You know about the crack in the window. The small print lets you skip the stairs altogether: 90. The book is being generous. That frightens you more than the footsteps.'
                : 'You turn to 88. Behind you, on the other side of Arthur\'s front door, the footsteps reach the fourth-floor landing.'),
            ],
            next: (s) => (s.has('v33') ? 'p90' : 'p88'),
          },
          {
            text: 'Close the book and get on with the job',
            hint: 'It\'s a book. You have forty boxes to fill.',
            art: '📦',
            if: s => !deep(s),
            outcome: [
              'You shut it. You put it face down on the arm of the chair, which feels like turning your back on someone. Then you get up and start on the kitchen.',
            ],
            next: 'closed',
          },
        ],
      },

      p66: {
        title: 'The Midnight Lodger — The Armchair',
        stamp: 'Page 66',
        jump: 'page',
        art: '🪑💤',
        mood: 'ember',
        scene: 'apartment',
        fx: 'heartbeat',
        timer: 8,
        text: [
          say('The Book', 'You sit back in the armchair, and rest your eyes. The chair holds you like a hand. It is so very warm.'),
          s => (s.has('gasfire')
            ? 'It is warm. Too warm. The fire\'s purr has filled the room. Your headache is a band of iron now, and your thoughts move like they\'re wading. The words on the page swim and lie down.'
            : 'It isn\'t warm. The flat is cold, the window cracked open, and yet your eyelids are so heavy. The print swims. Your chin dips.'),
          say('The Book', 'You think: this is what he felt. You think: this is where he was. You think: just one more page.'),
          { if: 'gasfire', text: 'Somewhere far off, a part of your brain that is still awake says, very clearly: *headache, drowsy, condemned fire*. It says it the way you\'d say it about someone else.' },
          'Your eyes are closing.',
        ],
        timeout: {
          text: 'You drifted off.',
          fx: 'redflash',
          outcome: [
            'The book slides down your knee. The radiator ticks. Your head tips sideways onto the wing of the chair, into the exact dent Arthur\'s head left in it.',
            s => (s.has('gasfire') ? 'You don\'t hear the fire purring. You don\'t hear anything at all.' : 'You jerk awake with a gasp at the sound of three slow knocks. The book is on the floor, open at page 88.'),
          ],
          next: (s) => (s.has('gasfire') ? 'end_sleep' : 'p88'),
        },
        choices: [
          {
            text: 'Get up. Open the window. Breathe.',
            hint: 'Move. Cold air. Now.',
            art: '🪟',
            set: ['window'],
            effect: grip(-1, (s) => { if (s.has('gasfire')) { s.unset('gasfire'); s.set('fireoff'); } }),
            outcome: [
              'You get up so fast you stagger, and you shove the window up as far as it will go. Cold air and rain on your face. You gulp it like water.',
              { if: 'fireoff', text: 'You turn and see the fire. *DANGER: DO NOT USE.* The yellow sticker has been there all night. You kill it with the knob and stand shaking in the draught while the bars go grey.' },
              'Then, from the front door, three slow knocks.',
            ],
            next: 'p88',
          },
          {
            text: 'Just one more page',
            hint: 'You can keep your eyes open for one more page.',
            art: '📖',
            effect: grip(1),
            outcome: [
              'You turn the page. The words are so soft. You read them twice, then a third time, and they don\'t stay put.',
              s => (s.has('gasfire') ? 'You are aware, the way you\'re aware of weather in another country, that the book has slipped out of your hands.' : 'Three slow knocks come from the front door and jolt you upright, heart going, book clutched to your chest.'),
            ],
            next: (s) => (s.has('gasfire') ? 'end_sleep' : 'p88'),
          },
          {
            text: 'Hurl the book across the room',
            hint: 'It\'s doing this. Get it away from you.',
            art: '💥',
            set: ['thrown'],
            fx: 'shake',
            outcome: [
              'You fling it. It hits the wall by the door, flaps like a shot bird, and lands spread open on the hall carpet.',
              'The anger wakes you up. You stand there breathing hard, and then you go and pick it up, because it\'s open, and it\'s open at page 88, and somebody has just knocked three times on the front door.',
            ],
            next: 'p88',
          },
        ],
      },

      // ------------------------------------------------------------------ ACT THREE: THE LODGER
      p88: {
        title: 'The Midnight Lodger — Three Knocks',
        stamp: 'Page 88',
        jump: 'page',
        art: '🚪✊',
        mood: 'blood',
        scene: 'stairwell',
        fx: 'heartbeat',
        timer: 8,
        text: [
          say('The Book', 'The Midnight Lodger has reached the top of the stairs. He knocks three times. He is patient. He has knocked on this door before.'),
          'And at the same moment, as you read it, three knocks on Arthur\'s front door. Not Mrs Dunmore\'s brisk rap. Slow. Knuckles that know the wood.',
          say('The Lodger', 'It\'s only me. Let me in. I live here.'),
          say('The Book', 'To open the door, turn to page 90. To hide, turn to page 9.'),
          { if: 'v9', text: 'Page 9. The linen cupboard. You already know how that one ends.' },
          s => creep(s),
          { if: clues, text: 'Your thumb is on the stuck leaf. Forty-seven. It isn\'t on the menu. It never was.' },
        ],
        timeout: {
          text: 'You froze.',
          fx: 'redflash',
          outcome: [
            'You don\'t move. You can\'t. You sit in the dead man\'s chair with the dead man\'s book, and you listen to the latch of the front door lift on its own, with a click you know from a hundred evenings that aren\'t yours.',
            'Cold air from the stairwell. You get up. You go and look.',
          ],
          next: 'landing',
        },
        choices: [
          {
            text: 'Turn to page 47',
            hint: 'Nobody sends you there. Go anyway.',
            art: '🗝️',
            if: clues,
            outcome: [
              'You ignore the door. You ignore the book\'s two choices. You get your nail under the corner of the stuck leaf and peel, and the old glue lets go with a sigh, and the knocking stops.',
            ],
            next: 'p47',
          },
          {
            text: 'Open the real door yourself',
            hint: 'Not the book\'s door. Arthur\'s. See who it is.',
            art: '🚪',
            outcome: [
              'You put the book down on the chair. You walk down the hall. You turn the latch and pull the door open on whoever is there.',
            ],
            next: 'landing',
          },
          {
            text: 'Do what it says. Turn to page 90.',
            hint: 'Open the door in the book. It\'s only a book.',
            art: '📖',
            effect: grip(1),
            outcome: [
              'You turn to 90. In the book, the detective opens the door. In the flat, the knocking stops, mid-knock, as if whoever it was has been let in.',
            ],
            next: 'p90',
          },
          {
            text: 'Burn it. Kitchen sink. Now.',
            hint: 'Matches by the hob. Arthur\'s pipe matches.',
            art: '🔥',
            if: s => s.get('grip') <= 3,
            outcome: [
              'You run for the kitchen with the book held away from your body. Pipe matches in a tin by the hob. Your hands shake so badly the first two snap.',
              'The third catches. You hold it under the corner of the cover until the cardboard curls and blackens and takes, and you drop the whole thing in the steel sink and watch it burn.',
            ],
            next: 'end_burn',
          },
        ],
      },

      landing: {
        title: '3:33 AM — The Fourth-Floor Landing',
        stamp: 'Page 81 (again)',
        jump: 'back',
        art: '🧓🎂',
        mood: 'fog',
        scene: 'stairwell',
        fx: 'glitch',
        text: [
          'The landing of Corrin Court\'s fourth floor is page 81.',
          'Three doors: Arthur\'s, a linen cupboard with a slatted door you\'ve never noticed, and one with no handle at all. The stairwell light is on its timer, buzzing. And coming up the last flight, one hand on the rail, slowly, the way old men climb stairs: a man in a brown cardigan, carrying a cake box from the supermarket and a battered paperback under his arm.',
          'He is seventy-four today. You know it without being told. He doesn\'t see you. He\'s looking at his feet, at each step, counting them under his breath like page numbers.',
          'It is three weeks ago. It is his last night. And you are standing in his doorway.',
        ],
        choices: [
          {
            text: 'Shout at him: "Don\'t light the fire!"',
            hint: 'He can\'t hear you. Shout anyway.',
            art: '📣',
            set: ['warned'],
            outcome: [
              'You shout it so loud it echoes down six floors of stairwell. *DON\'T LIGHT THE FIRE.*',
              'He stops on the top step. He lifts his head, and for a second he looks straight at you, through you, with Ellie\'s clever eyes in a tired old face. He smiles a little.',
              say('Arthur', 'I know, love. I know. I never listen.'),
              'The timer light clicks off. When it buzzes back on, the stairs are empty, and you\'re standing in the doorway in your socks with the book open in your hand. It\'s open at page 90.',
            ],
            next: 'p90',
          },
          {
            text: 'Step aside and follow him inside',
            hint: 'Watch. Find out what happened to him.',
            art: '👣',
            outcome: [
              'You stand back against the wall to let him past. He goes by close enough that you smell pipe tobacco and cold air and supermarket sponge cake, and he doesn\'t see you at all.',
              'You follow him into his own flat.',
            ],
            next: 'end_detective',
          },
        ],
      },

      p90: {
        title: 'The Midnight Lodger — The Line',
        stamp: 'Page 90',
        jump: 'page',
        art: '✒️📜',
        mood: 'void',
        scene: 'attic',
        text: [
          say('The Book', 'The Midnight Lodger is not a monster. The Midnight Lodger is simply the one who stays. Every house has one. Every house needs one.'),
          say('The Book', 'Somebody has to sit in the chair. Somebody has to keep the radiator company. Somebody has to read the book every night, out loud, to nobody.'),
          say('The Book', 'Write your name on the line below, and you can stay too. It will always be warm. Nobody will ever leave you again.'),
          'Under the print, a ruled line. Above it, in pencil, eleven names, each crossed out, some so old they\'ve faded to silver. The last one is **Arthur Penhale**, written very neatly and crossed out very hard.',
          s => (s.has('warned') ? 'You still have his face in your head from the landing. *I know, love. I never listen.*' : null),
          s => creep(s),
          'There is a pencil stub in the armchair\'s side pocket. Your hand has already found it.',
        ],
        choices: [
          {
            text: 'Turn to page 47',
            hint: 'Not this line. That page.',
            art: '🗝️',
            if: clues,
            outcome: [
              'You put the pencil down on the line, uncapped, unused. Then you turn back through the book, past the 60s and 50s, to the stiff thick leaf in the 40s, and you peel it apart.',
            ],
            next: 'p47',
          },
          {
            text: 'Write your name on the line',
            hint: 'It would be warm. Nobody would leave.',
            art: '✍️',
            effect: grip(5),
            outcome: [
              'You write your name. Your handwriting looks like someone else\'s. Neater. Older. The graphite shines.',
              'The radiator stops ticking.',
            ],
            next: 'end_bound',
          },
          {
            text: 'Close the book. Open the window. Do your job.',
            hint: 'Someone is coming for the keys at eight.',
            art: '🪟',
            outcome: [
              'You close the book on the pencil, so it holds the page like a bookmark that will never be used. You push the window up, all the way.',
              'The rain has stopped. The cold air smells of wet roofs. Far off over the gasworks, the sky is a tired shade of grey that means morning is thinking about it.',
              'You put the book on the windowsill, and you pick up a box.',
            ],
            next: 'end_lastbox',
          },
        ],
      },

      closed: {
        title: '2:51 AM — Flat 4B',
        stamp: 'No page',
        jump: 'forward',
        art: '📦📕',
        mood: 'night',
        scene: 'kitchen',
        text: [
          'Kitchen. Boxes. Tape gun. One mug, one plate, one of everything, wrapped in newspaper. It\'s good to have your hands busy.',
          'But you can see the book from here, face down on the arm of the chair. And every few minutes, in the quiet, you hear it. The soft dry *tk* of a page turning over on its own.',
          s => (s.has('gasfire') ? 'The fire is still on in the living room. You can feel it on the back of your neck from here. Your head throbs when you bend down.' : 'The flat is cold. Your breath shows faintly in the kitchen light.'),
          'You go and check. It\'s face down. It hasn\'t moved. You go back to the kitchen. *Tk.*',
        ],
        choices: [
          {
            text: 'Burn it in the sink',
            hint: 'Arthur\'s pipe matches are right by the hob.',
            art: '🔥',
            outcome: [
              'You fetch it at arm\'s length. You strike a pipe match and hold it under the cover until the cardboard curls and takes, and drop it in the steel sink. The pages lift and blacken and turn over on their own, faster and faster, like someone speed-reading.',
            ],
            next: 'end_burn',
          },
          {
            text: 'Tape it into a box, unread. For the daughter.',
            hint: 'It\'s not yours. It never was.',
            art: '📦',
            set: ['boxed'],
            outcome: [
              s => (s.has('gasfire') ? 'On the way to fetch it, you kill the gas fire, because the ache in your head has started to frighten you. You open the window too. The cold is a relief.' : 'You fetch it from the chair. It\'s warmer than it should be.'),
              'You wrap it in a page of newspaper, like the mugs, and put it in a small box on its own, and tape the box shut, and write on the top in marker: **ELLIE**.',
              'The page-turning stops.',
            ],
            effect: (s) => { if (s.has('gasfire')) { s.unset('gasfire'); s.set('fireoff'); } },
            next: 'end_lastbox',
          },
          {
            text: 'Open it again. Just to see where it\'s got to.',
            hint: 'It\'s been turning its own pages. Where to?',
            art: '📖',
            effect: grip(1),
            outcome: [
              'You turn it over. It falls open in your hands, at page 88. The page is still warm, like someone was just reading it.',
              'Three slow knocks on the front door.',
            ],
            next: 'p88',
          },
        ],
      },

      // ------------------------------------------------------------------ THE HIDDEN PAGE
      p47: {
        title: 'Page Forty-Seven',
        stamp: 'Page 47',
        jump: 'page',
        art: '🗝️📖',
        mood: 'gold',
        weather: 'dust',
        scene: 'apartment',
        fx: 'flash',
        text: [
          'The leaf comes apart with a sigh of old glue. It\'s printed, like every other page. Same typeface. Same cheerful capitals. But there\'s no Larkin Lane on it, and no detective, and no Lodger.',
          say('Arthur', 'Well done, Ellie-bean. Nobody sends you to this page. No choice in the whole book leads here. You had to find it yourself, which means you are cleverer than the book, and cleverer than me.'),
          say('Arthur', 'Here is the secret. There is no Midnight Lodger. There never was. The Lodger is just what happens to a house when people stop talking in it.'),
          say('Arthur', 'So close the book. Come and find me. Whatever time it is, I\'ll put the kettle on. Love, Dad.'),
          'Underneath, decades newer, in soft shaky pencil, the last thing he ever wrote in it:',
          say('Arthur', 'Still true. Kettle\'s on. A., 74.'),
          'Out on the stairwell, there are no footsteps. The radiator has stopped ticking. Over the gasworks, the sky is going grey.',
        ],
        choices: [
          {
            text: 'Fold the corner down, so she\'ll find it',
            hint: 'Ellie\'s coming for the keys at eight.',
            art: '📐',
            set: ['folded'],
            outcome: [
              'You fold the top corner of page 47 into a neat little triangle, the way every kid who ever owned a gamebook marked the place they were scared to lose.',
              'Then you open the window, and turn off every light but one, and start on the boxes, faster than you\'ve ever worked, because now there\'s somewhere this has to get to.',
            ],
            next: 'end_47',
          },
          {
            text: 'Read it out loud, to the empty chair',
            hint: 'Someone should hear it said.',
            art: '🗣️',
            set: ['aloud'],
            outcome: [
              'You stand up, because it feels wrong to do this sitting in his chair. You read page 47 out loud to the dent in the cushion, all of it, *Ellie-bean* and *kettle\'s on*.',
              'Your voice cracks on *Dad*. When you finish, the flat is completely silent. Then, in the chair, the dent in the cushion slowly fills and smooths out, the way a cushion does when someone finally gets up.',
            ],
            next: 'end_47',
          },
        ],
      },

      // ------------------------------------------------------------------ MEMORY ROUTE (2+ endings found)
      p61r: {
        title: 'Lined Paper, Answered',
        stamp: 'Page 61 (your handwriting)',
        jump: 'glitch',
        art: '✍️✏️',
        mood: 'candle',
        scene: 'apartment',
        text: [
          'Under your *Who are you?*, in the soft, slanted, shaking hand:',
          say('Arthur', 'You know who. You keep sitting in my chair. Night after night. Every time a different ending. I hear you turning the pages.'),
          s => (s.seen('your-adventure-ends-here') ? say('Arthur', 'I saw you fall asleep by my fire. Don\'t do that again. It was horrible to watch, and I should know.') : null),
          s => (s.seen('second-edition') ? say('Arthur', 'I saw you sign the line. I crossed you out. You\'re welcome.') : null),
          s => (s.seen('out-of-print') ? say('Arthur', 'You burnt me once. That\'s all right. I\'d have burnt me too.') : null),
          say('Arthur', 'Can I ask you something. Nobody has read to me since Ellie was nine. I read it every night to the walls. Would you read it to me? From the beginning. Out loud. I\'d like to hear it in somebody else\'s voice.'),
          'The radiator has stopped ticking. It\'s listening.',
        ],
        choices: [
          {
            text: 'Turn back to page 1, and read it aloud',
            hint: 'Every page. Every voice. All of it.',
            art: '📖',
            outcome: [
              'You clear your throat, feeling ridiculous, and start. *It is raining on Larkin Lane.*',
              'By the end of the first page you\'ve stopped feeling ridiculous.',
            ],
            next: 'readaloud',
          },
          {
            text: 'Write: "Not tonight." Turn to page 62.',
            hint: 'You came here to clear a flat.',
            art: '➡️',
            outcome: [
              'You write it and feel like you\'ve slammed a door. The reply, when it comes, is one word: *Fair.* You turn the page. Somebody knocks on the front door.',
            ],
            next: 'knock',
          },
        ],
      },

      readaloud: {
        title: '3:00 AM — Story Time',
        stamp: 'Page 1 (read aloud)',
        jump: 'back',
        art: '🗣️🪑',
        mood: 'candle',
        weather: 'dust',
        scene: 'apartment',
        text: [
          'You read it the way he must have, sitting forward, doing the voices. The detective is brave and slightly stupid. The Lodger is a dry whisper. You make the stairs creak with your tongue.',
          'You realise you\'re reading to the chair across from you, the hard-backed visitor\'s chair nobody has sat in for twenty years. Somewhere around page 33, you notice there\'s a dent in its cushion.',
          'Downstairs, through the thin floor, you hear Mrs Dunmore\'s radio go quiet, as if she\'s turned it down to listen.',
          'You reach the end of page 81. The book says: *to hide, turn to page 9; to open the study, turn to page 33.* You have the whole book to read, and the whole night left, and a choice about how to do it.',
        ],
        choices: [
          {
            text: 'Read him every page in order, 1 to 100',
            hint: 'All of it. Even the deaths. Especially the deaths.',
            art: '📚',
            set: ['all_pages'],
            outcome: [
              'You read every single page, in order, all 23 deaths, every *YOUR ADVENTURE ENDS HERE*. You do a different voice for every skull. Around page 70 you hear, very clearly, someone in the room laugh.',
            ],
            next: 'end_bedtime',
          },
          {
            text: 'Play it properly. Ask him which page to turn to.',
            hint: 'It\'s his book. Let him choose.',
            art: '🎲',
            outcome: [
              'You say it out loud: *Which one, Arthur? 9 or 33?* And you wait. The book twitches in your hands and falls open at 33. You grin like a kid. You read on, and at every choice you ask, and every time the pages move.',
            ],
            next: 'end_bedtime',
          },
          {
            text: 'Skip to the page nobody sends you to. Read him 47.',
            hint: 'He wrote it for her. He never got to hear it read.',
            art: '🗝️',
            if: clues,
            set: ['read47'],
            outcome: [
              'You peel the stuck leaf apart and read page 47 aloud. *Well done, Ellie-bean.* When you get to *kettle\'s on*, the kettle in the kitchen clicks, all by itself, and starts to hiss.',
            ],
            next: 'end_bedtime',
          },
        ],
      },

      // ------------------------------------------------------------------ ENDINGS
      end_sleep: {
        title: '8:04 AM — Flat 4B',
        stamp: 'Page 66',
        jump: 'page',
        art: '🪑💀',
        mood: 'void',
        scene: 'apartment',
        fx: 'glitch',
        ending: { id: 'your-adventure-ends-here', title: 'Your Adventure Ends Here', type: 'death' },
        text: [
          'At four minutes past eight, a woman in her forties stands on the pavement outside Corrin Court, waiting for someone to bring her the keys. Nobody comes down.',
          'At ten past, Mrs Dunmore lets her in with the spare. They find you in the armchair, in the dent, your head on the wing of the chair where his was. The gas fire is still purring. Three bars orange, one grey. A yellow sticker on the side: **DANGER: DO NOT USE.**',
          s => (s.has('knocked') && !s.has('ellie_known') && !s.has('dunmore_book') ? 'Mrs Dunmore will tell the inquest she knocked at two and smelled it, and said *the fire, love*, and the door was closed on her. She will tell it for the rest of her life.' : 'Mrs Dunmore will tell the inquest she knew that fire was a devil. She will tell it for the rest of her life.'),
          s => (s.has('torn_note') ? 'In your shirt pocket, folded in four, is a sheet of lined paper that says, in soft pencil: *Don\'t light the fire.*' : null),
          'The book is on the floor by your foot, open at page 66. Ellie picks it up before anyone can stop her. She knows the cover. She hasn\'t seen it since she was nine.',
          'At the bottom of page 66, under the print, someone has written in fresh pencil: *I told you. I\'m so sorry.* And under that, the old familiar capitals: **YOUR ADVENTURE ENDS HERE.**',
        ],
      },

      end_burn: {
        title: '8:00 AM — Outside Corrin Court',
        stamp: 'No page',
        jump: 'forward',
        art: '🔥📦',
        mood: 'dawn',
        weather: 'ash',
        scene: 'street',
        ending: { id: 'out-of-print', title: 'Out of Print', type: 'neutral' },
        text: [
          'It burns fast, for something so old. The pages lift and curl and turn over on their own as they go, one after another, like a reader racing to the end.',
          s => (s.has('clue_stuck') || s.has('clue_mirror')
            ? 'The last part to go is a thick stiff leaf, glued shut. Pages 47 and 48. You know what that was, now, too late. You watch the corner of it blacken and you don\'t reach in. You can\'t make your hand do it.'
            : 'The last part to go is a thick, stiff leaf somewhere in the middle, glued shut along its edges. It burns slowly, from the outside in, and you never find out what was on it.'),
          'The footsteps on the stairs stop. The radiator stops ticking. The flat is just a flat. You fill forty boxes by half seven and run the tap over the ash until the sink is clean.',
          'At eight, a woman in a good coat is waiting on the pavement, not looking up at the fourth-floor window. You give her the keys. She thanks you. She nearly goes. Then she turns back.',
          say('Ellie', 'Was there a book? A kids\' book, a gamebook, sort of falling apart? He wrote it. For me. I never finished it. I thought maybe I would, now.'),
          { if: 'ellie_known', text: 'Mrs Dunmore told you she was clever. She looks it. She looks like someone who\'d have found the page.' },
          'You say no. There was no book. She nods, and walks away towards the station, and you stand on the pavement with ash under your fingernails.',
        ],
      },

      end_lastbox: {
        title: '8:00 AM — Outside Corrin Court',
        stamp: 'No page',
        jump: 'forward',
        art: '📦🌅',
        mood: 'dawn',
        weather: 'sparkles',
        scene: 'street',
        ending: { id: 'the-last-box', title: 'The Last Box', type: 'good' },
        text: [
          'You finish at twenty to eight. Forty boxes in the van, the carpet hoovered, the window open on a clean cold morning. The fire\'s off. The chair\'s the last thing to go, and before you carry it down, you sit in it one more time, and it\'s just a chair.',
          s => (s.has('boxed') ? 'One small box rides down on your knee, on its own, taped shut, with **ELLIE** written on the lid.' : 'One book rides down in your coat pocket, the pencil still inside it, holding page 90 shut.'),
          'She\'s on the pavement at eight exactly, in a good coat, not looking up at the window. You hand her the keys. Then you hand her the book.',
          'She knows it at once. She makes a sound you\'ll remember for years.',
          say('Ellie', 'Oh, the Lodger. Oh, God. He used to do the voice.'),
          'She flicks straight to the back. Page 100. Of course she does. She laughs, wetly, at the print: *Real detectives start at the beginning.*',
          say('Ellie', 'He always said there was a page I never found. I thought he made it up to annoy me. I was nine. Then I was nineteen, and we stopped talking about anything at all.'),
          { if: 'clue_mirror', text: 'You think of the lined paper on page 61. *The page nobody sends you to.* You almost tell her. But it\'s hers to find. You say: *He left notes in the margins. Read those.*' },
          'She holds it to her chest and walks to the station. At the corner she stops, and opens it, right there in the street, at page 1.',
        ],
      },

      end_bound: {
        title: 'Larkin Lane — For Ever',
        stamp: 'Page 90 (signed)',
        jump: 'glitch',
        art: '🏚️🕯️',
        mood: 'storm',
        weather: 'rain',
        scene: 'street',
        fx: 'glitch',
        ending: { id: 'second-edition', title: 'Second Edition', type: 'bad' },
        text: [
          'It is raining on Larkin Lane. It is always raining on Larkin Lane.',
          'You have a room at the top of the stairs at Number 9. It\'s warm. The radiator ticks. You have a chair with your shape in it and a book you read every night, out loud, to nobody. You are never lonely, exactly. You are never anything, exactly.',
          'Sometimes a reader stays too long. Then you go down, and come up the stairs again, slowly, the way you never used to, and you knock three times.',
          s => (s.has('gasfire') ? 'In Flat 4B, Corrin Court, at eight in the morning, they find a clearance worker asleep in the armchair, very warm, not waking. The fire was on. The fire is always on.' : 'In Flat 4B, Corrin Court, the clearance job is never finished. The agency sends someone else the next week. They find forty empty boxes, a cold cup of tea, and a book on the chair.'),
          'Some years later, somebody else clears out some other dead man\'s flat and finds a battered paperback down the side of a cushion. PICK YOUR PERIL No. 9. On page 1, where it used to say *YOU are a young detective*, it now says your name.',
          'On page 90, under eleven crossed-out names, there\'s a twelfth, very neat. Nobody has crossed it out. Arthur\'s been busy.',
        ],
      },

      end_detective: {
        title: '3:34 AM — Three Weeks Ago',
        stamp: 'Page 1',
        jump: 'back',
        art: '🧓📖',
        mood: 'ember',
        scene: 'apartment',
        fx: 'glitch',
        ending: { id: 'hello-detective', title: 'Hello, Detective', type: 'neutral' },
        text: [
          'He puts the cake box on the table without opening it. He lights the gas fire with a soft *whump*: three bars orange, one grey. He lowers himself into the armchair with a little groan, and opens the paperback at page 1.',
          'And he starts to read out loud.',
          say('Arthur', 'It is raining on Larkin Lane. YOU are a young detective...'),
          'He reads the parlour. He reads the landing. He reads the knock at the door, and a nosy neighbour with a mug of tea, and a reader who stayed too long, and he reads them in the exact order you lived them tonight. He reads *you follow him into his own flat.* He turns the page.',
          'He looks up. Straight at you.',
          say('Arthur', 'Hello, detective. You were always my favourite. Every night I let you get a little further.'),
          'You look down at your hands. In the light of the gas fire, they\'re drawn in pencil.',
          s => (s.has('cheat') ? say('Arthur', 'You peeked at the back, you know. She always did that too.') : say('Arthur', 'You played fair. Nobody plays fair.')),
          'He yawns. The fire purrs. His eyes are so heavy. You want to tell him about the sticker, about the fire, but detectives can only say what\'s on the page, and he is turning it, slowly, slower, and his hand stops halfway.',
          'It\'s raining on Larkin Lane. Somewhere, someone is clearing out a flat, and finds a book down the side of a chair, and opens it at page 1, and there you are again.',
        ],
      },

      end_47: {
        title: '8:00 AM — Flat 4B, Corrin Court',
        stamp: 'Page 47',
        jump: 'page',
        art: '🫖🌅',
        mood: 'dawn',
        weather: 'sparkles',
        scene: 'apartment',
        ending: { id: 'the-page-nobody-sends-you-to', title: 'The Page Nobody Sends You To', type: 'true' },
        text: [
          'She\'s on the pavement at eight exactly, in a good coat, not looking up at the window. You don\'t give her the keys. You give her the book, with your thumb in it.',
          s => (s.has('folded') ? 'She sees the folded corner before she sees anything else. She runs her thumb along the crease, and you watch her realise which page it is, and that it was never stuck by accident.' : 'She opens it where your thumb is, at the page that was glued shut for thirty-nine years.'),
          'She reads it standing on the pavement. *Well done, Ellie-bean.* She reads it twice. She gets to *Still true. Kettle\'s on. A., 74,* and she sits down on the low wall outside Corrin Court as if her legs have been taken away.',
          say('Ellie', 'Seventy-four. Forty-seven. Oh, you sneaky old... I looked for it for a year. I tore up the back pages looking for it. I accused him of lying.'),
          say('Ellie', 'I said I couldn\'t come up. I told the agent I couldn\'t.'),
          'She goes up. You carry nothing. You just go with her, four flights, and she stands in the living room with the window open and the radiator silent, and looks at the chair for a long time. Then she sits in it.',
          { if: 'aloud', text: 'The dent you watched smooth out in the night is gone. The cushion takes her shape instead.' },
          s => (s.has('ellie_known') || s.has('dunmore_book') ? 'Mrs Dunmore arrives ten minutes later in her quilted dressing gown, with two teas on a tray, and says *I heard footsteps I knew*, and doesn\'t explain, and doesn\'t need to.' : 'A woman from downstairs appears in the doorway in a quilted dressing gown, with two teas on a tray, as if she\'d been waiting twenty years for the sound of this particular pair of feet on the stairs.'),
          s => (s.has('torn_note') ? 'Before you go, you take the folded sheet of lined paper out of your shirt pocket and give her that too. She reads *I always meant to give her the book then.* She holds the book and the letter together, one in each hand, like she\'s weighing them, and they weigh the same.' : null),
          'You leave her the keys on the mantelpiece, next to a card that says **74 TODAY!** Behind you, as you go down the stairs, you hear the kettle go on.',
        ],
      },

      end_bedtime: {
        title: '6:12 AM — Flat 4B',
        stamp: 'Page 100 (read aloud)',
        jump: 'page',
        art: '🌙📖',
        mood: 'candle',
        weather: 'stars',
        scene: 'apartment',
        ending: { id: 'bedtime-story', title: 'Bedtime Story', type: 'secret' },
        text: [
          'You reach page 100 as the window turns from black to grey. *THERE IS NO ENDING ON THIS PAGE.* You read it in the book\'s cheerful voice, and then you close the book, gently, the way you close a door on someone sleeping.',
          s => (s.has('all_pages') ? 'Every page, every death, every skull. You did twenty-three different voices for the Lodger. Your throat is raw.' : s.has('read47') ? 'You read him the page he wrote for her. You read it last, and slowly, and the kettle in the kitchen has been hissing ever since.' : 'At every choice you asked him, and every time the pages moved. He chose the stairs every time. Of course he did.'),
          'The visitor\'s chair across from you creaks, the way a chair creaks when someone gets up out of it, carefully, with a hand on each arm. The dent in its cushion slowly fills.',
          'On the inside back cover, where there was nothing before, there\'s a line in soft pencil, very steady now, not shaking at all:',
          say('Arthur', 'Thank you. That was lovely. Night night. Tell her the page is 47. Tell her I wasn\'t lying.'),
          s => (s.seen('the-page-nobody-sends-you-to') ? 'You will. You know exactly how her face goes when she reads it. You\'ve seen it before.' : 'You don\'t know yet what it means. But you will, by eight o\'clock, when you hand a woman in a good coat a book with your thumb in it.'),
          'Downstairs, through the thin floor, Mrs Dunmore\'s radio comes back on. The radiator has stopped ticking. It doesn\'t need to count anything any more.',
        ],
      },
    },
  });
})();
