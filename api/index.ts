// Vercel serverless entry point.
// Vercel routes /api/* here (see vercel.json rewrites). The Express app handles /api/trpc.
// Static frontend files are served by Vercel directly from dist/public.
import { createApp } from "../server/_core/app";

const app = createApp();

export default app;
