// Labelled hypotheses that supplement a short reviewed history (round 150, 16 November 2026).
// A reviewed history stays first and unchanged; the supplement is shown after it, each paragraph opening with the
// translated Hypothesis label. Basis and next verification step are kept in research/namedays/round150-notes.json.
import {supplementsR151} from './namedays-hypotheses-supplements-r151.js';
import {supplementsR152} from './namedays-hypotheses-supplements-r152.js';
import {supplementsR153} from './namedays-hypotheses-supplements-r153.js';
import {supplementsR154} from './namedays-hypotheses-supplements-r154.js';
import {supplementsR155} from './namedays-hypotheses-supplements-r155.js';
import {supplementsR156} from './namedays-hypotheses-supplements-r156.js';
import {supplementsR157} from './namedays-hypotheses-supplements-r157.js';
import {supplementsR158} from './namedays-hypotheses-supplements-r158.js';
import {supplementsR159} from './namedays-hypotheses-supplements-r159.js';
import {supplementsR160} from './namedays-hypotheses-supplements-r160.js';
import {supplementsR161} from './namedays-hypotheses-supplements-r161.js';
import {supplementsR162} from './namedays-hypotheses-supplements-r162.js';
import {supplementsR163} from './namedays-hypotheses-supplements-r163.js';
import {supplementsR164} from './namedays-hypotheses-supplements-r164.js';
import {supplementsR165} from './namedays-hypotheses-supplements-r165.js';
const L=['lv','ru','en','lt','et'];
const t=(...a)=>Object.fromEntries(L.map((l,i)=>[l,[a[i]]]));
export const historySupplements={lv:{
 Ingmārs:t(
  'Ingmārs varētu būt skandināvu vārda Ingmar forma; to parasti skaidro ar senskandināvu dieva vārdu Ing un mærr — «slavens». Šī saikne tieši latviešu formai nav dokumentēta.',
  'Ingmārs, вероятно, форма скандинавского имени Ingmar; его обычно объясняют через имя древнескандинавского бога Ing и mærr — «славный». Для латышской формы эта связь не документирована.',
  'Ingmārs is probably a form of the Scandinavian name Ingmar, usually explained from the Old Norse god’s name Ing and mærr, “famous”. This link is not documented for the Latvian form itself.',
  'Ingmārs greičiausiai yra skandinaviško vardo Ingmar forma; jis paprastai aiškinamas senovės skandinavų dievo vardu Ing ir mærr („garsus“). Latviškai formai šis ryšys nedokumentuotas.',
  'Ingmārs on tõenäoliselt skandinaavia nime Ingmar kuju; seda seletatakse tavaliselt vanapõhja jumala nimega Ing ja sõnaga mærr ‘kuulus’. Läti kuju puhul pole seda seost dokumenteeritud.')
},lt:{},ee:{}};
for(const src of [supplementsR151,supplementsR152,supplementsR153,supplementsR154,supplementsR155,supplementsR156,supplementsR157,supplementsR158,supplementsR159,supplementsR160,supplementsR161,supplementsR162,supplementsR163,supplementsR164,supplementsR165])for(const [c,map] of Object.entries(src))for(const [n,e] of Object.entries(map))historySupplements[c][n]??=e;
export function historySupplement(name,country){return historySupplements[country]?.[name.normalize('NFC')]||null;}
