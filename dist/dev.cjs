"use strict";var c=Object.defineProperty;var k=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var $=Object.prototype.hasOwnProperty;var b=(t,e)=>{for(var n in e)c(t,n,{get:e[n],enumerable:!0})},C=(t,e,n,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of x(e))!$.call(t,r)&&r!==n&&c(t,r,{get:()=>e[r],enumerable:!(a=k(e,r))||a.enumerable});return t};var S=t=>C(c({},"__esModule",{value:!0}),t);var _={};b(_,{liveReload:()=>R});module.exports=S(_);var y="data-site-live-reload";function L(t,e,n){return`let version=${JSON.stringify(t)};
const versionPath=${JSON.stringify(e)};
const interval=${n};
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
setInterval(update,interval);`}function R(t={}){let e=(t.path??"/__site").replace(/\/$/,""),n=t.interval??500,a=t.ignore??(s=>s.req.header("HX-Request")==="true");if(!e.startsWith("/"))throw new Error("liveReload path must begin with /");if(!Number.isFinite(n)||n<100)throw new Error("liveReload interval must be at least 100ms");let r=`${Date.now()}-${Math.random().toString(36).slice(2)}`,h=`${e}/version`,d=`${e}/client.js`,w=L(r,h,n);return async(s,m)=>{let u=new URL(s.req.url).pathname;if(u===h)return s.text(r,200,{"Cache-Control":"no-store"});if(u===d)return s.body(w,200,{"Cache-Control":"no-store","Content-Type":"text/javascript; charset=UTF-8"});await m();let o=s.res,v=o.headers.get("Content-Type")??"";if(a(s)||!v.toLowerCase().startsWith("text/html")||o.headers.has("Content-Encoding"))return;let i=await o.text();if(i.includes(y))return;let f=`<script type="module" src="${d}" ${y}></script>`,l=i.toLowerCase().lastIndexOf("</body>"),g=l<0?`${i}${f}`:`${i.slice(0,l)}${f}${i.slice(l)}`,p=new Headers(o.headers);p.delete("Content-Length"),s.res=new Response(g,{status:o.status,statusText:o.statusText,headers:p})}}0&&(module.exports={liveReload});
