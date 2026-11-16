// Reviewed histories from round 132: hypotheses answered by the Senn–Salys proper-name list
// (Wörterbuch der litauischen Schriftsprache vol. 5, reprinted in Salys 1983), checked on the page images.
// Source URLs are provenance metadata only.
const SAL='https://tautosmenta.lt/wp-content/uploads/lituanistika/Salys_1983_LT.pdf';
const short=(n,a,b)=>({sources:[SAL],text:{lv:[`${n} ir vārdu ${a} un ${b} saīsinājums.`],ru:[`${n} — сокращение имён ${a} и ${b}.`],en:[`${n} is a short form of ${a} and ${b}.`],lt:[`${n} – vardų ${a} ir ${b} trumpinys.`],et:[`${n} on nimede ${a} ja ${b} lühend.`]}});
const form=(n,b)=>({sources:[SAL],text:{lv:[`${n} ir vārda ${b} lietuviešu forma.`],ru:[`${n} — литовская форма имени ${b}.`],en:[`${n} is the Lithuanian form of ${b}.`],lt:[`${n} – lietuviška vardo ${b} forma.`],et:[`${n} on nime ${b} leedu kuju.`]}});
export const historiesCalendarR132={lv:{},ee:{},lt:{
 Adas:short('Adas','Adolfas','Adomas'),
 Nina:short('Nina','Antanina','Saturnina'),
 Fortunatas:form('Fortunatas','Fortunatus'),
 Odilija:form('Odilija','Odilie (Odilia)'),
 Otilija:form('Otilija','Ottilie (Otilia)')
}};
