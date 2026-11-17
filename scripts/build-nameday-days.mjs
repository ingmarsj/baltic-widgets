import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createDayCompiler} from '../services/nameday-day.mjs';
import {LANGUAGES} from '../public/namedays-content.js';
import {validateCountryCalendar} from '../public/namedays-core.js';
import {validateBirthdays} from '../public/namedays-people.js';
import {validatePopulation} from '../public/namedays-population.js';

export async function buildNamedayDays({input=path.resolve('public/data/namedays'),output=path.resolve('dist/data/namedays')}={}){
 const read=async name=>JSON.parse(await readFile(path.join(input,name),'utf8'));
 const birthdays=validateBirthdays(await read('people-birthdays.json'));
 let files=0,bytes=0;
 for(const country of ['lv','lt','ee']){
  const calendar=validateCountryCalendar(await read('calendar-'+country+'.json'));
  const profiles=(await read('profiles-'+country+'.json')).data;
  const population=validatePopulation(await read('population-'+country+'.json'),country);
  const compile=createDayCompiler({calendar,profiles,population,birthdays});
  for(const language of LANGUAGES){
   const dir=path.join(output,language,country);await mkdir(dir,{recursive:true});
   for(let date=new Date('2000-01-01T12:00:00Z');date.getUTCFullYear()===2000;date.setUTCDate(date.getUTCDate()+1)){
    const day=date.toISOString().slice(5,10),body=JSON.stringify(compile(day,language));
    await writeFile(path.join(dir,day+'.json'),body);files++;bytes+=Buffer.byteLength(body);
   }
  }
 }
 return {files,bytes};
}
