'use client';

import { useState, useEffect } from 'react';
import DiagramViewer from './DiagramViewer';

interface FlowDiagramProps {
  flowType?: 'auth' | 'customer' | 'order' | 'sms';
}

export default function FlowDiagram({ flowType = 'auth' }: FlowDiagramProps) {
  const [diagramSource, setDiagramSource] = useState<string>('');

  useEffect(() => {
    // Load flow diagram based on type
    const filename = `flows_${flowType}-flow.md_01.mmd`;
    fetch(`/diagrams/${filename}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (text.trim()) {
          setDiagramSource(text);
        } else {
          throw new Error('Empty diagram source');
        }
      })
      .catch((err) => {
        console.error('Failed to load flow diagram:', err);
        setDiagramSource('sequenceDiagram\n    participant A\n    A->>B: Error: Could not load diagram');
      });
  }, [flowType]);

  return <DiagramViewer diagramSource={diagramSource} diagramType="flow" />;
}
