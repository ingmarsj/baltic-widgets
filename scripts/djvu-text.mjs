#!/usr/bin/env node
// Extract the hidden text layer (TXTz/TXTa) of a bundled or single-page DjVu file, page by page.
// Pure JavaScript port of the DjVuLibre ZP-coder and BZZ decoder (GPL-2 reference: ZPCodec.cpp, BSByteStream.cpp).
// Usage: node scripts/djvu-text.mjs FILE.djvu OUT.json   -> {sha256, extraction, pages:[{pdf_page, text}]}
// The output is accepted by `nameday-source-cache.mjs index --ocr-json` for registering the DjVu file privately.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const ZP_P=[0x8000,0x8000,0x8000,0x6bbd,0x6bbd,0x5d45,0x5d45,0x51b9,0x51b9,0x4813,0x4813,0x3fd5,0x3fd5,0x38b1,0x38b1,0x3275,0x3275,0x2cfd,0x2cfd,0x2825,0x2825,0x23ab,0x23ab,0x1f87,0x1f87,0x1bbb,0x1bbb,0x1845,0x1845,0x1523,0x1523,0x1253,0x1253,0x0fcf,0x0fcf,0x0d95,0x0d95,0x0b9d,0x0b9d,0x09e3,0x09e3,0x0861,0x0861,0x0711,0x0711,0x05f1,0x05f1,0x04f9,0x04f9,0x0425,0x0425,0x0371,0x0371,0x02d9,0x02d9,0x0259,0x0259,0x01ed,0x01ed,0x0193,0x0193,0x0149,0x0149,0x010b,0x010b,0x00d5,0x00d5,0x00a5,0x00a5,0x007b,0x007b,0x0057,0x0057,0x003b,0x003b,0x0023,0x0023,0x0013,0x0013,0x0007,0x0007,0x0001,0x0001,0x5695,0x24ee,0x8000,0x0d30,0x481a,0x0481,0x3579,0x017a,0x24ef,0x007b,0x1978,0x0028,0x10ca,0x000d,0x0b5d,0x0034,0x078a,0x00a0,0x050f,0x0117,0x0358,0x01ea,0x0234,0x0144,0x0173,0x0234,0x00f5,0x0353,0x00a1,0x05c5,0x011a,0x03cf,0x01aa,0x0285,0x0286,0x01ab,0x03d3,0x011a,0x05c5,0x00ba,0x08ad,0x007a,0x0ccc,0x01eb,0x1302,0x02e6,0x1b81,0x045e,0x24ef,0x0690,0x2865,0x09de,0x3987,0x0dc8,0x2c99,0x10ca,0x3b5f,0x0b5d,0x5695,0x078a,0x8000,0x050f,0x24ee,0x0358,0x0d30,0x0234,0x0481,0x0173,0x017a,0x00f5,0x007b,0x00a1,0x0028,0x011a,0x000d,0x01aa,0x0034,0x0286,0x00a0,0x03d3,0x0117,0x05c5,0x01ea,0x08ad,0x0144,0x0ccc,0x0234,0x1302,0x0353,0x1b81,0x05c5,0x24ef,0x03cf,0x2b74,0x0285,0x201d,0x01ab,0x1715,0x011a,0x0fb7,0x00ba,0x0a67,0x01eb,0x06e7,0x02e6,0x0496,0x045e,0x030d,0x0690,0x0206,0x09de,0x0155,0x0dc8,0x00e1,0x2b74,0x0094,0x201d,0x0188,0x1715,0x0252,0x0fb7,0x0383,0x0a67,0x0547,0x06e7,0x07e2,0x0496,0x0bc0,0x030d,0x1178,0x0206,0x19da,0x0155,0x24ef,0x00e1,0x320e,0x0094,0x432a,0x0188,0x447d,0x0252,0x5ece,0x0383,0x8000,0x0547,0x481a,0x07e2,0x3579,0x0bc0,0x24ef,0x1178,0x1978,0x19da,0x2865,0x24ef,0x3987,0x320e,0x2c99,0x432a,0x3b5f,0x447d,0x5695,0x5ece,0x8000,0x8000,0x5695,0x481a,0x481a,0,0,0,0,0];
const ZP_M=[0x0000,0x0000,0x0000,0x10a5,0x10a5,0x1f28,0x1f28,0x2bd3,0x2bd3,0x36e3,0x36e3,0x408c,0x408c,0x48fd,0x48fd,0x505d,0x505d,0x56d0,0x56d0,0x5c71,0x5c71,0x615b,0x615b,0x65a5,0x65a5,0x6962,0x6962,0x6ca2,0x6ca2,0x6f74,0x6f74,0x71e6,0x71e6,0x7404,0x7404,0x75d6,0x75d6,0x7768,0x7768,0x78c2,0x78c2,0x79ea,0x79ea,0x7ae7,0x7ae7,0x7bbe,0x7bbe,0x7c75,0x7c75,0x7d0f,0x7d0f,0x7d91,0x7d91,0x7dfe,0x7dfe,0x7e5a,0x7e5a,0x7ea6,0x7ea6,0x7ee6,0x7ee6,0x7f1a,0x7f1a,0x7f45,0x7f45,0x7f6b,0x7f6b,0x7f8d,0x7f8d,0x7faa,0x7faa,0x7fc3,0x7fc3,0x7fd7,0x7fd7,0x7fe7,0x7fe7,0x7ff2,0x7ff2,0x7ffa,0x7ffa,0x7fff,0x7fff,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0x0000,0,0,0,0,0];
const ZP_UP=[84,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,81,82,9,86,5,88,89,90,91,92,93,94,95,96,97,82,99,76,101,70,103,66,105,106,107,66,109,60,111,56,69,114,65,116,61,118,57,120,53,122,49,124,43,72,39,60,33,56,29,52,23,48,23,42,137,38,21,140,15,142,9,144,141,146,147,148,149,150,151,152,153,154,155,70,157,66,81,62,75,58,69,54,65,50,167,44,65,40,59,34,55,30,175,24,177,178,179,180,181,182,183,184,69,186,59,188,55,190,51,192,47,194,41,196,37,198,199,72,201,62,203,58,205,54,207,50,209,46,211,40,213,36,215,30,217,26,219,20,71,14,61,14,57,8,53,228,49,230,45,232,39,234,35,138,29,24,25,240,19,22,13,16,13,10,7,244,249,10,89,230,0,0,0,0,0];
const ZP_DN=[145,4,3,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,85,226,6,176,143,138,141,112,135,104,133,100,129,98,127,72,125,102,123,60,121,110,119,108,117,54,115,48,113,134,59,132,55,130,51,128,47,126,41,62,37,66,31,54,25,50,131,46,17,40,15,136,7,32,139,172,9,170,85,168,248,166,247,164,197,162,95,160,173,158,165,156,161,60,159,56,71,52,163,48,59,42,171,38,169,32,53,26,47,174,193,18,191,222,189,218,187,216,185,214,61,212,53,210,49,208,45,206,39,204,195,202,31,200,243,64,239,56,237,52,235,48,233,44,231,38,229,34,227,28,225,22,223,16,221,220,63,8,55,224,51,2,47,87,43,246,37,244,33,238,27,236,21,16,15,8,241,242,7,10,245,2,1,83,250,2,143,246,0,0,0,0,0];
const FFZT=Array.from({length:256},(_,i)=>{let n=0;for(let j=i;j&0x80;j=(j<<1)&0xff)n++;return n;});
const ffz=x=>x>=0xff00?FFZT[x&0xff]+8:FFZT[(x>>8)&0xff];
class ZP{
 constructor(bytes){this.b=bytes;this.i=0;this.a=0;this.code=(this.byte()<<8)|this.byte();this.delay=25;this.scount=0;this.buffer=0;this.preload();this.fence=this.code>=0x8000?0x7fff:this.code;}
 byte(){return this.i<this.b.length?this.b[this.i++]:0xff;}
 preload(){while(this.scount<=24){let v;if(this.i<this.b.length)v=this.b[this.i++];else{v=0xff;if(--this.delay<1)throw Error('ZP: end of stream');}this.buffer=((this.buffer<<8)|v)>>>0;this.scount+=8;}}
 lps(z){z=0x10000-z;this.a+=z;this.code+=z;const s=ffz(this.a);this.scount-=s;this.a=(this.a<<s)&0xffff;this.code=((this.code<<s)&0xffff)|((this.buffer>>>this.scount)&((1<<s)-1));if(this.scount<16)this.preload();this.fence=this.code>=0x8000?0x7fff:this.code;}
 mps(z){this.scount-=1;this.a=(z<<1)&0xffff;this.code=((this.code<<1)&0xffff)|((this.buffer>>>this.scount)&1);if(this.scount<16)this.preload();this.fence=this.code>=0x8000?0x7fff:this.code;}
 decode(ctx,k){// adaptive bit with context array ctx at index k
  let z=this.a+ZP_P[ctx[k]];if(z<=this.fence){this.a=z;return ctx[k]&1;}
  const bit=ctx[k]&1,d=0x6000+((z+this.a)>>2);if(z>d)z=d;
  if(z>this.code){this.lps(z);ctx[k]=ZP_DN[ctx[k]];return bit^1;}
  if(this.a>=ZP_M[ctx[k]])ctx[k]=ZP_UP[ctx[k]];this.mps(z);return bit;}
 simple(){const z=0x8000+(this.a>>1);if(z>this.code){this.lps(z);return 1;}this.mps(z);return 0;}
}
function bzz(bytes){
 const zp=new ZP(bytes),out=[];const ctx=new Uint8Array(300);
 const raw=bits=>{let n=1;const m=1<<bits;while(n<m)n=(n<<1)|zp.simple();return n-m;};
 const bin=(off,bits)=>{let n=1;const m=1<<bits;while(n<m)n=(n<<1)|zp.decode(ctx,off+n-1);return n-m;};
 for(;;){
  const size=raw(24);if(!size)break;if(size>4096*1024)throw Error('BZZ: corrupt block size');
  let fshift=0;if(zp.simple()){fshift++;if(zp.simple())fshift++;}
  const mtf=Array.from({length:256},(_,i)=>i),freq=[0,0,0,0],data=new Uint8Array(size);
  let fadd=4,mtfno=3,markerpos=-1;
  for(let i=0;i<size;i++){
   const ctxid=Math.min(2,mtfno);let c=0;mtfno=-1;
   if(zp.decode(ctx,c+ctxid))mtfno=0;
   else{c+=3;if(zp.decode(ctx,c+ctxid))mtfno=1;
    else{c+=3;let base=2,bits=1;
     for(;bits<=7;bits++){if(zp.decode(ctx,c)){mtfno=base+bin(c+1,bits);break;}c+=1+((1<<bits)-1);base*=2;}}}
   if(mtfno<0){mtfno=256;data[i]=0;markerpos=i;continue;}
   data[i]=mtf[mtfno];
   fadd=fadd+(fadd>>fshift);
   if(fadd>0x10000000){fadd>>=24;for(let k=0;k<4;k++)freq[k]>>=24;}
   let fc=fadd;if(mtfno<4)fc+=freq[mtfno];
   let k=mtfno;for(;k>=4;k--)mtf[k]=mtf[k-1];
   for(;k>0&&fc>=freq[k-1];k--){mtf[k]=mtf[k-1];freq[k]=freq[k-1];}
   mtf[k]=data[i];freq[k]=fc;
  }
  if(markerpos<1||markerpos>=size)throw Error('BZZ: corrupt marker');
  const posn=new Uint32Array(size),count=new Array(256).fill(0);
  for(let i=0;i<size;i++){if(i===markerpos)continue;const ch=data[i];posn[i]=((ch<<24)|(count[ch]&0xffffff))>>>0;count[ch]++;}
  let last=1;for(let i=0;i<256;i++){const t=count[i];count[i]=last;last+=t;}
  const res=new Uint8Array(size);let i=0;last=size-1;
  while(last>0){const n=posn[i],ch=n>>>24;res[--last]=ch;i=count[ch]+(n&0xffffff);}
  if(i!==markerpos)throw Error('BZZ: corrupt transform');
  out.push(res.subarray(0,size-1));
 }
 return Buffer.concat(out.map(x=>Buffer.from(x)));
}
function chunks(buf,start,end){const list=[];let p=start;while(p+8<=end){const id=buf.toString('latin1',p,p+4),len=buf.readUInt32BE(p+4);list.push({id,start:p+8,end:p+8+len,type:id==='FORM'?buf.toString('latin1',p+8,p+12):''});p+=8+len+(len&1);}return list;}
function pageText(buf,form){
 for(const c of chunks(buf,form.start+4,form.end)){
  if(c.id!=='TXTz'&&c.id!=='TXTa')continue;
  const d=c.id==='TXTz'?bzz(buf.subarray(c.start,c.end)):buf.subarray(c.start,c.end);
  const len=(d[0]<<16)|(d[1]<<8)|d[2];return d.subarray(3,3+len).toString('utf8');}
 return '';
}
const [file,outFile]=process.argv.slice(2);
if(!file||!outFile){console.error('Usage: node scripts/djvu-text.mjs FILE.djvu OUT.json');process.exit(2);}
const buf=readFileSync(file);
if(buf.toString('latin1',0,8)!=='AT&TFORM')throw Error('Not a DjVu file');
const top=chunks(buf,4,buf.length)[0];
const forms=top.type==='DJVM'?chunks(buf,top.start+4,top.end).filter(c=>c.id==='FORM'&&c.type==='DJVU'):[top];
const pages=forms.map((f,i)=>({pdf_page:i+1,text:pageText(buf,f).replace(/\r\n?/g,'\n')}));
writeFileSync(outFile,JSON.stringify({sha256:createHash('sha256').update(buf).digest('hex'),extraction:'DjVu hidden text layer (TXTz) via scripts/djvu-text.mjs; OCR by the file producer, spelling requires visual verification',pages},null,1));
console.log(JSON.stringify({pages:pages.length,with_text:pages.filter(p=>p.text.trim()).length,chars:pages.reduce((s,p)=>s+p.text.length,0)}));
