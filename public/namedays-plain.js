// Plain-language display layer for reviewed name histories (decided 13 November 2026).
// The widget is popular reading: displayed text names no sources or authors and drops
// methodological caveats, while facts, dates and genuine uncertainty stay. Research
// modules keep their original wording and provenance; this layer only changes display.
//
// Order of precedence for one reviewed history:
//   1. a hand-rewritten plain version registered with registerPlainHistories();
//   2. otherwise automatic rules: caveat sentences are dropped (classified on the English
//      paragraph and removed at the same sentence position in every language) and
//      source-attribution formulas are rewritten per language.
import {plainCalendar} from './namedays-plain-calendar.js';
import {applyWording} from './namedays-plain-r140.js';
const LANGS=['lv','ru','en','lt','et'];

// Sentence splitter shared by all languages: a sentence ends with . ! ? or … followed by
// whitespace and an upper-case letter, quote or bracket (so “20. gadsimts” is not split).
export function splitSentences(text){
 return text.split(/(?<=[.!?…])\s+(?=[A-ZĀČĒĢĪĶĻŅŠŪŽÕÄÖÜĖĄĘĮŲА-ЯЁ‘“«„(])/u).filter(Boolean);
}

// English methodological caveats. Each pattern must describe evidence handling, not a fact
// about the name; genuine uncertainty about origin (“probably”, “is uncertain”) is kept.
const CAVEATS=[
 /^This establishes a linguistic association without requiring one literal sentence/,
 /^The exact row appears in the \d{4} manual on printed page/,
 /^The recommendation is recorded in an? \d{4} manual, on page/,
 /^A documented local form belongs to this older international family without/,
 /^Klāvs Siliņš’s dictionary explains the personal name simply by that word/,
 /^Page \d+ of the 1990 study gives .+ in Siliņš’s dictionary/,
 /^The historical connection survives changes of spelling and endings/,
 /^The spelling is documented in Raamat nimedest/,
 /^It documents this spelling by the publication date/,
 /^This is a dated example from local print culture/,
 /^Publication is not this form’s first birth registration/,
 /^This is an earlier example of the international family, rather than/,
 /^This is an ethnic designation in the name’s history/,
 /^That history makes no claim about every modern bearer/,
 /^These translations need not be forced into one/,
 /^The first page of Leole’s December \d{4} issue uses the exact spelling/,
 /^Full and shortened forms can therefore share a family/,
 /^That association is part of the family’s history rather than proof/,
 /^These old components explain the compound’s linguistic history/,
 /^Adaptation into different languages changes consonant spellings/,
 /^Leili Kuusk’s column in the municipal newspaper Leole/,
 /^The exact spelling .+ appears among .+ variants in Leili Kuusk’s column/,
 /^This local (explanation documents|printed example records)/,
 /^This dated spelling record illustrates transmission/,
 /^This helps explain the documented connection between/,
 /^Its forms were shortened and adapted differently across languages, so a shared family/,
 /^Short and derived forms in different languages changed the original spelling; a shared family/,
 /shared ancestry does not give them an identical local history/,
 /^The form and its relationships are documented in Edgar Rajandi’s/,
 /^This dates the spelling in the calendar material used/,
 /^The record concerns use of this spelling, rather than/,
 /has not been independently checked here/,
 /^This lexical connection does not establish that a particular/,
 /does not itself determine a modern bearer’s/,
 /root meaning does not describe any particular bearer’s/,
 /^Both dates retain the source’s scope/,
 /^Those years are not automatically the earliest dates/,
 /^This is an explicit rendering link, rather than an inference/,
 /^The cited recommendation does not give the first Latvian birth registration/,
 /explains an association of the name, rather than determining the character/,
 /^It is neither (a birth-register entry|the name’s first registration)/,
 /^These records document a tradition rather than one year of invention/,
 /^The entry brings together several local adaptations .+ it does not give/,
 /^These qualified dates come from the online account/,
 /^The entry documents a short form for a particular person, rather than/,
 /^Siliņš’s dictionary states this connection explicitly/,
 /different kinds of evidence/,
 /does not by itself (resolve|settle|establish)/,
 /not (a claim about )?the first bearer/,
 /without assigning a single/,
 /does not by itself establish a single exclusive/,
 /^These (dates|are records) (describe|of) (recorded use|use)/,
 /^This records use of the particular name/,
 /cannot automatically be transferred/,
 /^This dates (an attributed record|attributed use|a published calendar recommendation|the published rendering recommendation)/,
 /^It does not mean that the name was created then/,
 /^A date attached to a shared entry/,
 /^This documents a published naming recommendation/,
 /^This records a name-form relationship/,
 /^This dated record illustrates transmission/,
 /^These are the source words or name elements/,
 /dictionary senses describe the linguistic formation/,
 /have not been independently inspected/,
 /^This is a concrete printed example/,
 /^This is a dated naming recommendation/,
 /^This is one recorded relationship, rather than proof/,
 /need not match every modern calendar and is not the name’s invention date/,
 /^The dictionary preserves this name relationship without/,
 /^This records historical use or recommendation/,
 /^The dictionary records a word-based name formation; it does not identify/,
 /^It does not identify the first Latvian birth registration/,
 /^This is a dated linguistic record of the name/,
 /^The beginning of a particular local form’s use must be distinguished/,
 /^This records an Estonian name-form relationship, without/,
 /^This is a documented spelling relationship between a source-language/,
 /^The local name column shows that this form was discussed/,
 /^This dated evidence is neither/,
 /^The dates belong to the shared entry/,
 /^This is specific dated evidence for the local form/,
 /publication year is not the name’s invention date/,
 /^This documents the calendar recommendation, not/,
 /^The connection documents an Estonian name family rather than/,
 /^The book records the naming traditions known at that time/,
 /^Its publication date documents a linguistic treatment/,
 /^This describes the name’s origin rather than the character of its bearer/,
 /^This is dated evidence for the exact form in scholarly work/,
 /^Publication does not mark a first birth record/,
 /^The cited dictionary location is page/,
 /^The dates stay with the recorded forms/,
 /^The explanation concerns the form discussed in the dictionary/,
 /^This explains the linguistic material cited for the name/,
 /^This is a specific record in the spelling’s history/,
 /^The surviving attestation demonstrates use in that source/,
 /^The chain preserves the intermediate forms/,
 /^The publication establishes the forms’ presence/,
 /^This establishes the source’s name-family link/,
 /^That is a documented family association, not a personality trait/,
 /^This explains the historical basis rather than promising/,
 /^This is an episode in the related .+ tradition, not the first/,
 /^They should not be turned into a single modern sentence/,
 /^These vocabulary comparisons explain its individual stems/,
 /^Independent use of a short form preserves this relationship/,
 /^This family link does not require choosing the catalogue’s/,
 /^The publication dates the form’s presence in the naming literature/,
 /^This dates a published calendar recommendation/,
 /^This documents a naming recommendation without/,
 /^The recommendation is evidence of calendar history/,
 /^This records a relationship between name forms/,
 /^Recorded use and calendar inclusion/,
 /^The relationship between these forms does not by itself/,
 /^This is a specific connection with Latvian vocabulary/,
 /^These are alternatives; the entry does not establish/,
 /^This is the name’s documented formation, not/,
 /^This explains the (historical|linguistic) basis/,
 /^This describes a route of personal-name formation/,
 /^It does not by itself establish/,
 /^Recorded use and calendar inclusion are different/,
 /^This concerns the given name; an identical surname/,
 /^This explanation concerns water imagery rather than/,
 /^The Latin word and the personal name explained through/,
 /^These are explanations of individual stems/,
 /^This is a direct relationship with a Lithuanian word/,
 /^A root explanation is distinct from a translation/,
 /^The Low German form is a documented transmission stage/,
 /^This is its historical linguistic meaning, rather than/,
 /^These historical elements describe the name’s formation/,
 /^The Language Agency’s (table|exact correspondence) establishes/,
 /^This is the Estonian feminine name’s linguistic/
];

export function isCaveat(sentence){return CAVEATS.some(re=>re.test(sentence));}

// Source-attribution formulas rewritten per language. Replacements keep the facts (forms,
// places, years, calendar dates) and remove the source, author, page and publication data.
const rec={
 en:(r,y)=>(r?`Recorded use: ${r}.`:'')+(y?`${r?' ':''}In the calendar since ${y}.`:''),
 lv:(r,y)=>(r?`Lietojums pierakstīts: ${r}.`:'')+(y?`${r?' ':''}Kalendārā kopš ${y}. gada.`:''),
 ru:(r,y)=>(r?`Употребление зафиксировано: ${r}.`:'')+(y?`${r?' ':''}В календаре с ${y} года.`:''),
 lt:(r,y)=>(r?`Vartojimas užfiksuotas: ${r}.`:'')+(y?`${r?' ':''}Kalendoriuje nuo ${y} metų.`:''),
 et:(r,y)=>(r?`Kasutus on kirja pandud: ${r}.`:'')+(y?`${r?' ':''}Kalendris alates ${y}. aastast.`:'')
};
const CAL_ONLY=/^(?:calendar|kalendārā|календарь|в календаре|kalendoriuje|kalendris) (\d{4})$/;
const recordRule=(lang,re,calRe)=>[re,(m,body)=>{let r=body.replace(/\s*\([^)]*\)\s*$/,'').trim(),y=null;const c=r.match(calRe);if(c){r=c[1];y=c[2];}const only=r.match(CAL_ONLY);if(only){y=only[1];r='';}return rec[lang](r,y);}];
const REWRITES={
 en:[
  [/^The Latvian name-rendering manual gives the exact \S+ correspondence (\S+) → (\S+?)\.$/,'The official Latvian rendering of $1 is $2.'],
  [/^Rajandi places (\S+) in the Estonian “brother-name” group with Vello\.$/,'$1 belongs to the Estonian “brother-name” group with Vello.'],
  [/^In this group he connects Finnish Veikko with veli, “brother”\.$/,'The group links Finnish Veikko with veli, “brother”.'],
  [/^The dictionary connects (\S+) with the (\S+) name family, from Hebrew dānīēl, explained as “God is my judge”\.$/,'$1 belongs to the $2 family, from Hebrew dānīēl, “God is my judge”.'],
  [/^Klāvs Siliņš’s Latvian dictionary distinguishes two branches:.*$/,'Two branches are distinguished in Latvian: the feminine Inga is linked with the Germanic god Ingwio, while a masculine Inga belongs with Indriķis, that is Heinrich; no single meaning fits both.'],
  [/^The Latvian dictionary explains the name’s formation through (.+)$/,'The name is formed from $1'],
  [/^The dictionary connects (\S+) with the (\S+) name family and explains its Hebrew base Dāvīd as “beloved”\.$/,'$1 belongs to the $2 family; its Hebrew base Dāvīd means “beloved”.'],
  [/^Klāvs Siliņš’s dictionary of Latvian personal names therefore allows a double link for (\S+), with the biblical Eve and with the tree, without presenting either as certain\.$/,'$1 may therefore be linked both with the biblical Eve and with the tree; neither link is certain.'],
  [/^(\S+) belongs to the Stefanus \/ Stephanus family in Edgar Rajandi’s Estonian name dictionary\.$/,'$1 belongs to the Stefanus / Stephanus family.'],
  [/^He explains the Greek base as “crown, wreath, diadem” and explicitly includes this spelling among the forms used in Estonia\.$/,'The Greek base means “crown, wreath, diadem”, and this spelling is one of the forms used in Estonia.'],
  [/^Klāvs Siliņš’s dictionary also notes a link between Ivars and Johannes as a Scandinavian form, without choosing one explanation\.$/,'Ivars has also been linked with Johannes, as a Scandinavian form.'],
  [/^Page \d+ of Mägiste’s 1929 name list gives (.+)$/,'An Estonian name collection of 1929 gives $1'],
  [/^Page \d+ of the 1983 study gives (\S+) labelled as a personal name\.$/,'$1 is recorded as a personal name.'],
  [/^Short forms need not retain both elements; French Adèle is a related name in the adal family\.$/,'French Adèle is a related name from adal.'],
  [/^The medieval name dictionary records related Latin (\S+) in (\S+) in (\d{4})\.$/,'Related Latin $1 is recorded in $2 in $3.'],
  [/^Siliņš’s dictionary lists this form under (\S+)\.$/,'It is a form of $1.'],
  [/^Klāvs Siliņš’s dictionary usually links Latvian (\S+) with Nikolaus, but also mentions another explanation, from the Latvian word klāvs, “barn”\.$/,'Latvian $1 is usually linked with Nikolaus, though it has also been explained from the Latvian word klāvs, “barn”.'],
  [/^It belongs to modern commemorative name formation rather than one ancient Slavic compound\.$/,'It is a modern commemorative name.'],
  [/^Praise of God occurs in sources as an additional interpretation.*$/,'“Praise of God” is a further interpretation.'],
  [/^[^→]*Language Agency[^→]*?(\S+) → ([^\s,.;]+).*$/u,'The official Latvian rendering of $1 is $2.'],
  [/^The Latvian Language Agency gives the exact rendering (.+?) → (.+?), citing page \d+ of an? \d{4}(?: [\w-]+)* manual\.$/,'The official Latvian rendering of $1 is $2.'],
  [/^The documented family of (.+?) leads to (.+)\.$/,'$1 belongs to the $2 family.'],
  [/^Association with katharos, pure, is a later interpretation.*$/,'The popular meaning “pure” comes from a later association with Greek katharos.'],
  [/^The 1964 calendar reprinted in Salys’s 1983 volume gives (.+) on (.+)\.$/,'The Lithuanian name calendar of 1964 lists $1 on $2.'],
  [/^(?:The )?(?:Klāvs )?Siliņš catalogue explicitly links (.+?) with (.+)\.$/,'$1 is linked with $2.'],
  [/^Edgar Rajandi documents a connection between (.+?) and (.+)\.$/,'$1 is connected with $2.'],
  [/^Salys explicitly records (.+?) in connection with (.+)\.$/,'$1 is connected with $2.'],
  [/^Rajandi’s \d{4} dictionary explicitly connects (.+?) with (.+)\.$/,'$1 is connected with $2.'],
  [/^Siliņš’s entry for (.+?) gives (\d{4}) as its calendar year\.$/,'$1 entered the calendar in $2.'],
  [/^The catalogue explains (.+?) through (.+)$/,'$1 is explained through $2'],
  [/^The Siliņš catalogue records this chain of name references for .+?: (.+)\.$/,'Chain of related names: $1.'],
  [/^The catalogue of this shared entry gives a calendar record in (\d{4})\.$/,'In the calendar since $1.'],
  [/^(?:Klāvs )?Siliņš’s dictionary \(\d{4}\) explicitly refers (.+?) to (.+)\.$/,'$1 is a form of the name $2.'],
  [/^The catalogue attributed to (?:Klāvs )?Siliņš explicitly refers (.+?) to (.+)\.$/,'$1 is a form of the name $2.'],
  recordRule('en',/^(?:The (?:Siliņš )?(?:dictionary|catalogue) (?:gives the following historical record|records a historical detail|records the following historical detail|cites a historical record)): (.+)\.$/,/^(.*?);\s*calendar (\d{4})$/),
  [/^Siliņš’s dictionary dates the use of .+?: (.+)\.$/,'Recorded use: $1.'],
  [/^(?:Salys’s (\d{4}) Lithuanian calendar, reprinted in \d{4}|The (\d{4}) calendar, reprinted in (?:Antanas )?Salys’s collected writings in \d{4}), places (.+?) on (.+)\.$/,(m,a,b,n,d)=>`In the ${a||b} Lithuanian calendar, ${n} was placed on ${d}.`],
  [/^Exact (.+?) appears in Mägiste’s (\d{4}) (?:Estonian )?name guide\.$/,'$1 appears in an Estonian name guide of $2.'],
  [/^The exact form is documented in the Senn–Salys Lithuanian–German dictionary of (\d{4}), reprinted in Salys’s collected writings in \d{4}\.$/,'The exact form is recorded in print in $1.'],
  [/^The same dictionary records a written attestation of the name in (.+?) in (\d{4}) and its entry into the calendar in (\d{4})\.$/,'The name is recorded in writing in $1 in $2 and entered the calendar in $3.'],
  [/^(.+?) is linked through dictionary cross-references to (.+)\.$/,'$1 is linked to $2.'],
  [/^The given-name dictionary records (.+?) as entering the calendar in (\d{4})\.$/,'$1 entered the calendar in $2.']
 ],
 lv:[
  [/^Latviešu vārdu atveides rokasgrāmata dod precīzu \S+ atbilsmi (\S+) → (\S+?)\.$/,'Oficiālā latviskā $1 atveide ir $2.'],
  [/^Rajandi (\S+) pieskaita igauņu «brāļu vārdu» grupai līdzās Vello\.$/,'$1 pieder igauņu «brāļu vārdu» grupai līdzās Vello.'],
  [/^Vārdnīca saista (\S+) ar (\S+) vārdu saimi, no ebreju dānīēl, ko skaidro kā «Dievs ir mans tiesnesis»\.$/,'$1 pieder vārda $2 saimei, no ebreju dānīēl — «Dievs ir mans tiesnesis».'],
  [/^Klāva Siliņa vārdnīcā nošķirti divi zari:.*$/,'Latviešu valodā nošķir divus zarus: sieviešu vārdu Inga saista ar ģermāņu dievu Ingvio, bet vīriešu vārds Inga pieder pie Indriķa jeb Heinriha; vienas nozīmes abiem zariem nav.'],
  [/^Latviešu vārdnīca skaidro vārda veidošanu ar (.+)$/,'Vārds darināts no $1'],
  [/^Vārdnīca saista (\S+) ar (\S+) vārdu saimi un ebreju pamatu Dāvīd skaidro kā «mīlētais»\.$/,'$1 pieder vārda $2 saimei; ebreju pamats Dāvīd nozīmē «mīlētais».'],
  [/^Tāpēc Klāva Siliņa «Latviešu personvārdu vārdnīca» (\S+) pieļauj divējādu saikni — gan ar Bībeles Ievu, gan ar koka nosaukumu, nevienu no tām nepasniedzot kā neapšaubāmu\.$/,'Tāpēc vārdu var saistīt gan ar Bībeles Ievu, gan ar koka nosaukumu; neviena saikne nav droša.'],
  [/^Edgara Rajandi igauņu vārdu vārdnīca pieskaita (\S+) Stefanus \/ Stephanus saimei\.$/,'$1 pieder Stefanus / Stephanus saimei.'],
  [/^Grieķu pamatu autors skaidro kā «kronis, vainags, diadēma» un šo rakstību tieši min starp Igaunijā lietotajām formām\.$/,'Grieķu pamats nozīmē «kronis, vainags, diadēma», un šī rakstība ir viena no Igaunijā lietotajām formām.'],
  [/^Klāva Siliņa vārdnīcā Ivars saistīts arī ar Johannes kā skandināvu forma, neizvēloties vienu skaidrojumu\.$/,'Ivaru saista arī ar Johannes kā tā skandināvu formu.'],
  [/^Mēgistes 1929\. gada vārdu saraksta \d+\. lappusē ir (.+)$/,'1929. gada igauņu vārdu krājumā ir $1'],
  [/^1983\. gada pētījuma \d+\. lappusē ir (\S+) ar personvārda atzīmi\.$/,'$1 pierakstīts kā personvārds.'],
  [/^Īsajās formās ne vienmēr saglabājas abi celmi; franču Adèle ir radniecīgs adal saimes vārds\.$/,'Franču Adèle ir radniecīgs vārds no adal.'],
  [/^Viduslaiku vārdu vārdnīca Anglijas latīņu avotā dod radniecīgo (\S+) ar (\d{4})\. gada datējumu\.$/,'Radniecīgais latīņu $1 pierakstīts Anglijā $2. gadā.'],
  [/^Siliņa vārdnīca šo formu dod pie (\S+)\.$/,'Tā ir vārda $1 forma.'],
  [/^Latviešu (\S+) Klāva Siliņa vārdnīca parasti saista ar Nikolaus, taču min arī citu skaidrojumu — no latviešu vārda klāvs, «kūts»\.$/,'Latviešu $1 parasti saista ar Nikolaus, taču to skaidro arī no latviešu vārda klāvs — «kūts».'],
  [/^Tā pieder jaunāko laiku piemiņas vārdu veidošanai, nevis vienam senam slāvu divcelmu vārdam\.$/,'Tas ir jaunāko laiku piemiņas vārds.'],
  [/^Skaidrojums «Dieva slava» avotos parādās kā papildu interpretācija.*$/,'«Dieva slava» ir papildu skaidrojums.'],
  [/^[^→]*aģentūr[^→]*?(\S+) → ([^\s,.;]+).*$/u,'Oficiālā latviskā $1 atveide ir $2.'],
  [/^Latviešu valodas aģentūra dod precīzu atveidi (.+?) → (.+?), atsaucoties uz \d{4}\. gada (?:[\p{L}-]+ )*rokasgrāmatas \d+\. lappusi\.$/u,'Oficiālā latviskā $1 atveide ir $2.'],
  [/^(.+?) dokumentētā vārdu saime ved pie (.+)\.$/,'$1 pieder vārda $2 saimei.'],
  [/^Saikne ar katharos, «tīrs», ir vēlāks skaidrojums.*$/,'Populārā nozīme «tīrs» radusies no vēlākas saiknes ar grieķu katharos.'],
  [/^Saļa \d{4}\. gada krājumā pārpublicētais (\d{4})\. gada kalendārs dod (.+) pie (.+)\.$/,'$1. gada lietuviešu vārdu kalendārā $2 ierakstīts pie $3.'],
  [/^Siliņa katalogs (.+?) tieši saista ar (.+)\.$/,'$1 saistīts ar $2.'],
  [/^Edgars Rajandi dokumentē saikni starp (.+?) un (.+)\.$/,'$1 saistīts ar $2.'],
  [/^Salys vārdu (.+?) tieši saista ar (.+)\.$/,'$1 saistīts ar $2.'],
  [/^Rajandi \d{4}\. gada vārdnīca (.+?) tieši saista ar (.+)\.$/,'$1 saistīts ar $2.'],
  [/^Siliņa vārdnīcas (.+?) šķirklī norādīts kalendāra gads (\d{4})\.$/,'$1 kalendārā iekļauts $2. gadā.'],
  [/^Katalogs (.+?) skaidro ar (.+)$/,'$1 skaidro ar $2'],
  [/^Siliņa katalogs vārdam .+? dod šādu personvārdu atsauču ķēdi: (.+)\.$/,'Radniecīgo vārdu ķēde: $1.'],
  [/^Šī kopīgā šķirkļa atstāstā norādīts (\d{4})\. gada kalendāra ieraksts\.$/,'Kalendārā kopš $1. gada.'],
  [/^Klāva Siliņa vārdnīcai piedēvētais katalogs (.+?) tieši saista ar (.+)\.$/,'$1 ir vārda $2 forma.'],
  [/^(?:Klāva )?Siliņa vārdnīca \(\d{4}\) (.+?) tieši saista ar (.+)\.$/,'$1 ir vārda $2 forma.'],
  [/^Siliņa vārdnīcai piedēvētais katalogs (.+?) tieši saista ar (.+)\.$/,'$1 ir vārda $2 forma.'],
  recordRule('lv',/^(?:(?:Siliņa )?(?:Vārdnīca|Katalogs|katalogs) (?:dod šādu vēsturisku ierakstu|min vēsturisku ziņu|min vēsturisku ierakstu|fiksē šādu vēsturisku ziņu)): (.+)\.$/,/^(.*?);\s*kalendārā (\d{4})$/),
  [/^Siliņa vārdnīca .+? lietojumu datē: (.+)\.$/,'Lietojums pierakstīts: $1.'],
  [/^(\d{4})\. gada kalendārs, kas pārpublicēts Antana Saļa \d{4}\. gada rakstu krājumā, (.+?) ierindo (.+)\.$/,'$1. gada lietuviešu kalendārā $2 ierindots $3.'],
  [/^Salys \d{4}\. gadā pārpublicētajā (\d{4})\. gada lietuviešu kalendārā (.+?) dots (.+)\.$/,'$1. gada lietuviešu kalendārā $3 ierindots $2.'],
  [/^Tieši (.+?) ir Megistes (\d{4})\. gada (?:igauņu )?vārdu ceļvedī\.$/,'$1 minēts $2. gada igauņu vārdu ceļvedī.'],
  [/^Precīzā forma dokumentēta Senn–Salys (\d{4})\. gada lietuviešu–vācu vārdnīcā, kas pārpublicēta Salys rakstos \d{4}\. gadā\.$/,'Precīzā forma drukā fiksēta $1. gadā.'],
  [/^Tā pati vārdnīca min vārda rakstisku liecību (.+?) (\d{4})\. gadā un tā ierakstīšanu kalendārā (\d{4})\. gadā\.$/,'Vārds rakstos minēts $1 $2. gadā, kalendārā ierakstīts $3. gadā.'],
  [/^(.+?) vārdnīcas norāžu ķēdē saistīts ar (.+)\.$/,'$1 saistīts ar $2.'],
  [/^Personvārdu vārdnīcā norādīts, ka (.+?) kalendārā iekļauts (\d{4})\. gadā\.$/,'$1 kalendārā iekļauts $2. gadā.']
 ],
 ru:[
  [/^Руководство по латышской передаче имён даёт точное соответствие с \S+ языка (\S+) → (\S+?)\.$/,'Официальная латышская передача $1 — $2.'],
  [/^Райанди относит (\S+) к эстонской группе «братских имён» рядом с Vello\.$/,'$1 относится к эстонской группе «братских имён» рядом с Vello.'],
  [/^Словарь связывает (\S+) с семьёй (\S+), от древнееврейского dānīēl, объяснённого как «Бог — мой судья»\.$/,'$1 относится к семье имени $2, от древнееврейского dānīēl — «Бог — мой судья».'],
  [/^Латышский словарь Клавса Силиньша различает две ветви:.*$/,'В латышском различают две ветви: женское Inga связывают с германским богом Ингвио, а мужское Inga относят к Indriķis, то есть Генрих; одного значения для обеих ветвей нет.'],
  [/^Латышский словарь объясняет образование имени через (.+)$/,'Имя образовано от $1'],
  [/^Словарь связывает (\S+) с семьёй (\S+) и объясняет древнееврейскую основу Dāvīd как «любимый»\.$/,'$1 относится к семье имени $2; древнееврейская основа Dāvīd значит «любимый».'],
  [/^Латышский словарь личных имён Клавса Силиньша поэтому допускает для (\S+) двойную связь.*$/,'Поэтому имя можно связать и с библейской Евой, и с названием дерева; ни одна связь не является надёжной.'],
  [/^В эстонском словаре имён Эдгара Райанди (\S+) относится к семье Stefanus \/ Stephanus\.$/,'$1 относится к семье Stefanus / Stephanus.'],
  [/^Греческую основу автор объясняет как «корона, венок, диадема» и прямо включает это написание в число форм, употреблявшихся в Эстонии\.$/,'Греческая основа значит «корона, венок, диадема», и это написание — одна из форм, употреблявшихся в Эстонии.'],
  [/^Словарь Клавса Силиньша отмечает и связь Ivars с Johannes как скандинавской формой, не выбирая одного объяснения\.$/,'Ivars связывают и с Johannes как его скандинавскую форму.'],
  [/^На странице \d+ списка имён Мягисте 1929 года приведено (.+)$/,'В эстонском собрании имён 1929 года приведено $1'],
  [/^На странице \d+ исследования 1983 года приведено (\S+) с пометой личного имени\.$/,'$1 записано как личное имя.'],
  [/^В сокращениях сохраняются не все части; французское Adèle — родственное имя семьи adal\.$/,'Французское Adèle — родственное имя от adal.'],
  [/^Словарь средневековых имён приводит родственное (\S+) в латинском источнике из Англии под (\d{4}) годом\.$/,'Родственное латинское $1 записано в Англии в $2 году.'],
  [/^Словарь Силиньша помещает эту форму при (\S+)\.$/,'Это форма имени $1.'],
  [/^Латышское (\S+) словарь Клавса Силиньша обычно связывает с Nikolaus, но упоминает и другое объяснение — от латышского слова klāvs, «хлев»\.$/,'Латышское $1 обычно связывают с Nikolaus, но есть и другое объяснение — от латышского слова klāvs, «хлев».'],
  [/^Она относится к памятным именам нового времени, а не к одному древнему славянскому двухосновному имени\.$/,'Это памятное имя нового времени.'],
  [/^Толкование «хвала Богу» встречается как дополнительная интерпретация.*$/,'«Хвала Богу» — дополнительное толкование.'],
  [/^[^→]*агентств[^→]*?(\S+) → ([^\s,.;]+).*$/u,'Официальная латышская передача $1 — $2.'],
  [/^Латышское языковое агентство даёт точное соответствие (.+?) → (.+?), ссылаясь на страницу \d+ (?:[\p{L}-]+ )*руководства \d{4} года\.$/u,'Официальная латышская передача $1 — $2.'],
  [/^Документированная семья имени (.+?) ведёт к (.+)\.$/,'$1 относится к семье имени $2.'],
  [/^Связь с katharos «чистый» — позднейшее толкование.*$/,'Привычное значение «чистый» — позднейшая связь с греческим katharos.'],
  [/^Календарь (\d{4}) года, перепечатанный у Салиса в \d{4} году, даёт (.+) на (.+)\.$/,'В литовском календаре имён $1 года $2 стоит на $3.'],
  [/^Каталог Силиньша прямо связывает (.+?) с (.+)\.$/,'$1 связано с $2.'],
  [/^Эдгар Раянди документирует связь между (.+?) и (.+)\.$/,'$1 связано с $2.'],
  [/^Салис прямо связывает (.+?) с (.+)\.$/,'$1 связано с $2.'],
  [/^Словарь Раянди \d{4} года прямо связывает (.+?) с (.+)\.$/,'$1 связано с $2.'],
  [/^В статье (.+?) словаря Силиньша указан календарный год (\d{4})\.$/,'$1 включено в календарь в $2 году.'],
  [/^Каталог объясняет (.+?) через (.+)$/,'$1 объясняется через $2'],
  [/^Каталог Силиньша даёт для .+? такую цепочку отсылок к именам: (.+)\.$/,'Цепочка родственных имён: $1.'],
  [/^Пересказ общей статьи указывает календарную запись (\d{4}) года\.$/,'В календаре с $1 года.'],
  [/^Каталог, ссылающийся на (?:словарь )?(?:Клавса )?Силиньша, прямо отсылает от (.+?) к (.+)\.$/,'$1 — форма имени $2.'],
  [/^Словарь (?:Клавса )?Силиньша \(\d{4}\) прямо отсылает от (.+?) к (.+)\.$/,'$1 — форма имени $2.'],
  [/^Каталог, ссылающийся на Силиньша, прямо отсылает от (.+?) к (.+)\.$/,'$1 — форма имени $2.'],
  recordRule('ru',/^(?:(?:Словарь|Каталог)(?: Силиньша)? (?:приводит следующую историческую запись|приводит историческую деталь|приводит историческую запись|фиксирует историческую деталь)): (.+)\.$/,/^(.*?);\s*(?:календарь|в календаре) (\d{4})$/),
  [/^Словарь Силиньша датирует употребление .+?: (.+)\.$/,'Употребление зафиксировано: $1.'],
  [/^Календарь (\d{4}) года, перепечатанный в собрании трудов Антанаса Салиса в \d{4} году, помещает (.+?) на (.+)\.$/,'В литовском календаре $1 года $2 стоит на $3.'],
  [/^В литовском календаре Салиса (\d{4}) года, перепечатанном в \d{4} году, (.+?) стоит (.+)\.$/,'В литовском календаре $1 года $2 стоит $3.'],
  [/^Точное (.+?) включено в (?:эстонский )?справочник имён Мягисте (\d{4}) года\.$/,'$1 включено в эстонский справочник имён $2 года.'],
  [/^Точная форма зафиксирована в литовско-немецком словаре Сенна–Салиса (\d{4}) года, переизданном в собрании трудов Салиса в \d{4} году\.$/,'Точная форма зафиксирована в печати в $1 году.'],
  [/^Тот же словарь фиксирует письменное упоминание имени в (.+?) в (\d{4}) году, а его внесение в календарь — в (\d{4}) году\.$/,'Имя упоминается письменно в $1 в $2 году, в календарь внесено в $3 году.'],
  [/^(.+?) словарной цепочкой связан с (.+)\.$/,'$1 связано с $2.'],
  [/^В словаре личных имён отмечено, что (.+?) включено в календарь в (\d{4}) году\.$/,'$1 включено в календарь в $2 году.']
 ],
 lt:[
  [/^Latviško vardų perteikimo vadovas pateikia tikslų \S+ atitikmenį (\S+) → (\S+?)\.$/,'Oficialus latviškas $1 perteikimas – $2.'],
  [/^Rajandi (\S+) priskiria estų „broliškų vardų“ grupei greta Vello\.$/,'$1 priklauso estų „broliškų vardų“ grupei greta Vello.'],
  [/^Heinrichui, pabrėždamas, kad vienos reikšmės abiem šakoms nėra\.$/,''],
  [/^Žodynas sieja (\S+) su (\S+) šeima iš hebrajų dānīēl, aiškinamo kaip „Dievas yra mano teisėjas“\.$/,'$1 priklauso vardo $2 šeimai iš hebrajų dānīēl – „Dievas yra mano teisėjas“.'],
  [/^Klāvo Siliņio latvių žodynas skiria dvi šakas:.*$/,'Latvių kalboje skiriamos dvi šakos: moteriškas Inga siejamas su germanų dievu Ingvijumi, o vyriškas Inga priskiriamas vardui Indriķis, t. y. Heinrichui; vienos reikšmės abiem šakoms nėra.'],
  [/^Latvių žodynas aiškina vardo sudarymą per (.+)$/,'Vardas sudarytas iš $1'],
  [/^Žodynas sieja (\S+) su (\S+) vardų šeima ir hebrajišką pamatą Dāvīd aiškina kaip „mylimąjį“\.$/,'$1 priklauso vardo $2 šeimai; hebrajiškas pamatas Dāvīd reiškia „mylimasis“.'],
  [/^Todėl Klāvo Siliņšo latvių asmenvardžių žodynas .* leidžia sieti dvejopai.*$/,'Todėl vardą galima sieti ir su biblijine Ieva, ir su medžio pavadinimu; nė vienas ryšys nėra tikras.'],
  [/^Edgaro Rajandi estų vardų žodynas (\S+) priskiria Stefanus \/ Stephanus šeimai\.$/,'$1 priklauso Stefanus / Stephanus šeimai.'],
  [/^Graikišką pamatą autorius aiškina kaip „karūna, vainikas, diadema“ ir šią rašybą tiesiogiai mini tarp Estijoje vartotų formų\.$/,'Graikiškas pamatas reiškia „karūna, vainikas, diadema“, o ši rašyba – viena Estijoje vartotų formų.'],
  [/^Klāvo Siliņio žodyne Ivars taip pat siejamas su Johannes kaip skandinaviška forma, nepasirenkant vieno paaiškinimo\.$/,'Ivars taip pat siejamas su Johannes kaip skandinaviška jo forma.'],
  [/^Mägiste 1929 metų vardų sąrašo \d+ puslapyje pateikiamas (.+)$/,'1929 metų estų vardų rinkinyje pateikiamas $1'],
  [/^1983 metų tyrimo \d+ puslapyje pateikiamas (\S+) su asmenvardžio žyma\.$/,'$1 užfiksuotas kaip asmenvardis.'],
  [/^Trumpiniuose ne visada išlieka abu dėmenys; prancūzų Adèle yra giminingas adal šeimos vardas\.$/,'Prancūzų Adèle – giminingas vardas iš adal.'],
  [/^Viduramžių vardų žodynas pateikia giminingą lotynišką (\S+) Anglijoje (\d{4}) metais\.$/,'Giminingas lotyniškas $1 užrašytas Anglijoje $2 metais.'],
  [/^Siliņšo žodynas pateikia šią formą prie (\S+)\.$/,'Tai vardo $1 forma.'],
  [/^Latvių (\S+) Klāvo Siliņšo žodynas paprastai sieja su Nikolaus, bet mini ir kitą aiškinimą — iš latvių žodžio klāvs, „tvartas“\.$/,'Latvių $1 paprastai siejamas su Nikolaus, bet yra ir kitas aiškinimas – iš latvių žodžio klāvs, „tvartas“.'],
  [/^Ji priklauso naujųjų laikų atminimo vardų kūrimui, o ne vienam senam slavų dvikamieniui vardui\.$/,'Tai naujųjų laikų atminimo vardas.'],
  [/^Aiškinimas „Dievo šlovė“ šaltiniuose pateikiamas kaip papildoma interpretacija.*$/,'„Dievo šlovė“ – papildomas aiškinimas.'],
  [/^[^→]*agentūr[^→]*?(\S+) → ([^\s,.;]+).*$/u,'Oficialus latviškas $1 perteikimas – $2.'],
  [/^Latvių kalbos agentūra pateikia tikslų atitikmenį (.+?) → (.+?), nurodydama \d{4} metų (?:[\p{L}-]+ )*vadovo \d+ puslapį\.$/u,'Oficialus latviškas $1 perteikimas – $2.'],
  [/^Dokumentuota (.+?) vardų šeima veda prie (.+)\.$/,'$1 priklauso vardo $2 šeimai.'],
  [/^Siejimas su katharos „tyras“ yra vėlesnis aiškinimas.*$/,'Įprasta reikšmė „tyras“ kilo iš vėlesnio siejimo su graikų katharos.'],
  [/^Salio \d{4} metų rinkinyje perspausdintas (\d{4}) metų kalendorius (.+?) pateikia (.+)\.$/,'$1 metų lietuvių vardų kalendoriuje $3 pateiktas $2.'],
  [/^Siliņšo katalogas (.+?) tiesiogiai sieja su (.+)\.$/,'$1 siejamas su $2.'],
  [/^Edgaras Rajandi dokumentuoja (.+?) ir (.+?) ryšį\.$/,'$1 siejamas su $2.'],
  [/^Salys vardą (.+?) tiesiogiai sieja su (.+)\.$/,'$1 siejamas su $2.'],
  [/^Rajandi \d{4} metų žodynas (.+?) tiesiogiai sieja su (.+)\.$/,'$1 siejamas su $2.'],
  [/^Siliņšo (.+?) straipsnyje nurodyti kalendoriaus metai (\d{4})\.$/,'$1 į kalendorių įtrauktas $2 metais.'],
  [/^Katalogas (.+?) aiškina per (.+)$/,'$1 aiškinamas per $2'],
  [/^Siliņšo katalogas vardui .+? pateikia tokią asmenvardžių nuorodų grandinę: (.+)\.$/,'Giminingų vardų grandinė: $1.'],
  [/^Bendro įrašo atpasakojime nurodyta (\d{4}) metų kalendoriaus data\.$/,'Kalendoriuje nuo $1 metų.'],
  [/^Klāvo Siliņšo žodynu grindžiamas katalogas (.+?) tiesiogiai sieja su (.+)\.$/,'$1 yra vardo $2 forma.'],
  [/^(?:Klāvo )?Siliņšo žodynas \(\d{4}\) (.+?) tiesiogiai sieja su (.+)\.$/,'$1 yra vardo $2 forma.'],
  [/^Siliņšo žodynu grindžiamas katalogas (.+?) tiesiogiai sieja su (.+)\.$/,'$1 yra vardo $2 forma.'],
  recordRule('lt',/^(?:(?:Siliņšo )?(?:Žodynas|Katalogas|katalogas) (?:pateikia tokį istorinį įrašą|mini istorinę žinią|nurodo istorinį įrašą|fiksuoja istorinę žinią)): (.+)\.$/,/^(.*?);\s*kalendoriuje (\d{4})$/),
  [/^Siliņšo žodynas .+? vartojimą datuoja: (.+)\.$/,'Vartojimas užfiksuotas: $1.'],
  [/^(\d{4}) metų kalendorius, perspausdintas Antano Salio \d{4} metų raštuose, (.+?) pateikia (.+)\.$/,'$1 metų lietuvių kalendoriuje $2 pateiktas $3.'],
  [/^Salio \d{4} metais perspausdintame (\d{4}) metų lietuvių kalendoriuje (.+?) pateikta (.+)\.$/,'$1 metų lietuvių kalendoriuje $3 pateiktas $2.'],
  [/^Tikslus (.+?) yra Mägiste (\d{4}) metų (?:estiškų )?vardų vadove\.$/,'$1 yra $2 metų estiškų vardų vadove.'],
  [/^Tiksli forma dokumentuota Senn–Salio (\d{4}) metų lietuvių–vokiečių žodyne, perspausdintame Salio raštuose \d{4} metais\.$/,'Tiksli forma spaudoje užfiksuota $1 metais.'],
  [/^Tas pats žodynas nurodo rašytinį vardo paminėjimą (.+?) (\d{4}) metais ir jo įrašymą į kalendorių (\d{4}) metais\.$/,'Vardas raštu paminėtas $1 $2 metais, į kalendorių įrašytas $3 metais.'],
  [/^(.+?) žodyno nuorodų grandine siejamas su (.+)\.$/,'$1 siejamas su $2.'],
  [/^Asmenvardžių žodyne nurodyta, kad (.+?) į kalendorių įtrauktas (\d{4}) metais\.$/,'$1 į kalendorių įtrauktas $2 metais.']
 ],
 et:[
  [/^Läti nimemuganduse käsiraamat annab täpse \S+ vaste (\S+) → (\S+?)\.$/,'$1 ametlik läti kirjapilt on $2.'],
  [/^Rajandi paigutab nime (\S+) Velloga samasse eesti „vennasnimede” rühma\.$/,'$1 kuulub Velloga samasse eesti „vennasnimede” rühma.'],
  [/^Selles seob ta soome Veikko sõnaga veli „vend”\.$/,'Rühm seob soome Veikko sõnaga veli „vend”.'],
  [/^Sõnastik seob nime (\S+) (\S+?)i nimeperega, mille heebrea alust dānīēl seletatakse „Jumal on mu kohtunik”\.$/,'$1 kuulub nime $2 perre, mille heebrea alus dānīēl tähendab „Jumal on mu kohtunik”.'],
  [/^Klāvs Siliņši läti sõnaraamat eristab kaht haru:.*$/,'Läti keeles eristatakse kaht haru: naisenime Inga seostatakse germaani jumala Ingvioga, mehenimi Inga kuulub aga nime Indriķis ehk Heinrichi juurde; üht tähendust mõlemale harule pole.'],
  [/^Läti sõnaraamat seletab nime moodustust sõnadega (.+)$/,'Nimi on moodustatud sõnadest $1'],
  [/^Sõnastik seob nime (\S+) (\S+?)i nimeperega ning seletab heebrea alust Dāvīd tähendusega „armastatu”\.$/,'$1 kuulub nime $2 perre; heebrea alus Dāvīd tähendab „armastatu”.'],
  [/^Seepärast lubab Klāvs Siliņši läti isikunimede sõnaraamat .* kahesugust seost.*$/,'Seepärast võib nime seostada nii piibli Eeva kui ka puu nimetusega; kumbki seos pole kindel.'],
  [/^Edgar Rajandi nimeleksikon paigutab nime (\S+) Stefanuse \/ Stephanuse nimeperre\.$/,'$1 kuulub Stefanuse / Stephanuse nimeperre.'],
  [/^Kreeka alust seletab ta sõnadega „kroon, pärg, diadeem” ning loetleb selle täpse kirjapildi Eestis kasutatud kujude seas\.$/,'Kreeka alus tähendab „kroon, pärg, diadeem” ning see kirjapilt on üks Eestis kasutatud kujudest.'],
  [/^Klāvs Siliņši sõnaraamat märgib ka Ivarsi seost Johannesega kui skandinaavia vormiga, valimata üht seletust\.$/,'Ivarsit on seostatud ka Johannesega kui selle skandinaavia vormiga.'],
  [/^Mägiste 1929\. aasta nimestiku lehekülg \d+ annab (.+)$/,'1929. aasta eesti nimekogu annab $1'],
  [/^1983\. aasta uurimuse lehekülg \d+ annab kuju (\S+) isikunime märkega\.$/,'$1 on kirja pandud isikunimena.'],
  [/^Lühikujud ei pruugi säilitada mõlemat osist; prantsuse Adèle on adal-pere sugulasnimi\.$/,'Prantsuse Adèle on adal-tüvega sugulasnimi.'],
  [/^Keskaegsete nimede sõnaraamat annab sugulaskuju (\S+) Inglismaa ladina allikas aastaga (\d{4})\.$/,'Ladina sugulaskuju $1 on kirja pandud Inglismaal $2. aastal.'],
  [/^Siliņši sõnaraamat esitab kuju (\S+?)i all\.$/,'See on nime $1 vorm.'],
  [/^Läti (\S+) seob \S+ Siliņši sõnastik tavaliselt Nikolausega, kuid mainib ka teist seletust — läti sõnast klāvs, „laut“\.$/,'Läti $1 seostatakse tavaliselt Nikolausega, kuid seda on seletatud ka läti sõnast klāvs, „laut“.'],
  [/^See kuulub uuema aja mälestusnimede loomesse, mitte ühe muistse slaavi liitnime juurde\.$/,'See on uuema aja mälestusnimi.'],
  [/^Jumala kiitus esineb allikates lisatõlgendusena.*$/,'„Jumala kiitus“ on lisatõlgendus.'],
  [/^[^→]*[Kk]eeleagentuur[^→]*?(\S+) → ([^\s,.;]+).*$/u,'$1 ametlik läti kirjapilt on $2.'],
  [/^Läti Keeleagentuur annab täpse vaste (.+?) → (.+?), viidates \d{4}\. aasta (?:[\p{L}-]+ )*juhendi leheküljele \d+\.$/u,'$1 ametlik läti kirjapilt on $2.'],
  [/^(.+?) dokumenteeritud nimepere viib kujuni (.+)\.$/,'$1 kuulub nime $2 perre.'],
  [/^Seos sõnaga katharos, puhas, on hilisem tõlgendus.*$/,'Levinud tähendus „puhas“ tuleb hilisemast seosest kreeka sõnaga katharos.'],
  [/^Salyse \d{4}\. aasta köites taasavaldatud (\d{4})\. aasta kalender annab (.+) (\d+\. \S+)\.$/,'$1. aasta leedu nimekalendris on $2 $3.'],
  [/^Siliņši kataloog seob nime (.+?) otseselt kujuga (.+)\.$/,'$1 seostub nimega $2.'],
  [/^Edgar Rajandi dokumenteerib nimede (.+?) ja (.+?) seose\.$/,'$1 seostub nimega $2.'],
  [/^Salys seob nime (.+?) otseselt nimega (.+)\.$/,'$1 seostub nimega $2.'],
  [/^Rajandi \d{4}\. aasta sõnastik seob nime (.+?) otseselt kujuga (.+)\.$/,'$1 seostub nimega $2.'],
  [/^Siliņši (.+?) kirje annab kalendriaastaks (\d{4})\.$/,'$1 lisati kalendrisse $2. aastal.'],
  [/^Kataloog seletab nime (.+?) järgmiste lähteosadega: (.+)$/,'$1 lähteosad: $2'],
  [/^Siliņši kataloog annab nimele .+? järgmise nimeviidete ahela: (.+)\.$/,'Seotud nimede ahel: $1.'],
  [/^Ühise kirje kokkuvõte annab kalendrikande aastast (\d{4})\.$/,'Kalendris alates $1. aastast.'],
  [/^Klāvs Siliņši sõnastikule tuginev kataloog seob nime (.+?) otseselt kujuga (.+)\.$/,'$1 on nime $2 vorm.'],
  [/^(?:Klāvs )?Siliņši sõnastik \(\d{4}\) seob nime (.+?) otseselt kujuga (.+)\.$/,'$1 on nime $2 vorm.'],
  [/^Siliņši sõnastikule tuginev kataloog seob nime (.+?) otseselt kujuga (.+)\.$/,'$1 on nime $2 vorm.'],
  recordRule('et',/^(?:(?:Siliņši )?(?:Sõnastik|Kataloog|kataloog) (?:annab järgmise ajaloolise kirje|annab ajaloolise teabe|viitab ajaloolisele kirjele)): (.+)\.$/,/^(.*?);\s*kalendris (\d{4})$/),
  [/^Siliņši sõnaraamat dateerib .+? kasutuse: (.+)\.$/,'Kasutus on kirja pandud: $1.'],
  [/^Antanas Salysi \d{4}\. aasta kogutud kirjutistes taastrükitud (\d{4})\. aasta kalender paigutab nime (.+?) (.+)\.$/,'$1. aasta leedu kalendris on $2 $3.'],
  [/^Salysi \d{4}\. aastal uuesti avaldatud (\d{4})\. aasta leedu kalendris on (.+?) (.+)\.$/,'$1. aasta leedu kalendris on $2 $3.'],
  [/^Täpne (.+?) leidub Mägiste (\d{4})\. aasta (?:eesti )?nimejuhis\.$/,'$1 leidub $2. aasta eesti nimejuhis.'],
  [/^Täpne vorm on dokumenteeritud Senn–Salyse (\d{4})\. aasta leedu-saksa sõnastikus, mis avaldati uuesti Salyse kogutud kirjutistes \d{4}\. aastal\.$/,'Täpne vorm on trükis kirja pandud $1. aastal.'],
  [/^Sama sõnaraamat märgib nime kirjalikku mainimist (.+?) (\d{4})\. aastal ja selle kalendrisse lisamist (\d{4})\. aastal\.$/,'Nime on kirjalikult mainitud $1 $2. aastal, kalendrisse lisati see $3. aastal.'],
  [/^(.+?) seostub sõnaraamatu ristviidete kaudu (.+)\.$/,'$1 seostub $2.'],
  [/^Isikunimede sõnaraamatu järgi lisati (.+?) kalendrisse (\d{4})\. aastal\.$/,'$1 lisati kalendrisse $2. aastal.']
 ]
};


