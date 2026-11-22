// Checks one language module of horoscope copy and prints sample readings for review.
// Usage: node scripts/check-horoscope-text.mjs lv [--partial] [--samples] [--days=120]
import {checkText,areas} from '../parsers/horoscope-policy.mjs';
import {skyDay,nextDate,signIds} from '../parsers/horoscope-sky.mjs';
const args=process.argv.slice(2),lang=args.find(a=>!a.startsWith('--'))||'lv';
const partial=args.includes('--partial'),samples=args.includes('--samples');
const days=Number((args.find(a=>a.startsWith('--days='))||'--days=120').split('=')[1]);
const module=(await import(`../parsers/horoscope-text/${lang}.mjs`)).default;
const problems=[],seen=new Map();
const normalize=text=>text.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
function check(text,kind,path){
  for(const problem of checkText(text,{lang,kind}))problems.push(`${path}: ${problem} — ${JSON.stringify(text)}`);
  if(typeof text!=='string')return;
  const key=normalize(text);if(seen.has(key))problems.push(`${path}: duplicate of ${seen.get(key)} — ${JSON.stringify(text)}`);else seen.set(key,path);
}
const expect=(condition,message)=>{if(!condition)problems.push(message);};
// An area text sits under its heading („Mīlestība”), so it must not open with the same word.
const {readFileSync}=await import('node:fs');
const labels=JSON.parse(readFileSync(new URL('../public/data/translations.json',import.meta.url),'utf8'))[lang]||{};
const stem=text=>text.toLocaleLowerCase(lang).replace(/^[^\p{L}]+/u,'').slice(0,4);
const repeatsHeading=(area,text)=>labels['horoscope_'+area]&&stem(text)===stem(labels['horoscope_'+area]);
expect(module.lang===lang,`lang must be "${lang}"`);
expect(module.signs?.nom?.length===12&&module.signs?.loc?.length===12,'signs.nom and signs.loc need 12 forms each');
expect(['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn'].every(b=>typeof module.bodies?.[b]==='string'),'bodies needs all seven names');
expect(module.houseNames?.length===12,'houseNames needs 12 entries');
for(const key of ['moon','phase','sun','next_full','next_new','planets','sign','theme'])expect(typeof module.sky?.labels?.[key]==='string',`sky.labels.${key} is missing`);
for(const key of ['new_moon','first_quarter','full_moon','last_quarter','waxing','waning'])expect(typeof module.sky?.phases?.[key]==='string',`sky.phases.${key} is missing`);
for(const key of ['fire','earth','air','water'])expect(typeof module.sky?.elements?.[key]==='string',`sky.elements.${key} is missing`);
for(const fn of ['chip','moon','phase','event','sun','planet','sign','theme'])expect(typeof module.sky?.[fn]==='function',`sky.${fn} must be a function`);
for(const mood of ['serious','humor']){
  const copy=module[mood];if(!copy){problems.push(`${mood} is missing`);continue;}
  for(const fn of ['sunOwn','sunIngress','fullMoon','newMoon','station','moonChange'])expect(typeof copy.events?.[fn]==='function',`${mood}.events.${fn} must be a function`);
  for(const key of ['sunOwn','fullMoonOwn','newMoonOwn'])check(copy.headlines?.[key],'headline',`${mood}.headlines.${key}`);
  const houses=copy.houses||[];
  if(!partial)expect(houses.length===12,`${mood}.houses needs 12 houses, found ${houses.length}`);
  houses.forEach((h,i)=>{
    const at=`${mood}.houses[${i}] (house ${i+1})`;
    for(const key of ['headline','day'])expect(h[key]?.length===3,`${at}.${key} needs 3 entries`);
    h.headline?.forEach((t,n)=>check(t,'headline',`${at}.headline[${n}]`));
    h.day?.forEach((t,n)=>check(t,'day',`${at}.day[${n}]`));
    for(const area of areas){
      expect(h[area]?.length===3,`${at}.${area} needs 3 entries`);
      h[area]?.forEach((e,n)=>{
        check(e.text,'area',`${at}.${area}[${n}].text`);check(e.do,'do',`${at}.${area}[${n}].do`);check(e.avoid,'avoid',`${at}.${area}[${n}].avoid`);
        if(typeof e.text==='string'&&repeatsHeading(area,e.text))problems.push(`${at}.${area}[${n}].text: opens with the area heading „${labels['horoscope_'+area]}” — ${JSON.stringify(e.text)}`);
      });
    }
  });
}
// Render every computed sentence for a range of real days.
const at=id=>signIds.indexOf(id);
let date='2026-11-21';const rendered=new Map();
const reported=new Set(),report=message=>{if(!reported.has(message)){reported.add(message);problems.push(message);}};
const render=(kind,fn,path)=>{try{const text=fn();if(typeof text!=='string'||/undefined|NaN|null|\[object/.test(text))report(`${path}: bad output ${JSON.stringify(text)}`);else{for(const p of checkText(text,{lang,kind}))report(`${path}: ${p} — ${JSON.stringify(text)}`);if(!rendered.has(path))rendered.set(path,text);}}catch(error){report(`${path}: ${error.message}`);}};
for(let i=0;i<days&&module.sky?.chip;i++,date=nextDate(date)){
  const day=skyDay(date),s=module.sky,segments=day.moon.segments.map(x=>({sign:at(x.sign),from:x.from?.time||null,until:x.until?.time||null}));
  const tag=`${date} ${segments.length>1?'moon-change':'moon-all-day'}`;
  render('sky',()=>s.chip(segments),`sky.chip ${segments.length}`);
  render('sky',()=>s.moon(segments,day.moon.until),`sky.moon ${segments.length}`);
  const q=day.moon.events[0];render('sky',()=>s.phase(day.moon.phase,day.moon.illumination,q&&{...q,sign:at(q.sign)}),`sky.phase ${q?.id||day.moon.phase}`);
  render('sky',()=>s.event({...day.moon.next_full,sign:at(day.moon.next_full.sign)}),'sky.event');
  render('sky',()=>s.sun(at(day.sun.sign),day.sun.ingress&&{...day.sun.ingress,from:at(day.sun.ingress.from),to:at(day.sun.ingress.to)},day.sun.until),`sky.sun ${day.sun.ingress?'ingress':'steady'}`);
  for(const p of day.planets)render('sky',()=>s.planet({...p,sign:at(p.sign),ingress:p.ingress&&{...p.ingress,from:at(p.ingress.from),to:at(p.ingress.to)}}),`sky.planet ${p.ingress?'ingress':p.station?'station-'+p.station.turns:p.retrograde?'retrograde':'direct'}`);
  for(let index=0;index<12;index++){
    render('sky',()=>s.sign(s.elements[['fire','earth','air','water'][index%4]],'Jupiter',at(day.moon.sign)),`sky.sign ${index%4}`);
    render('sky',()=>s.theme((index%12)+1,module.houseNames[index%12]),`sky.theme ${index}`);
  }
  for(const mood of ['serious','humor']){
    const ev=module[mood]?.events;if(!ev)continue;
    if(day.sun.ingress){render('event',()=>ev.sunOwn({time:day.sun.ingress.time}),`${mood}.events.sunOwn`);render('event',()=>ev.sunIngress({time:day.sun.ingress.time,to:at(day.sun.ingress.to),from:at(day.sun.ingress.from)}),`${mood}.events.sunIngress`);}
    for(const e of day.moon.events)if(e.id==='full_moon'||e.id==='new_moon')for(const own of [true,false]){const kind=e.id==='full_moon'?'fullMoon':'newMoon';render('event',()=>ev[kind]({time:e.time,sign:at(e.sign),own}),`${mood}.events.${kind} own=${own}`);}
    for(const body of ['Mercury','Venus','Mars'])for(const turns of ['retrograde','direct'])render('event',()=>ev.station({body,turns,time:'14:05'}),`${mood}.events.station ${body} ${turns}`);
    if(segments.length>1)render('event',()=>ev.moonChange({time:segments[1].from,from:segments[0].sign,to:segments[1].sign}),`${mood}.events.moonChange`);
  }
}
if(samples||problems.length===0){
  console.log(`\nRendered examples (${lang}):`);
  for(const [path,text] of rendered)console.log(`  ${path.padEnd(38)} ${text}`);
}
if(!partial&&problems.length===0){
  const {generateDay}=await import('../parsers/horoscope.mjs');
  const {content}=await import('../parsers/horoscope-text/index.mjs');
  if(!content[lang])console.log(`\n${lang} is not registered in parsers/horoscope-text/index.mjs yet.`);
  else{
    // Full readings for the reviewer: an ordinary day, the Sun's ingress and a full moon.
    for(const [d,i] of [['2026-11-22',8],['2026-11-24',2],['2026-11-27',5]]){
      const day=generateDay(d);
      for(const mood of ['serious','humor']){
        const r=day.texts[lang][i][mood];
        console.log(`\n${d} · ${module.signs.nom[i]} · ${mood} · house ${r.house} · entry ${r.entry}\n  ${r.headline}\n  ${r.text}\n  ${areas.map(a=>`${a} ${'★'.repeat(r.areas[a].rating)}: ${r.areas[a].text}`).join('\n  ')}\n  DO: ${r.do.join(' | ')}\n  AVOID: ${r.dont.join(' | ')}`);
      }
    }
  }
}
console.log(problems.length?`\n${problems.length} problem(s):\n- ${problems.join('\n- ')}`:`\nNo problems found in ${lang}.`);
process.exitCode=problems.length?1:0;
