# Specification for ingr.io - static 2-Pages website for INGR file format

## Tech stack

- CSS Framework: Tailwind CSS
- No frameworks, just vanilla TypeScript and HTML

## Pages

- Home page: https://ingr.io/
- Converter: https://ingr.io/converter

## Home page

Represents [INGR file format specification](https://raw.githubusercontent.com/ingitdb/ingitdb-cli/refs/heads/main/docs/file-formats/ingr.md)

in a user-friendly, beautiful, and interactive way.

In the hero section there is a mini converter:

- Textarea on the left with sample JSON input
- Readonly textarea on the right with the converted INGR output
- "Convert" button in the middle to trigger the conversion
- "⇐ Swap ⇒" button underneath the "Convert" button to swap values of input and output fields
- On top of the input textarea tabs with supported input formats
  (JSON, JSONL, CSV, TSV, YAML, XML) to select the input format.
  Upon selection, the input field will be pre-filled with a sample content in the selected format.
- If the screen is small (mobile), the input and output textareas with buttons between them
  will be stacked vertically instead of being side by side.

## Converter

Has a single input field for the user to paste their INGR file content or their file content in other formats.

Users also can drop a file into the input field or select a file from their device using a file picker.

Upon submission, the website will auto-detect an input data format and set it into the input format" rop-down.

Then it will auto-decide the output format based on the input format and set it into "output format" drop-down.
The user can also manually change the output format if they want. That option will be preserved and respected for future
conversions until the user changes it again.

Converter parses the input and displays the converted output in the requested format.

The supported output formats:

- JSON
- JSONL
- CSV
- TSV
- YAML
- XML
- INGR (_INGR to INGR conversion is also supported for validation purposes_)
