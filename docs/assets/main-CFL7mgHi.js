import{c as P,F as O,h as K}from"./highlight-DzF3iwud.js";const k=["json","jsonl","csv","tsv","yaml","xml"],M={json:`[
  {
    "$id": "u1",
    "name": "Alice Chen",
    "roles": ["engineer", "architect"],
    "active": true
  },
  {
    "$id": "u2",
    "name": "Bob Marsh",
    "roles": ["designer"],
    "active": true
  },
  {
    "$id": "u3",
    "name": "Carol Wu",
    "roles": ["manager", "engineer"],
    "active": false
  }
]`,jsonl:`{"$id":"u1","name":"Alice Chen","roles":["engineer","architect"],"active":true}
{"$id":"u2","name":"Bob Marsh","roles":["designer"],"active":true}
{"$id":"u3","name":"Carol Wu","roles":["manager","engineer"],"active":false}`,csv:`$id,name,roles,active
u1,Alice Chen,engineer;architect,true
u2,Bob Marsh,designer,true
u3,Carol Wu,manager;engineer,false`,tsv:`$id	name	roles	active
u1	Alice Chen	engineer;architect	true
u2	Bob Marsh	designer	true
u3	Carol Wu	manager;engineer	false`,yaml:`- $id: u1
  name: Alice Chen
  roles:
    - engineer
    - architect
  active: true
- $id: u2
  name: Bob Marsh
  roles:
    - designer
  active: true
- $id: u3
  name: Carol Wu
  roles:
    - manager
    - engineer
  active: false`,xml:`<?xml version="1.0" encoding="UTF-8"?>
<users>
  <user><id>u1</id><name>Alice Chen</name><roles><role>engineer</role><role>architect</role></roles><active>true</active></user>
  <user><id>u2</id><name>Bob Marsh</name><roles><role>designer</role></roles><active>true</active></user>
  <user><id>u3</id><name>Carol Wu</name><roles><role>manager</role><role>engineer</role></roles><active>false</active></user>
</users>`};function T(t){if(t===0)return"0 bytes";const r=Math.abs(t),o=r/(1024*1024),f=r/1024;if(r>=1024*1024){const a=Math.round(o*10)/10;return a===Math.floor(a)?`${Math.floor(a)}MB`:`${a}MB`}if(r>=1024){const a=Math.round(f*10)/10;return a===Math.floor(a)?`${Math.floor(a)}KB`:`${a}KB`}return`${Math.floor(r)} bytes`}function G(t,r){if(!t||!r)return 0;if(r==="ingr"){const o=t.match(/:\s*/);if(!o)return 0;const f=o.index+o[0].length,a=t.split(`
`);let c=-1;for(let d=a.length-1;d>0;d--)if(a[d].startsWith("#")){c=d;break}let l=t.length;if(c>0){const d=t.indexOf(a[c]);l=t.lastIndexOf(`
`,d)}return l-f}return t.length}function V(t,r,o){const f=document.getElementById("hero-size-info"),a=document.getElementById("hero-size-change");if(!r||!t){f.style.display="none";return}let c=r;if(o){const y=o.match(/:\s*/);if(y){const B=y.index+y[0].length,b=o.split(`
`);let v=-1;for(let g=b.length-1;g>0;g--)if(b[g].startsWith("#")){v=g;break}let E=o.length;if(v>0){const g=o.indexOf(b[v]);E=o.lastIndexOf(`
`,g)}c=E-B}}const l=c-t,d=Math.round(l/t*100),s=l<0?"var(--success)":"var(--error)",i=l<0?"Data size saved":"Data size increased";a.innerHTML=`<span style="color:${s};">${i} <strong>${Math.abs(d)}%</strong> (<span style="color:${s};">${T(Math.abs(l))}</span>)</span>`,f.style.display="block"}function Q(){const t=document.getElementById("hero-grid"),r=document.getElementById("hero-left-panel"),o=document.getElementById("hero-right-panel"),f=document.getElementById("hero-left-title"),a=document.getElementById("hero-right-title"),c=document.getElementById("hero-tabs"),l=document.getElementById("hero-right-tabs"),d=document.getElementById("hero-ingr-controls"),s=document.getElementById("hero-input"),i=document.getElementById("hero-output"),y=document.getElementById("hero-convert"),B=document.getElementById("hero-swap"),b=document.getElementById("hero-delimiter"),v=document.getElementById("hero-sha256"),E=document.getElementById("hero-input-size"),g=document.getElementById("hero-output-size");let u="json",m=!1,A="";function C(){c.innerHTML=k.map(e=>`<button class="format-tab${e===u?" active":""}" data-fmt="${e}">${O[e]}</button>`).join("")}function W(){l.innerHTML=k.map(e=>`<button class="format-tab${e===u?" active":""}" data-fmt="${e}">${O[e]}</button>`).join("")}function R(e){e.querySelectorAll(".format-tab").forEach(n=>{n.classList.toggle("active",n.dataset.fmt===u)})}function L(){const e=m?"ingr":u,n=G(s.value,e);E.textContent=n>0?`(${T(n)})`:""}function S(e){const h=G(e,m?u:"ingr");g.textContent=h>0?`(${T(h)})`:""}function $(e,n=!1){i.classList.toggle("error",n),n?(i.textContent=e,g.textContent=""):m?(i.textContent=e,S(e)):(i.innerHTML=e?K(e):"",S(e))}async function p(e=!1){try{if(m){const n=P(s.value,"ingr",u,{});i.classList.remove("stale"),$(n),document.getElementById("hero-size-info").style.display="none"}else{const n={ingrDelimiter:b.checked};let h=P(s.value,u,"ingr",n);if(v.checked){const J=new TextEncoder().encode(h),Y=await crypto.subtle.digest("SHA-256",J),q=Array.from(new Uint8Array(Y)).map(_=>_.toString(16).padStart(2,"0")).join("");h=h+`
# sha256:`+q}A=h,i.classList.remove("stale"),$(h),V(new TextEncoder().encode(s.value).length,new TextEncoder().encode(h).length,h)}}catch(n){e?i.classList.add("stale"):(i.classList.remove("stale"),$(n instanceof Error?n.message:String(n),!0))}}const x='<b style="color:var(--text);">.INGR</b>';function D(e){m?(f.innerHTML=`${x} input`,a.innerHTML='<b style="color:var(--text);">Output</b>',c.style.display="none",l.style.display="",d.style.display="none",s.placeholder="Paste INGR data here…",i.dataset.placeholder="Converted output will appear here…",e&&(s.value=e),W()):(f.innerHTML='<b style="color:var(--text);">Input</b>',a.innerHTML=`${x} output`,c.style.display="",l.style.display="none",d.style.display="",s.placeholder="Paste your data here…",i.dataset.placeholder="Converted INGR will appear here…",s.value=M[u]??"",C()),i.innerHTML="",i.textContent="",L(),p()}B.addEventListener("click",async()=>{const e=m?void 0:A;r.classList.add("is-swapping"),o.classList.add("is-swapping"),await new Promise(n=>setTimeout(n,180)),m=!m,t.classList.toggle("ingr-right",!m),t.classList.toggle("ingr-left",m),D(e),r.classList.remove("is-swapping"),o.classList.remove("is-swapping")}),c.addEventListener("click",e=>{const n=e.target.closest(".format-tab");n?.dataset.fmt&&(u=n.dataset.fmt,R(c),s.value=M[u]??"",L(),p())}),l.addEventListener("click",e=>{const n=e.target.closest(".format-tab");n?.dataset.fmt&&(u=n.dataset.fmt,R(l),p())}),y.addEventListener("click",()=>p()),b.addEventListener("change",()=>p()),v.addEventListener("change",()=>p()),s.addEventListener("input",()=>{L(),p(!0)}),C(),s.value=M.json,L(),p()}document.addEventListener("DOMContentLoaded",Q);const N="https://raw.githubusercontent.com/ingitdb/ingitdb-cli/refs/heads/main/docs/file-formats/ingr.md",X={parser:`Implement an INGR file format parser in [YOUR LANGUAGE].

Specification: ${N}

Requirements:
- Parse the header line to extract the recordset name and ordered column list
  ($ID is the reserved primary key column — strip the $ prefix in the output map key)
- Each record spans exactly N lines where N = number of columns;
  each line contains a single JSON-encoded field value (string, number, boolean, null, object, or array)
- Skip optional '#' delimiter lines that may appear between records
- Parse the footer line ("# N record(s)") and validate the count against the number of records parsed
- Validate that (total data lines) % N === 0
- Use UTF-8 encoding and expect LF line separators
- Return a structured result: { recordsetName: string, columns: string[], records: object[] }
- Raise descriptive errors for any malformed input`,builder:`Implement an INGR file format builder (serializer) in [YOUR LANGUAGE].

Specification: ${N}

Requirements:
- Accept: recordset name (string), ordered column list (string[]), array of records (key-value maps)
- Write the header line: # INGR.io | {recordsetName}: $ID, col2, col3, ...
  (the first column must be prefixed with $ to mark it as the primary key)
- Encode each field value as a single-line JSON value — strings, numbers, booleans, null,
  objects and arrays are all valid; objects and arrays must be compacted (no embedded newlines)
- Write each record as N consecutive lines, one JSON value per line
- Accept an optional boolean flag \`delimiter\` — when true, insert a bare '#' line between
  records (but not after the last record)
- Write the footer line: # N record(s) (use "record" for N=1, "records" otherwise)
- Do NOT write a trailing newline after the final line
- Use UTF-8 encoding and LF line separators
- Raise descriptive errors for invalid input`,both:`Implement a complete INGR file format library in [YOUR LANGUAGE], including both a parser and a builder.

Specification: ${N}

--- PARSER ---
- Parse the header line to extract the recordset name and ordered column list
  ($ID is the reserved primary key column — strip the $ prefix in the output map key)
- Each record spans exactly N lines (N = column count);
  each line is a JSON-encoded field value (string, number, boolean, null, object, array)
- Skip optional '#' delimiter lines between records
- Parse and validate the footer record count
- Validate that (total data lines) % N === 0
- Return: { recordsetName: string, columns: string[], records: object[] }
- Raise descriptive errors for malformed input

--- BUILDER ---
- Accept recordset name, ordered column list, and array of records
- Write header: # INGR.io | {recordsetName}: $ID, col2, col3, ...
- Encode each field as a single-line JSON value (compact, no embedded newlines)
- Write each record as N consecutive lines
- Optional \`delimiter\` flag: insert a bare '#' line between records (not after the last)
- Write footer: # N record(s)
- No trailing newline after the final line
- UTF-8, LF line separators

Include usage examples for both parsing and building.`},U=document.getElementById("prompt-tabs"),z=document.getElementById("prompt-output"),I=document.getElementById("copy-prompt"),j=document.getElementById("lang-input");let F="parser";function w(){const t=j.value.trim()||"[YOUR LANGUAGE]";return X[F].replaceAll("[YOUR LANGUAGE]",t)}function H(t){F=t,z.textContent=w(),U.querySelectorAll(".format-tab").forEach(r=>r.classList.toggle("active",r.dataset.prompt===t))}U.addEventListener("click",t=>{const r=t.target.closest(".format-tab");r?.dataset.prompt&&H(r.dataset.prompt)});j.addEventListener("input",()=>{z.textContent=w()});I.addEventListener("click",async()=>{await navigator.clipboard.writeText(w());const t=I.innerHTML;I.innerHTML="<span>✓</span> Copied",setTimeout(()=>{I.innerHTML=t},1500)});H("parser");
