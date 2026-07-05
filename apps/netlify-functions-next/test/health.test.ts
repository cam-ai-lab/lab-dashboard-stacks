import { describe, expect, it } from "vitest";
import health from "../netlify/functions/health";

describe("Netlify health function", () => {
  it("returns health", async () => {
    const response = await health();
    expect(await response.json()).toMatchObject({ ok: true, stack: "netlify-functions-next" });
  });
});
