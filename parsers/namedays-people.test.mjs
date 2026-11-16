import test from 'node:test';
import assert from 'node:assert/strict';
import {peopleForDay,validateBirthdays} from '../public/namedays-people.js';
import {text,LANGUAGES} from '../public/namedays-content.js';
import {buildProfile,namesakeIndex,roleFromDescription} from './namedays.mjs';
const person=(id,name,prominence=0,countries=[])=>({id,name,role:'writer',prominence,countries,source:{url:'https://www.wikidata.org/wiki/'+id},match:'exact'});
const born=(id,day,score=0)=>({...person(id,'Birthday '+id,score),birth_day:day,birth_year:1950});

test('famous people retain namesakes above an independent birthday list',()=>{
 const p={country:'lv',people:[person('Q1','Anna Local',1,['lv']),person('Q2','Anna World',999),{...person('Q3','Anne Variant',1000,['lv']),match:'related_form'}]};
 const d=validateBirthdays({schema_version:1,days:{'11-14':[born('Q4','11-14',3),born('Q5','11-14',2),born('Q6','11-14',1)],'11-15':[born('Q7','11-15',999)]}});
 const list=peopleForDay(p,d,'2026-11-14');assert.equal(list.length,5);
 assert.deepEqual(list.map(x=>x.id),['Q1','Q2','Q4','Q5','Q6']);assert.deepEqual(list.map(x=>x.tier),['local','international','birthday','birthday','birthday']);
 assert.equal(peopleForDay({...p,country:'ee'},d,'2026-11-14')[0].id,'Q2');
});
test('adding local namesakes preserves the five birthday celebrities and existing international namesakes',()=>{
 const d=validateBirthdays({schema_version:1,days:{'11-14':Array.from({length:8},(_,i)=>born('QB'+i,'11-14',8-i))}});
 const international=person('QW','Anna World',999),local=person('QL','Anna Local',1,['lv']);
 const before=peopleForDay({country:'lv',people:[international]},d,'2026-11-14');
 const after=peopleForDay({country:'lv',people:[international,local]},d,'2026-11-14');
 assert.equal(before.length,6);assert.equal(after.length,7);assert.equal(after[0].id,'QL');
 assert.deepEqual(after.slice(1).map(p=>p.id),before.map(p=>p.id));
 assert.equal(after.filter(p=>p.tier==='birthday').length,5);
});
test('cached citizenship evidence promotes an exact native-label bearer to the correct country only',()=>{
 const index=namesakeIndex({Q123:{labels:{et:{value:'Mati Example'}},descriptions:{en:{value:'Estonian writer'}}}},[{person:{value:'http://www.wikidata.org/entity/Q123'},country:{value:'http://www.wikidata.org/entity/Q191'},links:{value:'25'},source_id:'PEOPLE-WD-LOCAL117-EE'}],new Set(['Mati']));
 const p=buildProfile('Mati','ee',{},index);
 assert.equal(p.people[0].match,'exact');assert.deepEqual(p.people[0].countries,['ee']);
 assert.equal(p.people[0].country_sources[0].property,'P27');
 assert.equal(peopleForDay(p,null,'2026-11-14')[0].tier,'local');
 assert.equal(peopleForDay({...p,country:'lv'},null,'2026-11-14')[0].tier,'international');
 assert.equal(index.has('Mattias'),false);
});
test('regeneration without the optional citizenship cache preserves published country evidence',()=>{
 const entities={Q123:{labels:{et:{value:'Mati Example'}},descriptions:{en:{value:'Estonian writer'}}}};
 const rows=[{person:{value:'http://www.wikidata.org/entity/Q123'},country:{value:'http://www.wikidata.org/entity/Q191'},links:{value:'25'},source_id:'PEOPLE-WD-LOCAL117-EE'}];
 const previous=buildProfile('Mati','ee',{},namesakeIndex(entities,rows));
 const offline=buildProfile('Mati','ee',{},namesakeIndex(entities,[]),previous);
 assert.deepEqual(offline.people[0].countries,previous.people[0].countries);
 assert.deepEqual(offline.people[0].country_sources,previous.people[0].country_sources);
 assert.equal(peopleForDay(offline,null,'2026-11-14')[0].tier,'local');
});
test('previously unsupported local occupations retain their documented role',()=>{
 for(const description of ['Lithuanian rower','Estonian cross-country skier','Latvian basketball coach'])assert.equal(roleFromDescription(description),'athlete');
 assert.equal(roleFromDescription('Lithuanian translator'),'writer');
 assert.equal(roleFromDescription('Latvian conductor'),'musician');
 assert.equal(roleFromDescription('Estonian linguist'),'scientist');
 assert.equal(roleFromDescription('Lithuanian photographer'),'artist');
 assert.equal(roleFromDescription('Lithuanian university teacher'),'public_figure');
 assert.equal(roleFromDescription('person from Estonia'),null);
 assert.equal(roleFromDescription('Estonian teacher (1907-1985)'),'educator');
 assert.equal(roleFromDescription('teacher and poet'),'poet');
});
test('birthplace associations remain distinct from citizenship evidence',()=>{
 const entities={Q456:{labels:{lv:{value:'Anna Example'}},descriptions:{en:{value:'Latvian photographer'}}}};
 const rows=[{person:{value:'http://www.wikidata.org/entity/Q456'},country:{value:'http://www.wikidata.org/entity/Q211'},country_property:'P19/P17',birthplace:{value:'http://www.wikidata.org/entity/Q1773'},links:{value:'10'},source_id:'PEOPLE-WD-BORN118-LV'}];
 const p=buildProfile('Anna','lv',{},namesakeIndex(entities,rows));
 assert.equal(p.people[0].country_sources[0].property,'P19/P17');
 assert.equal(p.people[0].country_sources[0].birthplace,'http://www.wikidata.org/entity/Q1773');
 assert.equal(peopleForDay(p,null,'2026-11-14')[0].tier,'local');
});
test('birthday fallback deduplicates people, follows leap dates and never invents missing candidates',()=>{
 const a=person('Q1','One',10,['ee']),p={country:'ee',people:[a,a]};
 const d=validateBirthdays({schema_version:1,days:{'02-29':[{...born('Q1','02-29'),name:'One'},born('Q2','02-29')],'03-01':[born('Q3','03-01')]}});
 assert.deepEqual(peopleForDay(p,d,'2028-02-29').map(x=>x.id),['Q1','Q2']);
 assert.deepEqual(peopleForDay(p,d,'2028-03-01').map(x=>x.id),['Q1','Q3']);
 assert.equal(peopleForDay(p,null,'2026-11-14').length,1);
 assert.throws(()=>validateBirthdays({schema_version:1,days:{'02-30':[]}}));
 assert.throws(()=>validateBirthdays({schema_version:1,days:{'11-14':[born('Q2','11-15')]}}));
});
test('famous-people tiers and birthdays are labelled in every UI language',()=>{
 for(const l of LANGUAGES)for(const key of ['people','local','international','birthdayPeople','bornOn','noPeople']){
  const value=text(l,key,{date:'14/11',year:1950});assert.notEqual(value,key);assert.doesNotMatch(value,/\{\w+\}/);
 }
});
