import {openModal} from './modal.js';
import {selectedCurrency,saveCurrency} from './currency-core.js';
import {chooseCurrency} from './currency-picker.js';
import {createStationComparison} from './station-comparison.js';
import {t,lang,locale,labels as uiLabels} from './i18n.js';
import {icon} from './icons.js';
import {widgetCountry,widgetIcon,widgetPicker} from './widget-heading.js';
import { priceButton } from './charts.js';
import { currentZodiac } from './zodiac.js';
import {fuelPriceState} from './fuel-freshness.js';
import {colorTrend} from './chart-math.js';
import {electricityQuoteAt} from './electricity-time.js';
// Track input method because native selects can match :focus-visible after a mouse click.
document.documentElement.dataset.inputModality='keyboard';
document.addEventListener('pointerdown',()=>{document.documentElement.dataset.inputModality='pointer';},true);
document.addEventListener('pointerdown',event=>{
  for(const menu of document.querySelectorAll('.horoscope-tone[open]'))if(!menu.contains(event.target))menu.open=false;
});
document.addEventListener('keydown',event=>{if(!['Shift','Control','Alt','Meta'].includes(event.key))document.documentElement.dataset.inputModality='keyboard';},true);
const $ = (selector) => document.querySelector(selector);
const number = (value, digits = 3) => new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

async function readJSON(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally { clearTimeout(timeout); }
}

function validateEnvelope(json) {
  if (json.schema_version !== 1 || !json.data || !Number.isFinite(Date.parse(json.updated_at)) || typeof json.source !== 'string') throw new Error('Invalid data');
}

async function loadWidget(name, render) {
  const container = $(`#${name}-content`);
  try {
    const market = document.documentElement.dataset.market || 'LV';
    const json = await readJSON(`data/${lang}/${name === 'fuel' ? `fuel-${market}` : name}.json?lang=${lang}`);
    validateEnvelope(json);
    container.replaceChildren();
    render(container, json.data);
    container.dataset.updatedAt = json.updated_at;
    if (name !== 'horoscope' && !json.demo && Date.now() - Date.parse(json.updated_at) > 86400000) container.append(element('span', 'stale', t('stale_data','Data is older than 24 hours')));
  } catch {
    const message = element('div', 'error-message', t('unavailable','Data is currently unavailable.'));
    const retry = element('button', '', t('retry','Retry'));
    retry.type = 'button';
    retry.addEventListener('click', () => loadWidget(name, render));
    message.append(retry);
    container.replaceChildren(message);
  }
}

function trend(current, previous, percent = false,lowerIsBetter=false) {
  const known = Number.isFinite(previous) && Number.isFinite(current);
  const delta = known ? current - previous : 0;
  const hasPercentage = known && previous !== 0;
  const value = hasPercentage ? delta / Math.abs(previous) * 100 : 0;
  const direction = !known ? 'unknown' : delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const arrow = direction === 'up' ? '↑' : direction === 'down' ? '↓' : '–';
  const label = !known?t('no_comparison','No comparison available'):t('previous_value','Previous: {value}',{value:number(previous,4)})+(hasPercentage?' · '+t('change_value','Change: {value}%',{value:number(value,2)}):'');
  const node = element('span', `trend ${known?colorTrend(delta,lowerIsBetter):'unknown'}`, percent && hasPercentage ? `${arrow} ${number(Math.abs(value), 2)}%` : arrow);
  if(!known || delta===0)node.hidden=true;
  node.title = label;
  node.setAttribute('aria-label', label);
  return node;
}

function applyPriceTrend(button, current, previous) {
  if (Number.isFinite(current) && Number.isFinite(previous)) button.dataset.trend = colorTrend(current-previous,button.dataset.lowerIsBetter==='true');
}

