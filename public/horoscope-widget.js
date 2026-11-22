import {openModal} from './modal.js';
import {t,lang} from './i18n.js';
import {icon} from './icons.js';
import {widgetPicker} from './widget-heading.js';
import {currentZodiac} from './zodiac.js';

// Three presentations of the same daily reading, compared side by side in the prototype.
export const horoscopeViews=['do_dont','areas','combined'];
const areas=['love','work','energy'];
const signKey='horoscope-sign',moodKey='horoscope-mood',viewKey='horoscope-view';

function element(tag,className,text){
  const node=document.createElement(tag);
  if(className)node.className=className;
  if(text!==undefined)node.textContent=text;
  return node;
}
// Storage can be unavailable (private mode, blocked site data); the widget must still work.
function load(key){try{return localStorage.getItem(key);}catch{return null;}}
function store(key,value){try{localStorage.setItem(key,value);}catch{}}

export function selectedView(){
  const requested=new URLSearchParams(location.search).get('horoscopeView');
  const fromUrl=horoscopeViews[Number(requested)-1]||(horoscopeViews.includes(requested)?requested:null);
  const saved=load(viewKey);
  return fromUrl||(horoscopeViews.includes(saved)?saved:'do_dont');
}

// Moon phase drawn from the computed phase angle: 0 new, 180 full; lit limb on the right while waxing.
export function moonIcon(degrees){
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.classList.add('moon-phase-icon');
  const r=8,phase=((degrees%360)+360)%360,waxing=phase<180,k=Math.cos(phase*Math.PI/180),rx=Math.abs(k)*r;
  const disc=document.createElementNS(ns,'circle');disc.setAttribute('cx','12');disc.setAttribute('cy','12');disc.setAttribute('r',String(r));disc.setAttribute('class','moon-phase-disc');
  const lit=document.createElementNS(ns,'path');lit.setAttribute('class','moon-phase-lit');
  lit.setAttribute('d',`M12 ${12-r}A${r} ${r} 0 0 ${waxing?1:0} 12 ${12+r}A${rx.toFixed(2)} ${r} 0 0 ${(k>0)===waxing?0:1} 12 ${12-r}Z`);
  svg.append(disc,lit);
  return svg;
}
function stars(rating){
  const node=element('span','horoscope-stars');
  node.setAttribute('role','img');node.setAttribute('aria-label',t('horoscope_rating','{n} of 5',{n:rating}));
  node.append(element('span','on','★'.repeat(rating)),element('span','off','★'.repeat(5-rating)));
  return node;
}
// „Avoid …” inline: the heading verb is followed by the item with a lowercase first letter.
const inline=text=>/^\p{Lu}\p{Ll}/u.test(text)?text[0].toLocaleLowerCase(lang)+text.slice(1):text;

function doDont(reading){
  const box=element('div','horoscope-view-do-dont');
  for(const [field,label] of [['do',t('horoscope_do','Do')],['dont',t('horoscope_dont','Avoid')]]){
    const section=element('section','horoscope-advice-section '+field),heading=element('h4','',label),mark=element('span','advice-mark',field==='do'?'✓':'×'),list=element('ul');
    mark.setAttribute('aria-hidden','true');heading.prepend(mark);
    reading[field].forEach(item=>list.append(element('li','',item)));
    section.append(heading,list);box.append(section);
  }
  return box;
}
function byArea(reading){
  const box=element('div','horoscope-view-areas');
  for(const area of areas){
    const section=element('section','horoscope-area '+area),heading=element('h4');
    heading.append(element('span','horoscope-area-name',t('horoscope_'+area,area)),stars(reading.areas[area].rating));
    section.append(heading,element('p','',reading.areas[area].text));box.append(section);
  }
  return box;
}
function combined(reading){
  const box=element('div','horoscope-view-combined');
  const ratings=element('div','horoscope-ratings');
  for(const area of areas){const item=element('span','horoscope-rating');item.append(element('span','horoscope-area-name',t('horoscope_'+area,area)),stars(reading.areas[area].rating));ratings.append(item);}
  const tips=element('ul','horoscope-tips');
  const doItem=element('li','do'),dontItem=element('li','dont');
  const doMark=element('span','advice-mark','✓'),dontMark=element('span','advice-mark','×');doMark.setAttribute('aria-hidden','true');dontMark.setAttribute('aria-hidden','true');
  doItem.append(doMark,element('span','',reading.do[0]));
  dontItem.append(dontMark,element('span','',`${t('horoscope_dont','Avoid')} ${inline(reading.dont[0])}`));
  tips.append(doItem,dontItem);
  box.append(element('h4','horoscope-headline',reading.headline),element('p','horoscope-lead',reading.text),ratings,tips);
  return box;
}

