import { refreshFromMockApis } from "@dashboard/shared";
import { store } from "../store";

export default async function refresh(request: Request): Promise<Response> {
  if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });
  return Response.json(await store.replace(await refreshFromMockApis(await store.list())));
}
