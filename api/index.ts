// Vercel serverless entry point.
// Wraps the Express app so boot/import failures return a readable error instead of a blank 500.
// Vercel routes /api/* here (see vercel.json rewrites).

let cachedApp: unknown;

async function getApp() {
  if (!cachedApp) {
    const { createApp } = await import("../server/_core/app");
    cachedApp = createApp();
  }
  return cachedApp as (req: unknown, res: unknown) => void;
}

export default async function handler(req: any, res: any) {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (error) {
    const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    console.error("[api] boot/handler error:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    res.end(`Server error: ${message}`);
  }
}