const fuelKeys = ['petrol95', 'diesel'];
const fuelPriceViews=[];
function unavailableFuel(quote,label){
  const state=fuelPriceState(quote);
  const reason=state==='stale'?t('fuel_price_expired','Published price is older than 48 hours'):
    quote?.source_status==='error'?t('source_unavailable','Source currently unavailable'):
    t('fuel_price_unconfirmed','No confirmed price from the last 48 hours');
  const marker=Number.isFinite(quote?.price)?priceButton(quote,{label,unit:'EUR/l',text:'—',className:'unavailable'}):element('span','unavailable','—');
  if(marker.tagName==='SPAN')marker.setAttribute('role','img');
  marker.title=[reason,quote?.observed_at||quote?.observed_date].filter(Boolean).join(' · ');marker.setAttribute('aria-label',label+': '+reason);return marker;
}
function paintFuelPrice(cell,quote,label){
  cell.replaceChildren();
  if (fuelPriceState(quote)!=='recent') cell.append(unavailableFuel(quote,label));
  else {
    const button = priceButton(quote,{label,unit:'EUR/l'}); button.append(trend(quote.price,quote.previous,false,true));
    applyPriceTrend(button,quote.price,quote.previous);
    button.title = [quote.scope==='network_published_minimum'?t('network_minimum','Published network minimum; individual station prices may differ'):'', !quote.observed_date&&!quote.observed_at?t('publication_date_unknown','Publication date not provided by the operator'):'',quote.station_address, quote.observed_date || quote.observed_at?.slice(0,10), quote.freshness === 'stale' ? t('old','Outdated price') : '', quote.source_status === 'error' ? t('source_unavailable','Source currently unavailable') : '', t('view_price_history','View price history')].filter(Boolean).join(' · ');
    if (quote.freshness === 'stale' || quote.source_status === 'error') {
      button.classList.add('stale-price');

    }
    cell.append(button);
  }
}
function fuelCell(quote,label){const cell=element('td','price-cell');paintFuelPrice(cell,quote,label);fuelPriceViews.push({node:cell,quote,label,state:fuelPriceState(quote)});return cell;}
function updateFuelPriceNote(note){
  note.hidden=fuelPriceViews.every(item=>item.state==='recent');
}
function refreshFuelPriceViews(){
  let changed=false;
  for(const item of fuelPriceViews){
    const state=fuelPriceState(item.quote);
    if(item.node.isConnected&&state!==item.state){
      paintFuelPrice(item.node,item.quote,item.label);
      item.state=state;
      changed=true;
    }
  }
  if(changed)updateFuelPriceNote(document.querySelector('#fuel-content .fuel-price-note'));
}
setInterval(refreshFuelPriceViews,60000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refreshFuelPriceViews();});

function fuelPhotoButton(){
  const trigger=element('button','fuel-photo-trigger',t('fuel_photo_add','Add a price photo'));
  trigger.type='button';
  trigger.setAttribute('aria-haspopup','dialog');
  trigger.prepend(icon('camera'));
  trigger.addEventListener('click',()=>{
    const dialog=element('dialog','fuel-photo-dialog');
    dialog.setAttribute('aria-labelledby','fuel-photo-title');
    const header=element('header');
    const title=element('h2','',t('fuel_photo_add','Add a price photo'));
    title.id='fuel-photo-title';
    const close=element('button','fuel-photo-close','×');
    close.type='button';
    close.setAttribute('aria-label',t('close','Close'));
    close.addEventListener('click',()=>dialog.close());
    header.append(title,close);
    dialog.addEventListener('close',()=>{
      dialog.remove();
      trigger.focus({preventScroll:true});
    });
    dialog.append(header);
    document.body.append(dialog);
    const cameraDevice=matchMedia('(pointer: coarse)').matches||navigator.userAgentData?.mobile;
    if(!cameraDevice){
      dialog.append(element('p','',t('fuel_photo_phone','Open this page on your phone. In Energy, tap Add a price photo.')));
      openModal(dialog,close);
      return;
    }
    openFuelCamera(dialog,close);
  });
  return trigger;
}

