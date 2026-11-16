import {fuelPriceState} from '../public/fuel-freshness.js';

export function fuelCoverage(documents,now=Date.now(),collector=null){
 const gaps=[];let total=0,available=0;
 const sourceNames={Neste:'neste','Rietumu Nafta':'rietumu','Circle K':'circle','Virši':'virsi',Viada:'viada','Straujupīte':'straujupite',KOOL:'kool'};
 for(const document of documents){
  const {country,providers=[],more_providers=[]}=document.data;
  for(const provider of [...providers,...more_providers])for(const fuel of ['petrol95','diesel']){
   total++;
   const quote=provider.prices[fuel],state=fuelPriceState(quote,now);
   if(state==='recent'&&quote.source_status==='ok'){available++;continue;}
   const observations=[quote,...provider.stations.map(s=>s.prices[fuel])].filter(Boolean);
   const source=country==='EE'?'fuelest':country==='LT'?'lea':sourceNames[provider.name]||null;
   const primary=collector?.sources?.find(s=>s.id===source);
   const reserve=country==='LV'?collector?.sources?.find(s=>s.id==='energijascenas'):null;
   const reserveEvidence=(reserve?.latest_evidence||[]).filter(e=>e.provider_source===source&&e.fuel===(fuel==='petrol95'?'95':'diesel'));
   const newest=[...observations,...reserveEvidence].flatMap(q=>q.observed_at||q.observed_date?[q.observed_at||q.observed_date]:[]).sort((a,b)=>Date.parse(b)-Date.parse(a))[0]||null;
   let reason=primary?.status==='error'||quote?.source_status==='error'||state==='recent'?'source_unavailable':state;
   if(reason==='missing'&&!observations.length)reason='source_does_not_report_fuel';
   if(reason!=='source_unavailable'&&country==='LV'&&provider.name==='Neste'&&!observations.length)reason='directory_only_no_fresh_community_report';
   if(reason!=='source_unavailable'&&country==='LV'&&provider.name==='Rietumu Nafta'&&fuel==='petrol95'&&!observations.length)reason='connected_source_publishes_diesel_only';
   gaps.push({country,network:provider.name,fuel:fuel==='petrol95'?'95':'diesel',reason,last_published:newest,
    age_hours:newest?Math.round((new Date(now).getTime()-Date.parse(newest))/360000)/10:null,
    source,source_status:primary?.status||quote?.source_status||null,
    ...(source==='neste'&&country==='LV'?{reserve_status:reserve?.status||null,reserve_error:reserve?.error||null}:{}),
    next_step:reason==='source_unavailable'?'retry_or_repair_source':reason==='stale'?'await_new_observation_or_add_verified_source':'find_source_with_original_price_evidence'});
  }
 }
 return{status:gaps.length?'partial':'complete',network_fuel_pairs:total,available,gaps,by_reason:Object.fromEntries([...new Set(gaps.map(g=>g.reason))].map(reason=>[reason,gaps.filter(g=>g.reason===reason).length]))};
}
