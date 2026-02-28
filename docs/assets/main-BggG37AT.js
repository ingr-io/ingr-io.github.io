import{F as w,c as R,h as $}from"./highlight-BbQKTSrm.js";const S=["json","jsonl","csv","tsv","yaml","xml"],v={json:`[
  { "id": "u1", "name": "Alice Chen", "role": "engineer", "active": true },
  { "id": "u2", "name": "Bob Marsh",  "role": "designer", "active": true },
  { "id": "u3", "name": "Carol Wu",   "role": "manager",  "active": false }
]`,jsonl:`{"id":"u1","name":"Alice Chen","role":"engineer","active":true}
{"id":"u2","name":"Bob Marsh","role":"designer","active":true}
{"id":"u3","name":"Carol Wu","role":"manager","active":false}`,csv:`id,name,role,active
u1,Alice Chen,engineer,true
u2,Bob Marsh,designer,true
u3,Carol Wu,manager,false`,tsv:`id	name	role	active
u1	Alice Chen	engineer	true
u2	Bob Marsh	designer	true
u3	Carol Wu	manager	false`,yaml:`- id: u1
  name: Alice Chen
  role: engineer
  active: true
- id: u2
  name: Bob Marsh
  role: designer
  active: true
- id: u3
  name: Carol Wu
  role: manager
  active: false`,xml:`<?xml version="1.0" encoding="UTF-8"?>
<users>
  <user><id>u1</id><name>Alice Chen</name><role>engineer</role><active>true</active></user>
  <user><id>u2</id><name>Bob Marsh</name><role>designer</role><active>true</active></user>
  <user><id>u3</id><name>Carol Wu</name><role>manager</role><active>false</active></user>
</users>`};function T(n){if(n===0)return"0 bytes";const t=Math.abs(n),a=t/(1024*1024),l=t/1024;if(t>=1024*1024){const o=Math.round(a*10)/10;return o===Math.floor(o)?`${Math.floor(o)}MB`:`${o}MB`}if(t>=1024){const o=Math.round(l*10)/10;return o===Math.floor(o)?`${Math.floor(o)}KB`:`${o}KB`}return`${Math.floor(t)} bytes`}function C(n,t,a){const l=document.getElementById("hero-size-info"),o=document.getElementById("hero-size-change");if(!t||!n){l.style.display="none";return}let c=t;if(a){const s=a.split(`
`);let e=s.length;for(let m=s.length-1;m>=1;m--)if(/^#\s+\d+\s+records?$/.test(s[m].trim())){e=m;break}const r=s.slice(1,e);c=new TextEncoder().encode(r.join(`
`)).length}const i=c-n,d=Math.round(i/n*100),u=i<0?"var(--success)":"var(--error)",h=i<0?"Data size saved":"Data size increased";o.innerHTML=`
    <span style="color:${u};">${h} <strong>${Math.abs(d)}%</strong> (<span style="color:${u};">${T(Math.abs(i))}</span>)</span>
  `,l.style.display="block"}function x(){const n=document.getElementById("hero-tabs"),t=document.getElementById("hero-input"),a=document.getElementById("hero-output"),l=document.getElementById("hero-convert"),o=document.getElementById("hero-swap"),c=document.getElementById("hero-delimiter"),i=document.getElementById("hero-sha256");let d="json";function u(e){d=e,t.value=v[e]??"",a.innerHTML="",a.classList.remove("error"),n.querySelectorAll(".format-tab").forEach(r=>{r.classList.toggle("active",r.dataset.fmt===e)})}function h(e,r=!1){a.classList.toggle("error",r),r?a.textContent=e:a.innerHTML=e?$(e):""}async function s(){try{const e={ingrDelimiter:c.checked};let r=R(t.value,d,"ingr",e);if(i.checked){const A=new TextEncoder().encode(r),I=await crypto.subtle.digest("SHA-256",A),M=Array.from(new Uint8Array(I)).map(B=>B.toString(16).padStart(2,"0")).join("");r=r+`
# sha256:`+M}h(r),C(new TextEncoder().encode(t.value).length,new TextEncoder().encode(r).length,r)}catch(e){h(e instanceof Error?e.message:String(e),!0)}}n.innerHTML=S.map(e=>`<button class="format-tab${e===d?" active":""}" data-fmt="${e}">${w[e]}</button>`).join(""),n.addEventListener("click",e=>{const r=e.target.closest(".format-tab");r?.dataset.fmt&&(u(r.dataset.fmt),s())}),l.addEventListener("click",s),c.addEventListener("change",s),i.addEventListener("change",s),o.addEventListener("click",()=>{const e=a.textContent??"";!e||a.classList.contains("error")||(t.value=e,a.innerHTML="",a.classList.remove("error"),u("ingr"))}),t.value=v.json,s()}document.addEventListener("DOMContentLoaded",x);const f="https://raw.githubusercontent.com/ingitdb/ingitdb-cli/refs/heads/main/docs/file-formats/ingr.md",U={parser:`Implement an INGR file format parser in [YOUR LANGUAGE].

Specification: ${f}

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

Specification: ${f}

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

Specification: ${f}

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

Include usage examples for both parsing and building.`},b=document.getElementById("prompt-tabs"),y=document.getElementById("prompt-output"),p=document.getElementById("copy-prompt"),E=document.getElementById("lang-input");let L="parser";function g(){const n=E.value.trim()||"[YOUR LANGUAGE]";return U[L].replaceAll("[YOUR LANGUAGE]",n)}function N(n){L=n,y.textContent=g(),b.querySelectorAll(".format-tab").forEach(t=>t.classList.toggle("active",t.dataset.prompt===n))}b.addEventListener("click",n=>{const t=n.target.closest(".format-tab");t?.dataset.prompt&&N(t.dataset.prompt)});E.addEventListener("input",()=>{y.textContent=g()});p.addEventListener("click",async()=>{await navigator.clipboard.writeText(g());const n=p.innerHTML;p.innerHTML="<span>✓</span> Copied",setTimeout(()=>{p.innerHTML=n},1500)});N("parser");
