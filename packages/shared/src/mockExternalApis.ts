import type { Widget } from "./types.js";

const MOCK_VALUES: Readonly<Record<string, string>> = Object.freeze({
  "github-prs": "8 open",
  "build-status": "Passing",
  calendar: "4 events today",
  "api-latency": "176ms"
});

export async function refreshFromMockApis(
  widgets: readonly Widget[],
  now: Date = new Date()
): Promise<Widget[]> {
  await Promise.resolve();
  const updatedAt = now.toISOString();
  return widgets.map((widget) => ({
    ...widget,
    value: MOCK_VALUES[widget.id] ?? widget.value,
    updatedAt
  }));
}
