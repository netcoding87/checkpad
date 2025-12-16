# checkPAD

> A modern, local-first full-stack application built with TanStack Start and PostgreSQL

**checkPAD** is a full-stack web application featuring real-time data synchronization, server-side rendering, and a local-first architecture powered by ElectricSQL.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ React 19 +   │  │  TanStack    │  │  Chakra UI   │      │
│  │  SSR/RSC     │  │   Router     │  │     v3       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │  ElectricSQL   │◄─────────────┐        │
│                    │  (Local Sync)  │              │        │
│                    └───────┬────────┘              │        │
└────────────────────────────┼───────────────────────┼────────┘
                             │                       │
                    ┌────────▼────────┐              │
                    │  TanStack Start │              │
                    │   (SSR Layer)   │              │
                    └────────┬────────┘              │
                             │                       │
                    ┌────────▼────────┐              │
                    │   Drizzle ORM   │              │
                    └────────┬────────┘              │
                             │                       │
                    ┌────────▼────────┐              │
                    │   PostgreSQL    │──────────────┘
                    │   (Database)    │   Real-time Sync
                    └─────────────────┘
```

### Key Architectural Principles

- **Local-First**: ElectricSQL enables offline-capable, real-time sync between client and server
- **Server-Side Rendering**: TanStack Start provides RSC architecture for optimal performance
- **Type Safety**: End-to-end TypeScript with strict mode enabled
- **File-Based Routing**: Convention over configuration with auto-generated route trees
- **Database-First**: Schema-driven development with Drizzle ORM migrations

---

## 📁 Project Structure

```
checkpad/
├── src/
│   ├── routes/              # File-based routing (.ts files only)
│   │   ├── __root.ts        # Root route with layout
│   │   └── index.ts         # Home page route
│   ├── components/
│   │   ├── core/            # Application shell (Header, Root)
│   │   ├── maintenance/     # Feature modules (Dashboard, etc.)
│   │   └── ui/              # Chakra UI providers & primitives
│   ├── db/
│   │   ├── schema.ts        # Drizzle database schema
│   │   └── index.ts         # Database client
│   ├── db-collections/      # ElectricSQL collections
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # External service integrations
│   ├── router.ts            # Router configuration
│   └── routeTree.gen.ts     # Auto-generated (DO NOT EDIT)
├── public/                  # Static assets
├── drizzle/                 # Database migrations
└── docker-compose.yml       # Local development services
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 24.12.0 (managed via [Volta](https://volta.sh/))
- **Docker** & Docker Compose (for local services)
- **Git** (for version control)

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd checkpad
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

4. **Start Docker services**

   ```bash
   docker compose up -d
   ```

   This starts:
   - PostgreSQL (port 5432)
   - pgAdmin (port 5050)
   - ElectricSQL (port 3000)

5. **Initialize database**

   ```bash
   npm run db:generate  # Generate migrations from schema
   npm run db:push      # Apply migrations to database
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```
   Application runs at [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing (TDD Workflow)

This project follows **Test-Driven Development** practices:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests related to changed files
vitest related --run
```

**Test Structure**:

- Tests are co-located with source files (`.test.ts` or `.spec.ts`)
- Uses Vitest + React Testing Library
- Pre-commit hooks automatically run tests on changed files

**TDD Workflow**:

1. Write failing test first
2. Implement feature to pass test
3. Refactor while keeping tests green
4. Commit (tests run automatically via Husky)

---

## 🎨 Styling

This project uses **[Chakra UI v3](https://www.chakra-ui.com/)** exclusively for styling:

```tsx
import { Button, Box, Heading } from '@chakra-ui/react'

function Example() {
  return (
    <Box p={4}>
      <Heading>Welcome to checkPAD</Heading>
      <Button colorScheme="blue">Click Me</Button>
    </Box>
  )
}
```

**Theme Features**:

- Dark/light mode via `next-themes`
- Custom theme configuration in `src/components/ui/provider.tsx`
- Responsive design out of the box

---

## 🧭 Routing

### File-Based Routing

Routes are defined as **TypeScript files** (`.ts`, not `.tsx`) in `src/routes/`:

**Directory Structure**:

```
src/routes/
├── __root.ts          # Root layout
└── index.ts           # Home page (/)
```

### Adding a New Route

1. **Create the component** in `src/components/`:

   ```tsx
   // src/components/pages/About.tsx
   export function About() {
     return <div>About Page</div>
   }
   ```

2. **Create the route file** (`.ts` only):

   ```typescript
   // src/routes/about.ts
   import { createFileRoute } from '@tanstack/react-router'
   import { About } from '@/components/pages/About'

   export const Route = createFileRoute('/about')({
     component: About,
   })
   ```

3. **Route tree updates automatically** - no manual configuration needed!

### Navigation

```tsx
import { Link } from '@tanstack/react-router'
;<Link to="/about">About</Link>
```

More: [TanStack Router Docs](https://tanstack.com/router)

---

## 🗄️ Database Management

### Schema Definition

Define your schema in `src/db/schema.ts` using Drizzle ORM:

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

The previous `todos` table has been removed in favor of maintenance case tracking with audit logging.

**Audit Triggers:**

- `maintenance_cases` uses Postgres triggers to log INSERT/UPDATE/DELETE into `audit_log` (see `drizzle/0001_add_maintenance_cases_audit_triggers.sql`).
- Set `app.current_user` in the session (e.g., `SET LOCAL app.current_user = '<user-id>';`) so `changedBy` is populated in audit rows.

### Migration Workflow

```bash
# 1. Generate migration from schema changes
npm run db:generate

# 2. Apply migration to database
npm run db:push      # Development (direct schema push)
npm run db:migrate   # Production (run migrations)

# 3. Open Drizzle Studio (optional)
npm run db:studio
```

### Database Tools

- **pgAdmin**: [http://localhost:5050](http://localhost:5050) (admin@checkpad.local / admin)
- **Drizzle Studio**: `npm run db:studio`
- **ElectricSQL**: [http://localhost:3000](http://localhost:3000)

---

## 🔄 Local-First Sync (ElectricSQL)

ElectricSQL provides real-time sync between PostgreSQL and client:

```typescript
// Example: Creating a synced collection
import { useElectric } from '@/db-collections'

function TodoList() {
  const { db } = useElectric()
  const todos = db.todos.useLiveQuery()

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
```

**Benefits**:

- Offline-first capabilities
- Real-time updates across clients
- Automatic conflict resolution
- Local-first performance

---

## 🛠️ Development Tools

### Available Scripts

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
npm run format       # Format code with Prettier
npm run check        # Format + lint (auto-fix)
npm run deploy       # Deploy to Cloudflare Workers
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema to database (dev)
npm run db:studio    # Open Drizzle Studio
```

### Code Quality

**Pre-commit Hooks (Husky + lint-staged)**:

- Auto-format with Prettier
- Lint with ESLint (zero warnings enforced)
- Run tests on changed files

**Commit Message Format** (enforced by commitlint):

```
type(scope): subject

feat(auth): add login functionality
fix(database): resolve connection timeout
docs(readme): update setup instructions
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### TypeScript Configuration

- **Strict mode** enabled
- **Path aliases**: Use `@/*` for `src/*` imports
- **No semicolons** (Prettier enforced)
- **Single quotes** for strings
- **Trailing commas** everywhere

```typescript
// ✅ Good: Absolute imports
import { Dashboard } from '@/components/maintenance/Dashboard'

// ❌ Avoid: Relative imports
import { Dashboard } from '../../components/maintenance/Dashboard'
```

---

## 🚢 Deployment

**Target Platform**: Cloudflare Workers

```bash
# Build and deploy
npm run build
npm run deploy
```

**Configuration**: `wrangler.jsonc`

- Node.js compatibility enabled
- Optimized for edge runtime
- Automatic builds via Vite

---

## 📚 Tech Stack

| Category       | Technology                     |
| -------------- | ------------------------------ |
| **Framework**  | TanStack Start (React 19)      |
| **Language**   | TypeScript 5.7 (strict mode)   |
| **Database**   | PostgreSQL 18 Alpine           |
| **ORM**        | Drizzle ORM                    |
| **Sync**       | ElectricSQL                    |
| **Routing**    | TanStack Router (file-based)   |
| **UI Library** | Chakra UI v3                   |
| **State**      | TanStack React DB, Form, Table |
| **Testing**    | Vitest + React Testing Library |
| **Build Tool** | Vite 7                         |
| **Deployment** | Cloudflare Workers             |
| **Runtime**    | Node.js 24.12.0 (Volta)        |

---

## 🤖 AI Development

For AI agents working on this project, see **[AGENTS.md](./AGENTS.md)** for:

- Architecture patterns
- Coding conventions
- TDD workflow
- Common tasks and troubleshooting

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check Docker services
docker compose ps

# View PostgreSQL logs
docker compose logs postgres

# Restart services
docker compose restart
```

### Build Failures

```bash
# Clear build cache
rm -rf dist .tanstack

# Reinstall dependencies
npm ci

# Check for errors
npm run lint
```

### Route Not Updating

```bash
# Restart dev server
npm run dev

# Check routeTree.gen.ts for errors
cat src/routeTree.gen.ts
```

---

## 📝 Contributing

1. Follow TDD - write tests first
2. Use conventional commits
3. Ensure all tests pass before committing
4. Update **AGENTS.md** and **README.md** for significant changes

---

## 📄 License

[Your License Here]

---

**Note**: This is a living document. Update whenever architecture, dependencies, or conventions change significantly.
