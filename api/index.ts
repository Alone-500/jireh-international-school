// Vercel serverless entry point.
// The vercel.json build also bundles this file (esbuild, packages external) into
// api/index.js so the serverless function is fully self-contained at runtime.
// Vercel routes /api/* here (see vercel.json rewrites).
import { createApp } from "../server/_core/app";

const app = createApp();

export default app;
