import { describe, expect, it } from "vitest";
import {
  SEED_WIDGETS,
  cloneWidgets,
  environmentStatus,
  refreshFromMockApis,
  validateNewWidget
} from "../src/index.js";

describe("shared widgets", () => {
  it("contains the comparable seed data", () => {
    expect(SEED_WIDGETS.map(({ title, value }) => ({ title, value }))).toEqual([
      { title: "GitHub PRs", value: "7 open" },
      { title: "Build status", value: "Passing" },
      { title: "Calendar", value: "3 events today" },
      { title: "API latency", value: "184ms" }
    ]);
  });

  it("clones rather than exposing mutable seed objects", () => {
    const clone = cloneWidgets();
    clone[0] = { ...clone[0]!, value: "changed" };
    expect(SEED_WIDGETS[0]?.value).toBe("7 open");
  });

  it("refreshes known widgets at a deterministic time", async () => {
    const widgets = await refreshFromMockApis(SEED_WIDGETS, new Date("2025-02-03T04:05:06Z"));
    expect(widgets[0]?.value).toBe("8 open");
    expect(widgets.every((widget) => widget.updatedAt === "2025-02-03T04:05:06.000Z")).toBe(true);
  });

  it("validates input and never reveals environment values", () => {
    expect(validateNewWidget({ title: " Notes ", value: "2", source: "Local" })).toEqual({
      title: "Notes", value: "2", source: "Local"
    });
    expect(() => validateNewWidget({ title: "", value: "2", source: "Local" })).toThrow("title is required");
    expect(environmentStatus(["SECRET", "MISSING"], { SECRET: "private" })).toEqual([
      { name: "SECRET", present: true },
      { name: "MISSING", present: false }
    ]);
  });
});
