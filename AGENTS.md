# AGENTS.md

**Last Updated:** December 16, 2025

This document serves as a living guide for AI agents working on the checkPAD project. It should be updated whenever significant changes occur in architecture, dependencies, or conventions.

> **Living Documentation**: Both **AGENTS.md** (this file) and **README.md** are living documents that must be kept synchronized with the codebase. When making significant changes, update both files accordingly.

---

## Project Overview

**checkPAD** is a modern full-stack web application built with TanStack Start (React-based meta-framework) and PostgreSQL. The application uses local-first architecture with ElectricSQL for real-time data synchronization.

### Tech Stack

- **Framework:** TanStack Start (React 19)
- **Build Tool:** Vite 7
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL 18 (Alpine)
- **ORM:** Drizzle ORM
- **Styling:** Chakra UI v3
- **Routing:** TanStack Router (file-based)
- **State Management:** TanStack React DB, TanStack React Form, TanStack React Table
- **Deployment:** Cloudflare Workers (via Wrangler)
- **Runtime:** Node.js 24.12.0 (managed via Volta)

---

## Architecture

### Application Type

- **Full-stack SSR application** with local-first capabilities
- React Server Components architecture via TanStack Start
- ElectricSQL for local-first sync between Postgres and client

### Project Structure

```
checkpad/
├── src/
│   ├── routes/              # File-based routing (auto-generated route tree)
│   │   ├── __root.ts        # Root route with layout
│   │   └── index.ts         # Home page route
│   ├── components/
│   │   ├── core/            # Core application components (Header, Root)
│   │   ├── maintenance/     # Feature-specific components (Dashboard)
│   │   └── ui/              # UI primitives and providers (Chakra UI)
│   ├── db/
│   │   ├── schema.ts        # Drizzle database schema
│   │   └── index.ts         # Database client setup
│   ├── db-collections/      # ElectricSQL collections
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # External service integrations
│   ├── router.ts            # Router configuration
│   └── routeTree.gen.ts     # Auto-generated (DO NOT EDIT)
├── public/                  # Static assets
├── drizzle/                 # Migration files (generated)
└── docker-compose.yml       # Local development services
```

### Key Architectural Patterns

1. **File-Based Routing:** Routes are defined as files in `src/routes/`. The route tree is auto-generated.
2. **Component Organization:**
   - `core/`: Application-level components
   - `maintenance/`: Feature modules
   - `ui/`: Reusable UI components and providers
3. **Database-First:** Schema defined in `src/db/schema.ts`, migrations via Drizzle Kit
4. **Local-First Sync:** ElectricSQL for real-time data synchronization

---

## Development Workflow

### TDD (Test-Driven Development)

This project follows **Test-Driven Development** practices:

1. **Write tests first** before implementing features
2. **Testing Framework:** Vitest with React Testing Library
3. **Test Location:** Co-located with source files (`.test.ts` or `.spec.ts`)
4. **Pre-commit Testing:** Lint-staged runs tests on changed files before commit

**Test Commands:**

```bash
npm run test          # Run all tests
vitest related --run  # Run tests related to changed files
```

**Current State:** Test infrastructure is configured but test files are not yet present. When adding features, create corresponding test files first.

### Git Workflow

**Commit Conventions:**

- Uses **Conventional Commits** (enforced by commitlint)
- Format: `type(scope): subject`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Max subject length: 100 characters
- Max body line length: 200 characters

**Pre-commit Hooks (Husky + lint-staged):**

- Auto-format TypeScript/React files with Prettier
- Lint with ESLint (zero warnings enforced)
- Run related tests for changed files
- Format other files (CSS, MD, JSON, HTML)

### Development Environment

**Prerequisites:**

- Node.js 24.12.0 (Volta managed)
- Docker & Docker Compose (for local services)

**Environment Setup:**

1. Copy `.env.example` to `.env`
2. Start services: `docker compose up -d`
3. Install dependencies: `npm install`
4. Generate DB schema: `npm run db:generate`
5. Push to DB: `npm run db:push`
6. Start dev server: `npm run dev` (port 3000)

**Docker Services:**

- **PostgreSQL** (port 5432): Main database
- **pgAdmin** (port 5050): Database management UI
- **ElectricSQL** (port 3000): Sync service

