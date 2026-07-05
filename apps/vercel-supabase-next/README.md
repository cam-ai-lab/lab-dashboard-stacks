# Vercel + Supabase + Next.js

**Best for:** polished personal dashboard applications. **Estimated complexity:** Low.

Next.js App Router supplies the UI and API routes. With no Supabase configuration, a process-memory store provides a credential-free local demo. With all server variables present, widgets persist in Supabase Postgres.

## Local setup and tests

```bash
pnpm install
cp apps/vercel-supabase-next/.env.example apps/vercel-supabase-next/.env.local
pnpm dev:vercel
pnpm --filter vercel-supabase-next test
```

Open `http://localhost:3001`. Empty Supabase values are expected locally.

## Environment

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` identify the project. `SUPABASE_SERVICE_ROLE_KEY` is a server-only secret and `DASHBOARD_USER_ID` is the demo user's UUID; all three server values are required to activate persistence. Mock API keys and `CRON_SECRET` are optional. `/api/config` reports presence only.

## Deploy

1. In Supabase, create a project, open **SQL Editor**, and run `supabase-schema.sql`.
2. In **Authentication → Users**, create the dashboard user and copy its UUID.
3. Import the GitHub repository in Vercel. Set **Root Directory** to the repository root and **Framework Preset** to Next.js.
4. Set the build command to `pnpm --filter vercel-supabase-next build` and output to `apps/vercel-supabase-next/.next`.
5. Under **Settings → Environment Variables**, add the four Supabase variables for Production and Preview. Never expose the service-role key with a `NEXT_PUBLIC_` prefix.
6. Deploy and verify `/api/health`, then add a widget and redeploy to confirm persistence.

The service role is used only because this comparison omits browser authentication. For a real private dashboard, use Supabase Auth sessions in server routes and an anon client so the included RLS policies enforce `auth.uid() = user_id`. Add a Vercel Cron calling a separately authenticated refresh handler; do not expose an unprotected mutation endpoint.

## Tradeoffs

Pros: excellent previews, mature React stack, managed Postgres/auth, low operational burden. Cons: two vendors, serverless execution limits, and careless service-role handling bypasses RLS. Supabase handles backups; Vercel manages function logs and secrets.
