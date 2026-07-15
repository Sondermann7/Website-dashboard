/* ===================== STORAGE ===================== */
const KEY = "bartlett_ops_v5";
const _mem = {};
function lsSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){ _mem[k]=v; } }
function lsGet(k){ try{ const v=localStorage.getItem(k); return v!==null?v:(_mem[k]??null); }catch(e){ return _mem[k]??null; } }
let usingLS = true;
try{ const t="__t"; localStorage.setItem(t,"1"); localStorage.removeItem(t); }catch(e){ usingLS=false; }
let usingApi = true;
function uid(){ return "t"+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
function today(){ return new Date().toISOString(); }
function fmt(iso){ if(!iso) return "—"; const d=new Date(iso); return d.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}); }

const PHASES = ["DISCOVERY","LOCAL","LINKS","REVIEWS","RESEARCH","CONTENT","GEO","EXTERIORS","ADS","CADENCE"];

const GENERIC_STAGES = {
  W1:{ name:"Stage 1", title:"Plan", desc:"Decide what this round targets, from last cycle's data.", days:"Wk 1" },
  W2:{ name:"Stage 2", title:"Build", desc:"Create and ship the work.", days:"Wk 2" },
  W3:{ name:"Stage 3", title:"Measure", desc:"Track what it moved.", days:"Wk 3" },
  W4:{ name:"Stage 4", title:"Refine", desc:"Scale winners, cut losers.", days:"Wk 4" }
};

const CYCLE1_STAGES = {
  W1:{ name:"Week 1", title:"Entity & Trust — the Day 1–3 Ship List", desc:"#1 GBP → Boise + homepage title fix (drop CA). #2 Pleasant Grove 301 + junk-sitemap noindex + GA4 de-dupe. #3 Launch the two engines: link building (5–10 domains/mo) and reviews (8–12/mo per market). Content waits — the Boise page exists; its problem is authority.", days:"Days 1–7" },
  W2:{ name:"Week 2", title:"Authority to Boise + Local Cleanup", desc:"Internal links + LocalBusiness schema to the Boise page, Birdeye/GBP + canonical NAP across all markets, plan Exteriors structure, 109-page triage decisions.", days:"Days 8–14" },
  W3:{ name:"Week 3", title:"Exteriors Build + Tracked LPs & Research", desc:"Build /exteriors/ hub + service pages (low competition, rankable at AS 22), measured ad landing pages, Semrush/GSC research, AI visibility baseline.", days:"Days 15–21" },
  W4:{ name:"Week 4", title:"Content, Striking Distance & Day-30 Gate", desc:"Optimize the 458 pos-11–20 keywords, rewrite priority pages, validate schema, then score the Day-30 checkpoint: GBP fixed · PG gone · Boise top 20 · +8 reviews · 5 new referring domains.", days:"Days 22–30" }
};

/* ===================== STATE ===================== */
let state = null;

async function fetchState(){
  const res = await fetch('/api/state');
  if(!res.ok) throw new Error("bad status "+res.status);
  return res.json();
}

async function load(){
  try{
    const data = await fetchState();
    const cachedTab = (()=>{ try{ const raw=lsGet(KEY); return raw?JSON.parse(raw).tab:null; }catch(e){ return null; } })();
    state = { v:5, tab: cachedTab || "cycle", cycle: data.cycle, cadence: data.cadence, archive: data.archive };
    if(!state.cycle.stages) state.cycle.stages = state.cycle.number===1 ? CYCLE1_STAGES : GENERIC_STAGES;
    usingApi = true;
    lsSet(KEY, JSON.stringify(state));
  }catch(e){
    usingApi = false;
    const raw = lsGet(KEY);
    if(raw){ try{ state = JSON.parse(raw); }catch(e2){ state = emptyState(); } }
    else state = emptyState();
  }
}

function emptyState(){
  return { v:5, tab:"cycle", cycle:{ number:1, name:"Offline (no cached data)", start:today(), stages:GENERIC_STAGES, tasks:[] }, cadence:[], archive:[] };
}

