/*
 * Groundhog Shift — MysteryFate story.
 * You work the night shift at the Gas-N-Go on Route 9. At 11:47 PM a robber walks in; at 11:48 you're shot;
 * at 11:00 PM you're back behind the counter. The night repeats (max 5 loops) until it is finished properly.
 * Central truths: the robber is Wes Darrow, 19, who owes $3,000 to a loan shark called Duke. His gun is loaded
 * and his nerves are shot: it is the ice machine dumping its tray at 11:48 that makes him flinch and fire.
 * Deputy Kowalski always arrives at 11:52. The Man in the Grey Coat is Abel Finch, the station's night clerk
 * in 1979, who died at 11:48 and has been looping ever since. The night can only end if nobody dies in it.
 * Knowledge flags (k_*) persist across loops; per-loop flags (marla_ally, ticket) are wiped on every reset.
 * Wrapped in an IIFE so helpers stay out of global scope.
 */
(function () {
  'use strict';

  const MAX_LOOP = 5;
  const loop = (s) => s.get('loop');
  const final = (s) => s.get('loop') >= MAX_LOOP;
  const secretReady = (s) => s.has('k_grey') && s.has('k_why') && s.has('k_abel');

  registerStory({
    id: 'scifi-groundhog-shift',
    title: 'Groundhog Shift',
    category: 'scifi',
    tagline: 'At 11:48 you get shot. At 11:00 you clock in again.',
    description: 'You work the graveyard shift at a lonely highway gas station. Tonight a desperate kid with a gun walks in at 11:47, and at 11:48 you die. Then the radio plays the same song, the same trucker asks for the same gum, and you have one hour to get smarter.',
    cover: '🔁',
    accent: '#39ff88',
    ambient: 'scifi',
    scene: 'shop',
    warning: 'Contains: armed robbery, gunshots and repeated (non-graphic) deaths, debt, mild peril.',
    voices: {
      narrator: { gender: 'male', pitch: 0.95, rate: 1.02, accent: 'en-US', note: 'dry, wry late-night storyteller with a soft heart' },
      'You': { gender: 'neutral', pitch: 1.05, rate: 1.05, accent: 'en-US', note: 'tired night clerk, getting sharper every loop' },
      'Wes': { gender: 'male', pitch: 1.12, rate: 1.25, accent: 'en-US', note: '19, terrified, talks too fast, voice cracking' },
      'Marla': { gender: 'female', pitch: 0.82, rate: 0.95, accent: 'en-US', note: 'gruff long-haul trucker, gravel voice, misses nothing' },
      'Deputy Kowalski': { gender: 'male', pitch: 0.9, rate: 0.85, accent: 'en-US', note: 'bored small-town deputy, mouth full of donut' },
      'The Man in Grey': { gender: 'male', pitch: 0.7, rate: 0.82, accent: 'en-GB', note: 'calm, ancient patience, says less than he knows' },
      'Abel': { gender: 'male', pitch: 0.75, rate: 0.85, accent: 'en-GB', note: 'the Man in Grey, finally himself: warm, tired, relieved' },
      'Gum Guy': { gender: 'male', pitch: 1.05, rate: 1.15, accent: 'en-AU', note: 'cheerful trucker who says the same line every loop' },
      'Radio DJ': { gender: 'female', pitch: 1.1, rate: 1.2, accent: 'en-US', volume: 0.8, note: 'syrupy late-night FM host, slightly tinny' },
      'Dispatcher': { gender: 'female', pitch: 1.0, rate: 1.1, accent: 'en-CA', note: 'county dispatch, unimpressed, chewing something' },
    },
    vars: { loop: 1 },
    hud: [{ var: 'loop', label: 'Loop', icon: '🔁', max: MAX_LOOP }],
    start: 'intro',
    scenes: {
      // ------------------------------------------------------------------ LOOP ONE
      intro: {
        title: '11:00 PM — Gas-N-Go, Route 9',
        scene: 'gas-station',
        art: '⛽',
        mood: 'neon',
        weather: 'dust',
        text: [
          'Tonight, at 11:47 PM, a kid with a gun is going to walk into the Gas-N-Go. At 11:48, you are going to be shot. You do not know this yet. You are busy losing a staring contest with a hot-dog roller.',
          'The Gas-N-Go is the last light for forty miles of Route 9: four pumps, a buzzing canopy, and a shop that smells of burnt coffee and pine air freshener. The radio is playing *Total Eclipse of the Heart*. It is always playing *Total Eclipse of the Heart*.',
          'In the booth by the window, Marla the trucker is working through a slab of cherry pie like it owes her money. In the corner, a man in a long grey coat sits behind a coffee he has not touched. He was here when you clocked in. You are fairly sure he was here when you were hired.',
          'The door chimes. A sunburnt trucker in a kangaroo cap slaps the counter.',
          { speaker: 'Gum Guy', say: 'G\'day! Pack of the spearmint, mate. Not the peppermint. Peppermint is for cowards.' },
          'The clock above the cigarettes says 11:00. Forty-seven minutes left. Of your shift, you assume.',
        ],
        choices: [
          {
            text: 'Sell him the spearmint',
            hint: 'The customer is always right. Even about mint.',
            art: '🍬',
            outcome: [
              'You ring up the spearmint. A dollar sixty-nine. He pays in coins he finds in four separate pockets, one of which contains a live cricket.',
              { speaker: 'Gum Guy', say: 'Legend. You have a ripper of a night, yeah?' },
              'He winks and goes. The cricket stays, chirping from behind the lottery machine. You decide it is your new co-worker.',
            ],
            next: 'hour',
          },
          {
            text: 'Defend the honour of peppermint',
            hint: 'Somebody has to.',
            art: '🌿',
            outcome: [
              { speaker: 'You', say: 'Peppermint is the gum of champions, actually.' },
              { speaker: 'Gum Guy', say: 'Champions of what? Losing? Spearmint. Final answer.' },
              'You sell him the spearmint. You lose the argument. In the booth, Marla snorts into her pie, which you choose to take as support.',
            ],
            next: 'hour',
          },
        ],
      },

      // ------------------------------------------------------------------ THE RESET
      fail: {
        enter: {
          effect: (s) => {
            if (s.get('loop') >= MAX_LOOP) s.set('stuck');
            else { s.add('loop', 1); s.unset('marla_ally', 'ticket'); }
          },
        },
        redirect: (s) => (s.has('stuck') ? 'end_forever' : 'rewind'),
      },

      rewind: {
        title: '11:00 PM — Gas-N-Go, Again',
        scene: 'shop',
        art: '🔁',
        mood: 'neon',
        fx: 'glitch',
        text: [
          (s) => (loop(s) === 2
            ? 'You gasp. You are standing behind the counter. There is no hole in your chest. There is no blood on the scratch cards. The clock says 11:00, and the radio is playing *Total Eclipse of the Heart*.'
            : loop(s) === 3
              ? 'Gasp. Counter. Clock: 11:00. *Turnaround, bright eyes.* You are starting to hate Bonnie Tyler on a personal level.'
              : loop(s) === 4
                ? 'Eleven o\'clock. Again. Your body arrives back in the room a beat before your mind does, like a dog that ran ahead. You know where every fly in this shop is going to land.'
                : 'Eleven o\'clock. The fifth time. The light looks thinner tonight, like an old photocopy of itself. Even the hot dogs look tired.'),
          'Pie in the booth. Grey coat in the corner. The door chimes, right on time.',
          { speaker: 'Gum Guy', say: 'G\'day! Pack of the spearmint, mate. Not the peppermint. Peppermint is for cowards.' },
          { if: 'k_ice', text: 'Before anything else, you walk to the ice machine by the drinks fridge and yank its plug out of the wall. It wheezes and dies. *Not tonight, you plastic murderer.*' },
          { if: (s) => s.has('k_grey') && loop(s) < MAX_LOOP, text: 'In the corner, the Man in Grey lifts his untouched coffee an inch, like a toast. *Welcome back.*' },
          {
            if: final,
            text: [
              'And then, for the first time, the Man in Grey gets up. He crosses to the counter and lays a hand flat on it, gently, like a doctor.',
              { speaker: 'The Man in Grey', say: 'This is the last one I can hold open for you. After this the night sets, like concrete. Whatever you do this time is what you do forever.' },
              'He goes back to his corner. The coffee is still steaming. It has been steaming since you got here.',
            ],
          },
        ],
        choices: [
          {
            text: 'Say his line before he does',
            hint: 'Spearmint. Cowards. You know.',
            art: '😏',
            outcome: [
              { speaker: 'You', say: 'Spearmint, not the peppermint, peppermint is for cowards. A dollar sixty-nine. Mind the cricket.' },
              'The trucker stares at you. He looks down at his pocket. The cricket chirps.',
              { speaker: 'Gum Guy', say: 'Mate. Are you a psychic? Do my star sign. No, don\'t. I don\'t wanna know.' },
              'He leaves the exact change and backs out of the door. Marla watches the whole thing over her pie, one eyebrow raised a quarter of an inch, which for Marla is a standing ovation.',
            ],
            next: 'hour',
          },
          {
            text: 'Grab his collar: "What day is it?"',
            hint: 'Maybe this time it will be a different answer.',
            art: '📅',
            outcome: [
              { speaker: 'Gum Guy', say: 'Uh. Tuesday? The fourteenth? Mate, you\'re crumpling me good shirt.' },
              'Tuesday the fourteenth. It was Tuesday the fourteenth last time, too. You let go and smooth the shirt out. He buys the spearmint very fast and does not wait for his change.',
              { if: (s) => loop(s) >= 3, text: 'You make a mental note to stop doing this. You made the same note last loop.' },
            ],
            next: 'hour',
          },
          {
            text: 'Print a lottery ticket with Marla\'s numbers',
            hint: 'You heard tonight\'s draw. Tonight hasn\'t drawn yet.',
            if: (s) => s.has('k_lotto') && !s.has('ticket'),
            set: ['ticket'],
            art: '🎟️',
            outcome: [
              'You sell the trucker his spearmint, then punch six numbers into the lottery machine yourself: **4, 8, 15, 23, 31, 42**. The machine thinks about it and spits out a pink ticket. You pay the two dollars from your own tip jar.',
              'It is the most obvious cheat in the history of time. You fold it into your shirt pocket anyway, over the place where the bullet goes.',
              { speaker: 'The Man in Grey', say: 'It only counts if there\'s a tomorrow to cash it in.' },
              'You didn\'t know he could hear you from over there. You didn\'t say anything out loud.',
            ],
            next: 'hour',
          },
          {
            text: 'Sit down on the floor. Stop.',
            hint: 'You are so tired.',
            if: (s) => loop(s) >= 3,
            art: '🪑',
            outcome: [
              'You let the trucker find his own gum. You slide down behind the counter until you are sitting on the sticky lino with your back against the cigarette drawers, and you just... stop.',
              'Above you, the clock ticks. The hot dogs turn. *Turnaround, bright eyes.* Nobody comes to see where the clerk went, because nobody ever does.',
              'After a while, a pair of grey shoes appears beside you. The coat folds down. He sits on the floor too, his knees cracking like old furniture.',
            ],
            next: 'give_up',
          },
        ],
      },

      give_up: {
        title: '11:20 PM — Behind the Counter',
        scene: 'shop',
        art: '🧥',
        mood: 'void',
        text: [
          'Down here, the shop is mostly the underside of things: chewing gum stuck to the shelf, a lost lighter, a mousetrap that caught a receipt. The Man in Grey sits beside you with his hands folded, as if he has sat on a great many floors.',
          { speaker: 'The Man in Grey', say: 'I sat down too, once. For a few years.' },
          { speaker: 'You', say: 'Years?' },
          { speaker: 'The Man in Grey', say: 'Nights. Same thing, after a while. Here is what I learned: if you stop, it doesn\'t stop. It just stops needing you.' },
          'He says it kindly. That is the worst part. Out in the lot, a pair of headlights is circling. Twenty-seven minutes.',
        ],
        choices: [
          {
            text: 'Let 11:48 come. Let it be the last time.',
            hint: 'Maybe dying properly is a way out.',
            art: '🕯️',
            outcome: [
              { speaker: 'You', say: 'Then let it stop needing me.' },
              'He looks at you for a long time. Then he nods, the way you nod at someone getting off a train at a stop that isn\'t yours.',
              { speaker: 'The Man in Grey', say: 'All right. I\'ll stay with you. Nobody stayed with me.' },
            ],
            next: 'end_last_shift',
          },
          {
            text: 'Get up. One more try.',
            hint: 'Your knees hurt. Good. Feeling things is good.',
            art: '🧍',
            outcome: [
              'You grab the edge of the counter and haul yourself up. Your knees crack louder than his did. He smiles, which is a thing you have never seen him do.',
              { speaker: 'The Man in Grey', say: 'There it is. That\'s the clerk I was waiting for.' },
              'Twenty-six minutes. You have wasted twenty, which in this job is about average.',
            ],
            next: 'hour',
          },
        ],
      },

      // ------------------------------------------------------------------ THE HOUR
      hour: {
        title: '11:05 PM — The Long Hour',
        scene: 'shop',
        art: '🕚',
        mood: 'neon',
        text: [
          (s) => (loop(s) === 1
            ? 'The trucker is gone. The cricket is singing. The night stretches out in front of you, long and flat as Route 9. You have forty-odd minutes to kill before your break, and three ways to kill them.'
            : 'Forty-two minutes until 11:47. You have learned the hard way that it is enough time for exactly one real conversation, if you don\'t waste it.'),
          (s) => (loop(s) === 1
            ? 'Marla is on her second slice. The man in the grey coat is looking at the ice machine like it said something rude. The back office door is ajar: Donna the manager left her paperwork *for you to finish, hon, thanks*. And out in the lot, a dented silver Civic has circled the pumps three times without stopping.'
            : 'Marla, pie, booth. The Man in Grey, coffee, corner. Donna\'s back office, safe, paperwork. And the silver Civic in the lot, circling like a shark that failed shark school.'),
          { if: 'k_name', text: 'The Civic belongs to Wes. You know his name now. It makes it worse, somehow, watching him circle.' },
          { if: 'k_debt', text: 'Three thousand dollars to a man called Duke, by midnight. That\'s what\'s in the Civic with him.' },
          { if: 'k_deputy', text: 'Deputy Kowalski will roll in at 11:52 with powdered sugar on his chin. Four minutes too late. Always four minutes too late.' },
          { if: (s) => s.has('k_grey') && !s.has('k_why'), text: 'The Man in Grey is the only other thing in here that knows it\'s the same night. You\'re sure of it. He hasn\'t blinked at you once since you started noticing.' },
          { if: 'k_why', text: 'He has been sitting in that corner since 1979. Every time you look over, you can\'t stop thinking about how many nights that is.' },
          { if: 'ticket', text: 'The lottery ticket crinkles in your pocket every time you breathe.' },
          { if: final, text: '*Last one,* he said. You count your knowledge like coins in a palm. Is it enough?' },
        ],
        choices: [
          {
            text: 'Sit with Marla in the booth',
            hint: 'Truckers see everything. Marla sees more.',
            art: '🥧',
            outcome: [
              'You pour two coffees, slide into the booth across from Marla, and push one over. She looks at it, then at you, then at the empty shop.',
              { speaker: 'Marla', say: 'You\'re either lonely or you want something. Sit. I can do both.' },
            ],
            next: 'marla_booth',
          },
          {
            text: 'Join the man in the grey coat',
            hint: 'His coffee is still steaming. It\'s been an hour.',
            art: '☕',
            outcome: [
              'You walk over to the corner table. Up close, the grey coat is older than you thought: wide lapels, a fifty-year-old cut, worn shiny at the cuffs. The man inside it looks up as if you are exactly on time.',
              { speaker: 'The Man in Grey', say: 'Sit down. You\'re making the place look untidy.' },
            ],
            next: 'grey_corner',
          },
          {
            text: 'Do Donna\'s paperwork in the back office',
            hint: 'There\'s a safe back there. And old photos.',
            art: '🗄️',
            outcome: [
              'The back office is the size of a generous closet: a desk, a wall calendar of kittens in teacups, a filing cabinet, and a squat black safe with a combination dial. Above it all, a wall of framed photos going back decades.',
              'You sit in Donna\'s chair. It squeaks a squeak you will hear in your dreams.',
            ],
            next: 'back_office',
          },
          {
            text: 'Step out to the lot and check the Civic',
            hint: 'It\'s circling for a reason.',
            scene: 'gas-station',
            art: '🚗',
            outcome: [
              'You prop the door open with a crate of windscreen fluid and walk out under the canopy. The air smells of diesel and cold desert. The lights hum like a migraine.',
              'The silver Civic pulls into the dark end of the lot by the air pump and kills its lights. Nobody gets out.',
            ],
            next: 'lot',
          },
        ],
      },

      marla_booth: {
        title: '11:10 PM — Booth Two',
        scene: 'shop',
        art: '🥧',
        mood: 'night',
        text: [
          'Marla is somewhere between fifty and indestructible, in a flannel shirt with the sleeves rolled to the elbow and a cap that says **KEEP ON TRUCKIN\'** in letters worn to ghosts. She eats pie like it\'s a job.',
          { speaker: 'Marla', say: 'Nineteen years I\'ve stopped here. You\'re the first clerk who ever brought the coffee to me. So. Spit it out.' },
          { if: (s) => loop(s) >= 2, text: 'You know what she\'s going to say before she says it. She\'s going to complain about her knee. She\'s going to call the pie *structurally unsound*. She\'s going to be right.' },
        ],
        choices: [
          {
            text: 'Ask about the kid in the silver Civic',
            hint: 'She\'s been watching the lot. She\'s always watching.',
            set: ['k_name'],
            art: '👀',
            outcome: [
              { speaker: 'Marla', say: 'The Civic? He bought five bucks of gas at ten and he\'s been circling since. Kid\'s wearing a Burger Barn shirt. Name tag says WES. Hands shaking like a wet dog.' },
              'She forks more pie, unconcerned.',
              { speaker: 'Marla', say: 'Either he\'s working up the nerve to ask somebody to prom, or he\'s working up the nerve to do something dumb. And there\'s no prom on Route 9.' },
              '*Wes.* You turn the name over in your head. It\'s a small name. A kid\'s name. It doesn\'t fit with a gun at all.',
            ],
            next: 'robbery',
          },
          {
            text: 'Ask about her lottery ticket',
            hint: 'She\'s got one tucked in her cap band.',
            set: ['k_lotto'],
            art: '🎟️',
            outcome: [
              'Marla pulls the pink ticket out of her cap band and waves it at you like a tiny flag.',
              { speaker: 'Marla', say: 'Same numbers every week for nineteen years. My kids\' birthdays. Never won a dime. The draw\'s on the radio at quarter past. Shush.' },
              'At 11:15 the DJ comes on. You listen without meaning to, the way you listen to anything in this shop at night.',
              { speaker: 'Radio DJ', say: 'And tonight\'s Powerball, my darlings: four... eight... fifteen... twenty-three... thirty-one... and the Powerball, forty-two! Somebody out there just got very rich. Wasn\'t me.' },
              { speaker: 'Marla', say: 'Wasn\'t me either. Nineteen years.' },
              '**4, 8, 15, 23, 31, 42.** You write them on your hand in biro. Then you realise the ink won\'t come back with you, and you say them over and over in your head instead.',
            ],
            next: 'robbery',
          },
          {
            text: 'Warn her: "At 11:47, a kid robs this place."',
            hint: 'She won\'t believe you. Unless you prove it.',
            if: (s) => loop(s) >= 2,
            set: ['marla_ally', 'k_deputy'],
            art: '⚠️',
            outcome: [
              { speaker: 'Marla', say: 'Uh huh. And I suppose you also know my knee\'s been—' },
              { speaker: 'You', say: '—acting up since Tucson, the pie is structurally unsound, and in ten seconds the cricket behind the lottery machine is going to chirp twice.' },
              'The cricket chirps twice. Marla puts her fork down very slowly.',
              { speaker: 'Marla', say: 'Okay. Okay. Say it all again, slower.' },
              'You tell her. 11:47, the kid, the gun, the bang. She listens like a mechanic listens to an engine. When you\'re done, she drums her fingers.',
              { speaker: 'Marla', say: 'Then you need Kowalski. Except Kowalski stops at the Donut Hut at half eleven, every night, regular as death, and he rolls in here at 11:52 with sugar on his face. Four minutes late to everything since 1998.' },
              { speaker: 'Marla', say: 'Fine. I\'ll be in the booth. You give me a nod, I\'ll handle the kid. I\'ve handled worse with a tyre iron.' },
            ],
            next: 'robbery',
          },
        ],
      },

      grey_corner: {
        title: '11:10 PM — The Corner Table',
        scene: 'shop',
        art: '🧥',
        mood: 'void',
        text: [
          'The man in the grey coat is somewhere past seventy, with a face like a kindly closed door. His hands are folded around a paper cup. The coffee in it is steaming. It was steaming when you clocked in.',
          { if: '!k_grey', text: 'He doesn\'t say anything. He watches the ice machine by the drinks fridge with an expression of polite dislike.' },
          { if: 'k_grey', text: { speaker: 'The Man in Grey', say: 'You\'ve worked it out, then. Your eyes give it away. Everybody\'s eyes go the same way, the first time they notice.' } },
          { if: final, text: { speaker: 'The Man in Grey', say: 'Make it count. I mean that kindly.' } },
        ],
        choices: [
          {
            text: 'Ask what he\'s waiting for',
            hint: 'He keeps watching the ice machine.',
            set: ['k_ice'],
            art: '🧊',
            outcome: [
              { speaker: 'The Man in Grey', say: 'Me? Nothing. You, though. You should be waiting for the ice.' },
              { speaker: 'You', say: 'The... ice.' },
              { speaker: 'The Man in Grey', say: 'That machine dumps its tray at 11:48 exactly. Loudest sound in the building. Bang. Nervous people with heavy things in their hands should not hear a bang.' },
              'You look at the ice machine. It hums at you, innocent, bulbous, avocado-green. Then you go over and pull its plug out of the wall. It wheezes and dies. He nods, as if you\'ve passed a very small exam.',
            ],
            next: 'robbery',
          },
          {
            text: 'Offer him a fresh coffee',
            hint: 'His has been steaming for an hour. That isn\'t how coffee works.',
            set: ['k_grey'],
            art: '☕',
            outcome: [
              'You put a fresh cup in front of him. He looks at it with real surprise, the way you\'d look at a letter from someone long dead.',
              { speaker: 'The Man in Grey', say: 'That\'s kind. Nobody\'s done that in a while.' },
              { speaker: 'You', say: 'How long a while?' },
              { speaker: 'The Man in Grey', say: 'Well. Let\'s just say I\'ll see you at eleven.' },
              'He doesn\'t mean tomorrow. You know he doesn\'t mean tomorrow. The hairs on your arms stand up all at once, like a crowd.',
            ],
            next: 'robbery',
          },
          {
            text: '"You\'re looping too, aren\'t you?"',
            hint: 'Say it out loud.',
            if: 'k_grey',
            set: ['k_why'],
            art: '🔁',
            outcome: [
              'He is quiet for so long you think he won\'t answer. Then he turns the paper cup a quarter-turn on the table, a habit worn so deep it\'s almost a groove.',
              { speaker: 'The Man in Grey', say: 'October the fourteenth, 1979. I was the clerk. A boy came in at 11:47 with his father\'s revolver, and the ice machine went off at 11:48, and that was that. Different machine. Same spot.' },
              { speaker: 'The Man in Grey', say: 'The night won\'t close if anybody dies in it. And somebody always has, ever since. So it keeps opening. And I keep sitting here. I can\'t leave until somebody finishes the shift properly and clocks me out.' },
              { speaker: 'You', say: 'Clocks you out how?' },
              { speaker: 'The Man in Grey', say: 'I don\'t know. I\'ve forgotten my own name. That\'s what forty-seven years of the same hour does. Turn your back on it and it wears away, like a step.' },
            ],
            next: 'robbery',
          },
        ],
      },

      back_office: {
        title: '11:12 PM — Donna\'s Office',
        scene: 'shop',
        art: '🗄️',
        mood: 'office',
        text: [
          'Donna\'s desk is a geological record of receipts. A sticky note on the monitor says **DO NOT GIVE ANYONE THE SAFE CODE (YOU DON\'T KNOW IT, HON)**. The safe squats under the desk. The kitten calendar has one date circled in red pen with a little heart: June 14th.',
          'Above the filing cabinet, the photo wall: forty years of Employees of the Month in cheap brass frames, getting browner and blurrier as they go back in time.',
          { if: 'k_code', text: 'You already know the safe code. 0-6-1-4. Donna\'s birthday. Donna is not a security professional.' },
          'Out front, the radio swells. *Every now and then I fall apart.* The clock on the wall says 11:12.',
        ],
        choices: [
          {
            text: 'Work out the safe code',
            hint: 'Donna circled a date with a heart. Donna.',
            set: ['k_code'],
            art: '🔢',
            outcome: [
              'You kneel at the safe. June 14th. You spin the dial: 0, 6, 1, 4. Something thunks inside, heavy and satisfying.',
              'Inside: the night\'s float, three rubber-banded bricks of twenties for the armoured car, and a bag of Donna\'s personal emergency licorice. You count the bricks. **$3,100.**',
              'You close it again and spin the dial. Your heart is going a little fast, and you can\'t quite say why the number $3,100 feels like it\'s going to matter.',
            ],
            next: 'robbery',
          },
          {
            text: 'Study the old photo wall',
            hint: 'The oldest frame is almost too faded to read.',
            set: ['k_abel'],
            art: '🖼️',
            outcome: [
              'You run your eyes back through time. Donna, 2019, holding a giant novelty cheque. A mullet, 1991. A man with a moustache, 1984. And at the very end, almost brown with age, a young man in a grey work coat with wide lapels, smiling like he has just been told a joke.',
              'Under it, typed on a curling strip of label tape: **ABEL FINCH. EMPLOYEE OF THE MONTH. OCTOBER 1979.** And under that, smaller, in pen, by a different hand: *Gone too soon. We miss you, Abe.*',
              { if: 'k_grey', text: 'You know that face. You\'ve been pouring it coffee. You stand very still in Donna\'s office, and out front, through the open door, an old man in a grey coat sits in the corner and does not look round.', else: 'Something about the coat nags at you. You don\'t know what. You look at the photo long enough that the name sticks: *Abel Finch.*' },
            ],
            next: 'robbery',
          },
        ],
      },

      lot: {
        title: '11:15 PM — The Lot',
        scene: 'gas-station',
        art: '🚗',
        mood: 'night',
        weather: 'dust',
        text: [
          'The Civic sits in the dark beyond the canopy, engine ticking. Through the windscreen you can see a phone screen lighting up a young, thin face, and lighting it up again, and again. Somebody wants him very badly.',
          'Beside the car, the air pump. Beyond it, nothing but desert and Route 9, a grey ribbon going nowhere in both directions.',
          { if: 'k_name', text: 'Wes. That\'s Wes. Nineteen, Burger Barn shirt, hands like a wet dog.' },
        ],
        choices: [
          {
            text: 'Knock on his window',
            hint: 'Friendly. Clerk-ish. Non-threatening.',
            set: ['k_debt'],
            art: '✊',
            outcome: [
              'You knock. He jumps so hard he hits his head on the roof. The window comes down two inches.',
              { speaker: 'Wes', say: 'I\'m — I\'m just waiting for a friend. Is that — I can wait here, right? Is there a law?' },
              'His phone buzzes on the dash. The screen says **DUKE** and then, underneath, a message preview: *3K by midnight or I come find your mom\'s place.*',
              'He sees you see it. He slaps the phone face-down and the window goes up. But you saw his face first. It wasn\'t the face of a robber. It was the face of a kid who has done the maths a hundred times and keeps getting the same answer.',
            ],
            next: 'robbery',
          },
          {
            text: 'Note his plate and call the sheriff',
            hint: 'Let the professionals handle it.',
            set: ['k_deputy'],
            art: '📞',
            outcome: [
              'You read the plate in the light of the pumps, go back inside and dial the county line on the shop phone.',
              { speaker: 'Dispatcher', say: 'County. A car is... parked. At a gas station. Okay. I\'ll send Kowalski when he\'s done his break. He\'s at the Donut Hut. He\'ll be there 11:52. He\'s always there 11:52.' },
              { speaker: 'You', say: 'Can he come any sooner?' },
              { speaker: 'Dispatcher', say: 'Honey, Kowalski has not come sooner to anything since 1998.' },
              'She hangs up. 11:52. You write it on the back of your hand. Four minutes after 11:48. Remember that.',
            ],
            next: 'robbery',
          },
        ],
      },

      // ------------------------------------------------------------------ 11:47
      robbery: {
        title: '11:47 PM — The Robbery',
        scene: 'shop',
        art: '🔫',
        mood: 'neon',
        fx: 'heartbeat',
        text: [
          (s) => (loop(s) === 1
            ? 'At 11:47 the door chimes. A kid in a hoodie and a Burger Barn shirt walks in fast, with his hand in his pocket and his eyes too wide. Then the hand comes out, and it isn\'t empty.'
            : 'At 11:47 the door chimes, exactly as you knew it would. Same hoodie. Same shaking hands. Same gun, a big old revolver that looks too heavy for his wrist.'),
          { speaker: 'Wes', say: 'Okay — okay — nobody move! Hands where I can — everybody just — the register! Open the register!' },
          { if: (s) => loop(s) >= 2, text: 'He says it exactly like last time, stumbling on the same words. You could mouth along. You don\'t. People with guns do not enjoy being mouthed along to.' },
          { if: 'marla_ally', text: 'In the booth, Marla has her hands up, slowly, theatrically. Her eyes are on you, waiting for the nod.' },
          { if: '!marla_ally', text: 'In the booth, Marla has frozen with a forkful of pie halfway to her mouth.' },
          { if: 'k_ice', text: 'Behind you, the ice machine sits dark and silent, unplugged. One bang fewer in the world.', else: 'Behind you, the ice machine hums its avocado-green hum.' },
          'In the corner, the Man in Grey hasn\'t moved at all. He is watching you, not the gun.',
        ],
        timer: 8,
        timeout: {
          text: 'You freeze.',
          art: '🧊',
          outcome: [
            'You freeze. Your hands won\'t go up and your mouth won\'t open and the kid is shouting and the clock ticks over to 11:48.',
            { if: 'k_ice', text: 'Even with the ice machine silent, your silence is its own kind of noise. He panics at the nothing. His finger moves.', else: 'Behind you, the ice machine dumps its tray. *CRASH.* The loudest sound in the world.' },
            'Bang.',
          ],
          next: 'shot',
        },
        choices: [
          {
            text: 'Open the register. Don\'t be a hero.',
            hint: 'Hands slow. Voice calm.',
            art: '💵',
            outcome: [
              'You put your hands up, then down, slowly, onto the register. *Ka-ching.* Two hundred and twelve dollars and change. You push it all across the counter.',
              { if: 'k_ice', text: 'The clock ticks to 11:48. You hold your breath. Behind you, the unplugged ice machine does absolutely nothing. It is the most beautiful nothing you have ever heard.', else: 'The clock ticks to 11:48. Behind you, the ice machine dumps its tray with a sound like a car crash. *CRASH.* The kid jerks. The gun jerks with him.' },
              { if: '!k_ice', text: 'Bang.' },
            ],
            next: (s) => (s.has('k_ice') ? 'register' : 'shot'),
          },
          {
            text: 'Say, gently: "Hi, Wes."',
            hint: 'You know his name.',
            if: 'k_name',
            art: '👋',
            outcome: [
              { speaker: 'You', say: 'Hi, Wes.' },
              'He stops dead. The gun stays up, but his face goes white under the strip lights.',
              { speaker: 'Wes', say: 'How do you — how do you know my name?' },
              { if: 'k_ice', text: 'The clock ticks to 11:48. The ice machine, dark and unplugged, says nothing. In the quiet, he can actually hear you.', else: 'The clock ticks to 11:48. Before you can answer, the ice machine dumps its tray. *CRASH.* He spins toward the noise, then back toward you, and his finger is already moving. Bang.' },
            ],
            next: (s) => (s.has('k_ice') ? 'standoff' : 'shot'),
          },
          {
            text: 'Give Marla the nod',
            hint: 'She said she\'s handled worse with a tyre iron.',
            if: 'marla_ally',
            art: '🫡',
            outcome: [
              'You look at Marla. You nod, once.',
              'Marla moves faster than any human being with a bad knee has any right to. She comes out of the booth like a freight train, pie fork still in her fist, roaring something about her nineteen years of custom.',
            ],
            next: 'tackle',
          },
          {
            text: 'Stamp on the silent alarm',
            hint: 'There\'s a button under the counter. For exactly this.',
            art: '🚨',
            outcome: [
              'You find the button with your foot and stamp on it. Help is coming. Help is—',
              'Somewhere in the ceiling, a fire bell the size of a dinner plate goes off. *BRRRRRRRRRRING.* It is not silent. It has never been silent. Donna wired it herself.',
              'The kid screams. The gun goes off. You have time for one very clear thought: *I am going to haunt Donna.*',
            ],
            next: 'shot',
          },
        ],
      },

      shot: {
        title: '11:48 PM — The Floor',
        scene: 'shop',
        art: '🩸',
        mood: 'blood',
        fx: 'redflash',
        text: [
          'You are on the floor. You don\'t remember getting there. The lino is cold against your cheek and the strip light above you is flickering, and there\'s a heat in your chest that\'s spreading out like spilled coffee.',
          'The door chimes. Sneakers on tarmac. A car engine, screaming away down Route 9.',
          { if: 'marla_ally', text: 'Marla is kneeling over you, yelling your name, pressing both her big hands down on your chest. You want to tell her she has pie on her sleeve.', else: 'Somewhere, Marla is shouting into a phone. The radio is still playing. *Turnaround.*' },
          { if: final, text: 'This time it feels different. Heavier. Like a door closing that is not going to open again.', else: 'You have perhaps ten seconds of seeing left. Spend them well.' },
        ],
        choices: [
          {
            text: 'Look at the man in the grey coat',
            hint: 'He still hasn\'t moved.',
            set: ['k_grey'],
            art: '🧥',
            outcome: [
              'You turn your head. Through the forest of chair legs, the man in the grey coat is sitting in his corner, perfectly calm, looking straight at you.',
              'He lifts his coffee an inch. He says something. You can\'t hear it, but you can read it on his lips: *See you at eleven.*',
              'Then the light goes out.',
            ],
            next: 'fail',
          },
          {
            text: 'Look at the kid\'s face',
            hint: 'Remember who did this.',
            set: ['k_name'],
            art: '🧑',
            outcome: [
              'He\'s at the door, half-turned, staring back at you with his mouth open. He looks about twelve. On his Burger Barn shirt there\'s a name tag, crooked: **WES**.',
              'He\'s crying. Of all the things you expected from the person who shot you, crying was not on the list.',
              'Then the light goes out.',
            ],
            next: 'fail',
          },
          {
            text: 'Listen. What made him flinch?',
            hint: 'There was a sound. Right before.',
            set: ['k_ice'],
            art: '👂',
            outcome: [
              'You play it back. The kid, the shouting, the register, and then a crash, huge, right behind you. Before the gun. The gun came *after*.',
              'Your eyes find it, on the edge of everything: the avocado-green ice machine by the drinks fridge, burbling smugly, a fresh tray of cubes rattling into its belly.',
              '*You,* you think, with the last of your thinking. *It was you.* Then the light goes out.',
            ],
            next: 'fail',
          },
        ],
      },

      // ------------------------------------------------------------------ PAST 11:48
      register: {
        title: '11:49 PM — The Register',
        scene: 'shop',
        art: '💵',
        mood: 'neon',
        text: [
          '11:49. You\'re alive. That alone feels like winning a car. The kid is stuffing twenties into his hoodie pocket with shaking hands, and counting, and counting again.',
          { speaker: 'Wes', say: 'Two hundred? That\'s it? That\'s — no. No, no, no. There\'s a safe. There\'s always a safe. Open the safe!' },
          { if: 'k_debt', text: 'Two hundred dollars. He needs three thousand by midnight, or Duke goes to his mother\'s house. You can see him doing the maths on his face.' },
          { if: 'k_code', text: '0-6-1-4. $3,100 in that safe. Almost exactly what he needs.' },
          { if: 'k_deputy', text: 'Three minutes until Kowalski. If you can make three minutes last.' },
        ],
        choices: [
          {
            text: 'Open the safe. Slowly.',
            hint: 'Very, very slowly.',
            if: 'k_code',
            art: '🔐',
            outcome: [
              'You kneel at the safe and spin the dial. Zero. Six. You overshoot. You start again. Zero.',
              { speaker: 'Wes', say: 'Faster! Come on!' },
              { speaker: 'You', say: 'It\'s old. It sticks. If I rush it, it locks out for an hour.' },
              'That is a complete lie, and he buys it, because he is nineteen and terrified. Six. One. Four. *Thunk.* Three bricks of twenties. He snatches them up and runs for the door.',
              { if: 'k_deputy', text: 'The clock says 11:52.', else: 'The clock says 11:50. Out in the lot, the Civic screams away into the dark. Two minutes later, a cruiser rolls in, and a deputy steps out, brushing powdered sugar off his chin, four minutes late.' },
            ],
            next: (s) => (s.has('k_deputy') ? 'arrest' : 'escaped'),
          },
          {
            text: 'Tell him you don\'t know the code',
            hint: 'It\'s the truth. Or it was.',
            art: '🤷',
            outcome: [
              { speaker: 'You', say: 'I don\'t know it. Honestly. Donna doesn\'t even tell me where the mop is.' },
              { if: 'k_code', text: 'It is a lie, this time. You can\'t tell if he can tell.' },
              'He doesn\'t believe you. He jams the gun across the counter, closer, closer, shaking worse, and his phone starts buzzing in his pocket — *DUKE, DUKE, DUKE* — and he flinches at the buzz the way he flinched at the ice.',
              'Bang.',
            ],
            next: 'shot',
          },
          {
            text: 'Ask him: "Who\'s Duke?"',
            hint: 'Talk to the kid, not the gun.',
            if: 'k_debt',
            art: '🗣️',
            outcome: [
              'His whole face changes. The gun stays up, but the kid behind it suddenly looks like he might be sick.',
              { speaker: 'Wes', say: 'How — how do you know about Duke?' },
              { speaker: 'You', say: 'I know a lot of things tonight. Let\'s talk.' },
              'He doesn\'t say yes. He doesn\'t pull the trigger either. In this job, that\'s practically a handshake.',
            ],
            next: 'deal',
          },
          {
            text: 'Tell him to run before the cops come',
            hint: 'Get the gun out of your shop. That\'s all that matters.',
            art: '🏃',
            outcome: [
              { speaker: 'You', say: 'Go. Now. There\'s a deputy on his way. Take the money and go.' },
              'He hesitates, half a second, staring at the safe. Then he bolts. The door chimes. The Civic howls out of the lot onto Route 9.',
              'You sag against the counter. You did it. You\'re alive. Marla lets out a breath that whistles.',
            ],
            next: 'escaped',
          },
        ],
      },

      escaped: {
        title: '11:58 PM — Route 9',
        scene: 'street',
        art: '🚨',
        mood: 'night',
        fx: 'shake',
        text: [
          'At 11:52, Kowalski\'s cruiser crunches into the lot. He waddles in with a cruller in one hand and the other on his holster, and says *Okay, what\'s the story?* in the tone of a man who hopes the story is short.',
          'At 11:58 the radio on his shoulder crackles. A silver Civic, Route 9, mile marker 40. Doing ninety. Didn\'t make the bend by the dry creek.',
          'Kowalski\'s cruller stops halfway to his mouth. Marla sits down very slowly in her booth. And in the corner, the Man in Grey closes his eyes, as if he\'s heard this exact news on this exact radio more times than he can count.',
          { speaker: 'The Man in Grey', say: 'Somebody died in it. The night won\'t close.' },
          { if: final, text: 'He says it gently. He says it like an apology.' },
        ],
        choices: [
          {
            text: 'Run out to the highway',
            hint: 'Maybe you can still—',
            scene: 'street',
            art: '🛣️',
            outcome: [
              'You run out past the pumps, past the air machine, onto the cold black edge of Route 9. Far off, at the bend, there\'s an orange glow on the horizon that shouldn\'t be there.',
              'The road stretches out in both directions, empty. The clock in the shop window ticks toward midnight, and then, instead of midnight, everything goes white.',
            ],
            next: 'fail',
          },
          {
            text: 'Ask the Man in Grey what you did wrong',
            hint: 'He knows. He always knows.',
            set: ['k_grey'],
            art: '🧥',
            outcome: [
              { speaker: 'You', say: 'I got him out of the shop. Nobody got shot. What did I do wrong?' },
              { speaker: 'The Man in Grey', say: 'You got him out of the shop. You didn\'t get him out of the night. That boy was never driving away from you. He was driving toward somebody called Duke.' },
              'He looks at the clock. 11:59. He doesn\'t seem afraid of it.',
              { speaker: 'The Man in Grey', say: 'See you at eleven.' },
            ],
            next: 'fail',
          },
        ],
      },

      standoff: {
        title: '11:48 PM — The Standoff',
        scene: 'shop',
        art: '🫱',
        mood: 'neon',
        fx: 'heartbeat',
        text: [
          '11:48 comes and goes. No crash. No bang. Just the hot dogs turning, and the radio, and a nineteen-year-old pointing a revolver at your heart from four feet away and asking how you know his name.',
          { speaker: 'Wes', say: 'Did Duke send you? Is this a — is this a test? Answer me! How do you know my name?' },
          'He\'s shaking so hard the gun is drawing little circles in the air. Little circles that keep passing through you.',
          { if: 'marla_ally', text: 'Marla is half out of the booth, waiting. You give her the tiniest shake of your head. *Not yet.*' },
          { if: 'k_deputy', text: 'Four minutes until Kowalski. Four minutes is a long time to keep a scared kid from doing something scared.' },
        ],
        timer: 9,
        timeout: {
          text: 'You hesitate.',
          art: '⏳',
          outcome: [
            'You open your mouth, and nothing useful comes out. The silence stretches. In the silence, Wes decides you are something worse than a clerk: a trap.',
            { speaker: 'Wes', say: 'You\'re with him. You\'re with Duke. Oh God—' },
            'He backs up, hits the gum display, and two hundred packets of spearmint go everywhere. The noise does it. Bang.',
          ],
          next: 'shot',
        },
        choices: [
          {
            text: '"I know about Duke. I know about the three grand."',
            hint: 'Show him you know what he\'s really scared of.',
            if: 'k_debt',
            art: '💸',
            outcome: [
              { speaker: 'You', say: 'I know about Duke. Three thousand by midnight, or he goes round to your mom\'s. I know, Wes.' },
              'The gun dips. Just a degree. His mouth trembles.',
              { speaker: 'Wes', say: 'I tried. I worked doubles. I sold my PlayStation. He keeps adding interest, he keeps adding — I didn\'t know what else to do.' },
              'He\'s crying now. The gun is still pointed at you. Both of these things are true at once, and you have to hold them both.',
            ],
            next: 'deal',
          },
          {
            text: '"I\'ve lived this night before. Watch."',
            hint: 'Prove it with the radio.',
            art: '📻',
            outcome: [
              { speaker: 'You', say: 'This is going to sound insane. I\'ve lived this night before. In five seconds, the DJ is going to dedicate a song to a trucker called Dave in Flagstaff. Listen.' },
              { speaker: 'Radio DJ', say: 'This one goes out to Trucker Dave in Flagstaff. Dave, she says she\'s sorry about the dog.' },
              'Wes stares at the radio. He stares at you. The gun is still up, but his whole body has gone very, very still, which is better than shaking.',
              { speaker: 'Wes', say: 'What... what are you?' },
              { speaker: 'You', say: 'Night shift.' },
            ],
            next: 'deal',
          },
          {
            text: 'Lunge for the gun',
            hint: 'He\'s distracted. It\'s four feet.',
            art: '🤜',
            outcome: [
              'You go over the counter in one move, like you\'ve seen people do in films. In films, there is not a rack of beef jerky in the way.',
              'You get a hand on his wrist. He yanks back. The two of you stagger into the drinks fridge and the gun is somewhere between you, and it is very loud.',
            ],
            next: 'shot',
          },
        ],
      },

      deal: {
        title: '11:50 PM — The Deal',
        scene: 'shop',
        art: '🤝',
        mood: 'night',
        text: [
          'Wes is leaning against the gum display now, as if his legs have quit. The gun hangs at his side, pointed at the lino. Not put away. Not dropped. Just tired.',
          { if: 'k_debt', text: { speaker: 'Wes', say: 'He said he\'d go to my mom\'s place. She\'s got a bad heart. She doesn\'t even know I borrowed it. It was for her pills. That\'s the stupid part. It was for her pills.' } },
          { if: '!k_debt', text: { speaker: 'Wes', say: 'You don\'t get it. I need money. Real money. Tonight. Or somebody I love gets hurt. I don\'t have time for magic tricks.' } },
          { if: 'marla_ally', text: 'Marla has quietly sat back down in her booth. She\'s listening with her arms crossed, chewing on her lip, the way she listens to an engine that might still be saved.' },
          'The clock says 11:50. Kowalski in two minutes. The night is balanced on a pin.',
        ],
        choices: [
          {
            text: '"Put the gun on the counter, Wes."',
            hint: 'Not for me. For your mom.',
            if: 'k_debt',
            art: '🫳',
            outcome: [
              { speaker: 'You', say: 'Put it on the counter, Wes. Whatever happens with Duke, it goes a lot worse if you\'ve shot a clerk. Your mom needs you home. Not in county.' },
              'For a long, long moment, nothing. Then he walks to the counter, and sets the revolver down on the scratch cards, gently, like it might go off by itself. Like it\'s the scariest thing he\'s ever held. It probably is.',
              { if: 'marla_ally', text: { speaker: 'Marla', say: 'Good lad. Now sit down before you fall down. And somebody get this boy a coffee.' } },
              'You pour him a coffee. He sits on the floor with his back to the chip rack and holds it in both hands. The clock ticks to 11:52. Headlights sweep across the window.',
            ],
            next: 'kowalski',
          },
          {
            text: 'Open the safe and give him the money',
            hint: '$3,100. Almost exactly what he needs.',
            if: 'k_code',
            art: '🔐',
            outcome: [
              'You kneel, spin 0-6-1-4, and hold out three bricks of twenties. Donna is going to kill you. Donna is going to have to get in line.',
              { speaker: 'Wes', say: 'Why would — why are you helping me?' },
              { speaker: 'You', say: 'Because I\'ve seen how this night ends when I don\'t.' },
              'He takes the money. He looks at you like he\'ll remember you for the rest of his life. Then he runs, gun still in his hand, straight out of the door and into the sweep of headlights pulling into the lot. 11:52. Of course.',
            ],
            next: 'arrest',
          },
          {
            text: 'Push the register cash at him: "Just go."',
            hint: 'Get him and the gun out of here. Let the night sort out the rest.',
            art: '💵',
            outcome: [
              { speaker: 'You', say: 'Take it. It\'s two hundred bucks. It\'s not enough, I know. Just go, Wes. Please.' },
              'He looks at the crumpled twenties like they\'re an insult and a mercy at the same time. Then he grabs them, and the gun, and backs out of the door with his eyes on you the whole way. The Civic\'s engine coughs and catches and roars.',
              'Out on Route 9, his tail lights shrink toward the bend by the dry creek, going much, much too fast.',
            ],
            next: 'escaped',
          },
          {
            text: 'Keep him talking until midnight',
            hint: 'Every minute you keep him here is a minute he\'s not on the highway.',
            art: '🗨️',
            outcome: [
              'You talk. About Burger Barn. About his mom. About anything. He answers in single words, and the gun drifts up, and down, and up.',
              'At 11:52, headlights sweep the window, and a cruiser crunches in. Kowalski comes through the door with a cruller in one hand and the other on his holster, and sees a kid with a revolver.',
              { speaker: 'Deputy Kowalski', say: 'Whoa! Drop it! DROP IT!' },
              'Wes doesn\'t drop it. Wes swings round. Everyone shouts at once, and in the shouting, the gun goes off, and you step in front of it without deciding to.',
            ],
            next: 'shot',
          },
        ],
      },

      kowalski: {
        title: '11:52 PM — Deputy Kowalski',
        scene: 'shop',
        art: '🍩',
        mood: 'office',
        text: [
          'The door chimes. Deputy Kowalski fills the doorway like a beige weather front: hat askew, powdered sugar on his chin, half a cruller in his left hand, the right hand resting on his holster without much conviction.',
          { speaker: 'Deputy Kowalski', say: 'Evening. Got a call about a... huh.' },
          'He takes in the scene. A revolver on the scratch cards. A kid on the floor holding coffee. A trucker in a booth with her arms folded. An old man in the corner who does not look up. And you, behind the counter, breathing like you\'ve run a marathon.',
          { speaker: 'Deputy Kowalski', say: 'Somebody wanna tell me what I\'m looking at? Short version. My cruller\'s getting cold.' },
          'Wes looks up at you. He doesn\'t beg. He just waits, the coffee shaking a little in his hands. Whatever you say next is what happens to the rest of his life.',
        ],
        choices: [
          {
            text: '"He\'s my cousin. He came to help me close."',
            hint: 'And the gun? Think fast.',
            art: '🫂',
            outcome: [
              { speaker: 'You', say: 'This is my cousin Wes. He\'s helping me close up. That\'s Donna\'s. The manager. She keeps it under the counter. I was showing him it\'s not loaded. It\'s, uh. It is loaded. I was showing him that. Safety lesson.' },
              'Kowalski looks at you for a long, long time.',
              { if: 'marla_ally', text: { speaker: 'Marla', say: 'It\'s true, Kowalski. I watched the whole safety lesson. Very educational. Eat your cruller.' } },
              { if: '!marla_ally', text: { speaker: 'Marla', say: 'Kid\'s been here all night. I\'d know. Eat your cruller, Kowalski.' } },
              'Kowalski looks at the cruller. He looks at the gun. He looks at the clock, which says it is very nearly the end of his shift.',
              { speaker: 'Deputy Kowalski', say: 'I\'m taking the safety lesson into custody. Nobody tell Donna I was here. Night, folks.' },
            ],
            next: 'midnight',
          },
          {
            text: 'Tell Kowalski the truth',
            hint: 'Wes did point a gun at you. That matters too.',
            art: '⚖️',
            outcome: [
              { speaker: 'You', say: 'He tried to rob the place. He\'s in trouble with a loan shark called Duke. He put the gun down himself. Nobody got hurt. Please put that in the report.' },
              'Kowalski sighs the sigh of a man whose cruller is going cold, and gets out the handcuffs. Wes holds his wrists out before he\'s asked.',
              { speaker: 'Wes', say: 'It\'s okay. You were right. It goes better this way.' },
            ],
            next: 'arrest',
          },
        ],
      },

      tackle: {
        title: '11:47 PM — Marla',
        scene: 'shop',
        art: '💥',
        mood: 'blood',
        fx: 'shake',
        text: [
          'Marla hits Wes at waist height like a linebacker. They go down together into the chip rack in an explosion of cheese puffs. The gun skitters across the lino, spinning, and then — it goes off. Nobody touched it. It just went off, on its own, the way old guns do when they hit the floor.',
          'Marla rolls off the kid and sits up. She looks down at her side, puzzled, at the dark stain spreading through her flannel.',
          { speaker: 'Marla', say: 'Well. That\'s just rude.' },
          'Wes scrambles for the door. The gun is lying in the middle of the floor. Marla is bleeding. And the clock says 11:48.',
        ],
        timer: 7,
        timeout: {
          text: 'You can\'t move.',
          art: '🧊',
          outcome: [
            'You stand there, hands up, for far too long. By the time you\'re on your knees beside her, Marla has already got both of her own hands pressed to her side, and she\'s swearing at you, which you take as a good sign.',
            { speaker: 'Marla', say: 'Towels. Dish towels. Move, clerk.' },
            'You move. Out in the lot, the Civic is gone.',
          ],
          next: 'end_marla',
        },
        choices: [
          {
            text: 'Press down on Marla\'s wound',
            hint: 'Hands. Pressure. Now.',
            art: '🩹',
            outcome: [
              'You throw yourself down beside her and press both hands against her side. It\'s warm and wet and she grunts and slaps your shoulder.',
              { speaker: 'Marla', say: 'Harder. I\'m not a peach. Push.' },
              'You push. You yell for someone to call 911. The man in the grey coat is already on the shop phone, speaking calmly, the way he does everything. Out in the lot, the Civic screeches away.',
            ],
            next: 'end_marla',
          },
          {
            text: 'Grab the gun and go after Wes',
            hint: 'He did this. He doesn\'t get to drive away.',
            art: '🔫',
            outcome: [
              'You snatch up the revolver and sprint for the door. Wes is halfway into the Civic. You shout his name. He turns, and he has a second thing in his hand, a little black pistol he never took out in the shop.',
              'You both freeze. Then you both move. Under the canopy lights, both guns are very loud.',
              'The last thing you see is Marla in the doorway, holding her side with one hand and reaching for you with the other.',
            ],
            next: 'shot',
          },
        ],
      },

      arrest: {
        title: '11:53 PM — Blue Lights',
        scene: 'gas-station',
        art: '🚔',
        mood: 'night',
        text: [
          (s) => (s.has('k_debt')
            ? 'Blue and red lights wash over the pumps. Kowalski, cruller abandoned on his cruiser roof, has Wes against the car with his hands cuffed behind him. Wes isn\'t fighting. He looks almost relieved, the way you\'re relieved when the worst thing finally happens and it\'s smaller than you thought.'
            : 'Blue and red lights wash over the pumps. Kowalski, who has walked straight into a fleeing robber for once in his life, is sitting on Wes in the forecourt, looking as surprised as anybody. Bricks of twenties lie scattered on the tarmac like confetti.'),
          { speaker: 'Deputy Kowalski', say: 'Well, would you look at that. Four minutes early for once in my life. Somebody write that down.' },
          { speaker: 'Wes', say: 'Hey! Hey, clerk! I\'m sorry. I\'m — I\'m really sorry.' },
          'The clock in the shop window says 11:54. Nobody is bleeding. Nobody is dead. The night, for the first time, is still going.',
        ],
        choices: [
          {
            text: 'Tell Wes you\'ll speak up for him',
            hint: 'He\'s a kid in trouble, not a monster.',
            set: ['spoke_up'],
            art: '🗣️',
            outcome: [
              { speaker: 'You', say: 'Wes. I\'ll tell them you didn\'t shoot. I\'ll tell them about Duke. You hear me? I\'ll be there.' },
              'He nods, too fast, crying again. Kowalski folds him into the back of the cruiser with a hand on his head, surprisingly gently.',
              { speaker: 'Deputy Kowalski', say: 'Duke Rawlins? Loan sharking out of the motel? We\'ve wanted that guy for years. Kid, you might have just done me a favour.' },
            ],
            next: 'end_arrested',
          },
          {
            text: 'Turn your back and go inside',
            hint: 'You\'ve died for this kid enough times.',
            art: '🚪',
            outcome: [
              'You turn away from the lights and go back inside. The door chimes behind you. You sit on the stool behind the counter and stare at the clock as it creeps toward midnight, because you need to see it, you need to see it with your own eyes.',
              'Marla brings you a coffee. She doesn\'t say anything. For Marla, it\'s a speech.',
            ],
            next: 'end_arrested',
          },
        ],
      },

      midnight: {
        redirect: (s) => (secretReady(s) ? 'abel' : 'end_walkout'),
      },

      abel: {
        title: '11:59 PM — The Corner Table',
        scene: 'shop',
        art: '🧥',
        mood: 'dawn',
        weather: 'sparkles',
        text: [
          'Kowalski\'s tail lights dwindle down Route 9. Wes is still sitting on the floor with his coffee, laughing a shaky, unbelieving laugh. Marla is phoning a cousin who, it turns out, runs a haulage firm and always needs another driver. The radio is playing something new. You don\'t even know what it is. You could cry.',
          'In the corner, the Man in Grey stands up. He buttons his coat. His coffee, for the first time, has stopped steaming.',
          { speaker: 'The Man in Grey', say: 'Nobody died in it. Forty-seven years. Nobody died in it.' },
          'He walks to the door. He stops with his hand on it, as if he is waiting for something. As if, after all this time, he still needs one more thing before he can push.',
          'You think of the photo in Donna\'s office. A young man in a grey coat with wide lapels. Employee of the Month. *Gone too soon.*',
        ],
        choices: [
          {
            text: 'Say: "Goodnight, Abel. You can clock out."',
            hint: 'Give him his name back.',
            art: '🕛',
            outcome: [
              { speaker: 'You', say: 'Abel. Abel Finch. Employee of the Month, October 1979. Your shift\'s over. You can clock out.' },
              'He turns around. And he is not old. Or he is, and he isn\'t, both at once, like a photo printed over another photo: an old man and a young clerk in the same grey coat, and they are both smiling like they\'ve just been told a joke.',
              { speaker: 'Abel', say: 'Abel. That\'s right. That\'s me. Oh, I\'d forgotten how good that sounds.' },
            ],
            next: 'end_clocking_out',
          },
          {
            text: 'Offer to take his place',
            hint: 'Somebody has to watch the night. He\'s done enough.',
            set: ['took_place'],
            art: '🪑',
            outcome: [
              { speaker: 'You', say: 'If somebody has to keep watching this place... it can be me. You\'ve done forty-seven years. Go home.' },
              'He looks at you for a very long time, with something terribly gentle in his face.',
              { speaker: 'The Man in Grey', say: 'That\'s the kindest thing anybody\'s ever said to me. And the stupidest. Very well. If you\'re sure.' },
              'He takes off the grey coat and puts it around your shoulders. It is warm. It smells of burnt coffee and 1979.',
            ],
            next: 'end_forever',
          },
          {
            text: 'Let him go without a word',
            hint: 'Some doors you don\'t hold open for people.',
            art: '🚪',
            outcome: [
              'You don\'t say anything. You don\'t trust what you\'d say. He stands at the door a moment longer, then pushes it open and walks out under the canopy lights, and keeps walking, out past the pumps, into the dark.',
              'You never find out if it was enough. You think about it, sometimes, at 11:59.',
            ],
            next: 'end_walkout',
          },
        ],
      },

      // ------------------------------------------------------------------ ENDINGS
      end_walkout: {
        scene: 'dawn',
        art: '🌅',
        mood: 'dawn',
        weather: 'dust',
        ending: { id: 'everybody-walks-out', title: 'Everybody Walks Out', type: 'true' },
        text: [
          'The clock ticks over to 12:00. Then 12:01. You watch the minute hand do it, and you laugh out loud, alone behind the counter, like a lunatic. Wednesday. It is *Wednesday.*',
          'Wes goes home at one in the morning with a phone number for Marla\'s cousin\'s haulage firm written on his arm in biro. Duke, it turns out, is not so brave once a trucker the size of a fridge offers to come round and *discuss the interest*.',
          { if: 'marla_ally', text: 'Marla stays until your shift ends at six. She doesn\'t say why. She doesn\'t have to.' },
          { if: (s) => s.has('k_abel') && s.has('k_grey') && !s.has('k_why'), text: 'The man in the grey coat is gone in the morning. His coffee is still on the table, cold for the first time. You never quite worked out who he was.' },
          { if: 'k_why', text: 'The corner table is empty in the morning. A paper cup of coffee sits on it, stone cold, for the first time in forty-seven years.' },
          { if: 'ticket', text: 'At nine in the morning, a pink ticket in your shirt pocket turns out to be worth forty-one million dollars. You give Wes enough to make Duke disappear from his life forever. You buy Marla a new knee. You buy Donna a real alarm system. You keep the job. Someone has to work the night shift.' },
          (s) => `Loops it took: ${loop(s)}. Shots fired at you: ${loop(s) - 1}. Packs of spearmint sold: ${loop(s)}. Peppermint remains, officially, for cowards.`,
          'At six, the sun comes up over Route 9 like it\'s never done it before. You suppose, technically, it hasn\'t.',
        ],
      },

      end_arrested: {
        scene: 'gas-station',
        art: '🚔',
        mood: 'dawn',
        ending: { id: 'four-minutes-early', title: 'Four Minutes Early', type: 'good' },
        text: [
          '12:00. 12:01. The minute hand moves on. The night is over. The loop, as far as you can tell, has broken like an egg.',
          'Wes Darrow gets eighteen months, suspended, on account of his age, his record (nothing), and a deposition from Deputy Kowalski which, against all odds, leads directly to the arrest of one Duke Rawlins, loan shark, on fourteen charges.',
          { if: 'spoke_up', text: 'You go to the hearing. You speak up. Wes\'s mother finds you in the corridor afterwards and holds both your hands for a very long time without saying anything.' },
          { if: 'k_code', text: 'Donna changes the safe code. To her cat\'s birthday. You decide this is no longer your problem.' },
          { if: 'ticket', text: 'Oh, and your lottery ticket wins forty-one million dollars. Kowalski, who was standing next to you when you checked it, has not stopped talking about it since.' },
          'Kowalski gets a commendation. The local paper calls him *Route 9\'s Fastest Deputy*. He has it framed, next to a box of crullers.',
          'And every night at 11:48, you still flinch at the ice machine. Just a little. Just in case.',
        ],
      },

      end_marla: {
        scene: 'gas-station',
        art: '🚑',
        mood: 'night',
        ending: { id: 'collateral', title: 'Collateral', type: 'neutral' },
        text: [
          'The ambulance takes twenty-six minutes to come up Route 9. You keep your hands on Marla for every single one of them. She talks the whole time, mostly about pie.',
          'She lives. She\'ll walk with a cane now, and she\'ll never drive long-haul again. When you visit her in hospital she tells you it\'s fine, she always hated Tucson anyway, and you both pretend that\'s true.',
          'Midnight comes. The clock does not reset. The loop is over, because the night, technically, didn\'t take a life. It just took a big piece of one.',
          'Wes is picked up three days later in Nevada. You read about it in the paper. *Teen Robber Caught.* There\'s a photo. He looks about twelve.',
          { if: 'ticket', text: 'Your lottery ticket wins forty-one million dollars. You pay for Marla\'s physiotherapy, her truck, her kids\' college, her new knee. She calls it blood money. She takes it anyway. She says she\'s earned it, and she has.' },
          'Sometimes, at 11:47, you wonder about the version of the night where you didn\'t give the nod. Then you remember: you\'ll never get to try again.',
        ],
      },

      end_last_shift: {
        scene: 'void',
        art: '🕯️',
        mood: 'void',
        fx: 'glitch',
        ending: { id: 'last-shift', title: 'Last Shift', type: 'death' },
        text: [
          'At 11:47 the door chimes. You don\'t get up. You hear him shouting at an empty counter, and Marla saying *Easy, kid, easy*, and the register drawer jangling open as he finds it himself.',
          'At 11:48, the ice machine dumps its tray. You hear the bang from the floor. It\'s not even aimed at you this time. It\'s aimed at the noise. It finds you anyway, through the counter, the way it always does.',
          'The Man in Grey keeps his promise. He holds your hand on the lino while the strip lights flicker.',
          { speaker: 'The Man in Grey', say: 'There. That\'s the last one. No more elevens.' },
          'And then, for the first time, there\'s no 11:00. No Bonnie Tyler. No spearmint. Just quiet, wide and soft as a desert at night.',
          'In the morning, the Gas-N-Go puts up a new photo on the wall in Donna\'s office. It goes next to a faded one of a young man in a grey coat, and the two of you look out at the safe together, forever, like a pair of clerks on a very long shift.',
        ],
      },

      end_forever: {
        scene: 'void',
        art: '♾️',
        mood: 'void',
        fx: 'glitch',
        ending: { id: 'groundhog-forever', title: 'Groundhog Forever', type: 'bad' },
        text: [
          (s) => (s.has('took_place')
            ? 'You sit down in the corner in a grey coat that is now yours. Abel walks out under the canopy lights and keeps walking, out past the pumps, into the first real morning he has seen since 1979.'
            : 'The light goes out. And then, as it always does, it comes back on. 11:00. The radio. The pie. The gum. But something is different this time. Something has set, like concrete.'),
          { if: '!took_place', text: 'The corner table is empty. The Man in Grey is gone. Your hands feel heavier. You look down and you are wearing a long grey coat that you never bought, worn shiny at the cuffs.' },
          'The clerk behind the counter is someone new. A girl with a nose ring and a paperback. She doesn\'t see you. They never do, at first.',
          'At 11:47 the door chimes, and a kid comes in with a gun. At 11:48 the ice machine crashes. And you sit in the corner and you hold a coffee that never goes cold, and you wait for someone, some night, to finally get it right.',
          { if: 'took_place', text: 'You chose this. That helps, a little. On the long nights you tell yourself the job is important. You\'re mostly right.', else: 'You stop counting the loops around a thousand. You stop counting yourself around ten thousand.' },
          { speaker: 'The Man in Grey', say: 'See you at eleven.', if: '!took_place' },
          { if: 'took_place', text: 'The girl with the nose ring looks up from her paperback, one night, and notices that your coffee is still steaming. You lift it an inch. *Welcome to the shift.*' },
        ],
      },

      end_clocking_out: {
        scene: 'dawn',
        art: '🕛',
        mood: 'dawn',
        weather: 'sparkles',
        ending: { id: 'clocking-out', title: 'Clocking Out', type: 'secret' },
        text: [
          'Abel Finch pushes open the door of the Gas-N-Go, and the chime, for once, sounds like a bell at the end of school.',
          { speaker: 'Abel', say: 'You finished my shift for me. Do you know how long I\'ve waited for someone stubborn enough to do that?' },
          { speaker: 'You', say: 'Forty-seven years?' },
          { speaker: 'Abel', say: 'Forty-seven years, eleven months and a great many Tuesdays. Look after this place. Unplug that bloody ice machine.' },
          'He steps out under the canopy, and the lights hum, and the desert is enormous and dark and full of stars. He walks out past the pumps. At the edge of the light, he turns back and waves, and then the dark takes him gently, the way a tide takes a footprint.',
          'At 12:00 exactly, the minute hand moves. In the corner, his coffee cup is empty. On the wall in Donna\'s office, the old photograph has changed: the young man in the grey coat is no longer smiling at the camera. He\'s looking off to one side, laughing, as if someone just out of frame has finally told him the punchline.',
          { if: 'ticket', text: 'The ticket in your pocket wins forty-one million dollars. You buy the Gas-N-Go outright. The first thing you do is throw the ice machine into a skip. The second thing you do is hire Wes, on day shifts, where nothing ever happens.' },
          { if: '!ticket', text: 'You put in for day shifts the next morning. Donna says no. You stay on nights. Someone has to watch Route 9, and it turns out you don\'t mind it now.' },
          'Marla still stops by on Tuesdays. Wes drives for her cousin and sends postcards from places with oceans. And sometimes, at 11:47, you pour a second coffee and leave it on the corner table, just in case anybody else needs a place to sit.',
        ],
      },
    },
  });
})();
