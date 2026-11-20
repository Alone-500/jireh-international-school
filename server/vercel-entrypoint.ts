// Source of the committed serverless bundle api/index.js.
// Rebuild it any time the server changes with (from repo root):
//   pnpm exec esbuild server/vercel-entrypoint.ts --platform=node --packages=external --bundle --format=esm --outfile="api/index.js"
//
// WHY THIS SHAPE:
// Plain Vercel projects (not Next.js) do not support dynamic filenames in
// /api — only literal file paths become routes. So /api/trpc/<anything> is
// funneled in by vercel.json:  { source: "/api/:path*", destination: "/api/index?__apiPath=:path*" }
// The original query string (e.g. tRPC's ?input=...&batch=1) is preserved by
// the rewrite, so here we only rebuild the pathname for Express.
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

function toExpressUrl(rawUrl: string | undefined): string {
  try {
    const url = new URL(rawUrl ?? "/", "http://localhost");
    const apiPath = url.searchParams.get("__apiPath");
    if (!apiPath) return rawUrl ?? "/";
    url.searchParams.delete("__apiPath");
    const rest = url.searchParams.toString();
    return "/api/" + apiPath + (rest ? "?" + rest : "");
  } catch {
    return "/";
  }
}

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (bootError) {
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end(`Server error: ${bootError.name}: ${bootError.message}`);
    return;
  }
  req.url = toExpressUrl(req.url);
  return app!(req, res);
}