function openFuelCamera(dialog,close){
  if(!navigator.mediaDevices?.getUserMedia){
    dialog.append(element('p','',t('fuel_photo_secure','Open the HTTPS version of this page on your phone to use its camera.')));
    openModal(dialog,close);
    return;
  }
  const live=element('video','fuel-photo-preview');
  live.muted=true;
  live.playsInline=true;
  live.hidden=true;
  const preview=element('canvas','fuel-photo-preview');
  preview.setAttribute('role','img');
  preview.setAttribute('aria-label',t('fuel_photo_preview','Price board photo'));
  preview.hidden=true;
  const status=element('p','fuel-photo-status');
  status.setAttribute('role','status');
  const action=element('button','fuel-photo-choose');
  action.type='button';
  const takeLabel=t('fuel_photo_take','Take photo');
  let stream;

  function stopCamera(){
    live.pause();
    stream?.getTracks().forEach(track=>track.stop());
    stream=null;
    live.srcObject=null;
    live.hidden=true;
  }

  async function startCamera(){
    preview.hidden=true;
    preview.width=0;
    action.disabled=true;
    action.textContent=takeLabel;
    status.textContent=t('fuel_photo_starting','Opening the camera…');
    try{
      const camera=await navigator.mediaDevices.getUserMedia({
        video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}},
        audio:false,
      });
      if(!dialog.open){
        camera.getTracks().forEach(track=>track.stop());
        return;
      }
      stream=camera;
      live.srcObject=stream;
      live.hidden=false;
      await live.play();
      if(!dialog.open)return;
      status.textContent=t('fuel_photo_instructions','Hold the phone still and frame the prices and station logo.');
    }catch{
      stopCamera();
      if(!dialog.open)return;
      status.textContent=t('fuel_photo_camera_error','Could not open the camera. Check camera access in your browser.');
      action.textContent=t('retry','Retry');
    }
    action.disabled=false;
  }

  action.addEventListener('click',()=>{
    if(!stream){startCamera();return;}
    if(!live.videoWidth||live.readyState<2)return;
    preview.width=live.videoWidth;
    preview.height=live.videoHeight;
    preview.getContext('2d').drawImage(live,0,0);
    preview.hidden=false;
    stopCamera();
    status.textContent=t('fuel_photo_check','Check that every digit is visible. If any are missing, take another photo.');
    action.textContent=t('fuel_photo_replace','Retake photo');
  });
  dialog.addEventListener('close',stopCamera);
  const local=element('p','fuel-photo-local',t('fuel_photo_local','Local preview only. The photo stays on this device.'));
  dialog.append(status,live,preview,action,local);
  openModal(dialog,close);
  startCamera();
}