function skyDialog(){
  document.querySelector('#horoscope-sky-dialog')?.remove();
  const dialog=element('dialog','zodiac-dialog horoscope-sky-dialog');dialog.id='horoscope-sky-dialog';dialog.setAttribute('aria-labelledby','horoscope-sky-title');
  const header=element('header','zodiac-dialog-header'),title=element('h2');title.id='horoscope-sky-title';
  const close=element('button','zodiac-dialog-close','×');close.type='button';close.setAttribute('aria-label',t('close','Close'));close.addEventListener('click',()=>dialog.close());
  header.append(title,close);
  const body=element('div','horoscope-sky-body');
  dialog.append(header,body);
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  document.body.append(dialog);
  return {dialog,title,body};
}
function rows(list,className){
  const dl=element('dl',className);
  for(const row of list){const group=element('div','horoscope-sky-row '+row.id);group.append(element('dt','',row.label),element('dd','',row.value));dl.append(group);}
  return dl;
}

export function horoscope(container,data){
  if(!Array.isArray(data.signs)||!data.signs.length||data.signs.some(s=>['name','id','dates','today','tomorrow'].some(k=>typeof s[k]!=='string')))throw new Error('Invalid horoscope data');
  const timeZone=data.timezone||'Europe/Riga',savedSign=load(signKey);
  let selected=data.signs.findIndex(sign=>sign.id===savedSign);
  if(selected<0)selected=Math.max(0,data.signs.findIndex(sign=>sign.id===currentZodiac(new Date(),timeZone)));
  let day='today',view=selectedView(),mood=data.selected_mood||'serious';
  const saved=load(moodKey);if(saved==='playful')mood='humor';else if(data.moods?.includes(saved))mood=saved;
  // Older published files carry Do/Avoid variants only; show them until the data is regenerated.
  const structured=data.signs.every(sign=>sign.reading?.today?.[mood]);
  // A published file can be a day old (no rebuild yet after midnight): its "tomorrow" is today,
  // so show that and hide the Tomorrow tab instead of presenting yesterday's reading as today's.
  const localToday=new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const shifted=Boolean(data.tomorrow_date)&&localToday>=data.tomorrow_date;
  const key=d=>shifted&&d==='today'?'tomorrow':d;

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
  data.signs.forEach((sign,i)=>{
    const choice=element('button','zodiac-choice');choice.type='button';choice.dataset.sign=String(i);
    choice.append(icon(sign.id),element('span','zodiac-choice-name',sign.name),element('small','',ranges[i]));
    // Remember the reader's own sign; a visitor should not land on someone else's sign each time.
    choice.addEventListener('click',()=>{selected=i;store(signKey,sign.id);show();picker.close();});
    choices.append(choice);
  });
  choices.addEventListener('keydown',event=>{const offsets={ArrowRight:1,ArrowLeft:-1,ArrowDown:2,ArrowUp:-2};if(!(event.key in offsets)&&!['Home','End'].includes(event.key))return;event.preventDefault();const buttons=[...choices.children],i=buttons.indexOf(document.activeElement),next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(i+offsets[event.key]+buttons.length)%buttons.length;buttons[next].focus();});
  picker.append(pickerHeader,choices);document.body.append(picker);
  select.addEventListener('click',()=>{openModal(picker,choices.children[selected]);select.setAttribute('aria-expanded','true');});
  picker.addEventListener('close',()=>{select.setAttribute('aria-expanded','false');select.focus({preventScroll:true});});
  picker.addEventListener('click',event=>{if(event.target!==picker)return;const r=picker.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)picker.close();});

  const dates=element('p','zodiac-date');
  // The sky chip opens a panel with the Moon's phase and sign, the Sun and the planets.
  const skyButton=element('button','horoscope-sky');skyButton.type='button';skyButton.setAttribute('aria-haspopup','dialog');
  const sky=skyDialog();
  skyButton.addEventListener('click',()=>{fillSky();openModal(sky.dialog,sky.dialog.querySelector('.zodiac-dialog-close'));});
  sky.dialog.addEventListener('close',()=>skyButton.focus({preventScroll:true}));
  const tone=element('details','horoscope-tone'),toneToggle=element('summary');
  const toneMenu=element('div','horoscope-tone-menu');toneMenu.setAttribute('role','group');toneMenu.setAttribute('aria-label',t('horoscope_mood','Tone'));
  for(const key of ['serious','humor']){
    const button=element('button','',t('mood_'+key,key));button.type='button';button.dataset.mood=key;button.prepend(icon('tone_'+key));
    button.addEventListener('click',()=>{mood=key;store(moodKey,mood);tone.open=false;show();toneToggle.focus();});toneMenu.append(button);
  }
  // Safari does not focus buttons on pointer activation. A null relatedTarget
  // must not hide the menu before its click can select a mood.
  tone.addEventListener('focusout',event=>{if(event.relatedTarget&&!tone.contains(event.relatedTarget))tone.open=false;});
  tone.addEventListener('keydown',event=>{if(event.key==='Escape'){tone.open=false;toneToggle.focus();}});
  tone.append(toneToggle,toneMenu);
  top.append(dates);if(structured&&data.sky)top.append(skyButton);top.append(tone);
  const text=element('div','horoscope-advice');text.id='horoscope-reading';text.tabIndex=0;text.setAttribute('role','region');text.setAttribute('aria-label',t('horoscope','Horoscope'));
  text.classList.add('is-expanded');

  function fillSky(){
    const panel=data.sky[key(day)],sign=data.signs[selected];
    sky.title.textContent=t(day==='today'?'horoscope_sky_today':'horoscope_sky_tomorrow',day==='today'?"Today's sky":"Tomorrow's sky");
    const phase=element('div','horoscope-sky-phase');
    phase.append(moonIcon(panel.moon_phase.degrees),element('p','',panel.rows.find(r=>r.id==='phase')?.value||''));
    const signTitle=element('h3','horoscope-sky-heading',sign.name);
    const planetTitle=element('h3','horoscope-sky-heading',t('horoscope_planets','Planets'));
    sky.body.replaceChildren(phase,rows(panel.rows.filter(r=>r.id!=='phase'),'horoscope-sky-rows'),signTitle,rows(sign.panel?.[key(day)]?.rows||[],'horoscope-sky-rows'),planetTitle,rows(panel.planets,'horoscope-sky-rows planets'),element('p','horoscope-sky-note',t('horoscope_sky_note','Times are shown in Baltic time.')));
  }
  function show(){
    const sign=data.signs[selected];signValue.textContent=sign.name;dates.textContent=sign.dates;
    [...choices.children].forEach((choice,i)=>choice.setAttribute('aria-pressed',String(i===selected)));
    text.replaceChildren();text.dataset.view=structured?view:'do_dont';
    if(structured){
      const reading=sign.reading[key(day)][mood];
      text.append(view==='areas'?byArea(reading):view==='combined'?combined(reading):doDont(reading));
      const panel=data.sky?.[key(day)];
      if(panel){skyButton.replaceChildren(moonIcon(panel.moon_phase.degrees),element('span','',panel.chip));skyButton.setAttribute('aria-label',`${t('horoscope_sky','Sky')}: ${panel.chip}`);}
      if(sky.dialog.open)fillSky();
    }else{
      // A stable variant per date, never a random one per page load.
      const variants=data.variants_per_mood||3,variant=Math.floor(Date.parse(data.date+'T12:00:00Z')/86400000)%variants;
      const reading=sign.advice?.[key(day)]?.[mood]?.[variant];
      if(reading)text.append(doDont(reading));else text.append(element('p','horoscope-text',sign.readings?.[key(day)]?.[mood]?.[variant]||sign[key(day)]));
    }
    toneToggle.replaceChildren(icon('tone_'+mood));toneToggle.title=t('horoscope_mood','Tone')+': '+t('mood_'+mood,mood);toneToggle.setAttribute('aria-label',toneToggle.title);
    toneMenu.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mood===mood)));
    tabs.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.day===day)));
  }
  const header=container.closest('.widget').querySelector('.widget-header');header.querySelector('h3').replaceChildren(select);header.querySelector('.horoscope-days')?.remove();if(!shifted)header.append(tabs);
  // The page reloads the widget when this date stops matching the local calendar day.
  container.dataset.horoscopeDate=shifted?data.tomorrow_date:data.date;
  container.append(top,text);show();
  if(structured)viewPicker(next=>{view=next;show();});
}

// Prototype control, styled like the appearance picker, to compare the three presentations.
function viewPicker(onChange){
  document.querySelector('.horoscope-view-picker')?.remove();
  const toolbar=element('aside','widget-style-picker horoscope-view-picker');toolbar.setAttribute('aria-label',t('horoscope_view','Horoscope version'));
  const choices=element('div','widget-style-choices');choices.setAttribute('role','group');choices.setAttribute('aria-label',t('horoscope_view','Horoscope version'));
  const update=current=>{for(const button of choices.children)button.setAttribute('aria-pressed',String(button.dataset.view===current));};
  horoscopeViews.forEach((view,index)=>{
    const button=element('button');button.type='button';button.dataset.view=view;
    button.append(element('span','widget-style-number',String(index+1)),document.createTextNode(t('horoscope_view_'+view,view)));
    button.addEventListener('click',()=>{
      store(viewKey,view);const url=new URL(location.href);url.searchParams.set('horoscopeView',String(index+1));history.replaceState(history.state,'',url);
      update(view);onChange(view);
    });
    choices.append(button);
  });
  toolbar.append(element('span','widget-style-picker-title',t('horoscope_view','Horoscope version')),choices);
  document.body.append(toolbar);update(selectedView());
}
