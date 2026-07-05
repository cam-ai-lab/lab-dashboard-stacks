import { SEED_WIDGETS, createMemoryStore, type NewWidget, type Widget, type WidgetStore } from "@dashboard/shared";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export function createStore(useFirestore = process.env.USE_FIRESTORE === "true"): WidgetStore {
  if (!useFirestore) return createMemoryStore();
  if (getApps().length === 0) initializeApp();
  const collection = getFirestore().collection("widgets");
  return {
    async list() {
      let snapshot = await collection.orderBy("createdAt").get();
      if (snapshot.empty) {
        const batch = getFirestore().batch();
        SEED_WIDGETS.forEach((widget) => batch.set(collection.doc(widget.id), { ...widget, createdAt: widget.updatedAt }));
        await batch.commit();
        snapshot = await collection.orderBy("createdAt").get();
      }
      return snapshot.docs.map((document) => document.data() as Widget);
    },
    async add(input: NewWidget) {
      const widget: Widget = { id: `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${crypto.randomUUID().slice(0, 8)}`, ...input, updatedAt: new Date().toISOString() };
      await collection.doc(widget.id).set({ ...widget, createdAt: widget.updatedAt });
      return widget;
    },
    async replace(widgets) {
      const batch = getFirestore().batch();
      widgets.forEach((widget) => batch.set(collection.doc(widget.id), { ...widget }, { merge: true }));
      await batch.commit();
      return widgets.map((widget) => ({ ...widget }));
    }
  };
}
