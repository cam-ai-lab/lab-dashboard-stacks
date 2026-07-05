import { validateNewWidget } from "@dashboard/shared";
import { getStore } from "../../../lib/store";

export async function GET(): Promise<Response> {
  return Response.json(await getStore().list());
}

export async function POST(request: Request): Promise<Response> {
  try { return Response.json(await getStore().add(validateNewWidget(await request.json())), { status: 201 }); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Invalid request" }, { status: 400 }); }
}
