import { describe, expect, it } from "vitest";
import { GET } from "../app/api/health/route";

describe("Vercel health route", () => {
  it("returns stack health", async () => {
    const response = GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, stack: "vercel-supabase-next" });
  });
});
