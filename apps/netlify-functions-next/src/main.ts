import type { Widget } from "@dashboard/shared";

const widgets = document.querySelector<HTMLDivElement>("#widgets")!;
async function render(): Promise<void> {
  const response = await fetch("/api/widgets");
  const data = await response.json() as Widget[];
  widgets.replaceChildren(...data.map((widget) => {
    const article = document.createElement("article");
    article.innerHTML = `<p></p><h2></h2><strong></strong><small></small>`;
    article.querySelector("p")!.textContent = widget.source;
    article.querySelector("h2")!.textContent = widget.title;
    article.querySelector("strong")!.textContent = widget.value;
    article.querySelector("small")!.textContent = `Updated ${widget.updatedAt}`;
    return article;
  }));
}
document.querySelector("#form")!.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  await fetch("/api/widgets", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
  form.reset();
  await render();
});
document.querySelector("#refresh")!.addEventListener("click", async () => { await fetch("/api/refresh", { method: "POST" }); await render(); });
void render();