function fuel(container, data) {
  fuelPriceViews.length=0;
  if (!Array.isArray(data.providers) || data.providers.some(p => typeof p.name !== 'string' || !p.prices)) throw new Error('Invalid fuel data');
  const withReference = quote => quote ? {...quote, reference_history: data.country_history?.[quote.reference_key]?.history,
    reference_label: data.country_history?.[quote.reference_key]?.label, reference_source: data.country_history?.[quote.reference_key]?.source} : null;
  if (!data.providers.length) container.append(element('p','muted',t('fuel_loading','Loading fuel prices…')));
  const table = element('table', 'fuel-table');
  table.setAttribute('aria-label', t('fuel_table','Fuel prices by network, EUR per litre'));
  const head = element('thead'); const header = element('tr');
  [t('station','Station'), '95', t('diesel','Diesel')].forEach(label => { const th = element('th', '', label); th.scope = 'col';header.append(th); });
  head.append(header);
  const body = element('tbody');
  const compare=createStationComparison(data);
  data.providers.forEach(provider=>{
    const row=element('tr'),name=element('th');name.scope='row';
    const button=element('button','provider-button',provider.name);button.type='button';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','station-comparison');button.append(icon('right'));
    if(provider.station_count){const count=element('small','station-count',String(provider.station_count));count.title=t(provider.directory_location_count?'directory_count':'priced_count','Known locations',{count:provider.station_count});button.append(count);}
    button.addEventListener('click',()=>compare.open(provider.name));name.append(button);row.append(name,...fuelKeys.map((key,i)=>fuelCell(withReference(provider.prices[key]),provider.name+' · '+['95',t('diesel','Diesel')][i])));body.append(row);
  });
  table.append(head,body);container.append(table);
  const footer=element('div','fuel-table-footer');
  const note=element('p','fuel-price-note',t('fuel_no_current_operator_price','— No current price from the station network'));
  updateFuelPriceNote(note);
  footer.append(note,fuelPhotoButton());
  container.append(footer);
  const actions=element('div','fuel-header-actions'),compareButton=element('button','compare-stations-button',t('compare_stations','Compare stations'));compareButton.type='button';compareButton.setAttribute('aria-haspopup','dialog');compareButton.setAttribute('aria-controls','station-comparison');compareButton.append(icon('right'));compareButton.addEventListener('click',()=>compare.open());actions.append(compareButton);
  const fuelHeader=container.closest('.widget').querySelector('.widget-header');fuelHeader.querySelector('.fuel-header-actions')?.remove();fuelHeader.querySelector('h3').after(actions);

  const energyQuotes=element('div','energy-quotes');container.append(energyQuotes);
  const power = element('div', 'electricity'); power.textContent = t('electricity_loading','Loading electricity price…'); energyQuotes.append(power);
  loadElectricity(power);
  const gas=element('div','electricity gas');energyQuotes.append(gas);loadGas(gas);
}

const electricityDocuments=new WeakMap(),electricityContainers=new Set();
function refreshElectricityClock(){for(const container of electricityContainers)if(container.isConnected)loadElectricity(container,true);}
setInterval(refreshElectricityClock,60000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refreshElectricityClock();});
async function loadElectricity(container,cached=false) {
  try {
    const json = cached?electricityDocuments.get(container):await readJSON(`data/${lang}/electricity.json?lang=${lang}`); validateEnvelope(json);electricityDocuments.set(container,json);electricityContainers.add(container);
    const market = document.documentElement.dataset.market || 'LV';
    const quote = electricityQuoteAt(json.data.areas?.[market]);
    if (!quote || !Number.isFinite(quote.price_eur_mwh) || !Number.isFinite(Date.parse(quote.valid_from)) || !Number.isFinite(Date.parse(quote.valid_to))) throw new Error('Invalid electricity');
    const info = element('div', 'electricity-info');
    const timeZone = {LV:'Europe/Riga', EE:'Europe/Tallinn', LT:'Europe/Vilnius'}[market];
    const time = date => new Intl.DateTimeFormat(locale, {timeZone, hour:'2-digit', minute:'2-digit', hourCycle:'h23'}).format(new Date(date));
    const previous = Number.isFinite(quote.previous_eur_mwh) ? quote.previous_eur_mwh / 1000 : null;
    const history = quote.history?.map(p=>({at:p.at,value:p.value/1000}));
    const daily_history=quote.history_daily?.map(p=>({at:p.at,value:p.value/1000}));
    const chartQuote={price:quote.price_eur_mwh/1000,history,daily_history,history_source:quote.source},chartOptions={label:`${t('electricity','Electricity')} · Nord Pool ${market}`,unit:'EUR/kWh',digits:4,intraday:true};
    const trigger=priceButton(chartQuote,chartOptions);
    const heading=priceButton(chartQuote,{...chartOptions,text:t('electricity','Electricity'),className:'energy-name'});heading.classList.add('electricity-title','energy-title-trigger');heading.prepend(icon('bolt'));
    const caption=`Nord Pool · ${market} · ${time(quote.valid_from)}–${time(quote.valid_to)}`;
    heading.title=trigger.title=caption;info.append(heading);
    applyPriceTrend(trigger,quote.price_eur_mwh/1000,previous);
    trigger.append(element('span','unit',' EUR/kWh'),trend(quote.price_eur_mwh/1000,previous,false,true));
    const price = element('div', 'electricity-price'); price.append(trigger);
    container.title = t('electricity_basis','Wholesale price excluding VAT and fees. Compared with the previous interval.');
    container.replaceChildren(info, price);
  } catch { container.replaceChildren(element('span', 'muted', t('electricity_unavailable','Electricity price unavailable'))); }
}