// In-sentence source parentheticals inside narrative prose, e.g.
// “(Klāvs Siliņš’s dictionary records Grieta in 1729 and in the calendar from 1817)”.
const INLINE={
 en:[[/^Klāvs Siliņš’s dictionary of Latvian personal names files Indulis under Indriķis/,'Indulis is grouped with Indriķis'],[/Klāvs Siliņš’s dictionary dates its first calendar entry to (\d{4})/g,'its first calendar entry dates from $1'],[/, and the Nordic Names reference also mentions a South German and Yiddish pet form of Maria/g,', and it is also a South German and Yiddish pet form of Maria'],[/^Behind the Name stresses that /,''],[/^In its account of the western name, Behind the Name recalls/,'The western name brings to mind'],[/the first bearer known to the dictionary/g,'the first known bearer'],[/, which is why Lithuanian Wikipedia calls her only a “supposedly” Lithuanian deity/g,', so she is at best a “supposed” Lithuanian deity'],[/, and Klāvs Siliņš’s Latvian dictionary is just as cautious/g,''],[/, and Klāvs Siliņš’s Latvian dictionary links Oskars with/g,'; Latvian Oskars is also linked with'],[/, and Estonian Wikipedia describes it as a name of Russian origin\./g,'.'],[/^Behind the Name treats Niina as .*Anniina\.$/,'Niina is also a Finnish form of Nina and, in Finnish, a short form of Anniina.'],[/^According to the same source, /,''],[/Klāvs Siliņš’s dictionary finds Andrejs in Latvian written records from (\d{4}) and the shorter Andris from (\d{4})/g,'Latvian written records show Andrejs from $1 and the shorter Andris from $2'],[/^According to Klāvs Siliņš’s dictionary, /,''],[/\((?:Klāvs )?Siliņš’s dictionary records (\S+) in (\d{4}) and in the calendar from (\d{4})\)/g,'($1 is recorded in $2 and in the calendar from $3)']],
 lv:[[/^Klāva Siliņa «Latviešu personvārdu vārdnīcā» Indulis ievietots pie Indriķa/,'Indulis tiek saistīts ar Indriķi'],[/Klāva Siliņa vārdnīca tā pirmo kalendāra ierakstu datē ar (\d{4})\. gadu/g,'tā pirmais kalendāra ieraksts ir no $1. gada'],[/, bet uzziņu avots Nordic Names min arī dienvidvācu un jidiša Marijas mīlināmo formu/g,', turklāt tā ir arī dienvidvācu un jidiša Marijas mīlināmā forma'],[/^Behind the Name uzsver, ka /,''],[/^Stāstot par rietumu vārdu Merle, Behind the Name atgādina/,'Rietumu vārds Merle atgādina'],[/pirmais vārdnīcai zināmais vārda nesējs/g,'pirmais zināmais vārda nesējs'],[/, tāpēc lietuviešu Vikipēdija viņu sauc tikai par «it kā» lietuviešu dievieti/g,', tāpēc viņa ir tikai «it kā» lietuviešu dieviete'],[/; tikpat piesardzīga ir arī Klāva Siliņa latviešu vārdnīca/g,''],[/, bet Klāva Siliņa latviešu vārdnīca Oskaru saista ar/g,'; latviešu Oskaru saista arī ar'],[/; igauņu Vikipēdija to sauc par krievu izcelsmes vārdu\./g,'.'],[/^Behind the Name uzskata Niina .*Anniina īso formu\.$/,'Niina ir arī somu forma, bet somu valodā — arī vārda Anniina īsforma.'],[/, pēc tā paša avota,/g,''],[/Klāva Siliņa vārdnīca Andreju latviešu rakstu avotos atrod jau (\d{4})\. gadā, bet īsāko Andri — (\d{4})\. gadā/g,'Latviešu rakstos Andrejs sastopams jau $1. gadā, bet īsākais Andris — $2. gadā'],[/^Saskaņā ar Klāva Siliņa vārdnīcu /,''],[/\((?:Klāva )?Siliņa vārdnīcā (\S+) fiksēta (\d{4})\. gadā un kalendārā ierakstīta (\d{4})\. gadā\)/g,'($1 pierakstīta $2. gadā, kalendārā kopš $3. gada)']],
 ru:[[/^Словарь латышских личных имён Клавса Силиньша помещает Indulis в гнездо имени Indriķis/,'Indulis относят к гнезду имени Indriķis'],[/словарь Клавса Силиньша датирует её первую календарную запись (\d{4}) годом/g,'её первая календарная запись относится к $1 году'],[/, а справочник Nordic Names упоминает ещё и южнонемецкую и идишскую ласковую форму имени Мария/g,', а ещё это южнонемецкая и идишская ласковая форма имени Мария'],[/^Behind the Name подчёркивает, что /,''],[/^Behind the Name, рассказывая о западном Merle, вспоминает/,'Западное Merle вызывает в памяти'],[/первый известный словарю носитель/g,'первый известный носитель'],[/, поэтому в литовской Википедии её прямо называют «якобы литовской» богиней/g,', так что она лишь «якобы литовская» богиня'],[/, по оценке исследователей,/g,''],[/; так же осторожен и латышский словарь Клавса Силиньша/g,''],[/; латышский словарь Клавса Силиньша связывает Oskars с/g,'; латышское Oskars связывают также с'],[/; эстонская Википедия называет его именем русского происхождения\./g,'.'],[/^Behind the Name считает Niina .*Anniina\.$/,'Niina — также финская форма, а в финском ещё и краткая форма имени Anniina.'],[/, по его данным,/g,''],[/Словарь Клавса Силиньша находит \S+ в латышских письменных источниках с (\d{4}) года, а более короткое Andris — с (\d{4})-го/g,'В латышских текстах Andrejs встречается с $1 года, а более короткое Andris — с $2-го'],[/^По словарю Клавса Силиньша, /,''],[/\(по словарю (?:Клавса )?Силиньша, (\S+) засвидетельствована в (\d{4}) году и внесена в календарь в (\d{4})-м\)/g,'($1 засвидетельствована в $2 году, в календаре с $3 года)']],
 lt:[[/^Klāvo Siliņio latvių asmenvardžių žodyne Indulis priskirtas vardui Indriķis/,'Indulis priskiriamas vardui Indriķis'],[/Klāvo Siliņo žodynas pirmą jo kalendoriaus įrašą datuoja (\d{4}) metais/g,'pirmasis jo kalendoriaus įrašas yra $1 metų'],[/, o žinynas Nordic Names mini ir pietų vokiečių bei jidiš meilią Marijos formą/g,', be to, tai ir pietų vokiečių bei jidiš meili Marijos forma'],[/^Behind the Name pabrėžia, kad /,''],[/^Pasakodamas apie vakarietišką Merle, Behind the Name primena/,'Vakarietiškas Merle primena'],[/pirmasis žodynui žinomas vardo turėtojas/g,'pirmasis žinomas vardo turėtojas'],[/, todėl lietuviškoje Vikipedijoje ji vadinama tik „neva“ lietuvių deive/g,', todėl ji tėra „neva“ lietuvių deivė'],[/; toks pat atsargus ir Klāvo Siliņšo latvių vardų žodynas/g,''],[/, o Klāvo Siliņšo latvių vardų žodynas Oskars sieja su/g,'; latviškas Oskars siejamas ir su'],[/; estiškoji Vikipedija jį vadina rusų kilmės vardu\./g,'.'],[/^Behind the Name laiko Niina .*Anniina trumpiniu\.$/,'Niina yra ir suomiška forma, o suomių kalboje – ir vardo Anniina trumpinys.'],[/, pasak to paties šaltinio,/g,''],[/Klāvo Siliņšo žodynas latvių \S+ randa rašytiniuose šaltiniuose nuo (\d{4}) metų, o trumpesnį Andris — nuo (\d{4})-ųjų/g,'Latvių raštuose Andrejs užfiksuotas nuo $1 metų, o trumpesnis Andris – nuo $2-ųjų'],[/^Pasak Klāvo Siliņšo žodyno, /,''],[/\((?:Klāvo )?Siliņšo žodyne (\S+) užfiksuota (\d{4}) metais, į kalendorių įrašyta (\d{4}) metais\)/g,'($1 užfiksuota $2 metais, kalendoriuje nuo $3 metų)']],
 et:[[/^Klāvs Siliņši läti isikunimede sõnaraamat paigutab Indulise nime Indriķis alla/,'Indulis kuulub nime Indriķis alla'],[/Klāvs Siliņši sõnaraamat dateerib selle esimese kalendrikirje (\d{4})\. aastasse/g,'selle esimene kalendrikirje pärineb $1. aastast'],[/, Nordic Namesi andmestik mainib ka Maria lõunasaksa ja jidiši hellitusvormi/g,'; see on ka Maria lõunasaksa ja jidiši hellitusvorm'],[/^Behind the Name rõhutab, et /,''],[/^Läänemaise Merle puhul meenutab Behind the Name/,'Läänemaine Merle meenutab'],[/esimene sõnaraamatule teadaolev nimekandja/g,'esimene teadaolev nimekandja'],[/, mistõttu leedu Vikipeedia nimetab teda vaid „väidetavalt“ leedu jumalannaks/g,', nii et ta on vaid „väidetavalt“ leedu jumalanna'],[/, ja sama ettevaatlik on ka Klāvs Siliņši läti nimesõnastik/g,''],[/, Klāvs Siliņši läti nimesõnastik seob Oskarsi aga/g,'; läti Oskarsit seostatakse ka'],[/ ning Eesti Vikipeedia nimetab seda venepäraseks nimeks\./g,'.'],[/^Behind the Name peab Niinat .*Anniina lühivormiks\.$/,'Niina on ka soome kuju, soome keeles ka nime Anniina lühivorm.'],[/^Sama allika järgi tekkis Nina /,'Nina tekkis '],[/Klāvs Siliņši sõnastik leiab \S+ läti kirjalikest allikatest alates (\d{4})\. aastast ja lühema Andrise alates (\d{4})\. aastast/g,'Läti kirjasõnas esineb Andrejs alates $1. aastast ja lühem Andris alates $2. aastast'],[/^Klāvs Siliņši sõnastiku järgi /,''],[/\((?:Klāvs )?Siliņši sõnaraamatus on (\S+) kirjas (\d{4})\. aastal ja kalendris alates (\d{4})\. aastast\)/g,'($1 on kirjas $2. aastal ja kalendris alates $3. aastast)']]
};
export function rewriteSentence(sentence,lang){
 for(const [re,to] of INLINE[lang]||[])sentence=sentence.replace(re,to);
 sentence=sentence.charAt(0).toLocaleUpperCase()+sentence.slice(1);
 for(const [re,to] of REWRITES[lang]||[])if(re.test(sentence))return sentence.replace(re,to);
 return sentence;
}

