import {cp,mkdir,readFile,writeFile,readdir,stat,rm} from 'node:fs/promises';
import path from 'node:path';
import {buildNamedayDays} from './build-nameday-days.mjs';
const root=path.resolve('.'),target=path.join(root,'dist');
await stat(path.join(root,'data','lv','horoscope.json'));
// Always rebuild this exact output directory so retired country files cannot be published.
if(path.dirname(target)!==root||path.basename(target)!=='dist')throw Error('Unsafe build destination');
await rm(target,{recursive:true,force:true});
await mkdir(target,{recursive:true});
await cp(path.join(root,'public'),target,{recursive:true});
await cp(path.join(root,'data'),path.join(target,'data'),{recursive:true});
// Annual editorial/source documents remain build inputs in the repository.
// The browser receives only ready-to-render single-language day documents.
const namedayBuild=await buildNamedayDays({output:path.join(target,'data','namedays')});
for(const file of await readdir(path.join(target,'data','namedays'))){
 if(file.endsWith('.json'))await rm(path.join(target,'data','namedays',file));
}
const namedayRuntime=new Set(['namedays-core.js','namedays-labels.js','namedays-day.js']);
for(const file of await readdir(target))if(file.startsWith('namedays-')&&file.endsWith('.js')&&!namedayRuntime.has(file))await rm(path.join(target,file));
console.log('Name-day delivery:',JSON.stringify(namedayBuild));
await writeFile(path.join(target,'.nojekyll'),'');
async function styles(dir){for(const entry of await readdir(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);if(entry.isDirectory())await styles(file);
  else if(entry.name.endsWith('.css')){const base=path.relative(path.dirname(file),target).split(path.sep).join('/')||'.';const s=await readFile(file,'utf8');await writeFile(file,s.replace(/url\((['"]?)\/(?!\/)/g,`url($1${base}/`));}
}}
await styles(target);console.log('Static site:',target);
