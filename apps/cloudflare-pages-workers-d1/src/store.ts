import { SEED_WIDGETS, createMemoryStore, type NewWidget, type Widget, type WidgetStore } from "@dashboard/shared";

export interface Bindings { DB?: D1Database; MOCK_GITHUB_API_KEY?: string; MOCK_CALENDAR_API_KEY?: string; CRON_SECRET?: string; }
const fallback = createMemoryStore();

export function createStore(database?: D1Database): WidgetStore {
  if (!database) return fallback;
  return {
    async list() {
      await seed(database);
      const result = await database.prepare("SELECT id,title,value,source,updated_at AS updatedAt FROM widgets ORDER BY created_at").all<Widget>();
      return result.results;
    },
    async add(input: NewWidget) {
      const widget: Widget = { id: `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${crypto.randomUUID().slice(0, 8)}`, ...input, updatedAt: new Date().toISOString() };
      await database.prepare("INSERT INTO widgets(id,title,value,source,updated_at) VALUES(?,?,?,?,?)").bind(widget.id, widget.title, widget.value, widget.source, widget.updatedAt).run();
      return widget;
    },
    async replace(widgets) {
      await database.batch(widgets.map((widget) => database.prepare("UPDATE widgets SET value=?,updated_at=? WHERE id=?").bind(widget.value, widget.updatedAt, widget.id)));
      return this.list();
    }
  };
}

async function seed(database: D1Database): Promise<void> {
  await database.prepare("CREATE TABLE IF NOT EXISTS widgets(id TEXT PRIMARY KEY,title TEXT NOT NULL,value TEXT NOT NULL,source TEXT NOT NULL,updated_at TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
  await database.batch(SEED_WIDGETS.map((widget) => database.prepare("INSERT OR IGNORE INTO widgets(id,title,value,source,updated_at) VALUES(?,?,?,?,?)").bind(widget.id, widget.title, widget.value, widget.source, widget.updatedAt)));
}