// Automatic cleanup of one reviewed history (all languages at once, so caveats are removed
// at the same position everywhere). Paragraphs left empty are dropped.
export function plainByRules(text){
 text=applyWording(text,splitSentences);
 const en=text.en||[],out={};
 const drop=en.map(p=>splitSentences(p).map(isCaveat));
 for(const lang of LANGS){
  const paras=(text[lang]||[]).map((p,i)=>{
   const s=splitSentences(p),d=drop[i]||[];
   // Remove by position only when the translation is sentence-aligned with English.
   const aligned=s.length===d.length;
   let keep;
   if(lang==='en'||aligned)keep=s.filter((x,k)=>!d[k]);
   else{
    // Not aligned: when the English caveats form the paragraph's tail, cut the same tail.
    const first=d.indexOf(true),tail=first>=0&&d.slice(first).every(Boolean);
    keep=tail&&s.length>first?s.slice(0,first):s;
   }
   if(keep.length)keep[0]=keep[0].replace(/^[\p{Lu}][\p{L}’'-]*: (?=\p{Lu})/u,'');
   return keep.map(x=>rewriteSentence(x,lang)).filter(Boolean).join(' ').trim();
  }).filter(Boolean);
  out[lang]=paras.length?paras:(text[lang]||[]);
 }
 return out;
}

// Hand-rewritten plain versions, registered by country and name (calendar-order pass).
const manual={lv:{...plainCalendar.lv},lt:{...plainCalendar.lt},ee:{...plainCalendar.ee}};
export function plainHypothesis(text){return applyWording(text,splitSentences);}
export function registerPlainHistories(country,entries){Object.assign(manual[country],entries);}
export function plainHistory(name,country,history){
 const m=manual[country]?.[name];
 if(m&&LANGS.every(l=>m[l]?.length))return applyWording(m,splitSentences);
 return plainByRules(history.text);
}
