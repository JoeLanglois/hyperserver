var f="data-site-live-reload";function g(n,r,s){return`let version=${JSON.stringify(n)};
const versionPath=${JSON.stringify(r)};
const interval=${s};
let html;
const styles=new Map();
const probe=async url=>{
  const next=new URL(url,location.href);
  next.searchParams.set("__site_probe",Date.now());
  const response=await fetch(next,{cache:"no-store"});
  if(!response.ok)throw new Error(String(response.status));
  return response.text();
};
const page=async()=>{
  const response=await fetch(location.href,{cache:"no-store"});
  if(!response.ok)throw new Error(String(response.status));
  return response.text();
};
const stylesheetLinks=()=>[...document.querySelectorAll('link[rel~="stylesheet"][href]')]
  .filter(link=>new URL(link.href,location.href).origin===location.origin);
const readStyles=async()=>Promise.all(stylesheetLinks().map(async link=>{
  try{return [link,await probe(link.href)]}catch{return [link,undefined]}
}));
const initialize=async()=>{
  try{html=await page()}catch{}
  for(const [link,content] of await readStyles())if(content!==undefined)styles.set(link,content);
};
const update=async()=>{
  let changedStyle=false;
  for(const [link,content] of await readStyles()){
    if(content===undefined)continue;
    const previous=styles.get(link);
    styles.set(link,content);
    if(previous!==undefined&&previous!==content){
      const href=new URL(link.href,location.href);
      href.searchParams.set("__site_reload",Date.now());
      link.href=href;
      changedStyle=true;
    }
  }
  try{
    const response=await fetch(versionPath,{cache:"no-store"});
    if(!response.ok)return;
    const nextVersion=await response.text();
    if(nextVersion===version)return;
    const nextHtml=await page();
    if(html!==undefined&&nextHtml!==html){location.reload();return}
    html=nextHtml;
    version=nextVersion;
  }catch{}
};
await initialize();
setInterval(update,interval);`}function k(n={}){let r=(n.path??"/__site").replace(/\/$/,""),s=n.interval??500,p=n.ignore??(e=>e.req.header("HX-Request")==="true");if(!r.startsWith("/"))throw new Error("liveReload path must begin with /");if(!Number.isFinite(s)||s<100)throw new Error("liveReload interval must be at least 100ms");let a=`${Date.now()}-${Math.random().toString(36).slice(2)}`,l=`${r}/version`,c=`${r}/client.js`,y=g(a,l,s);return async(e,w)=>{let h=new URL(e.req.url).pathname;if(h===l)return e.text(a,200,{"Cache-Control":"no-store"});if(h===c)return e.body(y,200,{"Cache-Control":"no-store","Content-Type":"text/javascript; charset=UTF-8"});await w();let t=e.res,m=t.headers.get("Content-Type")??"";if(p(e)||!m.toLowerCase().startsWith("text/html")||t.headers.has("Content-Encoding"))return;let o=await t.text();if(o.includes(f))return;let d=`<script type="module" src="${c}" ${f}></script>`,i=o.toLowerCase().lastIndexOf("</body>"),v=i<0?`${o}${d}`:`${o.slice(0,i)}${d}${o.slice(i)}`,u=new Headers(t.headers);u.delete("Content-Length"),e.res=new Response(v,{status:t.status,statusText:t.statusText,headers:u})}}export{k as liveReload};
