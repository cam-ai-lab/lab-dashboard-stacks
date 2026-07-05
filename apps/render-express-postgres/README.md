# Render + Express + Postgres

**Best for:** a conventional “real backend service with database.” **Estimated complexity:** Medium.

The Express service uses `pg` when `DATABASE_URL` is present and memory otherwise. It initializes and seeds the table safely at startup.

## Local setup and tests

```bash
pnpm install
pnpm --filter render-express-postgres test
pnpm dev:render
```

For Postgres persistence:

```bash
docker compose -f apps/render-express-postgres/docker-compose.yml up -d
export DATABASE_URL=postgresql://dashboard:dashboard@localhost:5435/dashboard
pnpm dev:render
```

Open `http://localhost:3005`.

## Environment

`DATABASE_URL` activates Postgres. `PORT` is assigned by Render. Mock keys and `CRON_SECRET` are optional. Keep database URLs and scheduler tokens in Render's secret environment variables.

## Deploy

1. In Render, choose **New → PostgreSQL**, select a region, and create the database.
2. Choose **New → Web Service**, connect the GitHub repository, and select Docker runtime.
3. Set the Dockerfile path to `apps/render-express-postgres/Dockerfile` and health check path to `/api/health`.
4. Add `DATABASE_URL` using the database's internal URL under **Environment**.
5. Deploy and inspect **Logs**; the app creates the table and idempotently seeds widgets.
6. Add a **Cron Job** using a small authenticated HTTP client for scheduled refresh. Do not expose private widgets until adding an auth middleware such as OIDC or session-based authentication.

## Tradeoffs

Pros: portable Express/Postgres design, straightforward logs, transactions, familiar SQL, easy migration. Cons: a continuously running service, database lifecycle and connection limits, and more auth/backup responsibility. Render manages Postgres backups according to the selected plan.