async function loadGas(container){
  try{
    const json=await readJSON(`data/${lang}/gas.json?lang=${lang}`);validateEnvelope(json);
    const market=document.documentElement.dataset.market || 'LV',quote=json.data.areas?.[market];
    if(!Number.isFinite(quote?.price_eur_mwh))throw Error('No gas price');
    const info=element('div','electricity-info');
    const caption=`EEX NGP · ${quote.zone} · ${quote.observed_date}${quote.provisional?' · '+t('provisional','Provisional'):''}`;
    const chartQuote={price:quote.price_eur_mwh,history:quote.history,history_source:quote.history_source,chart_series:quote.chart_series},chartOptions={label:`${t('gas','Natural gas')} · ${quote.zone}`,unit:'EUR/MWh',digits:2};
    const trigger=priceButton(chartQuote,chartOptions);
    const heading=priceButton(chartQuote,{...chartOptions,text:t('gas','Natural gas'),className:'energy-name'});heading.classList.add('electricity-title','energy-title-trigger');heading.prepend(icon('flame'));heading.title=trigger.title=caption;info.append(heading);
    applyPriceTrend(trigger,quote.price_eur_mwh,quote.previous_eur_mwh);trigger.append(element('span','unit',' EUR/MWh'),trend(quote.price_eur_mwh,quote.previous_eur_mwh,false,true));
    const price=element('div','electricity-price');price.append(trigger);container.title=t('gas_basis','Wholesale, excluding VAT and delivery fees');container.replaceChildren(info,price);
  }catch{container.replaceChildren(element('span','muted',t('gas','Natural gas')+' · '+t('unavailable','Data unavailable')));}
}

