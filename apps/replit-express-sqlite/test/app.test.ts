import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { createSqliteStore } from "../src/store.js";

describe("Replit API", () => {
  it("persists widgets in SQLite", async () => {
    const app = createApp(createSqliteStore(":memory:"));
    const health = await request(app).get("/api/health").expect(200);
    expect(health.body.stack).toBe("replit-express-sqlite");
    await request(app).post("/api/widgets").send({ title: "Notes", value: "2", source: "Local" }).expect(201);
    const widgets = await request(app).get("/api/widgets").expect(200);
    expect(widgets.body).toHaveLength(5);
  });
});
