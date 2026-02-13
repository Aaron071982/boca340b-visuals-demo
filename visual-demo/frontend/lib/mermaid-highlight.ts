/**
 * Mermaid diagram highlighting engine
 * Toggles CSS classes on nodes/edges without re-rendering diagrams
 */

import { ErrorHandler } from './error-handler';

export type HighlightState = 'active' | 'dim' | 'error' | 'none';

export interface HighlightTarget {
  nodeId: string;
  edgeId?: string;
  state: HighlightState;
}

const HIGHLIGHT_CLASSES = {
  active: 'highlight-active',
  dim: 'highlight-dim',
  error: 'highlight-error',
};

const DECAY_TIME = 5000; // 5 seconds

class HighlightEngine {
  private activeHighlights: Map<string, NodeJS.Timeout> = new Map();
  private diagramContainer: HTMLElement | null = null;

  /**
   * Set the diagram container element
   */
  setContainer(container: HTMLElement | null) {
    this.diagramContainer = container;
  }

  /**
   * Check if an element is a background element that shouldn't be highlighted
   */
  private isBackgroundElement(element: HTMLElement): boolean {
    if (!element) return true;
    
    // Check if it's the SVG root or container
    if (element.tagName === 'svg') return true;
    
    // Check for background-related classes or IDs (most reliable check first)
    const classList = element.classList;
    const bgClasses = ['background', 'bg', 'backdrop', 'edgeLabel', 'label-container', 'marker'];
    if (bgClasses.some(bgClass => classList.contains(bgClass))) return true;
    
    const elementId = element.id?.toLowerCase() || '';
    const bgIds = ['background', 'bg', 'defs', 'marker'];
    if (bgIds.some(bgId => elementId.includes(bgId))) return true;
    
    // Check if it's in a defs or marker element (SVG definitions)
    if (element.closest('defs') || element.closest('marker')) return true;
    
    // Check if it's a very large rect (likely background)
    if (element.tagName === 'rect') {
      const rect = element as unknown as SVGRectElement;
      const width = parseFloat(rect.getAttribute('width') || '0');
      const height = parseFloat(rect.getAttribute('height') || '0');
      
      // If rect is larger than 1200px in either dimension, it's likely a background
      if (width > 1200 || height > 1200) return true;
      
      // Check if it has meaningful content
      const hasText = element.querySelector('text') || 
                     (element.parentElement && element.parentElement.querySelector('text'));
      const hasNodeClass = classList.contains('node') || 
                          classList.contains('actor') || 
                          classList.contains('participant') ||
                          classList.contains('activation') ||
                          element.hasAttribute('data-participant-name');
      
      // If it's a large rect without text and without node classes, it's background
      if (!hasText && !hasNodeClass && (width > 350 || height > 350)) return true;
      
      // If it has no children and is large, it's background
      if (!hasText && element.children.length === 0 && (width > 250 || height > 250)) return true;
    }
    
    return false;
  }
  
