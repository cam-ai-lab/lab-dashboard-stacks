"use client";

import type { Widget } from "@dashboard/shared";
import { useState } from "react";

export function Dashboard({ initialWidgets }: Readonly<{ initialWidgets: Widget[] }>) {
  const [widgets, setWidgets] = useState(initialWidgets);
  const [error, setError] = useState("");
  async function addWidget(formData: FormData) {
    setError("");
    const response = await fetch("/api/widgets", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData)) });
    const body = await response.json();
    if (!response.ok) { setError(body.error ?? "Unable to add widget"); return; }
    setWidgets((current) => [...current, body]);
  }
  async function refresh() {
    const response = await fetch("/api/refresh", { method: "POST" });
    if (response.ok) setWidgets(await response.json());
    else setError("Unable to refresh widgets");
  }
  return <main>
    <div className="grid">{widgets.map((widget) => <article className="card" key={widget.id}><p className="source">{widget.source}</p><h2>{widget.title}</h2><strong>{widget.value}</strong><small>Updated {widget.updatedAt}</small></article>)}</div>
    <div className="actions"><button type="button" onClick={refresh}>Refresh mock APIs</button><a href="/api/config">Config status</a></div>
    {error && <p role="alert">{error}</p>}
    <form action={addWidget}><input name="title" placeholder="Widget title" maxLength={120} required/><input name="value" placeholder="Value" maxLength={120} required/><input name="source" placeholder="Source" maxLength={120} required/><button>Add widget</button></form>
  </main>;
}
