import { parseIngr, serializeIngr, fromObjects, type IngrFile } from './ingr'

export type Format = 'ingr' | 'json' | 'jsonl' | 'csv' | 'tsv' | 'yaml' | 'xml' | 'markdown'

// ─── INGR ────────────────────────────────────────────────────────────────────

export function ingrToJson(text: string): string {
  const data = parseIngr(text)
  return JSON.stringify(data.records, null, 2)
}

export function ingrToJsonl(text: string): string {
  const data = parseIngr(text)
  return data.records.map(r => JSON.stringify(r)).join('\n')
}

export function ingrToCsv(text: string): string {
  const data = parseIngr(text)
  return recordsToCsv(data.records, ',')
}

export function ingrToTsv(text: string): string {
  const data = parseIngr(text)
  return recordsToCsv(data.records, '\t')
}

export function ingrToYaml(text: string): string {
  const data = parseIngr(text)
  return recordsToYaml(data.records)
}

export function ingrToXml(text: string): string {
  const data = parseIngr(text)
  return recordsToXml(data.records, data.recordsetName)
}

export function ingrToMarkdown(text: string): string {
  const data = parseIngr(text)
  return recordsToMarkdown(data.records)
}

// ─── TO INGR ─────────────────────────────────────────────────────────────────

export function jsonToIngr(text: string): string {
  const parsed = JSON.parse(text)
  const arr = Array.isArray(parsed) ? parsed : [parsed]
  return serializeIngr(fromObjects(arr))
}

export function jsonlToIngr(text: string): string {
  const arr = text.trim().split('\n').filter(Boolean).map(l => JSON.parse(l))
  return serializeIngr(fromObjects(arr))
}

export function csvToIngr(text: string): string {
  const records = parseCsv(text, ',')
  return serializeIngr(fromObjects(records))
}

export function tsvToIngr(text: string): string {
  const records = parseCsv(text, '\t')
  return serializeIngr(fromObjects(records))
}

export function yamlToIngr(text: string): string {
  const records = parseYaml(text)
  return serializeIngr(fromObjects(records))
}

export function xmlToIngr(text: string): string {
  const records = parseXml(text)
  return serializeIngr(fromObjects(records))
}

// ─── Universal convert ───────────────────────────────────────────────────────

export interface ConvertOptions {
  ingrDelimiter?: boolean
}

export function convert(text: string, from: Format, to: Format, options?: ConvertOptions): string {
  const delimiter = options?.ingrDelimiter ?? false

  if (from === to) {
    if (from === 'ingr') {
      return serializeIngr(parseIngr(text), delimiter)
    }
    return text
  }

  // Convert to intermediate (records array)
  let ingr: IngrFile
  if (from === 'ingr') {
    ingr = parseIngr(text)
  } else {
    // Convert to INGR first, then parse
    const ingrText = toIngrText(text, from)
    ingr = parseIngr(ingrText)
  }

  // Serialize to target
  switch (to) {
    case 'ingr':     return serializeIngr(ingr, delimiter)
    case 'json':     return JSON.stringify(ingr.records, null, 2)
    case 'jsonl':    return ingr.records.map(r => JSON.stringify(r)).join('\n')
    case 'csv':      return recordsToCsv(ingr.records, ',')
    case 'tsv':      return recordsToCsv(ingr.records, '\t')
    case 'yaml':     return recordsToYaml(ingr.records)
    case 'xml':      return recordsToXml(ingr.records, ingr.recordsetName)
    case 'markdown': return recordsToMarkdown(ingr.records)
  }
}

function toIngrText(text: string, from: Format): string {
  switch (from) {
    case 'json':  return jsonToIngr(text)
    case 'jsonl': return jsonlToIngr(text)
    case 'csv':   return csvToIngr(text)
    case 'tsv':   return tsvToIngr(text)
    case 'yaml':  return yamlToIngr(text)
    case 'xml':   return xmlToIngr(text)
    default: throw new Error(`Cannot convert from ${from} to INGR`)
  }
}

// ─── CSV / TSV ───────────────────────────────────────────────────────────────

function parseCsv(text: string, sep: string): Record<string, unknown>[] {
  const lines = text.trim().split('\n').filter(Boolean)
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row')

  const headers = splitCsvLine(lines[0], sep)
  const records: Record<string, unknown>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvLine(lines[i], sep)
    const record: Record<string, unknown> = {}
    for (let j = 0; j < headers.length; j++) {
      const raw = values[j] ?? ''
      record[headers[j]] = inferType(raw)
    }
    records.push(record)
  }

  return records
}

function splitCsvLine(line: string, sep: string): string[] {
  const results: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (ch === sep && !inQuotes) {
      results.push(current); current = ''
    } else {
      current += ch
    }
  }
  results.push(current)
  return results
}

function inferType(val: string): unknown {
  if (val === '' || val.toLowerCase() === 'null') return null
  if (val.toLowerCase() === 'true') return true
  if (val.toLowerCase() === 'false') return false
  const num = Number(val)
  if (!isNaN(num) && val.trim() !== '') return num
  return val
}

