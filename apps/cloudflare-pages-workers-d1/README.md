# Cloudflare Workers + Hono + D1

**Best for:** cheap, fast, programmable edge dashboards. **Estimated complexity:** Medium.

Hono runs the UI and API in one Worker. D1 provides SQLite-compatible hosted persistence; if the binding is absent in tests, a memory adapter is used.

## Local setup and tests

```bash
pnpm install
pnpm exec wrangler d1 execute dynamic-dashboard --local --file apps/cloudflare-pages-workers-d1/schema.sql
pnpm dev:cloudflare
pnpm --filter cloudflare-pages-workers-d1 test
```

Open `http://localhost:8787`. Put local secrets in `.dev.vars`, never in `wrangler.toml`.

## Environment

The `DB` binding is configured by Wrangler. `MOCK_GITHUB_API_KEY`, `MOCK_CALENDAR_API_KEY`, and `CRON_SECRET` are optional secrets. The config endpoint exposes binding/secret presence only.

## Deploy

1. Run `pnpm exec wrangler login`.
2. Run `pnpm exec wrangler d1 create dynamic-dashboard`.
3. Replace the all-zero `database_id` in `wrangler.toml` with the returned identifier.
4. Apply the schema: `pnpm exec wrangler d1 execute dynamic-dashboard --remote --file apps/cloudflare-pages-workers-d1/schema.sql`.
5. Set secrets with `pnpm exec wrangler secret put CRON_SECRET` and equivalent commands for optional mock keys.
6. Deploy from the repository root with `pnpm --filter cloudflare-pages-workers-d1 exec wrangler deploy`, or connect the repository in **Workers & Pages → Create → Import a repository**.
7. Enable Worker logs under **Observability**. Add a Cron Trigger under **Settings → Triggers → Cron Triggers** and call the same refresh service from a scheduled handler when automating sync.

## Tradeoffs

Pros: global latency, strong free/low-cost story, integrated D1 and cron, excellent programmable edge runtime. Cons: Worker APIs differ from Node, D1 has different operational limits from full Postgres, and the platform is more specialized. Cloudflare Access is the recommended no-code auth gate; application-level auth is not implemented.
