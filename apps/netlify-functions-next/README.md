# Netlify + Vite + Functions

**Best for:** “GitHub Pages plus functions.” **Estimated complexity:** Low.

The static Vite frontend calls Netlify Functions. The demo uses module memory, which resets on function cold starts and deployments; production should use Netlify Blobs or an external database.

## Local setup and tests

```bash
pnpm install
cp apps/netlify-functions-next/.env.example apps/netlify-functions-next/.env
pnpm dev:netlify
pnpm --filter netlify-functions-next test
```

Open `http://localhost:3002`. The Netlify CLI proxies `/api/*` to functions.

## Environment

`MOCK_GITHUB_API_KEY`, `MOCK_CALENDAR_API_KEY`, and `CRON_SECRET` are optional. Hosted database or Blobs credentials would be added only when replacing the memory adapter. Values never appear in `/api/config`.

## Deploy

1. In Netlify, choose **Add new site → Import an existing project** and select the GitHub repository.
2. Set base directory to the repository root, build command to `pnpm --filter netlify-functions-next build`, publish directory to `apps/netlify-functions-next/dist`, and functions directory to `apps/netlify-functions-next/netlify/functions`.
3. Add secrets under **Site configuration → Environment variables**.
4. Deploy, inspect **Functions** logs, and verify `/api/health`.
5. For persistence, create a Blobs store or external database and replace the memory adapter before relying on stored widgets.
6. For jobs, add a Netlify Scheduled Function that invokes the refresh service internally and protect any public trigger with `CRON_SECRET`.

## Tradeoffs

Pros: static-site ergonomics, deploy previews, simple functions, good GitHub workflow. Cons: ephemeral demo storage, function limits, and less integrated database/auth than Supabase or Firebase. Netlify Identity is available but not implemented; add auth before storing private data.
