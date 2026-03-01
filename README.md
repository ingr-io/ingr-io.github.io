# INGR File Format Specification Website

This repository contains the source code for the static 2-pages website for the
[INGR file format specification](https://raw.githubusercontent.com/ingitdb/ingitdb-cli/refs/heads/main/docs/file-formats/ingr.md).

The website provides an interactive and user-friendly interface to understand the INGR file format,
as well as a converter tool to parse and convert between different data formats,
including JSON, JSONL, CSV, TSV, YAML, XML, and INGR.

## Project structure

- `index.html`: The main HTML file for the website.
- `src`: Contains the source code for the website.
- `dist`: Contains the built version of the website ready for deployment.
- `node_modules`: Contains dependencies installed by `pnpm`.
- `package.json`: Contains project metadata and dependencies.
- `README.md`: Contains project documentation.

## Tech stack

- CSS Framework: Tailwind CSS
- No frameworks, just vanilla TypeScript and HTML

## Pages

- Home page: https://ingr.io/
- Converter: https://ingr.io/converter

---

## Home page

A marketing page that presents the [INGR file format](https://github.com/ingr-io/ingr-file-format)
in a user-friendly, beautiful, and interactive way. The content is based on the
[INGR file format specification](https://raw.githubusercontent.com/ingitdb/ingitdb-cli/refs/heads/main/docs/file-formats/ingr.md)
and rendered as polished marketing sections rather than raw documentation — with headings, feature
highlights, syntax examples, and visual callouts. Links to https://github.com/ingr-io/ingr-file-format
are included where appropriate.

### Hero section

Contains a mini converter:

- Textarea on the left with sample JSON input
- Readonly textarea on the right with the converted INGR output
- "Convert" button in the middle to trigger the conversion; conversion also runs automatically when the input format tab is changed
- "⇐ Swap ⇒" button underneath the "Convert" button to swap values of input and output fields
- On top of the input textarea: tabs with supported input formats
  (JSON, JSONL, CSV, TSV, YAML, XML) to select the input format.
  Upon selection, the input field will be pre-filled with sample content in the selected format.
- In the INGR output header: a **"Record delimiters"** checkbox. When checked, a `#` line is inserted
  between each record in the INGR output, as permitted by the specification.
- In the INGR output header: a **"sha256"** checkbox. When checked, appends a `# sha256:<hash>` line to the output
  with the SHA256 hash of the converted output for integrity verification.
- **Syntax highlighting** — INGR output uses color coding:
  - Comments (lines starting with `#`) are displayed in bright accent color for visibility
  - String values are displayed in light green (`#90EE90`)
  - Numbers are displayed in accent color
  - Booleans are displayed in teal
  - Null values are displayed in muted color
  - Objects are displayed in purple
- **Responsive design** — On small screens (mobile), the input and output textareas with buttons between them
  will be stacked vertically. Buttons arrange horizontally with vertical arrows (⇓ and ⇑↓) instead of side-by-side
  horizontal layout.

### Format anatomy section

Explains the structure of an INGR file with an interactive two-column layout:

- **Always 2 columns, 50/50 split** — never collapses to single column regardless of screen size.
- **Left column**: HEADER, RECORDS, and FOOTER labels (styled inline badges) each followed by a short
  description. The three blocks are distributed vertically with `justify-content: space-between` so
  HEADER aligns with the first line of the code example and FOOTER aligns with the last line.
  On small screens, badges flow inline before their description text and wrap naturally.
- **Right column**: An annotated INGR code example. Horizontal scrolling is enabled if the content
  is wider than the column — text never wraps.
- **Hover interaction** — bidirectional highlighting:
  - Hovering a text block (HEADER / RECORDS / FOOTER) dims the other two and highlights the
    corresponding lines in the code example.
  - Hovering a section of the code example dims the other sections and highlights the
    corresponding text block on the left.
  - Comment lines (HEADER / FOOTER) brighten their foreground color on highlight for contrast.

### Converter CTA section

A dedicated section on the home page promoting the Converter page. Includes a brief description
of what the converter does and a prominent call-to-action button/link to https://ingr.io/converter.

### Libraries section

A section listing official INGR parser/builder libraries for different programming languages.
Each entry shows the language name, package name, a short description, and a link to the GitHub repository.

The section uses a two-column layout: library cards stacked vertically on the left,
AI prompt block on the right.

**Responsive design** — On small screens (max-width: 900px), the two-column layout
switches to a single-column layout with library cards stacked above the AI prompt block.

Current libraries:
- **Go** — [ingr-go](https://github.com/ingr-io/ingr-go)
- **JavaScript / TypeScript** — [ingr-js](https://github.com/ingr-io/ingr-js)
- **Python** — [ingr-py](https://github.com/ingr-io/ingr-py)
- **.NET / C#** — [ingr-dotnet](https://github.com/ingr-io/ingr-dotnet)

On the right, an **AI prompt block** allows users to generate a parser or builder
for any language using an AI model. It contains three tabs — **Parser**, **Builder**, and
**Parser + Builder** — each showing a ready-to-copy prompt. The prompts reference the
raw specification file at:
`https://raw.githubusercontent.com/ingitdb/ingitdb-cli/refs/heads/main/docs/file-formats/ingr.md`

A **Copy** button copies the active prompt to the clipboard.

---

## Converter page

### Layout

- Header: the website title/logo as a link back to the home page (https://ingr.io/).
- Footer: contains a "Home" navigation item linking to https://ingr.io/.

### Input

A single input textarea for the user to paste INGR content or content in any other supported format.

Users can also drop a file into the input area or select a file from their device using a file picker.

Supported file extensions: `.json`, `.yaml`, `.yml`, `.csv`, `.tsv`, `.ingr`.
There is no file size limit — files are processed entirely in the browser.
If the user drops or selects a file with an unsupported extension, display an error message listing
the supported file extensions.

On top of the input textarea: tabs for supported input formats (JSON, JSONL, CSV, TSV, YAML, XML, INGR)
to manually set the input format.

### Auto-detection

Upon submission the website attempts to auto-detect the input data format and sets it in the
input format tab/selector. If auto-detection fails, display a message in the output area:
_"Format not recognised. Please choose the input format manually using the tabs above the input area."_

### Output

A textarea displaying the converted result.

If the input format is INGR, the output area has tabs on top to select the desired output format:
JSON, JSONL, CSV, TSV, YAML, XML, Markdown table.
The selected tab controls which format the output is rendered in.
The selected output format preference is preserved for future conversions until the user changes it.

If the input format is not INGR, the output format is auto-decided based on the input:
- INGR → (use output format tabs as described above)
- Any other format → INGR

The user can manually change the output format at any time. That choice is preserved and respected
for future conversions until the user changes it again.

When the output format is INGR, a **"Record delimiters"** checkbox is shown in the output panel header.
When checked, a `#` line is inserted between each record in the INGR output, as permitted by the specification.
Toggling the checkbox immediately re-runs the conversion.

When the output format is INGR, a **"sha256"** checkbox is also shown in the output panel header.
When checked, appends a `# sha256:<hash>` line to the output with the SHA256 hash of the converted content
for integrity verification. Toggling the checkbox immediately re-runs the conversion.

Action buttons below the output textarea:
- **Copy** — copies the output text to the clipboard.
- **Download** — downloads the output as a file with the appropriate extension for the selected format.

### Error handling

If conversion fails, the error message is displayed inside the output textarea with red text.

### Supported output formats

- JSON
- JSONL
- CSV
- TSV
- YAML
- XML
- INGR (_INGR to INGR conversion is also supported for validation purposes_)
- Markdown table (available when input is INGR)

---

## Responsiveness & Mobile Design

The website is designed to work seamlessly on both large monitors and mobile devices. All pages use responsive layouts
that adapt to different screen sizes:

### Breakpoints

- **Large screens** (> 768px): Full side-by-side layouts with multi-column grids
- **Medium screens** (768px - 680px): Hybrid layouts with adjusted spacing and stacked sections
- **Small screens** (< 680px): Single-column layouts optimized for mobile devices

### Home Page Responsiveness

- **Hero converter section**: On small screens, the input textarea, buttons, and output textarea stack vertically.
  The control buttons arrange horizontally with vertical directional indicators (⇓ convert ⇑↓) instead of
  horizontal arrows, making better use of narrow screen widths.

- **"What it is" section**: On small screens (< 768px), the title "Structured data, line by line." moves from
  the left column to the top, with the descriptive text below, rather than the side-by-side layout on larger screens.

- **Libraries section**: On small screens (< 900px), the two-column layout (library cards left, AI prompts right)
  switches to a single-column stack. The AI prompt block appears below the library cards for better mobile navigation.

### Converter Page Responsiveness

- **Two-column input/output grid**: On small screens (< 680px), the side-by-side input/output layout becomes vertical.
  The control buttons between input and output arrange horizontally with vertical arrows instead of vertical arrangement.

- **Form controls**: All buttons, checkboxes, and tabs remain accessible and properly sized for touch interaction
  on mobile devices.

### Key Design Principles

1. **Touch-friendly**: All interactive elements (buttons, checkboxes, tabs) are sized appropriately for touch
   (minimum 44px height as per accessibility guidelines).
2. **Readable typography**: Font sizes adjust to maintain readability across all screen sizes.
3. **Efficient use of space**: Horizontal scrolling is minimized; content reflows to fit narrower viewports.
4. **Consistent experience**: Core functionality remains the same across all screen sizes—only layout and presentation adapt.
