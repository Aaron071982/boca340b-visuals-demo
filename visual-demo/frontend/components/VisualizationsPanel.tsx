'use client';

import { useState } from 'react';
import { useVisualizationStore } from '@/lib/store';
import ArchitectureDiagram from '@/components/Diagrams/ArchitectureDiagram';
import DependencyDiagram from '@/components/Diagrams/DependencyDiagram';
import ERDDiagram from '@/components/Diagrams/ERDDiagram';
import FlowDiagram from '@/components/Diagrams/FlowDiagram';
import ReplayPanel from '@/components/ReplayPanel';

type DiagramType = 'architecture' | 'dependencies' | 'erd' | 'flow';

export default function VisualizationsPanel() {
  const currentDiagram = useVisualizationStore((state) => state.currentDiagram);
  const setCurrentDiagram = useVisualizationStore((state) => state.setCurrentDiagram);
  const isConnected = useVisualizationStore((state) => state.isConnected);

  const renderDiagram = () => {
    switch (currentDiagram) {
      case 'architecture':
        return <ArchitectureDiagram />;
      case 'dependencies':
        return <DependencyDiagram />;
      case 'erd':
        return <ERDDiagram />;
      case 'flow':
        return <FlowDiagram flowType="auth" />;
      default:
        return <ArchitectureDiagram />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col" style={{ backgroundColor: '#0f1419' }}>
      {/* Diagram Tabs Header */}
      <div
        className="text-white px-6 py-4 border-b border-gray-700"
        style={{
          backgroundColor: '#1a1a1a',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        <div className="flex gap-2 flex-wrap items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDiagram('architecture')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                currentDiagram === 'architecture'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Architecture
            </button>
            <button
              onClick={() => setCurrentDiagram('dependencies')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                currentDiagram === 'dependencies'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Dependencies
            </button>
            <button
              onClick={() => setCurrentDiagram('erd')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                currentDiagram === 'erd'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Database/ERD
            </button>
            <button
              onClick={() => setCurrentDiagram('flow')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                currentDiagram === 'flow'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Flow
            </button>
          </div>
          <div className="text-sm">
            {isConnected ? (
              <span className="text-green-400">● Connected to Laravel</span>
            ) : (
              <span className="text-yellow-400">● Using Mock Data</span>
            )}
          </div>
        </div>
      </div>

      {/* Diagram Content - Full Screen */}
      <div className="flex-1 overflow-hidden relative" style={{ minHeight: 0 }}>
        {renderDiagram()}
      </div>

      {/* Replay Panel - Fixed at bottom */}
      <div style={{ flexShrink: 0 }}>
        <ReplayPanel />
      </div>
    </div>
  );
}
