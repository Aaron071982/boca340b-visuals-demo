#!/bin/bash
# Export Mermaid Diagrams Script
# Extracts Mermaid blocks from Markdown files and renders them as SVG/PNG

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
EXPORTS_DIR="$REPO_ROOT/exports"

cd "$REPO_ROOT"

echo "🔍 Extracting Mermaid blocks from Markdown files..."

# Clean previous exports
rm -rf "$EXPORTS_DIR/mmd"/*.mmd
rm -rf "$EXPORTS_DIR/svg"/*.svg
rm -rf "$EXPORTS_DIR/png"/*.png

# Extract all Mermaid blocks from Markdown into .mmd files
find . -name "*.md" -not -path "./node_modules/*" -not -path "./exports/*" -not -path "./.git/*" -print0 | while IFS= read -r -d '' file; do
  base="$(echo "$file" | sed 's|^\./||' | tr '/ ' '__')"
  awk -v base="$base" -v exports_dir="$EXPORTS_DIR/mmd" '
    BEGIN { in_mermaid=0; n=0; buf="" }
    /^```mermaid[[:space:]]*$/ { in_mermaid=1; n++; buf=""; next }
    /^```[[:space:]]*$/ && in_mermaid==1 {
      in_mermaid=0
      if (length(buf) > 0) {
        out=sprintf("%s/%s_%02d.mmd", exports_dir, base, n)
        print buf > out
        close(out)
        printf "  ✓ Extracted: %s (%d lines)\n", out, NR
      }
      buf=""
      next
    }
    in_mermaid==1 { buf = buf $0 "\n" }
  ' "$file"
done

MMD_COUNT=$(find "$EXPORTS_DIR/mmd" -name "*.mmd" 2>/dev/null | wc -l | tr -d ' ')
echo ""
echo "📊 Extracted $MMD_COUNT Mermaid diagram(s)"

if [ "$MMD_COUNT" -eq 0 ]; then
  echo "⚠️  No Mermaid diagrams found. Exiting."
  exit 1
fi

# Check if mmdc is installed
if ! command -v mmdc &> /dev/null; then
  echo ""
  echo "❌ Error: Mermaid CLI (mmdc) not found."
  echo "   Install it with: npm install -g @mermaid-js/mermaid-cli"
  exit 1
fi

echo ""
echo "🎨 Rendering SVG files..."
for f in "$EXPORTS_DIR/mmd"/*.mmd; do
  if [ -f "$f" ]; then
    out="$EXPORTS_DIR/svg/$(basename "${f%.mmd}.svg")"
    mmdc -i "$f" -o "$out" 2>&1 | grep -v "^$" || true
    echo "  ✓ Rendered: $out"
  fi
done

SVG_COUNT=$(find "$EXPORTS_DIR/svg" -name "*.svg" 2>/dev/null | wc -l | tr -d ' ')
echo "✅ Generated $SVG_COUNT SVG file(s)"

# Optional: Render PNG
RENDER_PNG="${1:-yes}"  # Default to yes, but can pass "no" as argument
if [ "$RENDER_PNG" != "no" ]; then
  echo ""
  echo "🎨 Rendering PNG files (optional)..."
  for f in "$EXPORTS_DIR/mmd"/*.mmd; do
    if [ -f "$f" ]; then
      out="$EXPORTS_DIR/png/$(basename "${f%.mmd}.png")"
      mmdc -i "$f" -o "$out" -t dark -b transparent 2>&1 | grep -v "^$" || true
      echo "  ✓ Rendered: $out"
    fi
  done
  PNG_COUNT=$(find "$EXPORTS_DIR/png" -name "*.png" 2>/dev/null | wc -l | tr -d ' ')
  echo "✅ Generated $PNG_COUNT PNG file(s)"
fi

echo ""
echo "🎉 Export complete!"
echo "   MMD files: $EXPORTS_DIR/mmd/"
echo "   SVG files: $EXPORTS_DIR/svg/"
if [ "$RENDER_PNG" != "no" ]; then
  echo "   PNG files: $EXPORTS_DIR/png/"
fi
