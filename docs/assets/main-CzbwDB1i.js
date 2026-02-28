import{F as R,c as w,h as x}from"./highlight-BNcuc9BJ.js";const C=["json","jsonl","csv","tsv","yaml","xml"],y={json:`[
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
</users>`};function $(n){if(n===0)return"0 bytes";const t=Math.abs(n),a=t/(1024*1024),c=t/1024;if(t>=1024*1024){const o=Math.round(a*10)/10;return o===Math.floor(o)?`${Math.floor(o)}MB`:`${o}MB`}if(t>=1024){const o=Math.round(c*10)/10;return o===Math.floor(o)?`${Math.floor(o)}KB`:`${o}KB`}return`${Math.floor(t)} bytes`}function S(n,t,a){const c=document.getElementById("hero-size-info"),o=document.getElementById("hero-size-change");if(!t||!n){c.style.display="none";return}let d=t;if(a){const s=a.match(/:\s*/);if(s){const e=s.index+s[0].length,r=a.split(`
`);let f=-1;for(let i=r.length-1;i>0;i--)if(r[i].startsWith("#")){f=i;break}let p=a.length;if(f>0){const i=a.indexOf(r[f]);p=a.lastIndexOf(`
`,i)}d=p-e}}const l=d-n,u=Math.round(l/n*100),m=l<0?"var(--success)":"var(--error)",h=l<0?"Data size saved":"Data size increased";o.innerHTML=`
    <span style="color:${m};">${h} <strong>${Math.abs(u)}%</strong> (<span style="color:${m};">${$(Math.abs(l))}</span>)</span>
  `,c.style.display="block"}function T(){const n=document.getElementById("hero-tabs"),t=document.getElementById("hero-input"),a=document.getElementById("hero-output"),c=document.getElementById("hero-convert"),o=document.getElementById("hero-swap"),d=document.getElementById("hero-delimiter"),l=document.getElementById("hero-sha256");let u="json";function m(e){u=e,t.value=y[e]??"",a.innerHTML="",a.classList.remove("error"),n.querySelectorAll(".format-tab").forEach(r=>{r.classList.toggle("active",r.dataset.fmt===e)})}function h(e,r=!1){a.classList.toggle("error",r),r?a.textContent=e:a.innerHTML=e?x(e):""}async function s(){try{const e={ingrDelimiter:d.checked};let r=w(t.value,u,"ingr",e);if(l.checked){const p=new TextEncoder().encode(r),i=await crypto.subtle.digest("SHA-256",p),A=Array.from(new Uint8Array(i)).map(B=>B.toString(16).padStart(2,"0")).join("");r=r+`
# sha256:`+A}h(r),S(new TextEncoder().encode(t.value).length,new TextEncoder().encode(r).length,r)}catch(e){h(e instanceof Error?e.message:String(e),!0)}}n.innerHTML=C.map(e=>`<button class="format-tab${e===u?" active":""}" data-fmt="${e}">${R[e]}</button>`).join(""),n.addEventListener("click",e=>{const r=e.target.closest(".format-tab");r?.dataset.fmt&&(m(r.dataset.fmt),s())}),c.addEventListener("click",s),d.addEventListener("change",s),l.addEventListener("change",s),o.addEventListener("click",()=>{const e=a.textContent??"";!e||a.classList.contains("error")||(t.value=e,a.innerHTML="",a.classList.remove("error"),m("ingr"))}),t.value=y.json,s()}document.addEventListener("DOMContentLoaded",T);const b="https://raw.githubusercontent.com/ingitdb/ingitdb-cli/refs/heads/main/docs/file-formats/ingr.md",U={parser:`Implement an INGR file format parser in [YOUR LANGUAGE].

Specification: ${b}

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

Specification: ${b}

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

Specification: ${b}

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

Include usage examples for both parsing and building.`},E=document.getElementById("prompt-tabs"),L=document.getElementById("prompt-output"),g=document.getElementById("copy-prompt"),I=document.getElementById("lang-input");let N="parser";function v(){const n=I.value.trim()||"[YOUR LANGUAGE]";return U[N].replaceAll("[YOUR LANGUAGE]",n)}function M(n){N=n,L.textContent=v(),E.querySelectorAll(".format-tab").forEach(t=>t.classList.toggle("active",t.dataset.prompt===n))}E.addEventListener("click",n=>{const t=n.target.closest(".format-tab");t?.dataset.prompt&&M(t.dataset.prompt)});I.addEventListener("input",()=>{L.textContent=v()});g.addEventListener("click",async()=>{await navigator.clipboard.writeText(v());const n=g.innerHTML;g.innerHTML="<span>✓</span> Copied",setTimeout(()=>{g.innerHTML=n},1500)});M("parser");
