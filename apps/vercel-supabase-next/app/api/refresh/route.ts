import { refreshFromMockApis } from "@dashboard/shared";
import { getStore } from "../../../lib/store";

export async function POST(): Promise<Response> {
  const store = getStore();
  return Response.json(await store.replace(await refreshFromMockApis(await store.list())));
}
