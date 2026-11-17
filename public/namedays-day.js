import {dayKey} from './namedays-core.js';

export function validateDay(doc,{country,language,date}){
 const person=p=>p&&typeof p.name==='string'&&!!p.name&&typeof p.description==='string'&&!!p.description;
 if(doc?.country!==country||doc.language!==language||doc.day!==dayKey(date)||!Array.isArray(doc.names)||!Array.isArray(doc.birthdays)||!doc.birthdays.every(person))throw Error('Invalid name-day document');
 const names=new Set();
 for(const p of doc.names){
  if(!p||typeof p.name!=='string'||!p.name||names.has(p.name)||!Array.isArray(p.history)||!p.history.every(b=>['heading','paragraph'].includes(b.type)&&typeof b.text==='string'&&b.text)||!(p.population===null||typeof p.population==='string')||!Array.isArray(p.namesakes?.local)||!Array.isArray(p.namesakes?.international)||![...p.namesakes.local,...p.namesakes.international].every(person)||!['serious','humor'].every(m=>Array.isArray(p.greetings?.[m])&&p.greetings[m].length===3&&p.greetings[m].every(t=>typeof t==='string'&&t)))throw Error('Invalid name-day content');
  names.add(p.name);
 }
 return doc;
}

export function createDayLoader(base,{fetchJSON}){
 const requests=new Map();
 return function loadDay(country,language,date){
  const key=[language,country,dayKey(date)].join('/');
  if(!requests.has(key))requests.set(key,fetchJSON(new URL(key+'.json',base)).then(doc=>validateDay(doc,{country,language,date})).catch(error=>{requests.delete(key);throw error;}));
  return requests.get(key);
 };
}
