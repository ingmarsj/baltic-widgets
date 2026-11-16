import {DatabaseSync} from 'node:sqlite';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {widgetData} from '../services/database.mjs';
import {fuelCoverage} from '../services/fuel-coverage.mjs';

// Read one consistent fuel snapshot. No source requests, schedule changes or exports.
const dir=path.resolve(process.env.DATA_DIR||'var'),db=new DatabaseSync(path.join(dir,'widgets.sqlite'),{readOnly:true});
let documents;
try{db.exec('BEGIN');documents=['LV','LT','EE'].map(country=>widgetData(db,country));db.exec('COMMIT');}
finally{db.close();}
let collector=null;
try{collector=JSON.parse(await readFile(path.join(dir,'collector/fuel-stations.json'),'utf8'));}
catch(error){if(error.code!=='ENOENT')throw error;}
const report={checked_at:new Date().toISOString(),...fuelCoverage(documents,Date.now(),collector),
 source_failures:(collector?.sources||[]).filter(source=>source.status==='error').map(({id,error,last_attempt_at})=>({id,error,last_attempt_at}))};
await mkdir('artifacts',{recursive:true});
await writeFile('artifacts/fuel-coverage-report.json',JSON.stringify(report,null,2)+'\n');
console.log(`Fuel coverage: ${report.status} (${report.available}/${report.network_fuel_pairs}). Source failures: ${report.source_failures.length}.`);
console.table(report.gaps.map(({country,network,fuel,reason,last_published,age_hours,source_status})=>({country,network,fuel,reason,last_published,age_hours,source_status})));
console.log('Report: artifacts/fuel-coverage-report.json');
