/* MysteryFate story: The Wreck of the Merrow (adventure) */
(function () {
  'use strict';

  // Crew Loyalty meter: add n and clamp to 0..5.
  const L = (n) => (s) => s.setVar('loyalty', Math.max(0, Math.min(5, s.get('loyalty') + n)));
  const both = (...fns) => (s) => fns.forEach((f) => f(s));
  // side: 1 = Crowe, 2 = Bess, 3 = playing both.
  const swearBess = (s) => s.setVar('side', s.get('side') === 1 || s.get('side') === 3 ? 3 : 2);
  const knows = (s) => s.count('clue_body', 'clue_vial', 'clue_pim') >= 2;
  // Secret: kept the brass key, worked out the sleeping draught, never opened the chest early.
  const secretReady = (s) => s.has('key') && knows(s) && !s.has('opened');
  const loyal = (n) => (s) => s.get('loyalty') >= n;

  registerStory({
    id: 'adventure-merrow',
    title: 'The Wreck of the Merrow',
    category: 'adventure',
    tagline: 'The captain died at supper. The mutiny comes at dawn. You hold the key.',
    description:
      'You are the cabin hand on the pirate ship Merrow. Captain Isolde Vane fell face-first into her stew tonight, and by dawn the first mate means to take her ship. Around your neck hangs the brass key to her chart chest — and every blade aboard wants it.',
    cover: '🏴‍☠️',
    accent: '#2a9d8f',
    ambient: 'adventure',
    warning: 'Contains: swordplay, drowning, hanging, pirate language (mild).',
    vars: { loyalty: 2, side: 0 },
    flags: ['key'],
    hud: [{ var: 'loyalty', label: 'Crew Loyalty', icon: '⚓', max: 5 }],
    scene: 'ship-deck',
    voices: {
      narrator: { gender: 'female', pitch: 0.95, rate: 0.98, accent: 'en-GB', note: 'warm tavern storyteller, a twinkle in the eye' },
      'Silas Crowe': { gender: 'male', pitch: 0.85, rate: 0.9, accent: 'en-GB', note: 'first mate, silver-tongued, every word buttered' },
      'Bess': { gender: 'female', pitch: 1.0, rate: 1.12, accent: 'en-IE', note: 'quartermaster, blunt as a belaying pin' },
      'Old Pim': { gender: 'male', pitch: 0.7, rate: 0.82, accent: 'en-AU', note: 'blind navigator, slow, riddling, kind' },
      'Doc Lark': { gender: 'male', pitch: 1.35, rate: 1.3, accent: 'en-US', note: 'ship’s surgeon, jittery, talks too fast' },
      'Captain Vane': { gender: 'female', pitch: 0.8, rate: 0.85, accent: 'en-GB', note: 'the captain, low, regal, dry as powder' },
      'Lieutenant Ashby': { gender: 'male', pitch: 1.1, rate: 1.0, accent: 'en-US', note: 'navy officer, crisp, self-satisfied' },
      'The Crew': { gender: 'neutral', pitch: 0.9, rate: 1.1, note: 'many rough voices at once' },
      'You': { gender: 'neutral', pitch: 1, rate: 1 },
    },
    start: 'intro',
    scenes: {
      // ------------------------------------------------------------ THE NIGHT
      intro: {
        title: 'Eight Bells — The Galley',
        art: '🍲💀',
        mood: 'candle',
        scene: 'ship-hold',
        text: [
          'Captain Isolde Vane took one spoonful of the fish stew, said *“That’s not right,”* and fell face-first into the bowl.',
          'That was two hours ago. Now the galley of the *Merrow* is empty but for you, a guttering lantern, and the stew, which nobody has had the heart to throw over the side.',
          'Around your neck, on a greasy bit of cord, hangs a brass key no longer than your thumb. The captain hung it there herself this morning. *“Keep it till I ask for it back, sprat. Nobody else. Not even me if I’m acting strange.”*',
          'It opens her chart chest. Everybody aboard knows it. And everybody aboard knows something else, too: the first mate, Silas Crowe, has been sharpening his smile all week. The whisper in the hammocks is that he takes the ship **at dawn**.',
          'Somewhere above, the bell strikes. You have until sunrise. You’d best use it.',
        ],
        choices: [
          {
            text: 'Slip into the captain’s cabin to see her.',
            hint: 'Pay your respects. Look closely while you do.',
            art: '🕯️',
            outcome: [
              'You go aft on bare feet, past the snoring gun crews, and ease open the door of the great cabin.',
              'They have laid her out on her own chart table, still in her blue coat, a lantern at her head and two silver coins on her eyes. The room smells of tar, candle wax and something sweet you can’t name.',
            ],
            next: 'cabin',
          },
          {
            text: 'Find Doc Lark in the sick bay.',
            hint: 'He pronounced her dead. He mixed her medicine. He’s been drinking ever since.',
            art: '⚗️',
            outcome: [
              'You follow the sound of clinking glass down to the orlop deck, where the sick bay is wedged between the cable tier and the rats.',
              'Doc Lark is sitting on his own operating table with a bottle in each hand, as if he can’t decide which one to have a conversation with.',
            ],
            next: 'sickbay',
          },
          {
            text: 'Climb up to Old Pim at the wheel.',
            hint: 'Blind as a boot. Sees more than anyone aboard.',
            art: '🧭',
            outcome: [
              'You climb into a sky full of stars. The *Merrow* is slipping along under topsails, quiet as a cat, and at the wheel stands Old Pim, white eyes turned up to heaven, steering by the feel of the wind on his cheek.',
              'He doesn’t turn his head. He never does.',
              { speaker: 'Old Pim', say: 'Light feet, nervous breathing, smells of the galley. Evening, sprat. Come to ask an old man who killed the captain?' },
            ],
            next: 'wheel',
          },
        ],
      },

      cabin: {
        title: 'Eight Bells — The Great Cabin',
        art: '⚰️🗺️',
        mood: 'candle',
        scene: 'ship-hold',
        text: [
          'Captain Vane looks smaller dead. That’s the first thing. She used to fill a room the way a broadside fills a harbour.',
          'Her cutlass hangs on its peg. Her desk is a landslide of charts, letters and half-eaten ship’s biscuit. And against the bulkhead, bolted to the deck, sits the chart chest: black oak, iron straps, and a brass lock the exact shape of the key around your neck.',
          'Something on the desk catches the lantern light: a corner of paper, burnt black at the edges, shoved under the inkwell like someone tried to destroy it and was interrupted.',
          'Outside the door, boots stop. Start again. Somebody is pacing the passage, waiting for you to leave.',
        ],
        choices: [
          {
            text: 'Take her hand. Say goodbye properly.',
            hint: 'She gave you a berth when nobody else would.',
            set: ['clue_body'],
            art: '🤚',
            outcome: [
              'You lift her hand from her chest. It is cold — cold as a fish on the slab — but it is not stiff. The fingers curl softly round yours, loose as a sleeping child’s.',
              'You have seen men dead two hours before. By now they’re hard as planks. You stand there a long moment with the captain’s soft, cold hand in yours, and a thought crawls up your spine and sits at the top of it.',
              'Her lips smell faintly sweet. Like honey. Like the bottom of a medicine cup.',
            ],
            next: 'crowe_corner',
          },
          {
            text: 'Grab the burnt letter off the desk.',
            hint: 'Somebody wanted it gone. That makes you want it more.',
            set: ['proof'],
            art: '📜',
            outcome: [
              'You tug it out from under the inkwell. Half of it is ash. The half that isn’t is in a hand you know — all loops and flourishes, like a man signing his name on a lady’s fan.',
              '*“…the Doctor will see to the old witch at supper. Twenty guineas, as agreed. The chest is mine by dawn, and with it the Crown’s little gift. Your servant, S. C.”*',
              'Silas Crowe. You fold it small and push it down your boot. The pacing outside the door has stopped.',
            ],
            next: 'crowe_corner',
          },
          {
            text: 'Put a coin of your own beside hers and make a vow.',
            hint: 'Out loud. Let whoever’s listening hear it.',
            effect: L(1),
            art: '🪙',
            outcome: [
              'You add your one copper penny to the silver on her eyes and say it out loud, loud enough to carry through the door:',
              { speaker: 'You', say: 'Whoever did this to you, Captain, I’ll see them swing for it. That’s a promise.' },
              'The pacing stops. Then, from further down the passage, a gruff voice you don’t know mutters, *“Aye. Me too.”* By the middle watch, half the forecastle has heard that the cabin hand swore an oath over the captain’s body. Sailors love an oath.',
            ],
            next: 'crowe_corner',
          },
        ],
      },

      sickbay: {
        title: 'Eight Bells — The Sick Bay',
        art: '🍾🩺',
        mood: 'candle',
        scene: 'ship-hold',
        text: [
          'Doc Lark is a thin, twitchy man with spectacles mended with sail twine and the hands of a pianist who has been shot at. He jumps a foot when you come in.',
          { speaker: 'Doc Lark', say: 'Oh! Oh, it’s you. The boy. The girl. The — the cabin person. Good. Fine. Nobody here. Nothing to see. Just a man and his grief and his… second bottle.' },
          'Behind him, on the medicine shelf, every jar is neatly labelled and lined up like soldiers. Except one gap, right in the middle, where a jar should be.',
          'His left hand keeps creeping to the pocket of his apron, patting it, as though checking something is still there.',
        ],
        choices: [
          {
            text: 'Snatch whatever’s in his apron pocket.',
            hint: 'Quick hands. You’ve picked better pockets than his.',
            set: ['clue_vial'],
            art: '🧪',
            outcome: [
              'You lunge, he squeaks, and you come up holding a little blue glass vial, three-quarters empty. The label is in Lark’s tiny careful hand:',
              '**TINCTURE OF POPPY & VALERIAN. “THE LONG SLEEP.” ONE DROP: A NIGHT. TEN DROPS: TWO DAYS. DO NOT GIVE TO THE CAPTAIN WITHOUT HER SAY-SO.**',
              'The last line is underlined twice. Doc Lark makes a noise like a kettle and puts his face in his hands.',
              { speaker: 'Doc Lark', say: 'I didn’t — it isn’t — please don’t tell Crowe you’ve got that. Please. He thinks it was the other bottle.' },
            ],
            next: 'crowe_corner',
          },
          {
            text: 'Pour him another drink and just listen.',
            hint: 'Drunk men confess. It’s practically a law of the sea.',
            set: ['proof'],
            art: '🥃',
            outcome: [
              'You fill his cup. He drains it. You fill it again. Somewhere around the third cup it all comes out in a wet, hiccupping rush.',
              { speaker: 'Doc Lark', say: 'Crowe paid me. Twenty guineas. Said, Lark, the old witch needs a little something in her stew. And I took it! God help me, I took his money — here, look, I wrote him a receipt, I always write receipts — '},
              'He presses a crumpled scrap into your hand. *Recd. of Mr S. Crowe, twenty gns, for services to the Captain’s supper.* Signed by both of them. Of all the idiots on all the seas, you have found the only poisoner who keeps paperwork.',
              'He’s asleep before you can ask him why he’s grinning in his sleep.',
            ],
            next: 'crowe_corner',
          },
          {
            text: 'Grab his collar and shove him against the shelves.',
            hint: 'No time for sweet talk. Dawn is coming.',
            set: ['clue_vial', 'proof'],
            effect: L(-1),
            fx: 'shake',
            art: '😠',
            outcome: [
              'Jars rattle. Doc Lark’s spectacles go sideways. He tells you everything at once, at roughly the speed of a falling anchor.',
              { speaker: 'Doc Lark', say: 'Crowe paid me to poison her, here’s his money, here’s the receipt, but it wasn’t poison, it was the blue bottle, the Long Sleep, I swear on my mother, don’t hit me, I bruise like a peach!' },
              'You let go. He slides down the shelves holding out a fistful of guineas, a signed receipt and a blue glass vial, like a man surrendering his entire life.',
              'The rough door of the sick bay is open a crack. Two topmen are staring in at you. By morning, the story is that the cabin hand beat up the ship’s surgeon. Sailors are fond of Doc. Nobody else will stitch them up.',
            ],
            next: 'crowe_corner',
          },
        ],
      },

      wheel: {
        title: 'Eight Bells — The Quarterdeck',
        art: '☸️✨',
        mood: 'night',
        weather: 'stars',
        scene: 'ship-deck',
        text: [
          'Old Pim has been at sea since before your grandmother was born. He lost his eyes to a powder flash off Cartagena and kept the wheel anyway, because, as he puts it, *the sea never once asked to be looked at.*',
          'He steers south-southwest, towards nowhere you know. When you ask where, he only smiles.',
          { speaker: 'Old Pim', say: 'Where the captain told me, the day before she died. Odd, that. A woman giving sailing orders for a voyage she won’t be on. Almost as if she knew.' },
          'Below you, in the waist of the ship, two of Crowe’s men are pretending to coil a rope. They have been coiling the same rope for twenty minutes.',
        ],
        choices: [
          {
            text: 'Ask him straight: how did the captain die?',
            hint: 'He’ll answer in a riddle. He always does.',
            set: ['clue_pim'],
            art: '🦉',
            outcome: [
              'Old Pim is quiet a while. The wheel creaks under his hands. Then he recites, soft as a lullaby:',
              { speaker: 'Old Pim', say: 'A queen lies down but does not die; the lark sang lullaby, not goodbye. Cold as a fish, but soft as dough — count two days’ sleep before she go.' },
              'You make him say it twice. *The lark* — Doc Lark? *Lullaby, not goodbye.* *Two days’ sleep.* He refuses to explain, and pats your hand, and tells you that’s the most important thing he’s said in forty years and you should write it on your heart.',
            ],
            next: 'crowe_corner',
          },
          {
            text: 'Ask him where the hidden channels are on this course.',
            hint: 'If there’s a fight, knowing the water could save the ship.',
            set: ['reef'],
            art: '🪸',
            outcome: [
              'Pim brightens like a lamp. Nobody ever asks him about the water any more.',
              { speaker: 'Old Pim', say: 'Two days south, the Devil’s Teeth. Reef like a jaw, half a mile across. Every chart says go round. But there’s a gap, sprat. Steer for the Widow’s Rock, then hard a-starboard when the surf goes quiet. Narrow as a coffin and twice as cosy. Big ships can’t follow.' },
              'He makes you repeat it until you can say it in your sleep. *Widow’s Rock. Hard a-starboard. When the surf goes quiet.*',
            ],
            next: 'crowe_corner',
          },
          {
            text: 'Offer to take the wheel so he can rest.',
            hint: 'He’s been up here since the captain fell.',
            effect: L(1),
            art: '🤝',
            outcome: [
              'He lets you. That alone is a marvel — nobody touches Pim’s wheel. He guides your hands to the spokes and stands behind you, murmuring corrections. *Ease her. Feel that? She wants to go. Let her go a little.*',
              'Below in the waist, the two rope-coilers stop coiling and stare. By sunrise the whole ship knows that Old Pim let the cabin hand steer the *Merrow*. Some men take that for a sign.',
            ],
            next: 'crowe_corner',
          },
        ],
      },

      crowe_corner: {
        title: 'Middle Watch — Between Decks',
        art: '🗡️🕯️',
        mood: 'candle',
        scene: 'ship-hold',
        fx: 'heartbeat',
        text: [
          'You don’t hear him coming. You never do. One moment you are alone between the hanging hammocks, the next there is a hand on your shoulder, warm and friendly, the way a snake is friendly.',
          { speaker: 'Silas Crowe', say: 'There you are, my little treasure. My little treasure-keeper, I should say.' },
          'Silas Crowe is handsome the way a well-made pistol is handsome. Silver rings, a silver tongue, a coat that cost somebody else a fortune. He lifts the brass key from your chest with one finger and lets it fall back.',
          { if: 'proof', text: 'The paper in your boot feels like it’s on fire.' },
          { speaker: 'Silas Crowe', say: 'Tomorrow at dawn, this ship gets a new captain. Me. I’m a generous man. I’d like you standing beside me when it happens, with that key, rather than — well. Rather than somewhere wet. Think on it. Or don’t, and answer now. I like decisiveness.' },
          'Behind him, in the dark, at least three men are not breathing very loudly.',
        ],
        choices: [
          {
            text: 'Shake his hand. “I’m with you, Mister Crowe.”',
            hint: 'The winning side is the side that’s still breathing.',
            effect: both(L(1), (s) => s.setVar('side', 1)),
            art: '🤝',
            outcome: [
              'His grip is dry and strong. He holds on a beat too long, reading your face like a tide table.',
              { speaker: 'Silas Crowe', say: 'Clever little sprat. I knew it. Stand by the mainmast at dawn, and when I say *“Gentlemen,”* you hand me that key in front of everyone. A nice bit of theatre.' },
              'The three men in the dark breathe out. One of them slaps your back. Crowe’s crew are already your friends. That’s the thing about Crowe’s crew. They’re everybody’s friends, right up until the knife.',
            ],
            next: 'bess_armoury',
          },
          {
            text: 'Spit on his boots. “I’m the captain’s.”',
            hint: 'Brave. Possibly very stupid. Mostly brave.',
            effect: (s) => s.setVar('side', 2),
            fx: 'shake',
            art: '💦',
            outcome: [
              'It lands on a polished toe with a satisfying *plap*. Crowe looks down at it for a long, long moment.',
              { speaker: 'Silas Crowe', say: 'The captain is dead, darling. Loyalty to a corpse is a very poor investment. But you’ve made your choice, and I respect that. I’ll respect it all the way to the end of a plank.' },
              'He wipes his boot on your trouser leg, pats your cheek twice, and is gone. The three men in the dark go with him. You are shaking so hard the key rattles against your buttons.',
            ],
            next: 'bess_armoury',
          },
          {
            text: 'Smile, say yes — and mean no.',
            hint: 'Tell him what he wants. Then go straight to Bess.',
            effect: (s) => s.setVar('side', 3),
            art: '🎭',
            outcome: [
              'You put on your best ship’s-boy grin, the one you use on harbourmasters.',
              { speaker: 'You', say: 'Course I’m with you, Mister Crowe. Who else would I be with? The dead?' },
              'He laughs and ruffles your hair. He believes you. You think he believes you. With Crowe you can never be sure whether you’re playing him or he’s letting you think so.',
              'As soon as he’s gone you’re running for the armoury, a lie in your mouth and a plan in your head. Two masters. One key. What could possibly go wrong?',
            ],
            next: 'bess_armoury',
          },
          {
            text: 'Pull the key off and toss it to him. “Take it. Leave me out of this.”',
            hint: 'It’s only a key. It’s not worth dying for. Is it?',
            unset: ['key'],
            effect: both(L(-1), (s) => s.setVar('side', 1)),
            art: '🔑',
            outcome: [
              'The cord snaps. The key spins through the lantern light and Crowe catches it without looking, the way a cat catches a moth.',
              { speaker: 'Silas Crowe', say: 'Well. That was easier than I’d budgeted for.' },
              'He tucks it into his waistcoat, right over his heart, where the captain’s trust used to hang around your neck. The men in the dark snigger. By the forenoon watch it’s all over the ship: the cabin hand folded like wet canvas. You feel lighter. You also feel smaller.',
            ],
            next: 'bess_armoury',
          },
        ],
      },

      bess_armoury: {
        title: 'Middle Watch — The Armoury',
        art: '🔫🪓',
        mood: 'candle',
        scene: 'ship-hold',
        text: [
          'Bess “Red” Harrow is counting pistols. She counts them the way other people pray, lips moving, one hand resting on each before moving on. Her hair is the colour of a fire in a powder room and her temper is roughly the same.',
          { speaker: 'Bess', say: 'Thirty-one. There were forty-four at noon. Somebody’s been shopping.' },
          'She turns and looks at you, and her eyes go straight to your neck.',
          {
            if: 'key',
            speaker: 'Bess', say: 'Still got it. Good. The captain trusted you with that, and she trusted precious few. Don’t make her a liar.',
          },
          { if: '!key', speaker: 'Bess', say: 'Where’s the key? Don’t tell me. I can see it on your face. You gave it to that oily ponce, didn’t you?' },
          {
            if: (s) => s.get('side') === 1 || s.get('side') === 3,
            text: 'She sniffs. You can smell Crowe’s cologne on your own shoulder where he held you. So can she.',
          },
          { speaker: 'Bess', say: 'Dawn, he moves. I’ve got maybe a dozen who’ll stand with me. He’s got the rest, or thinks he has. So. Whose are you?' },
        ],
        choices: [
          {
            text: 'Put your hand on a pistol and swear to her.',
            hint: 'For the captain. For the Merrow.',
            effect: both(swearBess, L(1)),
            art: '✋',
            outcome: [
              (s) => s.get('side') === 3
                ? 'You swear it. Your other hand, the one behind your back, has its fingers crossed — or does it? Even you aren’t sure any more. You are now sworn to both Crowe and Bess, which is a bit like being engaged to two sharks.'
                : 'You swear it, hand flat on the cold iron. Bess grunts, which from Bess is practically a hug.',
              { speaker: 'Bess', say: 'Right. Then you stand by me at the mainmast at dawn. And if you hear me shout “Merrow,” you get your head down, because I’ll be shooting over it.' },
              'She hands you the pistol you swore on. It’s unloaded. *“Trust,”* she says, *“is earned.”*',
            ],
            next: 'midnight',
          },
          {
            text: 'Ask her what she saw when the captain fell.',
            hint: 'She was sitting beside her.',
            set: ['clue_body'],
            art: '❓',
            outcome: [
              'Bess goes quiet, which is rare. She sits on a powder keg and turns a pistol over in her big hands.',
              { speaker: 'Bess', say: 'She went face down in the stew. Doc felt her neck and said she’s gone. I carried her to the cabin myself. And here’s the thing that’s been eating me. She was cold as a herring. But floppy. Floppy as a rag doll. I’ve carried a lot of dead mates. They don’t go floppy. They go stiff.' },
              'She looks at you hard.',
              { speaker: 'Bess', say: 'Don’t you tell a soul I said that. They’ll think I’ve gone soft in the head with grief.' },
            ],
            next: 'midnight',
          },
          {
            text: 'Show her the proof against Crowe.',
            hint: 'His own words, in his own hand.',
            if: 'proof',
            effect: both(swearBess, L(2)),
            art: '📜',
            outcome: [
              'Bess reads it by the lantern. Then she reads it again. Then she says a word that makes the lantern flicker.',
              { speaker: 'Bess', say: 'Twenty guineas. Twenty! The captain was worth twenty ships. I’ll gut him like a mackerel.' },
              'You talk her out of doing it right now, barefoot, with a boarding axe. Barely. She sends a powder monkey running through the hammocks instead, whispering. By dawn, every honest hand aboard has heard the cabin hand found Crowe’s confession. Some of Crowe’s men have heard it too. They look thoughtful.',
            ],
            next: 'midnight',
          },
          {
            text: 'Give Bess the key to keep safe.',
            hint: 'She’s bigger than you. Much, much bigger.',
            if: 'key',
            unset: ['key'],
            effect: both(swearBess, L(1)),
            art: '🔑',
            outcome: [
              'Bess stares at the key in her palm like you’ve handed her a live coal.',
              { speaker: 'Bess', say: 'She gave this to *you*. Not me. Not Crowe. You. She must have had a reason, and the captain always had a reason.' },
              'But she tucks it inside her shirt all the same. You feel safer, and also, oddly, as if you’ve just dropped something overboard that you can’t get back.',
            ],
            next: 'midnight',
          },
        ],
      },

      midnight: {
        title: 'Four Bells in the Morning Watch',
        art: '🌙⚓',
        mood: 'night',
        weather: 'stars',
        scene: 'ship-deck',
        text: [
          'The ship creaks and sighs around you. Two hours till first light. On the forecastle, men sharpen cutlasses and pretend they are only bored.',
          s => knows(s)
            ? 'The thought that has been crawling up your spine all night finally reaches the top. Cold but not stiff. A sweet smell. A sleeping draught. *The captain might not be dead.*'
            : 'Something about the captain’s death keeps nagging at you, like a splinter you can’t find.',
          { if: 'key', text: 'The brass key is warm against your chest. Aft, in the great cabin, the chart chest waits. Nobody’s guarding it. Nobody would dare.' },
          'There is time for one more thing before dawn. Maybe.',
        ],
        choices: [
          {
            text: 'Go and corner Doc Lark.',
            hint: 'He knows more than he’s saying. He always does.',
            if: '!clue_vial',
            set: ['clue_vial'],
            art: '⚗️',
            outcome: [
              'You find Doc Lark asleep in a hammock in the sick bay, cuddling a bottle like a teddy bear. A blue glass vial has rolled out of his apron and is clinking against the deck with each roll of the ship.',
              '**TINCTURE OF POPPY & VALERIAN. “THE LONG SLEEP.” TEN DROPS: TWO DAYS.** It is three-quarters empty.',
              'You hold it up to the lantern and every hair on your arms stands up at once.',
            ],
            next: 'dawn_mutiny',
          },
          {
            text: 'Climb to the wheel and ask Old Pim about the captain.',
            hint: 'He’ll talk in riddles. Sometimes riddles are the only safe way to say things.',
            if: '!clue_pim',
            set: ['clue_pim'],
            art: '🦉',
            outcome: [
              'Old Pim hears you coming and starts reciting before you even ask, as if he’s been waiting all night for you to be clever enough to come.',
              { speaker: 'Old Pim', say: 'A queen lies down but does not die; the lark sang lullaby, not goodbye. Cold as a fish, but soft as dough — count two days’ sleep before she go.' },
              { speaker: 'Old Pim', say: 'And sprat? Whatever happens at dawn — the captain goes ashore with us. I’ve told them all. Sailors bury captains in earth, not water. They’ll listen to an old blind man on that, if nothing else.' },
            ],
            next: 'dawn_mutiny',
          },
          {
            text: 'Sneak aft and open the chart chest.',
            hint: 'Everyone wants what’s inside. You could know first.',
            if: 'key',
            set: ['opened'],
            art: '🗝️',
            outcome: [
              'The lock turns with a sweet oily click. Inside, on a bed of velvet: no gold. No jewels. A rolled chart of a little island called **Gull Cay** with an X drawn on a cave, and an oilskin packet sealed with red wax and the royal arms.',
              'You break the seal. Of course you do. Inside is a parchment so grand it practically clears its throat. *“By His Majesty’s grace, a FULL PARDON to every soul sailing aboard the Merrow under Captain Isolde Vane…”* — to be read aloud on Gull Cay, before witnesses, or it isn’t worth the wax.',
              'A pardon. Not treasure. Freedom. You put everything back, but the seal is broken now, and broken seals don’t mend. Somewhere behind you, the dead captain’s cabin feels very, very quiet.',
            ],
            next: 'dawn_mutiny',
          },
          {
            text: 'Go down among the hammocks and talk to the crew.',
            hint: 'A ship isn’t won at dawn. It’s won the night before.',
            effect: L(1),
            art: '🗣️',
            outcome: [
              'You go hammock to hammock in the dark. You don’t make speeches. You ask after Tam’s bad leg and Moll’s brother in Bristol. You share your last twist of tobacco. You remind them the captain paid fair and fed them well and never once flogged a soul.',
              'Nobody promises you anything. But when you leave, a few of the hammocks are swaying with men sitting up in them, thinking.',
            ],
            next: 'dawn_mutiny',
          },
        ],
      },

      // ------------------------------------------------------------ DAWN
      dawn_mutiny: {
        title: 'Dawn — The Mainmast',
        art: '🌅⚔️',
        mood: 'dawn',
        scene: 'ship-deck',
        fx: 'heartbeat',
        timer: 8,
        text: [
          'The sun comes up red as a split lip. Every soul aboard is on deck, and nobody is working.',
          'On the quarterdeck stands Silas Crowe, pistol in his belt, a dozen hard men at his back. By the mainmast stands Bess with her dozen, boarding axe resting on her shoulder like a parasol. Between them, wrapped in sailcloth on a hatch cover, lies Captain Vane.',
          { if: 'clue_pim', text: 'Old Pim got his way: she goes ashore to be buried, not over the side. Small mercies.' },
          { speaker: 'Silas Crowe', say: 'Gentlemen! The old witch is dead. Long live the *Merrow*, and long live her new captain, which is me. And my first order is — ' },
          s => s.get('side') === 1 ? 'He looks straight at you and holds out his hand for the key.'
            : s.get('side') === 2 ? 'Bess looks at you. Crowe looks at you. A hundred men look at you. Hands drop to hilts all over the deck.'
            : 'Crowe looks at you and smiles. Bess looks at you and frowns. They are both waiting for the same cabin hand to step forward. One of them is going to be very disappointed.',
          'The whole ship holds its breath. Choose. **Now.**',
        ],
        timeout: {
          set: ['crowe_won'],
          effect: L(-1),
          art: '😶',
          outcome: [
            'You open your mouth. Nothing comes out. Crowe sees you freeze and he *smiles*, because hesitation is the only invitation he ever needed.',
            { speaker: 'Silas Crowe', say: 'Take them.' },
            'It is over in less than a minute. Bess goes down under four men, swearing magnificently. Her dozen throw down their weapons. And every eye on deck slides away from you, the cabin hand who stood there like a coat on a peg while the ship changed hands.',
          ],
          next: 'after_dawn',
        },
        choices: [
          {
            text: 'Step to Crowe’s side.',
            hint: 'Back the side that’s winning. Whoever you promised.',
            if: (s) => s.get('side') === 1 || s.get('side') === 3,
            set: ['crowe_won'],
            effect: (s) => { if (s.get('side') === 3) s.set('turncoat'); s.setVar('side', 1); L(1)(s); },
            art: '🏴‍☠️',
            outcome: [
              s => s.has('turncoat')
                ? 'You walk past Bess. She watches you go with a face like a slammed door. *“You little rat,”* she says, not loudly, and somehow that’s worse than if she’d shouted.'
                : 'You walk to the quarterdeck and stand at Crowe’s shoulder. He beams like a proud uncle.',
              { if: 'key', text: 'You hold up the brass key so the whole ship can see it, as Crowe asked. He doesn’t take it — not yet. *“Keep it warm for me, treasure. For now.”*' },
              'Bess’s dozen see which way the cabin hand jumped and they waver, and in that waver Crowe’s men are on them. Bess goes into irons, still swearing. Silas Crowe is captain of the *Merrow*. And you helped.',
            ],
            next: 'after_dawn',
          },
          {
            text: 'Step to Bess’s side.',
            hint: 'For the captain. For the Merrow. Whoever you promised.',
            if: (s) => s.get('side') === 2 || s.get('side') === 3,
            effect: (s) => {
              if (s.get('side') === 3) s.set('turncoat');
              s.setVar('side', 2);
              if (s.get('loyalty') < 3) s.set('crowe_won');
            },
            fx: 'shake',
            art: '🪓',
            outcome: [
              { if: 'turncoat', text: 'Crowe’s smile slips — just for a second, but it slips. *“Oh, you clever little liar,”* he says, almost admiringly. Then he pulls his pistol.' },
              'Bess bellows *“MERROW!”* and you get your head down, and the deck explodes into cutlasses, belaying pins and language that would curdle milk.',
              {
                if: 'crowe_won',
                text: 'It isn’t enough. Not enough of the crew follow you. Bess goes down under four men; someone hits you with a bucket; and when you open your eyes, you are on your knees with Crowe’s boot on your back.',
                else: 'And the crew come with you. Men you shared tobacco with, men who heard your oath — they swarm the quarterdeck. Crowe ends up flat on his back with Bess’s axe-head resting gently on his throat. *“Morning, Silas,”* she says. Into the irons he goes.',
              },
            ],
            next: 'after_dawn',
          },
          {
            text: 'Wave Crowe’s own confession over your head.',
            hint: 'Let the crew read whose name is on it.',
            if: 'proof',
            unset: ['crowe_won'],
            effect: both(L(1), (s) => { if (s.get('side') === 1 || s.get('side') === 3) s.set('turncoat'); s.setVar('side', 2); }),
            fx: 'flash',
            art: '📜',
            outcome: [
              { speaker: 'You', say: 'He paid Doc Lark twenty guineas to poison her! It’s in his own hand! Read it!' },
              'The paper passes from fist to fist. Some of Crowe’s men can read. Those that can’t have it read to them, loudly, with relish. Crowe’s smile goes stiff, like a dead man’s — a proper dead man’s.',
              { speaker: 'The Crew', say: 'Twenty guineas? For the CAPTAIN?' },
              'His own dozen take his pistol off him. Crowe goes into the irons calling them all ungrateful, which they find very funny. Bess claps you on the back hard enough to loosen teeth.',
            ],
            next: 'after_dawn',
          },
          {
            text: 'Ring the ship’s bell and scream “SAIL HO!”',
            hint: 'Pure nonsense. Pure distraction. Pure desperation.',
            art: '🔔',
            outcome: [
              'You leap for the bell and clang it like the end of the world. *“SAIL HO! SAIL HO, OFF THE STARBOARD BOW!”*',
              'Every head turns. Including yours. Because there, coming out of the morning haze, is a sail. A real one. Grey hull, white ensign, a long row of gun ports. A Royal Navy cutter, bearing down on you like a hawk on a hen house.',
              'You did not expect that. Nobody expected that. For one beautiful moment, Crowe and Bess forget they want to kill each other, because something else wants to kill them both.',
            ],
            next: 'after_dawn',
          },
        ],
      },

      after_dawn: {
        redirect: (s) => (s.has('crowe_won') && s.get('side') !== 1 ? 'plank' : 'cutter'),
      },

      plank: {
        title: 'Morning — The Plank',
        art: '🪵🦈',
        mood: 'blood',
        scene: 'ship-deck',
        fx: 'shake',
        timer: 7,
        text: [
          'They run a plank out over the starboard rail. It’s an old hatch board with a nail sticking up in the middle, which feels unnecessarily personal.',
          'Below, in the green water, three grey fins draw lazy circles. Somebody has been throwing the stew overboard.',
          { speaker: 'Silas Crowe', say: 'I did warn you, treasure. Somewhere wet. I always keep my promises — it’s my only flaw.' },
          { if: 'key', text: 'He hasn’t taken the key yet. He’s waiting for you to beg with it. You can see it in his eyes.' },
          'A cutlass point pricks your back. The plank bounces under your bare feet. The crew are watching. Some of them won’t meet your eyes. Some of them will.',
        ],
        timeout: {
          art: '🌊',
          outcome: [
            'You hesitate one heartbeat too long. The cutlass point jabs. Your foot finds the nail, and then finds nothing at all.',
            'The sea closes over your head, green and roaring.',
          ],
          next: 'end_plank',
        },
        choices: [
          {
            text: 'Hold up the key. “My life for it.”',
            hint: 'He wants it more than he wants you dead. Probably.',
            if: 'key',
            unset: ['key'],
            art: '🔑',
            outcome: [
              'Crowe pretends to think about it. He even strokes his chin. Then he plucks the key off your neck.',
              { speaker: 'Silas Crowe', say: 'Done. I’m not a monster. We make Gull Cay in two days. I’ll set you ashore there with a pistol and one shot. Nobody can say Silas Crowe isn’t a gentleman.' },
              'You spend two days in irons next to Bess, who doesn’t speak to you once. Then, one bright morning, they row you to a beach and leave you there.',
            ],
            next: 'island',
          },
          {
            text: 'Turn on the plank and shout to the crew.',
            hint: 'Find out tonight whether you have any friends aboard.',
            effect: (s) => { if (s.get('loyalty') >= 3) s.unset('crowe_won'); },
            art: '📣',
            outcome: [
              { speaker: 'You', say: 'Is this what she fed you for? Is this what she paid you for? To watch a kid walk the plank for a man who kills captains for twenty guineas?' },
              {
                if: 'crowe_won',
                text: 'Silence. A gull laughs somewhere. Crowe gives a little bow, as if you’ve performed a song for him, and nods to the man with the cutlass.',
                else: 'Silence. Then a fist hits a rail. Then another. Then Tam with the bad leg says *“No. No, I reckon not,”* and steps between you and the cutlass, and suddenly there are twenty men stepping, and Crowe is the one with his back to the sea. They free Bess. Bess frees her axe. Crowe goes in irons, protesting that this is extremely unsporting.',
              },
            ],
            next: (s) => (s.has('crowe_won') ? 'end_plank' : 'cutter'),
          },
          {
            text: 'Run off the end and dive deep — under the keel.',
            hint: 'Sharks hunt near the surface. And the Merrow’s rudder chains hang low.',
            fx: 'flash',
            art: '🤿',
            outcome: [
              'You sprint to the end of the plank before they can push you and dive like a gannet — deep, deeper, down past the fins, under the green belly of the ship.',
              {
                if: (s) => s.has('reef') || s.has('clue_pim'),
                text: 'You remember Pim’s endless sea-talk: *the rudder chains hang low on the Merrow, sprat, low enough for a seal to sleep on*. You swim for the stern, lungs bursting, and grab the chain and haul up into the dark hollow under the counter. Above you, Crowe is telling everyone what a shame it was. Then the lookout screams *SAIL HO*, and nobody is thinking about you any more.',
                else: 'You swim until your lungs scream. You surface on the wrong side of the hull with nothing to hold on to. The fins turn, all three at once, the way a crowd turns when someone drops a coin.',
              },
            ],
            next: (s) => (s.has('reef') || s.has('clue_pim') ? 'cutter' : 'end_plank'),
          },
        ],
      },

      // ------------------------------------------------------------ THE CHASE
      cutter: {
        title: 'Forenoon — HMS Wasp',
        art: '⛵💥',
        mood: 'sea',
        scene: 'sea',
        fx: 'shake',
        timer: 8,
        text: [
          'The cutter comes out of the haze with her gun ports open: HMS *Wasp*, fourteen guns, fast as gossip. A flag snaps up her halyard. **HEAVE TO OR BE SUNK.**',
          { if: 'crowe_won', text: 'Crowe has gone the colour of old porridge. For all his talk, he has never fought a navy ship. He turns to the crew, and the crew — strangely — turn to you.' },
          { if: '!crowe_won', text: 'Crowe rattles his chains in the hold, shouting that this is all a terrible misunderstanding and he’d like to speak to the Lieutenant. Bess looks at you. *“You’ve got the luck today, sprat. Call it.”*' },
          'A puff of white smoke from the *Wasp*’s bow. A heartbeat later a ball howls over the deck and takes the top off the mizzen. Splinters rain down like hail.',
          'To the south, a black squall is marching across the sea, trailing rain like a widow’s veil.',
          { if: 'reef', text: 'And to the west — white surf, a long line of it. *The Devil’s Teeth.*' },
        ],
        timeout: {
          effect: L(-1),
          fx: 'redflash',
          art: '💥',
          outcome: [
            'Nobody gives an order. The *Merrow* wallows. The *Wasp* does not.',
            'Her full broadside hits you amidships. The world is noise and splinters and men screaming, and when the smoke clears, the wind has taken the *Merrow* all on its own and is dragging her, half-wrecked, into the black heart of the squall.',
          ],
          next: 'squall',
        },
        choices: [
          {
            text: 'Run for the squall!',
            hint: 'Lose them in the rain. Pray the masts hold.',
            art: '⛈️',
            outcome: [
              { speaker: 'You', say: 'Helm hard over! All sail she’ll carry! Into the weather!' },
              'The *Merrow* heels until her lee rail drinks the sea, and plunges for the squall. The *Wasp* fires again and misses, and then the rain shuts down on you like a lid on a pot.',
            ],
            next: 'squall',
          },
          {
            text: 'Run out the guns. Fight her.',
            hint: 'Fourteen navy guns. Will the crew follow your orders?',
            fx: 'shake',
            art: '💣',
            outcome: [
              { speaker: 'You', say: 'Run out the guns! Let’s show the King what pirates are for!' },
              {
                if: loyal(3),
                text: 'And they cheer. They actually cheer. The *Merrow*’s guns go off in one tremendous roar, and the *Wasp*’s mainmast leans, considers its options, and falls over the side in a tangle of canvas and very surprised sailors. You leave her turning in circles behind you, her officers waving swords at the sky.',
                else: 'Half the gun crews are still arguing about whose orders they’re under when the *Wasp* fires. Her broadside walks across your deck. Somewhere below, the powder room catches.',
              },
            ],
            effect: (s) => { if (s.get('loyalty') >= 3) L(1)(s); },
            next: (s) => (s.get('loyalty') >= 3 ? 'island' : 'end_battle'),
          },
          {
            text: 'Strike the colours. Surrender.',
            hint: 'The navy might be merciful. It has been known. Once.',
            art: '🏳️',
            outcome: [
              'You haul down the black flag with your own hands. A sigh goes round the deck like wind through rigging.',
              'The *Wasp* comes alongside. A lieutenant in a spotless coat steps over the rail and looks around the *Merrow* the way a man looks at something on his shoe.',
              { speaker: 'Lieutenant Ashby', say: 'Lieutenant Ashby, His Majesty’s cutter *Wasp*. Which of you scum is in command? Ah — the child. Splendid. You can hang first. Set an example.' },
            ],
            next: 'end_hanged',
          },
          {
            text: 'Steer for the Devil’s Teeth — Pim’s gap.',
            hint: 'Widow’s Rock. Hard a-starboard when the surf goes quiet.',
            if: 'reef',
            effect: L(1),
            art: '🪸',
            outcome: [
              'You grab the wheel yourself. Old Pim is suddenly at your shoulder, smiling at nothing.',
              { speaker: 'Old Pim', say: 'Widow’s Rock dead ahead. Wait for it. Wait… listen to the surf, sprat… *now.*' },
              'You spin the wheel. The *Merrow* slides through a gap in the reef so narrow you could spit on the coral either side. Behind you, the *Wasp* tries to follow, and there is a long, grinding, deeply expensive crunch. The crew cheer you all the way across the lagoon.',
            ],
            next: 'island',
          },
        ],
      },

      squall: {
        title: 'Noon — The Squall',
        art: '⛈️🌊',
        mood: 'storm',
        weather: 'rain',
        scene: 'ship-deck',
        fx: 'shake',
        timer: 7,
        text: [
          'Day becomes night. The rain comes sideways, then upwards, then from every direction at once. Waves as tall as churches climb over the bow and walk down the deck looking for people to take.',
          'The mainmast is groaning — a long, deep, wooden moan, like an old man getting out of a chair. Something has cracked up there in the cannon fire.',
          'At the wheel, Old Pim is clinging on with both arms, and a green wall of water is rising behind him.',
          'And the captain — the canvas bundle on the hatch cover — is sliding, inch by inch, towards the broken rail.',
        ],
        timeout: {
          art: '🌊',
          outcome: [
            'You can’t decide. The sea decides for you.',
            'The green wall comes down. It picks you up like a hand picks up a crumb, and carries you over the rail, and the *Merrow* is a dark shape in the rain, and then she isn’t.',
          ],
          next: 'end_battle',
        },
        choices: [
          {
            text: 'Lash yourself to the wheel and steer.',
            hint: 'If you go, the ship goes with you.',
            art: '☸️',
            outcome: [
              'You get a rope round your waist and round the binnacle and you grab the spokes. The wave hits. For a long, black, choking moment there is no air in the world — and then the *Merrow* shrugs it off and you are still there, still steering.',
              'An hour later the squall spits you out into sunshine, battered and bailing, with the *Wasp* nowhere to be seen. Ahead, low and green on the horizon, lies an island shaped like a sleeping gull.',
            ],
            next: 'island',
          },
          {
            text: 'Dive for Old Pim before the wave takes him.',
            hint: 'He taught you to steer. He’s blind. He’s nearly ninety.',
            effect: L(1),
            art: '🫂',
            outcome: [
              'You throw yourself across the deck and wrap both arms round Pim and the wheel together. The wave hits you both. It’s like being punched by a cathedral.',
              'When it drains away you are still holding on, and so is he, coughing and laughing.',
              { speaker: 'Old Pim', say: 'Ha! I’ve been drowned four times, sprat, and that was by far the nicest.' },
              'Half the crew saw you do it. When the squall blows through and an island rises out of the sea ahead of you, they let you have the first look at it.',
            ],
            next: 'island',
          },
          {
            text: 'Grab an axe and cut away the mainmast.',
            hint: 'If it falls the wrong way, it takes the hull with it. You need hands to help.',
            fx: 'redflash',
            art: '🪓',
            outcome: [
              { speaker: 'You', say: 'Axes! Cut her free before she drags us under!' },
              {
                if: loyal(2),
                text: 'Men come running through the spray with axes. Shrouds part with sounds like gunshots. The mainmast goes over the side clean, and the *Merrow* bobs up lighter, staggering but alive. She limps out of the squall into the sunshine with an island dead ahead.',
                else: 'Nobody comes. You hack alone at shrouds as thick as your arm. The mast lurches the wrong way, tears up half the deck, and drags the *Merrow* over on her beam ends. The sea pours in.',
              },
            ],
            next: (s) => (s.get('loyalty') >= 2 ? 'island' : 'end_battle'),
          },
          {
            text: 'Throw yourself on the captain’s body before it goes over.',
            hint: 'Dead or not, she deserves better than the sea.',
            if: knows,
            effect: L(1),
            art: '⚰️',
            outcome: [
              'You land on the canvas bundle a yard from the broken rail and hang on as the wave drags at you both. Under the sailcloth, against your ear, you could swear you feel something.',
              'A heartbeat. Slow, slow as a sleeping bear’s. But there.',
              'The crew see you hauling the captain’s body back from the rail through the storm, and they think you’re mad, or devoted, or both. When the squall breaks and an island rises ahead in the sunshine, they’re still talking about it.',
            ],
            next: 'island',
          },
        ],
      },

      // ------------------------------------------------------------ GULL CAY
      island: {
        title: 'Afternoon — Gull Cay',
        art: '🏝️🦜',
        mood: 'sunny',
        scene: 'island',
        text: [
          'Gull Cay: a crescent of white sand, a hill of palms, a cliff with a dark mouth in it like a yawn. Gulls everywhere, shouting abuse at each other.',
          s => !s.has('key') && s.has('crowe_won') && s.get('side') === 2
            ? 'The jolly boat crunches on the sand and Crowe’s men tip you out of it like a sack of turnips. One pistol. One shot. One water skin, half full. Up the beach, Crowe and his crew are already hauling the chart chest towards the cliff, singing.'
            : s.has('crowe_won')
              ? 'Captain Crowe — he insists on the title — leaps out of the first boat and plants a boot on the sand like a conqueror. Bess, in chains, is hauled out after him. The crew carry the chart chest between them on two oars.'
              : 'Bess drives the first boat up the beach with a shout. Crowe sits in the stern in irons, sulking magnificently. The crew carry the chart chest between them on two oars.',
          'Behind them all, four men carry the captain’s body in its sailcloth, because Old Pim insisted, and nobody has the heart to argue with Old Pim.',
          { if: 'opened', text: 'You already know what’s in the chest. You’ve known since midnight. Nobody else does. The X on the chart was on that cave.' },
          { if: (s) => knows(s) && !s.has('opened'), text: 'You glance at the canvas bundle. Two days’ sleep, the vial said. It has been two days, near enough.' },
        ],
        choices: [
          {
            text: 'Lead the way up to the cave.',
            hint: 'Whatever’s in there, see it first.',
            art: '🕳️',
            outcome: [
              s => !s.has('key') && s.has('crowe_won') && s.get('side') === 2
                ? 'You follow at a distance, keeping to the palms. Nobody looks back for a marooned cabin hand. Why would they?'
                : 'You walk at the head of the crew with the gulls screaming around you. Nobody tells you to stop. Somewhere in the last two days, without anyone deciding it, you started walking at the front.',
            ],
            next: 'cave',
          },
          {
            text: 'Turn on Crowe here, on the beach.',
            hint: 'His men are tired and their hands are full. But are they yours?',
            if: 'crowe_won',
            effect: (s) => { if (s.get('loyalty') >= 3) { s.unset('crowe_won'); if (s.get('side') === 1) s.set('turncoat'); s.setVar('side', 2); } },
            fx: 'shake',
            art: '🗡️',
            outcome: [
              'You snatch a pistol from the nearest belt and level it at Silas Crowe’s fine silk waistcoat.',
              { speaker: 'You', say: 'Free Bess. Now.' },
              {
                if: 'crowe_won',
                text: 'Crowe laughs. His men laugh. The pistol, it turns out, isn’t loaded. They take it off you, tie your hands, and leave you sitting in the sand, and Crowe pats your head on his way past. *“Ambition. I adore it. I’ll leave you some water.”*',
                else: 'Crowe’s smile hangs in the air like a dropped glove. Then Tam steps up beside you with a cutlass. And Moll. And six more. Crowe looks round at his crew — his crew — and finds they have all become very interested in the gulls. Bess is out of her chains in a minute and Crowe is in them in two.',
              },
            ],
            next: (s) => (s.has('crowe_won') ? 'end_marooned' : 'cave'),
          },
          {
            text: 'Help carry the captain up the hill yourself.',
            hint: 'Take a corner of the sailcloth. She should have friends around her.',
            effect: L(1),
            art: '⚰️',
            outcome: [
              'You take a corner of the sailcloth. She is heavier than you expect, and warmer. Much warmer than a body two days dead in the tropic sun should be — or much cooler. You can’t tell which. You can’t tell anything any more.',
              'The men carrying the other corners say nothing. But one of them nods at you, and when you reach the cave mouth they set her down gently, right where you point.',
            ],
            next: 'cave',
          },
          {
            text: 'Lead Crowe’s men to the “treasure” — the wrong way.',
            hint: 'You saw the chart. They didn’t. There’s a bog behind those palms.',
            if: (s) => s.has('opened') && s.has('crowe_won'),
            effect: L(1),
            art: '🐊',
            outcome: [
              'You point confidently inland. *“The X is past those palms. I saw it.”* Six of Crowe’s keenest men charge off with spades.',
              'Ten minutes later there are distant squelching noises, then screaming, then a lot of very bad language about crabs. The rest of the crew laugh until they cry. Whatever Crowe’s men are, they are not, any longer, frightening.',
            ],
            next: 'cave',
          },
        ],
      },

      cave: {
        title: 'Sunset — The Cave of the X',
        art: '🕯️📦',
        mood: 'candle',
        scene: 'cave',
        text: [
          'The cave is cool and dim and smells of salt and bat. Someone lights a lantern. The chart chest is set down on a flat rock in the middle like an altar.',
          s => s.has('key')
            ? 'Every eye goes to the brass key around your neck. You kneel and fit it to the lock. It turns with a sweet oily click.'
            : s.has('crowe_won')
              ? 'Crowe turns the brass key with a flourish. *“Gentlemen — your fortunes.”*'
              : 'The key turns. The lid creaks back. Whoever’s hand is on it, every eye is on you.',
          'No gold. No jewels. A chart, an old coat button, and an oilskin packet with a royal seal.',
          s => s.has('opened')
            ? 'The seal is broken. Somebody notices. Somebody always notices. Mutterings go round the cave like a cold draught.'
            : 'The seal is unbroken, red wax stamped with a crown.',
          'Unfolded, it is a royal pardon, signed and sealed: *a FULL PARDON to every soul sailing aboard the Merrow under Captain Isolde Vane, to be proclaimed aloud on Gull Cay before witnesses.* Freedom. For everyone. Even the idiots.',
          { if: 'crowe_won', speaker: 'Silas Crowe', say: 'A pardon? A PARDON? I poisoned a captain for a piece of PAPER?' },
          { if: '!crowe_won', text: 'In the corner, in his chains, Silas Crowe has gone very pale. *“Under Captain Vane,”* he whispers. Not under Silas Crowe.' },
          'Behind you, at the cave mouth, the sailcloth bundle lies in the last red light of sunset. Very still.',
          s => s.get('loyalty') >= 3 ? 'The crew look to you. They’ve been looking to you for two days.' : 'The crew look at each other, and at the paper, and at you, and don’t seem sure of anything.',
        ],
        choices: [
          {
            text: 'Read the pardon aloud to the whole crew.',
            hint: 'Before witnesses. On Gull Cay. Like it says.',
            art: '📜',
            outcome: [
              'You climb on the rock beside the chest and read it out, every grand and curly word of it, your voice echoing back off the cave walls.',
              {
                if: (s) => s.get('loyalty') >= 3 && !s.has('crowe_won'),
                text: 'When you finish, there is silence. Then Tam starts crying. Then Moll. Then Bess, though she will deny it until the day she dies. Free men. Free women. Every one.',
                else: (s) => s.has('crowe_won')
                  ? 'When you finish, Crowe snatches the parchment and laughs. *“Pardon? We’ll ransom it back to the Crown for ten thousand.”* And the crew, who don’t trust you enough, look at you, and look at him, and go with the one who promised money.'
                  : 'When you finish, nobody cheers. *“A broken seal,”* somebody mutters. *“A forgery. The sprat’s been at it.”* Another voice: *“Ransom it to the Crown.”* Bess roars at them, but she is one woman, and they are tired and greedy and very far from home. By nightfall Crowe is out of his chains, smiling, and you are the one they leave behind.',
              },
            ],
            next: (s) => (s.get('loyalty') >= 3 && !s.has('crowe_won') ? 'end_pardon' : 'end_marooned'),
          },
          {
            text: 'Hold up the brass key. “I say I’m captain now.”',
            hint: 'Pardons are for people who want to stop being pirates. Do you?',
            art: '🏴‍☠️',
            outcome: [
              { speaker: 'You', say: 'She gave me the key. She gave it to me and no one else. I say the Merrow needs a captain, and I say it’s me. Vote.' },
              {
                if: loyal(4),
                text: 'For a moment you think they’ll laugh. Then Bess raises her axe. Then Old Pim raises his hand. Then every hand in the cave goes up, and the cheer brings rocks down from the roof.',
                else: 'A few hands go up. Not enough. Not nearly enough. In the silence, Crowe — or whoever wants it most — starts to laugh, and the laughter spreads, and that’s how you know.',
              },
            ],
            next: (s) => (s.get('loyalty') >= 4 ? 'end_captain' : 'end_marooned'),
          },
          {
            text: 'Pocket the pardon and slip out to signal the navy.',
            hint: 'Sell them all to the Wasp. A pardon for one is still a pardon.',
            art: '🚩',
            outcome: [
              'You tuck the parchment into your shirt and slip out of the cave while everyone is still arguing. On the headland, you light a signal fire with the captain’s own tinderbox.',
              'By midnight, the *Wasp* — patched, limping and furious — is anchored in the lagoon. You run down the beach waving your pardon like a lottery ticket.',
            ],
            next: 'end_hanged',
          },
          {
            text: 'Kneel by the captain’s body. “Captain. It’s time.”',
            hint: 'Two days’ sleep. A lullaby, not goodbye. You kept her key.',
            if: secretReady,
            fx: 'flash',
            art: '⚰️',
            outcome: [
              'Everyone thinks you’ve gone mad with grief. You kneel at the sailcloth bundle and start, very gently, to unpick the sailmaker’s stitches.',
              { speaker: 'You', say: 'Captain. I kept your key. I didn’t open it till we got here. It’s time.' },
              'Under the canvas, the captain’s eyelids flicker. Two silver coins slide off her face and ring on the rock like a bell.',
            ],
            next: 'end_vane',
          },
        ],
      },

      // ------------------------------------------------------------ ENDINGS
      end_vane: {
        art: '👑🏴‍☠️',
        mood: 'gold',
        weather: 'sparkles',
        scene: 'cave',
        fx: 'flash',
        ending: { id: 'vane-wakes', title: 'Lullaby, Not Goodbye', type: 'secret' },
        text: [
          'Captain Isolde Vane sits up in her shroud, spits out a mouthful of sailcloth fluff, and says the first words anyone has heard from her in two days:',
          { speaker: 'Captain Vane', say: 'Has anybody got a biscuit? I could eat a bosun.' },
          'Three men faint. Doc Lark bursts into tears and shouts *“IT WORKED! It worked, it worked, I am a GENIUS!”* Silas Crowe makes a noise like a gull swallowing a fish whole.',
          { speaker: 'Captain Vane', say: 'Somebody aboard my ship was selling us to the Navy. I couldn’t tell who. So I died, and waited to see who came for my key. Doc gave me the Long Sleep in place of Crowe’s poison. And I gave the key to the one soul aboard I was sure nobody would suspect of being clever.' },
          'She looks at you, and for the first time in your life Isolde Vane looks impressed.',
          { speaker: 'Captain Vane', say: 'You kept it. You worked it out. And you didn’t peek. Do you know how rare that is, sprat? It is rarer than an honest quartermaster. No offence, Bess.' },
          { if: 'turncoat', text: 'Bess grumbles that she takes plenty of offence, and also that you lied to Crowe AND her, and the captain laughs until she coughs. *“Lied to both sides and kept faith with me. That’s not treachery, Bess. That’s seamanship.”*' },
          { if: '!turncoat', text: 'Bess, crying openly now, says none taken, and squeezes the captain so hard something clicks.' },
          'The captain reads the pardon aloud herself, in her great quarterdeck voice, to every soul aboard — except one. Silas Crowe, she notes, was never under her command at all. He was under the Admiralty’s. Lieutenant Ashby of the *Wasp* will be delighted to have him back.',
          'You sail home free, with a captain who is alive, a crew who would follow you into a hurricane, and a brass key which she hangs back around your neck.',
          { speaker: 'Captain Vane', say: 'Keep it. Till I ask for it back. And next time, sprat — next time, I may actually be dead. Use your judgement.' },
        ],
      },

      end_pardon: {
        art: '📜🌅',
        mood: 'dawn',
        weather: 'sparkles',
        scene: 'island',
        ending: { id: 'pardon', title: 'Free as the Wind', type: 'true' },
        text: [
          'They stay on Gull Cay three days, eating turtle and drinking coconut and singing every song any of them know, some of them twice.',
          'On the fourth morning, the *Wasp* limps into the lagoon. Lieutenant Ashby comes ashore with twenty marines and a face like a thundercloud — and you hand him the pardon.',
          { speaker: 'Lieutenant Ashby', say: 'This is… this is genuine. Signed by the King himself. Every soul under Captain Vane. Damn and blast it.' },
          'He has to salute you. It nearly kills him. He does, however, cheer up considerably when you hand him Silas Crowe, who was never under Captain Vane at all — he was, it turns out, a navy informer who had been promised the pardon for himself, and a share of the ship besides.',
          { if: 'opened', text: 'Ashby squints at the broken seal. *“This has been opened.”* Bess leans over him like a cliff. *“By the wind,”* she says. He decides that’s good enough.' },
          'They bury Captain Vane on the hill above the cave, under the palms, where she can see the sea. Old Pim says the words. They are, of course, a riddle.',
          { if: (s) => knows(s), text: 'You stand at the grave longer than anyone else. You know what the vial said. You know what the riddle meant. And you can’t shake the feeling that you missed something — that somewhere there was a door you didn’t knock on.' },
          'Then the crew of the *Merrow* sail home as free people. Some go back to fishing. Some open taverns. Bess becomes a harbourmaster and terrifies an entire port. And you? You have a bit of paper that says you are no longer a pirate.',
          'You keep it in the empty chart chest, under the velvet, and on bad nights you take it out and read it, and it still says the same thing. *Free.*',
        ],
      },

      end_captain: {
        art: '🏴‍☠️👑',
        mood: 'sunny',
        scene: 'ship-deck',
        ending: { id: 'captain', title: 'Captain Sprat', type: 'good' },
        text: [
          'They carve your name on the wheel — badly, with a cutlass, and misspelled — but it’s yours.',
          'You read the pardon to the crew anyway, because the captain would have wanted them to have the choice. Eleven take it and go home. The rest — thirty-four souls who like the sea better than the land — tear their names out of it and sign the *Merrow*’s articles under yours instead.',
          { if: 'turncoat', text: 'Bess signs last. *“You lied to me at dawn,”* she says. *“And then you came right in the end. That’s more than most captains manage.”* She becomes your quartermaster. She never lets you forget the lie. You never want her to.' },
          { if: '!turncoat', text: 'Bess signs first, in letters a foot high, and becomes your quartermaster. She calls you *Captain Sprat* until the day she dies, and hits anyone else who tries.' },
          'Crowe you leave on Gull Cay, with a pistol and one shot and a very long time to think about his career choices.',
          'Old Pim teaches you every channel, every reef, every secret gap in every coastline from Tortuga to the Azores. You never take a merchant ship that didn’t deserve it, and you never once lose a crewman to a broadside — or to a captain’s stew.',
          'And the brass key hangs round your neck to the end of your days, opening nothing, keeping everything.',
        ],
      },

      end_marooned: {
        art: '🏝️😩',
        mood: 'sunny',
        scene: 'island',
        ending: { id: 'marooned', title: 'Lord of the Gulls', type: 'bad' },
        text: [
          'The *Merrow* sails away at dawn. You watch her topsails shrink to nothing from the top of the hill, and then you watch the nothing for quite a while longer.',
          { if: 'turncoat', text: 'You played both sides. In the end, both sides noticed.' },
          { if: 'key', text: 'The brass key is still round your neck. It opens a chest that’s sailing away without you. You wear it anyway.' },
          'One pistol. One shot. One water skin. One island, about a mile around if you walk briskly, and you have plenty of time to walk briskly.',
          'The gulls do not respect you. You try to establish dominance on the first day. By the second week, you have accepted your place in the gull hierarchy, which is roughly just above the crabs.',
          'You name the palm trees. You name the crabs. You build a hut, a raft, a second raft after the first one sinks, and a small, dignified throne made of driftwood. You do not use the one shot, though some days are close.',
          'Three years later, a fishing boat finds you on the beach, bearded and brown and speaking mainly in gull. They ask how you came to be here. You open your mouth to tell them about Captain Vane, and Crowe, and a brass key, and a piece of paper that could have freed everyone.',
          'Instead you say: *“Have you got any stew?”* And then you laugh, and laugh, and can’t stop.',
        ],
      },

      end_plank: {
        art: '🌊🦈',
        mood: 'sea',
        weather: 'bubbles',
        scene: 'sea',
        fx: 'redflash',
        ending: { id: 'plank', title: 'Somewhere Wet', type: 'death' },
        text: [
          'The water is very green, and very cold, and full of light at the top and darkness at the bottom.',
          'You kick for the light. You kick for a long time. The *Merrow*’s hull slides past above you, barnacled and enormous, and you can hear Crowe’s voice through the planks, muffled, telling a joke. The crew are laughing at it. Some of them.',
          { if: 'key', text: 'The brass key floats up from your neck on its cord and turns in the water in front of your face, glinting, like it’s trying to tell you something. It always was.' },
          'Then there are grey shapes in the green, unhurried and polite, and the light gets further away.',
          'Somewhere above, a gull laughs. Silas Crowe always did keep his promises.',
        ],
      },

      end_battle: {
        art: '💥⚓',
        mood: 'storm',
        weather: 'rain',
        scene: 'sea',
        fx: 'shake',
        ending: { id: 'davy-jones', title: 'Davy Jones’s Locker', type: 'death' },
        text: [
          'The *Merrow* goes down by the stern, slowly, with dignity, the way the captain would have wanted, if the captain had wanted to sink, which she very much did not.',
          'You go with her. You hold on to the rail as the sea climbs the deck towards you, and you think, absurdly, about the stew.',
          { if: 'crowe_won', text: 'The last thing you see on the surface is Silas Crowe in the jolly boat, rowing hard for the cutter with a white shirt on an oar, shouting that he’s a navy man, honestly, ask anybody. He wasn’t lying. That’s the worst part.' },
          { if: '!crowe_won', text: 'The last thing you see on the surface is Bess, swimming for a hatch cover with Old Pim under one arm and a boarding axe in her teeth. You hope she makes it. Something tells you she will. Bess always does.' },
          'And then it is quiet, and green, and the sea has the *Merrow* at last. It has been waiting a long time. It’s patient, the sea.',
          'They say on still nights, off the Devil’s Teeth, you can hear a ship’s bell ringing under the water, and a small voice shouting *Sail ho*.',
        ],
      },

      end_hanged: {
        art: '🪢⚓',
        mood: 'blood',
        scene: 'dawn',
        ending: { id: 'hanged', title: 'Dancing the Hempen Jig', type: 'death' },
        text: [
          'Port Royal. A fine sunny morning. A crowd, a band, and a man selling hot pies. Hangings are very popular in Port Royal.',
          { if: 'opened', text: 'You wave the pardon at the magistrate. *“Every soul under Captain Vane!”* He reads it, slowly, all the way to the end. *“To be proclaimed aloud on Gull Cay before witnesses,”* he reads. *“Is this Gull Cay?”* It is not Gull Cay.' },
          { if: '!opened', text: 'You try to tell the magistrate about the chest, and the captain, and the poison that wasn’t. He listens politely and then asks if you’d like a pie before or after.' },
          'Lieutenant Ashby stands at the front in his spotless coat, and beside him — in a brand-new navy uniform, buttons gleaming — stands Silas Crowe. He tips his hat to you. He was the Admiralty’s man all along. Of course he was.',
          { speaker: 'Silas Crowe', say: 'Nothing personal, treasure. You were simply on the wrong side. You always were. Both of them.' },
          'The drums roll. The pie man pauses mid-sale. Somewhere out in the harbour, a gull laughs.',
          'It’s a lovely morning for it. Everyone says so.',
        ],
      },
    },
  });
})();
