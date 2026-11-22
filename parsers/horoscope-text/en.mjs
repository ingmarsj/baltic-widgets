// English horoscope copy (British spelling, formatted for en-GB). Written natively; read HOROSCOPE_EDITORIAL_RULES.md before editing.
// Curly quotes “…” ‘…’ and apostrophes ’ only, spaced en dash “ – ”, 24-hour times (“at 09:23”), dates as “24 November”.
// Never assume the reader has a partner, children, a car or an office job; single and attached readers both read every line.
const signs={
  nom:['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'],
  // Sign names do not inflect in English, so the locative is simply “in Aries”.
  loc:['in Aries','in Taurus','in Gemini','in Cancer','in Leo','in Virgo','in Libra','in Scorpio','in Sagittarius','in Capricorn','in Aquarius','in Pisces']
};
const bodies={Sun:'Sun',Moon:'Moon',Mercury:'Mercury',Venus:'Venus',Mars:'Mars',Jupiter:'Jupiter',Saturn:'Saturn'};
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
const cap=text=>text.replace(/^./,c=>c.toUpperCase());
// Times arrive as 'HH:MM' and stay on the 24-hour clock: “at 09:23”, “until 16:54”.
const on=iso=>`${Number(iso.slice(8,10))} ${months[Number(iso.slice(5,7))-1]}`;
const ordinal=n=>`${n}${[11,12,13].includes(n%100)?'th':({1:'st',2:'nd',3:'rd'})[n%10]||'th'}`;
// The Sun and the Moon take the article in running text; planets do not.
const the=body=>body==='Sun'||body==='Moon'?`the ${bodies[body]}`:bodies[body];
// Phase names keep a lower-case “moon” (“Full moon”, “Waxing moon”); the capital “Moon” is kept for the body itself.
const phases={new_moon:'New moon',first_quarter:'First quarter',full_moon:'Full moon',last_quarter:'Last quarter',waxing:'Waxing moon',waning:'Waning moon'};

