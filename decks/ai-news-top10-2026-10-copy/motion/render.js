const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
  const FPS=30,T=10,dir=process.argv[2]||'frames';fs.mkdirSync(dir,{recursive:true});
  const b=await chromium.launch({args:['--allow-file-access-from-files']});
  const p=await b.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  await p.goto('file://'+__dirname+'/render.html');await p.evaluate(m=>setup(m),JSON.parse(fs.readFileSync(__dirname+'/meta.json','utf8')));
  const only=process.argv[3]?process.argv[3].split(',').map(Number):null;
  const frames=only||[...Array(FPS*T).keys()];
  for(const i of frames){await p.evaluate(t=>draw(t),i/FPS);
    await p.screenshot({path:`${dir}/f${String(i).padStart(4,'0')}.png`});}
  await b.close();})();