let persistTimer=null;
function persist(){
  lsSet(KEY, JSON.stringify(state));
  clearTimeout(persistTimer);
  persistTimer=setTimeout(pushState, 250);
}
async function pushState(){
  if(!usingApi) return;
  try{
    await Promise.all([
      fetch('/api/tasks',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(state.cycle.tasks)}),
      fetch('/api/cadence',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(state.cadence)}),
      fetch('/api/archive',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(state.archive)}),
    ]);
  }catch(e){ /* localStorage mirror already saved; will retry on next mutation */ }
}

/* ===================== PERIOD KEYS (cadence reset) ===================== */
function weekKey(d){
  const x=new Date(d); const u=new Date(Date.UTC(x.getFullYear(),x.getMonth(),x.getDate()));
  const day=(u.getUTCDay()+6)%7; u.setUTCDate(u.getUTCDate()-day+3);
  const ft=new Date(Date.UTC(u.getUTCFullYear(),0,4));
  const wk=1+Math.round(((u-ft)/86400000-3+((ft.getUTCDay()+6)%7))/7);
  return u.getUTCFullYear()+"-W"+String(wk).padStart(2,"0");
}
function monthKey(d){ const x=new Date(d); return x.getFullYear()+"-M"+String(x.getMonth()+1).padStart(2,"0"); }
function periodKey(freq,d){ return freq==="weekly"?weekKey(d):monthKey(d); }
function doneThisPeriod(item){ return item.lastDone && periodKey(item.freq,item.lastDone)===periodKey(item.freq,Date.now()); }

/* ===================== RENDER: shell ===================== */
function esc(s){ return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
function setTab(tab){
  state.tab=tab; persist();
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+tab));
}
function renderShell(){
  const c=state.cycle;
  document.getElementById("cycTag").textContent = "Cycle "+c.number;
  document.getElementById("cycName").textContent = c.name;
  document.getElementById("cycMeta").textContent = "Started "+fmt(c.start)+" · "+c.tasks.length+" tasks";
  const done=c.tasks.filter(t=>t.col==="done").length;
  const pct=c.tasks.length?Math.round(done/c.tasks.length*100):0;
  document.getElementById("cycFill").style.width=pct+"%";
  document.getElementById("cycProg").textContent=pct+"%  ·  "+done+"/"+c.tasks.length+" done";
  document.getElementById("tcCycle").textContent="("+c.tasks.length+")";
  const wkDone=state.cadence.filter(i=>i.freq==="weekly"&&doneThisPeriod(i)).length;
  const wkTot=state.cadence.filter(i=>i.freq==="weekly").length;
  document.getElementById("tcCad").textContent="("+wkDone+"/"+wkTot+" wk)";
  document.getElementById("tcArc").textContent="("+state.archive.length+")";
}