function horoscope(container, data) {
  if (!Array.isArray(data.signs) || !data.signs.length || data.signs.some(s => ['name', 'id', 'dates','today','tomorrow'].some(k => typeof s[k] !== 'string'))) throw new Error('Invalid horoscope data');
  const timeZone=data.timezone||'Europe/Riga';
  let selected=Math.max(0,data.signs.findIndex(sign=>sign.id===currentZodiac(new Date(),timeZone))),day='today';
  let mood=data.selected_mood||'serious';
  const variant=crypto.getRandomValues(new Uint32Array(1))[0]%(data.variants_per_mood||3);
  try{const saved=localStorage.getItem('horoscope-mood');if(saved==='playful')mood='humor';else if(data.moods?.includes(saved))mood=saved;}catch{}
  const tabs=element('div','horoscope-days segmented');
  for(const [key,label] of [['today',t('today','Today')],['tomorrow',t('tomorrow','Tomorrow')]]){
    const button=element('button','',label);button.type='button';button.dataset.day=key;
    button.addEventListener('click',()=>{day=key;show();});tabs.append(button);
  }
  const top=element('div','zodiac-top');
  const {control:select,value:signValue}=widgetPicker(t('horoscope','Horoscope'),'horoscope');
  select.setAttribute('aria-expanded','false');
  document.querySelector('#zodiac-dialog')?.remove();
  const picker=element('dialog','zodiac-dialog');picker.id='zodiac-dialog';picker.setAttribute('aria-labelledby','zodiac-dialog-title');
  const pickerHeader=element('header','zodiac-dialog-header'),pickerTitle=element('h2','',t('zodiac_sign','Zodiac sign'));pickerTitle.id='zodiac-dialog-title';
  const closePicker=element('button','zodiac-dialog-close','×');closePicker.type='button';closePicker.setAttribute('aria-label',t('close','Close'));closePicker.addEventListener('click',()=>picker.close());pickerHeader.append(pickerTitle,closePicker);
  const choices=element('div','zodiac-choices');
  const ranges=['21.03–19.04','20.04–20.05','21.05–20.06','21.06–22.07','23.07–22.08','23.08–22.09','23.09–22.10','23.10–21.11','22.11–21.12','22.12–19.01','20.01–18.02','19.02–20.03'];
  data.signs.forEach((sign,i)=>{const choice=element('button','zodiac-choice');choice.type='button';choice.dataset.sign=String(i);choice.append(icon(sign.id),element('span','zodiac-choice-name',sign.name),element('small','',ranges[i]));choice.addEventListener('click',()=>{selected=i;show();picker.close();});choices.append(choice);});
  choices.addEventListener('keydown',event=>{const offsets={ArrowRight:1,ArrowLeft:-1,ArrowDown:2,ArrowUp:-2};if(!(event.key in offsets)&&!['Home','End'].includes(event.key))return;event.preventDefault();const buttons=[...choices.children],i=buttons.indexOf(document.activeElement),next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(i+offsets[event.key]+buttons.length)%buttons.length;buttons[next].focus();});
  picker.append(pickerHeader,choices);document.body.append(picker);
  select.addEventListener('click',()=>{openModal(picker,choices.children[selected]);select.setAttribute('aria-expanded','true');});
  picker.addEventListener('close',()=>{select.setAttribute('aria-expanded','false');select.focus({preventScroll:true});});
  picker.addEventListener('click',event=>{if(event.target!==picker)return;const r=picker.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)picker.close();});
  const dates=element('p','zodiac-date');
  const tone=element('details','horoscope-tone'),toneToggle=element('summary');
  const toneMenu=element('div','horoscope-tone-menu');toneMenu.setAttribute('role','group');toneMenu.setAttribute('aria-label',t('horoscope_mood','Tone'));
  for(const key of ['serious','humor']){
    const button=element('button','',t('mood_'+key,key));button.type='button';button.dataset.mood=key;button.prepend(icon('tone_'+key));
    button.addEventListener('click',()=>{mood=key;try{localStorage.setItem('horoscope-mood',mood);}catch{}tone.open=false;show();toneToggle.focus();});toneMenu.append(button);
  }
  // Safari does not focus buttons on pointer activation. A null relatedTarget
  // must not hide the menu before its click can select a mood.
  tone.addEventListener('focusout',event=>{if(event.relatedTarget && !tone.contains(event.relatedTarget))tone.open=false;});
  tone.addEventListener('keydown',event=>{if(event.key==='Escape'){tone.open=false;toneToggle.focus();}});
  tone.append(toneToggle,toneMenu);top.append(dates,tone);
  const text=element('div','horoscope-advice');text.id='horoscope-reading';text.tabIndex=0;text.setAttribute('role','region');text.setAttribute('aria-label',t('horoscope','Horoscope'));
  text.classList.add('is-expanded');
  function show(){
    const sign=data.signs[selected];signValue.textContent=sign.name;dates.textContent=sign.dates;
    [...choices.children].forEach((choice,i)=>choice.setAttribute('aria-pressed',String(i===selected)));
    const reading=sign.advice?.[day]?.[mood]?.[variant];text.replaceChildren();
    if(reading){
      for(const [field,label] of [['do',t('horoscope_do','Do')],['dont',t('horoscope_dont','Avoid')]]){
        const section=element('section','horoscope-advice-section '+field),heading=element('h4','',label),mark=element('span','advice-mark',field==='do'?'✓':'×');mark.setAttribute('aria-hidden','true');heading.prepend(mark);const list=element('ul');
        reading[field].forEach(item=>list.append(element('li','',item)));section.append(heading,list);text.append(section);
      }
    }else{text.append(element('p','horoscope-text',sign.readings?.[day]?.[mood]?.[variant]||sign[day]));}
    toneToggle.replaceChildren(icon('tone_'+mood));toneToggle.title=t('horoscope_mood','Tone')+': '+t('mood_'+mood,mood);toneToggle.setAttribute('aria-label',toneToggle.title);
    toneMenu.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mood===mood)));
    tabs.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.day===day)));
  }
  const header=container.closest('.widget').querySelector('.widget-header');header.querySelector('h3').replaceChildren(select);header.querySelector('.horoscope-days')?.remove();header.append(tabs);
  container.dataset.horoscopeDate=data.date;
  container.append(top,text);show();
}

