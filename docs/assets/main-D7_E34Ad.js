import{F as B,c as R,h as w}from"./highlight-BbQKTSrm.js";const S=["json","jsonl","csv","tsv","yaml","xml"],f={json:`[
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
</users>`};function $(r){if(r===0)return"0 bytes";const t=Math.abs(r),a=t/(1024*1024),s=t/1024;if(t>=1024*1024){const n=Math.round(a*10)/10;return n===Math.floor(n)?`${Math.floor(n)}MB`:`${n}MB`}if(t>=1024){const n=Math.round(s*10)/10;return n===Math.floor(n)?`${Math.floor(n)}KB`:`${n}KB`}return`${Math.floor(t)} bytes`}function T(r,t){const a=document.getElementById("hero-size-info"),s=document.getElementById("hero-size-change");if(!t||!r){a.style.display="none";return}const n=t-r,d=Math.round(n/r*100),i=n<0?"var(--success)":"var(--error)",c=n<0?"Size saving":"Size increase";s.innerHTML=`
    <span style="color:${i};">${c} <strong>${Math.abs(d)}%</strong> (<span style="color:${i};">${$(Math.abs(n))}</span>)</span>
  `,a.style.display="block"}function C(){const r=document.getElementById("hero-tabs"),t=document.getElementById("hero-input"),a=document.getElementById("hero-output"),s=document.getElementById("hero-convert"),n=document.getElementById("hero-swap"),d=document.getElementById("hero-delimiter"),i=document.getElementById("hero-sha256");let c="json";function p(e){c=e,t.value=f[e]??"",a.innerHTML="",a.classList.remove("error"),r.querySelectorAll(".format-tab").forEach(o=>{o.classList.toggle("active",o.dataset.fmt===e)})}function g(e,o=!1){a.classList.toggle("error",o),o?a.textContent=e:a.innerHTML=e?w(e):""}async function l(){try{const e={ingrDelimiter:d.checked};let o=R(t.value,c,"ingr",e);if(i.checked){const N=new TextEncoder().encode(o),A=await crypto.subtle.digest("SHA-256",N),I=Array.from(new Uint8Array(A)).map(M=>M.toString(16).padStart(2,"0")).join("");o=o+`
# sha256:`+I}g(o),T(new TextEncoder().encode(t.value).length,new TextEncoder().encode(o).length)}catch(e){g(e instanceof Error?e.message:String(e),!0)}}r.innerHTML=S.map(e=>`<button class="format-tab${e===c?" active":""}" data-fmt="${e}">${B[e]}</button>`).join(""),r.addEventListener("click",e=>{const o=e.target.closest(".format-tab");o?.dataset.fmt&&(p(o.dataset.fmt),l())}),s.addEventListener("click",l),d.addEventListener("change",l),i.addEventListener("change",l),n.addEventListener("click",()=>{const e=a.textContent??"";!e||a.classList.contains("error")||(t.value=e,a.innerHTML="",a.classList.remove("error"),p("ingr"))}),t.value=f.json,l()}document.addEventListener("DOMContentLoaded",C);const m="https://raw.githubusercontent.com/ingitdb/ingitdb-cli/refs/heads/main/docs/file-formats/ingr.md",U={parser:`Implement an INGR file format parser in [YOUR LANGUAGE].

Specification: ${m}

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

Specification: ${m}

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

Specification: ${m}

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

Include usage examples for both parsing and building.`},v=document.getElementById("prompt-tabs"),b=document.getElementById("prompt-output"),u=document.getElementById("copy-prompt"),y=document.getElementById("lang-input");let E="parser";function h(){const r=y.value.trim()||"[YOUR LANGUAGE]";return U[E].replaceAll("[YOUR LANGUAGE]",r)}function L(r){E=r,b.textContent=h(),v.querySelectorAll(".format-tab").forEach(t=>t.classList.toggle("active",t.dataset.prompt===r))}v.addEventListener("click",r=>{const t=r.target.closest(".format-tab");t?.dataset.prompt&&L(t.dataset.prompt)});y.addEventListener("input",()=>{b.textContent=h()});u.addEventListener("click",async()=>{await navigator.clipboard.writeText(h());const r=u.innerHTML;u.innerHTML="<span>✓</span> Copied",setTimeout(()=>{u.innerHTML=r},1500)});L("parser");
