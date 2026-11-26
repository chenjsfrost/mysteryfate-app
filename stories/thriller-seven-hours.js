/* MysteryFate story: Seven Hours Earlier (thriller) - told backwards, 4 AM to 6 PM and back again */
(function () {
  'use strict';

  // ---- helpers ----
  // "Evidence" = how tightly the frame fits around you at 4 AM (clamped 0..5).
  const clamp = (v) => Math.max(0, Math.min(5, v));
  const frame = (n) => (s) => s.setVar('frame', clamp(s.get('frame') + n));
  const tight = (n) => (s) => s.get('frame') >= n;
  // you know her other name (from her suitcase, or from your own bank alert)
  const knowsName = (s) => s.has('passport') || s.has('bank');
  // secret: one clue from each end of the night (the text, the ferry token, the drugged wine)
  const wholeNight = (s) => s.has('sched') && s.has('token') && s.has('drugged');

  registerStory({
    id: 'seven-hours',
    title: 'Seven Hours Earlier',
    category: 'thriller',
    tagline: 'Your sister\'s car is burning. Her keys are in your hand. The night only plays backwards.',
    description: `4:00 AM, Kessel Quay: your sister Juno's car is on fire, there is a trail of blood to the water, and you are holding her keys with no memory of the last ten hours. The night gives itself back to you in reverse, and everything you notice later, you get to carry earlier.`,
    cover: '⏪',
    accent: '#ff9f43',
    ambient: 'thriller',
    warning: 'Contains: a burning car, blood, drugging, threats of drowning, a frame-up.',
    scene: 'city-night',
    voices: {
      narrator: { gender: 'male', pitch: 0.85, rate: 0.95, accent: 'en-GB', note: 'low, rain-soaked noir; a man reading a case file aloud at 4 AM' },
      'Juno': { gender: 'female', pitch: 1.1, rate: 1.08, accent: 'en-IE', note: 'the younger sister, warm, quick, funny, always one sentence ahead of you' },
      'Ruiz': { gender: 'female', pitch: 0.9, rate: 0.98, accent: 'en-US', note: 'detective, dry, tired, misses nothing' },
      'Crane': { gender: 'male', pitch: 0.7, rate: 0.85, accent: 'en-GB', note: 'loan shark, soft-spoken, menacing, never raises his voice' },
      'Dex': { gender: 'male', pitch: 1.08, rate: 1.12, accent: 'en-AU', note: 'barman at the Anchor, cheerful, blunt' },
      'Radio': { gender: 'neutral', pitch: 0.6, rate: 1.0, accent: 'en-GB', volume: 0.7, note: 'crackly police radio' },
    },
    vars: { frame: 3 },
    flags: [],
    hud: [{ var: 'frame', label: 'Evidence on you', icon: '🩸', max: 5 }],
    start: 'quay',
    scenes: {
      // =====================================================================
      // 4:00 AM — THE PRESENT
      // =====================================================================
      quay: {
        title: 'Kessel Quay',
        stamp: '4:00 AM',
        art: '🚗🔥',
        scene: 'city-night',
        mood: 'ember',
        weather: 'embers',
        fx: 'flash',
        text: [
          `The fire is the first thing. Then the sirens. Then your own hand, held out in front of you as if it belongs to someone else, and in it a set of car keys.`,
          `You are standing on Kessel Quay at four in the morning. Ten metres away a silver Fiat is burning with its driver's door hanging open, flames pouring out of the windows and climbing into the rain. You know that car. You helped your sister Juno choose it. You talked her out of the red one.`,
          `You do not know how you got here. The last thing you remember is six o'clock yesterday evening: the kettle, the doorbell, Juno on your step with a bandaged hand. After that, nothing. Ten hours with the lights off.`,
          `Blue light is sweeping along the warehouse walls. You have perhaps a minute before somebody asks you what you are holding.`,
        ],
        choices: [
          {
            text: 'Look at your hands',
            hint: 'Something feels stiff at your wrist.',
            set: ['cuff'],
            art: '🩸',
            outcome: [
              `You turn your hands over in the firelight. No burns. No cuts. But the right cuff of your shirt, poking out of your coat sleeve, is stiff and dark.`,
              `Blood. A long smear of it, as if someone held your wrist with a wet hand. You check yourself twice, three times, everywhere. It is not yours.`,
            ],
            next: 'ruiz',
          },
          {
            text: 'Check your phone',
            hint: 'Who did you talk to tonight?',
            set: ['sched'],
            art: '📱',
            outcome: [
              `Eleven missed calls, none of them from Juno. Above them, the last thing you sent: a text to her at 11:52 PM. *Quay. Midnight. We need to talk about the money.*`,
              `You don't remember writing it. And beside the timestamp there is a tiny grey clock icon. *Scheduled message.* You have never scheduled a message in your life. You wouldn't know where to find the setting.`,
            ],
            next: 'ruiz',
          },
          {
            text: 'Look at the keys',
            hint: 'Her keys. Why do you have her keys?',
            set: ['token'],
            art: '🔑',
            outcome: [
              `Juno's keys. The Fiat fob. Her flat key with the chipped blue paint. The little enamel lighthouse you bought her in Cornwall, the summer she was fourteen.`,
              `And something new: a brass token on its own split ring, stamped *ISLES LINE — 05:10 — SINGLE*. A ferry token. One way. The first boat out of the harbour, an hour from now.`,
            ],
            next: 'ruiz',
          },
        ],
      },

      // =====================================================================
      ruiz: {
        title: 'Blue Lights',
        stamp: '4:07 AM',
        art: '🚨🕵️',
        scene: 'city-night',
        mood: 'night',
        weather: 'rain',
        text: [
          `The first car skids to a stop. A woman gets out before it has finished moving: forties, raincoat, a face that has been awake since Tuesday. She looks at the fire, then at you, then at your hand.`,
          { speaker: 'Ruiz', say: `Detective Ruiz. Don't move. Whose keys are those?` },
          `Behind her, a uniformed officer is shining a torch at the cobbles. There is a dark trail on the stones, drop after drop, from the open driver's door to the edge of the quay, where black water slaps at the wall.`,
          { speaker: 'Radio', say: `Nobody in the vehicle. Repeat, vehicle is empty. Blood trail to the water. Requesting dive team at first light.` },
          { if: 'cuff', text: `Your stained cuff is in plain view. You want very badly to put your hand in your pocket.` },
          `Ruiz is waiting. She does not look like a woman who waits long.`,
        ],
        timer: 8,
        timeout: {
          text: 'You couldn\'t speak.',
          art: '⛓️',
          outcome: [
            `Your mouth opens and nothing comes out. Ruiz reads the silence the way detectives read silence. She takes the keys out of your fingers with a gloved hand and drops them into an evidence bag.`,
            { speaker: 'Ruiz', say: `Okay. We'll do this at the station. You have the right to remain silent, which you seem to have worked out already.` },
          ],
          next: 'anchor',
        },
        choices: [
          {
            text: '"My sister\'s. Juno Vale. Is she in there?"',
            hint: 'The truth, for whatever it\'s worth.',
            if: '!token',
            set: ['token'],
            art: '🔑',
            outcome: [
              `Ruiz takes the keys from you with a gloved hand and turns the ring under her torch. She stops at a brass token you hadn't noticed.`,
              { speaker: 'Ruiz', say: `Isles Line. Ten past five, one way. Your sister planning a trip?` },
              `You don't know. You don't know anything. Ruiz looks at you for a long time, then at the trail of blood running into the harbour. "Not a lot of blood," she says, almost to herself, "for a body."`,
            ],
            next: 'anchor',
          },
          {
            text: 'Call Juno. Right now.',
            hint: 'If she answers, none of this is real.',
            if: '!sched',
            set: ['sched'],
            art: '📱',
            outcome: [
              `You dial with shaking thumbs. Straight to voicemail: Juno's bright recorded voice telling you to leave a message, babe. Ruiz plucks the phone out of your hand and scrolls.`,
              { speaker: 'Ruiz', say: `Eleven fifty-two. "Quay. Midnight. We need to talk about the money." From you. To her.` },
              `She turns the screen toward you. Beside the time, a little grey clock. *Scheduled.* You stare at it. Ruiz stares at you staring at it.`,
            ],
            next: 'anchor',
          },
          {
            text: 'Shove your hands in your pockets',
            hint: 'Something is wrong with your sleeve.',
            if: '!cuff',
            set: ['cuff'],
            art: '🩸',
            outcome: [
              { speaker: 'Ruiz', say: `Hands where I can see them. Now.` },
              `You pull them out. Her torch lands on your right cuff. It is stiff and dark with blood, a long smear, like a handprint around your wrist. You have no cut anywhere.`,
              { speaker: 'Ruiz', say: `Whose is that?` },
            ],
            next: 'anchor',
          },
        ],
      },

      // =====================================================================
      // 11:00 PM — FIVE HOURS EARLIER
      // =====================================================================
      anchor: {
        title: 'The Anchor',
        stamp: '11:00 PM · Five hours earlier',
        jump: 'back',
        art: '🍺🪝',
        scene: 'cafe',
        mood: 'neon',
        text: [
          `Ruiz is saying your name, and then she isn't. The fire folds back into the car. The sirens wind down into silence. The rain lifts off the cobbles and falls upward into the dark.`,
          `You close your eyes at four in the morning and open them at eleven at night, and somehow you understand the deal: you get the night back, but backwards. Whatever you learn later, you carry earlier.`,
          `The Anchor is the last pub on the harbour road: low beams, green lamps, the smell of wet coats. You are on a stool at the bar and the room swims when you turn your head. In your inside pocket is a fat brown envelope with *SILAS* written on it in Juno's handwriting.`,
          `In the back booth, under an old ship's wheel, a big silver-haired man in a camel coat is eating peanuts one at a time. Silas Crane. Juno kept his books for three years. That much you know.`,
          { if: 'cuff', text: `You glance at your right cuff. Clean. Whatever happens to it hasn't happened yet.` },
          { if: 'token', text: `Juno's keys are in your coat pocket. You feel along the ring: no brass token. Not yet. Someone adds it later.` },
          { if: 'sched', text: `Your phone says 11:02. In fifty minutes it will send a message you never wrote.` },
          `At the far end of the bar a woman in a raincoat sits alone with a lime soda, watching Crane's booth in the mirror. It takes you a long moment to place her. Detective Ruiz. Five hours before she meets you.`,
        ],
        choices: [
          {
            text: 'Ask the barman how much you\'ve had',
            hint: 'Your tongue feels too big for your mouth.',
            set: ['drugged'],
            art: '🧪',
            outcome: [
              { speaker: 'Dex', say: `Had? Nothing, mate. You came in at quarter to, already slurring, and asked for water. I figured you'd been at something.` },
              `You haven't been at anything. But there is a taste at the back of your throat that won't go away: red wine, and under it something bitter and chemical, like an aspirin dissolved on the tongue.`,
              `Somebody gave you something, somewhere between six o'clock and now. You lean on the bar and wait for the room to stop moving. It doesn't.`,
            ],
            next: 'booth',
          },
          {
            text: 'Sit down next to Ruiz',
            hint: 'Warn her. She won\'t believe you. Probably.',
            set: ['warned'],
            effect: frame(-1),
            art: '🕵️',
            outcome: [
              `You slide onto the stool beside her. "At four o'clock," you say, very carefully, "my sister's car is going to be burning on Kessel Quay. Silver Fiat. I'll be standing next to it. I won't have done it."`,
              { speaker: 'Ruiz', say: `That's either the worst threat I've ever heard or the best confession. You're drunk. Go home.` },
              `But she writes something on a napkin and folds it into her coat. And when you get up, she watches you all the way to Crane's booth.`,
            ],
            next: 'booth',
          },
          {
            text: 'Walk straight to Crane\'s booth',
            hint: 'Get it over with.',
            art: '🚶',
            outcome: [
              `You stand up, which takes two attempts, and cross the room. The floor tilts like a deck. Nobody in the Anchor looks at you directly, which in this pub means everybody is watching.`,
            ],
            next: 'booth',
          },
        ],
      },

      // =====================================================================
      booth: {
        title: 'The Back Booth',
        stamp: '11:20 PM',
        art: '🥜💼',
        scene: 'cafe',
        mood: 'blood',
        text: [
          `Crane doesn't get up. He pushes the bowl of peanuts an inch toward you, which appears to be his idea of hospitality.`,
          { speaker: 'Crane', say: `Juno's big sibling. She said you'd come. She said you'd be bringing me what she owes, and you'd explain why it's late. Sit. Explain.` },
          `At the next table two men have stopped talking. One of them has hands like shovels. The other is cleaning his nails with a key.`,
          { if: 'warned', text: `In the mirror behind the bar, Ruiz has turned on her stool to watch.` },
          { if: 'drugged', text: `The booth tilts. You grip the edge of the table and keep your face still. Whatever is in your blood, Crane must not see it.` },
          { if: 'token', text: `Juno's keys. A ferry ticket, one way, ten past five. You know something about your sister tonight that this man would pay a great deal to know.` },
        ],
        choices: [
          {
            text: 'Hand him the envelope',
            hint: 'Just hand it over and leave, she said.',
            set: ['blank', 'drugged'],
            art: '✉️',
            outcome: [
              `Crane slits the envelope with his thumbnail and fans the contents on the table. Newspaper. Cut to the exact size of banknotes, banded with rubber bands, the thickness of thirty thousand pounds.`,
              `He looks at it for a long time. Then he looks at your eyes.`,
              { speaker: 'Crane', say: `Your pupils are like pennies. Someone's dosed you and sent you in here with a parcel of newspaper. Do you know what your sister did for me? She kept my books. And for a year she kept a little extra. Forty-eight thousand pounds of it went through a bank account in *your* name.` },
              `He nods once at the two men. They stand.`,
            ],
            next: 'alley',
          },
          {
            text: '"What have you done with Juno?"',
            hint: 'Let the whole pub hear it.',
            effect: frame(1),
            set: ['blank'],
            fx: 'shake',
            art: '😡',
            outcome: [
              `It comes out much louder than you meant. "WHAT HAVE YOU DONE WITH MY SISTER?" The pub goes silent. Someone at the bar has their phone up, filming.`,
              { speaker: 'Crane', say: `Done with her? I haven't seen her in a week. You're the one who's meant to be paying me.` },
              `He takes the envelope out of your coat himself, rips it open, and newspaper spills across the table. A dozen witnesses watch you shout, and watch you stare at the paper, and watch Crane's men take you by the arms.`,
            ],
            next: 'alley',
          },
          {
            text: 'Tell him Juno is on the 5:10 ferry',
            hint: 'Trade what you know for your own skin.',
            if: 'token',
            set: ['crane_deal'],
            art: '⛴️',
            outcome: [
              `"She's not paying you," you hear yourself say. "She's leaving. Isles Line. Ten past five. One way."`,
              `Crane smiles, slowly, the way a door opens in a horror film. He reaches across, takes the envelope out of your coat, and puts it in his own without opening it.`,
              { speaker: 'Crane', say: `Is she, now. Go home. You've paid your sister's debt tonight. Just not in money.` },
            ],
            next: 'dinner',
          },
        ],
      },

      // =====================================================================
      alley: {
        title: 'The Harbour Wall',
        stamp: '11:34 PM',
        art: '🌊✊',
        scene: 'street',
        mood: 'fog',
        weather: 'rain',
        fx: 'heartbeat',
        text: [
          `The back door of the Anchor opens onto a strip of wet concrete and then nothing: the harbour, black and close, slapping at the wall a metre below. Shovel-hands has your collar. Key-man has your arm up your back.`,
          { speaker: 'Crane', say: `I'm going to ask you once where my money is. Then my friends are going to ask the harbour.` },
          { if: 'warned', text: `Over Crane's shoulder the back door swings, and a figure in a raincoat stands in the light. Ruiz. She hasn't moved yet. She is deciding whether you're worth it.` },
          `The water is very close. Your feet are already at the edge.`,
        ],
        timer: 8,
        timeout: {
          text: 'You couldn\'t find the words.',
          art: '🌊',
          outcome: [
            `They put you in. The cold is a fist. Shovel-hands holds you under by the collar, lets you up, holds you under again. On the third time up you hear Crane, bored and far away.`,
            { speaker: 'Crane', say: `Morning. Money. Or next time we let go.` },
            `They leave you hanging off the harbour ladder, choking up seawater, and go back inside to the warm.`,
          ],
          next: 'dinner',
        },
        choices: [
          {
            text: '"She\'s running. Isles Line, 5:10, one way."',
            hint: 'You know where she\'ll be.',
            if: (s) => s.has('token') && !s.has('crane_deal'),
            set: ['crane_deal'],
            art: '⛴️',
            outcome: [
              `The words come out between gasps. Crane holds up one hand, and the grip on your collar loosens.`,
              { speaker: 'Crane', say: `Ten past five. Well. That's more useful than newspaper. Let them go, boys.` },
              `He straightens your coat for you, very gently, like a father. You feel sick, and it isn't the drug.`,
            ],
            next: 'dinner',
          },
          {
            text: '"I\'ll get it. All of it. By morning."',
            hint: 'Promise anything.',
            art: '🤞',
            outcome: [
              `"I'll get it. Every penny. By morning." Crane considers this. Then he takes your wallet out of your coat, slides out your driving licence, and hands the wallet back.`,
              { speaker: 'Crane', say: `So I know where to send the friends. Off you go.` },
            ],
            next: 'dinner',
          },
          {
            text: 'Stamp on his instep and run',
            hint: 'Along the harbour wall, in the dark.',
            fx: 'shake',
            art: '🏃',
            outcome: [
              `You drive your heel down hard into Key-man's foot. He howls, the arm lock breaks, and you run, skidding along the wet harbour wall with the water a stride to your left.`,
              { if: 'warned', text: `Behind you, Ruiz's voice, flat and bored: "Evening, Silas. Lovely night for a swim." Nobody follows you.`, else: `Nobody follows. They don't need to. Crane knows where you live.` },
            ],
            next: 'dinner',
          },
        ],
      },

      // =====================================================================
      // 9:00 PM — SEVEN HOURS EARLIER
      // =====================================================================
      dinner: {
        title: 'Dinner at Juno\'s',
        stamp: '9:00 PM · Seven hours earlier',
        jump: 'back',
        art: '🍷🕯️',
        scene: 'kitchen',
        mood: 'candle',
        text: [
          `The harbour lights go out like pinched candles. The night slides backward again, two more hours, and puts you down in a warm chair.`,
          `Juno's flat smells of garlic and wax. She has made her mushroom risotto, the one she only makes when she is sorry about something. Her left hand is wrapped in a fresh white bandage. Her right is pouring you a large glass of red.`,
          { speaker: 'Juno', say: `To us. To getting through it. God, I've missed you. We should do this every week, you know that? Every single week.` },
          `Her own glass is already full, from a different bottle. You notice it the way you notice a stair that isn't there.`,
          `In the hallway behind her stands a packed suitcase with a dry-cleaning bag draped over it, as if to hide it.`,
          { if: 'drugged', text: `You know how eleven o'clock tastes. Red wine, and something bitter underneath. That glass is how it gets into you.` },
          { if: 'blank', text: `Your coat hangs on the back of the chair with the envelope marked SILAS in it. You know what's inside now. Newspaper, cut to the size of banknotes.` },
          { if: 'crane_deal', text: `You think of Crane's slow smile, and the 5:10 ferry, and you can't quite look at her.` },
        ],
        choices: [
          {
            text: 'Tip the wine into her pot plant',
            hint: 'Wait until she turns away.',
            if: 'drugged',
            set: ['sober'],
            art: '🪴',
            outcome: [
              `She goes to the kitchen for the parmesan. You pour the whole glass into the yucca by the window and refill it from the water jug, then add a splash of red from the bottle to colour it.`,
              `When she comes back you take a big, happy gulp. Over the next hour you let your words slide and your eyelids droop. "Lightweight," she laughs. But she watches you very closely while she says it.`,
            ],
            next: 'doorway',
          },
          {
            text: 'Drink. She\'s your sister.',
            hint: 'Whatever this is, she wouldn\'t.',
            art: '🍷',
            outcome: [
              `You clink glasses. It's bitter, and you make a face. "Natural wine," she says. "It's meant to taste like that. It's very expensive, so pretend you like it."`,
              `You pretend. The second glass tastes of nothing at all. The edges of the room go soft and warm, and Juno talks about the summer in Cornwall, and you laugh, and it is the nicest evening you have had in years.`,
            ],
            next: 'doorway',
          },
          {
            text: 'Ask her what she owes Silas Crane',
            hint: 'Straight out. Across the risotto.',
            art: '❓',
            outcome: [
              `She puts her glass down. For a second something flickers behind her eyes, quick as a fish.`,
              { speaker: 'Juno', say: `It's handled. That's what the envelope's for. You're dropping it at the Anchor for me tonight, remember? I can't face him. I can't.` },
              `Her eyes fill. "You're the only person I've ever been able to count on. Do you know that? The only one." You drink to that, because she is crying, and it is bitter, and you drink it anyway.`,
            ],
            next: 'doorway',
          },
        ],
      },

      // =====================================================================
      doorway: {
        title: 'Juno\'s Hallway',
        stamp: '10:15 PM',
        art: '🚪🤗',
        scene: 'apartment',
        mood: 'candle',
        text: [
          `By a quarter past ten the candles are stubs and the floor has started moving under you like the deck of a boat.`,
          { if: 'sober', text: `Or you let her think it has. You lean on the wall and slur your words and watch her through half-closed eyes. She watches you back, checking, the way you'd check a cake in the oven.` },
          `Juno helps you into your coat at the door and presses her car keys into your hand.`,
          { speaker: 'Juno', say: `You're in no state to walk. Take the Fiat in the morning, I'll get a cab. And stop at the Anchor on the way, yeah? Give Silas the envelope. Just hand it over and leave. Please.` },
          `She pulls you into a hug, long and tight, and her bandaged hand wraps right around your right wrist.`,
          { if: 'cuff', text: `Your right wrist. Your right cuff. Her bandage is warm and damp against it.` },
          { if: 'token', text: `Over her shoulder, the suitcase. The zip on its front pocket is half open.` },
        ],
        choices: [
          {
            text: 'Twist your wrist free before she squeezes',
            hint: 'You know what ends up on that cuff.',
            if: 'cuff',
            set: ['cuff_saved'],
            effect: frame(-1),
            art: '✋',
            outcome: [
              `You twist out of the hug. Her bandage is wet and dark in the middle: she has been pressing it all evening, keeping the cut open. A fat red drop falls onto her doormat instead of onto you.`,
              `She stares at you. For a second her face is completely empty.`,
              { speaker: 'Juno', say: `Sorry. Sorry. It keeps opening. Stupid glass.` },
            ],
            next: 'six',
          },
          {
            text: 'Leave her keys on the hall table',
            hint: '"I\'ll walk."',
            set: ['keys_refused'],
            effect: frame(-1),
            art: '🔑',
            outcome: [
              `"I'll walk. Fresh air." You put the keys down on the hall table beside the fruit bowl.`,
              `Her face does something complicated, there and gone. Then she laughs and shoves your shoulder. "Fine! Stubborn. You always were." She does not pick the keys up. She doesn't need to. She has a spare.`,
            ],
            next: 'six',
          },
          {
            text: 'Reach past her into the suitcase pocket',
            hint: 'While she\'s busy with your collar.',
            if: 'token',
            set: ['passport'],
            art: '🛂',
            outcome: [
              `While she fusses with your collar, your hand finds the open zip. A booklet. A passport. You flip it open against her back: Juno's face, Juno's birthday, Juno's crooked smile.`,
              `The name says *ELLEN MARSH*. Tucked inside is a printed Isles Line booking. Departure 05:10. Single. You slide it back and zip the pocket shut. She doesn't notice. You think.`,
            ],
            next: 'six',
          },
          {
            text: 'Hug her back. Hold on.',
            hint: 'She is your little sister.',
            art: '🤗',
            outcome: [
              `You hold on. She is so small. You feel her hand on your cuff, warm and wet, and you don't think anything of it at all.`,
              { speaker: 'Juno', say: `Love you. Whatever happens. Remember that, okay? Whatever happens.` },
            ],
            next: 'six',
          },
        ],
      },

      // =====================================================================
      // 6:00 PM — TEN HOURS EARLIER
      // =====================================================================
      six: {
        title: 'Your Flat',
        stamp: '6:00 PM · Ten hours earlier',
        jump: 'back',
        art: '🫖📱',
        scene: 'apartment',
        mood: 'gold',
        weather: 'rain',
        text: [
          `The candles unburn. The risotto unmakes itself. The night pulls you all the way back, to the last place you remember: your own flat, six o'clock, the kettle starting to whistle.`,
          `The doorbell. Juno, wet from the rain, already talking as she comes in. There is a fresh white bandage on her left palm.`,
          { speaker: 'Juno', say: `Wine glass. Don't ask, I'm an idiot. Listen, my phone's dead and I need to sort a taxi for tonight. Can I borrow yours? Two minutes.` },
          `She has your phone before you've said yes. She takes it to the window with her back to you, thumbs moving fast. On your table she has left a fat brown envelope: *SILAS*.`,
          `Something else comes back to you. At five o'clock your phone buzzed with a bank alert: *£48,000 received.* Two minutes later: *£48,000 sent to E. MARSH.* You thought it was a scam. You deleted it.`,
          { if: 'passport', text: `E. Marsh. Ellen Marsh. Ferry at 5:10. You look at your sister's back and see, for the first time, someone who is already gone.` },
          { if: 'sched', text: `In five hours and fifty-two minutes your phone will send her a message. You are watching her write it.` },
          { if: 'crane_deal', text: `And at eleven-twenty, you will sell her to Silas Crane. Unless the night comes out differently this time.` },
        ],
        choices: [
          {
            text: 'Walk up behind her and look at the screen',
            hint: 'You know what she\'s typing.',
            if: 'sched',
            set: ['phone_kept'],
            effect: frame(-1),
            art: '👀',
            outcome: [
              `You cross the room without a sound and look over her shoulder. The message is already written, from your phone to her own number: *Quay. Midnight. We need to talk about the money.* Her thumb is on *Schedule send: 11:52 PM.*`,
              `She sees your reflection in the dark window. For one second her face is a stranger's face. Then she laughs, too high.`,
              { speaker: 'Juno', say: `It's a joke. It's... a reminder. It's nothing.` },
              `You take the phone out of her hand and delete it while she watches. She doesn't stop you. She doesn't say anything at all.`,
            ],
            next: 'rewrite',
          },
          {
            text: 'Tell her the whole night. Backwards.',
            hint: 'The fire. The ferry. The wine. The text. Everything.',
            if: wholeNight,
            set: ['told_all'],
            art: '⏪',
            outcome: [
              `"Sit down, Juno." Something in your voice makes her do it. And you tell her. Not forwards, the way a person would invent it. Backwards, the way you lived it.`,
              `Four in the morning, her Fiat burning on Kessel Quay. A brass ferry token on her keys, Isles Line, 5:10, single. A text from your phone at 11:52 with a little grey clock beside it. Eleven o'clock in the Anchor with a taste in your mouth like aspirin and red wine. Newspaper in an envelope.`,
              `By the time you reach the wine, she is crying. By the time you reach the message she hasn't scheduled yet, the one she was typing two minutes ago on your phone, she is on your kitchen floor with her back against the cupboards and both hands over her face.`,
              { speaker: 'Juno', say: `How do you know? How can you possibly know all that? I haven't done any of it yet.` },
            ],
            next: 'end_secret',
          },
          {
            text: 'Ask her about the £48,000',
            hint: 'Sent to E. Marsh. From your account.',
            set: ['bank'],
            art: '🏦',
            outcome: [
              `"Juno. Who is E. Marsh, and why did forty-eight thousand pounds go through my bank account an hour ago?"`,
              `She goes white, then pink. She puts the phone face-down on the windowsill, very carefully, as if it might go off.`,
              { speaker: 'Juno', say: `That was me. I needed an account Silas doesn't know about, just for an afternoon. It's fine. I'll explain everything at dinner, I promise. Nine o'clock. Don't be late.` },
              `She kisses your cheek and is gone before the kettle finishes boiling. Your phone is still on the windowsill. You don't think to check what she did with it.`,
            ],
            next: 'rewrite',
          },
          {
            text: 'Let her have it. Put the kettle on.',
            hint: 'It\'s Juno. It\'s two minutes.',
            art: '🫖',
            outcome: [
              `You make two teas, hers with too much sugar the way she likes it. She hands your phone back with a grin. "Ta. Taxi's sorted."`,
              `She drinks the tea standing up, kisses your cheek, and points at the envelope. "Dinner at mine at nine. Bring that. Don't be late." Then she is gone, and the flat is very quiet, and that is the last thing you will remember.`,
            ],
            next: 'rewrite',
          },
        ],
      },

      // the night snaps forward again: awake on the quay if you skipped the wine, otherwise blank again
      rewrite: { redirect: (s) => (s.has('sober') ? 'present_awake' : 'present_again') },

      // =====================================================================
      // BACK TO THE PRESENT
      // =====================================================================
      present_awake: {
        title: 'Kessel Quay, Awake',
        stamp: '3:52 AM · The present, rewritten',
        jump: 'forward',
        art: '⛽🔥',
        scene: 'city-night',
        mood: 'ember',
        weather: 'rain',
        fx: 'heartbeat',
        text: [
          `This time you are awake.`,
          `The night runs forward again, all ten hours in a smear of streetlights, and sets you down behind a stack of fish crates on Kessel Quay at eight minutes to four. Your head is clear. Your mouth tastes of water, not wine.`,
          `Juno's silver Fiat is parked at the edge of the quay. Juno is standing beside it, hair pushed up under a dark hat, pouring petrol from a red can over the seats. Not frightened. Not forced. Methodical, the way she used to do her homework.`,
          `She sets the can down. She unwinds the bandage from her left hand, squeezes her palm until it runs, and walks a careful trail of drops from the driver's door to the edge of the water. Then she takes out a lighter.`,
          {
            if: 'keys_refused',
            text: `She leaves the spare key in the ignition. Without you to hold them, the keys will have to tell the story on their own.`,
            else: `On the bollard beside her, where she expected to find you slumped and sleeping, lies her set of keys, a brass ferry token newly clipped to the ring, ready to be pressed into your hand. Her one mistake: wrong ring.`,
          },
          { if: knowsName, text: `In her coat, you know, is a passport that says Ellen Marsh.` },
          { if: 'warned', text: `Somewhere behind the warehouses a car with no lights is idling. Ruiz. You told her four o'clock, and she came to see if you were lying.` },
          { if: 'crane_deal', text: `And at the far end of the quay, headlights. A long black car, rolling slowly, in no hurry at all.` },
          `The lighter clicks once. A spark, no flame. She shakes it.`,
        ],
        timer: 8,
        timeout: {
          text: 'You couldn\'t move.',
          art: '🔥',
          outcome: [
            `The second click catches. She tosses the lighter through the open door and the Fiat goes up with a soft, enormous *whump* that you feel in your teeth.`,
            `In the orange light she looks around once, for you, at the bollard where you should have been. You're not there. She frowns, and then she walks away into the rain toward the ferry terminal, and she does not look back.`,
          ],
          next: (s) => (tight(2)(s) ? 'end_framed' : 'end_ferry'),
        },
        choices: [
          {
            text: 'Step out and say her name',
            hint: 'Just her name. Let her see you.',
            art: '🧍',
            outcome: [
              `"Juno."`,
              `She spins round. The lighter is lit now, a little flame shaking in the wind, and her face in its light is every age she has ever been: fourteen in Cornwall, six on your shoulders, twenty-nine and drowning.`,
              {
                if: (s) => !tight(3)(s),
                text: `"There's no blood on my cuff," you say. "No text on my phone. No keys in my hand. It doesn't work without me, Jojo. It was never going to work without me."`,
                else: `"I know," you say. "The wine. The cuff. The text. All of it." She looks at you for a long time. "It still works," she says softly. "They'll still believe it. That's the worst part, isn't it?" Then she drops the lighter through the open door, and while the Fiat goes up behind her she walks past you toward the ferry, close enough to touch. You don't stop her.`,
              },
            ],
            next: (s) => (tight(3)(s) ? 'end_ferry' : 'end_good'),
          },
          {
            text: 'Flash your phone torch at the dark car',
            hint: 'Three times. Ruiz is watching.',
            if: 'warned',
            fx: 'flash',
            art: '🔦',
            outcome: [
              `Flash. Flash. Flash. Behind the warehouses, an engine starts and headlights flare full beam across the quay.`,
              `Juno is lit up like a stage actress: petrol can at her feet, bloody palm, lighter in her hand, the trail of drops glistening all the way to the edge of the water. She doesn't run. There is nowhere on Kessel Quay to run to.`,
              { speaker: 'Ruiz', say: `Juno Vale? Put the lighter down. Your sibling told me you'd be here five hours ago. I didn't believe a word of it.` },
            ],
            next: 'end_true',
          },
          {
            text: 'Rush her before the lighter catches',
            hint: 'Ten metres of wet stone. Go.',
            fx: 'redflash',
            art: '🏃',
            outcome: [
              `You break cover and sprint. She turns at the sound of your feet, startled, and the lighter jumps out of her hand.`,
              `It lands in the petrol at your feet. You are standing in the trail she poured. For one strange, slow second you see the little flame lying on the wet stone, perfectly still, like a candle on a cake.`,
            ],
            next: 'end_fire',
          },
          {
            text: 'Stay down. Let the black car arrive.',
            hint: 'You told Crane where she\'d be.',
            if: 'crane_deal',
            art: '🚘',
            outcome: [
              `You press yourself flat behind the crates. The black car stops beside the Fiat. Juno sees it and the lighter goes out in her hand.`,
              `Shovel-hands gets out first. Then Crane, buttoning his camel coat against the rain.`,
            ],
            next: 'end_crane',
          },
        ],
      },

      // =====================================================================
      present_again: {
        title: 'Kessel Quay, Again',
        stamp: '4:00 AM · Again',
        jump: 'forward',
        art: '🚗🔥',
        scene: 'city-night',
        mood: 'ember',
        weather: 'embers',
        fx: 'shake',
        fakeEnding: { title: 'Keys in Your Hand', type: 'bad', note: 'The night isn\'t finished with you.' },
        text: [
          `The fire is the first thing. Again.`,
          `You are on Kessel Quay at four in the morning, and Juno's Fiat is burning, and the sirens are coming, and you have no memory of the last five hours. But you remember everything else, all of it, backwards and at once.`,
          { if: 'keys_refused', text: `Your hands are empty. Her keys are in the ignition of the burning car, where you never touched them.`, else: `Her keys are in your hand. Of course they are.` },
          { if: 'cuff_saved', text: `Your right cuff is clean. Dry. White.`, else: `Your right cuff is stiff with her blood.` },
          { if: 'phone_kept', text: `Your phone shows nothing sent after six o'clock. No message at 11:52.`, else: `On your phone the message sits there, sent at 11:52 PM: *Quay. Midnight. We need to talk about the money.*` },
          { if: 'warned', text: `The first car out of the dark is Ruiz's. She looks at the fire, then at you. "You told me," she says. "At eleven o'clock, in the Anchor. You told me."` },
          { if: tight(3), text: `It looks exactly like what it was built to look like.`, else: `It doesn't look the way it was built to look. Not quite. Not any more.` },
          { speaker: 'Ruiz', say: `Talk to me. Fast.` },
        ],
        choices: [
          {
            text: 'Tell Ruiz to stop the 5:10 ferry',
            hint: 'Isles Line. One way.',
            if: (s) => s.has('token') || knowsName(s),
            art: '⛴️',
            outcome: [
              `"She's not in the water. She's getting on the ten past five to the islands. Hold the ferry."`,
              {
                if: knowsName,
                text: `"And she won't be travelling as Juno Vale. Check the manifest for Ellen Marsh."`,
                else: `Ruiz grabs her radio. A long pause, full of static. Then: "No Juno Vale on the manifest." She looks at you the way people look at a liar who has run out of lies.`,
              },
              { if: knowsName, text: { speaker: 'Radio', say: `Isles Line confirms one passenger, Marsh, Ellen, checked in at 3:58. Boarding now.` } },
            ],
            next: (s) => (knowsName(s) ? 'end_true' : tight(2)(s) ? 'end_framed' : 'end_ferry'),
          },
          {
            text: 'Run for the ferry terminal yourself',
            hint: 'Six hundred metres. Fifty minutes.',
            fx: 'shake',
            art: '🏃',
            outcome: [
              `You run. Ruiz shouts behind you, and then her footsteps, and then a car door, but you have six hundred metres of harbour road and fifty minutes and the only thing in your head is your sister's face.`,
              { if: 'crane_deal', text: `You reach the terminal at 4:40. A long black car is idling at the foot of the gangway.`, else: `You reach the terminal at 4:40, soaked, gasping. The ferry is lit up like a birthday cake against the dark water.` },
            ],
            next: (s) => (s.has('crane_deal') ? 'end_crane' : 'end_ferry'),
          },
          {
            text: 'Pull open the burning door',
            hint: 'She might be inside. She might be inside.',
            fx: 'redflash',
            art: '🔥',
            outcome: [
              `You know she isn't in there. Part of you knows. The rest of you is already running at the car with your coat over your hands, because she is your little sister and you have to look.`,
              `The handle is so hot it doesn't feel hot. The door swings wide, and the fire takes a great breath of the night air.`,
            ],
            next: 'end_fire',
          },
          {
            text: 'Say nothing. Let the evidence talk.',
            hint: 'Whatever it says now.',
            art: '🤐',
            outcome: [
              `You hold out your hands, wrists together. Ruiz doesn't cuff you yet. She just looks: at your hands, your sleeve, your phone, the car.`,
              { if: tight(2), text: `"Right," she says, and reaches for the cuffs.`, else: `"Huh," she says, and doesn't reach for anything at all.` },
            ],
            next: (s) => (tight(2)(s) ? 'end_framed' : 'end_ferry'),
          },
        ],
      },

      // =====================================================================
      // ENDINGS
      // =====================================================================
      end_framed: {
        stamp: 'Eleven weeks later',
        jump: 'forward',
        art: '🔑⛓️',
        scene: 'office',
        mood: 'office',
        ending: { id: 'keys-in-your-hand', title: 'Keys in Your Hand', type: 'bad' },
        text: [
          `Interview Room 3 has no windows and a clock that runs four minutes fast. You get to know it very well.`,
          `The case against you is laid out on the table in plastic sleeves.`,
          { if: 'keys_refused', text: `Not the keys: those were in the ignition. But everything else.`, else: `Her keys, found in your hand.` },
          { if: '!cuff_saved', text: `Your shirt, the right cuff stained with your sister's blood.` },
          { if: '!phone_kept', text: `A message from your phone: *Quay. Midnight. We need to talk about the money.*` },
          { if: 'blank', text: `A phone video from the Anchor of you screaming at a loan shark over an envelope of newspaper.` },
          `Forty-eight thousand pounds through your bank account. A motive, a meeting, a weapon made of petrol. The only thing missing is a body, and the harbour is very deep.`,
          { if: 'sober', text: `You tell them what you saw: Juno with a petrol can, Juno squeezing her own palm, Juno walking away into the rain. Your solicitor asks you, gently, to stop telling people that.` },
          `In the spring a postcard reaches you on remand. A lighthouse on a little island. No name, no message. Just the stamp, and a smudge on the corner that might be from a thumb that had once been cut on a wine glass.`,
          `You keep it under your pillow. You never quite decide why.`,
        ],
      },

      end_fire: {
        stamp: '4:01 AM',
        art: '🔥🕯️',
        scene: 'void',
        mood: 'ember',
        weather: 'embers',
        fx: 'redflash',
        ending: { id: 'last-thing-you-remember', title: 'The Last Thing You Remember', type: 'death' },
        text: [
          `The fire is the first thing, and the last.`,
          { if: 'sober', text: `The petrol trail goes up all at once, a bright river from the car to your feet, and you are standing in it. The last thing you see is Juno's face, lit orange, both hands over her mouth.`, else: `The car breathes out. The door you opened becomes a mouth. The last thing you hear is Ruiz shouting your name, and then a roar like the sea.` },
          `They find no body in the Fiat. They find yours beside it.`,
          `The papers write it the way she built it: a sibling, a debt, a meeting on the quay that went wrong, a fire that took the guilty one too. Case closed. Nobody drags the harbour very hard after that.`,
          `At 5:10, a woman named Ellen Marsh boards the first ferry to the islands, sits by the window, and cries the whole way across. Nobody on board knows why. She doesn't tell them.`,
        ],
      },

      end_ferry: {
        stamp: '5:10 AM',
        jump: 'forward',
        art: '⛴️🌫️',
        scene: 'sea',
        mood: 'dawn',
        weather: 'rain',
        ending: { id: 'five-ten-to-nowhere', title: 'The 5:10 to Nowhere', type: 'neutral' },
        text: [
          `At ten past five the Isles Line ferry pulls away from the harbour wall, horn low and sad in the rain. At the stern rail stands a woman in a dark hat. The passenger list says her name is Ellen Marsh.`,
          { if: 'sober', text: `You watch her go from the end of the quay. She lifts one hand, the bandaged one. You lift yours. Neither of you waves.`, else: `You reach the terminal in time to see her at the rail. She sees you too. She puts her bandaged hand flat against the glass, and then the ferry turns, and she is gone.` },
          `Ruiz drags the harbour for three days and finds nothing, because there is nothing to find.`,
          { if: tight(2), text: `The case against you never quite closes and never quite opens. Ruiz keeps your file on her desk for a year, and some mornings you see her unmarked car parked across from your flat.`, else: `Without a body, without a cuff, without a text, there is nothing to hold you on. Ruiz lets you go with a look that says she knows more than she can prove, and so do you.` },
          `Silas Crane goes on looking for his forty-eight thousand pounds. He never finds Ellen Marsh. Nobody does.`,
          `A postcard comes every Christmas. A lighthouse. No name. You keep them in a shoebox and you never tell anyone who they are from, because the only honest answer is: your sister, who drowned.`,
        ],
      },

      end_crane: {
        stamp: '5:10 AM',
        jump: 'forward',
        art: '🚘🌧️',
        scene: 'sea',
        mood: 'fog',
        weather: 'rain',
        ending: { id: 'paid-in-full', title: 'Paid in Full', type: 'bad' },
        text: [
          `Crane doesn't hurry. He never hurries. He opens the back door of the black car and waits, the way you'd wait for a cat to come in from the rain.`,
          `Juno looks past him, searching the dark, and finds you. She doesn't scream. She just looks at you, and you understand that she knows exactly who told him where she'd be, because there was only one other person in the world she trusted.`,
          `She gets in. The door closes with a soft, expensive click.`,
          `At ten past five the ferry leaves with an empty seat booked for Ellen Marsh.`,
          `A week later an envelope comes through your door. Inside is your driving licence, and a slip of paper in neat, old-fashioned handwriting: *Account settled. — S.C.*`,
          `You never find out what "settled" means. You stop going down to the harbour. You stop answering the phone at night, in case it's her, and in case it isn't.`,
        ],
      },

      end_good: {
        stamp: '6:40 AM · Sunrise',
        jump: 'forward',
        art: '🌅🧥',
        scene: 'dawn',
        mood: 'dawn',
        ending: { id: 'nobody-burns', title: 'Nobody Burns', type: 'good' },
        text: [
          `The little flame shakes in the wind for a very long time. Then Juno lets it go out.`,
          `She sits down on the wet bollard where she meant to leave you, with the petrol can at her feet, and she tells you everything. Three years of Crane's books. A year of skimming, a little at a time, because he would never notice, until he did. A plan to die so that he would stop looking. And because police look hard for a missing woman and not at all for a murdered one, a plan for somebody to have killed her.`,
          { speaker: 'Juno', say: `I picked you because nobody would ever believe it of you. That was the point. If even you could do it, they'd stop asking questions.` },
          { if: 'cuff_saved', text: `"You pulled your wrist away," she says. "In the hallway. I knew then. I just didn't want to know."` },
          { if: 'phone_kept', text: `"You deleted it," she says. "You looked over my shoulder like you already knew what I'd typed."` },
          `You sit with her until the sun comes up over the warehouses and the 5:10 ferry leaves without Ellen Marsh. Nobody burns. The Fiat smells of petrol for a month.`,
          `She still owes Silas Crane forty-eight thousand pounds. That is a problem for nine o'clock. At seven, you take her home and make her tea with too much sugar, and she falls asleep on your sofa with her bandaged hand curled under her chin, like she used to when she was six.`,
        ],
      },

      end_true: {
        stamp: (s) => (s.has('sober') ? '4:03 AM' : '5:06 AM · The gangway'),
        jump: 'forward',
        art: '🕵️⛴️',
        scene: 'dawn',
        mood: 'dawn',
        ending: { id: 'seven-hours-earlier', title: 'Seven Hours Earlier', type: 'true' },
        text: [
          {
            if: 'sober',
            text: `Juno puts the lighter down on the wet stones. Ruiz kicks it into the harbour without looking at it and walks her to the car with a hand on her elbow, almost gently.`,
            else: `They stop her at the foot of the gangway at six minutes past five: a woman in a dark hat, carrying a passport that says Ellen Marsh. She doesn't run. She sees you, soaked and smoke-stained, behind Ruiz's shoulder, and she just sits down on her suitcase.`,
          },
          `In Interview Room 3, it comes out in the right order for once. Three years keeping Silas Crane's books. A year of skimming. Forty-eight thousand pounds washed through her sibling's account and out to Ellen Marsh. A plan to die, so Crane would stop looking. And because police look hard for a missing woman but not at all for a murdered one, a plan for someone to have killed her.`,
          { speaker: 'Juno', say: `I picked you because nobody would believe it of you. I thought that would make them stop asking questions faster.` },
          `Ruiz writes it all down. Then she turns the pad round and writes one more line, for you: *What you said at 11 PM. How did you know?*`,
          `You can't answer that. So you tell her about the seven hours instead, the ones you lived backwards, and she listens with a face that has been awake since Tuesday and has heard stranger things, though not many.`,
          `Juno turns witness. Three years of Crane's real books come out of a locker at the ferry terminal, and Silas Crane goes away for a long time. Juno goes away for a shorter one.`,
          `You visit every Sunday. She always asks what time it is when you arrive. You always tell her the truth.`,
        ],
      },

      end_secret: {
        stamp: '4:00 AM · Nothing happens',
        jump: 'forward',
        art: '🛋️🌙',
        scene: 'apartment',
        mood: 'night',
        weather: 'rain',
        ending: { id: 'nothing-happens-at-four', title: 'Nothing Happens at Four', type: 'secret' },
        text: [
          `She tells you everything, on your kitchen floor, at ten past six in the evening. Crane's books. The skimming. Ellen Marsh. The wine she was going to pour you. The blood she was going to keep warm in her own palm. The text she was going to make you send.`,
          { speaker: 'Juno', say: `I needed someone to have killed me. I picked the one person nobody would ever believe it of. I'm so sorry. I'm so sorry. I'd have been on that ferry by the time you woke up.` },
          `You don't go to dinner at nine. You don't go to the Anchor at eleven. At 11:52 your phone sends nothing at all.`,
          `At four in the morning, Kessel Quay is dark and empty. The rain falls on the cobbles and stays there. A silver Fiat sits parked outside your flat with nothing in it but a parking ticket and a paperback.`,
          `Inside, Juno is asleep on your sofa under your old coat. On the table between you are three years of Silas Crane's real books, copied onto a memory stick she was going to drop in the harbour, and a napkin on which you have written a name remembered from a night that never happened: *Det. I. Ruiz.*`,
          `At nine you'll take her there together. It will be hard, and long, and some of it will hurt. But nobody burns, nobody drowns, and nobody stands on a quay at four in the morning holding keys they can't explain.`,
          `You sit up and watch the clock tick past four. Nothing happens. It is the best thing you have ever seen.`,
        ],
      },
    },
  });
})();
