// Name-day release: copies only the name-day part of a source branch (local main by default) into the isolated
// publication checkout, so name-day histories reach the published site without publishing other unreleased code.
import {rm} from 'node:fs/promises';
import path from 'node:path';

const NAMEDAY_DIRS=/^(data\/namedays|public\/data\/namedays|research\/namedays)\//;
export function isNamedayPath(file){
 const p=file.replace(/\\/g,'/');
 return NAMEDAY_DIRS.test(p)||/nameday/i.test(p.split('/').pop())||p==='scripts/djvu-text.mjs';
}

// git(args,{cwd,input}) runs git and returns trimmed stdout.
export async function syncNamedays({git,worktree,sourceRef=process.env.WIDGETS_NAMEDAYS_REF||'refs/heads/main',log=console.log}){
 if(!sourceRef||sourceRef==='none'){log('Name-day release disabled.');return{source:null,changed:[]};}
 let source;
 try{source=git(['rev-parse','--verify','--quiet',sourceRef+'^{commit}'],{cwd:worktree});}catch{source='';}
 if(!/^[a-f0-9]{40}$/.test(source)){log(`Name-day release skipped: ${sourceRef} does not exist.`);return{source:null,changed:[]};}
 const list=rev=>git(['ls-tree','-r','-z','--name-only',rev],{cwd:worktree}).split('\0').filter(Boolean).filter(isNamedayPath);
 const wanted=list(source),present=new Set(list('HEAD'));
 if(wanted.length){
  git(['checkout',source,'--pathspec-from-file=-','--pathspec-file-nul'],{cwd:worktree,input:wanted.join('\0')});
  // Keep the copied files unstaged; publication stages exactly what it commits.
  git(['reset','-q','--','.'],{cwd:worktree});
 }
 const keep=new Set(wanted);
 for(const file of present)if(!keep.has(file)){
  const target=path.resolve(worktree,file);
  if(!target.startsWith(path.resolve(worktree)+path.sep))throw Error('Unsafe name-day path '+file);
  await rm(target,{force:true});
 }
 const changed=namedayChanges(git,worktree);
 log(changed.length?`Name-day release from ${sourceRef}: ${changed.length} changed file(s).`:`Name-day release from ${sourceRef}: already published.`);
 return{source,changed};
}

export function namedayChanges(git,cwd){
 const out=git(['status','--porcelain','-z','--untracked-files=all'],{cwd});
 const files=[];const parts=out.split('\0');
 for(let i=0;i<parts.length;i++){const e=parts[i];if(!e)continue;const code=e.slice(0,2),file=e.slice(3);if(code[0]==='R'||code[0]==='C')i++;if(isNamedayPath(file))files.push(file);}
 return files;
}