let marketCurrency;
try{marketCurrency=selectedCurrency(window.localStorage);}catch{marketCurrency='SEK';}
function exchange(container, data) {
  if (!['eur_usd','gold_eur_oz','btc_eur'].every(key => Number.isFinite(data[key]?.price) && data[key].price > 0)) throw new Error('Invalid rates');
  const changeCurrency=()=>chooseCurrency(marketCurrency,code=>{
    marketCurrency=code;
    try{saveCurrency(window.localStorage,code);}catch{}
    exchange(container,data);
  });
  const quotes = [
    {name:'EUR / '+marketCurrency, symbol:'€',sub:t('euro','1 eiro'),quote:data['eur_'+marketCurrency.toLowerCase()],digits:4,currency:marketCurrency,editable:true},
    {name:'EUR / USD', symbol:'€', sub:t('euro','1 eiro'), quote:data.eur_usd, digits:4, currency:'USD'},
    {name:'Euribor', symbol:'%', sub:t('six_months','6 months'), quote:data.euribor_6m, digits:3, rate:true},
    {name:t('gold','Zelts'), symbol:'gold', sub:'EUR / oz', quote:data.gold_eur_oz, digits:2},
    {name:'Bitcoin', symbol:'bitcoin', sub:'EUR / BTC', quote:data.btc_eur, digits:2}
  ];
  const list = element('div', 'market-list');
  quotes.forEach(item => {
    const available=Number.isFinite(item.quote?.price);
    const options={label:item.rate?'Euribor 6M':item.name,unit:item.rate?'%':item.currency||item.sub,digits:item.digits,lowerIsBetter:!!item.rate,percentagePoints:!!item.rate};
    const row=element('div','market-row');
    let label;
    if(item.editable){
      label=element('button','price-trigger currency-choice-trigger');
      label.type='button';
      label.title=t('choose_currency','Choose currency');
      label.setAttribute('aria-label',t('edit_currency','Change currency: {currency}',{currency:item.currency}));
      label.setAttribute('aria-haspopup','dialog');
      const name=element('span','market-name-text',item.name);
      const pencil=icon('pencil');
      pencil.classList.add('currency-edit-icon');
      name.append(pencil);
      label.append(name);
      label.addEventListener('click',changeCurrency);
    }else if(available){
      label=priceButton(item.quote,{...options,text:item.name,className:'market-name-text'});
    }else{
      label=element('span');
      label.append(element('span','market-name-text',item.name));
    }
    label.classList.add('market-label','market-label-trigger');
    const symbol = element('span', 'market-symbol'); symbol.setAttribute('aria-hidden','true');
    if (item.symbol === 'gold' || item.symbol === 'bitcoin') symbol.append(icon(item.symbol)); else symbol.textContent = item.symbol;
    label.prepend(symbol);label.append(element('small','market-unit',item.sub));
    row.append(label);
    list.append(row);
    if(!available){
      const value=element('span','market-unavailable','—');
      value.title=t('rate_unavailable','Rate not available yet');
      row.append(value);
      return;
    }
    const trigger=priceButton(item.quote,{...options,className:'market-price'});trigger.classList.add('market-value-trigger');
    trigger.title=[item.quote.history_source,item.quote.observed_at?.slice(0,10),t('previous_published','Compared with previous published value')].filter(Boolean).join(' · ');
    applyPriceTrend(trigger,item.quote.price,item.quote.previous);
    if(item.rate){
      trigger.querySelector('.market-price').append(' %');
      const known=Number.isFinite(item.quote.previous),delta=known?item.quote.price-item.quote.previous:0;
      const change=element('span','trend '+(known?colorTrend(delta,true):'unknown'),known?(delta>0?'↑ ':delta<0?'↓ ':'')+number(Math.abs(delta),3)+' '+t('percentage_points','pp'):'—');
      change.title=known?t('previous_value','Previous: {value}',{value:number(item.quote.previous,3)+' %'})+' · '+t('change_points','Change: {value} pp',{value:number(delta,3)}):t('no_comparison','No comparison available');change.setAttribute('aria-label',change.title);trigger.append(change);
      trigger.title+=' · '+t('delayed_24h','Published with a 24-hour delay');
    }else trigger.append(trend(item.quote.price,item.quote.previous,true));
    row.append(trigger);
  });
  const stale=container.querySelector('.stale');
  container.replaceChildren(list);
  if(stale)container.append(stale);
}

