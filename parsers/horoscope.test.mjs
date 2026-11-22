import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {calendarDate,localNoon,nextDate,sky,initializeHoroscope,horoscopeData,generateDay,moods,signs} from './horoscope.mjs';
import {skyDay} from './horoscope-sky.mjs';
import {localized} from '../services/localization.mjs';
import {validateReading,checkText,areas} from './horoscope-policy.mjs';
import {content} from './horoscope-text/index.mjs';

const languages=Object.keys(content);
// A sentence ends before a capital letter or an opening quote, so „plkst. 9.23” is not split.
const sentences=text=>text.split(/(?<=[.!?…][”“»]?)\s+(?=[\p{Lu}„«“])/u);
// Every authored string of a reading: headline, day text, area texts, Do and Avoid items.
const authored=reading=>[reading.headline,reading.text,...areas.map(a=>reading.areas[a].text),...reading.do,...reading.dont];

test('local day and noon respect Riga DST and year rollover',()=>{
  assert.equal(calendarDate(new Date('2026-11-05T22:30:00Z')),'2026-11-06');
  assert.equal(localNoon('2026-03-28','Europe/Riga').toISOString(),'2026-03-28T10:00:00.000Z');
  assert.equal(localNoon('2026-03-29','Europe/Riga').toISOString(),'2026-03-29T09:00:00.000Z');
  assert.equal(nextDate('2026-12-31'),'2027-01-01');
});

test('astronomy uses geocentric tropical longitudes rather than fixed calendar guesses',()=>{
  const facts=sky('2026-11-05','Europe/Riga');
  assert.equal(facts.positions.Sun.sign,'scorpio');assert.equal(facts.positions.Sun.retrograde,false);
  assert.ok(facts.positions.Moon.longitude>=0&&facts.positions.Moon.longitude<360);
});

test('sky events are found with exact local times for the whole day, not only at noon',()=>{
  const sunday=skyDay('2026-11-22');
  assert.deepEqual([sunday.sun.ingress.time,sunday.sun.ingress.to],['09:23','sagittarius']);
  assert.deepEqual(sunday.moon.segments.map(s=>s.sign),['aries','taurus']);
  assert.equal(sunday.moon.segments[1].from.time,'12:10');
  // The Moon is in Aries at noon but in Taurus for most of the waking day.
  assert.equal(sunday.moon.sign,'taurus');
  const fullMoon=skyDay('2026-11-24');
  assert.deepEqual(fullMoon.moon.events.map(e=>[e.id,e.time,e.sign]),[['full_moon','16:54','gemini']]);
  assert.equal(fullMoon.moon.segments[1].from.time,'13:10');
  assert.equal(fullMoon.moon.illumination,100);
  const station=skyDay('2027-02-09').planets.find(p=>p.body==='Mercury');
  assert.equal(station.station.turns,'retrograde');
  assert.equal(skyDay('2027-03-03').planets.find(p=>p.body==='Mercury').station.turns,'direct');
  // DST change day still covers a full local calendar day.
  assert.ok(skyDay('2027-03-28').moon.segments.length>=1);
});

test('every language module passes the mechanical editorial rules',()=>{
  assert.ok(languages.includes('lv'));
  for(const lang of languages){
    const module=content[lang],seen=new Set();
    const check=(text,kind,where)=>{
      assert.deepEqual(checkText(text,{lang,kind}),[],`${lang} ${where}: ${text}`);
      const key=text.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
      assert.ok(!seen.has(key),`${lang} ${where} repeats: ${text}`);seen.add(key);
    };
    for(const mood of moods){
      assert.equal(module[mood].houses.length,12,`${lang} ${mood} houses`);
      module[mood].houses.forEach((h,i)=>{
        for(const n of [0,1,2]){
          check(h.headline[n],'headline',`${mood} ${i+1} headline`);check(h.day[n],'day',`${mood} ${i+1} day`);
          for(const area of areas){const e=h[area][n];check(e.text,'area',`${mood} ${i+1} ${area}`);check(e.do,'do',`${mood} ${i+1} ${area} do`);check(e.avoid,'avoid',`${mood} ${i+1} ${area} avoid`);}
        }
      });
    }
  }
});

test('the editorial gate rejects gendered address, wrong quotes, negative Do items and repeated headings',()=>{
  const day=generateDay('2026-11-22');
  const reading=day.texts.lv[0].serious;
  assert.doesNotThrow(()=>validateReading(reading,{lang:'lv',mood:'serious'}));
  const bad=[
    {...reading,do:['Ja esi noguris, atpūties vakarā mājās.',...reading.do.slice(1)]},
    {...reading,do:['Neuzņemies vēl vienu darbu aiz pieklājības.',...reading.do.slice(1)]},
    {...reading,dont:['No solījumiem, kurus pildīt var tikai ar veiksmi.',...reading.dont.slice(1)]},
    {...reading,dont:['Strīdiem par "pareizo" atbildi vēlu vakarā.',...reading.dont.slice(1)]},
    {...reading,dont:[reading.do[0],...reading.dont.slice(1)]},
    {...reading,areas:{...reading.areas,love:{...reading.areas.love,rating:7}}}
  ];
  for(const item of bad)assert.throws(()=>validateReading(item,{lang:'lv',mood:'serious'}));
  assert.ok(checkText('Ты готов к переменам, и это видно.',{lang:'ru',kind:'area'}).includes('gendered direct address'));
});

