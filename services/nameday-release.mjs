// Name-day release: copies editorial changes from the source branch into the isolated publication checkout.
import {rm} from 'node:fs/promises';
import path from 'node:path';

const NAMEDAY_DIRS=/^(data\/namedays|public\/data\/namedays|research\/namedays)\//;
const EDITORIAL_MODULE=/^public\/namedays-(?:attestation|content|history|hypotheses|imagery|people|plain|population|reader|roots)(?:-[\w-]+)?\.js$/;
export function isNamedayPath(file){
 const p=file.replace(/\\/g,'/');
 return NAMEDAY_DIRS.test(p)||EDITORIAL_MODULE.test(p);
}

// git(args,{cwd,input}) preserves leading spaces in porcelain output.
export async function syncNamedays({git,worktree,sourceRef=process.env.WIDGETS_NAMEDAYS_REF||'refs/heads/main',log=console.log}){
 if(!sourceRef||sourceRef==='none'){log('Name-day release disabled.');return{source:null,changed:[]};}
 let source;
 try{source=git(['rev-parse','--verify','--quiet',sourceRef+'^{commit}'],{cwd:worktree});}catch{source='';}
 if(!/^[a-f0-9]{40}$/.test(source)){log(`Name-day release skipped: ${sourceRef} does not exist.`);return{source:null,changed:[]};}
 const base=git(['merge-base','HEAD',source],{cwd:worktree});
 const paths=git(['diff','--name-only','--no-renames','-z',base,source],{cwd:worktree}).split('\0').filter(isNamedayPath);
 const present=new Set(paths.length?git(['ls-tree','-r','-z','--name-only',source],{cwd:worktree}).split('\0'):[]);
 const wanted=paths.filter(file=>present.has(file));
 if(wanted.length){
  git(['checkout',source,'--pathspec-from-file=-','--pathspec-file-nul'],{cwd:worktree,input:wanted.join('\0')});
  // Keep the copied files unstaged; publication stages exactly what it commits.
  git(['reset','-q','--','.'],{cwd:worktree});
 }
 for(const file of paths)if(!present.has(file)){
  const target=path.resolve(worktree,file);
  if(!target.startsWith(path.resolve(worktree)+path.sep))throw Error('Unsafe name-day path '+file);
  await rm(target,{force:true});
 }
 const changed=namedayChanges(git,worktree);
 log(changed.length?`Name-day release from ${sourceRef}: ${changed.length} changed file(s).`:`Name-day release from ${sourceRef}: already published.`);
 return{source,changed};
}

export function namedayChanges(git,cwd){
 const out=git(['status','--porcelain','-z','--no-renames','--untracked-files=all'],{cwd});
 return out.split('\0').map(entry=>entry.slice(3)).filter(isNamedayPath);
}
