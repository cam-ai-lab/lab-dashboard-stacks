# Google Cloud Run + Express

**Best for:** portable container deployment and explicit cloud infrastructure. **Estimated complexity:** High.

The container listens on `PORT` and uses memory by default, so widgets reset when an instance restarts or scales. Use Cloud SQL for durable production storage; the app documents `DATABASE_URL` visibility but intentionally keeps the base container dependency-free.

## Local setup and tests

```bash
pnpm install
pnpm --filter cloud-run-container-express test
pnpm dev:cloudrun
```

Open `http://localhost:8080`. To test the container from the repository root:

```bash
docker build -f apps/cloud-run-container-express/Dockerfile -t dashboard-cloudrun .
docker run --rm -p 8080:8080 dashboard-cloudrun
```

## Environment

`PORT` is supplied by Cloud Run. Mock API keys, `DATABASE_URL`, and `CRON_SECRET` are optional. Store real secrets in Secret Manager and mount them as environment variables.

## Deploy

1. In Google Cloud Console, create/select a project and enable Cloud Run, Cloud Build, Artifact Registry, and Secret Manager APIs.
2. Authenticate: `gcloud auth login` and `gcloud config set project PROJECT_ID`.
3. From the repository root run `gcloud run deploy dynamic-dashboard --source . --region us-central1 --allow-unauthenticated --set-build-env-vars GOOGLE_BUILDABLE=apps/cloud-run-container-express`.
4. If source build cannot select the monorepo Dockerfile, use `gcloud builds submit --tag REGION-docker.pkg.dev/PROJECT/REPO/dashboard -f apps/cloud-run-container-express/Dockerfile .`, then deploy that image.
5. Configure secrets under **Cloud Run → Service → Edit & deploy new revision → Variables & secrets**.
6. Add Cloud SQL and its connector for durable widgets. Add IAM/IAP or app authentication before removing public demo access.
7. Use Cloud Scheduler with OIDC authentication to invoke refresh, and inspect Cloud Logging/Monitoring.

## Tradeoffs

Pros: portable OCI image, autoscaling, strong IAM/observability, arbitrary backend capability. Cons: the most infrastructure concepts, cold starts, external database setup, and less predictable cost. Memory storage is intentionally non-durable.
