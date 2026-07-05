import { SEED_WIDGETS, createMemoryStore, type NewWidget, type Widget, type WidgetStore } from "@dashboard/shared";
import pg from "pg";

export function createStore(databaseUrl = process.env.DATABASE_URL): WidgetStore {
  if (!databaseUrl) return createMemoryStore();
  const pool = new pg.Pool({ connectionString: databaseUrl, ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined });
  let initialized: Promise<void> | undefined;
  const initialize = () => initialized ??= seedDatabase(pool);
  return {
    async list() {
      await initialize();
      const result = await pool.query<Widget>('SELECT id, title, value, source, updated_at AS "updatedAt" FROM widgets ORDER BY created_at');
      return result.rows.map((row) => ({ ...row, updatedAt: new Date(row.updatedAt).toISOString() }));
    },
    async add(input: NewWidget) {
      await initialize();
      const id = `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${crypto.randomUUID().slice(0, 8)}`;
      const result = await pool.query<Widget>('INSERT INTO widgets (id,title,value,source) VALUES ($1,$2,$3,$4) RETURNING id,title,value,source,updated_at AS "updatedAt"', [id, input.title, input.value, input.source]);
      const widget = result.rows[0]!;
      return { ...widget, updatedAt: new Date(widget.updatedAt).toISOString() };
    },
    async replace(widgets) {
      await initialize();
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        for (const widget of widgets) await client.query("UPDATE widgets SET value=$1, updated_at=$2 WHERE id=$3", [widget.value, widget.updatedAt, widget.id]);
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally { client.release(); }
      return this.list();
    }
  };
}

async function seedDatabase(pool: pg.Pool): Promise<void> {
  await pool.query("CREATE TABLE IF NOT EXISTS widgets (id text PRIMARY KEY,title text NOT NULL,value text NOT NULL,source text NOT NULL,updated_at timestamptz NOT NULL DEFAULT now(),created_at timestamptz NOT NULL DEFAULT now())");
  for (const widget of SEED_WIDGETS) {
    await pool.query("INSERT INTO widgets (id,title,value,source,updated_at) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING", [widget.id, widget.title, widget.value, widget.source, widget.updatedAt]);
  }
}
