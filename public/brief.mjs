// Isomorphic: imported by both public/app.js (browser) and server/server.js (Node).
// No DOM APIs and no Node-only APIs (fs/path) allowed in this file.

export function accessHint(t){
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

export function deliverableHint(t){
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

export function verificationHint(t){
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

export function buildPrompt(t){
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
