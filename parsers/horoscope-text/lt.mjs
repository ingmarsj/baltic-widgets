// Lithuanian horoscope copy. Written natively; read HOROSCOPE_EDITORIAL_RULES.md before editing.
// Address the reader as „tu“ and never let a participle, adjective or noun reveal the reader's gender
// (no „pasiruošęs/pasiruošusi“, „būk atsargus“, „-damas/-dama“, „pats/pati“, „vienas/viena“). Neuter forms (gera, ramu) are fine.
// Avoid same-subject padalyvis with an imperative („užuot rašius, užeik“): the norm wants a gendered pusdalyvis, so rephrase.
// Time: „16.54 val.“ (hours without a leading zero); dates: „lapkričio 24 d.“.
const signs={
  nom:['Avinas','Jautis','Dvyniai','Vėžys','Liūtas','Mergelė','Svarstyklės','Skorpionas','Šaulys','Ožiaragis','Vandenis','Žuvys'],
  // Vietininkas: „Mėnulis Jautyje“.
  loc:['Avine','Jautyje','Dvyniuose','Vėžyje','Liūte','Mergelėje','Svarstyklėse','Skorpione','Šaulyje','Ožiaragyje','Vandenyje','Žuvyse'],
  // Galininkas after „į“ and „palieka“: „pereina į Jautį“.
  acc:['Aviną','Jautį','Dvynius','Vėžį','Liūtą','Mergelę','Svarstykles','Skorpioną','Šaulį','Ožiaragį','Vandenį','Žuvis']
};
const bodies={Sun:'Saulė',Moon:'Mėnulis',Mercury:'Merkurijus',Venus:'Venera',Mars:'Marsas',Jupiter:'Jupiteris',Saturn:'Saturnas'};
const monthsGen=['sausio','vasario','kovo','balandžio','gegužės','birželio','liepos','rugpjūčio','rugsėjo','spalio','lapkričio','gruodžio'];
const clock=hhmm=>{const [h,m]=hhmm.split(':');return `${Number(h)}.${m}`;};
const time=hhmm=>`${clock(hhmm)} val.`;
const day=iso=>Number(iso.slice(8,10)),month=iso=>Number(iso.slice(5,7))-1;
const date=iso=>`${monthsGen[month(iso)]} ${day(iso)} d.`;
// At the end of a label a trailing „d.“ would read as a full stop, so use the ordinal:
// „iki gruodžio 21-osios“, but „trečiosios“ → „iki spalio 23-iosios“, „sausio 3-iosios“.
const dateEnd=iso=>{const d=day(iso);return `${monthsGen[month(iso)]} ${d}-${d%10===3&&d!==13?'iosios':'osios'}`;};
const cap=text=>text.replace(/^./,c=>c.toUpperCase());
// „Mėnulis tavo antrajame name“.
const houseLoc=['pirmajame','antrajame','trečiajame','ketvirtajame','penktajame','šeštajame','septintajame','aštuntajame','devintajame','dešimtajame','vienuoliktajame','dvyliktajame'];
const phases={new_moon:'Jaunatis',first_quarter:'Pirmasis ketvirtis',full_moon:'Pilnatis',last_quarter:'Paskutinis ketvirtis',waxing:'Priešpilnis',waning:'Delčia'};
// Retrograde wording is always „retrogradinis judėjimas“; Venus is the only feminine planet in the list.
const retrograde=body=>body==='Venus'?'retrogradinė':'retrogradinis';

