import './style.css'
import { convert, type Format, type ConvertOptions } from './converters'
import { FORMAT_LABELS } from './format-detect'
import { highlightIngr } from './highlight'

const INPUT_FORMATS: Format[] = ['json', 'jsonl', 'csv', 'tsv', 'yaml', 'xml']

const SAMPLES: Record<string, string> = {
  json: `[
  {
    "$id": "u1",
    "name": "Alice Chen",
    "role": "engineer",
    "active": true
  },
  {
    "$id": "u2",
    "name": "Bob Marsh",
    "role": "designer",
    "active": true
  },
  {
    "$id": "u3",
    "name": "Carol Wu",
    "role": "manager",
    "active": false
  }
]`,
  jsonl: `{"$id":"u1","name":"Alice Chen","role":"engineer","active":true}
{"$id":"u2","name":"Bob Marsh","role":"designer","active":true}
{"$id":"u3","name":"Carol Wu","role":"manager","active":false}`,
  csv: `$id,name,role,active
u1,Alice Chen,engineer,true
u2,Bob Marsh,designer,true
u3,Carol Wu,manager,false`,
  tsv: `$id\tname\trole\tactive
u1\tAlice Chen\tengineer\ttrue
u2\tBob Marsh\tdesigner\ttrue
u3\tCarol Wu\tmanager\tfalse`,
  yaml: `- $id: u1
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
    const colonMatch = text.match(/:\s*/)
    if (!colonMatch) return 0
    const afterColonPos = colonMatch.index! + colonMatch[0].length
    const lines = text.split('\n')
    let footerLineIndex = -1
    for (let i = lines.length - 1; i > 0; i--) {
      if (lines[i].startsWith('#')) { footerLineIndex = i; break }
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
  if (!outputSize || !inputSize) { sizeInfoEl.style.display = 'none'; return }
  let dataSizeForCalc = outputSize
  if (output) {
    const colonMatch = output.match(/:\s*/)
    if (colonMatch) {
      const afterColonPos = colonMatch.index! + colonMatch[0].length
      const lines = output.split('\n')
      let footerLineIndex = -1
      for (let i = lines.length - 1; i > 0; i--) {
        if (lines[i].startsWith('#')) { footerLineIndex = i; break }
      }
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
  sizeChangeEl.innerHTML = `<span style="color:${color};">${label} <strong>${Math.abs(percent)}%</strong> (<span style="color:${color};">${formatBytes(Math.abs(diff))}</span>)</span>`
  sizeInfoEl.style.display = 'block'
}

function init() {
  const leftPanelEl  = document.getElementById('hero-left-panel')!
  const rightPanelEl = document.getElementById('hero-right-panel')!
  const leftTitleEl  = document.getElementById('hero-left-title')!
  const rightTitleEl = document.getElementById('hero-right-title')!
  const leftTabsEl   = document.getElementById('hero-tabs')!
  const rightTabsEl  = document.getElementById('hero-right-tabs')!
  const ingrControlsEl = document.getElementById('hero-ingr-controls')!
  const inputEl      = document.getElementById('hero-input') as HTMLTextAreaElement
  const outputEl     = document.getElementById('hero-output') as HTMLPreElement
  const convertBtn   = document.getElementById('hero-convert')!
  const swapBtn      = document.getElementById('hero-swap')!
  const delimiterEl  = document.getElementById('hero-delimiter') as HTMLInputElement
  const sha256El     = document.getElementById('hero-sha256') as HTMLInputElement
  const inputSizeEl  = document.getElementById('hero-input-size')!
  const outputSizeEl = document.getElementById('hero-output-size')!

  // Single source of truth: selectedFormat tracks the non-INGR format
  let selectedFormat: Format = 'json'
  let isIngr = false // false = format→INGR (normal), true = INGR→format (swapped)
  let lastRawIngr = ''  // last raw INGR output text, used when swapping

  // ── Tab builders ──────────────────────────────────────────────────────────

  function buildLeftTabs() {
    leftTabsEl.innerHTML = INPUT_FORMATS.map(fmt =>
      `<button class="format-tab${fmt === selectedFormat ? ' active' : ''}" data-fmt="${fmt}">${FORMAT_LABELS[fmt]}</button>`
    ).join('')
  }

  function buildRightTabs() {
    rightTabsEl.innerHTML = INPUT_FORMATS.map(fmt =>
      `<button class="format-tab${fmt === selectedFormat ? ' active' : ''}" data-fmt="${fmt}">${FORMAT_LABELS[fmt]}</button>`
    ).join('')
  }

  function syncTabsActive(container: HTMLElement) {
    container.querySelectorAll('.format-tab').forEach(t => {
      (t as HTMLElement).classList.toggle('active', (t as HTMLElement).dataset.fmt === selectedFormat)
    })
  }

  // ── Size helpers ──────────────────────────────────────────────────────────

  function updateInputSize() {
    const fmt = isIngr ? 'ingr' : selectedFormat
    const size = getDataSize(inputEl.value, fmt as Format)
    inputSizeEl.textContent = size > 0 ? `(${formatBytes(size)})` : ''
  }

  function updateOutputSize(text: string) {
    const fmt = isIngr ? selectedFormat : 'ingr'
    const size = getDataSize(text, fmt as Format)
    outputSizeEl.textContent = size > 0 ? `(${formatBytes(size)})` : ''
  }

  // ── Output rendering ──────────────────────────────────────────────────────

  function setOutput(text: string, isError = false) {
    outputEl.classList.toggle('error', isError)
    if (isError) {
      outputEl.textContent = text
      outputSizeEl.textContent = ''
    } else if (!isIngr) {
      // Normal mode: INGR output with syntax highlighting
      outputEl.innerHTML = text ? highlightIngr(text) : ''
      updateOutputSize(text)
    } else {
      // Swapped mode: plain format text
      outputEl.textContent = text
      updateOutputSize(text)
    }
  }

  // ── Conversion ────────────────────────────────────────────────────────────

  async function runConvert() {
    try {
      if (!isIngr) {
        // format → INGR
        const options: ConvertOptions = { ingrDelimiter: delimiterEl.checked }
        let result = convert(inputEl.value, selectedFormat, 'ingr', options)
        if (sha256El.checked) {
          const data = new TextEncoder().encode(result)
          const hashBuffer = await crypto.subtle.digest('SHA-256', data)
          const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
          result = result + '\n# sha256:' + hashHex
        }
        lastRawIngr = result
        setOutput(result)
        updateSizeInfo(new TextEncoder().encode(inputEl.value).length, new TextEncoder().encode(result).length, result)
      } else {
        // INGR → format
        const result = convert(inputEl.value, 'ingr', selectedFormat, {})
        setOutput(result)
        document.getElementById('hero-size-info')!.style.display = 'none'
      }
    } catch (e) {
      setOutput(e instanceof Error ? e.message : String(e), true)
    }
  }

  // ── Panel state ───────────────────────────────────────────────────────────

  const INGR_TITLE = '<b style="color:var(--text);">.INGR</b>'

  function applyPanelState(ingrContent?: string) {
    if (!isIngr) {
      leftTitleEl.innerHTML  = '<b style="color:var(--text);">Input</b>'
      rightTitleEl.innerHTML = `${INGR_TITLE} output`
      leftTabsEl.style.display    = ''
      rightTabsEl.style.display   = 'none'
      ingrControlsEl.style.display = ''
      inputEl.placeholder = 'Paste your data here…'
      outputEl.dataset.placeholder = 'Converted INGR will appear here…'
      inputEl.value = SAMPLES[selectedFormat] ?? ''
      buildLeftTabs()
    } else {
      leftTitleEl.innerHTML  = `${INGR_TITLE} input`
      rightTitleEl.innerHTML = '<b style="color:var(--text);">Output</b>'
      leftTabsEl.style.display    = 'none'
      rightTabsEl.style.display   = ''
      ingrControlsEl.style.display = 'none'
      inputEl.placeholder = 'Paste INGR data here…'
      outputEl.dataset.placeholder = 'Converted output will appear here…'
      if (ingrContent) inputEl.value = ingrContent
      buildRightTabs()
    }
    outputEl.innerHTML = ''
    outputEl.textContent = ''
    updateInputSize()
    runConvert()
  }

  // ── Swap with animation ───────────────────────────────────────────────────

  swapBtn.addEventListener('click', async () => {
    const ingrContent = !isIngr ? lastRawIngr : undefined

    leftPanelEl.classList.add('is-swapping')
    rightPanelEl.classList.add('is-swapping')

    await new Promise(r => setTimeout(r, 180))

    isIngr = !isIngr
    applyPanelState(ingrContent)

    leftPanelEl.classList.remove('is-swapping')
    rightPanelEl.classList.remove('is-swapping')
  })

  // ── Event listeners ───────────────────────────────────────────────────────

  leftTabsEl.addEventListener('click', e => {
    const btn = (e.target as HTMLElement).closest('.format-tab') as HTMLElement | null
    if (!btn?.dataset.fmt) return
    selectedFormat = btn.dataset.fmt as Format
    syncTabsActive(leftTabsEl)
    inputEl.value = SAMPLES[selectedFormat] ?? ''
    updateInputSize()
    runConvert()
  })

  rightTabsEl.addEventListener('click', e => {
    const btn = (e.target as HTMLElement).closest('.format-tab') as HTMLElement | null
    if (!btn?.dataset.fmt) return
    selectedFormat = btn.dataset.fmt as Format
    syncTabsActive(rightTabsEl)
    runConvert()
  })

  convertBtn.addEventListener('click', runConvert)
  delimiterEl.addEventListener('change', runConvert)
  sha256El.addEventListener('change', runConvert)

  inputEl.addEventListener('input', () => {
    updateInputSize()
    if (isIngr) runConvert() // live update in swapped mode
  })

  // ── Init ──────────────────────────────────────────────────────────────────

  buildLeftTabs()
  inputEl.value = SAMPLES.json
  updateInputSize()
  runConvert()
}

document.addEventListener('DOMContentLoaded', init)
