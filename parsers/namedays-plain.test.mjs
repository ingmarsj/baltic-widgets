import test from 'node:test';
import assert from 'node:assert/strict';
import {plainByRules,rewriteSentence,isCaveat,splitSentences,registerPlainHistories,plainHistory} from '../public/namedays-plain.js';
import {describeName,LANGUAGES} from '../public/namedays-content.js';
import {buildProfile} from './namedays.mjs';
import {reviewedHistory} from '../public/namedays-history.js';

test('plain layer removes source attribution and caveats in all five languages',()=>{
 const text={
  en:['Klāvs Siliņš’s dictionary (1990) explicitly refers Inārija to Ināra. This records a relationship between name forms; it does not by itself resolve the family’s more distant word origin.','The dictionary gives the following historical record: Riga, 1932; calendar 1937. Recorded use and calendar inclusion are different kinds of evidence; neither is automatically a name-creation date.'],
  lv:['Klāva Siliņa vārdnīca (1990) Inārija tieši saista ar Ināra. Tā ir vārda formu saikne, kas pati par sevi nenosaka saimes tālāko leksisko izcelsmi.','Vārdnīca dod šādu vēsturisku ierakstu: Rīga, 1932; kalendārā 1937. Fiksēts lietojums un iekļaušana kalendārā ir atšķirīgas liecības; neviens datums automātiski nenozīmē vārda radīšanu.'],
  ru:['Словарь Клавса Силиньша (1990) прямо отсылает от Inārija к Ināra. Это связь форм имени; сама по себе она не устанавливает дальнее словарное происхождение всей группы.','Словарь приводит следующую историческую запись: Рига, 1932; календарь 1937. Употребление и включение в календарь — разные виды свидетельств; ни одна дата автоматически не означает создание имени.'],
  lt:['Klāvo Siliņšo žodynas (1990) Inārija tiesiogiai sieja su Ināra. Tai vardo formų ryšys, savaime nenustatantis tolimesnės visos grupės leksinės kilmės.','Žodynas pateikia tokį istorinį įrašą: Ryga, 1932; kalendoriuje 1937. Vartojimas ir įtraukimas į kalendorių yra skirtingi liudijimai; nė viena data savaime nereiškia vardo sukūrimo.'],
  et:['Klāvs Siliņši sõnastik (1990) seob nime Inārija otseselt kujuga Ināra. See dokumenteerib nimekujude seose, lahendamata iseenesest nimepere kaugemat sõnalist päritolu.','Sõnastik annab järgmise ajaloolise kirje: Riia, 1932; kalendris 1937. Kasutus ja kalendrisse lisamine on eri liiki tõendid; kumbki daatum ei tähenda automaatselt nime loomist.']
 };
 const p=plainByRules(text);
 assert.deepEqual(p.en,['Inārija is a form of the name Ināra.','Recorded use: Riga, 1932. In the calendar since 1937.']);
 assert.deepEqual(p.lv,['Inārija ir vārda Ināra forma.','Lietojums pierakstīts: Rīga, 1932. Kalendārā kopš 1937. gada.']);
 assert.deepEqual(p.ru,['Inārija — форма имени Ināra.','Употребление зафиксировано: Рига, 1932. В календаре с 1937 года.']);
 for(const l of LANGUAGES)assert.doesNotMatch(p[l].join(' '),/Siliņ|Силиньш|1990|vārdnīc|словар|žodyn|sõnastik|dictionary/);
});

test('genuine uncertainty and narrative facts are kept',()=>{
 for(const s of ['The original etymology of Aikaterine remains uncertain.','A rendering such as “bright” is therefore an interpretation, rather than a single proven meaning.','The name was later associated with Latin agnus, “lamb”, although that is a pun rather than its origin.'])assert.equal(isCaveat(s),false,s);
 assert.equal(rewriteSentence('Its early Greek form is Aikaterinē, whose ultimate origin is unknown.','en'),'Its early Greek form is Aikaterinē, whose ultimate origin is unknown.');
 assert.deepEqual(splitSentences('Rīga, 20. gadsimta otrais ceturksnis. Kalendārā 1937.'),['Rīga, 20. gadsimta otrais ceturksnis.','Kalendārā 1937.']);
});

test('display uses the plain layer while research modules keep their original wording',()=>{
 const raw=reviewedHistory('Inārija','lv');
 assert.match(raw.text.en.join(' '),/Siliņš/);
 for(const lang of LANGUAGES){const c=describeName(buildProfile('Inārija','lv'),lang);assert(c.reviewed_narrative);assert.doesNotMatch(c.history.join(' '),/Siliņ|Силиньш|\(1990\)/);}
});

test('hand-rewritten plain histories take precedence only when complete in five languages',()=>{
 const h={text:{en:['Original.'],lv:['Oriģināls.'],ru:['Оригинал.'],lt:['Originalas.'],et:['Originaal.']}};
 registerPlainHistories('ee',{TestName:{en:['Plain.'],lv:['Vienkārši.']}});
 assert.deepEqual(plainHistory('TestName','ee',h).en,['Original.']);
 registerPlainHistories('ee',{TestName:{en:['Plain.'],lv:['Vienkārši.'],ru:['Просто.'],lt:['Paprastai.'],et:['Lihtsalt.']}});
 assert.deepEqual(plainHistory('TestName','ee',h).en,['Plain.']);
});

test('every hand-rewritten plain history has five languages and names no source authors',async()=>{
 const {plainCalendar}=await import('../public/namedays-plain-calendar.js');
 let n=0;
 for(const [country,entries] of Object.entries(plainCalendar))for(const [name,e] of Object.entries(entries)){
  n++;
  for(const l of LANGUAGES){assert(e[l]?.length&&e[l].every(p=>p.length>10),`${country}:${name}:${l}`);assert.doesNotMatch(e[l].join(' '),/Siliņ|Силиньш|Rajandi|Раянди|Mägiste|Мягисте|Salys|Salio|Салис|undefined|\$\{/,`${country}:${name}:${l}`);}
 }
 assert(n>=120,`only ${n} hand rewrites`);
});
