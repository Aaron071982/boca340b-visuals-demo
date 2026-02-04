# Boca Visualizations Demo

A professional demo website that visualizes request flows through the Boca 340B Insights system architecture, dependencies, database, and request sequences in real-time using interactive Mermaid diagrams.

## Overview

This demo application provides a split-screen interface:
- **Left Pane**: Interactive demo UI that mimics the Boca site (dashboard, customers, orders, login)
- **Right Pane**: Live Mermaid diagrams (Architecture, Dependencies, ERD, Flow) that highlight in real-time as users interact with the demo

When you click any link/button in the demo UI, the relevant parts of all diagrams highlight automatically, showing:
- Architecture graph: server → controller → service → repo → DB → external
- Dependencies graph: module/class boundaries and key call edges
- ERD: tables + relation edges affected (reads/writes)
- Flow: step-by-step sequence of the request with timing

## Features

- **Real-time Highlighting**: Diagrams highlight automatically based on runtime instrumentation events
- **Hybrid Mode**: Works standalone with mock data, or connects to real Laravel backend
- **Request Replay**: Store and replay the last 50 requests to see highlights in action
- **Multiple Diagram Types**: Architecture, Dependencies, Database ERD, and Flow diagrams
- **Professional UI**: Boca-style admin interface with Tailwind CSS

## Project Structure

