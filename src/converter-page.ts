import './style.css'
import { convert, type Format, type ConvertOptions } from './converters'
import { highlightIngr } from './highlight'
import {
  detectFormat,
  extensionToFormat,
  SUPPORTED_EXTENSIONS,
  FORMAT_LABELS,
  INPUT_FORMATS,
  INGR_OUTPUT_FORMATS,
  autoOutputFormat,
} from './format-detect'

const OUTPUT_FORMAT_STORAGE_KEY = 'ingr-preferred-output-format'
const FORMAT_EXTENSIONS: Record<Format, string> = {
  ingr: '.ingr', json: '.json', jsonl: '.jsonl',
  csv: '.csv', tsv: '.tsv', yaml: '.yaml', xml: '.xml', markdown: '.md',
}

function init() {
  // Elements
  const inputArea    = document.getElementById('input-area')    as HTMLTextAreaElement
  const outputArea   = document.getElementById('output-area')   as HTMLPreElement
  const inputTabs    = document.getElementById('input-tabs')!
  const outputTabs   = document.getElementById('output-tabs')!
  const outputTabsWrapper  = document.getElementById('output-tabs-wrapper')!
  const outputTabsSpacer   = document.getElementById('output-tabs-spacer')!
  const convertBtn   = document.getElementById('convert-btn')!
  const clearBtn     = document.getElementById('clear-btn')!
  const copyBtn      = document.getElementById('copy-btn')!
  const downloadBtn  = document.getElementById('download-btn')!
  const detectStatus = document.getElementById('detect-status')!
  const outputLabel  = document.getElementById('output-format-label')!
  const outputStats  = document.getElementById('output-stats')!
  const dropZone        = document.getElementById('drop-zone')!
  const dropOverlay     = document.getElementById('drop-overlay')!
  const fileInput       = document.getElementById('file-input') as HTMLInputElement
  const delimiterLabel  = document.getElementById('delimiter-label')!
  const delimiterCheck  = document.getElementById('output-delimiter') as HTMLInputElement

  let inputFormat: Format | null = null
  let outputFormat: Format = (localStorage.getItem(OUTPUT_FORMAT_STORAGE_KEY) as Format) ?? 'ingr'
  let rawOutput = ''

  function setOutput(text: string, isError = false) {
    rawOutput = isError ? '' : text
    outputArea.classList.toggle('error', isError)
    if (isError) {
      outputArea.textContent = text
    } else if (text && effectiveOutputFormat() === 'ingr') {
      outputArea.innerHTML = highlightIngr(text)
    } else {
      outputArea.textContent = text
    }
  }

  // ── Build input tabs ──────────────────────────────────────────────────────

  function buildInputTabs() {
    inputTabs.innerHTML = INPUT_FORMATS.map(fmt =>
      `<button class="format-tab${fmt === inputFormat ? ' active' : ''}" data-fmt="${fmt}">${FORMAT_LABELS[fmt]}</button>`
    ).join('')
  }

  function buildOutputTabs() {
    // Output tabs only shown when input is INGR
    const show = inputFormat === 'ingr'
    outputTabsWrapper.style.display = show ? 'block' : 'none'
    outputTabsSpacer.style.display  = show ? 'none'  : 'block'

    if (show) {
      outputTabs.innerHTML = INGR_OUTPUT_FORMATS.map(fmt =>
        `<button class="format-tab${fmt === outputFormat ? ' active' : ''}" data-fmt="${fmt}">${FORMAT_LABELS[fmt]}</button>`
      ).join('')
    }
  }

  function setInputFormat(fmt: Format | null, runConvert = false) {
    inputFormat = fmt
    buildInputTabs()

    // If not INGR, auto-set output format
    if (fmt && fmt !== 'ingr') {
      const preferred = localStorage.getItem(OUTPUT_FORMAT_STORAGE_KEY) as Format | null
      outputFormat = preferred ?? autoOutputFormat(fmt)
    }
    buildOutputTabs()
    updateOutputLabel()
    updateDelimiterVisibility()
    if (runConvert) runConversion()
  }

  function setOutputFormat(fmt: Format) {
    outputFormat = fmt
    localStorage.setItem(OUTPUT_FORMAT_STORAGE_KEY, fmt)
    buildOutputTabs()
    updateOutputLabel()
    updateDelimiterVisibility()
    runConversion()
  }

  function effectiveOutputFormat(): Format {
    return inputFormat === 'ingr' ? outputFormat : 'ingr'
  }

  function updateDelimiterVisibility() {
    delimiterLabel.style.display = effectiveOutputFormat() === 'ingr' ? 'flex' : 'none'
  }

  function updateOutputLabel() {
    if (outputFormat) {
      outputLabel.textContent = `● ${FORMAT_LABELS[outputFormat] ?? outputFormat}`
    } else {
      outputLabel.textContent = ''
    }
  }

  // ── Conversion ───────────────────────────────────────────────────────────

  function runConversion() {
    const text = inputArea.value.trim()
    if (!text) { setOutput(''); outputStats.textContent = ''; return }

    // Resolve input format
    let from = inputFormat
    if (!from) {
      from = detectFormat(text)
      if (from) {
        setInputFormat(from)
        detectStatus.textContent = `Detected: ${FORMAT_LABELS[from]}`
      } else {
        setOutput('Format not recognised.\n\nPlease choose the input format manually using the tabs above the input area.', true)
        detectStatus.textContent = ''
        outputStats.textContent = ''
        return
      }
    }

    const to = (from === 'ingr' ? outputFormat : autoOutputFormat(from)) as Format

    try {
      const options: ConvertOptions = { ingrDelimiter: delimiterCheck.checked }
      const result = convert(text, from, to, options)
      setOutput(result)
      const lines = result.split('\n').length
      const bytes = new TextEncoder().encode(result).length
      outputStats.textContent = `${lines} lines · ${(bytes / 1024).toFixed(1)} KB`
      updateOutputLabel()
    } catch (e) {
      setOutput(e instanceof Error ? e.message : String(e), true)
      outputStats.textContent = ''
    }
  }

  // ── Tab events ────────────────────────────────────────────────────────────

  inputTabs.addEventListener('click', e => {
    const btn = (e.target as HTMLElement).closest('.format-tab') as HTMLElement | null
    if (btn?.dataset.fmt) {
      setInputFormat(btn.dataset.fmt as Format)
      detectStatus.textContent = ''
    }
  })

  outputTabs.addEventListener('click', e => {
    const btn = (e.target as HTMLElement).closest('.format-tab') as HTMLElement | null
    if (btn?.dataset.fmt) setOutputFormat(btn.dataset.fmt as Format)
  })

  // ── Convert / Clear ───────────────────────────────────────────────────────

  convertBtn.addEventListener('click', () => {
    detectStatus.textContent = ''
    runConversion()
  })

  clearBtn.addEventListener('click', () => {
    inputArea.value = ''
    setOutput('')
    inputFormat = null
    detectStatus.textContent = ''
    outputStats.textContent = ''
    buildInputTabs()
    buildOutputTabs()
    updateOutputLabel()
  })

  // ── Copy / Download ───────────────────────────────────────────────────────

  copyBtn.addEventListener('click', async () => {
    if (!rawOutput) return
    await navigator.clipboard.writeText(rawOutput)
    const orig = copyBtn.innerHTML
    copyBtn.innerHTML = '<span>✓</span> Copied'
    copyBtn.classList.add('flash-success')
    setTimeout(() => { copyBtn.innerHTML = orig; copyBtn.classList.remove('flash-success') }, 1500)
  })

  downloadBtn.addEventListener('click', () => {
    if (!rawOutput) return
    const ext = FORMAT_EXTENSIONS[outputFormat] ?? '.txt'
    const blob = new Blob([rawOutput], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `converted${ext}`
    a.click()
    URL.revokeObjectURL(url)
  })

  // ── File upload ───────────────────────────────────────────────────────────

  function handleFile(file: File) {
    const ext = file.name.split('.').pop() ?? ''
    const fmt = extensionToFormat(ext)

    if (!fmt) {
      setOutput(`Unsupported file type ".${ext}".\n\nSupported file extensions: ${SUPPORTED_EXTENSIONS.join(', ')}`, true)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      inputArea.value = reader.result as string
      setInputFormat(fmt)
      detectStatus.textContent = `Loaded: ${file.name}`
      runConversion()
    }
    reader.readAsText(file)
  }

  fileInput.addEventListener('change', () => {
    if (fileInput.files?.[0]) handleFile(fileInput.files[0])
    fileInput.value = ''
  })

  // ── Drag & drop ───────────────────────────────────────────────────────────

  dropZone.addEventListener('dragover', e => {
    e.preventDefault()
    dropZone.classList.add('drag-over')
    dropOverlay.style.display = 'flex'
  })

  dropZone.addEventListener('dragleave', e => {
    if (!dropZone.contains(e.relatedTarget as Node)) {
      dropZone.classList.remove('drag-over')
      dropOverlay.style.display = 'none'
    }
  })

  dropZone.addEventListener('drop', e => {
    e.preventDefault()
    dropZone.classList.remove('drag-over')
    dropOverlay.style.display = 'none'
    const file = e.dataTransfer?.files[0]
    if (file) handleFile(file)
  })

  // ── Init ──────────────────────────────────────────────────────────────────

  delimiterCheck.addEventListener('change', runConversion)

  buildInputTabs()
  buildOutputTabs()
  updateOutputLabel()
  updateDelimiterVisibility()
}

document.addEventListener('DOMContentLoaded', init)
