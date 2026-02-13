'use client';

import { useState } from 'react';
import { useVisualizationStore } from '@/lib/store';
import { eventProcessor } from '@/lib/event-processor';
import { streamMockEvents } from '@/lib/mock-api';
import { VisualizationEvent } from '@/lib/event-processor';
import { ExportUtils } from '@/lib/export-utils';

export default function ReplayPanel() {
  const requestHistory = useVisualizationStore((state) => state.requestHistory);
  const getAllRequestIds = useVisualizationStore((state) => state.getAllRequestIds);
  const getRequestEvents = useVisualizationStore((state) => state.getRequestEvents);
  const setIsReplaying = useVisualizationStore((state) => state.setIsReplaying);
  const isReplaying = useVisualizationStore((state) => state.isReplaying);
  const currentDiagram = useVisualizationStore((state) => state.currentDiagram);
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');

  const requestIds = getAllRequestIds();
  
  // Flatten all events from request history for export
  const allEvents: VisualizationEvent[] = [];
  requestHistory.forEach((events) => {
    allEvents.push(...events);
  });

  const handleReplay = async () => {
    if (!selectedRequestId) return;

    setIsReplaying(true);
    eventProcessor.clearAll();

    const events = getRequestEvents(selectedRequestId);
    if (events.length === 0) return;

    // Replay events with original timing
    let lastTimestamp = events[0].timestamp;

    for (const event of events) {
      const delay = event.timestamp - lastTimestamp;
      if (delay > 0 && delay < 10000) {
        // Cap delay at 10 seconds
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      eventProcessor.processEvent(event);
      lastTimestamp = event.timestamp;
    }

    setIsReplaying(false);
  };

  return (
    <div className="panel-enhanced p-4 border-t border-gray-200" style={{ backgroundColor: '#f8f9fa' }}>
      <h3 className="text-sm font-semibold mb-3" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
        Request Replay
      </h3>
      <div className="flex gap-2 mb-3">
        <select
          value={selectedRequestId}
          onChange={(e) => setSelectedRequestId(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={requestIds.length === 0 || isReplaying}
          style={{ fontFamily: 'Roboto, sans-serif', backgroundColor: '#ffffff' }}
        >
          <option value="">Select a request to replay...</option>
          {requestIds.map((requestId) => {
            const events = getRequestEvents(requestId);
            const firstEvent = events[0];
            const endpoint = firstEvent?.endpointId || requestId;
            const timestamp = firstEvent?.timestamp
              ? new Date(firstEvent.timestamp).toLocaleTimeString()
              : '';
            return (
              <option key={requestId} value={requestId}>
                {endpoint} - {timestamp} ({events.length} events)
              </option>
            );
          })}
        </select>
        <button
          onClick={handleReplay}
          disabled={!selectedRequestId || isReplaying || requestIds.length === 0}
          className="btn-enhanced px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none text-sm text-white"
          style={{
            backgroundColor: '#20a8d8',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          {isReplaying ? 'Replaying...' : 'Replay'}
        </button>
        <button
          onClick={() => {
            eventProcessor.clearAll();
            setSelectedRequestId('');
          }}
          className="btn-enhanced px-4 py-2 rounded-md font-medium text-sm text-white"
          style={{
            backgroundColor: '#73818f',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          Clear
        </button>
      </div>
      
      {/* Export Buttons */}
      {allEvents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-300">
          <h4 className="text-xs font-semibold mb-3" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
            Export
          </h4>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => ExportUtils.exportRequestHistoryAsJSON(allEvents)}
              className="btn-enhanced px-4 py-2 rounded-md font-medium text-xs text-white"
              style={{
                backgroundColor: '#0B5ED7',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              Export JSON
            </button>
            <button
              onClick={() => ExportUtils.exportRequestHistoryAsCSV(allEvents)}
              className="btn-enhanced px-4 py-2 rounded-md font-medium text-xs text-white"
              style={{
                backgroundColor: '#28a745',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              Export CSV
            </button>
            <button
              onClick={() => ExportUtils.exportCurrentDiagram(currentDiagram)}
              className="btn-enhanced px-4 py-2 rounded-md font-medium text-xs text-white"
              style={{
                backgroundColor: '#F36F21',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              Export Diagram PNG
            </button>
          </div>
        </div>
      )}
      
      {requestIds.length > 0 && (
        <p className="text-xs mt-3 text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
          {requestIds.length} request{requestIds.length !== 1 ? 's' : ''} stored
        </p>
      )}
    </div>
  );
}
