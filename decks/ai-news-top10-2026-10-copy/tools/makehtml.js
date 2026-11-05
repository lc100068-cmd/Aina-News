const fs=require('fs');
const [proj,out]=process.argv.slice(2);
const SP='/tmp/claude-0/-home-user-Aina-News/480fbfc0-3d74-5410-a1ae-a6c106fdea04';
const files={'01c4bb531de5c55e6b8a295149943332':[SP+'/scratchpad/motion/cover-still.jpg','image/jpeg'],'333653ca17dafdc59d2738ea0e5107e0':[SP+'/scratchpad/motion/cover-motion.mp4','video/mp4'],'dd16010e7dde0af1fbc3eef81de94e6d':[SP+'/images/2.png','image/png'],'fbe8bf35a5291f9b35b488d9fd6aba45':[SP+'/images/3.png','image/png'],'960282518f519305a765ab37f3e9dbee':[SP+'/images/4.webp','image/webp']};
const uri=id=>{const [f,t]=files[id];return `data:${t};base64,`+fs.readFileSync(f).toString('base64')};
const I={Lightbulb:'<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/>',
Users:'<circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85"/>',
Lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
Chat:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
Clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
Globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>',
Home:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
Warning:'<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>'};
const esc=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
const deck=JSON.parse(fs.readFileSync(proj+'/deck.json','utf8'));
let body='';
deck.order.forEach((id,i)=>{let h=fs.readFileSync(`${proj}/slides/${id}.html`,'utf8');
 h=h.replace(/<x-embed style="([^"]*)">([\s\S]*?)<\/x-embed>/g,(m,s,c)=>`<iframe class="emb" tabindex="-1" style="${s};border:0" srcdoc="${esc(c)}"></iframe>`)
  .replace(/<x-icon name="(\w+)" style="([^"]*)"><\/x-icon>/g,(m,n,s)=>`<svg viewBox="0 0 24 24" style="${s};flex:none" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]||'<circle cx="12" cy="12" r="9"/>'}</svg>`)
  .replace(/<x-shape kind="arrow-right"([^>]*) style="([^"]*)background:([^;"]*)"><\/x-shape>/g,(m,a,s,c)=>`<svg${a} viewBox="0 0 72 40" style="${s}" preserveAspectRatio="none" aria-hidden="true"><polygon points="0,10 43,10 43,0 72,20 43,40 43,30 0,30" fill="${c}"/></svg>`)
  .replace(/<img src="\/_blob\/(\w+)" alt="([^"]*)" data-video="\/_blob\/(\w+)" style="([^"]*)">/g,(m,still,alt,vid,s)=>`<video autoplay muted loop playsinline poster="${uri(still)}" src="${uri(vid)}" aria-label="${alt}" style="${s};object-fit:cover"></video>`)
  .replace(/\/_blob\/(\w{32})/g,(m,b)=>files[b]?uri(b):m)
  .replace(/^<section /,`<section data-n="${i+1}" `);
 body+=h+'\n';});
