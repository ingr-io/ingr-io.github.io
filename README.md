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
- If the screen is small (mobile), the input and output textareas with buttons between them
  will be stacked vertically instead of being side by side.

### Converter CTA section

A dedicated section on the home page promoting the Converter page. Includes a brief description
of what the converter does and a prominent call-to-action button/link to https://ingr.io/converter.

### Libraries section

A section listing official INGR parser/builder libraries for different programming languages.
Each entry shows the language name, package name, a short description, and a link to the GitHub repository.

The section uses a two-column layout: library cards stacked vertically on the left,
AI prompt block on the right.

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
