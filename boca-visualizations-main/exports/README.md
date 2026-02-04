# Exported Diagrams

This folder contains rendered image files (SVG and PNG) of all Mermaid diagrams from the documentation.

## SVG Files
All rendered diagrams: `exports/svg/`

SVG files are recommended for:
- High-quality scalable graphics
- Web browsers and presentations
- Editing in vector graphics software (Figma, Illustrator, etc.)

## PNG Files
Optional raster exports: `exports/png/`

PNG files use dark theme with transparent background and are useful for:
- Quick previews
- Embedding in documents where SVG isn't supported
- Social media or thumbnails

## Source Files
Original Mermaid code blocks extracted from Markdown: `exports/mmd/`

## Regenerating Exports

These were generated from Mermaid blocks in the repo docs using Mermaid CLI (`mmdc`).

To regenerate:

1. Install Mermaid CLI:
   ```bash
   npm install -g @mermaid-js/mermaid-cli
   ```

2. Run the export script:
   ```bash
   ./scripts/export_mermaid.sh
   ```

For more details, see [EXPORTING_DIAGRAMS.md](../docs/EXPORTING_DIAGRAMS.md).