/* ===================== RENDER: cycle board ===================== */
let filterStage="ALL";
const board=document.getElementById("board");
function cycVisible(){ return state.cycle.tasks.filter(t=>filterStage==="ALL"||t.w===filterStage); }
function renderCycle(){
  ["todo","doing","done"].forEach(col=>{
    const zone=board.querySelector('[data-zone="'+col+'"]'); zone.innerHTML="";
    const items=cycVisible().filter(t=>t.col===col).sort((a,b)=>a.order-b.order);
    if(!items.length) zone.innerHTML='<div class="empty">Nothing here'+(filterStage!=="ALL"?" for "+filterStage:"")+'.</div>';
    items.forEach(t=>zone.appendChild(cardEl(t)));
    board.querySelector('[data-count="'+col+'"]').textContent=items.length;
  });
  renderStages();
}
function cardEl(t){
  const el=document.createElement("div"); el.className="card bl-"+t.ph; el.draggable=true; el.dataset.id=t.id;
  const where=t.where?'<div class="cwhere"><b>Where:</b> '+esc(t.where)+'</div>':"";
  const note=t.note?'<div class="cnote">'+esc(t.note)+'</div>':"";
  let execBlock="";
  if(t.exec&&t.exec.length){
    const steps=t.exec.map(s=>'<li>'+esc(s)+'</li>').join("");
    execBlock='<div class="exec"><button class="exectoggle"><span class="arw">▸</span> Cowork execution plan</button>'
      +'<div class="execbody" hidden><div class="ehd">Cowork runs this</div><ol>'+steps+'</ol>'
      +'<button class="copyplan">Copy Cowork brief</button></div></div>';
  }
  el.innerHTML='<div class="cardtop"><span class="ph ph-'+t.ph+'">'+t.ph+'</span><span class="wbadge">'+t.w+'</span><span class="pri pri-'+t.pri+'">'+t.pri+'</span></div>'
    +'<div class="ctitle">'+esc(t.t)+'</div>'+note+where+execBlock
    +'<div class="cardbtns"><button class="pill '+(t.col==="todo"?"cur":"")+'" data-set="todo">To Do</button>'
    +'<button class="pill '+(t.col==="doing"?"cur":"")+'" data-set="doing">Doing</button>'
    +'<button class="pill '+(t.col==="done"?"cur":"")+'" data-set="done">Done</button>'
    +'<button class="del" title="Delete">✕</button></div>';
  el.querySelectorAll(".pill").forEach(b=>b.addEventListener("click",()=>{t.col=b.dataset.set;persist();renderCycle();renderShell();}));
  el.querySelector(".del").addEventListener("click",()=>{state.cycle.tasks=state.cycle.tasks.filter(x=>x.id!==t.id);persist();renderCycle();renderShell();});
  const tog=el.querySelector(".exectoggle");
  if(tog){ const body=el.querySelector(".execbody");
    tog.addEventListener("click",()=>{const open=body.hidden;body.hidden=!open;tog.classList.toggle("open",open);});
    el.querySelector(".copyplan").addEventListener("click",e=>copyPrompt(t,e.target)); }
  el.addEventListener("dragstart",e=>{el.classList.add("dragging");e.dataTransfer.setData("text/plain",t.id);});
  el.addEventListener("dragend",()=>el.classList.remove("dragging"));
  return el;
}
function renderStages(){
  const host=document.getElementById("weeks"); host.innerHTML="";
  host.appendChild(stageBtn("ALL","All","Whole cycle","",undefined));
  Object.keys(state.cycle.stages).forEach(k=>{
    const w=state.cycle.stages[k];
    const all=state.cycle.tasks.filter(t=>t.w===k);
    const done=all.filter(t=>t.col==="done").length;
    const pct=all.length?Math.round(done/all.length*100):0;
    host.appendChild(stageBtn(k,w.name,w.title,w.days,pct,done,all.length));
  });
}
function stageBtn(key,name,title,days,pct,done,total){
  const b=document.createElement("button"); b.className="wk"+(filterStage===key?" on":"");
  const bar=pct!==undefined?'<div class="wbar"><i style="width:'+pct+'%"></i></div><div class="wcount">'+done+'/'+total+' · '+days+'</div>':'<div class="wcount" style="margin-top:9px;">Show every task</div>';
  b.innerHTML='<div class="wn">'+(key==="ALL"?"·":key)+'</div><div class="wt">'+name+'</div><div class="wd">'+title+'</div>'+bar;
  b.addEventListener("click",()=>{filterStage=key;renderCycle();});
  return b;
}
board.querySelectorAll(".col").forEach(col=>{
  col.addEventListener("dragover",e=>{e.preventDefault();col.classList.add("over");});
  col.addEventListener("dragleave",e=>{if(!col.contains(e.relatedTarget))col.classList.remove("over");});
  col.addEventListener("drop",e=>{e.preventDefault();col.classList.remove("over");
    const id=e.dataTransfer.getData("text/plain"); const t=state.cycle.tasks.find(x=>x.id===id);
    if(t){t.col=col.dataset.col;t.order=Date.now();persist();renderCycle();renderShell();}});
});

