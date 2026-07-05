import { Dashboard } from "./dashboard";
import { getStore } from "../lib/store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const widgets = await getStore().list();
  return <><header><div><h1>Dynamic Dashboard Stack Lab</h1><p>Polished personal dashboard default</p></div><span className="badge">Vercel + Next.js + Supabase</span></header><Dashboard initialWidgets={widgets}/></>;
}
