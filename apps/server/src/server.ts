import { createApp } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";

connectDb().then((connected) => {
  createApp().listen(env.port, () => {
    console.log(`NexaFlow API running on http://localhost:${env.port} (${connected ? "MongoDB" : "sample-data"} mode)`);
  });
});