/* ===================== RENDER: cadence ===================== */
function renderCadence(){
  ["weekly","monthly"].forEach(freq=>{
    const host=document.getElementById(freq==="weekly"?"weeklyList":"monthlyList"); host.innerHTML="";
    const items=state.cadence.filter(i=>i.freq===freq);
    items.forEach(i=>host.appendChild(cadEl(i)));
    const done=items.filter(doneThisPeriod).length;
    document.getElementById(freq==="weekly"?"wkMeta":"moMeta").textContent=done+"/"+items.length+(freq==="weekly"?" this week":" this month");
  });
}
function cadEl(i){
  const done=doneThisPeriod(i);
  const el=document.createElement("div"); el.className="cad bl-"+i.ph+(done?" checked":""); el.style.borderLeftWidth="3px";
  let execBlock="";
  if(i.exec&&i.exec.length){
    const steps=i.exec.map(s=>'<li>'+esc(s)+'</li>').join("");
    execBlock='<div class="exec"><button class="exectoggle"><span class="arw">▸</span> Cowork execution plan</button>'
      +'<div class="execbody" hidden><div class="ehd">Cowork runs this</div><ol>'+steps+'</ol><button class="copyplan">Copy Cowork brief</button></div></div>';
  }
  const stamp = done
    ? 'Done '+fmt(i.lastDone)+' · resets '+(i.freq==="weekly"?"this week":"this month")
    : '<span class="due">Due '+(i.freq==="weekly"?"this week":"this month")+'</span> · last done '+(i.lastDone?fmt(i.lastDone):"never");
  el.innerHTML='<div class="chk'+(done?" on":"")+'">'+(done?"✓":"")+'</div>'
    +'<div class="cadbody"><div class="cadtitle">'+esc(i.t)+'</div>'
    +(i.note?'<div class="cadnote">'+esc(i.note)+'</div>':"")
    +(i.where?'<div class="cwhere"><b>Where:</b> '+esc(i.where)+'</div>':"")
    +execBlock+'<div class="cadstamp">'+stamp+'</div></div>'
    +'<button class="del" title="Delete">✕</button>';
  el.querySelector(".chk").addEventListener("click",()=>{ i.lastDone=doneThisPeriod(i)?null:today(); persist(); renderCadence(); renderShell(); });
  el.querySelector(".del").addEventListener("click",()=>{ state.cadence=state.cadence.filter(x=>x!==i); persist(); renderCadence(); renderShell(); });
  const tog=el.querySelector(".exectoggle");
  if(tog){ const body=el.querySelector(".execbody");
    tog.addEventListener("click",()=>{const open=body.hidden;body.hidden=!open;tog.classList.toggle("open",open);});
    el.querySelector(".copyplan").addEventListener("click",e=>copyPrompt(i,e.target)); }
  return el;
}

/* ===================== RENDER: archive ===================== */
function renderArchive(){
  const host=document.getElementById("archiveList"); host.innerHTML="";
  if(!state.archive.length){ host.innerHTML='<div class="arcempty">No archived cycles yet. When you finish Cycle '+state.cycle.number+', archive it here — completed work is logged so the next cycle builds on it.</div>'; return; }
  state.archive.forEach((a,idx)=>{
    const pct=a.total?Math.round(a.done/a.total*100):0;
    const el=document.createElement("div"); el.className="arc";
    const rows=a.tasks.map(t=>'<div class="ai"><span class="st '+(t.col==="done"?"st-done":"st-open")+'">'+(t.col==="done"?"Done":"Open")+'</span><span>'+esc(t.t)+'</span></div>').join("");
    el.innerHTML='<div class="archead"><span class="an">Cycle '+a.number+'</span><span class="at">'+esc(a.name)+'</span><span class="ameta">'+a.done+'/'+a.total+' done · '+fmt(a.start)+' – '+fmt(a.end)+'</span></div>'
      +'<div class="arcbar"><i style="width:'+pct+'%"></i></div>'
      +'<div class="arclist" hidden>'+rows+'</div>';
    const head=el.querySelector(".archead"); const list=el.querySelector(".arclist");
    head.addEventListener("click",()=>{ list.hidden=!list.hidden; });
    host.appendChild(el);
  });
}

