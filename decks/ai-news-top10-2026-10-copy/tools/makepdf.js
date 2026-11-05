const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const [proj,out]=process.argv.slice(2);
const SP='/tmp/claude-0/-home-user-Aina-News/480fbfc0-3d74-5410-a1ae-a6c106fdea04';
const blobs={'01c4bb531de5c55e6b8a295149943332':SP+'/scratchpad/motion/cover-still.jpg','dd16010e7dde0af1fbc3eef81de94e6d':SP+'/images/2.png','fbe8bf35a5291f9b35b488d9fd6aba45':SP+'/images/3.png','960282518f519305a765ab37f3e9dbee':SP+'/images/4.webp'};
const I={Lightbulb:'<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/>',
Users:'<circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85"/>',
Lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
Chat:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
Clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
Globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>',
Home:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
Warning:'<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>'};
const esc=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
const order=JSON.parse(fs.readFileSync(proj+'/deck.json','utf8')).order;
let body='';
for(const id of order){let h=fs.readFileSync(`${proj}/slides/${id}.html`,'utf8');
 h=h.replace(/<aside>[\s\S]*?<\/aside>/,'')
  .replace(/<x-embed style="([^"]*)">([\s\S]*?)<\/x-embed>/g,(m,s,c)=>`<iframe style="${s};border:0" srcdoc="${esc(c)}"></iframe>`)
  .replace(/<x-icon name="(\w+)" style="([^"]*)"><\/x-icon>/g,(m,n,s)=>`<svg viewBox="0 0 24 24" style="${s};flex:none" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${I[n]||'<circle cx="12" cy="12" r="9"/>'}</svg>`)
  .replace(/<x-shape kind="arrow-right"([^>]*) style="([^"]*)background:([^;"]*)"><\/x-shape>/g,(m,a,s,c)=>`<svg viewBox="0 0 72 40" style="${s}" preserveAspectRatio="none"><polygon points="0,10 43,10 43,0 72,20 43,40 43,30 0,30" fill="${c}"/></svg>`)
  .replace(/\/_blob\/([0-9a-f]{32})/g,(m,b)=>blobs[b]?'file://'+blobs[b]:m)
  .replace(/ data-video="[^"]*"/g,'');
 body+=h+'\n';}
const html=`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Noto+Sans+JP:wght@400;500;700&family=Oswald:wght@500;700&family=Noto+Serif+JP:wght@500;600&display=swap"><style>
@page{size:1920px 1080px;margin:0}*{margin:0;padding:0;box-sizing:border-box}html,body{background:#000}
section{position:relative;width:1920px;height:1080px;overflow:hidden;break-after:page}
h1{font-weight:600}h2{font-weight:600}h3{font-weight:600}
table{border-collapse:collapse}td,th{padding:.35em .6em;text-align:left;border-bottom:1px solid #24345C;font-weight:inherit}th{font-weight:700}
img{display:block}</style></head><body>${body}</body></html>`;
const tmp=path.join(path.dirname(out),'deck-print.html');fs.writeFileSync(tmp,html);
(async()=>{const b=await chromium.launch({args:['--allow-file-access-from-files']});const p=await b.newPage({viewport:{width:1920,height:1080}});
 await p.goto('file://'+tmp,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);
 for(const f of p.frames()){if(f===p.mainFrame())continue;try{await f.evaluate(()=>document.getAnimations().forEach(a=>{const d=a.effect.getTiming().duration;a.pause();a.currentTime=(typeof d==='number'?d:1000)*0.86;}));}catch(e){}}
 await p.waitForTimeout(500);
 await p.pdf({path:out,width:'1920px',height:'1080px',printBackground:true,preferCSSPageSize:true});await b.close();})();
