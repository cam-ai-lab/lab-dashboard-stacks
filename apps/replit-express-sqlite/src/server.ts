import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3008);
createApp().listen(port, "0.0.0.0", () => console.log(`Replit dashboard listening on ${port}`));
