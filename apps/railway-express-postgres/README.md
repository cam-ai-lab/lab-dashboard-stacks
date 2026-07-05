# Railway + Express + Postgres

**Best for:** fast full-stack prototype deployment. **Estimated complexity:** Low.

This is the same conventional Express/Postgres shape as Render, optimized for Railway's rapid service and database provisioning. Memory is used when `DATABASE_URL` is absent.

## Local setup and tests

```bash
pnpm install
pnpm --filter railway-express-postgres test
pnpm dev:railway
```

For persistent local storage:

```bash
docker compose -f apps/railway-express-postgres/docker-compose.yml up -d
export DATABASE_URL=postgresql://dashboard:dashboard@localhost:5436/dashboard
pnpm dev:railway
```

Open `http://localhost:3006`.

## Environment

`DATABASE_URL` activates Postgres; Railway injects `PORT`. Mock API keys and `CRON_SECRET` are optional. `/api/config` never returns their contents.

## Deploy

1. In Railway choose **New Project → Deploy from GitHub repo** and select this repository.
2. Add a service with **New → Database → PostgreSQL**.
3. In the app service, set `DATABASE_URL=${{Postgres.DATABASE_URL}}`.
4. Set the config-as-code path to `apps/railway-express-postgres/railway.json`, or configure the Dockerfile and `/api/health` manually.
5. Generate a public domain under **Settings → Networking**, deploy, and inspect service logs.
6. For jobs, create a second service using Railway Cron and an authenticated refresh command. Add application auth before storing private data.

## Tradeoffs

Pros: very fast provisioning, excellent variable references, conventional portable code, managed Postgres. Cons: usage-based bills need monitoring, production controls are lighter than larger clouds, and auth is application-owned. Database backups and retention depend on the Railway plan.