/* ===================== COWORK PROMPT ===================== */
function accessHint(t){
  const where=(t.where||"").toLowerCase();
  const title=(t.t||"").toLowerCase();
  const hay=where+" "+title;
  const aliases=[
    ["Hosting panel",["hosting","backup plugin","restore"]],
    ["WordPress",["wordpress","wp ","wp +","wp admin","site root"]],
    ["Yoast",["yoast"]],
    ["Avada/Fusion Builder",["avada","fusion builder","fusion"]],
    ["Birdeye / GBP",["birdeye","gbp","google business profile","business.google.com","listings"]],
    ["Google Search Console",["google search console","gsc"]],
    ["GA4",["ga4","analytics","debugview"]],
    ["Google Tag Manager",["google tag manager","gtm","tag assistant"]],
    ["Bing Webmaster Tools",["bing webmaster","bing"]],
    ["Semrush",["semrush"]],
    ["CallRail",["callrail"]],
    ["Roofle",["roofle"]],
    ["Meta Business Manager",["meta","facebook","fb/ig","pixel"]],
    ["CRM",["crm","form destinations","lead flow","leads"]],
    ["Spreadsheet / tracker",["spreadsheet","sheet","tracker","map","baseline"]],
    ["PageSpeed Insights",["pagespeed","core web vitals","lcp"]],
    ["Bright Development",["bright development"]],
    ["AI answer engines",["chatgpt","perplexity","claude","gemini","copilot","google ai overview","ai-search","ai visibility"]]
  ];
  const tools=[];
  aliases.forEach(([name,terms])=>{ if(terms.some(term=>hay.includes(term))) tools.push(name); });
  return tools.length ? Array.from(new Set(tools)).join(", ") : "Use the WHERE field and context files to identify access needed; ask before assuming.";
}
function deliverableHint(t){
  const ph=t.ph||"CADENCE";
  const title=(t.t||"").toLowerCase();
  if(ph==="DISCOVERY") return "A concise findings brief, source links/screenshots, a risk list, and a recommended next action. No live changes unless explicitly approved.";
  if(ph==="LOCAL") return "A NAP/listing audit, proposed update table, review-reply drafts if relevant, and an approval-ready change list.";
  if(ph==="LINKS") return "A prospect/outreach tracker with target URL, contact, status, outreach copy, target page, and verification URL for any acquired link.";
  if(ph==="REVIEWS") return "Review reply drafts, review-request workflow notes, per-market review baseline, and any Birdeye settings proposed for approval.";
  if(ph==="RESEARCH") return "A dated research sheet or brief with source URLs, method, assumptions, competitor findings, and task recommendations.";
  if(ph==="CONTENT") return "Draft copy or page edits, before/after notes, target URL(s), internal-link/schema recommendations, and Preview-only proof before publish.";
  if(ph==="GEO") return "An answer-readiness or AI-visibility brief with exact queries, engines, dates, cited sources, schema/robots findings, and conservative recommendations.";
  if(ph==="EXTERIORS") return "An approved URL/page structure, differentiated service copy, Avada-compatible build notes, schema plan, and Preview links before publish.";
  if(ph==="ADS") return "Landing-page brief or draft, UTM/tracking map, noindex confirmation where relevant, test-lead proof, and GA4/Meta/CallRail verification notes.";
  if(title.includes("backup")) return "Backup method, last successful backup date, restore path, and a clear pass/fail recommendation before any other work.";
  return "A completed task note with evidence, changed/drafted items, blockers, and the next recommended action.";
}
function verificationHint(t){
  const ph=t.ph||"CADENCE";
  const title=(t.t||"").toLowerCase();
  if(title.includes("redirect") || title.includes("301")) return "Verify every source URL, target URL, status code, final destination, sitemap state, and absence of 404s.";
  if(title.includes("schema")) return "Verify JSON-LD in View Source, then validate with the relevant schema/rich-result tool. Report warnings separately from errors.";
  if(title.includes("ga4") || title.includes("tracking") || title.includes("lead")) return "Use DebugView/Tag Assistant/test submission where possible and prove one clean event or lead path per test.";
  if(title.includes("index") || title.includes("gsc")) return "Use GSC exports/screenshots and record date range, property, URL examples, and reason buckets.";
  if(title.includes("pagespeed") || title.includes("core web vitals") || title.includes("lcp")) return "Record mobile and desktop metrics before/after, tested URL, test date, and the specific opportunities addressed.";
  if(ph==="CONTENT" || ph==="EXTERIORS") return "Provide Preview URL or draft screenshots, before/after copy, target keyword/service intent, and a rollback note.";
  if(ph==="LOCAL" || ph==="REVIEWS") return "Provide listing/review screenshots or exported rows, changed fields proposed, and owner approval status.";
  if(ph==="GEO" || ph==="RESEARCH") return "Log date, query/tool, source URL, result, confidence level, and follow-up action. Do not treat one AI response as proof.";
  return "Show the evidence that proves the task is complete, plus anything that still needs access or approval.";
}
function buildPrompt(t){
  const L=[];
  L.push("Bartlett Roofing & Exteriors — Cowork operator brief"); L.push("");
  L.push("MISSION");
  L.push("Complete this task as far as safely possible, or return a precise blocker with the next best action. Be proactive, but do not publish, delete, redirect, noindex, edit tracking, change schema, or alter NAP without explicit approval.");
  L.push("");
  L.push("TASK METADATA");
  L.push("- Task: "+t.t);
  if(t.w) L.push("- Cycle stage: "+t.w);
  if(t.ph) L.push("- Phase: "+t.ph);
  if(t.pri) L.push("- Priority: "+t.pri);
  if(t.freq) L.push("- Recurring cadence: "+t.freq);
  if(t.where) L.push("- Where to work: "+t.where);
  L.push("- Likely access needed: "+accessHint(t));
  if(t.note) L.push("- Context: "+t.note);
  L.push("");
  L.push("READ FIRST");
  L.push("1. Read data/site-facts.json and memory/decisions.md in this repo before acting.");
  L.push("2. Treat data/tasks.json + data/cadence.json as the execution source of truth.");
  L.push("3. Confirm Bartlett facts before using them: served markets, office ownership, NAP, claims, review counts, rankings, and page status.");
  L.push("");
  L.push("EXECUTION PLAN FROM DASHBOARD");
  (t.exec&&t.exec.length?t.exec:["Clarify the task objective, gather read-only evidence, draft the safest next action, ask for approval if a live change is required, then verify and report."]).forEach((s,i)=>L.push((i+1)+". "+s));
  L.push("");
  L.push("REQUIRED DELIVERABLE");
  L.push(deliverableHint(t));
  L.push("");
  L.push("DEFINITION OF DONE");
  L.push("- The requested work is completed in Draft/Preview or documented as read-only findings.");
  L.push("- Evidence is attached or summarized: URLs, screenshots, exports, source paths, date ranges, test results, or exact changed fields.");
  L.push("- Verification is complete: "+verificationHint(t));
  L.push("- Any remaining approval, access, or owner decision is listed clearly.");
  L.push("");
  L.push("SAFETY RULES");
  L.push("- Start read-only. If you need a login, stop and let Mikey log in. Never handle passwords or secrets.");
  L.push("- Work in Draft/Preview only. Do not publish without explicit approval.");
  L.push("- One change at a time for redirects, noindex, templates, schema, tracking, NAP, and location pages.");
  L.push("- Do not bulk-edit Avada global templates unless the affected pages are understood and approved.");
  L.push("- Never use CallRail dynamic numbers as public GBP/citation NAP.");
  L.push("- Do not invent stats, service areas, local facts, certifications, rankings, review counts, or AI-search guarantees.");
  L.push("- For AI/GEO/robots/crawler claims, verify current official docs and phrase recommendations conservatively.");
  L.push("");
  L.push("STOP AND ASK BEFORE");
  L.push("- Publishing anything live.");
  L.push("- Creating, deleting, noindexing, or redirecting pages.");
  L.push("- Changing GBP/Birdeye NAP, categories, hours, phone numbers, or public listings.");
  L.push("- Changing GA4/GTM/CallRail/Meta tracking or form destinations.");
  L.push("- Editing schema that states business facts, offices, services, reviews, or certifications.");
  L.push("- Acting when files disagree or live data contradicts the plan.");
  L.push("");
  L.push("FINAL REPORT FORMAT");
  L.push("- Status: Done / Draft ready / Blocked / Needs approval.");
  L.push("- What I did: concise bullets.");
  L.push("- Evidence: links, screenshots, exports, test results, or exact fields checked.");
  L.push("- What changed: draft/live/no change, with rollback note if applicable.");
  L.push("- Needs Mikey: decisions, logins, approvals, or missing facts.");
  L.push("- Next best task: one recommended follow-up from the dashboard.");
  return L.join("\n");
}
function copyPrompt(t,btn){
  const text=buildPrompt(t);
  const ok=()=>{ if(btn){btn.classList.add("done");btn.textContent="Copied ✓";setTimeout(()=>{btn.classList.remove("done");btn.textContent="Copy Cowork brief";},1600);} showToast("Cowork brief copied"); };
  try{ navigator.clipboard.writeText(text).then(ok).catch(()=>fallbackCopy(text,ok)); }catch(e){ fallbackCopy(text,ok); }
}
function fallbackCopy(text,ok){ const ta=document.createElement("textarea");ta.value=text;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();try{document.execCommand("copy");ok();}catch(e){showToast("Copy blocked — select the text manually");}document.body.removeChild(ta); }
let toastTimer;
function showToast(m){ const el=document.getElementById("toast");el.textContent=m;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),1800); }

