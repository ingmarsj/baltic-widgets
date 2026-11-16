// Reader-facing prose only. Evidence limits and next steps belong in research notes.
// Uncertainty is conveyed by the Hypothesis label and qualified origin wording.
const RULES={
 en:{
  replace:[
   [/; its likeness to .+ does not prove a link\./g,'.'],
   [/A separate usage record (.+?) does not settle the etymology\./g,'The name is recorded $1.'],
   [/Sirena’s 2015 list records the form for (.+?); usage does not settle its etymology\./g,'A 2015 name-day list records the name on $1.'],
   [/The entry’s medieval date belongs to a group of forms, so it should not be read as proof of the exact modern spelling in 1305\./g,'A group of related forms is recorded in 1305.'],
   [/\bmay be related to ([^.]+? \+ [^.]+)\./g,'may contain the elements $1.'],
   [/^(.+?) is still being checked against (.+?)\./,'$1 may be related to $2.'],
   [/, reprinted in Salys’s writings in 1983,/g,', reprinted in 1983,'],
   [/reprinted by Salys in 1983/g,'reprinted in 1983'],
   [/reprinted in Salys’s writings in 1983/g,'reprinted in 1983'],
   [/^The exact form (.+?) is documented: /,'$1 appears in records: '],
   [/^The spelling (.+?) itself is documented: /,'$1 appears in records: '],
   [/; the later legends need to be kept apart from what is securely known\./g,'.'],
   [/, but this is only a working proposal\./g,'.'],
   [/, and the two should not be merged\./g,'.'],
   [/whose original meaning remains unestablished in the checked material/g,'whose original meaning is uncertain'],
   [/^A comparison with (.+?) would be a working hypothesis\./,'It may be related to $1.'],
   [/; usage alone does not choose one derivation\./g,'.'],
   [/^(.+?) still needs checking against (.+?)\./,'$1 may be related to $2.'],
   [/A comparison to investigate for (.+?) is (.+?), but the full connection remains unverified\./g,'$1 may be related to $2.'],
   [/^(.+?) can be compared by spelling with (.+?), but .*?this exact form\./,'$1 may be a variant of $2.'],
   [/^The origin of (.+?) still needs checking\./,'The origin of $1 is uncertain.'],
   [/The exact form (.+?) is documented: it is (recorded|first recorded) /g,'$1 is $2 '],
   [/The exact form is recorded in print /g,'It appears in print '],
   [/; (?:those dated records do not themselves settle the origin|these establish use rather than select an etymology|that date does not settle the origin)\./g,'.'],
   [/; the long ā in Latvian must be documented for each particular spelling\./g,'.'],
   [/, but (?:a direct correspondence for this exact spelling remains unverified|the precise origin link remains unverified|the different vowel length is not yet a documented correspondence|this relationship remains unverified|the checked sources do not establish the exact derivation)\./g,'.'],
   [/\b(?:might|may) be compared (?:in form )?with\b/g,'may be related to'],
   [/\b(?:could be|can be) compared with (?:the documented form )?/g,'may be related to '],
   [/^The spelling (.+?) suggests a possible comparison with /,'$1 may be related to '],
   [/; it is not evidence for the modern feminine name\./g,'.'],
   [/; a pleasing translation cannot be chosen merely from similar sounds\./g,'.'],
   [/; that is literary evidence rather than proof of derivation\./g,'.']
  ],
  drop:/^(?:This is (?:a|an|only)|This (?:does not settle|difference does not establish)|These traditions should not|Its cultural history is clearer|This remains an unverified|This (?:origin|link|comparison)|An? (?:explicit connection|exact-form link)|Similar(?:ity| sound| spellings)|The (?:origin, early|related (?:Greek|name)|Hebrew-family explanation therefore|similar form’s origin|exact origin therefore|first stem of this exact form|full stem analysis)|Source information about|Name research tests|Those comparisons alone|They do not supply|That supports a comparison|A shared name day does not prove|The origin of .+ therefore cannot|.+(?:cannot (?:automatically |safely )?be (?:transferred|assigned)|still needs (?:checking|resolving)|should not be (?:derived|replaced)))/i
 },
 ru:{
  replace:[
   [/^(.+?) по написанию можно сравнить с (.+?), (?:но|однако) .*?форме\./,'$1, возможно, вариант имени $2.'],
   [/; сходство с древним названием острова Эльба — .+? — связи не доказывает\./g,'.'],
   [/; одно сходство с Ilze этого не доказывает\./g,'.'],
   [/; поздние легенды нужно отличать от достоверно известных событий\./g,'.'],
   [/^Для латышского Jānis словарь Клавса Силиньша обсуждает и другие объяснения/,'Для латышского Jānis существуют и другие объяснения'],
   [/, и не считает ни одну этимологию окончательной/g,'; окончательная этимология не установлена'],
   [/^Латышский словарь Клавса Силиньша допускает связь /,'Возможна также связь '],
   [/можно предположительно сравнить с (.+?), однако проверенные источники не подтверждают прямую связь происхождения именно для этого написания\./g,'возможно, связано с $1.'],
   [/; употребление не выбирает единственную этимологию\./g,'.'],
   [/Средневековая дата относится к группе форм и не доказывает точное современное написание в 1305 году\./g,'Группа родственных форм имени встречается в записях 1305 года.'],
   [/Норвежские исследователи считают его скорее всего саамским или финским, возможно связанным с (.+?), а другие сравнивают с арабским (.+?) — «ночь»; и в латышских исследованиях имён осторожно упоминается саамский источник\./g,'Имя, вероятно, имеет саамское или финское происхождение и может быть связано с $1. Другая возможная связь — с арабским $2 «ночь».'],
   [/; красиво?й перевод нельзя выбирать только по созвучию\./g,'.'],
   [/можно предположительно сопоставить с документированной формой/g,'возможно, связано с'],
   [/можно (?:сопоставить|сравнить) (?:по форме )?с/g,'может быть связано с'],
   [/, но связь точных написаний пока не подтверждена\./g,'.'],
   [/^Для происхождения (.+?) можно проверить сопоставление (.+?), (?:но|однако) .*?\./,'$1, возможно, связано с $2.'],
   [/^Происхождение (.+?) ещё проверяется в сопоставлении с (.+?)\./,'$1, возможно, связано с $2.'],
   [/, перепечатанный в трудах Салиса в 1983 году,/g,', перепечатанный в 1983 году,'],
   [/перепечатанный Салисом в 1983-м/g,'перепечатанный в 1983 году'],
   [/в трудах Салиса/g,''],
   [/^Сама форма (.+?) документирована: /,'$1 встречается в записях: '],
   [/, но это лишь рабочая версия\./g,'.'],
   [/; употребление не выбирает единственную этимологию\./g,'.'],
   [/^(.+?) ещё нужно проверить в сопоставлении с (.+?)\./,'$1, возможно, связано с $2.'],
   [/Для (.+?) можно проверить сопоставление с (.+?), но .*?\./g,'$1, возможно, связано с $2.'],
   [/^(.+?) по написанию можно сравнить с (.+?), (?:но|однако) .*?форме\./,'$1, возможно, вариант имени $2.'],
   [/Происхождение (.+?) ещё нужно проверить\./g,'Происхождение $1 точно не установлено.'],
   [/Точная форма (.+?) документирована: она (?:зафиксирована|записана) /g,'$1 записано '],
   [/; (?:эти даты сами по себе не устанавливают происхождение|эта дата не решает вопрос происхождения|они подтверждают употребление, а не выбирают этимологию)\./g,'.'],
   [/, но (?:точная связь происхождения ещё не проверена|различие в долготе гласного ещё не подтверждено как соответствие|эта связь ещё не проверена|прямое соответствие именно этого написания пока не подтверждено)\./g,'.'],
   [/\bможно (?:сопоставить|сравнить) (?:по форме )?с\b/g,'может быть связано с'],
   [/^Написание (.+?) позволяет рассмотреть возможную связь с /,'$1 может быть связано с '],
   [/; это литературное свидетельство, а не доказательство происхождения\./g,'.']
  ],
  drop:/^(?:Это (?:предположение|непроверенн|лишь|рабочая|только)|Пока это непроверенное|Прямую связь|Нужны |Нужно |Требуется |Разные полные формы не следует|Поэтому (?:происхождение|этимологию|точную этимологию|объяснение)|Созвучие|Сходство|Одного сходства|Сходные написания|Общая дата именин|Данные об |Исследование имён|.+(?:нельзя переносить|не позволяют? переносить|не становятся? автоматически|не становится автоматически|ещё нужно (?:найти|проверить)|нуждается в проверке|нельзя (?:автоматически |безопасно )?(?:переносить|приписывать|считать)|не доказывает происхождение))/i
 },
 lv:{
  replace:[
   [/Saļa rakstos /g,''],
   [/^(.+?) pēc rakstības var salīdzināt ar (.+?), taču .*?formu\./,'$1 varētu būt vārda $2 variants.'],
   [/^(.+?) cilmei pārbaudāms salīdzinājums ir (.+?), taču .*?\./,'$1 varētu būt saistīts ar $2.'],
   [/^(.+?) izcelsmi vēl pārbauda salīdzinājumā ar (.+?)\./,'$1 varētu būt saistīts ar $2.'],
   [/kas pārpublicēts Saļa rakstos 1983\. gadā/g,'kas pārpublicēts 1983. gadā'],
   [/^Pati (.+?) forma ir dokumentēta: /,'$1 atrodams pierakstos: '],
   [/; latviešu rakstībā garais ā ir jāpārbauda katrai formai atsevišķi\./g,'.'],
   [/, taču tā ir tikai darba versija\./g,'.'],
   [/pārbaudītajos materiālos nav droši noteikta/g,'nav zināma'],
   [/, taču precīzs atvasinājums pārbaudītajos avotos nav atrasts\./g,'.'],
   [/^(.+?) vēl jāpārbauda salīdzinājumā ar (.+?)\./,'$1 varētu būt saistīts ar $2.'],
   [/^(.+?) pēc rakstības varētu salīdzināt ar (.+?), taču .*?formu\./,'$1 varētu būt vārda $2 variants.'],
   [/^(.+?) cilme vēl jāpārbauda\./,'$1 cilme nav skaidra.'],
   [/Precīzā forma (.+?) ir dokumentēta: tā (?:pierakstīta|reģistrēta) /g,'$1 pierakstīts '],
   [/; šie datētie ieraksti paši par sevi neatrisina cilmi\./g,'.'],
   [/, taču precīzā cilmes saikne vēl nav pārbaudīta\./g,'.'],
   [/varētu salīdzināt ar/g,'varētu būt saistīts ar']
  ],
  drop:/^(?:Tas ir (?:pieņēmums|nepārbaudīts|tikai)|Tā (?:ir (?:darba|tikai|nepārbaudīta)|paliek nepārbaudīta)|Pilnais skaidrojums pagaidām|Jāsaglabā precīzā|Šis ir |Šī ir (?:darba|tikai|nepārbaudīta|konkrētā)|Tieša abu rakstību|Jāatrod |Nepieciešama |Tādēļ (?:radniecīgās|līdzīgās|cilmes|precīzā|cita vārda)|Līdzīga skaņa|Līdzīgi rakstījumi|Formu līdzība|Avota ziņas|.+(?:nevar (?:automātiski )?pārnest|nav pārnesami|vēl jāpārbauda|vēl jāatrod|nepierāda cilmi))/i
 },
 lt:{
  replace:[
   [/galima būtų lyginti su dokumentuota forma/g,'galbūt yra vardo variantas:'],
   [/, tačiau tikslių rašybų ryšys dar nepatvirtintas\./g,'.'],
   [/^(.+?) pagal rašybą galima palyginti su (.+?), tačiau .*?formai\./,'$1 galbūt yra vardo $2 variantas.'],
   [/^(.+?) kilmei tirti galima lyginti (.+?), tačiau .*?\./,'Vardas $1 galbūt susijęs su $2.'],
   [/^(.+?) kilmė dar tikrinama lyginant su (.+?)\./,'Vardas $1 galbūt susijęs su $2.'],
   [/^Pati (.+?) forma dokumentuota: /,'$1 yra įrašytas: '],
   [/Salio raštuose 1983 metais/g,'1983 metais'],
   [/Salio raštuose 1983 m\./g,'1983 m.'],
   [/^(.+?) dar reikia patikrinti lyginant su (.+?)\./,'$1 galėtų būti susijęs su $2.'],
   [/^(.+?) pagal rašybą galima lyginti su (.+?), tačiau .*?formai\./,'$1 galėtų būti vardo $2 variantas.'],
   [/Tiksli forma (.+?) yra dokumentuota: ji (?:užrašyta|užfiksuota) /g,'$1 užrašyta '],
   [/, tačiau tikslus kilmės ryšys dar nepatikrintas\./g,'.'],
   [/galima lyginti su/g,'galėtų būti susijęs su']
  ],
  drop:/^(?:Tai (?:prielaida|kilmės prielaida|nepatikrintas|tik|darbinė)|Ši hipotezė|Tiesioginį rašybų|Reikia |Būtina |Todėl (?:giminingos|tikslią|kilmė)|Panašus skambesys|Vien panašumas|Panašios rašybos|Šaltinio duomen|.+(?:negalima (?:automatiškai )?perkelti|neleidžia perkelti|dar reikia (?:patikrinti|rasti)|dar turi būti patikrinta|neįrodo kilmės))/i
 },
 et:{
  replace:[
   [/; sarnasus Ilzega üksi seost ei tõesta\./g,'.'],
   [/See ei tõesta üht kindlat tuletusteed; ka /g,'Ka '],
   [/^(.+?) võib kirjapildi järgi võrrelda nimega (.+?), kuid .*?kohta\./,'$1 võib olla nime $2 variant.'],
   [/^(.+?) päritolu uurides saab võrrelda kujusid (.+?), kuid .*?\./,'$1 võib olla seotud nimega $2.'],
   [/^(.+?) päritolu kontrollitakse veel võrdluses kujuga (.+?)\./,'$1 võib olla seotud nimega $2.'],
   [/Salyse kirjutistes 1983\. aastal taastrükitud/g,'1983. aastal taastrükitud'],
   [/Salyse 1983\. aastal taasavaldatud/g,'1983. aastal taasavaldatud'],
   [/Salyse kirjutistes 1983\. aastal/g,'1983. aastal'],
   [/^Kirjapilt (.+?) ise on dokumenteeritud: /,'$1 on kirjas: '],
   [/, kuid see on vaid tööversioon\./g,'.'],
   [/^Võrdlus (.+?) oleks tööhüpotees\./,'Võimalik on seos nimega $1.'],
   [/; kasutus üksi ei vali üht tuletust\./g,'.'],
   [/^(.+?) vajab veel kontrollimist võrdluses kujuga (.+?)\./,'$1 võib olla seotud nimega $2.'],
   [/^(.+?) kirjapilti saab võrrelda (.+?), kuid .*?kuju\./,'$1 võib olla nime $2 variant.'],
   [/Täpne kuju (.+?) on dokumenteeritud: see on (?:kirja pandud|registreeritud) /g,'$1 on kirja pandud '],
   [/, kuid täpne päritoluseos on veel kontrollimata\./g,'.'],
   [/võib võrrelda kujuga/g,'võib olla seotud nimega']
  ],
  drop:/^(?:See on (?:oletus|päritolu oletus|kontrollimata|üksnes|vaid|tööhüpotees)|See jääb kontrollimata|Sarnase kuju päritolu jääb|Kahe kirjapildi|Otsene seos|Vaja on |Tuleb |Seetõttu (?:seotud|päritolu|täpne)|Sarnane kõla|Sarnased kirjapildid|Sarnasus üksi|Allika (?:andmed|teavet)|.+(?:ei saa (?:automaatselt )?üle kanda|ei kanna üle|vajab (?:veel |seega )?(?:kontrollimist|kontrolli)|tuleb (?:veel )?kontrollida|ei tõesta päritolu))/i
 }
};
export function readerParagraph(paragraph,lang){
 const rule=RULES[lang]||RULES.en;
 let p=paragraph;
 for(const [pattern,replacement]of rule.replace)p=p.replace(pattern,replacement);
 return p.split(/(?<=[.!?…])\s+(?=[\p{Lu}‘“«„(])/u).filter(s=>!rule.drop.test(s)&&!EXTRA_DROP[lang]?.test(s)).join(' ').replace(/\.{2,}/g,'.').replace(/ {2,}/g,' ').trim();
}
const EXTRA_DROP={
 en:/^(?:An explicit reference|A shared name day or|This is an unverified|One secure whole-name|The full account remains provisional|This personal transmission story|This does not establish every family|This confirms use of the name but|The Norwegian Sigrid explanation alone)/,
 ru:/^(?:Это не решает|Это не устанавливает|Это остаётся непроверенной|Сведения источника|Происхождение похожей формы|Эта разница не доказывает|Полное объяснение пока остаётся рабочей|Ни латинское значение|Её нельзя объяснять|Поэтому ни один из путей|Поэтому значение золота|У производных есть общая|Из них не следует придумывать|Значения основ не нужно|Надёжна связь с названием|Оба объяснения нельзя слить)/,
 lv:/^(?:Līdzīgi rakstīti|Kopīga vārda diena|Tas neizšķir|Tas neatrisina|Tas nepierāda|Salīdzinājums .+ būtu darba|Šī atšķirība nepierāda)/,
 lt:/^(?:Tai nepatikrint|Tai lieka nepatikrinta|Šaltinio žinių|Panašios formos kilmė|Tai neišsprendžia|Bendra vardadienio|Visas aiškinimas kol kas lieka darbo|Šis skirtumas neįrodo|Todėl .+ negalima patikimai perkelti)/,
 et:/^(?:See ei lahenda|Ühine nimepäev|See erinevus ei tõesta|Täielik seletus jääb esialgseks|Ei ladina tähendus|See isiklik nimepärimus|See ei tõesta iga pere|Erinevus ei tõesta|Selle täpse kuju päritolu on siiski|Sarnane skandinaavia nimi|Ühine päev ei tõesta)/
};