export default {
  lang:'lt',
  signs,bodies,
  // Short names of the twelve whole-sign houses, used in the sky panel.
  houseNames:['tu ir tavo nuotaika','pinigai ir vertybės','pokalbiai ir žinios','namai ir šeima','meilė ir džiaugsmas','kasdieniai darbai ir įpročiai','santykiai ir partnerystė','artumas ir bendri pinigai','kelionės ir mokymasis','karjera ir tikslai','draugai ir ateitis','poilsis ir vidinis pasaulis'],
  sky:{
    labels:{moon:'Mėnulis',phase:'Fazė',sun:'Saulė',next_full:'Artimiausia pilnatis',next_new:'Artimiausia jaunatis',planets:'Planetos',sign:'Tavo ženklas',theme:'Dienos tema'},
    phases,
    elements:{fire:'Ugnies ženklas',earth:'Žemės ženklas',air:'Oro ženklas',water:'Vandens ženklas'},
    // Header chip, e.g. „Mėnulis Avine · nuo 12.10 val. Jautyje“.
    chip:segments=>[`${bodies.Moon} ${signs.loc[segments[0].sign]}`,...segments.slice(1).map(s=>`nuo ${time(s.from)} ${signs.loc[s.sign]}`)].join(' · '),
    moon:(segments,next)=>segments.length===1
      ?`Visą dieną ${signs.loc[segments[0].sign]} (iki ${date(next.date)} ${time(next.time)})`
      :cap(segments.map((s,i)=>i===segments.length-1?`paskui ${signs.loc[s.sign]}`:`${signs.loc[s.sign]} iki ${time(s.until)}`).join(', ')),
    phase:(id,illumination,event)=>event
      ?`${phases[event.id]} ${time(event.time)} ${signs.loc[event.sign]}`
      :`${phases[id]}, apšviesta ${illumination} % disko`,
    event:e=>`${cap(date(e.date))} ${time(e.time)} ${signs.loc[e.sign]}`,
    sun:(sign,ingress,next)=>ingress
      ?`${signs.loc[ingress.from]} iki ${time(ingress.time)}, paskui ${signs.loc[ingress.to]}`
      :`${signs.loc[sign]} iki ${dateEnd(next.date)}`,
    planet:p=>{
      let text=p.ingress?`${signs.loc[p.ingress.from]} iki ${time(p.ingress.time)}, paskui ${signs.loc[p.ingress.to]}`:signs.loc[p.sign];
      if(p.station)text+=p.station.turns==='retrograde'?`; ${time(p.station.time)} pradeda retrogradinį judėjimą`:`; ${time(p.station.time)} baigia retrogradinį judėjimą`;
      else if(p.retrograde)text+=`, ${retrograde(p.body)}`;
      return text;
    },
    sign:(element,ruler,rulerSign)=>`${element}, valdančioji planeta – ${bodies[ruler]} (dabar ${signs.loc[rulerSign]})`,
    theme:(house,name)=>`${cap(name)} – Mėnulis tavo ${houseLoc[house-1]} name`
  },
  serious:{
    // One sentence about an exact sky event; the house text follows it.
    events:{
      sunOwn:e=>`Saulė ${time(e.time)} įžengia į tavo ženklą: artimiausias savaites jėgų gali būti daugiau nei įprastai.`,
      sunIngress:e=>`Saulė ${time(e.time)} palieka ${signs.acc[e.from]} ir pereina į ${signs.acc[e.to]} – prasideda naujas astrologinis mėnuo.`,
      fullMoon:e=>e.own
        ?`Pilnatis tavo ženkle – ${time(e.time)}, tad jausmai gali būti ryškesni nei įprastai, o diena labiau tinka užbaigti nei pradėti.`
        :`Pilnatis ${signs.loc[e.sign]} – ${time(e.time)}, todėl jausmai gali įsiliepsnoti greičiau nei įprastai.`,
      newMoon:e=>e.own
        ?`Jaunatis tavo ženkle – ${time(e.time)}, tad tai geras metas sumanymui, kuris skirtas tik tau.`
        :`Jaunatis ${signs.loc[e.sign]} – ${time(e.time)}, tad tinka brandinti sumanymus, o ne skubėti su garsiais sprendimais.`,
      station:e=>`${bodies[e.body]} ${time(e.time)} `+({
        Mercury:{retrograde:'pradeda retrogradinį judėjimą: artimiausias savaites verta dukart patikrinti žinutes, sutartis ir kelionių planus.',direct:'baigia retrogradinį judėjimą, ir užstrigę pokalbiai bei planai pamažu vėl pajuda.'},
        Venus:{retrograde:'pradeda retrogradinį judėjimą: seni jausmų ir pinigų klausimai gali sugrįžti, kad pagaliau būtų išspręsti.',direct:'baigia retrogradinį judėjimą, ir sprendimai, susiję su jausmais bei pirkiniais, tampa aiškesni.'},
        Mars:{retrograde:'pradeda retrogradinį judėjimą: jėgas geriau skirti pradėtiems darbams užbaigti, o ne naujoms kovoms.',direct:'baigia retrogradinį judėjimą, ir įstrigę darbai vėl įgauna pagreitį.'}
      })[e.body][e.turns],
      moonChange:e=>`Iki ${time(e.time)} Mėnulis dar yra ${signs.loc[e.from]}, paskui pereina į ${signs.acc[e.to]}.`
    },
    headlines:{sunOwn:'Prasideda tavo mėnuo',fullMoonOwn:'Pilnatis tavo ženkle',newMoonOwn:'Nauja pradžia tavo ženkle'},
    // Twelve whole-sign houses of the day's main Moon sign, counted from the reader's sign.
    // Each list has three entries; entry n of every list is used on the same day.
    houses:[
      { // 1: the Moon in the reader's sign
        headline:['Tavo ritmas, tavo kryptis','Metas imtis iniciatyvos','Pirmiausia – tu'],
        day:[
          'Šią dieną Mėnulis skiria tau: jausmai ryškesni, o sprendimai gimsta greičiau. Gera diena daryti tai, ko nori tu, o ne tik tai, ko tikisi kiti.',
          'Ryte gali kilti noras viską pertvarkyti savaip – nuo darbo stalo iki savaitės plano. Tą užsidegimą nukreipk į vieną svarbų darbą ir pažiūrėk, kiek nuveiksi.',
          'Diena kviečia stabtelėti ir paklausti savęs, ko iš tikrųjų nori. Kol dar nesutikai su kitų planais, skirk minutę sau – tavo poreikiai šiandien svarbūs.'
        ],
        love:[
          {text:'Šiandien lengvai patrauki dėmesį, o žmonės atsiliepia noriau. Jei norisi ką nors pakviesti ar parašyti, tobulos akimirkos laukti nereikia.',do:'Pakviesk kavos žmogų, apie kurį pastaruoju metu vis pagalvoji.',avoid:'Flirto su visais iš karto, kai iš tiesų rūpi vienas žmogus.'},
          {text:'Savo jausmus šiandien įvardyti lengviau, o artimas žmogus greičiausiai juos išgirs aiškiau nei įprastai. Kalbėk apie save, ne apie kito klaidas.',do:'Pradėk sakinį žodžiais „man svarbu“ ir pabaik jį nuoširdžiai.',avoid:'Senų nuoskaudų sąrašo, ištraukto pačiu netinkamiausiu metu.'},
          {text:'Smulkmenos šiandien gali užgauti labiau nei įprastai. Prieš darant išvadas verta prisiminti, kad kiti irgi turi savų rūpesčių.',do:'Ramiai pasakyk, kas užgavo – šiandien tai padaryti lengviau nei po savaitės.',avoid:'Įsižeidimo dėl to, kad žinutėje nebuvo nė vienos šypsenėlės.'}
        ],
        work:[
          {text:'Iniciatyva šiandien veikia tavo naudai, o garsiai pasakytos idėjos randa klausytojų greičiau nei paprastai.',do:'Pasiūlyk savo sprendimą susitikime ar laiške ir paprašyk grįžtamojo ryšio.',avoid:'Darbų, kurių imiesi tik tam, kad nereikėtų pasakyti „ne“.'},
          {text:'Geriausiai šiandien sekasi ten, kur sprendžia tavo nuovoka, o ne ilgos derinimo grandinės. Pasitikėk savo sprendimais ir aiškiai juos paaiškink kitiems.',do:'Imkis atsakomybės už vieną aiškiai apibrėžtą užduotį.',avoid:'Bandymo kiekvieną smulkmeną suderinti su visais iš eilės.'},
          {text:'Norisi greitų sprendimų, bet pinigų klausimais nuotaika – prastas patarėjas. Didesnę sutartį ar pirkinį verta dar kartą peržiūrėti rytoj, šviežia galva.',do:'Prieš didesnį mokėjimą užsirašyk kainą, naudą ir bent vieną alternatyvą.',avoid:'Apsipirkimo internete vien tam, kad praskaidrėtų diena.'}
        ],
        energy:[
          {text:'Jėgų šiandien netrūksta, o kūnas aiškiai prašosi judesio. Greitas žingsnis, dviratis ar šokis virtuvėje – tinka viskas, kas tave pajudina.',do:'Išeik pasivaikščioti greitu žingsniu bent pusvalandžiui.',avoid:'Ginčų socialiniuose tinkluose, kurie suryja rytinę energiją.'},
          {text:'Šiandien nuotaiką lengvai paveikia aplinka: žinios, oras ar kito žmogaus tonas. Pradėk dieną nuo to, kas tave ramina, o ne nuo naujienų antraščių.',do:'Įsijunk dainą, kuri visada pataiso nuotaiką, dar prieš pusryčius.',avoid:'Svetimos prastos nuotaikos prisiėmimo kaip savos.'},
          {text:'Šiandien lengviau pajusti, kas tau iš tikrųjų tinka, o kas tik atima jėgas. Šia nuojauta verta remtis dėliojant vakaro planus.',do:'Vakarui pasirink veiklą, po kurios lengviau kvėpuoti.',avoid:'Susitikimų, į kuriuos eini tik todėl, kad nepatogu atsisakyti.'}
        ]
      },
      { // 2: money, values, comfort
        headline:['Laikas susitvarkyti finansus','Kas tau iš tikrųjų vertinga','Tvirtas pagrindas po kojomis'],
        day:[
          'Pinigų reikalai šiandien atrodo aiškesni nei įprastai. Tinkamas metas peržvelgti išlaidas ir rasti spragas, pro kurias pinigai nuteka tyliai ir be jokios naudos.',
          'Šiandien traukia tai, kas apčiuopiama: minkštas pledas, šilta vakarienė, tvarkingas sąskaitos likutis. Saugumo jausmą galima susikurti mažais, apgalvotais žingsniais.',
          'Šiandien pravartu paklausti savęs, už ką iš tiesų verta mokėti – pinigais, laiku ar jėgomis. Sąžiningas atsakymas palengvina ir kitus sprendimus.'
        ],
        love:[
          {text:'Artumą šiandien stiprina paprasti malonumai: skanus maistas, jaukus vakaras ir neskubus laikas kartu. Laisva širdis tegul palepina save taip, kaip lepintų mylimą žmogų.',do:'Paruošk vakarienę, kurios kvapas pasitiks artimą žmogų jau tarpduryje.',avoid:'Kalbų apie skolas ir sąskaitas pačiu jaukiausiu vakaro metu.'},
          {text:'Santykiuose šiandien svarbiausia patikimumas: ištesėtas mažas pažadas sveria daugiau už dideles kalbas. Jei širdis laisva, atkreipk dėmesį į tuos, kurių žodžiai sutampa su darbais.',do:'Paskirk artimam žmogui laiką kalendoriuje ir laikykis jo kaip svarbaus susitikimo.',avoid:'Savo santykių lyginimo su gražiausiomis kitų nuotraukomis socialiniuose tinkluose.'},
          {text:'Šiandien net viena bendro pirkinių sąrašo eilutė gali tapti jautria tema. Apie pinigus kalbėk ramiai ir be kaltinimų.',do:'Pasiūlyk paprastą taisyklę, kas už ką moka, kad nereikėtų kaskart derėtis.',avoid:'Užuominų apie tai, kas kiek uždirba.'}
        ],
        work:[
          {text:'Skaičiai šiandien klusnūs: sąskaitos, sąmatos ir lentelės susidėlioja greičiau nei įprastai. Pasinaudok tuo ir peržiūrėk, už ką moki kas mėnesį.',do:'Surašyk visus kas mėnesį nuskaičiuojamus mokėjimus į vieną sąrašą.',avoid:'Smulkių kasdienių išlaidų, kurių „vis tiek niekas neskaičiuoja“.'},
          {text:'Šiandien tinka pasirūpinti pajamų puse: susigrąžinti tai, kas tau priklauso, ar pagaliau peržiūrėti savo įkainius arba atlyginimą.',do:'Pasidomėk, kiek panašus darbas šiuo metu vertinamas rinkoje.',avoid:'Darbo už „ačiū“, kai buvo sutarta dėl atlygio.'},
          {text:'Ypač traukia daiktai, žadantys jaukumą ir patogumą. Prieš apmokant krepšelį verta paklausti savęs, kiek kartų tą daiktą iš tikrųjų naudosi.',do:'Palik norimą daiktą krepšelyje iki rytojaus ir tik tada nuspręsk.',avoid:'Išpardavimų, kai nuolaida svarbesnė už patį daiktą.'}
        ],
        energy:[
          {text:'Paprasti dalykai šiandien grąžina jėgas greičiausiai: patogūs drabužiai, neskubus tempas ir ramus valgis prie stalo.',do:'Vakarienę šį kartą valgyk lėtai, be ekrano ir pokalbių apie darbą.',avoid:'Drabužių, kurie spaudžia, vien dėl to, kad gražiai atrodo.'},
          {text:'Pojūčiai šiandien ypač aštrūs: mėgstama muzika, kvapni arbata ar gėlės ant stalo gali pakeisti visos dienos toną. Leisk sau tuo pasimėgauti nelaukiant savaitgalio.',do:'Pakeisk patalynę ir pasidžiauk šviežiu jos kvapu dar šį vakarą.',avoid:'Dienos be nė vienos minutės gryname ore.'},
          {text:'Jaukumas šiandien suteikia jėgų: tvarkinga aplinka, mėgstamas puodelis ir kampas, kuriame gera pabūti.',do:'Pasimėgauk vakare vienu mažu malonumu, kurio paprastai sau neleidi.',avoid:'Savęs nuvertinimo vien dėl to, kad kiti turi daugiau.'}
        ]
      },
      { // 3: conversations, messages, learning
        headline:['Žodžiai, kurie atveria duris','Diena pokalbiams','Smalsumas veda į priekį'],
        day:[
          'Pokalbiai ir žinutės šiandien įgauna pagreitį. Tinkamas metas paskambinti, paklausti ar pagaliau atsakyti į laišką, kuris jau kelias dienas laukia dėmesio.',
          'Idėjos šiandien gimsta pakeliui – eilėje, kelyje ar trumpai pasivaikščiojant. Smalsumas dabar geriausias mokytojas, tad drąsiai klausinėk ir domėkis.',
          'Netikėtas pokalbis su kaimynais, broliais ar seserimis šiandien gali atnešti naudingą patarimą. Svarbiausia dažnai pasakoma tarp kitko, tad verta klausytis atidžiau nei paprastai.'
        ],
        love:[
          {text:'Lengvas pokalbis šiandien gali peraugti į kai ką daugiau. Jei dar ieškai savo žmogaus, smalsumas ir gera žinutė suveiks geriau nei tobulai apgalvota strategija.',do:'Parašyk patinkančiam žmogui apie tai, kas tave šiandien prajuokino.',avoid:'Tobulos žinutės dėliojimo ištisą valandą, kai užtektų paprasto „labas“.'},
          {text:'Su artimais žmonėmis šiandien svarbiausia ne tai, kas pasakyta, o kaip. Švelnesnis tonas ir vienas patikslinantis klausimas apsaugos nuo nesusipratimo.',do:'Vietoj įsižeidimo paklausk: „Ką turėjai galvoje?“',avoid:'Išvadų darymo vien iš žinutės tono.'},
          {text:'Šiandien jausmus stiprina smulkmenos: prisimintas pokalbis, klausimas „kaip praėjo?“ ar mėgstamas užkandis, paliktas ant stalo. Tokie ženklai suartina labiau nei dideli žodžiai.',do:'Paskambink artimam žmogui vien tam, kad išgirstum balsą.',avoid:'Dėmesio, taupomo tik šventėms.'}
        ],
        work:[
          {text:'Derybos, skambučiai ir susitikimai šiandien klostosi sklandžiau nei įprastai. Tinkamas metas pristatyti idėją žmonėms, nuo kurių priklauso sprendimas.',do:'Susisiek su tuo, kam seniai ketinai paskambinti dėl darbo.',avoid:'Svarbių pokalbių atidėjimo vien dėl nedrąsos.'},
          {text:'Mokytis ir perprasti naujus dalykus šiandien sekasi lengviau. Trumpas straipsnis ar vaizdo įrašas gali padėti išspręsti užduotį, kuri seniai stringa.',do:'Skirk pusvalandį naujam įrankiui ar programai, kuri palengvintų darbą.',avoid:'Senų įpročių laikymosi vien todėl, kad „visada taip darėme“.'},
          {text:'Trumpos kelionės ir susitikimai šiandien gali būti naudingesni nei sėdėjimas vienoje vietoje. Gyvas pokalbis išsprendžia tai, kas laiškuose strigo savaitę.',do:'Vietoj dar vieno laiško užeik pas kolegą ar klientą asmeniškai.',avoid:'Susitikimų be darbotvarkės, kurie užtrunka dvigubai ilgiau, nei buvo numatyta.'}
        ],
        energy:[
          {text:'Šiandien naudinga judėti ir kalbėtis vienu metu: pasivaikščiojimas su draugu ar kaimynu atgaivina ir kūną, ir mintis.',do:'Kitam pokalbiui telefonu išeik į lauką ir pasivaikščiok.',avoid:'Visos dienos uždarose patalpose, kai lauke bent kiek šviesu.'},
          {text:'Mintys šiandien sukasi greitai, tad jas lengvai išblaško kiekvienas pranešimas. Tyla ir trumpos pauzės padeda atskirti svarbias nuo triukšmo.',do:'Išjunk nereikalingus pranešimus bent porai valandų.',avoid:'Kelių darbų vienu metu, kai galva ir taip pilna.'},
          {text:'Nauja tema, knygos skyrius ar trumpa pamoka šiandien pažadina labiau nei kavos puodelis. Smalsumas – geriausias energijos šaltinis.',do:'Išmok šiandien ką nors naujo, kad ir mažo: naują žodį, sąvoką ar sparčiųjų klavišų derinį.',avoid:'Begalinio naršymo, po kurio neprisimeni nė vieno perskaityto dalyko.'}
        ]
      },
      { // 4: home, family, roots
        headline:['Namai kaip uostas','Šaknys ir šiluma','Jaukumo diena'],
        day:[
          'Šiandien norisi pabūti ten, kur jauku ir saugu. Vakaras namie, mažiau įsipareigojimų ir artimi žmonės šalia padės atgauti pusiausvyrą.',
          'Namiškių reikalai šiandien gali pareikalauti daugiau dėmesio nei darbas. Kantrybė ir šiltas žodis dabar padės labiau nei greiti sprendimai.',
          'Tvarkytis šiandien naudinga ne tik spintoje, bet ir mintyse. Išmesta sena smulkmena ar kitaip pastatyta lempa kartais suteikia stebėtinai daug ramybės.'
        ],
        love:[
          {text:'Šiluma šiandien slypi paprastuose dalykuose: apkabinime, tylioje kartu praleistoje valandoje, pažįstamame juoke.',do:'Paklausk namiškių, kas jiems šiandien buvo sunkiausia, ir išklausyk.',avoid:'Svarbių šeimos sprendimų paskubomis, tarpduryje.'},
          {text:'Namų tema šiandien jautri: kas plauna indus ir kieno eilė išnešti šiukšles, gali tapti didesniu klausimu, nei verta. Tokius dalykus spręsk su šypsena.',do:'Susitark su namiškiais dėl paprasto namų darbų pasidalijimo.',avoid:'Tylaus pykčio dėl neišplautų puodelių.'},
          {text:'Šiandien šilčiausi jausmai gali būti skirti šeimai ir seniems draugams. Bendri prisiminimai ir pažįstamos tradicijos suartina labiau nei dideli planai.',do:'Atgaivink vieną mažą šeimos tradiciją, pavyzdžiui, sekmadienio blynus ar vakaro arbatą.',avoid:'Lyginimosi su tuo, kaip namus ir šventes tvarko kitos šeimos.'}
        ],
        work:[
          {text:'Dėmesys šiandien krypsta namų link, tad darbo tempas gali atrodyti lėtesnis. Užbaik būtiniausius reikalus, o didesnius sprendimus palik dienai, kai galva bus laisvesnė.',do:'Pasirink tris būtiniausias užduotis ir užbaik jas iki pietų.',avoid:'Didelių įsipareigojimų, kai mintys sukasi apie namus.'},
          {text:'Jei įmanoma, šiandien verta dirbti iš namų ar bent ramesnėje vietoje. Pažįstama aplinka padeda susikaupti ir sutaupo jėgų.',do:'Susitvarkyk darbo vietą taip, kad joje būtų jauku praleisti kelias valandas.',avoid:'Darbų, kurie be reikalo nusitęsia iki vėlyvo vakaro.'},
          {text:'Šiandien naudinga pasirūpinti namų reikalais: būsto dokumentais, draudimu ar remonto planu. Tvarka namuose suteikia ramybės ir darbe.',do:'Pasitikrink, kada baigiasi būsto draudimas ar kitos svarbios sutartys.',avoid:'Didelių remonto sprendimų be aiškios sąmatos.'}
        ],
        energy:[
          {text:'Ramybė šiandien suteikia daugiau jėgų nei veikla. Paprasti namų ritualai – arbata, tylus vakaras, ankstesnis miegas – padės atsigauti.',do:'Šį vakarą skirk laiko šiltai voniai ar ilgam dušui ir leisk dienai nutekėti kartu su vandeniu.',avoid:'Vakarinių naujienų, kurios neša nerimą į namus.'},
          {text:'Šiandien savijautą stipriai veikia aplinka: šaltis, triukšmas ar netvarka vargina greičiau nei paprastai.',do:'Išvėdink kambarį ir įsijunk šiltą, jaukią šviesą.',avoid:'Ginčų apie buitį, kai visi namuose pavargę.'},
          {text:'Šiandien jėgų suteikia tai, kas sava: šeimos receptas, mėgstama vaikystės knyga ar pasivaikščiojimas pažįstamomis gatvėmis.',do:'Išsivirk patiekalą pagal šeimos receptą ir pasidalyk juo su kuo nors.',avoid:'Graužimosi dėl to, ko praeityje jau nebepakeisi.'}
        ]
      },
      { // 5: romance, pleasure, creativity
        headline:['Širdis pirmoje eilėje','Diena džiaugsmui','Leisk sau žaisti'],
        day:[
          'Mylėti, kurti ir džiaugtis šiandien norisi labiau nei įprastai. Puiki diena flirtui, pomėgiams ir viskam, kas verčia šypsotis be jokios praktinės naudos.',
          'Kūrybinė energija šiandien trykšta, tad tinka viskas, kas gimsta tavo rankomis: piešinys, pyragas ar daina. Svarbiausia ne rezultatas, o pats kūrimo džiaugsmas.',
          'Diena palanki žaidimams, spontaniškoms išvykoms ir pokalbiams, kuriuose daug juoko. Jei šalia yra vaikų, jų energija gali užkrėsti ir tave.'
        ],
        love:[
          {text:'Drąsa jausmuose šiandien pasiteisina dažniau nei paprastai. Jei širdis laisva, pirmas žingsnis gali būti tavo, o poroje – netikėtas romantiškas planas.',do:'Pakviesk patinkantį žmogų į pasimatymą ar bent ilgesniam pokalbiui.',avoid:'Lyginimo su buvusiais, kai prieš tave visai kitas žmogus.'},
          {text:'Netikėtumai šiandien gaivina jausmus: kvietimas be progos, gėlė be priežasties ar pasivaikščiojimas sutemus. Tinka ir naujai pažinčiai, ir ilgiems santykiams.',do:'Suorganizuok mažą staigmeną, kuri kainuoja daugiau dėmesio nei pinigų.',avoid:'Romantikos atidėjimo „geresniems laikams“.'},
          {text:'Šiandien labiausiai traukia natūralumas, o ne tobula laikysena. Bendras pomėgis ar smagi kompanija padeda užmegzti pažintį, o poroje – vėl pajusti lengvumą.',do:'Pasiūlyk nueiti į komedijos vakarą ar kitą renginį, kuriame daug juoko.',avoid:'Bandymo atrodyti nepriekaištingai kiekvieną akimirką.'}
        ],
        work:[
          {text:'Malonesni dalykai šiandien traukia labiau, tad įprastos užduotys gali atrodyti nuobodesnės. Mažas iššūkis sau padės jas atgaivinti.',do:'Atlik rutininę užduotį nauju būdu ir pažiūrėk, kas pasikeis.',avoid:'Svarbių sprendimų, priimtų vien iš nuobodulio.'},
          {text:'Kūrybinės užduotys šiandien sekasi geriau nei skaičiai ir ataskaitos. Jei įmanoma, skirk laiko idėjoms, o tikslius darbus atlik vėliau.',do:'Užsirašyk penkias idėjas, net ir pačias keisčiausias.',avoid:'Rizikingų investicijų, kurios atrodo kaip smagus žaidimas.'},
          {text:'Pinigų srityje šiandien gali kilti noras išlaidauti pramogoms. Mažas malonumas – gerai, bet didesnes išlaidas verta apgalvoti.',do:'Iš anksto nuspręsk, kiek šiandien gali išleisti pramogoms.',avoid:'Pirkinių, kurie džiugina tik iki pirmo panaudojimo.'}
        ],
        energy:[
          {text:'Jėgų šiandien su kaupu, tad jas verta nukreipti į tai, kas teikia džiaugsmo. Sportas su draugais ar ilgas pasivažinėjimas dviračiu tiks puikiai.',do:'Išbandyk naują judėjimo būdą, pavyzdžiui, laipiojimo sienelę ar baseiną.',avoid:'Sporto, kuris primena bausmę, o ne malonumą.'},
          {text:'Šiandien poilsis – tai ne gulėjimas, o užsiėmimas, nuo kurio sužimba akys. Pomėgis gali grąžinti daugiau jėgų nei dar viena valanda prie ekrano.',do:'Skirk bent valandą pomėgiui, kuriam vis neturėdavai laiko.',avoid:'Kaltės jausmo dėl to, kad leidi sau pasidžiaugti.'},
          {text:'Žaidimas šiandien grąžina jėgas – bet koks: kamuolys kieme, galvosūkis ar stalo tenisas. Kai kūnas ir galva pramogauja kartu, nuovargis traukiasi.',do:'Rask pusvalandį žaidimui, kuriame svarbiau pats procesas nei rezultatas.',avoid:'Įsitikinimo, kad poilsis turi būti „naudingas“.'}
        ]
      },
      { // 6: routine, tasks, health habits
        headline:['Tvarka, kuri suteikia jėgų','Diena darbams','Maži įpročiai, dideli pokyčiai'],
        day:[
          'Šiandien kasdienybė prašosi tvarkos: darbų sąrašas, dienotvarkė, net dokumentų aplankas. Kiekvienas užbaigtas smulkus reikalas suteiks daugiau ramybės, nei tikiesi.',
          'Diena tinka nuobodiems, bet svarbiems darbams, kurie seniai atidėti. Užduotis, kuri atrodė kaip kalnas, šiandien gali pasirodyti tik kalvelė.',
          'Pravartu pažvelgti į savo įpročius iš šalies: kurie padeda, o kurie tik vagia laiką ir jėgas. Tai, kas kartojasi kasdien, lemia daugiau nei retkarčiais padaryti žygdarbiai.'
        ],
        work:[
          {text:'Šiandien darbai juda sklandžiai, o aiškus planas padeda nuveikti daugiau nei įprastai. Tinkamas metas imtis užduočių, kurias vis atidėdavai.',do:'Sudaryk šios dienos sąrašą ir prie kiekvieno punkto prirašyk, kiek laiko jam skirsi.',avoid:'Smulkių pertraukėlių socialiniuose tinkluose, kurios suryja visą valandą.'},
          {text:'Kolegomis šiandien verta pasikliauti. Kai kiekvienas žino savo dalį, darbas vyksta greičiau, o įtampos mažiau.',do:'Paprašyk pagalbos žmogaus, kuris tą darbą išmano geriausiai.',avoid:'Ginčų, kas kaltas, kai laiko užtektų problemai išspręsti.'},
          {text:'Smulkūs darbai šiandien gali užtrukti ilgiau, nei planavai. Pinigų srityje tinka patikrinti, ar visos sąskaitos apmokėtos laiku.',do:'Nusistatyk priminimus apie periodinius mokėjimus, kad nė vienas nevėluotų.',avoid:'Darbotvarkės be jokio laisvo tarpo nenumatytiems reikalams.'}
        ],
        energy:[
          {text:'Aiškus ritmas šiandien palaiko jėgas: darbas, trumpa pertrauka, vėl darbas. Akims ir nugarai dažnesni atokvėpiai dabar ypač naudingi.',do:'Kas valandą atsistok, pasirąžyk ir pažvelk pro langą į tolį.',avoid:'Kavos puodelio vietoj tikrų pusryčių.'},
          {text:'Energija šiandien gali kisti, todėl verta stebėti, kada jos daugiausia, o kada metas sulėtinti tempą.',do:'Pasižymėk, kuriuo dienos metu jautiesi žvaliausiai, ir tą laiką skirk svarbiausiems darbams.',avoid:'Vakarinių darbų, kurie atima miegui skirtą laiką.'},
          {text:'Verta peržiūrėti vieną sveikatos įprotį: miegą, mitybą ar judėjimą. Ne viską iš karto – pakanka vieno mažo, bet nuoseklaus pokyčio.',do:'Pasirink vieną mažą įprotį, pavyzdžiui, vakarinį pasivaikščiojimą, ir pradėk šiandien.',avoid:'Starto tokiu tempu, kad antrą dieną nebesinorėtų tęsti.'}
        ],
        love:[
          {text:'Rūpestis šiandien matomas kasdienybėje: kas paruošė pusryčius, kas prisiminė paskambinti. Mažos paslaugos sušildo labiau nei dideli žodžiai.',do:'Paklausk, kuris kasdienis darbas artimam žmogui labiausiai įkyrėjo, ir perimk jį vienai dienai.',avoid:'Priekaištų dėl smulkmenų, kurias galima išspręsti per minutę.'},
          {text:'Šiandien jausmams gali pritrūkti laiko, bet smulkmenos tą spragą užpildo: susidomėjimas artimo žmogaus diena kartais reiškia daugiau nei gėlių puokštė.',do:'Vakare paklausk, kas šiandien buvo geriausia, ir išklausyk atsakymą iki galo.',avoid:'Įsižeidimo, jei artimo žmogaus dienotvarkė šiandien perpildyta.'},
          {text:'Jei širdis laisva, pažintis šiandien gali užsimegzti įprastoje aplinkoje – sporto salėje ar kursuose. Poroje suartina maži bendri ritualai, pavyzdžiui, rytinė kava dviese.',do:'Pasiūlyk kam nors iš aplinkos kartu pasivaikščioti per pietų pertrauką.',avoid:'Svajonių apie tobulą pažintį, kai aplink tiek tikrų žmonių.'}
        ]
      },
      { // 7: partner, one-to-one, agreements
        headline:['Dviese lengviau','Diena susitarimams','Santykiai pirmame plane'],
        day:[
          'Dėmesys šiandien krypsta į santykius su kitais – artimais žmonėmis, bendradarbiais, klientais. Diena palankesnė bendram darbui nei vienišiems žygiams.',
          'Šiandien lengviau rasti kompromisą, nes abi pusės labiau linkusios išklausyti. Puikus metas susitarti dėl to, kas seniai liko neaptarta.',
          'Tai, kas šiandien erzina kituose, dažnai būna užuomina apie tai, ko trūksta tau. Pažvelk į tai su smalsumu, o ne su priekaištu.'
        ],
        love:[
          {text:'Artumas šiandien ateina lengviau: pokalbis klostosi be pastangų, o tyla nebūna nejauki. Laisva širdis gali sutikti žmogų, su kuriuo norisi rimtų planų.',do:'Skirk vakarą tik dviem: be svečių, be skubos ir be darbų sąrašų.',avoid:'Pokalbių, kuriuose daugiau kalbi, nei klausaisi.'},
          {text:'Diena palanki atviriems pokalbiams apie bendrą ateitį. Kai abi pusės ne tik kalba, bet ir klausosi, sprendimai randami stebėtinai greitai.',do:'Paklausk, kokią vieną svajonę artimas žmogus norėtų įgyvendinti kartu.',avoid:'Pažadų, kuriuos duodi vien tam, kad pokalbis greičiau baigtųsi.'},
          {text:'Šiandien santykiuose verta pažvelgti į pusiausvyrą: ar ne tik imama, bet ir duodama? Atviras ir ramus pokalbis gali daug ką sustyguoti.',do:'Pasiūlyk šią savaitę susikeisti bent vienu namų darbu.',avoid:'Nuolaidžiavimo vien dėl ramybės, kai viduje kaupiasi nuoskauda.'}
        ],
        work:[
          {text:'Bendradarbiavimas šiandien duoda geresnių rezultatų nei darbas vienumoje. Tinkamas metas aptarti sutarties ar partnerystės sąlygas.',do:'Pasitikslink sutarties sąlygas raštu, net jei žodžiu viskas aišku.',avoid:'Skubių sprendimų vien dėl to, kad kitas spaudžia.'},
          {text:'Derybos šiandien klostosi palankiau, kai ieškai ne pergalės, o sprendimo, tinkančio abiem. Lankstumas dabar atsiperka labiau nei kietas tonas.',do:'Prieš derybas užsirašyk, ką gali užleisti ir ko jokiu būdu neatsisakysi.',avoid:'Ultimatumų, po kurių neliks kelio atgal.'},
          {text:'Šiandien vertinga sutvirtinti ryšį su žmonėmis, su kuriais dirbi išvien. Dalykiškas pokalbis akis į akį išspręs daugiau nei laiškų grandinė.',do:'Paklausk kolegų, ko jiems trūksta iš tavęs, kad darbas vyktų sklandžiau.',avoid:'Kolegų darbo vertinimo už jų nugarų.'}
        ],
        energy:[
          {text:'Kitų prašymai šiandien gali užimti daugiau laiko, nei atrodo iš pradžių. Pasilik tarp susitikimų laiko atsikvėpti – tai atsipirks vakare.',do:'Kalendoriuje pažymėk valandą, kuri priklauso tik tau.',avoid:'Sutikimo iš mandagumo, kai jėgų jau nebeliko.'},
          {text:'Šiandien judėti smagiau kompanijoje nei vienumoje: tingulys pasiduoda greičiau, o laikas prabėga nepastebimai.',do:'Susitark su kuo nors dėl bendros treniruotės, baseino ar teniso partijos.',avoid:'Varžymosi ten, kur svarbiausia smagiai praleisti laiką.'},
          {text:'Kitų bėdos šiandien gali atrodyti svarbesnės už savas. Padėti gražu, tačiau pagalba geriausia tada, kai neatima paskutinių jėgų.',do:'Po pokalbio apie kito bėdas skirk penkiolika minučių sau: arbatai, dušui ar tylai.',avoid:'Atsakomybės už tai, ką kiti turi išspręsti patys.'}
        ]
      },
      { // 8: intimacy, trust, shared money
        headline:['Gilūs vandenys','Pasitikėjimo diena','Metas paleisti'],
        day:[
          'Mėnulis šiandien kviečia pažvelgti giliau – į jausmus, pasitikėjimą ir tai, kas paprastai lieka nepasakyta. Atviras pokalbis gali palengvinti labiau, nei tikiesi.',
          'Bendri pinigai, skolos ir įsipareigojimai šiandien prašosi dėmesio. Tinkamas metas peržiūrėti paskolas, grąžinti mažą skolą ar aiškiai susitarti dėl bendrų išlaidų.',
          'Paleisti tai, kas jau atgyveno, šiandien lengviau: seną nuoskaudą, nereikalingą daiktą ar įprotį. Kai kas nors išeina, atsiranda vietos naujam.'
        ],
        love:[
          {text:'Artumas šiandien gimsta iš atvirumo. Pasidalyti tuo, kas iš tiesų jaudina, gali būti nedrąsu, bet būtent tai suartina labiausiai.',do:'Pasidalyk su artimu žmogumi svajone, kurią iki šiol laikei paslaptyje.',avoid:'Juokelių tą akimirką, kai artimas žmogus atsiveria.'},
          {text:'Pasitikėjimas šiandien svarbesnis už bet kokius žodžius. Jei esi poroje, verta atvirai pasikalbėti apie lūkesčius; jei širdis laisva – neskubėk atverti visų durų.',do:'Paklausk artimo žmogaus, kas padeda jaustis saugiai šalia tavęs.',avoid:'Slapto telefono tikrinimo vietoj atviro klausimo.'},
          {text:'Šiandien jausmai gilūs, bet ne visada lengvi. Pavydas ar nerimas gali pakišti koją, todėl verta juos pastebėti anksčiau, nei jie ims kalbėti tavo vardu.',do:'Užrašyk savo nerimą ant popieriaus ir tik tada nuspręsk, ar apie jį kalbėti.',avoid:'Išbandymų, kuriais tikrinama, ar artimas žmogus tikrai myli.'}
        ],
        work:[
          {text:'Tinkamas metas tvarkyti bendrus finansus, paskolas ar mokesčius. Aiškiai surašytos įmokos ir terminai suteikia daugiau saugumo nei bet kokie pažadai.',do:'Peržiūrėk vienos paskolos ar įmokos sąlygas ir pasitikslink palūkanas.',avoid:'Bendrų išlaidų, apie kurias antroji pusė sužino tik iš banko išrašo.'},
          {text:'Kolegų rate šiandien daug lemia pasitikėjimas: kam patiki svarbią užduotį ir kas gali pasikliauti tavimi. Patikimumas dabar vertingesnis už greitį.',do:'Patikėk vieną užduotį žmogui, kuriuo pasitiki, ir leisk ją atlikti savaip.',avoid:'Slaptažodžių ir prieigų dalijimo „tik šiam kartui“.'},
          {text:'Gera diena užbaigti senus finansinius reikalus: atsisakyti nebereikalingų prenumeratų ar uždaryti nenaudojamą sąskaitą. Kiekvienas sutvarkytas punktas palengvina nuotaiką.',do:'Peržiūrėk prenumeratas ir atsisakyk bent vienos, kuria nesinaudoji.',avoid:'Naujų įsipareigojimų, kol senieji dar neužbaigti.'}
        ],
        energy:[
          {text:'Emocijos šiandien gali išsekinti labiau nei fizinis darbas. Skirk sau laiko ramiai suvirškinti tai, kas sujaudino.',do:'Pabūk valandą tyloje – be muzikos, žinių ir pokalbių.',avoid:'Bandymo viską išsiaiškinti iš karto, kol emocijos dar neatslūgo.'},
          {text:'Gilesnio poilsio šiandien gali prireikti labiau nei įprastai: šilto dušo, ilgesnio miego ar tiesiog ramybės. Verta tuo pasirūpinti.',do:'Šį vakarą atsigulk valanda anksčiau nei paprastai.',avoid:'Vakaro, perpildyto planais, kai kūnas prašo ramybės.'},
          {text:'Naudinga atsikratyti to, kas užima vietą ir vargina akis. Laisvesnė erdvė namuose dažnai reiškia ir lengvesnę galvą.',do:'Surink vieną maišą daiktų, kuriuos atiduosi ar išmesi.',avoid:'Naujų daiktų pirkimo vos tik atsiradus laisvai vietai.'}
        ]
      },
      { // 9: travel, study, the wider view
        headline:['Platesnis horizontas','Kelias moko','Žvilgsnis toliau'],
        day:[
          'Mėnulis šiandien plečia akiratį: traukia nauji maršrutai, idėjos ir žmonės iš kitų kraštų. Puiki diena planuoti kelionę ar išmokti ką nors naujo.',
          'Šiandien verta pakelti akis nuo darbų sąrašo ir paklausti, kur veda tavo kelias. Atsakymas nebūtinai turi būti didelis – užtenka krypties.',
          'Mokytis, skaityti ir svarstyti didžiuosius gyvenimo klausimus šiandien ypač gera. Knyga ar paskaita gali netikėtai pakeisti požiūrį į tai, kas atrodė aišku.'
        ],
        energy:[
          {text:'Nauji įspūdžiai šiandien atgaivina labiausiai: net trumpa išvyka už miesto ar pasivaikščiojimas nepažįstama gatve padės labiau nei įprasta rutina.',do:'Aplankyk vietą savo mieste, kurioje dar niekada nebuvai.',avoid:'Kelionių planų, kurie prasideda ir baigiasi bilietų kainų naršymu.'},
          {text:'Šiandien geriausiai ilsiesi tada, kai mintys turi kur skristi. Nauja kalba, kitos šalies muzika ar kelionių knyga atgaivina ne prasčiau nei pasivaikščiojimas.',do:'Pasigamink vakarienę pagal receptą iš šalies, kurioje dar nebuvai.',avoid:'Vakaro, kuris kartoja vakarykštį iki smulkmenų.'},
          {text:'Energija šiandien auga, kai turi tikslą. Net paprastas pasivaikščiojimas tampa smagesnis, jei žinai, kur eini ir kodėl.',do:'Pasirink šiai savaitei maršrutą, kurį norėtum įveikti pėsčiomis ar dviračiu.',avoid:'Planų, kurie lieka tik kalendoriaus pastabose.'}
        ],
        work:[
          {text:'Verta mokytis ir tobulėti: kursai, mokymai ar mentoriaus patarimas gali atverti naujų galimybių, net ir kitose šalyse.',do:'Pasikalbėk su žmogumi, kuris jau moka tai, ko nori išmokti tu.',avoid:'Mokymosi atidėjimo neribotam laikui.'},
          {text:'Profesiniuose reikaluose šiandien vertinga pažvelgti į platesnį vaizdą: kokių įgūdžių prireiks po kelerių metų ir ką verta pradėti mokytis jau dabar.',do:'Užsirašyk vieną įgūdį, kurį norėtum įvaldyti per metus, ir pirmą žingsnį jo link.',avoid:'Paskendimo smulkmenose, kai kryptis dar neaiški.'},
          {text:'Už įprasto rato ribų šiandien slypi netikėti sprendimai: kitas miestas, kita šalis ar kita sritis gali pasiūlyti tai, ko ieškai.',do:'Pasidomėk, kaip panašią problemą sprendžia kitos šalies ar kitos srities kolegos.',avoid:'Uždarumo naujoms idėjoms vien todėl, kad jos atkeliavo iš svetur.'}
        ],
        love:[
          {text:'Šiandien traukia žmonės, su kuriais galima kalbėtis apie svajones ir tolimas šalis. Poroje bendri kelionių sumanymai dabar ypač suartina.',do:'Pasidalyk su artimu žmogumi savo svajonių kelionių sąrašu ir rask bent vieną sutapimą.',avoid:'Atostogų planavimo vien pagal savo norus.'},
          {text:'Jei dar ieškai savo žmogaus, pažintis gali užsimegzti kelionėje ar kursuose. Poroje padeda smalsumas: paklausk to, ko dar niekada neklausei.',do:'Pakviesk naują pažintį ar artimą žmogų kartu į paskaitą ar parodą.',avoid:'Pirmo įspūdžio vertinimo pagal vieną nuotrauką.'},
          {text:'Šiandien kyla klausimų apie santykių prasmę: kas tau juose svarbiausia ir kur jie veda. Atsakymams nereikia skubėti, bet mintis verta užsirašyti.',do:'Prisimink akimirką, kai santykiuose jauteisi geriausiai, ir pagalvok, kas tada buvo kitaip.',avoid:'Skubių išvadų apie visą santykių ateitį dėl vienos dienos.'}
        ]
      },
      { // 10: career, goals, reputation
        headline:['Karjeros laiptai','Tavo darbas matomas','Kryptis – į viršūnę'],
        day:[
          'Karjera ir tikslai šiandien atsiduria dėmesio centre. Tavo pastangos labiau matomos nei įprastai, tad tinkamas metas parodyti, ką sugebi.',
          'Pats metas pagalvoti, kuria kryptimi juda tavo profesinis kelias. Pokalbis su vadovu ar patyrusiu kolega gali padėti pamatyti naujų galimybių.',
          'Svarbiems sprendimams ir viešiems pasirodymams diena palanki. Šiandienos žodžiai ir darbai gali būti įsiminti ilgiau nei paprastai.'
        ],
        work:[
          {text:'Tavo iniciatyva darbe šiandien gali būti įvertinta. Puikus metas pristatyti projektą, pasiūlyti idėją ar paprašyti naujos atsakomybės.',do:'Pasiūlyk vieną konkretų patobulinimą ir pasisiūlyk jį įgyvendinti.',avoid:'Kolegų nuopelnų nutylėjimo, kai pristatomas bendras darbas.'},
          {text:'Šiandien sekasi darbai, kuriems reikia atsakomybės ir kantrybės. Ilgalaikis tikslas gali priartėti net keliais žingsniais.',do:'Suskaidyk didžiausią savo projektą į etapus ir pažymėk, kuris eina pirmas.',avoid:'Ilgalaikių planų keitimo vien dėl vienos nesėkmės.'},
          {text:'Tinkama diena kalbėti apie atlyginimą, paaukštinimą ar naujas pareigas. Konkretūs rezultatai šiandien įtikina labiau nei ilgos kalbos.',do:'Paprašyk susitikimo su vadovu ir aiškiai įvardyk, ko sieki.',avoid:'Derybų paskubomis, koridoriuje ar tarp kitų reikalų.'}
        ],
        energy:[
          {text:'Šiandien jėgų suteikia aiški kryptis: kai matai, kur eini, ir nuovargis jaučiamas mažiau.',do:'Pradėk dieną nuo užduoties, kuri greitai suteiks pergalės jausmą.',avoid:'Savo kelio lyginimo su kitų pasiekimais socialiniuose tinkluose.'},
          {text:'Darbas šiandien gali įtraukti taip, kad pamirši pavalgyti ar pakilti nuo kėdės. Reguliarus ritmas padės išlaikyti jėgas iki vakaro.',do:'Pietums išeik nuo darbo stalo bent į gretimą kambarį ar į lauką.',avoid:'Vakaro, kuriame darbo mintys užima daugiau vietos nei poilsis.'},
          {text:'Ambicijos šiandien gali vilioti dirbti ilgiau, nei reikia. Atmink, kad poilsis – taip pat sėkmės dalis.',do:'Užsirašyk kalendoriuje darbo pabaigos valandą kaip svarbų susitikimą.',avoid:'Pasididžiavimo nuovargiu, lyg jis būtų sėkmės matas.'}
        ],
        love:[
          {text:'Darbas šiandien gali nustumti jausmus į antrą planą. Verta sąmoningai palikti vakarą artimiems žmonėms, net jei darbų sąrašas dar ilgas.',do:'Suplanuok savaitgaliui laiką, kuris priklausys tik artimiesiems.',avoid:'Darbo nuotaikų pernešimo į namus.'},
          {text:'Santykiuose svarbi parama: palaikymas siekiant tikslų suartina labiau nei dovanos. Laisvai širdžiai įdomių žmonių gali atsirasti ir profesinėje aplinkoje.',do:'Paklausk artimųjų, kaip gali padėti siekti jų tikslų.',avoid:'Tylaus pavydo artimo žmogaus sėkmei.'},
          {text:'Norisi atrodyti tvirtai ir viską suvaldyti, bet artumui reikia ir silpnumo. Leisk artimam žmogui pamatyti, kad ir tau kartais sunku.',do:'Paprašyk artimo žmogaus patarimo dėl vieno darbo rūpesčio.',avoid:'Įsitikinimo, kad stiprumas – tai viską nešti be jokios pagalbos.'}
        ]
      },
      { // 11: friends, groups, the future
        headline:['Draugų ratas','Ateities planai','Kartu – smagiau'],
        day:[
          'Draugystė ir bendruomenė šiandien išeina į pirmą planą. Puiki diena susitikti su draugais, prisijungti prie grupės ar pasiūlyti bendrą veiklą.',
          'Ateitis šiandien atrodo arčiau nei įprastai – ne rytojus, o gyvenimas po kelerių metų. Net drąsi svajonė tampa artimesnė, kai turi pirmą žingsnį.',
          'Nauji ryšiai šiandien užsimezga lengviau. Renginys, klubas ar bendras pomėgis gali suvesti su žmonėmis, kurie mąsto panašiai.'
        ],
        love:[
          {text:'Per draugus šiandien gali ateiti ir meilė: bendras vakarėlis kartais supažindina su įdomiu žmogumi, o poroje suteikia naujų įspūdžių.',do:'Priimk draugų kvietimą, net jei iš pradžių niekur eiti nesinori.',avoid:'Bandymo suderinti draugus ir mylimą žmogų per jėgą.'},
          {text:'Jausmams šiandien naudinga draugystės dozė: vakaras su draugais gali suartinti labiau nei romantiška vakarienė. Laisva širdis lengviau atsiveria gerų žmonių rate.',do:'Suplanuok susitikimą, kuriame artimas žmogus ir tavo draugai galėtų geriau susipažinti.',avoid:'Draugų apleidimo vos užsimezgus naujiems santykiams.'},
          {text:'Mintys apie ateitį šiandien paliečia ir jausmus: kokių santykių nori ir kokį gyvenimą norėtum kurti. Poroje gera pasidalyti viltimis, o laisva širdis gali aiškiau suprasti, ko ieško.',do:'Pasiūlyk artimam žmogui kartu nubraižyti ateinančių metų planą su viena didele svajone.',avoid:'Ilgo reikalavimų sąrašo, kurio neatitiktų nė vienas gyvas žmogus.'}
        ],
        work:[
          {text:'Komandinis darbas šiandien duoda daugiau nei pavienės pastangos. Pažįstamas iš visai kitos srities gali pasiūlyti sprendimą, kurio nė neieškojai.',do:'Parašyk žmogui, su kuriuo kadaise dirbai, ir pasiteirauk, kaip sekasi.',avoid:'Apkalbų apie kolegas, net jei jos atrodo nekaltos.'},
          {text:'Ilgesnio laikotarpio planus šiandien sudėlioti lengviau: metinius tikslus, santaupas ar karjeros kryptį. Aiškus planas suteikia ramybės.',do:'Užsirašyk vieną finansinį tikslą metams ir pirmą sumą, kurią jam atidėsi.',avoid:'Ateities planų, sudarytų vien pagal kitų lūkesčius.'},
          {text:'Sėkmė šiandien gali ateiti per bendruomenę – grupės projektus, savanorystę ar bendras iniciatyvas. Tai, ką kuri su kitais, įgauna daugiau prasmės.',do:'Prisijunk prie bendro projekto ar iniciatyvos, kuri tau prasminga.',avoid:'Visų kitų idėjų kritikos, kai savos dar nepasiūlei.'}
        ],
        energy:[
          {text:'Bendrystė šiandien – geriausias energijos šaltinis. Grupinė treniruotė, žygis su draugais ar tiesiog pokalbis prie arbatos gali pakelti nuotaiką.',do:'Pakviesk draugus į žygį, dviračių išvyką ar bendrą sporto pamoką.',avoid:'Vakaro vienumoje vien iš įpročio, kai draugai kviečia.'},
          {text:'Verta leisti sau pasvajoti. Mintys apie ateitį, net ir drąsiausios, gali įkvėpti ir suteikti jėgų.',do:'Išeik pasivaikščioti vien su savo mintimis apie ateitį ir leisk joms klajoti.',avoid:'Pesimistinių prognozių, kurios atima norą net pradėti.'},
          {text:'Šiandien jėgas gali sekinti ne darbas, o žmonių gausa ir triukšmas. Rinkis tik tuos susitikimus, kurie tikrai džiugina.',do:'Po susitikimo grįžk namo pėsčiomis ir leisk mintims nurimti.',avoid:'Pokalbių grupių, kuriose kas minutę gimsta naujas planas.'}
        ]
      },
      { // 12: rest, solitude, finishing
        headline:['Tylos metas','Atokvėpis prieš naują ratą','Užbaik ir pailsėk'],
        day:[
          'Mėnulis šiandien kviečia sulėtinti tempą ir pabūti su savimi. Tai ne tinginystė, o būtinas atokvėpis prieš naują etapą, tad ramus vakaras dabar aukso vertės.',
          'Šiandien intuicija veikia geriau nei logika. Įsiklausyk į pirmą įspūdį ir netikėtas mintis – juose gali būti užuominų, kurių dienos šurmulyje nepastebėtum.',
          'Diena tinka užbaigti tai, kas seniai tęsiasi, ir tyliai susitvarkyti užkulisiuose. Pradžios gali palaukti – dabar metas užverti senus skyrius.'
        ],
        energy:[
          {text:'Kūnas šiandien prašo poilsio ir tylos. Jei jėgų pritrūksta, tai ne silpnumas, o signalas sustoti ir atsigauti.',do:'Eik miegoti anksčiau ir pasiimk į lovą knygą vietoj telefono.',avoid:'Vakarinio darbo „tik dar penkioms minutėms“.'},
          {text:'Naudinga pabūti vienumoje, net jei tik valandą. Tyla padeda susigaudyti mintyse ir atgauti jėgas.',do:'Išjunk garsą telefone ir leisk sau bent pusvalandį nieko neveikti.',avoid:'Triukšmingų renginių, kai norisi tik tylos.'},
          {text:'Šiandien jausmai gali būti migloti, o mintys – išsiblaškiusios. Paprasti darbai rankomis, pavyzdžiui, gaminimas ar mezgimas, padeda vėl rasti ramybę.',do:'Persodink augalą, nupiešk ką nors ar sutvarkyk vieną lentyną – lėtai ir be skubos.',avoid:'Lemtingų sprendimų, priimamų pavargus.'}
        ],
        love:[
          {text:'Jausmai šiandien tylesni ir labiau nukreipti į vidų. Santykių aiškinimąsi geriau atidėti – dabar užtenka tiesiog būti šalia.',do:'Surenk artimam žmogui ramų vakarą be didelių planų.',avoid:'Svarbių santykių klausimų kėlimo, kai abiem trūksta jėgų.'},
          {text:'Gali iškilti seni jausmai ar prisiminimai apie buvusius santykius. Leisk jiems praplaukti pro šalį ir nesiimk skubių žingsnių.',do:'Užrašyk į dienoraštį tai, ką norėtum pasakyti, bet dar ne laikas.',avoid:'Senų pokalbių skaitymo ieškant ženklų, kurių ten nėra.'},
          {text:'Vertinga pabūti su savimi ir suprasti, ko iš tiesų nori santykiuose. Atsakymai ateina tyloje, ne triukšme.',do:'Pasidaryk sau jaukų vakarą – tokį, kokį norėtum padovanoti mylimam žmogui.',avoid:'Santykių vertinimo pagal tai, ką apie juos pasakytų kiti.'}
        ],
        work:[
          {text:'Šiandien darbe naudingiau užbaigti nei pradėti. Seni reikalai, pagaliau pažymėti kaip atlikti, atlaisvina daugiau vietos galvoje, nei atrodo.',do:'Peržiūrėk užduočių sąrašą ir ištrink tai, kas nebeaktualu.',avoid:'Naujų projektų pradžios vien todėl, kad senieji nusibodo.'},
          {text:'Geriausiai sekasi darbas užkulisiuose – parengiamasis, analitinis ar tvarkymo. Viešiems pasirodymams diena ne pati palankiausia.',do:'Paruošk medžiagą kitos savaitės susitikimams, kol niekas netrukdo.',avoid:'Viešų pristatymų ir derybų, jei juos dar galima perkelti.'},
          {text:'Pinigų srityje šiandien geriau elgtis atsargiai: smulkus šriftas ar nepastebėta detalė gali brangiai kainuoti.',do:'Perskaityk visas sąlygas iki galo ir tik tada patvirtink mokėjimą.',avoid:'Pirkinių iš nuobodulio vėlai vakare.'}
        ]
      }
    ]
  },
  humor:{
    events:{
      sunOwn:e=>`Saulė ${time(e.time)} įžengia į tavo ženklą, tad gimtadienio nuotaiką jau galima įsijungti – net jei tortas dar tik planuose.`,
      sunIngress:e=>`Saulė ${time(e.time)} persikrausto į ${signs.acc[e.to]} – be dėžių, be krovikų ir be jokio vėlavimo.`,
      fullMoon:e=>e.own
        ?`Pilnatis tavo ženkle – ${time(e.time)}, tad jausmai skamba visu garsu: prieš rašant dramatišką žinutę verta išgerti arbatos.`
        :`Pilnatis ${signs.loc[e.sign]} – ${time(e.time)}, ir jausmų garsas pasukamas iki galo: net šaldytuvo ūžimas gali pasirodyti dramatiškas.`,
      newMoon:e=>e.own
        ?`Jaunatis tavo ženkle – ${time(e.time)}, ir diena kvepia kaip naujas sąsiuvinis rugsėjo pirmąją: įrašyk į jį ką nors svarbaus.`
        :`Jaunatis ${signs.loc[e.sign]} – ${time(e.time)}, tad sumanymus verta užsirašyti, kol jie dar nevirto amžinu „kada nors“.`,
      station:e=>`${bodies[e.body]} ${time(e.time)} `+({
        Mercury:{retrograde:'pradeda retrogradinį judėjimą: prieš spaudžiant „Siųsti“ verta įsitikinti, kad žinutė keliauja ne į šeimos pokalbių grupę.',direct:'baigia retrogradinį judėjimą: kurjeriai vėl randa teisingą laiptinę, o žinutės – teisingą adresatą.'},
        Venus:{retrograde:'pradeda retrogradinį judėjimą: praeitis gali pasibelsti kaip senų nuotraukų priminimas telefone – žiūrėti galima, grįžti nebūtina.',direct:'baigia retrogradinį judėjimą: širdis ir banko programėlė pagaliau susitaria dėl bendro biudžeto.'},
        Mars:{retrograde:'pradeda retrogradinį judėjimą, tad ginčą su savitarnos kasa verta atidėti kitam kartui.',direct:'baigia retrogradinį judėjimą: užstrigę darbai pajuda kaip eilė, kai pagaliau atidaroma antra kasa.'}
      })[e.body][e.turns],
      moonChange:e=>`Iki ${time(e.time)} Mėnulis dar svečiuojasi ${signs.loc[e.from]}, paskui su lagaminu persikelia į ${signs.acc[e.to]}.`
    },
    headlines:{sunOwn:'Tavo sezono premjera',fullMoonOwn:'Pilnas Mėnulis, pilna širdis',newMoonOwn:'Švarus lapas, tavo rašysena'},
    houses:[
      { // 1
        headline:['Pultelis tavo rankose','Diena su tavo vardu','Tavo serialo premjera'],
        day:[
          'Mėnulis šiandien perduoda tau televizoriaus pultelį. Rinkis kanalą, kuris patinka tau, net jei kiti vis dar bando perjungti į žinias.',
          'Šiandien veržlumo tiek, kad galėtum pradėti tris projektus dar prieš pusryčius. Pabaik bent vieną iki vakarienės – ir tai bus tikras rekordas.',
          'Jausmai šiandien be filtrų – kaip nuotrauka, įkelta be jokio redagavimo. Jei kas nors paklaus „kaip sekasi?“, atsakymas gali užtrukti iki kitos stotelės.'
        ],
        love:[
          {text:'Žavesys šiandien veikia kaip nemokamas belaidis internetas: visi jį pastebi ir nori prisijungti. Jei kažkas seniai laukia tavo žinutės, metas spausti „Siųsti“.',do:'Parašyk žmogui, kurio profilį jau žinai mintinai, bent trumpą „labas“.',avoid:'Spėlionių, ką reiškia trys taškai ekrane, kai kitas rašo.'},
          {text:'Šiandien sakai tai, ką galvoji, greičiau, nei spėji pagalvoti, ką sakai. Meilės prisipažinimams – puiku, kritikai apie kito kulinarinius gebėjimus – rizikinga.',do:'Pasakyk komplimentą be jokio „bet“ pabaigoje.',avoid:'Ginčo apie tai, kaip teisingai krauti indaplovę.'},
          {text:'Jautrumas šiandien kaip laiptinės šviesa su judesio jutikliu – įsijungia nuo menkiausio krebždesio. Trumpa žinutė greičiausiai reiškia tik tiek, kad kitas skuba.',do:'Detektyvo kepurę šiandien palik spintoje ir tiesiog paklausk.',avoid:'Vieno sakinio žinutės analizės su draugais iki vėlyvos nakties.'}
        ],
        work:[
          {text:'Idėjos šiandien šokinėja kaip spragėsiai keptuvėje. Pasakyk bent vieną garsiai, kol ji netyčia neatsidūrė kažkieno kito pristatyme.',do:'Užsirašyk idėją ir išsiųsk ją dar prieš pietus, kol neatvėso kaip kava.',avoid:'Kuklaus tylėjimo, kurį kolegos palaiko pritarimu viskam.'},
          {text:'Norisi stovėti prie vairo, net jei laivas – tik bendras dokumentas. Vairuok drąsiai, bet atmink, kad įgula irgi turi nuomonę.',do:'Pasiūlyk planą taip užtikrintai, lyg jis jau būtų patvirtintas – dažnai to ir užtenka.',avoid:'Bendro dokumento perrašymo, kai kiti dar tik rašo komentarus.'},
          {text:'Šiandien internetinis krepšelis pildosi, lyg turėtų savo valią. Banko programėlė tuo metu tyliai ruošia ne pačią linksmiausią žinutę.',do:'Prieš mokėjimą parodyk krepšelį draugui, kuris nekenčia apsipirkimo.',avoid:'Pirkinių kategorijoje „nusipelniau, nes šiandien antradienis“.'}
        ],
        energy:[
          {text:'Šiandien laiptinėje galėtum lenktyniauti su liftu ir galbūt net laimėti. Išnaudok šį užtaisą, kol vakaras dar neatnešė pledo ir serialų.',do:'Lipk laiptais ir pažiūrėk, ar liftas tave aplenks.',avoid:'Viso užsidegimo iššvaistymo dar vienam spintos perrikiavimui.'},
          {text:'Tavo nuotaika šiandien plinta greičiau nei gandas daugiabutyje. Pasirūpink, kad ji būtų gera – kaimynai vis tiek sužinos.',do:'Pasisveikink su kaimynais taip šiltai, kad jie dar valandą spėliotų, kas nutiko.',avoid:'Niurzgėjimo, kuris užkrečia greičiau nei sloga.'},
          {text:'Kūnas šiandien siunčia žinutes su subtitrais ir šauktukais. Jei parašyta „noriu pasivaikščioti“, ne laikas apsimesti, kad nesupranti kalbos.',do:'Atsakyk kūnui greitai: batai, striukė ir dvidešimt minučių lauke.',avoid:'Ketvirto „paskutinio“ vaizdo įrašo prieš miegą.'}
        ]
      },
      { // 2
        headline:['Piniginė nori pasikalbėti','Pledas – darbo uniforma','Kiek kainuoja ramybė'],
        day:[
          'Mėnulis šiandien tikrina tavo išlaidas kaip griežtas buhalteris su akiniais ant nosies galo. Gali paaiškėti, kad kava išsinešti per mėnesį kainuoja kaip savaitgalis Palangoje.',
          'Šiandien norisi gyventi kaip katinas ant radiatoriaus: šilta, soti ir be skubos. Leisk sau bent valandą tokio režimo – katinai juk neatrodo nelaimingi.',
          'Diena užduoda nepatogų klausimą: kiek iš tiesų kainuoja tavo ramybė? Atsakymas gali būti pigesnis nei naujausias telefonas ir brangesnis nei dar vienas viršvalandis.'
        ],
        love:[
          {text:'Šiandien meilės kalba labai praktiška: pakeista perdegusi lemputė gali sušildyti labiau nei eilėraštis. Tik iš anksto patikrink, ar lemputė tinkama.',do:'Padaryk artimam žmogui praktišką paslaugą ir apsimesk, kad tai smulkmena.',avoid:'Brangių staigmenų, kurios labiausiai nustebina tavo kredito kortelę.'},
          {text:'Norisi pripažinimo – bent tiek, kiek sulaukia šuo, atnešęs šlepetes. Pasakyk tiesiai, ko tau reikia: užuominos šiandien veikia prastai.',do:'Pagirk artimą žmogų už ką nors labai konkretaus, pavyzdžiui, už tobulai išvirtą kavą.',avoid:'Tylaus įsižeidimo, kurį artimas žmogus turi išnarplioti kaip galvosūkį.'},
          {text:'Pinigai ir romantika šiandien susitinka kaip du kaimynai ankštame lifte – šiek tiek nepatogu. Pokalbiui apie išlaidas pasirink šviesų metą ir sočią nuotaiką.',do:'Pinigų temą pradėk tik po pietų – alkanas pokalbis visada brangesnis.',avoid:'Čekių kolekcionavimo kaip įrodymų teismui.'}
        ],
        work:[
          {text:'Lentelės šiandien klauso tavęs geriau nei kai kurie kolegos. Pasinaudok proga ir sutvarkyk tą, kuri jau seniai primena voratinklį.',do:'Patikrink banko išrašą su detektyvo užsidegimu ir rask bent vieną įtariamąjį.',avoid:'Paslaptingų nurašymų, kuriuos „kažkada užsiprenumeravai“.'},
          {text:'Tavo darbo vertė šiandien aiški net tau – o tai jau pusė pergalės. Į derybas eik su skaičiais, nes vien graži šypsena sąmatų nepasirašo.',do:'Surašyk savo metų laimėjimus taip, lyg kurtum reklamą sau.',avoid:'Nuolaidų kiekvienam, kuris tik pagiria tavo darbą.'},
          {text:'Kiekvienas jaukus daiktas parduotuvėje šiandien šnabžda: „Paimk mane namo“. Daugelis jų tą patį šnabždėjo ir praėjusį mėnesį.',do:'Prieš pirkinį rask jam vietą namuose – jei nėra lentynos, nėra ir pirkinio.',avoid:'Ketvirto pledo, nes trys ankstesni „ne tokio atspalvio“.'}
        ],
        energy:[
          {text:'Taupymo režimas šiandien įjungtas kaip telefone su 15 % baterijos. Pakrauk save šiltu maistu ir ramybe, o ne trečiu kavos puodeliu.',do:'Išsivirk dvigubą porciją sriubos – rytoj sau padėkosi.',avoid:'Pietų, kurie trunka trumpiau nei reklama prieš vaizdo įrašą.'},
          {text:'Nosis šiandien dirba parfumerio tikslumu: šviežiai keptų bandelių kvapas gali pakelti nuotaiką greičiau nei bet kokia motyvacinė knyga.',do:'Užsuk į kepyklėlę vien tam, kad pauostytum – pirkti neprivaloma, bet sunku atsispirti.',avoid:'Vakarienės, kurios skonį prisimena tik telefono ekranas.'},
          {text:'Šiandien gyvenk pagal tvarkaraštį, kuriam pavydėtų ir traukinių dispečeris: valgis, judesys ir miegas laiku, o gera nuotaika atvyks be vėlavimo.',do:'Nusistatyk žadintuvą ne tik rytui, bet ir ėjimui miegoti.',avoid:'Spontaniško „greito“ remonto vakare, kuris baigsis vidurnaktį.'}
        ]
      },
      { // 3
        headline:['Žinučių lavina','Pokalbių maratonas','Smalsumas be stabdžių'],
        day:[
          'Telefonas šiandien gali vibruoti dažniau nei skalbimo mašina gręžimo režimu – Mėnulis įjungė visus pranešimus vienu metu. Pirmiausia atsakyk į tai, kas tikrai svarbu.',
          'Mintys šiandien bėga greičiau nei autobusas, ką tik užvėręs duris tau prieš nosį. Užsirašyk geriausias idėjas, kol jos nenuvažiavo.',
          'Šiandien gali netikėtai prabilti net bendraklasis, kurio nematei nuo išleistuvių. Tarp kalbų apie orus ir kainas kartais slypi vertingas patarimas.'
        ],
        love:[
          {text:'Flirtas šiandien skraido žinutėmis greičiau nei jaustukai gimtadienio sveikinimuose. Jei širdis laisva, klausimas „ką veiki?“ gali tapti įdomios istorijos pradžia.',do:'Užduok patinkančiam žmogui klausimą, į kurį neįmanoma atsakyti vienu žodžiu.',avoid:'Atsakymo „ok“ į trijų pastraipų žinutę.'},
          {text:'Vienas „gerai“ šiandien gali reikšti ir sutikimą, ir artėjančią audrą – priklauso nuo taško gale. Skyrybos ženklus rinkis atidžiai, kaip dažų atspalvį sienai.',do:'Atsakyk į žinutę su šypsenėle – kad niekam nereikėtų spėlioti, ar „gerai“ buvo piktas.',avoid:'Santykių aiškinimosi žinutėmis, kai rašybos klaidos tampa įrodymais.'},
          {text:'Švelnumas šiandien slepiasi memuose, nuorodose ir juokingose nuotraukose. Vienas tinkamas paveikslėlis gali pasakyti daugiau nei trys puslapiai jausmų.',do:'Nusiųsk artimam žmogui vaizdelį, prie kurio juokeisi taip, kad net kaimynai išgirdo.',avoid:'Įsižeidimo, kai į tavo ilgą žinutę atsakoma vienu jaustuku.'}
        ],
        work:[
          {text:'Laiškai šiandien skrieja kaip kamuolys paskutinę kėlinio minutę. Aiškus ir trumpas prašymas pataikys į krepšį greičiau nei ilgas romanas.',do:'Išsiųsk atidėliotą laišką ir sutalpink jį į penkis sakinius.',avoid:'Laiškų, kuriuose esmė paslėpta po trimis pastraipomis mandagumo.'},
          {text:'Smalsumas šiandien veikia kaip nemokami kursai. Kolegos patarimas prie kavos aparato gali sutaupyti daugiau laiko nei visas mokymų vadovas.',do:'Išklausinėk kolegas apie jų slaptus darbo triukus ir pažadėk niekam neišduoti.',avoid:'Linksėjimo susitikime, kai iš tikrųjų nesupratai nė žodžio.'},
          {text:'Kurjeris šiandien galėtų pavydėti tavo maršrutų: trumpos kelionės ir užsukimai pakeliui atneša daugiau naudos, nei atrodo.',do:'Sujunk tris reikalus į vieną išvyką ir pasijusk logistikos genijumi.',avoid:'Važinėjimo pirmyn atgal dėl vieno pamiršto dokumento.'}
        ],
        energy:[
          {text:'Kojos šiandien nerimsta kaip šuo, išgirdęs žodį „pasivaikščioti“. Net kelionė iki parduotuvės kitu keliu gali atgaivinti.',do:'Eik į parduotuvę ilgesniu keliu ir apsimesk, kad tai ekskursija.',avoid:'Kėdės, kuri jau prisimena tavo siluetą geriau nei veidrodis.'},
          {text:'Galvoje šiandien tiek minčių, kad jos galėtų atidaryti savo radijo stotį. Laikas sumažinti garsą ir palikti tik vieną bangą.',do:'Užrašyk visas mintis ant vieno lapo ir paskelbk joms pertrauką.',avoid:'Ekrano atnaujinimo dažniau, nei pasaulyje spėja kas nors nutikti.'},
          {text:'Vieni pašnekovai šiandien įkrauna kaip greitasis įkroviklis, kiti išsiurbia kaip sena programėlė fone. Rinkis atidžiai.',do:'Surink numerį žmogaus, po pokalbio su kuriuo norisi šokti, o ne gulti.',avoid:'Diskusijų su nepažįstamuoju, kurio profilio nuotrauka – saulėlydis.'}
        ]
      },
      { // 4
        headline:['Namų gravitacija','Giminės tiesioginis eteris','Pledo ir arbatos diena'],
        day:[
          'Namai šiandien traukia stipriau nei kvapas iš močiutės virtuvės. Jaukus vakaras be skubos gali būti geriausias šios dienos planas.',
          'Šeimos pokalbių grupė šiandien gali atgyti kaip turgus šeštadienio rytą. Paskambink artimiesiems – gyvas balsas vertas daugiau nei dar viena nuotrauka su kačiukais.',
          'Stalčius, kuriame gyvena laidai nuo niekam nebeprisimenamų telefonų, šiandien prašosi revizijos. Vienas išneštas maišas šlamšto atstoja trumpas atostogas.'
        ],
        love:[
          {text:'Virtuvė šiandien – romantiškiausia vieta namuose: kas maišo sriubą, tas ir valdo pasaulį. Bendra vakarienė namie gali pranokti bet kokį restoraną.',do:'Pasiūlyk kartu išvirti cepelinų – net jei pusė subyrės, juoko užteks visam vakarui.',avoid:'Telefono prie stalo, lyg jis būtų trečias vakarienės svečias.'},
          {text:'Paskutinis sūrio gabalėlis šaldytuve šiandien gali sukelti diplomatinę krizę. Derybas pradėk nuo pasiūlymo jį perpjauti per pusę.',do:'Pagirk už išplautus indus taip iškilmingai, lyg tai būtų olimpinis auksas.',avoid:'Pasyviai agresyvių raštelių ant šaldytuvo.'},
          {text:'Jei širdis laisva, daugiausia švelnumo šiandien gali sulaukti katė – net jei ji tik apsimeta, kad tave myli. Poroje tinka vaikystės istorijos, kurių tėvai iki šiol nežino.',do:'Atskleisk artimam žmogui vieną vaikystės nuotykį, už kurį tave būtų nubaudę.',avoid:'Šeimos ginčų archyvo atidarymo per šventinius pietus.'}
        ],
        work:[
          {text:'Galva šiandien jau namie su šlepetėmis, nors kūnas dar prie darbų. Leisk jai sugrįžti bent iki pietų – paskui galėsite išeiti kartu.',do:'Pasiimk į darbą mažą namų jaukumo dalelę – mėgstamą puodelį ar šiltas kojines.',avoid:'Susitikimų po darbo valandų, kai arbatinukas jau užkaistas.'},
          {text:'Tyla šiandien – geriausias kolega: dirbk ramiai, kaip pelė bibliotekoje. Triukšminga aplinka gali blaškyti labiau nei kaimyno gręžtuvas sekmadienio rytą.',do:'Užsidėk ausines kaip ženklą „netrukdyti“ ir paskirk valandą vienai užduočiai.',avoid:'Žaibiškų atsakymų į kiekvieną pranešimą, lyg tai būtų televizijos viktorina.'},
          {text:'Šildymo sąskaita šiandien gali būti įdomesnė lektūra nei bet kuris detektyvas. Namų finansai kol kas svarbesni už karjeros strategiją.',do:'Surenk šildymo sąskaitai tardymą ir išsiaiškink, kuris radiatorius čia kaltas.',avoid:'Dar vienos dekoratyvinės pagalvėlės, kuriai sofoje jau nebėra vietos.'}
        ],
        energy:[
          {text:'Sofa šiandien suteikia daugiau jėgų nei sporto salė – ir tai visiškai normalu. Kartais poilsis yra pats svarbiausias treniruotės etapas.',do:'Susuk vakarui lizdą iš pagalvių ir pledų, vertą gamtos dokumentikos.',avoid:'Svečių, kuriuos pasikvietei tik todėl, kad „seniai nesimatėm“.'},
          {text:'Šiandien į aplinką reaguoji jautriai kaip senas termometras: skersvėjis ar per garsus televizorius iškart išmuša iš vėžių. Jaukumas – šiandienos atsakymas į viską.',do:'Paversk kambarį reklamos kadru: sukišk netvarką į spintą ir apsimesk, kad taip visada.',avoid:'Nešiojamojo kompiuterio lovoje, lyg jis būtų naminis gyvūnėlis.'},
          {text:'Šiandien nostalgija gali užklupti netikėtai – kaip sena daina radijuje, kurios žodžius dar moki mintinai. Pasidžiauk prisiminimais, bet grįžk į dabartį iki vakarienės.',do:'Pavartyk senų nuotraukų albumą ir pasijuok iš savo šukuosenų istorijos.',avoid:'Prisiminimų, kurie virsta paskaita „anksčiau buvo geriau“.'}
        ]
      },
      { // 5
        headline:['Širdis griežia pirmuoju smuiku','Žaidimų aikštelė atidaryta','Juokas be grafiko'],
        day:[
          'Mėnulis šiandien elgiasi kaip vaikas, radęs baseiną su kamuoliukais: viskas jam – žaidimas. Leisk sau bent valandą atostogų nuo rimtų reikalų.',
          'Įkvėpimas šiandien kyla kaip pienas, paliktas be priežiūros ant viryklės – greitai ir per kraštus. Imk teptuką, mikrofoną ar puodą: dabar svarbiau, kad smagu, nei kad tobula.',
          'Šiandien galioja vaikystės taisyklės: juoktis galima garsiai, o planus keisti – pakeliui. Jei šalia yra vaikų, jie mielai praves meistriškumo pamoką.'
        ],
        love:[
          {text:'Romantikos šiandien ore tiek, kiek kvepalų prekybos centro pirmame aukšte. Pirmas žingsnis neprivalo būti tobulas – užtenka, kad būtų drąsus.',do:'Kviesk į pasimatymą drąsiai, net jei visas planas – pica ir pasivaikščiojimas.',avoid:'Žaidimo „kas pirmas parašys“, kuris tęsiasi jau trečią savaitę.'},
          {text:'Staigmenos šiandien – geriausias romantikos prieskonis, bet ne tokios kaip netikėtas kaimyno remontas. Net raštelis su širdele ant veidrodžio dabar skamba kaip serenada.',do:'Paslėpk mylimam žmogui saldainį kišenėje – lobio paieškos be žemėlapio.',avoid:'Pasimatymo, per kurį abiejų akys įsmeigtos į darbo laiškus.'},
          {text:'Nuoširdumas šiandien nurungia ilgai repetuotą pozą. Pažintis gali užsimegzti greičiau, nei kišenėje susipainioja ausinių laidas.',do:'Pasiūlyk karaokės vakarą – net jei dainuoji kaip girgždančios durys.',avoid:'Dešimties asmenukių prieš išeinant, kad atrodytum „natūraliai“.'}
        ],
        work:[
          {text:'Ekranas šiandien atrodo nuobodesnis nei instrukcijų knygelė, nes mintys skraido kažkur paplūdimyje. Pabandyk rutiną paversti žaidimu – su taškais ir prizais.',do:'Už kiekvieną atliktą užduotį apdovanok save saldainiu ar penkių minučių pertrauka.',avoid:'Dramų kūrimo darbe vien tam, kad būtų įdomiau.'},
          {text:'Ataskaitos šiandien nuobodesnės nei bet kada, o idėjos – šviežios kaip rytinė bandelė. Lentelės gali palaukti: jos niekur nepabėgs, nors kartais labai norėtųsi.',do:'Nupiešk savo planą spalvotais flomasteriais – lentelės tokios linksmos niekada nebūna.',avoid:'Idėjų kritikos dar prieš joms gimstant.'},
          {text:'Piniginė šiandien linkusi pramogauti labiau nei tu. Smagi išlaida – gerai, bet ne tokia, po kurios banko išrašas atrodo kaip siaubo filmas.',do:'Nusibrėžk pramogų ribą ir leisk sau ją peržengti ne daugiau nei vienu ledų rutuliu.',avoid:'Impulsyvių pirkinių, kurių džiaugsmas trunka trumpiau nei pristatymas.'}
        ],
        energy:[
          {text:'Energijos šiandien tiek, kad galėtum šokti iki paryčių – ar bent iki pirmo kaimynų beldimo į sieną.',do:'Surenk šokių vakarėlį virtuvėje – žiūrovai nebūtini.',avoid:'Treniruočių, po kurių vienintelis noras – parašyti skundą.'},
          {text:'Seniai užmestas pomėgis šiandien tavęs ilgisi labiau nei buvę bendraklasiai. Gitara, siūlai ar dažai mielai atleis už ilgą pertrauką.',do:'Ištrauk seną pomėgį iš spintos ir nupūsk nuo jo dulkes – jis tavęs dar nepamiršo.',avoid:'Džiaugsmo dalijimo griežtomis porcijomis, lyg jis būtų leidžiamas tik penktadieniais.'},
          {text:'Šiandien geriausias sporto klubas – draugų kompanija: pilvo presą treniruoja juokas.',do:'Susitik su žmogumi, kurio juokas užkrečia greičiau nei žiovulys.',avoid:'Liūdnų naujienų maratono prieš miegą.'}
        ]
      },
      { // 6
        headline:['Sąrašų karalystė','Tvarka – nauja romantika','Kasdienybės čempionatas'],
        day:[
          'Tvarkos noras šiandien toks stiprus, kad net kojinės stalčiuje gali susirasti poras. Kiekviena smulki pergalė prieš chaosą verta medalio.',
          'Užsistovėję darbai šiandien rikiuojasi kaip pirkėjai prie vienintelės atidarytos kasos. Aptarnauk pirmąjį – ir eilė ims tirpti.',
          'Šiandien kūnas rašo atsiliepimą apie tavo įpročius – kaip internetinėje parduotuvėje, tik be žvaigždučių. Pataisyk vieną smulkmeną, ir įvertinimas kils.'
        ],
        work:[
          {text:'Viskas šiandien eina kaip sviestu patepta. Puiki diena užbaigti užduotis, kurios sąraše gyvena taip ilgai, kad jau galėtų mokėti nuomą.',do:'Pradėk nuo nemaloniausios užduoties – po jos likusi diena atrodys kaip atostogos.',avoid:'Dešimties darbų vienu metu, lyg naršyklėje su šimtu skirtukų.'},
          {text:'Gelbėjimo ratas šiandien – tavo kolegos, jei tik jų paprašysi. Aiškiai pasidalyti darbai sutaupo daugiau laiko nei trečias apsilankymas prie kavos aparato.',do:'Paskirstyk užduotis taip aiškiai, lyg tai būtų lemiamo kėlinio derinys.',avoid:'Pasitarimo apie pasitarimą, kuriame bus aptartas kitas pasitarimas.'},
          {text:'„Greitas“ darbelis šiandien gali užtrukti kaip „greitas“ užsukimas į parduotuvę. Laiko atsarga dabar vertesnė už auksą.',do:'Sutvarkyk dokumentų krūvą, kuri jau pradėjo kurti savo ekosistemą.',avoid:'Panikos dėl termino, kuris kalendoriuje mirksėjo visą mėnesį.'}
        ],
        energy:[
          {text:'Kūnas šiandien – kaip kambarinis augalas: nori vandens, šviesos ir šiek tiek dėmesio. Laiku suvalgyti pietūs – jau rimtas pasiekimas.',do:'Laistyk save vandeniu taip pat reguliariai kaip palangės gėles.',avoid:'Pietų pertraukos, kurią suvalgo dar vienas „skubus“ laiškas.'},
          {text:'Jėgos šiandien svyruoja kaip interneto ryšys kaimo sodyboje. Didelius darbus dalink į mažesnius gabalėlius.',do:'Kas valandą nueik iki lango ir atgal – tai bus tavo mažasis maratonas.',avoid:'Rekordų siekimo sporto salėje, kai kūnas jau kelia baltą vėliavą.'},
          {text:'Įpročius šiandien verta keisti po vieną – visus iš karto keičia tik Naujųjų metų pažadai, o jų likimą visi žinome.',do:'Užrašyk vieną naują įprotį ant lapelio ir priklijuok prie veidrodžio – kad rytas neturėtų pasiteisinimų.',avoid:'Didžiųjų gyvenimo pertvarkų sąrašo, ilgesnio už pirkinių sąrašą prieš šventes.'}
        ],
        love:[
          {text:'Šiandien jausmus geriausiai įrodo laiku nupirkta duona ir pagaliau sutaisytas lašantis čiaupas. Mažiau poetiška nei serenada, bet daug praktiškiau.',do:'Išnešk šiukšles, kol niekas nepaprašė – tai šiandienos meilės laiškas.',avoid:'Taškų lentelės, kas daugiau kartų plovė indus.'},
          {text:'Kalendoriuje romantikai šiandien liko tiek vietos, kiek reklamai tarp serijų. Bet net trumpas „galvoju apie tave“ gali sušildyti kaip karšta arbata.',do:'Parašyk artimam žmogui žinutę vidury dienos – be jokio praktinio klausimo.',avoid:'Žinučių, kuriose parašyta tik „nupirk pieno“.'},
          {text:'Šunų aikštelė šiandien gali pasiūlyti daugiau pažinčių nei programėlė, jei širdis laisva. Poroje romantiškiausias dienos maršrutas gali vesti per prekybos centrą.',do:'Pakalbink žmogų, kurį kasdien sutinki laiptinėje, ir pagaliau sužinok jo vardą.',avoid:'Laukimo, kol meilė pati pabels į duris su gėlėmis ir picos dėže.'}
        ]
      },
      { // 7
        headline:['Duetas vietoj solo','Derybų stalas padengtas','Viena valtis, du irklai'],
        day:[
          'Ši diena – kaip tango: šokama dviese, net jei kas nors kartais užmina ant kojos. Bendri darbai šiandien sekasi geriau, kai žingsniai suderinti iš anksto.',
          'Kompromisų šiandien daugiau nei laisvų vietų prekybos centro aikštelėje sekmadienio rytą. Pats laikas pagaliau susitarti, kas renkasi filmą, o kas – picos padažą.',
          'Kiti žmonės šiandien veikia kaip veidrodis prastame apšvietime: rodo tai, ko nenorėtum matyti. Pažvelk į tai su humoru – juk ir veidrodžiai kartais meluoja.'
        ],
        love:[
          {text:'Santykiams šiandien skirta pagrindinė scena ir geras garsas. Vienišai širdžiai rimta pažintis gali nutikti taip netikėtai kaip lietus be prognozės.',do:'Padėk abiejų telefonus į stalčių ir pažiūrėk, kas nutinka, kai niekas netrukdo.',avoid:'Gyvenimo klausimų sprendimo tarp dviejų skambučių ir pusės sumuštinio.'},
          {text:'Šiandien tinka svarstyti bendrą ateitį – nuo savaitgalio planų iki to, kieno bus didesnė spinta. Geriausi sprendimai gimsta, kai niekas nesislepia už „kaip nori“.',do:'Pasiūlyk sudaryti bendrą mėnesio planą – po vieną punktą kiekvienam, be teisės veto.',avoid:'Sprendimų už abiejų galvas, kai antroji pusė tuo metu žiūrėjo krepšinį.'},
          {text:'Santykiai šiandien primena sūpuokles: smagu tik tada, kai stumti tenka pakaitomis. Pažiūrėk, kieno rankos pavargusios labiau.',do:'Padėkok artimam žmogui už nematomą darbą, pavyzdžiui, už pieną šaldytuve.',avoid:'Didvyriško pasiaukojimo, už kurį vėliau tikiesi ordino.'}
        ],
        work:[
          {text:'Šiandien darbe geriau skamba orkestras nei vienas būgnas – net jei kas nors kartais pataiko ne į tą natą. Sutartims diena tinka, tik smulkų šriftą skaityk lėčiau nei meniu.',do:'Derybas pradėk nuo kavos ir sausainių – sutartis sklandžiau pasirašoma, kai niekas nealkanas.',avoid:'Viso projekto nešimo ant savo pečių, kai komanda stovi šalia tuščiomis rankomis.'},
          {text:'Geriausios derybos šiandien – tos, po kurių abi pusės jaučiasi laimėjusios. Ieškok sprendimo kaip dalijant picą: kiekvienam po gabalą su sūriu.',do:'Atnešk į derybas du pasiūlymus – vienas visada atrodo geriau, kai šalia yra kitas.',avoid:'Ginčų iki pergalės net dėl to, kas užsako kavą.'},
          {text:'Tarp kolegų šiandien išryškėja, kas tikras sąjungininkas, o kas tik mandagiai linksi. Paspausti ranką dabar naudingiau nei spausti „Patinka“.',do:'Užsirašyk visus pažadus kolegoms – atmintis šiandien kaip rėtis.',avoid:'Pažadų „padarysiu rytoj“, kai rytojus jau užimtas trimis kitais pažadais.'}
        ],
        energy:[
          {text:'Šiandien kitų lūkesčiai gali išsiurbti jėgas greičiau nei navigacija telefono bateriją. Prieš kiekvieną naują „taip“ patikrink savo įkrovos lygį.',do:'Pasakyk vieną mandagų „ne“ ir pasimėgauk, kaip lengvai jis skamba.',avoid:'Šypsojimosi kaip reklaminiame plakate, kai viduje norisi tylos.'},
          {text:'Kartu judėti šiandien smagiau – kaip ir nešti sofą laiptais. Bendras pasivaikščiojimas atstoja ir sportą, ir pokalbį.',do:'Išsivesk ką nors pasivaikščioti su viena taisykle: išspręsti bent vieną pasaulio problemą.',avoid:'Lenktynių su kito žmogaus žingsnių skaitikliu, kai tavo kojos prašo pertraukos.'},
          {text:'Kitų rūpesčius šiandien lengva prisiimti kaip benamius kačiukus – visus iš karto. Užuojauta graži, bet ir tavo jėgos ne begalinės.',do:'Nustatyk laikmatį kitų gelbėjimo misijai – superherojai irgi turi darbo valandas.',avoid:'Naktinės pagalbos linijos visiems draugams iš karto.'}
        ]
      },
      { // 8
        headline:['Nardymas be instruktoriaus','Širdies bankas atidarytas','Atsisveikinimo su šlamštu diena'],
        day:[
          'Gelmių sezonas atidarytas: į jausmus galima nerti be kostiumo ir deguonies balionų. Vienas nuoširdus pokalbis išvalo daugiau nei generalinis spintos tvarkymas.',
          'Skolos ir bendros išlaidos šiandien išlenda kaip kojinė iš po sofos – netikėtai, bet laiku. Sutvarkyk jas dabar, kol neprisijungė antroji kojinė.',
          'Šiandien drąsiai pamojuok atgyvenusiems dalykams: megztiniui, kurio nevilkėjai nuo pernai, ir įpročiui tikrinti buvusiųjų profilius. Ceremonija trumpa, ašaros nebūtinos.'
        ],
        love:[
          {text:'Atsiverti šiandien baisiau nei šokti nuo bokšto į baseiną, bet vanduo šiltesnis, nei atrodo iš viršaus. Pirmas sakinys – sunkiausias, toliau lengviau.',do:'Papasakok artimam žmogui apie vieną savo keistą baimę, pavyzdžiui, balandžių.',avoid:'Temos keitimo į orus, vos tik pokalbis tampa rimtas.'},
          {text:'Kaip ir santaupas, pasitikėjimą šiandien verta kaupti mažais, bet reguliariais indėliais. Jo kursas bent jau nesvyruoja kaip kriptovaliutų.',do:'Užduok vieną gilų klausimą vietoj dešimties apie tai, kas bus vakarienei.',avoid:'Pavydo scenų, kurias suvaidintum geriau nei serialo aktoriai.'},
          {text:'Širdies ežeras šiandien gilus, bet po lietaus kiek drumstas. Jei pavydas bando sėsti prie vairo, persodink jį į galinę sėdynę.',do:'Paklausk savo nerimo, kokie jo įrodymai – dažniausiai jų nebūna.',avoid:'Tylos streiko, kai užtektų vieno sakinio „man liūdna“.'}
        ],
        work:[
          {text:'Smulkus šriftas šiandien turi daugiau siužeto vingių nei detektyvas, ypač paskolų ir mokesčių popieriuose. Kaltininkas, kaip įprasta, slepiasi paskutinėje išnašoje.',do:'Perskaityk vienos sutarties smulkų šriftą su didinamuoju stiklu ir kava.',avoid:'Sutikimo su sąlygomis, kurių niekas neskaito – iki pirmos problemos.'},
          {text:'Komandoje šiandien gali kilti klausimų, kas už ką atsako – kaip šeimoje, kai sugenda skalbimo mašina. Aiškūs vaidmenys sutaupys daug dramos.',do:'Sudaryk atsakomybių lentelę, kurios neįmanoma „nepastebėti“.',avoid:'Paslapčių patikėjimo kolegai, kurio mėgstamiausi žodžiai – „tik tarp mūsų“.'},
          {text:'Skolos šiandien kaip bumerangai – anksčiau ar vėliau grįžta. Švelniai primink apie jas tiems, kurių atmintis staiga tapo labai trumpa.',do:'Primink skolininkui apie skolą su šypsena ir banko sąskaitos numeriu.',avoid:'Skolinimo draugui, kuris dar negrąžino pernykščio dviračio.'}
        ],
        energy:[
          {text:'Jausmų bagažas šiandien vargina labiau nei kraustymasis į penktą aukštą be lifto. Leisk emocijoms nusėsti kaip arbatžolėms puodelyje.',do:'Išjunk visus pranešimus valandai ir pažiūrėk, ar pasaulis sugrius.',avoid:'Komentarų skilties skaitymo – ten jėgos dingsta greičiau nei kojinės skalbimo mašinoje.'},
          {text:'Patalai šiandien traukia kaip lokį vėlyvą rudenį – ir tai visai sveika nuojauta. Žiemos miego nereikia, užteks ilgesnės nakties.',do:'Paskelbk savo lovą saugia zona, į kurią telefonams įeiti draudžiama.',avoid:'Vėlyvų pokalbių apie gyvenimo prasmę, kai laikrodis rodo antrą nakties.'},
          {text:'Treniruoklis, tapęs drabužių kabykla, šiandien žvelgia į tave priekaištingai. Gal metas jam rasti naujus namus, kur jis vėl taptų sportininku?',do:'Nufotografuok tris nenaudojamus daiktus ir įkelk į skelbimų portalą – tegul pradeda naują gyvenimą.',avoid:'Kaupimo „dėl visa ko“, kol spinta ims dairytis naujo buto.'}
        ]
      },
      { // 9
        headline:['Lagaminas mintyse sukrautas','Horizontas be ribų','Pasaulis didesnis nei kiemas'],
        day:[
          'Šiandien net kelionė į kitą miesto rajoną gali atrodyti kaip ekspedicija į Amazonę. Pasiimk sumuštinių, smalsumo ir bent porą žodžių nauja kalba.',
          'Pažvelk į savo rūpesčius kaip pro lėktuvo iliuminatorių – iš ten net didžiausia problema atrodo kaip degtukų dėžutė. Pagalvok, ką parašytum atviruke iš savo ateities.',
          'Filosofuoti šiandien galima bet kur – virtuvėje, autobuse ar eilėje pas gydytoją. Pokalbis su žmogumi iš kitos šalies gali pakeisti požiūrį labiau nei dešimt motyvacinių vaizdo įrašų.'
        ],
        energy:[
          {text:'Smalsumas šiandien jau aunasi batus: net naujas kelias į parduotuvę įkrauna geriau nei kroviklis.',do:'Išlipk iš autobuso viena stotele anksčiau ir pažiūrėk, kas ten gyvena.',avoid:'Maršruto namai–darbas–namai kartojimo kaip užstrigusios plokštelės.'},
          {text:'Šiandien poilsis – tai kelionė, nors ir ant sofos: dokumentinis filmas ar knyga apie tolimas šalis gali nunešti toliau nei pigūs skrydžiai.',do:'Išsirink filmą apie šalį, kurios pavadinimo dar nemoki ištarti.',avoid:'Naujienų srauto, kuriame tolimiausia kelionė – iki gretimo puslapio.'},
          {text:'Tikslas šiandien veikia kaip variklis – net jei tai tik tikslas pasiekti kepyklėlę prieš uždarymą.',do:'Išsikelk sporto tikslą su prizu, pavyzdžiui, bandele finišo tiesiojoje.',avoid:'Sporto aprangos, kuri ir toliau dirba tik pižama.'}
        ],
        work:[
          {text:'Mokymasis šiandien veikia kaip programos atnaujinimas, tik be perkrovimo: naujos žinios įsidiegia greitai ir be klaidų pranešimų.',do:'Pagaliau paspausk „Registruotis“ – tie kursai tavo žymėse guli jau trečią mėnesį.',avoid:'Atidėliojimo, nes „nežinau, nuo ko pradėti“, kai pradžia – vienas paspaudimas.'},
          {text:'Užduotims šiandien reikia žemėlapio: kur einama pirmyn, o kur tik sukamasi ratu. Paaiškės, kurie „skubūs“ darbai iš tiesų gali palaukti.',do:'Suformuluok savo metų tikslą taip trumpai, kad tilptų į kelionę liftu.',avoid:'Skubaus gesinimo darbų, kurie net nedega.'},
          {text:'Užsienio kontaktai šiandien gali atnešti naudos, net jei pusę laiško tenka rašyti su vertėju. Drąsa dabar svarbiau už gramatiką.',do:'Parašyk partneriams užsienyje ir pradėk laišką pasisveikinimu jų kalba.',avoid:'Gėdos dėl akcento – jis tik prideda žavesio.'}
        ],
        love:[
          {text:'Romantika šiandien kvepia lėktuvo bilietais, net jei kol kas tai tik autobuso bilietas į Kauną. Svajonės dviese – puiki pradžia.',do:'Suplanuok su artimu žmogumi kelionę – net jei ji įvyks tik žemėlapyje.',avoid:'Ginčų dėl lagamino svorio dar prieš perkant bilietus.'},
          {text:'Eilė prie muziejaus šiandien gali būti romantiškesnė už žvakių vakarienę, jei širdis laisva. Poroje bendras nuotykis gaivina geriau nei naujos užuolaidos.',do:'Pakalbink žmogų, kuris apie keliones pasakoja su žiburiukais akyse.',avoid:'Pokalbių vien apie darbą, kai šalia stovi žmogus, kuris aplankė penkiasdešimt šalių.'},
          {text:'Jausmų klausimai šiandien tampa filosofiniai: ko iš tikrųjų ieškau ir kodėl kažkas vėl paliko tuščią pakuotę šaldytuve?',do:'Sudaryk trijų punktų „ieškomo žmogaus“ sąrašą ir ketvirtu punktu įrašyk humoro jausmą.',avoid:'Santykių lyginimo su romantinių komedijų scenarijais.'}
        ]
      },
      { // 10
        headline:['Karjeros liftas kyla','Vadovų radaras įjungtas','Tavo vardas – antraštėje'],
        day:[
          'Prožektoriai šiandien krypsta į tave, todėl išsiskiri kaip šviesoforas tuščioje sankryžoje naktį. Pasirūpink, kad degtų žalia.',
          'Karjeros navigacija šiandien prašo patikrinimo: ar vis dar važiuoji ten, kur norėjai, ar tik ten, kur mažiau spūsčių?',
          'Tai, ką šiandien pasakysi, gali būti cituojama ilgiau nei geriausias kolegos anekdotas. Rinkis žodžius taip, lyg juos ketintų spausdinti ant puodelių.'
        ],
        work:[
          {text:'Tavo idėjos šiandien pastebimos kaip naujas automobilis daugiabučio kieme – visi išeina pasižiūrėti. Pats laikas išriedėti su savo projektu į pagrindinę gatvę.',do:'Papuošk savo pasiekimą diagrama – vadovai stulpelius myli labiau nei žodžius.',avoid:'Pasakymo „ai, nieko tokio“, kai iš tiesų tai buvo labai daug ko.'},
          {text:'Dideliems darbams šiandien reikia ištvermės – kaip kopiant į Gedimino kalną su pirkinių maišais. Užtat viršuje vaizdas atperka visus laiptelius.',do:'Pasirink vieną didelį tikslą ir šiandien žengk bent vieną žingsnį, net jei jis mažas kaip pelės pėdsakas.',avoid:'Žongliravimo dešimčia darbų, kai rankos tik dvi.'},
          {text:'Pokalbis apie atlyginimą šiandien turi daugiau šansų nei paprastai. Ramus tonas veikia geriau nei kumštis į stalą ar ašaros į kavą.',do:'Į pokalbį su vadovu atsinešk faktų, o ne vien gerą nuotaiką ir sausainių.',avoid:'Argumento „bet kaimynas uždirba daugiau“ kaip pagrindinio kozirio.'}
        ],
        energy:[
          {text:'Užbraukta eilutė darbų sąraše šiandien teikia daugiau malonumo nei šokoladas – net jei eilutė buvo „atsakyti į laišką“.',do:'Vakare išvardyk tris šios dienos pergales ir įteik sau įsivaizduojamą medalį.',avoid:'Vidinio kritiko, kuris griežtesnis už bet kokį vadovą.'},
          {text:'Pečiai šiandien gali taip įsitempti, kad užsikels iki ausų. Trumpos pertraukos padės juos nuleisti atgal.',do:'Pakelk pečius iki ausų ir nuleisk kas porą valandų – tegul kolegos galvoja, kad tai šokis.',avoid:'Darbo laiškų lovoje, kai pagalvė jau seniai pareiškė protestą.'},
          {text:'Darbo diena šiandien gali tęstis kaip serialas, kurio „paskutinė“ serija niekada nebūna paskutinė. Laiku paspausk „Stop“, kol neprasidėjo kitas sezonas.',do:'Pasakyk kompiuteriui „labanakt“ garsiai – kad jis nebandytų tavęs įkalbėti pasilikti.',avoid:'Viršvalandžių, už kuriuos vienintelis atlygis – ventiliatoriaus ūžesys.'}
        ],
        love:[
          {text:'Ataskaitos šiandien gali užimti tiek vietos, kad meilei lieka tik paraštės. Trumpa žinutė vakare primins, kad tavo dėmesio laukia ne vien jos.',do:'Vakare pasikalbėk su artimu žmogumi apie bet ką, tik ne apie darbą – už kiekvieną darbo žodį moki eurą.',avoid:'Ataskaitų pasakojimo vakarienės metu, lyg tai būtų detektyvo siužetas.'},
          {text:'Geriausias komplimentas šiandien – „žinau, kad tau pavyks“. Laisvai širdžiai verta apsidairyti konferencijų kavos pertraukose – ten ne tik sausainiai būna įdomūs.',do:'Tapk artimųjų garsiausia palaikymo komanda – su plakatais, jei reikės.',avoid:'Romano su kolega, kai visas biuras jau lažinasi, kuo tai baigsis.'},
          {text:'Skaidrė su vien kylančiomis kreivėmis – štai kuo šiandien norisi atrodyti. Bet namuose šarvus galima pakabinti prieškambaryje, šalia striukės.',do:'Paversk vieną darbo nesėkmę juokinga istorija vakarienei.',avoid:'Instrukcijų artimiesiems tonu, kurio išsigąstų net praktikantai.'}
        ]
      },
      { // 11
        headline:['Draugų grupė pabudo','Ateitis su planu B','Bendruomenės galia'],
        day:[
          'Kvietimai šiandien skraido kaip konfeti: draugai, bendraminčiai ir net tas pažįstamas, kurio vardą vis pamiršti. Pagauk bent vieną.',
          'Ateities planai šiandien įdomesni už vakarienės meniu, nors ir sunkiau paruošiami. Užrašyk juos, nes galvoje vietos nebėra – ten gyvena slaptažodžiai.',
          'Draugų gimtadienyje sutiktas žmogus šiandien gali tapti verslo partneriu ar bent geru patarėju, kaip užsiauginti pomidorų.'
        ],
        love:[
          {text:'Simpatijos šiandien mėgsta ateiti per draugus – kaip siuntinys per kaimyną. Jei širdis laisva, verta priimti kvietimą į vakarėlį, o poroje – pasikviesti draugų pas save.',do:'Pasipuošk taip, lyg vakarėlyje lauktų tavo gerbėjų klubas – kartais taip ir būna.',avoid:'Atsakymo „gal kitą kartą“, kuris jau tapo tavo parašu.'},
          {text:'Stipriausios poros šiandien – tos, kurios ir draugauja: turi juokelių, kurių niekas nesupranta, ir moka kartais pabūti atskirai. Tai tvirtesni klijai nei bendra paskola.',do:'Išbandyk su artimu žmogumi naują pomėgį – iš nesėkmių kartu juoktis smagiau.',avoid:'Pavydo antrosios pusės draugų pokalbių grupei, lyg ten vyktų slapti pasitarimai.'},
          {text:'Draugai šiandien gali tapti piršliais, jei širdis laisva – tik duok jiems bent apytikslį techninį aprašymą. Poroje smagu kartu kurti planus, kurie beprotiškai skamba tik kitiems.',do:'Leisk draugams surengti tau pažinčių vakarą – su sąlyga, kad meniu renkiesi tu.',avoid:'Aklųjų pasimatymų, kuriuos organizuoja draugas, žinantis tik tavo zodiako ženklą.'}
        ],
        work:[
          {text:'Ryšiai šiandien vertingesni už bet kokį gyvenimo aprašymą. Kolegų grupė ar profesinis forumas gali išspręsti problemą greičiau nei trys valandos paieškų internete.',do:'Užduok klausimą profesinėje grupėje – kažkas tikrai jau buvo įklimpęs į tą pačią balą.',avoid:'Pokalbių grupės, kurioje pusę laiko aiškinamasi, kas paėmė jogurtą iš šaldytuvo.'},
          {text:'Tas legendinis „kada nors“ verslas šiandien prašosi bent vieno puslapio plano. Planas popieriuje vertas daugiau nei dešimt idėjų po dušu.',do:'Sušauk savo „kada nors“ verslo pirmą posėdį – kad ir virtuvėje prie arbatos.',avoid:'Paskolų draugams be sutarties, kai vienintelis dokumentas – jaustukas.'},
          {text:'Krepšinio taisyklės šiandien galioja ir darbe: vienas metimas retai laimi rungtynes, o geras perdavimas – dažnai.',do:'Pagirk kolegos idėją susitikime – rezultatyvus perdavimas irgi įskaitomas.',avoid:'Solo prasiveržimų, kai komanda atvira ir laukia kamuolio.'}
        ],
        energy:[
          {text:'Draugų kompanija šiandien veikia kaip saulės baterija – įkrauna net ir apsiniaukusią dieną.',do:'Suburk draugus į čiuožyklą ir paskelbk, kad šiandien laimi tas, kuris garsiausiai juokiasi.',avoid:'Susitikimų, kuriuose visi tik skundžiasi, lyg tai būtų olimpinė rungtis.'},
          {text:'Svajonės šiandien veikia kaip kava: kuo drąsesnė svajonė, tuo daugiau joje kofeino.',do:'Užrašyk vieną beprotišką svajonę ir pakabink ją ant šaldytuvo šalia sąskaitų.',avoid:'Svajonių vertinimo tik pagal tai, ar jos telpa į biudžetą.'},
          {text:'Socialinis kalendorius šiandien primena autobusą piko metu – laisvų vietų nebėra, o jėgos senka.',do:'Atsisakyk vieno kvietimo ir tą vakarą praleisk pasimatyme su savo sofa.',avoid:'Trijų vakarėlių per vieną vakarą su logistika, vertą kurjerių tarnybos.'}
        ]
      },
      { // 12
        headline:['Ryšys laikinai išjungtas','Pagalvė kviečia derėtis','Užuolaidos užtrauktos'],
        day:[
          'Šiandien įsijungia režimas „netrukdyti“ – ir tai ne klaida, o funkcija. Tylus vakaras dabar vertas daugiau nei kvietimas į triukšmingiausią vakarėlį.',
          'Nuojauta šiandien tikslesnė už orų prognozę telefone. Sapnai irgi verti dėmesio – net tie, kuriuose laikai egzaminą nežinoma kalba.',
          'Užbaik tai, kas tęsiasi ilgiau nei serialas su dvylika sezonų. Nauji projektai palauks – pirmiausia uždaryk senus skirtukus ir naršyklėje, ir galvoje.'
        ],
        energy:[
          {text:'Šiandien gaunamas sisteminis pranešimas: „Baterija senka, prašome prijungti prie pagalvės“. Tai ne gedimas, o išmanusis režimas.',do:'Paskelbk vakarinę tylos valandą ir paaiškink ją net katinui.',avoid:'Naktinių ekskursijų prie šaldytuvo, kai miegas jau seniai laukia.'},
          {text:'Vienuma šiandien – geriausia kompanija: tik tu, arbata ir tyla, kuri pagaliau nieko neprašo.',do:'Užsidaryk vonioje su knyga ir paskelbk tai spa procedūra.',avoid:'Vakarėlių, į kuriuos eini tik dėl nuotraukų.'},
          {text:'Nuotaika šiandien svyruoja kaip valtis vėjuotame ežere. Geriausias inkaras – dešimt lėtų įkvėpimų ir puodelis kažko šilto.',do:'Įsivaizduok, kad tavo mintys – tingios bangos, ir leisk joms nurimti prie kranto.',avoid:'Egzistencinių klausimų po vidurnakčio, kai atsakymus siūlo tik paieškos sistema.'}
        ],
        love:[
          {text:'Šiandien meilė kalba pašnibždomis, lyg visi būtų bibliotekoje. Kartais tylus apkabinimas pasako daugiau nei trijų valandų pokalbis.',do:'Pasiūlyk tylos žaidimą: kas ilgiau tylės, tas renkasi desertą.',avoid:'Atodūsių su paaiškinimu „nieko“, kai iš tiesų tai „viskas“.'},
          {text:'Praeitis šiandien gali užsukti be skambučio – per seną nuotrauką ar dainą, kuri skambėjo per pirmą pasimatymą. Pasiklausyk, bet atgal nevažiuok.',do:'Sudaryk grojaraštį „Praeitis“ ir leisk jam skambėti tik vieną kartą.',avoid:'Žinučių buvusiesiems po vidurnakčio, kai išmintis jau miega.'},
          {text:'Šiandien geriausias pasimatymas gali būti su savimi: niekas nepertraukia, ir visi juokeliai suprantami.',do:'Nusipirk sau gėlių ir pasakyk komplimentą veidrodžiui.',avoid:'Pasimatymų kalendoriui užpildyti, kad savaitgalyje nebūtų tuščių langelių.'}
        ],
        work:[
          {text:'Užduočių sąrašas šiandien juda lėčiau nei eilė prie paštomato prieš šventes. Seni darbai nusipelnė finalo, o nauji – tik kvietimo į kitą sezoną.',do:'Išsirink seniausią užduotį sąraše ir surenk jai iškilmingas išleistuves.',avoid:'Lemiamų susitikimų, į kuriuos eini su tokiu pat entuziazmu kaip pas odontologą.'},
          {text:'Užkulisiai šiandien – tavo scena: niekas nemato, bet be tavęs spektaklis sustotų.',do:'Sutvarkyk el. pašto dėžutę – trys tūkstančiai neskaitytų laiškų nebus amžini.',avoid:'Scenos šviesų tokią dieną, kai net projektorius atrodo pavargęs.'},
          {text:'Piniginė šiandien nori pabūti nematoma, kaip katinas, išgirdęs dulkių siurblį. Leisk jai pasislėpti – didieji sprendimai nepabėgs.',do:'Įsidėk naujų pirkinių sąrašą į šaldiklį – tegul atvėsta iki kitos savaitės.',avoid:'Finansinių patarimų iš nepažįstamųjų, kurių profilio nuotraukoje – jachta.'}
        ]
      }
    ]
  }
};
