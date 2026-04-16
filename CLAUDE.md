# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (runs prisma:generate first, then tsx watch)
npm run dev

# Build
npm run build

# Lint
npm run lint

# Format
npm run format

# Type check
npm run check-types

# Prisma client generation (required after schema changes)
npm run prisma:generate --workspace=@neko/api
```

> Note: There is no test runner configured (no jest/vitest config). Spec files exist in `src/domain/` but cannot be run until a test runner is set up.

## Architecture

Turbo monorepo with a single app (`apps/api`) — a Fastify 5 REST API using Clean Architecture.

### Layer structure (`apps/api/src/`)

```
core/           # Shared primitives
  either.ts     # Either<Left, Right> monad — all use cases return this instead of throwing
  entities/     # Base classes: AggregateRoot, UniqueEntityID

domain/         # Business logic, framework-agnostic
  entities/     # Domain models (Budget, Transaction, Category, etc.)
  use-cases/    # One class per operation, returns Either<Error, Result>
  repositories/ # Abstract repository interfaces
  service/      # Domain services (AccountService, etc.)

infra/
  database/prisma/repositories/   # Prisma implementations of domain repositories
  database/prisma/mappers/        # Converts between Prisma models and domain entities
  http/routes/                    # Fastify route handlers (one file per route)
  http/middleware/                # verify-auth (better-auth session check)

env/            # Zod-validated env schema
lib/            # Initialized singletons: prisma.ts, auth.ts
generated/      # Auto-generated Prisma client output (gitignored)
```

### Key patterns

- **Either monad**: Use cases never throw — they return `right(value)` on success or `left(error)` on failure. Check with `result.isRight()` / `result.isLeft()`.
- **Routes**: Each route file exports an async plugin function for Fastify. Routes registered inside the `protectedApp` block in `app.ts` are protected by the `verifyAuth` preHandler hook.
- **Zod + fastify-type-provider-zod**: Route bodies/responses are typed via Zod schemas passed to the Fastify schema option. The ZodTypeProvider is set on the app instance.
- **Repositories**: Domain layer depends only on the abstract repository interfaces. Prisma implementations are injected at the route handler level (no DI container).

### Authentication

Uses `better-auth`. The auth route mounts at `/auth/*`. Protected routes call `verifyAuth` middleware which validates the session via better-auth.

### Database

PostgreSQL with Prisma. Schema at `apps/api/prisma/schema.prisma`. The Prisma client is generated into `src/generated/` and imported from `@/lib/prisma`.

### Path aliases

`@/` maps to `src/` (configured in tsconfig). Test files import from `test/` (no alias — this directory does not yet exist).
