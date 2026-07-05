# Replit + Express + SQLite

**Best for:** quick all-in-one and AI-assisted prototypes. **Estimated complexity:** Low.

The app stores widgets in a real SQLite file by default. Tests use an isolated in-memory SQLite database.

## Local setup and tests

```bash
pnpm install
pnpm --filter replit-express-sqlite test
pnpm dev:replit
```

Open `http://localhost:3008`. Set `SQLITE_PATH` to choose another file.

## Environment

`SQLITE_PATH` defaults to `dashboard.sqlite`; `PORT` defaults to 3008. Mock API keys and `CRON_SECRET` are optional. Replit Secrets should hold any real integration token.

## Deploy

1. In Replit choose **Create Repl → Import from GitHub** and select the repository.
2. Replit reads `.replit`; if prompted, use `pnpm install` for setup and `pnpm --filter replit-express-sqlite dev` for Run.
3. Add optional values under **Tools → Secrets**.
4. Choose **Deploy → Autoscale**, verify the build and run commands from `.replit`, and create the deployment.
5. Verify `/api/health` and confirm whether the selected deployment preserves the SQLite filesystem. For reliable multi-instance production persistence, replace SQLite with Replit Database or hosted Postgres.
6. Use Scheduled Deployments for jobs where available, and protect refresh invocations. Add Replit Auth or application sessions before private use.

## Tradeoffs

Pros: editor, runtime, AI help, persistence, and deploy in one UI; minimal setup. Cons: local SQLite is not suitable for multi-instance scaling, platform portability is weaker, and enterprise observability/security controls are limited compared with major clouds.
