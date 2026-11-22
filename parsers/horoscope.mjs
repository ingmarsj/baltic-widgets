import * as Astronomy from 'astronomy-engine';
import {content} from './horoscope-text/index.mjs';
import {validateReading,horoscopePolicy,areas} from './horoscope-policy.mjs';
import {skyDay,house,elements,rulers,signIds,dayNumber} from './horoscope-sky.mjs';

export const signs=signIds;
export const moods=['serious','humor'];
export const version='local-daily-2.0.0';
// The widget offers three presentations of the same reading (see README).
export const presentations=['do_dont','areas','combined'];
export function calendarDate(now=new Date(),timeZone='Europe/Riga'){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  return ['year','month','day'].map(k=>parts.find(p=>p.type===k).value).join('-');
}
export function nextDate(date){return new Date(Date.parse(date+'T12:00:00Z')+86400000).toISOString().slice(0,10);}
// Find the actual UTC instant for local noon, including DST and fractional UTC offsets.
export function localNoon(date,timeZone){
  let ms=Date.parse(date+'T12:00:00Z');
  for(let i=0;i<3;i++){
    const p=new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(ms);
    const v=k=>Number(p.find(x=>x.type===k).value);
    ms+=Date.parse(date+'T12:00:00Z')-Date.UTC(v('year'),v('month')-1,v('day'),v('hour'),v('minute'),v('second'));
  }
  return new Date(ms);
}
const angle=x=>((x+540)%360)-180;
// Noon positions and aspects, kept for existing consumers of data.facts.
export function sky(date,timeZone){
  const at=localNoon(date,timeZone),positions={};
  for(const body of ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn']){
    const longitude=Astronomy.Ecliptic(Astronomy.GeoVector(body,at,true)).elon;
    const before=Astronomy.Ecliptic(Astronomy.GeoVector(body,new Date(+at-3600000),true)).elon;
    const after=Astronomy.Ecliptic(Astronomy.GeoVector(body,new Date(+at+3600000),true)).elon;
    positions[body]={longitude:Number(longitude.toFixed(4)),sign:signs[Math.floor(longitude/30)],retrograde:angle(after-before)<0};
  }
  const aspects=[];
  for(const a of Object.keys(positions))for(const b of Object.keys(positions).slice(Object.keys(positions).indexOf(a)+1)){
    const separation=Math.abs(angle(positions[a].longitude-positions[b].longitude));
    for(const target of [0,60,90,120,180])if(Math.abs(separation-target)<=3)aspects.push({bodies:[a,b],angle:target,orb:Number(Math.abs(separation-target).toFixed(2))});
  }
  return {sample_at:at.toISOString(),frame:'geocentric tropical ecliptic of date',moon_phase_degrees:Number(Astronomy.MoonPhase(at).toFixed(3)),positions,aspects};
}

export function initializeHoroscope(db){db.exec('CREATE TABLE IF NOT EXISTS horoscope_days (date TEXT NOT NULL, timezone TEXT NOT NULL, version TEXT NOT NULL, generated_at TEXT NOT NULL, payload TEXT NOT NULL, PRIMARY KEY(date,timezone,version))');}

// What each whole-sign house emphasises: item order (first item leads the compact view)
// and base 1–5 ratings for love, work and money, and wellbeing. Ratings never fall below 2.
export const houseProfiles=[
  {order:['energy','love','work'],rating:{love:4,work:4,energy:5}},  // 1 self
  {order:['work','energy','love'],rating:{love:3,work:4,energy:4}},  // 2 money and values
  {order:['work','love','energy'],rating:{love:4,work:4,energy:4}},  // 3 conversations
  {order:['energy','love','work'],rating:{love:4,work:3,energy:3}},  // 4 home and family
  {order:['love','energy','work'],rating:{love:5,work:3,energy:5}},  // 5 joy and romance
  {order:['work','energy','love'],rating:{love:3,work:5,energy:3}},  // 6 routine and health
  {order:['love','work','energy'],rating:{love:5,work:4,energy:3}},  // 7 partners
  {order:['love','work','energy'],rating:{love:4,work:3,energy:3}},  // 8 intimacy and shared money
  {order:['energy','work','love'],rating:{love:4,work:4,energy:4}},  // 9 journeys and learning
  {order:['work','energy','love'],rating:{love:3,work:5,energy:4}},  // 10 career
  {order:['love','work','energy'],rating:{love:4,work:4,energy:4}},  // 11 friends and future
  {order:['energy','love','work'],rating:{love:3,work:2,energy:3}}   // 12 rest
];
// Retrograde personal planets lower the matching area by one star.
export function ratings(h,day){
  const result={...houseProfiles[h-1].rating},retro=body=>day.planets.find(p=>p.body===body)?.retrograde;
  if(retro('Mercury'))result.work--;if(retro('Venus'))result.love--;if(retro('Mars'))result.energy--;
  for(const area of areas)result[area]=Math.max(2,Math.min(5,result[area]));
  return result;
}
// Entry 0–2 of every house list. It changes on each day of a Moon transit (2–3 days), shifts with
// every sidereal month and differs between signs. The month is counted from the transit's first
// day, so all days of one transit get different entries.
const SIDEREAL_MONTH=27.321661;
export const entryIndex=(day,index)=>{
  const start=dayNumber(day.date)-day.moon.day_in_sign;
  return (day.moon.day_in_sign+Math.floor(start/SIDEREAL_MONTH)+index)%3;
};
const at=id=>signs.indexOf(id);

