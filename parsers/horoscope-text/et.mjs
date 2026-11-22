// Estonian horoscope copy. Written natively; read HOROSCOPE_EDITORIAL_RULES.md before editing.
// Address the reader as „sina“; never assume a partner, children or a particular way of life.
const signs={
  nom:['Jäär','Sõnn','Kaksikud','Vähk','Lõvi','Neitsi','Kaalud','Skorpion','Ambur','Kaljukits','Veevalaja','Kalad'],
  // „Kuu on Sõnnis“.
  loc:['Jääras','Sõnnis','Kaksikutes','Vähis','Lõvis','Neitsis','Kaaludes','Skorpionis','Amburis','Kaljukitses','Veevalajas','Kalades'],
  // Movement uses the genitive with „märki“/„märgist“ („Päike läheb Amburi märki“), which avoids
  // ambiguous short illatives such as „Vähki“.
  gen:['Jäära','Sõnni','Kaksikute','Vähi','Lõvi','Neitsi','Kaalude','Skorpioni','Amburi','Kaljukitse','Veevalaja','Kalade']
};
const bodies={Sun:'Päike',Moon:'Kuu',Mercury:'Merkuur',Venus:'Veenus',Mars:'Marss',Jupiter:'Jupiter',Saturn:'Saturn'};
// Adessive „24. novembril“ and terminative „24. novembrini“.
const monthsAde=['jaanuaril','veebruaril','märtsil','aprillil','mail','juunil','juulil','augustil','septembril','oktoobril','novembril','detsembril'];
const monthsTer=['jaanuarini','veebruarini','märtsini','aprillini','maini','juunini','juulini','augustini','septembrini','oktoobrini','novembrini','detsembrini'];
const clock=hhmm=>{const [h,m]=hhmm.split(':');return `${Number(h)}.${m}`;};
const time=hhmm=>`kell ${clock(hhmm)}`;
const Time=hhmm=>`Kell ${clock(hhmm)}`;
const day=iso=>Number(iso.slice(8,10)),month=iso=>Number(iso.slice(5,7))-1;
const on=iso=>`${day(iso)}. ${monthsAde[month(iso)]}`;
const until=iso=>`${day(iso)}. ${monthsTer[month(iso)]}`;
const into=sign=>`${signs.gen[sign]} märki`;
const cap=text=>text.replace(/^./,c=>c.toUpperCase());