test('one stable reading per sign and day; all twelve signs differ; sky panel and fallbacks are complete',()=>{
  const db=new DatabaseSync(':memory:');initializeHoroscope(db);
  try{
    const options={lang:'lv',now:new Date('2026-11-22T12:00:00Z')};
    const a=horoscopeData(db,options),b=horoscopeData(db,{...options,now:new Date('2026-11-22T20:00:00Z')});
    assert.deepEqual(a.data.signs[0].reading,b.data.signs[0].reading);
    assert.equal(db.prepare('SELECT count(*) n FROM horoscope_days').get().n,2);
    assert.equal(a.data.format,'daily_reading');assert.deepEqual(a.data.presentations,['do_dont','areas','combined']);
    assert.equal(a.data.signs.length,12);
    for(const day of ['today','tomorrow'])for(const mood of moods){
      const readings=a.data.signs.map(sign=>sign.reading[day][mood]);
      assert.equal(new Set(readings.map(r=>r.house)).size,12,'each sign has its own house');
      assert.equal(new Set(readings.map(r=>r.do.join('|'))).size,12,'no two signs share Do items');
      for(const reading of readings)assert.doesNotThrow(()=>validateReading(reading,{lang:'lv',mood}));
    }
    // Sagittarius on the day the Sun enters its sign.
    const sagittarius=a.data.signs[signs.indexOf('sagittarius')].reading.today.serious;
    assert.match(sagittarius.text,/plkst\. 9\.23/u);assert.equal(sagittarius.headline,'Sākas tavs mēnesis');
    assert.equal(a.data.sky.today.chip,'Mēness Aunā · no 12.10 Vērsī');
    assert.deepEqual(a.data.sky.today.rows.map(r=>r.id),['phase','moon','sun','next_full','next_new']);
    assert.equal(a.data.sky.today.planets.length,5);
    assert.equal(a.data.signs[0].panel.today.rows.length,2);
    assert.equal(typeof a.data.signs[0].today,'string');assert.ok(a.data.signs[0].today.includes('Dari:'));
    assert.throws(()=>horoscopeData(db,{...options,mood:'playful'}));
    assert.throws(()=>horoscopeData(db,{...options,variant:'-1'}));
    assert.throws(()=>horoscopeData(db,{...options,timeZone:'invalid'}));
    const random=horoscopeData(db,{...options,mood:'random'});assert.ok(moods.includes(random.data.selected_mood));
    for(const lang of ['lv','ru','en','lt','et']){
      const doc=localized(horoscopeData(db,{...options,lang}),lang,'horoscope');
      assert.equal(doc.content_language,content[lang]?lang:content.en?'en':'lv');
      assert.equal(doc.fallback_fields.length>0,!content[lang]);
    }
    const rolled=horoscopeData(db,{...options,now:new Date('2026-11-22T22:05:00Z')});
    assert.equal(rolled.data.date,'2026-11-23');assert.deepEqual(rolled.data.signs[0].reading.today,a.data.signs[0].reading.tomorrow);
  }finally{db.close();}
});

test('readings never repeat a sentence on adjacent days and do not recycle within a week',()=>{
  let date='2026-11-21';const days=[];
  for(let i=0;i<75;i++){days.push(generateDay(date));date=nextDate(date);}
  for(const lang of languages)for(const mood of moods)for(let s=0;s<12;s++){
    for(let i=1;i<days.length;i++){
      const today=days[i].texts[lang][s][mood],before=days[i-1].texts[lang][s][mood];
      const a=new Set(authored(before).flatMap(sentences));
      const shared=authored(today).flatMap(sentences).filter(x=>a.has(x));
      assert.deepEqual(shared,[],`${lang} ${mood} ${signs[s]} ${days[i].date}`);
      if(i>=6)assert.notDeepEqual(today,days[i-6].texts[lang][s][mood]);
      // Houses change every two or three days, so a week shows no recycled house copy.
      if(i>=7){
        const week=new Set(days.slice(i-7,i).flatMap(d=>authored(d.texts[lang][s][mood]).slice(2)));
        assert.deepEqual(authored(today).slice(2).filter(x=>week.has(x)),[],`${lang} ${mood} ${signs[s]} ${days[i].date} weekly`);
      }
    }
  }
});
