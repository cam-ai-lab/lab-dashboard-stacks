import { createMemoryStore } from "@dashboard/shared";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

describe("Render API", () => {
  it("returns health without Postgres", async () => {
    const response = await request(createApp(createMemoryStore())).get("/api/health").expect(200);
    expect(response.body).toMatchObject({ ok: true, stack: "render-express-postgres" });
  });
  it("rejects invalid widgets", async () => {
    await request(createApp(createMemoryStore())).post("/api/widgets").send({ title: "" }).expect(400);
  });
});
