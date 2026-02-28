import{F as B,c as S,h as w}from"./highlight-B4nNwJx8.js";const C=["json","jsonl","csv","tsv","yaml","xml"],h={json:`[
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
</users>`};function U(){const r=document.getElementById("hero-tabs"),n=document.getElementById("hero-input"),a=document.getElementById("hero-output"),E=document.getElementById("hero-convert"),L=document.getElementById("hero-swap"),d=document.getElementById("hero-delimiter"),u=document.getElementById("hero-sha256");let s="json";function m(e){s=e,n.value=h[e]??"",a.innerHTML="",a.classList.remove("error"),r.querySelectorAll(".format-tab").forEach(t=>{t.classList.toggle("active",t.dataset.fmt===e)})}function p(e,t=!1){a.classList.toggle("error",t),t?a.textContent=e:a.innerHTML=e?w(e):""}async function o(){try{const e={ingrDelimiter:d.checked};let t=S(n.value,s,"ingr",e);if(u.checked){const N=new TextEncoder().encode(t),A=await crypto.subtle.digest("SHA-256",N),I=Array.from(new Uint8Array(A)).map(R=>R.toString(16).padStart(2,"0")).join("");t=t+`
# sha256:`+I}p(t)}catch(e){p(e instanceof Error?e.message:String(e),!0)}}r.innerHTML=C.map(e=>`<button class="format-tab${e===s?" active":""}" data-fmt="${e}">${B[e]}</button>`).join(""),r.addEventListener("click",e=>{const t=e.target.closest(".format-tab");t?.dataset.fmt&&(m(t.dataset.fmt),o())}),E.addEventListener("click",o),d.addEventListener("change",o),u.addEventListener("change",o),L.addEventListener("click",()=>{const e=a.textContent??"";!e||a.classList.contains("error")||(n.value=e,a.innerHTML="",a.classList.remove("error"),m("ingr"))}),n.value=h.json,o()}document.addEventListener("DOMContentLoaded",U);const l="https://raw.githubusercontent.com/ingitdb/ingitdb-cli/refs/heads/main/docs/file-formats/ingr.md",T={parser:`Implement an INGR file format parser in [YOUR LANGUAGE].

Specification: ${l}

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

Specification: ${l}

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

Specification: ${l}

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

Include usage examples for both parsing and building.`},g=document.getElementById("prompt-tabs"),f=document.getElementById("prompt-output"),i=document.getElementById("copy-prompt"),v=document.getElementById("lang-input");let b="parser";function c(){const r=v.value.trim()||"[YOUR LANGUAGE]";return T[b].replaceAll("[YOUR LANGUAGE]",r)}function y(r){b=r,f.textContent=c(),g.querySelectorAll(".format-tab").forEach(n=>n.classList.toggle("active",n.dataset.prompt===r))}g.addEventListener("click",r=>{const n=r.target.closest(".format-tab");n?.dataset.prompt&&y(n.dataset.prompt)});v.addEventListener("input",()=>{f.textContent=c()});i.addEventListener("click",async()=>{await navigator.clipboard.writeText(c());const r=i.innerHTML;i.innerHTML="<span>✓</span> Copied",setTimeout(()=>{i.innerHTML=r},1500)});y("parser");