  /**
   * Check if an element is a valid diagram element that should be highlighted
   * Only lines (paths) and boxes (rects representing nodes/participants) should highlight
   */
  private isValidDiagramElement(element: HTMLElement): boolean {
    if (!element) return false;
    
    // Never highlight text elements directly
    if (element.tagName === 'text') return false;
    
    // Must not be background
    if (this.isBackgroundElement(element)) return false;
    
    // Only highlight: paths (lines/arrows), rects (boxes), and groups containing these
    const validTags = ['g', 'rect', 'path', 'line'];
    if (!validTags.includes(element.tagName.toLowerCase())) return false;
    
    // For groups, only highlight if they contain rects or paths (not just text)
    if (element.tagName === 'g') {
      const hasShape = element.querySelector('rect, path, line');
      const hasNodeClass = element.classList.contains('node') || 
                          element.classList.contains('actor') || 
                          element.classList.contains('participant');
      // Only highlight if it has shapes or node classes, not just text
      return !!(hasShape || hasNodeClass);
    }
    
    // For rects, only highlight if they're participant boxes or node boxes
    if (element.tagName === 'rect') {
      const hasNodeClass = element.classList.contains('node') || 
                          element.classList.contains('actor') || 
                          element.classList.contains('participant') ||
                          element.classList.contains('activation') ||
                          element.hasAttribute('data-participant-name');
      
      // Check if it's part of a participant/actor group
      const parentG = element.closest('g');
      const isInParticipantGroup = parentG && (
        parentG.classList.contains('actor') || 
        parentG.classList.contains('participant') ||
        parentG.hasAttribute('data-participant-name')
      );
      
      // Only highlight if it has node classes or is in a participant group
      // But exclude if it's just a background rect
      return !!(hasNodeClass || isInParticipantGroup);
    }
    
    // For paths and lines, these are always valid (they're the arrows/lines)
    if (element.tagName === 'path' || element.tagName === 'line') {
      return true;
    }
    
    return false;
  }

  /**
   * Highlight a node or edge
   */
  highlight(target: HighlightTarget) {
    if (!this.diagramContainer) return;

    try {
      const { nodeId, edgeId, state } = target;

      // Clear existing timeout for this target
      const key = `${nodeId}-${edgeId || ''}`;
      if (this.activeHighlights.has(key)) {
        clearTimeout(this.activeHighlights.get(key)!);
      }

      // Find the node/edge element
      const nodeElement = this.findNodeElement(nodeId);
      const edgeElement = edgeId ? this.findEdgeElement(edgeId) : null;

      // Skip if element is a background or invalid
      if (nodeElement && (!this.isValidDiagramElement(nodeElement) || this.isBackgroundElement(nodeElement))) {
        return;
      }
      if (edgeElement && (!this.isValidDiagramElement(edgeElement) || this.isBackgroundElement(edgeElement))) {
        return;
      }

      // Remove all highlight classes
      if (nodeElement) {
        Object.values(HIGHLIGHT_CLASSES).forEach((cls) => {
          nodeElement.classList.remove(cls);
        });
      }
      if (edgeElement) {
        Object.values(HIGHLIGHT_CLASSES).forEach((cls) => {
          edgeElement.classList.remove(cls);
        });
      }

      // Apply new highlight class only to valid diagram elements
      if (state !== 'none') {
        const className = HIGHLIGHT_CLASSES[state];
        if (nodeElement && this.isValidDiagramElement(nodeElement) && !this.isBackgroundElement(nodeElement)) {
          nodeElement.classList.add(className);
        }
        if (edgeElement && this.isValidDiagramElement(edgeElement) && !this.isBackgroundElement(edgeElement)) {
          edgeElement.classList.add(className);
        }

        // Set decay timer
        const timeout = setTimeout(() => {
          this.clearHighlight(target);
        }, DECAY_TIME);
        this.activeHighlights.set(key, timeout);
      }
    } catch (error) {
      ErrorHandler.handleHighlightError(target.nodeId, error as Error);
    }
  }

  /**
   * Clear a specific highlight
   */
  clearHighlight(target: HighlightTarget) {
    if (!this.diagramContainer) return;

    const { nodeId, edgeId } = target;
    const key = `${nodeId}-${edgeId || ''}`;

    if (this.activeHighlights.has(key)) {
      clearTimeout(this.activeHighlights.get(key)!);
      this.activeHighlights.delete(key);
    }

    const nodeElement = this.findNodeElement(nodeId);
    const edgeElement = edgeId ? this.findEdgeElement(edgeId) : null;

    if (nodeElement) {
      Object.values(HIGHLIGHT_CLASSES).forEach((cls) => {
        nodeElement.classList.remove(cls);
      });
    }
    if (edgeElement) {
      Object.values(HIGHLIGHT_CLASSES).forEach((cls) => {
        edgeElement.classList.remove(cls);
      });
    }
  }

