import {dayKey} from './namedays-core.js';
export function compareFame(a,b){
 const ah=Number.isFinite(a.fame_score),bh=Number.isFinite(b.fame_score);
 return Number(bh)-Number(ah)||(ah&&bh?b.fame_score-a.fame_score:0)||(b.prominence||0)-(a.prominence||0)||a.name.localeCompare(b.name,'en');
}

export function validateBirthdays(doc){
 if(doc?.schema_version!==1||!doc.days||typeof doc.days!=='object')throw Error('Invalid birthday data');
 for(const [day,people] of Object.entries(doc.days)){
  dayKey('2000-'+day);if(!Array.isArray(people))throw Error('Invalid birthday list');
  for(const person of people)if(!person.id||!person.name||!person.role||person.birth_day!==day||!Number.isInteger(person.birth_year)||!person.source?.url)throw Error('Invalid birthday biography');
 }
 return doc;
}

export function peopleForDay(profile,doc,date,birthdayLimit=5){
 const day=dayKey(date),country=profile.country;
 const rank=compareFame;
 // Only exact spelling is eligible for the first two tiers. Related forms remain provenance data.
 const exact=(profile.people||[]).filter(p=>p.match==='exact');
 const local=exact.filter(p=>p.countries?.includes(country)).sort(rank);
 const international=exact.filter(p=>!p.countries?.includes(country)).sort(rank);
 const birthdays=(doc?.days?.[day]||[]).filter(p=>p.birth_day===day).sort(rank);
 const seen=new Set(),names=new Set(),result=[];
 let birthdayCount=0;
 for(const [tier,list] of [['local',local],['international',international],['birthday',birthdays]])for(const person of list){
  if(tier==='birthday'&&birthdayCount>=birthdayLimit)break;
  const identity=person.name.normalize('NFC').toLowerCase();if(seen.has(person.id)||names.has(identity))continue;
  seen.add(person.id);names.add(identity);result.push({...person,tier});if(tier==='birthday')birthdayCount++;
 }
 return result;
}
