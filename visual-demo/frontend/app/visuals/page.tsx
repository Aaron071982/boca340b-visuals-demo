'use client';

import { useEffect } from 'react';
import { useVisualizationStore } from '@/lib/store';
import { eventProcessor } from '@/lib/event-processor';
import { eventStreamClient } from '@/lib/event-stream';
import VisualizationsPanel from '@/components/VisualizationsPanel';

export default function VisualsPage() {
  const isConnected = useVisualizationStore((state) => state.isConnected);
  const setIsConnected = useVisualizationStore((state) => state.setIsConnected);

  useEffect(() => {
    // Try to connect to real Laravel backend, fallback to mock
    const laravelUrl = process.env.NEXT_PUBLIC_LARAVEL_URL;
    const useMock = !laravelUrl || laravelUrl === '';

    if (useMock) {
      setIsConnected(false);
    } else {
      // Connect to real SSE endpoint
      try {
        eventStreamClient.connect({
          onEvent: (event) => {
            eventProcessor.processEvent(event);
            useVisualizationStore.getState().addEvent(event);
          },
          onError: () => {
            setIsConnected(false);
          },
          onClose: () => {
            setIsConnected(false);
          },
        });
        setIsConnected(true);
      } catch (error) {
        console.warn('Failed to connect to Laravel backend, using mock mode:', error);
        setIsConnected(false);
      }
    }

    // Cleanup on unmount
    return () => {
      eventStreamClient.disconnect();
    };
  }, [setIsConnected]);

  return (
    <div className="h-screen w-screen">
      <VisualizationsPanel />
    </div>
  );
}
