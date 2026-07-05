import { createMemoryStore } from "@dashboard/shared";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

describe("Railway API", () => {
  it("returns health without Postgres", async () => {
    const response = await request(createApp(createMemoryStore())).get("/api/health").expect(200);
    expect(response.body).toMatchObject({ ok: true, stack: "railway-express-postgres" });
  });
});
