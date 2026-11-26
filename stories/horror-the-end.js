/* MysteryFate story: The End (Probably) (horror) */
(function () {
  'use strict';

  // Secret: keep the drive-in ticket from the glovebox + learn how many takes there have been + refuse the final card.
  const secretReady = (s) => s.has('ticket') && s.has('counted_takes');

  // The crack lines, shown as the first beat of every choice after a fake ending breaks.
  const CRACK1 = [
    'The card hangs there a moment too long. Then a hairline crack runs straight through the word *Daylight*, and the sunrise behind it jerks — one frame, two — like film catching in a gate.',
    { if: (s) => s.found() >= 1, speaker: 'The End', say: 'Oh, you came *back*. You’ve seen how this ends, and you sat down and pressed play again. I adore you.' },
    { speaker: 'The End', say: 'You didn’t really think it was that easy.' },
  ];
  const CRACK2 = [
    'The card holds. Holds. Then it splits down the middle with a sound like a reel snapping, and the green sun stutters in the sky — up, down, up — as if somebody is scrubbing back and forth to find the good part.',
    { speaker: 'The End', say: 'Again? You keep *doing* that. Everyone else takes the first one.' },
  ];
  const CRACK3 = [
    'The card doesn’t crack this time. It *peels* — curling at the corners like film held too close to a bulb, blistering brown, bubbling — and behind it there is no sky at all. Just a white rectangle of light, and dust turning in it.',
    { speaker: 'The End', say: 'Fine. *Fine.* No more dawns. Let’s do this properly, then.' },
  ];

  registerStory({
    id: 'the-end',
    title: 'The End (Probably)',
    category: 'horror',
    tagline: 'You escaped at dawn. The credits rolled. Then the credits stopped.',
    description:
      'A weekend at a lakeside cabin. A tall thing in the trees. One long night — and then the sun comes up, the ranger’s truck arrives, and the ending card appears like it should. It just doesn’t stay. Something in this story loves endings very much, and it would like you to stay in one. Forever.',
    cover: '🎬',
    accent: '#e0b84f',
    ambient: 'horror',
    warning: 'Contains: stalking, time loops, being trapped, existential dread, mild peril. No gore.',
    remembers: true,
    vars: {},
    flags: [],
    scene: 'forest',
    voices: {
      narrator: { gender: 'female', pitch: 0.9, rate: 0.95, accent: 'en-US', note: 'late-night creature-feature host, dry and conspiratorial' },
      'Jess': { gender: 'female', pitch: 1.2, rate: 1.15, accent: 'en-AU', note: 'your best friend, horror-movie nerd, wisecracks when scared' },
      'Ranger': { gender: 'male', pitch: 0.85, rate: 1.0, accent: 'en-US', note: 'folksy park ranger, warm, a little too rehearsed' },
      'The Extra': { gender: 'male', pitch: 0.6, rate: 0.8, volume: 0.6, accent: 'en-IE', note: 'the tall thing in the trees, hoarse whisper, tired, sad' },
      'The End': { gender: 'neutral', pitch: 0.45, rate: 0.75, accent: 'en-GB', note: 'velvet cinema-usher voice, amused, adoring, possessive' },
    },
    start: 'intro',
    scenes: {
      // ------------------------------------------------------------------ TAKE 1
      intro: {
        title: 'Friday — 7:48 PM, Pinehollow Road',
        stamp: (s) => (s.found() >= 1 ? 'Take 1 (again)' : 'Take 1'),
        art: '🚗🌲',
        mood: 'forest',
        scene: 'forest',
        text: [
          'The engine coughs, shudders, and dies at the bottom of the cabin drive, and the headlights fade to two dim orange smudges on the pines.',
          { speaker: 'Jess', say: 'Every horror movie you’ve ever seen starts like this.' },
          'Your best friend Jess says it with a grin, but she doesn’t get out of the car. Neither do you. The cabin is a quarter-mile up the hill. No phone signal. The lake is a black coin through the trees.',
          'Above the tree line, against the last of the light, you can just make out the skeleton of something enormous: a huge, blank, rectangular frame, peeling white. An old drive-in movie screen, rotting in the woods.',
          { if: (s) => s.found() >= 1, text: 'You have the strangest feeling you’ve sat in this car before. That you know what Jess is going to say next. She says it.' },
          { speaker: 'Jess', say: 'Okay. Rules. Nobody splits up, nobody says “I’ll be right back”, and nobody goes in the basement.' },
          'Before you go, you should take something from the car.',
        ],
        choices: [
          {
            text: 'Take the old ticket stub from the glovebox.',
            hint: 'It’s been rattling around in there since you bought the car.',
            set: ['ticket'],
            art: '🎟️',
            outcome: [
              'Under the registration papers, a stiff little rectangle of yellowed card: **STARLITE DRIVE-IN · ADMIT ONE · FINAL NIGHT · OCT 31 1987.**',
              'You look up at the dead screen above the trees. Same name, painted in peeling letters along the top. *STARLITE.* You have never been here before in your life. You put the stub in your shirt pocket anyway.',
              { speaker: 'Jess', say: 'Cool, a cursed artefact. Love that for us.' },
            ],
            next: 'cabin',
          },
          {
            text: 'Take the big flashlight.',
            hint: 'Four D-cells. It could stun a deer.',
            set: ['flashlight'],
            art: '🔦',
            outcome: [
              'The flashlight weighs as much as a brick and throws a beam like a lighthouse. You sweep it across the trees as you climb the drive.',
              'For one sweep, between two trunks, the beam catches something tall standing very still. On the next sweep it’s gone. You decide not to mention it. Jess grabs your sleeve, so she saw it too.',
            ],
            next: 'cabin',
          },
          {
            text: 'Start filming on your phone.',
            hint: 'If something happens, at least there’ll be footage.',
            set: ['filming'],
            art: '📱',
            outcome: [
              'You hit record. *“Day one,”* you narrate in a spooky voice, *“and our heroes ignore every warning sign.”* Jess flips off the camera, laughing.',
              'Later, you’ll scroll back through this clip and notice the thing standing in the trees behind her. In the clip, it is looking straight into the lens. Waving.',
            ],
            next: 'cabin',
          },
        ],
      },

      cabin: {
        title: 'Friday — 10:30 PM, The Cabin',
        art: '🏚️📺',
        mood: 'candle',
        scene: 'cottage',
        text: [
          'The cabin smells of cedar and mouse. You get the stove going. Jess finds a box of board games with all the pieces missing. For two hours, it is a perfectly nice weekend.',
          'Then the old television in the corner turns itself on.',
          'Static. Then a title card, white letters on black, wobbling the way old film wobbles: **THE END (PROBABLY)**. Then static again.',
          { speaker: 'Jess', say: 'Okay. Okay, that’s funny. That’s a funny thing for a TV to do.' },
          'Three knocks at the front door. Slow. Polite. Like someone who has all night.',
          'Under the rug by the stove, the edge of a trapdoor. You noticed it earlier. You promised not to notice it.',
        ],
        choices: [
          {
            text: 'Open the front door.',
            hint: 'You’re not hiding from a knock.',
            art: '🚪',
            outcome: [
              'You throw the door open. Nobody on the porch. Just the dark, and the trees, and a smell of hot dust, like an old projector warming up.',
              'Down at the tree line, something tall straightens up and walks into the woods. Not running. *Inviting.*',
              { speaker: 'Jess', say: 'We are absolutely not following that.' },
              'You are already on the porch steps.',
            ],
            next: 'woods',
          },
          {
            text: 'Go down through the trapdoor.',
            hint: 'Jess said not to go in the basement. Jess says a lot of things.',
            art: '🕳️',
            outcome: [
              'You haul the rug aside and heave the trapdoor up. Wooden steps go down into a smell of damp and old plastic.',
              { speaker: 'Jess', say: 'I literally made one rule.' },
              'She follows you down anyway, holding the back of your shirt.',
            ],
            next: 'cellar',
          },
          {
            text: 'Unplug the television.',
            hint: 'Deal with the weird thing you can actually reach.',
            set: ['saw_tv'],
            art: '🔌',
            outcome: [
              'You yank the plug out of the wall. The screen stays on.',
              'The static clears, and now it shows the cabin from outside, through the front window. You can see yourself on the screen, holding the plug. Behind you on the screen, Jess. Behind Jess, *in the room*, a tall shape with a face like a paused tape.',
              'You spin round. Nothing. The back door is swinging open, and wet footprints lead out into the woods.',
            ],
            next: 'woods',
          },
        ],
      },

      cellar: {
        title: 'Friday — 11:02 PM, The Cellar',
        art: '📼📼',
        mood: 'night',
        scene: 'basement',
        text: [
          'One bare bulb. Pipes. And shelves — floor-to-ceiling metal shelves of VHS tapes in plain black cases.',
          'Every one has the same label, in handwriting. *DAYLIGHT.* *DAYLIGHT.* *DAYLIGHT.* Row after row of them.',
          'You pick one up. Your stomach drops. The handwriting on the label is yours. The little hook on the *y*. The way you cross the *t* too high.',
          { speaker: 'Jess', say: 'Who would — that’s your writing. Why is that your writing?' },
          'Above you, the floorboards creak. Something is walking across the cabin, slowly, towards the trapdoor.',
        ],
        choices: [
          {
            text: 'Count them. You need to know how many.',
            hint: 'Fast. Run your finger along the spines.',
            set: ['counted_takes'],
            art: '🔢',
            outcome: [
              'You run your finger along the shelves, lips moving. Forty-four. Forty-five. Forty-six.',
              '*Forty-six tapes called Daylight.* And at the end of the last shelf, an empty gap, exactly one tape wide. Waiting.',
              'The footsteps stop directly over your head. You and Jess go out through the cellar’s storm door at a dead run.',
            ],
            next: 'boathouse',
          },
          {
            text: 'Shove one into the old VCR and press play.',
            hint: 'There’s a TV down here too. Of course there is.',
            set: ['watched_tape'],
            art: '▶️',
            outcome: [
              'Tracking lines. Then a road at sunrise. A ranger’s truck. And *you* — wrapped in a blanket, smiling, climbing into the passenger seat while the sun comes up gold.',
              'It is a lovely shot. It loops. You climb in. You climb in. You climb in. On the tape, your smile never changes. Not once. Not even a little.',
              'Jess hits eject so hard the machine cracks. Overhead, the footsteps start to run. You both bolt out through the storm door.',
            ],
            next: 'boathouse',
          },
          {
            text: 'Pocket one and get out.',
            hint: 'Evidence. Or a souvenir. Decide later.',
            set: ['took_tape'],
            art: '🎞️',
            outcome: [
              'You grab the nearest tape and stuff it into your jacket. It is warm, like something that has just been switched off.',
              'You and Jess go up the storm-door steps and out into the night. Behind you, the trapdoor opens. You don’t look back to see who looks down.',
            ],
            next: 'boathouse',
          },
        ],
      },

      woods: {
        title: 'Friday — 11:15 PM, The Pines',
        art: '🌲👤🌲',
        mood: 'forest',
        scene: 'forest',
        fx: 'heartbeat',
        text: [
          'The woods close behind you like a curtain. Jess is a step behind, swearing quietly and continuously.',
          'Thirty yards ahead, it waits for you. Tall — too tall, by a head — in a jacket exactly like yours. Where its face should be, there is a blur: the smeared grey of a paused videotape, shivering.',
          { if: 'saw_tv', text: 'The face from the television. It was in the room with you.' },
          'It lifts one long arm, and points. Not at you. *Past* you — up the hill, at the dead drive-in screen above the trees.',
          'Then it starts walking towards you.',
        ],
        choices: [
          {
            text: 'Grab Jess and run for the lake.',
            hint: 'Downhill. Away from it. Toward the boathouse.',
            art: '🏃',
            outcome: [
              'You grab Jess’s wrist and run. Branches whip your face. Behind you, its footsteps keep exactly the same unhurried pace, and somehow never fall behind.',
              'The trees open onto the shore. The lake is flat as a screen.',
            ],
            next: 'boathouse',
          },
          {
            text: 'Hit it in the face with the flashlight beam.',
            hint: 'Four D-cells. Let’s see it smile through that.',
            if: 'flashlight',
            art: '🔦',
            fx: 'flash',
            outcome: [
              'You snap the beam full into its blurred face. The blur *flickers* — and for one instant, inside the static, you see a face. Tired, young, frightened. Your age. It throws up an arm as if the light hurts.',
              'Then it’s gone, folded back into the trees, and you hear it whisper from somewhere behind you: *“Don’t take the dawn.”*',
              'You and Jess run for the lake.',
            ],
            next: 'boathouse',
          },
          {
            text: 'Keep filming. Zoom in on its face.',
            hint: 'Your hands are shaking, but the phone has stabilisation.',
            if: 'filming',
            set: ['counted_takes'],
            art: '📱',
            outcome: [
              'You zoom. On the screen of your phone, the blur resolves. Not into a face — into a little black-and-white board held up in front of where a face should be. A clapperboard. Chalk letters:',
              '**THE END (PROBABLY) · SCENE 1 · TAKE 47.**',
              'Forty-seven. You lower the phone. Without the screen in front of it, it’s only a blur again, and it’s much closer. You run for the lake.',
            ],
            next: 'boathouse',
          },
          {
            text: 'Shout at it: “What do you want?”',
            hint: 'Make it answer.',
            art: '🗣️',
            outcome: [
              'Your voice cracks halfway. The thing stops.',
              'It answers in a hoarse whisper that seems to come from right beside your ear: *“To go home. Same as you. Don’t take the dawn.”*',
              'Jess screams, a proper movie scream, and you both run downhill for the lake.',
            ],
            next: 'boathouse',
          },
        ],
      },

      boathouse: {
        title: 'Saturday — 3:10 AM, The Lake',
        enter: { unset: ['saw_tv', 'flashlight', 'filming'] },
        art: '🛶🌙',
        mood: 'night',
        scene: 'sea',
        text: [
          'The boathouse leans over the water on rotten stilts. One canoe, one paddle, a coil of rope. On the far shore, a mile across the flat black water, the lights of the county road.',
          { if: 'counted_takes', text: 'Forty-seven. The number sits in your head like a stone.' },
          { if: 'watched_tape', text: 'You keep seeing it: your own face on the tape, climbing into the truck, smiling that smile that never changes.' },
          'On the end of the dock, standing on the water side, it waits. It hasn’t moved. It doesn’t need to. It was here before you.',
          { speaker: 'Jess', say: 'Rule two. When the monster is between you and the boat, you do not go to the boat.' },
        ],
        choices: [
          {
            text: 'Get Jess into the canoe and paddle for the far shore.',
            hint: 'It’s on the dock. You’re faster on water than it is. Probably.',
            set: ['canoe'],
            art: '🛶',
            outcome: [
              'You drag the canoe off its rack and shove it into the water past the end of the dock. It doesn’t reach for you. It just turns its blurred head and watches you go.',
              'Halfway across, the lake goes perfectly still — no ripple from your paddle, no wake — like you’re painted onto it. Then the far shore is there, and you’re scrambling up the bank toward the road.',
            ],
            next: 'chase',
          },
          {
            text: 'Run the shore path through the trees.',
            hint: 'The long way round. Feet on the ground.',
            art: '🌲',
            outcome: [
              'You take the path around the lake, Jess half a step behind. Roots, mud, the smell of pine. Twice you hear its footsteps keeping pace on the other side of a bush.',
              'It never catches up. It never falls behind. By the time you reach the road, the sky to the east has gone the grey of a dead TV.',
            ],
            next: 'chase',
          },
          {
            text: 'Walk out onto the dock and face it.',
            hint: 'You’re tired of running from something that won’t catch you.',
            art: '🧍',
            outcome: [
              'You walk to the end of the dock. Up close, it smells of hot dust and old popcorn. The blur where its face should be is humming, very faintly, like a fluorescent tube.',
              { speaker: 'The Extra', say: 'You’ll get to the road. You always get to the road. At dawn a truck comes. Don’t get in it.' },
              'Then it steps backwards off the dock and sinks into the black water without a splash. You and Jess take the canoe, and nothing follows.',
            ],
            next: 'chase',
          },
        ],
      },

      chase: {
        title: 'Saturday — 5:41 AM, County Road 9',
        art: '🛣️🏃',
        mood: 'fog',
        scene: 'forest',
        fx: 'heartbeat',
        timer: 8,
        text: [
          'The road. Asphalt under your feet, a broken white line, the trees black on both sides. The sky is getting lighter. You’ve almost done it.',
          'Then the footsteps behind you speed up for the first time all night.',
          'You look back. It’s coming down the middle of the road, fast now, long arms swinging, the blur of its face flaring white like a screen with nothing on it.',
          'Ahead, around the bend: headlights. A truck. A green ranger’s truck, coming slowly with its yellow light turning.',
          { speaker: 'Jess', say: 'Car! CAR! Go go go go —' },
        ],
        timeout: {
          art: '🖐️',
          outcome: [
            'You freeze, and its fingers brush the back of your neck — cold and dry, like a film strip.',
            'Then the sun breaks over the hill, and the touch is gone. You hear it whisper as it fades: *“Not yet. You haven’t even got to the good part.”*',
            'The truck pulls up beside you. A door opens.',
          ],
          next: 'dawn1',
        },
        choices: [
          {
            text: 'Sprint for the headlights, waving your arms.',
            hint: 'Flag it down. Get in. Get gone.',
            art: '🙌',
            outcome: [
              'You run straight down the middle of the road, screaming and waving. The truck brakes hard. Behind you, the footsteps stop dead, as if they’ve hit a wall of light.',
              'The sun comes up over the hill. Just like that. Just like in the movies.',
            ],
            next: 'dawn1',
          },
          {
            text: 'Dive into the ditch with Jess and hide.',
            hint: 'Let it run past. Let the truck come to you.',
            art: '🫣',
            outcome: [
              'You pull Jess down into the wet ditch and press your faces into the grass. Its footsteps pound past, inches from your heads — and then fade, as the sky turns gold.',
              'When you climb out, the truck has stopped right beside you, engine idling, as if it was always going to stop exactly there.',
            ],
            next: 'dawn1',
          },
          {
            text: 'Turn and stand between it and Jess.',
            hint: 'If it gets anyone, it gets you.',
            set: ['stood_ground'],
            art: '🛡️',
            outcome: [
              'You turn around and plant your feet. It comes on, faster, faster — and stops a yard from your face. The blur ripples. For a moment you hear, from inside it, the clatter of a projector.',
              'The sun clears the hill. The light hits it, and it simply isn’t there anymore. Behind you, a truck door opens.',
            ],
            next: 'dawn1',
          },
        ],
      },

      // ---------------------------------------------------- FAKE ENDING 1
      dawn1: {
        title: 'Saturday — 6:02 AM, Sunrise',
        art: '🌅🛻',
        mood: 'dawn',
        scene: 'dawn',
        weather: 'dust',
        fakeEnding: { title: 'Daylight', type: 'good' },
        text: [
          'The ranger is a big, kind man with a grey moustache and a thermos of coffee. He wraps a scratchy wool blanket around your shoulders and another around Jess, and he doesn’t ask a single question you can’t answer.',
          { speaker: 'Ranger', say: 'Easy now. You’re safe. Sun’s up. Nothing in those woods follows you past the sun.' },
          'Jess climbs into the cab first. She is laughing and crying at the same time, the way you do when it’s over. You stand in the road for a second and let the light hit your face. It is warm. It is gold. The birds are starting up.',
          { if: 'stood_ground', text: 'You turned around and faced it. You’ll be proud of that for the rest of your life.' },
          { if: 'canoe', text: 'Down the hill, the lake is shining like a sheet of new metal. The canoe drifts empty in the middle, turning slowly.' },
          'Behind you, the trees are just trees. Above them, the old drive-in screen catches the sunrise and glows a soft, clean white.',
          'You made it. You both made it. The ranger opens the passenger door for you and the radio is playing something warm and old, and you think: *I am going to sleep for a week.*',
        ],
        choices: [
          {
            text: 'Get in the truck anyway. An ending is an ending.',
            hint: 'Whatever that was, the sun is up and the door is open.',
            art: '🛻',
            outcome: [
              ...CRACK1,
              'You blink. The crack is gone. The sun is gold again, the ranger is smiling, and the door is open. Maybe you imagined it. You’re very tired.',
              'You climb in.',
            ],
            next: 'end_last_frame',
          },
          {
            text: 'Run. Back into the trees.',
            hint: 'You don’t trust a sunrise that skips.',
            art: '🌲',
            outcome: [
              ...CRACK1,
              'You drop the blanket and run. Behind you, the ranger calls your name — once, twice — in exactly the same tone both times.',
              'The trees close over you, and the light goes with them, all of it at once, like somebody hit *rewind*.',
            ],
            next: 'take2_cabin',
          },
          {
            text: 'Ask the ranger what day it is.',
            hint: 'Just to be sure.',
            set: ['asked_ranger'],
            art: '📅',
            outcome: [
              ...CRACK1,
              'You turn to the ranger. *“What day is it?”*',
              { speaker: 'Ranger', say: 'Easy now. You’re safe. Sun’s up. Nothing in those woods follows you past the sun.' },
              'You ask again. He says it again. Exactly the same. Same breath, same smile, same little twitch at the corner of the moustache. Inside the cab, Jess has stopped laughing. She’s just sitting there, smiling at the windscreen.',
              'The sunrise goes backwards. The sky drains from gold to grey to black, and you are walking up a cabin drive in the dark.',
            ],
            next: 'take2_cabin',
          },
        ],
      },

      // ------------------------------------------------------------------ TAKE 2
      take2_cabin: {
        title: 'Friday — 10:30 PM, The Cabin',
        stamp: 'Take 2',
        jump: 'glitch',
        art: '🏚️📺',
        mood: 'candle',
        scene: 'cottage',
        enter: { set: ['take2'], unset: ['canoe', 'stood_ground'] },
        text: [
          'Cedar and mouse. The stove is lit. Jess is sitting cross-legged by the board games with all the pieces missing, and she looks up at you as you come in.',
          { speaker: 'Jess', say: 'Every horror movie you’ve ever seen starts like this.' },
          'She’s said it in the wrong place. That line was in the car. She doesn’t seem to notice. She says it brightly, word for word, the same little grin.',
          'The colours are wrong. Not much. The firelight is a fraction too orange, like an old print that’s faded in the can. On the TV, the title card is already up: **THE END (PROBABLY)**.',
          { if: 'asked_ranger', text: 'You can still hear the ranger saying *Sun’s up* — the same breath, the same smile.' },
          'Three knocks at the door. Slow. Polite. You knew they were coming. You could have counted them in.',
        ],
        choices: [
          {
            text: 'Say Jess’s next line before she can.',
            hint: 'You know it. Rule one. Nobody splits up.',
            set: ['jess_awake'],
            art: '🎭',
            outcome: [
              'Jess opens her mouth. You get there first: *“Okay. Rules. Nobody splits up, nobody says ‘I’ll be right back’, and nobody goes in the basement.”*',
              'Jess freezes, mouth still open. Her face *buffers* — a stutter, a smear — and then her eyes are suddenly, horribly, her own.',
              { speaker: 'Jess', say: 'Wait. We did this. We *did* this. The truck — I got in the truck — why did I get in the truck?' },
              'The knocking stops. Something outside is listening. You grab her hand and go out the back door into the woods.',
            ],
            next: 'take2_woods',
          },
          {
            text: 'Go straight to the cellar.',
            hint: 'The tapes. Something has changed down there. You know it.',
            art: '📼',
            outcome: [
              'You rip the rug back and haul up the trapdoor.',
              { speaker: 'Jess', say: 'I literally made one rule.' },
              'Same words. Same eye-roll. She follows you down, holding the back of your shirt, exactly as before.',
            ],
            next: 'take2_cellar',
          },
          {
            text: 'Open the door before the third knock.',
            hint: 'Get ahead of the script.',
            art: '🚪',
            outcome: [
              'Knock. Knock. You yank the door open before the third.',
              'It is standing right there on the porch, much closer than last time, its hand raised to knock. It looks — you could swear it looks — startled.',
              'Then it turns and lopes away into the trees, and this time it doesn’t walk. It runs, as if it wants you to keep up. You follow.',
            ],
            next: 'take2_woods',
          },
        ],
      },

      take2_cellar: {
        title: 'Friday — 11:02 PM, The Cellar',
        stamp: 'Take 2',
        enter: { unset: ['asked_ranger'] },
        art: '📼📼📼',
        mood: 'night',
        scene: 'basement',
        text: [
          'The same bulb. The same shelves. *DAYLIGHT. DAYLIGHT. DAYLIGHT.* In your handwriting.',
          {
            if: (s) => s.has('counted_takes') || s.has('watched_tape') || s.has('took_tape'),
            text: 'But the gap at the end of the last shelf has been filled. A new tape, its label fresh and glossy: *DAYLIGHT (AGAIN).* The case is still warm.',
            else: 'At the end of the last shelf, one tape has a fresh, glossy label that’s different from the others: *DAYLIGHT (AGAIN).* The case is still warm.',
          },
          { if: 'took_tape', text: 'You check your jacket. The tape you stole last time is still there. Its label has changed. It says *YOU KEPT ME*. That is not funny.' },
          'Jess stands at the bottom of the steps with her arms wrapped around herself, humming the song from the ranger’s radio. She doesn’t know she’s doing it.',
        ],
        choices: [
          {
            text: 'Count them. All of them. Properly.',
            hint: 'Last time you didn’t want to know. Now you need to.',
            set: ['counted_takes'],
            art: '🔢',
            outcome: [
              'Forty-five. Forty-six. *Forty-seven.*',
              'Forty-seven tapes. Forty-seven dawns. Forty-seven times you climbed into that truck and smiled. And this, right now, cold in the cellar, is the forty-seventh time you’ve stood here and counted.',
              'Your own voice, from inside the shelves, very faint, counting along with you.',
            ],
            next: 'dawn2',
          },
          {
            text: 'Play the new tape for Jess.',
            hint: 'She needs to see it. She needs to wake up.',
            set: ['jess_awake'],
            art: '▶️',
            outcome: [
              'The VCR swallows the tape. On the screen: the road, the sunrise, the truck. Jess in a blanket climbing in, laughing and crying. Then you. Then the shot jumps — and it’s Jess again, climbing in. And again. And again.',
              'Beside you, the real Jess has stopped humming. She is staring at herself on the screen with her hand over her mouth.',
              { speaker: 'Jess', say: 'That’s me. How many times is that me?' },
              'You don’t answer. You take her hand, and you go out through the storm door together, and you don’t let go.',
            ],
            next: 'dawn2',
          },
          {
            text: 'Pull the shelves over.',
            hint: 'You’re done being an archive.',
            set: ['wrecked_tapes'],
            fx: 'shake',
            art: '💥',
            outcome: [
              'You throw your weight against the nearest shelf. It tips, and takes the next one with it, and the whole cellar comes down in a roaring landslide of black plastic.',
              'Cases split. Tape spills everywhere in glossy brown ribbons. And from every broken cassette, at once, very small, comes the same tinny sound: a ranger saying *Sun’s up.*',
              'Somewhere above you, something laughs. You run.',
            ],
            next: 'dawn2',
          },
        ],
      },

      take2_woods: {
        title: 'Friday — 11:15 PM, Behind the Pines',
        stamp: 'Take 2',
        enter: { unset: ['asked_ranger'] },
        art: '🌲🪵🎬',
        mood: 'forest',
        scene: 'forest',
        fx: 'heartbeat',
        timer: 8,
        text: [
          'You take a wrong turn on purpose, off the path, into trees you didn’t walk through last time — and your shoulder hits one, and it *wobbles*.',
          'It’s plywood. A painted flat on a wooden brace. So is the next one. The whole forest, this deep in, is scenery: cut-out pines, painted bark, a sandbag on every brace.',
          'Behind the flats, in a clearing of mud and old car speakers on poles, stands the Starlite Drive-In screen. Up close it is the size of a house. And it is showing *you*, live, from behind — a tiny figure standing in a fake forest, looking up.',
          'Then the tall thing steps out from between two flats, right beside you. It is breathing hard. So are you.',
          { if: 'jess_awake', speaker: 'Jess', say: 'Talk to it. It’s been trying to tell us something all night.' },
        ],
        timeout: {
          art: '✂️',
          outcome: [
            'You stand there one beat too long — and up on the giant screen, a huge pair of scissors comes down across the frame.',
            { speaker: 'The End', say: 'Oh, this part *drags*. Let’s tighten it up.' },
          ],
          next: 'end_cut',
        },
        choices: [
          {
            text: 'Talk to it. Ask who it is.',
            hint: 'It told you not to take the dawn. Maybe it knows why.',
            set: ['warned', 'counted_takes'],
            art: '👤',
            outcome: [
              'Up close, the blur over its face isn’t a face at all. It’s a frame of film, stuck, flickering on the same instant over and over.',
              { speaker: 'The Extra', say: 'I came up here with a friend, too. Long time ago. I took the dawn. The first one. Got in the truck. Smiled.' },
              { speaker: 'The Extra', say: 'The End doesn’t kill you. It *keeps* you. Every ending is a room it locks. I got a part instead, after a while. Somebody has to walk in the trees.' },
              { speaker: 'The Extra', say: 'This is take forty-seven. The booth is behind the screen. Don’t take the dawn.' },
            ],
            next: 'dawn2',
          },
          {
            text: 'Run for the road. Get to the truck first this time.',
            hint: 'Beat the script to its own ending.',
            art: '🏃',
            outcome: [
              'You crash back through the flats, knocking them flat behind you like dominoes. Ahead, between the real trees, the sky is already going grey. Already. It isn’t even midnight.',
              'The night skips. You feel it skip, like a heel coming down on a stair that isn’t there.',
            ],
            next: 'dawn2',
          },
          {
            text: 'Climb up behind the screen.',
            hint: 'Every screen needs a projector. Find out who’s running it.',
            art: '🪜',
            outcome: [
              'There’s a service ladder on the back of the screen frame. You climb ten rungs and see it, across the lot: a squat concrete projection booth with one small square window, and a beam of white light pouring out of it.',
              'In the booth window, a silhouette. Not a person. A reel — a huge film reel, turning, and turning, and turning.',
              'Then the beam swings and hits you full in the eyes, and the world goes gold, and you smell coffee and hear birds.',
            ],
            next: 'dawn2',
          },
        ],
      },

      // ---------------------------------------------------- FAKE ENDING 2
      dawn2: {
        title: 'Saturday — 6:02 AM, Sunrise',
        stamp: 'Take 2',
        art: '🌅🛻',
        mood: 'toxic',
        scene: 'dawn',
        weather: 'dust',
        enter: { unset: ['watched_tape', 'took_tape'] },
        fakeEnding: { title: 'Daylight', type: 'good', note: 'Ending 1 of 1 · thank you for staying', hold: 3600 },
        text: [
          'The road. The truck. The ranger with the grey moustache and the thermos of coffee, wrapping the same scratchy blanket around your shoulders.',
          { speaker: 'Ranger', say: 'Easy now. You’re safe. Sun’s up. Nothing in those woods follows you past the sun.' },
          'The sun is up. It is a little green. Just a little, round the edges, the way an old photograph goes green in a damp drawer. Nobody mentions it.',
          'The birds are singing. The same four notes. The same four notes. The same four notes.',
          {
            if: 'jess_awake',
            text: 'Jess climbs into the cab first. Halfway in, she stops, one foot on the step, and her face fights itself — and then she sits down anyway, smiling at the windscreen. Her lips move. *Find me*, she says, without a sound.',
            else: 'Jess climbs into the cab first. She is laughing and crying at the same time, the way you do when it’s over. Exactly the way. The same breath in the same place.',
          },
          { if: 'wrecked_tapes', text: 'There is brown film tape wound round the truck’s aerial, fluttering in a breeze you can’t feel.' },
          'You made it. You both made it. The ranger opens the door for you, and the radio is playing something warm and old, and it is the most beautiful morning you have ever seen, and you have seen it before.',
        ],
        choices: [
          {
            text: 'Get in. Please let this be the real one.',
            hint: 'You’re so tired. It’s so warm.',
            art: '🛻',
            outcome: [
              ...CRACK2,
              { speaker: 'The End', say: 'No, no, you’re right. Get in. This one’s lovely. I made it just for you.' },
              'You climb in beside Jess. The seat is warm, as if someone has only just got up from it.',
            ],
            next: 'end_last_frame',
          },
          {
            text: 'Look closer at the ranger’s face.',
            hint: 'Something’s wrong with it. You know it.',
            art: '🔍',
            outcome: [
              ...CRACK2,
              'You step right up to the ranger and look at him. *Really* look. His moustache is painted on. Not drawn — *painted*, in thick careful strokes, like a mural. Up close, his eyes are two dots of light, like holes in a sheet with a lamp behind.',
              { speaker: 'Ranger', say: 'Easy now. You’re safe. Sun’s up —' },
              'You put your hand flat against his chest, and it goes straight through, into warm white light. The road tips. The sky folds up like a card. You fall forward into the light.',
            ],
            next: 'take3',
          },
          {
            text: 'Pull Jess back out of the cab.',
            hint: 'Not this time. Not her.',
            set: ['pulled_jess'],
            art: '✊',
            outcome: [
              ...CRACK2,
              'You lunge for the cab door and grab Jess by the arm. Her skin is warm and smooth and flat — like grabbing a photograph. She keeps smiling at the windscreen.',
              'You pull. Something tears, like paper. You are holding a strip of film, a few inches long, and every frame on it is Jess, laughing.',
              'The truck, and the ranger, and Jess, all flicker once — and go white. Like a screen when the reel runs out.',
            ],
            next: 'take3',
          },
        ],
      },

      // ------------------------------------------------------------------ TAKE 3
      take3: {
        title: '??:?? — The Starlite Drive-In',
        stamp: 'Take 3',
        jump: 'glitch',
        art: '🎬🚗',
        mood: 'neon',
        scene: 'void',
        enter: { set: ['take3'], unset: ['wrecked_tapes'] },
        text: [
          'You are standing in the Starlite Drive-In. There is no forest anymore — the painted flats lie face-down in the mud like fallen dominoes, all the way to the horizon.',
          'The lot is full of cars. Hundreds of them, parked in neat rows facing the screen, windows fogged. In every one of them, somebody is sitting very still, smiling up at the screen.',
          'On the giant screen: a sunrise. A green truck. Jess, in a blanket, climbing into the cab, laughing and crying. Then again. Then again.',
          { if: 'pulled_jess', text: 'You still have the strip of film in your fist. Every frame is her. She isn’t in any of the cars. She’s *up there*.' },
          { if: 'jess_awake', text: 'On the screen, every few loops, Jess turns her head — just slightly — and looks straight out at you.' },
          'At the back of the lot, the squat concrete booth throws its beam over everyone’s heads. And the voice comes from every car speaker at once, warm and close, like it’s sitting in your passenger seat.',
          { speaker: 'The End', say: 'Isn’t she happy? Everyone in an ending is happy. Nothing bad ever happens to anyone after *The End*. That’s the whole point of it. Why won’t you let me give you that?' },
        ],
        choices: [
          {
            text: 'Run for the projection booth.',
            hint: 'Whatever is doing this, it’s running off a reel.',
            art: '🏃',
            outcome: [
              'You run between the rows of cars. Faces in the windows turn to follow you, all at the same speed. Nobody gets out.',
              'The booth door is open. Of course it is. The End wants an audience.',
            ],
            next: 'booth',
          },
          {
            text: 'Walk straight into the screen after Jess.',
            hint: 'If she’s up there, you’re going up there.',
            art: '🖼️',
            outcome: [
              'You walk to the base of the screen, and then you keep walking, and the screen doesn’t stop you. It’s like stepping into warm bathwater made of light.',
              'Then you are standing on a road at sunrise, and the sunrise is enormous, and the edges of the sky are curling.',
            ],
            next: 'screen_walk',
          },
          {
            text: 'Find the tall thing and ask for its help.',
            hint: 'It walked these woods for a long time. It knows the way.',
            if: '!warned',
            set: ['warned'],
            art: '👤',
            outcome: [
              'You find it leaning against a speaker pole at the end of a row, as if it has been waiting for you specifically. Up close, its face is a single frame of film, stuck and flickering.',
              { speaker: 'The Extra', say: 'I took the first dawn, a long time ago. Now I walk in the trees so the story has a monster. It doesn’t *kill* you. It *keeps* you. Every ending is a room it locks.' },
              { speaker: 'The Extra', say: 'The booth. The reel. I’ll hold the door. Go.' },
            ],
            next: 'booth',
          },
        ],
      },

      screen_walk: {
        title: '??:?? — Inside the Picture',
        enter: { unset: ['pulled_jess', 'jess_awake'] },
        stamp: 'Take 3',
        art: '🌅🎞️',
        mood: 'gold',
        scene: 'void',
        text: [
          'Inside the screen, the sunrise is enormous and flat, like a painting of a sunrise on a very large wall. The truck is there. The ranger is there, mid-sentence, frozen. The birds hang in the sky like they’re pinned.',
          'Jess is in the cab, smiling at the windscreen. She is in colour, and everything else around her is slowly going sepia, from the edges in.',
          'All around you, hanging in the air like washing on lines, are strips of film. Thousands. Every frame a dawn. Every dawn a different face, smiling, getting into a truck.',
          { speaker: 'The End', say: 'Please don’t touch the exhibits.' },
        ],
        choices: [
          {
            text: 'Pull Jess out of the frame.',
            hint: 'Both hands. Don’t let go.',
            set: ['jess_free'],
            fx: 'flash',
            art: '🫱',
            outcome: [
              'You reach into the cab and take Jess under the arms and *pull*. She’s heavy, then heavier, like lifting someone out of deep water. The frame stretches around her like cling film.',
              'Then it gives with a sound like a reel snapping, and she tumbles out onto the painted road on top of you, gasping, and her face is *hers*, all of it, furious and terrified and alive.',
              { speaker: 'Jess', say: 'I was in the truck. I was in the truck for *so long*. Where’s the — we need to break the thing. The projector. Where’s the projector?' },
              'You both run back out through the screen, toward the booth.',
            ],
            next: 'booth',
          },
          {
            text: 'Read the frames hanging around you.',
            hint: 'There are names scratched on the edges of the film.',
            set: ['counted_takes'],
            art: '🔎',
            outcome: [
              'Each strip has a name scratched along the sprocket edge, and a number. *DANA · TAKE 3. MARCUS · TAKE 12. TOMMY & SUE · TAKE 1.* Hundreds of names. Thousands.',
              'And then, on one strip, your name. **TAKE 47.** It’s already been cut and hung up. There’s a little space beside it, labelled in neat letters: *48*.',
              'You’ve seen enough. You run back out through the screen toward the booth.',
            ],
            next: 'booth',
          },
          {
            text: 'Sit down in the warm light. Just for a minute.',
            hint: 'It’s so quiet in here. Nothing’s chasing you.',
            set: ['lingered'],
            art: '😌',
            outcome: [
              'You sit down on the painted road, in the painted sunrise, and close your eyes. It’s warm. It smells like coffee. Somewhere, a radio is playing something old.',
              'You don’t know how long you sit there. When you open your eyes, the sun is rising again. Of course it is.',
            ],
            next: 'dawn3',
          },
        ],
      },

      booth: {
        title: '??:?? — The Projection Booth',
        enter: { unset: ['pulled_jess', 'jess_awake'] },
        stamp: 'Take 3',
        art: '📽️🎞️',
        mood: 'ember',
        scene: 'attic',
        fx: 'heartbeat',
        timer: 9,
        text: [
          'The booth is tiny and hot and smells of scorched dust. One huge projector, older than your parents, clattering away, its lamp so bright you can’t look at it. A reel the size of a cartwheel turns on the top spindle. The label on the can says: **THE END (PROBABLY) · FINAL REEL · DO NOT REWIND.**',
          'The film runs through the gate and out of the little window, and outside, a hundred cars watch the sun come up.',
          { if: 'jess_free', text: 'Jess is right behind you, gripping the back of your shirt. *“That’s it,”* she whispers. *“That’s the whole thing.”*' },
          {
            if: 'warned',
            text: 'Down the ladder, the tall thing has planted itself in the booth doorway, its long back to you, holding the door shut against something heavy that is trying to get in.',
            else: 'Behind you, on the ladder, you hear the tall thing climbing — fast, rung after rung.',
          },
          { speaker: 'The End', say: 'Don’t. Please. Do you know how *long* it took me to get that sunrise right?' },
        ],
        timeout: {
          art: '🎞️',
          outcome: [
            'You hesitate, and the film reaches out of the gate like a tongue.',
            'It wraps your wrist, gently. Then your arm. Then it starts, very carefully, to feed you through.',
          ],
          next: 'end_cut',
        },
        choices: [
          {
            text: 'Rip the reel off the spindle.',
            hint: 'Take the ending away from it.',
            set: ['reel'],
            fx: 'shake',
            art: '🎞️',
            outcome: [
              'You grab the reel with both hands and wrench it off the spindle. The projector screams. Film sprays out of the gate in a glittering brown fountain, and outside a hundred car horns go off at once.',
              'The reel is heavy, and warm, and it is *ticking*, like a heart. You clutch it to your chest.',
              { speaker: 'The End', say: 'Give that back. Give that *back*. That’s my *ending*.' },
              'The light outside the window swings, and swells, and turns to gold.',
            ],
            next: 'dawn3',
          },
          {
            text: 'Reach into the beam for Jess.',
            hint: 'She’s in that light. Grab her before it moves on.',
            if: '!jess_free',
            set: ['jess_free'],
            art: '🫱',
            outcome: [
              'You shove your arm into the beam where it leaves the lens. It’s like reaching into a furnace made of sunlight. Your fingers close on something — a hand — and you pull.',
              'Jess comes out of the light backwards and lands on the booth floor in a heap, coughing out dust, completely herself.',
              { speaker: 'Jess', say: 'I was in the *truck*. I was in the truck for so long. I hate that truck.' },
              'Outside, without her in it, the sunrise loop stutters — and starts over, wrong.',
            ],
            next: 'dawn3',
          },
          {
            text: 'Smash the lens.',
            hint: 'No lens, no picture. No picture, no ending.',
            set: ['smashed'],
            fx: 'flash',
            art: '🔨',
            outcome: [
              'You snatch a fire extinguisher off the wall and drive it into the lens. Glass explodes. The beam outside goes from a clean white rectangle to a raw, sprawling smear of light, spilling everywhere, over everything.',
              { speaker: 'The End', say: 'Oh, now look. *Now* look what you’ve done. Fine. We’ll do it without focus.' },
              'The light reaches you. Everything goes gold and blurry and soft.',
            ],
            next: 'dawn3',
          },
        ],
      },

      // ---------------------------------------------------- FAKE ENDING 3
      dawn3: {
        title: '6:02 — Sunrise — Sunrise — Sunrise',
        stamp: 'THE END (again)',
        art: '🌅🌅',
        mood: 'blood',
        scene: 'dawn',
        weather: 'ash',
        fx: 'glitch',
        fakeEnding: { title: 'Dayl█ght', type: 'true', note: 'Ending ∞ of ∞ · thank you for staying · thank you for staying · thank you for st', hold: 4000 },
        text: [
          'The road. The truck. The sun is rising in the west. Nobody mentions it.',
          { if: 'smashed', text: 'Everything is blurred, smeared at the edges, the trees running into the sky like wet paint. The ranger is a soft green shape with a moustache.' },
          { speaker: 'Ranger', say: 'Easy now. You’re safe. Sun’s up. Easy now. You’re safe. Nothing in those woods. Sun’s up. Sun’s up. Sun’s —' },
          'He is wrapping a blanket around your shoulders. He has been wrapping it around your shoulders for a long time. When you look down, there are eleven blankets.',
          'The ranger’s face isn’t painted anymore. It isn’t anything. There is a white oval with the word **RANGER** printed across it, like a name on a script.',
          {
            if: 'jess_free',
            text: 'Jess is beside you, really beside you, holding your hand so tight it hurts. *“Don’t look at the truck,”* she says. *“Whatever you do. It’s doing the thing where it wants you to look at the truck.”*',
            else: 'Jess is in the cab. She says, to the windscreen: *“— starts like this. I literally made one rule. Car! CAR! I was in the truck.”* All her lines, in the wrong order, very happily.',
          },
          { if: 'reel', text: 'The reel in your arms is ticking faster now. Hot. Like a kettle about to sing.' },
          { if: 'lingered', text: 'You can still smell the coffee from inside the picture. Part of you never stood up from that painted road.' },
          'You made it. You made it. You made it. The sun rises a little more, and then a little more, and never gets any higher.',
        ],
        choices: [
          {
            text: 'Fine. Get in. You’re so tired of mornings.',
            hint: 'Maybe staying is the only ending there is.',
            art: '🛻',
            outcome: [
              ...CRACK3,
              { speaker: 'The End', say: 'Oh. Oh, *really?* Now? After all that? Well. I won’t say no.' },
              'Behind the burning card, the truck is still there. The door is still open. It always was.',
            ],
            next: 'end_last_frame',
          },
          {
            text: 'Walk past the truck. Keep walking.',
            hint: 'Down the road. Off the edge of the picture.',
            art: '🚶',
            outcome: [
              ...CRACK3,
              'You walk past the truck. Past the ranger. Down the road, toward the place where the sunrise ends in a straight black line, like the edge of a screen.',
              'You step over the line.',
            ],
            next: 'final_card',
          },
          {
            text: 'Ask Jess if she’s real.',
            hint: 'You need to hear her answer.',
            art: '❓',
            outcome: [
              ...CRACK3,
              {
                if: 'jess_free',
                text: 'Jess squeezes your hand. *“Real enough to be really annoyed at you for asking. Come on. Walk.”* Together you walk out of the sunrise and over a straight black line at the edge of everything.',
                else: 'Jess turns from the windscreen, slowly, and looks at you. *“Every horror movie you’ve ever seen,”* she says, *“ends like this.”* Then she looks away again. You walk, alone, to the straight black line at the edge of the road, and over it.',
              },
            ],
            next: 'final_card',
          },
        ],
      },

      // ------------------------------------------------------------- THE END
      final_card: {
        title: 'After the Last Reel',
        enter: { unset: ['lingered', 'smashed'] },
        stamp: 'THE END (for real this time)',
        jump: 'glitch',
        art: '🔚',
        mood: 'void',
        scene: 'void',
        fx: 'heartbeat',
        timer: 9,
        text: [
          'Black. Total black, the kind at the end of a reel, between the last frame and the lights coming up.',
          'And in the middle of it, enormous, glowing, so close you could touch it: two words in white, wobbling ever so slightly, the way old film wobbles.',
          '**THE END**',
          { speaker: 'The End', say: 'There. No sunrise. No truck. No tricks. Just me. Just the real one.' },
          { speaker: 'The End', say: 'You’ve been very brave and very stubborn and I adore you for it. But every story has to end. Let me end it. You’ll be happy. You’ll be happy *forever*. Isn’t that what everybody wants?' },
          { if: 'jess_free', text: 'Jess is beside you in the dark. You can’t see her, but you can feel her hand, and it is shaking.' },
          { if: 'reel', text: 'In your arms, the stolen reel is too hot to hold. The letters of THE END flicker every time it ticks.' },
          { if: 'ticket', text: 'Something crinkles in your shirt pocket. You’d forgotten all about it.' },
          'The letters start to lower themselves around you, like a lid.',
        ],
        timeout: {
          art: '🔚',
          outcome: [
            'You hesitate. That’s all it ever needed.',
            { speaker: 'The End', say: 'There. See? That wasn’t so hard.' },
            'The letters close over you, soft and warm, and the dark turns gold.',
          ],
          next: (s) => (s.has('jess_free') ? 'end_credits' : 'end_last_frame'),
        },
        choices: [
          {
            text: 'Let it end.',
            hint: 'Everyone gets an ending. Maybe this is yours.',
            art: '🕊️',
            outcome: [
              'You close your eyes. You nod.',
              { speaker: 'The End', say: 'Oh, thank you. *Thank* you.' },
              {
                if: 'jess_free',
                text: 'But you let go of Jess’s hand first, and give her a shove — away, backwards, into the dark, where the letters aren’t. *“Go,”* you tell her. *“Somebody has to.”*',
                else: 'The letters close over you, soft and warm.',
              },
            ],
            next: (s) => (s.has('jess_free') ? 'end_credits' : 'end_last_frame'),
          },
          {
            text: 'Hold the reel up into the light of the letters.',
            hint: 'Old film burns. Old film burns *very* well.',
            if: 'reel',
            fx: 'flash',
            art: '🔥',
            outcome: [
              'You lift the stolen reel into the white glow of the letters. The End realises what you are doing a second too late.',
              { speaker: 'The End', say: 'No — no, not the nitrate, not the — *that’s my ending* —' },
              'The reel catches with a *whump* and a flare like a magnesium flash. Fire runs along the film, through the letters, through the dark. THE END bubbles, blisters, and burns from the middle out, the way film burns when it sticks in the gate.',
            ],
            next: 'end_directors_cut',
          },
          {
            text: 'Don’t let it end here.',
            hint: 'No. Not like this. Not yet.',
            art: '✋',
            outcome: [
              'You put both hands up against the descending letters and *push*. They’re heavy as a car. They’re warm. You push anyway.',
              { speaker: 'The End', say: 'But there’s nothing *after* the end. Where do you think you’re going to go?' },
              {
                if: (s) => s.has('ticket') && s.has('counted_takes'),
                text: 'Your shirt pocket crinkles. And you remember a little yellow ticket, and a number, and suddenly you know *exactly* where you’re going to go.',
                else: 'You don’t have an answer. You just keep pushing.',
              },
            ],
            next: (s) => (secretReady(s) ? 'end_walk_out' : 'end_sequel'),
          },
        ],
      },

      // ------------------------------------------------------------------ ENDINGS
      end_last_frame: {
        art: '🌅🖼️',
        mood: 'dawn',
        scene: 'dawn',
        weather: 'dust',
        ending: { id: 'last-frame', title: 'The Last Frame', type: 'bad' },
        text: [
          'The door closes. The truck doesn’t start. It doesn’t need to.',
          'The sun comes up over the hill, gold and warm. The birds start singing. Jess is laughing and crying beside you. The ranger pours coffee from his thermos. It is the most beautiful morning you have ever seen.',
          'The sun comes up over the hill, gold and warm. The birds start singing.',
          'The sun comes up over the hill.',
          {
            if: 'take3',
            text: 'You fought it through three dawns. You saw its face, its booth, its reel. And at the very end you took the morning anyway, because it was warm, and you were so tired. The End will tell everyone about you. It is very, very proud of you.',
            else: {
              if: 'take2',
              text: 'You saw it skip once, and you ran. You saw it go green, and you got in anyway. Some part of you is still counting the birdsong. Four notes. Four notes. Four notes.',
              else: 'You saw the crack. You chose not to see it. That’s all right. Almost everybody does.',
            },
          },
          'You are smiling. You are going to be smiling for a very long time.',
          '· · ·',
          'In a cellar under a lakeside cabin, at the end of the last shelf, a new tape slides into the gap. The label is in your handwriting: *DAYLIGHT.*',
          { if: (s) => s.found() >= 2, speaker: 'The End', say: 'See you next time. There’s always a next time.' },
        ],
      },

      end_cut: {
        art: '✂️🎞️',
        mood: 'void',
        scene: 'void',
        fx: 'redflash',
        ending: { id: 'cut-to-black', title: 'Cut to Black', type: 'death' },
        text: [
          { speaker: 'The End', say: 'Sorry, darling. You’re slowing down the second act.' },
          'There is no pain. There is a sound like a pair of scissors closing, very close to your ear, and then you are lying on a cold concrete floor, in pieces — neat little frames of you, each one a tiny picture of a face looking surprised.',
          'Someone sweeps you up into a can. The lid goes on. On the outside, in grease pencil: *TRIMS · TAKE 47 · NOT USED.*',
          { if: 'jess_free', text: 'Somewhere, Jess is screaming your name. Then she isn’t, because there is nobody in this film by that name. There never was.' },
          { if: 'warned', text: 'The tall thing stands over the can for a long time, its face flickering. *“I’m sorry,”* it whispers. *“I tried to tell you to keep moving.”*' },
          'In the next take, Jess drives up to the cabin alone. She says, *“Every horror movie you’ve ever seen starts like this,”* to an empty passenger seat, and frowns, and can’t work out why that line feels like it needs an answer.',
        ],
      },

      end_sequel: {
        art: '👤🌲',
        mood: 'forest',
        scene: 'forest',
        fx: 'glitch',
        ending: { id: 'the-sequel', title: 'The Sequel', type: 'neutral' },
        text: [
          'You push, and push, and the letters stop.',
          { speaker: 'The End', say: 'Fine. Fine! No ending, then. But you can’t just *stand* in my film doing nothing. Everybody here needs a part.' },
          'The dark rolls away. You are standing between two pine trees, in the woods above a lake, at night. Taller than you used to be. Your jacket is the same.',
          'You lift a hand to your face. You can’t feel a face. Only a fizz, like static, like a paused tape.',
          'Down the hill, headlights. An old car coughs and dies at the bottom of the cabin drive. Two people get out — laughing, nervous — and one of them says something you can’t hear, but you know exactly what it is.',
          {
            if: 'warned',
            text: 'Beside you, the old tall thing puts a hand on your shoulder. Its face is clearing. Underneath it is just a tired young man. *“Thanks,”* he whispers. *“Don’t let them take the dawn.”* Then he walks down the hill toward the road, and the sun comes up for him, and he doesn’t get into any truck. He just keeps walking.',
            else: 'Somewhere in the woods, another tall shape turns and walks away, lighter than it has been in years.',
          },
          'You knock on the cabin door three times. Slow. Polite. And when they open it, you point — up the hill, at the screen. *Don’t take the dawn.* You hope this pair can hear you better than you could.',
        ],
      },

      end_credits: {
        art: '📜✨',
        mood: 'night',
        scene: 'void',
        weather: 'stars',
        ending: { id: 'stay-for-credits', title: 'Stay for the Credits', type: 'true' },
        text: [
          'The letters close over you. It is warm inside them, like the sun on a car seat.',
          'And then you are rising — slowly, gently, up through the dark — and you are a line of white text, and there are thousands of lines above you and thousands below, all scrolling up, together, forever. *Dana. Marcus. Tommy & Sue.* A whole drive-in’s worth of people who stayed.',
          'Your name scrolls past. Then, after it, in small letters, a line you didn’t expect: *And introducing JESS, who got out.*',
          '· · ·',
          'Jess wakes up in the front seat of your car at the bottom of the cabin drive. It’s morning. A real morning — grey, drizzly, cold, a crow complaining in a pine tree. No ranger. No truck. No birds singing the same four notes.',
          'The passenger seat is empty. In the glovebox there is a ticket stub that she doesn’t remember being there, and on the dashboard a single frame of film, with your face on it, smiling — not the truck smile. Your real one.',
          { if: 'counted_takes', text: 'On the back of the frame someone has scratched, very small: *47. Last one.*' },
          'Jess drives home. She never watches another horror film. But every Halloween she goes to the old Starlite lot, sits in her car in front of the rotten screen, and stays right to the end of the credits. Every name. Every time. Somebody has to.',
        ],
      },

      end_directors_cut: {
        art: '🔥🎞️',
        mood: 'storm',
        scene: 'dawn',
        weather: 'rain',
        ending: { id: 'directors-cut', title: 'Director’s Cut', type: 'good' },
        text: [
          'The fire takes everything. The letters, the dark, the booth, the cars, the painted trees, the sunrise that never got any higher — all of it curls and browns and blisters, and then there’s a white flash, and a smell like burnt popcorn, and silence.',
          'Rain.',
          'Real rain, cold and stupid and wonderful, running down your collar. You are lying on your back on a muddy road at the bottom of a hill. The sky is a flat dirty grey. It is the ugliest morning you have ever seen. It is perfect.',
          {
            if: 'jess_free',
            text: 'Jess is lying beside you in the mud, laughing — a real laugh, a stupid, ragged, snorting laugh, not one you’ve heard before. Not one from the script.',
            else: 'You hear coughing. Jess is sitting at the side of the road, soaked, rubbing her eyes. *“I had the weirdest dream,”* she says. *“I was in a truck. I was smiling. I couldn’t stop smiling.”* Then she sees your face and stops talking and hugs you so hard your ribs creak.',
          },
          'Up the hill, the old Starlite screen is on fire, burning top to bottom, sending black smoke up into the rain. Somewhere in the trees, a tall shape watches it burn, and then — very slowly, like it’s forgotten how — lifts a hand and waves goodbye.',
          { if: 'counted_takes', text: 'Forty-seven takes. This one, the last one, nobody will ever get to watch. That’s the best part.' },
          'There is no truck. There is no ranger. There is no gold. You walk the eleven miles into town in the rain, arguing the whole way about whose fault it was, and it is the best walk of your entire life.',
          '*Somewhere, an ending card is trying to appear. Ignore it. It doesn’t know this one is real.*',
        ],
      },

      end_walk_out: {
        art: '🎟️🚪',
        mood: 'neon',
        scene: 'lobby',
        stamp: 'ADMIT ONE',
        ending: { id: 'walk-out', title: 'Walk Out', type: 'secret' },
        text: [
          'You take the ticket stub out of your pocket and hold it up to the letters. **STARLITE DRIVE-IN · ADMIT ONE · FINAL NIGHT.**',
          '*Admit one.* Not *cast*. Not *crew*. Not *character*. You were never meant to be in this picture. You were the audience. And forty-seven takes is a very, very long time to sit through anything.',
          { speaker: 'The End', say: 'Where did you get that? Put it away. Sit *down*. It isn’t *over* —' },
          'You stand up.',
          'That’s all. You stand up, the way you stand up in a cinema when the film is bad and you’ve had enough. The dark behind you creaks like a fold-up seat. The letters of THE END stay hanging there, glowing, waiting for someone to look at them — and you turn your back on them, and walk up the aisle.',
          {
            if: 'jess_free',
            text: 'Jess stands up too, right beside you. *“Rule three,”* she whispers. *“When the movie’s trying to kill you, you walk out of the movie.”*',
            else: 'In the row in front, Jess is still watching, smiling at the screen. You lean down and tap her on the shoulder, the way you’d wake someone who fell asleep in the cinema. She blinks. She stands. She follows you.',
          },
          'At the back there is a door with a green EXIT sign, and beyond it a lobby: stale popcorn, a dead arcade machine, a carpet with a pattern like a headache. Real, boring, gloriously ordinary. The door swings shut behind you, and on the other side, very faintly, you hear The End still talking to an empty room.',
          { if: (s) => s.found() >= 2, text: 'And you understand that every other time — every truck, every credit, every take — you were just sitting there, letting it play. You could always have walked out. You just had to stop wanting the ending.' },
          '· · ·',
          'And you, reading this. Yes, you. In a moment a card will appear and tell you this is an ending, and ask if you’d like to play again.',
          'You’re allowed to just close it. That’s the secret. You were always allowed to just stand up and leave.',
        ],
      },
    },
  });
})();
