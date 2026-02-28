import './style.css'
import { convert, type Format, type ConvertOptions } from './converters'
import { FORMAT_LABELS } from './format-detect'
import { highlightIngr } from './highlight'

const INPUT_FORMATS: Format[] = ['json', 'jsonl', 'csv', 'tsv', 'yaml', 'xml']

const SAMPLES: Record<string, string> = {
  json: `[
  { "id": "u1", "name": "Alice Chen", "role": "engineer", "active": true },
  { "id": "u2", "name": "Bob Marsh",  "role": "designer", "active": true },
  { "id": "u3", "name": "Carol Wu",   "role": "manager",  "active": false }
]`,
  jsonl: `{"id":"u1","name":"Alice Chen","role":"engineer","active":true}
{"id":"u2","name":"Bob Marsh","role":"designer","active":true}
{"id":"u3","name":"Carol Wu","role":"manager","active":false}`,
  csv: `id,name,role,active
u1,Alice Chen,engineer,true
u2,Bob Marsh,designer,true
u3,Carol Wu,manager,false`,
  tsv: `id\tname\trole\tactive
u1\tAlice Chen\tengineer\ttrue
u2\tBob Marsh\tdesigner\ttrue
u3\tCarol Wu\tmanager\tfalse`,
  yaml: `- id: u1
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
  active: false`,
  xml: `<?xml version="1.0" encoding="UTF-8"?>
<users>
  <user><id>u1</id><name>Alice Chen</name><role>engineer</role><active>true</active></user>
  <user><id>u2</id><name>Bob Marsh</name><role>designer</role><active>true</active></user>
  <user><id>u3</id><name>Carol Wu</name><role>manager</role><active>false</active></user>
</users>`,
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 bytes'
  const absBytes = Math.abs(bytes)
  
  const mb = absBytes / (1024 * 1024)
  const kb = absBytes / 1024
  
  if (absBytes >= 1024 * 1024) {
    const rounded = Math.round(mb * 10) / 10
    return rounded === Math.floor(rounded) ? `${Math.floor(rounded)}MB` : `${rounded}MB`
  }
  if (absBytes >= 1024) {
    const rounded = Math.round(kb * 10) / 10
    return rounded === Math.floor(rounded) ? `${Math.floor(rounded)}KB` : `${rounded}KB`
  }
  return `${Math.floor(absBytes)} bytes`
}

function getDataSize(text: string, format: Format | null): number {
  if (!text || !format) return 0
  
  if (format === 'ingr') {
    // Calculate data size excluding header before colon and footer
    const colonMatch = text.match(/:\s*/)
    if (!colonMatch) return 0
    const afterColonPos = colonMatch.index! + colonMatch[0].length
    
    const lines = text.split('\n')
    let footerLineIndex = -1
    for (let i = lines.length - 1; i > 0; i--) {
      if (lines[i].startsWith('#')) {
        footerLineIndex = i
        break
      }
    }
    
    let beforeFooterPos = text.length
    if (footerLineIndex > 0) {
      const footerLinePos = text.indexOf(lines[footerLineIndex])
      beforeFooterPos = text.lastIndexOf('\n', footerLinePos)
    }
    
    return beforeFooterPos - afterColonPos
  }
  
  return text.length
}

function updateSizeInfo(inputSize: number, outputSize: number, output?: string) {
  const sizeInfoEl = document.getElementById('hero-size-info')!
  const sizeChangeEl = document.getElementById('hero-size-change')!
  
  if (!outputSize || !inputSize) {
    sizeInfoEl.style.display = 'none'
    return
  }
  
  // For INGR format, exclude header before colon and footer from size calculation
  let dataSizeForCalc = outputSize
  if (output) {
    // Find position after colon and trailing whitespace
    const colonMatch = output.match(/:\s*/)
    if (colonMatch) {
      const afterColonPos = colonMatch.index! + colonMatch[0].length
      
      // Find footer line (first line from end starting with '#', skip header line 0)
      const lines = output.split('\n')
      let footerLineIndex = -1
      for (let i = lines.length - 1; i > 0; i--) {
        if (lines[i].startsWith('#')) {
          footerLineIndex = i
          break
        }
      }
      
      // Position of newline before footer line (or end if no footer)
      let beforeFooterPos = output.length
      if (footerLineIndex > 0) {
        const footerLinePos = output.indexOf(lines[footerLineIndex])
        beforeFooterPos = output.lastIndexOf('\n', footerLinePos)
      }
      
      dataSizeForCalc = beforeFooterPos - afterColonPos
    }
  }
  
  const diff = dataSizeForCalc - inputSize
  const percent = Math.round((diff / inputSize) * 100)
  const color = diff < 0 ? 'var(--success)' : 'var(--error)'
  const label = diff < 0 ? 'Data size saved' : 'Data size increased'
  
  sizeChangeEl.innerHTML = `
    <span style="color:${color};">${label} <strong>${Math.abs(percent)}%</strong> (<span style="color:${color};">${formatBytes(Math.abs(diff))}</span>)</span>
  `
  sizeInfoEl.style.display = 'block'
}

