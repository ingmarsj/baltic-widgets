import test from 'node:test';
import assert from 'node:assert/strict';
import {fuelCoverage} from './fuel-coverage.mjs';

test('successful collection reports expired community prices and directory-only gaps separately',()=>{
 const now=Date.parse('2026-11-10T20:00:00Z');
 const fresh={price:1.7,observed_at:'2026-11-10T10:00:00Z',source_status:'ok'};
 const old={...fresh,observed_at:'2026-11-05T10:00:00Z',fetched_at:new Date(now).toISOString(),freshness:'recent'};
 const provider=(name,prices)=>({name,prices,stations:[]});
 const result=fuelCoverage([{data:{country:'EE',providers:[provider('Hepa',{petrol95:old,diesel:fresh})]}},
  {data:{country:'LV',providers:[provider('Rietumu Nafta',{diesel:fresh})],more_providers:[provider('Neste',{})]}}],now);
 assert.equal(result.status,'partial');assert.equal(result.available,2);
 assert.deepEqual(result.gaps.map(g=>g.reason),['stale','connected_source_publishes_diesel_only','directory_only_no_fresh_community_report','directory_only_no_fresh_community_report']);
 assert.equal(result.gaps[0].last_published,old.observed_at);
});
test('a failed source is a coverage gap even with a recent publication date',()=>{
 const q={price:1.7,fetched_at:new Date().toISOString(),source_status:'error'};
 const result=fuelCoverage([{data:{country:'EE',providers:[{name:'Test',prices:{petrol95:q,diesel:q},stations:[]}]}}]);
 assert.equal(result.available,0);assert.ok(result.gaps.every(g=>g.reason==='source_unavailable'));
});


test('unreported fuel is distinct from old prices and never asserts that a station does not sell it',()=>{
 const now=Date.parse('2026-11-16T12:00:00Z'),q={price:2.109,observed_date:'2026-11-16',source_status:'ok'};
 const result=fuelCoverage([{data:{country:'LT',providers:[{name:'Utentra',prices:{diesel:q},stations:[]}]}}],now);
 assert.equal(result.available,1);assert.equal(result.network_fuel_pairs,2);assert.equal(result.status,'partial');
 assert.equal(result.gaps[0].reason,'source_does_not_report_fuel');assert.equal(result.gaps[0].source,'lea');
 assert.equal(result.by_reason.source_does_not_report_fuel,1);
});
test('coverage explains old reserve observations and failed primary sources without refreshing quote dates',()=>{
 const now=Date.parse('2026-11-16T12:00:00Z'),old={price:1.8,observed_at:'2026-11-11T12:00:00Z',source_status:'error'};
 const state={sources:[{id:'fuelest',status:'error'},{id:'neste',status:'ok'},{id:'energijascenas',status:'ok',latest_evidence:[{provider_source:'neste',fuel:'95',observed_at:'2026-10-08T12:00:00Z'}]}]};
 const result=fuelCoverage([{data:{country:'EE',providers:[{name:'Hepa',prices:{petrol95:old},stations:[]}]}},{data:{country:'LV',providers:[{name:'Neste',prices:{},stations:[]}]}}],now,state);
 assert.equal(result.gaps[0].reason,'source_unavailable');assert.equal(result.gaps[0].age_hours,120);
 const reserve=result.gaps.find(g=>g.network==='Neste'&&g.fuel==='95');
 assert.equal(reserve.last_published,'2026-10-08T12:00:00Z');assert.equal(reserve.age_hours,936);
 assert.equal(result.available,0);assert.equal(result.network_fuel_pairs,4);
});