  /**
   * Clear all highlights
   */
  clearAll() {
    this.activeHighlights.forEach((timeout) => clearTimeout(timeout));
    this.activeHighlights.clear();

    if (!this.diagramContainer) return;

    const allHighlighted = this.diagramContainer.querySelectorAll(
      `.${HIGHLIGHT_CLASSES.active}, .${HIGHLIGHT_CLASSES.dim}, .${HIGHLIGHT_CLASSES.error}`
    );

    allHighlighted.forEach((el) => {
      Object.values(HIGHLIGHT_CLASSES).forEach((cls) => {
        el.classList.remove(cls);
      });
    });
  }

  /**
   * Sanitize a node ID for use in CSS selectors
   * Escapes or removes invalid characters like ::, :, etc.
   */
  private sanitizeSelector(nodeId: string): string {
    // Handle namespaces: Backend\\Controller -> Backend-Controller or BackendController
    let cleaned = nodeId
      .replace(/\\\\/g, '-')  // Replace \\ with -
      .replace(/\\/g, '-')    // Replace single \ with -
      .replace(/::/g, '-')    // Replace :: with -
      .replace(/:/g, '-')     // Replace : with -
      .replace(/[^a-zA-Z0-9_-]/g, ''); // Remove other invalid chars
    
    return cleaned;
  }
  
  /**
   * Normalize node ID by extracting meaningful parts
   * Examples: Backend\\Controller -> Controller, Auth::login -> Auth
   */
  private normalizeNodeId(nodeId: string): string[] {
    const variants: string[] = [nodeId];
    
    // Extract last part after namespace separator
    if (nodeId.includes('\\')) {
      const parts = nodeId.split('\\');
      variants.push(parts[parts.length - 1]);
      // Also try without namespace prefix
      if (parts.length > 1) {
        variants.push(parts.slice(1).join('-'));
      }
    }
    
    // Extract base name before ::
    if (nodeId.includes('::')) {
      const base = nodeId.split('::')[0];
      variants.push(base);
    }
    
    // Remove common suffixes
    const withoutSuffixes = nodeId
      .replace(/Controller$/, '')
      .replace(/Model$/, '')
      .replace(/Service$/, '')
      .replace(/Repository$/, '')
      .replace(/ API$/, '');
    if (withoutSuffixes !== nodeId) {
      variants.push(withoutSuffixes);
    }
    
    return [...new Set(variants)]; // Remove duplicates
  }

