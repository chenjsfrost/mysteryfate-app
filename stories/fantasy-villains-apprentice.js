/* MysteryFate story: The Villain's Apprentice (fantasy) */
(function () {
  'use strict';

  const clamp = (n) => Math.max(0, Math.min(5, n));
  // Adjust the two HUD meters (Menace, Heart), clamped to 0..5.
  const bump = (m, h) => (s) => {
    s.setVar('menace', clamp(s.get('menace') + m));
    s.setVar('heart', clamp(s.get('heart') + h));
  };
  const BALANCED = (s) => Math.abs(s.get('menace') - s.get('heart')) <= 1;
  const CHOSEN_READY = (s) => s.has('scroll') && s.has('grub_free') && BALANCED(s);

  registerStory({
    id: 'fantasy-villains-apprentice',
    title: "The Villain's Apprentice",
    category: 'fantasy',
    tagline: 'The Chosen One is coming to destroy your master. She will not stop quoting the prophecy.',
    description:
      "You are the newest apprentice of Malgrath the Dread, Dark Lord of the Ashen Spire. The prophesied Chosen One arrives today, and she is seventeen, smug and extremely annoying. Rise as a villain, turn good, or find a cleverer third door, with a soup-loving goblin, a vague Oracle and a dragon who is afraid of heights.",
    cover: '🦹',
    accent: '#8e3fd1',
    ambient: 'fantasy',
    scene: 'castle',
    voices: {
      narrator: { gender: 'male', pitch: 0.95, rate: 1, accent: 'en-GB', note: 'wry fantasy storyteller, warm, a little arch' },
      'Malgrath': { gender: 'male', pitch: 0.6, rate: 0.85, accent: 'en-GB', note: 'ancient theatrical Dark Lord, booming, secretly exhausted' },
      'Pip': { gender: 'female', pitch: 1.3, rate: 1.2, accent: 'en-US', note: 'seventeen, smug Chosen One, talks fast and constantly' },
      'Grub': { gender: 'male', pitch: 1.25, rate: 1.1, accent: 'en-AU', note: 'cheerful loyal goblin, loves soup' },
      'Seraphine': { gender: 'female', pitch: 1.05, rate: 0.85, accent: 'en-IE', note: 'dreamy, mischievous Oracle, vague on purpose' },
      'Mortimer': { gender: 'male', pitch: 0.45, rate: 0.9, accent: 'en-US', note: 'enormous dragon, deep voice, very nervous' },
      'You': { gender: 'neutral', pitch: 1, rate: 1, accent: 'en-GB' },
    },
    warning: 'Contains: cartoon villainy, mild peril, dragon fire, a great deal of soup.',
    vars: { menace: 1, heart: 1 },
    flags: [],
    hud: [
      { var: 'menace', label: 'Menace', icon: '😈', max: 5 },
      { var: 'heart', label: 'Heart', icon: '💛', max: 5 },
    ],
    start: 'intro',
    scenes: {
      /* ------------------------------------------------------------------ ACT 1: THE SPIRE */
      intro: {
        scene: 'throne',
        title: 'Dawn of Prophecy Day: The Throne Room',
        art: '👑',
        mood: 'castle',
        weather: 'embers',
        text: [
          "The throne room of the Ashen Spire is built to make visitors feel small. The pillars are carved with screaming gargoyles. The carpet is the colour of old blood. The braziers burn green for no reason anyone has ever been able to explain, including the man who lit them.",
          "You have been the apprentice of **Malgrath the Dread** for exactly nine days. You have learned three curses, two cackles and the correct way to fold a cape so it billows on cue.",
          "Malgrath sits on a throne of black iron, nine feet tall and roughly four thousand years old. He is giving the Morning Briefing. He has given the Morning Briefing every morning for four thousand years.",
          { speaker: 'Malgrath', say: "MINIONS. Today is the day foretold. The Chosen One, one *Pip Brightwater* of Lesser Puddling, arrives at our gates. She will attempt to defeat me. She will FAIL. Any questions? No? Excellent. Grub, the Orb." },
          "Grub, a goblin about the height of a barrel and roughly as round, waddles forward carrying the Orb of Unending Night on a velvet cushion. In his other hand, for reasons known only to Grub, he is carrying a bowl of soup.",
          "He trips on the carpet. The soup goes up. The soup comes down. The Orb of Unending Night is now the Orb of Unending Leek and Potato. The whole room goes silent except for one gargoyle, who drips.",
          { speaker: 'Malgrath', say: "Grub. To the dungeon. Until the prophecy is resolved." },
          { speaker: 'Grub', say: "Fair enough, boss. Can I bring the soup?" },
          "Every head in the room turns to you, the new apprentice. Nine days in, this is a test, and you know it.",
        ],
        choices: [
          {
            text: 'Step forward and speak up for Grub',
            hint: 'It was an accident. Also it smells delicious.',
            effect: bump(0, 1),
            art: '🙋',
            outcome: [
              "You clear your throat. In a throne room this size, clearing your throat sounds like a small landslide.",
              { speaker: 'You', say: "My Lord, with respect, the Orb looks... better? It has a sort of glow now. A rustic glow." },
              "Malgrath stares at you for a long time. The braziers flicker. Then he sighs, a sigh that goes back several centuries.",
              { speaker: 'Malgrath', say: "Dungeon. But he may have a cushion. Do NOT make me regret my generosity, apprentice. I have regretted things for four thousand years and I am running out of room." },
              "Grub gives you a two-thumbs-up as two skeleton guards march him away. He is still holding the soup.",
            ],
            next: 'briefing',
          },
          {
            text: 'Throw your head back and cackle at Grub',
            hint: 'Cackle #2: the Rolling Thunder. You practised it in the bath.',
            effect: bump(1, -1),
            art: '😈',
            outcome: [
              "You throw your head back and unleash Cackle Number Two. It starts low, rolls through the rafters, and only cracks a tiny bit at the end, where it turns into a hiccup.",
              "The other minions take this as a cue and cackle too, nervously, like a choir that doesn't know the song. A bat falls out of the ceiling.",
              { speaker: 'Malgrath', say: "Hm. The hiccup lets it down. But the *spirit* is there. Seven out of ten." },
              "Grub looks at you on his way out. He doesn't look angry. He looks like a puppy who's just been told he's not a good boy, which is, somehow, worse.",
            ],
            next: 'briefing',
          },
          {
            text: 'Notice Malgrath yawning, and ask if he is all right',
            hint: 'He has been yawning since you arrived. Nine days.',
            set: ['retire'],
            art: '🥱',
            outcome: [
              "Behind the fuss, you notice something nobody else does. Malgrath the Dread, Eater of Kingdoms, has his elbow on the armrest and his chin on his hand, and his eyelids are doing the slow, heavy blink of a man who would like a nap. Peeking out from under his cushion is a pamphlet. You catch two words on it: *Sunny Cottages*.",
              "While the guards take Grub away, you lean in and whisper.",
              { speaker: 'You', say: "My Lord. Are you... all right?" },
              "The Dark Lord blinks. For half a heartbeat something soft crosses his ancient face, like a cloud over a very old moon. Then he stuffs the pamphlet deeper under the cushion.",
              { speaker: 'Malgrath', say: "I am MAGNIFICENT. I am DREAD. I am... fine. Thank you for asking. Nobody ever asks. Now go away before I feel something." },
            ],
            next: 'briefing',
          },
        ],
      },

      briefing: {
        scene: 'throne',
        title: 'The Morning Briefing, Item Two',
        art: '📜',
        mood: 'candle',
        text: [
          "Malgrath unrolls a scroll so long it bounces down the throne steps and out the door. This is the To-Do List of Doom. It has been added to for four thousand years. Nothing has ever been crossed off.",
          { speaker: 'Malgrath', say: "The Chosen One reaches the Gauntlet of Woe by noon. Before then: someone must check the traps, someone must deal with the Oracle's library, which is leaking prophecies again, and someone must get Mortimer out of the roost. He is the dragon. He is our escort. He has not left the roost since Tuesday." },
          { speaker: 'Malgrath', say: "Apprentice. You choose first. It builds character. *Evil* character." },
          { if: 'retire', text: "He doesn't meet your eye. The Sunny Cottages pamphlet is now sticking out of his sleeve." },
          "Three doors lead out of the throne room. One goes down to the Gauntlet, which smells like oil and spite. One goes up to the library, which smells like dust and secrets. One goes up much, much higher, to the roost, which smells like a dragon who is very worried.",
        ],
        choices: [
          {
            text: "Climb to the Oracle's library",
            hint: 'Prophecies are leaking. Somebody should mop.',
            art: '📚',
            outcome: [
              "You take the spiral stairs up. Somewhere around the two-hundredth step, the walls start to whisper. Not words exactly. Fragments. *...the one who is chosen... ...beware the third Tuesday... ...your socks are mismatched...*",
              "You look down. Your socks are mismatched. You keep climbing, slightly faster.",
            ],
            next: 'library',
          },
          {
            text: 'Go up to the roost and fetch Mortimer',
            hint: 'How hard can it be to talk to a dragon?',
            art: '🐉',
            outcome: [
              "The roost is at the very top of the eastern tower, which is the tallest thing in the kingdom apart from Malgrath's ego. The wind up there could peel an apple.",
              "Halfway up, you pass a sign someone has painted in shaky letters: DRAGON INSIDE. PLEASE KNOCK. PLEASE DON'T KNOCK LOUDLY. You knock softly.",
            ],
            next: 'roost',
          },
          {
            text: 'Head down to the Gauntlet and inspect the traps',
            hint: 'Straight to work. Very professional. Very evil.',
            effect: bump(1, 0),
            art: '⚙️',
            outcome: [
              "You go straight down. A good apprentice gets ahead of the work. A great apprentice gets ahead of the work *and* checks that the Swinging Axe of Regret is properly oiled.",
              "Malgrath nods approvingly as you leave. You hear him say, to nobody in particular, “Finally. One with initiative.”",
            ],
            next: 'workshop',
          },
        ],
      },

      library: {
        scene: 'library',
        title: "Mid-Morning: The Oracle's Library",
        art: '🔮',
        mood: 'candle',
        weather: 'sparkles',
        text: [
          "The library goes up forever. Shelves climb into darkness, ladders lean on ladders, and somewhere near the top a book is quietly reading itself aloud. Prophecies drip from a crack in the ceiling like glowing honey and pool on the floor, muttering.",
          "In the middle of it all, sitting cross-legged on a desk, is **Seraphine** the Oracle. She has silver hair, ink on her nose and the bright, amused eyes of someone who knows how the story ends and finds it hilarious.",
          { speaker: 'Seraphine', say: "Ah. The apprentice. I've been expecting you. Well. I've been expecting *someone*. You'll do. You're about the right shape." },
          "On the desk beside her lies a battered scroll tied with a faded ribbon. The ink is old. The handwriting is hers. On the shelf behind her sits the *Official Translation*, bound in gold, with Malgrath's crest on the spine.",
          { speaker: 'Seraphine', say: "That's the original prophecy, before the scribes got their hands on it. Old Gloomish is a tricky language. One misplaced accent and *“the apprentice of shadow”* becomes *“the soup of shadow.”* Long story. Delicious soup." },
        ],
        choices: [
          {
            text: 'Untie the ribbon and read the original scroll',
            hint: 'Your Old Gloomish is rusty. You have a dictionary.',
            set: ['scroll'],
            art: '📜',
            outcome: [
              "You untie the ribbon. The scroll unrolls itself with a happy little sigh, like a cat stretching. The Old Gloomish letters swim, then settle as you squint.",
              "*When the Dread grows weary and the soup is spilled, the one who is chosen shall walk in shadow, serve in shadow, and*... and then there's a word you don't know. You flip through the dictionary. The word is *apprentice*. The official translation, on the shelf, says *defeat*.",
              "You read it again. And again. Your skin goes prickly.",
              { speaker: 'Seraphine', say: "Interesting, isn't it? I've been telling them for centuries. Nobody listens to the Oracle. They just want the *highlights*." },
              "She rolls the scroll back up and tucks it into your belt before you can protest. “Hang onto that,” she says. “You'll know when.”",
            ],
            next: 'workshop',
          },
          {
            text: 'Toss the scroll into the brazier',
            hint: 'No prophecy, no Chosen One. Problem solved.',
            effect: bump(2, -1),
            fx: 'flash',
            art: '🔥',
            outcome: [
              "You snatch the scroll and fling it into the green fire. It's a decisive, villainous, *very* efficient move. Malgrath would be proud.",
              "The flames gobble it up. Then the flames burp. The scroll floats back out, perfectly intact, very slightly warmer, and drops back onto the desk.",
              { speaker: 'Seraphine', say: "Prophecies don't burn, dear. That's rather the point of them. I'm going to write *tried to burn it* in your file. In red. With a little skull." },
              "She doesn't seem angry. She seems delighted. That is much more unsettling.",
            ],
            next: 'workshop',
          },
          {
            text: 'Ask Seraphine straight out: who wins today?',
            hint: 'Oracles love a direct question. Probably.',
            effect: bump(0, 1),
            art: '❓',
            outcome: [
              { speaker: 'You', say: "Who wins today? Malgrath or the Chosen One?" },
              "Seraphine considers this. She considers it so long that a candle burns down and a new one grows up in its place.",
              { speaker: 'Seraphine', say: "Yes." },
              { speaker: 'You', say: "That's not an answer." },
              { speaker: 'Seraphine', say: "It's the *best* answer. Everybody wins, if somebody is clever. Everybody loses, if everybody is stupid. And somebody always gets soup. Off you go, the traps need you." },
              "She shoos you out, and the door shuts behind you. You hear her laughing to herself on the other side, the way a cat might laugh if it could.",
            ],
            next: 'workshop',
          },
        ],
      },

      roost: {
        scene: 'cave',
        title: 'Mid-Morning: The Dragon Roost',
        art: '🐲',
        mood: 'ember',
        weather: 'embers',
        text: [
          "The roost is a cave carved into the very top of the tower, with a wide, open mouth that looks out over the whole kingdom: forests, villages, rivers, and a long, long, *long* way down.",
          "**Mortimer** is huddled at the very back, as far from the opening as a dragon the size of a barn can get. He is the colour of a bruise. He has wrapped his own tail around his eyes.",
          { speaker: 'Mortimer', say: "Is it windy? It sounds windy. Please tell me it's not windy." },
          "A dragon afraid of heights. Living at the top of the tallest tower in the kingdom. Because, you assume, someone in the Spire's Department of Dragons thought it would look cool.",
          { speaker: 'Mortimer', say: "The boss wants me to fly escort today. Over the Skybridge. Across the Chasm of Ultimate Drop. I can't. I *can't.* Last time I looked down I saw a cloud and I fainted. Onto a sheep. The sheep was fine. I was not." },
        ],
        choices: [
          {
            text: 'Sit down next to him and talk about his fear',
            hint: 'It is a very big dragon with a very small problem.',
            set: ['mortimer'],
            effect: bump(0, 1),
            art: '🤗',
            outcome: [
              "You sit down next to a dragon. Which is a sentence you never expected to be part of your life. His scales are warm, like a stone that's been in the sun.",
              "You talk. You tell him about the time you were scared of the cellar until you went down with a candle and found it was just jars of pickles. He tells you about his mother, who pushed him out of the nest to teach him to fly, and he hit eleven trees on the way down.",
              { speaker: 'Mortimer', say: "You're the first one who didn't just yell FLY, YOU OVERGROWN LIZARD. That was nice. If anything goes wrong today... I'll try. For you. I'll try to look up." },
              "He uncurls his tail from his eyes and gives you a nudge with his snout that nearly knocks you over. It's the most dragonish hug in history.",
            ],
            next: 'workshop',
          },
          {
            text: 'Drag him toward the edge. Tough love.',
            hint: 'Fear is just weakness leaving the body.',
            effect: bump(1, -1),
            fx: 'shake',
            art: '😤',
            outcome: [
              "You grab one of his claws and pull. A dragon is heavy. A frightened dragon is heavier. You heave, and Mortimer slides one inch toward the opening, makes a noise like a kettle full of thunder, and lets out a jet of fire straight at the ceiling.",
              "The ceiling is now black. So are your eyebrows. You don't have eyebrows anymore. You have a vague *memory* of eyebrows.",
              { speaker: 'Mortimer', say: "Sorry! Sorry! That happens when I'm scared! Please don't do that again. I'll fly when I'm ready. I'm not ready. I'll never be ready. Please go away." },
              "You go away, smelling slightly of toast. Mortimer watches you leave with one big, wary eye.",
            ],
            next: 'workshop',
          },
          {
            text: 'Leave him a bowl of goblin soup and go',
            hint: "Grub left a pot simmering in the kitchen. Everybody likes soup.",
            effect: bump(0, 1),
            art: '🍲',
            outcome: [
              "On your way up you passed Grub's kitchen, where a pot of soup is always bubbling, and you brought some. It seemed like the right thing to do. Dragons must eat something besides sheep.",
              "You set the bowl in front of Mortimer and back away. He sniffs it. He sniffs it again. Then a long purple tongue slurps the whole thing up, bowl included.",
              { speaker: 'Mortimer', say: "...That's Grub's mum's recipe. With the little bits of turnip. Thank you. Tell Grub I said thank you." },
              "He doesn't come out of the corner. But he's not hiding his eyes anymore either.",
            ],
            next: 'workshop',
          },
        ],
      },

      workshop: {
        scene: 'dungeon',
        title: 'Late Morning: Beneath the Gauntlet',
        art: '🔧',
        mood: 'ember',
        text: [
          "The Gauntlet of Woe is a long stone corridor packed with every trap the Spire has ever bought from a catalogue: the Swinging Axe of Regret, the Pit of Moderately Sized Spiders, the Rolling Boulder of Comeuppance and, at the very end, the Great Net of Gotcha.",
          "Under it lies the control room, a cramped little chamber full of levers, chains and labels written by Grub. The labels say things like **AXE (SWINGY)**, **SPIDERS (DO NOT FEED AFTER MIDNIGHT)** and **NET (BIG)**.",
          { if: 'scroll', text: "The scroll in your belt feels warm against your hip, like it knows something you don't. Or like it knows something you *do*, and are trying not to think about." },
          "Through the spy-hole you can see the far end of the corridor. Footsteps are coming. Confident, bouncy footsteps. And a voice, already talking, already halfway through a sentence, already very pleased with itself.",
          { speaker: 'Pip', say: "...and it says, and I'm quoting here, *the Chosen One shall pass the Gauntlet unharmed*, so honestly, Mr. Gauntlet, you might as well open up, because it's not *personal*, it's *destiny*." },
          "That's her. Pip Brightwater. You have maybe a minute before she reaches the first trap.",
        ],
        choices: [
          {
            text: 'Oil every trap and arm the lot',
            hint: 'Make Malgrath proud. Make the spiders proud.',
            effect: bump(1, 0),
            art: '🪤',
            outcome: [
              "You work fast. Axe: oiled. Boulder: rolled back to the top of its slope, with a little wedge. Spiders: given a pep talk. Net: folded. You stand back. The Gauntlet hums with deadly purpose. It is beautiful, in a horrible way.",
              "A label on the last lever catches your eye. It says, in Grub's handwriting: **IF YOU ARE READING THIS PLEASE CHECK ON THE SOUP**. You smile despite yourself.",
            ],
            next: 'gauntlet',
          },
          {
            text: 'Quietly loosen a few bolts',
            hint: 'Nobody needs to know. Nobody needs to get squashed.',
            set: ['sabotaged'],
            effect: bump(0, 1),
            art: '🔩',
            outcome: [
              "You don't know why, exactly. Maybe because she's seventeen. Maybe because the Rolling Boulder of Comeuppance looks *really* heavy. You loosen the bolts on the axe, wedge the boulder so it'll only roll a little, and put the spiders on their lunch break.",
              "When you're done, the Gauntlet looks as deadly as ever. It just isn't. You feel a funny warm feeling in your chest that might be kindness or might be the leek and potato soup you had for breakfast.",
            ],
            next: 'gauntlet',
          },
        ],
      },

      gauntlet: {
        scene: 'dungeon',
        title: 'Noon: The Gauntlet of Woe',
        art: '⚔️',
        mood: 'blood',
        fx: 'shake',
        text: [
          "Pip Brightwater bursts into the Gauntlet with a sword that glows, a cape that billows without needing to be folded, and a grin you would like to remove with a spoon. She is seventeen. She has a feather in her hat. The feather looks smug.",
          { speaker: 'Pip', say: "*Chapter Four, verse Nine: the Chosen One shall leap the axe as a lamb leaps a fence!*" },
          "She leaps the axe. She leaps it well. She lands, turns to the empty corridor, and bows.",
          { if: 'sabotaged', text: "The axe doesn't even swing properly, thanks to you. It just sort of droops, like it's embarrassed for her.", else: "The axe whistles past her nose. She doesn't flinch. She *winks* at it." },
          "She's halfway down the corridor. The boulder is behind her. The Net is in front of her. Your hand is on the lever. Pull too late and she walks straight out the other end and up to the throne room. Decide. Now.",
        ],
        timer: 8,
        timeout: {
          text: 'You hesitated.',
          effect: bump(0, 0),
          art: '🪨',
          outcome: [
            "You dither. Your hand hovers. And in the moment you take to think, Pip trips on her own cape, stumbles into the boulder's tripwire, and sets the Rolling Boulder of Comeuppance thundering after her.",
            "She runs. She runs *very fast*. She runs straight into the Great Net of Gotcha, which drops all by itself, and the boulder stops with a polite thud an inch behind her.",
            { speaker: 'Pip', say: "This is FINE. This is a *planned setback.* Verse Twelve says the Chosen One shall be *briefly inconvenienced*!" },
            "So you captured the Chosen One. Technically. By doing absolutely nothing. The skeleton guards cart her off to the dungeon. Your hands are still shaking.",
          ],
          next: 'dungeon',
        },
        choices: [
          {
            text: 'Pull the lever. Drop the Net.',
            hint: 'NET (BIG).',
            effect: bump(1, 0),
            art: '🕸️',
            outcome: [
              "You yank the lever. Chains rattle. The Great Net of Gotcha falls like a big, heavy, rope-flavoured cloud and lands squarely on top of the Chosen One.",
              { speaker: 'Pip', say: "Ah. Hmm. Well, this is clearly a metaphor. Verse Twelve: *the Chosen One shall be briefly inconvenienced.* This is me being briefly inconvenienced." },
              "You climb up from the control room. Pip peers at you through the netting with enormous interest.",
              { speaker: 'Pip', say: "Oh, you're the *apprentice*. You're in the prophecy too! Small part. Very small. Like a footnote. Hi, footnote!" },
              "The skeleton guards cart her off to the dungeon. She waves at you the whole way.",
            ],
            next: 'dungeon',
          },
          {
            text: 'Unleash the Spinning Blades of Mild Inconvenience',
            hint: 'Not on the label. You found the lever behind a curtain.',
            effect: bump(2, -1),
            fx: 'redflash',
            art: '🌀',
            outcome: [
              "There's a lever behind a curtain marked **DO NOT. SERIOUSLY. — M.** You pull it. The walls open. Out come the Spinning Blades of Mild Inconvenience, which are not blades at all but hundreds of whirling wooden spoons.",
              "They don't hurt. They do *bonk*. They bonk Pip's hat off, then her sword, then her dignity, and then the Net falls on her, almost out of pity.",
              { speaker: 'Pip', say: "OW! Ow. That's my elbow. The prophecy said NOTHING about spoons!" },
              "From somewhere far above, you hear Malgrath's laugh echo through the pipes. He saw that. He *loved* that. You feel very, very evil, and slightly sorry about the elbow.",
            ],
            next: 'dungeon',
          },
          {
            text: 'Climb up and face her yourself',
            hint: 'Apprentice to Chosen One. Look her in the eye.',
            effect: bump(0, 1),
            art: '🧍',
            outcome: [
              "You leave the lever and climb the ladder up into the corridor, right in her path. Pip stops. She looks you up and down. You look her up and down. She is shorter than you expected.",
            ],
            next: 'gauntlet_face',
          },
        ],
      },

      gauntlet_face: {
        scene: 'dungeon',
        title: 'Noon: Face to Face',
        art: '🗡️',
        mood: 'castle',
        text: [
          { speaker: 'Pip', say: "Oh! You're the apprentice. Malgrath's apprentice. You're in the prophecy too, you know. Tiny part. *“And the apprentice of shadow shall stand in the Chosen One's way.”* That's you standing! Good job! Very accurate." },
          { if: 'sabotaged', text: "She glances back at the drooping axe. “Was that you? The axe thing? I *knew* it was too easy. You're not very good at this, are you?”" },
          "Up close, her sword glows a little less than you thought. There's a patch on her cape. There's a sandwich crust in her hair. She smells like someone who's been walking for three days and hasn't stopped talking for any of them.",
          { speaker: 'Pip', say: "Okay, so here's the deal. You can step aside, and when I've defeated your boss I'll mention you in the ballad. Second verse. Maybe third. OR you can fight me, and that's in the prophecy too, and you lose. *Chapter Six.* I've read ahead." },
        ],
        choices: [
          {
            text: 'Step aside. Let her go up.',
            hint: 'Second verse of a ballad. Not bad for nine days.',
            effect: bump(0, 1),
            art: '🚶',
            outcome: [
              "You step aside. Pip beams and marches past you, sword raised high.",
              "She gets four steps. On the fifth, she steps on a loose flagstone that is not part of the Gauntlet at all. It's just a loose flagstone. Grub has been meaning to fix it for a year. She goes down with a clang and the Great Net, apparently fed up with waiting, drops on its own.",
              { speaker: 'Pip', say: "That's... fine. Verse Twelve. *Briefly inconvenienced.* Totally predicted." },
              "The skeleton guards arrive and cart her away. Over her shoulder, she gives you a look. Not angry. Puzzled. Like you're a word she doesn't know.",
            ],
            next: 'dungeon',
          },
          {
            text: "Snatch the prophecy book out of her hands",
            hint: "She can't quote it if she doesn't have it.",
            effect: bump(1, 0),
            art: '📕',
            outcome: [
              "You lunge and snatch the little gold book from her hand. Pip gasps like you've snatched her baby.",
              { speaker: 'Pip', say: "GIVE THAT BACK. I've ANNOTATED that!" },
              "She grabs for it. You hold it up high. She jumps for it, which is when she steps squarely onto the Net's pressure plate. *Thwump.* The Great Net of Gotcha lands on her like a dropped tent.",
              "From under the net, muffled: “...Verse Twelve. Briefly. Inconvenienced.” You toss the book in after her. She hugs it.",
            ],
            next: 'dungeon',
          },
        ],
      },

      /* ------------------------------------------------------------------ ACT 2: THE DUNGEON */
      dungeon: {
        scene: 'dungeon',
        title: 'Afternoon: The Dungeons of Despair',
        art: '⛓️',
        mood: 'castle',
        text: [
          "Malgrath appoints you, personally, as guard of the Chosen One. It's an honour, he says. It's also because nobody else will do it. Everyone else has met her.",
          "The dungeon is damp and drippy and smells of old straw. Pip sits in the middle cell, chained by one ankle, talking. She started talking when they brought her in. She has not stopped.",
          { speaker: 'Pip', say: "...and verse Fifteen says *the Chosen One shall break free in the hour of greatest need*, which I think is going to be about seven, so if you need the toilet, I'd go now." },
          "In the next cell over, Grub is lying on a cushion, stirring a bowl of soup with a spoon. He's somehow made soup. In a dungeon. Out of, as far as you can tell, straw and optimism.",
          { speaker: 'Grub', say: "Oi! Apprentice! Want some? It's straw and turnip. Mostly straw. It's grand." },
          { if: 'scroll', text: "The scroll at your hip grows warm again. Pip is quoting the Official Translation. You've read the original. They don't quite match." },
          "Grub's cell key is on the same ring as Pip's. It's hanging on your belt, jingling every time you move. Pip has noticed. Pip notices everything.",
        ],
        choices: [
          {
            text: "Unlock Grub's cell",
            hint: 'He spilled soup. That is not a crime. That is a lifestyle.',
            set: ['grub_free'],
            effect: bump(0, 1),
            art: '🗝️',
            outcome: [
              "You unlock Grub's door. It squeals like a pig. Grub looks at the open door, then at you, then at the door again, the way a dog looks at a ball it doesn't believe is being thrown.",
              { speaker: 'Grub', say: "For me? Out? Before the prophecy's resolved? The boss'll go mental!" },
              { speaker: 'You', say: "The boss can talk to me. You're not a prisoner, Grub. You're a goblin who tripped." },
              "Grub's eyes go wet. He wraps both arms around your leg, which is as high as he can reach, and holds on for a long time.",
              { speaker: 'Grub', say: "Nobody's ever said that to me. Right. I'm with you now. Wherever you go, I go. And I'm bringin' the soup." },
            ],
            next: 'dungeon_night',
          },
          {
            text: 'Interrogate Pip. What is her plan?',
            hint: 'Lean on the bars. Look menacing. Try not to blink.',
            effect: bump(1, 0),
            art: '🔦',
            outcome: [
              "You lean on the bars and narrow your eyes, the way Malgrath taught you. *Low voice. Slow words. Never blink first.*",
              { speaker: 'You', say: "What's your plan, Chosen One?" },
              { speaker: 'Pip', say: "Oh, great question! So first I break free, verse Fifteen, then I cross the Skybridge, verse Twenty, then there's a dragon bit, verse Twenty-One, I skipped that, looked boring, then I climb the Spire and defeat Malgrath with the Sword of Morning and everybody claps. Chapter Nine. The end." },
              "You blink first. She has told you everything. She doesn't seem to think it matters. That, somehow, is the most threatening thing about her.",
            ],
            next: 'dungeon_night',
          },
          {
            text: "Correct Pip's quote using the original scroll",
            hint: "She keeps saying “defeat.” The scroll doesn't.",
            if: 'scroll',
            art: '📜',
            outcome: [
              "You pull out Seraphine's scroll and unroll it in the torchlight.",
              { speaker: 'You', say: "Actually, the original doesn't say *defeat*. That word is *apprentice*. It says the chosen one shall *walk in shadow, serve in shadow*..." },
              "For the first time since she arrived, Pip Brightwater stops talking. Her mouth stays open. Nothing comes out.",
              { speaker: 'Pip', say: "That's... that's a typo. That's obviously a typo. Why would the Chosen One be an *apprentice*? I'm not an apprentice. I'm a *farm girl*. That's the whole... that's the *brand*." },
              "She goes quiet. It lasts nine whole seconds, a dungeon record. In the next cell, Grub quietly stops stirring his soup and looks at you very hard.",
            ],
            next: 'dungeon_night',
          },
        ],
      },

      dungeon_night: {
        scene: 'dungeon',
        title: 'Night: Still Talking',
        art: '🌙',
        mood: 'night',
        text: [
          "Night falls. The torches burn low. Pip has been talking for six hours. She has covered the prophecy, her childhood, her goat, her childhood *with* her goat, and her opinion of every single brick in the cell.",
          { if: 'grub_free', text: "Grub has curled up on a pile of straw at your feet like a loyal, soup-scented dog. He snores in little whistles.", else: "In the next cell, Grub has fallen asleep with his face in his soup. He's blowing bubbles. He's fine. Probably." },
          "Then, suddenly, Pip goes quiet. She shuffles over to the bars, as close as the chain lets her, and lowers her voice.",
          { speaker: 'Pip', say: "Can I tell you something? Off the record? I'm not sure I can do this. Everybody in Lesser Puddling just *decided* it was me because I was born on a Tuesday under a funny-shaped cloud. What if they got it wrong? What if I'm just... some girl? With a goat?" },
          "It's the first honest thing she's said all day. You have the keys. You have the night. You have a choice.",
        ],
        choices: [
          {
            text: "Unlock her cell. Let's go together.",
            hint: 'She is annoying. She is also seventeen and terrified.',
            set: ['pip_free'],
            effect: bump(0, 1),
            art: '🔓',
            outcome: [
              "You unlock the cell. Then the ankle chain. Pip stares at you like you've just pulled a rabbit out of her hat.",
              { speaker: 'Pip', say: "Verse Fifteen! *The Chosen One shall break free in the hour of greatest need!* It's happening! I'm breaking free! I mean, *you're* breaking me free, but I'm going to remember it slightly differently." },
              { if: 'grub_free', text: "Grub wakes up, sees what's happening, and silently hands her a bowl of soup. That's goblin for “welcome to the team.”" },
              "You slip out of the dungeon together. Down a corridor. Up a stair. Into the dark of the Spire, with every torch dead and every guard asleep.",
            ],
            next: 'sneak',
          },
          {
            text: "Free Grub, and leave Pip in her cell",
            hint: 'One rescue tonight. The loyal one.',
            if: '!grub_free',
            set: ['grub_free'],
            effect: bump(0, 1),
            art: '🗝️',
            outcome: [
              "You step past Pip's cell and unlock Grub's door instead. He wakes up with soup on his face and blinks at you.",
              { speaker: 'Grub', say: "Is it mornin'? Am I free? Is the soup free? Are we all free?" },
              { speaker: 'You', say: "You are. She isn't. Not yet." },
              { speaker: 'Pip', say: "Oh, sure. Free the *goblin*. Classic. That's very on brand for an apprentice of shadow. Very sidekick-y. I respect it." },
              "Grub hugs your leg. You hear Pip muttering prophecy verses to herself as you leave, but quieter now, like someone praying.",
            ],
            next: 'study',
          },
          {
            text: 'Stuff a sock in her mouth and get some sleep',
            hint: 'A clean sock. You are not a monster. Mostly.',
            effect: bump(1, -1),
            art: '🧦',
            outcome: [
              "You find a sock. It is, technically, clean. You toss it through the bars.",
              { speaker: 'You', say: "Put that in. Goodnight, Chosen One." },
              "Pip stares at the sock. Then at you. Then, to your amazement, she actually puts it in her mouth, sits down and stops talking. You realise, too late, that she probably just wanted someone to tell her what to do.",
              "The silence is wonderful. It's also, for some reason, a little bit sad. You lie awake for a while anyway.",
            ],
            next: 'study',
          },
          {
            text: 'Tell her the truth: you are scared too',
            hint: "You're nine days in. Nobody knows what they're doing.",
            effect: bump(0, 1),
            art: '🕯️',
            outcome: [
              "You sit down with your back against her bars. For a minute you don't say anything. Then you do.",
              { speaker: 'You', say: "I've been an apprentice for nine days. I don't know any real curses. My cackle has a hiccup in it. I think everybody's just guessing, Pip. Even him upstairs." },
              "Behind you, she laughs, a real laugh, small and surprised. Then she's quiet for a while.",
              { speaker: 'Pip', say: "Your cackle *does* have a hiccup in it. I heard it this morning. All the way from the gate. I thought it was a goose." },
              "You sit there until she falls asleep. You keep the keys. But something has changed, and you both know it.",
            ],
            next: 'study',
          },
        ],
      },

      sneak: {
        scene: 'castle',
        title: 'Midnight: The Sleeping Spire',
        art: '🕯️',
        mood: 'night',
        weather: 'stars',
        text: [
          "You creep through the Spire with Pip behind you, and she is trying very hard to whisper, and failing. Pip's whisper is most people's normal voice.",
          { if: 'grub_free', text: "Grub trots ahead, sniffing for guards, the soup bowl balanced on his head like a helmet." },
          "You pass the door to Malgrath's private chambers. It's open a crack. Lamplight spills out. And from inside comes a sound you never expected to hear from the Dark Lord of the Ashen Spire.",
          "Sniffling. Then a long, tired voice, talking to itself.",
          { speaker: 'Malgrath', say: "Four thousand years. Four thousand Chosen Ones. Every single one of them *talks*. I just want a cottage. With a little garden. And a bread oven. Is that so much to ask?" },
          { speaker: 'Pip', say: "Whoa. Is the Dark Lord *crying*? That's not in the prophecy." },
          "Further down, the corridor splits. Left leads to the Skybridge and the Spire top. Right leads back down to the guardroom, where a whole squad of skeleton guards is asleep at a card table.",
        ],
        choices: [
          {
            text: 'Push the door open and talk to Malgrath',
            hint: 'Nobody ever asks him if he is all right.',
            set: ['retire'],
            effect: bump(0, 1),
            art: '🚪',
            outcome: [
              "You push the door. Malgrath is sitting on the edge of his bed in a dressing gown covered in little embroidered skulls, holding a pamphlet. *Sunny Cottages of the Southern Shore.* He sees you. He sees Pip, unchained, behind you. He sighs.",
              { speaker: 'Malgrath', say: "Of course. Of course she's out. They're always out by midnight. Close the door, apprentice. There's a draught." },
              "You sit with him a while. He shows you the pamphlet. He's circled one cottage in red. It has a bread oven. He's always wanted to bake. You can't bake evil, he says. Bread is too honest.",
              "Pip stands in the doorway with her mouth open, listening to the Dark Lord talk about sourdough. When you leave, she doesn't say anything at all. That's twice in one day.",
            ],
            next: 'bridge',
          },
          {
            text: 'Slip past quietly and head for the Skybridge',
            hint: 'Not your business. Probably.',
            effect: bump(0, 0),
            art: '🤫',
            outcome: [
              "You tiptoe past. The door creaks. The sniffling stops. You freeze, all three of you, and then it starts again, quieter.",
              "You put a finger to your lips and lead Pip left, toward the Skybridge. Behind you, faintly, you hear Malgrath say to nobody, “...and maybe a little cat.”",
              "The image stays with you all the way down the corridor. The Dark Lord, with a little cat.",
            ],
            next: 'bridge',
          },
          {
            text: 'Lead Pip straight into the guardroom and shout ALARM',
            hint: 'She trusted you. That was her mistake.',
            set: ['pip_sold'],
            unset: ['pip_free'],
            effect: bump(2, -2),
            fx: 'redflash',
            art: '🚨',
            outcome: [
              "You smile at Pip and point right. “Shortcut,” you whisper. She nods and follows you into the guardroom, straight into a room full of skeletons.",
              "Then you shout. “ALARM! ALARM! THE PRISONER HAS ESCAPED!”",
              "Twelve skeletons leap up from their card table. Cards fly everywhere. Someone had a full house. Pip looks at you as the bony hands close on her arms, and for once she doesn't quote a single verse. She just looks.",
              { speaker: 'Pip', say: "...Huh. Chapter Six was right about you after all." },
              { if: 'grub_free', text: "Grub looks at you too. Then he looks at the floor, and very slowly takes the soup bowl off his head." },
              "Malgrath appears in the doorway in his skull dressing gown, takes it all in, and gives you a long, slow, approving nod. You are very evil now. It should feel better than it does.",
            ],
            next: 'bridge',
          },
        ],
      },

      study: {
        scene: 'library',
        title: "Midnight: The Dark Lord's Study",
        art: '🍷',
        mood: 'candle',
        text: [
          "A skeleton guard finds you at midnight and taps you on the shoulder with a bony finger. *The master wishes to see you.*",
          "Malgrath's private study is smaller than you'd expect. Books, maps, a fire, a very old armchair with a dent exactly the shape of a Dark Lord. On the table: a crown of black iron, a quill, and a pamphlet. *Sunny Cottages of the Southern Shore.*",
          { if: 'grub_free', text: "Grub has followed you in and is pretending to be a coat stand in the corner. Malgrath either doesn't notice or doesn't care." },
          { speaker: 'Malgrath', say: "Sit, apprentice. Tomorrow at dawn, we take the Chosen One across the Skybridge to the top of the Spire. That's where the prophecy says it happens. It always happens at the top. Nobody ever has a final confrontation in a *basement*." },
          "He picks up the crown. Turns it in his hands. Puts it down again, like it's very heavy.",
          { speaker: 'Malgrath', say: "I'll be honest with you. I'm tired. Four thousand years of Chosen Ones. They all talk. They all quote. And afterward I have to rebuild the Spire, and the lava pipes, and re-hire all the spiders. I wonder sometimes whether I should simply... stop." },
        ],
        choices: [
          {
            text: 'Tell him: you should retire. You have earned it.',
            hint: 'The pamphlet is right there. With a cottage circled.',
            set: ['retire'],
            effect: bump(0, 1),
            art: '🏡',
            outcome: [
              { speaker: 'You', say: "Then stop, my Lord. You've done four thousand years. Nobody does four thousand years. You've earned the cottage." },
              "Malgrath stares into the fire. A log shifts. Then, very slowly, he slides the pamphlet across the table toward you and taps a cottage circled in red. It has roses. It has a bread oven.",
              { speaker: 'Malgrath', say: "I've always wanted to bake. You cannot bake *evil*, apprentice. I tried once. The loaf screamed. Bread is too honest." },
              "He clears his throat and puts his dread voice back on, like a coat. “Tell no one. Now go to bed. Big day. Destiny and so forth.”",
            ],
            next: 'bridge',
          },
          {
            text: 'Swear to defeat the Chosen One for him',
            hint: 'Loyal to the last. Grind her to dust. Metaphorically.',
            effect: bump(1, 0),
            art: '🗡️',
            outcome: [
              "You stand up straight and put your fist on your heart, the way they do in the paintings.",
              { speaker: 'You', say: "You won't fall tomorrow, my Lord. I'll make sure of it." },
              "Malgrath looks at you for a long time. Then he smiles, the thin, terrible smile that's on every wanted poster in the kingdom. But there's something else in it, too. Something almost fond.",
              { speaker: 'Malgrath', say: "Good. Good! That's the spirit. That's what I said to *my* master, once. Of course, then I threw him off the Spire and took his crown. Ha! Ha. Ah. Goodnight, apprentice." },
              "You leave, wondering whether that was a joke. Wondering whether it was advice.",
            ],
            next: 'bridge',
          },
          {
            text: 'Ask him to teach you the Voice of Dread',
            hint: 'The one that makes candles go out.',
            effect: bump(1, 0),
            art: '🗣️',
            outcome: [
              "Malgrath brightens like a lamp. Nobody has asked him to teach them anything in centuries.",
              { speaker: 'Malgrath', say: "Ah! The Voice! Breathe from the belly. Imagine your words are made of iron and you are dropping them down a well. Now. Say *kneel*." },
              "You say *kneel*. The fire flickers. Grub, if he's in the room, kneels by reflex. A spider in the corner kneels. Malgrath claps his hands, delighted, a sound like two coffin lids.",
              { speaker: 'Malgrath', say: "Marvellous. You'll make a fine Dark Lord one day. Better than me. I always overdid the cape." },
            ],
            next: 'bridge',
          },
        ],
      },

      /* ------------------------------------------------------------------ ACT 3: THE SKYBRIDGE */
      bridge: {
        scene: 'bridge',
        title: 'Dawn: The Skybridge over the Chasm',
        art: '🌉',
        mood: 'dawn',
        weather: 'ash',
        fx: 'shake',
        text: [
          "Dawn. The procession crosses the Skybridge: a thin stone bridge strung between the Spire and its highest tower, over the Chasm of Ultimate Drop. The chasm is so deep that there's a different weather system at the bottom.",
          (s) => s.has('pip_free')
            ? "You and Pip are halfway across, sneaking ahead of the dawn, when the bridge starts to shake."
            : "Malgrath leads the way in full armour. Pip follows in chains, still talking. You bring up the rear. Halfway across, the bridge starts to shake.",
          { if: 'grub_free', text: "Grub grabs your ankle with both hands. His soup bowl slides toward the edge. He lets it go. That's how you know it's serious." },
          "It's Mortimer. He was supposed to fly escort. Instead, he has landed *on* the bridge, all claws, wings wrapped around the stone, eyes squeezed shut, clinging like a cat on a curtain. The bridge was not built for a dragon. Cracks are racing across it toward your feet.",
          { speaker: 'Mortimer', say: "I LOOKED DOWN. WHY DID I LOOK DOWN. THERE'S A CLOUD DOWN THERE. THE CLOUD IS LOOKING AT ME." },
          "A chunk of bridge drops away behind you and falls for a very long time. A plume of smoke curls out of Mortimer's nostrils. He's going to panic. When Mortimer panics, things catch fire.",
        ],
        timer: 8,
        timeout: {
          text: 'You froze on the bridge.',
          art: '🔥',
          outcome: (s) => s.has('mortimer')
            ? [
              "You freeze. Mortimer's nostrils flare. His chest swells with the biggest sneeze in dragon history.",
              "And then he opens one eye and sees *you* standing there, the one who sat with him in the roost. With an enormous effort he swings his whole head sideways and sneezes over the edge. A river of fire pours into the chasm. Somewhere far below, a cloud is very surprised.",
              { speaker: 'Mortimer', say: "...Sorry. I aimed. I aimed for you. I mean AWAY from you. I aimed away from you!" },
              "He scoops everyone up in his claws and scrambles, shaking, the rest of the way across. You make it to the Spire. Barely.",
            ]
            : [
              "You freeze. Mortimer's nostrils flare. His chest swells. He looks wildly around for anything that isn't the drop, and the only thing that isn't the drop is you.",
              { speaker: 'Mortimer', say: "Oh no. Oh no, oh no, here it comes. HAAAH—" },
              "The sneeze is enormous. It is also on fire.",
            ],
          next: (s) => (s.has('mortimer') ? 'spire_stairs' : 'end_flambe'),
        },
        choices: [
          {
            text: 'Walk toward him and talk him down, gently',
            hint: 'Low voice. Soft words. Do not look down yourself.',
            art: '🫶',
            outcome: (s) => (s.has('mortimer') || s.get('heart') >= 3)
              ? [
                "You walk toward the dragon over a cracking bridge, which is the bravest and stupidest thing you've ever done. You put a hand on his snout.",
                { if: 'mortimer', text: [
                  { speaker: 'You', say: "Mortimer. Look at me. Not down. At me. Like in the roost. Remember the pickles?" },
                  "One huge golden eye cracks open. It finds you. The smoke stops.",
                  { speaker: 'Mortimer', say: "...The pickles. Jars of pickles. Not a monster. Just pickles. Okay. Okay okay okay." },
                ], else: [
                  { speaker: 'You', say: "Hey. Hey, big fella. Look at me. Not down. At me. Nobody's going to yell. Nobody's going to push. We'll just breathe." },
                  "He doesn't know you. But something in your voice gets through. One huge golden eye cracks open. The smoke slows.",
                  { speaker: 'Mortimer', say: "...Breathe. Okay. Breathing. I'm a dragon who is breathing. Okay okay okay." },
                ] },
                "Step by step, eyes locked on yours, he backs off the bridge onto the Spire landing. The cracks stop. Everyone breathes out at once. Grub, if he's here, cries a little.",
              ]
              : [
                "You walk toward the dragon, hands raised, talking in your calmest voice. The problem is that Mortimer has never really met you. Or, worse, he *has*, and the last time you came close, you tried to drag him off a ledge.",
                { speaker: 'Mortimer', say: "YOU! You're the EDGE one! Stay away! Stay AWAY from me—" },
                "He jerks his head back. His nostrils flare. You see the glow climbing up his long purple throat like a lantern being raised in a well.",
              ],
            effect: (s) => { if (s.has('mortimer') || s.get('heart') >= 3) bump(0, 1)(s); },
            next: (s) => ((s.has('mortimer') || s.get('heart') >= 3) ? 'spire_stairs' : 'end_flambe'),
          },
          {
            text: 'Leap onto his back and make him fly',
            hint: 'Ride a dragon. How often do you get the chance?',
            effect: bump(1, 0),
            art: '🐉',
            outcome: (s) => s.has('mortimer')
              ? [
                "You take a running start, plant your foot on his elbow and swing yourself onto Mortimer's neck. He squeaks. A dragon the size of a barn, squeaking.",
                { speaker: 'You', say: "We're going UP, Mortimer! Look UP! Only up! There's nothing up there but sky!" },
                "He trusts you. That's the thing. He looks up, unfolds his wings, and *flies*. He scoops up everyone on the bridge in his back claws as the stone behind you crumbles into the chasm, and soars, wobbling, toward the top of the Spire.",
                { speaker: 'Mortimer', say: "I'M FLYING! I'M FLYING AND I'M NOT LOOKING DOWN! I'M LOOKING AT A BIRD! HELLO BIRD!" },
              ]
              : [
                "You take a running start, plant your foot on his elbow and swing yourself onto Mortimer's neck. Which is when Mortimer, who is already as scared as a dragon can be, feels a stranger land on him out of nowhere.",
                "He bucks. He rears. His head whips round and he looks right at you, and his throat starts to glow orange, then yellow, then a very bright, very final white.",
              ],
            next: (s) => (s.has('mortimer') ? 'spire_stairs' : 'end_flambe'),
          },
          {
            text: 'Sprint past him for the far side',
            hint: 'Leave the dragon. Run. Run!',
            effect: bump(1, -1),
            art: '🏃',
            outcome: [
              "You run. The bridge splits under your feet. You jump a gap, then another, scrambling past Mortimer's flank as he whimpers. A slab you were standing on a second ago drops away into nothing.",
              (s) => s.has('pip_free')
                ? "Pip runs too, faster than you, and at the last gap she turns and grabs your wrist and hauls you over. “Verse Twenty,” she pants. “*The Chosen One shall cross the bridge.* Didn't say alone.”"
                : "You hit the far landing just as Malgrath does. He's holding Pip's chain in one hand. He's barely out of breath. Four thousand years of stairs.",
              "Behind you, Mortimer finally scrambles off the bridge, clawing up the side of the tower. Nobody's hurt. But you didn't look back. You notice that about yourself, and file it away.",
            ],
            next: 'spire_stairs',
          },
        ],
      },

      spire_stairs: {
        scene: 'castle',
        title: 'Morning: The Stair to the Top',
        art: '🌀',
        mood: 'gold',
        weather: 'sparkles',
        text: [
          "The last stair of the Ashen Spire winds up and up around the outside of the tower, with the whole kingdom spread out below and nothing but wind for a handrail.",
          "Halfway up, someone is sitting on the steps, eating a pear. It's Seraphine. She has no business being here. She looks like she's been waiting for an hour and has enjoyed every minute of it.",
          { speaker: 'Seraphine', say: "Ah, there you are. Lovely morning for a prophecy. The confrontation is at the top. They always are. People are so predictable. *I* should know, I predict them." },
          { if: 'scroll', text: "She looks pointedly at the scroll in your belt. Then at you. Then at the scroll again, the way a teacher looks at homework you haven't handed in." },
          { if: 'pip_sold', text: "She glances at Pip in her chains, and back at you. Her smile gets a tiny bit thinner." },
          { speaker: 'Seraphine', say: "Last chance for advice. I'm feeling generous. It happens about once a century, so do hurry." },
        ],
        choices: [
          {
            text: 'Ask her which side you should choose',
            hint: 'Good or evil? Just tell me.',
            effect: bump(0, 1),
            art: '❓',
            outcome: [
              { speaker: 'Seraphine', say: "Sides! Ha. You people and your sides. A coin has two sides and it's still just one coin. Choose what you can live with, apprentice. That's the only side there is." },
              "She takes another bite of pear and waves you on. You climb. You don't feel any more certain. But you feel, oddly, like you're allowed not to be.",
            ],
            next: 'final',
          },
          {
            text: 'Demand she change the prophecy in your favour',
            hint: 'She wrote it. She can rewrite it.',
            effect: bump(1, 0),
            art: '✍️',
            outcome: [
              { speaker: 'You', say: "You wrote it. Change it. Make it say I win." },
              "Seraphine laughs so hard she drops her pear. It bounces down the stairs for a very long time.",
              { speaker: 'Seraphine', say: "Oh, I *like* you. No. I don't write the future, dear. I just take dictation. Go on. Up you go. Try not to fall off anything. Or into anything. Or onto anyone." },
            ],
            next: 'final',
          },
          {
            text: 'Hold up the scroll. What is it waiting for?',
            hint: 'You know what it says. You do not know what it means.',
            if: 'scroll',
            effect: (s) => {
              const m = s.get('menace');
              const h = s.get('heart');
              if (m > h) s.setVar('menace', clamp(m - 1));
              else if (h > m) s.setVar('heart', clamp(h - 1));
            },
            art: '⚖️',
            outcome: [
              "You hold up the scroll. Seraphine's eyes light up like you've finally said the password.",
              { speaker: 'Seraphine', say: "Ah. Now you're asking the right question. The scroll isn't waiting for a *what*. It's waiting for a *who*. Someone who has walked in shadow and still kept a little light in their pocket. Not a hero. Not a villain. Someone in between, who freed whoever deserved freeing." },
              "She reaches out and flicks you on the forehead. It doesn't hurt. But something settles in your chest, like a set of scales finding its level.",
              { if: 'grub_free', text: "Grub tugs your sleeve. “She means me, doesn't she? I'm the one who got freed. I'm part of a *prophecy*.” He looks like he might explode with pride.", else: "You think of Grub, still in his cell with his bowl of soup. Something about that sits badly with the scroll. It feels heavier in your hand." },
            ],
            next: 'final',
          },
        ],
      },

      /* ------------------------------------------------------------------ FINALE */
      final: {
        scene: 'castle',
        title: 'High Noon: The Top of the Ashen Spire',
        art: '⚡',
        mood: 'storm',
        weather: 'embers',
        fx: 'flash',
        text: [
          "The top of the Spire is a round platform of black stone, open to the sky. Lightning crackles in the clouds above. This is where it always happens. There are scorch marks on the floor from four thousand years of it.",
          "Malgrath stands in the middle in his full armour, cape billowing, crown on his head. He looks magnificent. He also looks like he'd very much like to sit down.",
          (s) => s.has('pip_free')
            ? "Pip stands beside you, sword glowing, feather fluttering, chin up. She is shaking. Only you can see that."
            : "Pip's chains fall away at the top. They always do. Verse Thirty, apparently. She snatches up the Sword of Morning from where it has been waiting, glowing, on a pedestal.",
          { if: 'pip_sold', text: "She doesn't look at you. She hasn't looked at you since the guardroom." },
          { speaker: 'Pip', say: "Malgrath the Dread! *The Chosen One shall stand upon the Spire, and the Dark shall fall!* That's you. You're the Dark. Sorry. Destiny." },
          { speaker: 'Malgrath', say: "Yes, yes. *Defend me*, apprentice. Or don't. Make it quick, either way. I have... plans." },
          { if: 'retire', text: "He glances, just for a second, at the southern horizon. Toward the coast. Toward the sunny cottages." },
          { if: 'grub_free', text: "Grub is behind you, holding a ladle like a sword. He has no idea what's going on. He's ready anyway." },
          "Pip raises her sword. Malgrath raises his staff. The crown on his head flashes. Everyone in the world seems to be waiting for you. The lightning won't wait much longer.",
        ],
        timer: 10,
        timeout: {
          text: 'You hesitated at the top.',
          art: '🗡️',
          outcome: [
            "You hesitate. Just a second too long. Pip doesn't.",
            "She charges, sword blazing, and Malgrath, who has been doing this for four thousand years and is very, very tired, lets the sword knock the staff from his hand and sinks to one knee with a groan that might be relief.",
            "And then Pip turns around, sword still raised, and points it straight at you.",
          ],
          next: 'end_betrayed',
        },
        choices: [
          {
            text: 'Snatch the crown and claim the Spire yourself',
            hint: 'Every Dark Lord was an apprentice once.',
            effect: bump(1, 0),
            art: '👑',
            outcome: (s) => s.get('menace') >= 3
              ? [
                "You move faster than either of them. In one smooth motion you lift the iron crown off Malgrath's head and set it on your own. It is heavy. It is cold. It fits perfectly.",
                "You use the Voice. The one he taught you, or the one you taught yourself, the one with no hiccup in it at all.",
                { speaker: 'You', say: "**KNEEL.**" },
                "The lightning stops. Pip's sword goes dark. Malgrath, to his own astonishment, kneels. So does Pip. So does a passing crow.",
              ]
              : [
                "You lunge for the crown. You get your fingers on it. You lift it off Malgrath's head, set it on your own, and turn to face the Chosen One, ready to be terrible.",
                "The crown slides down over your eyes. It's about four sizes too big. You can't see. You hear Pip laugh.",
                { speaker: 'Pip', say: "Oh, *this* is perfect." },
              ],
            next: (s) => (s.get('menace') >= 3 ? 'end_darklord' : 'end_betrayed'),
          },
          {
            text: 'Stand beside Pip against your master',
            hint: 'Pick the side with the glowing sword.',
            effect: bump(0, 1),
            art: '🤝',
            outcome: (s) => s.get('heart') > s.get('menace')
              ? [
                "You walk across the platform and take your place at Pip's side. She glances at you. For once, she doesn't say anything. She just nods.",
                { speaker: 'Malgrath', say: "Ah. The apprentice turns. That's in the prophecy too, I suppose. It's *always* in the prophecy." },
                "Together, you raise your hands. Pip's sword blazes. Your three curses, your two cackles and every bit of courage you've scraped together in nine days come out all at once, and the Dark Lord's staff goes spinning off the edge of the Spire.",
              ]
              : [
                "You walk across the platform and take your place at Pip's side. Pip glances at you. Then she glances at your black apprentice robes, your scorched cuffs, the Dread sigil on your collar.",
                { if: 'pip_sold', text: "Then she remembers the guardroom. You watch her remember it." },
                "She smiles. It is not a nice smile. It's the smile of a seventeen-year-old who has just worked out how the ballad should end.",
              ],
            next: (s) => (s.get('heart') > s.get('menace') ? 'end_redeemed' : 'end_betrayed'),
          },
          {
            text: 'Lower your hands and ask Malgrath what he really wants',
            hint: 'You saw the pamphlet. Sunny Cottages.',
            if: 'retire',
            effect: bump(0, 1),
            art: '🏡',
            outcome: [
              "You don't raise your hands. You lower them. You step between them, right into the middle of four thousand years of scorch marks.",
              { speaker: 'You', say: "My Lord. What do you actually want? Not the prophecy. Not the Spire. *You*." },
              "The lightning stalls. Pip's mouth falls open mid-verse. Malgrath looks at you, and something very old and very tired in his face cracks right down the middle.",
              { speaker: 'Malgrath', say: "...A bread oven. A little garden. Roses. Possibly a cat. I want to *stop*, apprentice." },
              { speaker: 'Pip', say: "Wait. Wait wait wait. If he *quits*, does that count? Is that a defeat? Is that *in the prophecy*?" },
            ],
            next: 'end_bakery',
          },
          {
            text: "Unroll the Oracle's original scroll and read it aloud",
            hint: 'You know when. It is now.',
            if: CHOSEN_READY,
            fx: 'flash',
            art: '📜',
            outcome: [
              "You step into the centre of the platform and unroll Seraphine's scroll. The wind drops. The lightning holds its breath. You read it aloud, the real words, in Old Gloomish, the way they were written.",
              "*When the Dread grows weary and the soup is spilled, the one who is chosen shall walk in shadow, serve in shadow, free the small and the forgotten, and stand between the dark and the light, belonging to both.*",
              "Pip's sword stops glowing. Then, very slowly, a light starts glowing somewhere else. In your chest. Under your apprentice robes. Like a lantern being lit.",
              { speaker: 'Grub', say: "Soup was spilled! That was ME! I spilled the soup! I'm in it! I'm in the PROPHECY!" },
            ],
            next: 'end_chosen',
          },
        ],
      },

      /* ------------------------------------------------------------------ ENDINGS */
      end_darklord: {
        scene: 'throne',
        art: '👑',
        mood: 'blood',
        weather: 'embers',
        ending: { id: 'darklord', title: 'Long Live the Dread', type: 'neutral' },
        text: [
          "They hold the coronation a week later. It's a small affair. Twelve skeletons, a choir of bats, and Malgrath in the front row in a brand-new cardigan, clapping politely.",
          { if: 'retire', text: "He leaves the next morning for the south coast with a suitcase full of flour. He sends you a postcard every week. They always say the same thing: *The bread is honest. Hope the Dark is going well.*", else: "He stays on as a sort of Dark Lord Emeritus. He has opinions about your cape. He has opinions about everything. He seems happier than you've ever seen him." },
          (s) => s.has('pip_sold')
            ? "Pip Brightwater is still in the dungeon. You visit her sometimes. She's still talking. She's started a podcast, in a manner of speaking: she shouts her theories down the corridor and the skeletons write them down."
            : "Pip Brightwater went home to Lesser Puddling to *regroup*, she says. She's rewriting the prophecy with a quill and a great deal of underlining. You'll see her again. They always come back.",
          { if: 'grub_free', text: "Grub is your Chief of Staff now. The Orb of Unending Night still smells faintly of leeks. You've decided you like it that way.", else: "Somebody tells you Grub is still in the dungeon, waiting for the prophecy to be resolved. You wonder, for a moment, whether it was. Then a minion asks you a question, and you forget." },
          "You sit on the throne of black iron, nine feet tall. It's very cold. It's very high. From up here, everything looks small, including the people. You had nine days as an apprentice. You'll have, if you're lucky, four thousand years as this.",
          "Somewhere, a new Chosen One is being born on a Tuesday under a funny-shaped cloud. You'd better practise your cackle.",
        ],
      },

      end_redeemed: {
        scene: 'village',
        art: '🎉',
        mood: 'sunny',
        weather: 'sparkles',
        ending: { id: 'redeemed', title: 'Verse Thirty-One', type: 'good' },
        text: [
          "Lesser Puddling throws a feast. There's bunting. There's a goat in a party hat. There's a ballad, and you are in it, and it's not the second verse. It's the first.",
          { speaker: 'Pip', say: "I had them change it. *The Chosen One and the apprentice who chose.* It scans terribly. I love it." },
          "Malgrath, defeated and staffless, was given the traditional choice of exile or prison. He chose the south coast. You hear he's taken up gardening and is terrible at it, and has never been happier.",
          { if: 'grub_free', text: "Grub came with you. He runs the feast's soup tent. There's a queue all the way to the duck pond.", else: "Later, you realise you never went back for Grub. You go the next morning. He's still in his cell with his cushion, perfectly happy, and has made soup for the skeletons. You bring him home." },
          { if: 'mortimer', text: "Mortimer lives on a nice low hill now. A *very* low hill. He gives rides to children, at a height of no more than four feet. It's the most popular thing in the county." },
          "Pip still won't stop talking. You've discovered that you don't mind. You've discovered a lot of things. You were only a villain for nine days, after all. The rest of your life is wide open, and full of bunting.",
        ],
      },

      end_betrayed: {
        scene: 'village',
        art: '📯',
        mood: 'ember',
        ending: { id: 'betrayed', title: 'Not in the Ballad', type: 'bad' },
        text: [
          { speaker: 'Pip', say: "BEHOLD! The Chosen One has defeated the Dark! And captured the Dark Lord's wicked apprentice, his right hand, his EVIL FOOTNOTE!" },
          "That's how it goes in the ballad, anyway. In the ballad, Pip defeats Malgrath single-handed, in a fight that lasts three days and includes a scene with a lightning-bolt that definitely did not happen.",
          "In the ballad, you are captured. You're described as *cruel and cunning, with a cackle like a goose.* Which is the only accurate line.",
          (s) => s.has('pip_free')
            ? "You let her out of her cell. You crossed the bridge with her. None of that is in the ballad. Pip says it didn't scan."
            : "You thought it might go differently. You thought, at the very end, you might have changed your mind in time. Prophecies don't have room for people who change their minds halfway.",
          "You spend six months in the Lesser Puddling stocks while children throw cabbages. Then a year sweeping the Chosen One's victory hall. She visits sometimes, to sign autographs, and doesn't recognise you.",
          { if: 'grub_free', text: "Grub brings you soup through the bars every day. He thinks the ballad is rubbish. He's written his own version. It's mostly about soup, and you're the hero.", else: "On the long nights, you think about a goblin in a dungeon cell, stirring straw soup. You hope somebody let him out. You hope it was someone kinder than you were." },
        ],
      },

      end_flambe: {
        scene: 'bridge',
        art: '🔥',
        mood: 'ember',
        weather: 'ash',
        fx: 'redflash',
        ending: { id: 'flambe', title: 'Apprentice Flambé', type: 'death' },
        text: [
          "The fire is very hot and very fast and, to be fair to Mortimer, completely accidental.",
          "There's a flash of white. There's a noise like a giant blowing out a giant birthday cake. And then there's a little heap of ash on the Skybridge, a pair of smoking boots, and a dragon with his paws over his face going *sorry sorry sorry sorry.*",
          { speaker: 'Mortimer', say: "I didn't MEAN to. I just get so FRIGHTENED. Somebody should have SAT with me. Somebody should have just SAT with me." },
          (s) => s.has('pip_free')
            ? "Pip crosses the bridge alone. She reaches the Spire, defeats Malgrath, and in the ballad, the apprentice who freed her is described as *a brave soul who fell to the fire.* She insisted on that line. It's the only one in the whole song that doesn't scan, and the only one she never changes."
            : "Malgrath steps around your boots with great dignity and carries on toward the Spire, Pip in tow. He pauses only once, to say: “Shame. That one had promise. And excellent eyebrows. Well. *Formerly* excellent.”",
          "They put a little plaque on the Skybridge, later. *Here an apprentice met a dragon who was afraid of heights. Be kind to dragons. They are more frightened than you.*",
        ],
      },

      end_bakery: {
        scene: 'village',
        art: '🥖',
        mood: 'dawn',
        weather: 'sparkles',
        ending: { id: 'bakery', title: 'Bread and Dread', type: 'true' },
        text: [
          "Nobody wins, exactly. That's the beauty of it. Pip is announced as having *defeated the Dark* by causing its *voluntary early retirement*, which she says definitely counts. She's having it added to the prophecy. In a footnote. She's thrilled about being a footnote now.",
          "Malgrath hangs up his crown on the throne room wall, leaves the Spire to the spiders, and goes south. You go with him. Somebody has to carry the flour.",
          "The bakery is called **Bread & Dread**. It's in a little white cottage by the sea with roses round the door and a bread oven the size of a small dungeon. Malgrath kneads with the strength of four thousand years of pent-up frustration. His sourdough is the best on the coast. Nobody knows why it's slightly *menacing*. It just is.",
          { if: 'grub_free', text: "Grub runs the soup counter. *Soup of the Day: Leek and Potato. Soup of Every Day: Leek and Potato.* The queue goes out the door.", else: "On the first day, you go back north and break Grub out of the abandoned dungeon. He's been living quite happily on straw soup. He runs the soup counter now. The queue goes out the door." },
          { if: 'mortimer', text: "Mortimer lives in the field behind the bakery, on the ground, where he belongs, and lights the oven every morning with one very gentle, very careful sneeze." },
          { speaker: 'Malgrath', say: "Apprentice. The loaves have risen. Ha! Behold! They RISE! As the darkness once ROSE! ...Sorry. Old habits." },
          "He smiles at you over the counter, flour on his nose, and he doesn't look tired at all.",
        ],
      },

      end_chosen: {
        scene: 'dawn',
        art: '🌟',
        mood: 'gold',
        weather: 'sparkles',
        fx: 'flash',
        ending: { id: 'chosen', title: 'The Apprentice of Shadow', type: 'secret' },
        text: [
          "It was a mistranslation. That's all. One misplaced accent in Old Gloomish, four thousand years ago, and the word *apprentice* became the word *defeat*, and a whole kingdom spent four thousand years sending children to fight a tired old man at the top of a tower.",
          "The Chosen One was never meant to *defeat* the Dark. The Chosen One was meant to be its *apprentice*. To walk in shadow, and free the small and forgotten, and stand in between. And that, it turns out, is you.",
          { speaker: 'Seraphine', say: "Told them. Told them for *centuries*. Nobody ever reads the original." },
          "She's standing at the top of the stairs, eating a new pear, looking enormously pleased with herself.",
          { speaker: 'Pip', say: "So I'm... not chosen? I'm just... Pip? From Lesser Puddling? With a goat?" },
          { speaker: 'You', say: "You're the bravest person who ever walked into the Gauntlet of Woe on purpose. You don't need a prophecy for that." },
          "Pip thinks about this. Then she grins, the big smug grin, but softer around the edges. “I'm going to need a new brand,” she says. “Something with less destiny. *Pip Brightwater, Freelance Hero.* I'll get cards made.”",
          "Malgrath takes off his iron crown and hands it to you, and for the first time in four thousand years the prophecy is fulfilled properly: no one is defeated, no one is thrown off the Spire, and the Dark and the Light shake hands at the top of the tower while a goblin cheers so hard he falls over.",
          { speaker: 'Grub', say: "I SPILLED THE SOUP! I STARTED ALL OF IT! BEST DAY OF ME LIFE!" },
          "You don't put the crown on. You hang it on a hook by the door, next to Grub's soup ladle. The Ashen Spire becomes something new: half school, half sanctuary, a place where Dark Lords go to retire and Chosen Ones go to learn they don't have to be. You run it. Malgrath bakes. Mortimer, somehow, learns to fly at a sensible altitude.",
          "On the wall of the library, Seraphine pins up the original scroll, framed. Underneath, in fresh ink, she's added one new line in her own handwriting: *Told you so.*",
        ],
      },
    },
  });
})();
