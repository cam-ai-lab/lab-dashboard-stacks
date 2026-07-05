export function GET(): Response {
  return Response.json({ ok: true, stack: "vercel-supabase-next", time: new Date().toISOString() });
}
