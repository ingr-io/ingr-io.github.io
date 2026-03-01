import{F as x,c as O,h as T}from"./highlight-4uy85KZ6.js";const U=["json","jsonl","csv","tsv","yaml","xml"],L={json:`[
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
</users>`};function y(t){if(t===0)return"0 bytes";const n=Math.abs(t),r=n/(1024*1024),c=n/1024;if(n>=1024*1024){const o=Math.round(r*10)/10;return o===Math.floor(o)?`${Math.floor(o)}MB`:`${o}MB`}if(n>=1024){const o=Math.round(c*10)/10;return o===Math.floor(o)?`${Math.floor(o)}KB`:`${o}KB`}return`${Math.floor(n)} bytes`}function I(t,n){if(!t||!n)return 0;if(n==="ingr"){const r=t.match(/:\s*/);if(!r)return 0;const c=r.index+r[0].length,o=t.split(`
`);let l=-1;for(let s=o.length-1;s>0;s--)if(o[s].startsWith("#")){l=s;break}let i=t.length;if(l>0){const s=t.indexOf(o[l]);i=t.lastIndexOf(`
`,s)}return i-c}return t.length}function k(t,n,r){const c=document.getElementById("hero-size-info"),o=document.getElementById("hero-size-change");if(!n||!t){c.style.display="none";return}let l=n;if(r){const m=r.match(/:\s*/);if(m){const f=m.index+m[0].length,p=r.split(`
`);let h=-1;for(let e=p.length-1;e>0;e--)if(p[e].startsWith("#")){h=e;break}let d=r.length;if(h>0){const e=r.indexOf(p[h]);d=r.lastIndexOf(`
`,e)}l=d-f}}const i=l-t,s=Math.round(i/t*100),g=i<0?"var(--success)":"var(--error)",u=i<0?"Data size saved":"Data size increased";o.innerHTML=`
    <span style="color:${g};">${u} <strong>${Math.abs(s)}%</strong> (<span style="color:${g};">${y(Math.abs(i))}</span>)</span>
  `,c.style.display="block"}function P(){const t=document.getElementById("hero-tabs"),n=document.getElementById("hero-input"),r=document.getElementById("hero-output"),c=document.getElementById("hero-convert"),o=document.getElementById("hero-swap"),l=document.getElementById("hero-delimiter"),i=document.getElementById("hero-sha256"),s=document.getElementById("hero-input-size"),g=document.getElementById("hero-output-size");let u="json";function m(e){u=e,n.value=L[e]??"",r.innerHTML="",r.classList.remove("error"),t.querySelectorAll(".format-tab").forEach(a=>{a.classList.toggle("active",a.dataset.fmt===e)}),f()}function f(){const e=I(n.value,u);s.textContent=e>0?`(${y(e)})`:""}function p(e){const a=I(e,"ingr");g.textContent=a>0?`(${y(a)})`:""}function h(e,a=!1){r.classList.toggle("error",a),a?r.textContent=e:r.innerHTML=e?T(e):""}async function d(){try{const e={ingrDelimiter:l.checked};let a=O(n.value,u,"ingr",e);if(i.checked){const C=new TextEncoder().encode(a),$=await crypto.subtle.digest("SHA-256",C),R=Array.from(new Uint8Array($)).map(w=>w.toString(16).padStart(2,"0")).join("");a=a+`
# sha256:`+R}h(a),k(new TextEncoder().encode(n.value).length,new TextEncoder().encode(a).length,a),p(a)}catch(e){h(e instanceof Error?e.message:String(e),!0)}}t.innerHTML=U.map(e=>`<button class="format-tab${e===u?" active":""}" data-fmt="${e}">${x[e]}</button>`).join(""),t.addEventListener("click",e=>{const a=e.target.closest(".format-tab");a?.dataset.fmt&&(m(a.dataset.fmt),d())}),c.addEventListener("click",d),l.addEventListener("change",d),i.addEventListener("change",d),n.addEventListener("input",f),o.addEventListener("click",()=>{const e=r.textContent??"";!e||r.classList.contains("error")||(n.value=e,r.innerHTML="",r.classList.remove("error"),m("ingr"))}),n.value=L.json,f(),d()}document.addEventListener("DOMContentLoaded",P);const v="https://raw.githubusercontent.com/ingitdb/ingitdb-cli/refs/heads/main/docs/file-formats/ingr.md",z={parser:`Implement an INGR file format parser in [YOUR LANGUAGE].

Specification: ${v}

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

Specification: ${v}

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

Specification: ${v}

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

Include usage examples for both parsing and building.`},M=document.getElementById("prompt-tabs"),N=document.getElementById("prompt-output"),b=document.getElementById("copy-prompt"),B=document.getElementById("lang-input");let A="parser";function E(){const t=B.value.trim()||"[YOUR LANGUAGE]";return z[A].replaceAll("[YOUR LANGUAGE]",t)}function S(t){A=t,N.textContent=E(),M.querySelectorAll(".format-tab").forEach(n=>n.classList.toggle("active",n.dataset.prompt===t))}M.addEventListener("click",t=>{const n=t.target.closest(".format-tab");n?.dataset.prompt&&S(n.dataset.prompt)});B.addEventListener("input",()=>{N.textContent=E()});b.addEventListener("click",async()=>{await navigator.clipboard.writeText(E());const t=b.innerHTML;b.innerHTML="<span>✓</span> Copied",setTimeout(()=>{b.innerHTML=t},1500)});S("parser");
