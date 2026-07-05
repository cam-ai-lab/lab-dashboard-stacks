# Decision Matrix

| Goal | Recommendation | Reason |
|---|---|---|
| Best default | Vercel + Supabase + Next.js | Strong UI framework, previews, managed Postgres/auth, and low deployment friction |
| Best cheap edge platform | Cloudflare Workers + D1 | Global execution, inexpensive storage, excellent cron and observability |
| Best low-code/internal-dashboard path | Retool first; Appsmith when self-hosting matters | Fastest data-connected UI versus greater deployment control |
| Best real backend | Render + Express + Postgres | Conventional service/database model with minimal platform magic |
| Best AI-assisted prototype path | Replit + Express + SQLite | Editor, runtime, deployment, and AI workflow in one place |
| Best if I want to learn deeply | Cloud Run + Express, then add Cloud SQL | Containers, IAM, networking, builds, and database operations are explicit |
| Best if I want minimum maintenance | Vercel + Supabase | Managed frontend, functions, database, auth, previews, and backups |

Decision rules:

1. Choose a managed full-stack pairing when the dashboard is the product.
2. Choose a conventional Express/Postgres service when backend control and portability matter.
3. Choose edge compute when latency, global reach, or frequent lightweight jobs dominate.
4. Use low-code when internal CRUD and integrations matter more than source-level control.
5. Validate auth, backup/restore, and scheduler costs before committing private data.
