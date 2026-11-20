// Vercel serverless entry point.
// Vercel routes /api/* and /manus-storage/* here (see vercel.json rewrites).
// The Express app handles /api/trpc, /api/oauth/callback, and /manus-storage/*.
// Static frontend files are served by Vercel directly from dist/public.
import { createApp } from "../server/_core/app";

const app = createApp();

export default app;