---

## Code Conventions

### TypeScript

**Configuration Highlights:**

- **Strict mode enabled** (`strict: true`)
- **Path aliases:** Use `@/*` for `src/*` imports
- **Module resolution:** `bundler`
- **Target:** ES2022
- **Unused variables/parameters:** Not allowed
- **No unchecked side effects:** Enforced

**Import Style:**

```typescript
// Prefer absolute imports with @/ alias
import { Component } from '@/components/ui/component'

// Not relative imports
import { Component } from '../../components/ui/component'
```

### Formatting (Prettier)

- **No semicolons** (`semi: false`)
- **Single quotes** for strings
- **Trailing commas** everywhere
- **Auto-formatted** on save and pre-commit

### Linting (ESLint)

- Uses **TanStack ESLint config** (`@tanstack/eslint-config`)
- **Zero warnings policy** enforced in lint-staged
- Run `npm run check` to auto-fix issues

### React Conventions

- **React 19** with React Compiler (Babel plugin enabled)
- **Functional components** only
- **Hooks:** Use TanStack hooks for forms, tables, router
- **Styling:** Chakra UI components only
- **Theme:** Dark/light mode via `next-themes`

---

## Database

### Schema Management (Drizzle)

**Schema Location:** `src/db/schema.ts`

**Example Schema:**

```typescript
import {
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const maintenanceCases = pgTable('maintenance_cases', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  estimatedHours: numeric('estimated_hours', { precision: 10, scale: 2 }),
  estimatedCosts: numeric('estimated_costs', { precision: 12, scale: 2 }),
  plannedStart: timestamp('planned_start'),
  plannedEnd: timestamp('planned_end'),
  offerCreatedBy: text('offer_created_by'),
  offerCreatedAt: timestamp('offer_created_at'),
  offerAcceptedAt: timestamp('offer_accepted_at'),
  invoiceCreatedBy: text('invoice_created_by'),
  invoiceCreatedAt: timestamp('invoice_created_at'),
  invoicePaidAt: timestamp('invoice_paid_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const auditLog = pgTable('audit_log', {
  id: serial('id').primaryKey(),
  tableName: text('table_name').notNull(),
  recordId: uuid('record_id').notNull(),
  columnName: text('column_name').notNull(),
  oldValue: jsonb('old_value'),
  newValue: jsonb('new_value'),
  changedBy: text('changed_by'),
  changedAt: timestamp('changed_at').defaultNow().notNull(),
})
```

The legacy `todos` table has been removed in favor of maintenance case tracking with audit logging.

**Audit Triggers:**

- `maintenance_cases` has database triggers that write to `audit_log` on INSERT, UPDATE, and DELETE.
- Set `app.current_user` in the session (e.g., `SET LOCAL "app.current_user" = '<user-id>';`) so `changedBy` is populated.
- Trigger function: `log_maintenance_cases_changes` (created in migrations; see `drizzle/0001_add_maintenance_cases_audit_triggers.sql`).

**Workflow:**

1. Modify `src/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Apply migration: `npm run db:migrate` (production) or `npm run db:push` (dev)
4. Optionally open Drizzle Studio: `npm run db:studio`

### Seeding

- Command: `npm run db:seed`
- Behavior: truncates `maintenance_cases` and `audit_log`, sets `app.current_user = 'seed-script'`, then inserts representative maintenance cases so audit rows capture the actor.

**Connection:**

- Local: `postgresql://checkpad:checkpad_dev_password@localhost:5432/checkpad`
- Configured via `DATABASE_URL` in `.env`

---

## Routing

### TanStack Router (File-Based)

**Key Concepts:**

- Each file in `src/routes/` becomes a route
- `__root.ts` defines the root layout
- `routeTree.gen.ts` is **auto-generated** (never edit manually)
- Use `Link` component from `@tanstack/react-router` for SPA navigation

**Adding a Route:**

1. Create component in `src/components/` (e.g., `src/components/pages/About.tsx`)
2. Create route file in `src/routes/` (e.g., `src/routes/about.ts`) - **use .ts, not .tsx**
3. Import and reference the component:

   ```typescript
   import { createFileRoute } from '@tanstack/react-router'
   import { About } from '@/components/pages/About'

   export const Route = createFileRoute('/about')({
     component: About,
   })
   ```

