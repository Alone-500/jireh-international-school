import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";

/**
 * Creates the Express app with ONLY API routes (no static files, no Vite, no listen).
 * Used by:
 *  - server/_core/index.ts (local dev + `npm start` — adds static/Vite + listen on top)
 *  - api/index.ts (Vercel serverless function — Vercel serves static files itself)
 */
export function createApp() {
  const app = express();

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerStorageProxy(app);
  registerOAuthRoutes(app);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  return app;
}

export default createApp;
