'use client';

import { useState, useEffect } from 'react';
import DiagramViewer from './DiagramViewer';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorHandler } from '@/lib/error-handler';

export default function ArchitectureDiagram() {
  const [diagramSource, setDiagramSource] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Load architecture diagram
    fetch('/diagrams/architecture_architecture.md_01.mmd')
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
        const errorMessage = err instanceof Error ? err.message : 'Failed to load architecture diagram';
        ErrorHandler.handleDiagramRenderError('architecture', errorMessage);
        setError(errorMessage);
        setLoading(false);
        setDiagramSource('graph TD\n    A[Error: Could not load diagram]');
      });
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading architecture diagram..." />;
  }

  if (error && !diagramSource) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-yellow-50 p-8">
        <div className="text-center max-w-md">
          <p className="text-yellow-800 mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors font-medium"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <DiagramViewer diagramSource={diagramSource} diagramType="architecture" />;
}
