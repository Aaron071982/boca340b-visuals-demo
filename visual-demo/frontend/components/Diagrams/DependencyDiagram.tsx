'use client';

import { useState, useEffect } from 'react';
import DiagramViewer from './DiagramViewer';

export default function DependencyDiagram() {
  const [diagramSource, setDiagramSource] = useState<string>('');

  useEffect(() => {
    // Load dependency diagram
    fetch('/diagrams/architecture_dependency-graph.md_01.mmd')
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
        console.error('Failed to load dependency diagram:', err);
        setDiagramSource('graph LR\n    A[Error: Could not load diagram]');
      });
  }, []);

  return <DiagramViewer diagramSource={diagramSource} diagramType="dependencies" />;
}
