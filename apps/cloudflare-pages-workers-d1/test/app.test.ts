import { describe, expect, it } from "vitest";
import { app } from "../src/index";

describe("Cloudflare worker", () => {
  it("returns health without D1", async () => {
    const response = await app.request("/api/health", {}, {});
    expect(await response.json()).toMatchObject({ ok: true, stack: "cloudflare-pages-workers-d1" });
  });
});
