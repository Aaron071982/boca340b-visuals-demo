# Exporting Mermaid Diagrams

This guide explains how to export Mermaid diagrams from Markdown files into standalone image files (SVG/PNG).

---

## Prerequisites

You need Node.js installed.

**Check if installed:**
```bash
node -v
npm -v
```

**Install Mermaid CLI globally:**
```bash
npm install -g @mermaid-js/mermaid-cli
mmdc --version
```

---

## Quick Start

Run the export script from the repository root:

```bash
./scripts/export_mermaid.sh
```

This will:
1. Extract all Mermaid blocks from `.md` files
2. Save them as `.mmd` files in `exports/mmd/`
3. Render SVG files to `exports/svg/`
4. Render PNG files to `exports/png/`

**Skip PNG generation (SVG only):**
```bash
./scripts/export_mermaid.sh no
```

---

## Manual Export Process

If you prefer to run the steps manually:

### 1. Create export folders
```bash
mkdir -p exports/mmd exports/svg exports/png
```

### 2. Extract Mermaid blocks from Markdown
```bash
find . -name "*.md" -not -path "./node_modules/*" -not -path "./exports/*" -print0 | while IFS= read -r -d '' file; do
  base="$(echo "$file" | sed 's|^\./||' | tr '/ ' '__')"
  awk -v base="$base" '
    BEGIN { in=0; n=0; buf="" }
    /^```mermaid[[:space:]]*$/ { in=1; n++; buf=""; next }
    /^```[[:space:]]*$/ && in==1 {
      in=0
      out=sprintf("exports/mmd/%s_%02d.mmd", base, n)
      print buf > out
      close(out)
      next
    }
    in==1 { buf = buf $0 "\n" }
  ' "$file"
done
```

### 3. Render SVG files
```bash
for f in exports/mmd/*.mmd; do
  out="exports/svg/$(basename "${f%.mmd}.svg")"
  mmdc -i "$f" -o "$out"
done
```

### 4. (Optional) Render PNG files
```bash
for f in exports/mmd/*.mmd; do
  out="exports/png/$(basename "${f%.mmd}.png")"
  mmdc -i "$f" -o "$out" -t dark -b transparent
done
```

---

## Output Structure

After running the export:

```
exports/
├── mmd/          # Extracted Mermaid code blocks (.mmd files)
├── svg/          # Rendered SVG files
├── png/          # Rendered PNG files (optional)
└── README.md     # This documentation
```

**File naming convention:**
- Source: `architecture/overview.md`
- Extracted: `exports/mmd/architecture__overview.md_01.mmd`
- SVG: `exports/svg/architecture__overview.md_01.svg`
- PNG: `exports/png/architecture__overview.md_01.png`

---

## Using Exported Files

### SVG Files
- **Best for**: Presentations, documentation, web pages
- **Editable in**: Figma, Illustrator, Inkscape
- **Scalable**: Perfect at any size

### PNG Files
- **Best for**: Quick previews, documents that don't support SVG
- **Format**: Dark theme with transparent background
- **Resolution**: High quality raster images

---

## Troubleshooting

### "mmdc: command not found"
Install Mermaid CLI:
```bash
npm install -g @mermaid-js/mermaid-cli
```

### "No Mermaid diagrams found"
- Check that your Markdown files use ` ```mermaid ` code blocks (not ` ``` mermaid `)
- Ensure files are in the repository and not excluded by `.gitignore`

### Rendering errors
- Check that Mermaid syntax in source files is valid
- Try rendering a single `.mmd` file manually:
  ```bash
  mmdc -i exports/mmd/example.mmd -o test.svg
  ```

---

## Automation

The export script (`scripts/export_mermaid.sh`) is safe and read-only (only writes to `exports/` folder). It:
- ✅ Extracts all Mermaid blocks automatically
- ✅ Handles multiple diagrams per file
- ✅ Preserves diagram order
- ✅ Skips node_modules and .git folders
- ✅ Provides progress output

You can run it manually or add it to CI/CD pipelines to regenerate exports automatically.

---

## Committing Exports

After generating exports, commit them to the repository:

```bash
git add exports/
git commit -m "Update exported Mermaid diagrams"
git push origin main
```

This allows anyone to download the repo ZIP and use the diagrams without needing GitHub rendering or Mermaid CLI.