```
visual-demo/
├── frontend/                 # Next.js 14 application
│   ├── app/                 # Next.js app directory
│   │   ├── page.tsx         # Main split-screen layout
│   │   └── globals.css      # Styles including Mermaid highlight CSS
│   ├── components/
│   │   ├── DemoUI/          # Boca-style admin UI components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CustomersTable.tsx
│   │   │   ├── OrdersTable.tsx
│   │   │   └── LoginForm.tsx
│   │   ├── Diagrams/        # Mermaid diagram components
│   │   │   ├── DiagramViewer.tsx
│   │   │   ├── ArchitectureDiagram.tsx
│   │   │   ├── DependencyDiagram.tsx
│   │   │   ├── ERDDiagram.tsx
│   │   │   └── FlowDiagram.tsx
│   │   └── ReplayPanel.tsx  # Request replay UI
│   ├── lib/
│   │   ├── mermaid-highlight.ts    # CSS-based highlight engine
│   │   ├── event-processor.ts      # Maps events to diagram highlights
│   │   ├── event-stream.ts          # SSE client
│   │   ├── mock-api.ts              # Mock API and events
│   │   ├── store.ts                 # Zustand state management
│   │   └── diagram-ids.json         # Component → Mermaid node ID mapping
│   └── public/
│       └── diagrams/        # Mermaid source files (.mmd)
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- (Optional) PHP 8.1+ and Composer if connecting to Laravel backend

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd visual-demo/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Set Laravel backend URL in `.env.local`:
   ```env
   NEXT_PUBLIC_LARAVEL_URL=http://localhost:8000
   ```
   If not set, the app will use mock data automatically.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Laravel Backend Setup (Optional)

If you want to connect to the real Laravel backend:

1. Navigate to the Laravel app:
   ```bash
   cd ../boca340binsights.com-main
   ```

2. Install dependencies (if not already done):
   ```bash
   composer install
   ```

3. Export routes:
   ```bash
   php artisan visualizations:export-routes
   ```

4. Build highlight specification:
   ```bash
   php artisan visualizations:build-highlight-spec
   ```

5. Start Laravel server:
   ```bash
   php artisan serve
   ```

6. The frontend will automatically connect if `NEXT_PUBLIC_LARAVEL_URL` is set.

## Usage

### Basic Usage

1. **Navigate the Demo UI**: Click buttons in the left pane (Dashboard, Customers, Orders, Login)
2. **Watch Diagrams Highlight**: The right pane diagrams automatically highlight relevant components
3. **Switch Diagram Views**: Use the tabs (Architecture, Dependencies, ERD, Flow) to see different perspectives
4. **Replay Requests**: Use the Replay Panel at the bottom to replay previous requests

### Mock Mode (Standalone)

When `NEXT_PUBLIC_LARAVEL_URL` is not set, the app runs in mock mode:
- All API calls return mock data
- Events are generated with realistic timing
- No Laravel backend required

### Real Backend Mode

When connected to Laravel:
- Real requests trigger instrumentation events
- Events stream via Server-Sent Events (SSE)
- Database queries, controller calls, and external services are tracked automatically

## How to Add New Diagrams

1. **Add Mermaid Source File**:
   - Place your `.mmd` file in `frontend/public/diagrams/`
   - Example: `frontend/public/diagrams/my-diagram.mmd`

2. **Create Diagram Component**:
   - Create a new component in `frontend/components/Diagrams/`
   - Follow the pattern from `ArchitectureDiagram.tsx`:
   ```tsx
   'use client';
   import { useState, useEffect } from 'react';
   import DiagramViewer from './DiagramViewer';

   export default function MyDiagram() {
     const [diagramSource, setDiagramSource] = useState<string>('');
     useEffect(() => {
       fetch('/diagrams/my-diagram.mmd')
         .then((res) => res.text())
         .then(setDiagramSource);
     }, []);
     return <DiagramViewer diagramSource={diagramSource} diagramType="architecture" />;
   }
   ```

3. **Add to Main Page**:
   - Import and add to the diagram tabs in `app/page.tsx`

## How to Add Highlight Mappings

### Method 1: Update diagram-ids.json (Recommended)

Edit `frontend/lib/diagram-ids.json` to map component names to Mermaid node IDs:

```json
{
  "YourController": {
    "architecture": "nodeIdInArchDiagram",
    "dependencies": "nodeIdInDepDiagram",
    "flow": "nodeIdInFlowDiagram",
    "erd": "tableName"
  }
}
```

### Method 2: Runtime Instrumentation (Automatic)

The Laravel backend automatically maps:
- Controllers → Architecture/Dependencies nodes
- Database tables → ERD nodes
- External services → Architecture nodes

### Method 3: Update highlightSpec.json (Laravel)

1. Run `php artisan visualizations:build-highlight-spec`
2. Edit `storage/app/visualizations/highlightSpec.json`
3. Add mappings with confidence scores:
   ```json
   {
     "routes": {
       "/your/route": {
         "controller": "YourController",
         "method": "index",
         "confidence": 1.0,
         "tables": ["your_table"],
         "externalServices": ["Mailgun"]
       }
     }
   }
   ```

## How Highlighting Works

1. **Event Generation**: Laravel middleware and instrumentation emit structured events
2. **Event Streaming**: Events stream to frontend via SSE (or mock events)
3. **Event Processing**: `event-processor.ts` maps events to diagram node IDs
4. **CSS Highlighting**: `mermaid-highlight.ts` toggles CSS classes on SVG elements
5. **Auto-Decay**: Highlights automatically clear after 5 seconds

### Highlight States

- **Active** (blue glow): Component is currently active
- **Dim** (reduced opacity): Component just exited
- **Error** (red outline): Error occurred in component

## Configuration

### Environment Variables

- `NEXT_PUBLIC_LARAVEL_URL`: Laravel backend URL (default: uses mock mode)

### Highlight Engine Settings

Edit `lib/mermaid-highlight.ts`:
- `DECAY_TIME`: Time before highlights clear (default: 5000ms)

### State Management

The app uses Zustand for state management. See `lib/store.ts` for available state.

## Troubleshooting

### Diagrams Not Highlighting

1. Check browser console for errors
2. Verify diagram-ids.json has correct mappings
3. Ensure Mermaid diagrams have stable node IDs
4. Check that events are being received (see connection status in UI)

### Events Not Streaming

1. Verify Laravel backend is running
2. Check `NEXT_PUBLIC_LARAVEL_URL` is set correctly
3. Check browser console for SSE connection errors
4. Verify `/visualizations/events` endpoint is accessible

### Diagram Not Rendering

1. Check that `.mmd` file exists in `public/diagrams/`
2. Verify Mermaid syntax is valid
3. Check browser console for Mermaid errors

## Architecture

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Mermaid**: Diagram rendering
- **Zustand**: State management
- **EventSource API**: SSE client

### Backend (Laravel)

- **VisualizationMiddleware**: Generates request IDs
- **VisualizationEventService**: Emits structured events
- **VisualizationServiceProvider**: DB query listener
- **VisualizationController**: SSE endpoint
- **Controller Instrumentation**: Auto-tracks controller calls

## Development

### Running in Development Mode

```bash
cd visual-demo/frontend
npm run dev
```

### Building for Production

```bash
cd visual-demo/frontend
npm run build
npm start
```

### Adding New Demo Pages

1. Create component in `components/DemoUI/`
2. Add route handler in `app/page.tsx`
3. Add navigation button
4. Add mock events in `lib/mock-api.ts` (if using mock mode)

## License

This project is part of the Boca 340B Insights visualization system.