export default {
  lang:'en',
  signs,bodies,
  // Short names of the twelve whole-sign houses, used in the sky panel.
  houseNames:['you and your mood','money and values','conversations and messages','home and family','romance and play','routine and health','partners and agreements','intimacy and shared money','travel and learning','career and goals','friends and the future','rest and your inner world'],
  sky:{
    labels:{moon:'Moon',phase:'Phase',sun:'Sun',next_full:'Next full moon',next_new:'Next new moon',planets:'Planets',sign:'Your sign',theme:'Theme of the day'},
    phases,
    elements:{fire:'Fire sign',earth:'Earth sign',air:'Air sign',water:'Water sign'},
    // Header chip, e.g. “Moon in Aries · Taurus from 12:10”.
    chip:segments=>[`${bodies.Moon} ${signs.loc[segments[0].sign]}`,...segments.slice(1).map(s=>`${signs.nom[s.sign]} from ${s.from}`)].join(' · '),
    // “In Aries all day (until 12:10 on 22 November)” or “In Aries until 12:10, then in Taurus”.
    moon:(segments,next)=>segments.length===1
      ?`${cap(signs.loc[segments[0].sign])} all day (until ${next.time} on ${on(next.date)})`
      :cap(segments.map((s,i)=>i===segments.length-1?`then ${signs.loc[s.sign]}`:`${signs.loc[s.sign]} until ${s.until}`).join(', ')),
    // “Full moon in Gemini at 16:54” or “Waxing moon, 86% illuminated”.
    phase:(id,illumination,event)=>event
      ?`${phases[event.id]} ${signs.loc[event.sign]} at ${event.time}`
      :`${phases[id]}, ${illumination}% illuminated`,
    // “24 November at 16:54, in Gemini”.
    event:e=>`${on(e.date)} at ${e.time}, ${signs.loc[e.sign]}`,
    sun:(sign,ingress,next)=>ingress
      ?`${cap(signs.loc[ingress.from])} until ${ingress.time}, then ${signs.loc[ingress.to]}`
      :`${cap(signs.loc[sign])} until ${on(next.date)}`,
    // “In Leo”, “In Aries, retrograde”, “In Leo, retrograde from 02:59”, “In Leo until 01:37, then in Virgo”.
    planet:p=>{
      let text=p.ingress?`${cap(signs.loc[p.ingress.from])} until ${p.ingress.time}, then ${signs.loc[p.ingress.to]}`:cap(signs.loc[p.sign]);
      if(p.station)text+=p.station.turns==='retrograde'?`, retrograde from ${p.station.time}`:`, direct from ${p.station.time}`;
      else if(p.retrograde)text+=', retrograde';
      return text;
    },
    // “Fire sign, ruled by Mars (now in Sagittarius)”, “Fire sign, ruled by the Sun (now in Scorpio)”.
    sign:(element,ruler,rulerSign)=>`${element}, ruled by ${the(ruler)} (now ${signs.loc[rulerSign]})`,
    // “You and your mood – the Moon in your 1st house”.
    theme:(house,name)=>`${cap(name)} – the Moon in your ${ordinal(house)} house`
  },
  serious:{
    // One sentence about an exact sky event; the house text follows it.
    events:{
      sunOwn:e=>`At ${e.time} the Sun moves into your sign and your birthday season begins: the coming four weeks may bring an extra lift of energy.`,
      sunIngress:e=>`At ${e.time} the Sun moves from ${signs.nom[e.from]} into ${signs.nom[e.to]}, and a new astrological month begins.`,
      fullMoon:e=>e.own
        ?`The full moon at ${e.time} falls in your sign: feelings may shine brighter than usual, and it’s a time to finish things rather than start them.`
        :`There’s a full moon ${signs.loc[e.sign]} at ${e.time}, and feelings may sit closer to the surface than usual.`,
      newMoon:e=>e.own
        ?`At ${e.time} there’s a new moon in your sign: a good moment for an intention that’s about you and nobody else.`
        :`The new moon ${signs.loc[e.sign]} arrives at ${e.time}: a time for quiet intentions rather than loud decisions.`,
      station:e=>`At ${e.time} `+({
        Mercury:{retrograde:'Mercury turns retrograde: over the next three weeks, double-check messages, contracts and travel plans.',direct:'Mercury turns direct, and conversations and plans that got stuck begin to move again.'},
        Venus:{retrograde:'Venus turns retrograde: old questions about love and money may come back, this time to be settled.',direct:'Venus turns direct, and choices about feelings and spending start to look clearer.'},
        Mars:{retrograde:'Mars turns retrograde: spend your drive on finishing what’s already started rather than on new battles.',direct:'Mars turns direct, and stalled projects slowly pick up speed again.'}
      })[e.body][e.turns],
      moonChange:e=>`The Moon is in ${signs.nom[e.from]} until ${e.time}, then moves into ${signs.nom[e.to]}.`
    },
    headlines:{sunOwn:'Your month in the sun',fullMoonOwn:'Feelings in full light',newMoonOwn:'A fresh page for you'},
    // Twelve whole-sign houses of the day's main Moon sign, counted from the reader's sign.
    // Each list has three entries; entry n of every list is used on the same day.
    houses:[
      { // 1: the Moon in the reader's sign
        headline:['A day that’s yours','The wind at your back','You set the pace'],
        day:[
          'With the Moon in your sign, your feelings are easy to read and your energy is hard to ignore. Put your own plan at the top of the list and let the rest fit around it.',
          'Energy arrives early and wants somewhere to go. Pick the one thing you’ve put off starting for weeks and give it the first, freshest hour of the day.',
          'Your instincts are sharp, and your mood shows on your face before you’ve said a word. Let that honesty work for you: ask for what you need, kindly and plainly.'
        ],
        love:[
          {text:'Your confidence is showing, and it suits you. If there’s someone you’d like to know better, a friendly, direct first move will do more than waiting for a sign.',do:'Make the first move: a message, a call or an invitation with a time attached.',avoid:'Comparing your love life with the highlights other people choose to post.'},
          {text:'You’re at your most attractive today when you stop trying to impress. Let people see the real you, opinions and odd sense of humour included.',do:'Wear the thing that makes you feel most like yourself.',avoid:'Agreeing with everything just to keep the evening smooth.'},
          {text:'You feel things more keenly today, which makes you tender company and, now and then, a touchy one. If something stings, say so early and lightly.',do:'Name what you’re feeling in one plain sentence, then let the other person answer.',avoid:'Saving up small hurts to present later as a numbered list.'}
        ],
        work:[
          {text:'You think faster than usual and you’re less shy about saying so. It’s a good moment to pitch the idea you keep coming back to.',do:'Pitch your idea in three sentences and let the questions come.',avoid:'Polishing a proposal for so long that someone else gets there first.'},
          {text:'Tasks go best today where you can set your own pace and method. If one can be yours from start to finish, claim it.',do:'Pick one task and see it through yourself, from the first step to the final check.',avoid:'Asking permission for decisions that are already yours to make.'},
          {text:'First impressions count for more than usual. Whether you’re meeting someone new or sending work out into the world, a personal finishing touch tends to get noticed.',do:'Add one personal detail to anything that goes out under your name.',avoid:'Hiding a good result behind a modest “oh, it was nothing”.'}
        ],
        energy:[
          {text:'Energy runs high, and your body is asking to move. A brisk walk will clear your head faster than another coffee.',do:'Get outside for half an hour and walk a little faster than usual.',avoid:'Spending your best energy of the week on other people’s errands.'},
          {text:'Moods are catching today, and yours will spread to the people around you. Set it deliberately in the morning with something that makes you glad to be up.',do:'Start the day with music, daylight or a breakfast you actually look forward to.',avoid:'Letting the first email of the day decide your mood.'},
          {text:'Instinct tells you exactly what does you good today and what drains you. Trust it when you plan the evening, even if it turns out quieter than expected.',do:'Keep one hour of the evening for nothing but yourself.',avoid:'Copying someone else’s idea of a good evening.'}
        ]
      },
      { // 2: money, values, comfort
        headline:['Count what counts','Comfort, on a budget','Know your worth'],
        day:[
          'What you earn, spend and own is in focus today. One honest look at where the money actually goes will tell you more than a dozen good intentions.',
          'Comfort matters more than excitement today, and that isn’t laziness – it’s a need for solid ground. Small, practical comforts will steady you better than one grand gesture.',
          'What is really worth your money, time and attention? Choices that match your values come easily now; the ones that don’t will feel heavy for a reason.'
        ],
        love:[
          {text:'Affection is easier to show than to say today. Mending the wobbly chair or saving someone the last slice can mean more than a long speech.',do:'Offer one small, practical kindness before anyone has to ask.',avoid:'Expensive gestures meant to fix a doubt that one honest conversation could clear up.'},
          {text:'Self-worth may feel a little tender, in love as elsewhere. Notice who makes you feel valued – those are the people to make time for.',do:'Spend the evening with someone who makes you feel at ease.',avoid:'Measuring affection by how much was spent on it.'},
          {text:'Money and feelings can get tangled today, whether over a shared bill or a gift. If something needs discussing, keep it simple and talk in daylight.',do:'Agree on one shared cost calmly, before it becomes a sore point.',avoid:'Splitting hairs over small sums while the bigger question goes unspoken.'}
        ],
        work:[
          {text:'Anything you can count goes well today. Go through invoices, prices or regular payments and you may find room you didn’t know you had.',do:'Review one regular payment and decide whether it still earns its place.',avoid:'Rounding the numbers in your favour when you plan the month.'},
          {text:'If you’ve been meaning to talk about pay, rates or a price, your arguments carry extra weight today. Bring figures, not just feelings.',do:'Write down three concrete reasons your work is worth more.',avoid:'Quoting a price with an apology attached.'},
          {text:'An eye for value serves you well today: the real bargain and the overpriced one are easy to tell apart. Take stock of what you already have before you buy.',do:'Compare a few prices before any purchase bigger than the weekly shop.',avoid:'Paying full price for something you could easily borrow.'}
        ],
        energy:[
          {text:'Comfort is what the body wants today: warm food, soft clothes and an unhurried pace. Give it that, and your energy will come back faster.',do:'Put on your softest clothes as early in the evening as you can.',avoid:'A lunch break that’s really just answering messages with a sandwich.'},
          {text:'The senses are your shortcut to feeling better. Fresh bread, a favourite song or cold air on your face can turn the mood round in minutes.',do:'Treat one sense on purpose: a scent, a taste, a song or a walk in the fresh air.',avoid:'Saving every small pleasure for a weekend that’s already overbooked.'},
          {text:'Familiar rhythms steady you more than surprises today. A regular bedtime will leave you on firmer ground tomorrow.',do:'Get to bed at a reasonable hour tonight, whatever’s on the screen.',avoid:'Packing the evening so full that winding down becomes another task.'}
        ]
      },
      { // 3: conversations, messages, learning
        headline:['Say it out loud','Messages in motion','A curious mind'],
        day:[
          'Words come easily today, and messages travel fast. If there’s something you’ve wanted to say for a while, this is the moment to say it clearly and kindly.',
          'Curiosity runs high today, sharpened by the Moon. Read something from outside your usual shelf, ask the obvious question, and jot down any idea worth coming back to.',
          'The day may fill with short trips, quick errands and chance meetings with neighbours or relatives. Keep some time free: the most useful conversation may be unplanned.'
        ],
        love:[
          {text:'Talking is the best kind of closeness today. A long chat, a late-night call or a voice note can bring you nearer to someone than any grand plan.',do:'Send someone a message that has nothing to do with logistics.',avoid:'One-word replies to a message that took courage to send.'},
          {text:'Flirting works best with words today: wit, curiosity and good questions. A chat that starts with something small could go somewhere interesting.',do:'Ask a question you genuinely want to hear the answer to.',avoid:'Talking about yourself until the other person becomes an audience.'},
          {text:'Misunderstandings come easily when you’re typing rather than talking. A two-minute call can untangle what ten messages only knot tighter.',do:'Pick up the phone the moment a message thread starts to wobble.',avoid:'Replying in a hurry to a message that deserved a pause.'}
        ],
        work:[
          {text:'Communication is your strongest tool today. Calls, emails and short meetings go well, so tackle the conversations you’ve been postponing.',do:'Make the call you’ve been putting off since last week.',avoid:'Copying ten people into an email that concerns two.'},
          {text:'Learning comes easily today, so pick up a new skill or finally get to grips with a process you’ve only half understood.',do:'Get someone to show you the tool or skill you keep working around.',avoid:'Skipping the basics because they look too obvious to matter.'},
          {text:'Ideas are plentiful, though not all of them are ready. Note every one, and let the best rise to the top by itself.',do:'Share your strongest idea with one person whose judgement you trust.',avoid:'Throwing out an odd idea before you’ve slept on it.'}
        ],
        energy:[
          {text:'Sitting still is hard today: your mind wants to move, so let your feet go with it. A change of scene will clear your head better than another scroll.',do:'Run one errand on foot and take the long way back.',avoid:'Filling every spare minute with something to read or watch.'},
          {text:'Thoughts run fast today, which is energising until it isn’t. Give them somewhere to land, on paper or in conversation, before bedtime.',do:'Write tomorrow’s three tasks down before you go to bed.',avoid:'Scrolling in bed until your mind is wide awake again.'},
          {text:'Company is good fuel today, and a familiar voice may lift your spirits more than you expect.',do:'Ring an old friend just to hear how they are.',avoid:'Skipping a pleasant chat because the to-do list looks stern.'}
        ]
      },
      { // 4: home, family, roots
        headline:['Home is the answer','Back to your roots','Cosy and unhurried'],
        day:[
          'The Moon draws you homeward. Familiar faces, a quiet evening and your own kitchen may appeal more than a busy night out, and that’s worth making room for.',
          'Family stories and old memories are close at hand. A call to someone who knew you as a child, or a look through old photos, may tell you something about where you’re heading.',
          'Home asks for a little attention today: a shelf, a drawer, a corner that has bothered you for weeks. Sorting your space has a way of sorting your thoughts too.'
        ],
        love:[
          {text:'Closeness grows in ordinary moments at home: cooking together, a film under one blanket, a slow evening. Living alone? Invite someone round for tea.',do:'Cook for someone, or with someone, and leave the phones in another room.',avoid:'Bringing the day’s frustrations home and serving them up with dinner.'},
          {text:'Family matters may need your patience. Listen first, especially if an old topic comes up again; it doesn’t all have to be settled tonight.',do:'Ask an older relative the family question you’ve always wondered about.',avoid:'Taking sides in a family quarrel that isn’t yours.'},
          {text:'Feeling safe with the people close to you matters most today. Often it comes down to small things: a familiar routine, a door that’s always open.',do:'Tell someone close what makes you feel at home with them.',avoid:'Waiting for others to guess what would make you comfortable.'}
        ],
        work:[
          {text:'The working day may feel slower as your mind drifts homeward. Choose tasks that need patience rather than speed, and save big decisions for another day.',do:'Pick one detailed task that rewards patience and quiet.',avoid:'Rushing a decision just to get it off your plate.'},
          {text:'If you can work from home, today is a good day for it. If not, a quiet corner and headphones will help you concentrate.',do:'Mute the notifications for one solid hour of work.',avoid:'Letting work spill into the hours you meant for home.'},
          {text:'Household money deserves a look: bills, repairs, the things your home quietly needs. Sorting one practical matter now will ease the coming weeks.',do:'Book the small repair you keep stepping around.',avoid:'Paying extra for speed on a home job that can wait a week.'}
        ],
        energy:[
          {text:'Your energy is gentler today and recovers best at home. A slow evening, something warm and an early night will do you more good than any plan.',do:'Make the evening as cosy as you can and turn in early.',avoid:'Filling a quiet evening with chores that could easily wait.'},
          {text:'Feelings from the past may surface and leave you a little tired. Treat yourself as you would a good friend: kindly, and without a lecture.',do:'Make yourself the comfort food you remember from childhood.',avoid:'Judging yesterday’s choices by what you know today.'},
          {text:'Privacy is restful today. A little time alone, out of reach of messages and requests, will refill the tank.',do:'Take an hour on your own with the phone switched to silent.',avoid:'Explaining to everyone why you’d like a quiet evening.'}
        ]
      },
      { // 5: romance, pleasure, creativity
        headline:['Your heart’s day out','Time to play','Make something joyful'],
        day:[
          'This could be one of the warmest days of the month for love and pleasure. Make room for joy on purpose: a date, a long lunch, a plan made just because it sounds fun.',
          'The Moon lights up your playful side. Creative projects, hobbies and anything done purely for fun will give you more energy than they take.',
          'Pleasure isn’t a reward you have to earn today. Follow what delights you, whether that’s a hobby, a flirtation or an afternoon of play with the youngest people you know.'
        ],
        love:[
          {text:'Romance is strongly favoured today. Single or attached, a little boldness and a lot of warmth could make this an evening to remember.',do:'Plan an evening with one small surprise built in.',avoid:'Waiting for the other person to make every move.'},
          {text:'Flirting comes naturally, and your charm is easy to notice. Enjoy the attention without hurrying to decide what it all means.',do:'Pay someone a compliment about who they are, not what they wear.',avoid:'Brushing off compliments instead of simply enjoying them.'},
          {text:'Play makes everything lighter today, affection included: a game, a silly plan, a shared laugh. If you’re single, go where people are having fun.',do:'Plan something playful for two, or join an activity full of new faces.',avoid:'Waiting for the perfect evening instead of enjoying this one.'}
        ],
        work:[
          {text:'Your attention may keep drifting towards more enjoyable things today. Do what must be done, then let creativity in wherever it fits.',do:'Get the must-dos out of the way, then give a creative task a free hour.',avoid:'Turning a playful idea into a chore by over-planning it.'},
          {text:'Creative work goes better than routine admin. Where you can, put your energy into ideas, design or anything with a personal touch.',do:'Start the day with the task that lets you make something.',avoid:'Judging a first draft by the standards of a final one.'},
          {text:'Not the best day for risky money moves, however tempting the offer sounds. A hobby could grow into a small side project, though, if you start modestly.',do:'Give your hobby a small, fixed budget and enjoy every cent of it.',avoid:'Putting money into something only because a friend says it can’t fail.'}
        ],
        energy:[
          {text:'High spirits and plenty of energy make a good pair today. Spend them on something lively, ideally in good company.',do:'Play a game, make something or go somewhere just for the fun of it.',avoid:'Feeling guilty about enjoying yourself on an ordinary day.'},
          {text:'Play recharges you better than rest today. Whatever made you lose track of time as a child is worth an hour now.',do:'Spend an hour on something you used to love and haven’t done for ages.',avoid:'Saving the fun for when everything else is finished.'},
          {text:'Heart and body feel in tune today. Movement that feels like fun rather than exercise – dancing, cycling, a game – will leave you refreshed.',do:'Pick the kind of movement that makes you smile and give it half an hour.',avoid:'Pushing the pace until fun turns into effort.'}
        ]
      },
      { // 6: routine, tasks, health habits
        headline:['Ticking things off','Order out of chaos','Little and often'],
        day:[
          'An excellent day for the tasks that have waited too long. Once you start, momentum builds quickly, and crossing things off feels genuinely satisfying.',
          'Small routines carry real weight today: what you eat, when you sleep, how you start the morning. Fix one of them and the rest of the day follows more easily.',
          'Colleagues, helpers and even pets want a share of your attention. Being useful feels good today, as long as your own work gets its turn too.'
        ],
        love:[
          {text:'Everyday care says more than grand romance today. Remembering how someone takes their coffee may mean more than flowers.',do:'Take one chore off someone’s list without announcing it.',avoid:'Keeping a mental scoreboard of who did what around the house.'},
          {text:'Routine can make you a little critical. Notice what’s working before you point out what isn’t.',do:'Thank someone for one ordinary thing they do every day.',avoid:'Correcting someone in front of other people.'},
          {text:'The heart may have to wait until the work is done today, and that’s all right. What counts is that the people you love know they haven’t been forgotten.',do:'Make one small, reliable gesture of care, even on a full day.',avoid:'Going silent all day and hoping it reads as “busy”.'}
        ],
        work:[
          {text:'Practical work flows today. Admin, errands and fiddly problems all give way to steady effort.',do:'Clear the three oldest items on your list before lunch.',avoid:'Letting one small snag hold up everything else on the list.'},
          {text:'Today rewards improving how you work, not just how much. A better system set up now will keep paying you back.',do:'Fix one small process that wastes time every single week.',avoid:'Keeping an outdated method only because it’s familiar.'},
          {text:'Teamwork runs smoothly, and someone may need your help or have help to offer. Share the load where it makes sense.',do:'Offer help where you have real expertise, and accept it where you don’t.',avoid:'Quietly taking on work that belongs on someone else’s desk.'}
        ],
        energy:[
          {text:'Routine suits the body today, but it doesn’t want to be pushed hard. Regular meals, a short walk and a sensible bedtime will keep you steady.',do:'Set your meals and bedtime first, then plan the rest around them.',avoid:'Pushing through a hard workout on a day that wants a gentle one.'},
          {text:'Small habits make a noticeable difference today: a glass of water, a minute on your feet, a look away from the screen.',do:'Set a gentle reminder to get up and move once an hour.',avoid:'Ignoring the first signs of tiredness until they become the main event.'},
          {text:'Time with an animal or a simple walk does you good today. Even a few minutes of fresh air between tasks can steady the mood.',do:'Take a short break outdoors, with a pet if you have one.',avoid:'Running the whole day on coffee and good intentions.'}
        ]
      },
      { // 7: partners, agreements, cooperation
        headline:['Better together','Meet in the middle','The power of two'],
        day:[
          'Other people take centre stage today, especially the ones closest to you. Cooperation gets further than going it alone, so look for the person who complements you.',
          'Partnerships of every kind are in the spotlight. Agreements and joint plans move forward well, as long as both sides get a fair hearing.',
          'Meeting halfway is the day’s quiet strength. A small compromise could settle something that has been simmering for a while and leave everyone lighter.'
        ],
        love:[
          {text:'A lovely day for closeness. Couples may find it easy to reconnect, and singles may find a quiet coffee with someone new goes surprisingly well.',do:'Make time for one long, unhurried conversation this evening.',avoid:'Planning the evening around everyone except the person you most want to see.'},
          {text:'Talking things through goes well. A calm, honest conversation can bring you closer and clear up an old misunderstanding.',do:'Ask what the other person needs from you this week, and really listen.',avoid:'Winning the argument at the cost of the evening.'},
          {text:'Romance thrives on fairness today: an equal say, equal effort and room for both people to be themselves. Small, even-handed gestures go a long way.',do:'Let the other person choose the film, the music or the place tonight.',avoid:'Assuming you know what someone wants without asking.'}
        ],
        work:[
          {text:'Negotiations and joint projects go well. A client conversation or a contract benefits from your diplomatic touch.',do:'Start with what both sides want before you talk numbers.',avoid:'Doing someone else’s share just to keep the peace.'},
          {text:'Cooperation beats competition today. Ask a colleague or partner for their view; a fresh pair of eyes may spot what you’ve missed.',do:'Bring one stuck problem to someone who sees things differently.',avoid:'Hearing a colleague’s suggestion as criticism.'},
          {text:'Progress comes through compromise today. Be clear about what you need and flexible about how you get there.',do:'Decide in advance where you can give way and where you can’t.',avoid:'Agreeing to a deadline you already know is unrealistic.'}
        ],
        energy:[
          {text:'Other people’s moods affect you more than usual today. Notice whose company leaves you lighter, and make more room for it.',do:'Arrange to see someone whose company always feels easy.',avoid:'Absorbing someone else’s bad mood as if it were your own.'},
          {text:'Balance matters for body and mind. If the day leans heavily on other people, give the evening back to yourself.',do:'Close the day with a walk, a bath or a book – on your own.',avoid:'Measuring your evening by how useful you were to others.'},
          {text:'Exercise is easier with company today. Someone beside you makes the effort feel lighter and the time go faster.',do:'Invite someone along for a walk, a swim or a class.',avoid:'A workout plan so strict that nobody wants to join you.'}
        ]
      },
      { // 8: intimacy, trust, shared money
        headline:['Deeper waters','Trust and let go','What lies beneath'],
        day:[
          'You want depth and honesty today, and small talk won’t cut it. A real conversation, or simply an hour of quiet thinking, will be time well spent.',
          'The Moon stirs up things that usually stay private: trust, shared money, old feelings. Look at them calmly and they may weigh less than you expected.',
          'Letting go is the theme: a grudge, a habit, a pile of old papers. Once something you no longer need has gone, there’s room for something better.'
        ],
        love:[
          {text:'Intimacy and trust can deepen today. Share something real with someone close, and give them room to do the same.',do:'Make space for a conversation that goes past “fine, thanks”.',avoid:'Rushing to give advice when someone only wants to be heard.'},
          {text:'Passion runs strong, and so can jealousy. Let honesty lead, and ask rather than assume.',do:'Say plainly what you need in order to feel secure.',avoid:'Letting jealousy write the script for the evening.'},
          {text:'An old hurt may be ready to heal. Forgiveness, of someone else or of yourself, can make room for closeness again.',do:'Say “I’m sorry” or “I forgive you”, whichever is overdue.',avoid:'Keeping a grievance alive just because it feels familiar.'}
        ],
        work:[
          {text:'Shared finances, loans or joint resources need attention today. Read the details carefully before you agree to anything.',do:'Check who pays what before agreeing to any shared cost.',avoid:'Borrowing against money that hasn’t arrived yet.'},
          {text:'Research and analysis go better than meetings and pitches. Dig properly into one problem instead of skimming ten.',do:'Follow one complicated question all the way to its source.',avoid:'Settling for the first explanation that sounds plausible.'},
          {text:'Settling what you owe or what you’re owed brings relief today. Tying up one financial loose end may lift more weight than you expect.',do:'Send one polite reminder about money you are owed.',avoid:'Leaving a joint expense unspoken because the topic feels awkward.'}
        ],
        energy:[
          {text:'Emotions run deep and can be tiring. Allow yourself rest and quiet if feelings surface unexpectedly.',do:'Give yourself a quiet half-hour to let feelings settle.',avoid:'Making big decisions while emotions are still running high.'},
          {text:'Space restores you today. Clearing clutter, on shelves or in your head, frees energy you didn’t know you had.',do:'Clear one surface completely and enjoy the view.',avoid:'Turning a quick tidy into an all-day project.'},
          {text:'Intuition is sharp today, and so is sensitivity. Steer clear of draining situations where you can.',do:'Listen to the quiet voice that says you’ve had enough for today.',avoid:'Saying yes to plans that already feel heavy.'}
        ]
      },
      { // 9: travel, study, the wider view
        headline:['Wider horizons','The bigger picture','Somewhere new'],
        day:[
          'Your world wants to grow a little bigger today. Learning something new, planning a trip or talking to someone with a different background will freshen your view of things.',
          'Step back far enough and today’s problems start to look like part of a longer road. A good moment to ask where you’re heading and whether the route still suits you.',
          'Curiosity makes a good compass. Follow an interest, read widely or plan a small adventure, even if it only takes you to the other side of town.'
        ],
        love:[
          {text:'A little adventure suits the heart today. Try something new together, or stay open to someone whose background or ideas are different from yours.',do:'Say yes to an invitation you’d normally turn down.',avoid:'Ruling someone out because they don’t fit your usual type.'},
          {text:'Big conversations bring people closer today: plans, beliefs, the life you’d like to live. Messages from far away may matter more than usual too.',do:'Share one dream you haven’t told anyone yet.',avoid:'Dismissing someone’s big plans before they’ve finished the sentence.'},
          {text:'Romance and learning go hand in hand today: shared curiosity can be as attractive as good looks.',do:'Go to a talk, class or exhibition on a subject you know nothing about.',avoid:'Pretending to understand something just to look clever.'}
        ],
        work:[
          {text:'Long-term thinking comes easily. Step back from the daily rush and set a direction for the months ahead.',do:'Block out an hour to think about the next few months, away from your inbox.',avoid:'Getting lost in details that won’t matter in a month.'},
          {text:'Learning and teaching are both favoured. Take a course, share what you know or finally ask the expert you’ve been too shy to approach.',do:'Teach someone a thing you know well; you’ll learn something too.',avoid:'Assuming there’s nothing left to learn about your own field.'},
          {text:'Contacts abroad or in other fields could open a door. Reach a little beyond your usual circle.',do:'Write to someone in another country or industry whose work you admire.',avoid:'Turning down an opportunity just because it’s unfamiliar.'}
        ],
        energy:[
          {text:'Fresh air and new scenery recharge you today. Even a short trip or a walk somewhere unfamiliar will lift your spirits.',do:'Take a different route home and notice three things you’ve never seen.',avoid:'Waiting for a proper holiday before letting yourself explore.'},
          {text:'Meaning matters as much as rest today. Reading, reflection or a conversation about big questions will feel nourishing.',do:'Take a long walk with a big question and no headphones.',avoid:'Letting the news set your mood for the whole day.'},
          {text:'Optimism is high and so is your appetite for adventure. Enjoy it, and let your body set the pace rather than your enthusiasm.',do:'Try one activity you’ve always been curious about.',avoid:'Pushing your body further than it’s ready to go in one day.'}
        ]
      },
      { // 10: career, goals, reputation
        headline:['Aim high','Your moment to shine','Climbing steadily'],
        day:[
          'The Moon climbs to the top of your chart, putting goals and reputation in the spotlight. A strong day for career moves, important conversations or simply showing what you can do.',
          'Ambition is high and focus comes easily. Use the day to make real progress on something that matters for your future, not just for this week.',
          'People notice your efforts more than usual today. Make sure the work they see is the work you’re proudest of.'
        ],
        love:[
          {text:'Work and love may compete for your time today. Being upfront about a busy schedule now may save a misunderstanding later.',do:'Let someone close know when you’ll be free this evening.',avoid:'Letting the day’s pressure follow you into the evening.'},
          {text:'You may feel more focused than romantic, and that’s fine. Show care through reliability rather than grand gestures.',do:'Be exactly where you said you’d be, when you said you’d be there.',avoid:'Cancelling plans at the last minute because work ran over.'},
          {text:'Admiration plays a part in attraction today. Someone may notice your competence, or you may find yourself drawn to someone with ambition.',do:'Show genuine interest in someone else’s goals.',avoid:'Letting the conversation become a list of your achievements.'}
        ],
        work:[
          {text:'Career progress comes more easily than usual. Take the lead, make your case and show results to the people who matter.',do:'Present your best recent result to someone who can open a door.',avoid:'Downplaying your part in a shared success.'},
          {text:'Long-range goals look clearer than usual, and the way towards one is shorter than it seems. Take a step today, however small.',do:'Tell someone your goal for the month; saying it out loud makes it real.',avoid:'Spreading yourself across so many goals that none gets done.'},
          {text:'Reliability is your best advertisement today. Meet deadlines, keep promises and handle any public role with care.',do:'Double-check the details of anything that goes public today.',avoid:'Leaving a small mistake uncorrected because nobody has noticed yet.'}
        ],
        energy:[
          {text:'Drive is high, but so is the risk of overdoing it. Treat breaks like any other appointment.',do:'Put two short breaks in your calendar and keep them.',avoid:'Answering work emails late into the evening.'},
          {text:'Achievement energises you today. Finish something important and let yourself enjoy the feeling of a job well done.',do:'Take a moment to enjoy one finished task before starting the next.',avoid:'Treating rest as something you earn only when the whole list is done.'},
          {text:'Stamina matters on a long, ambitious day. Look after your body so it can keep up with your plans.',do:'Keep water and something nourishing within reach all day.',avoid:'Pushing on past tiredness just to finish one more thing.'}
        ]
      },
      { // 11: friends, groups, the future
        headline:['Friends first','Strength in numbers','Dream big together'],
        day:[
          'Friends bring good energy today. Reach out to your circle, say yes to an invitation or turn up to something happening in your community.',
          'Hopes and plans for the future feel exciting, and they grow stronger when shared. Tell someone who believes in you what you’re hoping for.',
          'People come together easily under today’s Moon. Teamwork and shared causes are rewarding, and someone you meet by chance may turn out to matter.'
        ],
        love:[
          {text:'Romance may arrive through friends today. A group outing or an introduction could lead somewhere unexpected.',do:'Ask a friend to introduce you to someone new.',avoid:'Turning up already convinced it will be boring.'},
          {text:'Friendship is the foundation of love today, for couples and singles alike. Enjoy someone’s company for its own sake: laughs, plans and gossip included.',do:'Give someone close the best-friend treatment: laughter and full attention.',avoid:'Saving all your best stories for people you barely know.'},
          {text:'Being part of a group feels good, but make sure your own needs don’t get lost. Spend time with friends, then some time just for two.',do:'Make room for a one-to-one conversation after a busy social day.',avoid:'Trying to please everyone in the group at once.'}
        ],
        work:[
          {text:'The people you know can open doors today. A contact through friends or a professional group could prove more useful than expected.',do:'Introduce two people you know who should really meet.',avoid:'Remembering people only when you need a favour.'},
          {text:'Group effort gets further than solo heroics today. Share the work, share the credit, and the result will be better for it.',do:'Hand one task to someone better suited to it.',avoid:'Measuring team success by who did the most.'},
          {text:'Long-term plans come into focus. Think about where you want to be next year and who could help you get there.',do:'Write down one goal for next year and one person who could help.',avoid:'Planning the whole year in a single sitting.'}
        ],
        energy:[
          {text:'Social energy runs high today, and time with friends may lift your mood more than you expect.',do:'Spend an hour with the friend who always makes you laugh.',avoid:'Spending the whole meet-up looking at your phone.'},
          {text:'Shared activities energise you today. A team sport, a class or a volunteering shift will be good for body and mind.',do:'Turn up to a class, a club or a group walk you’ve been curious about.',avoid:'Signing up for more group commitments than your week can carry.'},
          {text:'Optimism about the future lifts your spirits. Dream a little, plan a little and let hope do some of the work.',do:'List three things you’re looking forward to, however small.',avoid:'Letting someone else’s cynicism set the mood for your day.'}
        ]
      },
      { // 12: rest, solitude, behind the scenes
        headline:['A quiet recharge','Behind the scenes','Listen within'],
        day:[
          'Today asks you to slow down: the Moon has slipped behind the curtain. Quiet, solitude and an early night are worth more than any amount of rushing about.',
          'A good day for finishing rather than starting. Return what you borrowed, close what’s still open and let the finished work speak for itself.',
          'Intuition is unusually clear today, though it speaks softly. Give it some quiet: a walk alone, a notebook, a few minutes of doing nothing at all.'
        ],
        love:[
          {text:'Gentle and private is the mood for love today. A quiet evening for two, or some time alone with your thoughts, will feel better than a crowd.',do:'Suggest an evening with no plan beyond good food and unhurried conversation.',avoid:'Saying yes to a crowded evening when you’d rather be quiet.'},
          {text:'Old feelings or memories may drift back today. Let them pass through without making any big decisions about them.',do:'Give an old memory a moment of kindness, then come back to today.',avoid:'Comparing the present with a past that looks rosier from here.'},
          {text:'Quiet kindness speaks loudest today. Small gestures that nobody sees still count, sometimes most of all.',do:'Do one thing that makes someone’s tomorrow a little easier.',avoid:'Doing favours with strings attached.'}
        ],
        work:[
          {text:'Focus may drift and tasks feel slow today. Finish what’s already on the table instead of starting anything new.',do:'Clear one leftover from the week: a reply, a form, a half-finished draft.',avoid:'Taking on new requests before the old ones are done.'},
          {text:'Behind-the-scenes work suits you better than anything public. Research, planning or quiet admin is ideal.',do:'Sort out the files or plans nobody else has time for.',avoid:'Measuring the day by how visible your work was.'},
          {text:'Energy for work is limited, so be realistic about what fits. A lighter schedule and an earlier finish may be the smartest move.',do:'Pick the two tasks that truly matter today and let the rest wait.',avoid:'Judging your whole week by one slow afternoon.'}
        ],
        energy:[
          {text:'Your body is asking for a lower gear today, and it’s worth listening. On a day like this, sleep counts as productive.',do:'Dim the lights an hour earlier than usual tonight.',avoid:'Pushing through tiredness on sugar and caffeine.'},
          {text:'Body and mind ask for recovery rather than effort today. Gentle movement will serve you better than a hard workout.',do:'Take a slow walk with no destination and no step count.',avoid:'Testing your limits on a day that’s asking for rest.'},
          {text:'Rest is near the top of your body’s to-do list today. Check that list before you add anything else to the evening.',do:'Ask yourself what would help most tonight, and do just that.',avoid:'Brushing off tiredness as something to deal with later.'}
        ]
      }
    ]
  },
  humor:{
    events:{
      sunOwn:e=>`At ${e.time} the Sun moves into your sign: birthday season is officially open.`,
      sunIngress:e=>`At ${e.time} the Sun hands over from ${signs.nom[e.from]} to ${signs.nom[e.to]}: a shift change with excellent lighting.`,
      fullMoon:e=>e.own
        ?`The full moon at ${e.time} lands in your sign: your feelings get stage lights and a microphone, so make a cup of tea before sending anything dramatic.`
        :`There’s a full moon ${signs.loc[e.sign]} at ${e.time}: feelings turn the volume up, so maybe keep the group chat on mute.`,
      newMoon:e=>e.own
        ?`At ${e.time} there’s a new moon in your sign: a clean slate, freshly wiped, with your name already in the corner.`
        :`The new moon ${signs.loc[e.sign]} arrives at ${e.time}: perfect for fresh starts, ideally ones that get further than page three of a new notebook.`,
      station:e=>`At ${e.time} `+({
        Mercury:{retrograde:'Mercury turns retrograde: before pressing “Send”, check the recipient twice and the attachment three times.',direct:'Mercury turns direct, and the cosmic Wi-Fi finally stops buffering.'},
        Venus:{retrograde:'Venus turns retrograde: exes may turn up like old receipts in a coat pocket, and neither needs keeping.',direct:'Venus turns direct, and your heart and your shopping basket both stop making decisions at midnight.'},
        Mars:{retrograde:'Mars turns retrograde: a fine time to finish old battles and a poor one to pick a fight with flat-pack furniture.',direct:'Mars turns direct: the to-do list stops staring at you and starts looking slightly nervous.'}
      })[e.body][e.turns],
      moonChange:e=>`The Moon stays in ${signs.nom[e.from]} until ${e.time}, then packs its bags for ${signs.nom[e.to]}.`
    },
    headlines:{sunOwn:'The Sun has come to your party',fullMoonOwn:'Feelings on full beam',newMoonOwn:'New moon, new you (well, almost)'},
    houses:[
      { // 1
        headline:['Main character energy','Your name on the poster','Today’s forecast: you'],
        day:[
          'Home advantage: the Moon is in your sign, so the day comes with your name on the door and your favourite mug already warm. Use it for something you actually want.',
          'You have enough energy today to power a small village, or at least a very ambitious Saturday. Point it at one real goal before it starts reorganising the cutlery drawer.',
          'Your face is broadcasting live today, with no delay and no subtitles. Say what you need out loud as well, so nobody has to guess the plot.'
        ],
        love:[
          {text:'All that charm of yours is working overtime and isn’t even claiming expenses. Put it to good use while it’s on the clock.',do:'Send the message before it becomes a permanent resident of your drafts folder.',avoid:'Asking three friends to proofread a text that says “hi”.'},
          {text:'The filter between your brain and your mouth is off duty today: lovely for compliments, risky for honest reviews of someone’s cooking.',do:'Pay a compliment so specific it couldn’t possibly be about anyone else.',avoid:'Winning tiny arguments that nobody will remember by Friday.'},
          {text:'Emotional antennae fully extended: you’re picking up signals from three streets away. A short reply is usually just a busy thumb, not a secret code.',do:'Ask what someone meant – mind-reading is still in beta.',avoid:'Building an entire crime drama around one “seen” notification.'}
        ],
        work:[
          {text:'Ideas are queuing at the door and the whiteboard looks nervous. Pitch the best one today, while it still has that new-idea smell.',do:'Say your idea out loud today, not to the shower tomorrow.',avoid:'Brilliant ideas that live and die in the notes app.'},
          {text:'Up early and already opinionated about the font: that’s your inner manager. Take charge of one task and enjoy a brief, benevolent reign.',do:'Claim one task as your kingdom and run it beautifully.',avoid:'Redesigning a whole process when you were asked to fix a typo.'},
          {text:'A good mood plus a saved card is a risky duo today, and your shopping basket has noticed.',do:'Give every impulse buy a full night’s sleep before checkout.',avoid:'Gadgets that promise to change your life and end up in a drawer by Tuesday.'}
        ],
        energy:[
          {text:'Battery at 100% and blinking smugly. Spend some of that charge outdoors before it gets wasted on refreshing your inbox.',do:'Take the stairs two at a time at least once, just to prove you can.',avoid:'Pouring all that energy into an argument with the printer.'},
          {text:'Whatever mood you wake up in today will have gone viral by lunchtime, so make sure it’s one worth catching.',do:'Treat your toothbrush as a microphone and the bathroom as a sold-out stadium.',avoid:'Doom-scrolling before the kettle has even boiled.'},
          {text:'Your body has sent a memo marked “urgent”, and the subject line is “me time”. Read it before it escalates to management.',do:'Book an evening meeting with yourself and turn down all requests to reschedule.',avoid:'Spending your one free evening as everyone else’s tech support.'}
        ]
      },
      { // 2
        headline:['Your wallet wants a word','Cosy mode activated','Treasure, or just stuff?'],
        day:[
          'The Moon has opened your banking app and is making small disapproving noises. A calm look at the numbers now will save a dramatic gasp later.',
          'Hibernation is calling: blankets, warm drinks and strong opinions about socks. Lean into it – comfort is today’s productivity tool.',
          'A good day to ask what you truly value. Spoiler: it may turn out to be eight hours of sleep, not the air fryer with eleven settings.'
        ],
        love:[
          {text:'Romance today comes in a mug: a cup of tea made exactly right says “I care” more clearly than any sonnet.',do:'Make someone’s tea so perfectly they suspect you’ve been taking notes.',avoid:'Proving your love with anything that needs a payment plan.'},
          {text:'Wanting to feel appreciated is perfectly reasonable today. If nobody guesses, drop a hint roughly the size of a billboard.',do:'Hand out compliments like free samples: generous, specific and frequent.',avoid:'Holding your love life up against a perfume advert.'},
          {text:'If money comes up with someone close, treat it like defusing a bomb in a film: calm voices, clear wires, no sudden moves.',do:'Talk about the shared bill before it starts living rent-free in your head.',avoid:'Keeping a spreadsheet of who owes whom for biscuits.'}
        ],
        work:[
          {text:'Spring-cleaning season has reached your finances, whatever the calendar says. Somewhere in your statements, a forgotten payment is living the high life on your money.',do:'Find the subscription that has seen less of you than your dentist.',avoid:'A budget built entirely on the hope that next month will be quieter.'},
          {text:'You could sell sand in the desert today, so for once, point that talent at your own pay or prices.',do:'Walk into any money conversation with a calculator in one hand and charm in the other.',avoid:'Working for “exposure” when exposure doesn’t pay the electricity bill.'},
          {text:'The market trader in you is up early and eyeing the clutter. That lamp you never switch on? Somebody out there is searching for exactly that lamp.',do:'List one unused thing for sale and enjoy feeling like a tycoon.',avoid:'Buying a fourth phone charger because the other three are “somewhere”.'}
        ],
        energy:[
          {text:'Today’s official request from your body: soup. Grant it, and the rest of the day will run more smoothly.',do:'Eat something warm, sitting down, as if lunch were a special occasion.',avoid:'Calling a handful of crackers “basically dinner”.'},
          {text:'Your nose, ears and taste buds have formed a union and are demanding treats. Meet their demands before they call a strike.',do:'Bake something purely for the smell, or light the candle you’ve been saving.',avoid:'Motivational posters as a substitute for actual pleasure.'},
          {text:'Routine is your best friend today, the reliable kind who always turns up on time. Keep meals and bedtime on schedule.',do:'Go to bed at a time you’d recommend to a friend.',avoid:'An evening with the pace of a game show’s final round.'}
        ]
      },
      { // 3
        headline:['Chatty and proud','Your inbox has a pulse','Nosy, in a good way'],
        day:[
          'Your thoughts and your thumbs are both running at top speed today. Say the thing you’ve been meaning to say – just reread it once before it leaves the building.',
          'Like a sponge, your brain is soaking up facts, podcasts and other people’s news today. Keep the useful bits and wring out the rest.',
          'A day of short trips: to the shop, to the neighbour’s, to the kitchen for something you then forget. Keep plans loose; the best chat may be the unplanned one.'
        ],
        love:[
          {text:'Words are your love language today, possibly in paragraphs. A well-timed pun can do more for romance than a candlelit dinner.',do:'Send a message that makes someone laugh out loud in public.',avoid:'Replying to “I miss you” with a thumbs-up emoji.'},
          {text:'Your wit is in peak condition today: fast, light and slightly dangerous. Keep the rally going like a good game of tennis, and let the other person score too.',do:'Serve up a question so interesting that the other person forgets their phone exists.',avoid:'Monologues long enough for the other person to fit in a nap.'},
          {text:'Messages are easy to misread today, like a recipe with half the steps missing. When in doubt, use your actual voice – it comes with tone included.',do:'Swap typing for talking before the thread needs footnotes.',avoid:'Treating someone’s full stop as a declaration of war.'}
        ],
        work:[
          {text:'Your words are firing on all cylinders today, so put them to work. That call you’ve been dodging is far less scary than the voicemail icon suggests.',do:'Dial before you’ve rehearsed the conversation for the fourteenth time.',avoid:'Emails so long they need a table of contents.'},
          {text:'Learning mode is on, and your brain is actually enjoying it. Watch the tutorial instead of pressing every button to see what happens.',do:'Spend twenty minutes learning the shortcut that will save you twenty hours.',avoid:'Nodding wisely through an explanation you lost at “so basically”.'},
          {text:'Your brain is making popcorn today: ideas everywhere, some still kernels. Write them all down and serve only the fluffy ones.',do:'Crown one idea the winner by evening and give it a proper go.',avoid:'Pitching all twelve ideas before lunch and finishing none.'}
        ],
        energy:[
          {text:'Restless thoughts need walking, like an energetic dog that has to sniff every lamppost. Take them out for a spin around the block.',do:'Let your thoughts off the lead somewhere green for twenty minutes.',avoid:'Twenty-seven open tabs and a quiet sense of being on top of things.'},
          {text:'Inside your head, a 24-hour news channel is running, ticker and all. Schedule an ad break before bedtime.',do:'Read your brain a bedtime story that isn’t about tomorrow’s to-do list.',avoid:'Holding a two-in-the-morning debate with yourself and losing on points.'},
          {text:'An old friend’s voice could perk you up more than a nap. Social batteries charge fastest on good stories and biscuits.',do:'Call someone who knew you before you could spell your own name.',avoid:'Hiding behind the curtain when the friendly neighbour walks past.'}
        ]
      },
      { // 4
        headline:['Nesting season','Home, sweet sofa','The family channel'],
        day:[
          'The homebody in you has grabbed the remote and isn’t giving it back. A night in may beat any glamorous plan today, and that’s perfectly allowed.',
          'Nostalgia is on the menu, served with stories you’ve heard nine times. Listen anyway: the tenth telling may contain a plot twist.',
          'Somewhere in your home there’s a drawer that knows what you did. Face it today, armed with a bin bag and a good playlist.'
        ],
        love:[
          {text:'Romance has put its slippers on today and has no plans to go out. The sofa beats any fancy restaurant, especially if someone else does the washing-up.',do:'Plan an evening in where the dress code is “fluffy socks”.',avoid:'A night in that quietly turns into a deep-clean of the kitchen.'},
          {text:'Today calls for the patience of a saint and the timing of a diplomat, at least around relatives. Old debates can wait until dessert.',do:'Let a relative finish their story, even the bit you already know by heart.',avoid:'Reopening the great family debate about who broke the vase.'},
          {text:'Your heart’s wish list today is short: safe, warm, fed and possibly the good mug. Share it – nobody can deliver what they don’t know about.',do:'Give someone the best spot on the sofa, the ultimate domestic love letter.',avoid:'Turning a peaceful evening into a summit on whose turn it is to vacuum.'}
        ],
        work:[
          {text:'Your body is busy with the day’s jobs, but your mind is still at home with the kettle on. Give it slow, steady work that doesn’t need its full attention.',do:'Give one fiddly task the care you’d give a thousand-piece jigsaw.',avoid:'Signing important papers while mentally choosing cushion covers.'},
          {text:'Your ideal workplace today has a kettle, a blanket and a door that closes. Wherever you actually are, borrow at least one of the three. Pyjamas strictly optional.',do:'Tidy your workspace as if a very fussy relative were coming to inspect it.',avoid:'Answering work emails from the sofa until the sofa files a complaint.'},
          {text:'That dripping tap and the unopened bill are waving at you from the corner. Deal with one, and your home will stop giving you that look.',do:'Pay one household bill before it sends a reminder with a frown.',avoid:'Buying a sofa for a room you’ve only measured with your eyes.'}
        ],
        energy:[
          {text:'Energy is running on the eco setting today. Recharge at home with something warm, something soft and an embarrassingly early bedtime.',do:'Go to bed early enough to feel slightly rebellious about it.',avoid:'Answering “are you free tonight?” before checking with your sofa.'},
          {text:'Old memories may pop up like adverts you didn’t ask for. Skip the ones that don’t help and replay the good bits.',do:'Put on a song from a year you loved and let it do its work.',avoid:'Rewatching your own old mistakes like a box set with no final episode.'},
          {text:'The hermit in you has requested an hour of privacy, and the request has been approved. Close the door; the world will cope.',do:'Hang an imaginary “closed for maintenance” sign on yourself and mean it.',avoid:'Leaping up for every ping as if it were a parcel you’ve been waiting for.'}
        ]
      },
      { // 5
        headline:['Cupid is on shift','Fun is now compulsory','Your heart wants dessert'],
        day:[
          'Cupid has swapped the bow for a megaphone today. It’s a great time for dates, games and singing in the shower as if nobody can hear (they can).',
          'The child in you has escaped and refuses to come back inside. Let it run: hobbies, creative projects and silly ideas are today’s best power source.',
          'Today fun goes on the to-do list itself, near the top and underlined twice. Pick a hobby, a flirtation or a pillow fort and tick it off with gusto.'
        ],
        love:[
          {text:'Today’s romantic forecast: warm, with a strong chance of butterflies. Attached or not, a dash of nerve could turn an ordinary evening into a story you’ll be telling for years.',do:'Ask someone out with a real time and place, not a vague “we should hang out”.',avoid:'Playing it so cool that your crush needs a thermometer to notice.'},
          {text:'Charm levels are visible from space today. Bask in it, and leave the deep analysis for another week.',do:'Flirt with words, not just emojis – you’re better at it than you think.',avoid:'Asking “so what are we?” before the starters arrive.'},
          {text:'Today’s romance is a game where everyone wins and nobody reads the rules. Singles, follow the loudest laughter; couples, dig out the board games.',do:'Challenge someone to a silly game and play as if there were a trophy.',avoid:'Scheduling romance somewhere between the dentist and the tax return.'}
        ],
        work:[
          {text:'Duty is up against stiff competition from fun today, and fun is winning on points. Let it take the second half, once the essentials are done.',do:'Bribe yourself: one dull task done, one fun task unlocked.',avoid:'Leaving the boring urgent job until it becomes the exciting urgent job.'},
          {text:'Spreadsheets are sulking today, and frankly, who can blame them? Your heart belongs to ideas, sketches and anything with a little sparkle.',do:'Give your wildest idea a coffee and a fair hearing.',avoid:'Giving your most inspired hour to the expenses form.'},
          {text:'Luck feels lively today, but the universe hasn’t signed anything. Treat money ideas like a film trailer: enjoy them, commit to nothing.',do:'Write the brilliant money idea down and look at it again next week.',avoid:'Buying anything from someone who says “opportunity” four times a minute.'}
        ],
        energy:[
          {text:'You’ve got the bounce of a puppy that has just heard the word “walk”. Spend it on something that makes you laugh out loud.',do:'Dance around the kitchen to one song at full volume, no witnesses required.',avoid:'Tracking your hobby with so many charts it becomes a second job.'},
          {text:'Today’s energy recipe is simple: one part game, one part laughter, zero parts productivity. Follow it to the letter.',do:'Build, paint or bake something with no intention of posting it anywhere.',avoid:'Demanding that a perfectly good afternoon of fun justify itself.'},
          {text:'Your heart has teamed up with your feet, and both are in a dancing mood. A blast of daylight and music beats any fizzy energy drink.',do:'Head out in daylight with headphones and a playlist that makes you strut.',avoid:'Letting the laundry pile set the agenda for a perfectly good mood.'}
        ]
      },
      { // 6
        headline:['To-do list, meet your match','Tidy is the new black','The secret life of habits'],
        day:[
          'Today you could clear a backlog with one raised eyebrow. The jobs you’ve been dodging for weeks will fall like dominoes once you nudge the first one.',
          'Your habits are running the show today, from breakfast to bedtime. Get one of them in line and the rest of the day behaves like a well-trained sheepdog.',
          'Everyone is queuing for your attention like customers at a deli counter, from colleagues to the cat. Be useful, but make sure your own ticket gets called too.'
        ],
        love:[
          {text:'Today, romance wears rubber gloves and smells faintly of washing-up liquid. A clean kitchen nobody had to ask for is the modern serenade.',do:'Volunteer for the chore nobody wants and let the gratitude find you.',avoid:'Leaving one spoon in the sink and calling the kitchen “basically done”.'},
          {text:'Your inner inspector is on duty, clipboard and all. Try ticking the “well done” box first; it’s been empty for a while.',do:'Hand out a gold star for an everyday job well done.',avoid:'Treating the way someone stacks plates as a national emergency.'},
          {text:'Affection may have to queue behind the workload today, but a quick message can hold its place in the line.',do:'Send a mid-afternoon message with exactly one heart and zero admin.',avoid:'Cancelling plans with a message shorter than this sentence.'}
        ],
        work:[
          {text:'You’re a productivity machine today, and the admin pile is trembling. Even the fiddliest problem will crack under a bit of stubbornness.',do:'Start with the task you’ve been glaring at for days, then enjoy the smugness.',avoid:'Buying a new planner as a substitute for doing the plan.'},
          {text:'A great day to improve the system, not just survive it. Somewhere in your week there’s a task that could be done in half the time, with half the sighing.',do:'Give one tedious weekly task a shortcut and enjoy the stolen minutes.',avoid:'Replying to every notification like a goalkeeper facing a penalty.'},
          {text:'Today the team is a well-oiled bicycle, and you’re a very important cog. Pedal together and nobody has to push uphill alone.',do:'Lend your superpower to someone stuck, and borrow theirs in return.',avoid:'Saying “sure, no problem” on autopilot before you’ve heard the question.'}
        ],
        energy:[
          {text:'Your body would like a timetable today, not a surprise party. Meals on time and lights out at a decent hour will keep you running like a station clock.',do:'Eat lunch at lunchtime, wild as that may sound.',avoid:'Treating the biscuit tin as a balanced meal.'},
          {text:'Tiny habits punch above their weight today. Gaze out of the window now and then like a philosopher on a break – it counts as eye care.',do:'Stretch like a cat that has just woken up, as often as you remember.',avoid:'Saving every good habit for “next Monday”.'},
          {text:'Anything with fur, feathers or leaves makes excellent company today. Take your break outdoors and let the world do some of the work.',do:'Go outside and greet any dog you meet as if it were a celebrity.',avoid:'Treating fresh air as something that only happens on holiday.'}
        ]
      },
      { // 7
        headline:['Party of two','Better as a duet','Let’s meet halfway'],
        day:[
          'Today is a duet, not a solo. The people around you have the best lines, so pick a good partner and enjoy the harmony.',
          'Every kind of double act is in bloom today, from business deals to treaties over the TV remote. Joint plans go swimmingly, provided nobody hogs the microphone.',
          'Compromise is your superpower today, and you don’t even need a cape. A little give and take could end a standoff that has run longer than some TV series.'
        ],
        love:[
          {text:'Today’s love life is a two-seater, complete with soundtrack. Attached? Your person gets top billing. Single? A one-to-one chat could become a plot twist.',do:'Treat one conversation like a premiere: phone off, full attention, popcorn optional.',avoid:'Inviting the entire group chat along to a date for two.'},
          {text:'Even the topic everyone tiptoes around like a creaky floorboard can be talked through today, calmly and with nobody storming off.',do:'Listen so well that the other person checks you’re feeling all right.',avoid:'Bringing a slideshow to a disagreement about the washing-up.'},
          {text:'Balance is romantic today: give, receive, talk, listen, repeat. Let someone spoil you for once without reaching for your wallet.',do:'Accept a kind gesture with a simple “thank you” and no counter-offer.',avoid:'Planning a joint weekend without consulting the other half of “joint”.'}
        ],
        work:[
          {text:'Your handshake is perfectly calibrated today: firm, warm, not bone-crushing. Deals and joint projects go smoothly with that kind of touch.',do:'Write down who does what before everyone’s memory gets creative.',avoid:'Agreeing to terms you skimmed faster than a cookie banner.'},
          {text:'Two heads are better than one today, especially if one of them is yours. Ask for input before reinventing the wheel.',do:'Borrow a colleague’s brain for ten minutes on your trickiest problem.',avoid:'Defending your first draft like a dragon guarding treasure.'},
          {text:'Goodwill is today’s currency, so spend it wisely and keep a little in reserve for the bit that really matters.',do:'Make a list of deal-breakers, then a shorter list of your real deal-breakers.',avoid:'Haggling over crumbs while the big prize walks out of the door.'}
        ],
        energy:[
          {text:'You’re a mood sponge today, soaking up everyone else’s weather. Stand near the sunny people and let the drizzle pass you by.',do:'Seek out the friend who feels like a warm radiator on a cold day.',avoid:'Signing up as everyone’s free emotional support line.'},
          {text:'After a day as everyone’s plus-one, it’s time to be your own date. Table for one, best seat in the house.',do:'Book an evening for one, with your favourite snack as guest of honour.',avoid:'Replaying someone else’s argument long after they’ve forgotten it.'},
          {text:'Huffing and puffing sounds much better as a duet today. With a friend alongside, a workout turns into a good gossip with occasional jogging.',do:'Recruit a workout buddy whose chat makes the minutes disappear.',avoid:'Turning a friendly stroll into a race nobody else knew about.'}
        ]
      },
      { // 8
        headline:['Going deep, bringing snacks','Secrets and spreadsheets','Letting go, with style'],
        day:[
          'Chit-chat is off the menu today; you’re after the full three-course conversation. Go deep with someone you trust, or with a notebook if people are busy.',
          'Someone – the Moon, probably – is rummaging in the drawer marked “private” today. Open it with the lights on, and the monsters may turn out to be mostly dust.',
          'You’re in a letting-go mood today, and the bag of plastic bags under the sink should be very worried. Wave it off without ceremony.'
        ],
        love:[
          {text:'Intimacy is on the agenda, and the agenda has candles. When someone opens up, leave the toolbox shut – listening is the repair.',do:'Open the vault and share one thing you usually keep under lock and key.',avoid:'Deflecting a tender moment with a pun, however good the pun is.'},
          {text:'Sparks fly easily today, and jealousy may try to tag along uninvited. Your imagination writes great thrillers; just don’t mistake them for the news.',do:'Ask the question you’ve been circling like a cat around a new box.',avoid:'Studying someone’s likes and follows like a forensic team.'},
          {text:'That old hurt has overstayed its welcome in the hotel of your heart. Forgiveness, including the self-service kind, frees up a room.',do:'Write the grudge on a scrap of paper and enjoy shredding it.',avoid:'Quoting last year’s mistakes as evidence in today’s argument.'}
        ],
        work:[
          {text:'The small print looks even smaller than usual today, especially where shared money and loans are involved. Read it like a treasure map.',do:'Ask the awkward “and what happens if…?” question before you sign.',avoid:'Lending money you’d miss more than the person who borrowed it.'},
          {text:'Somewhere in the paperwork, a clue is waiting for you. Today you’re the detective, not the press officer: dig rather than present.',do:'Spend an hour on the problem everyone keeps passing round like a hot potato.',avoid:'Fixing a recurring problem with a fresh roll of sticky tape.'},
          {text:'Debts, owed and owing, are ready for settling. Clearing even a small one will feel like taking off tight shoes.',do:'Pay back the small loan your friend is too polite to mention.',avoid:'Splitting a restaurant bill with a calculator, a ruler and a lawyer.'}
        ],
        energy:[
          {text:'Processing feelings today can be as tiring as swimming in jeans. Float for a while; nobody is timing you.',do:'Make your feelings a cup of tea and hear them out like an old friend.',avoid:'Treating your emotions like an inbox you can archive unread.'},
          {text:'Decluttering is your workout today. Every bag you give away lets your home breathe a little easier, and you with it.',do:'Fill one bag with things to give away and drop it off before you change your mind.',avoid:'Keeping the bread maker because giving it away would mean admitting defeat.'},
          {text:'Your sixth sense has full signal today, and so does your sensitivity. Some people drain your battery faster than a navigation app – keep those visits short.',do:'Leave any gathering the moment your social battery hits 10%.',avoid:'Lying awake directing disaster films that never get released.'}
        ]
      },
      { // 9
        headline:['Passport to curiosity','Think big, then bigger','Adventure, travel-sized'],
        day:[
          'Horizons want stretching today, the way legs do after a long flight. Book the trip, sign up for the course, or at least cook a dish from a country you’ve never visited.',
          'Today’s view is wide-angle, shot from a drone. From up there, your problems look like a small detour on a much bigger map.',
          'The steering wheel belongs to your curiosity today, and honestly, it drives well. Let it take you down a reading rabbit hole or round a corner you’ve never turned.'
        ],
        love:[
          {text:'Your heart fancies a road trip today, even if the budget only stretches to the other side of town. Novelty is today’s best chat-up line.',do:'Take someone to a place neither of you has tried and play tourists.',avoid:'Ordering “the usual” for the four hundredth time.'},
          {text:'Small talk is cancelled; today it’s dreams, plans and the eternal question of which country would suit you best.',do:'Plan an imaginary trip together, right down to the snacks for the journey.',avoid:'Turning a chat about the future into a debating championship.'},
          {text:'Brains are attractive today. Anyone who can explain something complicated in plain words may suddenly look very appealing.',do:'Sit near the front at a talk and ask the question everyone else is thinking.',avoid:'Judging a possible soulmate by their taste in podcasts.'}
        ],
        work:[
          {text:'The strategist in you has climbed a hill for a better view. From up there, the coming months look surprisingly easy to plan.',do:'Write a six-month goal on a sticky note and put it somewhere bossy.',avoid:'Fighting small fires all day while the long-term plan gathers dust.'},
          {text:'Your brain is in the mood for homework today, which is rare and worth exploiting. A course, a workshop or one curious question could level you up.',do:'Sign up for the course you’ve bookmarked three times already.',avoid:'Acting like an expert while secretly searching the term under the table.'},
          {text:'Today’s best opportunity may speak a different language, literally or professionally. Widen your network beyond the people you already have lunch with.',do:'Swap ideas with someone whose job you can’t quite explain to your family.',avoid:'Networking exclusively with the coffee machine.'}
        ],
        energy:[
          {text:'Like a houseplant eyeing a sunnier windowsill, you’re craving new light today. Even a short trip will perk you up.',do:'Explore one unfamiliar street as if you were a travel writer on deadline.',avoid:'Planning a free afternoon so tightly that it needs a project manager.'},
          {text:'The mind is hungry for meaning today, not just memes. A thoughtful book, a podcast or a long talk will feed it properly.',do:'Swap one hour of scrolling for one chapter of something brainy.',avoid:'Bookmarking big ideas for a “someday” that keeps moving.'},
          {text:'You feel brave enough to try anything today, possibly including skydiving before breakfast. Try something new, but maybe start a little closer to the ground.',do:'Join a beginners’ class and enjoy being gloriously bad at something.',avoid:'Booking an extreme adventure before you’ve even found your trainers.'}
        ]
      },
      { // 10
        headline:['Boss mode: on','Ambition with a capital A','Achievement unlocked'],
        day:[
          'Your ambition has just been promoted and is already ordering new business cards. A great day for career moves, important talks or being quietly brilliant in public.',
          'Focus this sharp could slice bread. Aim it at a long-term goal, not just at the inbox.',
          'Your reputation is strutting down the catwalk today. Dress it in your best work – the version you’d happily frame.'
        ],
        love:[
          {text:'Work is hogging the diary today, and love is waiting politely in the queue. A quick message beats being mysteriously unavailable.',do:'Pencil one non-work plan into the diary and guard it like a VIP meeting.',avoid:'Checking work messages under the table during dessert.'},
          {text:'The poet in you is on leave today and the project manager is covering. Turning up on time is romantic too, in its own quiet way.',do:'Keep one small promise with project-manager precision.',avoid:'Answering a sweet message with a list of your deadlines.'},
          {text:'Competence is attractive today, and you may fall for someone’s spreadsheet skills before you notice their eyes.',do:'Be someone’s cheerleader today, pom-poms optional.',avoid:'Turning dinner into a job interview with follow-up questions.'}
        ],
        work:[
          {text:'The career stars are aligned and you’re the headline act. Step into the light, take a bow and make sure the people with the keys are in the audience.',do:'Put your best work where the decision-makers can trip over it.',avoid:'Waiting for your talent to be discovered like a fossil.'},
          {text:'Ambition has had its coffee and is ready to go. Pick a target before lunch and give it a head start.',do:'Give your biggest goal a deadline and a first step it can’t wriggle out of.',avoid:'Holding out for Monday, the first of the month and a full moon to line up before you start.'},
          {text:'That reputation of yours is polished and shining. Keep it that way, and wave graciously from the balcony.',do:'Hand in one piece of work early and watch the eyebrows rise.',avoid:'Promising someone important the moon – it’s already busy with your chart.'}
        ],
        energy:[
          {text:'You’re running on rocket fuel today, but even rockets stop to refuel. Plan your breaks before the day plans them for you.',do:'Eat lunch somewhere your to-do list can’t see you.',avoid:'Running on adrenaline and calling it a personality.'},
          {text:'Finishing things gives you a buzz today that no coffee can match. Tick something off, then bask in the glory like a lizard on a warm rock.',do:'Award yourself a medal for one finished task, even if the medal is a biscuit.',avoid:'Moving the finish line the moment you get near it.'},
          {text:'Ambition runs marathons, and your body is the one wearing the trainers. Treat it like the star athlete, not the support van.',do:'Stand up and shake out your shoulders like a boxer before the next round.',avoid:'Fusing with your chair from the first coffee to the last email.'}
        ]
      },
      { // 11
        headline:['Your people are calling','The group chat is buzzing','Future plans, now trending'],
        day:[
          'The social calendar is clearing its throat and about to make an announcement. Answer the invitation before it gets buried under the memes.',
          'Big dreams are feeling bold today. Share them with someone who’ll cheer, not someone who’ll immediately ask about the budget.',
          'The Moon is in a networking mood, handing out introductions like sweets at a children’s party. A chance contact could turn into the useful kind of “small world”.'
        ],
        love:[
          {text:'Friends may be moonlighting as matchmakers today. The friend who says “you two would get on” might, for once, be right.',do:'Say yes to the group invitation, even if you only know the host.',avoid:'Talking shop all evening while someone interesting waits for a gap.'},
          {text:'Romance and friendship are sharing a sofa today, and neither is fighting for the remote. Good company needs no agenda, just snacks.',do:'Send a friend the meme that only the two of you will understand.',avoid:'Treating your favourite people like furniture: always there, rarely noticed.'},
          {text:'Group fun is great, but your heart is angling for a table for two. Enjoy the crowd, then slip away somewhere quieter.',do:'Sneak off for a quiet chat in the kitchen, where the best talks happen anyway.',avoid:'Being the group’s social secretary while your own evening slips away.'}
        ],
        work:[
          {text:'Networking today feels less like work and more like gossip with a purpose. Ask around: a friend of a friend’s flatmate may be exactly who you need.',do:'Message an old colleague with no agenda beyond a friendly hello.',avoid:'Collecting contacts like stamps and never writing to any of them.'},
          {text:'Teamwork makes the dream work today, just like the posters promise. Pass the ball, spread the glory and save the solo for karaoke.',do:'Give a teammate credit loudly enough for the back row to hear.',avoid:'Doing it all yourself because “it’s faster”, then sighing loudly.'},
          {text:'Your future self has sent a postcard, and it says “thanks for starting today”. Long-term plans grow faster with friends on board.',do:'Tell one well-connected friend about your plan and let the grapevine do its job.',avoid:'Killing a big idea at birth with the words “that will never work”.'}
        ],
        energy:[
          {text:'Your friends are a power bank today: a few hours together and you’re fully charged. Their company will lift you like a song you haven’t heard in years.',do:'Organise the meet-up you’ve been “meaning to arrange” for months.',avoid:'Accepting every invitation and needing a weekend just to recover.'},
          {text:'Even activities with matching T-shirts sound appealing today. A team game or a volunteering shift beats a solo scroll by a mile.',do:'Join a group activity where high fives are practically compulsory.',avoid:'Appointing yourself entertainment manager for everyone else’s fun.'},
          {text:'Hope is in the air today, and it’s a renewable resource, so help yourself to plenty.',do:'Spend ten minutes daydreaming about your future self’s best day.',avoid:'Running your dreams past the grumpiest person you know.'}
        ]
      },
      { // 12
        headline:['Out of office, under a blanket','The grand finale','Snooze button approved'],
        day:[
          'The Moon has hung a “do not disturb” sign on your door. Rest, solitude and a cup of something warm are the only appointments worth keeping.',
          'Loose ends are waving at you from every corner. Tie a few into neat little bows and let at least one long-running saga reach its final episode.',
          'Your gut is whispering today, so turn the volume down on everything else. Dreams and hunches may carry more useful information than the news.'
        ],
        love:[
          {text:'Today’s romantic mood: soft lighting, subtitles and a blanket. Big parties need not apply.',do:'Plan a night in where the hardest task is choosing the film.',avoid:'Starting a deep relationship talk when you’re both at 2% battery.'},
          {text:'Your memory is playing golden oldies on repeat today. Hum along for a minute, then change the station.',do:'Draft your feelings in a notebook first – it never takes screenshots.',avoid:'Texting an ex at midnight just to “see how they are”.'},
          {text:'Your love language today is espionage: secret good deeds, no fingerprints, no applause required.',do:'Leave a small surprise where someone will find it later.',avoid:'Sulking in code and hoping someone has the decoder ring.'}
        ],
        work:[
          {text:'Every task feels like wading through porridge today. Set your expectations to “gentle” and your pace to “tortoise”.',do:'Finish one small task that’s been lurking in the corner for weeks.',avoid:'Launching a bold new project on a day built for naps.'},
          {text:'You’re the stagehand today, not the star, and the show can’t go on without you. The quiet jobs backstage are yours to rule.',do:'Fix one thing nobody else knows is broken.',avoid:'Volunteering for the spotlight on a day made for the wings.'},
          {text:'The work tank is running on fumes, and the next refill is tomorrow. Lighten the load and maybe sneak out a little early.',do:'Give one non-urgent task a holiday until next week.',avoid:'Measuring your worth by how many tabs you have open.'}
        ],
        energy:[
          {text:'Your bed has been promoted to headquarters today. Sleep and quiet aren’t luxuries; they’re official business.',do:'Go to bed so early that your phone wonders if something’s wrong.',avoid:'Saying “just one more thing” to yourself for the eleventh time tonight.'},
          {text:'Today the body asks for a spa day and will settle for a long shower and a book. That’s a bargain – take it.',do:'Choose the gentlest activity on the menu and enjoy it shamelessly.',avoid:'Turning a gentle stretch into an Olympic event.'},
          {text:'Polite hints are arriving from your body today: a yawn here, a stiff shoulder there. Take them seriously before they hire a megaphone.',do:'Sit in silence for five minutes and see what floats up.',avoid:'Answering a yawn with a fourth coffee.'}
        ]
      }
    ]
  }
};