4. Route tree updates automatically

**Important:** Route files should be `.ts` files that import components from `src/components/`, not `.tsx` files with inline components.

**Navigation:**

```tsx
import { Link } from '@tanstack/react-router'
;<Link to="/about">About</Link>
```

---

## Deployment

**Target Platform:** Cloudflare Workers

**Deployment Steps:**

1. Build: `npm run build`
2. Deploy: `npm run deploy`

**Configuration:** `wrangler.jsonc`

- Compatibility date: 2025-09-02
- Node.js compatibility enabled
- Entry: `@tanstack/react-start/server-entry`

---

## Dependencies to Note

### Core Dependencies

- **@tanstack/react-start:** Meta-framework for React SSR
- **@tanstack/react-router:** File-based routing with type safety
- **drizzle-orm + drizzle-kit:** Type-safe SQL ORM
- **@tanstack/electric-db-collection:** ElectricSQL integration
- **@chakra-ui/react:** UI component library
- **zod:** Schema validation (v4)

### Development Tools

- **vitest:** Unit testing framework
- **@testing-library/react:** React testing utilities
- **husky:** Git hooks
- **lint-staged:** Pre-commit linter
- **commitlint:** Commit message linting
- **@tanstack/react-devtools:** React debugging
- **babel-plugin-react-compiler:** React compiler integration

---

## Common Tasks

### Adding a New Feature (TDD Approach)

1. **Write a failing test:**

   ```bash
   # Create test file first
   touch src/components/feature/Feature.test.tsx
   ```

2. **Implement the feature** to pass the test

3. **Run tests:**

   ```bash
   npm run test
   ```

4. **Commit changes** (pre-commit hooks will run tests automatically)

### Adding a Database Table

1. **Update schema:**

   ```typescript
   // src/db/schema.ts
   export const newTable = pgTable('new_table', {
     id: serial('id').primaryKey(),
     // ... columns
   })
   ```

2. **Generate migration:**

   ```bash
   npm run db:generate
   ```

3. **Apply migration:**
   ```bash
   npm run db:push  # Dev
   # or
   npm run db:migrate  # Production
   ```

### Updating Dependencies

Always update this document when:

- Major version changes occur
- New core dependencies are added
- Architecture patterns change
- New conventions are established

---

## Troubleshooting

### Database Connection Issues

1. Ensure Docker services are running: `docker compose ps`
2. Check `.env` file matches `.env.example`
3. Verify PostgreSQL is healthy: `docker compose logs postgres`

### Build Failures

1. Clear build cache: `rm -rf dist .tanstack`
2. Reinstall dependencies: `npm ci`
3. Check TypeScript errors: `npm run lint`

### Route Generation Issues

If routes aren't updating:

1. Restart dev server: `npm run dev`
2. Check `src/routeTree.gen.ts` for errors
3. Verify route file exports match TanStack Router conventions

---

## Important Notes for Agents

1. **Never edit `src/routeTree.gen.ts`** - it's auto-generated
2. **Always run tests** before committing (enforced by git hooks)
3. **Use absolute imports** with `@/` prefix
4. **Follow TDD:** Write tests first, then implement
5. **Commit message format** is enforced - use conventional commits
6. **No semicolons** in code (Prettier will remove them)
7. **Path aliases** are configured - use `@/` instead of relative paths
8. **Database changes** require migration generation
9. **ElectricSQL** is used for local-first sync - consider offline scenarios
10. **React 19** is used - be aware of breaking changes from earlier versions

---

## Maintenance Checklist

Update **both AGENTS.md and README.md** when:

- [ ] Major dependency upgrades (e.g., React, TanStack, Drizzle)
- [ ] New architectural patterns are introduced
- [ ] Database schema significantly changes
- [ ] New development tools are added
- [ ] Coding conventions are modified
- [ ] Deployment process changes
- [ ] New environment variables are required
- [ ] Test infrastructure changes
- [ ] Docker services are added/removed
- [ ] New features with user-facing impact are added

**Document Owners**: Keep both AGENTS.md (for AI agents) and README.md (for developers) synchronized with actual codebase state.
