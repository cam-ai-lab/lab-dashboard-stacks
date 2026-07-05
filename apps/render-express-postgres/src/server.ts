import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3005);
createApp().listen(port, "0.0.0.0", () => console.log(`Render dashboard listening on ${port}`));
