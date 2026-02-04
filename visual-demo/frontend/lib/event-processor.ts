/**
 * Event processor that maps SSE events to diagram highlights
 */

import { highlightEngine, HighlightTarget } from './mermaid-highlight';
import diagramIdsData from './diagram-ids.json';
import buttonHighlightMapData from './button-highlight-map.json';

const diagramIds = diagramIdsData as Record<string, any>;
const buttonHighlightMap = buttonHighlightMapData as Record<string, any>;

export interface VisualizationEvent {
  request_id: string;
  endpointId: string;
  timestamp: number;
  phase: string;
  componentType: string;
  componentId: string;
  status: string;
  meta?: Record<string, any>;
}

export interface ActiveComponent {
  requestId: string;
  componentType: string;
  componentId: string;
  phase: string;
  timestamp: number;
}

class EventProcessor {
  private activeComponents: Map<string, ActiveComponent[]> = new Map();

  /**
   * Process a visualization event and apply highlights
   */
  processEvent(event: VisualizationEvent) {
    const { request_id, phase, componentType, componentId, status } = event;

    // Store active component
    if (!this.activeComponents.has(request_id)) {
      this.activeComponents.set(request_id, []);
    }

    const components = this.activeComponents.get(request_id)!;
    components.push({
      requestId: request_id,
      componentType,
      componentId,
      phase,
      timestamp: event.timestamp,
    });

    // Map event to diagram highlights
    const targets = this.mapEventToTargets(event);

    targets.forEach((target) => {
      highlightEngine.highlight(target);
    });
  }

  /**
   * Map an event to highlight targets
   */
  private mapEventToTargets(event: VisualizationEvent): HighlightTarget[] {
    const { phase, componentType, componentId, status, endpointId } = event;
    const targets: HighlightTarget[] = [];

    // Determine highlight state
    const highlightState: 'active' | 'dim' | 'error' =
      status === 'error' ? 'error' : phase.includes('exit') ? 'dim' : 'active';

    // First, try to use button-highlight-map.json for comprehensive mapping
    if (endpointId && buttonHighlightMap[endpointId]) {
      const mapping = buttonHighlightMap[endpointId];
      
      // Map based on component type and phase
      if (phase === 'route.matched' && mapping.architectureNodes) {
        mapping.architectureNodes.forEach((nodeId: string) => {
          targets.push({ nodeId, state: highlightState });
        });
      }
      
      if (phase === 'controller.enter' && mapping.dependencyNodes) {
        mapping.dependencyNodes.forEach((nodeId: string) => {
          targets.push({ nodeId, state: highlightState });
        });
      }
      
      if (phase === 'db.query' && mapping.erdTables) {
        mapping.erdTables.forEach((tableName: string) => {
          targets.push({ nodeId: tableName, state: highlightState });
        });
      }
      
      // Map external services for architecture/dependencies
      if (phase === 'external.call' && mapping.externalServices) {
        mapping.externalServices.forEach((serviceName: string) => {
          // Map to architecture and dependency nodes
          if (mapping.architectureNodes) {
            mapping.architectureNodes.forEach((nodeId: string) => {
              targets.push({ nodeId, state: highlightState });
            });
          }
          if (mapping.dependencyNodes) {
            mapping.dependencyNodes.forEach((nodeId: string) => {
              targets.push({ nodeId, state: highlightState });
            });
          }
        });
      }
      
      // Map flow steps for sequence diagrams
      if (mapping.flowSteps && (phase === 'controller.enter' || phase === 'db.query' || phase === 'external.call')) {
        mapping.flowSteps.forEach((stepName: string) => {
          targets.push({ nodeId: stepName, state: highlightState });
        });
      }
      
      // If we found targets from button-highlight-map, return them
      if (targets.length > 0) {
        return targets;
      }
    }
    
    // Fallback: Map component to diagram node IDs using diagram-ids.json
    const nodeIds = this.getNodeIdsForComponent(componentId, componentType);
    nodeIds.forEach(({ diagramType, nodeId }) => {
      targets.push({
        nodeId,
        state: highlightState,
      });
    });
    
    // Also try to map componentId directly to flow steps for sequence diagrams
    if (componentId && (componentType === 'controller' || componentType === 'database' || componentType === 'external')) {
      // Try to match componentId to flow diagram participants
      const flowStepName = componentId.split('\\').pop()?.replace('Controller', '').replace('Model', '').replace('Service', '').replace(' API', '') || componentId;
      // Clean up common suffixes
      const cleanName = flowStepName.replace(/Controller$/, '').replace(/Model$/, '').replace(/Service$/, '').replace(/ API$/, '');
      targets.push({ nodeId: cleanName, state: highlightState });
      
      // For external services, also try exact match
      if (componentType === 'external') {
        targets.push({ nodeId: componentId, state: highlightState });
      }
    }

    return targets;
  }

