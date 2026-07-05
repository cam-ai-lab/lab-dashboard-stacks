import type { NewWidget, Widget, WidgetStore } from "./types.js";

const SEEDED_AT = "2025-01-01T00:00:00.000Z";

const seedWidgets: Widget[] = [
  { id: "github-prs", title: "GitHub PRs", value: "7 open", source: "GitHub (mock)", updatedAt: SEEDED_AT },
  { id: "build-status", title: "Build status", value: "Passing", source: "CI (mock)", updatedAt: SEEDED_AT },
  { id: "calendar", title: "Calendar", value: "3 events today", source: "Calendar (mock)", updatedAt: SEEDED_AT },
  { id: "api-latency", title: "API latency", value: "184ms", source: "Monitoring (mock)", updatedAt: SEEDED_AT }
];

export const SEED_WIDGETS: readonly Widget[] = Object.freeze(
  seedWidgets.map((widget) => Object.freeze(widget))
);

export function cloneWidgets(widgets: readonly Widget[] = SEED_WIDGETS): Widget[] {
  return widgets.map((widget) => ({ ...widget }));
}

export function createMemoryStore(initial: readonly Widget[] = SEED_WIDGETS): WidgetStore {
  let widgets = cloneWidgets(initial);
  return {
    async list() {
      return cloneWidgets(widgets);
    },
    async add(input) {
      const widget: Widget = {
        id: `${slugify(input.title)}-${crypto.randomUUID().slice(0, 8)}`,
        ...input,
        updatedAt: new Date().toISOString()
      };
      widgets = [...widgets, widget];
      return { ...widget };
    },
    async replace(nextWidgets) {
      widgets = cloneWidgets(nextWidgets);
      return cloneWidgets(widgets);
    }
  };
}

export function validateNewWidget(value: unknown): NewWidget {
  if (!value || typeof value !== "object") {
    throw new Error("Request body must be an object");
  }
  const record = value as Record<string, unknown>;
  const title = requiredString(record.title, "title");
  const widgetValue = requiredString(record.value, "value");
  const source = requiredString(record.source, "source");
  return { title, value: widgetValue, source };
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required`);
  }
  if (value.length > 120) {
    throw new Error(`${field} must be 120 characters or fewer`);
  }
  return value.trim();
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "widget";
}
