'use client';

import { useState, useEffect } from 'react';
import { useVisualizationStore } from '@/lib/store';
import { eventProcessor } from '@/lib/event-processor';
import { eventStreamClient } from '@/lib/event-stream';
import { streamMockEvents } from '@/lib/mock-api';
import { ErrorHandler } from '@/lib/error-handler';
import ArchitectureDiagram from '@/components/Diagrams/ArchitectureDiagram';
import DependencyDiagram from '@/components/Diagrams/DependencyDiagram';
import ERDDiagram from '@/components/Diagrams/ERDDiagram';
import FlowDiagram from '@/components/Diagrams/FlowDiagram';
import DemoWebsite from '@/components/DemoUI/DemoWebsite';
import ReplayPanel from '@/components/ReplayPanel';
import { ErrorBoundary } from '@/components/ErrorBoundary';

type DiagramType = 'architecture' | 'dependencies' | 'erd' | 'flow';
type DemoPage = 
  | 'dashboard' 
  | 'total-patients' 
  | 'new-patients' 
  | 'new-enrollments' 
  | 'lost-patients'
  | 'recon-details' 
  | 'transaction-details' 
  | 'purchases' 
  | 'essentials' 
  | 'savings' 
  | 'inventory' 
  | 'hrsa' 
  | 'shipping' 
  | 'esp-data' 
  | 'manage-admins'
  | 'settings'
  | 'help'
  | 'login';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<DemoPage>('dashboard');
  const [isGraphPaneCollapsed, setIsGraphPaneCollapsed] = useState(false);
  const currentDiagram = useVisualizationStore((state) => state.currentDiagram);
  const setCurrentDiagram = useVisualizationStore((state) => state.setCurrentDiagram);
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
        ErrorHandler.handleConnectionError('Failed to connect to Laravel backend. Using mock mode.');
        setIsConnected(false);
      }
    }

    // Cleanup on unmount
    return () => {
      eventStreamClient.disconnect();
    };
  }, [setIsConnected]);

  const handleNavigation = async (page: DemoPage, endpoint: string, method: string = 'GET') => {
    // Only change page if it's a navigation action, not a form action
    if (page !== currentPage) {
      setCurrentPage(page);
    }

    // Trigger mock event stream if not connected to real backend
    if (!isConnected) {
      const requestId = `mock-req-${page}-${Date.now()}`;
      useVisualizationStore.getState().setActiveRequestId(requestId);

      await streamMockEvents(endpoint, (event) => {
        eventProcessor.processEvent(event);
        useVisualizationStore.getState().addEvent(event);
      }, method);
    }
  };

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

  // Special full-screen layout for login page
  if (currentPage === 'login') {
    return (
      <ErrorBoundary>
        <div className="h-screen w-screen">
          <DemoWebsite onNavigate={handleNavigation} />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen w-screen overflow-hidden relative">
      {/* Left Pane: Demo UI */}
      <div 
        className={`flex flex-col overflow-x-auto transition-all duration-300 ${
          isGraphPaneCollapsed ? '' : 'border-r border-gray-300'
        }`}
        style={{ 
          minWidth: '1280px', 
          width: isGraphPaneCollapsed ? '100%' : '1280px', 
          flexShrink: 0 
        }}
      >
        <DemoWebsite onNavigate={handleNavigation} />
      </div>

      {/* Toggle Button - Always visible */}
      <button
        onClick={() => setIsGraphPaneCollapsed(!isGraphPaneCollapsed)}
        className="btn-enhanced absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-blue-600 text-white p-3 rounded-l-lg shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
        style={{
          transform: isGraphPaneCollapsed 
            ? 'translateY(-50%) translateX(0)' 
            : 'translateY(-50%) translateX(0)',
          fontFamily: 'Roboto, sans-serif',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
        title={isGraphPaneCollapsed ? 'Show Graphs' : 'Hide Graphs'}
      >
        <i className={`bi ${isGraphPaneCollapsed ? 'bi-chevron-left' : 'bi-chevron-right'} text-xl`}></i>
      </button>

      {/* Right Pane: Diagrams */}
      <div 
        className={`flex flex-col transition-all duration-300 ${
          isGraphPaneCollapsed ? 'w-0 overflow-hidden' : 'flex-1'
        }`}
        style={{ 
          backgroundColor: '#ffffff',
          minWidth: isGraphPaneCollapsed ? 0 : 'auto',
        }}
      >
        <div
          className="text-white p-4 shadow-md"
          style={{
            backgroundColor: '#20a8d8',
            fontFamily: 'Poppins, sans-serif',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCurrentDiagram('architecture')}
              className={`diagram-tab px-4 py-2 rounded-md font-medium ${
                currentDiagram === 'architecture' ? 'active bg-white text-blue-600' : 'bg-blue-700 text-white'
              }`}
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Architecture
            </button>
            <button
              onClick={() => setCurrentDiagram('dependencies')}
              className={`diagram-tab px-4 py-2 rounded-md font-medium ${
                currentDiagram === 'dependencies' ? 'active bg-white text-blue-600' : 'bg-blue-700 text-white'
              }`}
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Dependencies
            </button>
            <button
              onClick={() => setCurrentDiagram('erd')}
              className={`diagram-tab px-4 py-2 rounded-md font-medium ${
                currentDiagram === 'erd' ? 'active bg-white text-blue-600' : 'bg-blue-700 text-white'
              }`}
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Database/ERD
            </button>
            <button
              onClick={() => setCurrentDiagram('flow')}
              className={`diagram-tab px-4 py-2 rounded-md font-medium ${
                currentDiagram === 'flow' ? 'active bg-white text-blue-600' : 'bg-blue-700 text-white'
              }`}
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Flow
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden relative">{renderDiagram()}</div>
        <ReplayPanel />
      </div>
    </div>
    </ErrorBoundary>
  );
}
