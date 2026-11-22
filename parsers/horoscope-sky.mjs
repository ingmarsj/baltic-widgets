import * as Astronomy from 'astronomy-engine';

// Exact sky events for one local calendar day. All instants are computed, then
// rendered in the market time zone (Riga, Vilnius and Tallinn share one zone).
export const signIds=['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
export const planets=['Mercury','Venus','Mars','Jupiter','Saturn'];
export const elements=['fire','earth','air','water'];
// Traditional rulers, because the generator computes the seven classical bodies only.
export const rulers=['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'];
const HOUR=3600000,MINUTE=60000,DAY=86400000,MAIN_TIME='15:00';
const norm=x=>((x%360)+360)%360;
const angle=x=>((x+540)%360)-180;

export function longitude(body,ms){return norm(Astronomy.Ecliptic(Astronomy.GeoVector(body,new Date(ms),true)).elon);}
export const signOf=lon=>Math.floor(norm(lon)/30);

function zoned(ms,timeZone){
  const p=new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(ms);
  const v=k=>p.find(x=>x.type===k).value;
  return {date:`${v('year')}-${v('month')}-${v('day')}`,time:`${v('hour')}:${v('minute')}`,parts:[+v('year'),+v('month'),+v('day'),+v('hour'),+v('minute'),+v('second')]};
}
// The UTC instant of a local wall-clock time, including DST changes.
export function localInstant(date,time,timeZone){
  const target=Date.parse(`${date}T${time}:00Z`);let ms=target;
  for(let i=0;i<3;i++){const [y,m,d,h,min,s]=zoned(ms,timeZone).parts;ms+=target-Date.UTC(y,m-1,d,h,min,s);}
  return ms;
}
export function nextDate(date){return new Date(Date.parse(date+'T12:00:00Z')+DAY).toISOString().slice(0,10);}
export function previousDate(date){return new Date(Date.parse(date+'T12:00:00Z')-DAY).toISOString().slice(0,10);}
export function dayNumber(date){return Math.floor(Date.parse(date+'T12:00:00Z')/DAY);}
// Rounded to the minute, never shown with seconds.
function stamp(ms,timeZone){const r=Math.round(ms/MINUTE)*MINUTE,z=zoned(r,timeZone);return {at:new Date(r).toISOString(),date:z.date,time:z.time};}

// Sign changes of a body between two instants, refined by bisection to the second.
export function ingresses(body,start,end,step=body==='Moon'?HOUR:6*HOUR){
  const found=[];let t=start,s=signOf(longitude(body,t));
  while(t<end){
    const u=Math.min(t+step,end),su=signOf(longitude(body,u));
    if(su!==s){
      let a=t,b=u;while(b-a>1000){const m=(a+b)/2;if(signOf(longitude(body,m))===s)a=m;else b=m;}
      found.push({body,from:signIds[s],to:signIds[su],ms:b});
    }
    t=u;s=su;
  }
  return found;
}
const speed=(body,ms)=>angle(longitude(body,ms+HOUR)-longitude(body,ms-HOUR));
function stations(body,start,end){
  const a=speed(body,start),b=speed(body,end);if(Math.sign(a)===Math.sign(b))return [];
  let lo=start,hi=end;while(hi-lo>MINUTE){const m=(lo+hi)/2;if(Math.sign(speed(body,m))===Math.sign(a))lo=m;else hi=m;}
  return [{body,turns:b<0?'retrograde':'direct',ms:hi}];
}
const quarterIds=['new_moon','first_quarter','full_moon','last_quarter'];
function quarters(start,end){
  const found=[];let q=Astronomy.SearchMoonQuarter(new Date(start));
  while(q.time.date.getTime()<end){found.push({id:quarterIds[q.quarter],ms:q.time.date.getTime()});q=Astronomy.NextMoonQuarter(q);}
  return found;
}
// Phase name for the whole day: a quarter event wins, otherwise waxing or waning at noon.
function phaseOf(noon,events){
  const event=events[0];if(event)return event.id;
  return Astronomy.MoonPhase(new Date(noon))<180?'waxing':'waning';
}
// Search far enough back that a slow Saturn season is still found.
function lastIngress(body,before,days){
  const step=body==='Moon'?HOUR:body==='Sun'?6*HOUR:DAY;
  for(let span=days;span<=days*16;span*=2){const list=ingresses(body,before-span*DAY,before,step);if(list.length)return list.at(-1);}
  return null;
}
function nextIngress(body,after,days){
  const step=body==='Moon'?HOUR:body==='Sun'?6*HOUR:DAY;
  for(let span=days;span<=days*16;span*=2){const list=ingresses(body,after,after+span*DAY,step);if(list.length)return list[0];}
  return null;
}

export function skyDay(date,timeZone='Europe/Riga'){
  const start=localInstant(date,'00:00',timeZone),end=localInstant(nextDate(date),'00:00',timeZone),noon=localInstant(date,'12:00',timeZone);
  // The day's main Moon sign is the one that holds the Moon longer between 07:00 and 23:00,
  // i.e. the sign at 15:00. Morning and evening changes are still reported with exact times.
  const main=localInstant(date,MAIN_TIME,timeZone),moonLon=longitude('Moon',main),moonSign=signOf(moonLon);
  const moonChanges=ingresses('Moon',start,end);
  const moonStart=signOf(longitude('Moon',start));
  const moonSince=lastIngress('Moon',start+MINUTE,3),moonUntil=nextIngress('Moon',start,3);
  // Day segments: one sign all day, or two (rarely three) with exact local times.
  const segments=[];let from=null,sign=moonStart;
  for(const change of moonChanges){segments.push({sign:signIds[sign],from,until:stamp(change.ms,timeZone)});from=stamp(change.ms,timeZone);sign=signOf(longitude('Moon',change.ms+MINUTE));}
  segments.push({sign:signIds[sign],from,until:null});
  const events=quarters(start,end).map(e=>({...stamp(e.ms,timeZone),id:e.id,sign:signIds[signOf(longitude('Moon',e.ms))]}));
  const nextFull=Astronomy.SearchMoonPhase(180,new Date(end),35).date.getTime(),nextNew=Astronomy.SearchMoonPhase(0,new Date(end),35).date.getTime();
  const sunChange=ingresses('Sun',start,end,HOUR)[0];
  const sunSince=lastIngress('Sun',end,35),sunUntil=nextIngress('Sun',end,35);
  const planetFacts=planets.map(body=>{
    const lon=longitude(body,noon),change=ingresses(body,start,end,3*HOUR)[0],station=stations(body,start,end)[0];
    return {body,sign:signIds[signOf(lon)],degree:Math.floor(lon%30),retrograde:speed(body,noon)<0,
      ingress:change?{...stamp(change.ms,timeZone),from:change.from,to:change.to}:null,
      station:station?{...stamp(station.ms,timeZone),turns:station.turns}:null};
  });
  // Count earlier local days with the same main Moon sign (0 on the first day).
  let dayInSign=0;for(let d=previousDate(date);dayInSign<3&&signOf(longitude('Moon',localInstant(d,MAIN_TIME,timeZone)))===moonSign;d=previousDate(d))dayInSign++;
  return {
    date,timezone:timeZone,noon:new Date(noon).toISOString(),
    moon:{sign:signIds[moonSign],degree:Math.floor(moonLon%30),day_in_sign:dayInSign,segments,
      since:moonSince?{...stamp(moonSince.ms,timeZone),sign:moonSince.to}:null,
      until:moonUntil?{...stamp(moonUntil.ms,timeZone),sign:moonUntil.to}:null,
      phase:phaseOf(noon,events),phase_degrees:Number(Astronomy.MoonPhase(new Date(noon)).toFixed(2)),
      illumination:Math.round(Astronomy.Illumination('Moon',new Date(noon)).phase_fraction*100),
      events,next_full:{...stamp(nextFull,timeZone),sign:signIds[signOf(longitude('Moon',nextFull))]},next_new:{...stamp(nextNew,timeZone),sign:signIds[signOf(longitude('Moon',nextNew))]}},
    sun:{sign:signIds[signOf(longitude('Sun',noon))],degree:Math.floor(longitude('Sun',noon)%30),
      ingress:sunChange?{...stamp(sunChange.ms,timeZone),from:sunChange.from,to:sunChange.to}:null,
      since:sunSince?{...stamp(sunSince.ms,timeZone),sign:sunSince.to}:null,until:sunUntil?{...stamp(sunUntil.ms,timeZone),sign:sunUntil.to}:null},
    planets:planetFacts
  };
}
// Whole-sign house of a body for a reader's sign: 1 = the reader's own sign.
export const house=(bodySign,readerIndex)=>((signIds.indexOf(bodySign)-readerIndex+12)%12)+1;
