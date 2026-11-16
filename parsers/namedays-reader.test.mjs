import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {describeName,LANGUAGES,historyBlocks} from '../public/namedays-content.js';
import {readerParagraph} from '../public/namedays-reader.js';

const procedural={
 en:/still needs? (?:checking|to be found)|still being checked|comparison to investigate|exact-form link|explicit reference.+needed|cannot (?:automatically )?be transferred|we have not found|we do not yet have|working (?:proposal|hypothesis)/i,
 ru:/ещё нужно (?:найти|проверить)|ещё проверяется|нужны точная связь|нельзя переносить|мы не нашли|у нас пока нет|рабоч(?:ая|ей|ую) (?:верси|гипотез)/i,
 lv:/vēl jāpārbauda|vēl jāatrod|izcelsmi vēl pārbauda|cilmei pārbaudāms|jāsaglabā precīzā|darba (?:versija|hipotēze)|neesam atraduši/i,
 lt:/dar reikia (?:patikrinti|rasti)|kilmė dar tikrinama|kilmei tirti|darbo (?:versija|prielaida)|paaiškinimo neradome/i,
 et:/vajab veel kontrollimist|päritolu kontrollitakse|päritolu uurides|tööversioon|tööhüpotees|seletust.*pole leidnud/i
};
test('all published name histories use reader language instead of researcher instructions',async()=>{
 for(const country of ['lv','lt','ee']){
  const doc=JSON.parse(await readFile(new URL(`../public/data/namedays/profiles-${country}.json`,import.meta.url),'utf8'));
  for(const p of Object.values(doc.data))for(const lang of LANGUAGES){
   const body=p.display_history[lang].map(b=>b.text).join(' ');
   assert.doesNotMatch(body,procedural[lang],p.key+' '+lang);
   assert.ok(body.length>10,p.key+' '+lang);
  }
 }
});
test('Aleksandris stays a qualified hypothesis with a separate related-name history',async()=>{
 const all=JSON.parse(await readFile(new URL('../public/data/namedays/profiles-lv.json',import.meta.url),'utf8')).data;
 const expected={lv:'Aleksandris varētu būt vārda Aleksandrs variants.',ru:'Aleksandris, возможно, вариант имени Aleksandrs.',en:'Aleksandris may be a variant of Aleksandrs.',lt:'Aleksandris galbūt yra vardo Aleksandrs variantas.',et:'Aleksandris võib olla nime Aleksandrs variant.'};
 for(const lang of LANGUAGES){const copy=describeName(all['lv:Aleksandris'],lang,0,all);
  assert.equal(copy.unverified_hypothesis,true);assert.equal(copy.reviewed_narrative,false);
  assert.equal(copy.history.length,1);assert.match(copy.history[0],/Aleksandrs/);
  assert.equal(copy.history[0],expected[lang]);
  assert.ok(copy.related_context.some(c=>c.name==='Aleksandrs'&&c.history.join(' ').includes('Alexandros')));
  assert.equal(historyBlocks(copy,lang)[0].text,copy.hypothesis_label);
 }
});
test('reader cleanup preserves real uncertainty and dated facts',()=>{
 assert.equal(readerParagraph('Its origin is uncertain. It is recorded in Riga in 1937.','en'),'Its origin is uncertain. It is recorded in Riga in 1937.');
 assert.equal(readerParagraph('The name may come from Greek hagnos, “pure”. This is a hypothesis: we have not found a documented explanation of this name’s origin.','en'),'The name may come from Greek hagnos, “pure”.');
 assert.equal(readerParagraph('It is recorded in 1877; those dated records do not themselves settle the origin.','en'),'It is recorded in 1877.');
});
