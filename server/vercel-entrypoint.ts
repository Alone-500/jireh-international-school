// Source of the committed serverless bundle api/[...slug].js.
// Rebuild it any time the server changes with (from repo root):
//   pnpm exec esbuild server/vercel-entrypoint.ts --platform=node --packages=external --bundle --format=esm --outfile="api/[...slug].js"
//
// Why a committed bundle: Vercel's zero-config builder could not trace
// ../server/_core/app (function crashed with "Cannot find module"), so the
// api/[...slug].js committed to the repo IS the function — all local code
// is bundled into it; npm packages stay external and come from package.json.
import type { IncomingMessage, ServerResponse } from "node:http";
import express from "express";
import { createApp } from "./_core/app";

let app: express.Express | null = null;
let bootError: Error | null = null;
try {
  app = createApp();
} catch (e) {
  console.error("[api] boot failed:", e);
  bootError = e as Error;
}

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (bootError) {
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end(`Server error: ${bootError.name}: ${bootError.message}`);
    return;
  }
  return app!(req, res);
}
