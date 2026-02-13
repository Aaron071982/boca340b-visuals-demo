'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { highlightEngine } from '@/lib/mermaid-highlight';
import { ErrorHandler } from '@/lib/error-handler';

interface DiagramViewerProps {
  diagramSource: string;
  diagramType: 'architecture' | 'dependencies' | 'erd' | 'flow';
}

export default function DiagramViewer({ diagramSource, diagramType }: DiagramViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAttemptedLoadRef = useRef(false);
  const [rendered, setRendered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      setLoading(false);
      return;
    }

    // If diagramSource is empty, show loading (parent component is still fetching)
    // Only show error if we've attempted to load and it's still empty
    if (!diagramSource) {
      if (hasAttemptedLoadRef.current) {
        // We've tried loading before and it's still empty - show error
        setLoading(false);
        setError('No diagram source provided');
      } else {
        // Still waiting for parent to load - show loading state
        setLoading(true);
        setError(null);
      }
      return;
    }

    // We have diagramSource, attempt to render
    hasAttemptedLoadRef.current = true;
    setLoading(true);
    setError(null);

    // Initialize Mermaid with light theme and better visibility settings
    const shouldInitMermaid = !rendered;
    if (shouldInitMermaid) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        themeVariables: {
          primaryColor: '#e1f5fe',
          primaryTextColor: '#01579b',
          primaryBorderColor: '#0277bd',
          lineColor: '#424242',
          secondaryColor: '#f5f5f5',
          tertiaryColor: '#ffffff',
          background: '#ffffff',
          mainBkgColor: '#ffffff',
          secondBkgColor: '#f5f5f5',
          textColor: '#212121',
          border1: '#0277bd',
          border2: '#01579b',
          noteBkgColor: '#fff9c4',
          noteTextColor: '#212121',
          noteBorderColor: '#f57f17',
        },
        securityLevel: 'loose',
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          curve: 'basis',
          padding: 20,
          nodeSpacing: 50,
          rankSpacing: 80,
        },
        sequence: {
          diagramMarginX: 50,
          diagramMarginY: 10,
          actorMargin: 50,
          width: 150,
          height: 65,
          boxMargin: 10,
          boxTextMargin: 5,
          noteMargin: 10,
          messageMargin: 35,
          mirrorActors: true,
          bottomMarginAdj: 1,
          useMaxWidth: false,
          rightAngles: false,
          showSequenceNumbers: false,
        },
        gantt: {
          useMaxWidth: false,
        },
      });
    }

    // Render diagram
    const renderDiagram = async () => {
      try {
        const id = `diagram-${diagramType}-${Date.now()}`;
        const result = await mermaid.render(id, diagramSource);
        const svgContent = result.svg;
        
        if (containerRef.current && svgContent) {
          containerRef.current.innerHTML = svgContent;
          setRendered(true);
          setLoading(false);

          // Set container for highlight engine
          highlightEngine.setContainer(containerRef.current);

          // Ensure white background and make edges thicker for better visibility
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.backgroundColor = '#ffffff';
            svgElement.setAttribute('style', (svgElement.getAttribute('style') || '') + '; background-color: #ffffff;');
          }
          
          // Force all rects and backgrounds to be white
          const rects = containerRef.current.querySelectorAll('rect');
          rects.forEach((rect) => {
            const fill = rect.getAttribute('fill');
            if (fill && (fill === '#333' || fill === '#1f1f1f' || fill === '#000000' || fill === '#0f1419')) {
              rect.setAttribute('fill', '#ffffff');
            }
          });
          
          // Make edges thicker for better visibility
          const paths = containerRef.current.querySelectorAll('path');
          paths.forEach((path) => {
            const currentStrokeWidth = path.getAttribute('stroke-width');
            if (!currentStrokeWidth || parseFloat(currentStrokeWidth) < 2.5) {
              path.setAttribute('stroke-width', '2.5');
            }
            // Ensure paths are visible (not too dark)
            const stroke = path.getAttribute('stroke');
            if (stroke && (stroke === '#333' || stroke === '#1f1f1f' || stroke === '#000000')) {
              path.setAttribute('stroke', '#666666');
            }
          });
          
          // Ensure text is dark and visible
          const texts = containerRef.current.querySelectorAll('text');
          texts.forEach((text) => {
            const fill = text.getAttribute('fill');
            if (fill && (fill === '#fff' || fill === '#ffffff' || fill === '#f0f0f0')) {
              text.setAttribute('fill', '#212121');
            }
            
            // For flow diagrams, add data attributes to help with highlighting
            if (diagramType === 'flow') {
              const textContent = text.textContent || '';
              // Add data attribute for participant names
              if (textContent.trim()) {
                text.setAttribute('data-participant-name', textContent.trim());
                // Also add to parent group if it exists
                let parent = text.parentElement;
                while (parent && parent.tagName !== 'svg') {
                  if (parent.tagName === 'g') {
                    parent.setAttribute('data-participant-name', textContent.trim());
                    break;
                  }
                  parent = parent.parentElement;
                }
              }
            }
          });
          
          // For flow diagrams, also mark participant boxes and message paths
          if (diagramType === 'flow' && containerRef.current) {
            const container = containerRef.current;
            const participantRects = container.querySelectorAll('rect');
            participantRects.forEach((rect) => {
              // Check if this rect is near participant text
              const rectBox = rect.getBoundingClientRect();
              const nearbyTexts = Array.from(container.querySelectorAll('text')).filter((text) => {
                const textBox = text.getBoundingClientRect();
                // Check if text is vertically aligned with rect (participant box)
                return Math.abs(textBox.left - rectBox.left) < 50 && 
                       textBox.top > rectBox.top && 
                       textBox.top < rectBox.bottom + 100;
              });
              
              if (nearbyTexts.length > 0) {
                const participantName = nearbyTexts[0].textContent?.trim() || '';
                if (participantName) {
                  rect.setAttribute('data-participant-name', participantName);
                  const parentG = rect.closest('g');
                  if (parentG) {
                    parentG.setAttribute('data-participant-name', participantName);
                  }
                }
              }
            });
          }
        } else {
          throw new Error('Failed to render diagram: No SVG content returned');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        setLoading(false);
        ErrorHandler.handleDiagramRenderError(diagramType, errorMessage);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full p-8">
              <div class="text-center">
                <p class="text-red-600 mb-4" style="font-family: Roboto, sans-serif;">${errorMessage}</p>
                <button 
                  onclick="window.location.reload()" 
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  style="font-family: Roboto, sans-serif;"
                >
                  Retry
                </button>
              </div>
            </div>
          `;
        }
      }
    };

    renderDiagram();
    // Stable dependency array: only diagramSource and diagramType. Do not add rendered or state that changes inside the effect.
  }, [diagramSource, diagramType]);

  // Always mount the container so ref is available for the effect; show loading/error as overlays.
  return (
    <div className="relative w-full h-full overflow-auto p-6" style={{ backgroundColor: '#ffffff' }}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/95">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>Loading diagram...</p>
          </div>
        </div>
      )}
      {error && !containerRef.current?.innerHTML && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-yellow-50 p-8">
          <div className="text-center max-w-md">
            <svg className="mx-auto h-12 w-12 text-yellow-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-yellow-800 mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors font-medium"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Retry
            </button>
          </div>
        </div>
      )}
      <div ref={containerRef} className="mermaid-diagram-container" style={{ minHeight: 200, backgroundColor: '#ffffff' }} />
    </div>
  );
}