  /**
   * Get node IDs for a component across different diagram types
   */
  private getNodeIdsForComponent(
    componentId: string,
    componentType: string
  ): Array<{ diagramType: string; nodeId: string }> {
    const nodeIds: Array<{ diagramType: string; nodeId: string }> = [];

    // Check diagram-ids.json mapping
    const mapping = diagramIds[componentId];
    if (mapping) {
      if (mapping.architecture) {
        nodeIds.push({ diagramType: 'architecture', nodeId: mapping.architecture });
      }
      if (mapping.dependencies) {
        nodeIds.push({ diagramType: 'dependencies', nodeId: mapping.dependencies });
      }
      if (mapping.flow) {
        nodeIds.push({ diagramType: 'flow', nodeId: mapping.flow });
      }
      if (mapping.erd) {
        nodeIds.push({ diagramType: 'erd', nodeId: mapping.erd });
      }
    }

    // Fallback: try to infer from component type
    if (nodeIds.length === 0) {
      if (componentType === 'database' || componentType === 'table') {
        nodeIds.push({ diagramType: 'erd', nodeId: componentId });
      } else if (componentType === 'controller') {
        nodeIds.push({ diagramType: 'architecture', nodeId: 'G' }); // Backend Controllers
        nodeIds.push({ diagramType: 'dependencies', nodeId: 'BC' });
      } else if (componentType === 'route') {
        nodeIds.push({ diagramType: 'architecture', nodeId: 'E' }); // routes/web.php
        nodeIds.push({ diagramType: 'dependencies', nodeId: 'WR' });
      } else if (componentType === 'external') {
        // Map external services to architecture nodes
        if (componentId.includes('FedEx') || componentId === 'FedEx API') {
          nodeIds.push({ diagramType: 'architecture', nodeId: 'W' });
          nodeIds.push({ diagramType: 'dependencies', nodeId: 'SHIP' });
          nodeIds.push({ diagramType: 'flow', nodeId: 'FedEx API' });
        } else if (componentId.includes('Twilio') || componentId.includes('SMS')) {
          nodeIds.push({ diagramType: 'architecture', nodeId: 'U' });
          nodeIds.push({ diagramType: 'dependencies', nodeId: 'SMS' });
          nodeIds.push({ diagramType: 'flow', nodeId: 'Twilio' });
        } else if (componentId.includes('Mailgun')) {
          nodeIds.push({ diagramType: 'architecture', nodeId: 'T' });
          nodeIds.push({ diagramType: 'dependencies', nodeId: 'MAIL' });
          nodeIds.push({ diagramType: 'flow', nodeId: 'Mailgun' });
        } else {
          nodeIds.push({ diagramType: 'architecture', nodeId: componentId });
        }
      }
    }

    return nodeIds;
  }

  /**
   * Get active components for a request
   */
  getActiveComponents(requestId: string): ActiveComponent[] {
    return this.activeComponents.get(requestId) || [];
  }

  /**
   * Clear highlights for a request
   */
  clearRequest(requestId: string) {
    const components = this.activeComponents.get(requestId) || [];
    components.forEach((component) => {
      const targets = this.mapEventToTargets({
        request_id: requestId,
        endpointId: '',
        timestamp: component.timestamp,
        phase: component.phase,
        componentType: component.componentType,
        componentId: component.componentId,
        status: 'success',
      });

      targets.forEach((target) => {
        highlightEngine.clearHighlight({ ...target, state: 'none' });
      });
    });

    this.activeComponents.delete(requestId);
  }

  /**
   * Clear all highlights
   */
  clearAll() {
    this.activeComponents.clear();
    highlightEngine.clearAll();
  }
}

export const eventProcessor = new EventProcessor();
