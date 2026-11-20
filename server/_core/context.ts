import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { ENV } from "./env";

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "user";
};

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: AdminUser | null;
};

/**
 * Verifies a Supabase access token by asking Supabase who it belongs to.
 * The caller gets role=admin when the user's app_metadata.role is "admin"
 * (editable only from the Supabase dashboard or a service key — never by the
 * signed-in user), role=user otherwise, or null when the token is missing/invalid.
 */
async function verifySupabaseToken(token: string): Promise<AdminUser | null> {
  if (!ENV.supabaseUrl || !ENV.supabasePublishableKey) return null;

  try {
    const response = await fetch(`${ENV.supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: ENV.supabasePublishableKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      id?: string;
      email?: string;
      user_metadata?: { name?: string; full_name?: string };
      app_metadata?: { role?: string };
    };

    const email = String(data?.email ?? "").trim().toLowerCase();
    if (!email) return null;

    return {
      id: String(data?.id ?? email),
      email,
      name: data?.user_metadata?.name ?? data?.user_metadata?.full_name ?? null,
      role: data?.app_metadata?.role === "admin" ? "admin" : "user",
    };
  } catch {
    // Verification failed (network, bad response, etc.) — treat as signed out.
    return null;
  }
}

function extractBearerToken(req: CreateExpressContextOptions["req"]): string | null {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, value] = header.split(" ");
  if (!scheme || scheme.toLowerCase() !== "bearer" || !value) return null;
  return value.trim();
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  const token = extractBearerToken(opts.req);
  const user = token ? await verifySupabaseToken(token) : null;

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
