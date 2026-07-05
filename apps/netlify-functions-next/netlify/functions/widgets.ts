import { validateNewWidget } from "@dashboard/shared";
import { store } from "../store";

export default async function widgets(request: Request): Promise<Response> {
  if (request.method === "GET") return Response.json(await store.list());
  if (request.method === "POST") {
    try { return Response.json(await store.add(validateNewWidget(await request.json())), { status: 201 }); }
    catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Invalid request" }, { status: 400 }); }
  }
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
