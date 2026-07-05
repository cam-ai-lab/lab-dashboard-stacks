import { dashboardHtml, environmentStatus, refreshFromMockApis, validateNewWidget } from "@dashboard/shared";
import { Hono } from "hono";
import { createStore, type Bindings } from "./store";

export const app = new Hono<{ Bindings: Bindings }>();
app.get("/", async (context) => context.html(dashboardHtml("Cloudflare Workers + Hono + D1", await createStore(context.env.DB).list())));
app.get("/api/health", (context) => context.json({ ok: true, stack: "cloudflare-pages-workers-d1", time: new Date().toISOString() }));
app.get("/api/config", (context) => context.json({ variables: environmentStatus(["DB", "MOCK_GITHUB_API_KEY", "MOCK_CALENDAR_API_KEY", "CRON_SECRET"], { DB: context.env.DB ? "bound" : undefined, MOCK_GITHUB_API_KEY: context.env.MOCK_GITHUB_API_KEY, MOCK_CALENDAR_API_KEY: context.env.MOCK_CALENDAR_API_KEY, CRON_SECRET: context.env.CRON_SECRET }) }));
app.get("/api/widgets", async (context) => context.json(await createStore(context.env.DB).list()));
app.post("/api/widgets", async (context) => {
  try { return context.json(await createStore(context.env.DB).add(validateNewWidget(await context.req.json())), 201); }
  catch (error) { return context.json({ error: error instanceof Error ? error.message : "Invalid request" }, 400); }
});
app.post("/api/refresh", async (context) => {
  const store = createStore(context.env.DB);
  return context.json(await store.replace(await refreshFromMockApis(await store.list())));
});
app.notFound((context) => context.json({ error: "Not found" }, 404));

export default app;