// At most one sentence about an exact event, in order of importance for the reader.
export function skyEvent(day,index){
  if(day.sun.ingress&&at(day.sun.ingress.to)===index)return {kind:'sunOwn',args:{time:day.sun.ingress.time}};
  const lunation=day.moon.events.find(e=>e.id==='full_moon'||e.id==='new_moon');
  if(lunation)return {kind:lunation.id==='full_moon'?'fullMoon':'newMoon',own:at(lunation.sign)===index,args:{time:lunation.time,sign:at(lunation.sign),own:at(lunation.sign)===index}};
  const station=day.planets.find(p=>p.station&&['Mercury','Venus','Mars'].includes(p.body));
  if(station)return {kind:'station',args:{body:station.body,turns:station.station.turns,time:station.station.time}};
  if(day.moon.segments.length>1){const [a,b]=day.moon.segments;return {kind:'moonChange',args:{time:b.from.time,from:at(a.sign),to:at(b.sign)}};}
  if(day.sun.ingress)return {kind:'sunIngress',args:{time:day.sun.ingress.time,to:at(day.sun.ingress.to),from:at(day.sun.ingress.from)}};
  return null;
}

export function compose({lang,mood,index,day}){
  const copy=content[lang][mood],h=house(day.moon.sign,index),entry=entryIndex(day,index),bank=copy.houses[h-1],profile=houseProfiles[h-1];
  if(!bank)throw Error(`${lang}/${mood}: house ${h} has no copy`);
  const event=skyEvent(day,index);
  const special=event?.kind==='sunOwn'?'sunOwn':event?.own?{fullMoon:'fullMoonOwn',newMoon:'newMoonOwn'}[event.kind]:null;
  const stars=ratings(h,day);
  return {
    house:h,entry,event:event?.kind||null,
    headline:special?copy.headlines[special]:bank.headline[entry],
    text:[event&&copy.events[event.kind](event.args),bank.day[entry]].filter(Boolean).join(' '),
    areas:Object.fromEntries(areas.map(area=>[area,{text:bank[area][entry].text,rating:stars[area]}])),
    do:profile.order.map(area=>bank[area][entry].do),
    dont:profile.order.map(area=>bank[area][entry].avoid),
    topic:profile.order[0],do_topic:profile.order[0],avoid_topic:profile.order[0]
  };
}

// Localized, ready-to-render sky panel for one day (shared by all signs).
export function skyPanel(lang,day){
  const module=content[lang],copy=module.sky,segments=day.moon.segments.map(s=>({sign:at(s.sign),from:s.from?.time||null,until:s.until?.time||null}));
  const quarter=day.moon.events[0],withSign=e=>({...e,sign:at(e.sign)});
  return {
    chip:copy.chip(segments),
    moon_phase:{id:day.moon.phase,degrees:day.moon.phase_degrees,illumination:day.moon.illumination},
    rows:[
      {id:'phase',label:copy.labels.phase,value:copy.phase(day.moon.phase,day.moon.illumination,quarter&&withSign(quarter))},
      {id:'moon',label:copy.labels.moon,value:copy.moon(segments,day.moon.until)},
      {id:'sun',label:copy.labels.sun,value:copy.sun(at(day.sun.sign),day.sun.ingress&&{...day.sun.ingress,from:at(day.sun.ingress.from),to:at(day.sun.ingress.to)},day.sun.until)},
      {id:'next_full',label:copy.labels.next_full,value:copy.event(withSign(day.moon.next_full))},
      {id:'next_new',label:copy.labels.next_new,value:copy.event(withSign(day.moon.next_new))}
    ],
    planets:day.planets.map(p=>({id:p.body,label:module.bodies[p.body],retrograde:p.retrograde,value:copy.planet({...p,sign:at(p.sign),ingress:p.ingress&&{...p.ingress,from:at(p.ingress.from),to:at(p.ingress.to)}})}))
  };
}
// Per-sign lines of the sky panel: element and ruler, and the day's house theme.
export function signPanel(lang,day,index){
  const copy=content[lang].sky,ruler=rulers[index],h=house(day.moon.sign,index);
  const rulerSign=ruler==='Sun'?day.sun.sign:ruler==='Moon'?day.moon.sign:day.planets.find(p=>p.body===ruler).sign;
  return {house:h,rows:[
    {id:'sign',label:copy.labels.sign,value:copy.sign(copy.elements[elements[index%4]],ruler,at(rulerSign))},
    {id:'theme',label:copy.labels.theme,value:copy.theme(h,content[lang].houseNames[h-1])}
  ]};
}

