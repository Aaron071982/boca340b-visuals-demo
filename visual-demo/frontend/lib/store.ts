/**
 * Zustand store for visualization state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VisualizationEvent, ActiveComponent } from './event-processor';
import { ErrorHandler } from './error-handler';

// Helper to convert Map to array for serialization
function mapToArray(map: Map<string, VisualizationEvent[]>): Array<[string, VisualizationEvent[]]> {
  return Array.from(map.entries());
}

// Helper to convert array back to Map
function arrayToMap(arr: Array<[string, VisualizationEvent[]]>): Map<string, VisualizationEvent[]> {
  return new Map(arr);
}

interface VisualizationState {
  // Current active request
  activeRequestId: string | null;
  setActiveRequestId: (requestId: string | null) => void;

  // Event history (last 50 requests)
  // Stored as Map internally, but serialized as array for persistence
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

interface PersistedState {
  requestHistoryArray: Array<[string, VisualizationEvent[]]>;
}

export const useVisualizationStore = create<VisualizationState>()(
  persist(
    (set, get) => ({
      activeRequestId: null,
      setActiveRequestId: (requestId) => set({ activeRequestId: requestId }),

      requestHistory: new Map(),
      addEvent: (event) => {
        const state = get();
        const requestId = event.request_id;

        // Ensure requestHistory is a Map
        const history = state.requestHistory instanceof Map 
          ? state.requestHistory 
          : new Map();

        if (!history.has(requestId)) {
          history.set(requestId, []);
        }

        const events = history.get(requestId)!;
        events.push(event);

        // Limit to last 50 requests
        if (history.size > 50) {
          const oldestRequestId = Array.from(history.keys())[0];
          history.delete(oldestRequestId);
        }

        set({ requestHistory: new Map(history) });
      },
      getRequestEvents: (requestId) => {
        const history = get().requestHistory;
        return (history instanceof Map ? history : new Map()).get(requestId) || [];
      },
      getAllRequestIds: () => {
        const history = get().requestHistory;
        return Array.from((history instanceof Map ? history : new Map()).keys());
      },

      activeComponents: [],
      setActiveComponents: (components) => set({ activeComponents: components }),

      isConnected: false,
      setIsConnected: (connected) => set({ isConnected: connected }),

      currentDiagram: 'architecture',
      setCurrentDiagram: (diagram) => set({ currentDiagram: diagram }),

      isReplaying: false,
      setIsReplaying: (replaying) => set({ isReplaying: replaying }),
    }),
    {
      name: 'boca-visualization-storage',
      partialize: ((state) => ({
        requestHistoryArray: mapToArray(
          state.requestHistory instanceof Map ? state.requestHistory : new Map()
        ),
      })) as (state: VisualizationState) => Partial<VisualizationState>,
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          ErrorHandler.handleStorageError('load', error instanceof Error ? error : new Error(String(error)));
          if (state) {
            state.requestHistory = new Map();
          }
        } else if (state) {
          // Convert persisted array back to Map
          try {
            const persisted = state as unknown as PersistedState & VisualizationState;
            if (persisted.requestHistoryArray && Array.isArray(persisted.requestHistoryArray)) {
              state.requestHistory = arrayToMap(persisted.requestHistoryArray);
            } else {
              state.requestHistory = new Map();
            }
          } catch (err) {
            ErrorHandler.handleStorageError('rehydrate', err as Error);
            state.requestHistory = new Map();
          }
        }
      },
      storage: {
        getItem: (name: string): string | null => {
          try {
            if (typeof window === 'undefined') return null;
            return window.localStorage.getItem(name);
          } catch (err) {
            ErrorHandler.handleStorageError('getItem', err as Error);
            return null;
          }
        },
        setItem: (name: string, value: string): void => {
          try {
            if (typeof window === 'undefined') return;
            window.localStorage.setItem(name, value);
          } catch (err) {
            ErrorHandler.handleStorageError('setItem', err as Error);
          }
        },
        removeItem: (name: string): void => {
          try {
            if (typeof window === 'undefined') return;
            window.localStorage.removeItem(name);
          } catch (err) {
            ErrorHandler.handleStorageError('removeItem', err as Error);
          }
        },
      },
    }
  )
);
