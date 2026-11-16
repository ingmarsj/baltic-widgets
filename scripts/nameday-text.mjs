// Inspect the exact published History tab without assembling research modules.
import {readFile} from 'node:fs/promises';
const args=Object.fromEntries(process.argv.slice(2).map(v=>{const [k,...parts]=v.replace(/^--/,'').split('=');return[k,parts.join('=')];}));
const {name,country='lv',lang='en'}=args;
if(!name||!['lv','lt','ee'].includes(country)||!['lv','ru','en','lt','et'].includes(lang))throw Error('Usage: node scripts/nameday-text.mjs --name=Uģis --country=lv --lang=ru');
const doc=JSON.parse(await readFile(new URL(`../public/data/namedays/profiles-${country}.json`,import.meta.url),'utf8'));
const profile=doc.data[country+':'+name.normalize('NFC')];
if(!profile?.display_history?.[lang])throw Error('Published history not found; generate name-day data first.');
console.log(profile.display_history[lang].map(b=>b.text).join('\n\n'));