export function generateDay(date,timeZone='Europe/Riga',now=new Date()){
  const facts=sky(date,timeZone),day=skyDay(date,timeZone),texts={},panels={};
  for(const lang of Object.keys(content)){
    texts[lang]=signs.map((sign,index)=>Object.fromEntries(moods.map(mood=>[mood,validateReading(compose({lang,mood,index,day}),{lang,mood})])));
    panels[lang]={sky:skyPanel(lang,day),signs:signs.map((sign,index)=>signPanel(lang,day,index))};
  }
  return {date,timezone:timeZone,generated_at:now.toISOString(),facts,sky:day,texts,panels};
}
export function cachedDay(db,date,timeZone,now=new Date()){
  const found=db.prepare('SELECT payload FROM horoscope_days WHERE date=? AND timezone=? AND version=?').get(date,timeZone,version);
  if(found)return JSON.parse(found.payload);
  const result=generateDay(date,timeZone,now);
  db.prepare('INSERT INTO horoscope_days VALUES(?,?,?,?,?)').run(date,timeZone,version,result.generated_at,JSON.stringify(result));return result;
}
// Plain text for consumers that cannot render the structured reading.
export function plainReading(reading,lang){
  const headings={lv:['Dari','Izvairies no'],ru:['Делай','Избегай'],en:['Do','Avoid'],lt:['Daryk','Venk'],et:['Tee','Väldi']}[lang]||['Do','Avoid'];
  return `${reading.headline}. ${reading.text}\n${headings[0]}: ${reading.do.join(' ')}\n${headings[1]}: ${reading.dont.join(' ')}`;
}

export function horoscopeData(db,{lang='lv',timeZone='Europe/Riga',mood='serious',variant='0',now=new Date()}={}){
  if(!moods.includes(mood)&&mood!=='random')throw new Error('Invalid mood');
  // One stable reading per sign and day; the variant parameter is accepted for older callers only.
  if(!['0','1','2','random'].includes(String(variant)))throw new Error('Invalid variant');
  // Limit cache cardinality to supported markets and UTC; no geolocation or natal data required.
  if(!['Europe/Riga','Europe/Vilnius','Europe/Tallinn','UTC'].includes(timeZone))throw new Error('Invalid timezone');
  const selectedMood=mood==='random'?moods[Math.floor(Math.random()*moods.length)]:mood;
  const contentLanguage=content[lang]?lang:content.en?'en':'lv',date=calendarDate(now,timeZone),today=cachedDay(db,date,timeZone,now),tomorrow=cachedDay(db,nextDate(date),timeZone,now);
  return {schema_version:1,updated_at:today.generated_at,source:'Local editorial generator / Astronomy Engine',
    editorial:{method:version,policy_id:horoscopePolicy.id,interpretation:'Entertainment; computed sky positions choose editorial themes, not validated predictions'},
    content_language:contentLanguage,fallback_fields:lang===contentLanguage?[]:['data.signs[].reading','data.sky'],
    data:{format:'daily_reading',presentations,timezone:timeZone,date,tomorrow_date:tomorrow.date,moods,variants_per_mood:1,selected_mood:selectedMood,selected_variant:0,
      generation:{provider:'local_rules',version,generated_at:today.generated_at,next_date:tomorrow.date},
      facts:{today:today.facts,tomorrow:tomorrow.facts},
      sky:{today:today.panels[contentLanguage].sky,tomorrow:tomorrow.panels[contentLanguage].sky},
      signs:signs.map((id,i)=>{
        const a=today.texts[contentLanguage][i],b=tomorrow.texts[contentLanguage][i];
        return {id,name:id,dates:'',topics:{today:a[selectedMood].topic,tomorrow:b[selectedMood].topic},
          today:plainReading(a[selectedMood],contentLanguage),tomorrow:plainReading(b[selectedMood],contentLanguage),
          recommendations:{today:a[selectedMood],tomorrow:b[selectedMood]},
          reading:{today:a,tomorrow:b},
          panel:{today:today.panels[contentLanguage].signs[i],tomorrow:tomorrow.panels[contentLanguage].signs[i]}};
      })}};
}
