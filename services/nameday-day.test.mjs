import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createDayCompiler} from './nameday-day.mjs';
import {createDayLoader,validateDay} from '../public/namedays-day.js';
import {greetingsForLanguage} from '../public/namedays-greetings.js';
import {greetingsForName} from '../public/namedays-content.js';
import {peopleForDay} from '../public/namedays-people.js';

const person=(id,name,extra={})=>({id,name,role:'artist',match:'exact',countries:['lv'],...extra});
const birthday=person('shared','Shared',{birth_day:'01-01',birth_year:1980,fame_score:100});
const birthdayData={days:{'01-01':[birthday,...Array.from({length:5},(_,i)=>person('b'+i,'Birthday '+i,{birth_day:'01-01',birth_year:1900+i}))]}};
const profile=name=>({key:'lv:'+name,name,country:'lv',facts:{},people:[birthday,person('related','Related',{match:'related'}),person('foreign','Foreign',{countries:['lt']})],display_history:{en:[{type:'heading',text:'Hypothesis'},{type:'paragraph',text:'A qualified explanation.'}]}});

test('greetings are shared across names and families, with six complete variants per mood in every language',()=>{
 for(const language of ['lv','lt','et','ru','en']){
  const greetings=greetingsForLanguage(language);
  for(const copies of Object.values(greetings)){
   assert.equal(copies.length,6);assert.equal(new Set(copies).size,6);
   for(const copy of copies){assert(!copy.includes('{name}'));assert.equal(copy[0],copy[0].toLocaleUpperCase());}
  }
  assert.deepEqual(greetingsForName({name:'Leonard',family:'leonard'},language),greetingsForName({name:'Charlotte',family:'charlotte'},language));
 }
});

test('day delivery separates exact namesakes from country/day birthdays without consuming birthday places',()=>{
 const profiles={'lv:One':profile('One'),'lv:Two':{...profile('Two'),people:[]}};
 const compile=createDayCompiler({calendar:{country:'lv',data:{days:{'01-01':Object.values(profiles).map(p=>({key:p.key,name:p.name}))}}},profiles,birthdays:birthdayData});
 const doc=compile('01-01','en');
 assert.deepEqual(doc.greetings,greetingsForLanguage('en'));
 for(const p of doc.names)assert(!Object.hasOwn(p,'greetings'));
 assert.throws(()=>validateDay({...doc,greetings:undefined},{country:'lv',language:'en',date:'2026-01-01'}),/greetings/);
 assert.throws(()=>validateDay({...doc,greetings:{serious:['{name}, hello'],humor:['Hello']}},{country:'lv',language:'en',date:'2026-01-01'}),/greetings/);
 assert.equal(doc.birthdays.length,5);
 assert.deepEqual(doc.names[0].namesakes.local.map(p=>p.name),['Shared']);
 assert.deepEqual(doc.names[0].namesakes.international.map(p=>p.name),['Foreign']);
 assert.equal(doc.birthdays[0].name,'Shared'); // Same person may correctly occur in two separate tabs.
 assert.deepEqual(doc.names[1].namesakes,{local:[],international:[]});
 assert.deepEqual(doc.names[0].history,profiles['lv:One'].display_history.en);
 assert(!JSON.stringify(doc).includes('Related'));
 for(const forbidden of ['source','source_id','writer_version','updated_at','facts','research_status','birth_year','labels','prominence'])assert(!JSON.stringify(doc).includes('"'+forbidden+'":'),forbidden);
});

test('day loader requests only chosen dates/countries, shares requests and retries failed responses',async()=>{
 const calls=[];let fail=true;
 const load=createDayLoader(new URL('https://example.test/data/namedays/'),{fetchJSON:async url=>{
  calls.push(url.pathname);if(url.pathname.endsWith('01-02.json')&&fail){fail=false;throw Error('Temporary');}
  const [,language,country,day]=url.pathname.match(/\/(en)\/(lv|lt)\/(.*)\.json$/);
  return {day,country,language,names:[],greetings:greetingsForLanguage('en'),birthdays:[]};
 }});
 await Promise.all([load('lv','en','2026-01-01'),load('lv','en','2026-01-01')]);
 assert.deepEqual(calls,['/data/namedays/en/lv/01-01.json']);
 await assert.rejects(load('lv','en','2026-01-02'),/Temporary/);
 await load('lv','en','2026-01-02');await load('lt','en','2026-01-01');
 assert.equal(calls.length,4);
 assert.throws(()=>validateDay({day:'01-01',country:'ee',language:'en',names:[],birthdays:[]},{country:'lv',language:'en',date:'2026-01-01'}),/Invalid/);
});

test('real multilingual day delivery preserves previously visible exact namesakes and edited histories',async()=>{
 const read=async f=>JSON.parse(await readFile(new URL('../public/data/namedays/'+f,import.meta.url),'utf8'));
 const birthdays=await read('people-birthdays.json');
 for(const country of ['lv','lt','ee']){
  const calendar=await read('calendar-'+country+'.json'),profiles=(await read('profiles-'+country+'.json')).data,population=await read('population-'+country+'.json');
  const compile=createDayCompiler({calendar,profiles,population,birthdays});
  for(const day of ['01-01','02-29','11-17','12-31'])for(const language of ['lv','lt','et','ru','en']){
   const doc=validateDay(compile(day,language),{country,language,date:'2000-'+day});
   assert.equal(doc.birthdays.length,5);
   assert.deepEqual(doc.greetings,greetingsForLanguage(language));
   for(const p of doc.names)assert(!Object.hasOwn(p,'greetings'));
   for(const p of doc.names){
    const original=profiles[country+':'+p.name];assert.deepEqual(p.history,original.display_history[language]);
    const previous=peopleForDay(original,birthdays,'2000-'+day).filter(p=>p.tier!=='birthday').map(p=>p.labels?.[language]||p.name);
    assert.deepEqual([...p.namesakes.local,...p.namesakes.international].map(p=>p.name),previous);
   }
  }
 }
});