const requestedMarket = new URLSearchParams(location.search).get('market');
if (['LV','LT','EE'].includes(requestedMarket)) document.documentElement.dataset.market = requestedMarket;
const marketSelect = element('select', 'fuel-market'); marketSelect.setAttribute('aria-label',t('fuel','Energy')+' — '+t('country','Country'));
for (const [value, label] of [['LV','Latvia'],['LT','Lithuania'],['EE','Estonia']]) { const option = element('option','',uiLabels.countries?.[value]||label); option.value=value; marketSelect.append(option); }
marketSelect.value = document.documentElement.dataset.market || 'LV';
marketSelect.addEventListener('change',()=>{
  document.documentElement.dataset.market = marketSelect.value;
  const url = new URL(location.href); url.searchParams.set('market',marketSelect.value); history.replaceState(null,'',url);
  loadWidget('fuel',fuel);
});
document.querySelector('#fuel-widget h3').replaceChildren(widgetCountry(t('fuel','Energy'),'bolt',marketSelect).control);
document.querySelector('#horoscope-widget h3').textContent=t('horoscope','Horoscope');
document.querySelector('#exchange-widget h3').replaceChildren(widgetIcon('market'),t('exchange','Currencies and markets'));

async function news() {
  try {
    const items = await readJSON('assets/news.json');
    const row = (item) => {
      const link = element('a', 'news-item');
      link.href = item.url;
      const image = element('img'); image.src = item.image; image.alt = ''; image.width = 77; image.height = 48;
      const title = element('h3', '', item.title + '. ');
      title.append(element('span', '', item.description));
      const picture = element('picture');
      const source = element('source'); source.media='(min-width:1900px)'; source.srcset=item.largeImage;
      picture.append(source,image);
      const content = element('div','news-item-copy'); content.append(title,element('p','news-description',item.description));
      link.append(picture, content);
      return link;
    };
    $('#top-news-list').replaceChildren(...items.slice(0, 7).map(row));
    $('#news-cards').replaceChildren(...items.slice(0, 4).map(item => {
      const link = element('a', 'news-card'); link.href = item.url;
      const image = element('img'); image.src = item.largeImage; image.alt = ''; image.loading = 'lazy';
      link.append(image, element('h3', '', item.title), element('small', '', t('news_preview','News preview')+' · inbox.lv'));
      return link;
    }));
  } catch { $('#top-news-list').textContent = t('news_preview_unavailable','News preview is unavailable.'); }
}

if ($('#top-news-list')) news();
loadWidget('fuel', fuel);
loadWidget('horoscope', horoscope);
loadWidget('exchange', exchange);

// Catch up an open page when the Riga calendar day changes, including after sleep.
setInterval(()=>{const el=document.querySelector('#horoscope-content');if(!el?.dataset.horoscopeDate)return;const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Riga',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const today=['year','month','day'].map(k=>parts.find(p=>p.type===k).value).join('-');if(today!==el.dataset.horoscopeDate)loadWidget('horoscope',horoscope);},60000);
