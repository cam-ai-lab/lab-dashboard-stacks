import { createMemoryStore } from "@dashboard/shared";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

describe("Firebase function", () => {
  it("returns health without Firebase credentials", async () => {
    const response = await request(createApp(createMemoryStore())).get("/health").expect(200);
    expect(response.body).toMatchObject({ ok: true, stack: "firebase-hosting-functions" });
  });
});
