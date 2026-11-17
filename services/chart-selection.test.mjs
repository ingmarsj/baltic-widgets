import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as math from '../public/chart-math.js';

class Element {
  attrs={};dataset={};style={};children=[];listeners={};hidden=true;
  setAttribute(k,v){this.attrs[k]=String(v);}
  addEventListener(k,fn){this.listeners[k]=fn;}
  replaceChildren(...nodes){this.children=nodes;}
  getBoundingClientRect(){return {left:0,top:0,width:100};}
  setPointerCapture(){} hasPointerCapture(){return false;}
}
function chart(lowerIsBetter){
  const elements=new Map();
  const get=key=>{if(!elements.has(key))elements.set(key,new Element());return elements.get(key);};
  const context=vm.createContext({...math,Intl,Date,locale:'en',t:(key,fallback)=>fallback,
    document:{querySelector:get,createElement:()=>new Element()},window:{addEventListener(){}}});
  let source=readFileSync(new URL('../public/charts.js',import.meta.url),'utf8').replace(/^import .*;\r?\n/gm,'').replace('export function priceButton','function priceButton');
  source+=`\nactive={unit:'EUR/kWh',digits:4,lowerIsBetter:${lowerIsBetter}};
    selectedPoints=[100,80,120,90].map((value,i)=>({at:Date.UTC(2026,10,17,i),value}));
    plot={svg:document.createElement(),tooltip:document.createElement(),x:p=>p.at,y:p=>p.value,left:0,right:100,svgWidth:100};
    for(const key of ['focusLine','dot','selection','selectionClip','selectedLine','anchorLine','anchorDot'])plot[key]=document.createElement();
    highlight(3);
    globalThis.plotForTest=plot;`;
  vm.runInContext(source,context);
  const fire=(type,x)=>get('#chart-canvas').listeners[type]({isPrimary:true,button:0,pointerId:1,clientX:x,clientY:0,pointerType:'mouse',preventDefault(){}});
  const snapshot=()=>({summary:get('#chart-change').textContent,summaryClass:get('#chart-change').className,
    readout:get('.chart-readout').children.map(n=>[n.className,n.textContent]),
    trend:context.plotForTest.svg.dataset.rangeTrend,
    start:{...context.plotForTest.anchorDot.attrs},end:{...context.plotForTest.dot.attrs},selection:{...context.plotForTest.selection.attrs}});
  return {fire,snapshot,clear:()=>get('.price-dialog').listeners.keydown({key:'Escape',preventDefault(){}})};
}

test('reverse dragging gives identical dates, prices, percentages, colours and markers',()=>{
  for(const lowerIsBetter of [false,true])for(const [left,right] of [[0,66.7],[33.3,66.7],[33.3,100],[66.7,66.7]]){
    const forward=chart(lowerIsBetter),reverse=chart(lowerIsBetter);
    forward.fire('pointerdown',left);forward.fire('pointermove',right);forward.fire('pointerup',right);
    reverse.fire('pointerdown',right);reverse.fire('pointermove',left);reverse.fire('pointerup',left);
    assert.deepEqual(reverse.snapshot(),forward.snapshot());
    assert.equal(forward.snapshot().summaryClass,'trend '+forward.snapshot().trend);
  }
});

test('selection updates the top percentage and Escape restores the full-period change',()=>{
  const c=chart(true),initial=c.snapshot();
  assert.match(initial.summary,/10.00%/);
  c.fire('pointerdown',33.3);c.fire('pointermove',66.7);c.fire('pointerup',66.7);
  const selected=c.snapshot();assert.match(selected.summary,/50.00%/);
  assert.equal(selected.trend,'down');
  assert.match(selected.readout[1][1],/50.00%/);
  c.clear();assert.equal(c.snapshot().summary,initial.summary);assert.equal(c.snapshot().trend,undefined);
});
