# checkPAD

> A modern, local-first full-stack application built with TanStack Start, PostgreSQL, better-auth, and Keycloak

**checkPAD** is a full-stack web application featuring real-time data synchronization, server-side rendering, cookie-based authentication with better-auth, and a local-first architecture powered by ElectricSQL.

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
- **File-Based Routing**: Flat file-based convention with auto-generated route trees
- **Database-First**: Schema-driven development with Drizzle ORM migrations
- **Authenticated by Default**: App routes and data APIs require a valid better-auth session backed by Keycloak

---

## 📁 Project Structure

```
checkpad/
├── src/
│   ├── routes/              # File-based routing (.ts files only)
│   │   ├── __root.ts        # Root route with layout
│   │   ├── hangar.ts        # Hangar calendar route
│   │   └── index.ts         # Home page route
│   ├── components/
│   │   ├── core/            # Application shell (Header, Root)
│   │   ├── maintenance/     # Feature modules (Dashboard, Hangar calendar)
│   │   └── ui/              # Chakra UI providers & primitives
│   ├── db/
│   │   ├── schema.ts        # Drizzle database schema
│   │   ├── auth-schema.ts   # Generated Better Auth schema
│   │   └── index.ts         # Database client
│   ├── lib/                 # Auth config, client, and server session helpers
│   ├── db-collections/      # ElectricSQL collections
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # External service integrations
│   ├── router.ts            # Router configuration
│   └── routeTree.gen.ts     # Auto-generated (DO NOT EDIT)
├── public/                  # Static assets
├── keycloak/                # Development realm import
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

- db-bootstrap (one-shot initialization of roles/databases)
- pgAdmin (port 5050)
- ElectricSQL (port 3000)
- Keycloak (port 9090)

5. **Initialize database**

The Compose stack runs database bootstrap automatically via the `db-bootstrap` service.

```bash
 npm run db:generate   # Generate migrations from schema
 npm run db:push       # Apply app schema to app database
 npm run db:seed       # Seed the database with initial data (optional)
