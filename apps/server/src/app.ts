import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import resourceRoutes from "./routes/resources.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errors.js";

export const createApp = () => {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(rateLimit({ windowMs: 60_000, limit: 180 }));
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("tiny"));
  app.get("/health", (_req, res) => res.json({ status: "ok", mode: env.mongoUri ? "mongodb" : "sample-data" }));
  app.use("/api/auth", authRoutes);
  app.use("/api", resourceRoutes);
  app.use((_req, res) => res.status(404).json({ success: false, error: { message: "Route not found", code: "NOT_FOUND" } }));
  app.use(errorHandler);
  return app;
};
