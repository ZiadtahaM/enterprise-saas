# Enterprise-SaaS

A multi-tenant enterprise management platform delivering two business operations suites: a commercial real estate deal CRM and a client contracts and billing portal.

## Overview

Enterprise-SaaS combines industry-specific enterprise workflows behind a unified monorepo architecture:
1. **Property Brokerage & Deal Flow Suite (`al` module)**: Real estate property cataloging, lead intake pipeline, deal negotiation stages, and automated reminder tracking.
2. **Professional Services & Retainer Hub (`pf` module)**: Client engagement lifecycle management covering proposal generation, deposit milestones, contract signing status, and retainer invoices.

## Monorepo Architecture

Structured as a pnpm workspace with domain-partitioned frontend applications and dedicated backend services:

```
Enterprise-SaaS/
├── artifacts/
│   ├── frontend/                  # Multi-tenant React Application
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── al/                  # Real Estate Deal & Property Management
│   │   │   │   │   ├── AlDashboardPage.tsx   # Property pipeline metrics and deal velocity
│   │   │   │   │   ├── AlPropertiesPage.tsx  # Asset catalog, zoning, square footage
│   │   │   │   │   ├── AlLeadsPage.tsx       # Buyer and tenant lead scoring
│   │   │   │   │   ├── AlDealsPage.tsx       # Multi-stage contract negotiation pipeline
│   │   │   │   │   └── AlRemindersPage.tsx   # Critical milestone and inspection alerts
│   │   │   │   ├── pf/                  # Professional Services & Contract Management
│   │   │   │   │   ├── PfDashboardPage.tsx   # Retainer billing and account overview
│   │   │   │   │   ├── PfClientsPage.tsx     # Enterprise client directory and tiers
│   │   │   │   │   ├── PfProposalsPage.tsx   # Scope of work builder and proposals
│   │   │   │   │   ├── PfContractsPage.tsx   # Executed contracts and compliance records
│   │   │   │   │   └── PfDepositsPage.tsx    # Escrow and milestone deposit tracking
│   │   │   │   └── auth/                # Session login and multi-tenant selection
│   │   │   ├── components/              # Radix UI primitives and data table components
│   │   │   └── index.css                # Enterprise design tokens and Tailwind utility layers
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json
│   ├── api-server/                # Express Backend Service
│   │   ├── src/
│   │   │   ├── routes/                  # Modular domain route bindings
│   │   │   ├── middleware/              # Tenant identification & token validation
│   │   │   ├── lib/logger.ts            # Pino structured HTTP logger
│   │   │   ├── app.ts                   # Express application setup
│   │   │   └── index.ts                 # Bootstrap
│   │   └── package.json
│   ├── mockup-sandbox/            # Prototyping sandbox for interface experiments
│   └── menustack/                 # Reusable multi-level navigation engine
├── server.cjs                     # Production server entrypoint
├── pnpm-workspace.yaml            # Monorepo configuration
└── package.json
```

## Technology Stack

| Layer | Technologies |
|-------|--------------|
| Presentation | React 18, TypeScript, Tailwind CSS, Lucide Icons |
| Routing | Wouter |
| Component Primitives | Radix UI, shadcn/ui patterns |
| Backend | Node.js, Express, Pino Structured Logger |
| Multi-Tenancy | Header-driven tenant segregation with scoped data filters |
| Workspace Engine | pnpm workspace |
| Bundler | Vite, esbuild |

## Core Workflows

### 1. Real Estate Deal Pipeline (`/al/deals`)
- Tracks property transactions through intake, inspection, escrow, and closing stages.
- Connects buyer leads with listed commercial units.
- Evaluates square-footage yields and lease duration metrics.

### 2. Retainer & Contract Tracking (`/pf/contracts`)
- Tracks engagement proposals through signature, deposit funding, and delivery.
- Monitors deposit milestones to prevent un-funded service delivery.
- Generates invoice audit records.

## Local Setup

```bash
# Install workspace dependencies
pnpm install

# Start the enterprise web console
pnpm --filter frontend dev

# Start the backend API service
pnpm --filter api-server dev

# Type check across all packages
pnpm check
```
