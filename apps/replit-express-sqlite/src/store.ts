import { SEED_WIDGETS, type NewWidget, type Widget, type WidgetStore } from "@dashboard/shared";
import Database from "better-sqlite3";

export function createSqliteStore(filename = process.env.SQLITE_PATH ?? "dashboard.sqlite"): WidgetStore {
  const database = new Database(filename);
  database.pragma("journal_mode = WAL");
  database.exec("CREATE TABLE IF NOT EXISTS widgets(id TEXT PRIMARY KEY,title TEXT NOT NULL,value TEXT NOT NULL,source TEXT NOT NULL,updated_at TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");
  const seed = database.prepare("INSERT OR IGNORE INTO widgets(id,title,value,source,updated_at) VALUES(?,?,?,?,?)");
  database.transaction(() => SEED_WIDGETS.forEach((widget) => seed.run(widget.id, widget.title, widget.value, widget.source, widget.updatedAt)))();
  const rowToWidget = (row: unknown): Widget => {
    const value = row as Record<string, string>;
    return { id: value.id!, title: value.title!, value: value.value!, source: value.source!, updatedAt: value.updated_at! };
  };
  return {
    async list() { return (database.prepare("SELECT id,title,value,source,updated_at FROM widgets ORDER BY created_at").all() as unknown[]).map(rowToWidget); },
    async add(input: NewWidget) {
      const widget: Widget = { id: `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${crypto.randomUUID().slice(0, 8)}`, ...input, updatedAt: new Date().toISOString() };
      database.prepare("INSERT INTO widgets(id,title,value,source,updated_at) VALUES(?,?,?,?,?)").run(widget.id, widget.title, widget.value, widget.source, widget.updatedAt);
      return widget;
    },
    async replace(widgets) {
      const update = database.prepare("UPDATE widgets SET value=?,updated_at=? WHERE id=?");
      database.transaction(() => widgets.forEach((widget) => update.run(widget.value, widget.updatedAt, widget.id)))();
      return this.list();
    }
  };
}
