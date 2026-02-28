import type { Format } from './converters'

export function detectFormat(text: string): Format | null {
  const t = text.trim()
  if (!t) return null

  // INGR header
  if (/^#\s+INGR\.io\s+\|/.test(t)) return 'ingr'

  // XML
  if (t.startsWith('<?xml') || /^<[a-zA-Z]/.test(t)) return 'xml'

  // JSON array or object
  if ((t.startsWith('[') && t.endsWith(']')) ||
      (t.startsWith('{') && t.endsWith('}'))) {
    try { JSON.parse(t); return 'json' } catch { /* fall through */ }
  }

  // JSONL: multiple lines each valid JSON objects
  const lines = t.split('\n').filter(Boolean)
  if (lines.length >= 2) {
    const allJsonObjects = lines.every(l => {
      try { const v = JSON.parse(l.trim()); return typeof v === 'object' && v !== null }
      catch { return false }
    })
    if (allJsonObjects) return 'jsonl'
  }
  // Single-line JSONL / JSON object
  if (lines.length === 1) {
    try {
      const v = JSON.parse(lines[0])
      if (typeof v === 'object') return 'json'
    } catch { /* fall through */ }
  }

  // YAML: starts with --- or has "- key:" pattern
  if (t.startsWith('---') || /^- \w+:/.test(t) || /^\w+:\s+/.test(t)) {
    return 'yaml'
  }

  // CSV: check if header + rows with consistent comma count
  const csvLines = t.split('\n').filter(Boolean).slice(0, 5)
  if (csvLines.length >= 2) {
    const commaCount = (csvLines[0].match(/,/g) ?? []).length
    if (commaCount > 0) {
      const consistent = csvLines.slice(1).every(l => {
        const c = (l.match(/,/g) ?? []).length
        return Math.abs(c - commaCount) <= 1
      })
      if (consistent) return 'csv'
    }
  }

  // TSV: similar but with tabs
  if (csvLines.length >= 2 && csvLines[0].includes('\t')) {
    return 'tsv'
  }

  return null
}

export function extensionToFormat(ext: string): Format | null {
  const map: Record<string, Format> = {
    json: 'json',
    jsonl: 'jsonl',
    ndjson: 'jsonl',
    csv: 'csv',
    tsv: 'tsv',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    ingr: 'ingr',
  }
  return map[ext.toLowerCase()] ?? null
}

export const SUPPORTED_EXTENSIONS = ['.json', '.jsonl', '.csv', '.tsv', '.yaml', '.yml', '.xml', '.ingr']

export const FORMAT_LABELS: Record<Format, string> = {
  ingr: 'INGR',
  json: 'JSON',
  jsonl: 'JSONL',
  csv: 'CSV',
  tsv: 'TSV',
  yaml: 'YAML',
  xml: 'XML',
  markdown: 'Markdown',
}

export const INPUT_FORMATS: Format[] = ['json', 'jsonl', 'csv', 'tsv', 'yaml', 'xml', 'ingr']
export const OUTPUT_FORMATS: Format[] = ['ingr', 'json', 'jsonl', 'csv', 'tsv', 'yaml', 'xml', 'markdown']
export const INGR_OUTPUT_FORMATS: Format[] = ['json', 'jsonl', 'csv', 'tsv', 'yaml', 'xml', 'markdown']

export function autoOutputFormat(input: Format): Format {
  return input === 'ingr' ? 'json' : 'ingr'
}
