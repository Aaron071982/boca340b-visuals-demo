/**
 * Centralized error handling with user-facing toast notifications
 */

import { toast } from 'sonner';

export class ErrorHandler {
  /**
   * Handle visualization-related errors
   */
  static handleVisualizationError(error: Error, context: string) {
    console.error(`[${context}]`, error);
    
    toast.error('Visualization Error', {
      description: error.message || 'An error occurred while processing visualization events.',
      duration: 5000,
    });
  }
  
  /**
   * Handle connection errors
   */
  static handleConnectionError(message?: string) {
    const description = message || 'Unable to connect to backend. Using mock data.';
    
    toast.error('Connection Lost', {
      description,
      duration: 3000,
    });
  }
  
  /**
   * Handle diagram render errors
   */
  static handleDiagramRenderError(diagramType: string, error: Error | string) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    
    console.error(`[Diagram Render] ${diagramType}:`, error);
    
    toast.error('Diagram Render Failed', {
      description: `Could not render ${diagramType} diagram: ${errorMessage}`,
      duration: 4000,
    });
  }
  
  /**
   * Handle highlighting errors
   */
  static handleHighlightError(nodeId: string, error: Error) {
    console.warn(`[Highlight] Failed to highlight node "${nodeId}":`, error);
    // Don't show toast for highlighting errors - they're non-critical
  }
  
  /**
   * Handle event processing errors
   */
  static handleEventProcessingError(event: any, error: Error) {
    console.error('[Event Processing]', { event, error });
    
    toast.error('Event Processing Error', {
      description: 'Failed to process visualization event. Some highlights may not appear.',
      duration: 3000,
    });
  }
  
  /**
   * Handle storage errors
   */
  static handleStorageError(operation: string, error: Error) {
    console.error(`[Storage] ${operation}:`, error);
    
    toast.warning('Storage Error', {
      description: `Failed to ${operation}. Data may not persist across sessions.`,
      duration: 3000,
    });
  }
  
  /**
   * Show success notification
   */
  static showSuccess(message: string, description?: string) {
    toast.success(message, {
      description,
      duration: 3000,
    });
  }
  
  /**
   * Show info notification
   */
  static showInfo(message: string, description?: string) {
    toast.info(message, {
      description,
      duration: 3000,
    });
  }
}