export default {
  lang:'et',
  signs,bodies,
  // Short names of the twelve whole-sign houses, used in the sky panel.
  houseNames:['isiksus ja meeleolu','raha ja väärtused','vestlused ja sõnumid','kodu ja pere','rõõm ja armastus','argipäev ja tervis','suhted ja partnerid','lähedus ja ühine raha','reisid ja õpingud','karjäär ja eesmärgid','sõbrad ja tulevik','puhkus ja sisemaailm'],
  sky:{
    labels:{moon:'Kuu',phase:'Faas',sun:'Päike',next_full:'Järgmine täiskuu',next_new:'Järgmine noorkuu',planets:'Planeedid',sign:'Sinu märk',theme:'Päeva teema'},
    phases:{new_moon:'Noorkuu',first_quarter:'Esimene veerand',full_moon:'Täiskuu',last_quarter:'Viimane veerand',waxing:'Kasvav kuu',waning:'Kahanev kuu'},
    elements:{fire:'Tulemärk',earth:'Maamärk',air:'Õhumärk',water:'Veemärk'},
    // Header chip, e.g. „Kuu Jääras · kell 12.10 Sõnni märki“.
    chip:segments=>[`${bodies.Moon} ${signs.loc[segments[0].sign]}`,...segments.slice(1).map(s=>`${time(s.from)} ${into(s.sign)}`)].join(' · '),
    // „Terve päeva Jääras (märki vahetab 22. novembril kell 12.10)“ or „Jääras, kell 12.10 läheb Sõnni märki“.
    moon:(segments,next)=>segments.length===1
      ?`Terve päeva ${signs.loc[segments[0].sign]} (märki vahetab ${on(next.date)} ${time(next.time)})`
      :cap([signs.loc[segments[0].sign],...segments.slice(1).map(s=>`${time(s.from)} läheb ${into(s.sign)}`)].join(', ')),
    // Percent sign with a non-breaking space („86 %“), as EKI recommends.
    phase:(id,illumination,event)=>event
      ?`${({new_moon:'Noorkuu',first_quarter:'Esimene veerand',full_moon:'Täiskuu',last_quarter:'Viimane veerand'})[event.id]} ${time(event.time)} ${signs.loc[event.sign]}`
      :`${id==='waxing'?'Kasvav':'Kahanev'} kuu, valgustatus ${illumination} %`,
    event:e=>`${on(e.date)} ${time(e.time)} ${signs.loc[e.sign]}`,
    sun:(sign,ingress,next)=>ingress
      ?`${signs.loc[ingress.from]}, ${time(ingress.time)} läheb ${into(ingress.to)}`
      :`${signs.loc[sign]} ${until(next.date)}`,
    planet:p=>{
      let text=p.ingress?`${signs.loc[p.ingress.from]}, ${time(p.ingress.time)} läheb ${into(p.ingress.to)}`:signs.loc[p.sign];
      if(p.station)text+=p.station.turns==='retrograde'?`; ${time(p.station.time)} muutub retrograadseks`:`; ${time(p.station.time)} lõpeb retrograadsus`;
      else if(p.retrograde)text+=', retrograadne';
      return text;
    },
    // „Tulemärk, valitsejaplaneet Marss (praegu Jääras)“.
    sign:(element,ruler,rulerSign)=>`${element}, valitsejaplaneet ${bodies[ruler]} (praegu ${signs.loc[rulerSign]})`,
    theme:(house,name)=>`${cap(name)} – Kuu sinu ${house}. majas`
  },
  serious:{
    // One sentence about an exact sky event; the house text follows it.
    events:{
      sunOwn:e=>`${Time(e.time)} jõuab Päike sinu märki – algab sinu sünnipäevakuu ja järgmistel nädalatel võib jõudu olla tavalisest rohkem.`,
      sunIngress:e=>`${Time(e.time)} läheb Päike ${into(e.to)}: järgmised neli nädalat kannavad selle märgi pitserit.`,
      fullMoon:e=>e.own
        ?`${Time(e.time)} on täiskuu sinu märgis: tunded võivad olla eredamad ja see on hea hetk midagi lõpetada, mitte alustada.`
        :`${Time(e.time)} on täiskuu ${signs.loc[e.sign]} ja tunded võivad täna kõlada tavalisest valjemini.`,
      newMoon:e=>e.own
        ?`${Time(e.time)} on noorkuu sinu märgis – hea hetk mõelda, mida tahad järgmisel kuul enda heaks teha.`
        :`${Time(e.time)} on noorkuu ${signs.loc[e.sign]}: sobiv aeg plaane sõnastada, mitte suuri otsuseid langetada.`,
      station:e=>({
        Mercury:{retrograde:'muutub Merkuur retrograadseks: järgmistel nädalatel tasub sõnumeid, lepinguid ja reisiplaane kaks korda kontrollida.',direct:'lõpeb Merkuuri retrograadsus ning takerdunud vestlused ja plaanid hakkavad tasapisi liikuma.'},
        Venus:{retrograde:'muutub Veenus retrograadseks: vanad tunde- ja rahaküsimused võivad uuesti üles kerkida ja lõpuks lahenduse leida.',direct:'lõpeb Veenuse retrograadsus ning otsused tunnete ja ostude kohta muutuvad selgemaks.'},
        Mars:{retrograde:'muutub Marss retrograadseks: jõudu tasub suunata alustatu lõpetamisse, mitte uutesse lahingutesse.',direct:'lõpeb Marsi retrograadsus ja seisma jäänud asjad saavad jälle hoo sisse.'}
      })[e.body][e.turns].replace(/^/,`${Time(e.time)} `),
      moonChange:e=>`${Time(e.time)} liigub Kuu ${signs.gen[e.from]} märgist ${into(e.to)}.`
    },
    headlines:{sunOwn:'Päike sinu märgis',fullMoonOwn:'Täiskuu sinu märgis',newMoonOwn:'Uus algus sinu märgis'},
    // Twelve whole-sign houses of the day's main Moon sign, counted from the reader's sign.
    // Each list has three entries; entry n of every list is used on the same day.
    houses:[
      { // 1: the Moon in the reader's sign
        headline:['Sinu päev','Jõud on sinu poolel','Alusta iseendast'],
        day:[
          'Sisemine kompass näitab täna selgemalt kui tavaliselt, kuhu sa tegelikult tahad. Vali üks asi, mida oled ammu teha tahtnud, ja astu esimene samm.',
          'Hommikune meeleolu kipub täna andma tooni kogu päevale. Alusta millestki, mis sind rõõmustab – kas või kümnest vaiksest minutist kohvitassiga akna all.',
          'Sinu enda soovid väärivad täna esikohta. Enne kui ütled teistele „jah“, küsi endalt, kas see sobib ka sulle.'
        ],
        love:[
          {text:'Soojus, mida täna välja kiirgad, on kaugele näha ja inimesed reageerivad sulle kergemini. Kui tahad kellelegi kirjutada või kedagi kuhugi kutsuda, pole vaja oodata täiuslikku hetke.',do:'Võta ühendust inimesega, kellele oled ammu mõelnud.',avoid:'Enda võrdlemist kellegi teise suhte või sotsiaalmeedia piltidega.'},
          {text:'Tunnetest rääkimine tuleb täna lihtsamalt ja sind kuulatakse tähelepanelikumalt. Keskendu oma vajadustele, mitte sellele, mida teine valesti teeb.',do:'Sõnasta ühe lausega, mida sa praegu kõige rohkem vajad.',avoid:'Etteheiteid, mis algavad sõnadega „sa alati“.'},
          {text:'Pisiasjad võivad täna riivata rohkem kui muidu. Enne kui midagi isiklikult võtad, tuleta meelde, et ka teisel võib olla raske päev.',do:'Tee kellelegi lähedasele tass teed ja küsi, kuidas ta end tunneb.',avoid:'Tujude väljaelamist inimese peal, kes juhtub olema kõige lähemal.'}
        ],
        work:[
          {text:'Algatusvõime töötab täna sinu kasuks. Kui midagi on ammu seisnud, võid just sina olla see, kes asja liikuma paneb.',do:'Võta ette üks asi, mis ootab kellegi otsustavat sammu.',avoid:'Pooliku plaaniga tormamist, kui veidi ettevalmistust tuleks kasuks.'},
          {text:'Kõige paremini sujuvad täna ülesanded, kus saad ise otsustada. Sinu enda rütm ja töövõtted toovad praegu parima tulemuse.',do:'Pane kirja tänase päeva kolm tähtsamat tööd ja alusta esimesest.',avoid:'Loa küsimist asjades, mis on ammu sinu otsustada.'},
          {text:'Meeleolu võib täna mõjutada otsuseid rohkem kui numbrid. Suurema ostu või lepingu juurde tasub naasta, kui emotsioonid on vaibunud.',do:'Kontrolli iga suuremat rahaotsust numbrite, mitte tunde järgi.',avoid:'Lepingute allkirjastamist ärritatud või ülevas meeleolus.'}
        ],
        energy:[
          {text:'Jõudu on täna rohkem kui tavaliselt ja keha tahab liikuda. Trepid lifti asemel, jalgsi tehtud käik või lihtsalt kiirem samm annavad hoogu juurde.',do:'Vali täna üks liikumine, mis teeb rõõmu ega tundu kohustusena.',avoid:'Terve päeva istumist samas asendis.'},
          {text:'Uni ja päevarütm mõjutavad täna enesetunnet rohkem kui tavaliselt. Rahulik päevakava ilma suurte hüpeteta hoiab jõu ühtlasena.',do:'Võta hommikul aega korralikuks hommikusöögiks.',avoid:'Liiga paljude plaanide kokkuleppimist ühte õhtusse.'},
          {text:'Märkad täna selgemini kui tavaliselt, mis sulle hästi mõjub ja mis mitte. Usalda seda tunnet ka õhtuplaane tehes.',do:'Tee õhtul seda, mis sind kindlasti rahustab – olgu see vann, raamat või jalutuskäik.',avoid:'Kohustusi, mille võtad enda peale ainult viisakusest.'}
        ]
      },
      { // 2: money, values, comfort
        headline:['Raha vajab tähelepanu','Kindel vundament','Mis on päriselt oluline'],
        day:[
          'Rahaasjad tulevad täna esile. Kümme rahulikku minutit pangakonto ülevaatamiseks võib anda rohkem kindlustunnet kui terve nädal muretsemist.',
          'Täna kaalub kindlustunne rohkem kui uudsus. Tee midagi, mis muudab argipäeva mugavamaks: paranda ära ammu katki olnud asi või korrasta oma lemmiknurk.',
          'Päev küsib vaikselt, mille eest sa tegelikult oma aega ja raha annad. Kui vastus üllatab, on see hea põhjus midagi muuta.'
        ],
        love:[
          {text:'Hoolivust on täna lihtsam näidata tegude kui sõnadega. Mõtle, mis teeks kellegi lähedase päeva päriselt kergemaks.',do:'Tee kellelegi lähedasele väike praktiline üllatus.',avoid:'Kalleid žeste, mida hiljem kahetsed.'},
          {text:'Turvatunne suhetes muutub täna eriti tähtsaks. Kui midagi jääb puudu, saab sellest rääkida rahulikult ja konkreetselt.',do:'Räägi kellelegi lähedasele, mis aitab sul end turvaliselt tunda.',avoid:'Armastuse mõõtmist kingituste hinnaga.'},
          {text:'Kui jagad kellegagi kodu või eelarvet, võivad rahateemad täna tuju mõjutada rohkem, kui tahaks. Hea kokkulepe säästab nii raha kui ka närve.',do:'Pane ühised kulud ühte tabelisse, et mõlemad näeksid sama pilti.',avoid:'Suuremaid ühiseid oste ilma eelneva aruteluta.'}
        ],
        work:[
          {text:'Numbritega seotud tööd sujuvad täna hästi. Hinnad, pakkumised ja eelarved on praegu sinu tugev külg.',do:'Koosta selle kuu tulude ja kulude lühike ülevaade.',avoid:'Arveid, mis jäävad avamata „küll homme“ hunnikusse.'},
          {text:'Kui oled ammu mõelnud palgaläbirääkimistele või hinna tõstmisele, kõlavad sinu argumendid täna veenvamalt. Rahulik ja konkreetne toon mõjub paremini kui pikk põhjendamine.',do:'Uuri välja, kui palju sarnase töö eest mujal makstakse.',avoid:'Oma töö hinna alandamist juba enne, kui keegi on küsinud.'},
          {text:'Täna kipub ostukorvi rändama kõik, mis lubab mugavust. Lase otsusel enne maksmist üks öö seista.',do:'Võrdle enne suuremat ostu vähemalt kahte pakkumist.',avoid:'Oste ainult sellepärast, et on allahindlus.'}
        ],
        energy:[
          {text:'Keha igatseb täna mugavust: sooja toitu, pehmeid riideid ja rahulikku tempot. Anna talle seda ja jõud tuleb kiiremini tagasi.',do:'Valmista endale midagi sooja ja maitsvat.',avoid:'Kiirustamist asjadega, mis võiksid rahulikult oodata.'},
          {text:'Täna rõõmustavad eriti asjad, mida saab tunda meeltega: lõhnad, maitsed, puudutused. Väike hellitus meeltele teeb kogu päeva paremaks.',do:'Kuula üks album algusest lõpuni, ilma et teeksid samal ajal midagi muud.',avoid:'Kõigi väikeste rõõmude edasilükkamist nädalavahetusse.'},
          {text:'Stabiilsus annab täna rohkem jõudu kui vaheldus. Tuttav rütm ja korrapärased söögiajad aitavad end paremini tunda.',do:'Pea kinni oma õhtusest rituaalist – tee, raamat või jalutuskäik.',avoid:'Päevakava, kuhu ei mahu isegi lõuna.'}
        ]
      },
      { // 3: conversations, messages, short trips, learning
        headline:['Sõnad leiavad tee','Päev vestlusteks','Uudishimu juhib'],
        day:[
          'Mõtted ja sõnumid liiguvad täna kiiremini kui tavaliselt. Hea päev teha see kõne, mida oled edasi lükanud, või saata sõnum, mida oled peas juba ammu sõnastanud.',
          'Jutuajamised lähikonnas elavnevad täna – olgu naabrite, õdede-vendade või kolleegidega. Juhuslik vestlus koridoris või õues võib anda kasuliku vihje.',
          'Täna tasub küsida rohkem, kui tavaliselt julged. Loe läbi artikkel, mis on ammu brauseris lahti, või uuri kelleltki, kuidas ta midagi teeb – väike uus teadmine teeb päeva värskemaks.'
        ],
        love:[
          {text:'Kerge vestlus loob täna rohkem lähedust kui suur žest. Paar sooja lauset keset päeva võivad meelde jääda kauemaks, kui arvad.',do:'Uuri kelleltki, kes sulle meeldib, kuidas tema päev läheb – ja kuula vastust.',avoid:'Tõsiste tunnete arutamist kiirsõnumites.'},
          {text:'Vestlus võib täna minna sügavamale kui tavaliselt. Alusta küsimusest, mitte järeldusest, ja jutt jääb soojaks.',do:'Küsi kelleltki lähedaselt midagi, mida sa pole temalt kunagi küsinud.',avoid:'Vestlusi, kus mõlemad räägivad ja keegi ei kuula.'},
          {text:'Tutvus võib täna alata lühikesest jutust järjekorras, bussis või kursusel. Ole avatud ka inimestele väljastpoolt oma tavapärast ringi.',do:'Alusta juttu kellegagi, keda oled seni ainult tervitanud.',avoid:'Kiireid hinnanguid esimese mulje põhjal.'}
        ],
        work:[
          {text:'Läbirääkimised ja kirjavahetus sujuvad täna hästi. Sõnasta oma ettepanek lühidalt ja lisa üks konkreetne näide.',do:'Vasta täna kõige kauem oodanud kirjale.',avoid:'Pikki kirju, mille mõte selgub alles viimases lõigus.'},
          {text:'Õppimine ja uued oskused tasuvad täna kiiresti ära. Pool tundi head juhendit võib säästa terve päeva pusimist.',do:'Õpeta kellelegi seda, mida just ise õppisid – nii jääb see paremini meelde.',avoid:'Uue oskuse proovimist kohe kõige tähtsama ülesande peal.'},
          {text:'Lühikesed sõidud ja kohtumised silmast silma lahendavad täna rohkem kui pikk kirjavahetus. Mõni asi saab paika ühe käiguga.',do:'Aja üks asi ära kohapeal, selle asemel et sellest veel üks kiri saata.',avoid:'Kohtumisi, millel pole selget eesmärki ega lõpuaega.'}
        ],
        energy:[
          {text:'Pea töötab täna kiirel käigul ja õhtuks võib see väsitada. Mõni minut akna all või õues aitab mõtetel settida.',do:'Tee midagi kätega, näiteks pese nõusid või korista lauda, ja lase peal puhata.',avoid:'Pidevat ühelt ülesandelt teisele hüppamist.'},
          {text:'Keha ja pea tahavad täna koos liikuda. Rattasõit, ujumine või tants teeb ka mõtted selgemaks.',do:'Vali täna liikumine, mille ajal saad mõtetel vabalt joosta lasta.',avoid:'Mõtete sundimist, kui lahendus tahab veel küpseda.'},
          {text:'Uudiseid, sõnumeid ja arvamusi on täna rohkem, kui üks pea jaksab. Sina otsustad, millele oma tähelepanu annad.',do:'Vali päevas kaks kindlat aega, mil sõnumeid ja kirju vaatad.',avoid:'Vaidlusi võõrastega sotsiaalmeedias.'}
        ]
      },
      { // 4: home, family, roots, privacy
        headline:['Hubasuse päev','Juured kutsuvad','Oma rahu, oma pesa'],
        day:[
          'Tähelepanu kipub täna liikuma koju ja lähedastele. Hea päev teha oma elupaik natuke hubasemaks – piisab ka värsketest lilledest või korrastatud riiulist.',
          'Täna tõmbab mõte juurte poole: lapsepõlve maitsed, perelood ja paigad, kust oled pärit. Kirjuta üles mõni lugu, mida kuulsid lapsena, enne kui see ununeb.',
          'Omaette olemine on täna sama oluline kui seltskond. Luba endale õhtu, mil keegi sinult midagi ei oota, ja kodu saab jälle laadimisjaamaks.'
        ],
        love:[
          {text:'Lähedus tekib täna kodustes pisiasjades: jagatud tekk, pikk jutt või vaikus, mis ei vaja täitmist. Suured plaanid võivad oodata.',do:'Kutsu keegi kallis külla – kas või lihtsalt teed jooma.',avoid:'Ühist õhtut, mille kumbki veedab oma ekraani taga.'},
          {text:'Märka täna, kes sinu kodus või lähedaste seas vajab veidi rohkem tähelepanu. Mõnikord piisab sellest, kui lihtsalt kõrval istud.',do:'Paku kellelegi lähedasele abi mõnes väikeses koduses asjas.',avoid:'Nõuandeid, mida keegi ei küsinud.'},
          {text:'Kodutunne ei sõltu täna sellest, kui palju inimesi on ümber. Kui elad üksi, väärib hoolt ka sinu enda seltskond; kui mitte, leia kodus nurk, mis on ainult sinu.',do:'Kata õhtusöögiks laud ilusti, isegi kui see on ainult sinu jaoks.',avoid:'Kodu täitmist asjadega, mis sulle tegelikult ei meeldi.'}
        ],
        work:[
          {text:'Kodused mured ja plaanid võivad täna tööpäeva sisse trügida. Sea selge piir: tööajal töö, pärast seda kodu.',do:'Lõpeta tööpäev kindla rituaaliga, näiteks laua koristamisega.',avoid:'Kodu- ja tööasjade ajamist läbisegi, nii et kumbki ei saa valmis.'},
          {text:'Rahulik tempo toob täna paremaid tulemusi kui kiirustamine. Üks korralikult tehtud asi on väärt rohkem kui viis poolikut.',do:'Lülita tunniks välja kõik teavitused ja tee üks asi algusest lõpuni.',avoid:'Mitme ülesande korraga tegemist, kui üks vajab täit tähelepanu.'},
          {text:'Rahaotsused, mis puudutavad kodu, vajavad täna aega. Suurem ost või remont õnnestub paremini, kui see on enne paberil läbi arvutatud.',do:'Küsi enne suuremat kodukulutust nõu kelleltki, kes on sarnase asja juba ära teinud.',avoid:'Kiireid remondi- ja mööbliotsuseid.'}
        ],
        energy:[
          {text:'Jõud tuleb täna tagasi pigem kodus kui väljas. Soe toit, lemmiktool ja varajane õhtu teevad rohkem kui suured plaanid.',do:'Mine täna varakult koju ja jäta õhtu plaanideta.',avoid:'Pikka telefonikõnet, mis võtab viimased jõuvarud.'},
          {text:'Mälestused ja pereasjad võivad täna puudutada tavalisest rohkem. Lase tunnetel olla, ilma et peaksid neid kohe lahendama.',do:'Kirjuta üles kolm asja, mille eest oled oma lähedastele tänulik.',avoid:'Vanade haavade lahtikiskumist hilisõhtul.'},
          {text:'Valgus ja värske õhk teevad kodus täna imesid. Isegi kimp oksi vaasis või puhtaks pestud aken muudab tuju heledamaks.',do:'Tuuluta enne magamaminekut magamistuba korralikult.',avoid:'Suurpuhastuse alustamist kell kümme õhtul.'}
        ]
      },
      { // 5: romance, pleasure, creativity, play
        headline:['Rõõm on lubatud','Käed tahavad luua','Elamuste päev'],
        day:[
          'Rõõm, mängulisus ja romantika on täna esiplaanil. Vali üks väike nauding ja anna sellele päriselt aega.',
          'Loovus otsib täna väljapääsu. Proovi uut retsepti, mängi pilli või tee midagi oma kätega – tähtis on tegemise rõõm, mitte tulemus.',
          'Kultuur ja meelelahutus annavad täna rohkem kui tavaliselt. Mine kontserdile, kinno või näitusele – üksi või hea seltskonnaga.'
        ],
        love:[
          {text:'Romantikal ja flirdil on täna hea tuul. Julgus näidata oma huvi leiab tõenäoliselt vastukaja.',do:'Ütle kellelegi, et ta sulle meeldib – lihtsalt ja ilma pika sissejuhatuseta.',avoid:'Ootusi, et esimene kohtumine peab olema täiuslik.'},
          {text:'Romantikasse mahub täna rohkem üllatusi kui tavaliselt. Kui oled suhtes, too argipäeva midagi ootamatut; kui oled vaba, jäta uks lahti ka tähelepanule, mida ei oodanud.',do:'Planeeri üks õhtu nii, nagu oleks see esimene kohting.',avoid:'Kõige tuttavama valimist ainult harjumusest.'},
          {text:'Tunded tulevad täna kergesti ja soojus jõuab teisteni ilma pingutuseta. Näita välja, mis sind rõõmustab.',do:'Kirjuta kellelegi paar rida sellest, mida sa temas imetled.',avoid:'Kiirustamist suurte lubadustega, kui tunded on alles värsked.'}
        ],
        work:[
          {text:'Tööle võib täna olla raske keskenduda, sest süda on mujal. Lühikesed tööplokid ja vahepealsed pausid aitavad rohkem kui sundimine.',do:'Jaga töö poole tunni pikkusteks juppideks ja puhka iga jupi järel hetke.',avoid:'Tähtsate kirjade saatmist ilma neid üle lugemata.'},
          {text:'Loovust nõudvad ülesanded sujuvad täna paremini kui rutiinsed. Vana probleem võib lahenduse saada, kui vaatad seda hoopis teise nurga alt.',do:'Joonista probleem paberile skeemina, enne kui hakkad seda lahendama.',avoid:'Esimese idee juurde jäämist ainult sellepärast, et see tuli esimesena.'},
          {text:'Meelelahutus ja hobid võivad täna rahakotti rohkem kergendada, kui plaanisid. Pane enne väljaminekut paika summa, mida oled valmis kulutama.',do:'Otsi välja üks tasuta üritus, mis pakub sama palju rõõmu.',avoid:'Ostmist ainult selleks, et teistega sammu pidada.'}
        ],
        energy:[
          {text:'Elurõõm annab täna palju energiat. Keha tahab liikuda nii, et sellest on lõbu – pallimängu, ujumise või pika jalutuskäiguga.',do:'Võta keegi kaasa sulgpalli, keeglit või lauatennist mängima.',avoid:'Liigset pingutamist ainult selleks, et kellelegi midagi tõestada.'},
          {text:'Käeline tegevus laeb täna akusid paremini kui diivanil lesimine. Isegi pool tundi armastatud hobiga teeb päeva heledamaks.',do:'Mine mõnda töötuppa või proovitundi, mis on ammu huvi pakkunud.',avoid:'Hobi muutmist järjekordseks kohustuseks, kus peab olema parim.'},
          {text:'Mängurõõm on täna lubatud ja isegi kasulik. Kui sul on lapsi või väikesi sugulasi, liitu nende mänguga; kui mitte, leia oma mänguväljak.',do:'Mängi kellegagi lauamängu või kaardimängu.',avoid:'Oma rõõmu pidurdamist mõttega, mida teised arvavad.'}
        ]
      },
      { // 6: routine, tasks, health habits, colleagues
        headline:['Kord loob vabaduse','Argipäeva meistriklass','Samm-sammult'],
        day:[
          'Argipäeva kord ja tööülesanded nõuavad täna tähelepanu. Tee päevakavas üks väike, kuid püsiv muudatus – näiteks kümme minutit õhtust ettevalmistust järgmiseks päevaks.',
          'Lihtsad asjad annavad täna rahulolu: õigel ajal söödud lõuna, tehtuks märgitud ülesanne, õhtuks valmis pandud riided. Väike kord loob ruumi suurematele mõtetele.',
          'Igapäevased harjumused on täna luubi all. Märka, mis sind päeva jooksul väsitab rohkem, kui peaks, ja muuda üht asja – mitte kõike korraga.'
        ],
        love:[
          {text:'Hoolimine väljendub täna igapäevastes asjades: tass teed, ära tehtud käik, meeles peetud pisiasi. Suuri sõnu pole vaja.',do:'Jäta kellelegi lähedasele hommikul väike soe märkus või sõnum.',avoid:'Pisiasjade kallal norimist, kui päev on niigi pikk.'},
          {text:'Argipäeva kiirus võib täna jätta tunnetele vähe ruumi. Kui sul on kiire, ütle seda otse – vaikus võib tunduda külmusena.',do:'Leia õhtul kümme minutit, et kellegi lähedasega rahulikult rääkida.',avoid:'Kallite inimeste kohtlemist nagu järjekordset punkti ülesannete nimekirjas.'},
          {text:'Hoolivus ei pea täna olema romantiline, et südant soojendada. Ka tavaline viisakus poes, tööl või trepikojas võib kellegi päeva paremaks muuta.',do:'Ütle aitäh kellelegi, keda näed iga päev, millegi eest, mis jääb muidu märkamata.',avoid:'Kiirustamist, mis jätab tervituse ja aitäh ütlemata.'}
        ],
        work:[
          {text:'Tugev päev töö tegemiseks: keskendumine on terav ja ülesanded laabuvad. Pikemat süvenemist nõudev töö sobib praegu eriti hästi.',do:'Tee esimese tunni jooksul ära kõige olulisem ülesanne.',avoid:'Väikeste asjadega nokitsemist, kui suur töö ootab.'},
          {text:'Täna aitab hea süsteem rohkem kui suur pingutus. Mõni lihtne kord – kus asjad asuvad, millal kirjadele vastad – säästab hiljem palju närvi.',do:'Vali üks korduv töö ja kirjuta selle sammud lühidalt üles.',avoid:'Iga uue kirja peale hüppamist, kui pooleli on tähtsam töö.'},
          {text:'Koostöö kolleegidega laabub täna hästi, kui rollid on selged. Iga inimene teeb parima töö seal, kus ta tunneb end kindlalt.',do:'Küsi kolleegilt, millega saaksid tema tööd lihtsamaks teha.',avoid:'Teiste töö kritiseerimist enne, kui oled küsinud, miks see nii on tehtud.'}
        ],
        energy:[
          {text:'Tempo võib täna märkamatult liiga kiireks minna. Paar lühikest pausi päeva jooksul aitavad rohkem kui üks pikk puhkus õhtul.',do:'Venita pärast lõunat kümme minutit või käi paar korda trepist üles ja alla.',avoid:'Kõigi pauside edasilükkamist, kuni „see üks asi“ on valmis.'},
          {text:'Uus harjumus juurdub täna kergemini, kui see on väike ja lihtne. Vali see, mis sobib sinu päeva ilma pingutuseta.',do:'Seo uus harjumus millegagi, mida teed niikuinii, näiteks paar kükki hommikukohvi oodates.',avoid:'Enda kritiseerimist iga vahelejäänud päeva pärast.'},
          {text:'Kindel rütm toetab täna enesetunnet rohkem kui eriline pingutus. Söö, liigu ja puhka enam-vähem samadel kellaaegadel.',do:'Pane kalendrisse kindel aeg lõunaks ja pea sellest kinni.',avoid:'Magamamineku lükkamist iga õhtu veidi hilisemaks.'}
        ]
      },
      { // 7: partner, one-to-one, agreements
        headline:['Kahekesi on kergem','Kohtumine poolel teel','Õppetund teistelt'],
        day:[
          'Kuu suunab täna tähelepanu kahe inimese vahelistele suhetele: paarisuhtele, sõprusele või tööpartnerlusele. Otsi lahendust, mis sobib mõlemale, mitte ainult sulle.',
          'Teistega on täna lihtsam ühist keelt leida. Kui midagi on kaua õhus rippunud, on hea hetk see rahulikult selgeks rääkida.',
          'Mõni kohtumine võib täna öelda midagi olulist sinu enda kohta. Kui keegi ärritab, küsi endalt, mida see olukord õpetab.'
        ],
        love:[
          {text:'Tugev päev suheteks: mõistmine tuleb lihtsamalt ja soojad sõnad jõuavad pärale. Uus tutvus võib olla olulisem, kui esmapilgul paistab.',do:'Kutsu keegi kallis jalutama ja lase jutul ise suund leida.',avoid:'Kiirustamist, kui teine tahab rääkida millestki olulisest.'},
          {text:'Kokkulepe, kus kumbki ei pea alla andma, on täna käeulatuses. Hea kompromiss ei tähenda, et keegi kaotab.',do:'Paku ise välja kaks võimalust ja lase teisel valida.',avoid:'Vanade vigade meenutamist uue kokkuleppe ajal.'},
          {text:'Pühendumine ja usaldus on täna esiplaanil. Iga antud lubadus kaalub praegu tavalisest rohkem, nii et anna ainult neid, mida suudad pidada.',do:'Pea kinni ühest väikesest lubadusest, mille oled kellelegi andnud.',avoid:'Suuri sõnu, mille taga pole tegusid.'}
        ],
        work:[
          {text:'Koostöö ja läbirääkimised sujuvad täna hästi. Partner või klient on avatum, kui näitad, et oled tema muret päriselt kuulnud.',do:'Korda enne oma pakkumist teise poole soovid tema enda sõnadega üle.',avoid:'Kõige olulisema tingimuse jätmist viimasele minutile.'},
          {text:'Lepingud ja kokkulepped vajavad täna selgust. Mida täpsemalt on kirjas, kes mida ja millal teeb, seda vähem tuleb hiljem vaielda.',do:'Küsi üle iga tingimus, mille tähendus pole sulle päris selge.',avoid:'Tähtaegu, mida keegi pole kokku leppinud, vaid ainult eeldanud.'},
          {text:'Hea partner teeb töö täna poole kergemaks. Kahe inimese tugevused kokku annavad rohkem kui kumbki üksi.',do:'Jaga suurem töö kellegagi pooleks ja lepi kokku vahetähtaeg.',avoid:'Iga detaili ülekontrollimist, kui oled töö juba teisele usaldanud.'}
        ],
        energy:[
          {text:'Sinu enda vajadused võivad täna jääda teiste omade varju. Aitamine annab jõudu ainult siis, kui see ei toimu sinu enda arvelt.',do:'Ütle täna vähemalt korra sõbralikult, aga kindlalt „mitte praegu“.',avoid:'Teiste murede lahendamist enne, kui nad on abi palunud.'},
          {text:'Keerulised vestlused võivad täna kehas tunda anda – kokku surutud lõualuu või pinnapealse hingamisena. Lühike liikumispaus aitab pinget lahti lasta.',do:'Hinga enne keerulist vestlust paar korda sügavalt sisse ja välja.',avoid:'Pingelisi vestlusi tühja kõhuga või väsinuna.'},
          {text:'Mõni inimene annab jõudu juurde, mõni võtab ära – täna on see vahe eriti tuntav. Tähtis pole seltskonna suurus, vaid see, kuidas end selles tunned.',do:'Vaata, pärast milliseid kohtumisi on sul rohkem jõudu, ja vali neid sagedamini.',avoid:'Vaikimist, kui keegi sinu piire korduvalt ületab.'}
        ]
      },
      { // 8: intimacy, trust, shared money, letting go
        headline:['Sisemine selgus','Ühine raha selgeks','Kergem pagas'],
        day:[
          'Mõtted liiguvad täna pinna alla. Küsi endalt otse: mis on päriselt oluline ja mida võiks lõpuks lahti lasta?',
          'Kui ühised kulud ja kohustused on paberil, väheneb mure sageli juba poole võrra. Hea päev panna numbrid ritta.',
          'Vanadest ootustest on täna kergem vabaneda. Mõni kohustus, mida sul enam vaja pole, võib vaikselt minna, ilma et peaksid seda kellelegi põhjendama.'
        ],
        love:[
          {text:'Ausus pisiasjades loob täna rohkem lähedust kui suured sõnad. Mida vähem pead teesklema, seda soojemaks suhe muutub.',do:'Ole aus ka siis, kui vastus pole kõige mugavam.',avoid:'Teise proovilepanekut, et näha, kas ta hoolib.'},
          {text:'Kirg ja tunded võivad täna olla tavalisest eredamad. See on aus ja elav, aga suured otsused tasub teha siis, kui torm on vaibunud.',do:'Lase tunnetel enne tähtsat vestlust tund aega settida.',avoid:'Ultimaatumeid, mida sa tegelikult ei mõtle.'},
          {text:'Vana mälestus võib täna meelde tulla ja küsida, kas sellega on veel midagi pooleli. Tihti piisab, kui lased sellel tänuga minna.',do:'Saada tänusõnum kellelegi, kes on sind minevikus aidanud.',avoid:'Mineviku ilustamist ainult sellepärast, et olevik tundub keeruline.'}
        ],
        work:[
          {text:'Ühised rahaasjad ja laenud vajavad täna ettevaatlikkust. Suuremad rahalised otsused on targem teha siis, kui kõik numbrid on laual.',do:'Pane kirja, kes kellele ja kui palju võlgneb – ka väikesed summad.',avoid:'Ühise raha kasutamist ilma teisega kokku leppimata.'},
          {text:'Varjatud kulud või kasutamata võimalused võivad täna nähtavale tulla. Kasu on sellest, kui vaatad detaile rahulikult.',do:'Vaata üks eelarve või arve rida-realt läbi.',avoid:'Kohest nõusolekut, kui sulle mõtlemisaega ei anta.'},
          {text:'Tööl võib täna esile kerkida usalduse küsimus: kes mida teab ja kellele mida usaldad. Hoia konfidentsiaalne info kindlas kohas.',do:'Kontrolli üle, kellel on ligipääs sinu tööfailidele.',avoid:'Ülemäärast usaldust veel tundmatute koostööpartnerite vastu.'}
        ],
        energy:[
          {text:'Emotsionaalne koormus võib täna olla suurem, kui väljast paistab. Anna endale luba võtta asju aeglaselt.',do:'Kirjuta õhtul paberile, mis sind täna kõige rohkem puudutas.',avoid:'Raskete teemade arutamist vahetult enne magamaminekut.'},
          {text:'Keha ja meel vajavad täna kergust. Mõni ootus, mille oled endale seadnud, võib rahulikult ootama jääda.',do:'Kriipsuta tänaselt nimekirjalt maha üks asi, mis pole tegelikult vajalik.',avoid:'Täiuslikkuse nõudmist endalt väsinud päeval.'},
          {text:'Taastumine võtab täna rohkem aega kui tavaliselt. Kui jõudu on vähem, on see märk aeglustada, mitte nõrkus.',do:'Jäta päevakavasse paar tühja akent, mida saab täita vastavalt enesetundele.',avoid:'Tähtsate asjade jätmist päeva viimasele tunnile.'}
        ]
      },
      { // 9: travel, study, the wider view
        headline:['Laiem vaade','Silmapiir avaneb','Tähendus ja suund'],
        day:[
          'Pilk tõuseb täna igapäevaste ülesannete kohale. Hea hetk mõelda õpingutele, kaugematele plaanidele või sellele, mis annab elule laiema mõõtme.',
          'Soov õppida midagi uut või kuulda teistsugust vaatenurka on täna tugev. Raamat, loeng või vestlus kellegagi teisest kultuurist võib anda värske mõtte.',
          'Päev sobib mõtisklemiseks selle üle, mis sulle päriselt korda läheb ja kuhu tahad liikuda. Vastus ei pea olema valmis – piisab, kui küsimus on õige.'
        ],
        love:[
          {text:'Kaugemad plaanid ja ühised väärtused lähendavad täna rohkem kui argiasjad. Hea päev rääkida sellest, mis sind elus päriselt kõnetab.',do:'Soovita kellelegi kallile raamatut või filmi, mis on sind muutnud.',avoid:'Suurte tulevikuplaanide tegemist ühe õhtuga.'},
          {text:'Teistsuguse taustaga inimene võib täna tunduda eriti huvitav. Uus vaatenurk avardab ka sinu enda maailma.',do:'Lase kellelgi rääkida oma kodukoha lugusid ja kombeid.',avoid:'Eelarvamusi kellegi tausta või aktsendi pärast.'},
          {text:'Kaugus ei pruugi täna olla takistus – ei kilomeetrites ega mõtetes. Ühine reisiplaan või lihtsalt hea vestlus võib tuua kaks inimest lähemale.',do:'Planeeri kellegi kalliga üks ühine väljasõit, olgu see kas või naaberlinna.',avoid:'Kellegi idealiseerimist ainult sellepärast, et ta on kaugel.'}
        ],
        work:[
          {text:'Täna tasub panustada oma teadmistesse. Hea mentor või kogenum kolleeg võib näidata suunda, mida ise ei märkaks.',do:'Küsi kelleltki kogenumalt, mida ta sinu asemel järgmiseks õpiks.',avoid:'Uue info tagasilükkamist ainult sellepärast, et see on harjumatu.'},
          {text:'Välismaised partnerid ja projektid lubavad täna uusi suundi. Ka üks kiri või kõne võib avada ukse väljapoole tavapärast ringi.',do:'Uuri, kuidas sinu valdkonnas mujal maailmas asju tehakse.',avoid:'Kultuurierinevuste alahindamist läbirääkimistel.'},
          {text:'Pikem perspektiiv aitab täna teha paremaid valikuid. Mõtle, millised tänased tegemised on olulised ka viie aasta pärast.',do:'Vali üks väike samm, mis viib sind suuremale eesmärgile lähemale, ja tee see sel nädalal.',avoid:'Teiste karjääriteede kopeerimist ilma enda soove läbi mõtlemata.'}
        ],
        energy:[
          {text:'Vaheldus annab täna jõudu. Uus maitse, võõras muusika või muuseum, kus sa pole käinud, värskendab rohkem, kui arvata võiks.',do:'Proovi täna rooga mõnest köögist, mida sa pole varem maitsnud.',avoid:'Päevi, mis on eilse täpne koopia.'},
          {text:'Avar vaade rahustab täna rohkem kui detailid. Vaata asju suuremas plaanis – paljud tänased mured kahanevad siis õigesse mõõtu.',do:'Mine kuhugi, kust avaneb lai vaade – mäe otsa, mere äärde või torni.',avoid:'Iga pisiasja liiga südamesse võtmist.'},
          {text:'Liikumine, mis viib sind uude kohta, annab täna topelt jõudu. Matkarada, võõras ujula või uus jooksuring teeb tavalisest trennist väikese seikluse.',do:'Vali nädalavahetuseks matkarada, kus sa pole veel käinud.',avoid:'Liiga suure eesmärgi seadmist kohe esimeseks korraks.'}
        ]
      },
      { // 10: career, goals, reputation
        headline:['Nähtav ja kuuldav','Samm tipu poole','Usaldus on sinu kapital'],
        day:[
          'Karjäär ja avalik roll on täna tähelepanu keskmes. Sinu sõnadel on tavalisest rohkem kaalu, nii et räägi oma plaanidest julgelt.',
          'Suured eesmärgid on täna käeulatusele lähemal, kui tundub. Jaga üks neist väiksemateks sammudeks ja tee esimene juba täna.',
          'Inimesed jälgivad täna tavalisest rohkem, kuidas sa oma kohustustega toime tuled. Korralikult lõpetatud töö jääb meelde kauemaks kui kiire särts.'
        ],
        love:[
          {text:'Kiire päev võib jätta tunded tagaplaanile. Väike tähelepanu keset tööd näitab, et lähedased on sulle olulised ka siis, kui kalender on täis.',do:'Helista lõuna ajal kellelegi kallile kas või viieks minutiks.',avoid:'Telefoni kontrollimist ajal, kui keegi sulle oma päevast räägib.'},
          {text:'Suhetes võib täna kerkida tasakaalu küsimus: kui palju aega jääb tööle ja kui palju lähedastele. Aus vestlus aitab rohkem kui süütunne.',do:'Selgita välja, millist koos veedetud aega sinu lähedane kõige rohkem hindab.',avoid:'Süütunde lepitamist kallite kingitustega.'},
          {text:'Avalik roll võib täna mõjutada ka isiklikku elu. Inimesed näevad sind teises valguses ja see võib tuua uusi tutvusi.',do:'Räägi uues seltskonnas ka sellest, mis sind rõõmustab, mitte ainult tööst.',avoid:'Tööpingete toomist koju lähedaste kaela.'}
        ],
        work:[
          {text:'Väga hea päev karjääri jaoks: algatused võivad täna leida tunnustust. Valmistu põhjalikult ja astu julgelt esile.',do:'Näita üht konkreetset tulemust inimesele, kelle arvamus loeb.',avoid:'Lõputut viimistlemist, kui töö on juba piisavalt hea.'},
          {text:'Oma tööst tasub täna rääkida nii, et teised mõistaksid selle väärtust. Selge ja lihtne lugu jääb meelde paremini kui pikk loetelu.',do:'Küsi juhilt või kliendilt tagasisidet ühe hiljuti lõpetatud töö kohta.',avoid:'Tulemuste ilustamist, kui ausad numbrid räägiksid niigi enda eest.'},
          {text:'Võimalus astuda samm edasi võib täna avaneda ootamatult. Enne kui midagi vastu võtad, mõtle, kas see viib sind sinna, kuhu tahad jõuda.',do:'Pea nõu kellegagi, kes on sarnase sammu juba teinud.',avoid:'Kohest jah-sõna, kui tingimused pole veel teada.'}
        ],
        energy:[
          {text:'Eesmärgid annavad täna jõudu, aga tempo peab olema jätkusuutlik. Pikk distants nõuab ühtlast sammu, mitte sprinti.',do:'Määra päeva lõppu kindel punkt, mil töö on läbi.',avoid:'Õhtust töötamist ainult sellepärast, et keegi võiks seda märgata.'},
          {text:'Tunnustus võib täna anda energiat, kuid hea enesetunne ei pea sõltuma teiste arvamusest. Sisemine rahulolu on kindlam tugi kui teiste heakskiit.',do:'Tähista üht väikest edusammu millegi mõnusaga.',avoid:'Kiituse ootamist enne, kui lubad endale puhata.'},
          {text:'Rahulik hingamine ja aeglasem tempo annavad täna rohkem kindlust kui valjud sõnad. Kui keha on rahulik, jäävad ka mõtted selgeks.',do:'Jaluta enne tähtsat kohtumist kümme minutit värskes õhus.',avoid:'Kiirustamist ühelt kohtumiselt teisele ilma hingetõmbepausita.'}
        ]
      },
      { // 11: friends, groups, hopes for the future
        headline:['Sõprade päev','Pilk tulevikku','Koos on lõbusam'],
        day:[
          'Sõbrad, kogukond ja ühised ettevõtmised tõusevad täna esile. Hea päev meenutada, mis sind sõpradega seob, ja teha üks ühine plaan.',
          'Tulevik tundub täna lähemal kui tavaliselt. Inimesed, kes sinusse usuvad, annavad su plaanidele julgust juurde.',
          'Kogukonnas on täna jõudu. Naabrid, kursusekaaslased või kohalik selts võivad pakkuda rohkem tuge, kui arvad.'
        ],
        love:[
          {text:'Ühine seltskond toob täna inimesi lähemale. Üksikuna võid kohata kedagi sõbra sünnipäeval, paarisuhtes aga võite teineteist sõprade keskel uues valguses näha.',do:'Kutsu ise paar sõpra kokku ja luba neil kedagi kaasa võtta.',avoid:'Kõrvaltvaataja rolli seltskonnas, kus võiksid ise vestlust alustada.'},
          {text:'Hea suhe toetub täna eelkõige sõprusele. Kõige lähemale toovad sind inimesed, kellega võid olla täiesti sina ise ja vaikus ei ole piinlik.',do:'Tee kellegi kalliga midagi, mida teeksid ka parima sõbraga – lihtsalt ja ilma suurte ootusteta.',avoid:'Sõprade unarusse jätmist romantika pärast.'},
          {text:'Ühised lootused võivad täna suhtele uut hoogu anda. Kui oled üksi, võib sõprade ring tuua kokku inimesega, kellel on sarnased unistused.',do:'Uuri kelleltki kallilt, millest ta viimasel ajal unistab.',avoid:'Tuleviku planeerimist ainult ühe inimese soovide järgi.'}
        ],
        work:[
          {text:'Võrgustik ja kontaktid on täna eriti väärtuslikud. Õige soovitus õigelt inimeselt võib säästa nädalaid otsimist.',do:'Tutvusta kahte inimest, kellel oleks teineteisest kasu.',avoid:'Liiga paljudes rühmades osalemist, kus sa tegelikult kaasa ei räägi.'},
          {text:'Grupitöö laabub täna hästi ja ühine eesmärk aitab üle saada ka erimeelsustest. Igaühe tugevused tulevad praegu hästi esile.',do:'Kiida kedagi meeskonnast avalikult tema panuse eest.',avoid:'Teiste ideede kõrvale lükkamist enne, kui need on lõpuni kuulatud.'},
          {text:'Ühised ettevõtmised sõprade või meeskonnaga vajavad täna selget raami. Hea päev arutada, kes mida panustab ja kui palju see maksab.',do:'Lepi ühise ettevõtmise kulud ja kohustused kohe alguses kokku.',avoid:'Ühisostu või -reisi korraldamist ilma selge eelarveta.'}
        ],
        energy:[
          {text:'Hea jutt sõbraga võib täna olla parim puhkus. Suurt pidu pole vaja – piisab teetassist ja heast seltskonnast.',do:'Kutsu sõber õhtul jalutama või kohvikusse.',avoid:'Kohtumisi, kus pead terve aja kedagi teist mängima.'},
          {text:'Kogukondlik tegevus võib täna olla üllatavalt laadiv. Kui teed midagi koos teistega ja teiste heaks, tuleb jõud ka endale tagasi.',do:'Paku oma abi mõnele kohalikule ettevõtmisele või naabrile.',avoid:'Kohustuste kogumist rohkem, kui jaksad kanda.'},
          {text:'Selgemini kui tavaliselt näed täna, mis toetab sinu heaolu pikemas plaanis. Mõtle, milline võiks olla sinu tavaline hea päev aasta pärast.',do:'Nimeta kolm asja, mis teevad sinu tavalise päeva heaks.',avoid:'Plaane, mis sõltuvad ainult tahtejõust.'}
        ]
      },
      { // 12: rest, solitude, intuition, finishing
        headline:['Vaikus laeb','Usalda vaistu','Lõpeta ja puhka'],
        day:[
          'Päev kutsub tagasi tõmbuma ja tempot maha võtma. Luba endale, et kõike ei pea korraga jõudma – osa asju saab valmis ka homme.',
          'Sisetunne on täna tavalisest teravam. Pane tähele unenägusid ja juhuslikke mõtteid – neis võib olla oluline sõnum.',
          'Kokkuvõtted sobivad täna paremini kui uued algused. Vaata tagasi, mida oled viimasel ajal saavutanud, ja uus tsükkel saab alata puhtalt lehelt.'
        ],
        love:[
          {text:'Tunded võivad täna olla vaiksemad ja vajadus omaette olla suurem. See ei ole tõrjumine, vaid puhkus – ka suhted vajavad vahel hingetõmbeaega.',do:'Veeda kellegi kalliga rahulik õhtu, kus kumbki võib teha oma asja.',avoid:'Vanade lahkhelide lahendamist väsinud peaga.'},
          {text:'Täna võid tunda kellegi meeleolu ka ilma sõnadeta. Vaikne kohalolu võib praegu öelda rohkem kui pikk jutt.',do:'Ole kellelegi lähedasele lihtsalt olemas, ilma nõuandeid jagamata.',avoid:'Kahtluste hautamist omaette, ilma neid kunagi välja ütlemata.'},
          {text:'Möödunu võib täna end meelde tuletada. Anna tunnetele ruumi ja lase neil rahulikult settida.',do:'Räägi oma tunnetest kellegagi, keda usaldad.',avoid:'Vanade suhete idealiseerimist üksildasel hetkel.'}
        ],
        work:[
          {text:'Tempo võib täna olla aeglasem ja see on täiesti normaalne. Korrastamine ja ülevaatamine sobivad praegu paremini kui uued algatused.',do:'Arhiveeri vanad failid ja kirjad, mida enam ei vaja.',avoid:'Uute projektide alustamist päeval, mil jõudu on vähe.'},
          {text:'Täna sobivad paremini tagatoa tööd kui suured esinemised. Ettevalmistus, mida keegi ei näe, tasub end hiljem ära.',do:'Valmista ette materjalid, mida läheb vaja järgmisel nädalal.',avoid:'Konfliktide lahendamist kirja teel, kui tooni võidakse valesti mõista.'},
          {text:'Suuremad rahaotsused saavad täna selgust juurde, kui lased neil paar päeva seista. Praegu sobib paremini korrastamine kui uued kohustused.',do:'Kogu oma dokumendid ja kviitungid ühte kohta kokku.',avoid:'Lubadusi, mis seovad sind pikaks ajaks, enne kui oled välja puhanud.'}
        ],
        energy:[
          {text:'Puhkus on täna sama tähtis kui tegemised. Lühike lõunauinak või rahulik õhtu ilma plaanideta võib teha imesid.',do:'Lülita tund enne magamaminekut ekraanid välja.',avoid:'Kohustuste kuhjamist õhtusse, mis peaks olema rahulik.'},
          {text:'Üksinda veedetud aeg laeb täna akusid paremini kui seltskond. Loodus annab jõudu kiiremini tagasi, kui arvata võiks.',do:'Mine jalutama metsa, parki või mere äärde – üksi ja ilma kiirustamata.',avoid:'Seltskonda, mida otsid ainult üksinduse peletamiseks.'},
          {text:'Asjad, mis on ammu energiat võtnud, võib täna rahuliku südamega lõpetada. Iga lõpetatud asi teeb pea kergemaks.',do:'Vii lõpule üks väike asi, mis on ammu meelt närinud.',avoid:'Uute kohustuste võtmist enne, kui vanad on lõpetatud.'}
        ]
      }
    ]
  },
  humor:{
    events:{
      sunOwn:e=>`${Time(e.time)} jõuab Päike sinu märki: algab sinu sünnipäevahooaeg ja isegi peegel on täna selgelt sinu poolel.`,
      sunIngress:e=>`${Time(e.time)} läheb Päike ${into(e.to)} ja alustab seal kuu aega kestvat külalisetendust.`,
      fullMoon:e=>e.own
        ?`${Time(e.time)} on täiskuu sinu märgis: tunded on prožektorivalguses, nii et enne dramaatilise sõnumi saatmist keeda endale teed.`
        :`${Time(e.time)} on täiskuu ${signs.loc[e.sign]}: emotsioonidel on mikrofon käes ja helitugevuse nupp kuhugi kadunud.`,
      newMoon:e=>e.own
        ?`${Time(e.time)} on noorkuu sinu märgis: universum vajutab sinu jaoks nupule „Uus fail“.`
        :`${Time(e.time)} on noorkuu ${signs.loc[e.sign]}: hea hetk alustamiseks, kui see just pole järjekordne „esmaspäevast hakkan“.`,
      station:e=>({
        Mercury:{retrograde:'muutub Merkuur retrograadseks: enne nupule „Saada“ vajutamist vaata, kas adressaat on ikka see, kellele mõtlesid.',direct:'lõpeb Merkuuri retrograadsus ning printer, e-post ja vestluskaaslased hakkavad jälle koostööd tegema.'},
        Venus:{retrograde:'muutub Veenus retrograadseks: keegi minevikust võib äkki su numbri üles leida, aga vastama ei pea.',direct:'lõpeb Veenuse retrograadsus ning süda ja rahakott räägivad jälle sama keelt.'},
        Mars:{retrograde:'muutub Marss retrograadseks: suured vallutused võivad oodata, praegu piisab ka sahtli korrastamisest.',direct:'lõpeb Marsi retrograadsus: mootor tõmbab jälle ja esimese käigu võib julgelt sisse panna.'}
      })[e.body][e.turns].replace(/^/,`${Time(e.time)} `),
      moonChange:e=>`${Time(e.time)} kolib Kuu ${signs.gen[e.from]} märgist ${into(e.to)} ja riputab seal kohe oma pildid seinale.`
    },
    headlines:{sunOwn:'Sinu hooaeg, sinu reeglid',fullMoonOwn:'Prožektor on sinul',newMoonOwn:'Puhas leht, uus pliiats'},
    houses:[
      { // 1
        headline:['Peaosas sina','Hoogu jagub','Tunded ilma grimmita'],
        day:[
          'Päeva peaosa on täna sinu – kõrvalosatäitjad saavad oma read hiljem. Ütle selgelt, mida tahad, sest suflöör on täna puhkusel.',
          'Täna jagub sul hoogu nagu kassil kell kolm öösel. Suuna see millegi kasuliku peale, enne kui hakkad kogu korteri mööblit ümber tõstma.',
          'Tunded on täna nii pinna peal, et neid võiks kasutada ilmateate asemel. Kui keegi küsib „Kuidas läheb?“, varu aega – vastus tuleb koos lisade ja joonealuste märkustega.'
        ],
        love:[
          {text:'Sinu võlu töötab täna nagu soojuspump – vaikselt, aga tõhusalt. Kui kellelegi meeldid, märkab ta seda ka ilma suure etenduseta.',do:'Tee kompliment, mis ei käi ilma kohta.',avoid:'Sõnumi kirjutamist ja kustutamist seni, kuni aku tühjaks saab.'},
          {text:'Sõnad tulevad täna suust nagu kohv ilma filtrita. Tunnete avaldamiseks suurepärane, kellegi uue soengu hindamiseks veidi riskantne.',do:'Ütle välja üks soe mõte, mis on juba nädal aega keele peal olnud.',avoid:'Vaidlust selle üle, kelle kord oli prügi välja viia.'},
          {text:'Tundlikkus on täna nagu uus suitsuandur, mis piiksub juba röstsaia peale. Iga „ok“ ei ole krüpteeritud kiri, mida peab terve õhtu dešifreerima.',do:'Kui midagi jääb segaseks, küsi – telepaatia pole veel teenusena saadaval.',avoid:'Lühikesest sõnumist kolmevaatuselise draama tegemist.'}
        ],
        work:[
          {text:'Ideid sajab täna nagu novembris vihma – pidevalt ja igast suunast. Püüa üks kinni ja ütle see välja, enne kui kolleeg selle „ise välja mõtleb“.',do:'Esita oma idee täna – mõtete lugemise kursus on kolleegidel veel pooleli.',avoid:'Kahekümnendat brauseri vahelehte, millest igaüks on „kohe vaja“.'},
          {text:'Täna tahaks kõike teha omal moel ja vahel on see isegi õige. Anna lihtsalt kolleegidele teada, enne kui ühiskaustad oma loogika järgi ümber nimetad.',do:'Juhi täna üht ülesannet algusest lõpuni – kroon on valikuline.',avoid:'Koosolekut, kus kõik nõustuvad ja keegi ei tea, millega.'},
          {text:'Tuju tahab täna poodi minna, rahakott aga nõuab enne kirjalikku põhjendust. Anna sõna mõlemale.',do:'Jäta ostukorv ööseks seisma – hommikuks on pool sellest imekombel tarbetu.',avoid:'Ostlemist kategoorias „ma olen selle ära teeninud“.'}
        ],
        energy:[
          {text:'Keha on täna nagu kutsikas, kes nägi jalutusrihma: valmis kohe minema. Mine ka, enne kui diivan oma vastupakkumise teeb.',do:'Tee üks lisaring ümber kvartali – sammulugeja vajab ka eduelamust.',avoid:'Läbirääkimisi diivaniga „ainult viie minuti“ üle.'},
          {text:'Sinu tuju on täna nakkav nagu raadiohiti refrään. Hoolitse, et teistele jääks külge hea viis, mitte hommikune nurin.',do:'Alusta päeva lemmiklooga, mitte uudistega.',avoid:'E-kirjade lugemist enne, kui silmad on korralikult lahti.'},
          {text:'Keha saadab täna selgeid signaale nagu navigaator, mis kordab „pöörake ümber“. Kui see ütleb „puhka“, pole mõtet keskööni vaielda.',do:'Planeeri õhtu, mille ainus punkt päevakavas on puhkus.',avoid:'Sarjamaratoni sarjast „veel ainult üks osa“.'}
        ]
      },
      { // 2
        headline:['Rahakott palub sõna','Mugavusrežiim sees','Väärtuste inventuur'],
        day:[
          'Kuu teeb täna sinu rahaasjades auditit ja on põhjalikum kui maksuamet. Vaata enne ise üle, millised püsimaksed on ammu oma elu ära elanud.',
          'Mugavus on täna prioriteet number üks ja villased sokid kuuluvad strateegiliste varude hulka. Tee kodu hubaseks – see on odavam kui spaa.',
          'Täna toimub väärtuste inventuur ja riiulil on kõik segamini. Võib selguda, et rahu on sulle tähtsam kui järjekordne köögiseade, mida kasutad kaks korda aastas.'
        ],
        love:[
          {text:'Hellus räägib täna praktilist keelt: parandatud kraan ütleb rohkem kui kolm südamega emotikoni. Romantika võib vahel kanda ka töökindaid.',do:'Paranda ära see üks asi, mis on kodus nii kaua logisenud, et sel on juba nimi.',avoid:'Romantilisi žeste, mille kohta pank hiljem meeldetuletuse saadab.'},
          {text:'Tahaks tunda, et sind hinnatakse, aga vihjed ei pruugi täna kohale jõuda. Ütle otse – vihjeid loetakse sama harva kui kasutusjuhendeid.',do:'Ütle valjusti, mis sulle teise inimese juures meeldib – ka pisiasjades.',avoid:'Komplimentide õngitsemist, kui võiks lihtsalt otse küsida.'},
          {text:'Ühine eelarve võib täna pakkuda rohkem põnevust kui krimisari. Räägi rahast päevavalges, mitte keskööl köögilaua taga.',do:'Lepi rahaasjades kokku pärast lõunat – kõht täis, meel leebem.',avoid:'Kassatšekkide võrdlemist nagu kohtuasja tõendeid.'}
        ],
        work:[
          {text:'Täna sobib hästi jahiks püsimaksetele, mis vaikselt palka näksivad. Mõni neist on nii hästi peidus, et väärib peitusemängu medalit.',do:'Leia üles tellimus, mida kasutad harvemini kui jõusaali kaarti.',avoid:'Raha, mis kaob „pisikulude“ musta auku.'},
          {text:'Palgast rääkimiseks on sinu argumendid täna nagu hästi pakitud kohver – kõik vajalik on olemas. Lisa sinna veel numbrid, et kaas kinni läheks.',do:'Kirjuta enne palgavestlust üles numbrid, mitte ainult enesekindlus.',avoid:'Töötamist „sõpruse eest“, kui sõprus arveid ei maksa.'},
          {text:'Internetipood saadab täna sõnumeid nagu armunud nooruk: „Kas sa unustasid mind?“ Vasta homme, kui pea on selgem.',do:'Küsi enne ostu endalt: „Kas ma kasutan seda rohkem kui korra?“',avoid:'Ostukorvi täitmist ainult selleks, et tasuta saatmise piir täis saada.'}
        ],
        energy:[
          {text:'Mugavust nõuad täna sama järjekindlalt kui kass oma kohta radiaatori kõrval. Vaidlemine on mõttetu – kass võidab niikuinii.',do:'Tõmba selga kõige mugavam kampsun – täna on see sinu vormiriietus.',avoid:'Lõunat püsti külmkapi ukse vahel.'},
          {text:'Meeled on täna nõudlikud nagu restoranikriitik. Värske leiva lõhn võib teha rohkem kui terve kaust motivatsioonitsitaate.',do:'Korralda endale väike degusteerimine: kolm teesorti, üks diivan, null kriitikut.',avoid:'Motivatsioonitsitaate tühja kõhuga.'},
          {text:'Rutiin on täna sinu kõige lojaalsem sõber – igav, aga alati kohal. Spontaansed seiklused võivad pingil oodata.',do:'Mine õigel ajal magama, isegi kui internet pole veel otsa saanud.',avoid:'Kolmandat kohvitassi pärastlõunal.'}
        ]
      },
      { // 3
        headline:['Sõnum tuleb, sõnum läheb','Jutupaun on lahti','Ajud sumisevad'],
        day:[
          'Telefonis liigub täna rohkem sõnumeid kui väikeses postkontoris. Vasta kõigepealt neile, kes on kõige kauem oodanud, mitte neile, kes saadavad kõige rohkem emotikone.',
          'Sinust saab täna lähikonna kõige jutukam raadiojaam. Trepikojas võid naabriga kogemata kõik maailma probleemid ära lahendada – jäta paar ka homseks.',
          'Sul on täna uudishimu nagu ajakirjanikul, kellel on tähtaeg kukil. Õpi midagi uut – kas või seda, milleks on teleripuldil need ülejäänud nupud.'
        ],
        love:[
          {text:'Flirt võib täna alata ühest naljakast meemist. Kui keegi naerab su nalja üle ka teist korda, on see juba statistiliselt oluline.',do:'Saada kellelegi meeldivale inimesele midagi naljakat – kassipildid on alati lubatud.',avoid:'Häälsõnumeid, mis kestavad kauem kui raadiosaade.'},
          {text:'Mõni ütlemata mõte on sahtlis nii kaua seisnud, et sellele on tolm peale tulnud. Täna on hea päev see välja võtta – ettevaatlikult, nagu vanaema vaasi.',do:'Alusta rasket juttu lausega „Mul on üks mõte“, mitte „Me peame rääkima“.',avoid:'Tähtsa jutu alustamist ajal, kui teine on just jopet selga panemas.'},
          {text:'Täna võib ka liftisõit olla piisavalt pikk, et tutvus algaks. Ilm on hea sissejuhatus, aga teine lause võiks olla juba huvitavam.',do:'Küsi kelleltki soovitust – inimestele meeldib olla ekspert, eriti kohvikute alal.',avoid:'Telefoniekraani uurimist, nagu oleks seal kõige põnevam inimene.'}
        ],
        work:[
          {text:'Kirjavahetus liugleb täna nagu uisutaja värskel jääl. Kasuta seda, et vastata lõpuks kirjale, mis on postkastis olnud nii kaua, et võiks juba üüri maksta.',do:'Kui kirjade pingpong on jõudnud kümnendasse vooru, haara telefon.',avoid:'Nupu „Vasta kõigile“ vajutamist, kui küsimus puudutab ainult kahte inimest.'},
          {text:'Uued teadmised kleepuvad täna nagu takjad villase kampsuni külge. Küsi kolleegilt, kuidas ta oma nippi teeb – see on odavam kui koolitus.',do:'Õpi selgeks üks kiirklahv, mis säästab aastas terve päeva.',avoid:'Sama küsimuse guugeldamist viiendat korda, kui naaberlaua kolleeg teab vastust.'},
          {text:'Väikesi käike ja lühikesi kohtumisi on täna nagu kulleril tipptunnil. Pane need loogiliselt ritta ja säästa jalgu.',do:'Tee kõik väikesed asjaajamised ühe ringiga ära – jalad ütlevad õhtul aitäh.',avoid:'Lubadust „vastan kohe“, mis tähendab tegelikult „järgmisel nädalal“.'}
        ],
        energy:[
          {text:'Mõtted jooksevad täna peas ringi nagu lapsed vahetunnis. Lühike paus ilma ekraanita aitab neil klassi tagasi minna.',do:'Kirjuta sumisevad mõtted paberile – paber ei unusta ega nurise.',avoid:'Kolme vestluse pidamist korraga neljas eri rakenduses.'},
          {text:'Parimad mõtted sünnivad täna liikumise pealt, nagu duši all, ainult kuivemalt. Jalutuskäik võib anda lahenduse, mida laua taga ei leidnud.',do:'Mine jalutama ja jäta kõrvaklapid koju – mõtted tahavad ka sõna saada.',avoid:'Kiirkõndi telefoniekraani vahtides nagu zombi.'},
          {text:'Infot tuleb täna nagu oavarrest. Kõik ei vaja vastust ja mõni kõne võib rahulikult kõneposti jääda.',do:'Pane õhtuks märguanded hääletuks ja naudi digitaalset vaikust.',avoid:'Kommentaariumide lugemist enne magamaminekut.'}
        ]
      },
      { // 4
        headline:['Kodu, kallis kodu','Fotoalbumi aeg','Kodukassi režiim'],
        day:[
          'Kodu tõmbab täna nagu magnet ja diivan on sellega täiesti nõus. Anna järele – pleed, tee ja üks küünal on täna igati väärikas õhtuprogramm.',
          'Vanu fotosid vaadates võid täna küsida: „Kes lubas mul sellise soengu teha?“ Helista kellelegi, kes oli tol ajal kohal ja mäletab rohkem.',
          'Võid täna olla kättesaamatu nagu mobiililevi sügavas metsas. Sõnumid võivad oodata homseni – need ei lähe üleöö hapuks.'
        ],
        love:[
          {text:'Romantika elab täna köögis: koos tehtud kaste võib olla kirglikum kui küünlavalgusõhtu restoranis. Peaasi, et keegi ei vaidleks soola üle.',do:'Tee kellegagi koos süüa ja jaga ka nõudepesu – see on armastuse proovikivi.',avoid:'Võimuvõitlust teleripuldi pärast.'},
          {text:'Pereteemad võivad täna kerkida nagu tainas soojas köögis. Kui keegi tahab rääkida, kuula – nõu oskavad anda kõik, kuulata oskavad vähesed.',do:'Kuula kellegi muret lõpuni, isegi kui lahendus on juba keelel.',avoid:'Vana perekonnatüli uut hooaega pidulaua ääres.'},
          {text:'Hea küsimus tänaseks: kellega tahaksid jagada oma kodu viimast küpsist? Kui vastus on „mitte kellegagi“, on ka see aus vastus.',do:'Tee kodus üks väike muudatus, mis paneb sind iga kord naeratama.',avoid:'Külaliste kutsumist, kui hing ihkab tegelikult pidžaamat.'}
        ],
        work:[
          {text:'Töölaua taga istub täna keha, aga mõtted on juba kodus pehmetes sussides. Tee ära hädavajalik ja jäta suured vallutused homseks.',do:'Kirjuta homseks lühike nimekiri, et töö ei koliks õhtul sinuga diivanile.',avoid:'Töökirjade lugemist ühe käega, kui teine käsi segab suppi.'},
          {text:'Kodune vaikus on täna parem kolleeg kui kõige jutukam avatud kontor. Kasuta seda ühe töö jaoks, mis vajab süvenemist.',do:'Pane uksele silt „Geenius töötab“ ja tee üks keeruline asi ära.',avoid:'Sagimist, mis näeb välja nagu töö, aga ei vii kuhugi.'},
          {text:'Kodu esitab täna soovinimekirja: siin lamp, seal riiul, kuskil tilgub kraan. Täida kõigepealt see soov, mis tilgub.',do:'Tee kodukulude nimekiri enne, kui ehituspood sind hüpnotiseerib.',avoid:'Diivani ostmist ainult sellepärast, et inimesed reklaamis olid sellel nii õnnelikud.'}
        ],
        energy:[
          {text:'Kodu laeb sind täna nagu telefoni öine laadija. Õhtu diivanil pole laiskus, vaid strateegiline energiavaru.',do:'Kuuluta õhtu ametlikult pidžaamaõhtuks.',avoid:'Kolme sünnipäeva ühel õhtul, sest kõigile oli lubatud.'},
          {text:'Tunded on täna pehmed nagu just ahjust tulnud sai. Ole iseendaga sama hell kui oma lemmiktaimega.',do:'Tee midagi, mis lõhnab lapsepõlve järele – kas või kakao.',avoid:'Enda noomimist asjade eest, mis juhtusid juba eelmisel kümnendil.'},
          {text:'Ühe sahtli korrastamine võib täna anda rohkem rahuldust kui maratoni lõpetamine. Ja põlvedele on see kindlasti leebem.',do:'Korrasta üks sahtel ja vaata, mis seal elab.',avoid:'Asjade hoidmist „igaks juhuks“ juba kümnendat aastat.'}
        ]
      },
      { // 5
        headline:['Mängutund algab','Loovuse ilutulestik','Pidu iga pisiasja puhul'],
        day:[
          'Kuu kuulutab täna välja mängutunni ja kohustused peavad korraks koridoris ootama. Tee midagi lihtsalt rõõmuks – kasu võib tulla hiljem või üldse mitte.',
          'Loominguline säde on täna nii ere, et sellega võiks pannkooke küpsetada. Joonista, kirjuta või ehita klotsidest midagi, mida keegi ei tellinud.',
          'Täna on päev väikeste pidude jaoks: läbi loetud raamat, pestud aknad või see, et kõik sokid said lõpuks paari. Tähista ja kutsu kedagi kaasa.'
        ],
        love:[
          {text:'Flirt on täna sama loomulik kui hingamine, ainult lõbusam. Kui keegi sulle meeldib, näita seda – kerge naljaga ja ilma suure draamata.',do:'Kutsu keegi kohtingule – halvimal juhul saad lihtsalt hea loo.',avoid:'Kohtingut, mis kõlab nagu tööintervjuu viie aasta plaaniga.'},
          {text:'Paarisuhtes tasub täna rutiini raputada nagu lumekuuli. Üksikuna võid tähelepanu leida sealt, kus seda kõige vähem ootad – näiteks köögiviljaleti juures.',do:'Proovi midagi uut: uus koht, uus roog või vähemalt uus nali.',avoid:'Endise kallima profiili külastamist „kogemata“ kolm korda päevas.'},
          {text:'Süda on täna lahti nagu poe uks esimesel allahindluspäeval. Ütle välja, mida tunned – komplimendid ei ole defitsiitkaup.',do:'Ütle kellelegi, miks ta on sulle oluline, kuigi tal pole sünnipäev.',avoid:'Siiruse peitmist kolme kihi iroonia taha.'}
        ],
        work:[
          {text:'Kohustused ja lõbu tõmbavad täna köit ning lõbu on selgelt rohkem trenni teinud. Tee hädavajalik ära enne lõunat, siis on süda rahul.',do:'Tee kõige igavam ülesanne hommikul ära, kui aju veel sõna kuulab.',avoid:'Rahaotsuseid stiilis „elame ainult korra“.'},
          {text:'Rutiinsed tabelid on täna umbes sama põnevad kui pesumasina programmi lõpu ootamine. Lisa töösse veidi loovust ja tabelid hakkavad elama.',do:'Paku koosolekul välja kõige pöörasem idee – mõnikord töötab just see.',avoid:'Lauset „Nii pole kunagi tehtud“ iga uue mõtte peale.'},
          {text:'Mängida tahaks täna rohkem kui töötada, nagu lapsel enne suvevaheaega. Tee endaga kokkulepe: iga ülesande järel väike preemia.',do:'Luba endale iga lõpetatud ülesande järel üks lemmiklaul – täies valjuses.',avoid:'Kulutusi, mis algavad sõnadega „Ma ainult vaatan“.'}
        ],
        energy:[
          {text:'Energiat on täna nii palju, et võiksid hakata tantsuõpetajaks. Liikumine, mis tundub mänguna, ei väsita peaaegu üldse.',do:'Tantsi köögis, nagu keegi ei vaataks – tõenäoliselt ei vaatagi.',avoid:'Trenni, mida teed ainult selleks, et sammulugeja rahule jääks.'},
          {text:'Hobi kutsub täna sama visalt kui vana sõber, kellega oled kolm korda kohtumise ära jätnud. Aeg on tal külas käia.',do:'Võta ette hobi, mis on kapi otsas tolmu kogunud.',avoid:'Vaba õhtu kulutamist võõraste inimeste puhkusepiltide kerimisele.'},
          {text:'Mängulisus on täna parem tujutõstja kui ükski kohvimasin. Ehita, mängi või tee lollusi – täiskasvanulikkus võib korraks puhata.',do:'Tee midagi täiesti mõttetut ja lõbusat, näiteks paberlennuk.',avoid:'Tõsist nägu, kui olukord karjub naeru järele.'}
        ]
      },
      { // 6
        headline:['Ülesannete hävitaja','Nimekiri, sa oled minu','Keha esitab arve'],
        day:[
          'Töökindad on täna kätes ja märkmik lahti. Hea päev lõpetada asjad, mis on nii kaua pooleli olnud, et neil on juba oma sünnipäev.',
          'Täna pakub tühjaks saanud postkast rohkem rahuldust kui tükk kooki. Korrasta laud, kaustad ja vähemalt üks kapp – kord on täna sinu salarelv.',
          'Keha esitab täna arveid harjumuste eest, mida oled ammu edasi lükanud. Maksa üks neist ära: mine õigel ajal magama või söö lõunat istudes.'
        ],
        love:[
          {text:'Romantika näeb täna välja nagu pestud nõud ja välja viidud prügi. Ära seda alahinda – argipäeva kangelastel on samuti fännid.',do:'Võta enda peale kodutöö, mida kõik vihkavad – näiteks pliidi pesemine.',avoid:'Vaidlust selle üle, kuidas nõudepesumasinat „õigesti“ täidetakse.'},
          {text:'Kalender on täna nii täis, et tunded peavad aja broneerima. Saada lühike soe sõnum, et keegi ei arvaks sind kadunuks.',do:'Saada keset päeva sõnum, kus on rohkem südant kui emotikone.',avoid:'Lähedase pikale sõnumile vastamist ühe sõnaga „ok“.'},
          {text:'Kolleeg või naaber võib täna osutuda üllatavalt toredaks, kui jutt läheb ilmast kaugemale. Lihtne „Kuidas läheb?“ võib avada terve romaani.',do:'Too kolleegile kohvi või naabrile koogitükk – see on argipäeva armastuskeel.',avoid:'Kontoriromaani stsenaariumi kirjutamist peas juba enne lõunat.'}
        ],
        work:[
          {text:'Täna oled ülesannetele sama halastamatu kui tolmuimeja tolmule. Võta ette asi, mis on kõige kauem nimekirjas passinud.',do:'Kustuta nimekirjast üks ülesanne, mis seal juba ammu igavleb.',avoid:'Koosolekut, mis oleks võinud olla üks lühike e-kiri.'},
          {text:'Süsteemid on täna ahvatlevamad kui spontaansus. Kui teed failides korra, tänad homme iseennast rohkem, kui ükski kolleeg seda teeks.',do:'Automatiseeri üks igav kordustöö ja lase arvutil see sinu eest ära teha.',avoid:'Kaustade nimesid nagu „uus“, „uus2“ ja „päris lõplik“.'},
          {text:'Meeskonnatöö laabub täna nagu hästi harjutatud koor, kui kõik teavad oma partiid. Kui ei tea, laulab igaüks oma laulu.',do:'Kirjuta ühisesse vestlusesse, kes mida teeb – kiri peab paremini kui mälu.',avoid:'Kellegi teise töö vaikset ärategemist ja siis kolm päeva solvumist.'}
        ],
        energy:[
          {text:'Keha on täna nagu vana auto, mis annab tulukesega märku. Tee peatus enne, kui armatuurlaud hakkab vilkuma nagu jõulupuu.',do:'Tõuse iga tunni järel korraks püsti – tool ei solvu.',avoid:'Lõunasööki, mis koosneb kolmest kohvist ja ühest küpsisest.'},
          {text:'Pisikesed harjumused töötavad täna paremini kui suured lubadused uuest elust. Klaas vett on ka harjumus, isegi kui see sotsiaalmeedias muljet ei avalda.',do:'Pane veeklaas nii nähtavale kohale, et see hakkab sind jälgima.',avoid:'Spordiklubi kaardi ostmist lootuses, et see treenib sinu eest.'},
          {text:'Kui sul on lemmikloom, on ta täna sinu personaaltreener, kes tasu ei küsi. Kui ei ole, ootavad õues vähemalt tuvid.',do:'Mine lõunapausil õue, isegi kui ilm on tujukas nagu aprill.',avoid:'Voodit, mis on päeva jooksul muutunud kontoriks, sööklaks ja kinoks.'}
        ]
      },
      { // 7
        headline:['Duett, mitte soolo','Kompromissi kunst','Peegel, peegel seinal'],
        day:[
          'Rambivalguses on täna kõik paarid: armunud, äripartnerid ja isegi sina oma kohvimasinaga. Kuula teist tähelepanelikult – vähemalt seni, kuni kohv valmis saab.',
          'Kompromissid sünnivad täna kergemini kui tavaliselt, isegi igavikulises küsimuses, kes valib õhtuks filmi. Kasuta võimalust ja lahenda üks vana vaidlus.',
          'Teised inimesed on täna nagu peegel, mis ei oska meelitada. Kui keegi ajab närvi, vaata hoolega – võib-olla näed seal midagi tuttavat.'
        ],
        love:[
          {text:'Suhetele on see päev nagu soe suvepäev – haruldane ja nautimist väärt. Üksikuna võid kohata kedagi, kes köidab rohkem kui lemmiksari.',do:'Planeeri aega kahekesi ja pane telefonid teise tuppa magama.',avoid:'Vanade tülide kordusseansse ilusal õhtul.'},
          {text:'Kompromiss on täna nagu pitsa: igaüks saab oma tüki ja keegi ei pea kõiki ananasse sööma. Ütle, mida vajad, ja küsi, mida teine tahab.',do:'Küsi lähedaselt: „Mida sa tegelikult tahad?“ – ja kuula vastus lõpuni.',avoid:'Vaidluse võitmist, mille hind on nädal aega jahedaid õhtuid.'},
          {text:'Kui oled kaalunud mõnda ühist otsust (kassi võtmist, kolimist või uut diivanit), on täna hea sellest rääkida. Kass on muidugi juba ammu otsustanud.',do:'Tee ühine otsus ära enne, kui arutelu jõuab kolmandasse hooaega.',avoid:'Teise eest otsustamist stiilis „ma ju tean, mis sulle meeldib“.'}
        ],
        work:[
          {text:'Läbirääkimised laabuvad täna nagu tango: sujuvalt, kui keegi teise varvastele ei astu. Alusta sellest, mis on mõlemale kasulik.',do:'Alusta läbirääkimist ühisest võidust, mitte oma nõudmiste nimekirjast.',avoid:'Kokkuleppeid, mis on kirjas ainult kahe inimese mälus.'},
          {text:'Peenike kiri on täna nagu kaktus: väike, aga torkab valusalt. Loe lepingud läbi enne, kui allkirja annad.',do:'Saada pärast kohtumist kokkuvõte – mälu on loominguline, e-kiri mitte.',avoid:'Nupule „Nõustun tingimustega“ vajutamist tingimusi lugemata.'},
          {text:'Kahekesi tehtud töö on täna nagu tandemjalgratas: kiirem, kui mõlemad väntavad. Leia keegi, kelle oskused sinu omi täiendavad.',do:'Paku koostööd kellelegi, kes oskab just seda, mis sind haigutama ajab.',avoid:'Ühise töö eest kogu aplausi endale korjamist.'}
        ],
        energy:[
          {text:'Teiste soovid pesitsevad täna sinu kalendris nagu käopojad võõras pesas. Jäta endale kas või üks nurk.',do:'Broneeri kalendrisse pool tundi endale ja kohtle seda nagu tähtsat koosolekut.',avoid:'Igale palvele „jah“ ütlemist enne, kui küsimus on lõpuni kuulatud.'},
          {text:'Ütlemata sõnad võivad täna istuda õlgadel nagu raske seljakott. Lase õlad alla ja hinga – kott ei pruugigi sinu oma olla.',do:'Tõsta õlad kõrvadeni ja lase alla – kolm kordust, publik plaksutab.',avoid:'Pahameele kogumist nagu postmarke albumisse.'},
          {text:'Seltskond laeb täna akusid ainult siis, kui laadija on õige. Vali inimesed, kellega koos on kerge, mitte need, kellele võlgned külaskäigu.',do:'Kohtu kellegagi, kelle juures võid kanda kõige mugavamaid pükse.',avoid:'Kohustuslikke kohtumisi, kus naeratus tuleb kella pealt.'}
        ]
      },
      { // 8
        headline:['Sügav vesi','Arved koputavad','Lahtilaskmise festival'],
        day:[
          'Kuu sukeldub täna sügavale ja võtab sind kaasa ilma ujumisprillideta. Hea päev ausaks vestluseks – pealiskaudne jutt ilmast jäägu homseks.',
          'Ühised rahaasjad ja laenud koputavad täna uksele nagu naaber, kes tuleb oma trelli tagasi küsima. Ava uks ja vaata asjad üle – eemale hoidmine ei tee neid väiksemaks.',
          'Täna on suurepärane päev millestki loobuda: vanast harjumusest, solvumisest või sahtlitäiest juhtmetest, mille otstarve on teadmata. Iga lahti lastud asi teeb ruumi uuele.'
        ],
        love:[
          {text:'Lähedus kasvab täna, kui julged näidata ka seda poolt, mis tavaliselt istub kapis. Usaldus kerkib nagu juuretisega leib – aeglaselt, aga kindlalt.',do:'Jaga lähedasega üht mõtet, mida tavaliselt hoiad kolme lukuga seifis.',avoid:'Armukadedust, mis põhineb ühel valesti tõlgendatud „meeldimisel“.'},
          {text:'Tšillikaste on täna hea võrdlus tunnetele: maitsev, aga mitte igaühele. Kui midagi häirib, ütle otse – vihjed on sama loetavad kui arsti käekiri.',do:'Ütle üks tunne välja täislausega, ilma et peaksid seda tabeliga põhjendama.',avoid:'Teise telefoni uurimist nagu krimisarja uurija.'},
          {text:'Mõni endine kallim võib täna ilmuda kas mõtetesse või, veel hullem, sõnumitesse. Pea meeles: sarjadel on viimane hooaeg põhjusega.',do:'Kirjuta üles, mida see suhe sulle õpetas, ja pane märkmik riiulile.',avoid:'Vastamist sõnumile „Hei, kuidas läheb?“ kell üks öösel.'}
        ],
        work:[
          {text:'Raha laenamine on täna nagu kassi laua peale lubamine: lubada on lihtne, tagasi võtta raske. Mõtle enne paar päeva.',do:'Vaata üle oma maksetähtajad enne, kui need end ise meelde tuletavad.',avoid:'Raha laenamist inimesele, kes ütleb „maksan kindlasti reedel“.'},
          {text:'Täna võid tööl avastada kulusid, mis on peidus nagu sokid diivani all. Ole täpne ja tee järeldused alles siis, kui kõik sokid on leitud.',do:'Küsi enne nõustumist kaks täpsustavat küsimust – tarkus on odavam kui parandus.',avoid:'Rahaotsuseid, mille ainus alus on lause „sõber ütles, et see on kindel värk“.'},
          {text:'Paroolid on täna nagu hambaharjad: neid ei jagata kellegagi. Ka mitte kõige toredama kolleegiga.',do:'Vaheta välja üks parool, mis on olnud kasutusel kauem kui su praegune telefon.',avoid:'Tööalaste saladuste jagamist kohvimasina juures, kus seintel on kõrvad.'}
        ],
        energy:[
          {text:'Sügavad tunded võivad täna väsitada rohkem kui kolimine viiendale korrusele ilma liftita. Võta tempo maha.',do:'Käi õhtul pikalt sooja duši all ja lase mõtetel koos veega ära voolata.',avoid:'Kõigi sõprade murede tassimist nagu reisikohvreid lennujaamas.'},
          {text:'Lahtilaskmine võib täna olla mõnusam kui ostlemine. Iga ära antud asi teeb kodu avaramaks ja sind kergemaks nagu sulg.',do:'Vii kotitäis asju taaskasutusse ja naudi kergust.',avoid:'Kümne aasta taguse piinliku hetke kordusetendust enne magamaminekut.'},
          {text:'Energia tuleb täna lainetena nagu rannas – vahel kõrge, vahel täiesti mõõnas. Surfa, kui laine tuleb, ja puhka, kui meri on vaikne.',do:'Tee rasked asjad ära kõrge laine ajal ja jäta mõõnaks tekk ja raamat.',avoid:'Väsimuse vastu võitlemist ainult kohvi ja kangekaelsusega.'}
        ]
      },
      { // 9
        headline:['Kohver vaimus pakitud','Miks, miks, miks?','Filosoofi tund'],
        day:[
          'Kuu pakib täna kohvrit ja kutsub sind kaasa, isegi kui sihtkoht on ainult naaberlinn. Planeeri reisi, kursust või vähemalt jalutuskäiku linnaossa, kus sa pole kunagi käinud.',
          'Täna oled uudishimulik nagu kolmeaastane, kes on just avastanud sõna „miks“. Küsi, loe ja kuula – vastused võivad üllatada.',
          'Filosofeerima tõmbab täna isegi poejärjekorras. Kirjuta üles üks suur eesmärk, enne kui see koos ostunimekirjaga unustusse vajub.'
        ],
        love:[
          {text:'Ühised unistused lähendavad täna rohkem kui ühine nõudepesu. Räägi kellegagi, kuhu te kunagi koos sõidaksite, isegi kui praegu jätkub raha ainult kaardi ostmiseks.',do:'Unista kellegagi valjusti reisist – unistamine on veel tasuta.',avoid:'Teise unistuste mahalaskmist lausega „Aga kes lilli kastab?“'},
          {text:'Täna paelub keegi, kes on sinust täiesti erinev: teine keel, teine maitse, teine arusaam heast muusikast. Erinevused on täna nagu vürts.',do:'Küsi kelleltki, mis annab tema elule mõtte, ja kuula nagu põnevat taskuhäälingut.',avoid:'Oma maailmavaate õpetamist teisele nagu kohustuslikku kursust.'},
          {text:'Kaugel elav kallis inimene võib täna meelde tulla nagu lemmiklaul raadios. Videokõne võib olla parem kui kümme südamega emotikoni.',do:'Helista kellelegi kaugel elavale inimesele ja näita talle vaadet oma aknast.',avoid:'Muinasjutulise tuleviku joonistamist inimesega, keda oled näinud kaks korda.'}
        ],
        work:[
          {text:'Aju imeb täna teadmisi nagu kuiv köögilapp vett. Kursus, raamat või kolleegi nõuanne läheb kohe käiku.',do:'Vaata ära üks erialane loeng, mis on ammu „vaata hiljem“ nimekirjas.',avoid:'Kõiketeadja rolli, mis sulgeb uksed uutele ideedele.'},
          {text:'Kauged kontaktid ja võõrkeelsed kirjad võivad täna tuua võimalusi. Grammatikavead on andestatavad, vaikimine mitte.',do:'Kirjuta julgelt võõras keeles – tõlkerakendus on sinu sõber, mitte vaenlane.',avoid:'Kirja kustutamist ainult sellepärast, et ühe sõna kääne jäi kahtlaseks.'},
          {text:'Karjäärile tasub täna vaadata kaugemale kui reedeni. Kus tahad olla aasta pärast – ja kas sinna saab ka bussiga?',do:'Kirjuta üles üks oskus, mis teeb su aasta pärast asendamatuks.',avoid:'Pika plaani vahetamist kiire võidu vastu, mis kestab nädalavahetuseni.'}
        ],
        energy:[
          {text:'Keha igatseb täna uusi muljeid nagu koer uusi lõhnu. Mine sealt, kust tavaliselt ei lähe – ka uus tänav on väike reis.',do:'Vali jalutuskäiguks marsruut, mille üle isegi navigaator imestab.',avoid:'Navigaatori pimesi uskumist, kui see juhatab sind otse järve.'},
          {text:'Mõtted rändavad täna kaugele ilma passi ja lennupiletita. Lase neil minna, aga hoia tagasisõidu pilet taskus.',do:'Vaata õhtul dokumentaalfilmi paigast, kuhu kunagi kindlasti lähed.',avoid:'Muretsemist asjade pärast, mis võivad juhtuda kunagi kümne aasta pärast.'},
          {text:'Reisil anna kehale aega harjuda, isegi kui hing on juba kohal. Kodus piisab seiklusest kohvikus linna teises otsas.',do:'Joo hommikukohv uues kohas ja tunne end turistina omas linnas.',avoid:'Puhkuseplaani, mis on tihedam kui töönädala kalender.'}
        ]
      },
      { // 10
        headline:['Sinu nimi tuledes','Eesmärk teravaks','Maine nagu valge särk'],
        day:[
          'Sinu töö on täna vaateaknal ja valgustus on hea. Näita, mida oled teinud – tagasihoidlikkus on ilus, aga mitte siis, kui kiituse korjab keegi teine.',
          'Eesmärgid paistavad täna selged nagu prilliklaasid pärast pesu. Kontrolli, kas tänased tegemised viivad sinna või tiirutavad ringiratast nagu robottolmuimeja.',
          'Maine on täna nagu valge särk: hoia seda puhtana ja jäta spagetid teiseks korraks. Pea lubadustest kinni ja lõpeta alustatu.'
        ],
        love:[
          {text:'Tööasjad võtavad täna nii palju ruumi, et tunded peavad istuma lisatoolil. Anna lähedasele märku, et ta pole ootejärjekorras.',do:'Saada kellelegi kallile sõnum, milles pole sõnu „koosolek“ ega „tähtaeg“.',avoid:'Õhtusööki, kus ainus jututeema on see, mida ülemus ütles.'},
          {text:'Kalender ja süda vaidlevad täna, kumb on tähtsam. Lahenda vaidlus enne, kui kalender vaikimisi võidab.',do:'Broneeri kalendrisse õhtu lähedastele ja märgi see „ülioluliseks“.',avoid:'Lubadusi stiilis „järgmisel nädalal kindlasti“, mida kuuldi juba eelmisel kuul.'},
          {text:'Tööüritusel võib täna keegi silma jääda – kontrolli enne, kas see on huvi või lihtsalt hästi istuv pintsak.',do:'Ole avatud vestlusele, mis algab tööst ja lõpeb hoopis lemmikraamatutega.',avoid:'Flirti, millest räägitakse kohvinurgas veel kolm nädalat.'}
        ],
        work:[
          {text:'Sinu tööalane tähtede seis on täna nii hea, et selle võiks raamida. Esita oma idee ja vaata, kuidas otsustajate kulmud tunnustavalt kerkivad.',do:'Mine juhi juurde ettepanekuga, mitte ainult murega.',avoid:'Tagasihoidlikkust, mis teeb su tulemused nähtamatuks nagu ninja.'},
          {text:'Sinu saavutused on täna nähtavad peaaegu kosmosest. Pane need kirja koos numbritega, sest numbritega on raske vaielda.',do:'Kirjuta kolm viimase aja võitu üles, nagu koostaksid oma fänniklubi infolehte.',avoid:'Enda võrdlemist kolleegiga, kelle tööpäev paistab sotsiaalmeedias imeline.'},
          {text:'Täna võib saabuda pakkumine, mis lõhnab edutamise järele. Nuusuta hoolega – vahel on see lihtsalt lisatöö, millele on parfüümi peale pandud.',do:'Võta endale üks nähtav ülesanne, mida märkab ka kõige kõrgem juht.',avoid:'Lisatöid, mida võtad vastu ainult sellepärast, et „ei“ jäi kurku kinni.'}
        ],
        energy:[
          {text:'Ambitsioon kütab täna nagu ahi, aga ahi vajab ka puid. Sea eesmärk ka puhkusele, mitte ainult tööle.',do:'Pane kalendrisse jalutuskäik ja anna sellele uhke nimi, näiteks „strateegiline koosolek“.',avoid:'Lõunapausi, mis kestab täpselt sama kaua kui kohvimasina piiks.'},
          {text:'Kiitus annab täna tiivad, aga lendamiseks pole vaja oodata teiste aplausi. Kiida ka iseennast.',do:'Ütle õhtul peeglile: „Hästi tehtud!“ – peegel ei vaidle kunagi vastu.',avoid:'Enda väärtuse mõõtmist postkastis olevate kirjade arvuga.'},
          {text:'Kehahoiak on täna nagu sinu isiklik reklaamplakat. Sirge selg ütleb „mul on kõik kontrolli all“, isegi kui sees valitseb kerge kaos.',do:'Sea meeldetuletus „õlad alla“ ja vaata, kui kõrgel need tegelikult olid.',avoid:'Arvuti taga kägaras istumist nagu krevett.'}
        ]
      },
      { // 11
        headline:['Grupivestlus ärkab','Unistajate klubi','Seltskond koguneb'],
        day:[
          'Grupivestlused ärkavad täna ellu, isegi see, mis jäi vait eelmisel aastavahetusel. Võta ühendust sõpradega, keda näed ammu ainult sünnipäevameeldetuletustes.',
          'Unistamine on täna lubatud ja isegi soovitatav, nagu jõuluvanale kirja kirjutades. Jaga oma ideid kellegagi, kes ei küsi kohe: „Aga raha?“',
          'Ühine tegevus annab täna rohkem rõõmu kui üksi nokitsemine. Liitu klubi, koori või talgutega – seal on alati keegi, kes toob kooki.'
        ],
        love:[
          {text:'Sõprade kaudu võib täna sisse lennata uus tutvus nagu konfetti peol. Mine kohale – diivanil konfettit ei saja.',do:'Võta kutse vastu – tekk ootab sind ka hiljem.',avoid:'Sõbra kosjasobitamist, kui ta seda ei tellinud.'},
          {text:'Sõprus on täna romantika salarelv: koos naermine lähendab rohkem kui küünlad. Üksikuna leiad parima seltskonna sõprade seast.',do:'Vaata kellegi kalliga kõige halvemat filmi ja kommenteeri seda nagu spordiülekannet.',avoid:'Kohustust olla iga hetk romantiline nagu reklaamis.'},
          {text:'Tulevikuplaanid on täna nagu mööblipoe kataloog: kõik tundub võimalik, kuni hakkad kokku panema. Räägi unistustest, aga hoia kruvid alles.',do:'Räägi kellegi lähedasega, kus te viie aasta pärast olla tahaksite – kas või Kuul.',avoid:'Oma unistuste kustutamist ainult sellepärast, et keegi kergitas kulmu.'}
        ],
        work:[
          {text:'Kontaktid on täna kulda väärt nagu hea meistri telefoninumber. Üks kiri vanale tuttavale võib avada ukse, mille olemasolust sa ei teadnudki.',do:'Kirjuta endisele töökaaslasele – „Kuidas läheb?“ kõlab paremini kui „Mul on sulle palve“.',avoid:'Tuttavatele kirjutamist ainult siis, kui on vaja kolimisel kappi tassida.'},
          {text:'Meeskonnatöö kõlab täna nagu orkester, kus kõik on lõpuks samal noodil. Las igaüks mängib oma pilli – trummar ei pea viiulit kätte võtma.',do:'Küsi ideid kogu meeskonnalt, ka vaikse nurga inimestelt.',avoid:'Koosolekut, kus räägib ainult see, kellel on kõige kõvem hääl ja kõige vähem ideid.'},
          {text:'Unistused vajavad täna eelarvet, isegi kui see on tilluke. Kirjuta üles, milleks kogud – „lihtsalt niisama“ säästab kõige halvemini.',do:'Tee unistuse jaoks eraldi kogumiskonto või purk ja anna sellele naljakas nimi.',avoid:'Säästmist, mis sulab esimese allahindluse peale nagu lumi aprillis.'}
        ],
        energy:[
          {text:'Sõbrad laevad täna akusid kiiremini kui ükski kiirlaadija. Isegi kümneminutiline kõne võib tuju tõsta päeva lõpuni.',do:'Helista sõbrale, kelle naer mõjub nagu tasuta teraapia.',avoid:'Seltskonda, pärast mida tunned end nagu pigistatud sidrun.'},
          {text:'Ühine trenn on täna lõbusam kui üksi pingutamine – ja keegi teine võib enne sind hingeldama hakata. Talgud ja ühised jalutuskäigud lähevad ka arvesse.',do:'Kutsu sõber ühisele jalutuskäigule – jutuga lähevad kilomeetrid kiiremini.',avoid:'Kõigi raskuste üksi tassimist, kui teised juba abi pakuvad.'},
          {text:'Mõtle täna, milline tahaksid olla tulevikus – ja mitte ainult selle järgi, mida algoritm sulle soovitab. Väike muutus praegu teeb hiljem suure vahe.',do:'Vali üks uus harjumus ja leia sõber, kes sulle sellest naeratades meelde tuletab.',avoid:'Sõprade elu võrdlemist nende kõige ilusamate puhkusepiltidega.'}
        ]
      },
      { // 12
        headline:['Lennukirežiim sees','Sisehääl räägib','Viimane pusletükk'],
        day:[
          'Kuu poeb täna sinu sisemisse koopasse ja paneb uksele sildi „Mitte segada“. Hea päev aeglustada ja lõpetada asju, mida keegi teine niikuinii ei märka.',
          'Intuitsioon räägib täna valjemini kui naabri remont. Kuula oma aimdusi – need on vahel täpsemad kui ilmateade.',
          'Päev sobib lõpetamiseks nagu pusle viimane tükk. Korrasta, lõpeta ja sulge kõik vahelehed – nii arvutis kui ka peas.'
        ],
        love:[
          {text:'Seltskondlikkust on sul täna nagu kassil vihmase ilmaga: lähedus on teretulnud, aga omadel tingimustel. Ütle seda ka teistele.',do:'Teata lähedastele, et oled täna lennukirežiimil, aga mitte kadunud.',avoid:'Pidu, kuhu lähed ainult selleks, et keegi ei solvuks.'},
          {text:'Kuues meel töötab täna nagu wifi, mis püüab naabri võrku. Usalda aimdust, aga kontrolli seda ühe pehme küsimusega.',do:'Küsi lähedaselt, kas tunned tema tuju õigesti – kristallkuulita.',avoid:'Teise mõtete lugemist ja hiljem solvumist, et tema sinu omi ära ei arvanud.'},
          {text:'Vanad mälestused võivad täna välja pudeneda nagu asjad kapist, mida pole ammu avatud. Vaata neid, aga jäta kesköised otsused tegemata.',do:'Kirjuta päevikusse kõik, mida ei taha kell kaks öösel sõnumina saata.',avoid:'Endise kallima vanade fotode vaatamist kurva muusika saatel.'}
        ],
        work:[
          {text:'Töömootor käib täna tühikäigul ja see on lubatud. Lõpeta vanu asju ja jäta uued vallutused kangelastele, kes on rohkem maganud.',do:'Lõpeta üks pooleli asi ja anna endale selle eest kujuteldav medal.',avoid:'Suuri otsuseid seisundis, mida võiks nimetada „aju on veel voodis“.'},
          {text:'Esinemine on täna sama mugav kui laulmine täis bussis. Tee pigem tööd, mis sobib vaiksesse nurka.',do:'Leia vaikne nurk ja tee üks asi ära nagu salaagent – keegi ei märka, aga tulemus on olemas.',avoid:'Suurt esinemist päeval, mil hääl tahab sosistada.'},
          {text:'Rahakott soovitab täna olla ettevaatlik nagu jänes lagendikul. Vaata arved üle, aga uued kohustused võivad oodata.',do:'Leia üks unustatud püsimakse ja vallanda see.',avoid:'Lepinguid, mille peenikest kirja lugesid sama hoolega kui kasutustingimusi.'}
        ],
        energy:[
          {text:'Keha palub täna puhkust sama viisakalt kui tühjeneva aku piiks. Kuula enne, kui ta end ise välja lülitab.',do:'Mine magama nii vara, et isegi telefon imestab.',avoid:'Kohustuslikku trenni päeval, mil keha tahab ainult tekki.'},
          {text:'Vaikus on täna sinu isiklik spaa ja sissepääs on tasuta. Üksindus pole igav, kui seda nimetada „ajaks iseendale“.',do:'Veeda pool tundi täielikus vaikuses – ilma taskuhäälingute ja muusikata.',avoid:'Uudiste kontrollimist iga viie minuti tagant, nagu sõltuks sellest maailma saatus.'},
          {text:'Keha saadab täna vaikseid märke nagu introvert grupivestluses. Kui midagi kurnab, on sul luba sellest loobuda.',do:'Tee õhtul midagi rahustavat, millel pole mingit kasulikku eesmärki – see ongi mõte.',avoid:'Kangelaslikku pingutamist päeval, mil isegi kohv palub puhkust.'}
        ]
      }
    ]
  }
};
