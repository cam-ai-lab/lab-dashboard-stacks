import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

describe("Cloud Run API", () => {
  it("returns health", async () => {
    const response = await request(createApp()).get("/api/health").expect(200);
    expect(response.body).toMatchObject({ ok: true, stack: "cloud-run-container-express" });
    expect(new Date(response.body.time).toISOString()).toBe(response.body.time);
  });

  it("adds and refreshes widgets", async () => {
    const app = createApp();
    await request(app).post("/api/widgets").send({ title: "Notes", value: "2", source: "Local" }).expect(201);
    const response = await request(app).post("/api/refresh").expect(200);
    expect(response.body).toHaveLength(5);
  });
});
