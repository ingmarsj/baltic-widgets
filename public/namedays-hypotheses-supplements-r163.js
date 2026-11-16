// Round 163: labelled origin supplements for East Slavic names and for Leho (user decision, 16 November 2026).
// Shown after the reviewed history with the Hypothesis label; basis in research/namedays/round163-notes.json.
const t=(...a)=>Object.fromEntries(['lv','ru','en','lt','et'].map((l,i)=>[l,[a[i]]]));
const OLESJA=t('Olesju parasti uzskata par vārda Aleksandra (grieķu alexein + anēr — «aizsargāt + vīrs») mīlināmo formu; patstāvīgs vārds tā kļuva pēc 1898. gada stāsta «Olesja».',
 'Олесю обычно считают уменьшительной формой имени Александра (греч. alexein + anēr — «защищать + муж»); самостоятельным именем она стала после повести 1898 года «Олеся».',
 'Olesja is usually taken as a pet form of Alexandra (Greek alexein + anēr, “to defend + man”); it became a name in its own right after the 1898 story Olesya.',
 'Olesja paprastai laikoma mažybine vardo Aleksandra (graikų alexein + anēr – „ginti + vyras“) forma; savarankišku vardu ji tapo po 1898 m. apysakos „Olesia“.',
 'Olesjat peetakse tavaliselt nime Aleksandra (kreeka alexein + anēr ‘kaitsma + mees’) hellitusvormiks; iseseisvaks nimeks sai see pärast 1898. aasta jutustust „Olesja“.');
const RUSLAN=t('Ruslans cēlies no tjurku arslan — «lauva»; pie austrumslāviem vārds nonāca ar viduslaiku varoņstāstiem, bet plaši pazīstams kļuva ar 1820. gada poēmu.',
 'Руслан восходит к тюркскому arslan — «лев»; через средневековые богатырские сказания имя пришло к восточным славянам, а широко известным его сделала поэма 1820 года.',
 'Ruslan goes back to Turkic arslan, “lion”; the name reached the Eastern Slavs through medieval heroic tales and became widely known through a poem of 1820.',
 'Ruslanas kilęs iš tiurkų arslan („liūtas“); rytų slavus vardas pasiekė per viduramžių didvyrių pasakojimus, o plačiai žinomas tapo per 1820 m. poemą.',
 'Ruslan pärineb türgi sõnast arslan ‘lõvi’; idaslaavlasteni jõudis nimi keskaegsete kangelasjuttude kaudu ja laialt tuntuks sai see 1820. aasta poeemi kaudu.');
export const supplementsR163={lv:{
 Olesja:OLESJA, Oļesja:OLESJA,
 Roksolana:t('Vārds cēlies no seno sarmatu roksolānu cilts nosaukuma, kas dzīvoja stepēs uz ziemeļiem no Melnās jūras; slavenu to padarīja Roksolana (Hirema, 16. gadsimts) — sieviete no bijušās Kijivas Rusas zemēm, kas kļuva par sultāna Suleimana Lieliskā sievu.',
  'Имя восходит к названию древнего сарматского племени роксоланов из степей к северу от Чёрного моря; знаменитой его сделала Роксолана (Хюррем, XVI век) — уроженка земель бывшей Киевской Руси, ставшая женой султана Сулеймана Великолепного.',
  'The name goes back to the ancient Sarmatian Roxolani tribe of the steppes north of the Black Sea; it was made famous by Roksolana (Hürrem, 16th century), a woman from the lands of former Kyivan Rus who became the wife of Sultan Suleiman the Magnificent.',
  'Vardas kilęs iš senovės sarmatų roksolanų genties, gyvenusios stepėse į šiaurę nuo Juodosios jūros, pavadinimo; garsų jį padarė Roksolana (Hiurem, XVI a.) – moteris iš buvusios Kijevo Rusios žemių, tapusi sultono Suleimano Didingojo žmona.',
  'Nimi pärineb Musta merest põhja pool stepis elanud muistse sarmaatide roksolaanide hõimu nimest; kuulsaks tegi selle Roksolana (Hürrem, 16. sajand) – endise Kiievi Rusi aladelt pärit naine, kellest sai sultan Suleiman Toreda abikaasa.'),
 Ruslana:RUSLAN, Ruslands:RUSLAN
},lt:{},ee:{
 Leho:t('Lehola — tā igauņu literatūrā sauca seno Lõhaveres pilskalnu, vecākā Lembitu cietoksni; 13. gadsimta hronikā tas saukts par Leole.',
  'Лехола — так в эстонской литературе называли древнее городище Лыхавере, крепость старейшины Лембиту; в хронике XIII века оно названо Leole.',
  'Lehola is the name Estonian literature gave to the ancient hillfort of Lõhavere, the stronghold of the elder Lembitu; a 13th-century chronicle calls it Leole.',
  'Lehola – taip estų literatūroje vadintas senovinis Lõhaverės piliakalnis, seniūno Lembitu tvirtovė; XIII a. kronikoje jis vadinamas Leole.',
  'Lehola – nii nimetati eesti kirjanduses muistset Lõhavere linnamäge, vanem Lembitu kindlust; 13. sajandi kroonikas on see Leole.')
}};
