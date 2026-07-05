import type { Widget } from "./types.js";

export function dashboardHtml(stack: string, widgets: readonly Widget[]): string {
  const cards = widgets.map((widget) => `
    <article>
      <p class="source">${escapeHtml(widget.source)}</p>
      <h2>${escapeHtml(widget.title)}</h2>
      <strong>${escapeHtml(widget.value)}</strong>
      <small>Updated ${escapeHtml(widget.updatedAt)}</small>
    </article>`).join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Dynamic Dashboard Stack Lab</title><style>
:root{font-family:Inter,system-ui,sans-serif;color:#172033;background:#f4f7fb}body{max-width:1050px;margin:auto;padding:2rem}
header{display:flex;justify-content:space-between;gap:1rem;align-items:center}.badge{background:#dce8ff;padding:.45rem .8rem;border-radius:999px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1rem;margin:2rem 0}article,form{background:white;border:1px solid #dfe5ef;border-radius:14px;padding:1.2rem;box-shadow:0 6px 18px #1c31500d}
article h2{font-size:1rem;margin:.25rem 0}article strong{font-size:1.7rem;display:block;margin:.8rem 0}.source,small{color:#647089}
form{display:grid;grid-template-columns:repeat(3,1fr) auto;gap:.75rem}input,button{font:inherit;padding:.75rem;border-radius:8px;border:1px solid #b9c3d2}
button{background:#155eef;color:white;border:0;cursor:pointer}.actions{display:flex;gap:.75rem;margin-bottom:1rem}@media(max-width:700px){form{grid-template-columns:1fr}header{align-items:flex-start;flex-direction:column}}
</style></head><body><header><div><h1>Dynamic Dashboard Stack Lab</h1><p>Comparable dynamic hosting experiment</p></div><span class="badge">${escapeHtml(stack)}</span></header>
<main><div class="grid" id="widgets">${cards}</div><div class="actions"><button id="refresh" type="button">Refresh mock APIs</button><a href="/api/config">Config status</a></div>
<form id="add-widget"><input name="title" placeholder="Widget title" required maxlength="120"><input name="value" placeholder="Value" required maxlength="120"><input name="source" placeholder="Source" required maxlength="120"><button>Add widget</button></form></main>
<script>
const form=document.querySelector("#add-widget");form.addEventListener("submit",async(event)=>{event.preventDefault();const data=Object.fromEntries(new FormData(form));const response=await fetch("/api/widgets",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});if(!response.ok){alert((await response.json()).error);return}location.reload()});
document.querySelector("#refresh").addEventListener("click",async()=>{const response=await fetch("/api/refresh",{method:"POST"});if(!response.ok){alert("Refresh failed");return}location.reload()});
</script></body></html>`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character] ?? character);
}
