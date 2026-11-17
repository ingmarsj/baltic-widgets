import {calendarNames,dayKey} from '../public/namedays-core.js';
import {describeName,historyBlocks,roleLabel,LANGUAGES} from '../public/namedays-content.js';
import {greetingsForLanguage} from '../public/namedays-greetings.js';
import {text} from '../public/namedays-labels.js';
import {compareFame} from '../public/namedays-people.js';
import {populationCopy} from '../public/namedays-population.js';

const locales={lv:'lv-LV',lt:'lt-LT',et:'et-EE',ru:'ru-RU',en:'en-GB'};
function distinct(people){const ids=new Set(),names=new Set();return people.filter(p=>{const name=p.name.normalize('NFC').toLowerCase();if(ids.has(p.id)||names.has(name))return false;ids.add(p.id);names.add(name);return true;});}

// Birthday selection belongs to a country/day, never to a selected given name.
// Keep country explicit: future local-birthday weighting can differ per calendar.
export function birthdayPeopleForCountry(doc,day,country,limit=5){
 if(!['lv','lt','ee'].includes(country))throw Error('Invalid birthday country');
 return distinct((doc?.days?.[day]||[]).filter(p=>p.birth_day===day).sort(compareFame)).slice(0,limit);
}

export function createDayCompiler({calendar,profiles,population,birthdays}){
 const cache=new Map();
 return (day,lang)=>{
  const country=calendar.country,date='2000-'+day;
  dayKey(date);if(!LANGUAGES.includes(lang))throw Error('Invalid day language');
  const dateLabel=new Intl.DateTimeFormat(locales[lang],{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));
  const personCopy=p=>({name:p.labels?.[lang]||p.name,description:roleLabel(p.role,lang)});
  const names=calendarNames(calendar,country,date).map(({key})=>{
   const cacheKey=key+':'+lang;if(cache.has(cacheKey))return cache.get(cacheKey);
   const p=profiles[key];if(!p)throw Error('Missing profile '+key);
   const exact=(p.people||[]).filter(p=>p.match==='exact');
   const ordered=distinct([...exact.filter(p=>p.countries?.includes(country)).sort(compareFame),...exact.filter(p=>!p.countries?.includes(country)).sort(compareFame)]);
   const value={name:p.name,history:p.display_history?.[lang]||historyBlocks(describeName(p,lang,0,profiles),lang),population:populationCopy(population,p.name,country,lang)?.title||null,
    namesakes:{local:ordered.filter(p=>p.countries?.includes(country)).map(personCopy),international:ordered.filter(p=>!p.countries?.includes(country)).map(personCopy)}};
   cache.set(cacheKey,value);return value;
  });
  const birthdayCopies=birthdayPeopleForCountry(birthdays,day,country).map(p=>({...personCopy(p),description:roleLabel(p.role,lang)+' · '+text(lang,'bornOn',{date:dateLabel,year:p.birth_year})}));
  return {day,country,language:lang,names,greetings:greetingsForLanguage(lang),birthdays:birthdayCopies};
 };
}
