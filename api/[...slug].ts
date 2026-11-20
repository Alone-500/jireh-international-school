// Vercel zero-config catch-all function: automatically routes EVERY /api/*
// path to this handler, preserving the original request path (no rewrites needed).
//
// HOW THIS DEPLOYS:
// This file's static import of ../server/_core/app cannot be traced by Vercel's
// zero-config builder (the function crashed with "Cannot find module"), so the
// committed api/[...slug].js next to this file is the actual function — built
// from this file with esbuild, bundling ALL local code and leaving npm
// packages external (they are installed from package.json on Vercel).
import type { IncomingMessage, ServerResponse } from "node:http";
import express from "express";
import { createApp } from "../server/_core/app";

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
