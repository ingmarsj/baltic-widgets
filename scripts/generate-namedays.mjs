import {readFile,mkdir,writeFile,rename,unlink,stat,cp} from 'node:fs/promises';
import {parseCalendar,buildProfile,namesakeIndex,evidenceIndex,correctCalendarName,calendarNames} from '../parsers/namedays.mjs';
import {validateCountryCalendar} from '../public/namedays-core.js';
import {WRITER_VERSION,describeName,LANGUAGES} from '../public/namedays-content.js';
const project=new URL('../',import.meta.url),target=new URL('public/data/namedays/',project);
const allCountries=['lv','lt','ee'];
const countryArg=process.argv.find(arg=>arg.startsWith('--country='))?.slice(10);
if(countryArg&&!allCountries.includes(countryArg))throw Error('Invalid --country; expected lv, lt or ee');
const selectedCountries=countryArg?[countryArg]:allCountries;
await mkdir(target,{recursive:true});
// Published calendars may contain stray spaces and reviewed misspellings (CALENDAR_CORRECTIONS);
// normalize them before validating, dropping same-day duplicates that a correction creates.
function correctPublishedCalendar(country,raw){if(raw?.data?.days)for(const [day,names] of Object.entries(raw.data.days)){const seen=new Set();raw.data.days[day]=names.flatMap(n=>calendarNames(country,n.name).map(name=>({key:country+':'+name,name}))).filter(n=>!seen.has(n.key)&&seen.add(n.key));}return raw;}
let calendar;
try{calendar=parseCalendar(await readFile(new URL('namedays.txt',project),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;const c=validateCountryCalendar(correctPublishedCalendar('lv',JSON.parse(await readFile(new URL('calendar-lv.json',target),'utf8'))));calendar={...c,data:{...c.data,source_rows_by_country:{lv:c.data.source_rows},calendars:{lv:c.data.days}}};}
async function json(file,fallback){try{return JSON.parse(await readFile(file,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;return fallback;}}
const researchDir=new URL('var/namedays-research/',project);
const research=await json(new URL('index.json',researchDir),{});
research.book=await json(new URL('book-equivalences.json',researchDir),{});
research.catalog=await json(new URL('catalog-origins.json',researchDir),{});
// Match the full official registry, including shared spellings outside the LT calendar.
for(const record of await json(new URL('vlkk.json',researchDir),[]))if(record.kilmes_pogrupis_1){research.vlkk||={};research.vlkk[record.pilnas_vardas]={subgroup:record.kilmes_pogrupis_1,source:{url:'https://data.gov.lt/datasets/2664/',type:'official_registry',provider:'VLKK'}};}
const entities=await json(new URL('people-entities.json',researchDir),{});
// Curated dataset enrichment stays private; only selected biography fields enter public profiles.
for(const [id,person] of Object.entries(await json(new URL('../var/namedays-research/famous-enrichment.json',project),{})))entities[id]={...entities[id],...person,labels:{...entities[id]?.labels,...person.labels},descriptions:{...entities[id]?.descriptions,...person.descriptions}};
const localEnrichment=await json(new URL('../var/namedays-research/local-enrichment117.json',project),{});
const localBirthplaces=await json(new URL('../var/namedays-research/local-enrichment118.json',project),{});
const localSingle=await json(new URL('../var/namedays-research/local-enrichment119.json',project),{});
for(const [id,person] of Object.entries(localSingle.entities||{}))entities[id]={...person,...entities[id],labels:{...person.labels,...entities[id]?.labels},descriptions:{...person.descriptions,...entities[id]?.descriptions},...(entities[id]?.person_role||person.person_role?{person_role:entities[id]?.person_role||person.person_role}:{})};
for(const [id,person] of Object.entries(localBirthplaces.entities||{}))entities[id]={...person,...entities[id],labels:{...person.labels,...entities[id]?.labels},descriptions:{...person.descriptions,...entities[id]?.descriptions}};
for(const [id,person] of Object.entries(localEnrichment.entities||{}))entities[id]={...person,...entities[id],labels:{...person.labels,...entities[id]?.labels},descriptions:{...person.descriptions,...entities[id]?.descriptions}};
const localRows=[...((await json(new URL('people-wikidata.json',researchDir),await json(new URL('../var/namedays-research/people-wikidata.json',project),{}))).results?.bindings||[]),...(localEnrichment.rows||[]),...(localBirthplaces.rows||[]),...(localSingle.rows||[])];
for(const row of localRows){const id=row.person.value.split('/').pop();entities[id]||={id,labels:{en:{value:row.personLabel.value}},descriptions:{en:{value:row.personDescription?.value||''}}};}
for(const country of ['lt','ee']){
 const raw=await json(new URL('calendar-'+country+'.json',target),null);
 const doc=validateCountryCalendar(correctPublishedCalendar(country,raw));
 calendar.data.calendars[country]=doc.data.days;calendar.data.source_rows_by_country[country]=doc.data.source_rows;
}
const allowedPeopleNames=new Set(Object.values(calendar.data.calendars).flatMap(days=>Object.values(days).flat().map(x=>x.name)));
const reviewedPeople=((await json(new URL('research/namedays/reviewed-people.json',project),{})).people||[]).map(({id,name,labels,aliases,countries,role,source})=>({id,name,labels,aliases,countries,role,source,prominence:1}));
// prominence 1 ranks hand-checked single-biography bearers with other one-sitelink people, below better-known namesakes.
const people=namesakeIndex(entities,localRows,allowedPeopleNames,reviewedPeople);
const HIDE_ZERO_BEARERS=new Set(['lv']);
const documents=[],priorReport=await json(new URL('coverage.json',target),{}),report={writer_version:WRITER_VERSION,enabled_countries:allCountries,source_rows:Object.values(calendar.data.source_rows_by_country).reduce((a,b)=>a+b,0),countries:countryArg?{...priorReport.countries}:{}};
const baselines=Object.fromEntries(await Promise.all(allCountries.map(async country=>[country,(await json(new URL('profiles-'+country+'.json',target),{})).data||{}])));
for(const country of selectedCountries){
 const baseline=process.argv.find(arg=>arg.startsWith('--baseline='))?.slice(11);
 const previous=(baseline?JSON.parse(await readFile(baseline,'utf8')):await json(new URL('profiles-'+country+'.json',target),{})).data||{};
 const evidence=evidenceIndex(research,Object.values(baselines).flatMap(Object.values));
 const entries=[...new Map(Object.values(calendar.data.calendars[country]).flat().map(n=>[n.key,n])).values()];
 const profiles=Object.fromEntries(entries.map(({key,name})=>[key,buildProfile(name,country,research,people,previous[key],evidence)]));
 for(const profile of Object.values(profiles))profile.facts.calendar_dates=Object.entries(calendar.data.calendars[country]).filter(([,names])=>names.some(n=>n.key===profile.key)).map(([date])=>date);
 // Hidden until someone bears the name (user decision, 17 November 2026): a Latvian calendar name with no registered
 // bearer in the PMLP statistics, no reviewed history and no namesake is left out of the published calendar and
 // profiles. It returns automatically when the statistics show at least one bearer.
 const hidden=new Set();
 if(HIDE_ZERO_BEARERS.has(country)){const pop=(await json(new URL('population-'+country+'.json',target),null))?.data;
  if(pop)for(const [key,profile] of Object.entries(profiles))if(!(pop[profile.name.toLocaleUpperCase(country)]>0)&&!(profile.people||[]).length&&!describeName(profile,'en',0,profiles).reviewed_narrative)hidden.add(key);
  for(const key of hidden)delete profiles[key];}
 const publishedDays=hidden.size?Object.fromEntries(Object.entries(calendar.data.calendars[country]).map(([d,names])=>[d,names.filter(n=>!hidden.has(n.key))])):calendar.data.calendars[country];
 const countryCalendar={schema_version:1,country,writer_version:WRITER_VERSION,updated_at:new Date().toISOString(),source:calendar.source,data:{timezone:'Europe/Riga',source_rows:calendar.data.source_rows_by_country[country],days:publishedDays}};
 validateCountryCalendar(countryCalendar);documents.push([new URL('calendar-'+country+'.json',target),countryCalendar]);
 documents.push([new URL('profiles-'+country+'.json',target),{schema_version:1,country,writer_version:WRITER_VERSION,updated_at:new Date().toISOString(),source:'Reviewed references; exact national-language Wiktionary entries; Wikidata, Wikipedia and Pantheon biographies',data:profiles}]);
 report.countries[country]={profiles:Object.keys(profiles).length,hidden_zero_bearers:hidden.size,documented:Object.values(profiles).filter(p=>p.family||p.facts.origins.length||p.facts.first_recorded||p.facts.registry_kind||p.facts.related.length||p.facts.possible_related.length||p.facts.etymons.length||p.facts.archival_variants?.length).length,with_namesakes:Object.values(profiles).filter(p=>p.people.length).length,with_attestation:Object.values(profiles).filter(p=>p.facts.first_recorded).length,with_word_meanings:Object.values(profiles).filter(p=>p.facts.root_key||p.facts.etymons.length).length,research_pending:Object.values(profiles).filter(p=>p.research_status==='pending').length};
 const copies=Object.values(profiles).map(p=>describeName(p,'en',0,profiles));
 report.countries[country].editorial={reviewed_narratives:copies.filter(c=>c.reviewed_narrative).length,factual_summaries:copies.filter(c=>!c.reviewed_narrative&&c.kind!=='unresearched'&&!c.calendar_only&&c.history.length).length,attestation_only:copies.filter(c=>c.calendar_only&&c.attestation).length,needs_research:copies.filter(c=>c.kind==='unresearched').length,unverified_hypotheses:copies.filter(c=>c.unverified_hypothesis).length,fictional_stories:copies.filter(c=>c.story).length,translated_languages:LANGUAGES};
 report.countries[country].editorial.with_related_context=copies.filter(c=>c.related_context.length).length;
 report.countries[country].editorial.with_calendar_entry=Object.values(profiles).filter(p=>p.facts.calendar_entry).length;
}
// Validate every document before publishing any of them; atomic replacement per file.
for(const [file,value] of documents){
 const temp=new URL(file.href+'.'+crypto.randomUUID()+'.tmp');
 try{await writeFile(temp,JSON.stringify(value));await rename(temp,file);}finally{await unlink(temp).catch(e=>{if(e.code!=='ENOENT')throw e;});}
}
await writeFile(new URL('coverage.json',target),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
try{if((await stat(new URL('data/',project))).isDirectory()){
 await mkdir(new URL('data/namedays/',project),{recursive:true});
 for(const file of [...documents.map(([file])=>file),new URL('coverage.json',target)])await cp(file,new URL('data/namedays/'+file.pathname.split('/').pop(),project));
}}catch(e){if(e.code!=='ENOENT')throw e;}
