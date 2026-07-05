import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3006);
createApp().listen(port, "0.0.0.0", () => console.log(`Railway dashboard listening on ${port}`));
