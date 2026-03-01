import{c as S,F as x,h as Y}from"./highlight-C66q8xoc.js";const P=["json","jsonl","csv","tsv","yaml","xml"],$={json:`[
  { "$id": "u1", "name": "Alice Chen", "role": "engineer", "active": true },
  { "$id": "u2", "name": "Bob Marsh",  "role": "designer", "active": true },
  { "$id": "u3", "name": "Carol Wu",   "role": "manager",  "active": false }
]`,jsonl:`{"$id":"u1","name":"Alice Chen","role":"engineer","active":true}
{"$id":"u2","name":"Bob Marsh","role":"designer","active":true}
{"$id":"u3","name":"Carol Wu","role":"manager","active":false}`,csv:`$id,name,role,active
u1,Alice Chen,engineer,true
u2,Bob Marsh,designer,true
u3,Carol Wu,manager,false`,tsv:`$id	name	role	active
u1	Alice Chen	engineer	true
u2	Bob Marsh	designer	true
u3	Carol Wu	manager	false`,yaml:`- $id: u1
  name: Alice Chen
  role: engineer
  active: true
- $id: u2
  name: Bob Marsh
  role: designer
  active: true
- $id: u3
  name: Carol Wu
  role: manager
  active: false`,xml:`<?xml version="1.0" encoding="UTF-8"?>
<users>
  <user><id>u1</id><name>Alice Chen</name><role>engineer</role><active>true</active></user>
  <user><id>u2</id><name>Bob Marsh</name><role>designer</role><active>true</active></user>
  <user><id>u3</id><name>Carol Wu</name><role>manager</role><active>false</active></user>
</users>`};function N(t){if(t===0)return"0 bytes";const a=Math.abs(t),i=a/(1024*1024),u=a/1024;if(a>=1024*1024){const r=Math.round(i*10)/10;return r===Math.floor(r)?`${Math.floor(r)}MB`:`${r}MB`}if(a>=1024){const r=Math.round(u*10)/10;return r===Math.floor(r)?`${Math.floor(r)}KB`:`${r}KB`}return`${Math.floor(a)} bytes`}function O(t,a){if(!t||!a)return 0;if(a==="ingr"){const i=t.match(/:\s*/);if(!i)return 0;const u=i.index+i[0].length,r=t.split(`
`);let l=-1;for(let o=r.length-1;o>0;o--)if(r[o].startsWith("#")){l=o;break}let d=t.length;if(l>0){const o=t.indexOf(r[l]);d=t.lastIndexOf(`
`,o)}return d-u}return t.length}function q(t,a,i){const u=document.getElementById("hero-size-info"),r=document.getElementById("hero-size-change");if(!a||!t){u.style.display="none";return}let l=a;if(i){const p=i.match(/:\s*/);if(p){const y=p.index+p[0].length,h=i.split(`
`);let g=-1;for(let s=h.length-1;s>0;s--)if(h[s].startsWith("#")){g=s;break}let b=i.length;if(g>0){const s=i.indexOf(h[g]);b=i.lastIndexOf(`
`,s)}l=b-y}}const d=l-t,o=Math.round(d/t*100),c=d<0?"var(--success)":"var(--error)",L=d<0?"Data size saved":"Data size increased";r.innerHTML=`<span style="color:${c};">${L} <strong>${Math.abs(o)}%</strong> (<span style="color:${c};">${N(Math.abs(d))}</span>)</span>`,u.style.display="block"}function _(){const t=document.getElementById("hero-left-panel"),a=document.getElementById("hero-right-panel"),i=document.getElementById("hero-left-title"),u=document.getElementById("hero-right-title"),r=document.getElementById("hero-tabs"),l=document.getElementById("hero-right-tabs"),d=document.getElementById("hero-ingr-controls"),o=document.getElementById("hero-input"),c=document.getElementById("hero-output"),L=document.getElementById("hero-convert"),p=document.getElementById("hero-swap"),y=document.getElementById("hero-delimiter"),h=document.getElementById("hero-sha256"),g=document.getElementById("hero-input-size"),b=document.getElementById("hero-output-size");let s="json",m=!1,w="";function A(){r.innerHTML=P.map(e=>`<button class="format-tab${e===s?" active":""}" data-fmt="${e}">${x[e]}</button>`).join("")}function F(){l.innerHTML=P.map(e=>`<button class="format-tab${e===s?" active":""}" data-fmt="${e}">${x[e]}</button>`).join("")}function C(e){e.querySelectorAll(".format-tab").forEach(n=>{n.classList.toggle("active",n.dataset.fmt===s)})}function v(){const e=m?"ingr":s,n=O(o.value,e);g.textContent=n>0?`(${N(n)})`:""}function R(e){const E=O(e,m?s:"ingr");b.textContent=E>0?`(${N(E)})`:""}function B(e,n=!1){c.classList.toggle("error",n),n?(c.textContent=e,b.textContent=""):m?(c.textContent=e,R(e)):(c.innerHTML=e?Y(e):"",R(e))}async function f(){try{if(m){const e=S(o.value,"ingr",s,{});B(e),document.getElementById("hero-size-info").style.display="none"}else{const e={ingrDelimiter:y.checked};let n=S(o.value,s,"ingr",e);if(h.checked){const E=new TextEncoder().encode(n),W=await crypto.subtle.digest("SHA-256",E),D=Array.from(new Uint8Array(W)).map(J=>J.toString(16).padStart(2,"0")).join("");n=n+`
# sha256:`+D}w=n,B(n),q(new TextEncoder().encode(o.value).length,new TextEncoder().encode(n).length,n)}}catch(e){B(e instanceof Error?e.message:String(e),!0)}}function H(e){m?(i.innerHTML='<b style="color:var(--text);">.INGR</b> input',u.innerHTML='<b style="color:var(--text);">Output</b>',r.style.display="none",l.style.display="",d.style.display="none",o.placeholder="Paste INGR data here…",c.dataset.placeholder="Converted output will appear here…",e&&(o.value=e),F()):(i.innerHTML='<b style="color:var(--text);">Input</b>',u.innerHTML='<b style="color:var(--text);">.INGR</b> output',r.style.display="",l.style.display="none",d.style.display="",o.placeholder="Paste your data here…",c.dataset.placeholder="Converted INGR will appear here…",o.value=$[s]??"",A()),c.innerHTML="",c.textContent="",v(),f()}p.addEventListener("click",async()=>{const e=m?void 0:w;t.classList.add("is-swapping"),a.classList.add("is-swapping"),await new Promise(n=>setTimeout(n,180)),m=!m,H(e),t.classList.remove("is-swapping"),a.classList.remove("is-swapping")}),r.addEventListener("click",e=>{const n=e.target.closest(".format-tab");n?.dataset.fmt&&(s=n.dataset.fmt,C(r),o.value=$[s]??"",v(),f())}),l.addEventListener("click",e=>{const n=e.target.closest(".format-tab");n?.dataset.fmt&&(s=n.dataset.fmt,C(l),f())}),L.addEventListener("click",f),y.addEventListener("change",f),h.addEventListener("change",f),o.addEventListener("input",()=>{v(),m&&f()}),A(),o.value=$.json,v(),f()}document.addEventListener("DOMContentLoaded",_);const M="https://raw.githubusercontent.com/ingitdb/ingitdb-cli/refs/heads/main/docs/file-formats/ingr.md",K={parser:`Implement an INGR file format parser in [YOUR LANGUAGE].

Specification: ${M}

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

Specification: ${M}

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

Specification: ${M}

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

Include usage examples for both parsing and building.`},k=document.getElementById("prompt-tabs"),U=document.getElementById("prompt-output"),I=document.getElementById("copy-prompt"),G=document.getElementById("lang-input");let z="parser";function T(){const t=G.value.trim()||"[YOUR LANGUAGE]";return K[z].replaceAll("[YOUR LANGUAGE]",t)}function j(t){z=t,U.textContent=T(),k.querySelectorAll(".format-tab").forEach(a=>a.classList.toggle("active",a.dataset.prompt===t))}k.addEventListener("click",t=>{const a=t.target.closest(".format-tab");a?.dataset.prompt&&j(a.dataset.prompt)});G.addEventListener("input",()=>{U.textContent=T()});I.addEventListener("click",async()=>{await navigator.clipboard.writeText(T());const t=I.innerHTML;I.innerHTML="<span>✓</span> Copied",setTimeout(()=>{I.innerHTML=t},1500)});j("parser");
