// Latvian horoscope copy. Written natively; read HOROSCOPE_EDITORIAL_RULES.md before editing.
// Address the reader as „tu” and never let a participle or adjective reveal the reader's gender.
const signs={
  nom:['Auns','Vērsis','Dvīņi','Vēzis','Lauva','Jaunava','Svari','Skorpions','Strēlnieks','Mežāzis','Ūdensvīrs','Zivis'],
  // „Mēness Vērsī”, „pāriet Vērsī”.
  loc:['Aunā','Vērsī','Dvīņos','Vēzī','Lauvā','Jaunavā','Svaros','Skorpionā','Strēlniekā','Mežāzī','Ūdensvīrā','Zivīs']
};
const bodies={Sun:'Saule',Moon:'Mēness',Mercury:'Merkurs',Venus:'Venera',Mars:'Marss',Jupiter:'Jupiters',Saturn:'Saturns'};
const monthsLoc=['janvārī','februārī','martā','aprīlī','maijā','jūnijā','jūlijā','augustā','septembrī','oktobrī','novembrī','decembrī'];
const monthsDat=['janvārim','februārim','martam','aprīlim','maijam','jūnijam','jūlijam','augustam','septembrim','oktobrim','novembrim','decembrim'];
const clock=hhmm=>{const [h,m]=hhmm.split(':');return `${Number(h)}.${m}`;};
const time=hhmm=>`plkst. ${clock(hhmm)}`;
const day=iso=>Number(iso.slice(8,10)),month=iso=>Number(iso.slice(5,7))-1;
const on=iso=>`${day(iso)}. ${monthsLoc[month(iso)]}`;
const until=iso=>`līdz ${day(iso)}. ${monthsDat[month(iso)]}`;
const ordinal=n=>`${n}.`;