/* ===================== ADD / BULK / NEXT CYCLE / RESET ===================== */
function populateSelects(){
  const stage=document.getElementById("addStage"); stage.innerHTML="";
  Object.keys(state.cycle.stages).forEach(k=>{ const o=document.createElement("option");o.value=k;o.textContent=k+" · "+state.cycle.stages[k].title;stage.appendChild(o); });
  const phase=document.getElementById("addPhase"); phase.innerHTML="";
  PHASES.forEach(p=>{ const o=document.createElement("option");o.value=p;o.textContent=p;phase.appendChild(o); });
  phase.value="CONTENT";
}
function addTask(){
  const inp=document.getElementById("addInput"); const v=inp.value.trim(); if(!v) return;
  const w=document.getElementById("addStage").value, ph=document.getElementById("addPhase").value, pri=document.getElementById("addPri").value;
  const note=document.getElementById("addNote").value.trim();
  state.cycle.tasks.push({ id:uid(), order:Date.now(), col:"todo", w, ph, pri, t:v, note, where:"", exec:[], verify:{status:"unverified",confidence:"low",source:null,checkedAt:null,note:""} });
  inp.value=""; document.getElementById("addNote").value=""; persist(); renderCycle(); renderShell();
}
function bulkAdd(){
  const box=document.getElementById("bulkText"); const lines=box.value.split("\n").map(s=>s.trim()).filter(Boolean);
  if(!lines.length) return;
  const w=document.getElementById("addStage").value, ph=document.getElementById("addPhase").value, pri=document.getElementById("addPri").value;
  lines.forEach((line,i)=> state.cycle.tasks.push({ id:uid(), order:Date.now()+i, col:"todo", w, ph, pri, t:line, note:"", where:"", exec:[], verify:{status:"unverified",confidence:"low",source:null,checkedAt:null,note:""} }));
  box.value=""; persist(); renderCycle(); renderShell(); showToast(lines.length+" tasks added");
}
function startNextCycle(){
  const c=state.cycle;
  const open=c.tasks.filter(t=>t.col!=="done");
  if(!confirm('Archive "Cycle '+c.number+': '+c.name+'" and start the next cycle?\n\nCompleted work is saved to the Archive tab. '+open.length+' unfinished task(s) can carry forward.')) return;
  let carry=false;
  if(open.length) carry=confirm("Carry the "+open.length+" unfinished task(s) into the new cycle?\n\nOK = carry them over.   Cancel = start fresh (they stay saved in the Archive).");
  const done=c.tasks.filter(t=>t.col==="done").length;
  state.archive.unshift({ number:c.number, name:c.name, start:c.start, end:today(), total:c.tasks.length, done, tasks:c.tasks.map(t=>({t:t.t,col:t.col})) });
  const newNum=c.number+1;
  const name=prompt("Name Cycle "+newNum+" — what's its focus? (shaped by what Cycle "+c.number+" revealed)", "Cycle "+newNum) || ("Cycle "+newNum);
  const newTasks = carry ? open.map((t,i)=>({...t,id:uid(),col:"todo",order:i})) : [];
  state.cycle={ number:newNum, name, start:today(), stages:JSON.parse(JSON.stringify(GENERIC_STAGES)), tasks:newTasks };
  filterStage="ALL"; setTab("cycle"); populateSelects(); persist(); renderAll();
  showToast("Cycle "+newNum+" started");
}