```

    Run `npm run db:bootstrap` manually only if you are not using Docker Compose for infrastructure.

6. **Start development server**

   ```bash
   npm run dev
   ```

Application runs at [http://localhost:5371](http://localhost:5371)

7. **Sign in with the local Keycloak realm**

   Initial super-admin credentials are taken from `.env`:
   - Username: `KEYCLOAK_SUPER_ADMIN_USERNAME`
   - Password: `KEYCLOAK_SUPER_ADMIN_PASSWORD`

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

### Auth Test Coverage Added

- Session helper unit tests for authenticated and unauthenticated API requests
- Login page tests for Keycloak OAuth start flow and redirect handling
- Header tests for authenticated vs unauthenticated shell actions
- Schema tests verifying Better Auth table exports

---

## 🔐 Authentication

Authentication is provided by **better-auth** with **Keycloak** as the OIDC identity provider. The app implements an automatic authentication flow with no dedicated login page.

### Auth Flow

1. **Anonymous Users**: When a user is not authenticated, a loading spinner is shown while the session is checked
2. **Session Check**: The `AuthInitializer` component verifies if the user has a valid session
3. **Keycloak Redirect**: If no session exists, the user is automatically redirected to Keycloak login
4. **Post-Login**: After successful authentication with Keycloak, the user is redirected back to the requested page
5. **Logout**: Clicking "Sign out" resolves a Keycloak logout URL with post-logout redirect, clears the session, and returns to the app, which immediately redirects unauthenticated users to Keycloak login
6. **Session Restoration**: On subsequent visits, the user's session is automatically restored from cookies

### Key Points

- No dedicated `/login` route—authentication happens automatically via Keycloak redirect
- No "Sign in" button in the header—unauthenticated users see a loading spinner
- Header only shows username and "Sign out" button when authenticated
- App routes (`/`, `/hangar`, `/staff`) integrate seamlessly with the automatic auth flow
- Data routes under `/api/...` and `/api/electric/...` return `401 Unauthorized` when no valid session is present
- The `AuthInitializer` component handles all session checks and redirects at the root level

### Environment Variables

Add these values to `.env`:

```bash
POSTGRES_ADMIN_USER=postgres
POSTGRES_ADMIN_PASSWORD=postgres_dev_password
POSTGRES_PORT=5432
APP_DB_NAME=checkpad
APP_DB_USER=checkpad
APP_DB_PASSWORD=checkpad_dev_password
KEYCLOAK_DB_NAME=keycloak
KEYCLOAK_DB_USER=keycloak
KEYCLOAK_DB_PASSWORD=keycloak_dev_password
BOOTSTRAP_DATABASE_URL=postgresql://postgres:postgres_dev_password@localhost:5432/postgres
DATABASE_URL=postgresql://checkpad:checkpad_dev_password@localhost:5432/checkpad
BETTER_AUTH_URL=http://localhost:5371
VITE_BETTER_AUTH_URL=http://localhost:5371
BETTER_AUTH_SECRET=dev-only-better-auth-secret-change-me
KEYCLOAK_PORT=9090
KEYCLOAK_START_MODE=dev
KEYCLOAK_REALM=checkpad
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin
KEYCLOAK_HOSTNAME=localhost
KEYCLOAK_HTTP_ENABLED=true
KEYCLOAK_HOSTNAME_STRICT=false
KEYCLOAK_HOSTNAME_STRICT_HTTPS=false
KEYCLOAK_PROXY_HEADERS=forwarded
KEYCLOAK_ISSUER=http://localhost:9090/realms/checkpad
KEYCLOAK_CLIENT_ID=checkpad-web
KEYCLOAK_CLIENT_SECRET=dev-secret
KEYCLOAK_APP_ORIGIN=http://localhost:5371
KEYCLOAK_APP_CALLBACK_URL=http://localhost:5371/api/auth/oauth2/callback/keycloak
KEYCLOAK_SUPER_ADMIN_USERNAME=elite.jet
KEYCLOAK_SUPER_ADMIN_EMAIL=elite.jet@checkpad.local
KEYCLOAK_SUPER_ADMIN_FIRST_NAME=Elite
KEYCLOAK_SUPER_ADMIN_LAST_NAME=Jet
KEYCLOAK_SUPER_ADMIN_PASSWORD=1234test
```

### Keycloak First-Start Behavior

The Keycloak realm is generated from environment variables and imported on startup.

When started through Docker Compose, Keycloak waits until `db-bootstrap` completed successfully, ensuring Keycloak DB/user prerequisites exist before startup.

- On first startup (or with a fresh Keycloak database), import creates the realm, client, and configured super-admin user.
- The imported super-admin user gets username, email, first name, last name, and password from the `KEYCLOAK_SUPER_ADMIN_*` environment variables.
- On subsequent startups with the same Keycloak database, import keeps existing data and does not overwrite users or passwords.
- If you change values like `KEYCLOAK_SUPER_ADMIN_PASSWORD` later, those changes are not applied automatically to an existing user.

To apply changed credentials after first import:

- Update the user in Keycloak Admin Console, or
- Reinitialize Keycloak realm/database data and start again.

### Better Auth Schema

- Better Auth tables are generated into `src/db/auth-schema.ts`
- Those tables are re-exported from `src/db/schema.ts`
- Regenerate the schema with:

```bash
npx auth@latest generate --config src/lib/auth.ts --output src/db/auth-schema.ts --yes
```

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

### Flat File-Based Routing

Routes use **flat file naming convention** (no nested directories):

**Naming Pattern:**

```
file.ts          → /file
parent.child.ts  → /parent/child
parent.$id.ts    → /parent/:id (dynamic segment)
```

**Current Routes**:

```
src/routes/
├── __root.ts              # Root layout
├── index.ts               # / (Dashboard with maintenance table)
├── hangar.ts              # /hangar (Year calendar view)
├── hangar.new.ts          # /hangar/new (Create case form)
└── hangar.$caseId.ts      # /hangar/:caseId (Edit case form)
```

### Adding a New Route

1. **Create the component** in `src/components/`:

   ```tsx
   // src/components/pages/About.tsx
   export function About() {
     return <div>About Page</div>
   }
   ```

2. **Create the route file** (flat naming, `.ts` only):

   ```typescript
   // src/routes/about.ts → /about
   import { createFileRoute } from '@tanstack/react-router'
   import { About } from '@/components/pages/About'

   export const Route = createFileRoute('/about')({
     component: About,
   })
   ```

3. **For nested routes, use dot notation**:

   ```typescript
   // src/routes/blog.posts.ts → /blog/posts
   // src/routes/blog.$slug.ts → /blog/:slug
   ```

4. **Route tree updates automatically** - no manual configuration needed!

### Navigation

```tsx
import { Link } from '@tanstack/react-router'

