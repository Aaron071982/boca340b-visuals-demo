/**
 * Zustand store for visualization state
 */

import { create } from 'zustand';
import { VisualizationEvent, ActiveComponent } from './event-processor';

interface VisualizationState {
  // Current active request
  activeRequestId: string | null;
  setActiveRequestId: (requestId: string | null) => void;

  // Event history (last 50 requests)
  requestHistory: Map<string, VisualizationEvent[]>;
  addEvent: (event: VisualizationEvent) => void;
  getRequestEvents: (requestId: string) => VisualizationEvent[];
  getAllRequestIds: () => string[];

  // Active components
  activeComponents: ActiveComponent[];
  setActiveComponents: (components: ActiveComponent[]) => void;

  // Connection state
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;

  // Current diagram type
  currentDiagram: 'architecture' | 'dependencies' | 'erd' | 'flow';
  setCurrentDiagram: (diagram: 'architecture' | 'dependencies' | 'erd' | 'flow') => void;

  // Replay state
  isReplaying: boolean;
  setIsReplaying: (replaying: boolean) => void;
}

export const useVisualizationStore = create<VisualizationState>((set, get) => ({
  activeRequestId: null,
  setActiveRequestId: (requestId) => set({ activeRequestId: requestId }),

  requestHistory: new Map(),
  addEvent: (event) => {
    const state = get();
    const requestId = event.request_id;

    if (!state.requestHistory.has(requestId)) {
      state.requestHistory.set(requestId, []);
    }

    const events = state.requestHistory.get(requestId)!;
    events.push(event);

    // Limit to last 50 requests
    if (state.requestHistory.size > 50) {
      const oldestRequestId = Array.from(state.requestHistory.keys())[0];
      state.requestHistory.delete(oldestRequestId);
    }

    set({ requestHistory: new Map(state.requestHistory) });
  },
  getRequestEvents: (requestId) => {
    return get().requestHistory.get(requestId) || [];
  },
  getAllRequestIds: () => {
    return Array.from(get().requestHistory.keys());
  },

  activeComponents: [],
  setActiveComponents: (components) => set({ activeComponents: components }),

  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),

  currentDiagram: 'architecture',
  setCurrentDiagram: (diagram) => set({ currentDiagram: diagram }),

  isReplaying: false,
  setIsReplaying: (replaying) => set({ isReplaying: replaying }),
}));