  /**
   * Find a node element by ID
   */
  private findNodeElement(nodeId: string): HTMLElement | null {
    if (!this.diagramContainer) return null;

    // Get normalized variants of the node ID
    const normalizedIds = this.normalizeNodeId(nodeId);
    const cleanNodeId = this.sanitizeSelector(nodeId);
    const originalNodeId = nodeId; // Keep original for text matching

    // Try multiple selectors for flowcharts/architecture/dependencies
    const selectors: string[] = [];
    
    // Add selectors for all normalized variants
    for (const variant of normalizedIds) {
      const cleanVariant = this.sanitizeSelector(variant);
      selectors.push(
        `#${cleanVariant}`,
        `#${variant}`,
        `[data-node-id="${variant}"]`,
        `[data-node-id="${cleanVariant}"]`,
        `[id*="${cleanVariant}"]`,
        `[id*="${variant}"]`,
        `.node[id*="${cleanVariant}"]`,
        `.node[id*="${variant}"]`,
        `[class*="${cleanVariant}"]`,
        `[class*="${variant}"]`
      );
    }
    
    // Also try original and cleaned versions
    selectors.push(
      `#${cleanNodeId}`,
      `#${originalNodeId}`,
      `[data-node-id="${originalNodeId}"]`,
      `[data-node-id="${cleanNodeId}"]`,
      `[id*="${cleanNodeId}"]`,
      `[id*="${originalNodeId}"]`,
      `.node[id*="${cleanNodeId}"]`,
      `.node[id*="${originalNodeId}"]`
    );

    for (const selector of selectors) {
      try {
        const element = this.diagramContainer.querySelector(selector) as HTMLElement;
        if (element && this.isValidDiagramElement(element) && !this.isBackgroundElement(element)) {
          return element;
        }
      } catch (e) {
        // Skip invalid selectors silently
        continue;
      }
    }

    // For sequence diagrams (flow), try to find participants and messages
    // Sequence diagrams use participant boxes and message paths
    // First try data attributes we added - use all normalized variants
    const dataAttrSelectors: string[] = [];
    for (const variant of normalizedIds) {
      const cleanVariant = this.sanitizeSelector(variant);
      dataAttrSelectors.push(
        `[data-participant-name*="${variant}"]`,
        `[data-participant-name*="${cleanVariant}"]`,
        `[data-participant-name="${variant}"]`,
        `[data-participant-name="${cleanVariant}"]`
      );
    }
    // Also try original
    dataAttrSelectors.push(
      `[data-participant-name*="${originalNodeId}"]`,
      `[data-participant-name*="${cleanNodeId}"]`,
      `[data-participant-name="${originalNodeId}"]`,
      `[data-participant-name="${cleanNodeId}"]`
    );
    
    for (const selector of dataAttrSelectors) {
      try {
        const dataAttrElement = this.diagramContainer.querySelector(selector) as HTMLElement;
        if (dataAttrElement && this.isValidDiagramElement(dataAttrElement) && !this.isBackgroundElement(dataAttrElement)) {
          return dataAttrElement;
        }
      } catch (e) {
        continue;
      }
    }
    
    // Try flow-specific selectors with normalized IDs
    const flowSelectors: string[] = [];
    for (const variant of normalizedIds) {
      const cleanVariant = this.sanitizeSelector(variant);
      flowSelectors.push(
        `[id*="participant-${cleanVariant}"]`,
        `[id*="participant-${variant}"]`,
        `[id*="${cleanVariant.toLowerCase()}"]`,
        `[id*="${variant.toLowerCase()}"]`,
        `g[id*="${cleanVariant}"]`,
        `g[id*="${variant}"]`,
        `g.actor[id*="${cleanVariant}"]`,
        `g.participant[id*="${cleanVariant}"]`
      );
    }
    // Also try original
    flowSelectors.push(
      `[id*="participant-${cleanNodeId}"]`,
      `[id*="participant-${originalNodeId}"]`,
      `[id*="${cleanNodeId.toLowerCase()}"]`,
      `[id*="${originalNodeId.toLowerCase()}"]`,
      `g[id*="${cleanNodeId}"]`,
      `g[id*="${originalNodeId}"]`,
      `g.actor[id*="${cleanNodeId}"]`,
      `g.participant[id*="${cleanNodeId}"]`
    );

    // Try flow-specific selectors
    for (const selector of flowSelectors) {
      try {
        const element = this.diagramContainer.querySelector(selector) as HTMLElement;
        if (element && this.isValidDiagramElement(element) && !this.isBackgroundElement(element)) {
          return element;
        }
      } catch (e) {
        continue;
      }
    }
    
    // Last resort: search by text content for sequence diagrams
    // But we'll find the parent box/rect, not the text itself
    const textElements = this.diagramContainer.querySelectorAll('text');
    for (const textEl of textElements) {
      const textContent = textEl.textContent || '';
      // Skip empty or very short text (likely not a participant name)
      if (textContent.trim().length < 2) continue;
      
      const textLower = textContent.trim().toLowerCase();
      
      // Try matching against all normalized variants
      const matches = normalizedIds.some(variant => {
        const variantLower = variant.toLowerCase();
        return textLower === variantLower || 
               textLower.includes(variantLower) || 
               variantLower.includes(textLower);
      });
      
      // Also try original and base name
      const baseName = originalNodeId.includes('::') ? originalNodeId.split('::')[0] : originalNodeId;
      const matchesOriginal = textLower === originalNodeId.toLowerCase() ||
          textLower === baseName.toLowerCase() ||
          textLower === nodeId.toLowerCase() ||
          textLower.includes(originalNodeId.toLowerCase()) ||
          textLower.includes(baseName.toLowerCase());
      
      if (matches || matchesOriginal) {
        // Find parent rect (box) or group containing a rect, but never return the text itself
        let parent = textEl.parentElement;
        while (parent && parent.tagName !== 'svg') {
          if (parent.tagName === 'rect') {
            // Found a rect - check if it's valid
            if (this.isValidDiagramElement(parent as HTMLElement) && 
                !this.isBackgroundElement(parent as HTMLElement)) {
              return parent as HTMLElement;
            }
          }
          if (parent.tagName === 'g') {
            // Check if this group contains a valid rect
            const rect = parent.querySelector('rect');
            if (rect && this.isValidDiagramElement(rect as unknown as HTMLElement) && 
                !this.isBackgroundElement(rect as unknown as HTMLElement)) {
              return rect as unknown as HTMLElement;
            }
            // Or return the group if it's a valid participant group
            if (this.isValidDiagramElement(parent as HTMLElement) && 
                !this.isBackgroundElement(parent as HTMLElement)) {
              return parent as HTMLElement;
            }
          }
          parent = parent.parentElement;
        }
      }
      // Try partial match (check both original and base name)
      if (textContent.toLowerCase().includes(originalNodeId.toLowerCase()) ||
          textContent.toLowerCase().includes(baseName.toLowerCase()) ||
          textContent.toLowerCase().includes(nodeId.toLowerCase()) ||
          originalNodeId.toLowerCase().includes(textContent.trim().toLowerCase()) ||
          baseName.toLowerCase().includes(textContent.trim().toLowerCase()) ||
          nodeId.toLowerCase().includes(textContent.trim().toLowerCase())) {
        // Find parent rect (box) or group containing a rect
        let parent = textEl.parentElement;
        while (parent && parent.tagName !== 'svg') {
          if (parent.tagName === 'rect') {
            if (this.isValidDiagramElement(parent as HTMLElement) && 
                !this.isBackgroundElement(parent as HTMLElement)) {
              return parent as HTMLElement;
            }
          }
          if (parent.tagName === 'g') {
            const rect = parent.querySelector('rect');
            if (rect && this.isValidDiagramElement(rect as unknown as HTMLElement) && 
                !this.isBackgroundElement(rect as unknown as HTMLElement)) {
              return rect as unknown as HTMLElement;
            }
            if (this.isValidDiagramElement(parent as HTMLElement) && 
                !this.isBackgroundElement(parent as HTMLElement)) {
              return parent as HTMLElement;
            }
          }
          parent = parent.parentElement;
        }
      }
    }

    return null;
  }

  /**
   * Find an edge element by ID
   */
  private findEdgeElement(edgeId: string): HTMLElement | null {
    if (!this.diagramContainer) return null;

    const selectors = [
      `#${edgeId}`,
      `[data-edge-id="${edgeId}"]`,
      `path[id*="${edgeId}"]`,
      `.edge[id*="${edgeId}"]`,
    ];

    for (const selector of selectors) {
      const element = this.diagramContainer.querySelector(selector) as HTMLElement;
      if (element) return element;
    }

    // For sequence diagrams, also try to find message paths
    // Sequence diagrams use paths for messages between participants
    const flowSelectors = [
      `path[class*="messageLine"]`,
      `path[class*="message"]`,
      `line[class*="message"]`,
    ];

    for (const selector of flowSelectors) {
      const elements = this.diagramContainer.querySelectorAll(selector);
      // Return first path if we can't find specific one
      if (elements.length > 0) {
        return elements[0] as HTMLElement;
      }
    }

    return null;
  }
}

export const highlightEngine = new HighlightEngine();
