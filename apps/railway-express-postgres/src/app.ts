import { dashboardHtml, environmentStatus, refreshFromMockApis, validateNewWidget, type WidgetStore } from "@dashboard/shared";
import express, { type Express } from "express";
import { createStore } from "./store.js";

export function createApp(store: WidgetStore = createStore()): Express {
  const app = express();
  app.use(express.json({ limit: "20kb" }));
  app.get("/", async (_request, response, next) => { try { response.type("html").send(dashboardHtml("Railway + Express + Postgres", await store.list())); } catch (error) { next(error); } });
  app.get("/api/health", (_request, response) => response.json({ ok: true, stack: "railway-express-postgres", time: new Date().toISOString() }));
  app.get("/api/config", (_request, response) => response.json({ variables: environmentStatus(["DATABASE_URL", "MOCK_GITHUB_API_KEY", "MOCK_CALENDAR_API_KEY", "CRON_SECRET"], process.env) }));
  app.get("/api/widgets", async (_request, response, next) => { try { response.json(await store.list()); } catch (error) { next(error); } });
  app.post("/api/widgets", async (request, response, next) => { try { response.status(201).json(await store.add(validateNewWidget(request.body))); } catch (error) { error instanceof Error && (error.message.includes("required") || error.message.includes("characters")) ? response.status(400).json({ error: error.message }) : next(error); } });
  app.post("/api/refresh", async (_request, response, next) => { try { response.json(await store.replace(await refreshFromMockApis(await store.list()))); } catch (error) { next(error); } });
  app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => { console.error(error); response.status(500).json({ error: "Internal server error" }); });
  return app;
}
