import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtemp,mkdir,copyFile,writeFile,utimes,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';

const windows=process.platform==='win32';
const quote=value=>"'"+value.replaceAll("'","''")+"'";
async function fixture(t,{publish=false,fail=false,stale=false,plan=false,clean=false}={}){
 const root=await mkdtemp(path.join(tmpdir(),'widgets-summary-'));
 t.after(()=>rm(root,{recursive:true,force:true}));
 await mkdir(path.join(root,'scripts'));await mkdir(path.join(root,'artifacts'));
 const script=path.join(root,'scripts','update-widgets.ps1'),report=path.join(root,'artifacts','update-report.json');
 await copyFile(new URL('../scripts/update-widgets.ps1',import.meta.url),script);
 if(stale){await writeFile(report,JSON.stringify({errors:['STALE ERROR']}));await utimes(report,new Date('2000-01-01'),new Date('2000-01-01'));}
 let writeReport=`[IO.File]::WriteAllText(${quote(report)},'{"errors":["fuel: simulated source error"],"fuel_coverage":{"status":"partial","available":1,"network_fuel_pairs":2,"gaps":[{"country":"EE","network":"Hepa","fuel":"95","reason":"stale","last_published":"2026-11-11"}]}}')`;
 if(clean)writeReport=writeReport.replace('["fuel: simulated source error"]','[]');
 const publicationReport=path.join(root,'artifacts','publication-report.json');
 const writePublicationError=publish&&fail?`[IO.File]::WriteAllText(${quote(publicationReport)},'{"error":"Pages verification failed"}')`:'';
 const mock=publish?
  `function global:node { ${stale?'':writeReport}; ${writePublicationError}; Write-Host 'PUBLICATION FINISHED'; $global:LASTEXITCODE = ${fail?1:0} }`:
  `function global:npm.cmd { if ($args[0] -eq 'test') { Write-Host 'TESTS FINISHED'; $global:LASTEXITCODE = ${fail?1:0} } elseif ($args[1] -eq 'build') { Write-Host 'BUILD FINISHED'; $global:LASTEXITCODE = 0 } else { ${plan?'':writeReport}; $global:LASTEXITCODE = 0 } }`;
 return spawnSync('powershell.exe',['-NoProfile','-ExecutionPolicy','Bypass','-Command',`$ErrorActionPreference='Stop'; ${mock}; & ${quote(script)} ${plan?'-Plan':publish?'':'-NoPublish'}`],{encoding:'utf8'});
}
for(const publish of [false,true])test(`final summary follows ${publish?'publication':'build'} output`,{skip:!windows},async t=>{
 const result=await fixture(t,{publish});assert.equal(result.status,0,result.stderr);
 const summary=result.stdout.indexOf('=== UPDATE ERROR SUMMARY ===');
 assert(summary>result.stdout.indexOf(publish?'PUBLICATION FINISHED':'BUILD FINISHED'));
 assert(result.stdout.indexOf('=== FINAL FUEL COVERAGE: partial (1/2) ===')>result.stdout.indexOf(publish?'PUBLICATION FINISHED':'BUILD FINISHED'));
 assert(result.stdout.includes('EE / Hepa / 95: stale; last price: 2026-11-11'));
 assert(result.stdout.slice(summary).includes('fuel: simulated source error'));
});
test('test failure still repeats source and fatal errors at the end',{skip:!windows},async t=>{
 const result=await fixture(t,{fail:true});assert.notEqual(result.status,0);
 const summary=result.stdout.slice(result.stdout.indexOf('=== UPDATE ERROR SUMMARY ==='));
 assert(summary.includes('fuel: simulated source error'));assert(summary.includes('Project checks failed'));
 assert(!result.stdout.includes('BUILD FINISHED'));
});
test('early publication failure does not repeat a stale previous report',{skip:!windows},async t=>{
 const result=await fixture(t,{publish:true,fail:true,stale:true});assert.notEqual(result.status,0);
 assert(result.stdout.includes('=== UPDATE ERROR SUMMARY ==='));assert(!result.stdout.includes('STALE ERROR'));
 assert(result.stdout.includes('Publication: Pages verification failed'));
});
test('plan mode does not report old collection errors',{skip:!windows},async t=>{
 const result=await fixture(t,{plan:true,stale:true});assert.equal(result.status,0,result.stderr);
 assert(!result.stdout.includes('UPDATE ERROR SUMMARY'));assert(!result.stdout.includes('STALE ERROR'));
});


test('partial coverage remains visible after successful publication without inventing an update error',{skip:!windows},async t=>{
 const result=await fixture(t,{publish:true,clean:true});assert.equal(result.status,0,result.stderr);
 assert(result.stdout.indexOf('=== FINAL FUEL COVERAGE: partial (1/2) ===')>result.stdout.indexOf('PUBLICATION FINISHED'));
 assert(!result.stdout.includes('UPDATE ERROR SUMMARY'));
});