function recordsToCsv(records: Record<string, unknown>[], sep: string): string {
  if (records.length === 0) return ''
  const keys = Object.keys(records[0])
  const escSep = sep === ',' ? (v: string) => v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v.replace(/"/g, '""')}"` : v
                             : (v: string) => v
  const rows = [
    keys.map(escSep).join(sep),
    ...records.map(r => keys.map(k => {
      const v = r[k]
      const s = v === null || v === undefined ? '' : String(v)
      return escSep(s)
    }).join(sep))
  ]
  return rows.join('\n')
}

// ─── YAML ────────────────────────────────────────────────────────────────────

function parseYaml(text: string): Record<string, unknown>[] {
  const lines = text.split('\n')
  const records: Record<string, unknown>[] = []
  let current: Record<string, unknown> | null = null

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (line.trim() === '' || line.trim() === '---') continue

    if (/^- /.test(line)) {
      // New list item
      if (current !== null) records.push(current)
      current = {}
      const rest = line.replace(/^- /, '')
      if (rest.trim()) {
        const kv = parseYamlKv(rest)
        if (kv && current) current[kv[0]] = kv[1]
      }
    } else if (/^\s+/.test(line) && current !== null) {
      const kv = parseYamlKv(line.trim())
      if (kv) current[kv[0]] = kv[1]
    }
  }
  if (current !== null) records.push(current)
  return records
}

function parseYamlKv(line: string): [string, unknown] | null {
  const idx = line.indexOf(':')
  if (idx === -1) return null
  const key = line.slice(0, idx).trim()
  const rawVal = line.slice(idx + 1).trim()
  return [key, parseYamlValue(rawVal)]
}

function parseYamlValue(raw: string): unknown {
  if (raw === '' || raw === 'null' || raw === '~') return null
  if (raw === 'true') return true
  if (raw === 'false') return false
  if ((raw.startsWith("'") && raw.endsWith("'")) ||
      (raw.startsWith('"') && raw.endsWith('"'))) {
    return raw.slice(1, -1)
  }
  const num = Number(raw)
  if (!isNaN(num) && raw !== '') return num
  return raw
}

function recordsToYaml(records: Record<string, unknown>[]): string {
  return records.map(r => {
    const keys = Object.keys(r)
    return '- ' + keys.map((k, i) => {
      const v = r[k]
      const line = `${k}: ${yamlScalar(v)}`
      return i === 0 ? line : '  ' + line
    }).join('\n')
  }).join('\n')
}

function yamlScalar(v: unknown): string {
  if (v === null || v === undefined) return 'null'
  if (typeof v === 'boolean') return String(v)
  if (typeof v === 'number') return String(v)
  if (typeof v === 'string') {
    if (/[:#\[\]{},&*!|>'"@`]/.test(v) || v.includes('\n') || v === '')
      return `"${v.replace(/"/g, '\\"')}"`
    return v
  }
  return `"${JSON.stringify(v).replace(/"/g, '\\"')}"`
}

// ─── XML ─────────────────────────────────────────────────────────────────────

function parseXml(text: string): Record<string, unknown>[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/xml')
  const parseError = doc.querySelector('parsererror')
  if (parseError) throw new Error('Invalid XML: ' + parseError.textContent)

  const root = doc.documentElement
  const records: Record<string, unknown>[] = []

  // Try common patterns: <root><item>...</item></root>
  const children = Array.from(root.children)
  for (const child of children) {
    const record: Record<string, unknown> = {}
    if (child.children.length > 0) {
      // nested elements as fields
      for (const field of Array.from(child.children)) {
        record[field.tagName] = inferType(field.textContent ?? '')
      }
    } else {
      // attributes as fields
      for (const attr of Array.from(child.attributes)) {
        record[attr.name] = inferType(attr.value)
      }
      if (child.textContent?.trim()) {
        record['value'] = child.textContent.trim()
      }
    }
    records.push(record)
  }
  return records
}

function recordsToXml(records: Record<string, unknown>[], name: string): string {
  const tag = name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '')
  const singular = tag.endsWith('s') ? tag.slice(0, -1) : 'record'

  const lines: string[] = [`<?xml version="1.0" encoding="UTF-8"?>`, `<${tag}>`]
  for (const r of records) {
    lines.push(`  <${singular}>`)
    for (const [k, v] of Object.entries(r)) {
      const safeKey = k.replace(/[^a-zA-Z0-9_-]/g, '_')
      const val = v === null || v === undefined ? '' : xmlEscape(String(v))
      lines.push(`    <${safeKey}>${val}</${safeKey}>`)
    }
    lines.push(`  </${singular}>`)
  }
  lines.push(`</${tag}>`)
  return lines.join('\n')
}

function xmlEscape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

// ─── Markdown table ───────────────────────────────────────────────────────────

function recordsToMarkdown(records: Record<string, unknown>[]): string {
  if (records.length === 0) return ''
  const keys = Object.keys(records[0])
  const widths = keys.map(k => Math.max(k.length, ...records.map(r => String(r[k] ?? '').length)))

  const pad = (s: string, w: number) => s.padEnd(w)
  const header = '| ' + keys.map((k, i) => pad(k, widths[i])).join(' | ') + ' |'
  const sep    = '| ' + widths.map(w => '-'.repeat(w)).join(' | ') + ' |'
  const rows   = records.map(r =>
    '| ' + keys.map((k, i) => pad(String(r[k] ?? ''), widths[i])).join(' | ') + ' |'
  )

  return [header, sep, ...rows].join('\n')
}
