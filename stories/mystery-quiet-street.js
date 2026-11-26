/*
 * The Quiet Street — MysteryFate story.
 *
 * SOLUTION (for authors): On Friday 14 October 2005, sixteen-year-old Tessa Rourke walked home from
 * choir (her bike had a flat). She always carried a micro-cassette recorder, and in September she had
 * taped Police Chief Gordon Pike taking quarry money in a diner booth. Gordon picked her up on Linden
 * Street in his navy unmarked Crown Victoria, drove her out Quarry Road and demanded the tape. She
 * bolted at mile marker four and went down the bank into the woods. Gordon assumed she drowned in
 * Miller's Creek. Next morning he "searched" the Rourke garage, took her bike and planted it at the
 * creek, and leaned on neighbour Marian Voss (he had made her son Danny's drug charge disappear) to
 * swear she saw Tessa climb into "a blue pickup" — stepfather Dale's truck. Under Linden Street's
 * orange sodium lamps nobody can see blue. Tessa, alive, reached the window of her secret boyfriend
 * Kyle Pike, the chief's son; he drove her to the bus in Carver City and kept her recorder tape
 * ("Side B", still running in Gordon's car) in his safe for twenty years. Now 36, Tessa has come back
 * for the twentieth-anniversary vigil and is leaving the podcaster anonymous voicemails, signing off
 * the way she did on her tapes: "Porch light's on."
 *
 * Gordon clues: c_slip c_bike c_light c_tape c_car c_recant c_threat c_sideb
 * Secret ending: c_voice (Tape 9's sign-off, then recognised in a voicemail) + c_calls (ask Kyle if she's alive),
 * then accuse "Someone else..." -> "Nobody. Tessa is alive."
 */
