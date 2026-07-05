import { onRequest } from "firebase-functions/v2/https";
import { createApp } from "./app.js";
import { createStore } from "./store.js";

export const api = onRequest({ cors: false }, createApp(createStore(true)));
