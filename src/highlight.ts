function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function highlightIngr(text: string): string {
  if (!text) return ''
  return text.split('\n').map(line => {
    const esc = escHtml(line)
    if (line.startsWith('#')) return `<span class="hl-meta">${esc}</span>`
    try {
      const val = JSON.parse(line.trim())
      if (val === null)            return `<span class="hl-null">${esc}</span>`
      if (typeof val === 'boolean') return `<span class="hl-bool">${esc}</span>`
      if (typeof val === 'number')  return `<span class="hl-number">${esc}</span>`
      if (typeof val === 'string')  return `<span class="hl-string">${esc}</span>`
      // object or array
      return `<span class="hl-object">${esc}</span>`
    } catch {
      return esc
    }
  }).join('\n')
}
