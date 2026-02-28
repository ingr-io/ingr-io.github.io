import{F as L,c as N,h as A}from"./highlight-aGWIcb49.js";const I=["json","jsonl","csv","tsv","yaml","xml"],p={json:`[
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
</users>`};function R(){const t=document.getElementById("hero-tabs"),r=document.getElementById("hero-input"),n=document.getElementById("hero-output"),E=document.getElementById("hero-convert"),y=document.getElementById("hero-swap"),d=document.getElementById("hero-delimiter");let s="json";function u(e){s=e,r.value=p[e]??"",n.innerHTML="",n.classList.remove("error"),t.querySelectorAll(".format-tab").forEach(a=>{a.classList.toggle("active",a.dataset.fmt===e)})}function m(e,a=!1){n.classList.toggle("error",a),a?n.textContent=e:n.innerHTML=e?A(e):""}function i(){try{const e={ingrDelimiter:d.checked};m(N(r.value,s,"ingr",e))}catch(e){m(e instanceof Error?e.message:String(e),!0)}}t.innerHTML=I.map(e=>`<button class="format-tab${e===s?" active":""}" data-fmt="${e}">${L[e]}</button>`).join(""),t.addEventListener("click",e=>{const a=e.target.closest(".format-tab");a?.dataset.fmt&&(u(a.dataset.fmt),i())}),E.addEventListener("click",i),d.addEventListener("change",i),y.addEventListener("click",()=>{const e=n.textContent??"";!e||n.classList.contains("error")||(r.value=e,n.innerHTML="",n.classList.remove("error"),u("ingr"))}),r.value=p.json,i()}document.addEventListener("DOMContentLoaded",R);const l="https://raw.githubusercontent.com/ingitdb/ingitdb-cli/refs/heads/main/docs/file-formats/ingr.md",B={parser:`Implement an INGR file format parser in [YOUR LANGUAGE].

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

Include usage examples for both parsing and building.`},g=document.getElementById("prompt-tabs"),h=document.getElementById("prompt-output"),o=document.getElementById("copy-prompt"),f=document.getElementById("lang-input");let v="parser";function c(){const t=f.value.trim()||"[YOUR LANGUAGE]";return B[v].replaceAll("[YOUR LANGUAGE]",t)}function b(t){v=t,h.textContent=c(),g.querySelectorAll(".format-tab").forEach(r=>r.classList.toggle("active",r.dataset.prompt===t))}g.addEventListener("click",t=>{const r=t.target.closest(".format-tab");r?.dataset.prompt&&b(r.dataset.prompt)});f.addEventListener("input",()=>{h.textContent=c()});o.addEventListener("click",async()=>{await navigator.clipboard.writeText(c());const t=o.innerHTML;o.innerHTML="<span>✓</span> Copied",setTimeout(()=>{o.innerHTML=t},1500)});b("parser");
