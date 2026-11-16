import {spawnSync} from 'node:child_process';
import path from 'node:path';
const run=(args,options={})=>{const r=spawnSync('git',args,{encoding:'utf8',...options});if(r.status!==0)throw Error(r.stderr||'git '+args[0]+' failed');return r.stdout.trim();};
const branch=run(['branch','--show-current']);
const managed=!branch&&process.env.WIDGETS_PUBLICATION_WORKTREE&&path.resolve(process.env.WIDGETS_PUBLICATION_WORKTREE)===path.resolve('.')&&/^[a-f0-9]{40}$/.test(process.env.WIDGETS_PUBLICATION_MAIN||'')&&run(['rev-parse','HEAD'])===process.env.WIDGETS_PUBLICATION_MAIN&&run(['rev-parse','refs/remotes/origin/main'])===process.env.WIDGETS_PUBLICATION_MAIN;
if(branch!=='main'&&!managed)throw Error('Direct data publication requires main. To update and publish while working on another branch, run scripts/update-widgets.ps1; it uses an isolated origin/main checkout. Merge code changes separately first.');
if(run(['diff','--cached','--name-only']))throw Error('The index already contains staged changes. Commit or unstage those first.');
// Name-day release: files copied from the name-day source branch are committed separately before the data.
const isNameday=f=>/^(data\/namedays|public\/data\/namedays|research\/namedays)\//.test(f)||/nameday/i.test(f.split('/').pop())||f==='scripts/djvu-text.mjs';
const namedays=[];{const parts=run(['status','--porcelain','-z','--untracked-files=all']).split('\0');for(let i=0;i<parts.length;i++){const e=parts[i];if(!e)continue;if('RC'.includes(e[0]))i++;const f=e.slice(3);if(isNameday(f))namedays.push(f);}}
if(namedays.length){run(['add','-A','--pathspec-from-file=-','--pathspec-file-nul'],{input:namedays.join('\0')});run(['commit','-m','Update name-day content '+new Date().toISOString().slice(0,10)]);console.log(`Name-day content committed (${namedays.length} file(s)).`);}
run(['add','--','data/']);
if(run(['diff','--cached','--name-only','--','data/']))run(['commit','-m','Update public widget data '+new Date().toISOString().slice(0,10),'--','data/']);
else console.log('No new data changes; verifying publication of the current revision.');
run(['push','origin','HEAD:refs/heads/main']);
console.log('Data pushed. Waiting for GitHub Pages and checking the public JSON files...');
const verified=spawnSync(process.execPath,['scripts/verify-publication.mjs',run(['rev-parse','HEAD'])],{stdio:'inherit'});
if(verified.status!==0)process.exit(verified.status||1);