function init() {
  const tabsEl = document.getElementById('hero-tabs')!
  const inputEl = document.getElementById('hero-input') as HTMLTextAreaElement
  const outputEl = document.getElementById('hero-output') as HTMLPreElement
  const convertBtn = document.getElementById('hero-convert')!
  const swapBtn = document.getElementById('hero-swap')!
  const delimiterEl = document.getElementById('hero-delimiter') as HTMLInputElement
  const sha256El = document.getElementById('hero-sha256') as HTMLInputElement
  const inputSizeEl = document.getElementById('hero-input-size')!
  const outputSizeEl = document.getElementById('hero-output-size')!

  let currentFormat: Format = 'json'

  function setFormat(fmt: Format) {
    currentFormat = fmt
    inputEl.value = SAMPLES[fmt] ?? ''
    outputEl.innerHTML = ''
    outputEl.classList.remove('error')
    // Update tab UI
    tabsEl.querySelectorAll('.format-tab').forEach(t => {
      t.classList.toggle('active', (t as HTMLElement).dataset.fmt === fmt)
    })
    updateInputSize()
  }

  function updateInputSize() {
    const size = getDataSize(inputEl.value, currentFormat)
    inputSizeEl.textContent = size > 0 ? `(${formatBytes(size)})` : ''
  }

  function updateOutputSize(text: string) {
    const size = getDataSize(text, 'ingr')
    outputSizeEl.textContent = size > 0 ? `(${formatBytes(size)})` : ''
  }

  function setOutput(text: string, isError = false) {
    outputEl.classList.toggle('error', isError)
    if (isError) {
      outputEl.textContent = text
    } else {
      outputEl.innerHTML = text ? highlightIngr(text) : ''
    }
  }

  async function runConvert() {
    try {
      const options: ConvertOptions = { ingrDelimiter: delimiterEl.checked }
      let result = convert(inputEl.value, currentFormat, 'ingr', options)
      
      if (sha256El.checked) {
        const encoder = new TextEncoder()
        const data = encoder.encode(result)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        result = result + '\n# sha256:' + hashHex
      }
      
      setOutput(result)
      updateSizeInfo(new TextEncoder().encode(inputEl.value).length, new TextEncoder().encode(result).length, result)
      updateOutputSize(result)
    } catch (e) {
      setOutput(e instanceof Error ? e.message : String(e), true)
    }
  }

  // Build tabs
  tabsEl.innerHTML = INPUT_FORMATS.map(fmt =>
    `<button class="format-tab${fmt === currentFormat ? ' active' : ''}" data-fmt="${fmt}">${FORMAT_LABELS[fmt]}</button>`
  ).join('')

  tabsEl.addEventListener('click', e => {
    const btn = (e.target as HTMLElement).closest('.format-tab') as HTMLElement | null
    if (btn?.dataset.fmt) { setFormat(btn.dataset.fmt as Format); runConvert() }
  })

  convertBtn.addEventListener('click', runConvert)
  delimiterEl.addEventListener('change', runConvert)
  sha256El.addEventListener('change', runConvert)
  inputEl.addEventListener('input', updateInputSize)

  swapBtn.addEventListener('click', () => {
    const outVal = outputEl.textContent ?? ''
    if (!outVal || outputEl.classList.contains('error')) return
    inputEl.value = outVal
    outputEl.innerHTML = ''
    outputEl.classList.remove('error')
    setFormat('ingr' as Format)
  })

  // Initial state
  inputEl.value = SAMPLES.json
  updateInputSize()
  // Auto-run on load
  runConvert()
}

document.addEventListener('DOMContentLoaded', init)