/* ===================== MEMORY TAB ===================== */
async function appendMemory(){
  const inp=document.getElementById("memInput"); const v=inp.value.trim(); if(!v) return;
  try{
    const res=await fetch('/api/memory/append',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:v})});
    if(!res.ok) throw new Error("bad status "+res.status);
    inp.value=""; showToast("Appended to memory/log.md");
  }catch(e){ showToast("Couldn't reach the server — is it running?"); }
}

/* ===================== WIRE UP ===================== */
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{setTab(b.dataset.tab);renderAll();}));
document.getElementById("addBtn").addEventListener("click",addTask);
document.getElementById("addInput").addEventListener("keydown",e=>{if(e.key==="Enter")addTask();});
document.getElementById("bulkToggle").addEventListener("click",()=>{ const b=document.getElementById("bulkBox"); b.hidden=!b.hidden; });
document.getElementById("nextBtn").addEventListener("click",startNextCycle);
document.getElementById("memBtn").addEventListener("click",appendMemory);
document.getElementById("resetBtn").addEventListener("click",()=>{
  if(confirm("This dashboard's seeded plan now lives in data/tasks.json + data/cadence.json on the server, not in the browser.\n\nTo reset to the original seeded plan, run 'npm run import' in the project folder (this backs up your current data first), then reload this page.\n\nReload now to pick up any change already made?")){
    location.reload();
  }
});

function renderLegend(){ const host=document.getElementById("legend"); host.querySelectorAll(".ph").forEach(n=>n.remove()); PHASES.forEach(p=>{const s=document.createElement("span");s.className="ph ph-"+p;s.textContent=p;host.appendChild(s);}); }
function renderAll(){ renderShell(); renderCycle(); renderCadence(); renderArchive(); }

/* ===================== INIT ===================== */
(async function init(){
  await load();
  populateSelects();
  renderLegend();
  setTab(state.tab||"cycle");
  renderAll();
  document.getElementById("saveStat").textContent = usingApi
    ? "Reading/writing data/*.json via the local server."
    : (usingLS ? "Server unreachable — showing last cached copy from this browser (localStorage)." : "Server unreachable and no cached copy — showing an empty board.");
})();
