// Explicit reader-facing rewrites of unusually complex hypotheses; no new claims.
const languages=['lv','ru','en','lt','et'];
const entries={};
function add(country,name,paragraphs){entries[country+':'+name]=Object.fromEntries(languages.map((l,i)=>[l,paragraphs[i]]));}
add('lv','Nanda',[
 'Nanda varētu būt saistīts ar sanskrita vārdu nanda, «prieks», vai ar vārdu Nana. Latviešu vārda cilme nav skaidra.',
 'Nanda, возможно, связано с санскритским nanda «радость» или с именем Nana. Происхождение латышского имени точно не установлено.',
 'Nanda may be related to Sanskrit nanda, “joy”, or to the name Nana. The Latvian name’s origin is uncertain.',
 'Nanda galbūt susijęs su sanskrito nanda „džiaugsmas“ arba vardu Nana. Latviško vardo kilmė neaiški.',
 'Nanda võib olla seotud sanskriti sõnaga nanda, „rõõm“, või nimega Nana. Läti nime päritolu pole selge.'
]);
add('lv','Undis',[
 'Undis varētu būt saistīts ar Unda; latviešu vārda cilme nav skaidra. Norvēģijā Undis ir arī sieviešu vārds, kas veidots no Unn un dis un radīts 1897. gadā.',
 'Undis, возможно, связано с Unda; происхождение латышского имени точно не установлено. В Норвегии Undis — также женское имя, образованное от Unn и dis в 1897 году.',
 'Undis may be related to Unda; the Latvian name’s origin is uncertain. In Norway, Undis is also a feminine name formed from Unn and dis in 1897.',
 'Undis galbūt susijęs su Unda; latviško vardo kilmė neaiški. Norvegijoje Undis taip pat yra moteriškas vardas, sudarytas iš Unn ir dis 1897 metais.',
 'Undis võib olla seotud nimega Unda; läti nime päritolu pole selge. Norras on Undis ka naisenimi, mis loodi 1897. aastal osadest Unn ja dis.'
]);
add('lv','Vigors',[
 'Vigors varētu būt saistīts ar latīņu vigor vai vārdu Vigords. Tā cilme nav skaidra.',
 'Vigors, возможно, связано с латинским vigor или именем Vigords. Точное происхождение не установлено.',
 'Vigors may be related to Latin vigor or the name Vigords. Its origin is uncertain.',
 'Vigors galbūt susijęs su lotynų vigor arba vardu Vigords. Jo kilmė neaiški.',
 'Vigors võib olla seotud ladina sõnaga vigor või nimega Vigords. Selle päritolu pole selge.'
]);
add('lt','Gilvilė',[
 'Gilvilė varētu būt saistīts ar lietuviešu gilus, «dziļš, stiprs», un viltis, «cerība». Iespējams arī salīdzinājums ar gilti un gildyti (širdį), kas saistīti ar sāpēm sirdī. Cilme nav skaidra. Gilvilė ar īsformu Gilva ir 17. novembrī 1964. gada lietuviešu vārdu kalendārā, kas pārpublicēts 1983. gadā.',
 'Gilvilė, возможно, связано с литовскими gilus «глубокий, сильный» и viltis «надежда». Другая возможная связь — с gilti и gildyti (širdį), словами о сердечной боли. Точное происхождение не установлено. Gilvilė с краткой формой Gilva указано на 17 ноября в литовском календаре имён 1964 года, перепечатанном в 1983 году.',
 'Gilvilė may be related to Lithuanian gilus, “deep, strong”, and viltis, “hope”. Another possible connection is with gilti and gildyti (širdį), words associated with pain in the heart. Its origin is uncertain. The Lithuanian name calendar of 1964, reprinted in 1983, lists Gilvilė with the short form Gilva on 17 November.',
 'Gilvilė galbūt susijusi su gilus „gilus, stiprus“ ir viltis. Kita galima sąsaja – gilti ir gildyti (širdį), siejami su širdies skausmu. Tiksli kilmė neaiški. 1964 metų lietuvių vardų kalendoriuje, perspausdintame 1983 metais, Gilvilė su trumpiniu Gilva įrašyta lapkričio 17 dieną.',
 'Gilvilė võib olla seotud leedu sõnadega gilus, „sügav, tugev“, ja viltis, „lootus“. Teine võimalik seos on sõnadega gilti ja gildyti (širdį), mis tähistavad valu südames. Täpne päritolu pole selge. 1964. aasta leedu nimekalender, mis avaldati uuesti 1983. aastal, annab Gilvilė koos lühikujuga Gilva 17. novembril.'
]);
add('lt','Rimgaudė',[
 'Rimgaudė varētu būt saistīts ar lietuviešu rimti, «rimties», un gaudus, «skaņš, skanīgs». Daļu gaud- saista arī ar gauti, «iegūt». Vārda kopīgā nozīme nav skaidra.',
 'Rimgaudė, возможно, связано с литовскими rimti «успокаиваться» и gaudus «звучный, громкий». Часть gaud- связывают также с gauti «получать». Значение имени в целом точно не установлено.',
 'Rimgaudė may be related to Lithuanian rimti, “to become calm”, and gaudus, “resonant, loud”. The element gaud- is also linked with gauti, “to obtain”. The whole name’s meaning is uncertain.',
 'Rimgaudė galbūt susijusi su rimti, ramintis ir gaudus „skardus, skambus“. Dėmuo gaud- taip pat siejamas su gauti. Viso vardo reikšmė neaiški.',
 'Rimgaudė võib olla seotud leedu sõnadega rimti, „rahunema“, ja gaudus, „kõlav, vali“. Osa gaud- seostatakse ka sõnaga gauti, „saama“. Terviknime tähendus pole selge.'
]);
add('lt','Steigintas',[
 'Steigintas varētu būt veidots no lietuviešu stei-/steigus, «rūpīgs, centīgs», un gint-/ginti, «aizstāvēt». Tā ir viena no iespējamām cilmes versijām.',
 'Steigintas, возможно, образовано от литовских stei-/steigus «заботливый, усердный» и gint-/ginti «защищать». Это одна из возможных версий происхождения.',
 'Steigintas may contain Lithuanian stei-/steigus, “careful, zealous”, and gint-/ginti, “to defend”. Its origin is uncertain.',
 'Steigintas galbūt sudarytas iš stei-/steigus „rūpestingas, uolus“ ir gint-/ginti. Jo kilmė neaiški.',
 'Steigintas võib koosneda leedu osadest stei-/steigus, „hoolikas, innukas“, ja gint-/ginti, „kaitsma“. Selle päritolu pole selge.'
]);
add('lt','Mantvinas',[
 'Mantvinas varētu būt veidots no mantus, «atjautīgs», vai manta, «manta», un vina vai vaina, «iemesls». Vārda cilme nav skaidra. 1964. gada lietuviešu vārdu kalendārā, kas pārpublicēts 1983. gadā, Mantvinas ar īsformu Mantas dots 24. novembrī.',
 'Mantvinas, возможно, образовано от mantus «сообразительный» или manta «имущество» и vina либо vaina «причина». Точное происхождение не установлено. Литовский календарь имён 1964 года, перепечатанный в 1983 году, указывает Mantvinas с краткой формой Mantas на 24 ноября.',
 'Mantvinas may contain mantus, “clever”, or manta, “possessions”, and vina or vaina, “cause”. Its origin is uncertain. The Lithuanian name calendar of 1964, reprinted in 1983, lists Mantvinas with the short form Mantas on 24 November.',
 'Mantvinas galbūt sudarytas iš mantus „sumanus“ arba manta „turtas“ ir vina ar vaina „priežastis“. Tiksli kilmė neaiški. 1964 metų lietuvių vardų kalendoriuje, perspausdintame 1983 metais, Mantvinas su trumpiniu Mantas įrašytas lapkričio 24 dieną.',
 'Mantvinas võib koosneda osadest mantus, „nutikas“, või manta, „vara“, ning vina või vaina, „põhjus“. Täpne päritolu pole selge. 1964. aasta leedu nimekalender, mis avaldati uuesti 1983. aastal, annab Mantvinase koos lühikujuga Mantas 24. novembril.'
]);
export function readerOpening(name,country,lang){return entries[country+':'+name]?.[lang];}
