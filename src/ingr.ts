export interface IngrFile {
  recordsetName: string
  columns: string[]      // raw column names including $ID
  records: Record<string, unknown>[]
}

export function parseIngr(text: string): IngrFile {
  const rawLines = text.split('\n')
  // strip trailing empty line (spec: no trailing newline)
  const lines = rawLines[rawLines.length - 1] === '' ? rawLines.slice(0, -1) : rawLines

  if (lines.length === 0) throw new Error('Empty file')

  // Header: # INGR.io | recordsetName: $ID, col2, col3
  const headerMatch = lines[0].match(/^#\s+INGR\.io\s+\|\s+(.+?):\s+(.+)$/)
  if (!headerMatch) throw new Error('Invalid INGR header. Expected: # INGR.io | name: $ID, col2, ...')

  const recordsetName = headerMatch[1].trim()
  const columns = headerMatch[2].split(',').map(c => c.trim())
  const n = columns.length

  // Find footer start: last "# N record(s)" line
  let footerStart = lines.length
  for (let i = lines.length - 1; i >= 1; i--) {
    if (/^#\s+\d+\s+records?$/.test(lines[i].trim())) {
      footerStart = i
      break
    }
  }

  // Collect data lines (skip delimiter # lines between records)
  const dataLines: string[] = []
  for (let i = 1; i < footerStart; i++) {
    const line = lines[i]
    if (line.startsWith('#')) continue  // delimiter
    dataLines.push(line)
  }

  if (dataLines.length % n !== 0) {
    throw new Error(
      `Data line count (${dataLines.length}) is not divisible by column count (${n}). ` +
      `Expected ${n} lines per record.`
    )
  }

  const records: Record<string, unknown>[] = []
  for (let i = 0; i < dataLines.length; i += n) {
    const record: Record<string, unknown> = {}
    for (let j = 0; j < n; j++) {
      const colName = columns[j].replace(/^\$/, '')
      const rawValue = dataLines[i + j].trim()
      try {
        record[colName] = JSON.parse(rawValue)
      } catch {
        throw new Error(
          `Invalid JSON value on line ${i + j + 2}: ${rawValue}`
        )
      }
    }
    records.push(record)
  }

  return { recordsetName, columns, records }
}

export function serializeIngr(data: IngrFile, delimiter = false): string {
  const { recordsetName, columns, records } = data
  const lines: string[] = []

  lines.push(`# INGR.io | ${recordsetName}: ${columns.join(', ')}`)

  for (let i = 0; i < records.length; i++) {
    for (const col of columns) {
      const key = col.replace(/^\$/, '')
      lines.push(JSON.stringify(records[i][key] ?? null))
    }
    if (delimiter && i < records.length - 1) lines.push('#')
  }

  const count = records.length
  lines.push(`# ${count} ${count === 1 ? 'record' : 'records'}`)

  return lines.join('\n')
}

// Build IngrFile from a plain array of objects, auto-inferring column names
export function fromObjects(
  records: Record<string, unknown>[],
  recordsetName = 'data'
): IngrFile {
  if (records.length === 0) {
    return { recordsetName, columns: ['$ID'], records: [] }
  }

  const allKeys = new Set<string>()
  for (const r of records) Object.keys(r).forEach(k => allKeys.add(k))

  const keys = Array.from(allKeys)

  // Determine $ID column: prefer 'id', 'ID', first key otherwise
  let idKey = keys.find(k => k.toLowerCase() === 'id') ?? keys[0]
  const otherKeys = keys.filter(k => k !== idKey)

  const columns = [`$${idKey}`, ...otherKeys]

  return { recordsetName, columns, records }
}
