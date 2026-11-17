import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {createDayCompiler} from './nameday-day.mjs';
import {validateDay} from '../public/namedays-day.js';

// Shared by the local HTTP server; GitHub Pages uses the build-time exporter.
export function createNamedayDayStore(folder){
 const countries=new Map();
 return async function getDay(country,language,day){
  const files=['calendar-'+country+'.json','profiles-'+country+'.json','population-'+country+'.json','people-birthdays.json'];
  const signature=(await Promise.all(files.map(async file=>{const s=await stat(path.join(folder,file));return s.mtimeMs+':'+s.size;}))).join('/');
  let saved=countries.get(country);
  if(!saved||saved.signature!==signature){
   const promise=Promise.all(files.map(async file=>JSON.parse(await readFile(path.join(folder,file),'utf8')))).then(([calendar,profiles,population,birthdays])=>createDayCompiler({calendar,profiles:profiles.data,population,birthdays}));
   saved={signature,promise,days:new Map()};countries.set(country,saved);
   promise.catch(()=>{if(countries.get(country)===saved)countries.delete(country);});
  }
  const key=language+'/'+day;
  if(!saved.days.has(key))saved.days.set(key,saved.promise.then(compile=>validateDay(compile(day,language),{country,language,date:'2000-'+day})).catch(e=>{saved.days.delete(key);throw e;}));
  return saved.days.get(key);
 };
}
