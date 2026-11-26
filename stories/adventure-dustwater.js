/* MysteryFate story: Last Train to Dustwater (adventure) */
(function () {
  'use strict';

  // Hours till noon. Each errand costs time; the clock never runs backwards.
  // Eli climbs the water tower unless you gave him a real job (or never spoke to him at all).
  const eliUp = (s) => s.has('eli_tower') || !s.has('v_street');
  // How much of the truth about Cole you have pieced together.
  const clues = (s) => s.count('clue_abby', 'clue_trial', 'clue_sheriff', 'heard');
  const knowsTruth = (s) => clues(s) >= 2;
  // Secret: the ledger from Voss’s safe, Abby’s trust, and no shot fired first.
  const canShowLedger = (s) => s.has('ledger') && !s.has('shot_first');
  const clock = (s) => ({ 3: 'nine', 2: 'ten', 1: 'eleven' }[s.get('time')] || 'nearly noon');

  registerStory({
    id: 'adventure-dustwater',
    title: 'Last Train to Dustwater',
    category: 'adventure',
    tagline: 'One star. One bullet. One outlaw on the noon train.',
    description:
      'You pinned on the sheriff’s star this morning because nobody else in Dustwater would. The last man to wear it was shot by Cole Mercer, and Cole Mercer arrives on the noon train. Your revolver holds exactly one bullet, the general store is out, and the clock on the bank is not on your side.',
    cover: '🤠',
    accent: '#d4912a',
    ambient: 'adventure',
    warning: 'Contains: gunfights, a child in danger, death, frontier corruption.',
    vars: { time: 4 },
    flags: [],
    hud: [{ var: 'time', label: 'Till Noon', icon: '⏰', max: 4 }],
    scene: 'desert-town',
    voices: {
      narrator: { gender: 'female', pitch: 0.9, rate: 0.95, accent: 'en-US', note: 'dry campfire storyteller, dust in her voice, a slow smile' },
      'Cole Mercer': { gender: 'male', pitch: 0.7, rate: 0.82, accent: 'en-US', note: 'quiet, tired, dangerous; every word weighed before it leaves' },
      'Abby Quint': { gender: 'female', pitch: 1.05, rate: 1.12, accent: 'en-IE', note: 'saloon owner, sharp tongue, quick as a card trick' },
      'Deacon Pruitt': { gender: 'male', pitch: 1.15, rate: 1.05, accent: 'en-GB', note: 'undertaker, cheerfully morbid, a vicar at a garden party' },
      'Eli Tanner': { gender: 'male', pitch: 1.5, rate: 1.25, accent: 'en-US', note: 'fourteen, brave, reckless, talks faster than he thinks' },
      'Judge Voss': { gender: 'male', pitch: 0.8, rate: 0.88, accent: 'en-GB', note: 'respected judge, velvet and port wine, rot underneath' },
      'You': { gender: 'neutral', pitch: 1, rate: 1 },
    },
    start: 'intro',
    scenes: {
      // ------------------------------------------------------------ 8 AM
      intro: {
        title: '8:00 AM — The Sheriff’s Office',
        art: '⭐🔫',
        mood: 'dawn',
        weather: 'dust',
        scene: 'desert-town',
        text: [
          'The star is heavier than it looks. You pinned it on at seven this morning, in front of the whole town council, because the mayor asked for a volunteer and every other man in Dustwater suddenly found something fascinating about his boots.',
          'The last man to wear it was Sheriff Briggs. Cole Mercer shot him dead on the Red Mesa road four days ago. Yesterday a telegram came: Cole Mercer is on the **noon train**. Nobody knows why. Everybody knows what for.',
          'You break open your revolver for the tenth time. One brass cartridge sits in one chamber, winking at you like a bad joke. The other five are empty. The general store sold its last box of .44s to Sheriff Briggs, who is no longer in a position to share.',
          'The office door creaks. A tall, thin man in a black frock coat steps in, beaming, unrolling a yellow cloth measuring tape with the delight of a child unwrapping a present.',
          { speaker: 'Deacon Pruitt', say: 'Good morning, Sheriff! Deacon Pruitt, undertaker. Don’t get up. Actually, do get up, I need you standing. Arms out, please. It’s nothing personal. I measure all the new sheriffs. Saves time later.' },
          'Behind the bank, the big brass clock clanks over to eight. Four hours.',
        ],
        choices: [
          {
            text: 'Stand still. Let him measure you.',
            hint: 'You might as well know your size.',
            set: ['measured'],
            add: { time: -1 },
            art: '📏',
            outcome: [
              'You hold your arms out like a scarecrow. Deacon Pruitt sweeps the tape from your heel to your crown, across your shoulders, round your chest, humming a hymn under his breath.',
              { speaker: 'Deacon Pruitt', say: 'Five foot nine. Narrow in the hips. Lovely, lovely. You’ll go in a standard pine, no extension needed. Briggs needed an extension. Six foot one, rest his soul, and shot clean through the front of the chest. Funny thing, that.' },
              { speaker: 'You', say: 'What’s funny about it?' },
              { speaker: 'Deacon Pruitt', say: 'Oh, nothing, nothing. Only that a back-shooter generally shoots backs. Fifty-three gentlemen I’ve buried from this town, Sheriff, and I can tell a coward’s bullet from an honest one. Well! I’ll pencil you in for Thursday. Tentatively.' },
              'He tips his hat and leaves. Somehow the hour has gone with him. Thorough man.',
            ],
            next: 'hub',
          },
          {
            text: 'Run him off. Practise your draw out back.',
            hint: 'Bottles on the fence. Empty gun, full concentration.',
            set: ['steady'],
            add: { time: -1 },
            art: '🍾',
            outcome: [
              'You steer the Deacon out by the elbow. He goes cheerfully, calling over his shoulder that he keeps the shop open till sundown, *for emergencies*.',
              'Out behind the jail you line up seven whiskey bottles on the fence rail and practise. Draw. Click. Draw. Click. You don’t dare waste the one real bullet, so you dry-fire at the bottles till your wrist aches and the hammer is a blur.',
              'By the end of the hour you are not fast. But you are *smooth*, and smooth is the cousin of fast who doesn’t get people killed. A stray dog has sat down to watch you. It seems unimpressed. Dogs are hard to please.',
            ],
            next: 'hub',
          },
          {
            text: 'Borrow his pencil and write your will.',
            hint: 'If he’s measuring, you might as well be organised.',
            set: ['will'],
            add: { time: -1 },
            art: '✍️',
            outcome: [
              'The Deacon is delighted. He produces a pencil from behind his ear, a sheet of black-edged paper from his coat, and a small flask of what he calls *funeral sherry* from somewhere else entirely.',
              'You write it at the desk: *To Eli Tanner, my horse, Biscuit, on condition he stops trying to be shot. To Abby Quint, my tab, which she can forgive. To Dustwater, this star, back.* It takes longer than it should, because every line makes you think of something you never did.',
              { speaker: 'Deacon Pruitt', say: 'Beautiful penmanship. Very legible. You would not believe how many wills are written in a hurry. Most gentlemen leave it until they are already leaking.' },
            ],
            next: 'hub',
          },
        ],
      },

      // ------------------------------------------------------------ THE MORNING
      hub: {
        redirect: (s) => (s.get('time') <= 0 ? 'station' : 'street_hub'),
      },

      street_hub: {
        title: 'Main Street — The Clock Is Ticking',
        art: '🕰️🌵',
        mood: 'sunny',
        weather: 'dust',
        scene: 'desert-town',
        text: [
          (s) => `The bank clock says ${clock(s)}. The sun is climbing like it has somewhere to be, and Main Street is already shimmering at the far end where the railroad tracks run into the heat.`,
          (s) => s.get('time') === 3
            ? 'Dustwater is pretending to have a normal morning. Shutters bang open. A woman beats a rug on a porch. Everyone moves a little too fast and nobody looks at the star on your chest.'
            : s.get('time') === 2
              ? 'The town has stopped pretending. Folks are nailing boards over windows. Someone has chalked *GOOD LUCK SHERIFF* on the side of the feed store, then thought better of it and rubbed out *LUCK*.'
              : 'One hour left. The street is emptying like a bathtub. A tumbleweed rolls past with the confidence of a creature that has never needed a bullet in its life.',
          { if: 'ledger', text: 'The judge’s ledger sits inside your shirt, warm against your ribs. It feels like carrying a lit stick of dynamite in a church.' },
          { if: 'trap', text: 'Under the water trough in front of the bank, a fuse runs back through the dust to the jailhouse porch. You try very hard not to look at it.' },
          'Where do you spend the next hour?',
        ],
        choices: [
          {
            text: 'The Silver Spur Saloon.',
            hint: 'Abby Quint knows every secret in Dustwater. She sells some of them.',
            if: '!v_saloon',
            set: ['v_saloon'],
            scene: 'saloon',
            art: '🥃',
            outcome: [
              'You push through the swing doors of the Silver Spur. Inside it is dark and cool and smells of sawdust, spilled rye and cigar smoke old enough to vote.',
              'Nobody is drinking. A piano player is playing the same four bars over and over as though he has forgotten the rest of the song, or the rest of his life.',
            ],
            next: 'saloon',
          },
          {
            text: 'Judge Voss’s chambers.',
            hint: 'The most respected man in town. He sent Cole Mercer to prison.',
            if: '!v_judge',
            set: ['v_judge'],
            scene: 'library',
            art: '⚖️',
            outcome: [
              'The courthouse is the only brick building in Dustwater, and it knows it. You climb the steps, take off your hat without quite knowing why, and knock on a door with **HON. HARLAN VOSS** painted on it in gold.',
              { speaker: 'Judge Voss', say: 'Come in, come in! Ah. The new sheriff. Splendid. Sit, sit. You look like a man who needs a brandy and a little legal advice.' },
            ],
            next: 'judge',
          },
          {
            text: 'Find Eli Tanner before he finds trouble.',
            hint: 'Fourteen years old. Has been following you around all morning.',
            if: '!v_street',
            set: ['v_street'],
            art: '👦',
            outcome: [
              'You don’t have to look far. You turn around and Eli Tanner is right there, so close you nearly step on him, holding his father’s old hunting rifle in both arms like a wedding present.',
              { speaker: 'Eli Tanner', say: 'Sheriff! I’ve been waiting! I cleaned it, I oiled it, I can hit a jackrabbit at a hundred yards, well, I hit *near* a jackrabbit, and I want to be your deputy. Please. I’ll do anything. I’ll do the dangerous bits.' },
            ],
            next: 'street',
          },
          {
            text: 'Pruitt’s Undertaking Parlour.',
            hint: 'Dead men’s belts. Grave-digging dynamite. Sheriff Briggs.',
            if: '!v_deacon',
            set: ['v_deacon'],
            scene: 'church',
            art: '⚰️',
            outcome: [
              'The undertaker’s parlour is the back half of the little white chapel, because, as the Deacon likes to say, it saves the customers a walk.',
              'Coffins lean against every wall like guests at a dance who are waiting to be asked. The Deacon looks up from a tape measure and a pine plank and lights up as if you’re his favourite nephew.',
              { speaker: 'Deacon Pruitt', say: 'Sheriff! Back so soon! Not a fitting, I hope? I haven’t even planed your lid yet.' },
            ],
            next: 'deacon',
          },
        ],
      },

      // ------------------------------------------------------------ THE SALOON
      saloon: {
        title: 'The Silver Spur Saloon',
        art: '🍸🎹',
        mood: 'candle',
        scene: 'saloon',
        text: [
          'Abby Quint stands behind the bar polishing a glass that was clean ten minutes ago. Red hair pinned up with a pencil, sleeves rolled, eyes like two cocked pistols. She owns the Silver Spur, half the mortgages on Main Street, and, people say, the other half’s secrets.',
          { speaker: 'Abby Quint', say: 'Well. If it isn’t the bravest fool in the territory. You know what I call a man who takes that star the week Cole Mercer comes back to town? I call him a customer, while he lasts. What’ll it be, Sheriff?' },
          'Above the bar hangs a faded wanted poster: **COLE MERCER — BANK ROBBERY — $10,000 NEVER RECOVERED.** Someone has drawn a moustache on him. Badly. Abby’s eyes flick to it and away, quick as a lizard’s tongue.',
        ],
        choices: [
          {
            text: 'Tell her the truth: you’re scared and you’ve got one bullet.',
            hint: 'Nobody in this town has been honest with her in years.',
            set: ['abby_trust'],
            add: { time: -1 },
            art: '🫱',
            outcome: [
              'You put your revolver on the bar, open the cylinder, and spin it so she can see. One shiny cartridge. Five empty holes.',
              { speaker: 'You', say: 'I’m not brave. I’m the only one who said yes. I’ve got one bullet, three hours, and no idea why he’s coming. And I’m scared half to death.' },
              'Abby stops polishing. For a long moment she just looks at you, the way you’d look at a dog that has walked into the bar on its hind legs and ordered a sarsaparilla.',
              { speaker: 'Abby Quint', say: 'Well, hell. An honest man with a star on. I didn’t think they made those any more. Sit down. This one’s on the house, and so is the next thing I tell you.' },
            ],
            next: 'saloon2',
          },
          {
            text: 'Slap the star on the bar and demand answers.',
            hint: 'You’re the law now. Act like it.',
            add: { time: -1 },
            fx: 'shake',
            art: '⭐',
            outcome: [
              'You bring your palm down on the bar so hard the glasses jump. The piano player stops dead mid-bar.',
              { speaker: 'You', say: 'I’m the law in Dustwater now, Miss Quint, and I want to know everything you know about Cole Mercer.' },
              'Abby looks at the star. Then at you. Then she laughs, a short bark with no warmth in it at all.',
              { speaker: 'Abby Quint', say: 'Honey, the law in Dustwater has been leaning on me for six years. It wears a nicer coat than you, and it never once said please. But you’re cute when you shout. Ask your questions. I’ll decide which ones are worth answering.' },
            ],
            next: 'saloon2',
          },
          {
            text: 'Order a whiskey. Make it a double.',
            hint: 'Courage comes in bottles. So does the other thing.',
            add: { time: -1 },
            art: '🥃',
            outcome: [
              'Abby pours without a word. The whiskey goes down like a lit match and settles in your belly like a small, warm, poorly informed advisor.',
              'You order another. She raises an eyebrow but pours it. The piano player finds the fifth bar of his song. It is a sad song. You find yourself humming along.',
              { speaker: 'Abby Quint', say: 'Easy, Sheriff. Dutch courage is all very well, but the Dutch aren’t the ones getting off that train. What do you actually want from me?' },
            ],
            next: 'saloon2',
          },
        ],
      },

      saloon2: {
        title: 'The Silver Spur — The Back Booth',
        art: '🃏🕯️',
        mood: 'candle',
        scene: 'saloon',
        text: [
          { if: 'abby_trust',
            text: 'She takes you to the back booth, the one under the stuffed bobcat, where the walls are thick and the lamp is low. She pours two glasses and doesn’t touch hers.',
            else: 'She leans on the bar and gives you the look she gives men who owe her money: patient, amused, counting.' },
          { speaker: 'Abby Quint', say: 'You get one question I’ll answer straight, Sheriff. One. Then I’ve a saloon to board up. Make it a good one.' },
          'Through the window behind her, the shadow of the bank clock’s hands creeps across the dust.',
        ],
        choices: [
          {
            text: 'Ask what really happened six years ago.',
            hint: 'The robbery. The trial. Cole.',
            set: ['clue_abby'],
            art: '📜',
            outcome: [
              { if: 'abby_trust',
                text: [
                  'She is quiet a long time. When she talks, it is low, and she talks to her glass instead of to you.',
                  { speaker: 'Abby Quint', say: 'The night the Dustwater bank was robbed, Cole Mercer was in my back room. With me. All night. He was not robbing anything but my good sense.' },
                  { speaker: 'Abby Quint', say: 'Next morning the judge had him in irons. I went to the courthouse to tell them. Judge Voss met me on the steps and reminded me, very kindly, that his bank held the note on the Silver Spur. I could testify, or I could keep a roof over my head. I kept the roof.' },
                  'She drinks the glass at last, all of it.',
                  { speaker: 'Abby Quint', say: 'Six years I’ve poured whiskey under that poster. So no, Sheriff. I don’t think Cole is coming back for the bank.' },
                ],
                else: [
                  'Abby’s jaw goes tight. For a second you think she’ll throw you out. Instead she leans closer and lowers her voice.',
                  { speaker: 'Abby Quint', say: 'What happened is Cole Mercer got twelve years for a robbery he couldn’t have done, and the ten thousand dollars never turned up, and the only witness who swore he saw Cole was a deputy named Briggs. Who was made sheriff the very next week. You do the arithmetic. I’m busy.' },
                ] },
            ],
            next: 'hub',
          },
          {
            text: 'Ask what Judge Voss keeps in his safe.',
            hint: 'She knows everybody’s secrets. Even his.',
            if: 'abby_trust',
            set: ['combo'],
            art: '🔐',
            outcome: [
              'Abby’s eyebrows go up, and a slow, dangerous smile comes after them.',
              { speaker: 'Abby Quint', say: 'Oh, you *are* worth the free drink. He keeps a ledger in there. Brown calfskin. Every dollar he ever took and who paid it. Men like Voss can’t help writing things down. They think the numbers love them back.' },
              { speaker: 'Abby Quint', say: 'Combination’s his own birthday. Eleven, three, nineteen. Vain old goat had me bake him a cake one year and told me the date three times so I’d get it right.' },
              'She closes your hand around a beer mat with the numbers scribbled on it.',
              { speaker: 'Abby Quint', say: 'Burn that after. And Sheriff, if you get caught with your hand in his safe, I never met you.' },
            ],
            next: 'hub',
          },
          {
            text: 'Ask if she has any .44 cartridges.',
            hint: 'A saloon keeper always has something under the bar.',
            set: ['bullets'],
            art: '📦',
            outcome: [
              'Abby reaches under the bar without looking and slaps down a battered cardboard box. **.44 RIMFIRE. 50 COUNT.** About a dozen left, rattling around like teeth.',
              { speaker: 'Abby Quint', say: 'I keep them for when the drunks get creative. Take them. You can owe me. Fair warning: the last man who owed me is in Deacon Pruitt’s icehouse, so I’d pay up promptly if I were you.' },
              'You thumb five into the cylinder. The gun feels heavier. Not safer, exactly. Just heavier.',
            ],
            next: 'hub',
          },
          {
            text: 'Ask her to hide folks in her cellar at noon.',
            hint: 'Whatever happens on Main Street, fewer people in it.',
            set: ['evac'],
            art: '🚪',
            outcome: [
              'She looks at you like you’ve asked her something nobody has ever asked before.',
              { speaker: 'Abby Quint', say: 'The cellar holds forty if they don’t mind cuddling up to the beer barrels. I’ll put the word round. Women, kids, the piano player. Especially the piano player. If I hear those four bars one more time I’ll shoot him myself.' },
              'Before you leave she is already writing names on the back of a menu, quick and neat. Dustwater has been a lot of things to Abby Quint. It has never once stopped being hers.',
            ],
            next: 'hub',
          },
        ],
      },

      // ------------------------------------------------------------ THE JUDGE
      judge: {
        title: 'The Courthouse — Judge Voss’s Chambers',
        art: '⚖️🍷',
        mood: 'gold',
        scene: 'library',
        text: [
          'Judge Harlan Voss is everything Dustwater wishes it was. Silver hair, silver watch chain, a voice like warm molasses. He has bookshelves with real books, a carpet from St Louis, and behind his desk, half hidden by a velvet curtain, a squat black iron safe with a brass dial.',
          'He pours you a brandy before you can refuse and leans back in his leather chair, steepling his fingers.',
          { speaker: 'Judge Voss', say: 'Cole Mercer is a robber and a murderer, Sheriff. I convicted him myself and I’d do it again. He has come back for one reason only: revenge. On this town. On me. On that badge.' },
          { speaker: 'Judge Voss', say: 'So my advice, as an officer of the court, is simple. When he steps off that train, shoot him. Don’t talk. Don’t dither. Shoot. I will see to it the paperwork is very generous to you afterwards.' },
          'He smiles, and it is a lovely smile, and it doesn’t go anywhere near his eyes.',
        ],
        choices: [
          {
            text: 'Ask about Cole’s trial.',
            hint: 'Lawyers love talking about their trials. Judges more so.',
            set: ['clue_trial'],
            add: { time: -1 },
            art: '📚',
            outcome: [
              'The judge is happy to talk. Very happy. He talks for most of an hour and you listen for the bits he doesn’t say.',
              'One witness: Deputy Briggs, who swore he saw Cole riding off with the saddlebags. No saddlebags ever found. No money ever found. Not one dollar of ten thousand. Trial lasted forty minutes. Defence counsel was the judge’s own nephew, who has since moved to San Francisco and bought a hotel.',
              { speaker: 'Judge Voss', say: 'Swift justice, Sheriff! The best kind. A frontier can’t afford to be slow.' },
              'Something cold and small settles in your stomach and starts unpacking its bags.',
            ],
            next: 'hub',
          },
          {
            text: 'Ask him for ammunition.',
            hint: 'Rich men have guns. Guns need bullets.',
            set: ['bullets'],
            add: { time: -1 },
            art: '🎁',
            outcome: [
              'The judge laughs, delighted, and pulls open a desk drawer. Inside, nested in green velvet like jewellery, sits a fresh box of .44 cartridges. He slides it across the desk to you with two fingers.',
              { speaker: 'Judge Voss', say: 'With the compliments of the court. Use as many as you like on Mr Mercer. I’d start with the head and work down.' },
              'You load five into the cylinder. They are beautiful bullets, brand new, the brass polished bright. It is the strangest gift anybody has ever given you. You can’t work out why it makes you feel like you’ve just been hired.',
            ],
            next: 'hub',
          },
          {
            text: 'Accept another brandy. Wait for him to step out.',
            hint: 'You have the combination. He has a bladder.',
            if: 'combo',
            add: { time: -1 },
            art: '🥃',
            outcome: [
              'You drink slowly. You ask about St Louis. You ask about the carpet. You ask about his late wife, his horse, his views on the railroad. And you keep topping up his glass.',
              'At twenty past the hour, the judge rises, excuses himself with great dignity, and goes down the corridor to the necessary room.',
              'His footsteps fade. You are alone with the safe. Your hands are already on the dial.',
            ],
            next: 'judge_safe',
          },
        ],
      },

      judge_safe: {
        title: 'The Courthouse — Behind the Curtain',
        art: '🔐📕',
        mood: 'gold',
        scene: 'library',
        fx: 'heartbeat',
        timer: 7,
        text: [
          'Eleven. Three. Nineteen. The tumblers drop with three soft clunks, as sweet as a church bell, and the iron door swings open.',
          'Cash in banded stacks. Deeds. A pearl-handled derringer. And on top, a fat ledger bound in brown calfskin. You flip it open. Rows of neat figures in the judge’s own hand. Names. Dates. Payments. And one line, six years old, that makes your breath stop:',
          '***Bank, Dustwater — $10,000. Briggs his share $1,000. Mercer to take the drop.***',
          'Down the corridor, a door bangs. Footsteps. Coming back. Fast.',
        ],
        timeout: {
          art: '😬',
          outcome: [
            'You freeze with the ledger in your hands. The footsteps reach the door. You shove the book back, swing the safe shut, spin the dial and throw yourself into your chair just as the handle turns.',
            { speaker: 'Judge Voss', say: 'Sheriff! You look flushed. The brandy, I expect. Or nerves. Perfectly natural.' },
            'He sits down. He doesn’t look at the safe. You can’t stop looking at it. You saw the truth for four seconds and you walked out with nothing but a racing heart.',
          ],
          next: 'hub',
        },
        choices: [
          {
            text: 'Take the ledger. Shut the safe. Go.',
            hint: 'Proof. Real proof. If you can get it out the door.',
            set: ['ledger'],
            fx: 'flash',
            art: '📕',
            outcome: [
              'You stuff the ledger down the front of your shirt, ease the safe shut, spin the dial, and are standing by the window admiring the view when the door opens.',
              { speaker: 'Judge Voss', say: 'Leaving us, Sheriff?' },
              { speaker: 'You', say: 'Got a train to meet, Your Honour.' },
              'He claps you on the shoulder, warm and fatherly, his palm about two inches from a stolen book with his whole life written in it. You walk down the courthouse steps and do not run, which is the hardest thing you have ever done.',
            ],
            next: 'hub',
          },
          {
            text: 'Tear out just the page about Cole.',
            hint: 'He might not miss one page. He’d miss the book.',
            set: ['clue_trial'],
            art: '📄',
            outcome: [
              'You rip the page out along the spine, fold it twice and slide it into your boot. The ledger goes back. The door swings shut. The dial spins.',
              'The judge comes in smiling, and talks about the weather, and the railroad, and sees you to the door. Halfway down the steps you take out the page and read it again. *Mercer to take the drop.* It is not enough to hang a judge. But it is more than enough to stop you sleeping.',
            ],
            next: 'hub',
          },
        ],
      },

      // ------------------------------------------------------------ ELI
      street: {
        title: 'Main Street — The Water Trough',
        art: '👦🪣',
        mood: 'sunny',
        weather: 'dust',
        scene: 'desert-town',
        text: [
          'Eli Tanner is fourteen years old and all elbows, freckles and conviction. His father died of a fever two winters back, and since then Eli has been trying very hard to be the man of the house, of the street, and if possible the whole territory.',
          { speaker: 'Eli Tanner', say: 'I’ve got it all figured out. I climb up the water tower, see? Nobody looks up. Never. And when Cole Mercer goes for his gun, *bang*, I get him first. I’m a hero, you’re alive, everybody’s happy. Except Cole.' },
          'He points. The water tower stands on its stilts by the tracks, forty feet tall, a perfect sniper’s nest. A perfect place to get shot out of.',
          { speaker: 'Eli Tanner', say: 'Also I sweep out the courthouse Tuesdays and Fridays, if you need anything swept. That’s not a heroic skill. I just thought I’d mention it.' },
        ],
        choices: [
          {
            text: 'Swear him in. Post him on the water tower.',
            hint: 'You need a second gun. He wants to help.',
            set: ['eli_tower'],
            add: { time: -1 },
            art: '🗼',
            outcome: [
              'You make him raise his right hand. He raises both, then corrects himself, then raises the right one so high he goes up on tiptoe.',
              { speaker: 'You', say: 'Do you swear to uphold the law in Dustwater, and to not fire unless I give the signal?' },
              { speaker: 'Eli Tanner', say: 'I swear! I swear on my pa! What’s the signal?' },
              'You hadn’t thought of one. You tell him you’ll take your hat off. He repeats it nine times on the way to the tower, and you watch him shin up the ladder with the rifle across his back, and something in your chest goes very still and does not like what you have done.',
            ],
            next: 'hub',
          },
          {
            text: 'Give him the church bell. Get everybody indoors.',
            hint: 'A real job. Away from the street.',
            set: ['evac'],
            add: { time: -1 },
            art: '🔔',
            outcome: [
              { speaker: 'You', say: 'Deputy Tanner. Most important job in town. At a quarter to twelve you ring the chapel bell and you don’t stop till Main Street is empty. Every door. Every window. Then you stay in that bell tower and you don’t come down till I say.' },
              'Eli looks crushed for exactly one second. Then he hears the word *Deputy* echo in his own head and his whole face lights up like a lamp.',
              { speaker: 'Eli Tanner', say: 'Deputy. Deputy Tanner. Yes, sir! Ma’am! Sheriff! Can I keep the rifle?' },
              { speaker: 'You', say: 'Unloaded.' },
              'He hands you the cartridges with a sigh so deep it could raise the dead. Deacon Pruitt, passing, looks briefly hopeful.',
            ],
            next: 'hub',
          },
          {
            text: 'Send him home to his mother.',
            hint: 'He’s a child. This isn’t his fight.',
            set: ['eli_tower'],
            add: { time: -1 },
            art: '🏠',
            outcome: [
              { speaker: 'You', say: 'Go home, Eli. Stay home. This isn’t a game.' },
              { speaker: 'Eli Tanner', say: 'I *know* it isn’t a game. That’s why you need me.' },
              'But he goes. Kicking every stone on the way, rifle dragging in the dust, shoulders up round his ears. You watch him turn the corner onto Pike Street and you breathe out.',
              'You don’t see him double back along the alley behind the livery. You don’t see him wait for the water-man to go for his dinner. You are busy, and he is fourteen, and fourteen-year-olds have been outwitting adults since the dawn of time.',
            ],
            next: 'hub',
          },
          {
            text: 'Ask what he’s seen while sweeping the courthouse.',
            hint: 'Nobody notices the boy with the broom.',
            set: ['combo'],
            add: { time: -1 },
            art: '🧹',
            outcome: [
              'Eli frowns. Then his eyes go wide with the thrill of being asked something only he knows.',
              { speaker: 'Eli Tanner', say: 'Well, the judge has a safe. Behind a curtain. And when he opens it he mutters the numbers, every time, like a prayer. Eleven, three, nineteen. I wasn’t snooping. I was sweeping. Loudly. He just doesn’t hear the broom.' },
              { speaker: 'Eli Tanner', say: 'Why? Is the judge a crook? Is this a *case*? Should I get my rifle?' },
              'You tell him to stay out of sight and keep his mouth shut. He nods solemnly and runs off at once, which is how you know he heard about half of it.',
            ],
            next: 'hub',
          },
        ],
      },

      // ------------------------------------------------------------ THE UNDERTAKER
      deacon: {
        title: 'Pruitt’s Undertaking Parlour',
        art: '⚰️🐍',
        mood: 'candle',
        scene: 'church',
        text: [
          'The Deacon’s parlour is spotless, smells of pine shavings and lilies, and has a rattlesnake living in an open coffin in the corner.',
          { speaker: 'Deacon Pruitt', say: 'That’s Gladys. Keeps the rats down. Don’t make any sudden movements near her, she’s very highly strung. So am I, frankly. It’s the trade.' },
          'On a trestle by the window, under a white sheet, lies a long shape that can only be Sheriff Briggs. On the shelf above him, a cigar box labelled *EFFECTS* in tidy capitals. By the back door, a crate stencilled **BLASTING POWDER — HARDPAN GRADE.**',
          { speaker: 'Deacon Pruitt', say: 'The ground out on Boot Hill is like iron, Sheriff. You can’t bury a man in it without a little bang first. Now. How can I help? I’m having a slow week. Well. I was.' },
        ],
        choices: [
          {
            text: 'Look at Sheriff Briggs.',
            hint: 'The Deacon said shot through the front. Let’s see.',
            set: ['clue_sheriff'],
            add: { time: -1 },
            art: '🔍',
            outcome: [
              'The Deacon folds back the sheet as tenderly as a nurse. Briggs is a big man with a big moustache, and a neat dark hole just left of his breastbone. In the front. Square in the front.',
              { speaker: 'Deacon Pruitt', say: 'And his gun hand was still around his gun when they brought him in. Hammer cocked. He drew first, Sheriff, sure as I’m standing here. Cole was just faster.' },
              'He opens the cigar box. A watch. A tobacco pouch. And a folded paper, which you open: a warrant for Cole Mercer, signed with a large looping flourish by **H. Voss**. Across the bottom someone has written one word in red ink and underlined it twice. *DEAD.*',
              { speaker: 'Deacon Pruitt', say: 'Not *dead or alive*, you’ll note. Just the one option. I always found that rather impolite.' },
            ],
            next: 'hub',
          },
          {
            text: 'Ask about dead men’s cartridges.',
            hint: 'Fifty-three customers. Some of them must have had bullets.',
            set: ['bullets'],
            add: { time: -1 },
            art: '💀',
            outcome: [
              'The Deacon brightens and leads you to a drawer marked *SUNDRIES*. Inside: spectacles, false teeth, a glass eye, and a heap of loose cartridges, every calibre under heaven.',
              { speaker: 'Deacon Pruitt', say: 'Gentlemen are buried with their boots on in Dustwater, Sheriff, but never with their ammunition. Waste not. Help yourself to the .44s. Consider it a deposit on your coffin. I’ll knock it off the final bill.' },
              'You pick out six, each one previously owned by somebody who no longer needs it. You try not to think about what that says about bullets. You load five. They go in with a sound like small doors closing.',
            ],
            next: 'hub',
          },
          {
            text: 'Borrow his blasting powder. Rig the water trough.',
            hint: 'It’ll take two hours to do it properly. It won’t miss.',
            if: (s) => s.get('time') >= 2,
            set: ['trap'],
            add: { time: -2 },
            fx: 'shake',
            art: '🧨',
            outcome: [
              'The Deacon helps, which is to say he carries the crate, hums *Rock of Ages*, and gives you a running commentary on what blasting powder does to people who sneeze near it.',
              'You bury two charges under the big water trough in front of the bank, right where a man stepping onto Main Street from the station would have to stand. Then you run the fuse back through the dust and under the boards of the jailhouse porch, where you can reach it with a match.',
              'It takes two hours, three blisters and one moment where Gladys the rattlesnake gets loose and the Deacon has to coax her back into her coffin with a hymn. When you’re done you are sweating, filthy and armed with something considerably larger than a bullet.',
              { speaker: 'Deacon Pruitt', say: 'Do try not to blow up the bank, Sheriff. Half my customers’ estates are in there. I do so hate chasing an invoice.' },
            ],
            next: 'hub',
          },
        ],
      },

      // ------------------------------------------------------------ NOON
      station: {
        title: '11:58 AM — The Station Platform',
        art: '🚂💨',
        mood: 'gold',
        weather: 'dust',
        scene: 'station',
        fx: 'shake',
        timer: 8,
        enter: { vars: { time: 0 } },
        text: [
          'The whistle comes first: long, thin, lonely, a sound that crawls in under your skin and sets up house. Then the smoke, a grey smudge on the horizon. Then the train, black and bellowing, sliding into Dustwater in a storm of steam and grit.',
          { if: 'evac',
            text: 'The platform is empty. Behind you, the chapel bell has stopped ringing and the whole town has gone to ground. Somewhere under the Silver Spur, forty people are holding their breath among the beer barrels.',
            else: 'The platform is not empty. Faces peer from every window on Main Street. Old Mrs Haskell is sitting on her porch in her rocking chair with a bag of peanuts, because she has not missed a hanging, a fire or a gunfight in sixty years and does not mean to start now.' },
          (s) => eliUp(s) ? 'You glance up at the water tower by the tracks. Something glints up there. A rifle barrel. A freckled face. Your stomach drops through your boots.' : null,
          'The train shudders to a stop. A single door opens. And a man steps down.',
          'He is older than the poster. Grey at the temples, lean as a fence post, a long dust-coloured coat and a gun worn low and easy on his hip. He looks at the town the way you look at a grave you’ve come to visit. Then he looks at you. At the star.',
          { speaker: 'Cole Mercer', say: 'You’re not Briggs.' },
          { speaker: 'You', say: 'Briggs is dead.' },
          { speaker: 'Cole Mercer', say: 'I know. I was there.' },
          'Behind him the conductor shouts *“Board!”* The train starts to hiss. Cole doesn’t move. Neither do you. **Decide.**',
        ],
        timeout: {
          art: '🚶',
          outcome: [
            'You stand there, hand hovering, while every thought you own stampedes in a different direction. Cole watches you do it. Then he nods, as if you’ve answered a question, and walks right past you, close enough to touch.',
            { speaker: 'Cole Mercer', say: 'Main Street. Noon. I’m not here for you, Sheriff. Try to remember that.' },
            'The train pulls out behind him in a long sigh of steam. You follow him up the street because there is nothing else in the world to do.',
          ],
          next: 'showdown',
        },
        choices: [
          {
            text: 'Fall into step beside him. Talk.',
            hint: 'He hasn’t touched his gun. Maybe he won’t.',
            art: '🗣️',
            outcome: [
              'You step up beside him. He glances at you sideways, surprised, and something that might once have been a smile twitches under his moustache.',
              { speaker: 'Cole Mercer', say: 'Walk with me, then. It’s a short street. Always was.' },
            ],
            next: 'walk_talk',
          },
          {
            text: 'Fire a warning shot into the sky.',
            hint: 'Show him the law means business.',
            set: ['shot_first'],
            effect: (s) => { if (!s.has('bullets')) s.set('empty'); },
            fx: 'redflash',
            art: '💥',
            outcome: [
              'You draw and fire straight up. The shot cracks off the station roof like a whip, and a crow falls out of the sky in sheer surprise.',
              { if: 'bullets',
                text: 'Your revolver still holds the borrowed rounds. You thumb the hammer back.',
                else: 'And that, you realise in the ringing silence that follows, was your bullet. Your one bullet. Now somewhere over New Mexico. The gun in your hand is a very expensive paperweight.' },
              'Cole hasn’t flinched. Not an inch. He looks at the smoke curling from your barrel with something like pity.',
              (s) => eliUp(s)
                ? 'But up on the water tower, a fourteen-year-old boy hears a gunshot and decides the fight has started.'
                : { speaker: 'Cole Mercer', say: 'Now everybody knows where you stand, Sheriff. Including me. Main Street. Noon.' },
            ],
            next: (s) => (eliUp(s) ? 'end_eli' : 'showdown'),
          },
          {
            text: 'Let him pass. Take your position on Main Street.',
            hint: 'Get to Main Street first. Sun at your back. Whatever you prepared, ready.',
            art: '🎯',
            outcome: [
              'You step aside. Cole tips two fingers to his hat brim and walks on up the platform. You take the back way, round the livery, and come out on Main Street ahead of him with the sun behind you and your heart going like a drum in a parade.',
              { if: 'trap', text: 'You crouch by the jailhouse porch, a match between your teeth. The fuse runs away under the boards toward the water trough. Your hands are shaking. That’s fine. Matches don’t care.' },
            ],
            next: 'showdown',
          },
          {
            text: 'Swing aboard the departing train.',
            hint: 'Last train out of Dustwater. Nobody would blame you. Much.',
            set: ['fled'],
            art: '🚃',
            outcome: [
              'The train jerks forward. Your legs decide before the rest of you does. You run three steps, grab the brass rail of the last car and haul yourself aboard as the platform starts to slide away.',
              'Cole Mercer turns on the platform and watches you go. He doesn’t reach for his gun. He doesn’t even look angry. He just looks tired, like a man who has watched a lot of people leave.',
            ],
            next: 'end_flee',
          },
        ],
      },

      walk_talk: {
        title: '11:59 AM — Main Street',
        art: '🚶‍♂️🚶',
        mood: 'gold',
        weather: 'dust',
        scene: 'desert-town',
        text: [
          'You walk side by side up the middle of Main Street, past the feed store, past the bank, past the boarded windows. Your shadows are so short at this hour they’re hiding under your boots.',
          'Up close Cole Mercer smells of coal smoke and sage. There is a scar across the back of his right hand like a rope burn. Six years of something.',
          { speaker: 'Cole Mercer', say: 'You took the star knowing I was coming. Either you’re very brave or nobody told you about me.' },
          { speaker: 'You', say: 'They told me plenty.' },
          { speaker: 'Cole Mercer', say: 'Then you’ll know they told you wrong. Ask me something, Sheriff. Quick. The clock’s nearly done.' },
          'Ahead, on the bank porch, a silver-haired figure in a fine coat has stepped into the shade to watch. Judge Voss. Two men with rifles flank him like bookends.',
        ],
        choices: [
          {
            text: 'Ask why he killed Sheriff Briggs.',
            hint: 'Straight to it.',
            set: ['clue_sheriff'],
            art: '❓',
            outcome: [
              { speaker: 'Cole Mercer', say: 'I got out of Yuma early. Good behaviour, if you can believe it. Briggs was waiting for me on the Red Mesa road with a paper in his pocket that said *dead*. He drew. I didn’t want to. I did anyway.' },
              { speaker: 'Cole Mercer', say: 'I’ve shot one man in my life, Sheriff. I buried him myself. Then I rode the rest of the way to the railhead and bought a ticket. I’m not proud of it. I’m not sorry I’m alive either.' },
            ],
            next: 'showdown',
          },
          {
            text: 'Tell him what you’ve already dug up.',
            hint: 'Lay your cards down. See what he does with them.',
            if: (s) => clues(s) >= 1,
            set: ['heard'],
            art: '🃏',
            outcome: [
              'You tell him. What you found, who told you, what it adds up to. You watch it land. Six years of something cracks across his face like ice on a trough.',
              { speaker: 'Cole Mercer', say: 'Somebody in this town finally asked. Took them long enough.' },
              { speaker: 'Cole Mercer', say: 'I didn’t come back for the money, or for the town, or for you. I came back to stand in the street where they put me in chains and look Harlan Voss in the eye while he explains himself. That’s all. That’s the whole of my wicked plan.' },
            ],
            next: 'showdown',
          },
          {
            text: 'Tell him to get back on the next train or face you.',
            hint: 'You don’t need his story. You need him gone.',
            set: ['warned'],
            art: '👉',
            outcome: [
              { speaker: 'You', say: 'There’s another train at six. Be on it, or be in the street at noon.' },
              'Cole stops walking. He studies you with eyes the colour of creek stones.',
              { speaker: 'Cole Mercer', say: 'That’s what Briggs said. Near enough word for word. They write it on the inside of the star, I think.' },
              'He walks on. You have the sick feeling you’ve just been weighed and found to be exactly the same as the last man.',
            ],
            next: 'showdown',
          },
        ],
      },

      showdown: {
        title: '12:00 Noon — Main Street',
        art: '🤠☀️🤠',
        mood: 'ember',
        weather: 'dust',
        scene: 'desert-town',
        fx: 'heartbeat',
        timer: 8,
        text: [
          'The bank clock clanks once, twice, and keeps going. Twelve strokes. The noon sun stands directly overhead like a judge who hasn’t made up his mind.',
          'Cole Mercer stops in the middle of Main Street, twenty paces off. He squares up to you, coat swept back behind the butt of his gun. He does not draw. He waits.',
          { if: 'evac',
            text: 'The street is empty from end to end. Every door is shut. It is just the two of you, and the dust, and the clock.',
            else: 'Faces press against every window on Main Street. A baby is crying somewhere. If bullets fly in this street, they won’t all find the right home.' },
          'On the bank porch, Judge Voss watches with his thumbs in his waistcoat. His two riflemen have spread out to either side.',
          { speaker: 'Judge Voss', say: 'What are you waiting for, Sheriff? He’s a convicted murderer! Shoot him! In the name of the law!' },
          (s) => eliUp(s) ? 'Above everything, on the water tower, the glint of Eli’s rifle barrel creeps up over the tank rim and settles on Cole Mercer’s back.' : null,
          { if: 'trap', text: 'Cole is standing right beside the water trough. Right on top of the powder. The match is in your hand.' },
          { if: 'empty', text: 'Your revolver hangs on your hip, as empty as a promise.' },
          'Cole’s hand hangs loose and easy. **It’s now.**',
        ],
        timeout: {
          art: '⏳',
          outcome: [
            'You don’t draw. You don’t speak. The moment stretches thin as wire.',
            (s) => eliUp(s)
              ? 'And someone else decides for you. From the water tower comes a crack and a puff of smoke, and dust leaps up a yard from Cole’s boots.'
              : 'Cole watches your hand not move. Slowly, very slowly, he lifts his own hand away from his gun and holds it open, palm out, at his side.',
            (s) => eliUp(s) ? null : { speaker: 'Cole Mercer', say: 'Good. Thinking man. There aren’t many. All right, Sheriff. Let’s talk.' },
          ],
          next: (s) => (eliUp(s) ? 'end_eli' : 'talk_down'),
        },
        choices: [
          {
            text: 'Draw.',
            hint: 'Twenty paces. One chance. Smooth is fast.',
            set: ['drew'],
            art: '🔫',
            outcome: [
              'Your hand moves before your head can stop it.',
            ],
            next: 'duel',
          },
          {
            text: 'Strike the match. Light the fuse.',
            hint: 'Two charges under the trough. Two hours of work.',
            if: 'trap',
            set: ['blast'],
            fx: 'shake',
            art: '🔥',
            outcome: [
              'You strike the match on your boot heel. The fuse catches with a hiss like an angry cat and races away under the boards, a little snake of fire running for the trough.',
              'Cole hears it. He looks down. He looks at you. And for the first time today, Cole Mercer looks genuinely impressed.',
            ],
            next: 'duel',
          },
          {
            text: 'Take your hand off your gun. Talk.',
            hint: 'He hasn’t drawn either. Maybe there’s a reason.',
            art: '🤚',
            outcome: [
              'You lift your hand away from your hip. Slowly. Open palm. Every muscle in your body screams at you not to do it.',
              'Cole’s eyes narrow. Then, just as slowly, he does the same.',
              { speaker: 'Judge Voss', say: 'Sheriff! What in God’s name are you doing?' },
              { speaker: 'You', say: 'My job, Your Honour.' },
            ],
            next: 'talk_down',
          },
          {
            text: 'Hold up the judge’s ledger.',
            hint: 'Brown calfskin. Every dollar. Everybody’s name.',
            if: canShowLedger,
            art: '📕',
            outcome: [
              'You pull the ledger out of your shirt and hold it high over your head, so the brown calfskin catches the sun and the gold initials on the cover glint for the whole street to see. **H. V.**',
              'On the bank porch, the colour drains out of Judge Harlan Voss’s face so fast you can practically hear it gurgle.',
              { speaker: 'You', say: 'Cole! Page forty-one. Six years ago. Read it.' },
              'You toss it across the twenty paces. Cole catches it one-handed without taking his eyes off you, then opens it, and reads, and goes very still.',
            ],
            next: 'voss_reveal',
          },
        ],
      },

      talk_down: {
        title: '12:01 PM — Main Street',
        art: '🤠🤝',
        mood: 'ember',
        weather: 'dust',
        scene: 'desert-town',
        text: [
          'Two people stand in the middle of Main Street with their hands empty, which in Dustwater is so unusual that a dog comes out from under the boardwalk to see what’s going on.',
          { speaker: 'Cole Mercer', say: 'Go on, then. You stopped this. Say something worth stopping it for.' },
          (s) => knowsTruth(s)
            ? 'You know more than you did this morning. Enough, maybe, to say it out loud.'
            : 'You don’t really know why he’s here. You only know that the judge is shouting and Cole isn’t, and that seems like it ought to mean something.',
          { speaker: 'Judge Voss', say: 'Sheriff, I order you to arrest that man! Or shoot him! Either will do! Both, ideally!' },
        ],
        choices: [
          {
            text: 'Say it: “You were framed. I know it was Voss.”',
            hint: 'Say it loud enough for the whole street.',
            if: knowsTruth,
            art: '⚖️',
            outcome: [
              { speaker: 'You', say: 'You didn’t rob that bank. Briggs swore you did and got made sheriff for it. And Judge Voss sent Briggs out on the Red Mesa road with a warrant that said *dead*, so you’d never get to say otherwise. I know it. I can prove some of it. I’ll find the rest.' },
              'The street goes so quiet you can hear the clock ticking on the bank. Cole Mercer looks at you for a long time. Then he takes his gun out of its holster, slowly, by two fingers, and holds it out to you butt-first.',
              { speaker: 'Cole Mercer', say: 'Six years I’ve waited for somebody with a star to say that. Here. I believe you’ll need this more than me.' },
            ],
            next: 'end_true',
          },
          {
            text: 'Tell him to hand over his gun. He’ll get a fair trial.',
            hint: 'That’s the law. That’s what the star is for.',
            art: '⛓️',
            outcome: [
              { speaker: 'You', say: 'Give me your gun, Mr Mercer. You’re under arrest for the death of Sheriff Briggs. You’ll get a fair trial. You have my word.' },
              'Cole considers this. He looks at the bank porch, at the judge, at the two riflemen. Then back at you. There is something very sad in his face, like a man watching a child promise that it won’t rain.',
              { speaker: 'Cole Mercer', say: 'A fair trial. In Dustwater. All right, Sheriff. I believe *you* believe it. That’ll have to do.' },
              'He unbuckles his gun belt and hands it to you, and holds out his wrists.',
            ],
            next: 'end_law',
          },
          {
            text: 'Draw while he’s talking.',
            hint: 'His hand is away from his gun. You’ll never get a better chance.',
            set: ['drew', 'dirty'],
            art: '🐍',
            outcome: [
              'He has just opened his mouth to answer you when your hand drops to your hip. You see him see it. You see the disappointment arrive in his eyes a fraction before his hand moves.',
            ],
            next: 'duel',
          },
          {
            text: 'Toss him the judge’s ledger.',
            hint: 'Let him read it in his own handwriting. The judge’s, that is.',
            if: canShowLedger,
            art: '📕',
            outcome: [
              'You take out the ledger and throw it underhand across the gap. Cole catches it against his chest. He opens it where your thumb has creased the page, and reads.',
              'On the bank porch, Judge Voss sees the brown calfskin, and stops shouting mid-word.',
            ],
            next: 'voss_reveal',
          },
        ],
      },

      voss_reveal: {
        title: '12:02 PM — The Bank Porch',
        art: '⚖️🔫',
        mood: 'storm',
        weather: 'dust',
        scene: 'desert-town',
        fx: 'shake',
        timer: 7,
        text: [
          'Cole Mercer looks up from the ledger. Slowly he turns, not toward you, but toward the bank.',
          { speaker: 'Cole Mercer', say: '*Mercer to take the drop.* In your own hand, Harlan. You always did have lovely handwriting.' },
          'Judge Voss isn’t smiling any more. His face has gone the colour of old candle wax.',
          { speaker: 'Judge Voss', say: 'That book is stolen property and a forgery and— Boys. Boys! Shoot them. Both of them. The sheriff has thrown in with the outlaw. You all saw it!' },
          'The two riflemen on the porch raise their guns. One at Cole. One at you.',
          (s) => eliUp(s) ? 'And up on the water tower, Eli Tanner’s rifle swings away from Cole and settles, very carefully, on the riflemen.' : null,
          'Cole drops the ledger and stands beside you without being asked. **Three guns on the porch. Seconds.**',
        ],
        timeout: {
          art: '💨',
          outcome: [
            'Before you can move, Cole hooks a boot behind your ankle and drags you down behind the water trough just as both rifles crack. Splinters leap off the boardwalk where you were standing.',
            { speaker: 'Cole Mercer', say: 'Stay down, Sheriff. You’re the only honest thing in this street. I’d like to keep you.' },
            'And then a voice rings out from the doorway of the Silver Spur, high and sharp and absolutely furious.',
          ],
          next: 'finale',
        },
        choices: [
          {
            text: 'Step up beside Cole. Star facing the judge.',
            hint: 'Not lawman and outlaw. Two people who want the truth.',
            set: ['stood'],
            art: '⭐',
            outcome: [
              'You step up shoulder to shoulder with Cole Mercer, and you turn so the sun hits the star on your chest and blazes it straight into the judge’s eyes.',
              { speaker: 'You', say: 'Anybody who shoots at this badge is shooting at the law of Dustwater. And the law has just read your ledger, Your Honour.' },
              'The riflemen hesitate. Hired guns are paid to shoot outlaws. Nobody told them about shooting the sheriff. They look at each other. They look at the judge. They look at their wages, presumably, and do some sums.',
            ],
            next: 'finale',
          },
          {
            text: 'Snatch up the ledger. Read it aloud to the whole street.',
            hint: 'Every window has ears. Let them hear.',
            set: ['read_aloud'],
            art: '📢',
            outcome: [
              'You scoop the ledger out of the dust and read, as loud as your lungs will go. Names. Dates. Dollars. *The Dustwater bank, ten thousand. Briggs his share. Mercer to take the drop.* The feed store’s mortgage. The Haskells’ water rights. Page after page.',
              'Windows start to open. Doors start to creak. People who have paid Harlan Voss for six years without knowing why come out onto their porches to hear exactly how much.',
              { speaker: 'Judge Voss', say: 'Lies! Forgeries! Shoot—' },
              'But nobody is listening to him any more. They are listening to you.',
            ],
            next: 'finale',
          },
          {
            text: 'Draw on the judge.',
            hint: 'End it. Right now. One shot.',
            set: ['drew', 'judge_shot'],
            fx: 'redflash',
            art: '🔫',
            outcome: [
              'You draw and fire at the man who did all of this.',
              'You hit him. You actually hit him, high in the shoulder, and he spins and falls against the bank door. And both riflemen, who had been hesitating, stop hesitating.',
            ],
            next: 'end_death',
          },
        ],
      },

      // ------------------------------------------------------------ ROUTERS
      duel: {
        redirect: (s) => {
          if (eliUp(s)) return 'end_eli';
          if (s.has('blast')) return 'end_good';
          if (s.has('empty')) return 'end_death';
          if (s.has('dirty')) return s.has('steady') ? 'end_good' : 'end_death';
          return s.has('steady') || s.has('bullets') ? 'end_good' : 'end_death';
        },
      },

      finale: {
        redirect: (s) => (s.has('abby_trust') ? 'end_secret' : 'end_true'),
      },

      // ------------------------------------------------------------ ENDINGS
      end_secret: {
        art: '⚖️🤝⭐',
        mood: 'gold',
        weather: 'dust',
        scene: 'desert-town',
        fx: 'flash',
        ending: { id: 'two-against-one', title: 'Justice Rides the Noon Train', type: 'secret' },
        text: [
          'The swing doors of the Silver Spur bang open, and out steps Abby Quint with a double-barrelled shotgun the length of a fence rail.',
          { speaker: 'Abby Quint', say: 'Harlan Voss! Six years ago you stood on the courthouse steps and told me I could testify or keep my saloon. Well, I’ve done the arithmetic, and I’d rather testify.' },
          { speaker: 'Abby Quint', say: 'Cole Mercer was in my back room the whole night that bank was robbed. I’ll swear it in any court in this territory. And you two gentlemen on the porch: you lower those rifles, or I will redecorate the bank with you.' },
          { if: 'evac', text: 'Behind her, up the cellar steps, come forty citizens of Dustwater, blinking in the sunlight, who have just heard every word through the floorboards. The piano player is at the front, looking ready to kill someone himself.' },
          (s) => eliUp(s) ? 'And from the top of the water tower comes a cracking adolescent voice: *“Deputy Tanner! I’ve got the one on the left!”* He hasn’t fired. He doesn’t need to. Everybody knows where he is now.' : null,
          'The riflemen look at the shotgun. At the star. At Cole. At the town filling the street. Then, as one, they lay their guns down on the boardwalk and step back with their hands up, like men remembering urgent business elsewhere.',
          'Judge Harlan Voss tries the bank door behind him. It is locked. It is noon on a weekday and the bank is locked, because the clerk is hiding in Abby’s cellar.',
          'You and Cole Mercer walk him to the jailhouse together, one on each arm. Nobody in Dustwater has ever seen the judge walk so fast or say so little.',
          { speaker: 'Cole Mercer', say: 'You know what the strange thing is, Sheriff? You never fired. All day. With a whole town telling you to.' },
          { speaker: 'You', say: 'I only had the one bullet. I was saving it for the right man.' },
          { speaker: 'Cole Mercer', say: 'And here he is, and you’re not even going to use it on him.' },
          { speaker: 'You', say: 'No. The law gets him. The real kind, this time.' },
          'The circuit court comes through in September. Abby testifies. The ledger testifies. Half the town turns out to testify about the other half. Harlan Voss goes to Yuma, to a cell Cole Mercer can describe for him in great detail.',
          { if: 'will', text: 'You tear up your will. Eli is extremely disappointed about the horse.' },
          { if: 'measured', text: 'Deacon Pruitt sends you a note of congratulations, and a second note mentioning that your coffin is now available at a substantial discount, should you ever need it, or know anyone.' },
          'And on the inside of the star, where Cole once said they must write the same tired words for every sheriff, you scratch new ones with the point of your knife: ***Ask first.***',
        ],
      },

      end_true: {
        art: '🌅🤠',
        mood: 'dawn',
        weather: 'dust',
        scene: 'dawn',
        ending: { id: 'the-truth', title: 'The Man Who Asked', type: 'true' },
        text: [
          { if: 'ledger',
            text: 'The gunfight never comes. The riflemen take one look at Cole Mercer standing beside the sheriff and decide they are not being paid enough for this. They throw down their guns and walk. The judge walks too, very fast, toward the livery stable.',
            else: 'Cole Mercer’s gun is warm in your hand, still in its holster, as Judge Voss stamps back inside the bank and slams the door hard enough to crack the glass.' },
          'That evening, at the Silver Spur, Cole tells you the whole thing. The robbery he didn’t commit. The deputy who lied. The six years in Yuma breaking rocks under a sun that makes Dustwater’s look like a candle. The road home, and Briggs waiting on it.',
          { speaker: 'Cole Mercer', say: 'I didn’t come back to kill anybody. I came to stand in that street and be seen. That was all I had left. And then a sheriff with one bullet stopped and listened.' },
          (s) => s.has('ledger')
            ? 'You wire the territorial marshal that night, with the ledger as your evidence. Judge Voss is arrested two days later at the Albuquerque railhead, with a carpet bag full of banded cash and a forged ticket to San Francisco.'
            : 'You don’t have proof enough to hang a judge. Not yet. But you have Cole’s story, and the Deacon’s warrant, and a stubbornness you didn’t know you owned until this morning. You write to the territorial marshal. Then you write again. Then you go and fetch him.',
          'Six weeks later, the territorial governor signs a pardon for Cole Mercer. He reads it on the station platform, the same one where he stepped off the noon train, and folds it into his coat like a letter from someone he loved.',
          { speaker: 'Cole Mercer', say: 'Look after this town, Sheriff. It doesn’t deserve you. Make it.' },
          { if: 'measured', text: 'Deacon Pruitt, ever the professional, sells your standard pine coffin to a travelling salesman who died of a surfeit of oysters. He sends you a thank-you card.' },
          { if: 'evac', text: 'Eli rings the chapel bell for a full hour when the pardon comes through. Nobody has the heart to stop him.' },
          'You keep the bullet. The one you never fired. You put it on a string round your neck, and every time a stranger steps off the noon train, you touch it, and you remember to ask first.',
        ],
      },

      end_good: {
        art: '🔫💨🏆',
        mood: 'sunny',
        weather: 'dust',
        scene: 'desert-town',
        fx: 'flash',
        ending: { id: 'one-bullet', title: 'One Was Enough', type: 'good' },
        text: [
          (s) => s.has('blast')
            ? 'The water trough goes up like the Fourth of July. A wall of water, splinters and Dustwater dust hurls Cole Mercer ten feet across Main Street and drops him flat on his back, gun spinning away into the horse trough opposite. By the time he can see straight, you are standing over him with your one bullet chambered and the hammer back.'
            : s.has('dirty')
              ? 'You clear leather while his mouth is still open. It isn’t a fair draw. It isn’t close. Your bullet takes him in the gun arm and his revolver spins away into the dust, unfired.'
              : 'It’s the smoothest thing you’ve ever done. Draw, cock, fire, all one motion, the way you practised it a hundred times this morning on a row of whiskey bottles. Cole’s gun is half out of the leather when your bullet takes it right out of his hand.',
          (s) => s.has('blast') ? null : s.has('steady') ? 'One bullet. You only ever needed the one.' : 'You had a cylinder full of borrowed bullets. You only fired one. You’ll wonder for the rest of your life whether that was skill or luck.',
          'Cole Mercer sits in the dust, holding his wrist, and looks up at you. He isn’t angry. If anything he looks relieved, the way a man looks when a long road finally ends.',
          { speaker: 'Cole Mercer', say: 'Good shot, Sheriff. Now listen, because I’m only saying it once and I don’t much care if you believe it. Ask the judge where the ten thousand went. Ask him why Briggs had a warrant that said *dead*.' },
          'The town pours into the street, cheering. Judge Voss shakes your hand so hard your teeth rattle and announces Cole will hang at sundown, *in the interest of swift justice*. Abby Quint watches it all from the doorway of the Silver Spur and doesn’t cheer at all.',
          { if: 'clue_trial', text: 'You think about the trial that lasted forty minutes. You think about it all afternoon.' },
          'At five o’clock, you walk into the jail, take the keys off the hook, and tell the judge’s men that the prisoner is now in the custody of the territorial marshal, who you have just wired, and who is on the six o’clock train. The judge goes purple. Cole Mercer, behind the bars, laughs for the first time in six years.',
          { if: 'dirty', text: 'You won. Everyone says so. But every time you close your eyes you see his face as your hand dropped, and you know you won the way the last sheriff would have.' },
          'They put your name on the town hall wall: *THE SHERIFF WHO STOPPED COLE MERCER.* Every time you walk past it, you think: *I stopped him. Now I have to find out from what.*',
        ],
      },

      end_death: {
        art: '💀🌵',
        mood: 'blood',
        weather: 'dust',
        scene: 'desert-town',
        fx: 'redflash',
        ending: { id: 'main-street', title: 'Standard Pine', type: 'death' },
        text: [
          (s) => s.has('judge_shot')
            ? 'Two rifles fire from the bank porch, almost together. You don’t hear them. You just feel Main Street come up very fast and very warm to meet your cheek.'
            : s.has('empty')
              ? 'Your gun comes up and the hammer falls with a small, lonely *click*. Your one bullet is somewhere over New Mexico. Cole’s isn’t.'
              : 'Your hand is fast. Cole Mercer’s is faster. It isn’t even close. It was never going to be close. You hear the shot after you feel it, a hard punch high in the chest that sits you down in the dust like a tired child.',
          'The sky is very blue. A buzzard turns slow circles in it. Somewhere a dog is barking and the bank clock is ticking and someone is running toward you.',
          (s) => s.has('judge_shot')
            ? 'It’s Cole. He drags you behind the trough with bullets kicking up dust around him, and holds your head, and says something you can’t hear. Later, much later, you hope he got away.'
            : 'It’s Cole. He kneels beside you, his gun already back in its holster, and puts his coat under your head. His face is grey.',
          { if: '!judge_shot', speaker: 'Cole Mercer', say: 'Why didn’t you just ask me? Why does nobody ever just *ask*?' },
          { if: 'measured', text: 'Deacon Pruitt was right about the coffin. Five foot nine, narrow in the hips, standard pine. No extension needed. He does a beautiful job. He cries a little, which he says is unprofessional, and does anyway.' },
          { if: 'will', text: 'Eli gets the horse. He names her Sheriff. It is the only monument you ever get, and honestly you’d have liked it.' },
          { if: '!measured', text: 'Deacon Pruitt measures you on the boardwalk with his yellow tape, gently, as if you might still mind.' },
          'They bury you on Boot Hill with the star still pinned on, because nobody else in Dustwater will take it.',
        ],
      },

      end_flee: {
        art: '🚃🏜️',
        mood: 'dawn',
        weather: 'dust',
        scene: 'mountains',
        ending: { id: 'last-train-out', title: 'Last Train Out of Dustwater', type: 'bad' },
        text: [
          'The train picks up speed. Dustwater shrinks behind you: the water tower, the courthouse, the white chapel, the bank clock, until it’s just a smudge of dust against the mesas, and then not even that.',
          'You unpin the star. You turn it over in your hands. Then you leave it on the seat beside you, and move to another carriage, as if it might follow.',
          (s) => eliUp(s)
            ? 'As the town disappears you could swear you saw a small figure on top of the water tower, rifle in arms, watching the train take the sheriff away. You tell yourself you imagined it. You keep telling yourself that for years.'
            : 'You think about Eli ringing the chapel bell for a sheriff who wasn’t there to hear it stop.',
          { if: 'ledger', text: 'The judge’s ledger is still in your shirt. You read it all the way to El Paso. Every page is a man who could have been saved by somebody braver than you. In El Paso you post it, anonymously, to the territorial marshal. It is the bravest thing you do all year. It isn’t enough.' },
          { if: 'abby_trust', text: 'A month later a letter finds you, in Abby Quint’s neat hand: *Cole Mercer stood in the street at noon and the judge’s men shot him, and called it the law. I don’t blame you. I just thought you should know.* You read it until the paper goes soft.' },
          'You get off the train in a town where nobody knows you, and buy a drink in a saloon where nobody asks. You never wear a star again. Some days, you can still feel the weight of it, right over your heart, where it should have been.',
        ],
      },

      end_eli: {
        art: '🗼💔',
        mood: 'blood',
        weather: 'dust',
        scene: 'desert-town',
        fx: 'shake',
        ending: { id: 'boy-on-the-tower', title: 'The Boy on the Water Tower', type: 'bad' },
        text: [
          'It happens in the time it takes to blink. A crack from the water tower, Eli’s shot going wide, and Cole Mercer spinning on his heel with his gun already out, the way a man spins when six years of prison have taught him that the shot you don’t see is the one that kills you.',
          'He fires once. At the tower. At the glint.',
          'There is a cry, high and young, and a small figure tumbles off the platform into the water tank with an enormous splash.',
          'Cole Mercer stands frozen in the middle of Main Street. You watch it reach his face: what he has done, who he has done it to. He drops his gun in the dust as if it had burned him, and then he is running, and so are you, and the two of you go up the tower ladder one after the other like men who have forgotten they were ever enemies.',
          'You haul Eli out of the tank together. He is soaking wet, white as milk, with a bullet through the meat of his shoulder, and he is alive, and he is apologising.',
          { speaker: 'Eli Tanner', say: 'I heard the shot and I thought it had started. I thought I was helping. You never took your hat off. I’m sorry. I’m sorry, Sheriff.' },
          { speaker: 'Cole Mercer', say: 'Hush, son. Hush now. That’s my fault, not yours. I should have known. You don’t ever shoot at a glint.' },
          'Cole holds Eli’s shoulder closed with both hands until Doc Henley arrives, and then he holds out his wrists to you without a word. You take him in. Nobody fires another shot.',
          (s) => s.has('clue_abby') || s.has('clue_trial') || s.has('clue_sheriff') || s.has('heard')
            ? 'Judge Voss hangs him for Briggs within the week, in the interest of swift justice. You knew enough to suspect it was wrong. You never knew enough to stop it.'
            : 'Judge Voss hangs him within the week, in the interest of swift justice. You never find out why he came back. It nags at you for the rest of your life.',
          'Eli heals. He can lift his arm above his head again by spring. He never touches a rifle again, and he never quite looks at you the same way, and you never quite look at the water tower at all.',
        ],
      },

      end_law: {
        art: '⛓️🌇',
        mood: 'ember',
        scene: 'dungeon',
        ending: { id: 'the-law-is-satisfied', title: 'The Law Is Satisfied', type: 'neutral' },
        text: [
          'You march Cole Mercer to the jailhouse and lock him in the cell where he waited for his trial six years ago. He sits on the cot and looks at the wall as if he recognises the cracks.',
          'Judge Voss is overjoyed. He convenes court that very afternoon, in the saloon, because the courthouse is *being swept*. The trial lasts thirty-five minutes, which is a new record. Cole doesn’t say a word in his own defence. He just watches you.',
          { if: 'abby_trust', text: 'Abby Quint stands up in the middle of it and says she has something to tell the court. The judge reminds her, very kindly, about her mortgage. She sits back down. She does not look at you again.' },
          'They hang Cole Mercer at sundown from the crossbeam of the livery stable, for the murder of Sheriff Briggs. The town turns out. The town cheers. The judge makes a speech about law, and order, and the brave new sheriff, and puts his hand on your shoulder for the newspaper sketch.',
          (s) => knowsTruth(s)
            ? 'You knew. That’s the worst of it. You knew enough to suspect, and you chose the rulebook anyway, because the rulebook was safer than the truth. The law is satisfied. You aren’t.'
            : 'Before they lead him out, Cole says one thing to you through the bars: *“Ask the judge where the money went. Somebody should, one day.”* You think about it every night for a year. Then you ask. By then it is far too late.',
          { if: 'measured', text: 'Deacon Pruitt measures Cole for a coffin with unusual care, and charges the town nothing. *Some customers,* he says, *you don’t send a bill.*' },
          'You keep the star. You keep the job. Every day at noon, when the train whistles, you find you can’t look at the platform.',
        ],
      },
    },
  });
})();
