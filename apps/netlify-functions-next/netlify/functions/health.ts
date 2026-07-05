export default async function health(): Promise<Response> {
  return Response.json({ ok: true, stack: "netlify-functions-next", time: new Date().toISOString() });
}
