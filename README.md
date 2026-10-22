# lab-dashboard-stacks

Dynamic Dashboard Stack Lab: a pnpm monorepo implementing the same small dynamic personal dashboard on eight hosting stacks. The experiment compares developer experience, local tooling, persistence, secrets, jobs, observability, and deployment—not visual polish.

Every app shows the same four seed widgets, can add a widget, simulates an external refresh, exposes health and safe configuration-status endpoints, and runs locally without cloud credentials.

## Status

active (lab). All eight stacks are implemented in a single commit (2026-07-05), 10/10 turbo test tasks green, and the comparison docs are written. No deploys yet, so the scorecard's deploy-experience columns are still empty. Stack: pnpm + turbo, TypeScript, one shared package.

## Stacks

| Stack | Best for | Local dev | Dynamic backend | DB story | Cron/jobs | Deploy complexity | My notes |
|---|---|---:|---:|---:|---:|---:|---|
| Vercel + Supabase + Next.js | Polished dashboard default | 5 | 5 | Supabase Postgres | Vercel Cron | Low | Best balanced default |
| Netlify + Functions + Vite | GitHub Pages plus functions | 5 | 4 | Memory; Blobs/external DB in production | Scheduled Functions | Low | Very approachable |
| Cloudflare Workers + D1 | Cheap global edge apps | 4 | 5 | D1 SQLite | Cron Triggers | Medium | Fast and programmable |
| Firebase Hosting + Functions | Managed Google ecosystem | 4 | 5 | Firestore | Scheduled Functions | Medium | Strong integrated services |
| Render + Express + Postgres | Conventional backend service | 4 | 5 | Managed Postgres | Cron Jobs | Medium | Boring, understandable backend |
| Railway + Express + Postgres | Fast full-stack prototypes | 5 | 5 | Managed Postgres | Cron service | Low | Excellent iteration speed |
| Cloud Run + Express | Portable containers | 3 | 5 | Memory; Cloud SQL optional | Cloud Scheduler | High | Maximum runtime portability |
| Replit + Express + SQLite | AI-assisted all-in-one prototypes | 5 | 4 | Local SQLite | Scheduled Deployments | Low | Fastest browser-based path |

## Quickstart

```bash
corepack enable
pnpm install
pnpm test
pnpm typecheck
pnpm build
```

Run one module:

```bash
pnpm dev:vercel       # http://localhost:3001
pnpm dev:netlify      # http://localhost:3002
pnpm dev:cloudflare   # http://localhost:8787
pnpm dev:firebase     # http://localhost:5000
pnpm dev:render       # http://localhost:3005
pnpm dev:railway      # http://localhost:3006
pnpm dev:cloudrun     # http://localhost:8080
pnpm dev:replit       # http://localhost:3008
```

Render and Railway use process memory when `DATABASE_URL` is absent. To compare Postgres, start the app's Compose service, copy its `.env.example` to `.env`, and export or load `DATABASE_URL`. Firebase's full emulator suite requires Java. Cloudflare can use its configured local D1 binding; the other fallback stores need no external services.

## Layout

```
apps/        # one app per stack: vercel-supabase-next, netlify-functions-next, cloudflare-pages-workers-d1,
             # firebase-hosting-functions, render-express-postgres, railway-express-postgres,
             # cloud-run-container-express, replit-express-sqlite (each with its own README)
packages/shared/   # shared types, widgets, env checks, HTML shell and mock external APIs
docs/        # architecture, comparison-scorecard, decision-matrix, experiment-log-template, low-code-notes
```

## Common API

| Method | Path | Behavior |
|---|---|---|
| `GET` | `/` | Dashboard UI |
| `GET` | `/api/health` | Stack name and current ISO time |
| `GET` | `/api/widgets` | List widgets |
| `POST` | `/api/widgets` | Add `{ "title", "value", "source" }` |
| `POST` | `/api/refresh` | Apply deterministic mock API values |
| `GET` | `/api/config` | Show environment-variable presence, never values |

Firebase Hosting rewrites `/api/*` to an Express function whose internal paths omit `/api`; externally the contract is identical.

## Deployment

Each app README contains exact CLI and provider-dashboard steps:

- [Vercel + Supabase](apps/vercel-supabase-next/README.md)
- [Netlify Functions](apps/netlify-functions-next/README.md)
- [Cloudflare Workers + D1](apps/cloudflare-pages-workers-d1/README.md)
- [Firebase](apps/firebase-hosting-functions/README.md)
- [Render](apps/render-express-postgres/README.md)
- [Railway](apps/railway-express-postgres/README.md)
- [Cloud Run](apps/cloud-run-container-express/README.md)
- [Replit](apps/replit-express-sqlite/README.md)

No deployment has been performed by this repository. Hosted setup requires your own provider account and credentials.

## What to compare

Record time to first run and first deploy, quality of logs and previews, secret rotation, persistence behavior, auth integration, scheduled-refresh setup, cold starts, rollback workflow, cost visibility, and how much provider-specific configuration remains after the app works.

Use the [scorecard](docs/comparison-scorecard.md), [decision matrix](docs/decision-matrix.md), and [experiment log](docs/experiment-log-template.md). Start with Vercel/Supabase for a polished personal app, Cloudflare for low-cost edge execution, Render for conventional backend skills, or Replit for the fastest disposable prototype.

## Security boundary

Mock API keys are optional and are never sent externally. Config endpoints expose booleans only. The demo has no end-user authentication; each deployment README describes the provider-native auth path that must be added before exposing private data.