// Navigate to routes
<Link to="/hangar">Hangar</Link>
<Link to="/hangar/new">New Case</Link>
<Link to="/hangar/$caseId" params={{ caseId: '123' }}>Edit Case</Link>
```

More: [TanStack Router Docs](https://tanstack.com/router) | [Flat Routes Guide](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing#flat-routes)

---

## 🗄️ Database Management

### Schema Definition

Define your schema in `src/db/schema.ts` using Drizzle ORM:

```typescript
import {
  jsonb,
  doublePrecision,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const maintenanceCases = pgTable('maintenance_cases', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  // Note: `estimatedHours` and `estimatedCosts` use DOUBLE PRECISION
  // to map to `number` on the TypeScript side.
  estimatedHours: doublePrecision('estimated_hours'),
  estimatedCosts: doublePrecision('estimated_costs'),
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
- Set `app.current_user` in the session (e.g., `SET LOCAL "app.current_user" = '<user-id>';`) so `changedBy` is populated in audit rows.

### Migration Workflow

```bash
# 1. Ensure DB infrastructure exists (needed when infra is not bootstrapped by Compose)
npm run db:bootstrap

# 2. Generate migration from schema changes
npm run db:generate

# 3. Apply migration to database
npm run db:push      # Development (direct schema push)
npm run db:migrate   # Production (run migrations)

# 4. Open Drizzle Studio (optional)
npm run db:studio
```

### Seeding

```bash
npm run db:seed
```

- Truncates `maintenance_cases` and `audit_log`, then inserts sample maintenance cases.
- Sets `app.current_user` to `seed-script` during inserts so audit rows capture the actor.

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

### API Endpoints

- Reads (Electric proxy): `/api/electric/maintenance-cases`
- Mutations (server DB with txid): `/api/maintenance-cases` (POST/PUT/DELETE)

Collections are configured to read via the Electric proxy while mutations hit the app API, which writes to Postgres inside a transaction and returns the `txid` so the client can await sync.

---

## 🛠️ Development Tools

### Available Scripts

```bash
npm run dev          # Start development server (port 5371)
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
npm run format       # Format code with Prettier
npm run check        # Format + lint (auto-fix)
npm run deploy       # Deploy to Cloudflare Workers
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:bootstrap # Create/repair DB infrastructure
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

### React Conventions

- **JSX props ordering**: Sort JSX props alphabetically for readability. Place spread props (`{...props}`) last to maintain override semantics. This is a non-functional style convention.
- **Exception**: Do not change prop ordering within vendor snippets under `src/components/ui/` (Chakra UI-derived). These are kept identical to upstream.

---

## 🚢 Deployment

**Deployment Options**:

### Docker / Coolify (Self-Hosted)

The application is containerized and ready for self-hosting platforms like [Coolify](https://coolify.io/).

For Compose-based deployments, the stack includes an idempotent `db-bootstrap` one-shot service. `keycloak` and `electric` depend on its successful completion.

```bash
# Build Docker image
docker build -t checkpad .

# Run container
docker run -p 3000:3000 -e DATABASE_URL="postgresql://user:pass@host/db" checkpad
```

**Environment Variables**:

- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Set to `production` in deployed environments
- `PORT`: Server port (defaults to 3000)

See `Dockerfile` for multi-stage build configuration and `.dockerignore` for excluded files.

**Coolify PostgreSQL Integration:**

1. In Coolify, create or link a PostgreSQL resource to your application
2. Coolify automatically injects the `DATABASE_URL` environment variable into the container
3. The application connects automatically on startup
4. Database migrations run on deployment (optional - add to startup script)

No manual environment variable configuration needed - the PostgreSQL resource connection is auto-configured.

### Local Production Testing

```bash
# Build for production
npm run build

# Start the production server locally
node .output/server/index.mjs
```

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
| **Build Tool** | Vite 7 + Nitro                 |
| **Deployment** | Docker / Nitro / Coolify       |
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
