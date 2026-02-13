/**
 * Export utilities for request history and diagrams
 */

import { VisualizationEvent } from './event-processor';
import { ErrorHandler } from './error-handler';

export class ExportUtils {
  /**
   * Export request history as JSON
   */
  static exportRequestHistoryAsJSON(events: VisualizationEvent[]): void {
    try {
      const dataStr = JSON.stringify(events, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `boca-requests-${Date.now()}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      ErrorHandler.showSuccess('Export Successful', 'Request history exported as JSON');
    } catch (error) {
      ErrorHandler.handleVisualizationError(error as Error, 'JSON Export');
    }
  }
  
  /**
   * Export request history as CSV
   */
  static exportRequestHistoryAsCSV(events: VisualizationEvent[]): void {
    try {
      const headers = ['Request ID', 'Endpoint', 'Timestamp', 'Phase', 'Component Type', 'Component ID', 'Status'];
      const rows = events.map(e => [
        e.request_id,
        e.endpointId,
        new Date(e.timestamp).toISOString(),
        e.phase,
        e.componentType,
        e.componentId,
        e.status
      ]);
      
      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => {
          // Escape commas and quotes in CSV
          const cellStr = String(cell);
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `boca-requests-${Date.now()}.csv`;
      a.click();
      
      URL.revokeObjectURL(url);
      ErrorHandler.showSuccess('Export Successful', 'Request history exported as CSV');
    } catch (error) {
      ErrorHandler.handleVisualizationError(error as Error, 'CSV Export');
    }
  }
  
  /**
   * Export diagram as PNG
   */
  static async exportDiagramAsPNG(svgElement: SVGElement, filename: string): Promise<void> {
    try {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          try {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
              if (blob) {
                const pngUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = pngUrl;
                a.download = filename || `boca-diagram-${Date.now()}.png`;
                a.click();
                URL.revokeObjectURL(pngUrl);
                ErrorHandler.showSuccess('Export Successful', 'Diagram exported as PNG');
              } else {
                reject(new Error('Failed to create blob'));
              }
            }, 'image/png');
            
            URL.revokeObjectURL(url);
            resolve();
          } catch (err) {
            reject(err);
          }
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load SVG image'));
        };
        
        img.src = url;
      });
    } catch (error) {
      ErrorHandler.handleVisualizationError(error as Error, 'PNG Export');
    }
  }
  
  /**
   * Export current diagram view as PNG
   */
  static async exportCurrentDiagram(diagramType: string): Promise<void> {
    try {
      const diagramContainer = document.querySelector('.mermaid-diagram-container');
      if (!diagramContainer) {
        throw new Error('No diagram container found');
      }
      
      const svgElement = diagramContainer.querySelector('svg') as SVGElement;
      if (!svgElement) {
        throw new Error('No SVG element found in diagram');
      }
      
      const filename = `boca-${diagramType}-${Date.now()}.png`;
      await this.exportDiagramAsPNG(svgElement, filename);
    } catch (error) {
      ErrorHandler.handleVisualizationError(error as Error, 'Diagram Export');
    }
  }
}