(function () {
  'use strict';

  const say = (speaker, text, cond) => (cond === undefined ? { speaker, say: text } : { speaker, say: text, if: cond });
  const clamp = (n) => Math.max(0, Math.min(5, n));
  // Adjust the HUD meters (clamped 0..5), then run an optional extra effect.
  const mod = (leads, trust, extra) => (s) => {
    s.setVar('leads', clamp(s.get('leads') + leads));
    s.setVar('trust', clamp(s.get('trust') + trust));
    if (extra) extra(s);
  };

  const GORDON = ['c_slip', 'c_bike', 'c_light', 'c_tape', 'c_car', 'c_recant', 'c_threat', 'c_sideb'];
  const EVIDENCE = {
    c_slip: 'Gordon Pike\'s slip: he knew Tessa was walking that night, not riding',
    c_bike: 'the flat tire that meant somebody else carried her bike to the creek',
    c_light: 'the orange sodium lamp that turns anything blue the colour of weak tea',
    c_tape: 'Tape 7, the chief\'s voice in a diner booth talking quarry permits and cash',
    c_car: 'the navy Crown Victoria he sold two weeks later, with creek mud in the wheel wells',
    c_recant: 'Marian Voss admitting the chief told her what she saw',
    c_threat: 'the old man in the Pike Hardware truck who wanted you gone',
    c_sideb: 'Side B, the tape that was still running in the chief\'s car on October 14th',
  };
  const proof = (s) => s.count(GORDON);
  const joinList = (items) => (items.length === 1 ? items[0] : items.slice(0, -1).join('; ') + '; and ' + items[items.length - 1]);
  const gordonList = (s) => joinList(GORDON.filter((f) => s.has(f)).map((f) => EVIDENCE[f]));
  const secretReady = (s) => s.has('c_voice') && s.has('c_calls');
  const strongCase = (s) => (s.has('case_tape') && s.has('c_sideb')) || (s.has('case_recant') && s.has('c_recant'));

  const notebook = (s) => (proof(s) === 0
    ? 'Your notes app is a mess of maybes. A flat tire nobody checked, a town that made up its mind in 2005, and nothing you could say out loud without a lawyer wincing.'
    : `Your notes app holds: ${gordonList(s)}.`);

  registerStory({
    id: 'quiet-street',
    title: 'The Quiet Street',
    category: 'mystery',
    tagline: 'Twenty years ago a girl walked home down Linden Street. Tonight somebody is leaving you voicemails in her voice.',
    description: 'You host a true-crime podcast, and you have finally come home to the case that made you: Tessa Rourke, sixteen, who vanished between choir practice and her own front porch. The town already knows who did it. The town is wrong, and somebody here would very much like you to leave before the anniversary vigil.',
    cover: '📼',
    accent: '#9b8cff',
    ambient: 'mystery',
    scene: 'street',
    warning: 'Contains: a missing teenager, threats, a car chase.',
    vars: { leads: 0, trust: 2 },
    hud: [
      { var: 'leads', label: 'Leads', icon: '🔎', max: 5 },
      { var: 'trust', label: 'Town Trust', icon: '🏘️', max: 5 },
    ],
    voices: {
      narrator: { gender: 'female', pitch: 0.95, rate: 0.93, accent: 'en-US', note: 'hushed late-night true-crime host' },
      'Tessa (tape, 2005)': { gender: 'female', pitch: 1.4, rate: 1.2, accent: 'en-US', note: 'bright, wisecracking sixteen-year-old into her recorder' },
      'Unknown Caller': { gender: 'female', pitch: 0.9, rate: 0.82, accent: 'en-US', volume: 0.6, note: 'whispered voicemail, careful, frightened' },
      'Tessa': { gender: 'female', pitch: 1.05, rate: 0.9, accent: 'en-US', note: 'thirty-six now, steady, the girl still in there' },
      'Dale Rourke': { gender: 'male', pitch: 0.7, rate: 0.82, accent: 'en-US', note: 'gravelly, worn down, sober and sad' },
      'Gordon Pike': { gender: 'male', pitch: 0.55, rate: 0.8, accent: 'en-US', note: 'folksy retired chief, slow, menace under the charm' },
      'Marian Voss': { gender: 'female', pitch: 1.2, rate: 0.78, accent: 'en-GB', note: 'frail, sweet old neighbour, guilt in every pause' },
      'Kyle Pike': { gender: 'male', pitch: 1.0, rate: 0.95, accent: 'en-US', note: 'quiet, guarded, carrying something heavy' },
      'Benny Kowalski': { gender: 'male', pitch: 1.25, rate: 1.35, accent: 'en-US', note: 'small-town morning radio motormouth' },
      'Walt (caller)': { gender: 'male', pitch: 0.8, rate: 1.05, accent: 'en-AU', note: 'old mechanic, plain-spoken' },
      'Father Okafor': { gender: 'male', pitch: 0.85, rate: 0.88, accent: 'en-GB', note: 'warm, careful priest' },
      'Detective Ruiz': { gender: 'female', pitch: 0.85, rate: 1.08, accent: 'en-US', note: 'crisp state-police cold-case detective' },
    },
    start: 'intro',
    scenes: {
      // ------------------------------------------------------------------ DAY ONE
      intro: {
        title: 'Tuesday, 4:50 PM — Linden Street',
        art: '🏘️📼',
        mood: 'fog',
        scene: 'street',
        text: [
          'Linden Street hasn\'t changed. Same sagging porches, same maples dropping rust-coloured leaves, same tall old sodium streetlamps the town never got round to replacing. When they flicker on at dusk, everything under them turns the colour of weak tea.',
          'You were twelve the last time you lived here, at number 14. Tessa Rourke, sixteen, babysat you on Friday nights and let you talk into her micro-cassette recorder. On Friday, October 14th, 2005, she walked out of choir practice at St. Brigid\'s and never reached her front door.',
          'The official story fits on a postcard. Neighbour Marian Voss saw Tessa climb into **a blue pickup** under the streetlamp at 8:50. Her stepfather, **Dale Rourke**, drove a blue pickup. Her bike turned up in Miller\'s Creek the next afternoon. Dale was never charged. Harlow convicted him anyway.',
          'Now you host *The Long Quiet*, a true-crime podcast with two million listeners, and the twentieth-anniversary vigil is on Friday. You\'ve barely parked when your phone buzzes. Voicemail. Unknown number.',
          say('Unknown Caller', 'You came back. Good. Ask them about the bike.'),
          'Click. You play it twice. Then you look up and down the street and feel a dozen curtains looking back. Where do you start?',
        ],
        choices: [
          {
            text: 'Knock on Dale Rourke\'s door',
            hint: 'The man the whole town blames.',
            art: '🚪',
            scene: 'house',
            set: ['met_dale'],
            effect: mod(1, -1),
            outcome: [
              'Dale Rourke is sixty-four, sober fifteen years, and opens the door like a man who expects a fist. Across the street, a porch light snaps on. Somebody is already counting how long you stay.',
              'He shows you Tessa\'s room. Nobody has touched it: band posters, a choir robe on a hanger, a dent in the pillow where her mother used to sit and cry until she died in 2019.',
              say('Dale Rourke', 'Chief Pike searched this house himself, the morning after. Took her tapes, took stuff from the garage. Gave the tapes back a year later in a shoebox. Never gave me back my good name.'),
              'He pushes the shoebox into your arms at the door. *She\'d want you to have these. You were her favourite kid.*',
            ],
            next: 'motel',
          },
          {
            text: 'Walk into the Hollis Diner',
            hint: 'Retired Chief Gordon Pike holds court there every afternoon.',
            art: '☕',
            scene: 'kitchen',
            set: ['c_slip'],
            effect: mod(1, 1),
            outcome: [
              'The diner smells of burnt coffee and menthol. In the corner booth sits **Gordon Pike**, seventy-six, Harlow\'s police chief for thirty years, still wearing the moustache and the authority. Half the counter turns to see whether he\'ll shake your hand. He does. The room relaxes.',
              say('Gordon Pike', 'The podcast kid. Welcome home. Listen, I\'ll save you some airtime: that girl was walking down Linden in the dark and she got into her stepdaddy\'s truck. We just couldn\'t prove the rest.'),
              'You write it down without looking up. *Walking.* The official story has her riding her bike: that\'s why it was found in the creek. The chief who ran the case just said she was walking.',
              'He coughs, a deep smoker\'s rattle, and pats your shoulder like a man who owns it.',
            ],
            next: 'motel',
          },
          {
            text: 'Sit with Marian Voss on her porch',
            hint: 'The only witness. Number 9.',
            art: '🪑',
            set: ['c_light'],
            effect: mod(1, 1),
            outcome: [
              '**Marian Voss** is eighty-one, tiny, and remembers you. She brings out oatmeal cookies on a chipped plate, and the two of you sit on her porch swing as the sodium lamp at the curb buzzes awake.',
              say('Marian Voss', 'Right there, under that light. Tessa climbed into a blue pickup. Blue as a robin\'s egg. I told the chief exactly what I saw.'),
              'She says it like a prayer she\'s said too many times. You glance at your rental car, parked under the same lamp. It\'s bright blue. Under that orange glow it looks muddy brown. You couldn\'t swear to its colour if your life depended on it.',
              'Marian follows your eyes, and stops rocking.',
            ],
            next: 'motel',
          },
        ],
      },

      motel: {
        title: 'Tuesday, 10:15 PM — The Riverside Motor Inn',
        art: '📦📼',
        mood: 'night',
        scene: 'apartment',
        text: [
          'Room 6 of the only motel in Harlow: a buzzing ice machine, a bedspread the colour of old bruises, a window onto the parking lot.',
          { if: 'met_dale', text: 'Dale\'s shoebox sits on the bed.', else: 'When you get back, there\'s a shoebox on the mat outside your door, with a note in shaky capitals: *SHE\'D WANT YOU TO HAVE THESE. — D.R.*' },
          'Inside: eleven micro-cassettes in Tessa\'s handwriting, the labels faded but legible. You dig out the old recorder you bought on eBay for exactly this moment. Your hands are not quite steady.',
          'Three labels jump out at you. It\'s late, and you\'ll only get through one properly before the batteries die.',
        ],
        choices: [
          {
            text: 'Tape 3: “Oct 13 — WORST DAY EVER”',
            hint: 'Recorded the night before she vanished.',
            art: '📼',
            set: ['c_bike'],
            effect: mod(1, 0),
            outcome: [
              'Hiss. A slammed door. Then Tessa, sixteen forever, furious and funny.',
              say('Tessa (tape, 2005)', 'Field report. Back tire\'s flat AGAIN. Dale says he\'ll patch it Saturday. So tomorrow I\'m walking to choir like a peasant. If I die of cold on Linden Street, avenge me.'),
              'You stop the tape and sit very still. Her bike had a flat on the 13th. On the 14th she walked. So how did that bike get two miles out of town, into Miller\'s Creek, by the next afternoon?',
              'Somebody carried it there.',
            ],
            next: 'night_visitor',
          },
          {
            text: 'Tape 7: “Diner. SECRET. Don\'t erase”',
            hint: 'Underlined three times.',
            art: '🤫',
            set: ['c_tape'],
            effect: mod(1, 0),
            outcome: [
              'Clatter of plates. Tessa whispering: she\'s hiding the recorder in her backpack at the Hollis Diner, practising to be a real reporter. Then two men in the booth behind her.',
              'One voice you don\'t know. The other you heard this afternoon, younger but unmistakable: a slow, folksy drawl.',
              say('Gordon Pike', 'Quarry permits go through when I say they go through. Envelope\'s light again, Ray, and the state inspectors start getting curious.'),
              'Tessa\'s whisper, giddy and terrified: *Oh my God. Oh my God, that\'s the chief.* The date on the label is September 2005. A month before she vanished.',
            ],
            next: 'night_visitor',
          },
          {
            text: 'Tape 9: “for K. (PRIVATE!!!)”',
            hint: 'There\'s a heart drawn on it.',
            art: '💌',
            set: ['c_kyle', 'c_signoff'],
            effect: mod(1, 0),
            outcome: [
              'This one is quieter. Tessa, lying on her bed by the sound of it, talking to someone who isn\'t there.',
              say('Tessa (tape, 2005)', 'K says the city\'s only three hours on the bus. K says when I\'m ready, he\'ll drive me to the station himself, no questions. Nobody knows about us. Nobody can EVER know. His dad would kill him.'),
              'A pause. Then the little ritual she used to do for you, when you were twelve and she was the coolest person alive:',
              say('Tessa (tape, 2005)', 'This is T. Porch light\'s on. Over and out.'),
              'You\'d forgotten that. You\'d forgotten how she always signed off. Your throat goes tight.',
            ],
            next: 'night_visitor',
          },
        ],
      },

      night_visitor: {
        title: 'Wednesday, 1:12 AM — Room 6',
        art: '🚙🔦',
        mood: 'night',
        scene: 'apartment',
        fx: 'heartbeat',
        timer: 8,
        text: [
          'Headlights sweep across your ceiling and stop.',
          'You roll off the bed and press your eye to the gap in the blinds. A pickup has pulled in beside your rental, engine idling, lights off now. A figure in a dark coat is bent over your driver\'s door. You hear the soft, patient scrape of something thin working at the lock.',
          'Your bag is on the passenger seat. Your laptop. The digitised copies of the tapes.',
          'The figure straightens and turns towards your window. **Decide. Now.**',
        ],
        timeout: {
          text: 'You froze.',
          fx: 'redflash',
          unset: ['c_tape'],
          set: ['lost_bag'],
          effect: mod(0, -1),
          outcome: [
            'You stand there with your heart slamming and do nothing at all. The window of your rental car crumps inward. A gloved arm reaches in. The bag is gone, and so is the truck, before you\'ve even found your shoes.',
            'In the morning the motel owner sweeps up the glass and tells everyone at the diner that the podcast kid attracts trouble. Every copy of the diner tape was in that bag.',
          ],
          next: 'day2',
        },
        choices: [
          {
            text: 'Photograph the truck through the blinds',
            hint: 'Get the plate. Stay inside.',
            art: '📸',
            fx: 'flash',
            set: ['saw_truck'],
            effect: mod(1, 0),
            outcome: [
              'You forget the flash is on. The parking lot lights up white for a split second, and the figure flinches like a vampire.',
              'He\'s in the truck and gone in five seconds, but your photo is sharp: a white pickup, magnetic sign on the door. **PIKE HARDWARE — EST. 1961.** The figure is just a smear of dark coat. On your windshield, tucked under the wiper, is a sheet of paper.',
              '*SHE\'S AT PEACE. LET HER REST.*',
            ],
            next: 'day2',
          },
          {
            text: 'Throw open the door and go out',
            hint: 'Make him face you.',
            art: '🏃',
            scene: 'street',
            set: ['c_threat', 'saw_truck'],
            effect: mod(1, -1),
            outcome: [
              'You come out barefoot, yelling. The figure doesn\'t run. He takes his time: an old man, heavy-shouldered, hat low, with a wet, rattling cough you could pick out of a crowd. He climbs into a white pickup with *PIKE HARDWARE* on the door.',
              'Then he leans out of the window, and you catch his voice, low and almost kind.',
              say('Gordon Pike', 'Roads round here get awful dark, kid. Go home.'),
              'He\'s gone. By breakfast, the motel owner is telling the whole diner how the podcast kid ran around the parking lot in their underwear screaming at Chief Pike. Nobody believes the other half of the story.',
            ],
            next: 'day2',
          },
          {
            text: 'Hold your breath and record',
            hint: 'Phone to the glass. Let him talk.',
            art: '🎙️',
            set: ['c_leverage'],
            effect: mod(1, 0),
            outcome: [
              'You crouch below the sill with your phone pressed to the glass, recording. The scraping stops. A cell phone rings out in the lot, and the figure answers it, low and irritated.',
              say('Gordon Pike', 'No. No, I\'m handling it. Marian, go back to bed. You said what you said twenty years ago and you\'ll keep saying it, same as Danny keeps his nose clean. That\'s the deal. Always was.'),
              'He hangs up and drives off without finishing the lock. You play the recording back four times. Chief Pike and the town\'s only witness have a *deal*.',
            ],
            next: 'day2',
          },
        ],
      },

      // ------------------------------------------------------------------ DAY TWO
      day2: {
        title: 'Wednesday, 8:30 AM — Linden Street',
        art: '🍂📱',
        mood: 'sunny',
        scene: 'street',
        enter: { effect: (s) => { if (s.has('c_signoff')) s.set('c_voice'); } },
        text: [
          'Morning, and the street looks innocent again. Kids on bikes. A man raking leaves who stops raking to watch you pass.',
          { if: 'lost_bag', text: 'Your car window is a sheet of plastic and duct tape. The tapes themselves are safe in the shoebox under the motel bed. The copies, and Tape 7, are gone.' },
          'Another voicemail landed at 6:02 AM. Same unknown number. A payphone, you realise, from the clank as the receiver goes down. Harlow still has one, outside the Hollis Diner.',
          say('Unknown Caller', 'You\'re asking the right questions. Ask who sold his car two weeks after. Porch light\'s on.'),
          { if: 'c_voice', text: 'You stop dead on the sidewalk. *Porch light\'s on.* That\'s the sign-off from Tape 9. That\'s how Tessa ended every recording she ever made. Either somebody has listened to those tapes very carefully, or... You don\'t let yourself finish the thought.', else: 'Porch light\'s on. A strange way to end a message. You file it away.' },
          'You\'ve got one morning before the town closes ranks. Where do you spend it?',
        ],
        choices: [
          {
            text: 'Go on WHRL\'s morning call-in show',
            hint: 'Benny Kowalski invited you. The whole county listens.',
            art: '📻',
            outcome: ['WHRL broadcasts from a cinderblock building next to the feed store. Benny Kowalski meets you at the door with a coffee and a grin like a used-car salesman.'],
            next: 'radio',
          },
          {
            text: 'Visit St. Brigid\'s church',
            hint: 'Where she was last seen alive.',
            art: '⛪',
            outcome: ['St. Brigid\'s is cold and smells of candle wax and floor polish. The organ is practising something mournful. Your footsteps sound very loud.'],
            next: 'church',
          },
          {
            text: 'Drive out to Miller\'s Creek',
            hint: 'Where her bike was found.',
            art: '🌲',
            outcome: ['Two miles out of town, past the quarry turn-off, the road dips into woods so thick the morning goes green and dim. There\'s a white wooden cross at the creek bend. Someone is already standing at it.'],
            next: 'creek',
          },
        ],
      },

      radio: {
        title: 'Wednesday, 9:05 AM — WHRL 1340 AM',
        art: '📻🎙️',
        mood: 'office',
        scene: 'radio-studio',
        timer: 8,
        text: [
          'The ON AIR light glows red. Benny Kowalski talks at triple speed about the weather, the high-school football score and you, *Harlow\'s own podcast celebrity, back to stir the pot*.',
          say('Benny Kowalski', 'And we\'ve got a caller already! Line one, you\'re on with Harlow This Morning!'),
          say('Gordon Pike', 'Morning, Benny. Just wanted to ask our guest a question, on behalf of the town. How much do you get paid per download, kid? What\'s Tessa Rourke worth to you?'),
          'Benny\'s eyes go wide with delight. Somewhere in the county, four thousand people just turned their radios up. Dead air is ticking. **Answer him.**',
        ],
        timeout: {
          text: 'Dead air.',
          effect: mod(0, -1),
          outcome: [
            'You open your mouth and nothing comes out. Three seconds of dead air on live radio feels like a year.',
            'Benny cuts to a commercial for tractor tires. When you come back, Gordon has hung up, and the next five callers all want to know why you didn\'t answer the chief\'s question.',
          ],
          next: 'marian',
        },
        choices: [
          {
            text: 'Stay calm and ask listeners for help',
            hint: 'Make the town your partner, not your audience.',
            art: '🤝',
            set: ['c_car'],
            effect: mod(1, 1),
            outcome: [
              'You thank the chief for his service. Then you speak past him, to everyone listening: if you were on Linden Street on October 14th, 2005, if you saw any car at all, call in.',
              'The phones light up. Most are prayers and theories. Then an old man\'s voice.',
              say('Walt (caller)', 'Name\'s Walt, I had the body shop on Route 9. Two weeks after the girl went missing, the chief brought me his own car to detail before he sold it. Navy Crown Vic. Creek mud packed in all four wheel wells. I didn\'t think about it then. I been thinking about it twenty years.'),
              'Benny has stopped grinning.',
            ],
            next: 'marian',
          },
          {
            text: 'Ask him how she was walking and riding',
            hint: 'Put the flat tire on the air.',
            art: '🚲',
            if: (s) => s.has('c_bike') || s.has('c_slip'),
            set: ['c_slip'],
            effect: mod(1, 0),
            outcome: [
              'You ask the chief, politely, how Tessa\'s bike got to the creek if she was walking home that night.',
              say('Gordon Pike', 'She wasn\'t walking, she rode the damn... she rode it, everybody knows she rode it. I said walking because... you\'re twisting it.'),
              'A long silence on the line. Then a click. Benny stares at you over the mixing desk and mouths, *wow*. Four thousand people just heard the chief contradict himself.',
            ],
            next: 'marian',
          },
          {
            text: 'Tell the county Dale Rourke is innocent',
            hint: 'Somebody should have said it twenty years ago.',
            art: '📢',
            set: ['defended_dale'],
            effect: mod(0, -2),
            outcome: [
              'You lean into the microphone and say it plainly: Dale Rourke didn\'t do it, and this town has been punishing an innocent man for twenty years.',
              'The switchboard explodes. Caller after caller, furious. Gordon doesn\'t even need to speak again. Benny cuts the segment short.',
              'In the parking lot, someone has written *GO HOME VULTURE* in the dust on your car. Somewhere across town, you suspect, Dale Rourke heard every word, and maybe cried.',
            ],
            next: 'marian',
          },
        ],
      },

      church: {
        title: 'Wednesday, 9:30 AM — St. Brigid\'s',
        art: '⛪🕯️',
        mood: 'candle',
        scene: 'church',
        text: [
          '**Father Okafor** is younger than you expected, with reading glasses pushed up into grey-flecked hair. He takes you up to the choir loft, where the old sign-out books are kept in a cupboard that sticks.',
          say('Father Okafor', 'I came in 2011. But people still talk about her up here. The girl who sang the descant louder than anyone and always had that little recorder in her pocket.'),
          'Down below, a few parishioners have stopped praying to watch you. Whatever you do here, the town will hear about it by lunch.',
        ],
        choices: [
          {
            text: 'Read the October 2005 choir sign-out book',
            hint: 'Who left when, and how.',
            art: '📖',
            set: ['c_bike'],
            effect: mod(1, 0),
            outcome: [
              'The choir director made every child sign out with how they were getting home. Friday, October 14th, 2005, in Tessa\'s loopy handwriting: *T. Rourke — 8:40 — WALKING (bike flat, ugh).*',
              'Below it, the director\'s initials, *M.V.* Marian Voss ran the choir. She knew Tessa was on foot. So did the police, if anyone had bothered to open this book. Nobody had: the page is still stuck to the next one.',
              'Somebody carried that bike to the creek.',
            ],
            next: 'marian',
          },
          {
            text: 'Ask the priest about Marian Voss',
            hint: 'She ran the choir. She was the witness.',
            art: '🙏',
            set: ['c_leverage'],
            effect: mod(1, 0),
            outcome: [
              'Father Okafor takes his glasses off and polishes them for a long time.',
              say('Father Okafor', 'I can\'t tell you what anyone has said to me in confession. But I can tell you what\'s public. Marian\'s son Danny was arrested that September with enough pills to put him away for years. Chief Pike made it all go away. That October, Marian stopped singing. She hasn\'t sung a note in twenty years.'),
              'He puts his glasses back on and looks at you very directly.',
              say('Father Okafor', 'Guilt is heavy, and Marian is very small.'),
            ],
            next: 'marian',
          },
          {
            text: 'Light a candle for Tessa first',
            hint: 'People are watching.',
            art: '🕯️',
            effect: mod(0, 2),
            outcome: [
              'You go down to the rack of candles and light one, and stand there long enough that it stops being for show.',
              'When you turn round, a woman in the back pew is crying. On your way out, two old men shake your hand. One of them says, *about time somebody remembered her as a girl and not a headline.*',
              'By lunch, half of Harlow will have heard that the podcast kid prayed for Tessa. That\'s worth more than a clue. You hope.',
            ],
            next: 'marian',
          },
        ],
      },

      creek: {
        title: 'Wednesday, 9:40 AM — Miller\'s Creek',
        art: '🌲✝️',
        mood: 'forest',
        scene: 'forest',
        text: [
          'The man at the cross is about your age, broad, with sawdust on his jacket. **Kyle Pike**: the chief\'s son. He runs Pike Hardware now. He sets down a bunch of grocery-store sunflowers, and you remember suddenly that sunflowers were Tessa\'s favourite.',
          'He hasn\'t seen you yet. The creek is loud. The bank down to the water is twenty feet of mud and roots, steep as a ladder.',
        ],
        choices: [
          {
            text: 'Walk over and introduce yourself',
            hint: 'Ask him how well he knew her.',
            art: '👋',
            set: ['c_kylelie'],
            effect: mod(0, 0, (s) => { if (s.has('c_kyle')) s.setVar('leads', clamp(s.get('leads') + 1)); }),
            outcome: [
              'He startles when you say his name, then shakes your hand too hard.',
              say('Kyle Pike', 'Tessa? Barely knew her. She was a couple years behind me. I just... it\'s a sad thing. Somebody should bring flowers.'),
              { if: 'c_kyle', text: 'You think of Tape 9. *K says when I\'m ready, he\'ll drive me to the station himself.* Kyle Pike is lying to your face, and he\'s bad at it.', else: 'Grocery-store sunflowers, on the right date, for a girl he barely knew. You don\'t believe a word of it.' },
            ],
            next: 'marian',
          },
          {
            text: 'Stay in the trees and watch',
            hint: 'People say things to the dead.',
            art: '👁️',
            set: ['c_kept'],
            effect: mod(1, 0),
            outcome: [
              'You stand very still among the birches. Kyle crouches by the cross and talks to it in a low voice, the way you\'d talk to someone in a hospital bed.',
              say('Kyle Pike', 'Twenty years, T. I still have it. I never played it. I kept my promise. I just don\'t know if keeping it was the right thing anymore.'),
              'He wipes his face with the back of his wrist and walks back to his truck: a white pickup. You wait until it has gone before you breathe.',
            ],
            next: 'marian',
          },
          {
            text: 'Climb down to where the bike was found',
            hint: 'Ignore him. Study the ground.',
            art: '🚲',
            set: ['c_bike'],
            effect: mod(1, 0),
            outcome: [
              'You go down the bank on your backside, grabbing roots. There\'s no path. There\'s no way a girl could ride a bike down here, or even push one without tumbling.',
              'Kyle watches from the top, frowning. The old case photos showed the bike lying neatly on the gravel bar, as if it had been *set* there, not thrown or crashed.',
              'Somebody climbed down with it. Somebody strong.',
            ],
            next: 'marian',
          },
        ],
      },

      marian: {
        title: 'Wednesday, 3:00 PM — 9 Linden Street',
        art: '🍪🫖',
        mood: 'candle',
        scene: 'house',
        text: [
          'Marian Voss\'s living room is all doilies, ticking clocks and photographs of her son Danny: Danny in a Little League cap, Danny at graduation, then a gap of years, then Danny at forty, thin and careful.',
          'She pours tea with both hands to stop the pot shaking.',
          say('Marian Voss', 'You\'re going to ask me about that night again. Everyone always does. And I always say the same thing.'),
          { if: 'c_leverage', text: 'You know about Danny. About the pills that disappeared. About the *deal*.' },
          { if: 'defended_dale', text: 'She heard you on the radio this morning. You can see it in the way she won\'t meet your eyes.' },
          'Her porch window looks straight out at the sodium lamp. Its orange light will come on in an hour. How do you play this?',
        ],
        choices: [
          {
            text: 'Ask what colour the truck was under that lamp',
            hint: 'Gently. Let the light speak for itself.',
            art: '💡',
            effect: mod(0, 0, (s) => {
              if (s.has('c_light')) { s.setVar('leads', clamp(s.get('leads') + 1)); if (s.get('trust') >= 3) s.set('c_recant'); }
            }),
            outcome: [
              { if: 'c_light',
                text: [
                  'You tell her about your rental car: bright blue, and under her lamp it looks like mud. You ask her, kindly, how she could see robin\'s-egg blue at night under a sodium light.',
                  'Her cup rattles in its saucer.',
                  s => (s.has('c_recant')
                    ? 'Then, quietly, it all comes out. She saw a dark car. A *sedan*, not a truck. She thought it looked like Gordon\'s own car, which made no sense, so she told him so. And Gordon told her what she\'d really seen. Blue. A pickup. And Danny\'s charges would stay gone.'
                    : 'She opens her mouth, and you can see the truth right behind her teeth. Then she looks at the window, at the street, at the whole watching town, and closes it again. *It was blue,* she whispers. *I\'ve always said it was blue.*'),
                ],
                else: 'She tells it exactly as she told it in 2005, word for word, robin\'s-egg blue. It\'s too smooth. It\'s a recording, not a memory. But you have nothing to snag it on.' },
            ],
            next: 'day3',
          },
          {
            text: 'Ask about Danny and the chief',
            hint: 'You know about the deal.',
            art: '👦',
            if: (s) => s.has('c_leverage') || s.get('trust') >= 3,
            set: ['c_recant'],
            effect: mod(1, 1),
            outcome: [
              'You don\'t accuse her. You just say Danny\'s name, and that you understand a mother doing anything at all to keep her son out of prison.',
              'Marian puts her face in her hands.',
              say('Marian Voss', 'It was a dark car. A big sedan. I thought it was Gordon\'s own car, and I said so, and he sat right where you\'re sitting and told me what I\'d really seen. A blue truck. Dale\'s truck. And Danny would be fine. Twenty years I\'ve let poor Dale carry it.'),
              'She grips your wrist with a strength that surprises you. *Will you tell them I\'m sorry? Before I go?*',
            ],
            next: 'day3',
          },
          {
            text: 'Tell her she lied and Dale paid for it',
            hint: 'Twenty years is long enough to be kind.',
            art: '⚡',
            set: ['marian_angry'],
            effect: mod(0, -2, (s) => { if (s.has('c_light') || s.has('c_leverage')) s.setVar('leads', clamp(s.get('leads') + 1)); }),
            outcome: [
              'You say it flat out. She lied, and a man\'s life was ruined.',
              'Marian stands up, all five feet of her, white with fury.',
              say('Marian Voss', 'Get out of my house. You don\'t know what he can do. You don\'t know anything.'),
              'Through the lace curtain you watch her pick up the phone before you\'ve even reached the sidewalk. You can guess who she\'s calling. By tonight, the whole street will know you bullied an eighty-one-year-old widow.',
            ],
            next: 'day3',
          },
        ],
      },

      // ------------------------------------------------------------------ DAY THREE
      day3: {
        title: 'Thursday, 11:00 AM — Your Car',
        art: '🚗📞',
        mood: 'fog',
        scene: 'street',
        text: [
          'The vigil is tomorrow night, the twentieth anniversary. The yellow ribbons are already going up on Linden Street\'s lampposts.',
          'You sit in your car outside the Hollis Diner with your notes app open and the heater roaring. Across the street the payphone hangs in its battered booth. Somebody has been calling you from there. You watched it for an hour this morning. Nobody came.',
          s => (s.get('trust') >= 3 ? 'People nod at you now. A waitress brought you a free coffee. Harlow is starting, cautiously, to think you might be on its side.' : (s.get('trust') <= 1 ? 'People cross the street to avoid you. A teenager filmed you on his phone and laughed. Harlow has decided what you are.' : 'Harlow hasn\'t made up its mind about you yet. You can feel it weighing you.')),
          'Two names keep circling in your notes, a father and a son. You have time to face one of them today.',
        ],
        choices: [
          {
            text: 'Pike Hardware: Kyle',
            hint: 'The son who "barely knew her".',
            art: '🔨',
            outcome: ['Pike Hardware smells of sawdust, fertiliser and WD-40. Kyle sees you come in, says something to the kid at the register, and jerks his head towards the stockroom.'],
            next: 'kyle',
          },
          {
            text: 'The chief\'s house: Gordon',
            hint: 'Go into the lion\'s den.',
            art: '🏠',
            outcome: ['Gordon Pike lives at the top of Ridge Road in a brick house with a flagpole and a view of the whole town. He opens the door before you knock, as if he\'s been expecting you since Tuesday.'],
            next: 'gordon',
          },
        ],
      },

      kyle: {
        title: 'Thursday, 11:30 AM — Pike Hardware Stockroom',
        art: '🔨📦',
        mood: 'office',
        scene: 'basement',
        text: [
          'Bare bulb, metal shelving, sacks of rock salt. Kyle shuts the door and leans on it with his arms folded. Up close he looks like he hasn\'t slept properly since 2005.',
          say('Kyle Pike', 'Dad says you\'re here to make money off a dead girl. Dad says a lot of things. So go on. Ask.'),
          { if: 'saw_truck', text: 'Through the back window you can see the store\'s white delivery pickup, *PIKE HARDWARE* on the door. The same truck that was in your motel lot at one in the morning.' },
          'Behind him, bolted to the floor under a workbench, there\'s a heavy old safe.',
        ],
        choices: [
          {
            text: 'Play him Tape 9',
            hint: '“K says he\'ll drive me to the station.”',
            art: '💌',
            if: 'c_kyle',
            effect: mod(1, 0),
            outcome: [
              'You put the old recorder on the workbench and press play. Tessa\'s sixteen-year-old voice fills the stockroom. *K says the city\'s only three hours on the bus.*',
              'Kyle slides down the door until he\'s sitting on the concrete. He listens to the whole thing, all the way to *Porch light\'s on. Over and out.* Then he gets up and spins the dial on the safe.',
            ],
            next: 'kyle_safe',
          },
          {
            text: '“I heard you at the creek. What did you keep?”',
            hint: 'He doesn\'t know you were there.',
            art: '🌲',
            if: 'c_kept',
            effect: mod(1, 0),
            outcome: [
              'You repeat his own words back to him. *Twenty years, T. I still have it. I never played it.*',
              'All the colour leaves his face. For a second you think he might hit you. Instead he laughs, a terrible, relieved little sound, like a man setting down something he\'s carried up a mountain.',
              say('Kyle Pike', 'Okay. Okay. Somebody had to find out eventually.'),
            ],
            next: 'kyle_safe',
          },
          {
            text: 'Ask him what his father is afraid of',
            hint: 'Son to son. See if he bites.',
            art: '👨‍👦',
            effect: mod(1, 0),
            outcome: [
              'You don\'t ask about Tessa. You ask about Gordon: why a retired man would spend his nights scaring off a podcaster.',
              s => (s.get('trust') >= 3
                ? 'Kyle looks at you for a long moment. He\'s heard what the town is saying about you this week, that you lit a candle, that you asked the right questions. *You\'re not what Dad says,* he says finally, and turns to the safe.'
                : 'Kyle\'s jaw works. His hands shake. *Ask him yourself,* he says. *I\'ve got a store to run.* He opens the door. Whatever is in that safe stays there.'),
            ],
            next: (s) => (s.get('trust') >= 3 ? 'kyle_safe' : 'quarry'),
          },
          {
            text: 'Threaten to name him as a suspect',
            hint: 'The secret boyfriend who lied to the police.',
            art: '🎙️',
            set: ['c_kylelie'],
            effect: mod(0, -1),
            outcome: [
              'You tell him the truth as you see it: he lied to the police in 2005 about knowing her, and on Monday two million people will hear that.',
              'Something in his face closes like a garage door.',
              say('Kyle Pike', 'Do what you have to do. You think you\'re the first person to want me to be the bad guy? Get out of my store.'),
              'The safe stays locked. On your way out, the kid at the register won\'t look at you.',
            ],
            next: 'quarry',
          },
        ],
      },

      kyle_safe: {
        title: 'Thursday, 11:50 AM — The Safe',
        art: '🔐📼',
        mood: 'candle',
        scene: 'basement',
        enter: { set: ['c_bus'] },
        text: [
          'Inside the safe, under the store\'s deeds and a pistol in a rag, is a ziplock bag. In the bag, a micro-cassette. On the label, in handwriting you know by now: *SIDE B — 10/14*.',
          say('Kyle Pike', 'She came to my window around midnight. Soaked. Mud to the knees, cut on her forehead. She said my dad picked her up on Linden, drove her out Quarry Road and wanted a tape she\'d made of him. She jumped out at mile marker four and ran into the woods. He thought she went in the creek.'),
          say('Kyle Pike', 'I drove her to the bus station in Carver City. Gave her four hundred dollars. She gave me this and said, if anything ever happens to me, play it. Nothing happened to her. So I never played it. And I let them blame Dale.'),
          'He holds the bag out to you. His hand is shaking.',
        ],
        choices: [
          {
            text: 'Play it, right now',
            hint: 'You have to know.',
            art: '▶️',
            set: ['c_sideb', 'played'],
            effect: mod(2, 0),
            outcome: [
              'Engine noise. A turn signal ticking. Then Tessa, very small: *I don\'t have any tape, Chief.*',
              say('Gordon Pike', 'Don\'t lie to me, girl. Ray says you were in that booth. Give me the tape and we forget it. Or Dale goes away for this, and everybody will believe it, because I\'ll say it.'),
              'A door handle. Wind. Running feet. A man shouting her name into the trees. The tape runs on for twenty more minutes of creek water and rain before it stops.',
              'Kyle is crying without making any sound at all.',
            ],
            next: 'quarry',
          },
          {
            text: 'Seal it, unplayed, for the state police',
            hint: 'Chain of custody. Make it count in court.',
            art: '🧾',
            set: ['c_sideb', 'custody'],
            effect: mod(1, 1),
            outcome: [
              'You don\'t touch it. You photograph the bag, the label, the safe, Kyle\'s face. You have him sign and date a note on store letterhead. Then you call the state police cold-case unit and leave a voicemail for a Detective Ana Ruiz.',
              'It\'s agony, not knowing what\'s on it. But you\'ve seen too many cases die in court because some hero couldn\'t wait.',
              'Kyle nods slowly. *She\'d like that,* he says. *She always wanted to be a real reporter.*',
            ],
            next: 'quarry',
          },
          {
            text: '“Kyle. Is she alive?”',
            hint: 'Ask the question nobody in Harlow has asked.',
            art: '❓',
            set: ['c_sideb', 'c_calls'],
            effect: mod(1, 0),
            outcome: [
              'He doesn\'t answer for a long time. He presses the bag into your hand and closes your fingers round it.',
              say('Kyle Pike', 'Every October 14th my phone rings at midnight. A different number every year. Nobody speaks. Just breathing, and then a click. I never know where from.'),
              say('Kyle Pike', 'Tomorrow\'s the fourteenth.'),
            ],
            next: 'quarry',
          },
        ],
      },

      gordon: {
        title: 'Thursday, 12:00 PM — The Chief\'s Den',
        art: '🏠🎖️',
        mood: 'gold',
        scene: 'library',
        text: [
          'Gordon\'s den is a museum of himself. Plaques. A mounted bass. Shelves of binders labelled by year. Framed photos: Gordon with a governor, Gordon at a ribbon-cutting at the quarry, Gordon leaning on a gleaming navy Crown Victoria, 2005 stamped in orange in the corner.',
          'He pours you coffee you don\'t drink and lowers himself into a leather recliner with a grunt and a cough.',
          say('Gordon Pike', 'You\'ve had your fun. Radio, church, bothering old women. Now you\'re in my house. So say what you came to say.'),
          'He hasn\'t asked you to stop recording. He doesn\'t think he needs to.',
        ],
        choices: [
          {
            text: 'Play him Tape 7',
            hint: 'His own voice. Quarry permits. Cash.',
            art: '📼',
            if: 'c_tape',
            set: ['c_threat', 'gordon_warned'],
            effect: mod(1, 0),
            outcome: [
              'You let his younger self speak. *Envelope\'s light again, Ray.* Gordon listens with no expression at all. When it ends, he leans forward.',
              say('Gordon Pike', 'That girl taped everything that was none of her business. Look where it got her.'),
              'He smiles. Your phone is still recording.',
              say('Gordon Pike', 'You be careful on these back roads at night, now. They\'re awful dark. Awful steep.'),
            ],
            next: 'quarry',
          },
          {
            text: 'Ask about the navy Crown Vic in the photo',
            hint: 'Who sold his car two weeks after?',
            art: '🚓',
            set: ['c_car', 'gordon_warned'],
            effect: mod(1, 0),
            outcome: [
              'You nod at the photo. Navy blue. Big sedan. You ask when he sold it.',
              say('Gordon Pike', 'Fall of \'05. Old cars rust.'),
              'He says it too fast. Then he follows your eyes to the photo, gets up, and turns the frame face-down on the shelf with one heavy finger. It\'s the first thing he\'s done all week that looks like fear.',
              { if: 'c_recant', text: 'A dark sedan, Marian said. She thought it looked like Gordon\'s own car. Now you\'re sitting in his den looking at it.' },
            ],
            next: 'quarry',
          },
          {
            text: 'Ask how a girl with a flat tire rode to the creek',
            hint: 'Watch him try to fit it together.',
            art: '🚲',
            if: 'c_bike',
            set: ['c_slip', 'gordon_warned'],
            effect: mod(1, 0),
            outcome: [
              'You tell him about the flat tire. The sign-out book, or the tape, whichever. You ask him how her bike got two miles out of town.',
              say('Gordon Pike', 'She walked that road every night with that damned recorder in her...'),
              'He stops. He knows what he\'s just said. *Walked.* You let the silence sit. Then he waves a hand, and the folksy chief comes back like a mask.',
              say('Gordon Pike', 'Stepdaddy drove the bike out there. Obviously. You\'re not as smart as you think.'),
            ],
            next: 'quarry',
          },
          {
            text: 'Ask for his help, investigator to investigator',
            hint: 'Flattery. Let him play the hero.',
            art: '🤝',
            set: ['c_light'],
            effect: mod(0, 1),
            outcome: [
              'You tell him nobody knows this case like he does. He likes that. He actually pulls the 2005 binder down from the shelf and walks you through it, page by page.',
              'He lingers on Marian\'s statement, typed and signed. But at the bottom of the carbon copy you can see a pencil note in a different hand, half erased: *dark car? sedan?* Over it, typed, *blue pickup*.',
              'He snaps the binder shut. Word will get round that the chief shook your hand on his own porch. That\'s worth something in Harlow. So is what you just saw.',
            ],
            next: 'quarry',
          },
        ],
      },

      // ------------------------------------------------------------------ THE QUARRY ROAD
      quarry: {
        title: 'Thursday, 11:20 PM — Quarry Road',
        art: '🚗💡',
        mood: 'night',
        scene: 'forest',
        fx: 'shake',
        timer: 7,
        text: [
          'At 10:58 PM, one more voicemail from the payphone.',
          say('Unknown Caller', 'Quarry Road. Mile marker four. That\'s where I got out of his car. Porch light\'s on.'),
          'So you\'re out here, alone, on a two-lane road through black woods, counting the little green markers in your headlights. Three. Three and a half.',
          { if: 'gordon_warned', text: 'You think about Gordon\'s voice. *Awful dark. Awful steep.*' },
          { if: 'marian_angry', text: 'You think about Marian picking up her phone the second you left.' },
          'Then your mirror fills with light. High beams, right on your bumper, and an engine roaring. The truck behind you swings out, comes alongside, and **slams into your door**. Your wheels hit gravel. On your right, the guardrail, and beyond it the long drop to the creek.',
        ],
        timeout: {
          text: 'You froze.',
          fx: 'redflash',
          outcome: [
            'Your hands lock on the wheel. The truck hits you again, harder, and the guardrail is suddenly not there anymore.',
            'Then there is a long, slow, weightless moment full of leaves and headlights, and the sound of water.',
          ],
          next: 'end_quarry',
        },
        choices: [
          {
            text: 'Floor it towards town',
            hint: 'Outrun him. Your car is newer than his.',
            art: '💨',
            outcome: [
              'You stamp on the gas. Your rental leaps forward, mirror scraping, and you take the next bend on two prayers and a squeal.',
              'The high beams fall back, then vanish. You don\'t stop until you\'re under the orange lights of Linden Street, shaking so hard you can\'t get your seatbelt off.',
              'You never saw the driver. But you\'re alive, and the vigil is tomorrow.',
            ],
            next: 'accuse',
          },
          {
            text: 'Kill your lights and swerve onto the logging track',
            hint: 'Vanish into the dark.',
            art: '🌑',
            set: ['saw_truck'],
            effect: mod(1, 0),
            outcome: [
              'You flick off your headlights and haul the wheel left onto a rutted logging track. Branches whip the windows. You stop, engine off, in total darkness.',
              'The truck thunders past on the road. In its own lights, for one second, you read the door: *PIKE HARDWARE*.',
              'When it\'s gone, you walk back to the road with your phone torch. Mile marker four. Below it, the bank drops into the trees: a terrified girl could have scrambled down there in the dark, and lived. You stand there a long time.',
            ],
            next: 'accuse',
          },
          {
            text: 'Hold up your phone and film the driver',
            hint: 'Get his face. Whatever it costs.',
            art: '📱',
            set: ['c_threat'],
            effect: mod(1, 0),
            outcome: [
              'You hold the wheel with one hand and jam your phone against the side window with the other, flash on, recording.',
              'The truck\'s dash lights show you everything for half a second: white hair, a heavy jaw, a moustache, a face you saw in a diner booth on Tuesday. Gordon Pike, seventy-six years old, trying to put you in the creek.',
              'Headlights appear round the bend ahead: a logging truck, horn blaring. The pickup brakes, drops back and is gone. Your door is crumpled. Your video is perfect.',
            ],
            next: 'accuse',
          },
        ],
      },

      // ------------------------------------------------------------------ THE VIGIL
      accuse: {
        title: 'Friday, October 14th, 8:50 PM — The Vigil',
        art: '🕯️🏘️',
        mood: 'candle',
        scene: 'street',
        text: [
          'Twenty years to the minute. Linden Street is full of candles: a river of small trembling lights under the orange lamps, three hundred people, news vans from two cities.',
          'They are all here. Dale Rourke at the edge of the crowd, alone, as always. Marian Voss in a wheelchair on her own porch. Kyle Pike by the hardware-store van. And in the front row, hat in hand, Gordon Pike, the town\'s grieving protector.',
          'A woman in a state-police windbreaker finds you: **Detective Ana Ruiz**, cold-case unit. Your podcast is why she\'s here.',
          say('Detective Ruiz', 'They\'ve given you the microphone, and I\'ve given you my attention. You get one shot at this. Who and how?'),
          notebook,
          s => (s.get('trust') >= 3 ? 'The crowd goes quiet when you step up. They\'re ready to listen.' : (s.get('trust') <= 1 ? 'Someone in the crowd boos when you step up. Then a few more.' : 'The crowd shifts and murmurs. They\'ll hear you out. Just.')),
        ],
        choices: [
          {
            text: 'Gordon Pike',
            hint: 'The chief. In the front row.',
            art: '🎖️',
            outcome: [
              'You say his name into the microphone, and three hundred candles seem to flinch at once.',
              say('Gordon Pike', 'Me? I searched those woods for a month. I carried that girl\'s picture in my wallet for twenty years.'),
              say('Detective Ruiz', 'Then this should be easy to clear up. Go on. Show me.'),
            ],
            next: 'case',
          },
          {
            text: 'Dale Rourke',
            hint: 'The stepfather. The town was right all along?',
            art: '🛻',
            set: ['acc_dale'],
            outcome: [
              'You turn towards the edge of the crowd. Dale Rourke doesn\'t move. He just closes his eyes, like a man hearing a sentence he\'s heard every day for twenty years.',
              'The crowd breathes out. It\'s the story Harlow already knows. Somebody starts to clap.',
            ],
            next: 'end_wrong',
          },
          {
            text: 'Marian Voss',
            hint: 'The witness whose story never changed.',
            art: '🪑',
            set: ['acc_marian'],
            outcome: [
              'You point to the porch of number 9. Marian Voss grips the arms of her wheelchair. A shocked murmur ripples down Linden Street: *the choir lady? Are they insane?*',
              'In the front row, Gordon Pike shakes his head slowly and sadly, like a man watching a car crash.',
            ],
            next: 'end_wrong',
          },
          {
            text: 'Someone else...',
            hint: 'The one nobody is looking at.',
            art: '❓',
            outcome: ['You let your eyes move past the obvious faces, out to the edges of the candlelight.'],
            next: 'accuse_other',
          },
        ],
      },

      accuse_other: {
        title: 'Friday, 8:54 PM — The Vigil',
        art: '🕯️👁️',
        mood: 'candle',
        scene: 'street',
        text: [
          'The son, who lied about knowing her. A stranger passing through, the explanation that hurts nobody.',
          s => (secretReady(s)
            ? 'And a third thing, so impossible you\'ve barely let yourself think it. *Porch light\'s on.* It is midnight in four hours, on October 14th. Somewhere in this crowd, perhaps, someone is about to make a phone call.'
            : 'Ruiz checks her watch.'),
        ],
        choices: [
          {
            text: 'Kyle Pike',
            hint: 'The secret boyfriend with a safe.',
            art: '🔨',
            outcome: [
              'You turn to Kyle. He doesn\'t run. He walks up to the microphone himself, past three hundred staring faces, and takes it out of your hand.',
            ],
            next: 'end_collect',
          },
          {
            text: 'A drifter. Someone passing through.',
            hint: 'The answer nobody in Harlow has to live with.',
            art: '🚶',
            set: ['acc_stranger'],
            outcome: [
              'You tell them it was probably a stranger, a man on the highway, someone who\'ll never be found. You watch the relief go through the crowd like warm water.',
              'Ruiz looks at you as if you\'ve just disappointed her personally.',
            ],
            next: 'end_wrong',
          },
          {
            text: 'Nobody. Tessa Rourke is alive.',
            hint: 'Say it. Then say the words she taught you.',
            art: '💡',
            if: secretReady,
            fx: 'flash',
            outcome: [
              'You lift the microphone and say, very clearly, *Nobody killed Tessa Rourke.* The street goes so quiet you can hear the candle flames.',
              'Then you say it the way she taught you when you were twelve: *This is the kid from number 14. Porch light\'s on.*',
              'At the back of the crowd, by the payphone outside the Hollis Diner, a woman in a grey coat lowers her hood.',
            ],
            next: 'end_secret',
          },
        ],
      },

      case: {
        title: 'Friday, 8:56 PM — The Vigil',
        art: '⚖️🕯️',
        mood: 'candle',
        scene: 'street',
        text: [
          'Ruiz folds her arms. Gordon stands with his hat over his heart. Three hundred people are waiting to see whether you can back it up.',
          { if: 'c_sideb', text: 'The ziplock bag with Side B is in your coat pocket. It weighs nothing. It weighs everything.' },
          { if: 'c_recant', text: 'On her porch, Marian Voss is looking straight at you, white-knuckled.' },
          'You need one thing to make them believe it. What do you put in front of them?',
        ],
        choices: [
          {
            text: 'Play Side B through the PA',
            hint: 'Tessa\'s own recording, from inside his car.',
            art: '📼',
            if: 'c_sideb',
            set: ['case_tape'],
            outcome: [
              'You hold the old recorder against the microphone and press play. The turn signal ticks out over Linden Street. Then Tessa\'s voice, sixteen and terrified, and then a voice everyone here knows.',
              '*Give me the tape and we forget it. Or Dale goes away, and everybody will believe it, because I\'ll say it.*',
              'Three hundred people turn, slowly, to look at the front row.',
            ],
            next: 'finale',
          },
          {
            text: 'Call Marian Voss to the microphone',
            hint: 'The witness who started it all.',
            art: '🪑',
            effect: (s) => { if (s.has('c_recant')) s.set('case_recant'); else s.setVar('trust', clamp(s.get('trust') - 1)); },
            outcome: [
              'You ask Marian to tell them what she saw. Danny wheels her down the ramp of number 9 and through the candles.',
              s => (s.has('c_recant')
                ? 'She takes the microphone in both shaking hands. *It was a dark car. Gordon\'s kind of car. And Gordon told me to say it was a blue truck. Dale, I\'m so sorry.* Across the crowd, Dale Rourke puts his hand over his mouth.'
                : 'She takes the microphone, looks at Gordon in the front row, and says it again, word for word, twenty years smooth: *a blue pickup, blue as a robin\'s egg.* The crowd mutters. You\'ve just handed the chief his best witness on live TV.'),
            ],
            next: 'finale',
          },
          {
            text: 'Lay out the whole chain, piece by piece',
            hint: 'The bike, the light, the car. Let the details add up.',
            art: '🧩',
            set: ['case_circ'],
            outcome: [
              'You go through it slowly, the way you would on the podcast: one fact, then the next, building the wall a brick at a time.',
              s => (proof(s) >= 4
                ? 'By the time you finish, nobody is holding their candle up anymore. They\'re all looking at Gordon.'
                : 'It sounds good. It sounds like an episode. But you can see Ruiz counting the gaps, and so can Gordon.'),
            ],
            next: 'finale',
          },
        ],
      },

      finale: {
        redirect: (s) => {
          if (strongCase(s) && proof(s) >= 5 && s.get('trust') >= 2) return 'end_true';
          if (strongCase(s) || (s.has('case_circ') && proof(s) >= 4)) return 'end_good';
          return 'end_pulled';
        },
      },

      // ------------------------------------------------------------------ ENDINGS
      end_true: {
        art: '📼⚖️',
        mood: 'dawn',
        scene: 'street',
        ending: { id: 'side-b', title: 'Side B', type: 'true' },
        text: [
          'Ruiz doesn\'t wait for the crowd to decide. She walks to the front row and asks Gordon Pike to come with her, and the old chief looks round at three hundred faces for someone to tell her she\'s wrong. Nobody does.',
          s => `In the interview room, Ruiz lays your case on the table: ${gordonList(s)}.`,
          { if: 'custody', text: 'Side B, sealed and unplayed until the lab opened it, is ruled admissible in a single afternoon. Your patience is the reason he can\'t wriggle.' },
          'Gordon Pike is charged with kidnapping, obstruction and tampering with evidence. The quarry bribes follow. At seventy-six, he will die in a state facility, still saying he did it all for Harlow.',
          { if: 'met_dale', text: 'Dale Rourke calls you on Sunday. He doesn\'t say anything for a full minute. Then: *thank you, kid*, and he hangs up before you can hear him cry.', else: 'Dale Rourke sends a single line by email: *Ruth would have liked you.*' },
          'The final episode of *The Long Quiet* hits number one in eleven countries. You end it the way she used to end hers.',
          'At 12:00 AM on October 15th, your phone rings. Unknown number. Nobody speaks. Just breathing, and then a small, tired laugh, and a click.',
        ],
      },

      end_good: {
        art: '⚖️🕯️',
        mood: 'candle',
        scene: 'street',
        ending: { id: 'obstruction', title: 'Obstruction of Justice', type: 'good' },
        text: [
          'It isn\'t perfect. But it\'s enough to make Ruiz take the old chief by the elbow and walk him to her car while the news cameras swing round to follow.',
          s => `You give her everything you have: ${gordonList(s)}.`,
          { if: 'marian_angry', text: 'Marian Voss won\'t testify; she says you bullied her and she\'s sticking to her story. It costs the prosecution a charge.' },
          'Gordon Pike is charged with obstruction and evidence tampering. The kidnapping charge is dropped for lack of a body or a witness. He gets four years and a plea deal, and half the town still sends him Christmas cards.',
          'But Dale Rourke is finally, officially, cleared. On Saturday morning somebody scrubs *KILLER* off his garage door, and nobody admits who.',
          'You never find out what happened to Tessa after Quarry Road. Some nights you think of the payphone outside the Hollis Diner, and the voice that said *porch light\'s on*, and you wonder.',
        ],
      },

      end_pulled: {
        art: '🎙️🚫',
        mood: 'office',
        scene: 'radio-studio',
        ending: { id: 'episode-pulled', title: 'Episode Pulled', type: 'neutral' },
        text: [
          'You\'re right. You know you\'re right. But you can see it in Ruiz\'s face before she even speaks: you\'ve brought a story, not a case.',
          s => (proof(s) > 0 ? `You have ${gordonList(s)}. Laid out on a folding table under the streetlights, it looks thinner than it did in your notes.` : 'You have a feeling, a flat tire, and a town full of people who have already decided.'),
          { if: 'marian_angry', text: 'Marian Voss tells the news cameras how you shouted at her in her own home.' },
          say('Detective Ruiz', 'I can\'t arrest a retired police chief on a podcast episode. Bring me something I can put in front of a judge.'),
          'Gordon Pike\'s lawyer files a defamation suit on Monday. Your network pulls the final episode on Tuesday. On Wednesday you drive out of Harlow under the orange lamps of Linden Street, and every porch light on the street is off.',
          { if: 'c_sideb', text: 'Side B sits in your glovebox all the way home. You could have put it in front of them. You still don\'t know why you didn\'t.' },
        ],
      },

      end_wrong: {
        art: '🕯️⛓️',
        mood: 'storm',
        scene: 'street',
        fx: 'shake',
        ending: { id: 'wrong-house', title: 'The Wrong House', type: 'bad' },
        text: [
          { if: 'acc_dale', text: 'The applause builds. Harlow has waited twenty years for someone famous to say it. Dale Rourke walks home through the parting crowd without a word, and the next morning his blue pickup is gone from the driveway, and so is he. A cousin in Ohio says he left a note that just said *I\'m tired.*' },
          { if: 'acc_marian', text: 'Marian Voss is taken to hospital that night with chest pains. The town never forgives you. She dies in February, and the truth about the dark car dies with her.' },
          { if: 'acc_stranger', text: 'The crowd goes home relieved. The case goes back in its box. Ruiz drives back to the city without saying goodbye.' },
          'In the front row, Gordon Pike puts his hat back on and pats your shoulder on his way past, like a man who owns it.',
          say('Gordon Pike', 'Good episode, kid. Drive safe.'),
          s => (proof(s) >= 3 ? `It was all in your notes: ${gordonList(s)}. You looked right at it, and said the wrong name.` : 'The answer was on Linden Street the whole time, under an orange light that turned everything the wrong colour.'),
          'At midnight your phone buzzes. Voicemail. Unknown number. You listen to it in the motel parking lot: forty seconds of silence, then a click. No sign-off this time.',
        ],
      },

      end_collect: {
        art: '📞🚌',
        mood: 'night',
        scene: 'street',
        fx: 'glitch',
        ending: { id: 'collect-call', title: 'Collect Call', type: 'neutral' },
        text: [
          say('Kyle Pike', 'I didn\'t hurt her. I put her on a bus. October 14th, 2005, 1:40 AM, Carver City. She was soaking wet and she was terrified, and she wasn\'t running from Dale.'),
          'He turns and looks straight at his father in the front row.',
          { if: 'c_sideb', text: 'You still have Side B in your coat pocket. You realise, too late, that you just let the wrong Pike speak first.' },
          'It should be the twist that breaks the case open. Instead it breaks the town. Half of Harlow calls Kyle a liar protecting himself. The other half calls you a vulture who tore a family apart on live TV. Gordon says nothing at all; he just puts a hand on his son\'s shoulder for the cameras, and Kyle flinches.',
          'Ruiz opens a missing-persons search for a woman who would be thirty-six, under a name nobody knows. It goes nowhere.',
          'At midnight, Kyle\'s phone rings. A different number, like every year. He lets it ring and ring. When he finally answers, there\'s only breathing, and then a click, and you understand that she heard the news, and she isn\'t coming home now.',
        ],
      },

      end_quarry: {
        art: '🌊🚗',
        mood: 'storm',
        scene: 'forest',
        weather: 'rain',
        ending: { id: 'mile-marker-four', title: 'Mile Marker Four', type: 'bad' },
        text: [
          'You wake up in Harlow Memorial with a broken collarbone and a nurse telling you how lucky you are. Your car went down the bank at mile marker four and stopped against a tree, ten feet from the creek.',
          'The state police call it a single-vehicle accident. Wet leaves. An out-of-towner on a bad road at night.',
          'When they bring your things from the wreck, the shoebox of tapes isn\'t among them. Neither is your phone.',
          { if: 'c_sideb', text: 'Neither is Side B. Kyle Pike visits once, stands at the foot of your bed, and can\'t say anything at all.' },
          'On the second day, Gordon Pike brings you flowers. Grocery-store sunflowers. He sits by your bed for a while and talks about the weather.',
          say('Gordon Pike', 'Told you. Awful dark out there.'),
          'The vigil happens without you. The twentieth anniversary comes and goes, and the case of Tessa Rourke stays exactly as quiet as it has always been.',
        ],
      },

      end_secret: {
        art: '💡🏠',
        mood: 'dawn',
        scene: 'street',
        fx: 'flash',
        ending: { id: 'porch-light', title: 'Porch Light\'s On', type: 'secret' },
        text: [
          'She walks through the candles, and the crowd parts without knowing why. Thirty-six. A scar through one eyebrow. The same way of tilting her head as if she\'s about to tell you a secret.',
          'Dale Rourke sees her first. He makes a sound you will never forget, and then he is holding her, and she is holding him.',
          say('Tessa', 'Hi, Dale. I\'m sorry. He said he\'d put you away if I ever came back. I believed him. I was sixteen.'),
          'Then she turns, takes the microphone from your hand, and looks straight at the front row.',
          say('Tessa', 'Hello, Chief. I kept the tape.'),
          'Gordon Pike tries to leave. Three hundred people and one state detective don\'t let him.',
          { if: 'c_sideb', text: 'You give Side B to Ruiz in front of everyone. Tessa puts her hand over yours as you do it.' },
          s => (proof(s) >= 3 ? `Ruiz has more than she needs: Tessa herself, and ${gordonList(s)}.` : 'Ruiz has the best witness any detective could ask for: the victim, alive.'),
          'Much later, in Dale\'s kitchen, with Tessa\'s old room still exactly as she left it, she asks you if you still talk into recorders. You put your phone on the table between you and press the red button.',
          say('Tessa', 'This is T. I\'m home. Porch light\'s on.'),
        ],
      },
    },
  });
})();