export default {
  lang:'lv',
  signs,bodies,
  // Short names of the twelve whole-sign houses, used in the sky panel.
  houseNames:['tu un tavs noskaņojums','nauda un vērtības','sarunas un ziņas','mājas un ģimene','prieks un mīlestība','ikdiena un veselība','attiecības un partneri','tuvība un kopīgā nauda','ceļojumi un mācības','karjera un mērķi','draugi un nākotne','atpūta un iekšējā pasaule'],
  sky:{
    labels:{moon:'Mēness',phase:'Fāze',sun:'Saule',next_full:'Nākamais pilnmēness',next_new:'Nākamais jaunais mēness',planets:'Planētas',sign:'Tava zīme',theme:'Dienas tēma'},
    phases:{new_moon:'Jauns mēness',first_quarter:'Pirmais ceturksnis',full_moon:'Pilnmēness',last_quarter:'Pēdējais ceturksnis',waxing:'Augošs mēness',waning:'Dilstošs mēness'},
    elements:{fire:'Uguns zīme',earth:'Zemes zīme',air:'Gaisa zīme',water:'Ūdens zīme'},
    // Header chip, e.g. „Mēness Aunā · no 12.10 Vērsī”.
    chip:segments=>[`${bodies.Moon} ${signs.loc[segments[0].sign]}`,...segments.slice(1).map(s=>`no ${clock(s.from)} ${signs.loc[s.sign]}`)].join(' · '),
    moon:(segments,next)=>segments.length===1
      ?`Visu dienu ${signs.loc[segments[0].sign]} (${until(next.date)} ${time(next.time)})`
      :segments.map((s,i)=>i===segments.length-1?`pēc tam ${signs.loc[s.sign]}`:`${signs.loc[s.sign]} līdz ${time(s.until)}`).join(', ').replace(/^./,c=>c.toUpperCase()),
    phase:(id,illumination,event)=>event
      ?`${({new_moon:'Jauns mēness',first_quarter:'Pirmais ceturksnis',full_moon:'Pilnmēness',last_quarter:'Pēdējais ceturksnis'})[event.id]} ${time(event.time)} ${signs.loc[event.sign]}`
      :`${id==='waxing'?'Augošs':'Dilstošs'} mēness, apgaismojums ${illumination} %`,
    event:e=>`${on(e.date)} ${time(e.time)} ${signs.loc[e.sign]}`,
    sun:(sign,ingress,next)=>ingress
      ?`${signs.loc[ingress.from]} līdz ${time(ingress.time)}, pēc tam ${signs.loc[ingress.to]}`
      :`${signs.loc[sign]} ${until(next.date)}`,
    planet:p=>{
      let text=p.ingress?`${signs.loc[p.ingress.from]} līdz ${time(p.ingress.time)}, pēc tam ${signs.loc[p.ingress.to]}`:signs.loc[p.sign];
      if(p.station)text+=p.station.turns==='retrograde'?`; ${time(p.station.time)} sāk atpakaļgaitu`:`; ${time(p.station.time)} beidz atpakaļgaitu`;
      else if(p.retrograde)text+=', atpakaļgaitā';
      return text;
    },
    sign:(element,ruler,rulerSign)=>`${element}, valdošā planēta – ${bodies[ruler]} (tagad ${signs.loc[rulerSign]})`,
    theme:(house,name)=>`${name.replace(/^./,c=>c.toUpperCase())} – Mēness tavā ${ordinal(house)} mājā`
  },
  serious:{
    // One sentence about an exact sky event; the house text follows it.
    events:{
      sunOwn:e=>`No ${time(e.time)} Saule ir tavā zīmē – sākas tavs mēnesis, un nākamajās četrās nedēļās enerģijas var būt vairāk nekā parasti.`,
      sunIngress:e=>`${time(e.time).replace(/^./,c=>c.toUpperCase())} Saule pāriet ${signs.loc[e.to]} – sākas jauns astroloģiskais mēnesis.`,
      fullMoon:e=>e.own
        ?`${time(e.time).replace(/^./,c=>c.toUpperCase())} tavā zīmē iestājas pilnmēness: emocijas var būt spilgtākas, un tas ir labs brīdis kaut ko pabeigt, nevis sākt.`
        :`${time(e.time).replace(/^./,c=>c.toUpperCase())} ir pilnmēness ${signs.loc[e.sign]}, tāpēc jūtas šodien var skanēt skaļāk nekā parasti.`,
      newMoon:e=>e.own
        ?`${time(e.time).replace(/^./,c=>c.toUpperCase())} tavā zīmē iestājas jauns mēness – labs brīdis iecerei, kas attiecas tieši uz tevi.`
        :`${time(e.time).replace(/^./,c=>c.toUpperCase())} ir jauns mēness ${signs.loc[e.sign]}: laiks iecerēm, nevis skaļiem lēmumiem.`,
      station:e=>({
        Mercury:{retrograde:'Merkurs sāk atpakaļgaitu: nākamajās nedēļās vērts divreiz pārbaudīt ziņas, līgumus un ceļojumu plānus.',direct:'Merkurs beidz atpakaļgaitu, un aizķērušās sarunas un plāni pamazām sāk kustēties.'},
        Venus:{retrograde:'Venera sāk atpakaļgaitu: veci jautājumi par jūtām un naudu var atgriezties, lai tos beidzot atrisinātu.',direct:'Venera beidz atpakaļgaitu, un lēmumi par jūtām un pirkumiem kļūst skaidrāki.'},
        Mars:{retrograde:'Marss sāk atpakaļgaitu: spēku labāk veltīt iesāktā pabeigšanai, nevis jaunām cīņām.',direct:'Marss beidz atpakaļgaitu, un iestrēgušie darbi atkal sāk virzīties uz priekšu.'}
      })[e.body][e.turns].replace(/^/,`${time(e.time).replace(/^./,c=>c.toUpperCase())} `),
      moonChange:e=>`Līdz ${time(e.time)} Mēness vēl ir ${signs.loc[e.from]}, pēc tam – ${signs.loc[e.to]}.`
    },
    headlines:{sunOwn:'Sākas tavs mēnesis',fullMoonOwn:'Pilnmēness tavā zīmē',newMoonOwn:'Jauns sākums tavā zīmē'},
    // Twelve whole-sign houses of the day's main Moon sign, counted from the reader's sign.
    // Each list has three entries; entry n of every list is used on the same day.
    houses:[
      { // 1: the Moon in the reader's sign
        headline:['Tava diena','Spēks ir tavā pusē','Sāc ar sevi'],
        day:[
          'Mēness šodien ir tavā zīmē: jūtas ir tuvāk virspusei, un spēka pietiek savām iecerēm. Labs brīdis darīt to, ko gribi tu, nevis tikai citi.',
          'Noskaņojums šodien ātri pārvēršas darbos. Izmanto to, lai sāktu kaut ko sev svarīgu, pat ja sākums ir pavisam mazs.',
          'Tavas vajadzības skan skaļāk nekā parasti, un tas nav egoisms. Ieklausies sevī, pirms piekrīti visu citu plāniem.'
        ],
        love:[
          {text:'Tavs šarms šodien ir pamanāms, un cilvēki atsaucas vieglāk. Ja gribi kādu uzrunāt vai uzaicināt, nav jāgaida ideāls brīdis.',do:'Sper pirmo soli: uzaicini, uzraksti vai piezvani.',avoid:'Flirta ar visiem pēc kārtas, ja sirdī ir viens konkrēts cilvēks.'},
          {text:'Pateikt, ko jūti, šodien ir vieglāk, un otrs to var sadzirdēt skaidrāk nekā parasti. Runā par sevi, nevis par to, ko otrs dara nepareizi.',do:'Pasaki, ko tev vajag, vienā skaidrā teikumā.',avoid:'Pārmetumiem, kas sākas ar „tu vienmēr”.'},
          {text:'Sīkumi var aizskart vairāk nekā parasti. Ne katra īsa atbilde nozīmē, ka kaut kas nav kārtībā.',do:'Pirms izdari secinājumus, pajautā, kā otram patiesībā iet.',avoid:'Asām atbildēm, kas dzimst no noguruma.'}
        ],
        work:[
          {text:'Iniciatīva šodien nāk tev par labu. Ideju, kas sen gaida savu brīdi, vērts pateikt skaļi.',do:'Piedāvā savu risinājumu, pirms kāds cits to izdara.',avoid:'Plāniem, kuriem trūkst pirmā konkrētā soļa.'},
          {text:'Visvieglāk veicas uzdevumos, kuros vari rīkoties pēc saviem ieskatiem. Kopīgā projektā paņem sev daļu, ko vadi tu.',do:'Pieņem vienu lēmumu, ko sen atliec, un paziņo to citiem.',avoid:'Atļaujas gaidīšanas tur, kur tā nemaz nav vajadzīga.'},
          {text:'Noskaņojums šodien var ietekmēt lēmumus vairāk nekā skaitļi. Svarīgu pirkumu vai līgumu vērts izvērtēt vēlreiz, kad emocijas norimst.',do:'Pārrēķini pirkuma cenu sava darba stundās.',avoid:'Pirkumiem, kuru vienīgais mērķis ir uzlabot garastāvokli.'}
        ],
        energy:[
          {text:'Spēka ir vairāk nekā parasti, un ķermenis prasa kustību. Pat īsa pastaiga var palīdzēt domām nostāties vietā.',do:'Atrodi pusstundu kustībai svaigā gaisā.',avoid:'Dienas, kas paiet tikai pie ekrāna.'},
          {text:'Tavs noskaņojums šodien ietekmē arī apkārtējos, tāpēc parūpējies par to jau no rīta. Mierīgs dienas sākums atmaksāsies.',do:'Sāc dienu ar kaut ko, kas sagādā prieku.',avoid:'Ziņu lentes ritināšanas jau gultā.'},
          {text:'Iekšējā balss šodien labi zina, kas tev nāk par labu un kas ne. Uzticies tai, plānojot vakaru.',do:'Atvēli vakarā stundu tikai sev.',avoid:'Pienākumiem, kurus uzņemies tikai aiz pieklājības.'}
        ]
      },
      { // 2: money, values, comfort
        headline:['Laiks sakārtot naudu','Kas tev ir vērtīgs','Stabils pamats'],
        day:[
          'Uzmanības centrā šodien ir nauda un tas, ko tu vērtē. Labs brīdis pārskatīt tēriņus un saprast, kur nauda aiziet nemanot.',
          'Vairāk nekā parasti gribas stabilitātes un komforta. Tas nav slinkums, bet vajadzība justies droši, un to var panākt ar nelieliem soļiem.',
          'Diena liek padomāt, ko tu patiesi vērtē – gan naudā, gan laikā. Izvēlēties to, kas saskan ar tavām vērtībām, šodien ir vieglāk.'
        ],
        love:[
          {text:'Jūtas šodien vieglāk parādīt darbos nekā vārdos. Neliela uzmanības zīme pateiks vairāk par garu sarunu.',do:'Sagādā otram nelielu, praktisku prieku.',avoid:'Dārgiem žestiem, kurus vēlāk nāksies nožēlot.'},
          {text:'Skaidrāk nekā parasti jūti, kas tev attiecībās dod drošības sajūtu. Ja kaut kā trūkst, par to var runāt mierīgi un konkrēti.',do:'Pastāsti otram, kas tev palīdz justies droši.',avoid:'Mīlestības mērīšanas dāvanu cenās.'},
          {text:'Kopīgi naudas jautājumi šodien var ietekmēt noskaņojumu vairāk, nekā gribētos. Labāk tos noskaidrot dienā, nevis vēlu vakarā.',do:'Vienojieties par kopīgajiem tēriņiem, pirms tie kļūst par strīdu.',avoid:'Slepeniem pirkumiem, par kuriem otrs uzzina no konta izraksta.'}
        ],
        work:[
          {text:'Skaitļi šodien ir tavā pusē: veicas ar darbiem, kuru rezultātu var saskaitīt. Pārskati rēķinus, cenas vai ienākumus un pamani, kur ir rezerve.',do:'Salīdzini šī un iepriekšējā mēneša tēriņus.',avoid:'Rēķiniem, kas atlikti „uz vēlāk” līdz pēdējai dienai.'},
          {text:'Ja sen domā par algas vai cenas pārrunām, šodien argumenti var skanēt pārliecinošāk. Sagatavo skaitļus, nevis tikai sajūtas.',do:'Sagatavo trīs argumentus, kāpēc tavs darbs ir vērts vairāk.',avoid:'Darba bez iepriekš nosauktas cenas.'},
          {text:'Komforts šodien kārdina arī veikalā. Pirms pirkuma pajautā sev, cik bieži šo lietu tiešām lietosi.',do:'Pirms lielāka pirkuma salīdzini vismaz divas cenas.',avoid:'Pirkumiem tikai tāpēc, ka ir atlaide.'}
        ],
        energy:[
          {text:'Ķermenis šodien prasa komfortu: siltu ēdienu, ērtu apģērbu un mierīgu tempu. Dod to, un spēks var atgriezties ātrāk.',do:'Pagatavo sev kaut ko siltu un garšīgu.',avoid:'Ēšanas stāvus un steigā.'},
          {text:'Īpaši patīk tas, ko var sajust: smaržas, garšas, pieskārieni. Mazs prieks maņām var uzlabot visu dienu.',do:'Uzvāri tēju ar smaržu, kas tev patīk, un izdzer to lēnām.',avoid:'Visu mazo prieku atlikšanas uz nedēļas nogali.'},
          {text:'Stabilitāte šodien dod vairāk spēka nekā jaunumi. Ierasts ritms un laicīga gulētiešana palīdzēs justies labāk.',do:'Ej gulēt laikus – vismaz šovakar.',avoid:'Dienas plāna, kurā nav vietas pat pusdienām.'}
        ]
      },
      { // 3: conversations, messages, short trips, learning
        headline:['Vārdiem šodien ir spēks','Laiks sarunām','Ziņas un idejas'],
        day:[
          'Sarunas, ziņas un īsi braucieni šodien ir priekšplānā. Laba diena, lai noskaidrotu neskaidro un atbildētu uz vēstulēm, kas sen gaida.',
          'Galva šodien ir pilna ideju, un tās gribas izstāstīt. Pieraksti labākās, pirms nākamā saruna tās aizslauka.',
          'Vērts uzzināt ko jaunu – no grāmatas, kolēģa vai kaimiņa stāsta. Ziņkārība šodien var atvērt vairāk durvju nekā plāns.'
        ],
        love:[
          {text:'Viegla saruna var pateikt vairāk nekā nopietna. Joks vai negaidīta ziņa atgādinās otram, ka par viņu domā.',do:'Nosūti ziņu, kurā nav neviena jautājuma par sadzīvi.',avoid:'Svarīgu jautājumu kārtošanas tikai īsziņās.'},
          {text:'Uzrunāt kādu, kas tev sen patīk, šodien ir vieglāk. Sāc ar kopīgu tēmu – vārdi atradīsies paši.',do:'Uzdod otram jautājumu, uz kuru atbilde tevi patiešām interesē.',avoid:'Pārāk gara monologa par savu dienu.'},
          {text:'Starp jums var būt palicis kaut kas nepateikts. Šodien to vieglāk izrunāt mierīgi, bez liekas dramatikas.',do:'Pasaki to, ko sen gribēji pateikt, vienkāršiem vārdiem.',avoid:'Mājieniem tur, kur vajag skaidru teikumu.'}
        ],
        work:[
          {text:'Sarakste, zvani un pārrunas šodien rit raitāk. Labs brīdis noskaidrot to, kas sen iestrēdzis.',do:'Atbildi uz vēstuli, kas gaida visilgāk.',avoid:'Vēstulēm, kas uzrakstītas, līdz galam neizlasot jautājumu.'},
          {text:'Jaunas prasmes apgūstamas vieglāk nekā parasti. Pat stunda kursos vai labs raksts var atmaksāties jau nākamnedēļ.',do:'Veltī stundu kaut kam, kas uzlabos tavu darbu.',avoid:'Kursiem, kas nopirkti, bet nekad netiek atvērti.'},
          {text:'Idejas plūst ātri, bet ne visas ir gatavas. Izvēlies vienu un pārbaudi, vai to var īstenot.',do:'Izstāsti savu ideju kādam, kam uzticies, un vēro reakciju.',avoid:'Solījumiem, kas doti tikai sajūsmas brīdī.'}
        ],
        energy:[
          {text:'Prāts strādā ātrāk nekā parasti, tāpēc ķermenim vajag kustību, kas to līdzsvaro.',do:'Nokārto vienu darīšanu kājām vai ar velosipēdu.',avoid:'Ziņu un tērzēšanas plūsmas, kas neļauj atvilkt elpu.'},
          {text:'Informācijas ir daudz, un galva var nogurt ātrāk nekā ķermenis. Klusuma brīdis starp sarunām palīdzēs.',do:'Ieplāno pusstundu bez telefona un ziņām.',avoid:'Vairākām sarunām vienlaikus.'},
          {text:'Labs garastāvoklis rodas no sīkumiem: jaunas grāmatas, interesanta raidījuma vai sarunas ar kaimiņu.',do:'Izlasi vai noklausies kaut ko tikai prieka pēc.',avoid:'Virsrakstu lasīšanas, kas sabojā garastāvokli.'}
        ]
      },
      { // 4: home, family, roots
        headline:['Mājas kā patvērums','Ģimenes diena','Atpakaļ pie saknēm'],
        day:[
          'Mēness šodien aicina uz mājām – gan burtiski, gan sajūtās. Labākais, ko vari sev dot, ir mierīgs vakars savējo lokā.',
          'Tavs stūrītis prasa uzmanību: to var sakārtot, uzlabot vai vienkārši padarīt mājīgāku. Mazas pārmaiņas mājās var uzlabot arī noskaņojumu.',
          'Diena atgādina par ģimeni un saknēm. Piezvani vecākiem vai kādam, ar ko kopā audzi – saruna var dot vairāk, nekā gaidi.'
        ],
        love:[
          {text:'Tuvums vislabāk parādās mājas sīkumos: kopīgās vakariņās, tējā vai sarunā virtuvē. Lieli vārdi var pagaidīt.',do:'Uzaicini kādu tuvu cilvēku uz vakariņām pie sevis.',avoid:'Vakara, kurā katrs sēž pie sava ekrāna.'},
          {text:'Ģimenes jautājumi šodien var ietekmēt arī attiecības. Ja kaut kas sakrājies, runājiet par to divatā, ne visu radu klātbūtnē.',do:'Pajautā tuviniekiem, kā viņiem klājas, un ieklausies atbildē.',avoid:'Vecu ģimenes stāstu izmantošanas par argumentu strīdā.'},
          {text:'Siltums un drošība ir svarīgāki nekā parasti. Ja to pietrūkst, nevajag gaidīt, kad kāds to uzminēs.',do:'Pasaki otram, kas tev rada mājas sajūtu.',avoid:'Aizvainojuma glabāšanas klusumā.'}
        ],
        work:[
          {text:'Mājas lietas šodien var šķist svarīgākas par darbu, un tas ir normāli. Paveic obligāto, un vakaru atstāj sev.',do:'Paveic svarīgāko līdz pēcpusdienai un pabeidz laikus.',avoid:'Lielu darba lēmumu pieņemšanas, kamēr domas ir mājās.'},
          {text:'Mājokļa lietas šodien kārtojas raitāk – remonts, īre vai sadzīves sīkumi. Labs brīdis tikt galā ar to, kas sen gaida.',do:'Salabo vai piesaki labošanai vienu lietu, kas mājās sen čīkst.',avoid:'Lieliem pirkumiem mājai bez skaidra budžeta.'},
          {text:'Ģimenes vajadzības šodien var ietekmēt darba plānus. Vienojies par skaidru robežu, kad darbs beidzas.',do:'Nosaki stundu, pēc kuras darba ziņas vairs neatver.',avoid:'Solījumiem ģimenei, kurus darba dēļ nevarēsi izpildīt.'}
        ],
        energy:[
          {text:'Mājas šodien ir labākā vieta, kur atgūt spēkus. Silts ēdiens un agrs vakars var palīdzēt vairāk nekā jebkurš plāns.',do:'Pavadi vakaru mājās bez plāniem un viesiem.',avoid:'Vēlām ziņām un trokšņainiem raidījumiem pirms miega.'},
          {text:'Sakārtota telpa šodien var palīdzēt sakārtot arī domas. Pietiks ar vienu atvilktni vai plauktu – viss dzīvoklis nav jāpārkārto.',do:'Sakārto vienu vietu mājās, kas sen kaitina.',avoid:'Ģenerāltīrīšanas, kas izsmels visus spēkus.'},
          {text:'Jūtas šodien var būt trauslākas, īpaši sarunās ar tuviniekiem. Izturies pret sevi tikpat saudzīgi kā pret labu draugu.',do:'Pēc grūtas sarunas atvēli sev klusu pusstundu.',avoid:'Vecu ģimenes aizvainojumu cilāšanas.'}
        ]
      },
      { // 5: joy, romance, creativity
        headline:['Diena priekam','Sirds saka „jā”','Laiks spēlei'],
        day:[
          'Prieks, romantika un radošums šodien ir dienas galvenie varoņi. Atļaujies kaut ko tikai tāpēc, ka tas patīk.',
          'Flirtēt, smieties un radīt ir vieglāk nekā parasti. Ja kāds hobijs sen gaida, tagad tam ir vieta.',
          'Dzīvi gribas izbaudīt, nevis plānot. Neliels piedzīvojums – jauna vieta, koncerts vai spontāna pastaiga – var iedot spēku visai nedēļai.'
        ],
        love:[
          {text:'Romantikai šodien ir zaļā gaisma. Flirts, komplimenti un spontāni plāni padodas vieglāk nekā parasti.',do:'Uzaicini kādu uz randiņu vai pārsteidz otru ar spontānu plānu.',avoid:'Pārāk rūpīgas plānošanas, kas nomāc spontānumu.'},
          {text:'Rotaļīgums šodien tuvina vairāk nekā nopietnība. Kopīgi smiekli var pateikt to, ko gara saruna neprot.',do:'Izdomā kopīgu nodarbi, kas jums vēl ir jauna.',avoid:'Sarunām par pagātnes kļūdām tieši šajā vakarā.'},
          {text:'Ja sirds ir brīva, šodien vari pamanīt kādu, kas sen ir tuvumā. Pārim vērts atcerēties, ar ko viss sākās.',do:'Dari kaut ko tikai prieka pēc kopā ar cilvēku, kas tev patīk.',avoid:'Salīdzināšanas ar citu pāru bildēm sociālajos tīklos.'}
        ],
        work:[
          {text:'Rutīna var šķist garlaicīgāka nekā parasti. Ja vari, ieliec darbā nedaudz radošuma – tas palīdzēs noturēt uzmanību.',do:'Pievieno ikdienas uzdevumam savu ideju vai noformējumu.',avoid:'Lēmumiem, kas pieņemti tikai iedvesmas vilnī.'},
          {text:'Radošs darbs, prezentācijas un viss, kur vajag šarmu, šodien padodas vislabāk. Tehniskās detaļas labāk pārbaudīt rīt.',do:'Pasniedz savu ideju ar stāstu, ne tikai ar skaitļiem.',avoid:'Rēķinu un tabulu pārbaudes steigā starp tikšanām.'},
          {text:'Riskēt ar naudu prieka dēļ kārdina vairāk nekā parasti. Izklaide ir laba, ja tai ir iepriekš noteikts budžets.',do:'Izvēlies izklaidi, kurā prieks ir lielāks par cenu.',avoid:'Azartspēlēm un pirkumiem „uz labu laimi”.'}
        ],
        energy:[
          {text:'Spēku šodien vislabāk atjauno prieks. Dejas, sports vai spēles ar draugiem var dot vairāk nekā dīvāns.',do:'Izvēlies kustību, kas tev patiešām patīk, nevis to, kas jādara.',avoid:'Salīdzināšanas ar citu sporta rezultātiem.'},
          {text:'Radošums šodien ir labākais veids, kā atpūsties. Zīmē, gatavo, spēlē mūziku – rezultāts nav svarīgs.',do:'Atvēli stundu hobijam, kuru sen atliec.',avoid:'Prasības, lai hobijs uzreiz izdotos perfekti.'},
          {text:'Prieks šodien ir lipīgs. Pavadi laiku ar cilvēkiem, kuri tevi uzlādē, īpaši ar tiem, kuriem patīk smieties.',do:'Satiec kādu, ar kuru vienmēr ir jautri.',avoid:'Sabiedrības, kas paņem vairāk spēka, nekā dod.'}
        ]
      },
      { // 6: routine, tasks, health habits
        headline:['Kārtība dod spēku','Darbīga diena','Mazie soļi'],
        day:[
          'Ikdienas darbi un ieradumi šodien prasa uzmanību. Labs brīdis sakārtot to, kas sen krājas, un pabeigt iesākto.',
          'Vislabāk strādā sistēma: saraksts, skaidra secība un pauzes starp darbiem. Mazi soļi šodien aizvedīs tālāk nekā lieli plāni.',
          'Par sevi vērts parūpēties ne tikai brīvdienās. Ūdens, kustība un laicīgs miegs ir vienkārši, bet iedarbīgi, un šodien tie palīdz īpaši labi.'
        ],
        love:[
          {text:'Rūpes runā skaļāk par lieliem vārdiem. Palīdzība ikdienas darbos var pateikt vairāk nekā ziedi.',do:'Paveic kādu mājas darbu, ko otrs nemīl darīt.',avoid:'Strīdiem par to, kam šodien jāmazgā trauki.'},
          {text:'Praktiskums attiecībās šodien noder vairāk nekā romantika. Kopīgs plāns nedēļai var novērst vairākus strīdus.',do:'Sadaliet nedēļas darbus, atstājot vienu vakaru brīvu.',avoid:'Kritikas par sīkumiem, kas nav tik svarīgi.'},
          {text:'Darba ir daudz, bet attiecībām pietiek ar mazumiņu. Atrodi mirkli, lai pajautātu otram, kā iet.',do:'Nosūti tuvajam cilvēkam ziņu dienas vidū – tāpat vien.',avoid:'Darba noguruma izgāšanas uz tuvākajiem.'}
        ],
        work:[
          {text:'Ražīga diena: uzdevumi, kas citreiz velkas, šodien var padoties ātrāk. Izmanto šo vilni, kamēr tas ir.',do:'Sāc ar uzdevumu, kuru visilgāk atliec.',avoid:'Desmit darbiem vienlaikus bez neviena pabeigta.'},
          {text:'Kārtība darba vietā šodien atmaksājas. Skaidra mape vai saraksts var ietaupīt stundas nākamnedēļ.',do:'Sakārto darba galdu vai mapes, kurās vairs nevar neko atrast.',avoid:'Perfekcionisma detaļās, kuras neviens nepamanīs.'},
          {text:'Kolēģiem šodien var vajadzēt tavu palīdzību, un tā tiks novērtēta. Tikai sargā arī savu laiku.',do:'Iedod kolēģim padomu un norunā, līdz cikiem tev ir laiks.',avoid:'Citu darbu uzņemšanās tikai tāpēc, ka nevari atteikt.'}
        ],
        energy:[
          {text:'Regulāra ēšana, ūdens un kustība šodien dod vairāk enerģijas nekā kafija. Ķermenis pateicīgi atsaucas uz vienkāršiem ieradumiem.',do:'Izdzer glāzi ūdens pirms katras kafijas krūzes.',avoid:'Ēdienreižu izlaišanas darba dēļ.'},
          {text:'Ķermeņa signālos šodien vērts ieklausīties. Ja kāda sīka kaite neatkāpjas jau ilgi, tas ir iemesls rīkoties.',do:'Pieraksties uz sen atlikto vizīti pie ārsta vai zobārsta.',avoid:'Sāpju ignorēšanas cerībā, ka tās pāries pašas.'},
          {text:'Uzdevumi šodien var aizraut tik ļoti, ka aizmirstas par pauzēm. Spēki vakaram paliks tikai tad, ja dienā būs brīži elpai.',do:'Ik pēc stundas piecelies un izstaipies.',avoid:'Pusdienām pie datora.'}
        ]
      },
      { // 7: partner, agreements, cooperation
        headline:['Divatā vieglāk','Attiecību diena','Laiks vienoties'],
        day:[
          'Attiecībām un sadarbībai šī ir laba diena. Tas, ko dari kopā ar citiem, šodien var izdoties labāk nekā vienatnē.',
          'Īpaši svarīgs šodien ir otrs cilvēks – partneris, draugs vai kolēģis. Ieklausies, un vienoties būs vieglāk.',
          'Vienošanās un kompromisi šodien nāk vieglāk. Ja kaut kas sen palicis neizrunāts, to var atrisināt bez strīda.'
        ],
        love:[
          {text:'Saprast otru un sajust, ka arī tevi saprot, šodien ir vieglāk. Sarunai divatā vērts atrast laiku.',do:'Atvēli vakarā stundu tikai jums.',avoid:'Lēmumu pieņemšanas otra vietā.'},
          {text:'Ja vēl meklē savu cilvēku, šodien vieglāk iepazīties, īpaši ar kopīgu paziņu palīdzību. Pārim kopīgs plāns var palīdzēt satuvināties.',do:'Piekrīti uzaicinājumam, pat ja sākumā negribas.',avoid:'Otra salīdzināšanas ar bijušajiem.'},
          {text:'Līdzsvars starp došanu un ņemšanu šodien ir īpaši svarīgs. Ja pēdējā laikā viena puse dod vairāk, par to vērts mierīgi parunāt.',do:'Pasaki paldies par kaut ko, ko otrs dara katru dienu.',avoid:'Klusas punktu skaitīšanas, kurš vairāk dara.'}
        ],
        work:[
          {text:'Sadarbība šodien var dot vairāk nekā darbs vienatnē. Ja vajag palīdzību vai partneri projektam, tagad ir laiks prasīt.',do:'Lūdz palīdzību uzdevumā, kas vienatnē velkas pārāk ilgi.',avoid:'Kopdarba bez skaidri sadalītiem pienākumiem.'},
          {text:'Līgumi un vienošanās šodien veidojas raitāk. Pirms parakstīšanas pārliecinies, ka abas puses tos saprot vienādi.',do:'Pēc sarunas nosūti otrai pusei īsu kopsavilkumu.',avoid:'Piekāpšanās tikai tāpēc, lai ātrāk tiktu pie paraksta.'},
          {text:'Pārrunās uzvar tas, kurš prot ieklausīties. Mierīgs tonis var izrādīties spēcīgāks par skaļu.',do:'Ļauj otram izteikties līdz galam, tad piedāvā savu variantu.',avoid:'Ultimātiem tur, kur iespējams kompromiss.'}
        ],
        energy:[
          {text:'Daudz enerģijas šodien aiziet citiem, tāpēc parūpējies arī par sevi. Tavs miers ir tikpat svarīgs kā citu vajadzības.',do:'Atstāj vakarā vismaz stundu, kurā nevienam neko neesi parādā.',avoid:'Visu citu problēmu risināšanas uz sava miera rēķina.'},
          {text:'Kopīga kustība šodien var sagādāt vairāk prieka nekā treniņš vienatnē. Pastaiga divatā vai spēle ar draugiem uzlādē.',do:'Uzaicini kādu uz pastaigu vai kopīgu treniņu.',avoid:'Treniņa, ko atkal pārcel uz rītdienu.'},
          {text:'Citu noskaņojums var pielipt vieglāk nekā parasti. Līdzjūti, bet neņem svešu smagumu sev līdzi mājās.',do:'Pēc smagas sarunas izej ārā un pārslēdzies.',avoid:'Citu drāmu pārstāstīšanas vēl visu vakaru.'}
        ]
      },
      { // 8: intimacy, trust, shared money, letting go
        headline:['Dziļāk nekā parasti','Laiks uzticēties','Atlaist veco'],
        day:[
          'Mēness šodien ved dziļumā: jūtas ir intensīvākas, un virspusējas sarunas neapmierina. Labs brīdis godīgai sarunai ar kādu, kam uzticies.',
          'Kopīgā nauda, parādi un saistības prasa skaidrību. Kad tās ir sakārtotas, mierīgāk kļūst arī citur.',
          'Labs brīdis atlaist to, kas vairs nenāk par labu – vecu aizvainojumu, nevajadzīgu lietu vai ieradumu. Brīvā vieta var piepildīties ar ko labāku.'
        ],
        love:[
          {text:'Tuvība šodien prasa uzticēšanos. Pastāsti kaut ko, ko parasti patur pie sevis, un ļauj otram darīt to pašu.',do:'Atrodi laiku sarunai, kurā nav jāsteidzas.',avoid:'Slepenas otra telefona pārbaudīšanas.'},
          {text:'Sajūtas šodien var būt spēcīgākas par vārdiem. Ja kas sāp, labāk to pateikt mierīgi, nekā ļaut tam krāties.',do:'Sāc grūtu sarunu ar vārdiem „man ir svarīgi”.',avoid:'Vecu pāridarījumu sarakstiem strīda vidū.'},
          {text:'Ja esi meklējumos, šodien pievelk dziļi un noslēpumaini cilvēki. Ļauj iepazīšanai notikt lēnām.',do:'Uzdod jautājumu, uz kuru nevar atbildēt ar „jā” vai „nē”.',avoid:'Pārāk ātras atklātības pirmajā tikšanās reizē.'}
        ],
        work:[
          {text:'Kopīgās naudas, kredītu vai nodokļu jautājumi šodien kārtojas vieglāk. Pārbaudi summas un termiņus, pirms ko paraksti.',do:'Saliec visus ikmēneša maksājumus vienā pārskatā.',avoid:'Aizdevumiem, kuru atmaksas plānu nevari izstāstīt vienā teikumā.'},
          {text:'Spēja ieskatīties dziļāk šodien noder. Pamani, kas slēpjas aiz cipariem vai kolēģu vārdiem.',do:'Izpēti vienu problēmu līdz galam, nevis pa virsu desmit.',avoid:'Virspusējiem secinājumiem no viena grafika.'},
          {text:'Atgādināt par parādu – naudu vai atbildi – šodien var pieklājīgi, bet skaidri.',do:'Uzraksti vienu īsu, pieklājīgu atgādinājumu ar konkrētu termiņu.',avoid:'Kautrēšanās prasīt to, kas tev pienākas.'}
        ],
        energy:[
          {text:'Emocijas šodien var nogurdināt vairāk nekā darbs. Atvēli laiku tam, lai izjūtas nosēstos – pastaigā, dušā vai klusumā.',do:'Izraksti savas domas uz papīra, pirms ej gulēt.',avoid:'Smagām tēmām tieši pirms miega.'},
          {text:'Atbrīvoties no liekā šodien ir viegli – gan skapī, gan telefonā. Tukšāka vide palīdz atpūsties arī galvai.',do:'Izmet vai atdod piecas lietas, kuras vairs nelieto.',avoid:'Lietu glabāšanas „katram gadījumam”.'},
          {text:'Spēki var atjaunoties lēnāk nekā parasti. Silta duša, mierīga mūzika un agrs miegs palīdzēs.',do:'Ej gulēt stundu agrāk nekā parasti.',avoid:'Vakara, kas paiet, ritinot svešu cilvēku dzīves.'}
        ]
      },
      { // 9: journeys, learning, the wider view
        headline:['Plašāks skats','Ceļš sauc','Laiks mācīties'],
        day:[
          'Skats šodien sniedzas tālāk par ikdienu. Plāni ceļojumam, mācībām vai lielākam mērķim rodas vieglāk nekā parasti.',
          'Ikdiena var šķist par šauru, un gribas kaut ko jaunu. Pat īss brauciens uz nezināmu vietu vai jauna grāmata var dot svaigu elpu.',
          'Pacelies pāri sīkumiem un atceries, kāpēc vispār dari to, ko dari. Jēgas sajūta šodien ir labākā motivācija.'
        ],
        love:[
          {text:'Kopīgs sapnis šodien tuvina vairāk nekā ikdienas jautājumi. Saruna par to, kurp gribētos aizbraukt, var aizvest tālāk, nekā šķiet.',do:'Izsapņo kopā ar otru nākamo kopīgo ceļojumu.',avoid:'Sapņu nogriešanas ar „tas mums nav pa kabatai”.'},
          {text:'Ja neesi attiecībās, var piesaistīt cilvēks no citas pilsētas, valsts vai pavisam citas vides. Atšķirības šodien ir pievilcīgas.',do:'Uzsāc sarunu ar kādu, kura dzīve ir pavisam citāda nekā tava.',avoid:'Aizspriedumiem par to, kas tev „der” un kas ne.'},
          {text:'Par vērtībām un lielām lietām šodien vērts runāt vairāk nekā par sadzīvi. Var atklāties, cik daudz jums kopīga.',do:'Pajautā otram par lielāko sapni, kas vēl nav piepildījies.',avoid:'Mēģinājumiem pārliecināt otru par savu taisnību par katru cenu.'}
        ],
        work:[
          {text:'Mācības, kursi un viss, kas paplašina zināšanas, šodien padodas labi. Jauna prasme var atvērt ceļu, par kuru vēl nedomā.',do:'Pieteikies kursam vai vebināram, kas sen ir tavā sarakstā.',avoid:'Atteikšanās no iespējām tikai tāpēc, ka tās ir nepazīstamas.'},
          {text:'Sadarbība ar ārzemju partneriem, valodas un lielāki plāni šodien padodas labi. Paskaties uz projektu no putna lidojuma.',do:'Uzraksti vienu e-pastu svešvalodā, ko sen atliec.',avoid:'Iestrēgšanas sīkumos, kad jāredz kopaina.'},
          {text:'Ceļojumu plāni šodien prasa praktisku pieeju: biļetes, budžets, datumi. Sapņi kļūst īsti, kad tiem ir kalendārs.',do:'Salīdzini cenas un ieplāno nākamo braucienu.',avoid:'Ceļojumiem, ko apmaksā no rezerves nebaltām dienām.'}
        ],
        energy:[
          {text:'Jaunas vietas uzlādē labāk par ierasto maršrutu. Izvēlies jaunu taku, parku vai kafejnīcu.',do:'Aizej uz vietu savā pilsētā, kur nekad agrāk nav sanācis būt.',avoid:'Vakara, kas paiet tieši tāpat kā vakardiena.'},
          {text:'Prāts šodien ir izsalcis pēc jaunā. Lekcija, dokumentālā filma vai saruna ar gudru cilvēku var iedvesmot ilgam laikam.',do:'Noskaties vai noklausies kaut ko par tēmu, kas sen interesē.',avoid:'Strīdiem par pārliecību, kas neko nemaina.'},
          {text:'Uz lietām šodien vērts paskatīties ar humoru un no attāluma. Ne viss, kas šķiet svarīgs no rīta, būs svarīgs vakarā.',do:'Pajautā sev: vai pēc gada tam vēl būs nozīme?',avoid:'Sīkumu pārvēršanas par lielām problēmām.'}
        ]
      },
      { // 10: career, goals, reputation
        headline:['Mērķis redzamā attālumā','Tavs darbs ir pamanāms','Karjeras diena'],
        day:[
          'Mēness šodien izgaismo karjeru un mērķus. Tas, ko dari darbā, ir redzamāks nekā parasti – izmanto to.',
          'Kurp ved tavs ceļš? Šodien labs brīdis par to padomāt, jo viens apzināts solis pretī mērķim būs vērtīgāks par desmit steidzīgiem.',
          'Diena prasa atbildību, bet arī dod iespēju parādīt, ko proti. Uzņemies iniciatīvu tur, kur parasti gaidi norādījumus.'
        ],
        love:[
          {text:'Darbs šodien var aizņemt lielu daļu uzmanības, un tuvie to jūt. Vakarā atvēli viņiem nedalītu uzmanību.',do:'Pastāsti tuvajam cilvēkam par saviem plāniem un uzklausi atbildi.',avoid:'Sarunu atlikšanas „līdz projekts būs galā”.'},
          {text:'Jauna pazīšanās šodien var aizsākties darbā: kāds var pamanīt tavu profesionalitāti un līdz ar to arī tevi. Ļauj tam notikt bez steigas.',do:'Pieņem uzaicinājumu uz pēcdarba pasākumu.',avoid:'Darba un jūtu sajaukšanas, ja tas var kaitēt abām lietām.'},
          {text:'Kopīgi mērķi šodien var kļūt par sarunas tematu. Vērts saprast, vai jūs ejat vienā virzienā.',do:'Pārrunā ar otru, kādu gribat redzēt nākamo gadu.',avoid:'Lēmumiem par kopīgo nākotni, nepajautājot otram.'}
        ],
        work:[
          {text:'Vadība un ietekmīgi cilvēki šodien tevi var pamanīt vieglāk. Labs brīdis parādīt rezultātu vai piedāvāt ideju.',do:'Apkopo savus šī mēneša rezultātus vienā lapā.',avoid:'Rezultātu slēpšanas pieticības dēļ.'},
          {text:'Karjeras mērķus šodien vērts pārskatīt. Ja kaut kas sen nepatīk, padomā par pirmo soli pārmaiņām.',do:'Pieraksti vienu karjeras mērķi šim gadam un pirmo soli līdz tam.',avoid:'Sūdzēšanās par darbu bez neviena plāna to mainīt.'},
          {text:'Atbildība šodien var šķist smaga, bet tā arī dod iespēju augt. Uzņemies to, kas tev pa spēkam, un pasaki skaidri, kas ne.',do:'Piesakies vienam uzdevumam, kas liek nedaudz izstiepties.',avoid:'Solījumiem, kurus iespējams izpildīt tikai bez miega.'}
        ],
        energy:[
          {text:'Enerģija šodien ir mērķtiecīga, tāpēc to viegli iztērēt tikai darbam. Atstāj nedaudz spēka arī vakaram.',do:'Beidz darba dienu noteiktā laikā, pat ja vēl varētu turpināt.',avoid:'Vakariem, kas pārvēršas par otro darba maiņu.'},
          {text:'Taisna mugura un mērens ritms palīdz justies labi. Arī acīm un pleciem vajag pauzes.',do:'Izej pusdienlaikā ārā vismaz uz desmit minūtēm.',avoid:'Pusdienu pārtraukuma upurēšanas sapulcēm.'},
          {text:'Panākumi šodien var dot spēku, bet arī spriedzi. Atrodi brīdi, lai novērtētu, cik daudz jau paveikts.',do:'Atceries trīs lietas, kas šonedēļ izdevās, un pasaki tās skaļi.',avoid:'Salīdzināšanas ar kolēģu panākumiem.'}
        ]
      },
      { // 11: friends, groups, hopes
        headline:['Draugu diena','Kopā ar savējiem','Skats uz nākotni'],
        day:[
          'Draugi un domubiedri ir tava lielākā bagātība. Kopā rodas idejas, kas vienatnē nerastos.',
          'Sazinies ar cilvēkiem, ar kuriem sen nav sanācis parunāt. Viena ziņa var atjaunot draudzību vai atvērt jaunu iespēju.',
          'Sapņi un plāni nākotnei šodien veidojas viegli. Pieraksti, ko gribi piedzīvot nākamajā gadā – skaidra vēlēšanās ir pirmais solis.'
        ],
        love:[
          {text:'Draudzība šodien var izrādīties tikpat vērtīga kā romantika. Kopīgs vakars ar draugiem var uzlādēt arī attiecības.',do:'Sarunā kopīgu vakaru ar draugiem.',avoid:'Draugu atstāšanas novārtā jaunu attiecību dēļ.'},
          {text:'Jaunu cilvēku šodien visvieglāk satikt draugu lokā vai kopīgu interešu grupā. Iepazīšanās var sākties ar parastu sarunu.',do:'Piekrīti, ja draugi grib tevi ar kādu iepazīstināt.',avoid:'Atteikšanās no uzaicinājuma tikai aiz ieraduma.'},
          {text:'Vieglums un uzticēšanās šodien attiecībām dod vairāk nekā jebkurš plāns. Arī atsevišķas intereses var tuvināt.',do:'Atbalsti otra hobiju vai sapni, pat ja tas nav tavs.',avoid:'Kontroles, kas izskatās pēc rūpēm.'}
        ],
        work:[
          {text:'Komanda šodien domā ātrāk nekā katrs atsevišķi. Iesaisti citus un ļauj idejām satikties.',do:'Sarīko īsu ideju apspriedi ar kolēģiem.',avoid:'Visa projekta turēšanas tikai savās rokās.'},
          {text:'Kontakti ir vērtīgāki par sludinājumiem. Kāds no paziņām var zināt par iespēju, kas tev noderētu.',do:'Pastāsti paziņām, kādu darbu vai projektu meklē.',avoid:'Kautrības lūgt padomu tiem, kuri jau to ceļu izgājuši.'},
          {text:'Nākotnes finanšu mērķi šodien prasās uz papīra. Sapnim vajag budžetu, un budžetam – sapni.',do:'Atliec nelielu summu kādam konkrētam sapnim.',avoid:'Kopīgiem tēriņiem ar draugiem bez skaidras vienošanās.'}
        ],
        energy:[
          {text:'Cilvēki šodien uzlādē, bet tikai tie, ar kuriem ir viegli. Izvēlies sabiedrību, pēc kuras gribas smaidīt.',do:'Satiec kādu, ar kuru nav jāizliekas.',avoid:'Pasākumiem, uz kuriem ej tikai pienākuma pēc.'},
          {text:'Domubiedri iedvesmo vairāk nekā parasti. Klubs, kopiena vai kopīgs projekts var dot spēku visai nedēļai.',do:'Pievienojies grupai vai pasākumam, kas saistīts ar tavu hobiju.',avoid:'Sēdēšanas mājās tikai aiz kūtruma.'},
          {text:'Domāšana par nākotni šodien var gan iedvesmot, gan satraukt. Koncentrējies uz to, ko vari ietekmēt jau šonedēļ.',do:'Izvēlies vienu lietu, uz ko priecāties nākamajā mēnesī.',avoid:'Ziņu ritināšanas, kas vairo tikai satraukumu.'}
        ]
      },
      { // 12: rest, solitude, intuition, finishing
        headline:['Klusuma diena','Laiks atpūtai','Ieklausies sevī'],
        day:[
          'Palēnini tempu: šī ir diena atpūtai, pārdomām un iesākto lietu pabeigšanai, nevis jauniem sākumiem.',
          'Spēku var būt mazāk nekā parasti, un tas ir normāli. Ļauj sev atpūsties bez vainas apziņas.',
          'Intuīcija šodien ir skaļāka par loģiku. Ieklausies sajūtās, un lielos lēmumus atliec uz pāris dienām.'
        ],
        love:[
          {text:'Attiecībās šodien vairāk klusuma nekā vārdu, un tas ir labi. Klātbūtne var pateikt vairāk par sarunu.',do:'Pavadi vakaru kopā klusumā – ar filmu vai grāmatām.',avoid:'Nopietnu attiecību sarunu uzsākšanas nogurumā.'},
          {text:'Domas par pagātni vai kādu cilvēku var atgriezties. Ļauj tām būt, bet nesteidzies rakstīt.',do:'Uzraksti vēstuli, ko neviens neizlasīs, un izsaki tajā visu.',avoid:'Ziņām bijušajiem vēlu vakarā.'},
          {text:'Vienatne šodien nav vientulība: labāk pabūt ar sevi nekā meklēt kādu par katru cenu. Pārim otra klātbūtne var nomierināt.',do:'Parūpējies par sevi tā, kā gribētu, lai par tevi rūpējas otrs.',avoid:'Iepazīšanās lietotņu ritināšanas aiz garlaicības.'}
        ],
        work:[
          {text:'Lietas var virzīties lēnāk, un jauniem projektiem labāk pagaidīt. Vecie uzdevumi šodien padodas labāk nekā jaunie.',do:'Pabeidz vienu darbu, kas sen karājas.',avoid:'Termiņiem, kas solīti, nepaskatoties kalendārā.'},
          {text:'Aizkulišu darbs šodien padodas vislabāk: plānot, sakārtot, sagatavoties. Publiskiem soļiem piemērotāks laiks būs pēc pāris dienām.',do:'Sagatavo materiālus nākamajai nedēļai.',avoid:'Publiskiem paziņojumiem, kas vēl nav nobrieduši.'},
          {text:'Nauda šodien prasa piesardzību, jo kļūda pārskaitījumā vai līgumā rodas vieglāk nekā parasti.',do:'Pārbaudi bankas kontu un pēdējos maksājumus.',avoid:'Finanšu lēmumiem, kas „jāpieņem tūlīt”.'}
        ],
        energy:[
          {text:'Ķermenis šodien lūdz atpūtu, un tam ir taisnība. Grāmata, tēja un agrs miegs var būt labākais vakara plāns.',do:'Ej gulēt, tiklīdz jūti nogurumu.',avoid:'Spēku tērēšanas, lai izskatītos ražīgi.'},
          {text:'Klusums un vienatne šodien atjauno. Pat pusstunda bez cilvēkiem un ekrāniem var dot vairāk, nekā šķiet.',do:'Atrodi pusstundu, kurā esi tikai ar sevi.',avoid:'Trokšņainiem pasākumiem, uz kuriem negribas iet.'},
          {text:'Sapņi un sajūtas var būt spilgtāki nekā parasti. Ne visam vajag skaidrojumu, bet ieklausīties ir vērts.',do:'No rīta pieraksti, ko sapņoji.',avoid:'Sajūtu apspiešanas tikai tāpēc, ka tās nav loģiskas.'}
        ]
      }
    ]
  },
  humor:{
    events:{
      sunOwn:e=>`No ${time(e.time)} Saule ir tavā zīmē: sākas tavs mēnesis, un spogulis šodien ir nepārprotami tavā pusē.`,
      sunIngress:e=>`${time(e.time).replace(/^./,c=>c.toUpperCase())} Saule ieiet ${signs.loc[e.to]} un pārņem dežūru.`,
      fullMoon:e=>e.own
        ?`${time(e.time).replace(/^./,c=>c.toUpperCase())} pilnmēness tavā zīmē: emocijām ieslēgts prožektors, tāpēc pirms dramatiskas ziņas sūtīšanas iedzer tēju.`
        :`${time(e.time).replace(/^./,c=>c.toUpperCase())} ir pilnmēness ${signs.loc[e.sign]}: vakarā pat kaimiņa suns rej ar lielāku pārliecību.`,
      newMoon:e=>e.own
        ?`${time(e.time).replace(/^./,c=>c.toUpperCase())} jauns mēness tavā zīmē: Visums atver tīru lapu, un pirmo rindiņu raksti tu.`
        :`${time(e.time).replace(/^./,c=>c.toUpperCase())} ir jauns mēness ${signs.loc[e.sign]}: labs brīdis sākumam, ja vien tas nav kārtējais „no pirmdienas”.`,
      station:e=>({
        Mercury:{retrograde:'Merkurs sāk atpakaļgaitu: pirms spied „Sūtīt”, pārliecinies, ka ziņa neaizies visai darba grupai.',direct:'Merkurs beidz atpakaļgaitu, un printeris, e-pasts un sarunas atkal sāk sadarboties.'},
        Venus:{retrograde:'Venera sāk atpakaļgaitu: kāds no pagātnes var pēkšņi atcerēties tavu numuru, bet tev nav pienākuma atbildēt.',direct:'Venera beidz atpakaļgaitu, un sirds ar maku atkal runā vienā valodā.'},
        Mars:{retrograde:'Marss sāk atpakaļgaitu: bruņas var pakārt skapī un iesāktās kaujas pabeigt bez taures.',direct:'Marss beidz atpakaļgaitu: dzinējs atkal velk, var droši ieslēgt pirmo pārnesumu.'}
      })[e.body][e.turns].replace(/^/,`${time(e.time).replace(/^./,c=>c.toUpperCase())} `),
      moonChange:e=>`Līdz ${time(e.time)} Mēness vēl ir ${signs.loc[e.from]}, pēc tam ievācas ${signs.loc[e.to]}.`
    },
    headlines:{sunOwn:'Tavs mēnesis, tavi noteikumi',fullMoonOwn:'Prožektors uz tevi',newMoonOwn:'Tīra lapa, jauna pildspalva'},
    houses:[
      { // 1
        headline:['Galvenā loma – tev','Spogulis smaida pretī','Tavs šovs bez reklāmas pauzēm'],
        day:[
          'Dienas scenārijs šodien uzrakstīts tieši par tevi, jo Mēness ir tavā zīmē. Pārējie var pagaidīt aizkulisēs – vismaz līdz pusdienām.',
          'Ar tavu enerģiju varētu darbināt nelielu elektrostaciju. Novirzi to kaut kam noderīgam, pirms tā tiek iztērēta skapja trešajai pārkārtošanai šonedēļ.',
          'Jūtas šodien kāpj uz skatuves bez grima. Ja kāds pajautās „kā iet?”, var saņemt pilnu atbildi ar pielikumiem.'
        ],
        love:[
          {text:'Drosme šodien ir lētāka nekā parasti – īsta akcija. Ja kāds sen gaida tavu ziņu, nepārvērt gaidīšanu par seriālu ar desmit sezonām.',do:'Nosūti to ziņu – melnrakstos tā jau sāk krāt putekļus.',avoid:'Ziņas pārrakstīšanas septīto reizi, līdz tā skan kā juridisks dokuments.'},
          {text:'Vārdi nāk ārā bez filtra. Lieliski jūtu atzīšanai, mazāk lieliski – viedoklim par otra jauno frizūru.',do:'Uzraksti komplimentu, kuru nevarētu nosūtīt arī kolēģim.',avoid:'Strīdiem par to, kurš pēdējo reizi aizmirsa nopirkt maizi.'},
          {text:'Jūtīgums šodien ir kā signalizācija, kas ieslēdzas no kaķa soļiem. Ne katrs „ok” ir slepena vēstule ar zemtekstu.',do:'Ja kaut kas nav skaidrs, pajautā – telepātija vēl nav pieejama abonementā.',avoid:'Īsas ziņas pārvēršanas trīs cēlienu traģēdijā.'}
        ],
        work:[
          {text:'Idejas lido ātrāk, nekā piezīmju lapiņas spēj tās noķert. Viena no tām varētu būt tieši tā, ko komanda gaida.',do:'Pasaki savu ideju skaļi – kolēģi domas lasīt vēl nav iemācījušies.',avoid:'Sapulcēm, kurās tava ideja pazūd zem „to apspriedīsim vēlāk”.'},
          {text:'Pa savam gribas darīt visu, un dažreiz tas pat ir pareizi. Tikai brīdini kolēģus, pirms pārdēvē visas kopīgās mapes.',do:'Uzņemies vadību vienā uzdevumā un izbaudi īslaicīgu varu.',avoid:'Visa projekta pārņemšanas, ja lūgts bija tikai viens slaids.'},
          {text:'Garastāvoklis šodien grib iepirkties. Maks gan vēl nav parakstījis piekrišanu.',do:'Pirms pirkuma izdzer glāzi ūdens un pārbaudi, vai vēlme nav izšķīdusi.',avoid:'Kartes vilkšanas ar domu „man taču pienākas”.'}
        ],
        energy:[
          {text:'Kājas pašas prasās ārā – maratonā vai vismaz līdz veikalam un atpakaļ. Izmanto to, pirms dīvāns sāk savu vilināšanas kampaņu.',do:'Izej pastaigā – soļu skaitītājs jau domā, ka telefons ir salūzis.',avoid:'Sarunām ar dīvānu par „tikai piecām minūtēm”.'},
          {text:'Rīts šodien nosaka visas dienas skaņu celiņu. Izvēlies to apzināti, nevis pirmo, ko piedāvā telefons.',do:'Uzliec dziesmu, kurai gribas dziedāt līdzi pat zobu tīrīšanas laikā.',avoid:'E-pastiem vēl pirms brokastīm.'},
          {text:'Ķermenis šodien runā skaidri kā navigācija: „pēc 300 metriem – dīvāns”. Ja tas prasa gulēt, nav vērts strīdēties līdz pusnaktij.',do:'Ieplāno vakaru, kurā vienīgais uzdevums ir atpūsties.',avoid:'Seriāla maratona „vēl tikai viena sērija”.'}
        ]
      },
      { // 2
        headline:['Maks lūdz vārdu','Komforta režīms','Vērtību inventarizācija'],
        day:[
          'Mēness šodien rakņājas tavā makā kā arheologs. Atradumi var pārsteigt – piemēram, trīs abonementi, par kuriem neviens neko neatceras.',
          'Komforta saraksts šodien: mīksts džemperis, silta tēja un bankas konts, kas neliek nopūsties. Ar pirmajiem diviem var sākt uzreiz.',
          'Jautājums dienai: kas tev patiešām ir vērtīgs? Var izrādīties, ka miers, nevis vēl viena virtuves ierīce, kas stāvēs blakus maizes cepējam.'
        ],
        love:[
          {text:'Pankūkas izsaka jūtas labāk nekā dzeja – un, godīgi sakot, biežāk sasniedz mērķi.',do:'Atnes otram kafiju ar tieši tik daudz cukura, cik vajag – tā ir mīlestība.',avoid:'Mīļu vārdu taupīšanas „īpašam gadījumam”.'},
          {text:'Atzinība garšo labāk par desertu. Ja otrs to neuzmin, pastāsti – prāta lasīšanas kursi vēl nav obligāti.',do:'Pasaki skaļi, kas tev attiecībās patīk – arī sīkumos.',avoid:'Romantikas, kas notiek tikai sociālo tīklu publikācijās.'},
          {text:'Naudas saruna divatā šodien var izvērsties par seriāla jauno sezonu. Skatieties to pēc pusdienām, kad nervi ir paēduši.',do:'Ielieciet kopīgajā budžetā arī pozīciju „prieki” – kaut vai mazu.',avoid:'Strīdiem par to, kura kārta bija pirkt kafiju.'}
        ],
        work:[
          {text:'Medību sezona atklāta: abonementi, kas klusi ēd tavu algu, šodien ir galvenais medījums. Viens droši vien slēpjas tur, kur to nemeklē.',do:'Atrodi abonementu, ko izmanto retāk nekā sporta zāli februārī.',avoid:'Maksāšanas par trim straumēšanas servisiem, lai skatītos vienu seriālu.'},
          {text:'Argumenti algas pārrunām šodien skan kā labi noskaņots orķestris. Tikai pirms koncerta sagatavo notis – skaitļus.',do:'Saskaiti savus gada panākumus un ieliec tos vienā īsziņā.',avoid:'Atlaidēm saviem pakalpojumiem tikai tāpēc, ka klients jauki smaida.'},
          {text:'Internetveikala grozs runā ļoti pārliecinoši. Ļauj tam pārgulēt nakti: no rīta daļa „obligāto” lietu pazudīs pati.',do:'Pajautā sev: „Vai es to lietošu vairāk nekā vienu reizi?”',avoid:'Sajūsmas par „bezmaksas piegādi”, kuras dēļ jānopērk vēl trīs lietas.'}
        ],
        energy:[
          {text:'Kā kaķis, kas ieņēmis siltāko vietu, tā arī tavs ķermenis šodien pieprasa komfortu. Labāk piekāpties.',do:'Uzvelc ērtāko džemperi un pasludini to par oficiālo tērpu.',avoid:'Kurpēm, kas skaistas, bet sāp jau pēc pieciem soļiem.'},
          {text:'Maņas šodien ir izsalkušas pēc prieka. Svaigi cepta maize vai laba smarža var izdarīt vairāk nekā motivācijas citāts.',do:'Apstājies pie maiznīcas un ieelpo – tas ir bez maksas.',avoid:'Motivācijas citātiem tukšā dūšā.'},
          {text:'Garlaicīgs ritms ir slepenā supervara. Spontānie plāni var palikt rezervē līdz nedēļas nogalei.',do:'Noliec telefonu gulēt citā istabā – internets līdz rītam nebeigsies.',avoid:'Trešās kafijas krūzes pēcpusdienā.'}
        ]
      },
      { // 3
        headline:['Mēle ātrāka par domām','Tērzēšanas maratons','Ziņu karuselis'],
        day:[
          'Runātīgums šodien ieslēgts uz pilnu jaudu. Telefona akumulators var izlādēties ātrāk nekā tavs stāstu krājums.',
          'Popkorna mašīna galvā strādā bez pārtraukuma. Noķer pāris labāko ideju, pirms tās aizripo zem dīvāna.',
          'Diena ir ideāla, lai uzzinātu kaut ko jaunu – vai vismaz to, kāpēc kaimiņš sestdienās urbj sienu.'
        ],
        love:[
          {text:'Flirts izdodas pat ar pieturzīmēm. Komats īstajā vietā var izdarīt brīnumus.',do:'Atgādini otram jūsu kopīgo joku – tādu, kuru citi nesaprastu.',avoid:'Jūtu atzīšanas ar trim emocijzīmēm un vienu „hmm”.'},
          {text:'Runātprasme šodien ir kā sacīkšu auto. Galvenais – neizstāstīt visu savu dzīvi pirmajās piecās minūtēs.',do:'Klausies tik uzmanīgi, it kā vēlāk būtu kontroldarbs.',avoid:'Stāstiem par bijušajām attiecībām jau pirmajā randiņā.'},
          {text:'Kaut kas nepateikts jau sācis maksāt īri jūsu attiecībās. Laiks to izlikt no dzīvokļa ar vienu sarunu.',do:'Sāc sarunu bez desmit prātā izspēlētiem ievadiem.',avoid:'Smagām nopūtām, kurām jāpaskaidro viss pārējais.'}
        ],
        work:[
          {text:'E-pasti vairojas kā truši, un iesūtne jau izskatās pēc fermas.',do:'Piezvani tur, kur sarakste jau sasniegusi divdesmito vēstuli.',avoid:'Atbildēm „visiem” uz vēstuli, kas bija domāta vienam.'},
          {text:'Smadzenes šodien uzsūc informāciju kā sūklis, kas ilgi stāvējis sausumā. Ideāla diena mācībām.',do:'Apgūsti vienu jaunu īsinājumtaustiņu – peles roka atvilks elpu.',avoid:'Lietošanas noteikumu „izlasīšanas” ar vienu klikšķi.'},
          {text:'Pavasara palos ir mazāk ūdens nekā tavā galvā ideju. Ne katru vajag pārvērst par projektu – dažām var vienkārši pamāt ardievas.',do:'Izvēlies vienu ideju un uzraksti tai trīs pirmos soļus.',avoid:'Jauna projekta sākšanas katru reizi, kad ienāk prātā laba doma.'}
        ],
        energy:[
          {text:'Galva skrien maratonu, kamēr kājas sēž krēslā. Laiks tās samainīt vietām.',do:'Runā pa telefonu, ejot pastaigā, nevis sēžot.',avoid:'Divdesmit atvērtām pārlūka cilnēm vienlaikus.'},
          {text:'Smadzenes šodien var paprasīt brīvdienu – ziņu ir vairāk nekā vietas plauktos. Iedod tām vismaz pusdienu pārtraukumu.',do:'Paskaties pa logu piecas minūtes – tas ir vecākais relaksācijas lietotnes paveids.',avoid:'Balss ziņām, kas garākas par podkāstu.'},
          {text:'Labākā izklaide šodien var izrādīties podkāsts par lietu, par kuru vakar vēl nezināji, ka tāda eksistē.',do:'Uzzini vienu pilnīgi nevajadzīgu faktu un pastāsti to vakariņās.',avoid:'Strīdiem komentāros ar cilvēku, kura profila bildē ir saulriets.'}
        ]
      },
      { // 4
        headline:['Dīvāns sauc','Radu padome sanāk','Mājas – tava pils'],
        day:[
          'Čības šodien gaida pie durvīm un izskatās ļoti pārliecinošas. Mājas velk kā magnēts – nav jēgas pretoties.',
          'Atvilktne, kurā dzīvo visi pasaules lādētāji, gaida savu stundu. Arī lielā mājas sakārtošana var sākties ar vienu vadu.',
          'Ģimenes čatā šodien var būt karstāk nekā virtuvē. Ieliec tur kādu labu ziņu, pirms sākas diskusija par svētku ēdienkarti.'
        ],
        love:[
          {text:'Romantika izskatās pēc kopīgas zupas vārīšanas un strīda par to, cik daudz sāls ir „mazliet”.',do:'Pagatavo vakariņas pēc vecmāmiņas receptes un neatzīsties, ja kaut kas sanāca citādi.',avoid:'Ēdiena fotografēšanas, kamēr tas atdziest.'},
          {text:'Radi šodien var izteikt viedokli arī par tavu mīlas dzīvi. Pieklājīgi pamāj ar galvu un dari pa savam.',do:'Piezvani radiniekam, kuram vienmēr ir kāds stāsts, un ļauj tam izskanēt līdz galam.',avoid:'Diskusijām par to, kā pareizi jāizkrauj trauku mašīna.'},
          {text:'Apskāvienu šodien pietrūkst kā naudas dienu pirms algas. Paprasi tos skaļi – tas nav nekas kaunīgs.',do:'Sarīko pleda vakaru divatā vai ar mīļāko spilvenu.',avoid:'Apvainošanās, ka otrs nav uzminējis tavu noskaņojumu.'}
        ],
        work:[
          {text:'Dīvāns šodien izskatās pēc ideāla biroja. Ja darba devējs tam nepiekrīt, paņem uz darbu vismaz mīļāko krūzi.',do:'Izdari svarīgāko līdz pusdienām, kamēr dīvāns vēl nav uzvarējis.',avoid:'Darba telefona, kas mājās zvana skaļāk par ģimeni.'},
          {text:'Rēķini par dzīvokli gaida tavu uzmanību. Tie paši sevi neapmaksās, lai cik ilgi uz tiem nopūstos.',do:'Samaksā to vienu rēķinu, kas jau sāk tevi pazīt pēc sejas.',avoid:'Remonta plāniem, kas sākas ar „tikai nokrāsosim vienu sienu”.'},
          {text:'Virves vilkšana starp ģimeni un darbu šodien var sākties jau no rīta. Novelc skaidru robežu, un katra puse paliks ar savu daļu.',do:'Ieliec kalendārā „ģimenes sapulci” – un ierodies uz to laikus.',avoid:'Darba zvaniem, kamēr zupa atdziest uz galda.'}
        ],
        energy:[
          {text:'Uzlādes stacija šodien atrodas tavās mājās. Pieslēdzies tai ar siltu zupu un pledu.',do:'Pasludini šo vakaru par oficiālu pidžamas vakaru.',avoid:'Vakara plāniem, kuru dēļ jāvelk kas cits, nevis čības.'},
          {text:'Plaukts, kurā lietas glabājas „uz laiku” kopš 2019. gada, šodien skatās uz tevi pārmetoši. Pēc tā sakārtošanas vieglāk kļūs arī galvā.',do:'Izvēlies vienu stūri un uzvari to – pārējie stūri var pagaidīt.',avoid:'Trīs maisiem ar uzrakstu „vēlākai šķirošanai”.'},
          {text:'Kā svaigi izcepta maizīte – tik maiga šodien ir tava sirds. Apejies ar to uzmanīgi un nelaid tuvumā kritiķus.',do:'Uztaisi kaut ko no bērnības – kakao, ievārījuma maizi vai būdu no spilveniem.',avoid:'Kritiķu uzklausīšanas, kuri paši nekad neko nav cepuši.'}
        ]
      },
      { // 5
        headline:['Sirds uzvelk balles kurpes','Rotaļu laukums atvērts','Prieks bez receptes'],
        day:[
          'Mēness šodien ieslēdz ballītes režīmu. Pat iepirkšanās veikalā var izvērsties par nelielu piedzīvojumu.',
          'Dziesmas dušā šodien skan skaļāk nekā parasti, un flirts nāk viegli kā piedziedājums. Kaimiņi to izturēs.',
          'Iekšējais bērns šodien ir pamodies un pieprasa saldējumu. Varbūt viņam šoreiz ir taisnība.'
        ],
        love:[
          {text:'Konfeti lido gaisā, pat ja neviens tos nav nopircis. Ja kāds patīk, tagad ir īstais brīdis to parādīt – ar stilu.',do:'Izdomā randiņu, kas nav vakariņas un filma.',avoid:'Flirta, kas tik smalks, ka to neviens nepamana.'},
          {text:'Jo dīvaināks kopīgais joks, jo ciešāka saite – zinātniski nepārbaudīts, bet šodien strādā.',do:'Izspēlējiet galda spēli un ļaujiet zaudētājam gatavot brokastis.',avoid:'Uzvaras dejām, kas ilgst ilgāk par pašu spēli.'},
          {text:'Rinda pie kases šodien var izrādīties romantiskāka par restorānu – kāds var iepatikties tur, kur to vismazāk gaidi.',do:'Uzsmaidi svešiniekam – sliktākajā gadījumā saņemsi smaidu pretī.',avoid:'Ideālā cilvēka saraksta ar 47 punktiem.'}
        ],
        work:[
          {text:'Pienākumi šodien izskatās pēc mājasdarba saulainā dienā. Labā ziņa: arī mājasdarbu var izpildīt ar krāsainiem flomāsteriem.',do:'Pārvērt garlaicīgu uzdevumu par spēli ar punktiem un balvu.',avoid:'Lieliem lēmumiem, kuru vienīgais arguments ir „būs jautri”.'},
          {text:'Prezentācijas izdodas kā šovs. Tikai pārbaudi, vai slaidos nav palikusi vakardienas iepirkumu saraksta bilde.',do:'Ieliec prezentācijā vienu joku – bet ne vairāk kā vienu.',avoid:'Skaitļiem, kas „izskatās aptuveni pareizi”.'},
          {text:'Kārdinājums šodien – iztērēt naudu priekam. Prieks ir lielisks, kamēr tam ir budžets, nevis kredītkarte.',do:'Iedod priekam budžetu un tērē to ar baudu.',avoid:'Loterijas biļetēm kā finanšu plānam.'}
        ],
        energy:[
          {text:'Enerģija šodien grib dejot, pat ja tu domāji tikai iznest atkritumus.',do:'Uzliec mīļāko dziesmu un izdejo to līdz galam.',avoid:'Sporta zāles, ja patiesībā gribas uz slidotavu.'},
          {text:'Iedvesma izlaužas kā ziedi caur asfaltu. Zīmē, cep, raksti – arī Pikaso sāka ar švīkām.',do:'Uzzīmē kaut ko un pasludini to par mākslu.',avoid:'Iekšējā kritiķa, kurš uzskata, ka bez diploma zīmēt nedrīkst.'},
          {text:'Smiekli izplatās ātrāk par baumām, tāpēc izvēlies sabiedrību, kas smejas skaļi un bieži.',do:'Piezvani draugam, ar kuru simto reizi var smieties par to pašu joku.',avoid:'Cilvēkiem, kuri katru jautru brīdi pārvērš lekcijā.'}
        ]
      },
      { // 6
        headline:['Saraksts uzvar haosu','Rutīna ar supervarām','Ķeksīšu svētki'],
        day:[
          'Kārtības režīms ir aktivizēts. Pat zeķes atvilktnē var sākt rindoties pēc krāsām.',
          'Pārsvītrošanas prieks šodien ir lielāks nekā parasti. Ieraksti sarakstā arī „izdzert kafiju” – lai būtu ar ko sākt.',
          'Ķermenis šodien sūta paziņojumus biežāk nekā darba čats. Vērts tos izlasīt, nevis atzīmēt kā izlasītus.'
        ],
        love:[
          {text:'Lapiņa uz ledusskapja var būt romantiskāka par sonetu: „Piens nopirkts. Tu esi zelts.”',do:'Atstāj mīļu zīmīti tur, kur otrs to atradīs no rīta.',avoid:'Varonības demonstrācijas ar vienu iznestu atkritumu maisu.'},
          {text:'Iepirkumu sarakstā starp „maize” un „baterijas” šodien atradīsies vieta arī romantikai. Neizklausās pēc dzejas, bet strādā.',do:'Sastādiet kopīgu iepirkumu sarakstu un ielieciet tajā arī kaut ko saldu.',avoid:'Pārmetumiem par to vienu krūzi, kas izlietnē stāv jau trešo dienu.'},
          {text:'Kalendārs šodien pilns līdz malām, tāpēc mīlestībai jāiet caur ekspreskasi: īsi, sirsnīgi un bez rindas.',do:'Apskauj tuvo cilvēku jau pie durvīm – pirms stāsti par darbu.',avoid:'Vakariņām, kurās galvenais viesis ir tavs priekšnieks – kaut vai tikai sarunās.'}
        ],
        work:[
          {text:'Atliktie darbi šodien padodas, it kā tiem būtu apnicis gulēt atvilktnē. Viens no tiem jau sāk pierast pie tevis.',do:'Paveic darbu, kuru atliec tik ilgi, ka tam jau ir dzimšanas diena.',avoid:'Darba saraksta pārrakstīšanas, lai nebūtu jādara darbi no saraksta.'},
          {text:'Motivācijas video var aizstāt ar tīru galdu – efekts būs lielāks, un reklāmu nebūs.',do:'Pārdēvē failus, kas saucas „gala_versija_3_pēdējā”.',avoid:'Pildspalvu kārtošanas pēc krāsām darba laikā.'},
          {text:'Tavs galds šodien var kļūt par palīdzības lodziņu ar rindu līdz durvīm. Laipnība ir jauka, bet arī tavam darbam vajag tevi.',do:'Uzstādi taimeri: palīdzība kolēģiem – līdz zvanam.',avoid:'Visu citu uzdevumu pieņemšanas, jo „tev taču labi sanāk”.'}
        ],
        energy:[
          {text:'Cepums no atvilktnes nav pusdienas, lai cik pārliecinoši tas čabētu. Ķermenim vajag ko nopietnāku.',do:'Ieplāno pusdienas kalendārā kā sapulci ar ļoti svarīgu klientu.',avoid:'Pusdienām, kas sastāv no kafijas un cerības.'},
          {text:'Meklētājs nav labākais ārsts, lai cik pārliecinoši tas izklausītos pusnaktī.',do:'Piezvani uz reģistratūru, pirms drosme atkal aiziet atvaļinājumā.',avoid:'Diagnozēm, ko uzstādījis forums ar nosaukumu „Viss par visu”.'},
          {text:'Krēsls var pieaugt pie tevis, ja to neapturēsi. Pret to palīdz tikai regulāras ekspedīcijas līdz virtuvei.',do:'Izstaipies kā kaķis pēc pusdienlaika miega – vismaz reizi stundā.',avoid:'Astoņām stundām vienā pozā, kā skulptūrai.'}
        ]
      },
      { // 7
        headline:['Kopā pat kalni ir zemāki','Duets, nevis solo','Kompromisu festivāls'],
        day:[
          'Solo uzstāšanās šodien atceltas, uz skatuves kāpj dueti. Pat sarežģītāks darbs kopā ar kādu var izdoties ātrāk un jautrāk.',
          'Diplomātija un mazliet šokolādes – ar šo kombināciju šodien var panākt gandrīz jebko, pat mieru ar kaimiņu.',
          'Pat strīds par to, kuru filmu skatīties, šodien var beigties ar mieru – un kopīgu popkornu. Kompromisi nāk vieglāk nekā parasti.'
        ],
        love:[
          {text:'Attiecības šodien rit kā labi iestudēta deja. Pat ja kāds uzkāpj uz kājas, to var pasniegt kā jaunu soli.',do:'Noliec telefonus otrā istabā – trešais ritenis šovakar nav vajadzīgs.',avoid:'Soļu skaitīšanas skaļi – deja nav eksāmens.'},
          {text:'Brīvām sirdīm iepazīšanās šodien var notikt pavisam negaidīti – pat strīdoties par pēdējo piena paku veikalā.',do:'Atstāj pēdējo piena paku otram – un pasmaidi.',avoid:'Pirmā iespaida spriešanas pēc iepirkumu groza satura.'},
          {text:'Iepirkumu maisi atklāj patiesību: ja tos vienmēr nes viena puse, laiks mainīties vietām.',do:'Uzņemies otra ikdienas pienākumu uz vienu dienu – bez paziņošanas presei.',avoid:'Nopūtām, kas skaļākas par pašu darbu.'}
        ],
        work:[
          {text:'Randiņu lietotne darbam gan neeksistē, bet partneri projektam šodien atrast ir vieglāk nekā parasti.',do:'Atrodi uzdevumam kompanjonu – divatā pat Excel šķiet draudzīgāks.',avoid:'Varonīgas visa darba nešanas uz saviem pleciem kā Atlantam.'},
          {text:'Rindiņa, kas uzrakstīta tik sīki, ka izskatās pēc putekļiem, šodien var būt vissvarīgākā. Līgumiem diena ir laba, ja tos izlasa līdz galam.',do:'Izlasi līgumu ar zīmuli rokā kā detektīvromānu.',avoid:'Rokasspiedieniem lielos darījumos bez neviena papīra.'},
          {text:'Klusums šodien var būt spēcīgākais arguments pārrunās – it īpaši, ja otrā pusē runā bez pauzēm.',do:'Saskaiti līdz pieci, pirms atbildi uz skaļu piedāvājumu.',avoid:'Durvju aizciršanas kā sarunu taktikas.'}
        ],
        energy:[
          {text:'Ledusskapja durvis šodien var pārklāties ar citu problēmām kā ar magnētiem. Atstāj vietu arī savam mieram.',do:'Izslēdz skaņu čatiem, kuros visi gaida tieši tavu padomu.',avoid:'Bezmaksas psihologa lomas visiem paziņām pēc kārtas.'},
          {text:'Soļu skaitītājs šodien skaita ātrāk, ja blakus iet vēl kāds. Pat ja tas kāds visu laiku pārbauda rezultātu.',do:'Norunā kopīgu pastaigu un izvēlies garāko maršrutu.',avoid:'Sacensībām par to, kuram pulkstenis rāda vairāk soļu.'},
          {text:'Svešas drāmas tiek piedāvātas kā bezmaksas biļetes. Nav obligāti iet uz katru izrādi.',do:'Uzliec jautru video uz trim minūtēm, tiklīdz smagā saruna beigusies.',avoid:'Svešu strīdu adopcijas kā mājdzīvnieka.'}
        ]
      },
      { // 8
        headline:['Dziļais ūdens','Noslēpumu diena','Lieko nost'],
        day:[
          'Sarunas par laikapstākļiem šodien neapmierinās – gribas runāt par dzīves jēgu, vēlams jau pie brokastīm.',
          'Šausmene ar nosaukumu „Kopīgie parādi” šodien izrādās mazāk biedējoša – briesmonis beigās ir tikai kaķis. Ieskaties tajā drosmīgi.',
          'Liekais šodien var doties prom. Skapis atvieglots uzelpos, kad no tā izies trīs vecas jakas.'
        ],
        love:[
          {text:'Tērzēšana par seriāliem šodien neder – gribas dziļuma. Pajautā otram kaut ko, uz ko nevar atbildēt ar „normāli”.',do:'Pastāsti kādu nelielu noslēpumu – piemēram, ka tev garšo ananāss uz picas.',avoid:'Greizsirdības izmeklēšanas viena „patīk” dēļ.'},
          {text:'Emocijas šodien ir asas kā čili mērce. Lieto mēreni un vienmēr ar ūdens glāzi pa rokai.',do:'Pasaki, kas sāp, bez dramatiskām pauzēm kā ziepju operā.',avoid:'Asuma pievienošanas jau tā asai sarunai.'},
          {text:'Noslēpumainība šodien ir pievilcīga. Tikai pārliecinies, ka noslēpums nav nesamaksāti kredīti.',do:'Atklāj sevi pa vienai sērijai, nevis visu sezonu uzreiz.',avoid:'Jautājumu biruma jau pirmajā randiņā.'}
        ],
        work:[
          {text:'Kredītu un parādu tabula nav gotisks romāns, bet šodien to vajag izlasīt līdz galam.',do:'Atver kredīta grafiku un paskaties tam acīs.',avoid:'Naudas aizdošanas draugiem, kuri „atdos nākammēnes” jau trešo gadu.'},
          {text:'Detektīva instinkts šodien noder arī birojā. Kaut kas tabulā var nesakrist, un tieši tu to vari atrast.',do:'Nopratini vienu dīvainu skaitli, līdz tas atzīstas.',avoid:'Grafikiem, kuros neviens nesaprot asis, bet visi māj ar galvu.'},
          {text:'Parādnieki šodien var saņemt pieklājīgu atgādinājumu ar smaidu, kas skaidri saka „es atceros”.',do:'Ieliec kalendārā „Parādu dienu” un nosvini to ar vienu ziņu.',avoid:'Mīkstiem mājieniem, kurus parādnieks var nesaprast vēl gadu.'}
        ],
        energy:[
          {text:'Jūtu centrifūga šodien griežas ar pilniem apgriezieniem. Pēc mazgāšanas cikla sev pienākas silta duša un klusums.',do:'Uzraksti dienas lielāko raizi uz lapiņas un aizsūti to uz miskasti.',avoid:'Pusnakts filozofijas par visām dzīves kļūdām.'},
          {text:'Burciņas bez vākiem un vāki bez burciņām var beidzot atvadīties. Liekais iet prom vieglāk nekā parasti.',do:'Iztīri telefona galeriju no divdesmit vienādām bildēm.',avoid:'Atgriešanās pie izmestā maisa „tikai paskatīties”.'},
          {text:'Vecs dators ielādējas ātrāk nekā šodien tavi spēki. Iedod sev laiku.',do:'Nosauc agru gulētiešanu par sistēmas atjauninājumu un ieslēdz to jau desmitos.',avoid:'Šausmu filmām pirms miega, ja rīt jāceļas agri.'}
        ]
      },
      { // 9
        headline:['Koferis jau gaida','Prāta ceļojums','Pasaule ir liela'],
        day:[
          'Mēness šodien atver iekšējo ceļojumu aģentūru. Pat brauciens uz otru pilsētas galu var likties kā ekspedīcija.',
          'Ziņkārība šodien aptver visu – no senās Ēģiptes līdz tam, kāpēc kaķi gāž lietas no galda.',
          'Putna lidojums šodien ir labākais skatpunkts. Var izrādīties, ka lielā problēma ir zirņa lielumā.'
        ],
        love:[
          {text:'„Kādreiz aizbrauksim uz Islandi” šodien skan kā romantiskākais teikums pasaulē – pat ja biļetes vēl nav.',do:'Iespraudiet kartē adatiņas vietās, kur gribat nokļūt – kaut vai tikai Jūrmalā.',avoid:'Strīdiem par to, kurš labāk orientējas.'},
          {text:'Svešs akcents skan pievilcīgāk par jebkuru mīlas dziesmu. Ļauj sev ieklausīties.',do:'Iemācies pateikt „labdien” vēl vienā valodā – nekad nevar zināt, kad noderēs.',avoid:'Iepazīšanās filtriem, kas stingrāki par robežkontroli.'},
          {text:'Atkritumu iznešanas grafiks šodien var pagaidīt – sarunai der lielāki temati, piemēram, kur jūs būsiet pēc desmit gadiem.',do:'Uzzīmējiet savu ideālo gadu uz salvetes – ar visu budžetu.',avoid:'Filozofiskām diskusijām, kas beidzas ar „tāpēc, ka tā ir”.'}
        ],
        work:[
          {text:'Kursi, kas jau gadu gaida tavās grāmatzīmēs, šodien sāk justies aizmirsti. Mācībām diena ir laba.',do:'Atver vienu grāmatzīmi un izej pirmo nodarbību vēl šovakar.',avoid:'Jaunu grāmatzīmju krāšanas mācīšanās vietā.'},
          {text:'Smaids tulko labāk par jebkuru vārdnīcu, pat ja angļu valoda klibo. Ārzemju kontakti atsaucas raitāk nekā parasti.',do:'Pārbaudi tulkošanas rīku ar jautru teikumu, pirms uzticies tam nopietnā vēstulē.',avoid:'Laika joslu aizmiršanas, zvanot uz otru pasaules malu.'},
          {text:'Budžets ceļojumam šodien nedrīkst izskatīties pēc zinātniskās fantastikas. Plāni kļūst nopietnāki, un tas ir labi.',do:'Ieslēdz biļešu cenu brīdinājumu un ļauj tam strādāt tavā vietā.',avoid:'Pusnakts rezervācijām ar sajūsmu un bez kalendāra.'}
        ],
        energy:[
          {text:'Navigācija šodien var palikt kabatā: maldīšanās pa nepazīstamām ielām uzlādē labāk par kafiju.',do:'Izkāp no transporta vienu pieturu agrāk un atklāj jaunu ielu.',avoid:'Maršruta „mājas–darbs–mājas” kā vienīgās dzīves kartes.'},
          {text:'Zinātkāre šodien ēd vairāk nekā parasti – baro to ar lekcijām, nevis ar ziņu lenti.',do:'Izvēlies lekciju vai filmu par tēmu, kuras nosaukumu vēl nespēj izrunāt.',avoid:'Diskusijām ar cilvēkiem, kuriem „viss jau sen ir skaidrs”.'},
          {text:'Šodienas lielākā kļūme jau pēc mēneša var kļūt par labāko stāstu vakariņās. Sāc smieties jau tagad – ietaupīsi laiku.',do:'Pieraksti dienas dīvaināko brīdi – tas būs materiāls nākamajam stāstam.',avoid:'Drāmām nepareizi saprastas ziņas dēļ.'}
        ]
      },
      { // 10
        headline:['Uz skatuves','Karjeras kāpnes sauc','Vadība skatās'],
        day:[
          'Skatlogā šodien ir tavs darbs, un garāmgājēji – arī vadība – skatās. Parūpējies, lai tas izskatās tikpat labi, cik tu patiesībā strādā.',
          'Karjeras navigācija šodien prasa jaunu galamērķi – vai vismaz pārliecību, ka tā vispār ir ieslēgta.',
          'Līdz ar atbildību tev šodien tiek arī skatuve. Ja kādreiz gribēji pacelt roku sapulcē, šī ir tā diena.'
        ],
        love:[
          {text:'Sirdij šodien arī vajag vietu tavā kalendārā – starp sapulcēm un termiņiem. Ieraksti to tikpat nopietni.',do:'Pārcel vienu sapulci, lai uz vakariņām paspētu laikā.',avoid:'Darba stāstiem vakariņās, kas ilgāki par pašām vakariņām.'},
          {text:'Labi izdevusies prezentācija šodien var piesaistīt ne tikai vadības uzmanību. Pārbaudi, vai kāds uz tevi neskatās ilgāk nekā uz slaidiem.',do:'Paliec uz kafiju pēc sapulces – tieši tur notiek interesantākās sarunas.',avoid:'Romantisku ziņu sūtīšanas darba e-pastā.'},
          {text:'Jautājums „Kur mēs būsim pēc pieciem gadiem?” šodien var izskanēt negaidīti. Labāk atbildēt nekā izlikties, ka zvana telefons.',do:'Parunā ar otru par plāniem – sāc ar nākamo atvaļinājumu.',avoid:'Atbildēm „gan jau redzēs” uz katru jautājumu par nākotni.'}
        ],
        work:[
          {text:'Aizņemta seja neko neiespaido – vadība pamana rezultātus. Labs brīdis tos parādīt.',do:'Sagatavo vienu slaidu ar skaitli, ar kuru lepojies.',avoid:'Atbildēm „strādāju pie tā”, ja neviens pie tā nestrādā.'},
          {text:'„Izdzīvot līdz piektdienai” vairs neder kā karjeras mērķis. Laiks domāt plašāk.',do:'Atjauno savu CV tā, it kā to lasītu sapņu darba devējs.',avoid:'Kafijas pauzēm, kas pārvērtušās par sūdzību klubu.'},
          {text:'Pie durvīm šodien klauvē atbildība. Atver, bet pārliecinies, ka tā nav atnesusi līdzi visa departamenta darbus.',do:'Pieņem vienu izaicinājumu, bet vispirms pajautā, cik tas maksās tavam vakaram.',avoid:'Termiņiem, kuriem vajadzīga laika mašīna.'}
        ],
        energy:[
          {text:'Iekšējais kafijas automāts šodien var turpināt darbu arī pēc pusnakts. Izslēdz to ar roku.',do:'Uzstādi darba dienas beigām modinātāju un paklausi tam.',avoid:'Klēpjdatora, kas vakarā ir vienīgais, kurš sēž tev klēpī.'},
          {text:'Mugura raksta sūdzību par krēslu. Atbildi tai ar izstaipīšanos.',do:'Izstaipies tā, it kā sniegtos pēc augstākā plaukta birojā.',avoid:'Sēdēšanas jautājuma zīmes pozā.'},
          {text:'Uzsist sev pa plecu šodien ir ne tikai atļauts, bet pat ieteicams – pleci būs pateicīgi par uzmanību.',do:'Nosvini šīs nedēļas mazāko uzvaru tā, it kā tā būtu lielākā.',avoid:'Citu panākumu skaitīšanas, kamēr savējie gaida rindā.'}
        ]
      },
      { // 11
        headline:['Bars kopā','Draugi ir zelts','Nākotnes vīzija'],
        day:[
          'Kā bišu strops šodien dūc draugu čats. Pievienojies – kopā rodas idejas, kas vienatnē paliktu dīvāna dziļumos.',
          'Sociālie tīkli atgādina dzimšanas dienas, bet ne draudzību. Šodien viens „kā iet?” var atdzīvināt to, ko sen nav sanācis kopt.',
          'Pasūtījums Visumam šodien tiek pieņemts – tikai uzraksti to salasāmi un ar konkrētu datumu.'
        ],
        love:[
          {text:'Labākais randiņš šodien var notikt draugu kompānijā – ar picu un skaļiem smiekliem.',do:'Uzaicini draugus pie sevis un ļauj viņiem izvēlēties mūziku.',avoid:'Pāru selfijiem, kuros draugi redzami tikai fonā.'},
          {text:'Iepazīšanās aģentūra „Draugi” strādā bez brīvdienām un komisijas maksas.',do:'Pastāsti draugiem, kāds humors tev patīk – aģentūrai vajag datus.',avoid:'Kritērijiem, kas izslēdz pusi pilsētas.'},
          {text:'Hobiji ir slepenais attiecību vitamīns: kad otrs atgriežas no sava, mājās ienāk labs noskaņojums.',do:'Uzdāvini otram brīvu vakaru hobijam – un neprasi atskaiti.',avoid:'Ziņām ik pēc desmit minūtēm „tikai pajautāt, kā tev iet”.'}
        ],
        work:[
          {text:'Futbola uzbrukums ir labākā komandas darba metafora – katram sava loma un kopīgi vārti.',do:'Atdod piespēli kolēģim, kurš sapulcēs parasti klusē.',avoid:'Solo driblinga līdz pašiem vārtiem, kad blakus ir brīvs spēlētājs.'},
          {text:'CV sver mazāk nekā viena laba saruna kafejnīcā. Iespējas bieži staigā pa paziņu lokiem.',do:'Ieminies paziņām, ko meklē – zīlēt kafijas biezumos viņi neprot.',avoid:'Tīklošanās pasākumiem, kuros runā tikai ar uzkodām.'},
          {text:'Sapnis par māju pie jūras sākas ar krājkasīti, nevis ar cerībām uz mantojumu.',do:'Uzlīmē uz krājkasītes sava sapņa nosaukumu.',avoid:'Draugu vakariem, kas beidzas ar „pēc tam sarēķināsim”.'}
        ],
        energy:[
          {text:'Lādētājs nav vajadzīgs, ja blakus ir pareizie cilvēki. Nepareizie gan iztukšo bateriju ātrāk par video straumi.',do:'Sarunā tikšanos ar cilvēku, pēc kura vienmēr sāp vaigi no smaidīšanas.',avoid:'Ballītēm, uz kurām ej tikai tāpēc, lai neizskatītos nepieklājīgi.'},
          {text:'Sērkociņu kastīšu kolekcionāri, putnu vērotāji vai adītāji – šodien jebkurš interešu klubs var uzlādēt labāk par kafiju.',do:'Aizej uz vienu interešu kluba tikšanos – kaut vai tikai paklausīties.',avoid:'Dīvāna kluba ar vienu biedru.'},
          {text:'Nākotne šodien izskatās kā laika prognoze mēnesim uz priekšu – interesanta, bet ne pārāk precīza.',do:'Uzraksti vēstuli sev nākotnē un ieliec to atvilktnē.',avoid:'Laika prognozes pārbaudīšanas desmit reizes dienā.'}
        ]
      },
      { // 12
        headline:['Režīms „netraucēt”','Pleds un klusums','Klusuma klubs'],
        day:[
          'Mēness šodien ieslēdz režīmu „netraucēt”. Pat kafijas automāts šķiet pārāk runīgs.',
          'Akumulators šodien rāda 15 %, un tas attiecas arī uz tevi. Taupības režīms ir pilnīgi normāls.',
          'Sestā maņa šodien strādā virsstundas. Ja tā saka „paliec mājās”, varbūt tai ir taisnība.'
        ],
        love:[
          {text:'Kopīga klusēšana šodien ir augstākā tuvības pakāpe – vārdi var atpūsties līdz rītam.',do:'Sarīkojiet klusuma sacensības – uzvar tas, kurš pirmais aizmieg.',avoid:'Ziņām „mums jāparunā” pēc desmitiem vakarā.'},
          {text:'Pagātne šodien var pieklauvēt atmiņās. Ļauj tai pabūt, bet veco numuru telefonā atstāj mierā.',do:'Izdzēs vienu vecu saraksti, kuru pārlasi biežāk, nekā vajadzētu.',avoid:'Bijušo attiecību bilžu pētīšanas sociālajos tīklos.'},
          {text:'Brīvai sirdij šodien labākais randiņš ir ar sevi – ar vannu, grāmatu un mīļāko mūziku.',do:'Nopērc sev ziedus vai saldumu bez īpaša iemesla.',avoid:'Romantiskām komēdijām, kas liek nopūsties biežāk nekā smieties.'}
        ],
        work:[
          {text:'Uzdevumi šodien virzās lēni kā gliemezis atvaļinājumā. Labā ziņa: arī gliemezis kādreiz nonāk galā.',do:'Nosvini katru pabeigto veco darbu kā finiša līniju.',avoid:'Jaunu projektu sākšanas, kamēr vecie vēl skatās uz tevi.'},
          {text:'Skatuve šodien var pagaidīt – labākās lietas top aizkulisēs starp kafiju un klusumu.',do:'Izveido nākamās nedēļas plānu, kamēr citi vēl ielādējas.',avoid:'Lielām prezentācijām dienā, kad balss gribētu čukstēt.'},
          {text:'Investīciju „ģēniji” no svešiem numuriem šodien var būt īpaši runīgi. Klausule ir tava labākā finanšu konsultante.',do:'Noliec klausuli katram, kurš sola „garantētu peļņu”.',avoid:'Pārskaitījumiem, kas veikti ar vienu roku un pusi uzmanības.'}
        ],
        energy:[
          {text:'Tehniskā apkope šodien ir ķermeņa prioritāte. Tas nav slinkums, bet serviss, kas pienākas katram.',do:'Ietinies pledā un ieslēdz statusu „bezsaistē līdz rītam”.',avoid:'Sarežģītiem vakara plāniem, kad baterija jau mirgo sarkanā.'},
          {text:'Spa diena var izmaksāt nulle eiro – pietiek izslēgt paziņojumus un aizvērt durvis.',do:'Iedzer tēju tādā klusumā, ka dzirdi, kā tā atdziest.',avoid:'Grupas čatiem ar 147 nelasītām ziņām.'},
          {text:'Holivudai šodien var rasties konkurence – tavi sapņi var būt spilgtāki par jebkuru filmu.',do:'Noliec blakus gultai bloknotu – nākamais bestsellers var atnākt naktī.',avoid:'Ziņu lasīšanas pusnaktī, ja gribi gulēt kā zīdainis.'}
        ]
      }
    ]
  }
};
