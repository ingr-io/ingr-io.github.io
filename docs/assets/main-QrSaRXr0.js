import{F as R,c as w,h as $}from"./highlight-CDUcPZ9v.js";const T=["json","jsonl","csv","tsv","yaml","xml"],v={json:`[
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
</users>`};function m(t){if(t===0)return"0 bytes";const n=Math.abs(t),r=[],i=Math.floor(n/(1024*1024)),o=Math.floor(n%(1024*1024)/1024),s=Math.floor(n%1024);return i>0&&r.push(`${i}MB`),o>0&&r.push(`${o}KB`),s>0&&r.push(`${s}bytes`),r.join(" ")}function C(t,n){const r=document.getElementById("hero-size-info"),i=document.getElementById("hero-size-change");if(!n||!t){r.style.display="none";return}const o=n-t,s=Math.round(o/t*100),c=o<0?"var(--success)":"var(--error)",l=o<0?"Size saving":"Size increase";i.innerHTML=`
    <span style="color:${c};">${l} <strong>${Math.abs(s)}%</strong></span>
    <span style="color:var(--text-muted);">
      (<span style="color:${c};">${m(Math.abs(o))}</span>, 
      ${m(t)} → ${m(n)})
    </span>
  `,r.style.display="block"}function S(){const t=document.getElementById("hero-tabs"),n=document.getElementById("hero-input"),r=document.getElementById("hero-output"),i=document.getElementById("hero-convert"),o=document.getElementById("hero-swap"),s=document.getElementById("hero-delimiter"),c=document.getElementById("hero-sha256");let l="json";function g(e){l=e,n.value=v[e]??"",r.innerHTML="",r.classList.remove("error"),t.querySelectorAll(".format-tab").forEach(a=>{a.classList.toggle("active",a.dataset.fmt===e)})}function f(e,a=!1){r.classList.toggle("error",a),a?r.textContent=e:r.innerHTML=e?$(e):""}async function d(){try{const e={ingrDelimiter:s.checked};let a=w(n.value,l,"ingr",e);if(c.checked){const A=new TextEncoder().encode(a),I=await crypto.subtle.digest("SHA-256",A),B=Array.from(new Uint8Array(I)).map(M=>M.toString(16).padStart(2,"0")).join("");a=a+`
# sha256:`+B}f(a),C(new TextEncoder().encode(n.value).length,new TextEncoder().encode(a).length)}catch(e){f(e instanceof Error?e.message:String(e),!0)}}t.innerHTML=T.map(e=>`<button class="format-tab${e===l?" active":""}" data-fmt="${e}">${R[e]}</button>`).join(""),t.addEventListener("click",e=>{const a=e.target.closest(".format-tab");a?.dataset.fmt&&(g(a.dataset.fmt),d())}),i.addEventListener("click",d),s.addEventListener("change",d),c.addEventListener("change",d),o.addEventListener("click",()=>{const e=r.textContent??"";!e||r.classList.contains("error")||(n.value=e,r.innerHTML="",r.classList.remove("error"),g("ingr"))}),n.value=v.json,d()}document.addEventListener("DOMContentLoaded",S);const h="https://raw.githubusercontent.com/ingitdb/ingitdb-cli/refs/heads/main/docs/file-formats/ingr.md",x={parser:`Implement an INGR file format parser in [YOUR LANGUAGE].

Specification: ${h}

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

Specification: ${h}

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

Specification: ${h}

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

Include usage examples for both parsing and building.`},b=document.getElementById("prompt-tabs"),y=document.getElementById("prompt-output"),u=document.getElementById("copy-prompt"),E=document.getElementById("lang-input");let L="parser";function p(){const t=E.value.trim()||"[YOUR LANGUAGE]";return x[L].replaceAll("[YOUR LANGUAGE]",t)}function N(t){L=t,y.textContent=p(),b.querySelectorAll(".format-tab").forEach(n=>n.classList.toggle("active",n.dataset.prompt===t))}b.addEventListener("click",t=>{const n=t.target.closest(".format-tab");n?.dataset.prompt&&N(n.dataset.prompt)});E.addEventListener("input",()=>{y.textContent=p()});u.addEventListener("click",async()=>{await navigator.clipboard.writeText(p());const t=u.innerHTML;u.innerHTML="<span>✓</span> Copied",setTimeout(()=>{u.innerHTML=t},1500)});N("parser");
