// Executable editorial contract for every horoscope reading (local templates or a future model writer).
// HOROSCOPE_EDITORIAL_RULES.md explains the rules; this file enforces what can be checked mechanically.
export const areas=['love','work','energy'];
export const horoscopePolicy={id:'daily-reading-v2',itemsPerGroup:3,moods:['serious','humor'],areas,languages:['lv','ru','en','lt','et']};

// Length limits in characters, chosen so every version fits the compact widget.
// „day” is one house text, „event” one sky-event sentence, „text” both together.
export const limits={headline:[3,40],day:[80,230],event:[40,185],text:[80,400],area:[45,200],do:[20,125],avoid:[15,125],sky:[2,140]};

// A Do item must not open with a negative command. An Avoid item names a behaviour and must not
// open with a negative command or repeat its heading (Latvian „Izvairies no”, so no leading „No”).
// Negated adjectives such as „Neplānotiem tēriņiem” remain valid Avoid openings.
const E='(?![\\p{L}\\p{N}])';
const negativeOpening={
  do:{
    lv:new RegExp(`^(?:ne(?!dēļ)\\p{L}+|izvairies)${E}`,'iu'),
    ru:new RegExp(`^(?:не|нельзя|избегай|никогда)${E}`,'iu'),
    en:/^(?:do\s+not\b|don['’]t\b|never\b|avoid\b)/iu,
    lt:new RegExp(`^(?:ne(?!t${E})\\p{L}+|venk\\p{L}*)${E}`,'iu'),
    et:new RegExp(`^(?:ära|ärge|väldi|mitte)${E}`,'iu')
  },
  avoid:{
    lv:new RegExp(`^(?:izvairies|no|nedari|nedariet)${E}`,'iu'),
    ru:new RegExp(`^(?:не|нельзя|избегай|никогда)${E}`,'iu'),
    en:/^(?:do\s+not\b|don['’]t\b|never\b|avoid\b)/iu,
    lt:new RegExp(`^(?:venk\\p{L}*|nedaryk|niekada)${E}`,'iu'),
    et:new RegExp(`^(?:ära|ärge|väldi|mitte)${E}`,'iu')
  }
};
// Typography: native quotation marks and dashes only.
const typography=[
  [/"/u,'straight double quote'],
  [/(?:^|\s)-(?:\s|$)/u,'hyphen used as a dash'],
  [/\s{2,}|^\s|\s$/u,'extra whitespace'],
  [/\.\.\./u,'three dots instead of an ellipsis'],
  [/\s[,.;:!?](?!\.)/u,'space before punctuation']
];
// Direct address must not reveal the reader's gender (no masculine or feminine forms about „you”).
// Unicode word boundaries: JavaScript \b only understands ASCII letters.
const B='(?<![\\p{L}\\p{N}])';
const gendered={
  lv:new RegExp(`${B}(?:esi|esat|būsi|biji|jūties|kļuvi|kļūsti|paliksi|paliec)\\s+(?:\\p{L}+\\s+)?(?:gatav[sa]|aizmirsis|aizmirsusi|pārliecināt[sa]|nogur(?:is|usi)|priecīg[sa]|vientuļ[šai]|laimīg[sa]|vainīg[sa]|spiest[sa]|pelnījis|pelnījusi|apmierināt[sa]|aizņemt[sa]|atbildīg[sa]|droš[sa]|vīlies|vīlusies|nobijies|nobijusies|apjucis|apjukusi|izsalcis|izsalkusi|gaidījis|gaidījusi)${E}|${B}tu\\s+(?:pats|pati)${E}`,'iu'),
  ru:new RegExp(`${B}(?:ты|тебе|тебя)\\s+(?:\\p{L}+\\s+)?(?:готов[аы]?|уверен[аы]?|устал[аи]?|должен|должна|рад[аы]?|свободен|свободна|занят[аы]?|сделал[аи]?|забыл[аи]?|был[аи]?|смог(?:ла)?|успел[аи]?|один|одна|сам|сама)${E}`,'iu'),
  lt:new RegExp(`${B}(?:esi|būsi|buvai|jautiesi|tapai|pats|pati)\\s+(?:\\p{L}+\\s+)?(?:pasiruoš(?:ęs|usi)|pavarg(?:ęs|usi)|tikr(?:as|a)|laiming(?:as|a)|užsiėm(?:ęs|usi)|pamirš(?:ęs|usi)|vien(?:as|a)|kalt(?:as|a)|patenkint(?:as|a)|vienišas|vieniša)${E}`,'iu'),
  en:null,et:null
};
const normalize=text=>text.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();

export function checkText(text,{lang='en',kind='text'}={}){
  const problems=[];
  if(typeof text!=='string'||!text.length)return ['empty or not a string'];
  const [min,max]=limits[kind]||limits.text;
  if(text.length<min||text.length>max)problems.push(`length ${text.length} outside ${min}–${max}`);
  for(const [pattern,label] of typography)if(pattern.test(text))problems.push(label);
  if(gendered[lang]?.test(text))problems.push('gendered direct address');
  // Headlines and sky-panel values are labels, everything else is a sentence.
  if(kind!=='headline'&&kind!=='sky'&&!/[.!?…]["”“»]?$/u.test(text))problems.push('missing final punctuation');
  if((kind==='headline'||kind==='sky')&&/[.]$/u.test(text)&&!/\d\.$/u.test(text))problems.push('label ends with a full stop');
  if((kind==='do'||kind==='avoid')&&(negativeOpening[kind][lang]||negativeOpening[kind].en).test(text))problems.push('opens with a negation or repeats the heading');
  return problems;
}

// The same gate must be applied to any future model/provider output before caching.
export function validateReading(reading,{lang='en',mood}={}){
  const fail=message=>{throw Error(`${lang}/${mood||'?'}: ${message}`);};
  if(!reading||typeof reading!=='object')fail('reading is missing');
  if(mood&&!horoscopePolicy.moods.includes(mood))fail('unsupported mood');
  const check=(text,kind)=>{const problems=checkText(text,{lang,kind});if(problems.length)fail(`${kind} „${text}”: ${problems.join(', ')}`);};
  check(reading.headline,'headline');check(reading.text,'text');
  const seen=new Set([normalize(reading.headline),normalize(reading.text)]);
  for(const area of areas){
    const entry=reading.areas?.[area];if(!entry)fail(`area ${area} is missing`);
    check(entry.text,'area');
    if(!Number.isInteger(entry.rating)||entry.rating<1||entry.rating>5)fail(`area ${area} needs a 1–5 rating`);
    if(seen.has(normalize(entry.text)))fail('repeated text');seen.add(normalize(entry.text));
  }
  for(const [group,kind] of [['do','do'],['dont','avoid']]){
    if(!Array.isArray(reading[group])||reading[group].length!==horoscopePolicy.itemsPerGroup)fail(`${group} needs three items`);
    for(const item of reading[group]){check(item,kind);const key=normalize(item);if(seen.has(key))fail(`repeated item „${item}”`);seen.add(key);}
  }
  if(!areas.includes(reading.do_topic)||!areas.includes(reading.avoid_topic))fail('topics must be area IDs');
  return reading;
}
// Backwards-compatible name used by older callers.
export const validateAdvice=validateReading;
