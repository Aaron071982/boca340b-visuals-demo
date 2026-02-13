'use client';

import { useState, useEffect } from 'react';
import DiagramViewer from './DiagramViewer';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorHandler } from '@/lib/error-handler';

interface FlowDiagramProps {
  flowType?: 'auth' | 'customer' | 'order' | 'sms';
}

type FlowType = 'auth' | 'customer' | 'order' | 'sms';

const flowTypes: { id: FlowType; label: string; filename: string }[] = [
  { id: 'auth', label: 'Authentication', filename: 'flows_auth-flow.md_01.mmd' },
  { id: 'customer', label: 'Customer', filename: 'flows_customer-flow.md_01.mmd' },
  { id: 'order', label: 'Order', filename: 'flows_order-flow.md_01.mmd' },
  { id: 'sms', label: 'SMS', filename: 'flows_inbound-sms-flow.md_01.mmd' },
];

export default function FlowDiagram({ flowType = 'auth' }: FlowDiagramProps) {
  const [selectedFlow, setSelectedFlow] = useState<FlowType>(flowType);
  const [diagramSource, setDiagramSource] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const flowConfig = flowTypes.find(f => f.id === selectedFlow);
    if (!flowConfig) {
      setLoading(false);
      return;
    }

    fetch(`/diagrams/${flowConfig.filename}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (text.trim()) {
          setDiagramSource(text);
          setLoading(false);
        } else {
          throw new Error('Empty diagram source');
        }
      })
      .catch((err) => {
        ErrorHandler.handleDiagramRenderError('flow', err as Error);
        setDiagramSource('sequenceDiagram\n    participant A\n    A->>B: Error: Could not load diagram');
        setLoading(false);
      });
  }, [selectedFlow]);

  return (
    <div className="h-full flex flex-col">
      {/* Flow Selector */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex gap-2 flex-wrap">
          {flowTypes.map((flow) => (
            <button
              key={flow.id}
              onClick={() => setSelectedFlow(flow.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                selectedFlow === flow.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              {flow.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Diagram Viewer */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Loading flow diagram..." />
        ) : (
          <DiagramViewer diagramSource={diagramSource} diagramType="flow" />
        )}
      </div>
    </div>
  );
}
