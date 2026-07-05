import {
  createMemoryStore,
  dashboardHtml,
  environmentStatus,
  refreshFromMockApis,
  validateNewWidget,
  type WidgetStore
} from "@dashboard/shared";
import express, { type Express } from "express";

export function createApp(store: WidgetStore = createMemoryStore()): Express {
  const app = express();
  app.use(express.json({ limit: "20kb" }));
  app.get("/", async (_request, response, next) => {
    try { response.type("html").send(dashboardHtml("Google Cloud Run + Express", await store.list())); }
    catch (error) { next(error); }
  });
  app.get("/api/health", (_request, response) => response.json({ ok: true, stack: "cloud-run-container-express", time: new Date().toISOString() }));
  app.get("/api/config", (_request, response) => response.json({ variables: environmentStatus(["MOCK_GITHUB_API_KEY", "MOCK_CALENDAR_API_KEY", "DATABASE_URL", "CRON_SECRET"], process.env) }));
  app.get("/api/widgets", async (_request, response, next) => {
    try { response.json(await store.list()); } catch (error) { next(error); }
  });
  app.post("/api/widgets", async (request, response, next) => {
    try { response.status(201).json(await store.add(validateNewWidget(request.body))); }
    catch (error) { error instanceof Error && error.message.includes("required") ? response.status(400).json({ error: error.message }) : next(error); }
  });
  app.post("/api/refresh", async (_request, response, next) => {
    try { response.json(await store.replace(await refreshFromMockApis(await store.list()))); }
    catch (error) { next(error); }
  });
  app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    console.error(error);
    response.status(500).json({ error: "Internal server error" });
  });
  return app;
}
