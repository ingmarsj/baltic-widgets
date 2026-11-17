import {greetingsForLanguage} from './namedays-greetings.js';
import {formatAttestation,attestationPeriod} from './namedays-attestation.js';
import {reviewedHistory,reusedHistory} from './namedays-history.js';
import {unverifiedHistory,HYPOTHESIS_LABELS} from './namedays-hypotheses.js';
import {historySupplement} from './namedays-hypotheses-supplements.js';
import {rootHistory,reviewedRoot} from './namedays-roots.js';
import {plainHistory,plainHypothesis} from './namedays-plain.js';
import {finalWording} from './namedays-plain-r163.js';
import {readerParagraph} from './namedays-reader.js';
import {readerOpening} from './namedays-reader-r168.js';
export const WRITER_VERSION='namedays-1.10.0';
export function nameIdentity(name){return name.normalize('NFD').replace(/(\p{Script=Latin})\p{M}+/gu,'$1').normalize('NFC').replace(/\.$/,'').toLowerCase();}
export const LANGUAGES=['lv','ru','en','lt','et'];
import {text} from './namedays-labels.js';
export {text} from './namedays-labels.js';
export function hash(value){let h=2166136261;for(const c of value)h=Math.imul(h^c.codePointAt(0),16777619);return h>>>0;}
const traditions={
 "French": [
  "franču",
  "французские",
  "French",
  "prancūzų",
  "prantsuse"
 ],
 "German": [
  "vācu",
  "немецкие",
  "German",
  "vokiečių",
  "saksa"
 ],
 "Old High German": [
  "senaugšvācu",
  "древневерхненемецкие",
  "Old High German",
  "senosios vokiečių aukštaičių",
  "vanaülemsaksa"
 ],
 "Middle High German": [
  "vidusaugšvācu",
  "средневерхненемецкие",
  "Middle High German",
  "vidurinės vokiečių aukštaičių",
  "keskülemsaksa"
 ],
 "English": [
  "angļu",
  "английские",
  "English",
  "anglų",
  "inglise"
 ],
 "Latin": [
  "latīņu",
  "латинские",
  "Latin",
  "lotynų",
  "ladina"
 ],
 "Ancient Greek": [
  "sengrieķu",
  "древнегреческие",
  "Ancient Greek",
  "senovės graikų",
  "vanakreeka"
 ],
 "Greek": [
  "grieķu",
  "греческие",
  "Greek",
  "graikų",
  "kreeka"
 ],
 "Hebrew": [
  "ivrita",
  "древнееврейские",
  "Hebrew",
  "hebrajų",
  "heebrea"
 ],
 "Russian": [
  "krievu",
  "русские",
  "Russian",
  "rusų",
  "vene"
 ],
 "Germanic languages": [
  "ģermāņu",
  "германские",
  "Germanic",
  "germanų",
  "germaani"
 ],
 "Proto-Germanic": [
  "pirmģermāņu",
  "прагерманские",
  "Proto-Germanic",
  "germanų prokalbės",
  "alggermaani"
 ],
 "Swedish": [
  "zviedru",
  "шведские",
  "Swedish",
  "švedų",
  "rootsi"
 ],
 "Danish": [
  "dāņu",
  "датские",
  "Danish",
  "danų",
  "taani"
 ],
 "Finnish": [
  "somu",
  "финские",
  "Finnish",
  "suomių",
  "soome"
 ],
 "Estonian": [
  "igauņu",
  "эстонские",
  "Estonian",
  "estų",
  "eesti"
 ],
 "Latvian": [
  "latviešu",
  "латышские",
  "Latvian",
  "latvių",
  "läti"
 ],
 "Lithuanian": [
  "lietuviešu",
  "литовские",
  "Lithuanian",
  "lietuvių",
  "leedu"
 ],
 "Polish": [
  "poļu",
  "польские",
  "Polish",
  "lenkų",
  "poola"
 ],
 "Arabic": [
  "arābu",
  "арабские",
  "Arabic",
  "arabų",
  "araabia"
 ],
 "Italian": [
  "itāļu",
  "итальянские",
  "Italian",
  "italų",
  "itaalia"
 ],
 "Spanish": [
  "spāņu",
  "испанские",
  "Spanish",
  "ispanų",
  "hispaania"
 ],
 "Persian": [
  "persiešu",
  "персидские",
  "Persian",
  "persų",
  "pärsia"
 ],
 "Sanskrit": [
  "sanskrita",
  "санскритские",
  "Sanskrit",
  "sanskrito",
  "sanskriti"
 ],
 "Old Norse": [
  "senskandināvu",
  "древнескандинавские",
  "Old Norse",
  "senovės skandinavų",
  "vanapõhja"
 ],
 "Slavic": [
  "slāvu",
  "славянские",
  "Slavic",
  "slavų",
  "slaavi"
 ],
 "Celtic": [
  "ķeltu",
  "кельтские",
  "Celtic",
  "keltų",
  "keldi"
 ],
 "Hungarian": [
  "ungāru",
  "венгерские",
  "Hungarian",
  "vengrų",
  "ungari"
 ],
 "Aramaic": [
  "aramiešu",
  "арамейские",
  "Aramaic",
  "aramėjų",
  "aramea"
 ],
 "Assyrian": [
  "asīriešu",
  "ассирийские",
  "Assyrian",
  "asirų",
  "assüüria"
 ],
 "Iranian": [
  "irāņu",
  "иранские",
  "Iranian",
  "iranėnų",
  "iraani"
 ],
 "Czech": [
  "čehu",
  "чешские",
  "Czech",
  "čekų",
  "tšehhi"
 ],
 "Scandinavian": [
  "skandināvu",
  "скандинавские",
  "Scandinavian",
  "skandinavų",
  "skandinaavia"
 ],
 "Anglo-Saxon": [
  "anglosakšu",
  "англосаксонские",
  "Anglo-Saxon",
  "anglosaksų",
  "anglosaksi"
 ],
 "Occitan": [
  "oksitāņu",
  "окситанские",
  "Occitan",
  "oksitanų",
  "oksitaani"
 ]
};
const registryKinds={
 "compound": [
  "Vārds {name} veidots, savienojot divus vārda celmus.",
  "Имя {name} сложили из двух основ.",
  "The name {name} was made by joining two name stems.",
  "Vardas {name} sudėtas iš dviejų kamienų.",
  "Nimi {name} on kokku pandud kahest nimetüvest."
 ],
 "word": [
  "Vārds {name} radies no ikdienā lietota vārda.",
  "Имя {name} выросло из обычного слова.",
  "The name {name} grew out of an everyday word.",
  "Vardas {name} kilo iš kasdienio žodžio.",
  "Nimi {name} kasvas välja tavalisest sõnast."
 ],
 "short": [
  "Vārds {name} radies kā garāka vārda īsā forma.",
  "Имя {name} появилось как короткая форма более длинного имени.",
  "The name {name} began as a shorter form of a longer name.",
  "Vardas {name} atsirado kaip trumpesnė ilgesnio vardo forma.",
  "Nimi {name} sai alguse pikema nime lühivormina."
 ],
 "place": [
  "Vārda {name} sākums meklējams kādas vietas nosaukumā.",
  "За именем {name} стоит название места.",
  "The name {name} began with the name of a place.",
  "Vardo {name} pradžia slypi vietovės pavadinime.",
  "Nime {name} taga on ühe paiga nimi."
 ],
 "created": [
  "Vārds {name} ir jaunradīts personvārds.",
  "Имя {name} когда-то придумали заново.",
  "The name {name} was coined as a new personal name.",
  "Vardas {name} buvo sukurtas kaip naujas asmenvardis.",
  "Nimi {name} mõeldi välja uue isikunimena."
 ]
};
const special={
 "leo": {
  "ru": "Греческое Leon и латинское Leo означают «лев». Эти родственные формы распространились в европейских языках. Имя носили раннехристианские святые и римские папы.",
  "en": "Greek Leon and Latin Leo mean “lion”. These related forms spread through European languages. Early Christian saints and popes bore the name.",
  "lv": "Grieķu Leon un latīņu Leo nozīmē «lauva». Šīs radniecīgās formas izplatījās Eiropas valodās. Vārdu nesa agrīnās kristietības svētie un pāvesti.",
  "lt": "Graikiškas Leon ir lotyniškas Leo reiškia «liūtas». Šios giminingos formos paplito Europos kalbose. Vardą turėjo ankstyvosios krikščionybės šventieji ir popiežiai.",
  "et": "Kreeka Leon ja ladina Leo tähendavad «lõvi». Need sugulasvormid levisid Euroopa keeltes. Nime kandsid varakristlikud pühakud ja paavstid."
 },
 "charlotte": {
  "ru": "Путь имени {name} ведёт во Францию, к Charlotte — женской уменьшительной форме Charles. В XVII веке имя добралось до Британии. Позднее его носили королева Шарлотта и писательница Шарлотта Бронте: одна оставила след в истории двора, другая — на книжных полках.",
  "en": "The story of {name} leads to France and Charlotte, a feminine diminutive of Charles. The name reached Britain in the seventeenth century. Later came Queen Charlotte and the writer Charlotte Brontë: one left her mark at court, the other on bookshelves.",
  "lv": "Vārda {name} ceļš ved uz Franciju, pie Charlotte — vārda Charles sieviešu pamazināmās formas. Britānijā tas nonāca 17. gadsimtā. Vēlāk to nesa karaliene Šarlote un rakstniece Šarlote Brontē: viena atstāja pēdas galma vēsturē, otra — grāmatu plauktos.",
  "lt": "Vardo {name} kelias veda į Prancūziją, prie Charlotte — moteriškos mažybinės Charles formos. Britaniją vardas pasiekė XVII amžiuje. Vėliau jį turėjo karalienė Šarlotė ir rašytoja Charlotte Brontë: viena paliko pėdsaką rūmų istorijoje, kita — knygų lentynose.",
  "et": "Nime {name} tee viib Prantsusmaale ja Charlotte’ini, Charlesi naissoost hellitusvormini. Briti saartele jõudis nimi 17. sajandil. Hiljem kandsid seda kuninganna Charlotte ja kirjanik Charlotte Brontë: üks jättis jälje õukonnalukku, teine raamaturiiulitele."
 },
 "leonard": {
  "ru": "В имени {name} встретились лев и храбрость. Его старые германские корни обычно читают как «храбрый лев». Имя знали в Европе ещё в Средние века, а его итальянскую форму Leonardo прославил Леонардо да Винчи.",
  "en": "A lion and bravery meet in the name {name}. Its old German roots are usually read as “brave lion”. The name was known in medieval Europe; Leonardo da Vinci made its Italian form, Leonardo, famous.",
  "lv": "Vārdā {name} satiekas lauva un drosme. Tā senās ģermāņu saknes parasti skaidro kā «drosmīgs lauva». Eiropā vārdu pazina jau viduslaikos, bet itāļu formu Leonardo slavenu darīja Leonardo da Vinči.",
  "lt": "Varde {name} susitinka liūtas ir drąsa. Jo senosios germanų šaknys paprastai aiškinamos kaip «drąsus liūtas». Europoje vardą žinojo dar viduramžiais, o itališką formą Leonardo išgarsino Leonardo da Vinci.",
  "et": "Nimes {name} kohtuvad lõvi ja vaprus. Selle vanu germaani juuri tõlgendatakse tavaliselt kui «vapper lõvi». Nime tunti Euroopas juba keskajal ning selle itaalia kuju Leonardo tegi kuulsaks Leonardo da Vinci."
 },
 "alexandra": {
  "ru": "История имени {name} начинается в Древней Греции. Его греческая форма — Alexandra, женская пара к Alexander, а смысл обычно передают как «защитница людей». Позднее имя носила британская королева Александра, жена Эдуарда VII. Она любила фотографировать близких и в 1908 году выпустила альбом своих снимков в помощь благотворительности.",
  "en": "The story of {name} begins in Ancient Greece. Its Greek form, Alexandra, is the feminine counterpart of Alexander, usually understood as “defender of people”. A later bearer was Queen Alexandra, wife of Edward VII. She enjoyed photographing family and friends and published an album of her pictures for charity in 1908.",
  "lv": "Vārda {name} stāsts sākas Senajā Grieķijā. Grieķu Alexandra ir vārda Alexander sieviešu forma, kuras nozīmi parasti skaidro kā «cilvēku aizstāve». Vēlāk šo vārdu nesa britu karaliene Aleksandra, Edvarda VII sieva. Viņa labprāt fotografēja tuviniekus un 1908. gadā izdeva savu fotogrāfiju albumu labdarībai.",
  "lt": "Vardo {name} istorija prasideda Senovės Graikijoje. Graikiškas Alexandra yra moteriška Alexander forma, kurios reikšmė paprastai aiškinama kaip «žmonių gynėja». Vėliau šį vardą turėjo britų karalienė Aleksandra, Edvardo VII žmona. Ji mėgo fotografuoti artimuosius ir 1908 metais išleido savo nuotraukų albumą labdarai.",
  "et": "Nime {name} lugu algab Vana-Kreekast. Kreeka Alexandra on Alexanderi naissoost vaste ja selle tähendust selgitatakse tavaliselt kui «inimeste kaitsja». Hiljem kandis nime Briti kuninganna Alexandra, Edward VII abikaasa. Ta armastas lähedasi pildistada ning avaldas 1908. aastal oma fotodest heategevusliku albumi."
 }
};
function fill(value,name){return value.replaceAll('{name}',name);}
const listFormats=new Map(),dayFormats=new Map();
const listFormat=lang=>{if(!listFormats.has(lang))listFormats.set(lang,new Intl.ListFormat(lang,{style:"long",type:"conjunction"}));return listFormats.get(lang);};
const localeForName=lang=>({lv:'lv-LV',ru:'ru-RU',en:'en-GB',lt:'lt-LT',et:'et-EE'}[lang]);
const REUSE_NOTES={"lv":{"lv":"Vārds {name} sakrīt ar Latvijā lietoto vārdu {source}.","ru":"Имя {name} совпадает с латышским именем {source}.","en":"{name} matches the Latvian name {source}.","lt":"{name} sutampa su Latvijoje vartojamu vardu {source}.","et":"{name} kattub Lätis kasutatava nimega {source}."},"variant":{"lv":"{name} ir vārda {source} rakstības variants.","ru":"{name} — вариант написания имени {source}.","en":"{name} is a spelling variant of {source}.","lt":"{name} – vardo {source} rašybos variantas.","et":"{name} on nime {source} kirjaviisi variant."},"lt":{"lv":"Vārds {name} sakrīt ar Lietuvā lietoto vārdu {source}.","ru":"Имя {name} совпадает с литовским именем {source}.","en":"{name} matches the Lithuanian name {source}.","lt":"{name} sutampa su Lietuvoje vartojamu vardu {source}.","et":"{name} kattub Leedus kasutatava nimega {source}."},"ee":{"lv":"Vārds {name} sakrīt ar Igaunijā lietoto vārdu {source}.","ru":"Имя {name} совпадает с эстонским именем {source}.","en":"{name} matches the Estonian name {source}.","lt":"{name} sutampa su Estijoje vartojamu vardu {source}.","et":"{name} kattub Eestis kasutatava nimega {source}."}};
// Retain the editorial preview API; greetings themselves are independent of names.
export function greetingsForName(_profile,requested='en',variant=0){
 return Object.fromEntries(Object.entries(greetingsForLanguage(requested)).map(([mood,copies])=>[mood,Array.from({length:3},(_,n)=>copies[(variant+n)%copies.length])]));
}
export function describeName(profile,requested='en',variant=0,profiles=null){
 const lang=LANGUAGES.includes(requested)?requested:'en',i=LANGUAGES.indexOf(lang),seed=hash(nameIdentity(profile.name)),name=profile.name;
 const facts=profile.facts||{},paragraphs=[];
 const own=reviewedHistory(name,profile.country),reuse=own||unverifiedHistory(name,profile.country)?null:reusedHistory(name,profile.country),reviewed=own||reuse?.history||null;
 const hypothesis=reviewed?null:unverifiedHistory(name,profile.country);
 const root=rootHistory(facts.root_key,name,lang);
 if(special[profile.family])paragraphs.push(fill(special[profile.family][lang],name));
 else if(root)paragraphs.push(root);
 else{
  if(facts.origins?.length)paragraphs.push(text(lang,'origin',{name,origins:listFormat(lang).format(facts.origins.map(o=>traditions[o]?.[i]||o))}));
  if(facts.etymons?.length){const words=facts.etymons.slice(0,3).map(w=>'«'+w.term+'» («'+w.gloss[lang]+'»)');paragraphs.push(text(lang,'wordRoots',{words:listFormat(lang).format(words)}));}
  if(facts.formation==='phonetic'){const note={lv:'{name} ir fonētisks darinājums: tā izveidē galvenais ir skanējums, un konkrēts pamatvārds nav norādīts.',ru:'{name} — фонетическое образование: имя создано по звучанию, а конкретное слово-основа не указано.',en:'{name} is a phonetic formation: it was formed for its sound, without a specified underlying word.',lt:'{name} – fonetinis darinys: vardas sudarytas pagal skambesį, nenurodant konkretaus pamatinio žodžio.',et:'{name} on häälikuline moodustis: nimi on loodud kõla järgi, konkreetset alussõna nimetamata.'};paragraphs.push(fill(note[lang],name));}
  if(facts.registry_kind&&registryKinds[facts.registry_kind])paragraphs.push(fill(registryKinds[facts.registry_kind][i],name));
 }
 const person=profile.people?.[0];
 if(person?.match==='exact'&&!special[profile.family])paragraphs.push(text(lang,'namesake',{person:person.labels?.[lang]||person.name,role:roleLabel(person.role,lang)}));
 const recordedDate=facts.first_recorded?formatAttestation(facts.first_recorded,lang):null;
 const related=[...new Set([...(facts.related||[]),...(facts.source_forms||[]).map(f=>f.form)])].filter(n=>nameIdentity(n)!==nameIdentity(name)&&!paragraphs.join(' ').includes(n)).slice(0,3);
 if(related.length)paragraphs.push(text(lang,'related',{names:listFormat(lang).format(related)}));
 if(facts.possible_related?.length)paragraphs.push(text(lang,'possibleRelated',{names:listFormat(lang).format(facts.possible_related.slice(0,3))}));
 if(facts.archival_variants?.length)paragraphs.push(text(lang,'archivalVariant',{name:facts.archival_form||name,names:listFormat(lang).format(facts.archival_variants)}));
 const greetings=greetingsForName(profile,lang,variant);
 const reuseNote=reuse?REUSE_NOTES[reuse.country===profile.country?'variant':reuse.country][lang].replaceAll('{name}',name).replaceAll('{source}',reuse.source):'';
 const plain=reviewed?plainHistory(reuse?reuse.source:name,reuse?reuse.country:profile.country,reviewed):null;
 const crossTrim=reuse&&profile.country!=='lv'&&reuse.country!==profile.country;
 const history=reviewed?(crossTrim?plain[lang].slice(0,1):plain[lang]).map((p,n)=>(n===0&&reuseNote?reuseNote+' ':'')+fill(p,reuse?reuse.source:name)):paragraphs.length?[paragraphs.join(' ')]:[];
 if(facts.calendar_entry&&reviewed?.calendar_entry_year!==facts.calendar_entry.year){
  const calendarNote={lv:'{name} kalendārā iekļauts {year}. gadā.',ru:'{name} включено в календарь в {year} году.',en:'{name} entered the calendar in {year}.',lt:'{name} į kalendorių įtrauktas {year} metais.',et:'{name} lisati kalendrisse {year}. aastal.'};
  const entry=facts.calendar_entry;const entryNote={lv:'Vārdu grupa {name} kalendārā ir kopš {year}. gada.',ru:'Группа имён {name} — в календаре с {year} года.',en:'The name group {name} has been in the calendar since {year}.',lt:'Vardų grupė {name} kalendoriuje yra nuo {year} metų.',et:'Nimerühm {name} on kalendris alates {year}. aastast.'};history.push((entry.scope==='reference_entry'?entryNote[lang]:calendarNote[lang]).replaceAll('{name}',entry.scope==='reference_entry'?entry.form:name).replaceAll('{year}',String(entry.year)));
 }
 if(hypothesis){const kept=hypothesis.keep?history.slice():[];history.splice(0,history.length,...plainHypothesis(hypothesis.text)[lang].map(p=>fill(p,name)),...kept);}
 const supplement=!hypothesis&&reviewed?historySupplement(name,profile.country):null;
 if(supplement)history.push(...supplement[lang].map(p=>HYPOTHESIS_LABELS[lang]+': '+fill(p,name)));
 const kind=hypothesis?'unresearched':history.length||recordedDate?'documented':'unresearched',calendar_only=!history.length&&!recordedDate;
 const englishHistory=reviewed&&(!hypothesis||hypothesis.keep)?(crossTrim?plain.en.slice(0,1):plain.en):[];
 if(recordedDate&&!recordDateIncluded(history,facts.first_recorded,lang,englishHistory)){
  const line={lv:'Vārda {form} datēts pieraksts: {date}.',ru:'Датированная запись имени {form}: {date}.',en:'Dated record of {form}: {date}.',lt:'Datuotas vardo {form} įrašas: {date}.',et:'Nime {form} dateeritud kirjapanek: {date}.'};
  const recordedForm=(facts.first_recorded_form||name)+(facts.first_recorded_country&&facts.first_recorded_country!==profile.country?' ('+text(lang,facts.first_recorded_country)+')':'');
  history.push(line[lang].replaceAll('{form}',recordedForm).replaceAll('{date}',recordedDate));
 }
 if(!history.length&&facts.calendar_dates?.length){if(!dayFormats.has(lang))dayFormats.set(lang,new Intl.DateTimeFormat(localeForName(lang),{month:'long',day:'numeric',timeZone:'UTC'}));const df=dayFormats.get(lang),dates=facts.calendar_dates.map(day=>df.format(new Date('2000-'+day+'T12:00:00Z'))).join(', '),country=text(lang,profile.country);const line={lv:'Vārds {name} šajā {country} vārda dienu kalendārā ierakstīts datumā: {dates}.',ru:'Имя {name} указано в календаре именин страны {country} на даты: {dates}.',en:'The name {name} is listed in the {country} name-day calendar on: {dates}.',lt:'Vardas {name} šalies {country} vardadienių kalendoriuje įrašytas šiomis datomis: {dates}.',et:'Nimi {name} on riigi {country} nimepäevakalendris kuupäevadel: {dates}.'};history.push(line[lang].replaceAll('{name}',name).replaceAll('{country}',country).replaceAll('{dates}',dates));}
 const notice={lv:'Vārda cilme nav skaidra.',ru:'Происхождение имени точно не установлено.',en:'The name’s origin is uncertain.',lt:'Vardo kilmė neaiški.',et:'Nime päritolu pole selge.'};
 const opening=hypothesis?readerOpening(name,profile.country,lang):null;
 if(opening)history[0]=opening;
 const hadHistory=history.length>0;
 const readable=history.map(p=>readerParagraph(finalWording(p,lang),lang)).filter(Boolean);
 history.splice(0,history.length,...readable);
 if(!history.length&&hadHistory)history.push(notice[lang]);
 const related_context=[];
 if(profiles){
  const seen=new Set([profile.key]),candidates=[...(facts.related||[]).map(name=>({name,possible:false})),...(facts.possible_related||[]).map(name=>({name,possible:true}))];
  const titles={lv:['Par saistīto vārdu {name}','Iespējama saikne: {name}'],ru:['О связанном имени {name}','Возможная связь: {name}'],en:['About the related name {name}','Possible connection: {name}'],lt:['Apie susijusį vardą {name}','Galimas ryšys: {name}'],et:['Seotud nimest {name}','Võimalik seos: {name}']};
  for(const candidate of candidates){
   const other=profiles[profile.country+':'+candidate.name.normalize('NFC')];
   const root=reviewedRoot(candidate.name),review=reviewedHistory(candidate.name,profile.country);
   if((reviewed&&review?.text===reviewed.text)||(facts.root_key&&root?.key===facts.root_key))continue;
   const target=other||(root||review?{key:profile.country+':'+candidate.name,name:candidate.name,country:profile.country,facts:root?{root_key:root.key}:{},people:[]}:null);
   if(!target||seen.has(target.key))continue;seen.add(target.key);
   const copy=describeName(target,lang,0,null);
   if(copy.unverified_hypothesis||!copy.history.length||(!review&&!root&&!target.family&&!target.facts?.origins?.length&&!target.facts?.etymons?.length))continue;
   const above=[...history.filter(p=>!p.includes(HYPOTHESIS_LABELS[lang]+':')),...related_context.flatMap(c=>c.history)];
   const extra=hypothesis?copy.history:uniqueRelatedHistory(above,copy.history,target.name,lang);
   if(!extra.length)continue;
   related_context.push({name:target.name,possible:candidate.possible,title:titles[lang][Number(candidate.possible)].replaceAll('{name}',target.name),history:extra});
   if(related_context.length===2)break;
  }
 }
 return{kind,history,calendar_only,story:'',notice:kind==='unresearched'?notice[lang]:'',reviewed_narrative:!hypothesis&&(!!reviewed||!!special[profile.family]),history_reused_from:reuse?{name:reuse.source,country:reuse.country}:null,unverified_hypothesis:!!hypothesis,hypothesis_label:hypothesis?HYPOTHESIS_LABELS[lang]:'',related_context,wishes:greetings};
}
function recordDateIncluded(history,value,lang,englishHistory=[]){
 const period=attestationPeriod(value),body=history.join(' ');
 if(!period)return true;
 if(period.kind==='year'&&!period.qualifier&&period.era==='ad')return new RegExp('(?<!\\d)'+period.year+'(?!\\d)').test(body);
 const normalize=s=>s.toLocaleLowerCase(lang).replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 if(normalize(body).includes(normalize(formatAttestation(value,lang))))return true;
 const ordinals=['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth','eleventh','twelfth','thirteenth','fourteenth','fifteenth','sixteenth','seventeenth','eighteenth','nineteenth','twentieth','twenty-first'];
 const temporal=s=>normalize(s).replace(/\blast quarter\b/g,'fourth quarter').replace(new RegExp('\\b('+ordinals.slice().reverse().join('|')+')(?= century)','g'),v=>String(ordinals.indexOf(v)+1)).replace(/\b(\d+)(?:st|nd|rd|th)\b/g,'$1').replace(/\b(?:of|the)\b/g,'').replace(/\s+/g,' ').trim();
 return englishHistory.some(p=>temporal(p).includes(temporal(formatAttestation(value,'en'))));
}
// The sole final presentation model, also materialized in generated profiles.
export function historyBlocks(copy,lang){
 const blocks=[];
 if(copy.history.length&&!copy.calendar_only){blocks.push({type:'heading',text:copy.unverified_hypothesis?copy.hypothesis_label:text(lang,'documented')});for(const p of copy.history)blocks.push({type:'paragraph',text:p});}
 if(copy.notice&&!copy.unverified_hypothesis&&!copy.history.includes(copy.notice))blocks.push({type:'paragraph',text:copy.notice});
 for(const related of copy.related_context||[]){blocks.push({type:'heading',text:related.title});for(const p of related.history)blocks.push({type:'paragraph',text:p});}
 return blocks;
}
// Omit repeated origin sentences; dated records keep their exact-name scope.
export function uniqueRelatedHistory(primary,related,name,lang){
 const words=s=>s.normalize('NFC').toLocaleLowerCase(lang).match(/[\p{L}\p{N}]+/gu)||[];
 const nameWords=new Set(words(name));
 const normalize=s=>words(s).filter(w=>!nameWords.has(w));
 const above=primary.map(p=>' '+normalize(p).join(' ')+' ');
 const segmenter=new Intl.Segmenter(lang,{granularity:'sentence'});
 return related.map(p=>[...segmenter.segment(p)].map(s=>s.segment).filter(s=>{
  if(/\p{N}/u.test(s))return true;
  const tokens=normalize(s);
  return tokens.length<4||!above.some(p=>p.includes(' '+tokens.join(' ')+' '));
 }).join('').trim()).filter(Boolean);
}
export const ROLE_LABELS={
 writer:['rakstnieks','писатель','writer','rašytojas','kirjanik'],poet:['dzejnieks','поэт','poet','poetas','luuletaja'],actor:['kino un teātra mākslinieks','актёр','actor','aktorius','näitleja'],musician:['mūziķis','музыкант','musician','muzikantas','muusik'],composer:['komponists','композитор','composer','kompozitorius','helilooja'],athlete:['sportists','спортсмен','athlete','sportininkas','sportlane'],scientist:['zinātnieks','учёный','scientist','mokslininkas','teadlane'],artist:['mākslinieks','художник','artist','menininkas','kunstnik'],director:['kinorežisors','кинорежиссёр','film director','kino režisierius','filmirežissöör'],astronaut:['astronauts','астронавт','astronaut','astronautas','astronaut'],educator:['pedagogs','педагог','educator','pedagogas','pedagoog'],public_figure:['sabiedriska personība','общественный деятель','public figure','visuomenės veikėjas','avaliku elu tegelane']
};
export function roleLabel(role,lang){return ROLE_LABELS[role]?.[LANGUAGES.indexOf(lang)]||ROLE_LABELS.public_figure[LANGUAGES.indexOf(lang)]||role;}
