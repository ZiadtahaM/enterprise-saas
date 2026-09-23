# ProposalForge & AgentLead

Two production-grade SaaS products in one monolith.

## Products
- **ProposalForge** — proposal/contract/deposit generator for freelancers & agencies
- **AgentLead** — real estate micro-CRM

## Architecture

### Stack
- **Backend**: Express 5 + Drizzle ORM + PostgreSQL + JWT + bcryptjs
- **Frontend**: React + Vite + Wouter + TanStack Query + Tailwind + shadcn/ui
- **API Layer**: OpenAPI spec → generated Zod schemas + React Query hooks

### Key Design Decision: Express + Vite Middleware
The frontend is served directly from the api-server via Vite's `createServer({ middlewareMode: true })` in development and `express.static` in production. This was required because Replit's `kind="web"` artifact port detection has a platform bug (deadlock at `/` path during health check). The `kind="api"` artifact (api-server) works correctly and now serves everything.

### Service Routing
- `artifacts/api-server` (`kind="api"`, port 8080) — serves ALL paths (`/`)
  - `/api/*` → Express router (REST API)
  - `/*` → Vite middleware (React SPA in dev) or static files (prod)
- `artifacts/frontend` (`kind="web"`, port 8082) — disabled, paths=["/dev-disabled"]; serves as build artifact only
- `artifacts/mockup-sandbox` (`kind="design"`, port 8081) — Canvas component previews

## Project Structure

```
artifacts/
  api-server/      — Express server + Vite middleware
    src/
      index.ts     — Entry: Vite middleware (dev) or static (prod) + listen
      app.ts       — Express setup, /api router
      routes/      — All route handlers
      lib/         — auth, logger helpers
  frontend/        — React SPA (source only, served via api-server)
    src/
      App.tsx      — Router with auth guard
      pages/
        auth/      — Login, Register
        pf/        — ProposalForge pages (dashboard, clients, proposals, contracts, deposits)
        al/        — AgentLead pages (dashboard, properties, leads, deals, reminders)
      components/  — Shared UI components
      contexts/    — AuthContext
      hooks/       — Custom hooks
      lib/         — queryClient, utils
  mockup-sandbox/  — Canvas design previews
lib/
  db/              — Drizzle ORM schemas (9 tables), migrations
  api-spec/        — OpenAPI spec + codegen
  api-zod/         — Generated Zod validation schemas
  api-client-react/ — Generated TanStack Query hooks
scripts/           — Shared utility scripts
```

## Database Schema (9 tables)
- `users` — authentication
- `pf_clients` — ProposalForge clients
- `pf_proposals` — proposals with line items
- `pf_contracts` — contracts
- `pf_deposits` — deposit invoices
- `al_properties` — real estate properties
- `al_leads` — leads/contacts
- `al_deals` — deals (links leads to properties)
- `al_reminders` — follow-up reminders

## API Routes
All routes under `/api`:
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- CRUD `/api/pf/clients`, `/api/pf/proposals`, `/api/pf/contracts`, `/api/pf/deposits`
- CRUD `/api/al/properties`, `/api/al/leads`, `/api/al/deals`, `/api/al/reminders`
- `GET /api/healthz`

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (provisioned)
- `SESSION_SECRET` — JWT signing secret
- `PORT` — Server port (8080 for api-server)

## Development
- Start: `restart_workflow "artifacts/api-server: API Server"`
- The frontend workflow (`artifacts/frontend: web`) is expected to show as "failed" — this is normal; frontend is served via api-server
- DB migrations: `pnpm --filter @workspace/db run migrate`
- API codegen: `pnpm --filter @workspace/api-spec run codegen`
