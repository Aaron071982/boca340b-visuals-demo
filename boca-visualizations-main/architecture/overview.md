# Architecture Overview

The Boca 340B Insights system follows a layered architecture pattern with clear separation of concerns.

## System Layers

1. **UI Layer**: Blade templates + Vue 2 components
2. **Routing Layer**: Web routes (`/admin/*`) and API routes (`/api/v1/*`)
3. **Controller Layer**: Backend, Frontend, and API controllers
4. **Repository Layer**: Data access abstraction
5. **Service Layer**: Business logic and external integrations
6. **Model Layer**: Eloquent ORM with multi-database support
7. **Database Layer**: Central DB (users, locations) + Tenant DBs (customers, orders, inventory)

## High-Level Architecture Diagram

```mermaid
graph TD
    A[Browser/Client] -->|HTTPS| B[public/index.php]
    B --> C[Laravel Bootstrap]
    C --> D[app/Http/Kernel.php]
    
    D -->|Web Routes| E[routes/web.php]
    D -->|API Routes| F[routes/api.php]
    
    E -->|/admin/*| G[Backend Controllers]
    E -->|/login| H[CustomAuthController]
    
    F -->|/api/v1/*| J[Api/V1 Controllers]
    
    G --> L[Backend Repositories]
    J --> M[Api Repositories]
    
    L --> N[Eloquent Models]
    M --> N
    
    N -->|Central DB| O[(mysql: users, roles, locations)]
    N -->|Tenant DB| P[(Dynamic DB: customers, orders, inventory)]
    
    G --> Q[Services]
    Q --> R[OtpServices]
    Q --> S[FedExWebServices]
    
    Q --> T[Mailgun API]
    Q --> U[Twilio/Vonage/RingCentral]
    Q --> V[Square SDK]
    Q --> W[FedEx API]
    
    H -->|OTP SMS/Email| T
    
    D -->|Middleware| X[auth: session]
    D -->|Middleware| Y[auth:api: Passport]
    
    A -->|SPA/Vue 2| AA[Blade + Vue Components]
    AA -->|AJAX| E
    AA -->|AJAX| F
    
    style O fill:#e1f5ff
    style P fill:#fff4e1
    style T fill:#ffe1f5
    style U fill:#ffe1f5
    style V fill:#ffe1f5
    style W fill:#ffe1f5
```

## Key Architectural Patterns

- **Multi-Database Tenancy**: Models dynamically select DB connections based on session `userLocation`
- **Repository Pattern**: Controllers → Repositories → Models
- **Service Layer**: Business logic extracted to Services (OtpServices, FedExWebServices)
- **Event-Driven**: Events/Listeners for side effects (emails, notifications)

## Data Flow

**Web Admin Flow:**
```
User → /login → CustomAuthController → OTP → Session (userLocation) 
→ /admin/dashboard → Backend Controllers → Repositories → Models → Tenant DB
```

**API Flow:**
```
Client → /api/v1/auth/login → Passport Token → /api/v1/* 
→ Api Controllers → Repositories → Models → DB
```
