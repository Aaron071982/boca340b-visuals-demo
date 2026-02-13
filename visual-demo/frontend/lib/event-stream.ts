/**
 * SSE client for visualization events
 */

import { VisualizationEvent } from './event-processor';
import { ErrorHandler } from './error-handler';

// Polyfill EventSource for older browsers if needed
if (typeof window !== 'undefined' && !window.EventSource) {
  require('event-source-polyfill');
}

export interface EventStreamOptions {
  requestId?: string;
  replay?: boolean;
  onEvent?: (event: VisualizationEvent) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

class EventStreamClient {
  private eventSource: EventSource | null = null;
  private isConnected = false;
  private eventBuffer: VisualizationEvent[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Connect to SSE endpoint
   */
  connect(options: EventStreamOptions = {}) {
    const { requestId, replay = false, onEvent, onError, onClose } = options;

    // Build URL
    const baseUrl = process.env.NEXT_PUBLIC_LARAVEL_URL || 'http://localhost:8000';
    const url = new URL(`${baseUrl}/visualizations/events`);
    if (requestId) {
      url.searchParams.set('request_id', requestId);
    }
    if (replay) {
      url.searchParams.set('replay', 'true');
    }

    try {
      this.eventSource = new EventSource(url.toString());

      this.eventSource.addEventListener('visualization', (e: MessageEvent) => {
        try {
          const event: VisualizationEvent = JSON.parse(e.data);
          this.eventBuffer.push(event);

          if (onEvent) {
            onEvent(event);
          }
        } catch (err) {
          ErrorHandler.handleEventProcessingError(e.data, err as Error);
        }
      });

      this.eventSource.addEventListener('error', (e) => {
        const errorMessage = this.reconnectAttempts < this.maxReconnectAttempts
          ? 'SSE connection error. Attempting to reconnect...'
          : 'SSE connection failed after multiple attempts. Using mock data.';
        
        ErrorHandler.handleConnectionError(errorMessage);
        
        if (onError) {
          onError(new Error('SSE connection error'));
        }

        // Attempt reconnection
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(() => {
            this.connect(options);
          }, 1000 * this.reconnectAttempts);
        }
      });

      this.eventSource.addEventListener('close', () => {
        this.isConnected = false;
        if (onClose) {
          onClose();
        }
      });

      this.isConnected = true;
      this.reconnectAttempts = 0;
    } catch (err) {
      ErrorHandler.handleConnectionError('Failed to create SSE connection. Using mock data.');
      if (onError) {
        onError(err as Error);
      }
    }
  }

  /**
   * Disconnect from SSE endpoint
   */
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isConnected = false;
    }
  }

  /**
   * Get buffered events
   */
  getBufferedEvents(): VisualizationEvent[] {
    return [...this.eventBuffer];
  }

  /**
   * Clear event buffer
   */
  clearBuffer() {
    this.eventBuffer = [];
  }

  /**
   * Check if connected
   */
  get connected(): boolean {
    return this.isConnected;
  }
}

export const eventStreamClient = new EventStreamClient();
