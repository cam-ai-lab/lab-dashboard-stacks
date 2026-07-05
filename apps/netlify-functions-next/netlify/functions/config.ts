import { environmentStatus } from "@dashboard/shared";

export default async function config(): Promise<Response> {
  return Response.json({ variables: environmentStatus(["MOCK_GITHUB_API_KEY", "MOCK_CALENDAR_API_KEY", "NETLIFY_BLOBS_CONTEXT", "CRON_SECRET"], process.env) });
}
