import { SEED_WIDGETS, createMemoryStore, type NewWidget, type Widget, type WidgetStore } from "@dashboard/shared";
import { createClient } from "@supabase/supabase-js";

const memoryStore = createMemoryStore();

function supabaseStore(): WidgetStore | undefined {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const userId = process.env.DASHBOARD_USER_ID;
  if (!url || !key || !userId) return undefined;
  const client = createClient(url, key, { auth: { persistSession: false } });
  return {
    async list() {
      const { data, error } = await client.from("widgets").select("id,title,value,source,updated_at").eq("user_id", userId).order("created_at");
      if (error) throw error;
      if (data.length === 0) {
        const seeded = SEED_WIDGETS.map((widget) => ({ ...widget, user_id: userId, updated_at: widget.updatedAt }));
        const { error: seedError } = await client.from("widgets").upsert(seeded.map(({ updatedAt: _updatedAt, ...widget }) => widget));
        if (seedError) throw seedError;
        return SEED_WIDGETS.map((widget) => ({ ...widget }));
      }
      return data.map((row) => ({ id: row.id, title: row.title, value: row.value, source: row.source, updatedAt: row.updated_at }));
    },
    async add(input: NewWidget) {
      const widget: Widget = { id: `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${crypto.randomUUID().slice(0, 8)}`, ...input, updatedAt: new Date().toISOString() };
      const { error } = await client.from("widgets").insert({ id: widget.id, title: widget.title, value: widget.value, source: widget.source, updated_at: widget.updatedAt, user_id: userId });
      if (error) throw error;
      return widget;
    },
    async replace(widgets) {
      const rows = widgets.map((widget) => ({ id: widget.id, title: widget.title, value: widget.value, source: widget.source, updated_at: widget.updatedAt, user_id: userId }));
      const { error } = await client.from("widgets").upsert(rows);
      if (error) throw error;
      return widgets.map((widget) => ({ ...widget }));
    }
  };
}

export function getStore(): WidgetStore {
  return supabaseStore() ?? memoryStore;
}