const html=`<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${deck.title.replace('（コピー）','')}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Noto+Sans+JP:wght@400;500;700&family=Oswald:wght@500;700&family=Noto+Serif+JP:wght@500;600&display=swap">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;background:#05070d;overflow:hidden;font-family:'Noto Sans JP',sans-serif}
#stage{position:absolute;left:50%;top:50%;width:1920px;height:1080px;transform-origin:0 0}
section{position:absolute;inset:0;width:1920px;height:1080px;overflow:hidden;opacity:0;visibility:hidden;transition:opacity .45s ease,visibility 0s .45s}
section.on{opacity:1;visibility:visible;transition:opacity .45s ease}
section aside{display:none}
h1,h2,h3{font-weight:600}
table{border-collapse:collapse}td,th{padding:.35em .6em;text-align:left;border-bottom:1px solid #24345C;font-weight:inherit}th{font-weight:700}
img,video{display:block}
section.on [data-build-in]{animation:var(--bk) .6s cubic-bezier(.2,.7,.2,1) both;animation-delay:var(--bd)}
@keyframes b-fade{from{opacity:0}}
@keyframes b-rise{from{opacity:0;translate:0 40px}}
@keyframes b-drop{from{opacity:0;translate:0 -40px}}
@keyframes b-left{from{opacity:0;translate:-60px 0}}
@keyframes b-right{from{opacity:0;translate:60px 0}}
@keyframes b-scale{from{opacity:0;scale:.85}}
@keyframes b-pop{0%{opacity:0;scale:.6}70%{opacity:1;scale:1.05}100%{scale:1}}
#hud{position:fixed;right:16px;bottom:12px;display:flex;gap:8px;align-items:center;font:500 14px 'Noto Sans JP',sans-serif;color:#cfd6e4;opacity:0;transition:opacity .3s}
body:hover #hud,#hud:focus-within{opacity:1}
#hud button{background:#1a2238;color:#eef2f7;border:1px solid #33415f;border-radius:8px;padding:6px 12px;font:inherit;cursor:pointer}
#hud button:focus-visible{outline:2px solid #3FD0E0;outline-offset:2px}
#bar{position:fixed;left:0;bottom:0;height:3px;background:#3FD0E0;transition:width .3s}
#notes{position:fixed;left:0;right:0;bottom:0;max-height:34vh;overflow:auto;background:rgba(10,14,26,.94);color:#e6ebf3;font:400 18px/1.7 'Noto Sans JP',sans-serif;padding:16px 24px 24px;border-top:1px solid #33415f;display:none}
#notes.show{display:block}
@media (prefers-reduced-motion:reduce){section,section.on{transition:none}section.on [data-build-in]{animation:none}}
</style></head>
<body>
<div id="stage">
${body}</div>
<div id="bar"></div>
<div id="notes" role="region" aria-label="発表メモ"></div>
<nav id="hud" aria-label="スライド操作"><button id="prev" aria-label="前のスライド">←</button><span id="count" aria-live="polite"></span><button id="next" aria-label="次のスライド">→</button><button id="nt" aria-label="発表メモを表示">メモ</button><button id="fs" aria-label="全画面表示">全画面</button></nav>
<script>
(()=>{const S=[...document.querySelectorAll('#stage>section')],st=document.getElementById('stage');let cur=0;
S.forEach(s=>s.querySelectorAll('[data-build-in]').forEach(e=>{const p=e.getAttribute('data-build-in').split(/\\s+/);const t=p[0]||'fade',o=parseInt(p[1]||'1',10);e.style.setProperty('--bk','b-'+t);e.style.setProperty('--bd',((o-1)*0.35+0.15)+'s');}));
function fit(){const k=Math.min(innerWidth/1920,innerHeight/1080);st.style.transform='scale('+k+') translate(-50%,-50%)';}
addEventListener('resize',fit);fit();
const notes=document.getElementById('notes');
function go(i){i=Math.max(0,Math.min(S.length-1,i));const prev=S[cur];
 if(prev!==S[i]){prev.classList.remove('on');prev.querySelectorAll('video').forEach(v=>v.pause());}
 cur=i;const s=S[i];
 s.querySelectorAll('iframe.emb').forEach(f=>{f.srcdoc=f.srcdoc;});
 s.classList.remove('on');void s.offsetWidth;s.classList.add('on');
 s.querySelectorAll('video').forEach(v=>{v.currentTime=0;v.play().catch(()=>{});});
 document.getElementById('count').textContent=(i+1)+' / '+S.length;
 document.getElementById('bar').style.width=((i+1)/S.length*100)+'%';
 const a=s.querySelector('aside');notes.textContent=a?a.textContent:'';
 history.replaceState(null,'','#'+(i+1));}
addEventListener('keydown',e=>{if(e.target.closest&&e.target.closest('button'))if(e.key===' '||e.key==='Enter')return;
 const k=e.key;if(['ArrowRight','PageDown',' ','Enter','ArrowDown'].includes(k)){e.preventDefault();go(cur+1);}
 else if(['ArrowLeft','PageUp','Backspace','ArrowUp'].includes(k)){e.preventDefault();go(cur-1);}
 else if(k==='Home')go(0);else if(k==='End')go(S.length-1);
 else if(k==='f'||k==='F')full();else if(k==='n'||k==='N')notes.classList.toggle('show');});
st.addEventListener('click',e=>{go(cur+(e.clientX<innerWidth/3?-1:1));});
let tx=null;addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
addEventListener('touchend',e=>{if(tx===null)return;const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>40)go(cur+(d<0?1:-1));tx=null;});
function full(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{});}
document.getElementById('prev').onclick=()=>go(cur-1);document.getElementById('next').onclick=()=>go(cur+1);
document.getElementById('fs').onclick=full;document.getElementById('nt').onclick=()=>notes.classList.toggle('show');
const h=parseInt(location.hash.slice(1),10);go(isNaN(h)?0:h-1);})();
</script></body></html>`;
fs.writeFileSync(out,html);console.log('bytes',html.length);
